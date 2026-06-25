export type Lang = "ar" | "en";
let currentLang: Lang = "ar";

export const setLang = (lang: Lang) => {
  currentLang = lang;
  document.documentElement.lang = lang;
  document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
  window.dispatchEvent(new Event("languagechange"));
};

export const getLang = () => currentLang;

export const translations = {
  ar: {
    brand: "Proklinik-One",
    product: "المنتج",
    engineering: "الهندسة",
    operations: "العمليات",
    culture: "الثقافة",
    bookDemo: "احجز عرضاً",
    readTime: "دقائق للقراءة",
    readArticle: "اقرأ المقال",
    subtopics: "مواضيع فرعية",
    allPosts: "جميع المقالات",
    search: "بحث...",
    loadMore: "تحميل المزيد",
    footerRights: "جميع الحقوق محفوظة.",
    features: "الميزات",
    apiDocs: "توثيق واجهة برمجة التطبيقات",
    customerStories: "قصص العملاء",
    blog: "المدونة",
    privacyPolicy: "سياسة الخصوصية",
    security: "الأمان",
    notFound: "الصفحة غير موجودة",
    error: "حدث خطأ.",
    scheduleDemo: "جدولة عرض تجريبي",
    downloadPdf: "تحميل كملف PDF",
    impact: "لمحة عن الأثر",
    resources: "الموارد",
    legal: "قانوني",
    latestInsights: "أحدث الرؤى",
    efficiencyGain: "زيادة الكفاءة",
    annualSavings: "الوفورات السنوية",
    satisfactionRate: "معدل الرضا",
    scheduling: "الجدولة",
    billing: "الفوترة",
    staffing: "التوظيف",
    design: "تصميم",
    ui_ux: "تجربة/واجهة المستخدم",
    infrastructure: "البنية التحتية",
    rust: "رست (Rust)",
    efficiency: "الكفاءة",
    team: "الفريق",
    growth: "النمو",
    case_study: "دراسة حالة",
    scaling: "التوسع",
    product_lead: "قائد المنتج",
    systems_engineer: "مهندس نظم",
    descOperations:
      "إتقان كفاءة العيادة. رؤى فنية وسير عمل استراتيجي لتحسين الإدارة اليومية، وتقليل الاختناقات، وزيادة الإنتاجية.",
    descProduct:
      "اكتشف أحدث تحديثات منتجاتنا وكيفية تحسين تجربة العيادة للمرضى والموظفين.",
    descEngineering:
      "نظرة عميقة على التكنولوجيا التي تشغل عيادات المستقبل. بنية النظام، التوسع، والابتكار.",
    descCulture:
      "تعرف على ثقافة فريقنا، وكيف نبني بيئة عمل مستدامة وصحية تدعم الإبداع.",
    descHome:
      "مرحباً بك في مدونة Proklinik-One. اكتشف أحدث المقالات والرؤى حول إدارة العيادات والتكنولوجيا.",
    home: "الرئيسية",
    relatedArticles: "مقالات ذات صلة",
    requestQuote: "طلب عرض سعر",
    namePlaceholder: "الاسم",
    emailPlaceholder: "البريد الإلكتروني",
    messagePlaceholder: "كيف يمكننا مساعدتك؟",
    submitForm: "إرسال الطلب",
    copiedToClipboard: "تم نسخ الرابط إلى الحافظة!",
    medicalSpecialityPlaceholder: "التخصص الطبي",
    timeForDemoPlaceholder: "التاريخ المفضل للعرض",
    tableOfContents: "محتويات المقال",
  },
  en: {
    brand: "Proklinik-One",
    product: "Product",
    engineering: "Engineering",
    operations: "Operations",
    culture: "Culture",
    bookDemo: "Book a Demo",
    readTime: "min read",
    readArticle: "Read Article",
    subtopics: "Sub-Topics",
    allPosts: "All Posts",
    search: "Search...",
    loadMore: "Load More",
    footerRights: "All rights reserved.",
    features: "Features",
    apiDocs: "API Docs",
    customerStories: "Customer Stories",
    blog: "Blog",
    privacyPolicy: "Privacy Policy",
    security: "Security",
    notFound: "404 Not Found",
    error: "An error occurred.",
    scheduleDemo: "Schedule a Demo",
    downloadPdf: "Download PDF",
    impact: "Impact at a Glance",
    resources: "Resources",
    legal: "Legal",
    latestInsights: "Latest Insights",
    efficiencyGain: "Efficiency Gain",
    annualSavings: "Annual Savings",
    satisfactionRate: "Satisfaction Rate",
    scheduling: "Scheduling",
    billing: "Billing",
    staffing: "Staffing",
    design: "Design",
    ui_ux: "UI/UX",
    infrastructure: "Infrastructure",
    rust: "Rust",
    efficiency: "Efficiency",
    team: "Team",
    growth: "Growth",
    case_study: "Case Study",
    scaling: "Scaling",
    product_lead: "Product Lead",
    systems_engineer: "Systems Engineer",
    descOperations:
      "Master clinic efficiency. Technical insights and strategic workflows to optimize your daily administration, reduce bottlenecks, and maximize throughput.",
    descProduct:
      "Discover our latest product updates and how we are improving the clinic experience for patients and staff.",
    descEngineering:
      "Deep dives into the technology powering the clinics of the future. System architecture, scaling, and innovation.",
    descCulture:
      "Learn about our team culture, and how we build a sustainable and healthy work environment that supports creativity.",
    descHome:
      "Welcome to the Proklinik-One blog. Discover the latest articles and insights on clinic management and tech.",
    home: "Home",
    relatedArticles: "Related Articles",
    requestQuote: "Request a Quote",
    namePlaceholder: "Your Name",
    emailPlaceholder: "Your Email",
    messagePlaceholder: "How can we help?",
    submitForm: "Submit Request",
    copiedToClipboard: "URL copied to clipboard!",
    medicalSpecialityPlaceholder: "Medical Speciality",
    timeForDemoPlaceholder: "Preferred Date for Demo",
    tableOfContents: "Table of Contents",
  },
} as const;

export const t = (key: keyof typeof translations.en) => {
  return translations[currentLang][key] || key;
};
