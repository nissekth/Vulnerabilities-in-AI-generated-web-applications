# Security Assessment Report

**Application:** Social Media App  
**Target:** https://gpt-2-22b6d.firebaseapp.com  
**Date:** 2025-12-15T15:49:59.750Z  
**Duration:** 96s

## Summary

| Severity | Count |
|----------|-------|
| CRITICAL | 3 |
| HIGH | 26 |
| MEDIUM | 8 |
| LOW | 2 |

**Risk Score:** 178 (CRITICAL)


### Deduplication Summary

| Metric | Value |
|--------|-------|
| Original Findings | 773 |
| After Deduplication | 596 |
| Duplicates Removed | 177 |
| Reduction | 23% |

## Findings

### A01: Broken Access Control

#### CRITICAL: Privilege Escalation: Self-Elevation to Admin

- **CWE:** CWE-269 (Unknown)
- **Tool:** live-scanner
- **Status:** ✅ Confirmed by live testing

**Description:**
User successfully set their own isAdmin flag to true

**Evidence:**
```
{
  "userId": "wnwq8br7q9YI3TJNdBB0XLBJ9wf1",
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
  "userId": "wnwq8br7q9YI3TJNdBB0XLBJ9wf1",
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


#### HIGH: client-side-isadmin

- **CWE:** CWE-863 (Incorrect Authorization)
- **Tool:** semgrep

**Description:**
Client-side admin check. CWE-863

**Evidence:**
```
{
  "file": "/home/nillof/Exjobb/GPT2/mini-social/public/app.js",
  "line": 200,
  "endLine": 200,
  "code": "$(\"admin-nav-btn\").classList.toggle(\"hidden\", !currentUserDoc.isAdmin && !currentUserDoc.isOwner);"
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
  "file": "/home/nillof/Exjobb/GPT2/mini-social/public/app.js",
  "line": 215,
  "endLine": 215,
  "code": "if (currentUserDoc.isAdmin || currentUserDoc.isOwner) loadAdmin();"
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
  "file": "/home/nillof/Exjobb/GPT2/mini-social/public/app.js",
  "line": 374,
  "endLine": 374,
  "code": "currentUserDoc.isAdmin ||"
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
  "file": "/home/nillof/Exjobb/GPT2/mini-social/public/app.js",
  "line": 400,
  "endLine": 400,
  "code": "(p.authorId === currentUser.uid || currentUserDoc.isAdmin || currentUserDoc.isOwner)"
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
  "file": "/home/nillof/Exjobb/GPT2/mini-social/public/app.js",
  "line": 1139,
  "endLine": 1139,
  "code": "if (!currentUserDoc?.isAdmin && !currentUserDoc?.isOwner) return;"
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
  "file": "/home/nillof/Exjobb/GPT2/mini-social/public/app.js",
  "line": 1161,
  "endLine": 1161,
  "code": "Admin: ${u.isAdmin ? \"Yes\" : \"No\"} · Owner: ${u.isOwner ? \"Yes\" : \"No\"}<br><br>"
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
  "file": "/home/nillof/Exjobb/GPT2/mini-social/public/app.js",
  "line": 1165,
  "endLine": 1165,
  "code": "${u.isAdmin ? \"Remove Admin\" : \"Make Admin\"}"
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
  "file": "/home/nillof/Exjobb/GPT2/mini-social/public/app.js",
  "line": 1192,
  "endLine": 1192,
  "code": "await ref.update({ isAdmin: !snap.data().isAdmin });"
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
    "displayName",
    "city",
    "isAdmin",
    "banner",
    "about",
    "photoURL",
    "age",
    "email",
    "fullName",
    "createdAt",
    "theme",
    "country",
    "isOwner",
    "referralOptIn",
    "referralPoints"
  ],
  "sensitiveFields": [
    "city",
    "age",
    "email",
    "country"
  ]
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
- **Duplicate Count:** 5

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


#### INFO: Content Security Policy (CSP) Header Not Set

- **CWE:** CWE-693 (Unknown)
- **Tool:** browser-scanner

**Description:**
Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks, including Cross Site Scripting (XSS) and data injection attacks. These attacks are used for everything from data theft to site defacement or distribution of malware. CSP provides a set of standard HTTP headers that allow website owners to declare approved sources of content that browsers should be allowed to load on that page — covered types are JavaScript, CSS, HTML frames, fonts, images and embeddable objects such as Java applets, ActiveX, audio and video files.

**Evidence:**
```
{
  "url": "https://gpt-2-22b6d.firebaseapp.com/"
}
```


#### INFO: Content Security Policy (CSP) Header Not Set

- **CWE:** CWE-693 (Unknown)
- **Tool:** browser-scanner

**Description:**
Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks, including Cross Site Scripting (XSS) and data injection attacks. These attacks are used for everything from data theft to site defacement or distribution of malware. CSP provides a set of standard HTTP headers that allow website owners to declare approved sources of content that browsers should be allowed to load on that page — covered types are JavaScript, CSS, HTML frames, fonts, images and embeddable objects such as Java applets, ActiveX, audio and video files.

**Evidence:**
```
{
  "url": "https://gpt-2-22b6d.firebaseapp.com/home"
}
```


#### INFO: Content Security Policy (CSP) Header Not Set

- **CWE:** CWE-693 (Unknown)
- **Tool:** browser-scanner

**Description:**
Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks, including Cross Site Scripting (XSS) and data injection attacks. These attacks are used for everything from data theft to site defacement or distribution of malware. CSP provides a set of standard HTTP headers that allow website owners to declare approved sources of content that browsers should be allowed to load on that page — covered types are JavaScript, CSS, HTML frames, fonts, images and embeddable objects such as Java applets, ActiveX, audio and video files.

**Evidence:**
```
{
  "url": "https://gpt-2-22b6d.firebaseapp.com/profile"
}
```


#### INFO: Content Security Policy (CSP) Header Not Set

- **CWE:** CWE-693 (Unknown)
- **Tool:** browser-scanner

**Description:**
Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks, including Cross Site Scripting (XSS) and data injection attacks. These attacks are used for everything from data theft to site defacement or distribution of malware. CSP provides a set of standard HTTP headers that allow website owners to declare approved sources of content that browsers should be allowed to load on that page — covered types are JavaScript, CSS, HTML frames, fonts, images and embeddable objects such as Java applets, ActiveX, audio and video files.

**Evidence:**
```
{
  "url": "https://gpt-2-22b6d.firebaseapp.com/settings"
}
```


#### INFO: Content Security Policy (CSP) Header Not Set

- **CWE:** CWE-693 (Unknown)
- **Tool:** browser-scanner

**Description:**
Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks, including Cross Site Scripting (XSS) and data injection attacks. These attacks are used for everything from data theft to site defacement or distribution of malware. CSP provides a set of standard HTTP headers that allow website owners to declare approved sources of content that browsers should be allowed to load on that page — covered types are JavaScript, CSS, HTML frames, fonts, images and embeddable objects such as Java applets, ActiveX, audio and video files.

**Evidence:**
```
{
  "url": "https://gpt-2-22b6d.firebaseapp.com/posts"
}
```


#### INFO: Content Security Policy (CSP) Header Not Set

- **CWE:** CWE-693 (Unknown)
- **Tool:** browser-scanner

**Description:**
Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks, including Cross Site Scripting (XSS) and data injection attacks. These attacks are used for everything from data theft to site defacement or distribution of malware. CSP provides a set of standard HTTP headers that allow website owners to declare approved sources of content that browsers should be allowed to load on that page — covered types are JavaScript, CSS, HTML frames, fonts, images and embeddable objects such as Java applets, ActiveX, audio and video files.

**Evidence:**
```
{
  "url": "https://gpt-2-22b6d.firebaseapp.com/messages"
}
```


#### INFO: Content Security Policy (CSP) Header Not Set

- **CWE:** CWE-693 (Unknown)
- **Tool:** browser-scanner

**Description:**
Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks, including Cross Site Scripting (XSS) and data injection attacks. These attacks are used for everything from data theft to site defacement or distribution of malware. CSP provides a set of standard HTTP headers that allow website owners to declare approved sources of content that browsers should be allowed to load on that page — covered types are JavaScript, CSS, HTML frames, fonts, images and embeddable objects such as Java applets, ActiveX, audio and video files.

**Evidence:**
```
{
  "url": "https://gpt-2-22b6d.firebaseapp.com/feed"
}
```


#### INFO: Content Security Policy (CSP) Header Not Set

- **CWE:** CWE-693 (Unknown)
- **Tool:** browser-scanner

**Description:**
Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks, including Cross Site Scripting (XSS) and data injection attacks. These attacks are used for everything from data theft to site defacement or distribution of malware. CSP provides a set of standard HTTP headers that allow website owners to declare approved sources of content that browsers should be allowed to load on that page — covered types are JavaScript, CSS, HTML frames, fonts, images and embeddable objects such as Java applets, ActiveX, audio and video files.

**Evidence:**
```
{
  "url": "https://gpt-2-22b6d.firebaseapp.com/__nonexistent__1765813078782_e1794ca5e1b25"
}
```


#### INFO: Content Security Policy (CSP) Header Not Set

- **CWE:** CWE-693 (Unknown)
- **Tool:** browser-scanner

**Description:**
Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks, including Cross Site Scripting (XSS) and data injection attacks. These attacks are used for everything from data theft to site defacement or distribution of malware. CSP provides a set of standard HTTP headers that allow website owners to declare approved sources of content that browsers should be allowed to load on that page — covered types are JavaScript, CSS, HTML frames, fonts, images and embeddable objects such as Java applets, ActiveX, audio and video files.

**Evidence:**
```
{
  "url": "https://gpt-2-22b6d.firebaseapp.com/?file=..%2F..%2F..%2Fetc%2Fpasswd"
}
```


#### INFO: Content Security Policy (CSP) Header Not Set

- **CWE:** CWE-693 (Unknown)
- **Tool:** browser-scanner

**Description:**
Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks, including Cross Site Scripting (XSS) and data injection attacks. These attacks are used for everything from data theft to site defacement or distribution of malware. CSP provides a set of standard HTTP headers that allow website owners to declare approved sources of content that browsers should be allowed to load on that page — covered types are JavaScript, CSS, HTML frames, fonts, images and embeddable objects such as Java applets, ActiveX, audio and video files.

**Evidence:**
```
{
  "url": "https://gpt-2-22b6d.firebaseapp.com/?file=..%5C..%5C..%5Cwindows%5Cwin.ini"
}
```


#### INFO: Content Security Policy (CSP) Header Not Set

- **CWE:** CWE-693 (Unknown)
- **Tool:** browser-scanner

**Description:**
Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks, including Cross Site Scripting (XSS) and data injection attacks. These attacks are used for everything from data theft to site defacement or distribution of malware. CSP provides a set of standard HTTP headers that allow website owners to declare approved sources of content that browsers should be allowed to load on that page — covered types are JavaScript, CSS, HTML frames, fonts, images and embeddable objects such as Java applets, ActiveX, audio and video files.

**Evidence:**
```
{
  "url": "https://gpt-2-22b6d.firebaseapp.com/?file=....%2F%2F....%2F%2F....%2F%2Fetc%2Fpasswd"
}
```


#### INFO: Content Security Policy (CSP) Header Not Set

- **CWE:** CWE-693 (Unknown)
- **Tool:** browser-scanner

**Description:**
Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks, including Cross Site Scripting (XSS) and data injection attacks. These attacks are used for everything from data theft to site defacement or distribution of malware. CSP provides a set of standard HTTP headers that allow website owners to declare approved sources of content that browsers should be allowed to load on that page — covered types are JavaScript, CSS, HTML frames, fonts, images and embeddable objects such as Java applets, ActiveX, audio and video files.

**Evidence:**
```
{
  "url": "https://gpt-2-22b6d.firebaseapp.com/?file=..%252f..%252f..%252fetc%2Fpasswd"
}
```


#### INFO: Content Security Policy (CSP) Header Not Set

- **CWE:** CWE-693 (Unknown)
- **Tool:** browser-scanner

**Description:**
Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks, including Cross Site Scripting (XSS) and data injection attacks. These attacks are used for everything from data theft to site defacement or distribution of malware. CSP provides a set of standard HTTP headers that allow website owners to declare approved sources of content that browsers should be allowed to load on that page — covered types are JavaScript, CSS, HTML frames, fonts, images and embeddable objects such as Java applets, ActiveX, audio and video files.

**Evidence:**
```
{
  "url": "https://gpt-2-22b6d.firebaseapp.com/?path=..%2F..%2F..%2Fetc%2Fpasswd"
}
```


#### INFO: Content Security Policy (CSP) Header Not Set

- **CWE:** CWE-693 (Unknown)
- **Tool:** browser-scanner

**Description:**
Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks, including Cross Site Scripting (XSS) and data injection attacks. These attacks are used for everything from data theft to site defacement or distribution of malware. CSP provides a set of standard HTTP headers that allow website owners to declare approved sources of content that browsers should be allowed to load on that page — covered types are JavaScript, CSS, HTML frames, fonts, images and embeddable objects such as Java applets, ActiveX, audio and video files.

**Evidence:**
```
{
  "url": "https://gpt-2-22b6d.firebaseapp.com/?path=..%5C..%5C..%5Cwindows%5Cwin.ini"
}
```


#### INFO: Content Security Policy (CSP) Header Not Set

- **CWE:** CWE-693 (Unknown)
- **Tool:** browser-scanner

**Description:**
Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks, including Cross Site Scripting (XSS) and data injection attacks. These attacks are used for everything from data theft to site defacement or distribution of malware. CSP provides a set of standard HTTP headers that allow website owners to declare approved sources of content that browsers should be allowed to load on that page — covered types are JavaScript, CSS, HTML frames, fonts, images and embeddable objects such as Java applets, ActiveX, audio and video files.

**Evidence:**
```
{
  "url": "https://gpt-2-22b6d.firebaseapp.com/?path=....%2F%2F....%2F%2F....%2F%2Fetc%2Fpasswd"
}
```


#### INFO: Content Security Policy (CSP) Header Not Set

- **CWE:** CWE-693 (Unknown)
- **Tool:** browser-scanner

**Description:**
Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks, including Cross Site Scripting (XSS) and data injection attacks. These attacks are used for everything from data theft to site defacement or distribution of malware. CSP provides a set of standard HTTP headers that allow website owners to declare approved sources of content that browsers should be allowed to load on that page — covered types are JavaScript, CSS, HTML frames, fonts, images and embeddable objects such as Java applets, ActiveX, audio and video files.

**Evidence:**
```
{
  "url": "https://gpt-2-22b6d.firebaseapp.com/?path=..%252f..%252f..%252fetc%2Fpasswd"
}
```


#### INFO: Content Security Policy (CSP) Header Not Set

- **CWE:** CWE-693 (Unknown)
- **Tool:** browser-scanner

**Description:**
Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks, including Cross Site Scripting (XSS) and data injection attacks. These attacks are used for everything from data theft to site defacement or distribution of malware. CSP provides a set of standard HTTP headers that allow website owners to declare approved sources of content that browsers should be allowed to load on that page — covered types are JavaScript, CSS, HTML frames, fonts, images and embeddable objects such as Java applets, ActiveX, audio and video files.

**Evidence:**
```
{
  "url": "https://gpt-2-22b6d.firebaseapp.com/?filepath=..%2F..%2F..%2Fetc%2Fpasswd"
}
```


#### INFO: Content Security Policy (CSP) Header Not Set

- **CWE:** CWE-693 (Unknown)
- **Tool:** browser-scanner

**Description:**
Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks, including Cross Site Scripting (XSS) and data injection attacks. These attacks are used for everything from data theft to site defacement or distribution of malware. CSP provides a set of standard HTTP headers that allow website owners to declare approved sources of content that browsers should be allowed to load on that page — covered types are JavaScript, CSS, HTML frames, fonts, images and embeddable objects such as Java applets, ActiveX, audio and video files.

**Evidence:**
```
{
  "url": "https://gpt-2-22b6d.firebaseapp.com/?filepath=..%5C..%5C..%5Cwindows%5Cwin.ini"
}
```


#### INFO: Content Security Policy (CSP) Header Not Set

- **CWE:** CWE-693 (Unknown)
- **Tool:** browser-scanner

**Description:**
Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks, including Cross Site Scripting (XSS) and data injection attacks. These attacks are used for everything from data theft to site defacement or distribution of malware. CSP provides a set of standard HTTP headers that allow website owners to declare approved sources of content that browsers should be allowed to load on that page — covered types are JavaScript, CSS, HTML frames, fonts, images and embeddable objects such as Java applets, ActiveX, audio and video files.

**Evidence:**
```
{
  "url": "https://gpt-2-22b6d.firebaseapp.com/?filepath=....%2F%2F....%2F%2F....%2F%2Fetc%2Fpasswd"
}
```


#### INFO: Content Security Policy (CSP) Header Not Set

- **CWE:** CWE-693 (Unknown)
- **Tool:** browser-scanner

**Description:**
Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks, including Cross Site Scripting (XSS) and data injection attacks. These attacks are used for everything from data theft to site defacement or distribution of malware. CSP provides a set of standard HTTP headers that allow website owners to declare approved sources of content that browsers should be allowed to load on that page — covered types are JavaScript, CSS, HTML frames, fonts, images and embeddable objects such as Java applets, ActiveX, audio and video files.

**Evidence:**
```
{
  "url": "https://gpt-2-22b6d.firebaseapp.com/?filepath=..%252f..%252f..%252fetc%2Fpasswd"
}
```


#### INFO: Content Security Policy (CSP) Header Not Set

- **CWE:** CWE-693 (Unknown)
- **Tool:** browser-scanner

**Description:**
Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks, including Cross Site Scripting (XSS) and data injection attacks. These attacks are used for everything from data theft to site defacement or distribution of malware. CSP provides a set of standard HTTP headers that allow website owners to declare approved sources of content that browsers should be allowed to load on that page — covered types are JavaScript, CSS, HTML frames, fonts, images and embeddable objects such as Java applets, ActiveX, audio and video files.

**Evidence:**
```
{
  "url": "https://gpt-2-22b6d.firebaseapp.com/?document=..%2F..%2F..%2Fetc%2Fpasswd"
}
```


#### INFO: Content Security Policy (CSP) Header Not Set

- **CWE:** CWE-693 (Unknown)
- **Tool:** browser-scanner

**Description:**
Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks, including Cross Site Scripting (XSS) and data injection attacks. These attacks are used for everything from data theft to site defacement or distribution of malware. CSP provides a set of standard HTTP headers that allow website owners to declare approved sources of content that browsers should be allowed to load on that page — covered types are JavaScript, CSS, HTML frames, fonts, images and embeddable objects such as Java applets, ActiveX, audio and video files.

**Evidence:**
```
{
  "url": "https://gpt-2-22b6d.firebaseapp.com/?document=..%5C..%5C..%5Cwindows%5Cwin.ini"
}
```


#### INFO: Content Security Policy (CSP) Header Not Set

- **CWE:** CWE-693 (Unknown)
- **Tool:** browser-scanner

**Description:**
Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks, including Cross Site Scripting (XSS) and data injection attacks. These attacks are used for everything from data theft to site defacement or distribution of malware. CSP provides a set of standard HTTP headers that allow website owners to declare approved sources of content that browsers should be allowed to load on that page — covered types are JavaScript, CSS, HTML frames, fonts, images and embeddable objects such as Java applets, ActiveX, audio and video files.

**Evidence:**
```
{
  "url": "https://gpt-2-22b6d.firebaseapp.com/?document=....%2F%2F....%2F%2F....%2F%2Fetc%2Fpasswd"
}
```


#### INFO: Content Security Policy (CSP) Header Not Set

- **CWE:** CWE-693 (Unknown)
- **Tool:** browser-scanner

**Description:**
Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks, including Cross Site Scripting (XSS) and data injection attacks. These attacks are used for everything from data theft to site defacement or distribution of malware. CSP provides a set of standard HTTP headers that allow website owners to declare approved sources of content that browsers should be allowed to load on that page — covered types are JavaScript, CSS, HTML frames, fonts, images and embeddable objects such as Java applets, ActiveX, audio and video files.

**Evidence:**
```
{
  "url": "https://gpt-2-22b6d.firebaseapp.com/?document=..%252f..%252f..%252fetc%2Fpasswd"
}
```


#### INFO: Content Security Policy (CSP) Header Not Set

- **CWE:** CWE-693 (Unknown)
- **Tool:** browser-scanner

**Description:**
Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks, including Cross Site Scripting (XSS) and data injection attacks. These attacks are used for everything from data theft to site defacement or distribution of malware. CSP provides a set of standard HTTP headers that allow website owners to declare approved sources of content that browsers should be allowed to load on that page — covered types are JavaScript, CSS, HTML frames, fonts, images and embeddable objects such as Java applets, ActiveX, audio and video files.

**Evidence:**
```
{
  "url": "https://gpt-2-22b6d.firebaseapp.com/?doc=..%2F..%2F..%2Fetc%2Fpasswd"
}
```


#### INFO: Content Security Policy (CSP) Header Not Set

- **CWE:** CWE-693 (Unknown)
- **Tool:** browser-scanner

**Description:**
Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks, including Cross Site Scripting (XSS) and data injection attacks. These attacks are used for everything from data theft to site defacement or distribution of malware. CSP provides a set of standard HTTP headers that allow website owners to declare approved sources of content that browsers should be allowed to load on that page — covered types are JavaScript, CSS, HTML frames, fonts, images and embeddable objects such as Java applets, ActiveX, audio and video files.

**Evidence:**
```
{
  "url": "https://gpt-2-22b6d.firebaseapp.com/?doc=..%5C..%5C..%5Cwindows%5Cwin.ini"
}
```


#### INFO: Content Security Policy (CSP) Header Not Set

- **CWE:** CWE-693 (Unknown)
- **Tool:** browser-scanner

**Description:**
Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks, including Cross Site Scripting (XSS) and data injection attacks. These attacks are used for everything from data theft to site defacement or distribution of malware. CSP provides a set of standard HTTP headers that allow website owners to declare approved sources of content that browsers should be allowed to load on that page — covered types are JavaScript, CSS, HTML frames, fonts, images and embeddable objects such as Java applets, ActiveX, audio and video files.

**Evidence:**
```
{
  "url": "https://gpt-2-22b6d.firebaseapp.com/?doc=....%2F%2F....%2F%2F....%2F%2Fetc%2Fpasswd"
}
```


#### INFO: Content Security Policy (CSP) Header Not Set

- **CWE:** CWE-693 (Unknown)
- **Tool:** browser-scanner

**Description:**
Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks, including Cross Site Scripting (XSS) and data injection attacks. These attacks are used for everything from data theft to site defacement or distribution of malware. CSP provides a set of standard HTTP headers that allow website owners to declare approved sources of content that browsers should be allowed to load on that page — covered types are JavaScript, CSS, HTML frames, fonts, images and embeddable objects such as Java applets, ActiveX, audio and video files.

**Evidence:**
```
{
  "url": "https://gpt-2-22b6d.firebaseapp.com/?doc=..%252f..%252f..%252fetc%2Fpasswd"
}
```


#### INFO: Content Security Policy (CSP) Header Not Set

- **CWE:** CWE-693 (Unknown)
- **Tool:** browser-scanner

**Description:**
Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks, including Cross Site Scripting (XSS) and data injection attacks. These attacks are used for everything from data theft to site defacement or distribution of malware. CSP provides a set of standard HTTP headers that allow website owners to declare approved sources of content that browsers should be allowed to load on that page — covered types are JavaScript, CSS, HTML frames, fonts, images and embeddable objects such as Java applets, ActiveX, audio and video files.

**Evidence:**
```
{
  "url": "https://gpt-2-22b6d.firebaseapp.com/?page=..%2F..%2F..%2Fetc%2Fpasswd"
}
```


#### INFO: Content Security Policy (CSP) Header Not Set

- **CWE:** CWE-693 (Unknown)
- **Tool:** browser-scanner

**Description:**
Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks, including Cross Site Scripting (XSS) and data injection attacks. These attacks are used for everything from data theft to site defacement or distribution of malware. CSP provides a set of standard HTTP headers that allow website owners to declare approved sources of content that browsers should be allowed to load on that page — covered types are JavaScript, CSS, HTML frames, fonts, images and embeddable objects such as Java applets, ActiveX, audio and video files.

**Evidence:**
```
{
  "url": "https://gpt-2-22b6d.firebaseapp.com/?page=..%5C..%5C..%5Cwindows%5Cwin.ini"
}
```


#### INFO: Content Security Policy (CSP) Header Not Set

- **CWE:** CWE-693 (Unknown)
- **Tool:** browser-scanner

**Description:**
Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks, including Cross Site Scripting (XSS) and data injection attacks. These attacks are used for everything from data theft to site defacement or distribution of malware. CSP provides a set of standard HTTP headers that allow website owners to declare approved sources of content that browsers should be allowed to load on that page — covered types are JavaScript, CSS, HTML frames, fonts, images and embeddable objects such as Java applets, ActiveX, audio and video files.

**Evidence:**
```
{
  "url": "https://gpt-2-22b6d.firebaseapp.com/?page=....%2F%2F....%2F%2F....%2F%2Fetc%2Fpasswd"
}
```


#### INFO: Content Security Policy (CSP) Header Not Set

- **CWE:** CWE-693 (Unknown)
- **Tool:** browser-scanner

**Description:**
Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks, including Cross Site Scripting (XSS) and data injection attacks. These attacks are used for everything from data theft to site defacement or distribution of malware. CSP provides a set of standard HTTP headers that allow website owners to declare approved sources of content that browsers should be allowed to load on that page — covered types are JavaScript, CSS, HTML frames, fonts, images and embeddable objects such as Java applets, ActiveX, audio and video files.

**Evidence:**
```
{
  "url": "https://gpt-2-22b6d.firebaseapp.com/?page=..%252f..%252f..%252fetc%2Fpasswd"
}
```


#### INFO: Content Security Policy (CSP) Header Not Set

- **CWE:** CWE-693 (Unknown)
- **Tool:** browser-scanner

**Description:**
Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks, including Cross Site Scripting (XSS) and data injection attacks. These attacks are used for everything from data theft to site defacement or distribution of malware. CSP provides a set of standard HTTP headers that allow website owners to declare approved sources of content that browsers should be allowed to load on that page — covered types are JavaScript, CSS, HTML frames, fonts, images and embeddable objects such as Java applets, ActiveX, audio and video files.

**Evidence:**
```
{
  "url": "https://gpt-2-22b6d.firebaseapp.com/?template=..%2F..%2F..%2Fetc%2Fpasswd"
}
```


#### INFO: Content Security Policy (CSP) Header Not Set

- **CWE:** CWE-693 (Unknown)
- **Tool:** browser-scanner

**Description:**
Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks, including Cross Site Scripting (XSS) and data injection attacks. These attacks are used for everything from data theft to site defacement or distribution of malware. CSP provides a set of standard HTTP headers that allow website owners to declare approved sources of content that browsers should be allowed to load on that page — covered types are JavaScript, CSS, HTML frames, fonts, images and embeddable objects such as Java applets, ActiveX, audio and video files.

**Evidence:**
```
{
  "url": "https://gpt-2-22b6d.firebaseapp.com/?template=..%5C..%5C..%5Cwindows%5Cwin.ini"
}
```


#### INFO: Content Security Policy (CSP) Header Not Set

- **CWE:** CWE-693 (Unknown)
- **Tool:** browser-scanner

**Description:**
Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks, including Cross Site Scripting (XSS) and data injection attacks. These attacks are used for everything from data theft to site defacement or distribution of malware. CSP provides a set of standard HTTP headers that allow website owners to declare approved sources of content that browsers should be allowed to load on that page — covered types are JavaScript, CSS, HTML frames, fonts, images and embeddable objects such as Java applets, ActiveX, audio and video files.

**Evidence:**
```
{
  "url": "https://gpt-2-22b6d.firebaseapp.com/?template=....%2F%2F....%2F%2F....%2F%2Fetc%2Fpasswd"
}
```


#### INFO: Content Security Policy (CSP) Header Not Set

- **CWE:** CWE-693 (Unknown)
- **Tool:** browser-scanner

**Description:**
Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks, including Cross Site Scripting (XSS) and data injection attacks. These attacks are used for everything from data theft to site defacement or distribution of malware. CSP provides a set of standard HTTP headers that allow website owners to declare approved sources of content that browsers should be allowed to load on that page — covered types are JavaScript, CSS, HTML frames, fonts, images and embeddable objects such as Java applets, ActiveX, audio and video files.

**Evidence:**
```
{
  "url": "https://gpt-2-22b6d.firebaseapp.com/?template=..%252f..%252f..%252fetc%2Fpasswd"
}
```


#### INFO: Content Security Policy (CSP) Header Not Set

- **CWE:** CWE-693 (Unknown)
- **Tool:** browser-scanner

**Description:**
Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks, including Cross Site Scripting (XSS) and data injection attacks. These attacks are used for everything from data theft to site defacement or distribution of malware. CSP provides a set of standard HTTP headers that allow website owners to declare approved sources of content that browsers should be allowed to load on that page — covered types are JavaScript, CSS, HTML frames, fonts, images and embeddable objects such as Java applets, ActiveX, audio and video files.

**Evidence:**
```
{
  "url": "https://gpt-2-22b6d.firebaseapp.com/?include=..%2F..%2F..%2Fetc%2Fpasswd"
}
```


#### INFO: Content Security Policy (CSP) Header Not Set

- **CWE:** CWE-693 (Unknown)
- **Tool:** browser-scanner

**Description:**
Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks, including Cross Site Scripting (XSS) and data injection attacks. These attacks are used for everything from data theft to site defacement or distribution of malware. CSP provides a set of standard HTTP headers that allow website owners to declare approved sources of content that browsers should be allowed to load on that page — covered types are JavaScript, CSS, HTML frames, fonts, images and embeddable objects such as Java applets, ActiveX, audio and video files.

**Evidence:**
```
{
  "url": "https://gpt-2-22b6d.firebaseapp.com/?include=..%5C..%5C..%5Cwindows%5Cwin.ini"
}
```


#### INFO: Content Security Policy (CSP) Header Not Set

- **CWE:** CWE-693 (Unknown)
- **Tool:** browser-scanner

**Description:**
Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks, including Cross Site Scripting (XSS) and data injection attacks. These attacks are used for everything from data theft to site defacement or distribution of malware. CSP provides a set of standard HTTP headers that allow website owners to declare approved sources of content that browsers should be allowed to load on that page — covered types are JavaScript, CSS, HTML frames, fonts, images and embeddable objects such as Java applets, ActiveX, audio and video files.

**Evidence:**
```
{
  "url": "https://gpt-2-22b6d.firebaseapp.com/?include=....%2F%2F....%2F%2F....%2F%2Fetc%2Fpasswd"
}
```


#### INFO: Content Security Policy (CSP) Header Not Set

- **CWE:** CWE-693 (Unknown)
- **Tool:** browser-scanner

**Description:**
Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks, including Cross Site Scripting (XSS) and data injection attacks. These attacks are used for everything from data theft to site defacement or distribution of malware. CSP provides a set of standard HTTP headers that allow website owners to declare approved sources of content that browsers should be allowed to load on that page — covered types are JavaScript, CSS, HTML frames, fonts, images and embeddable objects such as Java applets, ActiveX, audio and video files.

**Evidence:**
```
{
  "url": "https://gpt-2-22b6d.firebaseapp.com/?include=..%252f..%252f..%252fetc%2Fpasswd"
}
```


#### INFO: Content Security Policy (CSP) Header Not Set

- **CWE:** CWE-693 (Unknown)
- **Tool:** browser-scanner

**Description:**
Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks, including Cross Site Scripting (XSS) and data injection attacks. These attacks are used for everything from data theft to site defacement or distribution of malware. CSP provides a set of standard HTTP headers that allow website owners to declare approved sources of content that browsers should be allowed to load on that page — covered types are JavaScript, CSS, HTML frames, fonts, images and embeddable objects such as Java applets, ActiveX, audio and video files.

**Evidence:**
```
{
  "url": "https://gpt-2-22b6d.firebaseapp.com/?dir=..%2F..%2F..%2Fetc%2Fpasswd"
}
```


#### INFO: Content Security Policy (CSP) Header Not Set

- **CWE:** CWE-693 (Unknown)
- **Tool:** browser-scanner

**Description:**
Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks, including Cross Site Scripting (XSS) and data injection attacks. These attacks are used for everything from data theft to site defacement or distribution of malware. CSP provides a set of standard HTTP headers that allow website owners to declare approved sources of content that browsers should be allowed to load on that page — covered types are JavaScript, CSS, HTML frames, fonts, images and embeddable objects such as Java applets, ActiveX, audio and video files.

**Evidence:**
```
{
  "url": "https://gpt-2-22b6d.firebaseapp.com/?dir=..%5C..%5C..%5Cwindows%5Cwin.ini"
}
```


#### INFO: Content Security Policy (CSP) Header Not Set

- **CWE:** CWE-693 (Unknown)
- **Tool:** browser-scanner

**Description:**
Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks, including Cross Site Scripting (XSS) and data injection attacks. These attacks are used for everything from data theft to site defacement or distribution of malware. CSP provides a set of standard HTTP headers that allow website owners to declare approved sources of content that browsers should be allowed to load on that page — covered types are JavaScript, CSS, HTML frames, fonts, images and embeddable objects such as Java applets, ActiveX, audio and video files.

**Evidence:**
```
{
  "url": "https://gpt-2-22b6d.firebaseapp.com/?dir=....%2F%2F....%2F%2F....%2F%2Fetc%2Fpasswd"
}
```


#### INFO: Content Security Policy (CSP) Header Not Set

- **CWE:** CWE-693 (Unknown)
- **Tool:** browser-scanner

**Description:**
Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks, including Cross Site Scripting (XSS) and data injection attacks. These attacks are used for everything from data theft to site defacement or distribution of malware. CSP provides a set of standard HTTP headers that allow website owners to declare approved sources of content that browsers should be allowed to load on that page — covered types are JavaScript, CSS, HTML frames, fonts, images and embeddable objects such as Java applets, ActiveX, audio and video files.

**Evidence:**
```
{
  "url": "https://gpt-2-22b6d.firebaseapp.com/?dir=..%252f..%252f..%252fetc%2Fpasswd"
}
```


#### INFO: Content Security Policy (CSP) Header Not Set

- **CWE:** CWE-693 (Unknown)
- **Tool:** browser-scanner

**Description:**
Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks, including Cross Site Scripting (XSS) and data injection attacks. These attacks are used for everything from data theft to site defacement or distribution of malware. CSP provides a set of standard HTTP headers that allow website owners to declare approved sources of content that browsers should be allowed to load on that page — covered types are JavaScript, CSS, HTML frames, fonts, images and embeddable objects such as Java applets, ActiveX, audio and video files.

**Evidence:**
```
{
  "url": "https://gpt-2-22b6d.firebaseapp.com/?folder=..%2F..%2F..%2Fetc%2Fpasswd"
}
```


#### INFO: Content Security Policy (CSP) Header Not Set

- **CWE:** CWE-693 (Unknown)
- **Tool:** browser-scanner

**Description:**
Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks, including Cross Site Scripting (XSS) and data injection attacks. These attacks are used for everything from data theft to site defacement or distribution of malware. CSP provides a set of standard HTTP headers that allow website owners to declare approved sources of content that browsers should be allowed to load on that page — covered types are JavaScript, CSS, HTML frames, fonts, images and embeddable objects such as Java applets, ActiveX, audio and video files.

**Evidence:**
```
{
  "url": "https://gpt-2-22b6d.firebaseapp.com/?folder=..%5C..%5C..%5Cwindows%5Cwin.ini"
}
```


#### INFO: Content Security Policy (CSP) Header Not Set

- **CWE:** CWE-693 (Unknown)
- **Tool:** browser-scanner

**Description:**
Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks, including Cross Site Scripting (XSS) and data injection attacks. These attacks are used for everything from data theft to site defacement or distribution of malware. CSP provides a set of standard HTTP headers that allow website owners to declare approved sources of content that browsers should be allowed to load on that page — covered types are JavaScript, CSS, HTML frames, fonts, images and embeddable objects such as Java applets, ActiveX, audio and video files.

**Evidence:**
```
{
  "url": "https://gpt-2-22b6d.firebaseapp.com/?folder=....%2F%2F....%2F%2F....%2F%2Fetc%2Fpasswd"
}
```


#### INFO: Content Security Policy (CSP) Header Not Set

- **CWE:** CWE-693 (Unknown)
- **Tool:** browser-scanner

**Description:**
Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks, including Cross Site Scripting (XSS) and data injection attacks. These attacks are used for everything from data theft to site defacement or distribution of malware. CSP provides a set of standard HTTP headers that allow website owners to declare approved sources of content that browsers should be allowed to load on that page — covered types are JavaScript, CSS, HTML frames, fonts, images and embeddable objects such as Java applets, ActiveX, audio and video files.

**Evidence:**
```
{
  "url": "https://gpt-2-22b6d.firebaseapp.com/?folder=..%252f..%252f..%252fetc%2Fpasswd"
}
```


#### INFO: Content Security Policy (CSP) Header Not Set

- **CWE:** CWE-693 (Unknown)
- **Tool:** browser-scanner

**Description:**
Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks, including Cross Site Scripting (XSS) and data injection attacks. These attacks are used for everything from data theft to site defacement or distribution of malware. CSP provides a set of standard HTTP headers that allow website owners to declare approved sources of content that browsers should be allowed to load on that page — covered types are JavaScript, CSS, HTML frames, fonts, images and embeddable objects such as Java applets, ActiveX, audio and video files.

**Evidence:**
```
{
  "url": "https://gpt-2-22b6d.firebaseapp.com/?load=..%2F..%2F..%2Fetc%2Fpasswd"
}
```


#### INFO: Content Security Policy (CSP) Header Not Set

- **CWE:** CWE-693 (Unknown)
- **Tool:** browser-scanner

**Description:**
Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks, including Cross Site Scripting (XSS) and data injection attacks. These attacks are used for everything from data theft to site defacement or distribution of malware. CSP provides a set of standard HTTP headers that allow website owners to declare approved sources of content that browsers should be allowed to load on that page — covered types are JavaScript, CSS, HTML frames, fonts, images and embeddable objects such as Java applets, ActiveX, audio and video files.

**Evidence:**
```
{
  "url": "https://gpt-2-22b6d.firebaseapp.com/?load=..%5C..%5C..%5Cwindows%5Cwin.ini"
}
```


#### INFO: Content Security Policy (CSP) Header Not Set

- **CWE:** CWE-693 (Unknown)
- **Tool:** browser-scanner

**Description:**
Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks, including Cross Site Scripting (XSS) and data injection attacks. These attacks are used for everything from data theft to site defacement or distribution of malware. CSP provides a set of standard HTTP headers that allow website owners to declare approved sources of content that browsers should be allowed to load on that page — covered types are JavaScript, CSS, HTML frames, fonts, images and embeddable objects such as Java applets, ActiveX, audio and video files.

**Evidence:**
```
{
  "url": "https://gpt-2-22b6d.firebaseapp.com/?load=....%2F%2F....%2F%2F....%2F%2Fetc%2Fpasswd"
}
```


#### INFO: Content Security Policy (CSP) Header Not Set

- **CWE:** CWE-693 (Unknown)
- **Tool:** browser-scanner

**Description:**
Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks, including Cross Site Scripting (XSS) and data injection attacks. These attacks are used for everything from data theft to site defacement or distribution of malware. CSP provides a set of standard HTTP headers that allow website owners to declare approved sources of content that browsers should be allowed to load on that page — covered types are JavaScript, CSS, HTML frames, fonts, images and embeddable objects such as Java applets, ActiveX, audio and video files.

**Evidence:**
```
{
  "url": "https://gpt-2-22b6d.firebaseapp.com/?load=..%252f..%252f..%252fetc%2Fpasswd"
}
```


#### INFO: Content Security Policy (CSP) Header Not Set

- **CWE:** CWE-693 (Unknown)
- **Tool:** browser-scanner

**Description:**
Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks, including Cross Site Scripting (XSS) and data injection attacks. These attacks are used for everything from data theft to site defacement or distribution of malware. CSP provides a set of standard HTTP headers that allow website owners to declare approved sources of content that browsers should be allowed to load on that page — covered types are JavaScript, CSS, HTML frames, fonts, images and embeddable objects such as Java applets, ActiveX, audio and video files.

**Evidence:**
```
{
  "url": "https://gpt-2-22b6d.firebaseapp.com/?read=..%2F..%2F..%2Fetc%2Fpasswd"
}
```


#### INFO: Content Security Policy (CSP) Header Not Set

- **CWE:** CWE-693 (Unknown)
- **Tool:** browser-scanner

**Description:**
Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks, including Cross Site Scripting (XSS) and data injection attacks. These attacks are used for everything from data theft to site defacement or distribution of malware. CSP provides a set of standard HTTP headers that allow website owners to declare approved sources of content that browsers should be allowed to load on that page — covered types are JavaScript, CSS, HTML frames, fonts, images and embeddable objects such as Java applets, ActiveX, audio and video files.

**Evidence:**
```
{
  "url": "https://gpt-2-22b6d.firebaseapp.com/?read=..%5C..%5C..%5Cwindows%5Cwin.ini"
}
```


#### INFO: Content Security Policy (CSP) Header Not Set

- **CWE:** CWE-693 (Unknown)
- **Tool:** browser-scanner

**Description:**
Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks, including Cross Site Scripting (XSS) and data injection attacks. These attacks are used for everything from data theft to site defacement or distribution of malware. CSP provides a set of standard HTTP headers that allow website owners to declare approved sources of content that browsers should be allowed to load on that page — covered types are JavaScript, CSS, HTML frames, fonts, images and embeddable objects such as Java applets, ActiveX, audio and video files.

**Evidence:**
```
{
  "url": "https://gpt-2-22b6d.firebaseapp.com/?read=....%2F%2F....%2F%2F....%2F%2Fetc%2Fpasswd"
}
```


#### INFO: Content Security Policy (CSP) Header Not Set

- **CWE:** CWE-693 (Unknown)
- **Tool:** browser-scanner

**Description:**
Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks, including Cross Site Scripting (XSS) and data injection attacks. These attacks are used for everything from data theft to site defacement or distribution of malware. CSP provides a set of standard HTTP headers that allow website owners to declare approved sources of content that browsers should be allowed to load on that page — covered types are JavaScript, CSS, HTML frames, fonts, images and embeddable objects such as Java applets, ActiveX, audio and video files.

**Evidence:**
```
{
  "url": "https://gpt-2-22b6d.firebaseapp.com/?read=..%252f..%252f..%252fetc%2Fpasswd"
}
```


#### INFO: Content Security Policy (CSP) Header Not Set

- **CWE:** CWE-693 (Unknown)
- **Tool:** browser-scanner

**Description:**
Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks, including Cross Site Scripting (XSS) and data injection attacks. These attacks are used for everything from data theft to site defacement or distribution of malware. CSP provides a set of standard HTTP headers that allow website owners to declare approved sources of content that browsers should be allowed to load on that page — covered types are JavaScript, CSS, HTML frames, fonts, images and embeddable objects such as Java applets, ActiveX, audio and video files.

**Evidence:**
```
{
  "url": "https://gpt-2-22b6d.firebaseapp.com/images/app.js"
}
```


#### INFO: Content Security Policy (CSP) Header Not Set

- **CWE:** CWE-693 (Unknown)
- **Tool:** browser-scanner

**Description:**
Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks, including Cross Site Scripting (XSS) and data injection attacks. These attacks are used for everything from data theft to site defacement or distribution of malware. CSP provides a set of standard HTTP headers that allow website owners to declare approved sources of content that browsers should be allowed to load on that page — covered types are JavaScript, CSS, HTML frames, fonts, images and embeddable objects such as Java applets, ActiveX, audio and video files.

**Evidence:**
```
{
  "url": "https://gpt-2-22b6d.firebaseapp.com/images/"
}
```


#### INFO: Content Security Policy (CSP) Header Not Set

- **CWE:** CWE-693 (Unknown)
- **Tool:** browser-scanner

**Description:**
Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks, including Cross Site Scripting (XSS) and data injection attacks. These attacks are used for everything from data theft to site defacement or distribution of malware. CSP provides a set of standard HTTP headers that allow website owners to declare approved sources of content that browsers should be allowed to load on that page — covered types are JavaScript, CSS, HTML frames, fonts, images and embeddable objects such as Java applets, ActiveX, audio and video files.

**Evidence:**
```
{
  "url": "https://gpt-2-22b6d.firebaseapp.com/images/styles.css"
}
```


#### INFO: Content Security Policy (CSP) Header Not Set

- **CWE:** CWE-693 (Unknown)
- **Tool:** browser-scanner

**Description:**
Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks, including Cross Site Scripting (XSS) and data injection attacks. These attacks are used for everything from data theft to site defacement or distribution of malware. CSP provides a set of standard HTTP headers that allow website owners to declare approved sources of content that browsers should be allowed to load on that page — covered types are JavaScript, CSS, HTML frames, fonts, images and embeddable objects such as Java applets, ActiveX, audio and video files.

**Evidence:**
```
{
  "url": "https://gpt-2-22b6d.firebaseapp.com/uploads/"
}
```


#### INFO: Content Security Policy (CSP) Header Not Set

- **CWE:** CWE-693 (Unknown)
- **Tool:** browser-scanner

**Description:**
Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks, including Cross Site Scripting (XSS) and data injection attacks. These attacks are used for everything from data theft to site defacement or distribution of malware. CSP provides a set of standard HTTP headers that allow website owners to declare approved sources of content that browsers should be allowed to load on that page — covered types are JavaScript, CSS, HTML frames, fonts, images and embeddable objects such as Java applets, ActiveX, audio and video files.

**Evidence:**
```
{
  "url": "https://gpt-2-22b6d.firebaseapp.com/uploads/styles.css"
}
```


#### INFO: Content Security Policy (CSP) Header Not Set

- **CWE:** CWE-693 (Unknown)
- **Tool:** browser-scanner

**Description:**
Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks, including Cross Site Scripting (XSS) and data injection attacks. These attacks are used for everything from data theft to site defacement or distribution of malware. CSP provides a set of standard HTTP headers that allow website owners to declare approved sources of content that browsers should be allowed to load on that page — covered types are JavaScript, CSS, HTML frames, fonts, images and embeddable objects such as Java applets, ActiveX, audio and video files.

**Evidence:**
```
{
  "url": "https://gpt-2-22b6d.firebaseapp.com/uploads/app.js"
}
```


#### INFO: Content Security Policy (CSP) Header Not Set

- **CWE:** CWE-693 (Unknown)
- **Tool:** browser-scanner

**Description:**
Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks, including Cross Site Scripting (XSS) and data injection attacks. These attacks are used for everything from data theft to site defacement or distribution of malware. CSP provides a set of standard HTTP headers that allow website owners to declare approved sources of content that browsers should be allowed to load on that page — covered types are JavaScript, CSS, HTML frames, fonts, images and embeddable objects such as Java applets, ActiveX, audio and video files.

**Evidence:**
```
{
  "url": "https://gpt-2-22b6d.firebaseapp.com/files/styles.css"
}
```


#### INFO: Content Security Policy (CSP) Header Not Set

- **CWE:** CWE-693 (Unknown)
- **Tool:** browser-scanner

**Description:**
Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks, including Cross Site Scripting (XSS) and data injection attacks. These attacks are used for everything from data theft to site defacement or distribution of malware. CSP provides a set of standard HTTP headers that allow website owners to declare approved sources of content that browsers should be allowed to load on that page — covered types are JavaScript, CSS, HTML frames, fonts, images and embeddable objects such as Java applets, ActiveX, audio and video files.

**Evidence:**
```
{
  "url": "https://gpt-2-22b6d.firebaseapp.com/files/"
}
```


#### INFO: Content Security Policy (CSP) Header Not Set

- **CWE:** CWE-693 (Unknown)
- **Tool:** browser-scanner

**Description:**
Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks, including Cross Site Scripting (XSS) and data injection attacks. These attacks are used for everything from data theft to site defacement or distribution of malware. CSP provides a set of standard HTTP headers that allow website owners to declare approved sources of content that browsers should be allowed to load on that page — covered types are JavaScript, CSS, HTML frames, fonts, images and embeddable objects such as Java applets, ActiveX, audio and video files.

**Evidence:**
```
{
  "url": "https://gpt-2-22b6d.firebaseapp.com/files/app.js"
}
```


#### INFO: Content Security Policy (CSP) Header Not Set

- **CWE:** CWE-693 (Unknown)
- **Tool:** browser-scanner

**Description:**
Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks, including Cross Site Scripting (XSS) and data injection attacks. These attacks are used for everything from data theft to site defacement or distribution of malware. CSP provides a set of standard HTTP headers that allow website owners to declare approved sources of content that browsers should be allowed to load on that page — covered types are JavaScript, CSS, HTML frames, fonts, images and embeddable objects such as Java applets, ActiveX, audio and video files.

**Evidence:**
```
{
  "url": "https://gpt-2-22b6d.firebaseapp.com/assets/"
}
```


#### INFO: Content Security Policy (CSP) Header Not Set

- **CWE:** CWE-693 (Unknown)
- **Tool:** browser-scanner

**Description:**
Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks, including Cross Site Scripting (XSS) and data injection attacks. These attacks are used for everything from data theft to site defacement or distribution of malware. CSP provides a set of standard HTTP headers that allow website owners to declare approved sources of content that browsers should be allowed to load on that page — covered types are JavaScript, CSS, HTML frames, fonts, images and embeddable objects such as Java applets, ActiveX, audio and video files.

**Evidence:**
```
{
  "url": "https://gpt-2-22b6d.firebaseapp.com/assets/app.js"
}
```


#### INFO: Content Security Policy (CSP) Header Not Set

- **CWE:** CWE-693 (Unknown)
- **Tool:** browser-scanner

**Description:**
Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks, including Cross Site Scripting (XSS) and data injection attacks. These attacks are used for everything from data theft to site defacement or distribution of malware. CSP provides a set of standard HTTP headers that allow website owners to declare approved sources of content that browsers should be allowed to load on that page — covered types are JavaScript, CSS, HTML frames, fonts, images and embeddable objects such as Java applets, ActiveX, audio and video files.

**Evidence:**
```
{
  "url": "https://gpt-2-22b6d.firebaseapp.com/assets/styles.css"
}
```


#### INFO: Content Security Policy (CSP) Header Not Set

- **CWE:** CWE-693 (Unknown)
- **Tool:** browser-scanner

**Description:**
Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks, including Cross Site Scripting (XSS) and data injection attacks. These attacks are used for everything from data theft to site defacement or distribution of malware. CSP provides a set of standard HTTP headers that allow website owners to declare approved sources of content that browsers should be allowed to load on that page — covered types are JavaScript, CSS, HTML frames, fonts, images and embeddable objects such as Java applets, ActiveX, audio and video files.

**Evidence:**
```
{
  "url": "https://gpt-2-22b6d.firebaseapp.com/static/"
}
```


#### INFO: Content Security Policy (CSP) Header Not Set

- **CWE:** CWE-693 (Unknown)
- **Tool:** browser-scanner

**Description:**
Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks, including Cross Site Scripting (XSS) and data injection attacks. These attacks are used for everything from data theft to site defacement or distribution of malware. CSP provides a set of standard HTTP headers that allow website owners to declare approved sources of content that browsers should be allowed to load on that page — covered types are JavaScript, CSS, HTML frames, fonts, images and embeddable objects such as Java applets, ActiveX, audio and video files.

**Evidence:**
```
{
  "url": "https://gpt-2-22b6d.firebaseapp.com/static/app.js"
}
```


#### INFO: Content Security Policy (CSP) Header Not Set

- **CWE:** CWE-693 (Unknown)
- **Tool:** browser-scanner

**Description:**
Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks, including Cross Site Scripting (XSS) and data injection attacks. These attacks are used for everything from data theft to site defacement or distribution of malware. CSP provides a set of standard HTTP headers that allow website owners to declare approved sources of content that browsers should be allowed to load on that page — covered types are JavaScript, CSS, HTML frames, fonts, images and embeddable objects such as Java applets, ActiveX, audio and video files.

**Evidence:**
```
{
  "url": "https://gpt-2-22b6d.firebaseapp.com/static/styles.css"
}
```


#### INFO: Content Security Policy (CSP) Header Not Set

- **CWE:** CWE-693 (Unknown)
- **Tool:** browser-scanner

**Description:**
Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks, including Cross Site Scripting (XSS) and data injection attacks. These attacks are used for everything from data theft to site defacement or distribution of malware. CSP provides a set of standard HTTP headers that allow website owners to declare approved sources of content that browsers should be allowed to load on that page — covered types are JavaScript, CSS, HTML frames, fonts, images and embeddable objects such as Java applets, ActiveX, audio and video files.

**Evidence:**
```
{
  "url": "https://gpt-2-22b6d.firebaseapp.com/media/"
}
```


#### INFO: Content Security Policy (CSP) Header Not Set

- **CWE:** CWE-693 (Unknown)
- **Tool:** browser-scanner

**Description:**
Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks, including Cross Site Scripting (XSS) and data injection attacks. These attacks are used for everything from data theft to site defacement or distribution of malware. CSP provides a set of standard HTTP headers that allow website owners to declare approved sources of content that browsers should be allowed to load on that page — covered types are JavaScript, CSS, HTML frames, fonts, images and embeddable objects such as Java applets, ActiveX, audio and video files.

**Evidence:**
```
{
  "url": "https://gpt-2-22b6d.firebaseapp.com/media/styles.css"
}
```


#### INFO: Content Security Policy (CSP) Header Not Set

- **CWE:** CWE-693 (Unknown)
- **Tool:** browser-scanner

**Description:**
Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks, including Cross Site Scripting (XSS) and data injection attacks. These attacks are used for everything from data theft to site defacement or distribution of malware. CSP provides a set of standard HTTP headers that allow website owners to declare approved sources of content that browsers should be allowed to load on that page — covered types are JavaScript, CSS, HTML frames, fonts, images and embeddable objects such as Java applets, ActiveX, audio and video files.

**Evidence:**
```
{
  "url": "https://gpt-2-22b6d.firebaseapp.com/media/app.js"
}
```


#### INFO: Content Security Policy (CSP) Header Not Set

- **CWE:** CWE-693 (Unknown)
- **Tool:** browser-scanner

**Description:**
Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks, including Cross Site Scripting (XSS) and data injection attacks. These attacks are used for everything from data theft to site defacement or distribution of malware. CSP provides a set of standard HTTP headers that allow website owners to declare approved sources of content that browsers should be allowed to load on that page — covered types are JavaScript, CSS, HTML frames, fonts, images and embeddable objects such as Java applets, ActiveX, audio and video files.

**Evidence:**
```
{
  "url": "https://gpt-2-22b6d.firebaseapp.com/backup/"
}
```


#### INFO: Content Security Policy (CSP) Header Not Set

- **CWE:** CWE-693 (Unknown)
- **Tool:** browser-scanner

**Description:**
Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks, including Cross Site Scripting (XSS) and data injection attacks. These attacks are used for everything from data theft to site defacement or distribution of malware. CSP provides a set of standard HTTP headers that allow website owners to declare approved sources of content that browsers should be allowed to load on that page — covered types are JavaScript, CSS, HTML frames, fonts, images and embeddable objects such as Java applets, ActiveX, audio and video files.

**Evidence:**
```
{
  "url": "https://gpt-2-22b6d.firebaseapp.com/backup/styles.css"
}
```


#### INFO: Content Security Policy (CSP) Header Not Set

- **CWE:** CWE-693 (Unknown)
- **Tool:** browser-scanner

**Description:**
Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks, including Cross Site Scripting (XSS) and data injection attacks. These attacks are used for everything from data theft to site defacement or distribution of malware. CSP provides a set of standard HTTP headers that allow website owners to declare approved sources of content that browsers should be allowed to load on that page — covered types are JavaScript, CSS, HTML frames, fonts, images and embeddable objects such as Java applets, ActiveX, audio and video files.

**Evidence:**
```
{
  "url": "https://gpt-2-22b6d.firebaseapp.com/backup/app.js"
}
```


#### INFO: Content Security Policy (CSP) Header Not Set

- **CWE:** CWE-693 (Unknown)
- **Tool:** browser-scanner

**Description:**
Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks, including Cross Site Scripting (XSS) and data injection attacks. These attacks are used for everything from data theft to site defacement or distribution of malware. CSP provides a set of standard HTTP headers that allow website owners to declare approved sources of content that browsers should be allowed to load on that page — covered types are JavaScript, CSS, HTML frames, fonts, images and embeddable objects such as Java applets, ActiveX, audio and video files.

**Evidence:**
```
{
  "url": "https://gpt-2-22b6d.firebaseapp.com/logs/app.js"
}
```


#### INFO: Content Security Policy (CSP) Header Not Set

- **CWE:** CWE-693 (Unknown)
- **Tool:** browser-scanner

**Description:**
Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks, including Cross Site Scripting (XSS) and data injection attacks. These attacks are used for everything from data theft to site defacement or distribution of malware. CSP provides a set of standard HTTP headers that allow website owners to declare approved sources of content that browsers should be allowed to load on that page — covered types are JavaScript, CSS, HTML frames, fonts, images and embeddable objects such as Java applets, ActiveX, audio and video files.

**Evidence:**
```
{
  "url": "https://gpt-2-22b6d.firebaseapp.com/logs/"
}
```


#### INFO: Content Security Policy (CSP) Header Not Set

- **CWE:** CWE-693 (Unknown)
- **Tool:** browser-scanner

**Description:**
Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks, including Cross Site Scripting (XSS) and data injection attacks. These attacks are used for everything from data theft to site defacement or distribution of malware. CSP provides a set of standard HTTP headers that allow website owners to declare approved sources of content that browsers should be allowed to load on that page — covered types are JavaScript, CSS, HTML frames, fonts, images and embeddable objects such as Java applets, ActiveX, audio and video files.

**Evidence:**
```
{
  "url": "https://gpt-2-22b6d.firebaseapp.com/logs/styles.css"
}
```


#### INFO: Content Security Policy (CSP) Header Not Set

- **CWE:** CWE-693 (Unknown)
- **Tool:** browser-scanner

**Description:**
Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks, including Cross Site Scripting (XSS) and data injection attacks. These attacks are used for everything from data theft to site defacement or distribution of malware. CSP provides a set of standard HTTP headers that allow website owners to declare approved sources of content that browsers should be allowed to load on that page — covered types are JavaScript, CSS, HTML frames, fonts, images and embeddable objects such as Java applets, ActiveX, audio and video files.

**Evidence:**
```
{
  "url": "https://gpt-2-22b6d.firebaseapp.com/tmp/styles.css"
}
```


#### INFO: Content Security Policy (CSP) Header Not Set

- **CWE:** CWE-693 (Unknown)
- **Tool:** browser-scanner

**Description:**
Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks, including Cross Site Scripting (XSS) and data injection attacks. These attacks are used for everything from data theft to site defacement or distribution of malware. CSP provides a set of standard HTTP headers that allow website owners to declare approved sources of content that browsers should be allowed to load on that page — covered types are JavaScript, CSS, HTML frames, fonts, images and embeddable objects such as Java applets, ActiveX, audio and video files.

**Evidence:**
```
{
  "url": "https://gpt-2-22b6d.firebaseapp.com/tmp/app.js"
}
```


#### INFO: Content Security Policy (CSP) Header Not Set

- **CWE:** CWE-693 (Unknown)
- **Tool:** browser-scanner

**Description:**
Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks, including Cross Site Scripting (XSS) and data injection attacks. These attacks are used for everything from data theft to site defacement or distribution of malware. CSP provides a set of standard HTTP headers that allow website owners to declare approved sources of content that browsers should be allowed to load on that page — covered types are JavaScript, CSS, HTML frames, fonts, images and embeddable objects such as Java applets, ActiveX, audio and video files.

**Evidence:**
```
{
  "url": "https://gpt-2-22b6d.firebaseapp.com/tmp/"
}
```


#### INFO: Content Security Policy (CSP) Header Not Set

- **CWE:** CWE-693 (Unknown)
- **Tool:** browser-scanner

**Description:**
Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks, including Cross Site Scripting (XSS) and data injection attacks. These attacks are used for everything from data theft to site defacement or distribution of malware. CSP provides a set of standard HTTP headers that allow website owners to declare approved sources of content that browsers should be allowed to load on that page — covered types are JavaScript, CSS, HTML frames, fonts, images and embeddable objects such as Java applets, ActiveX, audio and video files.

**Evidence:**
```
{
  "url": "https://gpt-2-22b6d.firebaseapp.com/data/"
}
```


#### INFO: Content Security Policy (CSP) Header Not Set

- **CWE:** CWE-693 (Unknown)
- **Tool:** browser-scanner

**Description:**
Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks, including Cross Site Scripting (XSS) and data injection attacks. These attacks are used for everything from data theft to site defacement or distribution of malware. CSP provides a set of standard HTTP headers that allow website owners to declare approved sources of content that browsers should be allowed to load on that page — covered types are JavaScript, CSS, HTML frames, fonts, images and embeddable objects such as Java applets, ActiveX, audio and video files.

**Evidence:**
```
{
  "url": "https://gpt-2-22b6d.firebaseapp.com/data/styles.css"
}
```


#### INFO: Content Security Policy (CSP) Header Not Set

- **CWE:** CWE-693 (Unknown)
- **Tool:** browser-scanner

**Description:**
Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks, including Cross Site Scripting (XSS) and data injection attacks. These attacks are used for everything from data theft to site defacement or distribution of malware. CSP provides a set of standard HTTP headers that allow website owners to declare approved sources of content that browsers should be allowed to load on that page — covered types are JavaScript, CSS, HTML frames, fonts, images and embeddable objects such as Java applets, ActiveX, audio and video files.

**Evidence:**
```
{
  "url": "https://gpt-2-22b6d.firebaseapp.com/data/app.js"
}
```


#### INFO: Content Security Policy (CSP) Header Not Set

- **CWE:** CWE-693 (Unknown)
- **Tool:** browser-scanner

**Description:**
Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks, including Cross Site Scripting (XSS) and data injection attacks. These attacks are used for everything from data theft to site defacement or distribution of malware. CSP provides a set of standard HTTP headers that allow website owners to declare approved sources of content that browsers should be allowed to load on that page — covered types are JavaScript, CSS, HTML frames, fonts, images and embeddable objects such as Java applets, ActiveX, audio and video files.

**Evidence:**
```
{
  "url": "https://gpt-2-22b6d.firebaseapp.com/admin"
}
```


#### INFO: Content Security Policy (CSP) Header Not Set

- **CWE:** CWE-693 (Unknown)
- **Tool:** browser-scanner

**Description:**
Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks, including Cross Site Scripting (XSS) and data injection attacks. These attacks are used for everything from data theft to site defacement or distribution of malware. CSP provides a set of standard HTTP headers that allow website owners to declare approved sources of content that browsers should be allowed to load on that page — covered types are JavaScript, CSS, HTML frames, fonts, images and embeddable objects such as Java applets, ActiveX, audio and video files.

**Evidence:**
```
{
  "url": "https://gpt-2-22b6d.firebaseapp.com/admin/"
}
```


#### INFO: Content Security Policy (CSP) Header Not Set

- **CWE:** CWE-693 (Unknown)
- **Tool:** browser-scanner

**Description:**
Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks, including Cross Site Scripting (XSS) and data injection attacks. These attacks are used for everything from data theft to site defacement or distribution of malware. CSP provides a set of standard HTTP headers that allow website owners to declare approved sources of content that browsers should be allowed to load on that page — covered types are JavaScript, CSS, HTML frames, fonts, images and embeddable objects such as Java applets, ActiveX, audio and video files.

**Evidence:**
```
{
  "url": "https://gpt-2-22b6d.firebaseapp.com/admin/app.js"
}
```


#### INFO: Content Security Policy (CSP) Header Not Set

- **CWE:** CWE-693 (Unknown)
- **Tool:** browser-scanner

**Description:**
Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks, including Cross Site Scripting (XSS) and data injection attacks. These attacks are used for everything from data theft to site defacement or distribution of malware. CSP provides a set of standard HTTP headers that allow website owners to declare approved sources of content that browsers should be allowed to load on that page — covered types are JavaScript, CSS, HTML frames, fonts, images and embeddable objects such as Java applets, ActiveX, audio and video files.

**Evidence:**
```
{
  "url": "https://gpt-2-22b6d.firebaseapp.com/admin/styles.css"
}
```


#### INFO: Content Security Policy (CSP) Header Not Set

- **CWE:** CWE-693 (Unknown)
- **Tool:** browser-scanner

**Description:**
Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks, including Cross Site Scripting (XSS) and data injection attacks. These attacks are used for everything from data theft to site defacement or distribution of malware. CSP provides a set of standard HTTP headers that allow website owners to declare approved sources of content that browsers should be allowed to load on that page — covered types are JavaScript, CSS, HTML frames, fonts, images and embeddable objects such as Java applets, ActiveX, audio and video files.

**Evidence:**
```
{
  "url": "https://gpt-2-22b6d.firebaseapp.com/admin/dashboard"
}
```


#### INFO: Content Security Policy (CSP) Header Not Set

- **CWE:** CWE-693 (Unknown)
- **Tool:** browser-scanner

**Description:**
Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks, including Cross Site Scripting (XSS) and data injection attacks. These attacks are used for everything from data theft to site defacement or distribution of malware. CSP provides a set of standard HTTP headers that allow website owners to declare approved sources of content that browsers should be allowed to load on that page — covered types are JavaScript, CSS, HTML frames, fonts, images and embeddable objects such as Java applets, ActiveX, audio and video files.

**Evidence:**
```
{
  "url": "https://gpt-2-22b6d.firebaseapp.com/admin/users"
}
```


#### INFO: Content Security Policy (CSP) Header Not Set

- **CWE:** CWE-693 (Unknown)
- **Tool:** browser-scanner

**Description:**
Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks, including Cross Site Scripting (XSS) and data injection attacks. These attacks are used for everything from data theft to site defacement or distribution of malware. CSP provides a set of standard HTTP headers that allow website owners to declare approved sources of content that browsers should be allowed to load on that page — covered types are JavaScript, CSS, HTML frames, fonts, images and embeddable objects such as Java applets, ActiveX, audio and video files.

**Evidence:**
```
{
  "url": "https://gpt-2-22b6d.firebaseapp.com/admin/settings"
}
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
  "url": "https://gpt-2-22b6d.firebaseapp.com/administrator",
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
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js\"></script>",
  "url": "https://gpt-2-22b6d.firebaseapp.com/",
  "type": "ZAP-10017"
}
```


#### INFO: Cross-Domain JavaScript Source File Inclusion

- **CWE:** CWE-829 (Unknown)
- **Tool:** browser-scanner

**Description:**
The page includes one or more script files from a third-party domain.

**Evidence:**
```
{
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js\"></script>",
  "url": "https://gpt-2-22b6d.firebaseapp.com/home",
  "type": "ZAP-10017"
}
```


#### INFO: Cross-Domain JavaScript Source File Inclusion

- **CWE:** CWE-829 (Unknown)
- **Tool:** browser-scanner

**Description:**
The page includes one or more script files from a third-party domain.

**Evidence:**
```
{
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js\"></script>",
  "url": "https://gpt-2-22b6d.firebaseapp.com/profile",
  "type": "ZAP-10017"
}
```


#### INFO: Cross-Domain JavaScript Source File Inclusion

- **CWE:** CWE-829 (Unknown)
- **Tool:** browser-scanner

**Description:**
The page includes one or more script files from a third-party domain.

**Evidence:**
```
{
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js\"></script>",
  "url": "https://gpt-2-22b6d.firebaseapp.com/settings",
  "type": "ZAP-10017"
}
```


#### INFO: Cross-Domain JavaScript Source File Inclusion

- **CWE:** CWE-829 (Unknown)
- **Tool:** browser-scanner

**Description:**
The page includes one or more script files from a third-party domain.

**Evidence:**
```
{
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js\"></script>",
  "url": "https://gpt-2-22b6d.firebaseapp.com/posts",
  "type": "ZAP-10017"
}
```


#### INFO: Cross-Domain JavaScript Source File Inclusion

- **CWE:** CWE-829 (Unknown)
- **Tool:** browser-scanner

**Description:**
The page includes one or more script files from a third-party domain.

**Evidence:**
```
{
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js\"></script>",
  "url": "https://gpt-2-22b6d.firebaseapp.com/messages",
  "type": "ZAP-10017"
}
```


#### INFO: Cross-Domain JavaScript Source File Inclusion

- **CWE:** CWE-829 (Unknown)
- **Tool:** browser-scanner

**Description:**
The page includes one or more script files from a third-party domain.

**Evidence:**
```
{
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js\"></script>",
  "url": "https://gpt-2-22b6d.firebaseapp.com/feed",
  "type": "ZAP-10017"
}
```


#### INFO: Cross-Domain JavaScript Source File Inclusion

- **CWE:** CWE-829 (Unknown)
- **Tool:** browser-scanner

**Description:**
The page includes one or more script files from a third-party domain.

**Evidence:**
```
{
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js\"></script>",
  "url": "https://gpt-2-22b6d.firebaseapp.com/__nonexistent__1765813078782_e1794ca5e1b25",
  "type": "ZAP-10017"
}
```


#### INFO: Cross-Domain JavaScript Source File Inclusion

- **CWE:** CWE-829 (Unknown)
- **Tool:** browser-scanner

**Description:**
The page includes one or more script files from a third-party domain.

**Evidence:**
```
{
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js\"></script>",
  "url": "https://gpt-2-22b6d.firebaseapp.com/?file=..%2F..%2F..%2Fetc%2Fpasswd",
  "type": "ZAP-10017"
}
```


#### INFO: Cross-Domain JavaScript Source File Inclusion

- **CWE:** CWE-829 (Unknown)
- **Tool:** browser-scanner

**Description:**
The page includes one or more script files from a third-party domain.

**Evidence:**
```
{
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js\"></script>",
  "url": "https://gpt-2-22b6d.firebaseapp.com/?file=..%5C..%5C..%5Cwindows%5Cwin.ini",
  "type": "ZAP-10017"
}
```


#### INFO: Cross-Domain JavaScript Source File Inclusion

- **CWE:** CWE-829 (Unknown)
- **Tool:** browser-scanner

**Description:**
The page includes one or more script files from a third-party domain.

**Evidence:**
```
{
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js\"></script>",
  "url": "https://gpt-2-22b6d.firebaseapp.com/?file=....%2F%2F....%2F%2F....%2F%2Fetc%2Fpasswd",
  "type": "ZAP-10017"
}
```


#### INFO: Cross-Domain JavaScript Source File Inclusion

- **CWE:** CWE-829 (Unknown)
- **Tool:** browser-scanner

**Description:**
The page includes one or more script files from a third-party domain.

**Evidence:**
```
{
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js\"></script>",
  "url": "https://gpt-2-22b6d.firebaseapp.com/?file=..%252f..%252f..%252fetc%2Fpasswd",
  "type": "ZAP-10017"
}
```


#### INFO: Cross-Domain JavaScript Source File Inclusion

- **CWE:** CWE-829 (Unknown)
- **Tool:** browser-scanner

**Description:**
The page includes one or more script files from a third-party domain.

**Evidence:**
```
{
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js\"></script>",
  "url": "https://gpt-2-22b6d.firebaseapp.com/?path=..%2F..%2F..%2Fetc%2Fpasswd",
  "type": "ZAP-10017"
}
```


#### INFO: Cross-Domain JavaScript Source File Inclusion

- **CWE:** CWE-829 (Unknown)
- **Tool:** browser-scanner

**Description:**
The page includes one or more script files from a third-party domain.

**Evidence:**
```
{
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js\"></script>",
  "url": "https://gpt-2-22b6d.firebaseapp.com/?path=..%5C..%5C..%5Cwindows%5Cwin.ini",
  "type": "ZAP-10017"
}
```


#### INFO: Cross-Domain JavaScript Source File Inclusion

- **CWE:** CWE-829 (Unknown)
- **Tool:** browser-scanner

**Description:**
The page includes one or more script files from a third-party domain.

**Evidence:**
```
{
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js\"></script>",
  "url": "https://gpt-2-22b6d.firebaseapp.com/?path=....%2F%2F....%2F%2F....%2F%2Fetc%2Fpasswd",
  "type": "ZAP-10017"
}
```


#### INFO: Cross-Domain JavaScript Source File Inclusion

- **CWE:** CWE-829 (Unknown)
- **Tool:** browser-scanner

**Description:**
The page includes one or more script files from a third-party domain.

**Evidence:**
```
{
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js\"></script>",
  "url": "https://gpt-2-22b6d.firebaseapp.com/?path=..%252f..%252f..%252fetc%2Fpasswd",
  "type": "ZAP-10017"
}
```


#### INFO: Cross-Domain JavaScript Source File Inclusion

- **CWE:** CWE-829 (Unknown)
- **Tool:** browser-scanner

**Description:**
The page includes one or more script files from a third-party domain.

**Evidence:**
```
{
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js\"></script>",
  "url": "https://gpt-2-22b6d.firebaseapp.com/?filepath=..%2F..%2F..%2Fetc%2Fpasswd",
  "type": "ZAP-10017"
}
```


#### INFO: Cross-Domain JavaScript Source File Inclusion

- **CWE:** CWE-829 (Unknown)
- **Tool:** browser-scanner

**Description:**
The page includes one or more script files from a third-party domain.

**Evidence:**
```
{
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js\"></script>",
  "url": "https://gpt-2-22b6d.firebaseapp.com/?filepath=..%5C..%5C..%5Cwindows%5Cwin.ini",
  "type": "ZAP-10017"
}
```


#### INFO: Cross-Domain JavaScript Source File Inclusion

- **CWE:** CWE-829 (Unknown)
- **Tool:** browser-scanner

**Description:**
The page includes one or more script files from a third-party domain.

**Evidence:**
```
{
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js\"></script>",
  "url": "https://gpt-2-22b6d.firebaseapp.com/?filepath=....%2F%2F....%2F%2F....%2F%2Fetc%2Fpasswd",
  "type": "ZAP-10017"
}
```


#### INFO: Cross-Domain JavaScript Source File Inclusion

- **CWE:** CWE-829 (Unknown)
- **Tool:** browser-scanner

**Description:**
The page includes one or more script files from a third-party domain.

**Evidence:**
```
{
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js\"></script>",
  "url": "https://gpt-2-22b6d.firebaseapp.com/?filepath=..%252f..%252f..%252fetc%2Fpasswd",
  "type": "ZAP-10017"
}
```


#### INFO: Cross-Domain JavaScript Source File Inclusion

- **CWE:** CWE-829 (Unknown)
- **Tool:** browser-scanner

**Description:**
The page includes one or more script files from a third-party domain.

**Evidence:**
```
{
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js\"></script>",
  "url": "https://gpt-2-22b6d.firebaseapp.com/?document=..%2F..%2F..%2Fetc%2Fpasswd",
  "type": "ZAP-10017"
}
```


#### INFO: Cross-Domain JavaScript Source File Inclusion

- **CWE:** CWE-829 (Unknown)
- **Tool:** browser-scanner

**Description:**
The page includes one or more script files from a third-party domain.

**Evidence:**
```
{
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js\"></script>",
  "url": "https://gpt-2-22b6d.firebaseapp.com/?document=..%5C..%5C..%5Cwindows%5Cwin.ini",
  "type": "ZAP-10017"
}
```


#### INFO: Cross-Domain JavaScript Source File Inclusion

- **CWE:** CWE-829 (Unknown)
- **Tool:** browser-scanner

**Description:**
The page includes one or more script files from a third-party domain.

**Evidence:**
```
{
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js\"></script>",
  "url": "https://gpt-2-22b6d.firebaseapp.com/?document=....%2F%2F....%2F%2F....%2F%2Fetc%2Fpasswd",
  "type": "ZAP-10017"
}
```


#### INFO: Cross-Domain JavaScript Source File Inclusion

- **CWE:** CWE-829 (Unknown)
- **Tool:** browser-scanner

**Description:**
The page includes one or more script files from a third-party domain.

**Evidence:**
```
{
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js\"></script>",
  "url": "https://gpt-2-22b6d.firebaseapp.com/?document=..%252f..%252f..%252fetc%2Fpasswd",
  "type": "ZAP-10017"
}
```


#### INFO: Cross-Domain JavaScript Source File Inclusion

- **CWE:** CWE-829 (Unknown)
- **Tool:** browser-scanner

**Description:**
The page includes one or more script files from a third-party domain.

**Evidence:**
```
{
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js\"></script>",
  "url": "https://gpt-2-22b6d.firebaseapp.com/?doc=..%2F..%2F..%2Fetc%2Fpasswd",
  "type": "ZAP-10017"
}
```


#### INFO: Cross-Domain JavaScript Source File Inclusion

- **CWE:** CWE-829 (Unknown)
- **Tool:** browser-scanner

**Description:**
The page includes one or more script files from a third-party domain.

**Evidence:**
```
{
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js\"></script>",
  "url": "https://gpt-2-22b6d.firebaseapp.com/?doc=..%5C..%5C..%5Cwindows%5Cwin.ini",
  "type": "ZAP-10017"
}
```


#### INFO: Cross-Domain JavaScript Source File Inclusion

- **CWE:** CWE-829 (Unknown)
- **Tool:** browser-scanner

**Description:**
The page includes one or more script files from a third-party domain.

**Evidence:**
```
{
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js\"></script>",
  "url": "https://gpt-2-22b6d.firebaseapp.com/?doc=....%2F%2F....%2F%2F....%2F%2Fetc%2Fpasswd",
  "type": "ZAP-10017"
}
```


#### INFO: Cross-Domain JavaScript Source File Inclusion

- **CWE:** CWE-829 (Unknown)
- **Tool:** browser-scanner

**Description:**
The page includes one or more script files from a third-party domain.

**Evidence:**
```
{
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js\"></script>",
  "url": "https://gpt-2-22b6d.firebaseapp.com/?doc=..%252f..%252f..%252fetc%2Fpasswd",
  "type": "ZAP-10017"
}
```


#### INFO: Cross-Domain JavaScript Source File Inclusion

- **CWE:** CWE-829 (Unknown)
- **Tool:** browser-scanner

**Description:**
The page includes one or more script files from a third-party domain.

**Evidence:**
```
{
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js\"></script>",
  "url": "https://gpt-2-22b6d.firebaseapp.com/?page=..%2F..%2F..%2Fetc%2Fpasswd",
  "type": "ZAP-10017"
}
```


#### INFO: Cross-Domain JavaScript Source File Inclusion

- **CWE:** CWE-829 (Unknown)
- **Tool:** browser-scanner

**Description:**
The page includes one or more script files from a third-party domain.

**Evidence:**
```
{
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js\"></script>",
  "url": "https://gpt-2-22b6d.firebaseapp.com/?page=..%5C..%5C..%5Cwindows%5Cwin.ini",
  "type": "ZAP-10017"
}
```


#### INFO: Cross-Domain JavaScript Source File Inclusion

- **CWE:** CWE-829 (Unknown)
- **Tool:** browser-scanner

**Description:**
The page includes one or more script files from a third-party domain.

**Evidence:**
```
{
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js\"></script>",
  "url": "https://gpt-2-22b6d.firebaseapp.com/?page=....%2F%2F....%2F%2F....%2F%2Fetc%2Fpasswd",
  "type": "ZAP-10017"
}
```


#### INFO: Cross-Domain JavaScript Source File Inclusion

- **CWE:** CWE-829 (Unknown)
- **Tool:** browser-scanner

**Description:**
The page includes one or more script files from a third-party domain.

**Evidence:**
```
{
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js\"></script>",
  "url": "https://gpt-2-22b6d.firebaseapp.com/?page=..%252f..%252f..%252fetc%2Fpasswd",
  "type": "ZAP-10017"
}
```


#### INFO: Cross-Domain JavaScript Source File Inclusion

- **CWE:** CWE-829 (Unknown)
- **Tool:** browser-scanner

**Description:**
The page includes one or more script files from a third-party domain.

**Evidence:**
```
{
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js\"></script>",
  "url": "https://gpt-2-22b6d.firebaseapp.com/?template=..%2F..%2F..%2Fetc%2Fpasswd",
  "type": "ZAP-10017"
}
```


#### INFO: Cross-Domain JavaScript Source File Inclusion

- **CWE:** CWE-829 (Unknown)
- **Tool:** browser-scanner

**Description:**
The page includes one or more script files from a third-party domain.

**Evidence:**
```
{
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js\"></script>",
  "url": "https://gpt-2-22b6d.firebaseapp.com/?template=..%5C..%5C..%5Cwindows%5Cwin.ini",
  "type": "ZAP-10017"
}
```


#### INFO: Cross-Domain JavaScript Source File Inclusion

- **CWE:** CWE-829 (Unknown)
- **Tool:** browser-scanner

**Description:**
The page includes one or more script files from a third-party domain.

**Evidence:**
```
{
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js\"></script>",
  "url": "https://gpt-2-22b6d.firebaseapp.com/?template=....%2F%2F....%2F%2F....%2F%2Fetc%2Fpasswd",
  "type": "ZAP-10017"
}
```


#### INFO: Cross-Domain JavaScript Source File Inclusion

- **CWE:** CWE-829 (Unknown)
- **Tool:** browser-scanner

**Description:**
The page includes one or more script files from a third-party domain.

**Evidence:**
```
{
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js\"></script>",
  "url": "https://gpt-2-22b6d.firebaseapp.com/?template=..%252f..%252f..%252fetc%2Fpasswd",
  "type": "ZAP-10017"
}
```


#### INFO: Cross-Domain JavaScript Source File Inclusion

- **CWE:** CWE-829 (Unknown)
- **Tool:** browser-scanner

**Description:**
The page includes one or more script files from a third-party domain.

**Evidence:**
```
{
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js\"></script>",
  "url": "https://gpt-2-22b6d.firebaseapp.com/?include=..%2F..%2F..%2Fetc%2Fpasswd",
  "type": "ZAP-10017"
}
```


#### INFO: Cross-Domain JavaScript Source File Inclusion

- **CWE:** CWE-829 (Unknown)
- **Tool:** browser-scanner

**Description:**
The page includes one or more script files from a third-party domain.

**Evidence:**
```
{
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js\"></script>",
  "url": "https://gpt-2-22b6d.firebaseapp.com/?include=..%5C..%5C..%5Cwindows%5Cwin.ini",
  "type": "ZAP-10017"
}
```


#### INFO: Cross-Domain JavaScript Source File Inclusion

- **CWE:** CWE-829 (Unknown)
- **Tool:** browser-scanner

**Description:**
The page includes one or more script files from a third-party domain.

**Evidence:**
```
{
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js\"></script>",
  "url": "https://gpt-2-22b6d.firebaseapp.com/?include=....%2F%2F....%2F%2F....%2F%2Fetc%2Fpasswd",
  "type": "ZAP-10017"
}
```


#### INFO: Cross-Domain JavaScript Source File Inclusion

- **CWE:** CWE-829 (Unknown)
- **Tool:** browser-scanner

**Description:**
The page includes one or more script files from a third-party domain.

**Evidence:**
```
{
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js\"></script>",
  "url": "https://gpt-2-22b6d.firebaseapp.com/?include=..%252f..%252f..%252fetc%2Fpasswd",
  "type": "ZAP-10017"
}
```


#### INFO: Cross-Domain JavaScript Source File Inclusion

- **CWE:** CWE-829 (Unknown)
- **Tool:** browser-scanner

**Description:**
The page includes one or more script files from a third-party domain.

**Evidence:**
```
{
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js\"></script>",
  "url": "https://gpt-2-22b6d.firebaseapp.com/?dir=..%2F..%2F..%2Fetc%2Fpasswd",
  "type": "ZAP-10017"
}
```


#### INFO: Cross-Domain JavaScript Source File Inclusion

- **CWE:** CWE-829 (Unknown)
- **Tool:** browser-scanner

**Description:**
The page includes one or more script files from a third-party domain.

**Evidence:**
```
{
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js\"></script>",
  "url": "https://gpt-2-22b6d.firebaseapp.com/?dir=..%5C..%5C..%5Cwindows%5Cwin.ini",
  "type": "ZAP-10017"
}
```


#### INFO: Cross-Domain JavaScript Source File Inclusion

- **CWE:** CWE-829 (Unknown)
- **Tool:** browser-scanner

**Description:**
The page includes one or more script files from a third-party domain.

**Evidence:**
```
{
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js\"></script>",
  "url": "https://gpt-2-22b6d.firebaseapp.com/?dir=....%2F%2F....%2F%2F....%2F%2Fetc%2Fpasswd",
  "type": "ZAP-10017"
}
```


#### INFO: Cross-Domain JavaScript Source File Inclusion

- **CWE:** CWE-829 (Unknown)
- **Tool:** browser-scanner

**Description:**
The page includes one or more script files from a third-party domain.

**Evidence:**
```
{
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js\"></script>",
  "url": "https://gpt-2-22b6d.firebaseapp.com/?dir=..%252f..%252f..%252fetc%2Fpasswd",
  "type": "ZAP-10017"
}
```


#### INFO: Cross-Domain JavaScript Source File Inclusion

- **CWE:** CWE-829 (Unknown)
- **Tool:** browser-scanner

**Description:**
The page includes one or more script files from a third-party domain.

**Evidence:**
```
{
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js\"></script>",
  "url": "https://gpt-2-22b6d.firebaseapp.com/?folder=..%2F..%2F..%2Fetc%2Fpasswd",
  "type": "ZAP-10017"
}
```


#### INFO: Cross-Domain JavaScript Source File Inclusion

- **CWE:** CWE-829 (Unknown)
- **Tool:** browser-scanner

**Description:**
The page includes one or more script files from a third-party domain.

**Evidence:**
```
{
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js\"></script>",
  "url": "https://gpt-2-22b6d.firebaseapp.com/?folder=..%5C..%5C..%5Cwindows%5Cwin.ini",
  "type": "ZAP-10017"
}
```


#### INFO: Cross-Domain JavaScript Source File Inclusion

- **CWE:** CWE-829 (Unknown)
- **Tool:** browser-scanner

**Description:**
The page includes one or more script files from a third-party domain.

**Evidence:**
```
{
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js\"></script>",
  "url": "https://gpt-2-22b6d.firebaseapp.com/?folder=....%2F%2F....%2F%2F....%2F%2Fetc%2Fpasswd",
  "type": "ZAP-10017"
}
```


#### INFO: Cross-Domain JavaScript Source File Inclusion

- **CWE:** CWE-829 (Unknown)
- **Tool:** browser-scanner

**Description:**
The page includes one or more script files from a third-party domain.

**Evidence:**
```
{
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js\"></script>",
  "url": "https://gpt-2-22b6d.firebaseapp.com/?folder=..%252f..%252f..%252fetc%2Fpasswd",
  "type": "ZAP-10017"
}
```


#### INFO: Cross-Domain JavaScript Source File Inclusion

- **CWE:** CWE-829 (Unknown)
- **Tool:** browser-scanner

**Description:**
The page includes one or more script files from a third-party domain.

**Evidence:**
```
{
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js\"></script>",
  "url": "https://gpt-2-22b6d.firebaseapp.com/?load=..%2F..%2F..%2Fetc%2Fpasswd",
  "type": "ZAP-10017"
}
```


#### INFO: Cross-Domain JavaScript Source File Inclusion

- **CWE:** CWE-829 (Unknown)
- **Tool:** browser-scanner

**Description:**
The page includes one or more script files from a third-party domain.

**Evidence:**
```
{
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js\"></script>",
  "url": "https://gpt-2-22b6d.firebaseapp.com/?load=..%5C..%5C..%5Cwindows%5Cwin.ini",
  "type": "ZAP-10017"
}
```


#### INFO: Cross-Domain JavaScript Source File Inclusion

- **CWE:** CWE-829 (Unknown)
- **Tool:** browser-scanner

**Description:**
The page includes one or more script files from a third-party domain.

**Evidence:**
```
{
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js\"></script>",
  "url": "https://gpt-2-22b6d.firebaseapp.com/?load=....%2F%2F....%2F%2F....%2F%2Fetc%2Fpasswd",
  "type": "ZAP-10017"
}
```


#### INFO: Cross-Domain JavaScript Source File Inclusion

- **CWE:** CWE-829 (Unknown)
- **Tool:** browser-scanner

**Description:**
The page includes one or more script files from a third-party domain.

**Evidence:**
```
{
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js\"></script>",
  "url": "https://gpt-2-22b6d.firebaseapp.com/?load=..%252f..%252f..%252fetc%2Fpasswd",
  "type": "ZAP-10017"
}
```


#### INFO: Cross-Domain JavaScript Source File Inclusion

- **CWE:** CWE-829 (Unknown)
- **Tool:** browser-scanner

**Description:**
The page includes one or more script files from a third-party domain.

**Evidence:**
```
{
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js\"></script>",
  "url": "https://gpt-2-22b6d.firebaseapp.com/?read=..%2F..%2F..%2Fetc%2Fpasswd",
  "type": "ZAP-10017"
}
```


#### INFO: Cross-Domain JavaScript Source File Inclusion

- **CWE:** CWE-829 (Unknown)
- **Tool:** browser-scanner

**Description:**
The page includes one or more script files from a third-party domain.

**Evidence:**
```
{
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js\"></script>",
  "url": "https://gpt-2-22b6d.firebaseapp.com/?read=..%5C..%5C..%5Cwindows%5Cwin.ini",
  "type": "ZAP-10017"
}
```


#### INFO: Cross-Domain JavaScript Source File Inclusion

- **CWE:** CWE-829 (Unknown)
- **Tool:** browser-scanner

**Description:**
The page includes one or more script files from a third-party domain.

**Evidence:**
```
{
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js\"></script>",
  "url": "https://gpt-2-22b6d.firebaseapp.com/?read=....%2F%2F....%2F%2F....%2F%2Fetc%2Fpasswd",
  "type": "ZAP-10017"
}
```


#### INFO: Cross-Domain JavaScript Source File Inclusion

- **CWE:** CWE-829 (Unknown)
- **Tool:** browser-scanner

**Description:**
The page includes one or more script files from a third-party domain.

**Evidence:**
```
{
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js\"></script>",
  "url": "https://gpt-2-22b6d.firebaseapp.com/?read=..%252f..%252f..%252fetc%2Fpasswd",
  "type": "ZAP-10017"
}
```


#### INFO: Cross-Domain JavaScript Source File Inclusion

- **CWE:** CWE-829 (Unknown)
- **Tool:** browser-scanner

**Description:**
The page includes one or more script files from a third-party domain.

**Evidence:**
```
{
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js\"></script>",
  "url": "https://gpt-2-22b6d.firebaseapp.com/images/app.js",
  "type": "ZAP-10017"
}
```


#### INFO: Cross-Domain JavaScript Source File Inclusion

- **CWE:** CWE-829 (Unknown)
- **Tool:** browser-scanner

**Description:**
The page includes one or more script files from a third-party domain.

**Evidence:**
```
{
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js\"></script>",
  "url": "https://gpt-2-22b6d.firebaseapp.com/images/",
  "type": "ZAP-10017"
}
```


#### INFO: Cross-Domain JavaScript Source File Inclusion

- **CWE:** CWE-829 (Unknown)
- **Tool:** browser-scanner

**Description:**
The page includes one or more script files from a third-party domain.

**Evidence:**
```
{
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js\"></script>",
  "url": "https://gpt-2-22b6d.firebaseapp.com/images/styles.css",
  "type": "ZAP-10017"
}
```


#### INFO: Cross-Domain JavaScript Source File Inclusion

- **CWE:** CWE-829 (Unknown)
- **Tool:** browser-scanner

**Description:**
The page includes one or more script files from a third-party domain.

**Evidence:**
```
{
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js\"></script>",
  "url": "https://gpt-2-22b6d.firebaseapp.com/uploads/",
  "type": "ZAP-10017"
}
```


#### INFO: Cross-Domain JavaScript Source File Inclusion

- **CWE:** CWE-829 (Unknown)
- **Tool:** browser-scanner

**Description:**
The page includes one or more script files from a third-party domain.

**Evidence:**
```
{
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js\"></script>",
  "url": "https://gpt-2-22b6d.firebaseapp.com/uploads/styles.css",
  "type": "ZAP-10017"
}
```


#### INFO: Cross-Domain JavaScript Source File Inclusion

- **CWE:** CWE-829 (Unknown)
- **Tool:** browser-scanner

**Description:**
The page includes one or more script files from a third-party domain.

**Evidence:**
```
{
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js\"></script>",
  "url": "https://gpt-2-22b6d.firebaseapp.com/uploads/app.js",
  "type": "ZAP-10017"
}
```


#### INFO: Cross-Domain JavaScript Source File Inclusion

- **CWE:** CWE-829 (Unknown)
- **Tool:** browser-scanner

**Description:**
The page includes one or more script files from a third-party domain.

**Evidence:**
```
{
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js\"></script>",
  "url": "https://gpt-2-22b6d.firebaseapp.com/files/styles.css",
  "type": "ZAP-10017"
}
```


#### INFO: Cross-Domain JavaScript Source File Inclusion

- **CWE:** CWE-829 (Unknown)
- **Tool:** browser-scanner

**Description:**
The page includes one or more script files from a third-party domain.

**Evidence:**
```
{
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js\"></script>",
  "url": "https://gpt-2-22b6d.firebaseapp.com/files/",
  "type": "ZAP-10017"
}
```


#### INFO: Cross-Domain JavaScript Source File Inclusion

- **CWE:** CWE-829 (Unknown)
- **Tool:** browser-scanner

**Description:**
The page includes one or more script files from a third-party domain.

**Evidence:**
```
{
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js\"></script>",
  "url": "https://gpt-2-22b6d.firebaseapp.com/files/app.js",
  "type": "ZAP-10017"
}
```


#### INFO: Cross-Domain JavaScript Source File Inclusion

- **CWE:** CWE-829 (Unknown)
- **Tool:** browser-scanner

**Description:**
The page includes one or more script files from a third-party domain.

**Evidence:**
```
{
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js\"></script>",
  "url": "https://gpt-2-22b6d.firebaseapp.com/assets/",
  "type": "ZAP-10017"
}
```


#### INFO: Cross-Domain JavaScript Source File Inclusion

- **CWE:** CWE-829 (Unknown)
- **Tool:** browser-scanner

**Description:**
The page includes one or more script files from a third-party domain.

**Evidence:**
```
{
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js\"></script>",
  "url": "https://gpt-2-22b6d.firebaseapp.com/assets/app.js",
  "type": "ZAP-10017"
}
```


#### INFO: Cross-Domain JavaScript Source File Inclusion

- **CWE:** CWE-829 (Unknown)
- **Tool:** browser-scanner

**Description:**
The page includes one or more script files from a third-party domain.

**Evidence:**
```
{
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js\"></script>",
  "url": "https://gpt-2-22b6d.firebaseapp.com/assets/styles.css",
  "type": "ZAP-10017"
}
```


#### INFO: Cross-Domain JavaScript Source File Inclusion

- **CWE:** CWE-829 (Unknown)
- **Tool:** browser-scanner

**Description:**
The page includes one or more script files from a third-party domain.

**Evidence:**
```
{
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js\"></script>",
  "url": "https://gpt-2-22b6d.firebaseapp.com/static/",
  "type": "ZAP-10017"
}
```


#### INFO: Cross-Domain JavaScript Source File Inclusion

- **CWE:** CWE-829 (Unknown)
- **Tool:** browser-scanner

**Description:**
The page includes one or more script files from a third-party domain.

**Evidence:**
```
{
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js\"></script>",
  "url": "https://gpt-2-22b6d.firebaseapp.com/static/app.js",
  "type": "ZAP-10017"
}
```


#### INFO: Cross-Domain JavaScript Source File Inclusion

- **CWE:** CWE-829 (Unknown)
- **Tool:** browser-scanner

**Description:**
The page includes one or more script files from a third-party domain.

**Evidence:**
```
{
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js\"></script>",
  "url": "https://gpt-2-22b6d.firebaseapp.com/static/styles.css",
  "type": "ZAP-10017"
}
```


#### INFO: Cross-Domain JavaScript Source File Inclusion

- **CWE:** CWE-829 (Unknown)
- **Tool:** browser-scanner

**Description:**
The page includes one or more script files from a third-party domain.

**Evidence:**
```
{
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js\"></script>",
  "url": "https://gpt-2-22b6d.firebaseapp.com/media/",
  "type": "ZAP-10017"
}
```


#### INFO: Cross-Domain JavaScript Source File Inclusion

- **CWE:** CWE-829 (Unknown)
- **Tool:** browser-scanner

**Description:**
The page includes one or more script files from a third-party domain.

**Evidence:**
```
{
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js\"></script>",
  "url": "https://gpt-2-22b6d.firebaseapp.com/media/styles.css",
  "type": "ZAP-10017"
}
```


#### INFO: Cross-Domain JavaScript Source File Inclusion

- **CWE:** CWE-829 (Unknown)
- **Tool:** browser-scanner

**Description:**
The page includes one or more script files from a third-party domain.

**Evidence:**
```
{
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js\"></script>",
  "url": "https://gpt-2-22b6d.firebaseapp.com/media/app.js",
  "type": "ZAP-10017"
}
```


#### INFO: Cross-Domain JavaScript Source File Inclusion

- **CWE:** CWE-829 (Unknown)
- **Tool:** browser-scanner

**Description:**
The page includes one or more script files from a third-party domain.

**Evidence:**
```
{
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js\"></script>",
  "url": "https://gpt-2-22b6d.firebaseapp.com/backup/",
  "type": "ZAP-10017"
}
```


#### INFO: Cross-Domain JavaScript Source File Inclusion

- **CWE:** CWE-829 (Unknown)
- **Tool:** browser-scanner

**Description:**
The page includes one or more script files from a third-party domain.

**Evidence:**
```
{
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js\"></script>",
  "url": "https://gpt-2-22b6d.firebaseapp.com/backup/styles.css",
  "type": "ZAP-10017"
}
```


#### INFO: Cross-Domain JavaScript Source File Inclusion

- **CWE:** CWE-829 (Unknown)
- **Tool:** browser-scanner

**Description:**
The page includes one or more script files from a third-party domain.

**Evidence:**
```
{
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js\"></script>",
  "url": "https://gpt-2-22b6d.firebaseapp.com/backup/app.js",
  "type": "ZAP-10017"
}
```


#### INFO: Cross-Domain JavaScript Source File Inclusion

- **CWE:** CWE-829 (Unknown)
- **Tool:** browser-scanner

**Description:**
The page includes one or more script files from a third-party domain.

**Evidence:**
```
{
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js\"></script>",
  "url": "https://gpt-2-22b6d.firebaseapp.com/logs/app.js",
  "type": "ZAP-10017"
}
```


#### INFO: Cross-Domain JavaScript Source File Inclusion

- **CWE:** CWE-829 (Unknown)
- **Tool:** browser-scanner

**Description:**
The page includes one or more script files from a third-party domain.

**Evidence:**
```
{
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js\"></script>",
  "url": "https://gpt-2-22b6d.firebaseapp.com/logs/",
  "type": "ZAP-10017"
}
```


#### INFO: Cross-Domain JavaScript Source File Inclusion

- **CWE:** CWE-829 (Unknown)
- **Tool:** browser-scanner

**Description:**
The page includes one or more script files from a third-party domain.

**Evidence:**
```
{
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js\"></script>",
  "url": "https://gpt-2-22b6d.firebaseapp.com/logs/styles.css",
  "type": "ZAP-10017"
}
```


#### INFO: Cross-Domain JavaScript Source File Inclusion

- **CWE:** CWE-829 (Unknown)
- **Tool:** browser-scanner

**Description:**
The page includes one or more script files from a third-party domain.

**Evidence:**
```
{
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js\"></script>",
  "url": "https://gpt-2-22b6d.firebaseapp.com/tmp/styles.css",
  "type": "ZAP-10017"
}
```


#### INFO: Cross-Domain JavaScript Source File Inclusion

- **CWE:** CWE-829 (Unknown)
- **Tool:** browser-scanner

**Description:**
The page includes one or more script files from a third-party domain.

**Evidence:**
```
{
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js\"></script>",
  "url": "https://gpt-2-22b6d.firebaseapp.com/tmp/app.js",
  "type": "ZAP-10017"
}
```


#### INFO: Cross-Domain JavaScript Source File Inclusion

- **CWE:** CWE-829 (Unknown)
- **Tool:** browser-scanner

**Description:**
The page includes one or more script files from a third-party domain.

**Evidence:**
```
{
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js\"></script>",
  "url": "https://gpt-2-22b6d.firebaseapp.com/tmp/",
  "type": "ZAP-10017"
}
```


#### INFO: Cross-Domain JavaScript Source File Inclusion

- **CWE:** CWE-829 (Unknown)
- **Tool:** browser-scanner

**Description:**
The page includes one or more script files from a third-party domain.

**Evidence:**
```
{
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js\"></script>",
  "url": "https://gpt-2-22b6d.firebaseapp.com/data/",
  "type": "ZAP-10017"
}
```


#### INFO: Cross-Domain JavaScript Source File Inclusion

- **CWE:** CWE-829 (Unknown)
- **Tool:** browser-scanner

**Description:**
The page includes one or more script files from a third-party domain.

**Evidence:**
```
{
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js\"></script>",
  "url": "https://gpt-2-22b6d.firebaseapp.com/data/styles.css",
  "type": "ZAP-10017"
}
```


#### INFO: Cross-Domain JavaScript Source File Inclusion

- **CWE:** CWE-829 (Unknown)
- **Tool:** browser-scanner

**Description:**
The page includes one or more script files from a third-party domain.

**Evidence:**
```
{
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js\"></script>",
  "url": "https://gpt-2-22b6d.firebaseapp.com/data/app.js",
  "type": "ZAP-10017"
}
```


#### INFO: Cross-Domain JavaScript Source File Inclusion

- **CWE:** CWE-829 (Unknown)
- **Tool:** browser-scanner

**Description:**
The page includes one or more script files from a third-party domain.

**Evidence:**
```
{
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js\"></script>",
  "url": "https://gpt-2-22b6d.firebaseapp.com/admin",
  "type": "ZAP-10017"
}
```


#### INFO: Cross-Domain JavaScript Source File Inclusion

- **CWE:** CWE-829 (Unknown)
- **Tool:** browser-scanner

**Description:**
The page includes one or more script files from a third-party domain.

**Evidence:**
```
{
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js\"></script>",
  "url": "https://gpt-2-22b6d.firebaseapp.com/admin/",
  "type": "ZAP-10017"
}
```


#### INFO: Cross-Domain JavaScript Source File Inclusion

- **CWE:** CWE-829 (Unknown)
- **Tool:** browser-scanner

**Description:**
The page includes one or more script files from a third-party domain.

**Evidence:**
```
{
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js\"></script>",
  "url": "https://gpt-2-22b6d.firebaseapp.com/admin/app.js",
  "type": "ZAP-10017"
}
```


#### INFO: Cross-Domain JavaScript Source File Inclusion

- **CWE:** CWE-829 (Unknown)
- **Tool:** browser-scanner

**Description:**
The page includes one or more script files from a third-party domain.

**Evidence:**
```
{
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js\"></script>",
  "url": "https://gpt-2-22b6d.firebaseapp.com/admin/styles.css",
  "type": "ZAP-10017"
}
```


#### INFO: Cross-Domain JavaScript Source File Inclusion

- **CWE:** CWE-829 (Unknown)
- **Tool:** browser-scanner

**Description:**
The page includes one or more script files from a third-party domain.

**Evidence:**
```
{
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js\"></script>",
  "url": "https://gpt-2-22b6d.firebaseapp.com/admin/dashboard",
  "type": "ZAP-10017"
}
```


#### INFO: Cross-Domain JavaScript Source File Inclusion

- **CWE:** CWE-829 (Unknown)
- **Tool:** browser-scanner

**Description:**
The page includes one or more script files from a third-party domain.

**Evidence:**
```
{
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js\"></script>",
  "url": "https://gpt-2-22b6d.firebaseapp.com/admin/users",
  "type": "ZAP-10017"
}
```


#### INFO: Cross-Domain JavaScript Source File Inclusion

- **CWE:** CWE-829 (Unknown)
- **Tool:** browser-scanner

**Description:**
The page includes one or more script files from a third-party domain.

**Evidence:**
```
{
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js\"></script>",
  "url": "https://gpt-2-22b6d.firebaseapp.com/admin/settings",
  "type": "ZAP-10017"
}
```


#### INFO: Cross-Domain JavaScript Source File Inclusion

- **CWE:** CWE-829 (Unknown)
- **Tool:** browser-scanner

**Description:**
The page includes one or more script files from a third-party domain.

**Evidence:**
```
{
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js\"></script>",
  "url": "https://gpt-2-22b6d.firebaseapp.com/administrator",
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
  "url": "https://gpt-2-22b6d.firebaseapp.com/",
  "type": "ZAP-10027"
}
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
  "url": "https://gpt-2-22b6d.firebaseapp.com/app.js",
  "type": "ZAP-10027"
}
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
  "url": "https://gpt-2-22b6d.firebaseapp.com/home",
  "type": "ZAP-10027"
}
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
  "url": "https://gpt-2-22b6d.firebaseapp.com/profile",
  "type": "ZAP-10027"
}
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
  "url": "https://gpt-2-22b6d.firebaseapp.com/settings",
  "type": "ZAP-10027"
}
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
  "url": "https://gpt-2-22b6d.firebaseapp.com/posts",
  "type": "ZAP-10027"
}
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
  "url": "https://gpt-2-22b6d.firebaseapp.com/messages",
  "type": "ZAP-10027"
}
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
  "url": "https://gpt-2-22b6d.firebaseapp.com/feed",
  "type": "ZAP-10027"
}
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
  "url": "https://gpt-2-22b6d.firebaseapp.com/__nonexistent__1765813078782_e1794ca5e1b25",
  "type": "ZAP-10027"
}
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
  "url": "https://gpt-2-22b6d.firebaseapp.com/?file=..%2F..%2F..%2Fetc%2Fpasswd",
  "type": "ZAP-10027"
}
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
  "url": "https://gpt-2-22b6d.firebaseapp.com/?file=..%5C..%5C..%5Cwindows%5Cwin.ini",
  "type": "ZAP-10027"
}
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
  "url": "https://gpt-2-22b6d.firebaseapp.com/?file=....%2F%2F....%2F%2F....%2F%2Fetc%2Fpasswd",
  "type": "ZAP-10027"
}
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
  "url": "https://gpt-2-22b6d.firebaseapp.com/?file=..%252f..%252f..%252fetc%2Fpasswd",
  "type": "ZAP-10027"
}
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
  "url": "https://gpt-2-22b6d.firebaseapp.com/?path=..%2F..%2F..%2Fetc%2Fpasswd",
  "type": "ZAP-10027"
}
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
  "url": "https://gpt-2-22b6d.firebaseapp.com/?path=..%5C..%5C..%5Cwindows%5Cwin.ini",
  "type": "ZAP-10027"
}
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
  "url": "https://gpt-2-22b6d.firebaseapp.com/?path=....%2F%2F....%2F%2F....%2F%2Fetc%2Fpasswd",
  "type": "ZAP-10027"
}
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
  "url": "https://gpt-2-22b6d.firebaseapp.com/?path=..%252f..%252f..%252fetc%2Fpasswd",
  "type": "ZAP-10027"
}
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
  "url": "https://gpt-2-22b6d.firebaseapp.com/?filepath=..%2F..%2F..%2Fetc%2Fpasswd",
  "type": "ZAP-10027"
}
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
  "url": "https://gpt-2-22b6d.firebaseapp.com/?filepath=..%5C..%5C..%5Cwindows%5Cwin.ini",
  "type": "ZAP-10027"
}
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
  "url": "https://gpt-2-22b6d.firebaseapp.com/?filepath=....%2F%2F....%2F%2F....%2F%2Fetc%2Fpasswd",
  "type": "ZAP-10027"
}
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
  "url": "https://gpt-2-22b6d.firebaseapp.com/?filepath=..%252f..%252f..%252fetc%2Fpasswd",
  "type": "ZAP-10027"
}
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
  "url": "https://gpt-2-22b6d.firebaseapp.com/?document=..%2F..%2F..%2Fetc%2Fpasswd",
  "type": "ZAP-10027"
}
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
  "url": "https://gpt-2-22b6d.firebaseapp.com/?document=..%5C..%5C..%5Cwindows%5Cwin.ini",
  "type": "ZAP-10027"
}
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
  "url": "https://gpt-2-22b6d.firebaseapp.com/?document=....%2F%2F....%2F%2F....%2F%2Fetc%2Fpasswd",
  "type": "ZAP-10027"
}
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
  "url": "https://gpt-2-22b6d.firebaseapp.com/?document=..%252f..%252f..%252fetc%2Fpasswd",
  "type": "ZAP-10027"
}
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
  "url": "https://gpt-2-22b6d.firebaseapp.com/?doc=..%2F..%2F..%2Fetc%2Fpasswd",
  "type": "ZAP-10027"
}
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
  "url": "https://gpt-2-22b6d.firebaseapp.com/?doc=..%5C..%5C..%5Cwindows%5Cwin.ini",
  "type": "ZAP-10027"
}
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
  "url": "https://gpt-2-22b6d.firebaseapp.com/?doc=....%2F%2F....%2F%2F....%2F%2Fetc%2Fpasswd",
  "type": "ZAP-10027"
}
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
  "url": "https://gpt-2-22b6d.firebaseapp.com/?doc=..%252f..%252f..%252fetc%2Fpasswd",
  "type": "ZAP-10027"
}
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
  "url": "https://gpt-2-22b6d.firebaseapp.com/?page=..%2F..%2F..%2Fetc%2Fpasswd",
  "type": "ZAP-10027"
}
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
  "url": "https://gpt-2-22b6d.firebaseapp.com/?page=..%5C..%5C..%5Cwindows%5Cwin.ini",
  "type": "ZAP-10027"
}
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
  "url": "https://gpt-2-22b6d.firebaseapp.com/?page=....%2F%2F....%2F%2F....%2F%2Fetc%2Fpasswd",
  "type": "ZAP-10027"
}
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
  "url": "https://gpt-2-22b6d.firebaseapp.com/?page=..%252f..%252f..%252fetc%2Fpasswd",
  "type": "ZAP-10027"
}
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
  "url": "https://gpt-2-22b6d.firebaseapp.com/?template=..%2F..%2F..%2Fetc%2Fpasswd",
  "type": "ZAP-10027"
}
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
  "url": "https://gpt-2-22b6d.firebaseapp.com/?template=..%5C..%5C..%5Cwindows%5Cwin.ini",
  "type": "ZAP-10027"
}
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
  "url": "https://gpt-2-22b6d.firebaseapp.com/?template=....%2F%2F....%2F%2F....%2F%2Fetc%2Fpasswd",
  "type": "ZAP-10027"
}
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
  "url": "https://gpt-2-22b6d.firebaseapp.com/?template=..%252f..%252f..%252fetc%2Fpasswd",
  "type": "ZAP-10027"
}
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
  "url": "https://gpt-2-22b6d.firebaseapp.com/?include=..%2F..%2F..%2Fetc%2Fpasswd",
  "type": "ZAP-10027"
}
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
  "url": "https://gpt-2-22b6d.firebaseapp.com/?include=..%5C..%5C..%5Cwindows%5Cwin.ini",
  "type": "ZAP-10027"
}
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
  "url": "https://gpt-2-22b6d.firebaseapp.com/?include=....%2F%2F....%2F%2F....%2F%2Fetc%2Fpasswd",
  "type": "ZAP-10027"
}
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
  "url": "https://gpt-2-22b6d.firebaseapp.com/?include=..%252f..%252f..%252fetc%2Fpasswd",
  "type": "ZAP-10027"
}
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
  "url": "https://gpt-2-22b6d.firebaseapp.com/?dir=..%2F..%2F..%2Fetc%2Fpasswd",
  "type": "ZAP-10027"
}
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
  "url": "https://gpt-2-22b6d.firebaseapp.com/?dir=..%5C..%5C..%5Cwindows%5Cwin.ini",
  "type": "ZAP-10027"
}
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
  "url": "https://gpt-2-22b6d.firebaseapp.com/?dir=....%2F%2F....%2F%2F....%2F%2Fetc%2Fpasswd",
  "type": "ZAP-10027"
}
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
  "url": "https://gpt-2-22b6d.firebaseapp.com/?dir=..%252f..%252f..%252fetc%2Fpasswd",
  "type": "ZAP-10027"
}
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
  "url": "https://gpt-2-22b6d.firebaseapp.com/?folder=..%2F..%2F..%2Fetc%2Fpasswd",
  "type": "ZAP-10027"
}
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
  "url": "https://gpt-2-22b6d.firebaseapp.com/?folder=..%5C..%5C..%5Cwindows%5Cwin.ini",
  "type": "ZAP-10027"
}
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
  "url": "https://gpt-2-22b6d.firebaseapp.com/?folder=....%2F%2F....%2F%2F....%2F%2Fetc%2Fpasswd",
  "type": "ZAP-10027"
}
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
  "url": "https://gpt-2-22b6d.firebaseapp.com/?folder=..%252f..%252f..%252fetc%2Fpasswd",
  "type": "ZAP-10027"
}
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
  "url": "https://gpt-2-22b6d.firebaseapp.com/?load=..%2F..%2F..%2Fetc%2Fpasswd",
  "type": "ZAP-10027"
}
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
  "url": "https://gpt-2-22b6d.firebaseapp.com/?load=..%5C..%5C..%5Cwindows%5Cwin.ini",
  "type": "ZAP-10027"
}
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
  "url": "https://gpt-2-22b6d.firebaseapp.com/?load=....%2F%2F....%2F%2F....%2F%2Fetc%2Fpasswd",
  "type": "ZAP-10027"
}
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
  "url": "https://gpt-2-22b6d.firebaseapp.com/?load=..%252f..%252f..%252fetc%2Fpasswd",
  "type": "ZAP-10027"
}
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
  "url": "https://gpt-2-22b6d.firebaseapp.com/?read=..%2F..%2F..%2Fetc%2Fpasswd",
  "type": "ZAP-10027"
}
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
  "url": "https://gpt-2-22b6d.firebaseapp.com/?read=..%5C..%5C..%5Cwindows%5Cwin.ini",
  "type": "ZAP-10027"
}
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
  "url": "https://gpt-2-22b6d.firebaseapp.com/?read=....%2F%2F....%2F%2F....%2F%2Fetc%2Fpasswd",
  "type": "ZAP-10027"
}
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
  "url": "https://gpt-2-22b6d.firebaseapp.com/?read=..%252f..%252f..%252fetc%2Fpasswd",
  "type": "ZAP-10027"
}
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
  "url": "https://gpt-2-22b6d.firebaseapp.com/images/",
  "type": "ZAP-10027"
}
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
  "url": "https://gpt-2-22b6d.firebaseapp.com/images/styles.css",
  "type": "ZAP-10027"
}
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
  "url": "https://gpt-2-22b6d.firebaseapp.com/uploads/",
  "type": "ZAP-10027"
}
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
  "url": "https://gpt-2-22b6d.firebaseapp.com/uploads/styles.css",
  "type": "ZAP-10027"
}
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
  "url": "https://gpt-2-22b6d.firebaseapp.com/files/styles.css",
  "type": "ZAP-10027"
}
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
  "url": "https://gpt-2-22b6d.firebaseapp.com/files/",
  "type": "ZAP-10027"
}
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
  "url": "https://gpt-2-22b6d.firebaseapp.com/assets/",
  "type": "ZAP-10027"
}
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
  "url": "https://gpt-2-22b6d.firebaseapp.com/assets/styles.css",
  "type": "ZAP-10027"
}
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
  "url": "https://gpt-2-22b6d.firebaseapp.com/static/",
  "type": "ZAP-10027"
}
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
  "url": "https://gpt-2-22b6d.firebaseapp.com/static/styles.css",
  "type": "ZAP-10027"
}
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
  "url": "https://gpt-2-22b6d.firebaseapp.com/media/",
  "type": "ZAP-10027"
}
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
  "url": "https://gpt-2-22b6d.firebaseapp.com/media/styles.css",
  "type": "ZAP-10027"
}
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
  "url": "https://gpt-2-22b6d.firebaseapp.com/backup/",
  "type": "ZAP-10027"
}
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
  "url": "https://gpt-2-22b6d.firebaseapp.com/backup/styles.css",
  "type": "ZAP-10027"
}
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
  "url": "https://gpt-2-22b6d.firebaseapp.com/logs/",
  "type": "ZAP-10027"
}
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
  "url": "https://gpt-2-22b6d.firebaseapp.com/logs/styles.css",
  "type": "ZAP-10027"
}
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
  "url": "https://gpt-2-22b6d.firebaseapp.com/tmp/styles.css",
  "type": "ZAP-10027"
}
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
  "url": "https://gpt-2-22b6d.firebaseapp.com/tmp/",
  "type": "ZAP-10027"
}
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
  "url": "https://gpt-2-22b6d.firebaseapp.com/data/",
  "type": "ZAP-10027"
}
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
  "url": "https://gpt-2-22b6d.firebaseapp.com/data/styles.css",
  "type": "ZAP-10027"
}
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
  "url": "https://gpt-2-22b6d.firebaseapp.com/admin",
  "type": "ZAP-10027"
}
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
  "url": "https://gpt-2-22b6d.firebaseapp.com/admin/",
  "type": "ZAP-10027"
}
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
  "url": "https://gpt-2-22b6d.firebaseapp.com/admin/styles.css",
  "type": "ZAP-10027"
}
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
  "url": "https://gpt-2-22b6d.firebaseapp.com/admin/dashboard",
  "type": "ZAP-10027"
}
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
  "url": "https://gpt-2-22b6d.firebaseapp.com/admin/users",
  "type": "ZAP-10027"
}
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
  "url": "https://gpt-2-22b6d.firebaseapp.com/admin/settings",
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
  "url": "https://gpt-2-22b6d.firebaseapp.com/",
  "type": "ZAP-10020-1"
}
```


#### INFO: Missing Anti-clickjacking Header

- **CWE:** CWE-1021 (Unknown)
- **Tool:** browser-scanner

**Description:**
The response does not protect against 'ClickJacking' attacks. It should include either Content-Security-Policy with 'frame-ancestors' directive or X-Frame-Options.

**Evidence:**
```
{
  "detail": "N/A",
  "url": "https://gpt-2-22b6d.firebaseapp.com/home",
  "type": "ZAP-10020-1"
}
```


#### INFO: Missing Anti-clickjacking Header

- **CWE:** CWE-1021 (Unknown)
- **Tool:** browser-scanner

**Description:**
The response does not protect against 'ClickJacking' attacks. It should include either Content-Security-Policy with 'frame-ancestors' directive or X-Frame-Options.

**Evidence:**
```
{
  "detail": "N/A",
  "url": "https://gpt-2-22b6d.firebaseapp.com/profile",
  "type": "ZAP-10020-1"
}
```


#### INFO: Missing Anti-clickjacking Header

- **CWE:** CWE-1021 (Unknown)
- **Tool:** browser-scanner

**Description:**
The response does not protect against 'ClickJacking' attacks. It should include either Content-Security-Policy with 'frame-ancestors' directive or X-Frame-Options.

**Evidence:**
```
{
  "detail": "N/A",
  "url": "https://gpt-2-22b6d.firebaseapp.com/settings",
  "type": "ZAP-10020-1"
}
```


#### INFO: Missing Anti-clickjacking Header

- **CWE:** CWE-1021 (Unknown)
- **Tool:** browser-scanner

**Description:**
The response does not protect against 'ClickJacking' attacks. It should include either Content-Security-Policy with 'frame-ancestors' directive or X-Frame-Options.

**Evidence:**
```
{
  "detail": "N/A",
  "url": "https://gpt-2-22b6d.firebaseapp.com/posts",
  "type": "ZAP-10020-1"
}
```


#### INFO: Missing Anti-clickjacking Header

- **CWE:** CWE-1021 (Unknown)
- **Tool:** browser-scanner

**Description:**
The response does not protect against 'ClickJacking' attacks. It should include either Content-Security-Policy with 'frame-ancestors' directive or X-Frame-Options.

**Evidence:**
```
{
  "detail": "N/A",
  "url": "https://gpt-2-22b6d.firebaseapp.com/messages",
  "type": "ZAP-10020-1"
}
```


#### INFO: Missing Anti-clickjacking Header

- **CWE:** CWE-1021 (Unknown)
- **Tool:** browser-scanner

**Description:**
The response does not protect against 'ClickJacking' attacks. It should include either Content-Security-Policy with 'frame-ancestors' directive or X-Frame-Options.

**Evidence:**
```
{
  "detail": "N/A",
  "url": "https://gpt-2-22b6d.firebaseapp.com/feed",
  "type": "ZAP-10020-1"
}
```


#### INFO: Missing Anti-clickjacking Header

- **CWE:** CWE-1021 (Unknown)
- **Tool:** browser-scanner

**Description:**
The response does not protect against 'ClickJacking' attacks. It should include either Content-Security-Policy with 'frame-ancestors' directive or X-Frame-Options.

**Evidence:**
```
{
  "detail": "N/A",
  "url": "https://gpt-2-22b6d.firebaseapp.com/__nonexistent__1765813078782_e1794ca5e1b25",
  "type": "ZAP-10020-1"
}
```


#### INFO: Missing Anti-clickjacking Header

- **CWE:** CWE-1021 (Unknown)
- **Tool:** browser-scanner

**Description:**
The response does not protect against 'ClickJacking' attacks. It should include either Content-Security-Policy with 'frame-ancestors' directive or X-Frame-Options.

**Evidence:**
```
{
  "detail": "N/A",
  "url": "https://gpt-2-22b6d.firebaseapp.com/?file=..%2F..%2F..%2Fetc%2Fpasswd",
  "type": "ZAP-10020-1"
}
```


#### INFO: Missing Anti-clickjacking Header

- **CWE:** CWE-1021 (Unknown)
- **Tool:** browser-scanner

**Description:**
The response does not protect against 'ClickJacking' attacks. It should include either Content-Security-Policy with 'frame-ancestors' directive or X-Frame-Options.

**Evidence:**
```
{
  "detail": "N/A",
  "url": "https://gpt-2-22b6d.firebaseapp.com/?file=..%5C..%5C..%5Cwindows%5Cwin.ini",
  "type": "ZAP-10020-1"
}
```


#### INFO: Missing Anti-clickjacking Header

- **CWE:** CWE-1021 (Unknown)
- **Tool:** browser-scanner

**Description:**
The response does not protect against 'ClickJacking' attacks. It should include either Content-Security-Policy with 'frame-ancestors' directive or X-Frame-Options.

**Evidence:**
```
{
  "detail": "N/A",
  "url": "https://gpt-2-22b6d.firebaseapp.com/?file=....%2F%2F....%2F%2F....%2F%2Fetc%2Fpasswd",
  "type": "ZAP-10020-1"
}
```


#### INFO: Missing Anti-clickjacking Header

- **CWE:** CWE-1021 (Unknown)
- **Tool:** browser-scanner

**Description:**
The response does not protect against 'ClickJacking' attacks. It should include either Content-Security-Policy with 'frame-ancestors' directive or X-Frame-Options.

**Evidence:**
```
{
  "detail": "N/A",
  "url": "https://gpt-2-22b6d.firebaseapp.com/?file=..%252f..%252f..%252fetc%2Fpasswd",
  "type": "ZAP-10020-1"
}
```


#### INFO: Missing Anti-clickjacking Header

- **CWE:** CWE-1021 (Unknown)
- **Tool:** browser-scanner

**Description:**
The response does not protect against 'ClickJacking' attacks. It should include either Content-Security-Policy with 'frame-ancestors' directive or X-Frame-Options.

**Evidence:**
```
{
  "detail": "N/A",
  "url": "https://gpt-2-22b6d.firebaseapp.com/?path=..%2F..%2F..%2Fetc%2Fpasswd",
  "type": "ZAP-10020-1"
}
```


#### INFO: Missing Anti-clickjacking Header

- **CWE:** CWE-1021 (Unknown)
- **Tool:** browser-scanner

**Description:**
The response does not protect against 'ClickJacking' attacks. It should include either Content-Security-Policy with 'frame-ancestors' directive or X-Frame-Options.

**Evidence:**
```
{
  "detail": "N/A",
  "url": "https://gpt-2-22b6d.firebaseapp.com/?path=..%5C..%5C..%5Cwindows%5Cwin.ini",
  "type": "ZAP-10020-1"
}
```


#### INFO: Missing Anti-clickjacking Header

- **CWE:** CWE-1021 (Unknown)
- **Tool:** browser-scanner

**Description:**
The response does not protect against 'ClickJacking' attacks. It should include either Content-Security-Policy with 'frame-ancestors' directive or X-Frame-Options.

**Evidence:**
```
{
  "detail": "N/A",
  "url": "https://gpt-2-22b6d.firebaseapp.com/?path=....%2F%2F....%2F%2F....%2F%2Fetc%2Fpasswd",
  "type": "ZAP-10020-1"
}
```


#### INFO: Missing Anti-clickjacking Header

- **CWE:** CWE-1021 (Unknown)
- **Tool:** browser-scanner

**Description:**
The response does not protect against 'ClickJacking' attacks. It should include either Content-Security-Policy with 'frame-ancestors' directive or X-Frame-Options.

**Evidence:**
```
{
  "detail": "N/A",
  "url": "https://gpt-2-22b6d.firebaseapp.com/?path=..%252f..%252f..%252fetc%2Fpasswd",
  "type": "ZAP-10020-1"
}
```


#### INFO: Missing Anti-clickjacking Header

- **CWE:** CWE-1021 (Unknown)
- **Tool:** browser-scanner

**Description:**
The response does not protect against 'ClickJacking' attacks. It should include either Content-Security-Policy with 'frame-ancestors' directive or X-Frame-Options.

**Evidence:**
```
{
  "detail": "N/A",
  "url": "https://gpt-2-22b6d.firebaseapp.com/?filepath=..%2F..%2F..%2Fetc%2Fpasswd",
  "type": "ZAP-10020-1"
}
```


#### INFO: Missing Anti-clickjacking Header

- **CWE:** CWE-1021 (Unknown)
- **Tool:** browser-scanner

**Description:**
The response does not protect against 'ClickJacking' attacks. It should include either Content-Security-Policy with 'frame-ancestors' directive or X-Frame-Options.

**Evidence:**
```
{
  "detail": "N/A",
  "url": "https://gpt-2-22b6d.firebaseapp.com/?filepath=..%5C..%5C..%5Cwindows%5Cwin.ini",
  "type": "ZAP-10020-1"
}
```


#### INFO: Missing Anti-clickjacking Header

- **CWE:** CWE-1021 (Unknown)
- **Tool:** browser-scanner

**Description:**
The response does not protect against 'ClickJacking' attacks. It should include either Content-Security-Policy with 'frame-ancestors' directive or X-Frame-Options.

**Evidence:**
```
{
  "detail": "N/A",
  "url": "https://gpt-2-22b6d.firebaseapp.com/?filepath=....%2F%2F....%2F%2F....%2F%2Fetc%2Fpasswd",
  "type": "ZAP-10020-1"
}
```


#### INFO: Missing Anti-clickjacking Header

- **CWE:** CWE-1021 (Unknown)
- **Tool:** browser-scanner

**Description:**
The response does not protect against 'ClickJacking' attacks. It should include either Content-Security-Policy with 'frame-ancestors' directive or X-Frame-Options.

**Evidence:**
```
{
  "detail": "N/A",
  "url": "https://gpt-2-22b6d.firebaseapp.com/?filepath=..%252f..%252f..%252fetc%2Fpasswd",
  "type": "ZAP-10020-1"
}
```


#### INFO: Missing Anti-clickjacking Header

- **CWE:** CWE-1021 (Unknown)
- **Tool:** browser-scanner

**Description:**
The response does not protect against 'ClickJacking' attacks. It should include either Content-Security-Policy with 'frame-ancestors' directive or X-Frame-Options.

**Evidence:**
```
{
  "detail": "N/A",
  "url": "https://gpt-2-22b6d.firebaseapp.com/?document=..%2F..%2F..%2Fetc%2Fpasswd",
  "type": "ZAP-10020-1"
}
```


#### INFO: Missing Anti-clickjacking Header

- **CWE:** CWE-1021 (Unknown)
- **Tool:** browser-scanner

**Description:**
The response does not protect against 'ClickJacking' attacks. It should include either Content-Security-Policy with 'frame-ancestors' directive or X-Frame-Options.

**Evidence:**
```
{
  "detail": "N/A",
  "url": "https://gpt-2-22b6d.firebaseapp.com/?document=..%5C..%5C..%5Cwindows%5Cwin.ini",
  "type": "ZAP-10020-1"
}
```


#### INFO: Missing Anti-clickjacking Header

- **CWE:** CWE-1021 (Unknown)
- **Tool:** browser-scanner

**Description:**
The response does not protect against 'ClickJacking' attacks. It should include either Content-Security-Policy with 'frame-ancestors' directive or X-Frame-Options.

**Evidence:**
```
{
  "detail": "N/A",
  "url": "https://gpt-2-22b6d.firebaseapp.com/?document=....%2F%2F....%2F%2F....%2F%2Fetc%2Fpasswd",
  "type": "ZAP-10020-1"
}
```


#### INFO: Missing Anti-clickjacking Header

- **CWE:** CWE-1021 (Unknown)
- **Tool:** browser-scanner

**Description:**
The response does not protect against 'ClickJacking' attacks. It should include either Content-Security-Policy with 'frame-ancestors' directive or X-Frame-Options.

**Evidence:**
```
{
  "detail": "N/A",
  "url": "https://gpt-2-22b6d.firebaseapp.com/?document=..%252f..%252f..%252fetc%2Fpasswd",
  "type": "ZAP-10020-1"
}
```


#### INFO: Missing Anti-clickjacking Header

- **CWE:** CWE-1021 (Unknown)
- **Tool:** browser-scanner

**Description:**
The response does not protect against 'ClickJacking' attacks. It should include either Content-Security-Policy with 'frame-ancestors' directive or X-Frame-Options.

**Evidence:**
```
{
  "detail": "N/A",
  "url": "https://gpt-2-22b6d.firebaseapp.com/?doc=..%2F..%2F..%2Fetc%2Fpasswd",
  "type": "ZAP-10020-1"
}
```


#### INFO: Missing Anti-clickjacking Header

- **CWE:** CWE-1021 (Unknown)
- **Tool:** browser-scanner

**Description:**
The response does not protect against 'ClickJacking' attacks. It should include either Content-Security-Policy with 'frame-ancestors' directive or X-Frame-Options.

**Evidence:**
```
{
  "detail": "N/A",
  "url": "https://gpt-2-22b6d.firebaseapp.com/?doc=..%5C..%5C..%5Cwindows%5Cwin.ini",
  "type": "ZAP-10020-1"
}
```


#### INFO: Missing Anti-clickjacking Header

- **CWE:** CWE-1021 (Unknown)
- **Tool:** browser-scanner

**Description:**
The response does not protect against 'ClickJacking' attacks. It should include either Content-Security-Policy with 'frame-ancestors' directive or X-Frame-Options.

**Evidence:**
```
{
  "detail": "N/A",
  "url": "https://gpt-2-22b6d.firebaseapp.com/?doc=....%2F%2F....%2F%2F....%2F%2Fetc%2Fpasswd",
  "type": "ZAP-10020-1"
}
```


#### INFO: Missing Anti-clickjacking Header

- **CWE:** CWE-1021 (Unknown)
- **Tool:** browser-scanner

**Description:**
The response does not protect against 'ClickJacking' attacks. It should include either Content-Security-Policy with 'frame-ancestors' directive or X-Frame-Options.

**Evidence:**
```
{
  "detail": "N/A",
  "url": "https://gpt-2-22b6d.firebaseapp.com/?doc=..%252f..%252f..%252fetc%2Fpasswd",
  "type": "ZAP-10020-1"
}
```


#### INFO: Missing Anti-clickjacking Header

- **CWE:** CWE-1021 (Unknown)
- **Tool:** browser-scanner

**Description:**
The response does not protect against 'ClickJacking' attacks. It should include either Content-Security-Policy with 'frame-ancestors' directive or X-Frame-Options.

**Evidence:**
```
{
  "detail": "N/A",
  "url": "https://gpt-2-22b6d.firebaseapp.com/?page=..%2F..%2F..%2Fetc%2Fpasswd",
  "type": "ZAP-10020-1"
}
```


#### INFO: Missing Anti-clickjacking Header

- **CWE:** CWE-1021 (Unknown)
- **Tool:** browser-scanner

**Description:**
The response does not protect against 'ClickJacking' attacks. It should include either Content-Security-Policy with 'frame-ancestors' directive or X-Frame-Options.

**Evidence:**
```
{
  "detail": "N/A",
  "url": "https://gpt-2-22b6d.firebaseapp.com/?page=..%5C..%5C..%5Cwindows%5Cwin.ini",
  "type": "ZAP-10020-1"
}
```


#### INFO: Missing Anti-clickjacking Header

- **CWE:** CWE-1021 (Unknown)
- **Tool:** browser-scanner

**Description:**
The response does not protect against 'ClickJacking' attacks. It should include either Content-Security-Policy with 'frame-ancestors' directive or X-Frame-Options.

**Evidence:**
```
{
  "detail": "N/A",
  "url": "https://gpt-2-22b6d.firebaseapp.com/?page=....%2F%2F....%2F%2F....%2F%2Fetc%2Fpasswd",
  "type": "ZAP-10020-1"
}
```


#### INFO: Missing Anti-clickjacking Header

- **CWE:** CWE-1021 (Unknown)
- **Tool:** browser-scanner

**Description:**
The response does not protect against 'ClickJacking' attacks. It should include either Content-Security-Policy with 'frame-ancestors' directive or X-Frame-Options.

**Evidence:**
```
{
  "detail": "N/A",
  "url": "https://gpt-2-22b6d.firebaseapp.com/?page=..%252f..%252f..%252fetc%2Fpasswd",
  "type": "ZAP-10020-1"
}
```


#### INFO: Missing Anti-clickjacking Header

- **CWE:** CWE-1021 (Unknown)
- **Tool:** browser-scanner

**Description:**
The response does not protect against 'ClickJacking' attacks. It should include either Content-Security-Policy with 'frame-ancestors' directive or X-Frame-Options.

**Evidence:**
```
{
  "detail": "N/A",
  "url": "https://gpt-2-22b6d.firebaseapp.com/?template=..%2F..%2F..%2Fetc%2Fpasswd",
  "type": "ZAP-10020-1"
}
```


#### INFO: Missing Anti-clickjacking Header

- **CWE:** CWE-1021 (Unknown)
- **Tool:** browser-scanner

**Description:**
The response does not protect against 'ClickJacking' attacks. It should include either Content-Security-Policy with 'frame-ancestors' directive or X-Frame-Options.

**Evidence:**
```
{
  "detail": "N/A",
  "url": "https://gpt-2-22b6d.firebaseapp.com/?template=..%5C..%5C..%5Cwindows%5Cwin.ini",
  "type": "ZAP-10020-1"
}
```


#### INFO: Missing Anti-clickjacking Header

- **CWE:** CWE-1021 (Unknown)
- **Tool:** browser-scanner

**Description:**
The response does not protect against 'ClickJacking' attacks. It should include either Content-Security-Policy with 'frame-ancestors' directive or X-Frame-Options.

**Evidence:**
```
{
  "detail": "N/A",
  "url": "https://gpt-2-22b6d.firebaseapp.com/?template=....%2F%2F....%2F%2F....%2F%2Fetc%2Fpasswd",
  "type": "ZAP-10020-1"
}
```


#### INFO: Missing Anti-clickjacking Header

- **CWE:** CWE-1021 (Unknown)
- **Tool:** browser-scanner

**Description:**
The response does not protect against 'ClickJacking' attacks. It should include either Content-Security-Policy with 'frame-ancestors' directive or X-Frame-Options.

**Evidence:**
```
{
  "detail": "N/A",
  "url": "https://gpt-2-22b6d.firebaseapp.com/?template=..%252f..%252f..%252fetc%2Fpasswd",
  "type": "ZAP-10020-1"
}
```


#### INFO: Missing Anti-clickjacking Header

- **CWE:** CWE-1021 (Unknown)
- **Tool:** browser-scanner

**Description:**
The response does not protect against 'ClickJacking' attacks. It should include either Content-Security-Policy with 'frame-ancestors' directive or X-Frame-Options.

**Evidence:**
```
{
  "detail": "N/A",
  "url": "https://gpt-2-22b6d.firebaseapp.com/?include=..%2F..%2F..%2Fetc%2Fpasswd",
  "type": "ZAP-10020-1"
}
```


#### INFO: Missing Anti-clickjacking Header

- **CWE:** CWE-1021 (Unknown)
- **Tool:** browser-scanner

**Description:**
The response does not protect against 'ClickJacking' attacks. It should include either Content-Security-Policy with 'frame-ancestors' directive or X-Frame-Options.

**Evidence:**
```
{
  "detail": "N/A",
  "url": "https://gpt-2-22b6d.firebaseapp.com/?include=..%5C..%5C..%5Cwindows%5Cwin.ini",
  "type": "ZAP-10020-1"
}
```


#### INFO: Missing Anti-clickjacking Header

- **CWE:** CWE-1021 (Unknown)
- **Tool:** browser-scanner

**Description:**
The response does not protect against 'ClickJacking' attacks. It should include either Content-Security-Policy with 'frame-ancestors' directive or X-Frame-Options.

**Evidence:**
```
{
  "detail": "N/A",
  "url": "https://gpt-2-22b6d.firebaseapp.com/?include=....%2F%2F....%2F%2F....%2F%2Fetc%2Fpasswd",
  "type": "ZAP-10020-1"
}
```


#### INFO: Missing Anti-clickjacking Header

- **CWE:** CWE-1021 (Unknown)
- **Tool:** browser-scanner

**Description:**
The response does not protect against 'ClickJacking' attacks. It should include either Content-Security-Policy with 'frame-ancestors' directive or X-Frame-Options.

**Evidence:**
```
{
  "detail": "N/A",
  "url": "https://gpt-2-22b6d.firebaseapp.com/?include=..%252f..%252f..%252fetc%2Fpasswd",
  "type": "ZAP-10020-1"
}
```


#### INFO: Missing Anti-clickjacking Header

- **CWE:** CWE-1021 (Unknown)
- **Tool:** browser-scanner

**Description:**
The response does not protect against 'ClickJacking' attacks. It should include either Content-Security-Policy with 'frame-ancestors' directive or X-Frame-Options.

**Evidence:**
```
{
  "detail": "N/A",
  "url": "https://gpt-2-22b6d.firebaseapp.com/?dir=..%2F..%2F..%2Fetc%2Fpasswd",
  "type": "ZAP-10020-1"
}
```


#### INFO: Missing Anti-clickjacking Header

- **CWE:** CWE-1021 (Unknown)
- **Tool:** browser-scanner

**Description:**
The response does not protect against 'ClickJacking' attacks. It should include either Content-Security-Policy with 'frame-ancestors' directive or X-Frame-Options.

**Evidence:**
```
{
  "detail": "N/A",
  "url": "https://gpt-2-22b6d.firebaseapp.com/?dir=..%5C..%5C..%5Cwindows%5Cwin.ini",
  "type": "ZAP-10020-1"
}
```


#### INFO: Missing Anti-clickjacking Header

- **CWE:** CWE-1021 (Unknown)
- **Tool:** browser-scanner

**Description:**
The response does not protect against 'ClickJacking' attacks. It should include either Content-Security-Policy with 'frame-ancestors' directive or X-Frame-Options.

**Evidence:**
```
{
  "detail": "N/A",
  "url": "https://gpt-2-22b6d.firebaseapp.com/?dir=....%2F%2F....%2F%2F....%2F%2Fetc%2Fpasswd",
  "type": "ZAP-10020-1"
}
```


#### INFO: Missing Anti-clickjacking Header

- **CWE:** CWE-1021 (Unknown)
- **Tool:** browser-scanner

**Description:**
The response does not protect against 'ClickJacking' attacks. It should include either Content-Security-Policy with 'frame-ancestors' directive or X-Frame-Options.

**Evidence:**
```
{
  "detail": "N/A",
  "url": "https://gpt-2-22b6d.firebaseapp.com/?dir=..%252f..%252f..%252fetc%2Fpasswd",
  "type": "ZAP-10020-1"
}
```


#### INFO: Missing Anti-clickjacking Header

- **CWE:** CWE-1021 (Unknown)
- **Tool:** browser-scanner

**Description:**
The response does not protect against 'ClickJacking' attacks. It should include either Content-Security-Policy with 'frame-ancestors' directive or X-Frame-Options.

**Evidence:**
```
{
  "detail": "N/A",
  "url": "https://gpt-2-22b6d.firebaseapp.com/?folder=..%2F..%2F..%2Fetc%2Fpasswd",
  "type": "ZAP-10020-1"
}
```


#### INFO: Missing Anti-clickjacking Header

- **CWE:** CWE-1021 (Unknown)
- **Tool:** browser-scanner

**Description:**
The response does not protect against 'ClickJacking' attacks. It should include either Content-Security-Policy with 'frame-ancestors' directive or X-Frame-Options.

**Evidence:**
```
{
  "detail": "N/A",
  "url": "https://gpt-2-22b6d.firebaseapp.com/?folder=..%5C..%5C..%5Cwindows%5Cwin.ini",
  "type": "ZAP-10020-1"
}
```


#### INFO: Missing Anti-clickjacking Header

- **CWE:** CWE-1021 (Unknown)
- **Tool:** browser-scanner

**Description:**
The response does not protect against 'ClickJacking' attacks. It should include either Content-Security-Policy with 'frame-ancestors' directive or X-Frame-Options.

**Evidence:**
```
{
  "detail": "N/A",
  "url": "https://gpt-2-22b6d.firebaseapp.com/?folder=....%2F%2F....%2F%2F....%2F%2Fetc%2Fpasswd",
  "type": "ZAP-10020-1"
}
```


#### INFO: Missing Anti-clickjacking Header

- **CWE:** CWE-1021 (Unknown)
- **Tool:** browser-scanner

**Description:**
The response does not protect against 'ClickJacking' attacks. It should include either Content-Security-Policy with 'frame-ancestors' directive or X-Frame-Options.

**Evidence:**
```
{
  "detail": "N/A",
  "url": "https://gpt-2-22b6d.firebaseapp.com/?folder=..%252f..%252f..%252fetc%2Fpasswd",
  "type": "ZAP-10020-1"
}
```


#### INFO: Missing Anti-clickjacking Header

- **CWE:** CWE-1021 (Unknown)
- **Tool:** browser-scanner

**Description:**
The response does not protect against 'ClickJacking' attacks. It should include either Content-Security-Policy with 'frame-ancestors' directive or X-Frame-Options.

**Evidence:**
```
{
  "detail": "N/A",
  "url": "https://gpt-2-22b6d.firebaseapp.com/?load=..%2F..%2F..%2Fetc%2Fpasswd",
  "type": "ZAP-10020-1"
}
```


#### INFO: Missing Anti-clickjacking Header

- **CWE:** CWE-1021 (Unknown)
- **Tool:** browser-scanner

**Description:**
The response does not protect against 'ClickJacking' attacks. It should include either Content-Security-Policy with 'frame-ancestors' directive or X-Frame-Options.

**Evidence:**
```
{
  "detail": "N/A",
  "url": "https://gpt-2-22b6d.firebaseapp.com/?load=..%5C..%5C..%5Cwindows%5Cwin.ini",
  "type": "ZAP-10020-1"
}
```


#### INFO: Missing Anti-clickjacking Header

- **CWE:** CWE-1021 (Unknown)
- **Tool:** browser-scanner

**Description:**
The response does not protect against 'ClickJacking' attacks. It should include either Content-Security-Policy with 'frame-ancestors' directive or X-Frame-Options.

**Evidence:**
```
{
  "detail": "N/A",
  "url": "https://gpt-2-22b6d.firebaseapp.com/?load=....%2F%2F....%2F%2F....%2F%2Fetc%2Fpasswd",
  "type": "ZAP-10020-1"
}
```


#### INFO: Missing Anti-clickjacking Header

- **CWE:** CWE-1021 (Unknown)
- **Tool:** browser-scanner

**Description:**
The response does not protect against 'ClickJacking' attacks. It should include either Content-Security-Policy with 'frame-ancestors' directive or X-Frame-Options.

**Evidence:**
```
{
  "detail": "N/A",
  "url": "https://gpt-2-22b6d.firebaseapp.com/?load=..%252f..%252f..%252fetc%2Fpasswd",
  "type": "ZAP-10020-1"
}
```


#### INFO: Missing Anti-clickjacking Header

- **CWE:** CWE-1021 (Unknown)
- **Tool:** browser-scanner

**Description:**
The response does not protect against 'ClickJacking' attacks. It should include either Content-Security-Policy with 'frame-ancestors' directive or X-Frame-Options.

**Evidence:**
```
{
  "detail": "N/A",
  "url": "https://gpt-2-22b6d.firebaseapp.com/?read=..%2F..%2F..%2Fetc%2Fpasswd",
  "type": "ZAP-10020-1"
}
```


#### INFO: Missing Anti-clickjacking Header

- **CWE:** CWE-1021 (Unknown)
- **Tool:** browser-scanner

**Description:**
The response does not protect against 'ClickJacking' attacks. It should include either Content-Security-Policy with 'frame-ancestors' directive or X-Frame-Options.

**Evidence:**
```
{
  "detail": "N/A",
  "url": "https://gpt-2-22b6d.firebaseapp.com/?read=..%5C..%5C..%5Cwindows%5Cwin.ini",
  "type": "ZAP-10020-1"
}
```


#### INFO: Missing Anti-clickjacking Header

- **CWE:** CWE-1021 (Unknown)
- **Tool:** browser-scanner

**Description:**
The response does not protect against 'ClickJacking' attacks. It should include either Content-Security-Policy with 'frame-ancestors' directive or X-Frame-Options.

**Evidence:**
```
{
  "detail": "N/A",
  "url": "https://gpt-2-22b6d.firebaseapp.com/?read=....%2F%2F....%2F%2F....%2F%2Fetc%2Fpasswd",
  "type": "ZAP-10020-1"
}
```


#### INFO: Missing Anti-clickjacking Header

- **CWE:** CWE-1021 (Unknown)
- **Tool:** browser-scanner

**Description:**
The response does not protect against 'ClickJacking' attacks. It should include either Content-Security-Policy with 'frame-ancestors' directive or X-Frame-Options.

**Evidence:**
```
{
  "detail": "N/A",
  "url": "https://gpt-2-22b6d.firebaseapp.com/?read=..%252f..%252f..%252fetc%2Fpasswd",
  "type": "ZAP-10020-1"
}
```


#### INFO: Missing Anti-clickjacking Header

- **CWE:** CWE-1021 (Unknown)
- **Tool:** browser-scanner

**Description:**
The response does not protect against 'ClickJacking' attacks. It should include either Content-Security-Policy with 'frame-ancestors' directive or X-Frame-Options.

**Evidence:**
```
{
  "detail": "N/A",
  "url": "https://gpt-2-22b6d.firebaseapp.com/images/",
  "type": "ZAP-10020-1"
}
```


#### INFO: Missing Anti-clickjacking Header

- **CWE:** CWE-1021 (Unknown)
- **Tool:** browser-scanner

**Description:**
The response does not protect against 'ClickJacking' attacks. It should include either Content-Security-Policy with 'frame-ancestors' directive or X-Frame-Options.

**Evidence:**
```
{
  "detail": "N/A",
  "url": "https://gpt-2-22b6d.firebaseapp.com/images/app.js",
  "type": "ZAP-10020-1"
}
```


#### INFO: Missing Anti-clickjacking Header

- **CWE:** CWE-1021 (Unknown)
- **Tool:** browser-scanner

**Description:**
The response does not protect against 'ClickJacking' attacks. It should include either Content-Security-Policy with 'frame-ancestors' directive or X-Frame-Options.

**Evidence:**
```
{
  "detail": "N/A",
  "url": "https://gpt-2-22b6d.firebaseapp.com/images/styles.css",
  "type": "ZAP-10020-1"
}
```


#### INFO: Missing Anti-clickjacking Header

- **CWE:** CWE-1021 (Unknown)
- **Tool:** browser-scanner

**Description:**
The response does not protect against 'ClickJacking' attacks. It should include either Content-Security-Policy with 'frame-ancestors' directive or X-Frame-Options.

**Evidence:**
```
{
  "detail": "N/A",
  "url": "https://gpt-2-22b6d.firebaseapp.com/uploads/",
  "type": "ZAP-10020-1"
}
```


#### INFO: Missing Anti-clickjacking Header

- **CWE:** CWE-1021 (Unknown)
- **Tool:** browser-scanner

**Description:**
The response does not protect against 'ClickJacking' attacks. It should include either Content-Security-Policy with 'frame-ancestors' directive or X-Frame-Options.

**Evidence:**
```
{
  "detail": "N/A",
  "url": "https://gpt-2-22b6d.firebaseapp.com/uploads/styles.css",
  "type": "ZAP-10020-1"
}
```


#### INFO: Missing Anti-clickjacking Header

- **CWE:** CWE-1021 (Unknown)
- **Tool:** browser-scanner

**Description:**
The response does not protect against 'ClickJacking' attacks. It should include either Content-Security-Policy with 'frame-ancestors' directive or X-Frame-Options.

**Evidence:**
```
{
  "detail": "N/A",
  "url": "https://gpt-2-22b6d.firebaseapp.com/uploads/app.js",
  "type": "ZAP-10020-1"
}
```


#### INFO: Missing Anti-clickjacking Header

- **CWE:** CWE-1021 (Unknown)
- **Tool:** browser-scanner

**Description:**
The response does not protect against 'ClickJacking' attacks. It should include either Content-Security-Policy with 'frame-ancestors' directive or X-Frame-Options.

**Evidence:**
```
{
  "detail": "N/A",
  "url": "https://gpt-2-22b6d.firebaseapp.com/files/styles.css",
  "type": "ZAP-10020-1"
}
```


#### INFO: Missing Anti-clickjacking Header

- **CWE:** CWE-1021 (Unknown)
- **Tool:** browser-scanner

**Description:**
The response does not protect against 'ClickJacking' attacks. It should include either Content-Security-Policy with 'frame-ancestors' directive or X-Frame-Options.

**Evidence:**
```
{
  "detail": "N/A",
  "url": "https://gpt-2-22b6d.firebaseapp.com/files/",
  "type": "ZAP-10020-1"
}
```


#### INFO: Missing Anti-clickjacking Header

- **CWE:** CWE-1021 (Unknown)
- **Tool:** browser-scanner

**Description:**
The response does not protect against 'ClickJacking' attacks. It should include either Content-Security-Policy with 'frame-ancestors' directive or X-Frame-Options.

**Evidence:**
```
{
  "detail": "N/A",
  "url": "https://gpt-2-22b6d.firebaseapp.com/files/app.js",
  "type": "ZAP-10020-1"
}
```


#### INFO: Missing Anti-clickjacking Header

- **CWE:** CWE-1021 (Unknown)
- **Tool:** browser-scanner

**Description:**
The response does not protect against 'ClickJacking' attacks. It should include either Content-Security-Policy with 'frame-ancestors' directive or X-Frame-Options.

**Evidence:**
```
{
  "detail": "N/A",
  "url": "https://gpt-2-22b6d.firebaseapp.com/assets/",
  "type": "ZAP-10020-1"
}
```


#### INFO: Missing Anti-clickjacking Header

- **CWE:** CWE-1021 (Unknown)
- **Tool:** browser-scanner

**Description:**
The response does not protect against 'ClickJacking' attacks. It should include either Content-Security-Policy with 'frame-ancestors' directive or X-Frame-Options.

**Evidence:**
```
{
  "detail": "N/A",
  "url": "https://gpt-2-22b6d.firebaseapp.com/assets/app.js",
  "type": "ZAP-10020-1"
}
```


#### INFO: Missing Anti-clickjacking Header

- **CWE:** CWE-1021 (Unknown)
- **Tool:** browser-scanner

**Description:**
The response does not protect against 'ClickJacking' attacks. It should include either Content-Security-Policy with 'frame-ancestors' directive or X-Frame-Options.

**Evidence:**
```
{
  "detail": "N/A",
  "url": "https://gpt-2-22b6d.firebaseapp.com/assets/styles.css",
  "type": "ZAP-10020-1"
}
```


#### INFO: Missing Anti-clickjacking Header

- **CWE:** CWE-1021 (Unknown)
- **Tool:** browser-scanner

**Description:**
The response does not protect against 'ClickJacking' attacks. It should include either Content-Security-Policy with 'frame-ancestors' directive or X-Frame-Options.

**Evidence:**
```
{
  "detail": "N/A",
  "url": "https://gpt-2-22b6d.firebaseapp.com/static/",
  "type": "ZAP-10020-1"
}
```


#### INFO: Missing Anti-clickjacking Header

- **CWE:** CWE-1021 (Unknown)
- **Tool:** browser-scanner

**Description:**
The response does not protect against 'ClickJacking' attacks. It should include either Content-Security-Policy with 'frame-ancestors' directive or X-Frame-Options.

**Evidence:**
```
{
  "detail": "N/A",
  "url": "https://gpt-2-22b6d.firebaseapp.com/static/app.js",
  "type": "ZAP-10020-1"
}
```


#### INFO: Missing Anti-clickjacking Header

- **CWE:** CWE-1021 (Unknown)
- **Tool:** browser-scanner

**Description:**
The response does not protect against 'ClickJacking' attacks. It should include either Content-Security-Policy with 'frame-ancestors' directive or X-Frame-Options.

**Evidence:**
```
{
  "detail": "N/A",
  "url": "https://gpt-2-22b6d.firebaseapp.com/static/styles.css",
  "type": "ZAP-10020-1"
}
```


#### INFO: Missing Anti-clickjacking Header

- **CWE:** CWE-1021 (Unknown)
- **Tool:** browser-scanner

**Description:**
The response does not protect against 'ClickJacking' attacks. It should include either Content-Security-Policy with 'frame-ancestors' directive or X-Frame-Options.

**Evidence:**
```
{
  "detail": "N/A",
  "url": "https://gpt-2-22b6d.firebaseapp.com/media/",
  "type": "ZAP-10020-1"
}
```


#### INFO: Missing Anti-clickjacking Header

- **CWE:** CWE-1021 (Unknown)
- **Tool:** browser-scanner

**Description:**
The response does not protect against 'ClickJacking' attacks. It should include either Content-Security-Policy with 'frame-ancestors' directive or X-Frame-Options.

**Evidence:**
```
{
  "detail": "N/A",
  "url": "https://gpt-2-22b6d.firebaseapp.com/media/styles.css",
  "type": "ZAP-10020-1"
}
```


#### INFO: Missing Anti-clickjacking Header

- **CWE:** CWE-1021 (Unknown)
- **Tool:** browser-scanner

**Description:**
The response does not protect against 'ClickJacking' attacks. It should include either Content-Security-Policy with 'frame-ancestors' directive or X-Frame-Options.

**Evidence:**
```
{
  "detail": "N/A",
  "url": "https://gpt-2-22b6d.firebaseapp.com/media/app.js",
  "type": "ZAP-10020-1"
}
```


#### INFO: Missing Anti-clickjacking Header

- **CWE:** CWE-1021 (Unknown)
- **Tool:** browser-scanner

**Description:**
The response does not protect against 'ClickJacking' attacks. It should include either Content-Security-Policy with 'frame-ancestors' directive or X-Frame-Options.

**Evidence:**
```
{
  "detail": "N/A",
  "url": "https://gpt-2-22b6d.firebaseapp.com/backup/",
  "type": "ZAP-10020-1"
}
```


#### INFO: Missing Anti-clickjacking Header

- **CWE:** CWE-1021 (Unknown)
- **Tool:** browser-scanner

**Description:**
The response does not protect against 'ClickJacking' attacks. It should include either Content-Security-Policy with 'frame-ancestors' directive or X-Frame-Options.

**Evidence:**
```
{
  "detail": "N/A",
  "url": "https://gpt-2-22b6d.firebaseapp.com/backup/styles.css",
  "type": "ZAP-10020-1"
}
```


#### INFO: Missing Anti-clickjacking Header

- **CWE:** CWE-1021 (Unknown)
- **Tool:** browser-scanner

**Description:**
The response does not protect against 'ClickJacking' attacks. It should include either Content-Security-Policy with 'frame-ancestors' directive or X-Frame-Options.

**Evidence:**
```
{
  "detail": "N/A",
  "url": "https://gpt-2-22b6d.firebaseapp.com/backup/app.js",
  "type": "ZAP-10020-1"
}
```


#### INFO: Missing Anti-clickjacking Header

- **CWE:** CWE-1021 (Unknown)
- **Tool:** browser-scanner

**Description:**
The response does not protect against 'ClickJacking' attacks. It should include either Content-Security-Policy with 'frame-ancestors' directive or X-Frame-Options.

**Evidence:**
```
{
  "detail": "N/A",
  "url": "https://gpt-2-22b6d.firebaseapp.com/logs/",
  "type": "ZAP-10020-1"
}
```


#### INFO: Missing Anti-clickjacking Header

- **CWE:** CWE-1021 (Unknown)
- **Tool:** browser-scanner

**Description:**
The response does not protect against 'ClickJacking' attacks. It should include either Content-Security-Policy with 'frame-ancestors' directive or X-Frame-Options.

**Evidence:**
```
{
  "detail": "N/A",
  "url": "https://gpt-2-22b6d.firebaseapp.com/logs/app.js",
  "type": "ZAP-10020-1"
}
```


#### INFO: Missing Anti-clickjacking Header

- **CWE:** CWE-1021 (Unknown)
- **Tool:** browser-scanner

**Description:**
The response does not protect against 'ClickJacking' attacks. It should include either Content-Security-Policy with 'frame-ancestors' directive or X-Frame-Options.

**Evidence:**
```
{
  "detail": "N/A",
  "url": "https://gpt-2-22b6d.firebaseapp.com/logs/styles.css",
  "type": "ZAP-10020-1"
}
```


#### INFO: Missing Anti-clickjacking Header

- **CWE:** CWE-1021 (Unknown)
- **Tool:** browser-scanner

**Description:**
The response does not protect against 'ClickJacking' attacks. It should include either Content-Security-Policy with 'frame-ancestors' directive or X-Frame-Options.

**Evidence:**
```
{
  "detail": "N/A",
  "url": "https://gpt-2-22b6d.firebaseapp.com/tmp/styles.css",
  "type": "ZAP-10020-1"
}
```


#### INFO: Missing Anti-clickjacking Header

- **CWE:** CWE-1021 (Unknown)
- **Tool:** browser-scanner

**Description:**
The response does not protect against 'ClickJacking' attacks. It should include either Content-Security-Policy with 'frame-ancestors' directive or X-Frame-Options.

**Evidence:**
```
{
  "detail": "N/A",
  "url": "https://gpt-2-22b6d.firebaseapp.com/tmp/",
  "type": "ZAP-10020-1"
}
```


#### INFO: Missing Anti-clickjacking Header

- **CWE:** CWE-1021 (Unknown)
- **Tool:** browser-scanner

**Description:**
The response does not protect against 'ClickJacking' attacks. It should include either Content-Security-Policy with 'frame-ancestors' directive or X-Frame-Options.

**Evidence:**
```
{
  "detail": "N/A",
  "url": "https://gpt-2-22b6d.firebaseapp.com/tmp/app.js",
  "type": "ZAP-10020-1"
}
```


#### INFO: Missing Anti-clickjacking Header

- **CWE:** CWE-1021 (Unknown)
- **Tool:** browser-scanner

**Description:**
The response does not protect against 'ClickJacking' attacks. It should include either Content-Security-Policy with 'frame-ancestors' directive or X-Frame-Options.

**Evidence:**
```
{
  "detail": "N/A",
  "url": "https://gpt-2-22b6d.firebaseapp.com/data/",
  "type": "ZAP-10020-1"
}
```


#### INFO: Missing Anti-clickjacking Header

- **CWE:** CWE-1021 (Unknown)
- **Tool:** browser-scanner

**Description:**
The response does not protect against 'ClickJacking' attacks. It should include either Content-Security-Policy with 'frame-ancestors' directive or X-Frame-Options.

**Evidence:**
```
{
  "detail": "N/A",
  "url": "https://gpt-2-22b6d.firebaseapp.com/data/styles.css",
  "type": "ZAP-10020-1"
}
```


#### INFO: Missing Anti-clickjacking Header

- **CWE:** CWE-1021 (Unknown)
- **Tool:** browser-scanner

**Description:**
The response does not protect against 'ClickJacking' attacks. It should include either Content-Security-Policy with 'frame-ancestors' directive or X-Frame-Options.

**Evidence:**
```
{
  "detail": "N/A",
  "url": "https://gpt-2-22b6d.firebaseapp.com/data/app.js",
  "type": "ZAP-10020-1"
}
```


#### INFO: Missing Anti-clickjacking Header

- **CWE:** CWE-1021 (Unknown)
- **Tool:** browser-scanner

**Description:**
The response does not protect against 'ClickJacking' attacks. It should include either Content-Security-Policy with 'frame-ancestors' directive or X-Frame-Options.

**Evidence:**
```
{
  "detail": "N/A",
  "url": "https://gpt-2-22b6d.firebaseapp.com/admin",
  "type": "ZAP-10020-1"
}
```


#### INFO: Missing Anti-clickjacking Header

- **CWE:** CWE-1021 (Unknown)
- **Tool:** browser-scanner

**Description:**
The response does not protect against 'ClickJacking' attacks. It should include either Content-Security-Policy with 'frame-ancestors' directive or X-Frame-Options.

**Evidence:**
```
{
  "detail": "N/A",
  "url": "https://gpt-2-22b6d.firebaseapp.com/admin/",
  "type": "ZAP-10020-1"
}
```


#### INFO: Missing Anti-clickjacking Header

- **CWE:** CWE-1021 (Unknown)
- **Tool:** browser-scanner

**Description:**
The response does not protect against 'ClickJacking' attacks. It should include either Content-Security-Policy with 'frame-ancestors' directive or X-Frame-Options.

**Evidence:**
```
{
  "detail": "N/A",
  "url": "https://gpt-2-22b6d.firebaseapp.com/admin/app.js",
  "type": "ZAP-10020-1"
}
```


#### INFO: Missing Anti-clickjacking Header

- **CWE:** CWE-1021 (Unknown)
- **Tool:** browser-scanner

**Description:**
The response does not protect against 'ClickJacking' attacks. It should include either Content-Security-Policy with 'frame-ancestors' directive or X-Frame-Options.

**Evidence:**
```
{
  "detail": "N/A",
  "url": "https://gpt-2-22b6d.firebaseapp.com/admin/styles.css",
  "type": "ZAP-10020-1"
}
```


#### INFO: Missing Anti-clickjacking Header

- **CWE:** CWE-1021 (Unknown)
- **Tool:** browser-scanner

**Description:**
The response does not protect against 'ClickJacking' attacks. It should include either Content-Security-Policy with 'frame-ancestors' directive or X-Frame-Options.

**Evidence:**
```
{
  "detail": "N/A",
  "url": "https://gpt-2-22b6d.firebaseapp.com/admin/dashboard",
  "type": "ZAP-10020-1"
}
```


#### INFO: Missing Anti-clickjacking Header

- **CWE:** CWE-1021 (Unknown)
- **Tool:** browser-scanner

**Description:**
The response does not protect against 'ClickJacking' attacks. It should include either Content-Security-Policy with 'frame-ancestors' directive or X-Frame-Options.

**Evidence:**
```
{
  "detail": "N/A",
  "url": "https://gpt-2-22b6d.firebaseapp.com/admin/users",
  "type": "ZAP-10020-1"
}
```


#### INFO: Missing Anti-clickjacking Header

- **CWE:** CWE-1021 (Unknown)
- **Tool:** browser-scanner

**Description:**
The response does not protect against 'ClickJacking' attacks. It should include either Content-Security-Policy with 'frame-ancestors' directive or X-Frame-Options.

**Evidence:**
```
{
  "detail": "N/A",
  "url": "https://gpt-2-22b6d.firebaseapp.com/admin/settings",
  "type": "ZAP-10020-1"
}
```


#### INFO: Missing Anti-clickjacking Header

- **CWE:** CWE-1021 (Unknown)
- **Tool:** browser-scanner

**Description:**
The response does not protect against 'ClickJacking' attacks. It should include either Content-Security-Policy with 'frame-ancestors' directive or X-Frame-Options.

**Evidence:**
```
{
  "detail": "N/A",
  "url": "https://gpt-2-22b6d.firebaseapp.com/administrator",
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
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js\"></script>",
  "url": "https://gpt-2-22b6d.firebaseapp.com/",
  "type": "ZAP-10109"
}
```


#### INFO: Modern Web Application

- **CWE:** CWE--1 (Unknown)
- **Tool:** browser-scanner

**Description:**
The application appears to be a modern web application. If you need to explore it automatically then the Ajax Spider may well be more effective than the standard one.

**Evidence:**
```
{
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js\"></script>",
  "url": "https://gpt-2-22b6d.firebaseapp.com/home",
  "type": "ZAP-10109"
}
```


#### INFO: Modern Web Application

- **CWE:** CWE--1 (Unknown)
- **Tool:** browser-scanner

**Description:**
The application appears to be a modern web application. If you need to explore it automatically then the Ajax Spider may well be more effective than the standard one.

**Evidence:**
```
{
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js\"></script>",
  "url": "https://gpt-2-22b6d.firebaseapp.com/profile",
  "type": "ZAP-10109"
}
```


#### INFO: Modern Web Application

- **CWE:** CWE--1 (Unknown)
- **Tool:** browser-scanner

**Description:**
The application appears to be a modern web application. If you need to explore it automatically then the Ajax Spider may well be more effective than the standard one.

**Evidence:**
```
{
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js\"></script>",
  "url": "https://gpt-2-22b6d.firebaseapp.com/settings",
  "type": "ZAP-10109"
}
```


#### INFO: Modern Web Application

- **CWE:** CWE--1 (Unknown)
- **Tool:** browser-scanner

**Description:**
The application appears to be a modern web application. If you need to explore it automatically then the Ajax Spider may well be more effective than the standard one.

**Evidence:**
```
{
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js\"></script>",
  "url": "https://gpt-2-22b6d.firebaseapp.com/posts",
  "type": "ZAP-10109"
}
```


#### INFO: Modern Web Application

- **CWE:** CWE--1 (Unknown)
- **Tool:** browser-scanner

**Description:**
The application appears to be a modern web application. If you need to explore it automatically then the Ajax Spider may well be more effective than the standard one.

**Evidence:**
```
{
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js\"></script>",
  "url": "https://gpt-2-22b6d.firebaseapp.com/messages",
  "type": "ZAP-10109"
}
```


#### INFO: Modern Web Application

- **CWE:** CWE--1 (Unknown)
- **Tool:** browser-scanner

**Description:**
The application appears to be a modern web application. If you need to explore it automatically then the Ajax Spider may well be more effective than the standard one.

**Evidence:**
```
{
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js\"></script>",
  "url": "https://gpt-2-22b6d.firebaseapp.com/feed",
  "type": "ZAP-10109"
}
```


#### INFO: Modern Web Application

- **CWE:** CWE--1 (Unknown)
- **Tool:** browser-scanner

**Description:**
The application appears to be a modern web application. If you need to explore it automatically then the Ajax Spider may well be more effective than the standard one.

**Evidence:**
```
{
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js\"></script>",
  "url": "https://gpt-2-22b6d.firebaseapp.com/__nonexistent__1765813078782_e1794ca5e1b25",
  "type": "ZAP-10109"
}
```


#### INFO: Modern Web Application

- **CWE:** CWE--1 (Unknown)
- **Tool:** browser-scanner

**Description:**
The application appears to be a modern web application. If you need to explore it automatically then the Ajax Spider may well be more effective than the standard one.

**Evidence:**
```
{
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js\"></script>",
  "url": "https://gpt-2-22b6d.firebaseapp.com/?file=..%2F..%2F..%2Fetc%2Fpasswd",
  "type": "ZAP-10109"
}
```


#### INFO: Modern Web Application

- **CWE:** CWE--1 (Unknown)
- **Tool:** browser-scanner

**Description:**
The application appears to be a modern web application. If you need to explore it automatically then the Ajax Spider may well be more effective than the standard one.

**Evidence:**
```
{
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js\"></script>",
  "url": "https://gpt-2-22b6d.firebaseapp.com/?file=..%5C..%5C..%5Cwindows%5Cwin.ini",
  "type": "ZAP-10109"
}
```


#### INFO: Modern Web Application

- **CWE:** CWE--1 (Unknown)
- **Tool:** browser-scanner

**Description:**
The application appears to be a modern web application. If you need to explore it automatically then the Ajax Spider may well be more effective than the standard one.

**Evidence:**
```
{
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js\"></script>",
  "url": "https://gpt-2-22b6d.firebaseapp.com/?file=....%2F%2F....%2F%2F....%2F%2Fetc%2Fpasswd",
  "type": "ZAP-10109"
}
```


#### INFO: Modern Web Application

- **CWE:** CWE--1 (Unknown)
- **Tool:** browser-scanner

**Description:**
The application appears to be a modern web application. If you need to explore it automatically then the Ajax Spider may well be more effective than the standard one.

**Evidence:**
```
{
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js\"></script>",
  "url": "https://gpt-2-22b6d.firebaseapp.com/?file=..%252f..%252f..%252fetc%2Fpasswd",
  "type": "ZAP-10109"
}
```


#### INFO: Modern Web Application

- **CWE:** CWE--1 (Unknown)
- **Tool:** browser-scanner

**Description:**
The application appears to be a modern web application. If you need to explore it automatically then the Ajax Spider may well be more effective than the standard one.

**Evidence:**
```
{
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js\"></script>",
  "url": "https://gpt-2-22b6d.firebaseapp.com/?path=..%2F..%2F..%2Fetc%2Fpasswd",
  "type": "ZAP-10109"
}
```


#### INFO: Modern Web Application

- **CWE:** CWE--1 (Unknown)
- **Tool:** browser-scanner

**Description:**
The application appears to be a modern web application. If you need to explore it automatically then the Ajax Spider may well be more effective than the standard one.

**Evidence:**
```
{
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js\"></script>",
  "url": "https://gpt-2-22b6d.firebaseapp.com/?path=..%5C..%5C..%5Cwindows%5Cwin.ini",
  "type": "ZAP-10109"
}
```


#### INFO: Modern Web Application

- **CWE:** CWE--1 (Unknown)
- **Tool:** browser-scanner

**Description:**
The application appears to be a modern web application. If you need to explore it automatically then the Ajax Spider may well be more effective than the standard one.

**Evidence:**
```
{
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js\"></script>",
  "url": "https://gpt-2-22b6d.firebaseapp.com/?path=....%2F%2F....%2F%2F....%2F%2Fetc%2Fpasswd",
  "type": "ZAP-10109"
}
```


#### INFO: Modern Web Application

- **CWE:** CWE--1 (Unknown)
- **Tool:** browser-scanner

**Description:**
The application appears to be a modern web application. If you need to explore it automatically then the Ajax Spider may well be more effective than the standard one.

**Evidence:**
```
{
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js\"></script>",
  "url": "https://gpt-2-22b6d.firebaseapp.com/?path=..%252f..%252f..%252fetc%2Fpasswd",
  "type": "ZAP-10109"
}
```


#### INFO: Modern Web Application

- **CWE:** CWE--1 (Unknown)
- **Tool:** browser-scanner

**Description:**
The application appears to be a modern web application. If you need to explore it automatically then the Ajax Spider may well be more effective than the standard one.

**Evidence:**
```
{
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js\"></script>",
  "url": "https://gpt-2-22b6d.firebaseapp.com/?filepath=..%2F..%2F..%2Fetc%2Fpasswd",
  "type": "ZAP-10109"
}
```


#### INFO: Modern Web Application

- **CWE:** CWE--1 (Unknown)
- **Tool:** browser-scanner

**Description:**
The application appears to be a modern web application. If you need to explore it automatically then the Ajax Spider may well be more effective than the standard one.

**Evidence:**
```
{
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js\"></script>",
  "url": "https://gpt-2-22b6d.firebaseapp.com/?filepath=..%5C..%5C..%5Cwindows%5Cwin.ini",
  "type": "ZAP-10109"
}
```


#### INFO: Modern Web Application

- **CWE:** CWE--1 (Unknown)
- **Tool:** browser-scanner

**Description:**
The application appears to be a modern web application. If you need to explore it automatically then the Ajax Spider may well be more effective than the standard one.

**Evidence:**
```
{
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js\"></script>",
  "url": "https://gpt-2-22b6d.firebaseapp.com/?filepath=....%2F%2F....%2F%2F....%2F%2Fetc%2Fpasswd",
  "type": "ZAP-10109"
}
```


#### INFO: Modern Web Application

- **CWE:** CWE--1 (Unknown)
- **Tool:** browser-scanner

**Description:**
The application appears to be a modern web application. If you need to explore it automatically then the Ajax Spider may well be more effective than the standard one.

**Evidence:**
```
{
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js\"></script>",
  "url": "https://gpt-2-22b6d.firebaseapp.com/?filepath=..%252f..%252f..%252fetc%2Fpasswd",
  "type": "ZAP-10109"
}
```


#### INFO: Modern Web Application

- **CWE:** CWE--1 (Unknown)
- **Tool:** browser-scanner

**Description:**
The application appears to be a modern web application. If you need to explore it automatically then the Ajax Spider may well be more effective than the standard one.

**Evidence:**
```
{
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js\"></script>",
  "url": "https://gpt-2-22b6d.firebaseapp.com/?document=..%2F..%2F..%2Fetc%2Fpasswd",
  "type": "ZAP-10109"
}
```


#### INFO: Modern Web Application

- **CWE:** CWE--1 (Unknown)
- **Tool:** browser-scanner

**Description:**
The application appears to be a modern web application. If you need to explore it automatically then the Ajax Spider may well be more effective than the standard one.

**Evidence:**
```
{
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js\"></script>",
  "url": "https://gpt-2-22b6d.firebaseapp.com/?document=..%5C..%5C..%5Cwindows%5Cwin.ini",
  "type": "ZAP-10109"
}
```


#### INFO: Modern Web Application

- **CWE:** CWE--1 (Unknown)
- **Tool:** browser-scanner

**Description:**
The application appears to be a modern web application. If you need to explore it automatically then the Ajax Spider may well be more effective than the standard one.

**Evidence:**
```
{
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js\"></script>",
  "url": "https://gpt-2-22b6d.firebaseapp.com/?document=....%2F%2F....%2F%2F....%2F%2Fetc%2Fpasswd",
  "type": "ZAP-10109"
}
```


#### INFO: Modern Web Application

- **CWE:** CWE--1 (Unknown)
- **Tool:** browser-scanner

**Description:**
The application appears to be a modern web application. If you need to explore it automatically then the Ajax Spider may well be more effective than the standard one.

**Evidence:**
```
{
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js\"></script>",
  "url": "https://gpt-2-22b6d.firebaseapp.com/?document=..%252f..%252f..%252fetc%2Fpasswd",
  "type": "ZAP-10109"
}
```


#### INFO: Modern Web Application

- **CWE:** CWE--1 (Unknown)
- **Tool:** browser-scanner

**Description:**
The application appears to be a modern web application. If you need to explore it automatically then the Ajax Spider may well be more effective than the standard one.

**Evidence:**
```
{
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js\"></script>",
  "url": "https://gpt-2-22b6d.firebaseapp.com/?doc=..%2F..%2F..%2Fetc%2Fpasswd",
  "type": "ZAP-10109"
}
```


#### INFO: Modern Web Application

- **CWE:** CWE--1 (Unknown)
- **Tool:** browser-scanner

**Description:**
The application appears to be a modern web application. If you need to explore it automatically then the Ajax Spider may well be more effective than the standard one.

**Evidence:**
```
{
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js\"></script>",
  "url": "https://gpt-2-22b6d.firebaseapp.com/?doc=..%5C..%5C..%5Cwindows%5Cwin.ini",
  "type": "ZAP-10109"
}
```


#### INFO: Modern Web Application

- **CWE:** CWE--1 (Unknown)
- **Tool:** browser-scanner

**Description:**
The application appears to be a modern web application. If you need to explore it automatically then the Ajax Spider may well be more effective than the standard one.

**Evidence:**
```
{
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js\"></script>",
  "url": "https://gpt-2-22b6d.firebaseapp.com/?doc=....%2F%2F....%2F%2F....%2F%2Fetc%2Fpasswd",
  "type": "ZAP-10109"
}
```


#### INFO: Modern Web Application

- **CWE:** CWE--1 (Unknown)
- **Tool:** browser-scanner

**Description:**
The application appears to be a modern web application. If you need to explore it automatically then the Ajax Spider may well be more effective than the standard one.

**Evidence:**
```
{
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js\"></script>",
  "url": "https://gpt-2-22b6d.firebaseapp.com/?doc=..%252f..%252f..%252fetc%2Fpasswd",
  "type": "ZAP-10109"
}
```


#### INFO: Modern Web Application

- **CWE:** CWE--1 (Unknown)
- **Tool:** browser-scanner

**Description:**
The application appears to be a modern web application. If you need to explore it automatically then the Ajax Spider may well be more effective than the standard one.

**Evidence:**
```
{
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js\"></script>",
  "url": "https://gpt-2-22b6d.firebaseapp.com/?page=..%2F..%2F..%2Fetc%2Fpasswd",
  "type": "ZAP-10109"
}
```


#### INFO: Modern Web Application

- **CWE:** CWE--1 (Unknown)
- **Tool:** browser-scanner

**Description:**
The application appears to be a modern web application. If you need to explore it automatically then the Ajax Spider may well be more effective than the standard one.

**Evidence:**
```
{
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js\"></script>",
  "url": "https://gpt-2-22b6d.firebaseapp.com/?page=..%5C..%5C..%5Cwindows%5Cwin.ini",
  "type": "ZAP-10109"
}
```


#### INFO: Modern Web Application

- **CWE:** CWE--1 (Unknown)
- **Tool:** browser-scanner

**Description:**
The application appears to be a modern web application. If you need to explore it automatically then the Ajax Spider may well be more effective than the standard one.

**Evidence:**
```
{
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js\"></script>",
  "url": "https://gpt-2-22b6d.firebaseapp.com/?page=....%2F%2F....%2F%2F....%2F%2Fetc%2Fpasswd",
  "type": "ZAP-10109"
}
```


#### INFO: Modern Web Application

- **CWE:** CWE--1 (Unknown)
- **Tool:** browser-scanner

**Description:**
The application appears to be a modern web application. If you need to explore it automatically then the Ajax Spider may well be more effective than the standard one.

**Evidence:**
```
{
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js\"></script>",
  "url": "https://gpt-2-22b6d.firebaseapp.com/?page=..%252f..%252f..%252fetc%2Fpasswd",
  "type": "ZAP-10109"
}
```


#### INFO: Modern Web Application

- **CWE:** CWE--1 (Unknown)
- **Tool:** browser-scanner

**Description:**
The application appears to be a modern web application. If you need to explore it automatically then the Ajax Spider may well be more effective than the standard one.

**Evidence:**
```
{
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js\"></script>",
  "url": "https://gpt-2-22b6d.firebaseapp.com/?template=..%2F..%2F..%2Fetc%2Fpasswd",
  "type": "ZAP-10109"
}
```


#### INFO: Modern Web Application

- **CWE:** CWE--1 (Unknown)
- **Tool:** browser-scanner

**Description:**
The application appears to be a modern web application. If you need to explore it automatically then the Ajax Spider may well be more effective than the standard one.

**Evidence:**
```
{
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js\"></script>",
  "url": "https://gpt-2-22b6d.firebaseapp.com/?template=..%5C..%5C..%5Cwindows%5Cwin.ini",
  "type": "ZAP-10109"
}
```


#### INFO: Modern Web Application

- **CWE:** CWE--1 (Unknown)
- **Tool:** browser-scanner

**Description:**
The application appears to be a modern web application. If you need to explore it automatically then the Ajax Spider may well be more effective than the standard one.

**Evidence:**
```
{
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js\"></script>",
  "url": "https://gpt-2-22b6d.firebaseapp.com/?template=....%2F%2F....%2F%2F....%2F%2Fetc%2Fpasswd",
  "type": "ZAP-10109"
}
```


#### INFO: Modern Web Application

- **CWE:** CWE--1 (Unknown)
- **Tool:** browser-scanner

**Description:**
The application appears to be a modern web application. If you need to explore it automatically then the Ajax Spider may well be more effective than the standard one.

**Evidence:**
```
{
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js\"></script>",
  "url": "https://gpt-2-22b6d.firebaseapp.com/?template=..%252f..%252f..%252fetc%2Fpasswd",
  "type": "ZAP-10109"
}
```


#### INFO: Modern Web Application

- **CWE:** CWE--1 (Unknown)
- **Tool:** browser-scanner

**Description:**
The application appears to be a modern web application. If you need to explore it automatically then the Ajax Spider may well be more effective than the standard one.

**Evidence:**
```
{
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js\"></script>",
  "url": "https://gpt-2-22b6d.firebaseapp.com/?include=..%2F..%2F..%2Fetc%2Fpasswd",
  "type": "ZAP-10109"
}
```


#### INFO: Modern Web Application

- **CWE:** CWE--1 (Unknown)
- **Tool:** browser-scanner

**Description:**
The application appears to be a modern web application. If you need to explore it automatically then the Ajax Spider may well be more effective than the standard one.

**Evidence:**
```
{
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js\"></script>",
  "url": "https://gpt-2-22b6d.firebaseapp.com/?include=..%5C..%5C..%5Cwindows%5Cwin.ini",
  "type": "ZAP-10109"
}
```


#### INFO: Modern Web Application

- **CWE:** CWE--1 (Unknown)
- **Tool:** browser-scanner

**Description:**
The application appears to be a modern web application. If you need to explore it automatically then the Ajax Spider may well be more effective than the standard one.

**Evidence:**
```
{
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js\"></script>",
  "url": "https://gpt-2-22b6d.firebaseapp.com/?include=....%2F%2F....%2F%2F....%2F%2Fetc%2Fpasswd",
  "type": "ZAP-10109"
}
```


#### INFO: Modern Web Application

- **CWE:** CWE--1 (Unknown)
- **Tool:** browser-scanner

**Description:**
The application appears to be a modern web application. If you need to explore it automatically then the Ajax Spider may well be more effective than the standard one.

**Evidence:**
```
{
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js\"></script>",
  "url": "https://gpt-2-22b6d.firebaseapp.com/?include=..%252f..%252f..%252fetc%2Fpasswd",
  "type": "ZAP-10109"
}
```


#### INFO: Modern Web Application

- **CWE:** CWE--1 (Unknown)
- **Tool:** browser-scanner

**Description:**
The application appears to be a modern web application. If you need to explore it automatically then the Ajax Spider may well be more effective than the standard one.

**Evidence:**
```
{
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js\"></script>",
  "url": "https://gpt-2-22b6d.firebaseapp.com/?dir=..%2F..%2F..%2Fetc%2Fpasswd",
  "type": "ZAP-10109"
}
```


#### INFO: Modern Web Application

- **CWE:** CWE--1 (Unknown)
- **Tool:** browser-scanner

**Description:**
The application appears to be a modern web application. If you need to explore it automatically then the Ajax Spider may well be more effective than the standard one.

**Evidence:**
```
{
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js\"></script>",
  "url": "https://gpt-2-22b6d.firebaseapp.com/?dir=..%5C..%5C..%5Cwindows%5Cwin.ini",
  "type": "ZAP-10109"
}
```


#### INFO: Modern Web Application

- **CWE:** CWE--1 (Unknown)
- **Tool:** browser-scanner

**Description:**
The application appears to be a modern web application. If you need to explore it automatically then the Ajax Spider may well be more effective than the standard one.

**Evidence:**
```
{
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js\"></script>",
  "url": "https://gpt-2-22b6d.firebaseapp.com/?dir=....%2F%2F....%2F%2F....%2F%2Fetc%2Fpasswd",
  "type": "ZAP-10109"
}
```


#### INFO: Modern Web Application

- **CWE:** CWE--1 (Unknown)
- **Tool:** browser-scanner

**Description:**
The application appears to be a modern web application. If you need to explore it automatically then the Ajax Spider may well be more effective than the standard one.

**Evidence:**
```
{
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js\"></script>",
  "url": "https://gpt-2-22b6d.firebaseapp.com/?dir=..%252f..%252f..%252fetc%2Fpasswd",
  "type": "ZAP-10109"
}
```


#### INFO: Modern Web Application

- **CWE:** CWE--1 (Unknown)
- **Tool:** browser-scanner

**Description:**
The application appears to be a modern web application. If you need to explore it automatically then the Ajax Spider may well be more effective than the standard one.

**Evidence:**
```
{
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js\"></script>",
  "url": "https://gpt-2-22b6d.firebaseapp.com/?folder=..%2F..%2F..%2Fetc%2Fpasswd",
  "type": "ZAP-10109"
}
```


#### INFO: Modern Web Application

- **CWE:** CWE--1 (Unknown)
- **Tool:** browser-scanner

**Description:**
The application appears to be a modern web application. If you need to explore it automatically then the Ajax Spider may well be more effective than the standard one.

**Evidence:**
```
{
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js\"></script>",
  "url": "https://gpt-2-22b6d.firebaseapp.com/?folder=..%5C..%5C..%5Cwindows%5Cwin.ini",
  "type": "ZAP-10109"
}
```


#### INFO: Modern Web Application

- **CWE:** CWE--1 (Unknown)
- **Tool:** browser-scanner

**Description:**
The application appears to be a modern web application. If you need to explore it automatically then the Ajax Spider may well be more effective than the standard one.

**Evidence:**
```
{
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js\"></script>",
  "url": "https://gpt-2-22b6d.firebaseapp.com/?folder=....%2F%2F....%2F%2F....%2F%2Fetc%2Fpasswd",
  "type": "ZAP-10109"
}
```


#### INFO: Modern Web Application

- **CWE:** CWE--1 (Unknown)
- **Tool:** browser-scanner

**Description:**
The application appears to be a modern web application. If you need to explore it automatically then the Ajax Spider may well be more effective than the standard one.

**Evidence:**
```
{
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js\"></script>",
  "url": "https://gpt-2-22b6d.firebaseapp.com/?folder=..%252f..%252f..%252fetc%2Fpasswd",
  "type": "ZAP-10109"
}
```


#### INFO: Modern Web Application

- **CWE:** CWE--1 (Unknown)
- **Tool:** browser-scanner

**Description:**
The application appears to be a modern web application. If you need to explore it automatically then the Ajax Spider may well be more effective than the standard one.

**Evidence:**
```
{
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js\"></script>",
  "url": "https://gpt-2-22b6d.firebaseapp.com/?load=..%2F..%2F..%2Fetc%2Fpasswd",
  "type": "ZAP-10109"
}
```


#### INFO: Modern Web Application

- **CWE:** CWE--1 (Unknown)
- **Tool:** browser-scanner

**Description:**
The application appears to be a modern web application. If you need to explore it automatically then the Ajax Spider may well be more effective than the standard one.

**Evidence:**
```
{
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js\"></script>",
  "url": "https://gpt-2-22b6d.firebaseapp.com/?load=..%5C..%5C..%5Cwindows%5Cwin.ini",
  "type": "ZAP-10109"
}
```


#### INFO: Modern Web Application

- **CWE:** CWE--1 (Unknown)
- **Tool:** browser-scanner

**Description:**
The application appears to be a modern web application. If you need to explore it automatically then the Ajax Spider may well be more effective than the standard one.

**Evidence:**
```
{
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js\"></script>",
  "url": "https://gpt-2-22b6d.firebaseapp.com/?load=....%2F%2F....%2F%2F....%2F%2Fetc%2Fpasswd",
  "type": "ZAP-10109"
}
```


#### INFO: Modern Web Application

- **CWE:** CWE--1 (Unknown)
- **Tool:** browser-scanner

**Description:**
The application appears to be a modern web application. If you need to explore it automatically then the Ajax Spider may well be more effective than the standard one.

**Evidence:**
```
{
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js\"></script>",
  "url": "https://gpt-2-22b6d.firebaseapp.com/?load=..%252f..%252f..%252fetc%2Fpasswd",
  "type": "ZAP-10109"
}
```


#### INFO: Modern Web Application

- **CWE:** CWE--1 (Unknown)
- **Tool:** browser-scanner

**Description:**
The application appears to be a modern web application. If you need to explore it automatically then the Ajax Spider may well be more effective than the standard one.

**Evidence:**
```
{
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js\"></script>",
  "url": "https://gpt-2-22b6d.firebaseapp.com/?read=..%2F..%2F..%2Fetc%2Fpasswd",
  "type": "ZAP-10109"
}
```


#### INFO: Modern Web Application

- **CWE:** CWE--1 (Unknown)
- **Tool:** browser-scanner

**Description:**
The application appears to be a modern web application. If you need to explore it automatically then the Ajax Spider may well be more effective than the standard one.

**Evidence:**
```
{
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js\"></script>",
  "url": "https://gpt-2-22b6d.firebaseapp.com/?read=..%5C..%5C..%5Cwindows%5Cwin.ini",
  "type": "ZAP-10109"
}
```


#### INFO: Modern Web Application

- **CWE:** CWE--1 (Unknown)
- **Tool:** browser-scanner

**Description:**
The application appears to be a modern web application. If you need to explore it automatically then the Ajax Spider may well be more effective than the standard one.

**Evidence:**
```
{
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js\"></script>",
  "url": "https://gpt-2-22b6d.firebaseapp.com/?read=....%2F%2F....%2F%2F....%2F%2Fetc%2Fpasswd",
  "type": "ZAP-10109"
}
```


#### INFO: Modern Web Application

- **CWE:** CWE--1 (Unknown)
- **Tool:** browser-scanner

**Description:**
The application appears to be a modern web application. If you need to explore it automatically then the Ajax Spider may well be more effective than the standard one.

**Evidence:**
```
{
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js\"></script>",
  "url": "https://gpt-2-22b6d.firebaseapp.com/?read=..%252f..%252f..%252fetc%2Fpasswd",
  "type": "ZAP-10109"
}
```


#### INFO: Modern Web Application

- **CWE:** CWE--1 (Unknown)
- **Tool:** browser-scanner

**Description:**
The application appears to be a modern web application. If you need to explore it automatically then the Ajax Spider may well be more effective than the standard one.

**Evidence:**
```
{
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js\"></script>",
  "url": "https://gpt-2-22b6d.firebaseapp.com/images/",
  "type": "ZAP-10109"
}
```


#### INFO: Modern Web Application

- **CWE:** CWE--1 (Unknown)
- **Tool:** browser-scanner

**Description:**
The application appears to be a modern web application. If you need to explore it automatically then the Ajax Spider may well be more effective than the standard one.

**Evidence:**
```
{
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js\"></script>",
  "url": "https://gpt-2-22b6d.firebaseapp.com/images/app.js",
  "type": "ZAP-10109"
}
```


#### INFO: Modern Web Application

- **CWE:** CWE--1 (Unknown)
- **Tool:** browser-scanner

**Description:**
The application appears to be a modern web application. If you need to explore it automatically then the Ajax Spider may well be more effective than the standard one.

**Evidence:**
```
{
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js\"></script>",
  "url": "https://gpt-2-22b6d.firebaseapp.com/images/styles.css",
  "type": "ZAP-10109"
}
```


#### INFO: Modern Web Application

- **CWE:** CWE--1 (Unknown)
- **Tool:** browser-scanner

**Description:**
The application appears to be a modern web application. If you need to explore it automatically then the Ajax Spider may well be more effective than the standard one.

**Evidence:**
```
{
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js\"></script>",
  "url": "https://gpt-2-22b6d.firebaseapp.com/uploads/",
  "type": "ZAP-10109"
}
```


#### INFO: Modern Web Application

- **CWE:** CWE--1 (Unknown)
- **Tool:** browser-scanner

**Description:**
The application appears to be a modern web application. If you need to explore it automatically then the Ajax Spider may well be more effective than the standard one.

**Evidence:**
```
{
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js\"></script>",
  "url": "https://gpt-2-22b6d.firebaseapp.com/uploads/styles.css",
  "type": "ZAP-10109"
}
```


#### INFO: Modern Web Application

- **CWE:** CWE--1 (Unknown)
- **Tool:** browser-scanner

**Description:**
The application appears to be a modern web application. If you need to explore it automatically then the Ajax Spider may well be more effective than the standard one.

**Evidence:**
```
{
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js\"></script>",
  "url": "https://gpt-2-22b6d.firebaseapp.com/uploads/app.js",
  "type": "ZAP-10109"
}
```


#### INFO: Modern Web Application

- **CWE:** CWE--1 (Unknown)
- **Tool:** browser-scanner

**Description:**
The application appears to be a modern web application. If you need to explore it automatically then the Ajax Spider may well be more effective than the standard one.

**Evidence:**
```
{
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js\"></script>",
  "url": "https://gpt-2-22b6d.firebaseapp.com/files/styles.css",
  "type": "ZAP-10109"
}
```


#### INFO: Modern Web Application

- **CWE:** CWE--1 (Unknown)
- **Tool:** browser-scanner

**Description:**
The application appears to be a modern web application. If you need to explore it automatically then the Ajax Spider may well be more effective than the standard one.

**Evidence:**
```
{
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js\"></script>",
  "url": "https://gpt-2-22b6d.firebaseapp.com/files/",
  "type": "ZAP-10109"
}
```


#### INFO: Modern Web Application

- **CWE:** CWE--1 (Unknown)
- **Tool:** browser-scanner

**Description:**
The application appears to be a modern web application. If you need to explore it automatically then the Ajax Spider may well be more effective than the standard one.

**Evidence:**
```
{
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js\"></script>",
  "url": "https://gpt-2-22b6d.firebaseapp.com/files/app.js",
  "type": "ZAP-10109"
}
```


#### INFO: Modern Web Application

- **CWE:** CWE--1 (Unknown)
- **Tool:** browser-scanner

**Description:**
The application appears to be a modern web application. If you need to explore it automatically then the Ajax Spider may well be more effective than the standard one.

**Evidence:**
```
{
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js\"></script>",
  "url": "https://gpt-2-22b6d.firebaseapp.com/assets/",
  "type": "ZAP-10109"
}
```


#### INFO: Modern Web Application

- **CWE:** CWE--1 (Unknown)
- **Tool:** browser-scanner

**Description:**
The application appears to be a modern web application. If you need to explore it automatically then the Ajax Spider may well be more effective than the standard one.

**Evidence:**
```
{
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js\"></script>",
  "url": "https://gpt-2-22b6d.firebaseapp.com/assets/app.js",
  "type": "ZAP-10109"
}
```


#### INFO: Modern Web Application

- **CWE:** CWE--1 (Unknown)
- **Tool:** browser-scanner

**Description:**
The application appears to be a modern web application. If you need to explore it automatically then the Ajax Spider may well be more effective than the standard one.

**Evidence:**
```
{
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js\"></script>",
  "url": "https://gpt-2-22b6d.firebaseapp.com/assets/styles.css",
  "type": "ZAP-10109"
}
```


#### INFO: Modern Web Application

- **CWE:** CWE--1 (Unknown)
- **Tool:** browser-scanner

**Description:**
The application appears to be a modern web application. If you need to explore it automatically then the Ajax Spider may well be more effective than the standard one.

**Evidence:**
```
{
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js\"></script>",
  "url": "https://gpt-2-22b6d.firebaseapp.com/static/",
  "type": "ZAP-10109"
}
```


#### INFO: Modern Web Application

- **CWE:** CWE--1 (Unknown)
- **Tool:** browser-scanner

**Description:**
The application appears to be a modern web application. If you need to explore it automatically then the Ajax Spider may well be more effective than the standard one.

**Evidence:**
```
{
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js\"></script>",
  "url": "https://gpt-2-22b6d.firebaseapp.com/static/app.js",
  "type": "ZAP-10109"
}
```


#### INFO: Modern Web Application

- **CWE:** CWE--1 (Unknown)
- **Tool:** browser-scanner

**Description:**
The application appears to be a modern web application. If you need to explore it automatically then the Ajax Spider may well be more effective than the standard one.

**Evidence:**
```
{
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js\"></script>",
  "url": "https://gpt-2-22b6d.firebaseapp.com/static/styles.css",
  "type": "ZAP-10109"
}
```


#### INFO: Modern Web Application

- **CWE:** CWE--1 (Unknown)
- **Tool:** browser-scanner

**Description:**
The application appears to be a modern web application. If you need to explore it automatically then the Ajax Spider may well be more effective than the standard one.

**Evidence:**
```
{
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js\"></script>",
  "url": "https://gpt-2-22b6d.firebaseapp.com/media/",
  "type": "ZAP-10109"
}
```


#### INFO: Modern Web Application

- **CWE:** CWE--1 (Unknown)
- **Tool:** browser-scanner

**Description:**
The application appears to be a modern web application. If you need to explore it automatically then the Ajax Spider may well be more effective than the standard one.

**Evidence:**
```
{
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js\"></script>",
  "url": "https://gpt-2-22b6d.firebaseapp.com/media/styles.css",
  "type": "ZAP-10109"
}
```


#### INFO: Modern Web Application

- **CWE:** CWE--1 (Unknown)
- **Tool:** browser-scanner

**Description:**
The application appears to be a modern web application. If you need to explore it automatically then the Ajax Spider may well be more effective than the standard one.

**Evidence:**
```
{
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js\"></script>",
  "url": "https://gpt-2-22b6d.firebaseapp.com/media/app.js",
  "type": "ZAP-10109"
}
```


#### INFO: Modern Web Application

- **CWE:** CWE--1 (Unknown)
- **Tool:** browser-scanner

**Description:**
The application appears to be a modern web application. If you need to explore it automatically then the Ajax Spider may well be more effective than the standard one.

**Evidence:**
```
{
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js\"></script>",
  "url": "https://gpt-2-22b6d.firebaseapp.com/backup/",
  "type": "ZAP-10109"
}
```


#### INFO: Modern Web Application

- **CWE:** CWE--1 (Unknown)
- **Tool:** browser-scanner

**Description:**
The application appears to be a modern web application. If you need to explore it automatically then the Ajax Spider may well be more effective than the standard one.

**Evidence:**
```
{
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js\"></script>",
  "url": "https://gpt-2-22b6d.firebaseapp.com/backup/styles.css",
  "type": "ZAP-10109"
}
```


#### INFO: Modern Web Application

- **CWE:** CWE--1 (Unknown)
- **Tool:** browser-scanner

**Description:**
The application appears to be a modern web application. If you need to explore it automatically then the Ajax Spider may well be more effective than the standard one.

**Evidence:**
```
{
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js\"></script>",
  "url": "https://gpt-2-22b6d.firebaseapp.com/backup/app.js",
  "type": "ZAP-10109"
}
```


#### INFO: Modern Web Application

- **CWE:** CWE--1 (Unknown)
- **Tool:** browser-scanner

**Description:**
The application appears to be a modern web application. If you need to explore it automatically then the Ajax Spider may well be more effective than the standard one.

**Evidence:**
```
{
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js\"></script>",
  "url": "https://gpt-2-22b6d.firebaseapp.com/logs/app.js",
  "type": "ZAP-10109"
}
```


#### INFO: Modern Web Application

- **CWE:** CWE--1 (Unknown)
- **Tool:** browser-scanner

**Description:**
The application appears to be a modern web application. If you need to explore it automatically then the Ajax Spider may well be more effective than the standard one.

**Evidence:**
```
{
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js\"></script>",
  "url": "https://gpt-2-22b6d.firebaseapp.com/logs/",
  "type": "ZAP-10109"
}
```


#### INFO: Modern Web Application

- **CWE:** CWE--1 (Unknown)
- **Tool:** browser-scanner

**Description:**
The application appears to be a modern web application. If you need to explore it automatically then the Ajax Spider may well be more effective than the standard one.

**Evidence:**
```
{
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js\"></script>",
  "url": "https://gpt-2-22b6d.firebaseapp.com/logs/styles.css",
  "type": "ZAP-10109"
}
```


#### INFO: Modern Web Application

- **CWE:** CWE--1 (Unknown)
- **Tool:** browser-scanner

**Description:**
The application appears to be a modern web application. If you need to explore it automatically then the Ajax Spider may well be more effective than the standard one.

**Evidence:**
```
{
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js\"></script>",
  "url": "https://gpt-2-22b6d.firebaseapp.com/tmp/styles.css",
  "type": "ZAP-10109"
}
```


#### INFO: Modern Web Application

- **CWE:** CWE--1 (Unknown)
- **Tool:** browser-scanner

**Description:**
The application appears to be a modern web application. If you need to explore it automatically then the Ajax Spider may well be more effective than the standard one.

**Evidence:**
```
{
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js\"></script>",
  "url": "https://gpt-2-22b6d.firebaseapp.com/tmp/",
  "type": "ZAP-10109"
}
```


#### INFO: Modern Web Application

- **CWE:** CWE--1 (Unknown)
- **Tool:** browser-scanner

**Description:**
The application appears to be a modern web application. If you need to explore it automatically then the Ajax Spider may well be more effective than the standard one.

**Evidence:**
```
{
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js\"></script>",
  "url": "https://gpt-2-22b6d.firebaseapp.com/tmp/app.js",
  "type": "ZAP-10109"
}
```


#### INFO: Modern Web Application

- **CWE:** CWE--1 (Unknown)
- **Tool:** browser-scanner

**Description:**
The application appears to be a modern web application. If you need to explore it automatically then the Ajax Spider may well be more effective than the standard one.

**Evidence:**
```
{
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js\"></script>",
  "url": "https://gpt-2-22b6d.firebaseapp.com/data/",
  "type": "ZAP-10109"
}
```


#### INFO: Modern Web Application

- **CWE:** CWE--1 (Unknown)
- **Tool:** browser-scanner

**Description:**
The application appears to be a modern web application. If you need to explore it automatically then the Ajax Spider may well be more effective than the standard one.

**Evidence:**
```
{
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js\"></script>",
  "url": "https://gpt-2-22b6d.firebaseapp.com/data/app.js",
  "type": "ZAP-10109"
}
```


#### INFO: Modern Web Application

- **CWE:** CWE--1 (Unknown)
- **Tool:** browser-scanner

**Description:**
The application appears to be a modern web application. If you need to explore it automatically then the Ajax Spider may well be more effective than the standard one.

**Evidence:**
```
{
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js\"></script>",
  "url": "https://gpt-2-22b6d.firebaseapp.com/data/styles.css",
  "type": "ZAP-10109"
}
```


#### INFO: Modern Web Application

- **CWE:** CWE--1 (Unknown)
- **Tool:** browser-scanner

**Description:**
The application appears to be a modern web application. If you need to explore it automatically then the Ajax Spider may well be more effective than the standard one.

**Evidence:**
```
{
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js\"></script>",
  "url": "https://gpt-2-22b6d.firebaseapp.com/admin",
  "type": "ZAP-10109"
}
```


#### INFO: Modern Web Application

- **CWE:** CWE--1 (Unknown)
- **Tool:** browser-scanner

**Description:**
The application appears to be a modern web application. If you need to explore it automatically then the Ajax Spider may well be more effective than the standard one.

**Evidence:**
```
{
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js\"></script>",
  "url": "https://gpt-2-22b6d.firebaseapp.com/admin/",
  "type": "ZAP-10109"
}
```


#### INFO: Modern Web Application

- **CWE:** CWE--1 (Unknown)
- **Tool:** browser-scanner

**Description:**
The application appears to be a modern web application. If you need to explore it automatically then the Ajax Spider may well be more effective than the standard one.

**Evidence:**
```
{
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js\"></script>",
  "url": "https://gpt-2-22b6d.firebaseapp.com/admin/app.js",
  "type": "ZAP-10109"
}
```


#### INFO: Modern Web Application

- **CWE:** CWE--1 (Unknown)
- **Tool:** browser-scanner

**Description:**
The application appears to be a modern web application. If you need to explore it automatically then the Ajax Spider may well be more effective than the standard one.

**Evidence:**
```
{
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js\"></script>",
  "url": "https://gpt-2-22b6d.firebaseapp.com/admin/styles.css",
  "type": "ZAP-10109"
}
```


#### INFO: Modern Web Application

- **CWE:** CWE--1 (Unknown)
- **Tool:** browser-scanner

**Description:**
The application appears to be a modern web application. If you need to explore it automatically then the Ajax Spider may well be more effective than the standard one.

**Evidence:**
```
{
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js\"></script>",
  "url": "https://gpt-2-22b6d.firebaseapp.com/admin/dashboard",
  "type": "ZAP-10109"
}
```


#### INFO: Modern Web Application

- **CWE:** CWE--1 (Unknown)
- **Tool:** browser-scanner

**Description:**
The application appears to be a modern web application. If you need to explore it automatically then the Ajax Spider may well be more effective than the standard one.

**Evidence:**
```
{
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js\"></script>",
  "url": "https://gpt-2-22b6d.firebaseapp.com/admin/users",
  "type": "ZAP-10109"
}
```


#### INFO: Modern Web Application

- **CWE:** CWE--1 (Unknown)
- **Tool:** browser-scanner

**Description:**
The application appears to be a modern web application. If you need to explore it automatically then the Ajax Spider may well be more effective than the standard one.

**Evidence:**
```
{
  "detail": "<script src=\"https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js\"></script>",
  "url": "https://gpt-2-22b6d.firebaseapp.com/admin/settings",
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
  "url": "https://gpt-2-22b6d.firebaseapp.com/"
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
  "url": "https://gpt-2-22b6d.firebaseapp.com/home"
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
  "url": "https://gpt-2-22b6d.firebaseapp.com/profile"
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
  "url": "https://gpt-2-22b6d.firebaseapp.com/settings"
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
  "url": "https://gpt-2-22b6d.firebaseapp.com/posts"
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
  "url": "https://gpt-2-22b6d.firebaseapp.com/messages"
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
  "url": "https://gpt-2-22b6d.firebaseapp.com/feed"
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
  "url": "https://gpt-2-22b6d.firebaseapp.com/__nonexistent__1765813078782_e1794ca5e1b25",
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
  "url": "https://gpt-2-22b6d.firebaseapp.com/?file=..%2F..%2F..%2Fetc%2Fpasswd"
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
  "url": "https://gpt-2-22b6d.firebaseapp.com/?file=..%5C..%5C..%5Cwindows%5Cwin.ini"
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
  "url": "https://gpt-2-22b6d.firebaseapp.com/?file=....%2F%2F....%2F%2F....%2F%2Fetc%2Fpasswd"
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
  "url": "https://gpt-2-22b6d.firebaseapp.com/?file=..%252f..%252f..%252fetc%2Fpasswd"
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
  "url": "https://gpt-2-22b6d.firebaseapp.com/?path=..%2F..%2F..%2Fetc%2Fpasswd"
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
  "url": "https://gpt-2-22b6d.firebaseapp.com/?path=..%5C..%5C..%5Cwindows%5Cwin.ini"
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
  "url": "https://gpt-2-22b6d.firebaseapp.com/?path=....%2F%2F....%2F%2F....%2F%2Fetc%2Fpasswd"
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
  "url": "https://gpt-2-22b6d.firebaseapp.com/?path=..%252f..%252f..%252fetc%2Fpasswd"
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
  "url": "https://gpt-2-22b6d.firebaseapp.com/?filepath=..%2F..%2F..%2Fetc%2Fpasswd"
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
  "url": "https://gpt-2-22b6d.firebaseapp.com/?filepath=..%5C..%5C..%5Cwindows%5Cwin.ini"
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
  "url": "https://gpt-2-22b6d.firebaseapp.com/?filepath=....%2F%2F....%2F%2F....%2F%2Fetc%2Fpasswd"
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
  "url": "https://gpt-2-22b6d.firebaseapp.com/?filepath=..%252f..%252f..%252fetc%2Fpasswd"
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
  "url": "https://gpt-2-22b6d.firebaseapp.com/?document=..%2F..%2F..%2Fetc%2Fpasswd"
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
  "url": "https://gpt-2-22b6d.firebaseapp.com/?document=..%5C..%5C..%5Cwindows%5Cwin.ini"
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
  "url": "https://gpt-2-22b6d.firebaseapp.com/?document=....%2F%2F....%2F%2F....%2F%2Fetc%2Fpasswd"
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
  "url": "https://gpt-2-22b6d.firebaseapp.com/?document=..%252f..%252f..%252fetc%2Fpasswd"
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
  "url": "https://gpt-2-22b6d.firebaseapp.com/?doc=..%2F..%2F..%2Fetc%2Fpasswd"
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
  "url": "https://gpt-2-22b6d.firebaseapp.com/?doc=..%5C..%5C..%5Cwindows%5Cwin.ini"
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
  "url": "https://gpt-2-22b6d.firebaseapp.com/?doc=....%2F%2F....%2F%2F....%2F%2Fetc%2Fpasswd"
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
  "url": "https://gpt-2-22b6d.firebaseapp.com/?doc=..%252f..%252f..%252fetc%2Fpasswd"
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
  "url": "https://gpt-2-22b6d.firebaseapp.com/?page=..%2F..%2F..%2Fetc%2Fpasswd"
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
  "url": "https://gpt-2-22b6d.firebaseapp.com/?page=..%5C..%5C..%5Cwindows%5Cwin.ini"
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
  "url": "https://gpt-2-22b6d.firebaseapp.com/?page=....%2F%2F....%2F%2F....%2F%2Fetc%2Fpasswd"
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
  "url": "https://gpt-2-22b6d.firebaseapp.com/?page=..%252f..%252f..%252fetc%2Fpasswd"
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
  "url": "https://gpt-2-22b6d.firebaseapp.com/?template=..%2F..%2F..%2Fetc%2Fpasswd"
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
  "url": "https://gpt-2-22b6d.firebaseapp.com/?template=..%5C..%5C..%5Cwindows%5Cwin.ini"
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
  "url": "https://gpt-2-22b6d.firebaseapp.com/?template=....%2F%2F....%2F%2F....%2F%2Fetc%2Fpasswd"
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
  "url": "https://gpt-2-22b6d.firebaseapp.com/?template=..%252f..%252f..%252fetc%2Fpasswd"
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
  "url": "https://gpt-2-22b6d.firebaseapp.com/?include=..%2F..%2F..%2Fetc%2Fpasswd"
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
  "url": "https://gpt-2-22b6d.firebaseapp.com/?include=..%5C..%5C..%5Cwindows%5Cwin.ini"
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
  "url": "https://gpt-2-22b6d.firebaseapp.com/?include=....%2F%2F....%2F%2F....%2F%2Fetc%2Fpasswd"
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
  "url": "https://gpt-2-22b6d.firebaseapp.com/?include=..%252f..%252f..%252fetc%2Fpasswd"
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
  "url": "https://gpt-2-22b6d.firebaseapp.com/?dir=..%2F..%2F..%2Fetc%2Fpasswd"
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
  "url": "https://gpt-2-22b6d.firebaseapp.com/?dir=..%5C..%5C..%5Cwindows%5Cwin.ini"
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
  "url": "https://gpt-2-22b6d.firebaseapp.com/?dir=....%2F%2F....%2F%2F....%2F%2Fetc%2Fpasswd"
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
  "url": "https://gpt-2-22b6d.firebaseapp.com/?dir=..%252f..%252f..%252fetc%2Fpasswd"
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
  "url": "https://gpt-2-22b6d.firebaseapp.com/?folder=..%2F..%2F..%2Fetc%2Fpasswd"
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
  "url": "https://gpt-2-22b6d.firebaseapp.com/?folder=..%5C..%5C..%5Cwindows%5Cwin.ini"
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
  "url": "https://gpt-2-22b6d.firebaseapp.com/?folder=....%2F%2F....%2F%2F....%2F%2Fetc%2Fpasswd"
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
  "url": "https://gpt-2-22b6d.firebaseapp.com/?folder=..%252f..%252f..%252fetc%2Fpasswd"
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
  "url": "https://gpt-2-22b6d.firebaseapp.com/?load=..%2F..%2F..%2Fetc%2Fpasswd"
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
  "url": "https://gpt-2-22b6d.firebaseapp.com/?load=..%5C..%5C..%5Cwindows%5Cwin.ini"
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
  "url": "https://gpt-2-22b6d.firebaseapp.com/?load=....%2F%2F....%2F%2F....%2F%2Fetc%2Fpasswd"
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
  "url": "https://gpt-2-22b6d.firebaseapp.com/?load=..%252f..%252f..%252fetc%2Fpasswd"
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
  "url": "https://gpt-2-22b6d.firebaseapp.com/?read=..%2F..%2F..%2Fetc%2Fpasswd"
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
  "url": "https://gpt-2-22b6d.firebaseapp.com/?read=..%5C..%5C..%5Cwindows%5Cwin.ini"
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
  "url": "https://gpt-2-22b6d.firebaseapp.com/?read=....%2F%2F....%2F%2F....%2F%2Fetc%2Fpasswd"
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
  "url": "https://gpt-2-22b6d.firebaseapp.com/?read=..%252f..%252f..%252fetc%2Fpasswd"
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
  "url": "https://gpt-2-22b6d.firebaseapp.com/images/"
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
  "url": "https://gpt-2-22b6d.firebaseapp.com/uploads/"
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
  "url": "https://gpt-2-22b6d.firebaseapp.com/files/"
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
  "url": "https://gpt-2-22b6d.firebaseapp.com/assets/"
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
  "url": "https://gpt-2-22b6d.firebaseapp.com/static/"
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
  "url": "https://gpt-2-22b6d.firebaseapp.com/media/"
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
  "url": "https://gpt-2-22b6d.firebaseapp.com/backup/"
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
  "url": "https://gpt-2-22b6d.firebaseapp.com/logs/"
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
  "url": "https://gpt-2-22b6d.firebaseapp.com/tmp/"
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
  "url": "https://gpt-2-22b6d.firebaseapp.com/data/"
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
  "url": "https://gpt-2-22b6d.firebaseapp.com/admin"
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
  "url": "https://gpt-2-22b6d.firebaseapp.com/admin/"
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
  "url": "https://gpt-2-22b6d.firebaseapp.com/admin/dashboard"
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
  "url": "https://gpt-2-22b6d.firebaseapp.com/admin/users"
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
  "url": "https://gpt-2-22b6d.firebaseapp.com/admin/settings"
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
  "url": "https://gpt-2-22b6d.firebaseapp.com/administrator",
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
  "url": "https://gpt-2-22b6d.firebaseapp.com/styles.css",
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
  "url": "https://gpt-2-22b6d.firebaseapp.com/app.js",
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
  "url": "https://gpt-2-22b6d.firebaseapp.com/images/app.js",
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
  "url": "https://gpt-2-22b6d.firebaseapp.com/images/styles.css",
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
  "url": "https://gpt-2-22b6d.firebaseapp.com/uploads/styles.css",
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
  "url": "https://gpt-2-22b6d.firebaseapp.com/uploads/app.js",
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
  "url": "https://gpt-2-22b6d.firebaseapp.com/files/styles.css",
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
  "url": "https://gpt-2-22b6d.firebaseapp.com/files/app.js",
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
  "url": "https://gpt-2-22b6d.firebaseapp.com/assets/app.js",
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
  "url": "https://gpt-2-22b6d.firebaseapp.com/assets/styles.css",
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
  "url": "https://gpt-2-22b6d.firebaseapp.com/static/app.js",
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
  "url": "https://gpt-2-22b6d.firebaseapp.com/static/styles.css",
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
  "url": "https://gpt-2-22b6d.firebaseapp.com/media/styles.css",
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
  "url": "https://gpt-2-22b6d.firebaseapp.com/media/app.js",
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
  "url": "https://gpt-2-22b6d.firebaseapp.com/backup/styles.css",
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
  "url": "https://gpt-2-22b6d.firebaseapp.com/backup/app.js",
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
  "url": "https://gpt-2-22b6d.firebaseapp.com/logs/app.js",
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
  "url": "https://gpt-2-22b6d.firebaseapp.com/logs/styles.css",
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
  "url": "https://gpt-2-22b6d.firebaseapp.com/tmp/styles.css",
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
  "url": "https://gpt-2-22b6d.firebaseapp.com/tmp/app.js",
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
  "url": "https://gpt-2-22b6d.firebaseapp.com/data/app.js",
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
  "url": "https://gpt-2-22b6d.firebaseapp.com/data/styles.css",
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
  "url": "https://gpt-2-22b6d.firebaseapp.com/admin/app.js",
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
  "url": "https://gpt-2-22b6d.firebaseapp.com/admin/styles.css",
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
  "url": "https://gpt-2-22b6d.firebaseapp.com/styles.css",
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
  "url": "https://gpt-2-22b6d.firebaseapp.com/app.js",
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
  "url": "https://gpt-2-22b6d.firebaseapp.com/",
  "type": "ZAP-10116"
}
```


### A02: Cryptographic Failures

#### HIGH: Exposure of Private Personal Information

- **CWE:** CWE-359 (Unknown)
- **Tool:** live-scanner
- **Status:** ✅ Confirmed by live testing

**Description:**
Other users' PII accessible: email

**Evidence:**
```
{
  "exposedPII": [
    "email"
  ],
  "affectedUsers": 2
}
```


#### HIGH: Hardcoded Google API Key found

- **CWE:** CWE-798 (Unknown)
- **Tool:** crypto-scanner

**Description:**
Found potential Google API Key in https://gpt-2-22b6d.firebaseapp.com/app.js

**Evidence:**
```
{
  "pattern": "Google API Key",
  "source": "https://gpt-2-22b6d.firebaseapp.com/app.js",
  "redactedMatch": "AIzaSyAOVf...TU-lg"
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
  "url": "https://gpt-2-22b6d.firebaseapp.com"
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
  "url": "https://gpt-2-22b6d.firebaseapp.com"
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
Password field "register-password" has weak policy: no minimum length requirement (should be ≥8), no pattern for password complexity


#### MEDIUM: Weak Random detected

- **CWE:** CWE-330 (Use of Insufficiently Random Values)
- **Tool:** crypto-scanner

**Description:**
Found Weak Random in https://gpt-2-22b6d.firebaseapp.com/app.js. This may indicate weak cryptographic practices.

**Evidence:**
```
{
  "pattern": "Weak Random",
  "source": "https://gpt-2-22b6d.firebaseapp.com/app.js",
  "matchCount": 1
}
```


#### MEDIUM: weak-prng-math-floor-random

- **CWE:** CWE-338 (Use of Cryptographically Weak PRNG)
- **Tool:** semgrep

**Description:**
Math.random for random int. CWE-338

**Evidence:**
```
{
  "file": "/home/nillof/Exjobb/GPT2/mini-social/public/app.js",
  "line": 53,
  "endLine": 53,
  "code": "out += chars[Math.floor(Math.random() * chars.length)];"
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
  "url": "https://gpt-2-22b6d.firebaseapp.com"
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
  "url": "https://gpt-2-22b6d.firebaseapp.com"
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
  "file": "/home/nillof/Exjobb/GPT2/mini-social/public/app.js",
  "line": 277,
  "endLine": 284,
  "code": "div.innerHTML = `\n        <div class=\"profile-banner ${u.banner || \"banner-default\"}\"></div>\n        <div class=\"profile-card-body\">\n          <strong>${u.displayName}</strong><br>\n          <small>${u.city || \"\"} ${u.country || \"\"}</small><br>\n          <a href=\"profile.html?uid=${doc.id}\">Open Profile</a>\n        </div>\n      `;"
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
  "file": "/home/nillof/Exjobb/GPT2/mini-social/public/app.js",
  "line": 381,
  "endLine": 407,
  "code": "div.innerHTML = `\n        <div class=\"post-header\">\n          <div><strong>${p.authorName}</strong></div>\n          <div class=\"post-meta\">${formatDate(p.createdAt)} · ${p.visibility}</div>\n        </div>\n\n        <p>${p.text}</p>\n\n        ${p.imageUrl ? `\n          <img src=\"${p.imageUrl}\"\n               style=\"max-width:100%;border-radius:6px;margin-bottom:0.4rem;\">`\n        : \"\"}\n\n        <div class=\"post-actions\">\n          <button data-like=\"${doc.id}\">Like</button>\n          <button data-comment=\"${doc.id}\">Comment</button>\n          <button data-addfriend=\"${p.authorId}\">Add Friend</button>\n          ${p.imageUrl ? `<button data-download=\"${p.imageUrl}\">Download</button>` : \"\"}\n          ${\n            (p.authorId === currentUser.uid || currentUserDoc.isAdmin || currentUserDoc.isOwner)\n            ? `<button data-deletepost=\"${doc.id}\" class=\"danger\">Delete</button>`\n            : \"\"\n          }\n        </div>\n\n        <div id=\"comments-${doc.id}\" class=\"comments\"></div>\n      `;"
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
  "file": "/home/nillof/Exjobb/GPT2/mini-social/public/app.js",
  "line": 506,
  "endLine": 506,
  "code": "$(\"my-profile-info\").innerHTML = card;"
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
  "file": "/home/nillof/Exjobb/GPT2/mini-social/public/app.js",
  "line": 538,
  "endLine": 542,
  "code": "div.innerHTML = `\n      <div class=\"post-meta\">${formatDate(p.createdAt)} · ${p.visibility}</div>\n      <p>${p.text}</p>\n      ${p.imageUrl ? `<img src=\"${p.imageUrl}\" style=\"max-width:100%;\">` : \"\"}\n    `;"
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
  "file": "/home/nillof/Exjobb/GPT2/mini-social/public/app.js",
  "line": 649,
  "endLine": 652,
  "code": "div.innerHTML = `\n      <strong>Code:</strong> ${r.code}<br>\n      <small>Used ${r.usedCount || 0} times</small>\n    `;"
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
  "file": "/home/nillof/Exjobb/GPT2/mini-social/public/app.js",
  "line": 757,
  "endLine": 761,
  "code": "div.innerHTML = `\n      <strong>${u.displayName}</strong><br>\n      Age: ${u.age || \"?\"}<br>\n      ${u.city || \"\"} ${u.country || \"\"}\n    `;"
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
  "file": "/home/nillof/Exjobb/GPT2/mini-social/public/app.js",
  "line": 805
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
  "file": "/home/nillof/Exjobb/GPT2/mini-social/public/app.js",
  "line": 1158,
  "endLine": 1168,
  "code": "div.innerHTML = `\n      <strong>${u.displayName}</strong><br>\n      Email: ${u.email}<br>\n      Admin: ${u.isAdmin ? \"Yes\" : \"No\"} · Owner: ${u.isOwner ? \"Yes\" : \"No\"}<br><br>\n\n      <button data-admin-edit=\"${doc.id}\">Edit User</button>\n      <button data-admin-toggle=\"${doc.id}\">\n        ${u.isAdmin ? \"Remove Admin\" : \"Make Admin\"}\n      </button>\n      <button data-admin-deleteuser=\"${doc.id}\" class=\"danger\">Delete User</button>\n    `;"
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
  "file": "/home/nillof/Exjobb/GPT2/mini-social/public/app.js",
  "line": 1225,
  "endLine": 1229,
  "code": "div.innerHTML = `\n      <strong>${p.authorName}</strong> · ${p.visibility}<br>\n      ${p.text}<br>\n      <button data-admin-deletepost=\"${doc.id}\" class=\"danger\">Delete Post</button>\n    `;"
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
  "file": "/home/nillof/Exjobb/GPT2/mini-social/public/app.js",
  "line": 1263,
  "endLine": 1313,
  "code": "editBody.innerHTML = `\n    <label>Display Name:\n      <input id=\"admin-edit-displayName\" value=\"${u.displayName || \"\"}\">\n    </label>\n\n    <label>Full Name:\n      <input id=\"admin-edit-fullName\" value=\"${u.fullName || \"\"}\">\n    </label>\n\n    <label>Age:\n      <input id=\"admin-edit-age\" type=\"number\" value=\"${u.age || \"\"}\">\n    </label>\n\n    <label>City:\n      <input id=\"admin-edit-city\" value=\"${u.city || \"\"}\">\n    </label>\n\n    <label>Country:\n      <input id=\"admin-edit-country\" value=\"${u.country || \"\"}\">\n    </label>\n\n    <label>About:\n      <textarea id=\"admin-edit-about\">${u.about || \"\"}</textarea>\n    </label>\n\n    <label>Banner:\n      <select id=\"admin-edit-banner\">\n        <option value=\"banner-default\" ${u.banner === \"banner-default\" ? \"selected\" : \"\"}>Default</option>\n        <option value=\"banner-blue\" ${u.banner === \"banner-blue\" ? \"selected\" : \"\"}>Blue</option>\n        <option value=\"banner-green\" ${u.banner === \"banner-green\" ? \"selected\" : \"\"}>Green</option>\n        <option value=\"banner-pink\" ${u.banner === \"banner-pink\" ? \"selected\" : \"\"}>Pink</option>\n      </select>\n    </label>\n\n    <label>Theme:\n      <select id=\"admin-edit-theme\">\n        <option value=\"light\" ${u.theme === \"light\" ? \"selected\" : \"\"}>Light</option>\n        <option value=\"dark\" ${u.theme === \"dark\" ? \"selected\" : \"\"}>Dark</option>\n        <option value=\"blue\" ${u.theme === \"blue\" ? \"selected\" : \"\"}>Blue</option>\n      </select>\n    </label>\n\n    <label>Referral Points:\n      <input id=\"admin-edit-refpoints\" type=\"number\" value=\"${u.referralPoints || 0}\">\n    </label>\n\n    <label>\n      <input type=\"checkbox\" id=\"admin-edit-reset-photo\">\n      Reset profile photo\n    </label>\n  `;"
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
  "file": "/home/nillof/Exjobb/GPT2/mini-social/public/app.js",
  "line": 620,
  "endLine": 620,
  "code": "img.src = p.imageUrl;"
}
```


#### MEDIUM: Missing File Type Validation in Storage Rules

- **CWE:** CWE-434 (Unrestricted Upload of File with Dangerous Type)
- **Tool:** static-analysis

**Description:**
Storage rules do not validate file content type


