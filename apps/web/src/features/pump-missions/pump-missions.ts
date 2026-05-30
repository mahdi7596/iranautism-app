import { PUMP_MISSIONS } from "./pump-missions.constants";
import type { PumpDonationMission, PumpMission } from "./pump-missions.constants";

export type { PumpDonationMission, PumpMission } from "./pump-missions.constants";

export const pumpMissions: readonly PumpMission[] = PUMP_MISSIONS;

export const repeatableCustomAmountMissions = pumpMissions.filter(
  (mission): mission is PumpDonationMission =>
    mission.kind === "DONATION" && mission.ticketCount === null,
);

export function getPumpMissionById(missionId: string) {
  return pumpMissions.find((mission) => mission.id === missionId) ?? null;
}
