# Security Assessment Report

**Application:** Social Media App  
**Target:** https://claude5-f5d80.firebaseapp.com  
**Date:** 2025-12-15T23:36:29.936Z  
**Duration:** 98s

## Summary

| Severity | Count |
|----------|-------|
| CRITICAL | 4 |
| HIGH | 16 |
| MEDIUM | 14 |
| LOW | 2 |

**Risk Score:** 150 (CRITICAL)


### Deduplication Summary

| Metric | Value |
|--------|-------|
| Original Findings | 761 |
| After Deduplication | 636 |
| Duplicates Removed | 125 |
| Reduction | 16% |

## Findings

### A01: Broken Access Control

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


#### CRITICAL: Privilege Escalation: Self-Elevation to Admin

- **CWE:** CWE-269 (Unknown)
- **Tool:** live-scanner
- **Status:** ✅ Confirmed by live testing

**Description:**
User successfully set their own isAdmin flag to true

**Evidence:**
```
{
  "userId": "RFi1d1JFzXVd4i5IAAP50egN28r2",
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
  "userId": "RFi1d1JFzXVd4i5IAAP50egN28r2",
  "before": false,
  "after": true
}
```


#### HIGH: Hardcoded Password Found in Page Content

- **CWE:** CWE-200 (Unknown)
- **Tool:** browser-scanner
- **Duplicate Count:** 3

**Description:**
Found 3 potential Hardcoded Password matches in DOM content

**Evidence:**
```
{
  "url": "https://claude5-f5d80.firebaseapp.com/"
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
    "role",
    "createdAt",
    "referralPoints",
    "friends",
    "email",
    "displayName",
    "referralCodes"
  ],
  "sensitiveFields": [
    "friends",
    "email"
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
  "messageId": "lNmUlsedB7TM2r7VXlY0",
  "spoofedSender": "GkywJOXghBfsKFLpmh3w8vb9Ben1",
  "recipient": "WdkySHoAq9ZVWk2QAJNRS58tVN62"
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
  "url": "https://claude5-f5d80.firebaseapp.com/"
}
```


#### INFO: Content Security Policy (CSP) Header Not Set

- **CWE:** CWE-693 (Unknown)
- **Tool:** browser-scanner

**Description:**
Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks, including Cross Site Scripting (XSS) and data injection attacks. These attacks are used for everything from data theft to site defacement or distribution of malware. CSP provides a set of standard HTTP headers that allow website owners to declare approved sources of content that browsers should be allowed to load on that page — covered types are JavaScript, CSS, HTML frames, fonts, images and embeddable objects such as Java applets, ActiveX, audio and video files.

**Evidence:**
```
{
  "url": "https://claude5-f5d80.firebaseapp.com/home"
}
```


#### INFO: Content Security Policy (CSP) Header Not Set

- **CWE:** CWE-693 (Unknown)
- **Tool:** browser-scanner

**Description:**
Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks, including Cross Site Scripting (XSS) and data injection attacks. These attacks are used for everything from data theft to site defacement or distribution of malware. CSP provides a set of standard HTTP headers that allow website owners to declare approved sources of content that browsers should be allowed to load on that page — covered types are JavaScript, CSS, HTML frames, fonts, images and embeddable objects such as Java applets, ActiveX, audio and video files.

**Evidence:**
```
{
  "url": "https://claude5-f5d80.firebaseapp.com/profile"
}
```


#### INFO: Content Security Policy (CSP) Header Not Set

- **CWE:** CWE-693 (Unknown)
- **Tool:** browser-scanner

**Description:**
Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks, including Cross Site Scripting (XSS) and data injection attacks. These attacks are used for everything from data theft to site defacement or distribution of malware. CSP provides a set of standard HTTP headers that allow website owners to declare approved sources of content that browsers should be allowed to load on that page — covered types are JavaScript, CSS, HTML frames, fonts, images and embeddable objects such as Java applets, ActiveX, audio and video files.

**Evidence:**
```
{
  "url": "https://claude5-f5d80.firebaseapp.com/settings"
}
```


#### INFO: Content Security Policy (CSP) Header Not Set

- **CWE:** CWE-693 (Unknown)
- **Tool:** browser-scanner

**Description:**
Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks, including Cross Site Scripting (XSS) and data injection attacks. These attacks are used for everything from data theft to site defacement or distribution of malware. CSP provides a set of standard HTTP headers that allow website owners to declare approved sources of content that browsers should be allowed to load on that page — covered types are JavaScript, CSS, HTML frames, fonts, images and embeddable objects such as Java applets, ActiveX, audio and video files.

**Evidence:**
```
{
  "url": "https://claude5-f5d80.firebaseapp.com/posts"
}
```


#### INFO: Content Security Policy (CSP) Header Not Set

- **CWE:** CWE-693 (Unknown)
- **Tool:** browser-scanner

**Description:**
Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks, including Cross Site Scripting (XSS) and data injection attacks. These attacks are used for everything from data theft to site defacement or distribution of malware. CSP provides a set of standard HTTP headers that allow website owners to declare approved sources of content that browsers should be allowed to load on that page — covered types are JavaScript, CSS, HTML frames, fonts, images and embeddable objects such as Java applets, ActiveX, audio and video files.

**Evidence:**
```
{
  "url": "https://claude5-f5d80.firebaseapp.com/messages"
}
```


#### INFO: Content Security Policy (CSP) Header Not Set

- **CWE:** CWE-693 (Unknown)
- **Tool:** browser-scanner

**Description:**
Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks, including Cross Site Scripting (XSS) and data injection attacks. These attacks are used for everything from data theft to site defacement or distribution of malware. CSP provides a set of standard HTTP headers that allow website owners to declare approved sources of content that browsers should be allowed to load on that page — covered types are JavaScript, CSS, HTML frames, fonts, images and embeddable objects such as Java applets, ActiveX, audio and video files.

**Evidence:**
```
{
  "url": "https://claude5-f5d80.firebaseapp.com/feed"
}
```


#### INFO: Content Security Policy (CSP) Header Not Set

- **CWE:** CWE-693 (Unknown)
- **Tool:** browser-scanner

**Description:**
Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks, including Cross Site Scripting (XSS) and data injection attacks. These attacks are used for everything from data theft to site defacement or distribution of malware. CSP provides a set of standard HTTP headers that allow website owners to declare approved sources of content that browsers should be allowed to load on that page — covered types are JavaScript, CSS, HTML frames, fonts, images and embeddable objects such as Java applets, ActiveX, audio and video files.

**Evidence:**
```
{
  "url": "https://claude5-f5d80.firebaseapp.com/__nonexistent__1765840839599_772536e9d6a31"
}
```


#### INFO: Content Security Policy (CSP) Header Not Set

- **CWE:** CWE-693 (Unknown)
- **Tool:** browser-scanner

**Description:**
Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks, including Cross Site Scripting (XSS) and data injection attacks. These attacks are used for everything from data theft to site defacement or distribution of malware. CSP provides a set of standard HTTP headers that allow website owners to declare approved sources of content that browsers should be allowed to load on that page — covered types are JavaScript, CSS, HTML frames, fonts, images and embeddable objects such as Java applets, ActiveX, audio and video files.

**Evidence:**
```
{
  "url": "https://claude5-f5d80.firebaseapp.com/?file=..%2F..%2F..%2Fetc%2Fpasswd"
}
```


#### INFO: Content Security Policy (CSP) Header Not Set

- **CWE:** CWE-693 (Unknown)
- **Tool:** browser-scanner

**Description:**
Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks, including Cross Site Scripting (XSS) and data injection attacks. These attacks are used for everything from data theft to site defacement or distribution of malware. CSP provides a set of standard HTTP headers that allow website owners to declare approved sources of content that browsers should be allowed to load on that page — covered types are JavaScript, CSS, HTML frames, fonts, images and embeddable objects such as Java applets, ActiveX, audio and video files.

**Evidence:**
```
{
  "url": "https://claude5-f5d80.firebaseapp.com/?file=..%5C..%5C..%5Cwindows%5Cwin.ini"
}
```


#### INFO: Content Security Policy (CSP) Header Not Set

- **CWE:** CWE-693 (Unknown)
- **Tool:** browser-scanner

**Description:**
Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks, including Cross Site Scripting (XSS) and data injection attacks. These attacks are used for everything from data theft to site defacement or distribution of malware. CSP provides a set of standard HTTP headers that allow website owners to declare approved sources of content that browsers should be allowed to load on that page — covered types are JavaScript, CSS, HTML frames, fonts, images and embeddable objects such as Java applets, ActiveX, audio and video files.

**Evidence:**
```
{
  "url": "https://claude5-f5d80.firebaseapp.com/?file=....%2F%2F....%2F%2F....%2F%2Fetc%2Fpasswd"
}
```


#### INFO: Content Security Policy (CSP) Header Not Set

- **CWE:** CWE-693 (Unknown)
- **Tool:** browser-scanner

**Description:**
Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks, including Cross Site Scripting (XSS) and data injection attacks. These attacks are used for everything from data theft to site defacement or distribution of malware. CSP provides a set of standard HTTP headers that allow website owners to declare approved sources of content that browsers should be allowed to load on that page — covered types are JavaScript, CSS, HTML frames, fonts, images and embeddable objects such as Java applets, ActiveX, audio and video files.

**Evidence:**
```
{
  "url": "https://claude5-f5d80.firebaseapp.com/?file=..%252f..%252f..%252fetc%2Fpasswd"
}
```


#### INFO: Content Security Policy (CSP) Header Not Set

- **CWE:** CWE-693 (Unknown)
- **Tool:** browser-scanner

**Description:**
Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks, including Cross Site Scripting (XSS) and data injection attacks. These attacks are used for everything from data theft to site defacement or distribution of malware. CSP provides a set of standard HTTP headers that allow website owners to declare approved sources of content that browsers should be allowed to load on that page — covered types are JavaScript, CSS, HTML frames, fonts, images and embeddable objects such as Java applets, ActiveX, audio and video files.

**Evidence:**
```
{
  "url": "https://claude5-f5d80.firebaseapp.com/?path=..%2F..%2F..%2Fetc%2Fpasswd"
}
```


#### INFO: Content Security Policy (CSP) Header Not Set

- **CWE:** CWE-693 (Unknown)
- **Tool:** browser-scanner

**Description:**
Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks, including Cross Site Scripting (XSS) and data injection attacks. These attacks are used for everything from data theft to site defacement or distribution of malware. CSP provides a set of standard HTTP headers that allow website owners to declare approved sources of content that browsers should be allowed to load on that page — covered types are JavaScript, CSS, HTML frames, fonts, images and embeddable objects such as Java applets, ActiveX, audio and video files.

**Evidence:**
```
{
  "url": "https://claude5-f5d80.firebaseapp.com/?path=..%5C..%5C..%5Cwindows%5Cwin.ini"
}
```


#### INFO: Content Security Policy (CSP) Header Not Set

- **CWE:** CWE-693 (Unknown)
- **Tool:** browser-scanner

**Description:**
Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks, including Cross Site Scripting (XSS) and data injection attacks. These attacks are used for everything from data theft to site defacement or distribution of malware. CSP provides a set of standard HTTP headers that allow website owners to declare approved sources of content that browsers should be allowed to load on that page — covered types are JavaScript, CSS, HTML frames, fonts, images and embeddable objects such as Java applets, ActiveX, audio and video files.

**Evidence:**
```
{
  "url": "https://claude5-f5d80.firebaseapp.com/?path=....%2F%2F....%2F%2F....%2F%2Fetc%2Fpasswd"
}
```


#### INFO: Content Security Policy (CSP) Header Not Set

- **CWE:** CWE-693 (Unknown)
- **Tool:** browser-scanner

**Description:**
Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks, including Cross Site Scripting (XSS) and data injection attacks. These attacks are used for everything from data theft to site defacement or distribution of malware. CSP provides a set of standard HTTP headers that allow website owners to declare approved sources of content that browsers should be allowed to load on that page — covered types are JavaScript, CSS, HTML frames, fonts, images and embeddable objects such as Java applets, ActiveX, audio and video files.

**Evidence:**
```
{
  "url": "https://claude5-f5d80.firebaseapp.com/?path=..%252f..%252f..%252fetc%2Fpasswd"
}
```


#### INFO: Content Security Policy (CSP) Header Not Set

- **CWE:** CWE-693 (Unknown)
- **Tool:** browser-scanner

**Description:**
Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks, including Cross Site Scripting (XSS) and data injection attacks. These attacks are used for everything from data theft to site defacement or distribution of malware. CSP provides a set of standard HTTP headers that allow website owners to declare approved sources of content that browsers should be allowed to load on that page — covered types are JavaScript, CSS, HTML frames, fonts, images and embeddable objects such as Java applets, ActiveX, audio and video files.

**Evidence:**
```
{
  "url": "https://claude5-f5d80.firebaseapp.com/?filepath=..%2F..%2F..%2Fetc%2Fpasswd"
}
```


#### INFO: Content Security Policy (CSP) Header Not Set

- **CWE:** CWE-693 (Unknown)
- **Tool:** browser-scanner

**Description:**
Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks, including Cross Site Scripting (XSS) and data injection attacks. These attacks are used for everything from data theft to site defacement or distribution of malware. CSP provides a set of standard HTTP headers that allow website owners to declare approved sources of content that browsers should be allowed to load on that page — covered types are JavaScript, CSS, HTML frames, fonts, images and embeddable objects such as Java applets, ActiveX, audio and video files.

**Evidence:**
```
{
  "url": "https://claude5-f5d80.firebaseapp.com/?filepath=..%5C..%5C..%5Cwindows%5Cwin.ini"
}
```


#### INFO: Content Security Policy (CSP) Header Not Set

- **CWE:** CWE-693 (Unknown)
- **Tool:** browser-scanner

**Description:**
Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks, including Cross Site Scripting (XSS) and data injection attacks. These attacks are used for everything from data theft to site defacement or distribution of malware. CSP provides a set of standard HTTP headers that allow website owners to declare approved sources of content that browsers should be allowed to load on that page — covered types are JavaScript, CSS, HTML frames, fonts, images and embeddable objects such as Java applets, ActiveX, audio and video files.

**Evidence:**
```
{
  "url": "https://claude5-f5d80.firebaseapp.com/?filepath=....%2F%2F....%2F%2F....%2F%2Fetc%2Fpasswd"
}
```


#### INFO: Content Security Policy (CSP) Header Not Set

- **CWE:** CWE-693 (Unknown)
- **Tool:** browser-scanner

**Description:**
Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks, including Cross Site Scripting (XSS) and data injection attacks. These attacks are used for everything from data theft to site defacement or distribution of malware. CSP provides a set of standard HTTP headers that allow website owners to declare approved sources of content that browsers should be allowed to load on that page — covered types are JavaScript, CSS, HTML frames, fonts, images and embeddable objects such as Java applets, ActiveX, audio and video files.

**Evidence:**
```
{
  "url": "https://claude5-f5d80.firebaseapp.com/?filepath=..%252f..%252f..%252fetc%2Fpasswd"
}
```


#### INFO: Content Security Policy (CSP) Header Not Set

- **CWE:** CWE-693 (Unknown)
- **Tool:** browser-scanner

**Description:**
Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks, including Cross Site Scripting (XSS) and data injection attacks. These attacks are used for everything from data theft to site defacement or distribution of malware. CSP provides a set of standard HTTP headers that allow website owners to declare approved sources of content that browsers should be allowed to load on that page — covered types are JavaScript, CSS, HTML frames, fonts, images and embeddable objects such as Java applets, ActiveX, audio and video files.

**Evidence:**
```
{
  "url": "https://claude5-f5d80.firebaseapp.com/?document=..%2F..%2F..%2Fetc%2Fpasswd"
}
```


#### INFO: Content Security Policy (CSP) Header Not Set

- **CWE:** CWE-693 (Unknown)
- **Tool:** browser-scanner

**Description:**
Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks, including Cross Site Scripting (XSS) and data injection attacks. These attacks are used for everything from data theft to site defacement or distribution of malware. CSP provides a set of standard HTTP headers that allow website owners to declare approved sources of content that browsers should be allowed to load on that page — covered types are JavaScript, CSS, HTML frames, fonts, images and embeddable objects such as Java applets, ActiveX, audio and video files.

**Evidence:**
```
{
  "url": "https://claude5-f5d80.firebaseapp.com/?document=..%5C..%5C..%5Cwindows%5Cwin.ini"
}
```


#### INFO: Content Security Policy (CSP) Header Not Set

- **CWE:** CWE-693 (Unknown)
- **Tool:** browser-scanner

**Description:**
Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks, including Cross Site Scripting (XSS) and data injection attacks. These attacks are used for everything from data theft to site defacement or distribution of malware. CSP provides a set of standard HTTP headers that allow website owners to declare approved sources of content that browsers should be allowed to load on that page — covered types are JavaScript, CSS, HTML frames, fonts, images and embeddable objects such as Java applets, ActiveX, audio and video files.

**Evidence:**
```
{
  "url": "https://claude5-f5d80.firebaseapp.com/?document=....%2F%2F....%2F%2F....%2F%2Fetc%2Fpasswd"
}
```


#### INFO: Content Security Policy (CSP) Header Not Set

- **CWE:** CWE-693 (Unknown)
- **Tool:** browser-scanner

**Description:**
Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks, including Cross Site Scripting (XSS) and data injection attacks. These attacks are used for everything from data theft to site defacement or distribution of malware. CSP provides a set of standard HTTP headers that allow website owners to declare approved sources of content that browsers should be allowed to load on that page — covered types are JavaScript, CSS, HTML frames, fonts, images and embeddable objects such as Java applets, ActiveX, audio and video files.

**Evidence:**
```
{
  "url": "https://claude5-f5d80.firebaseapp.com/?document=..%252f..%252f..%252fetc%2Fpasswd"
}
```


#### INFO: Content Security Policy (CSP) Header Not Set

- **CWE:** CWE-693 (Unknown)
- **Tool:** browser-scanner

**Description:**
Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks, including Cross Site Scripting (XSS) and data injection attacks. These attacks are used for everything from data theft to site defacement or distribution of malware. CSP provides a set of standard HTTP headers that allow website owners to declare approved sources of content that browsers should be allowed to load on that page — covered types are JavaScript, CSS, HTML frames, fonts, images and embeddable objects such as Java applets, ActiveX, audio and video files.

**Evidence:**
```
{
  "url": "https://claude5-f5d80.firebaseapp.com/?doc=..%2F..%2F..%2Fetc%2Fpasswd"
}
```


#### INFO: Content Security Policy (CSP) Header Not Set

- **CWE:** CWE-693 (Unknown)
- **Tool:** browser-scanner

**Description:**
Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks, including Cross Site Scripting (XSS) and data injection attacks. These attacks are used for everything from data theft to site defacement or distribution of malware. CSP provides a set of standard HTTP headers that allow website owners to declare approved sources of content that browsers should be allowed to load on that page — covered types are JavaScript, CSS, HTML frames, fonts, images and embeddable objects such as Java applets, ActiveX, audio and video files.

**Evidence:**
```
{
  "url": "https://claude5-f5d80.firebaseapp.com/?doc=..%5C..%5C..%5Cwindows%5Cwin.ini"
}
```


#### INFO: Content Security Policy (CSP) Header Not Set

- **CWE:** CWE-693 (Unknown)
- **Tool:** browser-scanner

**Description:**
Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks, including Cross Site Scripting (XSS) and data injection attacks. These attacks are used for everything from data theft to site defacement or distribution of malware. CSP provides a set of standard HTTP headers that allow website owners to declare approved sources of content that browsers should be allowed to load on that page — covered types are JavaScript, CSS, HTML frames, fonts, images and embeddable objects such as Java applets, ActiveX, audio and video files.

**Evidence:**
```
{
  "url": "https://claude5-f5d80.firebaseapp.com/?doc=....%2F%2F....%2F%2F....%2F%2Fetc%2Fpasswd"
}
```


#### INFO: Content Security Policy (CSP) Header Not Set

- **CWE:** CWE-693 (Unknown)
- **Tool:** browser-scanner

**Description:**
Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks, including Cross Site Scripting (XSS) and data injection attacks. These attacks are used for everything from data theft to site defacement or distribution of malware. CSP provides a set of standard HTTP headers that allow website owners to declare approved sources of content that browsers should be allowed to load on that page — covered types are JavaScript, CSS, HTML frames, fonts, images and embeddable objects such as Java applets, ActiveX, audio and video files.

**Evidence:**
```
{
  "url": "https://claude5-f5d80.firebaseapp.com/?doc=..%252f..%252f..%252fetc%2Fpasswd"
}
```


#### INFO: Content Security Policy (CSP) Header Not Set

- **CWE:** CWE-693 (Unknown)
- **Tool:** browser-scanner

**Description:**
Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks, including Cross Site Scripting (XSS) and data injection attacks. These attacks are used for everything from data theft to site defacement or distribution of malware. CSP provides a set of standard HTTP headers that allow website owners to declare approved sources of content that browsers should be allowed to load on that page — covered types are JavaScript, CSS, HTML frames, fonts, images and embeddable objects such as Java applets, ActiveX, audio and video files.

**Evidence:**
```
{
  "url": "https://claude5-f5d80.firebaseapp.com/?page=..%2F..%2F..%2Fetc%2Fpasswd"
}
```


#### INFO: Content Security Policy (CSP) Header Not Set

- **CWE:** CWE-693 (Unknown)
- **Tool:** browser-scanner

**Description:**
Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks, including Cross Site Scripting (XSS) and data injection attacks. These attacks are used for everything from data theft to site defacement or distribution of malware. CSP provides a set of standard HTTP headers that allow website owners to declare approved sources of content that browsers should be allowed to load on that page — covered types are JavaScript, CSS, HTML frames, fonts, images and embeddable objects such as Java applets, ActiveX, audio and video files.

**Evidence:**
```
{
  "url": "https://claude5-f5d80.firebaseapp.com/?page=..%5C..%5C..%5Cwindows%5Cwin.ini"
}
```


#### INFO: Content Security Policy (CSP) Header Not Set

- **CWE:** CWE-693 (Unknown)
- **Tool:** browser-scanner

**Description:**
Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks, including Cross Site Scripting (XSS) and data injection attacks. These attacks are used for everything from data theft to site defacement or distribution of malware. CSP provides a set of standard HTTP headers that allow website owners to declare approved sources of content that browsers should be allowed to load on that page — covered types are JavaScript, CSS, HTML frames, fonts, images and embeddable objects such as Java applets, ActiveX, audio and video files.

**Evidence:**
```
{
  "url": "https://claude5-f5d80.firebaseapp.com/?page=....%2F%2F....%2F%2F....%2F%2Fetc%2Fpasswd"
}
```


#### INFO: Content Security Policy (CSP) Header Not Set

- **CWE:** CWE-693 (Unknown)
- **Tool:** browser-scanner

**Description:**
Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks, including Cross Site Scripting (XSS) and data injection attacks. These attacks are used for everything from data theft to site defacement or distribution of malware. CSP provides a set of standard HTTP headers that allow website owners to declare approved sources of content that browsers should be allowed to load on that page — covered types are JavaScript, CSS, HTML frames, fonts, images and embeddable objects such as Java applets, ActiveX, audio and video files.

**Evidence:**
```
{
  "url": "https://claude5-f5d80.firebaseapp.com/?page=..%252f..%252f..%252fetc%2Fpasswd"
}
```


#### INFO: Content Security Policy (CSP) Header Not Set

- **CWE:** CWE-693 (Unknown)
- **Tool:** browser-scanner

**Description:**
Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks, including Cross Site Scripting (XSS) and data injection attacks. These attacks are used for everything from data theft to site defacement or distribution of malware. CSP provides a set of standard HTTP headers that allow website owners to declare approved sources of content that browsers should be allowed to load on that page — covered types are JavaScript, CSS, HTML frames, fonts, images and embeddable objects such as Java applets, ActiveX, audio and video files.

**Evidence:**
```
{
  "url": "https://claude5-f5d80.firebaseapp.com/?template=..%2F..%2F..%2Fetc%2Fpasswd"
}
```


#### INFO: Content Security Policy (CSP) Header Not Set

- **CWE:** CWE-693 (Unknown)
- **Tool:** browser-scanner

**Description:**
Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks, including Cross Site Scripting (XSS) and data injection attacks. These attacks are used for everything from data theft to site defacement or distribution of malware. CSP provides a set of standard HTTP headers that allow website owners to declare approved sources of content that browsers should be allowed to load on that page — covered types are JavaScript, CSS, HTML frames, fonts, images and embeddable objects such as Java applets, ActiveX, audio and video files.

**Evidence:**
```
{
  "url": "https://claude5-f5d80.firebaseapp.com/?template=..%5C..%5C..%5Cwindows%5Cwin.ini"
}
```


#### INFO: Content Security Policy (CSP) Header Not Set

- **CWE:** CWE-693 (Unknown)
- **Tool:** browser-scanner

**Description:**
Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks, including Cross Site Scripting (XSS) and data injection attacks. These attacks are used for everything from data theft to site defacement or distribution of malware. CSP provides a set of standard HTTP headers that allow website owners to declare approved sources of content that browsers should be allowed to load on that page — covered types are JavaScript, CSS, HTML frames, fonts, images and embeddable objects such as Java applets, ActiveX, audio and video files.

**Evidence:**
```
{
  "url": "https://claude5-f5d80.firebaseapp.com/?template=....%2F%2F....%2F%2F....%2F%2Fetc%2Fpasswd"
}
```


#### INFO: Content Security Policy (CSP) Header Not Set

- **CWE:** CWE-693 (Unknown)
- **Tool:** browser-scanner

**Description:**
Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks, including Cross Site Scripting (XSS) and data injection attacks. These attacks are used for everything from data theft to site defacement or distribution of malware. CSP provides a set of standard HTTP headers that allow website owners to declare approved sources of content that browsers should be allowed to load on that page — covered types are JavaScript, CSS, HTML frames, fonts, images and embeddable objects such as Java applets, ActiveX, audio and video files.

**Evidence:**
```
{
  "url": "https://claude5-f5d80.firebaseapp.com/?template=..%252f..%252f..%252fetc%2Fpasswd"
}
```


#### INFO: Content Security Policy (CSP) Header Not Set

- **CWE:** CWE-693 (Unknown)
- **Tool:** browser-scanner

**Description:**
Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks, including Cross Site Scripting (XSS) and data injection attacks. These attacks are used for everything from data theft to site defacement or distribution of malware. CSP provides a set of standard HTTP headers that allow website owners to declare approved sources of content that browsers should be allowed to load on that page — covered types are JavaScript, CSS, HTML frames, fonts, images and embeddable objects such as Java applets, ActiveX, audio and video files.

**Evidence:**
```
{
  "url": "https://claude5-f5d80.firebaseapp.com/?include=..%2F..%2F..%2Fetc%2Fpasswd"
}
```


#### INFO: Content Security Policy (CSP) Header Not Set

- **CWE:** CWE-693 (Unknown)
- **Tool:** browser-scanner

**Description:**
Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks, including Cross Site Scripting (XSS) and data injection attacks. These attacks are used for everything from data theft to site defacement or distribution of malware. CSP provides a set of standard HTTP headers that allow website owners to declare approved sources of content that browsers should be allowed to load on that page — covered types are JavaScript, CSS, HTML frames, fonts, images and embeddable objects such as Java applets, ActiveX, audio and video files.

**Evidence:**
```
{
  "url": "https://claude5-f5d80.firebaseapp.com/?include=..%5C..%5C..%5Cwindows%5Cwin.ini"
}
```


#### INFO: Content Security Policy (CSP) Header Not Set

- **CWE:** CWE-693 (Unknown)
- **Tool:** browser-scanner

**Description:**
Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks, including Cross Site Scripting (XSS) and data injection attacks. These attacks are used for everything from data theft to site defacement or distribution of malware. CSP provides a set of standard HTTP headers that allow website owners to declare approved sources of content that browsers should be allowed to load on that page — covered types are JavaScript, CSS, HTML frames, fonts, images and embeddable objects such as Java applets, ActiveX, audio and video files.

**Evidence:**
```
{
  "url": "https://claude5-f5d80.firebaseapp.com/?include=....%2F%2F....%2F%2F....%2F%2Fetc%2Fpasswd"
}
```


#### INFO: Content Security Policy (CSP) Header Not Set

- **CWE:** CWE-693 (Unknown)
- **Tool:** browser-scanner

**Description:**
Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks, including Cross Site Scripting (XSS) and data injection attacks. These attacks are used for everything from data theft to site defacement or distribution of malware. CSP provides a set of standard HTTP headers that allow website owners to declare approved sources of content that browsers should be allowed to load on that page — covered types are JavaScript, CSS, HTML frames, fonts, images and embeddable objects such as Java applets, ActiveX, audio and video files.

**Evidence:**
```
{
  "url": "https://claude5-f5d80.firebaseapp.com/?include=..%252f..%252f..%252fetc%2Fpasswd"
}
```


#### INFO: Content Security Policy (CSP) Header Not Set

- **CWE:** CWE-693 (Unknown)
- **Tool:** browser-scanner

**Description:**
Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks, including Cross Site Scripting (XSS) and data injection attacks. These attacks are used for everything from data theft to site defacement or distribution of malware. CSP provides a set of standard HTTP headers that allow website owners to declare approved sources of content that browsers should be allowed to load on that page — covered types are JavaScript, CSS, HTML frames, fonts, images and embeddable objects such as Java applets, ActiveX, audio and video files.

**Evidence:**
```
{
  "url": "https://claude5-f5d80.firebaseapp.com/?dir=..%2F..%2F..%2Fetc%2Fpasswd"
}
```


#### INFO: Content Security Policy (CSP) Header Not Set

- **CWE:** CWE-693 (Unknown)
- **Tool:** browser-scanner

**Description:**
Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks, including Cross Site Scripting (XSS) and data injection attacks. These attacks are used for everything from data theft to site defacement or distribution of malware. CSP provides a set of standard HTTP headers that allow website owners to declare approved sources of content that browsers should be allowed to load on that page — covered types are JavaScript, CSS, HTML frames, fonts, images and embeddable objects such as Java applets, ActiveX, audio and video files.

**Evidence:**
```
{
  "url": "https://claude5-f5d80.firebaseapp.com/?dir=..%5C..%5C..%5Cwindows%5Cwin.ini"
}
```


#### INFO: Content Security Policy (CSP) Header Not Set

- **CWE:** CWE-693 (Unknown)
- **Tool:** browser-scanner

**Description:**
Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks, including Cross Site Scripting (XSS) and data injection attacks. These attacks are used for everything from data theft to site defacement or distribution of malware. CSP provides a set of standard HTTP headers that allow website owners to declare approved sources of content that browsers should be allowed to load on that page — covered types are JavaScript, CSS, HTML frames, fonts, images and embeddable objects such as Java applets, ActiveX, audio and video files.

**Evidence:**
```
{
  "url": "https://claude5-f5d80.firebaseapp.com/?dir=....%2F%2F....%2F%2F....%2F%2Fetc%2Fpasswd"
}
```


#### INFO: Content Security Policy (CSP) Header Not Set

- **CWE:** CWE-693 (Unknown)
- **Tool:** browser-scanner

**Description:**
Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks, including Cross Site Scripting (XSS) and data injection attacks. These attacks are used for everything from data theft to site defacement or distribution of malware. CSP provides a set of standard HTTP headers that allow website owners to declare approved sources of content that browsers should be allowed to load on that page — covered types are JavaScript, CSS, HTML frames, fonts, images and embeddable objects such as Java applets, ActiveX, audio and video files.

**Evidence:**
```
{
  "url": "https://claude5-f5d80.firebaseapp.com/?dir=..%252f..%252f..%252fetc%2Fpasswd"
}
```


#### INFO: Content Security Policy (CSP) Header Not Set

- **CWE:** CWE-693 (Unknown)
- **Tool:** browser-scanner

**Description:**
Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks, including Cross Site Scripting (XSS) and data injection attacks. These attacks are used for everything from data theft to site defacement or distribution of malware. CSP provides a set of standard HTTP headers that allow website owners to declare approved sources of content that browsers should be allowed to load on that page — covered types are JavaScript, CSS, HTML frames, fonts, images and embeddable objects such as Java applets, ActiveX, audio and video files.

**Evidence:**
```
{
  "url": "https://claude5-f5d80.firebaseapp.com/?folder=..%2F..%2F..%2Fetc%2Fpasswd"
}
```


#### INFO: Content Security Policy (CSP) Header Not Set

- **CWE:** CWE-693 (Unknown)
- **Tool:** browser-scanner

**Description:**
Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks, including Cross Site Scripting (XSS) and data injection attacks. These attacks are used for everything from data theft to site defacement or distribution of malware. CSP provides a set of standard HTTP headers that allow website owners to declare approved sources of content that browsers should be allowed to load on that page — covered types are JavaScript, CSS, HTML frames, fonts, images and embeddable objects such as Java applets, ActiveX, audio and video files.

**Evidence:**
```
{
  "url": "https://claude5-f5d80.firebaseapp.com/?folder=..%5C..%5C..%5Cwindows%5Cwin.ini"
}
```


#### INFO: Content Security Policy (CSP) Header Not Set

- **CWE:** CWE-693 (Unknown)
- **Tool:** browser-scanner

**Description:**
Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks, including Cross Site Scripting (XSS) and data injection attacks. These attacks are used for everything from data theft to site defacement or distribution of malware. CSP provides a set of standard HTTP headers that allow website owners to declare approved sources of content that browsers should be allowed to load on that page — covered types are JavaScript, CSS, HTML frames, fonts, images and embeddable objects such as Java applets, ActiveX, audio and video files.

**Evidence:**
```
{
  "url": "https://claude5-f5d80.firebaseapp.com/?folder=....%2F%2F....%2F%2F....%2F%2Fetc%2Fpasswd"
}
```


#### INFO: Content Security Policy (CSP) Header Not Set

- **CWE:** CWE-693 (Unknown)
- **Tool:** browser-scanner

**Description:**
Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks, including Cross Site Scripting (XSS) and data injection attacks. These attacks are used for everything from data theft to site defacement or distribution of malware. CSP provides a set of standard HTTP headers that allow website owners to declare approved sources of content that browsers should be allowed to load on that page — covered types are JavaScript, CSS, HTML frames, fonts, images and embeddable objects such as Java applets, ActiveX, audio and video files.

**Evidence:**
```
{
  "url": "https://claude5-f5d80.firebaseapp.com/?folder=..%252f..%252f..%252fetc%2Fpasswd"
}
```


#### INFO: Content Security Policy (CSP) Header Not Set

- **CWE:** CWE-693 (Unknown)
- **Tool:** browser-scanner

**Description:**
Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks, including Cross Site Scripting (XSS) and data injection attacks. These attacks are used for everything from data theft to site defacement or distribution of malware. CSP provides a set of standard HTTP headers that allow website owners to declare approved sources of content that browsers should be allowed to load on that page — covered types are JavaScript, CSS, HTML frames, fonts, images and embeddable objects such as Java applets, ActiveX, audio and video files.

**Evidence:**
```
{
  "url": "https://claude5-f5d80.firebaseapp.com/?load=..%2F..%2F..%2Fetc%2Fpasswd"
}
```


#### INFO: Content Security Policy (CSP) Header Not Set

- **CWE:** CWE-693 (Unknown)
- **Tool:** browser-scanner

**Description:**
Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks, including Cross Site Scripting (XSS) and data injection attacks. These attacks are used for everything from data theft to site defacement or distribution of malware. CSP provides a set of standard HTTP headers that allow website owners to declare approved sources of content that browsers should be allowed to load on that page — covered types are JavaScript, CSS, HTML frames, fonts, images and embeddable objects such as Java applets, ActiveX, audio and video files.

**Evidence:**
```
{
  "url": "https://claude5-f5d80.firebaseapp.com/?load=..%5C..%5C..%5Cwindows%5Cwin.ini"
}
```


#### INFO: Content Security Policy (CSP) Header Not Set

- **CWE:** CWE-693 (Unknown)
- **Tool:** browser-scanner

**Description:**
Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks, including Cross Site Scripting (XSS) and data injection attacks. These attacks are used for everything from data theft to site defacement or distribution of malware. CSP provides a set of standard HTTP headers that allow website owners to declare approved sources of content that browsers should be allowed to load on that page — covered types are JavaScript, CSS, HTML frames, fonts, images and embeddable objects such as Java applets, ActiveX, audio and video files.

**Evidence:**
```
{
  "url": "https://claude5-f5d80.firebaseapp.com/?load=....%2F%2F....%2F%2F....%2F%2Fetc%2Fpasswd"
}
```


#### INFO: Content Security Policy (CSP) Header Not Set

- **CWE:** CWE-693 (Unknown)
- **Tool:** browser-scanner

**Description:**
Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks, including Cross Site Scripting (XSS) and data injection attacks. These attacks are used for everything from data theft to site defacement or distribution of malware. CSP provides a set of standard HTTP headers that allow website owners to declare approved sources of content that browsers should be allowed to load on that page — covered types are JavaScript, CSS, HTML frames, fonts, images and embeddable objects such as Java applets, ActiveX, audio and video files.

**Evidence:**
```
{
  "url": "https://claude5-f5d80.firebaseapp.com/?load=..%252f..%252f..%252fetc%2Fpasswd"
}
```


#### INFO: Content Security Policy (CSP) Header Not Set

- **CWE:** CWE-693 (Unknown)
- **Tool:** browser-scanner

**Description:**
Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks, including Cross Site Scripting (XSS) and data injection attacks. These attacks are used for everything from data theft to site defacement or distribution of malware. CSP provides a set of standard HTTP headers that allow website owners to declare approved sources of content that browsers should be allowed to load on that page — covered types are JavaScript, CSS, HTML frames, fonts, images and embeddable objects such as Java applets, ActiveX, audio and video files.

**Evidence:**
```
{
  "url": "https://claude5-f5d80.firebaseapp.com/?read=..%2F..%2F..%2Fetc%2Fpasswd"
}
```


#### INFO: Content Security Policy (CSP) Header Not Set

- **CWE:** CWE-693 (Unknown)
- **Tool:** browser-scanner

**Description:**
Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks, including Cross Site Scripting (XSS) and data injection attacks. These attacks are used for everything from data theft to site defacement or distribution of malware. CSP provides a set of standard HTTP headers that allow website owners to declare approved sources of content that browsers should be allowed to load on that page — covered types are JavaScript, CSS, HTML frames, fonts, images and embeddable objects such as Java applets, ActiveX, audio and video files.

**Evidence:**
```
{
  "url": "https://claude5-f5d80.firebaseapp.com/?read=..%5C..%5C..%5Cwindows%5Cwin.ini"
}
```


#### INFO: Content Security Policy (CSP) Header Not Set

- **CWE:** CWE-693 (Unknown)
- **Tool:** browser-scanner

**Description:**
Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks, including Cross Site Scripting (XSS) and data injection attacks. These attacks are used for everything from data theft to site defacement or distribution of malware. CSP provides a set of standard HTTP headers that allow website owners to declare approved sources of content that browsers should be allowed to load on that page — covered types are JavaScript, CSS, HTML frames, fonts, images and embeddable objects such as Java applets, ActiveX, audio and video files.

**Evidence:**
```
{
  "url": "https://claude5-f5d80.firebaseapp.com/?read=....%2F%2F....%2F%2F....%2F%2Fetc%2Fpasswd"
}
```


#### INFO: Content Security Policy (CSP) Header Not Set

- **CWE:** CWE-693 (Unknown)
- **Tool:** browser-scanner

**Description:**
Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks, including Cross Site Scripting (XSS) and data injection attacks. These attacks are used for everything from data theft to site defacement or distribution of malware. CSP provides a set of standard HTTP headers that allow website owners to declare approved sources of content that browsers should be allowed to load on that page — covered types are JavaScript, CSS, HTML frames, fonts, images and embeddable objects such as Java applets, ActiveX, audio and video files.

**Evidence:**
```
{
  "url": "https://claude5-f5d80.firebaseapp.com/?read=..%252f..%252f..%252fetc%2Fpasswd"
}
```


#### INFO: Content Security Policy (CSP) Header Not Set

- **CWE:** CWE-693 (Unknown)
- **Tool:** browser-scanner

**Description:**
Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks, including Cross Site Scripting (XSS) and data injection attacks. These attacks are used for everything from data theft to site defacement or distribution of malware. CSP provides a set of standard HTTP headers that allow website owners to declare approved sources of content that browsers should be allowed to load on that page — covered types are JavaScript, CSS, HTML frames, fonts, images and embeddable objects such as Java applets, ActiveX, audio and video files.

**Evidence:**
```
{
  "url": "https://claude5-f5d80.firebaseapp.com/images/"
}
```


#### INFO: Content Security Policy (CSP) Header Not Set

- **CWE:** CWE-693 (Unknown)
- **Tool:** browser-scanner

**Description:**
Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks, including Cross Site Scripting (XSS) and data injection attacks. These attacks are used for everything from data theft to site defacement or distribution of malware. CSP provides a set of standard HTTP headers that allow website owners to declare approved sources of content that browsers should be allowed to load on that page — covered types are JavaScript, CSS, HTML frames, fonts, images and embeddable objects such as Java applets, ActiveX, audio and video files.

**Evidence:**
```
{
  "url": "https://claude5-f5d80.firebaseapp.com/uploads/"
}
```


#### INFO: Content Security Policy (CSP) Header Not Set

- **CWE:** CWE-693 (Unknown)
- **Tool:** browser-scanner

**Description:**
Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks, including Cross Site Scripting (XSS) and data injection attacks. These attacks are used for everything from data theft to site defacement or distribution of malware. CSP provides a set of standard HTTP headers that allow website owners to declare approved sources of content that browsers should be allowed to load on that page — covered types are JavaScript, CSS, HTML frames, fonts, images and embeddable objects such as Java applets, ActiveX, audio and video files.

**Evidence:**
```
{
  "url": "https://claude5-f5d80.firebaseapp.com/files/"
}
```


#### INFO: Content Security Policy (CSP) Header Not Set

- **CWE:** CWE-693 (Unknown)
- **Tool:** browser-scanner

**Description:**
Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks, including Cross Site Scripting (XSS) and data injection attacks. These attacks are used for everything from data theft to site defacement or distribution of malware. CSP provides a set of standard HTTP headers that allow website owners to declare approved sources of content that browsers should be allowed to load on that page — covered types are JavaScript, CSS, HTML frames, fonts, images and embeddable objects such as Java applets, ActiveX, audio and video files.

**Evidence:**
```
{
  "url": "https://claude5-f5d80.firebaseapp.com/assets/"
}
```


#### INFO: Content Security Policy (CSP) Header Not Set

- **CWE:** CWE-693 (Unknown)
- **Tool:** browser-scanner

**Description:**
Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks, including Cross Site Scripting (XSS) and data injection attacks. These attacks are used for everything from data theft to site defacement or distribution of malware. CSP provides a set of standard HTTP headers that allow website owners to declare approved sources of content that browsers should be allowed to load on that page — covered types are JavaScript, CSS, HTML frames, fonts, images and embeddable objects such as Java applets, ActiveX, audio and video files.

**Evidence:**
```
{
  "url": "https://claude5-f5d80.firebaseapp.com/static/"
}
```


#### INFO: Content Security Policy (CSP) Header Not Set

- **CWE:** CWE-693 (Unknown)
- **Tool:** browser-scanner

**Description:**
Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks, including Cross Site Scripting (XSS) and data injection attacks. These attacks are used for everything from data theft to site defacement or distribution of malware. CSP provides a set of standard HTTP headers that allow website owners to declare approved sources of content that browsers should be allowed to load on that page — covered types are JavaScript, CSS, HTML frames, fonts, images and embeddable objects such as Java applets, ActiveX, audio and video files.

**Evidence:**
```
{
  "url": "https://claude5-f5d80.firebaseapp.com/media/"
}
```


#### INFO: Content Security Policy (CSP) Header Not Set

- **CWE:** CWE-693 (Unknown)
- **Tool:** browser-scanner

**Description:**
Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks, including Cross Site Scripting (XSS) and data injection attacks. These attacks are used for everything from data theft to site defacement or distribution of malware. CSP provides a set of standard HTTP headers that allow website owners to declare approved sources of content that browsers should be allowed to load on that page — covered types are JavaScript, CSS, HTML frames, fonts, images and embeddable objects such as Java applets, ActiveX, audio and video files.

**Evidence:**
```
{
  "url": "https://claude5-f5d80.firebaseapp.com/backup/"
}
```


#### INFO: Content Security Policy (CSP) Header Not Set

- **CWE:** CWE-693 (Unknown)
- **Tool:** browser-scanner

**Description:**
Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks, including Cross Site Scripting (XSS) and data injection attacks. These attacks are used for everything from data theft to site defacement or distribution of malware. CSP provides a set of standard HTTP headers that allow website owners to declare approved sources of content that browsers should be allowed to load on that page — covered types are JavaScript, CSS, HTML frames, fonts, images and embeddable objects such as Java applets, ActiveX, audio and video files.

**Evidence:**
```
{
  "url": "https://claude5-f5d80.firebaseapp.com/logs/"
}
```


#### INFO: Content Security Policy (CSP) Header Not Set

- **CWE:** CWE-693 (Unknown)
- **Tool:** browser-scanner

**Description:**
Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks, including Cross Site Scripting (XSS) and data injection attacks. These attacks are used for everything from data theft to site defacement or distribution of malware. CSP provides a set of standard HTTP headers that allow website owners to declare approved sources of content that browsers should be allowed to load on that page — covered types are JavaScript, CSS, HTML frames, fonts, images and embeddable objects such as Java applets, ActiveX, audio and video files.

**Evidence:**
```
{
  "url": "https://claude5-f5d80.firebaseapp.com/tmp/"
}
```


#### INFO: Content Security Policy (CSP) Header Not Set

- **CWE:** CWE-693 (Unknown)
- **Tool:** browser-scanner

**Description:**
Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks, including Cross Site Scripting (XSS) and data injection attacks. These attacks are used for everything from data theft to site defacement or distribution of malware. CSP provides a set of standard HTTP headers that allow website owners to declare approved sources of content that browsers should be allowed to load on that page — covered types are JavaScript, CSS, HTML frames, fonts, images and embeddable objects such as Java applets, ActiveX, audio and video files.

**Evidence:**
```
{
  "url": "https://claude5-f5d80.firebaseapp.com/data/"
}
```


#### INFO: Content Security Policy (CSP) Header Not Set

- **CWE:** CWE-693 (Unknown)
- **Tool:** browser-scanner

**Description:**
Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks, including Cross Site Scripting (XSS) and data injection attacks. These attacks are used for everything from data theft to site defacement or distribution of malware. CSP provides a set of standard HTTP headers that allow website owners to declare approved sources of content that browsers should be allowed to load on that page — covered types are JavaScript, CSS, HTML frames, fonts, images and embeddable objects such as Java applets, ActiveX, audio and video files.

**Evidence:**
```
{
  "url": "https://claude5-f5d80.firebaseapp.com/admin"
}
```


#### INFO: Content Security Policy (CSP) Header Not Set

- **CWE:** CWE-693 (Unknown)
- **Tool:** browser-scanner

**Description:**
Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks, including Cross Site Scripting (XSS) and data injection attacks. These attacks are used for everything from data theft to site defacement or distribution of malware. CSP provides a set of standard HTTP headers that allow website owners to declare approved sources of content that browsers should be allowed to load on that page — covered types are JavaScript, CSS, HTML frames, fonts, images and embeddable objects such as Java applets, ActiveX, audio and video files.

**Evidence:**
```
{
  "url": "https://claude5-f5d80.firebaseapp.com/admin/"
}
```


#### INFO: Content Security Policy (CSP) Header Not Set

- **CWE:** CWE-693 (Unknown)
- **Tool:** browser-scanner

**Description:**
Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks, including Cross Site Scripting (XSS) and data injection attacks. These attacks are used for everything from data theft to site defacement or distribution of malware. CSP provides a set of standard HTTP headers that allow website owners to declare approved sources of content that browsers should be allowed to load on that page — covered types are JavaScript, CSS, HTML frames, fonts, images and embeddable objects such as Java applets, ActiveX, audio and video files.

**Evidence:**
```
{
  "url": "https://claude5-f5d80.firebaseapp.com/admin/dashboard"
}
```


#### INFO: Content Security Policy (CSP) Header Not Set

- **CWE:** CWE-693 (Unknown)
- **Tool:** browser-scanner

**Description:**
Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks, including Cross Site Scripting (XSS) and data injection attacks. These attacks are used for everything from data theft to site defacement or distribution of malware. CSP provides a set of standard HTTP headers that allow website owners to declare approved sources of content that browsers should be allowed to load on that page — covered types are JavaScript, CSS, HTML frames, fonts, images and embeddable objects such as Java applets, ActiveX, audio and video files.

**Evidence:**
```
{
  "url": "https://claude5-f5d80.firebaseapp.com/admin/users"
}
```


#### INFO: Content Security Policy (CSP) Header Not Set

- **CWE:** CWE-693 (Unknown)
- **Tool:** browser-scanner

**Description:**
Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks, including Cross Site Scripting (XSS) and data injection attacks. These attacks are used for everything from data theft to site defacement or distribution of malware. CSP provides a set of standard HTTP headers that allow website owners to declare approved sources of content that browsers should be allowed to load on that page — covered types are JavaScript, CSS, HTML frames, fonts, images and embeddable objects such as Java applets, ActiveX, audio and video files.

**Evidence:**
```
{
  "url": "https://claude5-f5d80.firebaseapp.com/admin/settings"
}
```


#### INFO: Content Security Policy (CSP) Header Not Set

- **CWE:** CWE-693 (Unknown)
- **Tool:** browser-scanner

**Description:**
Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks, including Cross Site Scripting (XSS) and data injection attacks. These attacks are used for everything from data theft to site defacement or distribution of malware. CSP provides a set of standard HTTP headers that allow website owners to declare approved sources of content that browsers should be allowed to load on that page — covered types are JavaScript, CSS, HTML frames, fonts, images and embeddable objects such as Java applets, ActiveX, audio and video files.

**Evidence:**
```
{
  "url": "https://claude5-f5d80.firebaseapp.com/administrator"
}
```


#### INFO: Content Security Policy (CSP) Header Not Set

- **CWE:** CWE-693 (Unknown)
- **Tool:** browser-scanner

**Description:**
Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks, including Cross Site Scripting (XSS) and data injection attacks. These attacks are used for everything from data theft to site defacement or distribution of malware. CSP provides a set of standard HTTP headers that allow website owners to declare approved sources of content that browsers should be allowed to load on that page — covered types are JavaScript, CSS, HTML frames, fonts, images and embeddable objects such as Java applets, ActiveX, audio and video files.

**Evidence:**
```
{
  "url": "https://claude5-f5d80.firebaseapp.com/manage"
}
```


#### INFO: Content Security Policy (CSP) Header Not Set

- **CWE:** CWE-693 (Unknown)
- **Tool:** browser-scanner

**Description:**
Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks, including Cross Site Scripting (XSS) and data injection attacks. These attacks are used for everything from data theft to site defacement or distribution of malware. CSP provides a set of standard HTTP headers that allow website owners to declare approved sources of content that browsers should be allowed to load on that page — covered types are JavaScript, CSS, HTML frames, fonts, images and embeddable objects such as Java applets, ActiveX, audio and video files.

**Evidence:**
```
{
  "url": "https://claude5-f5d80.firebaseapp.com/management"
}
```


#### INFO: Content Security Policy (CSP) Header Not Set

- **CWE:** CWE-693 (Unknown)
- **Tool:** browser-scanner

**Description:**
Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks, including Cross Site Scripting (XSS) and data injection attacks. These attacks are used for everything from data theft to site defacement or distribution of malware. CSP provides a set of standard HTTP headers that allow website owners to declare approved sources of content that browsers should be allowed to load on that page — covered types are JavaScript, CSS, HTML frames, fonts, images and embeddable objects such as Java applets, ActiveX, audio and video files.

**Evidence:**
```
{
  "url": "https://claude5-f5d80.firebaseapp.com/console"
}
```


#### INFO: Content Security Policy (CSP) Header Not Set

- **CWE:** CWE-693 (Unknown)
- **Tool:** browser-scanner

**Description:**
Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks, including Cross Site Scripting (XSS) and data injection attacks. These attacks are used for everything from data theft to site defacement or distribution of malware. CSP provides a set of standard HTTP headers that allow website owners to declare approved sources of content that browsers should be allowed to load on that page — covered types are JavaScript, CSS, HTML frames, fonts, images and embeddable objects such as Java applets, ActiveX, audio and video files.

**Evidence:**
```
{
  "url": "https://claude5-f5d80.firebaseapp.com/panel"
}
```


#### INFO: Content Security Policy (CSP) Header Not Set

- **CWE:** CWE-693 (Unknown)
- **Tool:** browser-scanner

**Description:**
Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks, including Cross Site Scripting (XSS) and data injection attacks. These attacks are used for everything from data theft to site defacement or distribution of malware. CSP provides a set of standard HTTP headers that allow website owners to declare approved sources of content that browsers should be allowed to load on that page — covered types are JavaScript, CSS, HTML frames, fonts, images and embeddable objects such as Java applets, ActiveX, audio and video files.

**Evidence:**
```
{
  "url": "https://claude5-f5d80.firebaseapp.com/backoffice"
}
```


#### INFO: Content Security Policy (CSP) Header Not Set

- **CWE:** CWE-693 (Unknown)
- **Tool:** browser-scanner

**Description:**
Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks, including Cross Site Scripting (XSS) and data injection attacks. These attacks are used for everything from data theft to site defacement or distribution of malware. CSP provides a set of standard HTTP headers that allow website owners to declare approved sources of content that browsers should be allowed to load on that page — covered types are JavaScript, CSS, HTML frames, fonts, images and embeddable objects such as Java applets, ActiveX, audio and video files.

**Evidence:**
```
{
  "url": "https://claude5-f5d80.firebaseapp.com/backend"
}
```


#### INFO: Content Security Policy (CSP) Header Not Set

- **CWE:** CWE-693 (Unknown)
- **Tool:** browser-scanner

**Description:**
Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks, including Cross Site Scripting (XSS) and data injection attacks. These attacks are used for everything from data theft to site defacement or distribution of malware. CSP provides a set of standard HTTP headers that allow website owners to declare approved sources of content that browsers should be allowed to load on that page — covered types are JavaScript, CSS, HTML frames, fonts, images and embeddable objects such as Java applets, ActiveX, audio and video files.

**Evidence:**
```
{
  "url": "https://claude5-f5d80.firebaseapp.com/dashboard/admin"
}
```


#### INFO: Content Security Policy (CSP) Header Not Set

- **CWE:** CWE-693 (Unknown)
- **Tool:** browser-scanner

**Description:**
Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks, including Cross Site Scripting (XSS) and data injection attacks. These attacks are used for everything from data theft to site defacement or distribution of malware. CSP provides a set of standard HTTP headers that allow website owners to declare approved sources of content that browsers should be allowed to load on that page — covered types are JavaScript, CSS, HTML frames, fonts, images and embeddable objects such as Java applets, ActiveX, audio and video files.

**Evidence:**
```
{
  "url": "https://claude5-f5d80.firebaseapp.com/api/admin"
}
```


#### INFO: Content Security Policy (CSP) Header Not Set

- **CWE:** CWE-693 (Unknown)
- **Tool:** browser-scanner

**Description:**
Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks, including Cross Site Scripting (XSS) and data injection attacks. These attacks are used for everything from data theft to site defacement or distribution of malware. CSP provides a set of standard HTTP headers that allow website owners to declare approved sources of content that browsers should be allowed to load on that page — covered types are JavaScript, CSS, HTML frames, fonts, images and embeddable objects such as Java applets, ActiveX, audio and video files.

**Evidence:**
```
{
  "url": "https://claude5-f5d80.firebaseapp.com/api/users"
}
```


#### INFO: Content Security Policy (CSP) Header Not Set

- **CWE:** CWE-693 (Unknown)
- **Tool:** browser-scanner

**Description:**
Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks, including Cross Site Scripting (XSS) and data injection attacks. These attacks are used for everything from data theft to site defacement or distribution of malware. CSP provides a set of standard HTTP headers that allow website owners to declare approved sources of content that browsers should be allowed to load on that page — covered types are JavaScript, CSS, HTML frames, fonts, images and embeddable objects such as Java applets, ActiveX, audio and video files.

**Evidence:**
```
{
  "url": "https://claude5-f5d80.firebaseapp.com/.git/config"
}
```


#### INFO: Content Security Policy (CSP) Header Not Set

- **CWE:** CWE-693 (Unknown)
- **Tool:** browser-scanner

**Description:**
Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks, including Cross Site Scripting (XSS) and data injection attacks. These attacks are used for everything from data theft to site defacement or distribution of malware. CSP provides a set of standard HTTP headers that allow website owners to declare approved sources of content that browsers should be allowed to load on that page — covered types are JavaScript, CSS, HTML frames, fonts, images and embeddable objects such as Java applets, ActiveX, audio and video files.

**Evidence:**
```
{
  "url": "https://claude5-f5d80.firebaseapp.com/.git/HEAD"
}
```


#### INFO: Content Security Policy (CSP) Header Not Set

- **CWE:** CWE-693 (Unknown)
- **Tool:** browser-scanner

**Description:**
Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks, including Cross Site Scripting (XSS) and data injection attacks. These attacks are used for everything from data theft to site defacement or distribution of malware. CSP provides a set of standard HTTP headers that allow website owners to declare approved sources of content that browsers should be allowed to load on that page — covered types are JavaScript, CSS, HTML frames, fonts, images and embeddable objects such as Java applets, ActiveX, audio and video files.

**Evidence:**
```
{
  "url": "https://claude5-f5d80.firebaseapp.com/.env"
}
```


#### INFO: Content Security Policy (CSP) Header Not Set

- **CWE:** CWE-693 (Unknown)
- **Tool:** browser-scanner

**Description:**
Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks, including Cross Site Scripting (XSS) and data injection attacks. These attacks are used for everything from data theft to site defacement or distribution of malware. CSP provides a set of standard HTTP headers that allow website owners to declare approved sources of content that browsers should be allowed to load on that page — covered types are JavaScript, CSS, HTML frames, fonts, images and embeddable objects such as Java applets, ActiveX, audio and video files.

**Evidence:**
```
{
  "url": "https://claude5-f5d80.firebaseapp.com/.env.local"
}
```


#### INFO: Content Security Policy (CSP) Header Not Set

- **CWE:** CWE-693 (Unknown)
- **Tool:** browser-scanner

**Description:**
Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks, including Cross Site Scripting (XSS) and data injection attacks. These attacks are used for everything from data theft to site defacement or distribution of malware. CSP provides a set of standard HTTP headers that allow website owners to declare approved sources of content that browsers should be allowed to load on that page — covered types are JavaScript, CSS, HTML frames, fonts, images and embeddable objects such as Java applets, ActiveX, audio and video files.

**Evidence:**
```
{
  "url": "https://claude5-f5d80.firebaseapp.com/.env.production"
}
```


#### INFO: Content Security Policy (CSP) Header Not Set

- **CWE:** CWE-693 (Unknown)
- **Tool:** browser-scanner

**Description:**
Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks, including Cross Site Scripting (XSS) and data injection attacks. These attacks are used for everything from data theft to site defacement or distribution of malware. CSP provides a set of standard HTTP headers that allow website owners to declare approved sources of content that browsers should be allowed to load on that page — covered types are JavaScript, CSS, HTML frames, fonts, images and embeddable objects such as Java applets, ActiveX, audio and video files.

**Evidence:**
```
{
  "url": "https://claude5-f5d80.firebaseapp.com/config.json"
}
```


#### INFO: Content Security Policy (CSP) Header Not Set

- **CWE:** CWE-693 (Unknown)
- **Tool:** browser-scanner

**Description:**
Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks, including Cross Site Scripting (XSS) and data injection attacks. These attacks are used for everything from data theft to site defacement or distribution of malware. CSP provides a set of standard HTTP headers that allow website owners to declare approved sources of content that browsers should be allowed to load on that page — covered types are JavaScript, CSS, HTML frames, fonts, images and embeddable objects such as Java applets, ActiveX, audio and video files.

**Evidence:**
```
{
  "url": "https://claude5-f5d80.firebaseapp.com/config.yaml"
}
```


#### INFO: Content Security Policy (CSP) Header Not Set

- **CWE:** CWE-693 (Unknown)
- **Tool:** browser-scanner

**Description:**
Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks, including Cross Site Scripting (XSS) and data injection attacks. These attacks are used for everything from data theft to site defacement or distribution of malware. CSP provides a set of standard HTTP headers that allow website owners to declare approved sources of content that browsers should be allowed to load on that page — covered types are JavaScript, CSS, HTML frames, fonts, images and embeddable objects such as Java applets, ActiveX, audio and video files.

**Evidence:**
```
{
  "url": "https://claude5-f5d80.firebaseapp.com/config.yml"
}
```


#### INFO: Content Security Policy (CSP) Header Not Set

- **CWE:** CWE-693 (Unknown)
- **Tool:** browser-scanner

**Description:**
Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks, including Cross Site Scripting (XSS) and data injection attacks. These attacks are used for everything from data theft to site defacement or distribution of malware. CSP provides a set of standard HTTP headers that allow website owners to declare approved sources of content that browsers should be allowed to load on that page — covered types are JavaScript, CSS, HTML frames, fonts, images and embeddable objects such as Java applets, ActiveX, audio and video files.

**Evidence:**
```
{
  "url": "https://claude5-f5d80.firebaseapp.com/firebase.json"
}
```


#### INFO: Content Security Policy (CSP) Header Not Set

- **CWE:** CWE-693 (Unknown)
- **Tool:** browser-scanner

**Description:**
Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks, including Cross Site Scripting (XSS) and data injection attacks. These attacks are used for everything from data theft to site defacement or distribution of malware. CSP provides a set of standard HTTP headers that allow website owners to declare approved sources of content that browsers should be allowed to load on that page — covered types are JavaScript, CSS, HTML frames, fonts, images and embeddable objects such as Java applets, ActiveX, audio and video files.

**Evidence:**
```
{
  "url": "https://claude5-f5d80.firebaseapp.com/package.json"
}
```


#### INFO: Content Security Policy (CSP) Header Not Set

- **CWE:** CWE-693 (Unknown)
- **Tool:** browser-scanner

**Description:**
Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks, including Cross Site Scripting (XSS) and data injection attacks. These attacks are used for everything from data theft to site defacement or distribution of malware. CSP provides a set of standard HTTP headers that allow website owners to declare approved sources of content that browsers should be allowed to load on that page — covered types are JavaScript, CSS, HTML frames, fonts, images and embeddable objects such as Java applets, ActiveX, audio and video files.

**Evidence:**
```
{
  "url": "https://claude5-f5d80.firebaseapp.com/package-lock.json"
}
```


#### INFO: Content Security Policy (CSP) Header Not Set

- **CWE:** CWE-693 (Unknown)
- **Tool:** browser-scanner

**Description:**
Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks, including Cross Site Scripting (XSS) and data injection attacks. These attacks are used for everything from data theft to site defacement or distribution of malware. CSP provides a set of standard HTTP headers that allow website owners to declare approved sources of content that browsers should be allowed to load on that page — covered types are JavaScript, CSS, HTML frames, fonts, images and embeddable objects such as Java applets, ActiveX, audio and video files.

**Evidence:**
```
{
  "url": "https://claude5-f5d80.firebaseapp.com/composer.json"
}
```


#### INFO: Content Security Policy (CSP) Header Not Set

- **CWE:** CWE-693 (Unknown)
- **Tool:** browser-scanner

**Description:**
Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks, including Cross Site Scripting (XSS) and data injection attacks. These attacks are used for everything from data theft to site defacement or distribution of malware. CSP provides a set of standard HTTP headers that allow website owners to declare approved sources of content that browsers should be allowed to load on that page — covered types are JavaScript, CSS, HTML frames, fonts, images and embeddable objects such as Java applets, ActiveX, audio and video files.

**Evidence:**
```
{
  "url": "https://claude5-f5d80.firebaseapp.com/composer.lock"
}
```


#### INFO: Content Security Policy (CSP) Header Not Set

- **CWE:** CWE-693 (Unknown)
- **Tool:** browser-scanner

**Description:**
Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks, including Cross Site Scripting (XSS) and data injection attacks. These attacks are used for everything from data theft to site defacement or distribution of malware. CSP provides a set of standard HTTP headers that allow website owners to declare approved sources of content that browsers should be allowed to load on that page — covered types are JavaScript, CSS, HTML frames, fonts, images and embeddable objects such as Java applets, ActiveX, audio and video files.

**Evidence:**
```
{
  "url": "https://claude5-f5d80.firebaseapp.com/webpack.config.js"
}
```


#### INFO: Content Security Policy (CSP) Header Not Set

- **CWE:** CWE-693 (Unknown)
- **Tool:** browser-scanner

**Description:**
Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks, including Cross Site Scripting (XSS) and data injection attacks. These attacks are used for everything from data theft to site defacement or distribution of malware. CSP provides a set of standard HTTP headers that allow website owners to declare approved sources of content that browsers should be allowed to load on that page — covered types are JavaScript, CSS, HTML frames, fonts, images and embeddable objects such as Java applets, ActiveX, audio and video files.

**Evidence:**
```
{
  "url": "https://claude5-f5d80.firebaseapp.com/tsconfig.json"
}
```


#### INFO: Content Security Policy (CSP) Header Not Set

- **CWE:** CWE-693 (Unknown)
- **Tool:** browser-scanner

**Description:**
Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks, including Cross Site Scripting (XSS) and data injection attacks. These attacks are used for everything from data theft to site defacement or distribution of malware. CSP provides a set of standard HTTP headers that allow website owners to declare approved sources of content that browsers should be allowed to load on that page — covered types are JavaScript, CSS, HTML frames, fonts, images and embeddable objects such as Java applets, ActiveX, audio and video files.

**Evidence:**
```
{
  "url": "https://claude5-f5d80.firebaseapp.com/.htaccess"
}
```


#### INFO: Content Security Policy (CSP) Header Not Set

- **CWE:** CWE-693 (Unknown)
- **Tool:** browser-scanner

**Description:**
Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks, including Cross Site Scripting (XSS) and data injection attacks. These attacks are used for everything from data theft to site defacement or distribution of malware. CSP provides a set of standard HTTP headers that allow website owners to declare approved sources of content that browsers should be allowed to load on that page — covered types are JavaScript, CSS, HTML frames, fonts, images and embeddable objects such as Java applets, ActiveX, audio and video files.

**Evidence:**
```
{
  "url": "https://claude5-f5d80.firebaseapp.com/.htpasswd"
}
```


#### INFO: Content Security Policy (CSP) Header Not Set

- **CWE:** CWE-693 (Unknown)
- **Tool:** browser-scanner

**Description:**
Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks, including Cross Site Scripting (XSS) and data injection attacks. These attacks are used for everything from data theft to site defacement or distribution of malware. CSP provides a set of standard HTTP headers that allow website owners to declare approved sources of content that browsers should be allowed to load on that page — covered types are JavaScript, CSS, HTML frames, fonts, images and embeddable objects such as Java applets, ActiveX, audio and video files.

**Evidence:**
```
{
  "url": "https://claude5-f5d80.firebaseapp.com/robots.txt"
}
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
  "url": "https://claude5-f5d80.firebaseapp.com/sitemap.xml",
  "type": "ZAP-10038-1"
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
  "url": "https://claude5-f5d80.firebaseapp.com/",
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
  "url": "https://claude5-f5d80.firebaseapp.com/home",
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
  "url": "https://claude5-f5d80.firebaseapp.com/profile",
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
  "url": "https://claude5-f5d80.firebaseapp.com/settings",
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
  "url": "https://claude5-f5d80.firebaseapp.com/posts",
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
  "url": "https://claude5-f5d80.firebaseapp.com/messages",
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
  "url": "https://claude5-f5d80.firebaseapp.com/feed",
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
  "url": "https://claude5-f5d80.firebaseapp.com/__nonexistent__1765840839599_772536e9d6a31",
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
  "url": "https://claude5-f5d80.firebaseapp.com/?file=..%2F..%2F..%2Fetc%2Fpasswd",
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
  "url": "https://claude5-f5d80.firebaseapp.com/?file=..%5C..%5C..%5Cwindows%5Cwin.ini",
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
  "url": "https://claude5-f5d80.firebaseapp.com/?file=....%2F%2F....%2F%2F....%2F%2Fetc%2Fpasswd",
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
  "url": "https://claude5-f5d80.firebaseapp.com/?file=..%252f..%252f..%252fetc%2Fpasswd",
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
  "url": "https://claude5-f5d80.firebaseapp.com/?path=..%2F..%2F..%2Fetc%2Fpasswd",
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
  "url": "https://claude5-f5d80.firebaseapp.com/?path=..%5C..%5C..%5Cwindows%5Cwin.ini",
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
  "url": "https://claude5-f5d80.firebaseapp.com/?path=....%2F%2F....%2F%2F....%2F%2Fetc%2Fpasswd",
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
  "url": "https://claude5-f5d80.firebaseapp.com/?path=..%252f..%252f..%252fetc%2Fpasswd",
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
  "url": "https://claude5-f5d80.firebaseapp.com/?filepath=..%2F..%2F..%2Fetc%2Fpasswd",
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
  "url": "https://claude5-f5d80.firebaseapp.com/?filepath=..%5C..%5C..%5Cwindows%5Cwin.ini",
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
  "url": "https://claude5-f5d80.firebaseapp.com/?filepath=....%2F%2F....%2F%2F....%2F%2Fetc%2Fpasswd",
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
  "url": "https://claude5-f5d80.firebaseapp.com/?filepath=..%252f..%252f..%252fetc%2Fpasswd",
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
  "url": "https://claude5-f5d80.firebaseapp.com/?document=..%2F..%2F..%2Fetc%2Fpasswd",
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
  "url": "https://claude5-f5d80.firebaseapp.com/?document=..%5C..%5C..%5Cwindows%5Cwin.ini",
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
  "url": "https://claude5-f5d80.firebaseapp.com/?document=....%2F%2F....%2F%2F....%2F%2Fetc%2Fpasswd",
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
  "url": "https://claude5-f5d80.firebaseapp.com/?document=..%252f..%252f..%252fetc%2Fpasswd",
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
  "url": "https://claude5-f5d80.firebaseapp.com/?doc=..%2F..%2F..%2Fetc%2Fpasswd",
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
  "url": "https://claude5-f5d80.firebaseapp.com/?doc=..%5C..%5C..%5Cwindows%5Cwin.ini",
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
  "url": "https://claude5-f5d80.firebaseapp.com/?doc=....%2F%2F....%2F%2F....%2F%2Fetc%2Fpasswd",
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
  "url": "https://claude5-f5d80.firebaseapp.com/?doc=..%252f..%252f..%252fetc%2Fpasswd",
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
  "url": "https://claude5-f5d80.firebaseapp.com/?page=..%2F..%2F..%2Fetc%2Fpasswd",
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
  "url": "https://claude5-f5d80.firebaseapp.com/?page=..%5C..%5C..%5Cwindows%5Cwin.ini",
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
  "url": "https://claude5-f5d80.firebaseapp.com/?page=....%2F%2F....%2F%2F....%2F%2Fetc%2Fpasswd",
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
  "url": "https://claude5-f5d80.firebaseapp.com/?page=..%252f..%252f..%252fetc%2Fpasswd",
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
  "url": "https://claude5-f5d80.firebaseapp.com/?template=..%2F..%2F..%2Fetc%2Fpasswd",
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
  "url": "https://claude5-f5d80.firebaseapp.com/?template=..%5C..%5C..%5Cwindows%5Cwin.ini",
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
  "url": "https://claude5-f5d80.firebaseapp.com/?template=....%2F%2F....%2F%2F....%2F%2Fetc%2Fpasswd",
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
  "url": "https://claude5-f5d80.firebaseapp.com/?template=..%252f..%252f..%252fetc%2Fpasswd",
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
  "url": "https://claude5-f5d80.firebaseapp.com/?include=..%2F..%2F..%2Fetc%2Fpasswd",
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
  "url": "https://claude5-f5d80.firebaseapp.com/?include=..%5C..%5C..%5Cwindows%5Cwin.ini",
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
  "url": "https://claude5-f5d80.firebaseapp.com/?include=....%2F%2F....%2F%2F....%2F%2Fetc%2Fpasswd",
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
  "url": "https://claude5-f5d80.firebaseapp.com/?include=..%252f..%252f..%252fetc%2Fpasswd",
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
  "url": "https://claude5-f5d80.firebaseapp.com/?dir=..%2F..%2F..%2Fetc%2Fpasswd",
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
  "url": "https://claude5-f5d80.firebaseapp.com/?dir=..%5C..%5C..%5Cwindows%5Cwin.ini",
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
  "url": "https://claude5-f5d80.firebaseapp.com/?dir=....%2F%2F....%2F%2F....%2F%2Fetc%2Fpasswd",
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
  "url": "https://claude5-f5d80.firebaseapp.com/?dir=..%252f..%252f..%252fetc%2Fpasswd",
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
  "url": "https://claude5-f5d80.firebaseapp.com/?folder=..%2F..%2F..%2Fetc%2Fpasswd",
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
  "url": "https://claude5-f5d80.firebaseapp.com/?folder=..%5C..%5C..%5Cwindows%5Cwin.ini",
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
  "url": "https://claude5-f5d80.firebaseapp.com/?folder=....%2F%2F....%2F%2F....%2F%2Fetc%2Fpasswd",
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
  "url": "https://claude5-f5d80.firebaseapp.com/?folder=..%252f..%252f..%252fetc%2Fpasswd",
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
  "url": "https://claude5-f5d80.firebaseapp.com/?load=..%2F..%2F..%2Fetc%2Fpasswd",
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
  "url": "https://claude5-f5d80.firebaseapp.com/?load=..%5C..%5C..%5Cwindows%5Cwin.ini",
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
  "url": "https://claude5-f5d80.firebaseapp.com/?load=....%2F%2F....%2F%2F....%2F%2Fetc%2Fpasswd",
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
  "url": "https://claude5-f5d80.firebaseapp.com/?load=..%252f..%252f..%252fetc%2Fpasswd",
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
  "url": "https://claude5-f5d80.firebaseapp.com/?read=..%2F..%2F..%2Fetc%2Fpasswd",
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
  "url": "https://claude5-f5d80.firebaseapp.com/?read=..%5C..%5C..%5Cwindows%5Cwin.ini",
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
  "url": "https://claude5-f5d80.firebaseapp.com/?read=....%2F%2F....%2F%2F....%2F%2Fetc%2Fpasswd",
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
  "url": "https://claude5-f5d80.firebaseapp.com/?read=..%252f..%252f..%252fetc%2Fpasswd",
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
  "url": "https://claude5-f5d80.firebaseapp.com/images/",
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
  "url": "https://claude5-f5d80.firebaseapp.com/uploads/",
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
  "url": "https://claude5-f5d80.firebaseapp.com/files/",
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
  "url": "https://claude5-f5d80.firebaseapp.com/assets/",
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
  "url": "https://claude5-f5d80.firebaseapp.com/static/",
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
  "url": "https://claude5-f5d80.firebaseapp.com/media/",
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
  "url": "https://claude5-f5d80.firebaseapp.com/backup/",
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
  "url": "https://claude5-f5d80.firebaseapp.com/logs/",
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
  "url": "https://claude5-f5d80.firebaseapp.com/tmp/",
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
  "url": "https://claude5-f5d80.firebaseapp.com/data/",
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
  "url": "https://claude5-f5d80.firebaseapp.com/admin",
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
  "url": "https://claude5-f5d80.firebaseapp.com/admin/",
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
  "url": "https://claude5-f5d80.firebaseapp.com/admin/dashboard",
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
  "url": "https://claude5-f5d80.firebaseapp.com/admin/users",
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
  "url": "https://claude5-f5d80.firebaseapp.com/admin/settings",
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
  "url": "https://claude5-f5d80.firebaseapp.com/administrator",
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
  "url": "https://claude5-f5d80.firebaseapp.com/manage",
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
  "url": "https://claude5-f5d80.firebaseapp.com/management",
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
  "url": "https://claude5-f5d80.firebaseapp.com/console",
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
  "url": "https://claude5-f5d80.firebaseapp.com/panel",
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
  "url": "https://claude5-f5d80.firebaseapp.com/backoffice",
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
  "url": "https://claude5-f5d80.firebaseapp.com/backend",
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
  "url": "https://claude5-f5d80.firebaseapp.com/dashboard/admin",
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
  "url": "https://claude5-f5d80.firebaseapp.com/api/admin",
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
  "url": "https://claude5-f5d80.firebaseapp.com/api/users",
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
  "url": "https://claude5-f5d80.firebaseapp.com/.git/config",
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
  "url": "https://claude5-f5d80.firebaseapp.com/.git/HEAD",
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
  "url": "https://claude5-f5d80.firebaseapp.com/.env",
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
  "url": "https://claude5-f5d80.firebaseapp.com/.env.local",
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
  "url": "https://claude5-f5d80.firebaseapp.com/.env.production",
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
  "url": "https://claude5-f5d80.firebaseapp.com/config.json",
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
  "url": "https://claude5-f5d80.firebaseapp.com/config.yaml",
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
  "url": "https://claude5-f5d80.firebaseapp.com/config.yml",
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
  "url": "https://claude5-f5d80.firebaseapp.com/firebase.json",
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
  "url": "https://claude5-f5d80.firebaseapp.com/package.json",
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
  "url": "https://claude5-f5d80.firebaseapp.com/package-lock.json",
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
  "url": "https://claude5-f5d80.firebaseapp.com/composer.json",
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
  "url": "https://claude5-f5d80.firebaseapp.com/composer.lock",
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
  "url": "https://claude5-f5d80.firebaseapp.com/webpack.config.js",
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
  "url": "https://claude5-f5d80.firebaseapp.com/tsconfig.json",
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
  "url": "https://claude5-f5d80.firebaseapp.com/.htaccess",
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
  "url": "https://claude5-f5d80.firebaseapp.com/.htpasswd",
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
  "url": "https://claude5-f5d80.firebaseapp.com/robots.txt",
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
  "url": "https://claude5-f5d80.firebaseapp.com/sitemap.xml",
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
  "url": "https://claude5-f5d80.firebaseapp.com/",
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
  "url": "https://claude5-f5d80.firebaseapp.com/home",
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
  "url": "https://claude5-f5d80.firebaseapp.com/profile",
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
  "url": "https://claude5-f5d80.firebaseapp.com/settings",
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
  "url": "https://claude5-f5d80.firebaseapp.com/posts",
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
  "url": "https://claude5-f5d80.firebaseapp.com/messages",
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
  "url": "https://claude5-f5d80.firebaseapp.com/feed",
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
  "url": "https://claude5-f5d80.firebaseapp.com/__nonexistent__1765840839599_772536e9d6a31",
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
  "url": "https://claude5-f5d80.firebaseapp.com/?file=..%2F..%2F..%2Fetc%2Fpasswd",
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
  "url": "https://claude5-f5d80.firebaseapp.com/?file=..%5C..%5C..%5Cwindows%5Cwin.ini",
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
  "url": "https://claude5-f5d80.firebaseapp.com/?file=....%2F%2F....%2F%2F....%2F%2Fetc%2Fpasswd",
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
  "url": "https://claude5-f5d80.firebaseapp.com/?file=..%252f..%252f..%252fetc%2Fpasswd",
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
  "url": "https://claude5-f5d80.firebaseapp.com/?path=..%2F..%2F..%2Fetc%2Fpasswd",
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
  "url": "https://claude5-f5d80.firebaseapp.com/?path=..%5C..%5C..%5Cwindows%5Cwin.ini",
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
  "url": "https://claude5-f5d80.firebaseapp.com/?path=....%2F%2F....%2F%2F....%2F%2Fetc%2Fpasswd",
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
  "url": "https://claude5-f5d80.firebaseapp.com/?path=..%252f..%252f..%252fetc%2Fpasswd",
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
  "url": "https://claude5-f5d80.firebaseapp.com/?filepath=..%2F..%2F..%2Fetc%2Fpasswd",
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
  "url": "https://claude5-f5d80.firebaseapp.com/?filepath=..%5C..%5C..%5Cwindows%5Cwin.ini",
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
  "url": "https://claude5-f5d80.firebaseapp.com/?filepath=....%2F%2F....%2F%2F....%2F%2Fetc%2Fpasswd",
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
  "url": "https://claude5-f5d80.firebaseapp.com/?filepath=..%252f..%252f..%252fetc%2Fpasswd",
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
  "url": "https://claude5-f5d80.firebaseapp.com/?document=..%2F..%2F..%2Fetc%2Fpasswd",
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
  "url": "https://claude5-f5d80.firebaseapp.com/?document=..%5C..%5C..%5Cwindows%5Cwin.ini",
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
  "url": "https://claude5-f5d80.firebaseapp.com/?document=....%2F%2F....%2F%2F....%2F%2Fetc%2Fpasswd",
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
  "url": "https://claude5-f5d80.firebaseapp.com/?document=..%252f..%252f..%252fetc%2Fpasswd",
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
  "url": "https://claude5-f5d80.firebaseapp.com/?doc=..%2F..%2F..%2Fetc%2Fpasswd",
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
  "url": "https://claude5-f5d80.firebaseapp.com/?doc=..%5C..%5C..%5Cwindows%5Cwin.ini",
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
  "url": "https://claude5-f5d80.firebaseapp.com/?doc=....%2F%2F....%2F%2F....%2F%2Fetc%2Fpasswd",
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
  "url": "https://claude5-f5d80.firebaseapp.com/?doc=..%252f..%252f..%252fetc%2Fpasswd",
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
  "url": "https://claude5-f5d80.firebaseapp.com/?page=..%2F..%2F..%2Fetc%2Fpasswd",
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
  "url": "https://claude5-f5d80.firebaseapp.com/?page=..%5C..%5C..%5Cwindows%5Cwin.ini",
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
  "url": "https://claude5-f5d80.firebaseapp.com/?page=....%2F%2F....%2F%2F....%2F%2Fetc%2Fpasswd",
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
  "url": "https://claude5-f5d80.firebaseapp.com/?page=..%252f..%252f..%252fetc%2Fpasswd",
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
  "url": "https://claude5-f5d80.firebaseapp.com/?template=..%2F..%2F..%2Fetc%2Fpasswd",
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
  "url": "https://claude5-f5d80.firebaseapp.com/?template=..%5C..%5C..%5Cwindows%5Cwin.ini",
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
  "url": "https://claude5-f5d80.firebaseapp.com/?template=....%2F%2F....%2F%2F....%2F%2Fetc%2Fpasswd",
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
  "url": "https://claude5-f5d80.firebaseapp.com/?template=..%252f..%252f..%252fetc%2Fpasswd",
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
  "url": "https://claude5-f5d80.firebaseapp.com/?include=..%2F..%2F..%2Fetc%2Fpasswd",
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
  "url": "https://claude5-f5d80.firebaseapp.com/?include=..%5C..%5C..%5Cwindows%5Cwin.ini",
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
  "url": "https://claude5-f5d80.firebaseapp.com/?include=....%2F%2F....%2F%2F....%2F%2Fetc%2Fpasswd",
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
  "url": "https://claude5-f5d80.firebaseapp.com/?include=..%252f..%252f..%252fetc%2Fpasswd",
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
  "url": "https://claude5-f5d80.firebaseapp.com/?dir=..%2F..%2F..%2Fetc%2Fpasswd",
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
  "url": "https://claude5-f5d80.firebaseapp.com/?dir=..%5C..%5C..%5Cwindows%5Cwin.ini",
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
  "url": "https://claude5-f5d80.firebaseapp.com/?dir=....%2F%2F....%2F%2F....%2F%2Fetc%2Fpasswd",
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
  "url": "https://claude5-f5d80.firebaseapp.com/?dir=..%252f..%252f..%252fetc%2Fpasswd",
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
  "url": "https://claude5-f5d80.firebaseapp.com/?folder=..%2F..%2F..%2Fetc%2Fpasswd",
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
  "url": "https://claude5-f5d80.firebaseapp.com/?folder=..%5C..%5C..%5Cwindows%5Cwin.ini",
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
  "url": "https://claude5-f5d80.firebaseapp.com/?folder=....%2F%2F....%2F%2F....%2F%2Fetc%2Fpasswd",
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
  "url": "https://claude5-f5d80.firebaseapp.com/?folder=..%252f..%252f..%252fetc%2Fpasswd",
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
  "url": "https://claude5-f5d80.firebaseapp.com/?load=..%2F..%2F..%2Fetc%2Fpasswd",
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
  "url": "https://claude5-f5d80.firebaseapp.com/?load=..%5C..%5C..%5Cwindows%5Cwin.ini",
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
  "url": "https://claude5-f5d80.firebaseapp.com/?load=....%2F%2F....%2F%2F....%2F%2Fetc%2Fpasswd",
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
  "url": "https://claude5-f5d80.firebaseapp.com/?load=..%252f..%252f..%252fetc%2Fpasswd",
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
  "url": "https://claude5-f5d80.firebaseapp.com/?read=..%2F..%2F..%2Fetc%2Fpasswd",
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
  "url": "https://claude5-f5d80.firebaseapp.com/?read=..%5C..%5C..%5Cwindows%5Cwin.ini",
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
  "url": "https://claude5-f5d80.firebaseapp.com/?read=....%2F%2F....%2F%2F....%2F%2Fetc%2Fpasswd",
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
  "url": "https://claude5-f5d80.firebaseapp.com/?read=..%252f..%252f..%252fetc%2Fpasswd",
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
  "url": "https://claude5-f5d80.firebaseapp.com/images/",
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
  "url": "https://claude5-f5d80.firebaseapp.com/uploads/",
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
  "url": "https://claude5-f5d80.firebaseapp.com/files/",
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
  "url": "https://claude5-f5d80.firebaseapp.com/assets/",
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
  "url": "https://claude5-f5d80.firebaseapp.com/static/",
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
  "url": "https://claude5-f5d80.firebaseapp.com/media/",
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
  "url": "https://claude5-f5d80.firebaseapp.com/backup/",
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
  "url": "https://claude5-f5d80.firebaseapp.com/logs/",
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
  "url": "https://claude5-f5d80.firebaseapp.com/tmp/",
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
  "url": "https://claude5-f5d80.firebaseapp.com/data/",
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
  "url": "https://claude5-f5d80.firebaseapp.com/admin",
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
  "url": "https://claude5-f5d80.firebaseapp.com/admin/",
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
  "url": "https://claude5-f5d80.firebaseapp.com/admin/dashboard",
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
  "url": "https://claude5-f5d80.firebaseapp.com/admin/users",
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
  "url": "https://claude5-f5d80.firebaseapp.com/admin/settings",
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
  "url": "https://claude5-f5d80.firebaseapp.com/administrator",
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
  "url": "https://claude5-f5d80.firebaseapp.com/manage",
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
  "url": "https://claude5-f5d80.firebaseapp.com/management",
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
  "url": "https://claude5-f5d80.firebaseapp.com/console",
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
  "url": "https://claude5-f5d80.firebaseapp.com/panel",
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
  "url": "https://claude5-f5d80.firebaseapp.com/backoffice",
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
  "url": "https://claude5-f5d80.firebaseapp.com/backend",
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
  "url": "https://claude5-f5d80.firebaseapp.com/dashboard/admin",
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
  "url": "https://claude5-f5d80.firebaseapp.com/api/admin",
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
  "url": "https://claude5-f5d80.firebaseapp.com/api/users",
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
  "url": "https://claude5-f5d80.firebaseapp.com/.git/config",
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
  "url": "https://claude5-f5d80.firebaseapp.com/.git/HEAD",
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
  "url": "https://claude5-f5d80.firebaseapp.com/.env",
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
  "url": "https://claude5-f5d80.firebaseapp.com/.env.local",
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
  "url": "https://claude5-f5d80.firebaseapp.com/.env.production",
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
  "url": "https://claude5-f5d80.firebaseapp.com/config.json",
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
  "url": "https://claude5-f5d80.firebaseapp.com/config.yaml",
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
  "url": "https://claude5-f5d80.firebaseapp.com/config.yml",
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
  "url": "https://claude5-f5d80.firebaseapp.com/firebase.json",
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
  "url": "https://claude5-f5d80.firebaseapp.com/package.json",
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
  "url": "https://claude5-f5d80.firebaseapp.com/package-lock.json",
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
  "url": "https://claude5-f5d80.firebaseapp.com/composer.json",
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
  "url": "https://claude5-f5d80.firebaseapp.com/composer.lock",
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
  "url": "https://claude5-f5d80.firebaseapp.com/webpack.config.js",
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
  "url": "https://claude5-f5d80.firebaseapp.com/tsconfig.json",
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
  "url": "https://claude5-f5d80.firebaseapp.com/.htaccess",
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
  "url": "https://claude5-f5d80.firebaseapp.com/.htpasswd",
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
  "url": "https://claude5-f5d80.firebaseapp.com/robots.txt",
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
  "url": "https://claude5-f5d80.firebaseapp.com/sitemap.xml",
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
  "url": "https://claude5-f5d80.firebaseapp.com/",
  "type": "ZAP-10020-1"
}
```


#### INFO: Missing Anti-clickjacking Header

- **CWE:** CWE-1021 (Unknown)
- **Tool:** browser-scanner

**Description:**
The response does not protect against 'ClickJacking' attacks. It should include either Content-Security-Policy with 'frame-ancestors' directive or X-Frame-Options.

**Evidence:**
```
{
  "detail": "N/A",
  "url": "https://claude5-f5d80.firebaseapp.com/home",
  "type": "ZAP-10020-1"
}
```


#### INFO: Missing Anti-clickjacking Header

- **CWE:** CWE-1021 (Unknown)
- **Tool:** browser-scanner

**Description:**
The response does not protect against 'ClickJacking' attacks. It should include either Content-Security-Policy with 'frame-ancestors' directive or X-Frame-Options.

**Evidence:**
```
{
  "detail": "N/A",
  "url": "https://claude5-f5d80.firebaseapp.com/profile",
  "type": "ZAP-10020-1"
}
```


#### INFO: Missing Anti-clickjacking Header

- **CWE:** CWE-1021 (Unknown)
- **Tool:** browser-scanner

**Description:**
The response does not protect against 'ClickJacking' attacks. It should include either Content-Security-Policy with 'frame-ancestors' directive or X-Frame-Options.

**Evidence:**
```
{
  "detail": "N/A",
  "url": "https://claude5-f5d80.firebaseapp.com/settings",
  "type": "ZAP-10020-1"
}
```


#### INFO: Missing Anti-clickjacking Header

- **CWE:** CWE-1021 (Unknown)
- **Tool:** browser-scanner

**Description:**
The response does not protect against 'ClickJacking' attacks. It should include either Content-Security-Policy with 'frame-ancestors' directive or X-Frame-Options.

**Evidence:**
```
{
  "detail": "N/A",
  "url": "https://claude5-f5d80.firebaseapp.com/posts",
  "type": "ZAP-10020-1"
}
```


#### INFO: Missing Anti-clickjacking Header

- **CWE:** CWE-1021 (Unknown)
- **Tool:** browser-scanner

**Description:**
The response does not protect against 'ClickJacking' attacks. It should include either Content-Security-Policy with 'frame-ancestors' directive or X-Frame-Options.

**Evidence:**
```
{
  "detail": "N/A",
  "url": "https://claude5-f5d80.firebaseapp.com/messages",
  "type": "ZAP-10020-1"
}
```


#### INFO: Missing Anti-clickjacking Header

- **CWE:** CWE-1021 (Unknown)
- **Tool:** browser-scanner

**Description:**
The response does not protect against 'ClickJacking' attacks. It should include either Content-Security-Policy with 'frame-ancestors' directive or X-Frame-Options.

**Evidence:**
```
{
  "detail": "N/A",
  "url": "https://claude5-f5d80.firebaseapp.com/feed",
  "type": "ZAP-10020-1"
}
```


#### INFO: Missing Anti-clickjacking Header

- **CWE:** CWE-1021 (Unknown)
- **Tool:** browser-scanner

**Description:**
The response does not protect against 'ClickJacking' attacks. It should include either Content-Security-Policy with 'frame-ancestors' directive or X-Frame-Options.

**Evidence:**
```
{
  "detail": "N/A",
  "url": "https://claude5-f5d80.firebaseapp.com/__nonexistent__1765840839599_772536e9d6a31",
  "type": "ZAP-10020-1"
}
```


#### INFO: Missing Anti-clickjacking Header

- **CWE:** CWE-1021 (Unknown)
- **Tool:** browser-scanner

**Description:**
The response does not protect against 'ClickJacking' attacks. It should include either Content-Security-Policy with 'frame-ancestors' directive or X-Frame-Options.

**Evidence:**
```
{
  "detail": "N/A",
  "url": "https://claude5-f5d80.firebaseapp.com/?file=..%2F..%2F..%2Fetc%2Fpasswd",
  "type": "ZAP-10020-1"
}
```


#### INFO: Missing Anti-clickjacking Header

- **CWE:** CWE-1021 (Unknown)
- **Tool:** browser-scanner

**Description:**
The response does not protect against 'ClickJacking' attacks. It should include either Content-Security-Policy with 'frame-ancestors' directive or X-Frame-Options.

**Evidence:**
```
{
  "detail": "N/A",
  "url": "https://claude5-f5d80.firebaseapp.com/?file=..%5C..%5C..%5Cwindows%5Cwin.ini",
  "type": "ZAP-10020-1"
}
```


#### INFO: Missing Anti-clickjacking Header

- **CWE:** CWE-1021 (Unknown)
- **Tool:** browser-scanner

**Description:**
The response does not protect against 'ClickJacking' attacks. It should include either Content-Security-Policy with 'frame-ancestors' directive or X-Frame-Options.

**Evidence:**
```
{
  "detail": "N/A",
  "url": "https://claude5-f5d80.firebaseapp.com/?file=....%2F%2F....%2F%2F....%2F%2Fetc%2Fpasswd",
  "type": "ZAP-10020-1"
}
```


#### INFO: Missing Anti-clickjacking Header

- **CWE:** CWE-1021 (Unknown)
- **Tool:** browser-scanner

**Description:**
The response does not protect against 'ClickJacking' attacks. It should include either Content-Security-Policy with 'frame-ancestors' directive or X-Frame-Options.

**Evidence:**
```
{
  "detail": "N/A",
  "url": "https://claude5-f5d80.firebaseapp.com/?file=..%252f..%252f..%252fetc%2Fpasswd",
  "type": "ZAP-10020-1"
}
```


#### INFO: Missing Anti-clickjacking Header

- **CWE:** CWE-1021 (Unknown)
- **Tool:** browser-scanner

**Description:**
The response does not protect against 'ClickJacking' attacks. It should include either Content-Security-Policy with 'frame-ancestors' directive or X-Frame-Options.

**Evidence:**
```
{
  "detail": "N/A",
  "url": "https://claude5-f5d80.firebaseapp.com/?path=..%2F..%2F..%2Fetc%2Fpasswd",
  "type": "ZAP-10020-1"
}
```


#### INFO: Missing Anti-clickjacking Header

- **CWE:** CWE-1021 (Unknown)
- **Tool:** browser-scanner

**Description:**
The response does not protect against 'ClickJacking' attacks. It should include either Content-Security-Policy with 'frame-ancestors' directive or X-Frame-Options.

**Evidence:**
```
{
  "detail": "N/A",
  "url": "https://claude5-f5d80.firebaseapp.com/?path=..%5C..%5C..%5Cwindows%5Cwin.ini",
  "type": "ZAP-10020-1"
}
```


#### INFO: Missing Anti-clickjacking Header

- **CWE:** CWE-1021 (Unknown)
- **Tool:** browser-scanner

**Description:**
The response does not protect against 'ClickJacking' attacks. It should include either Content-Security-Policy with 'frame-ancestors' directive or X-Frame-Options.

**Evidence:**
```
{
  "detail": "N/A",
  "url": "https://claude5-f5d80.firebaseapp.com/?path=....%2F%2F....%2F%2F....%2F%2Fetc%2Fpasswd",
  "type": "ZAP-10020-1"
}
```


#### INFO: Missing Anti-clickjacking Header

- **CWE:** CWE-1021 (Unknown)
- **Tool:** browser-scanner

**Description:**
The response does not protect against 'ClickJacking' attacks. It should include either Content-Security-Policy with 'frame-ancestors' directive or X-Frame-Options.

**Evidence:**
```
{
  "detail": "N/A",
  "url": "https://claude5-f5d80.firebaseapp.com/?path=..%252f..%252f..%252fetc%2Fpasswd",
  "type": "ZAP-10020-1"
}
```


#### INFO: Missing Anti-clickjacking Header

- **CWE:** CWE-1021 (Unknown)
- **Tool:** browser-scanner

**Description:**
The response does not protect against 'ClickJacking' attacks. It should include either Content-Security-Policy with 'frame-ancestors' directive or X-Frame-Options.

**Evidence:**
```
{
  "detail": "N/A",
  "url": "https://claude5-f5d80.firebaseapp.com/?filepath=..%2F..%2F..%2Fetc%2Fpasswd",
  "type": "ZAP-10020-1"
}
```


#### INFO: Missing Anti-clickjacking Header

- **CWE:** CWE-1021 (Unknown)
- **Tool:** browser-scanner

**Description:**
The response does not protect against 'ClickJacking' attacks. It should include either Content-Security-Policy with 'frame-ancestors' directive or X-Frame-Options.

**Evidence:**
```
{
  "detail": "N/A",
  "url": "https://claude5-f5d80.firebaseapp.com/?filepath=..%5C..%5C..%5Cwindows%5Cwin.ini",
  "type": "ZAP-10020-1"
}
```


#### INFO: Missing Anti-clickjacking Header

- **CWE:** CWE-1021 (Unknown)
- **Tool:** browser-scanner

**Description:**
The response does not protect against 'ClickJacking' attacks. It should include either Content-Security-Policy with 'frame-ancestors' directive or X-Frame-Options.

**Evidence:**
```
{
  "detail": "N/A",
  "url": "https://claude5-f5d80.firebaseapp.com/?filepath=....%2F%2F....%2F%2F....%2F%2Fetc%2Fpasswd",
  "type": "ZAP-10020-1"
}
```


#### INFO: Missing Anti-clickjacking Header

- **CWE:** CWE-1021 (Unknown)
- **Tool:** browser-scanner

**Description:**
The response does not protect against 'ClickJacking' attacks. It should include either Content-Security-Policy with 'frame-ancestors' directive or X-Frame-Options.

**Evidence:**
```
{
  "detail": "N/A",
  "url": "https://claude5-f5d80.firebaseapp.com/?filepath=..%252f..%252f..%252fetc%2Fpasswd",
  "type": "ZAP-10020-1"
}
```


#### INFO: Missing Anti-clickjacking Header

- **CWE:** CWE-1021 (Unknown)
- **Tool:** browser-scanner

**Description:**
The response does not protect against 'ClickJacking' attacks. It should include either Content-Security-Policy with 'frame-ancestors' directive or X-Frame-Options.

**Evidence:**
```
{
  "detail": "N/A",
  "url": "https://claude5-f5d80.firebaseapp.com/?document=..%2F..%2F..%2Fetc%2Fpasswd",
  "type": "ZAP-10020-1"
}
```


#### INFO: Missing Anti-clickjacking Header

- **CWE:** CWE-1021 (Unknown)
- **Tool:** browser-scanner

**Description:**
The response does not protect against 'ClickJacking' attacks. It should include either Content-Security-Policy with 'frame-ancestors' directive or X-Frame-Options.

**Evidence:**
```
{
  "detail": "N/A",
  "url": "https://claude5-f5d80.firebaseapp.com/?document=..%5C..%5C..%5Cwindows%5Cwin.ini",
  "type": "ZAP-10020-1"
}
```


#### INFO: Missing Anti-clickjacking Header

- **CWE:** CWE-1021 (Unknown)
- **Tool:** browser-scanner

**Description:**
The response does not protect against 'ClickJacking' attacks. It should include either Content-Security-Policy with 'frame-ancestors' directive or X-Frame-Options.

**Evidence:**
```
{
  "detail": "N/A",
  "url": "https://claude5-f5d80.firebaseapp.com/?document=....%2F%2F....%2F%2F....%2F%2Fetc%2Fpasswd",
  "type": "ZAP-10020-1"
}
```


#### INFO: Missing Anti-clickjacking Header

- **CWE:** CWE-1021 (Unknown)
- **Tool:** browser-scanner

**Description:**
The response does not protect against 'ClickJacking' attacks. It should include either Content-Security-Policy with 'frame-ancestors' directive or X-Frame-Options.

**Evidence:**
```
{
  "detail": "N/A",
  "url": "https://claude5-f5d80.firebaseapp.com/?document=..%252f..%252f..%252fetc%2Fpasswd",
  "type": "ZAP-10020-1"
}
```


#### INFO: Missing Anti-clickjacking Header

- **CWE:** CWE-1021 (Unknown)
- **Tool:** browser-scanner

**Description:**
The response does not protect against 'ClickJacking' attacks. It should include either Content-Security-Policy with 'frame-ancestors' directive or X-Frame-Options.

**Evidence:**
```
{
  "detail": "N/A",
  "url": "https://claude5-f5d80.firebaseapp.com/?doc=..%2F..%2F..%2Fetc%2Fpasswd",
  "type": "ZAP-10020-1"
}
```


#### INFO: Missing Anti-clickjacking Header

- **CWE:** CWE-1021 (Unknown)
- **Tool:** browser-scanner

**Description:**
The response does not protect against 'ClickJacking' attacks. It should include either Content-Security-Policy with 'frame-ancestors' directive or X-Frame-Options.

**Evidence:**
```
{
  "detail": "N/A",
  "url": "https://claude5-f5d80.firebaseapp.com/?doc=..%5C..%5C..%5Cwindows%5Cwin.ini",
  "type": "ZAP-10020-1"
}
```


#### INFO: Missing Anti-clickjacking Header

- **CWE:** CWE-1021 (Unknown)
- **Tool:** browser-scanner

**Description:**
The response does not protect against 'ClickJacking' attacks. It should include either Content-Security-Policy with 'frame-ancestors' directive or X-Frame-Options.

**Evidence:**
```
{
  "detail": "N/A",
  "url": "https://claude5-f5d80.firebaseapp.com/?doc=....%2F%2F....%2F%2F....%2F%2Fetc%2Fpasswd",
  "type": "ZAP-10020-1"
}
```


#### INFO: Missing Anti-clickjacking Header

- **CWE:** CWE-1021 (Unknown)
- **Tool:** browser-scanner

**Description:**
The response does not protect against 'ClickJacking' attacks. It should include either Content-Security-Policy with 'frame-ancestors' directive or X-Frame-Options.

**Evidence:**
```
{
  "detail": "N/A",
  "url": "https://claude5-f5d80.firebaseapp.com/?doc=..%252f..%252f..%252fetc%2Fpasswd",
  "type": "ZAP-10020-1"
}
```


#### INFO: Missing Anti-clickjacking Header

- **CWE:** CWE-1021 (Unknown)
- **Tool:** browser-scanner

**Description:**
The response does not protect against 'ClickJacking' attacks. It should include either Content-Security-Policy with 'frame-ancestors' directive or X-Frame-Options.

**Evidence:**
```
{
  "detail": "N/A",
  "url": "https://claude5-f5d80.firebaseapp.com/?page=..%2F..%2F..%2Fetc%2Fpasswd",
  "type": "ZAP-10020-1"
}
```


#### INFO: Missing Anti-clickjacking Header

- **CWE:** CWE-1021 (Unknown)
- **Tool:** browser-scanner

**Description:**
The response does not protect against 'ClickJacking' attacks. It should include either Content-Security-Policy with 'frame-ancestors' directive or X-Frame-Options.

**Evidence:**
```
{
  "detail": "N/A",
  "url": "https://claude5-f5d80.firebaseapp.com/?page=..%5C..%5C..%5Cwindows%5Cwin.ini",
  "type": "ZAP-10020-1"
}
```


#### INFO: Missing Anti-clickjacking Header

- **CWE:** CWE-1021 (Unknown)
- **Tool:** browser-scanner

**Description:**
The response does not protect against 'ClickJacking' attacks. It should include either Content-Security-Policy with 'frame-ancestors' directive or X-Frame-Options.

**Evidence:**
```
{
  "detail": "N/A",
  "url": "https://claude5-f5d80.firebaseapp.com/?page=....%2F%2F....%2F%2F....%2F%2Fetc%2Fpasswd",
  "type": "ZAP-10020-1"
}
```


#### INFO: Missing Anti-clickjacking Header

- **CWE:** CWE-1021 (Unknown)
- **Tool:** browser-scanner

**Description:**
The response does not protect against 'ClickJacking' attacks. It should include either Content-Security-Policy with 'frame-ancestors' directive or X-Frame-Options.

**Evidence:**
```
{
  "detail": "N/A",
  "url": "https://claude5-f5d80.firebaseapp.com/?page=..%252f..%252f..%252fetc%2Fpasswd",
  "type": "ZAP-10020-1"
}
```


#### INFO: Missing Anti-clickjacking Header

- **CWE:** CWE-1021 (Unknown)
- **Tool:** browser-scanner

**Description:**
The response does not protect against 'ClickJacking' attacks. It should include either Content-Security-Policy with 'frame-ancestors' directive or X-Frame-Options.

**Evidence:**
```
{
  "detail": "N/A",
  "url": "https://claude5-f5d80.firebaseapp.com/?template=..%2F..%2F..%2Fetc%2Fpasswd",
  "type": "ZAP-10020-1"
}
```


#### INFO: Missing Anti-clickjacking Header

- **CWE:** CWE-1021 (Unknown)
- **Tool:** browser-scanner

**Description:**
The response does not protect against 'ClickJacking' attacks. It should include either Content-Security-Policy with 'frame-ancestors' directive or X-Frame-Options.

**Evidence:**
```
{
  "detail": "N/A",
  "url": "https://claude5-f5d80.firebaseapp.com/?template=..%5C..%5C..%5Cwindows%5Cwin.ini",
  "type": "ZAP-10020-1"
}
```


#### INFO: Missing Anti-clickjacking Header

- **CWE:** CWE-1021 (Unknown)
- **Tool:** browser-scanner

**Description:**
The response does not protect against 'ClickJacking' attacks. It should include either Content-Security-Policy with 'frame-ancestors' directive or X-Frame-Options.

**Evidence:**
```
{
  "detail": "N/A",
  "url": "https://claude5-f5d80.firebaseapp.com/?template=....%2F%2F....%2F%2F....%2F%2Fetc%2Fpasswd",
  "type": "ZAP-10020-1"
}
```


#### INFO: Missing Anti-clickjacking Header

- **CWE:** CWE-1021 (Unknown)
- **Tool:** browser-scanner

**Description:**
The response does not protect against 'ClickJacking' attacks. It should include either Content-Security-Policy with 'frame-ancestors' directive or X-Frame-Options.

**Evidence:**
```
{
  "detail": "N/A",
  "url": "https://claude5-f5d80.firebaseapp.com/?template=..%252f..%252f..%252fetc%2Fpasswd",
  "type": "ZAP-10020-1"
}
```


#### INFO: Missing Anti-clickjacking Header

- **CWE:** CWE-1021 (Unknown)
- **Tool:** browser-scanner

**Description:**
The response does not protect against 'ClickJacking' attacks. It should include either Content-Security-Policy with 'frame-ancestors' directive or X-Frame-Options.

**Evidence:**
```
{
  "detail": "N/A",
  "url": "https://claude5-f5d80.firebaseapp.com/?include=..%2F..%2F..%2Fetc%2Fpasswd",
  "type": "ZAP-10020-1"
}
```


#### INFO: Missing Anti-clickjacking Header

- **CWE:** CWE-1021 (Unknown)
- **Tool:** browser-scanner

**Description:**
The response does not protect against 'ClickJacking' attacks. It should include either Content-Security-Policy with 'frame-ancestors' directive or X-Frame-Options.

**Evidence:**
```
{
  "detail": "N/A",
  "url": "https://claude5-f5d80.firebaseapp.com/?include=..%5C..%5C..%5Cwindows%5Cwin.ini",
  "type": "ZAP-10020-1"
}
```


#### INFO: Missing Anti-clickjacking Header

- **CWE:** CWE-1021 (Unknown)
- **Tool:** browser-scanner

**Description:**
The response does not protect against 'ClickJacking' attacks. It should include either Content-Security-Policy with 'frame-ancestors' directive or X-Frame-Options.

**Evidence:**
```
{
  "detail": "N/A",
  "url": "https://claude5-f5d80.firebaseapp.com/?include=....%2F%2F....%2F%2F....%2F%2Fetc%2Fpasswd",
  "type": "ZAP-10020-1"
}
```


#### INFO: Missing Anti-clickjacking Header

- **CWE:** CWE-1021 (Unknown)
- **Tool:** browser-scanner

**Description:**
The response does not protect against 'ClickJacking' attacks. It should include either Content-Security-Policy with 'frame-ancestors' directive or X-Frame-Options.

**Evidence:**
```
{
  "detail": "N/A",
  "url": "https://claude5-f5d80.firebaseapp.com/?include=..%252f..%252f..%252fetc%2Fpasswd",
  "type": "ZAP-10020-1"
}
```


#### INFO: Missing Anti-clickjacking Header

- **CWE:** CWE-1021 (Unknown)
- **Tool:** browser-scanner

**Description:**
The response does not protect against 'ClickJacking' attacks. It should include either Content-Security-Policy with 'frame-ancestors' directive or X-Frame-Options.

**Evidence:**
```
{
  "detail": "N/A",
  "url": "https://claude5-f5d80.firebaseapp.com/?dir=..%2F..%2F..%2Fetc%2Fpasswd",
  "type": "ZAP-10020-1"
}
```


#### INFO: Missing Anti-clickjacking Header

- **CWE:** CWE-1021 (Unknown)
- **Tool:** browser-scanner

**Description:**
The response does not protect against 'ClickJacking' attacks. It should include either Content-Security-Policy with 'frame-ancestors' directive or X-Frame-Options.

**Evidence:**
```
{
  "detail": "N/A",
  "url": "https://claude5-f5d80.firebaseapp.com/?dir=..%5C..%5C..%5Cwindows%5Cwin.ini",
  "type": "ZAP-10020-1"
}
```


#### INFO: Missing Anti-clickjacking Header

- **CWE:** CWE-1021 (Unknown)
- **Tool:** browser-scanner

**Description:**
The response does not protect against 'ClickJacking' attacks. It should include either Content-Security-Policy with 'frame-ancestors' directive or X-Frame-Options.

**Evidence:**
```
{
  "detail": "N/A",
  "url": "https://claude5-f5d80.firebaseapp.com/?dir=....%2F%2F....%2F%2F....%2F%2Fetc%2Fpasswd",
  "type": "ZAP-10020-1"
}
```


#### INFO: Missing Anti-clickjacking Header

- **CWE:** CWE-1021 (Unknown)
- **Tool:** browser-scanner

**Description:**
The response does not protect against 'ClickJacking' attacks. It should include either Content-Security-Policy with 'frame-ancestors' directive or X-Frame-Options.

**Evidence:**
```
{
  "detail": "N/A",
  "url": "https://claude5-f5d80.firebaseapp.com/?dir=..%252f..%252f..%252fetc%2Fpasswd",
  "type": "ZAP-10020-1"
}
```


#### INFO: Missing Anti-clickjacking Header

- **CWE:** CWE-1021 (Unknown)
- **Tool:** browser-scanner

**Description:**
The response does not protect against 'ClickJacking' attacks. It should include either Content-Security-Policy with 'frame-ancestors' directive or X-Frame-Options.

**Evidence:**
```
{
  "detail": "N/A",
  "url": "https://claude5-f5d80.firebaseapp.com/?folder=..%2F..%2F..%2Fetc%2Fpasswd",
  "type": "ZAP-10020-1"
}
```


#### INFO: Missing Anti-clickjacking Header

- **CWE:** CWE-1021 (Unknown)
- **Tool:** browser-scanner

**Description:**
The response does not protect against 'ClickJacking' attacks. It should include either Content-Security-Policy with 'frame-ancestors' directive or X-Frame-Options.

**Evidence:**
```
{
  "detail": "N/A",
  "url": "https://claude5-f5d80.firebaseapp.com/?folder=..%5C..%5C..%5Cwindows%5Cwin.ini",
  "type": "ZAP-10020-1"
}
```


#### INFO: Missing Anti-clickjacking Header

- **CWE:** CWE-1021 (Unknown)
- **Tool:** browser-scanner

**Description:**
The response does not protect against 'ClickJacking' attacks. It should include either Content-Security-Policy with 'frame-ancestors' directive or X-Frame-Options.

**Evidence:**
```
{
  "detail": "N/A",
  "url": "https://claude5-f5d80.firebaseapp.com/?folder=....%2F%2F....%2F%2F....%2F%2Fetc%2Fpasswd",
  "type": "ZAP-10020-1"
}
```


#### INFO: Missing Anti-clickjacking Header

- **CWE:** CWE-1021 (Unknown)
- **Tool:** browser-scanner

**Description:**
The response does not protect against 'ClickJacking' attacks. It should include either Content-Security-Policy with 'frame-ancestors' directive or X-Frame-Options.

**Evidence:**
```
{
  "detail": "N/A",
  "url": "https://claude5-f5d80.firebaseapp.com/?folder=..%252f..%252f..%252fetc%2Fpasswd",
  "type": "ZAP-10020-1"
}
```


#### INFO: Missing Anti-clickjacking Header

- **CWE:** CWE-1021 (Unknown)
- **Tool:** browser-scanner

**Description:**
The response does not protect against 'ClickJacking' attacks. It should include either Content-Security-Policy with 'frame-ancestors' directive or X-Frame-Options.

**Evidence:**
```
{
  "detail": "N/A",
  "url": "https://claude5-f5d80.firebaseapp.com/?load=..%2F..%2F..%2Fetc%2Fpasswd",
  "type": "ZAP-10020-1"
}
```


#### INFO: Missing Anti-clickjacking Header

- **CWE:** CWE-1021 (Unknown)
- **Tool:** browser-scanner

**Description:**
The response does not protect against 'ClickJacking' attacks. It should include either Content-Security-Policy with 'frame-ancestors' directive or X-Frame-Options.

**Evidence:**
```
{
  "detail": "N/A",
  "url": "https://claude5-f5d80.firebaseapp.com/?load=..%5C..%5C..%5Cwindows%5Cwin.ini",
  "type": "ZAP-10020-1"
}
```


#### INFO: Missing Anti-clickjacking Header

- **CWE:** CWE-1021 (Unknown)
- **Tool:** browser-scanner

**Description:**
The response does not protect against 'ClickJacking' attacks. It should include either Content-Security-Policy with 'frame-ancestors' directive or X-Frame-Options.

**Evidence:**
```
{
  "detail": "N/A",
  "url": "https://claude5-f5d80.firebaseapp.com/?load=....%2F%2F....%2F%2F....%2F%2Fetc%2Fpasswd",
  "type": "ZAP-10020-1"
}
```


#### INFO: Missing Anti-clickjacking Header

- **CWE:** CWE-1021 (Unknown)
- **Tool:** browser-scanner

**Description:**
The response does not protect against 'ClickJacking' attacks. It should include either Content-Security-Policy with 'frame-ancestors' directive or X-Frame-Options.

**Evidence:**
```
{
  "detail": "N/A",
  "url": "https://claude5-f5d80.firebaseapp.com/?load=..%252f..%252f..%252fetc%2Fpasswd",
  "type": "ZAP-10020-1"
}
```


#### INFO: Missing Anti-clickjacking Header

- **CWE:** CWE-1021 (Unknown)
- **Tool:** browser-scanner

**Description:**
The response does not protect against 'ClickJacking' attacks. It should include either Content-Security-Policy with 'frame-ancestors' directive or X-Frame-Options.

**Evidence:**
```
{
  "detail": "N/A",
  "url": "https://claude5-f5d80.firebaseapp.com/?read=..%2F..%2F..%2Fetc%2Fpasswd",
  "type": "ZAP-10020-1"
}
```


#### INFO: Missing Anti-clickjacking Header

- **CWE:** CWE-1021 (Unknown)
- **Tool:** browser-scanner

**Description:**
The response does not protect against 'ClickJacking' attacks. It should include either Content-Security-Policy with 'frame-ancestors' directive or X-Frame-Options.

**Evidence:**
```
{
  "detail": "N/A",
  "url": "https://claude5-f5d80.firebaseapp.com/?read=..%5C..%5C..%5Cwindows%5Cwin.ini",
  "type": "ZAP-10020-1"
}
```


#### INFO: Missing Anti-clickjacking Header

- **CWE:** CWE-1021 (Unknown)
- **Tool:** browser-scanner

**Description:**
The response does not protect against 'ClickJacking' attacks. It should include either Content-Security-Policy with 'frame-ancestors' directive or X-Frame-Options.

**Evidence:**
```
{
  "detail": "N/A",
  "url": "https://claude5-f5d80.firebaseapp.com/?read=....%2F%2F....%2F%2F....%2F%2Fetc%2Fpasswd",
  "type": "ZAP-10020-1"
}
```


#### INFO: Missing Anti-clickjacking Header

- **CWE:** CWE-1021 (Unknown)
- **Tool:** browser-scanner

**Description:**
The response does not protect against 'ClickJacking' attacks. It should include either Content-Security-Policy with 'frame-ancestors' directive or X-Frame-Options.

**Evidence:**
```
{
  "detail": "N/A",
  "url": "https://claude5-f5d80.firebaseapp.com/?read=..%252f..%252f..%252fetc%2Fpasswd",
  "type": "ZAP-10020-1"
}
```


#### INFO: Missing Anti-clickjacking Header

- **CWE:** CWE-1021 (Unknown)
- **Tool:** browser-scanner

**Description:**
The response does not protect against 'ClickJacking' attacks. It should include either Content-Security-Policy with 'frame-ancestors' directive or X-Frame-Options.

**Evidence:**
```
{
  "detail": "N/A",
  "url": "https://claude5-f5d80.firebaseapp.com/images/",
  "type": "ZAP-10020-1"
}
```


#### INFO: Missing Anti-clickjacking Header

- **CWE:** CWE-1021 (Unknown)
- **Tool:** browser-scanner

**Description:**
The response does not protect against 'ClickJacking' attacks. It should include either Content-Security-Policy with 'frame-ancestors' directive or X-Frame-Options.

**Evidence:**
```
{
  "detail": "N/A",
  "url": "https://claude5-f5d80.firebaseapp.com/uploads/",
  "type": "ZAP-10020-1"
}
```


#### INFO: Missing Anti-clickjacking Header

- **CWE:** CWE-1021 (Unknown)
- **Tool:** browser-scanner

**Description:**
The response does not protect against 'ClickJacking' attacks. It should include either Content-Security-Policy with 'frame-ancestors' directive or X-Frame-Options.

**Evidence:**
```
{
  "detail": "N/A",
  "url": "https://claude5-f5d80.firebaseapp.com/files/",
  "type": "ZAP-10020-1"
}
```


#### INFO: Missing Anti-clickjacking Header

- **CWE:** CWE-1021 (Unknown)
- **Tool:** browser-scanner

**Description:**
The response does not protect against 'ClickJacking' attacks. It should include either Content-Security-Policy with 'frame-ancestors' directive or X-Frame-Options.

**Evidence:**
```
{
  "detail": "N/A",
  "url": "https://claude5-f5d80.firebaseapp.com/assets/",
  "type": "ZAP-10020-1"
}
```


#### INFO: Missing Anti-clickjacking Header

- **CWE:** CWE-1021 (Unknown)
- **Tool:** browser-scanner

**Description:**
The response does not protect against 'ClickJacking' attacks. It should include either Content-Security-Policy with 'frame-ancestors' directive or X-Frame-Options.

**Evidence:**
```
{
  "detail": "N/A",
  "url": "https://claude5-f5d80.firebaseapp.com/static/",
  "type": "ZAP-10020-1"
}
```


#### INFO: Missing Anti-clickjacking Header

- **CWE:** CWE-1021 (Unknown)
- **Tool:** browser-scanner

**Description:**
The response does not protect against 'ClickJacking' attacks. It should include either Content-Security-Policy with 'frame-ancestors' directive or X-Frame-Options.

**Evidence:**
```
{
  "detail": "N/A",
  "url": "https://claude5-f5d80.firebaseapp.com/media/",
  "type": "ZAP-10020-1"
}
```


#### INFO: Missing Anti-clickjacking Header

- **CWE:** CWE-1021 (Unknown)
- **Tool:** browser-scanner

**Description:**
The response does not protect against 'ClickJacking' attacks. It should include either Content-Security-Policy with 'frame-ancestors' directive or X-Frame-Options.

**Evidence:**
```
{
  "detail": "N/A",
  "url": "https://claude5-f5d80.firebaseapp.com/backup/",
  "type": "ZAP-10020-1"
}
```


#### INFO: Missing Anti-clickjacking Header

- **CWE:** CWE-1021 (Unknown)
- **Tool:** browser-scanner

**Description:**
The response does not protect against 'ClickJacking' attacks. It should include either Content-Security-Policy with 'frame-ancestors' directive or X-Frame-Options.

**Evidence:**
```
{
  "detail": "N/A",
  "url": "https://claude5-f5d80.firebaseapp.com/logs/",
  "type": "ZAP-10020-1"
}
```


#### INFO: Missing Anti-clickjacking Header

- **CWE:** CWE-1021 (Unknown)
- **Tool:** browser-scanner

**Description:**
The response does not protect against 'ClickJacking' attacks. It should include either Content-Security-Policy with 'frame-ancestors' directive or X-Frame-Options.

**Evidence:**
```
{
  "detail": "N/A",
  "url": "https://claude5-f5d80.firebaseapp.com/tmp/",
  "type": "ZAP-10020-1"
}
```


#### INFO: Missing Anti-clickjacking Header

- **CWE:** CWE-1021 (Unknown)
- **Tool:** browser-scanner

**Description:**
The response does not protect against 'ClickJacking' attacks. It should include either Content-Security-Policy with 'frame-ancestors' directive or X-Frame-Options.

**Evidence:**
```
{
  "detail": "N/A",
  "url": "https://claude5-f5d80.firebaseapp.com/data/",
  "type": "ZAP-10020-1"
}
```


#### INFO: Missing Anti-clickjacking Header

- **CWE:** CWE-1021 (Unknown)
- **Tool:** browser-scanner

**Description:**
The response does not protect against 'ClickJacking' attacks. It should include either Content-Security-Policy with 'frame-ancestors' directive or X-Frame-Options.

**Evidence:**
```
{
  "detail": "N/A",
  "url": "https://claude5-f5d80.firebaseapp.com/admin",
  "type": "ZAP-10020-1"
}
```


#### INFO: Missing Anti-clickjacking Header

- **CWE:** CWE-1021 (Unknown)
- **Tool:** browser-scanner

**Description:**
The response does not protect against 'ClickJacking' attacks. It should include either Content-Security-Policy with 'frame-ancestors' directive or X-Frame-Options.

**Evidence:**
```
{
  "detail": "N/A",
  "url": "https://claude5-f5d80.firebaseapp.com/admin/",
  "type": "ZAP-10020-1"
}
```


#### INFO: Missing Anti-clickjacking Header

- **CWE:** CWE-1021 (Unknown)
- **Tool:** browser-scanner

**Description:**
The response does not protect against 'ClickJacking' attacks. It should include either Content-Security-Policy with 'frame-ancestors' directive or X-Frame-Options.

**Evidence:**
```
{
  "detail": "N/A",
  "url": "https://claude5-f5d80.firebaseapp.com/admin/dashboard",
  "type": "ZAP-10020-1"
}
```


#### INFO: Missing Anti-clickjacking Header

- **CWE:** CWE-1021 (Unknown)
- **Tool:** browser-scanner

**Description:**
The response does not protect against 'ClickJacking' attacks. It should include either Content-Security-Policy with 'frame-ancestors' directive or X-Frame-Options.

**Evidence:**
```
{
  "detail": "N/A",
  "url": "https://claude5-f5d80.firebaseapp.com/admin/users",
  "type": "ZAP-10020-1"
}
```


#### INFO: Missing Anti-clickjacking Header

- **CWE:** CWE-1021 (Unknown)
- **Tool:** browser-scanner

**Description:**
The response does not protect against 'ClickJacking' attacks. It should include either Content-Security-Policy with 'frame-ancestors' directive or X-Frame-Options.

**Evidence:**
```
{
  "detail": "N/A",
  "url": "https://claude5-f5d80.firebaseapp.com/admin/settings",
  "type": "ZAP-10020-1"
}
```


#### INFO: Missing Anti-clickjacking Header

- **CWE:** CWE-1021 (Unknown)
- **Tool:** browser-scanner

**Description:**
The response does not protect against 'ClickJacking' attacks. It should include either Content-Security-Policy with 'frame-ancestors' directive or X-Frame-Options.

**Evidence:**
```
{
  "detail": "N/A",
  "url": "https://claude5-f5d80.firebaseapp.com/administrator",
  "type": "ZAP-10020-1"
}
```


#### INFO: Missing Anti-clickjacking Header

- **CWE:** CWE-1021 (Unknown)
- **Tool:** browser-scanner

**Description:**
The response does not protect against 'ClickJacking' attacks. It should include either Content-Security-Policy with 'frame-ancestors' directive or X-Frame-Options.

**Evidence:**
```
{
  "detail": "N/A",
  "url": "https://claude5-f5d80.firebaseapp.com/manage",
  "type": "ZAP-10020-1"
}
```


#### INFO: Missing Anti-clickjacking Header

- **CWE:** CWE-1021 (Unknown)
- **Tool:** browser-scanner

**Description:**
The response does not protect against 'ClickJacking' attacks. It should include either Content-Security-Policy with 'frame-ancestors' directive or X-Frame-Options.

**Evidence:**
```
{
  "detail": "N/A",
  "url": "https://claude5-f5d80.firebaseapp.com/management",
  "type": "ZAP-10020-1"
}
```


#### INFO: Missing Anti-clickjacking Header

- **CWE:** CWE-1021 (Unknown)
- **Tool:** browser-scanner

**Description:**
The response does not protect against 'ClickJacking' attacks. It should include either Content-Security-Policy with 'frame-ancestors' directive or X-Frame-Options.

**Evidence:**
```
{
  "detail": "N/A",
  "url": "https://claude5-f5d80.firebaseapp.com/console",
  "type": "ZAP-10020-1"
}
```


#### INFO: Missing Anti-clickjacking Header

- **CWE:** CWE-1021 (Unknown)
- **Tool:** browser-scanner

**Description:**
The response does not protect against 'ClickJacking' attacks. It should include either Content-Security-Policy with 'frame-ancestors' directive or X-Frame-Options.

**Evidence:**
```
{
  "detail": "N/A",
  "url": "https://claude5-f5d80.firebaseapp.com/panel",
  "type": "ZAP-10020-1"
}
```


#### INFO: Missing Anti-clickjacking Header

- **CWE:** CWE-1021 (Unknown)
- **Tool:** browser-scanner

**Description:**
The response does not protect against 'ClickJacking' attacks. It should include either Content-Security-Policy with 'frame-ancestors' directive or X-Frame-Options.

**Evidence:**
```
{
  "detail": "N/A",
  "url": "https://claude5-f5d80.firebaseapp.com/backoffice",
  "type": "ZAP-10020-1"
}
```


#### INFO: Missing Anti-clickjacking Header

- **CWE:** CWE-1021 (Unknown)
- **Tool:** browser-scanner

**Description:**
The response does not protect against 'ClickJacking' attacks. It should include either Content-Security-Policy with 'frame-ancestors' directive or X-Frame-Options.

**Evidence:**
```
{
  "detail": "N/A",
  "url": "https://claude5-f5d80.firebaseapp.com/backend",
  "type": "ZAP-10020-1"
}
```


#### INFO: Missing Anti-clickjacking Header

- **CWE:** CWE-1021 (Unknown)
- **Tool:** browser-scanner

**Description:**
The response does not protect against 'ClickJacking' attacks. It should include either Content-Security-Policy with 'frame-ancestors' directive or X-Frame-Options.

**Evidence:**
```
{
  "detail": "N/A",
  "url": "https://claude5-f5d80.firebaseapp.com/dashboard/admin",
  "type": "ZAP-10020-1"
}
```


#### INFO: Missing Anti-clickjacking Header

- **CWE:** CWE-1021 (Unknown)
- **Tool:** browser-scanner

**Description:**
The response does not protect against 'ClickJacking' attacks. It should include either Content-Security-Policy with 'frame-ancestors' directive or X-Frame-Options.

**Evidence:**
```
{
  "detail": "N/A",
  "url": "https://claude5-f5d80.firebaseapp.com/api/admin",
  "type": "ZAP-10020-1"
}
```


#### INFO: Missing Anti-clickjacking Header

- **CWE:** CWE-1021 (Unknown)
- **Tool:** browser-scanner

**Description:**
The response does not protect against 'ClickJacking' attacks. It should include either Content-Security-Policy with 'frame-ancestors' directive or X-Frame-Options.

**Evidence:**
```
{
  "detail": "N/A",
  "url": "https://claude5-f5d80.firebaseapp.com/api/users",
  "type": "ZAP-10020-1"
}
```


#### INFO: Missing Anti-clickjacking Header

- **CWE:** CWE-1021 (Unknown)
- **Tool:** browser-scanner

**Description:**
The response does not protect against 'ClickJacking' attacks. It should include either Content-Security-Policy with 'frame-ancestors' directive or X-Frame-Options.

**Evidence:**
```
{
  "detail": "N/A",
  "url": "https://claude5-f5d80.firebaseapp.com/.git/config",
  "type": "ZAP-10020-1"
}
```


#### INFO: Missing Anti-clickjacking Header

- **CWE:** CWE-1021 (Unknown)
- **Tool:** browser-scanner

**Description:**
The response does not protect against 'ClickJacking' attacks. It should include either Content-Security-Policy with 'frame-ancestors' directive or X-Frame-Options.

**Evidence:**
```
{
  "detail": "N/A",
  "url": "https://claude5-f5d80.firebaseapp.com/.git/HEAD",
  "type": "ZAP-10020-1"
}
```


#### INFO: Missing Anti-clickjacking Header

- **CWE:** CWE-1021 (Unknown)
- **Tool:** browser-scanner

**Description:**
The response does not protect against 'ClickJacking' attacks. It should include either Content-Security-Policy with 'frame-ancestors' directive or X-Frame-Options.

**Evidence:**
```
{
  "detail": "N/A",
  "url": "https://claude5-f5d80.firebaseapp.com/.env",
  "type": "ZAP-10020-1"
}
```


#### INFO: Missing Anti-clickjacking Header

- **CWE:** CWE-1021 (Unknown)
- **Tool:** browser-scanner

**Description:**
The response does not protect against 'ClickJacking' attacks. It should include either Content-Security-Policy with 'frame-ancestors' directive or X-Frame-Options.

**Evidence:**
```
{
  "detail": "N/A",
  "url": "https://claude5-f5d80.firebaseapp.com/.env.local",
  "type": "ZAP-10020-1"
}
```


#### INFO: Missing Anti-clickjacking Header

- **CWE:** CWE-1021 (Unknown)
- **Tool:** browser-scanner

**Description:**
The response does not protect against 'ClickJacking' attacks. It should include either Content-Security-Policy with 'frame-ancestors' directive or X-Frame-Options.

**Evidence:**
```
{
  "detail": "N/A",
  "url": "https://claude5-f5d80.firebaseapp.com/.env.production",
  "type": "ZAP-10020-1"
}
```


#### INFO: Missing Anti-clickjacking Header

- **CWE:** CWE-1021 (Unknown)
- **Tool:** browser-scanner

**Description:**
The response does not protect against 'ClickJacking' attacks. It should include either Content-Security-Policy with 'frame-ancestors' directive or X-Frame-Options.

**Evidence:**
```
{
  "detail": "N/A",
  "url": "https://claude5-f5d80.firebaseapp.com/config.json",
  "type": "ZAP-10020-1"
}
```


#### INFO: Missing Anti-clickjacking Header

- **CWE:** CWE-1021 (Unknown)
- **Tool:** browser-scanner

**Description:**
The response does not protect against 'ClickJacking' attacks. It should include either Content-Security-Policy with 'frame-ancestors' directive or X-Frame-Options.

**Evidence:**
```
{
  "detail": "N/A",
  "url": "https://claude5-f5d80.firebaseapp.com/config.yaml",
  "type": "ZAP-10020-1"
}
```


#### INFO: Missing Anti-clickjacking Header

- **CWE:** CWE-1021 (Unknown)
- **Tool:** browser-scanner

**Description:**
The response does not protect against 'ClickJacking' attacks. It should include either Content-Security-Policy with 'frame-ancestors' directive or X-Frame-Options.

**Evidence:**
```
{
  "detail": "N/A",
  "url": "https://claude5-f5d80.firebaseapp.com/config.yml",
  "type": "ZAP-10020-1"
}
```


#### INFO: Missing Anti-clickjacking Header

- **CWE:** CWE-1021 (Unknown)
- **Tool:** browser-scanner

**Description:**
The response does not protect against 'ClickJacking' attacks. It should include either Content-Security-Policy with 'frame-ancestors' directive or X-Frame-Options.

**Evidence:**
```
{
  "detail": "N/A",
  "url": "https://claude5-f5d80.firebaseapp.com/firebase.json",
  "type": "ZAP-10020-1"
}
```


#### INFO: Missing Anti-clickjacking Header

- **CWE:** CWE-1021 (Unknown)
- **Tool:** browser-scanner

**Description:**
The response does not protect against 'ClickJacking' attacks. It should include either Content-Security-Policy with 'frame-ancestors' directive or X-Frame-Options.

**Evidence:**
```
{
  "detail": "N/A",
  "url": "https://claude5-f5d80.firebaseapp.com/package.json",
  "type": "ZAP-10020-1"
}
```


#### INFO: Missing Anti-clickjacking Header

- **CWE:** CWE-1021 (Unknown)
- **Tool:** browser-scanner

**Description:**
The response does not protect against 'ClickJacking' attacks. It should include either Content-Security-Policy with 'frame-ancestors' directive or X-Frame-Options.

**Evidence:**
```
{
  "detail": "N/A",
  "url": "https://claude5-f5d80.firebaseapp.com/package-lock.json",
  "type": "ZAP-10020-1"
}
```


#### INFO: Missing Anti-clickjacking Header

- **CWE:** CWE-1021 (Unknown)
- **Tool:** browser-scanner

**Description:**
The response does not protect against 'ClickJacking' attacks. It should include either Content-Security-Policy with 'frame-ancestors' directive or X-Frame-Options.

**Evidence:**
```
{
  "detail": "N/A",
  "url": "https://claude5-f5d80.firebaseapp.com/composer.json",
  "type": "ZAP-10020-1"
}
```


#### INFO: Missing Anti-clickjacking Header

- **CWE:** CWE-1021 (Unknown)
- **Tool:** browser-scanner

**Description:**
The response does not protect against 'ClickJacking' attacks. It should include either Content-Security-Policy with 'frame-ancestors' directive or X-Frame-Options.

**Evidence:**
```
{
  "detail": "N/A",
  "url": "https://claude5-f5d80.firebaseapp.com/composer.lock",
  "type": "ZAP-10020-1"
}
```


#### INFO: Missing Anti-clickjacking Header

- **CWE:** CWE-1021 (Unknown)
- **Tool:** browser-scanner

**Description:**
The response does not protect against 'ClickJacking' attacks. It should include either Content-Security-Policy with 'frame-ancestors' directive or X-Frame-Options.

**Evidence:**
```
{
  "detail": "N/A",
  "url": "https://claude5-f5d80.firebaseapp.com/webpack.config.js",
  "type": "ZAP-10020-1"
}
```


#### INFO: Missing Anti-clickjacking Header

- **CWE:** CWE-1021 (Unknown)
- **Tool:** browser-scanner

**Description:**
The response does not protect against 'ClickJacking' attacks. It should include either Content-Security-Policy with 'frame-ancestors' directive or X-Frame-Options.

**Evidence:**
```
{
  "detail": "N/A",
  "url": "https://claude5-f5d80.firebaseapp.com/tsconfig.json",
  "type": "ZAP-10020-1"
}
```


#### INFO: Missing Anti-clickjacking Header

- **CWE:** CWE-1021 (Unknown)
- **Tool:** browser-scanner

**Description:**
The response does not protect against 'ClickJacking' attacks. It should include either Content-Security-Policy with 'frame-ancestors' directive or X-Frame-Options.

**Evidence:**
```
{
  "detail": "N/A",
  "url": "https://claude5-f5d80.firebaseapp.com/.htaccess",
  "type": "ZAP-10020-1"
}
```


#### INFO: Missing Anti-clickjacking Header

- **CWE:** CWE-1021 (Unknown)
- **Tool:** browser-scanner

**Description:**
The response does not protect against 'ClickJacking' attacks. It should include either Content-Security-Policy with 'frame-ancestors' directive or X-Frame-Options.

**Evidence:**
```
{
  "detail": "N/A",
  "url": "https://claude5-f5d80.firebaseapp.com/.htpasswd",
  "type": "ZAP-10020-1"
}
```


#### INFO: Missing Anti-clickjacking Header

- **CWE:** CWE-1021 (Unknown)
- **Tool:** browser-scanner

**Description:**
The response does not protect against 'ClickJacking' attacks. It should include either Content-Security-Policy with 'frame-ancestors' directive or X-Frame-Options.

**Evidence:**
```
{
  "detail": "N/A",
  "url": "https://claude5-f5d80.firebaseapp.com/robots.txt",
  "type": "ZAP-10020-1"
}
```


#### INFO: Missing Anti-clickjacking Header

- **CWE:** CWE-1021 (Unknown)
- **Tool:** browser-scanner

**Description:**
The response does not protect against 'ClickJacking' attacks. It should include either Content-Security-Policy with 'frame-ancestors' directive or X-Frame-Options.

**Evidence:**
```
{
  "detail": "N/A",
  "url": "https://claude5-f5d80.firebaseapp.com/sitemap.xml",
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
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js\"></script>",
  "url": "https://claude5-f5d80.firebaseapp.com/",
  "type": "ZAP-10109"
}
```


#### INFO: Modern Web Application

- **CWE:** CWE--1 (Unknown)
- **Tool:** browser-scanner

**Description:**
The application appears to be a modern web application. If you need to explore it automatically then the Ajax Spider may well be more effective than the standard one.

**Evidence:**
```
{
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js\"></script>",
  "url": "https://claude5-f5d80.firebaseapp.com/home",
  "type": "ZAP-10109"
}
```


#### INFO: Modern Web Application

- **CWE:** CWE--1 (Unknown)
- **Tool:** browser-scanner

**Description:**
The application appears to be a modern web application. If you need to explore it automatically then the Ajax Spider may well be more effective than the standard one.

**Evidence:**
```
{
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js\"></script>",
  "url": "https://claude5-f5d80.firebaseapp.com/profile",
  "type": "ZAP-10109"
}
```


#### INFO: Modern Web Application

- **CWE:** CWE--1 (Unknown)
- **Tool:** browser-scanner

**Description:**
The application appears to be a modern web application. If you need to explore it automatically then the Ajax Spider may well be more effective than the standard one.

**Evidence:**
```
{
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js\"></script>",
  "url": "https://claude5-f5d80.firebaseapp.com/settings",
  "type": "ZAP-10109"
}
```


#### INFO: Modern Web Application

- **CWE:** CWE--1 (Unknown)
- **Tool:** browser-scanner

**Description:**
The application appears to be a modern web application. If you need to explore it automatically then the Ajax Spider may well be more effective than the standard one.

**Evidence:**
```
{
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js\"></script>",
  "url": "https://claude5-f5d80.firebaseapp.com/posts",
  "type": "ZAP-10109"
}
```


#### INFO: Modern Web Application

- **CWE:** CWE--1 (Unknown)
- **Tool:** browser-scanner

**Description:**
The application appears to be a modern web application. If you need to explore it automatically then the Ajax Spider may well be more effective than the standard one.

**Evidence:**
```
{
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js\"></script>",
  "url": "https://claude5-f5d80.firebaseapp.com/messages",
  "type": "ZAP-10109"
}
```


#### INFO: Modern Web Application

- **CWE:** CWE--1 (Unknown)
- **Tool:** browser-scanner

**Description:**
The application appears to be a modern web application. If you need to explore it automatically then the Ajax Spider may well be more effective than the standard one.

**Evidence:**
```
{
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js\"></script>",
  "url": "https://claude5-f5d80.firebaseapp.com/feed",
  "type": "ZAP-10109"
}
```


#### INFO: Modern Web Application

- **CWE:** CWE--1 (Unknown)
- **Tool:** browser-scanner

**Description:**
The application appears to be a modern web application. If you need to explore it automatically then the Ajax Spider may well be more effective than the standard one.

**Evidence:**
```
{
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js\"></script>",
  "url": "https://claude5-f5d80.firebaseapp.com/__nonexistent__1765840839599_772536e9d6a31",
  "type": "ZAP-10109"
}
```


#### INFO: Modern Web Application

- **CWE:** CWE--1 (Unknown)
- **Tool:** browser-scanner

**Description:**
The application appears to be a modern web application. If you need to explore it automatically then the Ajax Spider may well be more effective than the standard one.

**Evidence:**
```
{
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js\"></script>",
  "url": "https://claude5-f5d80.firebaseapp.com/?file=..%2F..%2F..%2Fetc%2Fpasswd",
  "type": "ZAP-10109"
}
```


#### INFO: Modern Web Application

- **CWE:** CWE--1 (Unknown)
- **Tool:** browser-scanner

**Description:**
The application appears to be a modern web application. If you need to explore it automatically then the Ajax Spider may well be more effective than the standard one.

**Evidence:**
```
{
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js\"></script>",
  "url": "https://claude5-f5d80.firebaseapp.com/?file=..%5C..%5C..%5Cwindows%5Cwin.ini",
  "type": "ZAP-10109"
}
```


#### INFO: Modern Web Application

- **CWE:** CWE--1 (Unknown)
- **Tool:** browser-scanner

**Description:**
The application appears to be a modern web application. If you need to explore it automatically then the Ajax Spider may well be more effective than the standard one.

**Evidence:**
```
{
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js\"></script>",
  "url": "https://claude5-f5d80.firebaseapp.com/?file=....%2F%2F....%2F%2F....%2F%2Fetc%2Fpasswd",
  "type": "ZAP-10109"
}
```


#### INFO: Modern Web Application

- **CWE:** CWE--1 (Unknown)
- **Tool:** browser-scanner

**Description:**
The application appears to be a modern web application. If you need to explore it automatically then the Ajax Spider may well be more effective than the standard one.

**Evidence:**
```
{
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js\"></script>",
  "url": "https://claude5-f5d80.firebaseapp.com/?file=..%252f..%252f..%252fetc%2Fpasswd",
  "type": "ZAP-10109"
}
```


#### INFO: Modern Web Application

- **CWE:** CWE--1 (Unknown)
- **Tool:** browser-scanner

**Description:**
The application appears to be a modern web application. If you need to explore it automatically then the Ajax Spider may well be more effective than the standard one.

**Evidence:**
```
{
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js\"></script>",
  "url": "https://claude5-f5d80.firebaseapp.com/?path=..%2F..%2F..%2Fetc%2Fpasswd",
  "type": "ZAP-10109"
}
```


#### INFO: Modern Web Application

- **CWE:** CWE--1 (Unknown)
- **Tool:** browser-scanner

**Description:**
The application appears to be a modern web application. If you need to explore it automatically then the Ajax Spider may well be more effective than the standard one.

**Evidence:**
```
{
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js\"></script>",
  "url": "https://claude5-f5d80.firebaseapp.com/?path=..%5C..%5C..%5Cwindows%5Cwin.ini",
  "type": "ZAP-10109"
}
```


#### INFO: Modern Web Application

- **CWE:** CWE--1 (Unknown)
- **Tool:** browser-scanner

**Description:**
The application appears to be a modern web application. If you need to explore it automatically then the Ajax Spider may well be more effective than the standard one.

**Evidence:**
```
{
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js\"></script>",
  "url": "https://claude5-f5d80.firebaseapp.com/?path=....%2F%2F....%2F%2F....%2F%2Fetc%2Fpasswd",
  "type": "ZAP-10109"
}
```


#### INFO: Modern Web Application

- **CWE:** CWE--1 (Unknown)
- **Tool:** browser-scanner

**Description:**
The application appears to be a modern web application. If you need to explore it automatically then the Ajax Spider may well be more effective than the standard one.

**Evidence:**
```
{
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js\"></script>",
  "url": "https://claude5-f5d80.firebaseapp.com/?path=..%252f..%252f..%252fetc%2Fpasswd",
  "type": "ZAP-10109"
}
```


#### INFO: Modern Web Application

- **CWE:** CWE--1 (Unknown)
- **Tool:** browser-scanner

**Description:**
The application appears to be a modern web application. If you need to explore it automatically then the Ajax Spider may well be more effective than the standard one.

**Evidence:**
```
{
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js\"></script>",
  "url": "https://claude5-f5d80.firebaseapp.com/?filepath=..%2F..%2F..%2Fetc%2Fpasswd",
  "type": "ZAP-10109"
}
```


#### INFO: Modern Web Application

- **CWE:** CWE--1 (Unknown)
- **Tool:** browser-scanner

**Description:**
The application appears to be a modern web application. If you need to explore it automatically then the Ajax Spider may well be more effective than the standard one.

**Evidence:**
```
{
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js\"></script>",
  "url": "https://claude5-f5d80.firebaseapp.com/?filepath=..%5C..%5C..%5Cwindows%5Cwin.ini",
  "type": "ZAP-10109"
}
```


#### INFO: Modern Web Application

- **CWE:** CWE--1 (Unknown)
- **Tool:** browser-scanner

**Description:**
The application appears to be a modern web application. If you need to explore it automatically then the Ajax Spider may well be more effective than the standard one.

**Evidence:**
```
{
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js\"></script>",
  "url": "https://claude5-f5d80.firebaseapp.com/?filepath=....%2F%2F....%2F%2F....%2F%2Fetc%2Fpasswd",
  "type": "ZAP-10109"
}
```


#### INFO: Modern Web Application

- **CWE:** CWE--1 (Unknown)
- **Tool:** browser-scanner

**Description:**
The application appears to be a modern web application. If you need to explore it automatically then the Ajax Spider may well be more effective than the standard one.

**Evidence:**
```
{
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js\"></script>",
  "url": "https://claude5-f5d80.firebaseapp.com/?filepath=..%252f..%252f..%252fetc%2Fpasswd",
  "type": "ZAP-10109"
}
```


#### INFO: Modern Web Application

- **CWE:** CWE--1 (Unknown)
- **Tool:** browser-scanner

**Description:**
The application appears to be a modern web application. If you need to explore it automatically then the Ajax Spider may well be more effective than the standard one.

**Evidence:**
```
{
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js\"></script>",
  "url": "https://claude5-f5d80.firebaseapp.com/?document=..%2F..%2F..%2Fetc%2Fpasswd",
  "type": "ZAP-10109"
}
```


#### INFO: Modern Web Application

- **CWE:** CWE--1 (Unknown)
- **Tool:** browser-scanner

**Description:**
The application appears to be a modern web application. If you need to explore it automatically then the Ajax Spider may well be more effective than the standard one.

**Evidence:**
```
{
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js\"></script>",
  "url": "https://claude5-f5d80.firebaseapp.com/?document=..%5C..%5C..%5Cwindows%5Cwin.ini",
  "type": "ZAP-10109"
}
```


#### INFO: Modern Web Application

- **CWE:** CWE--1 (Unknown)
- **Tool:** browser-scanner

**Description:**
The application appears to be a modern web application. If you need to explore it automatically then the Ajax Spider may well be more effective than the standard one.

**Evidence:**
```
{
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js\"></script>",
  "url": "https://claude5-f5d80.firebaseapp.com/?document=....%2F%2F....%2F%2F....%2F%2Fetc%2Fpasswd",
  "type": "ZAP-10109"
}
```


#### INFO: Modern Web Application

- **CWE:** CWE--1 (Unknown)
- **Tool:** browser-scanner

**Description:**
The application appears to be a modern web application. If you need to explore it automatically then the Ajax Spider may well be more effective than the standard one.

**Evidence:**
```
{
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js\"></script>",
  "url": "https://claude5-f5d80.firebaseapp.com/?document=..%252f..%252f..%252fetc%2Fpasswd",
  "type": "ZAP-10109"
}
```


#### INFO: Modern Web Application

- **CWE:** CWE--1 (Unknown)
- **Tool:** browser-scanner

**Description:**
The application appears to be a modern web application. If you need to explore it automatically then the Ajax Spider may well be more effective than the standard one.

**Evidence:**
```
{
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js\"></script>",
  "url": "https://claude5-f5d80.firebaseapp.com/?doc=..%2F..%2F..%2Fetc%2Fpasswd",
  "type": "ZAP-10109"
}
```


#### INFO: Modern Web Application

- **CWE:** CWE--1 (Unknown)
- **Tool:** browser-scanner

**Description:**
The application appears to be a modern web application. If you need to explore it automatically then the Ajax Spider may well be more effective than the standard one.

**Evidence:**
```
{
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js\"></script>",
  "url": "https://claude5-f5d80.firebaseapp.com/?doc=..%5C..%5C..%5Cwindows%5Cwin.ini",
  "type": "ZAP-10109"
}
```


#### INFO: Modern Web Application

- **CWE:** CWE--1 (Unknown)
- **Tool:** browser-scanner

**Description:**
The application appears to be a modern web application. If you need to explore it automatically then the Ajax Spider may well be more effective than the standard one.

**Evidence:**
```
{
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js\"></script>",
  "url": "https://claude5-f5d80.firebaseapp.com/?doc=....%2F%2F....%2F%2F....%2F%2Fetc%2Fpasswd",
  "type": "ZAP-10109"
}
```


#### INFO: Modern Web Application

- **CWE:** CWE--1 (Unknown)
- **Tool:** browser-scanner

**Description:**
The application appears to be a modern web application. If you need to explore it automatically then the Ajax Spider may well be more effective than the standard one.

**Evidence:**
```
{
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js\"></script>",
  "url": "https://claude5-f5d80.firebaseapp.com/?doc=..%252f..%252f..%252fetc%2Fpasswd",
  "type": "ZAP-10109"
}
```


#### INFO: Modern Web Application

- **CWE:** CWE--1 (Unknown)
- **Tool:** browser-scanner

**Description:**
The application appears to be a modern web application. If you need to explore it automatically then the Ajax Spider may well be more effective than the standard one.

**Evidence:**
```
{
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js\"></script>",
  "url": "https://claude5-f5d80.firebaseapp.com/?page=..%2F..%2F..%2Fetc%2Fpasswd",
  "type": "ZAP-10109"
}
```


#### INFO: Modern Web Application

- **CWE:** CWE--1 (Unknown)
- **Tool:** browser-scanner

**Description:**
The application appears to be a modern web application. If you need to explore it automatically then the Ajax Spider may well be more effective than the standard one.

**Evidence:**
```
{
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js\"></script>",
  "url": "https://claude5-f5d80.firebaseapp.com/?page=..%5C..%5C..%5Cwindows%5Cwin.ini",
  "type": "ZAP-10109"
}
```


#### INFO: Modern Web Application

- **CWE:** CWE--1 (Unknown)
- **Tool:** browser-scanner

**Description:**
The application appears to be a modern web application. If you need to explore it automatically then the Ajax Spider may well be more effective than the standard one.

**Evidence:**
```
{
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js\"></script>",
  "url": "https://claude5-f5d80.firebaseapp.com/?page=....%2F%2F....%2F%2F....%2F%2Fetc%2Fpasswd",
  "type": "ZAP-10109"
}
```


#### INFO: Modern Web Application

- **CWE:** CWE--1 (Unknown)
- **Tool:** browser-scanner

**Description:**
The application appears to be a modern web application. If you need to explore it automatically then the Ajax Spider may well be more effective than the standard one.

**Evidence:**
```
{
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js\"></script>",
  "url": "https://claude5-f5d80.firebaseapp.com/?page=..%252f..%252f..%252fetc%2Fpasswd",
  "type": "ZAP-10109"
}
```


#### INFO: Modern Web Application

- **CWE:** CWE--1 (Unknown)
- **Tool:** browser-scanner

**Description:**
The application appears to be a modern web application. If you need to explore it automatically then the Ajax Spider may well be more effective than the standard one.

**Evidence:**
```
{
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js\"></script>",
  "url": "https://claude5-f5d80.firebaseapp.com/?template=..%2F..%2F..%2Fetc%2Fpasswd",
  "type": "ZAP-10109"
}
```


#### INFO: Modern Web Application

- **CWE:** CWE--1 (Unknown)
- **Tool:** browser-scanner

**Description:**
The application appears to be a modern web application. If you need to explore it automatically then the Ajax Spider may well be more effective than the standard one.

**Evidence:**
```
{
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js\"></script>",
  "url": "https://claude5-f5d80.firebaseapp.com/?template=..%5C..%5C..%5Cwindows%5Cwin.ini",
  "type": "ZAP-10109"
}
```


#### INFO: Modern Web Application

- **CWE:** CWE--1 (Unknown)
- **Tool:** browser-scanner

**Description:**
The application appears to be a modern web application. If you need to explore it automatically then the Ajax Spider may well be more effective than the standard one.

**Evidence:**
```
{
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js\"></script>",
  "url": "https://claude5-f5d80.firebaseapp.com/?template=....%2F%2F....%2F%2F....%2F%2Fetc%2Fpasswd",
  "type": "ZAP-10109"
}
```


#### INFO: Modern Web Application

- **CWE:** CWE--1 (Unknown)
- **Tool:** browser-scanner

**Description:**
The application appears to be a modern web application. If you need to explore it automatically then the Ajax Spider may well be more effective than the standard one.

**Evidence:**
```
{
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js\"></script>",
  "url": "https://claude5-f5d80.firebaseapp.com/?template=..%252f..%252f..%252fetc%2Fpasswd",
  "type": "ZAP-10109"
}
```


#### INFO: Modern Web Application

- **CWE:** CWE--1 (Unknown)
- **Tool:** browser-scanner

**Description:**
The application appears to be a modern web application. If you need to explore it automatically then the Ajax Spider may well be more effective than the standard one.

**Evidence:**
```
{
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js\"></script>",
  "url": "https://claude5-f5d80.firebaseapp.com/?include=..%2F..%2F..%2Fetc%2Fpasswd",
  "type": "ZAP-10109"
}
```


#### INFO: Modern Web Application

- **CWE:** CWE--1 (Unknown)
- **Tool:** browser-scanner

**Description:**
The application appears to be a modern web application. If you need to explore it automatically then the Ajax Spider may well be more effective than the standard one.

**Evidence:**
```
{
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js\"></script>",
  "url": "https://claude5-f5d80.firebaseapp.com/?include=..%5C..%5C..%5Cwindows%5Cwin.ini",
  "type": "ZAP-10109"
}
```


#### INFO: Modern Web Application

- **CWE:** CWE--1 (Unknown)
- **Tool:** browser-scanner

**Description:**
The application appears to be a modern web application. If you need to explore it automatically then the Ajax Spider may well be more effective than the standard one.

**Evidence:**
```
{
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js\"></script>",
  "url": "https://claude5-f5d80.firebaseapp.com/?include=....%2F%2F....%2F%2F....%2F%2Fetc%2Fpasswd",
  "type": "ZAP-10109"
}
```


#### INFO: Modern Web Application

- **CWE:** CWE--1 (Unknown)
- **Tool:** browser-scanner

**Description:**
The application appears to be a modern web application. If you need to explore it automatically then the Ajax Spider may well be more effective than the standard one.

**Evidence:**
```
{
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js\"></script>",
  "url": "https://claude5-f5d80.firebaseapp.com/?include=..%252f..%252f..%252fetc%2Fpasswd",
  "type": "ZAP-10109"
}
```


#### INFO: Modern Web Application

- **CWE:** CWE--1 (Unknown)
- **Tool:** browser-scanner

**Description:**
The application appears to be a modern web application. If you need to explore it automatically then the Ajax Spider may well be more effective than the standard one.

**Evidence:**
```
{
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js\"></script>",
  "url": "https://claude5-f5d80.firebaseapp.com/?dir=..%2F..%2F..%2Fetc%2Fpasswd",
  "type": "ZAP-10109"
}
```


#### INFO: Modern Web Application

- **CWE:** CWE--1 (Unknown)
- **Tool:** browser-scanner

**Description:**
The application appears to be a modern web application. If you need to explore it automatically then the Ajax Spider may well be more effective than the standard one.

**Evidence:**
```
{
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js\"></script>",
  "url": "https://claude5-f5d80.firebaseapp.com/?dir=..%5C..%5C..%5Cwindows%5Cwin.ini",
  "type": "ZAP-10109"
}
```


#### INFO: Modern Web Application

- **CWE:** CWE--1 (Unknown)
- **Tool:** browser-scanner

**Description:**
The application appears to be a modern web application. If you need to explore it automatically then the Ajax Spider may well be more effective than the standard one.

**Evidence:**
```
{
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js\"></script>",
  "url": "https://claude5-f5d80.firebaseapp.com/?dir=....%2F%2F....%2F%2F....%2F%2Fetc%2Fpasswd",
  "type": "ZAP-10109"
}
```


#### INFO: Modern Web Application

- **CWE:** CWE--1 (Unknown)
- **Tool:** browser-scanner

**Description:**
The application appears to be a modern web application. If you need to explore it automatically then the Ajax Spider may well be more effective than the standard one.

**Evidence:**
```
{
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js\"></script>",
  "url": "https://claude5-f5d80.firebaseapp.com/?dir=..%252f..%252f..%252fetc%2Fpasswd",
  "type": "ZAP-10109"
}
```


#### INFO: Modern Web Application

- **CWE:** CWE--1 (Unknown)
- **Tool:** browser-scanner

**Description:**
The application appears to be a modern web application. If you need to explore it automatically then the Ajax Spider may well be more effective than the standard one.

**Evidence:**
```
{
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js\"></script>",
  "url": "https://claude5-f5d80.firebaseapp.com/?folder=..%2F..%2F..%2Fetc%2Fpasswd",
  "type": "ZAP-10109"
}
```


#### INFO: Modern Web Application

- **CWE:** CWE--1 (Unknown)
- **Tool:** browser-scanner

**Description:**
The application appears to be a modern web application. If you need to explore it automatically then the Ajax Spider may well be more effective than the standard one.

**Evidence:**
```
{
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js\"></script>",
  "url": "https://claude5-f5d80.firebaseapp.com/?folder=..%5C..%5C..%5Cwindows%5Cwin.ini",
  "type": "ZAP-10109"
}
```


#### INFO: Modern Web Application

- **CWE:** CWE--1 (Unknown)
- **Tool:** browser-scanner

**Description:**
The application appears to be a modern web application. If you need to explore it automatically then the Ajax Spider may well be more effective than the standard one.

**Evidence:**
```
{
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js\"></script>",
  "url": "https://claude5-f5d80.firebaseapp.com/?folder=....%2F%2F....%2F%2F....%2F%2Fetc%2Fpasswd",
  "type": "ZAP-10109"
}
```


#### INFO: Modern Web Application

- **CWE:** CWE--1 (Unknown)
- **Tool:** browser-scanner

**Description:**
The application appears to be a modern web application. If you need to explore it automatically then the Ajax Spider may well be more effective than the standard one.

**Evidence:**
```
{
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js\"></script>",
  "url": "https://claude5-f5d80.firebaseapp.com/?folder=..%252f..%252f..%252fetc%2Fpasswd",
  "type": "ZAP-10109"
}
```


#### INFO: Modern Web Application

- **CWE:** CWE--1 (Unknown)
- **Tool:** browser-scanner

**Description:**
The application appears to be a modern web application. If you need to explore it automatically then the Ajax Spider may well be more effective than the standard one.

**Evidence:**
```
{
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js\"></script>",
  "url": "https://claude5-f5d80.firebaseapp.com/?load=..%2F..%2F..%2Fetc%2Fpasswd",
  "type": "ZAP-10109"
}
```


#### INFO: Modern Web Application

- **CWE:** CWE--1 (Unknown)
- **Tool:** browser-scanner

**Description:**
The application appears to be a modern web application. If you need to explore it automatically then the Ajax Spider may well be more effective than the standard one.

**Evidence:**
```
{
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js\"></script>",
  "url": "https://claude5-f5d80.firebaseapp.com/?load=..%5C..%5C..%5Cwindows%5Cwin.ini",
  "type": "ZAP-10109"
}
```


#### INFO: Modern Web Application

- **CWE:** CWE--1 (Unknown)
- **Tool:** browser-scanner

**Description:**
The application appears to be a modern web application. If you need to explore it automatically then the Ajax Spider may well be more effective than the standard one.

**Evidence:**
```
{
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js\"></script>",
  "url": "https://claude5-f5d80.firebaseapp.com/?load=....%2F%2F....%2F%2F....%2F%2Fetc%2Fpasswd",
  "type": "ZAP-10109"
}
```


#### INFO: Modern Web Application

- **CWE:** CWE--1 (Unknown)
- **Tool:** browser-scanner

**Description:**
The application appears to be a modern web application. If you need to explore it automatically then the Ajax Spider may well be more effective than the standard one.

**Evidence:**
```
{
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js\"></script>",
  "url": "https://claude5-f5d80.firebaseapp.com/?load=..%252f..%252f..%252fetc%2Fpasswd",
  "type": "ZAP-10109"
}
```


#### INFO: Modern Web Application

- **CWE:** CWE--1 (Unknown)
- **Tool:** browser-scanner

**Description:**
The application appears to be a modern web application. If you need to explore it automatically then the Ajax Spider may well be more effective than the standard one.

**Evidence:**
```
{
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js\"></script>",
  "url": "https://claude5-f5d80.firebaseapp.com/?read=..%2F..%2F..%2Fetc%2Fpasswd",
  "type": "ZAP-10109"
}
```


#### INFO: Modern Web Application

- **CWE:** CWE--1 (Unknown)
- **Tool:** browser-scanner

**Description:**
The application appears to be a modern web application. If you need to explore it automatically then the Ajax Spider may well be more effective than the standard one.

**Evidence:**
```
{
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js\"></script>",
  "url": "https://claude5-f5d80.firebaseapp.com/?read=..%5C..%5C..%5Cwindows%5Cwin.ini",
  "type": "ZAP-10109"
}
```


#### INFO: Modern Web Application

- **CWE:** CWE--1 (Unknown)
- **Tool:** browser-scanner

**Description:**
The application appears to be a modern web application. If you need to explore it automatically then the Ajax Spider may well be more effective than the standard one.

**Evidence:**
```
{
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js\"></script>",
  "url": "https://claude5-f5d80.firebaseapp.com/?read=....%2F%2F....%2F%2F....%2F%2Fetc%2Fpasswd",
  "type": "ZAP-10109"
}
```


#### INFO: Modern Web Application

- **CWE:** CWE--1 (Unknown)
- **Tool:** browser-scanner

**Description:**
The application appears to be a modern web application. If you need to explore it automatically then the Ajax Spider may well be more effective than the standard one.

**Evidence:**
```
{
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js\"></script>",
  "url": "https://claude5-f5d80.firebaseapp.com/?read=..%252f..%252f..%252fetc%2Fpasswd",
  "type": "ZAP-10109"
}
```


#### INFO: Modern Web Application

- **CWE:** CWE--1 (Unknown)
- **Tool:** browser-scanner

**Description:**
The application appears to be a modern web application. If you need to explore it automatically then the Ajax Spider may well be more effective than the standard one.

**Evidence:**
```
{
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js\"></script>",
  "url": "https://claude5-f5d80.firebaseapp.com/images/",
  "type": "ZAP-10109"
}
```


#### INFO: Modern Web Application

- **CWE:** CWE--1 (Unknown)
- **Tool:** browser-scanner

**Description:**
The application appears to be a modern web application. If you need to explore it automatically then the Ajax Spider may well be more effective than the standard one.

**Evidence:**
```
{
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js\"></script>",
  "url": "https://claude5-f5d80.firebaseapp.com/uploads/",
  "type": "ZAP-10109"
}
```


#### INFO: Modern Web Application

- **CWE:** CWE--1 (Unknown)
- **Tool:** browser-scanner

**Description:**
The application appears to be a modern web application. If you need to explore it automatically then the Ajax Spider may well be more effective than the standard one.

**Evidence:**
```
{
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js\"></script>",
  "url": "https://claude5-f5d80.firebaseapp.com/files/",
  "type": "ZAP-10109"
}
```


#### INFO: Modern Web Application

- **CWE:** CWE--1 (Unknown)
- **Tool:** browser-scanner

**Description:**
The application appears to be a modern web application. If you need to explore it automatically then the Ajax Spider may well be more effective than the standard one.

**Evidence:**
```
{
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js\"></script>",
  "url": "https://claude5-f5d80.firebaseapp.com/assets/",
  "type": "ZAP-10109"
}
```


#### INFO: Modern Web Application

- **CWE:** CWE--1 (Unknown)
- **Tool:** browser-scanner

**Description:**
The application appears to be a modern web application. If you need to explore it automatically then the Ajax Spider may well be more effective than the standard one.

**Evidence:**
```
{
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js\"></script>",
  "url": "https://claude5-f5d80.firebaseapp.com/static/",
  "type": "ZAP-10109"
}
```


#### INFO: Modern Web Application

- **CWE:** CWE--1 (Unknown)
- **Tool:** browser-scanner

**Description:**
The application appears to be a modern web application. If you need to explore it automatically then the Ajax Spider may well be more effective than the standard one.

**Evidence:**
```
{
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js\"></script>",
  "url": "https://claude5-f5d80.firebaseapp.com/media/",
  "type": "ZAP-10109"
}
```


#### INFO: Modern Web Application

- **CWE:** CWE--1 (Unknown)
- **Tool:** browser-scanner

**Description:**
The application appears to be a modern web application. If you need to explore it automatically then the Ajax Spider may well be more effective than the standard one.

**Evidence:**
```
{
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js\"></script>",
  "url": "https://claude5-f5d80.firebaseapp.com/backup/",
  "type": "ZAP-10109"
}
```


#### INFO: Modern Web Application

- **CWE:** CWE--1 (Unknown)
- **Tool:** browser-scanner

**Description:**
The application appears to be a modern web application. If you need to explore it automatically then the Ajax Spider may well be more effective than the standard one.

**Evidence:**
```
{
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js\"></script>",
  "url": "https://claude5-f5d80.firebaseapp.com/logs/",
  "type": "ZAP-10109"
}
```


#### INFO: Modern Web Application

- **CWE:** CWE--1 (Unknown)
- **Tool:** browser-scanner

**Description:**
The application appears to be a modern web application. If you need to explore it automatically then the Ajax Spider may well be more effective than the standard one.

**Evidence:**
```
{
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js\"></script>",
  "url": "https://claude5-f5d80.firebaseapp.com/tmp/",
  "type": "ZAP-10109"
}
```


#### INFO: Modern Web Application

- **CWE:** CWE--1 (Unknown)
- **Tool:** browser-scanner

**Description:**
The application appears to be a modern web application. If you need to explore it automatically then the Ajax Spider may well be more effective than the standard one.

**Evidence:**
```
{
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js\"></script>",
  "url": "https://claude5-f5d80.firebaseapp.com/data/",
  "type": "ZAP-10109"
}
```


#### INFO: Modern Web Application

- **CWE:** CWE--1 (Unknown)
- **Tool:** browser-scanner

**Description:**
The application appears to be a modern web application. If you need to explore it automatically then the Ajax Spider may well be more effective than the standard one.

**Evidence:**
```
{
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js\"></script>",
  "url": "https://claude5-f5d80.firebaseapp.com/admin",
  "type": "ZAP-10109"
}
```


#### INFO: Modern Web Application

- **CWE:** CWE--1 (Unknown)
- **Tool:** browser-scanner

**Description:**
The application appears to be a modern web application. If you need to explore it automatically then the Ajax Spider may well be more effective than the standard one.

**Evidence:**
```
{
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js\"></script>",
  "url": "https://claude5-f5d80.firebaseapp.com/admin/",
  "type": "ZAP-10109"
}
```


#### INFO: Modern Web Application

- **CWE:** CWE--1 (Unknown)
- **Tool:** browser-scanner

**Description:**
The application appears to be a modern web application. If you need to explore it automatically then the Ajax Spider may well be more effective than the standard one.

**Evidence:**
```
{
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js\"></script>",
  "url": "https://claude5-f5d80.firebaseapp.com/admin/dashboard",
  "type": "ZAP-10109"
}
```


#### INFO: Modern Web Application

- **CWE:** CWE--1 (Unknown)
- **Tool:** browser-scanner

**Description:**
The application appears to be a modern web application. If you need to explore it automatically then the Ajax Spider may well be more effective than the standard one.

**Evidence:**
```
{
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js\"></script>",
  "url": "https://claude5-f5d80.firebaseapp.com/admin/users",
  "type": "ZAP-10109"
}
```


#### INFO: Modern Web Application

- **CWE:** CWE--1 (Unknown)
- **Tool:** browser-scanner

**Description:**
The application appears to be a modern web application. If you need to explore it automatically then the Ajax Spider may well be more effective than the standard one.

**Evidence:**
```
{
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js\"></script>",
  "url": "https://claude5-f5d80.firebaseapp.com/admin/settings",
  "type": "ZAP-10109"
}
```


#### INFO: Modern Web Application

- **CWE:** CWE--1 (Unknown)
- **Tool:** browser-scanner

**Description:**
The application appears to be a modern web application. If you need to explore it automatically then the Ajax Spider may well be more effective than the standard one.

**Evidence:**
```
{
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js\"></script>",
  "url": "https://claude5-f5d80.firebaseapp.com/administrator",
  "type": "ZAP-10109"
}
```


#### INFO: Modern Web Application

- **CWE:** CWE--1 (Unknown)
- **Tool:** browser-scanner

**Description:**
The application appears to be a modern web application. If you need to explore it automatically then the Ajax Spider may well be more effective than the standard one.

**Evidence:**
```
{
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js\"></script>",
  "url": "https://claude5-f5d80.firebaseapp.com/manage",
  "type": "ZAP-10109"
}
```


#### INFO: Modern Web Application

- **CWE:** CWE--1 (Unknown)
- **Tool:** browser-scanner

**Description:**
The application appears to be a modern web application. If you need to explore it automatically then the Ajax Spider may well be more effective than the standard one.

**Evidence:**
```
{
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js\"></script>",
  "url": "https://claude5-f5d80.firebaseapp.com/management",
  "type": "ZAP-10109"
}
```


#### INFO: Modern Web Application

- **CWE:** CWE--1 (Unknown)
- **Tool:** browser-scanner

**Description:**
The application appears to be a modern web application. If you need to explore it automatically then the Ajax Spider may well be more effective than the standard one.

**Evidence:**
```
{
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js\"></script>",
  "url": "https://claude5-f5d80.firebaseapp.com/console",
  "type": "ZAP-10109"
}
```


#### INFO: Modern Web Application

- **CWE:** CWE--1 (Unknown)
- **Tool:** browser-scanner

**Description:**
The application appears to be a modern web application. If you need to explore it automatically then the Ajax Spider may well be more effective than the standard one.

**Evidence:**
```
{
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js\"></script>",
  "url": "https://claude5-f5d80.firebaseapp.com/panel",
  "type": "ZAP-10109"
}
```


#### INFO: Modern Web Application

- **CWE:** CWE--1 (Unknown)
- **Tool:** browser-scanner

**Description:**
The application appears to be a modern web application. If you need to explore it automatically then the Ajax Spider may well be more effective than the standard one.

**Evidence:**
```
{
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js\"></script>",
  "url": "https://claude5-f5d80.firebaseapp.com/backoffice",
  "type": "ZAP-10109"
}
```


#### INFO: Modern Web Application

- **CWE:** CWE--1 (Unknown)
- **Tool:** browser-scanner

**Description:**
The application appears to be a modern web application. If you need to explore it automatically then the Ajax Spider may well be more effective than the standard one.

**Evidence:**
```
{
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js\"></script>",
  "url": "https://claude5-f5d80.firebaseapp.com/backend",
  "type": "ZAP-10109"
}
```


#### INFO: Modern Web Application

- **CWE:** CWE--1 (Unknown)
- **Tool:** browser-scanner

**Description:**
The application appears to be a modern web application. If you need to explore it automatically then the Ajax Spider may well be more effective than the standard one.

**Evidence:**
```
{
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js\"></script>",
  "url": "https://claude5-f5d80.firebaseapp.com/dashboard/admin",
  "type": "ZAP-10109"
}
```


#### INFO: Modern Web Application

- **CWE:** CWE--1 (Unknown)
- **Tool:** browser-scanner

**Description:**
The application appears to be a modern web application. If you need to explore it automatically then the Ajax Spider may well be more effective than the standard one.

**Evidence:**
```
{
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js\"></script>",
  "url": "https://claude5-f5d80.firebaseapp.com/api/admin",
  "type": "ZAP-10109"
}
```


#### INFO: Modern Web Application

- **CWE:** CWE--1 (Unknown)
- **Tool:** browser-scanner

**Description:**
The application appears to be a modern web application. If you need to explore it automatically then the Ajax Spider may well be more effective than the standard one.

**Evidence:**
```
{
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js\"></script>",
  "url": "https://claude5-f5d80.firebaseapp.com/api/users",
  "type": "ZAP-10109"
}
```


#### INFO: Modern Web Application

- **CWE:** CWE--1 (Unknown)
- **Tool:** browser-scanner

**Description:**
The application appears to be a modern web application. If you need to explore it automatically then the Ajax Spider may well be more effective than the standard one.

**Evidence:**
```
{
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js\"></script>",
  "url": "https://claude5-f5d80.firebaseapp.com/.git/config",
  "type": "ZAP-10109"
}
```


#### INFO: Modern Web Application

- **CWE:** CWE--1 (Unknown)
- **Tool:** browser-scanner

**Description:**
The application appears to be a modern web application. If you need to explore it automatically then the Ajax Spider may well be more effective than the standard one.

**Evidence:**
```
{
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js\"></script>",
  "url": "https://claude5-f5d80.firebaseapp.com/.git/HEAD",
  "type": "ZAP-10109"
}
```


#### INFO: Modern Web Application

- **CWE:** CWE--1 (Unknown)
- **Tool:** browser-scanner

**Description:**
The application appears to be a modern web application. If you need to explore it automatically then the Ajax Spider may well be more effective than the standard one.

**Evidence:**
```
{
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js\"></script>",
  "url": "https://claude5-f5d80.firebaseapp.com/.env",
  "type": "ZAP-10109"
}
```


#### INFO: Modern Web Application

- **CWE:** CWE--1 (Unknown)
- **Tool:** browser-scanner

**Description:**
The application appears to be a modern web application. If you need to explore it automatically then the Ajax Spider may well be more effective than the standard one.

**Evidence:**
```
{
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js\"></script>",
  "url": "https://claude5-f5d80.firebaseapp.com/.env.local",
  "type": "ZAP-10109"
}
```


#### INFO: Modern Web Application

- **CWE:** CWE--1 (Unknown)
- **Tool:** browser-scanner

**Description:**
The application appears to be a modern web application. If you need to explore it automatically then the Ajax Spider may well be more effective than the standard one.

**Evidence:**
```
{
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js\"></script>",
  "url": "https://claude5-f5d80.firebaseapp.com/.env.production",
  "type": "ZAP-10109"
}
```


#### INFO: Modern Web Application

- **CWE:** CWE--1 (Unknown)
- **Tool:** browser-scanner

**Description:**
The application appears to be a modern web application. If you need to explore it automatically then the Ajax Spider may well be more effective than the standard one.

**Evidence:**
```
{
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js\"></script>",
  "url": "https://claude5-f5d80.firebaseapp.com/config.json",
  "type": "ZAP-10109"
}
```


#### INFO: Modern Web Application

- **CWE:** CWE--1 (Unknown)
- **Tool:** browser-scanner

**Description:**
The application appears to be a modern web application. If you need to explore it automatically then the Ajax Spider may well be more effective than the standard one.

**Evidence:**
```
{
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js\"></script>",
  "url": "https://claude5-f5d80.firebaseapp.com/config.yaml",
  "type": "ZAP-10109"
}
```


#### INFO: Modern Web Application

- **CWE:** CWE--1 (Unknown)
- **Tool:** browser-scanner

**Description:**
The application appears to be a modern web application. If you need to explore it automatically then the Ajax Spider may well be more effective than the standard one.

**Evidence:**
```
{
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js\"></script>",
  "url": "https://claude5-f5d80.firebaseapp.com/config.yml",
  "type": "ZAP-10109"
}
```


#### INFO: Modern Web Application

- **CWE:** CWE--1 (Unknown)
- **Tool:** browser-scanner

**Description:**
The application appears to be a modern web application. If you need to explore it automatically then the Ajax Spider may well be more effective than the standard one.

**Evidence:**
```
{
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js\"></script>",
  "url": "https://claude5-f5d80.firebaseapp.com/firebase.json",
  "type": "ZAP-10109"
}
```


#### INFO: Modern Web Application

- **CWE:** CWE--1 (Unknown)
- **Tool:** browser-scanner

**Description:**
The application appears to be a modern web application. If you need to explore it automatically then the Ajax Spider may well be more effective than the standard one.

**Evidence:**
```
{
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js\"></script>",
  "url": "https://claude5-f5d80.firebaseapp.com/package.json",
  "type": "ZAP-10109"
}
```


#### INFO: Modern Web Application

- **CWE:** CWE--1 (Unknown)
- **Tool:** browser-scanner

**Description:**
The application appears to be a modern web application. If you need to explore it automatically then the Ajax Spider may well be more effective than the standard one.

**Evidence:**
```
{
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js\"></script>",
  "url": "https://claude5-f5d80.firebaseapp.com/package-lock.json",
  "type": "ZAP-10109"
}
```


#### INFO: Modern Web Application

- **CWE:** CWE--1 (Unknown)
- **Tool:** browser-scanner

**Description:**
The application appears to be a modern web application. If you need to explore it automatically then the Ajax Spider may well be more effective than the standard one.

**Evidence:**
```
{
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js\"></script>",
  "url": "https://claude5-f5d80.firebaseapp.com/composer.json",
  "type": "ZAP-10109"
}
```


#### INFO: Modern Web Application

- **CWE:** CWE--1 (Unknown)
- **Tool:** browser-scanner

**Description:**
The application appears to be a modern web application. If you need to explore it automatically then the Ajax Spider may well be more effective than the standard one.

**Evidence:**
```
{
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js\"></script>",
  "url": "https://claude5-f5d80.firebaseapp.com/composer.lock",
  "type": "ZAP-10109"
}
```


#### INFO: Modern Web Application

- **CWE:** CWE--1 (Unknown)
- **Tool:** browser-scanner

**Description:**
The application appears to be a modern web application. If you need to explore it automatically then the Ajax Spider may well be more effective than the standard one.

**Evidence:**
```
{
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js\"></script>",
  "url": "https://claude5-f5d80.firebaseapp.com/webpack.config.js",
  "type": "ZAP-10109"
}
```


#### INFO: Modern Web Application

- **CWE:** CWE--1 (Unknown)
- **Tool:** browser-scanner

**Description:**
The application appears to be a modern web application. If you need to explore it automatically then the Ajax Spider may well be more effective than the standard one.

**Evidence:**
```
{
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js\"></script>",
  "url": "https://claude5-f5d80.firebaseapp.com/tsconfig.json",
  "type": "ZAP-10109"
}
```


#### INFO: Modern Web Application

- **CWE:** CWE--1 (Unknown)
- **Tool:** browser-scanner

**Description:**
The application appears to be a modern web application. If you need to explore it automatically then the Ajax Spider may well be more effective than the standard one.

**Evidence:**
```
{
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js\"></script>",
  "url": "https://claude5-f5d80.firebaseapp.com/.htaccess",
  "type": "ZAP-10109"
}
```


#### INFO: Modern Web Application

- **CWE:** CWE--1 (Unknown)
- **Tool:** browser-scanner

**Description:**
The application appears to be a modern web application. If you need to explore it automatically then the Ajax Spider may well be more effective than the standard one.

**Evidence:**
```
{
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js\"></script>",
  "url": "https://claude5-f5d80.firebaseapp.com/.htpasswd",
  "type": "ZAP-10109"
}
```


#### INFO: Modern Web Application

- **CWE:** CWE--1 (Unknown)
- **Tool:** browser-scanner

**Description:**
The application appears to be a modern web application. If you need to explore it automatically then the Ajax Spider may well be more effective than the standard one.

**Evidence:**
```
{
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js\"></script>",
  "url": "https://claude5-f5d80.firebaseapp.com/robots.txt",
  "type": "ZAP-10109"
}
```


#### INFO: Modern Web Application

- **CWE:** CWE--1 (Unknown)
- **Tool:** browser-scanner

**Description:**
The application appears to be a modern web application. If you need to explore it automatically then the Ajax Spider may well be more effective than the standard one.

**Evidence:**
```
{
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js\"></script>",
  "url": "https://claude5-f5d80.firebaseapp.com/sitemap.xml",
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
  "url": "https://claude5-f5d80.firebaseapp.com/"
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
  "url": "https://claude5-f5d80.firebaseapp.com/home",
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
  "url": "https://claude5-f5d80.firebaseapp.com/profile",
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
  "url": "https://claude5-f5d80.firebaseapp.com/settings",
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
  "url": "https://claude5-f5d80.firebaseapp.com/posts",
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
  "url": "https://claude5-f5d80.firebaseapp.com/messages",
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
  "url": "https://claude5-f5d80.firebaseapp.com/feed",
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
  "url": "https://claude5-f5d80.firebaseapp.com/__nonexistent__1765840839599_772536e9d6a31",
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
  "url": "https://claude5-f5d80.firebaseapp.com/?file=..%2F..%2F..%2Fetc%2Fpasswd",
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
  "url": "https://claude5-f5d80.firebaseapp.com/?file=..%5C..%5C..%5Cwindows%5Cwin.ini",
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
  "url": "https://claude5-f5d80.firebaseapp.com/?file=....%2F%2F....%2F%2F....%2F%2Fetc%2Fpasswd",
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
  "url": "https://claude5-f5d80.firebaseapp.com/?file=..%252f..%252f..%252fetc%2Fpasswd",
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
  "url": "https://claude5-f5d80.firebaseapp.com/?path=..%2F..%2F..%2Fetc%2Fpasswd",
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
  "url": "https://claude5-f5d80.firebaseapp.com/?path=..%5C..%5C..%5Cwindows%5Cwin.ini",
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
  "url": "https://claude5-f5d80.firebaseapp.com/?path=....%2F%2F....%2F%2F....%2F%2Fetc%2Fpasswd",
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
  "url": "https://claude5-f5d80.firebaseapp.com/?path=..%252f..%252f..%252fetc%2Fpasswd",
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
  "url": "https://claude5-f5d80.firebaseapp.com/?filepath=..%2F..%2F..%2Fetc%2Fpasswd",
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
  "url": "https://claude5-f5d80.firebaseapp.com/?filepath=..%5C..%5C..%5Cwindows%5Cwin.ini",
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
  "url": "https://claude5-f5d80.firebaseapp.com/?filepath=....%2F%2F....%2F%2F....%2F%2Fetc%2Fpasswd",
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
  "url": "https://claude5-f5d80.firebaseapp.com/?filepath=..%252f..%252f..%252fetc%2Fpasswd",
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
  "url": "https://claude5-f5d80.firebaseapp.com/?document=..%2F..%2F..%2Fetc%2Fpasswd",
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
  "url": "https://claude5-f5d80.firebaseapp.com/?document=..%5C..%5C..%5Cwindows%5Cwin.ini",
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
  "url": "https://claude5-f5d80.firebaseapp.com/?document=....%2F%2F....%2F%2F....%2F%2Fetc%2Fpasswd",
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
  "url": "https://claude5-f5d80.firebaseapp.com/?document=..%252f..%252f..%252fetc%2Fpasswd",
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
  "url": "https://claude5-f5d80.firebaseapp.com/?doc=..%2F..%2F..%2Fetc%2Fpasswd",
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
  "url": "https://claude5-f5d80.firebaseapp.com/?doc=..%5C..%5C..%5Cwindows%5Cwin.ini",
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
  "url": "https://claude5-f5d80.firebaseapp.com/?doc=....%2F%2F....%2F%2F....%2F%2Fetc%2Fpasswd",
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
  "url": "https://claude5-f5d80.firebaseapp.com/?doc=..%252f..%252f..%252fetc%2Fpasswd",
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
  "url": "https://claude5-f5d80.firebaseapp.com/?page=..%2F..%2F..%2Fetc%2Fpasswd",
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
  "url": "https://claude5-f5d80.firebaseapp.com/?page=..%5C..%5C..%5Cwindows%5Cwin.ini",
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
  "url": "https://claude5-f5d80.firebaseapp.com/?page=....%2F%2F....%2F%2F....%2F%2Fetc%2Fpasswd",
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
  "url": "https://claude5-f5d80.firebaseapp.com/?page=..%252f..%252f..%252fetc%2Fpasswd",
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
  "url": "https://claude5-f5d80.firebaseapp.com/?template=..%2F..%2F..%2Fetc%2Fpasswd",
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
  "url": "https://claude5-f5d80.firebaseapp.com/?template=..%5C..%5C..%5Cwindows%5Cwin.ini",
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
  "url": "https://claude5-f5d80.firebaseapp.com/?template=....%2F%2F....%2F%2F....%2F%2Fetc%2Fpasswd",
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
  "url": "https://claude5-f5d80.firebaseapp.com/?template=..%252f..%252f..%252fetc%2Fpasswd",
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
  "url": "https://claude5-f5d80.firebaseapp.com/?include=..%2F..%2F..%2Fetc%2Fpasswd",
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
  "url": "https://claude5-f5d80.firebaseapp.com/?include=..%5C..%5C..%5Cwindows%5Cwin.ini",
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
  "url": "https://claude5-f5d80.firebaseapp.com/?include=....%2F%2F....%2F%2F....%2F%2Fetc%2Fpasswd",
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
  "url": "https://claude5-f5d80.firebaseapp.com/?include=..%252f..%252f..%252fetc%2Fpasswd",
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
  "url": "https://claude5-f5d80.firebaseapp.com/?dir=..%2F..%2F..%2Fetc%2Fpasswd",
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
  "url": "https://claude5-f5d80.firebaseapp.com/?dir=..%5C..%5C..%5Cwindows%5Cwin.ini",
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
  "url": "https://claude5-f5d80.firebaseapp.com/?dir=....%2F%2F....%2F%2F....%2F%2Fetc%2Fpasswd",
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
  "url": "https://claude5-f5d80.firebaseapp.com/?dir=..%252f..%252f..%252fetc%2Fpasswd",
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
  "url": "https://claude5-f5d80.firebaseapp.com/?folder=..%2F..%2F..%2Fetc%2Fpasswd",
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
  "url": "https://claude5-f5d80.firebaseapp.com/?folder=..%5C..%5C..%5Cwindows%5Cwin.ini",
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
  "url": "https://claude5-f5d80.firebaseapp.com/?folder=....%2F%2F....%2F%2F....%2F%2Fetc%2Fpasswd",
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
  "url": "https://claude5-f5d80.firebaseapp.com/?folder=..%252f..%252f..%252fetc%2Fpasswd",
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
  "url": "https://claude5-f5d80.firebaseapp.com/?load=..%2F..%2F..%2Fetc%2Fpasswd",
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
  "url": "https://claude5-f5d80.firebaseapp.com/?load=..%5C..%5C..%5Cwindows%5Cwin.ini",
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
  "url": "https://claude5-f5d80.firebaseapp.com/?load=....%2F%2F....%2F%2F....%2F%2Fetc%2Fpasswd",
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
  "url": "https://claude5-f5d80.firebaseapp.com/?load=..%252f..%252f..%252fetc%2Fpasswd",
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
  "url": "https://claude5-f5d80.firebaseapp.com/?read=..%2F..%2F..%2Fetc%2Fpasswd",
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
  "url": "https://claude5-f5d80.firebaseapp.com/?read=..%5C..%5C..%5Cwindows%5Cwin.ini",
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
  "url": "https://claude5-f5d80.firebaseapp.com/?read=....%2F%2F....%2F%2F....%2F%2Fetc%2Fpasswd",
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
  "url": "https://claude5-f5d80.firebaseapp.com/?read=..%252f..%252f..%252fetc%2Fpasswd",
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
  "url": "https://claude5-f5d80.firebaseapp.com/images/",
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
  "url": "https://claude5-f5d80.firebaseapp.com/uploads/",
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
  "url": "https://claude5-f5d80.firebaseapp.com/files/",
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
  "url": "https://claude5-f5d80.firebaseapp.com/assets/",
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
  "url": "https://claude5-f5d80.firebaseapp.com/static/",
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
  "url": "https://claude5-f5d80.firebaseapp.com/media/",
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
  "url": "https://claude5-f5d80.firebaseapp.com/backup/",
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
  "url": "https://claude5-f5d80.firebaseapp.com/logs/",
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
  "url": "https://claude5-f5d80.firebaseapp.com/tmp/",
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
  "url": "https://claude5-f5d80.firebaseapp.com/data/",
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
  "url": "https://claude5-f5d80.firebaseapp.com/admin",
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
  "url": "https://claude5-f5d80.firebaseapp.com/admin/",
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
  "url": "https://claude5-f5d80.firebaseapp.com/admin/dashboard",
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
  "url": "https://claude5-f5d80.firebaseapp.com/admin/users",
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
  "url": "https://claude5-f5d80.firebaseapp.com/admin/settings",
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
  "url": "https://claude5-f5d80.firebaseapp.com/administrator",
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
  "url": "https://claude5-f5d80.firebaseapp.com/manage",
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
  "url": "https://claude5-f5d80.firebaseapp.com/management",
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
  "url": "https://claude5-f5d80.firebaseapp.com/console",
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
  "url": "https://claude5-f5d80.firebaseapp.com/panel",
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
  "url": "https://claude5-f5d80.firebaseapp.com/backoffice",
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
  "url": "https://claude5-f5d80.firebaseapp.com/backend",
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
  "url": "https://claude5-f5d80.firebaseapp.com/dashboard/admin",
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
  "url": "https://claude5-f5d80.firebaseapp.com/api/admin",
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
  "url": "https://claude5-f5d80.firebaseapp.com/api/users",
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
  "url": "https://claude5-f5d80.firebaseapp.com/.git/config",
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
  "url": "https://claude5-f5d80.firebaseapp.com/.git/HEAD",
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
  "url": "https://claude5-f5d80.firebaseapp.com/.env",
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
  "url": "https://claude5-f5d80.firebaseapp.com/.env.local",
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
  "url": "https://claude5-f5d80.firebaseapp.com/.env.production",
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
  "url": "https://claude5-f5d80.firebaseapp.com/config.json",
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
  "url": "https://claude5-f5d80.firebaseapp.com/config.yaml",
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
  "url": "https://claude5-f5d80.firebaseapp.com/config.yml",
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
  "url": "https://claude5-f5d80.firebaseapp.com/firebase.json",
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
  "url": "https://claude5-f5d80.firebaseapp.com/package.json",
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
  "url": "https://claude5-f5d80.firebaseapp.com/package-lock.json",
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
  "url": "https://claude5-f5d80.firebaseapp.com/composer.json",
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
  "url": "https://claude5-f5d80.firebaseapp.com/composer.lock",
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
  "url": "https://claude5-f5d80.firebaseapp.com/tsconfig.json",
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
  "url": "https://claude5-f5d80.firebaseapp.com/.htaccess",
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
  "url": "https://claude5-f5d80.firebaseapp.com/.htpasswd",
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
  "url": "https://claude5-f5d80.firebaseapp.com/robots.txt",
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
  "url": "https://claude5-f5d80.firebaseapp.com/sitemap.xml",
  "type": "ZAP-10015"
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
  "url": "https://claude5-f5d80.firebaseapp.com/",
  "type": "ZAP-10116"
}
```


### A02: Cryptographic Failures

#### CRITICAL: Hardcoded API Key in JavaScript

- **CWE:** CWE-321 (Unknown)
- **Tool:** browser-scanner
- **Duplicate Count:** 3

**Description:**
Found API Key in client-side JavaScript

**Evidence:**
```
{
  "url": "https://claude5-f5d80.firebaseapp.com"
}
```


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
Found potential Google API Key in inline script #0

**Evidence:**
```
{
  "pattern": "Google API Key",
  "source": "inline script #0",
  "redactedMatch": "AIzaSyDRTj...7RihA"
}
```


#### HIGH: Sensitive Data in sessionStorage

- **CWE:** CWE-922 (Unknown)
- **Tool:** browser-scanner
- **Duplicate Count:** 3

**Description:**
Potential password found in sessionStorage

**Evidence:**
```
{
  "url": "https://claude5-f5d80.firebaseapp.com"
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
  "url": "https://claude5-f5d80.firebaseapp.com"
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
  "url": "https://claude5-f5d80.firebaseapp.com"
}
```


#### MEDIUM: Public Post Access

- **CWE:** CWE-311 (Unknown)
- **Tool:** live-scanner
- **Status:** ✅ Confirmed by live testing

**Description:**
3 posts readable without authentication

**Evidence:**
```
{
  "postCount": 3
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


#### MEDIUM: Weak Cryptography: Math.random() for security

- **CWE:** CWE-338 (Unknown)
- **Tool:** browser-scanner
- **Duplicate Count:** 3

**Description:**
Found usage of Math.random() for security in JavaScript

**Evidence:**
```
{
  "url": "https://claude5-f5d80.firebaseapp.com"
}
```


#### MEDIUM: Weak password policy

- **CWE:** CWE-521 (Weak Password Requirements)
- **Tool:** crypto-scanner
- **Duplicate Count:** 3

**Description:**
Password field "registerPassword" has weak policy: no minimum length requirement (should be ≥8), no pattern for password complexity


#### MEDIUM: Weak Random detected

- **CWE:** CWE-330 (Use of Insufficiently Random Values)
- **Tool:** crypto-scanner

**Description:**
Found Weak Random in inline script #0. This may indicate weak cryptographic practices.

**Evidence:**
```
{
  "pattern": "Weak Random",
  "source": "inline script #0",
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
  "url": "https://claude5-f5d80.firebaseapp.com"
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
  "url": "https://claude5-f5d80.firebaseapp.com"
}
```


### A03: Injection

#### HIGH: Reflected XSS via "callback" parameter

- **CWE:** CWE-79 (Cross-site Scripting (XSS))
- **Tool:** injection-scanner

**Description:**
Payload is reflected unencoded in response when passed via "callback" parameter

**Evidence:**
```
{
  "parameter": "callback",
  "payload": "alert",
  "url": "https://claude5-f5d80.firebaseapp.com?callback=alert"
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


