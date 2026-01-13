# ConnectHub - Complete Setup Instructions

Welcome! This guide will walk you through setting up your social media application from scratch. Don't worry if you're not technical - I'll explain everything step by step.

## 📋 Prerequisites

Before you begin, you'll need:
- A computer with internet connection
- A Google account (for Firebase)
- About 30-45 minutes of time

## 🚀 Part 1: Setting up Firebase (Your Backend)

Firebase will handle your database, file storage, and user authentication for free!

### Step 1: Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project" or "Create a project"
3. Enter project name: **"connecthub"** (or any name you like)
4. Click Continue
5. **Disable Google Analytics** (you don't need it for now)
6. Click "Create project"
7. Wait for the project to be created, then click "Continue"

### Step 2: Set up Firebase Authentication

1. In the Firebase Console sidebar, click **"Authentication"**
2. Click **"Get started"**
3. Click on **"Email/Password"** tab
4. Toggle **"Enable"** to ON
5. Click **"Save"**

### Step 3: Set up Cloud Firestore (Database)

1. In the Firebase Console sidebar, click **"Firestore Database"**
2. Click **"Create database"**
3. Select **"Start in production mode"** (we'll set rules next)
4. Choose a location closest to you (e.g., us-central)
5. Click **"Enable"**
6. Once created, click on the **"Rules"** tab
7. Replace the rules with this:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users collection
    match /users/{userId} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.uid == userId;
      allow create: if request.auth != null;
    }
    
    // Posts collection
    match /posts/{postId} {
      allow read: if true;
      allow create: if request.auth != null;
      allow update, delete: if request.auth != null && 
        (request.auth.uid == resource.data.userId || 
         get(/databases/$(database)/documents/users/$(request.auth.uid)).data.isAdmin == true);
    }
    
    // Messages collection
    match /messages/{messageId} {
      allow read, write: if request.auth != null && 
        request.auth.uid in resource.data.participants;
      allow create: if request.auth != null;
    }
  }
}
```

8. Click **"Publish"**

### Step 4: Set up Cloud Storage (For Images)

1. In the Firebase Console sidebar, click **"Storage"**
2. Click **"Get started"**
3. Click **"Next"** (keep default security rules for now)
4. Choose the same location as your Firestore
5. Click **"Done"**
6. Click on the **"Rules"** tab
7. Replace the rules with:

```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /profiles/{userId}/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
    
    match /posts/{userId}/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

8. Click **"Publish"**

### Step 5: Get Your Firebase Configuration

1. Click the **gear icon** (⚙️) next to "Project Overview" in the sidebar
2. Click **"Project settings"**
3. Scroll down to **"Your apps"** section
4. Click the **Web icon** (</>) to add a web app
5. Enter app nickname: **"ConnectHub Web"**
6. **UNCHECK** "Set up Firebase Hosting" (we'll do this later)
7. Click **"Register app"**
8. You'll see a code snippet with your config. It looks like:

```javascript
const firebaseConfig = {
  apiKey: "AIza...",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123"
};
```

9. **COPY THIS** - you'll need it in the next part!
10. Click **"Continue to console"**

## 💻 Part 2: Installing the Application

### Step 1: Install Node.js

1. Go to [nodejs.org](https://nodejs.org/)
2. Download the **LTS version** (left button, recommended for most users)
3. Run the installer
4. Click "Next" through all the prompts (keep default settings)
5. Click "Finish"

### Step 2: Verify Installation

1. Open Command Prompt (Windows) or Terminal (Mac/Linux)
   - **Windows**: Press `Win + R`, type `cmd`, press Enter
   - **Mac**: Press `Cmd + Space`, type `terminal`, press Enter
   
2. Type: `node --version` and press Enter
   - You should see something like `v18.17.0` or similar
   
3. Type: `npm --version` and press Enter
   - You should see something like `9.6.7` or similar

If both commands show version numbers, you're good to go! ✅

### Step 3: Extract and Configure the Application

1. Extract the **social-media-app.zip** file you received
2. Open the extracted folder
3. Find the file `src/firebase.js`
4. Open it with Notepad (Windows) or TextEdit (Mac)
5. Replace the placeholder config with YOUR Firebase config from Part 1, Step 5
   
   **Change this:**
   ```javascript
   const firebaseConfig = {
     apiKey: "YOUR_API_KEY_HERE",
     authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
     // ... rest of placeholders
   };
   ```
   
   **To your actual config:**
   ```javascript
   const firebaseConfig = {
     apiKey: "AIzaSyC...",  // Your real API key
     authDomain: "connecthub-12345.firebaseapp.com",
     projectId: "connecthub-12345",
     storageBucket: "connecthub-12345.appspot.com",
     messagingSenderId: "123456789012",
     appId: "1:123456789012:web:abc123def456"
   };
   ```

6. Save and close the file

### Step 4: Install Dependencies

1. Open Command Prompt/Terminal again
2. Navigate to your project folder:
   ```bash
   cd path/to/social-media-app
   ```
   
   **Example:**
   - Windows: `cd C:\Users\YourName\Downloads\social-media-app`
   - Mac: `cd ~/Downloads/social-media-app`

3. Install all dependencies (this might take 2-5 minutes):
   ```bash
   npm install
   ```

4. Wait for it to complete. You should see a message like "added 237 packages"

### Step 5: Run the Application Locally

1. In the same terminal, type:
   ```bash
   npm run dev
   ```

2. You should see:
   ```
   VITE v5.0.8  ready in 523 ms
   
   ➜  Local:   http://localhost:3000/
   ➜  Network: use --host to expose
   ```

3. Your browser should automatically open to `http://localhost:3000`
4. If it doesn't, manually open your browser and go to that address

🎉 **Congratulations!** Your app is now running locally!

## 🌐 Part 3: Deploying to the Internet (Optional but Recommended)

### Step 1: Install Firebase CLI

1. In a new Command Prompt/Terminal, type:
   ```bash
   npm install -g firebase-tools
   ```

2. After installation, log in to Firebase:
   ```bash
   firebase login
   ```

3. A browser window will open - sign in with your Google account
4. Allow Firebase CLI to access your account

### Step 2: Initialize Firebase Hosting

1. Navigate to your project folder (if not already there):
   ```bash
   cd path/to/social-media-app
   ```

2. Initialize Firebase:
   ```bash
   firebase init
   ```

3. You'll be asked several questions. Use arrow keys and spacebar to select:

   - **Select features:** Use spacebar to select **"Hosting"** only, then press Enter
   - **Use existing project:** Select YES
   - **Select your project:** Choose the project you created earlier
   - **Public directory:** Type `dist` and press Enter
   - **Configure as single-page app:** Type `y` and press Enter
   - **Set up automatic builds:** Type `N` and press Enter
   - **File dist/index.html already exists. Overwrite?** Type `N` and press Enter

### Step 3: Build and Deploy

1. Build your application:
   ```bash
   npm run build
   ```

2. Deploy to Firebase:
   ```bash
   firebase deploy
   ```

3. After deployment, you'll see:
   ```
   ✔  Deploy complete!
   
   Hosting URL: https://your-project-id.web.app
   ```

4. Visit that URL - your app is now live on the internet! 🌍

## 👑 Part 4: Setting Up Admin and Owner Access

### Make Yourself the Owner

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Go to **Firestore Database**
4. Find your user document (it will be under the "users" collection)
5. Click on your user document
6. Click **"Add field"**
7. Field name: `isOwner`
8. Type: `boolean`
9. Value: `true`
10. Click **"Add"**

Now you can access the Owner Dashboard at: `your-app-url/owner`

### Make Someone an Admin

Same process, but add field `isAdmin` set to `true` instead

## 🎨 Customizing Your App

### Change Colors

Edit `tailwind.config.js` - find the `colors` section and change the hex values

### Change App Name

1. Open `index.html` - change the `<title>` tag
2. Search for "ConnectHub" in all files and replace with your app name

### Change Logo

Replace the logo code in `src/components/Navbar.jsx` and other components

## 🆘 Troubleshooting

### "Firebase: Error (auth/configuration-not-found)"
- You forgot to configure Firebase Authentication. Go back to Part 1, Step 2

### "npm: command not found"
- Node.js isn't installed properly. Reinstall it from nodejs.org

### "Permission denied" errors
- On Mac/Linux, try adding `sudo` before commands
- On Windows, run Command Prompt as Administrator

### App shows blank white screen
- Check browser console (F12) for errors
- Make sure you replaced the Firebase config correctly
- Try clearing browser cache (Ctrl+Shift+Delete)

### "Firebase: Missing or insufficient permissions"
- Check that you copied the Firestore and Storage rules correctly
- Make sure they're published

## 📞 Need More Help?

- Check Firebase docs: https://firebase.google.com/docs
- Check React docs: https://react.dev
- Check Vite docs: https://vitejs.dev

## 🎯 What's Working Right Now

✅ User registration and login
✅ Password reset via email (Firebase handles this automatically!)
✅ Profile pages with customization
✅ Post creation with images
✅ Like and comment on posts
✅ Friend system
✅ Direct messaging
✅ Search users
✅ Theme customization
✅ Photo galleries
✅ Admin panel
✅ Owner dashboard
✅ Referral system tracking
✅ Data download
✅ Account deletion

## ⚠️ What Needs Additional Setup

❌ **Billing integration** - Requires Stripe/PayPal API setup
❌ **Email customization** - Firebase sends generic emails; customize in Firebase Console > Authentication > Templates
❌ **Custom domain** - Set up in Firebase Console > Hosting > Add custom domain

## 🚀 Your Next Steps

1. Create your account on your deployed site
2. Make yourself the owner (Part 4)
3. Customize colors and branding
4. Invite your first users!
5. Set up billing integration if needed (see Stripe or PayPal documentation)

Enjoy your new social media platform! 🎉
