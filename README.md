# AKHI Engineering Workshop — Firebase 1.19

Production-backend release of the AKHI Engineering Workshop website/admin system.

### Public
- `index.html`
- `style.css`
- `script.js`
- `assets/developer-credit.js`

### Firebase client
- `firebase-config.js` — fill with the real Firebase Web App config
- `firebase-init.js` — Firebase bootstrap + App Check

### Admin
- `/admin/login/` — Firebase Authentication login
- `/admin/dashboard.html` — production dashboard
- `/admin/admins.html` — Super Admin account management
- `/admin/security.html` — security status
- `/admin/backup.html` — content backup/recovery
- `/admin/qa.html` — production QA
- `/admin/site-qa.html` — public website QA
- `/admin/responsive.html` — responsive lab

### Backend
- `functions/index.js` — secure admin management callable functions
- `firestore.rules`
- `storage.rules`
- `firebase.json`
- `.firebaserc`
- `scripts/bootstrap-superadmin.cjs`

See `README-FIREBASE-1.19.md` for complete setup and deployment steps.
