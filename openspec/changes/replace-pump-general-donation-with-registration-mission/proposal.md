## Why

Pump has requested that Iran Autism include a free mission so users are not forced to pay money to complete every Pump mission. The current fourth mission, `کمک به انجمن اتیسم ایران`, is a paid general donation mission, so it should be replaced with a one-time registration mission that completes through mobile OTP registration/login.

## What Changes

- Remove the public/frontend Pump mission card and detail flow for `کمک به انجمن اتیسم ایران`.
- Remove or retire the backend seed/contract expectation for `iran-autism-general-donation` as an active frontend Pump mission.
- Add a new free Pump mission for registering/logging in with a verified mobile number on the Iran Autism site.
- Treat the new registration mission as one-time and status-based, returning completion as `completed: true/false` rather than a repeatable `count`.
- Record the registration mission completion in `partner_mission_completions` without creating a donation or payment transaction.
- Allow already-registered users to complete the free mission once when they authenticate or visit the registration mission while logged in, because paid mission OTP already creates/reuses a user account.
- Add a featured image and Persian copy for the new registration mission.
- Keep the other three paid support missions unchanged as donation/payment missions.

## Capabilities

### New Capabilities

- `pump-registration-mission`: Covers the free Pump mission whose qualifying action is verified mobile registration/login rather than donation payment.

### Modified Capabilities

- `frontend-pump-missions`: Replace the frontend requirement that only spreadsheet donation missions are shown with a confirmed four-mission set that includes the free registration mission and excludes the old general donation mission.
- `pump-mission-donations`: Update backend mission alignment requirements so the active Pump mission seed set includes the three paid donation missions plus the new registration mission, while the general donation mission is no longer an active frontend mission.

## Impact

- Frontend Pump mission constants, copy, images, list page, detail flow, and tests.
- Backend Pump mission seeds, mission result type handling, registration-completion endpoint/service behavior, and tests.
- Shared mission ID types, validation, and API client contracts.
- Partner mission verification behavior for the new status-based registration mission.
- Profile/Pump history display may show a status-based registration mission alongside count-based paid missions.
