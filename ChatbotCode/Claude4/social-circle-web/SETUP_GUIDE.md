# Social Circle - Complete Firebase Setup and Deployment Guide

This guide will walk you through setting up and deploying your social media web application from scratch. No programming experience needed!

## Part 1: Create Firebase Project (15 minutes)

### Step 1: Create a Google Account (if you don't have one)
1. Go to https://accounts.google.com/signup
2. Follow the steps to create a new Google account
3. Verify your email address

### Step 2: Create Firebase Project
1. Go to https://console.firebase.google.com/
2. Click "Add project" or "Create a project"
3. Enter project name: "social-circle" (or your preferred name)
4. Click "Continue"
5. Disable Google Analytics (not needed for now) and click "Create project"
6. Wait for project creation (takes about 30 seconds)
7. Click "Continue" when done

### Step 3: Set Up Firebase Authentication
1. In your Firebase Console, click "Authentication" in the left sidebar
2. Click "Get started"
3. Click on "Email/Password" under Sign-in providers
4. Toggle "Enable" to ON
5. Click "Save"

### Step 4: Set Up Cloud Firestore Database
1. Click "Firestore Database" in the left sidebar
2. Click "Create database"
3. Select "Start in test mode" (we'll secure it properly later)
4. Click "Next"
5. Choose your Cloud Firestore location (pick one closest to you)
6. Click "Enable"
7. Wait for database creation

### Step 5: Set Up Firebase Storage
1. Click "Storage" in the left sidebar
2. Click "Get started"
3. Click "Next" on the security rules screen (test mode)
4. Choose your storage location (same as Firestore)
5. Click "Done"

### Step 6: Set Up Firestore Security Rules
1. Go back to "Firestore Database"
2. Click on the "Rules" tab
3. Replace the existing rules with the following:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users collection
    match /users/{userId} {
      allow read: if true;  // Anyone can read user profiles
      allow write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Posts collection
    match /posts/{postId} {
      allow read: if true;  // Anyone can read posts
      allow create: if request.auth != null;
      allow update, delete: if request.auth != null && 
        (request.auth.uid == resource.data.userId || 
         get(/databases/$(database)/documents/users/$(request.auth.uid)).data.isAdmin == true);
      
      // Comments subcollection
      match /comments/{commentId} {
        allow read: if true;
        allow write: if request.auth != null;
      }
    }
    
    // Friends collection
    match /friends/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Messages collection
    match /messages/{messageId} {
      allow read, write: if request.auth != null && 
        (request.auth.uid == resource.data.senderId || 
         request.auth.uid == resource.data.receiverId);
    }
    
    // Gallery collection
    match /gallery/{itemId} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.uid == resource.data.userId;
    }
    
    // Invite codes
    match /inviteCodes/{code} {
      allow read: if request.auth != null;
      allow create: if request.auth != null;
      allow update: if request.auth != null;
    }
  }
}
```

4. Click "Publish"

### Step 7: Set Up Storage Security Rules
1. Go to "Storage" in the left sidebar
2. Click on the "Rules" tab
3. Replace the existing rules with:

```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /profilePics/{userId} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
    
    match /posts/{userId}/{fileName} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

4. Click "Publish"

### Step 8: Get Your Firebase Configuration
1. Click the gear icon (⚙️) next to "Project Overview" in the left sidebar
2. Click "Project settings"
3. Scroll down to "Your apps" section
4. Click the web icon (</>) to add a web app
5. Enter an app nickname: "Social Circle Web"
6. Check "Also set up Firebase Hosting" (optional for now)
7. Click "Register app"
8. Copy the firebaseConfig object (it looks like this):

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

9. Keep this information safe - you'll need it in the next step!

## Part 2: Configure Your Application (5 minutes)

### Step 9: Update config.js
1. Open the `config.js` file in a text editor (Notepad, TextEdit, or VS Code)
2. Replace the placeholder values with your actual Firebase configuration:

```javascript
const firebaseConfig = {
    apiKey: "YOUR_ACTUAL_API_KEY",
    authDomain: "your-actual-project-id.firebaseapp.com",
    projectId: "your-actual-project-id",
    storageBucket: "your-actual-project-id.appspot.com",
    messagingSenderId: "YOUR_ACTUAL_SENDER_ID",
    appId: "YOUR_ACTUAL_APP_ID"
};
```

3. Save the file

### Step 10: Set Your Owner Email
1. Open `app.js` file
2. Find this line (around line 119):
   ```javascript
   const ownerEmail = 'YOUR_EMAIL@example.com';
   ```
3. Replace with your actual email address that you'll use to log in
4. Save the file

## Part 3: Deploy Your Application (10 minutes)

### Option A: Deploy with Firebase Hosting (Recommended)

#### Step 11: Install Node.js
1. Go to https://nodejs.org/
2. Download the LTS (Long Term Support) version
3. Run the installer and follow the prompts
4. Accept all default settings

#### Step 12: Install Firebase CLI
1. Open Command Prompt (Windows) or Terminal (Mac/Linux)
2. Type this command and press Enter:
   ```
   npm install -g firebase-tools
   ```
3. Wait for installation to complete (may take a few minutes)

#### Step 13: Login to Firebase
1. In the command prompt/terminal, type:
   ```
   firebase login
   ```
2. Press Y when asked if Firebase can collect usage data
3. Your web browser will open - select your Google account
4. Click "Allow" to give Firebase CLI access

#### Step 14: Initialize Firebase in Your Project
1. In command prompt/terminal, navigate to your project folder:
   ```
   cd path/to/your/project
   ```
   (Replace "path/to/your/project" with the actual path where you saved the files)

2. Type this command:
   ```
   firebase init
   ```

3. You'll be asked several questions:
   - "Are you ready to proceed?" → Press Enter
   - Select "Hosting" using arrow keys and spacebar, then press Enter
   - "Use an existing project" → Press Enter
   - Select your project from the list → Press Enter
   - "What do you want to use as your public directory?" → Type `.` and press Enter
   - "Configure as a single-page app?" → Type `y` and press Enter
   - "Set up automatic builds and deploys with GitHub?" → Type `n` and press Enter

#### Step 15: Deploy!
1. Type this command:
   ```
   firebase deploy
   ```
2. Wait for deployment (takes 30-60 seconds)
3. You'll see a "Hosting URL" in the output - this is your live website!
4. Copy this URL and share it with others

### Option B: Run Locally (for testing)

If you want to test locally first:

1. Install a simple web server. In command prompt/terminal:
   ```
   npm install -g http-server
   ```

2. Navigate to your project folder:
   ```
   cd path/to/your/project
   ```

3. Start the server:
   ```
   http-server -p 8080
   ```

4. Open your browser and go to:
   ```
   http://localhost:8080
   ```

## Part 4: Create Your Owner Account (5 minutes)

### Step 16: Register Your Account
1. Open your deployed website (or localhost)
2. Click "Sign Up"
3. Enter your information using the SAME EMAIL you set as owner in Step 10
4. Create a password (at least 6 characters)
5. Click "Create Account"

### Step 17: Verify Everything Works
1. Try creating a post
2. Upload a profile picture
3. Check all the pages (Profile, Friends, Messages, Search, Settings)
4. You should see "Owner" link in the navigation (since you're the owner)
5. Click on "Owner" to see site statistics

### Step 18: Create Test Admin Account (Optional)
1. Log out
2. Register another account with a different email
3. Log back in as owner
4. Once you make someone admin through the database or admin page, test admin features

## Part 5: Make Your First Admin

Since you need to be logged in as admin to access the admin page, you'll need to manually make your first admin:

1. Go to Firebase Console → Firestore Database
2. Click on "users" collection
3. Find your user document (by email)
4. Click on it
5. Click "Add field"
6. Field name: `isAdmin`
7. Type: boolean
8. Value: true
9. Click "Add"
10. Refresh your website and you'll see the "Admin" link appear

## Troubleshooting

### Problem: "Firebase is not defined" error
- Solution: Make sure you've updated config.js with your Firebase configuration
- Check that index.html is loading the Firebase scripts correctly

### Problem: Can't login after creating account
- Solution: Check Firebase Console → Authentication → Users to see if account was created
- Try password reset feature
- Make sure email/password authentication is enabled

### Problem: "Permission denied" errors
- Solution: Check that you've set up Firestore and Storage security rules correctly
- Make sure rules are published

### Problem: Images not uploading
- Solution: Check Firebase Storage is enabled
- Verify storage security rules are set
- Check browser console for specific errors

### Problem: Website not loading after deployment
- Solution: Make sure all files (index.html, styles.css, config.js, app.js) are in the same folder
- Clear browser cache and try again
- Check Firebase Hosting console for deployment status

## Free Tier Limits (for 50 users)

Your app should work fine on Firebase free tier with 50 users:

- **Authentication**: Unlimited users ✓
- **Firestore**: 
  - 50,000 reads/day (plenty for 50 users)
  - 20,000 writes/day (plenty)
  - 1 GB storage (enough for text data)
  
- **Storage**: 
  - 5 GB storage (enough for ~1000 images)
  - 1 GB/day download (enough)

- **Hosting**: 
  - 10 GB/month storage
  - 360 MB/day bandwidth

## Important Security Notes

1. **Change Test Mode Rules**: The security rules provided are for testing. For production, you should strengthen them.

2. **Protect Owner Access**: Your owner email is hardcoded. Never share this email's password.

3. **Regular Backups**: Export data regularly using the Owner dashboard.

4. **Monitor Usage**: Check Firebase Console regularly to ensure you're within free tier limits.

## Updating Your Site

To update your site after making changes:

1. Make changes to your files
2. Run `firebase deploy` again
3. Changes will be live in 30-60 seconds

## Getting Help

- Firebase Documentation: https://firebase.google.com/docs
- Firebase Support: https://firebase.google.com/support
- Check browser console (F12) for error messages

## Next Steps

1. Customize the theme colors in styles.css
2. Add your own logo/branding
3. Invite friends to test
4. Monitor usage in Firebase Console
5. Consider upgrading to paid plan if you exceed free tier

Congratulations! Your social media platform is now live! 🎉
