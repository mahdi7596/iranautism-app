---
version: alpha
name: "Iran Autism Design System"
description: "Trust & Progress design system for the Iran Autism Association public platform, donation flows, user dashboard, CMS rendering, and admin workflows."

meta:
  status: provisional
  direction: "Trust & Progress"
  owners: ["Design", "Engineering"]
  lastReviewed: "2026-05-24"
  sources:
    brandAssets: "docs/source/client/design/logos, docs/source/client/design/banners, docs/source/client/design/fonts"
    brandbook: "docs/source/client/design/041203 Brandbook Hoviat basari H.Hobbi.pdf"
    brandbookExtraction: "pending visual/text verification"
    accessibilityTarget: "WCAG 2.2 AA"
  implementation:
    styling: "Pure CSS"
    motion: "GSAP for purposeful motion only"
    primaryLocale: "fa-IR"
    defaultDirection: "rtl"

colors:
  primary: "#642E98"
  on-primary: "#FFFFFF"
  primary-container: "#F0E6F7"
  on-primary-container: "#32104F"
  primary-soft: "#F8F3FB"
  on-primary-soft: "#4E2378"
  accent: "#C84A1B"
  on-accent: "#FFFFFF"
  accent-brand: "#F4773F"
  accent-container: "#FFE7D9"
  on-accent-container: "#6B260B"
  secondary: "#475569"
  on-secondary: "#FFFFFF"
  surface: "#FFFFFF"
  surface-muted: "#F8F6FA"
  surface-tint: "#FCF7F3"
  surface-raised: "#FFFFFF"
  surface-inverse: "#21172B"
  on-surface: "#1D1A22"
  on-surface-muted: "#625B6B"
  on-surface-subtle: "#817889"
  on-surface-inverse: "#FFFFFF"
  border: "#E3DDE9"
  border-strong: "#C8BBD4"
  outline-focus: "#F4773F"
  success: "#16734A"
  on-success: "#FFFFFF"
  success-container: "#DDF5E9"
  on-success-container: "#0B3D27"
  warning: "#9A6500"
  on-warning: "#FFFFFF"
  warning-container: "#FFE8B8"
  on-warning-container: "#4F3300"
  danger: "#B42318"
  on-danger: "#FFFFFF"
  danger-container: "#FDE2DF"
  on-danger-container: "#5F120C"
  info: "#2868A8"
  on-info: "#FFFFFF"
  info-container: "#DDEBFA"
  on-info-container: "#12385E"
  chart-1: "#642E98"
  chart-2: "#F4773F"
  chart-3: "#16734A"
  chart-4: "#2868A8"
  chart-5: "#9A6500"
  chart-6: "#8E4EC6"
  chart-7: "#D95D2A"
  chart-8: "#475569"

typography:
  font-sans: "'IRANSansWeb', 'IRANSans', 'Noto Sans Arabic', Tahoma, system-ui, sans-serif"
  font-display: "'Ray', 'IRANSansWeb', 'Noto Sans Arabic', Tahoma, system-ui, sans-serif"
  font-latin: "Inter, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
  font-mono: "'SFMono-Regular', Consolas, 'Roboto Mono', monospace"
  display-lg: { fontFamily: "{typography.font-display}", fontSize: "48px", fontWeight: 800, lineHeight: "60px", letterSpacing: "0px" }
  display-md: { fontFamily: "{typography.font-display}", fontSize: "40px", fontWeight: 800, lineHeight: "52px", letterSpacing: "0px" }
  h1: { fontFamily: "{typography.font-sans}", fontSize: "32px", fontWeight: 700, lineHeight: "44px", letterSpacing: "0px" }
  h2: { fontFamily: "{typography.font-sans}", fontSize: "28px", fontWeight: 700, lineHeight: "40px", letterSpacing: "0px" }
  h3: { fontFamily: "{typography.font-sans}", fontSize: "24px", fontWeight: 700, lineHeight: "36px", letterSpacing: "0px" }
  h4: { fontFamily: "{typography.font-sans}", fontSize: "20px", fontWeight: 700, lineHeight: "32px", letterSpacing: "0px" }
  h5: { fontFamily: "{typography.font-sans}", fontSize: "18px", fontWeight: 700, lineHeight: "28px", letterSpacing: "0px" }
  h6: { fontFamily: "{typography.font-sans}", fontSize: "16px", fontWeight: 700, lineHeight: "24px", letterSpacing: "0px" }
  body-lg: { fontFamily: "{typography.font-sans}", fontSize: "18px", fontWeight: 400, lineHeight: "32px", letterSpacing: "0px" }
  body-md: { fontFamily: "{typography.font-sans}", fontSize: "16px", fontWeight: 400, lineHeight: "28px", letterSpacing: "0px" }
  body-sm: { fontFamily: "{typography.font-sans}", fontSize: "14px", fontWeight: 400, lineHeight: "24px", letterSpacing: "0px" }
  label-md: { fontFamily: "{typography.font-sans}", fontSize: "14px", fontWeight: 700, lineHeight: "20px", letterSpacing: "0px" }
  label-sm: { fontFamily: "{typography.font-sans}", fontSize: "12px", fontWeight: 700, lineHeight: "18px", letterSpacing: "0px" }
  number-md: { fontFamily: "{typography.font-sans}", fontSize: "16px", fontWeight: 700, lineHeight: "24px", letterSpacing: "0px" }

spacing:
  0: "0"
  1: "4px"
  2: "8px"
  3: "12px"
  4: "16px"
  5: "20px"
  6: "24px"
  8: "32px"
  10: "40px"
  12: "48px"
  16: "64px"
  20: "80px"
  24: "96px"
  field-gap: "4px"
  inline-gap: "8px"
  badge-to-heading: "12px"
  heading-to-meta: "8px"
  card-gap: "12px"
  section-gap: "24px"
  page-gap: "32px"

rounded:
  none: "0px"
  xs: "2px"
  sm: "4px"
  md: "8px"
  lg: "12px"
  xl: "16px"
  pill: "999px"

components:
  button-primary:
    backgroundColor: "{colors.accent}"
    textColor: "{colors.on-accent}"
    typography: "{typography.label-md}"
    rounded: "{rounded.md}"
    padding: "10px 16px"
    height: "44px"
  button-primary-hover:
    backgroundColor: "#B94716"
    textColor: "{colors.on-accent}"
    typography: "{typography.label-md}"
    rounded: "{rounded.md}"
    padding: "10px 16px"
    height: "44px"
  button-secondary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    typography: "{typography.label-md}"
    rounded: "{rounded.md}"
    padding: "10px 16px"
    height: "44px"
  button-quiet:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.primary}"
    typography: "{typography.label-md}"
    rounded: "{rounded.md}"
    padding: "10px 16px"
    height: "44px"
  button-disabled:
    backgroundColor: "{colors.surface-muted}"
    textColor: "{colors.on-surface-muted}"
    typography: "{typography.label-md}"
    rounded: "{rounded.md}"
    padding: "10px 16px"
    height: "44px"
  icon-button:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.on-surface}"
    typography: "{typography.label-md}"
    rounded: "{rounded.md}"
    padding: "0"
    height: "40px"
    width: "40px"
  input-default:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.on-surface}"
    typography: "{typography.body-md}"
    rounded: "{rounded.md}"
    padding: "8px 12px"
    height: "44px"
  input-error:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.on-surface}"
    typography: "{typography.body-md}"
    rounded: "{rounded.md}"
    padding: "8px 12px"
    height: "44px"
  badge:
    backgroundColor: "{colors.primary-container}"
    textColor: "{colors.on-primary-container}"
    typography: "{typography.label-sm}"
    rounded: "{rounded.pill}"
    padding: "2px 8px"
    height: "24px"
  card:
    backgroundColor: "{colors.surface-raised}"
    textColor: "{colors.on-surface}"
    rounded: "{rounded.md}"
    padding: "16px"
  admin-card:
    backgroundColor: "{colors.surface-raised}"
    textColor: "{colors.on-surface}"
    rounded: "{rounded.md}"
    padding: "16px"
  donation-card:
    backgroundColor: "{colors.surface-raised}"
    textColor: "{colors.on-surface}"
    rounded: "{rounded.lg}"
    padding: "24px"
  hero-panel:
    backgroundColor: "{colors.primary-soft}"
    textColor: "{colors.on-primary-container}"
    rounded: "{rounded.lg}"
    padding: "24px"
  tab-default:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.on-surface-muted}"
    typography: "{typography.label-md}"
    rounded: "{rounded.none}"
    padding: "10px 12px"
    height: "40px"
  tab-selected:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.primary}"
    typography: "{typography.label-md}"
    rounded: "{rounded.none}"
    padding: "10px 12px"
    height: "40px"
  nav-link:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.on-surface-muted}"
    typography: "{typography.body-sm}"
    rounded: "{rounded.none}"
    padding: "4px 0"
  nav-link-current:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.primary}"
    typography: "{typography.body-sm}"
    rounded: "{rounded.none}"
    padding: "4px 0"
  table-cell:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.on-surface}"
    typography: "{typography.body-sm}"
    rounded: "{rounded.none}"
    padding: "10px 12px"
  empty-state:
    backgroundColor: "{colors.surface-muted}"
    textColor: "{colors.on-surface-muted}"
    typography: "{typography.body-md}"
    rounded: "{rounded.md}"
    padding: "24px"
---

## Overview

The Iran Autism design direction is **Trust & Progress**. It should feel warm enough for families and donors, structured enough for financial transparency and admin workflows, and specific enough that the platform never looks like a generic template.

The system is built around four ideas:

- Purple is identity, trust, navigation, and continuity.
- Orange is action: donation, payment continuation, mission verification, and the most important next step.
- Real people, project progress, and transparent numbers carry the emotional weight.
- Interface rules stay calm, readable, accessible, RTL-safe, and reusable.

This file is the source of truth for future UI work. Future CSS, React components, CMS blocks, dashboards, and GSAP motion should reuse these tokens and rules before adding anything new.

## Colors

Use semantic roles instead of one-off colors. The provisional brand palette is derived from the supplied logo and campaign assets; exact brandbook values still need verification from `/docs/source/client/design/041203 Brandbook Hoviat basari H.Hobbi.pdf`.

Purple is the brand identity color. Use it for headers, navigation current states, progress identity, section anchors, trusted badges, and selected states.

Orange is the primary action color. Use it for donation buttons, payment continuation, Pump mission actions, and high-value conversion actions. Do not use orange as casual decoration.

White, soft lavender, and warm off-white surfaces should create air around emotional content. Admin and reporting screens should use mostly white/neutral surfaces with purple active states and orange reserved for primary actions.

Status colors must not rely on color alone. Pair status color with text, icon, label, or shape.

## Typography

Use `IRANSans` as the default UI typeface for Persian, Arabic, and mixed RTL content. It is the body, form, button, table, dashboard, admin, donation, and CMS rendering font.

Use `Ray` only as a controlled display accent. Allowed uses:

- Homepage or campaign hero headlines.
- Major fundraising campaign titles.
- Construction milestone feature headings.
- Rare celebratory donation or mission-completion moments.

Forbidden uses for `Ray`:

- Body copy.
- Form labels or inputs.
- Admin navigation.
- Data tables.
- Dense dashboards.
- Error messages.

Typography rules:

- Body default is `16px / 28px`.
- App/admin H1 max is `32px` desktop and `24-28px` mobile.
- Marketing hero H1 max is `48px` desktop and `36px` mobile.
- Cards, KPIs, modals, and dashboard panels use titles between `14px` and `24px`.
- Letter spacing is always `0`; never use negative letter spacing for Persian or Arabic.
- Do not scale font sizes with viewport width.
- Text-bearing components must handle long Persian labels without overflow.
- Use `dir="auto"` for user-generated mixed Persian/English text.

## Layout

The platform has two density modes under one design system.

Public and storytelling pages may use larger spacing, stronger photography, section rhythm, and carefully staged reveals.

Admin and operational pages must be denser, quieter, and faster to scan. Use compact grids, clear table affordances, persistent filters, and restrained visual emphasis.

Recommended responsive containers:

- Reading/content pages: max `760px`.
- Standard public sections: max `1120px`.
- Wide marketing/project sections: max `1280px`.
- Admin shells: fluid width with protected side gutters.

Use CSS logical properties: `margin-inline`, `padding-inline`, `border-inline-start`, `inset-inline-start`, and `text-align: start`. Do not hard-code left/right layout rules unless the element is explicitly LTR-only.

Avoid nested cards. Page sections should be full-width bands or unframed layouts. Use cards for repeated items, donation panels, admin widgets, dialogs, and genuinely framed tools.

## Elevation & Depth

Depth should be quiet. Prefer borders, surface changes, and spacing before shadows.

Use three elevation levels:

- Level 0: flat page sections and admin tables.
- Level 1: cards, donation panels, media items, dashboard widgets.
- Level 2: sticky headers, dropdowns, popovers, drawers.
- Level 3: dialogs and blocking overlays.

Shadows should be soft and low opacity. Do not use glassmorphism, heavy blurred panels, or dramatic floating card stacks.

## Shapes

The brand logo uses rounded, human geometric forms. The interface should echo that through softened controls and progress indicators, but not through decorative repetition.

Default radius is `8px`. Keep most cards, inputs, buttons, tables, and dashboard widgets at `8px` or less. Use `12px` for donation cards, hero photo treatments, and major storytelling panels. Use pill radius only for badges, chips, segmented controls, and compact metadata.

Do not turn every element into a large rounded bubble. The system should feel warm and precise, not childish.

## Components

All components must support default, hover, focus-visible, pressed/active, disabled, loading, invalid/error, success, empty, and read-only states where applicable.

Buttons:

- Primary action buttons use orange.
- Secondary buttons use purple.
- Quiet buttons use white surface with purple text and border.
- Destructive buttons use danger red and must include clear text.
- Icon buttons must have accessible labels and tooltips when meaning is not obvious.

Forms:

- Every input needs a visible label.
- Placeholder text is not a label.
- Validation errors appear below the field and in a form summary for multi-step forms.
- Donation amount inputs must clearly indicate IRR/toman display rules.
- OTP and mobile-number flows must be readable and calm under error states.

Cards:

- Donation cards may be warmer and more spacious.
- Admin cards must be compact and data-forward.
- Cards should not contain other cards.
- Uneven card content must not break grid rhythm.

Navigation:

- Public navigation may use the logo, purple current state, and orange donation CTA.
- Admin navigation must be compact, permission-aware, and scan-friendly.
- Breadcrumbs are required for deep admin and CMS workflows.

Tables and data:

- Use compact row heights in admin.
- Provide horizontal scrolling for narrow screens.
- Keep filters, search, pagination, and export controls predictable.
- Use non-color status labels.
- Monetary values should align consistently and use integer IRR at the data level, with toman formatting only where the UI explicitly chooses it.

Project progress:

- Progress bars and phase timelines use purple as the continuity color.
- Completed/verified milestones may use success green.
- CTA actions stay orange.
- Evidence/media cards should prioritize clear timestamps, captions, and visibility state.

Donation and payment:

- Donation flow must feel reassuring: clear amount, project target, donor identity choice, gateway status, and final receipt.
- Payment failure states must be direct, recoverable, and non-alarming.
- Anonymous public display and guest/registered donation identity are separate concepts in UI language.

Pump missions:

- Mission CTAs use orange.
- Verification success uses success green plus text.
- Mobile number checks must explain the result without exposing sensitive donor history.

## Do's and Don'ts

Do:

- Use purple for identity and continuity.
- Use orange for primary actions.
- Use IRANSans for nearly all UI.
- Use Ray sparingly for public hero/campaign emphasis.
- Use real project, child-centered, and construction-progress imagery when available.
- Keep admin quiet, dense, and trustworthy.
- Use semantic HTML before ARIA.
- Preserve visible focus states.
- Respect RTL by default.
- Handle long Persian text and mixed English/Persian strings.

Don't:

- Invent colors outside this file.
- Use orange as decoration.
- Use Ray inside tables, forms, admin pages, or body copy.
- Use decorative blobs, glass effects, generic gradients, or random illustration systems.
- Make oversized headings inside cards, dashboards, modals, sidebars, or forms.
- Put cards inside cards.
- Depend on color alone for financial, payment, mission, or publication status.
- Add motion that distracts from donation, reading, or admin work.

## Motion

GSAP is approved for purposeful motion. Motion should clarify progress, cause/effect, and emotional storytelling. It should never be required to understand or complete a task.

Allowed GSAP uses:

- Homepage and campaign section reveals.
- Donation amount count-up after user confirmation.
- Project progress bar and construction timeline reveals.
- Pump mission completion feedback.
- Media/storytelling transitions.
- Small state changes that help users understand what changed.

Motion rules:

- Respect `prefers-reduced-motion`.
- Keep most UI transitions between `120ms` and `240ms`.
- Storytelling reveals may use `320ms` to `600ms`.
- Avoid looping motion except subtle loading indicators.
- Animate opacity and transform when possible.
- Do not animate layout properties that cause jank.
- Never block form completion, payment, or admin workflows behind animation.

## Accessibility

Target WCAG 2.2 AA.

Requirements:

- Normal text and controls must meet AA contrast.
- Focus-visible styles must be obvious on light, purple, and orange surfaces.
- Buttons and links must have accessible names.
- Icon-only actions require labels and tooltips where meaning is not universally clear.
- Forms require labels, hints, validation text, and error summaries for complex flows.
- Dialogs, drawers, menus, tabs, tooltips, and popovers should use proven headless accessible primitives where behavior is complex.
- Disabled text must remain readable.
- Loading states must announce progress when relevant.
- Motion must honor reduced-motion preferences.
- Images need meaningful alt text or empty alt when decorative.
- Financial and payment statuses must be available in text, not only color.

## Responsive Behavior

Design mobile-first for Persian reading and donation conversion.

Mobile:

- Use one-column layouts.
- Keep primary donation CTAs visible but not obstructive.
- Avoid dense table layouts; use responsive summaries or horizontal scroll.
- Ensure long Persian labels wrap cleanly.

Tablet:

- Use two-column public layouts only when content remains readable.
- Keep donation forms and payment summaries visually connected.

Desktop:

- Use wide layouts for project progress, transparency reports, and admin dashboards.
- Do not stretch reading text beyond comfortable line length.
- Keep first viewport content clear and avoid hero sections that hide the next section entirely.

## Localization

Default locale is Persian Iran (`fa-IR`) and default direction is RTL.

Rules:

- Set `lang="fa-IR"` and `dir="rtl"` at the root for Persian pages.
- Use `dir="auto"` for user-generated text, donor names, mixed-language titles, URLs, and gateway references.
- Use logical CSS properties.
- Mirror directional icons only when direction conveys meaning.
- Do not mirror brand logos.
- Use Persian numerals where appropriate for public Persian UI.
- Admin may use Latin gateway IDs, UUIDs, and technical references in LTR islands.
- Store money as integer IRR in the database. UI may display toman where explicitly chosen and clearly labeled.

## CSS Architecture

Implement the design system with pure CSS.

Recommended files:

```txt
packages/ui/src/styles/
  design-system.css
  tokens.css
  base.css
  layout.css
  components.css
  utilities.css
  themes.css
```

Use cascade layers:

```css
@layer ds.tokens, ds.base, ds.layout, ds.components, ds.utilities;
```

Class naming:

- Prefix reusable system classes with `.ds-`.
- Base component examples: `.ds-btn`, `.ds-card`, `.ds-field`, `.ds-table`.
- Variant examples: `.ds-btn--primary`, `.ds-btn--secondary`, `.ds-card--donation`.
- Size examples: `.ds-btn--sm`, `.ds-btn--md`, `.ds-btn--lg`.
- Prefer attributes for state: `:disabled`, `[aria-invalid="true"]`, `[aria-current="page"]`, `[data-state="open"]`.
- Use `.is-loading` only when native attributes are insufficient.

Utilities should be light and layout-oriented only: `.ds-container`, `.ds-stack`, `.ds-cluster`, `.ds-scroll-x`, `.ds-truncate`, `.ds-visually-hidden`.

Do not create a Tailwind-like arbitrary utility system.

## Governance for AI Agents

Before generating or changing UI, agents must read this file and the current frontend architecture decision.

Agents must:

- Reuse tokens, CSS classes, and component patterns before inventing new ones.
- Preserve pure CSS and RTL-safe implementation rules.
- Use Tabler icons only through the project-owned icon wrapper once implemented.
- Keep admin and public experiences in the same design family but with different density.
- Keep orange reserved for high-value actions.
- Use Ray only where this file allows it.
- Include empty, loading, error, disabled, and long-text states for new components.
- Verify mobile and desktop layouts before claiming UI work is complete.
- Explain any design-system deviation and propose a reusable token/component when the system lacks coverage.

When a decision becomes brand-approved or changes after client review, update this file first, then update CSS tokens and components.
