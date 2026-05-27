# frontend-pump-missions Specification

## Purpose
TBD - created by archiving change implement-auth-pump-frontend. Update Purpose after archive.
## Requirements
### Requirement: Pump mission list uses Excel-defined missions only
The system SHALL render exactly the four Pump missions listed in `docs/source/client/pump/V1.xlsx` and SHALL NOT add a registration-only or other mission unless it is added to the mission source and confirmed later.

#### Scenario: Pump mission page lists four missions
- **WHEN** a user opens the Pump mission page
- **THEN** the page shows mission cards for medicine support, rehabilitation support, caregiving support, and general Iran Autism support only

#### Scenario: Registration mission is absent
- **WHEN** the Pump mission page renders
- **THEN** no registration-only mission card is shown

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

### Requirement: First three missions accept custom toman amounts
The system SHALL allow the first three Pump missions to accept any donation amount from a minimum of 10,000 toman, with amount stepper controls that increase or decrease by 10,000 toman and never go below 10,000 toman.

#### Scenario: Minimum amount is enforced
- **WHEN** a user selects one of the first three Pump missions
- **THEN** the amount input starts at no less than 10,000 toman and rejects lower values with a Persian validation message

#### Scenario: Stepper increases amount
- **WHEN** a user presses the increase amount control
- **THEN** the displayed toman amount increases by 10,000 toman

#### Scenario: Stepper does not go below minimum
- **WHEN** a user presses the decrease amount control at 10,000 toman
- **THEN** the amount remains 10,000 toman and the frontend does not submit a lower value

### Requirement: General donation mission uses spreadsheet threshold and ticket count
The system SHALL display the general Iran Autism Pump mission with the spreadsheet text indicating a donation above 200,000 toman and a visible 3,000 ticket reward count.

#### Scenario: General mission card displays reward
- **WHEN** the general Iran Autism mission card renders
- **THEN** it shows the 3,000 ticket count and describes the 200,000 toman qualifying threshold in Persian

### Requirement: Pump mission requires OTP-authenticated mobile identity
The system SHALL require a logged-in user identity before starting a Pump donation payment and SHALL use the authenticated user's mobile number if the user is already logged in.

#### Scenario: Logged-in user starts mission
- **WHEN** a logged-in user opens a Pump mission detail page
- **THEN** the frontend uses the authenticated mobile number and does not ask the user to enter mobile again

#### Scenario: Anonymous user starts mission
- **WHEN** an anonymous user chooses a Pump mission
- **THEN** the frontend asks for mobile, requests OTP with `otpPurpose` set to `pump_mission`, verifies the OTP, and then allows mission payment

### Requirement: Pump donation intent starts payment
The system SHALL create a Pump donation intent for the selected mission and amount, start payment for the returned payment transaction, and redirect the browser to the returned Sadad redirect URL.

#### Scenario: Pump payment starts successfully
- **WHEN** an authenticated user confirms a valid Pump mission amount
- **THEN** the frontend creates the Pump donation intent, starts the payment, and redirects to the returned `redirectUrl`

#### Scenario: Payment preparation fails
- **WHEN** donation intent creation or payment start fails
- **THEN** the frontend does not redirect and shows a Persian recoverable error state

### Requirement: Return to Pump uses temporary missions URL
The system SHALL use `https://pwa.pumpgame.ir/missions` as the current return target after Pump mission result states until Pump confirms a more specific URL.

#### Scenario: User chooses return to Pump
- **WHEN** the user clicks the return-to-Pump action after a mission result
- **THEN** the browser navigates to `https://pwa.pumpgame.ir/missions`

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

