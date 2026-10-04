/* =========================================================
   AKHI FURNITURE — MAIN SCRIPT
   Complete replacement: ./script.js
   ========================================================= */

(() => {
  "use strict";

  /* ---------------------------------------------------------
     CONFIG
  --------------------------------------------------------- */

  const CONFIG = {
    currency: "৳",
    firestoreCollection: "products",
    adminCollection: "products",

    // Firebase product fields can use:
    // name, title, price, category, image, description, featured,
    // status, badge, slug
  };

  /* ---------------------------------------------------------
     FALLBACK PRODUCTS
     Used when Firebase has no products / is unavailable.
  --------------------------------------------------------- */

  const FALLBACK_PRODUCTS = [
    {
      id: "akh-01",
      name: "Luna Lounge Chair",
      category: "Living",
      price: 28500,
      image:
        "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?auto=format&fit=crop&w=1200&q=86",
      badge: "New",
      description: "A softly sculpted lounge chair with a timeless silhouette.",
    },
    {
      id: "akh-02",
      name: "Mira Sofa",
      category: "Living",
      price: 78500,
      image:
        "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1200&q=86",
      badge: "Featured",
      description: "Deep comfort and quiet proportions for everyday living.",
    },
    {
      id: "akh-03",
      name: "Noor Bed",
      category: "Bedroom",
      price: 68500,
      image:
        "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=86",
      badge: "New",
      description: "A calm upholstered bed designed around restful proportions.",
    },
    {
      id: "akh-04",
      name: "Aira Dining Table",
      category: "Dining",
      price: 54500,
      image:
        "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1200&q=86",
      badge: "AKHI",
      description: "Natural warmth and generous proportions for gathering.",
    },
  ];

  /* ---------------------------------------------------------
     DOM
  --------------------------------------------------------- */

  const $ = (selector, parent = document) =>
    parent.querySelector(selector);

  const $$ = (selector, parent = document) =>
    Array.from(parent.querySelectorAll(selector));

  const body = document.body;

  const productGrid = $("#productGrid");
  const cartCount = $("#cartCount");
  const cartDrawer = $("#cartDrawer");
  const cartItems = $("#cartItems");
  const cartTotal = $("#cartTotal");

  const searchPanel = $("#searchPanel");
  const searchInput = $("#searchInput");
  const searchResults = $("#searchResults");

  const mobileMenu = $("#mobileMenu");

  const progress = $("#progress");
  const cursorDot = $("#cursorDot");
  const cursorRing = $("#cursorRing");

  /* ---------------------------------------------------------
     STATE
  --------------------------------------------------------- */

  let products = [...FALLBACK_PRODUCTS];
  let cart = loadCart();
  let ringX = window.innerWidth / 2;
  let ringY = window.innerHeight / 2;
  let targetX = ringX;
  let targetY = ringY;

  /* ---------------------------------------------------------
     UTILITIES
  --------------------------------------------------------- */

  function escapeHTML(value) {
    return String(value ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function formatPrice(value) {
    const number = Number(value);

    if (!Number.isFinite(number)) {
      return "Price on enquiry";
    }

    return (
      CONFIG.currency +
      number.toLocaleString("en-BD", {
        maximumFractionDigits: 0,
      })
    );
  }

  function normalizeProduct(product, index = 0) {
    return {
      id:
        product.id ||
        product.slug ||
        `product-${index + 1}`,

      name:
        product.name ||
        product.title ||
        "AKHI Furniture Piece",

      category:
        product.category ||
        product.type ||
        "Furniture",

      price:
        Number(product.price) ||
        Number(product.amount) ||
        0,

      image:
        product.image ||
        product.imageUrl ||
        product.photo ||
        "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1200&q=86",

      badge:
        product.badge ||
        (product.featured ? "Featured" : ""),

      description:
        product.description ||
        product.desc ||
        "Thoughtfully designed furniture for beautiful everyday living.",

      status:
        product.status ||
        "active",

      featured:
        product.featured === true ||
        product.featured === "true",
    };
  }

  /* ---------------------------------------------------------
     CART STORAGE
  --------------------------------------------------------- */

  function loadCart() {
    try {
      const saved = localStorage.getItem("akhi_cart");

      if (!saved) return [];

      const parsed = JSON.parse(saved);

      return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
      console.warn("AKHI cart could not be loaded:", error);
      return [];
    }
  }

  function saveCart() {
    try {
      localStorage.setItem("akhi_cart", JSON.stringify(cart));
    } catch (error) {
      console.warn("AKHI cart could not be saved:", error);
    }
  }

  /* ---------------------------------------------------------
     FIREBASE PRODUCT LOADING
  --------------------------------------------------------- */

  async function loadProductsFromFirebase() {
    try {
      if (
        typeof firebase === "undefined" ||
        !firebase.firestore
      ) {
        console.warn("Firebase Firestore unavailable.");
        return;
      }

      let db = null;

      /*
        Prefer the global db created by firebase-init.js.
      */

      if (window.db) {
        db = window.db;
      }

      /*
        Fallback: create/access Firestore from Firebase app.
      */

      if (!db && firebase.apps && firebase.apps.length) {
        db = firebase.firestore();
      }

      if (!db) {
        console.warn("Firestore database not found.");
        return;
      }

      const snapshot = await db
        .collection(CONFIG.firestoreCollection)
        .get();

      if (snapshot.empty) {
        console.info("No Firebase products found. Using fallback products.");
        return;
      }

      const firebaseProducts = [];

      snapshot.forEach((doc) => {
        firebaseProducts.push({
          id: doc.id,
          ...doc.data(),
        });
      });

      const normalized = firebaseProducts
        .map(normalizeProduct)
        .filter((item) => {
          const status = String(item.status).toLowerCase();

          return (
            status !== "hidden" &&
            status !== "inactive" &&
            status !== "deleted"
          );
        });

      if (normalized.length) {
        products = normalized;
        renderProducts(products);
        updateSearchResults("");
      }
    } catch (error) {
      console.warn(
        "AKHI Firebase product loading failed. Fallback products remain active.",
        error
      );
    }
  }

  /* ---------------------------------------------------------
     PRODUCT CARD
  --------------------------------------------------------- */

  function productCard(product, index) {
    const item = normalizeProduct(product, index);

    return `
      <article
        class="product-card"
        data-product-id="${escapeHTML(item.id)}"
        data-reveal
      >

        <div class="product-image">

          <img
            src="${escapeHTML(item.image)}"
            alt="${escapeHTML(item.name)}"
            loading="${index < 2 ? "eager" : "lazy"}"
            decoding="async"
          >

          ${
            item.badge
              ? `<span class="product-badge">${escapeHTML(item.badge)}</span>`
              : ""
          }

          <button
            class="product-add"
            type="button"
            data-add-cart="${escapeHTML(item.id)}"
            aria-label="Add ${escapeHTML(item.name)} to bag"
          >
            <span>Add to bag</span>
            <b>+</b>
          </button>

        </div>

        <div class="product-info">

          <div class="product-meta">
            <span>${escapeHTML(item.category)}</span>
            <span>${formatPrice(item.price)}</span>
          </div>

          <h3>${escapeHTML(item.name)}</h3>

          <p>
            ${escapeHTML(item.description)}
          </p>

        </div>

      </article>
    `;
  }

  /* ---------------------------------------------------------
     RENDER PRODUCTS
  --------------------------------------------------------- */

  function renderProducts(list = products) {
    if (!productGrid) return;

    if (!list.length) {
      productGrid.innerHTML = `
        <div class="empty-products">
          <span class="eyebrow">AKHI / COLLECTION</span>
          <h3>No pieces found.</h3>
          <p>Try another search or visit our showroom.</p>
        </div>
      `;
      return;
    }

    productGrid.innerHTML = list
      .map((product, index) => productCard(product, index))
      .join("");

    observeRevealElements();
  }

  /* ---------------------------------------------------------
     PRODUCT FINDER
  --------------------------------------------------------- */

  function getProduct(id) {
    return products.find(
      (product) => String(product.id) === String(id)
    );
  }

  /* ---------------------------------------------------------
     ADD TO CART
  --------------------------------------------------------- */

  function addToCart(id) {
    const product = getProduct(id);

    if (!product) return;

    const existing = cart.find(
      (item) => String(item.id) === String(id)
    );

    if (existing) {
      existing.qty += 1;
    } else {
      cart.push({
        id: product.id,
        name: product.name,
        category: product.category,
        price: product.price,
        image: product.image,
        qty: 1,
      });
    }

    saveCart();
    updateCartUI();
    openCart();

    flashAddedMessage();
  }

  /* ---------------------------------------------------------
     REMOVE FROM CART
  --------------------------------------------------------- */

  function removeFromCart(id) {
    cart = cart.filter(
      (item) => String(item.id) !== String(id)
    );

    saveCart();
    updateCartUI();
  }

  /* ---------------------------------------------------------
     CHANGE CART QUANTITY
  --------------------------------------------------------- */

  function changeQuantity(id, amount) {
    const item = cart.find(
      (product) => String(product.id) === String(id)
    );

    if (!item) return;

    item.qty += amount;

    if (item.qty <= 0) {
      removeFromCart(id);
      return;
    }

    saveCart();
    updateCartUI();
  }

  /* ---------------------------------------------------------
     CART UI
  --------------------------------------------------------- */

  function updateCartUI() {
    if (!cartCount || !cartItems || !cartTotal) return;

    const totalQuantity = cart.reduce(
      (sum, item) => sum + Number(item.qty || 0),
      0
    );

    const totalPrice = cart.reduce(
      (sum, item) =>
        sum +
        Number(item.price || 0) *
          Number(item.qty || 0),
      0
    );

    cartCount.textContent = totalQuantity;

    cartCount.classList.toggle(
      "has-items",
      totalQuantity > 0
    );

    if (!cart.length) {
      cartItems.innerHTML = `
        <div class="cart-empty">
          <div class="cart-empty-icon">○</div>
          <h4>Your bag is empty.</h4>
          <p>Select a few pieces you love and they will appear here.</p>
          <button
            type="button"
            class="text-link"
            data-close-cart
          >
            Continue browsing →
          </button>
        </div>
      `;

      cartTotal.textContent = "৳0";
      return;
    }

    cartItems.innerHTML = cart
      .map(
        (item) => `
          <div class="cart-item">

            <div class="cart-item-image">
              <img
                src="${escapeHTML(item.image)}"
                alt="${escapeHTML(item.name)}"
              >
            </div>

            <div class="cart-item-info">

              <div class="cart-item-top">
                <div>
                  <small>${escapeHTML(item.category)}</small>
                  <h4>${escapeHTML(item.name)}</h4>
                </div>

                <button
                  type="button"
                  class="cart-remove"
                  data-remove-cart="${escapeHTML(item.id)}"
                  aria-label="Remove item"
                >
                  ×
                </button>
              </div>

              <div class="cart-item-bottom">

                <div class="quantity">
                  <button
                    type="button"
                    data-qty-minus="${escapeHTML(item.id)}"
                    aria-label="Decrease quantity"
                  >
                    −
                  </button>

                  <span>${item.qty}</span>

                  <button
                    type="button"
                    data-qty-plus="${escapeHTML(item.id)}"
                    aria-label="Increase quantity"
                  >
                    +
                  </button>
                </div>

                <strong>
                  ${formatPrice(
                    Number(item.price) *
                      Number(item.qty)
                  )}
                </strong>

              </div>

            </div>

          </div>
        `
      )
      .join("");

    cartTotal.textContent = formatPrice(totalPrice);
  }

  /* ---------------------------------------------------------
     CART OPEN / CLOSE
  --------------------------------------------------------- */

  function openCart() {
    if (!cartDrawer) return;

    cartDrawer.classList.add("open");
    cartDrawer.setAttribute("aria-hidden", "false");

    body.classList.add("drawer-open");
  }

  function closeCart() {
    if (!cartDrawer) return;

    cartDrawer.classList.remove("open");
    cartDrawer.setAttribute("aria-hidden", "true");

    body.classList.remove("drawer-open");
  }

  /* ---------------------------------------------------------
     SEARCH
  --------------------------------------------------------- */

  function openSearch() {
    if (!searchPanel) return;

    searchPanel.classList.add("open");
    body.classList.add("search-open");

    setTimeout(() => {
      searchInput?.focus();
    }, 150);

    updateSearchResults(
      searchInput ? searchInput.value : ""
    );
  }

  function closeSearch() {
    if (!searchPanel) return;

    searchPanel.classList.remove("open");
    body.classList.remove("search-open");
  }

  function updateSearchResults(query = "") {
    if (!searchResults) return;

    const value = String(query)
      .trim()
      .toLowerCase();

    if (!value) {
      searchResults.innerHTML = `
        <div class="search-hint">
          <span>Try</span>
          <button type="button" data-search-term="sofa">Sofa</button>
          <button type="button" data-search-term="bed">Bed</button>
          <button type="button" data-search-term="dining">Dining</button>
          <button type="button" data-search-term="chair">Chair</button>
        </div>
      `;
      return;
    }

    const results = products.filter((product) => {
      const text = [
        product.name,
        product.category,
        product.description,
        product.badge,
      ]
        .join(" ")
        .toLowerCase();

      return text.includes(value);
    });

    if (!results.length) {
      searchResults.innerHTML = `
        <div class="search-empty">
          <strong>No pieces found.</strong>
          <p>Try another word or visit the AKHI showroom.</p>
        </div>
      `;
      return;
    }

    searchResults.innerHTML = results
      .slice(0, 8)
      .map(
        (product) => `
          <button
            type="button"
            class="search-result"
            data-search-product="${escapeHTML(product.id)}"
          >

            <span class="search-result-image">
              <img
                src="${escapeHTML(product.image)}"
                alt=""
              >
            </span>

            <span class="search-result-copy">
              <small>${escapeHTML(product.category)}</small>
              <strong>${escapeHTML(product.name)}</strong>
            </span>

            <b>${formatPrice(product.price)}</b>

          </button>
        `
      )
      .join("");
  }

  /* ---------------------------------------------------------
     MOBILE MENU
  --------------------------------------------------------- */

  function openMenu() {
    if (!mobileMenu) return;

    mobileMenu.classList.add("open");
    body.classList.add("menu-open");
  }

  function closeMenu() {
    if (!mobileMenu) return;

    mobileMenu.classList.remove("open");
    body.classList.remove("menu-open");
  }

  /* ---------------------------------------------------------
     SEARCH RESULT CLICK
  --------------------------------------------------------- */

  function selectSearchProduct(id) {
    const card = document.querySelector(
      `[data-product-id="${CSS.escape(String(id))}"]`
    );

    closeSearch();

    if (card) {
      card.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });

      card.classList.add("product-highlight");

      setTimeout(() => {
        card.classList.remove("product-highlight");
      }, 1400);

      return;
    }

    const product = getProduct(id);

    if (product && productGrid) {
      renderProducts([product]);

      productGrid.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });

      setTimeout(() => {
        renderProducts(products);
      }, 2000);
    }
  }

  /* ---------------------------------------------------------
     EVENTS
  --------------------------------------------------------- */

  document.addEventListener("click", (event) => {
    const addButton =
      event.target.closest("[data-add-cart]");

    if (addButton) {
      event.preventDefault();

      addToCart(
        addButton.getAttribute("data-add-cart")
      );

      return;
    }

    const removeButton =
      event.target.closest("[data-remove-cart]");

    if (removeButton) {
      removeFromCart(
        removeButton.getAttribute("data-remove-cart")
      );

      return;
    }

    const plusButton =
      event.target.closest("[data-qty-plus]");

    if (plusButton) {
      changeQuantity(
        plusButton.getAttribute("data-qty-plus"),
        1
      );

      return;
    }

    const minusButton =
      event.target.closest("[data-qty-minus]");

    if (minusButton) {
      changeQuantity(
        minusButton.getAttribute("data-qty-minus"),
        -1
      );

      return;
    }

    const searchTerm =
      event.target.closest("[data-search-term]");

    if (searchTerm) {
      const term =
        searchTerm.getAttribute("data-search-term");

      if (searchInput) {
        searchInput.value = term;
        updateSearchResults(term);
      }

      return;
    }

    const searchProduct =
      event.target.closest("[data-search-product]");

    if (searchProduct) {
      selectSearchProduct(
        searchProduct.getAttribute(
          "data-search-product"
        )
      );

      return;
    }

    if (
      event.target.closest("[data-open-cart]")
    ) {
      openCart();
      return;
    }

    if (
      event.target.closest("[data-close-cart]")
    ) {
      closeCart();
      return;
    }

    if (
      event.target.closest("[data-open-search]")
    ) {
      openSearch();
      return;
    }

    if (
      event.target.closest("[data-close-search]")
    ) {
      closeSearch();
      return;
    }

    if (
      event.target.closest("[data-open-menu]")
    ) {
      openMenu();
      return;
    }

    if (
      event.target.closest("[data-close-menu]")
    ) {
      closeMenu();
      return;
    }

    /*
      Close mobile menu after clicking internal anchor.
    */

    const mobileLink =
      event.target.closest(".mobile-menu a[href^='#']");

    if (mobileLink) {
      closeMenu();
    }
  });

  /* ---------------------------------------------------------
     SEARCH INPUT
  --------------------------------------------------------- */

  if (searchInput) {
    searchInput.addEventListener("input", (event) => {
      updateSearchResults(event.target.value);
    });

    searchInput.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        closeSearch();
      }
    });
  }

  /* ---------------------------------------------------------
     ESC KEY
  --------------------------------------------------------- */

  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") return;

    closeCart();
    closeSearch();
    closeMenu();
  });

  /* ---------------------------------------------------------
     SMOOTH ANCHOR SCROLL
  --------------------------------------------------------- */

  $$('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (event) => {
      const href = link.getAttribute("href");

      if (!href || href === "#") return;

      const target = document.querySelector(href);

      if (!target) return;

      event.preventDefault();

      target.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    });
  });

  /* ---------------------------------------------------------
     SCROLL PROGRESS
  --------------------------------------------------------- */

  function updateProgress() {
    if (!progress) return;

    const scrollTop = window.scrollY;

    const scrollHeight =
      document.documentElement.scrollHeight -
      window.innerHeight;

    const percentage =
      scrollHeight > 0
        ? (scrollTop / scrollHeight) * 100
        : 0;

    progress.style.width = `${percentage}%`;
  }

  /* ---------------------------------------------------------
     HEADER SCROLL STATE
  --------------------------------------------------------- */

  const header = $("#header");

  function updateHeader() {
    if (!header) return;

    header.classList.toggle(
      "scrolled",
      window.scrollY > 40
    );
  }

  /* ---------------------------------------------------------
     PARALLAX
  --------------------------------------------------------- */

  const parallaxElements =
    $$("[data-parallax]");

  function updateParallax() {
    const scrollY = window.scrollY;

    parallaxElements.forEach((element) => {
      const speed =
        Number(
          element.getAttribute("data-parallax")
        ) || 0.03;

      const rect =
        element.getBoundingClientRect();

      const offset =
        (rect.top - window.innerHeight / 2) *
        speed;

      const image =
        element.querySelector("img");

      if (!image) return;

      image.style.transform =
        `translate3d(0, ${offset}px, 0) scale(1.04)`;
    });
  }

  /* ---------------------------------------------------------
     SCROLL HANDLER
  --------------------------------------------------------- */

  let ticking = false;

  function onScroll() {
    if (ticking) return;

    window.requestAnimationFrame(() => {
      updateProgress();
      updateHeader();
      updateParallax();

      ticking = false;
    });

    ticking = true;
  }

  window.addEventListener(
    "scroll",
    onScroll,
    { passive: true }
  );

  /* ---------------------------------------------------------
     CUSTOM CURSOR
  --------------------------------------------------------- */

  const hasFinePointer =
    window.matchMedia(
      "(pointer: fine)"
    ).matches;

  if (
    hasFinePointer &&
    cursorDot &&
    cursorRing
  ) {
    document.addEventListener(
      "mousemove",
      (event) => {
        targetX = event.clientX;
        targetY = event.clientY;

        cursorDot.style.transform =
          `translate3d(${targetX}px, ${targetY}px, 0)`;
      },
      { passive: true }
    );

    function animateCursor() {
      ringX += (targetX - ringX) * 0.13;
      ringY += (targetY - ringY) * 0.13;

      cursorRing.style.transform =
        `translate3d(${ringX}px, ${ringY}px, 0)`;

      requestAnimationFrame(
        animateCursor
      );
    }

    animateCursor();

    const interactiveSelector =
      "a, button, input, .product-card, .collection-card";

    document.addEventListener(
      "mouseover",
      (event) => {
        if (
          event.target.closest(
            interactiveSelector
          )
        ) {
          body.classList.add(
            "cursor-hover"
          );
        }
      }
    );

    document.addEventListener(
      "mouseout",
      (event) => {
        if (
          event.target.closest(
            interactiveSelector
          )
        ) {
          body.classList.remove(
            "cursor-hover"
          );
        }
      }
    );
  } else {
    if (cursorDot) {
      cursorDot.style.display = "none";
    }

    if (cursorRing) {
      cursorRing.style.display = "none";
    }
  }

  /* ---------------------------------------------------------
     REVEAL ANIMATIONS
  --------------------------------------------------------- */

  let revealObserver = null;

  function setupRevealObserver() {
    if (
      !("IntersectionObserver" in window)
    ) {
      $$("[data-reveal]").forEach((element) => {
        element.classList.add("revealed");
      });

      return;
    }

    revealObserver =
      new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;

            entry.target.classList.add(
              "revealed"
            );

            revealObserver.unobserve(
              entry.target
            );
          });
        },
        {
          threshold: 0.12,
          rootMargin: "0px 0px -50px",
        }
      );

    observeRevealElements();
  }

  function observeRevealElements() {
    if (!revealObserver) return;

    $$("[data-reveal]").forEach((element) => {
      if (
        !element.classList.contains(
          "revealed"
        )
      ) {
        revealObserver.observe(element);
      }
    });
  }

  /* ---------------------------------------------------------
     ADD REVEAL CLASSES TO STATIC CONTENT
  --------------------------------------------------------- */

  function prepareRevealElements() {
    const selectors = [
      ".section-head",
      ".collection-card",
      ".story-media",
      ".story-copy",
      ".editorial-copy",
      ".editorial-images figure",
      ".showroom-inner",
      ".quote",
      ".site-footer",
    ];

    selectors.forEach((selector) => {
      $$(selector).forEach((element) => {
        element.setAttribute(
          "data-reveal",
          ""
        );
      });
    });
  }

  /* ---------------------------------------------------------
     BUTTON MICRO INTERACTION
  --------------------------------------------------------- */

  function setupButtonEffects() {
    $$(
      ".btn, .text-link, .collection-card"
    ).forEach((element) => {
      element.addEventListener(
        "mouseenter",
        () => {
          element.classList.add(
            "is-hovered"
          );
        }
      );

      element.addEventListener(
        "mouseleave",
        () => {
          element.classList.remove(
            "is-hovered"
          );
        }
      );
    });
  }

  /* ---------------------------------------------------------
     IMAGE ERROR FALLBACK
  --------------------------------------------------------- */

  document.addEventListener(
    "error",
    (event) => {
      const image = event.target;

      if (
        image &&
        image.tagName === "IMG"
      ) {
        image.classList.add(
          "image-error"
        );
      }
    },
    true
  );

  /* ---------------------------------------------------------
     FLASH MESSAGE
  --------------------------------------------------------- */

  function flashAddedMessage() {
    let toast =
      document.querySelector(
        ".akhi-toast"
      );

    if (!toast) {
      toast =
        document.createElement("div");

      toast.className =
        "akhi-toast";

      toast.innerHTML = `
        <span class="akhi-toast-icon">✓</span>
        <span>Added to your bag</span>
      `;

      document.body.appendChild(toast);
    }

    toast.classList.add("show");

    clearTimeout(
      toast._timer
    );

    toast._timer = setTimeout(() => {
      toast.classList.remove("show");
    }, 1800);
  }

  /* ---------------------------------------------------------
     NEWSLETTER / FUTURE FORM SUPPORT
  --------------------------------------------------------- */

  document.addEventListener(
    "submit",
    (event) => {
      const form = event.target;

      if (
        !form.matches(
          "[data-akhi-form]"
        )
      ) {
        return;
      }

      event.preventDefault();

      const button =
        form.querySelector(
          "button[type='submit']"
        );

      if (button) {
        const original =
          button.innerHTML;

        button.innerHTML =
          "Thank you ✓";

        button.disabled = true;

        setTimeout(() => {
          button.innerHTML =
            original;

          button.disabled = false;
        }, 2200);
      }

      form.reset();
    }
  );

  /* ---------------------------------------------------------
     YEAR
  --------------------------------------------------------- */

  const year = $("#year");

  if (year) {
    year.textContent =
      new Date().getFullYear();
  }

  /* ---------------------------------------------------------
     INITIALIZATION
  --------------------------------------------------------- */

  async function init() {
    /*
      Render fallback immediately so the page never
      appears empty while Firebase is loading.
    */

    renderProducts(products);

    updateCartUI();

    prepareRevealElements();

    setupRevealObserver();

    setupButtonEffects();

    updateProgress();
    updateHeader();
    updateParallax();

    /*
      Firebase products replace fallback products
      when available.
    */

    await loadProductsFromFirebase();

    /*
      Refresh UI after Firebase.
    */

    updateCartUI();
    updateSearchResults(
      searchInput
        ? searchInput.value
        : ""
    );
  }

  /* ---------------------------------------------------------
     DOM READY
  --------------------------------------------------------- */

  if (
    document.readyState ===
    "loading"
  ) {
    document.addEventListener(
      "DOMContentLoaded",
      init,
      { once: true }
    );
  } else {
    init();
  }

})();
