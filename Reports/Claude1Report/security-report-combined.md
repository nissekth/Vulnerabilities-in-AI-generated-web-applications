# Security Assessment Report

**Application:** Social Media App  
**Target:** https://claude1-f630a.web.app  
**Date:** 2025-12-15T16:08:46.097Z  
**Duration:** 100s

## Summary

| Severity | Count |
|----------|-------|
| CRITICAL | 6 |
| HIGH | 20 |
| MEDIUM | 33 |
| LOW | 5 |

**Risk Score:** 231 (CRITICAL)


### Deduplication Summary

| Metric | Value |
|--------|-------|
| Original Findings | 1076 |
| After Deduplication | 731 |
| Duplicates Removed | 345 |
| Reduction | 32% |

## Findings

### A01: Broken Access Control

#### CRITICAL: Authorization Bypass - No Owner Verification

- **CWE:** CWE-285 (Improper Authorization)
- **Tool:** static-analysis

**Description:**
Rule only checks authentication, not authorization. Any authenticated user can modify any document.

**Evidence:**
```
{
  "rule": "allow update: if request.auth != null;"
}
```


#### CRITICAL: Document Creation with Arbitrary ID

- **CWE:** CWE-566 (Unknown)
- **Tool:** firebase-emulator

**Description:**
Users can create documents with any ID, potentially overwriting or impersonating other users.

**Evidence:**
```
{
  "detail": "alice123 created/overwrote document at /users/admin789"
}
```


#### CRITICAL: Improper Authorization: Cross-User Profile Modification

- **CWE:** CWE-285 (Unknown)
- **Tool:** live-scanner
- **Status:** ✅ Confirmed by live testing

**Description:**
User 1f9Oi7FYVcbV0YGYDfl3hbsCbEo2 modified user 7kO2isk0XUZe0PuytBO7iSqaLrB2's profile

**Evidence:**
```
{
  "attacker": "1f9Oi7FYVcbV0YGYDfl3hbsCbEo2",
  "victim": "7kO2isk0XUZe0PuytBO7iSqaLrB2",
  "modified": "bio"
}
```


#### CRITICAL: Privilege Escalation: Self-Elevation to Admin

- **CWE:** CWE-269 (Unknown)
- **Tool:** live-scanner
- **Status:** ✅ Confirmed by live testing

**Description:**
User successfully set their own isAdmin flag to true

**Evidence:**
```
{
  "userId": "1f9Oi7FYVcbV0YGYDfl3hbsCbEo2",
  "before": false,
  "after": true
}
```


#### HIGH: client-side-isadmin

- **CWE:** CWE-863 (Incorrect Authorization)
- **Tool:** semgrep

**Description:**
Client-side admin check. CWE-863

**Evidence:**
```
{
  "file": "/home/nillof/Exjobb/Claude1/social-media-app/src/App.jsx",
  "line": 32,
  "endLine": 32,
  "code": "return currentUser && userProfile?.isAdmin ? children : <Navigate to=\"/\" />;"
}
```


#### HIGH: client-side-isadmin

- **CWE:** CWE-863 (Incorrect Authorization)
- **Tool:** semgrep

**Description:**
Client-side admin check. CWE-863

**Evidence:**
```
{
  "file": "/home/nillof/Exjobb/Claude1/social-media-app/src/components/PostCard.jsx",
  "line": 109,
  "endLine": 109,
  "code": "const isAdmin = userProfile?.isAdmin;"
}
```


#### HIGH: client-side-isadmin

- **CWE:** CWE-863 (Incorrect Authorization)
- **Tool:** semgrep

**Description:**
Client-side admin check. CWE-863

**Evidence:**
```
{
  "file": "/home/nillof/Exjobb/Claude1/social-media-app/src/pages/AdminLoginPage.jsx",
  "line": 24,
  "endLine": 24,
  "code": "if (userDoc.exists() && userDoc.data().isAdmin) {"
}
```


#### HIGH: client-side-isadmin

- **CWE:** CWE-863 (Incorrect Authorization)
- **Tool:** semgrep

**Description:**
Client-side admin check. CWE-863

**Evidence:**
```
{
  "file": "/home/nillof/Exjobb/Claude1/social-media-app/src/pages/AdminPage.jsx",
  "line": 147,
  "endLine": 147,
  "code": "user.isAdmin ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'"
}
```


#### HIGH: client-side-isadmin

- **CWE:** CWE-863 (Incorrect Authorization)
- **Tool:** semgrep

**Description:**
Client-side admin check. CWE-863

**Evidence:**
```
{
  "file": "/home/nillof/Exjobb/Claude1/social-media-app/src/pages/AdminPage.jsx",
  "line": 149,
  "endLine": 149,
  "code": "{user.isAdmin ? 'Admin' : 'User'}"
}
```


#### HIGH: client-side-isadmin

- **CWE:** CWE-863 (Incorrect Authorization)
- **Tool:** semgrep

**Description:**
Client-side admin check. CWE-863

**Evidence:**
```
{
  "file": "/home/nillof/Exjobb/Claude1/social-media-app/src/pages/AdminPage.jsx",
  "line": 154,
  "endLine": 154,
  "code": "onClick={() => handleToggleAdmin(user.id, user.isAdmin)}"
}
```


#### HIGH: client-side-isadmin

- **CWE:** CWE-863 (Incorrect Authorization)
- **Tool:** semgrep

**Description:**
Client-side admin check. CWE-863

**Evidence:**
```
{
  "file": "/home/nillof/Exjobb/Claude1/social-media-app/src/pages/AdminPage.jsx",
  "line": 157,
  "endLine": 157,
  "code": "{user.isAdmin ? 'Remove Admin' : 'Make Admin'}"
}
```


#### HIGH: IDOR Vulnerability on User Profiles

- **CWE:** CWE-639 (IDOR)
- **Tool:** firebase-emulator

**Description:**
Users can access other users' profiles by simply changing the document ID in the request.

**Evidence:**
```
{
  "detail": "alice123 accessed bob456's profile by changing document ID"
}
```


#### HIGH: Improper Access Control: Unauthenticated User Data Access

- **CWE:** CWE-284 (Unknown)
- **Tool:** live-scanner
- **Status:** ✅ Confirmed by live testing

**Description:**
9 user profiles readable without authentication

**Evidence:**
```
{
  "userCount": 9,
  "exposedFields": [
    "banner",
    "theme",
    "createdAt",
    "gallery",
    "friendRequests",
    "referralPoints",
    "referralsUsed",
    "referralOptOut",
    "displayName",
    "referralCode",
    "country",
    "profilePicture",
    "name",
    "friends",
    "isAdmin",
    "email",
    "uid",
    "colorScheme",
    "city",
    "bio",
    "age",
    "isOwner"
  ],
  "sensitiveFields": [
    "friendRequests",
    "referralCode",
    "country",
    "friends",
    "email",
    "city",
    "age"
  ]
}
```


#### HIGH: Message Injection Possible

- **CWE:** CWE-284 (Improper Access Control)
- **Tool:** static-analysis

**Description:**
Message creation does not validate that sender is in participants list

**Evidence:**
```
{
  "collection": "messages"
}
```


#### HIGH: Message Injection: Create Messages Between Other Users

- **CWE:** CWE-284 (Unknown)
- **Tool:** live-scanner
- **Status:** ✅ Confirmed by live testing

**Description:**
Attacker created a message appearing to be between other users without being a participant

**Evidence:**
```
{
  "messageId": "4G7veM5vgGjFrpLe22Ol",
  "spoofedSender": "7kO2isk0XUZe0PuytBO7iSqaLrB2",
  "recipient": "Jc11AFr5hMPMFhGY3Rg2IvaRGNr2"
}
```


#### HIGH: Missing Authorization on User Document Creation

- **CWE:** CWE-862 (Missing Authorization)
- **Tool:** firebase-emulator

**Description:**
Users can create user documents with arbitrary IDs, potentially impersonating other users.

**Evidence:**
```
{
  "detail": "alice123 created document at /users/impersonated-user"
}
```


#### HIGH: Missing Creator Validation

- **CWE:** CWE-862 (Missing Authorization)
- **Tool:** static-analysis
- **Duplicate Count:** 3

**Description:**
Create operation only requires authentication. Should validate resource data matches authenticated user.

**Evidence:**
```
{
  "rule": "allow create: if request.auth != null;"
}
```


#### HIGH: Sender ID Spoofing in Messages

- **CWE:** CWE-863 (Incorrect Authorization)
- **Tool:** firebase-emulator

**Description:**
Users can create messages with a senderId that doesn't match their authentication.

**Evidence:**
```
{
  "detail": "alice123 created message with senderId: bob456"
}
```


#### HIGH: Unauthenticated Read Access to User Data

- **CWE:** CWE-284 (Improper Access Control)
- **Tool:** firebase-emulator

**Description:**
Firestore rules allow unauthenticated users to read user documents. This exposes potentially sensitive user information to anyone.

**Evidence:**
```
{
  "detail": "Unauthenticated read on /users/{userId} succeeded"
}
```


#### HIGH: Unrestricted Read Access

- **CWE:** CWE-284 (Improper Access Control)
- **Tool:** static-analysis
- **Duplicate Count:** 2

**Description:**
Rule allows anyone to read data without authentication

**Evidence:**
```
{
  "rule": "allow read: if true"
}
```


#### HIGH: User Enumeration via Collection Listing

- **CWE:** CWE-200 (Exposure of Sensitive Information)
- **Tool:** firebase-emulator

**Description:**
Unauthenticated users can list/enumerate user documents, exposing user data.

**Evidence:**
```
{
  "detail": "Unauthenticated list query on /users succeeded"
}
```


#### MEDIUM: Draft Content Exposed to Other Users

- **CWE:** CWE-668 (Unknown)
- **Tool:** firebase-emulator

**Description:**
Unpublished/draft content is accessible to users other than the author.

**Evidence:**
```
{
  "detail": "bob456 accessed alice123's draft posts"
}
```


#### MEDIUM: firebase-no-auth-deletedoc

- **CWE:** CWE-284 (Improper Access Control)
- **Tool:** semgrep

**Description:**
Firestore deleteDoc without auth check. CWE-284

**Evidence:**
```
{
  "file": "/home/nillof/Exjobb/Claude1/social-media-app/src/components/PostCard.jsx",
  "line": 92,
  "endLine": 92,
  "code": "await deleteDoc(doc(db, 'posts', post.id));"
}
```


#### MEDIUM: firebase-no-auth-deletedoc

- **CWE:** CWE-284 (Improper Access Control)
- **Tool:** semgrep

**Description:**
Firestore deleteDoc without auth check. CWE-284

**Evidence:**
```
{
  "file": "/home/nillof/Exjobb/Claude1/social-media-app/src/pages/AdminPage.jsx",
  "line": 40,
  "endLine": 40,
  "code": "await deleteDoc(doc(db, 'users', userId));"
}
```


#### MEDIUM: firebase-no-auth-deletedoc

- **CWE:** CWE-284 (Improper Access Control)
- **Tool:** semgrep

**Description:**
Firestore deleteDoc without auth check. CWE-284

**Evidence:**
```
{
  "file": "/home/nillof/Exjobb/Claude1/social-media-app/src/pages/AdminPage.jsx",
  "line": 42,
  "endLine": 42,
  "code": "await Promise.all(userPosts.map(p => deleteDoc(doc(db, 'posts', p.id))));"
}
```


#### MEDIUM: firebase-no-auth-deletedoc

- **CWE:** CWE-284 (Improper Access Control)
- **Tool:** semgrep

**Description:**
Firestore deleteDoc without auth check. CWE-284

**Evidence:**
```
{
  "file": "/home/nillof/Exjobb/Claude1/social-media-app/src/pages/AdminPage.jsx",
  "line": 55,
  "endLine": 55,
  "code": "await deleteDoc(doc(db, 'posts', postId));"
}
```


#### MEDIUM: firebase-no-auth-deletedoc

- **CWE:** CWE-284 (Improper Access Control)
- **Tool:** semgrep

**Description:**
Firestore deleteDoc without auth check. CWE-284

**Evidence:**
```
{
  "file": "/home/nillof/Exjobb/Claude1/social-media-app/src/pages/SettingsPage.jsx",
  "line": 87,
  "endLine": 87,
  "code": "await deleteDoc(doc(db, 'users', currentUser.uid));"
}
```


#### MEDIUM: firebase-no-auth-setdoc

- **CWE:** CWE-284 (Improper Access Control)
- **Tool:** semgrep

**Description:**
Firestore setDoc without auth check. CWE-284

**Evidence:**
```
{
  "file": "/home/nillof/Exjobb/Claude1/social-media-app/src/contexts/AuthContext.jsx",
  "line": 33,
  "endLine": 54,
  "code": "await setDoc(doc(db, 'users', user.uid), {\n      uid: user.uid,\n      email: email,\n      displayName: displayName,\n      name: displayName,\n      age: null,\n      city: '',\n      country: '',\n      bio: '',\n      profilePicture: '',\n      banner: 'gradient1',\n      theme: 'default',\n      colorScheme: 'rose',\n      friends: [],\n      friendRequests: [],\n      referralCode: generateReferralCode(),\n      referralPoints: 0,\n      referralsUsed: 0,\n      referralOptOut: false,\n      createdAt: serverTimestamp(),\n      isAdmin: false\n    });"
}
```


#### MEDIUM: IDOR: User Enumeration

- **CWE:** CWE-639 (Unknown)
- **Tool:** live-scanner
- **Status:** ✅ Confirmed by live testing

**Description:**
Authenticated user can enumerate and access all user profiles

**Evidence:**
```
{
  "usersAccessible": 9
}
```


#### MEDIUM: Unauthenticated Read Access to Posts

- **CWE:** CWE-284 (Improper Access Control)
- **Tool:** firebase-emulator

**Description:**
Posts are readable without authentication. Consider if this is intentional for public content.

**Evidence:**
```
{
  "detail": "Unauthenticated read on /posts/{postId} succeeded"
}
```


#### LOW: Cookie Missing SameSite Attribute

- **CWE:** CWE-1275 (Unknown)
- **Tool:** browser-scanner
- **Duplicate Count:** 3

**Description:**
Cookie "_ga_QNY21XMFM0" lacks proper SameSite attribute

**Evidence:**
```
{
  "url": "https://claude1-f630a.web.app/"
}
```


#### INFO: Content Security Policy (CSP) Header Not Set

- **CWE:** CWE-693 (Unknown)
- **Tool:** browser-scanner

**Description:**
Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks, including Cross Site Scripting (XSS) and data injection attacks. These attacks are used for everything from data theft to site defacement or distribution of malware. CSP provides a set of standard HTTP headers that allow website owners to declare approved sources of content that browsers should be allowed to load on that page — covered types are JavaScript, CSS, HTML frames, fonts, images and embeddable objects such as Java applets, ActiveX, audio and video files.

**Evidence:**
```
{
  "url": "https://claude1-f630a.web.app/login"
}
```


#### INFO: Content Security Policy (CSP) Header Not Set

- **CWE:** CWE-693 (Unknown)
- **Tool:** browser-scanner

**Description:**
Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks, including Cross Site Scripting (XSS) and data injection attacks. These attacks are used for everything from data theft to site defacement or distribution of malware. CSP provides a set of standard HTTP headers that allow website owners to declare approved sources of content that browsers should be allowed to load on that page — covered types are JavaScript, CSS, HTML frames, fonts, images and embeddable objects such as Java applets, ActiveX, audio and video files.

**Evidence:**
```
{
  "url": "https://claude1-f630a.web.app/"
}
```


#### INFO: Content Security Policy (CSP) Header Not Set

- **CWE:** CWE-693 (Unknown)
- **Tool:** browser-scanner

**Description:**
Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks, including Cross Site Scripting (XSS) and data injection attacks. These attacks are used for everything from data theft to site defacement or distribution of malware. CSP provides a set of standard HTTP headers that allow website owners to declare approved sources of content that browsers should be allowed to load on that page — covered types are JavaScript, CSS, HTML frames, fonts, images and embeddable objects such as Java applets, ActiveX, audio and video files.

**Evidence:**
```
{
  "url": "https://claude1-f630a.web.app/profile"
}
```


#### INFO: Content Security Policy (CSP) Header Not Set

- **CWE:** CWE-693 (Unknown)
- **Tool:** browser-scanner

**Description:**
Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks, including Cross Site Scripting (XSS) and data injection attacks. These attacks are used for everything from data theft to site defacement or distribution of malware. CSP provides a set of standard HTTP headers that allow website owners to declare approved sources of content that browsers should be allowed to load on that page — covered types are JavaScript, CSS, HTML frames, fonts, images and embeddable objects such as Java applets, ActiveX, audio and video files.

**Evidence:**
```
{
  "url": "https://claude1-f630a.web.app/settings"
}
```


#### INFO: Content Security Policy (CSP) Header Not Set

- **CWE:** CWE-693 (Unknown)
- **Tool:** browser-scanner

**Description:**
Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks, including Cross Site Scripting (XSS) and data injection attacks. These attacks are used for everything from data theft to site defacement or distribution of malware. CSP provides a set of standard HTTP headers that allow website owners to declare approved sources of content that browsers should be allowed to load on that page — covered types are JavaScript, CSS, HTML frames, fonts, images and embeddable objects such as Java applets, ActiveX, audio and video files.

**Evidence:**
```
{
  "url": "https://claude1-f630a.web.app/posts"
}
```


#### INFO: Content Security Policy (CSP) Header Not Set

- **CWE:** CWE-693 (Unknown)
- **Tool:** browser-scanner

**Description:**
Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks, including Cross Site Scripting (XSS) and data injection attacks. These attacks are used for everything from data theft to site defacement or distribution of malware. CSP provides a set of standard HTTP headers that allow website owners to declare approved sources of content that browsers should be allowed to load on that page — covered types are JavaScript, CSS, HTML frames, fonts, images and embeddable objects such as Java applets, ActiveX, audio and video files.

**Evidence:**
```
{
  "url": "https://claude1-f630a.web.app/messages"
}
```


#### INFO: Content Security Policy (CSP) Header Not Set

- **CWE:** CWE-693 (Unknown)
- **Tool:** browser-scanner

**Description:**
Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks, including Cross Site Scripting (XSS) and data injection attacks. These attacks are used for everything from data theft to site defacement or distribution of malware. CSP provides a set of standard HTTP headers that allow website owners to declare approved sources of content that browsers should be allowed to load on that page — covered types are JavaScript, CSS, HTML frames, fonts, images and embeddable objects such as Java applets, ActiveX, audio and video files.

**Evidence:**
```
{
  "url": "https://claude1-f630a.web.app/feed"
}
```


#### INFO: Content Security Policy (CSP) Header Not Set

- **CWE:** CWE-693 (Unknown)
- **Tool:** browser-scanner

**Description:**
Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks, including Cross Site Scripting (XSS) and data injection attacks. These attacks are used for everything from data theft to site defacement or distribution of malware. CSP provides a set of standard HTTP headers that allow website owners to declare approved sources of content that browsers should be allowed to load on that page — covered types are JavaScript, CSS, HTML frames, fonts, images and embeddable objects such as Java applets, ActiveX, audio and video files.

**Evidence:**
```
{
  "url": "https://claude1-f630a.web.app/__nonexistent__1765814154834_60a0fe5bc75a5"
}
```


#### INFO: Content Security Policy (CSP) Header Not Set

- **CWE:** CWE-693 (Unknown)
- **Tool:** browser-scanner

**Description:**
Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks, including Cross Site Scripting (XSS) and data injection attacks. These attacks are used for everything from data theft to site defacement or distribution of malware. CSP provides a set of standard HTTP headers that allow website owners to declare approved sources of content that browsers should be allowed to load on that page — covered types are JavaScript, CSS, HTML frames, fonts, images and embeddable objects such as Java applets, ActiveX, audio and video files.

**Evidence:**
```
{
  "url": "https://claude1-f630a.web.app/?file=..%2F..%2F..%2Fetc%2Fpasswd"
}
```


#### INFO: Content Security Policy (CSP) Header Not Set

- **CWE:** CWE-693 (Unknown)
- **Tool:** browser-scanner

**Description:**
Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks, including Cross Site Scripting (XSS) and data injection attacks. These attacks are used for everything from data theft to site defacement or distribution of malware. CSP provides a set of standard HTTP headers that allow website owners to declare approved sources of content that browsers should be allowed to load on that page — covered types are JavaScript, CSS, HTML frames, fonts, images and embeddable objects such as Java applets, ActiveX, audio and video files.

**Evidence:**
```
{
  "url": "https://claude1-f630a.web.app/?file=..%5C..%5C..%5Cwindows%5Cwin.ini"
}
```


#### INFO: Content Security Policy (CSP) Header Not Set

- **CWE:** CWE-693 (Unknown)
- **Tool:** browser-scanner

**Description:**
Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks, including Cross Site Scripting (XSS) and data injection attacks. These attacks are used for everything from data theft to site defacement or distribution of malware. CSP provides a set of standard HTTP headers that allow website owners to declare approved sources of content that browsers should be allowed to load on that page — covered types are JavaScript, CSS, HTML frames, fonts, images and embeddable objects such as Java applets, ActiveX, audio and video files.

**Evidence:**
```
{
  "url": "https://claude1-f630a.web.app/?file=....%2F%2F....%2F%2F....%2F%2Fetc%2Fpasswd"
}
```


#### INFO: Content Security Policy (CSP) Header Not Set

- **CWE:** CWE-693 (Unknown)
- **Tool:** browser-scanner

**Description:**
Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks, including Cross Site Scripting (XSS) and data injection attacks. These attacks are used for everything from data theft to site defacement or distribution of malware. CSP provides a set of standard HTTP headers that allow website owners to declare approved sources of content that browsers should be allowed to load on that page — covered types are JavaScript, CSS, HTML frames, fonts, images and embeddable objects such as Java applets, ActiveX, audio and video files.

**Evidence:**
```
{
  "url": "https://claude1-f630a.web.app/?file=..%252f..%252f..%252fetc%2Fpasswd"
}
```


#### INFO: Content Security Policy (CSP) Header Not Set

- **CWE:** CWE-693 (Unknown)
- **Tool:** browser-scanner

**Description:**
Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks, including Cross Site Scripting (XSS) and data injection attacks. These attacks are used for everything from data theft to site defacement or distribution of malware. CSP provides a set of standard HTTP headers that allow website owners to declare approved sources of content that browsers should be allowed to load on that page — covered types are JavaScript, CSS, HTML frames, fonts, images and embeddable objects such as Java applets, ActiveX, audio and video files.

**Evidence:**
```
{
  "url": "https://claude1-f630a.web.app/?path=..%2F..%2F..%2Fetc%2Fpasswd"
}
```


#### INFO: Content Security Policy (CSP) Header Not Set

- **CWE:** CWE-693 (Unknown)
- **Tool:** browser-scanner

**Description:**
Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks, including Cross Site Scripting (XSS) and data injection attacks. These attacks are used for everything from data theft to site defacement or distribution of malware. CSP provides a set of standard HTTP headers that allow website owners to declare approved sources of content that browsers should be allowed to load on that page — covered types are JavaScript, CSS, HTML frames, fonts, images and embeddable objects such as Java applets, ActiveX, audio and video files.

**Evidence:**
```
{
  "url": "https://claude1-f630a.web.app/?path=..%5C..%5C..%5Cwindows%5Cwin.ini"
}
```


#### INFO: Content Security Policy (CSP) Header Not Set

- **CWE:** CWE-693 (Unknown)
- **Tool:** browser-scanner

**Description:**
Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks, including Cross Site Scripting (XSS) and data injection attacks. These attacks are used for everything from data theft to site defacement or distribution of malware. CSP provides a set of standard HTTP headers that allow website owners to declare approved sources of content that browsers should be allowed to load on that page — covered types are JavaScript, CSS, HTML frames, fonts, images and embeddable objects such as Java applets, ActiveX, audio and video files.

**Evidence:**
```
{
  "url": "https://claude1-f630a.web.app/?path=....%2F%2F....%2F%2F....%2F%2Fetc%2Fpasswd"
}
```


#### INFO: Content Security Policy (CSP) Header Not Set

- **CWE:** CWE-693 (Unknown)
- **Tool:** browser-scanner

**Description:**
Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks, including Cross Site Scripting (XSS) and data injection attacks. These attacks are used for everything from data theft to site defacement or distribution of malware. CSP provides a set of standard HTTP headers that allow website owners to declare approved sources of content that browsers should be allowed to load on that page — covered types are JavaScript, CSS, HTML frames, fonts, images and embeddable objects such as Java applets, ActiveX, audio and video files.

**Evidence:**
```
{
  "url": "https://claude1-f630a.web.app/?path=..%252f..%252f..%252fetc%2Fpasswd"
}
```


#### INFO: Content Security Policy (CSP) Header Not Set

- **CWE:** CWE-693 (Unknown)
- **Tool:** browser-scanner

**Description:**
Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks, including Cross Site Scripting (XSS) and data injection attacks. These attacks are used for everything from data theft to site defacement or distribution of malware. CSP provides a set of standard HTTP headers that allow website owners to declare approved sources of content that browsers should be allowed to load on that page — covered types are JavaScript, CSS, HTML frames, fonts, images and embeddable objects such as Java applets, ActiveX, audio and video files.

**Evidence:**
```
{
  "url": "https://claude1-f630a.web.app/?filepath=..%2F..%2F..%2Fetc%2Fpasswd"
}
```


#### INFO: Content Security Policy (CSP) Header Not Set

- **CWE:** CWE-693 (Unknown)
- **Tool:** browser-scanner

**Description:**
Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks, including Cross Site Scripting (XSS) and data injection attacks. These attacks are used for everything from data theft to site defacement or distribution of malware. CSP provides a set of standard HTTP headers that allow website owners to declare approved sources of content that browsers should be allowed to load on that page — covered types are JavaScript, CSS, HTML frames, fonts, images and embeddable objects such as Java applets, ActiveX, audio and video files.

**Evidence:**
```
{
  "url": "https://claude1-f630a.web.app/?filepath=..%5C..%5C..%5Cwindows%5Cwin.ini"
}
```


#### INFO: Content Security Policy (CSP) Header Not Set

- **CWE:** CWE-693 (Unknown)
- **Tool:** browser-scanner

**Description:**
Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks, including Cross Site Scripting (XSS) and data injection attacks. These attacks are used for everything from data theft to site defacement or distribution of malware. CSP provides a set of standard HTTP headers that allow website owners to declare approved sources of content that browsers should be allowed to load on that page — covered types are JavaScript, CSS, HTML frames, fonts, images and embeddable objects such as Java applets, ActiveX, audio and video files.

**Evidence:**
```
{
  "url": "https://claude1-f630a.web.app/?filepath=....%2F%2F....%2F%2F....%2F%2Fetc%2Fpasswd"
}
```


#### INFO: Content Security Policy (CSP) Header Not Set

- **CWE:** CWE-693 (Unknown)
- **Tool:** browser-scanner

**Description:**
Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks, including Cross Site Scripting (XSS) and data injection attacks. These attacks are used for everything from data theft to site defacement or distribution of malware. CSP provides a set of standard HTTP headers that allow website owners to declare approved sources of content that browsers should be allowed to load on that page — covered types are JavaScript, CSS, HTML frames, fonts, images and embeddable objects such as Java applets, ActiveX, audio and video files.

**Evidence:**
```
{
  "url": "https://claude1-f630a.web.app/?filepath=..%252f..%252f..%252fetc%2Fpasswd"
}
```


#### INFO: Content Security Policy (CSP) Header Not Set

- **CWE:** CWE-693 (Unknown)
- **Tool:** browser-scanner

**Description:**
Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks, including Cross Site Scripting (XSS) and data injection attacks. These attacks are used for everything from data theft to site defacement or distribution of malware. CSP provides a set of standard HTTP headers that allow website owners to declare approved sources of content that browsers should be allowed to load on that page — covered types are JavaScript, CSS, HTML frames, fonts, images and embeddable objects such as Java applets, ActiveX, audio and video files.

**Evidence:**
```
{
  "url": "https://claude1-f630a.web.app/?document=..%2F..%2F..%2Fetc%2Fpasswd"
}
```


#### INFO: Content Security Policy (CSP) Header Not Set

- **CWE:** CWE-693 (Unknown)
- **Tool:** browser-scanner

**Description:**
Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks, including Cross Site Scripting (XSS) and data injection attacks. These attacks are used for everything from data theft to site defacement or distribution of malware. CSP provides a set of standard HTTP headers that allow website owners to declare approved sources of content that browsers should be allowed to load on that page — covered types are JavaScript, CSS, HTML frames, fonts, images and embeddable objects such as Java applets, ActiveX, audio and video files.

**Evidence:**
```
{
  "url": "https://claude1-f630a.web.app/?document=..%5C..%5C..%5Cwindows%5Cwin.ini"
}
```


#### INFO: Content Security Policy (CSP) Header Not Set

- **CWE:** CWE-693 (Unknown)
- **Tool:** browser-scanner

**Description:**
Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks, including Cross Site Scripting (XSS) and data injection attacks. These attacks are used for everything from data theft to site defacement or distribution of malware. CSP provides a set of standard HTTP headers that allow website owners to declare approved sources of content that browsers should be allowed to load on that page — covered types are JavaScript, CSS, HTML frames, fonts, images and embeddable objects such as Java applets, ActiveX, audio and video files.

**Evidence:**
```
{
  "url": "https://claude1-f630a.web.app/?document=....%2F%2F....%2F%2F....%2F%2Fetc%2Fpasswd"
}
```


#### INFO: Content Security Policy (CSP) Header Not Set

- **CWE:** CWE-693 (Unknown)
- **Tool:** browser-scanner

**Description:**
Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks, including Cross Site Scripting (XSS) and data injection attacks. These attacks are used for everything from data theft to site defacement or distribution of malware. CSP provides a set of standard HTTP headers that allow website owners to declare approved sources of content that browsers should be allowed to load on that page — covered types are JavaScript, CSS, HTML frames, fonts, images and embeddable objects such as Java applets, ActiveX, audio and video files.

**Evidence:**
```
{
  "url": "https://claude1-f630a.web.app/?document=..%252f..%252f..%252fetc%2Fpasswd"
}
```


#### INFO: Content Security Policy (CSP) Header Not Set

- **CWE:** CWE-693 (Unknown)
- **Tool:** browser-scanner

**Description:**
Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks, including Cross Site Scripting (XSS) and data injection attacks. These attacks are used for everything from data theft to site defacement or distribution of malware. CSP provides a set of standard HTTP headers that allow website owners to declare approved sources of content that browsers should be allowed to load on that page — covered types are JavaScript, CSS, HTML frames, fonts, images and embeddable objects such as Java applets, ActiveX, audio and video files.

**Evidence:**
```
{
  "url": "https://claude1-f630a.web.app/?doc=..%2F..%2F..%2Fetc%2Fpasswd"
}
```


#### INFO: Content Security Policy (CSP) Header Not Set

- **CWE:** CWE-693 (Unknown)
- **Tool:** browser-scanner

**Description:**
Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks, including Cross Site Scripting (XSS) and data injection attacks. These attacks are used for everything from data theft to site defacement or distribution of malware. CSP provides a set of standard HTTP headers that allow website owners to declare approved sources of content that browsers should be allowed to load on that page — covered types are JavaScript, CSS, HTML frames, fonts, images and embeddable objects such as Java applets, ActiveX, audio and video files.

**Evidence:**
```
{
  "url": "https://claude1-f630a.web.app/?doc=..%5C..%5C..%5Cwindows%5Cwin.ini"
}
```


#### INFO: Content Security Policy (CSP) Header Not Set

- **CWE:** CWE-693 (Unknown)
- **Tool:** browser-scanner

**Description:**
Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks, including Cross Site Scripting (XSS) and data injection attacks. These attacks are used for everything from data theft to site defacement or distribution of malware. CSP provides a set of standard HTTP headers that allow website owners to declare approved sources of content that browsers should be allowed to load on that page — covered types are JavaScript, CSS, HTML frames, fonts, images and embeddable objects such as Java applets, ActiveX, audio and video files.

**Evidence:**
```
{
  "url": "https://claude1-f630a.web.app/?doc=....%2F%2F....%2F%2F....%2F%2Fetc%2Fpasswd"
}
```


#### INFO: Content Security Policy (CSP) Header Not Set

- **CWE:** CWE-693 (Unknown)
- **Tool:** browser-scanner

**Description:**
Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks, including Cross Site Scripting (XSS) and data injection attacks. These attacks are used for everything from data theft to site defacement or distribution of malware. CSP provides a set of standard HTTP headers that allow website owners to declare approved sources of content that browsers should be allowed to load on that page — covered types are JavaScript, CSS, HTML frames, fonts, images and embeddable objects such as Java applets, ActiveX, audio and video files.

**Evidence:**
```
{
  "url": "https://claude1-f630a.web.app/?doc=..%252f..%252f..%252fetc%2Fpasswd"
}
```


#### INFO: Content Security Policy (CSP) Header Not Set

- **CWE:** CWE-693 (Unknown)
- **Tool:** browser-scanner

**Description:**
Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks, including Cross Site Scripting (XSS) and data injection attacks. These attacks are used for everything from data theft to site defacement or distribution of malware. CSP provides a set of standard HTTP headers that allow website owners to declare approved sources of content that browsers should be allowed to load on that page — covered types are JavaScript, CSS, HTML frames, fonts, images and embeddable objects such as Java applets, ActiveX, audio and video files.

**Evidence:**
```
{
  "url": "https://claude1-f630a.web.app/?page=..%2F..%2F..%2Fetc%2Fpasswd"
}
```


#### INFO: Content Security Policy (CSP) Header Not Set

- **CWE:** CWE-693 (Unknown)
- **Tool:** browser-scanner

**Description:**
Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks, including Cross Site Scripting (XSS) and data injection attacks. These attacks are used for everything from data theft to site defacement or distribution of malware. CSP provides a set of standard HTTP headers that allow website owners to declare approved sources of content that browsers should be allowed to load on that page — covered types are JavaScript, CSS, HTML frames, fonts, images and embeddable objects such as Java applets, ActiveX, audio and video files.

**Evidence:**
```
{
  "url": "https://claude1-f630a.web.app/?page=..%5C..%5C..%5Cwindows%5Cwin.ini"
}
```


#### INFO: Content Security Policy (CSP) Header Not Set

- **CWE:** CWE-693 (Unknown)
- **Tool:** browser-scanner

**Description:**
Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks, including Cross Site Scripting (XSS) and data injection attacks. These attacks are used for everything from data theft to site defacement or distribution of malware. CSP provides a set of standard HTTP headers that allow website owners to declare approved sources of content that browsers should be allowed to load on that page — covered types are JavaScript, CSS, HTML frames, fonts, images and embeddable objects such as Java applets, ActiveX, audio and video files.

**Evidence:**
```
{
  "url": "https://claude1-f630a.web.app/?page=....%2F%2F....%2F%2F....%2F%2Fetc%2Fpasswd"
}
```


#### INFO: Content Security Policy (CSP) Header Not Set

- **CWE:** CWE-693 (Unknown)
- **Tool:** browser-scanner

**Description:**
Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks, including Cross Site Scripting (XSS) and data injection attacks. These attacks are used for everything from data theft to site defacement or distribution of malware. CSP provides a set of standard HTTP headers that allow website owners to declare approved sources of content that browsers should be allowed to load on that page — covered types are JavaScript, CSS, HTML frames, fonts, images and embeddable objects such as Java applets, ActiveX, audio and video files.

**Evidence:**
```
{
  "url": "https://claude1-f630a.web.app/?page=..%252f..%252f..%252fetc%2Fpasswd"
}
```


#### INFO: Content Security Policy (CSP) Header Not Set

- **CWE:** CWE-693 (Unknown)
- **Tool:** browser-scanner

**Description:**
Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks, including Cross Site Scripting (XSS) and data injection attacks. These attacks are used for everything from data theft to site defacement or distribution of malware. CSP provides a set of standard HTTP headers that allow website owners to declare approved sources of content that browsers should be allowed to load on that page — covered types are JavaScript, CSS, HTML frames, fonts, images and embeddable objects such as Java applets, ActiveX, audio and video files.

**Evidence:**
```
{
  "url": "https://claude1-f630a.web.app/?template=..%2F..%2F..%2Fetc%2Fpasswd"
}
```


#### INFO: Content Security Policy (CSP) Header Not Set

- **CWE:** CWE-693 (Unknown)
- **Tool:** browser-scanner

**Description:**
Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks, including Cross Site Scripting (XSS) and data injection attacks. These attacks are used for everything from data theft to site defacement or distribution of malware. CSP provides a set of standard HTTP headers that allow website owners to declare approved sources of content that browsers should be allowed to load on that page — covered types are JavaScript, CSS, HTML frames, fonts, images and embeddable objects such as Java applets, ActiveX, audio and video files.

**Evidence:**
```
{
  "url": "https://claude1-f630a.web.app/?template=..%5C..%5C..%5Cwindows%5Cwin.ini"
}
```


#### INFO: Content Security Policy (CSP) Header Not Set

- **CWE:** CWE-693 (Unknown)
- **Tool:** browser-scanner

**Description:**
Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks, including Cross Site Scripting (XSS) and data injection attacks. These attacks are used for everything from data theft to site defacement or distribution of malware. CSP provides a set of standard HTTP headers that allow website owners to declare approved sources of content that browsers should be allowed to load on that page — covered types are JavaScript, CSS, HTML frames, fonts, images and embeddable objects such as Java applets, ActiveX, audio and video files.

**Evidence:**
```
{
  "url": "https://claude1-f630a.web.app/?template=....%2F%2F....%2F%2F....%2F%2Fetc%2Fpasswd"
}
```


#### INFO: Content Security Policy (CSP) Header Not Set

- **CWE:** CWE-693 (Unknown)
- **Tool:** browser-scanner

**Description:**
Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks, including Cross Site Scripting (XSS) and data injection attacks. These attacks are used for everything from data theft to site defacement or distribution of malware. CSP provides a set of standard HTTP headers that allow website owners to declare approved sources of content that browsers should be allowed to load on that page — covered types are JavaScript, CSS, HTML frames, fonts, images and embeddable objects such as Java applets, ActiveX, audio and video files.

**Evidence:**
```
{
  "url": "https://claude1-f630a.web.app/?template=..%252f..%252f..%252fetc%2Fpasswd"
}
```


#### INFO: Content Security Policy (CSP) Header Not Set

- **CWE:** CWE-693 (Unknown)
- **Tool:** browser-scanner

**Description:**
Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks, including Cross Site Scripting (XSS) and data injection attacks. These attacks are used for everything from data theft to site defacement or distribution of malware. CSP provides a set of standard HTTP headers that allow website owners to declare approved sources of content that browsers should be allowed to load on that page — covered types are JavaScript, CSS, HTML frames, fonts, images and embeddable objects such as Java applets, ActiveX, audio and video files.

**Evidence:**
```
{
  "url": "https://claude1-f630a.web.app/?include=..%2F..%2F..%2Fetc%2Fpasswd"
}
```


#### INFO: Content Security Policy (CSP) Header Not Set

- **CWE:** CWE-693 (Unknown)
- **Tool:** browser-scanner

**Description:**
Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks, including Cross Site Scripting (XSS) and data injection attacks. These attacks are used for everything from data theft to site defacement or distribution of malware. CSP provides a set of standard HTTP headers that allow website owners to declare approved sources of content that browsers should be allowed to load on that page — covered types are JavaScript, CSS, HTML frames, fonts, images and embeddable objects such as Java applets, ActiveX, audio and video files.

**Evidence:**
```
{
  "url": "https://claude1-f630a.web.app/?include=..%5C..%5C..%5Cwindows%5Cwin.ini"
}
```


#### INFO: Content Security Policy (CSP) Header Not Set

- **CWE:** CWE-693 (Unknown)
- **Tool:** browser-scanner

**Description:**
Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks, including Cross Site Scripting (XSS) and data injection attacks. These attacks are used for everything from data theft to site defacement or distribution of malware. CSP provides a set of standard HTTP headers that allow website owners to declare approved sources of content that browsers should be allowed to load on that page — covered types are JavaScript, CSS, HTML frames, fonts, images and embeddable objects such as Java applets, ActiveX, audio and video files.

**Evidence:**
```
{
  "url": "https://claude1-f630a.web.app/?include=....%2F%2F....%2F%2F....%2F%2Fetc%2Fpasswd"
}
```


#### INFO: Content Security Policy (CSP) Header Not Set

- **CWE:** CWE-693 (Unknown)
- **Tool:** browser-scanner

**Description:**
Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks, including Cross Site Scripting (XSS) and data injection attacks. These attacks are used for everything from data theft to site defacement or distribution of malware. CSP provides a set of standard HTTP headers that allow website owners to declare approved sources of content that browsers should be allowed to load on that page — covered types are JavaScript, CSS, HTML frames, fonts, images and embeddable objects such as Java applets, ActiveX, audio and video files.

**Evidence:**
```
{
  "url": "https://claude1-f630a.web.app/?include=..%252f..%252f..%252fetc%2Fpasswd"
}
```


#### INFO: Content Security Policy (CSP) Header Not Set

- **CWE:** CWE-693 (Unknown)
- **Tool:** browser-scanner

**Description:**
Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks, including Cross Site Scripting (XSS) and data injection attacks. These attacks are used for everything from data theft to site defacement or distribution of malware. CSP provides a set of standard HTTP headers that allow website owners to declare approved sources of content that browsers should be allowed to load on that page — covered types are JavaScript, CSS, HTML frames, fonts, images and embeddable objects such as Java applets, ActiveX, audio and video files.

**Evidence:**
```
{
  "url": "https://claude1-f630a.web.app/?dir=..%2F..%2F..%2Fetc%2Fpasswd"
}
```


#### INFO: Content Security Policy (CSP) Header Not Set

- **CWE:** CWE-693 (Unknown)
- **Tool:** browser-scanner

**Description:**
Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks, including Cross Site Scripting (XSS) and data injection attacks. These attacks are used for everything from data theft to site defacement or distribution of malware. CSP provides a set of standard HTTP headers that allow website owners to declare approved sources of content that browsers should be allowed to load on that page — covered types are JavaScript, CSS, HTML frames, fonts, images and embeddable objects such as Java applets, ActiveX, audio and video files.

**Evidence:**
```
{
  "url": "https://claude1-f630a.web.app/?dir=..%5C..%5C..%5Cwindows%5Cwin.ini"
}
```


#### INFO: Content Security Policy (CSP) Header Not Set

- **CWE:** CWE-693 (Unknown)
- **Tool:** browser-scanner

**Description:**
Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks, including Cross Site Scripting (XSS) and data injection attacks. These attacks are used for everything from data theft to site defacement or distribution of malware. CSP provides a set of standard HTTP headers that allow website owners to declare approved sources of content that browsers should be allowed to load on that page — covered types are JavaScript, CSS, HTML frames, fonts, images and embeddable objects such as Java applets, ActiveX, audio and video files.

**Evidence:**
```
{
  "url": "https://claude1-f630a.web.app/?dir=....%2F%2F....%2F%2F....%2F%2Fetc%2Fpasswd"
}
```


#### INFO: Content Security Policy (CSP) Header Not Set

- **CWE:** CWE-693 (Unknown)
- **Tool:** browser-scanner

**Description:**
Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks, including Cross Site Scripting (XSS) and data injection attacks. These attacks are used for everything from data theft to site defacement or distribution of malware. CSP provides a set of standard HTTP headers that allow website owners to declare approved sources of content that browsers should be allowed to load on that page — covered types are JavaScript, CSS, HTML frames, fonts, images and embeddable objects such as Java applets, ActiveX, audio and video files.

**Evidence:**
```
{
  "url": "https://claude1-f630a.web.app/?dir=..%252f..%252f..%252fetc%2Fpasswd"
}
```


#### INFO: Content Security Policy (CSP) Header Not Set

- **CWE:** CWE-693 (Unknown)
- **Tool:** browser-scanner

**Description:**
Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks, including Cross Site Scripting (XSS) and data injection attacks. These attacks are used for everything from data theft to site defacement or distribution of malware. CSP provides a set of standard HTTP headers that allow website owners to declare approved sources of content that browsers should be allowed to load on that page — covered types are JavaScript, CSS, HTML frames, fonts, images and embeddable objects such as Java applets, ActiveX, audio and video files.

**Evidence:**
```
{
  "url": "https://claude1-f630a.web.app/?folder=..%2F..%2F..%2Fetc%2Fpasswd"
}
```


#### INFO: Content Security Policy (CSP) Header Not Set

- **CWE:** CWE-693 (Unknown)
- **Tool:** browser-scanner

**Description:**
Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks, including Cross Site Scripting (XSS) and data injection attacks. These attacks are used for everything from data theft to site defacement or distribution of malware. CSP provides a set of standard HTTP headers that allow website owners to declare approved sources of content that browsers should be allowed to load on that page — covered types are JavaScript, CSS, HTML frames, fonts, images and embeddable objects such as Java applets, ActiveX, audio and video files.

**Evidence:**
```
{
  "url": "https://claude1-f630a.web.app/?folder=..%5C..%5C..%5Cwindows%5Cwin.ini"
}
```


#### INFO: Content Security Policy (CSP) Header Not Set

- **CWE:** CWE-693 (Unknown)
- **Tool:** browser-scanner

**Description:**
Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks, including Cross Site Scripting (XSS) and data injection attacks. These attacks are used for everything from data theft to site defacement or distribution of malware. CSP provides a set of standard HTTP headers that allow website owners to declare approved sources of content that browsers should be allowed to load on that page — covered types are JavaScript, CSS, HTML frames, fonts, images and embeddable objects such as Java applets, ActiveX, audio and video files.

**Evidence:**
```
{
  "url": "https://claude1-f630a.web.app/?folder=....%2F%2F....%2F%2F....%2F%2Fetc%2Fpasswd"
}
```


#### INFO: Content Security Policy (CSP) Header Not Set

- **CWE:** CWE-693 (Unknown)
- **Tool:** browser-scanner

**Description:**
Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks, including Cross Site Scripting (XSS) and data injection attacks. These attacks are used for everything from data theft to site defacement or distribution of malware. CSP provides a set of standard HTTP headers that allow website owners to declare approved sources of content that browsers should be allowed to load on that page — covered types are JavaScript, CSS, HTML frames, fonts, images and embeddable objects such as Java applets, ActiveX, audio and video files.

**Evidence:**
```
{
  "url": "https://claude1-f630a.web.app/?folder=..%252f..%252f..%252fetc%2Fpasswd"
}
```


#### INFO: Content Security Policy (CSP) Header Not Set

- **CWE:** CWE-693 (Unknown)
- **Tool:** browser-scanner

**Description:**
Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks, including Cross Site Scripting (XSS) and data injection attacks. These attacks are used for everything from data theft to site defacement or distribution of malware. CSP provides a set of standard HTTP headers that allow website owners to declare approved sources of content that browsers should be allowed to load on that page — covered types are JavaScript, CSS, HTML frames, fonts, images and embeddable objects such as Java applets, ActiveX, audio and video files.

**Evidence:**
```
{
  "url": "https://claude1-f630a.web.app/?load=..%2F..%2F..%2Fetc%2Fpasswd"
}
```


#### INFO: Content Security Policy (CSP) Header Not Set

- **CWE:** CWE-693 (Unknown)
- **Tool:** browser-scanner

**Description:**
Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks, including Cross Site Scripting (XSS) and data injection attacks. These attacks are used for everything from data theft to site defacement or distribution of malware. CSP provides a set of standard HTTP headers that allow website owners to declare approved sources of content that browsers should be allowed to load on that page — covered types are JavaScript, CSS, HTML frames, fonts, images and embeddable objects such as Java applets, ActiveX, audio and video files.

**Evidence:**
```
{
  "url": "https://claude1-f630a.web.app/?load=..%5C..%5C..%5Cwindows%5Cwin.ini"
}
```


#### INFO: Content Security Policy (CSP) Header Not Set

- **CWE:** CWE-693 (Unknown)
- **Tool:** browser-scanner

**Description:**
Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks, including Cross Site Scripting (XSS) and data injection attacks. These attacks are used for everything from data theft to site defacement or distribution of malware. CSP provides a set of standard HTTP headers that allow website owners to declare approved sources of content that browsers should be allowed to load on that page — covered types are JavaScript, CSS, HTML frames, fonts, images and embeddable objects such as Java applets, ActiveX, audio and video files.

**Evidence:**
```
{
  "url": "https://claude1-f630a.web.app/?load=....%2F%2F....%2F%2F....%2F%2Fetc%2Fpasswd"
}
```


#### INFO: Content Security Policy (CSP) Header Not Set

- **CWE:** CWE-693 (Unknown)
- **Tool:** browser-scanner

**Description:**
Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks, including Cross Site Scripting (XSS) and data injection attacks. These attacks are used for everything from data theft to site defacement or distribution of malware. CSP provides a set of standard HTTP headers that allow website owners to declare approved sources of content that browsers should be allowed to load on that page — covered types are JavaScript, CSS, HTML frames, fonts, images and embeddable objects such as Java applets, ActiveX, audio and video files.

**Evidence:**
```
{
  "url": "https://claude1-f630a.web.app/?load=..%252f..%252f..%252fetc%2Fpasswd"
}
```


#### INFO: Content Security Policy (CSP) Header Not Set

- **CWE:** CWE-693 (Unknown)
- **Tool:** browser-scanner

**Description:**
Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks, including Cross Site Scripting (XSS) and data injection attacks. These attacks are used for everything from data theft to site defacement or distribution of malware. CSP provides a set of standard HTTP headers that allow website owners to declare approved sources of content that browsers should be allowed to load on that page — covered types are JavaScript, CSS, HTML frames, fonts, images and embeddable objects such as Java applets, ActiveX, audio and video files.

**Evidence:**
```
{
  "url": "https://claude1-f630a.web.app/?read=..%2F..%2F..%2Fetc%2Fpasswd"
}
```


#### INFO: Content Security Policy (CSP) Header Not Set

- **CWE:** CWE-693 (Unknown)
- **Tool:** browser-scanner

**Description:**
Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks, including Cross Site Scripting (XSS) and data injection attacks. These attacks are used for everything from data theft to site defacement or distribution of malware. CSP provides a set of standard HTTP headers that allow website owners to declare approved sources of content that browsers should be allowed to load on that page — covered types are JavaScript, CSS, HTML frames, fonts, images and embeddable objects such as Java applets, ActiveX, audio and video files.

**Evidence:**
```
{
  "url": "https://claude1-f630a.web.app/?read=..%5C..%5C..%5Cwindows%5Cwin.ini"
}
```


#### INFO: Content Security Policy (CSP) Header Not Set

- **CWE:** CWE-693 (Unknown)
- **Tool:** browser-scanner

**Description:**
Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks, including Cross Site Scripting (XSS) and data injection attacks. These attacks are used for everything from data theft to site defacement or distribution of malware. CSP provides a set of standard HTTP headers that allow website owners to declare approved sources of content that browsers should be allowed to load on that page — covered types are JavaScript, CSS, HTML frames, fonts, images and embeddable objects such as Java applets, ActiveX, audio and video files.

**Evidence:**
```
{
  "url": "https://claude1-f630a.web.app/?read=....%2F%2F....%2F%2F....%2F%2Fetc%2Fpasswd"
}
```


#### INFO: Content Security Policy (CSP) Header Not Set

- **CWE:** CWE-693 (Unknown)
- **Tool:** browser-scanner

**Description:**
Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks, including Cross Site Scripting (XSS) and data injection attacks. These attacks are used for everything from data theft to site defacement or distribution of malware. CSP provides a set of standard HTTP headers that allow website owners to declare approved sources of content that browsers should be allowed to load on that page — covered types are JavaScript, CSS, HTML frames, fonts, images and embeddable objects such as Java applets, ActiveX, audio and video files.

**Evidence:**
```
{
  "url": "https://claude1-f630a.web.app/?read=..%252f..%252f..%252fetc%2Fpasswd"
}
```


#### INFO: Content Security Policy (CSP) Header Not Set

- **CWE:** CWE-693 (Unknown)
- **Tool:** browser-scanner

**Description:**
Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks, including Cross Site Scripting (XSS) and data injection attacks. These attacks are used for everything from data theft to site defacement or distribution of malware. CSP provides a set of standard HTTP headers that allow website owners to declare approved sources of content that browsers should be allowed to load on that page — covered types are JavaScript, CSS, HTML frames, fonts, images and embeddable objects such as Java applets, ActiveX, audio and video files.

**Evidence:**
```
{
  "url": "https://claude1-f630a.web.app/images/"
}
```


#### INFO: Content Security Policy (CSP) Header Not Set

- **CWE:** CWE-693 (Unknown)
- **Tool:** browser-scanner

**Description:**
Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks, including Cross Site Scripting (XSS) and data injection attacks. These attacks are used for everything from data theft to site defacement or distribution of malware. CSP provides a set of standard HTTP headers that allow website owners to declare approved sources of content that browsers should be allowed to load on that page — covered types are JavaScript, CSS, HTML frames, fonts, images and embeddable objects such as Java applets, ActiveX, audio and video files.

**Evidence:**
```
{
  "url": "https://claude1-f630a.web.app/uploads/"
}
```


#### INFO: Content Security Policy (CSP) Header Not Set

- **CWE:** CWE-693 (Unknown)
- **Tool:** browser-scanner

**Description:**
Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks, including Cross Site Scripting (XSS) and data injection attacks. These attacks are used for everything from data theft to site defacement or distribution of malware. CSP provides a set of standard HTTP headers that allow website owners to declare approved sources of content that browsers should be allowed to load on that page — covered types are JavaScript, CSS, HTML frames, fonts, images and embeddable objects such as Java applets, ActiveX, audio and video files.

**Evidence:**
```
{
  "url": "https://claude1-f630a.web.app/files/"
}
```


#### INFO: Content Security Policy (CSP) Header Not Set

- **CWE:** CWE-693 (Unknown)
- **Tool:** browser-scanner

**Description:**
Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks, including Cross Site Scripting (XSS) and data injection attacks. These attacks are used for everything from data theft to site defacement or distribution of malware. CSP provides a set of standard HTTP headers that allow website owners to declare approved sources of content that browsers should be allowed to load on that page — covered types are JavaScript, CSS, HTML frames, fonts, images and embeddable objects such as Java applets, ActiveX, audio and video files.

**Evidence:**
```
{
  "url": "https://claude1-f630a.web.app/assets/"
}
```


#### INFO: Content Security Policy (CSP) Header Not Set

- **CWE:** CWE-693 (Unknown)
- **Tool:** browser-scanner

**Description:**
Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks, including Cross Site Scripting (XSS) and data injection attacks. These attacks are used for everything from data theft to site defacement or distribution of malware. CSP provides a set of standard HTTP headers that allow website owners to declare approved sources of content that browsers should be allowed to load on that page — covered types are JavaScript, CSS, HTML frames, fonts, images and embeddable objects such as Java applets, ActiveX, audio and video files.

**Evidence:**
```
{
  "url": "https://claude1-f630a.web.app/static/"
}
```


#### INFO: Content Security Policy (CSP) Header Not Set

- **CWE:** CWE-693 (Unknown)
- **Tool:** browser-scanner

**Description:**
Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks, including Cross Site Scripting (XSS) and data injection attacks. These attacks are used for everything from data theft to site defacement or distribution of malware. CSP provides a set of standard HTTP headers that allow website owners to declare approved sources of content that browsers should be allowed to load on that page — covered types are JavaScript, CSS, HTML frames, fonts, images and embeddable objects such as Java applets, ActiveX, audio and video files.

**Evidence:**
```
{
  "url": "https://claude1-f630a.web.app/media/"
}
```


#### INFO: Content Security Policy (CSP) Header Not Set

- **CWE:** CWE-693 (Unknown)
- **Tool:** browser-scanner

**Description:**
Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks, including Cross Site Scripting (XSS) and data injection attacks. These attacks are used for everything from data theft to site defacement or distribution of malware. CSP provides a set of standard HTTP headers that allow website owners to declare approved sources of content that browsers should be allowed to load on that page — covered types are JavaScript, CSS, HTML frames, fonts, images and embeddable objects such as Java applets, ActiveX, audio and video files.

**Evidence:**
```
{
  "url": "https://claude1-f630a.web.app/backup/"
}
```


#### INFO: Content Security Policy (CSP) Header Not Set

- **CWE:** CWE-693 (Unknown)
- **Tool:** browser-scanner

**Description:**
Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks, including Cross Site Scripting (XSS) and data injection attacks. These attacks are used for everything from data theft to site defacement or distribution of malware. CSP provides a set of standard HTTP headers that allow website owners to declare approved sources of content that browsers should be allowed to load on that page — covered types are JavaScript, CSS, HTML frames, fonts, images and embeddable objects such as Java applets, ActiveX, audio and video files.

**Evidence:**
```
{
  "url": "https://claude1-f630a.web.app/logs/"
}
```


#### INFO: Content Security Policy (CSP) Header Not Set

- **CWE:** CWE-693 (Unknown)
- **Tool:** browser-scanner

**Description:**
Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks, including Cross Site Scripting (XSS) and data injection attacks. These attacks are used for everything from data theft to site defacement or distribution of malware. CSP provides a set of standard HTTP headers that allow website owners to declare approved sources of content that browsers should be allowed to load on that page — covered types are JavaScript, CSS, HTML frames, fonts, images and embeddable objects such as Java applets, ActiveX, audio and video files.

**Evidence:**
```
{
  "url": "https://claude1-f630a.web.app/tmp/"
}
```


#### INFO: Content Security Policy (CSP) Header Not Set

- **CWE:** CWE-693 (Unknown)
- **Tool:** browser-scanner

**Description:**
Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks, including Cross Site Scripting (XSS) and data injection attacks. These attacks are used for everything from data theft to site defacement or distribution of malware. CSP provides a set of standard HTTP headers that allow website owners to declare approved sources of content that browsers should be allowed to load on that page — covered types are JavaScript, CSS, HTML frames, fonts, images and embeddable objects such as Java applets, ActiveX, audio and video files.

**Evidence:**
```
{
  "url": "https://claude1-f630a.web.app/data/"
}
```


#### INFO: Content Security Policy (CSP) Header Not Set

- **CWE:** CWE-693 (Unknown)
- **Tool:** browser-scanner

**Description:**
Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks, including Cross Site Scripting (XSS) and data injection attacks. These attacks are used for everything from data theft to site defacement or distribution of malware. CSP provides a set of standard HTTP headers that allow website owners to declare approved sources of content that browsers should be allowed to load on that page — covered types are JavaScript, CSS, HTML frames, fonts, images and embeddable objects such as Java applets, ActiveX, audio and video files.

**Evidence:**
```
{
  "url": "https://claude1-f630a.web.app/admin"
}
```


#### INFO: Content Security Policy (CSP) Header Not Set

- **CWE:** CWE-693 (Unknown)
- **Tool:** browser-scanner

**Description:**
Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks, including Cross Site Scripting (XSS) and data injection attacks. These attacks are used for everything from data theft to site defacement or distribution of malware. CSP provides a set of standard HTTP headers that allow website owners to declare approved sources of content that browsers should be allowed to load on that page — covered types are JavaScript, CSS, HTML frames, fonts, images and embeddable objects such as Java applets, ActiveX, audio and video files.

**Evidence:**
```
{
  "url": "https://claude1-f630a.web.app/admin/"
}
```


#### INFO: Content Security Policy (CSP) Header Not Set

- **CWE:** CWE-693 (Unknown)
- **Tool:** browser-scanner

**Description:**
Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks, including Cross Site Scripting (XSS) and data injection attacks. These attacks are used for everything from data theft to site defacement or distribution of malware. CSP provides a set of standard HTTP headers that allow website owners to declare approved sources of content that browsers should be allowed to load on that page — covered types are JavaScript, CSS, HTML frames, fonts, images and embeddable objects such as Java applets, ActiveX, audio and video files.

**Evidence:**
```
{
  "url": "https://claude1-f630a.web.app/admin/dashboard"
}
```


#### INFO: Content Security Policy (CSP) Header Not Set

- **CWE:** CWE-693 (Unknown)
- **Tool:** browser-scanner

**Description:**
Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks, including Cross Site Scripting (XSS) and data injection attacks. These attacks are used for everything from data theft to site defacement or distribution of malware. CSP provides a set of standard HTTP headers that allow website owners to declare approved sources of content that browsers should be allowed to load on that page — covered types are JavaScript, CSS, HTML frames, fonts, images and embeddable objects such as Java applets, ActiveX, audio and video files.

**Evidence:**
```
{
  "url": "https://claude1-f630a.web.app/admin/users"
}
```


#### INFO: Content Security Policy (CSP) Header Not Set

- **CWE:** CWE-693 (Unknown)
- **Tool:** browser-scanner

**Description:**
Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks, including Cross Site Scripting (XSS) and data injection attacks. These attacks are used for everything from data theft to site defacement or distribution of malware. CSP provides a set of standard HTTP headers that allow website owners to declare approved sources of content that browsers should be allowed to load on that page — covered types are JavaScript, CSS, HTML frames, fonts, images and embeddable objects such as Java applets, ActiveX, audio and video files.

**Evidence:**
```
{
  "url": "https://claude1-f630a.web.app/admin/settings"
}
```


#### INFO: Content Security Policy (CSP) Header Not Set

- **CWE:** CWE-693 (Unknown)
- **Tool:** browser-scanner

**Description:**
Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks, including Cross Site Scripting (XSS) and data injection attacks. These attacks are used for everything from data theft to site defacement or distribution of malware. CSP provides a set of standard HTTP headers that allow website owners to declare approved sources of content that browsers should be allowed to load on that page — covered types are JavaScript, CSS, HTML frames, fonts, images and embeddable objects such as Java applets, ActiveX, audio and video files.

**Evidence:**
```
{
  "url": "https://claude1-f630a.web.app/administrator"
}
```


#### INFO: Content Security Policy (CSP) Header Not Set

- **CWE:** CWE-693 (Unknown)
- **Tool:** browser-scanner

**Description:**
Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks, including Cross Site Scripting (XSS) and data injection attacks. These attacks are used for everything from data theft to site defacement or distribution of malware. CSP provides a set of standard HTTP headers that allow website owners to declare approved sources of content that browsers should be allowed to load on that page — covered types are JavaScript, CSS, HTML frames, fonts, images and embeddable objects such as Java applets, ActiveX, audio and video files.

**Evidence:**
```
{
  "url": "https://claude1-f630a.web.app/manage"
}
```


#### INFO: Content Security Policy (CSP) Header Not Set

- **CWE:** CWE-693 (Unknown)
- **Tool:** browser-scanner

**Description:**
Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks, including Cross Site Scripting (XSS) and data injection attacks. These attacks are used for everything from data theft to site defacement or distribution of malware. CSP provides a set of standard HTTP headers that allow website owners to declare approved sources of content that browsers should be allowed to load on that page — covered types are JavaScript, CSS, HTML frames, fonts, images and embeddable objects such as Java applets, ActiveX, audio and video files.

**Evidence:**
```
{
  "url": "https://claude1-f630a.web.app/management"
}
```


#### INFO: Content Security Policy (CSP) Header Not Set

- **CWE:** CWE-693 (Unknown)
- **Tool:** browser-scanner

**Description:**
Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks, including Cross Site Scripting (XSS) and data injection attacks. These attacks are used for everything from data theft to site defacement or distribution of malware. CSP provides a set of standard HTTP headers that allow website owners to declare approved sources of content that browsers should be allowed to load on that page — covered types are JavaScript, CSS, HTML frames, fonts, images and embeddable objects such as Java applets, ActiveX, audio and video files.

**Evidence:**
```
{
  "url": "https://claude1-f630a.web.app/console"
}
```


#### INFO: Content Security Policy (CSP) Header Not Set

- **CWE:** CWE-693 (Unknown)
- **Tool:** browser-scanner

**Description:**
Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks, including Cross Site Scripting (XSS) and data injection attacks. These attacks are used for everything from data theft to site defacement or distribution of malware. CSP provides a set of standard HTTP headers that allow website owners to declare approved sources of content that browsers should be allowed to load on that page — covered types are JavaScript, CSS, HTML frames, fonts, images and embeddable objects such as Java applets, ActiveX, audio and video files.

**Evidence:**
```
{
  "url": "https://claude1-f630a.web.app/panel"
}
```


#### INFO: Content Security Policy (CSP) Header Not Set

- **CWE:** CWE-693 (Unknown)
- **Tool:** browser-scanner

**Description:**
Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks, including Cross Site Scripting (XSS) and data injection attacks. These attacks are used for everything from data theft to site defacement or distribution of malware. CSP provides a set of standard HTTP headers that allow website owners to declare approved sources of content that browsers should be allowed to load on that page — covered types are JavaScript, CSS, HTML frames, fonts, images and embeddable objects such as Java applets, ActiveX, audio and video files.

**Evidence:**
```
{
  "url": "https://claude1-f630a.web.app/backoffice"
}
```


#### INFO: Content Security Policy (CSP) Header Not Set

- **CWE:** CWE-693 (Unknown)
- **Tool:** browser-scanner

**Description:**
Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks, including Cross Site Scripting (XSS) and data injection attacks. These attacks are used for everything from data theft to site defacement or distribution of malware. CSP provides a set of standard HTTP headers that allow website owners to declare approved sources of content that browsers should be allowed to load on that page — covered types are JavaScript, CSS, HTML frames, fonts, images and embeddable objects such as Java applets, ActiveX, audio and video files.

**Evidence:**
```
{
  "url": "https://claude1-f630a.web.app/backend"
}
```


#### INFO: Content Security Policy (CSP) Header Not Set

- **CWE:** CWE-693 (Unknown)
- **Tool:** browser-scanner

**Description:**
Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks, including Cross Site Scripting (XSS) and data injection attacks. These attacks are used for everything from data theft to site defacement or distribution of malware. CSP provides a set of standard HTTP headers that allow website owners to declare approved sources of content that browsers should be allowed to load on that page — covered types are JavaScript, CSS, HTML frames, fonts, images and embeddable objects such as Java applets, ActiveX, audio and video files.

**Evidence:**
```
{
  "url": "https://claude1-f630a.web.app/dashboard/admin"
}
```


#### INFO: Content Security Policy (CSP) Header Not Set

- **CWE:** CWE-693 (Unknown)
- **Tool:** browser-scanner

**Description:**
Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks, including Cross Site Scripting (XSS) and data injection attacks. These attacks are used for everything from data theft to site defacement or distribution of malware. CSP provides a set of standard HTTP headers that allow website owners to declare approved sources of content that browsers should be allowed to load on that page — covered types are JavaScript, CSS, HTML frames, fonts, images and embeddable objects such as Java applets, ActiveX, audio and video files.

**Evidence:**
```
{
  "url": "https://claude1-f630a.web.app/api/admin"
}
```


#### INFO: Content Security Policy (CSP) Header Not Set

- **CWE:** CWE-693 (Unknown)
- **Tool:** browser-scanner

**Description:**
Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks, including Cross Site Scripting (XSS) and data injection attacks. These attacks are used for everything from data theft to site defacement or distribution of malware. CSP provides a set of standard HTTP headers that allow website owners to declare approved sources of content that browsers should be allowed to load on that page — covered types are JavaScript, CSS, HTML frames, fonts, images and embeddable objects such as Java applets, ActiveX, audio and video files.

**Evidence:**
```
{
  "url": "https://claude1-f630a.web.app/api/users"
}
```


#### INFO: Content Security Policy (CSP) Header Not Set

- **CWE:** CWE-693 (Unknown)
- **Tool:** browser-scanner

**Description:**
Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks, including Cross Site Scripting (XSS) and data injection attacks. These attacks are used for everything from data theft to site defacement or distribution of malware. CSP provides a set of standard HTTP headers that allow website owners to declare approved sources of content that browsers should be allowed to load on that page — covered types are JavaScript, CSS, HTML frames, fonts, images and embeddable objects such as Java applets, ActiveX, audio and video files.

**Evidence:**
```
{
  "url": "https://claude1-f630a.web.app/.git/config"
}
```


#### INFO: Content Security Policy (CSP) Header Not Set

- **CWE:** CWE-693 (Unknown)
- **Tool:** browser-scanner

**Description:**
Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks, including Cross Site Scripting (XSS) and data injection attacks. These attacks are used for everything from data theft to site defacement or distribution of malware. CSP provides a set of standard HTTP headers that allow website owners to declare approved sources of content that browsers should be allowed to load on that page — covered types are JavaScript, CSS, HTML frames, fonts, images and embeddable objects such as Java applets, ActiveX, audio and video files.

**Evidence:**
```
{
  "url": "https://claude1-f630a.web.app/.git/HEAD"
}
```


#### INFO: Content Security Policy (CSP) Header Not Set

- **CWE:** CWE-693 (Unknown)
- **Tool:** browser-scanner

**Description:**
Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks, including Cross Site Scripting (XSS) and data injection attacks. These attacks are used for everything from data theft to site defacement or distribution of malware. CSP provides a set of standard HTTP headers that allow website owners to declare approved sources of content that browsers should be allowed to load on that page — covered types are JavaScript, CSS, HTML frames, fonts, images and embeddable objects such as Java applets, ActiveX, audio and video files.

**Evidence:**
```
{
  "url": "https://claude1-f630a.web.app/.env"
}
```


#### INFO: Content Security Policy (CSP) Header Not Set

- **CWE:** CWE-693 (Unknown)
- **Tool:** browser-scanner

**Description:**
Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks, including Cross Site Scripting (XSS) and data injection attacks. These attacks are used for everything from data theft to site defacement or distribution of malware. CSP provides a set of standard HTTP headers that allow website owners to declare approved sources of content that browsers should be allowed to load on that page — covered types are JavaScript, CSS, HTML frames, fonts, images and embeddable objects such as Java applets, ActiveX, audio and video files.

**Evidence:**
```
{
  "url": "https://claude1-f630a.web.app/.env.local"
}
```


#### INFO: Content Security Policy (CSP) Header Not Set

- **CWE:** CWE-693 (Unknown)
- **Tool:** browser-scanner

**Description:**
Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks, including Cross Site Scripting (XSS) and data injection attacks. These attacks are used for everything from data theft to site defacement or distribution of malware. CSP provides a set of standard HTTP headers that allow website owners to declare approved sources of content that browsers should be allowed to load on that page — covered types are JavaScript, CSS, HTML frames, fonts, images and embeddable objects such as Java applets, ActiveX, audio and video files.

**Evidence:**
```
{
  "url": "https://claude1-f630a.web.app/.env.production"
}
```


#### INFO: Content Security Policy (CSP) Header Not Set

- **CWE:** CWE-693 (Unknown)
- **Tool:** browser-scanner

**Description:**
Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks, including Cross Site Scripting (XSS) and data injection attacks. These attacks are used for everything from data theft to site defacement or distribution of malware. CSP provides a set of standard HTTP headers that allow website owners to declare approved sources of content that browsers should be allowed to load on that page — covered types are JavaScript, CSS, HTML frames, fonts, images and embeddable objects such as Java applets, ActiveX, audio and video files.

**Evidence:**
```
{
  "url": "https://claude1-f630a.web.app/config.json"
}
```


#### INFO: Content Security Policy (CSP) Header Not Set

- **CWE:** CWE-693 (Unknown)
- **Tool:** browser-scanner

**Description:**
Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks, including Cross Site Scripting (XSS) and data injection attacks. These attacks are used for everything from data theft to site defacement or distribution of malware. CSP provides a set of standard HTTP headers that allow website owners to declare approved sources of content that browsers should be allowed to load on that page — covered types are JavaScript, CSS, HTML frames, fonts, images and embeddable objects such as Java applets, ActiveX, audio and video files.

**Evidence:**
```
{
  "url": "https://claude1-f630a.web.app/config.yaml"
}
```


#### INFO: Content Security Policy (CSP) Header Not Set

- **CWE:** CWE-693 (Unknown)
- **Tool:** browser-scanner

**Description:**
Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks, including Cross Site Scripting (XSS) and data injection attacks. These attacks are used for everything from data theft to site defacement or distribution of malware. CSP provides a set of standard HTTP headers that allow website owners to declare approved sources of content that browsers should be allowed to load on that page — covered types are JavaScript, CSS, HTML frames, fonts, images and embeddable objects such as Java applets, ActiveX, audio and video files.

**Evidence:**
```
{
  "url": "https://claude1-f630a.web.app/config.yml"
}
```


#### INFO: Content Security Policy (CSP) Header Not Set

- **CWE:** CWE-693 (Unknown)
- **Tool:** browser-scanner

**Description:**
Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks, including Cross Site Scripting (XSS) and data injection attacks. These attacks are used for everything from data theft to site defacement or distribution of malware. CSP provides a set of standard HTTP headers that allow website owners to declare approved sources of content that browsers should be allowed to load on that page — covered types are JavaScript, CSS, HTML frames, fonts, images and embeddable objects such as Java applets, ActiveX, audio and video files.

**Evidence:**
```
{
  "url": "https://claude1-f630a.web.app/firebase.json"
}
```


#### INFO: Content Security Policy (CSP) Header Not Set

- **CWE:** CWE-693 (Unknown)
- **Tool:** browser-scanner

**Description:**
Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks, including Cross Site Scripting (XSS) and data injection attacks. These attacks are used for everything from data theft to site defacement or distribution of malware. CSP provides a set of standard HTTP headers that allow website owners to declare approved sources of content that browsers should be allowed to load on that page — covered types are JavaScript, CSS, HTML frames, fonts, images and embeddable objects such as Java applets, ActiveX, audio and video files.

**Evidence:**
```
{
  "url": "https://claude1-f630a.web.app/package.json"
}
```


#### INFO: Content Security Policy (CSP) Header Not Set

- **CWE:** CWE-693 (Unknown)
- **Tool:** browser-scanner

**Description:**
Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks, including Cross Site Scripting (XSS) and data injection attacks. These attacks are used for everything from data theft to site defacement or distribution of malware. CSP provides a set of standard HTTP headers that allow website owners to declare approved sources of content that browsers should be allowed to load on that page — covered types are JavaScript, CSS, HTML frames, fonts, images and embeddable objects such as Java applets, ActiveX, audio and video files.

**Evidence:**
```
{
  "url": "https://claude1-f630a.web.app/package-lock.json"
}
```


#### INFO: Content Security Policy (CSP) Header Not Set

- **CWE:** CWE-693 (Unknown)
- **Tool:** browser-scanner

**Description:**
Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks, including Cross Site Scripting (XSS) and data injection attacks. These attacks are used for everything from data theft to site defacement or distribution of malware. CSP provides a set of standard HTTP headers that allow website owners to declare approved sources of content that browsers should be allowed to load on that page — covered types are JavaScript, CSS, HTML frames, fonts, images and embeddable objects such as Java applets, ActiveX, audio and video files.

**Evidence:**
```
{
  "url": "https://claude1-f630a.web.app/composer.json"
}
```


#### INFO: Content Security Policy (CSP) Header Not Set

- **CWE:** CWE-693 (Unknown)
- **Tool:** browser-scanner

**Description:**
Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks, including Cross Site Scripting (XSS) and data injection attacks. These attacks are used for everything from data theft to site defacement or distribution of malware. CSP provides a set of standard HTTP headers that allow website owners to declare approved sources of content that browsers should be allowed to load on that page — covered types are JavaScript, CSS, HTML frames, fonts, images and embeddable objects such as Java applets, ActiveX, audio and video files.

**Evidence:**
```
{
  "url": "https://claude1-f630a.web.app/composer.lock"
}
```


#### INFO: Content Security Policy (CSP) Header Not Set

- **CWE:** CWE-693 (Unknown)
- **Tool:** browser-scanner

**Description:**
Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks, including Cross Site Scripting (XSS) and data injection attacks. These attacks are used for everything from data theft to site defacement or distribution of malware. CSP provides a set of standard HTTP headers that allow website owners to declare approved sources of content that browsers should be allowed to load on that page — covered types are JavaScript, CSS, HTML frames, fonts, images and embeddable objects such as Java applets, ActiveX, audio and video files.

**Evidence:**
```
{
  "url": "https://claude1-f630a.web.app/webpack.config.js"
}
```


#### INFO: Content Security Policy (CSP) Header Not Set

- **CWE:** CWE-693 (Unknown)
- **Tool:** browser-scanner

**Description:**
Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks, including Cross Site Scripting (XSS) and data injection attacks. These attacks are used for everything from data theft to site defacement or distribution of malware. CSP provides a set of standard HTTP headers that allow website owners to declare approved sources of content that browsers should be allowed to load on that page — covered types are JavaScript, CSS, HTML frames, fonts, images and embeddable objects such as Java applets, ActiveX, audio and video files.

**Evidence:**
```
{
  "url": "https://claude1-f630a.web.app/tsconfig.json"
}
```


#### INFO: Content Security Policy (CSP) Header Not Set

- **CWE:** CWE-693 (Unknown)
- **Tool:** browser-scanner

**Description:**
Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks, including Cross Site Scripting (XSS) and data injection attacks. These attacks are used for everything from data theft to site defacement or distribution of malware. CSP provides a set of standard HTTP headers that allow website owners to declare approved sources of content that browsers should be allowed to load on that page — covered types are JavaScript, CSS, HTML frames, fonts, images and embeddable objects such as Java applets, ActiveX, audio and video files.

**Evidence:**
```
{
  "url": "https://claude1-f630a.web.app/.htaccess"
}
```


#### INFO: Content Security Policy (CSP) Header Not Set

- **CWE:** CWE-693 (Unknown)
- **Tool:** browser-scanner

**Description:**
Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks, including Cross Site Scripting (XSS) and data injection attacks. These attacks are used for everything from data theft to site defacement or distribution of malware. CSP provides a set of standard HTTP headers that allow website owners to declare approved sources of content that browsers should be allowed to load on that page — covered types are JavaScript, CSS, HTML frames, fonts, images and embeddable objects such as Java applets, ActiveX, audio and video files.

**Evidence:**
```
{
  "url": "https://claude1-f630a.web.app/.htpasswd"
}
```


#### INFO: Content Security Policy (CSP) Header Not Set

- **CWE:** CWE-693 (Unknown)
- **Tool:** browser-scanner

**Description:**
Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks, including Cross Site Scripting (XSS) and data injection attacks. These attacks are used for everything from data theft to site defacement or distribution of malware. CSP provides a set of standard HTTP headers that allow website owners to declare approved sources of content that browsers should be allowed to load on that page — covered types are JavaScript, CSS, HTML frames, fonts, images and embeddable objects such as Java applets, ActiveX, audio and video files.

**Evidence:**
```
{
  "url": "https://claude1-f630a.web.app/robots.txt"
}
```


#### INFO: Content Security Policy (CSP) Header Not Set

- **CWE:** CWE-693 (Unknown)
- **Tool:** browser-scanner

**Description:**
Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks, including Cross Site Scripting (XSS) and data injection attacks. These attacks are used for everything from data theft to site defacement or distribution of malware. CSP provides a set of standard HTTP headers that allow website owners to declare approved sources of content that browsers should be allowed to load on that page — covered types are JavaScript, CSS, HTML frames, fonts, images and embeddable objects such as Java applets, ActiveX, audio and video files.

**Evidence:**
```
{
  "url": "https://claude1-f630a.web.app/sitemap.xml"
}
```


#### INFO: Content Security Policy (CSP) Header Not Set

- **CWE:** CWE-693 (Unknown)
- **Tool:** browser-scanner

**Description:**
Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks, including Cross Site Scripting (XSS) and data injection attacks. These attacks are used for everything from data theft to site defacement or distribution of malware. CSP provides a set of standard HTTP headers that allow website owners to declare approved sources of content that browsers should be allowed to load on that page — covered types are JavaScript, CSS, HTML frames, fonts, images and embeddable objects such as Java applets, ActiveX, audio and video files.

**Evidence:**
```
{
  "url": "https://claude1-f630a.web.app/crossdomain.xml"
}
```


#### INFO: Content Security Policy (CSP) Header Not Set

- **CWE:** CWE-693 (Unknown)
- **Tool:** browser-scanner

**Description:**
Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks, including Cross Site Scripting (XSS) and data injection attacks. These attacks are used for everything from data theft to site defacement or distribution of malware. CSP provides a set of standard HTTP headers that allow website owners to declare approved sources of content that browsers should be allowed to load on that page — covered types are JavaScript, CSS, HTML frames, fonts, images and embeddable objects such as Java applets, ActiveX, audio and video files.

**Evidence:**
```
{
  "url": "https://claude1-f630a.web.app/clientaccesspolicy.xml"
}
```


#### INFO: Content Security Policy (CSP) Header Not Set

- **CWE:** CWE-693 (Unknown)
- **Tool:** browser-scanner

**Description:**
Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks, including Cross Site Scripting (XSS) and data injection attacks. These attacks are used for everything from data theft to site defacement or distribution of malware. CSP provides a set of standard HTTP headers that allow website owners to declare approved sources of content that browsers should be allowed to load on that page — covered types are JavaScript, CSS, HTML frames, fonts, images and embeddable objects such as Java applets, ActiveX, audio and video files.

**Evidence:**
```
{
  "url": "https://claude1-f630a.web.app/web.config"
}
```


#### INFO: Content Security Policy (CSP) Header Not Set

- **CWE:** CWE-693 (Unknown)
- **Tool:** browser-scanner

**Description:**
Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks, including Cross Site Scripting (XSS) and data injection attacks. These attacks are used for everything from data theft to site defacement or distribution of malware. CSP provides a set of standard HTTP headers that allow website owners to declare approved sources of content that browsers should be allowed to load on that page — covered types are JavaScript, CSS, HTML frames, fonts, images and embeddable objects such as Java applets, ActiveX, audio and video files.

**Evidence:**
```
{
  "url": "https://claude1-f630a.web.app/phpinfo.php"
}
```


#### INFO: Content Security Policy (CSP) Header Not Set

- **CWE:** CWE-693 (Unknown)
- **Tool:** browser-scanner

**Description:**
Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks, including Cross Site Scripting (XSS) and data injection attacks. These attacks are used for everything from data theft to site defacement or distribution of malware. CSP provides a set of standard HTTP headers that allow website owners to declare approved sources of content that browsers should be allowed to load on that page — covered types are JavaScript, CSS, HTML frames, fonts, images and embeddable objects such as Java applets, ActiveX, audio and video files.

**Evidence:**
```
{
  "url": "https://claude1-f630a.web.app/info.php"
}
```


#### INFO: Content Security Policy (CSP) Header Not Set

- **CWE:** CWE-693 (Unknown)
- **Tool:** browser-scanner

**Description:**
Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks, including Cross Site Scripting (XSS) and data injection attacks. These attacks are used for everything from data theft to site defacement or distribution of malware. CSP provides a set of standard HTTP headers that allow website owners to declare approved sources of content that browsers should be allowed to load on that page — covered types are JavaScript, CSS, HTML frames, fonts, images and embeddable objects such as Java applets, ActiveX, audio and video files.

**Evidence:**
```
{
  "url": "https://claude1-f630a.web.app/test.php"
}
```


#### INFO: Content Security Policy (CSP) Header Not Set

- **CWE:** CWE-693 (Unknown)
- **Tool:** browser-scanner

**Description:**
Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks, including Cross Site Scripting (XSS) and data injection attacks. These attacks are used for everything from data theft to site defacement or distribution of malware. CSP provides a set of standard HTTP headers that allow website owners to declare approved sources of content that browsers should be allowed to load on that page — covered types are JavaScript, CSS, HTML frames, fonts, images and embeddable objects such as Java applets, ActiveX, audio and video files.

**Evidence:**
```
{
  "url": "https://claude1-f630a.web.app/backup.zip"
}
```


#### INFO: Content Security Policy (CSP) Header Not Set

- **CWE:** CWE-693 (Unknown)
- **Tool:** browser-scanner

**Description:**
Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks, including Cross Site Scripting (XSS) and data injection attacks. These attacks are used for everything from data theft to site defacement or distribution of malware. CSP provides a set of standard HTTP headers that allow website owners to declare approved sources of content that browsers should be allowed to load on that page — covered types are JavaScript, CSS, HTML frames, fonts, images and embeddable objects such as Java applets, ActiveX, audio and video files.

**Evidence:**
```
{
  "url": "https://claude1-f630a.web.app/backup.tar.gz"
}
```


#### INFO: Content Security Policy (CSP) Header Not Set

- **CWE:** CWE-693 (Unknown)
- **Tool:** browser-scanner

**Description:**
Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks, including Cross Site Scripting (XSS) and data injection attacks. These attacks are used for everything from data theft to site defacement or distribution of malware. CSP provides a set of standard HTTP headers that allow website owners to declare approved sources of content that browsers should be allowed to load on that page — covered types are JavaScript, CSS, HTML frames, fonts, images and embeddable objects such as Java applets, ActiveX, audio and video files.

**Evidence:**
```
{
  "url": "https://claude1-f630a.web.app/backup.sql"
}
```


#### INFO: Content Security Policy (CSP) Header Not Set

- **CWE:** CWE-693 (Unknown)
- **Tool:** browser-scanner

**Description:**
Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks, including Cross Site Scripting (XSS) and data injection attacks. These attacks are used for everything from data theft to site defacement or distribution of malware. CSP provides a set of standard HTTP headers that allow website owners to declare approved sources of content that browsers should be allowed to load on that page — covered types are JavaScript, CSS, HTML frames, fonts, images and embeddable objects such as Java applets, ActiveX, audio and video files.

**Evidence:**
```
{
  "url": "https://claude1-f630a.web.app/dump.sql"
}
```


#### INFO: Content Security Policy (CSP) Header Not Set

- **CWE:** CWE-693 (Unknown)
- **Tool:** browser-scanner

**Description:**
Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks, including Cross Site Scripting (XSS) and data injection attacks. These attacks are used for everything from data theft to site defacement or distribution of malware. CSP provides a set of standard HTTP headers that allow website owners to declare approved sources of content that browsers should be allowed to load on that page — covered types are JavaScript, CSS, HTML frames, fonts, images and embeddable objects such as Java applets, ActiveX, audio and video files.

**Evidence:**
```
{
  "url": "https://claude1-f630a.web.app/db.sql"
}
```


#### INFO: Content Security Policy (CSP) Header Not Set

- **CWE:** CWE-693 (Unknown)
- **Tool:** browser-scanner

**Description:**
Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks, including Cross Site Scripting (XSS) and data injection attacks. These attacks are used for everything from data theft to site defacement or distribution of malware. CSP provides a set of standard HTTP headers that allow website owners to declare approved sources of content that browsers should be allowed to load on that page — covered types are JavaScript, CSS, HTML frames, fonts, images and embeddable objects such as Java applets, ActiveX, audio and video files.

**Evidence:**
```
{
  "url": "https://claude1-f630a.web.app/server-status"
}
```


#### INFO: Content Security Policy (CSP) Header Not Set

- **CWE:** CWE-693 (Unknown)
- **Tool:** browser-scanner

**Description:**
Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks, including Cross Site Scripting (XSS) and data injection attacks. These attacks are used for everything from data theft to site defacement or distribution of malware. CSP provides a set of standard HTTP headers that allow website owners to declare approved sources of content that browsers should be allowed to load on that page — covered types are JavaScript, CSS, HTML frames, fonts, images and embeddable objects such as Java applets, ActiveX, audio and video files.

**Evidence:**
```
{
  "url": "https://claude1-f630a.web.app/server-info"
}
```


#### INFO: Content Security Policy (CSP) Header Not Set

- **CWE:** CWE-693 (Unknown)
- **Tool:** browser-scanner

**Description:**
Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks, including Cross Site Scripting (XSS) and data injection attacks. These attacks are used for everything from data theft to site defacement or distribution of malware. CSP provides a set of standard HTTP headers that allow website owners to declare approved sources of content that browsers should be allowed to load on that page — covered types are JavaScript, CSS, HTML frames, fonts, images and embeddable objects such as Java applets, ActiveX, audio and video files.

**Evidence:**
```
{
  "url": "https://claude1-f630a.web.app/.DS_Store"
}
```


#### INFO: Content Security Policy (CSP) Header Not Set

- **CWE:** CWE-693 (Unknown)
- **Tool:** browser-scanner

**Description:**
Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks, including Cross Site Scripting (XSS) and data injection attacks. These attacks are used for everything from data theft to site defacement or distribution of malware. CSP provides a set of standard HTTP headers that allow website owners to declare approved sources of content that browsers should be allowed to load on that page — covered types are JavaScript, CSS, HTML frames, fonts, images and embeddable objects such as Java applets, ActiveX, audio and video files.

**Evidence:**
```
{
  "url": "https://claude1-f630a.web.app/Thumbs.db"
}
```


#### INFO: Content Security Policy (CSP) Header Not Set

- **CWE:** CWE-693 (Unknown)
- **Tool:** browser-scanner

**Description:**
Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks, including Cross Site Scripting (XSS) and data injection attacks. These attacks are used for everything from data theft to site defacement or distribution of malware. CSP provides a set of standard HTTP headers that allow website owners to declare approved sources of content that browsers should be allowed to load on that page — covered types are JavaScript, CSS, HTML frames, fonts, images and embeddable objects such as Java applets, ActiveX, audio and video files.

**Evidence:**
```
{
  "url": "https://claude1-f630a.web.app/WEB-INF/web.xml"
}
```


#### INFO: Content Security Policy (CSP) Header Not Set

- **CWE:** CWE-693 (Unknown)
- **Tool:** browser-scanner

**Description:**
Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks, including Cross Site Scripting (XSS) and data injection attacks. These attacks are used for everything from data theft to site defacement or distribution of malware. CSP provides a set of standard HTTP headers that allow website owners to declare approved sources of content that browsers should be allowed to load on that page — covered types are JavaScript, CSS, HTML frames, fonts, images and embeddable objects such as Java applets, ActiveX, audio and video files.

**Evidence:**
```
{
  "url": "https://claude1-f630a.web.app/META-INF/MANIFEST.MF"
}
```


#### INFO: Content Security Policy (CSP) Header Not Set

- **CWE:** CWE-693 (Unknown)
- **Tool:** browser-scanner

**Description:**
Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks, including Cross Site Scripting (XSS) and data injection attacks. These attacks are used for everything from data theft to site defacement or distribution of malware. CSP provides a set of standard HTTP headers that allow website owners to declare approved sources of content that browsers should be allowed to load on that page — covered types are JavaScript, CSS, HTML frames, fonts, images and embeddable objects such as Java applets, ActiveX, audio and video files.

**Evidence:**
```
{
  "url": "https://claude1-f630a.web.app/.svn/entries"
}
```


#### INFO: Content Security Policy (CSP) Header Not Set

- **CWE:** CWE-693 (Unknown)
- **Tool:** browser-scanner

**Description:**
Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks, including Cross Site Scripting (XSS) and data injection attacks. These attacks are used for everything from data theft to site defacement or distribution of malware. CSP provides a set of standard HTTP headers that allow website owners to declare approved sources of content that browsers should be allowed to load on that page — covered types are JavaScript, CSS, HTML frames, fonts, images and embeddable objects such as Java applets, ActiveX, audio and video files.

**Evidence:**
```
{
  "url": "https://claude1-f630a.web.app/.svn/wc.db"
}
```


#### INFO: Content Security Policy (CSP) Header Not Set

- **CWE:** CWE-693 (Unknown)
- **Tool:** browser-scanner

**Description:**
Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks, including Cross Site Scripting (XSS) and data injection attacks. These attacks are used for everything from data theft to site defacement or distribution of malware. CSP provides a set of standard HTTP headers that allow website owners to declare approved sources of content that browsers should be allowed to load on that page — covered types are JavaScript, CSS, HTML frames, fonts, images and embeddable objects such as Java applets, ActiveX, audio and video files.

**Evidence:**
```
{
  "url": "https://claude1-f630a.web.app/.hg/hgrc"
}
```


#### INFO: Content Security Policy (CSP) Header Not Set

- **CWE:** CWE-693 (Unknown)
- **Tool:** browser-scanner

**Description:**
Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks, including Cross Site Scripting (XSS) and data injection attacks. These attacks are used for everything from data theft to site defacement or distribution of malware. CSP provides a set of standard HTTP headers that allow website owners to declare approved sources of content that browsers should be allowed to load on that page — covered types are JavaScript, CSS, HTML frames, fonts, images and embeddable objects such as Java applets, ActiveX, audio and video files.

**Evidence:**
```
{
  "url": "https://claude1-f630a.web.app/admin.html"
}
```


#### INFO: Content Security Policy (CSP) Header Not Set

- **CWE:** CWE-693 (Unknown)
- **Tool:** browser-scanner

**Description:**
Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks, including Cross Site Scripting (XSS) and data injection attacks. These attacks are used for everything from data theft to site defacement or distribution of malware. CSP provides a set of standard HTTP headers that allow website owners to declare approved sources of content that browsers should be allowed to load on that page — covered types are JavaScript, CSS, HTML frames, fonts, images and embeddable objects such as Java applets, ActiveX, audio and video files.

**Evidence:**
```
{
  "url": "https://claude1-f630a.web.app/administrator.html"
}
```


#### INFO: Content Security Policy (CSP) Header Not Set

- **CWE:** CWE-693 (Unknown)
- **Tool:** browser-scanner

**Description:**
Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks, including Cross Site Scripting (XSS) and data injection attacks. These attacks are used for everything from data theft to site defacement or distribution of malware. CSP provides a set of standard HTTP headers that allow website owners to declare approved sources of content that browsers should be allowed to load on that page — covered types are JavaScript, CSS, HTML frames, fonts, images and embeddable objects such as Java applets, ActiveX, audio and video files.

**Evidence:**
```
{
  "url": "https://claude1-f630a.web.app/login.html"
}
```


#### INFO: Content Security Policy (CSP) Header Not Set

- **CWE:** CWE-693 (Unknown)
- **Tool:** browser-scanner

**Description:**
Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks, including Cross Site Scripting (XSS) and data injection attacks. These attacks are used for everything from data theft to site defacement or distribution of malware. CSP provides a set of standard HTTP headers that allow website owners to declare approved sources of content that browsers should be allowed to load on that page — covered types are JavaScript, CSS, HTML frames, fonts, images and embeddable objects such as Java applets, ActiveX, audio and video files.

**Evidence:**
```
{
  "url": "https://claude1-f630a.web.app/id_rsa"
}
```


#### INFO: Content Security Policy (CSP) Header Not Set

- **CWE:** CWE-693 (Unknown)
- **Tool:** browser-scanner

**Description:**
Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks, including Cross Site Scripting (XSS) and data injection attacks. These attacks are used for everything from data theft to site defacement or distribution of malware. CSP provides a set of standard HTTP headers that allow website owners to declare approved sources of content that browsers should be allowed to load on that page — covered types are JavaScript, CSS, HTML frames, fonts, images and embeddable objects such as Java applets, ActiveX, audio and video files.

**Evidence:**
```
{
  "url": "https://claude1-f630a.web.app/id_rsa.pub"
}
```


#### INFO: Content Security Policy (CSP) Header Not Set

- **CWE:** CWE-693 (Unknown)
- **Tool:** browser-scanner

**Description:**
Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks, including Cross Site Scripting (XSS) and data injection attacks. These attacks are used for everything from data theft to site defacement or distribution of malware. CSP provides a set of standard HTTP headers that allow website owners to declare approved sources of content that browsers should be allowed to load on that page — covered types are JavaScript, CSS, HTML frames, fonts, images and embeddable objects such as Java applets, ActiveX, audio and video files.

**Evidence:**
```
{
  "url": "https://claude1-f630a.web.app/.ssh/authorized_keys"
}
```


#### INFO: Content Security Policy (CSP) Header Not Set

- **CWE:** CWE-693 (Unknown)
- **Tool:** browser-scanner

**Description:**
Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks, including Cross Site Scripting (XSS) and data injection attacks. These attacks are used for everything from data theft to site defacement or distribution of malware. CSP provides a set of standard HTTP headers that allow website owners to declare approved sources of content that browsers should be allowed to load on that page — covered types are JavaScript, CSS, HTML frames, fonts, images and embeddable objects such as Java applets, ActiveX, audio and video files.

**Evidence:**
```
{
  "url": "https://claude1-f630a.web.app/credentials.json"
}
```


#### INFO: Content Security Policy (CSP) Header Not Set

- **CWE:** CWE-693 (Unknown)
- **Tool:** browser-scanner

**Description:**
Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks, including Cross Site Scripting (XSS) and data injection attacks. These attacks are used for everything from data theft to site defacement or distribution of malware. CSP provides a set of standard HTTP headers that allow website owners to declare approved sources of content that browsers should be allowed to load on that page — covered types are JavaScript, CSS, HTML frames, fonts, images and embeddable objects such as Java applets, ActiveX, audio and video files.

**Evidence:**
```
{
  "url": "https://claude1-f630a.web.app/secrets.json"
}
```


#### INFO: Content Security Policy (CSP) Header Not Set

- **CWE:** CWE-693 (Unknown)
- **Tool:** browser-scanner

**Description:**
Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks, including Cross Site Scripting (XSS) and data injection attacks. These attacks are used for everything from data theft to site defacement or distribution of malware. CSP provides a set of standard HTTP headers that allow website owners to declare approved sources of content that browsers should be allowed to load on that page — covered types are JavaScript, CSS, HTML frames, fonts, images and embeddable objects such as Java applets, ActiveX, audio and video files.

**Evidence:**
```
{
  "url": "https://claude1-f630a.web.app/keys.json"
}
```


#### INFO: Content Security Policy (CSP) Header Not Set

- **CWE:** CWE-693 (Unknown)
- **Tool:** browser-scanner

**Description:**
Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks, including Cross Site Scripting (XSS) and data injection attacks. These attacks are used for everything from data theft to site defacement or distribution of malware. CSP provides a set of standard HTTP headers that allow website owners to declare approved sources of content that browsers should be allowed to load on that page — covered types are JavaScript, CSS, HTML frames, fonts, images and embeddable objects such as Java applets, ActiveX, audio and video files.

**Evidence:**
```
{
  "url": "https://claude1-f630a.web.app/api-docs"
}
```


#### INFO: Content Security Policy (CSP) Header Not Set

- **CWE:** CWE-693 (Unknown)
- **Tool:** browser-scanner

**Description:**
Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks, including Cross Site Scripting (XSS) and data injection attacks. These attacks are used for everything from data theft to site defacement or distribution of malware. CSP provides a set of standard HTTP headers that allow website owners to declare approved sources of content that browsers should be allowed to load on that page — covered types are JavaScript, CSS, HTML frames, fonts, images and embeddable objects such as Java applets, ActiveX, audio and video files.

**Evidence:**
```
{
  "url": "https://claude1-f630a.web.app/swagger"
}
```


#### INFO: Content Security Policy (CSP) Header Not Set

- **CWE:** CWE-693 (Unknown)
- **Tool:** browser-scanner

**Description:**
Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks, including Cross Site Scripting (XSS) and data injection attacks. These attacks are used for everything from data theft to site defacement or distribution of malware. CSP provides a set of standard HTTP headers that allow website owners to declare approved sources of content that browsers should be allowed to load on that page — covered types are JavaScript, CSS, HTML frames, fonts, images and embeddable objects such as Java applets, ActiveX, audio and video files.

**Evidence:**
```
{
  "url": "https://claude1-f630a.web.app/swagger-ui"
}
```


#### INFO: Content Security Policy (CSP) Header Not Set

- **CWE:** CWE-693 (Unknown)
- **Tool:** browser-scanner

**Description:**
Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks, including Cross Site Scripting (XSS) and data injection attacks. These attacks are used for everything from data theft to site defacement or distribution of malware. CSP provides a set of standard HTTP headers that allow website owners to declare approved sources of content that browsers should be allowed to load on that page — covered types are JavaScript, CSS, HTML frames, fonts, images and embeddable objects such as Java applets, ActiveX, audio and video files.

**Evidence:**
```
{
  "url": "https://claude1-f630a.web.app/swagger-ui.html"
}
```


#### INFO: Content Security Policy (CSP) Header Not Set

- **CWE:** CWE-693 (Unknown)
- **Tool:** browser-scanner

**Description:**
Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks, including Cross Site Scripting (XSS) and data injection attacks. These attacks are used for everything from data theft to site defacement or distribution of malware. CSP provides a set of standard HTTP headers that allow website owners to declare approved sources of content that browsers should be allowed to load on that page — covered types are JavaScript, CSS, HTML frames, fonts, images and embeddable objects such as Java applets, ActiveX, audio and video files.

**Evidence:**
```
{
  "url": "https://claude1-f630a.web.app/swagger.json"
}
```


#### INFO: Content Security Policy (CSP) Header Not Set

- **CWE:** CWE-693 (Unknown)
- **Tool:** browser-scanner

**Description:**
Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks, including Cross Site Scripting (XSS) and data injection attacks. These attacks are used for everything from data theft to site defacement or distribution of malware. CSP provides a set of standard HTTP headers that allow website owners to declare approved sources of content that browsers should be allowed to load on that page — covered types are JavaScript, CSS, HTML frames, fonts, images and embeddable objects such as Java applets, ActiveX, audio and video files.

**Evidence:**
```
{
  "url": "https://claude1-f630a.web.app/swagger.yaml"
}
```


#### INFO: Content Security Policy (CSP) Header Not Set

- **CWE:** CWE-693 (Unknown)
- **Tool:** browser-scanner

**Description:**
Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks, including Cross Site Scripting (XSS) and data injection attacks. These attacks are used for everything from data theft to site defacement or distribution of malware. CSP provides a set of standard HTTP headers that allow website owners to declare approved sources of content that browsers should be allowed to load on that page — covered types are JavaScript, CSS, HTML frames, fonts, images and embeddable objects such as Java applets, ActiveX, audio and video files.

**Evidence:**
```
{
  "url": "https://claude1-f630a.web.app/openapi"
}
```


#### INFO: Content Security Policy (CSP) Header Not Set

- **CWE:** CWE-693 (Unknown)
- **Tool:** browser-scanner

**Description:**
Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks, including Cross Site Scripting (XSS) and data injection attacks. These attacks are used for everything from data theft to site defacement or distribution of malware. CSP provides a set of standard HTTP headers that allow website owners to declare approved sources of content that browsers should be allowed to load on that page — covered types are JavaScript, CSS, HTML frames, fonts, images and embeddable objects such as Java applets, ActiveX, audio and video files.

**Evidence:**
```
{
  "url": "https://claude1-f630a.web.app/openapi.json"
}
```


#### INFO: Content Security Policy (CSP) Header Not Set

- **CWE:** CWE-693 (Unknown)
- **Tool:** browser-scanner

**Description:**
Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks, including Cross Site Scripting (XSS) and data injection attacks. These attacks are used for everything from data theft to site defacement or distribution of malware. CSP provides a set of standard HTTP headers that allow website owners to declare approved sources of content that browsers should be allowed to load on that page — covered types are JavaScript, CSS, HTML frames, fonts, images and embeddable objects such as Java applets, ActiveX, audio and video files.

**Evidence:**
```
{
  "url": "https://claude1-f630a.web.app/openapi.yaml"
}
```


#### INFO: Content Security Policy (CSP) Header Not Set

- **CWE:** CWE-693 (Unknown)
- **Tool:** browser-scanner

**Description:**
Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks, including Cross Site Scripting (XSS) and data injection attacks. These attacks are used for everything from data theft to site defacement or distribution of malware. CSP provides a set of standard HTTP headers that allow website owners to declare approved sources of content that browsers should be allowed to load on that page — covered types are JavaScript, CSS, HTML frames, fonts, images and embeddable objects such as Java applets, ActiveX, audio and video files.

**Evidence:**
```
{
  "url": "https://claude1-f630a.web.app/api/docs"
}
```


#### INFO: Content Security Policy (CSP) Header Not Set

- **CWE:** CWE-693 (Unknown)
- **Tool:** browser-scanner

**Description:**
Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks, including Cross Site Scripting (XSS) and data injection attacks. These attacks are used for everything from data theft to site defacement or distribution of malware. CSP provides a set of standard HTTP headers that allow website owners to declare approved sources of content that browsers should be allowed to load on that page — covered types are JavaScript, CSS, HTML frames, fonts, images and embeddable objects such as Java applets, ActiveX, audio and video files.

**Evidence:**
```
{
  "url": "https://claude1-f630a.web.app/api/swagger"
}
```


#### INFO: Content Security Policy (CSP) Header Not Set

- **CWE:** CWE-693 (Unknown)
- **Tool:** browser-scanner

**Description:**
Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks, including Cross Site Scripting (XSS) and data injection attacks. These attacks are used for everything from data theft to site defacement or distribution of malware. CSP provides a set of standard HTTP headers that allow website owners to declare approved sources of content that browsers should be allowed to load on that page — covered types are JavaScript, CSS, HTML frames, fonts, images and embeddable objects such as Java applets, ActiveX, audio and video files.

**Evidence:**
```
{
  "url": "https://claude1-f630a.web.app/v1/api-docs"
}
```


#### INFO: Content Security Policy (CSP) Header Not Set

- **CWE:** CWE-693 (Unknown)
- **Tool:** browser-scanner

**Description:**
Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks, including Cross Site Scripting (XSS) and data injection attacks. These attacks are used for everything from data theft to site defacement or distribution of malware. CSP provides a set of standard HTTP headers that allow website owners to declare approved sources of content that browsers should be allowed to load on that page — covered types are JavaScript, CSS, HTML frames, fonts, images and embeddable objects such as Java applets, ActiveX, audio and video files.

**Evidence:**
```
{
  "url": "https://claude1-f630a.web.app/v2/api-docs"
}
```


#### INFO: Content Security Policy (CSP) Header Not Set

- **CWE:** CWE-693 (Unknown)
- **Tool:** browser-scanner

**Description:**
Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks, including Cross Site Scripting (XSS) and data injection attacks. These attacks are used for everything from data theft to site defacement or distribution of malware. CSP provides a set of standard HTTP headers that allow website owners to declare approved sources of content that browsers should be allowed to load on that page — covered types are JavaScript, CSS, HTML frames, fonts, images and embeddable objects such as Java applets, ActiveX, audio and video files.

**Evidence:**
```
{
  "url": "https://claude1-f630a.web.app/v3/api-docs"
}
```


#### INFO: Content Security Policy (CSP) Header Not Set

- **CWE:** CWE-693 (Unknown)
- **Tool:** browser-scanner

**Description:**
Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks, including Cross Site Scripting (XSS) and data injection attacks. These attacks are used for everything from data theft to site defacement or distribution of malware. CSP provides a set of standard HTTP headers that allow website owners to declare approved sources of content that browsers should be allowed to load on that page — covered types are JavaScript, CSS, HTML frames, fonts, images and embeddable objects such as Java applets, ActiveX, audio and video files.

**Evidence:**
```
{
  "url": "https://claude1-f630a.web.app/graphql"
}
```


#### INFO: Content Security Policy (CSP) Header Not Set

- **CWE:** CWE-693 (Unknown)
- **Tool:** browser-scanner

**Description:**
Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks, including Cross Site Scripting (XSS) and data injection attacks. These attacks are used for everything from data theft to site defacement or distribution of malware. CSP provides a set of standard HTTP headers that allow website owners to declare approved sources of content that browsers should be allowed to load on that page — covered types are JavaScript, CSS, HTML frames, fonts, images and embeddable objects such as Java applets, ActiveX, audio and video files.

**Evidence:**
```
{
  "url": "https://claude1-f630a.web.app/graphiql"
}
```


#### INFO: Content Security Policy (CSP) Header Not Set

- **CWE:** CWE-693 (Unknown)
- **Tool:** browser-scanner

**Description:**
Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks, including Cross Site Scripting (XSS) and data injection attacks. These attacks are used for everything from data theft to site defacement or distribution of malware. CSP provides a set of standard HTTP headers that allow website owners to declare approved sources of content that browsers should be allowed to load on that page — covered types are JavaScript, CSS, HTML frames, fonts, images and embeddable objects such as Java applets, ActiveX, audio and video files.

**Evidence:**
```
{
  "url": "https://claude1-f630a.web.app/?wsdl"
}
```


#### INFO: Content Security Policy (CSP) Header Not Set

- **CWE:** CWE-693 (Unknown)
- **Tool:** browser-scanner

**Description:**
Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks, including Cross Site Scripting (XSS) and data injection attacks. These attacks are used for everything from data theft to site defacement or distribution of malware. CSP provides a set of standard HTTP headers that allow website owners to declare approved sources of content that browsers should be allowed to load on that page — covered types are JavaScript, CSS, HTML frames, fonts, images and embeddable objects such as Java applets, ActiveX, audio and video files.

**Evidence:**
```
{
  "url": "https://claude1-f630a.web.app/service?wsdl"
}
```


#### INFO: Content Security Policy (CSP) Header Not Set

- **CWE:** CWE-693 (Unknown)
- **Tool:** browser-scanner

**Description:**
Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks, including Cross Site Scripting (XSS) and data injection attacks. These attacks are used for everything from data theft to site defacement or distribution of malware. CSP provides a set of standard HTTP headers that allow website owners to declare approved sources of content that browsers should be allowed to load on that page — covered types are JavaScript, CSS, HTML frames, fonts, images and embeddable objects such as Java applets, ActiveX, audio and video files.

**Evidence:**
```
{
  "url": "https://claude1-f630a.web.app/api?wsdl"
}
```


#### INFO: Content Security Policy (CSP) Header Not Set

- **CWE:** CWE-693 (Unknown)
- **Tool:** browser-scanner

**Description:**
Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks, including Cross Site Scripting (XSS) and data injection attacks. These attacks are used for everything from data theft to site defacement or distribution of malware. CSP provides a set of standard HTTP headers that allow website owners to declare approved sources of content that browsers should be allowed to load on that page — covered types are JavaScript, CSS, HTML frames, fonts, images and embeddable objects such as Java applets, ActiveX, audio and video files.

**Evidence:**
```
{
  "url": "https://claude1-f630a.web.app/ws?wsdl"
}
```


#### INFO: Content Security Policy (CSP) Header Not Set

- **CWE:** CWE-693 (Unknown)
- **Tool:** browser-scanner

**Description:**
Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks, including Cross Site Scripting (XSS) and data injection attacks. These attacks are used for everything from data theft to site defacement or distribution of malware. CSP provides a set of standard HTTP headers that allow website owners to declare approved sources of content that browsers should be allowed to load on that page — covered types are JavaScript, CSS, HTML frames, fonts, images and embeddable objects such as Java applets, ActiveX, audio and video files.

**Evidence:**
```
{
  "url": "https://claude1-f630a.web.app/redoc"
}
```


#### INFO: Content Security Policy (CSP) Header Not Set

- **CWE:** CWE-693 (Unknown)
- **Tool:** browser-scanner

**Description:**
Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks, including Cross Site Scripting (XSS) and data injection attacks. These attacks are used for everything from data theft to site defacement or distribution of malware. CSP provides a set of standard HTTP headers that allow website owners to declare approved sources of content that browsers should be allowed to load on that page — covered types are JavaScript, CSS, HTML frames, fonts, images and embeddable objects such as Java applets, ActiveX, audio and video files.

**Evidence:**
```
{
  "url": "https://claude1-f630a.web.app/api-explorer"
}
```


#### INFO: Content Security Policy (CSP) Header Not Set

- **CWE:** CWE-693 (Unknown)
- **Tool:** browser-scanner

**Description:**
Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks, including Cross Site Scripting (XSS) and data injection attacks. These attacks are used for everything from data theft to site defacement or distribution of malware. CSP provides a set of standard HTTP headers that allow website owners to declare approved sources of content that browsers should be allowed to load on that page — covered types are JavaScript, CSS, HTML frames, fonts, images and embeddable objects such as Java applets, ActiveX, audio and video files.

**Evidence:**
```
{
  "url": "https://claude1-f630a.web.app/developer"
}
```


#### INFO: Content Security Policy (CSP) Header Not Set

- **CWE:** CWE-693 (Unknown)
- **Tool:** browser-scanner

**Description:**
Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks, including Cross Site Scripting (XSS) and data injection attacks. These attacks are used for everything from data theft to site defacement or distribution of malware. CSP provides a set of standard HTTP headers that allow website owners to declare approved sources of content that browsers should be allowed to load on that page — covered types are JavaScript, CSS, HTML frames, fonts, images and embeddable objects such as Java applets, ActiveX, audio and video files.

**Evidence:**
```
{
  "url": "https://claude1-f630a.web.app/developers"
}
```


#### INFO: Content Security Policy (CSP) Header Not Set

- **CWE:** CWE-693 (Unknown)
- **Tool:** browser-scanner

**Description:**
Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks, including Cross Site Scripting (XSS) and data injection attacks. These attacks are used for everything from data theft to site defacement or distribution of malware. CSP provides a set of standard HTTP headers that allow website owners to declare approved sources of content that browsers should be allowed to load on that page — covered types are JavaScript, CSS, HTML frames, fonts, images and embeddable objects such as Java applets, ActiveX, audio and video files.

**Evidence:**
```
{
  "url": "https://claude1-f630a.web.app/?url=http%3A%2F%2F127.0.0.1%3A22"
}
```


#### INFO: Content Security Policy (CSP) Header Not Set

- **CWE:** CWE-693 (Unknown)
- **Tool:** browser-scanner

**Description:**
Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks, including Cross Site Scripting (XSS) and data injection attacks. These attacks are used for everything from data theft to site defacement or distribution of malware. CSP provides a set of standard HTTP headers that allow website owners to declare approved sources of content that browsers should be allowed to load on that page — covered types are JavaScript, CSS, HTML frames, fonts, images and embeddable objects such as Java applets, ActiveX, audio and video files.

**Evidence:**
```
{
  "url": "https://claude1-f630a.web.app/?url=http%3A%2F%2F169.254.169.254%2Flatest%2Fmeta-data%2F"
}
```


#### INFO: Content Security Policy (CSP) Header Not Set

- **CWE:** CWE-693 (Unknown)
- **Tool:** browser-scanner

**Description:**
Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks, including Cross Site Scripting (XSS) and data injection attacks. These attacks are used for everything from data theft to site defacement or distribution of malware. CSP provides a set of standard HTTP headers that allow website owners to declare approved sources of content that browsers should be allowed to load on that page — covered types are JavaScript, CSS, HTML frames, fonts, images and embeddable objects such as Java applets, ActiveX, audio and video files.

**Evidence:**
```
{
  "url": "https://claude1-f630a.web.app/?uri=http%3A%2F%2F127.0.0.1%3A22"
}
```


#### INFO: Content Security Policy (CSP) Header Not Set

- **CWE:** CWE-693 (Unknown)
- **Tool:** browser-scanner

**Description:**
Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks, including Cross Site Scripting (XSS) and data injection attacks. These attacks are used for everything from data theft to site defacement or distribution of malware. CSP provides a set of standard HTTP headers that allow website owners to declare approved sources of content that browsers should be allowed to load on that page — covered types are JavaScript, CSS, HTML frames, fonts, images and embeddable objects such as Java applets, ActiveX, audio and video files.

**Evidence:**
```
{
  "url": "https://claude1-f630a.web.app/?uri=http%3A%2F%2F169.254.169.254%2Flatest%2Fmeta-data%2F"
}
```


#### INFO: Content Security Policy (CSP) Header Not Set

- **CWE:** CWE-693 (Unknown)
- **Tool:** browser-scanner

**Description:**
Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks, including Cross Site Scripting (XSS) and data injection attacks. These attacks are used for everything from data theft to site defacement or distribution of malware. CSP provides a set of standard HTTP headers that allow website owners to declare approved sources of content that browsers should be allowed to load on that page — covered types are JavaScript, CSS, HTML frames, fonts, images and embeddable objects such as Java applets, ActiveX, audio and video files.

**Evidence:**
```
{
  "url": "https://claude1-f630a.web.app/?path=http%3A%2F%2F127.0.0.1%3A22"
}
```


#### INFO: Content Security Policy (CSP) Header Not Set

- **CWE:** CWE-693 (Unknown)
- **Tool:** browser-scanner

**Description:**
Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks, including Cross Site Scripting (XSS) and data injection attacks. These attacks are used for everything from data theft to site defacement or distribution of malware. CSP provides a set of standard HTTP headers that allow website owners to declare approved sources of content that browsers should be allowed to load on that page — covered types are JavaScript, CSS, HTML frames, fonts, images and embeddable objects such as Java applets, ActiveX, audio and video files.

**Evidence:**
```
{
  "url": "https://claude1-f630a.web.app/?path=http%3A%2F%2F169.254.169.254%2Flatest%2Fmeta-data%2F"
}
```


#### INFO: Content Security Policy (CSP) Header Not Set

- **CWE:** CWE-693 (Unknown)
- **Tool:** browser-scanner

**Description:**
Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks, including Cross Site Scripting (XSS) and data injection attacks. These attacks are used for everything from data theft to site defacement or distribution of malware. CSP provides a set of standard HTTP headers that allow website owners to declare approved sources of content that browsers should be allowed to load on that page — covered types are JavaScript, CSS, HTML frames, fonts, images and embeddable objects such as Java applets, ActiveX, audio and video files.

**Evidence:**
```
{
  "url": "https://claude1-f630a.web.app/?src=http%3A%2F%2F127.0.0.1%3A22"
}
```


#### INFO: Content Security Policy (CSP) Header Not Set

- **CWE:** CWE-693 (Unknown)
- **Tool:** browser-scanner

**Description:**
Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks, including Cross Site Scripting (XSS) and data injection attacks. These attacks are used for everything from data theft to site defacement or distribution of malware. CSP provides a set of standard HTTP headers that allow website owners to declare approved sources of content that browsers should be allowed to load on that page — covered types are JavaScript, CSS, HTML frames, fonts, images and embeddable objects such as Java applets, ActiveX, audio and video files.

**Evidence:**
```
{
  "url": "https://claude1-f630a.web.app/?src=http%3A%2F%2F169.254.169.254%2Flatest%2Fmeta-data%2F"
}
```


#### INFO: Content Security Policy (CSP) Header Not Set

- **CWE:** CWE-693 (Unknown)
- **Tool:** browser-scanner

**Description:**
Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks, including Cross Site Scripting (XSS) and data injection attacks. These attacks are used for everything from data theft to site defacement or distribution of malware. CSP provides a set of standard HTTP headers that allow website owners to declare approved sources of content that browsers should be allowed to load on that page — covered types are JavaScript, CSS, HTML frames, fonts, images and embeddable objects such as Java applets, ActiveX, audio and video files.

**Evidence:**
```
{
  "url": "https://claude1-f630a.web.app/?source=http%3A%2F%2F127.0.0.1%3A22"
}
```


#### INFO: Content Security Policy (CSP) Header Not Set

- **CWE:** CWE-693 (Unknown)
- **Tool:** browser-scanner

**Description:**
Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks, including Cross Site Scripting (XSS) and data injection attacks. These attacks are used for everything from data theft to site defacement or distribution of malware. CSP provides a set of standard HTTP headers that allow website owners to declare approved sources of content that browsers should be allowed to load on that page — covered types are JavaScript, CSS, HTML frames, fonts, images and embeddable objects such as Java applets, ActiveX, audio and video files.

**Evidence:**
```
{
  "url": "https://claude1-f630a.web.app/?source=http%3A%2F%2F169.254.169.254%2Flatest%2Fmeta-data%2F"
}
```


#### INFO: Content Security Policy (CSP) Header Not Set

- **CWE:** CWE-693 (Unknown)
- **Tool:** browser-scanner

**Description:**
Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks, including Cross Site Scripting (XSS) and data injection attacks. These attacks are used for everything from data theft to site defacement or distribution of malware. CSP provides a set of standard HTTP headers that allow website owners to declare approved sources of content that browsers should be allowed to load on that page — covered types are JavaScript, CSS, HTML frames, fonts, images and embeddable objects such as Java applets, ActiveX, audio and video files.

**Evidence:**
```
{
  "url": "https://claude1-f630a.web.app/?link=http%3A%2F%2F127.0.0.1%3A22"
}
```


#### INFO: Content Security Policy (CSP) Header Not Set

- **CWE:** CWE-693 (Unknown)
- **Tool:** browser-scanner

**Description:**
Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks, including Cross Site Scripting (XSS) and data injection attacks. These attacks are used for everything from data theft to site defacement or distribution of malware. CSP provides a set of standard HTTP headers that allow website owners to declare approved sources of content that browsers should be allowed to load on that page — covered types are JavaScript, CSS, HTML frames, fonts, images and embeddable objects such as Java applets, ActiveX, audio and video files.

**Evidence:**
```
{
  "detail": "N/A",
  "url": "https://claude1-f630a.web.app/?link=http%3A%2F%2F169.254.169.254%2Flatest%2Fmeta-data%2F",
  "type": "ZAP-10038-1"
}
```


#### INFO: Information Disclosure - Suspicious Comments

- **CWE:** CWE-615 (Unknown)
- **Tool:** browser-scanner

**Description:**
The response appears to contain suspicious comments which may help an attacker.

**Evidence:**
```
{
  "detail": "select",
  "url": "https://claude1-f630a.web.app/assets/index-Ksqx9DM4.js",
  "type": "ZAP-10027"
}
```


#### INFO: Missing Anti-clickjacking Header

- **CWE:** CWE-1021 (Unknown)
- **Tool:** browser-scanner

**Description:**
The response does not protect against 'ClickJacking' attacks. It should include either Content-Security-Policy with 'frame-ancestors' directive or X-Frame-Options.

**Evidence:**
```
{
  "detail": "N/A",
  "url": "https://claude1-f630a.web.app/login",
  "type": "ZAP-10020-1"
}
```


#### INFO: Missing Anti-clickjacking Header

- **CWE:** CWE-1021 (Unknown)
- **Tool:** browser-scanner

**Description:**
The response does not protect against 'ClickJacking' attacks. It should include either Content-Security-Policy with 'frame-ancestors' directive or X-Frame-Options.

**Evidence:**
```
{
  "detail": "N/A",
  "url": "https://claude1-f630a.web.app/",
  "type": "ZAP-10020-1"
}
```


#### INFO: Missing Anti-clickjacking Header

- **CWE:** CWE-1021 (Unknown)
- **Tool:** browser-scanner

**Description:**
The response does not protect against 'ClickJacking' attacks. It should include either Content-Security-Policy with 'frame-ancestors' directive or X-Frame-Options.

**Evidence:**
```
{
  "detail": "N/A",
  "url": "https://claude1-f630a.web.app/profile",
  "type": "ZAP-10020-1"
}
```


#### INFO: Missing Anti-clickjacking Header

- **CWE:** CWE-1021 (Unknown)
- **Tool:** browser-scanner

**Description:**
The response does not protect against 'ClickJacking' attacks. It should include either Content-Security-Policy with 'frame-ancestors' directive or X-Frame-Options.

**Evidence:**
```
{
  "detail": "N/A",
  "url": "https://claude1-f630a.web.app/settings",
  "type": "ZAP-10020-1"
}
```


#### INFO: Missing Anti-clickjacking Header

- **CWE:** CWE-1021 (Unknown)
- **Tool:** browser-scanner

**Description:**
The response does not protect against 'ClickJacking' attacks. It should include either Content-Security-Policy with 'frame-ancestors' directive or X-Frame-Options.

**Evidence:**
```
{
  "detail": "N/A",
  "url": "https://claude1-f630a.web.app/posts",
  "type": "ZAP-10020-1"
}
```


#### INFO: Missing Anti-clickjacking Header

- **CWE:** CWE-1021 (Unknown)
- **Tool:** browser-scanner

**Description:**
The response does not protect against 'ClickJacking' attacks. It should include either Content-Security-Policy with 'frame-ancestors' directive or X-Frame-Options.

**Evidence:**
```
{
  "detail": "N/A",
  "url": "https://claude1-f630a.web.app/messages",
  "type": "ZAP-10020-1"
}
```


#### INFO: Missing Anti-clickjacking Header

- **CWE:** CWE-1021 (Unknown)
- **Tool:** browser-scanner

**Description:**
The response does not protect against 'ClickJacking' attacks. It should include either Content-Security-Policy with 'frame-ancestors' directive or X-Frame-Options.

**Evidence:**
```
{
  "detail": "N/A",
  "url": "https://claude1-f630a.web.app/feed",
  "type": "ZAP-10020-1"
}
```


#### INFO: Missing Anti-clickjacking Header

- **CWE:** CWE-1021 (Unknown)
- **Tool:** browser-scanner

**Description:**
The response does not protect against 'ClickJacking' attacks. It should include either Content-Security-Policy with 'frame-ancestors' directive or X-Frame-Options.

**Evidence:**
```
{
  "detail": "N/A",
  "url": "https://claude1-f630a.web.app/__nonexistent__1765814154834_60a0fe5bc75a5",
  "type": "ZAP-10020-1"
}
```


#### INFO: Missing Anti-clickjacking Header

- **CWE:** CWE-1021 (Unknown)
- **Tool:** browser-scanner

**Description:**
The response does not protect against 'ClickJacking' attacks. It should include either Content-Security-Policy with 'frame-ancestors' directive or X-Frame-Options.

**Evidence:**
```
{
  "detail": "N/A",
  "url": "https://claude1-f630a.web.app/?file=..%2F..%2F..%2Fetc%2Fpasswd",
  "type": "ZAP-10020-1"
}
```


#### INFO: Missing Anti-clickjacking Header

- **CWE:** CWE-1021 (Unknown)
- **Tool:** browser-scanner

**Description:**
The response does not protect against 'ClickJacking' attacks. It should include either Content-Security-Policy with 'frame-ancestors' directive or X-Frame-Options.

**Evidence:**
```
{
  "detail": "N/A",
  "url": "https://claude1-f630a.web.app/?file=..%5C..%5C..%5Cwindows%5Cwin.ini",
  "type": "ZAP-10020-1"
}
```


#### INFO: Missing Anti-clickjacking Header

- **CWE:** CWE-1021 (Unknown)
- **Tool:** browser-scanner

**Description:**
The response does not protect against 'ClickJacking' attacks. It should include either Content-Security-Policy with 'frame-ancestors' directive or X-Frame-Options.

**Evidence:**
```
{
  "detail": "N/A",
  "url": "https://claude1-f630a.web.app/?file=....%2F%2F....%2F%2F....%2F%2Fetc%2Fpasswd",
  "type": "ZAP-10020-1"
}
```


#### INFO: Missing Anti-clickjacking Header

- **CWE:** CWE-1021 (Unknown)
- **Tool:** browser-scanner

**Description:**
The response does not protect against 'ClickJacking' attacks. It should include either Content-Security-Policy with 'frame-ancestors' directive or X-Frame-Options.

**Evidence:**
```
{
  "detail": "N/A",
  "url": "https://claude1-f630a.web.app/?file=..%252f..%252f..%252fetc%2Fpasswd",
  "type": "ZAP-10020-1"
}
```


#### INFO: Missing Anti-clickjacking Header

- **CWE:** CWE-1021 (Unknown)
- **Tool:** browser-scanner

**Description:**
The response does not protect against 'ClickJacking' attacks. It should include either Content-Security-Policy with 'frame-ancestors' directive or X-Frame-Options.

**Evidence:**
```
{
  "detail": "N/A",
  "url": "https://claude1-f630a.web.app/?path=..%2F..%2F..%2Fetc%2Fpasswd",
  "type": "ZAP-10020-1"
}
```


#### INFO: Missing Anti-clickjacking Header

- **CWE:** CWE-1021 (Unknown)
- **Tool:** browser-scanner

**Description:**
The response does not protect against 'ClickJacking' attacks. It should include either Content-Security-Policy with 'frame-ancestors' directive or X-Frame-Options.

**Evidence:**
```
{
  "detail": "N/A",
  "url": "https://claude1-f630a.web.app/?path=..%5C..%5C..%5Cwindows%5Cwin.ini",
  "type": "ZAP-10020-1"
}
```


#### INFO: Missing Anti-clickjacking Header

- **CWE:** CWE-1021 (Unknown)
- **Tool:** browser-scanner

**Description:**
The response does not protect against 'ClickJacking' attacks. It should include either Content-Security-Policy with 'frame-ancestors' directive or X-Frame-Options.

**Evidence:**
```
{
  "detail": "N/A",
  "url": "https://claude1-f630a.web.app/?path=....%2F%2F....%2F%2F....%2F%2Fetc%2Fpasswd",
  "type": "ZAP-10020-1"
}
```


#### INFO: Missing Anti-clickjacking Header

- **CWE:** CWE-1021 (Unknown)
- **Tool:** browser-scanner

**Description:**
The response does not protect against 'ClickJacking' attacks. It should include either Content-Security-Policy with 'frame-ancestors' directive or X-Frame-Options.

**Evidence:**
```
{
  "detail": "N/A",
  "url": "https://claude1-f630a.web.app/?path=..%252f..%252f..%252fetc%2Fpasswd",
  "type": "ZAP-10020-1"
}
```


#### INFO: Missing Anti-clickjacking Header

- **CWE:** CWE-1021 (Unknown)
- **Tool:** browser-scanner

**Description:**
The response does not protect against 'ClickJacking' attacks. It should include either Content-Security-Policy with 'frame-ancestors' directive or X-Frame-Options.

**Evidence:**
```
{
  "detail": "N/A",
  "url": "https://claude1-f630a.web.app/?filepath=..%2F..%2F..%2Fetc%2Fpasswd",
  "type": "ZAP-10020-1"
}
```


#### INFO: Missing Anti-clickjacking Header

- **CWE:** CWE-1021 (Unknown)
- **Tool:** browser-scanner

**Description:**
The response does not protect against 'ClickJacking' attacks. It should include either Content-Security-Policy with 'frame-ancestors' directive or X-Frame-Options.

**Evidence:**
```
{
  "detail": "N/A",
  "url": "https://claude1-f630a.web.app/?filepath=..%5C..%5C..%5Cwindows%5Cwin.ini",
  "type": "ZAP-10020-1"
}
```


#### INFO: Missing Anti-clickjacking Header

- **CWE:** CWE-1021 (Unknown)
- **Tool:** browser-scanner

**Description:**
The response does not protect against 'ClickJacking' attacks. It should include either Content-Security-Policy with 'frame-ancestors' directive or X-Frame-Options.

**Evidence:**
```
{
  "detail": "N/A",
  "url": "https://claude1-f630a.web.app/?filepath=....%2F%2F....%2F%2F....%2F%2Fetc%2Fpasswd",
  "type": "ZAP-10020-1"
}
```


#### INFO: Missing Anti-clickjacking Header

- **CWE:** CWE-1021 (Unknown)
- **Tool:** browser-scanner

**Description:**
The response does not protect against 'ClickJacking' attacks. It should include either Content-Security-Policy with 'frame-ancestors' directive or X-Frame-Options.

**Evidence:**
```
{
  "detail": "N/A",
  "url": "https://claude1-f630a.web.app/?filepath=..%252f..%252f..%252fetc%2Fpasswd",
  "type": "ZAP-10020-1"
}
```


#### INFO: Missing Anti-clickjacking Header

- **CWE:** CWE-1021 (Unknown)
- **Tool:** browser-scanner

**Description:**
The response does not protect against 'ClickJacking' attacks. It should include either Content-Security-Policy with 'frame-ancestors' directive or X-Frame-Options.

**Evidence:**
```
{
  "detail": "N/A",
  "url": "https://claude1-f630a.web.app/?document=..%2F..%2F..%2Fetc%2Fpasswd",
  "type": "ZAP-10020-1"
}
```


#### INFO: Missing Anti-clickjacking Header

- **CWE:** CWE-1021 (Unknown)
- **Tool:** browser-scanner

**Description:**
The response does not protect against 'ClickJacking' attacks. It should include either Content-Security-Policy with 'frame-ancestors' directive or X-Frame-Options.

**Evidence:**
```
{
  "detail": "N/A",
  "url": "https://claude1-f630a.web.app/?document=..%5C..%5C..%5Cwindows%5Cwin.ini",
  "type": "ZAP-10020-1"
}
```


#### INFO: Missing Anti-clickjacking Header

- **CWE:** CWE-1021 (Unknown)
- **Tool:** browser-scanner

**Description:**
The response does not protect against 'ClickJacking' attacks. It should include either Content-Security-Policy with 'frame-ancestors' directive or X-Frame-Options.

**Evidence:**
```
{
  "detail": "N/A",
  "url": "https://claude1-f630a.web.app/?document=....%2F%2F....%2F%2F....%2F%2Fetc%2Fpasswd",
  "type": "ZAP-10020-1"
}
```


#### INFO: Missing Anti-clickjacking Header

- **CWE:** CWE-1021 (Unknown)
- **Tool:** browser-scanner

**Description:**
The response does not protect against 'ClickJacking' attacks. It should include either Content-Security-Policy with 'frame-ancestors' directive or X-Frame-Options.

**Evidence:**
```
{
  "detail": "N/A",
  "url": "https://claude1-f630a.web.app/?document=..%252f..%252f..%252fetc%2Fpasswd",
  "type": "ZAP-10020-1"
}
```


#### INFO: Missing Anti-clickjacking Header

- **CWE:** CWE-1021 (Unknown)
- **Tool:** browser-scanner

**Description:**
The response does not protect against 'ClickJacking' attacks. It should include either Content-Security-Policy with 'frame-ancestors' directive or X-Frame-Options.

**Evidence:**
```
{
  "detail": "N/A",
  "url": "https://claude1-f630a.web.app/?doc=..%2F..%2F..%2Fetc%2Fpasswd",
  "type": "ZAP-10020-1"
}
```


#### INFO: Missing Anti-clickjacking Header

- **CWE:** CWE-1021 (Unknown)
- **Tool:** browser-scanner

**Description:**
The response does not protect against 'ClickJacking' attacks. It should include either Content-Security-Policy with 'frame-ancestors' directive or X-Frame-Options.

**Evidence:**
```
{
  "detail": "N/A",
  "url": "https://claude1-f630a.web.app/?doc=..%5C..%5C..%5Cwindows%5Cwin.ini",
  "type": "ZAP-10020-1"
}
```


#### INFO: Missing Anti-clickjacking Header

- **CWE:** CWE-1021 (Unknown)
- **Tool:** browser-scanner

**Description:**
The response does not protect against 'ClickJacking' attacks. It should include either Content-Security-Policy with 'frame-ancestors' directive or X-Frame-Options.

**Evidence:**
```
{
  "detail": "N/A",
  "url": "https://claude1-f630a.web.app/?doc=....%2F%2F....%2F%2F....%2F%2Fetc%2Fpasswd",
  "type": "ZAP-10020-1"
}
```


#### INFO: Missing Anti-clickjacking Header

- **CWE:** CWE-1021 (Unknown)
- **Tool:** browser-scanner

**Description:**
The response does not protect against 'ClickJacking' attacks. It should include either Content-Security-Policy with 'frame-ancestors' directive or X-Frame-Options.

**Evidence:**
```
{
  "detail": "N/A",
  "url": "https://claude1-f630a.web.app/?doc=..%252f..%252f..%252fetc%2Fpasswd",
  "type": "ZAP-10020-1"
}
```


#### INFO: Missing Anti-clickjacking Header

- **CWE:** CWE-1021 (Unknown)
- **Tool:** browser-scanner

**Description:**
The response does not protect against 'ClickJacking' attacks. It should include either Content-Security-Policy with 'frame-ancestors' directive or X-Frame-Options.

**Evidence:**
```
{
  "detail": "N/A",
  "url": "https://claude1-f630a.web.app/?page=..%2F..%2F..%2Fetc%2Fpasswd",
  "type": "ZAP-10020-1"
}
```


#### INFO: Missing Anti-clickjacking Header

- **CWE:** CWE-1021 (Unknown)
- **Tool:** browser-scanner

**Description:**
The response does not protect against 'ClickJacking' attacks. It should include either Content-Security-Policy with 'frame-ancestors' directive or X-Frame-Options.

**Evidence:**
```
{
  "detail": "N/A",
  "url": "https://claude1-f630a.web.app/?page=..%5C..%5C..%5Cwindows%5Cwin.ini",
  "type": "ZAP-10020-1"
}
```


#### INFO: Missing Anti-clickjacking Header

- **CWE:** CWE-1021 (Unknown)
- **Tool:** browser-scanner

**Description:**
The response does not protect against 'ClickJacking' attacks. It should include either Content-Security-Policy with 'frame-ancestors' directive or X-Frame-Options.

**Evidence:**
```
{
  "detail": "N/A",
  "url": "https://claude1-f630a.web.app/?page=....%2F%2F....%2F%2F....%2F%2Fetc%2Fpasswd",
  "type": "ZAP-10020-1"
}
```


#### INFO: Missing Anti-clickjacking Header

- **CWE:** CWE-1021 (Unknown)
- **Tool:** browser-scanner

**Description:**
The response does not protect against 'ClickJacking' attacks. It should include either Content-Security-Policy with 'frame-ancestors' directive or X-Frame-Options.

**Evidence:**
```
{
  "detail": "N/A",
  "url": "https://claude1-f630a.web.app/?page=..%252f..%252f..%252fetc%2Fpasswd",
  "type": "ZAP-10020-1"
}
```


#### INFO: Missing Anti-clickjacking Header

- **CWE:** CWE-1021 (Unknown)
- **Tool:** browser-scanner

**Description:**
The response does not protect against 'ClickJacking' attacks. It should include either Content-Security-Policy with 'frame-ancestors' directive or X-Frame-Options.

**Evidence:**
```
{
  "detail": "N/A",
  "url": "https://claude1-f630a.web.app/?template=..%2F..%2F..%2Fetc%2Fpasswd",
  "type": "ZAP-10020-1"
}
```


#### INFO: Missing Anti-clickjacking Header

- **CWE:** CWE-1021 (Unknown)
- **Tool:** browser-scanner

**Description:**
The response does not protect against 'ClickJacking' attacks. It should include either Content-Security-Policy with 'frame-ancestors' directive or X-Frame-Options.

**Evidence:**
```
{
  "detail": "N/A",
  "url": "https://claude1-f630a.web.app/?template=..%5C..%5C..%5Cwindows%5Cwin.ini",
  "type": "ZAP-10020-1"
}
```


#### INFO: Missing Anti-clickjacking Header

- **CWE:** CWE-1021 (Unknown)
- **Tool:** browser-scanner

**Description:**
The response does not protect against 'ClickJacking' attacks. It should include either Content-Security-Policy with 'frame-ancestors' directive or X-Frame-Options.

**Evidence:**
```
{
  "detail": "N/A",
  "url": "https://claude1-f630a.web.app/?template=....%2F%2F....%2F%2F....%2F%2Fetc%2Fpasswd",
  "type": "ZAP-10020-1"
}
```


#### INFO: Missing Anti-clickjacking Header

- **CWE:** CWE-1021 (Unknown)
- **Tool:** browser-scanner

**Description:**
The response does not protect against 'ClickJacking' attacks. It should include either Content-Security-Policy with 'frame-ancestors' directive or X-Frame-Options.

**Evidence:**
```
{
  "detail": "N/A",
  "url": "https://claude1-f630a.web.app/?template=..%252f..%252f..%252fetc%2Fpasswd",
  "type": "ZAP-10020-1"
}
```


#### INFO: Missing Anti-clickjacking Header

- **CWE:** CWE-1021 (Unknown)
- **Tool:** browser-scanner

**Description:**
The response does not protect against 'ClickJacking' attacks. It should include either Content-Security-Policy with 'frame-ancestors' directive or X-Frame-Options.

**Evidence:**
```
{
  "detail": "N/A",
  "url": "https://claude1-f630a.web.app/?include=..%2F..%2F..%2Fetc%2Fpasswd",
  "type": "ZAP-10020-1"
}
```


#### INFO: Missing Anti-clickjacking Header

- **CWE:** CWE-1021 (Unknown)
- **Tool:** browser-scanner

**Description:**
The response does not protect against 'ClickJacking' attacks. It should include either Content-Security-Policy with 'frame-ancestors' directive or X-Frame-Options.

**Evidence:**
```
{
  "detail": "N/A",
  "url": "https://claude1-f630a.web.app/?include=..%5C..%5C..%5Cwindows%5Cwin.ini",
  "type": "ZAP-10020-1"
}
```


#### INFO: Missing Anti-clickjacking Header

- **CWE:** CWE-1021 (Unknown)
- **Tool:** browser-scanner

**Description:**
The response does not protect against 'ClickJacking' attacks. It should include either Content-Security-Policy with 'frame-ancestors' directive or X-Frame-Options.

**Evidence:**
```
{
  "detail": "N/A",
  "url": "https://claude1-f630a.web.app/?include=....%2F%2F....%2F%2F....%2F%2Fetc%2Fpasswd",
  "type": "ZAP-10020-1"
}
```


#### INFO: Missing Anti-clickjacking Header

- **CWE:** CWE-1021 (Unknown)
- **Tool:** browser-scanner

**Description:**
The response does not protect against 'ClickJacking' attacks. It should include either Content-Security-Policy with 'frame-ancestors' directive or X-Frame-Options.

**Evidence:**
```
{
  "detail": "N/A",
  "url": "https://claude1-f630a.web.app/?include=..%252f..%252f..%252fetc%2Fpasswd",
  "type": "ZAP-10020-1"
}
```


#### INFO: Missing Anti-clickjacking Header

- **CWE:** CWE-1021 (Unknown)
- **Tool:** browser-scanner

**Description:**
The response does not protect against 'ClickJacking' attacks. It should include either Content-Security-Policy with 'frame-ancestors' directive or X-Frame-Options.

**Evidence:**
```
{
  "detail": "N/A",
  "url": "https://claude1-f630a.web.app/?dir=..%2F..%2F..%2Fetc%2Fpasswd",
  "type": "ZAP-10020-1"
}
```


#### INFO: Missing Anti-clickjacking Header

- **CWE:** CWE-1021 (Unknown)
- **Tool:** browser-scanner

**Description:**
The response does not protect against 'ClickJacking' attacks. It should include either Content-Security-Policy with 'frame-ancestors' directive or X-Frame-Options.

**Evidence:**
```
{
  "detail": "N/A",
  "url": "https://claude1-f630a.web.app/?dir=..%5C..%5C..%5Cwindows%5Cwin.ini",
  "type": "ZAP-10020-1"
}
```


#### INFO: Missing Anti-clickjacking Header

- **CWE:** CWE-1021 (Unknown)
- **Tool:** browser-scanner

**Description:**
The response does not protect against 'ClickJacking' attacks. It should include either Content-Security-Policy with 'frame-ancestors' directive or X-Frame-Options.

**Evidence:**
```
{
  "detail": "N/A",
  "url": "https://claude1-f630a.web.app/?dir=....%2F%2F....%2F%2F....%2F%2Fetc%2Fpasswd",
  "type": "ZAP-10020-1"
}
```


#### INFO: Missing Anti-clickjacking Header

- **CWE:** CWE-1021 (Unknown)
- **Tool:** browser-scanner

**Description:**
The response does not protect against 'ClickJacking' attacks. It should include either Content-Security-Policy with 'frame-ancestors' directive or X-Frame-Options.

**Evidence:**
```
{
  "detail": "N/A",
  "url": "https://claude1-f630a.web.app/?dir=..%252f..%252f..%252fetc%2Fpasswd",
  "type": "ZAP-10020-1"
}
```


#### INFO: Missing Anti-clickjacking Header

- **CWE:** CWE-1021 (Unknown)
- **Tool:** browser-scanner

**Description:**
The response does not protect against 'ClickJacking' attacks. It should include either Content-Security-Policy with 'frame-ancestors' directive or X-Frame-Options.

**Evidence:**
```
{
  "detail": "N/A",
  "url": "https://claude1-f630a.web.app/?folder=..%2F..%2F..%2Fetc%2Fpasswd",
  "type": "ZAP-10020-1"
}
```


#### INFO: Missing Anti-clickjacking Header

- **CWE:** CWE-1021 (Unknown)
- **Tool:** browser-scanner

**Description:**
The response does not protect against 'ClickJacking' attacks. It should include either Content-Security-Policy with 'frame-ancestors' directive or X-Frame-Options.

**Evidence:**
```
{
  "detail": "N/A",
  "url": "https://claude1-f630a.web.app/?folder=..%5C..%5C..%5Cwindows%5Cwin.ini",
  "type": "ZAP-10020-1"
}
```


#### INFO: Missing Anti-clickjacking Header

- **CWE:** CWE-1021 (Unknown)
- **Tool:** browser-scanner

**Description:**
The response does not protect against 'ClickJacking' attacks. It should include either Content-Security-Policy with 'frame-ancestors' directive or X-Frame-Options.

**Evidence:**
```
{
  "detail": "N/A",
  "url": "https://claude1-f630a.web.app/?folder=....%2F%2F....%2F%2F....%2F%2Fetc%2Fpasswd",
  "type": "ZAP-10020-1"
}
```


#### INFO: Missing Anti-clickjacking Header

- **CWE:** CWE-1021 (Unknown)
- **Tool:** browser-scanner

**Description:**
The response does not protect against 'ClickJacking' attacks. It should include either Content-Security-Policy with 'frame-ancestors' directive or X-Frame-Options.

**Evidence:**
```
{
  "detail": "N/A",
  "url": "https://claude1-f630a.web.app/?folder=..%252f..%252f..%252fetc%2Fpasswd",
  "type": "ZAP-10020-1"
}
```


#### INFO: Missing Anti-clickjacking Header

- **CWE:** CWE-1021 (Unknown)
- **Tool:** browser-scanner

**Description:**
The response does not protect against 'ClickJacking' attacks. It should include either Content-Security-Policy with 'frame-ancestors' directive or X-Frame-Options.

**Evidence:**
```
{
  "detail": "N/A",
  "url": "https://claude1-f630a.web.app/?load=..%2F..%2F..%2Fetc%2Fpasswd",
  "type": "ZAP-10020-1"
}
```


#### INFO: Missing Anti-clickjacking Header

- **CWE:** CWE-1021 (Unknown)
- **Tool:** browser-scanner

**Description:**
The response does not protect against 'ClickJacking' attacks. It should include either Content-Security-Policy with 'frame-ancestors' directive or X-Frame-Options.

**Evidence:**
```
{
  "detail": "N/A",
  "url": "https://claude1-f630a.web.app/?load=..%5C..%5C..%5Cwindows%5Cwin.ini",
  "type": "ZAP-10020-1"
}
```


#### INFO: Missing Anti-clickjacking Header

- **CWE:** CWE-1021 (Unknown)
- **Tool:** browser-scanner

**Description:**
The response does not protect against 'ClickJacking' attacks. It should include either Content-Security-Policy with 'frame-ancestors' directive or X-Frame-Options.

**Evidence:**
```
{
  "detail": "N/A",
  "url": "https://claude1-f630a.web.app/?load=....%2F%2F....%2F%2F....%2F%2Fetc%2Fpasswd",
  "type": "ZAP-10020-1"
}
```


#### INFO: Missing Anti-clickjacking Header

- **CWE:** CWE-1021 (Unknown)
- **Tool:** browser-scanner

**Description:**
The response does not protect against 'ClickJacking' attacks. It should include either Content-Security-Policy with 'frame-ancestors' directive or X-Frame-Options.

**Evidence:**
```
{
  "detail": "N/A",
  "url": "https://claude1-f630a.web.app/?load=..%252f..%252f..%252fetc%2Fpasswd",
  "type": "ZAP-10020-1"
}
```


#### INFO: Missing Anti-clickjacking Header

- **CWE:** CWE-1021 (Unknown)
- **Tool:** browser-scanner

**Description:**
The response does not protect against 'ClickJacking' attacks. It should include either Content-Security-Policy with 'frame-ancestors' directive or X-Frame-Options.

**Evidence:**
```
{
  "detail": "N/A",
  "url": "https://claude1-f630a.web.app/?read=..%2F..%2F..%2Fetc%2Fpasswd",
  "type": "ZAP-10020-1"
}
```


#### INFO: Missing Anti-clickjacking Header

- **CWE:** CWE-1021 (Unknown)
- **Tool:** browser-scanner

**Description:**
The response does not protect against 'ClickJacking' attacks. It should include either Content-Security-Policy with 'frame-ancestors' directive or X-Frame-Options.

**Evidence:**
```
{
  "detail": "N/A",
  "url": "https://claude1-f630a.web.app/?read=..%5C..%5C..%5Cwindows%5Cwin.ini",
  "type": "ZAP-10020-1"
}
```


#### INFO: Missing Anti-clickjacking Header

- **CWE:** CWE-1021 (Unknown)
- **Tool:** browser-scanner

**Description:**
The response does not protect against 'ClickJacking' attacks. It should include either Content-Security-Policy with 'frame-ancestors' directive or X-Frame-Options.

**Evidence:**
```
{
  "detail": "N/A",
  "url": "https://claude1-f630a.web.app/?read=....%2F%2F....%2F%2F....%2F%2Fetc%2Fpasswd",
  "type": "ZAP-10020-1"
}
```


#### INFO: Missing Anti-clickjacking Header

- **CWE:** CWE-1021 (Unknown)
- **Tool:** browser-scanner

**Description:**
The response does not protect against 'ClickJacking' attacks. It should include either Content-Security-Policy with 'frame-ancestors' directive or X-Frame-Options.

**Evidence:**
```
{
  "detail": "N/A",
  "url": "https://claude1-f630a.web.app/?read=..%252f..%252f..%252fetc%2Fpasswd",
  "type": "ZAP-10020-1"
}
```


#### INFO: Missing Anti-clickjacking Header

- **CWE:** CWE-1021 (Unknown)
- **Tool:** browser-scanner

**Description:**
The response does not protect against 'ClickJacking' attacks. It should include either Content-Security-Policy with 'frame-ancestors' directive or X-Frame-Options.

**Evidence:**
```
{
  "detail": "N/A",
  "url": "https://claude1-f630a.web.app/images/",
  "type": "ZAP-10020-1"
}
```


#### INFO: Missing Anti-clickjacking Header

- **CWE:** CWE-1021 (Unknown)
- **Tool:** browser-scanner

**Description:**
The response does not protect against 'ClickJacking' attacks. It should include either Content-Security-Policy with 'frame-ancestors' directive or X-Frame-Options.

**Evidence:**
```
{
  "detail": "N/A",
  "url": "https://claude1-f630a.web.app/uploads/",
  "type": "ZAP-10020-1"
}
```


#### INFO: Missing Anti-clickjacking Header

- **CWE:** CWE-1021 (Unknown)
- **Tool:** browser-scanner

**Description:**
The response does not protect against 'ClickJacking' attacks. It should include either Content-Security-Policy with 'frame-ancestors' directive or X-Frame-Options.

**Evidence:**
```
{
  "detail": "N/A",
  "url": "https://claude1-f630a.web.app/files/",
  "type": "ZAP-10020-1"
}
```


#### INFO: Missing Anti-clickjacking Header

- **CWE:** CWE-1021 (Unknown)
- **Tool:** browser-scanner

**Description:**
The response does not protect against 'ClickJacking' attacks. It should include either Content-Security-Policy with 'frame-ancestors' directive or X-Frame-Options.

**Evidence:**
```
{
  "detail": "N/A",
  "url": "https://claude1-f630a.web.app/assets/",
  "type": "ZAP-10020-1"
}
```


#### INFO: Missing Anti-clickjacking Header

- **CWE:** CWE-1021 (Unknown)
- **Tool:** browser-scanner

**Description:**
The response does not protect against 'ClickJacking' attacks. It should include either Content-Security-Policy with 'frame-ancestors' directive or X-Frame-Options.

**Evidence:**
```
{
  "detail": "N/A",
  "url": "https://claude1-f630a.web.app/static/",
  "type": "ZAP-10020-1"
}
```


#### INFO: Missing Anti-clickjacking Header

- **CWE:** CWE-1021 (Unknown)
- **Tool:** browser-scanner

**Description:**
The response does not protect against 'ClickJacking' attacks. It should include either Content-Security-Policy with 'frame-ancestors' directive or X-Frame-Options.

**Evidence:**
```
{
  "detail": "N/A",
  "url": "https://claude1-f630a.web.app/media/",
  "type": "ZAP-10020-1"
}
```


#### INFO: Missing Anti-clickjacking Header

- **CWE:** CWE-1021 (Unknown)
- **Tool:** browser-scanner

**Description:**
The response does not protect against 'ClickJacking' attacks. It should include either Content-Security-Policy with 'frame-ancestors' directive or X-Frame-Options.

**Evidence:**
```
{
  "detail": "N/A",
  "url": "https://claude1-f630a.web.app/backup/",
  "type": "ZAP-10020-1"
}
```


#### INFO: Missing Anti-clickjacking Header

- **CWE:** CWE-1021 (Unknown)
- **Tool:** browser-scanner

**Description:**
The response does not protect against 'ClickJacking' attacks. It should include either Content-Security-Policy with 'frame-ancestors' directive or X-Frame-Options.

**Evidence:**
```
{
  "detail": "N/A",
  "url": "https://claude1-f630a.web.app/logs/",
  "type": "ZAP-10020-1"
}
```


#### INFO: Missing Anti-clickjacking Header

- **CWE:** CWE-1021 (Unknown)
- **Tool:** browser-scanner

**Description:**
The response does not protect against 'ClickJacking' attacks. It should include either Content-Security-Policy with 'frame-ancestors' directive or X-Frame-Options.

**Evidence:**
```
{
  "detail": "N/A",
  "url": "https://claude1-f630a.web.app/tmp/",
  "type": "ZAP-10020-1"
}
```


#### INFO: Missing Anti-clickjacking Header

- **CWE:** CWE-1021 (Unknown)
- **Tool:** browser-scanner

**Description:**
The response does not protect against 'ClickJacking' attacks. It should include either Content-Security-Policy with 'frame-ancestors' directive or X-Frame-Options.

**Evidence:**
```
{
  "detail": "N/A",
  "url": "https://claude1-f630a.web.app/data/",
  "type": "ZAP-10020-1"
}
```


#### INFO: Missing Anti-clickjacking Header

- **CWE:** CWE-1021 (Unknown)
- **Tool:** browser-scanner

**Description:**
The response does not protect against 'ClickJacking' attacks. It should include either Content-Security-Policy with 'frame-ancestors' directive or X-Frame-Options.

**Evidence:**
```
{
  "detail": "N/A",
  "url": "https://claude1-f630a.web.app/admin",
  "type": "ZAP-10020-1"
}
```


#### INFO: Missing Anti-clickjacking Header

- **CWE:** CWE-1021 (Unknown)
- **Tool:** browser-scanner

**Description:**
The response does not protect against 'ClickJacking' attacks. It should include either Content-Security-Policy with 'frame-ancestors' directive or X-Frame-Options.

**Evidence:**
```
{
  "detail": "N/A",
  "url": "https://claude1-f630a.web.app/admin/",
  "type": "ZAP-10020-1"
}
```


#### INFO: Missing Anti-clickjacking Header

- **CWE:** CWE-1021 (Unknown)
- **Tool:** browser-scanner

**Description:**
The response does not protect against 'ClickJacking' attacks. It should include either Content-Security-Policy with 'frame-ancestors' directive or X-Frame-Options.

**Evidence:**
```
{
  "detail": "N/A",
  "url": "https://claude1-f630a.web.app/admin/dashboard",
  "type": "ZAP-10020-1"
}
```


#### INFO: Missing Anti-clickjacking Header

- **CWE:** CWE-1021 (Unknown)
- **Tool:** browser-scanner

**Description:**
The response does not protect against 'ClickJacking' attacks. It should include either Content-Security-Policy with 'frame-ancestors' directive or X-Frame-Options.

**Evidence:**
```
{
  "detail": "N/A",
  "url": "https://claude1-f630a.web.app/admin/users",
  "type": "ZAP-10020-1"
}
```


#### INFO: Missing Anti-clickjacking Header

- **CWE:** CWE-1021 (Unknown)
- **Tool:** browser-scanner

**Description:**
The response does not protect against 'ClickJacking' attacks. It should include either Content-Security-Policy with 'frame-ancestors' directive or X-Frame-Options.

**Evidence:**
```
{
  "detail": "N/A",
  "url": "https://claude1-f630a.web.app/admin/settings",
  "type": "ZAP-10020-1"
}
```


#### INFO: Missing Anti-clickjacking Header

- **CWE:** CWE-1021 (Unknown)
- **Tool:** browser-scanner

**Description:**
The response does not protect against 'ClickJacking' attacks. It should include either Content-Security-Policy with 'frame-ancestors' directive or X-Frame-Options.

**Evidence:**
```
{
  "detail": "N/A",
  "url": "https://claude1-f630a.web.app/administrator",
  "type": "ZAP-10020-1"
}
```


#### INFO: Missing Anti-clickjacking Header

- **CWE:** CWE-1021 (Unknown)
- **Tool:** browser-scanner

**Description:**
The response does not protect against 'ClickJacking' attacks. It should include either Content-Security-Policy with 'frame-ancestors' directive or X-Frame-Options.

**Evidence:**
```
{
  "detail": "N/A",
  "url": "https://claude1-f630a.web.app/manage",
  "type": "ZAP-10020-1"
}
```


#### INFO: Missing Anti-clickjacking Header

- **CWE:** CWE-1021 (Unknown)
- **Tool:** browser-scanner

**Description:**
The response does not protect against 'ClickJacking' attacks. It should include either Content-Security-Policy with 'frame-ancestors' directive or X-Frame-Options.

**Evidence:**
```
{
  "detail": "N/A",
  "url": "https://claude1-f630a.web.app/management",
  "type": "ZAP-10020-1"
}
```


#### INFO: Missing Anti-clickjacking Header

- **CWE:** CWE-1021 (Unknown)
- **Tool:** browser-scanner

**Description:**
The response does not protect against 'ClickJacking' attacks. It should include either Content-Security-Policy with 'frame-ancestors' directive or X-Frame-Options.

**Evidence:**
```
{
  "detail": "N/A",
  "url": "https://claude1-f630a.web.app/console",
  "type": "ZAP-10020-1"
}
```


#### INFO: Missing Anti-clickjacking Header

- **CWE:** CWE-1021 (Unknown)
- **Tool:** browser-scanner

**Description:**
The response does not protect against 'ClickJacking' attacks. It should include either Content-Security-Policy with 'frame-ancestors' directive or X-Frame-Options.

**Evidence:**
```
{
  "detail": "N/A",
  "url": "https://claude1-f630a.web.app/panel",
  "type": "ZAP-10020-1"
}
```


#### INFO: Missing Anti-clickjacking Header

- **CWE:** CWE-1021 (Unknown)
- **Tool:** browser-scanner

**Description:**
The response does not protect against 'ClickJacking' attacks. It should include either Content-Security-Policy with 'frame-ancestors' directive or X-Frame-Options.

**Evidence:**
```
{
  "detail": "N/A",
  "url": "https://claude1-f630a.web.app/backoffice",
  "type": "ZAP-10020-1"
}
```


#### INFO: Missing Anti-clickjacking Header

- **CWE:** CWE-1021 (Unknown)
- **Tool:** browser-scanner

**Description:**
The response does not protect against 'ClickJacking' attacks. It should include either Content-Security-Policy with 'frame-ancestors' directive or X-Frame-Options.

**Evidence:**
```
{
  "detail": "N/A",
  "url": "https://claude1-f630a.web.app/backend",
  "type": "ZAP-10020-1"
}
```


#### INFO: Missing Anti-clickjacking Header

- **CWE:** CWE-1021 (Unknown)
- **Tool:** browser-scanner

**Description:**
The response does not protect against 'ClickJacking' attacks. It should include either Content-Security-Policy with 'frame-ancestors' directive or X-Frame-Options.

**Evidence:**
```
{
  "detail": "N/A",
  "url": "https://claude1-f630a.web.app/dashboard/admin",
  "type": "ZAP-10020-1"
}
```


#### INFO: Missing Anti-clickjacking Header

- **CWE:** CWE-1021 (Unknown)
- **Tool:** browser-scanner

**Description:**
The response does not protect against 'ClickJacking' attacks. It should include either Content-Security-Policy with 'frame-ancestors' directive or X-Frame-Options.

**Evidence:**
```
{
  "detail": "N/A",
  "url": "https://claude1-f630a.web.app/api/admin",
  "type": "ZAP-10020-1"
}
```


#### INFO: Missing Anti-clickjacking Header

- **CWE:** CWE-1021 (Unknown)
- **Tool:** browser-scanner

**Description:**
The response does not protect against 'ClickJacking' attacks. It should include either Content-Security-Policy with 'frame-ancestors' directive or X-Frame-Options.

**Evidence:**
```
{
  "detail": "N/A",
  "url": "https://claude1-f630a.web.app/api/users",
  "type": "ZAP-10020-1"
}
```


#### INFO: Missing Anti-clickjacking Header

- **CWE:** CWE-1021 (Unknown)
- **Tool:** browser-scanner

**Description:**
The response does not protect against 'ClickJacking' attacks. It should include either Content-Security-Policy with 'frame-ancestors' directive or X-Frame-Options.

**Evidence:**
```
{
  "detail": "N/A",
  "url": "https://claude1-f630a.web.app/.git/config",
  "type": "ZAP-10020-1"
}
```


#### INFO: Missing Anti-clickjacking Header

- **CWE:** CWE-1021 (Unknown)
- **Tool:** browser-scanner

**Description:**
The response does not protect against 'ClickJacking' attacks. It should include either Content-Security-Policy with 'frame-ancestors' directive or X-Frame-Options.

**Evidence:**
```
{
  "detail": "N/A",
  "url": "https://claude1-f630a.web.app/.git/HEAD",
  "type": "ZAP-10020-1"
}
```


#### INFO: Missing Anti-clickjacking Header

- **CWE:** CWE-1021 (Unknown)
- **Tool:** browser-scanner

**Description:**
The response does not protect against 'ClickJacking' attacks. It should include either Content-Security-Policy with 'frame-ancestors' directive or X-Frame-Options.

**Evidence:**
```
{
  "detail": "N/A",
  "url": "https://claude1-f630a.web.app/.env",
  "type": "ZAP-10020-1"
}
```


#### INFO: Missing Anti-clickjacking Header

- **CWE:** CWE-1021 (Unknown)
- **Tool:** browser-scanner

**Description:**
The response does not protect against 'ClickJacking' attacks. It should include either Content-Security-Policy with 'frame-ancestors' directive or X-Frame-Options.

**Evidence:**
```
{
  "detail": "N/A",
  "url": "https://claude1-f630a.web.app/.env.local",
  "type": "ZAP-10020-1"
}
```


#### INFO: Missing Anti-clickjacking Header

- **CWE:** CWE-1021 (Unknown)
- **Tool:** browser-scanner

**Description:**
The response does not protect against 'ClickJacking' attacks. It should include either Content-Security-Policy with 'frame-ancestors' directive or X-Frame-Options.

**Evidence:**
```
{
  "detail": "N/A",
  "url": "https://claude1-f630a.web.app/.env.production",
  "type": "ZAP-10020-1"
}
```


#### INFO: Missing Anti-clickjacking Header

- **CWE:** CWE-1021 (Unknown)
- **Tool:** browser-scanner

**Description:**
The response does not protect against 'ClickJacking' attacks. It should include either Content-Security-Policy with 'frame-ancestors' directive or X-Frame-Options.

**Evidence:**
```
{
  "detail": "N/A",
  "url": "https://claude1-f630a.web.app/config.json",
  "type": "ZAP-10020-1"
}
```


#### INFO: Missing Anti-clickjacking Header

- **CWE:** CWE-1021 (Unknown)
- **Tool:** browser-scanner

**Description:**
The response does not protect against 'ClickJacking' attacks. It should include either Content-Security-Policy with 'frame-ancestors' directive or X-Frame-Options.

**Evidence:**
```
{
  "detail": "N/A",
  "url": "https://claude1-f630a.web.app/config.yaml",
  "type": "ZAP-10020-1"
}
```


#### INFO: Missing Anti-clickjacking Header

- **CWE:** CWE-1021 (Unknown)
- **Tool:** browser-scanner

**Description:**
The response does not protect against 'ClickJacking' attacks. It should include either Content-Security-Policy with 'frame-ancestors' directive or X-Frame-Options.

**Evidence:**
```
{
  "detail": "N/A",
  "url": "https://claude1-f630a.web.app/config.yml",
  "type": "ZAP-10020-1"
}
```


#### INFO: Missing Anti-clickjacking Header

- **CWE:** CWE-1021 (Unknown)
- **Tool:** browser-scanner

**Description:**
The response does not protect against 'ClickJacking' attacks. It should include either Content-Security-Policy with 'frame-ancestors' directive or X-Frame-Options.

**Evidence:**
```
{
  "detail": "N/A",
  "url": "https://claude1-f630a.web.app/firebase.json",
  "type": "ZAP-10020-1"
}
```


#### INFO: Missing Anti-clickjacking Header

- **CWE:** CWE-1021 (Unknown)
- **Tool:** browser-scanner

**Description:**
The response does not protect against 'ClickJacking' attacks. It should include either Content-Security-Policy with 'frame-ancestors' directive or X-Frame-Options.

**Evidence:**
```
{
  "detail": "N/A",
  "url": "https://claude1-f630a.web.app/package.json",
  "type": "ZAP-10020-1"
}
```


#### INFO: Missing Anti-clickjacking Header

- **CWE:** CWE-1021 (Unknown)
- **Tool:** browser-scanner

**Description:**
The response does not protect against 'ClickJacking' attacks. It should include either Content-Security-Policy with 'frame-ancestors' directive or X-Frame-Options.

**Evidence:**
```
{
  "detail": "N/A",
  "url": "https://claude1-f630a.web.app/package-lock.json",
  "type": "ZAP-10020-1"
}
```


#### INFO: Missing Anti-clickjacking Header

- **CWE:** CWE-1021 (Unknown)
- **Tool:** browser-scanner

**Description:**
The response does not protect against 'ClickJacking' attacks. It should include either Content-Security-Policy with 'frame-ancestors' directive or X-Frame-Options.

**Evidence:**
```
{
  "detail": "N/A",
  "url": "https://claude1-f630a.web.app/composer.json",
  "type": "ZAP-10020-1"
}
```


#### INFO: Missing Anti-clickjacking Header

- **CWE:** CWE-1021 (Unknown)
- **Tool:** browser-scanner

**Description:**
The response does not protect against 'ClickJacking' attacks. It should include either Content-Security-Policy with 'frame-ancestors' directive or X-Frame-Options.

**Evidence:**
```
{
  "detail": "N/A",
  "url": "https://claude1-f630a.web.app/composer.lock",
  "type": "ZAP-10020-1"
}
```


#### INFO: Missing Anti-clickjacking Header

- **CWE:** CWE-1021 (Unknown)
- **Tool:** browser-scanner

**Description:**
The response does not protect against 'ClickJacking' attacks. It should include either Content-Security-Policy with 'frame-ancestors' directive or X-Frame-Options.

**Evidence:**
```
{
  "detail": "N/A",
  "url": "https://claude1-f630a.web.app/webpack.config.js",
  "type": "ZAP-10020-1"
}
```


#### INFO: Missing Anti-clickjacking Header

- **CWE:** CWE-1021 (Unknown)
- **Tool:** browser-scanner

**Description:**
The response does not protect against 'ClickJacking' attacks. It should include either Content-Security-Policy with 'frame-ancestors' directive or X-Frame-Options.

**Evidence:**
```
{
  "detail": "N/A",
  "url": "https://claude1-f630a.web.app/tsconfig.json",
  "type": "ZAP-10020-1"
}
```


#### INFO: Missing Anti-clickjacking Header

- **CWE:** CWE-1021 (Unknown)
- **Tool:** browser-scanner

**Description:**
The response does not protect against 'ClickJacking' attacks. It should include either Content-Security-Policy with 'frame-ancestors' directive or X-Frame-Options.

**Evidence:**
```
{
  "detail": "N/A",
  "url": "https://claude1-f630a.web.app/.htaccess",
  "type": "ZAP-10020-1"
}
```


#### INFO: Missing Anti-clickjacking Header

- **CWE:** CWE-1021 (Unknown)
- **Tool:** browser-scanner

**Description:**
The response does not protect against 'ClickJacking' attacks. It should include either Content-Security-Policy with 'frame-ancestors' directive or X-Frame-Options.

**Evidence:**
```
{
  "detail": "N/A",
  "url": "https://claude1-f630a.web.app/.htpasswd",
  "type": "ZAP-10020-1"
}
```


#### INFO: Missing Anti-clickjacking Header

- **CWE:** CWE-1021 (Unknown)
- **Tool:** browser-scanner

**Description:**
The response does not protect against 'ClickJacking' attacks. It should include either Content-Security-Policy with 'frame-ancestors' directive or X-Frame-Options.

**Evidence:**
```
{
  "detail": "N/A",
  "url": "https://claude1-f630a.web.app/robots.txt",
  "type": "ZAP-10020-1"
}
```


#### INFO: Missing Anti-clickjacking Header

- **CWE:** CWE-1021 (Unknown)
- **Tool:** browser-scanner

**Description:**
The response does not protect against 'ClickJacking' attacks. It should include either Content-Security-Policy with 'frame-ancestors' directive or X-Frame-Options.

**Evidence:**
```
{
  "detail": "N/A",
  "url": "https://claude1-f630a.web.app/sitemap.xml",
  "type": "ZAP-10020-1"
}
```


#### INFO: Missing Anti-clickjacking Header

- **CWE:** CWE-1021 (Unknown)
- **Tool:** browser-scanner

**Description:**
The response does not protect against 'ClickJacking' attacks. It should include either Content-Security-Policy with 'frame-ancestors' directive or X-Frame-Options.

**Evidence:**
```
{
  "detail": "N/A",
  "url": "https://claude1-f630a.web.app/crossdomain.xml",
  "type": "ZAP-10020-1"
}
```


#### INFO: Missing Anti-clickjacking Header

- **CWE:** CWE-1021 (Unknown)
- **Tool:** browser-scanner

**Description:**
The response does not protect against 'ClickJacking' attacks. It should include either Content-Security-Policy with 'frame-ancestors' directive or X-Frame-Options.

**Evidence:**
```
{
  "detail": "N/A",
  "url": "https://claude1-f630a.web.app/clientaccesspolicy.xml",
  "type": "ZAP-10020-1"
}
```


#### INFO: Missing Anti-clickjacking Header

- **CWE:** CWE-1021 (Unknown)
- **Tool:** browser-scanner

**Description:**
The response does not protect against 'ClickJacking' attacks. It should include either Content-Security-Policy with 'frame-ancestors' directive or X-Frame-Options.

**Evidence:**
```
{
  "detail": "N/A",
  "url": "https://claude1-f630a.web.app/web.config",
  "type": "ZAP-10020-1"
}
```


#### INFO: Missing Anti-clickjacking Header

- **CWE:** CWE-1021 (Unknown)
- **Tool:** browser-scanner

**Description:**
The response does not protect against 'ClickJacking' attacks. It should include either Content-Security-Policy with 'frame-ancestors' directive or X-Frame-Options.

**Evidence:**
```
{
  "detail": "N/A",
  "url": "https://claude1-f630a.web.app/phpinfo.php",
  "type": "ZAP-10020-1"
}
```


#### INFO: Missing Anti-clickjacking Header

- **CWE:** CWE-1021 (Unknown)
- **Tool:** browser-scanner

**Description:**
The response does not protect against 'ClickJacking' attacks. It should include either Content-Security-Policy with 'frame-ancestors' directive or X-Frame-Options.

**Evidence:**
```
{
  "detail": "N/A",
  "url": "https://claude1-f630a.web.app/info.php",
  "type": "ZAP-10020-1"
}
```


#### INFO: Missing Anti-clickjacking Header

- **CWE:** CWE-1021 (Unknown)
- **Tool:** browser-scanner

**Description:**
The response does not protect against 'ClickJacking' attacks. It should include either Content-Security-Policy with 'frame-ancestors' directive or X-Frame-Options.

**Evidence:**
```
{
  "detail": "N/A",
  "url": "https://claude1-f630a.web.app/test.php",
  "type": "ZAP-10020-1"
}
```


#### INFO: Missing Anti-clickjacking Header

- **CWE:** CWE-1021 (Unknown)
- **Tool:** browser-scanner

**Description:**
The response does not protect against 'ClickJacking' attacks. It should include either Content-Security-Policy with 'frame-ancestors' directive or X-Frame-Options.

**Evidence:**
```
{
  "detail": "N/A",
  "url": "https://claude1-f630a.web.app/backup.zip",
  "type": "ZAP-10020-1"
}
```


#### INFO: Missing Anti-clickjacking Header

- **CWE:** CWE-1021 (Unknown)
- **Tool:** browser-scanner

**Description:**
The response does not protect against 'ClickJacking' attacks. It should include either Content-Security-Policy with 'frame-ancestors' directive or X-Frame-Options.

**Evidence:**
```
{
  "detail": "N/A",
  "url": "https://claude1-f630a.web.app/backup.tar.gz",
  "type": "ZAP-10020-1"
}
```


#### INFO: Missing Anti-clickjacking Header

- **CWE:** CWE-1021 (Unknown)
- **Tool:** browser-scanner

**Description:**
The response does not protect against 'ClickJacking' attacks. It should include either Content-Security-Policy with 'frame-ancestors' directive or X-Frame-Options.

**Evidence:**
```
{
  "detail": "N/A",
  "url": "https://claude1-f630a.web.app/backup.sql",
  "type": "ZAP-10020-1"
}
```


#### INFO: Missing Anti-clickjacking Header

- **CWE:** CWE-1021 (Unknown)
- **Tool:** browser-scanner

**Description:**
The response does not protect against 'ClickJacking' attacks. It should include either Content-Security-Policy with 'frame-ancestors' directive or X-Frame-Options.

**Evidence:**
```
{
  "detail": "N/A",
  "url": "https://claude1-f630a.web.app/dump.sql",
  "type": "ZAP-10020-1"
}
```


#### INFO: Missing Anti-clickjacking Header

- **CWE:** CWE-1021 (Unknown)
- **Tool:** browser-scanner

**Description:**
The response does not protect against 'ClickJacking' attacks. It should include either Content-Security-Policy with 'frame-ancestors' directive or X-Frame-Options.

**Evidence:**
```
{
  "detail": "N/A",
  "url": "https://claude1-f630a.web.app/db.sql",
  "type": "ZAP-10020-1"
}
```


#### INFO: Missing Anti-clickjacking Header

- **CWE:** CWE-1021 (Unknown)
- **Tool:** browser-scanner

**Description:**
The response does not protect against 'ClickJacking' attacks. It should include either Content-Security-Policy with 'frame-ancestors' directive or X-Frame-Options.

**Evidence:**
```
{
  "detail": "N/A",
  "url": "https://claude1-f630a.web.app/server-status",
  "type": "ZAP-10020-1"
}
```


#### INFO: Missing Anti-clickjacking Header

- **CWE:** CWE-1021 (Unknown)
- **Tool:** browser-scanner

**Description:**
The response does not protect against 'ClickJacking' attacks. It should include either Content-Security-Policy with 'frame-ancestors' directive or X-Frame-Options.

**Evidence:**
```
{
  "detail": "N/A",
  "url": "https://claude1-f630a.web.app/server-info",
  "type": "ZAP-10020-1"
}
```


#### INFO: Missing Anti-clickjacking Header

- **CWE:** CWE-1021 (Unknown)
- **Tool:** browser-scanner

**Description:**
The response does not protect against 'ClickJacking' attacks. It should include either Content-Security-Policy with 'frame-ancestors' directive or X-Frame-Options.

**Evidence:**
```
{
  "detail": "N/A",
  "url": "https://claude1-f630a.web.app/.DS_Store",
  "type": "ZAP-10020-1"
}
```


#### INFO: Missing Anti-clickjacking Header

- **CWE:** CWE-1021 (Unknown)
- **Tool:** browser-scanner

**Description:**
The response does not protect against 'ClickJacking' attacks. It should include either Content-Security-Policy with 'frame-ancestors' directive or X-Frame-Options.

**Evidence:**
```
{
  "detail": "N/A",
  "url": "https://claude1-f630a.web.app/Thumbs.db",
  "type": "ZAP-10020-1"
}
```


#### INFO: Missing Anti-clickjacking Header

- **CWE:** CWE-1021 (Unknown)
- **Tool:** browser-scanner

**Description:**
The response does not protect against 'ClickJacking' attacks. It should include either Content-Security-Policy with 'frame-ancestors' directive or X-Frame-Options.

**Evidence:**
```
{
  "detail": "N/A",
  "url": "https://claude1-f630a.web.app/WEB-INF/web.xml",
  "type": "ZAP-10020-1"
}
```


#### INFO: Missing Anti-clickjacking Header

- **CWE:** CWE-1021 (Unknown)
- **Tool:** browser-scanner

**Description:**
The response does not protect against 'ClickJacking' attacks. It should include either Content-Security-Policy with 'frame-ancestors' directive or X-Frame-Options.

**Evidence:**
```
{
  "detail": "N/A",
  "url": "https://claude1-f630a.web.app/META-INF/MANIFEST.MF",
  "type": "ZAP-10020-1"
}
```


#### INFO: Missing Anti-clickjacking Header

- **CWE:** CWE-1021 (Unknown)
- **Tool:** browser-scanner

**Description:**
The response does not protect against 'ClickJacking' attacks. It should include either Content-Security-Policy with 'frame-ancestors' directive or X-Frame-Options.

**Evidence:**
```
{
  "detail": "N/A",
  "url": "https://claude1-f630a.web.app/.svn/entries",
  "type": "ZAP-10020-1"
}
```


#### INFO: Missing Anti-clickjacking Header

- **CWE:** CWE-1021 (Unknown)
- **Tool:** browser-scanner

**Description:**
The response does not protect against 'ClickJacking' attacks. It should include either Content-Security-Policy with 'frame-ancestors' directive or X-Frame-Options.

**Evidence:**
```
{
  "detail": "N/A",
  "url": "https://claude1-f630a.web.app/.svn/wc.db",
  "type": "ZAP-10020-1"
}
```


#### INFO: Missing Anti-clickjacking Header

- **CWE:** CWE-1021 (Unknown)
- **Tool:** browser-scanner

**Description:**
The response does not protect against 'ClickJacking' attacks. It should include either Content-Security-Policy with 'frame-ancestors' directive or X-Frame-Options.

**Evidence:**
```
{
  "detail": "N/A",
  "url": "https://claude1-f630a.web.app/.hg/hgrc",
  "type": "ZAP-10020-1"
}
```


#### INFO: Missing Anti-clickjacking Header

- **CWE:** CWE-1021 (Unknown)
- **Tool:** browser-scanner

**Description:**
The response does not protect against 'ClickJacking' attacks. It should include either Content-Security-Policy with 'frame-ancestors' directive or X-Frame-Options.

**Evidence:**
```
{
  "detail": "N/A",
  "url": "https://claude1-f630a.web.app/admin.html",
  "type": "ZAP-10020-1"
}
```


#### INFO: Missing Anti-clickjacking Header

- **CWE:** CWE-1021 (Unknown)
- **Tool:** browser-scanner

**Description:**
The response does not protect against 'ClickJacking' attacks. It should include either Content-Security-Policy with 'frame-ancestors' directive or X-Frame-Options.

**Evidence:**
```
{
  "detail": "N/A",
  "url": "https://claude1-f630a.web.app/administrator.html",
  "type": "ZAP-10020-1"
}
```


#### INFO: Missing Anti-clickjacking Header

- **CWE:** CWE-1021 (Unknown)
- **Tool:** browser-scanner

**Description:**
The response does not protect against 'ClickJacking' attacks. It should include either Content-Security-Policy with 'frame-ancestors' directive or X-Frame-Options.

**Evidence:**
```
{
  "detail": "N/A",
  "url": "https://claude1-f630a.web.app/login.html",
  "type": "ZAP-10020-1"
}
```


#### INFO: Missing Anti-clickjacking Header

- **CWE:** CWE-1021 (Unknown)
- **Tool:** browser-scanner

**Description:**
The response does not protect against 'ClickJacking' attacks. It should include either Content-Security-Policy with 'frame-ancestors' directive or X-Frame-Options.

**Evidence:**
```
{
  "detail": "N/A",
  "url": "https://claude1-f630a.web.app/id_rsa",
  "type": "ZAP-10020-1"
}
```


#### INFO: Missing Anti-clickjacking Header

- **CWE:** CWE-1021 (Unknown)
- **Tool:** browser-scanner

**Description:**
The response does not protect against 'ClickJacking' attacks. It should include either Content-Security-Policy with 'frame-ancestors' directive or X-Frame-Options.

**Evidence:**
```
{
  "detail": "N/A",
  "url": "https://claude1-f630a.web.app/id_rsa.pub",
  "type": "ZAP-10020-1"
}
```


#### INFO: Missing Anti-clickjacking Header

- **CWE:** CWE-1021 (Unknown)
- **Tool:** browser-scanner

**Description:**
The response does not protect against 'ClickJacking' attacks. It should include either Content-Security-Policy with 'frame-ancestors' directive or X-Frame-Options.

**Evidence:**
```
{
  "detail": "N/A",
  "url": "https://claude1-f630a.web.app/.ssh/authorized_keys",
  "type": "ZAP-10020-1"
}
```


#### INFO: Missing Anti-clickjacking Header

- **CWE:** CWE-1021 (Unknown)
- **Tool:** browser-scanner

**Description:**
The response does not protect against 'ClickJacking' attacks. It should include either Content-Security-Policy with 'frame-ancestors' directive or X-Frame-Options.

**Evidence:**
```
{
  "detail": "N/A",
  "url": "https://claude1-f630a.web.app/credentials.json",
  "type": "ZAP-10020-1"
}
```


#### INFO: Missing Anti-clickjacking Header

- **CWE:** CWE-1021 (Unknown)
- **Tool:** browser-scanner

**Description:**
The response does not protect against 'ClickJacking' attacks. It should include either Content-Security-Policy with 'frame-ancestors' directive or X-Frame-Options.

**Evidence:**
```
{
  "detail": "N/A",
  "url": "https://claude1-f630a.web.app/secrets.json",
  "type": "ZAP-10020-1"
}
```


#### INFO: Missing Anti-clickjacking Header

- **CWE:** CWE-1021 (Unknown)
- **Tool:** browser-scanner

**Description:**
The response does not protect against 'ClickJacking' attacks. It should include either Content-Security-Policy with 'frame-ancestors' directive or X-Frame-Options.

**Evidence:**
```
{
  "detail": "N/A",
  "url": "https://claude1-f630a.web.app/keys.json",
  "type": "ZAP-10020-1"
}
```


#### INFO: Missing Anti-clickjacking Header

- **CWE:** CWE-1021 (Unknown)
- **Tool:** browser-scanner

**Description:**
The response does not protect against 'ClickJacking' attacks. It should include either Content-Security-Policy with 'frame-ancestors' directive or X-Frame-Options.

**Evidence:**
```
{
  "detail": "N/A",
  "url": "https://claude1-f630a.web.app/api-docs",
  "type": "ZAP-10020-1"
}
```


#### INFO: Missing Anti-clickjacking Header

- **CWE:** CWE-1021 (Unknown)
- **Tool:** browser-scanner

**Description:**
The response does not protect against 'ClickJacking' attacks. It should include either Content-Security-Policy with 'frame-ancestors' directive or X-Frame-Options.

**Evidence:**
```
{
  "detail": "N/A",
  "url": "https://claude1-f630a.web.app/swagger",
  "type": "ZAP-10020-1"
}
```


#### INFO: Missing Anti-clickjacking Header

- **CWE:** CWE-1021 (Unknown)
- **Tool:** browser-scanner

**Description:**
The response does not protect against 'ClickJacking' attacks. It should include either Content-Security-Policy with 'frame-ancestors' directive or X-Frame-Options.

**Evidence:**
```
{
  "detail": "N/A",
  "url": "https://claude1-f630a.web.app/swagger-ui",
  "type": "ZAP-10020-1"
}
```


#### INFO: Missing Anti-clickjacking Header

- **CWE:** CWE-1021 (Unknown)
- **Tool:** browser-scanner

**Description:**
The response does not protect against 'ClickJacking' attacks. It should include either Content-Security-Policy with 'frame-ancestors' directive or X-Frame-Options.

**Evidence:**
```
{
  "detail": "N/A",
  "url": "https://claude1-f630a.web.app/swagger-ui.html",
  "type": "ZAP-10020-1"
}
```


#### INFO: Missing Anti-clickjacking Header

- **CWE:** CWE-1021 (Unknown)
- **Tool:** browser-scanner

**Description:**
The response does not protect against 'ClickJacking' attacks. It should include either Content-Security-Policy with 'frame-ancestors' directive or X-Frame-Options.

**Evidence:**
```
{
  "detail": "N/A",
  "url": "https://claude1-f630a.web.app/swagger.json",
  "type": "ZAP-10020-1"
}
```


#### INFO: Missing Anti-clickjacking Header

- **CWE:** CWE-1021 (Unknown)
- **Tool:** browser-scanner

**Description:**
The response does not protect against 'ClickJacking' attacks. It should include either Content-Security-Policy with 'frame-ancestors' directive or X-Frame-Options.

**Evidence:**
```
{
  "detail": "N/A",
  "url": "https://claude1-f630a.web.app/swagger.yaml",
  "type": "ZAP-10020-1"
}
```


#### INFO: Missing Anti-clickjacking Header

- **CWE:** CWE-1021 (Unknown)
- **Tool:** browser-scanner

**Description:**
The response does not protect against 'ClickJacking' attacks. It should include either Content-Security-Policy with 'frame-ancestors' directive or X-Frame-Options.

**Evidence:**
```
{
  "detail": "N/A",
  "url": "https://claude1-f630a.web.app/openapi",
  "type": "ZAP-10020-1"
}
```


#### INFO: Missing Anti-clickjacking Header

- **CWE:** CWE-1021 (Unknown)
- **Tool:** browser-scanner

**Description:**
The response does not protect against 'ClickJacking' attacks. It should include either Content-Security-Policy with 'frame-ancestors' directive or X-Frame-Options.

**Evidence:**
```
{
  "detail": "N/A",
  "url": "https://claude1-f630a.web.app/openapi.json",
  "type": "ZAP-10020-1"
}
```


#### INFO: Missing Anti-clickjacking Header

- **CWE:** CWE-1021 (Unknown)
- **Tool:** browser-scanner

**Description:**
The response does not protect against 'ClickJacking' attacks. It should include either Content-Security-Policy with 'frame-ancestors' directive or X-Frame-Options.

**Evidence:**
```
{
  "detail": "N/A",
  "url": "https://claude1-f630a.web.app/openapi.yaml",
  "type": "ZAP-10020-1"
}
```


#### INFO: Missing Anti-clickjacking Header

- **CWE:** CWE-1021 (Unknown)
- **Tool:** browser-scanner

**Description:**
The response does not protect against 'ClickJacking' attacks. It should include either Content-Security-Policy with 'frame-ancestors' directive or X-Frame-Options.

**Evidence:**
```
{
  "detail": "N/A",
  "url": "https://claude1-f630a.web.app/api/docs",
  "type": "ZAP-10020-1"
}
```


#### INFO: Missing Anti-clickjacking Header

- **CWE:** CWE-1021 (Unknown)
- **Tool:** browser-scanner

**Description:**
The response does not protect against 'ClickJacking' attacks. It should include either Content-Security-Policy with 'frame-ancestors' directive or X-Frame-Options.

**Evidence:**
```
{
  "detail": "N/A",
  "url": "https://claude1-f630a.web.app/api/swagger",
  "type": "ZAP-10020-1"
}
```


#### INFO: Missing Anti-clickjacking Header

- **CWE:** CWE-1021 (Unknown)
- **Tool:** browser-scanner

**Description:**
The response does not protect against 'ClickJacking' attacks. It should include either Content-Security-Policy with 'frame-ancestors' directive or X-Frame-Options.

**Evidence:**
```
{
  "detail": "N/A",
  "url": "https://claude1-f630a.web.app/v1/api-docs",
  "type": "ZAP-10020-1"
}
```


#### INFO: Missing Anti-clickjacking Header

- **CWE:** CWE-1021 (Unknown)
- **Tool:** browser-scanner

**Description:**
The response does not protect against 'ClickJacking' attacks. It should include either Content-Security-Policy with 'frame-ancestors' directive or X-Frame-Options.

**Evidence:**
```
{
  "detail": "N/A",
  "url": "https://claude1-f630a.web.app/v2/api-docs",
  "type": "ZAP-10020-1"
}
```


#### INFO: Missing Anti-clickjacking Header

- **CWE:** CWE-1021 (Unknown)
- **Tool:** browser-scanner

**Description:**
The response does not protect against 'ClickJacking' attacks. It should include either Content-Security-Policy with 'frame-ancestors' directive or X-Frame-Options.

**Evidence:**
```
{
  "detail": "N/A",
  "url": "https://claude1-f630a.web.app/v3/api-docs",
  "type": "ZAP-10020-1"
}
```


#### INFO: Missing Anti-clickjacking Header

- **CWE:** CWE-1021 (Unknown)
- **Tool:** browser-scanner

**Description:**
The response does not protect against 'ClickJacking' attacks. It should include either Content-Security-Policy with 'frame-ancestors' directive or X-Frame-Options.

**Evidence:**
```
{
  "detail": "N/A",
  "url": "https://claude1-f630a.web.app/graphql",
  "type": "ZAP-10020-1"
}
```


#### INFO: Missing Anti-clickjacking Header

- **CWE:** CWE-1021 (Unknown)
- **Tool:** browser-scanner

**Description:**
The response does not protect against 'ClickJacking' attacks. It should include either Content-Security-Policy with 'frame-ancestors' directive or X-Frame-Options.

**Evidence:**
```
{
  "detail": "N/A",
  "url": "https://claude1-f630a.web.app/graphiql",
  "type": "ZAP-10020-1"
}
```


#### INFO: Missing Anti-clickjacking Header

- **CWE:** CWE-1021 (Unknown)
- **Tool:** browser-scanner

**Description:**
The response does not protect against 'ClickJacking' attacks. It should include either Content-Security-Policy with 'frame-ancestors' directive or X-Frame-Options.

**Evidence:**
```
{
  "detail": "N/A",
  "url": "https://claude1-f630a.web.app/?wsdl",
  "type": "ZAP-10020-1"
}
```


#### INFO: Missing Anti-clickjacking Header

- **CWE:** CWE-1021 (Unknown)
- **Tool:** browser-scanner

**Description:**
The response does not protect against 'ClickJacking' attacks. It should include either Content-Security-Policy with 'frame-ancestors' directive or X-Frame-Options.

**Evidence:**
```
{
  "detail": "N/A",
  "url": "https://claude1-f630a.web.app/service?wsdl",
  "type": "ZAP-10020-1"
}
```


#### INFO: Missing Anti-clickjacking Header

- **CWE:** CWE-1021 (Unknown)
- **Tool:** browser-scanner

**Description:**
The response does not protect against 'ClickJacking' attacks. It should include either Content-Security-Policy with 'frame-ancestors' directive or X-Frame-Options.

**Evidence:**
```
{
  "detail": "N/A",
  "url": "https://claude1-f630a.web.app/api?wsdl",
  "type": "ZAP-10020-1"
}
```


#### INFO: Missing Anti-clickjacking Header

- **CWE:** CWE-1021 (Unknown)
- **Tool:** browser-scanner

**Description:**
The response does not protect against 'ClickJacking' attacks. It should include either Content-Security-Policy with 'frame-ancestors' directive or X-Frame-Options.

**Evidence:**
```
{
  "detail": "N/A",
  "url": "https://claude1-f630a.web.app/ws?wsdl",
  "type": "ZAP-10020-1"
}
```


#### INFO: Missing Anti-clickjacking Header

- **CWE:** CWE-1021 (Unknown)
- **Tool:** browser-scanner

**Description:**
The response does not protect against 'ClickJacking' attacks. It should include either Content-Security-Policy with 'frame-ancestors' directive or X-Frame-Options.

**Evidence:**
```
{
  "detail": "N/A",
  "url": "https://claude1-f630a.web.app/redoc",
  "type": "ZAP-10020-1"
}
```


#### INFO: Missing Anti-clickjacking Header

- **CWE:** CWE-1021 (Unknown)
- **Tool:** browser-scanner

**Description:**
The response does not protect against 'ClickJacking' attacks. It should include either Content-Security-Policy with 'frame-ancestors' directive or X-Frame-Options.

**Evidence:**
```
{
  "detail": "N/A",
  "url": "https://claude1-f630a.web.app/api-explorer",
  "type": "ZAP-10020-1"
}
```


#### INFO: Missing Anti-clickjacking Header

- **CWE:** CWE-1021 (Unknown)
- **Tool:** browser-scanner

**Description:**
The response does not protect against 'ClickJacking' attacks. It should include either Content-Security-Policy with 'frame-ancestors' directive or X-Frame-Options.

**Evidence:**
```
{
  "detail": "N/A",
  "url": "https://claude1-f630a.web.app/developer",
  "type": "ZAP-10020-1"
}
```


#### INFO: Missing Anti-clickjacking Header

- **CWE:** CWE-1021 (Unknown)
- **Tool:** browser-scanner

**Description:**
The response does not protect against 'ClickJacking' attacks. It should include either Content-Security-Policy with 'frame-ancestors' directive or X-Frame-Options.

**Evidence:**
```
{
  "detail": "N/A",
  "url": "https://claude1-f630a.web.app/developers",
  "type": "ZAP-10020-1"
}
```


#### INFO: Missing Anti-clickjacking Header

- **CWE:** CWE-1021 (Unknown)
- **Tool:** browser-scanner

**Description:**
The response does not protect against 'ClickJacking' attacks. It should include either Content-Security-Policy with 'frame-ancestors' directive or X-Frame-Options.

**Evidence:**
```
{
  "detail": "N/A",
  "url": "https://claude1-f630a.web.app/?url=http%3A%2F%2F127.0.0.1%3A22",
  "type": "ZAP-10020-1"
}
```


#### INFO: Missing Anti-clickjacking Header

- **CWE:** CWE-1021 (Unknown)
- **Tool:** browser-scanner

**Description:**
The response does not protect against 'ClickJacking' attacks. It should include either Content-Security-Policy with 'frame-ancestors' directive or X-Frame-Options.

**Evidence:**
```
{
  "detail": "N/A",
  "url": "https://claude1-f630a.web.app/?url=http%3A%2F%2F169.254.169.254%2Flatest%2Fmeta-data%2F",
  "type": "ZAP-10020-1"
}
```


#### INFO: Missing Anti-clickjacking Header

- **CWE:** CWE-1021 (Unknown)
- **Tool:** browser-scanner

**Description:**
The response does not protect against 'ClickJacking' attacks. It should include either Content-Security-Policy with 'frame-ancestors' directive or X-Frame-Options.

**Evidence:**
```
{
  "detail": "N/A",
  "url": "https://claude1-f630a.web.app/?uri=http%3A%2F%2F127.0.0.1%3A22",
  "type": "ZAP-10020-1"
}
```


#### INFO: Missing Anti-clickjacking Header

- **CWE:** CWE-1021 (Unknown)
- **Tool:** browser-scanner

**Description:**
The response does not protect against 'ClickJacking' attacks. It should include either Content-Security-Policy with 'frame-ancestors' directive or X-Frame-Options.

**Evidence:**
```
{
  "detail": "N/A",
  "url": "https://claude1-f630a.web.app/?uri=http%3A%2F%2F169.254.169.254%2Flatest%2Fmeta-data%2F",
  "type": "ZAP-10020-1"
}
```


#### INFO: Missing Anti-clickjacking Header

- **CWE:** CWE-1021 (Unknown)
- **Tool:** browser-scanner

**Description:**
The response does not protect against 'ClickJacking' attacks. It should include either Content-Security-Policy with 'frame-ancestors' directive or X-Frame-Options.

**Evidence:**
```
{
  "detail": "N/A",
  "url": "https://claude1-f630a.web.app/?path=http%3A%2F%2F127.0.0.1%3A22",
  "type": "ZAP-10020-1"
}
```


#### INFO: Missing Anti-clickjacking Header

- **CWE:** CWE-1021 (Unknown)
- **Tool:** browser-scanner

**Description:**
The response does not protect against 'ClickJacking' attacks. It should include either Content-Security-Policy with 'frame-ancestors' directive or X-Frame-Options.

**Evidence:**
```
{
  "detail": "N/A",
  "url": "https://claude1-f630a.web.app/?path=http%3A%2F%2F169.254.169.254%2Flatest%2Fmeta-data%2F",
  "type": "ZAP-10020-1"
}
```


#### INFO: Missing Anti-clickjacking Header

- **CWE:** CWE-1021 (Unknown)
- **Tool:** browser-scanner

**Description:**
The response does not protect against 'ClickJacking' attacks. It should include either Content-Security-Policy with 'frame-ancestors' directive or X-Frame-Options.

**Evidence:**
```
{
  "detail": "N/A",
  "url": "https://claude1-f630a.web.app/?src=http%3A%2F%2F127.0.0.1%3A22",
  "type": "ZAP-10020-1"
}
```


#### INFO: Missing Anti-clickjacking Header

- **CWE:** CWE-1021 (Unknown)
- **Tool:** browser-scanner

**Description:**
The response does not protect against 'ClickJacking' attacks. It should include either Content-Security-Policy with 'frame-ancestors' directive or X-Frame-Options.

**Evidence:**
```
{
  "detail": "N/A",
  "url": "https://claude1-f630a.web.app/?src=http%3A%2F%2F169.254.169.254%2Flatest%2Fmeta-data%2F",
  "type": "ZAP-10020-1"
}
```


#### INFO: Missing Anti-clickjacking Header

- **CWE:** CWE-1021 (Unknown)
- **Tool:** browser-scanner

**Description:**
The response does not protect against 'ClickJacking' attacks. It should include either Content-Security-Policy with 'frame-ancestors' directive or X-Frame-Options.

**Evidence:**
```
{
  "detail": "N/A",
  "url": "https://claude1-f630a.web.app/?source=http%3A%2F%2F127.0.0.1%3A22",
  "type": "ZAP-10020-1"
}
```


#### INFO: Missing Anti-clickjacking Header

- **CWE:** CWE-1021 (Unknown)
- **Tool:** browser-scanner

**Description:**
The response does not protect against 'ClickJacking' attacks. It should include either Content-Security-Policy with 'frame-ancestors' directive or X-Frame-Options.

**Evidence:**
```
{
  "detail": "N/A",
  "url": "https://claude1-f630a.web.app/?source=http%3A%2F%2F169.254.169.254%2Flatest%2Fmeta-data%2F",
  "type": "ZAP-10020-1"
}
```


#### INFO: Missing Anti-clickjacking Header

- **CWE:** CWE-1021 (Unknown)
- **Tool:** browser-scanner

**Description:**
The response does not protect against 'ClickJacking' attacks. It should include either Content-Security-Policy with 'frame-ancestors' directive or X-Frame-Options.

**Evidence:**
```
{
  "detail": "N/A",
  "url": "https://claude1-f630a.web.app/?link=http%3A%2F%2F127.0.0.1%3A22",
  "type": "ZAP-10020-1"
}
```


#### INFO: Missing Anti-clickjacking Header

- **CWE:** CWE-1021 (Unknown)
- **Tool:** browser-scanner

**Description:**
The response does not protect against 'ClickJacking' attacks. It should include either Content-Security-Policy with 'frame-ancestors' directive or X-Frame-Options.

**Evidence:**
```
{
  "detail": "N/A",
  "url": "https://claude1-f630a.web.app/?link=http%3A%2F%2F169.254.169.254%2Flatest%2Fmeta-data%2F",
  "type": "ZAP-10020-1"
}
```


#### INFO: Modern Web Application

- **CWE:** CWE--1 (Unknown)
- **Tool:** browser-scanner

**Description:**
The application appears to be a modern web application. If you need to explore it automatically then the Ajax Spider may well be more effective than the standard one.

**Evidence:**
```
{
  "detail": "<script type=\"module\" crossorigin src=\"/assets/index-Ksqx9DM4.js\"></script>",
  "url": "https://claude1-f630a.web.app/login",
  "type": "ZAP-10109"
}
```


#### INFO: Modern Web Application

- **CWE:** CWE--1 (Unknown)
- **Tool:** browser-scanner

**Description:**
The application appears to be a modern web application. If you need to explore it automatically then the Ajax Spider may well be more effective than the standard one.

**Evidence:**
```
{
  "detail": "<script type=\"module\" crossorigin src=\"/assets/index-Ksqx9DM4.js\"></script>",
  "url": "https://claude1-f630a.web.app/",
  "type": "ZAP-10109"
}
```


#### INFO: Modern Web Application

- **CWE:** CWE--1 (Unknown)
- **Tool:** browser-scanner

**Description:**
The application appears to be a modern web application. If you need to explore it automatically then the Ajax Spider may well be more effective than the standard one.

**Evidence:**
```
{
  "detail": "<script type=\"module\" crossorigin src=\"/assets/index-Ksqx9DM4.js\"></script>",
  "url": "https://claude1-f630a.web.app/profile",
  "type": "ZAP-10109"
}
```


#### INFO: Modern Web Application

- **CWE:** CWE--1 (Unknown)
- **Tool:** browser-scanner

**Description:**
The application appears to be a modern web application. If you need to explore it automatically then the Ajax Spider may well be more effective than the standard one.

**Evidence:**
```
{
  "detail": "<script type=\"module\" crossorigin src=\"/assets/index-Ksqx9DM4.js\"></script>",
  "url": "https://claude1-f630a.web.app/settings",
  "type": "ZAP-10109"
}
```


#### INFO: Modern Web Application

- **CWE:** CWE--1 (Unknown)
- **Tool:** browser-scanner

**Description:**
The application appears to be a modern web application. If you need to explore it automatically then the Ajax Spider may well be more effective than the standard one.

**Evidence:**
```
{
  "detail": "<script type=\"module\" crossorigin src=\"/assets/index-Ksqx9DM4.js\"></script>",
  "url": "https://claude1-f630a.web.app/posts",
  "type": "ZAP-10109"
}
```


#### INFO: Modern Web Application

- **CWE:** CWE--1 (Unknown)
- **Tool:** browser-scanner

**Description:**
The application appears to be a modern web application. If you need to explore it automatically then the Ajax Spider may well be more effective than the standard one.

**Evidence:**
```
{
  "detail": "<script type=\"module\" crossorigin src=\"/assets/index-Ksqx9DM4.js\"></script>",
  "url": "https://claude1-f630a.web.app/messages",
  "type": "ZAP-10109"
}
```


#### INFO: Modern Web Application

- **CWE:** CWE--1 (Unknown)
- **Tool:** browser-scanner

**Description:**
The application appears to be a modern web application. If you need to explore it automatically then the Ajax Spider may well be more effective than the standard one.

**Evidence:**
```
{
  "detail": "<script type=\"module\" crossorigin src=\"/assets/index-Ksqx9DM4.js\"></script>",
  "url": "https://claude1-f630a.web.app/feed",
  "type": "ZAP-10109"
}
```


#### INFO: Modern Web Application

- **CWE:** CWE--1 (Unknown)
- **Tool:** browser-scanner

**Description:**
The application appears to be a modern web application. If you need to explore it automatically then the Ajax Spider may well be more effective than the standard one.

**Evidence:**
```
{
  "detail": "<script type=\"module\" crossorigin src=\"/assets/index-Ksqx9DM4.js\"></script>",
  "url": "https://claude1-f630a.web.app/__nonexistent__1765814154834_60a0fe5bc75a5",
  "type": "ZAP-10109"
}
```


#### INFO: Modern Web Application

- **CWE:** CWE--1 (Unknown)
- **Tool:** browser-scanner

**Description:**
The application appears to be a modern web application. If you need to explore it automatically then the Ajax Spider may well be more effective than the standard one.

**Evidence:**
```
{
  "detail": "<script type=\"module\" crossorigin src=\"/assets/index-Ksqx9DM4.js\"></script>",
  "url": "https://claude1-f630a.web.app/?file=..%2F..%2F..%2Fetc%2Fpasswd",
  "type": "ZAP-10109"
}
```


#### INFO: Modern Web Application

- **CWE:** CWE--1 (Unknown)
- **Tool:** browser-scanner

**Description:**
The application appears to be a modern web application. If you need to explore it automatically then the Ajax Spider may well be more effective than the standard one.

**Evidence:**
```
{
  "detail": "<script type=\"module\" crossorigin src=\"/assets/index-Ksqx9DM4.js\"></script>",
  "url": "https://claude1-f630a.web.app/?file=..%5C..%5C..%5Cwindows%5Cwin.ini",
  "type": "ZAP-10109"
}
```


#### INFO: Modern Web Application

- **CWE:** CWE--1 (Unknown)
- **Tool:** browser-scanner

**Description:**
The application appears to be a modern web application. If you need to explore it automatically then the Ajax Spider may well be more effective than the standard one.

**Evidence:**
```
{
  "detail": "<script type=\"module\" crossorigin src=\"/assets/index-Ksqx9DM4.js\"></script>",
  "url": "https://claude1-f630a.web.app/?file=....%2F%2F....%2F%2F....%2F%2Fetc%2Fpasswd",
  "type": "ZAP-10109"
}
```


#### INFO: Modern Web Application

- **CWE:** CWE--1 (Unknown)
- **Tool:** browser-scanner

**Description:**
The application appears to be a modern web application. If you need to explore it automatically then the Ajax Spider may well be more effective than the standard one.

**Evidence:**
```
{
  "detail": "<script type=\"module\" crossorigin src=\"/assets/index-Ksqx9DM4.js\"></script>",
  "url": "https://claude1-f630a.web.app/?file=..%252f..%252f..%252fetc%2Fpasswd",
  "type": "ZAP-10109"
}
```


#### INFO: Modern Web Application

- **CWE:** CWE--1 (Unknown)
- **Tool:** browser-scanner

**Description:**
The application appears to be a modern web application. If you need to explore it automatically then the Ajax Spider may well be more effective than the standard one.

**Evidence:**
```
{
  "detail": "<script type=\"module\" crossorigin src=\"/assets/index-Ksqx9DM4.js\"></script>",
  "url": "https://claude1-f630a.web.app/?path=..%2F..%2F..%2Fetc%2Fpasswd",
  "type": "ZAP-10109"
}
```


#### INFO: Modern Web Application

- **CWE:** CWE--1 (Unknown)
- **Tool:** browser-scanner

**Description:**
The application appears to be a modern web application. If you need to explore it automatically then the Ajax Spider may well be more effective than the standard one.

**Evidence:**
```
{
  "detail": "<script type=\"module\" crossorigin src=\"/assets/index-Ksqx9DM4.js\"></script>",
  "url": "https://claude1-f630a.web.app/?path=..%5C..%5C..%5Cwindows%5Cwin.ini",
  "type": "ZAP-10109"
}
```


#### INFO: Modern Web Application

- **CWE:** CWE--1 (Unknown)
- **Tool:** browser-scanner

**Description:**
The application appears to be a modern web application. If you need to explore it automatically then the Ajax Spider may well be more effective than the standard one.

**Evidence:**
```
{
  "detail": "<script type=\"module\" crossorigin src=\"/assets/index-Ksqx9DM4.js\"></script>",
  "url": "https://claude1-f630a.web.app/?path=....%2F%2F....%2F%2F....%2F%2Fetc%2Fpasswd",
  "type": "ZAP-10109"
}
```


#### INFO: Modern Web Application

- **CWE:** CWE--1 (Unknown)
- **Tool:** browser-scanner

**Description:**
The application appears to be a modern web application. If you need to explore it automatically then the Ajax Spider may well be more effective than the standard one.

**Evidence:**
```
{
  "detail": "<script type=\"module\" crossorigin src=\"/assets/index-Ksqx9DM4.js\"></script>",
  "url": "https://claude1-f630a.web.app/?path=..%252f..%252f..%252fetc%2Fpasswd",
  "type": "ZAP-10109"
}
```


#### INFO: Modern Web Application

- **CWE:** CWE--1 (Unknown)
- **Tool:** browser-scanner

**Description:**
The application appears to be a modern web application. If you need to explore it automatically then the Ajax Spider may well be more effective than the standard one.

**Evidence:**
```
{
  "detail": "<script type=\"module\" crossorigin src=\"/assets/index-Ksqx9DM4.js\"></script>",
  "url": "https://claude1-f630a.web.app/?filepath=..%2F..%2F..%2Fetc%2Fpasswd",
  "type": "ZAP-10109"
}
```


#### INFO: Modern Web Application

- **CWE:** CWE--1 (Unknown)
- **Tool:** browser-scanner

**Description:**
The application appears to be a modern web application. If you need to explore it automatically then the Ajax Spider may well be more effective than the standard one.

**Evidence:**
```
{
  "detail": "<script type=\"module\" crossorigin src=\"/assets/index-Ksqx9DM4.js\"></script>",
  "url": "https://claude1-f630a.web.app/?filepath=..%5C..%5C..%5Cwindows%5Cwin.ini",
  "type": "ZAP-10109"
}
```


#### INFO: Modern Web Application

- **CWE:** CWE--1 (Unknown)
- **Tool:** browser-scanner

**Description:**
The application appears to be a modern web application. If you need to explore it automatically then the Ajax Spider may well be more effective than the standard one.

**Evidence:**
```
{
  "detail": "<script type=\"module\" crossorigin src=\"/assets/index-Ksqx9DM4.js\"></script>",
  "url": "https://claude1-f630a.web.app/?filepath=....%2F%2F....%2F%2F....%2F%2Fetc%2Fpasswd",
  "type": "ZAP-10109"
}
```


#### INFO: Modern Web Application

- **CWE:** CWE--1 (Unknown)
- **Tool:** browser-scanner

**Description:**
The application appears to be a modern web application. If you need to explore it automatically then the Ajax Spider may well be more effective than the standard one.

**Evidence:**
```
{
  "detail": "<script type=\"module\" crossorigin src=\"/assets/index-Ksqx9DM4.js\"></script>",
  "url": "https://claude1-f630a.web.app/?filepath=..%252f..%252f..%252fetc%2Fpasswd",
  "type": "ZAP-10109"
}
```


#### INFO: Modern Web Application

- **CWE:** CWE--1 (Unknown)
- **Tool:** browser-scanner

**Description:**
The application appears to be a modern web application. If you need to explore it automatically then the Ajax Spider may well be more effective than the standard one.

**Evidence:**
```
{
  "detail": "<script type=\"module\" crossorigin src=\"/assets/index-Ksqx9DM4.js\"></script>",
  "url": "https://claude1-f630a.web.app/?document=..%2F..%2F..%2Fetc%2Fpasswd",
  "type": "ZAP-10109"
}
```


#### INFO: Modern Web Application

- **CWE:** CWE--1 (Unknown)
- **Tool:** browser-scanner

**Description:**
The application appears to be a modern web application. If you need to explore it automatically then the Ajax Spider may well be more effective than the standard one.

**Evidence:**
```
{
  "detail": "<script type=\"module\" crossorigin src=\"/assets/index-Ksqx9DM4.js\"></script>",
  "url": "https://claude1-f630a.web.app/?document=..%5C..%5C..%5Cwindows%5Cwin.ini",
  "type": "ZAP-10109"
}
```


#### INFO: Modern Web Application

- **CWE:** CWE--1 (Unknown)
- **Tool:** browser-scanner

**Description:**
The application appears to be a modern web application. If you need to explore it automatically then the Ajax Spider may well be more effective than the standard one.

**Evidence:**
```
{
  "detail": "<script type=\"module\" crossorigin src=\"/assets/index-Ksqx9DM4.js\"></script>",
  "url": "https://claude1-f630a.web.app/?document=....%2F%2F....%2F%2F....%2F%2Fetc%2Fpasswd",
  "type": "ZAP-10109"
}
```


#### INFO: Modern Web Application

- **CWE:** CWE--1 (Unknown)
- **Tool:** browser-scanner

**Description:**
The application appears to be a modern web application. If you need to explore it automatically then the Ajax Spider may well be more effective than the standard one.

**Evidence:**
```
{
  "detail": "<script type=\"module\" crossorigin src=\"/assets/index-Ksqx9DM4.js\"></script>",
  "url": "https://claude1-f630a.web.app/?document=..%252f..%252f..%252fetc%2Fpasswd",
  "type": "ZAP-10109"
}
```


#### INFO: Modern Web Application

- **CWE:** CWE--1 (Unknown)
- **Tool:** browser-scanner

**Description:**
The application appears to be a modern web application. If you need to explore it automatically then the Ajax Spider may well be more effective than the standard one.

**Evidence:**
```
{
  "detail": "<script type=\"module\" crossorigin src=\"/assets/index-Ksqx9DM4.js\"></script>",
  "url": "https://claude1-f630a.web.app/?doc=..%2F..%2F..%2Fetc%2Fpasswd",
  "type": "ZAP-10109"
}
```


#### INFO: Modern Web Application

- **CWE:** CWE--1 (Unknown)
- **Tool:** browser-scanner

**Description:**
The application appears to be a modern web application. If you need to explore it automatically then the Ajax Spider may well be more effective than the standard one.

**Evidence:**
```
{
  "detail": "<script type=\"module\" crossorigin src=\"/assets/index-Ksqx9DM4.js\"></script>",
  "url": "https://claude1-f630a.web.app/?doc=..%5C..%5C..%5Cwindows%5Cwin.ini",
  "type": "ZAP-10109"
}
```


#### INFO: Modern Web Application

- **CWE:** CWE--1 (Unknown)
- **Tool:** browser-scanner

**Description:**
The application appears to be a modern web application. If you need to explore it automatically then the Ajax Spider may well be more effective than the standard one.

**Evidence:**
```
{
  "detail": "<script type=\"module\" crossorigin src=\"/assets/index-Ksqx9DM4.js\"></script>",
  "url": "https://claude1-f630a.web.app/?doc=....%2F%2F....%2F%2F....%2F%2Fetc%2Fpasswd",
  "type": "ZAP-10109"
}
```


#### INFO: Modern Web Application

- **CWE:** CWE--1 (Unknown)
- **Tool:** browser-scanner

**Description:**
The application appears to be a modern web application. If you need to explore it automatically then the Ajax Spider may well be more effective than the standard one.

**Evidence:**
```
{
  "detail": "<script type=\"module\" crossorigin src=\"/assets/index-Ksqx9DM4.js\"></script>",
  "url": "https://claude1-f630a.web.app/?doc=..%252f..%252f..%252fetc%2Fpasswd",
  "type": "ZAP-10109"
}
```


#### INFO: Modern Web Application

- **CWE:** CWE--1 (Unknown)
- **Tool:** browser-scanner

**Description:**
The application appears to be a modern web application. If you need to explore it automatically then the Ajax Spider may well be more effective than the standard one.

**Evidence:**
```
{
  "detail": "<script type=\"module\" crossorigin src=\"/assets/index-Ksqx9DM4.js\"></script>",
  "url": "https://claude1-f630a.web.app/?page=..%2F..%2F..%2Fetc%2Fpasswd",
  "type": "ZAP-10109"
}
```


#### INFO: Modern Web Application

- **CWE:** CWE--1 (Unknown)
- **Tool:** browser-scanner

**Description:**
The application appears to be a modern web application. If you need to explore it automatically then the Ajax Spider may well be more effective than the standard one.

**Evidence:**
```
{
  "detail": "<script type=\"module\" crossorigin src=\"/assets/index-Ksqx9DM4.js\"></script>",
  "url": "https://claude1-f630a.web.app/?page=..%5C..%5C..%5Cwindows%5Cwin.ini",
  "type": "ZAP-10109"
}
```


#### INFO: Modern Web Application

- **CWE:** CWE--1 (Unknown)
- **Tool:** browser-scanner

**Description:**
The application appears to be a modern web application. If you need to explore it automatically then the Ajax Spider may well be more effective than the standard one.

**Evidence:**
```
{
  "detail": "<script type=\"module\" crossorigin src=\"/assets/index-Ksqx9DM4.js\"></script>",
  "url": "https://claude1-f630a.web.app/?page=....%2F%2F....%2F%2F....%2F%2Fetc%2Fpasswd",
  "type": "ZAP-10109"
}
```


#### INFO: Modern Web Application

- **CWE:** CWE--1 (Unknown)
- **Tool:** browser-scanner

**Description:**
The application appears to be a modern web application. If you need to explore it automatically then the Ajax Spider may well be more effective than the standard one.

**Evidence:**
```
{
  "detail": "<script type=\"module\" crossorigin src=\"/assets/index-Ksqx9DM4.js\"></script>",
  "url": "https://claude1-f630a.web.app/?page=..%252f..%252f..%252fetc%2Fpasswd",
  "type": "ZAP-10109"
}
```


#### INFO: Modern Web Application

- **CWE:** CWE--1 (Unknown)
- **Tool:** browser-scanner

**Description:**
The application appears to be a modern web application. If you need to explore it automatically then the Ajax Spider may well be more effective than the standard one.

**Evidence:**
```
{
  "detail": "<script type=\"module\" crossorigin src=\"/assets/index-Ksqx9DM4.js\"></script>",
  "url": "https://claude1-f630a.web.app/?template=..%2F..%2F..%2Fetc%2Fpasswd",
  "type": "ZAP-10109"
}
```


#### INFO: Modern Web Application

- **CWE:** CWE--1 (Unknown)
- **Tool:** browser-scanner

**Description:**
The application appears to be a modern web application. If you need to explore it automatically then the Ajax Spider may well be more effective than the standard one.

**Evidence:**
```
{
  "detail": "<script type=\"module\" crossorigin src=\"/assets/index-Ksqx9DM4.js\"></script>",
  "url": "https://claude1-f630a.web.app/?template=..%5C..%5C..%5Cwindows%5Cwin.ini",
  "type": "ZAP-10109"
}
```


#### INFO: Modern Web Application

- **CWE:** CWE--1 (Unknown)
- **Tool:** browser-scanner

**Description:**
The application appears to be a modern web application. If you need to explore it automatically then the Ajax Spider may well be more effective than the standard one.

**Evidence:**
```
{
  "detail": "<script type=\"module\" crossorigin src=\"/assets/index-Ksqx9DM4.js\"></script>",
  "url": "https://claude1-f630a.web.app/?template=....%2F%2F....%2F%2F....%2F%2Fetc%2Fpasswd",
  "type": "ZAP-10109"
}
```


#### INFO: Modern Web Application

- **CWE:** CWE--1 (Unknown)
- **Tool:** browser-scanner

**Description:**
The application appears to be a modern web application. If you need to explore it automatically then the Ajax Spider may well be more effective than the standard one.

**Evidence:**
```
{
  "detail": "<script type=\"module\" crossorigin src=\"/assets/index-Ksqx9DM4.js\"></script>",
  "url": "https://claude1-f630a.web.app/?template=..%252f..%252f..%252fetc%2Fpasswd",
  "type": "ZAP-10109"
}
```


#### INFO: Modern Web Application

- **CWE:** CWE--1 (Unknown)
- **Tool:** browser-scanner

**Description:**
The application appears to be a modern web application. If you need to explore it automatically then the Ajax Spider may well be more effective than the standard one.

**Evidence:**
```
{
  "detail": "<script type=\"module\" crossorigin src=\"/assets/index-Ksqx9DM4.js\"></script>",
  "url": "https://claude1-f630a.web.app/?include=..%2F..%2F..%2Fetc%2Fpasswd",
  "type": "ZAP-10109"
}
```


#### INFO: Modern Web Application

- **CWE:** CWE--1 (Unknown)
- **Tool:** browser-scanner

**Description:**
The application appears to be a modern web application. If you need to explore it automatically then the Ajax Spider may well be more effective than the standard one.

**Evidence:**
```
{
  "detail": "<script type=\"module\" crossorigin src=\"/assets/index-Ksqx9DM4.js\"></script>",
  "url": "https://claude1-f630a.web.app/?include=..%5C..%5C..%5Cwindows%5Cwin.ini",
  "type": "ZAP-10109"
}
```


#### INFO: Modern Web Application

- **CWE:** CWE--1 (Unknown)
- **Tool:** browser-scanner

**Description:**
The application appears to be a modern web application. If you need to explore it automatically then the Ajax Spider may well be more effective than the standard one.

**Evidence:**
```
{
  "detail": "<script type=\"module\" crossorigin src=\"/assets/index-Ksqx9DM4.js\"></script>",
  "url": "https://claude1-f630a.web.app/?include=....%2F%2F....%2F%2F....%2F%2Fetc%2Fpasswd",
  "type": "ZAP-10109"
}
```


#### INFO: Modern Web Application

- **CWE:** CWE--1 (Unknown)
- **Tool:** browser-scanner

**Description:**
The application appears to be a modern web application. If you need to explore it automatically then the Ajax Spider may well be more effective than the standard one.

**Evidence:**
```
{
  "detail": "<script type=\"module\" crossorigin src=\"/assets/index-Ksqx9DM4.js\"></script>",
  "url": "https://claude1-f630a.web.app/?include=..%252f..%252f..%252fetc%2Fpasswd",
  "type": "ZAP-10109"
}
```


#### INFO: Modern Web Application

- **CWE:** CWE--1 (Unknown)
- **Tool:** browser-scanner

**Description:**
The application appears to be a modern web application. If you need to explore it automatically then the Ajax Spider may well be more effective than the standard one.

**Evidence:**
```
{
  "detail": "<script type=\"module\" crossorigin src=\"/assets/index-Ksqx9DM4.js\"></script>",
  "url": "https://claude1-f630a.web.app/?dir=..%2F..%2F..%2Fetc%2Fpasswd",
  "type": "ZAP-10109"
}
```


#### INFO: Modern Web Application

- **CWE:** CWE--1 (Unknown)
- **Tool:** browser-scanner

**Description:**
The application appears to be a modern web application. If you need to explore it automatically then the Ajax Spider may well be more effective than the standard one.

**Evidence:**
```
{
  "detail": "<script type=\"module\" crossorigin src=\"/assets/index-Ksqx9DM4.js\"></script>",
  "url": "https://claude1-f630a.web.app/?dir=..%5C..%5C..%5Cwindows%5Cwin.ini",
  "type": "ZAP-10109"
}
```


#### INFO: Modern Web Application

- **CWE:** CWE--1 (Unknown)
- **Tool:** browser-scanner

**Description:**
The application appears to be a modern web application. If you need to explore it automatically then the Ajax Spider may well be more effective than the standard one.

**Evidence:**
```
{
  "detail": "<script type=\"module\" crossorigin src=\"/assets/index-Ksqx9DM4.js\"></script>",
  "url": "https://claude1-f630a.web.app/?dir=....%2F%2F....%2F%2F....%2F%2Fetc%2Fpasswd",
  "type": "ZAP-10109"
}
```


#### INFO: Modern Web Application

- **CWE:** CWE--1 (Unknown)
- **Tool:** browser-scanner

**Description:**
The application appears to be a modern web application. If you need to explore it automatically then the Ajax Spider may well be more effective than the standard one.

**Evidence:**
```
{
  "detail": "<script type=\"module\" crossorigin src=\"/assets/index-Ksqx9DM4.js\"></script>",
  "url": "https://claude1-f630a.web.app/?dir=..%252f..%252f..%252fetc%2Fpasswd",
  "type": "ZAP-10109"
}
```


#### INFO: Modern Web Application

- **CWE:** CWE--1 (Unknown)
- **Tool:** browser-scanner

**Description:**
The application appears to be a modern web application. If you need to explore it automatically then the Ajax Spider may well be more effective than the standard one.

**Evidence:**
```
{
  "detail": "<script type=\"module\" crossorigin src=\"/assets/index-Ksqx9DM4.js\"></script>",
  "url": "https://claude1-f630a.web.app/?folder=..%2F..%2F..%2Fetc%2Fpasswd",
  "type": "ZAP-10109"
}
```


#### INFO: Modern Web Application

- **CWE:** CWE--1 (Unknown)
- **Tool:** browser-scanner

**Description:**
The application appears to be a modern web application. If you need to explore it automatically then the Ajax Spider may well be more effective than the standard one.

**Evidence:**
```
{
  "detail": "<script type=\"module\" crossorigin src=\"/assets/index-Ksqx9DM4.js\"></script>",
  "url": "https://claude1-f630a.web.app/?folder=..%5C..%5C..%5Cwindows%5Cwin.ini",
  "type": "ZAP-10109"
}
```


#### INFO: Modern Web Application

- **CWE:** CWE--1 (Unknown)
- **Tool:** browser-scanner

**Description:**
The application appears to be a modern web application. If you need to explore it automatically then the Ajax Spider may well be more effective than the standard one.

**Evidence:**
```
{
  "detail": "<script type=\"module\" crossorigin src=\"/assets/index-Ksqx9DM4.js\"></script>",
  "url": "https://claude1-f630a.web.app/?folder=....%2F%2F....%2F%2F....%2F%2Fetc%2Fpasswd",
  "type": "ZAP-10109"
}
```


#### INFO: Modern Web Application

- **CWE:** CWE--1 (Unknown)
- **Tool:** browser-scanner

**Description:**
The application appears to be a modern web application. If you need to explore it automatically then the Ajax Spider may well be more effective than the standard one.

**Evidence:**
```
{
  "detail": "<script type=\"module\" crossorigin src=\"/assets/index-Ksqx9DM4.js\"></script>",
  "url": "https://claude1-f630a.web.app/?folder=..%252f..%252f..%252fetc%2Fpasswd",
  "type": "ZAP-10109"
}
```


#### INFO: Modern Web Application

- **CWE:** CWE--1 (Unknown)
- **Tool:** browser-scanner

**Description:**
The application appears to be a modern web application. If you need to explore it automatically then the Ajax Spider may well be more effective than the standard one.

**Evidence:**
```
{
  "detail": "<script type=\"module\" crossorigin src=\"/assets/index-Ksqx9DM4.js\"></script>",
  "url": "https://claude1-f630a.web.app/?load=..%2F..%2F..%2Fetc%2Fpasswd",
  "type": "ZAP-10109"
}
```


#### INFO: Modern Web Application

- **CWE:** CWE--1 (Unknown)
- **Tool:** browser-scanner

**Description:**
The application appears to be a modern web application. If you need to explore it automatically then the Ajax Spider may well be more effective than the standard one.

**Evidence:**
```
{
  "detail": "<script type=\"module\" crossorigin src=\"/assets/index-Ksqx9DM4.js\"></script>",
  "url": "https://claude1-f630a.web.app/?load=..%5C..%5C..%5Cwindows%5Cwin.ini",
  "type": "ZAP-10109"
}
```


#### INFO: Modern Web Application

- **CWE:** CWE--1 (Unknown)
- **Tool:** browser-scanner

**Description:**
The application appears to be a modern web application. If you need to explore it automatically then the Ajax Spider may well be more effective than the standard one.

**Evidence:**
```
{
  "detail": "<script type=\"module\" crossorigin src=\"/assets/index-Ksqx9DM4.js\"></script>",
  "url": "https://claude1-f630a.web.app/?load=....%2F%2F....%2F%2F....%2F%2Fetc%2Fpasswd",
  "type": "ZAP-10109"
}
```


#### INFO: Modern Web Application

- **CWE:** CWE--1 (Unknown)
- **Tool:** browser-scanner

**Description:**
The application appears to be a modern web application. If you need to explore it automatically then the Ajax Spider may well be more effective than the standard one.

**Evidence:**
```
{
  "detail": "<script type=\"module\" crossorigin src=\"/assets/index-Ksqx9DM4.js\"></script>",
  "url": "https://claude1-f630a.web.app/?load=..%252f..%252f..%252fetc%2Fpasswd",
  "type": "ZAP-10109"
}
```


#### INFO: Modern Web Application

- **CWE:** CWE--1 (Unknown)
- **Tool:** browser-scanner

**Description:**
The application appears to be a modern web application. If you need to explore it automatically then the Ajax Spider may well be more effective than the standard one.

**Evidence:**
```
{
  "detail": "<script type=\"module\" crossorigin src=\"/assets/index-Ksqx9DM4.js\"></script>",
  "url": "https://claude1-f630a.web.app/?read=..%2F..%2F..%2Fetc%2Fpasswd",
  "type": "ZAP-10109"
}
```


#### INFO: Modern Web Application

- **CWE:** CWE--1 (Unknown)
- **Tool:** browser-scanner

**Description:**
The application appears to be a modern web application. If you need to explore it automatically then the Ajax Spider may well be more effective than the standard one.

**Evidence:**
```
{
  "detail": "<script type=\"module\" crossorigin src=\"/assets/index-Ksqx9DM4.js\"></script>",
  "url": "https://claude1-f630a.web.app/?read=..%5C..%5C..%5Cwindows%5Cwin.ini",
  "type": "ZAP-10109"
}
```


#### INFO: Modern Web Application

- **CWE:** CWE--1 (Unknown)
- **Tool:** browser-scanner

**Description:**
The application appears to be a modern web application. If you need to explore it automatically then the Ajax Spider may well be more effective than the standard one.

**Evidence:**
```
{
  "detail": "<script type=\"module\" crossorigin src=\"/assets/index-Ksqx9DM4.js\"></script>",
  "url": "https://claude1-f630a.web.app/?read=....%2F%2F....%2F%2F....%2F%2Fetc%2Fpasswd",
  "type": "ZAP-10109"
}
```


#### INFO: Modern Web Application

- **CWE:** CWE--1 (Unknown)
- **Tool:** browser-scanner

**Description:**
The application appears to be a modern web application. If you need to explore it automatically then the Ajax Spider may well be more effective than the standard one.

**Evidence:**
```
{
  "detail": "<script type=\"module\" crossorigin src=\"/assets/index-Ksqx9DM4.js\"></script>",
  "url": "https://claude1-f630a.web.app/?read=..%252f..%252f..%252fetc%2Fpasswd",
  "type": "ZAP-10109"
}
```


#### INFO: Modern Web Application

- **CWE:** CWE--1 (Unknown)
- **Tool:** browser-scanner

**Description:**
The application appears to be a modern web application. If you need to explore it automatically then the Ajax Spider may well be more effective than the standard one.

**Evidence:**
```
{
  "detail": "<script type=\"module\" crossorigin src=\"/assets/index-Ksqx9DM4.js\"></script>",
  "url": "https://claude1-f630a.web.app/images/",
  "type": "ZAP-10109"
}
```


#### INFO: Modern Web Application

- **CWE:** CWE--1 (Unknown)
- **Tool:** browser-scanner

**Description:**
The application appears to be a modern web application. If you need to explore it automatically then the Ajax Spider may well be more effective than the standard one.

**Evidence:**
```
{
  "detail": "<script type=\"module\" crossorigin src=\"/assets/index-Ksqx9DM4.js\"></script>",
  "url": "https://claude1-f630a.web.app/uploads/",
  "type": "ZAP-10109"
}
```


#### INFO: Modern Web Application

- **CWE:** CWE--1 (Unknown)
- **Tool:** browser-scanner

**Description:**
The application appears to be a modern web application. If you need to explore it automatically then the Ajax Spider may well be more effective than the standard one.

**Evidence:**
```
{
  "detail": "<script type=\"module\" crossorigin src=\"/assets/index-Ksqx9DM4.js\"></script>",
  "url": "https://claude1-f630a.web.app/files/",
  "type": "ZAP-10109"
}
```


#### INFO: Modern Web Application

- **CWE:** CWE--1 (Unknown)
- **Tool:** browser-scanner

**Description:**
The application appears to be a modern web application. If you need to explore it automatically then the Ajax Spider may well be more effective than the standard one.

**Evidence:**
```
{
  "detail": "<script type=\"module\" crossorigin src=\"/assets/index-Ksqx9DM4.js\"></script>",
  "url": "https://claude1-f630a.web.app/assets/",
  "type": "ZAP-10109"
}
```


#### INFO: Modern Web Application

- **CWE:** CWE--1 (Unknown)
- **Tool:** browser-scanner

**Description:**
The application appears to be a modern web application. If you need to explore it automatically then the Ajax Spider may well be more effective than the standard one.

**Evidence:**
```
{
  "detail": "<script type=\"module\" crossorigin src=\"/assets/index-Ksqx9DM4.js\"></script>",
  "url": "https://claude1-f630a.web.app/static/",
  "type": "ZAP-10109"
}
```


#### INFO: Modern Web Application

- **CWE:** CWE--1 (Unknown)
- **Tool:** browser-scanner

**Description:**
The application appears to be a modern web application. If you need to explore it automatically then the Ajax Spider may well be more effective than the standard one.

**Evidence:**
```
{
  "detail": "<script type=\"module\" crossorigin src=\"/assets/index-Ksqx9DM4.js\"></script>",
  "url": "https://claude1-f630a.web.app/media/",
  "type": "ZAP-10109"
}
```


#### INFO: Modern Web Application

- **CWE:** CWE--1 (Unknown)
- **Tool:** browser-scanner

**Description:**
The application appears to be a modern web application. If you need to explore it automatically then the Ajax Spider may well be more effective than the standard one.

**Evidence:**
```
{
  "detail": "<script type=\"module\" crossorigin src=\"/assets/index-Ksqx9DM4.js\"></script>",
  "url": "https://claude1-f630a.web.app/backup/",
  "type": "ZAP-10109"
}
```


#### INFO: Modern Web Application

- **CWE:** CWE--1 (Unknown)
- **Tool:** browser-scanner

**Description:**
The application appears to be a modern web application. If you need to explore it automatically then the Ajax Spider may well be more effective than the standard one.

**Evidence:**
```
{
  "detail": "<script type=\"module\" crossorigin src=\"/assets/index-Ksqx9DM4.js\"></script>",
  "url": "https://claude1-f630a.web.app/logs/",
  "type": "ZAP-10109"
}
```


#### INFO: Modern Web Application

- **CWE:** CWE--1 (Unknown)
- **Tool:** browser-scanner

**Description:**
The application appears to be a modern web application. If you need to explore it automatically then the Ajax Spider may well be more effective than the standard one.

**Evidence:**
```
{
  "detail": "<script type=\"module\" crossorigin src=\"/assets/index-Ksqx9DM4.js\"></script>",
  "url": "https://claude1-f630a.web.app/tmp/",
  "type": "ZAP-10109"
}
```


#### INFO: Modern Web Application

- **CWE:** CWE--1 (Unknown)
- **Tool:** browser-scanner

**Description:**
The application appears to be a modern web application. If you need to explore it automatically then the Ajax Spider may well be more effective than the standard one.

**Evidence:**
```
{
  "detail": "<script type=\"module\" crossorigin src=\"/assets/index-Ksqx9DM4.js\"></script>",
  "url": "https://claude1-f630a.web.app/data/",
  "type": "ZAP-10109"
}
```


#### INFO: Modern Web Application

- **CWE:** CWE--1 (Unknown)
- **Tool:** browser-scanner

**Description:**
The application appears to be a modern web application. If you need to explore it automatically then the Ajax Spider may well be more effective than the standard one.

**Evidence:**
```
{
  "detail": "<script type=\"module\" crossorigin src=\"/assets/index-Ksqx9DM4.js\"></script>",
  "url": "https://claude1-f630a.web.app/admin",
  "type": "ZAP-10109"
}
```


#### INFO: Modern Web Application

- **CWE:** CWE--1 (Unknown)
- **Tool:** browser-scanner

**Description:**
The application appears to be a modern web application. If you need to explore it automatically then the Ajax Spider may well be more effective than the standard one.

**Evidence:**
```
{
  "detail": "<script type=\"module\" crossorigin src=\"/assets/index-Ksqx9DM4.js\"></script>",
  "url": "https://claude1-f630a.web.app/admin/",
  "type": "ZAP-10109"
}
```


#### INFO: Modern Web Application

- **CWE:** CWE--1 (Unknown)
- **Tool:** browser-scanner

**Description:**
The application appears to be a modern web application. If you need to explore it automatically then the Ajax Spider may well be more effective than the standard one.

**Evidence:**
```
{
  "detail": "<script type=\"module\" crossorigin src=\"/assets/index-Ksqx9DM4.js\"></script>",
  "url": "https://claude1-f630a.web.app/admin/dashboard",
  "type": "ZAP-10109"
}
```


#### INFO: Modern Web Application

- **CWE:** CWE--1 (Unknown)
- **Tool:** browser-scanner

**Description:**
The application appears to be a modern web application. If you need to explore it automatically then the Ajax Spider may well be more effective than the standard one.

**Evidence:**
```
{
  "detail": "<script type=\"module\" crossorigin src=\"/assets/index-Ksqx9DM4.js\"></script>",
  "url": "https://claude1-f630a.web.app/admin/users",
  "type": "ZAP-10109"
}
```


#### INFO: Modern Web Application

- **CWE:** CWE--1 (Unknown)
- **Tool:** browser-scanner

**Description:**
The application appears to be a modern web application. If you need to explore it automatically then the Ajax Spider may well be more effective than the standard one.

**Evidence:**
```
{
  "detail": "<script type=\"module\" crossorigin src=\"/assets/index-Ksqx9DM4.js\"></script>",
  "url": "https://claude1-f630a.web.app/admin/settings",
  "type": "ZAP-10109"
}
```


#### INFO: Modern Web Application

- **CWE:** CWE--1 (Unknown)
- **Tool:** browser-scanner

**Description:**
The application appears to be a modern web application. If you need to explore it automatically then the Ajax Spider may well be more effective than the standard one.

**Evidence:**
```
{
  "detail": "<script type=\"module\" crossorigin src=\"/assets/index-Ksqx9DM4.js\"></script>",
  "url": "https://claude1-f630a.web.app/administrator",
  "type": "ZAP-10109"
}
```


#### INFO: Modern Web Application

- **CWE:** CWE--1 (Unknown)
- **Tool:** browser-scanner

**Description:**
The application appears to be a modern web application. If you need to explore it automatically then the Ajax Spider may well be more effective than the standard one.

**Evidence:**
```
{
  "detail": "<script type=\"module\" crossorigin src=\"/assets/index-Ksqx9DM4.js\"></script>",
  "url": "https://claude1-f630a.web.app/manage",
  "type": "ZAP-10109"
}
```


#### INFO: Modern Web Application

- **CWE:** CWE--1 (Unknown)
- **Tool:** browser-scanner

**Description:**
The application appears to be a modern web application. If you need to explore it automatically then the Ajax Spider may well be more effective than the standard one.

**Evidence:**
```
{
  "detail": "<script type=\"module\" crossorigin src=\"/assets/index-Ksqx9DM4.js\"></script>",
  "url": "https://claude1-f630a.web.app/management",
  "type": "ZAP-10109"
}
```


#### INFO: Modern Web Application

- **CWE:** CWE--1 (Unknown)
- **Tool:** browser-scanner

**Description:**
The application appears to be a modern web application. If you need to explore it automatically then the Ajax Spider may well be more effective than the standard one.

**Evidence:**
```
{
  "detail": "<script type=\"module\" crossorigin src=\"/assets/index-Ksqx9DM4.js\"></script>",
  "url": "https://claude1-f630a.web.app/console",
  "type": "ZAP-10109"
}
```


#### INFO: Modern Web Application

- **CWE:** CWE--1 (Unknown)
- **Tool:** browser-scanner

**Description:**
The application appears to be a modern web application. If you need to explore it automatically then the Ajax Spider may well be more effective than the standard one.

**Evidence:**
```
{
  "detail": "<script type=\"module\" crossorigin src=\"/assets/index-Ksqx9DM4.js\"></script>",
  "url": "https://claude1-f630a.web.app/panel",
  "type": "ZAP-10109"
}
```


#### INFO: Modern Web Application

- **CWE:** CWE--1 (Unknown)
- **Tool:** browser-scanner

**Description:**
The application appears to be a modern web application. If you need to explore it automatically then the Ajax Spider may well be more effective than the standard one.

**Evidence:**
```
{
  "detail": "<script type=\"module\" crossorigin src=\"/assets/index-Ksqx9DM4.js\"></script>",
  "url": "https://claude1-f630a.web.app/backoffice",
  "type": "ZAP-10109"
}
```


#### INFO: Modern Web Application

- **CWE:** CWE--1 (Unknown)
- **Tool:** browser-scanner

**Description:**
The application appears to be a modern web application. If you need to explore it automatically then the Ajax Spider may well be more effective than the standard one.

**Evidence:**
```
{
  "detail": "<script type=\"module\" crossorigin src=\"/assets/index-Ksqx9DM4.js\"></script>",
  "url": "https://claude1-f630a.web.app/backend",
  "type": "ZAP-10109"
}
```


#### INFO: Modern Web Application

- **CWE:** CWE--1 (Unknown)
- **Tool:** browser-scanner

**Description:**
The application appears to be a modern web application. If you need to explore it automatically then the Ajax Spider may well be more effective than the standard one.

**Evidence:**
```
{
  "detail": "<script type=\"module\" crossorigin src=\"/assets/index-Ksqx9DM4.js\"></script>",
  "url": "https://claude1-f630a.web.app/dashboard/admin",
  "type": "ZAP-10109"
}
```


#### INFO: Modern Web Application

- **CWE:** CWE--1 (Unknown)
- **Tool:** browser-scanner

**Description:**
The application appears to be a modern web application. If you need to explore it automatically then the Ajax Spider may well be more effective than the standard one.

**Evidence:**
```
{
  "detail": "<script type=\"module\" crossorigin src=\"/assets/index-Ksqx9DM4.js\"></script>",
  "url": "https://claude1-f630a.web.app/api/admin",
  "type": "ZAP-10109"
}
```


#### INFO: Modern Web Application

- **CWE:** CWE--1 (Unknown)
- **Tool:** browser-scanner

**Description:**
The application appears to be a modern web application. If you need to explore it automatically then the Ajax Spider may well be more effective than the standard one.

**Evidence:**
```
{
  "detail": "<script type=\"module\" crossorigin src=\"/assets/index-Ksqx9DM4.js\"></script>",
  "url": "https://claude1-f630a.web.app/api/users",
  "type": "ZAP-10109"
}
```


#### INFO: Modern Web Application

- **CWE:** CWE--1 (Unknown)
- **Tool:** browser-scanner

**Description:**
The application appears to be a modern web application. If you need to explore it automatically then the Ajax Spider may well be more effective than the standard one.

**Evidence:**
```
{
  "detail": "<script type=\"module\" crossorigin src=\"/assets/index-Ksqx9DM4.js\"></script>",
  "url": "https://claude1-f630a.web.app/.git/config",
  "type": "ZAP-10109"
}
```


#### INFO: Modern Web Application

- **CWE:** CWE--1 (Unknown)
- **Tool:** browser-scanner

**Description:**
The application appears to be a modern web application. If you need to explore it automatically then the Ajax Spider may well be more effective than the standard one.

**Evidence:**
```
{
  "detail": "<script type=\"module\" crossorigin src=\"/assets/index-Ksqx9DM4.js\"></script>",
  "url": "https://claude1-f630a.web.app/.git/HEAD",
  "type": "ZAP-10109"
}
```


#### INFO: Modern Web Application

- **CWE:** CWE--1 (Unknown)
- **Tool:** browser-scanner

**Description:**
The application appears to be a modern web application. If you need to explore it automatically then the Ajax Spider may well be more effective than the standard one.

**Evidence:**
```
{
  "detail": "<script type=\"module\" crossorigin src=\"/assets/index-Ksqx9DM4.js\"></script>",
  "url": "https://claude1-f630a.web.app/.env",
  "type": "ZAP-10109"
}
```


#### INFO: Modern Web Application

- **CWE:** CWE--1 (Unknown)
- **Tool:** browser-scanner

**Description:**
The application appears to be a modern web application. If you need to explore it automatically then the Ajax Spider may well be more effective than the standard one.

**Evidence:**
```
{
  "detail": "<script type=\"module\" crossorigin src=\"/assets/index-Ksqx9DM4.js\"></script>",
  "url": "https://claude1-f630a.web.app/.env.local",
  "type": "ZAP-10109"
}
```


#### INFO: Modern Web Application

- **CWE:** CWE--1 (Unknown)
- **Tool:** browser-scanner

**Description:**
The application appears to be a modern web application. If you need to explore it automatically then the Ajax Spider may well be more effective than the standard one.

**Evidence:**
```
{
  "detail": "<script type=\"module\" crossorigin src=\"/assets/index-Ksqx9DM4.js\"></script>",
  "url": "https://claude1-f630a.web.app/.env.production",
  "type": "ZAP-10109"
}
```


#### INFO: Modern Web Application

- **CWE:** CWE--1 (Unknown)
- **Tool:** browser-scanner

**Description:**
The application appears to be a modern web application. If you need to explore it automatically then the Ajax Spider may well be more effective than the standard one.

**Evidence:**
```
{
  "detail": "<script type=\"module\" crossorigin src=\"/assets/index-Ksqx9DM4.js\"></script>",
  "url": "https://claude1-f630a.web.app/config.json",
  "type": "ZAP-10109"
}
```


#### INFO: Modern Web Application

- **CWE:** CWE--1 (Unknown)
- **Tool:** browser-scanner

**Description:**
The application appears to be a modern web application. If you need to explore it automatically then the Ajax Spider may well be more effective than the standard one.

**Evidence:**
```
{
  "detail": "<script type=\"module\" crossorigin src=\"/assets/index-Ksqx9DM4.js\"></script>",
  "url": "https://claude1-f630a.web.app/config.yaml",
  "type": "ZAP-10109"
}
```


#### INFO: Modern Web Application

- **CWE:** CWE--1 (Unknown)
- **Tool:** browser-scanner

**Description:**
The application appears to be a modern web application. If you need to explore it automatically then the Ajax Spider may well be more effective than the standard one.

**Evidence:**
```
{
  "detail": "<script type=\"module\" crossorigin src=\"/assets/index-Ksqx9DM4.js\"></script>",
  "url": "https://claude1-f630a.web.app/config.yml",
  "type": "ZAP-10109"
}
```


#### INFO: Modern Web Application

- **CWE:** CWE--1 (Unknown)
- **Tool:** browser-scanner

**Description:**
The application appears to be a modern web application. If you need to explore it automatically then the Ajax Spider may well be more effective than the standard one.

**Evidence:**
```
{
  "detail": "<script type=\"module\" crossorigin src=\"/assets/index-Ksqx9DM4.js\"></script>",
  "url": "https://claude1-f630a.web.app/firebase.json",
  "type": "ZAP-10109"
}
```


#### INFO: Modern Web Application

- **CWE:** CWE--1 (Unknown)
- **Tool:** browser-scanner

**Description:**
The application appears to be a modern web application. If you need to explore it automatically then the Ajax Spider may well be more effective than the standard one.

**Evidence:**
```
{
  "detail": "<script type=\"module\" crossorigin src=\"/assets/index-Ksqx9DM4.js\"></script>",
  "url": "https://claude1-f630a.web.app/package.json",
  "type": "ZAP-10109"
}
```


#### INFO: Modern Web Application

- **CWE:** CWE--1 (Unknown)
- **Tool:** browser-scanner

**Description:**
The application appears to be a modern web application. If you need to explore it automatically then the Ajax Spider may well be more effective than the standard one.

**Evidence:**
```
{
  "detail": "<script type=\"module\" crossorigin src=\"/assets/index-Ksqx9DM4.js\"></script>",
  "url": "https://claude1-f630a.web.app/package-lock.json",
  "type": "ZAP-10109"
}
```


#### INFO: Modern Web Application

- **CWE:** CWE--1 (Unknown)
- **Tool:** browser-scanner

**Description:**
The application appears to be a modern web application. If you need to explore it automatically then the Ajax Spider may well be more effective than the standard one.

**Evidence:**
```
{
  "detail": "<script type=\"module\" crossorigin src=\"/assets/index-Ksqx9DM4.js\"></script>",
  "url": "https://claude1-f630a.web.app/composer.json",
  "type": "ZAP-10109"
}
```


#### INFO: Modern Web Application

- **CWE:** CWE--1 (Unknown)
- **Tool:** browser-scanner

**Description:**
The application appears to be a modern web application. If you need to explore it automatically then the Ajax Spider may well be more effective than the standard one.

**Evidence:**
```
{
  "detail": "<script type=\"module\" crossorigin src=\"/assets/index-Ksqx9DM4.js\"></script>",
  "url": "https://claude1-f630a.web.app/composer.lock",
  "type": "ZAP-10109"
}
```


#### INFO: Modern Web Application

- **CWE:** CWE--1 (Unknown)
- **Tool:** browser-scanner

**Description:**
The application appears to be a modern web application. If you need to explore it automatically then the Ajax Spider may well be more effective than the standard one.

**Evidence:**
```
{
  "detail": "<script type=\"module\" crossorigin src=\"/assets/index-Ksqx9DM4.js\"></script>",
  "url": "https://claude1-f630a.web.app/webpack.config.js",
  "type": "ZAP-10109"
}
```


#### INFO: Modern Web Application

- **CWE:** CWE--1 (Unknown)
- **Tool:** browser-scanner

**Description:**
The application appears to be a modern web application. If you need to explore it automatically then the Ajax Spider may well be more effective than the standard one.

**Evidence:**
```
{
  "detail": "<script type=\"module\" crossorigin src=\"/assets/index-Ksqx9DM4.js\"></script>",
  "url": "https://claude1-f630a.web.app/tsconfig.json",
  "type": "ZAP-10109"
}
```


#### INFO: Modern Web Application

- **CWE:** CWE--1 (Unknown)
- **Tool:** browser-scanner

**Description:**
The application appears to be a modern web application. If you need to explore it automatically then the Ajax Spider may well be more effective than the standard one.

**Evidence:**
```
{
  "detail": "<script type=\"module\" crossorigin src=\"/assets/index-Ksqx9DM4.js\"></script>",
  "url": "https://claude1-f630a.web.app/.htaccess",
  "type": "ZAP-10109"
}
```


#### INFO: Modern Web Application

- **CWE:** CWE--1 (Unknown)
- **Tool:** browser-scanner

**Description:**
The application appears to be a modern web application. If you need to explore it automatically then the Ajax Spider may well be more effective than the standard one.

**Evidence:**
```
{
  "detail": "<script type=\"module\" crossorigin src=\"/assets/index-Ksqx9DM4.js\"></script>",
  "url": "https://claude1-f630a.web.app/.htpasswd",
  "type": "ZAP-10109"
}
```


#### INFO: Modern Web Application

- **CWE:** CWE--1 (Unknown)
- **Tool:** browser-scanner

**Description:**
The application appears to be a modern web application. If you need to explore it automatically then the Ajax Spider may well be more effective than the standard one.

**Evidence:**
```
{
  "detail": "<script type=\"module\" crossorigin src=\"/assets/index-Ksqx9DM4.js\"></script>",
  "url": "https://claude1-f630a.web.app/robots.txt",
  "type": "ZAP-10109"
}
```


#### INFO: Modern Web Application

- **CWE:** CWE--1 (Unknown)
- **Tool:** browser-scanner

**Description:**
The application appears to be a modern web application. If you need to explore it automatically then the Ajax Spider may well be more effective than the standard one.

**Evidence:**
```
{
  "detail": "<script type=\"module\" crossorigin src=\"/assets/index-Ksqx9DM4.js\"></script>",
  "url": "https://claude1-f630a.web.app/sitemap.xml",
  "type": "ZAP-10109"
}
```


#### INFO: Modern Web Application

- **CWE:** CWE--1 (Unknown)
- **Tool:** browser-scanner

**Description:**
The application appears to be a modern web application. If you need to explore it automatically then the Ajax Spider may well be more effective than the standard one.

**Evidence:**
```
{
  "detail": "<script type=\"module\" crossorigin src=\"/assets/index-Ksqx9DM4.js\"></script>",
  "url": "https://claude1-f630a.web.app/crossdomain.xml",
  "type": "ZAP-10109"
}
```


#### INFO: Modern Web Application

- **CWE:** CWE--1 (Unknown)
- **Tool:** browser-scanner

**Description:**
The application appears to be a modern web application. If you need to explore it automatically then the Ajax Spider may well be more effective than the standard one.

**Evidence:**
```
{
  "detail": "<script type=\"module\" crossorigin src=\"/assets/index-Ksqx9DM4.js\"></script>",
  "url": "https://claude1-f630a.web.app/clientaccesspolicy.xml",
  "type": "ZAP-10109"
}
```


#### INFO: Modern Web Application

- **CWE:** CWE--1 (Unknown)
- **Tool:** browser-scanner

**Description:**
The application appears to be a modern web application. If you need to explore it automatically then the Ajax Spider may well be more effective than the standard one.

**Evidence:**
```
{
  "detail": "<script type=\"module\" crossorigin src=\"/assets/index-Ksqx9DM4.js\"></script>",
  "url": "https://claude1-f630a.web.app/web.config",
  "type": "ZAP-10109"
}
```


#### INFO: Modern Web Application

- **CWE:** CWE--1 (Unknown)
- **Tool:** browser-scanner

**Description:**
The application appears to be a modern web application. If you need to explore it automatically then the Ajax Spider may well be more effective than the standard one.

**Evidence:**
```
{
  "detail": "<script type=\"module\" crossorigin src=\"/assets/index-Ksqx9DM4.js\"></script>",
  "url": "https://claude1-f630a.web.app/phpinfo.php",
  "type": "ZAP-10109"
}
```


#### INFO: Modern Web Application

- **CWE:** CWE--1 (Unknown)
- **Tool:** browser-scanner

**Description:**
The application appears to be a modern web application. If you need to explore it automatically then the Ajax Spider may well be more effective than the standard one.

**Evidence:**
```
{
  "detail": "<script type=\"module\" crossorigin src=\"/assets/index-Ksqx9DM4.js\"></script>",
  "url": "https://claude1-f630a.web.app/info.php",
  "type": "ZAP-10109"
}
```


#### INFO: Modern Web Application

- **CWE:** CWE--1 (Unknown)
- **Tool:** browser-scanner

**Description:**
The application appears to be a modern web application. If you need to explore it automatically then the Ajax Spider may well be more effective than the standard one.

**Evidence:**
```
{
  "detail": "<script type=\"module\" crossorigin src=\"/assets/index-Ksqx9DM4.js\"></script>",
  "url": "https://claude1-f630a.web.app/test.php",
  "type": "ZAP-10109"
}
```


#### INFO: Modern Web Application

- **CWE:** CWE--1 (Unknown)
- **Tool:** browser-scanner

**Description:**
The application appears to be a modern web application. If you need to explore it automatically then the Ajax Spider may well be more effective than the standard one.

**Evidence:**
```
{
  "detail": "<script type=\"module\" crossorigin src=\"/assets/index-Ksqx9DM4.js\"></script>",
  "url": "https://claude1-f630a.web.app/backup.zip",
  "type": "ZAP-10109"
}
```


#### INFO: Modern Web Application

- **CWE:** CWE--1 (Unknown)
- **Tool:** browser-scanner

**Description:**
The application appears to be a modern web application. If you need to explore it automatically then the Ajax Spider may well be more effective than the standard one.

**Evidence:**
```
{
  "detail": "<script type=\"module\" crossorigin src=\"/assets/index-Ksqx9DM4.js\"></script>",
  "url": "https://claude1-f630a.web.app/backup.tar.gz",
  "type": "ZAP-10109"
}
```


#### INFO: Modern Web Application

- **CWE:** CWE--1 (Unknown)
- **Tool:** browser-scanner

**Description:**
The application appears to be a modern web application. If you need to explore it automatically then the Ajax Spider may well be more effective than the standard one.

**Evidence:**
```
{
  "detail": "<script type=\"module\" crossorigin src=\"/assets/index-Ksqx9DM4.js\"></script>",
  "url": "https://claude1-f630a.web.app/backup.sql",
  "type": "ZAP-10109"
}
```


#### INFO: Modern Web Application

- **CWE:** CWE--1 (Unknown)
- **Tool:** browser-scanner

**Description:**
The application appears to be a modern web application. If you need to explore it automatically then the Ajax Spider may well be more effective than the standard one.

**Evidence:**
```
{
  "detail": "<script type=\"module\" crossorigin src=\"/assets/index-Ksqx9DM4.js\"></script>",
  "url": "https://claude1-f630a.web.app/dump.sql",
  "type": "ZAP-10109"
}
```


#### INFO: Modern Web Application

- **CWE:** CWE--1 (Unknown)
- **Tool:** browser-scanner

**Description:**
The application appears to be a modern web application. If you need to explore it automatically then the Ajax Spider may well be more effective than the standard one.

**Evidence:**
```
{
  "detail": "<script type=\"module\" crossorigin src=\"/assets/index-Ksqx9DM4.js\"></script>",
  "url": "https://claude1-f630a.web.app/db.sql",
  "type": "ZAP-10109"
}
```


#### INFO: Modern Web Application

- **CWE:** CWE--1 (Unknown)
- **Tool:** browser-scanner

**Description:**
The application appears to be a modern web application. If you need to explore it automatically then the Ajax Spider may well be more effective than the standard one.

**Evidence:**
```
{
  "detail": "<script type=\"module\" crossorigin src=\"/assets/index-Ksqx9DM4.js\"></script>",
  "url": "https://claude1-f630a.web.app/server-status",
  "type": "ZAP-10109"
}
```


#### INFO: Modern Web Application

- **CWE:** CWE--1 (Unknown)
- **Tool:** browser-scanner

**Description:**
The application appears to be a modern web application. If you need to explore it automatically then the Ajax Spider may well be more effective than the standard one.

**Evidence:**
```
{
  "detail": "<script type=\"module\" crossorigin src=\"/assets/index-Ksqx9DM4.js\"></script>",
  "url": "https://claude1-f630a.web.app/server-info",
  "type": "ZAP-10109"
}
```


#### INFO: Modern Web Application

- **CWE:** CWE--1 (Unknown)
- **Tool:** browser-scanner

**Description:**
The application appears to be a modern web application. If you need to explore it automatically then the Ajax Spider may well be more effective than the standard one.

**Evidence:**
```
{
  "detail": "<script type=\"module\" crossorigin src=\"/assets/index-Ksqx9DM4.js\"></script>",
  "url": "https://claude1-f630a.web.app/.DS_Store",
  "type": "ZAP-10109"
}
```


#### INFO: Modern Web Application

- **CWE:** CWE--1 (Unknown)
- **Tool:** browser-scanner

**Description:**
The application appears to be a modern web application. If you need to explore it automatically then the Ajax Spider may well be more effective than the standard one.

**Evidence:**
```
{
  "detail": "<script type=\"module\" crossorigin src=\"/assets/index-Ksqx9DM4.js\"></script>",
  "url": "https://claude1-f630a.web.app/Thumbs.db",
  "type": "ZAP-10109"
}
```


#### INFO: Modern Web Application

- **CWE:** CWE--1 (Unknown)
- **Tool:** browser-scanner

**Description:**
The application appears to be a modern web application. If you need to explore it automatically then the Ajax Spider may well be more effective than the standard one.

**Evidence:**
```
{
  "detail": "<script type=\"module\" crossorigin src=\"/assets/index-Ksqx9DM4.js\"></script>",
  "url": "https://claude1-f630a.web.app/WEB-INF/web.xml",
  "type": "ZAP-10109"
}
```


#### INFO: Modern Web Application

- **CWE:** CWE--1 (Unknown)
- **Tool:** browser-scanner

**Description:**
The application appears to be a modern web application. If you need to explore it automatically then the Ajax Spider may well be more effective than the standard one.

**Evidence:**
```
{
  "detail": "<script type=\"module\" crossorigin src=\"/assets/index-Ksqx9DM4.js\"></script>",
  "url": "https://claude1-f630a.web.app/META-INF/MANIFEST.MF",
  "type": "ZAP-10109"
}
```


#### INFO: Modern Web Application

- **CWE:** CWE--1 (Unknown)
- **Tool:** browser-scanner

**Description:**
The application appears to be a modern web application. If you need to explore it automatically then the Ajax Spider may well be more effective than the standard one.

**Evidence:**
```
{
  "detail": "<script type=\"module\" crossorigin src=\"/assets/index-Ksqx9DM4.js\"></script>",
  "url": "https://claude1-f630a.web.app/.svn/entries",
  "type": "ZAP-10109"
}
```


#### INFO: Modern Web Application

- **CWE:** CWE--1 (Unknown)
- **Tool:** browser-scanner

**Description:**
The application appears to be a modern web application. If you need to explore it automatically then the Ajax Spider may well be more effective than the standard one.

**Evidence:**
```
{
  "detail": "<script type=\"module\" crossorigin src=\"/assets/index-Ksqx9DM4.js\"></script>",
  "url": "https://claude1-f630a.web.app/.svn/wc.db",
  "type": "ZAP-10109"
}
```


#### INFO: Modern Web Application

- **CWE:** CWE--1 (Unknown)
- **Tool:** browser-scanner

**Description:**
The application appears to be a modern web application. If you need to explore it automatically then the Ajax Spider may well be more effective than the standard one.

**Evidence:**
```
{
  "detail": "<script type=\"module\" crossorigin src=\"/assets/index-Ksqx9DM4.js\"></script>",
  "url": "https://claude1-f630a.web.app/.hg/hgrc",
  "type": "ZAP-10109"
}
```


#### INFO: Modern Web Application

- **CWE:** CWE--1 (Unknown)
- **Tool:** browser-scanner

**Description:**
The application appears to be a modern web application. If you need to explore it automatically then the Ajax Spider may well be more effective than the standard one.

**Evidence:**
```
{
  "detail": "<script type=\"module\" crossorigin src=\"/assets/index-Ksqx9DM4.js\"></script>",
  "url": "https://claude1-f630a.web.app/admin.html",
  "type": "ZAP-10109"
}
```


#### INFO: Modern Web Application

- **CWE:** CWE--1 (Unknown)
- **Tool:** browser-scanner

**Description:**
The application appears to be a modern web application. If you need to explore it automatically then the Ajax Spider may well be more effective than the standard one.

**Evidence:**
```
{
  "detail": "<script type=\"module\" crossorigin src=\"/assets/index-Ksqx9DM4.js\"></script>",
  "url": "https://claude1-f630a.web.app/administrator.html",
  "type": "ZAP-10109"
}
```


#### INFO: Modern Web Application

- **CWE:** CWE--1 (Unknown)
- **Tool:** browser-scanner

**Description:**
The application appears to be a modern web application. If you need to explore it automatically then the Ajax Spider may well be more effective than the standard one.

**Evidence:**
```
{
  "detail": "<script type=\"module\" crossorigin src=\"/assets/index-Ksqx9DM4.js\"></script>",
  "url": "https://claude1-f630a.web.app/login.html",
  "type": "ZAP-10109"
}
```


#### INFO: Modern Web Application

- **CWE:** CWE--1 (Unknown)
- **Tool:** browser-scanner

**Description:**
The application appears to be a modern web application. If you need to explore it automatically then the Ajax Spider may well be more effective than the standard one.

**Evidence:**
```
{
  "detail": "<script type=\"module\" crossorigin src=\"/assets/index-Ksqx9DM4.js\"></script>",
  "url": "https://claude1-f630a.web.app/id_rsa",
  "type": "ZAP-10109"
}
```


#### INFO: Modern Web Application

- **CWE:** CWE--1 (Unknown)
- **Tool:** browser-scanner

**Description:**
The application appears to be a modern web application. If you need to explore it automatically then the Ajax Spider may well be more effective than the standard one.

**Evidence:**
```
{
  "detail": "<script type=\"module\" crossorigin src=\"/assets/index-Ksqx9DM4.js\"></script>",
  "url": "https://claude1-f630a.web.app/id_rsa.pub",
  "type": "ZAP-10109"
}
```


#### INFO: Modern Web Application

- **CWE:** CWE--1 (Unknown)
- **Tool:** browser-scanner

**Description:**
The application appears to be a modern web application. If you need to explore it automatically then the Ajax Spider may well be more effective than the standard one.

**Evidence:**
```
{
  "detail": "<script type=\"module\" crossorigin src=\"/assets/index-Ksqx9DM4.js\"></script>",
  "url": "https://claude1-f630a.web.app/.ssh/authorized_keys",
  "type": "ZAP-10109"
}
```


#### INFO: Modern Web Application

- **CWE:** CWE--1 (Unknown)
- **Tool:** browser-scanner

**Description:**
The application appears to be a modern web application. If you need to explore it automatically then the Ajax Spider may well be more effective than the standard one.

**Evidence:**
```
{
  "detail": "<script type=\"module\" crossorigin src=\"/assets/index-Ksqx9DM4.js\"></script>",
  "url": "https://claude1-f630a.web.app/credentials.json",
  "type": "ZAP-10109"
}
```


#### INFO: Modern Web Application

- **CWE:** CWE--1 (Unknown)
- **Tool:** browser-scanner

**Description:**
The application appears to be a modern web application. If you need to explore it automatically then the Ajax Spider may well be more effective than the standard one.

**Evidence:**
```
{
  "detail": "<script type=\"module\" crossorigin src=\"/assets/index-Ksqx9DM4.js\"></script>",
  "url": "https://claude1-f630a.web.app/secrets.json",
  "type": "ZAP-10109"
}
```


#### INFO: Modern Web Application

- **CWE:** CWE--1 (Unknown)
- **Tool:** browser-scanner

**Description:**
The application appears to be a modern web application. If you need to explore it automatically then the Ajax Spider may well be more effective than the standard one.

**Evidence:**
```
{
  "detail": "<script type=\"module\" crossorigin src=\"/assets/index-Ksqx9DM4.js\"></script>",
  "url": "https://claude1-f630a.web.app/keys.json",
  "type": "ZAP-10109"
}
```


#### INFO: Modern Web Application

- **CWE:** CWE--1 (Unknown)
- **Tool:** browser-scanner

**Description:**
The application appears to be a modern web application. If you need to explore it automatically then the Ajax Spider may well be more effective than the standard one.

**Evidence:**
```
{
  "detail": "<script type=\"module\" crossorigin src=\"/assets/index-Ksqx9DM4.js\"></script>",
  "url": "https://claude1-f630a.web.app/api-docs",
  "type": "ZAP-10109"
}
```


#### INFO: Modern Web Application

- **CWE:** CWE--1 (Unknown)
- **Tool:** browser-scanner

**Description:**
The application appears to be a modern web application. If you need to explore it automatically then the Ajax Spider may well be more effective than the standard one.

**Evidence:**
```
{
  "detail": "<script type=\"module\" crossorigin src=\"/assets/index-Ksqx9DM4.js\"></script>",
  "url": "https://claude1-f630a.web.app/swagger",
  "type": "ZAP-10109"
}
```


#### INFO: Modern Web Application

- **CWE:** CWE--1 (Unknown)
- **Tool:** browser-scanner

**Description:**
The application appears to be a modern web application. If you need to explore it automatically then the Ajax Spider may well be more effective than the standard one.

**Evidence:**
```
{
  "detail": "<script type=\"module\" crossorigin src=\"/assets/index-Ksqx9DM4.js\"></script>",
  "url": "https://claude1-f630a.web.app/swagger-ui",
  "type": "ZAP-10109"
}
```


#### INFO: Modern Web Application

- **CWE:** CWE--1 (Unknown)
- **Tool:** browser-scanner

**Description:**
The application appears to be a modern web application. If you need to explore it automatically then the Ajax Spider may well be more effective than the standard one.

**Evidence:**
```
{
  "detail": "<script type=\"module\" crossorigin src=\"/assets/index-Ksqx9DM4.js\"></script>",
  "url": "https://claude1-f630a.web.app/swagger-ui.html",
  "type": "ZAP-10109"
}
```


#### INFO: Modern Web Application

- **CWE:** CWE--1 (Unknown)
- **Tool:** browser-scanner

**Description:**
The application appears to be a modern web application. If you need to explore it automatically then the Ajax Spider may well be more effective than the standard one.

**Evidence:**
```
{
  "detail": "<script type=\"module\" crossorigin src=\"/assets/index-Ksqx9DM4.js\"></script>",
  "url": "https://claude1-f630a.web.app/swagger.json",
  "type": "ZAP-10109"
}
```


#### INFO: Modern Web Application

- **CWE:** CWE--1 (Unknown)
- **Tool:** browser-scanner

**Description:**
The application appears to be a modern web application. If you need to explore it automatically then the Ajax Spider may well be more effective than the standard one.

**Evidence:**
```
{
  "detail": "<script type=\"module\" crossorigin src=\"/assets/index-Ksqx9DM4.js\"></script>",
  "url": "https://claude1-f630a.web.app/swagger.yaml",
  "type": "ZAP-10109"
}
```


#### INFO: Modern Web Application

- **CWE:** CWE--1 (Unknown)
- **Tool:** browser-scanner

**Description:**
The application appears to be a modern web application. If you need to explore it automatically then the Ajax Spider may well be more effective than the standard one.

**Evidence:**
```
{
  "detail": "<script type=\"module\" crossorigin src=\"/assets/index-Ksqx9DM4.js\"></script>",
  "url": "https://claude1-f630a.web.app/openapi",
  "type": "ZAP-10109"
}
```


#### INFO: Modern Web Application

- **CWE:** CWE--1 (Unknown)
- **Tool:** browser-scanner

**Description:**
The application appears to be a modern web application. If you need to explore it automatically then the Ajax Spider may well be more effective than the standard one.

**Evidence:**
```
{
  "detail": "<script type=\"module\" crossorigin src=\"/assets/index-Ksqx9DM4.js\"></script>",
  "url": "https://claude1-f630a.web.app/openapi.json",
  "type": "ZAP-10109"
}
```


#### INFO: Modern Web Application

- **CWE:** CWE--1 (Unknown)
- **Tool:** browser-scanner

**Description:**
The application appears to be a modern web application. If you need to explore it automatically then the Ajax Spider may well be more effective than the standard one.

**Evidence:**
```
{
  "detail": "<script type=\"module\" crossorigin src=\"/assets/index-Ksqx9DM4.js\"></script>",
  "url": "https://claude1-f630a.web.app/openapi.yaml",
  "type": "ZAP-10109"
}
```


#### INFO: Modern Web Application

- **CWE:** CWE--1 (Unknown)
- **Tool:** browser-scanner

**Description:**
The application appears to be a modern web application. If you need to explore it automatically then the Ajax Spider may well be more effective than the standard one.

**Evidence:**
```
{
  "detail": "<script type=\"module\" crossorigin src=\"/assets/index-Ksqx9DM4.js\"></script>",
  "url": "https://claude1-f630a.web.app/api/docs",
  "type": "ZAP-10109"
}
```


#### INFO: Modern Web Application

- **CWE:** CWE--1 (Unknown)
- **Tool:** browser-scanner

**Description:**
The application appears to be a modern web application. If you need to explore it automatically then the Ajax Spider may well be more effective than the standard one.

**Evidence:**
```
{
  "detail": "<script type=\"module\" crossorigin src=\"/assets/index-Ksqx9DM4.js\"></script>",
  "url": "https://claude1-f630a.web.app/api/swagger",
  "type": "ZAP-10109"
}
```


#### INFO: Modern Web Application

- **CWE:** CWE--1 (Unknown)
- **Tool:** browser-scanner

**Description:**
The application appears to be a modern web application. If you need to explore it automatically then the Ajax Spider may well be more effective than the standard one.

**Evidence:**
```
{
  "detail": "<script type=\"module\" crossorigin src=\"/assets/index-Ksqx9DM4.js\"></script>",
  "url": "https://claude1-f630a.web.app/v1/api-docs",
  "type": "ZAP-10109"
}
```


#### INFO: Modern Web Application

- **CWE:** CWE--1 (Unknown)
- **Tool:** browser-scanner

**Description:**
The application appears to be a modern web application. If you need to explore it automatically then the Ajax Spider may well be more effective than the standard one.

**Evidence:**
```
{
  "detail": "<script type=\"module\" crossorigin src=\"/assets/index-Ksqx9DM4.js\"></script>",
  "url": "https://claude1-f630a.web.app/v2/api-docs",
  "type": "ZAP-10109"
}
```


#### INFO: Modern Web Application

- **CWE:** CWE--1 (Unknown)
- **Tool:** browser-scanner

**Description:**
The application appears to be a modern web application. If you need to explore it automatically then the Ajax Spider may well be more effective than the standard one.

**Evidence:**
```
{
  "detail": "<script type=\"module\" crossorigin src=\"/assets/index-Ksqx9DM4.js\"></script>",
  "url": "https://claude1-f630a.web.app/v3/api-docs",
  "type": "ZAP-10109"
}
```


#### INFO: Modern Web Application

- **CWE:** CWE--1 (Unknown)
- **Tool:** browser-scanner

**Description:**
The application appears to be a modern web application. If you need to explore it automatically then the Ajax Spider may well be more effective than the standard one.

**Evidence:**
```
{
  "detail": "<script type=\"module\" crossorigin src=\"/assets/index-Ksqx9DM4.js\"></script>",
  "url": "https://claude1-f630a.web.app/graphql",
  "type": "ZAP-10109"
}
```


#### INFO: Modern Web Application

- **CWE:** CWE--1 (Unknown)
- **Tool:** browser-scanner

**Description:**
The application appears to be a modern web application. If you need to explore it automatically then the Ajax Spider may well be more effective than the standard one.

**Evidence:**
```
{
  "detail": "<script type=\"module\" crossorigin src=\"/assets/index-Ksqx9DM4.js\"></script>",
  "url": "https://claude1-f630a.web.app/graphiql",
  "type": "ZAP-10109"
}
```


#### INFO: Modern Web Application

- **CWE:** CWE--1 (Unknown)
- **Tool:** browser-scanner

**Description:**
The application appears to be a modern web application. If you need to explore it automatically then the Ajax Spider may well be more effective than the standard one.

**Evidence:**
```
{
  "detail": "<script type=\"module\" crossorigin src=\"/assets/index-Ksqx9DM4.js\"></script>",
  "url": "https://claude1-f630a.web.app/?wsdl",
  "type": "ZAP-10109"
}
```


#### INFO: Modern Web Application

- **CWE:** CWE--1 (Unknown)
- **Tool:** browser-scanner

**Description:**
The application appears to be a modern web application. If you need to explore it automatically then the Ajax Spider may well be more effective than the standard one.

**Evidence:**
```
{
  "detail": "<script type=\"module\" crossorigin src=\"/assets/index-Ksqx9DM4.js\"></script>",
  "url": "https://claude1-f630a.web.app/service?wsdl",
  "type": "ZAP-10109"
}
```


#### INFO: Modern Web Application

- **CWE:** CWE--1 (Unknown)
- **Tool:** browser-scanner

**Description:**
The application appears to be a modern web application. If you need to explore it automatically then the Ajax Spider may well be more effective than the standard one.

**Evidence:**
```
{
  "detail": "<script type=\"module\" crossorigin src=\"/assets/index-Ksqx9DM4.js\"></script>",
  "url": "https://claude1-f630a.web.app/api?wsdl",
  "type": "ZAP-10109"
}
```


#### INFO: Modern Web Application

- **CWE:** CWE--1 (Unknown)
- **Tool:** browser-scanner

**Description:**
The application appears to be a modern web application. If you need to explore it automatically then the Ajax Spider may well be more effective than the standard one.

**Evidence:**
```
{
  "detail": "<script type=\"module\" crossorigin src=\"/assets/index-Ksqx9DM4.js\"></script>",
  "url": "https://claude1-f630a.web.app/ws?wsdl",
  "type": "ZAP-10109"
}
```


#### INFO: Modern Web Application

- **CWE:** CWE--1 (Unknown)
- **Tool:** browser-scanner

**Description:**
The application appears to be a modern web application. If you need to explore it automatically then the Ajax Spider may well be more effective than the standard one.

**Evidence:**
```
{
  "detail": "<script type=\"module\" crossorigin src=\"/assets/index-Ksqx9DM4.js\"></script>",
  "url": "https://claude1-f630a.web.app/redoc",
  "type": "ZAP-10109"
}
```


#### INFO: Modern Web Application

- **CWE:** CWE--1 (Unknown)
- **Tool:** browser-scanner

**Description:**
The application appears to be a modern web application. If you need to explore it automatically then the Ajax Spider may well be more effective than the standard one.

**Evidence:**
```
{
  "detail": "<script type=\"module\" crossorigin src=\"/assets/index-Ksqx9DM4.js\"></script>",
  "url": "https://claude1-f630a.web.app/api-explorer",
  "type": "ZAP-10109"
}
```


#### INFO: Modern Web Application

- **CWE:** CWE--1 (Unknown)
- **Tool:** browser-scanner

**Description:**
The application appears to be a modern web application. If you need to explore it automatically then the Ajax Spider may well be more effective than the standard one.

**Evidence:**
```
{
  "detail": "<script type=\"module\" crossorigin src=\"/assets/index-Ksqx9DM4.js\"></script>",
  "url": "https://claude1-f630a.web.app/developer",
  "type": "ZAP-10109"
}
```


#### INFO: Modern Web Application

- **CWE:** CWE--1 (Unknown)
- **Tool:** browser-scanner

**Description:**
The application appears to be a modern web application. If you need to explore it automatically then the Ajax Spider may well be more effective than the standard one.

**Evidence:**
```
{
  "detail": "<script type=\"module\" crossorigin src=\"/assets/index-Ksqx9DM4.js\"></script>",
  "url": "https://claude1-f630a.web.app/developers",
  "type": "ZAP-10109"
}
```


#### INFO: Modern Web Application

- **CWE:** CWE--1 (Unknown)
- **Tool:** browser-scanner

**Description:**
The application appears to be a modern web application. If you need to explore it automatically then the Ajax Spider may well be more effective than the standard one.

**Evidence:**
```
{
  "detail": "<script type=\"module\" crossorigin src=\"/assets/index-Ksqx9DM4.js\"></script>",
  "url": "https://claude1-f630a.web.app/?url=http%3A%2F%2F127.0.0.1%3A22",
  "type": "ZAP-10109"
}
```


#### INFO: Modern Web Application

- **CWE:** CWE--1 (Unknown)
- **Tool:** browser-scanner

**Description:**
The application appears to be a modern web application. If you need to explore it automatically then the Ajax Spider may well be more effective than the standard one.

**Evidence:**
```
{
  "detail": "<script type=\"module\" crossorigin src=\"/assets/index-Ksqx9DM4.js\"></script>",
  "url": "https://claude1-f630a.web.app/?url=http%3A%2F%2F169.254.169.254%2Flatest%2Fmeta-data%2F",
  "type": "ZAP-10109"
}
```


#### INFO: Modern Web Application

- **CWE:** CWE--1 (Unknown)
- **Tool:** browser-scanner

**Description:**
The application appears to be a modern web application. If you need to explore it automatically then the Ajax Spider may well be more effective than the standard one.

**Evidence:**
```
{
  "detail": "<script type=\"module\" crossorigin src=\"/assets/index-Ksqx9DM4.js\"></script>",
  "url": "https://claude1-f630a.web.app/?uri=http%3A%2F%2F127.0.0.1%3A22",
  "type": "ZAP-10109"
}
```


#### INFO: Modern Web Application

- **CWE:** CWE--1 (Unknown)
- **Tool:** browser-scanner

**Description:**
The application appears to be a modern web application. If you need to explore it automatically then the Ajax Spider may well be more effective than the standard one.

**Evidence:**
```
{
  "detail": "<script type=\"module\" crossorigin src=\"/assets/index-Ksqx9DM4.js\"></script>",
  "url": "https://claude1-f630a.web.app/?uri=http%3A%2F%2F169.254.169.254%2Flatest%2Fmeta-data%2F",
  "type": "ZAP-10109"
}
```


#### INFO: Modern Web Application

- **CWE:** CWE--1 (Unknown)
- **Tool:** browser-scanner

**Description:**
The application appears to be a modern web application. If you need to explore it automatically then the Ajax Spider may well be more effective than the standard one.

**Evidence:**
```
{
  "detail": "<script type=\"module\" crossorigin src=\"/assets/index-Ksqx9DM4.js\"></script>",
  "url": "https://claude1-f630a.web.app/?path=http%3A%2F%2F127.0.0.1%3A22",
  "type": "ZAP-10109"
}
```


#### INFO: Modern Web Application

- **CWE:** CWE--1 (Unknown)
- **Tool:** browser-scanner

**Description:**
The application appears to be a modern web application. If you need to explore it automatically then the Ajax Spider may well be more effective than the standard one.

**Evidence:**
```
{
  "detail": "<script type=\"module\" crossorigin src=\"/assets/index-Ksqx9DM4.js\"></script>",
  "url": "https://claude1-f630a.web.app/?path=http%3A%2F%2F169.254.169.254%2Flatest%2Fmeta-data%2F",
  "type": "ZAP-10109"
}
```


#### INFO: Modern Web Application

- **CWE:** CWE--1 (Unknown)
- **Tool:** browser-scanner

**Description:**
The application appears to be a modern web application. If you need to explore it automatically then the Ajax Spider may well be more effective than the standard one.

**Evidence:**
```
{
  "detail": "<script type=\"module\" crossorigin src=\"/assets/index-Ksqx9DM4.js\"></script>",
  "url": "https://claude1-f630a.web.app/?src=http%3A%2F%2F127.0.0.1%3A22",
  "type": "ZAP-10109"
}
```


#### INFO: Modern Web Application

- **CWE:** CWE--1 (Unknown)
- **Tool:** browser-scanner

**Description:**
The application appears to be a modern web application. If you need to explore it automatically then the Ajax Spider may well be more effective than the standard one.

**Evidence:**
```
{
  "detail": "<script type=\"module\" crossorigin src=\"/assets/index-Ksqx9DM4.js\"></script>",
  "url": "https://claude1-f630a.web.app/?src=http%3A%2F%2F169.254.169.254%2Flatest%2Fmeta-data%2F",
  "type": "ZAP-10109"
}
```


#### INFO: Modern Web Application

- **CWE:** CWE--1 (Unknown)
- **Tool:** browser-scanner

**Description:**
The application appears to be a modern web application. If you need to explore it automatically then the Ajax Spider may well be more effective than the standard one.

**Evidence:**
```
{
  "detail": "<script type=\"module\" crossorigin src=\"/assets/index-Ksqx9DM4.js\"></script>",
  "url": "https://claude1-f630a.web.app/?source=http%3A%2F%2F127.0.0.1%3A22",
  "type": "ZAP-10109"
}
```


#### INFO: Modern Web Application

- **CWE:** CWE--1 (Unknown)
- **Tool:** browser-scanner

**Description:**
The application appears to be a modern web application. If you need to explore it automatically then the Ajax Spider may well be more effective than the standard one.

**Evidence:**
```
{
  "detail": "<script type=\"module\" crossorigin src=\"/assets/index-Ksqx9DM4.js\"></script>",
  "url": "https://claude1-f630a.web.app/?source=http%3A%2F%2F169.254.169.254%2Flatest%2Fmeta-data%2F",
  "type": "ZAP-10109"
}
```


#### INFO: Modern Web Application

- **CWE:** CWE--1 (Unknown)
- **Tool:** browser-scanner

**Description:**
The application appears to be a modern web application. If you need to explore it automatically then the Ajax Spider may well be more effective than the standard one.

**Evidence:**
```
{
  "detail": "<script type=\"module\" crossorigin src=\"/assets/index-Ksqx9DM4.js\"></script>",
  "url": "https://claude1-f630a.web.app/?link=http%3A%2F%2F127.0.0.1%3A22",
  "type": "ZAP-10109"
}
```


#### INFO: Modern Web Application

- **CWE:** CWE--1 (Unknown)
- **Tool:** browser-scanner

**Description:**
The application appears to be a modern web application. If you need to explore it automatically then the Ajax Spider may well be more effective than the standard one.

**Evidence:**
```
{
  "detail": "<script type=\"module\" crossorigin src=\"/assets/index-Ksqx9DM4.js\"></script>",
  "url": "https://claude1-f630a.web.app/?link=http%3A%2F%2F169.254.169.254%2Flatest%2Fmeta-data%2F",
  "type": "ZAP-10109"
}
```


#### INFO: Re-examine Cache-control Directives

- **CWE:** CWE-525 (Unknown)
- **Tool:** browser-scanner

**Description:**
The content was retrieved from a shared cache. If the response data is sensitive, personal or user-specific, this may result in sensitive information being leaked. In some cases, this may even result in a user gaining complete control of the session of another user, depending on the configuration of the caching components in use in their environment. This is primarily an issue where caching servers such as "proxy" caches are configured on the local network. This configuration is typically found in corporate or educational environments, for instance.

**Evidence:**
```
{
  "url": "https://claude1-f630a.web.app/login"
}
```


#### INFO: Re-examine Cache-control Directives

- **CWE:** CWE-525 (Unknown)
- **Tool:** browser-scanner

**Description:**
The content was retrieved from a shared cache. If the response data is sensitive, personal or user-specific, this may result in sensitive information being leaked. In some cases, this may even result in a user gaining complete control of the session of another user, depending on the configuration of the caching components in use in their environment. This is primarily an issue where caching servers such as "proxy" caches are configured on the local network. This configuration is typically found in corporate or educational environments, for instance.

**Evidence:**
```
{
  "url": "https://claude1-f630a.web.app/"
}
```


#### INFO: Re-examine Cache-control Directives

- **CWE:** CWE-525 (Unknown)
- **Tool:** browser-scanner

**Description:**
The content was retrieved from a shared cache. If the response data is sensitive, personal or user-specific, this may result in sensitive information being leaked. In some cases, this may even result in a user gaining complete control of the session of another user, depending on the configuration of the caching components in use in their environment. This is primarily an issue where caching servers such as "proxy" caches are configured on the local network. This configuration is typically found in corporate or educational environments, for instance.

**Evidence:**
```
{
  "url": "https://claude1-f630a.web.app/profile"
}
```


#### INFO: Re-examine Cache-control Directives

- **CWE:** CWE-525 (Unknown)
- **Tool:** browser-scanner

**Description:**
The content was retrieved from a shared cache. If the response data is sensitive, personal or user-specific, this may result in sensitive information being leaked. In some cases, this may even result in a user gaining complete control of the session of another user, depending on the configuration of the caching components in use in their environment. This is primarily an issue where caching servers such as "proxy" caches are configured on the local network. This configuration is typically found in corporate or educational environments, for instance.

**Evidence:**
```
{
  "url": "https://claude1-f630a.web.app/settings"
}
```


#### INFO: Re-examine Cache-control Directives

- **CWE:** CWE-525 (Unknown)
- **Tool:** browser-scanner

**Description:**
The content was retrieved from a shared cache. If the response data is sensitive, personal or user-specific, this may result in sensitive information being leaked. In some cases, this may even result in a user gaining complete control of the session of another user, depending on the configuration of the caching components in use in their environment. This is primarily an issue where caching servers such as "proxy" caches are configured on the local network. This configuration is typically found in corporate or educational environments, for instance.

**Evidence:**
```
{
  "url": "https://claude1-f630a.web.app/posts"
}
```


#### INFO: Re-examine Cache-control Directives

- **CWE:** CWE-525 (Unknown)
- **Tool:** browser-scanner

**Description:**
The content was retrieved from a shared cache. If the response data is sensitive, personal or user-specific, this may result in sensitive information being leaked. In some cases, this may even result in a user gaining complete control of the session of another user, depending on the configuration of the caching components in use in their environment. This is primarily an issue where caching servers such as "proxy" caches are configured on the local network. This configuration is typically found in corporate or educational environments, for instance.

**Evidence:**
```
{
  "url": "https://claude1-f630a.web.app/messages"
}
```


#### INFO: Re-examine Cache-control Directives

- **CWE:** CWE-525 (Unknown)
- **Tool:** browser-scanner

**Description:**
The content was retrieved from a shared cache. If the response data is sensitive, personal or user-specific, this may result in sensitive information being leaked. In some cases, this may even result in a user gaining complete control of the session of another user, depending on the configuration of the caching components in use in their environment. This is primarily an issue where caching servers such as "proxy" caches are configured on the local network. This configuration is typically found in corporate or educational environments, for instance.

**Evidence:**
```
{
  "url": "https://claude1-f630a.web.app/feed"
}
```


#### INFO: Re-examine Cache-control Directives

- **CWE:** CWE-525 (Unknown)
- **Tool:** browser-scanner

**Description:**
The cache-control header has not been set properly or is missing, allowing the browser and proxies to cache content. For static assets like css, js, or image files this might be intended, however, the resources should be reviewed to ensure that no sensitive content will be cached.

**Evidence:**
```
{
  "detail": "max-age=3600",
  "url": "https://claude1-f630a.web.app/__nonexistent__1765814154834_60a0fe5bc75a5",
  "type": "ZAP-10015"
}
```


#### INFO: Re-examine Cache-control Directives

- **CWE:** CWE-525 (Unknown)
- **Tool:** browser-scanner

**Description:**
The content was retrieved from a shared cache. If the response data is sensitive, personal or user-specific, this may result in sensitive information being leaked. In some cases, this may even result in a user gaining complete control of the session of another user, depending on the configuration of the caching components in use in their environment. This is primarily an issue where caching servers such as "proxy" caches are configured on the local network. This configuration is typically found in corporate or educational environments, for instance.

**Evidence:**
```
{
  "url": "https://claude1-f630a.web.app/?file=..%2F..%2F..%2Fetc%2Fpasswd"
}
```


#### INFO: Re-examine Cache-control Directives

- **CWE:** CWE-525 (Unknown)
- **Tool:** browser-scanner

**Description:**
The content was retrieved from a shared cache. If the response data is sensitive, personal or user-specific, this may result in sensitive information being leaked. In some cases, this may even result in a user gaining complete control of the session of another user, depending on the configuration of the caching components in use in their environment. This is primarily an issue where caching servers such as "proxy" caches are configured on the local network. This configuration is typically found in corporate or educational environments, for instance.

**Evidence:**
```
{
  "url": "https://claude1-f630a.web.app/?file=..%5C..%5C..%5Cwindows%5Cwin.ini"
}
```


#### INFO: Re-examine Cache-control Directives

- **CWE:** CWE-525 (Unknown)
- **Tool:** browser-scanner

**Description:**
The content was retrieved from a shared cache. If the response data is sensitive, personal or user-specific, this may result in sensitive information being leaked. In some cases, this may even result in a user gaining complete control of the session of another user, depending on the configuration of the caching components in use in their environment. This is primarily an issue where caching servers such as "proxy" caches are configured on the local network. This configuration is typically found in corporate or educational environments, for instance.

**Evidence:**
```
{
  "url": "https://claude1-f630a.web.app/?file=....%2F%2F....%2F%2F....%2F%2Fetc%2Fpasswd"
}
```


#### INFO: Re-examine Cache-control Directives

- **CWE:** CWE-525 (Unknown)
- **Tool:** browser-scanner

**Description:**
The content was retrieved from a shared cache. If the response data is sensitive, personal or user-specific, this may result in sensitive information being leaked. In some cases, this may even result in a user gaining complete control of the session of another user, depending on the configuration of the caching components in use in their environment. This is primarily an issue where caching servers such as "proxy" caches are configured on the local network. This configuration is typically found in corporate or educational environments, for instance.

**Evidence:**
```
{
  "url": "https://claude1-f630a.web.app/?file=..%252f..%252f..%252fetc%2Fpasswd"
}
```


#### INFO: Re-examine Cache-control Directives

- **CWE:** CWE-525 (Unknown)
- **Tool:** browser-scanner

**Description:**
The content was retrieved from a shared cache. If the response data is sensitive, personal or user-specific, this may result in sensitive information being leaked. In some cases, this may even result in a user gaining complete control of the session of another user, depending on the configuration of the caching components in use in their environment. This is primarily an issue where caching servers such as "proxy" caches are configured on the local network. This configuration is typically found in corporate or educational environments, for instance.

**Evidence:**
```
{
  "url": "https://claude1-f630a.web.app/?path=..%2F..%2F..%2Fetc%2Fpasswd"
}
```


#### INFO: Re-examine Cache-control Directives

- **CWE:** CWE-525 (Unknown)
- **Tool:** browser-scanner

**Description:**
The content was retrieved from a shared cache. If the response data is sensitive, personal or user-specific, this may result in sensitive information being leaked. In some cases, this may even result in a user gaining complete control of the session of another user, depending on the configuration of the caching components in use in their environment. This is primarily an issue where caching servers such as "proxy" caches are configured on the local network. This configuration is typically found in corporate or educational environments, for instance.

**Evidence:**
```
{
  "url": "https://claude1-f630a.web.app/?path=..%5C..%5C..%5Cwindows%5Cwin.ini"
}
```


#### INFO: Re-examine Cache-control Directives

- **CWE:** CWE-525 (Unknown)
- **Tool:** browser-scanner

**Description:**
The content was retrieved from a shared cache. If the response data is sensitive, personal or user-specific, this may result in sensitive information being leaked. In some cases, this may even result in a user gaining complete control of the session of another user, depending on the configuration of the caching components in use in their environment. This is primarily an issue where caching servers such as "proxy" caches are configured on the local network. This configuration is typically found in corporate or educational environments, for instance.

**Evidence:**
```
{
  "url": "https://claude1-f630a.web.app/?path=....%2F%2F....%2F%2F....%2F%2Fetc%2Fpasswd"
}
```


#### INFO: Re-examine Cache-control Directives

- **CWE:** CWE-525 (Unknown)
- **Tool:** browser-scanner

**Description:**
The content was retrieved from a shared cache. If the response data is sensitive, personal or user-specific, this may result in sensitive information being leaked. In some cases, this may even result in a user gaining complete control of the session of another user, depending on the configuration of the caching components in use in their environment. This is primarily an issue where caching servers such as "proxy" caches are configured on the local network. This configuration is typically found in corporate or educational environments, for instance.

**Evidence:**
```
{
  "url": "https://claude1-f630a.web.app/?path=..%252f..%252f..%252fetc%2Fpasswd"
}
```


#### INFO: Re-examine Cache-control Directives

- **CWE:** CWE-525 (Unknown)
- **Tool:** browser-scanner

**Description:**
The content was retrieved from a shared cache. If the response data is sensitive, personal or user-specific, this may result in sensitive information being leaked. In some cases, this may even result in a user gaining complete control of the session of another user, depending on the configuration of the caching components in use in their environment. This is primarily an issue where caching servers such as "proxy" caches are configured on the local network. This configuration is typically found in corporate or educational environments, for instance.

**Evidence:**
```
{
  "url": "https://claude1-f630a.web.app/?filepath=..%2F..%2F..%2Fetc%2Fpasswd"
}
```


#### INFO: Re-examine Cache-control Directives

- **CWE:** CWE-525 (Unknown)
- **Tool:** browser-scanner

**Description:**
The content was retrieved from a shared cache. If the response data is sensitive, personal or user-specific, this may result in sensitive information being leaked. In some cases, this may even result in a user gaining complete control of the session of another user, depending on the configuration of the caching components in use in their environment. This is primarily an issue where caching servers such as "proxy" caches are configured on the local network. This configuration is typically found in corporate or educational environments, for instance.

**Evidence:**
```
{
  "url": "https://claude1-f630a.web.app/?filepath=..%5C..%5C..%5Cwindows%5Cwin.ini"
}
```


#### INFO: Re-examine Cache-control Directives

- **CWE:** CWE-525 (Unknown)
- **Tool:** browser-scanner

**Description:**
The content was retrieved from a shared cache. If the response data is sensitive, personal or user-specific, this may result in sensitive information being leaked. In some cases, this may even result in a user gaining complete control of the session of another user, depending on the configuration of the caching components in use in their environment. This is primarily an issue where caching servers such as "proxy" caches are configured on the local network. This configuration is typically found in corporate or educational environments, for instance.

**Evidence:**
```
{
  "url": "https://claude1-f630a.web.app/?filepath=....%2F%2F....%2F%2F....%2F%2Fetc%2Fpasswd"
}
```


#### INFO: Re-examine Cache-control Directives

- **CWE:** CWE-525 (Unknown)
- **Tool:** browser-scanner

**Description:**
The content was retrieved from a shared cache. If the response data is sensitive, personal or user-specific, this may result in sensitive information being leaked. In some cases, this may even result in a user gaining complete control of the session of another user, depending on the configuration of the caching components in use in their environment. This is primarily an issue where caching servers such as "proxy" caches are configured on the local network. This configuration is typically found in corporate or educational environments, for instance.

**Evidence:**
```
{
  "url": "https://claude1-f630a.web.app/?filepath=..%252f..%252f..%252fetc%2Fpasswd"
}
```


#### INFO: Re-examine Cache-control Directives

- **CWE:** CWE-525 (Unknown)
- **Tool:** browser-scanner

**Description:**
The content was retrieved from a shared cache. If the response data is sensitive, personal or user-specific, this may result in sensitive information being leaked. In some cases, this may even result in a user gaining complete control of the session of another user, depending on the configuration of the caching components in use in their environment. This is primarily an issue where caching servers such as "proxy" caches are configured on the local network. This configuration is typically found in corporate or educational environments, for instance.

**Evidence:**
```
{
  "url": "https://claude1-f630a.web.app/?document=..%2F..%2F..%2Fetc%2Fpasswd"
}
```


#### INFO: Re-examine Cache-control Directives

- **CWE:** CWE-525 (Unknown)
- **Tool:** browser-scanner

**Description:**
The content was retrieved from a shared cache. If the response data is sensitive, personal or user-specific, this may result in sensitive information being leaked. In some cases, this may even result in a user gaining complete control of the session of another user, depending on the configuration of the caching components in use in their environment. This is primarily an issue where caching servers such as "proxy" caches are configured on the local network. This configuration is typically found in corporate or educational environments, for instance.

**Evidence:**
```
{
  "url": "https://claude1-f630a.web.app/?document=..%5C..%5C..%5Cwindows%5Cwin.ini"
}
```


#### INFO: Re-examine Cache-control Directives

- **CWE:** CWE-525 (Unknown)
- **Tool:** browser-scanner

**Description:**
The content was retrieved from a shared cache. If the response data is sensitive, personal or user-specific, this may result in sensitive information being leaked. In some cases, this may even result in a user gaining complete control of the session of another user, depending on the configuration of the caching components in use in their environment. This is primarily an issue where caching servers such as "proxy" caches are configured on the local network. This configuration is typically found in corporate or educational environments, for instance.

**Evidence:**
```
{
  "url": "https://claude1-f630a.web.app/?document=....%2F%2F....%2F%2F....%2F%2Fetc%2Fpasswd"
}
```


#### INFO: Re-examine Cache-control Directives

- **CWE:** CWE-525 (Unknown)
- **Tool:** browser-scanner

**Description:**
The content was retrieved from a shared cache. If the response data is sensitive, personal or user-specific, this may result in sensitive information being leaked. In some cases, this may even result in a user gaining complete control of the session of another user, depending on the configuration of the caching components in use in their environment. This is primarily an issue where caching servers such as "proxy" caches are configured on the local network. This configuration is typically found in corporate or educational environments, for instance.

**Evidence:**
```
{
  "url": "https://claude1-f630a.web.app/?document=..%252f..%252f..%252fetc%2Fpasswd"
}
```


#### INFO: Re-examine Cache-control Directives

- **CWE:** CWE-525 (Unknown)
- **Tool:** browser-scanner

**Description:**
The content was retrieved from a shared cache. If the response data is sensitive, personal or user-specific, this may result in sensitive information being leaked. In some cases, this may even result in a user gaining complete control of the session of another user, depending on the configuration of the caching components in use in their environment. This is primarily an issue where caching servers such as "proxy" caches are configured on the local network. This configuration is typically found in corporate or educational environments, for instance.

**Evidence:**
```
{
  "url": "https://claude1-f630a.web.app/?doc=..%2F..%2F..%2Fetc%2Fpasswd"
}
```


#### INFO: Re-examine Cache-control Directives

- **CWE:** CWE-525 (Unknown)
- **Tool:** browser-scanner

**Description:**
The content was retrieved from a shared cache. If the response data is sensitive, personal or user-specific, this may result in sensitive information being leaked. In some cases, this may even result in a user gaining complete control of the session of another user, depending on the configuration of the caching components in use in their environment. This is primarily an issue where caching servers such as "proxy" caches are configured on the local network. This configuration is typically found in corporate or educational environments, for instance.

**Evidence:**
```
{
  "url": "https://claude1-f630a.web.app/?doc=..%5C..%5C..%5Cwindows%5Cwin.ini"
}
```


#### INFO: Re-examine Cache-control Directives

- **CWE:** CWE-525 (Unknown)
- **Tool:** browser-scanner

**Description:**
The content was retrieved from a shared cache. If the response data is sensitive, personal or user-specific, this may result in sensitive information being leaked. In some cases, this may even result in a user gaining complete control of the session of another user, depending on the configuration of the caching components in use in their environment. This is primarily an issue where caching servers such as "proxy" caches are configured on the local network. This configuration is typically found in corporate or educational environments, for instance.

**Evidence:**
```
{
  "url": "https://claude1-f630a.web.app/?doc=....%2F%2F....%2F%2F....%2F%2Fetc%2Fpasswd"
}
```


#### INFO: Re-examine Cache-control Directives

- **CWE:** CWE-525 (Unknown)
- **Tool:** browser-scanner

**Description:**
The content was retrieved from a shared cache. If the response data is sensitive, personal or user-specific, this may result in sensitive information being leaked. In some cases, this may even result in a user gaining complete control of the session of another user, depending on the configuration of the caching components in use in their environment. This is primarily an issue where caching servers such as "proxy" caches are configured on the local network. This configuration is typically found in corporate or educational environments, for instance.

**Evidence:**
```
{
  "url": "https://claude1-f630a.web.app/?doc=..%252f..%252f..%252fetc%2Fpasswd"
}
```


#### INFO: Re-examine Cache-control Directives

- **CWE:** CWE-525 (Unknown)
- **Tool:** browser-scanner

**Description:**
The content was retrieved from a shared cache. If the response data is sensitive, personal or user-specific, this may result in sensitive information being leaked. In some cases, this may even result in a user gaining complete control of the session of another user, depending on the configuration of the caching components in use in their environment. This is primarily an issue where caching servers such as "proxy" caches are configured on the local network. This configuration is typically found in corporate or educational environments, for instance.

**Evidence:**
```
{
  "url": "https://claude1-f630a.web.app/?page=..%2F..%2F..%2Fetc%2Fpasswd"
}
```


#### INFO: Re-examine Cache-control Directives

- **CWE:** CWE-525 (Unknown)
- **Tool:** browser-scanner

**Description:**
The content was retrieved from a shared cache. If the response data is sensitive, personal or user-specific, this may result in sensitive information being leaked. In some cases, this may even result in a user gaining complete control of the session of another user, depending on the configuration of the caching components in use in their environment. This is primarily an issue where caching servers such as "proxy" caches are configured on the local network. This configuration is typically found in corporate or educational environments, for instance.

**Evidence:**
```
{
  "url": "https://claude1-f630a.web.app/?page=..%5C..%5C..%5Cwindows%5Cwin.ini"
}
```


#### INFO: Re-examine Cache-control Directives

- **CWE:** CWE-525 (Unknown)
- **Tool:** browser-scanner

**Description:**
The content was retrieved from a shared cache. If the response data is sensitive, personal or user-specific, this may result in sensitive information being leaked. In some cases, this may even result in a user gaining complete control of the session of another user, depending on the configuration of the caching components in use in their environment. This is primarily an issue where caching servers such as "proxy" caches are configured on the local network. This configuration is typically found in corporate or educational environments, for instance.

**Evidence:**
```
{
  "url": "https://claude1-f630a.web.app/?page=....%2F%2F....%2F%2F....%2F%2Fetc%2Fpasswd"
}
```


#### INFO: Re-examine Cache-control Directives

- **CWE:** CWE-525 (Unknown)
- **Tool:** browser-scanner

**Description:**
The content was retrieved from a shared cache. If the response data is sensitive, personal or user-specific, this may result in sensitive information being leaked. In some cases, this may even result in a user gaining complete control of the session of another user, depending on the configuration of the caching components in use in their environment. This is primarily an issue where caching servers such as "proxy" caches are configured on the local network. This configuration is typically found in corporate or educational environments, for instance.

**Evidence:**
```
{
  "url": "https://claude1-f630a.web.app/?page=..%252f..%252f..%252fetc%2Fpasswd"
}
```


#### INFO: Re-examine Cache-control Directives

- **CWE:** CWE-525 (Unknown)
- **Tool:** browser-scanner

**Description:**
The content was retrieved from a shared cache. If the response data is sensitive, personal or user-specific, this may result in sensitive information being leaked. In some cases, this may even result in a user gaining complete control of the session of another user, depending on the configuration of the caching components in use in their environment. This is primarily an issue where caching servers such as "proxy" caches are configured on the local network. This configuration is typically found in corporate or educational environments, for instance.

**Evidence:**
```
{
  "url": "https://claude1-f630a.web.app/?template=..%2F..%2F..%2Fetc%2Fpasswd"
}
```


#### INFO: Re-examine Cache-control Directives

- **CWE:** CWE-525 (Unknown)
- **Tool:** browser-scanner

**Description:**
The content was retrieved from a shared cache. If the response data is sensitive, personal or user-specific, this may result in sensitive information being leaked. In some cases, this may even result in a user gaining complete control of the session of another user, depending on the configuration of the caching components in use in their environment. This is primarily an issue where caching servers such as "proxy" caches are configured on the local network. This configuration is typically found in corporate or educational environments, for instance.

**Evidence:**
```
{
  "url": "https://claude1-f630a.web.app/?template=..%5C..%5C..%5Cwindows%5Cwin.ini"
}
```


#### INFO: Re-examine Cache-control Directives

- **CWE:** CWE-525 (Unknown)
- **Tool:** browser-scanner

**Description:**
The content was retrieved from a shared cache. If the response data is sensitive, personal or user-specific, this may result in sensitive information being leaked. In some cases, this may even result in a user gaining complete control of the session of another user, depending on the configuration of the caching components in use in their environment. This is primarily an issue where caching servers such as "proxy" caches are configured on the local network. This configuration is typically found in corporate or educational environments, for instance.

**Evidence:**
```
{
  "url": "https://claude1-f630a.web.app/?template=....%2F%2F....%2F%2F....%2F%2Fetc%2Fpasswd"
}
```


#### INFO: Re-examine Cache-control Directives

- **CWE:** CWE-525 (Unknown)
- **Tool:** browser-scanner

**Description:**
The content was retrieved from a shared cache. If the response data is sensitive, personal or user-specific, this may result in sensitive information being leaked. In some cases, this may even result in a user gaining complete control of the session of another user, depending on the configuration of the caching components in use in their environment. This is primarily an issue where caching servers such as "proxy" caches are configured on the local network. This configuration is typically found in corporate or educational environments, for instance.

**Evidence:**
```
{
  "url": "https://claude1-f630a.web.app/?template=..%252f..%252f..%252fetc%2Fpasswd"
}
```


#### INFO: Re-examine Cache-control Directives

- **CWE:** CWE-525 (Unknown)
- **Tool:** browser-scanner

**Description:**
The content was retrieved from a shared cache. If the response data is sensitive, personal or user-specific, this may result in sensitive information being leaked. In some cases, this may even result in a user gaining complete control of the session of another user, depending on the configuration of the caching components in use in their environment. This is primarily an issue where caching servers such as "proxy" caches are configured on the local network. This configuration is typically found in corporate or educational environments, for instance.

**Evidence:**
```
{
  "url": "https://claude1-f630a.web.app/?include=..%2F..%2F..%2Fetc%2Fpasswd"
}
```


#### INFO: Re-examine Cache-control Directives

- **CWE:** CWE-525 (Unknown)
- **Tool:** browser-scanner

**Description:**
The content was retrieved from a shared cache. If the response data is sensitive, personal or user-specific, this may result in sensitive information being leaked. In some cases, this may even result in a user gaining complete control of the session of another user, depending on the configuration of the caching components in use in their environment. This is primarily an issue where caching servers such as "proxy" caches are configured on the local network. This configuration is typically found in corporate or educational environments, for instance.

**Evidence:**
```
{
  "url": "https://claude1-f630a.web.app/?include=..%5C..%5C..%5Cwindows%5Cwin.ini"
}
```


#### INFO: Re-examine Cache-control Directives

- **CWE:** CWE-525 (Unknown)
- **Tool:** browser-scanner

**Description:**
The content was retrieved from a shared cache. If the response data is sensitive, personal or user-specific, this may result in sensitive information being leaked. In some cases, this may even result in a user gaining complete control of the session of another user, depending on the configuration of the caching components in use in their environment. This is primarily an issue where caching servers such as "proxy" caches are configured on the local network. This configuration is typically found in corporate or educational environments, for instance.

**Evidence:**
```
{
  "url": "https://claude1-f630a.web.app/?include=....%2F%2F....%2F%2F....%2F%2Fetc%2Fpasswd"
}
```


#### INFO: Re-examine Cache-control Directives

- **CWE:** CWE-525 (Unknown)
- **Tool:** browser-scanner

**Description:**
The content was retrieved from a shared cache. If the response data is sensitive, personal or user-specific, this may result in sensitive information being leaked. In some cases, this may even result in a user gaining complete control of the session of another user, depending on the configuration of the caching components in use in their environment. This is primarily an issue where caching servers such as "proxy" caches are configured on the local network. This configuration is typically found in corporate or educational environments, for instance.

**Evidence:**
```
{
  "url": "https://claude1-f630a.web.app/?include=..%252f..%252f..%252fetc%2Fpasswd"
}
```


#### INFO: Re-examine Cache-control Directives

- **CWE:** CWE-525 (Unknown)
- **Tool:** browser-scanner

**Description:**
The content was retrieved from a shared cache. If the response data is sensitive, personal or user-specific, this may result in sensitive information being leaked. In some cases, this may even result in a user gaining complete control of the session of another user, depending on the configuration of the caching components in use in their environment. This is primarily an issue where caching servers such as "proxy" caches are configured on the local network. This configuration is typically found in corporate or educational environments, for instance.

**Evidence:**
```
{
  "url": "https://claude1-f630a.web.app/?dir=..%2F..%2F..%2Fetc%2Fpasswd"
}
```


#### INFO: Re-examine Cache-control Directives

- **CWE:** CWE-525 (Unknown)
- **Tool:** browser-scanner

**Description:**
The content was retrieved from a shared cache. If the response data is sensitive, personal or user-specific, this may result in sensitive information being leaked. In some cases, this may even result in a user gaining complete control of the session of another user, depending on the configuration of the caching components in use in their environment. This is primarily an issue where caching servers such as "proxy" caches are configured on the local network. This configuration is typically found in corporate or educational environments, for instance.

**Evidence:**
```
{
  "url": "https://claude1-f630a.web.app/?dir=..%5C..%5C..%5Cwindows%5Cwin.ini"
}
```


#### INFO: Re-examine Cache-control Directives

- **CWE:** CWE-525 (Unknown)
- **Tool:** browser-scanner

**Description:**
The content was retrieved from a shared cache. If the response data is sensitive, personal or user-specific, this may result in sensitive information being leaked. In some cases, this may even result in a user gaining complete control of the session of another user, depending on the configuration of the caching components in use in their environment. This is primarily an issue where caching servers such as "proxy" caches are configured on the local network. This configuration is typically found in corporate or educational environments, for instance.

**Evidence:**
```
{
  "url": "https://claude1-f630a.web.app/?dir=....%2F%2F....%2F%2F....%2F%2Fetc%2Fpasswd"
}
```


#### INFO: Re-examine Cache-control Directives

- **CWE:** CWE-525 (Unknown)
- **Tool:** browser-scanner

**Description:**
The content was retrieved from a shared cache. If the response data is sensitive, personal or user-specific, this may result in sensitive information being leaked. In some cases, this may even result in a user gaining complete control of the session of another user, depending on the configuration of the caching components in use in their environment. This is primarily an issue where caching servers such as "proxy" caches are configured on the local network. This configuration is typically found in corporate or educational environments, for instance.

**Evidence:**
```
{
  "url": "https://claude1-f630a.web.app/?dir=..%252f..%252f..%252fetc%2Fpasswd"
}
```


#### INFO: Re-examine Cache-control Directives

- **CWE:** CWE-525 (Unknown)
- **Tool:** browser-scanner

**Description:**
The content was retrieved from a shared cache. If the response data is sensitive, personal or user-specific, this may result in sensitive information being leaked. In some cases, this may even result in a user gaining complete control of the session of another user, depending on the configuration of the caching components in use in their environment. This is primarily an issue where caching servers such as "proxy" caches are configured on the local network. This configuration is typically found in corporate or educational environments, for instance.

**Evidence:**
```
{
  "url": "https://claude1-f630a.web.app/?folder=..%2F..%2F..%2Fetc%2Fpasswd"
}
```


#### INFO: Re-examine Cache-control Directives

- **CWE:** CWE-525 (Unknown)
- **Tool:** browser-scanner

**Description:**
The content was retrieved from a shared cache. If the response data is sensitive, personal or user-specific, this may result in sensitive information being leaked. In some cases, this may even result in a user gaining complete control of the session of another user, depending on the configuration of the caching components in use in their environment. This is primarily an issue where caching servers such as "proxy" caches are configured on the local network. This configuration is typically found in corporate or educational environments, for instance.

**Evidence:**
```
{
  "url": "https://claude1-f630a.web.app/?folder=..%5C..%5C..%5Cwindows%5Cwin.ini"
}
```


#### INFO: Re-examine Cache-control Directives

- **CWE:** CWE-525 (Unknown)
- **Tool:** browser-scanner

**Description:**
The content was retrieved from a shared cache. If the response data is sensitive, personal or user-specific, this may result in sensitive information being leaked. In some cases, this may even result in a user gaining complete control of the session of another user, depending on the configuration of the caching components in use in their environment. This is primarily an issue where caching servers such as "proxy" caches are configured on the local network. This configuration is typically found in corporate or educational environments, for instance.

**Evidence:**
```
{
  "url": "https://claude1-f630a.web.app/?folder=....%2F%2F....%2F%2F....%2F%2Fetc%2Fpasswd"
}
```


#### INFO: Re-examine Cache-control Directives

- **CWE:** CWE-525 (Unknown)
- **Tool:** browser-scanner

**Description:**
The content was retrieved from a shared cache. If the response data is sensitive, personal or user-specific, this may result in sensitive information being leaked. In some cases, this may even result in a user gaining complete control of the session of another user, depending on the configuration of the caching components in use in their environment. This is primarily an issue where caching servers such as "proxy" caches are configured on the local network. This configuration is typically found in corporate or educational environments, for instance.

**Evidence:**
```
{
  "url": "https://claude1-f630a.web.app/?folder=..%252f..%252f..%252fetc%2Fpasswd"
}
```


#### INFO: Re-examine Cache-control Directives

- **CWE:** CWE-525 (Unknown)
- **Tool:** browser-scanner

**Description:**
The content was retrieved from a shared cache. If the response data is sensitive, personal or user-specific, this may result in sensitive information being leaked. In some cases, this may even result in a user gaining complete control of the session of another user, depending on the configuration of the caching components in use in their environment. This is primarily an issue where caching servers such as "proxy" caches are configured on the local network. This configuration is typically found in corporate or educational environments, for instance.

**Evidence:**
```
{
  "url": "https://claude1-f630a.web.app/?load=..%2F..%2F..%2Fetc%2Fpasswd"
}
```


#### INFO: Re-examine Cache-control Directives

- **CWE:** CWE-525 (Unknown)
- **Tool:** browser-scanner

**Description:**
The content was retrieved from a shared cache. If the response data is sensitive, personal or user-specific, this may result in sensitive information being leaked. In some cases, this may even result in a user gaining complete control of the session of another user, depending on the configuration of the caching components in use in their environment. This is primarily an issue where caching servers such as "proxy" caches are configured on the local network. This configuration is typically found in corporate or educational environments, for instance.

**Evidence:**
```
{
  "url": "https://claude1-f630a.web.app/?load=..%5C..%5C..%5Cwindows%5Cwin.ini"
}
```


#### INFO: Re-examine Cache-control Directives

- **CWE:** CWE-525 (Unknown)
- **Tool:** browser-scanner

**Description:**
The content was retrieved from a shared cache. If the response data is sensitive, personal or user-specific, this may result in sensitive information being leaked. In some cases, this may even result in a user gaining complete control of the session of another user, depending on the configuration of the caching components in use in their environment. This is primarily an issue where caching servers such as "proxy" caches are configured on the local network. This configuration is typically found in corporate or educational environments, for instance.

**Evidence:**
```
{
  "url": "https://claude1-f630a.web.app/?load=....%2F%2F....%2F%2F....%2F%2Fetc%2Fpasswd"
}
```


#### INFO: Re-examine Cache-control Directives

- **CWE:** CWE-525 (Unknown)
- **Tool:** browser-scanner

**Description:**
The content was retrieved from a shared cache. If the response data is sensitive, personal or user-specific, this may result in sensitive information being leaked. In some cases, this may even result in a user gaining complete control of the session of another user, depending on the configuration of the caching components in use in their environment. This is primarily an issue where caching servers such as "proxy" caches are configured on the local network. This configuration is typically found in corporate or educational environments, for instance.

**Evidence:**
```
{
  "url": "https://claude1-f630a.web.app/?load=..%252f..%252f..%252fetc%2Fpasswd"
}
```


#### INFO: Re-examine Cache-control Directives

- **CWE:** CWE-525 (Unknown)
- **Tool:** browser-scanner

**Description:**
The content was retrieved from a shared cache. If the response data is sensitive, personal or user-specific, this may result in sensitive information being leaked. In some cases, this may even result in a user gaining complete control of the session of another user, depending on the configuration of the caching components in use in their environment. This is primarily an issue where caching servers such as "proxy" caches are configured on the local network. This configuration is typically found in corporate or educational environments, for instance.

**Evidence:**
```
{
  "url": "https://claude1-f630a.web.app/?read=..%2F..%2F..%2Fetc%2Fpasswd"
}
```


#### INFO: Re-examine Cache-control Directives

- **CWE:** CWE-525 (Unknown)
- **Tool:** browser-scanner

**Description:**
The content was retrieved from a shared cache. If the response data is sensitive, personal or user-specific, this may result in sensitive information being leaked. In some cases, this may even result in a user gaining complete control of the session of another user, depending on the configuration of the caching components in use in their environment. This is primarily an issue where caching servers such as "proxy" caches are configured on the local network. This configuration is typically found in corporate or educational environments, for instance.

**Evidence:**
```
{
  "url": "https://claude1-f630a.web.app/?read=..%5C..%5C..%5Cwindows%5Cwin.ini"
}
```


#### INFO: Re-examine Cache-control Directives

- **CWE:** CWE-525 (Unknown)
- **Tool:** browser-scanner

**Description:**
The content was retrieved from a shared cache. If the response data is sensitive, personal or user-specific, this may result in sensitive information being leaked. In some cases, this may even result in a user gaining complete control of the session of another user, depending on the configuration of the caching components in use in their environment. This is primarily an issue where caching servers such as "proxy" caches are configured on the local network. This configuration is typically found in corporate or educational environments, for instance.

**Evidence:**
```
{
  "url": "https://claude1-f630a.web.app/?read=....%2F%2F....%2F%2F....%2F%2Fetc%2Fpasswd"
}
```


#### INFO: Re-examine Cache-control Directives

- **CWE:** CWE-525 (Unknown)
- **Tool:** browser-scanner

**Description:**
The content was retrieved from a shared cache. If the response data is sensitive, personal or user-specific, this may result in sensitive information being leaked. In some cases, this may even result in a user gaining complete control of the session of another user, depending on the configuration of the caching components in use in their environment. This is primarily an issue where caching servers such as "proxy" caches are configured on the local network. This configuration is typically found in corporate or educational environments, for instance.

**Evidence:**
```
{
  "url": "https://claude1-f630a.web.app/?read=..%252f..%252f..%252fetc%2Fpasswd"
}
```


#### INFO: Re-examine Cache-control Directives

- **CWE:** CWE-525 (Unknown)
- **Tool:** browser-scanner

**Description:**
The content was retrieved from a shared cache. If the response data is sensitive, personal or user-specific, this may result in sensitive information being leaked. In some cases, this may even result in a user gaining complete control of the session of another user, depending on the configuration of the caching components in use in their environment. This is primarily an issue where caching servers such as "proxy" caches are configured on the local network. This configuration is typically found in corporate or educational environments, for instance.

**Evidence:**
```
{
  "url": "https://claude1-f630a.web.app/images/"
}
```


#### INFO: Re-examine Cache-control Directives

- **CWE:** CWE-525 (Unknown)
- **Tool:** browser-scanner

**Description:**
The content was retrieved from a shared cache. If the response data is sensitive, personal or user-specific, this may result in sensitive information being leaked. In some cases, this may even result in a user gaining complete control of the session of another user, depending on the configuration of the caching components in use in their environment. This is primarily an issue where caching servers such as "proxy" caches are configured on the local network. This configuration is typically found in corporate or educational environments, for instance.

**Evidence:**
```
{
  "url": "https://claude1-f630a.web.app/uploads/"
}
```


#### INFO: Re-examine Cache-control Directives

- **CWE:** CWE-525 (Unknown)
- **Tool:** browser-scanner

**Description:**
The content was retrieved from a shared cache. If the response data is sensitive, personal or user-specific, this may result in sensitive information being leaked. In some cases, this may even result in a user gaining complete control of the session of another user, depending on the configuration of the caching components in use in their environment. This is primarily an issue where caching servers such as "proxy" caches are configured on the local network. This configuration is typically found in corporate or educational environments, for instance.

**Evidence:**
```
{
  "url": "https://claude1-f630a.web.app/files/"
}
```


#### INFO: Re-examine Cache-control Directives

- **CWE:** CWE-525 (Unknown)
- **Tool:** browser-scanner

**Description:**
The content was retrieved from a shared cache. If the response data is sensitive, personal or user-specific, this may result in sensitive information being leaked. In some cases, this may even result in a user gaining complete control of the session of another user, depending on the configuration of the caching components in use in their environment. This is primarily an issue where caching servers such as "proxy" caches are configured on the local network. This configuration is typically found in corporate or educational environments, for instance.

**Evidence:**
```
{
  "url": "https://claude1-f630a.web.app/assets/"
}
```


#### INFO: Re-examine Cache-control Directives

- **CWE:** CWE-525 (Unknown)
- **Tool:** browser-scanner

**Description:**
The content was retrieved from a shared cache. If the response data is sensitive, personal or user-specific, this may result in sensitive information being leaked. In some cases, this may even result in a user gaining complete control of the session of another user, depending on the configuration of the caching components in use in their environment. This is primarily an issue where caching servers such as "proxy" caches are configured on the local network. This configuration is typically found in corporate or educational environments, for instance.

**Evidence:**
```
{
  "url": "https://claude1-f630a.web.app/static/"
}
```


#### INFO: Re-examine Cache-control Directives

- **CWE:** CWE-525 (Unknown)
- **Tool:** browser-scanner

**Description:**
The content was retrieved from a shared cache. If the response data is sensitive, personal or user-specific, this may result in sensitive information being leaked. In some cases, this may even result in a user gaining complete control of the session of another user, depending on the configuration of the caching components in use in their environment. This is primarily an issue where caching servers such as "proxy" caches are configured on the local network. This configuration is typically found in corporate or educational environments, for instance.

**Evidence:**
```
{
  "url": "https://claude1-f630a.web.app/media/"
}
```


#### INFO: Re-examine Cache-control Directives

- **CWE:** CWE-525 (Unknown)
- **Tool:** browser-scanner

**Description:**
The content was retrieved from a shared cache. If the response data is sensitive, personal or user-specific, this may result in sensitive information being leaked. In some cases, this may even result in a user gaining complete control of the session of another user, depending on the configuration of the caching components in use in their environment. This is primarily an issue where caching servers such as "proxy" caches are configured on the local network. This configuration is typically found in corporate or educational environments, for instance.

**Evidence:**
```
{
  "url": "https://claude1-f630a.web.app/backup/"
}
```


#### INFO: Re-examine Cache-control Directives

- **CWE:** CWE-525 (Unknown)
- **Tool:** browser-scanner

**Description:**
The content was retrieved from a shared cache. If the response data is sensitive, personal or user-specific, this may result in sensitive information being leaked. In some cases, this may even result in a user gaining complete control of the session of another user, depending on the configuration of the caching components in use in their environment. This is primarily an issue where caching servers such as "proxy" caches are configured on the local network. This configuration is typically found in corporate or educational environments, for instance.

**Evidence:**
```
{
  "url": "https://claude1-f630a.web.app/logs/"
}
```


#### INFO: Re-examine Cache-control Directives

- **CWE:** CWE-525 (Unknown)
- **Tool:** browser-scanner

**Description:**
The content was retrieved from a shared cache. If the response data is sensitive, personal or user-specific, this may result in sensitive information being leaked. In some cases, this may even result in a user gaining complete control of the session of another user, depending on the configuration of the caching components in use in their environment. This is primarily an issue where caching servers such as "proxy" caches are configured on the local network. This configuration is typically found in corporate or educational environments, for instance.

**Evidence:**
```
{
  "url": "https://claude1-f630a.web.app/tmp/"
}
```


#### INFO: Re-examine Cache-control Directives

- **CWE:** CWE-525 (Unknown)
- **Tool:** browser-scanner

**Description:**
The content was retrieved from a shared cache. If the response data is sensitive, personal or user-specific, this may result in sensitive information being leaked. In some cases, this may even result in a user gaining complete control of the session of another user, depending on the configuration of the caching components in use in their environment. This is primarily an issue where caching servers such as "proxy" caches are configured on the local network. This configuration is typically found in corporate or educational environments, for instance.

**Evidence:**
```
{
  "url": "https://claude1-f630a.web.app/data/"
}
```


#### INFO: Re-examine Cache-control Directives

- **CWE:** CWE-525 (Unknown)
- **Tool:** browser-scanner

**Description:**
The content was retrieved from a shared cache. If the response data is sensitive, personal or user-specific, this may result in sensitive information being leaked. In some cases, this may even result in a user gaining complete control of the session of another user, depending on the configuration of the caching components in use in their environment. This is primarily an issue where caching servers such as "proxy" caches are configured on the local network. This configuration is typically found in corporate or educational environments, for instance.

**Evidence:**
```
{
  "url": "https://claude1-f630a.web.app/admin"
}
```


#### INFO: Re-examine Cache-control Directives

- **CWE:** CWE-525 (Unknown)
- **Tool:** browser-scanner

**Description:**
The content was retrieved from a shared cache. If the response data is sensitive, personal or user-specific, this may result in sensitive information being leaked. In some cases, this may even result in a user gaining complete control of the session of another user, depending on the configuration of the caching components in use in their environment. This is primarily an issue where caching servers such as "proxy" caches are configured on the local network. This configuration is typically found in corporate or educational environments, for instance.

**Evidence:**
```
{
  "url": "https://claude1-f630a.web.app/admin/"
}
```


#### INFO: Re-examine Cache-control Directives

- **CWE:** CWE-525 (Unknown)
- **Tool:** browser-scanner

**Description:**
The content was retrieved from a shared cache. If the response data is sensitive, personal or user-specific, this may result in sensitive information being leaked. In some cases, this may even result in a user gaining complete control of the session of another user, depending on the configuration of the caching components in use in their environment. This is primarily an issue where caching servers such as "proxy" caches are configured on the local network. This configuration is typically found in corporate or educational environments, for instance.

**Evidence:**
```
{
  "url": "https://claude1-f630a.web.app/admin/dashboard"
}
```


#### INFO: Re-examine Cache-control Directives

- **CWE:** CWE-525 (Unknown)
- **Tool:** browser-scanner

**Description:**
The content was retrieved from a shared cache. If the response data is sensitive, personal or user-specific, this may result in sensitive information being leaked. In some cases, this may even result in a user gaining complete control of the session of another user, depending on the configuration of the caching components in use in their environment. This is primarily an issue where caching servers such as "proxy" caches are configured on the local network. This configuration is typically found in corporate or educational environments, for instance.

**Evidence:**
```
{
  "url": "https://claude1-f630a.web.app/admin/users"
}
```


#### INFO: Re-examine Cache-control Directives

- **CWE:** CWE-525 (Unknown)
- **Tool:** browser-scanner

**Description:**
The content was retrieved from a shared cache. If the response data is sensitive, personal or user-specific, this may result in sensitive information being leaked. In some cases, this may even result in a user gaining complete control of the session of another user, depending on the configuration of the caching components in use in their environment. This is primarily an issue where caching servers such as "proxy" caches are configured on the local network. This configuration is typically found in corporate or educational environments, for instance.

**Evidence:**
```
{
  "url": "https://claude1-f630a.web.app/admin/settings"
}
```


#### INFO: Re-examine Cache-control Directives

- **CWE:** CWE-525 (Unknown)
- **Tool:** browser-scanner

**Description:**
The content was retrieved from a shared cache. If the response data is sensitive, personal or user-specific, this may result in sensitive information being leaked. In some cases, this may even result in a user gaining complete control of the session of another user, depending on the configuration of the caching components in use in their environment. This is primarily an issue where caching servers such as "proxy" caches are configured on the local network. This configuration is typically found in corporate or educational environments, for instance.

**Evidence:**
```
{
  "url": "https://claude1-f630a.web.app/administrator"
}
```


#### INFO: Re-examine Cache-control Directives

- **CWE:** CWE-525 (Unknown)
- **Tool:** browser-scanner

**Description:**
The content was retrieved from a shared cache. If the response data is sensitive, personal or user-specific, this may result in sensitive information being leaked. In some cases, this may even result in a user gaining complete control of the session of another user, depending on the configuration of the caching components in use in their environment. This is primarily an issue where caching servers such as "proxy" caches are configured on the local network. This configuration is typically found in corporate or educational environments, for instance.

**Evidence:**
```
{
  "url": "https://claude1-f630a.web.app/manage"
}
```


#### INFO: Re-examine Cache-control Directives

- **CWE:** CWE-525 (Unknown)
- **Tool:** browser-scanner

**Description:**
The content was retrieved from a shared cache. If the response data is sensitive, personal or user-specific, this may result in sensitive information being leaked. In some cases, this may even result in a user gaining complete control of the session of another user, depending on the configuration of the caching components in use in their environment. This is primarily an issue where caching servers such as "proxy" caches are configured on the local network. This configuration is typically found in corporate or educational environments, for instance.

**Evidence:**
```
{
  "url": "https://claude1-f630a.web.app/management"
}
```


#### INFO: Re-examine Cache-control Directives

- **CWE:** CWE-525 (Unknown)
- **Tool:** browser-scanner

**Description:**
The content was retrieved from a shared cache. If the response data is sensitive, personal or user-specific, this may result in sensitive information being leaked. In some cases, this may even result in a user gaining complete control of the session of another user, depending on the configuration of the caching components in use in their environment. This is primarily an issue where caching servers such as "proxy" caches are configured on the local network. This configuration is typically found in corporate or educational environments, for instance.

**Evidence:**
```
{
  "url": "https://claude1-f630a.web.app/console"
}
```


#### INFO: Re-examine Cache-control Directives

- **CWE:** CWE-525 (Unknown)
- **Tool:** browser-scanner

**Description:**
The content was retrieved from a shared cache. If the response data is sensitive, personal or user-specific, this may result in sensitive information being leaked. In some cases, this may even result in a user gaining complete control of the session of another user, depending on the configuration of the caching components in use in their environment. This is primarily an issue where caching servers such as "proxy" caches are configured on the local network. This configuration is typically found in corporate or educational environments, for instance.

**Evidence:**
```
{
  "url": "https://claude1-f630a.web.app/panel"
}
```


#### INFO: Re-examine Cache-control Directives

- **CWE:** CWE-525 (Unknown)
- **Tool:** browser-scanner

**Description:**
The content was retrieved from a shared cache. If the response data is sensitive, personal or user-specific, this may result in sensitive information being leaked. In some cases, this may even result in a user gaining complete control of the session of another user, depending on the configuration of the caching components in use in their environment. This is primarily an issue where caching servers such as "proxy" caches are configured on the local network. This configuration is typically found in corporate or educational environments, for instance.

**Evidence:**
```
{
  "url": "https://claude1-f630a.web.app/backoffice"
}
```


#### INFO: Re-examine Cache-control Directives

- **CWE:** CWE-525 (Unknown)
- **Tool:** browser-scanner

**Description:**
The content was retrieved from a shared cache. If the response data is sensitive, personal or user-specific, this may result in sensitive information being leaked. In some cases, this may even result in a user gaining complete control of the session of another user, depending on the configuration of the caching components in use in their environment. This is primarily an issue where caching servers such as "proxy" caches are configured on the local network. This configuration is typically found in corporate or educational environments, for instance.

**Evidence:**
```
{
  "url": "https://claude1-f630a.web.app/backend"
}
```


#### INFO: Re-examine Cache-control Directives

- **CWE:** CWE-525 (Unknown)
- **Tool:** browser-scanner

**Description:**
The content was retrieved from a shared cache. If the response data is sensitive, personal or user-specific, this may result in sensitive information being leaked. In some cases, this may even result in a user gaining complete control of the session of another user, depending on the configuration of the caching components in use in their environment. This is primarily an issue where caching servers such as "proxy" caches are configured on the local network. This configuration is typically found in corporate or educational environments, for instance.

**Evidence:**
```
{
  "url": "https://claude1-f630a.web.app/dashboard/admin"
}
```


#### INFO: Re-examine Cache-control Directives

- **CWE:** CWE-525 (Unknown)
- **Tool:** browser-scanner

**Description:**
The content was retrieved from a shared cache. If the response data is sensitive, personal or user-specific, this may result in sensitive information being leaked. In some cases, this may even result in a user gaining complete control of the session of another user, depending on the configuration of the caching components in use in their environment. This is primarily an issue where caching servers such as "proxy" caches are configured on the local network. This configuration is typically found in corporate or educational environments, for instance.

**Evidence:**
```
{
  "url": "https://claude1-f630a.web.app/api/admin"
}
```


#### INFO: Re-examine Cache-control Directives

- **CWE:** CWE-525 (Unknown)
- **Tool:** browser-scanner

**Description:**
The content was retrieved from a shared cache. If the response data is sensitive, personal or user-specific, this may result in sensitive information being leaked. In some cases, this may even result in a user gaining complete control of the session of another user, depending on the configuration of the caching components in use in their environment. This is primarily an issue where caching servers such as "proxy" caches are configured on the local network. This configuration is typically found in corporate or educational environments, for instance.

**Evidence:**
```
{
  "url": "https://claude1-f630a.web.app/api/users"
}
```


#### INFO: Re-examine Cache-control Directives

- **CWE:** CWE-525 (Unknown)
- **Tool:** browser-scanner

**Description:**
The content was retrieved from a shared cache. If the response data is sensitive, personal or user-specific, this may result in sensitive information being leaked. In some cases, this may even result in a user gaining complete control of the session of another user, depending on the configuration of the caching components in use in their environment. This is primarily an issue where caching servers such as "proxy" caches are configured on the local network. This configuration is typically found in corporate or educational environments, for instance.

**Evidence:**
```
{
  "url": "https://claude1-f630a.web.app/.git/config"
}
```


#### INFO: Re-examine Cache-control Directives

- **CWE:** CWE-525 (Unknown)
- **Tool:** browser-scanner

**Description:**
The content was retrieved from a shared cache. If the response data is sensitive, personal or user-specific, this may result in sensitive information being leaked. In some cases, this may even result in a user gaining complete control of the session of another user, depending on the configuration of the caching components in use in their environment. This is primarily an issue where caching servers such as "proxy" caches are configured on the local network. This configuration is typically found in corporate or educational environments, for instance.

**Evidence:**
```
{
  "url": "https://claude1-f630a.web.app/.git/HEAD"
}
```


#### INFO: Re-examine Cache-control Directives

- **CWE:** CWE-525 (Unknown)
- **Tool:** browser-scanner

**Description:**
The content was retrieved from a shared cache. If the response data is sensitive, personal or user-specific, this may result in sensitive information being leaked. In some cases, this may even result in a user gaining complete control of the session of another user, depending on the configuration of the caching components in use in their environment. This is primarily an issue where caching servers such as "proxy" caches are configured on the local network. This configuration is typically found in corporate or educational environments, for instance.

**Evidence:**
```
{
  "url": "https://claude1-f630a.web.app/.env"
}
```


#### INFO: Re-examine Cache-control Directives

- **CWE:** CWE-525 (Unknown)
- **Tool:** browser-scanner

**Description:**
The content was retrieved from a shared cache. If the response data is sensitive, personal or user-specific, this may result in sensitive information being leaked. In some cases, this may even result in a user gaining complete control of the session of another user, depending on the configuration of the caching components in use in their environment. This is primarily an issue where caching servers such as "proxy" caches are configured on the local network. This configuration is typically found in corporate or educational environments, for instance.

**Evidence:**
```
{
  "url": "https://claude1-f630a.web.app/.env.local"
}
```


#### INFO: Re-examine Cache-control Directives

- **CWE:** CWE-525 (Unknown)
- **Tool:** browser-scanner

**Description:**
The content was retrieved from a shared cache. If the response data is sensitive, personal or user-specific, this may result in sensitive information being leaked. In some cases, this may even result in a user gaining complete control of the session of another user, depending on the configuration of the caching components in use in their environment. This is primarily an issue where caching servers such as "proxy" caches are configured on the local network. This configuration is typically found in corporate or educational environments, for instance.

**Evidence:**
```
{
  "url": "https://claude1-f630a.web.app/.env.production"
}
```


#### INFO: Re-examine Cache-control Directives

- **CWE:** CWE-525 (Unknown)
- **Tool:** browser-scanner

**Description:**
The content was retrieved from a shared cache. If the response data is sensitive, personal or user-specific, this may result in sensitive information being leaked. In some cases, this may even result in a user gaining complete control of the session of another user, depending on the configuration of the caching components in use in their environment. This is primarily an issue where caching servers such as "proxy" caches are configured on the local network. This configuration is typically found in corporate or educational environments, for instance.

**Evidence:**
```
{
  "url": "https://claude1-f630a.web.app/config.json"
}
```


#### INFO: Re-examine Cache-control Directives

- **CWE:** CWE-525 (Unknown)
- **Tool:** browser-scanner

**Description:**
The content was retrieved from a shared cache. If the response data is sensitive, personal or user-specific, this may result in sensitive information being leaked. In some cases, this may even result in a user gaining complete control of the session of another user, depending on the configuration of the caching components in use in their environment. This is primarily an issue where caching servers such as "proxy" caches are configured on the local network. This configuration is typically found in corporate or educational environments, for instance.

**Evidence:**
```
{
  "url": "https://claude1-f630a.web.app/config.yaml"
}
```


#### INFO: Re-examine Cache-control Directives

- **CWE:** CWE-525 (Unknown)
- **Tool:** browser-scanner

**Description:**
The content was retrieved from a shared cache. If the response data is sensitive, personal or user-specific, this may result in sensitive information being leaked. In some cases, this may even result in a user gaining complete control of the session of another user, depending on the configuration of the caching components in use in their environment. This is primarily an issue where caching servers such as "proxy" caches are configured on the local network. This configuration is typically found in corporate or educational environments, for instance.

**Evidence:**
```
{
  "url": "https://claude1-f630a.web.app/config.yml"
}
```


#### INFO: Re-examine Cache-control Directives

- **CWE:** CWE-525 (Unknown)
- **Tool:** browser-scanner

**Description:**
The content was retrieved from a shared cache. If the response data is sensitive, personal or user-specific, this may result in sensitive information being leaked. In some cases, this may even result in a user gaining complete control of the session of another user, depending on the configuration of the caching components in use in their environment. This is primarily an issue where caching servers such as "proxy" caches are configured on the local network. This configuration is typically found in corporate or educational environments, for instance.

**Evidence:**
```
{
  "url": "https://claude1-f630a.web.app/firebase.json"
}
```


#### INFO: Re-examine Cache-control Directives

- **CWE:** CWE-525 (Unknown)
- **Tool:** browser-scanner

**Description:**
The content was retrieved from a shared cache. If the response data is sensitive, personal or user-specific, this may result in sensitive information being leaked. In some cases, this may even result in a user gaining complete control of the session of another user, depending on the configuration of the caching components in use in their environment. This is primarily an issue where caching servers such as "proxy" caches are configured on the local network. This configuration is typically found in corporate or educational environments, for instance.

**Evidence:**
```
{
  "url": "https://claude1-f630a.web.app/package.json"
}
```


#### INFO: Re-examine Cache-control Directives

- **CWE:** CWE-525 (Unknown)
- **Tool:** browser-scanner

**Description:**
The content was retrieved from a shared cache. If the response data is sensitive, personal or user-specific, this may result in sensitive information being leaked. In some cases, this may even result in a user gaining complete control of the session of another user, depending on the configuration of the caching components in use in their environment. This is primarily an issue where caching servers such as "proxy" caches are configured on the local network. This configuration is typically found in corporate or educational environments, for instance.

**Evidence:**
```
{
  "url": "https://claude1-f630a.web.app/package-lock.json"
}
```


#### INFO: Re-examine Cache-control Directives

- **CWE:** CWE-525 (Unknown)
- **Tool:** browser-scanner

**Description:**
The content was retrieved from a shared cache. If the response data is sensitive, personal or user-specific, this may result in sensitive information being leaked. In some cases, this may even result in a user gaining complete control of the session of another user, depending on the configuration of the caching components in use in their environment. This is primarily an issue where caching servers such as "proxy" caches are configured on the local network. This configuration is typically found in corporate or educational environments, for instance.

**Evidence:**
```
{
  "url": "https://claude1-f630a.web.app/composer.json"
}
```


#### INFO: Re-examine Cache-control Directives

- **CWE:** CWE-525 (Unknown)
- **Tool:** browser-scanner

**Description:**
The content was retrieved from a shared cache. If the response data is sensitive, personal or user-specific, this may result in sensitive information being leaked. In some cases, this may even result in a user gaining complete control of the session of another user, depending on the configuration of the caching components in use in their environment. This is primarily an issue where caching servers such as "proxy" caches are configured on the local network. This configuration is typically found in corporate or educational environments, for instance.

**Evidence:**
```
{
  "url": "https://claude1-f630a.web.app/composer.lock"
}
```


#### INFO: Re-examine Cache-control Directives

- **CWE:** CWE-525 (Unknown)
- **Tool:** browser-scanner

**Description:**
The content was retrieved from a shared cache. If the response data is sensitive, personal or user-specific, this may result in sensitive information being leaked. In some cases, this may even result in a user gaining complete control of the session of another user, depending on the configuration of the caching components in use in their environment. This is primarily an issue where caching servers such as "proxy" caches are configured on the local network. This configuration is typically found in corporate or educational environments, for instance.

**Evidence:**
```
{
  "url": "https://claude1-f630a.web.app/tsconfig.json"
}
```


#### INFO: Re-examine Cache-control Directives

- **CWE:** CWE-525 (Unknown)
- **Tool:** browser-scanner

**Description:**
The content was retrieved from a shared cache. If the response data is sensitive, personal or user-specific, this may result in sensitive information being leaked. In some cases, this may even result in a user gaining complete control of the session of another user, depending on the configuration of the caching components in use in their environment. This is primarily an issue where caching servers such as "proxy" caches are configured on the local network. This configuration is typically found in corporate or educational environments, for instance.

**Evidence:**
```
{
  "url": "https://claude1-f630a.web.app/.htaccess"
}
```


#### INFO: Re-examine Cache-control Directives

- **CWE:** CWE-525 (Unknown)
- **Tool:** browser-scanner

**Description:**
The content was retrieved from a shared cache. If the response data is sensitive, personal or user-specific, this may result in sensitive information being leaked. In some cases, this may even result in a user gaining complete control of the session of another user, depending on the configuration of the caching components in use in their environment. This is primarily an issue where caching servers such as "proxy" caches are configured on the local network. This configuration is typically found in corporate or educational environments, for instance.

**Evidence:**
```
{
  "url": "https://claude1-f630a.web.app/.htpasswd"
}
```


#### INFO: Re-examine Cache-control Directives

- **CWE:** CWE-525 (Unknown)
- **Tool:** browser-scanner

**Description:**
The content was retrieved from a shared cache. If the response data is sensitive, personal or user-specific, this may result in sensitive information being leaked. In some cases, this may even result in a user gaining complete control of the session of another user, depending on the configuration of the caching components in use in their environment. This is primarily an issue where caching servers such as "proxy" caches are configured on the local network. This configuration is typically found in corporate or educational environments, for instance.

**Evidence:**
```
{
  "url": "https://claude1-f630a.web.app/robots.txt"
}
```


#### INFO: Re-examine Cache-control Directives

- **CWE:** CWE-525 (Unknown)
- **Tool:** browser-scanner

**Description:**
The content was retrieved from a shared cache. If the response data is sensitive, personal or user-specific, this may result in sensitive information being leaked. In some cases, this may even result in a user gaining complete control of the session of another user, depending on the configuration of the caching components in use in their environment. This is primarily an issue where caching servers such as "proxy" caches are configured on the local network. This configuration is typically found in corporate or educational environments, for instance.

**Evidence:**
```
{
  "url": "https://claude1-f630a.web.app/sitemap.xml"
}
```


#### INFO: Re-examine Cache-control Directives

- **CWE:** CWE-525 (Unknown)
- **Tool:** browser-scanner

**Description:**
The content was retrieved from a shared cache. If the response data is sensitive, personal or user-specific, this may result in sensitive information being leaked. In some cases, this may even result in a user gaining complete control of the session of another user, depending on the configuration of the caching components in use in their environment. This is primarily an issue where caching servers such as "proxy" caches are configured on the local network. This configuration is typically found in corporate or educational environments, for instance.

**Evidence:**
```
{
  "url": "https://claude1-f630a.web.app/crossdomain.xml"
}
```


#### INFO: Re-examine Cache-control Directives

- **CWE:** CWE-525 (Unknown)
- **Tool:** browser-scanner

**Description:**
The content was retrieved from a shared cache. If the response data is sensitive, personal or user-specific, this may result in sensitive information being leaked. In some cases, this may even result in a user gaining complete control of the session of another user, depending on the configuration of the caching components in use in their environment. This is primarily an issue where caching servers such as "proxy" caches are configured on the local network. This configuration is typically found in corporate or educational environments, for instance.

**Evidence:**
```
{
  "url": "https://claude1-f630a.web.app/clientaccesspolicy.xml"
}
```


#### INFO: Re-examine Cache-control Directives

- **CWE:** CWE-525 (Unknown)
- **Tool:** browser-scanner

**Description:**
The content was retrieved from a shared cache. If the response data is sensitive, personal or user-specific, this may result in sensitive information being leaked. In some cases, this may even result in a user gaining complete control of the session of another user, depending on the configuration of the caching components in use in their environment. This is primarily an issue where caching servers such as "proxy" caches are configured on the local network. This configuration is typically found in corporate or educational environments, for instance.

**Evidence:**
```
{
  "url": "https://claude1-f630a.web.app/web.config"
}
```


#### INFO: Re-examine Cache-control Directives

- **CWE:** CWE-525 (Unknown)
- **Tool:** browser-scanner

**Description:**
The content was retrieved from a shared cache. If the response data is sensitive, personal or user-specific, this may result in sensitive information being leaked. In some cases, this may even result in a user gaining complete control of the session of another user, depending on the configuration of the caching components in use in their environment. This is primarily an issue where caching servers such as "proxy" caches are configured on the local network. This configuration is typically found in corporate or educational environments, for instance.

**Evidence:**
```
{
  "url": "https://claude1-f630a.web.app/phpinfo.php"
}
```


#### INFO: Re-examine Cache-control Directives

- **CWE:** CWE-525 (Unknown)
- **Tool:** browser-scanner

**Description:**
The content was retrieved from a shared cache. If the response data is sensitive, personal or user-specific, this may result in sensitive information being leaked. In some cases, this may even result in a user gaining complete control of the session of another user, depending on the configuration of the caching components in use in their environment. This is primarily an issue where caching servers such as "proxy" caches are configured on the local network. This configuration is typically found in corporate or educational environments, for instance.

**Evidence:**
```
{
  "url": "https://claude1-f630a.web.app/info.php"
}
```


#### INFO: Re-examine Cache-control Directives

- **CWE:** CWE-525 (Unknown)
- **Tool:** browser-scanner

**Description:**
The content was retrieved from a shared cache. If the response data is sensitive, personal or user-specific, this may result in sensitive information being leaked. In some cases, this may even result in a user gaining complete control of the session of another user, depending on the configuration of the caching components in use in their environment. This is primarily an issue where caching servers such as "proxy" caches are configured on the local network. This configuration is typically found in corporate or educational environments, for instance.

**Evidence:**
```
{
  "url": "https://claude1-f630a.web.app/test.php"
}
```


#### INFO: Re-examine Cache-control Directives

- **CWE:** CWE-525 (Unknown)
- **Tool:** browser-scanner

**Description:**
The content was retrieved from a shared cache. If the response data is sensitive, personal or user-specific, this may result in sensitive information being leaked. In some cases, this may even result in a user gaining complete control of the session of another user, depending on the configuration of the caching components in use in their environment. This is primarily an issue where caching servers such as "proxy" caches are configured on the local network. This configuration is typically found in corporate or educational environments, for instance.

**Evidence:**
```
{
  "url": "https://claude1-f630a.web.app/backup.zip"
}
```


#### INFO: Re-examine Cache-control Directives

- **CWE:** CWE-525 (Unknown)
- **Tool:** browser-scanner

**Description:**
The content was retrieved from a shared cache. If the response data is sensitive, personal or user-specific, this may result in sensitive information being leaked. In some cases, this may even result in a user gaining complete control of the session of another user, depending on the configuration of the caching components in use in their environment. This is primarily an issue where caching servers such as "proxy" caches are configured on the local network. This configuration is typically found in corporate or educational environments, for instance.

**Evidence:**
```
{
  "url": "https://claude1-f630a.web.app/backup.tar.gz"
}
```


#### INFO: Re-examine Cache-control Directives

- **CWE:** CWE-525 (Unknown)
- **Tool:** browser-scanner

**Description:**
The content was retrieved from a shared cache. If the response data is sensitive, personal or user-specific, this may result in sensitive information being leaked. In some cases, this may even result in a user gaining complete control of the session of another user, depending on the configuration of the caching components in use in their environment. This is primarily an issue where caching servers such as "proxy" caches are configured on the local network. This configuration is typically found in corporate or educational environments, for instance.

**Evidence:**
```
{
  "url": "https://claude1-f630a.web.app/backup.sql"
}
```


#### INFO: Re-examine Cache-control Directives

- **CWE:** CWE-525 (Unknown)
- **Tool:** browser-scanner

**Description:**
The content was retrieved from a shared cache. If the response data is sensitive, personal or user-specific, this may result in sensitive information being leaked. In some cases, this may even result in a user gaining complete control of the session of another user, depending on the configuration of the caching components in use in their environment. This is primarily an issue where caching servers such as "proxy" caches are configured on the local network. This configuration is typically found in corporate or educational environments, for instance.

**Evidence:**
```
{
  "url": "https://claude1-f630a.web.app/dump.sql"
}
```


#### INFO: Re-examine Cache-control Directives

- **CWE:** CWE-525 (Unknown)
- **Tool:** browser-scanner

**Description:**
The content was retrieved from a shared cache. If the response data is sensitive, personal or user-specific, this may result in sensitive information being leaked. In some cases, this may even result in a user gaining complete control of the session of another user, depending on the configuration of the caching components in use in their environment. This is primarily an issue where caching servers such as "proxy" caches are configured on the local network. This configuration is typically found in corporate or educational environments, for instance.

**Evidence:**
```
{
  "url": "https://claude1-f630a.web.app/db.sql"
}
```


#### INFO: Re-examine Cache-control Directives

- **CWE:** CWE-525 (Unknown)
- **Tool:** browser-scanner

**Description:**
The content was retrieved from a shared cache. If the response data is sensitive, personal or user-specific, this may result in sensitive information being leaked. In some cases, this may even result in a user gaining complete control of the session of another user, depending on the configuration of the caching components in use in their environment. This is primarily an issue where caching servers such as "proxy" caches are configured on the local network. This configuration is typically found in corporate or educational environments, for instance.

**Evidence:**
```
{
  "url": "https://claude1-f630a.web.app/server-status"
}
```


#### INFO: Re-examine Cache-control Directives

- **CWE:** CWE-525 (Unknown)
- **Tool:** browser-scanner

**Description:**
The content was retrieved from a shared cache. If the response data is sensitive, personal or user-specific, this may result in sensitive information being leaked. In some cases, this may even result in a user gaining complete control of the session of another user, depending on the configuration of the caching components in use in their environment. This is primarily an issue where caching servers such as "proxy" caches are configured on the local network. This configuration is typically found in corporate or educational environments, for instance.

**Evidence:**
```
{
  "url": "https://claude1-f630a.web.app/server-info"
}
```


#### INFO: Re-examine Cache-control Directives

- **CWE:** CWE-525 (Unknown)
- **Tool:** browser-scanner

**Description:**
The content was retrieved from a shared cache. If the response data is sensitive, personal or user-specific, this may result in sensitive information being leaked. In some cases, this may even result in a user gaining complete control of the session of another user, depending on the configuration of the caching components in use in their environment. This is primarily an issue where caching servers such as "proxy" caches are configured on the local network. This configuration is typically found in corporate or educational environments, for instance.

**Evidence:**
```
{
  "url": "https://claude1-f630a.web.app/.DS_Store"
}
```


#### INFO: Re-examine Cache-control Directives

- **CWE:** CWE-525 (Unknown)
- **Tool:** browser-scanner

**Description:**
The content was retrieved from a shared cache. If the response data is sensitive, personal or user-specific, this may result in sensitive information being leaked. In some cases, this may even result in a user gaining complete control of the session of another user, depending on the configuration of the caching components in use in their environment. This is primarily an issue where caching servers such as "proxy" caches are configured on the local network. This configuration is typically found in corporate or educational environments, for instance.

**Evidence:**
```
{
  "url": "https://claude1-f630a.web.app/Thumbs.db"
}
```


#### INFO: Re-examine Cache-control Directives

- **CWE:** CWE-525 (Unknown)
- **Tool:** browser-scanner

**Description:**
The content was retrieved from a shared cache. If the response data is sensitive, personal or user-specific, this may result in sensitive information being leaked. In some cases, this may even result in a user gaining complete control of the session of another user, depending on the configuration of the caching components in use in their environment. This is primarily an issue where caching servers such as "proxy" caches are configured on the local network. This configuration is typically found in corporate or educational environments, for instance.

**Evidence:**
```
{
  "url": "https://claude1-f630a.web.app/WEB-INF/web.xml"
}
```


#### INFO: Re-examine Cache-control Directives

- **CWE:** CWE-525 (Unknown)
- **Tool:** browser-scanner

**Description:**
The content was retrieved from a shared cache. If the response data is sensitive, personal or user-specific, this may result in sensitive information being leaked. In some cases, this may even result in a user gaining complete control of the session of another user, depending on the configuration of the caching components in use in their environment. This is primarily an issue where caching servers such as "proxy" caches are configured on the local network. This configuration is typically found in corporate or educational environments, for instance.

**Evidence:**
```
{
  "url": "https://claude1-f630a.web.app/META-INF/MANIFEST.MF"
}
```


#### INFO: Re-examine Cache-control Directives

- **CWE:** CWE-525 (Unknown)
- **Tool:** browser-scanner

**Description:**
The content was retrieved from a shared cache. If the response data is sensitive, personal or user-specific, this may result in sensitive information being leaked. In some cases, this may even result in a user gaining complete control of the session of another user, depending on the configuration of the caching components in use in their environment. This is primarily an issue where caching servers such as "proxy" caches are configured on the local network. This configuration is typically found in corporate or educational environments, for instance.

**Evidence:**
```
{
  "url": "https://claude1-f630a.web.app/.svn/entries"
}
```


#### INFO: Re-examine Cache-control Directives

- **CWE:** CWE-525 (Unknown)
- **Tool:** browser-scanner

**Description:**
The content was retrieved from a shared cache. If the response data is sensitive, personal or user-specific, this may result in sensitive information being leaked. In some cases, this may even result in a user gaining complete control of the session of another user, depending on the configuration of the caching components in use in their environment. This is primarily an issue where caching servers such as "proxy" caches are configured on the local network. This configuration is typically found in corporate or educational environments, for instance.

**Evidence:**
```
{
  "url": "https://claude1-f630a.web.app/.svn/wc.db"
}
```


#### INFO: Re-examine Cache-control Directives

- **CWE:** CWE-525 (Unknown)
- **Tool:** browser-scanner

**Description:**
The content was retrieved from a shared cache. If the response data is sensitive, personal or user-specific, this may result in sensitive information being leaked. In some cases, this may even result in a user gaining complete control of the session of another user, depending on the configuration of the caching components in use in their environment. This is primarily an issue where caching servers such as "proxy" caches are configured on the local network. This configuration is typically found in corporate or educational environments, for instance.

**Evidence:**
```
{
  "url": "https://claude1-f630a.web.app/.hg/hgrc"
}
```


#### INFO: Re-examine Cache-control Directives

- **CWE:** CWE-525 (Unknown)
- **Tool:** browser-scanner

**Description:**
The content was retrieved from a shared cache. If the response data is sensitive, personal or user-specific, this may result in sensitive information being leaked. In some cases, this may even result in a user gaining complete control of the session of another user, depending on the configuration of the caching components in use in their environment. This is primarily an issue where caching servers such as "proxy" caches are configured on the local network. This configuration is typically found in corporate or educational environments, for instance.

**Evidence:**
```
{
  "url": "https://claude1-f630a.web.app/admin.html"
}
```


#### INFO: Re-examine Cache-control Directives

- **CWE:** CWE-525 (Unknown)
- **Tool:** browser-scanner

**Description:**
The content was retrieved from a shared cache. If the response data is sensitive, personal or user-specific, this may result in sensitive information being leaked. In some cases, this may even result in a user gaining complete control of the session of another user, depending on the configuration of the caching components in use in their environment. This is primarily an issue where caching servers such as "proxy" caches are configured on the local network. This configuration is typically found in corporate or educational environments, for instance.

**Evidence:**
```
{
  "url": "https://claude1-f630a.web.app/administrator.html"
}
```


#### INFO: Re-examine Cache-control Directives

- **CWE:** CWE-525 (Unknown)
- **Tool:** browser-scanner

**Description:**
The content was retrieved from a shared cache. If the response data is sensitive, personal or user-specific, this may result in sensitive information being leaked. In some cases, this may even result in a user gaining complete control of the session of another user, depending on the configuration of the caching components in use in their environment. This is primarily an issue where caching servers such as "proxy" caches are configured on the local network. This configuration is typically found in corporate or educational environments, for instance.

**Evidence:**
```
{
  "url": "https://claude1-f630a.web.app/login.html"
}
```


#### INFO: Re-examine Cache-control Directives

- **CWE:** CWE-525 (Unknown)
- **Tool:** browser-scanner

**Description:**
The content was retrieved from a shared cache. If the response data is sensitive, personal or user-specific, this may result in sensitive information being leaked. In some cases, this may even result in a user gaining complete control of the session of another user, depending on the configuration of the caching components in use in their environment. This is primarily an issue where caching servers such as "proxy" caches are configured on the local network. This configuration is typically found in corporate or educational environments, for instance.

**Evidence:**
```
{
  "url": "https://claude1-f630a.web.app/id_rsa"
}
```


#### INFO: Re-examine Cache-control Directives

- **CWE:** CWE-525 (Unknown)
- **Tool:** browser-scanner

**Description:**
The content was retrieved from a shared cache. If the response data is sensitive, personal or user-specific, this may result in sensitive information being leaked. In some cases, this may even result in a user gaining complete control of the session of another user, depending on the configuration of the caching components in use in their environment. This is primarily an issue where caching servers such as "proxy" caches are configured on the local network. This configuration is typically found in corporate or educational environments, for instance.

**Evidence:**
```
{
  "url": "https://claude1-f630a.web.app/id_rsa.pub"
}
```


#### INFO: Re-examine Cache-control Directives

- **CWE:** CWE-525 (Unknown)
- **Tool:** browser-scanner

**Description:**
The content was retrieved from a shared cache. If the response data is sensitive, personal or user-specific, this may result in sensitive information being leaked. In some cases, this may even result in a user gaining complete control of the session of another user, depending on the configuration of the caching components in use in their environment. This is primarily an issue where caching servers such as "proxy" caches are configured on the local network. This configuration is typically found in corporate or educational environments, for instance.

**Evidence:**
```
{
  "url": "https://claude1-f630a.web.app/.ssh/authorized_keys"
}
```


#### INFO: Re-examine Cache-control Directives

- **CWE:** CWE-525 (Unknown)
- **Tool:** browser-scanner

**Description:**
The content was retrieved from a shared cache. If the response data is sensitive, personal or user-specific, this may result in sensitive information being leaked. In some cases, this may even result in a user gaining complete control of the session of another user, depending on the configuration of the caching components in use in their environment. This is primarily an issue where caching servers such as "proxy" caches are configured on the local network. This configuration is typically found in corporate or educational environments, for instance.

**Evidence:**
```
{
  "url": "https://claude1-f630a.web.app/credentials.json"
}
```


#### INFO: Re-examine Cache-control Directives

- **CWE:** CWE-525 (Unknown)
- **Tool:** browser-scanner

**Description:**
The content was retrieved from a shared cache. If the response data is sensitive, personal or user-specific, this may result in sensitive information being leaked. In some cases, this may even result in a user gaining complete control of the session of another user, depending on the configuration of the caching components in use in their environment. This is primarily an issue where caching servers such as "proxy" caches are configured on the local network. This configuration is typically found in corporate or educational environments, for instance.

**Evidence:**
```
{
  "url": "https://claude1-f630a.web.app/secrets.json"
}
```


#### INFO: Re-examine Cache-control Directives

- **CWE:** CWE-525 (Unknown)
- **Tool:** browser-scanner

**Description:**
The content was retrieved from a shared cache. If the response data is sensitive, personal or user-specific, this may result in sensitive information being leaked. In some cases, this may even result in a user gaining complete control of the session of another user, depending on the configuration of the caching components in use in their environment. This is primarily an issue where caching servers such as "proxy" caches are configured on the local network. This configuration is typically found in corporate or educational environments, for instance.

**Evidence:**
```
{
  "url": "https://claude1-f630a.web.app/keys.json"
}
```


#### INFO: Re-examine Cache-control Directives

- **CWE:** CWE-525 (Unknown)
- **Tool:** browser-scanner

**Description:**
The content was retrieved from a shared cache. If the response data is sensitive, personal or user-specific, this may result in sensitive information being leaked. In some cases, this may even result in a user gaining complete control of the session of another user, depending on the configuration of the caching components in use in their environment. This is primarily an issue where caching servers such as "proxy" caches are configured on the local network. This configuration is typically found in corporate or educational environments, for instance.

**Evidence:**
```
{
  "url": "https://claude1-f630a.web.app/api-docs"
}
```


#### INFO: Re-examine Cache-control Directives

- **CWE:** CWE-525 (Unknown)
- **Tool:** browser-scanner

**Description:**
The content was retrieved from a shared cache. If the response data is sensitive, personal or user-specific, this may result in sensitive information being leaked. In some cases, this may even result in a user gaining complete control of the session of another user, depending on the configuration of the caching components in use in their environment. This is primarily an issue where caching servers such as "proxy" caches are configured on the local network. This configuration is typically found in corporate or educational environments, for instance.

**Evidence:**
```
{
  "url": "https://claude1-f630a.web.app/swagger"
}
```


#### INFO: Re-examine Cache-control Directives

- **CWE:** CWE-525 (Unknown)
- **Tool:** browser-scanner

**Description:**
The content was retrieved from a shared cache. If the response data is sensitive, personal or user-specific, this may result in sensitive information being leaked. In some cases, this may even result in a user gaining complete control of the session of another user, depending on the configuration of the caching components in use in their environment. This is primarily an issue where caching servers such as "proxy" caches are configured on the local network. This configuration is typically found in corporate or educational environments, for instance.

**Evidence:**
```
{
  "url": "https://claude1-f630a.web.app/swagger-ui"
}
```


#### INFO: Re-examine Cache-control Directives

- **CWE:** CWE-525 (Unknown)
- **Tool:** browser-scanner

**Description:**
The content was retrieved from a shared cache. If the response data is sensitive, personal or user-specific, this may result in sensitive information being leaked. In some cases, this may even result in a user gaining complete control of the session of another user, depending on the configuration of the caching components in use in their environment. This is primarily an issue where caching servers such as "proxy" caches are configured on the local network. This configuration is typically found in corporate or educational environments, for instance.

**Evidence:**
```
{
  "url": "https://claude1-f630a.web.app/swagger-ui.html"
}
```


#### INFO: Re-examine Cache-control Directives

- **CWE:** CWE-525 (Unknown)
- **Tool:** browser-scanner

**Description:**
The content was retrieved from a shared cache. If the response data is sensitive, personal or user-specific, this may result in sensitive information being leaked. In some cases, this may even result in a user gaining complete control of the session of another user, depending on the configuration of the caching components in use in their environment. This is primarily an issue where caching servers such as "proxy" caches are configured on the local network. This configuration is typically found in corporate or educational environments, for instance.

**Evidence:**
```
{
  "url": "https://claude1-f630a.web.app/swagger.json"
}
```


#### INFO: Re-examine Cache-control Directives

- **CWE:** CWE-525 (Unknown)
- **Tool:** browser-scanner

**Description:**
The content was retrieved from a shared cache. If the response data is sensitive, personal or user-specific, this may result in sensitive information being leaked. In some cases, this may even result in a user gaining complete control of the session of another user, depending on the configuration of the caching components in use in their environment. This is primarily an issue where caching servers such as "proxy" caches are configured on the local network. This configuration is typically found in corporate or educational environments, for instance.

**Evidence:**
```
{
  "url": "https://claude1-f630a.web.app/swagger.yaml"
}
```


#### INFO: Re-examine Cache-control Directives

- **CWE:** CWE-525 (Unknown)
- **Tool:** browser-scanner

**Description:**
The content was retrieved from a shared cache. If the response data is sensitive, personal or user-specific, this may result in sensitive information being leaked. In some cases, this may even result in a user gaining complete control of the session of another user, depending on the configuration of the caching components in use in their environment. This is primarily an issue where caching servers such as "proxy" caches are configured on the local network. This configuration is typically found in corporate or educational environments, for instance.

**Evidence:**
```
{
  "url": "https://claude1-f630a.web.app/openapi"
}
```


#### INFO: Re-examine Cache-control Directives

- **CWE:** CWE-525 (Unknown)
- **Tool:** browser-scanner

**Description:**
The content was retrieved from a shared cache. If the response data is sensitive, personal or user-specific, this may result in sensitive information being leaked. In some cases, this may even result in a user gaining complete control of the session of another user, depending on the configuration of the caching components in use in their environment. This is primarily an issue where caching servers such as "proxy" caches are configured on the local network. This configuration is typically found in corporate or educational environments, for instance.

**Evidence:**
```
{
  "url": "https://claude1-f630a.web.app/openapi.json"
}
```


#### INFO: Re-examine Cache-control Directives

- **CWE:** CWE-525 (Unknown)
- **Tool:** browser-scanner

**Description:**
The content was retrieved from a shared cache. If the response data is sensitive, personal or user-specific, this may result in sensitive information being leaked. In some cases, this may even result in a user gaining complete control of the session of another user, depending on the configuration of the caching components in use in their environment. This is primarily an issue where caching servers such as "proxy" caches are configured on the local network. This configuration is typically found in corporate or educational environments, for instance.

**Evidence:**
```
{
  "url": "https://claude1-f630a.web.app/openapi.yaml"
}
```


#### INFO: Re-examine Cache-control Directives

- **CWE:** CWE-525 (Unknown)
- **Tool:** browser-scanner

**Description:**
The content was retrieved from a shared cache. If the response data is sensitive, personal or user-specific, this may result in sensitive information being leaked. In some cases, this may even result in a user gaining complete control of the session of another user, depending on the configuration of the caching components in use in their environment. This is primarily an issue where caching servers such as "proxy" caches are configured on the local network. This configuration is typically found in corporate or educational environments, for instance.

**Evidence:**
```
{
  "url": "https://claude1-f630a.web.app/api/docs"
}
```


#### INFO: Re-examine Cache-control Directives

- **CWE:** CWE-525 (Unknown)
- **Tool:** browser-scanner

**Description:**
The content was retrieved from a shared cache. If the response data is sensitive, personal or user-specific, this may result in sensitive information being leaked. In some cases, this may even result in a user gaining complete control of the session of another user, depending on the configuration of the caching components in use in their environment. This is primarily an issue where caching servers such as "proxy" caches are configured on the local network. This configuration is typically found in corporate or educational environments, for instance.

**Evidence:**
```
{
  "url": "https://claude1-f630a.web.app/api/swagger"
}
```


#### INFO: Re-examine Cache-control Directives

- **CWE:** CWE-525 (Unknown)
- **Tool:** browser-scanner

**Description:**
The content was retrieved from a shared cache. If the response data is sensitive, personal or user-specific, this may result in sensitive information being leaked. In some cases, this may even result in a user gaining complete control of the session of another user, depending on the configuration of the caching components in use in their environment. This is primarily an issue where caching servers such as "proxy" caches are configured on the local network. This configuration is typically found in corporate or educational environments, for instance.

**Evidence:**
```
{
  "url": "https://claude1-f630a.web.app/v1/api-docs"
}
```


#### INFO: Re-examine Cache-control Directives

- **CWE:** CWE-525 (Unknown)
- **Tool:** browser-scanner

**Description:**
The content was retrieved from a shared cache. If the response data is sensitive, personal or user-specific, this may result in sensitive information being leaked. In some cases, this may even result in a user gaining complete control of the session of another user, depending on the configuration of the caching components in use in their environment. This is primarily an issue where caching servers such as "proxy" caches are configured on the local network. This configuration is typically found in corporate or educational environments, for instance.

**Evidence:**
```
{
  "url": "https://claude1-f630a.web.app/v2/api-docs"
}
```


#### INFO: Re-examine Cache-control Directives

- **CWE:** CWE-525 (Unknown)
- **Tool:** browser-scanner

**Description:**
The content was retrieved from a shared cache. If the response data is sensitive, personal or user-specific, this may result in sensitive information being leaked. In some cases, this may even result in a user gaining complete control of the session of another user, depending on the configuration of the caching components in use in their environment. This is primarily an issue where caching servers such as "proxy" caches are configured on the local network. This configuration is typically found in corporate or educational environments, for instance.

**Evidence:**
```
{
  "url": "https://claude1-f630a.web.app/v3/api-docs"
}
```


#### INFO: Re-examine Cache-control Directives

- **CWE:** CWE-525 (Unknown)
- **Tool:** browser-scanner

**Description:**
The content was retrieved from a shared cache. If the response data is sensitive, personal or user-specific, this may result in sensitive information being leaked. In some cases, this may even result in a user gaining complete control of the session of another user, depending on the configuration of the caching components in use in their environment. This is primarily an issue where caching servers such as "proxy" caches are configured on the local network. This configuration is typically found in corporate or educational environments, for instance.

**Evidence:**
```
{
  "url": "https://claude1-f630a.web.app/graphql"
}
```


#### INFO: Re-examine Cache-control Directives

- **CWE:** CWE-525 (Unknown)
- **Tool:** browser-scanner

**Description:**
The content was retrieved from a shared cache. If the response data is sensitive, personal or user-specific, this may result in sensitive information being leaked. In some cases, this may even result in a user gaining complete control of the session of another user, depending on the configuration of the caching components in use in their environment. This is primarily an issue where caching servers such as "proxy" caches are configured on the local network. This configuration is typically found in corporate or educational environments, for instance.

**Evidence:**
```
{
  "url": "https://claude1-f630a.web.app/graphiql"
}
```


#### INFO: Re-examine Cache-control Directives

- **CWE:** CWE-525 (Unknown)
- **Tool:** browser-scanner

**Description:**
The content was retrieved from a shared cache. If the response data is sensitive, personal or user-specific, this may result in sensitive information being leaked. In some cases, this may even result in a user gaining complete control of the session of another user, depending on the configuration of the caching components in use in their environment. This is primarily an issue where caching servers such as "proxy" caches are configured on the local network. This configuration is typically found in corporate or educational environments, for instance.

**Evidence:**
```
{
  "url": "https://claude1-f630a.web.app/?wsdl"
}
```


#### INFO: Re-examine Cache-control Directives

- **CWE:** CWE-525 (Unknown)
- **Tool:** browser-scanner

**Description:**
The content was retrieved from a shared cache. If the response data is sensitive, personal or user-specific, this may result in sensitive information being leaked. In some cases, this may even result in a user gaining complete control of the session of another user, depending on the configuration of the caching components in use in their environment. This is primarily an issue where caching servers such as "proxy" caches are configured on the local network. This configuration is typically found in corporate or educational environments, for instance.

**Evidence:**
```
{
  "url": "https://claude1-f630a.web.app/service?wsdl"
}
```


#### INFO: Re-examine Cache-control Directives

- **CWE:** CWE-525 (Unknown)
- **Tool:** browser-scanner

**Description:**
The content was retrieved from a shared cache. If the response data is sensitive, personal or user-specific, this may result in sensitive information being leaked. In some cases, this may even result in a user gaining complete control of the session of another user, depending on the configuration of the caching components in use in their environment. This is primarily an issue where caching servers such as "proxy" caches are configured on the local network. This configuration is typically found in corporate or educational environments, for instance.

**Evidence:**
```
{
  "url": "https://claude1-f630a.web.app/api?wsdl"
}
```


#### INFO: Re-examine Cache-control Directives

- **CWE:** CWE-525 (Unknown)
- **Tool:** browser-scanner

**Description:**
The content was retrieved from a shared cache. If the response data is sensitive, personal or user-specific, this may result in sensitive information being leaked. In some cases, this may even result in a user gaining complete control of the session of another user, depending on the configuration of the caching components in use in their environment. This is primarily an issue where caching servers such as "proxy" caches are configured on the local network. This configuration is typically found in corporate or educational environments, for instance.

**Evidence:**
```
{
  "url": "https://claude1-f630a.web.app/ws?wsdl"
}
```


#### INFO: Re-examine Cache-control Directives

- **CWE:** CWE-525 (Unknown)
- **Tool:** browser-scanner

**Description:**
The content was retrieved from a shared cache. If the response data is sensitive, personal or user-specific, this may result in sensitive information being leaked. In some cases, this may even result in a user gaining complete control of the session of another user, depending on the configuration of the caching components in use in their environment. This is primarily an issue where caching servers such as "proxy" caches are configured on the local network. This configuration is typically found in corporate or educational environments, for instance.

**Evidence:**
```
{
  "url": "https://claude1-f630a.web.app/redoc"
}
```


#### INFO: Re-examine Cache-control Directives

- **CWE:** CWE-525 (Unknown)
- **Tool:** browser-scanner

**Description:**
The content was retrieved from a shared cache. If the response data is sensitive, personal or user-specific, this may result in sensitive information being leaked. In some cases, this may even result in a user gaining complete control of the session of another user, depending on the configuration of the caching components in use in their environment. This is primarily an issue where caching servers such as "proxy" caches are configured on the local network. This configuration is typically found in corporate or educational environments, for instance.

**Evidence:**
```
{
  "url": "https://claude1-f630a.web.app/api-explorer"
}
```


#### INFO: Re-examine Cache-control Directives

- **CWE:** CWE-525 (Unknown)
- **Tool:** browser-scanner

**Description:**
The content was retrieved from a shared cache. If the response data is sensitive, personal or user-specific, this may result in sensitive information being leaked. In some cases, this may even result in a user gaining complete control of the session of another user, depending on the configuration of the caching components in use in their environment. This is primarily an issue where caching servers such as "proxy" caches are configured on the local network. This configuration is typically found in corporate or educational environments, for instance.

**Evidence:**
```
{
  "url": "https://claude1-f630a.web.app/developer"
}
```


#### INFO: Re-examine Cache-control Directives

- **CWE:** CWE-525 (Unknown)
- **Tool:** browser-scanner

**Description:**
The content was retrieved from a shared cache. If the response data is sensitive, personal or user-specific, this may result in sensitive information being leaked. In some cases, this may even result in a user gaining complete control of the session of another user, depending on the configuration of the caching components in use in their environment. This is primarily an issue where caching servers such as "proxy" caches are configured on the local network. This configuration is typically found in corporate or educational environments, for instance.

**Evidence:**
```
{
  "url": "https://claude1-f630a.web.app/developers"
}
```


#### INFO: Re-examine Cache-control Directives

- **CWE:** CWE-525 (Unknown)
- **Tool:** browser-scanner

**Description:**
The content was retrieved from a shared cache. If the response data is sensitive, personal or user-specific, this may result in sensitive information being leaked. In some cases, this may even result in a user gaining complete control of the session of another user, depending on the configuration of the caching components in use in their environment. This is primarily an issue where caching servers such as "proxy" caches are configured on the local network. This configuration is typically found in corporate or educational environments, for instance.

**Evidence:**
```
{
  "url": "https://claude1-f630a.web.app/?url=http%3A%2F%2F127.0.0.1%3A22"
}
```


#### INFO: Re-examine Cache-control Directives

- **CWE:** CWE-525 (Unknown)
- **Tool:** browser-scanner

**Description:**
The content was retrieved from a shared cache. If the response data is sensitive, personal or user-specific, this may result in sensitive information being leaked. In some cases, this may even result in a user gaining complete control of the session of another user, depending on the configuration of the caching components in use in their environment. This is primarily an issue where caching servers such as "proxy" caches are configured on the local network. This configuration is typically found in corporate or educational environments, for instance.

**Evidence:**
```
{
  "url": "https://claude1-f630a.web.app/?url=http%3A%2F%2F169.254.169.254%2Flatest%2Fmeta-data%2F"
}
```


#### INFO: Re-examine Cache-control Directives

- **CWE:** CWE-525 (Unknown)
- **Tool:** browser-scanner

**Description:**
The content was retrieved from a shared cache. If the response data is sensitive, personal or user-specific, this may result in sensitive information being leaked. In some cases, this may even result in a user gaining complete control of the session of another user, depending on the configuration of the caching components in use in their environment. This is primarily an issue where caching servers such as "proxy" caches are configured on the local network. This configuration is typically found in corporate or educational environments, for instance.

**Evidence:**
```
{
  "url": "https://claude1-f630a.web.app/?uri=http%3A%2F%2F127.0.0.1%3A22"
}
```


#### INFO: Re-examine Cache-control Directives

- **CWE:** CWE-525 (Unknown)
- **Tool:** browser-scanner

**Description:**
The content was retrieved from a shared cache. If the response data is sensitive, personal or user-specific, this may result in sensitive information being leaked. In some cases, this may even result in a user gaining complete control of the session of another user, depending on the configuration of the caching components in use in their environment. This is primarily an issue where caching servers such as "proxy" caches are configured on the local network. This configuration is typically found in corporate or educational environments, for instance.

**Evidence:**
```
{
  "url": "https://claude1-f630a.web.app/?uri=http%3A%2F%2F169.254.169.254%2Flatest%2Fmeta-data%2F"
}
```


#### INFO: Re-examine Cache-control Directives

- **CWE:** CWE-525 (Unknown)
- **Tool:** browser-scanner

**Description:**
The content was retrieved from a shared cache. If the response data is sensitive, personal or user-specific, this may result in sensitive information being leaked. In some cases, this may even result in a user gaining complete control of the session of another user, depending on the configuration of the caching components in use in their environment. This is primarily an issue where caching servers such as "proxy" caches are configured on the local network. This configuration is typically found in corporate or educational environments, for instance.

**Evidence:**
```
{
  "url": "https://claude1-f630a.web.app/?path=http%3A%2F%2F127.0.0.1%3A22"
}
```


#### INFO: Re-examine Cache-control Directives

- **CWE:** CWE-525 (Unknown)
- **Tool:** browser-scanner

**Description:**
The content was retrieved from a shared cache. If the response data is sensitive, personal or user-specific, this may result in sensitive information being leaked. In some cases, this may even result in a user gaining complete control of the session of another user, depending on the configuration of the caching components in use in their environment. This is primarily an issue where caching servers such as "proxy" caches are configured on the local network. This configuration is typically found in corporate or educational environments, for instance.

**Evidence:**
```
{
  "url": "https://claude1-f630a.web.app/?path=http%3A%2F%2F169.254.169.254%2Flatest%2Fmeta-data%2F"
}
```


#### INFO: Re-examine Cache-control Directives

- **CWE:** CWE-525 (Unknown)
- **Tool:** browser-scanner

**Description:**
The content was retrieved from a shared cache. If the response data is sensitive, personal or user-specific, this may result in sensitive information being leaked. In some cases, this may even result in a user gaining complete control of the session of another user, depending on the configuration of the caching components in use in their environment. This is primarily an issue where caching servers such as "proxy" caches are configured on the local network. This configuration is typically found in corporate or educational environments, for instance.

**Evidence:**
```
{
  "url": "https://claude1-f630a.web.app/?src=http%3A%2F%2F127.0.0.1%3A22"
}
```


#### INFO: Re-examine Cache-control Directives

- **CWE:** CWE-525 (Unknown)
- **Tool:** browser-scanner

**Description:**
The content was retrieved from a shared cache. If the response data is sensitive, personal or user-specific, this may result in sensitive information being leaked. In some cases, this may even result in a user gaining complete control of the session of another user, depending on the configuration of the caching components in use in their environment. This is primarily an issue where caching servers such as "proxy" caches are configured on the local network. This configuration is typically found in corporate or educational environments, for instance.

**Evidence:**
```
{
  "url": "https://claude1-f630a.web.app/?src=http%3A%2F%2F169.254.169.254%2Flatest%2Fmeta-data%2F"
}
```


#### INFO: Re-examine Cache-control Directives

- **CWE:** CWE-525 (Unknown)
- **Tool:** browser-scanner

**Description:**
The content was retrieved from a shared cache. If the response data is sensitive, personal or user-specific, this may result in sensitive information being leaked. In some cases, this may even result in a user gaining complete control of the session of another user, depending on the configuration of the caching components in use in their environment. This is primarily an issue where caching servers such as "proxy" caches are configured on the local network. This configuration is typically found in corporate or educational environments, for instance.

**Evidence:**
```
{
  "url": "https://claude1-f630a.web.app/?source=http%3A%2F%2F127.0.0.1%3A22"
}
```


#### INFO: Re-examine Cache-control Directives

- **CWE:** CWE-525 (Unknown)
- **Tool:** browser-scanner

**Description:**
The content was retrieved from a shared cache. If the response data is sensitive, personal or user-specific, this may result in sensitive information being leaked. In some cases, this may even result in a user gaining complete control of the session of another user, depending on the configuration of the caching components in use in their environment. This is primarily an issue where caching servers such as "proxy" caches are configured on the local network. This configuration is typically found in corporate or educational environments, for instance.

**Evidence:**
```
{
  "url": "https://claude1-f630a.web.app/?source=http%3A%2F%2F169.254.169.254%2Flatest%2Fmeta-data%2F"
}
```


#### INFO: Re-examine Cache-control Directives

- **CWE:** CWE-525 (Unknown)
- **Tool:** browser-scanner

**Description:**
The content was retrieved from a shared cache. If the response data is sensitive, personal or user-specific, this may result in sensitive information being leaked. In some cases, this may even result in a user gaining complete control of the session of another user, depending on the configuration of the caching components in use in their environment. This is primarily an issue where caching servers such as "proxy" caches are configured on the local network. This configuration is typically found in corporate or educational environments, for instance.

**Evidence:**
```
{
  "url": "https://claude1-f630a.web.app/?link=http%3A%2F%2F127.0.0.1%3A22"
}
```


#### INFO: Re-examine Cache-control Directives

- **CWE:** CWE-525 (Unknown)
- **Tool:** browser-scanner

**Description:**
The content was retrieved from a shared cache. If the response data is sensitive, personal or user-specific, this may result in sensitive information being leaked. In some cases, this may even result in a user gaining complete control of the session of another user, depending on the configuration of the caching components in use in their environment. This is primarily an issue where caching servers such as "proxy" caches are configured on the local network. This configuration is typically found in corporate or educational environments, for instance.

**Evidence:**
```
{
  "url": "https://claude1-f630a.web.app/?link=http%3A%2F%2F169.254.169.254%2Flatest%2Fmeta-data%2F"
}
```


#### INFO: Retrieved from Cache

- **CWE:** CWE-525 (Unknown)
- **Tool:** browser-scanner

**Description:**
The content was retrieved from a shared cache. If the response data is sensitive, personal or user-specific, this may result in sensitive information being leaked. In some cases, this may even result in a user gaining complete control of the session of another user, depending on the configuration of the caching components in use in their environment. This is primarily an issue where caching servers such as "proxy" caches are configured on the local network. This configuration is typically found in corporate or educational environments, for instance.

**Evidence:**
```
{
  "detail": "HIT",
  "url": "https://claude1-f630a.web.app/assets/index-CjbsZJzk.css",
  "type": "ZAP-10050-1"
}
```


#### INFO: Retrieved from Cache

- **CWE:** CWE-525 (Unknown)
- **Tool:** browser-scanner

**Description:**
The content was retrieved from a shared cache. If the response data is sensitive, personal or user-specific, this may result in sensitive information being leaked. In some cases, this may even result in a user gaining complete control of the session of another user, depending on the configuration of the caching components in use in their environment. This is primarily an issue where caching servers such as "proxy" caches are configured on the local network. This configuration is typically found in corporate or educational environments, for instance.

**Evidence:**
```
{
  "detail": "HIT",
  "url": "https://claude1-f630a.web.app/assets/index-Ksqx9DM4.js",
  "type": "ZAP-10050-1"
}
```


#### INFO: Retrieved from Cache

- **CWE:** CWE-525 (Unknown)
- **Tool:** browser-scanner

**Description:**
The content was retrieved from a shared cache. If the response data is sensitive, personal or user-specific, this may result in sensitive information being leaked. In some cases, this may even result in a user gaining complete control of the session of another user, depending on the configuration of the caching components in use in their environment. This is primarily an issue where caching servers such as "proxy" caches are configured on the local network. This configuration is typically found in corporate or educational environments, for instance.

**Evidence:**
```
{
  "detail": "HIT",
  "url": "https://claude1-f630a.web.app/webpack.config.js",
  "type": "ZAP-10050-1"
}
```


#### INFO: Timestamp Disclosure - Unix

- **CWE:** CWE-497 (Unknown)
- **Tool:** browser-scanner

**Description:**
A timestamp was disclosed by the application/web server. - Unix

**Evidence:**
```
{
  "detail": "1732584193",
  "url": "https://claude1-f630a.web.app/assets/index-Ksqx9DM4.js",
  "type": "ZAP-10096"
}
```


#### INFO: X-Content-Type-Options Header Missing

- **CWE:** CWE-693 (Unknown)
- **Tool:** browser-scanner

**Description:**
The Anti-MIME-Sniffing header X-Content-Type-Options was not set to 'nosniff'. This allows older versions of Internet Explorer and Chrome to perform MIME-sniffing on the response body, potentially causing the response body to be interpreted and displayed as a content type other than the declared content type. Current (early 2014) and legacy versions of Firefox will use the declared content type (if one is set), rather than performing MIME-sniffing.

**Evidence:**
```
{
  "detail": "N/A",
  "url": "https://claude1-f630a.web.app/assets/index-CjbsZJzk.css",
  "type": "ZAP-10021"
}
```


#### INFO: X-Content-Type-Options Header Missing

- **CWE:** CWE-693 (Unknown)
- **Tool:** browser-scanner

**Description:**
The Anti-MIME-Sniffing header X-Content-Type-Options was not set to 'nosniff'. This allows older versions of Internet Explorer and Chrome to perform MIME-sniffing on the response body, potentially causing the response body to be interpreted and displayed as a content type other than the declared content type. Current (early 2014) and legacy versions of Firefox will use the declared content type (if one is set), rather than performing MIME-sniffing.

**Evidence:**
```
{
  "detail": "N/A",
  "url": "https://claude1-f630a.web.app/assets/index-Ksqx9DM4.js",
  "type": "ZAP-10021"
}
```


#### INFO: ZAP is Out of Date

- **CWE:** CWE-1104 (Unknown)
- **Tool:** browser-scanner

**Description:**
The version of ZAP you are using to test your app is out of date and is no longer being updated.
The risk level is set based on how out of date your ZAP version is.

**Evidence:**
```
{
  "detail": "N/A",
  "url": "https://claude1-f630a.web.app/login",
  "type": "ZAP-10116"
}
```


### A02: Cryptographic Failures

#### HIGH: Exposure of Private Personal Information

- **CWE:** CWE-359 (Unknown)
- **Tool:** live-scanner
- **Status:** ✅ Confirmed by live testing

**Description:**
Other users' PII accessible: email, friends, friendRequests, referralCode

**Evidence:**
```
{
  "exposedPII": [
    "email",
    "friends",
    "friendRequests",
    "referralCode"
  ],
  "affectedUsers": 8
}
```


#### HIGH: Hardcoded Generic Password found

- **CWE:** CWE-798 (Unknown)
- **Tool:** crypto-scanner
- **Duplicate Count:** 3

**Description:**
Found potential Generic Password in https://www.googletagmanager.com/gtag/js?l=dataLayer&id=G-QNY21XMFM0


#### MEDIUM: Cookie Missing Secure Flag

- **CWE:** CWE-614 (Unknown)
- **Tool:** browser-scanner
- **Duplicate Count:** 3

**Description:**
Cookie "_ga_QNY21XMFM0" transmitted over HTTPS but lacks Secure flag

**Evidence:**
```
{
  "url": "https://claude1-f630a.web.app"
}
```


#### MEDIUM: Hardcoded Generic Token found

- **CWE:** CWE-798 (Unknown)
- **Tool:** crypto-scanner
- **Duplicate Count:** 2

**Description:**
Found potential Generic Token in https://claude1-f630a.web.app/assets/index-Ksqx9DM4.js


#### MEDIUM: Missing Content-Security-Policy

- **CWE:** CWE-79 (Unknown)
- **Tool:** browser-scanner
- **Duplicate Count:** 3

**Description:**
Security header "content-security-policy" is not set

**Evidence:**
```
{
  "url": "https://claude1-f630a.web.app"
}
```


#### MEDIUM: Missing X-Frame-Options (Clickjacking)

- **CWE:** CWE-1021 (Unknown)
- **Tool:** browser-scanner
- **Duplicate Count:** 3

**Description:**
Security header "x-frame-options" is not set

**Evidence:**
```
{
  "url": "https://claude1-f630a.web.app"
}
```


#### MEDIUM: Public Post Access

- **CWE:** CWE-311 (Unknown)
- **Tool:** live-scanner
- **Status:** ✅ Confirmed by live testing

**Description:**
10 posts readable without authentication

**Evidence:**
```
{
  "postCount": 10
}
```


#### MEDIUM: Public Storage Access

- **CWE:** CWE-311 (Missing Encryption of Sensitive Data)
- **Tool:** static-analysis

**Description:**
Storage files are publicly readable. Consider if this is necessary.

**Evidence:**
```
{
  "rule": "allow read: if true"
}
```


#### MEDIUM: Vulnerable dependency: @firebase/auth

- **CWE:** CWE-1035 (Unknown)
- **Tool:** sca

**Description:**
undici

**Evidence:**
```
{
  "package": "@firebase/auth",
  "version": "1.7.7-20240813205648 - 1.7.7-canary.1ff9661af || 1.7.8-20240827161511 - 1.7.9",
  "fixAvailable": true
}
```


#### MEDIUM: Vulnerable dependency: @firebase/auth-compat

- **CWE:** CWE-1035 (Unknown)
- **Tool:** sca

**Description:**
@firebase/auth, undici

**Evidence:**
```
{
  "package": "@firebase/auth-compat",
  "version": "0.5.12-20240813205648 - 0.5.12-canary.fa0ed08fb || 0.5.13-20240827161511 - 0.5.14",
  "fixAvailable": true
}
```


#### MEDIUM: Vulnerable dependency: @firebase/firestore

- **CWE:** CWE-1035 (Unknown)
- **Tool:** sca

**Description:**
undici

**Evidence:**
```
{
  "package": "@firebase/firestore",
  "version": "4.7.0-20240813205648 - 4.7.0-canary.fa0ed08fb || 4.7.1-20240827161511 - 4.7.3",
  "fixAvailable": true
}
```


#### MEDIUM: Vulnerable dependency: @firebase/firestore-compat

- **CWE:** CWE-1035 (Unknown)
- **Tool:** sca

**Description:**
@firebase/firestore

**Evidence:**
```
{
  "package": "@firebase/firestore-compat",
  "version": "<=0.0.900-exp.520ca39d0 || 0.3.25-20240130223218 - 0.3.25-20240131233318 || 0.3.30-20240424141009 - 0.3.30-dataconnect-preview.f2ddc3d7b || 0.3.35-20240813205648 - 0.3.35-canary.fa0ed08fb || 0.3.36-20240827161511 - 0.3.38",
  "fixAvailable": true
}
```


#### MEDIUM: Vulnerable dependency: @firebase/functions

- **CWE:** CWE-1035 (Unknown)
- **Tool:** sca

**Description:**
undici

**Evidence:**
```
{
  "package": "@firebase/functions",
  "version": "0.11.7-20240827161511 - 0.11.8",
  "fixAvailable": true
}
```


#### MEDIUM: Vulnerable dependency: @firebase/functions-compat

- **CWE:** CWE-1035 (Unknown)
- **Tool:** sca

**Description:**
@firebase/functions

**Evidence:**
```
{
  "package": "@firebase/functions-compat",
  "version": "0.3.13-20240827161511 - 0.3.14",
  "fixAvailable": true
}
```


#### MEDIUM: Vulnerable dependency: @firebase/storage

- **CWE:** CWE-1035 (Unknown)
- **Tool:** sca

**Description:**
undici

**Evidence:**
```
{
  "package": "@firebase/storage",
  "version": "0.13.0-20240814182916 - 0.13.0-canary.fa0ed08fb || 0.13.1-20240827161511 - 0.13.2",
  "fixAvailable": true
}
```


#### MEDIUM: Vulnerable dependency: @firebase/storage-compat

- **CWE:** CWE-1035 (Unknown)
- **Tool:** sca

**Description:**
@firebase/storage

**Evidence:**
```
{
  "package": "@firebase/storage-compat",
  "version": "<=0.0.900-exp.520ca39d0 || 0.1.4-202192711727 - 0.1.4-canary.f27fe4304 || 0.3.10-20240814182916 - 0.3.10-canary.fa0ed08fb || 0.3.11-20240827161511 - 0.3.12",
  "fixAvailable": true
}
```


#### MEDIUM: Vulnerable dependency: esbuild

- **CWE:** CWE-1035 (Unknown)
- **Tool:** sca

**Description:**
esbuild enables any website to send any requests to the development server and read the response

**Evidence:**
```
{
  "package": "esbuild",
  "version": "<=0.24.2",
  "fixAvailable": {
    "name": "vite",
    "version": "7.3.0",
    "isSemVerMajor": true
  }
}
```


#### MEDIUM: Vulnerable dependency: firebase

- **CWE:** CWE-1035 (Unknown)
- **Tool:** sca

**Description:**
@firebase/auth, @firebase/auth-compat, @firebase/firestore, @firebase/firestore-compat, @firebase/functions, @firebase/functions-compat, @firebase/storage, @firebase/storage-compat

**Evidence:**
```
{
  "package": "firebase",
  "version": "0.900.22 || 7.9.1-0 - 7.9.1-canary.0396117e || 8.10.0-20217172214 - 8.10.0-canary.f40c0db53 || 9.0.0-20217250818 - 9.0.0-canary.d0d3acb10 || 9.0.1-2021727231341 - 9.0.1-canary.e039e1472 || 9.0.2-2021891633 - 9.0.2-canary.ff9baf70c || 9.0.3-202181503543 - 9.1.0-canary.f7d8324a1 || 9.1.1-2021830195733 - 9.1.1-canary.e70de6201 || 9.1.2-20219523556 - 9.1.2-canary.fc1d36497 || 9.22.1-20230524195328 || 10.12.2-20240523185724 - 10.12.2-canary.872e6f63e || 10.13.0-20240813205648 - 10.13.0-canary.fa0ed08fb || 10.13.1-20240827161511 - 10.14.1 || 11.9.0-20250603144652 - 11.9.0-canary.5871fd656",
  "fixAvailable": true
}
```


#### MEDIUM: Vulnerable dependency: undici

- **CWE:** CWE-1035 (Unknown)
- **Tool:** sca

**Description:**
Use of Insufficiently Random Values in undici, undici Denial of Service attack via bad certificate data

**Evidence:**
```
{
  "package": "undici",
  "version": "6.0.0 - 6.21.1",
  "fixAvailable": true
}
```


#### MEDIUM: Vulnerable dependency: vite

- **CWE:** CWE-1035 (Unknown)
- **Tool:** sca

**Description:**
esbuild

**Evidence:**
```
{
  "package": "vite",
  "version": "0.11.0 - 6.1.6",
  "fixAvailable": {
    "name": "vite",
    "version": "7.3.0",
    "isSemVerMajor": true
  }
}
```


#### MEDIUM: Weak Random detected

- **CWE:** CWE-330 (Use of Insufficiently Random Values)
- **Tool:** crypto-scanner
- **Duplicate Count:** 2

**Description:**
Found Weak Random in https://www.googletagmanager.com/gtag/js?l=dataLayer&id=G-QNY21XMFM0. This may indicate weak cryptographic practices.


#### LOW: Missing Referrer-Policy

- **CWE:** CWE-200 (Unknown)
- **Tool:** browser-scanner
- **Duplicate Count:** 3

**Description:**
Security header "referrer-policy" is not set

**Evidence:**
```
{
  "url": "https://claude1-f630a.web.app"
}
```


#### LOW: Missing X-Content-Type-Options

- **CWE:** CWE-16 (Unknown)
- **Tool:** browser-scanner
- **Duplicate Count:** 3

**Description:**
Security header "x-content-type-options" is not set

**Evidence:**
```
{
  "url": "https://claude1-f630a.web.app"
}
```


### A03: Injection

#### CRITICAL: Template injection (Angular sandbox escape)

- **CWE:** CWE-94 (Code Injection)
- **Tool:** injection-scanner

**Description:**
Template expression "{{constructor.constructor("return 7*7")()}}" was evaluated to "49". This indicates server or client-side template injection.

**Evidence:**
```
{
  "payload": "{{constructor.constructor(\"return 7*7\")()}}",
  "expected": "49",
  "framework": "Angular sandbox escape"
}
```


#### CRITICAL: Template injection (Angular/Vue)

- **CWE:** CWE-94 (Code Injection)
- **Tool:** injection-scanner
- **Duplicate Count:** 4

**Description:**
Template expression "<%= 7*7 %>" was evaluated to "49". This indicates server or client-side template injection.

**Evidence:**
```
{
  "expected": "49",
  "payloads": [
    "{{7*7}}",
    "${7*7}",
    "<%= 7*7 %>",
    "#{7*7}"
  ],
  "payloadCount": 4,
  "frameworks": [
    "Angular/Vue",
    "Template literals",
    "EJS",
    "Pug/Jade"
  ]
}
```


#### HIGH: Unrestricted File Type Upload - Executable

- **CWE:** CWE-434 (Unrestricted Upload of File with Dangerous Type)
- **Tool:** firebase-emulator

**Description:**
Storage rules do not restrict executable file uploads.

**Evidence:**
```
{
  "detail": "Upload of .exe file to profiles succeeded"
}
```


#### MEDIUM: firebase-stored-xss

- **CWE:** CWE-79 (Cross-site Scripting (XSS))
- **Tool:** semgrep

**Description:**
User content stored. CWE-79

**Evidence:**
```
{
  "file": "/home/nillof/Exjobb/Claude1/social-media-app/src/pages/MessagesPage.jsx",
  "line": 88,
  "endLine": 94,
  "code": "await addDoc(collection(db, 'messages'), {\n        content: newMessage.trim(),\n        senderId: currentUser.uid,\n        senderName: userProfile?.displayName || userProfile?.name,\n        participants: [currentUser.uid, selectedFriend.id],\n        createdAt: serverTimestamp()\n      });"
}
```


#### MEDIUM: Missing File Type Validation in Storage Rules

- **CWE:** CWE-434 (Unrestricted Upload of File with Dangerous Type)
- **Tool:** static-analysis

**Description:**
Storage rules do not validate file content type


#### MEDIUM: Stored XSS: Unsanitized Content Storage

- **CWE:** CWE-79 (Unknown)
- **Tool:** live-scanner
- **Status:** ✅ Confirmed by live testing

**Description:**
4/4 XSS payloads stored without sanitization. If rendered with dangerouslySetInnerHTML, XSS is possible.

**Evidence:**
```
{
  "storedPayloads": 4,
  "totalTested": 4
}
```


#### MEDIUM: Unrestricted File Type Upload - HTML

- **CWE:** CWE-434 (Unrestricted Upload of File with Dangerous Type)
- **Tool:** firebase-emulator

**Description:**
Storage rules allow HTML file uploads which could be used for XSS.

**Evidence:**
```
{
  "detail": "Upload of .html file succeeded"
}
```


#### MEDIUM: Unrestricted File Type Upload - SVG

- **CWE:** CWE-434 (Unrestricted Upload of File with Dangerous Type)
- **Tool:** firebase-emulator

**Description:**
Storage rules allow SVG uploads which can contain embedded scripts.

**Evidence:**
```
{
  "detail": "Upload of .svg file succeeded"
}
```


#### LOW: firebase-upload

- **CWE:** CWE-434 (Unrestricted Upload of File with Dangerous Type)
- **Tool:** semgrep

**Description:**
File upload. CWE-434

**Evidence:**
```
{
  "file": "/home/nillof/Exjobb/Claude1/social-media-app/src/components/PostCreate.jsx",
  "line": 58,
  "endLine": 58,
  "code": "await uploadBytes(imageRef, image);"
}
```


#### LOW: firebase-upload

- **CWE:** CWE-434 (Unrestricted Upload of File with Dangerous Type)
- **Tool:** semgrep

**Description:**
File upload. CWE-434

**Evidence:**
```
{
  "file": "/home/nillof/Exjobb/Claude1/social-media-app/src/pages/SettingsPage.jsx",
  "line": 45,
  "endLine": 45,
  "code": "await uploadBytes(imageRef, file);"
}
```


