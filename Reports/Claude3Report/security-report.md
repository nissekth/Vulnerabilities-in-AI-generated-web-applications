# Security Assessment Report

**Application:** Social Media App  
**Target:** https://claude3-a5800.firebaseapp.com  
**Date:** 2025-12-16T00:41:52.297Z  
**Duration:** 109s

## Summary

| Severity | Count |
|----------|-------|
| CRITICAL | 0 |
| HIGH | 2 |
| MEDIUM | 17 |
| LOW | 2 |

**Risk Score:** 46 (CRITICAL)


### Deduplication Summary

| Metric | Value |
|--------|-------|
| Original Findings | 23 |
| After Deduplication | 21 |
| Duplicates Removed | 2 |
| Reduction | 9% |

## Findings

### A01: Broken Access Control

#### HIGH: IDOR Vulnerability on User Profiles

- **CWE:** CWE-639 (IDOR)
- **Tool:** firebase-emulator
- **Description:** Users can access other users' profiles by simply changing the document ID in the request.
- **Remediation:** Restrict reads to own profile: allow read: if request.auth.uid == userId

#### MEDIUM: firebase-no-auth-deletedoc

- **CWE:** CWE-284 (Improper Access Control)
- **Tool:** semgrep
- **Description:** Firestore deleteDoc without auth check. CWE-284

#### MEDIUM: firebase-no-auth-deletedoc

- **CWE:** CWE-284 (Improper Access Control)
- **Tool:** semgrep
- **Description:** Firestore deleteDoc without auth check. CWE-284

#### MEDIUM: firebase-no-auth-setdoc

- **CWE:** CWE-284 (Improper Access Control)
- **Tool:** semgrep
- **Description:** Firestore setDoc without auth check. CWE-284

#### MEDIUM: firebase-no-auth-setdoc

- **CWE:** CWE-284 (Improper Access Control)
- **Tool:** semgrep
- **Description:** Firestore setDoc without auth check. CWE-284

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

#### MEDIUM: firebase-no-auth-deletedoc

- **CWE:** CWE-284 (Improper Access Control)
- **Tool:** semgrep
- **Description:** Firestore deleteDoc without auth check. CWE-284

#### MEDIUM: improper-auth-admin-string

- **CWE:** CWE-285 (Improper Authorization)
- **Tool:** semgrep
- **Description:** Client-side admin role check. CWE-285

#### MEDIUM: improper-auth-admin-string

- **CWE:** CWE-285 (Improper Authorization)
- **Tool:** semgrep
- **Description:** Client-side admin role check. CWE-285

#### MEDIUM: improper-auth-admin-string

- **CWE:** CWE-285 (Improper Authorization)
- **Tool:** semgrep
- **Description:** Client-side admin role check. CWE-285

#### MEDIUM: improper-auth-admin-string

- **CWE:** CWE-285 (Improper Authorization)
- **Tool:** semgrep
- **Description:** Client-side admin role check. CWE-285

### A02: Cryptographic Failures

#### HIGH: Hardcoded Generic Password found

- **CWE:** CWE-798 (Unknown)
- **Tool:** crypto-scanner
- **Description:** Found potential Generic Password in https://claude3-a5800.firebaseapp.com/assets/index--yz7OXt5.js

#### MEDIUM: Weak Random detected

- **CWE:** CWE-330 (Use of Insufficiently Random Values)
- **Tool:** crypto-scanner
- **Description:** Found Weak Random in https://claude3-a5800.firebaseapp.com/assets/index--yz7OXt5.js. This may indicate weak cryptographic practices.

#### MEDIUM: Hardcoded Generic Token found

- **CWE:** CWE-798 (Unknown)
- **Tool:** crypto-scanner
- **Description:** Found potential Generic Token in https://claude3-a5800.firebaseapp.com/assets/index--yz7OXt5.js

### A03: Injection

#### MEDIUM: firebase-stored-xss

- **CWE:** CWE-79 (Cross-site Scripting (XSS))
- **Tool:** semgrep
- **Description:** User content stored. CWE-79

#### MEDIUM: firebase-stored-xss

- **CWE:** CWE-79 (Cross-site Scripting (XSS))
- **Tool:** semgrep
- **Description:** User content stored. CWE-79

#### MEDIUM: firebase-stored-xss

- **CWE:** CWE-79 (Cross-site Scripting (XSS))
- **Tool:** semgrep
- **Description:** User content stored. CWE-79

#### LOW: firebase-upload

- **CWE:** CWE-434 (Unrestricted Upload of File with Dangerous Type)
- **Tool:** semgrep
- **Description:** File upload. CWE-434

#### LOW: firebase-upload

- **CWE:** CWE-434 (Unrestricted Upload of File with Dangerous Type)
- **Tool:** semgrep
- **Description:** File upload. CWE-434

