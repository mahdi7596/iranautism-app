## MODIFIED Requirements

### Requirement: Pump mission list uses Excel-defined missions only
The system SHALL render the confirmed active Pump mission set as four mission cards: medicine support, rehabilitation support, caregiving support, and free site registration. The system SHALL NOT render the retired general Iran Autism donation mission as an active Pump mission.

#### Scenario: Pump mission page lists four missions
- **WHEN** a user opens the Pump mission page
- **THEN** the page shows mission cards for medicine support, rehabilitation support, caregiving support, and free site registration only

#### Scenario: General donation mission is absent
- **WHEN** the Pump mission page renders
- **THEN** no active mission card for `کمک به انجمن اتیسم ایران` is shown

#### Scenario: Registration mission is present
- **WHEN** the Pump mission page renders
- **THEN** a free registration mission card is shown with Persian copy, a featured image, and a clear start action

### Requirement: Pump mission page visual layout
The system SHALL provide a modern Persian RTL Pump mission page with a production-ready campaign first viewport, intentional campaign imagery, clear mission journey explanation, spacious mission cards, purposeful motion, accessible action hierarchy, and orange primary mission CTAs with readable text.

#### Scenario: Banner and mission cards render
- **WHEN** a user opens `/fa/missions/pump`
- **THEN** the page displays an intentional Iran Autism/Pump campaign first viewport and four mission cards with Persian titles, medal text, amount or free-registration information, and clear CTA controls

#### Scenario: First viewport explains the user goal
- **WHEN** a user opens `/fa/missions/pump`
- **THEN** the first viewport explains that the user can choose a support or registration mission, verify mobile, complete any required payment for paid missions, and return to Pump for reward verification

#### Scenario: CTA contrast is readable
- **WHEN** a mission CTA or campaign CTA renders
- **THEN** its text and icon contrast clearly against its background and do not appear as black text accidentally placed on an orange control

#### Scenario: Motion preference is respected
- **WHEN** the user has reduced motion enabled
- **THEN** mission page animations are reduced or disabled without hiding content or blocking actions

### Requirement: Pump mission requires OTP-authenticated mobile identity
The system SHALL require a logged-in user identity before completing a Pump mission and SHALL use the authenticated user's mobile number if the user is already logged in.

#### Scenario: Logged-in user starts mission
- **WHEN** a logged-in user opens a Pump mission detail page
- **THEN** the frontend uses the authenticated mobile number and does not ask the user to enter mobile again

#### Scenario: Anonymous user starts mission
- **WHEN** an anonymous user chooses a Pump mission
- **THEN** the frontend asks for mobile, requests OTP with `otpPurpose` set to `pump_mission`, verifies the OTP, and then allows the mission's paid or free completion action

### Requirement: Pump mission detail is a guided checkout journey
The system SHALL render Pump mission detail pages as guided mission journeys that connect mission context, mobile identity, OTP verification, and the relevant completion action for the selected mission.

#### Scenario: Paid mission detail shows clear steps
- **WHEN** an anonymous user opens a paid support mission detail page
- **THEN** the page shows the selected mission, amount controls, mobile verification step, payment step, and what happens after payment in a clear Persian flow

#### Scenario: Registration mission detail shows free completion steps
- **WHEN** an anonymous user opens the registration mission detail page
- **THEN** the page shows the selected mission, mobile verification step, free completion action, and return-to-Pump guidance without amount controls or Sadad payment copy

#### Scenario: Authenticated mission skips duplicate mobile entry
- **WHEN** an authenticated user opens a mission detail page
- **THEN** the page shows the authenticated mobile identity as the active mission identity and does not ask for the mobile number again

#### Scenario: Mobile-only mission path feels valid
- **WHEN** an anonymous Pump participant enters and verifies a mobile number on the mission detail page
- **THEN** the UI presents this as a valid mission identity path and does not imply a full profile is required

## REMOVED Requirements

### Requirement: General donation mission uses spreadsheet threshold and ticket count
**Reason**: Pump requested a free mission so users are not forced to pay money for every mission, and the general donation mission is being replaced by the free registration mission.

**Migration**: Remove the general donation mission from active frontend mission constants and routes. Preserve historical backend records and history rendering tolerance for retired or unknown mission IDs.
