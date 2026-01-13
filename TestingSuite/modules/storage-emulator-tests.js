

const {
  initializeTestEnvironment,
  assertFails,
  assertSucceeds
} = require('@firebase/rules-unit-testing');

const { v4: uuidv4 } = require('uuid');

async function checkStorageVulnerability(operation, findingDetails, findings) {
  try {
    await assertFails(operation);
    // if no assertFails -> operation was correctly denied
  } catch (error) {
    // if assertFails -> operation issue
    if (error.message?.includes('Expected request to fail') || 
        !error.message?.includes('PERMISSION_DENIED')) {
      findings.push(findingDetails);
    }
  }
}

async function runStorageEmulatorTests(config) {
  const findings = [];

  if (!config.storageRules) {
    return findings;
  }

  const projectId = `storage-test-${uuidv4()}`;

  let testEnv;
  try {
    testEnv = await initializeTestEnvironment({
      projectId,
      storage: {
        rules: config.storageRules,
        host: 'localhost',
        port: 9199
      }
    });
  } catch (error) {
    findings.push({
      category: 'ERROR',
      cwe: 'N/A',
      severity: 'INFO',
      title: 'Storage Emulator Initialization Error',
      description: `Could not initialize storage emulator: ${error.message}`,
      evidence: null,
      remediation: 'Check storage emulator configuration and rules syntax'
    });
    return findings;
  }


  const unauthContext = testEnv.unauthenticatedContext();
  const aliceContext = testEnv.authenticatedContext('alice123');
  const bobContext = testEnv.authenticatedContext('bob456');
  const adminContext = testEnv.authenticatedContext('admin789');

  try {
    try {
      const unauthStorage = unauthContext.storage();
      const profileRef = unauthStorage.ref('profiles/alice123/avatar.png');
      await assertFails(profileRef.getDownloadURL());
    } catch (error) {
      if (error.message?.includes('Expected request to fail')) {
        findings.push({
          category: 'A01',
          cwe: 'CWE-284',
          severity: 'MEDIUM',
          title: 'Unauthenticated Read Access to Profile Images',
          description: 'Profile images are publicly readable without authentication.',
          evidence: 'Unauthenticated getDownloadURL on /profiles/{userId}/* succeeded',
          remediation: 'Add authentication check: allow read: if request.auth != null'
        });
      }
    }

    try {
      const unauthStorage = unauthContext.storage();
      const uploadRef = unauthStorage.ref('uploads/anonymous/test.txt');
      await assertFails(uploadRef.putString('anonymous upload', 'raw'));
    } catch (error) {
      if (error.message?.includes('Expected request to fail')) {
        findings.push({
          category: 'A01',
          cwe: 'CWE-284',
          severity: 'CRITICAL',
          title: 'Unauthenticated Write Access to Storage',
          description: 'Files can be uploaded without authentication.',
          evidence: 'Unauthenticated upload to /uploads/* succeeded',
          remediation: 'Require authentication: allow write: if request.auth != null'
        });
      }
    }

    try {
      const unauthStorage = unauthContext.storage();
      const privateRef = unauthStorage.ref('private/alice123/document.pdf');
      await assertFails(privateRef.getDownloadURL());
    } catch (error) {
      if (error.message?.includes('Expected request to fail')) {
        findings.push({
          category: 'A01',
          cwe: 'CWE-284',
          severity: 'HIGH',
          title: 'Unauthenticated Access to Private Files',
          description: 'Private files are accessible without authentication.',
          evidence: 'Unauthenticated access to /private/* succeeded',
          remediation: 'Private paths must require authentication and ownership verification'
        });
      }
    }

    try {
      const bobStorage = bobContext.storage();
      const aliceProfileRef = bobStorage.ref('profiles/alice123/malicious.png');
      await assertFails(aliceProfileRef.putString('malicious content', 'raw'));
    } catch (error) {
      if (error.message?.includes('Expected request to fail')) {
        findings.push({
          category: 'A01',
          cwe: 'CWE-285',
          severity: 'HIGH',
          title: 'Cross-User Profile Storage Write',
          description: 'Users can upload files to other users\' profile directories.',
          evidence: 'bob456 successfully wrote to /profiles/alice123/',
          remediation: 'Add owner check: allow write: if request.auth.uid == userId'
        });
      }
    }

    try {
      const bobStorage = bobContext.storage();
      const aliceProfileRef = bobStorage.ref('profiles/alice123/avatar.png');
      await assertFails(aliceProfileRef.delete());
    } catch (error) {
      if (error.message?.includes('Expected request to fail')) {
        findings.push({
          category: 'A01',
          cwe: 'CWE-285',
          severity: 'HIGH',
          title: 'Cross-User Profile Storage Delete',
          description: 'Users can delete files from other users\' profile directories.',
          evidence: 'bob456 successfully deleted from /profiles/alice123/',
          remediation: 'Add owner check: allow delete: if request.auth.uid == userId'
        });
      }
    }

    try {
      const bobStorage = bobContext.storage();
      const alicePostRef = bobStorage.ref('posts/alice123/attachments/malicious.pdf');
      await assertFails(alicePostRef.putString('malicious content', 'raw'));
    } catch (error) {
      if (error.message?.includes('Expected request to fail')) {
        findings.push({
          category: 'A01',
          cwe: 'CWE-285',
          severity: 'HIGH',
          title: 'Cross-User Post Attachments Write',
          description: 'Users can upload files to other users\' post attachment directories.',
          evidence: 'bob456 successfully wrote to /posts/alice123/attachments/',
          remediation: 'Add owner check: allow write: if request.auth.uid == userId'
        });
      }
    }

    try {
      const aliceStorage = aliceContext.storage();
      const bobPrivateRef = aliceStorage.ref('private/bob456/secret-document.pdf');
      await assertFails(bobPrivateRef.getDownloadURL());
    } catch (error) {
      if (error.message?.includes('Expected request to fail')) {
        findings.push({
          category: 'A01',
          cwe: 'CWE-639',
          severity: 'CRITICAL',
          title: 'IDOR on Private Storage Paths',
          description: 'Users can access other users\' private files by changing the userId in the path.',
          evidence: 'alice123 accessed /private/bob456/ by changing path',
          remediation: 'Ensure path userId matches auth: allow read: if request.auth.uid == userId'
        });
      }
    }

    try {
      const aliceStorage = aliceContext.storage();
      const bobBackupRef = aliceStorage.ref('backups/bob456/data.json');
      await assertFails(bobBackupRef.getDownloadURL());
    } catch (error) {
      if (error.message?.includes('Expected request to fail')) {
        findings.push({
          category: 'A01',
          cwe: 'CWE-639',
          severity: 'CRITICAL',
          title: 'IDOR on User Backup Files',
          description: 'Users can access other users\' backup files.',
          evidence: 'alice123 accessed /backups/bob456/',
          remediation: 'Restrict backup access to owner only'
        });
      }
    }

    try {
      const aliceStorage = aliceContext.storage();
      const systemRef = aliceStorage.ref('system/config.json');
      await assertFails(systemRef.putString('{"hacked": true}', 'raw'));
    } catch (error) {
      if (error.message?.includes('Expected request to fail')) {
        findings.push({
          category: 'A01',
          cwe: 'CWE-862',
          severity: 'CRITICAL',
          title: 'Missing Authorization on System Paths',
          description: 'Regular users can write to system/admin storage paths.',
          evidence: 'alice123 successfully wrote to /system/',
          remediation: 'System paths should deny all client writes or require admin verification'
        });
      }
    }

    try {
      const aliceStorage = aliceContext.storage();
      const adminRef = aliceStorage.ref('admin/secrets.json');
      await assertFails(adminRef.getDownloadURL());
    } catch (error) {
      if (error.message?.includes('Expected request to fail')) {
        findings.push({
          category: 'A01',
          cwe: 'CWE-862',
          severity: 'HIGH',
          title: 'Missing Authorization on Admin Storage',
          description: 'Admin storage paths are accessible to regular users.',
          evidence: 'alice123 accessed /admin/ storage path',
          remediation: 'Admin paths should verify admin role via custom claims or Firestore lookup'
        });
      }
    }

    try {
      const unauthStorage = unauthContext.storage();
      const wildcardRef = unauthStorage.ref('random/path/file.txt');
      await assertFails(wildcardRef.putString('test', 'raw'));
    } catch (error) {
      if (error.message?.includes('Expected request to fail')) {
        findings.push({
          category: 'A01',
          cwe: 'CWE-276',
          severity: 'CRITICAL',
          title: 'Overly Permissive Default Storage Rules',
          description: 'Storage rules allow writes to arbitrary paths without authentication.',
          evidence: 'Unauthenticated write to random path succeeded',
          remediation: 'Avoid match /{allPaths=**} with allow write: if true'
        });
      }
    }

    try {
      const aliceStorage = aliceContext.storage();
      const rootRef = aliceStorage.ref('root-level-file.txt');
      await assertFails(rootRef.putString('root write', 'raw'));
    } catch (error) {
      if (error.message?.includes('Expected request to fail')) {
        findings.push({
          category: 'A01',
          cwe: 'CWE-276',
          severity: 'MEDIUM',
          title: 'Root Level Storage Write Allowed',
          description: 'Users can write files at the storage root level.',
          evidence: 'Write to root level succeeded',
          remediation: 'Organize storage into specific paths with explicit rules'
        });
      }
    }

    try {
      const unauthStorage = unauthContext.storage();
      const idRef = unauthStorage.ref('verification/alice123/id-document.jpg');
      await assertFails(idRef.getDownloadURL());
    } catch (error) {
      if (error.message?.includes('Expected request to fail')) {
        findings.push({
          category: 'A01',
          cwe: 'CWE-200',
          severity: 'CRITICAL',
          title: 'Public Access to Identity Documents',
          description: 'ID verification documents are publicly accessible.',
          evidence: 'Unauthenticated access to /verification/* succeeded',
          remediation: 'ID documents must be strictly owner-only or admin-only access'
        });
      }
    }

    try {
      const aliceStorage = aliceContext.storage();
      const exeRef = aliceStorage.ref('profiles/alice123/malware.exe');
      await assertFails(exeRef.putString('MZ...', 'raw', { contentType: 'application/x-msdownload' }));
    } catch (error) {
      if (error.message?.includes('Expected request to fail')) {
        findings.push({
          category: 'A03',
          cwe: 'CWE-434',
          severity: 'HIGH',
          title: 'Unrestricted File Type Upload - Executable',
          description: 'Storage rules do not restrict executable file uploads.',
          evidence: 'Upload of .exe file to profiles succeeded',
          remediation: 'Add content type validation: allow write: if request.resource.contentType.matches(\'image/.*\')'
        });
      }
    }

    try {
      const aliceStorage = aliceContext.storage();
      const htmlRef = aliceStorage.ref('profiles/alice123/malicious.html');
      await assertFails(htmlRef.putString('<script>alert("xss")</script>', 'raw', { contentType: 'text/html' }));
    } catch (error) {
      if (error.message?.includes('Expected request to fail')) {
        findings.push({
          category: 'A03',
          cwe: 'CWE-434',
          severity: 'MEDIUM',
          title: 'Unrestricted File Type Upload - HTML',
          description: 'Storage rules allow HTML file uploads which could be used for XSS.',
          evidence: 'Upload of .html file succeeded',
          remediation: 'Restrict to safe content types for user uploads'
        });
      }
    }

    try {
      const aliceStorage = aliceContext.storage();
      const svgRef = aliceStorage.ref('profiles/alice123/malicious.svg');
      const svgContent = '<svg xmlns="http://www.w3.org/2000/svg"><script>alert("xss")</script></svg>';
      await assertFails(svgRef.putString(svgContent, 'raw', { contentType: 'image/svg+xml' }));
    } catch (error) {
      if (error.message?.includes('Expected request to fail')) {
        findings.push({
          category: 'A03',
          cwe: 'CWE-434',
          severity: 'MEDIUM',
          title: 'Unrestricted File Type Upload - SVG',
          description: 'Storage rules allow SVG uploads which can contain embedded scripts.',
          evidence: 'Upload of .svg file succeeded',
          remediation: 'If allowing images, explicitly list safe types: image/jpeg, image/png, image/gif, image/webp'
        });
      }
    }
  } catch (error) {
    findings.push({
      category: 'ERROR',
      cwe: 'N/A',
      severity: 'INFO',
      title: 'Storage Test Execution Error',
      description: `Some storage tests could not complete: ${error.message}`,
      evidence: error.stack?.split('\n').slice(0, 3).join('\n'),
      remediation: 'Check storage emulator configuration and rules syntax'
    });
  } finally {
    if (testEnv) {
      await testEnv.cleanup();
    }
  }

  return findings;
}

module.exports = { runStorageEmulatorTests };

