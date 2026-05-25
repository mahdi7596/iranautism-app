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
  },
] as const satisfies readonly PumpMission[];

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
    title: "یک ماموریت انتخاب کنید و با یک کمک کوچک همراه شوید",
    text: "هر ماموریت به یکی از نیازهای واقعی جامعه اتیسم وصل است. مبلغ را خودتان انتخاب می‌کنید و بعد از پرداخت می‌توانید به پامپ برگردید.",
  },
  list: {
    ariaLabel: "فهرست ماموریت‌های پامپ",
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
    rewardPrefix: "پاداش پامپ:",
    customAmountRule: "مبلغ دلخواه از حداقل ۱۰٬۰۰۰ تومان؛ با دکمه‌ها هر بار ۱۰٬۰۰۰ تومان کم یا زیاد می‌شود.",
    identityMessagePrefix: "این ماموریت با شماره حساب شما انجام می‌شود:",
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
