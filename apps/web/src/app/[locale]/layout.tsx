import type { ReactNode } from "react";

import { SITE_COPY } from "../../constants/site.constants";
import { buildLocalePath, buildLoginPath, buildPumpMissionsPath } from "../../config/app";
import { getLocaleDirection, isSupportedLocale } from "../../config/locales";
import { AppProviders } from "./providers/app-providers";

type LocaleLayoutProps = {
  children: ReactNode;
  params: Promise<{
    locale: string;
  }>;
};

export default async function LocaleLayout({ children, params }: LocaleLayoutProps) {
  const { locale } = await params;
  const direction = getLocaleDirection(locale);
  const safeLocale = isSupportedLocale(locale) ? locale : "fa";

  return (
    <div className="app-shell" dir={direction} data-locale={safeLocale}>
      <header className="app-shell__bar">
        <div className="app-shell__inner app-shell__nav">
          <a className="app-shell__brand" href={buildLocalePath(safeLocale)}>
            {SITE_COPY.brandName}
          </a>
          <nav className="app-shell__links" aria-label={SITE_COPY.navigation.ariaLabel}>
            <a href={buildLocalePath(safeLocale)}>{SITE_COPY.navigation.home}</a>
            <a href={buildPumpMissionsPath(safeLocale)}>{SITE_COPY.navigation.pumpMission}</a>
            <a href={buildLoginPath(safeLocale)}>{SITE_COPY.navigation.login}</a>
          </nav>
        </div>
      </header>
      <AppProviders>
        <main className="app-shell__main">{children}</main>
      </AppProviders>
      <footer className="app-shell__footer">
        <div className="app-shell__inner">{SITE_COPY.footer}</div>
      </footer>
    </div>
  );
}
