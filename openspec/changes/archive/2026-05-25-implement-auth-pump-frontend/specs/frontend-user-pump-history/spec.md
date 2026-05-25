## ADDED Requirements

### Requirement: User dashboard links to Pump mission history
The system SHALL provide a user dashboard or profile entry point that links to the user's Pump mission history.

#### Scenario: Logged-in user sees Pump history link
- **WHEN** a logged-in user opens their dashboard or profile page
- **THEN** the page shows a Persian link to the user's Pump mission history

#### Scenario: Anonymous user cannot view history
- **WHEN** an anonymous visitor attempts to view Pump mission history
- **THEN** the frontend requires login before showing account mission history

### Requirement: Pump mission history displays Jalali dates
The system SHALL display Pump mission history dates in Jalali/Persian format whenever dates are shown to users.

#### Scenario: Mission history date renders
- **WHEN** a Pump mission history item has a completion date
- **THEN** the frontend displays that date in Jalali/Persian format

### Requirement: Pump mission history avoids unsupported details
The system SHALL show only mission history details supported by the backend contract and SHALL avoid exposing extra financial or support internals.

#### Scenario: Mission history item renders
- **WHEN** a mission history item is displayed
- **THEN** it shows the mission title, completion date, and supported completion status or count without exposing provider secrets or raw gateway payloads
