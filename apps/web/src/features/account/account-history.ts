import type { PumpMissionHistoryItem } from "@iranautism/types";

import { buildLoginPath } from "../../config/app";
import { getPumpMissionById } from "../pump-missions/pump-missions";
import { ACCOUNT_COPY } from "./account.constants";

export function buildPumpHistoryRows(items: PumpMissionHistoryItem[]) {
  return items.map((item) => {
    const mission = getPumpMissionById(item.missionId);

    return {
      missionId: item.missionId,
      missionTitle: mission?.title ?? item.missionTitle ?? ACCOUNT_COPY.history.fallbackMissionTitle,
      completed: item.completed,
      completionCount: item.completionCount,
      completedAt: item.completedAt,
    };
  });
}

export function getAccountLoginRedirect(returnTo: string) {
  return buildLoginPath("fa", returnTo);
}
