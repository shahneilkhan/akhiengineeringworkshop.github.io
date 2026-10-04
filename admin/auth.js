/* AKHI Engineering Workshop — Firebase Auth Core v1.0 */
(function(window, document){
  'use strict';
  const VERSION='1.0-firebase';
  const ROLE_PERMISSIONS={
    admin:['dashboard.read','homepage.read','homepage.write','banner.read','banner.write','projects.read','projects.write','media.read','media.write','settings.read','settings.write','ai.read','ai.use','activity.read'],
    superadmin:['*']
  };
  const LOGIN='loginUrl', DASH='dashboardUrl';
  let currentUser=null;
  let currentProfile=null;
  let profilePromise=null;

  function fail(msg){ throw new Error(msg); }
  function fb(){
    if(!window.AKHI_FIREBASE?.ready) fail('Firebase is not configured yet. Update /firebase-config.js first.');
    return window.AKHI_FIREBASE;
  }
  function adminBase(){
    const marker='/admin/'; const i=location.pathname.indexOf(marker); const prefix=i>=0?location.pathname.slice(0,i):''; return prefix+'/admin';
  }
  function loginUrl(){return adminBase()+'/login/'}
  function dashboardUrl(){return adminBase()+'/dashboard.html'}
  function securityUrl(){return adminBase()+'/security.html'}

  async function loadProfile(user){
    if(!user) { currentProfile=null; return null; }
    const f=fb();
    const snap=await f.db.collection('adminUsers').doc(user.uid).get();
    if(!snap.exists) { currentProfile=null; return null; }
    const data=snap.data()||{};
    currentProfile={uid:user.uid,email:user.email||data.email||'',name:data.name||user.displayName||'Workshop Admin',role:String(data.role||'admin').toLowerCase(),active:data.active!==false,permissions:Array.isArray(data.permissions)?data.permissions:ROLE_PERMISSIONS[data.role]||[],createdAt:data.createdAt||null,updatedAt:data.updatedAt||null};
    if(currentProfile.active===false) {
      try{await f.auth.signOut()}catch(_){ }
      currentProfile=null;
      fail('This administrator account is disabled.');
    }
    return currentProfile;
  }

  const ready=new Promise((resolve)=>{
    if(!window.AKHI_FIREBASE?.ready){resolve(null);return;}
    window.AKHI_FIREBASE.auth.onAuthStateChanged(async user=>{
      currentUser=user||null;
      try{await loadProfile(user)}catch(err){console.error('[AKHI] role/profile load:',err);currentProfile=null;}
      resolve(currentUser||null);
    });
  });

  async function getProfile(){ await ready; return currentProfile; }
  async function authenticate(email,password,remember){
    const f=fb();
    const persistence=remember?firebase.auth.Auth.Persistence.LOCAL:firebase.auth.Auth.Persistence.SESSION;
    await f.auth.setPersistence(persistence);
    const cred=await f.auth.signInWithEmailAndPassword(String(email).trim().toLowerCase(),String(password));
    const profile=await loadProfile(cred.user);
    if(!profile){await f.auth.signOut();fail('Your account is not provisioned for AKHI Admin.');}
    await logActivity('login',{mode:remember?'local':'session'});
    return profile;
  }
  async function logout(redirect=true){
    try{await logActivity('logout')}catch(_){ }
    if(window.AKHI_FIREBASE?.auth) await window.AKHI_FIREBASE.auth.signOut();
    currentUser=null;currentProfile=null;
    if(redirect) location.href=loginUrl();
  }
  async function requireAuth(){
    await ready;
    if(!window.AKHI_FIREBASE?.ready){location.href=loginUrl();return false;}
    if(!currentUser){location.href=loginUrl();return false;}
    if(!currentProfile){location.href=loginUrl();return false;}
    if(currentProfile.active===false){await logout(false);location.href=loginUrl();return false;}
    return true;
  }
  async function requireSuperAdmin(){if(!(await requireAuth()))return false;if(currentProfile.role==='superadmin')return true;location.href=dashboardUrl();return false;}
  async function requirePermission(permission){if(!(await requireAuth()))return false;if(hasPermission(permission))return true;location.href=dashboardUrl();return false;}
  function getSession(){if(!currentUser||!currentProfile)return null;return {uid:currentUser.uid,email:currentProfile.email,name:currentProfile.name,role:currentProfile.role,permissions:currentProfile.permissions,loggedIn:true};}
  function isSuperAdmin(){return !!currentProfile&&currentProfile.role==='superadmin';}
  function hasPermission(permission){const list=ROLE_PERMISSIONS[currentProfile?.role]||currentProfile?.permissions||[];return list.includes('*')||list.includes(permission);}
  async function logActivity(action,meta){
    if(!window.AKHI_FIREBASE?.ready || !currentUser || !currentProfile)return;
    try{await window.AKHI_FIREBASE.db.collection('activityLogs').add({action,uid:currentUser.uid,email:currentUser.email||'',role:currentProfile.role,meta:meta||{},at:firebase.firestore.FieldValue.serverTimestamp()});}catch(err){console.warn('[AKHI] activity log failed',err)}
  }
  function isPasskeySupported(){return !!(window.PublicKeyCredential&&navigator.credentials&&navigator.credentials.create)}
  async function sendPasswordReset(email){const f=fb();return f.auth.sendPasswordResetEmail(String(email).trim().toLowerCase())}
  async function getAdminUsers(){if(!(await requireSuperAdmin()))return[];const snap=await fb().db.collection('adminUsers').orderBy('createdAt','desc').get();return snap.docs.map(d=>({id:d.id,uid:d.id,...d.data()}));}
  async function call(name,data){if(!(await requireSuperAdmin()))fail('Super Admin required.');return fb().functions.httpsCallable(name)(data||{});}

  window.AKIAdmin={VERSION,ROLE_PERMISSIONS,ready,loginUrl,dashboardUrl,securityUrl,authenticate,logout,requireAuth,requireSuperAdmin,requirePermission,getSession,getProfile,isSuperAdmin,hasPermission,logActivity,isPasskeySupported,sendPasswordReset,getAdminUsers,call};
  document.addEventListener('DOMContentLoaded',()=>document.querySelectorAll('[data-admin-logout]').forEach(b=>b.addEventListener('click',()=>logout(true))));
})(window,document);
