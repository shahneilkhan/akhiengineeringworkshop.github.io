# AKHI Firebase Console Checklist

1. Create/select the Firebase project.
2. Register the GitHub Pages Web App.
3. Enable Authentication → Email/Password.
4. Create Firestore Database.
5. Create/enable Cloud Storage.
6. Create reCAPTCHA Enterprise Web key.
7. Register the production domain(s) in App Check.
8. Paste Web App config into `firebase-config.js`.
9. Paste the reCAPTCHA Enterprise site key into `firebase-config.js`.
10. Set the real project ID in `.firebaserc`.
11. Run `npm install` inside `functions/`.
12. Deploy Rules + Functions.
13. Run `node scripts/bootstrap-superadmin.cjs` once.
14. Sign in as `thesnkgraphic@email.com`.
15. Add `admin@akiworkshop.com` from Admin Management.
16. Run Migration Center to move old browser content into Firebase.
17. Enable App Check enforcement after verifying the production domain.
18. Run Final QA pages.
