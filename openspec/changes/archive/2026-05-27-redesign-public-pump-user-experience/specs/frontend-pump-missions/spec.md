## MODIFIED Requirements

### Requirement: Pump mission page visual layout
The system SHALL provide a modern Persian RTL Pump mission page with a production-ready campaign first viewport, intentional campaign imagery, clear mission journey explanation, spacious mission cards, purposeful motion, accessible action hierarchy, and orange primary mission CTAs with readable text.

#### Scenario: Banner and mission cards render
- **WHEN** a user opens `/fa/missions/pump`
- **THEN** the page displays an intentional Iran Autism/Pump campaign first viewport and four mission cards with Persian titles, medal text, amount/reward information, and clear CTA controls

#### Scenario: First viewport explains the user goal
- **WHEN** a user opens `/fa/missions/pump`
- **THEN** the first viewport explains that the user can choose a support mission, verify mobile, pay securely, and return to Pump for reward verification

#### Scenario: CTA contrast is readable
- **WHEN** a mission CTA or campaign CTA renders
- **THEN** its text and icon contrast clearly against its background and do not appear as black text accidentally placed on an orange control

#### Scenario: Motion preference is respected
- **WHEN** the user has reduced motion enabled
- **THEN** mission page animations are reduced or disabled without hiding content or blocking actions

## ADDED Requirements

### Requirement: Pump mission detail is a guided checkout journey
The system SHALL render Pump mission detail pages as guided mission checkout journeys that connect mission context, amount selection, mobile identity, OTP verification, payment start, and post-payment expectations.

#### Scenario: Mission detail shows clear steps
- **WHEN** an anonymous user opens `/fa/missions/pump/[missionId]`
- **THEN** the page shows the selected mission, amount controls, mobile verification step, payment step, and what happens after payment in a clear Persian flow

#### Scenario: Authenticated mission skips duplicate mobile entry
- **WHEN** an authenticated user opens a mission detail page
- **THEN** the page shows the authenticated mobile identity as the active mission identity and does not ask for the mobile number again

#### Scenario: Mobile-only mission path feels valid
- **WHEN** an anonymous Pump participant enters and verifies a mobile number on the mission detail page
- **THEN** the UI presents this as a valid mission identity path and does not imply a full profile is required

### Requirement: Pump journey remains responsive and RTL-safe
The system SHALL make the Pump list and detail journey fit desktop and mobile viewports without layout overlap, accidental ordering, clipped controls, or confusing RTL icon direction.

#### Scenario: Mobile mission list fits
- **WHEN** `/fa/missions/pump` renders at a mobile viewport
- **THEN** the campaign first viewport, mission explanation, mission cards, and CTAs fit in one readable column without horizontal scrolling

#### Scenario: Mobile mission detail prioritizes action
- **WHEN** a mission detail page renders at a mobile viewport
- **THEN** the amount selector, mobile/OTP form, and payment CTA appear before long secondary explanation that could delay mission completion

#### Scenario: Directional icons match RTL meaning
- **WHEN** back, continue, return, or navigation icons render in the Pump journey
- **THEN** directional icons point in the direction that matches the Persian RTL interaction meaning

### Requirement: Pump API boundary states are user-safe
The system SHALL show recoverable Persian states when OTP, donation intent, or payment start calls fail before redirecting.

#### Scenario: Pump OTP request fails
- **WHEN** the Pump OTP request fails or the API is unavailable
- **THEN** the page remains on the mobile step and shows a Persian recoverable error state

#### Scenario: Payment start fails
- **WHEN** donation intent creation or payment start fails
- **THEN** the page does not redirect and shows a Persian error state with the selected amount and mission still preserved
