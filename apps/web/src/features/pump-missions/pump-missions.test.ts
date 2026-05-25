import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  getPumpMissionById,
  pumpMissions,
  repeatableCustomAmountMissions,
} from "./pump-missions";
import { PUMP_MISSION_RULES } from "./pump-missions.constants";

describe("Pump mission config", () => {
  it("renders exactly the four Excel-defined missions", () => {
    assert.deepEqual(
      pumpMissions.map((mission) => mission.id),
      [
        "iran-autism-medicine-support",
        "iran-autism-rehabilitation-support",
        "iran-autism-caregiving-support",
        "iran-autism-general-donation",
      ],
    );
  });

  it("does not include a registration-only mission", () => {
    assert.equal(
      pumpMissions.some((mission) => mission.id.includes("registration")),
      false,
    );
  });

  it("configures the first three missions as repeatable custom amount missions without ticket counts", () => {
    assert.equal(repeatableCustomAmountMissions.length, 3);

    for (const mission of repeatableCustomAmountMissions) {
      assert.equal(mission.minAmountToman, PUMP_MISSION_RULES.customMinAmountToman);
      assert.equal(mission.stepAmountToman, PUMP_MISSION_RULES.amountStepToman);
      assert.equal(mission.isRepeatable, true);
      assert.equal(mission.ticketCount, null);
    }
  });

  it("uses the spreadsheet threshold and ticket count for the general donation mission", () => {
    const mission = getPumpMissionById("iran-autism-general-donation");

    assert.equal(mission?.minAmountToman, PUMP_MISSION_RULES.generalMinAmountToman);
    assert.equal(mission?.ticketCount, PUMP_MISSION_RULES.generalTicketCount);
    assert.ok(mission?.medalText);
  });
});
