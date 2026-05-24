export const supportedLocales = ["fa", "ar", "en", "tr", "ru"] as const;

export type SupportedLocale = (typeof supportedLocales)[number];

const rtlLocales = new Set<SupportedLocale>(["fa", "ar"]);

export function isSupportedLocale(locale: string): locale is SupportedLocale {
  return supportedLocales.includes(locale as SupportedLocale);
}

export function getLocaleDirection(locale: string): "rtl" | "ltr" {
  return isSupportedLocale(locale) && rtlLocales.has(locale) ? "rtl" : "ltr";
}
