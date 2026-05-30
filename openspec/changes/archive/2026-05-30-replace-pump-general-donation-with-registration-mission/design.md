## Context

Pump currently has four Iran Autism missions in the product surface: three repeatable donation missions and one general donation mission. All active mission detail flows currently assume a donation amount, Sadad payment, and backend payment verification before mission completion is recorded.

Pump has asked for at least one free mission so users can complete a mission without paying. The existing mobile OTP flow already creates or reuses a `User` by mobile number, and `partner_mission_completions.qualifyingDonationId` is nullable, so the data model can represent a registration-based mission completion without forcing it through donation/payment tables.

## Goals / Non-Goals

**Goals:**

- Replace the active general donation mission with a free registration/login mission.
- Keep the active Pump mission list at four missions: three paid support missions plus one free registration mission.
- Complete the registration mission once per unique mobile number.
- Record registration mission completion as status-based partner mission completion with no donation or payment transaction.
- Let already-registered users complete the free mission once after they authenticate or open the registration mission while logged in.
- Keep all user-facing copy and states Persian by default.

**Non-Goals:**

- Do not redesign the full Pump visual system again beyond the new mission card/detail states and image.
- Do not change Sadad behavior for the three paid missions.
- Do not add admin/support UI for manual mission investigation in this change.
- Do not introduce a new account profile completion requirement beyond verified mobile registration/login.
- Do not promise exact Pump reward wording beyond what Pump/client confirms.

## Decisions

### Use a status-based registration mission

The new mission will use a stable mission key such as `iran-autism-site-registration` and `STATUS_BASED` result type. Pump verification for this mission returns the mobile number and `completed: true/false`.

Alternative considered: make registration count-based and return `count: 1`. That would blur the meaning of a one-time registration action and conflict with the user's requirement that the mission should not have a count.

### Record completion in Partner Missions, not Donations

Registration completion will write to `partner_mission_completions` with `completed: true`, `completionCount: 0`, `lastQualifiedAt`, `mobileSnapshot`, and `userId` when available. It will not create a `Donation` or `PaymentTransaction`.

Alternative considered: create a zero-amount donation. That would pollute financial reporting, complicate gateway assumptions, and make a non-financial action look like a financial record.

### Reuse OTP registration/login as the qualifying action

The qualifying action is verified mobile identity through the existing OTP flow. If the user is already authenticated, the frontend can call the registration mission completion action immediately after explicit user intent on the mission detail page.

Alternative considered: automatically complete the mission for every existing user in the database. That could grant Pump completion without a user intentionally starting the Pump mission and could be surprising for support/debugging.

### Keep paid mission flow separate from free mission flow

The three existing paid missions continue to show amount controls and payment start. The free registration mission should show mobile/OTP identity and a completion CTA/result state, not amount controls, Sadad copy, or payment result routing.

Alternative considered: reuse the current mission detail component with hidden amount set to zero. That would leave payment-specific assumptions in the UI and service contracts, making future partner missions harder to reason about.

### Retire the general donation mission from active Pump surfaces

The old `iran-autism-general-donation` mission should be removed from active frontend mission constants and from the active backend seed set used for current mission alignment. Existing historical completions/payments may remain in the database for audit/history, but new starts should not route users to the retired mission.

Alternative considered: keep the general mission hidden but valid for new API starts. That increases ambiguity because the UI, types, and Pump-facing mission catalog would disagree.

## Risks / Trade-offs

- Existing users may expect the free mission to complete automatically without opening it -> Mitigation: require explicit completion through the registration mission page while allowing already-authenticated users to complete in one click.
- The current shared type name `PumpMissionId` assumes donation mission IDs only -> Mitigation: extend the union and ensure API methods distinguish paid donation starts from registration completion.
- Pump may require different field names for status missions -> Mitigation: keep the domain result as status-based and adapt only the Pump response contract if Pump confirms different names.
- Retiring the old mission could affect historical profile rows -> Mitigation: keep history rendering resilient to unknown/retired mission IDs and preserve backend records.
- Users who paid in another mission are already registered -> Mitigation: allow those users to complete the free mission once; this is expected and does not conflict with unique mobile constraints.

## Migration Plan

1. Add the new registration mission key to shared types and validation.
2. Update backend mission seeds so active Pump missions are the three paid missions plus registration.
3. Add a registration completion service/endpoint that is authenticated and idempotent per mission/mobile.
4. Update frontend mission constants, copy, and imagery to replace the old general donation card.
5. Split mission detail behavior so paid missions use payment and the registration mission uses OTP/auth completion.
6. Update tests for mission lists, paid payment flow, registration completion, verification, and history.
7. Deploy backend before or with frontend so the new mission key is recognized when the page goes live.

Rollback can reintroduce the general donation mission constants/seeds and hide the registration mission, while preserving any registration completion records as harmless partner mission history.

## Open Questions

- What exact Persian title, medal title, and reward copy should Pump/client approve for the free registration mission?
- Should Pump provide a dedicated featured image, or should Iran Autism generate/use a project-owned registration image?
- Should the old general donation mission remain verifiable for historical Pump checks after it is removed from active mission starts?
