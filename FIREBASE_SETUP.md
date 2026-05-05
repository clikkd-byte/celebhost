# CelebHost — Firebase Setup Guide
## Connect Your App to a FREE Database in 15 Minutes

---

## STEP 1 — Create Firebase Project (Free)

1. Go to: https://console.firebase.google.com
2. Click "Add Project" → Name it "CelebHost"
3. Disable Google Analytics (optional) → Click "Create Project"

---

## STEP 2 — Enable Authentication

1. In Firebase Console → Click "Authentication" → "Get Started"
2. Click "Email/Password" → Enable it → Save
3. This lets models register & login with email + password

---

## STEP 3 — Enable Firestore Database

1. Click "Firestore Database" → "Create database"
2. Choose "Start in test mode" (for development)
3. Select your region (asia-south1 for India) → Done

---

## STEP 4 — Get Your Firebase Config

1. Click the gear icon ⚙️ → "Project Settings"
2. Scroll to "Your apps" → Click "</>" (Web app)
3. Register app name: "CelebHost Web"
4. Copy the config object — it looks like this:

```javascript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "celebhost.firebaseapp.com",
  projectId: "celebhost",
  storageBucket: "celebhost.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef"
};
```

---

## STEP 5 — Add Firebase to index.html

Add these lines just before `</body>` in index.html:

```html
<!-- Firebase SDK -->
<script src="https://www.gstatic.com/firebasejs/9.x.x/firebase-app-compat.js"></script>
<script src="https://www.gstatic.com/firebasejs/9.x.x/firebase-auth-compat.js"></script>
<script src="https://www.gstatic.com/firebasejs/9.x.x/firebase-firestore-compat.js"></script>
<script src="https://www.gstatic.com/firebasejs/9.x.x/firebase-storage-compat.js"></script>

<script>
  const firebaseConfig = {
    // PASTE YOUR CONFIG HERE
  };
  firebase.initializeApp(firebaseConfig);
</script>
<script src="app.js"></script>
```

---

## STEP 6 — Enable Real Login in app.js

In app.js, find the `loginModel()` function and:
1. COMMENT OUT the "DEMO login" line
2. UNCOMMENT the firebase.auth() block

Do the same in `submitForm()` — uncomment the Firestore save block.

---

## STEP 7 — Deploy for FREE on Vercel

1. Go to: https://vercel.com → Sign up free with GitHub
2. Upload your celebhost folder
3. Click Deploy → Your app goes LIVE in 60 seconds
4. You get a free URL like: https://celebhost.vercel.app

---

## FREE TIER LIMITS (More than enough to start)

| Service         | Free Limit                    |
|----------------|-------------------------------|
| Firebase Auth   | 10,000 users/month            |
| Firestore       | 50,000 reads + 20,000 writes/day |
| Storage         | 5 GB                          |
| Vercel Hosting  | Unlimited                     |

---

## WhatsApp Business Number

Replace all instances of `919876543210` in index.html and app.js with your actual WhatsApp number:
- Format: Country code + number (no + or spaces)
- India example: 919876543210 (91 = India code, then your 10-digit number)

---

## Need Help?

Contact us on WhatsApp: https://wa.me/919876543210
