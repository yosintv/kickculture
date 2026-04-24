(function () {
  const toggle = document.querySelector(".menu-toggle");
  const closeBtn = document.querySelector(".menu-close");
  const nav = document.querySelector(".nav");

  if (!toggle || !closeBtn || !nav) return;

  function openMenu() {
    nav.classList.add("open");
    document.body.classList.add("menu-open");
  }

  function closeMenu() {
    nav.classList.remove("open");
    document.body.classList.remove("menu-open");
  }

  toggle.addEventListener("click", openMenu);
  closeBtn.addEventListener("click", closeMenu);

  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  window.addEventListener("resize", function () {
    if (window.innerWidth > 740) closeMenu();
  });
})();
