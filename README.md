# AKHI Admin (ছোট ভার্সন)
ফাইল: admin/index.html (login + সব পেজ), firebase-config.js, firestore.rules

## Setup (৫ ধাপ)
1. Firebase Console > Authentication > Email/Password চালু করুন, তারপর নিজের admin user বানান।
2. Firestore Database বানান। Rules ট্যাবে firestore.rules এর লেখা paste করে Publish করুন।
3. Firestore এ collection `adminUsers` > document ID = ওই user এর UID (Authentication ট্যাব থেকে কপি) > যেকোনো একটা field (যেমন role: admin)।
4. firebase-config.js এ Web app এর config বসান।
5. সব ফাইল GitHub Pages এ আপলোড করুন, /admin/ খুলুন।

## Public site এর জন্য Firestore ডেটা
siteContent/home (heroTitle, heroDescription), siteContent/settings, collection: banners, projects, media (published=true ফিল্টার করুন)।
