document.documentElement.classList.add("is-js");

(() => {
  const header = document.querySelector("[data-site-header]");
  const menuToggle = document.querySelector("[data-site-menu-toggle]");
  const navigation = document.querySelector("[data-site-navigation]");
  const menuLabel = menuToggle?.querySelector(".sr-only");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  const syncHeader = () => {
    header?.classList.toggle("is-scrolled", window.scrollY > 18);
  };

  const setMenuOpen = (isOpen) => {
    if (!menuToggle || !navigation) return;
    menuToggle.setAttribute("aria-expanded", String(isOpen));
    navigation.classList.toggle("is-open", isOpen);
    if (menuLabel) menuLabel.textContent = isOpen ? "关闭导航" : "打开导航";
  };

  syncHeader();
  window.addEventListener("scroll", syncHeader, { passive: true });

  menuToggle?.addEventListener("click", () => {
    setMenuOpen(menuToggle.getAttribute("aria-expanded") !== "true");
  });

  navigation?.addEventListener("click", (event) => {
    if (event.target.closest("a")) setMenuOpen(false);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && menuToggle?.getAttribute("aria-expanded") === "true") {
      setMenuOpen(false);
      menuToggle.focus();
    }
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 980) setMenuOpen(false);
  });

  const revealItems = [...document.querySelectorAll(".reveal")];
  if (reducedMotion.matches || !("IntersectionObserver" in window)) {
    revealItems.forEach((item) => item.classList.add("is-visible"));
    return;
  }

  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    { rootMargin: "0px 0px -7% 0px", threshold: 0.08 },
  );

  revealItems.forEach((item) => revealObserver.observe(item));
})();
