const gridItems = document.querySelectorAll('.container div');

const observerOptions = {
  threshold: 0.3
};

const observer = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      // Apply stagger delay
      gridItems.forEach((item, index) => {
        setTimeout(() => {
          item.classList.add('show');
        }, index * 500); // 150ms between each item
      });
      observer.disconnect(); // stop observing after animation
    }
  });
}, observerOptions);

gridItems.forEach(item => observer.observe(item));