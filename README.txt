AKHI ENGINEERING WORKSHOP - Cart + Checkout update
===================================================
FILES
 index.html               -> replace the old one
 checkout.js              -> NEW (cart + checkout)
 admin/index.html         -> redirect to ./login/ (same as before)
 firestore.rules          -> paste in Firebase Console > Firestore > Rules > Publish
 firebase-config.sample.js-> reference only. KEEP your real firebase-config.js

FIX INCLUDED
 index.html now accepts both AKHI_FIREBASE_CONFIG and AKI_FIREBASE_CONFIG,
 so the site loads real Firebase data instead of demo products.

SETTINGS (Firestore: siteContent/settings) - add these fields as text
 bkash            01XXXXXXXXX   (shows bKash option)
 nagad            01XXXXXXXXX   (shows Nagad option)
 rocket           01XXXXXXXXX   (optional)
 codEnabled       false         (only if Cash on Delivery should be hidden)
 deliveryFee      120           (number only)
 freeDeliveryAbove 20000        (optional)
 whatsapp         01XXXXXXXXX   (already used)

ORDERS
 Saved in Firestore collection "orders" (status: pending). For bKash/Nagad/Rocket
 the customer's TrxID and sender number are saved; check the number in your
 merchant app, then change paymentStatus to "paid".
 After an order, customer gets a "Confirm on WhatsApp" button with full details.

NOTE: this is manual-verification payment (TrxID). Automatic card/bKash gateway
 (SSLCommerz, bKash API) needs merchant credentials and a server - can be added later.
