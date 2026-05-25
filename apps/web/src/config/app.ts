import type { PumpMissionId } from "@iranautism/types";

import { supportedLocales, type SupportedLocale } from "./locales";

export const appConfig = {
  defaultLocale: "fa" satisfies SupportedLocale,
  supportedLocales,
  apiBaseUrl: process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:3001",
  webBaseUrl: process.env.NEXT_PUBLIC_WEB_BASE_URL ?? "http://localhost:3000",
  pumpReturnUrl: "https://pwa.pumpgame.ir/missions",
} as const;

export function buildLocalePath(locale: SupportedLocale, path = "") {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `/${locale}${normalizedPath === "/" ? "" : normalizedPath}`;
}

export function buildLoginPath(locale: SupportedLocale, returnTo?: string) {
  const path = buildLocalePath(locale, "/login");
  return returnTo ? `${path}?returnTo=${encodeURIComponent(returnTo)}` : path;
}

export function buildProfilePath(locale: SupportedLocale) {
  return buildLocalePath(locale, "/profile");
}

export function buildPumpHistoryPath(locale: SupportedLocale) {
  return buildLocalePath(locale, "/profile/pump-missions");
}

export function buildPumpMissionsPath(locale: SupportedLocale) {
  return buildLocalePath(locale, "/missions/pump");
}

export function buildPumpMissionPath(locale: SupportedLocale, missionId: PumpMissionId) {
  return buildLocalePath(locale, `/missions/pump/${missionId}`);
}

export function buildSadadResultPath(locale: SupportedLocale) {
  return buildLocalePath(locale, "/payments/sadad/result");
}

export function buildSadadResultUrl(locale: SupportedLocale) {
  return `${appConfig.webBaseUrl}${buildSadadResultPath(locale)}`;
}
