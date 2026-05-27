# frontend-sadad-result Specification

## Purpose
TBD - created by archiving change implement-auth-pump-frontend. Update Purpose after archive.
## Requirements
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

### Requirement: Result modal is accessible and motion-safe
The system SHALL implement success and failure result modals with accessible dialog behavior, focus management, readable Persian text, and reduced-motion support.

#### Scenario: Result modal opens
- **WHEN** a payment result state is available
- **THEN** focus moves into the modal and the modal has an accessible Persian title

#### Scenario: Reduced motion result
- **WHEN** reduced motion is enabled
- **THEN** decorative result animation is reduced while the success or failure content remains visible

### Requirement: Duplicate result handling is idempotent in UI
The system SHALL tolerate repeated Sadad returns or result page refreshes without duplicating success messages, duplicate payment starts, or contradictory mission states.

#### Scenario: User refreshes success result
- **WHEN** the user refreshes a successful payment result page
- **THEN** the frontend fetches or reads the backend status again and shows the same successful state without creating a new payment

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

