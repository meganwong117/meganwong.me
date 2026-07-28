/* meganwong.me — progressive enhancement only.
   Deliberately minimal: no scroll observers, no reveal animation, no
   header scroll state. The layout is static by design. */

(function () {
  "use strict";

  var root = document.documentElement;

  /* ---- Theme toggle ----------------------------------------------------
     The stored preference is applied by the inline script in <head> to
     avoid a flash. Here we wire the button and keep its label honest. */

  var toggle = document.querySelector("[data-theme-toggle]");
  var toggleLabel = document.querySelector("[data-theme-label]");

  var isDark = function () {
    var explicit = root.getAttribute("data-theme");
    if (explicit) return explicit === "dark";
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  };

  /* The button always names the mode it will switch you *to*. */
  var syncToggle = function () {
    if (!toggle) return;
    var next = isDark() ? "Light" : "Dark";
    if (toggleLabel) toggleLabel.textContent = next;
    toggle.setAttribute("aria-label", "Switch to " + next.toLowerCase() + " theme");
  };

  if (toggle) {
    syncToggle();

    toggle.addEventListener("click", function () {
      var next = isDark() ? "light" : "dark";
      root.setAttribute("data-theme", next);
      syncToggle();

      try {
        localStorage.setItem("theme", next);
      } catch (e) {
        /* Private browsing or storage disabled — theme won't persist. */
      }
    });

    /* Follow the OS if the visitor has not chosen explicitly */
    window
      .matchMedia("(prefers-color-scheme: dark)")
      .addEventListener("change", function () {
        if (!root.getAttribute("data-theme")) syncToggle();
      });
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

    navList.addEventListener("click", function (event) {
      if (event.target.closest("a")) closeNav();
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape") closeNav();
    });

    window.matchMedia("(min-width: 48em)").addEventListener("change", closeNav);
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
