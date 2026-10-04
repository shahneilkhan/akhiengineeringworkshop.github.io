(function(){

  "use strict";

  /* ======================================================
     CONFIG
  ====================================================== */

  const STORAGE = {
    theme:"aki_admin_theme",
    aiConfig:"aki_ai_config_v1",
    chat:"aki_ai_chat_v1",
    homepage:"aki_homepage_content_v1",
    homepageOld:"aki_homepage",
    banners:"aki_banners_v1",
    bannersOld:"aki_banners",
    projects:"aki_projects_v1",
    projectsOld:"aki_projects",
    media:"aki_media_v1",
    mediaOld:"aki_media",
    settings:"aki_site_settings_v1",
    settingsOld:"aki_site_settings",
    session:"aki_admin_session"
  };

  const MAX_MESSAGES = 120;

  let session = null;

  let websiteContext = {
    homepage:{},
    banners:[],
    projects:[],
    media:[],
    settings:{},
    services:[]
  };

  let chatMessages = [];

  let usingContext = true;

  let remoteAiAvailable = false;

  /* ======================================================
     DOM
  ====================================================== */

  const $ = selector =>
    document.querySelector(selector);

  /* ======================================================
     HELPERS
  ====================================================== */

  function safeParse(value,fallback){

    try{
      return JSON.parse(value);
    }catch(error){
      return fallback;
    }

  }

  function escapeHtml(value){

    return String(value ?? "")
      .replace(/&/g,"&amp;")
      .replace(/</g,"&lt;")
      .replace(/>/g,"&gt;")
      .replace(/"/g,"&quot;")
      .replace(/'/g,"&#039;");

  }

  function initials(name){

    const value =
      String(name || "Admin")
        .trim();

    if(!value){
      return "A";
    }

    const parts =
      value
        .split(/\s+/)
        .filter(Boolean);

    if(parts.length === 1){
      return parts[0]
        .slice(0,2)
        .toUpperCase();
    }

    return (
      (parts[0][0] || "") +
      (parts[parts.length - 1][0] || "")
    ).toUpperCase();

  }

  function delay(ms){
    return new Promise(
      resolve => setTimeout(resolve,ms)
    );
  }

  function getLocalStorage(key){

    const value =
      localStorage.getItem(key);

    if(value === null){
      return null;
    }

    return safeParse(
      value,
      value
    );

  }

  function firstStorage(keys){

    for(const key of keys){

      const value =
        getLocalStorage(key);

      if(value !== null){
        return value;
      }

    }

    return null;

  }

  function asArray(value){

    if(Array.isArray(value)){
      return value;
    }

    if(
      value &&
      typeof value === "object"
    ){

      if(Array.isArray(value.items)){
        return value.items;
      }

      if(Array.isArray(value.data)){
        return value.data;
      }

    }

    return [];

  }

  function textValue(...values){

    for(const value of values){

      if(
        value !== undefined &&
        value !== null &&
        String(value).trim()
      ){

        return String(value).trim();

      }

    }

    return "";

  }

  /* ======================================================
     AUTH
  ====================================================== */

  function requireAuth(){

    try{

      if(
        window.AKIAdmin &&
        typeof window.AKIAdmin.requireAuth === "function"
      ){

        const result =
          window.AKIAdmin.requireAuth();

        if(result === false){

          window.location.href =
            "../login.html";

          return false;

        }

      }

    }catch(error){

      console.warn(
        "AKIAdmin authentication error:",
        error
      );

    }

    try{

      if(
        window.AKIAdmin &&
        typeof window.AKIAdmin.getSession === "function"
      ){

        session =
          window.AKIAdmin.getSession();

      }

    }catch(error){}

    if(!session){

      session =
        safeParse(
          localStorage.getItem(
            STORAGE.session
          ),
          null
        ) ||
        safeParse(
          sessionStorage.getItem(
            STORAGE.session
          ),
          null
        );

    }

    if(!session){

      session = {
        name:"Admin",
        role:"admin"
      };

    }

    return true;

  }

  function isSuperAdmin(){

    const role =
      String(
        session?.role ||
        session?.userRole ||
        ""
      )
        .toLowerCase()
        .replace(/[\s_-]+/g,"");

    return role === "superadmin";

  }

  function canUseAI(){

    try{

      if(
        window.AKIAdmin &&
        typeof window.AKIAdmin.hasPermission === "function"
      ){

        return (
          window.AKIAdmin.hasPermission("*") ||
          window.AKIAdmin.hasPermission("ai.use") ||
          window.AKIAdmin.hasPermission("ai.read")
        );

      }

    }catch(error){}

    return true;

  }

  function renderSession(){

    const name =
      session?.name ||
      session?.displayName ||
      session?.email ||
      "Admin";

    const role =
      session?.role ||
      session?.userRole ||
      "admin";

    $("#sessionName").textContent =
      name;

    $("#sessionRole").textContent =
      role === "superadmin"
        ? "Super Admin"
        : "Administrator";

    $("#sessionAvatar").textContent =
      initials(name);

    if(!isSuperAdmin()){
      $("#adminsNav").style.display =
        "none";
    }

  }

  /* ======================================================
     THEME
  ====================================================== */

  function applyTheme(theme){

    const value =
      theme === "light"
        ? "light"
        : "dark";

    document.documentElement.dataset.theme =
      value;

    localStorage.setItem(
      STORAGE.theme,
      value
    );

    const icon =
      value === "dark"
        ? "☼"
        : "☾";

    $("#themeBtn").innerHTML =
      icon + " Theme";

    $("#mobileThemeBtn").textContent =
      icon;

  }

  function toggleTheme(){

    const current =
      localStorage.getItem(
        STORAGE.theme
      ) || "dark";

    applyTheme(
      current === "dark"
        ? "light"
        : "dark"
    );

  }

  /* ======================================================
     AI CONFIG
  ====================================================== */

  function getAIConfig(){

    const saved =
      safeParse(
        localStorage.getItem(
          STORAGE.aiConfig
        ),
        {}
      );

    let globalConfig = {};

    try{

      if(
        window.AKHI_AI_CONFIG &&
        typeof window.AKHI_AI_CONFIG === "object"
      ){

        globalConfig =
          window.AKHI_AI_CONFIG;

      }

    }catch(error){}

    return {
      endpoint:
        textValue(
          saved.endpoint,
          globalConfig.endpoint
        ),

      model:
        textValue(
          saved.model,
          globalConfig.model,
          "AKHI AI"
        ),

      remote:
        saved.remote === true ||
        globalConfig.remote === true
    };

  }

  function saveAIConfig(config){

    localStorage.setItem(
      STORAGE.aiConfig,
      JSON.stringify(config)
    );

  }

  function renderAIConfig(){

    const config =
      getAIConfig();

    $("#aiEndpoint").value =
      config.endpoint || "";

    $("#aiModel").value =
      config.model || "AKHI AI";

    $("#remoteAiToggle").checked =
      config.remote === true;

    updateAIMode();

  }

  function updateAIMode(){

    const config =
      getAIConfig();

    remoteAiAvailable =
      Boolean(
        config.remote &&
        config.endpoint
      );

    if(remoteAiAvailable){

      $("#aiStatusTitle").textContent =
        config.model || "Remote AI";

      $("#aiStatusText").textContent =
        "Secure endpoint enabled";

      $("#modeTitle").textContent =
        "Remote AI Bridge";

      $("#modeDescription").textContent =
        "The configured secure endpoint will be used when available.";

      $("#bridgeStatus").textContent =
        "Secure endpoint configured";

    }else{

      $("#aiStatusTitle").textContent =
        "Local AI Mode";

      $("#aiStatusText").textContent =
        "Ready";

      $("#modeTitle").textContent =
        "Local Smart Mode";

      $("#modeDescription").textContent =
        "Context and content-engine templates are active.";

      $("#bridgeStatus").textContent =
        "Local mode active";

    }

  }

  /* ======================================================
     WEBSITE CONTEXT
  ====================================================== */

  function loadWebsiteContext(){

    const homepage =
      firstStorage([
        STORAGE.homepage,
        STORAGE.homepageOld
      ]) || {};

    const banners =
      asArray(
        firstStorage([
          STORAGE.banners,
          STORAGE.bannersOld
        ])
      );

    const projects =
      asArray(
        firstStorage([
          STORAGE.projects,
          STORAGE.projectsOld
        ])
      );

    const media =
      asArray(
        firstStorage([
          STORAGE.media,
          STORAGE.mediaOld
        ])
      );

    const settings =
      firstStorage([
        STORAGE.settings,
        STORAGE.settingsOld
      ]) || {};

    let services = [];

    if(
      Array.isArray(homepage.services)
    ){

      services =
        homepage.services;

    }else if(
      homepage.content &&
      Array.isArray(homepage.content.services)
    ){

      services =
        homepage.content.services;

    }else if(
      Array.isArray(homepage.sections)
    ){

      services =
        homepage.sections
          .filter(
            item =>
              String(
                item?.type || ""
              ).toLowerCase() === "service"
          );

    }

    websiteContext = {
      homepage,
      banners,
      projects,
      media,
      settings,
      services
    };

    renderContext();

  }

  function homepageValue(key){

    const home =
      websiteContext.homepage || {};

    const content =
      home.content &&
      typeof home.content === "object"
        ? home.content
        : home;

    return textValue(
      content[key],
      home[key]
    );

  }

  function renderContext(){

    const business =
      textValue(
        websiteContext.settings?.businessName,
        websiteContext.settings?.name,
        homepageValue("businessName"),
        homepageValue("siteName"),
        "AKHI Engineering Workshop"
      );

    const tagline =
      textValue(
        websiteContext.settings?.tagline,
        homepageValue("tagline"),
        homepageValue("heroEyebrow"),
        "Engineering Workshop"
      );

    const heroTitle =
      textValue(
        homepageValue("heroHeading"),
        homepageValue("heroTitle"),
        homepageValue("title"),
        "AKHI Engineering Workshop"
      );

    $("#contextBusiness").textContent =
      business;

    $("#contextTagline").textContent =
      tagline || "—";

    $("#contextHero").textContent =
      heroTitle || "—";

    $("#contextProjects").textContent =
      websiteContext.projects.length;

    $("#contextBanners").textContent =
      websiteContext.banners.length;

    $("#contextServices").textContent =
      websiteContext.services.length;

    $("#contextMedia").textContent =
      websiteContext.media.length;

    const chips =
      $("#serviceChips");

    chips.innerHTML = "";

    const services =
      websiteContext.services
        .slice(0,10);

    if(!services.length){

      chips.innerHTML = `
        <span class="muted-chip">
          No services detected
        </span>
      `;

      return;

    }

    services.forEach(service => {

      const name =
        textValue(
          service?.name,
          service?.title,
          service?.label,
          service?.service
        );

      if(!name){
        return;
      }

      const chip =
        document.createElement("span");

      chip.className =
        "context-chip";

      chip.textContent =
        name;

      chips.appendChild(chip);

    });

  }

  function contextText(){

    const business =
      textValue(
        websiteContext.settings?.businessName,
        websiteContext.settings?.name,
        "AKHI Engineering Workshop"
      );

    const tagline =
      textValue(
        websiteContext.settings?.tagline,
        homepageValue("tagline"),
        "Engineering workshop"
      );

    const hero =
      textValue(
        homepageValue("heroHeading"),
        homepageValue("heroTitle"),
        "AKHI Engineering Workshop"
      );

    const serviceNames =
      websiteContext.services
        .map(
          service =>
            textValue(
              service?.name,
              service?.title,
              service?.label
            )
        )
        .filter(Boolean)
        .slice(0,12);

    const projectNames =
      websiteContext.projects
        .map(
          project =>
            textValue(
              project?.name,
              project?.title
            )
        )
        .filter(Boolean)
        .slice(0,10);

    return [
      "Business: " + business,
      "Tagline: " + tagline,
      "Hero: " + hero,
      "Services: " +
        (
          serviceNames.length
            ? serviceNames.join(", ")
            : "No service records"
        ),
      "Projects: " +
        (
          projectNames.length
            ? projectNames.join(", ")
            : "No project records"
        ),
      "Project count: " +
        websiteContext.projects.length,
      "Banner count: " +
        websiteContext.banners.length,
      "Media count: " +
        websiteContext.media.length
    ].join("\n");

  }

  /* ======================================================
     PRESETS
  ====================================================== */

  const PRESETS = {

    hero: `
Write premium homepage hero copy for AKHI Engineering Workshop.

Create:
1. Eyebrow
2. Main headline
3. Short description
4. Primary CTA
5. Secondary CTA

Keep it modern, confident, engineering-focused and concise.
Avoid fake claims and unsupported certifications.
`.trim(),

    project: `
Create a polished engineering project description for an AKHI Engineering Workshop project.

Include:
- Project title
- One-line summary
- What was built
- Materials / engineering focus
- Key value
- Short case-study paragraph

Keep it professional and website-ready.
`.trim(),

    service: `
Write premium website copy for an AKHI Engineering Workshop service.

Include:
- Service name
- Short description
- 3 key benefits
- Short CTA

Use a professional engineering and workshop tone.
`.trim(),

    seo: `
Create an SEO pack for AKHI Engineering Workshop.

Return:
- SEO title
- Meta description
- 8 keyword phrases
- Open Graph description

Do not use spammy keyword stuffing.
`.trim(),

    social: `
Write a premium Facebook / Instagram caption for AKHI Engineering Workshop.

Include:
- Strong opening
- Short engineering-focused message
- Clear CTA
- 5 relevant hashtags

Do not invent project results or certifications.
`.trim(),

    bengali: `
Rewrite the following website copy into natural, professional Bengali for a Bangladeshi audience.

Keep technical names and engineering terminology understandable.
Do not produce a literal awkward translation.
`.trim()

  };

  /* ======================================================
     LOCAL SMART ENGINE
  ====================================================== */

  function detectLanguage(text){

    if(/[অ-ঔক-হ]/.test(text)){
      return "bn";
    }

    return "en";

  }

  function words(text){

    return text
      .toLowerCase()
      .replace(/[^\w\s-]/g," ")
      .split(/\s+/)
      .filter(Boolean);

  }

  function requestedTopic(text){

    const lower =
      text.toLowerCase();

    if(
      lower.includes("hero") ||
      lower.includes("homepage")
    ){
      return "hero";
    }

    if(
      lower.includes("project") ||
      lower.includes("case study")
    ){
      return "project";
    }

    if(
      lower.includes("service")
    ){
      return "service";
    }

    if(
      lower.includes("seo") ||
      lower.includes("meta")
    ){
      return "seo";
    }

    if(
      lower.includes("social") ||
      lower.includes("facebook") ||
      lower.includes("instagram")
    ){
      return "social";
    }

    if(
      lower.includes("bangla") ||
      lower.includes("bengali") ||
      detectLanguage(text) === "bn"
    ){
      return "bengali";
    }

    return "general";

  }

  function generateLocalResponse(input){

    const lower =
      input.toLowerCase();

    const business =
      textValue(
        websiteContext.settings?.businessName,
        websiteContext.settings?.name,
        "AKHI Engineering Workshop"
      );

    const tagline =
      textValue(
        websiteContext.settings?.tagline,
        homepageValue("tagline"),
        "Engineering with precision"
      );

    const topic =
      requestedTopic(input);

    if(
      lower.includes("hello") ||
      lower.includes("hi") ||
      lower.includes("assalam")
    ){

      return [
        "Hello — I’m AKHI AI.",
        "",
        "I can help with:",
        "• Homepage and hero copy",
        "• Engineering project descriptions",
        "• Service descriptions",
        "• SEO titles and metadata",
        "• Social captions",
        "• Bengali website copy",
        "• Content improvement and structure",
        "",
        "Current business context:",
        business
      ].join("\n");

    }

    if(topic === "hero"){

      return [
        "EYEBROW",
        tagline,
        "",
        "HEADLINE",
        business + " — Built with Precision.",
        "",
        "DESCRIPTION",
        "Professional engineering and workshop solutions focused on practical execution, clean workmanship and dependable results.",
        "",
        "PRIMARY CTA",
        "Explore Our Work",
        "",
        "SECONDARY CTA",
        "Get a Quote"
      ].join("\n");

    }

    if(topic === "project"){

      const project =
        websiteContext.projects[0];

      const title =
        textValue(
          project?.name,
          project?.title,
          "Featured Engineering Project"
        );

      return [
        "PROJECT TITLE",
        title,
        "",
        "SUMMARY",
        "A professionally executed engineering workshop project designed around practical requirements, structural quality and precise finishing.",
        "",
        "WHAT WAS BUILT",
        "The work was planned and produced with a focus on accurate measurements, material selection, fabrication and final finishing.",
        "",
        "VALUE",
        "The result combines functional engineering with a clean, durable and professional finish.",
        "",
        "CASE STUDY",
        business +
          " approaches each project with attention to practical constraints, workmanship and long-term usability."
      ].join("\n");

    }

    if(topic === "service"){

      const service =
        websiteContext.services[0];

      const title =
        textValue(
          service?.name,
          service?.title,
          "Engineering Workshop Service"
        );

      return [
        "SERVICE",
        title,
        "",
        "DESCRIPTION",
        "Professional workshop execution with a focus on precision, practical engineering and quality finishing.",
        "",
        "KEY BENEFITS",
        "• Accurate workmanship",
        "• Practical engineering approach",
        "• Clean and durable finishing",
        "",
        "CTA",
        "Discuss Your Requirement"
      ].join("\n");

    }

    if(topic === "seo"){

      return [
        "SEO TITLE",
        business +
          " | Engineering Workshop & Fabrication",
        "",
        "META DESCRIPTION",
        "Explore professional engineering workshop, fabrication and custom project solutions from " +
          business +
          ".",
        "",
        "KEYWORDS",
        [
          "engineering workshop",
          "fabrication",
          "custom engineering",
          "workshop services",
          "metal fabrication",
          "engineering project",
          "Bangladesh engineering workshop",
          "AKHI Engineering Workshop"
        ].join(", "),
        "",
        "OG DESCRIPTION",
        "Precision-focused engineering and workshop solutions built for practical real-world requirements."
      ].join("\n");

    }

    if(topic === "social"){

      return [
        business,
        "",
        "Good engineering starts with precision.",
        "From fabrication and workshop execution to custom project work, every detail matters.",
        "",
        "Tell us what you’re building.",
        "",
        "#AKHIEngineering #EngineeringWorkshop #Fabrication #Engineering #Bangladesh"
      ].join("\n");

    }

    if(topic === "bengali"){

      return [
        "AKHI Engineering Workshop",
        "",
        "নির্ভুলতা, দক্ষতা এবং বাস্তব প্রকৌশল চিন্তার সমন্বয়ে তৈরি সমাধান।",
        "",
        "আমাদের কাজের লক্ষ্য হলো প্রতিটি প্রজেক্টে ব্যবহারিক প্রয়োজন, মানসম্মত কাজ এবং পরিষ্কার ফিনিশ নিশ্চিত করা।",
        "",
        "Call to Action:",
        "আপনার প্রজেক্ট নিয়ে আলোচনা করতে আমাদের সাথে যোগাযোগ করুন।"
      ].join("\n");

    }

    if(
      lower.includes("rewrite") ||
      lower.includes("improve") ||
      lower.includes("make it")
    ){

      return [
        "Here is a more premium version:",
        "",
        "Precision-led engineering solutions designed around practical requirements, dependable workmanship and clean execution.",
        "",
        "This wording is intentionally concise so it can work across your homepage, service cards or project pages."
      ].join("\n");

    }

    if(
      lower.includes("what do you know") ||
      lower.includes("context")
    ){

      return [
        "AKHI AI currently has access to this browser-side website context:",
        "",
        contextText(),
        "",
        "You can ask me to generate content from this context."
      ].join("\n");

    }

    return [
      "I’m in Local Smart Mode right now.",
      "",
      "I can generate practical AKHI website content from your current admin context.",
      "",
      "Try one of these:",
      "• “Write a premium homepage hero.”",
      "• “Create a project description.”",
      "• “Write our services section.”",
      "• “Create an SEO pack.”",
      "• “Write a Facebook caption.”",
      "• “Translate this into Bangla.”",
      "",
      "For context-aware output, website context is currently " +
        (
          usingContext
            ? "enabled."
            : "disabled."
        )
    ].join("\n");

  }

  /* ======================================================
     REMOTE AI
  ====================================================== */

  async function requestRemoteAI(input){

    const config =
      getAIConfig();

    if(
      !config.remote ||
      !config.endpoint
    ){

      return null;

    }

    const payload = {

      model:
        config.model || "AKHI AI",

      message:
        input,

      context:
        usingContext
          ? websiteContext
          : null,

      conversation:
        chatMessages.slice(-20)

    };

    try{

      const response =
        await fetch(
          config.endpoint,
          {
            method:"POST",

            headers:{
              "Content-Type":
                "application/json"
            },

            body:
              JSON.stringify(payload)
          }
        );

      if(!response.ok){

        throw new Error(
          "AI endpoint returned HTTP " +
          response.status
        );

      }

      const data =
        await response.json();

      const result =
        textValue(
          data.reply,
          data.output,
          data.text,
          data.message,
          data.content
        );

      if(!result){

        throw new Error(
          "The AI endpoint returned no text."
        );

      }

      return result;

    }catch(error){

      console.warn(
        "Remote AI error:",
        error
      );

      return null;

    }

  }

  /* ======================================================
     MAIN AI
  ====================================================== */

  async function generateAnswer(input){

    if(
      remoteAiAvailable
    ){

      const remote =
        await requestRemoteAI(
          input
        );

      if(remote){
        return remote;
      }

      showToast(
        "Remote AI unavailable",
        "Falling back to local smart mode.",
        "error"
      );

    }

    await delay(
      450 +
      Math.min(
        input.length * 2,
        800
      )
    );

    return generateLocalResponse(
      input
    );

  }

  /* ======================================================
     CHAT STORAGE
  ====================================================== */

  function loadChat(){

    const saved =
      safeParse(
        localStorage.getItem(
          STORAGE.chat
        ),
        []
      );

    chatMessages =
      Array.isArray(saved)
        ? saved.slice(-MAX_MESSAGES)
        : [];

  }

  function saveChat(){

    localStorage.setItem(
      STORAGE.chat,
      JSON.stringify(
        chatMessages.slice(-MAX_MESSAGES)
      )
    );

  }

  /* ======================================================
     MESSAGE RENDERING
  ====================================================== */

  function timeLabel(timestamp){

    return new Intl.DateTimeFormat(
      undefined,
      {
        hour:"2-digit",
        minute:"2-digit"
      }
    ).format(
      new Date(timestamp)
    );

  }

  function renderMessages(){

    const box =
      $("#chatMessages");

    box.innerHTML = "";

    if(!chatMessages.length){

      addWelcomeMessage();

      return;

    }

    chatMessages.forEach(
      message => {

        renderMessage(
          message,
          false
        );

      }
    );

    scrollChatToBottom();

  }

  function addWelcomeMessage(){

    const greeting = {

      id:
        "welcome_" +
        Date.now(),

      role:"assistant",

      text:[
        "Welcome to AKHI AI.",
        "",
        "I’m ready to help with the AKHI Engineering Workshop admin content.",
        "",
        "Your website context currently includes:",
        "• " +
          websiteContext.projects.length +
          " projects",
        "• " +
          websiteContext.services.length +
          " services",
        "• " +
          websiteContext.banners.length +
          " banners",
        "• " +
          websiteContext.media.length +
          " media records",
        "",
        "Choose a quick tool above or ask me anything about your website content."
      ].join("\n"),

      timestamp:Date.now()

    };

    renderMessage(
      greeting,
      true
    );

  }

  function renderMessage(message,animate=true){

    const box =
      $("#chatMessages");

    const wrapper =
      document.createElement("div");

    wrapper.className =
      "message " +
      (
        message.role === "user"
          ? "user"
          : "assistant"
      );

    if(animate){
      wrapper.style.animation =
        "messageIn .24s ease both";
    }

    const avatar =
      message.role === "user"
        ? initials(
            session?.name ||
            "Admin"
          )
        : "AI";

    wrapper.innerHTML = `

      <div class="message-avatar">
        ${escapeHtml(avatar)}
      </div>

      <div class="message-content">

        <div class="message-bubble">
          ${escapeHtml(
            message.text
          )}
        </div>

        <div class="message-meta">
          ${timeLabel(
            message.timestamp
          )}
        </div>

        ${
          message.role === "assistant"
            ? `
              <div class="message-actions">

                <button
                  class="message-action"
                  data-copy-message="${escapeHtml(message.id)}"
                >
                  Copy
                </button>

                <button
                  class="message-action"
                  data-use-message="${escapeHtml(message.id)}"
                >
                  Use in Prompt
                </button>

              </div>
            `
            : ""
        }

      </div>
    `;

    box.appendChild(wrapper);

    const copyBtn =
      wrapper.querySelector(
        "[data-copy-message]"
      );

    const useBtn =
      wrapper.querySelector(
        "[data-use-message]"
      );

    if(copyBtn){

      copyBtn.addEventListener(
        "click",
        () => {

          const target =
            chatMessages.find(
              item =>
                item.id === message.id
            ) || message;

          copyText(
            target.text
          );

        }
      );

    }

    if(useBtn){

      useBtn.addEventListener(
        "click",
        () => {

          const target =
            chatMessages.find(
              item =>
                item.id === message.id
            ) || message;

          $("#messageInput").value =
            "Improve this answer:\n\n" +
            target.text;

          updateCharCount();

          $("#messageInput").focus();

        }
      );

    }

  }

  function scrollChatToBottom(){

    const box =
      $("#chatMessages");

    box.scrollTop =
      box.scrollHeight;

  }

  /* ======================================================
     SEND MESSAGE
  ====================================================== */

  async function sendMessage(){

    if(!canUseAI()){

      showToast(
        "Permission denied",
        "Your admin role does not have AKHI AI access.",
        "error"
      );

      return;

    }

    const textarea =
      $("#messageInput");

    const raw =
      textarea.value.trim();

    if(!raw){
      textarea.focus();
      return;
    }

    if(raw.length > 3000){

      showToast(
        "Message too long",
        "Please keep the message under 3000 characters.",
        "error"
      );

      return;

    }

    const userMessage = {

      id:
        "msg_" +
        Date.now() +
        "_" +
        Math.random()
          .toString(36)
          .slice(2,8),

      role:"user",

      text:raw,

      timestamp:Date.now()

    };

    chatMessages.push(
      userMessage
    );

    saveChat();
    renderMessages();

    textarea.value = "";

    updateCharCount();

    setTyping(true);

    try{

      const answer =
        await generateAnswer(
          raw
        );

      const assistantMessage = {

        id:
          "msg_" +
          Date.now() +
          "_" +
          Math.random()
            .toString(36)
            .slice(2,8),

        role:"assistant",

        text:answer,

        timestamp:Date.now()

      };

      chatMessages.push(
        assistantMessage
      );

      if(
        chatMessages.length >
        MAX_MESSAGES
      ){

        chatMessages =
          chatMessages.slice(
            -MAX_MESSAGES
          );

      }

      saveChat();

      renderMessages();

      logActivity(
        "AKHI AI: Message Generated",
        {
          mode:
            remoteAiAvailable
              ? "remote"
              : "local",
          promptLength:
            raw.length
        }
      );

    }catch(error){

      console.error(
        error
      );

      const errorMessage = {

        id:
          "err_" +
          Date.now(),

        role:"assistant",

        text:
          "I could not generate that response. Please try again.",

        timestamp:Date.now()

      };

      chatMessages.push(
        errorMessage
      );

      saveChat();

      renderMessages();

      showToast(
        "AI error",
        error.message ||
          "Something went wrong.",
        "error"
      );

    }finally{

      setTyping(false);

    }

  }

  /* ======================================================
     TYPING
  ====================================================== */

  function setTyping(show){

    $("#typingRow")
      .classList.toggle(
        "show",
        show
      );

    $("#sendBtn").disabled =
      show;

    if(show){
      setTimeout(
        scrollChatToBottom,
        30
      );
    }

  }

  /* ======================================================
     QUICK PRESETS
  ====================================================== */

  function runPreset(key){

    const prompt =
      PRESETS[key];

    if(!prompt){
      return;
    }

    $("#messageInput").value =
      prompt;

    updateCharCount();

    $("#messageInput").focus();

    sendMessage();

  }

  /* ======================================================
     HINTS
  ====================================================== */

  function addHint(text){

    const input =
      $("#messageInput");

    const current =
      input.value.trim();

    if(current){

      input.value =
        current +
        "\n\n" +
        text;

    }else{

      input.value =
        text;

    }

    updateCharCount();

    input.focus();

  }

  /* ======================================================
     CHAR COUNT
  ====================================================== */

  function updateCharCount(){

    const length =
      $("#messageInput")
        .value
        .length;

    $("#charCounter").textContent =
      length +
      " / 3000";

  }

  /* ======================================================
     CLEAR CHAT
  ====================================================== */

  function clearChat(){

    const ok =
      window.confirm(
        "Clear the AKHI AI chat history?"
      );

    if(!ok){
      return;
    }

    chatMessages = [];

    saveChat();

    renderMessages();

    showToast(
      "Chat cleared",
      "Your local AI conversation history has been removed.",
      "success"
    );

    logActivity(
      "AKHI AI: Chat Cleared",
      {}
    );

  }

  /* ======================================================
     LAST ANSWER
  ====================================================== */

  function getLastAssistantMessage(){

    for(
      let i = chatMessages.length - 1;
      i >= 0;
      i--
    ){

      if(
        chatMessages[i].role === "assistant"
      ){

        return chatMessages[i];

      }

    }

    return null;

  }

  function copyLastAnswer(){

    const last =
      getLastAssistantMessage();

    if(!last){

      showToast(
        "No answer",
        "There is no AI answer to copy yet.",
        "error"
      );

      return;

    }

    copyText(
      last.text
    );

  }

  /* ======================================================
     COPY
  ====================================================== */

  async function copyText(text){

    try{

      await navigator.clipboard.writeText(
        text
      );

      showToast(
        "Copied",
        "The text has been copied to your clipboard.",
        "success"
      );

    }catch(error){

      const textarea =
        document.createElement(
          "textarea"
        );

      textarea.value =
        text;

      textarea.style.position =
        "fixed";

      textarea.style.opacity =
        "0";

      document.body.appendChild(
        textarea
      );

      textarea.focus();
      textarea.select();

      try{
        document.execCommand("copy");
      }catch(e){}

      textarea.remove();

      showToast(
        "Copied",
        "The text has been copied.",
        "success"
      );

    }

  }

  /* ======================================================
     EXPORT CHAT
  ====================================================== */

  function exportChat(){

    const payload = {

      format:"AKHI-AI-CHAT",

      version:"1.11",

      exportedAt:
        new Date().toISOString(),

      business:
        websiteContext.settings?.businessName ||
        "AKHI Engineering Workshop",

      contextEnabled:
        usingContext,

      messages:
        chatMessages

    };

    const blob =
      new Blob(
        [
          JSON.stringify(
            payload,
            null,
            2
          )
        ],
        {
          type:"application/json"
        }
      );

    const url =
      URL.createObjectURL(
        blob
      );

    const a =
      document.createElement("a");

    const d =
      new Date();

    const stamp =
      d.getFullYear() +
      "-" +
      String(
        d.getMonth()+1
      ).padStart(2,"0") +
      "-" +
      String(
        d.getDate()
      ).padStart(2,"0");

    a.href = url;

    a.download =
      "akhi-ai-chat-" +
      stamp +
      ".json";

    document.body.appendChild(
      a
    );

    a.click();

    a.remove();

    setTimeout(
      () =>
        URL.revokeObjectURL(url),
      1200
    );

    showToast(
      "Chat exported",
      "The AI conversation has been downloaded.",
      "success"
    );

  }

  /* ======================================================
     CONTEXT TOGGLE
  ====================================================== */

  function toggleContext(){

    usingContext =
      !usingContext;

    const btn =
      $("#useContextBtn");

    btn.classList.toggle(
      "off",
      !usingContext
    );

    btn.textContent =
      usingContext
        ? "◉ Use Website Context"
        : "○ Context Disabled";

    showToast(
      usingContext
        ? "Context enabled"
        : "Context disabled",
      usingContext
        ? "AKHI AI will use your current CMS context."
        : "AKHI AI will answer without website context.",
      "success"
    );

  }

  /* ======================================================
     CONFIG MODAL
  ====================================================== */

  function openConfig(){

    renderAIConfig();

    $("#configOverlay")
      .classList.add("open");

  }

  function closeConfig(){

    $("#configOverlay")
      .classList.remove("open");

  }

  function saveConfig(){

    const endpoint =
      $("#aiEndpoint")
        .value
        .trim();

    const model =
      $("#aiModel")
        .value
        .trim() ||
      "AKHI AI";

    const remote =
      $("#remoteAiToggle")
        .checked;

    const config = {

      endpoint,

      model,

      remote

    };

    saveAIConfig(
      config
    );

    updateAIMode();

    closeConfig();

    showToast(
      "AI configuration saved",
      remote && endpoint
        ? "Secure AI bridge enabled."
        : "Local AI mode remains active.",
      "success"
    );

    logActivity(
      "AKHI AI: Configuration Updated",
      {
        remote,
        endpointConfigured:
          Boolean(endpoint),
        model
      }
    );

  }

  /* ======================================================
     ACTIVITY
  ====================================================== */

  function logActivity(action,payload){

    try{

      if(
        window.AKIAdmin &&
        typeof window.AKIAdmin.logActivity === "function"
      ){

        window.AKIAdmin.logActivity(
          action,
          payload || {}
        );

        return;

      }

    }catch(error){

      console.warn(
        "AKIAdmin.logActivity failed:",
        error
      );

    }

    const key =
      "aki_admin_activity_v1";

    const current =
      safeParse(
        localStorage.getItem(key),
        []
      );

    if(!Array.isArray(current)){
      return;
    }

    current.unshift({

      id:
        "log_" +
        Date.now() +
        "_" +
        Math.random()
          .toString(36)
          .slice(2,8),

      timestamp:
        Date.now(),

      actor:
        session?.name ||
        session?.email ||
        "Admin",

      role:
        session?.role ||
        "admin",

      action,

      target:
        "AKHI AI",

      description:
        "AKHI AI activity",

      category:
        "system",

      payload:
        payload || {}

    });

    try{

      localStorage.setItem(
        key,
        JSON.stringify(
          current.slice(0,5000)
        )
      );

    }catch(error){}

  }

  /* ======================================================
     TOAST
  ====================================================== */

  function showToast(
    title,
    message,
    type="success"
  ){

    const wrap =
      $("#toastWrap");

    const toast =
      document.createElement(
        "div"
      );

    toast.className =
      "toast " +
      type;

    toast.innerHTML = `
      <strong>
        ${escapeHtml(title)}
      </strong>

      <span>
        ${escapeHtml(message)}
      </span>
    `;

    wrap.appendChild(
      toast
    );

    setTimeout(
      () => {

        toast.style.opacity =
          "0";

        toast.style.transform =
          "translateY(8px)";

        setTimeout(
          () => toast.remove(),
          220
        );

      },
      3200
    );

  }

  /* ======================================================
     LOGOUT
  ====================================================== */

  function logout(){

    const ok =
      window.confirm(
        "Are you sure you want to logout?"
      );

    if(!ok){
      return;
    }

    try{

      if(
        window.AKIAdmin &&
        typeof window.AKIAdmin.logout === "function"
      ){

        window.AKIAdmin.logout();

        return;

      }

    }catch(error){}

    try{

      localStorage.removeItem(
        STORAGE.session
      );

      sessionStorage.removeItem(
        STORAGE.session
      );

    }catch(error){}

    window.location.href =
      "../login.html";

  }

  /* ======================================================
     MOBILE MENU
  ====================================================== */

  function openSidebar(){

    $("#sidebar")
      .classList.add("open");

  }

  function closeSidebar(){

    $("#sidebar")
      .classList.remove("open");

  }

  /* ======================================================
     EVENTS
  ====================================================== */

  function bindEvents(){

    $("#themeBtn")
      .addEventListener(
        "click",
        toggleTheme
      );

    $("#mobileThemeBtn")
      .addEventListener(
        "click",
        toggleTheme
      );

    $("#menuBtn")
      .addEventListener(
        "click",
        openSidebar
      );

    $("#logoutBtn")
      .addEventListener(
        "click",
        logout
      );

    $("#contextBtn")
      .addEventListener(
        "click",
        () => {

          loadWebsiteContext();

          showToast(
            "Context refreshed",
            "Current Homepage, Projects, Banners, Media and Settings data has been loaded.",
            "success"
          );

        }
      );

    $("#clearChatBtn")
      .addEventListener(
        "click",
        clearChat
      );

    $("#sendBtn")
      .addEventListener(
        "click",
        sendMessage
      );

    $("#exportChatBtn")
      .addEventListener(
        "click",
        exportChat
      );

    $("#copyLastBtn")
      .addEventListener(
        "click",
        copyLastAnswer
      );

    $("#useContextBtn")
      .addEventListener(
        "click",
        toggleContext
      );

    $("#messageInput")
      .addEventListener(
        "input",
        updateCharCount
      );

    $("#messageInput")
      .addEventListener(
        "keydown",
        function(event){

          if(
            event.key === "Enter" &&
            !event.shiftKey
          ){

            event.preventDefault();

            sendMessage();

          }

        }
      );

    document
      .querySelectorAll(".quick-tool")
      .forEach(
        button => {

          button.addEventListener(
            "click",
            () => {

              runPreset(
                button.dataset.preset
              );

            }
          );

        }
      );

    document
      .querySelectorAll(".hint")
      .forEach(
        button => {

          button.addEventListener(
            "click",
            () => {

              addHint(
                button.dataset.hint
              );

            }
          );

        }
      );

    $("#collapseContextBtn")
      .addEventListener(
        "click",
        () => {

          $("#contextPanel")
            ?.classList.toggle(
              "collapsed"
            );

          const panel =
            document.querySelector(
              ".context-panel"
            );

          panel.classList.toggle(
            "collapsed"
          );

        }
      );

    $("#configBtn")
      .addEventListener(
        "click",
        openConfig
      );

    $("#closeConfigBtn")
      .addEventListener(
        "click",
        closeConfig
      );

    $("#cancelConfigBtn")
      .addEventListener(
        "click",
        closeConfig
      );

    $("#saveConfigBtn")
      .addEventListener(
        "click",
        saveConfig
      );

    $("#configOverlay")
      .addEventListener(
        "click",
        event => {

          if(
            event.target ===
            event.currentTarget
          ){

            closeConfig();

          }

        }
      );

    document
      .querySelectorAll(".sidebar a")
      .forEach(
        link => {

          link.addEventListener(
            "click",
            () => {

              if(
                window.innerWidth <= 900
              ){

                closeSidebar();

              }

            }
          );

        }
      );

    document.addEventListener(
      "keydown",
      event => {

        if(event.key === "Escape"){

          closeConfig();
          closeSidebar();

        }

      }
    );

  }

  /* ======================================================
     INIT
  ====================================================== */

  function init(){

    applyTheme(
      localStorage.getItem(
        STORAGE.theme
      ) || "dark"
    );

    if(!requireAuth()){
      return;
    }

    if(!canUseAI()){

      showToast(
        "AI permission unavailable",
        "Your current account may not have AI access.",
        "error"
      );

    }

    renderSession();

    loadWebsiteContext();

    loadChat();

    renderMessages();

    updateCharCount();

    renderAIConfig();

    bindEvents();

    $("#useContextBtn")
      .classList.toggle(
        "off",
        !usingContext
      );

  }

  init();

})();
