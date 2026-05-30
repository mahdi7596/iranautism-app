import { Icon } from "@iranautism/icons";
import {
  Slider,
  SliderControls,
  SliderDots,
  SliderSlide,
  SliderViewport,
  StatusBadge,
} from "@iranautism/ui";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import type { CSSProperties } from "react";

import { buildPumpMissionPath } from "../../../../../config/app";
import { isSupportedLocale } from "../../../../../config/locales";
import { pumpMissions } from "../../../../../features/pump-missions/pump-missions";
import {
  PUMP_BANNERS,
  PUMP_MISSION_COPY,
} from "../../../../../features/pump-missions/pump-missions.constants";

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
      <Slider
        label="بنرهای ماموریت پامپ"
        className="pump-banner-slider"
        slideCount={PUMP_BANNERS.length}
      >
        <SliderViewport>
          {PUMP_BANNERS.map((banner, index) => (
            <SliderSlide
              key={banner.id}
              id={`pump-banner-${banner.id}`}
              className={`pump-hero pump-hero--${banner.id}`}
            >
              <div className="pump-hero__media">
                <Image
                  src={banner.image.src}
                  alt={banner.image.alt}
                  fill
                  priority={index === 0}
                  sizes="(max-width: 760px) 100vw, 48vw"
                />
              </div>
              <div className="pump-hero__content">
                <p className="pump-hero__eyebrow">{banner.eyebrow}</p>
                {index === 0 ? (
                  <h1 id="pump-title" className="pump-hero__title">
                    {banner.title}
                  </h1>
                ) : (
                  <h2 className="pump-hero__title">{banner.title}</h2>
                )}
                <p className="pump-hero__text">{banner.text}</p>
                <div className="pump-hero__actions">
                  <a className="ds-btn ds-btn--primary ds-btn--lg" href="#pump-missions">
                    {PUMP_MISSION_COPY.hero.primaryCta}
                  </a>
                  <Link className="ds-btn ds-btn--quiet ds-btn--lg" href={`/${safeLocale}/profile/pump-missions`}>
                    {PUMP_MISSION_COPY.hero.secondaryCta}
                  </Link>
                </div>
              </div>
            </SliderSlide>
          ))}
        </SliderViewport>
        <SliderControls
          slides={PUMP_BANNERS.map((banner) => ({
            id: `pump-banner-${banner.id}`,
            label: banner.eyebrow,
          }))}
        />
      </Slider>

      <section className="pump-missions-section" id="pump-missions" aria-labelledby="pump-missions-title">
        <div className="pump-section-heading">
          <h2 id="pump-missions-title">{PUMP_MISSION_COPY.list.title}</h2>
          <p>{PUMP_MISSION_COPY.list.text}</p>
        </div>

        <Slider
          label={PUMP_MISSION_COPY.list.ariaLabel}
          className="pump-mission-slider"
          slideCount={pumpMissions.length}
        >
          <SliderViewport>
            {pumpMissions.map((mission, index) => (
              <SliderSlide
                key={mission.id}
                id={`mission-${mission.id}`}
                className="pump-mission-slide"
              >
                <Link
                  className={`pump-mission-card pump-mission-card--${mission.accent}`}
                  href={buildPumpMissionPath(safeLocale, mission.id)}
                  style={{ "--entry-index": index } as CSSProperties}
                >
                  <span className="pump-mission-card__image">
                    <Image
                      src={mission.featuredImage.src}
                      alt={mission.featuredImage.alt}
                      fill
                      sizes="(max-width: 760px) 82vw, 320px"
                    />
                  </span>
                  <span className="pump-mission-card__topline">
                    <StatusBadge tone={mission.kind === "REGISTRATION" ? "info" : "success"}>
                      {mission.medalTitle}
                    </StatusBadge>
                  </span>
                  <strong className="pump-mission-card__title">{mission.title}</strong>
                  <span className="pump-mission-card__cta">
                    {PUMP_MISSION_COPY.list.cta}
                    <Icon name="arrowLeft" size="sm" />
                  </span>
                </Link>
              </SliderSlide>
            ))}
          </SliderViewport>
          <SliderDots />
          <SliderControls
            slides={pumpMissions.map((mission) => ({
              id: `mission-${mission.id}`,
              label: mission.title,
            }))}
          />
        </Slider>
      </section>
    </section>
  );
}
