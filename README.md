# AKHI Admin (ছোট ভার্সন)
ফাইল: admin/index.html (login + Dashboard, Homepage, Banners, Projects, Media, Settings, Activity, Backup, Admins), firebase-config.js, firestore.rules

## Setup (৫ ধাপ)
1. Firebase Console > Authentication > Email/Password চালু করুন, তারপর নিজের admin user বানান।
2. Firestore Database বানান। Rules ট্যাবে firestore.rules এর লেখা paste করে Publish করুন।
3. Firestore এ collection `adminUsers` > document ID = ওই user এর UID (Authentication ট্যাব থেকে কপি) > fields: role = superadmin, active = true (boolean), name = আপনার নাম। প্রথম superadmin এভাবেই হাতে বানাতে হবে। পরে নতুন admin বানাতে হলে আগে Authentication এ user বানান, তারপর Admins ট্যাবে তার UID দিন।
4. firebase-config.js এ Web app এর config বসান।
5. সব ফাইল GitHub Pages এ আপলোড করুন, /admin/ খুলুন।

## Public site এর জন্য Firestore ডেটা
siteContent/home (heroTitle, heroDescription), siteContent/settings, collection: banners, projects, media (published=true ফিল্টার করুন)।
