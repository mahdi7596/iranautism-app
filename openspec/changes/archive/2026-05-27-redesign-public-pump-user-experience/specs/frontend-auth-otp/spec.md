## ADDED Requirements

### Requirement: Login/register page matches redesigned public experience
The system SHALL render `/fa/login` as a polished Persian RTL account entry page that matches the redesigned app shell, typography, button hierarchy, form styling, and responsive composition.

#### Scenario: Desktop login page is balanced
- **WHEN** a user opens `/fa/login` on a desktop viewport
- **THEN** the login explanation and OTP form are balanced, readable, and visually connected to the public site design rather than appearing as a standalone utility form

#### Scenario: Mobile login page is task-focused
- **WHEN** a user opens `/fa/login` on a mobile viewport
- **THEN** the mobile number field, OTP step indicator, helper text, validation, and submit actions appear in a clear single-column flow without clipped text or awkward empty space

### Requirement: OTP form states are visually complete
The system SHALL show mobile-entry, OTP-entry, resend, edit-mobile, loading, success, validation-error, API-error, and anonymous redirect states with consistent Persian UI states.

#### Scenario: Invalid mobile is visible and recoverable
- **WHEN** a user submits an invalid mobile number
- **THEN** the page shows a Persian validation summary and field-level message using the redesigned error state pattern

#### Scenario: OTP request fails
- **WHEN** the OTP request API cannot be reached or rejects the request
- **THEN** the page keeps the user on the mobile step and shows a Persian recoverable error without raw network text

#### Scenario: OTP step explains context
- **WHEN** an OTP has been sent
- **THEN** the page shows the submitted mobile number, the OTP input, resend/edit controls, and Persian guidance in the same visual hierarchy as the mobile step
