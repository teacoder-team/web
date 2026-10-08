import { isAxiosError } from 'axios'

/** Every API error: `{ status, messages }`, messages in English. */
export interface ApiErrorBody {
	status: number
	messages: string[]
}

/**
 * The API has no machine-readable error codes yet, so errors are recognised by
 * their English message. Everything that depends on that lives in this file.
 */
export const API_ERROR = {
	authenticationRequired: 'Authentication required',
	invalidAccessToken: 'Invalid or expired access token',
	sessionRevoked: 'Session expired or revoked',
	mfaSessionExpired: 'MFA session expired - sign in again',
	oauthCancelled: /sign-in was cancelled$/,
	oauthAlreadyLinkedToAnother:
		/^This .+ account is already linked to another TeaCoder account$/,
	oauthAnotherAlreadyLinked: /^Another .+ account is already linked/
} as const

type ErrorMatcher = string | RegExp

const MESSAGES: Record<string, string> = {
	'Invalid email or password': 'Неверная почта или пароль',
	'Please verify your email before logging in':
		'Подтвердите почту, чтобы войти',
	'Too many login attempts - try again later':
		'Слишком много попыток входа. Попробуйте позже',
	'Too many invalid codes - try again later':
		'Слишком много неверных кодов. Попробуйте через 15 минут',
	'Too many attempts - request a new code':
		'Слишком много попыток. Запросите новый код',
	'Captcha verification is required': 'Пройдите капчу!',
	'Captcha verification failed':
		'Не удалось пройти капчу, попробуйте ещё раз',
	'User already exists': 'Пользователь с такой почтой уже существует',
	'Email already in use': 'Эта почта уже используется',
	'Temporary email addresses are not allowed':
		'Временные почтовые адреса не поддерживаются',
	'Invalid code': 'Неверный код',
	'Verification code expired or registration not found':
		'Код истёк. Зарегистрируйтесь заново, чтобы получить новый',
	'Reset link expired or invalid':
		'Ссылка для сброса пароля устарела или уже использована. Запросите новую',
	'Reset link is invalid': 'Ссылка для сброса пароля недействительна',
	'Email change expired - start again':
		'Время подтверждения истекло, начните заново',
	'Password change expired - start again':
		'Время подтверждения истекло, начните заново',
	'Current password is incorrect': 'Неверный текущий пароль',
	'This account has no email to send a confirmation code to':
		'Сначала привяжите почту к аккаунту',
	'MFA session expired - sign in again':
		'Время подтверждения истекло, войдите снова',
	'Unknown MFA challenge - start a new one':
		'Проверка устарела, выберите способ подтверждения заново',
	'Authenticator app is already enabled':
		'Приложение-аутентификатор уже подключено',
	'Authenticator app is not enabled':
		'Приложение-аутентификатор не подключено',
	'Start authenticator setup first': 'Сначала отсканируйте новый QR-код',
	'Enable two-factor authentication first':
		'Сначала включите двухфакторную аутентификацию',
	'No security keys registered for this account':
		'К аккаунту не добавлено ни одного ключа доступа',
	'This security key is already registered': 'Этот ключ уже добавлен',
	'Security key not found': 'Ключ не найден',
	'Security key verification failed': 'Не удалось проверить ключ доступа',
	'Security key could not be verified': 'Не удалось проверить ключ доступа',
	'Unknown security key': 'Этот ключ не привязан к аккаунту',
	'Malformed WebAuthn response': 'Не удалось проверить ключ доступа',
	'Sign-in request expired - request new options':
		'Время ожидания истекло, попробуйте ещё раз',
	'Registration expired - request new options':
		'Время ожидания истекло, попробуйте ещё раз',
	'These options were issued for a different sign-in':
		'Время ожидания истекло, попробуйте ещё раз',
	'Cannot revoke the current session - sign out instead':
		'Текущую сессию можно завершить только выходом из аккаунта',
	'Session not found': 'Сессия не найдена',
	'Cannot unlink the only way to sign in - set a password or link another provider first':
		'Нельзя отвязать единственный способ входа. Установите пароль или привяжите другой сервис',
	'OAuth state expired or already used':
		'Ссылка для входа устарела, попробуйте ещё раз',
	'OAuth state does not match provider':
		'Ссылка для входа устарела, попробуйте ещё раз',
	'OAuth sign-in must be finished in the browser that started it':
		'Завершите вход в том же браузере, в котором его начали',
	'Session ended before linking finished - sign in and try again':
		'Сессия завершилась до окончания привязки. Войдите и попробуйте снова',
	'Name must be between 2 and 50 characters':
		'Имя должно содержать от 2 до 50 символов',
	'Invalid email format': 'Введите корректный адрес электронной почты',
	'Password must be at least 6 characters':
		'Пароль должен содержать хотя бы 6 символов',
	'Course not found': 'Курс не найден',
	'This course has no materials': 'У этого курса пока нет исходного кода',
	'Course materials require buying the course':
		'Чтобы скачать исходный код, купите курс',
	'Course materials require TeaCoder Premium or buying the course':
		'Чтобы скачать исходный код, оформите Premium или купите курс',
	'Download link is invalid or expired':
		'Ссылка на скачивание устарела. Получите новую ссылку',
	'Course materials are temporarily unavailable':
		'Исходный код временно недоступен. Попробуйте позже',
	'Lesson not found': 'Урок не найден',
	'This lesson requires TeaCoder Premium or the course to be purchased':
		'Этот урок доступен с подпиской TeaCoder Premium',
	'Payment provider is unavailable, try again later':
		'Платёжный сервис недоступен, попробуйте позже',
	'No active subscription to renew': 'У вас нет действующей подписки',
	'Subscription never expires - there is nothing to renew':
		'Ваша подписка бессрочная'
}

const PATTERNS: [RegExp, string][] = [
	[API_ERROR.oauthCancelled, 'Вход отменён'],
	[
		API_ERROR.oauthAlreadyLinkedToAnother,
		'Этот аккаунт уже привязан к другому пользователю'
	],
	[
		API_ERROR.oauthAnotherAlreadyLinked,
		'К вашему профилю уже привязан другой аккаунт этого сервиса. Сначала отвяжите его'
	],
	[/^This .+ account is already linked/, 'Этот аккаунт уже привязан'],
	[/ is already linked$/, 'Этот сервис уже привязан'],
	[/ is not linked$/, 'Этот сервис не привязан'],
	[
		/^Security key could not be verified/,
		'Не удалось проверить ключ доступа'
	],
	[
		/^Payment method .+ is not available yet$/,
		'Этот способ оплаты пока недоступен'
	],
	[
		/^An unpaid .+ invoice .+ is open until/,
		'У вас уже есть неоплаченный счёт другим способом. Оплатите его или попробуйте позже'
	],
	[
		/is already being (processed|created)/,
		'Платёж уже обрабатывается, подождите'
	]
]

const STATUS_MESSAGES: Record<number, string> = {
	429: 'Слишком много попыток. Попробуйте позже',
	500: 'Что-то пошло не так. Попробуйте позже'
}

export function getApiError(error: unknown): ApiErrorBody | null {
	if (!isAxiosError<ApiErrorBody>(error) || !error.response) {
		return null
	}

	const { data, status } = error.response

	return {
		status,
		messages: Array.isArray(data?.messages) ? data.messages : []
	}
}

function matches(message: string, matcher: ErrorMatcher) {
	return typeof matcher === 'string'
		? message === matcher
		: matcher.test(message)
}

export function hasApiError(error: unknown, matcher: ErrorMatcher) {
	return (
		getApiError(error)?.messages.some(message =>
			matches(message, matcher)
		) ?? false
	)
}

/** 422 messages are `field: message` - the field name is not for users. */
function withoutField(message: string) {
	return message.replace(/^[\w.]+: /, '')
}

function translate(message: string) {
	const plain = withoutField(message)

	return (
		MESSAGES[plain] ??
		PATTERNS.find(([pattern]) => pattern.test(plain))?.[1] ??
		null
	)
}

/** A Russian message for a failed request; `fallback` describes the action that failed. */
export function getErrorMessage(error: unknown, fallback: string) {
	const apiError = getApiError(error)

	if (!apiError) {
		return fallback
	}

	for (const message of apiError.messages) {
		const translated = translate(message)

		if (translated) {
			return translated
		}
	}

	return STATUS_MESSAGES[apiError.status] ?? fallback
}

/** The access token was rejected - worth one refresh and a retry. */
export function isAccessTokenError(error: unknown) {
	const apiError = getApiError(error)

	return (
		apiError?.status === 401 &&
		apiError.messages.some(
			message =>
				message === API_ERROR.authenticationRequired ||
				message === API_ERROR.invalidAccessToken ||
				message === API_ERROR.sessionRevoked
		)
	)
}
