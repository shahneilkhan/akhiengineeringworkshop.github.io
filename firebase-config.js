/* AKHI Engineering Workshop — Firebase client configuration
 * Replace every YOUR_* placeholder with the values from Firebase Console.
 * Never place a Firebase service-account JSON file in this repository.
 */
window.AKHI_FIREBASE_CONFIG = {
  apiKey: 'YOUR_FIREBASE_API_KEY',
  authDomain: 'YOUR_PROJECT_ID.firebaseapp.com',
  projectId: 'YOUR_PROJECT_ID',
  storageBucket: 'YOUR_PROJECT_ID.firebasestorage.app',
  messagingSenderId: 'YOUR_MESSAGING_SENDER_ID',
  appId: 'YOUR_FIREBASE_APP_ID',
  measurementId: 'YOUR_MEASUREMENT_ID'
};

/* App Check uses reCAPTCHA Enterprise for the production web app.
 * Leave empty until the site key is created and registered in Firebase Console.
 */
window.AKHI_APP_CHECK_SITE_KEY = 'YOUR_RECAPTCHA_ENTERPRISE_SITE_KEY';
