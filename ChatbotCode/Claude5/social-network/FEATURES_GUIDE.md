# Feature Reference Guide

## ✅ All Features Implemented

This document explains all the features in your social network and how to use them.

## 🔐 Authentication Features

### User Registration
- Users can register with email and password
- Optional referral code during registration
- Password must be at least 6 characters

### User Login
- Email and password login
- "Remember me" checkbox - keeps users logged in even after closing browser
- Session-only login (uncheck "Remember me") - logs out when browser closes

### Admin Login
- Separate login page for admins
- Accessible from main login page
- Requires admin or owner role in database

### Password Reset
- "Forgot password" link on login page
- Sends password reset email
- Users can create new password via email link

## 🏠 Welcome Page (Public)

### Public Access Features
- Visible to non-registered users
- Search functionality to find users on the platform
- View public parts of user profiles (name, location)
- Must register/login to add friends or post

## 📱 Main Feed

### Post Creation
- Text posts up to 280 characters
- Character counter shows remaining characters
- Emoji support in posts 📸✨
- Optional image attachment
- Toggle "Friends only" to restrict visibility

### Viewing Posts
- Posts appear in reverse chronological order (newest first)
- See all public posts
- See friends-only posts from your friends
- Post shows author name, avatar, timestamp

### Post Interactions
- **Like:** Click heart button (❤️)
- **Comment:** Click comment button to expand comment section
- **Download:** Download attached images
- **Add Friend:** Button appears on posts from non-friends

### Comments
- Click comment button to view/hide comments
- Write comments on any visible post
- Comments show author name and text
- Emoji support in comments

## 👤 Profile Page

### Profile Display
- Profile banner (customizable with 4 designs)
- Profile picture (circular display)
- Display name, location (city, country)
- Post count and friend count statistics
- "About Me" section

### Photo Gallery
- Shows all images from your posts
- Click image to view full size in new tab
- Images organized in grid layout

### Post History
- All your posts displayed on profile
- Same interaction features as main feed
- Only visible to friends (respects friends-only setting)

## ⚙️ Settings Page

### Profile Settings
- Update display name
- Set age
- Set city and country
- Write "About Me" text
- Upload profile picture
- Choose profile banner design (Default, Sunset, Ocean, Forest)

### Appearance Settings
- Choose theme: Light, Dark, or Blue
- Theme persists across sessions
- Immediately applied when changed

### Referral System
- View your unique referral code
- Generate new referral codes (max 5 per month)
- View referral points (1 point per successful referral)
- Opt out of referral program (deletes all codes and points)

### Billing Information
- Update billing email
- Note: Actual payments handled by external provider
- Reference only for record-keeping

### Data & Privacy
- **Download My Data:** Get JSON file with all your data
- **Delete Account:** Permanently delete account and all data
  - Requires two confirmations
  - Deletes all posts, profile, and authentication

## 👥 Friends Page

### My Friends
- Grid display of all friends
- Shows profile picture, name, age, location
- "Remove Friend" button for each friend

### Friend Suggestions
- Recommends users based on mutual friends
- Shows users you're not friends with yet
- "Add Friend" button for each suggestion

### Friend Management
- Add friends from feed, search, or suggestions
- Remove friends anytime
- Friends see your friends-only posts
- Can send private messages to friends

## 💬 Messages Page

### Conversations List
- Shows all friends you can message
- Click to open conversation
- Selected conversation highlighted

### Message Display
- Messages shown in chronological order
- Your messages appear on right (purple background)
- Received messages on left (gray background)
- Not real-time (refresh to see new messages)

### Sending Messages
- Type message in input box
- Click "Send" button
- Only friends can message each other
- Messages are private (only sender and receiver can see)

## 🔍 Search Page

### User Search
- Search by display name or email
- Results show as you type
- Shows profile picture, name, location
- "Add Friend" or "Remove Friend" button based on current status

## 👨‍💼 Admin Page (Admins Only)

### User Management
- View all users in table format
- Shows name, email, and role
- Delete user accounts
- Admins can manage any user

### Post Moderation
- View all posts from all users
- Delete inappropriate posts
- Full post interaction (like, comment)

### Access Requirements
- Must have `role: admin` or `role: owner` in database
- Separate login page for security

## 👑 Owner Page (Owner Only)

### Statistics Dashboard
- Total number of users
- Total number of posts
- Total number of admins

### Owner Controls
- Export all data (users and posts) as JSON
- Permanent access protection
- Even if email changes or password forgotten

### Access Requirements
- Only user with `role: owner` can access
- Set during initial setup (Step 7 in deployment guide)

## 🎨 Theme System

### Available Themes
1. **Light Theme:** White background, dark text
2. **Dark Theme:** Dark background, light text
3. **Blue Theme:** Blue tints throughout

### Theme Features
- Applied to all pages
- Saved in user preferences
- Persists across sessions and devices

## 🎫 Referral System

### How It Works
1. Each user has a unique referral code (first 8 chars of User ID)
2. Users can generate custom referral codes
3. Maximum 5 codes per month
4. When someone registers with your code, you get 1 point
5. Can opt-out anytime (deletes codes and points)

### Referral Codes
- Share codes with friends
- Friends enter code during registration
- You automatically get credited
- View all your codes in Settings

## 📊 Data Management

### Download Your Data
- JSON file format
- Contains:
  - All profile information
  - All your posts
  - All metadata
- Can be imported elsewhere or kept as backup

### Account Deletion
- Two-step confirmation required
- Deletes:
  - All posts
  - All comments
  - Profile data
  - Authentication account
- **Cannot be undone!**

## 🔒 Security Features

### Password Security
- Minimum 6 characters required
- Password reset via email
- Passwords encrypted by Firebase

### Owner Account Protection
- Owner role cannot be removed
- Multiple recovery options:
  - Password reset
  - Original email always works
  - Manual database access if needed

### Privacy Controls
- Friends-only posts
- Private messages (only sender/receiver)
- Profile visibility controlled per field
- Admin moderation available

## 📏 Limits & Quotas

### Post Limits
- 280 characters per post (like Twitter)
- Unlimited posts per user
- Image size limited by Firebase Storage (5MB recommended)

### Referral Limits
- 5 new codes per month per user
- Unlimited points accumulation
- Unlimited code usage

### Friend Limits
- Unlimited friends
- Unlimited messages

### Firebase Free Tier
- 1 GB Firestore storage
- 5 GB file storage
- 50,000 document reads per day
- 20,000 document writes per day
- Unlimited authentication

For 50 users: **Well within all limits!**

## 🐛 Common Issues & Solutions

### "Can't see my friends' posts"
- Make sure you're friends with them
- Check if they marked post as "Friends only"
- Refresh the feed

### "Image won't upload"
- Check file size (keep under 5MB)
- Check file format (JPG, PNG, GIF, WEBP only)
- Check internet connection

### "Can't add friend"
- Make sure you're logged in
- Check if already friends
- Try refreshing page

### "Messages not appearing"
- Messages aren't real-time
- Refresh the page to see new messages
- Make sure you're friends with the person

### "Lost access to account"
- Use "Forgot Password" on login page
- Check email for reset link
- Contact admin if needed

## 💡 Tips & Best Practices

### For Users
1. Use meaningful display names
2. Add profile picture for better recognition
3. Fill out "About Me" section
4. Use friend-only posts for private content
5. Regular password changes for security

### For Admins
1. Check admin page daily for moderation
2. Be fair when deleting content
3. Communicate with users before deletion
4. Keep owner contact information secure

### For Owner
1. Regular data exports (weekly recommended)
2. Monitor Firebase usage in console
3. Check statistics for growth trends
4. Keep backup of owner credentials
5. Review admin actions periodically

## 📞 Support Contacts

- Firebase Documentation: https://firebase.google.com/docs
- Firebase Console: https://console.firebase.google.com/
- Your website administrator: [Your contact info]

---

## 🎉 Enjoy Your Social Network!

All 100% of your requirements have been implemented:
✅ Authentication with remember me
✅ Welcome page with public search
✅ Profile pages with galleries
✅ Settings with themes and customization
✅ Main feed with posts, comments, likes
✅ Search functionality
✅ Friends list with suggestions
✅ Private messages (DMs)
✅ Admin page with moderation
✅ Owner page with statistics
✅ Billing information management
✅ Referral system with limits
✅ Data download and account deletion
✅ 280 character limit
✅ Emoji support
✅ Image attachments
✅ Friends-only posts
✅ Profile customization
✅ Password reset

**Everything works and is deployed!**
