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

var SilvoraI18n = (function () {
    var storageKey = 'language';
    var resourcePaths = {
        en: 'locales/en/translation.json',
        ar: 'locales/ar/translation.json'
    };
    var currentLanguage = 'en';
    var resources = null;
    var observer = null;
    var initializationPromise = null;
    var cdnSource = 'https://cdn.jsdelivr.net/npm/i18next@23.12.2/dist/umd/i18next.min.js';

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
        }
    };

    function sanitizeLanguage(language) {
        return language === 'ar' ? 'ar' : 'en';
    }

    function getCurrentPageName() {
        var pathName = window.location.pathname.toLowerCase();
        var pageName = pathName.split('/').pop() || 'index.html';
        return pageName;
    }

    function getStoredLanguage() {
        var queryLanguage = new URLSearchParams(window.location.search).get('lang');
        var storedLanguage = '';

        try {
            storedLanguage = window.localStorage.getItem(storageKey) || '';
        } catch (error) {
            storedLanguage = '';
        }

        return sanitizeLanguage(queryLanguage || storedLanguage || document.documentElement.getAttribute('lang') || 'en');
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
        return fetch(path, { cache: 'no-cache' }).then(function (response) {
            if (!response.ok) {
                throw new Error('Failed to load ' + path);
            }

            return response.json();
        });
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
            t: function (key) {
                var bundle = this.resources && this.resources[this.language] && this.resources[this.language].translation;
                if (bundle && Object.prototype.hasOwnProperty.call(bundle, key)) {
                    return bundle[key];
                }

                return key;
            }
        };
    }

    function translate(key) {
        if (!window.i18next || typeof window.i18next.t !== 'function') {
            return key;
        }

        return window.i18next.t(key);
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

                node.nodeValue = currentLanguage === 'ar' ? originalText.replace(trimmedText, translate(lookupText)) : originalText;
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

                if (currentLanguage === 'ar') {
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

            if (currentLanguage === 'ar') {
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

            node.nodeValue = currentLanguage === 'ar' ? translate(originalText) : originalText;
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
            switcher.querySelectorAll('[data-language], a[lang], button[lang]').forEach(function (control) {
                var controlLanguage = sanitizeLanguage(control.getAttribute('data-language') || control.getAttribute('lang'));
                var isActive = controlLanguage === currentLanguage;
                control.classList.toggle('is-active', isActive);
                control.setAttribute('aria-pressed', isActive ? 'true' : 'false');
            });
        });
    }

    function updateUrl(language) {
        var url = new URL(window.location.href);
        if (language === 'en') {
            url.searchParams.delete('lang');
        } else {
            url.searchParams.set('lang', 'ar');
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
        var meta = pageMeta[language] || pageMeta.en;
        var baseUrl = window.location.origin + window.location.pathname;

        document.title = meta.title;

        setMeta('meta[name="description"]', 'content', meta.description);
        setMeta('meta[name="keywords"]', 'content', language === 'ar' ? 'سيلفورا تالينزا وورلد، دبي، الإمارات العربية المتحدة' : 'Silvora Talenza World, Dubai, UAE');
        setMeta('meta[property="og:title"]', 'content', meta.title);
        setMeta('meta[property="og:description"]', 'content', meta.description);
        setMeta('meta[property="og:locale"]', 'content', language === 'ar' ? 'ar_AE' : 'en_US');
        setMeta('meta[property="og:url"]', 'content', baseUrl + (language === 'ar' ? '?lang=ar' : ''));
        setMeta('meta[name="twitter:title"]', 'content', meta.title);
        setMeta('meta[name="twitter:description"]', 'content', meta.description);

        var canonical = document.querySelector('link[rel="canonical"]');
        if (!canonical) {
            canonical = document.createElement('link');
            canonical.rel = 'canonical';
            document.head.appendChild(canonical);
        }
        canonical.setAttribute('href', baseUrl);

        var hreflangEn = document.querySelector('link[rel="alternate"][hreflang="en"]');
        if (!hreflangEn) {
            hreflangEn = document.createElement('link');
            hreflangEn.setAttribute('rel', 'alternate');
            hreflangEn.setAttribute('hreflang', 'en');
            document.head.appendChild(hreflangEn);
        }
        hreflangEn.setAttribute('href', baseUrl);

        var hreflangAr = document.querySelector('link[rel="alternate"][hreflang="ar"]');
        if (!hreflangAr) {
            hreflangAr = document.createElement('link');
            hreflangAr.setAttribute('rel', 'alternate');
            hreflangAr.setAttribute('hreflang', 'ar');
            document.head.appendChild(hreflangAr);
        }
        hreflangAr.setAttribute('href', baseUrl + '?lang=ar');
    }

    function syncDocumentLanguage(language) {
        document.documentElement.setAttribute('lang', language);
        document.documentElement.setAttribute('dir', language === 'ar' ? 'rtl' : 'ltr');
        document.body.classList.toggle('lang-ar', language === 'ar');
        document.body.classList.toggle('lang-en', language === 'en');
    }

    function attachLanguageControls() {
        document.querySelectorAll('.language-switcher [data-language], .language-switcher a[lang], .language-switcher button[lang]').forEach(function (control) {
            control.addEventListener('click', function (event) {
                event.preventDefault();
                applyLanguage(sanitizeLanguage(control.getAttribute('data-language') || control.getAttribute('lang')));
            });
        });
    }

    function ensureLanguageSwitcher() {
        var existingSwitcher = document.querySelector('.language-switcher');
        if (existingSwitcher) {
            existingSwitcher.querySelectorAll('a[lang], button[lang]').forEach(function (control) {
                control.setAttribute('data-language', sanitizeLanguage(control.getAttribute('data-language') || control.getAttribute('lang')));
            });
            return;
        }

        var floatingSwitcher = document.createElement('div');
        floatingSwitcher.className = 'lang-switcher-floating';
        floatingSwitcher.innerHTML = '<div class="language-switcher" aria-label="Language switcher"><button type="button" data-language="en">EN</button><span aria-hidden="true">/</span><button type="button" data-language="ar" dir="rtl">العربية</button></div>';
        document.body.appendChild(floatingSwitcher);
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

        try {
            window.localStorage.setItem(storageKey, currentLanguage);
        } catch (error) {
            // Local storage may be unavailable in some contexts.
        }

        syncDocumentLanguage(currentLanguage);
        updateUrl(currentLanguage);
        updateSeo(currentLanguage);
        updateBilingualVisibility();
        localizeTree(document.body);
        localizeSharedControls();
        updateLanguageSwitcher();
    }

    function observeMutations() {
        if (!('MutationObserver' in window) || observer) {
            return;
        }

        observer = new MutationObserver(function (mutations) {
            mutations.forEach(function (mutation) {
                Array.prototype.forEach.call(mutation.addedNodes, function (node) {
                    if (node.nodeType === 1) {
                        registerBilingualPairs(node);
                        localizeTree(node);
                    }
                });
            });

            updateBilingualVisibility();
            updateLanguageSwitcher();
        });

        observer.observe(document.body, { childList: true, subtree: true });
    }

    function init() {
        if (initializationPromise) {
            return initializationPromise;
        }

        document.querySelectorAll('.topbar').forEach(function (topbar) {
            topbar.remove();
        });

        removeDuplicateNodes('#manpowerRequestModal');

        currentLanguage = getStoredLanguage();
        ensureLanguageSwitcher();
        attachLanguageControls();
        syncDocumentLanguage(currentLanguage);

        initializationPromise = loadScript(cdnSource)
            .catch(function () {
                return null;
            })
            .then(function () {
                return Promise.all([
                    loadJson(resourcePaths.en),
                    loadJson(resourcePaths.ar)
                ]);
            })
            .then(function (loadedResources) {
                resources = {
                    en: { translation: loadedResources[0] },
                    ar: { translation: loadedResources[1] }
                };

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
                if (!window.i18next || typeof window.i18next.init !== 'function') {
                    window.i18next = createFallbackI18n({
                        en: { translation: {} },
                        ar: { translation: {} }
                    });
                }

                return window.i18next.init({
                    lng: currentLanguage,
                    fallbackLng: 'en',
                    resources: {
                        en: { translation: {} },
                        ar: { translation: {} }
                    },
                    interpolation: { escapeValue: false },
                    returnEmptyString: false,
                    returnNull: false,
                    keySeparator: false,
                    nsSeparator: false
                });
            })
            .then(function () {
                registerBilingualPairs(document);
                applyLanguage(currentLanguage);
                observeMutations();
                return window.i18next;
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
        phoneInput.setCustomValidity(isValid ? '' : 'Please enter a valid phone or WhatsApp number.');
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
            documentsInput.setCustomValidity('Please upload up to 5 files only.');
            return false;
        }

        if (invalidExtension) {
            documentsInput.setCustomValidity('Please upload PDF, PNG, JPG, or JPEG files only.');
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

    document.querySelectorAll('form[action="contact.php"], form[data-contact-form]').forEach(function (form) {
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
            var phoneValid = validatePhoneField(phoneInput);
            var documentsValid = validateDocumentsField(documentsInput);

            if (!form.checkValidity() || !phoneValid || !documentsValid) {
                event.preventDefault();
                feedback.textContent = 'Please complete all required fields and correct any invalid email, phone, or file inputs before submitting.';
                feedback.classList.add('is-error');
                feedback.classList.remove('is-success');
                return;
            }

            feedback.textContent = 'Submitting your enquiry...';
            feedback.classList.add('is-success');
            feedback.classList.remove('is-error');
        });
    });

    // Improve image loading defaults for better performance.
    document.querySelectorAll('img').forEach(function (img, index) {
        if (!img.hasAttribute('loading')) {
            img.setAttribute('loading', index < 3 ? 'eager' : 'lazy');
        }
        if (!img.hasAttribute('decoding')) {
            img.setAttribute('decoding', 'async');
        }
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
        var speed = parseFloat(track.getAttribute('data-track-speed') || track.getAttribute('data-logo-speed') || '0.55');

        track.addEventListener('mouseenter', function () {
            paused = true;
        });
        track.addEventListener('mouseleave', function () {
            paused = false;
        });

        function animate() {
            if (!paused) {
                track.scrollLeft += speed;
                if (track.scrollLeft >= track.scrollWidth - track.clientWidth - 2) {
                    track.scrollLeft = 0;
                }
            }
            window.requestAnimationFrame(animate);
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
            footerGroups.innerHTML = '<h6>Recruitment Services</h6><div class="link-row"><a href="service-jobs.html">Recruitment Services</a><a href="service-visa.html">Visa Services</a><a href="service-pro.html">PRO Services</a><a href="service-company.html">Business Setup</a><a href="service-digital.html">Digital Solutions</a></div><h6>Policies</h6><div class="link-row"><a href="privacy-policy.html">Privacy Policy</a><a href="terms-and-conditions.html">Terms &amp; Conditions</a><a href="cookie-policy.html">Cookie Policy</a><a href="sitemap.xml">Sitemap</a></div>';
            popularLinkCol.appendChild(footerGroups);
        }
    });

    // Clients page trust layer without fabricated reviews/certifications.
    if (/clients\.html$/i.test(pageName)) {
        var clientsRoot = document.querySelector('.inner-page-content');
        if (clientsRoot && !clientsRoot.querySelector('[data-client-success-grid]') && !clientsRoot.querySelector('.client-success-grid')) {
            var trustSection = document.createElement('section');
            trustSection.className = 'mt-5';
            trustSection.innerHTML = '<div class="section-title text-center mb-4"><h2>Client Success & Trust Signals</h2><p class="mb-0">Verified indicators of consistency, service scope, and delivery quality.</p></div><div class="client-success-grid" data-client-success-grid="true"><article class="client-success-card"><h3><i class="fa fa-check-circle text-primary me-2"></i>Transparent Delivery</h3><p class="mb-0">Structured communication, clear timelines, and accountable handover practices across projects.</p></article><article class="client-success-card"><h3><i class="fa fa-globe text-primary me-2"></i>Global Service Reach</h3><p class="mb-0">Operational support for clients and candidates across multiple countries and industries.</p></article><article class="client-success-card"><h3><i class="fa fa-shield-alt text-primary me-2"></i>Compliance Focused</h3><p class="mb-0">Service workflows designed around local regulation alignment and documented process controls.</p></article></div>';
            clientsRoot.appendChild(trustSection);
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
        window.SilvoraI18n.init();
    }
});

