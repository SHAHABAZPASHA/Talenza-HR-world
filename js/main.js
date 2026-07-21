if (window.jQuery) {
(function ($) {
    "use strict";

    // Spinner
    var spinner = function () {
        setTimeout(function () {
            if ($('#spinner').length > 0) {
                $('#spinner').removeClass('show');
            }
        }, 1);
    };
    spinner();
    
    
    // Initiate the wowjs
    new WOW().init();


    // Sticky Navbar
    $(window).scroll(function () {
        if ($(this).scrollTop() > 45) {
            $('.navbar').addClass('sticky-top shadow-sm');
        } else {
            $('.navbar').removeClass('sticky-top shadow-sm');
        }
    });
    
    
    // Dropdown on mouse hover
    const $dropdown = $(".dropdown");
    const $dropdownToggle = $(".dropdown-toggle");
    const $dropdownMenu = $(".dropdown-menu");
    const showClass = "show";
    
    $(window).on("load resize", function() {
        if (this.matchMedia("(min-width: 992px)").matches) {
            $dropdown.hover(
            function() {
                const $this = $(this);
                $this.addClass(showClass);
                $this.find($dropdownToggle).attr("aria-expanded", "true");
                $this.find($dropdownMenu).addClass(showClass);
            },
            function() {
                const $this = $(this);
                $this.removeClass(showClass);
                $this.find($dropdownToggle).attr("aria-expanded", "false");
                $this.find($dropdownMenu).removeClass(showClass);
            }
            );
        } else {
            $dropdown.off("mouseenter mouseleave");
        }
    });
    
    
    // Back to top button
    $(window).scroll(function () {
        if ($(this).scrollTop() > 100) {
            $('.back-to-top').fadeIn('slow');
        } else {
            $('.back-to-top').fadeOut('slow');
        }
    });
    $('.back-to-top').click(function () {
        $('html, body').animate({scrollTop: 0}, 1500, 'easeInOutExpo');
        return false;
    });
    
})(window.jQuery);
}

// Fallback: always hide the spinner even if jQuery/CDN scripts fail to load.
(function () {
    function hideSpinner() {
        var spinner = document.getElementById('spinner');
        if (!spinner) {
            return;
        }

        spinner.classList.remove('show');
    }

    if (document.readyState === 'complete') {
        hideSpinner();
    } else {
        document.addEventListener('DOMContentLoaded', hideSpinner, { once: true });
        window.addEventListener('load', hideSpinner, { once: true });
        window.setTimeout(hideSpinner, 3000);
    }
}());

var SilvoraI18n = (function () {
    var storageKey = 'language';
    var languageSuggestionKey = 'languageSuggestionDismissed';
    var localePathTemplate = 'locales/{lang}.json';
    var languageCatalog = {
        en: { code: 'en', flag: 'GB', label: 'English', native: 'English', dir: 'ltr', locale: 'en_US' },
        ar: { code: 'ar', flag: 'SA', label: 'Arabic', native: 'العربية', dir: 'rtl', locale: 'ar_AE' },
        fr: { code: 'fr', flag: 'FR', label: 'French', native: 'Français', dir: 'ltr', locale: 'fr_FR' },
        de: { code: 'de', flag: 'DE', label: 'German', native: 'Deutsch', dir: 'ltr', locale: 'de_DE' },
        es: { code: 'es', flag: 'ES', label: 'Spanish', native: 'Español', dir: 'ltr', locale: 'es_ES' },
        it: { code: 'it', flag: 'IT', label: 'Italian', native: 'Italiano', dir: 'ltr', locale: 'it_IT' },
        pt: { code: 'pt', flag: 'PT', label: 'Portuguese', native: 'Português', dir: 'ltr', locale: 'pt_PT' },
        nl: { code: 'nl', flag: 'NL', label: 'Dutch', native: 'Nederlands', dir: 'ltr', locale: 'nl_NL' },
        pl: { code: 'pl', flag: 'PL', label: 'Polish', native: 'Polski', dir: 'ltr', locale: 'pl_PL' },
        ro: { code: 'ro', flag: 'RO', label: 'Romanian', native: 'Romana', dir: 'ltr', locale: 'ro_RO' },
        ja: { code: 'ja', flag: 'JP', label: 'Japanese', native: '日本語', dir: 'ltr', locale: 'ja_JP' },
        ko: { code: 'ko', flag: 'KR', label: 'Korean', native: '한국어', dir: 'ltr', locale: 'ko_KR' },
        zh: { code: 'zh', flag: 'CN', label: 'Chinese', native: '简体中文', dir: 'ltr', locale: 'zh_CN' },
        ru: { code: 'ru', flag: 'RU', label: 'Russian', native: 'Русский', dir: 'ltr', locale: 'ru_RU' },
        ne: { code: 'ne', flag: 'NP', label: 'Nepali', native: 'नेपाली', dir: 'ltr', locale: 'ne_NP' },
        si: { code: 'si', flag: 'LK', label: 'Sinhala', native: 'සිංහල', dir: 'ltr', locale: 'si_LK' },
        ta: { code: 'ta', flag: 'LK', label: 'Tamil', native: 'தமிழ்', dir: 'ltr', locale: 'ta_LK' }
    };
    var futureLanguageCatalog = {
        tr: { code: 'tr', flag: 'TR', label: 'Turkish', native: 'Turkce' },
        th: { code: 'th', flag: 'TH', label: 'Thai', native: 'ไทย' },
        vi: { code: 'vi', flag: 'VN', label: 'Vietnamese', native: 'Tiếng Việt' },
        id: { code: 'id', flag: 'ID', label: 'Indonesian', native: 'Bahasa Indonesia' },
        ms: { code: 'ms', flag: 'MY', label: 'Malay', native: 'Bahasa Melayu' }
    };
    var supportedLanguages = Object.keys(languageCatalog);
    var loadedLanguages = {};
    var currentLanguage = 'en';
    var resources = {};
    var observer = null;
    var isProcessingMutations = false;
    var initializationPromise = null;
    var cdnSource = 'https://cdn.jsdelivr.net/npm/i18next@23.12.2/dist/umd/i18next.min.js';

    function getResourcePath(language) {
        return localePathTemplate.replace('{lang}', language);
    }

    function getLanguageConfig(language) {
        return languageCatalog[language] || languageCatalog.en;
    }

    function detectBrowserLanguage() {
        var navLanguage = (navigator.language || navigator.userLanguage || 'en').toLowerCase();
        var exact = navLanguage.replace('_', '-');
        var shortCode = exact.split('-')[0];
        if (supportedLanguages.indexOf(exact) !== -1) {
            return exact;
        }
        if (supportedLanguages.indexOf(shortCode) !== -1) {
            return shortCode;
        }
        return 'en';
    }

    var seoByPage = {
        'index.html': {
            en: {
                title: 'Silvora Talenza World - HR, PRO, Visa & Business Services Dubai',
                description: 'Silvora Talenza World offers career advisory, abroad education, PRO services, real estate, visa services, digital marketing, company formation, and immigration services in Dubai.'
            },
            ar: {
                title: 'سيلفورا تالينزا وورلد - حلول الموارد البشرية وPRO والتأشيرات والأعمال في دبي',
                description: 'تقدم سيلفورا تالينزا وورلد الاستشارات المهنية والتعليم في الخارج وخدمات PRO والعقارات والتأشيرات والتسويق الرقمي وتأسيس الشركات وخدمات الهجرة في دبي.'
            }
        },
        'about.html': {
            en: {
                title: 'About Silvora Talenza World - Dubai HR, PRO, Visa & Business Services',
                description: 'Learn more about Silvora Talenza World and our Dubai-based HR, PRO, visa, business, and consultancy services.'
            },
            ar: {
                title: 'من نحن | سيلفورا تالينزا وورلد - خدمات الموارد البشرية وPRO والتأشيرات والأعمال في دبي',
                description: 'تعرّف على سيلفورا تالينزا وورلد وخدماتنا في الموارد البشرية وPRO والتأشيرات والأعمال والاستشارات من دبي.'
            }
        },
        'blogs.html': {
            en: {
                title: 'Dubai Jobs Blog | Job Search Tips & HR Insights - Silvora Talenza World',
                description: 'Silvora Talenza World blog focuses on Dubai and UAE jobs, CV tips, interview questions, visa updates and recruitment insights to help you get hired faster.'
            },
            ar: {
                title: 'مدونة وظائف دبي | نصائح للبحث عن عمل ورؤى موارد بشرية - سيلفورا تالينزا وورلد',
                description: 'تركز مدونة سيلفورا تالينزا وورلد على وظائف دبي والإمارات ونصائح السيرة الذاتية وأسئلة المقابلات وتحديثات التأشيرات ورؤى التوظيف لمساعدتك على الحصول على عمل أسرع.'
            }
        },
        'clients.html': {
            en: {
                title: 'Our Clients - Silvora Talenza World',
                description: 'Explore the client-focused services and trust signals shared by Silvora Talenza World.'
            },
            ar: {
                title: 'عملاؤنا | سيلفورا تالينزا وورلد',
                description: 'استكشف الخدمات الموجهة للعملاء ومؤشرات الثقة التي تقدمها سيلفورا تالينزا وورلد.'
            }
        },
        'contact.html': {
            en: {
                title: 'Silvora Talenza World - Contact',
                description: 'Contact Silvora Talenza World for HR, PRO, visa, recruitment, business setup, and digital solutions in Dubai.'
            },
            ar: {
                title: 'اتصل بنا | سيلفورا تالينزا وورلد',
                description: 'تواصل مع سيلفورا تالينزا وورلد للحصول على خدمات الموارد البشرية وPRO والتأشيرات والتوظيف وتأسيس الأعمال والحلول الرقمية في دبي.'
            }
        },
        '404.html': {
            en: {
                title: '404 - Page Not Found | Silvora Talenza World',
                description: 'The page you requested could not be found. Continue browsing Silvora Talenza World services.'
            },
            ar: {
                title: '404 - الصفحة غير موجودة | سيلفورا تالينزا وورلد',
                description: 'تعذر العثور على الصفحة المطلوبة. يمكنك مواصلة تصفح خدمات سيلفورا تالينزا وورلد.'
            }
        },
        'jobs.html': {
            en: {
                title: 'Jobs - Silvora Talenza World',
                description: 'Browse current jobs and career opportunities supported by Silvora Talenza World.'
            },
            ar: {
                title: 'الوظائف | سيلفورا تالينزا وورلد',
                description: 'تصفح الوظائف الحالية وفرص العمل التي تدعمها سيلفورا تالينزا وورلد.'
            }
        },
        'privacy-policy.html': {
            en: {
                title: 'Privacy Policy | Silvora Talenza World',
                description: 'Read the privacy policy of Silvora Talenza World, including information handling, usage, and data protection practices.'
            },
            ar: {
                title: 'سياسة الخصوصية | سيلفورا تالينزا وورلد',
                description: 'اطّلع على سياسة الخصوصية لدى سيلفورا تالينزا وورلد، بما في ذلك معالجة المعلومات والاستخدام وممارسات حماية البيانات.'
            }
        },
        'terms-and-conditions.html': {
            en: {
                title: 'Terms & Conditions | Silvora Talenza World',
                description: 'Review the terms and conditions for using Silvora Talenza World website and services.'
            },
            ar: {
                title: 'الشروط والأحكام | سيلفورا تالينزا وورلد',
                description: 'راجع الشروط والأحكام الخاصة باستخدام موقع وخدمات سيلفورا تالينزا وورلد.'
            }
        },
        'cookie-policy.html': {
            en: {
                title: 'Cookie Policy | Silvora Talenza World',
                description: 'Learn how cookies are used on the Silvora Talenza World website for functionality, analytics, and performance improvement.'
            },
            ar: {
                title: 'سياسة ملفات الارتباط | سيلفورا تالينزا وورلد',
                description: 'تعرّف على كيفية استخدام ملفات الارتباط في موقع سيلفورا تالينزا وورلد للوظائف والتحليلات وتحسين الأداء.'
            }
        },
        'service-banking.html': {
            en: {
                title: 'Banking & Finance Recruitment - Silvora Talenza World',
                description: 'Specialized staffing and advisory solutions for banking and financial institutions in UAE and GCC.'
            },
            ar: {
                title: 'التوظيف المصرفي والمالي | سيلفورا تالينزا وورلد',
                description: 'حلول توظيف واستشارات متخصصة للمؤسسات المصرفية والمالية في الإمارات ودول مجلس التعاون.'
            }
        },
        'service-career.html': {
            en: {
                title: 'Career Advisory - Silvora Talenza World',
                description: 'Expert career advisory and job search support in Dubai and abroad. Silvora Talenza World helps you grow your career.'
            },
            ar: {
                title: 'الإرشاد المهني | سيلفورا تالينزا وورلد',
                description: 'استشارات مهنية متخصصة ودعم للبحث عن عمل في دبي وخارجها. تساعدك سيلفورا تالينزا وورلد على تطوير مسارك المهني.'
            }
        },
        'service-company.html': {
            en: {
                title: 'Company Formation - Silvora Talenza World',
                description: 'Business setup and company formation services in Dubai and UAE free zones. Silvora Talenza World helps you start your business.'
            },
            ar: {
                title: 'تأسيس الشركات | سيلفورا تالينزا وورلد',
                description: 'خدمات تأسيس الأعمال والشركات في دبي والمناطق الحرة في الإمارات. تساعدك سيلفورا تالينزا وورلد على بدء مشروعك.'
            }
        },
        'service-digital.html': {
            en: {
                title: 'Digital Marketing - Silvora Talenza World',
                description: 'Grow your business with digital marketing and branding solutions from Silvora Talenza World in Dubai.'
            },
            ar: {
                title: 'التسويق الرقمي | سيلفورا تالينزا وورلد',
                description: 'نمِّ أعمالك مع حلول التسويق الرقمي والعلامة التجارية من سيلفورا تالينزا وورلد في دبي.'
            }
        },
        'service-education.html': {
            en: {
                title: 'Abroad Education Services - Silvora Talenza World',
                description: 'Structured guidance for admissions, documentation, and study visa pathways for international education.'
            },
            ar: {
                title: 'خدمات التعليم في الخارج | سيلفورا تالينزا وورلد',
                description: 'إرشاد منظم للقبول والمستندات ومسارات تأشيرات الدراسة للتعليم الدولي.'
            }
        },
        'service-hr.html': {
            en: {
                title: 'HR Consulting & Workforce Planning - Silvora Talenza World',
                description: 'Enterprise HR support covering workforce planning, talent acquisition, and operational HR alignment.'
            },
            ar: {
                title: 'استشارات الموارد البشرية وتخطيط القوى العاملة | سيلفورا تالينزا وورلد',
                description: 'دعم مؤسسي للموارد البشرية يغطي تخطيط القوى العاملة واستقطاب المواهب ومواءمة العمليات الإدارية.'
            }
        },
        'service-immigration.html': {
            en: {
                title: 'Immigration Services - Silvora Talenza World',
                description: 'Immigration consultancy for UAE and international destinations. Silvora Talenza World provides expert immigration services.'
            },
            ar: {
                title: 'خدمات الهجرة | سيلفورا تالينزا وورلد',
                description: 'استشارات هجرة للإمارات ووجهات دولية. تقدم سيلفورا تالينزا وورلد خدمات هجرة متخصصة.'
            }
        },
        'service-insurance.html': {
            en: {
                title: 'Insurance Sector Staffing - Silvora Talenza World',
                description: 'Qualified hiring support for underwriting, claims, operations, and customer service roles in insurance.'
            },
            ar: {
                title: 'توظيف قطاع التأمين | سيلفورا تالينزا وورلد',
                description: 'دعم توظيف مؤهل لوظائف الاكتتاب والمطالبات والعمليات وخدمة العملاء في قطاع التأمين.'
            }
        },
        'service-jobs.html': {
            en: {
                title: 'Job Placement Services - Silvora Talenza World',
                description: 'End-to-end candidate placement support with role matching, interview preparation, and onboarding guidance.'
            },
            ar: {
                title: 'خدمات التوظيف الوظيفي | سيلفورا تالينزا وورلد',
                description: 'دعم متكامل لتوظيف المرشحين يشمل مطابقة الأدوار والتحضير للمقابلات وإرشادات الانضمام.'
            }
        },
        'service-more.html': {
            en: {
                title: 'Extended Corporate Services - Silvora Talenza World',
                description: 'Additional business support services including advisory, compliance coordination, and process assistance.'
            },
            ar: {
                title: 'خدمات الشركات الإضافية | سيلفورا تالينزا وورلد',
                description: 'خدمات دعم أعمال إضافية تشمل الاستشارات وتنسيق الامتثال والمساعدة في الإجراءات.'
            }
        },
        'service-pro.html': {
            en: {
                title: 'Government (PRO) Services - Silvora Talenza World',
                description: 'Comprehensive PRO and government liaison services for businesses and individuals in Dubai. Silvora Talenza World.'
            },
            ar: {
                title: 'خدمات الحكومة (PRO) | سيلفورا تالينزا وورلد',
                description: 'خدمات PRO والتنسيق الحكومي الشاملة للشركات والأفراد في دبي. سيلفورا تالينزا وورلد.'
            }
        },
        'service-realestate.html': {
            en: {
                title: 'Real Estate - Silvora Talenza World',
                description: 'Property solutions for buying, selling, and renting in Dubai and the UAE. Silvora Talenza World real estate services.'
            },
            ar: {
                title: 'العقارات | سيلفورا تالينزا وورلد',
                description: 'حلول عقارية للبيع والشراء والإيجار في دبي والإمارات. خدمات سيلفورا تالينزا وورلد العقارية.'
            }
        },
        'service-visa.html': {
            en: {
                title: 'Visa Services - Silvora Talenza World',
                description: 'Visa solutions including Golden Visa, Green Card, family, tourist, and business visas in Dubai. Silvora Talenza World visa services.'
            },
            ar: {
                title: 'خدمات التأشيرات | سيلفورا تالينزا وورلد',
                description: 'حلول تأشيرات تشمل التأشيرة الذهبية والبطاقة الخضراء وتأشيرات العائلة والسياحة والأعمال في دبي.'
            }
        },
        'service-web-development.html': {
            en: {
                title: 'Website & Software Development - Silvora Talenza World',
                description: 'Premium website and software development services including portals, CRM/ERP, apps, cloud solutions, and secure maintenance.'
            },
            ar: {
                title: 'تطوير المواقع والبرمجيات | سيلفورا تالينزا وورلد',
                description: 'خدمات احترافية لتطوير المواقع والبرمجيات تشمل البوابات وCRM وERP وتطبيقات الجوال والحلول السحابية والصيانة الآمنة.'
            }
        },
        'service-digital-marketing.html': {
            en: {
                title: 'Digital Marketing - Silvora Talenza World',
                description: 'Lead generation focused digital marketing services across SEO, paid media, social platforms, and brand growth execution.'
            },
            ar: {
                title: 'التسويق الرقمي | سيلفورا تالينزا وورلد',
                description: 'خدمات تسويق رقمي تركز على توليد العملاء المحتملين عبر السيو والإعلانات المدفوعة ومنصات التواصل ونمو العلامة التجارية.'
            }
        }
    };

    var enterpriseServiceColumns = [
        { href: 'service-jobs.html', en: 'Manpower Services', ar: 'خدمات القوى العاملة', icon: 'fa-user-tie' },
        { href: 'service-education.html', en: 'Abroad Education', ar: 'التعليم بالخارج', icon: 'fa-graduation-cap' },
        { href: 'service-visa.html', en: 'Visa Services', ar: 'خدمات التأشيرات', icon: 'fa-passport' },
        { href: 'service-pro.html', en: 'PRO Services', ar: 'خدمات PRO', icon: 'fa-file-signature' },
        { href: 'service-company.html', en: 'Business Setup', ar: 'تأسيس الأعمال', icon: 'fa-briefcase' },
        { href: 'service-web-development.html', en: 'Website & Software Development', ar: 'تطوير المواقع والبرمجيات', icon: 'fa-code' },
        { href: 'service-digital-marketing.html', en: 'Digital Marketing', ar: 'التسويق الرقمي', icon: 'fa-bullhorn' }
    ];

    var corporateBaseLinks = [
        { href: 'index.html', en: 'Home', ar: 'الرئيسية', key: 'home' },
        { href: 'about.html', en: 'About', ar: 'من نحن', key: 'about' },
        { href: 'our-team.html', en: 'Our Team', ar: 'فريقنا', key: 'team' },
        { href: 'service.html', en: 'Services', ar: 'خدماتنا', key: 'services' },
        { href: 'jobs.html', en: 'Jobs', ar: 'الوظائف', key: 'jobs' },
        { href: 'blogs.html', en: 'Blogs', ar: 'المدونة', key: 'blogs' },
        { href: 'clients.html', en: 'Clients', ar: 'عملاؤنا', key: 'clients' },
        { href: 'contact.html', en: 'Contact', ar: 'اتصل بنا', key: 'contact' }
    ];

    function getPageKey(pageName) {
        if (/^index\.html$/i.test(pageName)) {
            return 'home';
        }
        if (/^about\.html$/i.test(pageName)) {
            return 'about';
        }
        if (/^our-team\.html$/i.test(pageName)) {
            return 'team';
        }
        if (/^(service|visa|work-permit|pro|recruitment|website)-/i.test(pageName) || /^service\.html$/i.test(pageName)) {
            return 'services';
        }
        if (/^jobs\.html$/i.test(pageName)) {
            return 'jobs';
        }
        if (/^blogs\.html$/i.test(pageName)) {
            return 'blogs';
        }
        if (/^clients\.html$/i.test(pageName)) {
            return 'clients';
        }
        if (/^contact\.html$/i.test(pageName)) {
            return 'contact';
        }

        return '';
    }

    function toFlagEmoji(countryCode) {
        return countryCode
            .toUpperCase()
            .replace(/./g, function (char) {
                return String.fromCodePoint(127397 + char.charCodeAt(0));
            });
    }

    function buildLanguageSwitcherMarkup(options) {
        var opts = options || {};
        var mobileClass = opts.mobile ? ' stw-mobile-lang' : '';
        var menuItems = supportedLanguages.map(function (langCode) {
            var cfg = getLanguageConfig(langCode);
            return '<button type="button" class="stw-lang-option" role="option" data-language="' + cfg.code + '" lang="' + cfg.code + '" aria-selected="false"><span class="stw-lang-flag" aria-hidden="true">' + toFlagEmoji(cfg.flag) + '</span><span class="stw-lang-meta"><span class="stw-lang-label">' + cfg.label + '</span><span class="stw-lang-native"' + (cfg.dir === 'rtl' ? ' dir="rtl"' : '') + '>' + cfg.native + '</span></span></button>';
        }).join('');

        return '<div class="language-switcher stw-lang-dropdown' + mobileClass + '" aria-label="Language switcher" data-i18n-skip="true"><button type="button" class="stw-lang-trigger" aria-haspopup="listbox" aria-expanded="false"><span class="stw-lang-trigger-flag" aria-hidden="true">' + toFlagEmoji(getLanguageConfig(currentLanguage).flag) + '</span><span class="stw-lang-trigger-label">' + getLanguageConfig(currentLanguage).label + '</span><i class="fa fa-chevron-down" aria-hidden="true"></i></button><div class="stw-lang-menu" role="listbox" tabindex="-1">' + menuItems + '</div></div>';
    }

    function buildUnifiedNavbar(pageName) {
        var activeKey = getPageKey(pageName);
        var links = corporateBaseLinks.map(function (link) {
            var isActive = link.key === activeKey;
            return '<a href="' + link.href + '" class="nav-item nav-link' + (isActive ? ' active' : '') + '"><span class="english-text">' +
                link.en + '</span><span class="arabic-text" dir="rtl">' + link.ar + '</span></a>';
        }).join('');

        var isHome = activeKey === 'home';
        return '<div class="container-fluid position-relative p-0 stw-nav-shell">' +
            '<nav class="navbar navbar-expand-lg navbar-light stw-header ' + (isHome ? 'stw-header-home' : 'stw-header-inner') + ' px-3 px-xl-4 py-2" aria-label="Primary navigation">' +
                '<a href="index.html" class="navbar-brand p-0 stw-brand-link" aria-label="Silvora Talenza World LLC Home">' +
                    '<span class="m-0 d-flex align-items-center stw-brand">' +
                        '<img src="img/TALENZA_logo_v2.png" alt="Silvora Talenza World Logo" class="logo-white">' +
                        '<img src="img/TALENZA_logo_v2.png" alt="Silvora Talenza World Logo" class="logo-blue">' +
                        '<span class="brand-text"><span class="english-text stw-brand-name">Silvora Talenza World LLC</span><span class="brand-text-ar arabic-text stw-brand-name" dir="rtl">سيلفورا تالينزا وورلد ذ.م.م</span><span class="english-text stw-brand-tagline">Global HR &amp; Business Solutions</span><span class="arabic-text stw-brand-tagline stw-brand-tagline-ar" dir="rtl">حلول عالمية للموارد البشرية والأعمال</span></span>' +
                    '</span>' +
                '</a>' +
                '<div class="stw-header-actions d-none d-lg-inline-flex">' +
                    buildLanguageSwitcherMarkup({ mobile: false }) +
                    '<a href="https://wa.me/971585895827" class="btn btn-outline-light stw-header-btn stw-wa-btn" target="_blank" rel="noopener" aria-label="WhatsApp"><i class="fab fa-whatsapp"></i><span class="english-text">WhatsApp</span><span class="arabic-text" dir="rtl">واتساب</span></a>' +
                    '<a href="tel:+971585895827" class="btn btn-warning stw-header-btn stw-call-btn" aria-label="Call us"><i class="fa fa-phone"></i><span class="english-text stw-call-full">Call Us</span><span class="english-text stw-call-short">Call</span><span class="arabic-text stw-call-ar" dir="rtl">اتصل بنا</span></a>' +
                '</div>' +
                '<button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarCollapse" aria-controls="navbarCollapse" aria-expanded="false" aria-label="Toggle navigation"><span class="fa fa-bars"></span></button>' +
                '<div class="collapse navbar-collapse" id="navbarCollapse">' +
                    '<div class="navbar-nav ms-auto py-0">' + links + '</div>' +
                    '<div class="stw-mobile-actions d-lg-none">' +
                        buildLanguageSwitcherMarkup({ mobile: true }) +
                        '<a href="tel:+971585895827" class="btn btn-primary stw-mobile-btn"><i class="fa fa-phone"></i><span class="english-text">Call</span><span class="arabic-text" dir="rtl">اتصال</span></a>' +
                        '<a href="https://wa.me/971585895827" target="_blank" rel="noopener" class="btn btn-outline-primary stw-mobile-btn"><i class="fab fa-whatsapp"></i><span class="english-text">WhatsApp</span><span class="arabic-text" dir="rtl">واتساب</span></a>' +
                    '</div>' +
                '</div>' +
            '</nav>' +
        '</div>';
    }

    function buildUnifiedFooter() {
        return '<footer class="container-fluid footer stw-footer mt-5"><div class="container py-4">' +
            '<div class="row g-3 align-items-start">' +
                '<div class="col-md-6 col-lg-3">' +
                    '<img src="img/TALENZA_logo_v2.png" alt="Silvora Talenza World" class="stw-footer-logo" loading="lazy" decoding="async">' +
                    '<p class="mt-2 mb-2 english-text">Silvora Talenza World LLC delivers recruitment, visa, PRO, business setup, and digital services with accountable delivery standards.</p>' +
                    '<p class="mt-2 mb-2 arabic-text" dir="rtl">تقدم سيلفورا تالينزا وورلد ذ.م.م خدمات التوظيف والتأشيرات وPRO وتأسيس الأعمال والخدمات الرقمية بمعايير تنفيذ مسؤولة.</p>' +
                    '<div class="stw-trust-badges">' +
                        '<span><i class="fa fa-shield-alt"></i>UAE Registered</span>' +
                        '<span><i class="fa fa-briefcase"></i>Corporate Advisory</span>' +
                        '<span><i class="fa fa-language"></i>Bilingual Support</span>' +
                    '</div>' +
                '</div>' +
                '<div class="col-md-6 col-lg-3">' +
                    '<h5 class="english-text">Quick Links</h5><h5 class="arabic-text" dir="rtl">روابط سريعة</h5>' +
                    '<div class="footer-menu d-grid gap-1">' +
                        '<a href="index.html"><span class="english-text">Home</span><span class="arabic-text" dir="rtl">الرئيسية</span></a>' +
                        '<a href="about.html"><span class="english-text">About</span><span class="arabic-text" dir="rtl">من نحن</span></a>' +
                        '<a href="service.html"><span class="english-text">Services</span><span class="arabic-text" dir="rtl">الخدمات</span></a>' +
                        '<a href="jobs.html"><span class="english-text">Jobs</span><span class="arabic-text" dir="rtl">الوظائف</span></a>' +
                        '<a href="clients.html"><span class="english-text">Clients</span><span class="arabic-text" dir="rtl">عملاؤنا</span></a>' +
                        '<a href="blogs.html"><span class="english-text">Blogs</span><span class="arabic-text" dir="rtl">المدونة</span></a>' +
                        '<a href="contact.html"><span class="english-text">Contact</span><span class="arabic-text" dir="rtl">اتصل بنا</span></a>' +
                    '</div>' +
                '</div>' +
                '<div class="col-md-6 col-lg-3">' +
                    '<h5 class="english-text">Our Services</h5><h5 class="arabic-text" dir="rtl">خدماتنا</h5>' +
                    '<div class="footer-menu d-grid gap-1">' +
                        '<a href="service-jobs.html"><span class="english-text">Manpower Services</span><span class="arabic-text" dir="rtl">خدمات القوى العاملة</span></a>' +
                        '<a href="service-visa.html"><span class="english-text">Visa Services</span><span class="arabic-text" dir="rtl">خدمات التأشيرات</span></a>' +
                        '<a href="service-pro.html"><span class="english-text">PRO Services</span><span class="arabic-text" dir="rtl">خدمات PRO</span></a>' +
                        '<a href="service-company.html"><span class="english-text">Business Setup</span><span class="arabic-text" dir="rtl">تأسيس الأعمال</span></a>' +
                        '<a href="service-web-development.html"><span class="english-text">Website & Software Development</span><span class="arabic-text" dir="rtl">تطوير المواقع والبرمجيات</span></a>' +
                        '<a href="service-digital-marketing.html"><span class="english-text">Digital Marketing</span><span class="arabic-text" dir="rtl">التسويق الرقمي</span></a>' +
                    '</div>' +
                '</div>' +
                '<div class="col-md-6 col-lg-3">' +
                    '<h5 class="english-text">Contact</h5><h5 class="arabic-text" dir="rtl">التواصل</h5>' +
                    '<p class="mb-1"><i class="fa fa-map-marker-alt me-2"></i><span class="english-text">Office No. 307, Al Dana Center, Maktoum Road, Deira, Dubai, UAE</span><span class="arabic-text" dir="rtl">مكتب رقم 307، مركز الدانة، شارع مكتوم، ديرة، دبي، الإمارات</span></p>' +
                    '<p class="mb-1"><i class="fa fa-phone-alt me-2"></i><a href="tel:+971585895827">+971 58 589 5827</a></p>' +
                    '<p class="mb-1"><i class="fa fa-envelope me-2"></i><a href="mailto:info@silvoratalenzaworld.com">info@silvoratalenzaworld.com</a></p>' +
                    '<p class="mb-1"><i class="fa fa-clock me-2"></i><span class="english-text">Mon-Sat: 10:00 AM-8:00 PM</span><span class="arabic-text" dir="rtl">الاثنين-السبت: 10:00 ص - 8:00 م</span></p>' +
                    '<a class="btn btn-sm btn-outline-primary mt-1" target="_blank" rel="noopener" href="https://maps.google.com/?q=Office+No.+307,+Al+Dana+Center,+Maktoum+Road,+Deira,+Dubai"><span class="english-text">Open in Google Maps</span><span class="arabic-text" dir="rtl">الموقع على خرائط جوجل</span></a>' +
                    '<form class="stw-newsletter mt-3" action="contact.php" method="post">' +
                        '<label class="form-label mb-1 english-text" for="newsletterEmail">Newsletter</label>' +
                        '<label class="form-label mb-1 arabic-text" dir="rtl" for="newsletterEmail">النشرة البريدية</label>' +
                        '<div class="input-group input-group-sm"><input id="newsletterEmail" name="email" type="email" class="form-control" required aria-label="Newsletter email"><button class="btn btn-primary" type="submit">Join</button></div>' +
                    '</form>' +
                '</div>' +
            '</div>' +
            '<div class="copyright d-flex flex-column flex-lg-row align-items-start align-items-lg-center justify-content-between gap-2 mt-3 pt-2">' +
                '<span><span class="english-text">© 2026 Silvora Talenza World LLC. All Rights Reserved.</span><span class="arabic-text" dir="rtl">© 2026 سيلفورا تالينزا وورلد ذ.م.م. جميع الحقوق محفوظة.</span></span>' +
                '<div class="footer-menu d-flex flex-wrap gap-2">' +
                    '<a href="privacy-policy.html"><span class="english-text">Privacy Policy</span><span class="arabic-text" dir="rtl">سياسة الخصوصية</span></a>' +
                    '<a href="terms-and-conditions.html"><span class="english-text">Terms</span><span class="arabic-text" dir="rtl">الشروط</span></a>' +
                    '<a href="sitemap.xml"><span class="english-text">Sitemap</span><span class="arabic-text" dir="rtl">خريطة الموقع</span></a>' +
                '</div>' +
                '<div class="d-flex gap-2">' +
                    '<a class="btn btn-sm btn-social" href="https://www.facebook.com/profile.php?id=61588411206914" target="_blank" rel="noopener" aria-label="Facebook"><i class="fab fa-facebook-f"></i></a>' +
                    '<a class="btn btn-sm btn-social" href="https://x.com/TALENZA216728" target="_blank" rel="noopener" aria-label="Twitter"><i class="fab fa-twitter"></i></a>' +
                    '<a class="btn btn-sm btn-social" href="https://www.instagram.com/talenza.uae/" target="_blank" rel="noopener" aria-label="Instagram"><i class="fab fa-instagram"></i></a>' +
                    '<a class="btn btn-sm btn-social" href="https://www.youtube.com/channel/UCnORIK_eKlP-lgx-j89RoZg" target="_blank" rel="noopener" aria-label="YouTube"><i class="fab fa-youtube"></i></a>' +
                '</div>' +
            '</div>' +
        '</div></footer>';
    }

    function applyUnifiedLayout() {
        var pageName = getCurrentPageName();
        var navShell = document.querySelector('.stw-nav-shell') || document.querySelector('.container-fluid.position-relative.p-0');

        if (navShell) {
            navShell.outerHTML = buildUnifiedNavbar(pageName);
        } else if (document.body) {
            document.body.insertAdjacentHTML('afterbegin', buildUnifiedNavbar(pageName));
        }

        var footer = document.querySelector('footer.footer') || document.querySelector('.container-fluid.footer') || document.querySelector('div.footer');
        if (footer) {
            footer.outerHTML = buildUnifiedFooter();
        }

        document.querySelectorAll('button[data-bs-target="#manpowerRequestModal"]').forEach(function (button) {
            if (button.closest('.navbar')) {
                return;
            }
            button.remove();
        });

        document.querySelectorAll('.topbar').forEach(function (topbar) {
            topbar.remove();
        });

        document.body.classList.add('stw-layout-ready');
    }

    function sanitizeLanguage(language) {
        var candidate = (language || '').toString().toLowerCase().split('-')[0];
        if (supportedLanguages.indexOf(candidate) !== -1) {
            return candidate;
        }
        return 'en';
    }

    function getCurrentPageName() {
        var pathName = window.location.pathname.toLowerCase();
        var pageName = pathName.split('/').pop() || 'index.html';
        return pageName;
    }

    function getLanguageFromPath(pathname) {
        var parts = (pathname || '').split('/').filter(Boolean);
        if (!parts.length) {
            return '';
        }

        var first = sanitizeLanguage(parts[0]);
        if (supportedLanguages.indexOf(first) !== -1 && parts[0].toLowerCase() === first) {
            return first;
        }

        return '';
    }

    function getStoredLanguage() {
        var queryLanguage = new URLSearchParams(window.location.search).get('lang');
        var storedLanguage = '';

        try {
            storedLanguage = window.localStorage.getItem(storageKey) || '';
        } catch (error) {
            storedLanguage = '';
        }

        var pathLanguage = getLanguageFromPath(window.location.pathname);
        return sanitizeLanguage(queryLanguage || pathLanguage || storedLanguage || document.documentElement.getAttribute('lang') || 'en');
    }

    function hasStoredLanguagePreference() {
        try {
            return !!window.localStorage.getItem(storageKey);
        } catch (error) {
            return false;
        }
    }

    function loadScript(source) {
        return new Promise(function (resolve, reject) {
            if (window.i18next && typeof window.i18next.init === 'function') {
                resolve(window.i18next);
                return;
            }

            var existingScript = document.querySelector('script[src="' + source + '"]');
            if (existingScript) {
                existingScript.addEventListener('load', function () {
                    resolve(window.i18next);
                });
                existingScript.addEventListener('error', reject);
                return;
            }

            var script = document.createElement('script');
            script.src = source;
            script.async = true;
            script.onload = function () {
                resolve(window.i18next);
            };
            script.onerror = reject;
            document.head.appendChild(script);
        });
    }

    function loadJson(path) {
        return fetch(path, { cache: 'force-cache' }).then(function (response) {
            if (!response.ok) {
                throw new Error('Failed to load ' + path);
            }

            return response.json();
        });
    }

    function ensureLanguageResource(language) {
        var lang = sanitizeLanguage(language);
        if (loadedLanguages[lang] && resources[lang]) {
            return Promise.resolve(resources[lang]);
        }

        return loadJson(getResourcePath(lang))
            .then(function (payload) {
                resources[lang] = { translation: payload || {} };
                loadedLanguages[lang] = true;
                return resources[lang];
            })
            .catch(function () {
                if (!resources[lang]) {
                    resources[lang] = { translation: {} };
                }
                loadedLanguages[lang] = true;
                return resources[lang];
            });
    }

    function applyLanguageTransition() {
        document.documentElement.classList.add('stw-lang-switching');
        window.setTimeout(function () {
            document.documentElement.classList.remove('stw-lang-switching');
        }, 320);
    }

    function createFallbackI18n(resourceBundle) {
        return {
            language: currentLanguage,
            resources: resourceBundle,
            init: function (options) {
                this.language = sanitizeLanguage(options.lng);
                currentLanguage = this.language;
                this.resources = options.resources;
                return Promise.resolve(this);
            },
            changeLanguage: function (language) {
                this.language = sanitizeLanguage(language);
                currentLanguage = this.language;
                return Promise.resolve(this.language);
            },
            t: function (key, options) {
                var bundle = this.resources && this.resources[this.language] && this.resources[this.language].translation;
                var enBundle = this.resources && this.resources.en && this.resources.en.translation;
                var value = key;

                if (bundle && Object.prototype.hasOwnProperty.call(bundle, key)) {
                    value = bundle[key];
                } else if (enBundle && Object.prototype.hasOwnProperty.call(enBundle, key)) {
                    value = enBundle[key];
                }

                if (typeof value !== 'string') {
                    return key;
                }

                if (options && typeof options === 'object') {
                    Object.keys(options).forEach(function (optKey) {
                        value = value.replace(new RegExp('{{\\s*' + optKey + '\\s*}}', 'g'), options[optKey]);
                    });
                }

                return value;
            }
        };
    }

    function translate(key, options) {
        if (!window.i18next || typeof window.i18next.t !== 'function') {
            return key || '';
        }

        var translated = window.i18next.t(key, options || {});
        if (translated === undefined || translated === null || translated === '') {
            return key || '';
        }

        return translated;
    }

    function isTranslatableElement(element) {
        if (!element || element.nodeType !== 1) {
            return false;
        }

        return !element.closest('script, style, noscript, svg, textarea, [data-i18n-skip]');
    }

    function registerBilingualPairs(root) {
        var targetRoot = root && root.querySelectorAll ? root : document;
        var arabicNodes = targetRoot.querySelectorAll('.arabic-text, .brand-text-ar');

        Array.prototype.forEach.call(arabicNodes, function (target) {
            if (target.dataset.i18nBilingualReady === 'true') {
                return;
            }

            var source = target.previousElementSibling;
            while (source && source.classList && (source.classList.contains('arabic-text') || source.classList.contains('brand-text-ar'))) {
                source = source.previousElementSibling;
            }

            if (!source || !source.textContent || !source.textContent.trim()) {
                return;
            }

            source.dataset.i18nBilingualSource = 'true';
            source.dataset.i18nBilingualInteractive = source.matches('a, button, input, select, textarea') ? 'true' : 'false';
            if (!source.dataset.i18nOriginalDisplay) {
                source.dataset.i18nOriginalDisplay = source.style.display || '';
            }

            target.dataset.i18nBilingualTarget = 'true';
            target.dataset.i18nBilingualReady = 'true';
            if (!target.dataset.i18nOriginalDisplay) {
                target.dataset.i18nOriginalDisplay = target.style.display || '';
            }
        });
    }

    function updateBilingualVisibility() {
        document.querySelectorAll('[data-i18n-bilingual-source="true"]').forEach(function (source) {
            var isInteractive = source.matches('a, button, input, select, textarea');
            if (currentLanguage === 'ar') {
                source.style.display = isInteractive ? (source.dataset.i18nOriginalDisplay || '') : 'none';
            } else {
                source.style.display = source.dataset.i18nOriginalDisplay || '';
            }
        });

        document.querySelectorAll('[data-i18n-bilingual-target="true"]').forEach(function (target) {
            var source = target.previousElementSibling;
            while (source && source.classList && (source.classList.contains('arabic-text') || source.classList.contains('brand-text-ar'))) {
                source = source.previousElementSibling;
            }

            var sourceInteractive = source && source.dataset && source.dataset.i18nBilingualInteractive === 'true';
            if (currentLanguage === 'ar') {
                target.style.display = sourceInteractive ? 'none' : (target.dataset.i18nOriginalDisplay || '');
            } else {
                target.style.display = 'none';
            }
        });
    }

    function localizeControlText(selector) {
        document.querySelectorAll(selector).forEach(function (element) {
            if (element.closest('[data-i18n-skip]')) {
                return;
            }
            Array.prototype.forEach.call(element.childNodes, function (node) {
                if (node.nodeType !== Node.TEXT_NODE) {
                    return;
                }

                if (typeof node.__i18nOriginalText === 'undefined') {
                    node.__i18nOriginalText = node.nodeValue;
                }

                var originalText = node.__i18nOriginalText;
                var trimmedText = originalText && originalText.trim();
                if (!trimmedText) {
                    return;
                }

                var lookupText = trimmedText.replace(/^[^\w\u0600-\u06FF]+/, '').trim();
                if (!lookupText) {
                    lookupText = trimmedText;
                }

                node.nodeValue = currentLanguage !== 'en' ? originalText.replace(trimmedText, translate(lookupText)) : originalText;
            });
        });
    }

    function localizeSharedControls() {
        localizeControlText('.footer h5, .footer p, .footer .btn.btn-link, .footer .footer-menu a, .footer .copyright');
        document.querySelectorAll('.footer .copyright').forEach(function (element) {
            Array.prototype.forEach.call(element.childNodes, function (node) {
                if (node.nodeType !== Node.TEXT_NODE) {
                    return;
                }

                if (typeof node.__i18nOriginalText === 'undefined') {
                    node.__i18nOriginalText = node.nodeValue;
                }

                var originalText = node.__i18nOriginalText;
                if (!originalText || !originalText.trim()) {
                    return;
                }

                if (currentLanguage !== 'en') {
                    var localizedText = originalText
                        .replace(/All Rights Reserved\./g, translate('All Rights Reserved.'))
                        .replace(/Designed By/g, translate('Designed By'));

                    node.nodeValue = localizedText;
                } else {
                    node.nodeValue = originalText;
                }
            });
        });
        localizeControlText('.navbar .nav-link, .navbar .navbar-brand, .navbar .btn, .navbar button');
        localizeControlText('button[data-bs-target="#manpowerRequestModal"], .ai-search-btn');
        localizeControlText('.navbar .btn, .navbar button');
    }

    function localizeAttributes(element) {
        var attributes = ['title', 'placeholder', 'aria-label', 'alt', 'data-bs-original-title', 'data-bs-title'];

        attributes.forEach(function (attributeName) {
            var attributeValue = element.getAttribute && element.getAttribute(attributeName);
            if (!attributeValue) {
                return;
            }

            if (element.closest('[data-i18n-skip]')) {
                return;
            }

            if (element.closest('.arabic-text, .brand-text-ar')) {
                return;
            }

            if (!element.__i18nOriginalAttributes) {
                element.__i18nOriginalAttributes = {};
            }

            if (typeof element.__i18nOriginalAttributes[attributeName] === 'undefined') {
                element.__i18nOriginalAttributes[attributeName] = attributeValue;
            }

            var originalValue = element.__i18nOriginalAttributes[attributeName];

            if (currentLanguage !== 'en') {
                element.setAttribute(attributeName, translate(originalValue));
            } else {
                element.setAttribute(attributeName, originalValue);
            }
        });
    }

    function localizeTree(root) {
        if (!root) {
            return;
        }

        registerBilingualPairs(root);

        var walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, null, false);
        var textNodes = [];

        while (walker.nextNode()) {
            textNodes.push(walker.currentNode);
        }

        textNodes.forEach(function (node) {
            var parentElement = node.parentElement;
            if (!parentElement || !isTranslatableElement(parentElement)) {
                return;
            }

            if (parentElement.closest('.arabic-text, .brand-text-ar')) {
                return;
            }

            if (parentElement.closest('[data-i18n-bilingual-source="true"]') && currentLanguage === 'ar') {
                return;
            }

            if (typeof node.__i18nOriginalText === 'undefined') {
                node.__i18nOriginalText = node.nodeValue;
            }

            var originalText = node.__i18nOriginalText;
            if (!originalText || !originalText.trim()) {
                return;
            }

            if (currentLanguage !== 'en') {
                var localized = translate(originalText);
                node.nodeValue = (localized === undefined || localized === null || localized === '') ? originalText : localized;
            } else {
                node.nodeValue = originalText;
            }
        });

        var elementRoot = root.querySelectorAll ? root : null;
        if (elementRoot) {
            elementRoot.querySelectorAll('*').forEach(function (element) {
                localizeAttributes(element);
            });
        }
    }

    function updateLanguageSwitcher() {
        document.querySelectorAll('.language-switcher').forEach(function (switcher) {
            var langCfg = getLanguageConfig(currentLanguage);
            var trigger = switcher.querySelector('.stw-lang-trigger');
            var triggerFlag = switcher.querySelector('.stw-lang-trigger-flag');
            var triggerLabel = switcher.querySelector('.stw-lang-trigger-label');
            var flagEmoji = toFlagEmoji(langCfg.flag);
            if (triggerFlag && triggerFlag.textContent !== flagEmoji) {
                triggerFlag.textContent = flagEmoji;
            }
            if (triggerLabel && triggerLabel.textContent !== langCfg.label) {
                triggerLabel.textContent = langCfg.label;
            }
            if (trigger) {
                var ariaLabel = translate('Current language {{language}}', { language: langCfg.label });
                if (trigger.getAttribute('aria-label') !== ariaLabel) {
                    trigger.setAttribute('aria-label', ariaLabel);
                }
            }

            switcher.querySelectorAll('[data-language], a[lang], button[lang]').forEach(function (control) {
                var controlLanguage = sanitizeLanguage(control.getAttribute('data-language') || control.getAttribute('lang'));
                var isActive = controlLanguage === currentLanguage;
                control.classList.toggle('is-active', isActive);
                control.setAttribute('aria-pressed', isActive ? 'true' : 'false');
                control.setAttribute('aria-selected', isActive ? 'true' : 'false');
            });
        });
    }

    function updateUrl(language) {
        var url = new URL(window.location.href);
        var pathLanguage = getLanguageFromPath(url.pathname);

        if (pathLanguage) {
            var parts = url.pathname.split('/');
            for (var i = 0; i < parts.length; i += 1) {
                if (parts[i] && sanitizeLanguage(parts[i]) === pathLanguage) {
                    parts[i] = language === 'en' ? '' : language;
                    break;
                }
            }
            url.pathname = parts.join('/').replace(/\/+/g, '/');
            url.searchParams.delete('lang');
            window.history.replaceState({}, '', url.toString());
            return;
        }

        if (language === 'en') {
            url.searchParams.delete('lang');
        } else {
            url.searchParams.set('lang', language);
        }

        window.history.replaceState({}, '', url.toString());
    }

    function setMeta(selector, attributeName, value) {
        var element = document.querySelector(selector);
        if (!element) {
            element = document.createElement('meta');
            var match = selector.match(/\[(name|property)="([^"]+)"\]/);
            if (match) {
                element.setAttribute(match[1], match[2]);
            }

            document.head.appendChild(element);
        }

        element.setAttribute(attributeName, value);
    }

    function updateSeo(language) {
        var pageName = getCurrentPageName();
        var pageMeta = seoByPage[pageName] || seoByPage['index.html'];
        var pageSeo = window.SilvoraPageSeo || null;
        var localizedFromPage = pageSeo && pageSeo[language];
        var localizedFromDefaultMap = pageMeta[language];
        var englishMeta = pageMeta.en || { title: document.title || 'Silvora Talenza World', description: '' };
        var meta = localizedFromPage || localizedFromDefaultMap || {
            title: translate(englishMeta.title),
            description: translate(englishMeta.description)
        };

        if (!meta.title) {
            meta.title = englishMeta.title;
        }
        if (!meta.description) {
            meta.description = englishMeta.description;
        }
        var baseUrl = window.location.origin + window.location.pathname;
        var localizedUrl = baseUrl + (language === 'en' ? '' : '?lang=' + language);
        var languageConfig = getLanguageConfig(language);

        document.title = meta.title;

        setMeta('meta[name="description"]', 'content', meta.description);
        setMeta('meta[name="keywords"]', 'content', language === 'ar' ? 'سيلفورا تالينزا وورلد، دبي، الإمارات العربية المتحدة' : 'Silvora Talenza World, Dubai, UAE');
        setMeta('meta[property="og:title"]', 'content', meta.title);
        setMeta('meta[property="og:description"]', 'content', meta.description);
        setMeta('meta[property="og:locale"]', 'content', languageConfig.locale || 'en_US');
        setMeta('meta[property="og:url"]', 'content', localizedUrl);
        setMeta('meta[property="og:site_name"]', 'content', 'Silvora Talenza World');
        setMeta('meta[name="twitter:title"]', 'content', meta.title);
        setMeta('meta[name="twitter:description"]', 'content', meta.description);
        setMeta('meta[name="twitter:card"]', 'content', 'summary_large_image');

        var canonical = document.querySelector('link[rel="canonical"]');
        if (!canonical) {
            canonical = document.createElement('link');
            canonical.rel = 'canonical';
            document.head.appendChild(canonical);
        }
        canonical.setAttribute('href', localizedUrl);

        document.querySelectorAll('link[rel="alternate"][hreflang]').forEach(function (node) {
            node.remove();
        });

        document.querySelectorAll('meta[property="og:locale:alternate"]').forEach(function (node) {
            node.remove();
        });

        supportedLanguages.forEach(function (langCode) {
            var alternate = document.createElement('link');
            alternate.setAttribute('rel', 'alternate');
            alternate.setAttribute('hreflang', langCode);
            alternate.setAttribute('href', baseUrl + (langCode === 'en' ? '' : '?lang=' + langCode));
            document.head.appendChild(alternate);
        });

        var xDefault = document.createElement('link');
        xDefault.setAttribute('rel', 'alternate');
        xDefault.setAttribute('hreflang', 'x-default');
        xDefault.setAttribute('href', baseUrl);
        document.head.appendChild(xDefault);
    }

    function syncDocumentLanguage(language) {
        document.documentElement.setAttribute('lang', language);
        document.documentElement.setAttribute('dir', language === 'ar' ? 'rtl' : 'ltr');
        document.body.classList.toggle('lang-ar', language === 'ar');
        document.body.classList.toggle('lang-en', language === 'en');
        document.body.classList.toggle('lang-other', language !== 'en' && language !== 'ar');
    }

    function attachLanguageControls() {
        document.querySelectorAll('.language-switcher').forEach(function (switcher) {
            var trigger = switcher.querySelector('.stw-lang-trigger');
            var menu = switcher.querySelector('.stw-lang-menu');
            var options = menu ? Array.prototype.slice.call(menu.querySelectorAll('.stw-lang-option')) : [];
            if (trigger && menu) {
                trigger.addEventListener('click', function (event) {
                    event.preventDefault();
                    var isOpen = switcher.classList.toggle('is-open');
                    trigger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
                    if (isOpen) {
                        var activeOption = menu.querySelector('.stw-lang-option.is-active') || menu.querySelector('.stw-lang-option');
                        if (activeOption) {
                            activeOption.focus();
                        }
                    }
                });

                trigger.addEventListener('keydown', function (event) {
                    if (event.key === 'Enter' || event.key === ' ') {
                        event.preventDefault();
                        trigger.click();
                        return;
                    }

                    if (event.key !== 'ArrowDown') {
                        return;
                    }

                    event.preventDefault();
                    if (!switcher.classList.contains('is-open')) {
                        trigger.click();
                    }
                    if (options.length) {
                        options[0].focus();
                    }
                });
            }

            options.forEach(function (option, index) {
                option.addEventListener('keydown', function (event) {
                    if (!options.length) {
                        return;
                    }

                    if (event.key === 'ArrowDown') {
                        event.preventDefault();
                        options[(index + 1) % options.length].focus();
                    }

                    if (event.key === 'ArrowUp') {
                        event.preventDefault();
                        options[(index - 1 + options.length) % options.length].focus();
                    }

                    if (event.key === 'Home') {
                        event.preventDefault();
                        options[0].focus();
                    }

                    if (event.key === 'End') {
                        event.preventDefault();
                        options[options.length - 1].focus();
                    }

                    if (event.key === 'Escape') {
                        event.preventDefault();
                        switcher.classList.remove('is-open');
                        if (trigger) {
                            trigger.setAttribute('aria-expanded', 'false');
                            trigger.focus();
                        }
                    }
                });
            });

            switcher.querySelectorAll('[data-language], a[lang], button[lang]').forEach(function (control) {
                if (control.classList.contains('stw-lang-trigger')) {
                    return;
                }
                control.addEventListener('click', function (event) {
                    event.preventDefault();
                    applyLanguage(sanitizeLanguage(control.getAttribute('data-language') || control.getAttribute('lang')));
                    switcher.classList.remove('is-open');
                    if (trigger) {
                        trigger.setAttribute('aria-expanded', 'false');
                    }
                });
            });
        });

        if (!document.body.dataset.langDropdownBound) {
            document.addEventListener('click', function (event) {
                document.querySelectorAll('.language-switcher.is-open').forEach(function (switcher) {
                    if (switcher.contains(event.target)) {
                        return;
                    }
                    switcher.classList.remove('is-open');
                    var trigger = switcher.querySelector('.stw-lang-trigger');
                    if (trigger) {
                        trigger.setAttribute('aria-expanded', 'false');
                    }
                });
            });

            document.addEventListener('keydown', function (event) {
                if (event.key !== 'Escape') {
                    return;
                }
                document.querySelectorAll('.language-switcher.is-open').forEach(function (switcher) {
                    switcher.classList.remove('is-open');
                    var trigger = switcher.querySelector('.stw-lang-trigger');
                    if (trigger) {
                        trigger.setAttribute('aria-expanded', 'false');
                        trigger.focus();
                    }
                });
            });

            document.body.dataset.langDropdownBound = 'true';
        }
    }

    function ensureLanguageSwitcher() {
        var existingSwitcher = document.querySelector('.language-switcher');
        if (existingSwitcher) {
            existingSwitcher.querySelectorAll('a[lang], button[lang]').forEach(function (control) {
                control.setAttribute('data-language', sanitizeLanguage(control.getAttribute('data-language') || control.getAttribute('lang')));
                control.setAttribute('type', 'button');
            });
            return;
        }

        var floatingSwitcher = document.createElement('div');
        floatingSwitcher.className = 'lang-switcher-floating';
        floatingSwitcher.innerHTML = buildLanguageSwitcherMarkup({ mobile: false });
        document.body.appendChild(floatingSwitcher);
        floatingSwitcher.querySelectorAll('[data-language]').forEach(function (control) {
            control.setAttribute('type', 'button');
        });
    }

    function ensureEnterpriseMegaMenu() {
        document.querySelectorAll('.navbar-nav').forEach(function (nav) {
            if (nav.querySelector('.enterprise-mega')) {
                return;
            }

            var serviceLink = Array.prototype.slice.call(nav.querySelectorAll('a.nav-link')).find(function (link) {
                var href = (link.getAttribute('href') || '').toLowerCase();
                return href === 'service.html' || href === '/service.html' || /services?/i.test(link.textContent || '');
            });

            if (!serviceLink) {
                return;
            }

            var serviceArabicSibling = serviceLink.nextElementSibling;
            if (serviceArabicSibling && serviceArabicSibling.classList && serviceArabicSibling.classList.contains('arabic-text')) {
                serviceArabicSibling.remove();
            }

            var wrapper = document.createElement('div');
            wrapper.className = 'nav-item dropdown enterprise-mega';
            wrapper.innerHTML = '<button type="button" class="nav-link enterprise-mega-toggle" aria-expanded="false" aria-haspopup="true" aria-controls="enterprise-services-panel"><span class="english-text">Services</span><span class="arabic-text" dir="rtl">خدماتنا</span><i class="fa fa-chevron-down ms-2"></i></button><div id="enterprise-services-panel" class="enterprise-mega-panel" role="region" aria-label="Services mega menu"><div class="enterprise-mega-shell"><div class="enterprise-mega-links"></div></div></div>';

            var panel = wrapper.querySelector('.enterprise-mega-links');
            enterpriseServiceColumns.forEach(function (item) {
                var anchor = document.createElement('a');
                anchor.href = item.href;
                anchor.className = 'enterprise-mega-item';
                anchor.innerHTML = '<span class="enterprise-mega-item-icon"><i class="fa ' + item.icon + '"></i></span><span class="enterprise-mega-item-copy"><span class="enterprise-mega-item-title english-text">' + item.en + '</span><span class="enterprise-mega-item-title arabic-text" dir="rtl">' + item.ar + '</span></span>';
                panel.appendChild(anchor);
            });

            serviceLink.replaceWith(wrapper);

            var toggle = wrapper.querySelector('.enterprise-mega-toggle');
            var megaPanel = wrapper.querySelector('.enterprise-mega-panel');
            var navContainer = wrapper.closest('.navbar');
            var closeDelayMs = 250;
            var closeTimer = null;
            var closeMenu = function () {
                wrapper.classList.remove('is-open');
                toggle.setAttribute('aria-expanded', 'false');
            };

            var openMenu = function () {
                wrapper.classList.add('is-open');
                toggle.setAttribute('aria-expanded', 'true');
            };

            var cancelClose = function () {
                if (closeTimer) {
                    window.clearTimeout(closeTimer);
                    closeTimer = null;
                }
            };

            var scheduleClose = function () {
                cancelClose();
                closeTimer = window.setTimeout(function () {
                    closeMenu();
                }, closeDelayMs);
            };

            toggle.addEventListener('click', function (event) {
                event.preventDefault();
                var isOpen = wrapper.classList.toggle('is-open');
                toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
            });

            toggle.addEventListener('keydown', function (event) {
                if (event.key === 'ArrowDown' || event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    openMenu();
                    var firstLink = wrapper.querySelector('.enterprise-mega-panel a');
                    if (firstLink) {
                        firstLink.focus();
                    }
                }
            });

            megaPanel.addEventListener('keydown', function (event) {
                var focusables = Array.prototype.slice.call(megaPanel.querySelectorAll('a, button, summary')).filter(function (node) {
                    return node.offsetParent !== null;
                });
                if (!focusables.length) {
                    return;
                }

                var currentIndex = focusables.indexOf(document.activeElement);
                if (event.key === 'ArrowDown' || event.key === 'ArrowRight') {
                    event.preventDefault();
                    focusables[(currentIndex + 1 + focusables.length) % focusables.length].focus();
                }

                if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') {
                    event.preventDefault();
                    focusables[(currentIndex - 1 + focusables.length) % focusables.length].focus();
                }

                if (event.key === 'Home') {
                    event.preventDefault();
                    focusables[0].focus();
                }

                if (event.key === 'End') {
                    event.preventDefault();
                    focusables[focusables.length - 1].focus();
                }

                if (event.key === 'Escape') {
                    event.preventDefault();
                    closeMenu();
                    toggle.focus();
                }
            });

            wrapper.addEventListener('mouseenter', function () {
                if (window.matchMedia('(min-width: 992px)').matches) {
                    cancelClose();
                    openMenu();
                }
            });

            wrapper.addEventListener('mouseleave', function () {
                if (window.matchMedia('(min-width: 992px)').matches) {
                    scheduleClose();
                }
            });

            toggle.addEventListener('focus', cancelClose);
            megaPanel.addEventListener('mouseenter', cancelClose);
            megaPanel.addEventListener('mouseleave', function () {
                if (window.matchMedia('(min-width: 992px)').matches) {
                    scheduleClose();
                }
            });

            if (navContainer) {
                navContainer.addEventListener('mouseleave', function () {
                    if (window.matchMedia('(min-width: 992px)').matches) {
                        scheduleClose();
                    }
                });

                navContainer.addEventListener('mouseenter', function () {
                    if (window.matchMedia('(min-width: 992px)').matches) {
                        cancelClose();
                    }
                });
            }

            wrapper.addEventListener('keydown', function (event) {
                if (event.key === 'Escape') {
                    closeMenu();
                    toggle.focus();
                }
            });
        });

        if (!document.body.dataset.enterpriseMegaBound) {
            document.addEventListener('click', function (event) {
                document.querySelectorAll('.enterprise-mega.is-open').forEach(function (menu) {
                    if (!menu.contains(event.target)) {
                        menu.classList.remove('is-open');
                        var toggle = menu.querySelector('.enterprise-mega-toggle');
                        if (toggle) {
                            toggle.setAttribute('aria-expanded', 'false');
                        }
                    }
                });
            });

            document.addEventListener('keydown', function (event) {
                if (event.key !== 'Escape') {
                    return;
                }

                document.querySelectorAll('.enterprise-mega.is-open').forEach(function (menu) {
                    menu.classList.remove('is-open');
                    var toggle = menu.querySelector('.enterprise-mega-toggle');
                    if (toggle) {
                        toggle.setAttribute('aria-expanded', 'false');
                    }
                });
            });

            window.addEventListener('resize', function () {
                if (!window.matchMedia('(min-width: 992px)').matches) {
                    document.querySelectorAll('.enterprise-mega.is-open').forEach(function (menu) {
                        menu.classList.remove('is-open');
                        var toggle = menu.querySelector('.enterprise-mega-toggle');
                        if (toggle) {
                            toggle.setAttribute('aria-expanded', 'false');
                        }
                    });
                }
            });

            document.body.dataset.enterpriseMegaBound = 'true';
        }
    }

    function removeLegacyServiceMenuNodes() {
        document.querySelectorAll('.service-mega, .service-mega-panel, .service-mega-toggle, .service-mega-group, .service-mega-links').forEach(function (node) {
            node.remove();
        });

        document.querySelectorAll('.navbar-nav').forEach(function (nav) {
            var links = Array.prototype.slice.call(nav.querySelectorAll('a.nav-link'));
            links.forEach(function (link) {
                var href = (link.getAttribute('href') || '').toLowerCase();
                if (href !== 'service.html' && href !== '/service.html') {
                    return;
                }

                var next = link.nextElementSibling;
                if (next && next.classList && next.classList.contains('arabic-text')) {
                    next.remove();
                }
            });
        });
    }

    function removeDuplicateNodes(selector) {
        var nodes = document.querySelectorAll(selector);
        var seen = false;

        Array.prototype.forEach.call(nodes, function (node) {
            if (seen) {
                node.remove();
                return;
            }

            seen = true;
        });
    }

    function applyLanguage(language) {
        currentLanguage = sanitizeLanguage(language);

        return ensureLanguageResource(currentLanguage).then(function () {
            try {
                window.localStorage.setItem(storageKey, currentLanguage);
            } catch (error) {
                // Local storage may be unavailable in some contexts.
            }

            if (window.i18next && typeof window.i18next.changeLanguage === 'function') {
                window.i18next.changeLanguage(currentLanguage);
            }

            applyLanguageTransition();
            syncDocumentLanguage(currentLanguage);
            updateUrl(currentLanguage);
            updateSeo(currentLanguage);
            updateBilingualVisibility();
            localizeTree(document.body);
            localizeSharedControls();
            updateLanguageSwitcher();

            if (typeof window.SilvoraNormalizeServicePagePanels === 'function') {
                window.SilvoraNormalizeServicePagePanels();
            }

            if (typeof window.SilvoraRefreshHeaderOffset === 'function') {
                window.setTimeout(function () {
                    window.SilvoraRefreshHeaderOffset();
                }, 0);
            }
        });
    }

    function observeMutations() {
        if (!('MutationObserver' in window) || observer) {
            return;
        }

        observer = new MutationObserver(function (mutations) {
            if (isProcessingMutations) {
                return;
            }

            var addedElements = [];

            mutations.forEach(function (mutation) {
                Array.prototype.forEach.call(mutation.addedNodes, function (node) {
                    if (node.nodeType !== 1) {
                        return;
                    }

                    if (node.closest && node.closest('[data-i18n-skip="true"]')) {
                        return;
                    }

                    addedElements.push(node);
                });
            });

            if (!addedElements.length) {
                return;
            }

            isProcessingMutations = true;
            observer.disconnect();

            try {
                addedElements.forEach(function (node) {
                    registerBilingualPairs(node);
                    localizeTree(node);
                });

                updateBilingualVisibility();
                updateLanguageSwitcher();
            } finally {
                observer.observe(document.body, { childList: true, subtree: true });
                isProcessingMutations = false;
            }
        });

        observer.observe(document.body, { childList: true, subtree: true });
    }

    function maybeShowLanguageSuggestion() {
        if (hasStoredLanguagePreference()) {
            return;
        }

        var dismissed = false;
        try {
            dismissed = window.localStorage.getItem(languageSuggestionKey) === 'true';
        } catch (error) {
            dismissed = false;
        }
        if (dismissed) {
            return;
        }

        var detected = detectBrowserLanguage();
        if (!detected || detected === 'en') {
            return;
        }

        var cfg = getLanguageConfig(detected);
        var host = document.createElement('div');
        host.className = 'stw-lang-suggest';
        host.setAttribute('data-i18n-skip', 'true');
        host.innerHTML = '<div class="stw-lang-suggest__overlay" aria-hidden="true"></div><section class="stw-lang-suggest__dialog" role="dialog" aria-modal="true" aria-labelledby="stwLangSuggestTitle" dir="' + cfg.dir + '"><h3 id="stwLangSuggestTitle">🌍 ' + translate('Welcome') + '</h3><p>' + translate('We noticed your browser language is {{language}}.', { language: cfg.label }) + '</p><p>' + translate('Would you like to continue in {{language}}?', { language: cfg.native }) + '</p><div class="stw-lang-suggest__actions"><button type="button" class="btn btn-primary" data-action="switch">' + translate('Switch Language') + '</button><button type="button" class="btn btn-outline-primary" data-action="stay">' + translate('Continue in English') + '</button></div></section>';

        var closeSuggestion = function () {
            try {
                window.localStorage.setItem(languageSuggestionKey, 'true');
            } catch (error) {
                // ignore persistence failures
            }
            host.remove();
        };

        host.querySelector('[data-action="switch"]').addEventListener('click', function () {
            applyLanguage(detected).finally(closeSuggestion);
        });
        host.querySelector('[data-action="stay"]').addEventListener('click', closeSuggestion);
        host.querySelector('.stw-lang-suggest__overlay').addEventListener('click', closeSuggestion);

        document.body.appendChild(host);
    }

    function init() {
        if (initializationPromise) {
            return initializationPromise;
        }

        applyUnifiedLayout();

        document.querySelectorAll('.topbar').forEach(function (topbar) {
            topbar.remove();
        });

        removeDuplicateNodes('#manpowerRequestModal');

        currentLanguage = getStoredLanguage();
        try {
            window.localStorage.setItem(storageKey, currentLanguage);
        } catch (error) {
            // Storage may be unavailable in some contexts.
        }
        ensureLanguageSwitcher();
        removeLegacyServiceMenuNodes();
        ensureEnterpriseMegaMenu();
        attachLanguageControls();
        syncDocumentLanguage(currentLanguage);

        initializationPromise = loadScript(cdnSource)
            .catch(function () {
                return null;
            })
            .then(function () {
                return ensureLanguageResource('en').then(function () {
                    if (currentLanguage !== 'en') {
                        return ensureLanguageResource(currentLanguage);
                    }
                    return Promise.resolve();
                });
            })
            .then(function () {
                if (!resources.en) {
                    resources.en = { translation: {} };
                }

                if (!window.i18next || typeof window.i18next.init !== 'function') {
                    window.i18next = createFallbackI18n(resources);
                }

                return window.i18next.init({
                    lng: currentLanguage,
                    fallbackLng: 'en',
                    resources: resources,
                    interpolation: { escapeValue: false },
                    returnEmptyString: false,
                    returnNull: false,
                    keySeparator: false,
                    nsSeparator: false
                });
            })
            .catch(function () {
                resources.en = resources.en || { translation: {} };
                if (!window.i18next || typeof window.i18next.init !== 'function') {
                    window.i18next = createFallbackI18n(resources);
                }

                return window.i18next.init({
                    lng: currentLanguage,
                    fallbackLng: 'en',
                    resources: resources,
                    interpolation: { escapeValue: false },
                    returnEmptyString: false,
                    returnNull: false,
                    keySeparator: false,
                    nsSeparator: false
                });
            })
            .then(function () {
                registerBilingualPairs(document);
                return applyLanguage(currentLanguage).then(function () {
                    observeMutations();
                    maybeShowLanguageSuggestion();
                    return window.i18next;
                });
            });

        return initializationPromise;
    }

    return {
        init: init,
        applyLanguage: applyLanguage,
        localizeTree: localizeTree,
        translate: translate,
        getLanguage: function () {
            return currentLanguage;
        }
    };
}());

document.addEventListener('DOMContentLoaded', function () {
    var pathName = window.location.pathname.toLowerCase();
    var pageName = pathName.split('/').pop() || 'index.html';
    document.body.classList.add('page-' + pageName.replace('.html', '').replace(/[^a-z0-9-]/g, '-'));

    function ensureGlobalFavicons() {
        var faviconBase = 'img/favicon2/';
        var faviconMap = [
            { selector: 'link[rel="apple-touch-icon"]', rel: 'apple-touch-icon', href: faviconBase + 'apple-touch-icon.png', sizes: '180x180' },
            { selector: 'link[rel="icon"][sizes="32x32"]', rel: 'icon', href: faviconBase + 'favicon-32x32.png', sizes: '32x32', type: 'image/png' },
            { selector: 'link[rel="icon"][sizes="16x16"]', rel: 'icon', href: faviconBase + 'favicon-16x16.png', sizes: '16x16', type: 'image/png' },
            { selector: 'link[rel="manifest"]', rel: 'manifest', href: faviconBase + 'site.webmanifest' },
            { selector: 'link[rel="shortcut icon"], link[rel="icon"][href$="favicon.ico"]', rel: 'shortcut icon', href: faviconBase + 'favicon.ico', type: 'image/x-icon' }
        ];

        faviconMap.forEach(function (item) {
            var link = document.head.querySelector(item.selector);
            if (!link) {
                link = document.createElement('link');
                document.head.appendChild(link);
            }

            link.setAttribute('rel', item.rel);
            link.setAttribute('href', item.href);

            if (item.sizes) {
                link.setAttribute('sizes', item.sizes);
            }

            if (item.type) {
                link.setAttribute('type', item.type);
            }
        });
    }

    ensureGlobalFavicons();

    function uiTranslate(key, options) {
        if (window.SilvoraI18n && typeof window.SilvoraI18n.translate === 'function') {
            var translated = window.SilvoraI18n.translate(key, options || {});
            if (translated !== undefined && translated !== null && translated !== '') {
                return translated;
            }
        }
        return key;
    }

    function debounce(fn, delay) {
        var timer = null;
        return function () {
            var args = arguments;
            var context = this;
            window.clearTimeout(timer);
            timer = window.setTimeout(function () {
                fn.apply(context, args);
            }, delay);
        };
    }

    function rafThrottle(fn) {
        var ticking = false;
        return function () {
            var args = arguments;
            var context = this;
            if (ticking) {
                return;
            }
            ticking = true;
            window.requestAnimationFrame(function () {
                ticking = false;
                fn.apply(context, args);
            });
        };
    }

    function whenIdle(callback, timeout) {
        if (typeof window.requestIdleCallback === 'function') {
            window.requestIdleCallback(callback, { timeout: timeout || 2000 });
            return;
        }
        window.setTimeout(callback, Math.min(timeout || 2000, 1200));
    }

    function normalizeServicePagePanels() {
        if (!/^service-[^.]+\.html$/i.test(pageName)) {
            return;
        }

        document.querySelectorAll('section .row.g-4').forEach(function (row) {
            var columns = Array.prototype.slice.call(row.children).filter(function (child) {
                return child.classList && child.classList.contains('col-lg-6');
            });

            if (columns.length !== 2) {
                return;
            }

            columns.forEach(function (col) {
                col.classList.remove('col-lg-12', 'stw-service-panel-hidden', 'd-none');
                col.classList.add('col-lg-6');
                col.removeAttribute('aria-hidden');
            });

            var englishOnly = columns[0].querySelector('.english-text') && !columns[0].querySelector('.arabic-text');
            var arabicOnly = columns[1].querySelector('.arabic-text') && !columns[1].querySelector('.english-text');

            if (!englishOnly || !arabicOnly) {
                return;
            }

            var activeLanguage = (document.documentElement.getAttribute('lang') || 'en').toLowerCase();
            var visibleColumn = activeLanguage === 'ar' ? columns[1] : columns[0];
            var hiddenColumn = activeLanguage === 'ar' ? columns[0] : columns[1];

            visibleColumn.classList.remove('col-lg-6');
            visibleColumn.classList.add('col-lg-12');
            hiddenColumn.classList.remove('col-lg-12');
            hiddenColumn.classList.add('stw-service-panel-hidden', 'd-none');
            hiddenColumn.setAttribute('aria-hidden', 'true');
        });
    }

    window.SilvoraNormalizeServicePagePanels = normalizeServicePagePanels;

    function applyHeaderOffsetSpacing() {
        var header = document.querySelector('.stw-header');
        if (!header) {
            return;
        }

        var height = Math.ceil(header.getBoundingClientRect().height);
        if (!height || !isFinite(height)) {
            return;
        }

        document.documentElement.style.setProperty('--stw-header-offset', height + 'px');
    }

    window.SilvoraRefreshHeaderOffset = applyHeaderOffsetSpacing;

    function bindHeaderOffsetObservers() {
        applyHeaderOffsetSpacing();
        var applyHeaderOffsetDebounced = debounce(applyHeaderOffsetSpacing, 120);
        window.addEventListener('resize', applyHeaderOffsetDebounced, { passive: true });
        window.addEventListener('load', applyHeaderOffsetSpacing, { once: true });

        var header = document.querySelector('.stw-header');
        var collapse = document.getElementById('navbarCollapse');

        if (header) {
            header.addEventListener('transitionend', function (event) {
                if (!event || !event.propertyName) {
                    return;
                }
                applyHeaderOffsetDebounced();
            });
        }

        if (collapse) {
            collapse.addEventListener('shown.bs.collapse', applyHeaderOffsetSpacing);
            collapse.addEventListener('hidden.bs.collapse', applyHeaderOffsetSpacing);
        }

        var resizeObserverSupported = typeof ResizeObserver !== 'undefined';
        if (resizeObserverSupported && header) {
            var ro = new ResizeObserver(function () {
                applyHeaderOffsetDebounced();
            });
            ro.observe(header);
        }
    }

    function applyEnterpriseMicroInteractions() {
        var onScroll = rafThrottle(function () {
            var scrolled = window.scrollY > 18;
            document.body.classList.toggle('stw-scrolled', scrolled);
        });

        onScroll();
        window.addEventListener('scroll', onScroll, { passive: true });

        document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
            anchor.addEventListener('click', function (event) {
                var href = anchor.getAttribute('href') || '';
                if (href.length <= 1) {
                    return;
                }

                var target = document.querySelector(href);
                if (!target) {
                    return;
                }

                event.preventDefault();
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            });
        });

        if (!document.body.dataset.rippleBound) {
            document.addEventListener('click', function (event) {
                var button = event.target.closest('.btn');
                if (!button) {
                    return;
                }

                var ripple = document.createElement('span');
                ripple.className = 'stw-ripple';
                var rect = button.getBoundingClientRect();
                var size = Math.max(rect.width, rect.height);
                ripple.style.width = size + 'px';
                ripple.style.height = size + 'px';
                ripple.style.left = (event.clientX - rect.left - size / 2) + 'px';
                ripple.style.top = (event.clientY - rect.top - size / 2) + 'px';
                button.appendChild(ripple);
                window.setTimeout(function () {
                    ripple.remove();
                }, 520);
            }, { passive: true });
            document.body.dataset.rippleBound = 'true';
        }

        if (!document.body.dataset.focusRingBound) {
            document.addEventListener('focusin', function (event) {
                var field = event.target;
                if (!field || !field.matches || !field.matches('input, textarea, select')) {
                    return;
                }
                var group = field.closest('.mb-3, .col-12, .col-lg-2, .col-lg-3, .col-lg-4');
                if (group) {
                    group.classList.add('stw-field-focus');
                }
            });
            document.addEventListener('focusout', function (event) {
                var field = event.target;
                if (!field || !field.matches || !field.matches('input, textarea, select')) {
                    return;
                }
                var group = field.closest('.mb-3, .col-12, .col-lg-2, .col-lg-3, .col-lg-4');
                if (group) {
                    group.classList.remove('stw-field-focus');
                }
            });
            document.body.dataset.focusRingBound = 'true';
        }

        if (!document.querySelector('.stw-reading-progress')) {
            var progress = document.createElement('div');
            progress.className = 'stw-reading-progress';
            progress.innerHTML = '<span></span>';
            document.body.appendChild(progress);

            var updateProgress = function () {
                var total = document.documentElement.scrollHeight - window.innerHeight;
                var value = total > 0 ? (window.scrollY / total) * 100 : 0;
                progress.firstElementChild.style.width = Math.min(100, Math.max(0, value)) + '%';
            };
            var updateProgressThrottled = rafThrottle(updateProgress);
            var updateProgressDebounced = debounce(updateProgress, 120);

            updateProgress();
            window.addEventListener('scroll', updateProgressThrottled, { passive: true });
            window.addEventListener('resize', updateProgressDebounced, { passive: true });
        }

        if (!document.querySelector('.stw-contact-widget')) {
            var widget = document.createElement('div');
            widget.className = 'stw-contact-widget';
            widget.innerHTML = '<button type="button" class="stw-contact-toggle" aria-label="' + uiTranslate('Open quick contact') + '"><i class="fa fa-comments"></i></button><div class="stw-contact-panel"><a href="tel:+971585895827"><i class="fa fa-phone"></i><span>' + uiTranslate('Call') + '</span></a><a href="https://wa.me/971585895827" target="_blank" rel="noopener"><i class="fab fa-whatsapp"></i><span>' + uiTranslate('WhatsApp') + '</span></a><a href="contact.html"><i class="fa fa-envelope"></i><span>' + uiTranslate('Contact') + '</span></a></div>';
            document.body.appendChild(widget);

            var toggle = widget.querySelector('.stw-contact-toggle');
            toggle.addEventListener('click', function () {
                widget.classList.toggle('is-open');
            });

            document.addEventListener('click', function (event) {
                if (!widget.contains(event.target)) {
                    widget.classList.remove('is-open');
                }
            });
        }
    }

    function enablePageTransitions() {
        document.body.classList.add('page-transition-ready');
        window.requestAnimationFrame(function () {
            document.body.classList.add('page-transition-enter');
        });

        if (!document.body.dataset.pageTransitionsBound) {
            document.addEventListener('click', function (event) {
                var anchor = event.target.closest('a');
                if (!anchor) {
                    return;
                }

                var href = anchor.getAttribute('href') || '';
                if (!href || href.startsWith('#') || anchor.target === '_blank' || event.metaKey || event.ctrlKey) {
                    return;
                }

                if (!/\.html(\?|$)|^\//i.test(href)) {
                    return;
                }

                event.preventDefault();
                document.body.classList.remove('page-transition-enter');
                window.setTimeout(function () {
                    window.location.href = href;
                }, 180);
            });
            document.body.dataset.pageTransitionsBound = 'true';
        }
    }

    function optimizeHeroVideos(slider) {
        if (!slider || slider.dataset.heroVideoOptimized === 'true') {
            return;
        }

        var isFilePreview = window.location.protocol === 'file:';
        var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        var videos = Array.prototype.slice.call(slider.querySelectorAll('.carousel-item video'));

        function hydrateVideo(video, eager) {
            if (!video || video.dataset.hydrated === 'true' || isFilePreview) {
                return;
            }

            var source = video.querySelector('source');
            if (!source) {
                return;
            }

            var dataSrc = source.getAttribute('data-src');
            if (!dataSrc) {
                dataSrc = source.getAttribute('src');
            }

            if (!dataSrc) {
                return;
            }

            source.setAttribute('src', dataSrc);
            source.removeAttribute('data-src');
            video.preload = eager ? 'metadata' : 'none';
            video.dataset.hydrated = 'true';
            video.load();
        }

        function syncActiveVideoPlayback() {
            var activeVideo = slider.querySelector('.carousel-item.active video');
            videos.forEach(function (video) {
                if (video === activeVideo && !prefersReducedMotion) {
                    hydrateVideo(video, true);
                    if (!document.hidden && slider.dataset.inViewport === 'true') {
                        var playPromise = video.play();
                        if (playPromise && typeof playPromise.catch === 'function') {
                            playPromise.catch(function () {});
                        }
                    }
                } else {
                    video.pause();
                }
            });
        }

        videos.forEach(function (video) {
            video.preload = 'none';
            video.muted = true;
            video.playsInline = true;
            video.setAttribute('playsinline', '');
            var source = video.querySelector('source');
            if (source && source.getAttribute('src')) {
                source.setAttribute('data-src', source.getAttribute('src'));
                source.removeAttribute('src');
            }
        });

        if ('IntersectionObserver' in window) {
            var sliderObserver = new IntersectionObserver(function (entries) {
                entries.forEach(function (entry) {
                    slider.dataset.inViewport = entry.isIntersecting ? 'true' : 'false';
                    if (!entry.isIntersecting) {
                        videos.forEach(function (video) { video.pause(); });
                    } else {
                        syncActiveVideoPlayback();
                    }
                });
            }, { threshold: 0.2 });
            sliderObserver.observe(slider);
        } else {
            slider.dataset.inViewport = 'true';
        }

        document.addEventListener('visibilitychange', function () {
            if (document.hidden) {
                videos.forEach(function (video) { video.pause(); });
                return;
            }
            syncActiveVideoPlayback();
        });

        slider.addEventListener('slid.bs.carousel', syncActiveVideoPlayback);
        syncActiveVideoPlayback();
        slider.dataset.heroVideoOptimized = 'true';
    }

    function mountPremiumJobsPage() {
        if (!/^jobs\.html$/i.test(pageName)) {
            return;
        }

        var host = document.querySelector('.inner-page-content') || document.querySelector('.container.py-5');
        if (!host || host.dataset.jobsPremiumMounted === 'true') {
            return;
        }

        var jobs = [
            { title: 'Senior HVAC Technician', country: 'UAE', location: 'Dubai', industry: 'Facility Management', department: 'Technical Operations', type: 'Full Time', salary: 'AED 3,500 - 4,800', salaryValue: 4800, experience: '3+ years', posted: '2026-07-16', featured: true, urgent: false },
            { title: 'Restaurant Service Supervisor', country: 'UAE', location: 'Abu Dhabi', industry: 'Hospitality', department: 'Food & Beverage', type: 'Full Time', salary: 'AED 3,000 - 4,200', salaryValue: 4200, experience: '2+ years', posted: '2026-07-15', featured: false, urgent: true },
            { title: 'Warehouse Shift Coordinator', country: 'Saudi Arabia', location: 'Riyadh', industry: 'Logistics', department: 'Warehousing', type: 'Contract', salary: 'SAR 4,500 - 5,800', salaryValue: 5800, experience: '4+ years', posted: '2026-07-14', featured: true, urgent: false },
            { title: 'Industrial Electrician', country: 'Romania', location: 'Cluj', industry: 'Manufacturing', department: 'Maintenance', type: 'Full Time', salary: 'EUR 1,100 - 1,500', salaryValue: 1500, experience: '3+ years', posted: '2026-07-13', featured: false, urgent: false },
            { title: 'General Laborer (Unskilled)', country: 'Romania', location: 'Bucharest', industry: 'Construction', department: 'Site Labor', type: 'Contract', salary: 'EUR 800 - 1,100', salaryValue: 1100, experience: 'No experience', posted: '2026-07-12', featured: false, urgent: true },
            { title: 'Construction Helper', country: 'Romania', location: 'Cluj', industry: 'Construction', department: 'Site Support', type: 'Contract', salary: 'EUR 800 - 1,100', salaryValue: 1100, experience: '1+ year', posted: '2026-07-12', featured: false, urgent: false },
            { title: 'Site Cleaner', country: 'Romania', location: 'Timisoara', industry: 'Construction', department: 'Site Support', type: 'Contract', salary: 'EUR 800 - 1,050', salaryValue: 1050, experience: 'No experience', posted: '2026-07-12', featured: false, urgent: false },
            { title: 'Material Handler', country: 'Romania', location: 'Brasov', industry: 'Logistics', department: 'Warehouse Operations', type: 'Contract', salary: 'EUR 850 - 1,100', salaryValue: 1100, experience: '1+ year', posted: '2026-07-12', featured: false, urgent: false },
            { title: 'Loading & Unloading Worker', country: 'Romania', location: 'Ploiesti', industry: 'Logistics', department: 'Warehouse Operations', type: 'Contract', salary: 'EUR 800 - 1,050', salaryValue: 1050, experience: 'No experience', posted: '2026-07-12', featured: false, urgent: false },
            { title: 'Excavation Helper', country: 'Romania', location: 'Iasi', industry: 'Construction', department: 'Ground Works', type: 'Contract', salary: 'EUR 850 - 1,100', salaryValue: 1100, experience: '1+ year', posted: '2026-07-12', featured: false, urgent: false },
            { title: 'Demolition Worker', country: 'Romania', location: 'Constanta', industry: 'Construction', department: 'Site Labor', type: 'Contract', salary: 'EUR 850 - 1,100', salaryValue: 1100, experience: '1+ year', posted: '2026-07-12', featured: false, urgent: false },
            { title: 'Concrete Helper', country: 'Romania', location: 'Bucharest', industry: 'Construction', department: 'Civil Works', type: 'Contract', salary: 'EUR 850 - 1,100', salaryValue: 1100, experience: '1+ year', posted: '2026-07-12', featured: false, urgent: false },
            { title: 'Mason Helper', country: 'Romania', location: 'Cluj', industry: 'Construction', department: 'Civil Works', type: 'Contract', salary: 'EUR 850 - 1,150', salaryValue: 1150, experience: '1+ year', posted: '2026-07-12', featured: false, urgent: false },
            { title: 'Carpenter Helper', country: 'Romania', location: 'Timisoara', industry: 'Construction', department: 'Finishing Works', type: 'Contract', salary: 'EUR 850 - 1,150', salaryValue: 1150, experience: '1+ year', posted: '2026-07-12', featured: false, urgent: false },
            { title: 'Plumbing Helper', country: 'Romania', location: 'Brasov', industry: 'Construction', department: 'MEP Support', type: 'Contract', salary: 'EUR 850 - 1,150', salaryValue: 1150, experience: '1+ year', posted: '2026-07-12', featured: false, urgent: false },
            { title: 'Electrical Helper', country: 'Romania', location: 'Ploiesti', industry: 'Construction', department: 'MEP Support', type: 'Contract', salary: 'EUR 850 - 1,150', salaryValue: 1150, experience: '1+ year', posted: '2026-07-12', featured: false, urgent: false },
            { title: 'Road Work Laborer', country: 'Romania', location: 'Iasi', industry: 'Construction', department: 'Infrastructure', type: 'Contract', salary: 'EUR 850 - 1,100', salaryValue: 1100, experience: 'No experience', posted: '2026-07-12', featured: false, urgent: false },
            { title: 'Flagman / Traffic Helper', country: 'Romania', location: 'Constanta', industry: 'Construction', department: 'Infrastructure', type: 'Contract', salary: 'EUR 800 - 1,050', salaryValue: 1050, experience: 'No experience', posted: '2026-07-12', featured: false, urgent: false },
            { title: 'Ground Worker', country: 'Romania', location: 'Bucharest', industry: 'Construction', department: 'Site Labor', type: 'Contract', salary: 'EUR 800 - 1,100', salaryValue: 1100, experience: 'No experience', posted: '2026-07-12', featured: false, urgent: false },
            { title: 'Landscaping Laborer', country: 'Romania', location: 'Cluj', industry: 'Facility Management', department: 'Grounds Maintenance', type: 'Contract', salary: 'EUR 800 - 1,050', salaryValue: 1050, experience: 'No experience', posted: '2026-07-12', featured: false, urgent: false },
            { title: 'Drainage Cleaning Worker', country: 'Romania', location: 'Timisoara', industry: 'Facility Management', department: 'Grounds Maintenance', type: 'Contract', salary: 'EUR 800 - 1,050', salaryValue: 1050, experience: 'No experience', posted: '2026-07-12', featured: false, urgent: false },
            { title: 'Watchman / Site Attendant', country: 'Romania', location: 'Brasov', industry: 'Security', department: 'Site Services', type: 'Contract', salary: 'EUR 800 - 1,050', salaryValue: 1050, experience: 'No experience', posted: '2026-07-12', featured: false, urgent: false },
            { title: 'Hotel Housekeeping Team Leader', country: 'Croatia', location: 'Split', industry: 'Hospitality', department: 'Operations', type: 'Seasonal', salary: 'EUR 900 - 1,200', salaryValue: 1200, experience: '2+ years', posted: '2026-07-11', featured: false, urgent: false },
            { title: 'Retail Store Operations Executive', country: 'UAE', location: 'Sharjah', industry: 'Retail', department: 'Store Operations', type: 'Full Time', salary: 'AED 4,000 - 5,500', salaryValue: 5500, experience: '3+ years', posted: '2026-07-10', featured: true, urgent: true },
            { title: 'Security Control Room Operator', country: 'Qatar', location: 'Doha', industry: 'Security', department: 'Security Operations', type: 'Full Time', salary: 'QAR 2,800 - 3,700', salaryValue: 3700, experience: '2+ years', posted: '2026-07-09', featured: false, urgent: false },
            { title: 'Civil Site Foreman', country: 'Serbia', location: 'Belgrade', industry: 'Construction', department: 'Site Management', type: 'Contract', salary: 'EUR 1,200 - 1,700', salaryValue: 1700, experience: '5+ years', posted: '2026-07-08', featured: false, urgent: true },
            { title: 'Aviation Ground Handling Agent', country: 'UAE', location: 'Dubai', industry: 'Aviation', department: 'Ground Operations', type: 'Shift', salary: 'AED 3,200 - 4,100', salaryValue: 4100, experience: '2+ years', posted: '2026-07-07', featured: true, urgent: false }
        ];

        host.dataset.jobsPremiumMounted = 'true';
        host.classList.add('stw-jobs-shell');
        host.innerHTML = '<section class="stw-jobs-hero mb-4"><div><p class="stw-kicker english-text">Global Recruitment Desk</p><p class="stw-kicker arabic-text" dir="rtl">مكتب التوظيف العالمي</p><h1 class="english-text">Find Enterprise-Verified Career Opportunities</h1><h1 class="arabic-text" dir="rtl">اعثر على فرص عمل معتمدة للمؤسسات</h1><p class="english-text">Search active openings, filter by hiring priorities, and apply directly with recruitment support from Silvora Talenza World.</p><p class="arabic-text" dir="rtl">ابحث في الوظائف النشطة وقم بالتصفية حسب أولويات التوظيف وقدّم مباشرةً مع دعم التوظيف من سيلفورا تالينزا وورلد.</p></div><div class="stw-sticky-apply"><a class="btn btn-primary" href="contact.html"><span class="english-text">Apply with Recruiter Support</span><span class="arabic-text" dir="rtl">قدّم مع دعم فريق التوظيف</span></a></div></section>' +
            '<section class="stw-job-filters mb-4"><div class="row g-3"><div class="col-lg-3"><label class="form-label english-text">Search</label><input class="form-control" id="jobQuery" type="text" aria-label="Search jobs"></div><div class="col-lg-2"><label class="form-label english-text">Country</label><select class="form-select" id="jobCountry"><option value="">All</option></select></div><div class="col-lg-2"><label class="form-label english-text">Industry</label><select class="form-select" id="jobIndustry"><option value="">All</option></select></div><div class="col-lg-2"><label class="form-label english-text">Department</label><select class="form-select" id="jobDepartment"><option value="">All</option></select></div><div class="col-lg-1"><label class="form-label english-text">Type</label><select class="form-select" id="jobType"><option value="">All</option></select></div><div class="col-lg-2"><label class="form-label english-text">Salary</label><select class="form-select" id="jobSalary"><option value="">Any</option><option value="1500">1500+</option><option value="3000">3000+</option><option value="4500">4500+</option></select></div></div><div class="d-flex justify-content-between align-items-center mt-3"><div class="d-flex gap-2"><button id="jobsGridView" class="btn btn-sm btn-primary" type="button" aria-label="Grid view">Grid</button><button id="jobsListView" class="btn btn-sm btn-outline-primary" type="button" aria-label="List view">List</button></div><div class="small text-muted" id="jobResultCount" aria-live="polite"></div></div></section>' +
            '<section><div class="row g-4" id="jobCards"></div><div class="text-center mt-4"><button class="btn btn-outline-primary" id="loadMoreJobs" type="button">Load More Jobs</button></div></section>' +
            '<section class="mt-5"><div class="row g-4"><div class="col-lg-6"><div class="stw-card"><h3 class="h5 english-text">Recruitment Process Timeline</h3><ol class="stw-timeline"><li>Profile Screening</li><li>Employer Shortlisting</li><li>Interview Coordination</li><li>Offer and Documentation</li><li>Pre-Departure/Onboarding</li></ol></div></div><div class="col-lg-6"><div class="stw-card"><h3 class="h5 english-text">Frequently Asked Questions</h3><div class="accordion" id="jobsFaq"><div class="accordion-item"><h4 class="accordion-header" id="jobsFaq1"><button class="accordion-button" data-bs-toggle="collapse" data-bs-target="#jobsFaqBody1" type="button">How quickly can I receive interview updates?</button></h4><div id="jobsFaqBody1" class="accordion-collapse collapse show" data-bs-parent="#jobsFaq"><div class="accordion-body">Most interview updates are shared within one to three business days after employer feedback is released.</div></div></div><div class="accordion-item"><h4 class="accordion-header" id="jobsFaq2"><button class="accordion-button collapsed" data-bs-toggle="collapse" data-bs-target="#jobsFaqBody2" type="button">Are salaries fixed?</button></h4><div id="jobsFaqBody2" class="accordion-collapse collapse" data-bs-parent="#jobsFaq"><div class="accordion-body">Salary ranges are indicative and depend on employer terms, role scope, and candidate profile.</div></div></div></div></div></div></div></section>' +
            '<section class="mt-5"><div class="row g-4"><div class="col-lg-8"><div class="stw-card"><h3 class="h5 english-text">Related Services</h3><div class="d-flex flex-wrap gap-2"><a href="service-jobs.html" class="btn btn-outline-primary btn-sm">Job Placement Services</a><a href="recruitment-overseas.html" class="btn btn-outline-primary btn-sm">Overseas Recruitment</a><a href="service-visa.html" class="btn btn-outline-primary btn-sm">Visa Services</a></div></div></div><div class="col-lg-4"><div class="stw-card"><h3 class="h5 english-text">Contact Recruiter</h3><p class="mb-1">Phone: <a href="tel:+971585895827">+971 58 589 5827</a></p><p class="mb-0">Email: <a href="mailto:info@silvoratalenzaworld.com">info@silvoratalenzaworld.com</a></p></div></div></div></section>';

        var queryInput = document.getElementById('jobQuery');
        var countrySelect = document.getElementById('jobCountry');
        var industrySelect = document.getElementById('jobIndustry');
        var departmentSelect = document.getElementById('jobDepartment');
        var typeSelect = document.getElementById('jobType');
        var salarySelect = document.getElementById('jobSalary');
        var gridViewBtn = document.getElementById('jobsGridView');
        var listViewBtn = document.getElementById('jobsListView');
        var resultCount = document.getElementById('jobResultCount');
        var cardsHost = document.getElementById('jobCards');
        var loadMoreBtn = document.getElementById('loadMoreJobs');
        var visibleCount = 99;
        var viewMode = 'grid';

        function uniqueValues(key) {
            return Array.from(new Set(jobs.map(function (job) { return job[key]; }))).sort();
        }

        function populateSelect(select, key) {
            uniqueValues(key).forEach(function (value) {
                var option = document.createElement('option');
                option.value = value;
                option.textContent = value;
                select.appendChild(option);
            });
        }

        function matches(job, query) {
            if (!query) {
                return true;
            }
            var q = query.toLowerCase();
            return [job.title, job.country, job.location, job.industry, job.department].join(' ').toLowerCase().indexOf(q) !== -1;
        }

        function filteredJobs() {
            return jobs.filter(function (job) {
                return matches(job, queryInput.value.trim()) &&
                    (!countrySelect.value || job.country === countrySelect.value) &&
                    (!industrySelect.value || job.industry === industrySelect.value) &&
                    (!departmentSelect.value || job.department === departmentSelect.value) &&
                    (!typeSelect.value || job.type === typeSelect.value) &&
                    (!salarySelect.value || job.salaryValue >= parseInt(salarySelect.value, 10));
            }).sort(function (left, right) {
                var leftPriority = left.country === 'Romania' ? 0 : 1;
                var rightPriority = right.country === 'Romania' ? 0 : 1;
                if (leftPriority !== rightPriority) {
                    return leftPriority - rightPriority;
                }
                return new Date(right.posted).getTime() - new Date(left.posted).getTime();
            });
        }

        function skeleton(count) {
            return Array.from({ length: count }).map(function () {
                return '<div class="col-lg-4 col-md-6"><article class="stw-job-card stw-skeleton-card h-100"><div class="stw-skeleton-line w-50"></div><div class="stw-skeleton-line w-75"></div><div class="stw-skeleton-line w-100"></div><div class="stw-skeleton-line w-90"></div></article></div>';
            }).join('');
        }

        function renderJobs(reset) {
            if (reset) {
                visibleCount = 99;
            }
            cardsHost.classList.toggle('stw-list-view', viewMode === 'list');
            cardsHost.innerHTML = skeleton(3);
            var items = filteredJobs();
            window.setTimeout(function () {
                cardsHost.innerHTML = items.slice(0, visibleCount).map(function (job) {
                    var badge = job.urgent ? '<span class="stw-job-badge urgent">Urgent Hiring</span>' : (job.featured ? '<span class="stw-job-badge">Featured</span>' : '');
                    return '<div class="col-lg-4 col-md-6"><article class="stw-job-card h-100"><div class="d-flex justify-content-between align-items-center"><div class="stw-job-meta"><span>' + job.country + '</span><span>' + job.industry + '</span></div>' + badge + '</div><h3>' + job.title + '</h3><ul><li><i class="fa fa-map-marker-alt"></i>' + job.location + '</li><li><i class="fa fa-briefcase"></i>' + job.type + ' | ' + job.experience + '</li><li><i class="fa fa-money-bill-wave"></i>' + job.salary + '</li><li><i class="fa fa-calendar-alt"></i>Posted: ' + job.posted + '</li></ul><div class="d-flex flex-wrap gap-2 mt-3"><a href="contact.html" class="btn btn-primary btn-sm">Apply</a><button class="btn btn-outline-primary btn-sm" type="button">Save</button><button class="btn btn-outline-secondary btn-sm stw-share-job" data-title="' + job.title + '" type="button">Share</button></div></article></div>';
                }).join('');

                cardsHost.querySelectorAll('.stw-share-job').forEach(function (shareBtn) {
                    shareBtn.addEventListener('click', function () {
                        var title = shareBtn.getAttribute('data-title') || 'Job opening';
                        var shareText = title + ' - Silvora Talenza World';
                        if (navigator.share) {
                            navigator.share({ title: shareText, text: shareText, url: window.location.href });
                            return;
                        }

                        if (navigator.clipboard) {
                            navigator.clipboard.writeText(shareText + ' ' + window.location.href);
                        }
                    });
                });

                if (resultCount) {
                    resultCount.textContent = items.length + ' positions found';
                }

                loadMoreBtn.style.display = items.length > visibleCount ? 'inline-flex' : 'none';
            }, 120);
        }

        populateSelect(countrySelect, 'country');
        populateSelect(industrySelect, 'industry');
        populateSelect(departmentSelect, 'department');
        populateSelect(typeSelect, 'type');

        [queryInput, countrySelect, industrySelect, departmentSelect, typeSelect, salarySelect].forEach(function (control) {
            control.addEventListener('input', function () { renderJobs(true); });
            control.addEventListener('change', function () { renderJobs(true); });
        });

        gridViewBtn.addEventListener('click', function () {
            viewMode = 'grid';
            gridViewBtn.classList.add('btn-primary');
            gridViewBtn.classList.remove('btn-outline-primary');
            listViewBtn.classList.add('btn-outline-primary');
            listViewBtn.classList.remove('btn-primary');
            renderJobs(false);
        });

        listViewBtn.addEventListener('click', function () {
            viewMode = 'list';
            listViewBtn.classList.add('btn-primary');
            listViewBtn.classList.remove('btn-outline-primary');
            gridViewBtn.classList.add('btn-outline-primary');
            gridViewBtn.classList.remove('btn-primary');
            renderJobs(false);
        });

        loadMoreBtn.addEventListener('click', function () {
            visibleCount += 6;
            renderJobs(false);
        });

        renderJobs(true);
    }

    function upgradeHomepageExperience() {
        if (!/^index\.html$/i.test(pageName)) {
            return;
        }

        function buildEnhancedHomeOverviewMarkup() {
            return '<div class="container"><div class="row g-4 align-items-stretch"><div class="col-lg-8"><div class="stw-card stw-coverage-card"><div class="d-flex flex-column flex-lg-row justify-content-between gap-3 mb-3"><div><h2 class="h4 mb-2 english-text">Industries We Serve</h2><p class="mb-0 stw-coverage-copy">Sector-aligned recruitment, visa, and corporate support built for fast-moving employers and candidates.</p></div><span class="stw-coverage-badge"><i class="fa fa-globe"></i>Global Hiring Coverage</span></div><div class="stw-logo-track" data-logo-track data-logo-speed="0.65"><div class="stw-logo-track-row"><span><i class="fa fa-hard-hat"></i>Construction</span><span><i class="fa fa-hotel"></i>Hospitality</span><span><i class="fa fa-heartbeat"></i>Healthcare</span><span><i class="fa fa-truck"></i>Logistics</span><span><i class="fa fa-store"></i>Retail</span><span><i class="fa fa-industry"></i>Manufacturing</span><span><i class="fa fa-plane"></i>Aviation</span><span><i class="fa fa-building"></i>Facility Management</span><span><i class="fa fa-shield-alt"></i>Security</span><span><i class="fa fa-warehouse"></i>Warehousing</span></div></div><div class="row g-3 mt-2"><div class="col-md-6"><div class="stw-mini-card"><h3>Countries We Recruit From</h3><p>UAE, India, Pakistan, Nepal, Bangladesh, Sri Lanka, Philippines, Kenya</p></div></div><div class="col-md-6"><div class="stw-mini-card"><h3>Countries We Recruit To</h3><p>UAE, Saudi Arabia, Qatar, Oman, Bahrain, Romania, Poland, Croatia, Serbia, Portugal, Germany, Italy</p></div></div></div><div class="stw-coverage-panel mt-3" aria-label="Recruitment coverage highlights"><div class="stw-coverage-panel__route"><span class="stw-coverage-panel__label">Source Markets</span><div class="stw-coverage-panel__chips"><span>South Asia</span><span>East Africa</span><span>UAE Talent Pool</span></div></div><div class="stw-coverage-panel__route"><span class="stw-coverage-panel__label">Destination Markets</span><div class="stw-coverage-panel__chips"><span>UAE</span><span>GCC</span><span>Europe</span></div></div><div class="stw-coverage-panel__route stw-coverage-panel__route--accent"><span class="stw-coverage-panel__label">Delivery Strength</span><p class="mb-0">Recruitment, visa processing, onboarding coordination, and corporate advisory under one service framework.</p></div></div></div></div><div class="col-lg-4"><div class="stw-card stw-strength-card"><h2 class="h5 mb-3 english-text">Operational Highlights</h2><div class="stw-counter-grid stw-counter-grid--premium"><div><strong data-counter-target="20" data-counter-suffix="+">0</strong><span>Years Experience</span></div><div><strong data-counter-target="1000" data-counter-suffix="+">0</strong><span>Candidates Assisted</span></div><div><strong data-counter-target="50" data-counter-suffix="+">0</strong><span>Corporate Clients</span></div><div><strong data-counter-target="15" data-counter-suffix="+">0</strong><span>Countries Served</span></div></div><div class="stw-strength-list mt-3"><div><i class="fa fa-shield-alt"></i><span>Trusted UAE Consultancy</span></div><div><i class="fa fa-file-alt"></i><span>Compliance-first processing</span></div><div><i class="fa fa-headset"></i><span>Dedicated bilingual support</span></div></div></div></div></div><div class="row g-4 mt-1"><div class="col-lg-4"><div class="stw-card"><h3 class="h6">Recruitment Process</h3><ol class="stw-timeline"><li>Demand Planning</li><li>Sourcing & Screening</li><li>Client Interviews</li><li>Offer Management</li><li>Deployment</li></ol></div></div><div class="col-lg-4"><div class="stw-card"><h3 class="h6">Visa Process</h3><ol class="stw-timeline"><li>Eligibility Review</li><li>Document Verification</li><li>Submission</li><li>Status Follow-up</li><li>Issuance Support</li></ol></div></div><div class="col-lg-4"><div class="stw-card"><h3 class="h6">Business Setup Process</h3><ol class="stw-timeline"><li>Advisory</li><li>License Path</li><li>Approvals</li><li>Registration</li><li>Operational Launch</li></ol></div></div></div><div class="row g-4 mt-1"><div class="col-lg-6"><div class="stw-card"><h3 class="h6">Featured Jobs</h3><p>Explore active openings with fast-track recruiter coordination.</p><a class="btn btn-outline-primary btn-sm" href="jobs.html">Browse Jobs</a></div></div><div class="col-lg-6"><div class="stw-card"><h3 class="h6">Latest Blogs</h3><p>Market updates, hiring trends, and practical migration insights.</p><a class="btn btn-outline-primary btn-sm" href="blogs.html">Read Blog</a></div></div></div><div class="row g-4 mt-1"><div class="col-lg-8"><div class="stw-card"><h3 class="h6">Frequently Asked Questions</h3><div class="accordion" id="homeFaq"><div class="accordion-item"><h4 class="accordion-header" id="homeFaqH1"><button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#homeFaqB1">Do you support end-to-end recruitment and visa coordination?</button></h4><div id="homeFaqB1" class="accordion-collapse collapse show" data-bs-parent="#homeFaq"><div class="accordion-body">Yes. Our teams coordinate sourcing, documentation, visa support, and onboarding workflows under one service framework.</div></div></div><div class="accordion-item"><h4 class="accordion-header" id="homeFaqH2"><button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#homeFaqB2">Can you support multilingual stakeholder communication?</button></h4><div id="homeFaqB2" class="accordion-collapse collapse" data-bs-parent="#homeFaq"><div class="accordion-body">Yes. English and Arabic communication models are available for candidate and corporate engagement.</div></div></div></div></div></div><div class="col-lg-4"><div class="stw-card stw-final-cta"><h3 class="h6">Start Your Corporate Consultation</h3><p>Connect with Silvora specialists for recruitment, visa, PRO, business setup, and digital execution.</p><a class="btn btn-primary btn-sm" href="contact.html">Book Consultation</a></div></div></div></div>';
        }

        function bindAwardsReveal(root) {
            if (!root) {
                return;
            }

            var revealItems = root.querySelectorAll('.stw-reveal-up');
            if (!revealItems.length) {
                return;
            }

            if (!('IntersectionObserver' in window)) {
                revealItems.forEach(function (item) {
                    item.classList.add('is-visible');
                });
                return;
            }

            var revealObserver = new IntersectionObserver(function (entries, observerInstance) {
                entries.forEach(function (entry) {
                    if (!entry.isIntersecting) {
                        return;
                    }
                    entry.target.classList.add('is-visible');
                    observerInstance.unobserve(entry.target);
                });
            }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });

            revealItems.forEach(function (item) {
                if (item.dataset.stwRevealBound === 'true') {
                    return;
                }
                item.dataset.stwRevealBound = 'true';
                revealObserver.observe(item);
            });
        }

        function bindAwardsImageLoading(root) {
            if (!root) {
                return;
            }
            var images = root.querySelectorAll('.stw-award-card__media img');
            images.forEach(function (img) {
                var skeleton = img.parentElement ? img.parentElement.querySelector('.stw-award-card__skeleton') : null;
                function onLoad() {
                    img.classList.add('is-loaded');
                    if (skeleton) {
                        skeleton.classList.add('is-hidden');
                    }
                }
                if (img.complete && img.naturalWidth > 0) {
                    onLoad();
                } else {
                    img.addEventListener('load', onLoad, { once: true });
                    img.addEventListener('error', onLoad, { once: true });
                }
            });
        }

        function bindAwardsParallax(section) {
            if (!section || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
                return;
            }
            var cards = section.querySelectorAll('.stw-award-card');
            var rafId = null;
            var mouseX = 0;
            var mouseY = 0;

            document.addEventListener('mousemove', function (e) {
                mouseX = e.clientX;
                mouseY = e.clientY;
                if (rafId) {
                    return;
                }
                rafId = requestAnimationFrame(function () {
                    rafId = null;
                    cards.forEach(function (card) {
                        if (card.matches(':hover')) {
                            return;
                        }
                        var rect = card.getBoundingClientRect();
                        var cx = rect.left + rect.width / 2;
                        var cy = rect.top + rect.height / 2;
                        var dx = (mouseX - cx) / (window.innerWidth / 2);
                        var dy = (mouseY - cy) / (window.innerHeight / 2);
                        var maxMove = 6;
                        var px = Math.max(-maxMove, Math.min(maxMove, dx * maxMove * 0.35));
                        var py = Math.max(-maxMove, Math.min(maxMove, dy * maxMove * 0.35));
                        card.style.transform = 'translate(' + px + 'px, ' + py + 'px)';
                    });
                });
            });

            cards.forEach(function (card) {
                card.addEventListener('mouseenter', function () {
                    card.style.transform = '';
                });
                card.addEventListener('mouseleave', function () {
                    card.style.transform = '';
                });
            });
        }

        function initAwardsParticles(section) {
            if (!section || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
                return;
            }
            var canvas = document.createElement('canvas');
            canvas.className = 'stw-awards-particles';
            canvas.setAttribute('aria-hidden', 'true');
            section.insertBefore(canvas, section.firstChild);

            var ctx = canvas.getContext('2d');
            var particles = [];
            var PARTICLE_COUNT = 42;

            function resize() {
                canvas.width = section.offsetWidth;
                canvas.height = section.offsetHeight;
            }
            resize();
            var resizeTimer;
            window.addEventListener('resize', function () {
                clearTimeout(resizeTimer);
                resizeTimer = setTimeout(resize, 200);
            });

            for (var i = 0; i < PARTICLE_COUNT; i++) {
                particles.push({
                    x: Math.random() * section.offsetWidth,
                    y: Math.random() * section.offsetHeight,
                    r: Math.random() * 1.6 + 0.4,
                    speed: Math.random() * 0.28 + 0.07,
                    opacity: Math.random() * 0.045 + 0.015,
                    drift: (Math.random() - 0.5) * 0.28,
                    phase: Math.random() * Math.PI * 2
                });
            }

            var frame = 0;
            function animate() {
                requestAnimationFrame(animate);
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                frame += 0.01;
                particles.forEach(function (p) {
                    p.y -= p.speed;
                    p.x += Math.sin(frame + p.phase) * p.drift;
                    if (p.y < -6) {
                        p.y = canvas.height + 6;
                        p.x = Math.random() * canvas.width;
                    }
                    ctx.beginPath();
                    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
                    ctx.fillStyle = 'rgba(212,175,55,' + p.opacity + ')';
                    ctx.fill();
                });
            }
            animate();
        }

        function ensureAwardsLightbox() {
            var awardsData = [
                {
                    title: 'Outstanding Achievement Award',
                    src: 'img/awards/WhatsApp Image 2026-07-20 at 5.16.07 PM (1).jpeg'
                },
                {
                    title: 'Excellence Award',
                    src: 'img/awards/WhatsApp Image 2026-07-20 at 5.16.07 PM (2).jpeg'
                },
                {
                    title: 'Certificate of Appreciation',
                    src: 'img/awards/WhatsApp Image 2026-07-20 at 5.16.07 PM (3).jpeg'
                }
            ];
            var currentIndex = 0;
            var zoomLevel = 1;
            var baseZoom = 1.65;

            var existingHost = document.querySelector('.stw-awards-lightbox');
            if (!existingHost) {
                var host = document.createElement('div');
                host.className = 'stw-awards-lightbox';
                host.setAttribute('role', 'dialog');
                host.setAttribute('aria-modal', 'true');
                host.setAttribute('aria-hidden', 'true');
                host.setAttribute('aria-labelledby', 'stwAwardsLightboxTitle');
                host.innerHTML =
                    '<div class="stw-awards-lightbox__overlay" aria-hidden="true"></div>' +
                    '<div class="stw-awards-lightbox__dialog">' +
                        '<button type="button" class="stw-awards-lightbox__close" aria-label="Close lightbox"><i class="fa fa-xmark" aria-hidden="true"></i></button>' +
                        '<button type="button" class="stw-awards-lightbox__nav stw-awards-lightbox__nav--prev" aria-label="Previous award"><i class="fa fa-chevron-left" aria-hidden="true"></i></button>' +
                        '<button type="button" class="stw-awards-lightbox__nav stw-awards-lightbox__nav--next" aria-label="Next award"><i class="fa fa-chevron-right" aria-hidden="true"></i></button>' +
                        '<span class="stw-awards-lightbox__counter" aria-live="polite">1 / ' + awardsData.length + '</span>' +
                        '<figure class="stw-awards-lightbox__figure">' +
                            '<div class="stw-awards-lightbox__media">' +
                                '<img class="stw-awards-lightbox__image" src="" alt="" loading="lazy">' +
                            '</div>' +
                            '<figcaption class="stw-awards-lightbox__meta">' +
                                '<h3 id="stwAwardsLightboxTitle"></h3>' +
                                '<p class="stw-awards-lightbox__hint">Double-click or scroll to zoom &bull; ESC to close &bull; \u2190\u2192 to navigate</p>' +
                            '</figcaption>' +
                        '</figure>' +
                    '</div>';
                document.body.appendChild(host);
                existingHost = host;
            }

            if (document.body.dataset.stwAwardsBound === 'true') {
                return;
            }

            var lightbox = existingHost;
            var lightboxImage = lightbox.querySelector('.stw-awards-lightbox__image');
            var lightboxTitle = lightbox.querySelector('#stwAwardsLightboxTitle');
            var closeButton = lightbox.querySelector('.stw-awards-lightbox__close');
            var prevButton = lightbox.querySelector('.stw-awards-lightbox__nav--prev');
            var nextButton = lightbox.querySelector('.stw-awards-lightbox__nav--next');
            var counter = lightbox.querySelector('.stw-awards-lightbox__counter');

            function setLightboxContent(index) {
                currentIndex = ((index % awardsData.length) + awardsData.length) % awardsData.length;
                var award = awardsData[currentIndex];
                lightboxImage.setAttribute('alt', award.title);
                lightboxImage.setAttribute('src', award.src);
                if (lightboxTitle) {
                    lightboxTitle.textContent = award.title;
                }
                if (counter) {
                    counter.textContent = (currentIndex + 1) + ' / ' + awardsData.length;
                }
                zoomLevel = 1;
                lightbox.classList.remove('is-zoomed');
                lightbox.style.setProperty('--lightbox-zoom', '1');
            }

            function openLightbox(index) {
                setLightboxContent(index);
                lightbox.classList.add('is-visible');
                lightbox.setAttribute('aria-hidden', 'false');
                document.documentElement.classList.add('stw-awards-lock');
                document.body.classList.add('stw-awards-lock');
                if (closeButton) {
                    closeButton.focus();
                }
            }

            function closeLightbox() {
                lightbox.classList.remove('is-visible', 'is-zoomed');
                lightbox.setAttribute('aria-hidden', 'true');
                document.documentElement.classList.remove('stw-awards-lock');
                document.body.classList.remove('stw-awards-lock');
                setTimeout(function () {
                    if (lightbox.getAttribute('aria-hidden') === 'true') {
                        lightboxImage.removeAttribute('src');
                    }
                }, 400);
            }

            document.addEventListener('click', function (event) {
                var trigger = event.target.closest('[data-award-trigger]');
                if (trigger) {
                    var idx = parseInt(trigger.getAttribute('data-award-index') || '0', 10);
                    openLightbox(idx);
                    return;
                }
                if (event.target.closest('.stw-awards-lightbox__close')) {
                    closeLightbox();
                    return;
                }
                if (event.target === lightbox.querySelector('.stw-awards-lightbox__overlay')) {
                    closeLightbox();
                    return;
                }
                if (event.target.closest('.stw-awards-lightbox__nav--prev')) {
                    setLightboxContent(currentIndex - 1);
                    return;
                }
                if (event.target.closest('.stw-awards-lightbox__nav--next')) {
                    setLightboxContent(currentIndex + 1);
                    return;
                }
            });

            lightboxImage.addEventListener('dblclick', function () {
                if (lightbox.classList.contains('is-zoomed')) {
                    zoomLevel = 1;
                    lightbox.classList.remove('is-zoomed');
                    lightbox.style.setProperty('--lightbox-zoom', '1');
                } else {
                    zoomLevel = baseZoom;
                    lightbox.classList.add('is-zoomed');
                    lightbox.style.setProperty('--lightbox-zoom', String(zoomLevel));
                }
            });

            lightboxImage.addEventListener('wheel', function (e) {
                if (lightbox.getAttribute('aria-hidden') === 'true') {
                    return;
                }
                e.preventDefault();
                var delta = e.deltaY < 0 ? 0.18 : -0.18;
                zoomLevel = Math.max(1, Math.min(4, zoomLevel + delta));
                if (zoomLevel <= 1.01) {
                    zoomLevel = 1;
                    lightbox.classList.remove('is-zoomed');
                } else {
                    lightbox.classList.add('is-zoomed');
                }
                lightbox.style.setProperty('--lightbox-zoom', String(zoomLevel.toFixed(2)));
            }, { passive: false });

            document.addEventListener('keydown', function (event) {
                if (lightbox.getAttribute('aria-hidden') === 'true') {
                    return;
                }
                if (event.key === 'Escape') {
                    closeLightbox();
                } else if (event.key === 'ArrowLeft') {
                    setLightboxContent(currentIndex - 1);
                } else if (event.key === 'ArrowRight') {
                    setLightboxContent(currentIndex + 1);
                }
            });

            document.body.dataset.stwAwardsBound = 'true';
        }

        function buildAwardsSectionMarkup() {
            var awards = [
                {
                    title: 'Outstanding Achievement Award',
                    src: 'img/awards/WhatsApp Image 2026-07-20 at 5.16.07 PM (1).jpeg'
                },
                {
                    title: 'Excellence Award',
                    src: 'img/awards/WhatsApp Image 2026-07-20 at 5.16.07 PM (2).jpeg'
                },
                {
                    title: 'Certificate of Appreciation',
                    src: 'img/awards/WhatsApp Image 2026-07-20 at 5.16.07 PM (3).jpeg'
                }
            ];

            var awardCards = awards.map(function (award, index) {
                var delay = (index + 1) * 150;
                var reflectDelay = (index * 2) + 's';
                return (
                    '<button type="button" class="stw-award-card stw-reveal-up"' +
                    ' data-award-trigger' +
                    ' data-award-index="' + index + '"' +
                    ' data-award-src="' + award.src + '"' +
                    ' data-award-title="' + award.title + '"' +
                    ' aria-label="View ' + award.title + ' fullscreen"' +
                    ' style="--stw-award-delay:' + delay + 'ms;--stw-reflect-delay:' + reflectDelay + '">' +
                        '<span class="stw-award-card__badge"><i class="fa fa-trophy" aria-hidden="true"></i>' + award.title + '</span>' +
                        '<span class="stw-award-card__media">' +
                            '<span class="stw-award-card__skeleton" aria-hidden="true"></span>' +
                            '<img src="' + award.src + '" alt="' + award.title + '" loading="lazy" decoding="async">' +
                        '</span>' +
                        '<span class="stw-award-card__meta">' +
                            '<span class="stw-award-card__title">' + award.title + '</span>' +
                            '<span class="stw-award-card__cta" aria-hidden="true"><i class="fa fa-magnifying-glass" aria-hidden="true"></i>View Fullscreen</span>' +
                        '</span>' +
                    '</button>'
                );
            }).join('');

            return (
                '<div class="stw-awards-shape stw-awards-shape--a" aria-hidden="true"></div>' +
                '<div class="stw-awards-shape stw-awards-shape--b" aria-hidden="true"></div>' +
                '<div class="stw-awards-shape stw-awards-shape--c" aria-hidden="true"></div>' +
                '<div class="container">' +
                    '<div class="stw-awards-shell">' +
                        '<div class="stw-awards-copy stw-reveal-up" style="--stw-award-delay:0ms">' +
                            '<span class="stw-awards-kicker"><i class="fa fa-trophy" aria-hidden="true"></i>Awards &amp; Recognition</span>' +
                            '<h2 class="stw-awards-title"><i class="fa fa-trophy" aria-hidden="true"></i><span>Awards &amp; Recognition</span></h2>' +
                            '<p class="stw-awards-subtitle stw-reveal-up" style="--stw-award-delay:180ms">Recognized for Excellence, Trusted Worldwide</p>' +
                            '<div class="stw-awards-divider stw-reveal-up" style="--stw-award-delay:260ms" aria-hidden="true"><span class="stw-awards-divider__icon"><i class="fa fa-star" aria-hidden="true"></i></span></div>' +
                            '<p class="stw-awards-description stw-reveal-up" style="--stw-award-delay:320ms">Silvora Talenza World LLC is proud to be recognized for excellence, professionalism, and outstanding service. These awards reflect our commitment to delivering trusted manpower recruitment, visa consultancy, business solutions, and exceptional customer service.</p>' +
                        '</div>' +
                        '<div class="stw-awards-grid">' + awardCards + '</div>' +
                        '<div class="stw-awards-stats">' +
                            '<article class="stw-award-stat stw-reveal-up" style="--stw-award-delay:120ms"><span class="stw-award-stat__icon"><i class="fa fa-star" aria-hidden="true"></i></span><strong>1000+</strong><span>Candidates Assisted</span><small>Award-winning delivery</small></article>' +
                            '<article class="stw-award-stat stw-reveal-up" style="--stw-award-delay:200ms"><span class="stw-award-stat__icon"><i class="fa fa-building" aria-hidden="true"></i></span><strong>50+</strong><span>Corporate Clients</span><small>Client confidence</small></article>' +
                            '<article class="stw-award-stat stw-reveal-up" style="--stw-award-delay:280ms"><span class="stw-award-stat__icon"><i class="fa fa-globe" aria-hidden="true"></i></span><strong>15+</strong><span>Countries Served</span><small>Global reach</small></article>' +
                            '<article class="stw-award-stat stw-reveal-up" style="--stw-award-delay:360ms"><span class="stw-award-stat__icon"><i class="fa fa-handshake" aria-hidden="true"></i></span><strong>Trusted</strong><span>UAE Consultancy</span><small>Relationship-first service</small></article>' +
                        '</div>' +
                    '</div>' +
                '</div>'
            );
        }

        var slider = document.getElementById('headerCarousel');
        if (slider && !slider.dataset.premiumHero) {
            slider.dataset.premiumHero = 'true';
            slider.classList.add('stw-video-carousel', 'carousel', 'slide', 'carousel-fade');
            slider.setAttribute('data-bs-ride', 'carousel');
            slider.setAttribute('data-bs-interval', '5200');
            slider.innerHTML = '<div class="carousel-inner">' +
                '<div class="carousel-item active"><div class="stw-slide"><video class="stw-hero-video" autoplay muted loop playsinline poster="img/index/architecture-ancient-monument-world-heritage-day-celebration.webp"><source src="https://cdn.coverr.co/videos/coverr-modern-office-building-1579/1080p.mp4" type="video/mp4"></video><img class="stw-hero-fallback" src="img/index/architecture-ancient-monument-world-heritage-day-celebration.webp" alt="Corporate Office" loading="eager"><div class="stw-slide-overlay"><h2>Corporate Office Operations</h2><p>Enterprise-ready advisory and execution from Dubai.</p></div></div></div>' +
                '<div class="carousel-item"><div class="stw-slide"><video class="stw-hero-video" autoplay muted loop playsinline poster="img/index/construction-works-frankfurt-downtown-germany.webp"><source src="https://cdn.coverr.co/videos/coverr-walking-through-construction-site-5177/1080p.mp4" type="video/mp4"></video><img class="stw-hero-fallback" src="img/index/construction-works-frankfurt-downtown-germany.webp" alt="Recruitment Process" loading="lazy"><div class="stw-slide-overlay"><h2>Recruitment Process Excellence</h2><p>Role matching, interviews, and onboarding governance.</p></div></div></div>' +
                '<div class="carousel-item"><div class="stw-slide"><video class="stw-hero-video" autoplay muted loop playsinline poster="img/index/photo-1731923508913-eba1fb7bd430.webp"><source src="https://cdn.coverr.co/videos/coverr-city-aerial-view-1576/1080p.mp4" type="video/mp4"></video><img class="stw-hero-fallback" src="img/index/photo-1731923508913-eba1fb7bd430.webp" alt="Business Setup" loading="lazy"><div class="stw-slide-overlay"><h2>Business Setup and PRO Execution</h2><p>Fast-track coordination with compliant documentation.</p></div></div></div>' +
            '</div><button class="carousel-control-prev" type="button" data-bs-target="#headerCarousel" data-bs-slide="prev"><span class="carousel-control-prev-icon" aria-hidden="true"></span><span class="visually-hidden">Previous</span></button><button class="carousel-control-next" type="button" data-bs-target="#headerCarousel" data-bs-slide="next"><span class="carousel-control-next-icon" aria-hidden="true"></span><span class="visually-hidden">Next</span></button>';

            if (window.location.protocol === 'file:') {
                slider.querySelectorAll('video source').forEach(function (source) {
                    source.removeAttribute('src');
                });
                slider.querySelectorAll('video').forEach(function (video) {
                    video.load();
                });
            }

            optimizeHeroVideos(slider);
        }

        if (!document.querySelector('.stw-home-enhancements')) {
            var heroHeader = document.querySelector('.hero-header');
            if (heroHeader) {
                var block = document.createElement('section');
                block.className = 'container-fluid py-5 stw-home-enhancements';
                block.innerHTML = '<div class="container"><div class="row g-4"><div class="col-lg-8"><div class="stw-card"><h2 class="h4 mb-3 english-text">Industries We Serve</h2><div class="stw-logo-track" data-logo-track data-logo-speed="0.65"><div class="stw-logo-track-row"><span><i class="fa fa-hard-hat"></i>Construction</span><span><i class="fa fa-hotel"></i>Hospitality</span><span><i class="fa fa-heartbeat"></i>Healthcare</span><span><i class="fa fa-truck"></i>Logistics</span><span><i class="fa fa-store"></i>Retail</span><span><i class="fa fa-industry"></i>Manufacturing</span><span><i class="fa fa-plane"></i>Aviation</span><span><i class="fa fa-building"></i>Facility Management</span><span><i class="fa fa-shield-alt"></i>Security</span><span><i class="fa fa-warehouse"></i>Warehousing</span></div></div><div class="row g-3 mt-2"><div class="col-md-6"><div class="stw-mini-card"><h3>Countries We Recruit From</h3><p>UAE, India, Pakistan, Nepal, Bangladesh, Sri Lanka, Philippines, Kenya</p></div></div><div class="col-md-6"><div class="stw-mini-card"><h3>Countries We Recruit To</h3><p>UAE, Saudi Arabia, Qatar, Oman, Bahrain, Romania, Poland, Croatia, Serbia, Portugal, Germany, Italy</p></div></div></div><div class="stw-world-map mt-3" aria-label="Recruitment coverage map"><span class="pin pin-uae"></span><span class="pin pin-europe"></span><span class="pin pin-asia"></span></div></div></div><div class="col-lg-4"><div class="stw-card"><h2 class="h5 mb-3 english-text">Achievements</h2><div class="stw-counter-grid"><div><strong data-counter-target="20" data-counter-suffix="+">0</strong><span>Years Experience</span></div><div><strong data-counter-target="0" data-counter-suffix="+">0</strong><span>Candidates Placed (Update)</span></div><div><strong data-counter-target="0" data-counter-suffix="+">0</strong><span>Corporate Clients (Update)</span></div><div><strong data-counter-target="25" data-counter-suffix="+">0</strong><span>Countries Served</span></div></div></div></div></div><div class="row g-4 mt-1"><div class="col-lg-4"><div class="stw-card"><h3 class="h6">Recruitment Process</h3><ol class="stw-timeline"><li>Demand Planning</li><li>Sourcing & Screening</li><li>Client Interviews</li><li>Offer Management</li><li>Deployment</li></ol></div></div><div class="col-lg-4"><div class="stw-card"><h3 class="h6">Visa Process</h3><ol class="stw-timeline"><li>Eligibility Review</li><li>Document Verification</li><li>Submission</li><li>Status Follow-up</li><li>Issuance Support</li></ol></div></div><div class="col-lg-4"><div class="stw-card"><h3 class="h6">Business Setup Process</h3><ol class="stw-timeline"><li>Advisory</li><li>License Path</li><li>Approvals</li><li>Registration</li><li>Operational Launch</li></ol></div></div></div><div class="row g-4 mt-1"><div class="col-lg-6"><div class="stw-card"><h3 class="h6">Featured Jobs</h3><p>Explore active openings with fast-track recruiter coordination.</p><a class="btn btn-outline-primary btn-sm" href="jobs.html">Browse Jobs</a></div></div><div class="col-lg-6"><div class="stw-card"><h3 class="h6">Latest Blogs</h3><p>Market updates, hiring trends, and practical migration insights.</p><a class="btn btn-outline-primary btn-sm" href="blogs.html">Read Blog</a></div></div></div><div class="row g-4 mt-1"><div class="col-lg-8"><div class="stw-card"><h3 class="h6">Frequently Asked Questions</h3><div class="accordion" id="homeFaq"><div class="accordion-item"><h4 class="accordion-header" id="homeFaqH1"><button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#homeFaqB1">Do you support end-to-end recruitment and visa coordination?</button></h4><div id="homeFaqB1" class="accordion-collapse collapse show" data-bs-parent="#homeFaq"><div class="accordion-body">Yes. Our teams coordinate sourcing, documentation, visa support, and onboarding workflows under one service framework.</div></div></div><div class="accordion-item"><h4 class="accordion-header" id="homeFaqH2"><button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#homeFaqB2">Can you support multilingual stakeholder communication?</button></h4><div id="homeFaqB2" class="accordion-collapse collapse" data-bs-parent="#homeFaq"><div class="accordion-body">Yes. English and Arabic communication models are available for candidate and corporate engagement.</div></div></div></div></div></div><div class="col-lg-4"><div class="stw-card stw-final-cta"><h3 class="h6">Start Your Corporate Consultation</h3><p>Connect with Silvora specialists for recruitment, visa, PRO, business setup, and digital execution.</p><a class="btn btn-primary btn-sm" href="contact.html">Book Consultation</a></div></div></div></div>';
                block.innerHTML = buildEnhancedHomeOverviewMarkup();
                heroHeader.insertAdjacentElement('afterend', block);
            }
        }

        if (!document.querySelector('.home-awards-section')) {
            var awardsAnchor = document.querySelector('.hero-header');
            if (awardsAnchor) {
                var awardsSection = document.createElement('section');
                awardsSection.className = 'container-fluid py-5 home-awards-section';
                awardsSection.innerHTML = buildAwardsSectionMarkup();
                awardsAnchor.insertAdjacentElement('afterend', awardsSection);
                bindAwardsReveal(awardsSection);
                bindAwardsImageLoading(awardsSection);
                initAwardsParticles(awardsSection);
                bindAwardsParallax(awardsSection);
            }
        }

        ensureAwardsLightbox();
    }

    function loadRecruitmentDemandConfig() {
        if (window.SilvoraRecruitmentDemand) {
            return Promise.resolve(window.SilvoraRecruitmentDemand);
        }

        return new Promise(function (resolve) {
            var script = document.createElement('script');
            script.src = 'js/demand-config.js';
            script.async = true;
            script.onload = function () {
                resolve(window.SilvoraRecruitmentDemand || null);
            };
            script.onerror = function () {
                resolve(null);
            };
            document.head.appendChild(script);
        });
    }

    function mountRecruitmentPopup(config) {
        if (!/^index\.html$/i.test(pageName)) {
            return;
        }

        var demand = config || window.SilvoraRecruitmentDemand;
        if (!demand || !demand.enabled) {
            return;
        }

        var cooldownMs = (demand.cooldownMinutes || 1) * 60 * 1000;
        if (document.querySelector('[data-stw-demand-popup]')) {
            return;
        }

        var ctaButtons = Array.isArray(demand.ctaButtons) ? demand.ctaButtons : [];
        var benefits = Array.isArray(demand.benefits) ? demand.benefits : [];
        var facts = Array.isArray(demand.quickFacts) ? demand.quickFacts : [];

        var overlay = document.createElement('div');
        overlay.className = 'stw-demand-overlay';
        overlay.setAttribute('data-stw-demand-popup', 'true');
        overlay.setAttribute('aria-hidden', 'true');

        var popup = document.createElement('section');
        popup.className = 'stw-demand-popup';
        popup.setAttribute('role', 'dialog');
        popup.setAttribute('aria-modal', 'true');
        popup.setAttribute('aria-labelledby', 'stwDemandPopupTitle');

        var benefitMarkup = benefits.map(function (benefit, index) {
            var iconClass = benefit.iconClass || 'fa fa-circle-check';
            return '<div class="stw-demand-benefit" style="--stw-delay:' + ((index + 1) * 90) + 'ms"><i class="' + iconClass + '" aria-hidden="true"></i><span>' + uiTranslate(benefit.label) + '</span></div>';
        }).join('');

        var factMarkup = facts.map(function (fact, index) {
            return '<div class="stw-demand-fact" style="--stw-delay:' + ((index + 1) * 70) + 'ms"><span>' + uiTranslate(fact.label) + '</span><strong>' + uiTranslate(fact.value) + '</strong></div>';
        }).join('');

        var ctaMarkup = ctaButtons.map(function (button, index) {
            var variant = button.variant || 'primary';
            var href = button.href || '#';
            return '<a class="btn stw-demand-btn stw-demand-btn--' + variant + '" style="--stw-delay:' + ((index + 1) * 110) + 'ms" href="' + href + '">' + uiTranslate(button.label) + '</a>';
        }).join('');

        popup.innerHTML = '<div class="stw-demand-popup-shell"><div class="stw-demand-popup-header"><div class="stw-demand-brand"><img src="img/TALENZA_logo_v2.png" alt="Silvora Talenza World Logo" loading="eager" decoding="async"><div><span class="stw-demand-badge"><i class="fa fa-fire" aria-hidden="true"></i> ' + uiTranslate('URGENT HIRING') + '</span><p>' + uiTranslate(demand.announcement || 'Latest overseas recruitment demand') + '</p></div></div><button type="button" class="stw-demand-close" aria-label="' + uiTranslate('Close recruitment popup') + '"><i class="fa fa-xmark"></i></button></div><div class="stw-demand-popup-body"><div class="stw-demand-copy"><h2 id="stwDemandPopupTitle">' + uiTranslate(demand.title) + '</h2><p class="stw-demand-subtitle">' + uiTranslate(demand.subtitle) + '</p><div class="stw-demand-poster-wrap"><img class="stw-demand-poster" src="' + demand.poster + '" alt="' + uiTranslate(demand.posterAlt) + '" loading="lazy" decoding="async"></div><div class="stw-demand-benefits">' + benefitMarkup + '</div><div class="stw-demand-facts">' + factMarkup + '</div><div class="stw-demand-ctas">' + ctaMarkup + '</div></div></div><div class="stw-demand-footer"><span><i class="fa fa-phone"></i>' + demand.contact.phone + '</span><span><i class="fa fa-envelope"></i>' + demand.contact.email + '</span><span><i class="fa fa-globe"></i>' + demand.contact.website + '</span></div></div>';

        document.body.appendChild(overlay);
        document.body.appendChild(popup);

        var repeatTimer = null;
        var scheduleRepeat = function () {
            if (!/^index\.html$/i.test(pageName)) {
                return;
            }

            if (repeatTimer) {
                window.clearTimeout(repeatTimer);
            }

            repeatTimer = window.setTimeout(function () {
                mountRecruitmentPopup(demand);
            }, cooldownMs);
        };

        var openTimer = window.setTimeout(function () {
            overlay.classList.add('is-visible');
            popup.classList.add('is-visible');
            overlay.setAttribute('aria-hidden', 'false');
            document.body.classList.add('stw-demand-lock');
            document.documentElement.classList.add('stw-demand-lock');
            var closeButton = popup.querySelector('.stw-demand-close');
            if (closeButton) {
                closeButton.focus();
            }
        }, Math.max(0, demand.delayMs || 1000));

        var closePopup = function () {
            window.clearTimeout(openTimer);
            if (repeatTimer) {
                window.clearTimeout(repeatTimer);
            }
            overlay.classList.remove('is-visible');
            popup.classList.remove('is-visible');
            overlay.setAttribute('aria-hidden', 'true');
            document.body.classList.remove('stw-demand-lock');
            document.documentElement.classList.remove('stw-demand-lock');

            window.setTimeout(function () {
                overlay.remove();
                popup.remove();
                document.removeEventListener('keydown', onKeyDown);
                scheduleRepeat();
            }, 260);
        };

        var onKeyDown = function (event) {
            if (event.key === 'Escape') {
                closePopup();
            }
        };

        overlay.addEventListener('click', function (e) {
            closePopup();
            // If the click was over an award card, trigger it after the overlay finishes closing
            if (document.elementsFromPoint) {
                var elements = document.elementsFromPoint(e.clientX, e.clientY);
                var card = null;
                for (var i = 0; i < elements.length; i++) {
                    if (elements[i] !== overlay && elements[i].hasAttribute && elements[i].hasAttribute('data-award-trigger')) {
                        card = elements[i];
                        break;
                    }
                    // Also check ancestors of each element
                    var ancestor = elements[i].closest ? elements[i].closest('[data-award-trigger]') : null;
                    if (ancestor && ancestor !== overlay) {
                        card = ancestor;
                        break;
                    }
                }
                if (card) {
                    var capturedCard = card;
                    window.setTimeout(function () {
                        capturedCard.click();
                    }, 320);
                }
            }
        });
        popup.querySelector('.stw-demand-close').addEventListener('click', closePopup);
        document.addEventListener('keydown', onKeyDown);
    }

    applyEnterpriseMicroInteractions();
    enablePageTransitions();
    mountPremiumJobsPage();
    upgradeHomepageExperience();

    if (/^index\.html$/i.test(pageName)) {
        whenIdle(function () {
            loadRecruitmentDemandConfig().then(function (config) {
                mountRecruitmentPopup(config);
            });
        }, 2600);
    }

    function addFormFeedback(form) {
        var feedback = form.querySelector('.form-feedback');
        if (!feedback) {
            feedback = document.createElement('div');
            feedback.className = 'form-feedback';
            feedback.setAttribute('aria-live', 'polite');
            form.appendChild(feedback);
        }
        return feedback;
    }

    function validatePhoneField(phoneInput) {
        if (!phoneInput) {
            return true;
        }

        var value = phoneInput.value.trim();
        if (value === '') {
            phoneInput.setCustomValidity('');
            return true;
        }

        var phonePattern = /^[+0-9()\-\s]{7,20}$/;
        var isValid = phonePattern.test(value);
        phoneInput.setCustomValidity(isValid ? '' : uiTranslate('Please enter a valid phone or WhatsApp number.'));
        return isValid;
    }

    function validateDocumentsField(documentsInput) {
        if (!documentsInput) {
            return true;
        }

        var maxFiles = 5;
        var allowedExtensions = ['pdf', 'png', 'jpg', 'jpeg'];
        var files = Array.from(documentsInput.files || []);
        var invalidExtension = files.some(function (file) {
            var ext = file.name.split('.').pop().toLowerCase();
            return allowedExtensions.indexOf(ext) === -1;
        });

        if (files.length > maxFiles) {
            documentsInput.setCustomValidity(uiTranslate('Please upload up to 5 files only.'));
            return false;
        }

        if (invalidExtension) {
            documentsInput.setCustomValidity(uiTranslate('Please upload PDF, PNG, JPG, or JPEG files only.'));
            return false;
        }

        documentsInput.setCustomValidity('');
        return true;
    }

    function getSectionByHeadingText(text) {
        var headings = Array.from(document.querySelectorAll('h1, h2, h3, h4, h5, h6'));
        var match = headings.find(function (heading) {
            return heading.textContent.trim() === text;
        });

        if (!match) {
            return null;
        }

        return match.closest('section') || match.closest('.container-fluid') || match.closest('.container');
    }

    var navbars = document.querySelectorAll('.navbar');

    navbars.forEach(function (navbar) {
        // Remove deprecated navbar controls when present.
        navbar.querySelectorAll('a[href*="manpower-request"], a[href*="request-manpower"], button[data-bs-target="#manpowerRequestModal"], .request-manpower, .request-manpower-btn').forEach(function (node) {
            var wrapper = node.closest('.nav-item, .btn, .nav-utilities, li') || node;
            wrapper.remove();
        });

        navbar.querySelectorAll('.nav-search, .search-input, .search-btn, input[type="search"], button[aria-label*="Search" i], button[title*="Search" i]').forEach(function (node) {
            var wrapper = node.closest('.nav-item, form, .input-group, .nav-utilities, li') || node;
            wrapper.remove();
        });

        // Add labels for keyboard and screen-reader clarity.
        navbar.querySelectorAll('.nav-link').forEach(function (link) {
            if (!link.getAttribute('aria-label')) {
                link.setAttribute('aria-label', 'Go to ' + link.textContent.trim());
            }
        });
    });

    // Add labels to icon-only controls for improved accessibility.
    document.querySelectorAll('a.btn-social, a.btn-square, .topbar a, .whatsapp-float, .back-to-top').forEach(function (link) {
        if (!link.getAttribute('aria-label')) {
            var icon = link.querySelector('i');
            var fallback = (link.getAttribute('title') || '').trim() || (icon ? icon.className.replace(/\s+/g, ' ') : '').trim() || 'Link';
            link.setAttribute('aria-label', fallback);
        }
    });

    document.querySelectorAll('form[action="contact.php"], form[action="manpower-request.php"], form[action="lib/PHPMailer/smtp-contact.php"], form[data-contact-form]').forEach(function (form) {
        if (!form.querySelector('input[name="_website"]')) {
            var hp = document.createElement('input');
            hp.type = 'text';
            hp.name = '_website';
            hp.tabIndex = -1;
            hp.autocomplete = 'off';
            hp.setAttribute('aria-hidden', 'true');
            hp.style.position = 'absolute';
            hp.style.left = '-9999px';
            form.appendChild(hp);
        }

        if (!form.querySelector('input[name="_ts"]')) {
            var ts = document.createElement('input');
            ts.type = 'hidden';
            ts.name = '_ts';
            ts.value = Math.floor(Date.now() / 1000).toString();
            form.appendChild(ts);
        }

        var phoneInput = form.querySelector('input[name="phone"]');
        var documentsInput = form.querySelector('input[name="documents[]"]');
        var feedback = addFormFeedback(form);

        if (phoneInput) {
            phoneInput.setAttribute('inputmode', 'tel');
            phoneInput.setAttribute('pattern', '[+0-9()\\-\\s]{7,20}');
            phoneInput.setAttribute('autocomplete', 'tel');
            phoneInput.addEventListener('input', function () {
                validatePhoneField(phoneInput);
            });
        }

        if (documentsInput) {
            documentsInput.addEventListener('change', function () {
                validateDocumentsField(documentsInput);
            });
        }

        form.addEventListener('submit', function (event) {
            if (form.dataset.submitting === 'true') {
                event.preventDefault();
                return;
            }

            var phoneValid = validatePhoneField(phoneInput);
            var documentsValid = validateDocumentsField(documentsInput);
            var submitButton = form.querySelector('button[type="submit"], input[type="submit"]');

            if (!form.checkValidity() || !phoneValid || !documentsValid) {
                event.preventDefault();
                feedback.textContent = uiTranslate('Please complete all required fields and correct any invalid email, phone, or file inputs before submitting.');
                feedback.classList.add('is-error');
                feedback.classList.remove('is-success');
                if (submitButton) {
                    submitButton.disabled = false;
                }
                form.dataset.submitting = 'false';
                return;
            }

            form.dataset.submitting = 'true';
            if (submitButton) {
                if (!submitButton.dataset.originalLabel) {
                    submitButton.dataset.originalLabel = submitButton.innerHTML;
                }
                submitButton.disabled = true;
                submitButton.innerHTML = '<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>' + uiTranslate('Sending...');
            }

            feedback.textContent = uiTranslate('Submitting your enquiry...');
            feedback.classList.add('is-success');
            feedback.classList.remove('is-error');

            window.setTimeout(function () {
                if (form.dataset.submitting !== 'true') {
                    return;
                }
                form.dataset.submitting = 'false';
                if (submitButton && submitButton.dataset.originalLabel) {
                    submitButton.disabled = false;
                    submitButton.innerHTML = submitButton.dataset.originalLabel;
                }
            }, 15000);
        });
    });

    // Improve image loading defaults for better performance.
    document.querySelectorAll('img').forEach(function (img) {
        var isCriticalVisual = !!img.closest('.carousel-item.active, .navbar-brand, .hero-header');
        if (!img.hasAttribute('loading')) {
            img.setAttribute('loading', isCriticalVisual ? 'eager' : 'lazy');
        }
        if (!img.hasAttribute('decoding')) {
            img.setAttribute('decoding', 'async');
        }
        if (isCriticalVisual && !img.hasAttribute('fetchpriority')) {
            img.setAttribute('fetchpriority', 'high');
        }
    });

    // Enforce production copy standard by avoiding placeholder strings in rendered forms.
    document.querySelectorAll('[placeholder]').forEach(function (field) {
        field.removeAttribute('placeholder');
    });

    // Mobile menu state, scroll lock, and auto-close after navigation.
    var navbarCollapse = document.getElementById('navbarCollapse');
    if (navbarCollapse && window.bootstrap) {
        var collapseApi = window.bootstrap.Collapse.getInstance(navbarCollapse);
        if (!collapseApi) {
            collapseApi = new window.bootstrap.Collapse(navbarCollapse, { toggle: false });
        }

        navbarCollapse.addEventListener('show.bs.collapse', function () {
            document.body.classList.add('no-scroll', 'mobile-nav-open');
        });

        navbarCollapse.addEventListener('hide.bs.collapse', function () {
            document.body.classList.remove('no-scroll', 'mobile-nav-open');
        });

        navbarCollapse.querySelectorAll('.nav-link').forEach(function (link) {
            link.addEventListener('click', function () {
                if (window.innerWidth < 992 && navbarCollapse.classList.contains('show')) {
                    collapseApi.hide();
                }
            });
        });

        document.addEventListener('keydown', function (event) {
            if (event.key === 'Escape' && navbarCollapse.classList.contains('show')) {
                collapseApi.hide();
            }
        });
    }

    // Animate KPI counters when they enter viewport.
    var counters = document.querySelectorAll('[data-counter-target]');
    if ('IntersectionObserver' in window && counters.length > 0) {
        var counterObserver = new IntersectionObserver(function (entries, observer) {
            entries.forEach(function (entry) {
                if (!entry.isIntersecting) {
                    return;
                }

                var el = entry.target;
                var target = parseInt(el.getAttribute('data-counter-target'), 10) || 0;
                var suffix = el.getAttribute('data-counter-suffix') || '';
                var duration = 1200;
                var start = performance.now();

                function tick(now) {
                    var progress = Math.min((now - start) / duration, 1);
                    var eased = 1 - Math.pow(1 - progress, 3);
                    var value = Math.floor(target * eased);
                    el.textContent = value.toLocaleString() + suffix;
                    if (progress < 1) {
                        window.requestAnimationFrame(tick);
                    }
                }

                window.requestAnimationFrame(tick);
                observer.unobserve(el);
            });
        }, { threshold: 0.35 });

        counters.forEach(function (counter) {
            counterObserver.observe(counter);
        });
    }

    // Auto-scrolling content tracks with pause on hover.
    document.querySelectorAll('[data-auto-track], [data-logo-track]').forEach(function (track) {
        var paused = false;
        var inViewport = true;
        var speed = parseFloat(track.getAttribute('data-track-speed') || track.getAttribute('data-logo-speed') || '0.55');

        track.addEventListener('mouseenter', function () {
            paused = true;
        });
        track.addEventListener('mouseleave', function () {
            paused = false;
        });

        function animate() {
            if (!paused && inViewport && !document.hidden) {
                track.scrollLeft += speed;
                if (track.scrollLeft >= track.scrollWidth - track.clientWidth - 2) {
                    track.scrollLeft = 0;
                }
            }
            window.requestAnimationFrame(animate);
        }

        if ('IntersectionObserver' in window) {
            var trackObserver = new IntersectionObserver(function (entries) {
                entries.forEach(function (entry) {
                    inViewport = entry.isIntersecting;
                });
            }, { threshold: 0.1 });
            trackObserver.observe(track);
        }

        window.requestAnimationFrame(animate);
    });

    // Homepage ordering and legacy section cleanup.
    if (/index\.html$/i.test(window.location.pathname) || /\/$/i.test(window.location.pathname)) {
        var sectionByHeading = function (heading) {
            return getSectionByHeadingText(heading);
        };

        var orderedSections = [
            document.querySelector('.process-home-section'),
            document.querySelector('.stats-section'),
            document.querySelector('.home-awards-section'),
            sectionByHeading('Industries We Serve'),
            sectionByHeading('Countries We Recruit From'),
            sectionByHeading('Countries We Recruit For'),
            sectionByHeading('Recruitment Process Timeline'),
            document.querySelector('.home-services-section'),
            document.querySelector('.trusted-by-section'),
            document.querySelector('.testimonials-section'),
            document.querySelector('.latest-jobs-section'),
            document.querySelector('.home-blogs-section'),
            document.querySelector('.home-contact-section'),
            document.querySelector('.final-cta-section')
        ].filter(Boolean);

        var footer = document.querySelector('.footer');
        var projectsSection = getSectionByHeadingText('Recent Projects');

        if (projectsSection) {
            projectsSection.remove();
        }

        if (footer && orderedSections.length > 0) {
            var footerParent = footer.parentNode;

            orderedSections.forEach(function (section) {
                if (section && footerParent && section !== footer) {
                    footerParent.insertBefore(section, footer);
                }
            });
        }
    }

    // Add production-ready business information to each footer.
    document.querySelectorAll('.footer').forEach(function (footer) {
        var footerRow = footer.querySelector('.container.py-5 .row.g-5');
        if (!footerRow) {
            return;
        }

        footer.querySelectorAll('.col-md-6.col-lg-3').forEach(function (column) {
            var heading = column.querySelector('h5');
            if (!heading || heading.textContent.trim() !== 'Get In Touch' || column.querySelector('[data-office-hours]')) {
                return;
            }

            var officeHours = document.createElement('div');
            officeHours.className = 'footer-office-hours';
            officeHours.setAttribute('data-office-hours', 'true');
            officeHours.innerHTML = '<p class="mb-2"><i class="fa fa-clock me-3"></i><strong>Office Hours</strong></p><p class="mb-1 ps-4">Monday - Saturday</p><p class="mb-1 ps-4">10:00 AM - 8:00 PM</p><p class="mb-0 ps-4">Sunday: Closed</p>';
            column.appendChild(officeHours);
        });

        if (!footer.querySelector('[data-company-info-panel]')) {
            var companyPanelCol = document.createElement('div');
            companyPanelCol.className = 'col-12';
            companyPanelCol.innerHTML = '<div class="company-info-panel" data-company-info-panel="true"><div class="company-info-panel__head"><h5 class="text-white mb-2">Company Information</h5><div class="arabic-text text-white" dir="rtl">معلومات الشركة</div></div><div class="company-info-list"><div><span>Company Name</span><strong>Silvora Talenza World LLC</strong></div><div><span>Business Type</span><strong>HR Consultancy | Manpower Supply | Visa Services | PRO Services | Business Setup | Digital Solutions</strong></div><div><span>Office Hours</span><strong>Monday - Saturday, 10:00 AM - 8:00 PM | Sunday: Closed</strong></div><div><span>Contact Number</span><strong><a href="tel:+971585895827">+971 58 589 5827</a></strong></div><div><span>Email Address</span><strong><a href="mailto:info@silvoratalenzaworld.com">info@silvoratalenzaworld.com</a></strong></div><div><span>Website</span><strong><a href="https://www.silvoratalenzaworld.com" target="_blank" rel="noopener">www.silvoratalenzaworld.com</a></strong></div></div><div class="footer-verified-badges"><span>UAE Registered Company</span><span>Global Recruitment</span><span>Visa Assistance</span><span>Business Consultancy</span><span>Digital Solutions</span></div></div>';
            footerRow.appendChild(companyPanelCol);
        }

        var popularLinkCol = Array.from(footerRow.querySelectorAll('.col-md-6.col-lg-3')).find(function (col) {
            var heading = col.querySelector('h5');
            return heading && /popular link/i.test(heading.textContent.trim());
        });

        if (popularLinkCol && !popularLinkCol.querySelector('[data-footer-link-groups]')) {
            var footerGroups = document.createElement('div');
            footerGroups.className = 'footer-link-groups';
            footerGroups.setAttribute('data-footer-link-groups', 'true');
            footerGroups.innerHTML = '<h6>Core Services</h6><div class="link-row"><a href="service-jobs.html">Manpower Services</a><a href="service-visa.html">Visa Services</a><a href="service-pro.html">PRO Services</a><a href="service-company.html">Business Setup</a><a href="service-web-development.html">Website &amp; Software Development</a><a href="service-digital-marketing.html">Digital Marketing</a></div><h6>Policies</h6><div class="link-row"><a href="privacy-policy.html">Privacy Policy</a><a href="terms-and-conditions.html">Terms &amp; Conditions</a><a href="cookie-policy.html">Cookie Policy</a><a href="sitemap.xml">Sitemap</a></div>';
            popularLinkCol.appendChild(footerGroups);
        }
    });

    // Insert premium UAE Pride section above each footer across the website.
    document.querySelectorAll('.footer').forEach(function (footer) {
        if (!footer || footer.previousElementSibling && footer.previousElementSibling.matches('[data-uae-pride]')) {
            return;
        }

        var prideSection = document.createElement('section');
        prideSection.className = 'stw-uae-pride stw-uae-pride-reveal';
        prideSection.setAttribute('data-uae-pride', 'true');
        prideSection.setAttribute('aria-label', 'Proudly Serving the United Arab Emirates');
        prideSection.innerHTML = '<div class="container px-lg-5"><div class="stw-uae-pride-shell"><span class="stw-uae-gold-line" aria-hidden="true"></span><div class="row g-4 g-lg-5 align-items-center"><div class="col-lg-5"><div class="stw-uae-media"><div class="stw-uae-flag-stage" aria-hidden="true"><div class="stw-uae-flag-pole"></div><div class="stw-uae-flag-shadow"></div><div class="stw-uae-flag"><span class="stw-uae-flag-band stw-uae-flag-band--red"></span><span class="stw-uae-flag-bands"><span class="stw-uae-flag-band stw-uae-flag-band--green"></span><span class="stw-uae-flag-band stw-uae-flag-band--white"></span><span class="stw-uae-flag-band stw-uae-flag-band--black"></span></span><span class="stw-uae-flag-gloss"></span><span class="stw-uae-flag-fabric"></span></div></div></div></div><div class="col-lg-7"><div class="stw-uae-content"><p class="stw-uae-badge mb-3">🇦🇪 United Arab Emirates</p><h3 class="stw-uae-title mb-3">Proudly Serving the United Arab Emirates</h3><p class="stw-uae-copy mb-0 english-text">Driven by excellence and inspired by the UAE\'s vision, Silvora Talenza World LLC is committed to delivering trusted manpower, recruitment, visa, PRO, business setup, and digital solutions that help businesses grow and professionals succeed.</p><p class="stw-uae-copy mb-0 arabic-text" dir="rtl">انطلاقًا من التميز واستلهامًا لرؤية دولة الإمارات، تلتزم سيلفورا تالينزا وورلد ذ.م.م بتقديم حلول موثوقة في الموارد البشرية والتوظيف والتأشيرات وخدمات PRO وتأسيس الأعمال والحلول الرقمية لدعم نمو الأعمال ونجاح المهنيين.</p><a class="btn btn-outline-primary stw-uae-btn" href="service.html">Explore Our Services</a></div></div></div></div></div>';
        footer.parentNode.insertBefore(prideSection, footer);
    });

    var prideBlocks = document.querySelectorAll('.stw-uae-pride-reveal');
    if (prideBlocks.length > 0) {
        var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        var activatePrideBlock = function (block) {
            if (block.classList.contains('is-visible')) {
                return;
            }
            block.classList.add('is-visible');
        };

        var fallbackBlocks = Array.prototype.slice.call(prideBlocks);
        var fallbackTicking = false;
        var runFallbackReveal = function () {
            if (fallbackTicking) {
                return;
            }

            fallbackTicking = true;
            window.requestAnimationFrame(function () {
                fallbackBlocks = fallbackBlocks.filter(function (block) {
                    var rect = block.getBoundingClientRect();
                    var inView = rect.top < window.innerHeight * 0.96 && rect.bottom > window.innerHeight * 0.04;
                    if (inView) {
                        activatePrideBlock(block);
                        return false;
                    }
                    return true;
                });

                if (fallbackBlocks.length === 0) {
                    window.removeEventListener('scroll', runFallbackReveal);
                    window.removeEventListener('resize', runFallbackReveal);
                }

                fallbackTicking = false;
            });
        };

        if (prefersReducedMotion || !('IntersectionObserver' in window)) {
            prideBlocks.forEach(function (block) {
                activatePrideBlock(block);
            });
        } else {
            var prideObserver = new IntersectionObserver(function (entries, observer) {
                entries.forEach(function (entry) {
                    if (!entry.isIntersecting) {
                        return;
                    }

                    activatePrideBlock(entry.target);
                    observer.unobserve(entry.target);
                });
            }, { threshold: 0.08, rootMargin: '0px 0px -4% 0px' });

            prideBlocks.forEach(function (block) {
                prideObserver.observe(block);
            });

            window.addEventListener('scroll', runFallbackReveal, { passive: true });
            window.addEventListener('resize', runFallbackReveal);
            runFallbackReveal();
        }
    }

    // Clients page trust layer without fabricated reviews/certifications.
    if (/clients\.html$/i.test(pageName)) {
        var clientsRoot = document.querySelector('.inner-page-content');
        var clientLogosGrid = clientsRoot ? clientsRoot.querySelector('.row.g-4.justify-content-center') : null;
        if (clientsRoot && !clientsRoot.querySelector('[data-client-success-grid]') && !clientsRoot.querySelector('.client-success-grid')) {
            var trustSection = document.createElement('section');
            trustSection.className = 'client-success-section mt-5';
            trustSection.setAttribute('data-client-success-section', 'true');
            trustSection.innerHTML = '<div class="client-success-shell"><div class="client-success-header"><div class="section-title client-success-title mb-0 text-start text-lg-start"><h2>Client Success & Trust Signals</h2><p class="mb-0">Verified indicators of consistency, service scope, and delivery quality.</p></div><span class="client-success-kicker"><i class="fa fa-badge-check"></i> Operational assurance</span></div><div class="client-success-grid" data-client-success-grid="true"><article class="client-success-card"><div class="client-success-icon"><i class="fa fa-check"></i></div><h3>Transparent Delivery</h3><p>Structured communication, clear timelines, and accountable handover practices across projects.</p><ul><li>Defined milestones</li><li>Clear ownership</li></ul></article><article class="client-success-card"><div class="client-success-icon"><i class="fa fa-globe"></i></div><h3>Global Service Reach</h3><p>Operational support for clients and candidates across multiple countries and industries.</p><ul><li>Multi-market support</li><li>Cross-sector experience</li></ul></article><article class="client-success-card"><div class="client-success-icon"><i class="fa fa-shield-halved"></i></div><h3>Compliance Focused</h3><p>Service workflows designed around local regulation alignment and documented process controls.</p><ul><li>Process controls</li><li>Local alignment</li></ul></article></div><div class="client-success-strip"><div><strong>Service confidence</strong><span>Built around reliable execution and transparent communication.</span></div><div><strong>Scope breadth</strong><span>Covering manpower, PRO, visa, business setup, and digital services.</span></div><div><strong>Delivery discipline</strong><span>Clear handovers, documented steps, and consistent response quality.</span></div></div></div>';
            if (clientLogosGrid) {
                clientsRoot.insertBefore(trustSection, clientLogosGrid);
            } else {
                clientsRoot.appendChild(trustSection);
            }
        }
    }

    // Contact page conversion support details.
    if (/contact\.html$/i.test(pageName)) {
        var companyInfoCard = document.getElementById('contact-business-card');
        if (companyInfoCard && !document.querySelector('[data-contact-assurance]')) {
            var assuranceCard = document.createElement('div');
            assuranceCard.className = 'contact-assurance';
            assuranceCard.setAttribute('data-contact-assurance', 'true');
            assuranceCard.innerHTML = '<h5 class="mb-3 text-primary">Response & Support</h5><div class="item"><i class="fa fa-clock"></i><div><strong>Office Hours</strong><p class="mb-0">Monday - Saturday: 10:00 AM - 8:00 PM<br>Sunday: Closed</p></div></div><div class="item"><i class="fa fa-comment-dots"></i><div><strong>WhatsApp Support</strong><p class="mb-0"><a href="https://wa.me/971585895827" target="_blank" rel="noopener">Chat with our team instantly</a></p></div></div><div class="item"><i class="fa fa-hourglass-half"></i><div><strong>Response Time</strong><p class="mb-0">We typically respond within one business day.</p></div></div>';
            companyInfoCard.insertAdjacentElement('afterend', assuranceCard);
        }
    }

    // Improve default image attributes to reduce layout shift.
    document.querySelectorAll('img').forEach(function (img) {
        if (!img.hasAttribute('alt')) {
            img.setAttribute('alt', 'Silvora Talenza World visual');
        }

        if (!img.hasAttribute('fetchpriority') && img.closest('.hero-header, .carousel-item')) {
            img.setAttribute('fetchpriority', 'high');
        }
    });

    if (window.SilvoraI18n && typeof window.SilvoraI18n.init === 'function') {
        window.SilvoraI18n.init().finally(function () {
            bindHeaderOffsetObservers();
            window.setTimeout(applyHeaderOffsetSpacing, 0);
        });
    } else {
        bindHeaderOffsetObservers();
    }
});

