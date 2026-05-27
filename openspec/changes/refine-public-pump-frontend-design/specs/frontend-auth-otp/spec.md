## MODIFIED Requirements

### Requirement: Login page is visually focused
The system SHALL render the login/register OTP flow as a focused Persian auth page without the normal public header, footer, or repeated public pre-footer.

#### Scenario: Login page excludes public chrome
- **WHEN** a user opens `/fa/login`
- **THEN** the page shows the OTP login/register experience without rendering the global public header, footer, or repeated pre-footer

#### Scenario: Login remains reachable
- **WHEN** an anonymous user uses the public header account/login control
- **THEN** the user is routed to `/fa/login`

#### Scenario: Login preserves OTP behavior
- **WHEN** a user submits mobile and OTP steps
- **THEN** existing mobile validation, OTP request, OTP verification, loading, error, and success behavior remains unchanged

