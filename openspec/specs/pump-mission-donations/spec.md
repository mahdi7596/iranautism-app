# pump-mission-donations Specification

## Purpose
TBD - created by archiving change implement-auth-pump-frontend. Update Purpose after archive.
## Requirements
### Requirement: Authenticated Pump donation intent links user
The system SHALL allow an authenticated frontend user to start a Pump mission donation intent that links the donation to the authenticated `user_id` and stores the authenticated mobile as the donation mobile snapshot.

#### Scenario: Authenticated Pump donation creates registered donation
- **WHEN** a valid authenticated user starts a Pump mission donation intent
- **THEN** the backend creates a pending donation with `user_id` set to that user, donor kind registered, and mobile snapshot matching the authenticated user's mobile

#### Scenario: Authenticated mobile is source of truth
- **WHEN** a Pump donation intent request includes an authenticated user token
- **THEN** the backend uses the authenticated user's mobile as the mission identity anchor and does not trust a conflicting submitted mobile value

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

