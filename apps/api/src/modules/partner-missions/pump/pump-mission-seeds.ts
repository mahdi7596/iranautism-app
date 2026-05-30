import { PUMP_PARTNER_KEY } from "./pump.contracts";

export const PUMP_REGISTRATION_MISSION_KEY = "iran-autism-site-registration";

export const INITIAL_PUMP_MISSIONS = [
  {
    missionKey: "iran-autism-medicine-support",
    resultType: "COUNT_BASED" as const,
    campaignStartsAt: new Date("2026-05-24T00:00:00.000Z"),
  },
  {
    missionKey: "iran-autism-rehabilitation-support",
    resultType: "COUNT_BASED" as const,
    campaignStartsAt: new Date("2026-05-24T00:00:00.000Z"),
  },
  {
    missionKey: "iran-autism-caregiving-support",
    resultType: "COUNT_BASED" as const,
    campaignStartsAt: new Date("2026-05-24T00:00:00.000Z"),
  },
  {
    missionKey: PUMP_REGISTRATION_MISSION_KEY,
    resultType: "STATUS_BASED" as const,
    campaignStartsAt: new Date("2026-05-24T00:00:00.000Z"),
  },
];

export async function upsertInitialPumpMissions(prisma: {
  partnerMission: {
    upsert(input: {
      where: {
        partner_missionKey: {
          partner: typeof PUMP_PARTNER_KEY;
          missionKey: string;
        };
      };
      create: {
        partner: typeof PUMP_PARTNER_KEY;
        missionKey: string;
        resultType: "COUNT_BASED" | "STATUS_BASED";
        campaignStartsAt: Date;
      };
      update: {
        resultType: "COUNT_BASED" | "STATUS_BASED";
        campaignStartsAt: Date;
      };
    }): Promise<unknown>;
  };
}) {
  for (const mission of INITIAL_PUMP_MISSIONS) {
    await prisma.partnerMission.upsert({
      where: {
        partner_missionKey: {
          partner: PUMP_PARTNER_KEY,
          missionKey: mission.missionKey,
        },
      },
      create: {
        partner: PUMP_PARTNER_KEY,
        ...mission,
      },
      update: {
        resultType: mission.resultType,
        campaignStartsAt: mission.campaignStartsAt,
      },
    });
  }
}
