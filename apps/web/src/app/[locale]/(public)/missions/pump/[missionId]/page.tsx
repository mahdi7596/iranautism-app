import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { isSupportedLocale } from "../../../../../../config/locales";
import { PumpMissionFlow } from "../../../../../../features/pump-missions/pump-mission-flow";
import { getPumpMissionById } from "../../../../../../features/pump-missions/pump-missions";
import { PUMP_MISSION_COPY } from "../../../../../../features/pump-missions/pump-missions.constants";

export const metadata: Metadata = {
  title: PUMP_MISSION_COPY.metadata.detail.title,
  description: PUMP_MISSION_COPY.metadata.detail.description,
};

type PumpMissionDetailPageProps = {
  params: Promise<{
    locale: string;
    missionId: string;
  }>;
};

export default async function PumpMissionDetailPage({ params }: PumpMissionDetailPageProps) {
  const { locale, missionId } = await params;
  const mission = getPumpMissionById(missionId);

  if (!mission || !isSupportedLocale(locale) || locale !== "fa") {
    notFound();
  }

  return <PumpMissionFlow mission={mission} locale="fa" />;
}
