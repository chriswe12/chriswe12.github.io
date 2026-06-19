const yearElement = document.querySelector("[data-year]");

if (yearElement) {
  yearElement.textContent = String(new Date().getFullYear());
}

document.querySelectorAll(".project-card").forEach((card) => {
  card.addEventListener("focusin", () => {
    card.classList.add("is-focused");
  });

  card.addEventListener("focusout", () => {
    card.classList.remove("is-focused");
  });
});
