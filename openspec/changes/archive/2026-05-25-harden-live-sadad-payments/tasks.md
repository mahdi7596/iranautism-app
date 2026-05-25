## 1. Data And Configuration

- [x] 1.1 Add a Sadad-compatible unique numeric provider order ID field to payment transactions and create the Prisma migration.
- [x] 1.2 Update payment transaction creation to assign the numeric provider order ID for Sadad attempts while preserving UUID internal IDs.
- [x] 1.3 Update Sadad configuration parsing and tests for merchant number, terminal number, terminal key, username, and optional password as server-only values.
- [x] 1.4 Update `.env.example` files with empty Sadad placeholders and no real credential values.

## 2. Sadad Gateway Adapter

- [x] 2.1 Align Sadad request, purchase, and verify endpoint constants with the provided Sadad PDF.
- [x] 2.2 Update payment request payload generation to send numeric `OrderId`, amount, local date/time, return URL, and encrypted `SignData`.
- [x] 2.3 Update Sadad token response parsing so non-zero `ResCode` or missing token returns a safe Persian failure.
- [x] 2.4 Update Sadad verify payload and response parsing for amount, order ID, retrieval reference, system trace number, and failure codes.
- [x] 2.5 Add or update adapter unit tests for request signing, endpoint paths, token handling, verify success, verify failure, and amount mismatch.

## 3. Backend Payment Flow

- [x] 3.1 Change payment start so the backend builds or validates the Sadad backend callback URL and stores the frontend result redirect context.
- [x] 3.2 Update Sadad callback DTO/controller handling for documented POST fields and common casing variants.
- [x] 3.3 Update callback handling to find transactions by provider order ID and/or token, record safe callback metadata, verify server-to-server, and redirect to the frontend result page.
- [x] 3.4 Preserve API-style callback responses for tests or non-browser clients without weakening the browser redirect flow.
- [x] 3.5 Ensure finalized transactions short-circuit duplicate callbacks without repeating donation confirmation or Pump mission completion.
- [x] 3.6 Keep provider summaries safe by excluding credentials, raw unbounded payloads, and sensitive card data.

## 4. Frontend Handoff And Result

- [x] 4.1 Update Pump payment preparation so the frontend no longer sends the frontend result page as Sadad's direct `ReturnUrl`.
- [x] 4.2 Ensure browser handoff to Sadad uses normal navigation from the web app and does not introduce a restrictive referrer policy.
- [x] 4.3 Update the frontend result page to read the internal payment transaction ID from the backend redirect and fetch backend status only.
- [x] 4.4 Update API client/types/tests for any changed payment start or callback-result contract.
- [x] 4.5 Verify Persian success, failure, and pending result copy remains intact.

## 5. Idempotency And Integration Tests

- [x] 5.1 Add DB-backed tests for successful Sadad callback verification confirming donation and Pump completion once.
- [x] 5.2 Add tests for duplicate successful callbacks that do not double-count Pump completions.
- [x] 5.3 Add tests for failed callback, failed verify, missing token, missing result code, and amount mismatch.
- [x] 5.4 Add tests proving frontend/API status lookup uses internal payment transaction IDs rather than Sadad provider order IDs.

## 6. Documentation And Verification

- [x] 6.1 Update payment/Pump documentation and project memory with the live Sadad callback, referrer, and secret-management rules.
- [x] 6.2 Document deployment reminders: real Sadad credentials belong in the server `.env` or secret store, and Sadad portal domain/IP/callback settings must match deployment.
- [x] 6.3 Run API tests covering Sadad, payments, Pump flow, and Prisma migrations.
- [x] 6.4 Run frontend/package tests covering Pump payment start and Sadad result display.
- [x] 6.5 Run workspace typecheck/build commands required by the repo before marking implementation complete.
