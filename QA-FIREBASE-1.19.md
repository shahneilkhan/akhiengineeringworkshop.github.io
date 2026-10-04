# AKHI Engineering Workshop — Firebase 1.19 QA

Date: 2026-10-05

## Static checks
- JavaScript syntax: PASS
- Cloud Functions syntax: PASS
- Bootstrap script syntax: PASS
- Duplicate HTML documents: PASS / none found
- Legacy browser-only credential source: PASS / not present
- Plaintext AKHI passwords in source: PASS / not present
- Public HTML fallback: PRESENT
- Firebase Web SDK pinned: 12.19.0
- Cloud Functions runtime: Node.js 22
- firebase-admin: 14.5.0
- firebase-functions: 7.4.0

## Production checks still require the real Firebase project
These cannot be honestly marked PASS until the actual project is connected:
- Firebase Authentication Email/Password enabled
- Firestore database created
- Storage bucket created
- App Check reCAPTCHA Enterprise key registered
- App Check enforcement enabled
- Cloud Functions deployed
- Super Admin provisioned
- Firestore Rules deployed
- Storage Rules deployed
- GitHub Pages production domain authorized
- End-to-end login → role → dashboard test
- Admin creation/update/disable/delete test
- Media upload/delete test

## Security architecture
- Passwords are owned by Firebase Authentication; Firestore never stores administrator passwords.
- Admin/Super Admin roles are stored in `adminUsers` and enforced in Firestore Rules.
- Administrator provisioning, update and deletion are performed by protected 2nd-gen callable Cloud Functions.
- Callable Functions enforce App Check.
- Storage rules validate authentication, role, file size and image content type.
- Passkey capability detection is present; no fake biometric flow is presented as real authentication.

## Known deployment prerequisite
`firebase-config.js` contains placeholders by design. The application refuses to fall back to the old localStorage password system when Firebase is not configured.
