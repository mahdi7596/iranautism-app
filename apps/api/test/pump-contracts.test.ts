import assert from "node:assert/strict";
import { test } from "node:test";

import {
  PUMP_PARTNER_KEY,
  createPumpCountVerificationResponse,
  createPumpMobileOnlyDonationIdentity,
  createPumpRegisteredDonationIdentity,
  createPumpStatusVerificationResponse,
} from "../src/modules/partner-missions/pump/pump.contracts";

test("Pump count verification response uses the documented response shape", () => {
  assert.equal(PUMP_PARTNER_KEY, "pump");
  assert.deepEqual(
    createPumpCountVerificationResponse({
      mobile: "09123456789",
      missionId: "iran-autism-general-donation",
      count: 2,
    }),
    {
      mobile: "09123456789",
      missionId: "iran-autism-general-donation",
      count: 2,
    },
  );
});

test("Pump status verification response uses the documented response shape", () => {
  assert.deepEqual(
    createPumpStatusVerificationResponse({
      mobile: "09123456789",
      missionId: "iran-autism-general-donation",
      completed: false,
    }),
    {
      mobile: "09123456789",
      missionId: "iran-autism-general-donation",
      completed: false,
    },
  );
});

test("Pump donation identity supports registered and mobile-only starts", () => {
  assert.deepEqual(
    createPumpRegisteredDonationIdentity({
      userId: "user_1",
      mobile: "09123456789",
    }),
    {
      kind: "REGISTERED",
      userId: "user_1",
      mobile: "09123456789",
    },
  );
  assert.deepEqual(
    createPumpMobileOnlyDonationIdentity({
      mobile: "09123456789",
    }),
    {
      kind: "MOBILE_ONLY",
      mobile: "09123456789",
    },
  );
});
