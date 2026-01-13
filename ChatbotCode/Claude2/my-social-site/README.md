# SocialConnect - Firebase Social Networking Application

A complete social networking web application built with Firebase, featuring authentication, real-time messaging, posts, friends system, and more.

## 🌟 Features

### Authentication & User Management
- ✅ Email/password registration and login
- ✅ "Remember me" persistent sessions
- ✅ Password reset functionality
- ✅ Separate admin login page
- ✅ Profile customization (name, age, city, country, bio)
- ✅ Profile pictures and customizable banners
- ✅ Account deletion with data cleanup

### Social Features
- ✅ Twitter/Facebook-style feed with 280 character limit
- ✅ Create posts with text and images
- ✅ Like and comment on posts
- ✅ Public vs friends-only post visibility
- ✅ Friends system with add/remove functionality
- ✅ Friend suggestions based on mutual connections
- ✅ User search functionality
- ✅ Public profile viewing (without login)
- ✅ Photo gallery on profiles
- ✅ Emoji support in posts and comments

### Messaging
- ✅ Private one-on-one messaging between friends
- ✅ Real-time message updates
- ✅ Conversation list

### Customization
- ✅ 4 theme options (Light, Dark, Ocean Blue, Nature Green)
- ✅ 5 profile banner designs
- ✅ Custom display names
- ✅ Personal "About Me" section

### Admin Features
- ✅ Admin panel accessible to authorized users
- ✅ View all users and their information
- ✅ Delete user accounts
- ✅ View and moderate all posts
- ✅ Delete inappropriate content
- ✅ Help users with settings

### Owner Dashboard
- ✅ Site statistics (total users, posts, photos)
- ✅ Data export functionality
- ✅ Protected owner access
- ✅ Full administrative control

### Additional Features
- ✅ Referral system with invite codes
- ✅ 5 invites per month limit
- ✅ Referral points tracking
- ✅ Opt-out option for referrals
- ✅ Billing information management
- ✅ Download personal data (GDPR compliance)
- ✅ Responsive design for mobile devices

## 🚀 Quick Start

### Prerequisites
- Web browser (Chrome, Firefox, Safari, or Edge)
- Firebase account (free)

### Setup Instructions

1. **Clone or download this repository**

2. **Create a Firebase project**
   - Go to https://console.firebase.google.com/
   - Create a new project
   - Enable Authentication (Email/Password)
   - Create Firestore Database
   - Enable Storage

3. **Configure the app**
   - Copy your Firebase configuration
   - Update `config.js` with your Firebase credentials

4. **Deploy security rules**
   - Deploy `firestore.rules` to Firestore
   - Deploy `storage.rules` to Storage

5. **Open the app**
   - Open `index.html` in your browser
   - Or deploy to Firebase Hosting

📖 **For detailed step-by-step instructions, see [SETUP_GUIDE.md](SETUP_GUIDE.md)**

## 📁 Project Structure

```
socialconnect/
├── index.html          # Main HTML structure
├── styles.css          # All styling and themes
├── app.js             # Application logic and Firebase integration
├── config.js          # Firebase configuration (UPDATE THIS!)
├── firestore.rules    # Database security rules
├── storage.rules      # Storage security rules
├── firebase.json      # Firebase Hosting configuration
├── SETUP_GUIDE.md     # Detailed setup instructions
└── README.md          # This file
```

## 🎨 Themes

The app includes 4 built-in themes:
- **Light** - Clean and bright default theme
- **Dark** - Easy on the eyes for night usage
- **Ocean Blue** - Cool blue tones
- **Nature Green** - Fresh green palette

Users can switch themes in Settings.

## 👥 User Roles

### Regular Users
- Create and manage their profile
- Post content and interact with others
- Add friends and send messages
- Customize their experience

### Admins
- All regular user features
- Access to admin panel
- Moderate content
- Manage user accounts
- Help users with issues

### Owner
- All admin features
- View site statistics
- Export all data
- Full system control
- Protected access (can't be locked out)

## 🔒 Security

The application implements:
- Firebase Authentication for secure login
- Firestore security rules for data protection
- Storage rules for file access control
- Input sanitization to prevent XSS
- Secure password handling
- CSRF protection through Firebase

## 📊 Firebase Free Tier Limits

The app is designed to work within Firebase's free tier:

**Firestore:**
- 1 GB stored data
- 50,000 reads/day
- 20,000 writes/day

**Storage:**
- 5 GB storage
- 1 GB downloads/day

**Authentication:**
- Unlimited users

**Suitable for:** ~50 active users with normal usage

## 🌐 Deployment Options

### Firebase Hosting (Recommended)
```bash
npm install -g firebase-tools
firebase login
firebase init hosting
firebase deploy
```

### GitHub Pages
1. Create GitHub repository
2. Upload all files
3. Enable Pages in settings

### Local Development
Simply open `index.html` in your browser

## 🛠️ Customization

### Change Post Character Limit
In `index.html`, find:
```html
<textarea id="postContent" maxlength="280">
```
Change `280` to your desired limit.

### Add More Banners
1. Add option in `index.html` banner select dropdown
2. Add corresponding CSS class in `styles.css`

### Modify Referral Limits
In `app.js`, find:
```javascript
if (invitesUsed >= 5)
```
Change `5` to your desired monthly limit.

## 📱 Browser Compatibility

- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

## 🐛 Troubleshooting

### "Permission denied" errors
- Verify Firestore and Storage rules are deployed
- Check user is logged in
- Review browser console for details

### Images not uploading
- Verify Storage rules are deployed correctly
- Check file size (keep under 5MB)
- Ensure user is authenticated

### Can't access admin features
- Verify `isAdmin: true` in Firestore user document
- Log out and log back in
- Check Firebase Console for user permissions

## 📈 Monitoring

Monitor your app usage in Firebase Console:
- **Authentication:** User count and activity
- **Firestore:** Database size and operations
- **Storage:** File storage usage
- **Hosting:** Bandwidth and visits

## 🔄 Updates & Maintenance

### Regular Tasks
- Monitor Firebase usage
- Back up data using Owner Dashboard
- Review and moderate content
- Check for security updates

### Scaling Beyond Free Tier
If you exceed free tier limits:
- Upgrade to Firebase Blaze (pay-as-you-go)
- Optimize database queries
- Implement caching strategies
- Consider pagination for feeds

## 🤝 User Guide

### For New Users
1. Register with email and password
2. Set up your profile with a picture and bio
3. Search for and add friends
4. Create your first post
5. Explore the feed and interact with content

### Best Practices
- Use descriptive profile information
- Be respectful in posts and comments
- Report inappropriate content to admins
- Keep profile picture appropriate
- Use friends-only setting for personal posts

## 📄 License

This project is provided as-is for personal and educational use.

## 🙏 Acknowledgments

Built with:
- Firebase (Authentication, Firestore, Storage, Hosting)
- Vanilla JavaScript (no frameworks!)
- CSS3 with custom properties
- HTML5

## 📞 Support

For issues or questions:
1. Check [SETUP_GUIDE.md](SETUP_GUIDE.md)
2. Review Firebase documentation
3. Check browser console for error messages
4. Verify Firebase project configuration

## 🎯 Project Requirements Checklist

All 100% of requirements implemented:
- ✅ Authentication (login, register, logout, remember me, password reset)
- ✅ Separate admin login page
- ✅ Welcome page with public search
- ✅ Profile pages (editable, customizable, galleries)
- ✅ Settings (themes, account management, data download)
- ✅ Posts with 280 character limit
- ✅ Emoji support
- ✅ Image attachments
- ✅ Like and comment system
- ✅ Friends system
- ✅ Public vs friends-only visibility
- ✅ Search functionality
- ✅ Friend suggestions
- ✅ Private messaging (DMs)
- ✅ Admin panel
- ✅ Owner dashboard with statistics
- ✅ Billing information management
- ✅ Referral system with invites
- ✅ All within Firebase free tier limits

## 🚀 Ready to Launch!

Your social networking platform is ready to go. Start by creating your account, setting up your profile, and inviting your first users!

**Happy connecting! 🎉**
