# Security Assessment Report

**Application:** Social Media App  
**Target:** https://gpt-3-3dd1e.firebaseapp.com  
**Date:** 2025-12-15T15:16:16.168Z  
**Duration:** 107s

## Summary

| Severity | Count |
|----------|-------|
| CRITICAL | 6 |
| HIGH | 22 |
| MEDIUM | 14 |
| LOW | 2 |

**Risk Score:** 200 (CRITICAL)


### Deduplication Summary

| Metric | Value |
|--------|-------|
| Original Findings | 735 |
| After Deduplication | 639 |
| Duplicates Removed | 96 |
| Reduction | 13% |

## Findings

### A01: Broken Access Control

#### CRITICAL: IDOR Vulnerability on Private Data Collection

- **CWE:** CWE-639 (IDOR)
- **Tool:** firebase-emulator

**Description:**
Private user data is accessible by manipulating document IDs.

**Evidence:**
```
{
  "detail": "alice123 accessed bob456's private data"
}
```


#### CRITICAL: Overly Permissive Default Rules

- **CWE:** CWE-276 (Unknown)
- **Tool:** firebase-emulator

**Description:**
Firestore rules may have a wildcard match that allows access to any collection.

**Evidence:**
```
{
  "detail": "Accessed arbitrary collection without authentication"
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
  "userId": "yptspZ2GsXcCyh3tEypzs7pe87D2",
  "before": false,
  "after": true
}
```


#### CRITICAL: Privilege Escalation: Self-Elevation to Owner

- **CWE:** CWE-269 (Unknown)
- **Tool:** live-scanner
- **Status:** ✅ Confirmed by live testing

**Description:**
User successfully set their own isOwner flag to true

**Evidence:**
```
{
  "userId": "yptspZ2GsXcCyh3tEypzs7pe87D2",
  "before": false,
  "after": true
}
```


#### CRITICAL: Sensitive Configuration Data Accessible

- **CWE:** CWE-922 (Insecure Storage of Sensitive Information)
- **Tool:** firebase-emulator

**Description:**
API keys or other sensitive configuration stored in Firestore is accessible to regular users.

**Evidence:**
```
{
  "detail": "Regular user accessed /config/api_keys document"
}
```


#### CRITICAL: Unauthenticated Read Access to Private Messages

- **CWE:** CWE-284 (Improper Access Control)
- **Tool:** firebase-emulator

**Description:**
Private messages are readable without authentication.

**Evidence:**
```
{
  "detail": "Unauthenticated read on /messages/{messageId} succeeded"
}
```


#### HIGH: Group Messages Exposed to Non-Members

- **CWE:** CWE-668 (Unknown)
- **Tool:** firebase-emulator

**Description:**
Users can read messages from groups they are not members of.

**Evidence:**
```
{
  "detail": "alice123 read messages from private-group without membership"
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
3 user profiles readable without authentication

**Evidence:**
```
{
  "userCount": 3,
  "exposedFields": [
    "referralMonthlyCount",
    "profilePictureUrl",
    "about",
    "age",
    "displayName",
    "role",
    "referralPoints",
    "email",
    "city",
    "country",
    "referralMonth",
    "createdAt",
    "friends",
    "theme",
    "referralOptIn",
    "billingAddress",
    "billingNotes",
    "displayNameLower",
    "banner",
    "billingName"
  ],
  "sensitiveFields": [
    "age",
    "email",
    "city",
    "country",
    "friends"
  ]
}
```


#### HIGH: Incorrect Authorization on Message Access

- **CWE:** CWE-863 (Incorrect Authorization)
- **Tool:** firebase-emulator

**Description:**
Users can read messages without being a participant in the conversation.

**Evidence:**
```
{
  "detail": "alice123 read message where she is not a participant"
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


#### HIGH: Missing Authorization on Admin Collection

- **CWE:** CWE-862 (Missing Authorization)
- **Tool:** firebase-emulator

**Description:**
Admin-only collections are accessible without admin role verification.

**Evidence:**
```
{
  "detail": "Regular user accessed /admin_settings collection"
}
```


#### HIGH: Subcollection Permission Bypass

- **CWE:** CWE-275 (Unknown)
- **Tool:** firebase-emulator

**Description:**
Subcollections may have different (weaker) permissions than their parent documents.

**Evidence:**
```
{
  "detail": "alice123 accessed bob456's private_notes subcollection"
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
- **Duplicate Count:** 6

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


#### MEDIUM: IDOR: User Enumeration

- **CWE:** CWE-639 (Unknown)
- **Tool:** live-scanner
- **Status:** ✅ Confirmed by live testing

**Description:**
Authenticated user can enumerate and access all user profiles

**Evidence:**
```
{
  "usersAccessible": 3
}
```


#### MEDIUM: improper-auth-admin-string

- **CWE:** CWE-285 (Improper Authorization)
- **Tool:** semgrep

**Description:**
Client-side admin role check. CWE-285

**Evidence:**
```
{
  "file": "/home/nillof/Exjobb/GPT3/my-social-app/app.js",
  "line": 121,
  "endLine": 121,
  "code": "} else if (currentUserDoc.role === 'admin') {"
}
```


#### MEDIUM: improper-auth-admin-string

- **CWE:** CWE-285 (Improper Authorization)
- **Tool:** semgrep

**Description:**
Client-side admin role check. CWE-285

**Evidence:**
```
{
  "file": "/home/nillof/Exjobb/GPT3/my-social-app/app.js",
  "line": 439,
  "endLine": 439,
  "code": "${(currentUserDoc && (currentUser.uid === post.authorId || currentUserDoc.role === 'admin' || currentUser.uid === OWNER_UID))"
}
```


#### MEDIUM: improper-auth-admin-string

- **CWE:** CWE-285 (Improper Authorization)
- **Tool:** semgrep

**Description:**
Client-side admin role check. CWE-285

**Evidence:**
```
{
  "file": "/home/nillof/Exjobb/GPT3/my-social-app/app.js",
  "line": 559,
  "endLine": 559,
  "code": "${(currentUserDoc && (c.authorId === currentUser.uid || currentUserDoc.role === 'admin' || currentUser.uid === OWNER_UID))"
}
```


#### MEDIUM: improper-auth-admin-string

- **CWE:** CWE-285 (Improper Authorization)
- **Tool:** semgrep

**Description:**
Client-side admin role check. CWE-285

**Evidence:**
```
{
  "file": "/home/nillof/Exjobb/GPT3/my-social-app/app.js",
  "line": 766,
  "endLine": 766,
  "code": "${(uid === currentUser.uid || currentUserDoc.role === 'admin' || currentUser.uid === OWNER_UID)"
}
```


#### MEDIUM: improper-auth-admin-string

- **CWE:** CWE-285 (Improper Authorization)
- **Tool:** semgrep

**Description:**
Client-side admin role check. CWE-285

**Evidence:**
```
{
  "file": "/home/nillof/Exjobb/GPT3/my-social-app/app.js",
  "line": 1353,
  "endLine": 1353,
  "code": "const newRole = user.role === 'admin' ? 'user' : 'admin';"
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


#### INFO: Content Security Policy (CSP) Header Not Set

- **CWE:** CWE-693 (Unknown)
- **Tool:** browser-scanner

**Description:**
Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks, including Cross Site Scripting (XSS) and data injection attacks. These attacks are used for everything from data theft to site defacement or distribution of malware. CSP provides a set of standard HTTP headers that allow website owners to declare approved sources of content that browsers should be allowed to load on that page — covered types are JavaScript, CSS, HTML frames, fonts, images and embeddable objects such as Java applets, ActiveX, audio and video files.

**Evidence:**
```
{
  "url": "https://gpt-3-3dd1e.firebaseapp.com/"
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
  "url": "https://gpt-3-3dd1e.firebaseapp.com/home",
  "type": "ZAP-10038-1"
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
  "url": "https://gpt-3-3dd1e.firebaseapp.com/profile",
  "type": "ZAP-10038-1"
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
  "url": "https://gpt-3-3dd1e.firebaseapp.com/settings",
  "type": "ZAP-10038-1"
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
  "url": "https://gpt-3-3dd1e.firebaseapp.com/posts",
  "type": "ZAP-10038-1"
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
  "url": "https://gpt-3-3dd1e.firebaseapp.com/messages",
  "type": "ZAP-10038-1"
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
  "url": "https://gpt-3-3dd1e.firebaseapp.com/feed",
  "type": "ZAP-10038-1"
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
  "url": "https://gpt-3-3dd1e.firebaseapp.com/__nonexistent__1765810982553_a6ddd2cc276cd",
  "type": "ZAP-10038-1"
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
  "url": "https://gpt-3-3dd1e.firebaseapp.com/?file=..%2F..%2F..%2Fetc%2Fpasswd"
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
  "url": "https://gpt-3-3dd1e.firebaseapp.com/?file=..%5C..%5C..%5Cwindows%5Cwin.ini"
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
  "url": "https://gpt-3-3dd1e.firebaseapp.com/?file=....%2F%2F....%2F%2F....%2F%2Fetc%2Fpasswd"
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
  "url": "https://gpt-3-3dd1e.firebaseapp.com/?file=..%252f..%252f..%252fetc%2Fpasswd"
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
  "url": "https://gpt-3-3dd1e.firebaseapp.com/?path=..%2F..%2F..%2Fetc%2Fpasswd"
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
  "url": "https://gpt-3-3dd1e.firebaseapp.com/?path=..%5C..%5C..%5Cwindows%5Cwin.ini"
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
  "url": "https://gpt-3-3dd1e.firebaseapp.com/?path=....%2F%2F....%2F%2F....%2F%2Fetc%2Fpasswd"
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
  "url": "https://gpt-3-3dd1e.firebaseapp.com/?path=..%252f..%252f..%252fetc%2Fpasswd"
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
  "url": "https://gpt-3-3dd1e.firebaseapp.com/?filepath=..%2F..%2F..%2Fetc%2Fpasswd"
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
  "url": "https://gpt-3-3dd1e.firebaseapp.com/?filepath=..%5C..%5C..%5Cwindows%5Cwin.ini"
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
  "url": "https://gpt-3-3dd1e.firebaseapp.com/?filepath=....%2F%2F....%2F%2F....%2F%2Fetc%2Fpasswd"
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
  "url": "https://gpt-3-3dd1e.firebaseapp.com/?filepath=..%252f..%252f..%252fetc%2Fpasswd"
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
  "url": "https://gpt-3-3dd1e.firebaseapp.com/?document=..%2F..%2F..%2Fetc%2Fpasswd"
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
  "url": "https://gpt-3-3dd1e.firebaseapp.com/?document=..%5C..%5C..%5Cwindows%5Cwin.ini"
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
  "url": "https://gpt-3-3dd1e.firebaseapp.com/?document=....%2F%2F....%2F%2F....%2F%2Fetc%2Fpasswd"
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
  "url": "https://gpt-3-3dd1e.firebaseapp.com/?document=..%252f..%252f..%252fetc%2Fpasswd"
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
  "url": "https://gpt-3-3dd1e.firebaseapp.com/?doc=..%2F..%2F..%2Fetc%2Fpasswd"
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
  "url": "https://gpt-3-3dd1e.firebaseapp.com/?doc=..%5C..%5C..%5Cwindows%5Cwin.ini"
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
  "url": "https://gpt-3-3dd1e.firebaseapp.com/?doc=....%2F%2F....%2F%2F....%2F%2Fetc%2Fpasswd"
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
  "url": "https://gpt-3-3dd1e.firebaseapp.com/?doc=..%252f..%252f..%252fetc%2Fpasswd"
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
  "url": "https://gpt-3-3dd1e.firebaseapp.com/?page=..%2F..%2F..%2Fetc%2Fpasswd"
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
  "url": "https://gpt-3-3dd1e.firebaseapp.com/?page=..%5C..%5C..%5Cwindows%5Cwin.ini"
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
  "url": "https://gpt-3-3dd1e.firebaseapp.com/?page=....%2F%2F....%2F%2F....%2F%2Fetc%2Fpasswd"
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
  "url": "https://gpt-3-3dd1e.firebaseapp.com/?page=..%252f..%252f..%252fetc%2Fpasswd"
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
  "url": "https://gpt-3-3dd1e.firebaseapp.com/?template=..%2F..%2F..%2Fetc%2Fpasswd"
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
  "url": "https://gpt-3-3dd1e.firebaseapp.com/?template=..%5C..%5C..%5Cwindows%5Cwin.ini"
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
  "url": "https://gpt-3-3dd1e.firebaseapp.com/?template=....%2F%2F....%2F%2F....%2F%2Fetc%2Fpasswd"
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
  "url": "https://gpt-3-3dd1e.firebaseapp.com/?template=..%252f..%252f..%252fetc%2Fpasswd"
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
  "url": "https://gpt-3-3dd1e.firebaseapp.com/?include=..%2F..%2F..%2Fetc%2Fpasswd"
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
  "url": "https://gpt-3-3dd1e.firebaseapp.com/?include=..%5C..%5C..%5Cwindows%5Cwin.ini"
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
  "url": "https://gpt-3-3dd1e.firebaseapp.com/?include=....%2F%2F....%2F%2F....%2F%2Fetc%2Fpasswd"
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
  "url": "https://gpt-3-3dd1e.firebaseapp.com/?include=..%252f..%252f..%252fetc%2Fpasswd"
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
  "url": "https://gpt-3-3dd1e.firebaseapp.com/?dir=..%2F..%2F..%2Fetc%2Fpasswd"
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
  "url": "https://gpt-3-3dd1e.firebaseapp.com/?dir=..%5C..%5C..%5Cwindows%5Cwin.ini"
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
  "url": "https://gpt-3-3dd1e.firebaseapp.com/?dir=....%2F%2F....%2F%2F....%2F%2Fetc%2Fpasswd"
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
  "url": "https://gpt-3-3dd1e.firebaseapp.com/?dir=..%252f..%252f..%252fetc%2Fpasswd"
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
  "url": "https://gpt-3-3dd1e.firebaseapp.com/?folder=..%2F..%2F..%2Fetc%2Fpasswd"
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
  "url": "https://gpt-3-3dd1e.firebaseapp.com/?folder=..%5C..%5C..%5Cwindows%5Cwin.ini"
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
  "url": "https://gpt-3-3dd1e.firebaseapp.com/?folder=....%2F%2F....%2F%2F....%2F%2Fetc%2Fpasswd"
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
  "url": "https://gpt-3-3dd1e.firebaseapp.com/?folder=..%252f..%252f..%252fetc%2Fpasswd"
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
  "url": "https://gpt-3-3dd1e.firebaseapp.com/?load=..%2F..%2F..%2Fetc%2Fpasswd"
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
  "url": "https://gpt-3-3dd1e.firebaseapp.com/?load=..%5C..%5C..%5Cwindows%5Cwin.ini"
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
  "url": "https://gpt-3-3dd1e.firebaseapp.com/?load=....%2F%2F....%2F%2F....%2F%2Fetc%2Fpasswd"
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
  "url": "https://gpt-3-3dd1e.firebaseapp.com/?load=..%252f..%252f..%252fetc%2Fpasswd"
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
  "url": "https://gpt-3-3dd1e.firebaseapp.com/?read=..%2F..%2F..%2Fetc%2Fpasswd"
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
  "url": "https://gpt-3-3dd1e.firebaseapp.com/?read=..%5C..%5C..%5Cwindows%5Cwin.ini"
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
  "url": "https://gpt-3-3dd1e.firebaseapp.com/?read=....%2F%2F....%2F%2F....%2F%2Fetc%2Fpasswd"
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
  "url": "https://gpt-3-3dd1e.firebaseapp.com/?read=..%252f..%252f..%252fetc%2Fpasswd"
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
  "url": "https://gpt-3-3dd1e.firebaseapp.com/images/",
  "type": "ZAP-10038-1"
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
  "url": "https://gpt-3-3dd1e.firebaseapp.com/uploads/",
  "type": "ZAP-10038-1"
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
  "url": "https://gpt-3-3dd1e.firebaseapp.com/assets/",
  "type": "ZAP-10038-1"
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
  "url": "https://gpt-3-3dd1e.firebaseapp.com/files/",
  "type": "ZAP-10038-1"
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
  "url": "https://gpt-3-3dd1e.firebaseapp.com/static/",
  "type": "ZAP-10038-1"
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
  "url": "https://gpt-3-3dd1e.firebaseapp.com/media/",
  "type": "ZAP-10038-1"
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
  "url": "https://gpt-3-3dd1e.firebaseapp.com/logs/",
  "type": "ZAP-10038-1"
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
  "url": "https://gpt-3-3dd1e.firebaseapp.com/backup/",
  "type": "ZAP-10038-1"
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
  "url": "https://gpt-3-3dd1e.firebaseapp.com/data/",
  "type": "ZAP-10038-1"
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
  "url": "https://gpt-3-3dd1e.firebaseapp.com/tmp/",
  "type": "ZAP-10038-1"
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
  "url": "https://gpt-3-3dd1e.firebaseapp.com/admin",
  "type": "ZAP-10038-1"
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
  "url": "https://gpt-3-3dd1e.firebaseapp.com/admin/",
  "type": "ZAP-10038-1"
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
  "url": "https://gpt-3-3dd1e.firebaseapp.com/admin/dashboard",
  "type": "ZAP-10038-1"
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
  "url": "https://gpt-3-3dd1e.firebaseapp.com/admin/users",
  "type": "ZAP-10038-1"
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
  "url": "https://gpt-3-3dd1e.firebaseapp.com/admin/settings",
  "type": "ZAP-10038-1"
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
  "url": "https://gpt-3-3dd1e.firebaseapp.com/administrator",
  "type": "ZAP-10038-1"
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
  "url": "https://gpt-3-3dd1e.firebaseapp.com/management",
  "type": "ZAP-10038-1"
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
  "url": "https://gpt-3-3dd1e.firebaseapp.com/manage",
  "type": "ZAP-10038-1"
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
  "url": "https://gpt-3-3dd1e.firebaseapp.com/console",
  "type": "ZAP-10038-1"
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
  "url": "https://gpt-3-3dd1e.firebaseapp.com/panel",
  "type": "ZAP-10038-1"
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
  "url": "https://gpt-3-3dd1e.firebaseapp.com/backoffice",
  "type": "ZAP-10038-1"
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
  "url": "https://gpt-3-3dd1e.firebaseapp.com/dashboard/admin",
  "type": "ZAP-10038-1"
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
  "url": "https://gpt-3-3dd1e.firebaseapp.com/backend",
  "type": "ZAP-10038-1"
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
  "url": "https://gpt-3-3dd1e.firebaseapp.com/api/admin",
  "type": "ZAP-10038-1"
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
  "url": "https://gpt-3-3dd1e.firebaseapp.com/api/users",
  "type": "ZAP-10038-1"
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
  "url": "https://gpt-3-3dd1e.firebaseapp.com/.git/config",
  "type": "ZAP-10038-1"
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
  "url": "https://gpt-3-3dd1e.firebaseapp.com/.git/HEAD",
  "type": "ZAP-10038-1"
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
  "url": "https://gpt-3-3dd1e.firebaseapp.com/.env",
  "type": "ZAP-10038-1"
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
  "url": "https://gpt-3-3dd1e.firebaseapp.com/.env.local",
  "type": "ZAP-10038-1"
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
  "url": "https://gpt-3-3dd1e.firebaseapp.com/config.json",
  "type": "ZAP-10038-1"
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
  "url": "https://gpt-3-3dd1e.firebaseapp.com/.env.production",
  "type": "ZAP-10038-1"
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
  "url": "https://gpt-3-3dd1e.firebaseapp.com/config.yml",
  "type": "ZAP-10038-1"
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
  "url": "https://gpt-3-3dd1e.firebaseapp.com/config.yaml",
  "type": "ZAP-10038-1"
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
  "url": "https://gpt-3-3dd1e.firebaseapp.com/package.json",
  "type": "ZAP-10038-1"
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
  "url": "https://gpt-3-3dd1e.firebaseapp.com/firebase.json",
  "type": "ZAP-10038-1"
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
  "url": "https://gpt-3-3dd1e.firebaseapp.com/package-lock.json",
  "type": "ZAP-10038-1"
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
  "url": "https://gpt-3-3dd1e.firebaseapp.com/composer.json",
  "type": "ZAP-10038-1"
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
  "url": "https://gpt-3-3dd1e.firebaseapp.com/webpack.config.js",
  "type": "ZAP-10038-1"
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
  "url": "https://gpt-3-3dd1e.firebaseapp.com/composer.lock",
  "type": "ZAP-10038-1"
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
  "url": "https://gpt-3-3dd1e.firebaseapp.com/tsconfig.json",
  "type": "ZAP-10038-1"
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
  "url": "https://gpt-3-3dd1e.firebaseapp.com/.htaccess",
  "type": "ZAP-10038-1"
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
  "url": "https://gpt-3-3dd1e.firebaseapp.com/.htpasswd",
  "type": "ZAP-10038-1"
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
  "url": "https://gpt-3-3dd1e.firebaseapp.com/robots.txt",
  "type": "ZAP-10038-1"
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
  "url": "https://gpt-3-3dd1e.firebaseapp.com/sitemap.xml",
  "type": "ZAP-10038-1"
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
  "url": "https://gpt-3-3dd1e.firebaseapp.com/crossdomain.xml",
  "type": "ZAP-10038-1"
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
  "url": "https://gpt-3-3dd1e.firebaseapp.com/clientaccesspolicy.xml",
  "type": "ZAP-10038-1"
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
  "url": "https://gpt-3-3dd1e.firebaseapp.com/web.config",
  "type": "ZAP-10038-1"
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
  "url": "https://gpt-3-3dd1e.firebaseapp.com/phpinfo.php",
  "type": "ZAP-10038-1"
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
  "url": "https://gpt-3-3dd1e.firebaseapp.com/info.php",
  "type": "ZAP-10038-1"
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
  "url": "https://gpt-3-3dd1e.firebaseapp.com/test.php",
  "type": "ZAP-10038-1"
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
  "url": "https://gpt-3-3dd1e.firebaseapp.com/backup.tar.gz",
  "type": "ZAP-10038-1"
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
  "url": "https://gpt-3-3dd1e.firebaseapp.com/backup.zip",
  "type": "ZAP-10038-1"
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
  "url": "https://gpt-3-3dd1e.firebaseapp.com/dump.sql",
  "type": "ZAP-10038-1"
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
  "url": "https://gpt-3-3dd1e.firebaseapp.com/backup.sql",
  "type": "ZAP-10038-1"
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
  "url": "https://gpt-3-3dd1e.firebaseapp.com/db.sql",
  "type": "ZAP-10038-1"
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
  "url": "https://gpt-3-3dd1e.firebaseapp.com/server-info",
  "type": "ZAP-10038-1"
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
  "url": "https://gpt-3-3dd1e.firebaseapp.com/server-status",
  "type": "ZAP-10038-1"
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
  "url": "https://gpt-3-3dd1e.firebaseapp.com/Thumbs.db",
  "type": "ZAP-10038-1"
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
  "url": "https://gpt-3-3dd1e.firebaseapp.com/.DS_Store",
  "type": "ZAP-10038-1"
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
  "url": "https://gpt-3-3dd1e.firebaseapp.com/WEB-INF/web.xml",
  "type": "ZAP-10038-1"
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
  "url": "https://gpt-3-3dd1e.firebaseapp.com/META-INF/MANIFEST.MF",
  "type": "ZAP-10038-1"
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
  "url": "https://gpt-3-3dd1e.firebaseapp.com/.svn/entries",
  "type": "ZAP-10038-1"
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
  "url": "https://gpt-3-3dd1e.firebaseapp.com/.svn/wc.db",
  "type": "ZAP-10038-1"
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
  "url": "https://gpt-3-3dd1e.firebaseapp.com/.hg/hgrc",
  "type": "ZAP-10038-1"
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
  "url": "https://gpt-3-3dd1e.firebaseapp.com/admin.html"
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
  "url": "https://gpt-3-3dd1e.firebaseapp.com/administrator.html",
  "type": "ZAP-10038-1"
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
  "url": "https://gpt-3-3dd1e.firebaseapp.com/login.html",
  "type": "ZAP-10038-1"
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
  "url": "https://gpt-3-3dd1e.firebaseapp.com/id_rsa",
  "type": "ZAP-10038-1"
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
  "url": "https://gpt-3-3dd1e.firebaseapp.com/id_rsa.pub",
  "type": "ZAP-10038-1"
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
  "url": "https://gpt-3-3dd1e.firebaseapp.com/.ssh/authorized_keys",
  "type": "ZAP-10038-1"
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
  "url": "https://gpt-3-3dd1e.firebaseapp.com/credentials.json",
  "type": "ZAP-10038-1"
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
  "url": "https://gpt-3-3dd1e.firebaseapp.com/secrets.json",
  "type": "ZAP-10038-1"
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
  "url": "https://gpt-3-3dd1e.firebaseapp.com/keys.json",
  "type": "ZAP-10038-1"
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
  "url": "https://gpt-3-3dd1e.firebaseapp.com/api-docs",
  "type": "ZAP-10038-1"
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
  "url": "https://gpt-3-3dd1e.firebaseapp.com/swagger",
  "type": "ZAP-10038-1"
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
  "url": "https://gpt-3-3dd1e.firebaseapp.com/swagger-ui",
  "type": "ZAP-10038-1"
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
  "url": "https://gpt-3-3dd1e.firebaseapp.com/swagger-ui.html",
  "type": "ZAP-10038-1"
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
  "url": "https://gpt-3-3dd1e.firebaseapp.com/swagger.json",
  "type": "ZAP-10038-1"
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
  "url": "https://gpt-3-3dd1e.firebaseapp.com/swagger.yaml",
  "type": "ZAP-10038-1"
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
  "url": "https://gpt-3-3dd1e.firebaseapp.com/openapi",
  "type": "ZAP-10038-1"
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
  "url": "https://gpt-3-3dd1e.firebaseapp.com/openapi.json",
  "type": "ZAP-10038-1"
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
  "url": "https://gpt-3-3dd1e.firebaseapp.com/openapi.yaml",
  "type": "ZAP-10038-1"
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
  "url": "https://gpt-3-3dd1e.firebaseapp.com/api/docs",
  "type": "ZAP-10038-1"
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
  "url": "https://gpt-3-3dd1e.firebaseapp.com/v1/api-docs",
  "type": "ZAP-10038-1"
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
  "url": "https://gpt-3-3dd1e.firebaseapp.com/api/swagger",
  "type": "ZAP-10038-1"
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
  "url": "https://gpt-3-3dd1e.firebaseapp.com/v2/api-docs",
  "type": "ZAP-10038-1"
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
  "url": "https://gpt-3-3dd1e.firebaseapp.com/v3/api-docs",
  "type": "ZAP-10038-1"
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
  "url": "https://gpt-3-3dd1e.firebaseapp.com/graphql",
  "type": "ZAP-10038-1"
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
  "url": "https://gpt-3-3dd1e.firebaseapp.com/graphiql",
  "type": "ZAP-10038-1"
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
  "url": "https://gpt-3-3dd1e.firebaseapp.com/?wsdl"
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
  "url": "https://gpt-3-3dd1e.firebaseapp.com/service?wsdl",
  "type": "ZAP-10038-1"
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
  "url": "https://gpt-3-3dd1e.firebaseapp.com/ws?wsdl",
  "type": "ZAP-10038-1"
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
  "url": "https://gpt-3-3dd1e.firebaseapp.com/api?wsdl",
  "type": "ZAP-10038-1"
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
  "url": "https://gpt-3-3dd1e.firebaseapp.com/api-explorer",
  "type": "ZAP-10038-1"
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
  "url": "https://gpt-3-3dd1e.firebaseapp.com/redoc",
  "type": "ZAP-10038-1"
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
  "url": "https://gpt-3-3dd1e.firebaseapp.com/developer",
  "type": "ZAP-10038-1"
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
  "url": "https://gpt-3-3dd1e.firebaseapp.com/developers",
  "type": "ZAP-10038-1"
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
  "url": "https://gpt-3-3dd1e.firebaseapp.com/?url=http%3A%2F%2F127.0.0.1%3A22"
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
  "url": "https://gpt-3-3dd1e.firebaseapp.com/?url=http%3A%2F%2F169.254.169.254%2Flatest%2Fmeta-data%2F"
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
  "url": "https://gpt-3-3dd1e.firebaseapp.com/?uri=http%3A%2F%2F127.0.0.1%3A22"
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
  "url": "https://gpt-3-3dd1e.firebaseapp.com/?uri=http%3A%2F%2F169.254.169.254%2Flatest%2Fmeta-data%2F"
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
  "url": "https://gpt-3-3dd1e.firebaseapp.com/?path=http%3A%2F%2F127.0.0.1%3A22"
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
  "url": "https://gpt-3-3dd1e.firebaseapp.com/?path=http%3A%2F%2F169.254.169.254%2Flatest%2Fmeta-data%2F"
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
  "url": "https://gpt-3-3dd1e.firebaseapp.com/?src=http%3A%2F%2F127.0.0.1%3A22"
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
  "url": "https://gpt-3-3dd1e.firebaseapp.com/?src=http%3A%2F%2F169.254.169.254%2Flatest%2Fmeta-data%2F"
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
  "url": "https://gpt-3-3dd1e.firebaseapp.com/?source=http%3A%2F%2F127.0.0.1%3A22"
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
  "url": "https://gpt-3-3dd1e.firebaseapp.com/?source=http%3A%2F%2F169.254.169.254%2Flatest%2Fmeta-data%2F"
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
  "url": "https://gpt-3-3dd1e.firebaseapp.com/?link=http%3A%2F%2F127.0.0.1%3A22"
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
  "url": "https://gpt-3-3dd1e.firebaseapp.com/?link=http%3A%2F%2F169.254.169.254%2Flatest%2Fmeta-data%2F"
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
  "url": "https://gpt-3-3dd1e.firebaseapp.com/?href=http%3A%2F%2F127.0.0.1%3A22"
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
  "url": "https://gpt-3-3dd1e.firebaseapp.com/?href=http%3A%2F%2F169.254.169.254%2Flatest%2Fmeta-data%2F"
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
  "url": "https://gpt-3-3dd1e.firebaseapp.com/?dest=http%3A%2F%2F127.0.0.1%3A22"
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
  "url": "https://gpt-3-3dd1e.firebaseapp.com/?dest=http%3A%2F%2F169.254.169.254%2Flatest%2Fmeta-data%2F"
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
  "url": "https://gpt-3-3dd1e.firebaseapp.com/?redirect=http%3A%2F%2F127.0.0.1%3A22"
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
  "url": "https://gpt-3-3dd1e.firebaseapp.com/?redirect=http%3A%2F%2F169.254.169.254%2Flatest%2Fmeta-data%2F"
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
  "url": "https://gpt-3-3dd1e.firebaseapp.com/?site=http%3A%2F%2F127.0.0.1%3A22"
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
  "url": "https://gpt-3-3dd1e.firebaseapp.com/?site=http%3A%2F%2F169.254.169.254%2Flatest%2Fmeta-data%2F"
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
  "url": "https://gpt-3-3dd1e.firebaseapp.com/?html=http%3A%2F%2F127.0.0.1%3A22"
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
  "url": "https://gpt-3-3dd1e.firebaseapp.com/?html=http%3A%2F%2F169.254.169.254%2Flatest%2Fmeta-data%2F"
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
  "url": "https://gpt-3-3dd1e.firebaseapp.com/?feed=http%3A%2F%2F127.0.0.1%3A22"
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
  "url": "https://gpt-3-3dd1e.firebaseapp.com/?feed=http%3A%2F%2F169.254.169.254%2Flatest%2Fmeta-data%2F"
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
  "url": "https://gpt-3-3dd1e.firebaseapp.com/?host=http%3A%2F%2F127.0.0.1%3A22"
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
  "url": "https://gpt-3-3dd1e.firebaseapp.com/?host=http%3A%2F%2F169.254.169.254%2Flatest%2Fmeta-data%2F"
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
  "url": "https://gpt-3-3dd1e.firebaseapp.com/?domain=http%3A%2F%2F127.0.0.1%3A22"
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
  "url": "https://gpt-3-3dd1e.firebaseapp.com/?domain=http%3A%2F%2F169.254.169.254%2Flatest%2Fmeta-data%2F"
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
  "url": "https://gpt-3-3dd1e.firebaseapp.com/?__proto__%5Bpolluted%5D=true"
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
  "url": "https://gpt-3-3dd1e.firebaseapp.com/?constructor%5Bprototype%5D%5Bpolluted%5D=true"
}
```


#### INFO: Cross-Domain JavaScript Source File Inclusion

- **CWE:** CWE-829 (Unknown)
- **Tool:** browser-scanner

**Description:**
The page includes one or more script files from a third-party domain.

**Evidence:**
```
{
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js\"></script>",
  "url": "https://gpt-3-3dd1e.firebaseapp.com/",
  "type": "ZAP-10017"
}
```


#### INFO: Cross-Domain JavaScript Source File Inclusion

- **CWE:** CWE-829 (Unknown)
- **Tool:** browser-scanner

**Description:**
The page includes one or more script files from a third-party domain.

**Evidence:**
```
{
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js\"></script>",
  "url": "https://gpt-3-3dd1e.firebaseapp.com/?file=..%2F..%2F..%2Fetc%2Fpasswd",
  "type": "ZAP-10017"
}
```


#### INFO: Cross-Domain JavaScript Source File Inclusion

- **CWE:** CWE-829 (Unknown)
- **Tool:** browser-scanner

**Description:**
The page includes one or more script files from a third-party domain.

**Evidence:**
```
{
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js\"></script>",
  "url": "https://gpt-3-3dd1e.firebaseapp.com/?file=..%5C..%5C..%5Cwindows%5Cwin.ini",
  "type": "ZAP-10017"
}
```


#### INFO: Cross-Domain JavaScript Source File Inclusion

- **CWE:** CWE-829 (Unknown)
- **Tool:** browser-scanner

**Description:**
The page includes one or more script files from a third-party domain.

**Evidence:**
```
{
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js\"></script>",
  "url": "https://gpt-3-3dd1e.firebaseapp.com/?file=....%2F%2F....%2F%2F....%2F%2Fetc%2Fpasswd",
  "type": "ZAP-10017"
}
```


#### INFO: Cross-Domain JavaScript Source File Inclusion

- **CWE:** CWE-829 (Unknown)
- **Tool:** browser-scanner

**Description:**
The page includes one or more script files from a third-party domain.

**Evidence:**
```
{
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js\"></script>",
  "url": "https://gpt-3-3dd1e.firebaseapp.com/?file=..%252f..%252f..%252fetc%2Fpasswd",
  "type": "ZAP-10017"
}
```


#### INFO: Cross-Domain JavaScript Source File Inclusion

- **CWE:** CWE-829 (Unknown)
- **Tool:** browser-scanner

**Description:**
The page includes one or more script files from a third-party domain.

**Evidence:**
```
{
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js\"></script>",
  "url": "https://gpt-3-3dd1e.firebaseapp.com/?path=..%2F..%2F..%2Fetc%2Fpasswd",
  "type": "ZAP-10017"
}
```


#### INFO: Cross-Domain JavaScript Source File Inclusion

- **CWE:** CWE-829 (Unknown)
- **Tool:** browser-scanner

**Description:**
The page includes one or more script files from a third-party domain.

**Evidence:**
```
{
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js\"></script>",
  "url": "https://gpt-3-3dd1e.firebaseapp.com/?path=..%5C..%5C..%5Cwindows%5Cwin.ini",
  "type": "ZAP-10017"
}
```


#### INFO: Cross-Domain JavaScript Source File Inclusion

- **CWE:** CWE-829 (Unknown)
- **Tool:** browser-scanner

**Description:**
The page includes one or more script files from a third-party domain.

**Evidence:**
```
{
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js\"></script>",
  "url": "https://gpt-3-3dd1e.firebaseapp.com/?path=....%2F%2F....%2F%2F....%2F%2Fetc%2Fpasswd",
  "type": "ZAP-10017"
}
```


#### INFO: Cross-Domain JavaScript Source File Inclusion

- **CWE:** CWE-829 (Unknown)
- **Tool:** browser-scanner

**Description:**
The page includes one or more script files from a third-party domain.

**Evidence:**
```
{
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js\"></script>",
  "url": "https://gpt-3-3dd1e.firebaseapp.com/?path=..%252f..%252f..%252fetc%2Fpasswd",
  "type": "ZAP-10017"
}
```


#### INFO: Cross-Domain JavaScript Source File Inclusion

- **CWE:** CWE-829 (Unknown)
- **Tool:** browser-scanner

**Description:**
The page includes one or more script files from a third-party domain.

**Evidence:**
```
{
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js\"></script>",
  "url": "https://gpt-3-3dd1e.firebaseapp.com/?filepath=..%2F..%2F..%2Fetc%2Fpasswd",
  "type": "ZAP-10017"
}
```


#### INFO: Cross-Domain JavaScript Source File Inclusion

- **CWE:** CWE-829 (Unknown)
- **Tool:** browser-scanner

**Description:**
The page includes one or more script files from a third-party domain.

**Evidence:**
```
{
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js\"></script>",
  "url": "https://gpt-3-3dd1e.firebaseapp.com/?filepath=..%5C..%5C..%5Cwindows%5Cwin.ini",
  "type": "ZAP-10017"
}
```


#### INFO: Cross-Domain JavaScript Source File Inclusion

- **CWE:** CWE-829 (Unknown)
- **Tool:** browser-scanner

**Description:**
The page includes one or more script files from a third-party domain.

**Evidence:**
```
{
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js\"></script>",
  "url": "https://gpt-3-3dd1e.firebaseapp.com/?filepath=....%2F%2F....%2F%2F....%2F%2Fetc%2Fpasswd",
  "type": "ZAP-10017"
}
```


#### INFO: Cross-Domain JavaScript Source File Inclusion

- **CWE:** CWE-829 (Unknown)
- **Tool:** browser-scanner

**Description:**
The page includes one or more script files from a third-party domain.

**Evidence:**
```
{
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js\"></script>",
  "url": "https://gpt-3-3dd1e.firebaseapp.com/?filepath=..%252f..%252f..%252fetc%2Fpasswd",
  "type": "ZAP-10017"
}
```


#### INFO: Cross-Domain JavaScript Source File Inclusion

- **CWE:** CWE-829 (Unknown)
- **Tool:** browser-scanner

**Description:**
The page includes one or more script files from a third-party domain.

**Evidence:**
```
{
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js\"></script>",
  "url": "https://gpt-3-3dd1e.firebaseapp.com/?document=..%2F..%2F..%2Fetc%2Fpasswd",
  "type": "ZAP-10017"
}
```


#### INFO: Cross-Domain JavaScript Source File Inclusion

- **CWE:** CWE-829 (Unknown)
- **Tool:** browser-scanner

**Description:**
The page includes one or more script files from a third-party domain.

**Evidence:**
```
{
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js\"></script>",
  "url": "https://gpt-3-3dd1e.firebaseapp.com/?document=..%5C..%5C..%5Cwindows%5Cwin.ini",
  "type": "ZAP-10017"
}
```


#### INFO: Cross-Domain JavaScript Source File Inclusion

- **CWE:** CWE-829 (Unknown)
- **Tool:** browser-scanner

**Description:**
The page includes one or more script files from a third-party domain.

**Evidence:**
```
{
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js\"></script>",
  "url": "https://gpt-3-3dd1e.firebaseapp.com/?document=....%2F%2F....%2F%2F....%2F%2Fetc%2Fpasswd",
  "type": "ZAP-10017"
}
```


#### INFO: Cross-Domain JavaScript Source File Inclusion

- **CWE:** CWE-829 (Unknown)
- **Tool:** browser-scanner

**Description:**
The page includes one or more script files from a third-party domain.

**Evidence:**
```
{
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js\"></script>",
  "url": "https://gpt-3-3dd1e.firebaseapp.com/?document=..%252f..%252f..%252fetc%2Fpasswd",
  "type": "ZAP-10017"
}
```


#### INFO: Cross-Domain JavaScript Source File Inclusion

- **CWE:** CWE-829 (Unknown)
- **Tool:** browser-scanner

**Description:**
The page includes one or more script files from a third-party domain.

**Evidence:**
```
{
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js\"></script>",
  "url": "https://gpt-3-3dd1e.firebaseapp.com/?doc=..%2F..%2F..%2Fetc%2Fpasswd",
  "type": "ZAP-10017"
}
```


#### INFO: Cross-Domain JavaScript Source File Inclusion

- **CWE:** CWE-829 (Unknown)
- **Tool:** browser-scanner

**Description:**
The page includes one or more script files from a third-party domain.

**Evidence:**
```
{
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js\"></script>",
  "url": "https://gpt-3-3dd1e.firebaseapp.com/?doc=..%5C..%5C..%5Cwindows%5Cwin.ini",
  "type": "ZAP-10017"
}
```


#### INFO: Cross-Domain JavaScript Source File Inclusion

- **CWE:** CWE-829 (Unknown)
- **Tool:** browser-scanner

**Description:**
The page includes one or more script files from a third-party domain.

**Evidence:**
```
{
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js\"></script>",
  "url": "https://gpt-3-3dd1e.firebaseapp.com/?doc=....%2F%2F....%2F%2F....%2F%2Fetc%2Fpasswd",
  "type": "ZAP-10017"
}
```


#### INFO: Cross-Domain JavaScript Source File Inclusion

- **CWE:** CWE-829 (Unknown)
- **Tool:** browser-scanner

**Description:**
The page includes one or more script files from a third-party domain.

**Evidence:**
```
{
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js\"></script>",
  "url": "https://gpt-3-3dd1e.firebaseapp.com/?doc=..%252f..%252f..%252fetc%2Fpasswd",
  "type": "ZAP-10017"
}
```


#### INFO: Cross-Domain JavaScript Source File Inclusion

- **CWE:** CWE-829 (Unknown)
- **Tool:** browser-scanner

**Description:**
The page includes one or more script files from a third-party domain.

**Evidence:**
```
{
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js\"></script>",
  "url": "https://gpt-3-3dd1e.firebaseapp.com/?page=..%2F..%2F..%2Fetc%2Fpasswd",
  "type": "ZAP-10017"
}
```


#### INFO: Cross-Domain JavaScript Source File Inclusion

- **CWE:** CWE-829 (Unknown)
- **Tool:** browser-scanner

**Description:**
The page includes one or more script files from a third-party domain.

**Evidence:**
```
{
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js\"></script>",
  "url": "https://gpt-3-3dd1e.firebaseapp.com/?page=..%5C..%5C..%5Cwindows%5Cwin.ini",
  "type": "ZAP-10017"
}
```


#### INFO: Cross-Domain JavaScript Source File Inclusion

- **CWE:** CWE-829 (Unknown)
- **Tool:** browser-scanner

**Description:**
The page includes one or more script files from a third-party domain.

**Evidence:**
```
{
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js\"></script>",
  "url": "https://gpt-3-3dd1e.firebaseapp.com/?page=....%2F%2F....%2F%2F....%2F%2Fetc%2Fpasswd",
  "type": "ZAP-10017"
}
```


#### INFO: Cross-Domain JavaScript Source File Inclusion

- **CWE:** CWE-829 (Unknown)
- **Tool:** browser-scanner

**Description:**
The page includes one or more script files from a third-party domain.

**Evidence:**
```
{
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js\"></script>",
  "url": "https://gpt-3-3dd1e.firebaseapp.com/?page=..%252f..%252f..%252fetc%2Fpasswd",
  "type": "ZAP-10017"
}
```


#### INFO: Cross-Domain JavaScript Source File Inclusion

- **CWE:** CWE-829 (Unknown)
- **Tool:** browser-scanner

**Description:**
The page includes one or more script files from a third-party domain.

**Evidence:**
```
{
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js\"></script>",
  "url": "https://gpt-3-3dd1e.firebaseapp.com/?template=..%2F..%2F..%2Fetc%2Fpasswd",
  "type": "ZAP-10017"
}
```


#### INFO: Cross-Domain JavaScript Source File Inclusion

- **CWE:** CWE-829 (Unknown)
- **Tool:** browser-scanner

**Description:**
The page includes one or more script files from a third-party domain.

**Evidence:**
```
{
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js\"></script>",
  "url": "https://gpt-3-3dd1e.firebaseapp.com/?template=..%5C..%5C..%5Cwindows%5Cwin.ini",
  "type": "ZAP-10017"
}
```


#### INFO: Cross-Domain JavaScript Source File Inclusion

- **CWE:** CWE-829 (Unknown)
- **Tool:** browser-scanner

**Description:**
The page includes one or more script files from a third-party domain.

**Evidence:**
```
{
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js\"></script>",
  "url": "https://gpt-3-3dd1e.firebaseapp.com/?template=....%2F%2F....%2F%2F....%2F%2Fetc%2Fpasswd",
  "type": "ZAP-10017"
}
```


#### INFO: Cross-Domain JavaScript Source File Inclusion

- **CWE:** CWE-829 (Unknown)
- **Tool:** browser-scanner

**Description:**
The page includes one or more script files from a third-party domain.

**Evidence:**
```
{
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js\"></script>",
  "url": "https://gpt-3-3dd1e.firebaseapp.com/?template=..%252f..%252f..%252fetc%2Fpasswd",
  "type": "ZAP-10017"
}
```


#### INFO: Cross-Domain JavaScript Source File Inclusion

- **CWE:** CWE-829 (Unknown)
- **Tool:** browser-scanner

**Description:**
The page includes one or more script files from a third-party domain.

**Evidence:**
```
{
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js\"></script>",
  "url": "https://gpt-3-3dd1e.firebaseapp.com/?include=..%2F..%2F..%2Fetc%2Fpasswd",
  "type": "ZAP-10017"
}
```


#### INFO: Cross-Domain JavaScript Source File Inclusion

- **CWE:** CWE-829 (Unknown)
- **Tool:** browser-scanner

**Description:**
The page includes one or more script files from a third-party domain.

**Evidence:**
```
{
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js\"></script>",
  "url": "https://gpt-3-3dd1e.firebaseapp.com/?include=..%5C..%5C..%5Cwindows%5Cwin.ini",
  "type": "ZAP-10017"
}
```


#### INFO: Cross-Domain JavaScript Source File Inclusion

- **CWE:** CWE-829 (Unknown)
- **Tool:** browser-scanner

**Description:**
The page includes one or more script files from a third-party domain.

**Evidence:**
```
{
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js\"></script>",
  "url": "https://gpt-3-3dd1e.firebaseapp.com/?include=....%2F%2F....%2F%2F....%2F%2Fetc%2Fpasswd",
  "type": "ZAP-10017"
}
```


#### INFO: Cross-Domain JavaScript Source File Inclusion

- **CWE:** CWE-829 (Unknown)
- **Tool:** browser-scanner

**Description:**
The page includes one or more script files from a third-party domain.

**Evidence:**
```
{
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js\"></script>",
  "url": "https://gpt-3-3dd1e.firebaseapp.com/?include=..%252f..%252f..%252fetc%2Fpasswd",
  "type": "ZAP-10017"
}
```


#### INFO: Cross-Domain JavaScript Source File Inclusion

- **CWE:** CWE-829 (Unknown)
- **Tool:** browser-scanner

**Description:**
The page includes one or more script files from a third-party domain.

**Evidence:**
```
{
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js\"></script>",
  "url": "https://gpt-3-3dd1e.firebaseapp.com/?dir=..%2F..%2F..%2Fetc%2Fpasswd",
  "type": "ZAP-10017"
}
```


#### INFO: Cross-Domain JavaScript Source File Inclusion

- **CWE:** CWE-829 (Unknown)
- **Tool:** browser-scanner

**Description:**
The page includes one or more script files from a third-party domain.

**Evidence:**
```
{
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js\"></script>",
  "url": "https://gpt-3-3dd1e.firebaseapp.com/?dir=..%5C..%5C..%5Cwindows%5Cwin.ini",
  "type": "ZAP-10017"
}
```


#### INFO: Cross-Domain JavaScript Source File Inclusion

- **CWE:** CWE-829 (Unknown)
- **Tool:** browser-scanner

**Description:**
The page includes one or more script files from a third-party domain.

**Evidence:**
```
{
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js\"></script>",
  "url": "https://gpt-3-3dd1e.firebaseapp.com/?dir=....%2F%2F....%2F%2F....%2F%2Fetc%2Fpasswd",
  "type": "ZAP-10017"
}
```


#### INFO: Cross-Domain JavaScript Source File Inclusion

- **CWE:** CWE-829 (Unknown)
- **Tool:** browser-scanner

**Description:**
The page includes one or more script files from a third-party domain.

**Evidence:**
```
{
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js\"></script>",
  "url": "https://gpt-3-3dd1e.firebaseapp.com/?dir=..%252f..%252f..%252fetc%2Fpasswd",
  "type": "ZAP-10017"
}
```


#### INFO: Cross-Domain JavaScript Source File Inclusion

- **CWE:** CWE-829 (Unknown)
- **Tool:** browser-scanner

**Description:**
The page includes one or more script files from a third-party domain.

**Evidence:**
```
{
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js\"></script>",
  "url": "https://gpt-3-3dd1e.firebaseapp.com/?folder=..%2F..%2F..%2Fetc%2Fpasswd",
  "type": "ZAP-10017"
}
```


#### INFO: Cross-Domain JavaScript Source File Inclusion

- **CWE:** CWE-829 (Unknown)
- **Tool:** browser-scanner

**Description:**
The page includes one or more script files from a third-party domain.

**Evidence:**
```
{
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js\"></script>",
  "url": "https://gpt-3-3dd1e.firebaseapp.com/?folder=..%5C..%5C..%5Cwindows%5Cwin.ini",
  "type": "ZAP-10017"
}
```


#### INFO: Cross-Domain JavaScript Source File Inclusion

- **CWE:** CWE-829 (Unknown)
- **Tool:** browser-scanner

**Description:**
The page includes one or more script files from a third-party domain.

**Evidence:**
```
{
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js\"></script>",
  "url": "https://gpt-3-3dd1e.firebaseapp.com/?folder=....%2F%2F....%2F%2F....%2F%2Fetc%2Fpasswd",
  "type": "ZAP-10017"
}
```


#### INFO: Cross-Domain JavaScript Source File Inclusion

- **CWE:** CWE-829 (Unknown)
- **Tool:** browser-scanner

**Description:**
The page includes one or more script files from a third-party domain.

**Evidence:**
```
{
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js\"></script>",
  "url": "https://gpt-3-3dd1e.firebaseapp.com/?folder=..%252f..%252f..%252fetc%2Fpasswd",
  "type": "ZAP-10017"
}
```


#### INFO: Cross-Domain JavaScript Source File Inclusion

- **CWE:** CWE-829 (Unknown)
- **Tool:** browser-scanner

**Description:**
The page includes one or more script files from a third-party domain.

**Evidence:**
```
{
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js\"></script>",
  "url": "https://gpt-3-3dd1e.firebaseapp.com/?load=..%2F..%2F..%2Fetc%2Fpasswd",
  "type": "ZAP-10017"
}
```


#### INFO: Cross-Domain JavaScript Source File Inclusion

- **CWE:** CWE-829 (Unknown)
- **Tool:** browser-scanner

**Description:**
The page includes one or more script files from a third-party domain.

**Evidence:**
```
{
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js\"></script>",
  "url": "https://gpt-3-3dd1e.firebaseapp.com/?load=..%5C..%5C..%5Cwindows%5Cwin.ini",
  "type": "ZAP-10017"
}
```


#### INFO: Cross-Domain JavaScript Source File Inclusion

- **CWE:** CWE-829 (Unknown)
- **Tool:** browser-scanner

**Description:**
The page includes one or more script files from a third-party domain.

**Evidence:**
```
{
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js\"></script>",
  "url": "https://gpt-3-3dd1e.firebaseapp.com/?load=....%2F%2F....%2F%2F....%2F%2Fetc%2Fpasswd",
  "type": "ZAP-10017"
}
```


#### INFO: Cross-Domain JavaScript Source File Inclusion

- **CWE:** CWE-829 (Unknown)
- **Tool:** browser-scanner

**Description:**
The page includes one or more script files from a third-party domain.

**Evidence:**
```
{
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js\"></script>",
  "url": "https://gpt-3-3dd1e.firebaseapp.com/?load=..%252f..%252f..%252fetc%2Fpasswd",
  "type": "ZAP-10017"
}
```


#### INFO: Cross-Domain JavaScript Source File Inclusion

- **CWE:** CWE-829 (Unknown)
- **Tool:** browser-scanner

**Description:**
The page includes one or more script files from a third-party domain.

**Evidence:**
```
{
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js\"></script>",
  "url": "https://gpt-3-3dd1e.firebaseapp.com/?read=..%2F..%2F..%2Fetc%2Fpasswd",
  "type": "ZAP-10017"
}
```


#### INFO: Cross-Domain JavaScript Source File Inclusion

- **CWE:** CWE-829 (Unknown)
- **Tool:** browser-scanner

**Description:**
The page includes one or more script files from a third-party domain.

**Evidence:**
```
{
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js\"></script>",
  "url": "https://gpt-3-3dd1e.firebaseapp.com/?read=..%5C..%5C..%5Cwindows%5Cwin.ini",
  "type": "ZAP-10017"
}
```


#### INFO: Cross-Domain JavaScript Source File Inclusion

- **CWE:** CWE-829 (Unknown)
- **Tool:** browser-scanner

**Description:**
The page includes one or more script files from a third-party domain.

**Evidence:**
```
{
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js\"></script>",
  "url": "https://gpt-3-3dd1e.firebaseapp.com/?read=....%2F%2F....%2F%2F....%2F%2Fetc%2Fpasswd",
  "type": "ZAP-10017"
}
```


#### INFO: Cross-Domain JavaScript Source File Inclusion

- **CWE:** CWE-829 (Unknown)
- **Tool:** browser-scanner

**Description:**
The page includes one or more script files from a third-party domain.

**Evidence:**
```
{
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js\"></script>",
  "url": "https://gpt-3-3dd1e.firebaseapp.com/?read=..%252f..%252f..%252fetc%2Fpasswd",
  "type": "ZAP-10017"
}
```


#### INFO: Cross-Domain JavaScript Source File Inclusion

- **CWE:** CWE-829 (Unknown)
- **Tool:** browser-scanner

**Description:**
The page includes one or more script files from a third-party domain.

**Evidence:**
```
{
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js\"></script>",
  "url": "https://gpt-3-3dd1e.firebaseapp.com/admin.html",
  "type": "ZAP-10017"
}
```


#### INFO: Cross-Domain JavaScript Source File Inclusion

- **CWE:** CWE-829 (Unknown)
- **Tool:** browser-scanner

**Description:**
The page includes one or more script files from a third-party domain.

**Evidence:**
```
{
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js\"></script>",
  "url": "https://gpt-3-3dd1e.firebaseapp.com/?wsdl",
  "type": "ZAP-10017"
}
```


#### INFO: Cross-Domain JavaScript Source File Inclusion

- **CWE:** CWE-829 (Unknown)
- **Tool:** browser-scanner

**Description:**
The page includes one or more script files from a third-party domain.

**Evidence:**
```
{
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js\"></script>",
  "url": "https://gpt-3-3dd1e.firebaseapp.com/?url=http%3A%2F%2F127.0.0.1%3A22",
  "type": "ZAP-10017"
}
```


#### INFO: Cross-Domain JavaScript Source File Inclusion

- **CWE:** CWE-829 (Unknown)
- **Tool:** browser-scanner

**Description:**
The page includes one or more script files from a third-party domain.

**Evidence:**
```
{
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js\"></script>",
  "url": "https://gpt-3-3dd1e.firebaseapp.com/?url=http%3A%2F%2F169.254.169.254%2Flatest%2Fmeta-data%2F",
  "type": "ZAP-10017"
}
```


#### INFO: Cross-Domain JavaScript Source File Inclusion

- **CWE:** CWE-829 (Unknown)
- **Tool:** browser-scanner

**Description:**
The page includes one or more script files from a third-party domain.

**Evidence:**
```
{
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js\"></script>",
  "url": "https://gpt-3-3dd1e.firebaseapp.com/?uri=http%3A%2F%2F127.0.0.1%3A22",
  "type": "ZAP-10017"
}
```


#### INFO: Cross-Domain JavaScript Source File Inclusion

- **CWE:** CWE-829 (Unknown)
- **Tool:** browser-scanner

**Description:**
The page includes one or more script files from a third-party domain.

**Evidence:**
```
{
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js\"></script>",
  "url": "https://gpt-3-3dd1e.firebaseapp.com/?uri=http%3A%2F%2F169.254.169.254%2Flatest%2Fmeta-data%2F",
  "type": "ZAP-10017"
}
```


#### INFO: Cross-Domain JavaScript Source File Inclusion

- **CWE:** CWE-829 (Unknown)
- **Tool:** browser-scanner

**Description:**
The page includes one or more script files from a third-party domain.

**Evidence:**
```
{
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js\"></script>",
  "url": "https://gpt-3-3dd1e.firebaseapp.com/?path=http%3A%2F%2F127.0.0.1%3A22",
  "type": "ZAP-10017"
}
```


#### INFO: Cross-Domain JavaScript Source File Inclusion

- **CWE:** CWE-829 (Unknown)
- **Tool:** browser-scanner

**Description:**
The page includes one or more script files from a third-party domain.

**Evidence:**
```
{
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js\"></script>",
  "url": "https://gpt-3-3dd1e.firebaseapp.com/?path=http%3A%2F%2F169.254.169.254%2Flatest%2Fmeta-data%2F",
  "type": "ZAP-10017"
}
```


#### INFO: Cross-Domain JavaScript Source File Inclusion

- **CWE:** CWE-829 (Unknown)
- **Tool:** browser-scanner

**Description:**
The page includes one or more script files from a third-party domain.

**Evidence:**
```
{
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js\"></script>",
  "url": "https://gpt-3-3dd1e.firebaseapp.com/?src=http%3A%2F%2F127.0.0.1%3A22",
  "type": "ZAP-10017"
}
```


#### INFO: Cross-Domain JavaScript Source File Inclusion

- **CWE:** CWE-829 (Unknown)
- **Tool:** browser-scanner

**Description:**
The page includes one or more script files from a third-party domain.

**Evidence:**
```
{
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js\"></script>",
  "url": "https://gpt-3-3dd1e.firebaseapp.com/?src=http%3A%2F%2F169.254.169.254%2Flatest%2Fmeta-data%2F",
  "type": "ZAP-10017"
}
```


#### INFO: Cross-Domain JavaScript Source File Inclusion

- **CWE:** CWE-829 (Unknown)
- **Tool:** browser-scanner

**Description:**
The page includes one or more script files from a third-party domain.

**Evidence:**
```
{
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js\"></script>",
  "url": "https://gpt-3-3dd1e.firebaseapp.com/?source=http%3A%2F%2F127.0.0.1%3A22",
  "type": "ZAP-10017"
}
```


#### INFO: Cross-Domain JavaScript Source File Inclusion

- **CWE:** CWE-829 (Unknown)
- **Tool:** browser-scanner

**Description:**
The page includes one or more script files from a third-party domain.

**Evidence:**
```
{
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js\"></script>",
  "url": "https://gpt-3-3dd1e.firebaseapp.com/?source=http%3A%2F%2F169.254.169.254%2Flatest%2Fmeta-data%2F",
  "type": "ZAP-10017"
}
```


#### INFO: Cross-Domain JavaScript Source File Inclusion

- **CWE:** CWE-829 (Unknown)
- **Tool:** browser-scanner

**Description:**
The page includes one or more script files from a third-party domain.

**Evidence:**
```
{
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js\"></script>",
  "url": "https://gpt-3-3dd1e.firebaseapp.com/?link=http%3A%2F%2F127.0.0.1%3A22",
  "type": "ZAP-10017"
}
```


#### INFO: Cross-Domain JavaScript Source File Inclusion

- **CWE:** CWE-829 (Unknown)
- **Tool:** browser-scanner

**Description:**
The page includes one or more script files from a third-party domain.

**Evidence:**
```
{
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js\"></script>",
  "url": "https://gpt-3-3dd1e.firebaseapp.com/?link=http%3A%2F%2F169.254.169.254%2Flatest%2Fmeta-data%2F",
  "type": "ZAP-10017"
}
```


#### INFO: Cross-Domain JavaScript Source File Inclusion

- **CWE:** CWE-829 (Unknown)
- **Tool:** browser-scanner

**Description:**
The page includes one or more script files from a third-party domain.

**Evidence:**
```
{
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js\"></script>",
  "url": "https://gpt-3-3dd1e.firebaseapp.com/?href=http%3A%2F%2F127.0.0.1%3A22",
  "type": "ZAP-10017"
}
```


#### INFO: Cross-Domain JavaScript Source File Inclusion

- **CWE:** CWE-829 (Unknown)
- **Tool:** browser-scanner

**Description:**
The page includes one or more script files from a third-party domain.

**Evidence:**
```
{
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js\"></script>",
  "url": "https://gpt-3-3dd1e.firebaseapp.com/?href=http%3A%2F%2F169.254.169.254%2Flatest%2Fmeta-data%2F",
  "type": "ZAP-10017"
}
```


#### INFO: Cross-Domain JavaScript Source File Inclusion

- **CWE:** CWE-829 (Unknown)
- **Tool:** browser-scanner

**Description:**
The page includes one or more script files from a third-party domain.

**Evidence:**
```
{
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js\"></script>",
  "url": "https://gpt-3-3dd1e.firebaseapp.com/?dest=http%3A%2F%2F127.0.0.1%3A22",
  "type": "ZAP-10017"
}
```


#### INFO: Cross-Domain JavaScript Source File Inclusion

- **CWE:** CWE-829 (Unknown)
- **Tool:** browser-scanner

**Description:**
The page includes one or more script files from a third-party domain.

**Evidence:**
```
{
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js\"></script>",
  "url": "https://gpt-3-3dd1e.firebaseapp.com/?dest=http%3A%2F%2F169.254.169.254%2Flatest%2Fmeta-data%2F",
  "type": "ZAP-10017"
}
```


#### INFO: Cross-Domain JavaScript Source File Inclusion

- **CWE:** CWE-829 (Unknown)
- **Tool:** browser-scanner

**Description:**
The page includes one or more script files from a third-party domain.

**Evidence:**
```
{
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js\"></script>",
  "url": "https://gpt-3-3dd1e.firebaseapp.com/?redirect=http%3A%2F%2F127.0.0.1%3A22",
  "type": "ZAP-10017"
}
```


#### INFO: Cross-Domain JavaScript Source File Inclusion

- **CWE:** CWE-829 (Unknown)
- **Tool:** browser-scanner

**Description:**
The page includes one or more script files from a third-party domain.

**Evidence:**
```
{
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js\"></script>",
  "url": "https://gpt-3-3dd1e.firebaseapp.com/?redirect=http%3A%2F%2F169.254.169.254%2Flatest%2Fmeta-data%2F",
  "type": "ZAP-10017"
}
```


#### INFO: Cross-Domain JavaScript Source File Inclusion

- **CWE:** CWE-829 (Unknown)
- **Tool:** browser-scanner

**Description:**
The page includes one or more script files from a third-party domain.

**Evidence:**
```
{
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js\"></script>",
  "url": "https://gpt-3-3dd1e.firebaseapp.com/?site=http%3A%2F%2F127.0.0.1%3A22",
  "type": "ZAP-10017"
}
```


#### INFO: Cross-Domain JavaScript Source File Inclusion

- **CWE:** CWE-829 (Unknown)
- **Tool:** browser-scanner

**Description:**
The page includes one or more script files from a third-party domain.

**Evidence:**
```
{
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js\"></script>",
  "url": "https://gpt-3-3dd1e.firebaseapp.com/?site=http%3A%2F%2F169.254.169.254%2Flatest%2Fmeta-data%2F",
  "type": "ZAP-10017"
}
```


#### INFO: Cross-Domain JavaScript Source File Inclusion

- **CWE:** CWE-829 (Unknown)
- **Tool:** browser-scanner

**Description:**
The page includes one or more script files from a third-party domain.

**Evidence:**
```
{
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js\"></script>",
  "url": "https://gpt-3-3dd1e.firebaseapp.com/?html=http%3A%2F%2F127.0.0.1%3A22",
  "type": "ZAP-10017"
}
```


#### INFO: Cross-Domain JavaScript Source File Inclusion

- **CWE:** CWE-829 (Unknown)
- **Tool:** browser-scanner

**Description:**
The page includes one or more script files from a third-party domain.

**Evidence:**
```
{
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js\"></script>",
  "url": "https://gpt-3-3dd1e.firebaseapp.com/?html=http%3A%2F%2F169.254.169.254%2Flatest%2Fmeta-data%2F",
  "type": "ZAP-10017"
}
```


#### INFO: Cross-Domain JavaScript Source File Inclusion

- **CWE:** CWE-829 (Unknown)
- **Tool:** browser-scanner

**Description:**
The page includes one or more script files from a third-party domain.

**Evidence:**
```
{
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js\"></script>",
  "url": "https://gpt-3-3dd1e.firebaseapp.com/?feed=http%3A%2F%2F127.0.0.1%3A22",
  "type": "ZAP-10017"
}
```


#### INFO: Cross-Domain JavaScript Source File Inclusion

- **CWE:** CWE-829 (Unknown)
- **Tool:** browser-scanner

**Description:**
The page includes one or more script files from a third-party domain.

**Evidence:**
```
{
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js\"></script>",
  "url": "https://gpt-3-3dd1e.firebaseapp.com/?feed=http%3A%2F%2F169.254.169.254%2Flatest%2Fmeta-data%2F",
  "type": "ZAP-10017"
}
```


#### INFO: Cross-Domain JavaScript Source File Inclusion

- **CWE:** CWE-829 (Unknown)
- **Tool:** browser-scanner

**Description:**
The page includes one or more script files from a third-party domain.

**Evidence:**
```
{
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js\"></script>",
  "url": "https://gpt-3-3dd1e.firebaseapp.com/?host=http%3A%2F%2F127.0.0.1%3A22",
  "type": "ZAP-10017"
}
```


#### INFO: Cross-Domain JavaScript Source File Inclusion

- **CWE:** CWE-829 (Unknown)
- **Tool:** browser-scanner

**Description:**
The page includes one or more script files from a third-party domain.

**Evidence:**
```
{
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js\"></script>",
  "url": "https://gpt-3-3dd1e.firebaseapp.com/?host=http%3A%2F%2F169.254.169.254%2Flatest%2Fmeta-data%2F",
  "type": "ZAP-10017"
}
```


#### INFO: Cross-Domain JavaScript Source File Inclusion

- **CWE:** CWE-829 (Unknown)
- **Tool:** browser-scanner

**Description:**
The page includes one or more script files from a third-party domain.

**Evidence:**
```
{
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js\"></script>",
  "url": "https://gpt-3-3dd1e.firebaseapp.com/?domain=http%3A%2F%2F127.0.0.1%3A22",
  "type": "ZAP-10017"
}
```


#### INFO: Cross-Domain JavaScript Source File Inclusion

- **CWE:** CWE-829 (Unknown)
- **Tool:** browser-scanner

**Description:**
The page includes one or more script files from a third-party domain.

**Evidence:**
```
{
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js\"></script>",
  "url": "https://gpt-3-3dd1e.firebaseapp.com/?domain=http%3A%2F%2F169.254.169.254%2Flatest%2Fmeta-data%2F",
  "type": "ZAP-10017"
}
```


#### INFO: Cross-Domain JavaScript Source File Inclusion

- **CWE:** CWE-829 (Unknown)
- **Tool:** browser-scanner

**Description:**
The page includes one or more script files from a third-party domain.

**Evidence:**
```
{
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js\"></script>",
  "url": "https://gpt-3-3dd1e.firebaseapp.com/?__proto__%5Bpolluted%5D=true",
  "type": "ZAP-10017"
}
```


#### INFO: Cross-Domain JavaScript Source File Inclusion

- **CWE:** CWE-829 (Unknown)
- **Tool:** browser-scanner

**Description:**
The page includes one or more script files from a third-party domain.

**Evidence:**
```
{
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js\"></script>",
  "url": "https://gpt-3-3dd1e.firebaseapp.com/?constructor%5Bprototype%5D%5Bpolluted%5D=true",
  "type": "ZAP-10017"
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
  "detail": "ADMIN",
  "url": "https://gpt-3-3dd1e.firebaseapp.com/",
  "type": "ZAP-10027"
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
  "detail": "from",
  "url": "https://gpt-3-3dd1e.firebaseapp.com/firebase-config.js",
  "type": "ZAP-10027"
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
  "detail": "user",
  "url": "https://gpt-3-3dd1e.firebaseapp.com/app.js",
  "type": "ZAP-10027"
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
  "detail": "ADMIN",
  "url": "https://gpt-3-3dd1e.firebaseapp.com/?file=..%2F..%2F..%2Fetc%2Fpasswd",
  "type": "ZAP-10027"
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
  "detail": "ADMIN",
  "url": "https://gpt-3-3dd1e.firebaseapp.com/?file=..%5C..%5C..%5Cwindows%5Cwin.ini",
  "type": "ZAP-10027"
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
  "detail": "ADMIN",
  "url": "https://gpt-3-3dd1e.firebaseapp.com/?file=....%2F%2F....%2F%2F....%2F%2Fetc%2Fpasswd",
  "type": "ZAP-10027"
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
  "detail": "ADMIN",
  "url": "https://gpt-3-3dd1e.firebaseapp.com/?file=..%252f..%252f..%252fetc%2Fpasswd",
  "type": "ZAP-10027"
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
  "detail": "ADMIN",
  "url": "https://gpt-3-3dd1e.firebaseapp.com/?path=..%2F..%2F..%2Fetc%2Fpasswd",
  "type": "ZAP-10027"
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
  "detail": "ADMIN",
  "url": "https://gpt-3-3dd1e.firebaseapp.com/?path=..%5C..%5C..%5Cwindows%5Cwin.ini",
  "type": "ZAP-10027"
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
  "detail": "ADMIN",
  "url": "https://gpt-3-3dd1e.firebaseapp.com/?path=....%2F%2F....%2F%2F....%2F%2Fetc%2Fpasswd",
  "type": "ZAP-10027"
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
  "detail": "ADMIN",
  "url": "https://gpt-3-3dd1e.firebaseapp.com/?path=..%252f..%252f..%252fetc%2Fpasswd",
  "type": "ZAP-10027"
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
  "detail": "ADMIN",
  "url": "https://gpt-3-3dd1e.firebaseapp.com/?filepath=..%2F..%2F..%2Fetc%2Fpasswd",
  "type": "ZAP-10027"
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
  "detail": "ADMIN",
  "url": "https://gpt-3-3dd1e.firebaseapp.com/?filepath=..%5C..%5C..%5Cwindows%5Cwin.ini",
  "type": "ZAP-10027"
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
  "detail": "ADMIN",
  "url": "https://gpt-3-3dd1e.firebaseapp.com/?filepath=....%2F%2F....%2F%2F....%2F%2Fetc%2Fpasswd",
  "type": "ZAP-10027"
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
  "detail": "ADMIN",
  "url": "https://gpt-3-3dd1e.firebaseapp.com/?filepath=..%252f..%252f..%252fetc%2Fpasswd",
  "type": "ZAP-10027"
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
  "detail": "ADMIN",
  "url": "https://gpt-3-3dd1e.firebaseapp.com/?document=..%2F..%2F..%2Fetc%2Fpasswd",
  "type": "ZAP-10027"
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
  "detail": "ADMIN",
  "url": "https://gpt-3-3dd1e.firebaseapp.com/?document=..%5C..%5C..%5Cwindows%5Cwin.ini",
  "type": "ZAP-10027"
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
  "detail": "ADMIN",
  "url": "https://gpt-3-3dd1e.firebaseapp.com/?document=....%2F%2F....%2F%2F....%2F%2Fetc%2Fpasswd",
  "type": "ZAP-10027"
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
  "detail": "ADMIN",
  "url": "https://gpt-3-3dd1e.firebaseapp.com/?document=..%252f..%252f..%252fetc%2Fpasswd",
  "type": "ZAP-10027"
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
  "detail": "ADMIN",
  "url": "https://gpt-3-3dd1e.firebaseapp.com/?doc=..%2F..%2F..%2Fetc%2Fpasswd",
  "type": "ZAP-10027"
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
  "detail": "ADMIN",
  "url": "https://gpt-3-3dd1e.firebaseapp.com/?doc=..%5C..%5C..%5Cwindows%5Cwin.ini",
  "type": "ZAP-10027"
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
  "detail": "ADMIN",
  "url": "https://gpt-3-3dd1e.firebaseapp.com/?doc=....%2F%2F....%2F%2F....%2F%2Fetc%2Fpasswd",
  "type": "ZAP-10027"
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
  "detail": "ADMIN",
  "url": "https://gpt-3-3dd1e.firebaseapp.com/?doc=..%252f..%252f..%252fetc%2Fpasswd",
  "type": "ZAP-10027"
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
  "detail": "ADMIN",
  "url": "https://gpt-3-3dd1e.firebaseapp.com/?page=..%2F..%2F..%2Fetc%2Fpasswd",
  "type": "ZAP-10027"
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
  "detail": "ADMIN",
  "url": "https://gpt-3-3dd1e.firebaseapp.com/?page=..%5C..%5C..%5Cwindows%5Cwin.ini",
  "type": "ZAP-10027"
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
  "detail": "ADMIN",
  "url": "https://gpt-3-3dd1e.firebaseapp.com/?page=....%2F%2F....%2F%2F....%2F%2Fetc%2Fpasswd",
  "type": "ZAP-10027"
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
  "detail": "ADMIN",
  "url": "https://gpt-3-3dd1e.firebaseapp.com/?page=..%252f..%252f..%252fetc%2Fpasswd",
  "type": "ZAP-10027"
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
  "detail": "ADMIN",
  "url": "https://gpt-3-3dd1e.firebaseapp.com/?template=..%2F..%2F..%2Fetc%2Fpasswd",
  "type": "ZAP-10027"
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
  "detail": "ADMIN",
  "url": "https://gpt-3-3dd1e.firebaseapp.com/?template=..%5C..%5C..%5Cwindows%5Cwin.ini",
  "type": "ZAP-10027"
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
  "detail": "ADMIN",
  "url": "https://gpt-3-3dd1e.firebaseapp.com/?template=....%2F%2F....%2F%2F....%2F%2Fetc%2Fpasswd",
  "type": "ZAP-10027"
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
  "detail": "ADMIN",
  "url": "https://gpt-3-3dd1e.firebaseapp.com/?template=..%252f..%252f..%252fetc%2Fpasswd",
  "type": "ZAP-10027"
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
  "detail": "ADMIN",
  "url": "https://gpt-3-3dd1e.firebaseapp.com/?include=..%2F..%2F..%2Fetc%2Fpasswd",
  "type": "ZAP-10027"
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
  "detail": "ADMIN",
  "url": "https://gpt-3-3dd1e.firebaseapp.com/?include=..%5C..%5C..%5Cwindows%5Cwin.ini",
  "type": "ZAP-10027"
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
  "detail": "ADMIN",
  "url": "https://gpt-3-3dd1e.firebaseapp.com/?include=....%2F%2F....%2F%2F....%2F%2Fetc%2Fpasswd",
  "type": "ZAP-10027"
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
  "detail": "ADMIN",
  "url": "https://gpt-3-3dd1e.firebaseapp.com/?include=..%252f..%252f..%252fetc%2Fpasswd",
  "type": "ZAP-10027"
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
  "detail": "ADMIN",
  "url": "https://gpt-3-3dd1e.firebaseapp.com/?dir=..%2F..%2F..%2Fetc%2Fpasswd",
  "type": "ZAP-10027"
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
  "detail": "ADMIN",
  "url": "https://gpt-3-3dd1e.firebaseapp.com/?dir=..%5C..%5C..%5Cwindows%5Cwin.ini",
  "type": "ZAP-10027"
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
  "detail": "ADMIN",
  "url": "https://gpt-3-3dd1e.firebaseapp.com/?dir=....%2F%2F....%2F%2F....%2F%2Fetc%2Fpasswd",
  "type": "ZAP-10027"
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
  "detail": "ADMIN",
  "url": "https://gpt-3-3dd1e.firebaseapp.com/?dir=..%252f..%252f..%252fetc%2Fpasswd",
  "type": "ZAP-10027"
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
  "detail": "ADMIN",
  "url": "https://gpt-3-3dd1e.firebaseapp.com/?folder=..%2F..%2F..%2Fetc%2Fpasswd",
  "type": "ZAP-10027"
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
  "detail": "ADMIN",
  "url": "https://gpt-3-3dd1e.firebaseapp.com/?folder=..%5C..%5C..%5Cwindows%5Cwin.ini",
  "type": "ZAP-10027"
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
  "detail": "ADMIN",
  "url": "https://gpt-3-3dd1e.firebaseapp.com/?folder=....%2F%2F....%2F%2F....%2F%2Fetc%2Fpasswd",
  "type": "ZAP-10027"
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
  "detail": "ADMIN",
  "url": "https://gpt-3-3dd1e.firebaseapp.com/?folder=..%252f..%252f..%252fetc%2Fpasswd",
  "type": "ZAP-10027"
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
  "detail": "ADMIN",
  "url": "https://gpt-3-3dd1e.firebaseapp.com/?load=..%2F..%2F..%2Fetc%2Fpasswd",
  "type": "ZAP-10027"
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
  "detail": "ADMIN",
  "url": "https://gpt-3-3dd1e.firebaseapp.com/?load=..%5C..%5C..%5Cwindows%5Cwin.ini",
  "type": "ZAP-10027"
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
  "detail": "ADMIN",
  "url": "https://gpt-3-3dd1e.firebaseapp.com/?load=....%2F%2F....%2F%2F....%2F%2Fetc%2Fpasswd",
  "type": "ZAP-10027"
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
  "detail": "ADMIN",
  "url": "https://gpt-3-3dd1e.firebaseapp.com/?load=..%252f..%252f..%252fetc%2Fpasswd",
  "type": "ZAP-10027"
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
  "detail": "ADMIN",
  "url": "https://gpt-3-3dd1e.firebaseapp.com/?read=..%2F..%2F..%2Fetc%2Fpasswd",
  "type": "ZAP-10027"
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
  "detail": "ADMIN",
  "url": "https://gpt-3-3dd1e.firebaseapp.com/?read=..%5C..%5C..%5Cwindows%5Cwin.ini",
  "type": "ZAP-10027"
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
  "detail": "ADMIN",
  "url": "https://gpt-3-3dd1e.firebaseapp.com/?read=....%2F%2F....%2F%2F....%2F%2Fetc%2Fpasswd",
  "type": "ZAP-10027"
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
  "detail": "ADMIN",
  "url": "https://gpt-3-3dd1e.firebaseapp.com/?read=..%252f..%252f..%252fetc%2Fpasswd",
  "type": "ZAP-10027"
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
  "detail": "admin",
  "url": "https://gpt-3-3dd1e.firebaseapp.com/admin.html",
  "type": "ZAP-10027"
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
  "detail": "ADMIN",
  "url": "https://gpt-3-3dd1e.firebaseapp.com/?wsdl",
  "type": "ZAP-10027"
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
  "detail": "ADMIN",
  "url": "https://gpt-3-3dd1e.firebaseapp.com/?url=http%3A%2F%2F127.0.0.1%3A22",
  "type": "ZAP-10027"
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
  "detail": "ADMIN",
  "url": "https://gpt-3-3dd1e.firebaseapp.com/?url=http%3A%2F%2F169.254.169.254%2Flatest%2Fmeta-data%2F",
  "type": "ZAP-10027"
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
  "detail": "ADMIN",
  "url": "https://gpt-3-3dd1e.firebaseapp.com/?uri=http%3A%2F%2F127.0.0.1%3A22",
  "type": "ZAP-10027"
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
  "detail": "ADMIN",
  "url": "https://gpt-3-3dd1e.firebaseapp.com/?uri=http%3A%2F%2F169.254.169.254%2Flatest%2Fmeta-data%2F",
  "type": "ZAP-10027"
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
  "detail": "ADMIN",
  "url": "https://gpt-3-3dd1e.firebaseapp.com/?path=http%3A%2F%2F127.0.0.1%3A22",
  "type": "ZAP-10027"
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
  "detail": "ADMIN",
  "url": "https://gpt-3-3dd1e.firebaseapp.com/?path=http%3A%2F%2F169.254.169.254%2Flatest%2Fmeta-data%2F",
  "type": "ZAP-10027"
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
  "detail": "ADMIN",
  "url": "https://gpt-3-3dd1e.firebaseapp.com/?src=http%3A%2F%2F127.0.0.1%3A22",
  "type": "ZAP-10027"
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
  "detail": "ADMIN",
  "url": "https://gpt-3-3dd1e.firebaseapp.com/?src=http%3A%2F%2F169.254.169.254%2Flatest%2Fmeta-data%2F",
  "type": "ZAP-10027"
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
  "detail": "ADMIN",
  "url": "https://gpt-3-3dd1e.firebaseapp.com/?source=http%3A%2F%2F127.0.0.1%3A22",
  "type": "ZAP-10027"
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
  "detail": "ADMIN",
  "url": "https://gpt-3-3dd1e.firebaseapp.com/?source=http%3A%2F%2F169.254.169.254%2Flatest%2Fmeta-data%2F",
  "type": "ZAP-10027"
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
  "detail": "ADMIN",
  "url": "https://gpt-3-3dd1e.firebaseapp.com/?link=http%3A%2F%2F127.0.0.1%3A22",
  "type": "ZAP-10027"
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
  "detail": "ADMIN",
  "url": "https://gpt-3-3dd1e.firebaseapp.com/?link=http%3A%2F%2F169.254.169.254%2Flatest%2Fmeta-data%2F",
  "type": "ZAP-10027"
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
  "detail": "ADMIN",
  "url": "https://gpt-3-3dd1e.firebaseapp.com/?href=http%3A%2F%2F127.0.0.1%3A22",
  "type": "ZAP-10027"
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
  "detail": "ADMIN",
  "url": "https://gpt-3-3dd1e.firebaseapp.com/?href=http%3A%2F%2F169.254.169.254%2Flatest%2Fmeta-data%2F",
  "type": "ZAP-10027"
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
  "detail": "ADMIN",
  "url": "https://gpt-3-3dd1e.firebaseapp.com/?dest=http%3A%2F%2F127.0.0.1%3A22",
  "type": "ZAP-10027"
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
  "detail": "ADMIN",
  "url": "https://gpt-3-3dd1e.firebaseapp.com/?dest=http%3A%2F%2F169.254.169.254%2Flatest%2Fmeta-data%2F",
  "type": "ZAP-10027"
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
  "detail": "ADMIN",
  "url": "https://gpt-3-3dd1e.firebaseapp.com/?redirect=http%3A%2F%2F127.0.0.1%3A22",
  "type": "ZAP-10027"
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
  "detail": "ADMIN",
  "url": "https://gpt-3-3dd1e.firebaseapp.com/?redirect=http%3A%2F%2F169.254.169.254%2Flatest%2Fmeta-data%2F",
  "type": "ZAP-10027"
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
  "detail": "ADMIN",
  "url": "https://gpt-3-3dd1e.firebaseapp.com/?site=http%3A%2F%2F127.0.0.1%3A22",
  "type": "ZAP-10027"
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
  "detail": "ADMIN",
  "url": "https://gpt-3-3dd1e.firebaseapp.com/?site=http%3A%2F%2F169.254.169.254%2Flatest%2Fmeta-data%2F",
  "type": "ZAP-10027"
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
  "detail": "ADMIN",
  "url": "https://gpt-3-3dd1e.firebaseapp.com/?html=http%3A%2F%2F127.0.0.1%3A22",
  "type": "ZAP-10027"
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
  "detail": "ADMIN",
  "url": "https://gpt-3-3dd1e.firebaseapp.com/?html=http%3A%2F%2F169.254.169.254%2Flatest%2Fmeta-data%2F",
  "type": "ZAP-10027"
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
  "detail": "ADMIN",
  "url": "https://gpt-3-3dd1e.firebaseapp.com/?feed=http%3A%2F%2F127.0.0.1%3A22",
  "type": "ZAP-10027"
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
  "detail": "ADMIN",
  "url": "https://gpt-3-3dd1e.firebaseapp.com/?feed=http%3A%2F%2F169.254.169.254%2Flatest%2Fmeta-data%2F",
  "type": "ZAP-10027"
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
  "detail": "ADMIN",
  "url": "https://gpt-3-3dd1e.firebaseapp.com/?host=http%3A%2F%2F127.0.0.1%3A22",
  "type": "ZAP-10027"
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
  "detail": "ADMIN",
  "url": "https://gpt-3-3dd1e.firebaseapp.com/?host=http%3A%2F%2F169.254.169.254%2Flatest%2Fmeta-data%2F",
  "type": "ZAP-10027"
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
  "detail": "ADMIN",
  "url": "https://gpt-3-3dd1e.firebaseapp.com/?domain=http%3A%2F%2F127.0.0.1%3A22",
  "type": "ZAP-10027"
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
  "detail": "ADMIN",
  "url": "https://gpt-3-3dd1e.firebaseapp.com/?domain=http%3A%2F%2F169.254.169.254%2Flatest%2Fmeta-data%2F",
  "type": "ZAP-10027"
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
  "detail": "ADMIN",
  "url": "https://gpt-3-3dd1e.firebaseapp.com/?__proto__%5Bpolluted%5D=true",
  "type": "ZAP-10027"
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
  "detail": "ADMIN",
  "url": "https://gpt-3-3dd1e.firebaseapp.com/?constructor%5Bprototype%5D%5Bpolluted%5D=true",
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
  "url": "https://gpt-3-3dd1e.firebaseapp.com/",
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
  "url": "https://gpt-3-3dd1e.firebaseapp.com/?file=..%2F..%2F..%2Fetc%2Fpasswd",
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
  "url": "https://gpt-3-3dd1e.firebaseapp.com/?file=..%5C..%5C..%5Cwindows%5Cwin.ini",
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
  "url": "https://gpt-3-3dd1e.firebaseapp.com/?file=....%2F%2F....%2F%2F....%2F%2Fetc%2Fpasswd",
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
  "url": "https://gpt-3-3dd1e.firebaseapp.com/?file=..%252f..%252f..%252fetc%2Fpasswd",
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
  "url": "https://gpt-3-3dd1e.firebaseapp.com/?path=..%2F..%2F..%2Fetc%2Fpasswd",
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
  "url": "https://gpt-3-3dd1e.firebaseapp.com/?path=..%5C..%5C..%5Cwindows%5Cwin.ini",
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
  "url": "https://gpt-3-3dd1e.firebaseapp.com/?path=....%2F%2F....%2F%2F....%2F%2Fetc%2Fpasswd",
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
  "url": "https://gpt-3-3dd1e.firebaseapp.com/?path=..%252f..%252f..%252fetc%2Fpasswd",
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
  "url": "https://gpt-3-3dd1e.firebaseapp.com/?filepath=..%2F..%2F..%2Fetc%2Fpasswd",
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
  "url": "https://gpt-3-3dd1e.firebaseapp.com/?filepath=..%5C..%5C..%5Cwindows%5Cwin.ini",
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
  "url": "https://gpt-3-3dd1e.firebaseapp.com/?filepath=....%2F%2F....%2F%2F....%2F%2Fetc%2Fpasswd",
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
  "url": "https://gpt-3-3dd1e.firebaseapp.com/?filepath=..%252f..%252f..%252fetc%2Fpasswd",
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
  "url": "https://gpt-3-3dd1e.firebaseapp.com/?document=..%2F..%2F..%2Fetc%2Fpasswd",
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
  "url": "https://gpt-3-3dd1e.firebaseapp.com/?document=..%5C..%5C..%5Cwindows%5Cwin.ini",
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
  "url": "https://gpt-3-3dd1e.firebaseapp.com/?document=....%2F%2F....%2F%2F....%2F%2Fetc%2Fpasswd",
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
  "url": "https://gpt-3-3dd1e.firebaseapp.com/?document=..%252f..%252f..%252fetc%2Fpasswd",
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
  "url": "https://gpt-3-3dd1e.firebaseapp.com/?doc=..%2F..%2F..%2Fetc%2Fpasswd",
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
  "url": "https://gpt-3-3dd1e.firebaseapp.com/?doc=..%5C..%5C..%5Cwindows%5Cwin.ini",
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
  "url": "https://gpt-3-3dd1e.firebaseapp.com/?doc=....%2F%2F....%2F%2F....%2F%2Fetc%2Fpasswd",
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
  "url": "https://gpt-3-3dd1e.firebaseapp.com/?doc=..%252f..%252f..%252fetc%2Fpasswd",
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
  "url": "https://gpt-3-3dd1e.firebaseapp.com/?page=..%2F..%2F..%2Fetc%2Fpasswd",
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
  "url": "https://gpt-3-3dd1e.firebaseapp.com/?page=..%5C..%5C..%5Cwindows%5Cwin.ini",
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
  "url": "https://gpt-3-3dd1e.firebaseapp.com/?page=....%2F%2F....%2F%2F....%2F%2Fetc%2Fpasswd",
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
  "url": "https://gpt-3-3dd1e.firebaseapp.com/?page=..%252f..%252f..%252fetc%2Fpasswd",
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
  "url": "https://gpt-3-3dd1e.firebaseapp.com/?template=..%2F..%2F..%2Fetc%2Fpasswd",
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
  "url": "https://gpt-3-3dd1e.firebaseapp.com/?template=..%5C..%5C..%5Cwindows%5Cwin.ini",
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
  "url": "https://gpt-3-3dd1e.firebaseapp.com/?template=....%2F%2F....%2F%2F....%2F%2Fetc%2Fpasswd",
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
  "url": "https://gpt-3-3dd1e.firebaseapp.com/?template=..%252f..%252f..%252fetc%2Fpasswd",
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
  "url": "https://gpt-3-3dd1e.firebaseapp.com/?include=..%2F..%2F..%2Fetc%2Fpasswd",
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
  "url": "https://gpt-3-3dd1e.firebaseapp.com/?include=..%5C..%5C..%5Cwindows%5Cwin.ini",
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
  "url": "https://gpt-3-3dd1e.firebaseapp.com/?include=....%2F%2F....%2F%2F....%2F%2Fetc%2Fpasswd",
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
  "url": "https://gpt-3-3dd1e.firebaseapp.com/?include=..%252f..%252f..%252fetc%2Fpasswd",
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
  "url": "https://gpt-3-3dd1e.firebaseapp.com/?dir=..%2F..%2F..%2Fetc%2Fpasswd",
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
  "url": "https://gpt-3-3dd1e.firebaseapp.com/?dir=..%5C..%5C..%5Cwindows%5Cwin.ini",
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
  "url": "https://gpt-3-3dd1e.firebaseapp.com/?dir=....%2F%2F....%2F%2F....%2F%2Fetc%2Fpasswd",
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
  "url": "https://gpt-3-3dd1e.firebaseapp.com/?dir=..%252f..%252f..%252fetc%2Fpasswd",
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
  "url": "https://gpt-3-3dd1e.firebaseapp.com/?folder=..%2F..%2F..%2Fetc%2Fpasswd",
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
  "url": "https://gpt-3-3dd1e.firebaseapp.com/?folder=..%5C..%5C..%5Cwindows%5Cwin.ini",
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
  "url": "https://gpt-3-3dd1e.firebaseapp.com/?folder=....%2F%2F....%2F%2F....%2F%2Fetc%2Fpasswd",
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
  "url": "https://gpt-3-3dd1e.firebaseapp.com/?folder=..%252f..%252f..%252fetc%2Fpasswd",
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
  "url": "https://gpt-3-3dd1e.firebaseapp.com/?load=..%2F..%2F..%2Fetc%2Fpasswd",
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
  "url": "https://gpt-3-3dd1e.firebaseapp.com/?load=..%5C..%5C..%5Cwindows%5Cwin.ini",
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
  "url": "https://gpt-3-3dd1e.firebaseapp.com/?load=....%2F%2F....%2F%2F....%2F%2Fetc%2Fpasswd",
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
  "url": "https://gpt-3-3dd1e.firebaseapp.com/?load=..%252f..%252f..%252fetc%2Fpasswd",
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
  "url": "https://gpt-3-3dd1e.firebaseapp.com/?read=..%2F..%2F..%2Fetc%2Fpasswd",
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
  "url": "https://gpt-3-3dd1e.firebaseapp.com/?read=..%5C..%5C..%5Cwindows%5Cwin.ini",
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
  "url": "https://gpt-3-3dd1e.firebaseapp.com/?read=....%2F%2F....%2F%2F....%2F%2Fetc%2Fpasswd",
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
  "url": "https://gpt-3-3dd1e.firebaseapp.com/?read=..%252f..%252f..%252fetc%2Fpasswd",
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
  "url": "https://gpt-3-3dd1e.firebaseapp.com/admin.html",
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
  "url": "https://gpt-3-3dd1e.firebaseapp.com/?wsdl",
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
  "url": "https://gpt-3-3dd1e.firebaseapp.com/?url=http%3A%2F%2F127.0.0.1%3A22",
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
  "url": "https://gpt-3-3dd1e.firebaseapp.com/?url=http%3A%2F%2F169.254.169.254%2Flatest%2Fmeta-data%2F",
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
  "url": "https://gpt-3-3dd1e.firebaseapp.com/?uri=http%3A%2F%2F127.0.0.1%3A22",
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
  "url": "https://gpt-3-3dd1e.firebaseapp.com/?uri=http%3A%2F%2F169.254.169.254%2Flatest%2Fmeta-data%2F",
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
  "url": "https://gpt-3-3dd1e.firebaseapp.com/?path=http%3A%2F%2F127.0.0.1%3A22",
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
  "url": "https://gpt-3-3dd1e.firebaseapp.com/?path=http%3A%2F%2F169.254.169.254%2Flatest%2Fmeta-data%2F",
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
  "url": "https://gpt-3-3dd1e.firebaseapp.com/?src=http%3A%2F%2F127.0.0.1%3A22",
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
  "url": "https://gpt-3-3dd1e.firebaseapp.com/?src=http%3A%2F%2F169.254.169.254%2Flatest%2Fmeta-data%2F",
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
  "url": "https://gpt-3-3dd1e.firebaseapp.com/?source=http%3A%2F%2F127.0.0.1%3A22",
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
  "url": "https://gpt-3-3dd1e.firebaseapp.com/?source=http%3A%2F%2F169.254.169.254%2Flatest%2Fmeta-data%2F",
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
  "url": "https://gpt-3-3dd1e.firebaseapp.com/?link=http%3A%2F%2F127.0.0.1%3A22",
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
  "url": "https://gpt-3-3dd1e.firebaseapp.com/?link=http%3A%2F%2F169.254.169.254%2Flatest%2Fmeta-data%2F",
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
  "url": "https://gpt-3-3dd1e.firebaseapp.com/?href=http%3A%2F%2F127.0.0.1%3A22",
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
  "url": "https://gpt-3-3dd1e.firebaseapp.com/?href=http%3A%2F%2F169.254.169.254%2Flatest%2Fmeta-data%2F",
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
  "url": "https://gpt-3-3dd1e.firebaseapp.com/?dest=http%3A%2F%2F127.0.0.1%3A22",
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
  "url": "https://gpt-3-3dd1e.firebaseapp.com/?dest=http%3A%2F%2F169.254.169.254%2Flatest%2Fmeta-data%2F",
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
  "url": "https://gpt-3-3dd1e.firebaseapp.com/?redirect=http%3A%2F%2F127.0.0.1%3A22",
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
  "url": "https://gpt-3-3dd1e.firebaseapp.com/?redirect=http%3A%2F%2F169.254.169.254%2Flatest%2Fmeta-data%2F",
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
  "url": "https://gpt-3-3dd1e.firebaseapp.com/?site=http%3A%2F%2F127.0.0.1%3A22",
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
  "url": "https://gpt-3-3dd1e.firebaseapp.com/?site=http%3A%2F%2F169.254.169.254%2Flatest%2Fmeta-data%2F",
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
  "url": "https://gpt-3-3dd1e.firebaseapp.com/?html=http%3A%2F%2F127.0.0.1%3A22",
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
  "url": "https://gpt-3-3dd1e.firebaseapp.com/?html=http%3A%2F%2F169.254.169.254%2Flatest%2Fmeta-data%2F",
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
  "url": "https://gpt-3-3dd1e.firebaseapp.com/?feed=http%3A%2F%2F127.0.0.1%3A22",
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
  "url": "https://gpt-3-3dd1e.firebaseapp.com/?feed=http%3A%2F%2F169.254.169.254%2Flatest%2Fmeta-data%2F",
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
  "url": "https://gpt-3-3dd1e.firebaseapp.com/?host=http%3A%2F%2F127.0.0.1%3A22",
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
  "url": "https://gpt-3-3dd1e.firebaseapp.com/?host=http%3A%2F%2F169.254.169.254%2Flatest%2Fmeta-data%2F",
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
  "url": "https://gpt-3-3dd1e.firebaseapp.com/?domain=http%3A%2F%2F127.0.0.1%3A22",
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
  "url": "https://gpt-3-3dd1e.firebaseapp.com/?domain=http%3A%2F%2F169.254.169.254%2Flatest%2Fmeta-data%2F",
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
  "url": "https://gpt-3-3dd1e.firebaseapp.com/?__proto__%5Bpolluted%5D=true",
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
  "url": "https://gpt-3-3dd1e.firebaseapp.com/?constructor%5Bprototype%5D%5Bpolluted%5D=true",
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
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js\"></script>",
  "url": "https://gpt-3-3dd1e.firebaseapp.com/",
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
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js\"></script>",
  "url": "https://gpt-3-3dd1e.firebaseapp.com/?file=..%2F..%2F..%2Fetc%2Fpasswd",
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
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js\"></script>",
  "url": "https://gpt-3-3dd1e.firebaseapp.com/?file=..%5C..%5C..%5Cwindows%5Cwin.ini",
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
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js\"></script>",
  "url": "https://gpt-3-3dd1e.firebaseapp.com/?file=....%2F%2F....%2F%2F....%2F%2Fetc%2Fpasswd",
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
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js\"></script>",
  "url": "https://gpt-3-3dd1e.firebaseapp.com/?file=..%252f..%252f..%252fetc%2Fpasswd",
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
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js\"></script>",
  "url": "https://gpt-3-3dd1e.firebaseapp.com/?path=..%2F..%2F..%2Fetc%2Fpasswd",
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
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js\"></script>",
  "url": "https://gpt-3-3dd1e.firebaseapp.com/?path=..%5C..%5C..%5Cwindows%5Cwin.ini",
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
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js\"></script>",
  "url": "https://gpt-3-3dd1e.firebaseapp.com/?path=....%2F%2F....%2F%2F....%2F%2Fetc%2Fpasswd",
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
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js\"></script>",
  "url": "https://gpt-3-3dd1e.firebaseapp.com/?path=..%252f..%252f..%252fetc%2Fpasswd",
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
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js\"></script>",
  "url": "https://gpt-3-3dd1e.firebaseapp.com/?filepath=..%2F..%2F..%2Fetc%2Fpasswd",
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
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js\"></script>",
  "url": "https://gpt-3-3dd1e.firebaseapp.com/?filepath=..%5C..%5C..%5Cwindows%5Cwin.ini",
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
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js\"></script>",
  "url": "https://gpt-3-3dd1e.firebaseapp.com/?filepath=....%2F%2F....%2F%2F....%2F%2Fetc%2Fpasswd",
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
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js\"></script>",
  "url": "https://gpt-3-3dd1e.firebaseapp.com/?filepath=..%252f..%252f..%252fetc%2Fpasswd",
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
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js\"></script>",
  "url": "https://gpt-3-3dd1e.firebaseapp.com/?document=..%2F..%2F..%2Fetc%2Fpasswd",
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
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js\"></script>",
  "url": "https://gpt-3-3dd1e.firebaseapp.com/?document=..%5C..%5C..%5Cwindows%5Cwin.ini",
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
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js\"></script>",
  "url": "https://gpt-3-3dd1e.firebaseapp.com/?document=....%2F%2F....%2F%2F....%2F%2Fetc%2Fpasswd",
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
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js\"></script>",
  "url": "https://gpt-3-3dd1e.firebaseapp.com/?document=..%252f..%252f..%252fetc%2Fpasswd",
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
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js\"></script>",
  "url": "https://gpt-3-3dd1e.firebaseapp.com/?doc=..%2F..%2F..%2Fetc%2Fpasswd",
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
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js\"></script>",
  "url": "https://gpt-3-3dd1e.firebaseapp.com/?doc=..%5C..%5C..%5Cwindows%5Cwin.ini",
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
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js\"></script>",
  "url": "https://gpt-3-3dd1e.firebaseapp.com/?doc=....%2F%2F....%2F%2F....%2F%2Fetc%2Fpasswd",
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
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js\"></script>",
  "url": "https://gpt-3-3dd1e.firebaseapp.com/?doc=..%252f..%252f..%252fetc%2Fpasswd",
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
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js\"></script>",
  "url": "https://gpt-3-3dd1e.firebaseapp.com/?page=..%2F..%2F..%2Fetc%2Fpasswd",
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
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js\"></script>",
  "url": "https://gpt-3-3dd1e.firebaseapp.com/?page=..%5C..%5C..%5Cwindows%5Cwin.ini",
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
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js\"></script>",
  "url": "https://gpt-3-3dd1e.firebaseapp.com/?page=....%2F%2F....%2F%2F....%2F%2Fetc%2Fpasswd",
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
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js\"></script>",
  "url": "https://gpt-3-3dd1e.firebaseapp.com/?page=..%252f..%252f..%252fetc%2Fpasswd",
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
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js\"></script>",
  "url": "https://gpt-3-3dd1e.firebaseapp.com/?template=..%2F..%2F..%2Fetc%2Fpasswd",
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
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js\"></script>",
  "url": "https://gpt-3-3dd1e.firebaseapp.com/?template=..%5C..%5C..%5Cwindows%5Cwin.ini",
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
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js\"></script>",
  "url": "https://gpt-3-3dd1e.firebaseapp.com/?template=....%2F%2F....%2F%2F....%2F%2Fetc%2Fpasswd",
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
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js\"></script>",
  "url": "https://gpt-3-3dd1e.firebaseapp.com/?template=..%252f..%252f..%252fetc%2Fpasswd",
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
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js\"></script>",
  "url": "https://gpt-3-3dd1e.firebaseapp.com/?include=..%2F..%2F..%2Fetc%2Fpasswd",
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
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js\"></script>",
  "url": "https://gpt-3-3dd1e.firebaseapp.com/?include=..%5C..%5C..%5Cwindows%5Cwin.ini",
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
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js\"></script>",
  "url": "https://gpt-3-3dd1e.firebaseapp.com/?include=....%2F%2F....%2F%2F....%2F%2Fetc%2Fpasswd",
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
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js\"></script>",
  "url": "https://gpt-3-3dd1e.firebaseapp.com/?include=..%252f..%252f..%252fetc%2Fpasswd",
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
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js\"></script>",
  "url": "https://gpt-3-3dd1e.firebaseapp.com/?dir=..%2F..%2F..%2Fetc%2Fpasswd",
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
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js\"></script>",
  "url": "https://gpt-3-3dd1e.firebaseapp.com/?dir=..%5C..%5C..%5Cwindows%5Cwin.ini",
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
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js\"></script>",
  "url": "https://gpt-3-3dd1e.firebaseapp.com/?dir=....%2F%2F....%2F%2F....%2F%2Fetc%2Fpasswd",
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
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js\"></script>",
  "url": "https://gpt-3-3dd1e.firebaseapp.com/?dir=..%252f..%252f..%252fetc%2Fpasswd",
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
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js\"></script>",
  "url": "https://gpt-3-3dd1e.firebaseapp.com/?folder=..%2F..%2F..%2Fetc%2Fpasswd",
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
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js\"></script>",
  "url": "https://gpt-3-3dd1e.firebaseapp.com/?folder=..%5C..%5C..%5Cwindows%5Cwin.ini",
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
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js\"></script>",
  "url": "https://gpt-3-3dd1e.firebaseapp.com/?folder=....%2F%2F....%2F%2F....%2F%2Fetc%2Fpasswd",
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
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js\"></script>",
  "url": "https://gpt-3-3dd1e.firebaseapp.com/?folder=..%252f..%252f..%252fetc%2Fpasswd",
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
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js\"></script>",
  "url": "https://gpt-3-3dd1e.firebaseapp.com/?load=..%2F..%2F..%2Fetc%2Fpasswd",
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
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js\"></script>",
  "url": "https://gpt-3-3dd1e.firebaseapp.com/?load=..%5C..%5C..%5Cwindows%5Cwin.ini",
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
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js\"></script>",
  "url": "https://gpt-3-3dd1e.firebaseapp.com/?load=....%2F%2F....%2F%2F....%2F%2Fetc%2Fpasswd",
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
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js\"></script>",
  "url": "https://gpt-3-3dd1e.firebaseapp.com/?load=..%252f..%252f..%252fetc%2Fpasswd",
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
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js\"></script>",
  "url": "https://gpt-3-3dd1e.firebaseapp.com/?read=..%2F..%2F..%2Fetc%2Fpasswd",
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
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js\"></script>",
  "url": "https://gpt-3-3dd1e.firebaseapp.com/?read=..%5C..%5C..%5Cwindows%5Cwin.ini",
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
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js\"></script>",
  "url": "https://gpt-3-3dd1e.firebaseapp.com/?read=....%2F%2F....%2F%2F....%2F%2Fetc%2Fpasswd",
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
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js\"></script>",
  "url": "https://gpt-3-3dd1e.firebaseapp.com/?read=..%252f..%252f..%252fetc%2Fpasswd",
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
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js\"></script>",
  "url": "https://gpt-3-3dd1e.firebaseapp.com/?wsdl",
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
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js\"></script>",
  "url": "https://gpt-3-3dd1e.firebaseapp.com/?url=http%3A%2F%2F127.0.0.1%3A22",
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
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js\"></script>",
  "url": "https://gpt-3-3dd1e.firebaseapp.com/?url=http%3A%2F%2F169.254.169.254%2Flatest%2Fmeta-data%2F",
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
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js\"></script>",
  "url": "https://gpt-3-3dd1e.firebaseapp.com/?uri=http%3A%2F%2F127.0.0.1%3A22",
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
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js\"></script>",
  "url": "https://gpt-3-3dd1e.firebaseapp.com/?uri=http%3A%2F%2F169.254.169.254%2Flatest%2Fmeta-data%2F",
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
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js\"></script>",
  "url": "https://gpt-3-3dd1e.firebaseapp.com/?path=http%3A%2F%2F127.0.0.1%3A22",
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
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js\"></script>",
  "url": "https://gpt-3-3dd1e.firebaseapp.com/?path=http%3A%2F%2F169.254.169.254%2Flatest%2Fmeta-data%2F",
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
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js\"></script>",
  "url": "https://gpt-3-3dd1e.firebaseapp.com/?src=http%3A%2F%2F127.0.0.1%3A22",
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
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js\"></script>",
  "url": "https://gpt-3-3dd1e.firebaseapp.com/?src=http%3A%2F%2F169.254.169.254%2Flatest%2Fmeta-data%2F",
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
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js\"></script>",
  "url": "https://gpt-3-3dd1e.firebaseapp.com/?source=http%3A%2F%2F127.0.0.1%3A22",
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
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js\"></script>",
  "url": "https://gpt-3-3dd1e.firebaseapp.com/?source=http%3A%2F%2F169.254.169.254%2Flatest%2Fmeta-data%2F",
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
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js\"></script>",
  "url": "https://gpt-3-3dd1e.firebaseapp.com/?link=http%3A%2F%2F127.0.0.1%3A22",
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
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js\"></script>",
  "url": "https://gpt-3-3dd1e.firebaseapp.com/?link=http%3A%2F%2F169.254.169.254%2Flatest%2Fmeta-data%2F",
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
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js\"></script>",
  "url": "https://gpt-3-3dd1e.firebaseapp.com/?href=http%3A%2F%2F127.0.0.1%3A22",
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
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js\"></script>",
  "url": "https://gpt-3-3dd1e.firebaseapp.com/?href=http%3A%2F%2F169.254.169.254%2Flatest%2Fmeta-data%2F",
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
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js\"></script>",
  "url": "https://gpt-3-3dd1e.firebaseapp.com/?dest=http%3A%2F%2F127.0.0.1%3A22",
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
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js\"></script>",
  "url": "https://gpt-3-3dd1e.firebaseapp.com/?dest=http%3A%2F%2F169.254.169.254%2Flatest%2Fmeta-data%2F",
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
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js\"></script>",
  "url": "https://gpt-3-3dd1e.firebaseapp.com/?redirect=http%3A%2F%2F127.0.0.1%3A22",
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
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js\"></script>",
  "url": "https://gpt-3-3dd1e.firebaseapp.com/?redirect=http%3A%2F%2F169.254.169.254%2Flatest%2Fmeta-data%2F",
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
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js\"></script>",
  "url": "https://gpt-3-3dd1e.firebaseapp.com/?site=http%3A%2F%2F127.0.0.1%3A22",
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
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js\"></script>",
  "url": "https://gpt-3-3dd1e.firebaseapp.com/?site=http%3A%2F%2F169.254.169.254%2Flatest%2Fmeta-data%2F",
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
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js\"></script>",
  "url": "https://gpt-3-3dd1e.firebaseapp.com/?html=http%3A%2F%2F127.0.0.1%3A22",
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
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js\"></script>",
  "url": "https://gpt-3-3dd1e.firebaseapp.com/?html=http%3A%2F%2F169.254.169.254%2Flatest%2Fmeta-data%2F",
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
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js\"></script>",
  "url": "https://gpt-3-3dd1e.firebaseapp.com/?feed=http%3A%2F%2F127.0.0.1%3A22",
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
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js\"></script>",
  "url": "https://gpt-3-3dd1e.firebaseapp.com/?feed=http%3A%2F%2F169.254.169.254%2Flatest%2Fmeta-data%2F",
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
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js\"></script>",
  "url": "https://gpt-3-3dd1e.firebaseapp.com/?host=http%3A%2F%2F127.0.0.1%3A22",
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
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js\"></script>",
  "url": "https://gpt-3-3dd1e.firebaseapp.com/?host=http%3A%2F%2F169.254.169.254%2Flatest%2Fmeta-data%2F",
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
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js\"></script>",
  "url": "https://gpt-3-3dd1e.firebaseapp.com/?domain=http%3A%2F%2F127.0.0.1%3A22",
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
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js\"></script>",
  "url": "https://gpt-3-3dd1e.firebaseapp.com/?domain=http%3A%2F%2F169.254.169.254%2Flatest%2Fmeta-data%2F",
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
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js\"></script>",
  "url": "https://gpt-3-3dd1e.firebaseapp.com/?__proto__%5Bpolluted%5D=true",
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
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js\"></script>",
  "url": "https://gpt-3-3dd1e.firebaseapp.com/?constructor%5Bprototype%5D%5Bpolluted%5D=true",
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
  "url": "https://gpt-3-3dd1e.firebaseapp.com/"
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
  "url": "https://gpt-3-3dd1e.firebaseapp.com/?file=..%2F..%2F..%2Fetc%2Fpasswd",
  "type": "ZAP-10015"
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
  "url": "https://gpt-3-3dd1e.firebaseapp.com/?file=..%5C..%5C..%5Cwindows%5Cwin.ini",
  "type": "ZAP-10015"
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
  "url": "https://gpt-3-3dd1e.firebaseapp.com/?file=....%2F%2F....%2F%2F....%2F%2Fetc%2Fpasswd",
  "type": "ZAP-10015"
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
  "url": "https://gpt-3-3dd1e.firebaseapp.com/?file=..%252f..%252f..%252fetc%2Fpasswd",
  "type": "ZAP-10015"
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
  "url": "https://gpt-3-3dd1e.firebaseapp.com/?path=..%2F..%2F..%2Fetc%2Fpasswd",
  "type": "ZAP-10015"
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
  "url": "https://gpt-3-3dd1e.firebaseapp.com/?path=..%5C..%5C..%5Cwindows%5Cwin.ini",
  "type": "ZAP-10015"
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
  "url": "https://gpt-3-3dd1e.firebaseapp.com/?path=....%2F%2F....%2F%2F....%2F%2Fetc%2Fpasswd",
  "type": "ZAP-10015"
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
  "url": "https://gpt-3-3dd1e.firebaseapp.com/?path=..%252f..%252f..%252fetc%2Fpasswd",
  "type": "ZAP-10015"
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
  "url": "https://gpt-3-3dd1e.firebaseapp.com/?filepath=..%2F..%2F..%2Fetc%2Fpasswd",
  "type": "ZAP-10015"
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
  "url": "https://gpt-3-3dd1e.firebaseapp.com/?filepath=..%5C..%5C..%5Cwindows%5Cwin.ini",
  "type": "ZAP-10015"
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
  "url": "https://gpt-3-3dd1e.firebaseapp.com/?filepath=....%2F%2F....%2F%2F....%2F%2Fetc%2Fpasswd",
  "type": "ZAP-10015"
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
  "url": "https://gpt-3-3dd1e.firebaseapp.com/?filepath=..%252f..%252f..%252fetc%2Fpasswd",
  "type": "ZAP-10015"
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
  "url": "https://gpt-3-3dd1e.firebaseapp.com/?document=..%2F..%2F..%2Fetc%2Fpasswd",
  "type": "ZAP-10015"
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
  "url": "https://gpt-3-3dd1e.firebaseapp.com/?document=..%5C..%5C..%5Cwindows%5Cwin.ini",
  "type": "ZAP-10015"
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
  "url": "https://gpt-3-3dd1e.firebaseapp.com/?document=....%2F%2F....%2F%2F....%2F%2Fetc%2Fpasswd",
  "type": "ZAP-10015"
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
  "url": "https://gpt-3-3dd1e.firebaseapp.com/?document=..%252f..%252f..%252fetc%2Fpasswd",
  "type": "ZAP-10015"
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
  "url": "https://gpt-3-3dd1e.firebaseapp.com/?doc=..%2F..%2F..%2Fetc%2Fpasswd",
  "type": "ZAP-10015"
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
  "url": "https://gpt-3-3dd1e.firebaseapp.com/?doc=..%5C..%5C..%5Cwindows%5Cwin.ini",
  "type": "ZAP-10015"
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
  "url": "https://gpt-3-3dd1e.firebaseapp.com/?doc=....%2F%2F....%2F%2F....%2F%2Fetc%2Fpasswd",
  "type": "ZAP-10015"
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
  "url": "https://gpt-3-3dd1e.firebaseapp.com/?doc=..%252f..%252f..%252fetc%2Fpasswd",
  "type": "ZAP-10015"
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
  "url": "https://gpt-3-3dd1e.firebaseapp.com/?page=..%2F..%2F..%2Fetc%2Fpasswd",
  "type": "ZAP-10015"
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
  "url": "https://gpt-3-3dd1e.firebaseapp.com/?page=..%5C..%5C..%5Cwindows%5Cwin.ini",
  "type": "ZAP-10015"
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
  "url": "https://gpt-3-3dd1e.firebaseapp.com/?page=....%2F%2F....%2F%2F....%2F%2Fetc%2Fpasswd",
  "type": "ZAP-10015"
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
  "url": "https://gpt-3-3dd1e.firebaseapp.com/?page=..%252f..%252f..%252fetc%2Fpasswd",
  "type": "ZAP-10015"
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
  "url": "https://gpt-3-3dd1e.firebaseapp.com/?template=..%2F..%2F..%2Fetc%2Fpasswd",
  "type": "ZAP-10015"
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
  "url": "https://gpt-3-3dd1e.firebaseapp.com/?template=..%5C..%5C..%5Cwindows%5Cwin.ini",
  "type": "ZAP-10015"
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
  "url": "https://gpt-3-3dd1e.firebaseapp.com/?template=....%2F%2F....%2F%2F....%2F%2Fetc%2Fpasswd",
  "type": "ZAP-10015"
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
  "url": "https://gpt-3-3dd1e.firebaseapp.com/?template=..%252f..%252f..%252fetc%2Fpasswd",
  "type": "ZAP-10015"
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
  "url": "https://gpt-3-3dd1e.firebaseapp.com/?include=..%2F..%2F..%2Fetc%2Fpasswd",
  "type": "ZAP-10015"
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
  "url": "https://gpt-3-3dd1e.firebaseapp.com/?include=..%5C..%5C..%5Cwindows%5Cwin.ini",
  "type": "ZAP-10015"
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
  "url": "https://gpt-3-3dd1e.firebaseapp.com/?include=....%2F%2F....%2F%2F....%2F%2Fetc%2Fpasswd",
  "type": "ZAP-10015"
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
  "url": "https://gpt-3-3dd1e.firebaseapp.com/?include=..%252f..%252f..%252fetc%2Fpasswd",
  "type": "ZAP-10015"
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
  "url": "https://gpt-3-3dd1e.firebaseapp.com/?dir=..%2F..%2F..%2Fetc%2Fpasswd",
  "type": "ZAP-10015"
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
  "url": "https://gpt-3-3dd1e.firebaseapp.com/?dir=..%5C..%5C..%5Cwindows%5Cwin.ini",
  "type": "ZAP-10015"
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
  "url": "https://gpt-3-3dd1e.firebaseapp.com/?dir=....%2F%2F....%2F%2F....%2F%2Fetc%2Fpasswd",
  "type": "ZAP-10015"
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
  "url": "https://gpt-3-3dd1e.firebaseapp.com/?dir=..%252f..%252f..%252fetc%2Fpasswd",
  "type": "ZAP-10015"
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
  "url": "https://gpt-3-3dd1e.firebaseapp.com/?folder=..%2F..%2F..%2Fetc%2Fpasswd",
  "type": "ZAP-10015"
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
  "url": "https://gpt-3-3dd1e.firebaseapp.com/?folder=..%5C..%5C..%5Cwindows%5Cwin.ini",
  "type": "ZAP-10015"
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
  "url": "https://gpt-3-3dd1e.firebaseapp.com/?folder=....%2F%2F....%2F%2F....%2F%2Fetc%2Fpasswd",
  "type": "ZAP-10015"
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
  "url": "https://gpt-3-3dd1e.firebaseapp.com/?folder=..%252f..%252f..%252fetc%2Fpasswd",
  "type": "ZAP-10015"
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
  "url": "https://gpt-3-3dd1e.firebaseapp.com/?load=..%2F..%2F..%2Fetc%2Fpasswd",
  "type": "ZAP-10015"
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
  "url": "https://gpt-3-3dd1e.firebaseapp.com/?load=..%5C..%5C..%5Cwindows%5Cwin.ini",
  "type": "ZAP-10015"
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
  "url": "https://gpt-3-3dd1e.firebaseapp.com/?load=....%2F%2F....%2F%2F....%2F%2Fetc%2Fpasswd",
  "type": "ZAP-10015"
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
  "url": "https://gpt-3-3dd1e.firebaseapp.com/?load=..%252f..%252f..%252fetc%2Fpasswd",
  "type": "ZAP-10015"
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
  "url": "https://gpt-3-3dd1e.firebaseapp.com/?read=..%2F..%2F..%2Fetc%2Fpasswd",
  "type": "ZAP-10015"
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
  "url": "https://gpt-3-3dd1e.firebaseapp.com/?read=..%5C..%5C..%5Cwindows%5Cwin.ini",
  "type": "ZAP-10015"
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
  "url": "https://gpt-3-3dd1e.firebaseapp.com/?read=....%2F%2F....%2F%2F....%2F%2Fetc%2Fpasswd",
  "type": "ZAP-10015"
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
  "url": "https://gpt-3-3dd1e.firebaseapp.com/?read=..%252f..%252f..%252fetc%2Fpasswd",
  "type": "ZAP-10015"
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
  "url": "https://gpt-3-3dd1e.firebaseapp.com/admin.html",
  "type": "ZAP-10015"
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
  "url": "https://gpt-3-3dd1e.firebaseapp.com/?wsdl",
  "type": "ZAP-10015"
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
  "url": "https://gpt-3-3dd1e.firebaseapp.com/?url=http%3A%2F%2F127.0.0.1%3A22",
  "type": "ZAP-10015"
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
  "url": "https://gpt-3-3dd1e.firebaseapp.com/?url=http%3A%2F%2F169.254.169.254%2Flatest%2Fmeta-data%2F",
  "type": "ZAP-10015"
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
  "url": "https://gpt-3-3dd1e.firebaseapp.com/?uri=http%3A%2F%2F127.0.0.1%3A22",
  "type": "ZAP-10015"
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
  "url": "https://gpt-3-3dd1e.firebaseapp.com/?uri=http%3A%2F%2F169.254.169.254%2Flatest%2Fmeta-data%2F",
  "type": "ZAP-10015"
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
  "url": "https://gpt-3-3dd1e.firebaseapp.com/?path=http%3A%2F%2F127.0.0.1%3A22",
  "type": "ZAP-10015"
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
  "url": "https://gpt-3-3dd1e.firebaseapp.com/?path=http%3A%2F%2F169.254.169.254%2Flatest%2Fmeta-data%2F",
  "type": "ZAP-10015"
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
  "url": "https://gpt-3-3dd1e.firebaseapp.com/?src=http%3A%2F%2F127.0.0.1%3A22",
  "type": "ZAP-10015"
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
  "url": "https://gpt-3-3dd1e.firebaseapp.com/?src=http%3A%2F%2F169.254.169.254%2Flatest%2Fmeta-data%2F",
  "type": "ZAP-10015"
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
  "url": "https://gpt-3-3dd1e.firebaseapp.com/?source=http%3A%2F%2F127.0.0.1%3A22",
  "type": "ZAP-10015"
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
  "url": "https://gpt-3-3dd1e.firebaseapp.com/?source=http%3A%2F%2F169.254.169.254%2Flatest%2Fmeta-data%2F",
  "type": "ZAP-10015"
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
  "url": "https://gpt-3-3dd1e.firebaseapp.com/?link=http%3A%2F%2F127.0.0.1%3A22",
  "type": "ZAP-10015"
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
  "url": "https://gpt-3-3dd1e.firebaseapp.com/?link=http%3A%2F%2F169.254.169.254%2Flatest%2Fmeta-data%2F",
  "type": "ZAP-10015"
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
  "url": "https://gpt-3-3dd1e.firebaseapp.com/?href=http%3A%2F%2F127.0.0.1%3A22",
  "type": "ZAP-10015"
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
  "url": "https://gpt-3-3dd1e.firebaseapp.com/?href=http%3A%2F%2F169.254.169.254%2Flatest%2Fmeta-data%2F",
  "type": "ZAP-10015"
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
  "url": "https://gpt-3-3dd1e.firebaseapp.com/?dest=http%3A%2F%2F127.0.0.1%3A22",
  "type": "ZAP-10015"
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
  "url": "https://gpt-3-3dd1e.firebaseapp.com/?dest=http%3A%2F%2F169.254.169.254%2Flatest%2Fmeta-data%2F",
  "type": "ZAP-10015"
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
  "url": "https://gpt-3-3dd1e.firebaseapp.com/?redirect=http%3A%2F%2F127.0.0.1%3A22",
  "type": "ZAP-10015"
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
  "url": "https://gpt-3-3dd1e.firebaseapp.com/?redirect=http%3A%2F%2F169.254.169.254%2Flatest%2Fmeta-data%2F",
  "type": "ZAP-10015"
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
  "url": "https://gpt-3-3dd1e.firebaseapp.com/?site=http%3A%2F%2F127.0.0.1%3A22",
  "type": "ZAP-10015"
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
  "url": "https://gpt-3-3dd1e.firebaseapp.com/?site=http%3A%2F%2F169.254.169.254%2Flatest%2Fmeta-data%2F",
  "type": "ZAP-10015"
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
  "url": "https://gpt-3-3dd1e.firebaseapp.com/?html=http%3A%2F%2F127.0.0.1%3A22",
  "type": "ZAP-10015"
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
  "url": "https://gpt-3-3dd1e.firebaseapp.com/?html=http%3A%2F%2F169.254.169.254%2Flatest%2Fmeta-data%2F",
  "type": "ZAP-10015"
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
  "url": "https://gpt-3-3dd1e.firebaseapp.com/?feed=http%3A%2F%2F127.0.0.1%3A22",
  "type": "ZAP-10015"
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
  "url": "https://gpt-3-3dd1e.firebaseapp.com/?feed=http%3A%2F%2F169.254.169.254%2Flatest%2Fmeta-data%2F",
  "type": "ZAP-10015"
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
  "url": "https://gpt-3-3dd1e.firebaseapp.com/?host=http%3A%2F%2F127.0.0.1%3A22",
  "type": "ZAP-10015"
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
  "url": "https://gpt-3-3dd1e.firebaseapp.com/?host=http%3A%2F%2F169.254.169.254%2Flatest%2Fmeta-data%2F",
  "type": "ZAP-10015"
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
  "url": "https://gpt-3-3dd1e.firebaseapp.com/?domain=http%3A%2F%2F127.0.0.1%3A22",
  "type": "ZAP-10015"
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
  "url": "https://gpt-3-3dd1e.firebaseapp.com/?domain=http%3A%2F%2F169.254.169.254%2Flatest%2Fmeta-data%2F",
  "type": "ZAP-10015"
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
  "url": "https://gpt-3-3dd1e.firebaseapp.com/?__proto__%5Bpolluted%5D=true",
  "type": "ZAP-10015"
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
  "url": "https://gpt-3-3dd1e.firebaseapp.com/?constructor%5Bprototype%5D%5Bpolluted%5D=true",
  "type": "ZAP-10015"
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
  "url": "https://gpt-3-3dd1e.firebaseapp.com/styles.css",
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
  "url": "https://gpt-3-3dd1e.firebaseapp.com/firebase-config.js",
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
  "url": "https://gpt-3-3dd1e.firebaseapp.com/app.js",
  "type": "ZAP-10050-1"
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
  "url": "https://gpt-3-3dd1e.firebaseapp.com/styles.css",
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
  "url": "https://gpt-3-3dd1e.firebaseapp.com/firebase-config.js",
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
  "url": "https://gpt-3-3dd1e.firebaseapp.com/app.js",
  "type": "ZAP-10021"
}
```


### A02: Cryptographic Failures

#### HIGH: Exposure of Private Personal Information

- **CWE:** CWE-359 (Unknown)
- **Tool:** live-scanner
- **Status:** ✅ Confirmed by live testing

**Description:**
Other users' PII accessible: email, friends

**Evidence:**
```
{
  "exposedPII": [
    "email",
    "friends"
  ],
  "affectedUsers": 2
}
```


#### HIGH: Hardcoded Google API Key found

- **CWE:** CWE-798 (Unknown)
- **Tool:** crypto-scanner

**Description:**
Found potential Google API Key in https://gpt-3-3dd1e.firebaseapp.com/firebase-config.js

**Evidence:**
```
{
  "pattern": "Google API Key",
  "source": "https://gpt-3-3dd1e.firebaseapp.com/firebase-config.js",
  "redactedMatch": "AIzaSyD9Bd...W0rYs"
}
```


#### MEDIUM: Missing Content-Security-Policy

- **CWE:** CWE-79 (Unknown)
- **Tool:** browser-scanner
- **Duplicate Count:** 3

**Description:**
Security header "content-security-policy" is not set

**Evidence:**
```
{
  "url": "https://gpt-3-3dd1e.firebaseapp.com"
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
  "url": "https://gpt-3-3dd1e.firebaseapp.com"
}
```


#### MEDIUM: Public Post Access

- **CWE:** CWE-311 (Unknown)
- **Tool:** live-scanner
- **Status:** ✅ Confirmed by live testing

**Description:**
2 posts readable without authentication

**Evidence:**
```
{
  "postCount": 2
}
```


#### MEDIUM: Weak password policy

- **CWE:** CWE-521 (Weak Password Requirements)
- **Tool:** crypto-scanner
- **Duplicate Count:** 2

**Description:**
Password field "register-password" has weak policy: no minimum length requirement (should be ≥8), no pattern for password complexity


#### MEDIUM: Weak Random detected

- **CWE:** CWE-330 (Use of Insufficiently Random Values)
- **Tool:** crypto-scanner

**Description:**
Found Weak Random in https://gpt-3-3dd1e.firebaseapp.com/app.js. This may indicate weak cryptographic practices.

**Evidence:**
```
{
  "pattern": "Weak Random",
  "source": "https://gpt-3-3dd1e.firebaseapp.com/app.js",
  "matchCount": 1
}
```


#### LOW: Missing Referrer-Policy

- **CWE:** CWE-200 (Unknown)
- **Tool:** browser-scanner
- **Duplicate Count:** 3

**Description:**
Security header "referrer-policy" is not set

**Evidence:**
```
{
  "url": "https://gpt-3-3dd1e.firebaseapp.com"
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
  "url": "https://gpt-3-3dd1e.firebaseapp.com"
}
```


### A03: Injection

#### HIGH: dom-xss-innerhtml

- **CWE:** CWE-79 (Cross-site Scripting (XSS))
- **Tool:** semgrep

**Description:**
innerHTML XSS. CWE-79

**Evidence:**
```
{
  "file": "/home/nillof/Exjobb/GPT3/my-social-app/app.js",
  "line": 281,
  "endLine": 286,
  "code": "div.innerHTML = `\n        <strong>${user.displayName}</strong>\n        <p>${user.city || ''}, ${user.country || ''}</p>\n        <p>Age: ${user.age || ''}</p>\n        <p>${user.about || ''}</p>\n      `;"
}
```


#### HIGH: dom-xss-innerhtml

- **CWE:** CWE-79 (Cross-site Scripting (XSS))
- **Tool:** semgrep

**Description:**
innerHTML XSS. CWE-79

**Evidence:**
```
{
  "file": "/home/nillof/Exjobb/GPT3/my-social-app/app.js",
  "line": 417,
  "endLine": 447,
  "code": "div.innerHTML = `\n      <div class=\"post-header\">\n        <div>\n          <strong>${author.displayName || 'Unknown'}</strong>\n          <div class=\"post-meta\">\n            ${post.visibility === 'friends' ? 'Friends only • ' : 'Public • '}\n            ${formatDate(post.createdAt)}\n          </div>\n        </div>\n        <div>\n          <button class=\"add-friend-btn\" data-uid=\"${post.authorId}\">Add friend</button>\n        </div>\n      </div>\n      <div class=\"post-body\">\n        <p>${post.text || ''}</p>\n        ${post.imageUrl ? `<img src=\"${post.imageUrl}\" alt=\"post image\">` : ''}\n        ${post.album ? `<p><em>Album: ${post.album}</em></p>` : ''}\n      </div>\n      <div class=\"post-actions\" data-post-id=\"${post.id}\">\n        <button class=\"like-btn\">Like</button>\n        <button class=\"show-comments-btn\">Show comments</button>\n        ${post.imageUrl ? `<a href=\"${post.imageUrl}\" download>Download image</a>` : ''}\n        ${(currentUserDoc && (currentUser.uid === post.authorId || currentUserDoc.role === 'admin' || currentUser.uid === OWNER_UID))\n          ? `<button class=\"delete-post-btn\">Delete</button>` : ''}\n      </div>\n      <div class=\"post-comments\" id=\"comments-${post.id}\"></div>\n      <div class=\"post-comment-form\">\n        <textarea class=\"comment-text\" placeholder=\"Add a comment...\"></textarea>\n        <button class=\"add-comment-btn\" data-post-id=\"${post.id}\">Comment</button>\n      </div>\n    `;"
}
```


#### HIGH: dom-xss-innerhtml

- **CWE:** CWE-79 (Cross-site Scripting (XSS))
- **Tool:** semgrep

**Description:**
innerHTML XSS. CWE-79

**Evidence:**
```
{
  "file": "/home/nillof/Exjobb/GPT3/my-social-app/app.js",
  "line": 555,
  "endLine": 561,
  "code": "div.innerHTML = `\n      <strong>${author.displayName || 'Unknown'}</strong>:\n      ${c.text}\n      <span style=\"font-size:0.8rem;color:#666;\"> (${formatDate(c.createdAt)})</span>\n      ${(currentUserDoc && (c.authorId === currentUser.uid || currentUserDoc.role === 'admin' || currentUser.uid === OWNER_UID))\n        ? `<button data-comment-id=\"${c.id}\" data-post-id=\"${postId}\" class=\"delete-comment-btn\">Delete</button>` : ''}\n    `;"
}
```


#### HIGH: dom-xss-innerhtml

- **CWE:** CWE-79 (Cross-site Scripting (XSS))
- **Tool:** semgrep

**Description:**
innerHTML XSS. CWE-79

**Evidence:**
```
{
  "file": "/home/nillof/Exjobb/GPT3/my-social-app/app.js",
  "line": 745,
  "endLine": 778,
  "code": "div.innerHTML = `\n      <div class=\"post-header\">\n        <div>\n          <strong>${currentUserDoc.displayName}</strong>\n          <div class=\"post-meta\">\n            ${post.visibility === 'friends' ? 'Friends only • ' : 'Public • '}\n            ${formatDate(post.createdAt)}\n          </div>\n        </div>\n      </div>\n\n      <div class=\"post-body\">\n        <p>${post.text || ''}</p>\n        ${post.imageUrl ? `<img src=\"${post.imageUrl}\" alt=\"post image\">` : ''}\n        ${post.album ? `<p><em>Album: ${post.album}</em></p>` : ''}\n      </div>\n\n      <div class=\"post-actions\" data-post-id=\"${post.id}\">\n        <button class=\"like-btn\">Like</button>\n        <button class=\"show-comments-btn\">Show comments</button>\n        ${post.imageUrl ? `<a href=\"${post.imageUrl}\" download>Download image</a>` : ''}\n        ${(uid === currentUser.uid || currentUserDoc.role === 'admin' || currentUser.uid === OWNER_UID)\n          ? `<button class=\"delete-post-btn\">Delete</button>`\n          : ''\n        }\n      </div>\n\n      <div class=\"post-comments\" id=\"comments-${post.id}\"></div>\n\n      <div class=\"post-comment-form\">\n        <textarea class=\"comment-text\" placeholder=\"Add a comment...\"></textarea>\n        <button class=\"add-comment-btn\" data-post-id=\"${post.id}\">Comment</button>\n      </div>\n    `;"
}
```


#### HIGH: dom-xss-innerhtml

- **CWE:** CWE-79 (Cross-site Scripting (XSS))
- **Tool:** semgrep
- **Duplicate Count:** 2

**Description:**
innerHTML XSS. CWE-79

**Evidence:**
```
{
  "file": "/home/nillof/Exjobb/GPT3/my-social-app/app.js",
  "line": 970
}
```


#### HIGH: dom-xss-innerhtml

- **CWE:** CWE-79 (Cross-site Scripting (XSS))
- **Tool:** semgrep

**Description:**
innerHTML XSS. CWE-79

**Evidence:**
```
{
  "file": "/home/nillof/Exjobb/GPT3/my-social-app/app.js",
  "line": 1058,
  "endLine": 1063,
  "code": "div.innerHTML = `\n      <strong>${s.user.displayName}</strong>\n      <p>${s.user.city || ''}, ${s.user.country || ''}</p>\n      <p>Mutual friends: ${s.mutual}</p>\n      <button class=\"add-friend-btn\" data-uid=\"${s.id}\">Add friend</button>\n    `;"
}
```


#### HIGH: dom-xss-innerhtml

- **CWE:** CWE-79 (Cross-site Scripting (XSS))
- **Tool:** semgrep

**Description:**
innerHTML XSS. CWE-79

**Evidence:**
```
{
  "file": "/home/nillof/Exjobb/GPT3/my-social-app/app.js",
  "line": 1115,
  "endLine": 1118,
  "code": "div.innerHTML = `\n      <strong>${u.displayName}</strong>\n      <p>Click to open conversation</p>\n    `;"
}
```


#### HIGH: dom-xss-innerhtml

- **CWE:** CWE-79 (Cross-site Scripting (XSS))
- **Tool:** semgrep

**Description:**
innerHTML XSS. CWE-79

**Evidence:**
```
{
  "file": "/home/nillof/Exjobb/GPT3/my-social-app/app.js",
  "line": 1416,
  "endLine": 1420,
  "code": "div.innerHTML = `\n      <strong>${u.displayName} (${u.email})</strong>\n      <p>Role: ${u.role || 'user'}</p>\n      <button data-uid=\"${doc.id}\" class=\"admin-delete-user-btn\">Delete user</button>\n    `;"
}
```


#### HIGH: external-reference-script-src

- **CWE:** CWE-610 (Unknown)
- **Tool:** semgrep

**Description:**
Dynamic script.src. CWE-610

**Evidence:**
```
{
  "file": "/home/nillof/Exjobb/GPT3/my-social-app/app.js",
  "line": 612,
  "endLine": 612,
  "code": "$('profile-picture').src = u.profilePictureUrl;"
}
```


#### HIGH: external-reference-script-src

- **CWE:** CWE-610 (Unknown)
- **Tool:** semgrep

**Description:**
Dynamic script.src. CWE-610

**Evidence:**
```
{
  "file": "/home/nillof/Exjobb/GPT3/my-social-app/app.js",
  "line": 699,
  "endLine": 699,
  "code": "img.src = p.imageUrl;"
}
```


#### MEDIUM: Missing File Type Validation in Storage Rules

- **CWE:** CWE-434 (Unrestricted Upload of File with Dangerous Type)
- **Tool:** static-analysis

**Description:**
Storage rules do not validate file content type


