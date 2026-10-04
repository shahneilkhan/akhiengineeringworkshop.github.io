# AKHI Engineering Workshop — Pre-Firebase Source Consolidation QA

Version: 1.18-C
Phase: Source Consolidation / Pre-Firebase

## Verified
- Public root has `index.html`, `style.css`, `script.js`.
- `/admin/` redirects to `/admin/login/`.
- Login loads `admin/auth.js` and uses generic email/password fields.
- No visible role selector exists on the login screen.
- Dashboard loads `auth.js` and guards the route.
- Admin Management is Super Admin-only.
- Custom administrator accounts use `passwordHash`; passwords are never displayed.
- Built-in accounts are protected from editing/deletion in Admin Management.
- Super Admin can create Admin or Super Admin custom accounts.
- Public homepage includes HTML fallback content so a CMS/storage failure does not blank the page.
- Public hero supports CMS text via `data-cms` selectors while keeping visible fallback text.
- Developer credit link is present on the public page.
- Firebase is intentionally absent from this phase.

## Built-in accounts
- Admin: `admin@akiworkshop.com`
- Super Admin: `thesnkgraphic@email.com`

Credentials are not written to this report.

## Final backend phase
Firebase Authentication, Firestore, Storage, Security Rules, App Check, passkey/WebAuthn enrollment and production security audit remain intentionally deferred.
