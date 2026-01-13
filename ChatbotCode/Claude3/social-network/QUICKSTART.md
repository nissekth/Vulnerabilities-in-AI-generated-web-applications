# 🚀 Quick Start Guide

Get your social network running in 30 minutes!

## Prerequisites
- Node.js installed (from nodejs.org)
- Google account for Firebase

## Step 1: Firebase Setup (10 minutes)

1. Go to https://console.firebase.google.com/
2. Create project: "social-network"
3. Enable:
   - **Authentication** (Email/Password)
   - **Firestore Database** (production mode)
   - **Cloud Storage**
4. Get your config from Project Settings → Web app

## Step 2: Configure App (2 minutes)

1. Open `src/firebase.js`
2. Replace YOUR_* values with your Firebase config:
```javascript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",           // Replace these
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "YOUR_ID",
  appId: "YOUR_APP_ID"
};
```

## Step 3: Install (5 minutes)

```bash
npm install
npm install -g firebase-tools
firebase login
firebase init
```

When asked:
- Features: Firestore, Storage, Hosting
- Public directory: `dist`
- Single-page app: `y`

## Step 4: Deploy Rules (1 minute)

```bash
firebase deploy --only firestore:rules,storage:rules
```

## Step 5: Create Owner Account (5 minutes)

In Firebase Console → Firestore:

1. Create collection: `users`
2. Add document with your UID from Authentication:
   - email: your-email@example.com
   - displayName: Your Name
   - role: `owner` ⬅️ IMPORTANT!
   - createdAt: 2024-01-01T00:00:00.000Z
   - theme: default
   - (other fields empty)

3. Go to Authentication → Add User
   - Use same email
   - Create password
   - Copy the UID
   - Update Firestore document ID to match this UID

## Step 6: Run! (1 minute)

```bash
npm run dev
```

Opens at http://localhost:3000

## Step 7: Test

1. Register a new account
2. Log in with your owner account
3. Create a post
4. Add a friend
5. Send a message

## Deploy to Production

```bash
npm run build
firebase deploy
```

Live at: https://your-project.web.app

## ⚠️ Important Notes

- **Keep owner credentials safe!**
- Test with multiple accounts
- Check Firebase Console for errors
- Free tier supports 50+ users easily

## Need Help?

- Check README.md for detailed instructions
- Firebase Console has logs
- Browser console (F12) shows errors

## Features Available

✅ User authentication
✅ Posts (280 chars, images, likes, comments)
✅ Profiles (customizable, galleries)
✅ Friends system
✅ Direct messages
✅ Admin panel
✅ Owner dashboard
✅ 5 themes
✅ Referral system
✅ And more!

Happy networking! 🎉
