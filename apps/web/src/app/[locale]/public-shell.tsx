import type { ReactNode } from "react";
import Image from "next/image";

import { buildLocalePath, buildPumpMissionsPath } from "../../config/app";
import type { SupportedLocale } from "../../config/locales";
import { SITE_COPY } from "../../constants/site.constants";
import { HeaderAccountLink } from "./header-account-link";

type PublicShellProps = {
  children: ReactNode;
  locale: SupportedLocale;
};

export function PublicShell({ children, locale }: PublicShellProps) {
  return (
    <div className="app-shell">
      <header className="app-shell__bar">
        <div className="app-shell__inner app-shell__nav">
          <a className="app-shell__brand" href={buildLocalePath(locale)}>
            <Image
              className="app-shell__brand-mark"
              src="/images/pump/iran-autism-logo-mark.jpg"
              alt=""
              width={44}
              height={44}
              priority
            />
            <span className="app-shell__brand-copy">
              <span>{SITE_COPY.brandName}</span>
              <small>{SITE_COPY.brandLine}</small>
            </span>
          </a>
          <nav className="app-shell__links" aria-label={SITE_COPY.navigation.ariaLabel}>
            <a href={buildLocalePath(locale)}>{SITE_COPY.navigation.home}</a>
            <a href={buildPumpMissionsPath(locale)}>{SITE_COPY.navigation.pumpMission}</a>
            <a href="#about">{SITE_COPY.navigation.about}</a>
            <a href="#news">{SITE_COPY.navigation.news}</a>
            <a href="#contact">{SITE_COPY.navigation.contact}</a>
          </nav>
          <div className="app-shell__actions">
            <HeaderAccountLink locale={locale} />
          </div>
        </div>
      </header>
      <main className="app-shell__main">{children}</main>
      <footer className="app-shell__footer">
        <Image
          className="app-shell__footer-watermark"
          src="/images/pump/iran-autism-logo-mark.jpg"
          alt=""
          width={180}
          height={180}
          aria-hidden="true"
        />
        <div className="app-shell__inner app-shell__footer-inner" id="contact">
          <section className="app-shell__footer-cta" aria-labelledby="footer-title">
            <div>
              <p>{SITE_COPY.footerTitle}</p>
              <h2 id="footer-title">{SITE_COPY.footer.ctaTitle}</h2>
              <span>{SITE_COPY.footer.ctaText}</span>
            </div>
            <a className="ds-btn ds-btn--primary ds-btn--lg" href={buildPumpMissionsPath(locale)}>
              {SITE_COPY.footer.cta}
            </a>
          </section>
          <div className="app-shell__footer-grid">
            {SITE_COPY.footer.columns.map((column, index) => (
              <div
                className="app-shell__footer-column"
                id={index === 0 ? "about" : index === 1 ? "transparency" : undefined}
                key={column.title}
              >
                <strong>{column.title}</strong>
                <ul>
                  {column.links.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            ))}
            <address className="app-shell__footer-contact" id="news">
              <strong>{SITE_COPY.footer.contactTitle}</strong>
              <span>{SITE_COPY.footer.address}</span>
              <span>{SITE_COPY.footer.email}</span>
              <span dir="ltr">{SITE_COPY.footer.phone}</span>
            </address>
            <div className="app-shell__footer-enamad" aria-label={SITE_COPY.footer.enamadTitle}>
              <Image src="/images/pump/iran-autism-logo-mark.jpg" alt="" width={56} height={56} />
              <strong>{SITE_COPY.footer.enamadTitle}</strong>
              <span>{SITE_COPY.footer.enamadText}</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
