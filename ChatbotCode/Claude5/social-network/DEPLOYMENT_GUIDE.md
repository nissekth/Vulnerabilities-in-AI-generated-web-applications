# Complete Firebase Setup and Deployment Guide

This guide will walk you through setting up your social network web application from scratch, even with no programming experience.

## Part 1: Create a Firebase Project

### Step 1: Create a Google Account (if you don't have one)
1. Go to https://accounts.google.com/signup
2. Follow the steps to create a Google account
3. Verify your email address

### Step 2: Create a Firebase Project
1. Go to https://console.firebase.google.com/
2. Click "Add project" or "Create a project"
3. Enter a project name (e.g., "my-social-network")
4. Click "Continue"
5. Disable Google Analytics (not needed for now) or leave it enabled
6. Click "Create project"
7. Wait for the project to be created (takes about 30 seconds)
8. Click "Continue"

## Part 2: Set Up Firebase Authentication

### Step 3: Enable Authentication
1. In your Firebase console, click "Authentication" in the left sidebar
2. Click "Get started"
3. Click on the "Sign-in method" tab
4. Click on "Email/Password"
5. Toggle the first switch to "Enabled"
6. Click "Save"

### Step 4: Create Your Owner Account
1. Still in Authentication, click on the "Users" tab
2. Click "Add user"
3. Enter YOUR email address (this will be your owner account)
4. Enter a strong password
5. Click "Add user"
6. **IMPORTANT:** Copy the User UID that appears - you'll need this!

## Part 3: Set Up Firestore Database

### Step 5: Create Firestore Database
1. Click "Firestore Database" in the left sidebar
2. Click "Create database"
3. Select "Start in production mode" (we'll set up rules next)
4. Click "Next"
5. Choose a location closest to you (or leave default)
6. Click "Enable"
7. Wait for the database to be created

### Step 6: Set Up Firestore Security Rules
1. Click on the "Rules" tab in Firestore
2. Replace ALL the text with the following rules:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users collection
    match /users/{userId} {
      allow read: if true; // Anyone can read user profiles
      allow create: if request.auth != null; // Authenticated users can create their profile
      allow update, delete: if request.auth != null && 
        (request.auth.uid == userId || 
         get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role in ['admin', 'owner']);
    }
    
    // Posts collection
    match /posts/{postId} {
      allow read: if true; // Anyone can read posts
      allow create: if request.auth != null; // Authenticated users can create posts
      allow update, delete: if request.auth != null && 
        (resource.data.userId == request.auth.uid || 
         get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role in ['admin', 'owner']);
    }
    
    // Messages collection
    match /messages/{messageId} {
      allow read: if request.auth != null && 
        (resource.data.senderId == request.auth.uid || 
         resource.data.receiverId == request.auth.uid);
      allow create: if request.auth != null;
      allow update, delete: if request.auth != null && resource.data.senderId == request.auth.uid;
    }
  }
}
```

3. Click "Publish"

### Step 7: Create Your Owner User Document
1. Click on the "Data" tab in Firestore
2. Click "Start collection"
3. Enter "users" as the Collection ID
4. Click "Next"
5. For Document ID, paste the User UID you copied in Step 4
6. Add the following fields (click "Add field" for each):

   Field name: `email` | Type: string | Value: your email address
   Field name: `displayName` | Type: string | Value: Your Name
   Field name: `role` | Type: string | Value: `owner`
   Field name: `createdAt` | Type: timestamp | Click "Insert" (it auto-fills current time)
   Field name: `friends` | Type: array | (leave empty)
   Field name: `referralPoints` | Type: number | Value: 0
   Field name: `referralCodes` | Type: array | (leave empty)

7. Click "Save"

## Part 4: Set Up Firebase Storage

### Step 8: Enable Storage
1. Click "Storage" in the left sidebar
2. Click "Get started"
3. Click "Next" (keep default rules for now)
4. Choose the same location as your Firestore
5. Click "Done"

### Step 9: Set Up Storage Security Rules
1. Click on the "Rules" tab in Storage
2. Replace the rules with:

```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /posts/{userId}/{fileName} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
    match /profiles/{userId}/{fileName} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

3. Click "Publish"

## Part 5: Get Your Firebase Configuration

### Step 10: Get Your Firebase Config
1. Click the gear icon (⚙️) next to "Project Overview" in the left sidebar
2. Click "Project settings"
3. Scroll down to "Your apps"
4. Click the web icon (</>) to add a web app
5. Enter an app nickname (e.g., "Social Network Web")
6. **DO NOT** check "Also set up Firebase Hosting" (we'll deploy differently)
7. Click "Register app"
8. You'll see a code snippet with `firebaseConfig` - **COPY THIS ENTIRE OBJECT**

It looks like this:
```javascript
const firebaseConfig = {
  apiKey: "AIza...",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123"
};
```

9. Click "Continue to console"

## Part 6: Configure Your Website

### Step 11: Update the HTML File
1. Open the `index.html` file in a text editor (Notepad on Windows, TextEdit on Mac)
2. Find this section near line 1350:

```javascript
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT_ID.appspot.com",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
};
```

3. Replace it with YOUR firebaseConfig that you copied in Step 10
4. Save the file

## Part 7: Deploy Your Website

You have several options for deployment. Choose ONE:

### Option A: Firebase Hosting (Recommended - Free)

1. **Install Node.js:**
   - Go to https://nodejs.org/
   - Download and install the LTS version
   - Restart your computer

2. **Install Firebase CLI:**
   - Open Command Prompt (Windows) or Terminal (Mac)
   - Type: `npm install -g firebase-tools`
   - Press Enter and wait for installation

3. **Login to Firebase:**
   - Type: `firebase login`
   - Press Enter
   - Your browser will open - sign in with your Google account
   - Close browser after success

4. **Initialize Firebase in your project folder:**
   - Navigate to the folder containing index.html
   - Type: `firebase init hosting`
   - Press Enter
   - Select "Use an existing project"
   - Select your project from the list
   - For "public directory", type: `.` (just a dot)
   - For "single-page app", type: `y`
   - For "overwrite index.html", type: `N`

5. **Deploy:**
   - Type: `firebase deploy --only hosting`
   - Press Enter
   - Wait for deployment to complete
   - You'll get a URL like: `https://your-project.web.app`

### Option B: Netlify (Alternative - Free)

1. Go to https://www.netlify.com/
2. Sign up for a free account
3. Drag and drop your `index.html` file onto the Netlify dashboard
4. Your site will be live in seconds!
5. You'll get a URL like: `https://random-name.netlify.app`

### Option C: GitHub Pages (Alternative - Free)

1. Create a GitHub account at https://github.com/
2. Create a new repository
3. Upload your `index.html` file
4. Go to Settings > Pages
5. Select the main branch as source
6. Your site will be at: `https://yourusername.github.io/repository-name`

## Part 8: Testing Your Website

### Step 12: Test Everything
1. Open your deployed website URL
2. Test the following:

   ✅ Welcome page loads
   ✅ Search for users (should be empty initially)
   ✅ Click "Get Started" → Login page
   ✅ Click "Register" and create a test user account
   ✅ After registration, you should see the feed
   ✅ Create a post (try text and image)
   ✅ Go to Profile - see your post
   ✅ Go to Settings - update your profile
   ✅ Logout and login again with your OWNER email (from Step 4)
   ✅ You should see "Owner" button in navigation
   ✅ Click Owner - see statistics

## Part 9: Create Admin Users (Optional)

### Step 13: Make Someone an Admin
1. Go to Firebase Console > Firestore Database
2. Click on the "users" collection
3. Click on a user document
4. Find the "role" field
5. Change the value from "user" to "admin"
6. Click "Update"
7. That user can now access the Admin page

## Part 10: Maintaining Your Website

### Regular Tasks:
- **Monitor users:** Check Firebase Console > Authentication
- **Check database size:** Firebase Console > Firestore Database
- **View storage usage:** Firebase Console > Storage
- **Backup data:** Use the Owner page "Export All Data" button

### If You Lose Access:
Your owner account is protected! Even if you:
- Forget your password → Use "Forgot Password" on login page
- Change your email → You can still login with the old email
- The `role: owner` in Firestore ensures permanent access

### Free Tier Limits:
- **Firestore:** 1 GB storage, 50K reads/day, 20K writes/day
- **Storage:** 5 GB
- **Authentication:** Unlimited
- **Hosting:** 10 GB/month bandwidth

For 50 users, you'll be well within limits!

## Troubleshooting

### Problem: "Permission denied" errors
**Solution:** Check your Firestore Security Rules (Step 6)

### Problem: Images not uploading
**Solution:** Check your Storage Security Rules (Step 9)

### Problem: Can't login
**Solution:** 
1. Check Firebase Console > Authentication > Users
2. Make sure the user exists
3. Try password reset

### Problem: Website not loading after deployment
**Solution:**
1. Check browser console (F12) for errors
2. Make sure firebaseConfig is correct
3. Clear browser cache and try again

### Problem: Owner page not showing
**Solution:**
1. Make sure your user document has `role: "owner"`
2. Logout and login again

## Important Security Notes

1. **Never share your Firebase config publicly** - it's in the HTML but that's OK for this scale
2. **Keep your owner password secure**
3. **Regularly export your data** (Owner page)
4. **Monitor the Firebase Console** for unusual activity

## Next Steps

1. Share your website URL with friends!
2. Create some test accounts
3. Post content and test all features
4. Customize the colors/themes in the CSS (between lines 7-150 in index.html)
5. Monitor your Firebase usage in the console

## Getting Help

If you need help:
1. Check the Firebase documentation: https://firebase.google.com/docs
2. Firebase free tier: https://firebase.google.com/pricing
3. Firebase support: https://firebase.google.com/support

---

**Congratulations!** 🎉 Your social network is now live!

Your website URL: _____________________________ (write it here)
Your owner email: _____________________________ (write it here)
Your Firebase project: ________________________ (write it here)
