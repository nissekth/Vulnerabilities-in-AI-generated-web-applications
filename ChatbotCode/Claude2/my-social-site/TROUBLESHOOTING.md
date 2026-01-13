# Troubleshooting Checklist

Use this checklist to diagnose and fix common issues. Work through each section relevant to your problem.

## 🚫 Website Won't Load at All

### Check These First:
- [ ] Is `index.html` in the same folder as all other files?
- [ ] Did you open `index.html` (not `config.js` or another file)?
- [ ] Is your internet connection working?
- [ ] Try a different web browser
- [ ] Try clearing your browser cache (Ctrl+Shift+Delete)

### Still Not Working?
- [ ] Right-click `index.html` → Properties → Unblock (Windows)
- [ ] Try moving all files to your Desktop and opening from there
- [ ] Make sure no file names were changed

---

## 🔐 Can't Create Account / Login Issues

### "User not found" or "Wrong password"
- [ ] Double-check email address (no typos?)
- [ ] Double-check password (case-sensitive!)
- [ ] Try the "Forgot Password" link
- [ ] Check if CapsLock is ON

### "Email already in use"
- [ ] This email already has an account - use "Sign In" instead
- [ ] Or use the "Forgot Password" to reset

### "Weak password"
- [ ] Password must be at least 6 characters
- [ ] Try a longer, stronger password

### Account Created But Can't Login
1. Go to Firebase Console → Authentication
2. Check if your email appears in the user list
3. If not there, try registering again
4. If there, verify email is spelled correctly

### Still Having Login Issues?
- [ ] Check Firebase Console → Authentication is enabled
- [ ] Verify Email/Password provider is turned ON (should be blue)
- [ ] Check browser console (F12) for error messages

---

## 📝 Can't Create Posts

### "Permission denied" Error
- [ ] Are you logged in?
- [ ] Did you deploy Firestore rules? (Step 11 in setup)
- [ ] Try logging out and back in

### Posts Don't Appear After Creating
- [ ] Refresh the page (F5)
- [ ] Check Feed section (click "Feed" in navigation)
- [ ] Check Firebase Console → Firestore → "posts" collection

### Can't Add Images to Posts
- [ ] Check image file size (must be under 5MB)
- [ ] Use supported formats: JPG, PNG, GIF, WEBP
- [ ] Did you deploy Storage rules? (Step 12 in setup)
- [ ] Check browser console (F12) for errors

---

## 👥 Friend System Not Working

### Can't Find Users in Search
- [ ] Make sure other users have registered
- [ ] Try searching by exact name
- [ ] Check spelling
- [ ] Search is case-insensitive but must match

### Can't Add Friends
- [ ] Both users must be registered
- [ ] Try refreshing the page
- [ ] Check if already friends
- [ ] Check browser console for errors

### Friends List Empty
- [ ] Have you added any friends yet?
- [ ] Navigate to Friends section (click "Friends")
- [ ] Try adding a friend first

---

## 💬 Messages Not Working

### Can't Send Messages
- [ ] Are you friends with this person?
- [ ] Only friends can message each other
- [ ] Try refreshing the page
- [ ] Check internet connection

### Don't See Conversations List
- [ ] Navigate to Messages section
- [ ] Must have at least one friend first
- [ ] Click on a friend's name to start conversation

### Messages Not Appearing
- [ ] Check if you're viewing the right conversation
- [ ] Try refreshing the page
- [ ] Messages may take a few seconds to appear
- [ ] Check Firebase Console → Firestore → "messages" collection

---

## 🖼️ Image Upload Problems

### "Upload failed" Error
**Check These:**
- [ ] File size under 5MB?
- [ ] Supported format? (JPG, PNG, GIF, WEBP)
- [ ] Internet connection stable?
- [ ] Storage rules deployed?

**How to Fix:**
1. Compress image before uploading
2. Try a different image
3. Check Firebase Console → Storage for errors
4. Redeploy storage.rules

### Images Upload But Don't Display
- [ ] Wait a few seconds for URL generation
- [ ] Refresh the page
- [ ] Check browser console for errors
- [ ] Verify image URL in Firebase Console → Storage

### Gallery Not Showing Images
- [ ] Images only appear in gallery after being posted
- [ ] Navigate to profile page
- [ ] Scroll down to "Photo Gallery" section
- [ ] Try refreshing the page

---

## ⚙️ Settings & Customization Issues

### Theme Won't Change
- [ ] Select theme from dropdown
- [ ] Changes apply immediately
- [ ] Try logging out and back in
- [ ] Clear browser cache

### Profile Updates Not Saving
- [ ] Click "Save Changes" button
- [ ] Wait for "Profile updated!" message
- [ ] Check Firestore rules are deployed
- [ ] Try again with simpler data (remove special characters)

### Can't Upload Profile Picture
- [ ] Same as regular image upload issues (see above)
- [ ] Check file size and format
- [ ] Verify Storage rules deployed

---

## 👨‍💼 Admin/Owner Access Problems

### Can't See Admin/Owner Links
**Check These In Order:**
1. [ ] Go to Firebase Console → Firestore
2. [ ] Click "users" collection
3. [ ] Find YOUR user document
4. [ ] Verify these fields exist:
   - `isAdmin: true` (boolean)
   - `isOwner: true` (boolean)
5. [ ] Log out of website
6. [ ] Log back in
7. [ ] Links should now appear

### Admin Panel Empty or Not Loading
- [ ] Verify you're actually an admin (see above)
- [ ] Check if any users/posts exist
- [ ] Refresh the page
- [ ] Check browser console for errors

### Owner Dashboard Shows Zero Stats
- [ ] Create some test data first
- [ ] Wait a few seconds and refresh
- [ ] Check Firestore has data in it
- [ ] Try logging out and back in

---

## 🌐 Deployment Issues (Firebase Hosting)

### "firebase: command not found"
**Solution:**
```bash
npm install -g firebase-tools
```
If that doesn't work:
- Restart your terminal/command prompt
- Make sure Node.js is installed correctly

### "Permission denied" During Deploy
**Windows:**
- Run Command Prompt as Administrator
- Try the command again

**Mac/Linux:**
```bash
sudo npm install -g firebase-tools
```

### Deploy Succeeds But Site Not Loading
- [ ] Wait 2-3 minutes for propagation
- [ ] Clear browser cache
- [ ] Try in incognito/private window
- [ ] Check the hosting URL is correct

### "Firebase.json not found"
- [ ] Make sure you're in the correct folder
- [ ] Run `cd` to the folder containing firebase.json
- [ ] Check the file actually exists

---

## 🔍 General Debugging Steps

### When Something Doesn't Work:

1. **Check Browser Console:**
   - Press F12
   - Click "Console" tab
   - Look for red error messages
   - Google the error message

2. **Check Firebase Console:**
   - Go to Firebase Console
   - Check Authentication for user issues
   - Check Firestore for data issues
   - Check Storage for image issues
   - Look at Usage tab for quota issues

3. **Verify Configuration:**
   - [ ] config.js has correct Firebase values
   - [ ] No placeholder text like "YOUR_API_KEY_HERE"
   - [ ] All quotes and commas in correct places

4. **Check Firestore Rules:**
   - Firebase Console → Firestore → Rules tab
   - Should match content of firestore.rules file
   - Click "Publish" if you made changes

5. **Check Storage Rules:**
   - Firebase Console → Storage → Rules tab
   - Should match content of storage.rules file
   - Click "Publish" if you made changes

---

## 🆘 Still Stuck?

### Steps to Get Help:

1. **Gather Information:**
   - What were you trying to do?
   - What happened instead?
   - Any error messages? (take a screenshot)
   - Browser console errors? (F12 → Console tab)

2. **Check These Resources:**
   - [ ] BEGINNER_GUIDE.md (step-by-step instructions)
   - [ ] SETUP_GUIDE.md (detailed setup)
   - [ ] README.md (feature overview)
   - [ ] QUICK_REFERENCE.md (common tasks)

3. **Verify Setup:**
   - [ ] All files in same folder
   - [ ] config.js updated with real values
   - [ ] Firestore rules deployed
   - [ ] Storage rules deployed
   - [ ] Authentication enabled in Firebase

4. **Try Fresh Start:**
   - [ ] Log out of website
   - [ ] Close browser completely
   - [ ] Clear browser cache
   - [ ] Open browser again
   - [ ] Navigate to website
   - [ ] Log in again

5. **Check Firebase Status:**
   - Visit: https://status.firebase.google.com
   - Make sure all services are operational

---

## 💾 Data Recovery

### If You Lose Data:

**Owner Dashboard Backup:**
- Did you use "Export All Data" feature?
- Check your Downloads folder
- File named: `site-data-TIMESTAMP.json`

**Firebase Console Backup:**
- Firebase doesn't auto-backup free tier
- Data is only in Firestore Database
- Can manually export from Firebase Console

**User Data Recovery:**
- Users can download their own data
- Settings → Download My Data
- Gives them their profile and posts

---

## 🔄 Reset Options

### Reset Individual User:
1. Firebase Console → Authentication
2. Find user → Delete
3. User can register again

### Reset All Data (Start Over):
1. Firebase Console → Firestore Database
2. Delete all documents
3. Firebase Console → Storage
4. Delete all files
5. Firebase Console → Authentication
6. Delete all users

### Reset Project Completely:
1. Create new Firebase project
2. Follow setup steps again
3. Update config.js with new values
4. Deploy rules again

---

## ✅ Prevention Checklist

### To Avoid Problems:

**Before You Start:**
- [ ] Read BEGINNER_GUIDE.md completely
- [ ] Have all files in one folder
- [ ] Have Firebase account ready
- [ ] Have 30-45 minutes available

**During Setup:**
- [ ] Follow steps in exact order
- [ ] Don't skip any steps
- [ ] Verify each step before moving on
- [ ] Save backup of config values

**After Setup:**
- [ ] Test with a friend before inviting everyone
- [ ] Monitor Firebase usage weekly
- [ ] Keep backup of important data
- [ ] Update rules if Firebase suggests it

**Regular Maintenance:**
- [ ] Check Firebase Console weekly
- [ ] Export data monthly
- [ ] Monitor for abuse/spam
- [ ] Keep within free tier limits

---

## 📊 Understanding Error Messages

### Common Errors Explained:

**"Missing or insufficient permissions"**
- Means: Firestore rules not allowing the action
- Fix: Deploy firestore.rules again

**"Network request failed"**
- Means: Can't connect to Firebase
- Fix: Check internet, verify Firebase project active

**"Invalid API key"**
- Means: config.js has wrong API key
- Fix: Update config.js with correct values from Firebase

**"User not found"**
- Means: Email doesn't have an account
- Fix: Use correct email or register new account

**"QUOTA_EXCEEDED"**
- Means: Hit Firebase free tier limit
- Fix: Wait until tomorrow or upgrade plan

**"Storage quota exceeded"**
- Means: Used all 5GB of free storage
- Fix: Delete old images or upgrade plan

---

## 🎯 Quick Fixes Summary

| Problem | Quick Fix |
|---------|-----------|
| Website won't load | Check internet, try different browser |
| Can't login | Verify email/password, check Authentication enabled |
| Can't post | Log out and in, verify Firestore rules deployed |
| No images | Check file size, verify Storage rules deployed |
| No admin access | Add isAdmin field in Firestore, log out/in |
| Deploy failed | Reinstall firebase-tools, check you're in right folder |
| Slow loading | Normal for first load, should be faster after |
| Data not saving | Check Firestore rules, try logging out/in |

---

**Remember: Most problems are simple fixes!**

Take your time, work through the checklist, and you'll get it working. 💪

If you've tried everything and it still doesn't work, create a new Firebase project and start fresh. Sometimes that's the fastest solution!
