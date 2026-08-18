const backToTop = document.getElementById('back-to-top');

if (backToTop) {
  const toggleVisibility = () => {
    if (window.scrollY > 300) {
      backToTop.hidden = false;
      requestAnimationFrame(() => {
        backToTop.style.opacity = '1';
        backToTop.style.transform = 'translateY(0)';
      });
    } else {
      backToTop.style.opacity = '0';
      backToTop.style.transform = 'translateY(20px)';
      setTimeout(() => {
        if (window.scrollY <= 300) backToTop.hidden = true;
      }, 300);
    }
  };

  backToTop.style.opacity = '0';
  backToTop.style.transform = 'translateY(20px)';
  backToTop.style.transition = 'opacity 0.3s ease, transform 0.3s ease';

  window.addEventListener('scroll', toggleVisibility, { passive: true });

  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  toggleVisibility();
}