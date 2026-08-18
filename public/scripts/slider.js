const slider = document.getElementById('heroSlider');
if (!slider) return;

const slides = slider.querySelectorAll('.slide');
const prevBtn = slider.querySelector('[data-prev]');
const nextBtn = slider.querySelector('[data-next]');
const dots = slider.querySelectorAll('.dot');

let currentIndex = 0;
let autoPlayInterval: number;

function showSlide(index: number) {
  slides.forEach((slide, i) => {
    slide.classList.toggle('active', i === index);
  });
  dots.forEach((dot, i) => {
    dot.classList.toggle('active', i === index);
    dot.setAttribute('aria-selected', i === index ? 'true' : 'false');
  });
  currentIndex = index;
}

function nextSlide() {
  const next = (currentIndex + 1) % slides.length;
  showSlide(next);
}

function prevSlide() {
  const prev = (currentIndex - 1 + slides.length) % slides.length;
  showSlide(prev);
}

function startAutoPlay() {
  autoPlayInterval = window.setInterval(nextSlide, 5000);
}

function stopAutoPlay() {
  clearInterval(autoPlayInterval);
}

prevBtn?.addEventListener('click', () => {
  stopAutoPlay();
  prevSlide();
  startAutoPlay();
});

nextBtn?.addEventListener('click', () => {
  stopAutoPlay();
  nextSlide();
  startAutoPlay();
});

dots.forEach((dot, index) => {
  dot.addEventListener('click', () => {
    stopAutoPlay();
    showSlide(index);
    startAutoPlay();
  });
});

slider.addEventListener('mouseenter', stopAutoPlay);
slider.addEventListener('mouseleave', startAutoPlay);

let touchStartX = 0;
slider.addEventListener('touchstart', (e) => {
  touchStartX = e.changedTouches[0].screenX;
}, { passive: true });

slider.addEventListener('touchend', (e) => {
  const touchEndX = e.changedTouches[0].screenX;
  const diff = touchStartX - touchEndX;
  if (Math.abs(diff) > 50) {
    stopAutoPlay();
    diff > 0 ? nextSlide() : prevSlide();
    startAutoPlay();
  }
}, { passive: true });

showSlide(0);
startAutoPlay();