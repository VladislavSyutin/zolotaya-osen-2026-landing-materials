// Progressive enhancement: all information remains visible without JavaScript.
const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
let observer;
function updateMotion() {
  observer?.disconnect();
  document.querySelectorAll('.is-revealed').forEach(element => element.classList.remove('is-revealed'));
  if (motionPreference.matches || !('IntersectionObserver' in window)) return;
  observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-revealed');
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.12 });
  document.querySelectorAll('.reveal').forEach(element => observer.observe(element));
}
updateMotion();
motionPreference.addEventListener('change', updateMotion);
