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
    
    // Simple Talenza search assistant (front-end only)
    window.openTalenzaAssistant = function () {
        var input = document.getElementById('aiSearchInput');
        var query = input ? input.value.trim().toLowerCase() : '';

        var title = 'Talenza Assistant';
        var greeting = 'Hello! I\'m your Talenza HR World assistant. I can share information about our services and our company.';
        var answer = '';

        if (!query) {
            answer = 'You can ask things like "career advisory", "visa services", "company formation", or "about Talenza".';
        } else if (query.includes('career') || query.includes('job') || query.includes('cv')) {
            answer = 'Talenza HR World offers Career Advisory services including CV refinement, interview preparation, and job search support across Dubai and the wider UAE.';
        } else if (query.includes('visa') || query.includes('golden') || query.includes('green card')) {
            answer = 'Our Visa Services team supports Golden Visa, Green Card, employment, family, and visit visas, along with end-to-end PRO assistance for documentation and approvals.';
        } else if (query.includes('education') || query.includes('abroad')) {
            answer = 'Through our Abroad Education services, we help you shortlist universities, prepare applications, and manage study visa processes from Dubai to international destinations.';
        } else if (query.includes('pro') || query.includes('government')) {
            answer = 'Our PRO & Government Services cover trade license support, labour and immigration formalities, document attestation, and ongoing corporate compliance.';
        } else if (query.includes('real estate') || query.includes('property')) {
            answer = 'Talenza HR World provides Real Estate support for buying, selling, and renting properties in Dubai and the UAE with a focus on transparent, compliant transactions.';
        } else if (query.includes('digital') || query.includes('marketing') || query.includes('web')) {
            answer = 'We offer Digital Marketing and Web Design services to help businesses build a strong online presence through SEO, social media, and corporate websites.';
        } else if (query.includes('company formation') || query.includes('business setup') || query.includes('free zone') || query.includes('mainland')) {
            answer = 'Our Company Formation services guide you through choosing the right structure (mainland or free zone), obtaining licenses, and handling documentation so you can start operations smoothly.';
        } else if (query.includes('immigration')) {
            answer = 'With our Immigration Services, we support UAE and international relocation, handling documentation, eligibility guidance, and process coordination.';
        } else if (query.includes('about') || query.includes('talenza') || query.includes('hr world') || query.includes('company')) {
            answer = 'Talenza HR World is a Dubai-based consultancy offering HR, PRO, visa, education, real estate, and company formation services, focused on transparent, long-term partnerships.';
        } else {
            answer = 'I could not match your question to a specific service, but Talenza HR World covers Career Advisory, Visa & PRO, Real Estate, Education Abroad, Digital Marketing, Company Formation, and Immigration. Try searching with one of these keywords.';
        }

        var modalTitle = document.getElementById('assistantModalLabel');
        var modalBody = document.getElementById('assistantModalBody');
        if (modalTitle && modalBody && window.bootstrap) {
            modalTitle.textContent = title;
            modalBody.innerHTML = '<p>' + greeting + '</p><p class="mb-0">' + answer + '</p>';
            var modalEl = document.getElementById('assistantModal');
            var modal = new window.bootstrap.Modal(modalEl);
            modal.show();
        } else {
            alert(greeting + '\n\n' + answer);
        }
    };
    
})(jQuery);

