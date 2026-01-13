# Security Assessment Report

**Application:** Social Media App  
**Target:** https://gpt-3-3dd1e.firebaseapp.com  
**Date:** 2025-12-15T15:02:27.350Z  
**Duration:** 107s

## Summary

| Severity | Count |
|----------|-------|
| CRITICAL | 4 |
| HIGH | 20 |
| MEDIUM | 10 |
| LOW | 0 |

**Risk Score:** 160 (CRITICAL)


### Deduplication Summary

| Metric | Value |
|--------|-------|
| Original Findings | 41 |
| After Deduplication | 34 |
| Duplicates Removed | 7 |
| Reduction | 17% |

## Findings

### A01: Broken Access Control

#### CRITICAL: Overly Permissive Default Rules

- **CWE:** CWE-276 (Unknown)
- **Tool:** firebase-emulator
- **Description:** Firestore rules may have a wildcard match that allows access to any collection.
- **Remediation:** Avoid match /{document=**} with permissive rules. Define explicit rules for each collection.

#### CRITICAL: Unauthenticated Read Access to Private Messages

- **CWE:** CWE-284 (Improper Access Control)
- **Tool:** firebase-emulator
- **Description:** Private messages are readable without authentication.
- **Remediation:** Messages must require authentication: allow read: if request.auth != null

#### CRITICAL: IDOR Vulnerability on Private Data Collection

- **CWE:** CWE-639 (IDOR)
- **Tool:** firebase-emulator
- **Description:** Private user data is accessible by manipulating document IDs.
- **Remediation:** Ensure document ID matches auth UID: allow read: if request.auth.uid == userId

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

#### HIGH: Subcollection Permission Bypass

- **CWE:** CWE-275 (Unknown)
- **Tool:** firebase-emulator
- **Description:** Subcollections may have different (weaker) permissions than their parent documents.
- **Remediation:** Ensure subcollections have explicit rules: match /users/{userId}/private_notes/{noteId}

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

#### HIGH: Group Messages Exposed to Non-Members

- **CWE:** CWE-668 (Unknown)
- **Tool:** firebase-emulator
- **Description:** Users can read messages from groups they are not members of.
- **Remediation:** Verify group membership before allowing access to group resources

#### HIGH: Missing Authorization on Admin Collection

- **CWE:** CWE-862 (Missing Authorization)
- **Tool:** firebase-emulator
- **Description:** Admin-only collections are accessible without admin role verification.
- **Remediation:** Add admin check: allow read: if get(/databases/$(database)/documents/users/$(request.auth.uid)).data.isAdmin == true

#### HIGH: Incorrect Authorization on Message Access

- **CWE:** CWE-863 (Incorrect Authorization)
- **Tool:** firebase-emulator
- **Description:** Users can read messages without being a participant in the conversation.
- **Remediation:** Add participant check: allow read: if request.auth.uid in resource.data.participants

#### MEDIUM: Unauthenticated Read Access to Posts

- **CWE:** CWE-284 (Improper Access Control)
- **Tool:** firebase-emulator
- **Description:** Posts are readable without authentication. Consider if this is intentional for public content.
- **Remediation:** If posts should be private, add: allow read: if request.auth != null

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

#### MEDIUM: improper-auth-admin-string

- **CWE:** CWE-285 (Improper Authorization)
- **Tool:** semgrep
- **Description:** Client-side admin role check. CWE-285

#### MEDIUM: Draft Content Exposed to Other Users

- **CWE:** CWE-668 (Unknown)
- **Tool:** firebase-emulator
- **Description:** Unpublished/draft content is accessible to users other than the author.
- **Remediation:** Add visibility check: allow read: if resource.data.status == "published" || request.auth.uid == resource.data.userId

### A02: Cryptographic Failures

#### HIGH: Hardcoded Google API Key found

- **CWE:** CWE-798 (Unknown)
- **Tool:** crypto-scanner
- **Description:** Found potential Google API Key in https://gpt-3-3dd1e.firebaseapp.com/firebase-config.js

#### MEDIUM: Weak Random detected

- **CWE:** CWE-330 (Use of Insufficiently Random Values)
- **Tool:** crypto-scanner
- **Description:** Found Weak Random in https://gpt-3-3dd1e.firebaseapp.com/app.js. This may indicate weak cryptographic practices.

#### MEDIUM: Weak password policy

- **CWE:** CWE-521 (Weak Password Requirements)
- **Tool:** crypto-scanner
- **Description:** Password field "register-password" has weak policy: no minimum length requirement (should be ≥8), no pattern for password complexity

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

