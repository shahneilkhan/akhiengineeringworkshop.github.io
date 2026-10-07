# Akhi Engineering Workshop: Website + Admin

## Files
- index.html : public website (reads everything from Firebase)
- logo.png, firebase-config.js, firestore.rules
- admin/ : login/index.html, dashboard, homepage, banners, projects (Products), website, media, settings, activity, backup, admins, security, site-qa, admin.css, auth.js, pages.js

## Upload
Upload everything to the GitHub repo (keep the same folder structure). Keep the CNAME file GitHub created.

## Admin login
https://akhiengineeringworkshop.com/admin/login/
First superadmin: Firestore > adminUsers > document ID = Firebase Auth UID, fields: role=superadmin, active=true (boolean), name.
Extra admins: Admin panel > Admins > Create admin (email + password, min 10 characters).

## What the client can do from admin
- Settings: business name, logo upload, phone, WhatsApp, email, address, footer
- Homepage: hero title and text
- Banners: slider images (upload) with title and text
- Products: name, category, regular price, offer price (sale items show first), Hot/New badge, details, image (upload), Published on/off. Clicking a product on the site opens a detail window.
- Homepage: About text and Services list appear on the site when filled.
- Settings also has opening hours and a Google Maps link (shown in the footer).
- Websites, Media, Activity log, Backup (export/import)

## Notes
- Images uploaded in admin are compressed and stored in Firestore (no Storage needed).
- Sample products and sample banners disappear automatically once real ones are published.
- Firebase Console: Authentication > Settings > Authorized domains must include akhiengineeringworkshop.com and www.akhiengineeringworkshop.com
