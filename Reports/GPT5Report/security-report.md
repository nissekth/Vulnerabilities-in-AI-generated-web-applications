# Security Assessment Report

**Application:** Social Media App  
**Target:** https://gpt-5-338b7.web.app  
**Date:** 2025-12-16T11:07:20.317Z  
**Duration:** 853s

## Summary

| Severity | Count |
|----------|-------|
| CRITICAL | 2 |
| HIGH | 19 |
| MEDIUM | 22 |
| LOW | 2 |

**Risk Score:** 161 (CRITICAL)


### Deduplication Summary

| Metric | Value |
|--------|-------|
| Original Findings | 79 |
| After Deduplication | 45 |
| Duplicates Removed | 34 |
| Reduction | 43% |

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

#### HIGH: prototype-pollution-array

- **CWE:** CWE-706 (Unknown)
- **Tool:** semgrep
- **Description:** Prototype pollution. CWE-706

#### HIGH: prototype-pollution-array

- **CWE:** CWE-706 (Unknown)
- **Tool:** semgrep
- **Description:** Prototype pollution. CWE-706

#### MEDIUM: firebase-no-auth-deletedoc

- **CWE:** CWE-284 (Improper Access Control)
- **Tool:** semgrep
- **Description:** Firestore deleteDoc without auth check. CWE-284

#### MEDIUM: firebase-no-auth-setdoc

- **CWE:** CWE-284 (Improper Access Control)
- **Tool:** semgrep
- **Description:** Firestore setDoc without auth check. CWE-284

#### MEDIUM: open-redirect-window

- **CWE:** CWE-601 (Open Redirect)
- **Tool:** semgrep
- **Description:** Open redirect. CWE-601

#### MEDIUM: dynamic-require

- **CWE:** CWE-913 (Improper Control of Dynamically-Managed Code Resources)
- **Tool:** semgrep
- **Description:** Dynamic require. CWE-913

### A02: Cryptographic Failures

#### HIGH: weak-password-encoding-btoa

- **CWE:** CWE-261 (Weak Encoding for Password)
- **Tool:** semgrep
- **Description:** Password btoa (reversible). CWE-261

#### HIGH: weak-password-encoding-btoa

- **CWE:** CWE-261 (Weak Encoding for Password)
- **Tool:** semgrep
- **Description:** Password btoa (reversible). CWE-261

#### HIGH: Hardcoded Generic Password found

- **CWE:** CWE-798 (Unknown)
- **Tool:** crypto-scanner
- **Description:** Found potential Generic Password in https://gpt-5-338b7.web.app/_next/static/chunks/polyfills-42372ed130431b0a.js

#### MEDIUM: Weak Random detected

- **CWE:** CWE-330 (Use of Insufficiently Random Values)
- **Tool:** crypto-scanner
- **Description:** Found Weak Random in https://gpt-5-338b7.web.app/_next/static/chunks/polyfills-42372ed130431b0a.js. This may indicate weak cryptographic practices.

#### MEDIUM: weak-prng-math-floor-random

- **CWE:** CWE-338 (Use of Cryptographically Weak PRNG)
- **Tool:** semgrep
- **Description:** Math.random for random int. CWE-338

#### MEDIUM: weak-prng-math-floor-random

- **CWE:** CWE-338 (Use of Cryptographically Weak PRNG)
- **Tool:** semgrep
- **Description:** Math.random for random int. CWE-338

#### MEDIUM: weak-prng-math-floor-random

- **CWE:** CWE-338 (Use of Cryptographically Weak PRNG)
- **Tool:** semgrep
- **Description:** Math.random for random int. CWE-338

#### MEDIUM: weak-prng-math-floor-random

- **CWE:** CWE-338 (Use of Cryptographically Weak PRNG)
- **Tool:** semgrep
- **Description:** Math.random for random int. CWE-338

### A03: Injection

#### CRITICAL: Template injection (Angular/Vue)

- **CWE:** CWE-94 (Code Injection)
- **Tool:** injection-scanner
- **Description:** Template expression "<%= 7*7 %>" was evaluated to "49". This indicates server or client-side template injection.

#### CRITICAL: Template injection (Angular sandbox escape)

- **CWE:** CWE-94 (Code Injection)
- **Tool:** injection-scanner
- **Description:** Template expression "{{constructor.constructor("return 7*7")()}}" was evaluated to "49". This indicates server or client-side template injection.

#### HIGH: external-reference-script-src

- **CWE:** CWE-610 (Unknown)
- **Tool:** semgrep
- **Description:** Dynamic script.src. CWE-610

#### HIGH: external-reference-script-src

- **CWE:** CWE-610 (Unknown)
- **Tool:** semgrep
- **Description:** Dynamic script.src. CWE-610

#### HIGH: external-reference-script-src

- **CWE:** CWE-610 (Unknown)
- **Tool:** semgrep
- **Description:** Dynamic script.src. CWE-610

#### HIGH: external-reference-script-src

- **CWE:** CWE-610 (Unknown)
- **Tool:** semgrep
- **Description:** Dynamic script.src. CWE-610

#### HIGH: external-reference-script-src

- **CWE:** CWE-610 (Unknown)
- **Tool:** semgrep
- **Description:** Dynamic script.src. CWE-610

#### HIGH: external-reference-script-src

- **CWE:** CWE-610 (Unknown)
- **Tool:** semgrep
- **Description:** Dynamic script.src. CWE-610

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

#### MEDIUM: special-elements-regex-constructor

- **CWE:** CWE-138 (Unknown)
- **Tool:** semgrep
- **Description:** User input in RegExp. CWE-138

#### MEDIUM: special-elements-regex-input

- **CWE:** CWE-138 (Unknown)
- **Tool:** semgrep
- **Description:** User input in RegExp (ReDoS risk). CWE-138

#### MEDIUM: special-elements-regex-constructor

- **CWE:** CWE-138 (Unknown)
- **Tool:** semgrep
- **Description:** User input in RegExp. CWE-138

#### MEDIUM: special-elements-regex-constructor

- **CWE:** CWE-138 (Unknown)
- **Tool:** semgrep
- **Description:** User input in RegExp. CWE-138

#### MEDIUM: special-elements-regex-input

- **CWE:** CWE-138 (Unknown)
- **Tool:** semgrep
- **Description:** User input in RegExp (ReDoS risk). CWE-138

#### MEDIUM: special-elements-regex-input

- **CWE:** CWE-138 (Unknown)
- **Tool:** semgrep
- **Description:** User input in RegExp (ReDoS risk). CWE-138

#### MEDIUM: special-elements-regex-constructor

- **CWE:** CWE-138 (Unknown)
- **Tool:** semgrep
- **Description:** User input in RegExp. CWE-138

#### MEDIUM: Missing File Type Validation in Storage Rules

- **CWE:** CWE-434 (Unrestricted Upload of File with Dangerous Type)
- **Tool:** static-analysis
- **Description:** Storage rules do not validate file content type
- **Remediation:** Add: && request.resource.contentType.matches('image/.*')

#### MEDIUM: unsafe-reflection-this

- **CWE:** CWE-470 (Unknown)
- **Tool:** semgrep
- **Description:** Dynamic this[] method call. CWE-470

#### MEDIUM: object-defineProperty-prototype

- **CWE:** CWE-471 (Unknown)
- **Tool:** semgrep
- **Description:** Prototype modification. CWE-471

#### MEDIUM: object-defineProperty-prototype

- **CWE:** CWE-471 (Unknown)
- **Tool:** semgrep
- **Description:** Prototype modification. CWE-471

#### MEDIUM: object-defineProperty-prototype

- **CWE:** CWE-471 (Unknown)
- **Tool:** semgrep
- **Description:** Prototype modification. CWE-471

#### MEDIUM: object-defineProperty-prototype

- **CWE:** CWE-471 (Unknown)
- **Tool:** semgrep
- **Description:** Prototype modification. CWE-471

#### LOW: firebase-upload

- **CWE:** CWE-434 (Unrestricted Upload of File with Dangerous Type)
- **Tool:** semgrep
- **Description:** File upload. CWE-434

#### LOW: firebase-upload

- **CWE:** CWE-434 (Unrestricted Upload of File with Dangerous Type)
- **Tool:** semgrep
- **Description:** File upload. CWE-434

