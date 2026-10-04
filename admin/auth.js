/*
  AKI ENGINEERING WORKSHOP — ADMIN AUTH CORE v1.1
  Browser-side session bridge for GitHub Pages.

  IMPORTANT:
  This is NOT server-side security. Credentials remain in client-side code.
  Use Firebase Auth / a secure backend before handling sensitive production data.
*/

(function (window, document) {
  'use strict';

  const SESSION_KEY = 'aki_admin_session';
  const REMEMBER_KEY = 'aki_admin_remember';
  const EMAIL_KEY = 'aki_admin_email';
  const ACTIVITY_KEY = 'aki_admin_activity_v1';

  const SESSION_TTL = 12 * 60 * 60 * 1000;
  const REMEMBER_TTL = 30 * 24 * 60 * 60 * 1000;

  const VERSION = '1.1';

  /*
    Role permission system
  */
  const ROLE_PERMISSIONS = {
    admin: [
      'dashboard.read',

      'homepage.read',
      'homepage.write',

      'banner.read',
      'banner.write',

      'projects.read',
      'projects.write',

      'media.read',
      'media.write',

      'settings.read',
      'settings.write',

      'ai.read',
      'ai.use'
    ],

    superadmin: ['*']
  };

  /*
    Find /admin/ base path
  */
  function adminBase() {
    const path = location.pathname;
    const marker = '/admin/';

    const index = path.indexOf(marker);

    const prefix =
      index >= 0
        ? path.slice(0, index)
        : '';

    return prefix + '/admin';
  }

  /*
    Login URL
  */
  function loginUrl() {
    return adminBase() + '/login/';
  }

  /*
    Dashboard URL
  */
  function dashboardUrl() {
    return adminBase() + '/dashboard.html';
  }

  /*
    Safe JSON parser
  */
  function safeJson(value) {
    try {
      return JSON.parse(value);
    } catch (_) {
      return null;
    }
  }

  /*
    Validate / normalize session
  */
  function normalizeSession(raw) {

    if (!raw || typeof raw !== 'object') {
      return null;
    }

    if (raw.loggedIn !== true) {
      return null;
    }

    if (
      !raw.email ||
      !raw.role ||
      !raw.loginTime ||
      !raw.expiresAt
    ) {
      return null;
    }

    const role = String(raw.role).toLowerCase();

    if (!['admin', 'superadmin'].includes(role)) {
      return null;
    }

    if (Number(raw.expiresAt) <= Date.now()) {
      return null;
    }

    return {
      email: String(raw.email).toLowerCase(),

      name:
        raw.name ||
        (
          role === 'superadmin'
            ? 'Super Admin'
            : 'Workshop Admin'
        ),

      role: role,

      loggedIn: true,

      loginTime: raw.loginTime,

      lastSeen:
        raw.lastSeen ||
        raw.loginTime,

      expiresAt:
        Number(raw.expiresAt),

      remember:
        Boolean(raw.remember),

      version:
        raw.version || VERSION
    };
  }

  /*
    Read active session
  */
  function readSession() {

    const candidates = [

      sessionStorage.getItem(
        SESSION_KEY
      ),

      localStorage.getItem(
        REMEMBER_KEY
      )

    ];

    for (
      const value of candidates
    ) {

      if (!value) {
        continue;
      }

      const session =
        normalizeSession(
          safeJson(value)
        );

      if (session) {
        return session;
      }
    }

    return null;
  }

  /*
    Write session
  */
  function writeSession(session) {

    const payload =
      JSON.stringify(session);

    sessionStorage.removeItem(
      SESSION_KEY
    );

    localStorage.removeItem(
      REMEMBER_KEY
    );

    if (session.remember) {

      localStorage.setItem(
        REMEMBER_KEY,
        payload
      );

    } else {

      sessionStorage.setItem(
        SESSION_KEY,
        payload
      );
    }
  }

  /*
    Activity log
  */
  function logActivity(
    action,
    meta
  ) {

    const session =
      readSession();

    const records =
      safeJson(
        localStorage.getItem(
          ACTIVITY_KEY
        )
      ) || [];

    records.unshift({

      id:
        'act_' +
        Date.now() +
        '_' +
        Math.random()
          .toString(36)
          .slice(2, 8),

      action: action,

      actor:
        session
          ? session.email
          : 'anonymous',

      role:
        session
          ? session.role
          : 'guest',

      meta:
        meta || {},

      at:
        new Date().toISOString()
    });

    /*
      Keep only latest 200 records
    */
    localStorage.setItem(
      ACTIVITY_KEY,
      JSON.stringify(
        records.slice(0, 200)
      )
    );
  }

  /*
    Create login session
  */
  function createSession(
    account,
    remember
  ) {

    const now =
      Date.now();

    const session = {

      email:
        String(account.email)
          .toLowerCase(),

      name:
        account.name,

      role:
        String(account.role)
          .toLowerCase(),

      loggedIn:
        true,

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

      version:
        VERSION
    };

    writeSession(
      session
    );

    localStorage.setItem(
      EMAIL_KEY,
      account.email
        .toLowerCase()
    );

    logActivity(
      'login',
      {
        mode:
          remember
            ? 'remembered'
            : 'session'
      }
    );

    return session;
  }

  /*
    Update last seen
  */
  function touch() {

    const session =
      readSession();

    if (!session) {
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

  /*
    Logout
  */
  function logout(
    redirect
  ) {

    const session =
      readSession();

    if (session) {

      logActivity(
        'logout'
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

    if (redirect !== false) {

      location.href =
        loginUrl();
    }
  }

  /*
    Permission checker
  */
  function hasPermission(
    permission
  ) {

    const session =
      readSession();

    if (!session) {
      return false;
    }

    const list =
      ROLE_PERMISSIONS[
        session.role
      ] || [];

    return (
      list.includes('*') ||
      list.includes(permission)
    );
  }

  /*
    Require permission
  */
  function requirePermission(
    permission
  ) {

    if (!requireAuth()) {
      return false;
    }

    if (
      hasPermission(
        permission
      )
    ) {

      return true;
    }

    location.href =
      dashboardUrl();

    return false;
  }

  /*
    Require specific role
  */
  function requireRole(
    role
  ) {

    const session =
      readSession();

    if (!session) {

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
        function (value) {
          return String(value)
            .toLowerCase();
        }
      );

    if (
      normalized.includes(
        session.role
      )
    ) {

      return true;
    }

    location.href =
      dashboardUrl();

    return false;
  }

  /*
    Require authenticated user
  */
  function requireAuth() {

    const session =
      readSession();

    if (!session) {

      location.href =
        loginUrl();

      return false;
    }

    touch();

    return true;
  }

  /*
    Get current session
  */
  function getSession() {
    return readSession();
  }

  /*
    Get activity logs
  */
  function getActivity() {

    return (
      safeJson(
        localStorage.getItem(
          ACTIVITY_KEY
        )
      ) || []
    );
  }

  /*
    Remove expired session
  */
  function clearExpired() {

    const session =
      readSession();

    if (session) {
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

  /*
    Public AKI Admin API
  */
  window.AKIAdmin = {

    VERSION,

    SESSION_KEY,

    REMEMBER_KEY,

    ROLE_PERMISSIONS,

    loginUrl,

    dashboardUrl,

    getSession,

    createSession,

    logout,

    requireAuth,

    requireRole,

    hasPermission,

    requirePermission,

    getActivity,

    clearExpired,

    touch,

    logActivity
  };

  /*
    Automatically protect admin pages
  */
  document.addEventListener(
    'DOMContentLoaded',
    function () {

      const isLogin =
        /\/admin\/login(?:\/|\.html)?$/i
          .test(location.pathname)
        ||
        /\/admin\/login\/index\.html$/i
          .test(location.pathname);

      /*
        Add:
        <html data-admin-guard="true">
        to pages that require authentication.
      */

      if (
        !isLogin &&
        document.documentElement
          .dataset
          .adminGuard === 'true'
      ) {

        requireAuth();
      }

      /*
        Logout buttons
      */
      document
        .querySelectorAll(
          '[data-admin-logout]'
        )
        .forEach(
          function (button) {

            button.addEventListener(
              'click',
              function () {

                logout();
              }
            );

          }
        );

    }
  );

})(window, document);
