/* =========================================================
   AKHI ENGINEERING WORKSHOP
   Production JavaScript
   ========================================================= */

(() => {

  "use strict";

  /* =======================================================
     DOM HELPERS
     ======================================================= */

  const $ = (selector, root = document) =>
    root.querySelector(selector);

  const $$ = (selector, root = document) =>
    [...root.querySelectorAll(selector)];


  /* =======================================================
     SAFE HTML
     ======================================================= */

  const escapeHTML = value =>
    String(value ?? "")
      .replace(/[&<>"']/g, char => ({
        "&":"&amp;",
        "<":"&lt;",
        ">":"&gt;",
        '"':"&quot;",
        "'":"&#39;"
      }[char]));


  /* =======================================================
     IMAGE HELPERS
     ======================================================= */

  const unsplash = id =>
    `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=1400&q=85`;


  const IMAGE = {
    living:"1555041469-a586c61ea9bc",
    sofa:"1618221195710-dd6b41faaea6",
    chair:"1616486338812-3dadae4b4ace",
    bedroom:"1505693416388-ac5ce068fe85",
    office:"1519710164239-da123dc03ef4",
    chair2:"1540574163026-643ea20ade25",
    table:"1598300042247-d088f8ab3a91"
  };


  /* =======================================================
     DEMO PRODUCTS
     Used only when Firebase has no products.
     ======================================================= */

  const DEMO_PRODUCTS = [
    {
      title:"Modern Sofa Set",
      category:"Living Room",
      price:45000,
      image:unsplash(IMAGE.living),
      demo:true,
      order:1
    },
    {
      title:"Lounge Chair",
      category:"Living Room",
      price:12500,
      image:unsplash(IMAGE.chair2),
      demo:true,
      order:2
    },
    {
      title:"Living Room Set",
      category:"Living Room",
      price:68000,
      image:unsplash(IMAGE.sofa),
      demo:true,
      order:3
    },
    {
      title:"Cozy Armchair",
      category:"Living Room",
      price:9800,
      image:unsplash(IMAGE.chair),
      demo:true,
      order:4
    },
    {
      title:"Wooden Bed",
      category:"Bedroom",
      price:38000,
      image:unsplash(IMAGE.bedroom),
      demo:true,
      order:5
    },
    {
      title:"Bedroom Set",
      category:"Bedroom",
      price:72000,
      image:unsplash(IMAGE.bedroom),
      demo:true,
      order:6
    },
    {
      title:"Bedside Table",
      category:"Bedroom",
      price:6500,
      image:unsplash(IMAGE.table),
      demo:true,
      order:7
    },
    {
      title:"Dining Table Set",
      category:"Dining",
      price:52000,
      image:unsplash(IMAGE.table),
      demo:true,
      order:8
    },
    {
      title:"Dining Chair",
      category:"Dining",
      price:4800,
      image:unsplash(IMAGE.chair2),
      demo:true,
      order:9
    },
    {
      title:"Ergonomic Mesh Office Chair",
      category:"Office",
      price:6800,
      image:unsplash(IMAGE.office),
      demo:true,
      order:10
    },
    {
      title:"Executive Office Desk",
      category:"Office",
      price:18500,
      image:unsplash(IMAGE.table),
      demo:true,
      order:11
    },
    {
      title:"Visitor Chair",
      category:"Office",
      price:4300,
      image:unsplash(IMAGE.chair2),
      demo:true,
      order:12
    }
  ];


  /* =======================================================
     DEMO BANNERS
     ======================================================= */

  const DEMO_BANNERS = [
    {
      title:"Furniture designed for better living.",
      description:
        "Premium furniture for homes, offices and modern workspaces.",
      image:unsplash(IMAGE.chair)
    },
    {
      title:"Make your workspace work better.",
      description:
        "Comfortable chairs and desks for focused working days.",
      image:unsplash(IMAGE.office)
    },
    {
      title:"Modern form. Everyday comfort.",
      description:
        "Thoughtful furniture built around real life.",
      image:unsplash(IMAGE.bedroom)
    }
  ];


  /* =======================================================
     STATE
     ======================================================= */

  const state = {
    settings:{},
    home:{},
    products:[],
    banners:[],

    category:"All",
    search:"",

    slide:0,
    slideTimer:null,

    phone:"",

    firebase:false
  };


  /* =======================================================
     FIREBASE
     ======================================================= */

  async function loadFirebase(){

    try{

      const config =
        window.AKI_FIREBASE_CONFIG;


      if(
        !config ||
        !config.apiKey ||
        String(config.apiKey)
          .startsWith("YOUR_")
      ){

        throw new Error(
          "Firebase configuration is missing."
        );

      }


      if(!window.firebase){

        throw new Error(
          "Firebase SDK is unavailable."
        );

      }


      if(!firebase.apps.length){

        firebase.initializeApp(config);

      }


      const db =
        firebase.firestore();


      const normalizeSnapshot =
        snapshot =>

          snapshot.docs

            .map(doc => ({
              id:doc.id,
              ...doc.data()
            }))

            .filter(item =>
              item.published !== false
            )

            .sort(
              (a,b) =>
                (a.order ?? 999) -
                (b.order ?? 999)
            );


      const [
        homeSnapshot,
        settingsSnapshot,
        productsSnapshot,
        bannersSnapshot
      ] = await Promise.all([

        db
          .collection("siteContent")
          .doc("home")
          .get(),

        db
          .collection("siteContent")
          .doc("settings")
          .get(),

        db
          .collection("projects")
          .get(),

        db
          .collection("banners")
          .get()

      ]);


      state.home =
        homeSnapshot.exists
          ? homeSnapshot.data()
          : {};


      state.settings =
        settingsSnapshot.exists
          ? settingsSnapshot.data()
          : {};


      state.products =
        normalizeSnapshot(
          productsSnapshot
        );


      state.banners =
        normalizeSnapshot(
          bannersSnapshot
        );


      state.firebase = true;


    }catch(error){

      console.warn(
        "[AKHI] Firebase unavailable:",
        error.message
      );

      state.firebase = false;

    }

  }


  /* =======================================================
     BRAND
     ======================================================= */

  function setupBrand(){

    const settings =
      state.settings;


    const name =
      (
        settings.name ||
        "Akhi Engineering Workshop"
      ).trim();


    document.title =
      `${name} | Premium Furniture`;


    const footerName =
      $("#footerName");

    if(footerName){

      footerName.textContent =
        name;

    }


    const copyright =
      $("#copyright");

    if(copyright){

      copyright.textContent =
        settings.footer ||
        `© ${name}`;

    }


    if(settings.logo){

      const logo =
        $("#logo");

      if(logo){

        logo.src =
          settings.logo;

        logo.alt =
          name;

      }


      const favicon =
        $('link[rel="icon"]');

      if(favicon){

        favicon.href =
          settings.logo;

      }

    }

  }


  /* =======================================================
     CONTACT / WHATSAPP
     ======================================================= */

  function setupContact(){

    const settings =
      state.settings;


    let phone =
      String(
        settings.whatsapp ||
        settings.phone ||
        ""
      )
      .replace(/\D/g,"");


    if(phone.startsWith("0")){

      phone =
        `880${phone.slice(1)}`;

    }


    state.phone =
      phone;


    const name =
      settings.name ||
      "Akhi Engineering Workshop";


    const createWhatsAppURL =
      message => {

        if(phone){

          return (
            `https://wa.me/${phone}` +
            `?text=${encodeURIComponent(message)}`
          );

        }


        if(settings.email){

          return (
            `mailto:${settings.email}` +
            `?subject=${encodeURIComponent(message)}`
          );

        }


        return "#contact";

      };


    window.AKI_WHATSAPP =
      createWhatsAppURL;


    const generalMessage =
      `Hello ${name}, I want to enquire about your furniture.`;


    const whatsappButton =
      $("#whatsappButton");

    if(whatsappButton){

      whatsappButton.href =
        createWhatsAppURL(
          generalMessage
        );

    }


    const orderButton =
      $("#orderButton");

    if(orderButton){

      orderButton.href =
        createWhatsAppURL(
          generalMessage
        );

    }


    const phoneLink =
      $("#phoneLink");


    if(
      phoneLink &&
      settings.phone
    ){

      phoneLink.style.display =
        "flex";

      $("#phoneText").textContent =
        settings.phone;


      phoneLink.href =
        `tel:${String(settings.phone)
          .replace(/[^\d+]/g,"")}`;

    }

  }


  /* =======================================================
     FOOTER CONTACT
     ======================================================= */

  function renderFooter(){

    const settings =
      state.settings;


    const contactItems = [

      settings.address,

      settings.phone,

      settings.email,

      settings.facebook

    ].filter(Boolean);


    const container =
      $("#footerContact");


    if(!container){

      return;

    }


    container.innerHTML =
      contactItems.length

        ? contactItems
            .map(
              value =>
                `<span>${escapeHTML(value)}</span>`
            )
            .join("")

        : `
          <span>
            Moulvibazar, Bangladesh
          </span>
        `;

  }


  /* =======================================================
     HERO
     ======================================================= */

  function getHeroSlides(){

    if(state.banners.length){

      return state.banners;

    }


    if(!state.products.length){

      return DEMO_BANNERS;

    }


    return [
      {
        title:
          state.home.heroTitle ||
          "Furniture designed for better living.",

        description:
          state.home.heroDescription ||
          "Premium furniture for homes, offices and modern workspaces."
      }
    ];

  }


  function renderHero(){

    const slides =
      getHeroSlides();


    const slidesContainer =
      $("#slides");


    if(!slidesContainer){

      return;

    }


    slidesContainer.innerHTML =
      slides
        .map(
          (slide,index) => `

            <article
              class="slide ${
                index === 0
                  ? "active"
                  : ""
              }"
            >

              ${
                slide.image
                  ? `
                    <img
                      class="slide-image"
                      src="${escapeHTML(slide.image)}"
                      alt="${escapeHTML(
                        slide.title ||
                        "Akhi Engineering Workshop"
                      )}"
                      ${
                        index
                          ? 'loading="lazy"'
                          : ""
                      }
                      onerror="
                        this.style.display='none'
                      "
                    >
                  `
                  : ""
              }

            </article>

          `
        )
        .join("");


    renderHeroContent(
      slides[0]
    );


    renderSliderControls(
      slides.length
    );


    startSlider(
      slides
    );

  }


  function renderHeroContent(slide){

    const heroText =
      $("#heroText");


    if(!heroText){

      return;

    }


    heroText.innerHTML = `

      <h1>
        ${escapeHTML(
          slide?.title ||
          "Furniture designed for better living."
        )}
      </h1>

      <p class="hero-description">
        ${escapeHTML(
          slide?.description ||
          "Premium furniture for homes, offices and modern workspaces."
        )}
      </p>

      <div class="hero-buttons">

        <a
          href="#shop"
          class="primary-btn"
        >
          Explore Collection

          <svg viewBox="0 0 24 24">
            <path d="M5 12h13"></path>
            <path d="M13 6l6 6-6 6"></path>
          </svg>

        </a>

        <a
          href="#contact"
          class="secondary-btn"
        >
          Talk to us
        </a>

      </div>

    `;

  }


  function renderSliderControls(count){

    const controls =
      $("#sliderControls");


    if(!controls){

      return;

    }


    if(count <= 1){

      controls.innerHTML = "";

      return;

    }


    controls.innerHTML =
      Array
        .from(
          {length:count},
          (_,index) => `

            <button
              class="slider-dot ${
                index === 0
                  ? "active"
                  : ""
              }"
              data-slide="${index}"
              aria-label="Go to slide ${
                index + 1
              }"
            ></button>

          `
        )
        .join("");

  }


  function changeSlide(index,slides){

    state.slide =
      index;


    $$(".slide")
      .forEach(
        (slide,indexValue) => {

          slide.classList.toggle(
            "active",
            indexValue === index
          );

        }
      );


    $$(".slider-dot")
      .forEach(
        (dot,indexValue) => {

          dot.classList.toggle(
            "active",
            indexValue === index
          );

        }
      );


    renderHeroContent(
      slides[index]
    );

  }


  function startSlider(slides){

    if(state.slideTimer){

      clearInterval(
        state.slideTimer
      );

      state.slideTimer =
        null;

    }


    if(
      slides.length <= 1 ||
      window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches
    ){

      return;

    }


    state.slideTimer =
      setInterval(
        () => {

          changeSlide(
            (
              state.slide + 1
            ) % slides.length,

            slides
          );

        },
        6500
      );

  }


  /* =======================================================
     CATEGORIES
     ======================================================= */

  function getCategories(){

    return [
      ...new Set(
        state.products
          .map(
            product =>
              product.category
          )
          .filter(Boolean)
      )
    ];

  }


  function renderCategories(){

    const categories =
      getCategories();


    const categoryGrid =
      $("#categoryGrid");


    if(categoryGrid){

      categoryGrid.innerHTML =
        categories.length

          ? categories
              .map(
                (category,index) => {

                  const product =
                    state.products.find(
                      item =>
                        item.category ===
                          category &&
                        item.image
                    );


                  return `

                    <button
                      class="category"
                      data-category="${escapeHTML(
                        category
                      )}"
                    >

                      <div class="category-image">

                        ${
                          product
                            ? `
                              <img
                                src="${escapeHTML(
                                  product.image
                                )}"
                                alt="${escapeHTML(
                                  category
                                )}"
                                loading="lazy"
                                onerror="
                                  this.style.display='none'
                                "
                              >
                            `
                            : ""
                        }

                      </div>

                      <div class="category-content">

                        <div class="category-number">
                          ${String(
                            index + 1
                          ).padStart(2,"0")}
                        </div>

                        <div class="category-title">
                          ${escapeHTML(
                            category
                          )}
                        </div>

                      </div>

                    </button>

                  `;

                }
              )
              .join("")

          : `
            <div class="empty">
              Categories will appear here.
            </div>
          `;

    }


    const navCategories =
      $("#navCategories");


    if(navCategories){

      navCategories.innerHTML =
        categories
          .slice(0,6)
          .map(
            category => `

              <button
                data-category="${escapeHTML(
                  category
                )}"
              >
                ${escapeHTML(
                  category
                )}
              </button>

            `
          )
          .join("");

    }


    const footerCategories =
      $("#footerCategories");


    if(footerCategories){

      footerCategories.innerHTML =
        categories
          .map(
            category => `

              <a
                href="#shop"
                data-category="${escapeHTML(
                  category
                )}"
              >
                ${escapeHTML(
                  category
                )}
              </a>

            `
          )
          .join("");

    }


    const filter =
      $("#productFilter");


    if(filter){

      filter.innerHTML =
        [
          "All",
          ...categories
        ]
          .map(
            category => `

              <button
                class="filter-btn ${
                  category === "All"
                    ? "active"
                    : ""
                }"
                data-filter="${escapeHTML(
                  category
                )}"
              >
                ${
                  category === "All"
                    ? "All"
                    : escapeHTML(
                        category
                      )
                }
              </button>

            `
          )
          .join("");

    }

  }


  /* =======================================================
     PRICE
     ======================================================= */

  function formatPrice(value){

    const text =
      String(value ?? "")
        .trim();


    if(/^\d+$/.test(text)){

      return (
        "৳" +
        Number(text)
          .toLocaleString("en-US")
      );

    }


    return text;

  }


  /* =======================================================
     PRODUCT RENDERING
     ======================================================= */

  function getFilteredProducts(){

    return state.products.filter(
      product => {

        const categoryMatch =
          state.category === "All" ||
          product.category ===
            state.category;


        const searchableText = (

          product.title ||

          ""

        ) + " " + (

          product.description ||

          ""

        ) + " " + (

          product.category ||

          "");


        const searchMatch =
          searchableText
            .toLowerCase()
            .includes(
              state.search
            );


        return (
          categoryMatch &&
          searchMatch
        );

      }
    );

  }


  function renderProducts(){

    const grid =
      $("#productGrid");


    if(!grid){

      return;

    }


    const filtered =
      getFilteredProducts();


    const title =
      $("#productTitle");


    if(title){

      title.textContent =
        state.category === "All"
          ? "All products"
          : state.category;

    }


    const count =
      $("#resultCount");


    if(count){

      count.textContent =
        `Showing ${
          filtered.length
        } of ${
          state.products.length
        } products`;

    }


    if(!filtered.length){

      grid.innerHTML = `

        <div class="empty">

          No products match your search.

        </div>

      `;

      return;

    }


    grid.innerHTML =
      filtered
        .map(
          product =>
            renderProduct(
              product
            )
        )
        .join("");

  }


  function renderProduct(product){

    const name =
      state.settings.name ||
      "Akhi Engineering Workshop";


    const message =
      `Hello ${name}, I want to know about: ${product.title}`;


    const href =
      window.AKI_WHATSAPP
        ? window.AKI_WHATSAPP(
            message
          )
        : "#contact";


    return `

      <article class="product">

        <div class="product-media">

          ${
            product.demo
              ? `
                <span class="sample">
                  Sample
                </span>
              `
              : ""
          }

          ${
            product.image
              ? `
                <img
                  src="${escapeHTML(
                    product.image
                  )}"
                  alt="${escapeHTML(
                    product.title
                  )}"
                  loading="lazy"
                  onerror="
                    this.style.display='none'
                  "
                >
              `
              : ""
          }

        </div>


        <div class="product-info">

          <div class="product-category">
            ${escapeHTML(
              product.category ||
              "Furniture"
            )}
          </div>

          <h3 class="product-name">
            ${escapeHTML(
              product.title ||
              "Furniture"
            )}
          </h3>

          <div class="product-bottom">

            <div class="product-price">

              ${
                product.price
                  ? escapeHTML(
                      formatPrice(
                        product.price
                      )
                    )
                  : "Contact for price"
              }

            </div>

            <a
              class="enquire"
              href="${escapeHTML(href)}"
              target="_blank"
              rel="noopener"
            >

              Enquire

              <svg viewBox="0 0 24 24">
                <path d="M5 12h13"></path>
                <path d="M13 6l6 6-6 6"></path>
              </svg>

            </a>

          </div>

        </div>

      </article>

    `;

  }


  /* =======================================================
     HEADER
     ======================================================= */

  function setupHeader(){

    const header =
      $("#header");


    if(!header){

      return;

    }


    const navigation =
      $("#nav");


    const updateHeader =
      () => {

        header.classList.toggle(
          "scrolled",
          window.scrollY > 40
        );

      };


    window.addEventListener(
      "scroll",
      updateHeader,
      {
        passive:true
      }
    );


    updateHeader();


    const menuButton =
      $("#menuButton");


    if(menuButton){

      menuButton.addEventListener(
        "click",
        () => {

          navigation?.classList.toggle(
            "open"
          );

        }
      );

    }


    const searchButton =
      $("#searchButton");


    const searchPanel =
      $("#searchPanel");


    if(
      searchButton &&
      searchPanel
    ){

      searchButton.addEventListener(
        "click",
        () => {

          searchPanel.classList.toggle(
            "open"
          );


          if(
            searchPanel.classList.contains(
              "open"
            )
          ){

            setTimeout(
              () =>
                $("#searchInput")?.focus(),
              80
            );

          }

        }
      );

    }

  }


  /* =======================================================
     EVENT DELEGATION
     ======================================================= */

  function setupEvents(){

    document.addEventListener(
      "click",
      event => {

        const category =
          event.target.closest(
            "[data-category]"
          );


        if(category){

          state.category =
            category.dataset.category;


          renderProducts();


          $("#nav")
            ?.classList.remove(
              "open"
            );


          document
            .querySelector("#shop")
            ?.scrollIntoView({
              behavior:
                window.matchMedia(
                  "(prefers-reduced-motion: reduce)"
                ).matches
                  ? "auto"
                  : "smooth"
            });


          return;

        }


        const filter =
          event.target.closest(
            "[data-filter]"
          );


        if(filter){

          state.category =
            filter.dataset.filter;


          $$(".filter-btn")
            .forEach(
              button => {

                button.classList.toggle(
                  "active",
                  button.dataset.filter ===
                    state.category
                );

              }
            );


          renderProducts();


          return;

        }


        const slide =
          event.target.closest(
            "[data-slide]"
          );


        if(slide){

          const slides =
            getHeroSlides();


          changeSlide(
            Number(
              slide.dataset.slide
            ),
            slides
          );

        }

      }
    );

  }


  /* =======================================================
     SEARCH
     ======================================================= */

  function setupSearch(){

    const input =
      $("#searchInput");


    if(!input){

      return;

    }


    input.addEventListener(
      "input",
      event => {

        state.search =
          event.target.value
            .trim()
            .toLowerCase();


        renderProducts();

      }
    );


    document.addEventListener(
      "keydown",
      event => {

        if(
          event.key === "/" &&
          document.activeElement !== input
        ){

          event.preventDefault();

          $("#searchPanel")
            ?.classList.add(
              "open"
            );

          input.focus();

        }


        if(event.key === "Escape"){

          $("#searchPanel")
            ?.classList.remove(
              "open"
            );

          $("#nav")
            ?.classList.remove(
              "open"
            );

        }

      }
    );

  }


  /* =======================================================
     SCROLL REVEAL
     ======================================================= */

  function setupReveal(){

    const elements =
      $$(".reveal");


    if(!elements.length){

      return;

    }


    if(
      !("IntersectionObserver" in window)
    ){

      elements.forEach(
        element =>
          element.classList.add(
            "visible"
          )
      );

      return;

    }


    const observer =
      new IntersectionObserver(
        entries => {

          entries.forEach(
            entry => {

              if(
                entry.isIntersecting
              ){

                entry.target.classList.add(
                  "visible"
                );


                observer.unobserve(
                  entry.target
                );

              }

            }
          );

        },
        {
          threshold:.12,
          rootMargin:"0px 0px -40px"
        }
      );


    elements.forEach(
      element =>
        observer.observe(element)
    );

  }


  /* =======================================================
     IMAGE ERROR HANDLING
     ======================================================= */

  function setupGlobalImageFallback(){

    document.addEventListener(
      "error",
      event => {

        if(
          event.target.tagName !==
          "IMG"
        ){

          return;

        }


        event.target.classList.add(
          "image-error"
        );

      },
      true
    );

  }


  /* =======================================================
     INIT
     ======================================================= */

  async function init(){

    await loadFirebase();


    if(!state.products.length){

      state.products =
        [...DEMO_PRODUCTS];

    }


    setupBrand();

    setupContact();

    renderFooter();

    renderHero();

    renderCategories();

    renderProducts();

    setupHeader();

    setupEvents();

    setupSearch();

    setupReveal();

    setupGlobalImageFallback();


    document.documentElement
      .classList.add(
        "app-ready"
      );

  }


  /* =======================================================
     START
     ======================================================= */

  init()
    .catch(
      error => {

        console.error(
          "[AKHI] Application failed:",
          error
        );

      }
    );

})();
