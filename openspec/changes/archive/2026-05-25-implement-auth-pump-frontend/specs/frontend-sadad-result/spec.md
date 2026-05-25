## ADDED Requirements

### Requirement: Payment result uses backend truth
The system SHALL display Pump mission payment result states based on backend payment verification status and SHALL NOT mark a mission completed from frontend local state or Sadad browser query parameters alone.

#### Scenario: Verified success is shown
- **WHEN** the backend reports a successful verified payment for a Pump mission donation
- **THEN** the frontend shows a Persian animated mission-success modal and a return-to-Pump action

#### Scenario: Failed payment is shown
- **WHEN** the backend reports failed, cancelled, or mismatched payment status
- **THEN** the frontend shows a Persian failure modal with a recoverable action

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
