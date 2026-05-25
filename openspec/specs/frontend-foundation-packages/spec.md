# frontend-foundation-packages Specification

## Purpose
TBD - created by archiving change implement-auth-pump-frontend. Update Purpose after archive.
## Requirements
### Requirement: Shared frontend packages provide reusable foundations
The system SHALL implement minimal shared frontend packages for UI components, icon usage, validation schemas, API client calls, shared types, design tokens, amount display, and Jalali date display before building feature pages that depend on them.

#### Scenario: Feature imports reusable UI
- **WHEN** auth, Pump, payment, or account feature code needs a button, field, modal, toast, amount display, status badge, or date display
- **THEN** it imports a project-owned reusable component instead of duplicating feature-local UI code

#### Scenario: Feature imports validation schema
- **WHEN** auth or Pump forms validate mobile, OTP, mission ID, or amount
- **THEN** they use shared validation schemas with Persian messages

### Requirement: Tabler icons are wrapped
The system SHALL use Tabler Icons only through the project-owned icon wrapper/map.

#### Scenario: Component renders icon
- **WHEN** a component renders a phone, key, ticket, gift, payment, success, warning, or navigation icon
- **THEN** the icon is imported through the project-owned icon package and receives standardized size/stroke behavior

### Requirement: Pure CSS follows DESIGN.md
The system SHALL implement styling with pure CSS, semantic design tokens, cascade layers or equivalent organization, RTL-safe logical properties, and no Tailwind, Bootstrap, Material UI, or arbitrary utility system.

#### Scenario: New component styling is added
- **WHEN** a new shared or feature component is styled
- **THEN** the styling uses project design tokens and logical CSS properties from the design system

### Requirement: Frontend user-facing messages are Persian
The system SHALL display Persian text for all frontend form labels, helper text, validation errors, loading states, toasts, empty states, result messages, and mission/payment copy in this change.

#### Scenario: API error is displayed
- **WHEN** a user-facing API error is shown in the frontend
- **THEN** the visible message is Persian

