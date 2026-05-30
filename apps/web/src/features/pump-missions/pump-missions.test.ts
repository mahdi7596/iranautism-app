import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  getPumpMissionById,
  pumpMissions,
  repeatableCustomAmountMissions,
} from "./pump-missions";
import { PUMP_BANNERS, PUMP_MISSION_RULES } from "./pump-missions.constants";

describe("Pump mission config", () => {
  it("renders the three paid missions plus the free registration mission", () => {
    assert.deepEqual(
      pumpMissions.map((mission) => mission.id),
      [
        "iran-autism-medicine-support",
        "iran-autism-rehabilitation-support",
        "iran-autism-caregiving-support",
        "iran-autism-site-registration",
      ],
    );
  });

  it("does not include the retired general donation mission", () => {
    assert.equal(
      (pumpMissions.map((mission) => mission.id) as readonly string[]).includes(
        "iran-autism-general-donation",
      ),
      false,
    );
  });

  it("configures the first three missions as repeatable custom amount missions without ticket counts", () => {
    assert.equal(repeatableCustomAmountMissions.length, 3);

    assert.deepEqual(
      repeatableCustomAmountMissions.map((mission) => mission.minAmountToman),
      [
        PUMP_MISSION_RULES.medicineMinAmountToman,
        PUMP_MISSION_RULES.rehabilitationMinAmountToman,
        PUMP_MISSION_RULES.caregivingMinAmountToman,
      ],
    );

    for (const mission of repeatableCustomAmountMissions) {
      assert.equal(mission.stepAmountToman, PUMP_MISSION_RULES.amountStepToman);
      assert.equal(mission.isRepeatable, true);
      assert.equal(mission.ticketCount, null);
    }
  });

  it("configures the registration mission as free and one-time", () => {
    const mission = getPumpMissionById("iran-autism-site-registration");

    assert.equal(mission?.kind, "REGISTRATION");
    assert.equal(mission?.minAmountToman, null);
    assert.equal(mission?.isRepeatable, false);
    assert.equal(mission?.ticketCount, null);
    assert.ok(mission?.medalText);
  });

  it("defines two Pump banners and featured images for every mission", () => {
    assert.equal(PUMP_BANNERS.length, 2);
    assert.equal(
      pumpMissions.every((mission) => mission.featuredImage.src && mission.featuredImage.alt),
      true,
    );
  });
});
