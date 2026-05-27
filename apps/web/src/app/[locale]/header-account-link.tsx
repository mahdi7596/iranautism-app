"use client";

import { Icon } from "@iranautism/icons";
import Link from "next/link";

import type { SupportedLocale } from "../../config/locales";
import { buildLoginPath, buildProfilePath } from "../../config/app";
import { SITE_COPY } from "../../constants/site.constants";
import { useAuth } from "../../features/auth/auth-provider";

type HeaderAccountLinkProps = {
  locale: SupportedLocale;
};

export function HeaderAccountLink({ locale }: HeaderAccountLinkProps) {
  const auth = useAuth();
  const isAuthenticated = auth.status === "authenticated" && auth.user;
  const href = isAuthenticated ? buildProfilePath(locale) : buildLoginPath(locale);
  const label = isAuthenticated
    ? SITE_COPY.navigation.profileAriaLabel
    : SITE_COPY.navigation.loginAriaLabel;

  return (
    <Link
      className={[
        "app-shell__account-link",
        isAuthenticated ? "app-shell__account-link--profile" : "app-shell__account-link--login",
      ].join(" ")}
      href={href}
      aria-label={label}
      title={label}
    >
      <Icon name={isAuthenticated ? "userCheck" : "login"} size="lg" />
    </Link>
  );
}
