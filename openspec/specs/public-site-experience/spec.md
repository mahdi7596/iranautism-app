# public-site-experience Specification

## Purpose
TBD - created by archiving change redesign-public-pump-user-experience. Update Purpose after archive.
## Requirements
### Requirement: Public app shell uses a deliberate RTL navigation model
The system SHALL render a public app shell whose brand placement, navigation grouping, actions, spacing, and footer are intentional for Persian RTL users on desktop and mobile.

#### Scenario: Desktop public header renders in RTL
- **WHEN** a user opens any `/fa` public, payment, or account route on a desktop viewport
- **THEN** the header shows the logo first at the RTL start, followed by main navigation items on the right side after the logo, with account/login actions visually separated from primary navigation

#### Scenario: Anonymous account entry avoids profile styling
- **WHEN** an anonymous user sees the public header
- **THEN** the account/login entry does not use a purple profile icon and clearly routes the user to `/fa/login`

#### Scenario: Logged-in account entry may use profile icon
- **WHEN** a logged-in user sees the public header
- **THEN** the account entry may use a profile icon and profile-oriented styling

#### Scenario: Mobile public header fits
- **WHEN** a user opens any `/fa` public, payment, or account route on a mobile viewport
- **THEN** the header content fits without overlap, clipped text, horizontal scrolling, or ambiguous navigation order

#### Scenario: Footer matches public shell
- **WHEN** any implemented frontend route renders with the public shell
- **THEN** the footer and repeated pre-footer area render as full-width bands whose inner content aligns with the header content width

### Requirement: Persian homepage is a real public entry point
The system SHALL render a production-ready Persian public entry point for the Iran Autism platform that follows the approved visual reference direction.

#### Scenario: Homepage hero is a three-slide slider
- **WHEN** a user opens `/fa`
- **THEN** the homepage first viewport renders a three-slide hero containing the corrected current hero concept, a `Trust & Progress` reference-led slide, and a Persian `شفافیت بالینی` reference-led slide

#### Scenario: Current hero visual issues are fixed
- **WHEN** the current hero concept slide renders
- **THEN** its image starts at the hero section start without a gap, its heart animation is visible, and its CTA buttons render without shadows

#### Scenario: Hero slider is accessible
- **WHEN** a keyboard or reduced-motion user interacts with the hero slider
- **THEN** slides can be controlled without pointer-only interaction and motion is reduced or disabled without hiding content

### Requirement: Public pages use consistent composition patterns
The system SHALL use reusable public page composition patterns for first viewports, section headings, action groups, cards, forms, sliders, and state surfaces.

#### Scenario: Titles use the corrected scale
- **WHEN** public page, section, card, or form titles render outside true hero headlines
- **THEN** they use the smaller project title scale near a `text-xl` equivalent instead of oversized display typography

#### Scenario: Buttons are flat
- **WHEN** public CTA, secondary, quiet, icon, or form buttons render
- **THEN** they do not use decorative shadow styling and preserve accessible focus, hover, active, disabled, and loading states

### Requirement: Public visual language is credible and non-generic
The system SHALL present a polished nonprofit platform visual language that feels custom to Iran Autism rather than a generic template.

#### Scenario: Brand colors are purposeful
- **WHEN** public pages render
- **THEN** purple is used for identity and trust, orange is reserved for primary actions, and neutral surfaces support readability without a one-note purple/orange page

#### Scenario: Imagery is intentional
- **WHEN** a page uses imagery
- **THEN** the image crop, placement, alt behavior, and surrounding copy support the user journey and do not feel like a rough placeholder banner

### Requirement: Login uses an auth-only layout
The system SHALL render the login page as a focused auth surface without the public header and footer.

#### Scenario: Login hides global shell chrome
- **WHEN** a user opens `/fa/login`
- **THEN** the page does not render the public header, public footer, or repeated pre-footer section

#### Scenario: Public header routes to login
- **WHEN** an anonymous user activates the public header login/account control
- **THEN** the browser navigates to `/fa/login`

