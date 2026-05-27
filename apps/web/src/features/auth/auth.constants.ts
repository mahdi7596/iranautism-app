export const AUTH_SETTINGS = {
  resendDelayMs: 90_000,
} as const;

export const AUTH_COPY = {
  metadata: {
    title: "ورود و ثبت‌نام",
    description: "ورود و ثبت‌نام در پلتفرم انجمن اتیسم ایران با کد تایید پیامکی.",
  },
  intro: {
    eyebrow: "ورود و ثبت‌نام",
    title: "با شماره موبایل وارد حساب اتیسم ایران شوید",
    text: "اگر قبلا حساب داشته باشید وارد می‌شوید؛ اگر شماره تازه باشد حساب شما در همین مسیر ساخته می‌شود.",
    brand: "انجمن اتیسم ایران",
    points: ["ورود بدون رمز عبور", "پیگیری حمایت‌ها", "مشاهده سابقه ماموریت‌ها"],
    access: ["حساب کاربری", "ماموریت‌های پامپ", "سوابق حمایت"],
  },
  steps: {
    ariaLabel: "مراحل ورود",
    mobile: "شماره موبایل",
    otp: "کد تایید",
  },
  fields: {
    mobile: {
      label: "شماره موبایل",
      hint: "شماره را با 09 وارد کنید.",
      placeholder: "09123456789",
    },
    otp: {
      label: "کد تایید",
      hint: "کدی را که پیامک شده وارد کنید.",
      placeholder: "123456",
    },
  },
  messages: {
    otpSent: "کد ورود برای شماره شما ارسال شد.",
    otpSendFailed: "ارسال کد با خطا روبه‌رو شد.",
    challengeMissing: "برای ادامه دوباره کد ورود دریافت کنید.",
    loginSuccess: "ورود شما با موفقیت انجام شد.",
    invalidOtp: "کد وارد شده معتبر نیست.",
    otpResent: "کد جدید برای شما ارسال شد.",
    resendFailed: "ارسال دوباره کد با خطا روبه‌رو شد.",
  },
  actions: {
    requestOtp: "دریافت کد ورود",
    requestingOtp: "در حال ارسال کد...",
    verifyOtp: "ورود به حساب",
    verifyingOtp: "در حال بررسی کد...",
    resendOtp: "ارسال دوباره کد",
    resendCountdown: (seconds: string) => `ارسال دوباره تا ${seconds} ثانیه`,
    editMobile: "ویرایش شماره",
  },
} as const;
