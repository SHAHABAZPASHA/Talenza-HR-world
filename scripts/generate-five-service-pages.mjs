import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(process.cwd());

function esc(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function sectionTitle(en, ar) {
  return `<div class="section-title text-center mb-4"><h2 class="english-text">${esc(en)}</h2><div class="arabic-text" dir="rtl">${esc(ar)}</div></div>`;
}

function heroSection(data) {
  return `<section class="hero-header py-5" style="background: linear-gradient(135deg, rgba(12,46,103,0.98), rgba(21,95,170,0.94));"><div class="container py-4"><div class="row g-4 align-items-center"><div class="col-lg-7 text-white"><div class="hero-kicker mb-3 english-text">${esc(data.kickerEn)}</div><div class="hero-kicker mb-3 arabic-text" dir="rtl">${esc(data.kickerAr)}</div><h1 class="display-5 fw-bold mb-3 english-text">${esc(data.titleEn)}</h1><h1 class="display-5 fw-bold mb-3 arabic-text" dir="rtl">${esc(data.titleAr)}</h1><p class="lead mb-0 english-text">${esc(data.leadEn)}</p><div class="arabic-text mt-2" dir="rtl">${esc(data.leadAr)}</div></div><div class="col-lg-5"><div class="card border-0 shadow-lg overflow-hidden"><img src="${esc(data.image)}" class="img-fluid" alt="${esc(data.titleEn)}" style="width:100%; min-height:320px; object-fit:cover;"></div></div></div></div></section>`;
}

function breadcrumbSection(currentEn, currentAr) {
  return `<section class="py-3 border-top border-bottom bg-light"><div class="container"><div class="d-flex flex-wrap justify-content-between align-items-center gap-2"><nav aria-label="breadcrumb"><ol class="breadcrumb mb-0"><li class="breadcrumb-item"><a href="index.html" class="english-text">Home</a><span class="arabic-text" dir="rtl">الرئيسية</span></li><li class="breadcrumb-item"><a href="service.html" class="english-text">Services</a><span class="arabic-text" dir="rtl">الخدمات</span></li><li class="breadcrumb-item active english-text" aria-current="page">${esc(currentEn)}</li></ol></nav><div class="arabic-text text-muted" dir="rtl">${esc(currentAr)}</div></div></div></section>`;
}

function overviewSection(en, ar) {
  return `<section class="py-5"><div class="container">${sectionTitle('Overview', 'نظرة عامة')}<div class="row justify-content-center"><div class="col-lg-10"><p class="mb-3 english-text">${esc(en)}</p><div class="arabic-text" dir="rtl">${esc(ar)}</div></div></div></div></section>`;
}

function cardsSection(titleEn, titleAr, items) {
  return `<section class="py-5 bg-light"><div class="container">${sectionTitle(titleEn, titleAr)}<div class="row g-4">${items
    .map(
      (item) => `<div class="col-md-6 col-lg-4"><div class="card border-0 shadow-sm h-100"><div class="card-body p-4"><h3 class="h5 mb-2 english-text">${esc(item.en)}</h3><div class="arabic-text mb-2" dir="rtl">${esc(item.ar)}</div><p class="mb-0 english-text">${esc(item.enDesc)}</p><div class="arabic-text mt-2" dir="rtl">${esc(item.arDesc)}</div></div></div></div>`
    )
    .join('')}</div></div></section>`;
}

function listSection(titleEn, titleAr, enItems, arItems, extraClass = '') {
  return `<section class="py-5 ${extraClass}"><div class="container">${sectionTitle(titleEn, titleAr)}<div class="row g-4"><div class="col-lg-6"><div class="card border-0 shadow-sm h-100"><div class="card-body p-4"><ul class="mb-0">${enItems.map((item) => `<li class="mb-2 english-text">${esc(item)}</li>`).join('')}</ul></div></div></div><div class="col-lg-6"><div class="card border-0 shadow-sm h-100"><div class="card-body p-4"><div class="arabic-text" dir="rtl"><ul class="mb-0">${arItems.map((item) => `<li class="mb-2">${esc(item)}</li>`).join('')}</ul></div></div></div></div></div></div></section>`;
}

function timelineSection(steps) {
  return `<section class="py-5 bg-light"><div class="container">${sectionTitle('Timeline & Process', 'الجدول الزمني وخطوات التنفيذ')}<div class="row g-4">${steps
    .map(
      (step, idx) => `<div class="col-md-6 col-lg-3"><div class="card border-0 shadow-sm h-100"><div class="card-body p-4"><div class="badge bg-primary rounded-pill mb-3">${idx + 1}</div><h3 class="h6 english-text">${esc(step.en)}</h3><div class="arabic-text" dir="rtl">${esc(step.ar)}</div></div></div></div>`
    )
    .join('')}</div></div></section>`;
}

function faqSection(items) {
  return `<section class="py-5"><div class="container">${sectionTitle('Frequently Asked Questions', 'الأسئلة الشائعة')}<div class="accordion" id="faqAccordion">${items
    .map(
      (item, index) => `<div class="accordion-item"><h3 class="accordion-header" id="faq-${index}"><button class="accordion-button ${
        index ? 'collapsed' : ''
      }" type="button" data-bs-toggle="collapse" data-bs-target="#faq-body-${index}" aria-expanded="${index ? 'false' : 'true'}" aria-controls="faq-body-${index}"><span class="english-text">${esc(item.qEn)}</span><span class="arabic-text" dir="rtl">${esc(item.qAr)}</span></button></h3><div id="faq-body-${index}" class="accordion-collapse collapse ${
        index ? '' : 'show'
      }" aria-labelledby="faq-${index}" data-bs-parent="#faqAccordion"><div class="accordion-body"><p class="mb-0 english-text">${esc(
        item.aEn
      )}</p><div class="arabic-text mt-2" dir="rtl">${esc(item.aAr)}</div></div></div></div>`
    )
    .join('')}</div></div></section>`;
}

function ctaFormSection(data) {
  return `<section class="py-5 bg-light"><div class="container"><div class="row g-4 align-items-stretch"><div class="col-lg-7"><div class="card border-0 shadow-sm h-100"><div class="card-body p-4 p-lg-5"><h2 class="h3 mb-3 english-text">${esc(data.ctaTitleEn)}</h2><div class="arabic-text mb-3" dir="rtl">${esc(data.ctaTitleAr)}</div><p class="mb-3 english-text">${esc(data.ctaDescEn)}</p><div class="arabic-text" dir="rtl">${esc(data.ctaDescAr)}</div><div class="d-flex flex-wrap gap-3 mt-4"><a href="contact.html" class="btn btn-primary rounded-pill px-4 py-2 english-text">Request Consultation</a><a href="tel:+971585895827" class="btn btn-outline-primary rounded-pill px-4 py-2 english-text">Call Now</a><a href="https://wa.me/971585895827" target="_blank" rel="noopener" class="btn btn-outline-primary rounded-pill px-4 py-2 english-text">WhatsApp</a><a href="img/certificate/TALENZA PROFILE.pdf" target="_blank" rel="noopener" class="btn btn-light border rounded-pill px-4 py-2 english-text">Download Company Profile</a></div></div></div></div><div class="col-lg-5"><div class="card border-0 shadow-sm h-100"><div class="card-body p-4"><h3 class="h5 english-text">Contact Form</h3><div class="arabic-text mb-3" dir="rtl">نموذج التواصل</div><form action="contact.php" method="post"><input type="hidden" name="service" value="${esc(data.formTag)}"><div class="row g-3"><div class="col-12"><label class="form-label english-text">Your Name</label><input class="form-control" name="name" type="text" required></div><div class="col-12"><label class="form-label english-text">Your Email</label><input class="form-control" name="email" type="email" required></div><div class="col-12"><label class="form-label english-text">Phone</label><input class="form-control" name="phone" type="text"></div><div class="col-12"><label class="form-label english-text">Message</label><textarea class="form-control" name="message" rows="4" required></textarea></div><div class="col-12 d-grid"><button class="btn btn-primary rounded-pill py-2 english-text" type="submit">Submit Enquiry</button></div></div></form></div></div></div></div></div></section>`;
}

function statsSection(items) {
  return `<section class="py-5"><div class="container">${sectionTitle('Service Statistics', 'إحصاءات الخدمة')}<div class="row g-3">${items
    .map(
      (item) => `<div class="col-sm-6 col-lg-3"><div class="stw-card text-center h-100"><strong class="d-block fs-3 text-primary">${esc(item.value)}</strong><span class="english-text">${esc(item.en)}</span><div class="arabic-text mt-1" dir="rtl">${esc(item.ar)}</div></div></div>`
    )
    .join('')}</div></div></section>`;
}

function relatedServicesSection() {
  const links = [
    { href: 'service-jobs.html', en: 'Manpower Services', ar: 'خدمات القوى العاملة' },
    { href: 'service-visa.html', en: 'Visa Services', ar: 'خدمات التأشيرات' },
    { href: 'service-pro.html', en: 'PRO Services', ar: 'خدمات PRO' },
    { href: 'service-company.html', en: 'Business Setup', ar: 'تأسيس الأعمال' },
    { href: 'service-digital.html', en: 'Digital Marketing & Technology', ar: 'التسويق الرقمي والتقنية' }
  ];
  return `<section class="py-5"><div class="container">${sectionTitle('Related Services', 'خدمات ذات صلة')}<div class="row g-3">${links
    .map(
      (link) => `<div class="col-md-6 col-lg-4"><a href="${link.href}" class="card border-0 shadow-sm h-100 text-decoration-none"><div class="card-body p-4"><h3 class="h6 mb-2 english-text">${esc(link.en)}</h3><div class="arabic-text" dir="rtl">${esc(link.ar)}</div></div></a></div>`
    )
    .join('')}</div></div></section>`;
}

function wrapPage(config) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>${esc(config.seoTitle)}</title>
  <meta name="description" content="${esc(config.description)}">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <script>window.SilvoraPageSeo={en:{title:${JSON.stringify(config.seoTitle)},description:${JSON.stringify(config.description)}},ar:{title:${JSON.stringify(config.arTitle)},description:${JSON.stringify(config.arDescription)}}};</script>
  <link rel="apple-touch-icon" sizes="180x180" href="img/favicon/apple-touch-icon.png">
  <link rel="icon" type="image/png" sizes="32x32" href="img/favicon/favicon-32x32.png">
  <link rel="icon" type="image/png" sizes="16x16" href="img/favicon/favicon-16x16.png">
  <link rel="manifest" href="img/favicon/site.webmanifest">
  <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&family=Cairo:wght@400;500;600;700;800&display=swap" rel="stylesheet">
  <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css" rel="stylesheet">
  <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.4.1/font/bootstrap-icons.css" rel="stylesheet">
  <link href="lib/animate/animate.min.css" rel="stylesheet">
  <link href="css/bootstrap.min.css" rel="stylesheet">
  <link href="css/style.css" rel="stylesheet">
</head>
<body>
  <div class="container-fluid bg-white p-0">
    <div id="spinner" class="show bg-white position-fixed translate-middle w-100 vh-100 top-50 start-50 d-flex align-items-center justify-content-center"><div class="spinner-grow text-primary" style="width: 3rem; height: 3rem;" role="status"><span class="sr-only">Loading...</span></div></div>
    <div class="container-fluid position-relative p-0">
      <nav class="navbar navbar-expand-lg navbar-light px-4 px-lg-5 py-3 py-lg-0">
        <a href="index.html" class="navbar-brand p-0"><h1 class="m-0 d-flex align-items-center"><img src="img/TALENZA_logo_v2.png" alt="Silvora Talenza World Logo" class="logo-white" style="height: 120px; margin-right: 10px;"><img src="img/TALENZA_logo_v2.png" alt="Silvora Talenza World Logo" class="logo-blue" style="height: 120px; margin-right: 10px;"><span class="brand-text"><span class="english-text">Silvora Talenza World</span><span class="brand-text-ar arabic-text">سيلفورا تالينزا وورلد</span></span></h1></a>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarCollapse"><span class="fa fa-bars"></span></button>
        <div class="collapse navbar-collapse" id="navbarCollapse"><div class="navbar-nav ms-auto py-0"><a href="index.html" class="nav-item nav-link"><span class="english-text">Home</span><span class="arabic-text" dir="rtl">الرئيسية</span></a><a href="about.html" class="nav-item nav-link"><span class="english-text">About</span><span class="arabic-text" dir="rtl">من نحن</span></a><a href="service.html" class="nav-item nav-link active"><span class="english-text">Services</span><span class="arabic-text" dir="rtl">الخدمات</span></a><a href="contact.html" class="nav-item nav-link"><span class="english-text">Contact</span><span class="arabic-text" dir="rtl">اتصل بنا</span></a></div></div>
      </nav>
    </div>
    ${config.body}
  </div>
  <a href="https://wa.me/971585895827" class="whatsapp-float" target="_blank" rel="noopener" aria-label="Chat with us on WhatsApp"><i class="fab fa-whatsapp"></i></a>
  <a href="#" class="btn btn-lg btn-primary btn-lg-square back-to-top pt-2"><i class="bi bi-arrow-up"></i></a>
  <script src="https://code.jquery.com/jquery-3.4.1.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.0/dist/js/bootstrap.bundle.min.js"></script>
  <script src="lib/wow/wow.min.js"></script>
  <script src="lib/easing/easing.min.js"></script>
  <script src="lib/waypoints/waypoints.min.js"></script>
  <script src="js/main.js"></script>
</body>
</html>`;
}

function write(fileName, html) {
  fs.writeFileSync(path.join(root, fileName), html, 'utf8');
}

const commonFaq = [
  {
    qEn: 'How quickly can we start the engagement?',
    qAr: 'ما مدى سرعة بدء المشروع؟',
    aEn: 'After a discovery call and scope confirmation, we can usually start within one to three business days.',
    aAr: 'بعد مكالمة الاكتشاف وتأكيد النطاق، يمكننا البدء عادة خلال يوم إلى ثلاثة أيام عمل.'
  },
  {
    qEn: 'Do you provide bilingual support?',
    qAr: 'هل تقدمون دعماً باللغتين؟',
    aEn: 'Yes. Project communication and documentation can be coordinated in English and Arabic.',
    aAr: 'نعم، يمكن تنسيق التواصل والمستندات باللغتين الإنجليزية والعربية.'
  },
  {
    qEn: 'Can all sub-services be handled in one contract?',
    qAr: 'هل يمكن تغطية جميع الخدمات الفرعية بعقد واحد؟',
    aEn: 'Yes. We structure one engagement plan with milestones, owners, and clear deliverables.',
    aAr: 'نعم، نقوم ببناء خطة تنفيذ موحدة بمراحل ومسؤوليات ومخرجات واضحة.'
  }
];

const hubBody = [
  heroSection({
    kickerEn: 'Premium Service Architecture',
    kickerAr: 'هيكلة خدمات احترافية',
    titleEn: 'Five Core Service Lines',
    titleAr: 'خمسة خطوط خدمات أساسية',
    leadEn: 'Navigate all offerings through five premium landing pages designed for fast decisions and clear scope.',
    leadAr: 'تصفح جميع الخدمات عبر خمس صفحات رئيسية احترافية مصممة لسرعة القرار ووضوح النطاق.',
    image: 'img/services/company formation.png'
  }),
  breadcrumbSection('Services', 'الخدمات'),
  overviewSection(
    'Silvora now structures services into five strategic lines: Manpower, Visa, PRO, Business Setup, and Digital Marketing & Technology.',
    'تقوم سيلفورا الآن بتنظيم الخدمات ضمن خمسة مسارات استراتيجية: القوى العاملة، التأشيرات، PRO، تأسيس الأعمال، والتسويق الرقمي والتقنية.'
  ),
  cardsSection('Core Service Lines', 'خطوط الخدمات الأساسية', [
    { en: 'Manpower Services', ar: 'خدمات القوى العاملة', enDesc: 'Recruitment and staffing coverage from sourcing to deployment.', arDesc: 'تغطية التوظيف من الاستقطاب حتى التعيين.' },
    { en: 'Visa Services', ar: 'خدمات التأشيرات', enDesc: 'End-to-end visa pathways for individuals and corporate teams.', arDesc: 'مسارات تأشيرات متكاملة للأفراد وفرق الشركات.' },
    { en: 'PRO Services', ar: 'خدمات PRO', enDesc: 'Government liaison, filing operations, and compliance follow-up.', arDesc: 'تنسيق حكومي وعمليات المعاملات والمتابعة التنظيمية.' },
    { en: 'Business Setup', ar: 'تأسيس الأعمال', enDesc: 'Entity formation, licensing, approvals, and growth support.', arDesc: 'تأسيس الكيان، التراخيص، الموافقات، ودعم النمو.' },
    { en: 'Digital Marketing & Technology', ar: 'التسويق الرقمي والتقنية', enDesc: 'Web, CRM, performance marketing, and technology delivery.', arDesc: 'المواقع، CRM، التسويق الأدائي، والتنفيذ التقني.' }
  ]),
  relatedServicesSection(),
  ctaFormSection({
    ctaTitleEn: 'Choose Your Service Line',
    ctaTitleAr: 'اختر مسار خدمتك',
    ctaDescEn: 'Tell us your objective and we will direct you to the right service specialist with a clear execution plan.',
    ctaDescAr: 'أخبرنا بهدفك وسنوجهك إلى المختص المناسب مع خطة تنفيذ واضحة.',
    formTag: 'Services Hub'
  })
].join('');

write('service.html', wrapPage({
  seoTitle: 'Services - Silvora Talenza World',
  description: 'Five premium service lines: Manpower, Visa, PRO, Business Setup, and Digital Marketing & Technology.',
  arTitle: 'الخدمات | سيلفورا تالينزا وورلد',
  arDescription: 'خمسة مسارات خدمات احترافية: القوى العاملة، التأشيرات، PRO، تأسيس الأعمال، والتسويق الرقمي والتقنية.',
  body: hubBody
}));

function buildServicePage(config) {
  return [
    heroSection(config.hero),
    breadcrumbSection(config.hero.titleEn, config.hero.titleAr),
    overviewSection(config.overview.en, config.overview.ar),
    cardsSection('Service Categories', 'فئات الخدمة', config.categories),
    listSection('Benefits', 'الفوائد', config.benefits.en, config.benefits.ar),
    config.requiredDocuments
      ? listSection('Required Documents', 'المستندات المطلوبة', config.requiredDocuments.en, config.requiredDocuments.ar, 'bg-light')
      : '',
    listSection('Industries Served', 'القطاعات المخدومة', config.industries.en, config.industries.ar),
    timelineSection(config.timeline),
    statsSection(config.stats),
    listSection('Why Choose Silvora', 'لماذا تختار سيلفورا', config.why.en, config.why.ar, 'bg-light'),
    faqSection(config.faq || commonFaq),
    relatedServicesSection(),
    ctaFormSection(config.cta)
  ].join('');
}

write('service-jobs.html', wrapPage({
  seoTitle: 'Manpower Services - Silvora Talenza World',
  description: 'Comprehensive manpower services including blue/white collar, executive search, staffing, and HR consultancy.',
  arTitle: 'خدمات القوى العاملة | سيلفورا تالينزا وورلد',
  arDescription: 'خدمات قوى عاملة شاملة تشمل العمالة الفنية والمتخصصة، البحث التنفيذي، التوظيف، واستشارات الموارد البشرية.',
  body: buildServicePage({
    hero: {
      kickerEn: 'Recruitment & Workforce Delivery',
      kickerAr: 'التوظيف وتنفيذ القوى العاملة',
      titleEn: 'Manpower Services',
      titleAr: 'خدمات القوى العاملة',
      leadEn: 'One integrated manpower platform for sourcing, selection, mobilization, and workforce planning.',
      leadAr: 'منصة متكاملة للقوى العاملة تشمل الاستقطاب والاختيار والتعيين وتخطيط الموارد البشرية.',
      image: 'img/services/6.jpg'
    },
    overview: {
      en: 'Our recruitment team supports employer demand from urgent vacancies to strategic workforce programs across sectors.',
      ar: 'يدعم فريق التوظيف لدينا احتياجات أصحاب العمل من الوظائف العاجلة إلى برامج القوى العاملة الاستراتيجية عبر مختلف القطاعات.'
    },
    categories: [
      { en: 'Blue Collar Recruitment', ar: 'توظيف العمالة الفنية', enDesc: 'Operational workforce sourcing at scale.', arDesc: 'استقطاب العمالة التشغيلية على نطاق واسع.' },
      { en: 'White Collar Recruitment', ar: 'توظيف الكوادر المتخصصة', enDesc: 'Specialist and office role placement.', arDesc: 'توظيف الكوادر الإدارية والمتخصصة.' },
      { en: 'Executive Search', ar: 'البحث التنفيذي', enDesc: 'Leadership hiring for strategic positions.', arDesc: 'تعيين القيادات للأدوار الاستراتيجية.' },
      { en: 'Overseas Recruitment', ar: 'التوظيف الخارجي', enDesc: 'Cross-border candidate sourcing and deployment.', arDesc: 'استقطاب وتعيين المرشحين عبر الحدود.' },
      { en: 'Temporary Staffing', ar: 'التوظيف المؤقت', enDesc: 'Flexible staffing for demand peaks.', arDesc: 'حلول توظيف مرنة لفترات الذروة.' },
      { en: 'Permanent Staffing', ar: 'التوظيف الدائم', enDesc: 'Long-term role ownership and retention focus.', arDesc: 'توظيف دائم مع تركيز على الاستمرارية.' },
      { en: 'Mass Hiring', ar: 'التوظيف الجماعي', enDesc: 'Rapid multi-role hiring campaigns.', arDesc: 'حملات توظيف سريعة لعدد كبير من الوظائف.' },
      { en: 'HR Consultancy', ar: 'استشارات الموارد البشرية', enDesc: 'Policy, structure, and workforce optimization.', arDesc: 'السياسات والهيكلة وتحسين الأداء البشري.' }
    ],
    benefits: {
      en: [
        'Faster candidate deployment through structured shortlisting.',
        'Single point of contact for demand, interviews, and onboarding.',
        'Risk-controlled hiring process with verification checkpoints.',
        'Scalable staffing model for urgent and long-term needs.'
      ],
      ar: [
        'تسريع تعيين المرشحين عبر آلية اختيار منظمة.',
        'نقطة اتصال واحدة للطلب والمقابلات والانضمام.',
        'تقليل المخاطر عبر نقاط تحقق واضحة.',
        'نموذج توظيف قابل للتوسع للاحتياجات العاجلة وطويلة المدى.'
      ]
    },
    industries: {
      en: ['Construction', 'Hospitality', 'Facility Management', 'Retail', 'Healthcare', 'Logistics', 'Manufacturing', 'Aviation'],
      ar: ['الإنشاءات', 'الضيافة', 'إدارة المرافق', 'التجزئة', 'الرعاية الصحية', 'اللوجستيات', 'التصنيع', 'الطيران']
    },
    timeline: [
      { en: 'Demand briefing and role mapping', ar: 'تحديد الاحتياج وتوصيف الوظائف' },
      { en: 'Sourcing and shortlisting', ar: 'الاستقطاب وإعداد القائمة المختصرة' },
      { en: 'Interviews and client evaluation', ar: 'المقابلات وتقييم العميل' },
      { en: 'Offer, onboarding, and deployment', ar: 'العرض والانضمام والتعيين' }
    ],
    stats: [
      { value: '20+', en: 'Years in HR Services', ar: 'سنة في خدمات الموارد البشرية' },
      { value: '25+', en: 'Countries Networked', ar: 'دولة ضمن الشبكة' },
      { value: '1-3', en: 'Days to Start Campaign', ar: 'أيام لبدء الحملة' },
      { value: '24/6', en: 'Operational Support Window', ar: 'نافذة دعم تشغيلية' }
    ],
    why: {
      en: ['Dedicated account management for employers.', 'Screening framework for quality and speed.', 'Bilingual communication across stakeholders.', 'Transparent milestones and reporting cadence.'],
      ar: ['إدارة حساب مخصصة لأصحاب العمل.', 'منهجية تقييم تجمع بين الجودة والسرعة.', 'تواصل ثنائي اللغة مع جميع الأطراف.', 'مراحل واضحة وتقارير متابعة منتظمة.']
    },
    cta: {
      ctaTitleEn: 'Request Manpower Support',
      ctaTitleAr: 'اطلب دعم القوى العاملة',
      ctaDescEn: 'Share required roles and hiring timeline. Our team will return a recruitment execution plan.',
      ctaDescAr: 'شارك معنا الوظائف المطلوبة وجدول التوظيف، وسيقدم فريقنا خطة تنفيذ توظيف واضحة.',
      formTag: 'Manpower Services'
    }
  })
}));

write('service-visa.html', wrapPage({
  seoTitle: 'Visa Services - Silvora Talenza World',
  description: 'Premium visa service page covering UAE, Schengen, business, tourist, student, and consultation support.',
  arTitle: 'خدمات التأشيرات | سيلفورا تالينزا وورلد',
  arDescription: 'صفحة تأشيرات شاملة تغطي تأشيرات الإمارات وشنغن والسياحة والأعمال والدراسة والاستشارات.',
  body: buildServicePage({
    hero: {
      kickerEn: 'Immigration & Travel Pathways',
      kickerAr: 'مسارات الهجرة والسفر',
      titleEn: 'Visa Services',
      titleAr: 'خدمات التأشيرات',
      leadEn: 'Structured visa support from eligibility review to submission, tracking, and post-approval guidance.',
      leadAr: 'دعم منظم للتأشيرات من مراجعة الأهلية حتى التقديم والمتابعة والإرشاد بعد الموافقة.',
      image: 'img/services/Visa.jpg'
    },
    overview: {
      en: 'We consolidate all major visa tracks into one managed workflow for individuals, families, and corporate applicants.',
      ar: 'نجمع مسارات التأشيرات الرئيسية في إطار عمل واحد مُدار للأفراد والعائلات والمتقدمين من الشركات.'
    },
    categories: [
      { en: 'UAE Employment Visa', ar: 'تأشيرة العمل في الإمارات', enDesc: 'Employer-sponsored employment processing.', arDesc: 'إجراءات عمل برعاية جهة العمل.' },
      { en: 'UAE Visit Visa', ar: 'تأشيرة الزيارة للإمارات', enDesc: 'Short-term and entry support.', arDesc: 'دعم الزيارة القصيرة وإجراءات الدخول.' },
      { en: 'UAE Family Visa', ar: 'تأشيرة الأسرة للإمارات', enDesc: 'Dependent sponsorship and renewals.', arDesc: 'كفالة المعالين والتجديدات.' },
      { en: 'UAE Golden Visa', ar: 'التأشيرة الذهبية', enDesc: 'Long-term residency pathways.', arDesc: 'مسارات الإقامة طويلة الأمد.' },
      { en: 'Schengen Visa', ar: 'تأشيرة شنغن', enDesc: 'Europe short-stay planning.', arDesc: 'تخطيط السفر القصير إلى أوروبا.' },
      { en: 'Business Visa', ar: 'التأشيرة التجارية', enDesc: 'Travel documentation for business visits.', arDesc: 'مستندات سفر مهنية لزيارات الأعمال.' },
      { en: 'Tourist Visa', ar: 'التأشيرة السياحية', enDesc: 'Tourism itinerary and filing support.', arDesc: 'دعم المسار السياحي وإجراءات التقديم.' },
      { en: 'Student Visa', ar: 'تأشيرة الطالب', enDesc: 'Study-route support and file preparation.', arDesc: 'إعداد ملفات مسار الدراسة.' }
    ],
    benefits: {
      en: [
        'Route-first advisory to reduce rejection risk.',
        'Complete file checks before submission.',
        'Transparent tracking and milestone communication.',
        'Support for individual, family, and business applicants.'
      ],
      ar: [
        'استشارة مبنية على المسار لتقليل احتمالات الرفض.',
        'مراجعة كاملة للملف قبل التقديم.',
        'متابعة شفافة وتواصل مرحلي واضح.',
        'دعم للأفراد والعائلات والمتقدمين من الشركات.'
      ]
    },
    requiredDocuments: {
      en: [
        'Valid passport copies and recent photos.',
        'Proof of purpose (employment, visit, business, or study).',
        'Financial and sponsor documents as required by route.',
        'Previous visa/travel history when applicable.'
      ],
      ar: [
        'نسخ جواز سفر ساري وصور حديثة.',
        'إثبات الغرض من التأشيرة (عمل، زيارة، أعمال، أو دراسة).',
        'مستندات مالية أو مستندات كفيل حسب المسار.',
        'سجل التأشيرات أو السفر السابق عند الحاجة.'
      ]
    },
    industries: {
      en: ['Corporate HR', 'Education', 'Healthcare', 'Hospitality', 'Engineering', 'Retail'],
      ar: ['الموارد البشرية للشركات', 'التعليم', 'الرعاية الصحية', 'الضيافة', 'الهندسة', 'التجزئة']
    },
    timeline: [
      { en: 'Eligibility and route consultation', ar: 'استشارة الأهلية ومسار التأشيرة' },
      { en: 'Required documents checklist', ar: 'قائمة المستندات المطلوبة' },
      { en: 'Application submission and tracking', ar: 'تقديم الطلب والمتابعة' },
      { en: 'Approval, stamping, and travel readiness', ar: 'الموافقة والتجهيز النهائي للسفر' }
    ],
    stats: [
      { value: '8+', en: 'Visa Categories Covered', ar: 'فئات تأشيرات مغطاة' },
      { value: '2', en: 'Languages Supported', ar: 'لغات مدعومة' },
      { value: '1', en: 'Unified Process Model', ar: 'نموذج إجراءات موحد' },
      { value: '24/6', en: 'Client Assistance', ar: 'مساندة العملاء' }
    ],
    why: {
      en: ['Clear documentation standards before submission.', 'Status transparency and milestone updates.', 'Advisory-first approach for route selection.', 'Integrated support for families and corporate teams.'],
      ar: ['معايير وثائق واضحة قبل التقديم.', 'شفافية في حالة الطلب وتحديثات مرحلية.', 'نهج استشاري لاختيار المسار الأنسب.', 'دعم متكامل للعائلات وفرق الشركات.']
    },
    cta: {
      ctaTitleEn: 'Start Your Visa Consultation',
      ctaTitleAr: 'ابدأ استشارة التأشيرة',
      ctaDescEn: 'Send your travel purpose and profile details to receive a tailored visa route plan.',
      ctaDescAr: 'أرسل هدف السفر وتفاصيل ملفك للحصول على خطة تأشيرة مخصصة.',
      formTag: 'Visa Services'
    }
  })
}));

write('service-pro.html', wrapPage({
  seoTitle: 'PRO Services - Silvora Talenza World',
  description: 'Consolidated PRO services covering trade license, document clearing, tax, MOHRE, immigration, and compliance.',
  arTitle: 'خدمات PRO | سيلفورا تالينزا وورلد',
  arDescription: 'خدمات PRO موحدة تشمل الرخصة التجارية، تخليص المعاملات، الضرائب، MOHRE، الهجرة والامتثال.',
  body: buildServicePage({
    hero: {
      kickerEn: 'Government Liaison & Compliance',
      kickerAr: 'التنسيق الحكومي والامتثال',
      titleEn: 'PRO Services',
      titleAr: 'خدمات PRO',
      leadEn: 'One operational partner for approvals, filings, renewals, and regulatory workflows.',
      leadAr: 'شريك تشغيلي واحد للموافقات والتقديمات والتجديدات ومسارات الامتثال التنظيمي.',
      image: 'img/services/pro.png'
    },
    overview: {
      en: 'Our PRO team handles critical administrative transactions across authorities with clear ownership and timelines.',
      ar: 'يتولى فريق PRO لدينا المعاملات الإدارية الحيوية عبر الجهات المختلفة مع مسؤوليات واضحة وجداول زمنية محددة.'
    },
    categories: [
      { en: 'Trade License', ar: 'الرخصة التجارية', enDesc: 'Issuance, amendments, and renewals.', arDesc: 'الإصدار والتعديل والتجديد.' },
      { en: 'Company Formation', ar: 'تأسيس الشركات', enDesc: 'Entity registration and authority coordination.', arDesc: 'تسجيل الكيان والتنسيق مع الجهات.' },
      { en: 'Document Clearing', ar: 'تخليص المعاملات', enDesc: 'Submission and approval workflows.', arDesc: 'مسارات التقديم والموافقات.' },
      { en: 'Attestation', ar: 'التصديق', enDesc: 'Local and international attestation support.', arDesc: 'دعم التصديق المحلي والدولي.' },
      { en: 'Emirates ID & Medical Typing', ar: 'الهوية الإماراتية والطباعة الطبية', enDesc: 'Identity and medical formalities.', arDesc: 'إجراءات الهوية والفحوص الطبية.' },
      { en: 'Visa Typing & Immigration', ar: 'طباعة التأشيرات والهجرة', enDesc: 'Case preparation and status follow-up.', arDesc: 'إعداد الملفات والمتابعة.' },
      { en: 'MOHRE & Government Liaison', ar: 'MOHRE والتنسيق الحكومي', enDesc: 'Labor-related and authority-facing support.', arDesc: 'دعم قضايا العمل والمعاملات الحكومية.' },
      { en: 'Corporate Tax, VAT & EJARI', ar: 'ضريبة الشركات وVAT وإيجاري', enDesc: 'Tax and compliance checkpoints.', arDesc: 'متطلبات الضرائب والامتثال.' }
    ],
    benefits: {
      en: [
        'Reduced processing delays through pre-validated files.',
        'Authority coordination managed by one accountable team.',
        'Compliance checkpoints across tax and licensing workflows.',
        'Business continuity with ongoing renewal support.'
      ],
      ar: [
        'تقليل التأخير عبر ملفات تم التحقق منها مسبقاً.',
        'تنسيق حكومي يديره فريق واحد مسؤول.',
        'نقاط امتثال واضحة عبر الضرائب والتراخيص.',
        'استمرارية الأعمال عبر دعم التجديدات.'
      ]
    },
    industries: {
      en: ['SMEs', 'Corporate Groups', 'Retail', 'Construction', 'Hospitality', 'Professional Services'],
      ar: ['الشركات الصغيرة والمتوسطة', 'المجموعات المؤسسية', 'التجزئة', 'الإنشاءات', 'الضيافة', 'الخدمات المهنية']
    },
    timeline: [
      { en: 'Authority requirement mapping', ar: 'تحديد متطلبات الجهات' },
      { en: 'File preparation and validations', ar: 'إعداد الملفات والتحقق' },
      { en: 'Submission and tracking', ar: 'التقديم والمتابعة' },
      { en: 'Approval closure and compliance log', ar: 'الإغلاق النهائي وسجل الامتثال' }
    ],
    stats: [
      { value: '12+', en: 'Core PRO Tracks', ar: 'مسارات PRO أساسية' },
      { value: '1', en: 'Unified Liaison Team', ar: 'فريق تنسيق موحد' },
      { value: '5', en: 'Compliance Pillars', ar: 'محاور امتثال' },
      { value: '24/6', en: 'Coordination Window', ar: 'نافذة تنسيق' }
    ],
    why: {
      en: ['Reduced filing delays with structured checklists.', 'Direct authority follow-up and status control.', 'Commercial-grade reporting for management teams.', 'Integrated compliance support beyond one-off tasks.'],
      ar: ['تقليل التأخير عبر قوائم تحقق منظمة.', 'متابعة مباشرة مع الجهات وحالة الطلب.', 'تقارير إدارية احترافية لفرق الإدارة.', 'دعم امتثال متكامل يتجاوز المعاملة الفردية.']
    },
    cta: {
      ctaTitleEn: 'Coordinate Your PRO Scope',
      ctaTitleAr: 'نسق نطاق خدمات PRO',
      ctaDescEn: 'Share required transactions and business stage to receive a practical PRO execution roadmap.',
      ctaDescAr: 'شارك المعاملات المطلوبة ومرحلة عملك للحصول على خارطة تنفيذ PRO عملية.',
      formTag: 'PRO Services'
    }
  })
}));

write('service-company.html', wrapPage({
  seoTitle: 'Business Setup - Silvora Talenza World',
  description: 'Business setup page covering mainland, free zone, offshore, licensing, tax registration, and growth support.',
  arTitle: 'تأسيس الأعمال | سيلفورا تالينزا وورلد',
  arDescription: 'صفحة تأسيس أعمال تغطي البر الرئيسي والمناطق الحرة والأوفشور والترخيص والضرائب ودعم النمو.',
  body: buildServicePage({
    hero: {
      kickerEn: 'Entity Formation & Launch',
      kickerAr: 'تأسيس الكيانات والإطلاق',
      titleEn: 'Business Setup',
      titleAr: 'تأسيس الأعمال',
      leadEn: 'Build and launch your UAE business with one advisory and execution partner from planning to operations.',
      leadAr: 'أسس وأطلق عملك في الإمارات مع شريك استشاري وتنفيذي واحد من التخطيط حتى التشغيل.',
      image: 'img/services/company formation.png'
    },
    overview: {
      en: 'We design setup pathways aligned to ownership model, activity type, compliance obligations, and growth plans.',
      ar: 'نصمم مسارات التأسيس وفق نموذج الملكية ونوع النشاط ومتطلبات الامتثال وخطط النمو.'
    },
    categories: [
      { en: 'Mainland Company', ar: 'شركة في البر الرئيسي', enDesc: 'Commercial setup for local-market operations.', arDesc: 'تأسيس مخصص للتشغيل داخل السوق المحلي.' },
      { en: 'Free Zone Company', ar: 'شركة منطقة حرة', enDesc: 'Jurisdiction-based setup routes.', arDesc: 'مسارات تأسيس حسب الجهة التنظيمية.' },
      { en: 'Offshore Company', ar: 'شركة أوفشور', enDesc: 'International holding and structure options.', arDesc: 'خيارات هيكلة وملكية دولية.' },
      { en: 'Business License', ar: 'الرخصة التجارية', enDesc: 'License issuance and activity alignment.', arDesc: 'إصدار الرخصة ومواءمة الأنشطة.' },
      { en: 'Corporate Bank Account', ar: 'حساب بنكي للشركة', enDesc: 'Preparation support for account onboarding.', arDesc: 'دعم التحضير لفتح الحساب البنكي.' },
      { en: 'Tax & VAT Registration', ar: 'تسجيل الضرائب وVAT', enDesc: 'Regulatory registration and filing readiness.', arDesc: 'التسجيل التنظيمي وجاهزية الإقرارات.' },
      { en: 'Government Approvals', ar: 'الموافقات الحكومية', enDesc: 'Authority approvals and submission cycles.', arDesc: 'موافقات الجهات ودورات التقديم.' },
      { en: 'Growth Support & Renewal', ar: 'دعم النمو والتجديد', enDesc: 'Post-launch compliance and expansion support.', arDesc: 'دعم ما بعد الإطلاق والامتثال والتوسع.' }
    ],
    benefits: {
      en: [
        'Faster market entry with structured setup pathways.',
        'Regulatory confidence from kickoff to license issuance.',
        'Integrated advisory for banking, tax, and approvals.',
        'Scalable foundation for growth and renewals.'
      ],
      ar: [
        'دخول أسرع للسوق عبر مسارات تأسيس منظمة.',
        'ثقة تنظيمية من البداية حتى إصدار الرخصة.',
        'استشارة متكاملة للحساب البنكي والضرائب والموافقات.',
        'أساس قابل للتوسع للنمو والتجديدات.'
      ]
    },
    industries: {
      en: ['Consulting', 'Trading', 'Logistics', 'Technology', 'Recruitment', 'Hospitality'],
      ar: ['الاستشارات', 'التجارة', 'اللوجستيات', 'التقنية', 'التوظيف', 'الضيافة']
    },
    timeline: [
      { en: 'Business activity and model planning', ar: 'تخطيط النشاط ونموذج العمل' },
      { en: 'Jurisdiction and license strategy', ar: 'اختيار الجهة واستراتيجية الترخيص' },
      { en: 'Registration and approvals', ar: 'التسجيل والموافقات' },
      { en: 'Operational launch and renewal planning', ar: 'الإطلاق التشغيلي وخطة التجديد' }
    ],
    stats: [
      { value: '3', en: 'Setup Models Covered', ar: 'نماذج تأسيس مغطاة' },
      { value: '100%', en: 'Documentation Framework', ar: 'إطار توثيق متكامل' },
      { value: '1', en: 'Single Advisory Team', ar: 'فريق استشاري موحد' },
      { value: '360', en: 'Post-Setup Support', ar: 'دعم ما بعد التأسيس' }
    ],
    why: {
      en: ['Commercial-first setup planning for sustainable growth.', 'Clear cost and timeline visibility before filing.', 'Cross-functional support with PRO and compliance tracks.', 'Scalable model for expansion and renewals.'],
      ar: ['تخطيط تأسيس يركز على الجدوى التجارية والنمو.', 'وضوح التكلفة والمدة قبل التقديم.', 'دعم متكامل مع مسارات PRO والامتثال.', 'نموذج قابل للتوسع للتجديد والتوسع.']
    },
    cta: {
      ctaTitleEn: 'Plan Your Business Launch',
      ctaTitleAr: 'خطط لإطلاق عملك',
      ctaDescEn: 'Discuss your activity and ownership goals to receive the right setup roadmap.',
      ctaDescAr: 'ناقش نشاطك وأهداف الملكية للحصول على خارطة تأسيس مناسبة.',
      formTag: 'Business Setup'
    }
  })
}));

write('service-digital.html', wrapPage({
  seoTitle: 'Digital Marketing & Technology - Silvora Talenza World',
  description: 'Unified digital and technology services including web development, CRM, SEO, ads, branding, apps, hosting, and security.',
  arTitle: 'التسويق الرقمي والتقنية | سيلفورا تالينزا وورلد',
  arDescription: 'خدمات رقمية وتقنية موحدة تشمل تطوير المواقع وCRM والسيو والإعلانات والهوية والتطبيقات والاستضافة والحماية.',
  body: buildServicePage({
    hero: {
      kickerEn: 'Growth Marketing & Product Delivery',
      kickerAr: 'تسويق النمو وتنفيذ المنتجات الرقمية',
      titleEn: 'Digital Marketing & Technology',
      titleAr: 'التسويق الرقمي والتقنية',
      leadEn: 'One execution stack for websites, campaigns, automation, and technology products that support business growth.',
      leadAr: 'منظومة تنفيذ موحدة للمواقع والحملات والأتمتة والمنتجات التقنية الداعمة لنمو الأعمال.',
      image: 'img/services/WEB DESIGN.jpg'
    },
    overview: {
      en: 'We merge marketing and technology into one delivery model, reducing handoff friction and accelerating outcomes.',
      ar: 'نمزج التسويق والتقنية في نموذج تنفيذ واحد لتقليل فجوة التسليم وتسريع النتائج.'
    },
    categories: [
      { en: 'Corporate Website Development', ar: 'تطوير مواقع الشركات', enDesc: 'High-performance corporate websites.', arDesc: 'مواقع شركات عالية الأداء.' },
      { en: 'Recruitment Website Development', ar: 'تطوير مواقع التوظيف', enDesc: 'Job-ready recruitment platforms.', arDesc: 'منصات توظيف جاهزة للتشغيل.' },
      { en: 'CRM Development & Client Portal', ar: 'تطوير CRM وبوابة العملاء', enDesc: 'Lead and client lifecycle automation.', arDesc: 'أتمتة دورة العملاء والفرص.' },
      { en: 'SEO, Google Ads, Meta Ads', ar: 'SEO وإعلانات جوجل وميتا', enDesc: 'Search and paid acquisition programs.', arDesc: 'برامج الاستحواذ عبر البحث والإعلانات.' },
      { en: 'Social Media Marketing & Branding', ar: 'التسويق الاجتماعي والهوية', enDesc: 'Brand growth and channel communication.', arDesc: 'تنمية العلامة والتواصل عبر القنوات.' },
      { en: 'Logo Design & Creative Systems', ar: 'تصميم الشعار والأنظمة الإبداعية', enDesc: 'Identity assets and brand consistency.', arDesc: 'أصول الهوية واتساق العلامة.' },
      { en: 'Mobile Apps, Hosting, Maintenance', ar: 'التطبيقات والاستضافة والصيانة', enDesc: 'Continuous digital operations support.', arDesc: 'دعم تشغيلي رقمي مستمر.' },
      { en: 'Security & Technology Stack', ar: 'الحماية والبنية التقنية', enDesc: 'Secure stack design and governance.', arDesc: 'تصميم بنية آمنة وحوكمة تقنية.' }
    ],
    benefits: {
      en: [
        'Single delivery team for strategy, creative, and engineering.',
        'Faster go-live cycles with phased execution.',
        'Performance visibility across traffic, leads, and conversion.',
        'Reliable maintenance and security controls after launch.'
      ],
      ar: [
        'فريق تنفيذ موحد للاستراتيجية والإبداع والهندسة.',
        'دورات إطلاق أسرع عبر تنفيذ مرحلي.',
        'رؤية أداء واضحة لحركة الزيارات والعملاء المحتملين والتحويل.',
        'صيانة موثوقة وضوابط أمنية بعد الإطلاق.'
      ]
    },
    industries: {
      en: ['Recruitment', 'Professional Services', 'Retail', 'Education', 'Healthcare', 'Real Estate'],
      ar: ['التوظيف', 'الخدمات المهنية', 'التجزئة', 'التعليم', 'الرعاية الصحية', 'العقارات']
    },
    timeline: [
      { en: 'Discovery and growth objective mapping', ar: 'الاكتشاف وتحديد أهداف النمو' },
      { en: 'Information architecture and workflow design', ar: 'تصميم الهيكل المعلوماتي وسير العمل' },
      { en: 'Build, campaign launch, and QA', ar: 'التنفيذ وإطلاق الحملات وضمان الجودة' },
      { en: 'Optimization, reporting, and scale', ar: 'التحسين والتقارير والتوسع' }
    ],
    stats: [
      { value: '12+', en: 'Digital Capability Tracks', ar: 'مسارات قدرات رقمية' },
      { value: '1', en: 'Integrated Delivery Squad', ar: 'فريق تنفيذ متكامل' },
      { value: '3', en: 'Workflow Layers', ar: 'طبقات سير عمل' },
      { value: '24/6', en: 'Support & Monitoring', ar: 'الدعم والمراقبة' }
    ],
    why: {
      en: ['Unified strategy across marketing and engineering.', 'Business-first KPI and conversion focus.', 'Agile delivery with visible sprint milestones.', 'Long-term maintenance and security governance.'],
      ar: ['استراتيجية موحدة بين التسويق والهندسة.', 'تركيز على مؤشرات الأداء والتحويل التجاري.', 'تنفيذ مرن بمراحل واضحة قابلة للقياس.', 'صيانة طويلة المدى وحوكمة أمنية.']
    },
    cta: {
      ctaTitleEn: 'Build Your Digital Growth Engine',
      ctaTitleAr: 'ابنِ محرك نموك الرقمي',
      ctaDescEn: 'Share your business goals to receive a practical digital and technology roadmap.',
      ctaDescAr: 'شارك أهدافك التجارية للحصول على خارطة طريق رقمية وتقنية عملية.',
      formTag: 'Digital Marketing & Technology'
    }
  })
}));

console.log('Generated service hub and five consolidated service pages.');
