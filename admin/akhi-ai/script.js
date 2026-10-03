/* =========================================================
   AKHI.AI — AI ENGINEERING ASSISTANT
   File: admin/akhi-ai/script.js

   Current version:
   - Chat UI
   - Demo AI responses
   - New conversation
   - Sidebar navigation
   - Mobile sidebar
   - Theme switcher
   - Voice input
   - File attachment
   - Quotation assistant
   - Local chat history
   - Typing animation

   Future:
   - Real AI API
   - Firebase Authentication
   - Firestore chat history
   - Admin knowledge base
========================================================= */

"use strict";


/* =========================================================
   CONFIG
========================================================= */

const AKHI_CONFIG = {
  assistantName: "AKHI.AI",
  workshopName: "AKI Engineering Workshop",

  storage: {
    theme: "akhi-theme",
    chats: "akhi-chat-history"
  },

  demoDelay: 900,

  maxMessageLength: 2000
};


/* =========================================================
   DOM
========================================================= */

const elements = {
  body: document.body,

  sidebar: document.getElementById("sidebar"),
  sidebarOverlay: document.getElementById("sidebarOverlay"),

  mobileMenu: document.getElementById("mobileMenu"),
  mobileClose: document.getElementById("mobileClose"),

  newChatBtn: document.getElementById("newChatBtn"),

  themeBtn: document.getElementById("themeBtn"),

  pageTitle: document.getElementById("pageTitle"),

  chatView: document.getElementById("chatView"),
  historyView: document.getElementById("historyView"),
  knowledgeView: document.getElementById("knowledgeView"),
  servicesView: document.getElementById("servicesView"),
  quotationView: document.getElementById("quotationView"),
  contactView: document.getElementById("contactView"),

  chatHero: document.getElementById("chatHero"),
  messages: document.getElementById("messages"),
  suggestions: document.getElementById("suggestions"),

  messageInput: document.getElementById("messageInput"),
  sendBtn: document.getElementById("sendBtn"),

  attachBtn: document.getElementById("attachBtn"),
  fileInput: document.getElementById("fileInput"),

  voiceBtn: document.getElementById("voiceBtn"),

  quotationBtn: document.getElementById("quotationBtn"),

  toast: document.getElementById("toast"),
  toastText: document.getElementById("toastText")
};


/* =========================================================
   STATE
========================================================= */

const state = {
  messages: [],
  isTyping: false,
  currentView: "chat",
  recognition: null,
  recognitionActive: false,
  toastTimer: null
};


/* =========================================================
   INITIALIZE
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

  initializeTheme();

  initializeNavigation();

  initializeChat();

  initializeComposer();

  initializeSuggestions();

  initializeFileUpload();

  initializeVoiceInput();

  initializeQuotation();

  initializeActionButtons();

  initializeKeyboardShortcuts();

});


/* =========================================================
   THEME
========================================================= */

function initializeTheme() {

  const savedTheme = localStorage.getItem(
    AKHI_CONFIG.storage.theme
  );

  if (savedTheme === "light") {
    elements.body.classList.add("light-mode");
  }

  updateThemeButton();

  elements.themeBtn?.addEventListener("click", toggleTheme);
}


function toggleTheme() {

  elements.body.classList.toggle("light-mode");

  const isLight = elements.body.classList.contains("light-mode");

  localStorage.setItem(
    AKHI_CONFIG.storage.theme,
    isLight ? "light" : "dark"
  );

  updateThemeButton();

  showToast(
    isLight
      ? "Light mode enabled"
      : "Dark mode enabled"
  );
}


function updateThemeButton() {

  if (!elements.themeBtn) {
    return;
  }

  const isLight =
    elements.body.classList.contains("light-mode");

  elements.themeBtn.textContent = isLight
    ? "☀"
    : "◐";

  elements.themeBtn.setAttribute(
    "aria-label",
    isLight
      ? "Switch to dark mode"
      : "Switch to light mode"
  );
}


/* =========================================================
   NAVIGATION
========================================================= */

function initializeNavigation() {

  const navItems = document.querySelectorAll(
    ".nav-item"
  );

  navItems.forEach((item) => {

    item.addEventListener("click", () => {

      const view = item.dataset.view;

      if (!view) {
        return;
      }

      switchView(view);

      closeSidebar();

    });

  });

}


function switchView(viewName) {

  state.currentView = viewName;

  const views = {
    chat: elements.chatView,
    history: elements.historyView,
    knowledge: elements.knowledgeView,
    services: elements.servicesView,
    quotation: elements.quotationView,
    contact: elements.contactView
  };

  Object.entries(views).forEach(
    ([name, element]) => {

      if (!element) {
        return;
      }

      element.classList.toggle(
        "hidden",
        name !== viewName
      );

    }
  );


  const navItems = document.querySelectorAll(
    ".nav-item"
  );

  navItems.forEach((item) => {

    item.classList.toggle(
      "active",
      item.dataset.view === viewName
    );

  });


  const titles = {
    chat: "AKHI.AI",
    history: "Chat History",
    knowledge: "Knowledge Base",
    services: "Engineering Services",
    quotation: "Request a Quotation",
    contact: "Contact Workshop"
  };

  if (elements.pageTitle) {
    elements.pageTitle.textContent =
      titles[viewName] || "AKHI.AI";
  }


  if (viewName === "history") {
    renderHistory();
  }

}


/* =========================================================
   MOBILE SIDEBAR
========================================================= */

function initializeMobileSidebar() {

  elements.mobileMenu?.addEventListener(
    "click",
    openSidebar
  );

  elements.mobileClose?.addEventListener(
    "click",
    closeSidebar
  );

  elements.sidebarOverlay?.addEventListener(
    "click",
    closeSidebar
  );
}


initializeMobileSidebar();


function openSidebar() {

  elements.sidebar?.classList.add("open");

  elements.sidebarOverlay?.classList.add("show");

  document.body.style.overflow = "hidden";
}


function closeSidebar() {

  elements.sidebar?.classList.remove("open");

  elements.sidebarOverlay?.classList.remove("show");

  document.body.style.overflow = "";
}


/* =========================================================
   CHAT INITIALIZATION
========================================================= */

function initializeChat() {

  loadCurrentChat();

  if (state.messages.length === 0) {

    addAIMessage(
      getWelcomeMessage(),
      false
    );

  }

}


function getWelcomeMessage() {

  return `
    <strong>Hello! I'm AKHI.AI.</strong><br><br>

    I'm the intelligent assistant for
    <strong>AKI Engineering Workshop</strong>.

    I can help you understand our services,
    discuss project requirements, prepare a
    quotation request, or guide you toward the
    right engineering solution.

    <br><br>

    What would you like to work on today?
  `;

}


/* =========================================================
   COMPOSER
========================================================= */

function initializeComposer() {

  elements.sendBtn?.addEventListener(
    "click",
    handleSend
  );


  elements.messageInput?.addEventListener(
    "keydown",
    (event) => {

      if (
        event.key === "Enter" &&
        !event.shiftKey
      ) {

        event.preventDefault();

        handleSend();

      }

    }
  );


  elements.messageInput?.addEventListener(
    "input",
    autoResizeTextarea
  );

}


function autoResizeTextarea() {

  const textarea = elements.messageInput;

  if (!textarea) {
    return;
  }

  textarea.style.height = "auto";

  textarea.style.height =
    Math.min(
      textarea.scrollHeight,
      140
    ) + "px";

}


/* =========================================================
   SEND MESSAGE
========================================================= */

async function handleSend() {

  if (state.isTyping) {
    return;
  }

  const input = elements.messageInput;

  if (!input) {
    return;
  }

  const message = input.value.trim();

  if (!message) {
    return;
  }

  if (message.length > AKHI_CONFIG.maxMessageLength) {

    showToast(
      `Please keep your message under ${AKHI_CONFIG.maxMessageLength} characters.`
    );

    return;
  }


  addUserMessage(message);

  input.value = "";

  autoResizeTextarea();

  hideSuggestions();

  await generateDemoResponse(message);

}


/* =========================================================
   ADD USER MESSAGE
========================================================= */

function addUserMessage(message) {

  const messageObject = {
    id: createId(),
    role: "user",
    content: escapeHTML(message),
    timestamp: Date.now()
  };

  state.messages.push(messageObject);

  renderMessage(messageObject);

  saveCurrentChat();

}


/* =========================================================
   ADD AI MESSAGE
========================================================= */

function addAIMessage(
  message,
  save = true
) {

  const messageObject = {
    id: createId(),
    role: "ai",
    content: message,
    timestamp: Date.now()
  };

  state.messages.push(messageObject);

  renderMessage(messageObject);

  if (save) {
    saveCurrentChat();
  }

}


/* =========================================================
   RENDER MESSAGE
========================================================= */

function renderMessage(message) {

  if (!elements.messages) {
    return;
  }

  const wrapper =
    document.createElement("div");

  wrapper.className =
    `message ${message.role}`;

  const avatar =
    document.createElement("div");

  avatar.className =
    "message-avatar";

  avatar.textContent =
    message.role === "ai"
      ? "AK"
      : "YOU";


  const bubble =
    document.createElement("div");

  bubble.className =
    "message-bubble";

  bubble.innerHTML =
    message.content;


  wrapper.appendChild(avatar);
  wrapper.appendChild(bubble);

  elements.messages.appendChild(wrapper);

  scrollMessagesToBottom();

}


/* =========================================================
   TYPING INDICATOR
========================================================= */

function showTyping() {

  if (state.isTyping) {
    return;
  }

  state.isTyping = true;

  const wrapper =
    document.createElement("div");

  wrapper.className =
    "message ai";

  wrapper.id =
    "akhiTyping";

  wrapper.innerHTML = `
    <div class="message-avatar">AK</div>

    <div class="message-bubble">

      <div class="typing">
        <span></span>
        <span></span>
        <span></span>
      </div>

    </div>
  `;

  elements.messages.appendChild(wrapper);

  scrollMessagesToBottom();

}


function hideTyping() {

  const typing =
    document.getElementById(
      "akhiTyping"
    );

  typing?.remove();

  state.isTyping = false;

}


/* =========================================================
   DEMO AI
========================================================= */

async function generateDemoResponse(
  userMessage
) {

  showTyping();

  await delay(
    AKHI_CONFIG.demoDelay
  );

  hideTyping();

  const response =
    generateDemoAIResponse(userMessage);

  addAIMessage(response);

}


/* =========================================================
   DEMO AI RESPONSE ENGINE
========================================================= */

function generateDemoAIResponse(
  input
) {

  const message =
    input.toLowerCase();


  /* Greeting */

  if (
    containsAny(
      message,
      [
        "hello",
        "hi",
        "hey",
        "হ্যালো",
        "হাই",
        "আসসালামু"
      ]
    )
  ) {

    return `
      <strong>Hello! 👋</strong><br><br>

      Welcome to <strong>AKI Engineering Workshop</strong>.

      I'm <strong>AKHI.AI</strong>, your engineering
      assistant.

      You can ask me about workshop services,
      project requirements, quotations or how to
      contact our team.
    `;

  }


  /* Services */

  if (
    containsAny(
      message,
      [
        "service",
        "services",
        "সার্ভিস",
        "সেবা",
        "workshop"
      ]
    )
  ) {

    return `
      <strong>AKI Engineering Workshop Services</strong><br><br>

      AKHI.AI can guide you through our available
      engineering and workshop solutions.

      <br><br>

      <strong>Typical service categories:</strong>

      <br>
      • Engineering solutions<br>
      • Technical consultation<br>
      • Project planning<br>
      • Project estimation<br>
      • Custom engineering requirements

      <br><br>

      For an exact service list, the workshop
      administrator can update the AKHI.AI Knowledge
      Base from the admin panel.
    `;

  }


  /* Price / quotation */

  if (
    containsAny(
      message,
      [
        "price",
        "cost",
        "quotation",
        "quote",
        "estimate",
        "দাম",
        "মূল্য",
        "কোটেশন",
        "খরচ"
      ]
    )
  ) {

    return `
      <strong>Quotation Request</strong><br><br>

      Project cost depends on the type of work,
      materials, specifications, quantity and
      required delivery timeline.

      <br><br>

      To prepare a quotation, please provide:

      <br>
      • Your name<br>
      • Phone number<br>
      • Project description<br>
      • Required specifications<br>
      • Approximate quantity<br>
      • Expected deadline

      <br><br>

      You can also use the
      <strong>Request a Quotation</strong>
      section from the sidebar.
    `;

  }


  /* Project */

  if (
    containsAny(
      message,
      [
        "project",
        "design",
        "engineering",
        "technical",
        "প্রজেক্ট",
        "ডিজাইন",
        "ইঞ্জিনিয়ারিং",
        "টেকনিক্যাল"
      ]
    )
  ) {

    return `
      <strong>Let's discuss your project.</strong><br><br>

      I can help organize your project requirements
      before you contact the workshop.

      <br><br>

      Please tell me:

      <br>
      1. What are you trying to build or repair?<br>
      2. What specifications do you already have?<br>
      3. What materials are involved?<br>
      4. What quantity is required?<br>
      5. When do you need it?

      <br><br>

      Once these details are available, the workshop
      team can review the requirement.
    `;

  }


  /* Contact */

  if (
    containsAny(
      message,
      [
        "contact",
        "phone",
        "call",
        "whatsapp",
        "যোগাযোগ",
        "ফোন",
        "কল"
      ]
    )
  ) {

    return `
      <strong>Contact AKI Engineering Workshop</strong><br><br>

      You can contact the workshop directly through
      the <strong>Contact Workshop</strong> section.

      <br><br>

      The administrator can update the official
      phone, WhatsApp and email information from
      the system settings.
    `;

  }


  /* Thank you */

  if (
    containsAny(
      message,
      [
        "thanks",
        "thank you",
        "ধন্যবাদ"
      ]
    )
  ) {

    return `
      You're welcome! 😊

      <br><br>

      If you have an engineering project in mind,
      feel free to describe it and I'll help you
      organize the requirements.
    `;

  }


  /* Default */

  return `
    <strong>Thanks for your message.</strong><br><br>

    I understand that you're asking about:

    <br><br>

    <em>
      "${escapeHTML(
        truncate(input, 240)
      )}"
    </em>

    <br><br>

    I'm currently running in
    <strong>demo assistant mode</strong>.

    <br><br>

    I can currently help with:

    <br>
    • Workshop services<br>
    • Engineering projects<br>
    • Quotations<br>
    • Technical requirements<br>
    • Contact information

    <br><br>

    The next version can connect AKHI.AI to a real
    AI model and the workshop's knowledge base.
  `;

}


/* =========================================================
   SUGGESTIONS
========================================================= */

function initializeSuggestions() {

  const cards =
    document.querySelectorAll(
      ".suggestion-card"
    );

  cards.forEach((card) => {

    card.addEventListener(
      "click",
      () => {

        const prompt =
          card.dataset.prompt;

        if (!prompt) {
          return;
        }

        sendPrompt(prompt);

      }
    );

  });


  document
    .querySelectorAll(".ask-service")
    .forEach((button) => {

      button.addEventListener(
        "click",
        () => {

          const prompt =
            button.dataset.prompt;

          if (prompt) {
            sendPrompt(prompt);
          }

        }
      );

    });

}


function sendPrompt(prompt) {

  switchView("chat");

  if (!elements.messageInput) {
    return;
  }

  elements.messageInput.value =
    prompt;

  autoResizeTextarea();

  handleSend();

}


function hideSuggestions() {

  if (!elements.suggestions) {
    return;
  }

  elements.suggestions.style.display =
    "none";

}


/* =========================================================
   NEW CHAT
========================================================= */

function initializeNewChat() {

  elements.newChatBtn?.addEventListener(
    "click",
    startNewChat
  );

}


initializeNewChat();


function startNewChat() {

  state.messages = [];

  if (elements.messages) {
    elements.messages.innerHTML = "";
  }

  switchView("chat");

  elements.suggestions.style.display =
    "";

  addAIMessage(
    getWelcomeMessage(),
    false
  );

  saveCurrentChat();

  closeSidebar();

  showToast(
    "New conversation started"
  );

}


/* =========================================================
   CHAT STORAGE
========================================================= */

function saveCurrentChat() {

  try {

    const chats =
      getStoredChats();

    const existing =
      chats[0];

    const chat = {
      id: existing?.id || createId(),
      title: createChatTitle(),
      messages: state.messages,
      updatedAt: Date.now()
    };

    const filtered =
      chats.filter(
        item => item.id !== chat.id
      );

    filtered.unshift(chat);

    localStorage.setItem(
      AKHI_CONFIG.storage.chats,
      JSON.stringify(
        filtered.slice(0, 20)
      )
    );

  } catch (error) {

    console.warn(
      "Could not save chat:",
      error
    );

  }

}


function getStoredChats() {

  try {

    const raw =
      localStorage.getItem(
        AKHI_CONFIG.storage.chats
      );

    return raw
      ? JSON.parse(raw)
      : [];

  } catch {

    return [];

  }

}


function loadCurrentChat() {

  const chats =
    getStoredChats();

  if (
    chats.length &&
    Array.isArray(
      chats[0].messages
    )
  ) {

    state.messages =
      chats[0].messages;

    state.messages.forEach(
      renderMessage
    );

  }

}


function createChatTitle() {

  const firstUserMessage =
    state.messages.find(
      message =>
        message.role === "user"
    );

  if (!firstUserMessage) {
    return "New AKHI.AI Conversation";
  }

  return truncate(
    stripHTML(
      firstUserMessage.content
    ),
    60
  );

}


/* =========================================================
   HISTORY
========================================================= */

function renderHistory() {

  const container =
    elements.historyView;

  if (!container) {
    return;
  }

  const old =
    container.querySelector(
      ".history-list"
    );

  old?.remove();

  const chats =
    getStoredChats();

  if (!chats.length) {
    return;
  }

  const list =
    document.createElement("div");

  list.className =
    "history-list";

  list.style.display = "grid";
  list.style.gap = "10px";


  chats.forEach((chat) => {

    const item =
      document.createElement("button");

    item.type = "button";

    item.style.cssText = `
      width:100%;
      display:flex;
      align-items:center;
      justify-content:space-between;
      gap:15px;
      padding:16px;
      text-align:left;
      color:inherit;
      background:var(--panel);
      border:1px solid var(--border);
      border-radius:14px;
    `;

    const title =
      document.createElement("span");

    title.innerHTML = `
      <strong style="display:block;font-size:11px;">
        ${escapeHTML(chat.title)}
      </strong>

      <small style="display:block;margin-top:5px;color:var(--text-muted);font-size:8px;">
        ${formatDate(chat.updatedAt)}
      </small>
    `;


    const arrow =
      document.createElement("span");

    arrow.textContent = "→";

    arrow.style.color =
      "var(--accent)";


    item.appendChild(title);
    item.appendChild(arrow);

    item.addEventListener(
      "click",
      () => {

        state.messages =
          Array.isArray(chat.messages)
            ? chat.messages
            : [];

        elements.messages.innerHTML = "";

        state.messages.forEach(
          renderMessage
        );

        switchView("chat");

        showToast(
          "Conversation loaded"
        );

      }
    );


    list.appendChild(item);

  });


  container.appendChild(list);

}


/* =========================================================
   FILE ATTACHMENT
========================================================= */

function initializeFileUpload() {

  elements.attachBtn?.addEventListener(
    "click",
    () => {

      elements.fileInput?.click();

    }
  );


  elements.fileInput?.addEventListener(
    "change",
    handleFile
  );

}


function handleFile(event) {

  const file =
    event.target.files?.[0];

  if (!file) {
    return;
  }


  const maxSize =
    10 * 1024 * 1024;

  if (file.size > maxSize) {

    showToast(
      "File must be smaller than 10MB."
    );

    event.target.value = "";

    return;
  }


  showToast(
    `${file.name} attached`
  );


  if (elements.messageInput) {

    const current =
      elements.messageInput.value.trim();

    elements.messageInput.value =
      current
        ? `${current}\n\n[Attached: ${file.name}]`
        : `[Attached: ${file.name}]`;

    autoResizeTextarea();

  }

}


/* =========================================================
   VOICE INPUT
========================================================= */

function initializeVoiceInput() {

  const SpeechRecognition =
    window.SpeechRecognition ||
    window.webkitSpeechRecognition;

  if (!SpeechRecognition) {

    elements.voiceBtn?.addEventListener(
      "click",
      () => {

        showToast(
          "Voice input is not supported by this browser."
        );

      }
    );

    return;
  }


  state.recognition =
    new SpeechRecognition();

  state.recognition.lang =
    "en-US";

  state.recognition.continuous =
    false;

  state.recognition.interimResults =
    false;


  state.recognition.onstart =
    () => {

      state.recognitionActive =
        true;

      elements.voiceBtn?.classList.add(
        "active"
      );

      showToast(
        "Listening..."
      );

    };


  state.recognition.onend =
    () => {

      state.recognitionActive =
        false;

      elements.voiceBtn?.classList.remove(
        "active"
      );

    };


  state.recognition.onerror =
    () => {

      state.recognitionActive =
        false;

      elements.voiceBtn?.classList.remove(
        "active"
      );

      showToast(
        "Voice input could not be started."
      );

    };


  state.recognition.onresult =
    (event) => {

      const transcript =
        event.results[0][0].transcript;

      if (
        elements.messageInput
      ) {

        elements.messageInput.value =
          transcript;

        autoResizeTextarea();

      }

    };


  elements.voiceBtn?.addEventListener(
    "click",
    toggleVoiceInput
  );

}


function toggleVoiceInput() {

  if (!state.recognition) {
    return;
  }


  if (state.recognitionActive) {

    state.recognition.stop();

    return;
  }


  try {

    state.recognition.start();

  } catch (error) {

    console.warn(
      "Voice recognition error:",
      error
    );

  }

}


/* =========================================================
   QUOTATION
========================================================= */

function initializeQuotation() {

  elements.quotationBtn?.addEventListener(
    "click",
    () => {

      const name =
        document
          .getElementById("qName")
          ?.value
          .trim();

      const phone =
        document
          .getElementById("qPhone")
          ?.value
          .trim();

      const project =
        document
          .getElementById("qProject")
          ?.value
          .trim();


      if (!name) {

        showToast(
          "Please enter your name."
        );

        return;
      }


      if (!phone) {

        showToast(
          "Please enter your phone number."
        );

        return;
      }


      if (!project) {

        showToast(
          "Please describe your project."
        );

        return;
      }


      const prompt = `
I want to request a quotation.

Name: ${name}

Phone: ${phone}

Project:
${project}
      `.trim();


      switchView("chat");

      sendPrompt(prompt);

    }
  );

}


/* =========================================================
   GENERAL ACTION BUTTONS
========================================================= */

function initializeActionButtons() {

  document
    .querySelectorAll(
      '[data-action="new-chat"]'
    )
    .forEach((button) => {

      button.addEventListener(
        "click",
        startNewChat
      );

    });

}


/* =========================================================
   KEYBOARD SHORTCUTS
========================================================= */

function initializeKeyboardShortcuts() {

  document.addEventListener(
    "keydown",
    (event) => {

      if (
        (event.ctrlKey || event.metaKey) &&
        event.key.toLowerCase() === "k"
      ) {

        event.preventDefault();

        startNewChat();

      }


      if (
        event.key === "Escape"
      ) {

        closeSidebar();

      }

    }
  );

}


/* =========================================================
   SCROLL
========================================================= */

function scrollMessagesToBottom() {

  requestAnimationFrame(
    () => {

      if (!elements.messages) {
        return;
      }

      elements.messages.scrollTo({
        top:
          elements.messages.scrollHeight,
        behavior: "smooth"
      });

    }
  );

}


/* =========================================================
   TOAST
========================================================= */

function showToast(message) {

  if (
    !elements.toast ||
    !elements.toastText
  ) {
    return;
  }

  clearTimeout(
    state.toastTimer
  );

  elements.toastText.textContent =
    message;

  elements.toast.classList.add(
    "show"
  );

  state.toastTimer =
    setTimeout(
      () => {

        elements.toast.classList.remove(
          "show"
        );

      },
      2800
    );

}


/* =========================================================
   UTILITIES
========================================================= */

function delay(milliseconds) {

  return new Promise(
    resolve =>
      setTimeout(
        resolve,
        milliseconds
      )
  );

}


function createId() {

  return (
    Date.now().toString(36) +
    Math.random()
      .toString(36)
      .slice(2, 8)
  );

}


function truncate(
  value,
  maxLength
) {

  if (!value) {
    return "";
  }

  return value.length > maxLength
    ? value.slice(0, maxLength) + "..."
    : value;

}


function stripHTML(value) {

  const div =
    document.createElement("div");

  div.innerHTML =
    value || "";

  return div.textContent || "";

}


function escapeHTML(value) {

  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

}


function containsAny(
  text,
  words
) {

  return words.some(
    word =>
      text.includes(
        word.toLowerCase()
      )
  );

}


function formatDate(timestamp) {

  if (!timestamp) {
    return "Recently";
  }

  try {

    return new Intl.DateTimeFormat(
      "en-BD",
      {
        day: "numeric",
        month: "short",
        year: "numeric"
      }
    ).format(
      new Date(timestamp)
    );

  } catch {

    return "Recently";

  }

}


/* =========================================================
   PAGE VISIBILITY
========================================================= */

document.addEventListener(
  "visibilitychange",
  () => {

    if (
      document.visibilityState ===
      "visible"
    ) {

      updateThemeButton();

    }

  }
);


/* =========================================================
   GLOBAL API PLACEHOLDER
   Future real AI integration can call:

   window.AKHI_AI.sendMessage("Hello");

========================================================= */

window.AKHI_AI = {

  sendMessage(message) {

    if (
      typeof message !== "string" ||
      !message.trim()
    ) {
      return;
    }

    switchView("chat");

    if (elements.messageInput) {

      elements.messageInput.value =
        message.trim();

      autoResizeTextarea();

      handleSend();

    }

  },


  newChat() {

    startNewChat();

  },


  openQuotation() {

    switchView("quotation");

  },


  openServices() {

    switchView("services");

  }

};


/* =========================================================
   END
========================================================= */
