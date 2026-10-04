/* =========================================================
   AKHI ENGINEERING WORKSHOP
   Main JavaScript
   Compatible with current index.html + style.css
   ========================================================= */

(() => {
  "use strict";

  /* =========================================================
     CONFIG
     ========================================================= */

  const CONFIG = {
    revealSelector: ".reveal",
    mobileBreakpoint: 900,
    parallaxStrength: 0.035,
    cursorEnabled: true,
    storageKey: "akhi_engineering_settings"
  };

  /* =========================================================
     DOM HELPERS
     ========================================================= */

  const $ = (selector, parent = document) =>
    parent.querySelector(selector);

  const $$ = (selector, parent = document) =>
    [...parent.querySelectorAll(selector)];

  /* =========================================================
     STATE
     ========================================================= */

  const state = {
    scrollY: window.scrollY,
    menuOpen: false,
    cursorX: window.innerWidth / 2,
    cursorY: window.innerHeight / 2,
    targetCursorX: window.innerWidth / 2,
    targetCursorY: window.innerHeight / 2
  };

  /* =========================================================
     INIT
     ========================================================= */

  function init() {
    setupReveal();
    setupSmoothScroll();
    setupHeader();
    setupButtons();
    setupCards();
    setupServices();
    setupParallax();
    setupTicker();
    setupKeyboard();
    setupMobileNavigation();
    setupCursor();
    setupScrollEffects();
    setupContactLinks();
    setupYear();

    console.log(
      "%c AKHI ENGINEERING WORKSHOP ",
      "background:#d6ff47;color:#090c0d;font-weight:800;padding:6px 12px;border-radius:4px;"
    );

    console.log(
      "%cPremium engineering interface initialized.",
      "color:#96b52a;font-weight:600;"
    );
  }

  /* =========================================================
     REVEAL ON SCROLL
     ========================================================= */

  function setupReveal() {
    const elements = $$(CONFIG.revealSelector);

    if (!elements.length) return;

    if (!("IntersectionObserver" in window)) {
      elements.forEach((element) => {
        element.classList.add("is-visible");
      });

      return;
    }

    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          entry.target.classList.add("is-visible");

          obs.unobserve(entry.target);
        });
      },
      {
        threshold: 0.12,
        rootMargin: "0px 0px -60px"
      }
    );

    elements.forEach((element) => {
      observer.observe(element);
    });
  }

  /* =========================================================
     SMOOTH SCROLL
     ========================================================= */

  function setupSmoothScroll() {
    $$('a[href^="#"]').forEach((link) => {
      link.addEventListener("click", (event) => {
        const href = link.getAttribute("href");

        if (!href || href === "#") return;

        const target = document.querySelector(href);

        if (!target) return;

        event.preventDefault();

        closeMobileMenu();

        target.scrollIntoView({
          behavior: "smooth",
          block: "start"
        });

        history.replaceState(null, "", href);
      });
    });
  }

  /* =========================================================
     HEADER
     ========================================================= */

  function setupHeader() {
    const navWrap = $(".nav-wrap");

    if (!navWrap) return;

    const updateHeader = () => {
      const scrolled = window.scrollY > 30;

      navWrap.classList.toggle(
        "is-scrolled",
        scrolled
      );

      navWrap.style.boxShadow = scrolled
        ? "0 12px 40px rgba(0,0,0,.18)"
        : "none";
    };

    updateHeader();

    window.addEventListener(
      "scroll",
      updateHeader,
      { passive: true }
    );
  }

  /* =========================================================
     BUTTON MICRO INTERACTION
     ========================================================= */

  function setupButtons() {
    const buttons = $$(".btn, .nav-cta");

    buttons.forEach((button) => {
      button.addEventListener("mouseenter", () => {
        button.style.transform = "translateY(-2px)";
      });

      button.addEventListener("mouseleave", () => {
        button.style.transform = "";
      });

      button.addEventListener("mousedown", () => {
        button.style.transform =
          "translateY(0) scale(.97)";
      });

      button.addEventListener("mouseup", () => {
        button.style.transform =
          "translateY(-2px)";
      });
    });
  }

  /* =========================================================
     WORK CARDS
     ========================================================= */

  function setupCards() {
    const cards = $$(".work-card");

    cards.forEach((card) => {
      const art = $(".work-art", card);

      card.addEventListener("mousemove", (event) => {
        if (window.innerWidth <= 900) return;

        const rect = card.getBoundingClientRect();

        const x =
          (event.clientX - rect.left) /
          rect.width -
          0.5;

        const y =
          (event.clientY - rect.top) /
          rect.height -
          0.5;

        card.style.transform =
          `perspective(900px)
           rotateX(${y * -2.5}deg)
           rotateY(${x * 2.5}deg)
           translateY(-4px)`;

        if (art) {
          art.style.transform =
            `scale(1.015)
             translate(${x * 5}px,${y * 5}px)`;
        }
      });

      card.addEventListener("mouseleave", () => {
        card.style.transform = "";

        if (art) {
          art.style.transform = "";
        }
      });

      card.style.transition =
        "transform .5s cubic-bezier(.2,.75,.2,1)";
    });
  }

  /* =========================================================
     SERVICE ROWS
     ========================================================= */

  function setupServices() {
    const services = $$(".service");

    services.forEach((service) => {
      service.addEventListener("mouseenter", () => {
        service.style.paddingLeft = "15px";

        const arrow = $("b", service);

        if (arrow) {
          arrow.style.transform =
            "translateX(5px)";
        }
      });

      service.addEventListener("mouseleave", () => {
        service.style.paddingLeft = "";

        const arrow = $("b", service);

        if (arrow) {
          arrow.style.transform = "";
        }
      });

      service.style.transition =
        "padding .35s cubic-bezier(.2,.75,.2,1)";

      const arrow = $("b", service);

      if (arrow) {
        arrow.style.transition =
          "transform .35s cubic-bezier(.2,.75,.2,1)";
      }
    });
  }

  /* =========================================================
     HERO PARALLAX
     ========================================================= */

  function setupParallax() {
    const visual = $(".hero-visual");
    const machine = $(".machine-card");

    if (!visual || !machine) return;

    if (
      window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches
    ) {
      return;
    }

    window.addEventListener(
      "mousemove",
      (event) => {
        if (window.innerWidth <= 900) return;

        const x =
          event.clientX /
            window.innerWidth -
          0.5;

        const y =
          event.clientY /
            window.innerHeight -
          0.5;

        machine.style.transform =
          `translate3d(
            ${x * 12}px,
            ${y * 12}px,
            0
          )`;
      },
      { passive: true }
    );

    visual.addEventListener("mouseleave", () => {
      machine.style.transform = "";
    });
  }

  /* =========================================================
     TICKER
     ========================================================= */

  function setupTicker() {
    const ticker = $(".ticker div");

    if (!ticker) return;

    /*
      Pause ticker when hovered.
    */

    ticker.parentElement.addEventListener(
      "mouseenter",
      () => {
        ticker.style.animationPlayState =
          "paused";
      }
    );

    ticker.parentElement.addEventListener(
      "mouseleave",
      () => {
        ticker.style.animationPlayState =
          "running";
      }
    );
  }

  /* =========================================================
     MOBILE NAVIGATION
     ========================================================= */

  function setupMobileNavigation() {
    const nav = $(".nav");

    if (!nav) return;

    /*
      Current HTML may not contain a mobile menu button.
      If it does, this automatically supports:
      .menu-toggle / .mobile-toggle
    */

    const toggle =
      $(".menu-toggle") ||
      $(".mobile-toggle") ||
      $("[data-menu-toggle]");

    if (!toggle) return;

    toggle.addEventListener("click", () => {
      state.menuOpen
        ? closeMobileMenu()
        : openMobileMenu();
    });
  }

  function openMobileMenu() {
    const nav = $(".nav");

    if (!nav) return;

    state.menuOpen = true;

    nav.classList.add("mobile-open");

    document.body.classList.add(
      "mobile-menu-open"
    );
  }

  function closeMobileMenu() {
    const nav = $(".nav");

    if (!nav) return;

    state.menuOpen = false;

    nav.classList.remove("mobile-open");

    document.body.classList.remove(
      "mobile-menu-open"
    );
  }

  /* =========================================================
     KEYBOARD
     ========================================================= */

  function setupKeyboard() {
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        closeMobileMenu();
      }
    });
  }

  /* =========================================================
     CUSTOM CURSOR
     ========================================================= */

  function setupCursor() {
    if (!CONFIG.cursorEnabled) return;

    if (
      !window.matchMedia(
        "(pointer:fine)"
      ).matches
    ) {
      return;
    }

    /*
      Do not create a cursor if the current HTML
      already has its own custom cursor.
    */

    if (
      $(".cursor-dot") ||
      $(".cursor-ring")
    ) {
      return;
    }

    const dot =
      document.createElement("div");

    const ring =
      document.createElement("div");

    dot.className =
      "akhi-cursor-dot";

    ring.className =
      "akhi-cursor-ring";

    Object.assign(dot.style, {
      position: "fixed",
      width: "6px",
      height: "6px",
      borderRadius: "50%",
      background: "#d6ff47",
      pointerEvents: "none",
      zIndex: "9999",
      transform: "translate(-50%,-50%)",
      boxShadow: "0 0 18px rgba(214,255,71,.65)"
    });

    Object.assign(ring.style, {
      position: "fixed",
      width: "32px",
      height: "32px",
      borderRadius: "50%",
      border: "1px solid rgba(214,255,71,.45)",
      pointerEvents: "none",
      zIndex: "9998",
      transform: "translate(-50%,-50%)",
      transition:
        "width .25s ease,height .25s ease,border-color .25s ease"
    });

    document.body.appendChild(dot);
    document.body.appendChild(ring);

    document.addEventListener(
      "mousemove",
      (event) => {
        state.targetCursorX =
          event.clientX;

        state.targetCursorY =
          event.clientY;

        dot.style.left =
          `${state.targetCursorX}px`;

        dot.style.top =
          `${state.targetCursorY}px`;
      },
      { passive: true }
    );

    function animateCursor() {
      state.cursorX +=
        (state.targetCursorX -
          state.cursorX) *
        0.14;

      state.cursorY +=
        (state.targetCursorY -
          state.cursorY) *
        0.14;

      ring.style.left =
        `${state.cursorX}px`;

      ring.style.top =
        `${state.cursorY}px`;

      requestAnimationFrame(
        animateCursor
      );
    }

    animateCursor();

    const interactive = $$(
      "a,button,.work-card,.service"
    );

    interactive.forEach((element) => {
      element.addEventListener(
        "mouseenter",
        () => {
          ring.style.width = "48px";
          ring.style.height = "48px";
          ring.style.borderColor =
            "rgba(214,255,71,.75)";
        }
      );

      element.addEventListener(
        "mouseleave",
        () => {
          ring.style.width = "32px";
          ring.style.height = "32px";
          ring.style.borderColor =
            "rgba(214,255,71,.45)";
        }
      );
    });
  }

  /* =========================================================
     SCROLL EFFECTS
     ========================================================= */

  function setupScrollEffects() {
    let ticking = false;

    function update() {
      state.scrollY =
        window.scrollY;

      const hero = $(".hero");

      if (hero && window.innerWidth > 900) {
        const heroVisual =
          $(".hero-visual", hero);

        if (heroVisual) {
          const movement =
            Math.min(
              state.scrollY * 0.06,
              35
            );

          heroVisual.style.transform =
            `translateY(${movement}px)`;
        }
      }

      ticking = false;
    }

    window.addEventListener(
      "scroll",
      () => {
        if (ticking) return;

        window.requestAnimationFrame(
          update
        );

        ticking = true;
      },
      { passive: true }
    );
  }

  /* =========================================================
     CONTACT LINKS
     ========================================================= */

  function setupContactLinks() {
    $$("a[href^='mailto:']").forEach(
      (link) => {
        link.addEventListener(
          "click",
          () => {
            console.log(
              "AKHI contact:",
              link.getAttribute("href")
            );
          }
        );
      }
    );
  }

  /* =========================================================
     YEAR
     ========================================================= */

  function setupYear() {
    const year =
      $("#year") ||
      $("[data-year]");

    if (!year) return;

    year.textContent =
      new Date().getFullYear();
  }

  /* =========================================================
     IMAGE LAZY LOAD SUPPORT
     ========================================================= */

  function setupLazyImages() {
    const images = $$(
      "img[data-src]"
    );

    if (!images.length) return;

    if (
      !("IntersectionObserver" in window)
    ) {
      images.forEach((img) => {
        img.src =
          img.dataset.src;
      });

      return;
    }

    const observer =
      new IntersectionObserver(
        (entries, obs) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting)
              return;

            const image =
              entry.target;

            image.src =
              image.dataset.src;

            image.removeAttribute(
              "data-src"
            );

            obs.unobserve(image);
          });
        },
        {
          rootMargin: "200px"
        }
      );

    images.forEach((image) => {
      observer.observe(image);
    });
  }

  /* =========================================================
     IMAGE ERROR HANDLING
     ========================================================= */

  function setupImageFallback() {
    document.addEventListener(
      "error",
      (event) => {
        const image =
          event.target;

        if (
          !image ||
          image.tagName !== "IMG"
        ) {
          return;
        }

        image.classList.add(
          "image-failed"
        );

        image.style.opacity = ".25";
      },
      true
    );
  }

  /* =========================================================
     REDUCED MOTION
     ========================================================= */

  function setupReducedMotion() {
    const reduced =
      window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      );

    if (!reduced.matches) return;

    document.documentElement.classList.add(
      "reduced-motion"
    );
  }

  /* =========================================================
     RESIZE
     ========================================================= */

  function setupResize() {
    let resizeTimer;

    window.addEventListener(
      "resize",
      () => {
        clearTimeout(resizeTimer);

        resizeTimer = setTimeout(() => {
          if (
            window.innerWidth >
            CONFIG.mobileBreakpoint
          ) {
            closeMobileMenu();
          }
        }, 150);
      },
      { passive: true }
    );
  }

  /* =========================================================
     INITIALIZE
     ========================================================= */

  function boot() {
    setupLazyImages();
    setupImageFallback();
    setupReducedMotion();
    setupResize();
    init();
  }

  if (
    document.readyState ===
    "loading"
  ) {
    document.addEventListener(
      "DOMContentLoaded",
      boot,
      { once: true }
    );
  } else {
    boot();
  }

})();
