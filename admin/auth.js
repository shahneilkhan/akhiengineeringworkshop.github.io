/*
  AKHI ENGINEERING WORKSHOP
  ADMIN AUTH CORE v1.3 — SECURITY HARDENING

  IMPORTANT:
  This GitHub Pages version is still client-side authentication.
  It is not equivalent to server-side authentication.

  Final production phase:
  Supabase Auth + RLS + Passkey/WebAuthn
*/

(function(window, document){

  "use strict";

  const VERSION = "1.3";

  const SESSION_KEY = "aki_admin_session";
  const REMEMBER_KEY = "aki_admin_remember";
  const EMAIL_KEY = "aki_admin_email";

  const ACTIVITY_KEY = "aki_admin_activity_v1";
  const ACCOUNTS_KEY = "aki_admin_accounts_v1";
  const SECURITY_KEY = "aki_security_settings_v1";

  const SESSION_TTL = 12 * 60 * 60 * 1000;
  const REMEMBER_TTL = 30 * 24 * 60 * 60 * 1000;

  /*
    Permission model
  */

  const ROLE_PERMISSIONS = {

    admin:[
      "dashboard.read",

      "homepage.read",
      "homepage.write",

      "banner.read",
      "banner.write",

      "projects.read",
      "projects.write",

      "media.read",
      "media.write",

      "settings.read",
      "settings.write",

      "ai.read",
      "ai.use",

      "activity.read"
    ],

    superadmin:[
      "*"
    ]

  };

  /*
    Security defaults
  */

  const SECURITY_DEFAULTS = {

    biometricEnabled:false,

    requireBiometric:false,

    passkeyReady:false,

    failedAttemptProtection:true,

    rememberDeviceAllowed:true,

    sessionTimeoutMinutes:720,

    developerCreditLocked:true,

    securityVersion:"1.0"

  };

  /*
    Legacy fallback accounts.

    The role selector is no longer exposed.
    The role is resolved silently from credentials.
  */

  const LEGACY_ACCOUNTS = [

    {
      email:"admin@akiworkshop.com",
      password:"AKI@2026",
      name:"Workshop Admin",
      role:"admin"
    },

    {
      email:"master@nusratafsana.com",
      password:"SNK@Master2026!",
      name:"Super Admin",
      role:"superadmin"
    }

  ];

  /* ======================================================
     BASIC HELPERS
  ====================================================== */

  function safeJson(value){

    try{
      return JSON.parse(value);
    }catch(error){
      return null;
    }

  }

  function normalizeRole(role){

    const value =
      String(role || "")
        .toLowerCase()
        .replace(/[\s_-]+/g,"");

    if(value === "superadmin"){
      return "superadmin";
    }

    return "admin";

  }

  function normalizeEmail(email){

    return String(email || "")
      .trim()
      .toLowerCase();

  }

  /* ======================================================
     URLS
  ====================================================== */

  function adminBase(){

    const path =
      location.pathname;

    const marker =
      "/admin/";

    const index =
      path.indexOf(marker);

    const prefix =
      index >= 0
        ? path.slice(0,index)
        : "";

    return prefix + "/admin";

  }

  function loginUrl(){

    return adminBase() + "/login/";

  }

  function dashboardUrl(){

    return adminBase() + "/dashboard.html";

  }

  function securityUrl(){

    return adminBase() + "/security.html";

  }

  /* ======================================================
     SECURITY SETTINGS
  ====================================================== */

  function getSecuritySettings(){

    const saved =
      safeJson(
        localStorage.getItem(
          SECURITY_KEY
        )
      );

    return {
      ...SECURITY_DEFAULTS,
      ...(saved && typeof saved === "object"
        ? saved
        : {})
    };

  }

  function saveSecuritySettings(settings){

    const current =
      getSecuritySettings();

    const next = {
      ...current,
      ...(settings || {})
    };

    localStorage.setItem(
      SECURITY_KEY,
      JSON.stringify(next)
    );

    return next;

  }

  /* ======================================================
     ACCOUNT REGISTRY
  ====================================================== */

  function getAccounts(){

    const raw =
      safeJson(
        localStorage.getItem(
          ACCOUNTS_KEY
        )
      );

    if(!Array.isArray(raw)){
      return [];
    }

    return raw;

  }

  function normalizeAccount(account){

    if(
      !account ||
      typeof account !== "object"
    ){
      return null;
    }

    const email =
      normalizeEmail(
        account.email ||
        account.username
      );

    if(!email){
      return null;
    }

    return {

      id:
        account.id ||
        account.uid ||
        account._id ||
        "account_" + email,

      email,

      password:
        String(
          account.password ||
          ""
        ),

      name:
        account.name ||
        account.displayName ||
        email,

      role:
        normalizeRole(
          account.role
        ),

      enabled:
        account.enabled !== false &&
        account.active !== false,

      permissions:
        Array.isArray(
          account.permissions
        )
          ? account.permissions
          : []

    };

  }

  function registryAccount(email,password){

    const normalizedEmail =
      normalizeEmail(email);

    const accounts =
      getAccounts();

    for(
      const rawAccount of accounts
    ){

      const account =
        normalizeAccount(
          rawAccount
        );

      if(!account){
        continue;
      }

      if(
        account.enabled &&
        account.email === normalizedEmail &&
        account.password === password
      ){

        return account;

      }

    }

    return null;

  }

  function legacyAccount(email,password){

    const normalizedEmail =
      normalizeEmail(email);

    return (
      LEGACY_ACCOUNTS.find(
        account =>
          normalizeEmail(
            account.email
          ) === normalizedEmail &&
          account.password === password
      ) ||
      null
    );

  }

  function resolveAccount(email,password){

    const registry =
      registryAccount(
        email,
        password
      );

    if(registry){
      return registry;
    }

    return legacyAccount(
      email,
      password
    );

  }

  /* ======================================================
     SESSION
  ====================================================== */

  function normalizeSession(raw){

    if(
      !raw ||
      typeof raw !== "object"
    ){
      return null;
    }

    if(
      raw.loggedIn !== true
    ){
      return null;
    }

    if(
      !raw.email ||
      !raw.role ||
      !raw.loginTime ||
      !raw.expiresAt
    ){
      return null;
    }

    const role =
      normalizeRole(
        raw.role
      );

    if(
      !["admin","superadmin"]
        .includes(role)
    ){
      return null;
    }

    if(
      Number(raw.expiresAt) <=
      Date.now()
    ){
      return null;
    }

    return {

      email:
        normalizeEmail(
          raw.email
        ),

      name:
        raw.name ||
        (
          role === "superadmin"
            ? "Super Admin"
            : "Workshop Admin"
        ),

      role,

      loggedIn:true,

      loginTime:
        raw.loginTime,

      lastSeen:
        raw.lastSeen ||
        raw.loginTime,

      expiresAt:
        Number(
          raw.expiresAt
        ),

      remember:
        Boolean(
          raw.remember
        ),

      version:
        raw.version ||
        VERSION

    };

  }

  function readSession(){

    const candidates = [

      sessionStorage.getItem(
        SESSION_KEY
      ),

      localStorage.getItem(
        REMEMBER_KEY
      )

    ];

    for(
      const value of candidates
    ){

      if(!value){
        continue;
      }

      const session =
        normalizeSession(
          safeJson(value)
        );

      if(session){
        return session;
      }

    }

    return null;

  }

  function writeSession(session){

    const payload =
      JSON.stringify(session);

    sessionStorage.removeItem(
      SESSION_KEY
    );

    localStorage.removeItem(
      REMEMBER_KEY
    );

    if(session.remember){

      localStorage.setItem(
        REMEMBER_KEY,
        payload
      );

    }else{

      sessionStorage.setItem(
        SESSION_KEY,
        payload
      );

    }

  }

  /* ======================================================
     ACTIVITY
  ====================================================== */

  function logActivity(
    action,
    meta
  ){

    const session =
      readSession();

    const existing =
      safeJson(
        localStorage.getItem(
          ACTIVITY_KEY
        )
      );

    const records =
      Array.isArray(existing)
        ? existing
        : [];

    records.unshift({

      id:
        "act_" +
        Date.now() +
        "_" +
        Math.random()
          .toString(36)
          .slice(2,8),

      action:
        String(
          action ||
          "activity"
        ),

      actor:
        session
          ? session.email
          : "anonymous",

      role:
        session
          ? session.role
          : "guest",

      meta:
        meta || {},

      at:
        new Date().toISOString()

    });

    localStorage.setItem(
      ACTIVITY_KEY,
      JSON.stringify(
        records.slice(0,500)
      )
    );

  }

  /* ======================================================
     LOGIN
  ====================================================== */

  function createSession(
    account,
    remember
  ){

    if(
      !account ||
      !account.email ||
      !account.role
    ){
      return null;
    }

    const now =
      Date.now();

    const role =
      normalizeRole(
        account.role
      );

    const session = {

      email:
        normalizeEmail(
          account.email
        ),

      name:
        account.name ||
        (
          role === "superadmin"
            ? "Super Admin"
            : "Workshop Admin"
        ),

      role,

      loggedIn:true,

      loginTime:
        new Date(now)
          .toISOString(),

      lastSeen:
        new Date(now)
          .toISOString(),

      expiresAt:
        now +
        (
          remember
            ? REMEMBER_TTL
            : SESSION_TTL
        ),

      remember:
        Boolean(remember),

      version:VERSION

    };

    writeSession(
      session
    );

    localStorage.setItem(
      EMAIL_KEY,
      session.email
    );

    logActivity(
      "login",
      {
        mode:
          remember
            ? "remembered"
            : "session",

        role:
          session.role
      }
    );

    return session;

  }

  function authenticate(
    email,
    password,
    remember
  ){

    const security =
      getSecuritySettings();

    if(
      security.failedAttemptProtection
    ){

      clearExpiredLoginAttempts();

      const locked =
        isLoginLocked();

      if(locked){

        return {
          success:false,
          error:
            "Too many failed attempts. Please try again later."
        };

      }

    }

    const account =
      resolveAccount(
        email,
        password
      );

    if(!account){

      recordFailedLogin();

      return {
        success:false,
        error:
          "Invalid email or password."
      };

    }

    clearLoginFailures();

    const session =
      createSession(
        account,
        remember
      );

    return {
      success:true,
      session
    };

  }

  /* ======================================================
     FAILED LOGIN PROTECTION
  ====================================================== */

  const FAILED_KEY =
    "aki_login_failures_v1";

  function getFailureState(){

    const data =
      safeJson(
        localStorage.getItem(
          FAILED_KEY
        )
      );

    if(
      !data ||
      typeof data !== "object"
    ){

      return {
        count:0,
        firstAt:0,
        lockedUntil:0
      };

    }

    return {

      count:
        Number(
          data.count || 0
        ),

      firstAt:
        Number(
          data.firstAt || 0
        ),

      lockedUntil:
        Number(
          data.lockedUntil || 0
        )

    };

  }

  function saveFailureState(
    state
  ){

    localStorage.setItem(
      FAILED_KEY,
      JSON.stringify(state)
    );

  }

  function recordFailedLogin(){

    const state =
      getFailureState();

    const now =
      Date.now();

    if(
      !state.firstAt ||
      now - state.firstAt >
      15 * 60 * 1000
    ){

      state.count = 0;
      state.firstAt = now;

    }

    state.count++;

    if(
      state.count >= 6
    ){

      state.lockedUntil =
        now +
        10 * 60 * 1000;

      logActivity(
        "security_login_lock",
        {
          count:
            state.count
        }
      );

    }

    saveFailureState(
      state
    );

  }

  function clearLoginFailures(){

    localStorage.removeItem(
      FAILED_KEY
    );

  }

  function clearExpiredLoginAttempts(){

    const state =
      getFailureState();

    if(
      state.lockedUntil &&
      state.lockedUntil <=
      Date.now()
    ){

      clearLoginFailures();

    }

  }

  function isLoginLocked(){

    const state =
      getFailureState();

    return (
      state.lockedUntil >
      Date.now()
    );

  }

  /* ======================================================
     SESSION MANAGEMENT
  ====================================================== */

  function touch(){

    const session =
      readSession();

    if(!session){
      return null;
    }

    session.lastSeen =
      new Date()
        .toISOString();

    writeSession(
      session
    );

    return session;

  }

  function logout(
    redirect=true
  ){

    const session =
      readSession();

    if(session){

      logActivity(
        "logout",
        {
          role:
            session.role
        }
      );

    }

    sessionStorage.removeItem(
      SESSION_KEY
    );

    localStorage.removeItem(
      REMEMBER_KEY
    );

    localStorage.removeItem(
      EMAIL_KEY
    );

    if(redirect){

      location.href =
        loginUrl();

    }

  }

  function getSession(){

    return readSession();

  }

  function requireAuth(){

    const session =
      readSession();

    if(!session){

      location.href =
        loginUrl();

      return false;

    }

    touch();

    return true;

  }

  /* ======================================================
     PERMISSIONS
  ====================================================== */

  function hasPermission(
    permission
  ){

    const session =
      readSession();

    if(!session){
      return false;
    }

    const rolePermissions =
      ROLE_PERMISSIONS[
        session.role
      ] || [];

    return (
      rolePermissions.includes("*") ||
      rolePermissions.includes(
        permission
      )
    );

  }

  function requirePermission(
    permission
  ){

    if(
      !requireAuth()
    ){
      return false;
    }

    if(
      hasPermission(
        permission
      )
    ){

      return true;

    }

    location.href =
      dashboardUrl();

    return false;

  }

  function requireRole(
    role
  ){

    const session =
      readSession();

    if(!session){

      location.href =
        loginUrl();

      return false;

    }

    const allowed =
      Array.isArray(role)
        ? role
        : [role];

    const normalized =
      allowed.map(
        item =>
          normalizeRole(item)
      );

    if(
      normalized.includes(
        session.role
      )
    ){

      return true;

    }

    location.href =
      dashboardUrl();

    return false;

  }

  /* ======================================================
     SECURITY ACCESS
  ====================================================== */

  function isSuperAdmin(){

    const session =
      readSession();

    return Boolean(
      session &&
      session.role ===
      "superadmin"
    );

  }

  function requireSuperAdmin(){

    if(
      !requireAuth()
    ){
      return false;
    }

    if(
      isSuperAdmin()
    ){

      return true;

    }

    location.href =
      dashboardUrl();

    return false;

  }

  /* ======================================================
     ACTIVITY GETTER
  ====================================================== */

  function getActivity(){

    const data =
      safeJson(
        localStorage.getItem(
          ACTIVITY_KEY
        )
      );

    return Array.isArray(data)
      ? data
      : [];

  }

  /* ======================================================
     SESSION CLEANUP
  ====================================================== */

  function clearExpired(){

    const session =
      readSession();

    if(session){
      return session;
    }

    sessionStorage.removeItem(
      SESSION_KEY
    );

    localStorage.removeItem(
      REMEMBER_KEY
    );

    return null;

  }

  /* ======================================================
     PASSKEY / WEB AUTHN DETECTION
  ====================================================== */

  function isPasskeySupported(){

    return Boolean(
      window.PublicKeyCredential &&
      navigator.credentials &&
      typeof navigator.credentials.create ===
        "function" &&
      typeof navigator.credentials.get ===
        "function"
    );

  }

  /* ======================================================
     GLOBAL API
  ====================================================== */

  window.AKIAdmin = {

    VERSION,

    SESSION_KEY,
    REMEMBER_KEY,

    ROLE_PERMISSIONS,

    SECURITY_DEFAULTS,

    loginUrl,
    dashboardUrl,
    securityUrl,

    getSession,
    createSession,
    authenticate,

    logout,

    requireAuth,
    requireRole,
    requirePermission,
    requireSuperAdmin,

    hasPermission,
    isSuperAdmin,

    getActivity,

    getSecuritySettings,
    saveSecuritySettings,

    isPasskeySupported,

    clearExpired,
    touch,

    logActivity

  };

  /* ======================================================
     OPTIONAL AUTO GUARD
  ====================================================== */

  document.addEventListener(
    "DOMContentLoaded",
    function(){

      const path =
        location.pathname;

      const isLogin =
        /\/admin\/login(?:\/|\.html)?$/i
          .test(path) ||
        /\/admin\/login\/index\.html$/i
          .test(path);

      const isSecurity =
        /\/admin\/security\.html$/i
          .test(path);

      const guard =
        document.documentElement
          .dataset
          .adminGuard === "true";

      if(
        !isLogin &&
        guard
      ){

        if(isSecurity){

          requireSuperAdmin();

        }else{

          requireAuth();

        }

      }

      document
        .querySelectorAll(
          "[data-admin-logout]"
        )
        .forEach(
          button => {

            button.addEventListener(
              "click",
              function(){

                logout();

              }
            );

          }
        );

    }
  );

})(window,document);
