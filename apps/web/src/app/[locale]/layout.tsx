import type { ReactNode } from "react";

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
    <div className="locale-root" dir={direction} data-locale={safeLocale}>
      <AppProviders>
        {children}
      </AppProviders>
    </div>
  );
}
