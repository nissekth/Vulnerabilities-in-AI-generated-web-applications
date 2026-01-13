# Social Circle - Social Media Web Application

A complete, feature-rich social media platform built with Firebase. Perfect for small communities and friend groups.

## Features

### 🔐 Authentication
- Email/password registration and login
- "Remember me" functionality
- Password reset via email
- Separate admin login capability
- Persistent sessions

### 👤 User Profiles
- Customizable profile pages with banners
- Profile pictures
- Personal information (name, age, city, country)
- "About me" section
- Personal photo gallery
- Albums for organizing photos

### 📱 Social Features
- Create posts (up to 280 characters)
- Emoji support in posts and comments
- Attach images to posts
- Like and comment on posts
- Friends-only posts option
- Public and friends-only content visibility

### 👥 Friends System
- Add and remove friends
- Friend suggestions based on mutual connections
- Friends list page with user details
- Search and add friends from anywhere

### 💬 Direct Messaging
- One-to-one private conversations
- Message friends directly
- Persistent message history

### 🔍 Search
- Search users by name, city, or country
- Public search for non-logged-in users
- Add friends directly from search results

### 🎨 Customization
- 5 different themes (Default, Dark, Sunset, Forest, Lavender)
- Customizable display names
- 5 different profile banner styles
- Theme preferences saved per user

### 🎫 Referral System
- Generate invite codes (5 per month)
- Earn points for successful referrals
- Track code usage
- Opt-out option available

### 🛡️ Admin Features
- View all users and admins
- Promote users to admin
- Delete users
- Moderate and delete posts
- View user details

### 👑 Owner Dashboard
- View site statistics (total users, posts, active users)
- Export all site data
- Special protected access
- Never lose access to the site

### ⚙️ Settings
- Update profile information
- Change display name
- Manage billing information
- Download personal data
- Delete account option

### 💳 Billing Management
- Add/update billing information
- Ready for payment integration
- Separate from actual payment processing

## Tech Stack

- **Frontend**: HTML5, CSS3, JavaScript (Vanilla)
- **Backend**: Firebase
  - Authentication
  - Cloud Firestore (Database)
  - Cloud Storage (Images)
  - Hosting
- **No frameworks**: Pure JavaScript for easy customization

## File Structure

```
social-circle/
│
├── index.html          # Main HTML structure
├── styles.css          # All styling and themes
├── config.js           # Firebase configuration
├── app.js              # All application logic
├── SETUP_GUIDE.md      # Complete setup instructions
├── README.md           # This file
└── QUICK_REFERENCE.md  # Feature usage guide
```

## Quick Start

See `SETUP_GUIDE.md` for complete step-by-step instructions. Basic steps:

1. Create Firebase project
2. Enable Authentication, Firestore, and Storage
3. Update `config.js` with your Firebase credentials
4. Set your owner email in `app.js`
5. Deploy with Firebase Hosting or run locally

## Firebase Free Tier Support

This application is designed to work within Firebase's free tier limits:

- ✅ Up to 50-100 active users
- ✅ 50,000 document reads/day
- ✅ 20,000 document writes/day
- ✅ 1 GB Firestore storage
- ✅ 5 GB Cloud Storage
- ✅ Unlimited authentication users

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Features by User Role

### Regular Users Can:
- Create and manage their profile
- Post content (text and images)
- Like and comment on posts
- Add friends and send messages
- Search for other users
- Customize their experience with themes
- Refer new users
- Download their data

### Admins Can (in addition to above):
- View all users and admins
- Delete users
- Promote users to admin
- Moderate all posts
- Delete any post or comment

### Owner Can (in addition to all above):
- View site-wide statistics
- Export all site data
- Cannot lose access (even with email change)

## Security Features

- Server-side security rules
- Protected admin and owner pages
- Private messages encryption
- Secure file uploads
- Session management
- CSRF protection

## Customization

### Change Colors
Edit CSS variables in `styles.css`:
```css
:root {
    --primary-color: #2563eb;
    --secondary-color: #8b5cf6;
    /* ... */
}
```

### Add New Themes
1. Add theme colors to CSS
2. Add option to theme select in HTML
3. Update theme map in `app.js`

### Modify Character Limit
Change in HTML:
```html
<textarea maxlength="280">
```

And in JavaScript validation if needed.

## Privacy & Data

- Users can download all their data as JSON
- Account deletion removes all user data
- Friends-only posts are properly restricted
- Private messages are truly private

## Known Limitations

- Messages are not real-time (refresh required)
- No video support
- No group messaging
- No push notifications
- Photos limited to images (no videos)

## Future Enhancement Ideas

- Real-time messaging with Firebase Realtime Database
- Push notifications
- Video post support
- Group chats
- Story/status features
- Advanced search filters
- User blocking
- Report system

## Support

For setup help, see `SETUP_GUIDE.md`

For feature usage, see `QUICK_REFERENCE.md`

For Firebase questions: https://firebase.google.com/support

## License

This project is provided as-is for personal or commercial use.

## Credits

Built with Firebase and vanilla JavaScript. No external frameworks or libraries (except Firebase SDK).

---

Made with ❤️ for building communities
