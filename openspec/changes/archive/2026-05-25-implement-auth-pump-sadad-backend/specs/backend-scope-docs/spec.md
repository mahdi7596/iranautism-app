## ADDED Requirements

### Requirement: Persian message rule documented
The system documentation SHALL record that all user-facing backend and frontend messages must be Persian by default.

#### Scenario: Message rule captured
- **WHEN** durable project documentation is reviewed
- **THEN** it states that user-facing API messages, validation text, frontend messages, toasts, empty states, loading states, and confirmation states are Persian by default

### Requirement: Narrowed backend scope documented
The system documentation SHALL record that the current backend focus is mobile auth, Pump mission donations, and Sadad payments.

#### Scenario: Durable docs updated
- **WHEN** this change begins implementation
- **THEN** durable project docs record the narrowed backend focus and exclude the old broad roadmap as the active implementation path

### Requirement: Temporary tracker removed
The temporary development tracker SHALL be removed after useful history and next steps are captured in durable docs.

#### Scenario: Tracker deleted after capture
- **WHEN** durable docs contain the current narrowed scope and completed foundation summary
- **THEN** `docs/temporary-development-tracker.md` is deleted

### Requirement: Secrets documented as placeholders only
Documentation SHALL refer to Pump and Sadad credentials by environment variable names only.

#### Scenario: Sadad secret documentation
- **WHEN** Sadad credentials are documented
- **THEN** the documentation uses placeholder names such as `SADAD_TERMINAL_KEY` and does not include real credential values
