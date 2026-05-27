# public-site-experience Specification

## Purpose
TBD - created by archiving change redesign-public-pump-user-experience. Update Purpose after archive.
## Requirements
### Requirement: Public app shell uses a deliberate RTL navigation model
The system SHALL render a public app shell whose brand placement, navigation grouping, actions, spacing, and footer are intentional for Persian RTL users on desktop and mobile.

#### Scenario: Desktop public header renders in RTL
- **WHEN** a user opens any `/fa` public, auth, payment, or account route on a desktop viewport
- **THEN** the header shows the brand, navigation links, and primary actions in a clear RTL reading order without accidental left/right placement or visual imbalance

#### Scenario: Mobile public header fits
- **WHEN** a user opens any `/fa` public, auth, payment, or account route on a mobile viewport
- **THEN** the header content fits without overlap, clipped text, horizontal scrolling, or ambiguous navigation order

#### Scenario: Footer matches public shell
- **WHEN** any implemented frontend route renders
- **THEN** the footer uses the same visual system as the header and does not look like placeholder or default framework output

### Requirement: Persian homepage is a real public entry point
The system SHALL replace the placeholder homepage with a production-ready Persian public entry point for the Iran Autism platform.

#### Scenario: Homepage opens with product purpose
- **WHEN** a user opens `/fa`
- **THEN** the first viewport communicates the Iran Autism platform purpose and provides clear paths to the active Pump mission flow and account/login area

#### Scenario: Homepage avoids unsupported module claims
- **WHEN** the homepage references future platform areas
- **THEN** it uses conservative copy and does not imply unfinished CMS, admin, media, reports, Peyman, or construction modules are already available

#### Scenario: Homepage is visually complete
- **WHEN** the homepage renders on desktop or mobile
- **THEN** it does not contain scaffold text, framework placeholder language, empty white expanses, or unfinished technical copy

### Requirement: Public pages use consistent composition patterns
The system SHALL use reusable public page composition patterns for first viewports, section headings, action groups, cards, forms, and state surfaces.

#### Scenario: Public route composition is consistent
- **WHEN** a user moves between `/fa`, `/fa/login`, `/fa/missions/pump`, `/fa/payments/sadad/result`, and `/fa/profile/pump-missions`
- **THEN** page gutters, typography rhythm, action hierarchy, and state surfaces feel like one product experience

#### Scenario: Responsive page sections fit
- **WHEN** public pages render at desktop and mobile widths
- **THEN** headings, body copy, buttons, media, cards, and forms fit their containers without text overlap, accidental wrapping, or horizontal overflow

### Requirement: Public visual language is credible and non-generic
The system SHALL present a polished nonprofit platform visual language that feels custom to Iran Autism rather than a generic template.

#### Scenario: Brand colors are purposeful
- **WHEN** public pages render
- **THEN** purple is used for identity and trust, orange is reserved for primary actions, and neutral surfaces support readability without a one-note purple/orange page

#### Scenario: Imagery is intentional
- **WHEN** a page uses imagery
- **THEN** the image crop, placement, alt behavior, and surrounding copy support the user journey and do not feel like a rough placeholder banner

