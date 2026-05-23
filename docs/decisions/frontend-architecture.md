# Frontend Architecture Decision

Date: 2026-05-18

Status: Accepted baseline

Updated: 2026-05-21 to reference the accepted repository/tooling decision in `docs/decisions/repository-architecture.md`.

## Executive Recommendation

Build the Iran Autism frontend as one Next.js App Router application inside the project monorepo, alongside the accepted NestJS backend.

The frontend should use a component-driven architecture, a production `DESIGN.md` design contract, pure CSS, reusable UI packages, and strict boundaries between public website, user dashboard, donation/payment flows, CMS rendering, media features, and admin workflows.

Do not split the public website and admin panel into separate frontend applications at the beginning. Keep them in one app for v1, with route-group and feature-module boundaries that allow future extraction if real operational pressure appears.

## Accepted Frontend Stack

| Layer | Decision | Why |
|---|---|---|
| Frontend framework | Next.js App Router | Best fit for public SEO, server-rendered CMS pages, donation flows, authenticated dashboards, and future scaling. |
| UI runtime | React + TypeScript | Matches backend TypeScript direction and supports reusable typed components. |
| Repository model | Monorepo | Keeps frontend, backend, shared types, validation, UI, and design tokens coordinated. |
| Workspace tooling | pnpm workspaces first; Turborepo optional later | pnpm is enough for v1 workspace management; Turborepo should be added only when task caching/orchestration becomes valuable. |
| Styling | Pure CSS with design tokens | Preserves custom brand control, RTL safety, and reuse without depending on Tailwind, DaisyUI, Bootstrap, or Material UI. |
| Design governance | Project-root `DESIGN.md` | Portable source of truth for tokens, component rules, AI design instructions, RTL, accessibility, and production guardrails. |
| Component model | Component-driven architecture | Enables reusable UI primitives, composed components, feature components, and future extraction. |
| Accessible behavior primitives | Use a headless library where useful | Complex widgets should use proven accessible behavior while keeping project-owned CSS. |
| Headless primitive library | Radix-style library, preferably Radix UI primitives initially | Gives dialog, popover, tabs, menus, tooltip, and related behavior without imposing visual design. |
| Icons | Tabler Icons through a project-owned `icons.ts` map/wrapper | Broad, neutral, admin-friendly icon set while keeping icon usage governed. |
| Forms | React Hook Form + Zod | Fast, typed, reusable validation and strong admin/donation form ergonomics. |
| Server state | Server Components/native fetch for public pages; TanStack Query for authenticated/admin client state | Keeps public pages fast and SEO-friendly while admin pages remain interactive. |
| Client UI state | Zustand only where it clearly fits | Useful for cross-component UI workflows without turning all state into global state. |

## Monorepo Direction

Detailed repository/tooling decisions are documented in `docs/decisions/repository-architecture.md`.

Recommended initial structure:

```txt
apps/
  api/
    # NestJS modular monolith backend
  web/
    # Next.js public website, donation flows, account area,
    # CMS rendering, media experiences, and admin panel for v1

packages/
  api-client/
  config/
  design-tokens/
  icons/
  types/
  ui/
  validation/
```

The backend remains the accepted TypeScript/NestJS modular monolith documented in `docs/decisions/backend-architecture.md`.

Use `pnpm` workspaces for v1. Do not add Turborepo initially. Turborepo remains approved as a later task runner/cache layer if build, test, lint, or CI workflows become slow enough to justify it.

## Single App for V1

Use one `apps/web` application for:

- Public website.
- CMS-driven public pages.
- Donation and payment flows.
- User account/profile/donation history.
- Admin panel.
- Media/gallery/video experiences.

Keep internal route and module boundaries strict:

```txt
apps/web/src/app/
  [locale]/
    (public)/
    (donate)/
    (account)/
    (admin)/

apps/web/src/features/
  public/
  projects/
  donations/
  payments/
  account/
  admin/
  cms-renderer/
  media/
```

## Why Not Separate Admin Immediately

Do not create separate public and admin frontend apps at the beginning because the first version benefits more from shared:

- Design tokens and component system.
- API client and shared types.
- Auth/session conventions.
- Form and validation patterns.
- Project, donation, media, and CMS models.
- Locale and RTL infrastructure.
- Deployment and environment configuration.

Separate frontend apps are not a substitute for security. Admin security must come from backend authentication, RBAC, permission checks, audit logs, and API enforcement.

Admin can be extracted later if one or more of these become true:

- Admin needs separate deployment or release cadence.
- Admin must live on a private domain, VPN, or separate hosting environment.
- Admin bundle size materially harms public performance.
- A separate team owns admin development.
- Admin workflows become large enough to justify a dedicated application.

The accepted v1 decision is to keep admin inside `apps/web` as a separate route group and feature area, not as a separate frontend application.

The admin route group is only a UI boundary. Backend security must still be enforced by the NestJS API through admin authentication, RBAC, permission checks, and audit logs.

## Component-Driven Architecture

Use layered component ownership:

```txt
Design tokens
  -> CSS system
  -> UI primitives
  -> composed reusable components
  -> feature components
  -> pages/routes
```

Recommended package structure:

```txt
packages/ui/src/
  primitives/
    Button/
    IconButton/
    Input/
    Dialog/
    Tabs/
    Menu/
  components/
    Amount/
    ProgressBar/
    StatusBadge/
    Timeline/
    DataTable/
    MediaCard/
    EmptyState/
  layout/
    Container/
    Stack/
    Grid/
    AppShell/
    AdminShell/
  styles/
    tokens.css
    base.css
    layout.css
    components.css
    utilities.css
```

Reusable, project-agnostic components belong in `packages/ui`. Iran Autism-specific components belong in `apps/web/src/features/*` until another project proves they should be generalized.

## Pure CSS and `DESIGN.md`

Create a project-root `DESIGN.md` before serious UI implementation begins.

`DESIGN.md` should govern:

- Brand and product tone.
- Color, typography, spacing, radius, elevation, density, motion, and layout tokens.
- Component inventory and rules.
- Accessibility requirements.
- RTL/LTR behavior.
- Responsive behavior.
- AI agent rules for UI generation.
- Forbidden patterns and design drift prevention.

CSS implementation should be pure CSS:

```txt
packages/ui/src/styles/
  tokens.css
  base.css
  layout.css
  components.css
  utilities.css
  themes.css
```

Use semantic tokens and design-system classes:

```css
.ds-button {}
.ds-button--primary {}
.ds-button--sm {}
.ds-field {}
.ds-dialog {}
.ds-table {}
```

Use CSS logical properties for RTL safety.

## Headless Accessible Primitives

For simple elements, use native HTML first.

Use a headless accessible primitive library for interactive widgets whose behavior is easy to get wrong, such as:

- Dialogs.
- Drawers.
- Popovers.
- Tooltips.
- Dropdown menus.
- Tabs.
- Accordions.
- Combobox/select patterns where native controls are not enough.

The accepted direction is to use a Radix-style library, preferably Radix UI primitives initially, while applying only project-owned CSS and tokens.

This means the library may own behavior and accessibility mechanics, but it must not own the visual design.

Radix primitives should be wrapped behind project-owned design-system components. Application code should import components such as `Dialog`, `Tabs`, `Menu`, or `Popover` from `packages/ui`, not directly from Radix. This keeps the project free to replace or reduce Radix later without rewriting feature code.

## Icon Strategy

Use Tabler Icons.

Do not import arbitrary icons throughout the codebase. Create a project-owned icon wrapper and map:

```txt
packages/icons/src/icons.ts
packages/icons/src/Icon.tsx
```

The icon wrapper should standardize:

- Allowed icon names.
- Size tokens.
- Stroke width.
- Direction-sensitive icons for RTL/LTR.
- Accessible labels for meaningful icons.
- `aria-hidden` for decorative icons.

## Zustand Strategy

Use Zustand selectively where cross-component client UI state clearly fits.

Good candidates:

- Donation wizard draft state across steps.
- Video/Reels playback state.
- Media picker selection state.
- Admin table preferences, such as density, visible columns, and saved filters.
- Sidebar collapsed state.
- Theme or UI preference state if needed.

Do not use Zustand for:

- Server data.
- Authentication truth.
- Payment truth.
- CMS content.
- Form state that React Hook Form should own.
- Data that belongs in the URL.

State ownership rule:

```txt
Server data -> Server Components/native fetch or TanStack Query
Forms -> React Hook Form
URL state -> route params/search params
Small local UI state -> React useState/useReducer
Cross-component client UI state -> Zustand
```

## Constants and Configuration Strategy

Avoid hardcoding important values, but do not create one giant constants folder.

Use ownership-based constants and config:

```txt
apps/web/src/config/
  locales.ts
  routes.ts
  site.ts
  features.ts

apps/web/src/constants/
  admin.ts
  media.ts
  payment.ts

apps/web/src/features/donations/
  donation.constants.ts

apps/web/src/features/projects/
  project.constants.ts
```

Use constants/config for:

- Locale and direction configuration.
- Routes and route builders.
- Feature flags.
- Donation amount presets.
- Payment statuses and labels.
- Media upload limits.
- Admin navigation.
- Table pagination defaults.
- Validation limits and option lists.

Do not put design values in TypeScript constants. Design values belong in `DESIGN.md` and CSS design tokens.

## Localization and RTL

Persian is the default launch language.

Prepare locale-prefixed routing from the start:

```txt
/fa
/fa/projects
/fa/donate
/fa/profile
/fa/admin
```

Root `/` should redirect to `/fa`.

Prepare for:

| Locale | Direction |
|---|---|
| `fa` | RTL |
| `ar` | RTL |
| `en` | LTR |
| `tr` | LTR |
| `ru` | LTR |

Only Persian content is required for launch unless multilingual scope is separately confirmed.

## Build Now

Build these early:

1. Monorepo with `apps/api` and `apps/web`.
2. Next.js App Router foundation.
3. `DESIGN.md` design contract.
4. Pure CSS token and base style system.
5. `packages/ui` primitives and layout components.
6. `packages/icons` using Tabler Icons through `icons.ts`.
7. Locale-prefixed route structure and RTL base.
8. Public shell: header, footer, navigation, layout.
9. Donation flow UI foundation.
10. Admin shell and RBAC-aware navigation.
11. CMS block renderer foundation.
12. Media/gallery/video component foundation.

## Avoid Overengineering Now

Do not build these until justified:

- Separate public and admin frontend apps.
- Microfrontends.
- Full drag-and-drop page builder.
- Generic plugin system.
- Heavy global state architecture.
- Multi-theme design system beyond confirmed needs.
- Custom video transcoding UI and pipeline.
- International or recurring donation UI before scope confirmation.
- Published npm UI package before another project actually consumes it.

## Future Extraction Plan

Extract only after boundaries prove useful:

1. Split `apps/admin` from `apps/web` if deployment, security, bundle, or team ownership requires it.
2. Extract `packages/ui` as a shareable design-system package when another project uses it.
3. Extract `packages/cms-renderer` if CMS blocks become reusable across websites.
4. Extract donation/payment UI patterns if another fundraising project uses them.
5. Extract media/video tooling only if media workflows become a reusable product capability.

## Future E-Commerce Readiness

E-commerce is not part of the MVP unless separately confirmed, but the frontend and backend architecture should remain ready for it.

Future e-commerce should be added as separate domain modules, not mixed into donation or crowdfunding logic.

Possible future backend modules:

```txt
catalog/
products/
inventory/
cart/
orders/
checkout/
shipping/
discounts/
```

Possible future frontend features:

```txt
apps/web/src/features/
  shop/
  products/
  cart/
  checkout/
  orders/
```

Possible future routes:

```txt
/fa/shop
/fa/shop/[slug]
/fa/cart
/fa/checkout
/fa/profile/orders
/fa/admin/products
/fa/admin/orders
```

The existing choices support this future direction:

- Next.js can handle SEO-heavy product pages.
- `packages/ui` can reuse cards, forms, tables, badges, amount display, media components, checkout steps, and empty/error/loading states.
- The admin route group can add product and order management before a separate admin app is needed.
- Zustand may be used for cart UI state, while real cart/order/payment truth must live on the backend.
- Payment transactions should remain separate from donation intents and future order records.

Do not build store, cart, inventory, product ratings, or order management until e-commerce becomes confirmed scope.

## Final Checklist

- Frontend uses Next.js App Router.
- Frontend and backend live in the same monorepo.
- V1 uses one frontend app.
- Admin is internally separated, not externally split.
- Styling uses pure CSS and design tokens.
- `DESIGN.md` governs design decisions before UI implementation.
- Radix-style headless primitives are allowed for complex accessible behavior.
- Radix primitives are wrapped behind project-owned `packages/ui` components.
- Tabler Icons are used through a project-owned icon wrapper and `icons.ts`.
- Zustand is used only for appropriate client UI state.
- Constants/config are organized by ownership, not dumped into one global file.
- Persian/RTL is first-class from the start.
- Future e-commerce is architecture-ready but not part of MVP.
