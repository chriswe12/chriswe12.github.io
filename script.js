const yearElement = document.querySelector("[data-year]");

if (yearElement) {
  yearElement.textContent = String(new Date().getFullYear());
}

const navLinks = Array.from(document.querySelectorAll(".nav-link[data-target]"));
const sections = navLinks
  .map((link) => document.getElementById(link.dataset.target))
  .filter(Boolean);

if (navLinks.length && sections.length) {
  const setActive = (id) => {
    navLinks.forEach((link) => {
      link.classList.toggle("is-active", link.dataset.target === id);
    });
  };

  const observer = new IntersectionObserver(
    (entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

      if (visible) {
        setActive(visible.target.id);
      }
    },
    { rootMargin: "-20% 0px -55%", threshold: [0.1, 0.35, 0.6] }
  );

  sections.forEach((section) => observer.observe(section));
  setActive(sections[0].id);
}
