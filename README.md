# TeaCoder - фронтенд

Next.js 16 (App Router), React 19, TanStack Query 5, axios, react-hook-form + zod, Tailwind 3 + shadcn/ui. Клиент API генерируется orval из OpenAPI-спеки бэкенда.

## Запуск

```bash
cp .env.example .env
bun install
bun run dev
```

| Скрипт                            | Что делает                                 |
| --------------------------------- | ------------------------------------------ |
| `bun run dev` / `build` / `start` | Next.js                                    |
| `bun run generate`                | перегенерировать клиент API в `generated/` |
| `bun run lint`                    | `tsc --noEmit` + `prettier --check`        |
| `bun run format`                  | `prettier --write`                         |

## Переменные окружения

| Переменная                                                                             | Зачем                                                                    |
| -------------------------------------------------------------------------------------- | ------------------------------------------------------------------------ |
| `NEXT_PUBLIC_API_URL`                                                                  | адрес API. Бэкенд должен разрешить origin сайта в `CORS_ORIGIN`          |
| `NEXT_PUBLIC_APP_URL`                                                                  | адрес сайта (SEO, sitemap)                                               |
| `NEXT_PUBLIC_SUPPORT_EMAIL`, `NEXT_PUBLIC_OWNER_NAME`, `NEXT_PUBLIC_OWNER_INN`              | владелец сайта: почта поддержки, ФИО и ИНН в документах                  |
| `OPENAPI_URL`                                                                          | откуда orval читает спеку: URL (`{API}/spec.json`) или путь к файлу      |
| `NEXT_PUBLIC_FPJS_API_KEY`, `NEXT_PUBLIC_FPJS_ENDPOINT`                                | Fingerprint Pro; пусто — заголовок `X-Fingerprint-Event` не отправляется |
| `NEXT_PUBLIC_YANDEX_METRIKA_ID` | Яндекс Метрика; пусто — аналитика выключена                                    |

Капча (Turnstile / Yandex SmartCaptcha / нет), соцсети, способы оплаты и адрес файлового хранилища приходят из `GET /` и в env не задаются.

## Сборка в Docker

Создайте `.env` в корне проекта из `.env.example` и заполните значениями для продакшена перед сборкой:

```bash
docker build -t teacoder-web .
docker run --rm -p 3000:3000 teacoder-web
```

Dockerfile передаёт корневой `.env` в `next build`. Без файла сборка завершится с ошибкой. Не исключайте `.env` в `.dockerignore` и не задавайте пустые `NEXT_PUBLIC_*` через `ENV` в Dockerfile: они перекрывают значения из файла. Файлы `.env.local` и `.env.production*`, если присутствуют в контексте сборки, также могут перекрывать `.env` по правилам Next.js.

Значения `NEXT_PUBLIC_*` встраиваются в клиентский код при сборке. После изменения `.env` пересоберите образ; передача `--env-file` только при `docker run` эти значения не изменит. Не храните секреты в `NEXT_PUBLIC_*`.

## Клиент API

- `orval.config.ts` → `generated/api.ts` (функции + хуки TanStack Query) и `generated/model/*` (типы). Руками не править, сгенерированное коммитится.
- Имена — из маршрута: `GET /users/@me` → `useGetUsersMeQuery` / `getUsersMeQuery`, `POST /auth/login` → `usePostAuthLoginMutation`.
- Все запросы идут через мутатор `src/lib/api/client.ts`. В компонентах — только сгенерированные хуки, в серверных компонентах — сгенерированные функции (без токена).
- Ошибки API — `{ status, messages }` на английском. Русский текст даёт `getErrorMessage(error, fallback)` из `src/lib/api/errors.ts`; это единственное место, где разбираются тексты ошибок (до появления машинных кодов).

## Авторизация

- **Access-токен** (JWT, ~15 мин) хранится только в памяти (`src/lib/auth/token.ts`) и уходит в `Authorization: Bearer`.
- **Refresh-токен** — httpOnly-cookie `tc_refresh` на домене API; фронт его не видит. `POST /auth/refresh` с `withCredentials`.
- Refresh одноразовый, повторное использование завершает сессию. Поэтому обновление идёт по одному:
    - внутри вкладки — один общий промис;
    - между вкладками — `navigator.locks` (`tc-refresh`), новый токен раздаётся через `BroadcastChannel('tc-auth')`. Вкладка, дождавшаяся лока, берёт уже разосланный токен и сама не обновляет.
- На `401` с ошибкой токена клиент делает один refresh и повторяет запрос. Другие `401` (неверный пароль, истёкший `mfaToken`) не трогаются.
- **Маркер `tc_session=1`** — не-httpOnly cookie на домене сайта, без секрета. Ставится при входе/refresh, снимается при выходе/провале refresh. По нему `src/proxy.ts` делает UX-редиректы, а корневой layout решает, восстанавливать ли сессию при старте. Настоящая проверка — refresh на клиенте.
- Вход (пароль, код из письма, соцсеть, ключ доступа, MFA) заканчивается в `useCompleteSignIn` (`src/lib/auth/use-sign-in.ts`): токен → уведомление об автопривязке соцсети → `redirectTo`. Если нужен второй фактор — `MfaForm`.
- Соцсети: провайдер возвращает на `/auth/callback/[provider]`, страница один раз отправляет свой query в `POST /auth/sso/:provider/callback`.

## Структура

```
generated/            orval
src/app/              маршруты
src/components/       ui/ и icons/ — без изменений со старого фронта; остальное по разделам
src/constants/        маршруты, соцсети, способы MFA, иконки оплаты, SEO
src/hooks/            общие хуки (прогресс курса, адреса файлов)
src/lib/              api, auth, captcha, config, fingerprint, webauthn, analytics, utils
src/proxy.ts          редиректы по маркеру сессии
```
