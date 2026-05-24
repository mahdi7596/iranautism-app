## ADDED Requirements

### Requirement: Persian payment messages
The system SHALL return Persian human-readable messages for user-facing payment initiation, callback, verification, success, failure, and mismatch responses.

#### Scenario: Payment failure message is Persian
- **WHEN** a user-facing payment request fails
- **THEN** the displayable failure message is Persian

#### Scenario: Provider constants remain unchanged
- **WHEN** the backend communicates with Sadad
- **THEN** Sadad protocol fields, provider references, and constants retain the format required by Sadad

### Requirement: Sadad configuration
The system SHALL configure Sadad through environment variables and SHALL NOT store real Sadad secrets in source-controlled files.

#### Scenario: Missing Sadad config
- **WHEN** a live Sadad payment is requested without required Sadad configuration
- **THEN** the system fails safely without creating a live gateway request

#### Scenario: Sadad config from environment
- **WHEN** required Sadad environment variables are present
- **THEN** the Sadad gateway adapter uses those values without exposing them in logs or responses

### Requirement: Sadad payment initiation
The system SHALL initiate Sadad payment for a pending donation through the payment gateway abstraction.

#### Scenario: Payment initiation creates redirect data
- **WHEN** a pending donation payment transaction is started through Sadad
- **THEN** the system stores the provider authority/token when available and returns the redirect information needed by the frontend

### Requirement: Sadad callback handling
The system SHALL receive Sadad callback requests and record callback receipt before verification.

#### Scenario: Callback received
- **WHEN** Sadad redirects back to the backend callback endpoint
- **THEN** the system records callback metadata on the payment transaction without marking the donation confirmed yet

### Requirement: Sadad server-side verification
The system SHALL verify Sadad payment success server-to-server before confirming donations.

#### Scenario: Verification succeeds
- **WHEN** Sadad server-side verification confirms the expected transaction and amount
- **THEN** the system marks the payment transaction successful and confirms the donation

#### Scenario: Amount mismatch
- **WHEN** Sadad verification returns an amount different from the stored payment transaction amount
- **THEN** the system marks the transaction as mismatched or failed and does not confirm the donation

### Requirement: Payment idempotency
The system SHALL process repeated Sadad callbacks and verification attempts idempotently.

#### Scenario: Duplicate successful callback
- **WHEN** the same successful Sadad callback or provider reference is processed more than once
- **THEN** the system keeps one successful payment result and does not duplicate donation confirmation or Pump completion
