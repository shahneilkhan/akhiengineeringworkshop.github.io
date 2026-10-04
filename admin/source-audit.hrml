<!DOCTYPE html>
<html lang="en" data-admin-guard="true">

<head>

<meta charset="UTF-8">

<meta name="viewport"
      content="width=device-width,initial-scale=1">

<meta name="robots"
      content="noindex,nofollow,noarchive">

<title>Source Audit — AKHI Engineering Workshop</title>

<link rel="preconnect"
      href="https://fonts.googleapis.com">

<link rel="preconnect"
      href="https://fonts.gstatic.com"
      crossorigin>

<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap"
      rel="stylesheet">

<script src="./auth.js"></script>


<style>

:root{

  --bg:#070707;
  --panel:#111111;
  --panel2:#151515;

  --line:
    rgba(255,255,255,.08);

  --line2:
    rgba(255,255,255,.14);

  --text:#f4f4f4;
  --muted:#898989;

  --green:#65e6be;
  --green-bg:
    rgba(101,230,190,.08);

  --red:#ff7272;
  --red-bg:
    rgba(255,114,114,.08);

  --yellow:#ffd166;
  --yellow-bg:
    rgba(255,209,102,.08);

  --blue:#74c0fc;
  --blue-bg:
    rgba(116,192,252,.08);

}


*{
  box-sizing:border-box;
}


html,
body{

  margin:0;

  min-height:100%;

  background:
    radial-gradient(
      circle at 12% 7%,
      rgba(101,230,190,.055),
      transparent 27%
    ),

    radial-gradient(
      circle at 90% 85%,
      rgba(116,192,252,.045),
      transparent 30%
    ),

    var(--bg);

  color:
    var(--text);

  font-family:
    Inter,
    system-ui,
    -apple-system,
    BlinkMacSystemFont,
    "Segoe UI",
    sans-serif;

}


body{
  min-height:100vh;
}


button,
a{
  font:inherit;
}


button{
  cursor:pointer;
}


a{
  color:inherit;
  text-decoration:none;
}


.app{

  width:
    min(
      1400px,
      calc(100% - 28px)
    );

  margin:
    0 auto;

  padding:
    24px 0 55px;

}


.topbar{

  display:flex;

  align-items:center;

  justify-content:
    space-between;

  gap:16px;

  margin-bottom:18px;

}


.brand{

  display:flex;

  align-items:center;

  gap:12px;

}


.mark{

  width:46px;

  height:46px;

  display:grid;

  place-items:center;

  border:
    1px solid var(--line2);

  border-radius:14px;

  background:#101010;

  font-size:13px;

  font-weight:900;

  letter-spacing:.08em;

}


.brand h1{

  margin:0;

  font-size:19px;

  letter-spacing:-.03em;

}


.brand p{

  margin:4px 0 0;

  color:
    var(--muted);

  font-size:10px;

}


.actions{

  display:flex;

  flex-wrap:wrap;

  gap:8px;

}


.btn{

  min-height:42px;

  padding:
    0 14px;

  border:
    1px solid var(--line2);

  border-radius:11px;

  background:#151515;

  color:#fff;

  font-size:10px;

  font-weight:800;

}


.btn:hover{

  border-color:
    rgba(255,255,255,.25);

}


.btn.primary{

  color:#baffeb;

  border-color:
    rgba(101,230,190,.22);

  background:
    linear-gradient(
      135deg,
      #173d33,
      #10231e
    );

}


.hero{

  border:
    1px solid var(--line);

  border-radius:24px;

  padding:25px;

  background:
    rgba(17,17,17,.94);

  margin-bottom:17px;

}


.hero-grid{

  display:grid;

  grid-template-columns:
    1.35fr
    .65fr;

  gap:18px;

}


.hero h2{

  margin:0;

  font-size:
    clamp(
      28px,
      5vw,
      48px
    );

  line-height:1.02;

  letter-spacing:-.06em;

}


.hero p{

  max-width:850px;

  margin:
    12px 0 0;

  color:var(--muted);

  font-size:13px;

  line-height:1.75;

}


.score-box{

  min-height:160px;

  display:flex;

  flex-direction:column;

  justify-content:center;

  padding:18px;

  border:
    1px solid var(--line);

  border-radius:18px;

  background:#0c0c0c;

}


.score-label{

  color:#606060;

  font-size:9px;

  font-weight:900;

  letter-spacing:.14em;

  text-transform:uppercase;

}


.score{

  margin-top:5px;

  font-size:38px;

  font-weight:900;

  letter-spacing:-.06em;

}


.score-detail{

  margin-top:5px;

  color:var(--muted);

  font-size:10px;

  line-height:1.5;

}


.grid{

  display:grid;

  grid-template-columns:
    repeat(
      12,
      1fr
    );

  gap:16px;

}


.card{

  grid-column:
    span 6;

  overflow:hidden;

  border:
    1px solid var(--line);

  border-radius:18px;

  background:
    rgba(17,17,17,.94);

}


.card.full{

  grid-column:
    span 12;

}


.head{

  padding:
    16px 18px;

  border-bottom:
    1px solid var(--line);

}


.head h3{

  margin:0;

  font-size:14px;

}


.head p{

  margin:
    5px 0 0;

  color:
    var(--muted);

  font-size:10px;

  line-height:1.5;

}


.body{

  padding:
    16px 18px;

}


.metrics{

  display:grid;

  grid-template-columns:
    repeat(
      4,
      1fr
    );

  gap:9px;

}


.metric{

  padding:
    14px;

  border:
    1px solid var(--line);

  border-radius:13px;

  background:#0b0b0b;

}


.metric strong{

  display:block;

  font-size:23px;

}


.metric span{

  display:block;

  margin-top:3px;

  color:#5f5f5f;

  font-size:8px;

  letter-spacing:.08em;

  text-transform:uppercase;

}


.progress{

  height:8px;

  margin-top:13px;

  overflow:hidden;

  border:
    1px solid var(--line);

  border-radius:999px;

  background:#090909;

}


.progress-bar{

  width:0%;

  height:100%;

  border-radius:999px;

  background:
    linear-gradient(
      90deg,
      #48cba5,
      #91ffe5
    );

  transition:
    .3s ease;

}


.checks{

  display:grid;

  gap:8px;

}


.check{

  display:grid;

  grid-template-columns:
    31px
    1fr
    auto;

  align-items:center;

  gap:10px;

  padding:
    10px;

  border:
    1px solid var(--line);

  border-radius:13px;

  background:#0c0c0c;

}


.icon{

  width:29px;

  height:29px;

  display:grid;

  place-items:center;

  border-radius:9px;

  font-size:11px;

  font-weight:900;

}


.icon.pass{

  color:#a9ffe6;

  background:
    var(--green-bg);

}


.icon.warn{

  color:#ffe3a0;

  background:
    var(--yellow-bg);

}


.icon.fail{

  color:#ffacac;

  background:
    var(--red-bg);

}


.name{

  font-size:10px;

  font-weight:800;

}


.detail{

  margin-top:3px;

  color:#666;

  font-size:8px;

  line-height:1.5;

}


.badge{

  padding:
    5px 8px;

  border:
    1px solid var(--line);

  border-radius:999px;

  color:#6d6d6d;

  font-size:7px;

  font-weight:900;

  letter-spacing:.08em;

}


.badge.pass{

  color:#a9ffe6;

  border-color:
    rgba(101,230,190,.18);

  background:
    var(--green-bg);

}


.badge.warn{

  color:#ffe4a0;

  border-color:
    rgba(255,209,102,.18);

  background:
    var(--yellow-bg);

}


.badge.fail{

  color:#ffaaaa;

  border-color:
    rgba(255,114,114,.18);

  background:
    var(--red-bg);

}


.report{

  min-height:340px;

  max-height:620px;

  overflow:auto;

  padding:15px;

  border:
    1px solid var(--line);

  border-radius:13px;

  background:#090909;

  color:#d8d8d8;

  font-family:
    ui-monospace,
    SFMono-Regular,
    Menlo,
    monospace;

  font-size:9px;

  line-height:1.7;

  white-space:pre-wrap;

}


.notice{

  margin-bottom:14px;

  padding:
    12px 13px;

  border:
    1px solid rgba(116,192,252,.16);

  border-radius:13px;

  background:
    var(--blue-bg);

  color:#c7e4ff;

  font-size:10px;

  line-height:1.6;

}


.footer{

  margin-top:18px;

  color:#4f4f4f;

  text-align:center;

  font-size:9px;

}


@media(max-width:900px){

  .hero-grid{

    grid-template-columns:
      1fr;

  }


  .card{

    grid-column:
      span 12;

  }

}


@media(max-width:620px){

  .app{

    width:
      min(
        100% - 16px,
        1400px
      );

    padding-top:
      13px;

  }


  .topbar{

    align-items:
      flex-start;

    flex-direction:
      column;

  }


  .metrics{

    grid-template-columns:
      repeat(
        2,
        1fr
      );

  }


  .hero{

    padding:
      19px;

  }

}

</style>

</head>


<body>

<main class="app">


<header class="topbar">

  <div class="brand">

    <div class="mark">
      AK
    </div>

    <div>

      <h1>
        Source Audit
      </h1>

      <p>
        AKHI Engineering Workshop · Final Source Consolidation
      </p>

    </div>

  </div>


  <div class="actions">

    <a
      class="btn"
      href="./dashboard.html">

      Dashboard

    </a>


    <a
      class="btn"
      href="./site-qa.html">

      Website QA

    </a>


    <button
      class="btn primary"
      id="run">

      Run Source Audit

    </button>

  </div>

</header>


<section class="hero">

  <div class="hero-grid">

    <div>

      <h2>
        Find stale code before the final ZIP.
      </h2>

      <p>
        This audit scans the currently deployed page source
        for legacy authentication patterns, visible role selectors,
        missing guards, missing admin-shell integration,
        missing developer attribution and version mismatches.
      </p>

    </div>


    <div class="score-box">

      <div class="score-label">
        Source readiness
      </div>

      <div
        class="score"
        id="score">
        READY
      </div>

      <div
        class="score-detail"
        id="scoreDetail">

        Run the audit before creating the final archive.

      </div>

    </div>

  </div>

</section>


<div class="notice">

  <strong>Important:</strong>
  this tool checks the source currently reachable from the browser.
  It does not modify files and does not delete localStorage data.
  A failing result means the corresponding file should be reviewed
  before calling the project “final”.

</div>


<section class="grid">


<article class="card full">

  <div class="head">

    <h3>
      Audit Summary
    </h3>

    <p>
      All detected source issues and readiness signals.
    </p>

  </div>


  <div class="body">

    <div class="metrics">

      <div class="metric">

        <strong id="total">
          0
        </strong>

        <span>
          Total checks
        </span>

      </div>


      <div class="metric">

        <strong id="pass">
          0
        </strong>

        <span>
          Passed
        </span>

      </div>


      <div class="metric">

        <strong id="warn">
          0
        </strong>

        <span>
          Warnings
        </span>

      </div>


      <div class="metric">

        <strong id="fail">
          0
        </strong>

        <span>
          Failed
        </span>

      </div>

    </div>


    <div class="progress">

      <div
        class="progress-bar"
        id="progress">
      </div>

    </div>

  </div>

</article>


<article class="card">

  <div class="head">

    <h3>
      Authentication
    </h3>

    <p>
      Legacy login/auth patterns.
    </p>

  </div>


  <div
    class="body"
    id="authChecks">

  </div>

</article>


<article class="card">

  <div class="head">

    <h3>
      Admin Architecture
    </h3>

    <p>
      Guard + shell + role-aware structure.
    </p>

  </div>


  <div
    class="body"
    id="adminChecks">

  </div>

</article>


<article class="card">

  <div class="head">

    <h3>
      Public Attribution
    </h3>

    <p>
      Developer → SNK promotional integration.
    </p>

  </div>


  <div
    class="body"
    id="publicChecks">

  </div>

</article>


<article class="card">

  <div class="head">

    <h3>
      Version Consistency
    </h3>

    <p>
      Legacy version markers and mismatches.
    </p>

  </div>


  <div
    class="body"
    id="versionChecks">

  </div>

</article>


<article class="card full">

  <div class="head">

    <h3>
      Source Audit Report
    </h3>

    <p>
      Full machine-readable result.
    </p>

  </div>


  <div class="body">

    <div class="actions">

      <button
        class="btn primary"
        id="download">

        Download Audit

      </button>


      <button
        class="btn"
        id="copy">

        Copy Report

      </button>

    </div>


    <div style="height:12px"></div>


    <div
      class="report"
      id="report">

      No audit has been run yet.

    </div>

  </div>

</article>


</section>


<div class="footer">

  AKHI Engineering Workshop · Source Consolidation Lab

</div>


</main>


<script>

(function(){

  "use strict";


  /* ======================================================
     SUPER ADMIN GUARD
  ====================================================== */

  if(
    !window.AKIAdmin ||
    !AKIAdmin.requireSuperAdmin()
  ){

    return;

  }


  /* ======================================================
     PAGE DEFINITIONS
  ====================================================== */

  const PAGES = [

    {
      path:
        "./login/index.html",

      label:
        "Login",

      group:
        "auth"

    },

    {
      path:
        "./auth.js",

      label:
        "Auth Core",

      group:
        "auth"

    },


    {
      path:
        "./dashboard.html",

      label:
        "Dashboard",

      group:
        "admin",

      guard:
        true

    },

    {
      path:
        "./homepage.html",

      label:
        "Homepage CMS",

      group:
        "admin"

    },

    {
      path:
        "./banner.html",

      label:
        "Banner CMS",

      group:
        "admin"

    },

    {
      path:
        "./projects.html",

      label:
        "Projects CMS",

      group:
        "admin"

    },

    {
      path:
        "./media.html",

      label:
        "Media Manager",

      group:
        "admin"

    },

    {
      path:
        "./settings.html",

      label:
        "Site Settings",

      group:
        "admin"

    },

    {
      path:
        "./admins.html",

      label:
        "Admin Management",

      group:
        "admin",

      guard:
        true,

      superAdminOnly:
        true

    },

    {
      path:
        "./security.html",

      label:
        "Security Center",

      group:
        "admin",

      guard:
        true,

      superAdminOnly:
        true

    },

    {
      path:
        "./activity.html",

      label:
        "Activity Log",

      group:
        "admin"

    },

    {
      path:
        "./backup.html",

      label:
        "Backup",

      group:
        "admin"

    },

    {
      path:
        "./qa.html",

      label:
        "Recovery QA",

      group:
        "admin",

      guard:
        true,

      superAdminOnly:
        true

    },

    {
      path:
        "./site-qa.html",

      label:
        "Website QA",

      group:
        "admin",

      guard:
        true,

      superAdminOnly:
        true

    },

    {
      path:
        "./responsive.html",

      label:
        "Responsive Lab",

      group:
        "admin",

      guard:
        true,

      superAdminOnly:
        true

    }

  ];


  const groups = {

    auth:
      "authChecks",

    admin:
      "adminChecks"

  };


  const state = {

    startedAt:
      null,

    finishedAt:
      null,

    results:
      []

  };


  /* ======================================================
     HELPERS
  ====================================================== */

  function $(id){

    return document.getElementById(
      id
    );

  }


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


  function addResult(
    group,
    name,
    status,
    detail,
    target
  ){

    state.results.push({

      group,

      name,

      status,

      detail,

      at:
        new Date()
          .toISOString()

    });


    const icon = {

      pass:
        "✓",

      warn:
        "~",

      fail:
        "!"

    }[
      status
    ] || "?";


    const label = {

      pass:
        "PASS",

      warn:
        "WARN",

      fail:
        "FAIL"

    }[
      status
    ] || "INFO";


    const item =
      document.createElement(
        "div"
      );


    item.className =
      "check";


    item.innerHTML = `

      <div
        class="icon ${status}">

        ${icon}

      </div>


      <div>

        <div class="name">

          ${escapeHtml(name)}

        </div>


        <div class="detail">

          ${escapeHtml(detail)}

        </div>

      </div>


      <div
        class="badge ${status}">

        ${label}

      </div>

    `;


    $(target).appendChild(
      item
    );

  }


  function clearChecks(){

    [
      "authChecks",
      "adminChecks",
      "publicChecks",
      "versionChecks"
    ]
      .forEach(
        function(id){

          $(id).innerHTML =
            "";

        }
      );

  }


  async function fetchSource(
    path
  ){

    const url =
      path +
      (
        path.includes("?")
          ? "&"
          : "?"
      ) +
      "sourceAudit=" +
      Date.now();


    const response =
      await fetch(
        url,
        {
          cache:
            "no-store"
        }
      );


    let text =
      "";


    if(
      response.ok
    ){

      text =
        await response.text();

    }


    return {

      response,

      text

    };

  }


  function containsAny(
    source,
    patterns
  ){

    const lower =
      source.toLowerCase();


    return patterns.some(
      function(pattern){

        return lower.includes(
          pattern.toLowerCase()
        );

      }
    );

  }


  function countStatus(
    status
  ){

    return state.results.filter(
      function(item){

        return (
          item.status ===
          status
        );

      }
    ).length;

  }


  /* ======================================================
     AUTH AUDIT
  ====================================================== */

  async function auditAuth(){

    const login =
      PAGES.find(
        item =>
          item.label ===
          "Login"
      );


    const auth =
      PAGES.find(
        item =>
          item.label ===
          "Auth Core"
      );


    /*
      LOGIN
    */

    try{

      const result =
        await fetchSource(
          login.path
        );


      if(
        !result.response.ok
      ){

        addResult(
          "Auth",
          "Login page available",
          "fail",
          `HTTP ${result.response.status}.`,
          "authChecks"
        );

      }else{

        addResult(
          "Auth",
          "Login page available",
          "pass",
          `Login page responded with HTTP ${result.response.status}.`,
          "authChecks"
        );


        const source =
          result.text;


        /*
          Role selector must NOT exist.
        */

        const roleSelector =
          /data-role\s*=\s*["'](?:admin|superadmin)["']/i
            .test(source)
          ||
          /class\s*=\s*["'][^"']*role[^"']*["']/i
            .test(source)
          &&
          /super\s*admin/i
            .test(source);


        if(
          roleSelector
        ){

          addResult(
            "Auth",
            "Generic login — no role selector",
            "fail",
            "A visible role-selection pattern was detected in the login source.",
            "authChecks"
          );

        }else{

          addResult(
            "Auth",
            "Generic login — no role selector",
            "pass",
            "No visible role selector pattern was detected.",
            "authChecks"
          );

        }


        /*
          Legacy hardcoded credential pattern.
        */

        const legacyCredentials =
          source.includes(
            "AKI@2026"
          )
          ||
          source.includes(
            "SNK@Master2026!"
          );


        if(
          legacyCredentials
        ){

          addResult(
            "Auth",
            "Legacy credential literals removed",
            "fail",
            "A legacy client-side credential literal was detected.",
            "authChecks"
          );

        }else{

          addResult(
            "Auth",
            "Legacy credential literals removed",
            "pass",
            "Known legacy credential literals were not detected.",
            "authChecks"
          );

        }


        /*
          Direct account object.
        */

        const legacyAccountBlock =
          /const\s+ACCOUNTS\s*=/i
            .test(source)
          ||
          /const\s+accounts\s*=/i
            .test(source);


        if(
          legacyAccountBlock
        ){

          addResult(
            "Auth",
            "No legacy ACCOUNTS object",
            "fail",
            "A client-side account registry was detected in login source.",
            "authChecks"
          );

        }else{

          addResult(
            "Auth",
            "No legacy ACCOUNTS object",
            "pass",
            "No direct ACCOUNTS object was detected.",
            "authChecks"
          );

        }


        /*
          Firebase must NOT be required yet.
        */

        addResult(
          "Auth",
          "Firebase deferred",
          source.includes(
            "firebase"
          )
            ? "warn"
            : "pass",
          source.includes(
            "firebase"
          )
            ? "Firebase reference exists before the final backend phase; review before release."
            : "No Firebase dependency detected — backend remains intentionally deferred.",
          "authChecks"
        );

      }

    }catch(error){

      addResult(
        "Auth",
        "Login source fetch",
        "fail",
        error.message ||
          "Could not fetch login source.",
        "authChecks"
      );

    }


    /*
      AUTH CORE
    */

    try{

      const result =
        await fetchSource(
          auth.path
        );


      if(
        !result.response.ok
      ){

        addResult(
          "Auth",
          "Auth core available",
          "fail",
          `HTTP ${result.response.status}.`,
          "authChecks"
        );

        return;

      }


      const source =
        result.text;


      addResult(
        "Auth",
        "Auth core available",
        "pass",
        "auth.js is reachable.",
        "authChecks"
      );


      if(
        /v1\.1/i.test(
          source
        )
      ){

        addResult(
          "Auth",
          "Auth version",
          "warn",
          "Legacy v1.1 marker detected. Replace with the latest approved auth implementation before final archive.",
          "versionChecks"
        );

      }else{

        addResult(
          "Auth",
          "Auth version",
          "pass",
          "No explicit v1.1 legacy marker detected.",
          "versionChecks"
        );

      }


      if(
        /requireSuperAdmin/i.test(
          source
        )
      ){

        addResult(
          "Auth",
          "Super Admin protection API",
          "pass",
          "requireSuperAdmin() exists in auth core.",
          "authChecks"
        );

      }else{

        addResult(
          "Auth",
          "Super Admin protection API",
          "fail",
          "requireSuperAdmin() was not detected.",
          "authChecks"
        );

      }


      if(
        /hasPermission/i.test(
          source
        )
      ){

        addResult(
          "Auth",
          "Permission system",
          "pass",
          "Permission-based access API detected.",
          "authChecks"
        );

      }else{

        addResult(
          "Auth",
          "Permission system",
          "warn",
          "Permission API was not detected.",
          "authChecks"
        );

      }

    }catch(error){

      addResult(
        "Auth",
        "Auth source fetch",
        "fail",
        error.message ||
          "Could not fetch auth core.",
        "authChecks"
      );

    }

  }


  /* ======================================================
     ADMIN SOURCE AUDIT
  ====================================================== */

  async function auditAdmin(){

    for(
      const page of PAGES
    ){

      if(
        page.group !==
        "admin"
      ){

        continue;

      }


      try{

        const result =
          await fetchSource(
            page.path
          );


        if(
          !result.response.ok
        ){

          addResult(
            "Admin",
            `${page.label} available`,
            "fail",
            `HTTP ${result.response.status}.`,
            "adminChecks"
          );

          continue;

        }


        addResult(
          "Admin",
          `${page.label} available`,
          "pass",
          `HTTP ${result.response.status}.`,
          "adminChecks"
        );


        const source =
          result.text;


        if(
          !/auth\.js/i.test(
            source
          )
        ){

          addResult(
            "Admin",
            `${page.label} → auth.js`,
            "warn",
            "auth.js reference was not detected.",
            "adminChecks"
          );

        }else{

          addResult(
            "Admin",
            `${page.label} → auth.js`,
            "pass",
            "auth.js reference detected.",
            "adminChecks"
          );

        }


        if(
          /admin-shell\.js/i.test(
            source
          )
        ){

          addResult(
            "Admin",
            `${page.label} → admin shell`,
            "pass",
            "Global admin-shell.js reference detected.",
            "adminChecks"
          );

        }else{

          addResult(
            "Admin",
            `${page.label} → admin shell`,
            "warn",
            "admin-shell.js is not currently referenced.",
            "adminChecks"
          );

        }


        if(
          page.guard
        ){

          if(
            /data-admin-guard/i.test(source)
            ||
            /requireSuperAdmin/i.test(source)
          ){

            addResult(
              "Admin",
              `${page.label} protection`,
              "pass",
              "Page-level guard marker/API detected.",
              "adminChecks"
            );

          }else{

            addResult(
              "Admin",
              `${page.label} protection`,
              "fail",
              "Expected protection marker was not detected.",
              "adminChecks"
            );

          }

        }


        if(
          page.superAdminOnly
        ){

          if(
            /requireSuperAdmin/i.test(
              source
            )
          ){

            addResult(
              "Admin",
              `${page.label} Super Admin gate`,
              "pass",
              "Super Admin-only gate detected.",
              "adminChecks"
            );

          }else{

            addResult(
              "Admin",
              `${page.label} Super Admin gate`,
              "fail",
              "Super Admin gate was not detected.",
              "adminChecks"
            );

          }

        }


      }catch(error){

        addResult(
          "Admin",
          `${page.label} source fetch`,
          "fail",
          error.message ||
            "Fetch failed.",
          "adminChecks"
        );

      }

    }

  }


  /* ======================================================
     PUBLIC CREDIT
  ====================================================== */

  async function auditPublic(){

    try{

      const result =
        await fetchSource(
          "../index.html"
        );


      if(
        !result.response.ok
      ){

        addResult(
          "Public",
          "Public homepage source",
          "fail",
          `HTTP ${result.response.status}.`,
          "publicChecks"
        );

        return;

      }


      const source =
        result.text;


      addResult(
        "Public",
        "Public homepage source",
        "pass",
        "Homepage source is reachable.",
        "publicChecks"
      );


      const creditScript =
        source.includes(
          "developer-credit.js"
        );


      const creditMarker =
        (
          /Developer/i.test(source)
          &&
          /SNK/i.test(source)
        );


      if(
        creditScript ||
        creditMarker
      ){

        addResult(
          "Public",
          "Developer → SNK credit",
          "pass",
          "Developer attribution integration was detected.",
          "publicChecks"
        );

      }else{

        addResult(
          "Public",
          "Developer → SNK credit",
          "warn",
          "Developer attribution was not detected in homepage source.",
          "publicChecks"
        );

      }


      if(
        /#home/i.test(source)
        ||
        /id\s*=\s*["']home["']/i.test(source)
      ){

        addResult(
          "Public",
          "Home anchor",
          "pass",
          "#home marker detected.",
          "publicChecks"
        );

      }else{

        addResult(
          "Public",
          "Home anchor",
          "warn",
          "#home marker was not detected.",
          "publicChecks"
        );

      }


      if(
        /viewport/i.test(source)
      ){

        addResult(
          "Public",
          "Responsive viewport",
          "pass",
          "Viewport metadata detected.",
          "publicChecks"
        );

      }else{

        addResult(
          "Public",
          "Responsive viewport",
          "fail",
          "Viewport metadata was not detected.",
          "publicChecks"
        );

      }

    }catch(error){

      addResult(
        "Public",
        "Public source fetch",
        "fail",
        error.message ||
          "Fetch failed.",
        "publicChecks"
      );

    }


    try{

      const result =
        await fetchSource(
          "../assets/developer-credit.js"
        );


      if(
        result.response.ok
      ){

        addResult(
          "Public",
          "Developer credit asset",
          "pass",
          "developer-credit.js is reachable.",
          "publicChecks"
        );

      }else{

        addResult(
          "Public",
          "Developer credit asset",
          "warn",
          `HTTP ${result.response.status}.`,
          "publicChecks"
        );

      }

    }catch(error){

      addResult(
        "Public",
        "Developer credit asset",
        "warn",
        "Developer credit asset could not be verified.",
        "publicChecks"
      );

    }

  }


  /* ======================================================
     VERSION AUDIT
  ====================================================== */

  async function auditVersions(){

    const sourceFiles = [

      "./auth.js",

      "./login/index.html",

      "./dashboard.html",

      "./security.html",

      "./qa.html",

      "./site-qa.html",

      "./responsive.html"

    ];


    for(
      const file of sourceFiles
    ){

      try{

        const result =
          await fetchSource(
            file
          );


        if(
          !result.response.ok
        ){

          continue;

        }


        const source =
          result.text;


        const legacyMarkers = [

          {
            pattern:
              "AKI Admin v1.1",

            label:
              "AKI Admin v1.1"
          },

          {
            pattern:
              "ADMIN AUTH CORE v1.1",

            label:
              "AUTH CORE v1.1"
          },

          {
            pattern:
              "Administration Portal",

            label:
              "Legacy administration portal wording"
          }

        ];


        legacyMarkers.forEach(
          function(marker){

            if(
              source.includes(
                marker.pattern
              )
            ){

              addResult(
                "Version",
                `${file} → ${marker.label}`,
                "warn",
                "Legacy version/branding marker detected.",
                "versionChecks"
              );

            }

          }
        );


        /*
          Current source should not show role
          selectors on login.
        */

        if(
          file.includes(
            "login/index.html"
          )
        ){

          if(
            /Sign In as Super Admin/i.test(
              source
            )
          ){

            addResult(
              "Version",
              "Login → visible Super Admin wording",
              "fail",
              "Login source still contains an explicit Super Admin sign-in label.",
              "versionChecks"
            );

          }


          if(
            /selected='admin'/i.test(
              source
            )
            ||
            /selected\s*=\s*["']admin["']/i.test(
              source
            )
          ){

            addResult(
              "Version",
              "Login → role state",
              "fail",
              "Login source still contains role-selection state.",
              "versionChecks"
            );

          }

        }

      }catch{}

    }


    addResult(
      "Version",
      "Final source version target",
      "warn",
      "The final source should use one approved version across auth, login, dashboard and QA tools before ZIP.",
      "versionChecks"
    );

  }


  /* ======================================================
     RUN
  ====================================================== */

  async function runAudit(){

    const button =
      $("run");


    button.disabled =
      true;


    button.textContent =
      "Auditing…";


    state.startedAt =
      new Date()
        .toISOString();


    state.results =
      [];


    clearChecks();


    $("score").textContent =
      "…";


    $("scoreDetail").textContent =
      "Scanning deployed source…";


    try{

      await auditAuth();

      await auditAdmin();

      await auditPublic();

      await auditVersions();


      state.finishedAt =
        new Date()
          .toISOString();


      updateSummary();

      renderReport();


      try{

        if(
          typeof AKIAdmin.logActivity ===
          "function"
        ){

          AKIAdmin.logActivity(
            "Source audit completed",
            {

              total:
                state.results.length,

              passed:
                countStatus(
                  "pass"
                ),

              warnings:
                countStatus(
                  "warn"
                ),

              failed:
                countStatus(
                  "fail"
                )

            }
          );

        }

      }catch{}

    }catch(error){

      addResult(
        "System",
        "Source audit runner",
        "fail",
        error.message ||
          "Unexpected audit failure.",
        "authChecks"
      );


      state.finishedAt =
        new Date()
          .toISOString();


      updateSummary();

      renderReport();

    }finally{

      button.disabled =
        false;

      button.textContent =
        "Run Source Audit";

    }

  }


  /* ======================================================
     SUMMARY
  ====================================================== */

  function updateSummary(){

    const total =
      state.results.length;


    const pass =
      countStatus(
        "pass"
      );


    const warn =
      countStatus(
        "warn"
      );


    const fail =
      countStatus(
        "fail"
      );


    $("total").textContent =
      total;


    $("pass").textContent =
      pass;


    $("warn").textContent =
      warn;


    $("fail").textContent =
      fail;


    const score =
      total
        ? Math.round(
            pass /
            total *
            100
          )
        : 0;


    $("progress").style.width =
      score + "%";


    $("score").textContent =
      score + "%";


    if(
      fail > 0
    ){

      $("score").style.color =
        "#ff9c9c";


      $("scoreDetail").textContent =
        `${fail} blocking issue(s) detected.`;

    }else if(
      warn > 0
    ){

      $("score").style.color =
        "#ffe09b";


      $("scoreDetail").textContent =
        `${warn} warning(s) remain before final archive.`;

    }else{

      $("score").style.color =
        "#9dffe5";


      $("scoreDetail").textContent =
        "Source looks ready for final consolidation.";

    }

  }


  /* ======================================================
     REPORT
  ====================================================== */

  function makeReport(){

    return {

      project:
        "AKHI Engineering Workshop",

      auditVersion:
        "1.0",

      startedAt:
        state.startedAt,

      finishedAt:
        state.finishedAt,

      url:
        location.href,

      summary:{

        total:
          state.results.length,

        passed:
          countStatus("pass"),

        warnings:
          countStatus("warn"),

        failed:
          countStatus("fail")

      },

      results:
        state.results,

      finalNotes:[

        "This audit checks browser-reachable source code.",

        "A passed source audit does not provide server-side authentication.",

        "Firebase remains intentionally deferred until the final backend phase.",

        "Known legacy authentication code should be replaced before the final archive.",

        "The final ZIP should contain only one approved source version."

      ]

    };

  }


  function renderReport(){

    $("report").textContent =
      JSON.stringify(
        makeReport(),
        null,
        2
      );

  }


  /* ======================================================
     DOWNLOAD
  ====================================================== */

  function downloadReport(){

    if(
      !state.finishedAt
    ){

      alert(
        "Run the source audit first."
      );

      return;

    }


    const blob =
      new Blob(
        [
          JSON.stringify(
            makeReport(),
            null,
            2
          )
        ],
        {
          type:
            "application/json"
        }
      );


    const url =
      URL.createObjectURL(
        blob
      );


    const link =
      document.createElement(
        "a"
      );


    const stamp =
      new Date()
        .toISOString()
        .replace(
          /[:.]/g,
          "-"
        );


    link.href =
      url;


    link.download =
      `AKHI-Source-Audit-${stamp}.json`;


    document.body.appendChild(
      link
    );


    link.click();


    link.remove();


    URL.revokeObjectURL(
      url
    );

  }


  /* ======================================================
     COPY
  ====================================================== */

  async function copyReport(){

    if(
      !state.finishedAt
    ){

      alert(
        "Run the source audit first."
      );

      return;

    }


    try{

      await navigator.clipboard.writeText(
        $("report").textContent
      );


      alert(
        "Source audit copied."
      );

    }catch{

      alert(
        "Clipboard access was blocked."
      );

    }

  }


  /* ======================================================
     EVENTS
  ====================================================== */

  $("run")
    .addEventListener(
      "click",
      runAudit
    );


  $("download")
    .addEventListener(
      "click",
      downloadReport
    );


  $("copy")
    .addEventListener(
      "click",
      copyReport
    );


  $("score").textContent =
    "READY";


  $("scoreDetail").textContent =
    "Run Source Audit before final ZIP.";

})();

</script>

</body>

</html>
