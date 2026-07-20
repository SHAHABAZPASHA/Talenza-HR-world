import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();

const company = {
  nameEn: 'Silvora Talenza World LLC',
  nameAr: 'سيلفورا تالينزا وورلد ذ.م.م',
  phone: '+971 58 589 5827',
  email: 'info@silvoratalenzaworld.com',
  website: 'https://www.silvoratalenzaworld.com',
  profilePdf: 'img/certificate/TALENZA PROFILE.pdf',
  whatsapp: 'https://wa.me/971585895827',
  addressEn: 'Office No. 307, Al Dana Center, Maktoum Road, Deira, Dubai, UAE',
  addressAr: 'مكتب رقم 307، مركز الدانة، شارع مكتوم، ديرة، دبي، الإمارات العربية المتحدة'
};

const menuLinks = [
  { href: 'index.html', en: 'Home', ar: 'الرئيسية' },
  { href: 'about.html', en: 'About', ar: 'من نحن' },
  { href: 'our-team.html', en: 'Our Team', ar: 'فريقنا' },
  { href: 'service.html', en: 'Services', ar: 'خدماتنا' },
  { href: 'blogs.html', en: 'Blogs', ar: 'المدونة' },
  { href: 'jobs.html', en: 'Jobs', ar: 'الوظائف' },
  { href: 'clients.html', en: 'Clients', ar: 'عملاؤنا' },
  { href: 'contact.html', en: 'Contact', ar: 'اتصل بنا' }
];

const heroImages = {
  visa: 'img/services/Visa.jpg',
  work: 'img/services/5.jpg',
  pro: 'img/services/pro.png',
  business: 'img/services/company formation.png',
  digital: 'img/services/WEB DESIGN.jpg',
  recruitment: 'img/services/6.jpg'
};

const visaDisclaimerEn =
  'Visa regulations, documentation requirements, fees, and processing times are subject to change. Please contact Silvora Talenza World LLC for the latest information.';
const visaDisclaimerAr =
  'تخضع أنظمة التأشيرات ومتطلبات المستندات والرسوم ومدة المعالجة للتغيير. يرجى التواصل مع سيلفورا تالينزا وورلد ذ.م.م للحصول على أحدث المعلومات.';

function esc(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function write(file, content) {
  fs.writeFileSync(path.join(root, file), content, 'utf8');
}

function navMarkup(fileName) {
  return menuLinks
    .map(
      (item) =>
        `<a href="${item.href}" class="nav-item nav-link${item.href === fileName ? ' active' : ''}"><span class="english-text">${item.en}</span><span class="arabic-text" dir="rtl">${item.ar}</span></a>`
    )
    .join('');
}

function footerMarkup() {
  return `<footer class="container-fluid footer mt-5"><div class="container py-4"><div class="row g-3 align-items-start"><div class="col-md-6 col-lg-3"><h5 class="mb-2"><span class="english-text">Company</span><span class="arabic-text" dir="rtl">الشركة</span></h5><p class="mb-2"><span class="english-text">${company.nameEn} delivers recruitment, visa, PRO, business setup, and digital services with measurable business outcomes.</span><span class="arabic-text" dir="rtl">تقدم ${company.nameAr} خدمات التوظيف والتأشيرات وPRO وتأسيس الأعمال والخدمات الرقمية بنتائج أعمال قابلة للقياس.</span></p><div class="d-flex gap-2"><a class="btn btn-sm btn-social" href="https://x.com/TALENZA216728" target="_blank" rel="noopener" aria-label="Twitter"><i class="fab fa-twitter"></i></a><a class="btn btn-sm btn-social" href="https://www.facebook.com/profile.php?id=61588411206914" target="_blank" rel="noopener" aria-label="Facebook"><i class="fab fa-facebook-f"></i></a><a class="btn btn-sm btn-social" href="https://www.instagram.com/talenza.uae/" target="_blank" rel="noopener" aria-label="Instagram"><i class="fab fa-instagram"></i></a></div></div><div class="col-md-6 col-lg-3"><h5 class="mb-2"><span class="english-text">Quick Links</span><span class="arabic-text" dir="rtl">روابط سريعة</span></h5><div class="footer-menu d-grid gap-1"><a href="about.html"><span class="english-text">About</span><span class="arabic-text" dir="rtl">من نحن</span></a><a href="our-team.html"><span class="english-text">Our Team</span><span class="arabic-text" dir="rtl">فريقنا</span></a><a href="service.html"><span class="english-text">Services Hub</span><span class="arabic-text" dir="rtl">بوابة الخدمات</span></a><a href="contact.html"><span class="english-text">Contact</span><span class="arabic-text" dir="rtl">اتصل بنا</span></a></div></div><div class="col-md-6 col-lg-3"><h5 class="mb-2"><span class="english-text">Service Hubs</span><span class="arabic-text" dir="rtl">بوابات الخدمات</span></h5><div class="footer-menu d-grid gap-1"><a href="service-visa.html"><span class="english-text">Visa Services</span><span class="arabic-text" dir="rtl">خدمات التأشيرات</span></a><a href="service-pro.html"><span class="english-text">PRO Services</span><span class="arabic-text" dir="rtl">خدمات PRO</span></a><a href="service-company.html"><span class="english-text">Business Setup</span><span class="arabic-text" dir="rtl">تأسيس الأعمال</span></a><a href="service-digital.html"><span class="english-text">Digital Services</span><span class="arabic-text" dir="rtl">الخدمات الرقمية</span></a></div></div><div class="col-md-6 col-lg-3"><h5 class="mb-2"><span class="english-text">Contact</span><span class="arabic-text" dir="rtl">اتصل بنا</span></h5><p class="mb-1"><i class="fa fa-map-marker-alt me-2"></i><span class="english-text">${company.addressEn}</span><span class="arabic-text" dir="rtl">${company.addressAr}</span></p><p class="mb-1"><i class="fa fa-phone-alt me-2"></i><a href="tel:${company.phone.replace(/\s+/g, '')}">${company.phone}</a></p><p class="mb-1"><i class="fa fa-envelope me-2"></i><a href="mailto:${company.email}">${company.email}</a></p><p class="mb-0"><i class="fa fa-globe me-2"></i><a href="${company.website}" target="_blank" rel="noopener">${company.website.replace('https://', '')}</a></p></div></div><div class="copyright mt-3 pt-2 d-flex flex-column flex-md-row justify-content-between gap-2"><span><span class="english-text">© 2026 ${company.nameEn}. All Rights Reserved.</span><span class="arabic-text" dir="rtl">© 2026 ${company.nameAr}. جميع الحقوق محفوظة.</span></span><span><a href="privacy-policy.html"><span class="english-text">Privacy Policy</span><span class="arabic-text" dir="rtl">سياسة الخصوصية</span></a> · <a href="terms-and-conditions.html"><span class="english-text">Terms &amp; Conditions</span><span class="arabic-text" dir="rtl">الشروط والأحكام</span></a> · <a href="cookie-policy.html"><span class="english-text">Cookie Policy</span><span class="arabic-text" dir="rtl">سياسة ملفات تعريف الارتباط</span></a></span></div></div></footer>`;
}

function sectionTitle(en, ar) {
  return `<div class="section-title text-center mb-4"><h2 class="english-text">${esc(en)}</h2><div class="arabic-text" dir="rtl">${esc(ar)}</div></div>`;
}

function paragraphSection(titleEn, titleAr, bodyEn, bodyAr, extraClass = '') {
  return `<section class="py-5 ${extraClass}"><div class="container">${sectionTitle(
    titleEn,
    titleAr
  )}<div class="row justify-content-center"><div class="col-lg-10"><p class="mb-3 english-text">${esc(
    bodyEn
  )}</p><div class="arabic-text" dir="rtl">${esc(bodyAr)}</div></div></div></div></section>`;
}

function cardsSection(titleEn, titleAr, items) {
  return `<section class="py-5 bg-light"><div class="container">${sectionTitle(
    titleEn,
    titleAr
  )}<div class="row g-4">${items
    .map(
      (item) =>
        `<div class="col-md-6 col-lg-4"><div class="card border-0 shadow-sm h-100"><div class="card-body p-4"><h3 class="h5 mb-2 english-text">${esc(
          item.enTitle
        )}</h3><div class="arabic-text mb-2" dir="rtl">${esc(item.arTitle)}</div><p class="mb-0 english-text">${esc(
          item.enBody
        )}</p><div class="arabic-text mt-2" dir="rtl">${esc(item.arBody)}</div></div></div></div>`
    )
    .join('')}</div></div></section>`;
}

function bulletsSection(titleEn, titleAr, enList, arList, extraClass = '') {
  return `<section class="py-5 ${extraClass}"><div class="container">${sectionTitle(
    titleEn,
    titleAr
  )}<div class="row g-4"><div class="col-lg-6"><div class="card border-0 shadow-sm h-100"><div class="card-body p-4"><ul class="mb-0">${enList
    .map((x) => `<li class="mb-2 english-text">${esc(x)}</li>`)
    .join('')}</ul></div></div></div><div class="col-lg-6"><div class="card border-0 shadow-sm h-100"><div class="card-body p-4"><div class="arabic-text" dir="rtl"><ul class="mb-0">${arList
    .map((x) => `<li class="mb-2">${esc(x)}</li>`)
    .join('')}</ul></div></div></div></div></div></div></section>`;
}

function processSection(process) {
  return `<section class="py-5 bg-light"><div class="container">${sectionTitle(
    'Step-by-Step Process',
    'الخطوات التفصيلية'
  )}<div class="row g-4">${process
    .map(
      (step, idx) =>
        `<div class="col-md-6 col-lg-3"><div class="card border-0 shadow-sm h-100"><div class="card-body p-4"><div class="badge bg-primary rounded-pill mb-3">${idx +
          1}</div><h3 class="h6 english-text">${esc(step.en)}</h3><div class="arabic-text" dir="rtl">${esc(
          step.ar
        )}</div></div></div></div>`
    )
    .join('')}</div></div></section>`;
}

function relatedSection(related) {
  return `<section class="py-5"><div class="container">${sectionTitle(
    'Related Services',
    'خدمات ذات صلة'
  )}<div class="row g-3">${related
    .map(
      (item) =>
        `<div class="col-md-6 col-lg-3"><a href="${item.href}" class="card border-0 shadow-sm h-100 text-decoration-none"><div class="card-body p-4"><h3 class="h6 mb-2 english-text">${esc(
          item.en
        )}</h3><div class="arabic-text" dir="rtl">${esc(item.ar)}</div></div></a></div>`
    )
    .join('')}</div></div></section>`;
}

function faqSection(faq) {
  const items = faq
    .map(
      (q, idx) =>
        `<div class="accordion-item"><h3 class="accordion-header" id="faq-${idx}"><button class="accordion-button ${
          idx ? 'collapsed' : ''
        }" type="button" data-bs-toggle="collapse" data-bs-target="#faq-body-${idx}" aria-expanded="${
          idx ? 'false' : 'true'
        }" aria-controls="faq-body-${idx}"><span class="english-text">${esc(
          q.qEn
        )}</span><span class="arabic-text" dir="rtl">${esc(q.qAr)}</span></button></h3><div id="faq-body-${idx}" class="accordion-collapse collapse ${
          idx ? '' : 'show'
        }" aria-labelledby="faq-${idx}" data-bs-parent="#faqAccordion"><div class="accordion-body"><p class="mb-0 english-text">${esc(
          q.aEn
        )}</p><div class="arabic-text mt-2" dir="rtl">${esc(q.aAr)}</div></div></div></div>`
    )
    .join('');

  return `<section class="py-5 bg-light"><div class="container">${sectionTitle(
    'Frequently Asked Questions',
    'الأسئلة الشائعة'
  )}<div class="accordion" id="faqAccordion">${items}</div></div></section>`;
}

function profileAndCtaSection(serviceEn, serviceAr) {
  return `<section class="py-5"><div class="container"><div class="row g-4 align-items-stretch"><div class="col-lg-7"><div class="card border-0 shadow-sm h-100"><div class="card-body p-4 p-lg-5"><h2 class="h3 mb-3 english-text">Start Your ${esc(
    serviceEn
  )} Project with Confidence</h2><div class="arabic-text mb-3" dir="rtl">ابدأ مشروع ${esc(
    serviceAr
  )} بثقة</div><p class="mb-3 english-text">Our consultants map scope, eligibility, timeline, and documentation before execution so your team can make informed decisions.</p><div class="arabic-text" dir="rtl">يقوم مستشارونا بتحديد النطاق والأهلية والمدة والمستندات قبل التنفيذ حتى يتمكن فريقك من اتخاذ قرارات مدروسة.</div><div class="d-flex flex-wrap gap-3 mt-4"><a href="contact.html" class="btn btn-primary rounded-pill px-4 py-2 english-text">Book Consultation</a><a href="${company.whatsapp}" target="_blank" rel="noopener" class="btn btn-outline-primary rounded-pill px-4 py-2 english-text">WhatsApp Inquiry</a><a href="${company.profilePdf}" target="_blank" rel="noopener" class="btn btn-light border rounded-pill px-4 py-2 english-text">Download Company Profile</a></div></div></div></div><div class="col-lg-5">${contactCard(
    serviceEn,
    serviceAr
  )}</div></div></div></section>`;
}

function contactCard(serviceEn, serviceAr) {
  return `<div class="card border-0 shadow-sm h-100"><div class="card-body p-4"><h3 class="h5 english-text">Contact Form</h3><div class="arabic-text mb-3" dir="rtl">نموذج التواصل</div><form action="contact.php" method="post"><input type="hidden" name="service" value="${esc(
    serviceEn
  )}"><div class="row g-3"><div class="col-12"><label class="form-label english-text">Your Name</label><input class="form-control" name="name" type="text" required></div><div class="col-12"><label class="form-label english-text">Your Email</label><input class="form-control" name="email" type="email" required></div><div class="col-12"><label class="form-label english-text">Phone</label><input class="form-control" name="phone" type="text"></div><div class="col-12"><label class="form-label english-text">Message</label><textarea class="form-control" name="message" rows="4" required></textarea></div><div class="col-12 d-grid"><button class="btn btn-primary rounded-pill py-2 english-text" type="submit">Submit Enquiry</button></div></div></form><div class="mt-3 small text-muted english-text">Service requested: ${esc(
    serviceEn
  )}</div><div class="arabic-text small text-muted" dir="rtl">الخدمة المطلوبة: ${esc(
    serviceAr
  )}</div></div></div>`;
}

function breadcrumbUi(pageTitleEn, pageTitleAr) {
  return `<section class="py-3 border-top border-bottom bg-light"><div class="container"><div class="d-flex flex-wrap justify-content-between align-items-center gap-2"><nav aria-label="breadcrumb"><ol class="breadcrumb mb-0"><li class="breadcrumb-item"><a href="index.html" class="english-text">Home</a><span class="arabic-text" dir="rtl">الرئيسية</span></li><li class="breadcrumb-item"><a href="service.html" class="english-text">Services</a><span class="arabic-text" dir="rtl">الخدمات</span></li><li class="breadcrumb-item active english-text" aria-current="page">${esc(
    pageTitleEn
  )}</li></ol></nav><div class="arabic-text text-muted" dir="rtl">${esc(pageTitleAr)}</div></div></div></section>`;
}

function hero(page) {
  return `<section class="hero-header py-5" style="background: linear-gradient(135deg, rgba(15,54,124,0.95), rgba(25,103,184,0.92));"><div class="container py-4"><div class="row g-4 align-items-center"><div class="col-lg-7 text-white"><div class="hero-kicker mb-3 english-text">${esc(
    page.kickerEn
  )}</div><h1 class="display-5 fw-bold mb-3 english-text">${esc(page.h1En)}</h1><div class="arabic-text mb-3" dir="rtl">${esc(
    page.h1Ar
  )}</div><p class="lead mb-0 english-text">${esc(page.heroEn)}</p><div class="arabic-text mt-2" dir="rtl">${esc(page.heroAr)}</div></div><div class="col-lg-5"><div class="card border-0 shadow-lg overflow-hidden"><img src="${esc(
    page.heroImage
  )}" class="img-fluid" alt="${esc(page.h1En)}" style="width:100%; min-height:320px; object-fit:cover;"></div></div></div></div></section>`;
}

function buildFaqSchema(pageUrl, faq) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faq.map((item) => ({
      '@type': 'Question',
      name: item.qEn,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.aEn
      }
    })),
    url: pageUrl
  };
}

function buildBreadcrumbSchema(page) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: `${company.website}/index.html`
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Services',
        item: `${company.website}/service.html`
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: page.h1En,
        item: `${company.website}/${page.file}`
      }
    ]
  };
}

function pageShell(page, bodyHtml, faq) {
  const pageUrl = `${company.website}/${page.file}`;
  const breadcrumbSchema = buildBreadcrumbSchema(page);
  const faqSchema = buildFaqSchema(pageUrl, faq);
  const keywordsEn = page.keywordsEn.join(', ');
  const keywordsAr = page.keywordsAr.join('، ');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>${esc(page.titleEn)}</title>
  <meta name="description" content="${esc(page.metaEn)}">
  <meta name="keywords" content="${esc(keywordsEn)}">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="canonical" href="${esc(pageUrl)}">
  <meta property="og:type" content="website">
  <meta property="og:site_name" content="Silvora Talenza World">
  <meta property="og:title" content="${esc(page.titleEn)}">
  <meta property="og:description" content="${esc(page.metaEn)}">
  <meta property="og:url" content="${esc(pageUrl)}">
  <meta property="og:image" content="${company.website}/img/TALENZA_logo_v2.png">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${esc(page.titleEn)}">
  <meta name="twitter:description" content="${esc(page.metaEn)}">
  <meta name="twitter:image" content="${company.website}/img/TALENZA_logo_v2.png">
  <script>window.SilvoraPageSeo={en:{title:${JSON.stringify(page.titleEn)},description:${JSON.stringify(
    page.metaEn
  )},keywords:${JSON.stringify(keywordsEn)}},ar:{title:${JSON.stringify(
    page.titleAr
  )},description:${JSON.stringify(page.metaAr)},keywords:${JSON.stringify(keywordsAr)}}};</script>
  <script type="application/ld+json">${JSON.stringify(breadcrumbSchema)}</script>
  <script type="application/ld+json">${JSON.stringify(faqSchema)}</script>
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
        <div class="collapse navbar-collapse" id="navbarCollapse"><div class="navbar-nav ms-auto py-0">${navMarkup(
          page.file
        )}</div></div>
      </nav>
    </div>
    ${hero(page)}
    ${breadcrumbUi(page.h1En, page.h1Ar)}
    ${bodyHtml}
    ${footerMarkup()}
  </div>
  <a href="${company.whatsapp}" class="whatsapp-float" target="_blank" rel="noopener" aria-label="Chat with us on WhatsApp"><i class="fab fa-whatsapp"></i></a>
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

function standardFaq(serviceEn, serviceAr) {
  return [
    {
      qEn: `How do we start ${serviceEn}?`,
      qAr: `كيف نبدأ خدمة ${serviceAr}؟`,
      aEn: `We begin with a structured discovery call, define scope, and issue an execution checklist with timeline checkpoints.`,
      aAr: `نبدأ بمكالمة اكتشاف منظمة، ثم نحدد النطاق ونصدر قائمة تنفيذ مع نقاط زمنية واضحة.`
    },
    {
      qEn: `Can your team coordinate documentation and follow-up?`,
      qAr: `هل يمكن لفريقكم تنسيق المستندات والمتابعة؟`,
      aEn: `Yes. Our consultants coordinate documentation, quality checks, and stakeholder follow-up for ${serviceEn} until delivery.`,
      aAr: `نعم، ينسق مستشارونا المستندات وفحوص الجودة والمتابعة مع الجهات المعنية لخدمة ${serviceAr} حتى التسليم.`
    },
    {
      qEn: `Will we receive progress updates?`,
      qAr: `هل سنتلقى تحديثات مرحلية؟`,
      aEn: `You receive milestone-based updates for ${serviceEn} with next actions, risks, and required client inputs.`,
      aAr: `ستتلقى تحديثات مرحلية لخدمة ${serviceAr} مع الخطوات القادمة والمخاطر والمدخلات المطلوبة من العميل.`
    },
    {
      qEn: `Do you support post-delivery requirements?`,
      qAr: `هل تدعمون المتطلبات بعد التسليم؟`,
      aEn: `Yes. We provide continuity support for ${serviceEn} renewals, amendments, and optimization requirements.`,
      aAr: `نعم، نقدم دعماً مستمراً لتجديدات وتعديلات ومتطلبات تحسين خدمة ${serviceAr}.`
    }
  ];
}

function visaFaq(country) {
  return [
    {
      qEn: `Is visa approval guaranteed for ${country}?`,
      qAr: `هل الموافقة على تأشيرة ${country} مضمونة؟`,
      aEn: `No. Approvals are solely issued by the relevant authority based on current regulations and submitted evidence.`,
      aAr: `لا. تصدر الموافقات حصراً من الجهة المختصة وفق الأنظمة السارية والأدلة المقدمة.`
    },
    {
      qEn: `How are eligibility and document requirements confirmed?`,
      qAr: `كيف يتم تأكيد الأهلية ومتطلبات المستندات؟`,
      aEn: `We assess profile details against generally applicable criteria and guide you through the required documentation pathway.`,
      aAr: `نقيّم تفاصيل الملف مقابل المعايير العامة ونرشدك إلى مسار المستندات المطلوب.`
    },
    {
      qEn: `How long does processing usually take?`,
      qAr: `كم تستغرق المعالجة عادةً؟`,
      aEn: `Processing timelines vary by visa category, authority workload, and document quality at submission stage.`,
      aAr: `تختلف مدة المعالجة حسب فئة التأشيرة وضغط العمل لدى الجهة وجودة المستندات وقت التقديم.`
    },
    {
      qEn: `Can family applications be coordinated together?`,
      qAr: `هل يمكن تنسيق طلبات الأسرة معاً؟`,
      aEn: `Where allowed by the selected route, we structure principal and dependent files to reduce avoidable delays.`,
      aAr: `عند السماح بذلك في المسار المختار، نقوم بهيكلة ملفات مقدم الطلب الأساسي والمعالين لتقليل التأخير.`
    }
  ];
}

function renderVisaPage(page) {
  const faq = visaFaq(page.countryEn);
  const body = [
    paragraphSection('Detailed Introduction', 'مقدمة تفصيلية', page.introEn, page.introAr),
    paragraphSection('Complete Service Overview', 'نظرة شاملة على الخدمة', page.overviewEn, page.overviewAr, 'bg-light'),
    cardsSection('Purpose of the Visa', 'هدف التأشيرة', page.purposeCards),
    bulletsSection('Typical Eligibility Considerations', 'اعتبارات الأهلية المعتادة', page.eligibilityEn, page.eligibilityAr, 'bg-light'),
    bulletsSection('Commonly Requested Documents', 'المستندات المطلوبة عادةً', page.docsEn, page.docsAr),
    processSection(page.process),
    paragraphSection(
      'Processing Timeline and Validity',
      'المدة المتوقعة والصلاحية',
      `${page.timelineEn} Timelines vary by category, authority queue, and file readiness. ${page.validityEn}`,
      `${page.timelineAr} تختلف المدة حسب الفئة وزخم الجهة وجاهزية الملف. ${page.validityAr}`,
      'bg-light'
    ),
    paragraphSection('Important Regulatory Note', 'تنبيه تنظيمي مهم', visaDisclaimerEn, visaDisclaimerAr),
    cardsSection('Why Choose Silvora Talenza World LLC', 'لماذا تختار سيلفورا تالينزا وورلد ذ.م.م', page.whyChoose),
    relatedSection(page.related),
    faqSection(faq),
    profileAndCtaSection(page.h1En, page.h1Ar)
  ].join('\n');

  return pageShell(page, body, faq);
}

function renderWorkPermitPage(page) {
  const faq = standardFaq(page.h1En, page.h1Ar);
  const body = [
    paragraphSection('Country Overview', 'نظرة عامة على الدولة', page.countryOverviewEn, page.countryOverviewAr),
    paragraphSection('Labour Market Overview', 'نظرة عامة على سوق العمل', page.labourMarketEn, page.labourMarketAr, 'bg-light'),
    bulletsSection('Industries Currently Hiring', 'القطاعات التي توظف حالياً', page.hiringIndustriesEn, page.hiringIndustriesAr),
    bulletsSection('Typical Job Categories', 'فئات الوظائف المعتادة', page.jobCategoriesEn, page.jobCategoriesAr, 'bg-light'),
    paragraphSection(
      'Salary Expectations (Indicative Ranges)',
      'توقعات الرواتب (نطاقات إرشادية)',
      page.salaryEn,
      page.salaryAr
    ),
    cardsSection('Working Conditions', 'ظروف العمل', [
      { enTitle: 'Working Hours', arTitle: 'ساعات العمل', enBody: page.workingHoursEn, arBody: page.workingHoursAr },
      { enTitle: 'Employee Benefits', arTitle: 'مزايا الموظف', enBody: page.benefitsEn, arBody: page.benefitsAr },
      {
        enTitle: 'Accommodation and Insurance',
        arTitle: 'السكن والتأمين',
        enBody: page.accommodationInsuranceEn,
        arBody: page.accommodationInsuranceAr
      }
    ]),
    bulletsSection('Required Documents', 'المستندات المطلوبة', page.docsEn, page.docsAr, 'bg-light'),
    processSection(page.process),
    relatedSection(page.related),
    faqSection(faq),
    profileAndCtaSection(page.h1En, page.h1Ar)
  ].join('\n');

  return pageShell(page, body, faq);
}

function renderWebsiteDevelopmentPage(page) {
  const faq = standardFaq(page.h1En, page.h1Ar);
  const modules = [
    ['Corporate Websites', 'المواقع المؤسسية', 'B2B-ready architecture for trust, authority, and lead conversion.', 'بنية جاهزة للأعمال بين الشركات لبناء الثقة والمصداقية وتحويل العملاء المحتملين.'],
    ['Recruitment Websites', 'مواقع التوظيف', 'Role catalogs, application funnels, and candidate tracking integrations.', 'كتالوج الوظائف ومسارات التقديم وتكاملات متابعة المرشحين.'],
    ['CRM Development', 'تطوير CRM', 'Custom pipeline dashboards, automation, and SLA-based follow-up.', 'لوحات متابعة مخصصة وأتمتة ومتابعة مبنية على اتفاقيات مستوى الخدمة.'],
    ['Client Portals', 'بوابات العملاء', 'Secure client workspaces for project visibility and approvals.', 'مساحات آمنة للعملاء لعرض تقدم المشاريع وإدارة الاعتمادات.'],
    ['HR Systems', 'أنظمة الموارد البشرية', 'Modules for onboarding, policy records, and employee workflows.', 'وحدات للانضمام وحفظ السياسات وتدفقات عمل الموظفين.'],
    ['SEO and Performance Optimization', 'السيو وتحسين الأداء', 'Core Web Vitals, indexability, and structured content deployment.', 'تحسين مؤشرات الأداء الأساسية وقابلية الأرشفة ونشر محتوى منظم.'],
    ['Hosting, Maintenance, and Security', 'الاستضافة والصيانة والأمن', 'Managed hosting, patch cycles, backups, and hardening controls.', 'استضافة مُدارة ودورات تحديث ونسخ احتياطي وضوابط تقوية أمنية.'],
    ['Technology Stack', 'حزمة التقنية', 'PHP/Node integration readiness, modular front-end, and scalable APIs.', 'جاهزية تكامل PHP/Node وواجهة أمامية معيارية وواجهات API قابلة للتوسع.'],
    ['Project Workflow', 'منهجية التنفيذ', 'Discovery, UX mapping, build sprints, QA, launch, and optimization.', 'الاكتشاف ورسم تجربة المستخدم وسبرنتات التطوير وضمان الجودة والإطلاق والتحسين.']
  ].map((x) => ({ enTitle: x[0], arTitle: x[1], enBody: x[2], arBody: x[3] }));

  const body = [
    paragraphSection('Detailed Introduction', 'مقدمة تفصيلية', page.introEn, page.introAr),
    paragraphSection('Complete Service Overview', 'نظرة شاملة على الخدمة', page.overviewEn, page.overviewAr, 'bg-light'),
    cardsSection('Website Development Scope', 'نطاق تطوير المواقع', modules),
    bulletsSection('Benefits', 'الفوائد', page.benefitsEn, page.benefitsAr, 'bg-light'),
    cardsSection('Why Choose Silvora Talenza World LLC', 'لماذا تختار سيلفورا تالينزا وورلد ذ.م.م', page.whyChoose),
    bulletsSection('Industries Served', 'القطاعات المخدومة', page.industriesEn, page.industriesAr, 'bg-light'),
    processSection(page.process),
    relatedSection(page.related),
    faqSection(faq),
    profileAndCtaSection(page.h1En, page.h1Ar)
  ].join('\n');

  return pageShell(page, body, faq);
}

function renderStandardServicePage(page) {
  const faq = standardFaq(page.h1En, page.h1Ar);
  const body = [
    paragraphSection('Detailed Introduction', 'مقدمة تفصيلية', page.introEn, page.introAr),
    paragraphSection('Complete Service Overview', 'نظرة شاملة على الخدمة', page.overviewEn, page.overviewAr, 'bg-light'),
    bulletsSection('Benefits', 'الفوائد', page.benefitsEn, page.benefitsAr),
    cardsSection('Why Choose Silvora Talenza World LLC', 'لماذا تختار سيلفورا تالينزا وورلد ذ.م.م', page.whyChoose),
    bulletsSection('Industries Served', 'القطاعات المخدومة', page.industriesEn, page.industriesAr, 'bg-light'),
    processSection(page.process),
    page.docsEn ? bulletsSection('Required Documents', 'المستندات المطلوبة', page.docsEn, page.docsAr) : '',
    page.eligibilityEn
      ? bulletsSection('Eligibility Criteria', 'معايير الأهلية', page.eligibilityEn, page.eligibilityAr, 'bg-light')
      : '',
    page.timelineEn
      ? paragraphSection('Processing Timeline', 'المدة المتوقعة', page.timelineEn, page.timelineAr)
      : '',
    relatedSection(page.related),
    faqSection(faq),
    profileAndCtaSection(page.h1En, page.h1Ar)
  ]
    .filter(Boolean)
    .join('\n');

  return pageShell(page, body, faq);
}

const standardProcess = [
  { en: 'Consultation and scope definition', ar: 'الاستشارة وتحديد نطاق العمل' },
  { en: 'Document and data collection', ar: 'جمع المستندات والبيانات' },
  { en: 'Execution, filing, and follow-up', ar: 'التنفيذ والتقديم والمتابعة' },
  { en: 'Delivery, reporting, and ongoing support', ar: 'التسليم والتقارير والدعم المستمر' }
];

const whyChooseBase = [
  {
    enTitle: 'Execution Discipline',
    arTitle: 'انضباط التنفيذ',
    enBody: 'Milestone-based delivery with clear accountability at every stage.',
    arBody: 'تنفيذ قائم على مراحل واضحة مع مسؤولية محددة في كل خطوة.'
  },
  {
    enTitle: 'Bilingual Coordination',
    arTitle: 'تنسيق ثنائي اللغة',
    enBody: 'Client communication and documentation support in English and Arabic.',
    arBody: 'دعم تواصل العملاء والمستندات باللغتين الإنجليزية والعربية.'
  },
  {
    enTitle: 'Business Context',
    arTitle: 'فهم سياق الأعمال',
    enBody: 'Advice aligned to recruitment, visa, PRO, and growth priorities.',
    arBody: 'استشارات متوافقة مع أولويات التوظيف والتأشيرات وPRO والنمو.'
  }
];

function basePage(file, h1En, h1Ar, category, metaEn, metaAr, heroEn, heroAr) {
  return {
    file,
    category,
    heroImage: heroImages[category],
    kickerEn: `${h1En} Service`,
    titleEn: `${h1En} - Silvora Talenza World`,
    titleAr: `${h1Ar} | سيلفورا تالينزا وورلد`,
    h1En,
    h1Ar,
    metaEn,
    metaAr,
    heroEn,
    heroAr,
    process: standardProcess,
    whyChoose: whyChooseBase,
    keywordsEn: [h1En, 'Silvora Talenza World', 'Dubai', 'UAE', 'professional consultancy'],
    keywordsAr: [h1Ar, 'سيلفورا تالينزا وورلد', 'دبي', 'الإمارات', 'استشارات احترافية']
  };
}

const visaPages = [
  {
    ...basePage(
      'visa-uae-golden.html',
      'UAE Golden Visa Consultancy',
      'استشارات التأشيرة الذهبية في الإمارات',
      'visa',
      'Professional guidance for UAE Golden Visa pathways with structured eligibility and documentation review.',
      'إرشاد احترافي لمسارات التأشيرة الذهبية في الإمارات مع مراجعة منظمة للأهلية والمستندات.',
      'Strategic support for investors, specialists, and high-achieving professionals seeking long-term UAE residency.',
      'دعم استراتيجي للمستثمرين والمتخصصين وأصحاب الإنجازات المهنية الراغبين في إقامة طويلة الأجل بالإمارات.'
    ),
    countryEn: 'UAE Golden Visa',
    introEn: 'Our Golden Visa team structures each case around generally applicable criteria, supporting evidence quality, and filing readiness.',
    introAr: 'يقوم فريق التأشيرة الذهبية لدينا ببناء كل ملف وفق المعايير العامة وجودة الأدلة وجاهزية التقديم.',
    overviewEn: 'The service covers profile assessment, route selection, document mapping, and authority-facing submission preparation.',
    overviewAr: 'تشمل الخدمة تقييم الملف وتحديد المسار ورسم المستندات وتجهيز التقديم أمام الجهات المعنية.',
    purposeCards: [
      { enTitle: 'Long-Term Residency', arTitle: 'إقامة طويلة الأمد', enBody: 'Enable strategic continuity for professionals and investors in the UAE.', arBody: 'تمكين الاستمرارية الاستراتيجية للمهنيين والمستثمرين داخل الإمارات.' },
      { enTitle: 'Family Stability', arTitle: 'استقرار الأسرة', enBody: 'Support residence planning for dependents under applicable pathways.', arBody: 'دعم تخطيط الإقامة للمعالين وفق المسارات المتاحة.' },
      { enTitle: 'Business Mobility', arTitle: 'مرونة الأعمال', enBody: 'Facilitate long-horizon planning for leadership and ownership roles.', arBody: 'تسهيل التخطيط بعيد المدى للأدوار القيادية والملكية.' }
    ],
    eligibilityEn: ['Profile alignment with selected Golden Visa route.', 'Supporting evidence that demonstrates qualification criteria.', 'Valid passport and complete identity records.'],
    eligibilityAr: ['توافق الملف مع المسار المختار للتأشيرة الذهبية.', 'أدلة داعمة تُظهر استيفاء معايير التأهيل.', 'جواز سفر ساري وسجلات هوية مكتملة.'],
    docsEn: ['Passport copy and identity records.', 'Category-specific supporting evidence.', 'Application forms and declarations.', 'Sponsor or institutional letters where applicable.'],
    docsAr: ['نسخة جواز السفر وسجلات الهوية.', 'أدلة داعمة خاصة بالفئة.', 'نماذج الطلب والإقرارات.', 'خطابات الكفيل أو الجهة ذات الصلة عند الحاجة.'],
    timelineEn: 'Most Golden Visa cases move in staged checkpoints from assessment to final issuance.',
    timelineAr: 'تسير معظم ملفات التأشيرة الذهبية عبر مراحل واضحة من التقييم حتى الإصدار النهائي.',
    validityEn: 'Validity is determined by the approved route and authority decision.',
    validityAr: 'تُحدد الصلاحية وفق المسار المعتمد وقرار الجهة المختصة.',
    related: [
      { href: 'visa-uae-employment.html', en: 'UAE Employment Visa', ar: 'تأشيرة العمل في الإمارات' },
      { href: 'visa-uae-family.html', en: 'UAE Family Visa', ar: 'تأشيرة الأسرة في الإمارات' },
      { href: 'pro-golden-visa.html', en: 'Golden Visa PRO Support', ar: 'دعم PRO للتأشيرة الذهبية' },
      { href: 'service-visa.html', en: 'Visa Services Hub', ar: 'بوابة خدمات التأشيرات' }
    ]
  },
  {
    ...basePage(
      'visa-uae-employment.html',
      'UAE Employment Visa Consultancy',
      'استشارات تأشيرة العمل في الإمارات',
      'visa',
      'Employment visa consultancy for compliant hiring, onboarding, and residency setup in the UAE.',
      'استشارات تأشيرة العمل للتوظيف المتوافق والانضمام والإقامة في الإمارات.',
      'Operational support for UAE employers and professionals to launch employment-linked residency with confidence.',
      'دعم تشغيلي لأصحاب العمل والمهنيين لإطلاق الإقامة المرتبطة بالعمل بثقة.'
    ),
    countryEn: 'UAE Employment',
    introEn: 'We align employer, candidate, and compliance documentation requirements into one executable workflow.',
    introAr: 'نقوم بمواءمة متطلبات مستندات صاحب العمل والمرشح والامتثال ضمن مسار تنفيذي واحد.',
    overviewEn: 'The engagement includes route validation, document integrity checks, and stepwise submission support.',
    overviewAr: 'تشمل الخدمة التحقق من المسار وفحص سلامة المستندات ودعم التقديم المرحلي.',
    purposeCards: [
      { enTitle: 'Workforce Activation', arTitle: 'تفعيل القوى العاملة', enBody: 'Enable organizations to onboard staff under compliant residency routes.', arBody: 'تمكين المؤسسات من ضم الموظفين عبر مسارات إقامة متوافقة.' },
      { enTitle: 'Operational Readiness', arTitle: 'جاهزية تشغيلية', enBody: 'Reduce onboarding delays through pre-checked files and submission planning.', arBody: 'تقليل تأخير الانضمام عبر ملفات مدققة مسبقاً وتخطيط واضح للتقديم.' },
      { enTitle: 'Compliance Visibility', arTitle: 'وضوح الامتثال', enBody: 'Keep approvals, timelines, and requirements transparent for HR teams.', arBody: 'الحفاظ على شفافية الموافقات والمدد والمتطلبات لفرق الموارد البشرية.' }
    ],
    eligibilityEn: ['Employer sponsorship alignment with selected route.', 'Role and contract details ready for filing.', 'Identity and civil records prepared for submission.'],
    eligibilityAr: ['مواءمة كفالة صاحب العمل مع المسار المختار.', 'جاهزية تفاصيل الوظيفة والعقد للتقديم.', 'تحضير مستندات الهوية والسجلات المدنية.'],
    docsEn: ['Passport, photo, and civil identity records.', 'Employment contract and offer records.', 'Employer support documentation.', 'Application forms requested by authority.'],
    docsAr: ['جواز السفر والصورة وسجلات الهوية.', 'سجلات عقد العمل والعرض الوظيفي.', 'مستندات دعم من صاحب العمل.', 'نماذج الطلب المطلوبة من الجهة.'],
    timelineEn: 'Timeline depends on employer-side readiness, authority queue, and data quality.',
    timelineAr: 'تعتمد المدة على جاهزية جهة العمل وزخم الجهة وجودة البيانات.',
    validityEn: 'Employment-visa validity follows the approved permit and residency route.',
    validityAr: 'تتبع صلاحية التأشيرة مدة التصريح والإقامة المعتمدة.',
    related: [
      { href: 'visa-uae-family.html', en: 'UAE Family Visa', ar: 'تأشيرة الأسرة في الإمارات' },
      { href: 'service-hr.html', en: 'HR Consultancy', ar: 'استشارات الموارد البشرية' },
      { href: 'pro-mohre.html', en: 'MOHRE Services', ar: 'خدمات وزارة الموارد البشرية' },
      { href: 'service-visa.html', en: 'Visa Services Hub', ar: 'بوابة خدمات التأشيرات' }
    ]
  }
];

const extraVisaPages = [
  ['visa-uae-visit.html', 'UAE Visit Visa Consultancy', 'استشارات تأشيرة الزيارة للإمارات', 'UAE Visit'],
  ['visa-uae-family.html', 'UAE Family Visa Consultancy', 'استشارات تأشيرة الأسرة في الإمارات', 'UAE Family'],
  ['visa-schengen.html', 'Schengen Visa Consultancy', 'استشارات تأشيرة شنغن', 'Schengen'],
  ['visa-europe-visit.html', 'Europe Visit Visa Consultancy', 'استشارات تأشيرة زيارة أوروبا', 'Europe Visit'],
  ['visa-europe-work-permit.html', 'Europe Work Permit Visa Consultancy', 'استشارات تأشيرة تصريح العمل في أوروبا', 'Europe Work Permit'],
  ['visa-tourist.html', 'Tourist Visa Consultancy', 'استشارات التأشيرة السياحية', 'Tourist'],
  ['visa-business.html', 'Business Visa Consultancy', 'استشارات التأشيرة التجارية', 'Business'],
  ['visa-student.html', 'Student Visa Consultancy', 'استشارات تأشيرة الطالب', 'Student'],
  ['visa-usa.html', 'USA Visa Consultancy', 'استشارات تأشيرة الولايات المتحدة', 'USA'],
  ['visa-canada.html', 'Canada Visa Consultancy', 'استشارات تأشيرة كندا', 'Canada'],
  ['visa-uk.html', 'UK Visa Consultancy', 'استشارات تأشيرة المملكة المتحدة', 'UK'],
  ['visa-australia.html', 'Australia Visa Consultancy', 'استشارات تأشيرة أستراليا', 'Australia']
].map(([file, h1En, h1Ar, countryEn]) => ({
  ...basePage(
    file,
    h1En,
    h1Ar,
    'visa',
    `${h1En} with document-led planning and authority-ready submission quality.`,
    `${h1Ar} مع تخطيط قائم على المستندات وجودة تقديم جاهزة للجهات المختصة.`,
    `Trusted advisory support for ${countryEn} pathways with risk-aware case preparation.`,
    `دعم استشاري موثوق لمسارات ${countryEn} مع إعداد ملف واعٍ بالمخاطر.`
  ),
  countryEn,
  introEn: `Our consultants structure your ${countryEn} visa case with practical checkpoints, file-quality reviews, and submission readiness controls.`,
  introAr: `يقوم مستشارونا ببناء ملف تأشيرة ${countryEn} عبر نقاط عملية ومراجعات جودة وتجهيز كامل للتقديم.`,
  overviewEn: `The service includes profile review, route mapping, documentation planning, and process coordination until final decision stage.`,
  overviewAr: `تشمل الخدمة مراجعة الملف وتحديد المسار وتخطيط المستندات وتنسيق الإجراءات حتى مرحلة القرار النهائي.`,
  purposeCards: [
    { enTitle: 'Structured Route Selection', arTitle: 'اختيار المسار المنظم', enBody: `Identify the right ${countryEn} route based on purpose and profile.`, arBody: `تحديد مسار ${countryEn} الأنسب وفق الهدف والملف.` },
    { enTitle: 'Document Control', arTitle: 'ضبط المستندات', enBody: 'Reduce avoidable delays through quality checks before submission.', arBody: 'تقليل التأخير غير الضروري عبر فحص الجودة قبل التقديم.' },
    { enTitle: 'Progress Transparency', arTitle: 'شفافية المتابعة', enBody: 'Maintain clear milestone updates and next-action guidance.', arBody: 'الحفاظ على تحديثات مرحلية واضحة وإرشادات الخطوات التالية.' }
  ],
  eligibilityEn: ['General profile suitability for selected visa purpose.', 'Supporting evidence aligned with route-specific requirements.', 'Identity and travel documents in valid status.'],
  eligibilityAr: ['ملاءمة عامة للملف مع الغرض من التأشيرة المختارة.', 'أدلة داعمة متوافقة مع متطلبات المسار.', 'صلاحية مستندات الهوية والسفر.'],
  docsEn: ['Passport and civil identity records.', 'Photographs and application forms.', 'Sponsor, inviter, or institutional support documents where applicable.', 'Category-specific proof requested by the authority.'],
  docsAr: ['جواز السفر وسجلات الهوية.', 'الصور ونماذج الطلب.', 'مستندات الكفيل أو جهة الدعوة أو المؤسسة عند الحاجة.', 'إثباتات خاصة بالفئة تطلبها الجهة المختصة.'],
  timelineEn: `Processing for ${countryEn} cases is handled in authority-defined stages.`,
  timelineAr: `تتم معالجة ملفات ${countryEn} عبر مراحل تحددها الجهة المختصة.`,
  validityEn: 'Validity, entry terms, and stay duration depend on approved category and official decision.',
  validityAr: 'تعتمد الصلاحية وشروط الدخول ومدة الإقامة على الفئة المعتمدة والقرار الرسمي.',
  related: [
    { href: 'service-visa.html', en: 'Visa Services Hub', ar: 'بوابة خدمات التأشيرات' },
    { href: 'visa-uae-golden.html', en: 'UAE Golden Visa', ar: 'تأشيرة الإمارات الذهبية' },
    { href: 'visa-schengen.html', en: 'Schengen Visa', ar: 'تأشيرة شنغن' },
    { href: 'visa-usa.html', en: 'USA Visa', ar: 'تأشيرة الولايات المتحدة' }
  ]
}));

const workPermitProfiles = [
  {
    file: 'work-permit-romania.html',
    countryEn: 'Romania',
    countryAr: 'رومانيا',
    sectorsEn: ['Manufacturing', 'Construction', 'Logistics', 'Hospitality', 'Food Processing'],
    sectorsAr: ['التصنيع', 'الإنشاءات', 'اللوجستيات', 'الضيافة', 'تصنيع الأغذية'],
    jobsEn: ['Machine Operators', 'Welders', 'Drivers', 'Hotel Staff', 'Warehouse Assistants'],
    jobsAr: ['مشغلو الماكينات', 'اللحامون', 'السائقون', 'موظفو الفنادق', 'مساعدو المستودعات']
  },
  {
    file: 'work-permit-poland.html',
    countryEn: 'Poland',
    countryAr: 'بولندا',
    sectorsEn: ['Automotive', 'Warehousing', 'E-commerce Fulfilment', 'Food Production', 'Electronics Assembly'],
    sectorsAr: ['السيارات', 'التخزين', 'تنفيذ التجارة الإلكترونية', 'إنتاج الأغذية', 'تجميع الإلكترونيات'],
    jobsEn: ['Forklift Operators', 'Line Technicians', 'Packers', 'Maintenance Staff', 'Quality Inspectors'],
    jobsAr: ['مشغلو الرافعات', 'فنيّو خطوط الإنتاج', 'عمال التعبئة', 'طاقم الصيانة', 'مفتشو الجودة']
  },
  {
    file: 'work-permit-croatia.html',
    countryEn: 'Croatia',
    countryAr: 'كرواتيا',
    sectorsEn: ['Tourism', 'Hospitality', 'Marine Services', 'Retail', 'Construction'],
    sectorsAr: ['السياحة', 'الضيافة', 'الخدمات البحرية', 'التجزئة', 'الإنشاءات'],
    jobsEn: ['Hotel Operations Staff', 'Housekeeping Teams', 'Restaurant Crew', 'General Labour', 'Site Assistants'],
    jobsAr: ['موظفو تشغيل الفنادق', 'فرق التدبير الفندقي', 'طاقم المطاعم', 'العمالة العامة', 'مساعدو المواقع']
  },
  {
    file: 'work-permit-serbia.html',
    countryEn: 'Serbia',
    countryAr: 'صربيا',
    sectorsEn: ['Industrial Production', 'Agriculture', 'Transport', 'Civil Works', 'Warehousing'],
    sectorsAr: ['الإنتاج الصناعي', 'الزراعة', 'النقل', 'الأعمال المدنية', 'التخزين'],
    jobsEn: ['Factory Workers', 'Agricultural Labour', 'Truck Drivers', 'Construction Teams', 'Storekeepers'],
    jobsAr: ['عمال المصانع', 'العمالة الزراعية', 'سائقو الشاحنات', 'فرق الإنشاءات', 'أمناء المستودعات']
  },
  {
    file: 'work-permit-portugal.html',
    countryEn: 'Portugal',
    countryAr: 'البرتغال',
    sectorsEn: ['Hospitality', 'Agribusiness', 'Construction', 'Cleaning Services', 'Customer Operations'],
    sectorsAr: ['الضيافة', 'الأعمال الزراعية', 'الإنشاءات', 'خدمات النظافة', 'عمليات خدمة العملاء'],
    jobsEn: ['Kitchen Assistants', 'Farm Workers', 'Site Workers', 'Facility Crew', 'Support Staff'],
    jobsAr: ['مساعدو المطابخ', 'عمال المزارع', 'عمال المواقع', 'طاقم المرافق', 'موظفو الدعم']
  },
  {
    file: 'work-permit-germany.html',
    countryEn: 'Germany',
    countryAr: 'ألمانيا',
    sectorsEn: ['Engineering', 'Automotive Supply', 'Healthcare Support', 'Logistics', 'Skilled Trades'],
    sectorsAr: ['الهندسة', 'سلاسل توريد السيارات', 'الدعم الصحي', 'اللوجستيات', 'الحرف الماهرة'],
    jobsEn: ['Technicians', 'Warehouse Specialists', 'Nursing Assistants', 'Electricians', 'Industrial Mechanics'],
    jobsAr: ['الفنيون', 'متخصصو المستودعات', 'مساعدو التمريض', 'الكهربائيون', 'الميكانيكيون الصناعيون']
  },
  {
    file: 'work-permit-italy.html',
    countryEn: 'Italy',
    countryAr: 'إيطاليا',
    sectorsEn: ['Hospitality', 'Food Production', 'Agriculture', 'Light Manufacturing', 'Maintenance Services'],
    sectorsAr: ['الضيافة', 'إنتاج الأغذية', 'الزراعة', 'التصنيع الخفيف', 'خدمات الصيانة'],
    jobsEn: ['Food Processing Staff', 'Seasonal Workers', 'Hotel Crew', 'General Technicians', 'Cleaning Teams'],
    jobsAr: ['موظفو تصنيع الأغذية', 'العمالة الموسمية', 'طاقم الفنادق', 'فنيون عامون', 'فرق النظافة']
  }
].map((entry) => ({
  ...basePage(
    entry.file,
    `${entry.countryEn} Work Permit Consultancy`,
    `استشارات تصريح العمل في ${entry.countryAr}`,
    'work',
    `Country-specific ${entry.countryEn} work permit advisory with employer-aligned recruitment and compliance flow.`,
    `استشارات خاصة بدولة ${entry.countryAr} لتصريح العمل مع مسار توظيف وامتثال متوافق مع جهة العمل.`,
    `End-to-end guidance for candidates and employers targeting structured employment in ${entry.countryEn}.`,
    `إرشاد متكامل للمرشحين وأصحاب العمل الراغبين في توظيف منظم داخل ${entry.countryAr}.`
  ),
  countryOverviewEn: `${entry.countryEn} remains a destination for employer-sponsored roles where demand is tied to sector cycles and compliance readiness.`,
  countryOverviewAr: `تُعد ${entry.countryAr} وجهة للتوظيف عبر كفالة صاحب العمل حيث يرتبط الطلب بدورات القطاعات وجاهزية الامتثال.`,
  labourMarketEn: `The labour market in ${entry.countryEn} favors practical skills, reliability, and candidates who meet employer documentation standards.`,
  labourMarketAr: `يميل سوق العمل في ${entry.countryAr} إلى المهارات العملية والالتزام والمرشحين المستوفين لمعايير مستندات جهة العمل.`,
  hiringIndustriesEn: entry.sectorsEn,
  hiringIndustriesAr: entry.sectorsAr,
  jobCategoriesEn: entry.jobsEn,
  jobCategoriesAr: entry.jobsAr,
  salaryEn: `Salary levels in ${entry.countryEn} vary by role, experience, location, shift model, and employer policy. Indicative ranges are discussed during role matching and must be treated as non-guaranteed estimates.`,
  salaryAr: `تختلف مستويات الرواتب في ${entry.countryAr} حسب الوظيفة والخبرة والموقع ونظام الدوام وسياسة صاحب العمل. تُعرض النطاقات الإرشادية أثناء المطابقة الوظيفية ويجب اعتبارها تقديرات غير مضمونة.`,
  workingHoursEn: `Working hours depend on employment contract, sector regulation, overtime rules, and local labour standards in ${entry.countryEn}.`,
  workingHoursAr: `تعتمد ساعات العمل على عقد التوظيف ولوائح القطاع وقواعد العمل الإضافي والمعايير العمالية المحلية في ${entry.countryAr}.`,
  benefitsEn: `Benefits such as paid leave, transport support, or allowances are employer-dependent and confirmed in final offer documentation.`,
  benefitsAr: `المزايا مثل الإجازات المدفوعة أو دعم النقل أو البدلات تعتمد على جهة العمل وتُؤكد في عرض العمل النهائي.`,
  accommodationInsuranceEn: `Accommodation, if offered, is employer-dependent. Medical insurance obligations are reviewed as part of onboarding and legal compliance checks.`,
  accommodationInsuranceAr: `السكن - إن توفر - يعتمد على جهة العمل. تتم مراجعة التغطية الطبية ضمن إجراءات الانضمام وفحوص الامتثال القانونية.`,
  docsEn: ['Passport copy with required validity.', 'Updated CV with role-relevant experience.', 'Educational and trade certificates where required.', 'Medical or police records if requested by employer/authority.', 'Signed offer and employer sponsorship records.'],
  docsAr: ['نسخة جواز سفر ضمن مدة الصلاحية المطلوبة.', 'سيرة ذاتية محدثة بخبرة مرتبطة بالوظيفة.', 'الشهادات التعليمية أو المهنية عند الحاجة.', 'سجلات طبية أو جنائية إذا طلبها صاحب العمل أو الجهة.', 'عرض العمل الموقع وسجلات كفالة صاحب العمل.'],
  related: [
    { href: 'service-jobs.html', en: 'Job Placement Services', ar: 'خدمات التوظيف الوظيفي' },
    { href: 'recruitment-overseas.html', en: 'Overseas Recruitment', ar: 'التوظيف الخارجي' },
    { href: 'service-hr.html', en: 'HR Consultancy', ar: 'استشارات الموارد البشرية' },
    { href: 'service-visa.html', en: 'Visa Services Hub', ar: 'بوابة خدمات التأشيرات' }
  ]
}));

const standardServices = [
  ['service-company.html', 'Business Setup Consultancy', 'استشارات تأسيس الأعمال', 'business'],
  ['service-digital.html', 'Digital Marketing Consultancy', 'استشارات التسويق الرقمي', 'digital'],
  ['service-education.html', 'Overseas Education Consultancy', 'استشارات التعليم في الخارج', 'business'],
  ['service-hr.html', 'HR Consultancy and Workforce Planning', 'استشارات الموارد البشرية وتخطيط القوى العاملة', 'recruitment'],
  ['service-immigration.html', 'Immigration Consultancy', 'استشارات الهجرة', 'visa'],
  ['service-jobs.html', 'Job Placement Services', 'خدمات التوظيف الوظيفي', 'recruitment'],
  ['service-realestate.html', 'Real Estate Advisory Services', 'خدمات الاستشارات العقارية', 'business'],
  ['service-more.html', 'Corporate Services Advisory', 'استشارات الخدمات المؤسسية', 'pro'],
  ['service-banking.html', 'Banking and Finance Recruitment', 'توظيف القطاع المصرفي والمالي', 'recruitment'],
  ['service-career.html', 'Career Advisory Services', 'خدمات الإرشاد المهني', 'recruitment'],
  ['service-insurance.html', 'Insurance Sector Staffing', 'توظيف قطاع التأمين', 'recruitment'],
  ['service-pro.html', 'Government PRO Services', 'خدمات PRO الحكومية', 'pro'],
  ['recruitment-overseas.html', 'Overseas Recruitment Services', 'خدمات التوظيف الخارجي', 'recruitment'],
  ['recruitment-uae.html', 'UAE Recruitment Services', 'خدمات التوظيف داخل الإمارات', 'recruitment'],
  ['recruitment-executive-search.html', 'Executive Search Services', 'خدمات البحث التنفيذي', 'recruitment'],
  ['recruitment-blue-collar.html', 'Blue Collar Recruitment Services', 'خدمات توظيف العمالة الفنية', 'recruitment'],
  ['recruitment-white-collar.html', 'White Collar Recruitment Services', 'خدمات توظيف الكوادر المتخصصة', 'recruitment'],
  ['recruitment-temporary-staffing.html', 'Temporary Staffing Solutions', 'حلول التوظيف المؤقت', 'recruitment'],
  ['recruitment-permanent-staffing.html', 'Permanent Staffing Solutions', 'حلول التوظيف الدائم', 'recruitment'],
  ['recruitment-hr-consultancy.html', 'HR Consultancy Services', 'خدمات استشارات الموارد البشرية', 'recruitment'],
  ['pro-trade-license.html', 'Trade License Services', 'خدمات الرخصة التجارية', 'pro'],
  ['pro-business-setup.html', 'Business Setup PRO Services', 'خدمات PRO لتأسيس الأعمال', 'pro'],
  ['pro-company-formation.html', 'Company Formation PRO Services', 'خدمات PRO لتأسيس الشركات', 'pro'],
  ['pro-ejari.html', 'Ejari Services', 'خدمات إيجاري', 'pro'],
  ['pro-mohre.html', 'MOHRE Services', 'خدمات وزارة الموارد البشرية والتوطين', 'pro'],
  ['pro-immigration.html', 'Immigration PRO Services', 'خدمات PRO للهجرة', 'pro'],
  ['pro-family-visa.html', 'Family Visa PRO Services', 'خدمات PRO لتأشيرة الأسرة', 'pro'],
  ['pro-golden-visa.html', 'Golden Visa PRO Services', 'خدمات PRO للتأشيرة الذهبية', 'pro'],
  ['pro-corporate-tax.html', 'Corporate Tax Support Services', 'خدمات دعم الضريبة على الشركات', 'pro'],
  ['pro-vat.html', 'VAT Support Services', 'خدمات دعم ضريبة القيمة المضافة', 'pro'],
  ['pro-document-clearing.html', 'Document Clearing Services', 'خدمات تخليص المعاملات', 'pro'],
  ['pro-attestation.html', 'Document Attestation Services', 'خدمات تصديق المستندات', 'pro'],
  ['pro-emirates-id.html', 'Emirates ID Services', 'خدمات الهوية الإماراتية', 'pro'],
  ['pro-medical-typing.html', 'Medical Typing Services', 'خدمات الطباعة الطبية', 'pro'],
  ['pro-visa-typing.html', 'Visa Typing Services', 'خدمات طباعة التأشيرات', 'pro'],
  ['website-design.html', 'Website Design Services', 'خدمات تصميم المواقع', 'digital'],
  ['website-crm-development.html', 'CRM Development Services', 'خدمات تطوير CRM', 'digital'],
  ['website-mobile-app-development.html', 'Mobile App Development Services', 'خدمات تطوير تطبيقات الجوال', 'digital'],
  ['website-digital-marketing.html', 'Digital Marketing Campaign Services', 'خدمات حملات التسويق الرقمي', 'digital'],
  ['website-seo.html', 'SEO Services', 'خدمات تحسين محركات البحث', 'digital'],
  ['website-google-ads.html', 'Google Ads Management Services', 'خدمات إدارة إعلانات جوجل', 'digital'],
  ['website-meta-ads.html', 'Meta Ads Management Services', 'خدمات إدارة إعلانات ميتا', 'digital'],
  ['website-branding.html', 'Branding Services', 'خدمات الهوية التجارية', 'digital'],
  ['website-logo-design.html', 'Logo Design Services', 'خدمات تصميم الشعارات', 'digital'],
  ['website-social-media-management.html', 'Social Media Management Services', 'خدمات إدارة وسائل التواصل', 'digital']
].map(([file, h1En, h1Ar, cat]) => ({
  ...basePage(
    file,
    h1En,
    h1Ar,
    cat,
    `${h1En} delivered with practical consulting depth and accountable execution standards.`,
    `${h1Ar} تُقدم بعمق استشاري عملي ومعايير تنفيذ مسؤولة.`,
    `Production-ready consulting and delivery support for ${h1En.toLowerCase()} requirements.`,
    `دعم استشاري وتنفيذي جاهز للإطلاق لمتطلبات ${h1Ar}.`
  ),
  introEn: `We deliver ${h1En.toLowerCase()} as an operational service, not a generic package. Every engagement is mapped to business goals, compliance requirements, and stakeholder timelines.`,
  introAr: `نقدم ${h1Ar} كخدمة تشغيلية وليست باقة عامة. يتم ربط كل مشروع بأهداف الأعمال ومتطلبات الامتثال والجداول الزمنية للجهات المعنية.`,
  overviewEn: `Our team combines domain expertise across recruitment, visa advisory, PRO operations, business setup, and digital execution to ensure measurable outcomes.`,
  overviewAr: `يجمع فريقنا خبرة قطاعية في التوظيف واستشارات التأشيرات وعمليات PRO وتأسيس الأعمال والتنفيذ الرقمي لضمان نتائج قابلة للقياس.`,
  benefitsEn: [
    `${h1En} is delivered with dedicated scope ownership from kickoff to delivery.`,
    `${h1En} includes cross-functional coordination between legal, operations, and advisory tracks.`,
    `${h1En} progress is tracked through milestone-based reporting and approvals.`,
    `${h1En} execution risk is reduced through document-quality and compliance checks.`
  ],
  benefitsAr: [
    `تُنفذ خدمة ${h1Ar} بملكية واضحة للنطاق من البداية حتى التسليم.`,
    `تشمل خدمة ${h1Ar} تنسيقاً تكاملياً بين المسارات القانونية والتشغيلية والاستشارية.`,
    `يتم تتبع تقدم ${h1Ar} عبر تقارير مرحلية واعتمادات واضحة.`,
    `يتم خفض مخاطر تنفيذ ${h1Ar} عبر فحوص جودة المستندات والامتثال.`
  ],
  whyChoose: [
    {
      enTitle: `${h1En} Expertise`,
      arTitle: `خبرة ${h1Ar}`,
      enBody: `Our consultants bring practical delivery experience specific to ${h1En.toLowerCase()} assignments.`,
      arBody: `يقدم مستشارونا خبرة تنفيذ عملية مخصصة لمهام ${h1Ar}.`
    },
    {
      enTitle: 'Commercial Clarity',
      arTitle: 'وضوح تجاري',
      enBody: `${h1En} engagement models are structured around milestones, accountability, and measurable outcomes.`,
      arBody: `تُبنى نماذج تنفيذ ${h1Ar} على مراحل واضحة ومسؤولية ونتائج قابلة للقياس.`
    },
    {
      enTitle: 'Bilingual Operations',
      arTitle: 'تشغيل ثنائي اللغة',
      enBody: `${h1En} delivery support is available in English and Arabic for cross-border stakeholders.`,
      arBody: `يتوفر دعم تنفيذ ${h1Ar} باللغتين الإنجليزية والعربية للجهات المعنية عبر الحدود.`
    }
  ],
  industriesEn: ['Healthcare', 'Hospitality', 'Retail', 'Construction', 'Manufacturing', 'Professional Services'],
  industriesAr: ['الرعاية الصحية', 'الضيافة', 'التجزئة', 'الإنشاءات', 'التصنيع', 'الخدمات المهنية'],
  docsEn: [`Company profile and objective brief for ${h1En}.`, `Primary stakeholder contact matrix for ${h1En}.`, `Supporting documents relevant to the selected ${h1En.toLowerCase()} route.`, `Timeline expectations and operational constraints for ${h1En}.`],
  docsAr: [`ملف الشركة وموجز الهدف الخاص بخدمة ${h1Ar}.`, `مصفوفة التواصل لأصحاب المصلحة المرتبطين بخدمة ${h1Ar}.`, `المستندات الداعمة المرتبطة بمسار ${h1Ar} المختار.`, `توقعات المدة والقيود التشغيلية الخاصة بخدمة ${h1Ar}.`],
  eligibilityEn: [`Clear business objective and ownership for ${h1En}.`, `Availability of baseline documents required for ${h1En} review.`, `Commitment to milestone approvals and communication cadence for ${h1En}.`],
  eligibilityAr: [`وضوح الهدف التجاري وتحديد جهة مسؤولية لخدمة ${h1Ar}.`, `توافر المستندات الأساسية المطلوبة لمراجعة ${h1Ar}.`, `الالتزام باعتمادات المراحل وإيقاع التواصل لخدمة ${h1Ar}.`],
  timelineEn: `Timelines vary by scope complexity, authority dependencies, and internal client approval cycles for ${h1En}.`,
  timelineAr: `تختلف المدد حسب تعقيد النطاق واعتماديات الجهات ودورات اعتماد العميل الداخلية لخدمة ${h1Ar}.`,
  related: [
    { href: 'service.html', en: 'Services Hub', ar: 'بوابة الخدمات' },
    { href: 'service-visa.html', en: 'Visa Services', ar: 'خدمات التأشيرات' },
    { href: 'service-pro.html', en: 'PRO Services', ar: 'خدمات PRO' },
    { href: 'service-digital.html', en: 'Digital Services', ar: 'الخدمات الرقمية' }
  ]
}));

const websiteDevelopment = {
  ...basePage(
    'website-development.html',
    'Website Development Services',
    'خدمات تطوير المواقع',
    'digital',
    'Corporate and recruitment-focused website development with CRM, SEO, security, hosting, and maintenance readiness.',
    'تطوير مواقع موجه للمؤسسات والتوظيف مع جاهزية CRM والسيو والأمن والاستضافة والصيانة.',
    'Enterprise-grade website delivery spanning strategy, design, engineering, optimization, and support.',
    'تنفيذ مواقع بمستوى مؤسسي يشمل الاستراتيجية والتصميم والهندسة والتحسين والدعم.'
  ),
  introEn: 'Website development at Silvora is treated as a business system initiative. We map conversion goals, user journeys, integration needs, and operating constraints before build sprints begin.',
  introAr: 'يُتعامل مع تطوير المواقع في سيلفورا كمبادرة نظام أعمال. نقوم برسم أهداف التحويل ورحلات المستخدم واحتياجات التكامل والقيود التشغيلية قبل بدء سبرنتات التطوير.',
  overviewEn: 'The service includes corporate websites, recruitment websites, CRM-enabled workflows, client portals, HR systems, SEO architecture, performance optimization, hosting setup, maintenance planning, and security hardening.',
  overviewAr: 'تشمل الخدمة المواقع المؤسسية ومواقع التوظيف وسير العمل المرتبط بـ CRM وبوابات العملاء وأنظمة الموارد البشرية وهيكلة السيو وتحسين الأداء وتجهيز الاستضافة وخطة الصيانة وتقوية الأمن.',
  benefitsEn: [
    'Business-aligned architecture focused on measurable lead conversion.',
    'Scalable codebase and modular content model for growth-stage operations.',
    'Security and performance controls built into delivery standards.',
    'Ongoing maintenance workflows with transparent ownership and SLAs.'
  ],
  benefitsAr: [
    'هيكلة مرتبطة بالأعمال وموجهة لتحويل العملاء المحتملين.',
    'قاعدة برمجية قابلة للتوسع ونموذج محتوى معياري لمرحلة النمو.',
    'ضوابط أمن وأداء مدمجة في معايير التنفيذ.',
    'مسارات صيانة مستمرة مع ملكية واضحة واتفاقيات مستوى خدمة.'
  ],
  industriesEn: ['International Consultancy', 'Recruitment Firms', 'Professional Services', 'Healthcare Networks', 'Education Providers', 'Real Estate Groups'],
  industriesAr: ['الاستشارات الدولية', 'شركات التوظيف', 'الخدمات المهنية', 'شبكات الرعاية الصحية', 'مزودو التعليم', 'مجموعات العقار'],
  related: [
    { href: 'website-crm-development.html', en: 'CRM Development', ar: 'تطوير CRM' },
    { href: 'website-seo.html', en: 'SEO Services', ar: 'خدمات السيو' },
    { href: 'website-mobile-app-development.html', en: 'Mobile App Development', ar: 'تطوير تطبيقات الجوال' },
    { href: 'service-digital.html', en: 'Digital Services Hub', ar: 'بوابة الخدمات الرقمية' }
  ]
};

const hubPages = [
  {
    ...basePage(
      'service.html',
      'Enterprise Services Hub',
      'بوابة الخدمات المؤسسية',
      'business',
      'Comprehensive hub for recruitment, visa, PRO, business setup, and digital consultancy services in Dubai.',
      'بوابة شاملة لخدمات التوظيف والتأشيرات وPRO وتأسيس الأعمال والاستشارات الرقمية في دبي.',
      'Navigate all service lines through one structured enterprise catalog designed for decision-makers.',
      'تصفح جميع خطوط الخدمات عبر كتالوج مؤسسي منظم مصمم لصنّاع القرار.'
    ),
    cards: [
      { href: 'service-visa.html', en: 'Visa Services', ar: 'خدمات التأشيرات', noteEn: 'Travel, residency, and route advisory.', noteAr: 'استشارات السفر والإقامة والمسارات.' },
      { href: 'service-pro.html', en: 'PRO Services', ar: 'خدمات PRO', noteEn: 'Government liaison and filing execution.', noteAr: 'التنسيق الحكومي وتنفيذ المعاملات.' },
      { href: 'service-company.html', en: 'Business Setup', ar: 'تأسيس الأعمال', noteEn: 'Corporate launch and licensing support.', noteAr: 'دعم الإطلاق المؤسسي والترخيص.' },
      { href: 'service-digital.html', en: 'Digital Services', ar: 'الخدمات الرقمية', noteEn: 'Website, SEO, and campaign execution.', noteAr: 'تنفيذ المواقع والسيو والحملات.' },
      { href: 'service-hr.html', en: 'HR Consultancy', ar: 'استشارات الموارد البشرية', noteEn: 'Workforce planning and organizational advisory.', noteAr: 'تخطيط القوى العاملة والاستشارات التنظيمية.' },
      { href: 'service-jobs.html', en: 'Job Placement', ar: 'التوظيف الوظيفي', noteEn: 'Candidate sourcing and placement operations.', noteAr: 'عمليات استقطاب المرشحين والتوظيف.' }
    ]
  },
  {
    ...basePage(
      'service-visa.html',
      'Visa Services Hub',
      'بوابة خدمات التأشيرات',
      'visa',
      'Visa service hub covering UAE, Europe, North America, and student/business routes.',
      'بوابة خدمات التأشيرات التي تغطي الإمارات وأوروبا وأمريكا الشمالية ومسارات الدراسة والأعمال.',
      'Choose the right visa track with structured guidance and route-specific page details.',
      'اختر مسار التأشيرة المناسب عبر إرشاد منظم وتفاصيل خاصة بكل مسار.'
    ),
    cards: [
      { href: 'visa-uae-golden.html', en: 'UAE Golden Visa', ar: 'تأشيرة الإمارات الذهبية', noteEn: 'Long-term residency pathways.', noteAr: 'مسارات الإقامة طويلة الأجل.' },
      { href: 'visa-schengen.html', en: 'Schengen Visa', ar: 'تأشيرة شنغن', noteEn: 'European short-stay planning.', noteAr: 'تخطيط الإقامة القصيرة في أوروبا.' },
      { href: 'visa-usa.html', en: 'USA Visa', ar: 'تأشيرة الولايات المتحدة', noteEn: 'Structured case preparation.', noteAr: 'إعداد ملف منظم.' },
      { href: 'visa-canada.html', en: 'Canada Visa', ar: 'تأشيرة كندا', noteEn: 'Study and travel routes.', noteAr: 'مسارات الدراسة والسفر.' },
      { href: 'visa-uk.html', en: 'UK Visa', ar: 'تأشيرة المملكة المتحدة', noteEn: 'Route-specific support planning.', noteAr: 'تخطيط دعم خاص بالمسار.' },
      { href: 'visa-australia.html', en: 'Australia Visa', ar: 'تأشيرة أستراليا', noteEn: 'Compliance-focused submissions.', noteAr: 'تقديمات تراعي الامتثال.' }
    ]
  },
  {
    ...basePage(
      'service-pro.html',
      'PRO Services Hub',
      'بوابة خدمات PRO',
      'pro',
      'Centralized PRO services hub for licensing, immigration, typing, tax support, and government approvals.',
      'بوابة مركزية لخدمات PRO تشمل الترخيص والهجرة والطباعة ودعم الضرائب والموافقات الحكومية.',
      'Manage critical administrative workflows with one coordinated PRO operations partner.',
      'إدارة سير الأعمال الإدارية الحيوية عبر شريك عمليات PRO واحد ومنسق.'
    ),
    cards: [
      { href: 'pro-trade-license.html', en: 'Trade License', ar: 'الرخصة التجارية', noteEn: 'Issuance, renewal, and amendments.', noteAr: 'إصدار وتجديد وتعديل.' },
      { href: 'pro-business-setup.html', en: 'Business Setup', ar: 'تأسيس الأعمال', noteEn: 'Setup route and authority coordination.', noteAr: 'تحديد مسار التأسيس والتنسيق مع الجهات.' },
      { href: 'pro-document-clearing.html', en: 'Document Clearing', ar: 'تخليص المعاملات', noteEn: 'Submission and follow-up orchestration.', noteAr: 'تنسيق التقديم والمتابعة.' },
      { href: 'pro-corporate-tax.html', en: 'Corporate Tax', ar: 'الضريبة على الشركات', noteEn: 'Compliance support for tax stages.', noteAr: 'دعم الامتثال لمراحل الضرائب.' },
      { href: 'pro-vat.html', en: 'VAT', ar: 'ضريبة القيمة المضافة', noteEn: 'Registration and filing support.', noteAr: 'دعم التسجيل والإقرارات.' },
      { href: 'pro-visa-typing.html', en: 'Visa Typing', ar: 'طباعة التأشيرات', noteEn: 'Accurate data entry and forms.', noteAr: 'إدخال بيانات ونماذج بدقة.' }
    ]
  },
  {
    ...basePage(
      'service-digital.html',
      'Digital Services Hub',
      'بوابة الخدمات الرقمية',
      'digital',
      'Digital services hub for website development, campaigns, SEO, branding, and conversion optimization.',
      'بوابة خدمات رقمية لتطوير المواقع والحملات والسيو والهوية وتحسين التحويل.',
      'Connect digital strategy, technical execution, and growth optimization in one delivery model.',
      'اجمع بين الاستراتيجية الرقمية والتنفيذ التقني وتحسين النمو في نموذج تسليم واحد.'
    ),
    cards: [
      { href: 'website-development.html', en: 'Website Development', ar: 'تطوير المواقع', noteEn: 'Corporate and recruitment-ready web systems.', noteAr: 'أنظمة ويب جاهزة للمؤسسات والتوظيف.' },
      { href: 'website-seo.html', en: 'SEO Services', ar: 'خدمات السيو', noteEn: 'Technical and content visibility strategy.', noteAr: 'استراتيجية ظهور تقنية ومحتوى.' },
      { href: 'website-google-ads.html', en: 'Google Ads', ar: 'إعلانات جوجل', noteEn: 'Search demand capture campaigns.', noteAr: 'حملات لاقتناص طلب البحث.' },
      { href: 'website-meta-ads.html', en: 'Meta Ads', ar: 'إعلانات ميتا', noteEn: 'Paid social growth and retargeting.', noteAr: 'نمو اجتماعي ممول وإعادة استهداف.' },
      { href: 'website-crm-development.html', en: 'CRM Development', ar: 'تطوير CRM', noteEn: 'Pipeline and workflow automation.', noteAr: 'أتمتة خطوط المبيعات وسير العمل.' },
      { href: 'website-branding.html', en: 'Branding', ar: 'الهوية التجارية', noteEn: 'Strategic brand positioning and design.', noteAr: 'تموضع هوية استراتيجي وتصميم.' }
    ]
  }
];

function renderHubPage(page) {
  const faq = standardFaq(page.h1En, page.h1Ar);
  const body = [
    paragraphSection('Detailed Introduction', 'مقدمة تفصيلية', page.heroEn, page.heroAr),
    cardsSection(
      'Service Categories',
      'فئات الخدمات',
      page.cards.map((x) => ({ enTitle: x.en, arTitle: x.ar, enBody: x.noteEn, arBody: x.noteAr }))
    ),
    relatedSection(page.cards.map((x) => ({ href: x.href, en: x.en, ar: x.ar }))),
    faqSection(faq),
    profileAndCtaSection(page.h1En, page.h1Ar)
  ].join('\n');
  return pageShell(page, body, faq);
}

function run() {
  const fullVisa = [...visaPages, ...extraVisaPages];
  for (const page of fullVisa) {
    write(page.file, renderVisaPage(page));
  }

  for (const page of workPermitProfiles) {
    write(page.file, renderWorkPermitPage(page));
  }

  for (const page of standardServices) {
    write(page.file, renderStandardServicePage(page));
  }

  write(websiteDevelopment.file, renderWebsiteDevelopmentPage(websiteDevelopment));

  for (const page of hubPages) {
    write(page.file, renderHubPage(page));
  }
}

run();