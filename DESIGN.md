# DESIGN.md — TeaCoder Design System

This document defines the visual language of TeaCoder. Follow it when creating or updating UI so that every page feels like part of the same product.

The design should feel **calm, modern, editorial, and technical**. Combine generous spacing, warm backgrounds, expressive typography, clean layouts, and subtle blue accents. Dark panels, grain textures, and halftone artwork add character without overwhelming the content.

## 1. Core Principles

- **One accent color.** Blue is the primary accent. Avoid purple, pink, rainbow gradients, and generic AI-style visuals.
- **Clarity over decoration.** Every element should serve a purpose. Avoid unnecessary borders, shadows, gradients, and visual noise.
- **Consistent surfaces.** Use background colors, spacing, and subtle borders to establish hierarchy instead of heavy shadows.
- **Expressive but restrained.** Use dark panels, grain textures, and halftone artwork as distinctive visual elements, not as decoration everywhere.
- **Content must be real.** Never invent features, statistics, testimonials, prices, course details, or other factual content.
- **Design for both themes.** Light and dark modes should feel intentionally designed, not like simple color inversions.
- **Motion with purpose.** Animation should improve feedback or guide attention, never distract from the content.

## 2. Color

All UI colors must use the existing design tokens, declared as OKLCH variables in `src/assets/styles/globals.css` and exposed to Tailwind through `@theme`. Do not introduce hardcoded colors or use arbitrary Tailwind color classes in components.

| Token                               | Purpose                                    |
| ----------------------------------- | ------------------------------------------ |
| `background`                        | Main page background                       |
| `foreground`                        | Primary text                               |
| `card`                              | Cards and elevated surfaces                |
| `popover`                           | Dialogs, menus, and floating surfaces      |
| `primary`                           | Main actions and interactive states        |
| `brand`                             | Blue accents, links, and highlighted text  |
| `brand-soft`                        | Subtle blue backgrounds and badges         |
| `highlight`                         | Accent color on dark panels                |
| `inverse`                           | Consistently dark panels and sections      |
| `inverse-foreground`                | Text and UI elements inside dark panels    |
| `secondary`, `muted`, `accent`      | Secondary surfaces and interaction states  |
| `muted-foreground`                  | Secondary text                             |
| `border`, `input`, `ring`           | Borders, form fields, and focus indicators |
| `success`, `warning`, `destructive` | Status messages and feedback               |

Rules:

- Use `brand` for accents on regular page backgrounds and `highlight` inside dark panels.
- Inside dark panels, use `inverse-foreground` and its opacity variants for text, borders, and subtle fills.
- Use semantic status colors only for their intended meaning.
- Preserve sufficient contrast in both themes.
- Never add a new color when an existing token can serve the same purpose.

## 3. Typography

Typography combines a clean sans-serif foundation with an editorial serif accent.

- **Display font:** Onest for headings and prominent titles.
- **Sans-serif font:** Geist for body text, interface elements, and buttons.
- **Serif font:** EB Garamond for selected editorial headings, especially course titles and featured sections.
- **Monospace:** System monospace for code and technical data.

Use the existing locally hosted fonts. Do not load fonts from external services. Any new typeface must include local WOFF2 files with Cyrillic support and an appropriate license.

### Hierarchy

- **Hero headings:** Large, responsive, and visually dominant.
- **Page headings:** Clear and prominent, with restrained line lengths.
- **Section headings:** Consistent in size and spacing.
- **Card headings:** Compact and easy to scan.
- **Body text:** Comfortable to read, with relaxed line height.
- **Secondary text:** Visually quieter but still accessible.

Rules:

- Use medium weight (500) for Onest headings. Avoid unnecessarily bold typography.
- Keep serif typography limited to editorial contexts.
- Highlight words with color rather than italics or decorative effects.
- Keep headings concise and prevent awkward wrapping.
- Use truncation only when necessary, with a way to access the full text.
- Limit paragraph width for readability.
- Maintain a clear distinction between headings, body text, metadata, and secondary information.

## 4. Layout and Spacing

Use the existing container utilities and spacing scale instead of introducing arbitrary values.

- **Regular content:** Centered, with a maximum width of approximately 1240 px.
- **Wide sections:** Up to approximately 1440 px.
- **Page gutters:** Responsive, with enough space on small screens.
- **Section spacing:** Generous vertical spacing that separates major content groups.
- **Card spacing:** Consistent internal padding and gaps.
- **Bento layouts:** Balanced grids with clear visual hierarchy and consistent gaps.

### Shape language

- Small controls: rounded corners.
- Nested surfaces and media: medium rounded corners.
- Cards: large rounded corners.
- Hero panels and major banners: generous rounded corners.
- Buttons, badges, and compact icon containers: pill or circular shapes.

Prefer the existing radius scale. Do not mix unrelated corner styles on the same page.

### Responsive behavior

Design mobile-first and adapt layouts naturally to larger screens.

- Avoid horizontal overflow.
- Stack content when columns become too narrow.
- Keep interactive elements accessible on touch devices.
- Prevent images, code blocks, and long text from stretching their containers.
- Preserve the content hierarchy across breakpoints.

## 5. Surfaces and Components

Use existing UI primitives and shared design patterns whenever possible. Extend them consistently rather than building one-off replacements.

### Cards

Cards should rely on surface contrast, spacing, and subtle borders. Avoid excessive shadows and unnecessary nested containers.

Clickable cards may use a subtle border change or a slight image zoom on hover. Avoid dramatic lifting effects.

### Dark panels

Dark panels are a key part of the visual identity. Use them for prominent sections, featured content, and calls to action.

- Use the inverse color tokens.
- Add subtle blue lighting, grain, or halftone artwork when appropriate.
- Keep decorative effects behind the content.
- Maintain readable contrast.
- Avoid stacking multiple competing effects.

### Buttons

Buttons use pill-shaped corners and consistent sizing.

- **Primary:** The main action.
- **Outline:** A secondary action alongside the primary one.
- **Secondary:** A neutral alternative.
- **Ghost:** A low-emphasis action.
- **Highlight:** The main action on a dark panel.
- **Destructive:** An action that removes data or performs another destructive operation.
- **Link:** An inline navigation or text action.

Use the existing button variants and loading behavior. Every button should communicate its importance clearly. Do not give multiple competing actions the same visual prominence without a reason.

### Forms and dialogs

- Use consistent field heights, spacing, and corner radii.
- Distinguish field backgrounds from borders.
- Provide clear focus, disabled, validation, and error states.
- Keep dialogs visually consistent with the rest of the interface.
- Avoid unnecessary overlays, blur effects, and decorative layers.

### Loading, empty, and error states

Every data-driven screen should handle loading, empty, and error states.

- Skeletons should match the shape and proportions of the content they replace.
- Empty states should explain what is happening and, when appropriate, offer a next step.
- Errors should be understandable and actionable.
- Disabled and loading controls must communicate their state clearly.

## 6. Imagery and Graphics

The visual language uses dark backgrounds, blue light, film grain, and ordered halftone patterns.

Preferred palette for decorative artwork:

- Deep navy and near-black backgrounds.
- Deep and medium blue lighting.
- Sky blue and pale ice-blue highlights.

Use the existing artwork where appropriate. New artwork should follow the same visual direction.

Rules:

- Prefer abstract textures and geometric compositions over generic stock imagery.
- Avoid decorative 3D renders, emoji-based illustrations, and generic AI-generated visuals.
- Keep artwork subordinate to the content.
- Use decorative images without redundant alternative text.
- Keep decorative assets reasonably small and optimized for the web.
- Preserve the sharpness of halftone patterns when rendering transparent images.
- Use the project's established media utilities for course covers and other API-provided images.
- Never substitute invented course covers, statistics, or interface data for real content.

## 7. Icons

Use the project's existing icon libraries and conventions.

- Prefer simple outline icons with consistent stroke weight.
- Use consistent sizes for actions, metadata, and icon containers.
- Use recognizable brand icons only where they add clarity.
- Align icons with adjacent text.
- Avoid mixing unrelated icon styles or using icons as decoration without a clear purpose.

Icons must support the interface, not compete with its typography.

## 8. Motion and Interaction

Animation should be subtle, quick, and functional.

- Use short transitions for hover, focus, and state changes.
- Reveal sections only when it improves the reading experience.
- Use continuous animation only when it communicates something meaningful.
- Keep decorative motion restrained.
- Avoid large moving layers and expensive effects that can degrade performance.
- Do not animate every element on a page.

Respect `prefers-reduced-motion` in CSS and JavaScript animations. Interactive feedback must remain understandable without animation.

## 9. Copy and Content

The interface language is Russian.

- Use informal «ты» in marketing and educational content.
- Use formal «вы» in legal text and system messages.
- Keep interface labels concise and specific.
- Write headings that communicate the value of a section rather than describing its appearance.
- Avoid generic marketing phrases, exaggerated claims, and unnecessary exclamation marks.
- Do not invent features, announcements, metrics, testimonials, or other claims.
- Ensure badges, prices, availability labels, and other factual UI elements reflect actual application data.

## 10. Accessibility and Quality

Accessibility and usability are part of the design system, not optional finishing steps.

- Support both light and dark themes.
- Maintain WCAG AA contrast for normal text.
- Keep focus indicators visible.
- Use semantic interactive elements for actions and navigation.
- Provide accessible names for icon-only controls.
- Aim for touch targets of at least 40 px, preferably larger where practical.
- Associate form fields with their labels and make validation errors understandable.
- Respect reduced-motion preferences.
- Test responsive layouts at 375, 768, 1280, and 1920 px.
- Ensure the interface works with keyboard navigation.

## 11. Before Finishing a UI Change

- [ ] The page follows the existing visual language.
- [ ] Colors come from design tokens.
- [ ] Typography and spacing follow the established hierarchy.
- [ ] Existing UI primitives are reused where possible.
- [ ] Light and dark themes both work correctly.
- [ ] Mobile and desktop layouts have been checked.
- [ ] Loading, empty, error, and disabled states are handled where relevant.
- [ ] Interactive elements have clear feedback and accessible focus states.
- [ ] Animations respect reduced-motion preferences.
- [ ] Images and other assets are optimized.
- [ ] No fictional content, unnecessary API requests, or unrelated changes were introduced.

**The goal is consistency, not rigidity.** Follow these rules by default. When a genuine product need calls for an exception, make it deliberate and keep the result consistent with the overall TeaCoder experience.
