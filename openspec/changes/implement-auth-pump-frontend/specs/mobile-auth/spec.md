## ADDED Requirements

### Requirement: OTP purpose for SMS template selection
The system SHALL accept an OTP purpose for user-facing OTP requests so normal login/register and Pump mission login can use different SMS provider templates.

#### Scenario: Normal login OTP purpose
- **WHEN** the frontend requests OTP from the normal login/register page
- **THEN** the request includes `otpPurpose` set to `login` and the backend selects the normal login SMS template

#### Scenario: Pump mission OTP purpose
- **WHEN** the frontend requests OTP from a Pump mission page
- **THEN** the request includes `otpPurpose` set to `pump_mission` and the backend selects the Pump mission SMS template

#### Scenario: Unsupported OTP purpose rejected
- **WHEN** an OTP request includes an unsupported purpose value
- **THEN** the backend rejects the request with a Persian validation error and does not dispatch an SMS
