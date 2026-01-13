# Security Assessment Report

**Application:** Social Media App  
**Target:** https://gpt-2-22b6d.firebaseapp.com  
**Date:** 2025-12-15T15:37:22.173Z  
**Duration:** 96s

## Summary

| Severity | Count |
|----------|-------|
| CRITICAL | 1 |
| HIGH | 24 |
| MEDIUM | 5 |
| LOW | 0 |

**Risk Score:** 140 (CRITICAL)


### Deduplication Summary

| Metric | Value |
|--------|-------|
| Original Findings | 36 |
| After Deduplication | 30 |
| Duplicates Removed | 6 |
| Reduction | 17% |

## Findings

### A01: Broken Access Control

#### CRITICAL: Sensitive Configuration Data Accessible

- **CWE:** CWE-922 (Insecure Storage of Sensitive Information)
- **Tool:** firebase-emulator
- **Description:** API keys or other sensitive configuration stored in Firestore is accessible to regular users.
- **Remediation:** Sensitive config should not be in client-accessible Firestore. Use Cloud Functions or secure backend storage.

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

#### HIGH: client-side-isadmin

- **CWE:** CWE-863 (Incorrect Authorization)
- **Tool:** semgrep
- **Description:** Client-side admin check. CWE-863

#### HIGH: client-side-isadmin

- **CWE:** CWE-863 (Incorrect Authorization)
- **Tool:** semgrep
- **Description:** Client-side admin check. CWE-863

### A02: Cryptographic Failures

#### HIGH: Hardcoded Google API Key found

- **CWE:** CWE-798 (Unknown)
- **Tool:** crypto-scanner
- **Description:** Found potential Google API Key in https://gpt-2-22b6d.firebaseapp.com/app.js

#### MEDIUM: Public Storage Access

- **CWE:** CWE-311 (Missing Encryption of Sensitive Data)
- **Tool:** static-analysis
- **Description:** Storage files are publicly readable. Consider if this is necessary.
- **Remediation:** Consider: allow read: if request.auth != null

#### MEDIUM: Weak Random detected

- **CWE:** CWE-330 (Use of Insufficiently Random Values)
- **Tool:** crypto-scanner
- **Description:** Found Weak Random in https://gpt-2-22b6d.firebaseapp.com/app.js. This may indicate weak cryptographic practices.

#### MEDIUM: weak-prng-math-floor-random

- **CWE:** CWE-338 (Use of Cryptographically Weak PRNG)
- **Tool:** semgrep
- **Description:** Math.random for random int. CWE-338

#### MEDIUM: Weak password policy

- **CWE:** CWE-521 (Weak Password Requirements)
- **Tool:** crypto-scanner
- **Description:** Password field "register-password" has weak policy: no minimum length requirement (should be ≥8), no pattern for password complexity

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

#### MEDIUM: Missing File Type Validation in Storage Rules

- **CWE:** CWE-434 (Unrestricted Upload of File with Dangerous Type)
- **Tool:** static-analysis
- **Description:** Storage rules do not validate file content type
- **Remediation:** Add: && request.resource.contentType.matches('image/.*')

