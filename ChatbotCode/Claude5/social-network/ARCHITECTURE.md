# System Architecture

## Overview

This document explains how your social network is structured and how all the pieces work together.

## Architecture Diagram (Text-based)

```
┌─────────────────────────────────────────────────────────────────┐
│                         USERS / BROWSERS                         │
│                    (Chrome, Firefox, Safari)                     │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             │ HTTPS
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                      YOUR WEBSITE                                │
│                      (index.html)                                │
│                                                                   │
│  ┌─────────────┐  ┌──────────────┐  ┌───────────────┐          │
│  │    HTML     │  │     CSS      │  │  JavaScript   │          │
│  │  (Pages)    │  │  (Styling)   │  │   (Logic)     │          │
│  └─────────────┘  └──────────────┘  └───────────────┘          │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             │ Firebase SDKs
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                     FIREBASE SERVICES                            │
│                                                                   │
│  ┌──────────────────┐  ┌──────────────────┐  ┌───────────────┐ │
│  │  Authentication  │  │    Firestore     │  │    Storage    │ │
│  │   (Identity)     │  │   (Database)     │  │    (Files)    │ │
│  └──────────────────┘  └──────────────────┘  └───────────────┘ │
│                                                                   │
│  ┌──────────────────┐                                            │
│  │     Hosting      │                                            │
│  │  (Web Server)    │                                            │
│  └──────────────────┘                                            │
└─────────────────────────────────────────────────────────────────┘
```

## Components Explained

### 1. Frontend (index.html)

**What it is:**
- Single HTML file with embedded CSS and JavaScript
- Runs entirely in user's browser
- No server-side code needed

**What it does:**
- Displays pages (Welcome, Login, Feed, Profile, etc.)
- Handles user interactions (clicks, form submissions)
- Communicates with Firebase services
- Updates display based on data

**Key Features:**
- Responsive design (works on all devices)
- Theme support (Light, Dark, Blue)
- Real-time UI updates
- Form validation

### 2. Firebase Authentication

**What it is:**
- Google's authentication service
- Handles user accounts and sessions

**What it does:**
- Creates user accounts
- Verifies passwords
- Manages login sessions
- Sends password reset emails
- Handles "Remember me" functionality

**Security:**
- Passwords are hashed (never stored plain text)
- Industry-standard encryption
- Session tokens expire automatically
- Protection against brute force attacks

### 3. Firestore Database

**What it is:**
- NoSQL cloud database
- Document-oriented storage
- Real-time synchronization

**Collections Structure:**
```
firestore/
├── users/
│   └── {userId}/
│       ├── email: string
│       ├── displayName: string
│       ├── role: string
│       ├── age: number
│       ├── city: string
│       ├── country: string
│       ├── about: string
│       ├── profilePicture: string (URL)
│       ├── banner: string
│       ├── theme: string
│       ├── friends: array
│       ├── referralPoints: number
│       ├── referralCodes: array
│       ├── billingEmail: string
│       └── createdAt: timestamp
│
├── posts/
│   └── {postId}/
│       ├── userId: string
│       ├── userName: string
│       ├── userAvatar: string (URL)
│       ├── text: string
│       ├── imageUrl: string (URL)
│       ├── friendsOnly: boolean
│       ├── likes: array
│       ├── comments: array
│       │   └── [
│       │       {
│       │         userId: string,
│       │         userName: string,
│       │         text: string,
│       │         createdAt: timestamp
│       │       }
│       │     ]
│       └── createdAt: timestamp
│
└── messages/
    └── {messageId}/
        ├── conversationId: string
        ├── senderId: string
        ├── receiverId: string
        ├── text: string
        └── createdAt: timestamp
```

**Why This Structure:**
- Easy to query (find posts by user, messages by conversation)
- Efficient for small-medium scale (up to millions of documents)
- Simple to understand and maintain
- No complex relationships needed

### 4. Firebase Storage

**What it is:**
- Cloud file storage service
- Like Google Drive for your app

**Directory Structure:**
```
storage/
├── posts/
│   └── {userId}/
│       └── {timestamp}_{filename}.jpg
│
└── profiles/
    └── {userId}/
        └── {filename}.jpg
```

**What it stores:**
- Profile pictures
- Post images
- Any uploaded files

**Features:**
- Automatic backup
- CDN delivery (fast worldwide)
- Secure URLs
- Automatic image optimization

### 5. Firebase Hosting

**What it is:**
- Web hosting service
- Serves your index.html file

**What it provides:**
- HTTPS (secure connection)
- Global CDN (fast loading)
- Custom domains (optional)
- Automatic scaling

**URL Structure:**
```
https://your-project.web.app/
or
https://your-project.firebaseapp.com/
```

## Data Flow Examples

### Example 1: User Creates a Post

```
1. User types text and selects image
   ↓
2. JavaScript validates (≤280 chars)
   ↓
3. Image uploaded to Storage
   ├─ Storage returns image URL
   └─ Takes 1-3 seconds
   ↓
4. Post document created in Firestore
   ├─ Includes text, imageUrl, userId, timestamp
   └─ Takes <1 second
   ↓
5. Feed refreshes automatically
   ↓
6. All users see new post
```

### Example 2: User Logs In

```
1. User enters email and password
   ↓
2. Firebase Authentication verifies
   ├─ Checks if user exists
   └─ Verifies password hash
   ↓
3. If "Remember me" checked:
   ├─ Session token stored in browser
   └─ Lasts indefinitely (until logout)
   │
   If "Remember me" unchecked:
   ├─ Session token stored in memory
   └─ Expires when browser closes
   ↓
4. User document loaded from Firestore
   ↓
5. UI updates (show navbar, load feed)
```

### Example 3: Friend Request

```
1. User A clicks "Add Friend" on User B's profile
   ↓
2. JavaScript reads User A's friends array
   ↓
3. Adds User B's ID to array
   ↓
4. Updates User A's document in Firestore
   ↓
5. Feed refreshes
   ↓
6. User A can now see User B's friends-only posts
```

### Example 4: Password Reset

```
1. User clicks "Forgot Password"
   ↓
2. Enters email address
   ↓
3. Firebase Authentication sends email
   ├─ Email contains secure reset link
   └─ Link expires in 1 hour
   ↓
4. User clicks link in email
   ↓
5. Firebase opens password reset page
   ↓
6. User enters new password
   ↓
7. Password updated
   ↓
8. User can login with new password
```

## Security Model

### How Security Works

```
┌─────────────┐
│   Request   │ ← User tries to do something
└──────┬──────┘
       │
       ▼
┌─────────────────────────┐
│ Authentication Check    │ ← Is user logged in?
│ (Firebase Auth)         │
└──────┬──────────────────┘
       │
       ▼
┌─────────────────────────┐
│ Authorization Check     │ ← Is user allowed?
│ (Firestore Rules)       │
└──────┬──────────────────┘
       │
       ▼
┌─────────────┐
│   Allowed   │ ← Action proceeds
└─────────────┘
```

### Security Rules Logic

**Firestore Rules:**
```javascript
// Users Collection
Read: Anyone (for public profiles)
Create: Only authenticated users (for their own profile)
Update: Only owner or admins
Delete: Only owner or admins

// Posts Collection
Read: Anyone (public or friends)
Create: Only authenticated users
Update: Only post author or admins
Delete: Only post author or admins

// Messages Collection
Read: Only sender or receiver
Create: Only authenticated users (to friends)
Update: Only sender
Delete: Only sender
```

**Storage Rules:**
```javascript
// Profile Pictures
Read: Anyone
Write: Only the user (for their own folder)

// Post Images
Read: Anyone
Write: Only the user (for their own folder)
```

### Role-Based Access

```
Owner (role: "owner")
├── All admin permissions
├── View statistics
├── Export all data
├── Permanent access
└── Cannot be removed

Admin (role: "admin")
├── Delete any user
├── Delete any post
├── View all data
└── Moderate content

User (role: "user" or no role)
├── Create posts
├── Update own profile
├── Message friends
└── Standard features
```

## Performance Considerations

### Firestore Queries

**Efficient Queries:**
```javascript
// Get posts ordered by date (indexed)
posts.orderBy('createdAt', 'desc').limit(50)

// Get user's posts
posts.where('userId', '==', userId)

// Get messages in conversation
messages.where('conversationId', '==', id).orderBy('createdAt')
```

**Why Limit 50 Posts:**
- Loads quickly (< 1 second)
- Uses minimal quota
- Enough for scrolling
- Can implement pagination later

### Caching

**What's Cached:**
- Firebase SDK caches:
  - User authentication state
  - Recently accessed documents
  - Storage download URLs

**Benefits:**
- Faster page loads
- Works offline (limited)
- Reduces quota usage

### Image Optimization

**Recommendations:**
- Maximum 5MB per image
- JPEG for photos
- PNG for graphics
- WebP for best compression

**What Happens:**
1. User uploads image
2. Stored in Firebase Storage
3. Storage serves optimized version
4. CDN caches globally
5. Fast loading worldwide

## Scalability

### Current Setup (50 users)

**Resources Used:**
```
Firestore:
- ~500 reads/day
- ~100 writes/day
- ~10 MB storage

Storage:
- ~50 MB files
- ~100 MB bandwidth/day

Authentication:
- 50 users (unlimited)
```

**Free Tier Limits:**
```
Firestore:
- 50,000 reads/day ✅ (100x headroom)
- 20,000 writes/day ✅ (200x headroom)
- 1 GB storage ✅ (100x headroom)

Storage:
- 5 GB total ✅ (100x headroom)
- 1 GB downloads/day ✅ (10x headroom)
```

### Growth Path

**500 Users:**
- Still within free tier
- ~5,000 reads/day
- ~1,000 writes/day
- ~100 MB storage
- Consider monitoring

**5,000 Users:**
- Upgrade to Blaze plan
- ~50,000 reads/day
- ~10,000 writes/day
- ~1 GB storage
- Cost: ~$50-100/month

**50,000 Users:**
- Blaze plan required
- ~500,000 reads/day
- ~100,000 writes/day
- ~10 GB storage
- Cost: ~$500-1000/month
- Consider Firebase Extensions
- Implement caching strategies

## Backup & Recovery

### Automatic Backups

**What Firebase Backs Up:**
- All Firestore data (automatically)
- All Storage files (automatically)
- Authentication users (automatically)

**Backup Frequency:**
- Continuous replication
- Multiple data centers
- 99.99% uptime guarantee

### Manual Backups

**Owner Can Export:**
- User data (JSON)
- Posts data (JSON)
- Download via Owner page

**Recommended Schedule:**
- Export weekly
- Keep 4 backups
- Store offline

### Recovery Scenarios

**Lost Password:**
- Use "Forgot Password"
- Firebase sends reset email
- Owner never loses access

**Deleted Data:**
- Cannot restore from Firebase
- Use manual backups
- Prevention is key

**Project Deleted:**
- Firebase keeps 30-day backup
- Contact Firebase support
- Why you need exports

## Monitoring

### What to Monitor

**Daily:**
- User registrations
- New posts
- Error messages (console)

**Weekly:**
- Firebase quota usage
- Storage growth
- Unusual activity

**Monthly:**
- User growth trends
- Feature usage
- Cost (if on Blaze)

### Where to Monitor

**Firebase Console:**
```
Authentication → Users → Total count
Firestore → Usage → Read/write counts
Storage → Usage → Space used
```

**Website:**
```
Owner Page → Statistics
Admin Page → User list
Browser Console → Errors (F12)
```

## Troubleshooting Flow

```
Problem Reported
      ↓
Check Browser Console
      ↓
   Errors?
      ↓
  Yes → Note error message
      ↓
Check Firebase Console
      ↓
   Service down? Quota exceeded?
      ↓
  No → Check Security Rules
      ↓
   Rules correct?
      ↓
  Yes → Check User Authentication
      ↓
   Logged in? Correct role?
      ↓
  Yes → Check Network Tab
      ↓
   Requests failing?
      ↓
  No → Clear cache and retry
      ↓
   Still broken?
      ↓
  Review Troubleshooting Guide
```

## Best Practices

### Development
1. Test in incognito mode
2. Check console for errors
3. Verify Firebase status
4. One change at a time
5. Document customizations

### Security
1. Never share credentials
2. Regular password updates
3. Monitor admin actions
4. Review security rules
5. Keep backups current

### Performance
1. Optimize images before upload
2. Limit queries (use pagination)
3. Cache when possible
4. Monitor quota usage
5. Clean old data periodically

### User Experience
1. Clear error messages
2. Loading indicators
3. Responsive design
4. Intuitive navigation
5. Help documentation

## Summary

Your social network is:
- **Simple:** One HTML file
- **Secure:** Firebase authentication & rules
- **Scalable:** Handles thousands of users
- **Reliable:** 99.99% uptime
- **Fast:** Global CDN delivery
- **Free:** $0 for 50-500 users

All components work together seamlessly to provide a professional, feature-rich social networking experience!
