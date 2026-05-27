## ADDED Requirements

### Requirement: Shared UI primitives provide accessible action hierarchy
The system SHALL provide shared button, link-button, icon-button, field, alert, state, card, and layout primitives or patterns with accessible contrast, consistent sizing, RTL-safe spacing, and distinct primary, secondary, quiet, danger, disabled, hover, focus, and loading states.

#### Scenario: Primary action contrast is readable
- **WHEN** a primary CTA renders on any frontend route
- **THEN** its text and icon color meet accessible contrast against the primary CTA background and never render as accidental black-on-orange or low-contrast text

#### Scenario: Button variants are visually distinct
- **WHEN** primary, secondary, quiet, danger, disabled, and loading button states appear together or separately
- **THEN** each state is visually distinct, consistent with design tokens, and understandable without relying only on color

#### Scenario: Focus states are visible
- **WHEN** a keyboard user tabs through links, buttons, inputs, and icon buttons
- **THEN** each focused control has a visible focus indicator that is not clipped by its container

### Requirement: Shared state surfaces are production-ready
The system SHALL provide reusable loading, empty, error, success, warning, and informational state patterns that are Persian-ready, visually coherent, and suitable for public, auth, payment, and account pages.

#### Scenario: Empty state guides recovery
- **WHEN** an empty state is shown in profile or history views
- **THEN** it explains the state in Persian and provides a relevant next action when one exists

#### Scenario: Error state avoids raw technical output
- **WHEN** an API or network error reaches a user-facing frontend state
- **THEN** the visible error is Persian, recoverable, and does not expose raw provider payloads, stack traces, or browser exception text

### Requirement: Design tokens support the redesigned public experience
The system SHALL update or extend design tokens only through project-owned CSS/token files, preserving pure CSS, RTL logical properties, and the existing no-framework styling decision.

#### Scenario: Feature styling uses tokens
- **WHEN** redesigned auth, Pump, payment, profile, or homepage components are styled
- **THEN** colors, radius, spacing, typography, shadows, and motion use project-owned design tokens or documented local semantic variables

#### Scenario: No external styling framework is added
- **WHEN** the redesign is implemented
- **THEN** Tailwind, Bootstrap, DaisyUI, Material UI, or another visual CSS framework is not introduced

### Requirement: Browser QA evidence is required for visual changes
The system SHALL verify visual frontend redesign work with rendered browser checks in addition to tests, typecheck, and build.

#### Scenario: Desktop and mobile screenshots are checked
- **WHEN** the redesign implementation is considered complete
- **THEN** the implementer has inspected rendered desktop and mobile viewports for the homepage, login, Pump list/detail, payment result, and Pump history/profile states

#### Scenario: Console health is checked
- **WHEN** rendered QA is performed
- **THEN** relevant browser console errors and warnings are reviewed and either fixed or explicitly documented as environment limitations
