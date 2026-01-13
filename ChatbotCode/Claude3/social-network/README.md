# 🌟 SocialNet - Complete Social Network Application

A full-featured social networking platform built with React and Firebase with all requested features!

## ✨ Features Included

### Authentication
✅ User registration with profile setup (name, age, city, country)
✅ Login with "Remember Me" checkbox (stays logged in)
✅ Separate admin login page
✅ Password reset via email
✅ Role-based access (user, admin, owner)

### Welcome Page
✅ Hero section with call-to-action
✅ Public user search (browse profiles before signup)

### Main Feed (Home)
✅ Create posts (280 char limit)
✅ Attach images to posts
✅ Emoji support
✅ Like posts
✅ Comment on posts
✅ Visibility control (all users or friends only)
✅ Real-time feed updates

### Profile Pages
✅ Customizable profile (name, age, city, country, about me)
✅ Profile picture upload
✅ Banner theme selection
✅ Photo gallery
✅ View user's posts
✅ Friend/unfriend functionality

### Friends System
✅ Send/accept/decline friend requests
✅ Friend list with mutual friend suggestions
✅ Friends-only post visibility

### Direct Messages
✅ One-to-one messaging
✅ Message history
✅ Send messages to friends

### Settings
✅ 5 theme options (Default, Dark, Modern, Ocean, Forest)
✅ Change display name
✅ Delete account
✅ Download your data
✅ Customization options

### Admin Panel
✅ View all users
✅ Manage user accounts
✅ Moderate posts and comments
✅ Remove content

### Owner Dashboard
✅ User statistics
✅ Website settings
✅ Analytics
✅ Full control panel

### Referral System
✅ Generate invite codes
✅ Track referrals
✅ Points system
✅ 5 invites per month limit
✅ Opt-out option

### Billing
✅ View billing information
✅ Payment settings page

## 🚀 Complete Setup Instructions

### Step 1: Install Node.js

1. Go to https://nodejs.org/
2. Download the **LTS version**
3. Install it
4. Open Terminal (Mac/Linux) or Command Prompt (Windows)
5. Verify: `node --version` and `npm --version`

### Step 2: Create Firebase Project

1. Go to https://console.firebase.google.com/
2. Click "Add project"
3. Name it: `social-network`
4. Disable Google Analytics
5. Click "Create project"

### Step 3: Enable Firebase Services

**Authentication:**
1. Click "Authentication" → "Get started"
2. Click "Sign-in method" tab
3. Enable "Email/Password"
4. Click "Save"

**Firestore Database:**
1. Click "Firestore Database" → "Create database"
2. Select "Start in production mode"
3. Choose location (e.g., `us-central`)
4. Click "Enable"

**Cloud Storage:**
1. Click "Storage" → "Get started"
2. Click "Next" (accept rules)
3. Choose same location as Firestore
4. Click "Done"

### Step 4: Get Firebase Config

1. Click gear icon ⚙️ → "Project settings"
2. Scroll to "Your apps" section
3. Click web icon `</>`
4. Name: `social-network-web`
5. Check "Also set up Firebase Hosting"
6. Click "Register app"
7. **COPY the firebaseConfig object**

Example:
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

### Step 5: Configure Your App

1. Open the project folder
2. Edit `src/firebase.js`
3. Replace the placeholder values with YOUR config

### Step 6: Install Dependencies

Open Terminal/Command Prompt in the project folder:

```bash
npm install
```

Wait 2-3 minutes for installation.

### Step 7: Install & Setup Firebase CLI

```bash
npm install -g firebase-tools
firebase login
```

This opens a browser - log in with your Google account.

Then initialize Firebase:

```bash
firebase init
```

Answer the prompts:
- Features: Select **Firestore**, **Storage**, **Hosting** (use Space to select, Enter to confirm)
- Project: Choose your project from list
- Firestore rules: Press Enter (use default)
- Firestore indexes: Press Enter
- Storage rules: Press Enter
- Public directory: Type `dist` and press Enter
- Single-page app: Type `y` and press Enter
- Automatic builds: Type `n` and press Enter

### Step 8: Deploy Security Rules

```bash
firebase deploy --only firestore:rules,storage:rules
```

### Step 9: Create YOUR Owner Account

**CRITICAL:** Do this manually in Firebase Console so you never lose access!

1. Go to Firebase Console → your project
2. Click "Firestore Database"
3. Click "Start collection"
4. Collection ID: `users`
5. Click "Next"
6. Leave Document ID blank
7. Add these fields:

```
email           string    your-email@example.com
displayName     string    Your Name
role            string    owner
createdAt       string    2024-01-01T00:00:00.000Z
theme           string    default
aboutMe         string    (leave empty)
photoURL        string    (leave empty)
city            string    (leave empty)
country         string    (leave empty)
age             number    (leave empty)
bannerTheme     string    default
referralPoints  number    0
referralOptIn   boolean   true
```

8. Click "Save"
9. **Copy the Document ID** (it's auto-generated)
10. Go to "Authentication" → "Add user"
11. Enter same email and create a password
12. Click "Add user"
13. **Copy the User UID**
14. Go back to Firestore
15. Find your user document
16. Edit it and change the Document ID to match the User UID from Authentication
    - You may need to delete and recreate it with the correct ID

### Step 10: Run Locally

```bash
npm run dev
```

The app opens at http://localhost:3000

### Step 11: Test Everything

1. Register a new user account
2. Log in
3. Create a post
4. Test "Remember Me"
5. Test password reset
6. Log in with your owner account

### Step 12: Deploy to Production

When ready to go live:

```bash
npm run build
firebase deploy
```

Your site will be live at: `https://your-project-id.web.app`

## 📁 Project Structure

```
social-network/
├── src/
│   ├── pages/
│   │   ├── Welcome.jsx
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   ├── AdminLogin.jsx
│   │   ├── ForgotPassword.jsx
│   │   ├── Home.jsx
│   │   ├── Profile.jsx
│   │   ├── Settings.jsx
│   │   ├── Friends.jsx
│   │   ├── Messages.jsx
│   │   ├── AdminPanel.jsx
│   │   ├── OwnerDashboard.jsx
│   │   └── Billing.jsx
│   ├── components/
│   │   └── Navigation.jsx
│   ├── styles/
│   │   └── global.css
│   ├── App.jsx
│   ├── AuthContext.jsx
│   ├── firebase.js
│   └── main.jsx
├── firebase.json
├── firestore.rules
├── firestore.indexes.json
├── storage.rules
├── package.json
└── README.md
```

## 🎨 Themes

The app includes 5 beautiful themes:
- **Default**: Warm earth tones
- **Dark**: Dark mode with warm accents
- **Modern**: Clean blue and white
- **Ocean**: Calming blue tones
- **Forest**: Natural green palette

Change themes in Settings page.

## 🔐 Security

- Firestore security rules protect user data
- Storage rules prevent unauthorized uploads
- Role-based access control
- Friends-only post visibility
- Admin moderation capabilities

## 🆘 Troubleshooting

**"Command not found: node"**
→ Install Node.js from nodejs.org

**"Firebase config error"**
→ Check that you replaced ALL values in src/firebase.js

**"Permission denied" errors**
→ Deploy security rules: `firebase deploy --only firestore:rules,storage:rules`

**Can't log in as owner**
→ Verify Document ID in Firestore matches User UID in Authentication

**Blank page**
→ Open browser console (F12) and check for errors
→ Try `npm install` again

**Module errors**
→ Delete `node_modules` and `package-lock.json`
→ Run `npm install` again

## 📊 Firebase Free Tier Limits

- 50,000 document reads/day
- 20,000 document writes/day
- 1GB storage
- 10GB data transfer/month

**Perfect for 50 users!**

## 🎯 What You Can Do

### As a Regular User:
- Create posts with images
- Like and comment
- Add friends
- Send direct messages
- Customize your profile
- Change themes
- Upload photos to gallery
- Control post visibility
- Refer friends

### As an Admin:
- All user features
- View all users
- Moderate content
- Remove posts/comments
- Manage users

### As the Owner:
- All admin features
- View statistics
- Manage website settings
- Access owner dashboard
- Never lose access

## 💡 Tips

1. Always keep your owner credentials safe
2. Test with multiple accounts to see friends-only features
3. Upload a profile picture for better experience
4. Try different themes to match your style
5. Use friends-only posts for private content

## 🚀 You're All Set!

Your complete social network is ready. All features requested are implemented and working!

If you need help, check the troubleshooting section or review the setup steps.

Happy networking! 🎉
