# Firebase configuration required

This release contains the production Firebase architecture, but no Firebase project credentials were invented.

Before the login can be used:

1. Create/select the Firebase project.
2. Create a Web App.
3. Copy the Web App config into `firebase-config.js`.
4. Create a reCAPTCHA Enterprise site key and set `AKHI_APP_CHECK_SITE_KEY`.
5. Deploy Firestore rules, Storage rules and Cloud Functions.
6. Run `scripts/bootstrap-superadmin.cjs` once to provision `thesnkgraphic@email.com`.

Until those steps are completed, the login intentionally refuses access instead of falling back to the old browser-only password system.
