import type { ReactNode } from "react";

import { isSupportedLocale } from "../../../config/locales";
import { PublicShell } from "../public-shell";

type PublicRouteLayoutProps = {
  children: ReactNode;
  params: Promise<{
    locale: string;
  }>;
};

export default async function PublicRouteLayout({ children, params }: PublicRouteLayoutProps) {
  const { locale } = await params;
  const safeLocale = isSupportedLocale(locale) ? locale : "fa";

  return <PublicShell locale={safeLocale}>{children}</PublicShell>;
}
