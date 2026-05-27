## MODIFIED Requirements

### Requirement: Payment result uses backend truth
The system SHALL display Pump mission payment result states based on backend payment verification status and SHALL NOT mark a mission completed from frontend local state or Sadad browser query parameters alone.

#### Scenario: Verified success is shown
- **WHEN** the backend reports a successful verified payment for a Pump mission donation
- **THEN** the frontend shows a Persian full-page mission-success state and a return-to-Pump action

#### Scenario: Failed payment is shown
- **WHEN** the backend reports failed, cancelled, or mismatched payment status
- **THEN** the frontend shows a Persian failure state with a recoverable action

#### Scenario: Pending payment is shown
- **WHEN** the backend reports a pending or verification-pending state
- **THEN** the frontend shows a Persian pending state without claiming mission completion

## ADDED Requirements

### Requirement: Payment result states are full-page and recoverable
The system SHALL render Sadad result states as polished full-page surfaces aligned with the redesigned public/Pump journey.

#### Scenario: Missing payment ID is understandable
- **WHEN** `/fa/payments/sadad/result` is opened without a supported internal payment transaction ID
- **THEN** the page explains the missing result in Persian and provides relevant actions such as selecting another mission or returning to Pump

#### Scenario: Result actions are clearly prioritized
- **WHEN** a success, failure, pending, or missing-ID result state renders
- **THEN** the primary and secondary actions have clear visual priority and accessible contrast

#### Scenario: Result state avoids raw provider fields
- **WHEN** a payment result error is shown
- **THEN** the page does not expose raw Sadad fields, raw gateway payloads, stack traces, or browser exception text
