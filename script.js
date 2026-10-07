(() => {
  "use strict";

  const $ = (s, p = document) => p.querySelector(s);
  const $$ = (s, p = document) => [...p.querySelectorAll(s)];

  /* =========================================
     DEMO DATA
  ========================================= */

  const DEMO_PRODUCTS = [

    {
      id:"p01",
      name:"Modern Lounge Sofa",
      category:"Living Room",
      price:"৳ 78,000",
      meta:"Premium fabric",
      match:98,
      image:"https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=900&q=78"
    },

    {
      id:"p02",
      name:"Soft Curve Armchair",
      category:"Living Room",
      price:"৳ 32,500",
      meta:"Oak + fabric",
      match:96,
      image:"https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?auto=format&fit=crop&w=900&q=78"
    },

    {
      id:"p03",
      name:"Contemporary Bed",
      category:"Bedroom",
      price:"৳ 68,000",
      meta:"Solid wood",
      match:97,
      image:"https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=900&q=78"
    },

    {
      id:"p04",
      name:"Minimal Bedroom Set",
      category:"Bedroom",
      price:"৳ 1,25,000",
      meta:"Wood finish",
      match:94,
      image:"https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&w=900&q=78"
    },

    {
      id:"p05",
      name:"Elegant Dining Table",
      category:"Dining",
      price:"৳ 59,000",
      meta:"Natural wood",
      match:95,
      image:"https://images.unsplash.com/photo-1617806118233-18e1de247200?auto=format&fit=crop&w=900&q=78"
    },

    {
      id:"p06",
      name:"Modern Dining Chair",
      category:"Dining",
      price:"৳ 12,500",
      meta:"Premium fabric",
      match:91,
      image:"https://images.unsplash.com/photo-1503602642458-232111445657?auto=format&fit=crop&w=900&q=78"
    },

    {
      id:"p07",
      name:"Executive Office Desk",
      category:"Office",
      price:"৳ 54,000",
      meta:"Engineered wood",
      match:99,
      image:"https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=900&q=78"
    },

    {
      id:"p08",
      name:"Ergonomic Office Chair",
      category:"Office",
      price:"৳ 29,500",
      meta:"Mesh + steel",
      match:98,
      image:"https://images.unsplash.com/photo-1580480055273-228ff5388ef8?auto=format&fit=crop&w=900&q=78"
    },

    {
      id:"p09",
      name:"Minimal Side Table",
      category:"Living Room",
      price:"৳ 15,500",
      meta:"Solid oak",
      match:93,
      image:"https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?auto=format&fit=crop&w=900&q=78"
    },

    {
      id:"p10",
      name:"Classic Lounge Chair",
      category:"Living Room",
      price:"৳ 39,000",
      meta:"Premium leather",
      match:95,
      image:"https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?auto=format&fit=crop&w=900&q=78"
    },

    {
      id:"p11",
      name:"Outdoor Relax Chair",
      category:"Outdoor",
      price:"৳ 18,000",
      meta:"Weather resistant",
      match:89,
      image:"https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=900&q=78"
    },

    {
      id:"p12",
      name:"Premium Workstation",
      category:"Office",
      price:"৳ 72,000",
      meta:"Walnut finish",
      match:97,
      image:"https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=900&q=78"
    }

  ];


  const DEMO_BANNERS = [
    {
      title:"Furniture that understands your space.",
      description:"Discover intelligent furniture for modern living.",
      image:"https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1800&q=84"
    },
    {
      title:"Design your everyday.",
      description:"Thoughtful forms for beautiful interiors.",
      image:"https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1800&q=84"
    },
    {
      title:"Work better. Live better.",
      description:"Furniture for focused modern workspaces.",
      image:"https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&w=1800&q=84"
    }
  ];


  let products = [...DEMO_PRODUCTS];
  let currentCategory = "all";
  let currentSlide = 0;
  let slideTimer = null;


  /* =========================================
     THEME
  ========================================= */

  function initTheme(){

    const root = document.documentElement;
    const button = $("#themeToggle");

    if(!button) return;

    let theme = root.dataset.theme || "dark";

    if(theme !== "light" && theme !== "dark"){
      theme = "dark";
    }

    applyTheme(theme);

    button.addEventListener("click", () => {

      const next =
        root.dataset.theme === "light"
          ? "dark"
          : "light";

      applyTheme(next);

      try{
        localStorage.setItem("akhi-theme",next);
      }catch(e){}

    });


    function applyTheme(theme){

      root.dataset.theme = theme;

      button.setAttribute(
        "aria-pressed",
        theme === "light" ? "true" : "false"
      );

      button.setAttribute(
        "aria-label",
        theme === "light"
          ? "Switch to dark mode"
          : "Switch to light mode"
      );

    }
  }


  /* =========================================
     HEADER
  ========================================= */

  function initHeader(){

    const header = $("#hd");
    const menu = $("#mm");
    const nav = $("#nv");

    if(!header) return;

    const update = () => {
      header.classList.toggle(
        "scrolled",
        window.scrollY > 20
      );
    };

    update();

    window.addEventListener(
      "scroll",
      update,
      {passive:true}
    );


    if(menu && nav){

      menu.addEventListener("click",() => {
        nav.classList.toggle("open");
      });

      $$("#nv a").forEach(link => {

        link.addEventListener("click",() => {
          nav.classList.remove("open");
        });

      });

    }

  }


  /* =========================================
     SEARCH
  ========================================= */

  function initSearch(){

    const button = $("#sb");
    const panel = $("#sp");
    const close = $("#searchClose");
    const input = $("#q");
    const results = $("#searchResults");

    if(!button || !panel) return;


    button.addEventListener("click",() => {

      panel.classList.add("open");

      setTimeout(() => {
        input?.focus();
      },150);

    });


    close?.addEventListener("click",() => {
      panel.classList.remove("open");
    });


    input?.addEventListener("input",() => {

      const query = input.value
        .trim()
        .toLowerCase();

      if(!query){
        results.innerHTML = "";
        return;
      }

      const found = products
        .filter(p =>
          `${p.name} ${p.category} ${p.meta}`
            .toLowerCase()
            .includes(query)
        )
        .slice(0,6);


      if(!found.length){

        results.innerHTML = `
          <div class="search-result">
            <strong>No furniture found</strong>
            <small>Try another style, room or material.</small>
          </div>
        `;

        return;
      }


      results.innerHTML = found.map(p => `
        <a class="search-result" href="#shop">
          <strong>${escapeHTML(p.name)}</strong>
          <small>${escapeHTML(p.category)} · ${escapeHTML(p.price)}</small>
        </a>
      `).join("");

    });

  }


  /* =========================================
     HERO
  ========================================= */

  function initHero(){

    const slides = $$(".slide");
    const dots = $("#dots");
    const counter = $("#heroCurrent");

    if(!slides.length || !dots) return;

    dots.innerHTML = slides.map((_,i) => `
      <button
        class="dot ${i===0?"active":""}"
        data-slide="${i}"
        aria-label="Go to slide ${i+1}">
      </button>
    `).join("");


    function goTo(index){

      currentSlide =
        (index + slides.length) % slides.length;


      slides.forEach((slide,i) => {
        slide.classList.toggle(
          "active",
          i === currentSlide
        );
      });


      $$(".dot",dots).forEach((dot,i) => {
        dot.classList.toggle(
          "active",
          i === currentSlide
        );
      });


      if(counter){
        counter.textContent =
          String(currentSlide + 1).padStart(2,"0");
      }

    }


    dots.addEventListener("click",e => {

      const dot = e.target.closest("[data-slide]");

      if(!dot) return;

      goTo(Number(dot.dataset.slide));

      restart();

    });


    function next(){
      goTo(currentSlide + 1);
    }


    function restart(){

      clearInterval(slideTimer);

      slideTimer = setInterval(
        next,
        6500
      );

    }


    restart();


    let startX = 0;

    const hero = $(".hero");

    hero?.addEventListener(
      "touchstart",
      e => {
        startX = e.touches[0].clientX;
      },
      {passive:true}
    );


    hero?.addEventListener(
      "touchend",
      e => {

        const endX = e.changedTouches[0].clientX;
        const diff = startX - endX;

        if(Math.abs(diff) > 45){

          if(diff > 0){
            goTo(currentSlide + 1);
          }else{
            goTo(currentSlide - 1);
          }

          restart();

        }

      },
      {passive:true}
    );

  }


  /* =========================================
     PRODUCTS
  ========================================= */

  function renderProducts(){

    const grid = $("#grid");
    const count = $("#resultCount");

    if(!grid) return;


    const list =
      currentCategory === "all"
        ? products
        : products.filter(
            p => p.category === currentCategory
          );


    if(count){
      count.textContent =
        `${list.length} ${list.length===1?"piece":"pieces"}`;
    }


    if(!list.length){

      grid.innerHTML = `
        <div class="empty">
          No furniture available in this category.
        </div>
      `;

      return;
    }


    grid.innerHTML = list.map((p,index) => {

      const match = Number(p.match) || 92;

      return `
        <article class="card">

          <div class="card-image">

            <img
              src="${safeURL(p.image)}"
              alt="${escapeHTML(p.name)}"
              loading="${index < 4 ? "eager" : "lazy"}"
              decoding="async">

            <span class="card-ai">
              ✦ ${match}% AI MATCH
            </span>

          </div>

          <div class="card-info">

            <span class="card-category">
              ${escapeHTML(p.category)}
            </span>

            <h3>${escapeHTML(p.name)}</h3>

            <div class="card-bottom">

              <div>
                <div class="card-price">
                  ${escapeHTML(p.price || "Price on request")}
                </div>

                <div class="card-meta">
                  ${escapeHTML(p.meta || "Premium collection")}
                </div>
              </div>

              <button
                class="card-action"
                type="button"
                data-product="${escapeHTML(p.id)}"
                aria-label="Ask AI about ${escapeHTML(p.name)}">
                →
              </button>

            </div>

          </div>

        </article>
      `;

    }).join("");


    $$(".card-action",grid).forEach(button => {

      button.addEventListener("click",() => {

        const item = products.find(
          p => p.id === button.dataset.product
        );

        if(item){

          openAI();

          setTimeout(() => {

            const input = $("#modalAiInput");

            if(input){
              input.value =
                `Tell me about ${item.name}`;
              input.focus();
            }

          },300);

        }

      });

    });

  }


  /* =========================================
     CATEGORY
  ========================================= */

  function initCategories(){

    const container = $("#bc");

    if(!container) return;


    container.addEventListener("click",e => {

      const button =
        e.target.closest("[data-category]");

      if(!button) return;

      currentCategory =
        button.dataset.category;


      $$(".category",container).forEach(btn => {
        btn.classList.toggle(
          "active",
          btn === button
        );
      });


      renderProducts();

    });

  }


  /* =========================================
     AI ENGINE
  ========================================= */

  function getAIRecommendation(query){

    const q = query.toLowerCase();

    let category = "Living Room";
    let title = "Modern Lounge Sofa";
    let score = 96;
    let reason =
      "A balanced choice for comfortable everyday living.";

    if(
      q.includes("bed") ||
      q.includes("sleep") ||
      q.includes("bedroom")
    ){

      category = "Bedroom";

      const item =
        products.find(p => p.category === "Bedroom")
        || products[2];

      title = item.name;
      score = item.match || 96;

      reason =
        "Soft proportions and a calm material palette make this a strong bedroom match.";

    }else if(
      q.includes("office") ||
      q.includes("work") ||
      q.includes("desk") ||
      q.includes("workspace")
    ){

      category = "Office";

      const item =
        products.find(p =>
          p.name.toLowerCase().includes("desk")
        )
        || products.find(p => p.category === "Office")
        || products[6];

      title = item.name;
      score = item.match || 98;

      reason =
        "Designed for focused work, practical comfort and a refined professional environment.";

    }else if(
      q.includes("dining") ||
      q.includes("dinner") ||
      q.includes("table")
    ){

      category = "Dining";

      const item =
        products.find(p =>
          p.name.toLowerCase().includes("dining table")
        )
        || products.find(p => p.category === "Dining")
        || products[4];

      title = item.name;
      score = item.match || 95;

      reason =
        "A strong match for social dining spaces where form and function need to work together.";

    }else if(
      q.includes("outdoor") ||
      q.includes("balcony") ||
      q.includes("terrace")
    ){

      category = "Outdoor";

      const item =
        products.find(p => p.category === "Outdoor")
        || products[10];

      title = item.name;
      score = item.match || 89;

      reason =
        "A practical choice for relaxed outdoor spaces and compact balconies.";

    }else if(
      q.includes("small") ||
      q.includes("minimal") ||
      q.includes("compact")
    ){

      category = "Living Room";

      const item =
        products.find(p =>
          p.name.toLowerCase().includes("side table")
        )
        || products[8];

      title = item.name;
      score = 97;

      reason =
        "Its compact footprint makes it suitable for smaller spaces without sacrificing style.";

    }else{

      const item =
        products[0];

      title = item.name;
      score = item.match || 96;

      reason =
        "A versatile starting point for a modern, warm and comfortable interior.";

    }


    return {
      category,
      title,
      score,
      reason
    };

  }


  function renderAIResult(target,input){

    if(!target || !input) return;

    const query = input.value.trim();

    if(!query){

      target.innerHTML = `
        <span class="result-label">AI RECOMMENDATION</span>

        <div class="result-placeholder">
          <span>✦</span>
          <p>Tell us about your room first.</p>
        </div>
      `;

      target.classList.remove("recommended");

      return;
    }


    const result = getAIRecommendation(query);


    target.innerHTML = `
      <span class="result-label">AI RECOMMENDATION</span>

      <div class="ai-recommendation">

        <span class="match-score">
          ${result.score}% MATCH
        </span>

        <strong>${escapeHTML(result.title)}</strong>

        <span>
          ${escapeHTML(result.reason)}
        </span>

        <small style="color:var(--accent);font-size:9px;letter-spacing:.12em">
          RECOMMENDED FOR ${escapeHTML(result.category.toUpperCase())}
        </small>

      </div>
    `;

    target.classList.add("recommended");

  }


  function initAI(){

    const input = $("#aiInput");
    const ask = $("#aiAsk");
    const result = $("#aiResult");

    const suggestions = $$(".ai-suggestions button");


    function askAI(){

      renderAIResult(
        result,
        input
      );

    }


    ask?.addEventListener(
      "click",
      askAI
    );


    input?.addEventListener(
      "keydown",
      e => {

        if(e.key === "Enter"){
          e.preventDefault();
          askAI();
        }

      }
    );


    suggestions.forEach(button => {

      button.addEventListener("click",() => {

        if(input){

          input.value =
            button.textContent.trim();

          input.focus();

          askAI();

        }

      });

    });


    const chat = $("#chat");

    chat?.addEventListener(
      "click",
      openAI
    );

  }


  /* =========================================
     AI MODAL
  ========================================= */

  function openAI(){

    const modal = $("#aiModal");

    if(!modal) return;

    modal.classList.add("open");
    modal.setAttribute(
      "aria-hidden",
      "false"
    );

    document.body.style.overflow = "hidden";

    setTimeout(() => {
      $("#modalAiInput")?.focus();
    },250);

  }


  function closeAI(){

    const modal = $("#aiModal");

    if(!modal) return;

    modal.classList.remove("open");
    modal.setAttribute(
      "aria-hidden",
      "true"
    );

    document.body.style.overflow = "";

  }


  function initAIModal(){

    $$("[data-ai-close]").forEach(el => {

      el.addEventListener(
        "click",
        closeAI
      );

    });


    document.addEventListener(
      "keydown",
      e => {

        if(e.key === "Escape"){
          closeAI();
        }

      }
    );


    const input = $("#modalAiInput");
    const ask = $("#modalAiAsk");
    const result = $("#modalAiResult");


    function run(){

      if(!input || !result) return;

      const value =
        input.value.trim();

      if(!value){

        result.innerHTML = `
          <div class="search-result">
            Please describe your room or furniture need.
          </div>
        `;

        return;

      }


      const data =
        getAIRecommendation(value);


      result.innerHTML = `
        <div class="ai-recommendation">

          <span class="match-score">
            ${data.score}% AI MATCH
          </span>

          <strong>${escapeHTML(data.title)}</strong>

          <span>${escapeHTML(data.reason)}</span>

          <span>
            Suggested category:
            <b style="color:var(--accent)">
              ${escapeHTML(data.category)}
            </b>
          </span>

        </div>
      `;

    }


    ask?.addEventListener(
      "click",
      run
    );


    input?.addEventListener(
      "keydown",
      e => {

        if(e.key === "Enter"){
          e.preventDefault();
          run();
        }

      }
    );

  }


  /* =========================================
     FIREBASE
  ========================================= */

  async function loadFirebase(){

    try{

      if(
        !window.firebase ||
        !window.AKI_FIREBASE_CONFIG
      ){
        return;
      }


      if(!firebase.apps.length){

        firebase.initializeApp(
          window.AKI_FIREBASE_CONFIG
        );

      }


      const db =
        firebase.firestore();


      const reads = await Promise.allSettled([

        db.collection("projects")
          .get(),

        db.collection("banners")
          .get(),

        db.collection("siteContent")
          .doc("home")
          .get(),

        db.collection("siteContent")
          .doc("settings")
          .get()

      ]);


      const projectResult = reads[0];

      if(
        projectResult.status === "fulfilled" &&
        !projectResult.value.empty
      ){

        const remoteProducts =
          projectResult.value.docs
            .map(d => ({
              id:d.id,
              ...d.data()
            }))
            .filter(p =>
              p.active !== false
            );


        if(remoteProducts.length){

          products =
            remoteProducts.map((p,index) => ({

              id:p.id,

              name:
                p.name ||
                p.title ||
                `AKHI Furniture ${index+1}`,

              category:
                p.category ||
                p.type ||
                "Living Room",

              price:
                p.price ||
                "Price on request",

              meta:
                p.meta ||
                p.material ||
                "Premium collection",

              match:
                p.match ||
                92,

              image:
                p.image ||
                p.imageUrl ||
                p.photo ||
                DEMO_PRODUCTS[index % DEMO_PRODUCTS.length].image

            }));


          renderProducts();

        }

      }


      const settingsResult = reads[3];

      if(
        settingsResult.status === "fulfilled" &&
        settingsResult.value.exists
      ){

        applySettings(
          settingsResult.value.data()
        );

      }


      const homeResult = reads[2];

      if(
        homeResult.status === "fulfilled" &&
        homeResult.value.exists
      ){

        applyHome(
          homeResult.value.data()
        );

      }

    }catch(error){

      console.warn(
        "AKHI Firebase load skipped:",
        error
      );

    }

  }


  function applySettings(settings){

    if(!settings) return;


    const name =
      settings.businessName ||
      settings.name ||
      settings.title;


    if(name){

      document.title =
        `${name} | Intelligent Living`;

      const footerName =
        $("#fN");

      if(footerName){
        footerName.textContent = name;
      }

    }


    if(settings.phone){

      const phone =
        normalizePhone(settings.phone);

      const call = $("#call");

      if(call){
        call.href =
          `tel:${phone}`;
      }

      const fPhone =
        $("#fPhone");

      if(fPhone){
        fPhone.textContent =
          settings.phone;
      }

    }


    if(settings.email){

      const email =
        $("#fEmail");

      if(email){
        email.textContent =
          settings.email;
      }

    }


    if(settings.address){

      const address =
        $("#fAddress");

      if(address){
        address.textContent =
          settings.address;
      }

    }


    if(settings.logo || settings.logoUrl){

      const url =
        settings.logo ||
        settings.logoUrl;

      $$(".logo-mark").forEach(el => {

        const img =
          document.createElement("img");

        img.src = url;
        img.alt = "AKHI";

        img.style.width = "100%";
        img.style.height = "100%";
        img.style.objectFit = "contain";

        el.textContent = "";
        el.appendChild(img);

      });

    }


    if(settings.favicon || settings.faviconUrl){

      const link =
        $('link[rel="icon"]');

      if(link){

        link.href =
          settings.favicon ||
          settings.faviconUrl;

      }

    }

  }


  function applyHome(data){

    if(!data) return;


    const title =
      data.heroTitle ||
      data.title;


    const description =
      data.heroDescription ||
      data.description;


    if(title){

      const heading =
        $(".hero-copy h1");

      if(heading){

        heading.innerHTML =
          escapeHTML(title);

      }

    }


    if(description){

      const paragraph =
        $(".hero-copy>p");

      if(paragraph){

        paragraph.textContent =
          description;

      }

    }

  }


  /* =========================================
     FOOTER
  ========================================= */

  function initFooter(){

    const year = $("#year");

    if(year){
      year.textContent =
        new Date().getFullYear();
    }


    const cats = $("#fCats");

    if(cats){

      cats.innerHTML = [
        "Living Room",
        "Bedroom",
        "Dining",
        "Office",
        "Outdoor"
      ].map(category => `
        <a href="#shop">${category}</a>
      `).join("");

    }

  }


  /* =========================================
     UTILITIES
  ========================================= */

  function normalizePhone(value){

    let phone =
      String(value || "")
        .replace(/[^\d+]/g,"");

    if(phone.startsWith("01")){
      phone =
        "+880" +
        phone.substring(1);
    }

    return phone;

  }


  function safeURL(value){

    const url =
      String(value || "");

    if(
      url.startsWith("https://") ||
      url.startsWith("http://") ||
      url.startsWith("./") ||
      url.startsWith("../") ||
      url.startsWith("/")
    ){
      return url;
    }

    return DEMO_PRODUCTS[0].image;

  }


  function escapeHTML(value){

    return String(value ?? "")
      .replace(/&/g,"&amp;")
      .replace(/</g,"&lt;")
      .replace(/>/g,"&gt;")
      .replace(/"/g,"&quot;")
      .replace(/'/g,"&#039;");

  }


  /* =========================================
     BOOT
  ========================================= */

  function init(){

    initTheme();
    initHeader();
    initSearch();
    initHero();

    renderProducts();

    initCategories();
    initAI();
    initAIModal();
    initFooter();


    const runFirebase =
      () => loadFirebase();


    if("requestIdleCallback" in window){

      requestIdleCallback(
        runFirebase,
        {timeout:1200}
      );

    }else{

      setTimeout(
        runFirebase,
        500
      );

    }

  }


  if(
    document.readyState === "loading"
  ){

    document.addEventListener(
      "DOMContentLoaded",
      init,
      {once:true}
    );

  }else{

    init();

  }

})();
