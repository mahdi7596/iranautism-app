## MODIFIED Requirements

### Requirement: Pump mission page visual layout
The system SHALL render the Pump mission list page as a clean Persian RTL campaign surface whose first section is a two-banner slider and whose missions are image-led slider cards.

#### Scenario: First section is banner-only
- **WHEN** a user opens `/fa/missions/pump`
- **THEN** the first section contains only a two-banner slider and no extra explanatory content

#### Scenario: Roadmap is absent
- **WHEN** the Pump mission list page renders
- **THEN** the previous roadmap section is not shown

#### Scenario: Mission cards use featured images
- **WHEN** Pump missions render
- **THEN** each mission appears as a featured-image card with its mission title, amount/reward information, and primary action

#### Scenario: Missions use one-row slider
- **WHEN** Pump missions render on desktop, tablet, or mobile
- **THEN** missions are presented in one horizontal row through a slider instead of a static multi-row grid

#### Scenario: CTA contrast is readable
- **WHEN** a mission CTA or campaign CTA renders
- **THEN** its text and icon contrast clearly against its background and the control has no decorative shadow

#### Scenario: Motion preference is respected
- **WHEN** the user has reduced motion enabled
- **THEN** banner and mission slider animations are reduced or disabled without hiding content or blocking actions

### Requirement: Pump mission detail is a guided checkout journey
The system SHALL render Pump mission detail pages as focused mission checkout journeys that preserve mission context, amount selection, mobile identity, OTP verification, and payment start while removing unwanted secondary explanation.

#### Scenario: Badge is not full width
- **WHEN** a mission detail page renders
- **THEN** the mission badge is sized to its content or local context and does not span the full page width

#### Scenario: Back action is icon-only
- **WHEN** a user sees the back action to return to the Pump mission page
- **THEN** it renders as an accessible icon-only arrow without visible text

#### Scenario: RTL amount stepper order is correct
- **WHEN** the amount stepper renders in the donation card
- **THEN** the plus control appears on the right and the minus control appears on the left

#### Scenario: Toman button is removed
- **WHEN** the amount input area renders
- **THEN** no separate toman button appears below the field

#### Scenario: Post-payment explanation is removed
- **WHEN** a mission detail page renders
- **THEN** the page does not show the previous content explaining what will happen after payment

#### Scenario: Payment behavior is preserved
- **WHEN** a user completes a valid mission identity and amount flow
- **THEN** the existing donation intent, payment start, and redirect behavior remains unchanged

