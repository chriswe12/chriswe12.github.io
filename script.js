const yearElement = document.querySelector("[data-year]");

if (yearElement) {
  yearElement.textContent = String(new Date().getFullYear());
}
