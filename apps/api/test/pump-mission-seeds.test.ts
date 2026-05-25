import assert from "node:assert/strict";
import { test } from "node:test";

import {
  INITIAL_PUMP_MISSIONS,
  upsertInitialPumpMissions,
} from "../src/modules/partner-missions/pump/pump-mission-seeds";

test("INITIAL_PUMP_MISSIONS includes all Excel-defined Pump donation missions", () => {
  assert.deepEqual(INITIAL_PUMP_MISSIONS, [
    {
      missionKey: "iran-autism-medicine-support",
      resultType: "COUNT_BASED",
      campaignStartsAt: new Date("2026-05-24T00:00:00.000Z"),
    },
    {
      missionKey: "iran-autism-rehabilitation-support",
      resultType: "COUNT_BASED",
      campaignStartsAt: new Date("2026-05-24T00:00:00.000Z"),
    },
    {
      missionKey: "iran-autism-caregiving-support",
      resultType: "COUNT_BASED",
      campaignStartsAt: new Date("2026-05-24T00:00:00.000Z"),
    },
    {
      missionKey: "iran-autism-general-donation",
      resultType: "COUNT_BASED",
      campaignStartsAt: new Date("2026-05-24T00:00:00.000Z"),
    },
  ]);
});

test("upsertInitialPumpMissions writes Pump mission configuration", async () => {
  const calls: unknown[] = [];

  await upsertInitialPumpMissions({
    partnerMission: {
      upsert: async (input: unknown) => {
        calls.push(input);
      },
    },
  } as never);

  assert.equal(calls.length, 4);
  assert.deepEqual(
    calls.map(
      (call) =>
        (call as { where: { partner_missionKey: { missionKey: string } } })
          .where.partner_missionKey.missionKey,
    ),
    [
      "iran-autism-medicine-support",
      "iran-autism-rehabilitation-support",
      "iran-autism-caregiving-support",
      "iran-autism-general-donation",
    ],
  );
});
