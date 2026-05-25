import { Amount, StatusBadge } from "@iranautism/ui";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import type { CSSProperties } from "react";

import { buildPumpMissionPath } from "../../../../../config/app";
import { isSupportedLocale } from "../../../../../config/locales";
import { pumpMissions } from "../../../../../features/pump-missions/pump-missions";
import { PUMP_MISSION_COPY } from "../../../../../features/pump-missions/pump-missions.constants";

export const metadata: Metadata = {
  title: PUMP_MISSION_COPY.metadata.list.title,
  description: PUMP_MISSION_COPY.metadata.list.description,
};

type PumpMissionsPageProps = {
  params: Promise<{
    locale: string;
  }>;
};

export default async function PumpMissionsPage({ params }: PumpMissionsPageProps) {
  const { locale } = await params;
  const safeLocale = isSupportedLocale(locale) ? locale : "fa";

  return (
    <section className="pump-page" aria-labelledby="pump-title">
      <div className="pump-hero">
        <div className="pump-hero__media">
          <Image
            src="/images/pump/iran-autism-pump-banner.jpg"
            alt=""
            fill
            priority
            sizes="(max-width: 760px) 100vw, 48vw"
          />
        </div>
        <div className="pump-hero__content">
          <p className="pump-hero__eyebrow">{PUMP_MISSION_COPY.hero.eyebrow}</p>
          <h1 id="pump-title" className="pump-hero__title">
            {PUMP_MISSION_COPY.hero.title}
          </h1>
          <p className="pump-hero__text">{PUMP_MISSION_COPY.hero.text}</p>
        </div>
      </div>

      <div className="pump-mission-grid" aria-label={PUMP_MISSION_COPY.list.ariaLabel}>
        {pumpMissions.map((mission, index) => (
          <Link
            key={mission.id}
            className={`pump-mission-card pump-mission-card--${mission.accent}`}
            href={buildPumpMissionPath(safeLocale, mission.id)}
            style={{ "--entry-index": index } as CSSProperties}
          >
            <span className="pump-mission-card__topline">
              <StatusBadge tone={mission.ticketCount ? "success" : "info"}>
                {mission.medalTitle}
              </StatusBadge>
              {mission.ticketCount ? (
                <span className="pump-mission-card__tickets">
                  {mission.ticketCount.toLocaleString("fa-IR")} {PUMP_MISSION_COPY.list.ticketSuffix}
                </span>
              ) : null}
            </span>
            <strong className="pump-mission-card__title">{mission.title}</strong>
            <span className="pump-mission-card__text">{mission.shortText}</span>
            <span className="pump-mission-card__amount">
              {PUMP_MISSION_COPY.list.amountPrefix} <Amount value={mission.minAmountToman} />
            </span>
            <span className="pump-mission-card__cta">{PUMP_MISSION_COPY.list.cta}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
