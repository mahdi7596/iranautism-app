import type { ReactNode } from "react";

import { getLocaleDirection, isSupportedLocale } from "../../config/locales";

type LocaleLayoutProps = {
  children: ReactNode;
  params: Promise<{
    locale: string;
  }>;
};

export default async function LocaleLayout({ children, params }: LocaleLayoutProps) {
  const { locale } = await params;
  const direction = getLocaleDirection(locale);

  return (
    <div className="app-shell" dir={direction} data-locale={isSupportedLocale(locale) ? locale : "fa"}>
      <header className="app-shell__bar">
        <div className="app-shell__inner app-shell__nav">
          <a className="app-shell__brand" href={`/${locale}`}>
            انجمن اتیسم ایران
          </a>
          <nav className="app-shell__links" aria-label="ناوبری اصلی">
            <a href={`/${locale}`}>خانه</a>
            <a href={`/${locale}/donate`}>کمک مالی</a>
            <a href={`/${locale}/admin`}>مدیریت</a>
          </nav>
        </div>
      </header>
      <main className="app-shell__main">{children}</main>
      <footer className="app-shell__footer">
        <div className="app-shell__inner">زیرساخت اولیه وب اپلیکیشن</div>
      </footer>
    </div>
  );
}
