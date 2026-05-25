## ADDED Requirements

### Requirement: Persian Pump mission messages
The system SHALL return Persian human-readable messages for user-facing Pump mission donation, validation, and completion responses.

#### Scenario: Pump donation message is Persian
- **WHEN** a user-facing Pump donation request succeeds or fails with a displayable message
- **THEN** the message is Persian

#### Scenario: Pump partner protocol fields remain stable
- **WHEN** Pump calls a server-to-server verification endpoint
- **THEN** protocol field names and required partner response shapes remain compatible with Pump while any human-readable message remains Persian

### Requirement: Pump donation intent supports registered users
The system SHALL allow an authenticated user to start a Pump mission donation intent linked to their `user_id` and mobile snapshot.

#### Scenario: Authenticated Pump donation intent
- **WHEN** an authenticated user starts a Pump mission donation with a valid mission id and amount
- **THEN** the system creates a pending registered donation linked to the user and creates a pending payment transaction

### Requirement: Pump donation intent supports mobile-only users
The system SHALL allow a Pump mission donation intent to be started with a normalized mobile number without requiring a registered user account.

#### Scenario: Mobile-only Pump donation intent
- **WHEN** a mobile-only Pump user starts a mission donation with a valid mobile number, mission id, and amount
- **THEN** the system creates a pending guest donation with `user_id` null and `mobile_snapshot` set to the normalized mobile

### Requirement: Pump mission completion follows verified payment
The system SHALL record Pump mission completion only after the related donation payment has been verified as successful.

#### Scenario: Successful Sadad payment completes mission
- **WHEN** Sadad verification succeeds for a Pump mission donation
- **THEN** the system confirms the donation and creates or updates the Pump mission completion for the donation mobile snapshot

#### Scenario: Failed payment does not complete mission
- **WHEN** Sadad verification fails or the payment amount does not match the donation
- **THEN** the system does not confirm the donation and does not create or increment Pump mission completion

### Requirement: Pump verification by mobile
The system SHALL allow Pump to verify mission completion by mission id and mobile number.

#### Scenario: Repeatable mission returns count
- **WHEN** Pump verifies a count-based mission for a mobile number
- **THEN** the system returns the normalized mobile, mission id, and current qualifying completion count

#### Scenario: One-time mission returns completion status
- **WHEN** Pump verifies a status-based mission for a mobile number
- **THEN** the system returns the normalized mobile, mission id, and completed status

### Requirement: Pump partner endpoint authentication
The system SHALL protect Pump server-to-server endpoints with partner API authentication.

#### Scenario: Missing partner API key rejected
- **WHEN** Pump verification is requested without the configured partner API key
- **THEN** the system rejects the request as unauthorized

#### Scenario: Valid partner API key accepted
- **WHEN** Pump verification is requested with the configured partner API key
- **THEN** the system processes the verification request
