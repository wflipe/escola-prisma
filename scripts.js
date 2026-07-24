// =========================================
// ESCOLA PRISMA - INTERAÇÕES FRONT-END
// =========================================

document.addEventListener('DOMContentLoaded', () => {

    const header = document.querySelector('.header');
    const topBar = document.querySelector('.top-bar');
    const hamburger = document.querySelector('.hamburger');
    const mobileMenu = document.querySelector('.mobile-menu');
    const mobileOverlay = document.querySelector('.mobile-overlay');

    // =========================================
    // 1. TOP BAR: Esconder ao rolar + Header ajuste
    // =========================================

    let lastScrollY = 0;
    let topBarHeight = topBar ? topBar.offsetHeight : 40;
    let topBarHidden = false;

    function updateHeaderPosition(hidden) {
        topBarHidden = hidden;
        if (hidden) {
            topBar.style.transform = 'translateY(-100%)';
            header.style.top = '0';
        } else {
            topBar.style.transform = 'translateY(0)';
            header.style.top = topBarHeight + 'px';
        }
    }

    window.addEventListener('scroll', () => {
        const currentScrollY = window.scrollY;

        // Header shrink effect
        if (currentScrollY > 50) {
            header.style.padding = '10px 0';
            header.style.boxShadow = '0 4px 20px rgba(0,0,0,0.08)';
        } else {
            header.style.padding = '15px 0';
            header.style.boxShadow = '0 1px 0px rgba(0,0,0,0.05)';
        }

        // Top bar hide/show
        if (currentScrollY > topBarHeight) {
            updateHeaderPosition(true);
        } else {
            updateHeaderPosition(false);
        }

        lastScrollY = currentScrollY;
    }, { passive: true });

    // =========================================
    // 2. MENU MOBILE (Hamburger)
    // =========================================

    function openMenu() {
        hamburger.classList.add('active');
        mobileMenu.classList.add('active');
        mobileOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeMenu() {
        hamburger.classList.remove('active');
        mobileMenu.classList.remove('active');
        mobileOverlay.classList.remove('active');
        document.body.style.overflow = '';
    }

    if (hamburger) {
        hamburger.addEventListener('click', () => {
            if (mobileMenu.classList.contains('active')) {
                closeMenu();
            } else {
                openMenu();
            }
        });
    }

    if (mobileOverlay) {
        mobileOverlay.addEventListener('click', closeMenu);
    }

    // Fechar menu ao clicar em qualquer link interno
    const mobileLinks = document.querySelectorAll('.mobile-menu a');
    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            closeMenu();
        });
    });

    // =========================================
    // 3. SMOOTH SCROLL para links internos
    // =========================================

    const links = document.querySelectorAll('a[href^="#"]');

    links.forEach(link => {
        link.addEventListener('click', function (e) {
            if (this.getAttribute('href') === '#whatsapp') return;
            if (this.getAttribute('href') === '#') return;

            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                const headerOffset = 80;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // =========================================
    // 4. FADE IN na rolagem (Intersection Observer)
    // =========================================

    const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const elementsToAnimate = document.querySelectorAll('.feature-card, .fase-card, .eco-item, .depoimento-card');

    elementsToAnimate.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
        observer.observe(el);
    });

    // =========================================
    // 5. BACK TO TOP BUTTON
    // =========================================
    const backToTopBtn = document.getElementById('back-to-top');

    if (backToTopBtn) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
                backToTopBtn.classList.add('visible');
            } else {
                backToTopBtn.classList.remove('visible');
            }
        });

        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // =========================================
    // 6. HERO SLIDER
    // =========================================
    const slides = document.querySelectorAll('.hero-slides .slide');
    const dots = document.querySelectorAll('.slider-dots .dot');
    const prevBtn = document.querySelector('.slider-btn.prev');
    const nextBtn = document.querySelector('.slider-btn.next');
    let currentSlide = 0;
    let slideInterval;

    if (slides.length > 0) {
        function showSlide(index) {
            slides.forEach(slide => slide.classList.remove('active'));
            dots.forEach(dot => dot.classList.remove('active'));

            currentSlide = (index + slides.length) % slides.length;

            slides[currentSlide].classList.add('active');
            if (dots[currentSlide]) dots[currentSlide].classList.add('active');
        }

        function nextSlide() {
            showSlide(currentSlide + 1);
        }

        function prevSlide() {
            showSlide(currentSlide - 1);
        }

        function startSlideTimer() {
            slideInterval = setInterval(nextSlide, 5000); // Muda a cada 5 segundos
        }

        function resetSlideTimer() {
            clearInterval(slideInterval);
            startSlideTimer();
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                nextSlide();
                resetSlideTimer();
            });
        }

        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                prevSlide();
                resetSlideTimer();
            });
        }

        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                showSlide(index);
                resetSlideTimer();
            });
        });

        // Inicia o timer automaticamente
        startSlideTimer();
    }
});
