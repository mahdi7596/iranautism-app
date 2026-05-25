import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { getPumpMissionById } from "../pump-missions/pump-missions";
import { buildPumpHistoryRows, getAccountLoginRedirect } from "./account-history";

describe("account Pump history helpers", () => {
  it("maps backend history to safe display rows", () => {
    const rows = buildPumpHistoryRows([
      {
        missionId: "iran-autism-general-donation",
        completed: true,
        completionCount: 2,
        completedAt: "2026-05-25T08:00:00.000Z",
      },
    ]);
    const mission = getPumpMissionById("iran-autism-general-donation");

    assert.deepEqual(rows, [
      {
        missionId: "iran-autism-general-donation",
        missionTitle: mission?.title,
        completed: true,
        completionCount: 2,
        completedAt: "2026-05-25T08:00:00.000Z",
      },
    ]);
  });

  it("creates login redirect for anonymous profile history access", () => {
    assert.equal(
      getAccountLoginRedirect("/fa/profile/pump-missions"),
      "/fa/login?returnTo=%2Ffa%2Fprofile%2Fpump-missions",
    );
  });
});
