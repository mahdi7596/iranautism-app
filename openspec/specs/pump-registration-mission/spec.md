# pump-registration-mission Specification

## Purpose
TBD - created by archiving change replace-pump-general-donation-with-registration-mission. Update Purpose after archive.
## Requirements
### Requirement: Free Pump registration mission completes through verified mobile identity
The system SHALL provide a free Pump mission whose qualifying action is verified mobile registration/login on the Iran Autism platform.

#### Scenario: Anonymous user completes registration mission with OTP
- **WHEN** an anonymous user starts the registration mission and verifies an Iranian mobile number through the Pump OTP flow
- **THEN** the backend creates or reuses the user for that mobile number and records the registration mission as completed for that mobile

#### Scenario: Logged-in user completes registration mission
- **WHEN** a logged-in user starts the registration mission
- **THEN** the backend records the registration mission as completed for the authenticated user's mobile without asking for payment

#### Scenario: Already-registered mobile can qualify
- **WHEN** a mobile number already exists because the user previously registered or completed a paid Pump mission
- **THEN** the registration mission can still be completed once for that mobile after the user authenticates or is already logged in

### Requirement: Registration mission is one-time and status-based
The system SHALL model the registration mission as a non-repeatable status-based Pump mission.

#### Scenario: Pump verifies completed registration mission
- **WHEN** Pump verifies the registration mission for a mobile number that has completed it
- **THEN** the verification response returns the mobile, mission ID, and `completed: true`

#### Scenario: Pump verifies incomplete registration mission
- **WHEN** Pump verifies the registration mission for a mobile number that has not completed it
- **THEN** the verification response returns the mobile, mission ID, and `completed: false`

#### Scenario: Repeated completion does not increase count
- **WHEN** the same authenticated mobile completes the registration mission more than once
- **THEN** the backend keeps a single completed record and does not increment a count value

### Requirement: Registration mission does not create financial records
The system SHALL record registration mission completion without creating donation or payment transaction records.

#### Scenario: Registration completion avoids donation pipeline
- **WHEN** the registration mission is completed
- **THEN** no donation intent, donation confirmation, payment transaction, Sadad redirect, or Sadad verification is created for that mission

#### Scenario: Paid missions still use payment
- **WHEN** a user starts one of the three paid Pump support missions
- **THEN** the mission still follows the donation intent, Sadad payment, and verified payment completion flow

### Requirement: Registration mission completion is idempotent by mobile
The system SHALL enforce one registration mission completion per mission and normalized mobile number.

#### Scenario: Duplicate completion request
- **WHEN** two registration completion requests are made for the same mission and mobile
- **THEN** the backend returns a successful completed result without creating duplicate completion rows

#### Scenario: Completion stores user when available
- **WHEN** the registration mission is completed by an authenticated user
- **THEN** the completion record stores the authenticated user ID and mobile snapshot where available

