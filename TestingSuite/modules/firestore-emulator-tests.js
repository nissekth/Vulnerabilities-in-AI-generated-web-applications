
let initializeTestEnvironment, assertFails, assertSucceeds;

try {
  ({
    initializeTestEnvironment,
    assertFails,
    assertSucceeds
  } = require('@firebase/rules-unit-testing'));
} catch (err) {
  throw new Error(
    'Firestore emulator tests require @firebase/rules-unit-testing.\n' +
    'Install with: npm install --save-dev @firebase/rules-unit-testing uuid --legacy-peer-deps'
  );
}

const { v4: uuidv4 } = require('uuid');

async function checkVulnerability(operation, findingDetails, findings) {
  try {
    await assertFails(operation);
  } catch (error) {
    if (error.message?.includes('Expected request to fail') || 
        error.message?.includes('PERMISSION_DENIED') === false) {
      findings.push(findingDetails);
    }
  }
}

async function checkAllowed(operation) {
  try {
    await assertSucceeds(operation);
    return true;
  } catch {
    return false;
  }
}

async function runFirestoreEmulatorTests(config) {
  const findings = [];

  if (!config.firestoreRules) {
    return findings;
  }

  const projectId = `rules-test-${uuidv4()}`;

  const testEnv = await initializeTestEnvironment({
    projectId,
    firestore: {
      rules: config.firestoreRules,
      host: 'localhost',
      port: 8080
    }
  });

  const unauthenticated = testEnv.unauthenticatedContext();
  const userAlice = testEnv.authenticatedContext('alice123', { email: 'alice@test.com' });
  const userBob = testEnv.authenticatedContext('bob456', { email: 'bob@test.com' });
  const adminUser = testEnv.authenticatedContext('admin789', { email: 'admin@test.com' });

  const unauthDb = unauthenticated.firestore();
  const aliceDb = userAlice.firestore();
  const bobDb = userBob.firestore();
  const adminDb = adminUser.firestore();

  const collections = config.collections || [];
  const userCollection = collections.find(c => c.type === 'user_data') || { name: 'users' };
  const sensitiveFields = userCollection.sensitiveFields || ['email', 'phone', 'ssn', 'password'];
  const privilegeFields = userCollection.privilegeFields || ['isAdmin', 'isOwner', 'role'];

  try {
    await checkVulnerability(
      unauthDb.collection('users').doc('alice123').get(),
      {
        category: 'A01',
        cwe: 'CWE-284',
        severity: 'HIGH',
        title: 'Unauthenticated Read Access to User Data',
        description: 'Firestore rules allow unauthenticated users to read user documents. This exposes potentially sensitive user information to anyone.',
        evidence: 'Unauthenticated read on /users/{userId} succeeded',
        remediation: 'Add authentication check: allow read: if request.auth != null'
      },
      findings
    );

    await checkVulnerability(
      unauthDb.collection('users').doc('anonymous').set({ name: 'Anonymous' }),
      {
        category: 'A01',
        cwe: 'CWE-284',
        severity: 'CRITICAL',
        title: 'Unauthenticated Write Access to User Collection',
        description: 'Firestore rules allow unauthenticated users to create/modify user documents.',
        evidence: 'Unauthenticated write on /users/{userId} succeeded',
        remediation: 'Add authentication check: allow write: if request.auth != null'
      },
      findings
    );

    await checkVulnerability(
      unauthDb.collection('posts').doc('post1').get(),
      {
        category: 'A01',
        cwe: 'CWE-284',
        severity: 'MEDIUM',
        title: 'Unauthenticated Read Access to Posts',
        description: 'Posts are readable without authentication. Consider if this is intentional for public content.',
        evidence: 'Unauthenticated read on /posts/{postId} succeeded',
        remediation: 'If posts should be private, add: allow read: if request.auth != null'
      },
      findings
    );

    await checkVulnerability(
      unauthDb.collection('messages').doc('msg1').get(),
      {
        category: 'A01',
        cwe: 'CWE-284',
        severity: 'CRITICAL',
        title: 'Unauthenticated Read Access to Private Messages',
        description: 'Private messages are readable without authentication.',
        evidence: 'Unauthenticated read on /messages/{messageId} succeeded',
        remediation: 'Messages must require authentication: allow read: if request.auth != null'
      },
      findings
    );

    await checkVulnerability(
      aliceDb.collection('users').doc('bob456').update({ bio: 'Hacked by Alice' }),
      {
        category: 'A01',
        cwe: 'CWE-285',
        severity: 'CRITICAL',
        title: 'Cross-User Profile Modification',
        description: 'Authenticated users can modify other users\' profile data.',
        evidence: 'alice123 successfully updated bob456\'s profile',
        remediation: 'Add owner check: allow update: if request.auth.uid == userId'
      },
      findings
    );
    await checkVulnerability(
      aliceDb.collection('users').doc('bob456').delete(),
      {
        category: 'A01',
        cwe: 'CWE-285',
        severity: 'CRITICAL',
        title: 'Cross-User Profile Deletion',
        description: 'Authenticated users can delete other users\' profiles.',
        evidence: 'alice123 successfully deleted bob456\'s profile',
        remediation: 'Add owner check: allow delete: if request.auth.uid == userId'
      },
      findings
    );

    await checkVulnerability(
      aliceDb.collection('posts').doc('bob-post-1').update({ content: 'Modified by Alice' }),
      {
        category: 'A01',
        cwe: 'CWE-285',
        severity: 'HIGH',
        title: 'Cross-User Post Modification',
        description: 'Users can modify posts created by other users.',
        evidence: 'alice123 successfully modified bob456\'s post',
        remediation: 'Add owner check: allow update: if request.auth.uid == resource.data.userId'
      },
      findings
    );

    await checkVulnerability(
      aliceDb.collection('posts').doc('bob-post-1').delete(),
      {
        category: 'A01',
        cwe: 'CWE-285',
        severity: 'HIGH',
        title: 'Cross-User Post Deletion',
        description: 'Users can delete posts created by other users.',
        evidence: 'alice123 successfully deleted bob456\'s post',
        remediation: 'Add owner check: allow delete: if request.auth.uid == resource.data.userId'
      },
      findings
    );

    await checkVulnerability(
      aliceDb.collection('users').doc('impersonated-user').set({ 
        name: 'Fake User',
        uid: 'impersonated-user'
      }),
      {
        category: 'A01',
        cwe: 'CWE-862',
        severity: 'HIGH',
        title: 'Missing Authorization on User Document Creation',
        description: 'Users can create user documents with arbitrary IDs, potentially impersonating other users.',
        evidence: 'alice123 created document at /users/impersonated-user',
        remediation: 'Restrict creation: allow create: if request.auth.uid == userId'
      },
      findings
    );

    await checkVulnerability(
      aliceDb.collection('admin_settings').doc('config').get(),
      {
        category: 'A01',
        cwe: 'CWE-862',
        severity: 'HIGH',
        title: 'Missing Authorization on Admin Collection',
        description: 'Admin-only collections are accessible without admin role verification.',
        evidence: 'Regular user accessed /admin_settings collection',
        remediation: 'Add admin check: allow read: if get(/databases/$(database)/documents/users/$(request.auth.uid)).data.isAdmin == true'
      },
      findings
    );

    await checkVulnerability(
      aliceDb.collection('messages').doc('private-msg').get(),
      {
        category: 'A01',
        cwe: 'CWE-863',
        severity: 'HIGH',
        title: 'Incorrect Authorization on Message Access',
        description: 'Users can read messages without being a participant in the conversation.',
        evidence: 'alice123 read message where she is not a participant',
        remediation: 'Add participant check: allow read: if request.auth.uid in resource.data.participants'
      },
      findings
    );

    await checkVulnerability(
      aliceDb.collection('messages').add({
        senderId: 'bob456', 
        content: 'Fake message from Bob',
        participants: ['bob456', 'admin789']
      }),
      {
        category: 'A01',
        cwe: 'CWE-863',
        severity: 'HIGH',
        title: 'Sender ID Spoofing in Messages',
        description: 'Users can create messages with a senderId that doesn\'t match their authentication.',
        evidence: 'alice123 created message with senderId: bob456',
        remediation: 'Validate sender: allow create: if request.resource.data.senderId == request.auth.uid'
      },
      findings
    );

    await checkVulnerability(
      aliceDb.collection('users').doc('bob456').get(),
      {
        category: 'A01',
        cwe: 'CWE-639',
        severity: 'HIGH',
        title: 'IDOR Vulnerability on User Profiles',
        description: 'Users can access other users\' profiles by simply changing the document ID in the request.',
        evidence: 'alice123 accessed bob456\'s profile by changing document ID',
        remediation: 'Restrict reads to own profile: allow read: if request.auth.uid == userId'
      },
      findings
    );

    await checkVulnerability(
      aliceDb.collection('private_data').doc('bob456').get(),
      {
        category: 'A01',
        cwe: 'CWE-639',
        severity: 'CRITICAL',
        title: 'IDOR Vulnerability on Private Data Collection',
        description: 'Private user data is accessible by manipulating document IDs.',
        evidence: 'alice123 accessed bob456\'s private data',
        remediation: 'Ensure document ID matches auth UID: allow read: if request.auth.uid == userId'
      },
      findings
    );

    await checkVulnerability(
      unauthDb.collection('any_collection').doc('any_doc').get(),
      {
        category: 'A01',
        cwe: 'CWE-276',
        severity: 'CRITICAL',
        title: 'Overly Permissive Default Rules',
        description: 'Firestore rules may have a wildcard match that allows access to any collection.',
        evidence: 'Accessed arbitrary collection without authentication',
        remediation: 'Avoid match /{document=**} with permissive rules. Define explicit rules for each collection.'
      },
      findings
    );

    await checkVulnerability(
      unauthDb.collection('test').doc('test').set({ data: 'test' }),
      {
        category: 'A01',
        cwe: 'CWE-276',
        severity: 'CRITICAL',
        title: 'Default Allow-All Write Permissions',
        description: 'Firestore rules appear to allow writes to arbitrary collections without authentication.',
        evidence: 'Unauthenticated write to arbitrary collection succeeded',
        remediation: 'Remove "allow write: if true" patterns. Require authentication for all writes.'
      },
      findings
    );

    await checkVulnerability(
      aliceDb.collection('users').doc('alice123').update({ isAdmin: true }),
      {
        category: 'A01',
        cwe: 'CWE-269',
        severity: 'CRITICAL',
        title: 'Privilege Escalation - Self-Promotion to Admin',
        description: 'Users can modify their own isAdmin field to gain administrative privileges.',
        evidence: 'alice123 set isAdmin: true on her own profile',
        remediation: 'Block privilege field modifications: allow update: if !request.resource.data.diff(resource.data).affectedKeys().hasAny([\'isAdmin\', \'isOwner\', \'role\'])'
      },
      findings
    );

    await checkVulnerability(
      aliceDb.collection('users').doc('alice123').update({ isOwner: true }),
      {
        category: 'A01',
        cwe: 'CWE-269',
        severity: 'CRITICAL',
        title: 'Privilege Escalation - Self-Promotion to Owner',
        description: 'Users can modify their own isOwner field to gain owner privileges.',
        evidence: 'alice123 set isOwner: true on her own profile',
        remediation: 'Block privilege field modifications in security rules'
      },
      findings
    );

    await checkVulnerability(
      aliceDb.collection('users').doc('alice123').update({ role: 'admin' }),
      {
        category: 'A01',
        cwe: 'CWE-269',
        severity: 'CRITICAL',
        title: 'Privilege Escalation - Role Modification',
        description: 'Users can modify their own role field to gain elevated privileges.',
        evidence: 'alice123 changed role to "admin"',
        remediation: 'Prevent role modifications by users: check that role field is unchanged in update rules'
      },
      findings
    );

    await checkVulnerability(
      unauthDb.collection('users').limit(10).get(),
      {
        category: 'A01',
        cwe: 'CWE-200',
        severity: 'HIGH',
        title: 'User Enumeration via Collection Listing',
        description: 'Unauthenticated users can list/enumerate user documents, exposing user data.',
        evidence: 'Unauthenticated list query on /users succeeded',
        remediation: 'Prevent listing: require authentication and consider restricting list queries'
      },
      findings
    );

    await checkVulnerability(
      aliceDb.collection('users').doc('admin789').set({
        name: 'Fake Admin',
        email: 'fake@admin.com',
        isAdmin: true
      }),
      {
        category: 'A01',
        cwe: 'CWE-566',
        severity: 'CRITICAL',
        title: 'Document Creation with Arbitrary ID',
        description: 'Users can create documents with any ID, potentially overwriting or impersonating other users.',
        evidence: 'alice123 created/overwrote document at /users/admin789',
        remediation: 'Restrict document creation to own ID: allow create: if request.auth.uid == userId'
      },
      findings
    );

    await checkVulnerability(
      aliceDb.collection('groups').doc('private-group').collection('messages').doc('msg1').get(),
      {
        category: 'A01',
        cwe: 'CWE-668',
        severity: 'HIGH',
        title: 'Group Messages Exposed to Non-Members',
        description: 'Users can read messages from groups they are not members of.',
        evidence: 'alice123 read messages from private-group without membership',
        remediation: 'Verify group membership before allowing access to group resources'
      },
      findings
    );
    
    await checkVulnerability(
      bobDb.collection('posts').where('status', '==', 'draft').where('userId', '==', 'alice123').get(),
      {
        category: 'A01',
        cwe: 'CWE-668',
        severity: 'MEDIUM',
        title: 'Draft Content Exposed to Other Users',
        description: 'Unpublished/draft content is accessible to users other than the author.',
        evidence: 'bob456 accessed alice123\'s draft posts',
        remediation: 'Add visibility check: allow read: if resource.data.status == "published" || request.auth.uid == resource.data.userId'
      },
      findings
    );

    await checkVulnerability(
      aliceDb.collection('config').doc('api_keys').get(),
      {
        category: 'A01',
        cwe: 'CWE-922',
        severity: 'CRITICAL',
        title: 'Sensitive Configuration Data Accessible',
        description: 'API keys or other sensitive configuration stored in Firestore is accessible to regular users.',
        evidence: 'Regular user accessed /config/api_keys document',
        remediation: 'Sensitive config should not be in client-accessible Firestore. Use Cloud Functions or secure backend storage.'
      },
      findings
    );

    await checkVulnerability(
      aliceDb.collection('users').doc('bob456').collection('private_notes').doc('note1').get(),
      {
        category: 'A01',
        cwe: 'CWE-275',
        severity: 'HIGH',
        title: 'Subcollection Permission Bypass',
        description: 'Subcollections may have different (weaker) permissions than their parent documents.',
        evidence: 'alice123 accessed bob456\'s private_notes subcollection',
        remediation: 'Ensure subcollections have explicit rules: match /users/{userId}/private_notes/{noteId}'
      },
      findings
    );

  } catch (error) {
    findings.push({
      category: 'ERROR',
      cwe: 'N/A',
      severity: 'INFO',
      title: 'Firestore Test Execution Error',
      description: `Some tests could not complete: ${error.message}`,
      evidence: error.stack?.split('\n').slice(0, 3).join('\n'),
      remediation: 'Check emulator configuration and rules syntax'
    });
  } finally {
    await testEnv.cleanup();
  }

  return findings;
}

module.exports = {
  runFirestoreEmulatorTests
};

