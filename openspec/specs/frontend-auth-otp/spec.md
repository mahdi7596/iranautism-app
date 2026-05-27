# frontend-auth-otp Specification

## Purpose
TBD - created by archiving change implement-auth-pump-frontend. Update Purpose after archive.
## Requirements
### Requirement: Persian OTP login/register page
The system SHALL provide a Persian RTL login/register page where a user enters an Iranian mobile number, receives an OTP, verifies the code, and is authenticated whether the mobile belongs to an existing user or a newly created user.

#### Scenario: User requests normal login OTP
- **WHEN** a visitor submits a valid Iranian mobile number on `/fa/login`
- **THEN** the frontend sends an OTP request with `otpPurpose` set to `login` and shows the OTP entry step in Persian

#### Scenario: Invalid mobile is rejected before request
- **WHEN** a visitor submits an invalid mobile number on the login page
- **THEN** the frontend shows a Persian validation message and does not call the OTP request API

#### Scenario: OTP verifies existing or new user
- **WHEN** a visitor enters a valid OTP for the submitted mobile number
- **THEN** the frontend stores the authenticated user state from the backend response and treats the user as logged in

### Requirement: Auth flow states
The system SHALL show Persian loading, success, error, resend, expired, rate-limited, and edit-mobile states for the OTP login/register flow.

#### Scenario: OTP request is pending
- **WHEN** the OTP request is in progress
- **THEN** the submit button is disabled and displays a Persian loading state

#### Scenario: OTP verification fails
- **WHEN** the OTP verification API rejects the code
- **THEN** the frontend keeps the user on the OTP step and shows a Persian error message

#### Scenario: User edits mobile after OTP request
- **WHEN** the user chooses to edit their mobile number after an OTP was sent
- **THEN** the frontend returns to the mobile step without treating the user as authenticated

### Requirement: Auth UI follows project design system
The system SHALL implement the login/register UI with project-owned reusable components, pure CSS design tokens, RTL-safe layout, and Tabler icons through the project icon wrapper.

#### Scenario: Login page renders on mobile
- **WHEN** `/fa/login` is opened on a mobile viewport
- **THEN** text, inputs, step controls, and buttons fit without overlap and remain readable in RTL

#### Scenario: Meaningful icons render through wrapper
- **WHEN** the login form displays phone, OTP, or navigation icons
- **THEN** the icons come from the project-owned icon wrapper and have accessible names or are hidden when decorative

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

