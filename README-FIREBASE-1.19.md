# AKHI Engineering Workshop — Firebase 1.19 Final Backend

This release replaces the browser-only authentication/content layer with Firebase Authentication, Firestore, Cloud Storage and callable Cloud Functions.

## Important
The repository is production-ready in architecture, but a real Firebase project configuration is intentionally **not invented**. Before deployment, fill `firebase-config.js` with the exact Web App configuration from Firebase Console.

Never commit a Firebase service-account JSON file.

## Firebase services
- Authentication: Email/Password
- Firestore: public content + admin profiles + activity log
- Storage: public media and private admin files
- Cloud Functions 2nd gen: secure administrator provisioning/update/delete
- App Check: reCAPTCHA Enterprise ready
- Security Rules: role-aware server enforcement

Firebase recommends Email/Password authentication for email/password sign-in, and custom claims/server-side authorization for role control. This build uses Firebase Authentication plus Firestore role documents and server-side callable functions so the browser never receives another administrator's password. citeturn181341search5turn360738search3

## 1. Create Firebase project
Create/select the Firebase project, then create a Web App and copy its configuration into `firebase-config.js`.

Enable:
1. Authentication → Sign-in method → Email/Password
2. Firestore Database
3. Storage
4. App Check → reCAPTCHA Enterprise
5. Cloud Functions

Firebase's current JavaScript SDK release is 12.19.0 (September 9, 2026); this package uses that CDN release. citeturn360738search2

## 2. App Check
Create a score-based reCAPTCHA Enterprise web key and register the production domain(s) in Firebase App Check. Put the site key into `firebase-config.js` as `AKHI_APP_CHECK_SITE_KEY`.

Firebase's current web guidance recommends reCAPTCHA Enterprise for new integrations and requires auto-refresh if continuous tokens are desired. citeturn181341search2turn181341search9

## 3. Deploy rules + functions
Install the current Firebase CLI and log in:

```bash
npm install -g firebase-tools
firebase login
firebase use --add
```

Set the real Firebase project as the default project in `.firebaserc`, then:

```bash
cd functions
npm install
cd ..
firebase deploy --only firestore:rules,storage,functions
```

Cloud Functions 2nd gen is the recommended option for new functions, and Node.js 22 is currently supported. citeturn654698search7turn654698search0

## 4. Bootstrap Super Admin
Create a Firebase service account with appropriate deployment/admin credentials, set `GOOGLE_APPLICATION_CREDENTIALS`, then run:

```bash
node scripts/bootstrap-superadmin.cjs
```

The script prompts for the Super Admin password and never stores it in the repository.

Default email prompt is:

`thesnkgraphic@email.com`

## 5. Admin Management
After the Super Admin signs in, `/admin/admins.html` can securely:
- Create Admin accounts
- Create additional Super Admin accounts
- Disable/enable accounts
- Change profile information
- Set a new password through the server-side function
- Send Firebase password-reset emails
- Delete normal Admin accounts

Firebase's Admin SDK supports privileged user creation/update/deletion, while callable Functions automatically include and validate Firebase Auth and App Check tokens when available. citeturn360738search0turn654698search1

## 6. Storage
Media uploads belong under `public/`. Admin-private files belong under `admin-private/`.

Storage rules validate file size and content type. Firebase Storage rules are designed to enforce path-based authorization and metadata validation. citeturn181341search4turn181341search7

Note: Cloud Storage for Firebase currently requires the Blaze plan. citeturn181341search11

## 7. Final security checklist
Before going live:
- Add only the real production domain(s) to Auth authorized domains and App Check.
- Enable App Check enforcement for the required Firebase services.
- Deploy Firestore and Storage rules from this repository.
- Bootstrap the Super Admin.
- Verify Admin cannot open Admin Management or Security Center.
- Verify disabled users are rejected.
- Verify public users can only read published content.
- Verify media uploads are limited to allowed types and size.
- Run `/admin/qa.html`, `/admin/site-qa.html`, and `/admin/responsive.html`.

Firebase notes that Storage defaults are authentication-protected and recommends robust production rules. citeturn181341search8turn181341search4

## GitHub Pages
The public site remains compatible with GitHub Pages. Firebase provides the backend services; GitHub Pages continues serving the static frontend.
