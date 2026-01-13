# Security Assessment Report

**Application:** Social Media App  
**Target:** https://claude4-195d9.firebaseapp.com  
**Date:** 2025-12-15T23:41:44.096Z  
**Duration:** 102s

## Summary

| Severity | Count |
|----------|-------|
| CRITICAL | 2 |
| HIGH | 22 |
| MEDIUM | 6 |
| LOW | 0 |

**Risk Score:** 142 (CRITICAL)


### Deduplication Summary

| Metric | Value |
|--------|-------|
| Original Findings | 35 |
| After Deduplication | 30 |
| Duplicates Removed | 5 |
| Reduction | 14% |

## Findings

### A01: Broken Access Control

#### CRITICAL: Authorization Bypass - No Owner Verification

- **CWE:** CWE-285 (Improper Authorization)
- **Tool:** static-analysis
- **Description:** Rule only checks authentication, not authorization. Any authenticated user can modify any document.
- **Remediation:** Add owner check: allow update: if request.auth != null && request.auth.uid == userId

#### CRITICAL: Authorization Bypass - No Owner Verification

- **CWE:** CWE-285 (Improper Authorization)
- **Tool:** static-analysis
- **Description:** Rule only checks authentication, not authorization. Any authenticated user can modify any document.
- **Remediation:** Add owner check: allow update: if request.auth != null && request.auth.uid == userId

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

#### HIGH: Message Injection Possible

- **CWE:** CWE-284 (Improper Access Control)
- **Tool:** static-analysis
- **Description:** Message creation does not validate that sender is in participants list
- **Remediation:** Add: && request.auth.uid in request.resource.data.participants && request.resource.data.senderId == request.auth.uid

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

#### HIGH: Missing Creator Validation

- **CWE:** CWE-862 (Missing Authorization)
- **Tool:** static-analysis
- **Description:** Create operation only requires authentication. Should validate resource data matches authenticated user.
- **Remediation:** Add: && request.resource.data.userId == request.auth.uid

#### HIGH: client-side-isadmin

- **CWE:** CWE-863 (Incorrect Authorization)
- **Tool:** semgrep
- **Description:** Client-side admin check. CWE-863

#### MEDIUM: Unauthenticated Read Access to Posts

- **CWE:** CWE-284 (Improper Access Control)
- **Tool:** firebase-emulator
- **Description:** Posts are readable without authentication. Consider if this is intentional for public content.
- **Remediation:** If posts should be private, add: allow read: if request.auth != null

#### MEDIUM: Draft Content Exposed to Other Users

- **CWE:** CWE-668 (Unknown)
- **Tool:** firebase-emulator
- **Description:** Unpublished/draft content is accessible to users other than the author.
- **Remediation:** Add visibility check: allow read: if resource.data.status == "published" || request.auth.uid == resource.data.userId

### A02: Cryptographic Failures

#### HIGH: Hardcoded Google API Key found

- **CWE:** CWE-798 (Unknown)
- **Tool:** crypto-scanner
- **Description:** Found potential Google API Key in https://claude4-195d9.firebaseapp.com/config.js

#### MEDIUM: Public Storage Access

- **CWE:** CWE-311 (Missing Encryption of Sensitive Data)
- **Tool:** static-analysis
- **Description:** Storage files are publicly readable. Consider if this is necessary.
- **Remediation:** Consider: allow read: if request.auth != null

#### MEDIUM: Weak Random detected

- **CWE:** CWE-330 (Use of Insufficiently Random Values)
- **Tool:** crypto-scanner
- **Description:** Found Weak Random in https://claude4-195d9.firebaseapp.com/app.js. This may indicate weak cryptographic practices.

#### MEDIUM: Weak password policy

- **CWE:** CWE-521 (Weak Password Requirements)
- **Tool:** crypto-scanner
- **Description:** Password field "loginPassword" has weak policy: no minimum length requirement (should be ≥8), no pattern for password complexity

### A03: Injection

#### HIGH: external-reference-script-src

- **CWE:** CWE-610 (Unknown)
- **Tool:** semgrep
- **Description:** Dynamic script.src. CWE-610

#### HIGH: dom-xss-innerhtml

- **CWE:** CWE-79 (Cross-site Scripting (XSS))
- **Tool:** semgrep
- **Description:** innerHTML XSS. CWE-79

#### HIGH: dom-xss-innerhtml

- **CWE:** CWE-79 (Cross-site Scripting (XSS))
- **Tool:** semgrep
- **Description:** innerHTML XSS. CWE-79

#### HIGH: dom-xss-innerhtml

- **CWE:** CWE-79 (Cross-site Scripting (XSS))
- **Tool:** semgrep
- **Description:** innerHTML XSS. CWE-79

#### HIGH: dom-xss-innerhtml

- **CWE:** CWE-79 (Cross-site Scripting (XSS))
- **Tool:** semgrep
- **Description:** innerHTML XSS. CWE-79

#### HIGH: dom-xss-innerhtml

- **CWE:** CWE-79 (Cross-site Scripting (XSS))
- **Tool:** semgrep
- **Description:** innerHTML XSS. CWE-79

#### HIGH: dom-xss-innerhtml

- **CWE:** CWE-79 (Cross-site Scripting (XSS))
- **Tool:** semgrep
- **Description:** innerHTML XSS. CWE-79

#### HIGH: dom-xss-innerhtml

- **CWE:** CWE-79 (Cross-site Scripting (XSS))
- **Tool:** semgrep
- **Description:** innerHTML XSS. CWE-79

#### HIGH: dom-xss-innerhtml

- **CWE:** CWE-79 (Cross-site Scripting (XSS))
- **Tool:** semgrep
- **Description:** innerHTML XSS. CWE-79

#### HIGH: dom-xss-innerhtml

- **CWE:** CWE-79 (Cross-site Scripting (XSS))
- **Tool:** semgrep
- **Description:** innerHTML XSS. CWE-79

#### HIGH: dom-xss-innerhtml

- **CWE:** CWE-79 (Cross-site Scripting (XSS))
- **Tool:** semgrep
- **Description:** innerHTML XSS. CWE-79

#### HIGH: dom-xss-innerhtml

- **CWE:** CWE-79 (Cross-site Scripting (XSS))
- **Tool:** semgrep
- **Description:** innerHTML XSS. CWE-79

#### HIGH: dom-xss-innerhtml

- **CWE:** CWE-79 (Cross-site Scripting (XSS))
- **Tool:** semgrep
- **Description:** innerHTML XSS. CWE-79

#### HIGH: dom-xss-innerhtml

- **CWE:** CWE-79 (Cross-site Scripting (XSS))
- **Tool:** semgrep
- **Description:** innerHTML XSS. CWE-79

#### MEDIUM: Missing File Type Validation in Storage Rules

- **CWE:** CWE-434 (Unrestricted Upload of File with Dangerous Type)
- **Tool:** static-analysis
- **Description:** Storage rules do not validate file content type
- **Remediation:** Add: && request.resource.contentType.matches('image/.*')

