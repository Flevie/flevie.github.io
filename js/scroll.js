const banner = document.querySelector('.banner');
const bannerContent = document.querySelector('.banner-content');
const arrow = document.getElementById('scrollArrow');

let hasScrolled = false;
let isSnapping = false;

// === Fade-in entrance animation ===
window.addEventListener('load', () => {
  bannerContent.classList.remove('hidden');
  bannerContent.classList.add('fade-in');
});

// === Scroll behavior ===
window.addEventListener('scroll', () => {
  if (isSnapping) return; // avoid double-triggering

  const scrollY = window.scrollY;
  const fadeStart = 0;
  const fadeEnd = window.innerHeight / 1.5;

  // Fade out banner content
  const opacity = 1 - (scrollY - fadeStart) / (fadeEnd - fadeStart);
  bannerContent.style.opacity = Math.max(opacity, 0);

  // Parallax background
  banner.style.backgroundPositionY = `${scrollY * 0.5}px`;

  // Auto-scroll past banner when scrolling down
  if (!hasScrolled && scrollY > 50) {
    hasScrolled = true;
    isSnapping = true;
    window.scrollTo({
      top: window.innerHeight,
      behavior: 'smooth'
    });
    setTimeout(() => (isSnapping = false), 800);
  }

  // Snap back when scrolling up
  if (hasScrolled && scrollY < window.innerHeight / 2) {
    hasScrolled = false;
    isSnapping = true;
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
    setTimeout(() => (isSnapping = false), 800);
  }
});

// === Clickable arrow scroll ===
arrow.addEventListener('click', () => {
  isSnapping = true;
  window.scrollTo({
    top: window.innerHeight,
    behavior: 'smooth'
  });
  hasScrolled = true;
  setTimeout(() => (isSnapping = false), 800);
});