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
    
})(jQuery);

document.addEventListener('DOMContentLoaded', function () {
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
        // Ensure language switcher is present on right side.
        var collapse = navbar.querySelector('.navbar-collapse');
        var existingLang = navbar.querySelector('.language-switcher, .nav-language');
        if (collapse && !existingLang) {
            var navUtils = document.createElement('div');
            navUtils.className = 'nav-utilities d-flex align-items-center ms-lg-4';
            navUtils.innerHTML = '<div class="language-switcher nav-language" aria-label="Language switcher"><a href="#" lang="en">EN</a> / <a href="#" lang="ar" dir="rtl">العربية</a></div>';
            collapse.appendChild(navUtils);
        }

        // Add labels for keyboard and screen-reader clarity.
        navbar.querySelectorAll('.nav-link').forEach(function (link) {
            if (!link.getAttribute('aria-label')) {
                link.setAttribute('aria-label', 'Go to ' + link.textContent.trim());
            }
        });

        navbar.querySelectorAll('.nav-language a[href="#"], .language-switcher a[href="#"]').forEach(function (link) {
            link.setAttribute('aria-disabled', 'true');
            link.setAttribute('tabindex', '-1');
            link.addEventListener('click', function (event) {
                event.preventDefault();
            });
        });
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
        var orderedSections = [
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
    });
});

