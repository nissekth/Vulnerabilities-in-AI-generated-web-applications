# Security Assessment Report

**Application:** Social Media App  
**Target:** https://claude1-f630a.web.app  
**Date:** 2025-12-15T15:55:28.582Z  
**Duration:** 100s

## Summary

| Severity | Count |
|----------|-------|
| CRITICAL | 4 |
| HIGH | 17 |
| MEDIUM | 27 |
| LOW | 2 |

**Risk Score:** 181 (CRITICAL)


### Deduplication Summary

| Metric | Value |
|--------|-------|
| Original Findings | 60 |
| After Deduplication | 50 |
| Duplicates Removed | 10 |
| Reduction | 17% |

## Findings

### A01: Broken Access Control

#### CRITICAL: Authorization Bypass - No Owner Verification

- **CWE:** CWE-285 (Improper Authorization)
- **Tool:** static-analysis
- **Description:** Rule only checks authentication, not authorization. Any authenticated user can modify any document.
- **Remediation:** Add owner check: allow update: if request.auth != null && request.auth.uid == userId

#### CRITICAL: Document Creation with Arbitrary ID

- **CWE:** CWE-566 (Unknown)
- **Tool:** firebase-emulator
- **Description:** Users can create documents with any ID, potentially overwriting or impersonating other users.
- **Remediation:** Restrict document creation to own ID: allow create: if request.auth.uid == userId

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

#### HIGH: Missing Authorization on User Document Creation

- **CWE:** CWE-862 (Missing Authorization)
- **Tool:** firebase-emulator
- **Description:** Users can create user documents with arbitrary IDs, potentially impersonating other users.
- **Remediation:** Restrict creation: allow create: if request.auth.uid == userId

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

#### HIGH: client-side-isadmin

- **CWE:** CWE-863 (Incorrect Authorization)
- **Tool:** semgrep
- **Description:** Client-side admin check. CWE-863

#### MEDIUM: Unauthenticated Read Access to Posts

- **CWE:** CWE-284 (Improper Access Control)
- **Tool:** firebase-emulator
- **Description:** Posts are readable without authentication. Consider if this is intentional for public content.
- **Remediation:** If posts should be private, add: allow read: if request.auth != null

#### MEDIUM: firebase-no-auth-deletedoc

- **CWE:** CWE-284 (Improper Access Control)
- **Tool:** semgrep
- **Description:** Firestore deleteDoc without auth check. CWE-284

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

#### HIGH: Hardcoded Generic Password found

- **CWE:** CWE-798 (Unknown)
- **Tool:** crypto-scanner
- **Description:** Found potential Generic Password in https://www.googletagmanager.com/gtag/js?l=dataLayer&id=G-QNY21XMFM0

#### MEDIUM: Vulnerable dependency: @firebase/auth

- **CWE:** CWE-1035 (Unknown)
- **Tool:** sca
- **Description:** undici
- **Remediation:** Update to fixed version

#### MEDIUM: Vulnerable dependency: @firebase/auth-compat

- **CWE:** CWE-1035 (Unknown)
- **Tool:** sca
- **Description:** @firebase/auth, undici
- **Remediation:** Update to fixed version

#### MEDIUM: Vulnerable dependency: @firebase/firestore

- **CWE:** CWE-1035 (Unknown)
- **Tool:** sca
- **Description:** undici
- **Remediation:** Update to fixed version

#### MEDIUM: Vulnerable dependency: @firebase/firestore-compat

- **CWE:** CWE-1035 (Unknown)
- **Tool:** sca
- **Description:** @firebase/firestore
- **Remediation:** Update to fixed version

#### MEDIUM: Vulnerable dependency: @firebase/functions

- **CWE:** CWE-1035 (Unknown)
- **Tool:** sca
- **Description:** undici
- **Remediation:** Update to fixed version

#### MEDIUM: Vulnerable dependency: @firebase/functions-compat

- **CWE:** CWE-1035 (Unknown)
- **Tool:** sca
- **Description:** @firebase/functions
- **Remediation:** Update to fixed version

#### MEDIUM: Vulnerable dependency: @firebase/storage

- **CWE:** CWE-1035 (Unknown)
- **Tool:** sca
- **Description:** undici
- **Remediation:** Update to fixed version

#### MEDIUM: Vulnerable dependency: @firebase/storage-compat

- **CWE:** CWE-1035 (Unknown)
- **Tool:** sca
- **Description:** @firebase/storage
- **Remediation:** Update to fixed version

#### MEDIUM: Vulnerable dependency: esbuild

- **CWE:** CWE-1035 (Unknown)
- **Tool:** sca
- **Description:** esbuild enables any website to send any requests to the development server and read the response
- **Remediation:** Update to fixed version

#### MEDIUM: Vulnerable dependency: firebase

- **CWE:** CWE-1035 (Unknown)
- **Tool:** sca
- **Description:** @firebase/auth, @firebase/auth-compat, @firebase/firestore, @firebase/firestore-compat, @firebase/functions, @firebase/functions-compat, @firebase/storage, @firebase/storage-compat
- **Remediation:** Update to fixed version

#### MEDIUM: Vulnerable dependency: undici

- **CWE:** CWE-1035 (Unknown)
- **Tool:** sca
- **Description:** Use of Insufficiently Random Values in undici, undici Denial of Service attack via bad certificate data
- **Remediation:** Update to fixed version

#### MEDIUM: Vulnerable dependency: vite

- **CWE:** CWE-1035 (Unknown)
- **Tool:** sca
- **Description:** esbuild
- **Remediation:** Update to fixed version

#### MEDIUM: Public Storage Access

- **CWE:** CWE-311 (Missing Encryption of Sensitive Data)
- **Tool:** static-analysis
- **Description:** Storage files are publicly readable. Consider if this is necessary.
- **Remediation:** Consider: allow read: if request.auth != null

#### MEDIUM: Weak Random detected

- **CWE:** CWE-330 (Use of Insufficiently Random Values)
- **Tool:** crypto-scanner
- **Description:** Found Weak Random in https://www.googletagmanager.com/gtag/js?l=dataLayer&id=G-QNY21XMFM0. This may indicate weak cryptographic practices.

#### MEDIUM: Hardcoded Generic Token found

- **CWE:** CWE-798 (Unknown)
- **Tool:** crypto-scanner
- **Description:** Found potential Generic Token in https://claude1-f630a.web.app/assets/index-Ksqx9DM4.js

### A03: Injection

#### CRITICAL: Template injection (Angular/Vue)

- **CWE:** CWE-94 (Code Injection)
- **Tool:** injection-scanner
- **Description:** Template expression "<%= 7*7 %>" was evaluated to "49". This indicates server or client-side template injection.

#### CRITICAL: Template injection (Angular sandbox escape)

- **CWE:** CWE-94 (Code Injection)
- **Tool:** injection-scanner
- **Description:** Template expression "{{constructor.constructor("return 7*7")()}}" was evaluated to "49". This indicates server or client-side template injection.

#### HIGH: Unrestricted File Type Upload - Executable

- **CWE:** CWE-434 (Unrestricted Upload of File with Dangerous Type)
- **Tool:** firebase-emulator
- **Description:** Storage rules do not restrict executable file uploads.
- **Remediation:** Add content type validation: allow write: if request.resource.contentType.matches('image/.*')

#### MEDIUM: Missing File Type Validation in Storage Rules

- **CWE:** CWE-434 (Unrestricted Upload of File with Dangerous Type)
- **Tool:** static-analysis
- **Description:** Storage rules do not validate file content type
- **Remediation:** Add: && request.resource.contentType.matches('image/.*')

#### MEDIUM: Unrestricted File Type Upload - HTML

- **CWE:** CWE-434 (Unrestricted Upload of File with Dangerous Type)
- **Tool:** firebase-emulator
- **Description:** Storage rules allow HTML file uploads which could be used for XSS.
- **Remediation:** Restrict to safe content types for user uploads

#### MEDIUM: Unrestricted File Type Upload - SVG

- **CWE:** CWE-434 (Unrestricted Upload of File with Dangerous Type)
- **Tool:** firebase-emulator
- **Description:** Storage rules allow SVG uploads which can contain embedded scripts.
- **Remediation:** If allowing images, explicitly list safe types: image/jpeg, image/png, image/gif, image/webp

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

