import type { PumpMissionId } from "@iranautism/types";

export type PumpMission = {
  id: PumpMissionId;
  title: string;
  medalTitle: string;
  medalText: string;
  shortText: string;
  minAmountToman: number;
  stepAmountToman: number;
  isRepeatable: boolean;
  ticketCount: number | null;
  accent: "medicine" | "rehabilitation" | "caregiving" | "general";
  featuredImage: {
    src: string;
    alt: string;
  };
};

export const PUMP_MISSION_RULES = {
  customMinAmountToman: 10_000,
  amountStepToman: 10_000,
  generalMinAmountToman: 200_000,
  generalTicketCount: 3_000,
} as const;

export const PUMP_MISSIONS = [
  {
    id: "iran-autism-medicine-support",
    title: "کمک به هزینه دارو افراد اتیسم",
    medalTitle: "نشان همراهی دارو",
    medalText: "با خرید هر نشان دارو به یک فرد اتیسم کمک می‌کنید و این ماموریت کامل می‌شود.",
    shortText: "همراهی کوچک شما می‌تواند بخشی از هزینه داروی یک فرد اتیسم را سبک‌تر کند.",
    minAmountToman: PUMP_MISSION_RULES.customMinAmountToman,
    stepAmountToman: PUMP_MISSION_RULES.amountStepToman,
    isRepeatable: true,
    ticketCount: null,
    accent: "medicine",
    featuredImage: {
      src: "/images/pump/iran-autism-family-hero.png",
      alt: "تصویر حمایتی برای ماموریت کمک به هزینه دارو افراد اتیسم",
    },
  },
  {
    id: "iran-autism-rehabilitation-support",
    title: "کمک به هزینه توانبخشی افراد اتیسم",
    medalTitle: "نشان همراهی توانبخشی",
    medalText: "با خرید هر نشان توانبخشی به توانمند شدن یک فرد اتیسم کمک می‌کنید و این ماموریت کامل می‌شود.",
    shortText: "کمک شما به ادامه خدمات توانبخشی و مسیر رشد مهارت‌های روزمره می‌رسد.",
    minAmountToman: PUMP_MISSION_RULES.customMinAmountToman,
    stepAmountToman: PUMP_MISSION_RULES.amountStepToman,
    isRepeatable: true,
    ticketCount: null,
    accent: "rehabilitation",
    featuredImage: {
      src: "/images/pump/iran-autism-pump-banner.jpg",
      alt: "تصویر حمایتی برای ماموریت کمک به هزینه توانبخشی افراد اتیسم",
    },
  },
  {
    id: "iran-autism-caregiving-support",
    title: "کمک به هزینه پرستاری افراد اتیسم",
    medalTitle: "نشان همراهی فرشته",
    medalText: "با خرید هر نشان فرشته به مراقبت از یک فرد اتیسم کمک می‌کنید و این ماموریت کامل می‌شود.",
    shortText: "این همراهی برای پشتیبانی از مراقبت روزانه و آرامش خانواده‌ها استفاده می‌شود.",
    minAmountToman: PUMP_MISSION_RULES.customMinAmountToman,
    stepAmountToman: PUMP_MISSION_RULES.amountStepToman,
    isRepeatable: true,
    ticketCount: null,
    accent: "caregiving",
    featuredImage: {
      src: "/images/pump/iran-autism-family-hero.png",
      alt: "تصویر حمایتی برای ماموریت کمک به هزینه پرستاری افراد اتیسم",
    },
  },
  {
    id: "iran-autism-general-donation",
    title: "کمک به انجمن اتیسم ایران",
    medalTitle: "کمک طیف اتیسم",
    medalText: "با هر کمک بالای ۲۰۰ هزار تومان به انجمن اتیسم ایران، این ماموریت کامل می‌شود.",
    shortText: "یک حمایت مستقیم برای ادامه خدمات انجمن و همراهی گسترده‌تر با جامعه اتیسم.",
    minAmountToman: PUMP_MISSION_RULES.generalMinAmountToman,
    stepAmountToman: PUMP_MISSION_RULES.amountStepToman,
    isRepeatable: true,
    ticketCount: PUMP_MISSION_RULES.generalTicketCount,
    accent: "general",
    featuredImage: {
      src: "/images/pump/iran-autism-pump-banner.jpg",
      alt: "تصویر حمایتی برای ماموریت کمک به انجمن اتیسم ایران",
    },
  },
] as const satisfies readonly PumpMission[];

export const PUMP_BANNERS = [
  {
    id: "pump-support",
    eyebrow: "پامپ و انجمن اتیسم ایران",
    title: "با هر حمایت، یک ماموریت در پامپ کامل می‌شود",
    text: "نشان حمایتی را انتخاب کنید، شماره موبایل را تایید کنید و بعد از پرداخت امن به پامپ برگردید.",
    image: {
      src: "/images/pump/iran-autism-pump-banner.jpg",
      alt: "بنر ماموریت پامپ برای حمایت از انجمن اتیسم ایران",
    },
  },
  {
    id: "pump-trust",
    eyebrow: "حمایت شفاف",
    title: "مسیر کوتاه، اثر قابل پیگیری",
    text: "مبلغ حمایت، شماره تاییدشده و نتیجه پرداخت در مسیر امن انجمن ثبت می‌شود.",
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
    text: "برای تکمیل ماموریت فقط یک مسیر کوتاه دارید: انتخاب نشان، تایید شماره موبایل، پرداخت امن و برگشت به پامپ برای دریافت پاداش.",
    primaryCta: "دیدن ماموریت‌ها",
    secondaryCta: "ورود و مشاهده سوابق",
  },
  steps: {
    title: "مسیر تکمیل ماموریت",
    items: ["انتخاب ماموریت", "تایید شماره موبایل", "پرداخت و برگشت به پامپ"],
  },
  assurance: {
    title: "چرا شماره موبایل مهم است؟",
    text: "پامپ تکمیل ماموریت را با شماره موبایل بررسی می‌کند؛ بنابراین حتی بدون ساخت حساب کامل هم ماموریت شما قابل تایید است.",
    payment: "نتیجه پرداخت فقط از سرور انجمن بررسی می‌شود، نه از فیلدهای برگشتی درگاه.",
  },
  list: {
    ariaLabel: "فهرست ماموریت‌های پامپ",
    title: "یکی از نشان‌های حمایتی را انتخاب کنید",
    text: "سه ماموریت اول با مبلغ دلخواه از ۱۰ هزار تومان شروع می‌شوند. کمک عمومی انجمن از ۲۰۰ هزار تومان، تیکت پامپ هم دارد.",
    ticketSuffix: "تیکت",
    amountPrefix: "شروع از",
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
  },
  messages: {
    otpSent: "کد تایید مخصوص ماموریت پامپ برای شما ارسال شد.",
    otpSendFailed: "ارسال کد با خطا روبه‌رو شد.",
    challengeMissing: "برای ادامه دوباره کد تایید دریافت کنید.",
    verified: "شماره شما تایید شد. حالا می‌توانید ماموریت را شروع کنید.",
    invalidOtp: "کد تایید معتبر نیست.",
    paymentFailed: "آماده‌سازی پرداخت با خطا روبه‌رو شد.",
  },
} as const;
