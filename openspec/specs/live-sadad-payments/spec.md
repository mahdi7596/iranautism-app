## Requirements

### Requirement: Live Sadad configuration is secret-only
The system SHALL configure live Sadad payments using server-side environment variables and SHALL NOT require or store real Sadad credential values in source-controlled files.

#### Scenario: Missing live Sadad configuration
- **WHEN** a live Sadad payment is requested without the required merchant number, terminal number, or terminal key
- **THEN** the system fails safely without sending a live request to Sadad

#### Scenario: Configured live Sadad credentials
- **WHEN** required Sadad environment variables are present on the server
- **THEN** the Sadad adapter uses those values without exposing them in API responses, frontend bundles, logs, or documentation

#### Scenario: Sadad portal credentials
- **WHEN** Sadad username or password values are configured
- **THEN** the system treats them as server-only secrets and only sends them to Sadad if the live API contract requires them

### Requirement: Sadad payment request follows the provider contract
The system SHALL request a Sadad payment token using the provider's documented request fields, endpoint, and signing format.

#### Scenario: Payment token request
- **WHEN** a pending payment transaction is started through the Sadad gateway
- **THEN** the request sent to Sadad includes merchant number, terminal number, amount, unique numeric provider order ID, local date/time, return URL, encrypted sign data, and `PanAuthenticationType` set to `2`

#### Scenario: Sign data generation
- **WHEN** the system signs a Sadad payment request
- **THEN** it encrypts `TerminalId;OrderId;Amount` with TripleDES ECB PKCS7 using the Base64 terminal key and sends the encrypted value as Base64

#### Scenario: Token response accepted
- **WHEN** Sadad returns a successful response with a token
- **THEN** the system stores the token as the provider authority and returns redirect data needed to navigate the user to Sadad

#### Scenario: Token response rejected
- **WHEN** Sadad returns a non-success response or omits the token
- **THEN** the system keeps the donation unconfirmed and returns a Persian user-facing failure message

### Requirement: Provider order IDs are Sadad-compatible
The system SHALL use a unique numeric provider order ID for Sadad while preserving the internal payment transaction identifier.

#### Scenario: Numeric provider order ID created
- **WHEN** a Sadad payment attempt is created
- **THEN** the system assigns a unique numeric provider order ID suitable for Sadad's `OrderId` field

#### Scenario: Internal identifier preserved
- **WHEN** frontend or internal APIs refer to payment status
- **THEN** they use the internal payment transaction identifier rather than exposing the numeric provider order ID as the primary application identifier

#### Scenario: Callback lookup by provider order ID
- **WHEN** Sadad posts a callback with `OrderId`
- **THEN** the system can locate the corresponding payment transaction using the stored numeric provider order ID

### Requirement: Sadad browser return is verified server-side
The system SHALL route Sadad's browser return through a backend callback that records receipt and performs server-side verification before showing the final frontend result.

#### Scenario: Sadad POST callback received
- **WHEN** Sadad posts callback fields including token, result code, and order ID to the return URL
- **THEN** the backend records safe callback metadata on the payment transaction before attempting verification

#### Scenario: Callback missing required token
- **WHEN** the Sadad callback does not include a token
- **THEN** the backend rejects the callback with a Persian user-facing error and does not confirm the donation

#### Scenario: Callback missing required result code
- **WHEN** the Sadad callback does not include a result code
- **THEN** the backend rejects the callback with a Persian user-facing error and does not confirm the donation

#### Scenario: Backend redirects after callback handling
- **WHEN** callback handling reaches a final or pending payment state
- **THEN** the backend redirects the browser to the frontend payment result page with the internal payment transaction identifier

### Requirement: Sadad verification is the payment source of truth
The system SHALL confirm donations and Pump mission completions only after a successful Sadad server-side verification response.

#### Scenario: Verification succeeds
- **WHEN** Sadad verification returns a successful result for the expected token, order ID, and amount
- **THEN** the system marks the payment transaction successful, confirms the donation, records safe provider references, and updates the Pump mission completion

#### Scenario: Verification amount mismatch
- **WHEN** Sadad verification returns an amount different from the stored payment transaction amount
- **THEN** the system marks the payment transaction as mismatched and does not confirm the donation or Pump mission completion

#### Scenario: Verification fails
- **WHEN** Sadad verification returns a failure result
- **THEN** the system marks the payment transaction failed with a safe failure code and does not confirm the donation or Pump mission completion

#### Scenario: Verification unavailable
- **WHEN** Sadad verification cannot be completed because of a transient network or provider error
- **THEN** the system does not confirm the donation and exposes a pending or failed Persian result that can be retried safely

### Requirement: Sadad callbacks are idempotent
The system SHALL process repeated Sadad callbacks and repeated verification attempts idempotently.

#### Scenario: Duplicate successful callback
- **WHEN** the same successful Sadad callback is received more than once
- **THEN** the system keeps one successful payment result and does not duplicate donation confirmation or Pump mission completion

#### Scenario: Already finalized payment
- **WHEN** a callback is received for a payment transaction already marked successful, failed, mismatched, expired, cancelled, or refunded
- **THEN** the system returns or redirects to the stored final state without re-running side effects

#### Scenario: Duplicate provider reference
- **WHEN** Sadad verification returns a provider reference that is already associated with a finalized transaction
- **THEN** the system prevents duplicate successful payment records

### Requirement: Sadad handoff preserves registered referrer expectations
The system SHALL perform browser handoff to Sadad in a way that is compatible with Sadad's registered domain and referrer validation.

#### Scenario: Payment handoff from web domain
- **WHEN** the user is redirected to Sadad from the Iran Autism web app
- **THEN** the handoff uses browser navigation that allows Sadad to receive an acceptable registered origin/referrer

#### Scenario: Restrictive referrer policy avoided
- **WHEN** payment pages or handoff responses are rendered
- **THEN** they do not set a restrictive referrer policy that prevents Sadad from validating the registered origin

#### Scenario: Registered deployment values documented
- **WHEN** the app is prepared for server deployment
- **THEN** the deployment notes identify that the live domain, callback URL, server IP, and Sadad credentials must match Sadad portal configuration without committing any real secret values

### Requirement: Frontend result displays backend payment truth
The system SHALL show Sadad payment results based on backend payment status rather than trusting raw browser callback parameters.

#### Scenario: Successful callback result page
- **WHEN** the browser reaches the frontend result page after backend callback handling
- **THEN** the frontend fetches the payment status by internal payment transaction identifier and displays the Persian success state when the backend status is successful

#### Scenario: Failed callback result page
- **WHEN** the frontend result page receives an internal payment transaction identifier for a failed or mismatched transaction
- **THEN** it displays the Persian failure state and allows the user to retry where appropriate

#### Scenario: Pending callback result page
- **WHEN** verification is still pending
- **THEN** the frontend displays a Persian pending state and does not claim the donation or Pump mission was completed
