import assert from "node:assert/strict";
import { test } from "node:test";

import {
  INITIAL_PUMP_MISSIONS,
  upsertInitialPumpMissions,
} from "../src/modules/partner-missions/pump/pump-mission-seeds";

test("INITIAL_PUMP_MISSIONS includes the general donation mission", () => {
  assert.deepEqual(INITIAL_PUMP_MISSIONS, [
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

  assert.deepEqual(calls, [
    {
      where: {
        partner_missionKey: {
          partner: "pump",
          missionKey: "iran-autism-general-donation",
        },
      },
      create: {
        partner: "pump",
        missionKey: "iran-autism-general-donation",
        resultType: "COUNT_BASED",
        campaignStartsAt: new Date("2026-05-24T00:00:00.000Z"),
      },
      update: {
        resultType: "COUNT_BASED",
        campaignStartsAt: new Date("2026-05-24T00:00:00.000Z"),
      },
    },
  ]);
});
