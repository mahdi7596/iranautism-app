export const SITE_COPY = {
  brandName: "انجمن اتیسم ایران",
  brandLine: "حمایت شفاف از خانواده‌های اتیسم",
  navigation: {
    ariaLabel: "ناوبری اصلی",
    home: "خانه",
    pumpMission: "ماموریت پامپ",
    about: "درباره ما",
    transparency: "شفافیت مالی",
    news: "اخبار",
    contact: "تماس با ما",
    profileAriaLabel: "مشاهده حساب کاربری",
    loginAriaLabel: "ورود به حساب کاربری",
    supportCta: "شروع حمایت",
  },
  footerTitle: "انجمن اتیسم ایران",
  footerText:
    "با ماموریت پامپ، هر سوخت‌گیری می‌تواند به حمایت شفاف و هدفمند از خانواده‌های اتیسم ایران تبدیل شود.",
  footer: {
    ctaTitle: "همراه ساختن آینده‌ای روشن‌تر",
    ctaText:
      "در این نسخه مسیر حمایت، ورود با موبایل، پرداخت امن و پیگیری ماموریت‌های پامپ آماده است.",
    cta: "شروع حمایت",
    columns: [
      {
        title: "مسیرهای اصلی",
        links: ["خانه", "ماموریت پامپ", "حساب کاربری"],
      },
      {
        title: "اعتماد و شفافیت",
        links: ["پرداخت امن", "گزارش اثرگذاری", "حمایت هدفمند"],
      },
    ],
    contactTitle: "ارتباط با انجمن",
    address: "تهران، انجمن اتیسم ایران",
    phone: "۰۲۱-۸۸۷۷۷۶۵۵",
    email: "info@iranautism.org",
    enamadTitle: "نماد اعتماد",
    enamadText: "محل نمایش اینماد",
  },
} as const;

export const HOME_PAGE_COPY = {
  eyebrow: "ماموریت پامپ",
  title: "هر حرکت کوچک آینده‌ای بزرگ می‌سازد",
  titleLead: "هر حرکت کوچک",
  titleEmphasis: "آینده‌ای بزرگ می‌سازد",
  text: "با ماموریت پامپ، قدم به قدم برای ساختن دنیایی بهتر برای خانواده‌های اتیسم ایران همراه می‌شوید.",
  primaryCta: "شروع حمایت",
  secondaryCta: "بیشتر بدانید",
  assurance: [
    "حمایت هدفمند",
    "اثر اجتماعی پایدار",
    "شفافیت کامل",
    "همراهی ساده",
  ],
  assuranceDetails: [
    "هر تومان، دقیق و شفاف در مسیر درست",
    "تغییر واقعی در زندگی خانواده‌های اتیسم",
    "گزارش‌های مالی و اثرگذاری به‌صورت منظم",
    "فرایند آسان، امن و در دسترس",
  ],
} as const;

export const HOME_HERO_SLIDES = [
  {
    id: "current-support",
    eyebrow: "ماموریت پامپ",
    titleLead: "هر حرکت کوچک",
    titleEmphasis: "آینده‌ای بزرگ می‌سازد",
    text: "با ماموریت پامپ، قدم به قدم برای ساختن دنیایی بهتر برای خانواده‌های اتیسم ایران همراه می‌شوید.",
    primaryCta: "شروع حمایت",
    secondaryCta: "بیشتر بدانید",
    image: {
      src: "/images/pump/iran-autism-family-hero.png",
      alt: "کودک در حال لبخند با نماد قلب بنفش انجمن اتیسم ایران",
    },
    tone: "warm",
  },
  {
    id: "trust-progress",
    eyebrow: "اعتماد و پیشرفت",
    titleLead: "با هم، دنیایی",
    titleEmphasis: "قابل درک‌تر می‌سازیم",
    text: "ما با ارائه خدمات تخصصی، آموزش خانواده‌ها و حمایت از پژوهش، در مسیر توانمندسازی فرد مبتلا به اتیسم و خانواده‌ها همراهیم.",
    primaryCta: "من هم حمایت می‌کنم",
    secondaryCta: "بیشتر درباره ما",
    image: {
      src: "/images/pump/iran-autism-pump-banner.jpg",
      alt: "کودک لبخندزن در زمینه بنفش به عنوان نماد همراهی و حمایت",
    },
    tone: "trust",
  },
  {
    id: "clinical-transparency",
    eyebrow: "شفافیت بالینی",
    titleLead: "گزارش شفافیت",
    titleEmphasis: "اعتماد شما، مسئولیت ما",
    text: "ما متعهد به شفافیت مالی، گزارش‌دهی منظم و ارائه خدمات مبتنی بر شواهد علمی هستیم.",
    primaryCta: "گزارش شفافیت",
    secondaryCta: "مشاهده خدمات",
    image: {
      src: "/images/pump/iran-autism-family-hero.png",
      alt: "کودک در فضای آموزشی به عنوان نماد شفافیت و اثر حمایت",
    },
    tone: "transparent",
  },
] as const;
