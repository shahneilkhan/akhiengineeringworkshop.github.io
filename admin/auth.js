/* AKHI Admin core: Firebase init + login + guards */
(function(){'use strict';
firebase.initializeApp(AKI_FIREBASE_CONFIG);
const auth=firebase.auth(),db=firebase.firestore(),base=window.ADMIN_BASE||'./';let prof=null;
const ts=()=>firebase.firestore.FieldValue.serverTimestamp();
async function load(u){prof=null;if(!u)return null;try{const s=await db.collection('adminUsers').doc(u.uid).get();
 if(s.exists&&s.data().active!==false)prof={uid:u.uid,email:u.email,name:s.data().name||u.email,role:s.data().role||'admin'}}catch(e){}return prof}
const ready=new Promise(r=>{const un=auth.onAuthStateChanged(async u=>{await load(u);un();r(prof)})});
const go=p=>{location.href=base+p};
async function requireAuth(){await ready;if(!prof){go('login/');return false}return true}
async function requireSuper(){if(!(await requireAuth()))return false;if(prof.role==='superadmin')return true;go('dashboard.html');return false}
async function login(e,p,remember){await auth.setPersistence(remember?firebase.auth.Auth.Persistence.LOCAL:firebase.auth.Auth.Persistence.SESSION);
 const c=await auth.signInWithEmailAndPassword(e.trim().toLowerCase(),p);if(!(await load(c.user))){await auth.signOut();throw new Error('This account is not an active admin.')}await log('login');return prof}
async function log(a){try{if(auth.currentUser)await db.collection('activityLogs').add({a,email:auth.currentUser.email,at:ts()})}catch(e){}}
async function logout(){await log('logout');await auth.signOut();go('login/')}
window.AKIAdmin={auth,db,ts,ready,login,logout,log,requireAuth,requireSuper,profile:()=>prof,base};
})();
