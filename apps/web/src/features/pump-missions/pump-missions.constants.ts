import type { PaidPumpMissionId, PumpMissionId, RegistrationPumpMissionId } from "@iranautism/types";

type PumpMissionBase = {
  title: string;
  medalTitle: string;
  medalText: string;
  shortText: string;
  isRepeatable: boolean;
  ticketCount: number | null;
  accent: "medicine" | "rehabilitation" | "caregiving" | "registration";
  featuredImage: {
    src: string;
    alt: string;
  };
};

export type PumpDonationMission = PumpMissionBase & {
  kind: "DONATION";
  id: PaidPumpMissionId;
  minAmountToman: number;
  stepAmountToman: number;
};

export type PumpRegistrationMission = PumpMissionBase & {
  kind: "REGISTRATION";
  id: RegistrationPumpMissionId;
  minAmountToman: null;
  stepAmountToman: null;
};

export type PumpMission = PumpDonationMission | PumpRegistrationMission;

export const PUMP_MISSION_RULES = {
  medicineMinAmountToman: 100_000,
  rehabilitationMinAmountToman: 150_000,
  caregivingMinAmountToman: 250_000,
  amountStepToman: 10_000,
} as const;

export const PUMP_MISSIONS = [
  {
    kind: "DONATION",
    id: "iran-autism-medicine-support",
    title: "کمک به هزینه دارو افراد اتیسم",
    medalTitle: "نشان همراهی دارو",
    medalText: "با خرید هر نشان دارو به یک فرد اتیسم کمک می‌کنید و این ماموریت کامل می‌شود.",
    shortText: "همراهی کوچک شما می‌تواند بخشی از هزینه داروی یک فرد اتیسم را سبک‌تر کند.",
    minAmountToman: PUMP_MISSION_RULES.medicineMinAmountToman,
    stepAmountToman: PUMP_MISSION_RULES.amountStepToman,
    isRepeatable: true,
    ticketCount: null,
    accent: "medicine",
    featuredImage: {
      src: "/images/pump/medicine-support-badge.png",
      alt: "نشان همراهی دارو برای کمک به هزینه دارو افراد اتیسم",
    },
  },
  {
    kind: "DONATION",
    id: "iran-autism-rehabilitation-support",
    title: "کمک به هزینه توانبخشی افراد اتیسم",
    medalTitle: "نشان همراهی توانبخشی",
    medalText: "با خرید هر نشان توانبخشی به توانمند شدن یک فرد اتیسم کمک می‌کنید و این ماموریت کامل می‌شود.",
    shortText: "کمک شما به ادامه خدمات توانبخشی و مسیر رشد مهارت‌های روزمره می‌رسد.",
    minAmountToman: PUMP_MISSION_RULES.rehabilitationMinAmountToman,
    stepAmountToman: PUMP_MISSION_RULES.amountStepToman,
    isRepeatable: true,
    ticketCount: null,
    accent: "rehabilitation",
    featuredImage: {
      src: "/images/pump/rehabilitation-support-shoes-badge.png",
      alt: "نشان همراهی کفش برای کمک به هزینه توانبخشی افراد اتیسم",
    },
  },
  {
    kind: "DONATION",
    id: "iran-autism-caregiving-support",
    title: "کمک به هزینه پرستاری افراد اتیسم",
    medalTitle: "نشان همراهی فرشته",
    medalText: "با خرید هر نشان فرشته به مراقبت از یک فرد اتیسم کمک می‌کنید و این ماموریت کامل می‌شود.",
    shortText: "این همراهی برای پشتیبانی از مراقبت روزانه و آرامش خانواده‌ها استفاده می‌شود.",
    minAmountToman: PUMP_MISSION_RULES.caregivingMinAmountToman,
    stepAmountToman: PUMP_MISSION_RULES.amountStepToman,
    isRepeatable: true,
    ticketCount: null,
    accent: "caregiving",
    featuredImage: {
      src: "/images/pump/caregiving-support-angel-badge.png",
      alt: "نشان همراهی فرشته برای کمک به هزینه پرستاری افراد اتیسم",
    },
  },
  {
    kind: "REGISTRATION",
    id: "iran-autism-site-registration",
    title: "ثبت‌نام در سایت انجمن اتیسم ایران",
    medalTitle: "ماموریت رایگان",
    medalText: "با تایید شماره موبایل و ثبت‌نام در سایت انجمن، این ماموریت رایگان کامل می‌شود.",
    shortText: "بدون پرداخت، فقط با تایید شماره موبایل در سایت انجمن ماموریت را کامل کنید.",
    minAmountToman: null,
    stepAmountToman: null,
    isRepeatable: false,
    ticketCount: null,
    accent: "registration",
    featuredImage: {
      src: "/images/pump/iran-autism-logo-mark-transparent.png",
      alt: "نشان انجمن اتیسم ایران برای ماموریت ثبت‌نام رایگان",
    },
  },
] as const satisfies readonly PumpMission[];

export const PUMP_BANNERS = [
  {
    id: "pump-support",
    eyebrow: "پامپ و انجمن اتیسم ایران",
    title: "ماموریت پرداختی یا رایگان را انتخاب کنید",
    text: "می‌توانید یکی از نشان‌های حمایتی را بخرید یا با ثبت‌نام رایگان، یک ماموریت بدون پرداخت را کامل کنید.",
    image: {
      src: "/images/pump/iran-autism-pump-banner.jpg",
      alt: "بنر ماموریت پامپ برای حمایت از انجمن اتیسم ایران",
    },
  },
  {
    id: "pump-trust",
    eyebrow: "حمایت شفاف",
    title: "مسیر کوتاه، اثر قابل پیگیری",
    text: "شماره تاییدشده پایه بررسی ماموریت است؛ پرداخت‌های موفق و ثبت‌نام رایگان هرکدام جداگانه ثبت می‌شوند.",
    image: {
      src: "/images/pump/iran-autism-family-hero.png",
      alt: "بنر حمایت شفاف از خانواده‌های اتیسم در ماموریت پامپ",
    },
  },
] as const;

export const PUMP_MISSION_COPY = {
  metadata: {
    list: {
      title: "ماموریت‌های پامپ",
      description: "ماموریت‌های پامپ برای حمایت از انجمن اتیسم ایران.",
    },
    detail: {
      title: "شروع ماموریت پامپ",
      description: "انتخاب مبلغ، تایید شماره موبایل و شروع ماموریت پامپ انجمن اتیسم ایران.",
    },
  },
  hero: {
    eyebrow: "ماموریت‌های ایران اتیسم در پامپ",
    title: "ماموریت حمایت را انتخاب کنید؛ نتیجه در پامپ ثبت می‌شود",
    text: "برای تکمیل ماموریت فقط یک مسیر کوتاه دارید: انتخاب نشان حمایتی یا ثبت‌نام رایگان، تایید شماره موبایل و برگشت به پامپ برای بررسی پاداش.",
    primaryCta: "دیدن ماموریت‌ها",
    secondaryCta: "ورود و مشاهده سوابق",
  },
  steps: {
    title: "مسیر تکمیل ماموریت",
    items: ["انتخاب ماموریت", "تایید شماره موبایل", "پرداخت یا ثبت رایگان"],
  },
  assurance: {
    title: "چرا شماره موبایل مهم است؟",
    text: "پامپ تکمیل ماموریت را با شماره موبایل بررسی می‌کند؛ بنابراین حتی بدون ساخت حساب کامل هم ماموریت شما قابل تایید است.",
    payment: "نتیجه پرداخت فقط از سرور انجمن بررسی می‌شود، نه از فیلدهای برگشتی درگاه.",
  },
  list: {
    ariaLabel: "فهرست ماموریت‌های پامپ",
    title: "یکی از ماموریت‌های فعال را انتخاب کنید",
    text: "سه ماموریت حمایتی با مبلغ دلخواه از ۱۰ هزار تومان شروع می‌شوند. ماموریت ثبت‌نام رایگان است و فقط با تایید شماره موبایل کامل می‌شود.",
    ticketSuffix: "تیکت",
    amountPrefix: "شروع از",
    freeLabel: "رایگان",
    cta: "شروع ماموریت",
  },
  amountStepper: {
    decrease: "کم کردن مبلغ",
    increase: "زیاد کردن مبلغ",
    label: "مبلغ حمایت",
    currency: "تومان",
  },
  detail: {
    backToMissions: "بازگشت به فهرست ماموریت‌ها",
    panelTitle: "تکمیل ماموریت",
    rewardPrefix: "پاداش پامپ:",
    identityMessagePrefix: "این ماموریت با شماره حساب شما انجام می‌شود:",
    identityReadyTitle: "شماره ماموریت تایید شده است",
    startPayment: "پرداخت و شروع ماموریت",
    preparingPayment: "در حال انتقال به پرداخت...",
    completeRegistration: "ثبت رایگان ماموریت",
    completingRegistration: "در حال ثبت ماموریت...",
    otpFieldLabel: "کد تایید ماموریت",
    otpFieldHint: "بعد از تایید شماره، همین مبلغ و ماموریت حفظ می‌شود.",
    verifyOtp: "تایید شماره و ادامه",
    verifyingOtp: "در حال بررسی کد...",
    editMobile: "ویرایش شماره",
    mobileFieldLabel: "شماره موبایل",
    mobileFieldHint: "برای ثبت ماموریت، اول شماره شما با پیامک تایید می‌شود.",
    requestOtp: "دریافت کد ماموریت",
    requestingOtp: "در حال ارسال کد...",
    mobilePlaceholder: "09123456789",
    otpPlaceholder: "123456",
    afterPaymentTitle: "بعد از پرداخت چه می‌شود؟",
    afterPaymentItems: [
      "سداد به سرور انجمن برمی‌گردد و پرداخت همان‌جا تایید می‌شود.",
      "اگر پرداخت موفق باشد، تکمیل ماموریت برای همین شماره ثبت می‌شود.",
      "در پایان می‌توانید به پامپ برگردید و پاداش را دریافت کنید.",
    ],
    afterRegistrationTitle: "بعد از ثبت‌نام چه می‌شود؟",
    afterRegistrationItems: [
      "شماره تاییدشده شما برای این ماموریت ثبت می‌شود.",
      "این ماموریت فقط یک بار برای هر شماره موبایل کامل می‌شود.",
      "در پایان می‌توانید به پامپ برگردید و نتیجه را بررسی کنید.",
    ],
  },
  messages: {
    otpSent: "کد تایید مخصوص ماموریت پامپ برای شما ارسال شد.",
    otpSendFailed: "ارسال کد با خطا روبه‌رو شد.",
    challengeMissing: "برای ادامه دوباره کد تایید دریافت کنید.",
    verified: "شماره شما تایید شد. حالا می‌توانید ماموریت را شروع کنید.",
    invalidOtp: "کد تایید معتبر نیست.",
    paymentFailed: "آماده‌سازی پرداخت با خطا روبه‌رو شد.",
    registrationCompleted: "ماموریت ثبت‌نام رایگان برای شماره شما ثبت شد.",
    registrationFailed: "ثبت ماموریت رایگان با خطا روبه‌رو شد.",
  },
} as const;
