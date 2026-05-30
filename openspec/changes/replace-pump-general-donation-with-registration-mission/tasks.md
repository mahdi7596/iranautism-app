## 1. Shared Mission Contracts

- [x] 1.1 Add the new `iran-autism-site-registration` mission ID to shared Pump mission types.
- [x] 1.2 Update mission ID validation to accept the registration mission and retire active use of `iran-autism-general-donation`.
- [x] 1.3 Split or guard shared API request types so donation intent creation is used only by paid Pump missions.
- [x] 1.4 Add shared response/client contract support for completing a free registration mission.

## 2. Backend Partner Mission Behavior

- [x] 2.1 Update Pump mission seeds so medicine, rehabilitation, and caregiving remain `COUNT_BASED`, and registration is seeded as `STATUS_BASED`.
- [x] 2.2 Add an authenticated registration mission completion service method that records completion by mission and authenticated mobile without donation/payment records.
- [x] 2.3 Make registration completion idempotent for duplicate requests from the same mission/mobile.
- [x] 2.4 Store `userId`, `mobileSnapshot`, `completed: true`, `completionCount: 0`, and `lastQualifiedAt` for registration mission completions.
- [x] 2.5 Add a public authenticated endpoint for completing the Pump registration mission.
- [x] 2.6 Ensure Pump verification returns `completed: true/false` for the registration mission and count responses only for paid count-based missions.
- [x] 2.7 Preserve paid mission donation intent, Sadad payment, and verified completion behavior for the three support missions.

## 3. Frontend Mission Experience

- [x] 3.1 Replace the general donation mission constant with the free registration mission constant, Persian copy, status-based metadata, and featured image.
- [x] 3.2 Update Pump mission list copy so it explains three paid support missions and one free registration mission.
- [x] 3.3 Update mission card rendering so the registration mission shows free/registration information instead of amount and ticket count copy.
- [x] 3.4 Split mission detail behavior so paid missions keep amount/payment controls while the registration mission shows OTP/auth completion controls only.
- [x] 3.5 For logged-in users, let the registration mission complete without duplicate mobile entry.
- [x] 3.6 For anonymous users, reuse Pump OTP verification before calling registration mission completion.
- [x] 3.7 Show Persian loading, success, duplicate-safe, and recoverable error states for registration mission completion.
- [x] 3.8 Keep profile/history rendering tolerant of status-based registration completions and retired mission IDs.

## 4. Documentation And Product Memory

- [x] 4.1 Update Pump module documentation to replace the general donation mission with the registration mission and record the one-time/status-based rule.
- [x] 4.2 Update the phase 1 Pump flow summary to include the free registration mission path.
- [x] 4.3 Update module registry or AGENTS project memory with the mission replacement and any remaining client/Pump confirmation items.
- [x] 4.4 Keep exact Pump reward wording and final image source marked as needs confirmation if not yet approved.

## 5. Tests And Verification

- [x] 5.1 Add backend tests for registration mission completion by logged-in user, duplicate completion idempotency, and no donation/payment creation.
- [x] 5.2 Add backend tests for Pump verification returning status-based registration results.
- [x] 5.3 Update existing backend tests that expect four donation missions or the general donation mission.
- [x] 5.4 Add frontend tests for mission list replacement and registration mission detail behavior.
- [x] 5.5 Update paid mission frontend tests to ensure payment flow remains unchanged for the three support missions.
- [x] 5.6 Run OpenSpec validation for the change.
- [x] 5.7 Run relevant API, shared package, and web tests.
- [x] 5.8 If frontend UI changes are implemented, run the app and verify the Pump mission list/detail pages in browser screenshots across desktop and mobile.
