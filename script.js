/* =========================================================
   AKHI ENGINEERING WORKSHOP
   ULTRA PREMIUM SHOP SCRIPT
   ========================================================= */

(() => {
  "use strict";

  /* =======================================================
     CONFIGURATION
  ======================================================= */

  const CONFIG = {

    /*
      আপনার WhatsApp নম্বর এখানে দিন।
      Country code সহ লিখবেন, কিন্তু + বা space নয়।

      Example:
      8801712345678
    */
    whatsapp: "8801XXXXXXXXX",

    currency: "৳",

    shopName: "Akhi Engineering Workshop",

    storageKey: "akhi_engineering_cart",

    /*
      Product data যদি আপনার existing backend/API থেকে আসে,
      নিচের demoProducts অংশটি replace করতে পারবেন।
    */
    demoMode: true
  };


  /* =======================================================
     DEMO PRODUCTS
     ======================================================= */

  const demoProducts = [

    {
      id: 1,
      name: "Premium Steel Table",
      category: "Furniture",
      subcategory: "Tables",
      price: 8500,
      image: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=900&q=85",
      description: "Precision-built steel table designed for modern workspaces."
    },

    {
      id: 2,
      name: "Industrial Work Bench",
      category: "Furniture",
      subcategory: "Work Benches",
      price: 12500,
      image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=900&q=85",
      description: "Heavy-duty workshop bench built for practical everyday use."
    },

    {
      id: 3,
      name: "Metal Storage Rack",
      category: "Storage",
      subcategory: "Racks",
      price: 6500,
      image: "https://images.unsplash.com/photo-1558997519-83ea9252edf8?auto=format&fit=crop&w=900&q=85",
      description: "Strong and refined storage solution for home and workspace."
    },

    {
      id: 4,
      name: "Heavy Duty Rack",
      category: "Storage",
      subcategory: "Industrial",
      price: 14500,
      image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=900&q=85",
      description: "Engineered for demanding storage requirements."
    },

    {
      id: 5,
      name: "Custom Metal Chair",
      category: "Furniture",
      subcategory: "Chairs",
      price: 5200,
      image: "https://images.unsplash.com/photo-1503602642458-232111445657?auto=format&fit=crop&w=900&q=85",
      description: "Minimal, durable and carefully finished metal chair."
    },

    {
      id: 6,
      name: "Workshop Cabinet",
      category: "Storage",
      subcategory: "Cabinets",
      price: 18500,
      image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=900&q=85",
      description: "Premium workshop cabinet with durable construction."
    }

  ];


  /* =======================================================
     STATE
     ======================================================= */

  let products = [...demoProducts];

  let cart = [];

  let activeCategory = "";
  let activeSubcategory = "";

  let activePrice = "";
  let activeSort = "";


  /* =======================================================
     DOM
     ======================================================= */

  const $ = (selector) =>
    document.querySelector(selector);

  const $$ = (selector) =>
    document.querySelectorAll(selector);


  const grid = $("#grid");
  const mainCats = $("#mainCats");
  const subCats = $("#subCats");

  const title = $("#title");
  const showing = $("#showing");

  const priceSelect = $("#price");
  const sortSelect = $("#sort");

  const cartBtn = $("#cartBtn");
  const cart = $("#cart");
  const overlay = $("#overlay");
  const closeCart = $("#closeCart");

  const cartItems = $("#cartItems");

  const count = $("#count");
  const total = $("#total");

  const wa = $("#wa");


  /* =======================================================
     LOCAL STORAGE
     ======================================================= */

  function loadCart() {

    try {

      const saved =
        localStorage.getItem(CONFIG.storageKey);

      if (!saved) {
        cart = [];
        return;
      }

      const parsed = JSON.parse(saved);

      if (Array.isArray(parsed)) {
        cart = parsed;
      } else {
        cart = [];
      }

    } catch (error) {

      console.warn(
        "Could not load cart:",
        error
      );

      cart = [];
    }

  }


  function saveCart() {

    try {

      localStorage.setItem(
        CONFIG.storageKey,
        JSON.stringify(cart)
      );

    } catch (error) {

      console.warn(
        "Could not save cart:",
        error
      );

    }

  }


  /* =======================================================
     PRICE FORMAT
     ======================================================= */

  function formatPrice(value) {

    const number =
      Number(value) || 0;

    return number.toLocaleString("en-BD");

  }


  /* =======================================================
     FIND PRODUCT
     ======================================================= */

  function getProduct(id) {

    return products.find(
      product =>
        String(product.id) === String(id)
    );

  }


  /* =======================================================
     CATEGORIES
     ======================================================= */

  function getCategories() {

    const categories =
      [...new Set(
        products
          .map(product => product.category)
          .filter(Boolean)
      )];

    return categories;

  }


  function getSubcategories(category) {

    if (!category) {
      return [];
    }

    return [
      ...new Set(
        products
          .filter(
            product =>
              product.category === category
          )
          .map(product => product.subcategory)
          .filter(Boolean)
      )
    ];

  }


  function renderCategories() {

    if (!mainCats) {
      return;
    }

    mainCats.innerHTML = "";

    const allButton =
      document.createElement("button");

    allButton.type = "button";

    allButton.textContent = "All Products";

    if (!activeCategory) {
      allButton.classList.add("active");
    }

    allButton.addEventListener(
      "click",
      () => {

        activeCategory = "";
        activeSubcategory = "";

        renderCategories();
        renderSubcategories();
        renderProducts();

      }
    );

    mainCats.appendChild(allButton);


    getCategories().forEach(
      category => {

        const button =
          document.createElement("button");

        button.type = "button";

        button.textContent = category;

        if (
          activeCategory === category
        ) {
          button.classList.add("active");
        }

        button.addEventListener(
          "click",
          () => {

            activeCategory = category;
            activeSubcategory = "";

            renderCategories();
            renderSubcategories();
            renderProducts();

          }
        );

        mainCats.appendChild(button);

      }
    );

  }


  function renderSubcategories() {

    if (!subCats) {
      return;
    }

    subCats.innerHTML = "";

    if (!activeCategory) {
      return;
    }

    const subcategories =
      getSubcategories(activeCategory);

    if (!subcategories.length) {
      return;
    }

    subcategories.forEach(
      subcategory => {

        const button =
          document.createElement("button");

        button.type = "button";

        button.textContent =
          subcategory;

        if (
          activeSubcategory === subcategory
        ) {
          button.classList.add("active");
        }

        button.addEventListener(
          "click",
          () => {

            activeSubcategory =
              activeSubcategory === subcategory
                ? ""
                : subcategory;

            renderSubcategories();
            renderProducts();

          }
        );

        subCats.appendChild(button);

      }
    );

  }


  /* =======================================================
     FILTER
     ======================================================= */

  function filterProducts() {

    let result =
      [...products];


    /* CATEGORY */

    if (activeCategory) {

      result =
        result.filter(
          product =>
            product.category === activeCategory
        );

    }


    /* SUBCATEGORY */

    if (activeSubcategory) {

      result =
        result.filter(
          product =>
            product.subcategory === activeSubcategory
        );

    }


    /* PRICE */

    if (activePrice) {

      const parts =
        activePrice.split("-");

      const min =
        Number(parts[0]) || 0;

      const max =
        Number(parts[1]) || Infinity;

      result =
        result.filter(
          product => {

            const price =
              Number(product.price) || 0;

            return (
              price >= min &&
              price <= max
            );

          }
        );

    }


    /* SORT */

    if (activeSort === "asc") {

      result.sort(
        (a, b) =>
          Number(a.price) -
          Number(b.price)
      );

    }

    if (activeSort === "desc") {

      result.sort(
        (a, b) =>
          Number(b.price) -
          Number(a.price)
      );

    }


    return result;

  }


  /* =======================================================
     PRODUCT CARD
     ======================================================= */

  function createProductCard(product) {

    const article =
      document.createElement("article");

    article.className =
      "product-card";


    const imageWrap =
      document.createElement("div");

    imageWrap.className =
      "product-image";


    const image =
      document.createElement("img");

    image.src =
      product.image ||
      "";

    image.alt =
      product.name || "Product";

    image.loading =
      "lazy";


    image.addEventListener(
      "error",
      () => {

        image.style.display =
          "none";

        imageWrap.classList.add(
          "image-error"
        );

      }
    );


    imageWrap.appendChild(image);


    const body =
      document.createElement("div");

    body.className =
      "product-body";


    const category =
      document.createElement("span");

    category.className =
      "product-category";

    category.textContent =
      product.category ||
      "AKHI COLLECTION";


    const name =
      document.createElement("h3");

    name.textContent =
      product.name ||
      "Untitled Product";


    const description =
      document.createElement("p");

    description.textContent =
      product.description ||
      "Precision-crafted product from Akhi Engineering Workshop.";


    const bottom =
      document.createElement("div");

    bottom.className =
      "product-bottom";


    const price =
      document.createElement("strong");

    price.className =
      "price";

    price.innerHTML =
      `${formatPrice(product.price)}${CONFIG.currency}`;


    const button =
      document.createElement("button");

    button.type =
      "button";

    button.className =
      "add-cart";

    button.textContent =
      "Add to Cart";


    button.addEventListener(
      "click",
      () => {

        addToCart(product.id);

      }
    );


    bottom.appendChild(price);
    bottom.appendChild(button);


    body.appendChild(category);
    body.appendChild(name);
    body.appendChild(description);
    body.appendChild(bottom);


    article.appendChild(imageWrap);
    article.appendChild(body);


    return article;

  }


  /* =======================================================
     RENDER PRODUCTS
     ======================================================= */

  function renderProducts() {

    if (!grid) {
      return;
    }

    const filtered =
      filterProducts();

    grid.innerHTML = "";


    if (!filtered.length) {

      const empty =
        document.createElement("div");

      empty.className =
        "empty-products";

      empty.innerHTML = `
        <div class="empty-icon">—</div>
        <h3>No products found</h3>
        <p>
          Try another category or price range.
        </p>
      `;

      grid.appendChild(empty);

    } else {

      filtered.forEach(
        product => {

          grid.appendChild(
            createProductCard(product)
          );

        }
      );

    }


    updateProductTitle(
      filtered.length
    );

  }


  /* =======================================================
     PRODUCT TITLE
     ======================================================= */

  function updateProductTitle(number) {

    if (title) {

      if (activeSubcategory) {

        title.textContent =
          activeSubcategory;

      } else if (activeCategory) {

        title.textContent =
          activeCategory;

      } else {

        title.textContent =
          "Our Products";

      }

    }


    if (showing) {

      showing.textContent =
        `${number} ${
          number === 1
            ? "product"
            : "products"
        } available`;

    }

  }


  /* =======================================================
     CART
     ======================================================= */

  function addToCart(id) {

    const product =
      getProduct(id);

    if (!product) {
      return;
    }


    const existing =
      cart.find(
        item =>
          String(item.id) ===
          String(id)
      );


    if (existing) {

      existing.quantity += 1;

    } else {

      cart.push({
        id: product.id,
        quantity: 1
      });

    }


    saveCart();

    renderCart();

    openCart();

    showToast(
      `${product.name} added to cart`
    );

  }


  function removeFromCart(id) {

    cart =
      cart.filter(
        item =>
          String(item.id) !==
          String(id)
      );

    saveCart();

    renderCart();

  }


  function changeQuantity(id, amount) {

    const item =
      cart.find(
        product =>
          String(product.id) ===
          String(id)
      );

    if (!item) {
      return;
    }


    item.quantity += amount;


    if (item.quantity <= 0) {

      removeFromCart(id);

      return;

    }


    saveCart();

    renderCart();

  }


  function getCartCount() {

    return cart.reduce(
      (sum, item) =>
        sum + Number(item.quantity || 0),
      0
    );

  }


  function getCartTotal() {

    return cart.reduce(
      (sum, item) => {

        const product =
          getProduct(item.id);

        if (!product) {
          return sum;
        }

        return (
          sum +
          Number(product.price || 0) *
          Number(item.quantity || 0)
        );

      },
      0
    );

  }


  /* =======================================================
     CART RENDER
     ======================================================= */

  function renderCart() {

    if (!cartItems) {
      return;
    }

    cartItems.innerHTML = "";


    if (!cart.length) {

      const empty =
        document.createElement("div");

      empty.className =
        "cart-empty";

      empty.innerHTML = `
        <div class="cart-empty-mark">+</div>
        <h4>Your cart is empty</h4>
        <p>
          Add something from our collection
          to get started.
        </p>
      `;

      cartItems.appendChild(empty);

    } else {

      cart.forEach(
        item => {

          const product =
            getProduct(item.id);

          if (!product) {
            return;
          }


          const row =
            document.createElement("div");

          row.className =
            "cart-row";


          const image =
            document.createElement("img");

          image.src =
            product.image || "";

          image.alt =
            product.name || "Product";


          const info =
            document.createElement("div");

          info.className =
            "cart-info";


          const name =
            document.createElement("h4");

          name.textContent =
            product.name;


          const price =
            document.createElement("span");

          price.textContent =
            `${formatPrice(product.price)}${CONFIG.currency}`;


          const controls =
            document.createElement("div");

          controls.className =
            "cart-controls";


          const minus =
            document.createElement("button");

          minus.type = "button";

          minus.textContent = "−";

          minus.addEventListener(
            "click",
            () =>
              changeQuantity(
                product.id,
                -1
              )
          );


          const quantity =
            document.createElement("b");

          quantity.textContent =
            item.quantity;


          const plus =
            document.createElement("button");

          plus.type = "button";

          plus.textContent = "+";

          plus.addEventListener(
            "click",
            () =>
              changeQuantity(
                product.id,
                1
              )
          );


          const remove =
            document.createElement("button");

          remove.type = "button";

          remove.className =
            "cart-remove";

          remove.textContent =
            "Remove";

          remove.addEventListener(
            "click",
            () =>
              removeFromCart(
                product.id
              )
          );


          controls.appendChild(minus);
          controls.appendChild(quantity);
          controls.appendChild(plus);


          info.appendChild(name);
          info.appendChild(price);
          info.appendChild(controls);
          info.appendChild(remove);


          row.appendChild(image);
          row.appendChild(info);


          cartItems.appendChild(row);

        }
      );

    }


    updateCartSummary();

  }


  /* =======================================================
     CART SUMMARY
     ======================================================= */

  function updateCartSummary() {

    const cartCount =
      getCartCount();

    const cartTotal =
      getCartTotal();


    if (count) {

      count.textContent =
        cartCount;

    }


    const floatingCount =
      $("#floatingCount");

    if (floatingCount) {

      floatingCount.textContent =
        cartCount;

    }


    if (total) {

      total.textContent =
        formatPrice(cartTotal);

    }


    updateWhatsAppLink();

  }


  /* =======================================================
     WHATSAPP
     ======================================================= */

  function updateWhatsAppLink() {

    if (!wa) {
      return;
    }


    if (!cart.length) {

      wa.href = "#";

      return;

    }


    let message =
      `Hello ${CONFIG.shopName},\n\n`;

    message +=
      `I would like to place an order:\n\n`;


    cart.forEach(
      item => {

        const product =
          getProduct(item.id);

        if (!product) {
          return;
        }

        const subtotal =
          Number(product.price || 0) *
          Number(item.quantity || 0);

        message +=
          `• ${product.name}\n`;

        message +=
          `  Qty: ${item.quantity}\n`;

        message +=
          `  Price: ${formatPrice(subtotal)}${CONFIG.currency}\n\n`;

      }
    );


    message +=
      `Total: ${formatPrice(getCartTotal())}${CONFIG.currency}\n\n`;

    message +=
      `Please confirm availability and order details.`;


    const encoded =
      encodeURIComponent(message);


    const number =
      CONFIG.whatsapp
        .replace(/\D/g, "");


    wa.href =
      `https://wa.me/${number}?text=${encoded}`;

  }


  /* =======================================================
     CART DRAWER
     ======================================================= */

  function openCart() {

    if (cart) {

      cart.classList.add("open");

    }

    if (overlay) {

      overlay.classList.add("show");

    }

    document.body.classList.add(
      "cart-open"
    );

  }


  function closeCartDrawer() {

    if (cart) {

      cart.classList.remove("open");

    }

    if (overlay) {

      overlay.classList.remove("show");

    }

    document.body.classList.remove(
      "cart-open"
    );

  }


  /* =======================================================
     CART EVENTS
     ======================================================= */

  if (cartBtn) {

    cartBtn.addEventListener(
      "click",
      openCart
    );

  }


  if (closeCart) {

    closeCart.addEventListener(
      "click",
      closeCartDrawer
    );

  }


  if (overlay) {

    overlay.addEventListener(
      "click",
      closeCartDrawer
    );

  }


  document.addEventListener(
    "keydown",
    event => {

      if (event.key === "Escape") {

        closeCartDrawer();

      }

    }
  );


  /* =======================================================
     FILTER EVENTS
     ======================================================= */

  if (priceSelect) {

    priceSelect.addEventListener(
      "change",
      event => {

        activePrice =
          event.target.value;

        renderProducts();

      }
    );

  }


  if (sortSelect) {

    sortSelect.addEventListener(
      "change",
      event => {

        activeSort =
          event.target.value;

        renderProducts();

      }
    );

  }


  /* =======================================================
     TOAST
     ======================================================= */

  function showToast(message) {

    let toast =
      document.querySelector(
        ".akhi-toast"
      );


    if (!toast) {

      toast =
        document.createElement("div");

      toast.className =
        "akhi-toast";

      document.body.appendChild(
        toast
      );

    }


    toast.textContent =
      message;

    toast.classList.add("show");


    clearTimeout(
      toast._timer
    );


    toast._timer =
      setTimeout(
        () => {

          toast.classList.remove(
            "show"
          );

        },
        2200
      );

  }


  /* =======================================================
     TOAST STYLE
     ======================================================= */

  function injectToastStyles() {

    if (
      document.getElementById(
        "akhi-toast-style"
      )
    ) {
      return;
    }


    const style =
      document.createElement("style");

    style.id =
      "akhi-toast-style";


    style.textContent = `

      .akhi-toast {
        position: fixed;
        left: 50%;
        bottom: 30px;
        z-index: 9999;

        transform:
          translate(-50%, 20px);

        padding: 12px 18px;

        border: 1px solid
          rgba(201,168,106,.35);

        background:
          rgba(20,20,17,.96);

        color: #f5f2ea;

        font-family:
          Inter, sans-serif;

        font-size: 10px;
        font-weight: 600;

        letter-spacing: .08em;

        opacity: 0;
        visibility: hidden;

        box-shadow:
          0 20px 60px
          rgba(0,0,0,.35);

        transition:
          opacity .25s ease,
          visibility .25s ease,
          transform .25s ease;
      }

      .akhi-toast.show {
        opacity: 1;
        visibility: visible;

        transform:
          translate(-50%, 0);
      }

      .product-body {
        padding: 19px;
      }

      .product-category {
        display: block;

        margin-bottom: 8px;

        color: #8e713d;

        font-size: 8px;
        font-weight: 700;

        letter-spacing: .16em;

        text-transform: uppercase;
      }

      .product-body h3 {
        margin: 0;
      }

      .product-body p {
        margin-top: 9px;
      }

      .product-bottom {
        display: flex;

        align-items: center;
        justify-content: space-between;

        gap: 12px;

        margin-top: 20px;
      }

      .product-bottom .price {
        white-space: nowrap;
      }

      .product-bottom button {
        padding: 9px 11px;

        font-size: 8px;
        font-weight: 700;

        letter-spacing: .08em;

        text-transform: uppercase;

        cursor: pointer;
      }

      .empty-products {
        grid-column: 1 / -1;

        padding: 90px 20px;

        border: 1px dashed
          rgba(255,255,255,.09);

        text-align: center;
      }

      .empty-icon {
        margin-bottom: 14px;

        color: #c9a86a;

        font-family:
          "Playfair Display",
          serif;

        font-size: 28px;
      }

      .empty-products h3 {
        color: #f5f2ea;

        font-family:
          "Playfair Display",
          serif;

        font-size: 24px;

        font-weight: 500;
      }

      .empty-products p {
        margin-top: 7px;

        color: #6f6d66;

        font-size: 11px;
      }

      .cart-empty {
        min-height: 400px;

        display: flex;
        flex-direction: column;

        align-items: center;
        justify-content: center;

        text-align: center;
      }

      .cart-empty-mark {
        width: 55px;
        height: 55px;

        display: grid;
        place-items: center;

        border: 1px solid
          rgba(201,168,106,.25);

        border-radius: 50%;

        color: #c9a86a;

        font-size: 25px;

        margin-bottom: 20px;
      }

      .cart-empty h4 {
        color: #f5f2ea;

        font-family:
          "Playfair Display",
          serif;

        font-size: 21px;

        font-weight: 500;
      }

      .cart-empty p {
        max-width: 230px;

        margin-top: 8px;

        color: #6f6d66;

        font-size: 10px;

        line-height: 1.7;
      }

      .cart-row {
        display: grid;

        grid-template-columns:
          72px 1fr;

        gap: 14px;

        padding: 15px 0;

        border-bottom: 1px solid
          rgba(255,255,255,.07);
      }

      .cart-row img {
        width: 72px;
        height: 72px;

        object-fit: cover;

        background: #111;
      }

      .cart-info h4 {
        color: #f5f2ea;

        font-family:
          "Playfair Display",
          serif;

        font-size: 15px;

        font-weight: 500;

        line-height: 1.25;
      }

      .cart-info > span {
        display: block;

        margin-top: 4px;

        color: #c9a86a;

        font-size: 10px;
        font-weight: 700;
      }

      .cart-controls {
        display: flex;

        align-items: center;

        gap: 7px;

        margin-top: 11px;
      }

      .cart-controls button {
        width: 24px;
        height: 24px;

        display: grid;
        place-items: center;

        border: 1px solid
          rgba(255,255,255,.09);

        background: transparent;

        color: #dedbd2;

        font-size: 12px;
      }

      .cart-controls b {
        min-width: 22px;

        color: #f5f2ea;

        font-size: 10px;

        text-align: center;
      }

      .cart-remove {
        margin-top: 8px;

        border: 0;

        background: transparent;

        color: #6f6d66;

        font-size: 8px;

        cursor: pointer;

        text-transform: uppercase;

        letter-spacing: .1em;
      }

      .cart-remove:hover {
        color: #c9a86a;
      }

    `;


    document.head.appendChild(
      style
    );

  }


  /* =======================================================
     SMOOTH HEADER NAV
     ======================================================= */

  function setupSectionObserver() {

    const sections =
      document.querySelectorAll(
        "section[id]"
      );

    const links =
      document.querySelectorAll(
        ".nav a"
      );


    if (!sections.length || !links.length) {
      return;
    }


    const observer =
      new IntersectionObserver(
        entries => {

          entries.forEach(
            entry => {

              if (!entry.isIntersecting) {
                return;
              }


              links.forEach(
                link => {

                  link.classList.remove(
                    "active"
                  );


                  const href =
                    link.getAttribute(
                      "href"
                    );


                  if (
                    href ===
                    `#${entry.target.id}`
                  ) {

                    link.classList.add(
                      "active"
                    );

                  }

                }
              );

            }
          );

        },
        {
          threshold: .35
        }
      );


    sections.forEach(
      section =>
        observer.observe(section)
    );

  }


  /* =======================================================
     IMAGE PRELOADING
     ======================================================= */

  function preloadImages() {

    products.forEach(
      product => {

        if (!product.image) {
          return;
        }

        const image =
          new Image();

        image.src =
          product.image;

      }
    );

  }


  /* =======================================================
     INITIALIZATION
     ======================================================= */

  function init() {

    loadCart();

    injectToastStyles();

    renderCategories();

    renderSubcategories();

    renderProducts();

    renderCart();

    setupSectionObserver();

    preloadImages();

  }


  /* =======================================================
     START
     ======================================================= */

  if (
    document.readyState ===
    "loading"
  ) {

    document.addEventListener(
      "DOMContentLoaded",
      init
    );

  } else {

    init();

  }


})();
```
