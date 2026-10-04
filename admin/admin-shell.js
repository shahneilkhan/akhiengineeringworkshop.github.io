/*
============================================================
AKHI ENGINEERING WORKSHOP
GLOBAL ADMIN SHELL
Version: 1.0

Purpose:
- Consistent admin navigation
- Role-aware privileged controls
- Mobile admin menu
- Active page detection
- Session information
- Logout
- Website shortcut
- Developer → SNK promotion
- No Firebase dependency
- Does not expose Super Admin controls to normal Admin
============================================================
*/

(function(){

  "use strict";


  /* ========================================================
     BOOT GUARD
  ======================================================== */

  if(
    !window.AKIAdmin ||
    typeof AKIAdmin.requireAuth !== "function"
  ){

    return;

  }


  if(
    !AKIAdmin.requireAuth()
  ){

    return;

  }


  /* ========================================================
     PATH HELPERS
  ======================================================== */

  function getAdminRoot(){

    const path =
      window.location.pathname;


    const marker =
      "/admin/";


    const index =
      path.indexOf(
        marker
      );


    if(index === -1){

      return "./";

    }


    return (
      path.slice(
        0,
        index + marker.length
      )
    );

  }


  const ADMIN_ROOT =
    getAdminRoot();


  function adminUrl(
    file
  ){

    return (
      ADMIN_ROOT +
      file
    );

  }


  function isSuperAdmin(){

    try{

      return (
        typeof AKIAdmin.isSuperAdmin ===
          "function" &&
        AKIAdmin.isSuperAdmin()
      );

    }catch{

      return false;

    }

  }


  function getSession(){

    try{

      return (
        typeof AKIAdmin.getSession ===
          "function"
          ? AKIAdmin.getSession()
          : null
      );

    }catch{

      return null;

    }

  }


  const session =
    getSession();


  if(!session){

    return;

  }


  /* ========================================================
     CURRENT PAGE
  ======================================================== */

  const currentPath =
    window.location.pathname
      .toLowerCase();


  function currentFile(){

    let file =
      currentPath
        .split("/")
        .filter(Boolean)
        .pop() ||
      "dashboard.html";


    if(
      file.includes(".")
    ){

      return file;

    }


    return "dashboard.html";

  }


  const current =
    currentFile();


  /* ========================================================
     NAVIGATION
  ======================================================== */

  const PUBLIC_ITEMS = [

    {
      file:
        "dashboard.html",

      label:
        "Dashboard",

      icon:
        "⌂",

      description:
        "Overview & controls"

    },

    {
      file:
        "homepage.html",

      label:
        "Homepage",

      icon:
        "H",

      description:
        "Homepage CMS"

    },

    {
      file:
        "banner.html",

      label:
        "Banners",

      icon:
        "B",

      description:
        "Banner management"

    },

    {
      file:
        "projects.html",

      label:
        "Projects",

      icon:
        "P",

      description:
        "Workshop projects"

    },

    {
      file:
        "media.html",

      label:
        "Media",

      icon:
        "M",

      description:
        "Images & media"

    },

    {
      file:
        "settings.html",

      label:
        "Site Settings",

      icon:
        "S",

      description:
        "Business & website settings"

    },

    {
      file:
        "activity.html",

      label:
        "Activity Log",

      icon:
        "A",

      description:
        "Administrative activity"

    },

    {
      file:
        "backup.html",

      label:
        "Backup",

      icon:
        "R",

      description:
        "Backup & recovery"

    }

  ];


  const PRIVILEGED_ITEMS = [

    {
      file:
        "admins.html",

      label:
        "Admin Management",

      icon:
        "U",

      description:
        "Authorized accounts"

    },

    {
      file:
        "security.html",

      label:
        "Security Center",

      icon:
        "✓",

      description:
        "Security controls"

    },

    {
      file:
        "qa.html",

      label:
        "Final QA",

      icon:
        "Q",

      description:
        "Production readiness"

    }

  ];


  /* ========================================================
     STYLE
  ======================================================== */

  const style =
    document.createElement(
      "style"
    );


  style.id =
    "aki-admin-shell-style";


  style.textContent = `

    #akiAdminLauncher,
    #akiAdminDrawer,
    #akiAdminOverlay{

      font-family:
        Inter,
        system-ui,
        -apple-system,
        BlinkMacSystemFont,
        "Segoe UI",
        sans-serif;

    }


    #akiAdminLauncher{

      position:fixed;

      right:20px;

      top:20px;

      z-index:999999;

      display:flex;

      align-items:center;

      gap:9px;

      height:44px;

      padding:
        0 13px;

      border:
        1px solid
        rgba(255,255,255,.14);

      border-radius:12px;

      background:
        rgba(12,12,12,.84);

      color:#fff;

      backdrop-filter:
        blur(18px);

      -webkit-backdrop-filter:
        blur(18px);

      box-shadow:
        0 18px 60px
        rgba(0,0,0,.35);

      cursor:pointer;

      user-select:none;

      transition:
        .22s ease;

      font-size:11px;

      font-weight:800;

      letter-spacing:.04em;

    }


    #akiAdminLauncher:hover{

      transform:
        translateY(-1px);

      border-color:
        rgba(255,255,255,.26);

      background:
        rgba(22,22,22,.92);

    }


    #akiAdminLauncher .aki-menu-dot{

      width:8px;

      height:8px;

      border-radius:50%;

      background:
        #65e6be;

      box-shadow:
        0 0 13px
        rgba(101,230,190,.55);

    }


    #akiAdminOverlay{

      position:fixed;

      inset:0;

      z-index:999997;

      background:
        rgba(0,0,0,.52);

      opacity:0;

      pointer-events:none;

      transition:
        .25s ease;

      backdrop-filter:
        blur(3px);

      -webkit-backdrop-filter:
        blur(3px);

    }


    #akiAdminOverlay.aki-open{

      opacity:1;

      pointer-events:auto;

    }


    #akiAdminDrawer{

      position:fixed;

      right:0;

      top:0;

      bottom:0;

      z-index:999998;

      width:
        min(
          390px,
          92vw
        );

      display:flex;

      flex-direction:column;

      background:
        linear-gradient(
          145deg,
          #141414,
          #090909
        );

      border-left:
        1px solid
        rgba(255,255,255,.10);

      box-shadow:
        -30px 0 100px
        rgba(0,0,0,.55);

      transform:
        translateX(105%);

      transition:
        transform .28s cubic-bezier(
          .2,
          .7,
          .2,
          1
        );

    }


    #akiAdminDrawer.aki-open{

      transform:
        translateX(0);

    }


    .aki-shell-head{

      padding:
        20px 18px 16px;

      border-bottom:
        1px solid
        rgba(255,255,255,.08);

    }


    .aki-shell-top{

      display:flex;

      align-items:center;

      justify-content:space-between;

      gap:12px;

    }


    .aki-shell-brand{

      display:flex;

      align-items:center;

      gap:11px;

    }


    .aki-shell-mark{

      width:40px;

      height:40px;

      border-radius:12px;

      display:grid;

      place-items:center;

      border:
        1px solid
        rgba(255,255,255,.14);

      background:#0b0b0b;

      color:#fff;

      font-size:12px;

      font-weight:900;

      letter-spacing:.08em;

    }


    .aki-shell-brand strong{

      display:block;

      font-size:12px;

      color:#fff;

    }


    .aki-shell-brand span{

      display:block;

      margin-top:4px;

      color:#747474;

      font-size:9px;

      letter-spacing:.08em;

      text-transform:uppercase;

    }


    .aki-shell-close{

      width:34px;

      height:34px;

      border-radius:10px;

      border:
        1px solid
        rgba(255,255,255,.10);

      background:#111;

      color:#aaa;

      cursor:pointer;

      font-size:17px;

      line-height:1;

    }


    .aki-shell-user{

      margin-top:15px;

      padding:
        12px;

      border:
        1px solid
        rgba(255,255,255,.07);

      border-radius:13px;

      background:
        rgba(255,255,255,.025);

    }


    .aki-shell-user-name{

      color:#fff;

      font-size:12px;

      font-weight:700;

    }


    .aki-shell-user-email{

      margin-top:4px;

      color:#777;

      font-size:10px;

      overflow:hidden;

      text-overflow:ellipsis;

      white-space:nowrap;

    }


    .aki-shell-user-badge{

      display:inline-flex;

      margin-top:8px;

      padding:
        5px 8px;

      border-radius:999px;

      background:
        rgba(101,230,190,.07);

      border:
        1px solid
        rgba(101,230,190,.14);

      color:#9af6dd;

      font-size:8px;

      font-weight:900;

      letter-spacing:.10em;

      text-transform:uppercase;

    }


    .aki-shell-scroll{

      flex:1;

      overflow:auto;

      padding:
        14px;

    }


    .aki-shell-section{

      margin-bottom:17px;

    }


    .aki-shell-section-title{

      padding:
        0 6px 8px;

      color:#555;

      font-size:8px;

      font-weight:800;

      letter-spacing:.15em;

      text-transform:uppercase;

    }


    .aki-shell-nav{

      display:grid;

      gap:6px;

    }


    .aki-shell-link{

      display:grid;

      grid-template-columns:
        34px
        1fr
        16px;

      align-items:center;

      gap:10px;

      min-height:48px;

      padding:
        7px 10px;

      border:
        1px solid
        transparent;

      border-radius:12px;

      color:#b4b4b4;

      background:
        transparent;

      transition:
        .18s ease;

    }


    .aki-shell-link:hover{

      background:
        rgba(255,255,255,.045);

      border-color:
        rgba(255,255,255,.07);

      color:#fff;

    }


    .aki-shell-link.aki-active{

      color:#dffff4;

      background:
        rgba(101,230,190,.07);

      border-color:
        rgba(101,230,190,.13);

    }


    .aki-shell-link.aki-privileged{

      border-color:
        rgba(198,165,91,.09);

    }


    .aki-shell-icon{

      width:34px;

      height:34px;

      display:grid;

      place-items:center;

      border-radius:10px;

      background:#101010;

      color:#7f7f7f;

      border:
        1px solid
        rgba(255,255,255,.06);

      font-size:10px;

      font-weight:900;

    }


    .aki-shell-link.aki-active
    .aki-shell-icon{

      color:#a9ffe5;

      background:
        rgba(101,230,190,.06);

      border-color:
        rgba(101,230,190,.12);

    }


    .aki-shell-link-main{

      min-width:0;

    }


    .aki-shell-link-title{

      font-size:11px;

      font-weight:700;

    }


    .aki-shell-link-description{

      margin-top:3px;

      color:#5d5d5d;

      font-size:9px;

      white-space:nowrap;

      overflow:hidden;

      text-overflow:ellipsis;

    }


    .aki-shell-arrow{

      color:#444;

      font-size:12px;

    }


    .aki-shell-divider{

      height:1px;

      background:
        rgba(255,255,255,.07);

      margin:
        4px 0 15px;

    }


    .aki-shell-bottom{

      padding:
        13px 14px;

      border-top:
        1px solid
        rgba(255,255,255,.08);

      background:
        rgba(0,0,0,.14);

    }


    .aki-shell-bottom-grid{

      display:grid;

      grid-template-columns:
        1fr 1fr;

      gap:7px;

    }


    .aki-shell-action{

      min-height:38px;

      display:flex;

      align-items:center;

      justify-content:center;

      gap:6px;

      border:
        1px solid
        rgba(255,255,255,.08);

      border-radius:10px;

      background:#101010;

      color:#aaa;

      cursor:pointer;

      font-size:9px;

      font-weight:800;

      text-decoration:none;

    }


    .aki-shell-action:hover{

      color:#fff;

      border-color:
        rgba(255,255,255,.16);

    }


    .aki-shell-developer{

      display:flex;

      align-items:center;

      justify-content:center;

      gap:6px;

      margin-top:9px;

      color:#656565;

      font-size:8px;

      text-decoration:none;

    }


    .aki-shell-developer strong{

      color:#a0a0a0;

    }


    .aki-shell-developer:hover{

      color:#fff;

    }


    body.aki-admin-shell-active
    #akiAdminLauncher{

      display:flex;

    }


    @media(max-width:600px){

      #akiAdminLauncher{

        right:12px;

        top:12px;

      }

      #akiAdminDrawer{

        width:
          min(
            92vw,
            365px
          );

      }

    }

  `;


  document.head.appendChild(
    style
  );


  /* ========================================================
     REMOVE OLD SHELL IF ANY
  ======================================================== */

  const oldLauncher =
    document.getElementById(
      "akiAdminLauncher"
    );


  const oldDrawer =
    document.getElementById(
      "akiAdminDrawer"
    );


  const oldOverlay =
    document.getElementById(
      "akiAdminOverlay"
    );


  if(oldLauncher) oldLauncher.remove();

  if(oldDrawer) oldDrawer.remove();

  if(oldOverlay) oldOverlay.remove();


  /* ========================================================
     LAUNCHER
  ======================================================== */

  const launcher =
    document.createElement(
      "button"
    );


  launcher.id =
    "akiAdminLauncher";

  launcher.type =
    "button";

  launcher.setAttribute(
    "aria-label",
    "Open admin navigation"
  );


  launcher.innerHTML = `

    <span
      class="aki-menu-dot">
    </span>

    <span>
      Admin Menu
    </span>

    <span>
      ☰
    </span>

  `;


  /* ========================================================
     OVERLAY
  ======================================================== */

  const overlay =
    document.createElement(
      "div"
    );


  overlay.id =
    "akiAdminOverlay";


  /* ========================================================
     DRAWER
  ======================================================== */

  const drawer =
    document.createElement(
      "aside"
    );


  drawer.id =
    "akiAdminDrawer";


  /* ========================================================
     HEADER
  ======================================================== */

  const head =
    document.createElement(
      "div"
    );


  head.className =
    "aki-shell-head";


  const sessionName =
    session.name ||
    session.email ||
    "Admin";


  const sessionEmail =
    session.email ||
    "";


  /*
    Do NOT expose "SUPER ADMIN" label.
    Normal admin never sees that concept,
    and privileged mode remains intentionally quiet.
  */

  const roleLabel =
    isSuperAdmin()
      ? "PRIVATE CONTROL"
      : "ADMIN";


  head.innerHTML = `

    <div class="aki-shell-top">

      <div class="aki-shell-brand">

        <div class="aki-shell-mark">
          AK
        </div>

        <div>

          <strong>
            AKHI Engineering
          </strong>

          <span>
            Workshop Administration
          </span>

        </div>

      </div>


      <button
        type="button"
        class="aki-shell-close"
        id="akiShellClose"
        aria-label="Close menu">

        ×

      </button>

    </div>


    <div class="aki-shell-user">

      <div class="aki-shell-user-name">
        ${escapeHtml(sessionName)}
      </div>

      <div class="aki-shell-user-email">
        ${escapeHtml(sessionEmail)}
      </div>

      <div class="aki-shell-user-badge">
        ${escapeHtml(roleLabel)}
      </div>

    </div>

  `;


  drawer.appendChild(
    head
  );


  /* ========================================================
     SCROLL AREA
  ======================================================== */

  const scroll =
    document.createElement(
      "div"
    );


  scroll.className =
    "aki-shell-scroll";


  /* ========================================================
     CREATE SECTION
  ======================================================== */

  function addSection(
    title,
    items
  ){

    if(
      !items ||
      !items.length
    ){

      return;

    }


    const section =
      document.createElement(
        "section"
      );


    section.className =
      "aki-shell-section";


    const heading =
      document.createElement(
        "div"
      );


    heading.className =
      "aki-shell-section-title";


    heading.textContent =
      title;


    section.appendChild(
      heading
    );


    const nav =
      document.createElement(
        "nav"
      );


    nav.className =
      "aki-shell-nav";


    items.forEach(
      function(item){

        const link =
          document.createElement(
            "a"
          );


        link.className =
          "aki-shell-link";


        if(
          item.file === current
        ){

          link.classList.add(
            "aki-active"
          );

        }


        if(
          title ===
          "Private Controls"
        ){

          link.classList.add(
            "aki-privileged"
          );

        }


        link.href =
          adminUrl(
            item.file
          );


        link.innerHTML = `

          <span
            class="aki-shell-icon">

            ${escapeHtml(item.icon)}

          </span>


          <span
            class="aki-shell-link-main">

            <span
              class="aki-shell-link-title">

              ${escapeHtml(item.label)}

            </span>

            <span
              class="aki-shell-link-description">

              ${escapeHtml(item.description)}

            </span>

          </span>


          <span
            class="aki-shell-arrow">

            ›

          </span>

        `;


        link.addEventListener(
          "click",
          closeDrawer
        );


        nav.appendChild(
          link
        );

      }
    );


    section.appendChild(
      nav
    );


    scroll.appendChild(
      section
    );

  }


  addSection(
    "Workspace",
    PUBLIC_ITEMS
  );


  if(
    isSuperAdmin()
  ){

    const divider =
      document.createElement(
        "div"
      );


    divider.className =
      "aki-shell-divider";


    scroll.appendChild(
      divider
    );


    addSection(
      "Private Controls",
      PRIVILEGED_ITEMS
    );

  }


  drawer.appendChild(
    scroll
  );


  /* ========================================================
     FOOTER
  ======================================================== */

  const bottom =
    document.createElement(
      "div"
    );


  bottom.className =
    "aki-shell-bottom";


  const homeUrl =
    window.location.origin +
    (
      ADMIN_ROOT
        .replace(
          /admin\/$/,
          ""
        ) ||
        "/"
    );


  bottom.innerHTML = `

    <div class="aki-shell-bottom-grid">

      <a
        class="aki-shell-action"
        href="${adminUrl("dashboard.html")}">

        Dashboard

      </a>


      <a
        class="aki-shell-action"
        href="${getPublicHomeUrl()}">

        Website ↗

      </a>


      <button
        class="aki-shell-action"
        type="button"
        id="akiShellLogout">

        Logout

      </button>


      <a
        class="aki-shell-action"
        href="${getQaUrl()}">

        QA

      </a>

    </div>


    <a
      class="aki-shell-developer"
      href="https://shahneilkhan.github.io/"
      target="_blank"
      rel="noopener noreferrer">

      Developer ·
      <strong>SNK</strong>

    </a>

  `;


  drawer.appendChild(
    bottom
  );


  document.body.appendChild(
    overlay
  );

  document.body.appendChild(
    drawer
  );

  document.body.appendChild(
    launcher
  );


  document.body.classList.add(
    "aki-admin-shell-active"
  );


  /* ========================================================
     HELPERS
  ======================================================== */

  function escapeHtml(
    value
  ){

    return String(
      value ?? ""
    )
      .replace(
        /&/g,
        "&amp;"
      )
      .replace(
        /</g,
        "&lt;"
      )
      .replace(
        />/g,
        "&gt;"
      )
      .replace(
        /"/g,
        "&quot;"
      )
      .replace(
        /'/g,
        "&#039;"
      );

  }


  function getPublicHomeUrl(){

    const path =
      window.location.pathname;


    const marker =
      "/admin/";


    const index =
      path.indexOf(
        marker
      );


    if(index === -1){

      return "/";

    }


    const root =
      path.slice(
        0,
        index
      );


    return (
      root ||
      "/"
    );

  }


  function getQaUrl(){

    if(
      isSuperAdmin()
    ){

      return adminUrl(
        "qa.html"
      );

    }


    return adminUrl(
      "dashboard.html"
    );

  }


  /* ========================================================
     OPEN / CLOSE
  ======================================================== */

  function openDrawer(){

    drawer.classList.add(
      "aki-open"
    );

    overlay.classList.add(
      "aki-open"
    );

    launcher.setAttribute(
      "aria-expanded",
      "true"
    );

    document.body.style.overflow =
      "hidden";

  }


  function closeDrawer(){

    drawer.classList.remove(
      "aki-open"
    );

    overlay.classList.remove(
      "aki-open"
    );

    launcher.setAttribute(
      "aria-expanded",
      "false"
    );

    document.body.style.overflow =
      "";

  }


  function toggleDrawer(){

    if(
      drawer.classList.contains(
        "aki-open"
      )
    ){

      closeDrawer();

    }else{

      openDrawer();

    }

  }


  launcher.addEventListener(
    "click",
    toggleDrawer
  );


  overlay.addEventListener(
    "click",
    closeDrawer
  );


  document
    .getElementById(
      "akiShellClose"
    )
    .addEventListener(
      "click",
      closeDrawer
    );


  document.addEventListener(
    "keydown",
    function(event){

      if(
        event.key ===
        "Escape"
      ){

        closeDrawer();

      }

    }
  );


  /* ========================================================
     LOGOUT
  ======================================================== */

  document
    .getElementById(
      "akiShellLogout"
    )
    .addEventListener(
      "click",
      async function(){

        const confirmed =
          window.confirm(
            "Sign out of the AKHI administration?"
          );


        if(
          !confirmed
        ){

          return;

        }


        try{

          if(
            typeof AKIAdmin.logout ===
            "function"
          ){

            await AKIAdmin.logout(
              true
            );

          }else{

            window.location.href =
              adminUrl(
                "login/index.html"
              );

          }

        }catch{

          window.location.href =
            adminUrl(
              "login/index.html"
            );

        }

      }
    );


  /* ========================================================
     SESSION TOUCH
  ======================================================== */

  try{

    if(
      typeof AKIAdmin.touch ===
      "function"
    ){

      AKIAdmin.touch();

    }

  }catch{}


  /* ========================================================
     PUBLIC API
  ======================================================== */

  window.AKIAdminShell = {

    version:
      "1.0",

    open:
      openDrawer,

    close:
      closeDrawer,

    toggle:
      toggleDrawer,

    root:
      ADMIN_ROOT

  };


})();
