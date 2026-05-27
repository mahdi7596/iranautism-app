## MODIFIED Requirements

### Requirement: Frontend design primitives are reusable and token-driven
The system SHALL provide reusable frontend primitives and design tokens that prevent repeated page-local styling for common UI patterns.

#### Scenario: Titles use reusable tokens
- **WHEN** a page, section, card, form, or panel needs a title
- **THEN** it uses shared typography tokens/classes with the corrected smaller title scale instead of one-off large heading styles

#### Scenario: Buttons use reusable variants
- **WHEN** a button or link-button is needed
- **THEN** it uses shared variants for primary, secondary, quiet, icon-only, disabled, and loading states without decorative shadows

#### Scenario: Sliders use shared composition
- **WHEN** homepage hero, Pump banner, or Pump mission sliders are implemented
- **THEN** they reuse a shared accessible slider composition or shared slider primitives rather than unrelated one-off implementations

#### Scenario: Feature components stay scoped
- **WHEN** a component is generic across the frontend
- **THEN** it belongs in `packages/ui`; when it is Iran Autism/Pump-specific, it belongs in `apps/web/src/features/*`

