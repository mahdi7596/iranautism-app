import assert from "node:assert/strict";
import { test } from "node:test";

import {
  PUMP_PARTNER_KEY,
  createPumpCountVerificationResponse,
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
