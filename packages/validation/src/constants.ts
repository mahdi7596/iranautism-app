export const VALIDATION_MESSAGES = {
  invalidMobile: "شماره موبایل معتبر نیست.",
  invalidOtpPurpose: "نوع درخواست کد تایید معتبر نیست.",
  invalidOtpCode: "کد تایید باید بین ۴ تا ۸ رقم باشد.",
  invalidPumpMissionId: "شناسه ماموریت معتبر نیست.",
  invalidIntegerAmount: "مبلغ باید عدد صحیح باشد.",
  minimumTomanAmount: "حداقل مبلغ ۱۰٬۰۰۰ تومان است.",
  invalidTomanStep: "مبلغ باید مضربی از ۱۰٬۰۰۰ تومان باشد.",
} as const;

export const DATE_FORMATTING = {
  jalaliLocale: "fa-IR-u-ca-persian",
  tehranTimeZone: "Asia/Tehran",
} as const;
