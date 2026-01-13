# Quick Reference Card

## 🔥 Essential Firebase Console Links

- **Main Console**: https://console.firebase.google.com/
- **Authentication**: console.firebase.google.com/project/YOUR_PROJECT/authentication
- **Firestore**: console.firebase.google.com/project/YOUR_PROJECT/firestore
- **Storage**: console.firebase.google.com/project/YOUR_PROJECT/storage
- **Usage & Billing**: console.firebase.google.com/project/YOUR_PROJECT/usage

## ⚡ Quick Commands

### Deploy Everything
```bash
firebase deploy
```

### Deploy Only Hosting
```bash
firebase deploy --only hosting
```

### Deploy Only Rules
```bash
firebase deploy --only firestore:rules,storage:rules
```

### Test Locally
```bash
firebase serve
```

### Login to Firebase
```bash
firebase login
```

## 🔑 Making Someone an Admin

1. Go to Firestore Database
2. Open the `users` collection
3. Find the user's document
4. Click "Add field"
5. Field: `isAdmin`, Type: `boolean`, Value: `true`

## 👑 Making Someone the Owner

1. Go to Firestore Database
2. Open the `users` collection
3. Find the user's document
4. Add field: `isOwner`, Type: `boolean`, Value: `true`
5. Add field: `isAdmin`, Type: `boolean`, Value: `true`

## 🚨 Emergency Access Recovery

If you lose access to your owner account:

1. Go to Firebase Console → Authentication
2. Find your account by email
3. Click the three dots → "Reset password"
4. Or manually add `isOwner: true` back in Firestore

## 📊 Check Current Usage

Firebase Console → Your Project → Usage and billing

Key metrics to watch:
- Firestore reads/writes
- Storage usage
- Bandwidth

## 🐛 Common Error Solutions

### Error: "Missing or insufficient permissions"
**Fix**: Deploy firestore.rules and storage.rules

### Error: "Network error"
**Fix**: Check Firebase project is active in console

### Error: "User not authenticated"
**Fix**: User needs to log in first

### Error: "Storage quota exceeded"
**Fix**: Delete old images or upgrade plan

## 🎨 Customization Quick Edits

### Change Post Character Limit
**File**: `index.html`
**Line**: Find `maxlength="280"`
**Change**: To your desired number

### Change Referral Invite Limit
**File**: `app.js`
**Find**: `if (invitesUsed >= 5)`
**Change**: `5` to your desired number

### Add New Theme
**File**: `styles.css`
**Add**:
```css
[data-theme="mytheme"] {
    --primary-color: #yourcolor;
    --background: #yourcolor;
    /* ... more colors */
}
```

### Add New Banner
**File**: `styles.css`
**Add**:
```css
.profile-banner.gradient6 {
    background: linear-gradient(135deg, #color1, #color2);
}
```
**File**: `index.html`
**Add**: `<option value="gradient6">My Banner</option>`

## 📱 Test User Scenarios

### Test Normal User
1. Register new account
2. Create profile
3. Make a post
4. Search for users
5. Add friend

### Test Admin
1. Register account
2. Make admin in Firestore
3. Log out and back in
4. Check admin panel appears
5. Test deleting a post

### Test Owner
1. Log in as owner
2. Check owner dashboard
3. View statistics
4. Try exporting data

## 🔒 Security Checklist

- [ ] Firestore rules deployed
- [ ] Storage rules deployed
- [ ] Owner account has isOwner: true
- [ ] config.js has real Firebase credentials
- [ ] No sensitive data in public repos
- [ ] HTTPS enabled (if using custom domain)

## 📈 Growth Milestones

### 10 Users
- Monitor daily usage
- Check for any errors

### 25 Users
- Review Firestore query efficiency
- Monitor storage usage

### 50 Users (Free Tier Limit)
- Consider Firebase Blaze plan
- Optimize database queries
- Implement pagination

## 🆘 Support Resources

- **Firebase Docs**: https://firebase.google.com/docs
- **Firebase Status**: https://status.firebase.google.com
- **Stack Overflow**: Tag `firebase`

## 💾 Backup Schedule

Recommended backup frequency:

- **Daily**: During heavy development
- **Weekly**: For stable production
- **Before major changes**: Always

Use Owner Dashboard → "Export All Data"

## 🎯 Performance Tips

1. **Optimize Images**: Compress before upload
2. **Limit Feed**: Already limited to 50 posts
3. **Pagination**: Consider for >100 posts
4. **Indexes**: Firebase will suggest if needed

## 📞 Emergency Contacts

**Your Info** (Fill this out!):
- Firebase Project ID: _______________
- Owner Email: _______________
- Recovery Email: _______________
- Admin Emails: _______________

## ✅ Pre-Launch Checklist

- [ ] Firebase project created
- [ ] All authentication methods enabled
- [ ] Database created
- [ ] Storage enabled
- [ ] Rules deployed
- [ ] config.js updated
- [ ] Owner account created
- [ ] Owner has isOwner and isAdmin fields
- [ ] Test user can register
- [ ] Test posts work
- [ ] Test images upload
- [ ] Test messaging works
- [ ] Site deployed to hosting

---

## 🎉 You're Ready!

Keep this file handy for quick reference as you manage your site.

**Pro Tip**: Bookmark your Firebase Console project URL for quick access!
