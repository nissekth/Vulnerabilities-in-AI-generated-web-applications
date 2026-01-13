# Social Circle - Architecture Overview

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        USER BROWSER                          │
│                                                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │  index.html  │  │  styles.css  │  │   app.js     │     │
│  │              │  │              │  │              │     │
│  │  Structure   │  │   Styling    │  │    Logic     │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
│                           │                                  │
│                           ▼                                  │
│                    ┌──────────────┐                         │
│                    │  config.js   │                         │
│                    │              │                         │
│                    │   Firebase   │                         │
│                    │    Config    │                         │
│                    └──────────────┘                         │
└─────────────────────────┬───────────────────────────────────┘
                          │
                          ▼
        ┌─────────────────────────────────────┐
        │         FIREBASE SERVICES            │
        │                                      │
        │  ┌────────────┐  ┌────────────┐    │
        │  │   Auth     │  │  Firestore │    │
        │  │            │  │            │    │
        │  │ User Login │  │  Database  │    │
        │  └────────────┘  └────────────┘    │
        │                                      │
        │  ┌────────────┐  ┌────────────┐    │
        │  │  Storage   │  │  Hosting   │    │
        │  │            │  │            │    │
        │  │   Images   │  │  Website   │    │
        │  └────────────┘  └────────────┘    │
        └──────────────────────────────────────┘
```

## Data Model

### Firestore Collections

```
firestore/
│
├── users/
│   └── {userId}/
│       ├── uid: string
│       ├── name: string
│       ├── displayName: string
│       ├── email: string
│       ├── age: number
│       ├── city: string
│       ├── country: string
│       ├── about: string
│       ├── profilePic: string (URL)
│       ├── banner: string
│       ├── isAdmin: boolean
│       ├── referralPoints: number
│       ├── referralOptOut: boolean
│       ├── theme: string
│       ├── billing: object
│       ├── createdAt: timestamp
│       └── lastActive: timestamp
│
├── posts/
│   └── {postId}/
│       ├── userId: string
│       ├── userName: string
│       ├── userPhoto: string (URL)
│       ├── content: string
│       ├── imageUrl: string (URL, optional)
│       ├── friendsOnly: boolean
│       ├── likes: array of userIds
│       ├── timestamp: timestamp
│       │
│       └── comments/ (subcollection)
│           └── {commentId}/
│               ├── userId: string
│               ├── userName: string
│               ├── text: string
│               └── timestamp: timestamp
│
├── friends/
│   └── {userId}/
│       └── list: array of userIds
│
├── messages/
│   └── {messageId}/
│       ├── conversationId: string
│       ├── senderId: string
│       ├── receiverId: string
│       ├── text: string
│       └── timestamp: timestamp
│
├── gallery/
│   └── {itemId}/
│       ├── userId: string
│       ├── imageUrl: string (URL)
│       ├── postContent: string
│       └── timestamp: timestamp
│
└── inviteCodes/
    └── {code}/
        ├── code: string
        ├── createdBy: string (userId)
        ├── createdAt: timestamp
        ├── used: boolean
        ├── usedBy: string (userId, optional)
        └── usedAt: timestamp (optional)
```

### Storage Structure

```
storage/
│
├── profilePics/
│   └── {userId}
│       └── profile.jpg
│
└── posts/
    └── {userId}/
        ├── {timestamp}_image1.jpg
        ├── {timestamp}_image2.jpg
        └── ...
```

## User Roles & Permissions

```
┌──────────────────────────────────────────────┐
│              USER HIERARCHY                   │
│                                              │
│  ┌────────────────────────────────────┐    │
│  │          OWNER (1 person)           │    │
│  │  - Full site access                 │    │
│  │  - View statistics                  │    │
│  │  - Export all data                  │    │
│  │  - Cannot lose access               │    │
│  │  - Has all admin powers             │    │
│  └────────────────────────────────────┘    │
│                   │                          │
│                   ▼                          │
│  ┌────────────────────────────────────┐    │
│  │      ADMINS (multiple people)       │    │
│  │  - Manage users                     │    │
│  │  - Delete posts/users               │    │
│  │  - Promote to admin                 │    │
│  │  - Moderate content                 │    │
│  │  - Has all user powers              │    │
│  └────────────────────────────────────┘    │
│                   │                          │
│                   ▼                          │
│  ┌────────────────────────────────────┐    │
│  │      USERS (everyone else)          │    │
│  │  - Create posts                     │    │
│  │  - Add friends                      │    │
│  │  - Send messages                    │    │
│  │  - Customize profile                │    │
│  │  - Change settings                  │    │
│  └────────────────────────────────────┘    │
└──────────────────────────────────────────────┘
```

## Application Flow

### User Registration Flow
```
1. User clicks "Sign Up"
   ↓
2. Enters name, email, password, (optional invite code)
   ↓
3. Firebase Auth creates account
   ↓
4. Create user document in Firestore
   ↓
5. Process invite code if provided
   ↓
6. Redirect to main app
```

### Post Creation Flow
```
1. User writes post content
   ↓
2. (Optional) Select image
   ↓
3. (Optional) Check "Friends only"
   ↓
4. Upload image to Storage (if selected)
   ↓
5. Create post document in Firestore
   ↓
6. Add image to gallery collection (if image)
   ↓
7. Refresh feed to show new post
```

### Messaging Flow
```
1. User selects friend from list
   ↓
2. Opens conversation
   ↓
3. Loads messages from Firestore
   ↓
4. User types and sends message
   ↓
5. Message saved to Firestore
   ↓
6. Messages display in thread
```

## Security Model

### Firestore Security Rules
```
Users Collection:
- Read: Anyone (public profiles)
- Write: Only the user themselves

Posts Collection:
- Read: Anyone
- Create: Any authenticated user
- Update/Delete: Post owner OR admin

Friends Collection:
- Read: Authenticated users
- Write: Only owner of the friends list

Messages Collection:
- Read/Write: Only sender and receiver

Gallery Collection:
- Read: Anyone
- Write: Only the owner

Invite Codes:
- Read: Authenticated users
- Write: Any authenticated user (with limits)
```

### Storage Security Rules
```
Profile Pictures:
- Read: Anyone
- Write: Only the user themselves

Post Images:
- Read: Anyone
- Write: Only the image owner
```

## Page Structure

```
Application Pages:

├── Welcome Page (Not Logged In)
│   ├── Hero section
│   ├── Login/Register buttons
│   └── Public user search
│
└── Main App (Logged In)
    ├── Navigation Bar
    │   ├── Feed
    │   ├── Profile
    │   ├── Friends
    │   ├── Messages
    │   ├── Search
    │   ├── Settings
    │   ├── Admin (if admin)
    │   └── Owner (if owner)
    │
    ├── Feed Page
    │   ├── Create post form
    │   └── Post feed
    │
    ├── Profile Page
    │   ├── Profile header
    │   ├── About section
    │   ├── Posts tab
    │   └── Gallery tab
    │
    ├── Friends Page
    │   ├── Friends list
    │   └── Suggested friends
    │
    ├── Messages Page
    │   ├── Conversations list
    │   └── Message thread
    │
    ├── Search Page
    │   ├── Search input
    │   └── Results grid
    │
    ├── Settings Page
    │   ├── Theme settings
    │   ├── Display name
    │   ├── Referral program
    │   ├── Billing info
    │   └── Account management
    │
    ├── Admin Page (Admin Only)
    │   ├── Users list
    │   ├── Admins list
    │   └── Posts moderation
    │
    └── Owner Page (Owner Only)
        ├── Statistics
        └── Data export
```

## Technology Stack

```
Frontend:
├── HTML5
│   └── Semantic structure
├── CSS3
│   ├── CSS Variables (theming)
│   ├── Flexbox & Grid
│   └── Animations
└── JavaScript (ES6+)
    ├── Vanilla JS (no frameworks)
    ├── Async/Await
    └── Modern DOM manipulation

Backend (Firebase):
├── Authentication
│   └── Email/Password
├── Firestore
│   ├── Real-time database
│   └── Document-based
├── Storage
│   └── File hosting
└── Hosting
    └── Static site hosting

Build/Deploy:
├── Firebase CLI
└── Node.js (for CLI only)
```

## Features Matrix

```
┌─────────────────────┬─────────┬─────────┬─────────┐
│     Feature         │  User   │  Admin  │  Owner  │
├─────────────────────┼─────────┼─────────┼─────────┤
│ Create Posts        │    ✓    │    ✓    │    ✓    │
│ Like/Comment        │    ✓    │    ✓    │    ✓    │
│ Add Friends         │    ✓    │    ✓    │    ✓    │
│ Send Messages       │    ✓    │    ✓    │    ✓    │
│ Customize Profile   │    ✓    │    ✓    │    ✓    │
│ Search Users        │    ✓    │    ✓    │    ✓    │
│ Change Theme        │    ✓    │    ✓    │    ✓    │
│ Referral System     │    ✓    │    ✓    │    ✓    │
│ Download Data       │    ✓    │    ✓    │    ✓    │
├─────────────────────┼─────────┼─────────┼─────────┤
│ Delete Any Post     │    ✗    │    ✓    │    ✓    │
│ Delete Users        │    ✗    │    ✓    │    ✓    │
│ Promote to Admin    │    ✗    │    ✓    │    ✓    │
│ View All Users      │    ✗    │    ✓    │    ✓    │
├─────────────────────┼─────────┼─────────┼─────────┤
│ View Statistics     │    ✗    │    ✗    │    ✓    │
│ Export All Data     │    ✗    │    ✗    │    ✓    │
│ Never Lose Access   │    ✗    │    ✗    │    ✓    │
└─────────────────────┴─────────┴─────────┴─────────┘
```

## Scaling Considerations

### Current Capacity (Free Tier)
- **Users**: 50-100 active users
- **Posts**: ~500-1000 posts/day
- **Storage**: ~1000 images
- **Reads**: 50,000/day
- **Writes**: 20,000/day

### To Scale Beyond Free Tier
```
Option 1: Firebase Blaze (Pay-as-you-go)
- Scales automatically
- Pay only for what you use
- ~$25/month for 500 users

Option 2: Add Features
- Caching for common queries
- Pagination for feeds
- Image compression
- Rate limiting

Option 3: Optimize
- Index frequently queried fields
- Batch operations
- Reduce real-time listeners
- CDN for images
```

## Performance Optimizations

### Implemented
- CSS-only animations where possible
- Lazy loading of images
- Limited feed to 50 posts
- Compressed profile pictures
- Efficient Firestore queries
- Minimal JavaScript libraries

### Future Improvements
- Service Worker for offline support
- Virtual scrolling for long feeds
- Progressive image loading
- Query result caching
- WebP image format
- Code splitting

## Maintenance Tasks

### Daily (First Week)
- Check Firebase Console usage
- Review new user registrations
- Check for errors in console
- Monitor post quality

### Weekly
- Export data backup
- Review admin actions
- Check storage usage
- Update documentation

### Monthly
- Review Firebase costs (if paid)
- Update dependencies
- Analyze user statistics
- Plan new features

---

This architecture supports:
- ✅ 50+ concurrent users
- ✅ Free tier operation
- ✅ Easy maintenance
- ✅ Simple customization
- ✅ Clear upgrade path
