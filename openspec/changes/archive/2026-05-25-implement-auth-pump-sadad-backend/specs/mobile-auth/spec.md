## ADDED Requirements

### Requirement: Persian auth messages
The system SHALL return Persian human-readable messages for user-facing authentication, OTP, validation, and session responses.

#### Scenario: Auth validation message is Persian
- **WHEN** a user-facing auth request is rejected
- **THEN** the human-readable error message is Persian while machine-readable fields remain stable

#### Scenario: Auth success message is Persian
- **WHEN** a user-facing auth action succeeds and returns a displayable message
- **THEN** the message is Persian

### Requirement: Mobile OTP request
The system SHALL allow a public user to request an OTP for a normalized Iranian mobile number.

#### Scenario: OTP request accepted
- **WHEN** a user submits a valid Iranian mobile number
- **THEN** the system creates an OTP challenge and dispatches the code through the configured SMS provider boundary

#### Scenario: Invalid mobile rejected
- **WHEN** a user submits an invalid mobile number
- **THEN** the system rejects the request with a validation error and does not dispatch an OTP

### Requirement: OTP verification creates or finds user
The system SHALL verify an OTP challenge and find or create the user identified by the normalized mobile number.

#### Scenario: Existing user logs in
- **WHEN** a valid OTP is verified for a mobile number already present in `users.mobile`
- **THEN** the system authenticates that existing user and updates login metadata

#### Scenario: New user registers
- **WHEN** a valid OTP is verified for a mobile number not present in `users.mobile`
- **THEN** the system creates a user with that mobile number and authenticates the new user

### Requirement: Authenticated current user access
The system SHALL provide a protected backend endpoint for retrieving the current authenticated user.

#### Scenario: Authenticated request returns current user
- **WHEN** a request includes a valid user session or token
- **THEN** the system returns the authenticated user's id, mobile, status, and profile fields

#### Scenario: Unauthenticated request rejected
- **WHEN** a request does not include a valid user session or token
- **THEN** the system rejects the request as unauthenticated

### Requirement: OTP abuse protection
The system SHALL enforce rate limits and expiry for OTP challenges.

#### Scenario: Too many OTP requests
- **WHEN** the same mobile or client exceeds the configured OTP request limit
- **THEN** the system rejects additional OTP requests until the limit window resets

#### Scenario: Expired OTP rejected
- **WHEN** a user submits an OTP after its expiry time
- **THEN** the system rejects the verification attempt
