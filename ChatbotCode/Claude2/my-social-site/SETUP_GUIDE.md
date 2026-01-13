# SocialConnect - Complete Setup Guide

This guide will walk you through setting up your Firebase social networking application from scratch. Follow each step carefully.

## Part 1: Firebase Project Setup

### Step 1: Create Firebase Project

1. Go to https://console.firebase.google.com/
2. Click "Add project" or "Create a project"
3. Enter project name: `socialconnect` (or your preferred name)
4. Click "Continue"
5. Disable Google Analytics (optional, not needed for this project)
6. Click "Create project"
7. Wait for project creation, then click "Continue"

### Step 2: Enable Firebase Authentication

1. In Firebase Console, click "Authentication" in the left sidebar
2. Click "Get started"
3. Click on "Email/Password" under Sign-in method
4. Toggle "Enable" to ON
5. Click "Save"

### Step 3: Create Firestore Database

1. Click "Firestore Database" in the left sidebar
2. Click "Create database"
3. Select "Start in production mode"
4. Click "Next"
5. Choose your Cloud Firestore location (pick closest to your users)
6. Click "Enable"

### Step 4: Enable Firebase Storage

1. Click "Storage" in the left sidebar
2. Click "Get started"
3. Click "Next" (keep default security rules for now)
4. Choose same location as Firestore
5. Click "Done"

### Step 5: Get Your Firebase Configuration

1. Click the gear icon (⚙️) next to "Project Overview"
2. Click "Project settings"
3. Scroll down to "Your apps"
4. Click the web icon (</>) "Add app"
5. Enter app nickname: "SocialConnect Web"
6. Check "Also set up Firebase Hosting" (optional but recommended)
7. Click "Register app"
8. **IMPORTANT**: Copy the firebaseConfig object that appears
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

### Step 6: Update config.js File

1. Open the `config.js` file in your project
2. Replace the placeholder values with your actual Firebase configuration:

```javascript
const firebaseConfig = {
    apiKey: "YOUR_ACTUAL_API_KEY",
    authDomain: "your-project-id.firebaseapp.com",
    projectId: "your-project-id",
    storageBucket: "your-project-id.appspot.com",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
};
```

3. Save the file

### Step 7: Deploy Firestore Security Rules

1. In Firebase Console, go to "Firestore Database"
2. Click on the "Rules" tab
3. Delete all existing rules
4. Copy the entire content from `firestore.rules` file
5. Paste it into the Rules editor
6. Click "Publish"

### Step 8: Deploy Storage Security Rules

1. In Firebase Console, go to "Storage"
2. Click on the "Rules" tab
3. Delete all existing rules
4. Copy the entire content from `storage.rules` file
5. Paste it into the Rules editor
6. Click "Publish"

---

## Part 2: Set Up Owner Account

### Step 9: Create Your Owner Account

1. Open `index.html` in a web browser (you can just double-click it)
2. Click "Register"
3. Fill in your details:
   - Display Name: Your name
   - Email: Your email (SAVE THIS - you'll need it to recover access)
   - Password: Strong password (SAVE THIS)
4. Click "Register"

### Step 10: Make Yourself the Owner

1. Go back to Firebase Console
2. Click "Firestore Database"
3. You should see a "users" collection with one document (your user ID)
4. Click on your user document
5. Click "Add field"
6. Field name: `isOwner`
7. Type: `boolean`
8. Value: `true`
9. Click "Add"
10. Click "Add field" again
11. Field name: `isAdmin`
12. Type: `boolean`
13. Value: `true`
14. Click "Add"

**IMPORTANT**: Take a screenshot of your user ID and save your email/password in a safe place!

---

## Part 3: Deploy Your Website

### Option A: Firebase Hosting (Recommended - Free)

1. Install Node.js from https://nodejs.org/ if you haven't
2. Open Command Prompt (Windows) or Terminal (Mac/Linux)
3. Install Firebase CLI:
   ```
   npm install -g firebase-tools
   ```
4. Navigate to your project folder:
   ```
   cd path/to/your/project
   ```
5. Login to Firebase:
   ```
   firebase login
   ```
6. Initialize Firebase Hosting:
   ```
   firebase init hosting
   ```
   - Use existing project
   - Select your project
   - Public directory: `.` (current directory)
   - Single-page app: `No`
   - Set up automatic builds: `No`
   - Don't overwrite existing files
7. Deploy:
   ```
   firebase deploy --only hosting
   ```
8. Your site is now live! The URL will be shown in the terminal

### Option B: GitHub Pages (Free Alternative)

1. Create a GitHub account at https://github.com
2. Create a new repository named `socialconnect`
3. Upload all your files (index.html, styles.css, app.js, config.js)
4. Go to repository Settings → Pages
5. Source: Deploy from a branch
6. Branch: main, folder: / (root)
7. Click Save
8. Your site will be live at: `https://yourusername.github.io/socialconnect`

### Option C: Local Testing

1. Simply open `index.html` in your web browser
2. Everything will work locally!
3. Share the files with others to let them use it

---

## Part 4: Creating Admin Accounts

To make other users admins:

1. Have them register an account normally
2. Go to Firebase Console → Firestore Database
3. Find their user document in the "users" collection
4. Add a field: `isAdmin` = `true` (boolean)
5. They can now access the admin panel at: `/admin` (or by logging in through admin login page)

---

## Part 5: Security Best Practices

### Protect Your Owner Access

1. **Email Backup**: Add a recovery email in Firebase Console
   - Firebase Console → Authentication → Your email → Manage user
   - Add recovery email

2. **Password Recovery**: Set up password reset email
   - Already built into the app ("Forgot Password" link)

3. **Backup Your Config**: Save a copy of your `config.js` file

4. **Regular Backups**: Use the "Export All Data" feature in Owner Dashboard

### Firebase Console Access

Your Firebase Console (https://console.firebase.google.com) is separate from the app:
- You can reset passwords there
- You can manually add/remove admin/owner status
- You can view all data
- You can change project settings

---

## Part 6: Usage Guide

### For Regular Users

1. **Register**: Create account with email/password
2. **Profile**: Set up profile with picture, bio, location
3. **Posts**: Create posts (280 char limit), add images
4. **Friends**: Search and add friends
5. **Messages**: Send private messages to friends
6. **Privacy**: Toggle posts between public and friends-only

### For Admins

1. **Admin Panel**: Access from main navigation after logging in
2. **Manage Users**: View all users, delete accounts if needed
3. **Moderate Posts**: View and delete inappropriate posts
4. **User Settings**: Help users with account issues

### For Owner (You)

1. **Owner Dashboard**: See site statistics
2. **Full Control**: Access all admin features
3. **Data Export**: Download all site data
4. **User Management**: Promote users to admin

---

## Part 7: Free Tier Limits

Firebase Free Tier (Spark Plan) includes:

### Firestore:
- **Stored data**: 1 GB
- **Document reads**: 50,000/day
- **Document writes**: 20,000/day
- **Document deletes**: 20,000/day

### Storage:
- **Storage**: 5 GB
- **Downloads**: 1 GB/day
- **Uploads**: Unlimited

### Authentication:
- **Users**: Unlimited
- **Email/Password**: Unlimited

### Hosting:
- **Storage**: 10 GB
- **Data transfer**: 360 MB/day

**Your estimated capacity:**
- 50 active users posting ~5 times per day: ~7,500 reads/day, ~2,500 writes/day
- Plenty of room for growth!

---

## Part 8: Troubleshooting

### Problem: "Permission denied" errors

**Solution**: 
1. Check that Firestore rules are deployed correctly
2. Verify user is logged in
3. Check browser console for specific errors

### Problem: Images not uploading

**Solution**:
1. Verify Storage rules are deployed
2. Check that user is authenticated
3. Verify file size (keep under 5MB)
4. Check browser console for errors

### Problem: Can't access owner/admin features

**Solution**:
1. Go to Firebase Console → Firestore
2. Find your user document
3. Verify `isOwner: true` and `isAdmin: true` fields exist
4. Log out and log back in

### Problem: Forgot password

**Solution**:
1. Click "Forgot Password" on login page
2. Enter your email
3. Check email for reset link
4. If no email, reset through Firebase Console → Authentication

### Problem: Lost owner access

**Solution**:
1. Go to Firebase Console (you still have access here)
2. Authentication → Find your account
3. Firestore → Users → Your document
4. Verify `isOwner: true` field
5. Can manually reset password in Authentication section

---

## Part 9: Adding Features Later

### To add more admins:
```javascript
// In Firestore, add to any user document:
isAdmin: true
```

### To change user limits:
Edit the values in `app.js`:
- Post character limit: Line with `maxlength="280"`
- Referral invites: Line with `invitesThisMonth >= 5`

### To add more profile banners:
Edit `index.html` and `styles.css`:
1. Add option to select dropdown
2. Add CSS gradient class

---

## Part 10: Maintenance

### Monthly Tasks:
1. Check Firebase usage in Console → Usage tab
2. Export site data from Owner Dashboard (backup)
3. Review any user reports or issues

### Monitor Firebase Console:
- Authentication: Number of users
- Firestore: Database size
- Storage: Storage usage
- Hosting: Bandwidth usage

---

## Support Resources

- **Firebase Documentation**: https://firebase.google.com/docs
- **Firebase Console**: https://console.firebase.google.com
- **Firebase Status**: https://status.firebase.google.com

---

## Quick Reference Commands

### Deploy to Firebase Hosting:
```bash
firebase deploy --only hosting
```

### Update Firestore Rules:
```bash
firebase deploy --only firestore:rules
```

### Update Storage Rules:
```bash
firebase deploy --only storage:rules
```

### View Firebase Login Status:
```bash
firebase login:list
```

---

## File Structure

Your project should have these files:
```
socialconnect/
├── index.html          (Main HTML file)
├── styles.css          (All styles)
├── app.js             (Main application logic)
├── config.js          (Firebase configuration - UPDATE THIS!)
├── firestore.rules    (Database security rules)
├── storage.rules      (Storage security rules)
├── README.md          (This file)
└── firebase.json      (If using Firebase Hosting)
```

---

## Success Checklist

Before launching to users, verify:

- [ ] Firebase project created
- [ ] Authentication enabled
- [ ] Firestore database created
- [ ] Storage enabled
- [ ] config.js updated with your Firebase config
- [ ] Firestore rules deployed
- [ ] Storage rules deployed
- [ ] Owner account created and verified
- [ ] isOwner and isAdmin fields set on your account
- [ ] Site deployed (Firebase Hosting or other)
- [ ] Can register new test user
- [ ] Can create posts
- [ ] Can upload images
- [ ] Can add friends
- [ ] Can send messages
- [ ] Admin panel accessible
- [ ] Owner dashboard accessible

---

## You're All Set! 🎉

Your social networking site is ready to use. Start by:
1. Creating your profile
2. Inviting a few friends to test
3. Creating your first post
4. Exploring all the features

Remember: You have full control through both the app and Firebase Console!
