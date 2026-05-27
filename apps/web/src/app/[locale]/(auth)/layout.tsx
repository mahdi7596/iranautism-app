import type { ReactNode } from "react";

import { buildLocalePath } from "../../../config/app";
import { isSupportedLocale } from "../../../config/locales";

type AuthLayoutProps = {
  children: ReactNode;
  params: Promise<{
    locale: string;
  }>;
};

export default async function AuthLayout({ children, params }: AuthLayoutProps) {
  const { locale } = await params;
  const safeLocale = isSupportedLocale(locale) ? locale : "fa";

  return (
    <div className="auth-page">
      <a className="auth-page__home" href={buildLocalePath(safeLocale)}>
        بازگشت به خانه
      </a>
      {children}
    </div>
  );
}
