# Security Assessment Report

**Application:** Social Media App  
**Target:** https://claude2-93180.firebaseapp.com  
**Date:** 2025-12-15T21:53:50.248Z  
**Duration:** 139s

## Summary

| Severity | Count |
|----------|-------|
| CRITICAL | 0 |
| HIGH | 16 |
| MEDIUM | 4 |
| LOW | 0 |

**Risk Score:** 88 (CRITICAL)


### Deduplication Summary

| Metric | Value |
|--------|-------|
| Original Findings | 23 |
| After Deduplication | 20 |
| Duplicates Removed | 3 |
| Reduction | 13% |

## Findings

### A01: Broken Access Control

#### HIGH: Unrestricted Read Access

- **CWE:** CWE-284 (Improper Access Control)
- **Tool:** static-analysis
- **Description:** Rule allows anyone to read data without authentication
- **Remediation:** Change to: allow read: if request.auth != null

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

#### MEDIUM: Draft Content Exposed to Other Users

- **CWE:** CWE-668 (Unknown)
- **Tool:** firebase-emulator
- **Description:** Unpublished/draft content is accessible to users other than the author.
- **Remediation:** Add visibility check: allow read: if resource.data.status == "published" || request.auth.uid == resource.data.userId

### A02: Cryptographic Failures

#### HIGH: Hardcoded Google API Key found

- **CWE:** CWE-798 (Unknown)
- **Tool:** crypto-scanner
- **Description:** Found potential Google API Key in https://claude2-93180.firebaseapp.com/config.js

#### MEDIUM: Public Storage Access

- **CWE:** CWE-311 (Missing Encryption of Sensitive Data)
- **Tool:** static-analysis
- **Description:** Storage files are publicly readable. Consider if this is necessary.
- **Remediation:** Consider: allow read: if request.auth != null

#### MEDIUM: Weak password policy

- **CWE:** CWE-521 (Weak Password Requirements)
- **Tool:** crypto-scanner
- **Description:** Password field "registerPassword" has weak policy: no minimum length requirement (should be ≥8), no pattern for password complexity

### A03: Injection

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

