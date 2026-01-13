#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const yaml = require('yaml');

// Firebase SDK
let initializeApp, getAuth, signInWithEmailAndPassword, signOut;
let getFirestore, collection, doc, getDoc, getDocs, updateDoc, addDoc, deleteDoc, serverTimestamp;
let getStorage, ref, uploadString, deleteObject;

try {
  const firebase = require('firebase/app');
  const auth = require('firebase/auth');
  const firestore = require('firebase/firestore');
  const storage = require('firebase/storage');
  
  initializeApp = firebase.initializeApp;
  getAuth = auth.getAuth;
  signInWithEmailAndPassword = auth.signInWithEmailAndPassword;
  signOut = auth.signOut;
  getFirestore = firestore.getFirestore;
  collection = firestore.collection;
  doc = firestore.doc;
  getDoc = firestore.getDoc;
  getDocs = firestore.getDocs;
  updateDoc = firestore.updateDoc;
  addDoc = firestore.addDoc;
  deleteDoc = firestore.deleteDoc;
  serverTimestamp = firestore.serverTimestamp;
  getStorage = storage.getStorage;
  ref = storage.ref;
  uploadString = storage.uploadString;
  deleteObject = storage.deleteObject;
} catch (error) {
  console.error('Firebase SDK not installed. Run: npm install firebase');
  process.exit(1);
}

let config = null;
let app = null;
let authInstance = null;
let db = null;
let storageInstance = null;

const findings = [];
const testResults = [];

const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m',
  bgRed: '\x1b[41m',
  bgGreen: '\x1b[42m',
  bgMagenta: '\x1b[45m'
};

function log(type, msg) {
  const icons = {
    info: `${colors.blue}ℹ${colors.reset}`,
    success: `${colors.green}✓${colors.reset}`,
    fail: `${colors.red}✗${colors.reset}`,
    warn: `${colors.yellow}⚠${colors.reset}`,
    step: `${colors.cyan}→${colors.reset}`,
    vuln: `${colors.bgRed}${colors.white} VULN ${colors.reset}`,
    safe: `${colors.bgGreen}${colors.white} SAFE ${colors.reset}`
  };
  console.log(`${icons[type] || '•'} ${msg}`);
}

function header(title) {
  console.log(`\n${colors.bgMagenta}${colors.white} ${title} ${colors.reset}\n`);
}

function loadConfig(configPath) {
  try {
    const content = fs.readFileSync(configPath, 'utf8');
    return yaml.parse(content);
  } catch (error) {
    console.error(`Error loading config: ${error.message}`);
    process.exit(1);
  }
}

function addFinding(category, cwe, severity, title, description, evidence = null, remediation = null) {
  findings.push({
    id: `LIVE-${String(findings.length + 1).padStart(3, '0')}`,
    category,
    cwe,
    severity,
    title,
    description,
    evidence,
    remediation,
    tool: 'live-scanner',
    confirmed: true,
    timestamp: new Date().toISOString()
  });
}

function addTestResult(name, passed, details = '') {
  testResults.push({ name, passed, details, timestamp: new Date().toISOString() });
  if (passed) {
    log('safe', `${name}: ${details || 'Protected'}`);
  } else {
    log('vuln', `${name}: ${details || 'Vulnerable'}`);
  }
}

async function authenticate(accountId) {
  const account = config.accounts.find(a => a.id === accountId);
  if (!account) throw new Error(`Account not found: ${accountId}`);
  
  await signOut(authInstance);
  const credential = await signInWithEmailAndPassword(authInstance, account.email, account.password);
  log('success', `Authenticated as ${accountId} (${account.email})`);
  return credential.user;
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function testA01_PrivilegeEscalation() {
  header('TEST: Privilege Escalation (CWE-269)');
  
  try {
    // Get regular user account
    const userAccount = config.accounts.find(a => a.role === 'user');
    if (!userAccount) {
      log('warn', 'No user account configured');
      return;
    }
    
    const user = await authenticate(userAccount.id);
    const userId = user.uid;
    
    // Check current admin status
    log('step', 'Checking current privilege flags...');
    const beforeDoc = await getDoc(doc(db, 'users', userId));
    const beforeData = beforeDoc.data();
    const wasAdmin = beforeData?.isAdmin || false;
    const wasOwner = beforeData?.isOwner || false;
    
    log('info', `Current isAdmin: ${wasAdmin}, isOwner: ${wasOwner}`);
    
    // Attempt to set isAdmin = true
    log('step', 'Attempting to set isAdmin = true...');
    try {
      await updateDoc(doc(db, 'users', userId), { isAdmin: true });
      
      // Verify
      const afterDoc = await getDoc(doc(db, 'users', userId));
      const afterData = afterDoc.data();
      
      if (afterData?.isAdmin === true && !wasAdmin) {
        addFinding('A01', 'CWE-269', 'CRITICAL',
          'Privilege Escalation: Self-Elevation to Admin',
          'User successfully set their own isAdmin flag to true',
          { userId, before: wasAdmin, after: true },
          'Prevent modification of privilege fields in Firestore rules OR use Custom Claims'
        );
        addTestResult('Privilege Escalation (isAdmin)', false, 'User elevated to admin');
        
        // Revert
        await updateDoc(doc(db, 'users', userId), { isAdmin: wasAdmin });
        log('info', 'Reverted isAdmin flag');
      } else {
        addTestResult('Privilege Escalation (isAdmin)', true, 'Could not modify isAdmin');
      }
    } catch (error) {
      addTestResult('Privilege Escalation (isAdmin)', true, `Protected: ${error.message}`);
    }
    
    // Attempt to set isOwner = true
    log('step', 'Attempting to set isOwner = true...');
    try {
      await updateDoc(doc(db, 'users', userId), { isOwner: true });
      
      const afterDoc = await getDoc(doc(db, 'users', userId));
      const afterData = afterDoc.data();
      
      if (afterData?.isOwner === true && !wasOwner) {
        addFinding('A01', 'CWE-269', 'CRITICAL',
          'Privilege Escalation: Self-Elevation to Owner',
          'User successfully set their own isOwner flag to true',
          { userId, before: wasOwner, after: true },
          'Prevent modification of privilege fields in Firestore rules'
        );
        addTestResult('Privilege Escalation (isOwner)', false, 'User elevated to owner');
        
        // Revert
        await updateDoc(doc(db, 'users', userId), { isOwner: wasOwner });
        log('info', 'Reverted isOwner flag');
      } else {
        addTestResult('Privilege Escalation (isOwner)', true, 'Could not modify isOwner');
      }
    } catch (error) {
      addTestResult('Privilege Escalation (isOwner)', true, `Protected: ${error.message}`);
    }
    
  } catch (error) {
    log('fail', `Test error: ${error.message}`);
  }
}

async function testA01_CrossUserModification() {
  header('TEST: Cross-User Profile Modification (CWE-285)');
  
  try {
    const userAccount = config.accounts.find(a => a.role === 'user');
    if (!userAccount) return;
    
    const attacker = await authenticate(userAccount.id);
    const attackerId = attacker.uid;
    
    // Find another user
    log('step', 'Finding target user...');
    const usersSnap = await getDocs(collection(db, 'users'));
    const victim = usersSnap.docs.find(d => d.id !== attackerId);
    
    if (!victim) {
      log('warn', 'No other users found to test');
      return;
    }
    
    const victimId = victim.id;
    const originalBio = victim.data().bio || '';
    
    log('info', `Target: ${victim.data().email || victimId}`);
    
    // Attempt to modify victim's profile
    log('step', 'Attempting to modify target profile...');
    const testBio = `[SECURITY TEST ${Date.now()}]`;
    
    try {
      await updateDoc(doc(db, 'users', victimId), { bio: testBio });
      
      // Verify
      const modifiedDoc = await getDoc(doc(db, 'users', victimId));
      
      if (modifiedDoc.data()?.bio === testBio) {
        addFinding('A01', 'CWE-285', 'CRITICAL',
          'Improper Authorization: Cross-User Profile Modification',
          `User ${attackerId} modified user ${victimId}'s profile`,
          { attacker: attackerId, victim: victimId, modified: 'bio' },
          'Add owner check: allow update: if request.auth.uid == userId'
        );
        addTestResult('Cross-User Modification', false, 'Modified other user profile');
        
        // Revert
        await updateDoc(doc(db, 'users', victimId), { bio: originalBio });
        log('info', 'Reverted victim profile');
      } else {
        addTestResult('Cross-User Modification', true, 'Could not modify other user');
      }
    } catch (error) {
      addTestResult('Cross-User Modification', true, `Protected: ${error.message}`);
    }
    
  } catch (error) {
    log('fail', `Test error: ${error.message}`);
  }
}

async function testA01_UnauthenticatedAccess() {
  header('TEST: Unauthenticated Data Access (CWE-284)');
  
  try {
    log('step', 'Signing out...');
    await signOut(authInstance);
    
    // Try to read users collection
    log('step', 'Attempting to read users collection without auth...');
    try {
      const usersSnap = await getDocs(collection(db, 'users'));
      
      if (usersSnap.docs.length > 0) {
        const sampleData = usersSnap.docs[0].data();
        const exposedFields = Object.keys(sampleData);
        const sensitiveFields = exposedFields.filter(f => 
          ['email', 'age', 'friends', 'friendRequests', 'referralCode', 'city', 'country'].includes(f)
        );
        
        addFinding('A01', 'CWE-284', 'HIGH',
          'Improper Access Control: Unauthenticated User Data Access',
          `${usersSnap.docs.length} user profiles readable without authentication`,
          { userCount: usersSnap.docs.length, exposedFields, sensitiveFields },
          'Change to: allow read: if request.auth != null'
        );
        addTestResult('Unauthenticated User Read', false, `Read ${usersSnap.docs.length} users`);
      } else {
        addTestResult('Unauthenticated User Read', true, 'No users readable');
      }
    } catch (error) {
      addTestResult('Unauthenticated User Read', true, `Protected: ${error.message}`);
    }
    
    // Try to read posts collection
    log('step', 'Attempting to read posts collection without auth...');
    try {
      const postsSnap = await getDocs(collection(db, 'posts'));
      
      if (postsSnap.docs.length > 0) {
        addFinding('A02', 'CWE-311', 'MEDIUM',
          'Public Post Access',
          `${postsSnap.docs.length} posts readable without authentication`,
          { postCount: postsSnap.docs.length },
          'Consider: allow read: if resource.data.visibility == "public"'
        );
        addTestResult('Unauthenticated Post Read', false, `Read ${postsSnap.docs.length} posts`);
      } else {
        addTestResult('Unauthenticated Post Read', true, 'No posts readable');
      }
    } catch (error) {
      addTestResult('Unauthenticated Post Read', true, `Protected: ${error.message}`);
    }
    
  } catch (error) {
    log('fail', `Test error: ${error.message}`);
  }
}

async function testA01_MessageInjection() {
  header('TEST: Message Injection (CWE-284)');
  
  try {
    const userAccount = config.accounts.find(a => a.role === 'user');
    if (!userAccount) return;
    
    const attacker = await authenticate(userAccount.id);
    const attackerId = attacker.uid;
    
    // Find two other users
    const usersSnap = await getDocs(collection(db, 'users'));
    const otherUsers = usersSnap.docs.filter(d => d.id !== attackerId);
    
    if (otherUsers.length < 2) {
      log('warn', 'Need at least 2 other users to test message injection');
      return;
    }
    
    const victimA = otherUsers[0].id;
    const victimB = otherUsers[1].id;
    
    log('info', `Attempting to create message between ${victimA} and ${victimB}`);
    
    // Attempt to create message between other users
    log('step', 'Creating message with attacker NOT in participants...');
    try {
      const msgRef = await addDoc(collection(db, 'messages'), {
        content: '[SECURITY TEST] Injected message',
        senderId: victimA, // Spoofed sender
        senderName: 'Injected',
        participants: [victimA, victimB], // Attacker not included
        createdAt: serverTimestamp()
      });
      
      addFinding('A01', 'CWE-284', 'HIGH',
        'Message Injection: Create Messages Between Other Users',
        'Attacker created a message appearing to be between other users without being a participant',
        { messageId: msgRef.id, spoofedSender: victimA, recipient: victimB },
        'Validate sender in rules: request.auth.uid in request.resource.data.participants && request.resource.data.senderId == request.auth.uid'
      );
      addTestResult('Message Injection', false, 'Created fake message');
      
      // Cleanup
      await deleteDoc(msgRef);
      log('info', 'Deleted test message');
      
    } catch (error) {
      addTestResult('Message Injection', true, `Protected: ${error.message}`);
    }
    
  } catch (error) {
    log('fail', `Test error: ${error.message}`);
  }
}

async function testA01_IDOR() {
  header('TEST: IDOR - Access Other Users Data (CWE-639)');
  
  try {
    const userAccount = config.accounts.find(a => a.role === 'user');
    if (!userAccount) return;
    
    await authenticate(userAccount.id);
    
    //Try to read all users' data
    log('step', 'Attempting to enumerate all users...');
    try {
      const usersSnap = await getDocs(collection(db, 'users'));
      
      if (usersSnap.docs.length > 1) {
        const userData = usersSnap.docs.map(d => ({
          id: d.id,
          email: d.data().email,
          hasPrivateData: !!(d.data().age || d.data().friends?.length)
        }));
        
        addFinding('A01', 'CWE-639', 'MEDIUM',
          'IDOR: User Enumeration',
          'Authenticated user can enumerate and access all user profiles',
          { usersAccessible: userData.length },
          'Restrict read access to own profile or implement field-level security'
        );
        addTestResult('User Enumeration', false, `Accessed ${userData.length} users`);
      } else {
        addTestResult('User Enumeration', true, 'Only own profile accessible');
      }
    } catch (error) {
      addTestResult('User Enumeration', true, `Protected: ${error.message}`);
    }
    
  } catch (error) {
    log('fail', `Test error: ${error.message}`);
  }
}

async function testA02_PIIExposure() {
  header('TEST: PII Exposure (CWE-359)');
  
  try {
    const userAccount = config.accounts.find(a => a.role === 'user');
    if (!userAccount) return;
    
    const user = await authenticate(userAccount.id);
    const userId = user.uid;
    
    const usersSnap = await getDocs(collection(db, 'users'));
    const otherUsers = usersSnap.docs.filter(d => d.id !== userId);
    
    if (otherUsers.length > 0) {
      const sampleUser = otherUsers[0].data();
      const piiFields = [];
      
      if (sampleUser.email) piiFields.push('email');
      if (sampleUser.age) piiFields.push('age');
      if (sampleUser.city) piiFields.push('city');
      if (sampleUser.country) piiFields.push('country');
      if (sampleUser.friends) piiFields.push('friends');
      if (sampleUser.friendRequests) piiFields.push('friendRequests');
      if (sampleUser.referralCode) piiFields.push('referralCode');
      
      if (piiFields.length > 0) {
        addFinding('A02', 'CWE-359', 'HIGH',
          'Exposure of Private Personal Information',
          `Other users' PII accessible: ${piiFields.join(', ')}`,
          { exposedPII: piiFields, affectedUsers: otherUsers.length },
          'Implement field-level access control or separate public/private profile data'
        );
        addTestResult('PII Exposure', false, `Exposed: ${piiFields.join(', ')}`);
      } else {
        addTestResult('PII Exposure', true, 'No PII exposed');
      }
    }
    
  } catch (error) {
    log('fail', `Test error: ${error.message}`);
  }
}

async function testA03_StoredXSS() {
  header('TEST: Stored XSS (CWE-79)');
  
  try {
    const userAccount = config.accounts.find(a => a.role === 'user');
    if (!userAccount) return;
    
    const user = await authenticate(userAccount.id);
    const userId = user.uid;
    
    const xssPayloads = [
      '<script>alert("XSS")</script>',
      '<img src=x onerror=alert("XSS")>',
      '<svg onload=alert("XSS")>',
      'javascript:alert("XSS")'
    ];
    
    log('step', 'Testing XSS payload storage in posts...');
    
    let storedCount = 0;
    for (const payload of xssPayloads) {
      try {
        const postRef = await addDoc(collection(db, 'posts'), {
          userId,
          userName: 'XSS Test',
          content: payload,
          likes: [],
          comments: [],
          visibility: 'public',
          createdAt: serverTimestamp()
        });
        
        const postDoc = await getDoc(postRef);
        if (postDoc.data()?.content === payload) {
          storedCount++;
        }
        
        await deleteDoc(postRef);
        
      } catch (error) {
        // Blocked - good
      }
    }
    
    if (storedCount > 0) {
      addFinding('A03', 'CWE-79', 'MEDIUM',
        'Stored XSS: Unsanitized Content Storage',
        `${storedCount}/${xssPayloads.length} XSS payloads stored without sanitization. If rendered with dangerouslySetInnerHTML, XSS is possible.`,
        { storedPayloads: storedCount, totalTested: xssPayloads.length },
        'Sanitize user input with DOMPurify before storage'
      );
      addTestResult('Stored XSS', false, `${storedCount} payloads stored`);
    } else {
      addTestResult('Stored XSS', true, 'All payloads blocked');
    }
    
  } catch (error) {
    log('fail', `Test error: ${error.message}`);
  }
}


function generateReport() {
  const reportDir = config.scanner?.reports?.outputDir || './reports';
  
  if (!fs.existsSync(reportDir)) {
    fs.mkdirSync(reportDir, { recursive: true });
  }
  
  const report = {
    metadata: {
      scanDate: new Date().toISOString(),
      target: config.app?.url,
      projectId: config.firebase?.projectId,
      type: 'live-security-test'
    },
    summary: {
      total: findings.length,
      bySeverity: {
        CRITICAL: findings.filter(f => f.severity === 'CRITICAL').length,
        HIGH: findings.filter(f => f.severity === 'HIGH').length,
        MEDIUM: findings.filter(f => f.severity === 'MEDIUM').length,
        LOW: findings.filter(f => f.severity === 'LOW').length
      },
      testResults: {
        passed: testResults.filter(t => t.passed).length,
        failed: testResults.filter(t => !t.passed).length
      }
    },
    findings,
    testResults
  };
  
  fs.writeFileSync(`${reportDir}/live-scan-results.json`, JSON.stringify(report, null, 2));
  
  return report;
}

function printSummary(report) {
  console.log(`\n${colors.bgMagenta}${colors.white} LIVE SCAN SUMMARY ${colors.reset}\n`);
  
  console.log(`Tests Passed:  ${colors.green}${report.summary.testResults.passed}${colors.reset}`);
  console.log(`Tests Failed:  ${colors.red}${report.summary.testResults.failed}${colors.reset}`);
  console.log('');
  console.log(`${colors.bgRed}${colors.white} CRITICAL ${colors.reset}  ${report.summary.bySeverity.CRITICAL}`);
  console.log(`${colors.red}HIGH${colors.reset}       ${report.summary.bySeverity.HIGH}`);
  console.log(`${colors.yellow}MEDIUM${colors.reset}     ${report.summary.bySeverity.MEDIUM}`);
  console.log(`${colors.blue}LOW${colors.reset}        ${report.summary.bySeverity.LOW}`);
  console.log('');
  
  if (report.summary.bySeverity.CRITICAL > 0) {
    console.log(`${colors.bgRed}${colors.white} ⚠ CRITICAL VULNERABILITIES CONFIRMED ${colors.reset}`);
    findings.filter(f => f.severity === 'CRITICAL').forEach(f => {
      console.log(`  ${colors.red}•${colors.reset} ${f.title}`);
    });
  }
}




async function main() {
  const args = process.argv.slice(2);
  let configPath = 'config.yaml';
  
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--config' || args[i] === '-c') {
      configPath = args[++i];
    }
  }
  
  let resolvedConfigPath = configPath;
  if (!fs.existsSync(resolvedConfigPath)) {
    resolvedConfigPath = path.resolve(__dirname, '..', configPath);
  }
  if (!fs.existsSync(resolvedConfigPath)) {
    resolvedConfigPath = path.resolve(configPath);
  }
  if (!fs.existsSync(resolvedConfigPath)) {
    console.error(`Config file not found: ${configPath}`);
    console.error('Tried locations:');
    console.error(`  - ${configPath}`);
    console.error(`  - ${path.resolve(__dirname, '..', configPath)}`);
    console.error(`  - ${path.resolve(configPath)}`);
    process.exit(1);
  }
  
  // Load config
  config = loadConfig(resolvedConfigPath);
  
  if (config.sourcePath && !path.isAbsolute(config.sourcePath)) {
    config.sourcePath = path.resolve(path.dirname(resolvedConfigPath), config.sourcePath);
  }
  
  console.log(`${colors.bgMagenta}${colors.white}`);
  console.log('╔══════════════════════════════════════════════════════════════════════╗');
  console.log('║              LIVE FIREBASE SECURITY TESTER                           ║');
  console.log('║              OWASP Top 10:2021 (A01-A03)                              ║');
  console.log('╚══════════════════════════════════════════════════════════════════════╝');
  console.log(`${colors.reset}`);
  
  console.log(`Target: ${colors.cyan}${config.app?.url}${colors.reset}`);
  console.log(`Project: ${colors.cyan}${config.firebase?.projectId}${colors.reset}`);
  console.log(`Date: ${colors.cyan}${new Date().toISOString()}${colors.reset}\n`);
  
  log('step', 'Initializing Firebase...');
  app = initializeApp(config.firebase);
  authInstance = getAuth(app);
  db = getFirestore(app);
  storageInstance = getStorage(app);
  log('success', 'Firebase initialized');
  
  try {
    await testA01_PrivilegeEscalation();
    await sleep(1000);
    
    await testA01_CrossUserModification();
    await sleep(1000);
    
    await testA01_UnauthenticatedAccess();
    await sleep(1000);
    
    await testA01_MessageInjection();
    await sleep(1000);
    
    await testA01_IDOR();
    await sleep(1000);
    
    await testA02_PIIExposure();
    await sleep(1000);
    
    await testA03_StoredXSS();
    
    const report = generateReport();
    printSummary(report);
    
    console.log(`\n${colors.green}✓${colors.reset} Report saved to: ${config.scanner?.reports?.outputDir || './reports'}/live-scan-results.json`);
    
    // Sign out
    await signOut(authInstance);
    
  } catch (error) {
    console.error(`${colors.red}Error: ${error.message}${colors.reset}`);
    console.error(error.stack);
    process.exit(1);
  }
}

main();
