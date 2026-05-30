## MODIFIED Requirements

### Requirement: Pump mission seeds include all frontend missions
The system SHALL have backend Pump mission configuration for all active frontend mission cards so frontend mission IDs, backend seed keys, and Pump verification keys remain aligned. The active set SHALL include the three paid support missions and the free registration mission, and SHALL NOT expose the retired general donation mission as an active frontend mission.

#### Scenario: Medicine mission exists
- **WHEN** the frontend starts the medicine-support Pump mission
- **THEN** the backend recognizes that mission ID as a valid Pump mission

#### Scenario: Rehabilitation mission exists
- **WHEN** the frontend starts the rehabilitation-support Pump mission
- **THEN** the backend recognizes that mission ID as a valid Pump mission

#### Scenario: Caregiving mission exists
- **WHEN** the frontend starts the caregiving-support Pump mission
- **THEN** the backend recognizes that mission ID as a valid Pump mission

#### Scenario: Registration mission exists
- **WHEN** the frontend starts the free registration Pump mission
- **THEN** the backend recognizes that mission ID as a valid status-based Pump mission

#### Scenario: General donation mission is not active
- **WHEN** the active Pump mission seed set is applied
- **THEN** `iran-autism-general-donation` is not treated as one of the active frontend Pump mission IDs
