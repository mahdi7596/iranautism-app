export const ACCOUNT_COPY = {
  metadata: {
    profile: {
      title: "داشبورد من",
      description: "داشبورد حساب کاربری انجمن اتیسم ایران.",
    },
    pumpHistory: {
      title: "ماموریت‌های پامپ من",
      description: "فهرست ماموریت‌های پامپ ثبت‌شده برای حساب کاربری.",
    },
  },
  loading: {
    account: "در حال بررسی حساب کاربری...",
    history: "در حال دریافت ماموریت‌های پامپ...",
  },
  profile: {
    anonymousTitle: "حساب کاربری",
    anonymousText: "برای دیدن داشبورد و ماموریت‌های انجام‌شده، اول وارد حساب شوید.",
    loginCta: "ورود به حساب",
    title: "داشبورد من",
    mobileLabel: "شماره حساب شما:",
    pumpHistoryCta: "مشاهده ماموریت‌های پامپ",
    signOut: "خروج از حساب",
  },
  history: {
    title: "ماموریت‌های پامپ",
    anonymousText: "برای دیدن ماموریت‌های انجام‌شده، وارد حساب شوید.",
    empty: "هنوز ماموریتی برای این حساب ثبت نشده است.",
    dateLabel: "تاریخ ثبت:",
    complete: "تکمیل‌شده",
    pending: "در انتظار تکمیل",
    countSuffix: "بار",
    fallbackMissionTitle: "ماموریت پامپ",
    loadFailed: "دریافت ماموریت‌ها با خطا روبه‌رو شد.",
  },
} as const;
