import { formatJalaliDate } from "@iranautism/validation";

import { UI_COPY } from "./constants";

export type AmountProps = {
  value: number;
  currencyLabel?: string;
};

export function formatPersianNumber(value: number): string {
  return new Intl.NumberFormat("fa-IR").format(value);
}

export function Amount({ value, currencyLabel = UI_COPY.amount.defaultCurrencyLabel }: AmountProps) {
  return `${formatPersianNumber(value)} ${currencyLabel}`;
}

export type JalaliDateProps = {
  value: string | number | Date;
};

export function JalaliDate({ value }: JalaliDateProps) {
  return formatJalaliDate(value);
}
