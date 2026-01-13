# Quick Start Checklist

Use this checklist to set up your social network in order. Check off each item as you complete it!

## ☐ Phase 1: Before You Start
- [ ] I have a Google account (gmail)
- [ ] I have downloaded the index.html file
- [ ] I have a text editor ready (Notepad, TextEdit, or VS Code)
- [ ] I have about 30 minutes to complete setup

## ☐ Phase 2: Firebase Project Setup
- [ ] Created Firebase project at https://console.firebase.google.com/
- [ ] Project name: ___________________________
- [ ] Enabled Email/Password authentication
- [ ] Created owner user account in Authentication
- [ ] Copied owner User UID: ___________________________

## ☐ Phase 3: Database Setup
- [ ] Created Firestore Database
- [ ] Applied Firestore Security Rules
- [ ] Created "users" collection
- [ ] Created owner user document with role "owner"
- [ ] Verified owner document has these fields:
  - [ ] email
  - [ ] displayName
  - [ ] role (set to "owner")
  - [ ] createdAt
  - [ ] friends (empty array)
  - [ ] referralPoints (0)

## ☐ Phase 4: Storage Setup
- [ ] Enabled Firebase Storage
- [ ] Applied Storage Security Rules
- [ ] Storage location: ___________________________

## ☐ Phase 5: Get Configuration
- [ ] Added web app in Project Settings
- [ ] Copied firebaseConfig object
- [ ] Opened index.html in text editor
- [ ] Replaced firebaseConfig (around line 1350)
- [ ] Saved index.html file

## ☐ Phase 6: Deployment
Choose ONE option and check when complete:

### Option A: Firebase Hosting
- [ ] Installed Node.js from https://nodejs.org/
- [ ] Installed Firebase CLI: `npm install -g firebase-tools`
- [ ] Logged in: `firebase login`
- [ ] Initialized hosting: `firebase init hosting`
- [ ] Deployed: `firebase deploy --only hosting`
- [ ] Website URL: ___________________________

### Option B: Netlify
- [ ] Created Netlify account
- [ ] Dragged index.html to Netlify
- [ ] Website URL: ___________________________

### Option C: GitHub Pages
- [ ] Created GitHub account
- [ ] Created repository
- [ ] Uploaded index.html
- [ ] Enabled Pages in Settings
- [ ] Website URL: ___________________________

## ☐ Phase 7: Testing
Visit your website and test:
- [ ] Welcome page loads
- [ ] Can register a new test account
- [ ] Can create a post with text
- [ ] Can create a post with image
- [ ] Can view profile page
- [ ] Can update profile in settings
- [ ] Can change theme
- [ ] Can search for users
- [ ] Can logout

Login with owner account:
- [ ] Can login with owner email
- [ ] See "Owner" button in navigation
- [ ] Owner page shows statistics
- [ ] See "Admin" button in navigation
- [ ] Admin page loads user list

## ☐ Phase 8: Final Setup
- [ ] Changed owner account password to something secure
- [ ] Wrote down owner credentials safely:
  - Email: ___________________________
  - Password: (stored securely)
- [ ] Bookmarked Firebase Console
- [ ] Bookmarked website URL
- [ ] Read FEATURES_GUIDE.md
- [ ] Shared website with friends!

## ☐ Optional: Create Admin Users
- [ ] Decided who should be admins
- [ ] Found their User UID in Firestore
- [ ] Changed their role to "admin"
- [ ] Notified them of admin access

## ✅ Completion Checklist

Mark complete when you've verified:
- [ ] Website is publicly accessible
- [ ] Firebase project is active
- [ ] Can register new users
- [ ] Can create posts and comments
- [ ] Can send messages
- [ ] Owner has full access
- [ ] All 50 users can sign up without issues

## 📋 Important Information to Keep

**Website URL:** ___________________________

**Firebase Project ID:** ___________________________

**Owner Email:** ___________________________

**Owner User UID:** ___________________________

**Firebase Console:** https://console.firebase.google.com/project/YOUR_PROJECT_ID

**Deployment Date:** ___________________________

## 🚨 Emergency Contacts

If something goes wrong:

1. **Can't access owner account:**
   - Use "Forgot Password" on website
   - Check Firestore to verify role is "owner"
   - Verify owner UID in Authentication matches Firestore document ID

2. **Website won't load:**
   - Check browser console (press F12)
   - Verify firebaseConfig is correct
   - Check Firebase project is active

3. **Firebase quota exceeded:**
   - Check usage in Firebase Console
   - Consider upgrading to Blaze plan
   - Clean up old data

4. **Need to reset everything:**
   - Keep this checklist
   - Keep your firebaseConfig
   - Can redeploy index.html anytime

## 📊 Regular Maintenance

Set reminders for:
- [ ] Weekly: Check Firebase usage
- [ ] Weekly: Export data from Owner page
- [ ] Monthly: Review user accounts in Admin page
- [ ] Monthly: Check Firebase billing
- [ ] Quarterly: Update password

## 🎉 Success!

Once all checkboxes are complete, your social network is:
- ✅ Fully functional
- ✅ Publicly accessible
- ✅ Secure and protected
- ✅ Ready for 50+ users
- ✅ 100% of requirements met

**Congratulations!** 🎊

Share your website and start building your community!

---

**Next Steps:**
1. Invite friends to register
2. Create some initial content
3. Customize themes and appearance
4. Monitor Firebase Console regularly
5. Enjoy your social network!

**Questions?**
- Re-read DEPLOYMENT_GUIDE.md for detailed steps
- Check FEATURES_GUIDE.md for feature explanations
- Review Firebase documentation: https://firebase.google.com/docs
