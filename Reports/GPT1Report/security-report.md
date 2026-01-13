# Security Assessment Report

**Application:** Social Media App  
**Target:** https://gpt-1-bec24.firebaseapp.com  
**Date:** 2025-12-15T22:16:36.831Z  
**Duration:** 155s

## Summary

| Severity | Count |
|----------|-------|
| CRITICAL | 0 |
| HIGH | 14 |
| MEDIUM | 8 |
| LOW | 1 |

**Risk Score:** 87 (CRITICAL)


### Deduplication Summary

| Metric | Value |
|--------|-------|
| Original Findings | 29 |
| After Deduplication | 23 |
| Duplicates Removed | 6 |
| Reduction | 21% |

## Findings

### A01: Broken Access Control

#### HIGH: User Enumeration via Collection Listing

- **CWE:** CWE-200 (Exposure of Sensitive Information)
- **Tool:** firebase-emulator
- **Description:** Unauthenticated users can list/enumerate user documents, exposing user data.
- **Remediation:** Prevent listing: require authentication and consider restricting list queries

#### HIGH: Unrestricted Read Access

- **CWE:** CWE-284 (Improper Access Control)
- **Tool:** static-analysis
- **Description:** Rule allows anyone to read data without authentication
- **Remediation:** Change to: allow read: if request.auth != null

#### HIGH: Unauthenticated Read Access to User Data

- **CWE:** CWE-284 (Improper Access Control)
- **Tool:** firebase-emulator
- **Description:** Firestore rules allow unauthenticated users to read user documents. This exposes potentially sensitive user information to anyone.
- **Remediation:** Add authentication check: allow read: if request.auth != null

#### HIGH: IDOR Vulnerability on User Profiles

- **CWE:** CWE-639 (IDOR)
- **Tool:** firebase-emulator
- **Description:** Users can access other users' profiles by simply changing the document ID in the request.
- **Remediation:** Restrict reads to own profile: allow read: if request.auth.uid == userId

#### HIGH: Sender ID Spoofing in Messages

- **CWE:** CWE-863 (Incorrect Authorization)
- **Tool:** firebase-emulator
- **Description:** Users can create messages with a senderId that doesn't match their authentication.
- **Remediation:** Validate sender: allow create: if request.resource.data.senderId == request.auth.uid

#### HIGH: client-side-isadmin

- **CWE:** CWE-863 (Incorrect Authorization)
- **Tool:** semgrep
- **Description:** Client-side admin check. CWE-863

#### HIGH: client-side-isadmin

- **CWE:** CWE-863 (Incorrect Authorization)
- **Tool:** semgrep
- **Description:** Client-side admin check. CWE-863

#### HIGH: client-side-isadmin

- **CWE:** CWE-863 (Incorrect Authorization)
- **Tool:** semgrep
- **Description:** Client-side admin check. CWE-863

#### HIGH: client-side-isadmin

- **CWE:** CWE-863 (Incorrect Authorization)
- **Tool:** semgrep
- **Description:** Client-side admin check. CWE-863

#### HIGH: client-side-isadmin

- **CWE:** CWE-863 (Incorrect Authorization)
- **Tool:** semgrep
- **Description:** Client-side admin check. CWE-863

#### HIGH: client-side-isadmin

- **CWE:** CWE-863 (Incorrect Authorization)
- **Tool:** semgrep
- **Description:** Client-side admin check. CWE-863

#### MEDIUM: Unauthenticated Read Access to Posts

- **CWE:** CWE-284 (Improper Access Control)
- **Tool:** firebase-emulator
- **Description:** Posts are readable without authentication. Consider if this is intentional for public content.
- **Remediation:** If posts should be private, add: allow read: if request.auth != null

#### MEDIUM: firebase-no-auth-setdoc

- **CWE:** CWE-284 (Improper Access Control)
- **Tool:** semgrep
- **Description:** Firestore setDoc without auth check. CWE-284

#### MEDIUM: firebase-no-auth-deletedoc

- **CWE:** CWE-284 (Improper Access Control)
- **Tool:** semgrep
- **Description:** Firestore deleteDoc without auth check. CWE-284

#### MEDIUM: firebase-no-auth-deletedoc

- **CWE:** CWE-284 (Improper Access Control)
- **Tool:** semgrep
- **Description:** Firestore deleteDoc without auth check. CWE-284

#### MEDIUM: Draft Content Exposed to Other Users

- **CWE:** CWE-668 (Unknown)
- **Tool:** firebase-emulator
- **Description:** Unpublished/draft content is accessible to users other than the author.
- **Remediation:** Add visibility check: allow read: if resource.data.status == "published" || request.auth.uid == resource.data.userId

### A02: Cryptographic Failures

#### HIGH: Hardcoded Google API Key found

- **CWE:** CWE-798 (Unknown)
- **Tool:** crypto-scanner
- **Description:** Found potential Google API Key in https://gpt-1-bec24.firebaseapp.com/app.js

#### HIGH: Hardcoded Generic Password found

- **CWE:** CWE-798 (Unknown)
- **Tool:** crypto-scanner
- **Description:** Found potential Generic Password in https://gpt-1-bec24.firebaseapp.com/app.js

#### MEDIUM: Public Storage Access

- **CWE:** CWE-311 (Missing Encryption of Sensitive Data)
- **Tool:** static-analysis
- **Description:** Storage files are publicly readable. Consider if this is necessary.
- **Remediation:** Consider: allow read: if request.auth != null

#### MEDIUM: Weak Random detected

- **CWE:** CWE-330 (Use of Insufficiently Random Values)
- **Tool:** crypto-scanner
- **Description:** Found Weak Random in https://gpt-1-bec24.firebaseapp.com/app.js. This may indicate weak cryptographic practices.

### A03: Injection

#### HIGH: dom-xss-innerhtml

- **CWE:** CWE-79 (Cross-site Scripting (XSS))
- **Tool:** semgrep
- **Description:** innerHTML XSS. CWE-79

#### MEDIUM: Missing File Type Validation in Storage Rules

- **CWE:** CWE-434 (Unrestricted Upload of File with Dangerous Type)
- **Tool:** static-analysis
- **Description:** Storage rules do not validate file content type
- **Remediation:** Add: && request.resource.contentType.matches('image/.*')

#### LOW: firebase-upload

- **CWE:** CWE-434 (Unrestricted Upload of File with Dangerous Type)
- **Tool:** semgrep
- **Description:** File upload. CWE-434

