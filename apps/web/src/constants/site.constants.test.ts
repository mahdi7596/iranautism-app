import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { HOME_HERO_SLIDES, HOME_PAGE_COPY, SITE_COPY } from "./site.constants";

describe("public site copy", () => {
  it("presents a real public entry point instead of the technical scaffold", () => {
    const combinedHomeCopy = [
      HOME_PAGE_COPY.eyebrow,
      HOME_PAGE_COPY.title,
      HOME_PAGE_COPY.text,
      HOME_PAGE_COPY.primaryCta,
      HOME_PAGE_COPY.secondaryCta,
    ].join(" ");

    assert.doesNotMatch(combinedHomeCopy, /Next\.js|App Router|پوسته اولیه|زیرساخت وب/);
    assert.match(combinedHomeCopy, /ماموریت پامپ|حمایت|انجمن اتیسم ایران/);
  });

  it("keeps the app shell oriented around the active Pump journey", () => {
    assert.equal(SITE_COPY.navigation.supportCta, "شروع حمایت");
    assert.equal(SITE_COPY.navigation.pumpMission, "ماموریت پامپ");
    assert.equal(SITE_COPY.footerTitle, "انجمن اتیسم ایران");
  });

  it("defines the three approved homepage hero slides", () => {
    assert.deepEqual(
      HOME_HERO_SLIDES.map((slide) => slide.id),
      ["current-support", "trust-progress", "clinical-transparency"],
    );
    assert.equal(HOME_HERO_SLIDES.every((slide) => slide.primaryCta && slide.image.src), true);
  });
});
