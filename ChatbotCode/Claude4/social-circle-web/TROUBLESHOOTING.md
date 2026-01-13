# Social Circle - Troubleshooting Guide

Common issues and their solutions.

## Firebase Setup Issues

### Error: "Firebase: Firebase App named '[DEFAULT]' already exists"

**Cause:** Firebase is being initialized multiple times.

**Solution:**
1. Check that config.js only has one `firebase.initializeApp()` call
2. Make sure you're not loading Firebase scripts twice in index.html
3. Clear browser cache and reload

### Error: "Firebase: Error (auth/invalid-api-key)"

**Cause:** Incorrect Firebase configuration.

**Solution:**
1. Go to Firebase Console → Project Settings
2. Copy the exact configuration from "Your apps" section
3. Replace ALL values in config.js (don't mix old and new values)
4. Make sure there are no extra spaces or quotes
5. Redeploy

### Error: "Firebase: Configuration object is invalid"

**Cause:** Missing or incorrect fields in firebaseConfig.

**Solution:**
Check your config.js has ALL these fields:
```javascript
const firebaseConfig = {
    apiKey: "...",
    authDomain: "...",
    projectId: "...",
    storageBucket: "...",
    messagingSenderId: "...",
    appId: "..."
};
```

## Authentication Issues

### Can't Register New Account

**Error:** "Firebase: Password should be at least 6 characters (auth/weak-password)"

**Solution:** Use a password with 6 or more characters.

---

**Error:** "Firebase: The email address is already in use (auth/email-already-in-use)"

**Solution:** 
1. Try logging in instead of registering
2. Use password reset if you forgot password
3. Use a different email address

---

**Error:** "Firebase: The email address is badly formatted (auth/invalid-email)"

**Solution:** 
1. Check email format (must have @ and domain)
2. No spaces before or after email
3. Use a valid email address

### Can't Login

**Error:** "Firebase: There is no user record (auth/user-not-found)"

**Solution:**
1. Check email spelling
2. Make sure you registered this email
3. Check Firebase Console → Authentication → Users to verify account exists

---

**Error:** "Firebase: The password is invalid (auth/wrong-password)"

**Solution:**
1. Check password is correct
2. Passwords are case-sensitive
3. Try password reset if forgotten

---

**Problem:** Login works but redirects to welcome page

**Solution:**
1. Check browser console (F12) for errors
2. Verify Firestore user document was created
3. Clear browser cache and cookies
4. Try incognito/private mode

### "Remember Me" Not Working

**Solution:**
1. Check that checkbox is checked before login
2. Don't use incognito/private browsing mode
3. Check browser isn't blocking cookies
4. Try a different browser

### Password Reset Email Not Received

**Solution:**
1. Check spam/junk folder
2. Wait 5-10 minutes
3. Verify email address is correct
4. Check Firebase Console → Authentication → Templates to ensure email is enabled
5. Try sending again

## Firestore/Database Issues

### Error: "Missing or insufficient permissions"

**Cause:** Security rules preventing access.

**Solution:**
1. Go to Firebase Console → Firestore Database → Rules
2. Verify rules are published (see SETUP_GUIDE.md for correct rules)
3. Click "Publish" if you made changes
4. Wait 1-2 minutes for rules to propagate
5. Refresh your app

### Posts Not Showing in Feed

**Possible Causes:**

1. **Friends-only post and not friends**
   - Solution: Add user as friend or make post public

2. **Firestore read permissions**
   - Check Firestore rules allow read: if true for posts

3. **No posts exist**
   - Create a test post

4. **JavaScript error**
   - Open console (F12) and check for errors
   - Fix any reported errors

### Can't Create Posts

**Error in console:** "Permission denied"

**Solution:**
1. Verify you're logged in
2. Check Firestore rules allow authenticated users to create posts
3. Clear cache and try again

---

**Problem:** Post button doesn't work

**Solution:**
1. Check console (F12) for JavaScript errors
2. Verify content is not empty (or image is selected)
3. Try refreshing page
4. Check you're not exceeding 280 character limit

### User Data Not Loading

**Solution:**
1. Check browser console for errors
2. Verify user document exists in Firestore Console
3. Check document has required fields (name, email, uid, etc.)
4. Manually add missing fields in Firestore Console

## Storage/Image Upload Issues

### Images Won't Upload

**Error:** "Firebase Storage: User does not have permission"

**Solution:**
1. Go to Firebase Console → Storage → Rules
2. Verify storage rules are set (see SETUP_GUIDE.md)
3. Click "Publish" if changed
4. Wait 1-2 minutes

---

**Error:** "The file exceeds the maximum size"

**Solution:**
1. Image might be too large (try under 5MB)
2. Compress image before uploading
3. Use JPG instead of PNG for photos

---

**Problem:** Upload seems to work but image doesn't show

**Solution:**
1. Check browser console for URL errors
2. Verify image was uploaded in Firebase Console → Storage
3. Check storage security rules allow read access
4. Try a different image format

### Profile Picture Won't Change

**Solution:**
1. Check file is an image (JPG, PNG, GIF, WebP)
2. Check file size (under 10MB)
3. Verify Storage is enabled
4. Check storage rules
5. Clear browser cache
6. Try a different image

## UI/Display Issues

### Theme Not Changing

**Solution:**
1. Refresh the page
2. Try logging out and back in
3. Check browser console for errors
4. Clear browser cache
5. Try different browser

### Page Looks Broken/Unstyled

**Cause:** CSS not loading

**Solution:**
1. Check styles.css is in same folder as index.html
2. Hard refresh (Ctrl+Shift+R or Cmd+Shift+R)
3. Check browser console for 404 errors
4. Verify file name is exactly "styles.css"
5. Redeploy if using Firebase Hosting

### Navigation Not Working

**Solution:**
1. Check JavaScript console for errors
2. Verify app.js loaded correctly
3. Clear browser cache
4. Make sure you're logged in (some pages require auth)

### Modal Won't Close

**Solution:**
1. Click the X button in top right
2. Click outside the modal
3. Press Escape key
4. Refresh the page if stuck

## Feature-Specific Issues

### Friends

**Can't Add Friends:**
- Verify you're logged in
- Check Firestore rules allow writing to friends collection
- Try different user
- Check console for errors

**Friends Not Showing:**
- Verify friends were actually added (check Firestore)
- Check friends collection has 'list' array
- Refresh page

**Can't Remove Friends:**
- Check console for errors
- Verify you have permission (should be your own friends list)
- Try refreshing

### Messages

**Messages Not Showing:**
- Refresh the page (messages aren't real-time)
- Check you selected a conversation
- Verify you're friends with the person
- Check Firestore for messages collection

**Can't Send Messages:**
- Must be friends with recipient
- Check you're logged in
- Verify message isn't empty
- Check console for errors

### Search

**Search Not Working:**
- Enter at least 2 characters
- Check Firestore has users
- Verify Firestore rules allow reading users
- Try different search terms

**No Results:**
- Try shorter search terms
- Search is case-insensitive
- Verify users exist in database
- Try just searching "a" to see all users

### Admin Page

**Can't See Admin Link:**
- Verify isAdmin field is true in your user document
- Check Firestore Console → users → your document
- Add field if missing: `isAdmin: true` (boolean)
- Refresh page after changing

**Admin Features Not Working:**
- Check you're actually an admin
- Verify Firestore rules allow admin operations
- Check console for permission errors

### Owner Page

**Can't See Owner Link:**
- Verify your email matches the owner email in app.js
- Check line ~119 in app.js
- Must be exact match (case-sensitive)
- Redeploy after changing

**Statistics Not Loading:**
- Check Firestore rules allow reading all collections
- Verify collections have documents
- Check console for errors

## Deployment Issues

### Firebase Deploy Fails

**Error:** "Error: Failed to get Firebase project"

**Solution:**
1. Run `firebase login` again
2. Select correct project with `firebase use --add`
3. Make sure you're in correct directory
4. Check internet connection

---

**Error:** "Error: HTTP Error: 403, Permission Denied"

**Solution:**
1. Check you're logged in: `firebase login`
2. Verify you own this project
3. Check you have editor/owner role in project

---

**Error:** "firebase: command not found"

**Solution:**
1. Install Firebase CLI: `npm install -g firebase-tools`
2. Restart terminal/command prompt
3. Check Node.js is installed

### Website Not Loading After Deploy

**Solution:**
1. Wait 1-2 minutes for deployment to complete
2. Hard refresh (Ctrl+Shift+R)
3. Clear browser cache
4. Try incognito mode
5. Check hosting URL is correct
6. Verify all files were deployed

### Changes Not Showing After Redeploy

**Solution:**
1. Wait 1-2 minutes
2. Hard refresh in browser
3. Clear browser cache
4. Try incognito mode
5. Check you deployed from correct directory
6. Verify files were changed before deploying

## Performance Issues

### Site Loading Slowly

**Possible Causes:**
1. Too many posts loading at once
   - Limit is 50, should be fine
   - Consider pagination if needed

2. Large images
   - Compress images before upload
   - Use JPG instead of PNG

3. Slow internet connection
   - Test on different network
   - Check Firebase status

### Images Loading Slowly

**Solution:**
1. Compress images before uploading
2. Use smaller image sizes
3. Check internet speed
4. Consider using a CDN

### Database Operations Slow

**Solution:**
1. Check Firebase Console for any issues
2. Verify you're within free tier limits
3. Add Firestore indexes if needed
4. Consider upgrading to paid tier

## Browser-Specific Issues

### Safari Issues

**Problem:** Some features not working

**Solution:**
1. Update Safari to latest version
2. Check "Prevent cross-site tracking" isn't blocking Firebase
3. Try different browser to confirm it's Safari-specific
4. Clear Safari cache and data

### Internet Explorer

**Problem:** Site doesn't work

**Solution:**
- Internet Explorer is not supported
- Use Chrome, Firefox, Safari, or Edge instead

### Mobile Browser Issues

**Problem:** Features not working on phone

**Solution:**
1. Make sure you're using a modern browser (Chrome, Safari)
2. Clear mobile browser cache
3. Try desktop mode
4. Use portrait orientation for best experience
5. Update your browser app

## Data Issues

### Lost Data After Account Deletion

**Problem:** Accidentally deleted account

**Solution:**
- Data cannot be recovered after deletion
- This is intentional for privacy
- Restore from backup if you have one
- Prevention: Ask "are you sure" before deleting

### Posts Disappeared

**Possible Causes:**
1. Accidentally deleted
2. Admin/owner deleted
3. Changed to friends-only and not friends
4. Firestore document was deleted

**Solution:**
- Check Firestore Console to see if document exists
- Restore from backup if available
- No other recovery method

## Console Error Messages

### "Cannot read property 'uid' of null"

**Cause:** Trying to access current user when not logged in

**Solution:**
1. Make sure you're logged in
2. Check auth state is initialized
3. Verify currentUser is set

### "Uncaught (in promise) FirebaseError"

**Solution:**
1. Read the full error message
2. Usually a permissions issue
3. Check Firestore/Storage rules
4. Verify user is authenticated

### "Failed to load resource: net::ERR_BLOCKED_BY_CLIENT"

**Cause:** Ad blocker or browser extension blocking Firebase

**Solution:**
1. Disable ad blocker for your site
2. Try incognito mode
3. Whitelist your Firebase domains

## Getting More Help

### Where to Look for Answers

1. **Browser Console (F12)**
   - Shows JavaScript errors
   - Network requests and responses
   - Firebase errors

2. **Firebase Console**
   - Firestore → Data tab: See your actual data
   - Authentication → Users: See registered users
   - Storage → Files: See uploaded images
   - Rules tabs: See security rule errors

3. **Documentation**
   - SETUP_GUIDE.md: Setup instructions
   - QUICK_REFERENCE.md: Feature usage
   - README.md: Project overview

### Creating a Bug Report

If you need help, provide:
1. What you were trying to do
2. What happened instead
3. Error messages (from console)
4. Browser and version
5. Screenshots if relevant
6. Steps to reproduce

### Firebase Support

- Firebase Documentation: https://firebase.google.com/docs
- Firebase Status: https://status.firebase.google.com/
- Firebase Support: https://firebase.google.com/support
- Stack Overflow: Tag questions with "firebase"

## Prevention Tips

### Avoid Common Problems

1. **Regular Backups**
   - Export data weekly from Owner dashboard
   - Save configuration files
   - Document any customizations

2. **Test Before Deploying**
   - Always test locally first
   - Create test account for testing
   - Verify changes work before deploy

3. **Monitor Usage**
   - Check Firebase Console daily at first
   - Watch for quota limits
   - Set up budget alerts if using paid tier

4. **Keep Dependencies Updated**
   - Update Firebase SDK when available
   - Keep Node.js up to date
   - Update browser regularly

5. **Security Best Practices**
   - Keep owner/admin passwords secure
   - Don't share Firebase credentials
   - Review admin list regularly
   - Check for suspicious users/posts

---

Still having issues? Check the SETUP_GUIDE.md and README.md for additional information.
