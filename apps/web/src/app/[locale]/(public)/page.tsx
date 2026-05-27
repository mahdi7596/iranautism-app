import { Icon } from "@iranautism/icons";
import { Slider, SliderControls, SliderSlide, SliderViewport } from "@iranautism/ui";
import Image from "next/image";

import { buildPumpMissionsPath } from "../../../config/app";
import { isSupportedLocale } from "../../../config/locales";
import { HOME_HERO_SLIDES, HOME_PAGE_COPY } from "../../../constants/site.constants";

type PublicHomePageProps = {
  params: Promise<{
    locale: string;
  }>;
};

export default async function PublicHomePage({ params }: PublicHomePageProps) {
  const { locale } = await params;
  const safeLocale = isSupportedLocale(locale) ? locale : "fa";

  return (
    <div className="home-page" aria-labelledby="home-title">
      <Slider
        label="اسلایدر معرفی انجمن اتیسم ایران"
        className="home-hero-slider"
        slideCount={HOME_HERO_SLIDES.length}
      >
        <SliderViewport>
          {HOME_HERO_SLIDES.map((slide, index) => (
            <SliderSlide
              key={slide.id}
              id={`home-${slide.id}`}
              className={`home-hero home-hero--${slide.tone}`}
            >
              <div className="home-hero__content">
                <p className="home-hero__eyebrow">{slide.eyebrow}</p>
                {index === 0 ? (
                  <h1 id="home-title" className="home-hero__title">
                    <span>{slide.titleLead}</span>
                    <strong>{slide.titleEmphasis}</strong>
                  </h1>
                ) : (
                  <h2 className="home-hero__title">
                    <span>{slide.titleLead}</span>
                    <strong>{slide.titleEmphasis}</strong>
                  </h2>
                )}
                <p className="home-hero__text">{slide.text}</p>
                <div className="home-hero__actions">
                  <a className="ds-btn ds-btn--primary ds-btn--lg" href={buildPumpMissionsPath(safeLocale)}>
                    <Icon name="heartHandshake" size="sm" />
                    {slide.primaryCta}
                  </a>
                  <a className="ds-btn ds-btn--quiet ds-btn--lg" href={index === 2 ? "#transparency" : "#about"}>
                    <Icon name="help" size="sm" />
                    {slide.secondaryCta}
                  </a>
                </div>
              </div>

              <figure className="home-hero__visual">
                <Image
                  src={slide.image.src}
                  alt={slide.image.alt}
                  fill
                  priority={index === 0}
                  sizes="(max-width: 760px) 86vw, 42vw"
                />
                <span className="home-hero__doodle home-hero__doodle--heart" aria-hidden="true">
                  <Icon name="heartHandshake" size="lg" />
                </span>
                <span className="home-hero__doodle home-hero__doodle--spark" aria-hidden="true">
                  <Icon name="plus" size="sm" />
                </span>
              </figure>
            </SliderSlide>
          ))}
        </SliderViewport>
        <SliderControls
          slides={HOME_HERO_SLIDES.map((slide) => ({
            id: `home-${slide.id}`,
            label: slide.eyebrow,
          }))}
        />
        <ul className="home-hero__assurance" aria-label="ویژگی‌های مسیر حمایت">
          {HOME_PAGE_COPY.assurance.map((item, index) => (
            <li key={item}>
              <strong>{item}</strong>
              <span>{HOME_PAGE_COPY.assuranceDetails[index]}</span>
            </li>
          ))}
        </ul>
      </Slider>
    </div>
  );
}
