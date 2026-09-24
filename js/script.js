/* =========================================================
   Hemat Energi, Selamatkan Bumi — Fase 1
   Interaksi sederhana: menu mobile & reveal section
   ========================================================= */

document.addEventListener("DOMContentLoaded", function () {
  // ---- Toggle menu navigasi (mobile) ----
  const navToggle = document.querySelector(".nav-toggle");
  const navLinks = document.querySelector(".nav-links");

  if (navToggle && navLinks) {
    navToggle.addEventListener("click", function () {
      const isOpen = navLinks.classList.toggle("is-open");
      navToggle.setAttribute("aria-expanded", String(isOpen));
    });

    // Tutup menu setelah salah satu link diklik (mobile)
    navLinks.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        navLinks.classList.remove("is-open");
        navToggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  // ---- Animasi masuk section (sangat subtle) ----
  const revealEls = document.querySelectorAll(".reveal");

  if ("IntersectionObserver" in window && revealEls.length > 0) {
    const observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );

    revealEls.forEach(function (el) {
      observer.observe(el);
    });
  } else {
    // Fallback: tampilkan langsung
    revealEls.forEach(function (el) {
      el.classList.add("is-visible");
    });
  }

  // ---- Tahun otomatis pada footer ----
  const yearEl = document.querySelector("[data-year]");
  if (yearEl) {
    yearEl.textContent = String(new Date().getFullYear());
  }
});
