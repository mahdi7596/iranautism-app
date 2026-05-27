## ADDED Requirements

### Requirement: Profile and Pump history use redesigned account surfaces
The system SHALL render `/fa/profile` and `/fa/profile/pump-missions` with the same redesigned public/account visual language as the homepage, auth, Pump, and payment result routes.

#### Scenario: Anonymous profile history prompts login clearly
- **WHEN** an anonymous user opens `/fa/profile/pump-missions`
- **THEN** the page explains in Persian that login is required and presents a clear high-contrast login action without looking like an unfinished blank page

#### Scenario: Logged-in profile provides Pump history entry
- **WHEN** a logged-in user opens `/fa/profile`
- **THEN** the page shows the user's mobile identity and a polished entry point to Pump mission history

### Requirement: Pump history states are visually complete
The system SHALL provide polished Persian loading, empty, error, pending, completed, and count states for Pump mission history.

#### Scenario: History loading state renders
- **WHEN** the frontend is checking authentication or loading Pump mission history
- **THEN** the page shows a Persian loading state that fits the account page layout

#### Scenario: Empty history guides next action
- **WHEN** a logged-in user has no Pump mission history
- **THEN** the page shows a Persian empty state and offers a relevant path back to Pump missions

#### Scenario: History error is recoverable
- **WHEN** history loading fails
- **THEN** the page shows a Persian error state and does not expose raw API or network exception text

#### Scenario: History item status is scannable
- **WHEN** completed or pending history items render
- **THEN** each item shows mission title, supported date/count/status details, and a visually clear status badge
