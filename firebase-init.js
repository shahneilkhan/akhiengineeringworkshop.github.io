/* AKHI Engineering Workshop — Firebase bootstrap v1.0 */
(function(window, document){
  'use strict';
  const CFG = window.AKHI_FIREBASE_CONFIG || {};
  const placeholder = /YOUR_|REPLACE_ME|CHANGE_ME/i;
  const valid = !!(CFG.apiKey && CFG.projectId && CFG.appId) &&
    !placeholder.test(String(CFG.apiKey)) && !placeholder.test(String(CFG.projectId)) && !placeholder.test(String(CFG.appId));

  if (!window.firebase || !valid) {
    window.AKHI_FIREBASE = { ready:false, configured:false, app:null, auth:null, db:null, storage:null, functions:null, reason:'Firebase client configuration is not filled in.' };
    return;
  }

  try {
    const app = firebase.apps.length ? firebase.app() : firebase.initializeApp(CFG);
    const auth = firebase.auth(app);
    const db = firebase.firestore(app);
    const storage = firebase.storage ? firebase.storage(app) : null;
    const functions = firebase.functions ? firebase.functions(app) : null;

    let appCheckReady = false;
    const siteKey = String(window.AKHI_APP_CHECK_SITE_KEY || '');
    if (siteKey && !placeholder.test(siteKey) && firebase.appCheck) {
      try {
        const ac = firebase.appCheck(app);
        ac.activate(new firebase.appCheck.ReCaptchaEnterpriseProvider(siteKey), {isTokenAutoRefreshEnabled:true});
        appCheckReady = true;
      } catch (err) {
        console.warn('[AKHI] App Check initialization failed:', err);
      }
    }

    window.AKHI_FIREBASE = {ready:true, configured:true, app, auth, db, storage, functions, appCheckReady};
  } catch (err) {
    console.error('[AKHI] Firebase initialization failed:', err);
    window.AKHI_FIREBASE = {ready:false, configured:true, app:null, auth:null, db:null, storage:null, functions:null, reason:err.message || 'Firebase initialization failed.'};
  }
})(window, document);
