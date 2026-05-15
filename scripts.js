// =========================================
// ESCOLA PRISMA - INTERAÇÕES FRONT-END
// =========================================

document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Efeito de Sombra e Redução no Header ao fazer scroll
    const header = document.querySelector('.header');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.style.padding = '10px 0';
            header.style.boxShadow = '0 4px 20px rgba(0,0,0,0.08)';
        } else {
            header.style.padding = '15px 0';
            header.style.boxShadow = '0 1px 0px rgba(0,0,0,0.05)';
        }
    });

    // 2. Smooth Scroll para links internos (Âncoras)
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            // Ignorar links do WhatsApp
            if (this.getAttribute('href') === '#whatsapp') return;
            
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                // Considera a altura do header fixo (aprox 80px)
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

    // 3. Efeito de Aparecimento (Fade in na Rolagem) - Opcional para dar toque premium
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

    // Aplicar CSS de estado inicial e observar elementos
    const elementsToAnimate = document.querySelectorAll('.feature-card, .fase-card, .eco-item, .depoimento-card');
    
    elementsToAnimate.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
        observer.observe(el);
    });
});
