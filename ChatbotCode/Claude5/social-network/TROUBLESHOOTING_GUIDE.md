# Troubleshooting Guide

## Common Issues and Solutions

### 🔴 Authentication Issues

#### Problem: "Cannot register new users"
**Symptoms:** Registration form submits but nothing happens

**Solutions:**
1. Check Firebase Console > Authentication
2. Verify Email/Password is enabled
3. Check browser console (F12) for errors
4. Verify firebaseConfig is correct in index.html
5. Check Firestore rules allow user creation

**How to check Firestore rules:**
- Go to Firebase Console > Firestore > Rules
- Verify this line exists: `allow create: if request.auth != null;`

---

#### Problem: "Can't login with correct password"
**Symptoms:** Login fails with correct credentials

**Solutions:**
1. Try password reset using "Forgot Password"
2. Check Firebase Console > Authentication > Users
3. Verify user exists and email is correct
4. Try incognito/private browsing window
5. Clear browser cookies and cache
6. Check if user's account is disabled in Authentication

---

#### Problem: "Remember me doesn't work"
**Symptoms:** User logged out after closing browser despite checking "Remember me"

**Solutions:**
1. Check browser privacy settings (must allow cookies)
2. Verify not in incognito/private mode
3. Check browser isn't set to clear cookies on close
4. Try a different browser to test

---

### 🔴 Database Issues

#### Problem: "Permission denied" when creating posts
**Symptoms:** Posts won't save, error in console

**Solutions:**
1. Verify user is logged in (check auth.currentUser)
2. Check Firestore Security Rules:
```
match /posts/{postId} {
  allow create: if request.auth != null;
}
```
3. In Firebase Console > Firestore > Rules, click "Publish" after any changes
4. Wait 30 seconds for rules to propagate
5. Refresh website and try again

---

#### Problem: "Can't see other users' posts"
**Symptoms:** Feed is empty or only shows own posts

**Solutions:**
1. Check if posts exist: Firebase Console > Firestore > posts collection
2. Verify Firestore read rules:
```
match /posts/{postId} {
  allow read: if true;
}
```
3. Check if posts are marked "friends only" and you're not friends
4. Try logging out and back in
5. Check browser console for errors

---

#### Problem: "Owner/Admin role not working"
**Symptoms:** Can't access Admin or Owner pages

**Solutions:**
1. Go to Firebase Console > Firestore > users collection
2. Find your user document (use your User UID)
3. Check the "role" field
4. Should be exactly: `owner` or `admin` (lowercase)
5. If field doesn't exist, add it:
   - Click on user document
   - Click "Add field"
   - Name: `role`
   - Type: string
   - Value: `owner`
   - Click "Save"
6. Logout and login again

---

### 🔴 Storage Issues

#### Problem: "Images won't upload"
**Symptoms:** Post created but image missing

**Solutions:**
1. Check file size (must be under 5MB for best results)
2. Check file format (JPG, PNG, GIF, WEBP only)
3. Check Storage rules in Firebase Console > Storage > Rules:
```
match /posts/{userId}/{fileName} {
  allow read: if true;
  allow write: if request.auth != null && request.auth.uid == userId;
}
```
4. Verify Storage is enabled (Firebase Console > Storage)
5. Check browser console for specific error
6. Try smaller image or different format

---

#### Problem: "Profile picture won't save"
**Symptoms:** Upload successful but image doesn't appear

**Solutions:**
1. Check Storage rules for profiles folder:
```
match /profiles/{userId}/{fileName} {
  allow read: if true;
  allow write: if request.auth != null && request.auth.uid == userId;
}
```
2. Logout and login to refresh profile data
3. Check Firebase Console > Storage to see if file uploaded
4. Try different image format
5. Verify Firestore updated with profilePicture URL:
   - Firebase Console > Firestore > users > [your user] > profilePicture field

---

### 🔴 Feature-Specific Issues

#### Problem: "Can't add friends"
**Symptoms:** Add friend button doesn't work

**Solutions:**
1. Verify you're logged in
2. Check you're not already friends
3. Check browser console for errors
4. Verify Firestore rules allow user updates:
```
match /users/{userId} {
  allow update: if request.auth != null && request.auth.uid == userId;
}
```
5. Check if friends array exists in your user document
6. Try refreshing page

---

#### Problem: "Messages not sending"
**Symptoms:** Message typed but doesn't appear

**Solutions:**
1. Verify you're friends with the recipient
2. Check you selected a conversation
3. Check Firestore rules for messages:
```
match /messages/{messageId} {
  allow create: if request.auth != null;
}
```
4. Check browser console for errors
5. Verify messages collection exists (may be created on first message)
6. Try sending to different friend

---

#### Problem: "Comments not appearing"
**Symptoms:** Comment submitted but doesn't show

**Solutions:**
1. Click comment button again to refresh
2. Check browser console for errors
3. Verify post document has comments array
4. Try refreshing entire page
5. Check you're logged in
6. Try commenting on different post

---

#### Problem: "Referral codes not working"
**Symptoms:** Can't generate codes or registrations don't count

**Solutions:**
1. Check you haven't exceeded 5 codes this month
2. Verify Firestore has referralCodes array in user document
3. Check referralCodesGenerated count in Firestore
4. Make sure referral code is entered exactly (case-sensitive)
5. Check if user opted out of referral program
6. Try generating code from Settings page

---

### 🔴 Display Issues

#### Problem: "Website looks broken or weird"
**Symptoms:** Layout issues, missing styles

**Solutions:**
1. Clear browser cache (Ctrl+F5 or Cmd+Shift+R)
2. Verify index.html uploaded correctly
3. Check browser console for CSS errors
4. Try different browser
5. Check if JavaScript is enabled
6. Verify no browser extensions blocking styles

---

#### Problem: "Theme not changing"
**Symptoms:** Selected theme doesn't apply

**Solutions:**
1. Check browser console for errors
2. Verify JavaScript is running
3. Try logging out and back in
4. Check Firestore user document has theme field
5. Clear browser cache
6. Try different theme to test

---

#### Problem: "Images not displaying"
**Symptoms:** Broken image icons instead of pictures

**Solutions:**
1. Check image URL in browser console
2. Verify Storage has public read access
3. Check Storage rules allow read: `allow read: if true;`
4. Try opening image URL directly in browser
5. Check if image was deleted from Storage
6. Verify correct Storage bucket in firebaseConfig

---

### 🔴 Deployment Issues

#### Problem: "Website not accessible after deployment"
**Symptoms:** URL returns error or blank page

**Solutions:**

**For Firebase Hosting:**
1. Check deployment succeeded (look for "Deploy complete" message)
2. Wait 5 minutes for propagation
3. Try URL in incognito mode
4. Verify hosting is enabled: Firebase Console > Hosting
5. Check you deployed to correct project
6. Try: `firebase deploy --only hosting` again

**For Netlify:**
1. Check Netlify dashboard for deployment status
2. Verify file uploaded correctly
3. Check build logs for errors
4. Try re-uploading index.html
5. Verify custom domain settings if used

**For GitHub Pages:**
1. Check repository Settings > Pages is enabled
2. Verify branch is correct (usually main or master)
3. Wait 5-10 minutes for deployment
4. Check Actions tab for build status
5. Verify index.html in repository root

---

#### Problem: "Firebase config error in console"
**Symptoms:** "Firebase not initialized" or similar

**Solutions:**
1. Verify firebaseConfig values are correct
2. Check no typos in apiKey, projectId, etc.
3. Verify all Firebase services enabled (Auth, Firestore, Storage)
4. Check Firebase project is active in console
5. Try regenerating web app config and replacing
6. Verify no extra quotes or brackets in config

---

### 🔴 Performance Issues

#### Problem: "Website loading slowly"
**Symptoms:** Pages take long to load

**Solutions:**
1. Check internet connection
2. Verify Firebase quota not exceeded:
   - Firebase Console > Usage
   - Check Firestore reads/writes
   - Check Storage bandwidth
3. Reduce number of posts loaded (currently 50)
4. Optimize images before uploading
5. Check no infinite loops in browser console
6. Try clearing browser cache

---

#### Problem: "Firebase quota exceeded"
**Symptoms:** Features stop working, quota warnings

**Solutions:**
1. Check Firebase Console > Usage and billing
2. Review what's consuming quota
3. Options:
   - Wait for daily quota reset (midnight PT)
   - Upgrade to Blaze (pay-as-you-go) plan
   - Optimize queries (load fewer posts)
   - Clean up old data
4. For 50 users, should stay within free tier

---

### 🔴 Security Issues

#### Problem: "Unauthorized access to admin features"
**Symptoms:** Users accessing admin pages without permission

**Solutions:**
1. Verify Firestore rules restrict admin operations
2. Check only users with role "admin" or "owner" can access
3. Review all user roles in Firestore
4. Change admin passwords
5. Audit Firebase Authentication > Users
6. Consider adding IP restrictions if needed

---

#### Problem: "Can't reset owner password"
**Symptoms:** Password reset not working for owner

**Solutions:**
1. Use "Forgot Password" on login page
2. Check email spam folder for reset link
3. Verify email in Firebase Console > Authentication matches
4. Try different browser/device
5. If all else fails:
   - Firebase Console > Authentication
   - Find owner user
   - Click three dots > "Reset password"
   - Send reset email manually

---

### 🔴 Data Issues

#### Problem: "Lost data after deployment"
**Symptoms:** Posts or users missing

**Solutions:**
1. Check Firebase Console > Firestore
2. Verify data still exists in database
3. Check you're connected to correct Firebase project
4. Verify firebaseConfig points to correct project
5. Check browser console for permission errors
6. Use Owner page to export data regularly

---

#### Problem: "Can't delete account"
**Symptoms:** Delete fails or account still exists

**Solutions:**
1. Check both confirmations are clicked
2. Verify user is logged in
3. Check Firestore rules allow deletion
4. Look for errors in browser console
5. Try from different browser
6. Admin can delete manually from Admin page
7. Owner can delete from Firestore directly

---

## 🔧 Debug Checklist

When something isn't working, go through this checklist:

1. **Browser Console**
   - [ ] Opened developer tools (F12)
   - [ ] Checked Console tab for errors
   - [ ] Red errors present? Note exact message

2. **Firebase Console**
   - [ ] Project is active
   - [ ] Authentication enabled
   - [ ] Firestore rules published
   - [ ] Storage enabled and rules set
   - [ ] No quota exceeded warnings

3. **User Status**
   - [ ] User is logged in (check navbar visible)
   - [ ] Correct user logged in (check profile)
   - [ ] User has correct permissions (check role in Firestore)

4. **Network**
   - [ ] Internet connection active
   - [ ] No firewall blocking Firebase
   - [ ] Firebase services reachable

5. **Configuration**
   - [ ] firebaseConfig is correct
   - [ ] All Firebase SDKs loading (check Network tab)
   - [ ] No JavaScript errors preventing initialization

## 📞 Getting Additional Help

### Before Asking for Help
1. Note exact error messages
2. Try in incognito mode
3. Try different browser
4. Check all steps in this guide
5. Review DEPLOYMENT_GUIDE.md

### Firebase Support Resources
- Documentation: https://firebase.google.com/docs
- Stack Overflow: Tag questions with [firebase]
- Firebase Discord: https://discord.gg/firebase
- Firebase Support: https://firebase.google.com/support

### Information to Provide
When asking for help, include:
- Browser and version
- Error message from console
- Steps to reproduce
- What you've already tried
- Relevant Firestore rules
- Firebase project region

## 🎯 Prevention Tips

### Regular Maintenance
1. Export data weekly from Owner page
2. Monitor Firebase usage weekly
3. Update Firestore indexes as needed
4. Review admin actions monthly
5. Audit user accounts quarterly

### Best Practices
1. Always test in incognito first
2. Keep firebaseConfig secure but backed up
3. Document any custom changes
4. Monitor Firebase Console regularly
5. Keep security rules up to date

### Backup Strategy
1. Export all data monthly
2. Save firebaseConfig separately
3. Document owner credentials securely
4. Keep copy of index.html
5. Screenshot Firebase rules

---

## ✅ Issue Resolved?

If your issue is resolved:
- [ ] Document what fixed it
- [ ] Check if it needs prevention
- [ ] Update this guide if new issue
- [ ] Test thoroughly before closing

If issue persists:
- [ ] Reviewed all relevant sections above
- [ ] Checked Firebase Console thoroughly
- [ ] Tested in different browser
- [ ] Collected error messages
- [ ] Ready to ask for help with details

**Remember:** 99% of issues are related to:
1. Firestore Security Rules (50%)
2. Firebase Configuration (30%)
3. User Authentication Status (15%)
4. Storage Rules (5%)

Always check these first!
