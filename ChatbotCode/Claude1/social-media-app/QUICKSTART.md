# 🚀 Quick Start Guide

## For Complete Beginners - 5 Minute Setup

### 1. Install Node.js (One-Time Setup)
- Go to https://nodejs.org
- Download and install the LTS version
- Restart your computer

### 2. Set Up Firebase (One-Time Setup)
- Go to https://console.firebase.google.com
- Create a new project
- Enable Authentication (Email/Password)
- Enable Firestore Database
- Enable Storage
- Get your Firebase config (see SETUP_INSTRUCTIONS.md for details)

### 3. Configure Your App
- Open `src/firebase.js` in any text editor
- Replace the placeholder config with YOUR Firebase config
- Save the file

### 4. Install and Run
Open terminal/command prompt in this folder and run:

```bash
npm install
npm run dev
```

That's it! Your app will open in your browser at http://localhost:3000

## First Time Using the App

1. Click "Get Started" or "Register"
2. Create your account
3. Start posting and connecting!

## Making Yourself Owner

After creating your account:
1. Go to Firebase Console > Firestore Database
2. Find your user document
3. Add field: `isOwner` = `true`
4. Now visit: http://localhost:3000/owner

## Deploy to Internet

```bash
npm install -g firebase-tools
firebase login
firebase init
npm run build
firebase deploy
```

Your app is now live! 🎉

## Need Help?

Read `SETUP_INSTRUCTIONS.md` for detailed step-by-step instructions.

## Features You Can Use Right Away

✅ Create account and login
✅ Create posts with images
✅ Like and comment
✅ Add friends
✅ Send messages
✅ Customize your profile
✅ Search for users
✅ Change themes
✅ Upload photos
✅ And much more!

Enjoy ConnectHub! 🌟
