#!/usr/bin/env node
const admin = require('firebase-admin');
const readline = require('node:readline/promises');
const {stdin: input, stdout: output} = require('node:process');

(async()=>{
  if(!process.env.GOOGLE_APPLICATION_CREDENTIALS){
    console.error('Set GOOGLE_APPLICATION_CREDENTIALS to your Firebase service-account JSON path first.');
    process.exit(1);
  }
  admin.initializeApp();
  const rl=readline.createInterface({input,output});
  const email=(await rl.question('Super Admin email [thesnkgraphic@email.com]: ')).trim()||'thesnkgraphic@email.com';
  const name=(await rl.question('Super Admin name [SNK Private Control]: ')).trim()||'SNK Private Control';
  const password=await rl.question('Super Admin password (hidden input is not available in this terminal): ');
  if(password.length<10){console.error('Password must be at least 10 characters.');process.exitCode=1;rl.close();return;}
  const auth=admin.auth(), db=admin.firestore();
  let user; try{user=await auth.getUserByEmail(email); user=await auth.updateUser(user.uid,{password,displayName:name,disabled:false});}catch(err){if(err.code==='auth/user-not-found')user=await auth.createUser({email,password,displayName:name,disabled:false});else throw err;}
  await auth.setCustomUserClaims(user.uid,{admin:true,role:'superadmin'});
  await db.collection('adminUsers').doc(user.uid).set({email,name,role:'superadmin',active:true,permissions:['*'],createdAt:admin.firestore.FieldValue.serverTimestamp(),updatedAt:admin.firestore.FieldValue.serverTimestamp()},{merge:true});
  console.log('Super Admin provisioned:',user.uid,email);
  rl.close();
})().catch(err=>{console.error(err);process.exit(1)});
