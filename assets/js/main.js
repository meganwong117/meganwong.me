/* meganwong.me — progressive enhancement only.
   Everything here is optional; the site is fully readable without it. */

(function () {
  "use strict";

  var root = document.documentElement;
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  /* ---- Theme toggle ---------------------------------------------------
     The stored preference is applied by the inline script in <head> to
     avoid a flash. Here we only wire up the button. */

  var toggle = document.querySelector("[data-theme-toggle]");

  if (toggle) {
    toggle.addEventListener("click", function () {
      var systemDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      var current = root.getAttribute("data-theme");
      var isDark = current ? current === "dark" : systemDark;
      var next = isDark ? "light" : "dark";

      root.setAttribute("data-theme", next);
      toggle.setAttribute("aria-label", "Switch to " + (next === "dark" ? "light" : "dark") + " theme");

      try {
        localStorage.setItem("theme", next);
      } catch (e) {
        /* Private browsing or storage disabled — theme just won't persist. */
      }
    });
  }

  /* ---- Header shadow on scroll ---------------------------------------- */

  var header = document.querySelector("[data-header]");

  if (header) {
    var setHeaderState = function () {
      header.classList.toggle("is-scrolled", window.scrollY > 8);
    };

    setHeaderState();
    window.addEventListener("scroll", setHeaderState, { passive: true });
  }

  /* ---- Mobile nav ------------------------------------------------------ */

  var navToggle = document.querySelector("[data-nav-toggle]");
  var navList = document.querySelector("[data-nav-list]");

  if (navToggle && navList) {
    var closeNav = function () {
      navList.classList.remove("is-open");
      navToggle.setAttribute("aria-expanded", "false");
    };

    navToggle.addEventListener("click", function () {
      var open = navToggle.getAttribute("aria-expanded") === "true";
      navList.classList.toggle("is-open", !open);
      navToggle.setAttribute("aria-expanded", String(!open));
    });

    /* Close after picking a destination */
    navList.addEventListener("click", function (event) {
      if (event.target.closest("a")) closeNav();
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape") closeNav();
    });

    /* Reset state if the viewport grows past the mobile breakpoint */
    window.matchMedia("(min-width: 40em)").addEventListener("change", closeNav);
  }

  /* ---- Reveal on scroll ------------------------------------------------ */

  var revealables = document.querySelectorAll("[data-reveal]");

  if (revealables.length) {
    if (!("IntersectionObserver" in window) || reduceMotion.matches) {
      revealables.forEach(function (el) {
        el.classList.add("is-visible");
      });
    } else {
      var revealObserver = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (!entry.isIntersecting) return;
            entry.target.classList.add("is-visible");
            revealObserver.unobserve(entry.target);
          });
        },
        { rootMargin: "0px 0px -10% 0px", threshold: 0.05 }
      );

      revealables.forEach(function (el) {
        revealObserver.observe(el);
      });
    }
  }

  /* ---- Nav highlight for the section in view --------------------------- */

  var sectionLinks = Array.prototype.slice.call(
    document.querySelectorAll('[data-nav-list] a[href^="#"]')
  );

  if (sectionLinks.length && "IntersectionObserver" in window) {
    var linkFor = {};
    var sections = [];

    sectionLinks.forEach(function (link) {
      var id = link.getAttribute("href").slice(1);
      var section = id && document.getElementById(id);
      if (!section) return;
      linkFor[id] = link;
      sections.push(section);
    });

    var clearCurrent = function () {
      sectionLinks.forEach(function (link) {
        link.removeAttribute("aria-current");
      });
    };

    var sectionObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          var link = linkFor[entry.target.id];
          if (!link) return;
          clearCurrent();
          link.setAttribute("aria-current", "true");
        });
      },
      /* Band across the upper-middle of the viewport, so the highlight
         changes as a section takes over the reading position. */
      { rootMargin: "-25% 0px -65% 0px", threshold: 0 }
    );

    sections.forEach(function (section) {
      sectionObserver.observe(section);
    });
  }

  /* ---- Print button (CV page) ------------------------------------------ */

  var printButton = document.querySelector("[data-print]");
  if (printButton) {
    printButton.addEventListener("click", function () {
      window.print();
    });
  }

  /* ---- Current year in the footer -------------------------------------- */

  var yearEl = document.querySelector("[data-year]");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());
})();
