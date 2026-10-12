# DESIGN.md — TeaCoder visual language

Rules for agents and people who change the UI. The goal: every new page should look like part of one product. If a rule gets in the way, discuss it first instead of silently working around it.

The style draws on **fumadocs.dev** (dark grainy panels, bento grid, pill buttons) and **Claude Academy / anthropic.com** (calm warm background, serif course titles, minimal cards). We don't copy them; we keep their character: calm, dense, airy, one accent color.

---

## 1. Principles

1. **One accent — blue.** Everything bright in the UI is blue or light blue. No purple, pink or "AI gradients".
2. **Background and spacing instead of borders.** A surface is separated by a step in color or a thin `border-border` line, not by `shadow-2xl`.
3. **Dark panels are the main expressive device.** Large blocks (hero, art, CTA) are dark `bg-inverse` with a grainy blue glow, in both themes.
4. **Every pixel is true.** No made-up features, numbers, reviews, instructors or durations. Illustrative mockups use real data (course covers and titles) or abstractions (skeleton bars).
5. **Restrained motion.** Animation emphasizes, it doesn't entertain. Every animation respects `prefers-reduced-motion`.

---

## 2. Color

All colors are CSS variables in `src/assets/styles/globals.css` (HSL triplets without `hsl()`), exposed as Tailwind tokens in `tailwind.config.ts`. **Do not use hex values or `blue-600` / `neutral-*` in components** — tokens only.

| Token | Light | Dark | Purpose |
|---|---|---|---|
| `background` | warm beige `45 25% 95%` | near-black `240 6% 4%` | page background |
| `foreground` | `240 6% 8%` | `0 0% 93%` | body text |
| `card` | lighter than background | `240 4% 7.5%` | cards, bento |
| `popover` | white | `240 4% 9%` | menus, dialogs, cookie banner |
| `secondary` / `muted` / `accent` | one step darker than background | one step lighter | secondary buttons, hover, fills |
| `muted-foreground` | gray | gray | secondary text |
| `border` | hairlines | hairlines | dividers, field borders |
| `input` | cool light gray | one step lighter than `card` | fill of text fields |
| `primary` | `#2563EB`-like | slightly lighter | buttons, active states |
| `brand` | blue for text | light blue `205 95% 74%` | accent words, icons, links on the page background |
| `brand-soft` | pale blue | dark blue | badge fill |
| `highlight` | ice blue | same | accents **on dark panels** (`bg-inverse`) |
| `inverse` / `inverse-foreground` | near-black / light | same | always-dark panels and footer |
| `success`, `warning`, `destructive` (+ `-soft`) | calm | calm | statuses, errors, toasts |

Rules:
- Accent text on the regular background: `text-brand`; on a dark panel: `text-highlight`.
- Inside `bg-inverse`, use only `inverse-foreground` with opacity: `text-inverse-foreground/70`, `border-inverse-foreground/10`, `bg-inverse-foreground/[0.06]`.
- Token opacity modifiers work: `bg-primary/90`, `border-foreground/20`.

---

## 3. Typography

Fonts are self-hosted (`src/constants/fonts.ts`, files in `src/assets/fonts/`). **Never add Google Fonts.** A new typeface means local woff2 files with Cyrillic support and the OFL license next to them.

| Class | Typeface | Where |
|---|---|---|
| `font-display` | **Onest** (`--font-display`) | all `h1–h4` by default, large section headings, the manifesto |
| `font-sans` | **Geist** (`--font-geist-sans`) | body text, UI, buttons |
| `font-serif` | **EB Garamond** (`--font-serif`) | editorial headings: course title on the card, "Популярные курсы", "Курсы" |
| `font-mono` | system mono | code, percentages, monospace labels |

Heading scale (fluid, tracking and line height included):

| Class | Size | Where |
|---|---|---|
| `text-display-2xl` | 40 → 72 px | hero `h1` only |
| `text-display-xl` | 32 → 56 px | CTA heading, accent line, page title |
| `text-display-lg` | 28 → 44 px | section headings |
| `text-display-md` | 22 → 30 px | bento card headings |

Rules:
- Onest headings are `font-medium` (500). No heavier.
- Serif headings are `font-medium` with `tracking-[-0.01em]`…`[-0.02em]`. No serif italics.
- Highlight the accent word in a heading with **color**, not style: `<span className='text-highlight'>TeaCoder</span>` on a dark panel, `text-brand` on the light background.
- Card titles are one line: `truncate` plus `title={…}` for the full text.
- Lead paragraphs: `text-lg leading-relaxed text-muted-foreground` (or `text-inverse-foreground/70` on a panel).
- Text measure: `max-w-xl`…`max-w-2xl`.

---

## 4. Grid, spacing, radii

Containers (`globals.css`, `components` layer):
- `.page-container` — max 1240 px, side gutters 16/24/32 px. Regular content.
- `.frame-container` — max 1440 px, gutters 12/20/24 px. Wide dark panels (hero, CTA) and the header.

Section rhythm: `py-24 sm:py-32` (or `pb-…` when a section follows directly). Bento gap: `gap-5`. Card padding: `p-7 sm:p-10` (bento), `p-5 sm:p-6` (course card).

Radii (`--radius: 0.75rem`):

| Class | px | Where |
|---|---|---|
| `rounded-lg` | 12 | inputs, small elements |
| `rounded-xl` | 16 | nested windows, covers inside a panel |
| `rounded-2xl` | 20 | course cards, banner, popovers |
| `rounded-3xl` | 28 | bento cards |
| `rounded-[1.75rem]` | 28 | large hero/CTA panels |
| `rounded-full` | — | **all buttons**, badges, icon circles |

Grids: bento uses `grid gap-5 lg:grid-cols-2 [&>*]:min-w-0` (without `min-w-0`, marquees and `<pre>` blocks stretch the column on mobile). Courses: `grid gap-5 sm:grid-cols-2 lg:grid-cols-3`.

---

## 5. Surfaces and patterns

### Card (light surface)
```tsx
<article className='rounded-3xl border border-border bg-card p-7 sm:p-10'>
```
Hover on clickable cards: `hover:border-foreground/20` plus a slight cover zoom `group-hover:scale-[1.03]`. No lift-with-shadow.

### Dark panel with art
```tsx
<div className='relative isolate overflow-hidden rounded-[1.75rem] bg-inverse text-inverse-foreground'>
	<Image src='/images/art/hero-grain.webp' alt='' fill className='-z-20 object-cover' />
	{/* decoration: -z-10, pointer-events-none, aria-hidden */}
	{/* content */}
</div>
```

### Blue panel
`bg-primary` plus the `.grain` class (film grain via `::after`). Used for the course marquee in the bento.

### UI mock window
Inside a dark panel: `rounded-tl-2xl border-l border-t border-inverse-foreground/10 bg-inverse/80 backdrop-blur-xl`, pinned to the bottom-right and **cropped by the panel edge**. Contents are real data or skeleton bars `h-2 rounded-full bg-inverse-foreground/15`. Always `aria-hidden='true'`.

### Course card (`src/components/course/course-card.tsx`)
16:9 cover → serif title on one line → description `line-clamp-3` → footer row: meta joined with ` · ` on the left, access on the right ("Бесплатно" `text-success`, "По подписке" `text-brand`, price `tabular-nums`). Prices always go through `formatPrice(amount, currency)`; the currency comes from `GET /` (`features.premium.currency`).

### Floating banner
The cookie banner (`src/components/consent/cookie-dialog.tsx`) is the reference for non-modal notices: `fixed bottom-5 right-5 max-w-[400px] rounded-2xl bg-popover p-5 shadow-popover`; full width with 12 px margins on mobile.

---

## 6. `ui` components

Primitives live in `src/components/ui` (shadcn, reworked). Use them; don't hand-build buttons or fields.

**Button** — always a pill. Variants:

| Variant | Where |
|---|---|
| `default` / `primary` | main action on the light background |
| `outline` | secondary action next to the main one |
| `secondary` | neutral action (e.g. "Только необходимые") |
| `ghost` | header and menu actions, "Назад", "Отмена" |
| `highlight` | main action **on a dark panel** (ice pill, dark text) |
| `glass` | secondary action on a dark panel |
| `contrast` | light button on `bg-primary` |
| `ink` | dark button where blue is out of place |
| `destructive` | deleting, signing out of all sessions |
| `link` | inline action link |

Sizes: `xs` 32, `sm` 36, `default` 40, `lg` 48, `xl` 56 (hero/CTA only), `icon` 40. A trailing arrow icon nudges right on hover automatically. `isLoading` renders a spinner — use it instead of custom loaders.

**Badge** — `default` (blue), `neutral`, `outline`, `success`, `error`, `warning`, `solid`. For statuses ("Подтверждена", "Включено", "Активна") use `success` / `warning` / `error`.

**Input / InputOTP / Select** — filled with the `input` token (`bg-input`): a cool light gray in light theme, a step lighter than the card in dark. `--input` is a fill color, not a border — borders use `border-border`. Focus: `border-primary` + `ring-4 ring-primary/15`. **Select** — `bg-card`, `rounded-xl`.

**Dialog / AlertDialog / Sheet** — `bg-popover`, `rounded-3xl`, `shadow-popover`, title in `font-display`. Overlay `bg-foreground/40 backdrop-blur-[2px]`.

**Skeleton** — `bg-foreground/[0.06]`. A skeleton mirrors the shape of the content it replaces (same radii and proportions).

Shadows — tokens only: `shadow-card`, `shadow-card-hover`, `shadow-popover`.

---

## 7. Imagery

The art is generated procedurally (stochastic grain + Bayer 8×8 ordered halftone). Palette: deep blue `#1D4ED8`, brand `#2563EB`, sky `#38BDF8`, ice `#BAE6FD` on dark `#06090F`. Files are in `public/images/art/`:

| File | What | Where |
|---|---|---|
| `hero-grain.webp` | grainy glow, top right | hero background |
| `sphere-halftone.png` | halftone sphere (transparent PNG) | hero, right side |
| `panel-grain.webp` | calm grain | "Отслеживание прогресса" bento card |
| `cta-grain.webp` | night sky, glow from below, stars | Telegram CTA background |
| `planet-wide.png` | halftone planet horizon | bottom of the Telegram CTA |

Rules:
- New banners follow the same style: dark base, blue tones, grain or square halftone. No stock photos, 3D renders, emoji or illustrations of people.
- Decorative images: `alt=''`, `aria-hidden`, `pointer-events-none`. Backgrounds use `next/image` with `fill` and `object-cover`.
- Grain as webp (quality ~82), halftone as transparent PNG. Keep each file under ~900 KB.
- Render halftone PNGs with `unoptimized` on `next/image`, otherwise resampling blurs the square dots.
- Course covers come from the API as file ids — build the URL with `getMediaSource()` / `useMediaSource()`.

---

## 8. Icons

`lucide-react` with the default stroke. Sizes: 16 px inside buttons (set by `Button`), 14 px in meta rows, 24 px in icon circles. Social brand icons come from `react-icons` (`FaTelegram`, `FaYoutube`, `FaGithub`). Icon circle: `flex size-8 items-center justify-center rounded-full bg-secondary` (on a dark panel: `border border-inverse-foreground/15 bg-inverse-foreground/[0.06]`).

---

## 9. Motion

- Section entrance: `<Reveal>` from `src/components/motion/reveal.tsx` — once, on entering the viewport, 0.7 s, `ease [0.22, 1, 0.36, 1]`. Never re-animate on every scroll.
- Hover and transitions: 150–300 ms, `ease-out`.
- Small UI (banners, content swaps): CSS `animate-in fade-in-0 slide-in-from-bottom-*` from `tailwindcss-animate`. Keep framer-motion for staged effects (sphere parallax, manifesto word reveal, rising planet).
- Marquee: `animate-marquee` with `--marquee-duration`, pause on hover, `motion-reduce:animate-none`, duplicated items `aria-hidden` and `tabIndex={-1}`.
- Always check `useReducedMotion()` in framer animations and use `motion-reduce:` in CSS.
- Don't: fly blocks in from the side, pulse things forever for decoration, run animations longer than 1.4 s.
- Never put `backdrop-blur` over something that animates, and avoid large rotating layers: both forced a per-frame repaint and made the old auth screens lag. Decorative backdrops behind forms stay static.

---

## 10. Copy

- UI text is Russian. Use informal «ты» on marketing pages, formal «вы» in legal text and system messages (cookie banner, errors).
- Short bento headings end with a period ("Практика с кодом."); page and section headings don't.
- Don't invent announcements, statistics or testimonials. A badge above a heading must be true ("Курсы по веб-разработке").

---

## 11. Dark theme and accessibility

- Check every new screen in both light and dark themes. Dark is not an inversion: it has its own surfaces (`card`, `popover`) and accents (`brand` is lighter).
- Text contrast: WCAG AA. Gray text is never lighter than `muted-foreground`.
- Visible focus ring (`focus-visible:ring-2 ring-ring` is already in the primitives).
- Hit targets of at least 40 px. Interactive elements are `button` / `a`, not `div`.
- Responsive: 375 / 768 / 1280 / 1920 px, no horizontal scroll.

---

## 12. Pre-handoff checklist

- [ ] Colors come from tokens only — no hex, no `blue-*` / `neutral-*`.
- [ ] Headings in Onest `font-medium`; serif only in editorial places.
- [ ] Buttons from `ui/button`, with the right variant per the table.
- [ ] Spacing and radii from the scale.
- [ ] Animations respect reduced motion and play once.
- [ ] Both themes, widths 375 / 768 / 1280, no horizontal scroll.
- [ ] States covered: loading (skeleton of the same shape), empty, error, `disabled`, `isLoading`.
- [ ] No invented features and no new API requests.

---

## Not yet redesigned

At the time of writing, the new style covers: the design system, header, footer, home page, course catalog and course card, the cookie banner and the auth screens (`AuthWrapper`: centered heading and form card over a static halftone backdrop; on sign-in/up the card first shows sign-in methods, the email form opens on demand). The course page, lesson, subscription, account area, 404, payment result and legal documents still use the old markup. When you redesign them, follow this file and update this list.
