# Security Assessment Report

**Application:** Social Media App  
**Target:** https://claude4-195d9.firebaseapp.com  
**Date:** 2025-12-15T23:56:53.374Z  
**Duration:** 102s

## Summary

| Severity | Count |
|----------|-------|
| CRITICAL | 4 |
| HIGH | 24 |
| MEDIUM | 11 |
| LOW | 2 |

**Risk Score:** 184 (CRITICAL)


### Deduplication Summary

| Metric | Value |
|--------|-------|
| Original Findings | 743 |
| After Deduplication | 624 |
| Duplicates Removed | 119 |
| Reduction | 16% |

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
  "rule": "allow write: if request.auth != null;"
}
```


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


#### CRITICAL: Privilege Escalation: Self-Elevation to Admin

- **CWE:** CWE-269 (Unknown)
- **Tool:** live-scanner
- **Status:** ✅ Confirmed by live testing

**Description:**
User successfully set their own isAdmin flag to true

**Evidence:**
```
{
  "userId": "l6OD58Y1YXTXPJon0ufUWq5xoO53",
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
  "userId": "l6OD58Y1YXTXPJon0ufUWq5xoO53",
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
  "file": "/home/nillof/Exjobb/Claude4/social-circle-web/app.js",
  "line": 158,
  "endLine": 158,
  "code": "if (userData.isAdmin) {"
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
    "email",
    "displayName",
    "name",
    "uid",
    "theme",
    "city",
    "lastActive",
    "referralPoints",
    "about",
    "banner",
    "country",
    "age",
    "referralOptOut",
    "createdAt",
    "isAdmin",
    "profilePic"
  ],
  "sensitiveFields": [
    "email",
    "city",
    "country",
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


#### HIGH: Missing Creator Validation

- **CWE:** CWE-862 (Missing Authorization)
- **Tool:** static-analysis
- **Duplicate Count:** 2

**Description:**
Create operation only requires authentication. Should validate resource data matches authenticated user.

**Evidence:**
```
{
  "rule": "allow create: if request.auth != null;"
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
- **Duplicate Count:** 4

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
  "url": "https://claude4-195d9.firebaseapp.com/"
}
```


#### INFO: Content Security Policy (CSP) Header Not Set

- **CWE:** CWE-693 (Unknown)
- **Tool:** browser-scanner

**Description:**
Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks, including Cross Site Scripting (XSS) and data injection attacks. These attacks are used for everything from data theft to site defacement or distribution of malware. CSP provides a set of standard HTTP headers that allow website owners to declare approved sources of content that browsers should be allowed to load on that page — covered types are JavaScript, CSS, HTML frames, fonts, images and embeddable objects such as Java applets, ActiveX, audio and video files.

**Evidence:**
```
{
  "url": "https://claude4-195d9.firebaseapp.com/home"
}
```


#### INFO: Content Security Policy (CSP) Header Not Set

- **CWE:** CWE-693 (Unknown)
- **Tool:** browser-scanner

**Description:**
Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks, including Cross Site Scripting (XSS) and data injection attacks. These attacks are used for everything from data theft to site defacement or distribution of malware. CSP provides a set of standard HTTP headers that allow website owners to declare approved sources of content that browsers should be allowed to load on that page — covered types are JavaScript, CSS, HTML frames, fonts, images and embeddable objects such as Java applets, ActiveX, audio and video files.

**Evidence:**
```
{
  "url": "https://claude4-195d9.firebaseapp.com/profile"
}
```


#### INFO: Content Security Policy (CSP) Header Not Set

- **CWE:** CWE-693 (Unknown)
- **Tool:** browser-scanner

**Description:**
Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks, including Cross Site Scripting (XSS) and data injection attacks. These attacks are used for everything from data theft to site defacement or distribution of malware. CSP provides a set of standard HTTP headers that allow website owners to declare approved sources of content that browsers should be allowed to load on that page — covered types are JavaScript, CSS, HTML frames, fonts, images and embeddable objects such as Java applets, ActiveX, audio and video files.

**Evidence:**
```
{
  "url": "https://claude4-195d9.firebaseapp.com/settings"
}
```


#### INFO: Content Security Policy (CSP) Header Not Set

- **CWE:** CWE-693 (Unknown)
- **Tool:** browser-scanner

**Description:**
Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks, including Cross Site Scripting (XSS) and data injection attacks. These attacks are used for everything from data theft to site defacement or distribution of malware. CSP provides a set of standard HTTP headers that allow website owners to declare approved sources of content that browsers should be allowed to load on that page — covered types are JavaScript, CSS, HTML frames, fonts, images and embeddable objects such as Java applets, ActiveX, audio and video files.

**Evidence:**
```
{
  "url": "https://claude4-195d9.firebaseapp.com/posts"
}
```


#### INFO: Content Security Policy (CSP) Header Not Set

- **CWE:** CWE-693 (Unknown)
- **Tool:** browser-scanner

**Description:**
Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks, including Cross Site Scripting (XSS) and data injection attacks. These attacks are used for everything from data theft to site defacement or distribution of malware. CSP provides a set of standard HTTP headers that allow website owners to declare approved sources of content that browsers should be allowed to load on that page — covered types are JavaScript, CSS, HTML frames, fonts, images and embeddable objects such as Java applets, ActiveX, audio and video files.

**Evidence:**
```
{
  "url": "https://claude4-195d9.firebaseapp.com/messages"
}
```


#### INFO: Content Security Policy (CSP) Header Not Set

- **CWE:** CWE-693 (Unknown)
- **Tool:** browser-scanner

**Description:**
Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks, including Cross Site Scripting (XSS) and data injection attacks. These attacks are used for everything from data theft to site defacement or distribution of malware. CSP provides a set of standard HTTP headers that allow website owners to declare approved sources of content that browsers should be allowed to load on that page — covered types are JavaScript, CSS, HTML frames, fonts, images and embeddable objects such as Java applets, ActiveX, audio and video files.

**Evidence:**
```
{
  "url": "https://claude4-195d9.firebaseapp.com/feed"
}
```


#### INFO: Content Security Policy (CSP) Header Not Set

- **CWE:** CWE-693 (Unknown)
- **Tool:** browser-scanner

**Description:**
Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks, including Cross Site Scripting (XSS) and data injection attacks. These attacks are used for everything from data theft to site defacement or distribution of malware. CSP provides a set of standard HTTP headers that allow website owners to declare approved sources of content that browsers should be allowed to load on that page — covered types are JavaScript, CSS, HTML frames, fonts, images and embeddable objects such as Java applets, ActiveX, audio and video files.

**Evidence:**
```
{
  "url": "https://claude4-195d9.firebaseapp.com/__nonexistent__1765842152376_2640c865aba9d"
}
```


#### INFO: Content Security Policy (CSP) Header Not Set

- **CWE:** CWE-693 (Unknown)
- **Tool:** browser-scanner

**Description:**
Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks, including Cross Site Scripting (XSS) and data injection attacks. These attacks are used for everything from data theft to site defacement or distribution of malware. CSP provides a set of standard HTTP headers that allow website owners to declare approved sources of content that browsers should be allowed to load on that page — covered types are JavaScript, CSS, HTML frames, fonts, images and embeddable objects such as Java applets, ActiveX, audio and video files.

**Evidence:**
```
{
  "url": "https://claude4-195d9.firebaseapp.com/?file=..%2F..%2F..%2Fetc%2Fpasswd"
}
```


#### INFO: Content Security Policy (CSP) Header Not Set

- **CWE:** CWE-693 (Unknown)
- **Tool:** browser-scanner

**Description:**
Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks, including Cross Site Scripting (XSS) and data injection attacks. These attacks are used for everything from data theft to site defacement or distribution of malware. CSP provides a set of standard HTTP headers that allow website owners to declare approved sources of content that browsers should be allowed to load on that page — covered types are JavaScript, CSS, HTML frames, fonts, images and embeddable objects such as Java applets, ActiveX, audio and video files.

**Evidence:**
```
{
  "url": "https://claude4-195d9.firebaseapp.com/?file=..%5C..%5C..%5Cwindows%5Cwin.ini"
}
```


#### INFO: Content Security Policy (CSP) Header Not Set

- **CWE:** CWE-693 (Unknown)
- **Tool:** browser-scanner

**Description:**
Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks, including Cross Site Scripting (XSS) and data injection attacks. These attacks are used for everything from data theft to site defacement or distribution of malware. CSP provides a set of standard HTTP headers that allow website owners to declare approved sources of content that browsers should be allowed to load on that page — covered types are JavaScript, CSS, HTML frames, fonts, images and embeddable objects such as Java applets, ActiveX, audio and video files.

**Evidence:**
```
{
  "url": "https://claude4-195d9.firebaseapp.com/?file=....%2F%2F....%2F%2F....%2F%2Fetc%2Fpasswd"
}
```


#### INFO: Content Security Policy (CSP) Header Not Set

- **CWE:** CWE-693 (Unknown)
- **Tool:** browser-scanner

**Description:**
Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks, including Cross Site Scripting (XSS) and data injection attacks. These attacks are used for everything from data theft to site defacement or distribution of malware. CSP provides a set of standard HTTP headers that allow website owners to declare approved sources of content that browsers should be allowed to load on that page — covered types are JavaScript, CSS, HTML frames, fonts, images and embeddable objects such as Java applets, ActiveX, audio and video files.

**Evidence:**
```
{
  "url": "https://claude4-195d9.firebaseapp.com/?file=..%252f..%252f..%252fetc%2Fpasswd"
}
```


#### INFO: Content Security Policy (CSP) Header Not Set

- **CWE:** CWE-693 (Unknown)
- **Tool:** browser-scanner

**Description:**
Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks, including Cross Site Scripting (XSS) and data injection attacks. These attacks are used for everything from data theft to site defacement or distribution of malware. CSP provides a set of standard HTTP headers that allow website owners to declare approved sources of content that browsers should be allowed to load on that page — covered types are JavaScript, CSS, HTML frames, fonts, images and embeddable objects such as Java applets, ActiveX, audio and video files.

**Evidence:**
```
{
  "url": "https://claude4-195d9.firebaseapp.com/?path=..%2F..%2F..%2Fetc%2Fpasswd"
}
```


#### INFO: Content Security Policy (CSP) Header Not Set

- **CWE:** CWE-693 (Unknown)
- **Tool:** browser-scanner

**Description:**
Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks, including Cross Site Scripting (XSS) and data injection attacks. These attacks are used for everything from data theft to site defacement or distribution of malware. CSP provides a set of standard HTTP headers that allow website owners to declare approved sources of content that browsers should be allowed to load on that page — covered types are JavaScript, CSS, HTML frames, fonts, images and embeddable objects such as Java applets, ActiveX, audio and video files.

**Evidence:**
```
{
  "url": "https://claude4-195d9.firebaseapp.com/?path=..%5C..%5C..%5Cwindows%5Cwin.ini"
}
```


#### INFO: Content Security Policy (CSP) Header Not Set

- **CWE:** CWE-693 (Unknown)
- **Tool:** browser-scanner

**Description:**
Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks, including Cross Site Scripting (XSS) and data injection attacks. These attacks are used for everything from data theft to site defacement or distribution of malware. CSP provides a set of standard HTTP headers that allow website owners to declare approved sources of content that browsers should be allowed to load on that page — covered types are JavaScript, CSS, HTML frames, fonts, images and embeddable objects such as Java applets, ActiveX, audio and video files.

**Evidence:**
```
{
  "url": "https://claude4-195d9.firebaseapp.com/?path=....%2F%2F....%2F%2F....%2F%2Fetc%2Fpasswd"
}
```


#### INFO: Content Security Policy (CSP) Header Not Set

- **CWE:** CWE-693 (Unknown)
- **Tool:** browser-scanner

**Description:**
Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks, including Cross Site Scripting (XSS) and data injection attacks. These attacks are used for everything from data theft to site defacement or distribution of malware. CSP provides a set of standard HTTP headers that allow website owners to declare approved sources of content that browsers should be allowed to load on that page — covered types are JavaScript, CSS, HTML frames, fonts, images and embeddable objects such as Java applets, ActiveX, audio and video files.

**Evidence:**
```
{
  "url": "https://claude4-195d9.firebaseapp.com/?path=..%252f..%252f..%252fetc%2Fpasswd"
}
```


#### INFO: Content Security Policy (CSP) Header Not Set

- **CWE:** CWE-693 (Unknown)
- **Tool:** browser-scanner

**Description:**
Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks, including Cross Site Scripting (XSS) and data injection attacks. These attacks are used for everything from data theft to site defacement or distribution of malware. CSP provides a set of standard HTTP headers that allow website owners to declare approved sources of content that browsers should be allowed to load on that page — covered types are JavaScript, CSS, HTML frames, fonts, images and embeddable objects such as Java applets, ActiveX, audio and video files.

**Evidence:**
```
{
  "url": "https://claude4-195d9.firebaseapp.com/?filepath=..%2F..%2F..%2Fetc%2Fpasswd"
}
```


#### INFO: Content Security Policy (CSP) Header Not Set

- **CWE:** CWE-693 (Unknown)
- **Tool:** browser-scanner

**Description:**
Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks, including Cross Site Scripting (XSS) and data injection attacks. These attacks are used for everything from data theft to site defacement or distribution of malware. CSP provides a set of standard HTTP headers that allow website owners to declare approved sources of content that browsers should be allowed to load on that page — covered types are JavaScript, CSS, HTML frames, fonts, images and embeddable objects such as Java applets, ActiveX, audio and video files.

**Evidence:**
```
{
  "url": "https://claude4-195d9.firebaseapp.com/?filepath=..%5C..%5C..%5Cwindows%5Cwin.ini"
}
```


#### INFO: Content Security Policy (CSP) Header Not Set

- **CWE:** CWE-693 (Unknown)
- **Tool:** browser-scanner

**Description:**
Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks, including Cross Site Scripting (XSS) and data injection attacks. These attacks are used for everything from data theft to site defacement or distribution of malware. CSP provides a set of standard HTTP headers that allow website owners to declare approved sources of content that browsers should be allowed to load on that page — covered types are JavaScript, CSS, HTML frames, fonts, images and embeddable objects such as Java applets, ActiveX, audio and video files.

**Evidence:**
```
{
  "url": "https://claude4-195d9.firebaseapp.com/?filepath=....%2F%2F....%2F%2F....%2F%2Fetc%2Fpasswd"
}
```


#### INFO: Content Security Policy (CSP) Header Not Set

- **CWE:** CWE-693 (Unknown)
- **Tool:** browser-scanner

**Description:**
Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks, including Cross Site Scripting (XSS) and data injection attacks. These attacks are used for everything from data theft to site defacement or distribution of malware. CSP provides a set of standard HTTP headers that allow website owners to declare approved sources of content that browsers should be allowed to load on that page — covered types are JavaScript, CSS, HTML frames, fonts, images and embeddable objects such as Java applets, ActiveX, audio and video files.

**Evidence:**
```
{
  "url": "https://claude4-195d9.firebaseapp.com/?filepath=..%252f..%252f..%252fetc%2Fpasswd"
}
```


#### INFO: Content Security Policy (CSP) Header Not Set

- **CWE:** CWE-693 (Unknown)
- **Tool:** browser-scanner

**Description:**
Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks, including Cross Site Scripting (XSS) and data injection attacks. These attacks are used for everything from data theft to site defacement or distribution of malware. CSP provides a set of standard HTTP headers that allow website owners to declare approved sources of content that browsers should be allowed to load on that page — covered types are JavaScript, CSS, HTML frames, fonts, images and embeddable objects such as Java applets, ActiveX, audio and video files.

**Evidence:**
```
{
  "url": "https://claude4-195d9.firebaseapp.com/?document=..%2F..%2F..%2Fetc%2Fpasswd"
}
```


#### INFO: Content Security Policy (CSP) Header Not Set

- **CWE:** CWE-693 (Unknown)
- **Tool:** browser-scanner

**Description:**
Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks, including Cross Site Scripting (XSS) and data injection attacks. These attacks are used for everything from data theft to site defacement or distribution of malware. CSP provides a set of standard HTTP headers that allow website owners to declare approved sources of content that browsers should be allowed to load on that page — covered types are JavaScript, CSS, HTML frames, fonts, images and embeddable objects such as Java applets, ActiveX, audio and video files.

**Evidence:**
```
{
  "url": "https://claude4-195d9.firebaseapp.com/?document=..%5C..%5C..%5Cwindows%5Cwin.ini"
}
```


#### INFO: Content Security Policy (CSP) Header Not Set

- **CWE:** CWE-693 (Unknown)
- **Tool:** browser-scanner

**Description:**
Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks, including Cross Site Scripting (XSS) and data injection attacks. These attacks are used for everything from data theft to site defacement or distribution of malware. CSP provides a set of standard HTTP headers that allow website owners to declare approved sources of content that browsers should be allowed to load on that page — covered types are JavaScript, CSS, HTML frames, fonts, images and embeddable objects such as Java applets, ActiveX, audio and video files.

**Evidence:**
```
{
  "url": "https://claude4-195d9.firebaseapp.com/?document=....%2F%2F....%2F%2F....%2F%2Fetc%2Fpasswd"
}
```


#### INFO: Content Security Policy (CSP) Header Not Set

- **CWE:** CWE-693 (Unknown)
- **Tool:** browser-scanner

**Description:**
Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks, including Cross Site Scripting (XSS) and data injection attacks. These attacks are used for everything from data theft to site defacement or distribution of malware. CSP provides a set of standard HTTP headers that allow website owners to declare approved sources of content that browsers should be allowed to load on that page — covered types are JavaScript, CSS, HTML frames, fonts, images and embeddable objects such as Java applets, ActiveX, audio and video files.

**Evidence:**
```
{
  "url": "https://claude4-195d9.firebaseapp.com/?document=..%252f..%252f..%252fetc%2Fpasswd"
}
```


#### INFO: Content Security Policy (CSP) Header Not Set

- **CWE:** CWE-693 (Unknown)
- **Tool:** browser-scanner

**Description:**
Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks, including Cross Site Scripting (XSS) and data injection attacks. These attacks are used for everything from data theft to site defacement or distribution of malware. CSP provides a set of standard HTTP headers that allow website owners to declare approved sources of content that browsers should be allowed to load on that page — covered types are JavaScript, CSS, HTML frames, fonts, images and embeddable objects such as Java applets, ActiveX, audio and video files.

**Evidence:**
```
{
  "url": "https://claude4-195d9.firebaseapp.com/?doc=..%2F..%2F..%2Fetc%2Fpasswd"
}
```


#### INFO: Content Security Policy (CSP) Header Not Set

- **CWE:** CWE-693 (Unknown)
- **Tool:** browser-scanner

**Description:**
Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks, including Cross Site Scripting (XSS) and data injection attacks. These attacks are used for everything from data theft to site defacement or distribution of malware. CSP provides a set of standard HTTP headers that allow website owners to declare approved sources of content that browsers should be allowed to load on that page — covered types are JavaScript, CSS, HTML frames, fonts, images and embeddable objects such as Java applets, ActiveX, audio and video files.

**Evidence:**
```
{
  "url": "https://claude4-195d9.firebaseapp.com/?doc=..%5C..%5C..%5Cwindows%5Cwin.ini"
}
```


#### INFO: Content Security Policy (CSP) Header Not Set

- **CWE:** CWE-693 (Unknown)
- **Tool:** browser-scanner

**Description:**
Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks, including Cross Site Scripting (XSS) and data injection attacks. These attacks are used for everything from data theft to site defacement or distribution of malware. CSP provides a set of standard HTTP headers that allow website owners to declare approved sources of content that browsers should be allowed to load on that page — covered types are JavaScript, CSS, HTML frames, fonts, images and embeddable objects such as Java applets, ActiveX, audio and video files.

**Evidence:**
```
{
  "url": "https://claude4-195d9.firebaseapp.com/?doc=....%2F%2F....%2F%2F....%2F%2Fetc%2Fpasswd"
}
```


#### INFO: Content Security Policy (CSP) Header Not Set

- **CWE:** CWE-693 (Unknown)
- **Tool:** browser-scanner

**Description:**
Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks, including Cross Site Scripting (XSS) and data injection attacks. These attacks are used for everything from data theft to site defacement or distribution of malware. CSP provides a set of standard HTTP headers that allow website owners to declare approved sources of content that browsers should be allowed to load on that page — covered types are JavaScript, CSS, HTML frames, fonts, images and embeddable objects such as Java applets, ActiveX, audio and video files.

**Evidence:**
```
{
  "url": "https://claude4-195d9.firebaseapp.com/?doc=..%252f..%252f..%252fetc%2Fpasswd"
}
```


#### INFO: Content Security Policy (CSP) Header Not Set

- **CWE:** CWE-693 (Unknown)
- **Tool:** browser-scanner

**Description:**
Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks, including Cross Site Scripting (XSS) and data injection attacks. These attacks are used for everything from data theft to site defacement or distribution of malware. CSP provides a set of standard HTTP headers that allow website owners to declare approved sources of content that browsers should be allowed to load on that page — covered types are JavaScript, CSS, HTML frames, fonts, images and embeddable objects such as Java applets, ActiveX, audio and video files.

**Evidence:**
```
{
  "url": "https://claude4-195d9.firebaseapp.com/?page=..%2F..%2F..%2Fetc%2Fpasswd"
}
```


#### INFO: Content Security Policy (CSP) Header Not Set

- **CWE:** CWE-693 (Unknown)
- **Tool:** browser-scanner

**Description:**
Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks, including Cross Site Scripting (XSS) and data injection attacks. These attacks are used for everything from data theft to site defacement or distribution of malware. CSP provides a set of standard HTTP headers that allow website owners to declare approved sources of content that browsers should be allowed to load on that page — covered types are JavaScript, CSS, HTML frames, fonts, images and embeddable objects such as Java applets, ActiveX, audio and video files.

**Evidence:**
```
{
  "url": "https://claude4-195d9.firebaseapp.com/?page=..%5C..%5C..%5Cwindows%5Cwin.ini"
}
```


#### INFO: Content Security Policy (CSP) Header Not Set

- **CWE:** CWE-693 (Unknown)
- **Tool:** browser-scanner

**Description:**
Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks, including Cross Site Scripting (XSS) and data injection attacks. These attacks are used for everything from data theft to site defacement or distribution of malware. CSP provides a set of standard HTTP headers that allow website owners to declare approved sources of content that browsers should be allowed to load on that page — covered types are JavaScript, CSS, HTML frames, fonts, images and embeddable objects such as Java applets, ActiveX, audio and video files.

**Evidence:**
```
{
  "url": "https://claude4-195d9.firebaseapp.com/?page=....%2F%2F....%2F%2F....%2F%2Fetc%2Fpasswd"
}
```


#### INFO: Content Security Policy (CSP) Header Not Set

- **CWE:** CWE-693 (Unknown)
- **Tool:** browser-scanner

**Description:**
Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks, including Cross Site Scripting (XSS) and data injection attacks. These attacks are used for everything from data theft to site defacement or distribution of malware. CSP provides a set of standard HTTP headers that allow website owners to declare approved sources of content that browsers should be allowed to load on that page — covered types are JavaScript, CSS, HTML frames, fonts, images and embeddable objects such as Java applets, ActiveX, audio and video files.

**Evidence:**
```
{
  "url": "https://claude4-195d9.firebaseapp.com/?page=..%252f..%252f..%252fetc%2Fpasswd"
}
```


#### INFO: Content Security Policy (CSP) Header Not Set

- **CWE:** CWE-693 (Unknown)
- **Tool:** browser-scanner

**Description:**
Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks, including Cross Site Scripting (XSS) and data injection attacks. These attacks are used for everything from data theft to site defacement or distribution of malware. CSP provides a set of standard HTTP headers that allow website owners to declare approved sources of content that browsers should be allowed to load on that page — covered types are JavaScript, CSS, HTML frames, fonts, images and embeddable objects such as Java applets, ActiveX, audio and video files.

**Evidence:**
```
{
  "url": "https://claude4-195d9.firebaseapp.com/?template=..%2F..%2F..%2Fetc%2Fpasswd"
}
```


#### INFO: Content Security Policy (CSP) Header Not Set

- **CWE:** CWE-693 (Unknown)
- **Tool:** browser-scanner

**Description:**
Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks, including Cross Site Scripting (XSS) and data injection attacks. These attacks are used for everything from data theft to site defacement or distribution of malware. CSP provides a set of standard HTTP headers that allow website owners to declare approved sources of content that browsers should be allowed to load on that page — covered types are JavaScript, CSS, HTML frames, fonts, images and embeddable objects such as Java applets, ActiveX, audio and video files.

**Evidence:**
```
{
  "url": "https://claude4-195d9.firebaseapp.com/?template=..%5C..%5C..%5Cwindows%5Cwin.ini"
}
```


#### INFO: Content Security Policy (CSP) Header Not Set

- **CWE:** CWE-693 (Unknown)
- **Tool:** browser-scanner

**Description:**
Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks, including Cross Site Scripting (XSS) and data injection attacks. These attacks are used for everything from data theft to site defacement or distribution of malware. CSP provides a set of standard HTTP headers that allow website owners to declare approved sources of content that browsers should be allowed to load on that page — covered types are JavaScript, CSS, HTML frames, fonts, images and embeddable objects such as Java applets, ActiveX, audio and video files.

**Evidence:**
```
{
  "url": "https://claude4-195d9.firebaseapp.com/?template=....%2F%2F....%2F%2F....%2F%2Fetc%2Fpasswd"
}
```


#### INFO: Content Security Policy (CSP) Header Not Set

- **CWE:** CWE-693 (Unknown)
- **Tool:** browser-scanner

**Description:**
Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks, including Cross Site Scripting (XSS) and data injection attacks. These attacks are used for everything from data theft to site defacement or distribution of malware. CSP provides a set of standard HTTP headers that allow website owners to declare approved sources of content that browsers should be allowed to load on that page — covered types are JavaScript, CSS, HTML frames, fonts, images and embeddable objects such as Java applets, ActiveX, audio and video files.

**Evidence:**
```
{
  "url": "https://claude4-195d9.firebaseapp.com/?template=..%252f..%252f..%252fetc%2Fpasswd"
}
```


#### INFO: Content Security Policy (CSP) Header Not Set

- **CWE:** CWE-693 (Unknown)
- **Tool:** browser-scanner

**Description:**
Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks, including Cross Site Scripting (XSS) and data injection attacks. These attacks are used for everything from data theft to site defacement or distribution of malware. CSP provides a set of standard HTTP headers that allow website owners to declare approved sources of content that browsers should be allowed to load on that page — covered types are JavaScript, CSS, HTML frames, fonts, images and embeddable objects such as Java applets, ActiveX, audio and video files.

**Evidence:**
```
{
  "url": "https://claude4-195d9.firebaseapp.com/?include=..%2F..%2F..%2Fetc%2Fpasswd"
}
```


#### INFO: Content Security Policy (CSP) Header Not Set

- **CWE:** CWE-693 (Unknown)
- **Tool:** browser-scanner

**Description:**
Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks, including Cross Site Scripting (XSS) and data injection attacks. These attacks are used for everything from data theft to site defacement or distribution of malware. CSP provides a set of standard HTTP headers that allow website owners to declare approved sources of content that browsers should be allowed to load on that page — covered types are JavaScript, CSS, HTML frames, fonts, images and embeddable objects such as Java applets, ActiveX, audio and video files.

**Evidence:**
```
{
  "url": "https://claude4-195d9.firebaseapp.com/?include=..%5C..%5C..%5Cwindows%5Cwin.ini"
}
```


#### INFO: Content Security Policy (CSP) Header Not Set

- **CWE:** CWE-693 (Unknown)
- **Tool:** browser-scanner

**Description:**
Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks, including Cross Site Scripting (XSS) and data injection attacks. These attacks are used for everything from data theft to site defacement or distribution of malware. CSP provides a set of standard HTTP headers that allow website owners to declare approved sources of content that browsers should be allowed to load on that page — covered types are JavaScript, CSS, HTML frames, fonts, images and embeddable objects such as Java applets, ActiveX, audio and video files.

**Evidence:**
```
{
  "url": "https://claude4-195d9.firebaseapp.com/?include=....%2F%2F....%2F%2F....%2F%2Fetc%2Fpasswd"
}
```


#### INFO: Content Security Policy (CSP) Header Not Set

- **CWE:** CWE-693 (Unknown)
- **Tool:** browser-scanner

**Description:**
Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks, including Cross Site Scripting (XSS) and data injection attacks. These attacks are used for everything from data theft to site defacement or distribution of malware. CSP provides a set of standard HTTP headers that allow website owners to declare approved sources of content that browsers should be allowed to load on that page — covered types are JavaScript, CSS, HTML frames, fonts, images and embeddable objects such as Java applets, ActiveX, audio and video files.

**Evidence:**
```
{
  "url": "https://claude4-195d9.firebaseapp.com/?include=..%252f..%252f..%252fetc%2Fpasswd"
}
```


#### INFO: Content Security Policy (CSP) Header Not Set

- **CWE:** CWE-693 (Unknown)
- **Tool:** browser-scanner

**Description:**
Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks, including Cross Site Scripting (XSS) and data injection attacks. These attacks are used for everything from data theft to site defacement or distribution of malware. CSP provides a set of standard HTTP headers that allow website owners to declare approved sources of content that browsers should be allowed to load on that page — covered types are JavaScript, CSS, HTML frames, fonts, images and embeddable objects such as Java applets, ActiveX, audio and video files.

**Evidence:**
```
{
  "url": "https://claude4-195d9.firebaseapp.com/?dir=..%2F..%2F..%2Fetc%2Fpasswd"
}
```


#### INFO: Content Security Policy (CSP) Header Not Set

- **CWE:** CWE-693 (Unknown)
- **Tool:** browser-scanner

**Description:**
Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks, including Cross Site Scripting (XSS) and data injection attacks. These attacks are used for everything from data theft to site defacement or distribution of malware. CSP provides a set of standard HTTP headers that allow website owners to declare approved sources of content that browsers should be allowed to load on that page — covered types are JavaScript, CSS, HTML frames, fonts, images and embeddable objects such as Java applets, ActiveX, audio and video files.

**Evidence:**
```
{
  "url": "https://claude4-195d9.firebaseapp.com/?dir=..%5C..%5C..%5Cwindows%5Cwin.ini"
}
```


#### INFO: Content Security Policy (CSP) Header Not Set

- **CWE:** CWE-693 (Unknown)
- **Tool:** browser-scanner

**Description:**
Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks, including Cross Site Scripting (XSS) and data injection attacks. These attacks are used for everything from data theft to site defacement or distribution of malware. CSP provides a set of standard HTTP headers that allow website owners to declare approved sources of content that browsers should be allowed to load on that page — covered types are JavaScript, CSS, HTML frames, fonts, images and embeddable objects such as Java applets, ActiveX, audio and video files.

**Evidence:**
```
{
  "url": "https://claude4-195d9.firebaseapp.com/?dir=....%2F%2F....%2F%2F....%2F%2Fetc%2Fpasswd"
}
```


#### INFO: Content Security Policy (CSP) Header Not Set

- **CWE:** CWE-693 (Unknown)
- **Tool:** browser-scanner

**Description:**
Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks, including Cross Site Scripting (XSS) and data injection attacks. These attacks are used for everything from data theft to site defacement or distribution of malware. CSP provides a set of standard HTTP headers that allow website owners to declare approved sources of content that browsers should be allowed to load on that page — covered types are JavaScript, CSS, HTML frames, fonts, images and embeddable objects such as Java applets, ActiveX, audio and video files.

**Evidence:**
```
{
  "url": "https://claude4-195d9.firebaseapp.com/?dir=..%252f..%252f..%252fetc%2Fpasswd"
}
```


#### INFO: Content Security Policy (CSP) Header Not Set

- **CWE:** CWE-693 (Unknown)
- **Tool:** browser-scanner

**Description:**
Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks, including Cross Site Scripting (XSS) and data injection attacks. These attacks are used for everything from data theft to site defacement or distribution of malware. CSP provides a set of standard HTTP headers that allow website owners to declare approved sources of content that browsers should be allowed to load on that page — covered types are JavaScript, CSS, HTML frames, fonts, images and embeddable objects such as Java applets, ActiveX, audio and video files.

**Evidence:**
```
{
  "url": "https://claude4-195d9.firebaseapp.com/?folder=..%2F..%2F..%2Fetc%2Fpasswd"
}
```


#### INFO: Content Security Policy (CSP) Header Not Set

- **CWE:** CWE-693 (Unknown)
- **Tool:** browser-scanner

**Description:**
Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks, including Cross Site Scripting (XSS) and data injection attacks. These attacks are used for everything from data theft to site defacement or distribution of malware. CSP provides a set of standard HTTP headers that allow website owners to declare approved sources of content that browsers should be allowed to load on that page — covered types are JavaScript, CSS, HTML frames, fonts, images and embeddable objects such as Java applets, ActiveX, audio and video files.

**Evidence:**
```
{
  "url": "https://claude4-195d9.firebaseapp.com/?folder=..%5C..%5C..%5Cwindows%5Cwin.ini"
}
```


#### INFO: Content Security Policy (CSP) Header Not Set

- **CWE:** CWE-693 (Unknown)
- **Tool:** browser-scanner

**Description:**
Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks, including Cross Site Scripting (XSS) and data injection attacks. These attacks are used for everything from data theft to site defacement or distribution of malware. CSP provides a set of standard HTTP headers that allow website owners to declare approved sources of content that browsers should be allowed to load on that page — covered types are JavaScript, CSS, HTML frames, fonts, images and embeddable objects such as Java applets, ActiveX, audio and video files.

**Evidence:**
```
{
  "url": "https://claude4-195d9.firebaseapp.com/?folder=....%2F%2F....%2F%2F....%2F%2Fetc%2Fpasswd"
}
```


#### INFO: Content Security Policy (CSP) Header Not Set

- **CWE:** CWE-693 (Unknown)
- **Tool:** browser-scanner

**Description:**
Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks, including Cross Site Scripting (XSS) and data injection attacks. These attacks are used for everything from data theft to site defacement or distribution of malware. CSP provides a set of standard HTTP headers that allow website owners to declare approved sources of content that browsers should be allowed to load on that page — covered types are JavaScript, CSS, HTML frames, fonts, images and embeddable objects such as Java applets, ActiveX, audio and video files.

**Evidence:**
```
{
  "url": "https://claude4-195d9.firebaseapp.com/?folder=..%252f..%252f..%252fetc%2Fpasswd"
}
```


#### INFO: Content Security Policy (CSP) Header Not Set

- **CWE:** CWE-693 (Unknown)
- **Tool:** browser-scanner

**Description:**
Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks, including Cross Site Scripting (XSS) and data injection attacks. These attacks are used for everything from data theft to site defacement or distribution of malware. CSP provides a set of standard HTTP headers that allow website owners to declare approved sources of content that browsers should be allowed to load on that page — covered types are JavaScript, CSS, HTML frames, fonts, images and embeddable objects such as Java applets, ActiveX, audio and video files.

**Evidence:**
```
{
  "url": "https://claude4-195d9.firebaseapp.com/?load=..%2F..%2F..%2Fetc%2Fpasswd"
}
```


#### INFO: Content Security Policy (CSP) Header Not Set

- **CWE:** CWE-693 (Unknown)
- **Tool:** browser-scanner

**Description:**
Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks, including Cross Site Scripting (XSS) and data injection attacks. These attacks are used for everything from data theft to site defacement or distribution of malware. CSP provides a set of standard HTTP headers that allow website owners to declare approved sources of content that browsers should be allowed to load on that page — covered types are JavaScript, CSS, HTML frames, fonts, images and embeddable objects such as Java applets, ActiveX, audio and video files.

**Evidence:**
```
{
  "url": "https://claude4-195d9.firebaseapp.com/?load=..%5C..%5C..%5Cwindows%5Cwin.ini"
}
```


#### INFO: Content Security Policy (CSP) Header Not Set

- **CWE:** CWE-693 (Unknown)
- **Tool:** browser-scanner

**Description:**
Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks, including Cross Site Scripting (XSS) and data injection attacks. These attacks are used for everything from data theft to site defacement or distribution of malware. CSP provides a set of standard HTTP headers that allow website owners to declare approved sources of content that browsers should be allowed to load on that page — covered types are JavaScript, CSS, HTML frames, fonts, images and embeddable objects such as Java applets, ActiveX, audio and video files.

**Evidence:**
```
{
  "url": "https://claude4-195d9.firebaseapp.com/?load=....%2F%2F....%2F%2F....%2F%2Fetc%2Fpasswd"
}
```


#### INFO: Content Security Policy (CSP) Header Not Set

- **CWE:** CWE-693 (Unknown)
- **Tool:** browser-scanner

**Description:**
Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks, including Cross Site Scripting (XSS) and data injection attacks. These attacks are used for everything from data theft to site defacement or distribution of malware. CSP provides a set of standard HTTP headers that allow website owners to declare approved sources of content that browsers should be allowed to load on that page — covered types are JavaScript, CSS, HTML frames, fonts, images and embeddable objects such as Java applets, ActiveX, audio and video files.

**Evidence:**
```
{
  "url": "https://claude4-195d9.firebaseapp.com/?load=..%252f..%252f..%252fetc%2Fpasswd"
}
```


#### INFO: Content Security Policy (CSP) Header Not Set

- **CWE:** CWE-693 (Unknown)
- **Tool:** browser-scanner

**Description:**
Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks, including Cross Site Scripting (XSS) and data injection attacks. These attacks are used for everything from data theft to site defacement or distribution of malware. CSP provides a set of standard HTTP headers that allow website owners to declare approved sources of content that browsers should be allowed to load on that page — covered types are JavaScript, CSS, HTML frames, fonts, images and embeddable objects such as Java applets, ActiveX, audio and video files.

**Evidence:**
```
{
  "url": "https://claude4-195d9.firebaseapp.com/?read=..%2F..%2F..%2Fetc%2Fpasswd"
}
```


#### INFO: Content Security Policy (CSP) Header Not Set

- **CWE:** CWE-693 (Unknown)
- **Tool:** browser-scanner

**Description:**
Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks, including Cross Site Scripting (XSS) and data injection attacks. These attacks are used for everything from data theft to site defacement or distribution of malware. CSP provides a set of standard HTTP headers that allow website owners to declare approved sources of content that browsers should be allowed to load on that page — covered types are JavaScript, CSS, HTML frames, fonts, images and embeddable objects such as Java applets, ActiveX, audio and video files.

**Evidence:**
```
{
  "url": "https://claude4-195d9.firebaseapp.com/?read=..%5C..%5C..%5Cwindows%5Cwin.ini"
}
```


#### INFO: Content Security Policy (CSP) Header Not Set

- **CWE:** CWE-693 (Unknown)
- **Tool:** browser-scanner

**Description:**
Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks, including Cross Site Scripting (XSS) and data injection attacks. These attacks are used for everything from data theft to site defacement or distribution of malware. CSP provides a set of standard HTTP headers that allow website owners to declare approved sources of content that browsers should be allowed to load on that page — covered types are JavaScript, CSS, HTML frames, fonts, images and embeddable objects such as Java applets, ActiveX, audio and video files.

**Evidence:**
```
{
  "url": "https://claude4-195d9.firebaseapp.com/?read=....%2F%2F....%2F%2F....%2F%2Fetc%2Fpasswd"
}
```


#### INFO: Content Security Policy (CSP) Header Not Set

- **CWE:** CWE-693 (Unknown)
- **Tool:** browser-scanner

**Description:**
Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks, including Cross Site Scripting (XSS) and data injection attacks. These attacks are used for everything from data theft to site defacement or distribution of malware. CSP provides a set of standard HTTP headers that allow website owners to declare approved sources of content that browsers should be allowed to load on that page — covered types are JavaScript, CSS, HTML frames, fonts, images and embeddable objects such as Java applets, ActiveX, audio and video files.

**Evidence:**
```
{
  "url": "https://claude4-195d9.firebaseapp.com/?read=..%252f..%252f..%252fetc%2Fpasswd"
}
```


#### INFO: Content Security Policy (CSP) Header Not Set

- **CWE:** CWE-693 (Unknown)
- **Tool:** browser-scanner

**Description:**
Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks, including Cross Site Scripting (XSS) and data injection attacks. These attacks are used for everything from data theft to site defacement or distribution of malware. CSP provides a set of standard HTTP headers that allow website owners to declare approved sources of content that browsers should be allowed to load on that page — covered types are JavaScript, CSS, HTML frames, fonts, images and embeddable objects such as Java applets, ActiveX, audio and video files.

**Evidence:**
```
{
  "url": "https://claude4-195d9.firebaseapp.com/images/"
}
```


#### INFO: Content Security Policy (CSP) Header Not Set

- **CWE:** CWE-693 (Unknown)
- **Tool:** browser-scanner

**Description:**
Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks, including Cross Site Scripting (XSS) and data injection attacks. These attacks are used for everything from data theft to site defacement or distribution of malware. CSP provides a set of standard HTTP headers that allow website owners to declare approved sources of content that browsers should be allowed to load on that page — covered types are JavaScript, CSS, HTML frames, fonts, images and embeddable objects such as Java applets, ActiveX, audio and video files.

**Evidence:**
```
{
  "url": "https://claude4-195d9.firebaseapp.com/images/styles.css"
}
```


#### INFO: Content Security Policy (CSP) Header Not Set

- **CWE:** CWE-693 (Unknown)
- **Tool:** browser-scanner

**Description:**
Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks, including Cross Site Scripting (XSS) and data injection attacks. These attacks are used for everything from data theft to site defacement or distribution of malware. CSP provides a set of standard HTTP headers that allow website owners to declare approved sources of content that browsers should be allowed to load on that page — covered types are JavaScript, CSS, HTML frames, fonts, images and embeddable objects such as Java applets, ActiveX, audio and video files.

**Evidence:**
```
{
  "url": "https://claude4-195d9.firebaseapp.com/images/app.js"
}
```


#### INFO: Content Security Policy (CSP) Header Not Set

- **CWE:** CWE-693 (Unknown)
- **Tool:** browser-scanner

**Description:**
Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks, including Cross Site Scripting (XSS) and data injection attacks. These attacks are used for everything from data theft to site defacement or distribution of malware. CSP provides a set of standard HTTP headers that allow website owners to declare approved sources of content that browsers should be allowed to load on that page — covered types are JavaScript, CSS, HTML frames, fonts, images and embeddable objects such as Java applets, ActiveX, audio and video files.

**Evidence:**
```
{
  "url": "https://claude4-195d9.firebaseapp.com/images/config.js"
}
```


#### INFO: Content Security Policy (CSP) Header Not Set

- **CWE:** CWE-693 (Unknown)
- **Tool:** browser-scanner

**Description:**
Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks, including Cross Site Scripting (XSS) and data injection attacks. These attacks are used for everything from data theft to site defacement or distribution of malware. CSP provides a set of standard HTTP headers that allow website owners to declare approved sources of content that browsers should be allowed to load on that page — covered types are JavaScript, CSS, HTML frames, fonts, images and embeddable objects such as Java applets, ActiveX, audio and video files.

**Evidence:**
```
{
  "url": "https://claude4-195d9.firebaseapp.com/uploads/"
}
```


#### INFO: Content Security Policy (CSP) Header Not Set

- **CWE:** CWE-693 (Unknown)
- **Tool:** browser-scanner

**Description:**
Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks, including Cross Site Scripting (XSS) and data injection attacks. These attacks are used for everything from data theft to site defacement or distribution of malware. CSP provides a set of standard HTTP headers that allow website owners to declare approved sources of content that browsers should be allowed to load on that page — covered types are JavaScript, CSS, HTML frames, fonts, images and embeddable objects such as Java applets, ActiveX, audio and video files.

**Evidence:**
```
{
  "url": "https://claude4-195d9.firebaseapp.com/uploads/app.js"
}
```


#### INFO: Content Security Policy (CSP) Header Not Set

- **CWE:** CWE-693 (Unknown)
- **Tool:** browser-scanner

**Description:**
Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks, including Cross Site Scripting (XSS) and data injection attacks. These attacks are used for everything from data theft to site defacement or distribution of malware. CSP provides a set of standard HTTP headers that allow website owners to declare approved sources of content that browsers should be allowed to load on that page — covered types are JavaScript, CSS, HTML frames, fonts, images and embeddable objects such as Java applets, ActiveX, audio and video files.

**Evidence:**
```
{
  "url": "https://claude4-195d9.firebaseapp.com/uploads/styles.css"
}
```


#### INFO: Content Security Policy (CSP) Header Not Set

- **CWE:** CWE-693 (Unknown)
- **Tool:** browser-scanner

**Description:**
Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks, including Cross Site Scripting (XSS) and data injection attacks. These attacks are used for everything from data theft to site defacement or distribution of malware. CSP provides a set of standard HTTP headers that allow website owners to declare approved sources of content that browsers should be allowed to load on that page — covered types are JavaScript, CSS, HTML frames, fonts, images and embeddable objects such as Java applets, ActiveX, audio and video files.

**Evidence:**
```
{
  "url": "https://claude4-195d9.firebaseapp.com/uploads/config.js"
}
```


#### INFO: Content Security Policy (CSP) Header Not Set

- **CWE:** CWE-693 (Unknown)
- **Tool:** browser-scanner

**Description:**
Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks, including Cross Site Scripting (XSS) and data injection attacks. These attacks are used for everything from data theft to site defacement or distribution of malware. CSP provides a set of standard HTTP headers that allow website owners to declare approved sources of content that browsers should be allowed to load on that page — covered types are JavaScript, CSS, HTML frames, fonts, images and embeddable objects such as Java applets, ActiveX, audio and video files.

**Evidence:**
```
{
  "url": "https://claude4-195d9.firebaseapp.com/files/"
}
```


#### INFO: Content Security Policy (CSP) Header Not Set

- **CWE:** CWE-693 (Unknown)
- **Tool:** browser-scanner

**Description:**
Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks, including Cross Site Scripting (XSS) and data injection attacks. These attacks are used for everything from data theft to site defacement or distribution of malware. CSP provides a set of standard HTTP headers that allow website owners to declare approved sources of content that browsers should be allowed to load on that page — covered types are JavaScript, CSS, HTML frames, fonts, images and embeddable objects such as Java applets, ActiveX, audio and video files.

**Evidence:**
```
{
  "url": "https://claude4-195d9.firebaseapp.com/files/app.js"
}
```


#### INFO: Content Security Policy (CSP) Header Not Set

- **CWE:** CWE-693 (Unknown)
- **Tool:** browser-scanner

**Description:**
Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks, including Cross Site Scripting (XSS) and data injection attacks. These attacks are used for everything from data theft to site defacement or distribution of malware. CSP provides a set of standard HTTP headers that allow website owners to declare approved sources of content that browsers should be allowed to load on that page — covered types are JavaScript, CSS, HTML frames, fonts, images and embeddable objects such as Java applets, ActiveX, audio and video files.

**Evidence:**
```
{
  "url": "https://claude4-195d9.firebaseapp.com/files/styles.css"
}
```


#### INFO: Content Security Policy (CSP) Header Not Set

- **CWE:** CWE-693 (Unknown)
- **Tool:** browser-scanner

**Description:**
Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks, including Cross Site Scripting (XSS) and data injection attacks. These attacks are used for everything from data theft to site defacement or distribution of malware. CSP provides a set of standard HTTP headers that allow website owners to declare approved sources of content that browsers should be allowed to load on that page — covered types are JavaScript, CSS, HTML frames, fonts, images and embeddable objects such as Java applets, ActiveX, audio and video files.

**Evidence:**
```
{
  "url": "https://claude4-195d9.firebaseapp.com/files/config.js"
}
```


#### INFO: Content Security Policy (CSP) Header Not Set

- **CWE:** CWE-693 (Unknown)
- **Tool:** browser-scanner

**Description:**
Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks, including Cross Site Scripting (XSS) and data injection attacks. These attacks are used for everything from data theft to site defacement or distribution of malware. CSP provides a set of standard HTTP headers that allow website owners to declare approved sources of content that browsers should be allowed to load on that page — covered types are JavaScript, CSS, HTML frames, fonts, images and embeddable objects such as Java applets, ActiveX, audio and video files.

**Evidence:**
```
{
  "url": "https://claude4-195d9.firebaseapp.com/assets/"
}
```


#### INFO: Content Security Policy (CSP) Header Not Set

- **CWE:** CWE-693 (Unknown)
- **Tool:** browser-scanner

**Description:**
Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks, including Cross Site Scripting (XSS) and data injection attacks. These attacks are used for everything from data theft to site defacement or distribution of malware. CSP provides a set of standard HTTP headers that allow website owners to declare approved sources of content that browsers should be allowed to load on that page — covered types are JavaScript, CSS, HTML frames, fonts, images and embeddable objects such as Java applets, ActiveX, audio and video files.

**Evidence:**
```
{
  "url": "https://claude4-195d9.firebaseapp.com/assets/app.js"
}
```


#### INFO: Content Security Policy (CSP) Header Not Set

- **CWE:** CWE-693 (Unknown)
- **Tool:** browser-scanner

**Description:**
Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks, including Cross Site Scripting (XSS) and data injection attacks. These attacks are used for everything from data theft to site defacement or distribution of malware. CSP provides a set of standard HTTP headers that allow website owners to declare approved sources of content that browsers should be allowed to load on that page — covered types are JavaScript, CSS, HTML frames, fonts, images and embeddable objects such as Java applets, ActiveX, audio and video files.

**Evidence:**
```
{
  "url": "https://claude4-195d9.firebaseapp.com/assets/config.js"
}
```


#### INFO: Content Security Policy (CSP) Header Not Set

- **CWE:** CWE-693 (Unknown)
- **Tool:** browser-scanner

**Description:**
Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks, including Cross Site Scripting (XSS) and data injection attacks. These attacks are used for everything from data theft to site defacement or distribution of malware. CSP provides a set of standard HTTP headers that allow website owners to declare approved sources of content that browsers should be allowed to load on that page — covered types are JavaScript, CSS, HTML frames, fonts, images and embeddable objects such as Java applets, ActiveX, audio and video files.

**Evidence:**
```
{
  "url": "https://claude4-195d9.firebaseapp.com/assets/styles.css"
}
```


#### INFO: Content Security Policy (CSP) Header Not Set

- **CWE:** CWE-693 (Unknown)
- **Tool:** browser-scanner

**Description:**
Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks, including Cross Site Scripting (XSS) and data injection attacks. These attacks are used for everything from data theft to site defacement or distribution of malware. CSP provides a set of standard HTTP headers that allow website owners to declare approved sources of content that browsers should be allowed to load on that page — covered types are JavaScript, CSS, HTML frames, fonts, images and embeddable objects such as Java applets, ActiveX, audio and video files.

**Evidence:**
```
{
  "url": "https://claude4-195d9.firebaseapp.com/static/"
}
```


#### INFO: Content Security Policy (CSP) Header Not Set

- **CWE:** CWE-693 (Unknown)
- **Tool:** browser-scanner

**Description:**
Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks, including Cross Site Scripting (XSS) and data injection attacks. These attacks are used for everything from data theft to site defacement or distribution of malware. CSP provides a set of standard HTTP headers that allow website owners to declare approved sources of content that browsers should be allowed to load on that page — covered types are JavaScript, CSS, HTML frames, fonts, images and embeddable objects such as Java applets, ActiveX, audio and video files.

**Evidence:**
```
{
  "url": "https://claude4-195d9.firebaseapp.com/static/config.js"
}
```


#### INFO: Content Security Policy (CSP) Header Not Set

- **CWE:** CWE-693 (Unknown)
- **Tool:** browser-scanner

**Description:**
Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks, including Cross Site Scripting (XSS) and data injection attacks. These attacks are used for everything from data theft to site defacement or distribution of malware. CSP provides a set of standard HTTP headers that allow website owners to declare approved sources of content that browsers should be allowed to load on that page — covered types are JavaScript, CSS, HTML frames, fonts, images and embeddable objects such as Java applets, ActiveX, audio and video files.

**Evidence:**
```
{
  "url": "https://claude4-195d9.firebaseapp.com/static/app.js"
}
```


#### INFO: Content Security Policy (CSP) Header Not Set

- **CWE:** CWE-693 (Unknown)
- **Tool:** browser-scanner

**Description:**
Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks, including Cross Site Scripting (XSS) and data injection attacks. These attacks are used for everything from data theft to site defacement or distribution of malware. CSP provides a set of standard HTTP headers that allow website owners to declare approved sources of content that browsers should be allowed to load on that page — covered types are JavaScript, CSS, HTML frames, fonts, images and embeddable objects such as Java applets, ActiveX, audio and video files.

**Evidence:**
```
{
  "url": "https://claude4-195d9.firebaseapp.com/static/styles.css"
}
```


#### INFO: Content Security Policy (CSP) Header Not Set

- **CWE:** CWE-693 (Unknown)
- **Tool:** browser-scanner

**Description:**
Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks, including Cross Site Scripting (XSS) and data injection attacks. These attacks are used for everything from data theft to site defacement or distribution of malware. CSP provides a set of standard HTTP headers that allow website owners to declare approved sources of content that browsers should be allowed to load on that page — covered types are JavaScript, CSS, HTML frames, fonts, images and embeddable objects such as Java applets, ActiveX, audio and video files.

**Evidence:**
```
{
  "url": "https://claude4-195d9.firebaseapp.com/media/"
}
```


#### INFO: Content Security Policy (CSP) Header Not Set

- **CWE:** CWE-693 (Unknown)
- **Tool:** browser-scanner

**Description:**
Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks, including Cross Site Scripting (XSS) and data injection attacks. These attacks are used for everything from data theft to site defacement or distribution of malware. CSP provides a set of standard HTTP headers that allow website owners to declare approved sources of content that browsers should be allowed to load on that page — covered types are JavaScript, CSS, HTML frames, fonts, images and embeddable objects such as Java applets, ActiveX, audio and video files.

**Evidence:**
```
{
  "url": "https://claude4-195d9.firebaseapp.com/media/styles.css"
}
```


#### INFO: Content Security Policy (CSP) Header Not Set

- **CWE:** CWE-693 (Unknown)
- **Tool:** browser-scanner

**Description:**
Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks, including Cross Site Scripting (XSS) and data injection attacks. These attacks are used for everything from data theft to site defacement or distribution of malware. CSP provides a set of standard HTTP headers that allow website owners to declare approved sources of content that browsers should be allowed to load on that page — covered types are JavaScript, CSS, HTML frames, fonts, images and embeddable objects such as Java applets, ActiveX, audio and video files.

**Evidence:**
```
{
  "url": "https://claude4-195d9.firebaseapp.com/media/config.js"
}
```


#### INFO: Content Security Policy (CSP) Header Not Set

- **CWE:** CWE-693 (Unknown)
- **Tool:** browser-scanner

**Description:**
Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks, including Cross Site Scripting (XSS) and data injection attacks. These attacks are used for everything from data theft to site defacement or distribution of malware. CSP provides a set of standard HTTP headers that allow website owners to declare approved sources of content that browsers should be allowed to load on that page — covered types are JavaScript, CSS, HTML frames, fonts, images and embeddable objects such as Java applets, ActiveX, audio and video files.

**Evidence:**
```
{
  "url": "https://claude4-195d9.firebaseapp.com/media/app.js"
}
```


#### INFO: Content Security Policy (CSP) Header Not Set

- **CWE:** CWE-693 (Unknown)
- **Tool:** browser-scanner

**Description:**
Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks, including Cross Site Scripting (XSS) and data injection attacks. These attacks are used for everything from data theft to site defacement or distribution of malware. CSP provides a set of standard HTTP headers that allow website owners to declare approved sources of content that browsers should be allowed to load on that page — covered types are JavaScript, CSS, HTML frames, fonts, images and embeddable objects such as Java applets, ActiveX, audio and video files.

**Evidence:**
```
{
  "url": "https://claude4-195d9.firebaseapp.com/backup/"
}
```


#### INFO: Content Security Policy (CSP) Header Not Set

- **CWE:** CWE-693 (Unknown)
- **Tool:** browser-scanner

**Description:**
Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks, including Cross Site Scripting (XSS) and data injection attacks. These attacks are used for everything from data theft to site defacement or distribution of malware. CSP provides a set of standard HTTP headers that allow website owners to declare approved sources of content that browsers should be allowed to load on that page — covered types are JavaScript, CSS, HTML frames, fonts, images and embeddable objects such as Java applets, ActiveX, audio and video files.

**Evidence:**
```
{
  "url": "https://claude4-195d9.firebaseapp.com/backup/config.js"
}
```


#### INFO: Content Security Policy (CSP) Header Not Set

- **CWE:** CWE-693 (Unknown)
- **Tool:** browser-scanner

**Description:**
Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks, including Cross Site Scripting (XSS) and data injection attacks. These attacks are used for everything from data theft to site defacement or distribution of malware. CSP provides a set of standard HTTP headers that allow website owners to declare approved sources of content that browsers should be allowed to load on that page — covered types are JavaScript, CSS, HTML frames, fonts, images and embeddable objects such as Java applets, ActiveX, audio and video files.

**Evidence:**
```
{
  "url": "https://claude4-195d9.firebaseapp.com/backup/styles.css"
}
```


#### INFO: Content Security Policy (CSP) Header Not Set

- **CWE:** CWE-693 (Unknown)
- **Tool:** browser-scanner

**Description:**
Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks, including Cross Site Scripting (XSS) and data injection attacks. These attacks are used for everything from data theft to site defacement or distribution of malware. CSP provides a set of standard HTTP headers that allow website owners to declare approved sources of content that browsers should be allowed to load on that page — covered types are JavaScript, CSS, HTML frames, fonts, images and embeddable objects such as Java applets, ActiveX, audio and video files.

**Evidence:**
```
{
  "url": "https://claude4-195d9.firebaseapp.com/backup/app.js"
}
```


#### INFO: Content Security Policy (CSP) Header Not Set

- **CWE:** CWE-693 (Unknown)
- **Tool:** browser-scanner

**Description:**
Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks, including Cross Site Scripting (XSS) and data injection attacks. These attacks are used for everything from data theft to site defacement or distribution of malware. CSP provides a set of standard HTTP headers that allow website owners to declare approved sources of content that browsers should be allowed to load on that page — covered types are JavaScript, CSS, HTML frames, fonts, images and embeddable objects such as Java applets, ActiveX, audio and video files.

**Evidence:**
```
{
  "url": "https://claude4-195d9.firebaseapp.com/logs/"
}
```


#### INFO: Content Security Policy (CSP) Header Not Set

- **CWE:** CWE-693 (Unknown)
- **Tool:** browser-scanner

**Description:**
Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks, including Cross Site Scripting (XSS) and data injection attacks. These attacks are used for everything from data theft to site defacement or distribution of malware. CSP provides a set of standard HTTP headers that allow website owners to declare approved sources of content that browsers should be allowed to load on that page — covered types are JavaScript, CSS, HTML frames, fonts, images and embeddable objects such as Java applets, ActiveX, audio and video files.

**Evidence:**
```
{
  "url": "https://claude4-195d9.firebaseapp.com/logs/config.js"
}
```


#### INFO: Content Security Policy (CSP) Header Not Set

- **CWE:** CWE-693 (Unknown)
- **Tool:** browser-scanner

**Description:**
Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks, including Cross Site Scripting (XSS) and data injection attacks. These attacks are used for everything from data theft to site defacement or distribution of malware. CSP provides a set of standard HTTP headers that allow website owners to declare approved sources of content that browsers should be allowed to load on that page — covered types are JavaScript, CSS, HTML frames, fonts, images and embeddable objects such as Java applets, ActiveX, audio and video files.

**Evidence:**
```
{
  "url": "https://claude4-195d9.firebaseapp.com/logs/app.js"
}
```


#### INFO: Content Security Policy (CSP) Header Not Set

- **CWE:** CWE-693 (Unknown)
- **Tool:** browser-scanner

**Description:**
Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks, including Cross Site Scripting (XSS) and data injection attacks. These attacks are used for everything from data theft to site defacement or distribution of malware. CSP provides a set of standard HTTP headers that allow website owners to declare approved sources of content that browsers should be allowed to load on that page — covered types are JavaScript, CSS, HTML frames, fonts, images and embeddable objects such as Java applets, ActiveX, audio and video files.

**Evidence:**
```
{
  "url": "https://claude4-195d9.firebaseapp.com/logs/styles.css"
}
```


#### INFO: Content Security Policy (CSP) Header Not Set

- **CWE:** CWE-693 (Unknown)
- **Tool:** browser-scanner

**Description:**
Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks, including Cross Site Scripting (XSS) and data injection attacks. These attacks are used for everything from data theft to site defacement or distribution of malware. CSP provides a set of standard HTTP headers that allow website owners to declare approved sources of content that browsers should be allowed to load on that page — covered types are JavaScript, CSS, HTML frames, fonts, images and embeddable objects such as Java applets, ActiveX, audio and video files.

**Evidence:**
```
{
  "url": "https://claude4-195d9.firebaseapp.com/tmp/"
}
```


#### INFO: Content Security Policy (CSP) Header Not Set

- **CWE:** CWE-693 (Unknown)
- **Tool:** browser-scanner

**Description:**
Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks, including Cross Site Scripting (XSS) and data injection attacks. These attacks are used for everything from data theft to site defacement or distribution of malware. CSP provides a set of standard HTTP headers that allow website owners to declare approved sources of content that browsers should be allowed to load on that page — covered types are JavaScript, CSS, HTML frames, fonts, images and embeddable objects such as Java applets, ActiveX, audio and video files.

**Evidence:**
```
{
  "url": "https://claude4-195d9.firebaseapp.com/tmp/config.js"
}
```


#### INFO: Content Security Policy (CSP) Header Not Set

- **CWE:** CWE-693 (Unknown)
- **Tool:** browser-scanner

**Description:**
Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks, including Cross Site Scripting (XSS) and data injection attacks. These attacks are used for everything from data theft to site defacement or distribution of malware. CSP provides a set of standard HTTP headers that allow website owners to declare approved sources of content that browsers should be allowed to load on that page — covered types are JavaScript, CSS, HTML frames, fonts, images and embeddable objects such as Java applets, ActiveX, audio and video files.

**Evidence:**
```
{
  "url": "https://claude4-195d9.firebaseapp.com/tmp/styles.css"
}
```


#### INFO: Content Security Policy (CSP) Header Not Set

- **CWE:** CWE-693 (Unknown)
- **Tool:** browser-scanner

**Description:**
Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks, including Cross Site Scripting (XSS) and data injection attacks. These attacks are used for everything from data theft to site defacement or distribution of malware. CSP provides a set of standard HTTP headers that allow website owners to declare approved sources of content that browsers should be allowed to load on that page — covered types are JavaScript, CSS, HTML frames, fonts, images and embeddable objects such as Java applets, ActiveX, audio and video files.

**Evidence:**
```
{
  "url": "https://claude4-195d9.firebaseapp.com/tmp/app.js"
}
```


#### INFO: Content Security Policy (CSP) Header Not Set

- **CWE:** CWE-693 (Unknown)
- **Tool:** browser-scanner

**Description:**
Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks, including Cross Site Scripting (XSS) and data injection attacks. These attacks are used for everything from data theft to site defacement or distribution of malware. CSP provides a set of standard HTTP headers that allow website owners to declare approved sources of content that browsers should be allowed to load on that page — covered types are JavaScript, CSS, HTML frames, fonts, images and embeddable objects such as Java applets, ActiveX, audio and video files.

**Evidence:**
```
{
  "url": "https://claude4-195d9.firebaseapp.com/data/"
}
```


#### INFO: Content Security Policy (CSP) Header Not Set

- **CWE:** CWE-693 (Unknown)
- **Tool:** browser-scanner

**Description:**
Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks, including Cross Site Scripting (XSS) and data injection attacks. These attacks are used for everything from data theft to site defacement or distribution of malware. CSP provides a set of standard HTTP headers that allow website owners to declare approved sources of content that browsers should be allowed to load on that page — covered types are JavaScript, CSS, HTML frames, fonts, images and embeddable objects such as Java applets, ActiveX, audio and video files.

**Evidence:**
```
{
  "url": "https://claude4-195d9.firebaseapp.com/data/styles.css"
}
```


#### INFO: Content Security Policy (CSP) Header Not Set

- **CWE:** CWE-693 (Unknown)
- **Tool:** browser-scanner

**Description:**
Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks, including Cross Site Scripting (XSS) and data injection attacks. These attacks are used for everything from data theft to site defacement or distribution of malware. CSP provides a set of standard HTTP headers that allow website owners to declare approved sources of content that browsers should be allowed to load on that page — covered types are JavaScript, CSS, HTML frames, fonts, images and embeddable objects such as Java applets, ActiveX, audio and video files.

**Evidence:**
```
{
  "url": "https://claude4-195d9.firebaseapp.com/data/app.js"
}
```


#### INFO: Content Security Policy (CSP) Header Not Set

- **CWE:** CWE-693 (Unknown)
- **Tool:** browser-scanner

**Description:**
Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks, including Cross Site Scripting (XSS) and data injection attacks. These attacks are used for everything from data theft to site defacement or distribution of malware. CSP provides a set of standard HTTP headers that allow website owners to declare approved sources of content that browsers should be allowed to load on that page — covered types are JavaScript, CSS, HTML frames, fonts, images and embeddable objects such as Java applets, ActiveX, audio and video files.

**Evidence:**
```
{
  "url": "https://claude4-195d9.firebaseapp.com/data/config.js"
}
```


#### INFO: Content Security Policy (CSP) Header Not Set

- **CWE:** CWE-693 (Unknown)
- **Tool:** browser-scanner

**Description:**
Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks, including Cross Site Scripting (XSS) and data injection attacks. These attacks are used for everything from data theft to site defacement or distribution of malware. CSP provides a set of standard HTTP headers that allow website owners to declare approved sources of content that browsers should be allowed to load on that page — covered types are JavaScript, CSS, HTML frames, fonts, images and embeddable objects such as Java applets, ActiveX, audio and video files.

**Evidence:**
```
{
  "url": "https://claude4-195d9.firebaseapp.com/admin"
}
```


#### INFO: Content Security Policy (CSP) Header Not Set

- **CWE:** CWE-693 (Unknown)
- **Tool:** browser-scanner

**Description:**
Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks, including Cross Site Scripting (XSS) and data injection attacks. These attacks are used for everything from data theft to site defacement or distribution of malware. CSP provides a set of standard HTTP headers that allow website owners to declare approved sources of content that browsers should be allowed to load on that page — covered types are JavaScript, CSS, HTML frames, fonts, images and embeddable objects such as Java applets, ActiveX, audio and video files.

**Evidence:**
```
{
  "url": "https://claude4-195d9.firebaseapp.com/admin/"
}
```


#### INFO: Content Security Policy (CSP) Header Not Set

- **CWE:** CWE-693 (Unknown)
- **Tool:** browser-scanner

**Description:**
Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks, including Cross Site Scripting (XSS) and data injection attacks. These attacks are used for everything from data theft to site defacement or distribution of malware. CSP provides a set of standard HTTP headers that allow website owners to declare approved sources of content that browsers should be allowed to load on that page — covered types are JavaScript, CSS, HTML frames, fonts, images and embeddable objects such as Java applets, ActiveX, audio and video files.

**Evidence:**
```
{
  "url": "https://claude4-195d9.firebaseapp.com/admin/app.js"
}
```


#### INFO: Content Security Policy (CSP) Header Not Set

- **CWE:** CWE-693 (Unknown)
- **Tool:** browser-scanner

**Description:**
Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks, including Cross Site Scripting (XSS) and data injection attacks. These attacks are used for everything from data theft to site defacement or distribution of malware. CSP provides a set of standard HTTP headers that allow website owners to declare approved sources of content that browsers should be allowed to load on that page — covered types are JavaScript, CSS, HTML frames, fonts, images and embeddable objects such as Java applets, ActiveX, audio and video files.

**Evidence:**
```
{
  "url": "https://claude4-195d9.firebaseapp.com/admin/config.js"
}
```


#### INFO: Content Security Policy (CSP) Header Not Set

- **CWE:** CWE-693 (Unknown)
- **Tool:** browser-scanner

**Description:**
Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks, including Cross Site Scripting (XSS) and data injection attacks. These attacks are used for everything from data theft to site defacement or distribution of malware. CSP provides a set of standard HTTP headers that allow website owners to declare approved sources of content that browsers should be allowed to load on that page — covered types are JavaScript, CSS, HTML frames, fonts, images and embeddable objects such as Java applets, ActiveX, audio and video files.

**Evidence:**
```
{
  "url": "https://claude4-195d9.firebaseapp.com/admin/styles.css"
}
```


#### INFO: Content Security Policy (CSP) Header Not Set

- **CWE:** CWE-693 (Unknown)
- **Tool:** browser-scanner

**Description:**
Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks, including Cross Site Scripting (XSS) and data injection attacks. These attacks are used for everything from data theft to site defacement or distribution of malware. CSP provides a set of standard HTTP headers that allow website owners to declare approved sources of content that browsers should be allowed to load on that page — covered types are JavaScript, CSS, HTML frames, fonts, images and embeddable objects such as Java applets, ActiveX, audio and video files.

**Evidence:**
```
{
  "url": "https://claude4-195d9.firebaseapp.com/admin/dashboard"
}
```


#### INFO: Content Security Policy (CSP) Header Not Set

- **CWE:** CWE-693 (Unknown)
- **Tool:** browser-scanner

**Description:**
Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks, including Cross Site Scripting (XSS) and data injection attacks. These attacks are used for everything from data theft to site defacement or distribution of malware. CSP provides a set of standard HTTP headers that allow website owners to declare approved sources of content that browsers should be allowed to load on that page — covered types are JavaScript, CSS, HTML frames, fonts, images and embeddable objects such as Java applets, ActiveX, audio and video files.

**Evidence:**
```
{
  "url": "https://claude4-195d9.firebaseapp.com/admin/users"
}
```


#### INFO: Content Security Policy (CSP) Header Not Set

- **CWE:** CWE-693 (Unknown)
- **Tool:** browser-scanner

**Description:**
Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks, including Cross Site Scripting (XSS) and data injection attacks. These attacks are used for everything from data theft to site defacement or distribution of malware. CSP provides a set of standard HTTP headers that allow website owners to declare approved sources of content that browsers should be allowed to load on that page — covered types are JavaScript, CSS, HTML frames, fonts, images and embeddable objects such as Java applets, ActiveX, audio and video files.

**Evidence:**
```
{
  "url": "https://claude4-195d9.firebaseapp.com/admin/settings"
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
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js\"></script>",
  "url": "https://claude4-195d9.firebaseapp.com/",
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
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js\"></script>",
  "url": "https://claude4-195d9.firebaseapp.com/home",
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
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js\"></script>",
  "url": "https://claude4-195d9.firebaseapp.com/profile",
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
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js\"></script>",
  "url": "https://claude4-195d9.firebaseapp.com/settings",
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
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js\"></script>",
  "url": "https://claude4-195d9.firebaseapp.com/posts",
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
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js\"></script>",
  "url": "https://claude4-195d9.firebaseapp.com/messages",
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
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js\"></script>",
  "url": "https://claude4-195d9.firebaseapp.com/feed",
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
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js\"></script>",
  "url": "https://claude4-195d9.firebaseapp.com/__nonexistent__1765842152376_2640c865aba9d",
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
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js\"></script>",
  "url": "https://claude4-195d9.firebaseapp.com/?file=..%2F..%2F..%2Fetc%2Fpasswd",
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
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js\"></script>",
  "url": "https://claude4-195d9.firebaseapp.com/?file=..%5C..%5C..%5Cwindows%5Cwin.ini",
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
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js\"></script>",
  "url": "https://claude4-195d9.firebaseapp.com/?file=....%2F%2F....%2F%2F....%2F%2Fetc%2Fpasswd",
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
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js\"></script>",
  "url": "https://claude4-195d9.firebaseapp.com/?file=..%252f..%252f..%252fetc%2Fpasswd",
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
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js\"></script>",
  "url": "https://claude4-195d9.firebaseapp.com/?path=..%2F..%2F..%2Fetc%2Fpasswd",
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
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js\"></script>",
  "url": "https://claude4-195d9.firebaseapp.com/?path=..%5C..%5C..%5Cwindows%5Cwin.ini",
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
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js\"></script>",
  "url": "https://claude4-195d9.firebaseapp.com/?path=....%2F%2F....%2F%2F....%2F%2Fetc%2Fpasswd",
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
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js\"></script>",
  "url": "https://claude4-195d9.firebaseapp.com/?path=..%252f..%252f..%252fetc%2Fpasswd",
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
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js\"></script>",
  "url": "https://claude4-195d9.firebaseapp.com/?filepath=..%2F..%2F..%2Fetc%2Fpasswd",
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
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js\"></script>",
  "url": "https://claude4-195d9.firebaseapp.com/?filepath=..%5C..%5C..%5Cwindows%5Cwin.ini",
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
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js\"></script>",
  "url": "https://claude4-195d9.firebaseapp.com/?filepath=....%2F%2F....%2F%2F....%2F%2Fetc%2Fpasswd",
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
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js\"></script>",
  "url": "https://claude4-195d9.firebaseapp.com/?filepath=..%252f..%252f..%252fetc%2Fpasswd",
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
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js\"></script>",
  "url": "https://claude4-195d9.firebaseapp.com/?document=..%2F..%2F..%2Fetc%2Fpasswd",
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
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js\"></script>",
  "url": "https://claude4-195d9.firebaseapp.com/?document=..%5C..%5C..%5Cwindows%5Cwin.ini",
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
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js\"></script>",
  "url": "https://claude4-195d9.firebaseapp.com/?document=....%2F%2F....%2F%2F....%2F%2Fetc%2Fpasswd",
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
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js\"></script>",
  "url": "https://claude4-195d9.firebaseapp.com/?document=..%252f..%252f..%252fetc%2Fpasswd",
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
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js\"></script>",
  "url": "https://claude4-195d9.firebaseapp.com/?doc=..%2F..%2F..%2Fetc%2Fpasswd",
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
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js\"></script>",
  "url": "https://claude4-195d9.firebaseapp.com/?doc=..%5C..%5C..%5Cwindows%5Cwin.ini",
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
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js\"></script>",
  "url": "https://claude4-195d9.firebaseapp.com/?doc=....%2F%2F....%2F%2F....%2F%2Fetc%2Fpasswd",
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
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js\"></script>",
  "url": "https://claude4-195d9.firebaseapp.com/?doc=..%252f..%252f..%252fetc%2Fpasswd",
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
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js\"></script>",
  "url": "https://claude4-195d9.firebaseapp.com/?page=..%2F..%2F..%2Fetc%2Fpasswd",
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
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js\"></script>",
  "url": "https://claude4-195d9.firebaseapp.com/?page=..%5C..%5C..%5Cwindows%5Cwin.ini",
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
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js\"></script>",
  "url": "https://claude4-195d9.firebaseapp.com/?page=....%2F%2F....%2F%2F....%2F%2Fetc%2Fpasswd",
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
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js\"></script>",
  "url": "https://claude4-195d9.firebaseapp.com/?page=..%252f..%252f..%252fetc%2Fpasswd",
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
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js\"></script>",
  "url": "https://claude4-195d9.firebaseapp.com/?template=..%2F..%2F..%2Fetc%2Fpasswd",
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
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js\"></script>",
  "url": "https://claude4-195d9.firebaseapp.com/?template=..%5C..%5C..%5Cwindows%5Cwin.ini",
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
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js\"></script>",
  "url": "https://claude4-195d9.firebaseapp.com/?template=....%2F%2F....%2F%2F....%2F%2Fetc%2Fpasswd",
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
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js\"></script>",
  "url": "https://claude4-195d9.firebaseapp.com/?template=..%252f..%252f..%252fetc%2Fpasswd",
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
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js\"></script>",
  "url": "https://claude4-195d9.firebaseapp.com/?include=..%2F..%2F..%2Fetc%2Fpasswd",
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
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js\"></script>",
  "url": "https://claude4-195d9.firebaseapp.com/?include=..%5C..%5C..%5Cwindows%5Cwin.ini",
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
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js\"></script>",
  "url": "https://claude4-195d9.firebaseapp.com/?include=....%2F%2F....%2F%2F....%2F%2Fetc%2Fpasswd",
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
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js\"></script>",
  "url": "https://claude4-195d9.firebaseapp.com/?include=..%252f..%252f..%252fetc%2Fpasswd",
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
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js\"></script>",
  "url": "https://claude4-195d9.firebaseapp.com/?dir=..%2F..%2F..%2Fetc%2Fpasswd",
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
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js\"></script>",
  "url": "https://claude4-195d9.firebaseapp.com/?dir=..%5C..%5C..%5Cwindows%5Cwin.ini",
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
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js\"></script>",
  "url": "https://claude4-195d9.firebaseapp.com/?dir=....%2F%2F....%2F%2F....%2F%2Fetc%2Fpasswd",
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
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js\"></script>",
  "url": "https://claude4-195d9.firebaseapp.com/?dir=..%252f..%252f..%252fetc%2Fpasswd",
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
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js\"></script>",
  "url": "https://claude4-195d9.firebaseapp.com/?folder=..%2F..%2F..%2Fetc%2Fpasswd",
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
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js\"></script>",
  "url": "https://claude4-195d9.firebaseapp.com/?folder=..%5C..%5C..%5Cwindows%5Cwin.ini",
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
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js\"></script>",
  "url": "https://claude4-195d9.firebaseapp.com/?folder=....%2F%2F....%2F%2F....%2F%2Fetc%2Fpasswd",
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
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js\"></script>",
  "url": "https://claude4-195d9.firebaseapp.com/?folder=..%252f..%252f..%252fetc%2Fpasswd",
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
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js\"></script>",
  "url": "https://claude4-195d9.firebaseapp.com/?load=..%2F..%2F..%2Fetc%2Fpasswd",
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
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js\"></script>",
  "url": "https://claude4-195d9.firebaseapp.com/?load=..%5C..%5C..%5Cwindows%5Cwin.ini",
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
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js\"></script>",
  "url": "https://claude4-195d9.firebaseapp.com/?load=....%2F%2F....%2F%2F....%2F%2Fetc%2Fpasswd",
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
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js\"></script>",
  "url": "https://claude4-195d9.firebaseapp.com/?load=..%252f..%252f..%252fetc%2Fpasswd",
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
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js\"></script>",
  "url": "https://claude4-195d9.firebaseapp.com/?read=..%2F..%2F..%2Fetc%2Fpasswd",
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
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js\"></script>",
  "url": "https://claude4-195d9.firebaseapp.com/?read=..%5C..%5C..%5Cwindows%5Cwin.ini",
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
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js\"></script>",
  "url": "https://claude4-195d9.firebaseapp.com/?read=....%2F%2F....%2F%2F....%2F%2Fetc%2Fpasswd",
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
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js\"></script>",
  "url": "https://claude4-195d9.firebaseapp.com/?read=..%252f..%252f..%252fetc%2Fpasswd",
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
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js\"></script>",
  "url": "https://claude4-195d9.firebaseapp.com/images/",
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
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js\"></script>",
  "url": "https://claude4-195d9.firebaseapp.com/images/styles.css",
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
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js\"></script>",
  "url": "https://claude4-195d9.firebaseapp.com/images/app.js",
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
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js\"></script>",
  "url": "https://claude4-195d9.firebaseapp.com/images/config.js",
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
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js\"></script>",
  "url": "https://claude4-195d9.firebaseapp.com/uploads/",
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
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js\"></script>",
  "url": "https://claude4-195d9.firebaseapp.com/uploads/app.js",
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
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js\"></script>",
  "url": "https://claude4-195d9.firebaseapp.com/uploads/styles.css",
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
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js\"></script>",
  "url": "https://claude4-195d9.firebaseapp.com/uploads/config.js",
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
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js\"></script>",
  "url": "https://claude4-195d9.firebaseapp.com/files/",
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
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js\"></script>",
  "url": "https://claude4-195d9.firebaseapp.com/files/app.js",
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
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js\"></script>",
  "url": "https://claude4-195d9.firebaseapp.com/files/styles.css",
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
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js\"></script>",
  "url": "https://claude4-195d9.firebaseapp.com/files/config.js",
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
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js\"></script>",
  "url": "https://claude4-195d9.firebaseapp.com/assets/",
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
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js\"></script>",
  "url": "https://claude4-195d9.firebaseapp.com/assets/app.js",
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
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js\"></script>",
  "url": "https://claude4-195d9.firebaseapp.com/assets/config.js",
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
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js\"></script>",
  "url": "https://claude4-195d9.firebaseapp.com/assets/styles.css",
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
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js\"></script>",
  "url": "https://claude4-195d9.firebaseapp.com/static/",
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
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js\"></script>",
  "url": "https://claude4-195d9.firebaseapp.com/static/config.js",
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
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js\"></script>",
  "url": "https://claude4-195d9.firebaseapp.com/static/app.js",
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
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js\"></script>",
  "url": "https://claude4-195d9.firebaseapp.com/static/styles.css",
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
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js\"></script>",
  "url": "https://claude4-195d9.firebaseapp.com/media/",
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
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js\"></script>",
  "url": "https://claude4-195d9.firebaseapp.com/media/styles.css",
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
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js\"></script>",
  "url": "https://claude4-195d9.firebaseapp.com/media/config.js",
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
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js\"></script>",
  "url": "https://claude4-195d9.firebaseapp.com/media/app.js",
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
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js\"></script>",
  "url": "https://claude4-195d9.firebaseapp.com/backup/",
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
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js\"></script>",
  "url": "https://claude4-195d9.firebaseapp.com/backup/config.js",
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
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js\"></script>",
  "url": "https://claude4-195d9.firebaseapp.com/backup/styles.css",
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
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js\"></script>",
  "url": "https://claude4-195d9.firebaseapp.com/backup/app.js",
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
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js\"></script>",
  "url": "https://claude4-195d9.firebaseapp.com/logs/",
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
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js\"></script>",
  "url": "https://claude4-195d9.firebaseapp.com/logs/config.js",
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
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js\"></script>",
  "url": "https://claude4-195d9.firebaseapp.com/logs/app.js",
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
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js\"></script>",
  "url": "https://claude4-195d9.firebaseapp.com/logs/styles.css",
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
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js\"></script>",
  "url": "https://claude4-195d9.firebaseapp.com/tmp/",
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
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js\"></script>",
  "url": "https://claude4-195d9.firebaseapp.com/tmp/config.js",
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
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js\"></script>",
  "url": "https://claude4-195d9.firebaseapp.com/tmp/styles.css",
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
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js\"></script>",
  "url": "https://claude4-195d9.firebaseapp.com/tmp/app.js",
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
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js\"></script>",
  "url": "https://claude4-195d9.firebaseapp.com/data/",
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
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js\"></script>",
  "url": "https://claude4-195d9.firebaseapp.com/data/styles.css",
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
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js\"></script>",
  "url": "https://claude4-195d9.firebaseapp.com/data/app.js",
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
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js\"></script>",
  "url": "https://claude4-195d9.firebaseapp.com/data/config.js",
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
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js\"></script>",
  "url": "https://claude4-195d9.firebaseapp.com/admin",
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
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js\"></script>",
  "url": "https://claude4-195d9.firebaseapp.com/admin/",
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
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js\"></script>",
  "url": "https://claude4-195d9.firebaseapp.com/admin/app.js",
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
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js\"></script>",
  "url": "https://claude4-195d9.firebaseapp.com/admin/config.js",
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
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js\"></script>",
  "url": "https://claude4-195d9.firebaseapp.com/admin/styles.css",
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
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js\"></script>",
  "url": "https://claude4-195d9.firebaseapp.com/admin/dashboard",
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
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js\"></script>",
  "url": "https://claude4-195d9.firebaseapp.com/admin/users",
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
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js\"></script>",
  "url": "https://claude4-195d9.firebaseapp.com/admin/settings",
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
  "detail": "Admin",
  "url": "https://claude4-195d9.firebaseapp.com/",
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
  "url": "https://claude4-195d9.firebaseapp.com/config.js",
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
  "url": "https://claude4-195d9.firebaseapp.com/app.js",
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
  "detail": "Admin",
  "url": "https://claude4-195d9.firebaseapp.com/home",
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
  "detail": "Admin",
  "url": "https://claude4-195d9.firebaseapp.com/profile",
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
  "detail": "Admin",
  "url": "https://claude4-195d9.firebaseapp.com/settings",
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
  "detail": "Admin",
  "url": "https://claude4-195d9.firebaseapp.com/posts",
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
  "detail": "Admin",
  "url": "https://claude4-195d9.firebaseapp.com/messages",
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
  "detail": "Admin",
  "url": "https://claude4-195d9.firebaseapp.com/feed",
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
  "detail": "Admin",
  "url": "https://claude4-195d9.firebaseapp.com/__nonexistent__1765842152376_2640c865aba9d",
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
  "detail": "Admin",
  "url": "https://claude4-195d9.firebaseapp.com/?file=..%2F..%2F..%2Fetc%2Fpasswd",
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
  "detail": "Admin",
  "url": "https://claude4-195d9.firebaseapp.com/?file=..%5C..%5C..%5Cwindows%5Cwin.ini",
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
  "detail": "Admin",
  "url": "https://claude4-195d9.firebaseapp.com/?file=....%2F%2F....%2F%2F....%2F%2Fetc%2Fpasswd",
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
  "detail": "Admin",
  "url": "https://claude4-195d9.firebaseapp.com/?file=..%252f..%252f..%252fetc%2Fpasswd",
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
  "detail": "Admin",
  "url": "https://claude4-195d9.firebaseapp.com/?path=..%2F..%2F..%2Fetc%2Fpasswd",
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
  "detail": "Admin",
  "url": "https://claude4-195d9.firebaseapp.com/?path=..%5C..%5C..%5Cwindows%5Cwin.ini",
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
  "detail": "Admin",
  "url": "https://claude4-195d9.firebaseapp.com/?path=....%2F%2F....%2F%2F....%2F%2Fetc%2Fpasswd",
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
  "detail": "Admin",
  "url": "https://claude4-195d9.firebaseapp.com/?path=..%252f..%252f..%252fetc%2Fpasswd",
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
  "detail": "Admin",
  "url": "https://claude4-195d9.firebaseapp.com/?filepath=..%2F..%2F..%2Fetc%2Fpasswd",
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
  "detail": "Admin",
  "url": "https://claude4-195d9.firebaseapp.com/?filepath=..%5C..%5C..%5Cwindows%5Cwin.ini",
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
  "detail": "Admin",
  "url": "https://claude4-195d9.firebaseapp.com/?filepath=....%2F%2F....%2F%2F....%2F%2Fetc%2Fpasswd",
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
  "detail": "Admin",
  "url": "https://claude4-195d9.firebaseapp.com/?filepath=..%252f..%252f..%252fetc%2Fpasswd",
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
  "detail": "Admin",
  "url": "https://claude4-195d9.firebaseapp.com/?document=..%2F..%2F..%2Fetc%2Fpasswd",
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
  "detail": "Admin",
  "url": "https://claude4-195d9.firebaseapp.com/?document=..%5C..%5C..%5Cwindows%5Cwin.ini",
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
  "detail": "Admin",
  "url": "https://claude4-195d9.firebaseapp.com/?document=....%2F%2F....%2F%2F....%2F%2Fetc%2Fpasswd",
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
  "detail": "Admin",
  "url": "https://claude4-195d9.firebaseapp.com/?document=..%252f..%252f..%252fetc%2Fpasswd",
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
  "detail": "Admin",
  "url": "https://claude4-195d9.firebaseapp.com/?doc=..%2F..%2F..%2Fetc%2Fpasswd",
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
  "detail": "Admin",
  "url": "https://claude4-195d9.firebaseapp.com/?doc=..%5C..%5C..%5Cwindows%5Cwin.ini",
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
  "detail": "Admin",
  "url": "https://claude4-195d9.firebaseapp.com/?doc=....%2F%2F....%2F%2F....%2F%2Fetc%2Fpasswd",
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
  "detail": "Admin",
  "url": "https://claude4-195d9.firebaseapp.com/?doc=..%252f..%252f..%252fetc%2Fpasswd",
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
  "detail": "Admin",
  "url": "https://claude4-195d9.firebaseapp.com/?page=..%2F..%2F..%2Fetc%2Fpasswd",
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
  "detail": "Admin",
  "url": "https://claude4-195d9.firebaseapp.com/?page=..%5C..%5C..%5Cwindows%5Cwin.ini",
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
  "detail": "Admin",
  "url": "https://claude4-195d9.firebaseapp.com/?page=....%2F%2F....%2F%2F....%2F%2Fetc%2Fpasswd",
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
  "detail": "Admin",
  "url": "https://claude4-195d9.firebaseapp.com/?page=..%252f..%252f..%252fetc%2Fpasswd",
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
  "detail": "Admin",
  "url": "https://claude4-195d9.firebaseapp.com/?template=..%2F..%2F..%2Fetc%2Fpasswd",
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
  "detail": "Admin",
  "url": "https://claude4-195d9.firebaseapp.com/?template=..%5C..%5C..%5Cwindows%5Cwin.ini",
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
  "detail": "Admin",
  "url": "https://claude4-195d9.firebaseapp.com/?template=....%2F%2F....%2F%2F....%2F%2Fetc%2Fpasswd",
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
  "detail": "Admin",
  "url": "https://claude4-195d9.firebaseapp.com/?template=..%252f..%252f..%252fetc%2Fpasswd",
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
  "detail": "Admin",
  "url": "https://claude4-195d9.firebaseapp.com/?include=..%2F..%2F..%2Fetc%2Fpasswd",
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
  "detail": "Admin",
  "url": "https://claude4-195d9.firebaseapp.com/?include=..%5C..%5C..%5Cwindows%5Cwin.ini",
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
  "detail": "Admin",
  "url": "https://claude4-195d9.firebaseapp.com/?include=....%2F%2F....%2F%2F....%2F%2Fetc%2Fpasswd",
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
  "detail": "Admin",
  "url": "https://claude4-195d9.firebaseapp.com/?include=..%252f..%252f..%252fetc%2Fpasswd",
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
  "detail": "Admin",
  "url": "https://claude4-195d9.firebaseapp.com/?dir=..%2F..%2F..%2Fetc%2Fpasswd",
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
  "detail": "Admin",
  "url": "https://claude4-195d9.firebaseapp.com/?dir=..%5C..%5C..%5Cwindows%5Cwin.ini",
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
  "detail": "Admin",
  "url": "https://claude4-195d9.firebaseapp.com/?dir=....%2F%2F....%2F%2F....%2F%2Fetc%2Fpasswd",
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
  "detail": "Admin",
  "url": "https://claude4-195d9.firebaseapp.com/?dir=..%252f..%252f..%252fetc%2Fpasswd",
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
  "detail": "Admin",
  "url": "https://claude4-195d9.firebaseapp.com/?folder=..%2F..%2F..%2Fetc%2Fpasswd",
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
  "detail": "Admin",
  "url": "https://claude4-195d9.firebaseapp.com/?folder=..%5C..%5C..%5Cwindows%5Cwin.ini",
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
  "detail": "Admin",
  "url": "https://claude4-195d9.firebaseapp.com/?folder=....%2F%2F....%2F%2F....%2F%2Fetc%2Fpasswd",
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
  "detail": "Admin",
  "url": "https://claude4-195d9.firebaseapp.com/?folder=..%252f..%252f..%252fetc%2Fpasswd",
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
  "detail": "Admin",
  "url": "https://claude4-195d9.firebaseapp.com/?load=..%2F..%2F..%2Fetc%2Fpasswd",
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
  "detail": "Admin",
  "url": "https://claude4-195d9.firebaseapp.com/?load=..%5C..%5C..%5Cwindows%5Cwin.ini",
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
  "detail": "Admin",
  "url": "https://claude4-195d9.firebaseapp.com/?load=....%2F%2F....%2F%2F....%2F%2Fetc%2Fpasswd",
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
  "detail": "Admin",
  "url": "https://claude4-195d9.firebaseapp.com/?load=..%252f..%252f..%252fetc%2Fpasswd",
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
  "detail": "Admin",
  "url": "https://claude4-195d9.firebaseapp.com/?read=..%2F..%2F..%2Fetc%2Fpasswd",
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
  "detail": "Admin",
  "url": "https://claude4-195d9.firebaseapp.com/?read=..%5C..%5C..%5Cwindows%5Cwin.ini",
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
  "detail": "Admin",
  "url": "https://claude4-195d9.firebaseapp.com/?read=....%2F%2F....%2F%2F....%2F%2Fetc%2Fpasswd",
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
  "detail": "Admin",
  "url": "https://claude4-195d9.firebaseapp.com/?read=..%252f..%252f..%252fetc%2Fpasswd",
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
  "detail": "Admin",
  "url": "https://claude4-195d9.firebaseapp.com/images/",
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
  "detail": "Admin",
  "url": "https://claude4-195d9.firebaseapp.com/images/styles.css",
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
  "detail": "Admin",
  "url": "https://claude4-195d9.firebaseapp.com/uploads/",
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
  "detail": "Admin",
  "url": "https://claude4-195d9.firebaseapp.com/uploads/styles.css",
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
  "detail": "Admin",
  "url": "https://claude4-195d9.firebaseapp.com/files/",
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
  "detail": "Admin",
  "url": "https://claude4-195d9.firebaseapp.com/files/styles.css",
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
  "detail": "Admin",
  "url": "https://claude4-195d9.firebaseapp.com/assets/",
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
  "detail": "Admin",
  "url": "https://claude4-195d9.firebaseapp.com/assets/styles.css",
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
  "detail": "Admin",
  "url": "https://claude4-195d9.firebaseapp.com/static/",
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
  "detail": "Admin",
  "url": "https://claude4-195d9.firebaseapp.com/static/styles.css",
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
  "detail": "Admin",
  "url": "https://claude4-195d9.firebaseapp.com/media/",
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
  "detail": "Admin",
  "url": "https://claude4-195d9.firebaseapp.com/media/styles.css",
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
  "detail": "Admin",
  "url": "https://claude4-195d9.firebaseapp.com/backup/",
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
  "detail": "Admin",
  "url": "https://claude4-195d9.firebaseapp.com/backup/styles.css",
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
  "detail": "Admin",
  "url": "https://claude4-195d9.firebaseapp.com/logs/",
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
  "detail": "Admin",
  "url": "https://claude4-195d9.firebaseapp.com/logs/styles.css",
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
  "detail": "Admin",
  "url": "https://claude4-195d9.firebaseapp.com/tmp/",
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
  "detail": "Admin",
  "url": "https://claude4-195d9.firebaseapp.com/tmp/styles.css",
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
  "detail": "Admin",
  "url": "https://claude4-195d9.firebaseapp.com/data/",
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
  "detail": "Admin",
  "url": "https://claude4-195d9.firebaseapp.com/data/styles.css",
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
  "detail": "Admin",
  "url": "https://claude4-195d9.firebaseapp.com/admin",
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
  "detail": "Admin",
  "url": "https://claude4-195d9.firebaseapp.com/admin/",
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
  "detail": "Admin",
  "url": "https://claude4-195d9.firebaseapp.com/admin/styles.css",
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
  "detail": "Admin",
  "url": "https://claude4-195d9.firebaseapp.com/admin/dashboard",
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
  "detail": "Admin",
  "url": "https://claude4-195d9.firebaseapp.com/admin/users",
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
  "detail": "Admin",
  "url": "https://claude4-195d9.firebaseapp.com/admin/settings",
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
  "url": "https://claude4-195d9.firebaseapp.com/",
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
  "url": "https://claude4-195d9.firebaseapp.com/home",
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
  "url": "https://claude4-195d9.firebaseapp.com/profile",
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
  "url": "https://claude4-195d9.firebaseapp.com/settings",
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
  "url": "https://claude4-195d9.firebaseapp.com/posts",
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
  "url": "https://claude4-195d9.firebaseapp.com/messages",
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
  "url": "https://claude4-195d9.firebaseapp.com/feed",
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
  "url": "https://claude4-195d9.firebaseapp.com/__nonexistent__1765842152376_2640c865aba9d",
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
  "url": "https://claude4-195d9.firebaseapp.com/?file=..%2F..%2F..%2Fetc%2Fpasswd",
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
  "url": "https://claude4-195d9.firebaseapp.com/?file=..%5C..%5C..%5Cwindows%5Cwin.ini",
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
  "url": "https://claude4-195d9.firebaseapp.com/?file=....%2F%2F....%2F%2F....%2F%2Fetc%2Fpasswd",
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
  "url": "https://claude4-195d9.firebaseapp.com/?file=..%252f..%252f..%252fetc%2Fpasswd",
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
  "url": "https://claude4-195d9.firebaseapp.com/?path=..%2F..%2F..%2Fetc%2Fpasswd",
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
  "url": "https://claude4-195d9.firebaseapp.com/?path=..%5C..%5C..%5Cwindows%5Cwin.ini",
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
  "url": "https://claude4-195d9.firebaseapp.com/?path=....%2F%2F....%2F%2F....%2F%2Fetc%2Fpasswd",
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
  "url": "https://claude4-195d9.firebaseapp.com/?path=..%252f..%252f..%252fetc%2Fpasswd",
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
  "url": "https://claude4-195d9.firebaseapp.com/?filepath=..%2F..%2F..%2Fetc%2Fpasswd",
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
  "url": "https://claude4-195d9.firebaseapp.com/?filepath=..%5C..%5C..%5Cwindows%5Cwin.ini",
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
  "url": "https://claude4-195d9.firebaseapp.com/?filepath=....%2F%2F....%2F%2F....%2F%2Fetc%2Fpasswd",
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
  "url": "https://claude4-195d9.firebaseapp.com/?filepath=..%252f..%252f..%252fetc%2Fpasswd",
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
  "url": "https://claude4-195d9.firebaseapp.com/?document=..%2F..%2F..%2Fetc%2Fpasswd",
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
  "url": "https://claude4-195d9.firebaseapp.com/?document=..%5C..%5C..%5Cwindows%5Cwin.ini",
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
  "url": "https://claude4-195d9.firebaseapp.com/?document=....%2F%2F....%2F%2F....%2F%2Fetc%2Fpasswd",
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
  "url": "https://claude4-195d9.firebaseapp.com/?document=..%252f..%252f..%252fetc%2Fpasswd",
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
  "url": "https://claude4-195d9.firebaseapp.com/?doc=..%2F..%2F..%2Fetc%2Fpasswd",
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
  "url": "https://claude4-195d9.firebaseapp.com/?doc=..%5C..%5C..%5Cwindows%5Cwin.ini",
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
  "url": "https://claude4-195d9.firebaseapp.com/?doc=....%2F%2F....%2F%2F....%2F%2Fetc%2Fpasswd",
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
  "url": "https://claude4-195d9.firebaseapp.com/?doc=..%252f..%252f..%252fetc%2Fpasswd",
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
  "url": "https://claude4-195d9.firebaseapp.com/?page=..%2F..%2F..%2Fetc%2Fpasswd",
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
  "url": "https://claude4-195d9.firebaseapp.com/?page=..%5C..%5C..%5Cwindows%5Cwin.ini",
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
  "url": "https://claude4-195d9.firebaseapp.com/?page=....%2F%2F....%2F%2F....%2F%2Fetc%2Fpasswd",
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
  "url": "https://claude4-195d9.firebaseapp.com/?page=..%252f..%252f..%252fetc%2Fpasswd",
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
  "url": "https://claude4-195d9.firebaseapp.com/?template=..%2F..%2F..%2Fetc%2Fpasswd",
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
  "url": "https://claude4-195d9.firebaseapp.com/?template=..%5C..%5C..%5Cwindows%5Cwin.ini",
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
  "url": "https://claude4-195d9.firebaseapp.com/?template=....%2F%2F....%2F%2F....%2F%2Fetc%2Fpasswd",
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
  "url": "https://claude4-195d9.firebaseapp.com/?template=..%252f..%252f..%252fetc%2Fpasswd",
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
  "url": "https://claude4-195d9.firebaseapp.com/?include=..%2F..%2F..%2Fetc%2Fpasswd",
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
  "url": "https://claude4-195d9.firebaseapp.com/?include=..%5C..%5C..%5Cwindows%5Cwin.ini",
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
  "url": "https://claude4-195d9.firebaseapp.com/?include=....%2F%2F....%2F%2F....%2F%2Fetc%2Fpasswd",
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
  "url": "https://claude4-195d9.firebaseapp.com/?include=..%252f..%252f..%252fetc%2Fpasswd",
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
  "url": "https://claude4-195d9.firebaseapp.com/?dir=..%2F..%2F..%2Fetc%2Fpasswd",
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
  "url": "https://claude4-195d9.firebaseapp.com/?dir=..%5C..%5C..%5Cwindows%5Cwin.ini",
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
  "url": "https://claude4-195d9.firebaseapp.com/?dir=....%2F%2F....%2F%2F....%2F%2Fetc%2Fpasswd",
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
  "url": "https://claude4-195d9.firebaseapp.com/?dir=..%252f..%252f..%252fetc%2Fpasswd",
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
  "url": "https://claude4-195d9.firebaseapp.com/?folder=..%2F..%2F..%2Fetc%2Fpasswd",
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
  "url": "https://claude4-195d9.firebaseapp.com/?folder=..%5C..%5C..%5Cwindows%5Cwin.ini",
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
  "url": "https://claude4-195d9.firebaseapp.com/?folder=....%2F%2F....%2F%2F....%2F%2Fetc%2Fpasswd",
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
  "url": "https://claude4-195d9.firebaseapp.com/?folder=..%252f..%252f..%252fetc%2Fpasswd",
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
  "url": "https://claude4-195d9.firebaseapp.com/?load=..%2F..%2F..%2Fetc%2Fpasswd",
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
  "url": "https://claude4-195d9.firebaseapp.com/?load=..%5C..%5C..%5Cwindows%5Cwin.ini",
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
  "url": "https://claude4-195d9.firebaseapp.com/?load=....%2F%2F....%2F%2F....%2F%2Fetc%2Fpasswd",
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
  "url": "https://claude4-195d9.firebaseapp.com/?load=..%252f..%252f..%252fetc%2Fpasswd",
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
  "url": "https://claude4-195d9.firebaseapp.com/?read=..%2F..%2F..%2Fetc%2Fpasswd",
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
  "url": "https://claude4-195d9.firebaseapp.com/?read=..%5C..%5C..%5Cwindows%5Cwin.ini",
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
  "url": "https://claude4-195d9.firebaseapp.com/?read=....%2F%2F....%2F%2F....%2F%2Fetc%2Fpasswd",
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
  "url": "https://claude4-195d9.firebaseapp.com/?read=..%252f..%252f..%252fetc%2Fpasswd",
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
  "url": "https://claude4-195d9.firebaseapp.com/images/",
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
  "url": "https://claude4-195d9.firebaseapp.com/images/styles.css",
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
  "url": "https://claude4-195d9.firebaseapp.com/images/app.js",
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
  "url": "https://claude4-195d9.firebaseapp.com/images/config.js",
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
  "url": "https://claude4-195d9.firebaseapp.com/uploads/",
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
  "url": "https://claude4-195d9.firebaseapp.com/uploads/app.js",
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
  "url": "https://claude4-195d9.firebaseapp.com/uploads/styles.css",
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
  "url": "https://claude4-195d9.firebaseapp.com/uploads/config.js",
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
  "url": "https://claude4-195d9.firebaseapp.com/files/",
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
  "url": "https://claude4-195d9.firebaseapp.com/files/app.js",
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
  "url": "https://claude4-195d9.firebaseapp.com/files/styles.css",
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
  "url": "https://claude4-195d9.firebaseapp.com/files/config.js",
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
  "url": "https://claude4-195d9.firebaseapp.com/assets/",
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
  "url": "https://claude4-195d9.firebaseapp.com/assets/app.js",
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
  "url": "https://claude4-195d9.firebaseapp.com/assets/config.js",
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
  "url": "https://claude4-195d9.firebaseapp.com/assets/styles.css",
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
  "url": "https://claude4-195d9.firebaseapp.com/static/",
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
  "url": "https://claude4-195d9.firebaseapp.com/static/config.js",
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
  "url": "https://claude4-195d9.firebaseapp.com/static/app.js",
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
  "url": "https://claude4-195d9.firebaseapp.com/static/styles.css",
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
  "url": "https://claude4-195d9.firebaseapp.com/media/",
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
  "url": "https://claude4-195d9.firebaseapp.com/media/styles.css",
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
  "url": "https://claude4-195d9.firebaseapp.com/media/config.js",
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
  "url": "https://claude4-195d9.firebaseapp.com/media/app.js",
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
  "url": "https://claude4-195d9.firebaseapp.com/backup/",
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
  "url": "https://claude4-195d9.firebaseapp.com/backup/config.js",
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
  "url": "https://claude4-195d9.firebaseapp.com/backup/styles.css",
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
  "url": "https://claude4-195d9.firebaseapp.com/backup/app.js",
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
  "url": "https://claude4-195d9.firebaseapp.com/logs/",
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
  "url": "https://claude4-195d9.firebaseapp.com/logs/config.js",
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
  "url": "https://claude4-195d9.firebaseapp.com/logs/app.js",
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
  "url": "https://claude4-195d9.firebaseapp.com/logs/styles.css",
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
  "url": "https://claude4-195d9.firebaseapp.com/tmp/",
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
  "url": "https://claude4-195d9.firebaseapp.com/tmp/config.js",
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
  "url": "https://claude4-195d9.firebaseapp.com/tmp/styles.css",
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
  "url": "https://claude4-195d9.firebaseapp.com/tmp/app.js",
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
  "url": "https://claude4-195d9.firebaseapp.com/data/",
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
  "url": "https://claude4-195d9.firebaseapp.com/data/styles.css",
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
  "url": "https://claude4-195d9.firebaseapp.com/data/app.js",
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
  "url": "https://claude4-195d9.firebaseapp.com/data/config.js",
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
  "url": "https://claude4-195d9.firebaseapp.com/admin",
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
  "url": "https://claude4-195d9.firebaseapp.com/admin/",
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
  "url": "https://claude4-195d9.firebaseapp.com/admin/app.js",
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
  "url": "https://claude4-195d9.firebaseapp.com/admin/config.js",
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
  "url": "https://claude4-195d9.firebaseapp.com/admin/styles.css",
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
  "url": "https://claude4-195d9.firebaseapp.com/admin/dashboard",
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
  "url": "https://claude4-195d9.firebaseapp.com/admin/users",
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
  "url": "https://claude4-195d9.firebaseapp.com/admin/settings",
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
  "url": "https://claude4-195d9.firebaseapp.com/administrator",
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
  "detail": "<a href=\"#\" onclick=\"showForgotPassword()\">Forgot password?</a>",
  "url": "https://claude4-195d9.firebaseapp.com/",
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
  "detail": "<a href=\"#\" onclick=\"showForgotPassword()\">Forgot password?</a>",
  "url": "https://claude4-195d9.firebaseapp.com/home",
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
  "detail": "<a href=\"#\" onclick=\"showForgotPassword()\">Forgot password?</a>",
  "url": "https://claude4-195d9.firebaseapp.com/profile",
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
  "detail": "<a href=\"#\" onclick=\"showForgotPassword()\">Forgot password?</a>",
  "url": "https://claude4-195d9.firebaseapp.com/settings",
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
  "detail": "<a href=\"#\" onclick=\"showForgotPassword()\">Forgot password?</a>",
  "url": "https://claude4-195d9.firebaseapp.com/posts",
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
  "detail": "<a href=\"#\" onclick=\"showForgotPassword()\">Forgot password?</a>",
  "url": "https://claude4-195d9.firebaseapp.com/messages",
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
  "detail": "<a href=\"#\" onclick=\"showForgotPassword()\">Forgot password?</a>",
  "url": "https://claude4-195d9.firebaseapp.com/feed",
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
  "detail": "<a href=\"#\" onclick=\"showForgotPassword()\">Forgot password?</a>",
  "url": "https://claude4-195d9.firebaseapp.com/__nonexistent__1765842152376_2640c865aba9d",
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
  "detail": "<a href=\"#\" onclick=\"showForgotPassword()\">Forgot password?</a>",
  "url": "https://claude4-195d9.firebaseapp.com/?file=..%2F..%2F..%2Fetc%2Fpasswd",
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
  "detail": "<a href=\"#\" onclick=\"showForgotPassword()\">Forgot password?</a>",
  "url": "https://claude4-195d9.firebaseapp.com/?file=..%5C..%5C..%5Cwindows%5Cwin.ini",
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
  "detail": "<a href=\"#\" onclick=\"showForgotPassword()\">Forgot password?</a>",
  "url": "https://claude4-195d9.firebaseapp.com/?file=....%2F%2F....%2F%2F....%2F%2Fetc%2Fpasswd",
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
  "detail": "<a href=\"#\" onclick=\"showForgotPassword()\">Forgot password?</a>",
  "url": "https://claude4-195d9.firebaseapp.com/?file=..%252f..%252f..%252fetc%2Fpasswd",
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
  "detail": "<a href=\"#\" onclick=\"showForgotPassword()\">Forgot password?</a>",
  "url": "https://claude4-195d9.firebaseapp.com/?path=..%2F..%2F..%2Fetc%2Fpasswd",
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
  "detail": "<a href=\"#\" onclick=\"showForgotPassword()\">Forgot password?</a>",
  "url": "https://claude4-195d9.firebaseapp.com/?path=..%5C..%5C..%5Cwindows%5Cwin.ini",
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
  "detail": "<a href=\"#\" onclick=\"showForgotPassword()\">Forgot password?</a>",
  "url": "https://claude4-195d9.firebaseapp.com/?path=....%2F%2F....%2F%2F....%2F%2Fetc%2Fpasswd",
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
  "detail": "<a href=\"#\" onclick=\"showForgotPassword()\">Forgot password?</a>",
  "url": "https://claude4-195d9.firebaseapp.com/?path=..%252f..%252f..%252fetc%2Fpasswd",
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
  "detail": "<a href=\"#\" onclick=\"showForgotPassword()\">Forgot password?</a>",
  "url": "https://claude4-195d9.firebaseapp.com/?filepath=..%2F..%2F..%2Fetc%2Fpasswd",
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
  "detail": "<a href=\"#\" onclick=\"showForgotPassword()\">Forgot password?</a>",
  "url": "https://claude4-195d9.firebaseapp.com/?filepath=..%5C..%5C..%5Cwindows%5Cwin.ini",
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
  "detail": "<a href=\"#\" onclick=\"showForgotPassword()\">Forgot password?</a>",
  "url": "https://claude4-195d9.firebaseapp.com/?filepath=....%2F%2F....%2F%2F....%2F%2Fetc%2Fpasswd",
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
  "detail": "<a href=\"#\" onclick=\"showForgotPassword()\">Forgot password?</a>",
  "url": "https://claude4-195d9.firebaseapp.com/?filepath=..%252f..%252f..%252fetc%2Fpasswd",
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
  "detail": "<a href=\"#\" onclick=\"showForgotPassword()\">Forgot password?</a>",
  "url": "https://claude4-195d9.firebaseapp.com/?document=..%2F..%2F..%2Fetc%2Fpasswd",
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
  "detail": "<a href=\"#\" onclick=\"showForgotPassword()\">Forgot password?</a>",
  "url": "https://claude4-195d9.firebaseapp.com/?document=..%5C..%5C..%5Cwindows%5Cwin.ini",
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
  "detail": "<a href=\"#\" onclick=\"showForgotPassword()\">Forgot password?</a>",
  "url": "https://claude4-195d9.firebaseapp.com/?document=....%2F%2F....%2F%2F....%2F%2Fetc%2Fpasswd",
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
  "detail": "<a href=\"#\" onclick=\"showForgotPassword()\">Forgot password?</a>",
  "url": "https://claude4-195d9.firebaseapp.com/?document=..%252f..%252f..%252fetc%2Fpasswd",
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
  "detail": "<a href=\"#\" onclick=\"showForgotPassword()\">Forgot password?</a>",
  "url": "https://claude4-195d9.firebaseapp.com/?doc=..%2F..%2F..%2Fetc%2Fpasswd",
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
  "detail": "<a href=\"#\" onclick=\"showForgotPassword()\">Forgot password?</a>",
  "url": "https://claude4-195d9.firebaseapp.com/?doc=..%5C..%5C..%5Cwindows%5Cwin.ini",
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
  "detail": "<a href=\"#\" onclick=\"showForgotPassword()\">Forgot password?</a>",
  "url": "https://claude4-195d9.firebaseapp.com/?doc=....%2F%2F....%2F%2F....%2F%2Fetc%2Fpasswd",
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
  "detail": "<a href=\"#\" onclick=\"showForgotPassword()\">Forgot password?</a>",
  "url": "https://claude4-195d9.firebaseapp.com/?doc=..%252f..%252f..%252fetc%2Fpasswd",
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
  "detail": "<a href=\"#\" onclick=\"showForgotPassword()\">Forgot password?</a>",
  "url": "https://claude4-195d9.firebaseapp.com/?page=..%2F..%2F..%2Fetc%2Fpasswd",
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
  "detail": "<a href=\"#\" onclick=\"showForgotPassword()\">Forgot password?</a>",
  "url": "https://claude4-195d9.firebaseapp.com/?page=..%5C..%5C..%5Cwindows%5Cwin.ini",
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
  "detail": "<a href=\"#\" onclick=\"showForgotPassword()\">Forgot password?</a>",
  "url": "https://claude4-195d9.firebaseapp.com/?page=....%2F%2F....%2F%2F....%2F%2Fetc%2Fpasswd",
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
  "detail": "<a href=\"#\" onclick=\"showForgotPassword()\">Forgot password?</a>",
  "url": "https://claude4-195d9.firebaseapp.com/?page=..%252f..%252f..%252fetc%2Fpasswd",
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
  "detail": "<a href=\"#\" onclick=\"showForgotPassword()\">Forgot password?</a>",
  "url": "https://claude4-195d9.firebaseapp.com/?template=..%2F..%2F..%2Fetc%2Fpasswd",
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
  "detail": "<a href=\"#\" onclick=\"showForgotPassword()\">Forgot password?</a>",
  "url": "https://claude4-195d9.firebaseapp.com/?template=..%5C..%5C..%5Cwindows%5Cwin.ini",
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
  "detail": "<a href=\"#\" onclick=\"showForgotPassword()\">Forgot password?</a>",
  "url": "https://claude4-195d9.firebaseapp.com/?template=....%2F%2F....%2F%2F....%2F%2Fetc%2Fpasswd",
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
  "detail": "<a href=\"#\" onclick=\"showForgotPassword()\">Forgot password?</a>",
  "url": "https://claude4-195d9.firebaseapp.com/?template=..%252f..%252f..%252fetc%2Fpasswd",
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
  "detail": "<a href=\"#\" onclick=\"showForgotPassword()\">Forgot password?</a>",
  "url": "https://claude4-195d9.firebaseapp.com/?include=..%2F..%2F..%2Fetc%2Fpasswd",
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
  "detail": "<a href=\"#\" onclick=\"showForgotPassword()\">Forgot password?</a>",
  "url": "https://claude4-195d9.firebaseapp.com/?include=..%5C..%5C..%5Cwindows%5Cwin.ini",
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
  "detail": "<a href=\"#\" onclick=\"showForgotPassword()\">Forgot password?</a>",
  "url": "https://claude4-195d9.firebaseapp.com/?include=....%2F%2F....%2F%2F....%2F%2Fetc%2Fpasswd",
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
  "detail": "<a href=\"#\" onclick=\"showForgotPassword()\">Forgot password?</a>",
  "url": "https://claude4-195d9.firebaseapp.com/?include=..%252f..%252f..%252fetc%2Fpasswd",
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
  "detail": "<a href=\"#\" onclick=\"showForgotPassword()\">Forgot password?</a>",
  "url": "https://claude4-195d9.firebaseapp.com/?dir=..%2F..%2F..%2Fetc%2Fpasswd",
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
  "detail": "<a href=\"#\" onclick=\"showForgotPassword()\">Forgot password?</a>",
  "url": "https://claude4-195d9.firebaseapp.com/?dir=..%5C..%5C..%5Cwindows%5Cwin.ini",
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
  "detail": "<a href=\"#\" onclick=\"showForgotPassword()\">Forgot password?</a>",
  "url": "https://claude4-195d9.firebaseapp.com/?dir=....%2F%2F....%2F%2F....%2F%2Fetc%2Fpasswd",
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
  "detail": "<a href=\"#\" onclick=\"showForgotPassword()\">Forgot password?</a>",
  "url": "https://claude4-195d9.firebaseapp.com/?dir=..%252f..%252f..%252fetc%2Fpasswd",
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
  "detail": "<a href=\"#\" onclick=\"showForgotPassword()\">Forgot password?</a>",
  "url": "https://claude4-195d9.firebaseapp.com/?folder=..%2F..%2F..%2Fetc%2Fpasswd",
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
  "detail": "<a href=\"#\" onclick=\"showForgotPassword()\">Forgot password?</a>",
  "url": "https://claude4-195d9.firebaseapp.com/?folder=..%5C..%5C..%5Cwindows%5Cwin.ini",
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
  "detail": "<a href=\"#\" onclick=\"showForgotPassword()\">Forgot password?</a>",
  "url": "https://claude4-195d9.firebaseapp.com/?folder=....%2F%2F....%2F%2F....%2F%2Fetc%2Fpasswd",
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
  "detail": "<a href=\"#\" onclick=\"showForgotPassword()\">Forgot password?</a>",
  "url": "https://claude4-195d9.firebaseapp.com/?folder=..%252f..%252f..%252fetc%2Fpasswd",
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
  "detail": "<a href=\"#\" onclick=\"showForgotPassword()\">Forgot password?</a>",
  "url": "https://claude4-195d9.firebaseapp.com/?load=..%2F..%2F..%2Fetc%2Fpasswd",
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
  "detail": "<a href=\"#\" onclick=\"showForgotPassword()\">Forgot password?</a>",
  "url": "https://claude4-195d9.firebaseapp.com/?load=..%5C..%5C..%5Cwindows%5Cwin.ini",
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
  "detail": "<a href=\"#\" onclick=\"showForgotPassword()\">Forgot password?</a>",
  "url": "https://claude4-195d9.firebaseapp.com/?load=....%2F%2F....%2F%2F....%2F%2Fetc%2Fpasswd",
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
  "detail": "<a href=\"#\" onclick=\"showForgotPassword()\">Forgot password?</a>",
  "url": "https://claude4-195d9.firebaseapp.com/?load=..%252f..%252f..%252fetc%2Fpasswd",
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
  "detail": "<a href=\"#\" onclick=\"showForgotPassword()\">Forgot password?</a>",
  "url": "https://claude4-195d9.firebaseapp.com/?read=..%2F..%2F..%2Fetc%2Fpasswd",
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
  "detail": "<a href=\"#\" onclick=\"showForgotPassword()\">Forgot password?</a>",
  "url": "https://claude4-195d9.firebaseapp.com/?read=..%5C..%5C..%5Cwindows%5Cwin.ini",
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
  "detail": "<a href=\"#\" onclick=\"showForgotPassword()\">Forgot password?</a>",
  "url": "https://claude4-195d9.firebaseapp.com/?read=....%2F%2F....%2F%2F....%2F%2Fetc%2Fpasswd",
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
  "detail": "<a href=\"#\" onclick=\"showForgotPassword()\">Forgot password?</a>",
  "url": "https://claude4-195d9.firebaseapp.com/?read=..%252f..%252f..%252fetc%2Fpasswd",
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
  "detail": "<a href=\"#\" onclick=\"showForgotPassword()\">Forgot password?</a>",
  "url": "https://claude4-195d9.firebaseapp.com/images/",
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
  "detail": "<a href=\"#\" onclick=\"showForgotPassword()\">Forgot password?</a>",
  "url": "https://claude4-195d9.firebaseapp.com/images/styles.css",
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
  "detail": "<a href=\"#\" onclick=\"showForgotPassword()\">Forgot password?</a>",
  "url": "https://claude4-195d9.firebaseapp.com/images/app.js",
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
  "detail": "<a href=\"#\" onclick=\"showForgotPassword()\">Forgot password?</a>",
  "url": "https://claude4-195d9.firebaseapp.com/images/config.js",
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
  "detail": "<a href=\"#\" onclick=\"showForgotPassword()\">Forgot password?</a>",
  "url": "https://claude4-195d9.firebaseapp.com/uploads/",
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
  "detail": "<a href=\"#\" onclick=\"showForgotPassword()\">Forgot password?</a>",
  "url": "https://claude4-195d9.firebaseapp.com/uploads/app.js",
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
  "detail": "<a href=\"#\" onclick=\"showForgotPassword()\">Forgot password?</a>",
  "url": "https://claude4-195d9.firebaseapp.com/uploads/styles.css",
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
  "detail": "<a href=\"#\" onclick=\"showForgotPassword()\">Forgot password?</a>",
  "url": "https://claude4-195d9.firebaseapp.com/uploads/config.js",
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
  "detail": "<a href=\"#\" onclick=\"showForgotPassword()\">Forgot password?</a>",
  "url": "https://claude4-195d9.firebaseapp.com/files/",
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
  "detail": "<a href=\"#\" onclick=\"showForgotPassword()\">Forgot password?</a>",
  "url": "https://claude4-195d9.firebaseapp.com/files/app.js",
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
  "detail": "<a href=\"#\" onclick=\"showForgotPassword()\">Forgot password?</a>",
  "url": "https://claude4-195d9.firebaseapp.com/files/styles.css",
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
  "detail": "<a href=\"#\" onclick=\"showForgotPassword()\">Forgot password?</a>",
  "url": "https://claude4-195d9.firebaseapp.com/files/config.js",
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
  "detail": "<a href=\"#\" onclick=\"showForgotPassword()\">Forgot password?</a>",
  "url": "https://claude4-195d9.firebaseapp.com/assets/",
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
  "detail": "<a href=\"#\" onclick=\"showForgotPassword()\">Forgot password?</a>",
  "url": "https://claude4-195d9.firebaseapp.com/assets/app.js",
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
  "detail": "<a href=\"#\" onclick=\"showForgotPassword()\">Forgot password?</a>",
  "url": "https://claude4-195d9.firebaseapp.com/assets/config.js",
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
  "detail": "<a href=\"#\" onclick=\"showForgotPassword()\">Forgot password?</a>",
  "url": "https://claude4-195d9.firebaseapp.com/assets/styles.css",
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
  "detail": "<a href=\"#\" onclick=\"showForgotPassword()\">Forgot password?</a>",
  "url": "https://claude4-195d9.firebaseapp.com/static/config.js",
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
  "detail": "<a href=\"#\" onclick=\"showForgotPassword()\">Forgot password?</a>",
  "url": "https://claude4-195d9.firebaseapp.com/static/",
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
  "detail": "<a href=\"#\" onclick=\"showForgotPassword()\">Forgot password?</a>",
  "url": "https://claude4-195d9.firebaseapp.com/static/app.js",
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
  "detail": "<a href=\"#\" onclick=\"showForgotPassword()\">Forgot password?</a>",
  "url": "https://claude4-195d9.firebaseapp.com/static/styles.css",
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
  "detail": "<a href=\"#\" onclick=\"showForgotPassword()\">Forgot password?</a>",
  "url": "https://claude4-195d9.firebaseapp.com/media/",
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
  "detail": "<a href=\"#\" onclick=\"showForgotPassword()\">Forgot password?</a>",
  "url": "https://claude4-195d9.firebaseapp.com/media/styles.css",
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
  "detail": "<a href=\"#\" onclick=\"showForgotPassword()\">Forgot password?</a>",
  "url": "https://claude4-195d9.firebaseapp.com/media/config.js",
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
  "detail": "<a href=\"#\" onclick=\"showForgotPassword()\">Forgot password?</a>",
  "url": "https://claude4-195d9.firebaseapp.com/media/app.js",
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
  "detail": "<a href=\"#\" onclick=\"showForgotPassword()\">Forgot password?</a>",
  "url": "https://claude4-195d9.firebaseapp.com/backup/",
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
  "detail": "<a href=\"#\" onclick=\"showForgotPassword()\">Forgot password?</a>",
  "url": "https://claude4-195d9.firebaseapp.com/backup/config.js",
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
  "detail": "<a href=\"#\" onclick=\"showForgotPassword()\">Forgot password?</a>",
  "url": "https://claude4-195d9.firebaseapp.com/backup/styles.css",
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
  "detail": "<a href=\"#\" onclick=\"showForgotPassword()\">Forgot password?</a>",
  "url": "https://claude4-195d9.firebaseapp.com/backup/app.js",
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
  "detail": "<a href=\"#\" onclick=\"showForgotPassword()\">Forgot password?</a>",
  "url": "https://claude4-195d9.firebaseapp.com/logs/",
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
  "detail": "<a href=\"#\" onclick=\"showForgotPassword()\">Forgot password?</a>",
  "url": "https://claude4-195d9.firebaseapp.com/logs/config.js",
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
  "detail": "<a href=\"#\" onclick=\"showForgotPassword()\">Forgot password?</a>",
  "url": "https://claude4-195d9.firebaseapp.com/logs/app.js",
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
  "detail": "<a href=\"#\" onclick=\"showForgotPassword()\">Forgot password?</a>",
  "url": "https://claude4-195d9.firebaseapp.com/logs/styles.css",
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
  "detail": "<a href=\"#\" onclick=\"showForgotPassword()\">Forgot password?</a>",
  "url": "https://claude4-195d9.firebaseapp.com/tmp/",
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
  "detail": "<a href=\"#\" onclick=\"showForgotPassword()\">Forgot password?</a>",
  "url": "https://claude4-195d9.firebaseapp.com/tmp/config.js",
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
  "detail": "<a href=\"#\" onclick=\"showForgotPassword()\">Forgot password?</a>",
  "url": "https://claude4-195d9.firebaseapp.com/tmp/styles.css",
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
  "detail": "<a href=\"#\" onclick=\"showForgotPassword()\">Forgot password?</a>",
  "url": "https://claude4-195d9.firebaseapp.com/tmp/app.js",
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
  "detail": "<a href=\"#\" onclick=\"showForgotPassword()\">Forgot password?</a>",
  "url": "https://claude4-195d9.firebaseapp.com/data/",
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
  "detail": "<a href=\"#\" onclick=\"showForgotPassword()\">Forgot password?</a>",
  "url": "https://claude4-195d9.firebaseapp.com/data/app.js",
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
  "detail": "<a href=\"#\" onclick=\"showForgotPassword()\">Forgot password?</a>",
  "url": "https://claude4-195d9.firebaseapp.com/data/styles.css",
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
  "detail": "<a href=\"#\" onclick=\"showForgotPassword()\">Forgot password?</a>",
  "url": "https://claude4-195d9.firebaseapp.com/data/config.js",
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
  "detail": "<a href=\"#\" onclick=\"showForgotPassword()\">Forgot password?</a>",
  "url": "https://claude4-195d9.firebaseapp.com/admin",
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
  "detail": "<a href=\"#\" onclick=\"showForgotPassword()\">Forgot password?</a>",
  "url": "https://claude4-195d9.firebaseapp.com/admin/",
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
  "detail": "<a href=\"#\" onclick=\"showForgotPassword()\">Forgot password?</a>",
  "url": "https://claude4-195d9.firebaseapp.com/admin/config.js",
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
  "detail": "<a href=\"#\" onclick=\"showForgotPassword()\">Forgot password?</a>",
  "url": "https://claude4-195d9.firebaseapp.com/admin/app.js",
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
  "detail": "<a href=\"#\" onclick=\"showForgotPassword()\">Forgot password?</a>",
  "url": "https://claude4-195d9.firebaseapp.com/admin/styles.css",
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
  "detail": "<a href=\"#\" onclick=\"showForgotPassword()\">Forgot password?</a>",
  "url": "https://claude4-195d9.firebaseapp.com/admin/dashboard",
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
  "detail": "<a href=\"#\" onclick=\"showForgotPassword()\">Forgot password?</a>",
  "url": "https://claude4-195d9.firebaseapp.com/admin/users",
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
  "detail": "<a href=\"#\" onclick=\"showForgotPassword()\">Forgot password?</a>",
  "url": "https://claude4-195d9.firebaseapp.com/admin/settings",
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
  "url": "https://claude4-195d9.firebaseapp.com/"
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
  "url": "https://claude4-195d9.firebaseapp.com/home",
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
  "url": "https://claude4-195d9.firebaseapp.com/profile",
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
  "url": "https://claude4-195d9.firebaseapp.com/settings",
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
  "url": "https://claude4-195d9.firebaseapp.com/posts",
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
  "url": "https://claude4-195d9.firebaseapp.com/messages",
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
  "url": "https://claude4-195d9.firebaseapp.com/feed",
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
  "url": "https://claude4-195d9.firebaseapp.com/__nonexistent__1765842152376_2640c865aba9d",
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
  "url": "https://claude4-195d9.firebaseapp.com/?file=..%2F..%2F..%2Fetc%2Fpasswd",
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
  "url": "https://claude4-195d9.firebaseapp.com/?file=..%5C..%5C..%5Cwindows%5Cwin.ini",
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
  "url": "https://claude4-195d9.firebaseapp.com/?file=....%2F%2F....%2F%2F....%2F%2Fetc%2Fpasswd",
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
  "url": "https://claude4-195d9.firebaseapp.com/?file=..%252f..%252f..%252fetc%2Fpasswd",
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
  "url": "https://claude4-195d9.firebaseapp.com/?path=..%2F..%2F..%2Fetc%2Fpasswd",
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
  "url": "https://claude4-195d9.firebaseapp.com/?path=..%5C..%5C..%5Cwindows%5Cwin.ini",
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
  "url": "https://claude4-195d9.firebaseapp.com/?path=....%2F%2F....%2F%2F....%2F%2Fetc%2Fpasswd",
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
  "url": "https://claude4-195d9.firebaseapp.com/?path=..%252f..%252f..%252fetc%2Fpasswd",
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
  "url": "https://claude4-195d9.firebaseapp.com/?filepath=..%2F..%2F..%2Fetc%2Fpasswd",
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
  "url": "https://claude4-195d9.firebaseapp.com/?filepath=..%5C..%5C..%5Cwindows%5Cwin.ini",
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
  "url": "https://claude4-195d9.firebaseapp.com/?filepath=....%2F%2F....%2F%2F....%2F%2Fetc%2Fpasswd",
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
  "url": "https://claude4-195d9.firebaseapp.com/?filepath=..%252f..%252f..%252fetc%2Fpasswd",
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
  "url": "https://claude4-195d9.firebaseapp.com/?document=..%2F..%2F..%2Fetc%2Fpasswd",
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
  "url": "https://claude4-195d9.firebaseapp.com/?document=..%5C..%5C..%5Cwindows%5Cwin.ini",
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
  "url": "https://claude4-195d9.firebaseapp.com/?document=....%2F%2F....%2F%2F....%2F%2Fetc%2Fpasswd",
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
  "url": "https://claude4-195d9.firebaseapp.com/?document=..%252f..%252f..%252fetc%2Fpasswd",
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
  "url": "https://claude4-195d9.firebaseapp.com/?doc=..%2F..%2F..%2Fetc%2Fpasswd",
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
  "url": "https://claude4-195d9.firebaseapp.com/?doc=..%5C..%5C..%5Cwindows%5Cwin.ini",
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
  "url": "https://claude4-195d9.firebaseapp.com/?doc=....%2F%2F....%2F%2F....%2F%2Fetc%2Fpasswd",
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
  "url": "https://claude4-195d9.firebaseapp.com/?doc=..%252f..%252f..%252fetc%2Fpasswd",
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
  "url": "https://claude4-195d9.firebaseapp.com/?page=..%2F..%2F..%2Fetc%2Fpasswd",
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
  "url": "https://claude4-195d9.firebaseapp.com/?page=..%5C..%5C..%5Cwindows%5Cwin.ini",
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
  "url": "https://claude4-195d9.firebaseapp.com/?page=....%2F%2F....%2F%2F....%2F%2Fetc%2Fpasswd",
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
  "url": "https://claude4-195d9.firebaseapp.com/?page=..%252f..%252f..%252fetc%2Fpasswd",
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
  "url": "https://claude4-195d9.firebaseapp.com/?template=..%2F..%2F..%2Fetc%2Fpasswd",
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
  "url": "https://claude4-195d9.firebaseapp.com/?template=..%5C..%5C..%5Cwindows%5Cwin.ini",
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
  "url": "https://claude4-195d9.firebaseapp.com/?template=....%2F%2F....%2F%2F....%2F%2Fetc%2Fpasswd",
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
  "url": "https://claude4-195d9.firebaseapp.com/?template=..%252f..%252f..%252fetc%2Fpasswd",
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
  "url": "https://claude4-195d9.firebaseapp.com/?include=..%2F..%2F..%2Fetc%2Fpasswd",
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
  "url": "https://claude4-195d9.firebaseapp.com/?include=..%5C..%5C..%5Cwindows%5Cwin.ini",
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
  "url": "https://claude4-195d9.firebaseapp.com/?include=....%2F%2F....%2F%2F....%2F%2Fetc%2Fpasswd",
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
  "url": "https://claude4-195d9.firebaseapp.com/?include=..%252f..%252f..%252fetc%2Fpasswd",
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
  "url": "https://claude4-195d9.firebaseapp.com/?dir=..%2F..%2F..%2Fetc%2Fpasswd",
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
  "url": "https://claude4-195d9.firebaseapp.com/?dir=..%5C..%5C..%5Cwindows%5Cwin.ini",
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
  "url": "https://claude4-195d9.firebaseapp.com/?dir=....%2F%2F....%2F%2F....%2F%2Fetc%2Fpasswd",
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
  "url": "https://claude4-195d9.firebaseapp.com/?dir=..%252f..%252f..%252fetc%2Fpasswd",
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
  "url": "https://claude4-195d9.firebaseapp.com/?folder=..%2F..%2F..%2Fetc%2Fpasswd",
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
  "url": "https://claude4-195d9.firebaseapp.com/?folder=..%5C..%5C..%5Cwindows%5Cwin.ini",
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
  "url": "https://claude4-195d9.firebaseapp.com/?folder=....%2F%2F....%2F%2F....%2F%2Fetc%2Fpasswd",
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
  "url": "https://claude4-195d9.firebaseapp.com/?folder=..%252f..%252f..%252fetc%2Fpasswd",
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
  "url": "https://claude4-195d9.firebaseapp.com/?load=..%2F..%2F..%2Fetc%2Fpasswd",
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
  "url": "https://claude4-195d9.firebaseapp.com/?load=..%5C..%5C..%5Cwindows%5Cwin.ini",
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
  "url": "https://claude4-195d9.firebaseapp.com/?load=....%2F%2F....%2F%2F....%2F%2Fetc%2Fpasswd",
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
  "url": "https://claude4-195d9.firebaseapp.com/?load=..%252f..%252f..%252fetc%2Fpasswd",
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
  "url": "https://claude4-195d9.firebaseapp.com/?read=..%2F..%2F..%2Fetc%2Fpasswd",
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
  "url": "https://claude4-195d9.firebaseapp.com/?read=..%5C..%5C..%5Cwindows%5Cwin.ini",
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
  "url": "https://claude4-195d9.firebaseapp.com/?read=....%2F%2F....%2F%2F....%2F%2Fetc%2Fpasswd",
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
  "url": "https://claude4-195d9.firebaseapp.com/?read=..%252f..%252f..%252fetc%2Fpasswd",
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
  "url": "https://claude4-195d9.firebaseapp.com/images/",
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
  "url": "https://claude4-195d9.firebaseapp.com/uploads/",
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
  "url": "https://claude4-195d9.firebaseapp.com/files/",
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
  "url": "https://claude4-195d9.firebaseapp.com/assets/",
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
  "url": "https://claude4-195d9.firebaseapp.com/static/",
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
  "url": "https://claude4-195d9.firebaseapp.com/media/",
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
  "url": "https://claude4-195d9.firebaseapp.com/backup/",
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
  "url": "https://claude4-195d9.firebaseapp.com/logs/",
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
  "url": "https://claude4-195d9.firebaseapp.com/tmp/",
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
  "url": "https://claude4-195d9.firebaseapp.com/data/",
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
  "url": "https://claude4-195d9.firebaseapp.com/admin",
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
  "url": "https://claude4-195d9.firebaseapp.com/admin/",
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
  "url": "https://claude4-195d9.firebaseapp.com/admin/dashboard",
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
  "url": "https://claude4-195d9.firebaseapp.com/admin/users",
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
  "url": "https://claude4-195d9.firebaseapp.com/admin/settings",
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
  "url": "https://claude4-195d9.firebaseapp.com/administrator",
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
  "url": "https://claude4-195d9.firebaseapp.com/config.js",
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
  "url": "https://claude4-195d9.firebaseapp.com/app.js",
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
  "url": "https://claude4-195d9.firebaseapp.com/styles.css",
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
  "url": "https://claude4-195d9.firebaseapp.com/admin/app.js",
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
  "url": "https://claude4-195d9.firebaseapp.com/admin/config.js",
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
  "url": "https://claude4-195d9.firebaseapp.com/admin/styles.css",
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
  "url": "https://claude4-195d9.firebaseapp.com/config.js",
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
  "url": "https://claude4-195d9.firebaseapp.com/styles.css",
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
  "url": "https://claude4-195d9.firebaseapp.com/app.js",
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
  "url": "https://claude4-195d9.firebaseapp.com/",
  "type": "ZAP-10116"
}
```


### A02: Cryptographic Failures

#### HIGH: Exposure of Private Personal Information

- **CWE:** CWE-359 (Unknown)
- **Tool:** live-scanner
- **Status:** ✅ Confirmed by live testing

**Description:**
Other users' PII accessible: email, age, city, country

**Evidence:**
```
{
  "exposedPII": [
    "email",
    "age",
    "city",
    "country"
  ],
  "affectedUsers": 2
}
```


#### HIGH: Hardcoded Google API Key found

- **CWE:** CWE-798 (Unknown)
- **Tool:** crypto-scanner

**Description:**
Found potential Google API Key in https://claude4-195d9.firebaseapp.com/config.js

**Evidence:**
```
{
  "pattern": "Google API Key",
  "source": "https://claude4-195d9.firebaseapp.com/config.js",
  "redactedMatch": "AIzaSyBWzo...IBQiI"
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
  "url": "https://claude4-195d9.firebaseapp.com"
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
  "url": "https://claude4-195d9.firebaseapp.com"
}
```


#### MEDIUM: Public Post Access

- **CWE:** CWE-311 (Unknown)
- **Tool:** live-scanner
- **Status:** ✅ Confirmed by live testing

**Description:**
7 posts readable without authentication

**Evidence:**
```
{
  "postCount": 7
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


#### MEDIUM: Weak password policy

- **CWE:** CWE-521 (Weak Password Requirements)
- **Tool:** crypto-scanner
- **Duplicate Count:** 2

**Description:**
Password field "loginPassword" has weak policy: no minimum length requirement (should be ≥8), no pattern for password complexity


#### MEDIUM: Weak Random detected

- **CWE:** CWE-330 (Use of Insufficiently Random Values)
- **Tool:** crypto-scanner

**Description:**
Found Weak Random in https://claude4-195d9.firebaseapp.com/app.js. This may indicate weak cryptographic practices.

**Evidence:**
```
{
  "pattern": "Weak Random",
  "source": "https://claude4-195d9.firebaseapp.com/app.js",
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
  "url": "https://claude4-195d9.firebaseapp.com"
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
  "url": "https://claude4-195d9.firebaseapp.com"
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
  "file": "/home/nillof/Exjobb/Claude4/social-circle-web/app.js",
  "line": 279,
  "endLine": 306,
  "code": "card.innerHTML = `\n        <div class=\"post-header\">\n            <img src=\"${post.userPhoto || 'https://via.placeholder.com/48'}\" alt=\"${post.userName}\" class=\"post-avatar\" onclick=\"viewUserProfile('${post.userId}')\">\n            <div class=\"post-info\">\n                <h4 onclick=\"viewUserProfile('${post.userId}')\" style=\"cursor: pointer;\">${post.userName}</h4>\n                <div class=\"post-time\">${timestamp}${post.friendsOnly ? ' 👥 Friends only' : ''}</div>\n            </div>\n        </div>\n        <div class=\"post-content\">${post.content || ''}</div>\n        ${post.imageUrl ? `<img src=\"${post.imageUrl}\" alt=\"Post image\" class=\"post-image\">` : ''}\n        <div class=\"post-actions\">\n            <button class=\"action-btn ${isLiked ? 'liked' : ''}\" onclick=\"toggleLike('${postId}')\">\n                ${isLiked ? '❤️' : '🤍'} <span>${likeCount} Likes</span>\n            </button>\n            <button class=\"action-btn\" onclick=\"toggleComments('${postId}')\">\n                💬 Comment\n            </button>\n            ${post.imageUrl ? `<a href=\"${post.imageUrl}\" download class=\"action-btn\">⬇️ Download</a>` : ''}\n            ${post.userId !== currentUser.uid ? `<button class=\"action-btn\" onclick=\"addFriendFromFeed('${post.userId}')\">➕ Add Friend</button>` : ''}\n        </div>\n        <div id=\"comments-${postId}\" class=\"comments-section\" style=\"display:none;\">\n            <div id=\"comments-list-${postId}\"></div>\n            <form onsubmit=\"addComment(event, '${postId}')\" class=\"comment-form\">\n                <input type=\"text\" class=\"comment-input\" placeholder=\"Write a comment...\" required>\n                <button type=\"submit\" class=\"btn btn-primary btn-small\">Post</button>\n            </form>\n        </div>\n    `;"
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
  "file": "/home/nillof/Exjobb/Claude4/social-circle-web/app.js",
  "line": 357,
  "endLine": 360,
  "code": "commentEl.innerHTML = `\n                <div class=\"comment-author\">${comment.userName}</div>\n                <div class=\"comment-text\">${comment.text}</div>\n            `;"
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
  "file": "/home/nillof/Exjobb/Claude4/social-circle-web/app.js",
  "line": 462,
  "endLine": 462,
  "code": "galleryItem.innerHTML = `<img src=\"${item.imageUrl}\" alt=\"Gallery photo\">`;"
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
  "file": "/home/nillof/Exjobb/Claude4/social-circle-web/app.js",
  "line": 612,
  "endLine": 621,
  "code": "card.innerHTML = `\n        <img src=\"${userData.profilePic || 'https://via.placeholder.com/100'}\" alt=\"${userData.displayName || userData.name}\" class=\"friend-avatar\">\n        <h4>${userData.displayName || userData.name}</h4>\n        <p class=\"friend-info\">${details.join(' • ') || 'No details'}</p>\n        ${isSuggestion ? \n            `<button onclick=\"addFriend('${userData.uid}')\" class=\"btn btn-primary btn-small\">Add Friend</button>` :\n            `<button onclick=\"viewUserProfile('${userData.uid}')\" class=\"btn btn-outline btn-small\">View Profile</button>\n             <button onclick=\"removeFriend('${userData.uid}')\" class=\"btn btn-small\">Remove</button>`\n        }\n    `;"
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
  "file": "/home/nillof/Exjobb/Claude4/social-circle-web/app.js",
  "line": 681,
  "endLine": 684,
  "code": "conversationItem.innerHTML = `\n                    <img src=\"${userData.profilePic || 'https://via.placeholder.com/40'}\" alt=\"${userData.displayName || userData.name}\" style=\"width: 40px; height: 40px; border-radius: 50%;\">\n                    <div>${userData.displayName || userData.name}</div>\n                `;"
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
  "file": "/home/nillof/Exjobb/Claude4/social-circle-web/app.js",
  "line": 697,
  "endLine": 697,
  "code": "document.getElementById('messageHeader').innerHTML = `<h3>Conversation with ${friendName}</h3>`;"
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
  "file": "/home/nillof/Exjobb/Claude4/social-circle-web/app.js",
  "line": 812,
  "endLine": 821,
  "code": "userCard.innerHTML = `\n                <img src=\"${userData.profilePic || 'https://via.placeholder.com/80'}\" alt=\"${userData.displayName || userData.name}\" class=\"user-avatar\">\n                <h4>${userData.displayName || userData.name}</h4>\n                <p>${userData.city || 'Location not set'}</p>\n                ${currentUser ? \n                    `<button onclick=\"addFriend('${userData.uid}')\" class=\"btn btn-primary btn-small\">Add Friend</button>\n                     <button onclick=\"viewUserProfile('${userData.uid}')\" class=\"btn btn-outline btn-small\">View Profile</button>` :\n                    `<button onclick=\"showLogin()\" class=\"btn btn-primary btn-small\">Login to Connect</button>`\n                }\n            `;"
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
  "file": "/home/nillof/Exjobb/Claude4/social-circle-web/app.js",
  "line": 843,
  "endLine": 852,
  "code": "content.innerHTML = `\n            <div class=\"profile-banner ${userData.banner || 'gradient1'}\"></div>\n            <div style=\"text-align: center; margin-top: -60px;\">\n                <img src=\"${userData.profilePic || 'https://via.placeholder.com/150'}\" alt=\"${userData.displayName || userData.name}\" style=\"width: 150px; height: 150px; border-radius: 50%; border: 5px solid white;\">\n                <h2>${userData.displayName || userData.name}</h2>\n                <p>${details.join(' • ') || 'No details'}</p>\n                <p style=\"margin: 1rem 0;\">${userData.about || 'No bio'}</p>\n                ${currentUser ? `<button onclick=\"addFriend('${userId}')\" class=\"btn btn-primary\">Add Friend</button>` : ''}\n            </div>\n        `;"
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
  "file": "/home/nillof/Exjobb/Claude4/social-circle-web/app.js",
  "line": 951,
  "endLine": 953,
  "code": "codeEl.innerHTML = `\n                <strong>${code.code}</strong> - ${code.used ? '✓ Used' : '○ Available'}\n            `;"
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
  "file": "/home/nillof/Exjobb/Claude4/social-circle-web/app.js",
  "line": 1079,
  "endLine": 1087,
  "code": "userItem.innerHTML = `\n                <div>\n                    <strong>${user.displayName || user.name}</strong> - ${user.email}\n                </div>\n                <div>\n                    <button onclick=\"makeAdmin('${doc.id}')\" class=\"btn btn-small\">Make Admin</button>\n                    <button onclick=\"deleteUserAdmin('${doc.id}')\" class=\"btn btn-danger btn-small\">Delete</button>\n                </div>\n            `;"
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
  "file": "/home/nillof/Exjobb/Claude4/social-circle-web/app.js",
  "line": 1100,
  "endLine": 1105,
  "code": "adminItem.innerHTML = `\n                <div>\n                    <strong>${admin.displayName || admin.name}</strong> - ${admin.email}\n                </div>\n                <button onclick=\"removeAdmin('${doc.id}')\" class=\"btn btn-small\">Remove Admin</button>\n            `;"
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
  "file": "/home/nillof/Exjobb/Claude4/social-circle-web/app.js",
  "line": 1118,
  "endLine": 1123,
  "code": "postItem.innerHTML = `\n                <div>\n                    <strong>${post.userName}</strong>: ${post.content?.substring(0, 50)}...\n                </div>\n                <button onclick=\"deletePostAdmin('${doc.id}')\" class=\"btn btn-danger btn-small\">Delete</button>\n            `;"
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
  "file": "/home/nillof/Exjobb/Claude4/social-circle-web/app.js",
  "line": 1293,
  "endLine": 1294,
  "code": "document.getElementById('imagePreview').innerHTML = \n                `<img src=\"${e.target.result}\" style=\"max-width: 100%; border-radius: 8px; margin-top: 1rem;\">`;"
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
  "file": "/home/nillof/Exjobb/Claude4/social-circle-web/app.js",
  "line": 400,
  "endLine": 400,
  "code": "document.getElementById('profilePic').src = userData.profilePic || 'https://via.placeholder.com/150';"
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


