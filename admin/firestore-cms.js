/*
============================================================
AKHI ENGINEERING WORKSHOP
Firestore CMS Sync Bridge
Version: 1.0

Purpose:
- Bridge existing localStorage CMS with Firebase Firestore
- Preserve current CMS data structure
- Sync local CMS data to cloud
- Pull cloud data into local CMS
- Realtime Firestore -> localStorage updates
- Keep existing UI compatible
============================================================
*/

(function () {

  "use strict";


  /* ========================================================
     CONFIG
  ======================================================== */

  const CONFIG = {

    version: "1.0",

    maxDocumentBytes: 900000,

    debounceMs: 900,

    collections: {

      homepage: {
        localKey: "aki_homepage_content_v1",
        alias: "aki_homepage",
        collection: "cms",
        document: "homepage",
        permission: "homepage.write",
        type: "object"
      },

      banners: {
        localKey: "aki_banners_v1",
        alias: "aki_banners",
        collection: "cms",
        document: "banners",
        permission: "banner.write",
        type: "array"
      },

      projects: {
        localKey: "aki_projects_v1",
        alias: "aki_projects",
        collection: "cms",
        document: "projects",
        permission: "projects.write",
        type: "array"
      },

      media: {
        localKey: "aki_media_v1",
        alias: "aki_media",
        collection: "cms",
        document: "media",
        permission: "media.write",
        type: "array"
      },

      siteSettings: {
        localKey: "aki_site_settings_v1",
        alias: "aki_site_settings",
        collection: "cms",
        document: "siteSettings",
        permission: "settings.write",
        type: "object"
      }

    }

  };


  /* ========================================================
     STATE
  ======================================================== */

  const state = {

    initialized: false,

    enabled: false,

    syncing: false,

    hydrating: false,

    ready: false,

    listeners: {},

    timers: {},

    originalSetItem: null,

    originalRemoveItem: null,

    originalClear: null,

    bridgeInstalled: false

  };


  /* ========================================================
     HELPERS
  ======================================================== */

  function log() {

    console.log(
      "[AKI Firestore CMS]",
      ...arguments
    );

  }


  function warn() {

    console.warn(
      "[AKI Firestore CMS]",
      ...arguments
    );

  }


  function error() {

    console.error(
      "[AKI Firestore CMS]",
      ...arguments
    );

  }


  function isObject(value) {

    return (
      value !== null &&
      typeof value === "object" &&
      !Array.isArray(value)
    );

  }


  function clone(value) {

    try {

      return JSON.parse(
        JSON.stringify(value)
      );

    } catch {

      return value;

    }

  }


  function parseJSON(value) {

    if (
      value === null ||
      value === undefined ||
      value === ""
    ) {

      return null;

    }


    try {

      return JSON.parse(value);

    } catch {

      return null;

    }

  }


  function serialize(value) {

    return JSON.stringify(
      value ?? null
    );

  }


  function sizeBytes(value) {

    const text =
      typeof value === "string"
        ? value
        : serialize(value);

    try {

      return new Blob([text]).size;

    } catch {

      return text.length;

    }

  }


  function getConfig(name) {

    return CONFIG.collections[name] || null;

  }


  function getFirestore() {

    try {

      if (
        window.AKIAdmin &&
        typeof window.AKIAdmin.getFirestore === "function"
      ) {

        return AKIAdmin.getFirestore();

      }

    } catch {}

    return null;

  }


  function getCurrentUser() {

    try {

      if (
        window.AKIAdmin &&
        typeof window.AKIAdmin.getFirebaseAuth === "function"
      ) {

        const auth =
          AKIAdmin.getFirebaseAuth();

        return auth?.currentUser || null;

      }

    } catch {}

    return null;

  }


  function isAuthorized(config) {

    try {

      if (
        !window.AKIAdmin
      ) {

        return false;

      }


      if (
        typeof AKIAdmin.requireAuth !== "function"
      ) {

        return false;

      }


      if (
        typeof AKIAdmin.hasPermission === "function"
      ) {

        return AKIAdmin.hasPermission(
          config.permission
        );

      }


      return !!(
        AKIAdmin.getSession &&
        AKIAdmin.getSession()
      );

    } catch {

      return false;

    }

  }


  /* ========================================================
     LOCAL STORAGE
  ======================================================== */

  function readLocal(name) {

    const config =
      getConfig(name);


    if (!config) {

      throw new Error(
        "Unknown CMS dataset: " + name
      );

    }


    let raw =
      localStorage.getItem(
        config.localKey
      );


    let sourceKey =
      config.localKey;


    if (
      raw === null &&
      config.alias
    ) {

      raw =
        localStorage.getItem(
          config.alias
        );

      sourceKey =
        config.alias;

    }


    if (raw === null) {

      return {

        exists: false,

        key: null,

        value: null,

        raw: null

      };

    }


    const parsed =
      parseJSON(raw);


    if (
      parsed === null &&
      raw !== "null"
    ) {

      throw new Error(
        `Invalid JSON in ${sourceKey}`
      );

    }


    if (
      config.type === "array" &&
      !Array.isArray(parsed)
    ) {

      throw new Error(
        `${name} must contain an array.`
      );

    }


    if (
      config.type === "object" &&
      !isObject(parsed)
    ) {

      throw new Error(
        `${name} must contain an object.`
      );

    }


    return {

      exists: true,

      key: sourceKey,

      value: parsed,

      raw

    };

  }


  function writeLocal(
    name,
    value
  ) {

    const config =
      getConfig(name);


    if (!config) {
      return false;
    }


    const raw =
      serialize(value);


    state.hydrating =
      true;


    try {

      localStorage.setItem(
        config.localKey,
        raw
      );


      /*
        Keep legacy alias synchronized.
      */

      if (config.alias) {

        localStorage.setItem(
          config.alias,
          raw
        );

      }

      return true;

    } finally {

      window.setTimeout(
        function () {

          state.hydrating =
            false;

        },
        50
      );

    }

  }


  /* ========================================================
     FIRESTORE REFERENCES
  ======================================================== */

  function documentRef(name) {

    const db =
      getFirestore();

    const config =
      getConfig(name);


    if (
      !db ||
      !config
    ) {

      return null;

    }


    return db
      .collection(config.collection)
      .doc(config.document);

  }


  /* ========================================================
     FIRESTORE READ
  ======================================================== */

  async function getRemote(name) {

    const ref =
      documentRef(name);


    if (!ref) {

      throw new Error(
        "Firestore is not initialized."
      );

    }


    const snapshot =
      await ref.get();


    if (!snapshot.exists) {

      return {

        exists: false,

        data: null,

        metadata: null

      };

    }


    const remote =
      snapshot.data() || {};


    return {

      exists: true,

      data:
        remote.data ?? null,

      metadata:
        remote

    };

  }


  /* ========================================================
     FIRESTORE WRITE
  ======================================================== */

  async function push(
    name,
    options
  ) {

    options =
      options || {};


    const config =
      getConfig(name);


    if (!config) {

      throw new Error(
        "Unknown CMS dataset."
      );

    }


    if (
      !isAuthorized(config)
    ) {

      throw new Error(
        "PERMISSION_DENIED"
      );

    }


    const db =
      getFirestore();


    if (!db) {

      throw new Error(
        "FIRESTORE_NOT_READY"
      );

    }


    const local =
      readLocal(name);


    if (!local.exists) {

      throw new Error(
        "LOCAL_DATASET_NOT_FOUND"
      );

    }


    const payload =
      clone(local.value);


    const encoded =
      serialize(payload);


    const bytes =
      sizeBytes(encoded);


    if (
      bytes >
      CONFIG.maxDocumentBytes
    ) {

      throw new Error(
        `${name} is too large for the current CMS document strategy.`
      );

    }


    const user =
      getCurrentUser();


    const ref =
      documentRef(name);


    const data = {

      data:
        payload,

      dataset:
        name,

      version:
        CONFIG.version,

      source:
        "AKHI CMS",

      bytes,

      updatedBy:
        user
          ? user.uid
          : "",

      updatedAt:
        firebase.firestore.FieldValue.serverTimestamp()

    };


    await ref.set(
      data,
      {
        merge: true
      }
    );


    if (
      typeof AKIAdmin?.logActivity ===
      "function"
    ) {

      try {

        AKIAdmin.logActivity(
          "Firestore CMS sync",
          {
            dataset: name,
            bytes
          }
        );

      } catch {}

    }


    if (!options.silent) {

      log(
        `${name} uploaded to Firestore.`,
        bytes,
        "bytes"
      );

    }


    return {

      ok: true,

      dataset: name,

      bytes

    };

  }


  /* ========================================================
     FIRESTORE -> LOCAL
  ======================================================== */

  async function pull(
    name,
    options
  ) {

    options =
      options || {};


    const result =
      await getRemote(name);


    if (!result.exists) {

      return {

        ok: false,

        exists: false,

        dataset: name

      };

    }


    if (
      result.data === null ||
      result.data === undefined
    ) {

      return {

        ok: false,

        exists: true,

        empty: true,

        dataset: name

      };

    }


    const config =
      getConfig(name);


    if (
      config.type === "array" &&
      !Array.isArray(result.data)
    ) {

      throw new Error(
        "Remote dataset type mismatch."
      );

    }


    if (
      config.type === "object" &&
      !isObject(result.data)
    ) {

      throw new Error(
        "Remote dataset type mismatch."
      );

    }


    writeLocal(
      name,
      result.data
    );


    if (!options.silent) {

      log(
        `${name} downloaded from Firestore.`
      );

    }


    return {

      ok: true,

      exists: true,

      dataset: name,

      data:
        result.data,

      metadata:
        result.metadata

    };

  }


  /* ========================================================
     MIGRATION: LOCAL -> FIRESTORE
  ======================================================== */

  async function migrateLocalToFirestore(
    options
  ) {

    options =
      options || {};


    const names =
      options.datasets ||
      Object.keys(CONFIG.collections);


    const report = {

      mode:
        "local-to-firestore",

      startedAt:
        new Date().toISOString(),

      success: [],

      skipped: [],

      failed: []

    };


    for (
      const name of names
    ) {

      try {

        const local =
          readLocal(name);


        if (!local.exists) {

          report.skipped.push({

            dataset: name,

            reason:
              "No local dataset found."

          });

          continue;

        }


        const response =
          await push(
            name,
            {
              silent:true
            }
          );


        report.success.push(
          response
        );


      } catch (err) {

        report.failed.push({

          dataset:name,

          error:
            err.message ||
            String(err)

        });

      }

    }


    report.finishedAt =
      new Date().toISOString();


    log(
      "Migration complete:",
      report
    );


    return report;

  }


  /* ========================================================
     MIGRATION: FIRESTORE -> LOCAL
  ======================================================== */

  async function migrateFirestoreToLocal(
    options
  ) {

    options =
      options || {};


    const names =
      options.datasets ||
      Object.keys(CONFIG.collections);


    const report = {

      mode:
        "firestore-to-local",

      startedAt:
        new Date().toISOString(),

      success: [],

      skipped: [],

      failed: []

    };


    for (
      const name of names
    ) {

      try {

        const response =
          await pull(
            name,
            {
              silent:true
            }
          );


        if (
          !response.exists
        ) {

          report.skipped.push({

            dataset:name,

            reason:
              "Remote dataset does not exist."

          });

          continue;

        }


        report.success.push({

          dataset:name,

          ok:true

        });


      } catch (err) {

        report.failed.push({

          dataset:name,

          error:
            err.message ||
            String(err)

        });

      }

    }


    report.finishedAt =
      new Date().toISOString();


    log(
      "Reverse migration complete:",
      report
    );


    return report;

  }


  /* ========================================================
     REALTIME LISTENER
  ======================================================== */

  function listen(
    name,
    callback
  ) {

    const ref =
      documentRef(name);


    if (!ref) {

      throw new Error(
        "Firestore is not initialized."
      );

    }


    if (
      state.listeners[name]
    ) {

      try {

        state.listeners[name]();

      } catch {}

    }


    const unsubscribe =
      ref.onSnapshot(

        function (snapshot) {

          if (!snapshot.exists) {

            if (
              typeof callback ===
              "function"
            ) {

              callback({

                exists:false,

                data:null,

                dataset:name

              });

            }

            return;

          }


          const remote =
            snapshot.data() || {};


          const data =
            remote.data;


          if (
            data === undefined
          ) {

            return;

          }


          state.hydrating =
            true;


          try {

            writeLocal(
              name,
              data
            );

          } finally {

            window.setTimeout(
              function () {

                state.hydrating =
                  false;

              },
              80
            );

          }


          if (
            typeof callback ===
            "function"
          ) {

            callback({

              exists:true,

              data,

              dataset:name,

              fromCache:
                !!snapshot.metadata
                  ?.fromCache,

              pendingWrites:
                !!snapshot.metadata
                  ?.hasPendingWrites

            });

          }

        },

        function (err) {

          error(
            `Realtime listener failed for ${name}:`,
            err
          );


          if (
            typeof callback ===
            "function"
          ) {

            callback({

              exists:false,

              error:err,

              dataset:name

            });

          }

        }

      );


    state.listeners[name] =
      unsubscribe;


    return unsubscribe;

  }


  /* ========================================================
     START ALL LISTENERS
  ======================================================== */

  function startListeners(
    options
  ) {

    options =
      options || {};


    const names =
      options.datasets ||
      Object.keys(CONFIG.collections);


    names.forEach(
      function(name){

        try {

          listen(
            name,
            options.callback ||
            function(payload){

              log(
                "Realtime update:",
                payload.dataset
              );

            }
          );

        } catch (err) {

          warn(
            `Listener could not start for ${name}:`,
            err.message
          );

        }

      }
    );


    return true;

  }


  /* ========================================================
     STOP LISTENERS
  ======================================================== */

  function stopListeners(){

    Object.keys(
      state.listeners
    ).forEach(
      function(name){

        try {

          state.listeners[name]();

        } catch {}

      }
    );


    state.listeners = {};

  }


  /* ========================================================
     LOCAL STORAGE BRIDGE
  ======================================================== */

  function findDatasetByKey(
    key
  ) {

    const names =
      Object.keys(
        CONFIG.collections
      );


    for (
      const name of names
    ) {

      const config =
        CONFIG.collections[name];


      if (
        key === config.localKey ||
        key === config.alias
      ) {

        return name;

      }

    }


    return null;

  }


  function schedulePush(
    name
  ) {

    if (
      state.hydrating
    ) {

      return;

    }


    if (
      !state.enabled
    ) {

      return;

    }


    if (
      state.timers[name]
    ) {

      clearTimeout(
        state.timers[name]
      );

    }


    state.timers[name] =
      setTimeout(
        async function(){

          delete state.timers[name];


          if (
            state.hydrating
          ) {

            return;

          }


          try {

            await push(
              name,
              {
                silent:true
              }
            );

            log(
              `${name} local change synced.`
            );

          } catch (err) {

            warn(
              `${name} local sync failed:`,
              err.message
            );

          }

        },
        CONFIG.debounceMs
      );

  }


  function installStorageBridge(){

    if (
      state.bridgeInstalled
    ) {

      return;

    }


    state.originalSetItem =
      Storage.prototype.setItem;

    state.originalRemoveItem =
      Storage.prototype.removeItem;

    state.originalClear =
      Storage.prototype.clear;


    Storage.prototype.setItem =
      function(
        key,
        value
      ){

        state.originalSetItem.call(
          this,
          key,
          value
        );


        if (
          this !== localStorage
        ) {

          return;

        }


        const dataset =
          findDatasetByKey(key);


        if(dataset){

          schedulePush(
            dataset
          );

        }

      };


    Storage.prototype.removeItem =
      function(key){

        state.originalRemoveItem.call(
          this,
          key
        );


        if (
          this !== localStorage
        ) {

          return;

        }


        const dataset =
          findDatasetByKey(key);


        if(dataset){

          /*
            We intentionally do NOT delete
            Firestore content when local cache
            is removed.

            This prevents accidental destructive
            deletion from an admin UI.
          */

          log(
            `Local ${dataset} cache removed. Firestore copy preserved.`
          );

        }

      };


    Storage.prototype.clear =
      function(){

        this === localStorage
          ? state.originalClear.call(this)
          : state.originalClear.call(this);

        if (
          this === localStorage
        ) {

          log(
            "localStorage cleared. Firestore data was not deleted."
          );

        }

      };


    state.bridgeInstalled =
      true;

  }


  /* ========================================================
     INITIALIZATION
  ======================================================== */

  function initialize(){

    if(
      state.initialized
    ){

      return;

    }


    state.initialized =
      true;


    const db =
      getFirestore();


    if(!db){

      warn(
        "Firestore not ready."
      );

      state.enabled =
        false;

      return;

    }


    state.enabled =
      true;


    installStorageBridge();


    /*
      Admin side automatically listens to the
      cloud version, but only if the current
      session exists.
    */

    if (
      window.AKIAdmin &&
      typeof AKIAdmin.getSession ===
        "function" &&
      AKIAdmin.getSession()
    ){

      startListeners();

    }


    state.ready =
      true;


    log(
      "Firestore CMS bridge ready."
    );

  }


  /* ========================================================
     PUBLIC API
  ======================================================== */

  window.AKICMS = {

    version:
      CONFIG.version,

    config:
      CONFIG,

    state,

    initialize,

    readLocal,

    writeLocal,

    getRemote,

    push,

    pull,

    migrateLocalToFirestore,

    migrateFirestoreToLocal,

    listen,

    startListeners,

    stopListeners,

    getFirestore,

    isAuthorized

  };


  /*
    Wait briefly for auth.js to expose Firebase.
  */

  let attempts = 0;

  const bootstrap =
    setInterval(
      function(){

        attempts++;


        if (
          getFirestore()
        ){

          clearInterval(
            bootstrap
          );

          initialize();

          return;

        }


        if (
          attempts >= 50
        ){

          clearInterval(
            bootstrap
          );

          warn(
            "Firestore CMS bridge timed out waiting for Firebase."
          );

        }

      },
      200
    );


})();
