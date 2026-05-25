import { PUMP_MISSIONS } from "./pump-missions.constants";
import type { PumpMission } from "./pump-missions.constants";

export type { PumpMission } from "./pump-missions.constants";

export const pumpMissions = PUMP_MISSIONS;

export const repeatableCustomAmountMissions = pumpMissions.filter(
  (mission) => mission.ticketCount === null,
);

export function getPumpMissionById(missionId: string) {
  return pumpMissions.find((mission) => mission.id === missionId) ?? null;
}
