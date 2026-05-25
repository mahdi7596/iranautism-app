## ADDED Requirements

### Requirement: Pump mission list uses Excel-defined missions only
The system SHALL render exactly the four Pump missions listed in `docs/source/client/pump/V1.xlsx` and SHALL NOT add a registration-only or other mission unless it is added to the mission source and confirmed later.

#### Scenario: Pump mission page lists four missions
- **WHEN** a user opens the Pump mission page
- **THEN** the page shows mission cards for medicine support, rehabilitation support, caregiving support, and general Iran Autism support only

#### Scenario: Registration mission is absent
- **WHEN** the Pump mission page renders
- **THEN** no registration-only mission card is shown

### Requirement: Pump mission page visual layout
The system SHALL provide a modern Persian RTL Pump mission page with a campaign banner, short mission copy, spacious mission cards, purposeful animation, and orange primary mission CTAs.

#### Scenario: Banner and mission cards render
- **WHEN** a user opens `/fa/missions/pump`
- **THEN** the page displays the Iran Autism campaign banner and four mission cards with Persian titles, medal text, and clear CTA controls

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
