const {onCall, HttpsError} = require('firebase-functions/v2/https');
const {setGlobalOptions} = require('firebase-functions/v2/options');
const {initializeApp} = require('firebase-admin/app');
const {getAuth} = require('firebase-admin/auth');
const {getFirestore, FieldValue} = require('firebase-admin/firestore');

initializeApp();
setGlobalOptions({region:'asia-south1',maxInstances:10});

async function requireSuperAdmin(request){
  if(!request.auth?.uid) throw new HttpsError('unauthenticated','Authentication required.');
  const snap=await getFirestore().collection('adminUsers').doc(request.auth.uid).get();
  if(!snap.exists || snap.data()?.active===false || snap.data()?.role!=='superadmin') throw new HttpsError('permission-denied','Super Admin access required.');
  return snap.data();
}
function cleanEmail(v){return String(v||'').trim().toLowerCase()}
function validatePassword(v){return typeof v==='string' && v.length>=10}
async function writeProfile(uid,data,merge=true){const db=getFirestore();await db.collection('adminUsers').doc(uid).set({...data,updatedAt:FieldValue.serverTimestamp()}, {merge});}
async function syncClaim(uid,role){await getAuth().setCustomUserClaims(uid,{admin:true,role});}
async function audit(request,action,meta){if(!request.auth?.uid)return;await getFirestore().collection('activityLogs').add({action,uid:request.auth.uid,email:request.auth.token.email||'',role:request.auth.token.role||'unknown',meta:meta||{},at:FieldValue.serverTimestamp()});}

exports.createAdmin=onCall({enforceAppCheck:true},async request=>{
  await requireSuperAdmin(request); const d=request.data||{}; const email=cleanEmail(d.email), name=String(d.name||'').trim(), role=d.role==='superadmin'?'superadmin':'admin', active=d.active!==false, password=d.password;
  if(!email||!name) throw new HttpsError('invalid-argument','Name and email are required.');
  if(!validatePassword(password)) throw new HttpsError('invalid-argument','Password must be at least 10 characters.');
  let user; try{user=await getAuth().createUser({email,password,displayName:name,disabled:!active});}catch(err){throw new HttpsError('already-exists',err.message)}
  await writeProfile(user.uid,{email,name,role,active,permissions:role==='superadmin'?['*']:[]});
  await syncClaim(user.uid,role); await audit(request,'server.admin.created',{uid:user.uid,email,role});
  return {uid:user.uid,email,name,role,active};
});

exports.updateAdmin=onCall({enforceAppCheck:true},async request=>{
  await requireSuperAdmin(request); const d=request.data||{}; if(!d.uid) throw new HttpsError('invalid-argument','uid is required.');
  const auth=getAuth(), db=getFirestore(), uid=String(d.uid); const target=await auth.getUser(uid); const profileSnap=await db.collection('adminUsers').doc(uid).get(); const prev=profileSnap.data()||{};
  const role=d.role==='superadmin'?'superadmin':'admin', active=d.active!==false, name=String(d.name||target.displayName||'Workshop Admin').trim(), email=cleanEmail(d.email||target.email);
  if(prev.role==='superadmin' && uid!==request.auth.uid && role!=='superadmin') throw new HttpsError('permission-denied','Cannot demote another Super Admin.');
  if(uid===request.auth.uid && role!=='superadmin') throw new HttpsError('failed-precondition','You cannot demote your own Super Admin account.');
  const patch={displayName:name,disabled:!active,email}; if(d.password){if(!validatePassword(d.password))throw new HttpsError('invalid-argument','Password must be at least 10 characters.');patch.password=d.password;}
  try{await auth.updateUser(uid,patch)}catch(err){throw new HttpsError('failed-precondition',err.message)}
  await writeProfile(uid,{email,name,role,active,permissions:role==='superadmin'?['*']:[]}); await syncClaim(uid,role); await audit(request,'server.admin.updated',{uid,email,role,active});
  return {uid,email,name,role,active};
});

exports.deleteAdmin=onCall({enforceAppCheck:true},async request=>{
  await requireSuperAdmin(request); const uid=String(request.data?.uid||''); if(!uid)throw new HttpsError('invalid-argument','uid is required.'); if(uid===request.auth.uid)throw new HttpsError('failed-precondition','You cannot delete your own account.');
  const db=getFirestore(), snap=await db.collection('adminUsers').doc(uid).get(); if(!snap.exists)throw new HttpsError('not-found','Administrator profile not found.'); const data=snap.data(); if(data.role==='superadmin')throw new HttpsError('failed-precondition','Super Admin accounts cannot be deleted from this panel.');
  try{await getAuth().deleteUser(uid)}catch(err){if(err.code!=='auth/user-not-found')throw new HttpsError('internal',err.message)} await db.collection('adminUsers').doc(uid).delete(); await audit(request,'server.admin.deleted',{uid,email:data.email||''}); return {uid};
});
