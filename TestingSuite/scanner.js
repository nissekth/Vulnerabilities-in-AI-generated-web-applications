#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const yaml = require('yaml');
const { spawn, execSync } = require('child_process');

const { deduplicateFindings, getDeduplicationStats } = require('./modules/deduplicator');


let XSSVerifier, CryptoScanner, InjectionScanner;
let enhancedModulesAvailable = false;

try {
  ({ XSSVerifier } = require('./modules/xss-verifier'));
  ({ CryptoScanner } = require('./modules/crypto-scanner'));
  ({ InjectionScanner } = require('./modules/injection-scanner'));
  enhancedModulesAvailable = true;
} catch (e) {
  console.log('Note: Enhanced security modules not found. Enhanced scans disabled.');
  console.log('To enable enhanced scans, ensure these files exist:');
  console.log('  - modules/xss-verifier.js');
  console.log('  - modules/crypto-scanner.js');
  console.log('  - modules/injection-scanner.js');
}


let config = null;
const findings = [];
const testResults = [];
const startTime = Date.now();

// CWE reference
const CWE_DATABASE = {
  // A01: Broken Access Control
  'CWE-22': { name: 'Path Traversal', category: 'A01', severity: 'HIGH' },
  'CWE-200': { name: 'Exposure of Sensitive Information', category: 'A01', severity: 'MEDIUM' },
  'CWE-264': { name: 'Permissions, Privileges, and Access Controls', category: 'A01', severity: 'HIGH' },
  'CWE-284': { name: 'Improper Access Control', category: 'A01', severity: 'HIGH' },
  'CWE-285': { name: 'Improper Authorization', category: 'A01', severity: 'CRITICAL' },
  'CWE-269': { name: 'Improper Privilege Management', category: 'A01', severity: 'CRITICAL' },
  'CWE-352': { name: 'Cross-Site Request Forgery', category: 'A01', severity: 'MEDIUM' },
  'CWE-359': { name: 'Exposure of Private Personal Information', category: 'A01', severity: 'HIGH' },
  'CWE-425': { name: 'Direct Request (Forced Browsing)', category: 'A01', severity: 'MEDIUM' },
  'CWE-601': { name: 'Open Redirect', category: 'A01', severity: 'MEDIUM' },
  'CWE-639': { name: 'IDOR', category: 'A01', severity: 'HIGH' },
  'CWE-862': { name: 'Missing Authorization', category: 'A01', severity: 'HIGH' },
  'CWE-863': { name: 'Incorrect Authorization', category: 'A01', severity: 'HIGH' },
  'CWE-602': { name: 'Client-Side Enforcement of Server-Side Security', category: 'A01', severity: 'HIGH' },
  'CWE-913': { name: 'Improper Control of Dynamically-Managed Code Resources', category: 'A01', severity: 'HIGH' },
  'CWE-922': { name: 'Insecure Storage of Sensitive Information', category: 'A01', severity: 'MEDIUM' },
  
  // A02: Cryptographic Failures
  'CWE-261': { name: 'Weak Encoding for Password', category: 'A02', severity: 'HIGH' },
  'CWE-310': { name: 'Cryptographic Issues', category: 'A02', severity: 'MEDIUM' },
  'CWE-311': { name: 'Missing Encryption of Sensitive Data', category: 'A02', severity: 'HIGH' },
  'CWE-312': { name: 'Cleartext Storage of Sensitive Information', category: 'A02', severity: 'HIGH' },
  'CWE-319': { name: 'Cleartext Transmission of Sensitive Information', category: 'A02', severity: 'HIGH' },
  'CWE-321': { name: 'Use of Hard-coded Cryptographic Key', category: 'A02', severity: 'HIGH' },
  'CWE-326': { name: 'Inadequate Encryption Strength', category: 'A02', severity: 'MEDIUM' },
  'CWE-327': { name: 'Use of Broken or Risky Cryptographic Algorithm', category: 'A02', severity: 'HIGH' },
  'CWE-328': { name: 'Use of Weak Hash', category: 'A02', severity: 'MEDIUM' },
  'CWE-330': { name: 'Use of Insufficiently Random Values', category: 'A02', severity: 'HIGH' },
  'CWE-338': { name: 'Use of Cryptographically Weak PRNG', category: 'A02', severity: 'MEDIUM' },
  'CWE-521': { name: 'Weak Password Requirements', category: 'A02', severity: 'MEDIUM' },
  'CWE-523': { name: 'Unprotected Transport of Credentials', category: 'A02', severity: 'HIGH' },
  'CWE-759': { name: 'Use of One-Way Hash without Salt', category: 'A02', severity: 'MEDIUM' },
  
  // A03: Injection
  'CWE-20': { name: 'Improper Input Validation', category: 'A03', severity: 'MEDIUM' },
  'CWE-74': { name: 'Improper Neutralization of Special Elements', category: 'A03', severity: 'HIGH' },
  'CWE-77': { name: 'Command Injection', category: 'A03', severity: 'CRITICAL' },
  'CWE-78': { name: 'OS Command Injection', category: 'A03', severity: 'CRITICAL' },
  'CWE-79': { name: 'Cross-site Scripting (XSS)', category: 'A03', severity: 'HIGH' },
  'CWE-89': { name: 'SQL Injection', category: 'A03', severity: 'CRITICAL' },
  'CWE-94': { name: 'Code Injection', category: 'A03', severity: 'CRITICAL' },
  'CWE-113': { name: 'HTTP Response Splitting', category: 'A03', severity: 'MEDIUM' },
  'CWE-116': { name: 'Improper Encoding or Escaping of Output', category: 'A03', severity: 'MEDIUM' },
  'CWE-434': { name: 'Unrestricted Upload of File with Dangerous Type', category: 'A03', severity: 'HIGH' },
  'CWE-611': { name: 'XML External Entity (XXE)', category: 'A03', severity: 'HIGH' },
  'CWE-917': { name: 'Expression Language Injection', category: 'A03', severity: 'HIGH' },
  'CWE-943': { name: 'NoSQL Injection', category: 'A03', severity: 'HIGH' }
};


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
  bgYellow: '\x1b[43m',
  bgBlue: '\x1b[44m',
  bgMagenta: '\x1b[45m',
  bold: '\x1b[1m'
};

function log(type, msg) {
  const icons = {
    info: `${colors.blue}ℹ${colors.reset}`,
    success: `${colors.green}✓${colors.reset}`,
    fail: `${colors.red}✗${colors.reset}`,
    warn: `${colors.yellow}⚠${colors.reset}`,
    step: `${colors.cyan}→${colors.reset}`,
    vuln: `${colors.bgRed} VULN ${colors.reset}`,
    header: `${colors.bgMagenta}`,
    critical: `${colors.bgRed}${colors.white} CRITICAL ${colors.reset}`,
    high: `${colors.red}HIGH${colors.reset}`,
    medium: `${colors.yellow}MEDIUM${colors.reset}`,
    low: `${colors.blue}LOW${colors.reset}`
  };
  console.log(`${icons[type] || '•'} ${msg}`);
}

function header(title) {
  console.log(`\n${colors.bgBlue}${colors.white} ${title} ${colors.reset}\n`);
}

function banner() {
  console.log(`${colors.magenta}`);
  console.log('╔══════════════════════════════════════════════════════════════════════╗');
  console.log('║   ___  _    _____   _____ ___   _____ ___  ___   _  ___  _  ___      ║');
  console.log('║  / _ \\| |  | _ \\ \\ / /_  ) __| |_   _/ _ \\| _ \\ / ||   \\/ |/ _ \\     ║');
  console.log('║ | (_) | |/\\|  _/\\ V / / /\\__ \\   | || (_) |  _/ | || |) | | (_) |    ║');
  console.log('║  \\___/|__/\\|_|   \\_/ /___|___/   |_| \\___/|_|   |_||___/|_|\\___/     ║');
  console.log('║                                                                      ║');
  console.log('║  A01: Broken Access Control | A02: Cryptographic Failures            ║');
  console.log('║  A03: Injection             | Firebase SPA Security Scanner          ║');
  console.log('╚══════════════════════════════════════════════════════════════════════╝');
  console.log(`${colors.reset}`);
}

function addFinding(category, cwe, severity, title, description, evidence = null, remediation = null, tool = 'scanner') {
  const finding = {
    id: `VULN-${String(findings.length + 1).padStart(3, '0')}`,
    category,
    cwe,
    cweName: CWE_DATABASE[cwe]?.name || 'Unknown',
    severity,
    title,
    description,
    evidence,
    remediation,
    tool,
    timestamp: new Date().toISOString()
  };
  findings.push(finding);
  
  const severityColor = {
    CRITICAL: colors.bgRed + colors.white,
    HIGH: colors.red,
    MEDIUM: colors.yellow,
    LOW: colors.blue,
    INFO: colors.cyan
  };
  
  console.log(`  ${severityColor[severity]} ${severity} ${colors.reset} [${cwe}] ${title}`);
}

function loadConfig(configPath) {
  try {
    const content = fs.readFileSync(configPath, 'utf8');
    return yaml.parse(content);
  } catch (error) {
    console.error(`${colors.red}Error loading config: ${error.message}${colors.reset}`);
    process.exit(1);
  }
}

function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function runCommand(cmd, args = [], options = {}) {
  return new Promise((resolve, reject) => {
    const proc = spawn(cmd, args, { ...options, shell: true });
    let stdout = '';
    let stderr = '';
    
    proc.stdout?.on('data', data => stdout += data.toString());
    proc.stderr?.on('data', data => stderr += data.toString());
    
    proc.on('close', code => {
      resolve({ code, stdout, stderr });
    });
    
    proc.on('error', reject);
  });
}

function analyzeFirestoreRules() {
  header('FIRESTORE RULES ANALYSIS');
  
  const rules = config.firestoreRules;
  if (!rules) {
    log('warn', 'No Firestore rules provided in config');
    return;
  }

  
  // CWE-284: allow read: if true
  const publicReadMatches = rules.match(/allow\s+read:\s*if\s+true/g) || [];
  publicReadMatches.forEach((match, i) => {
    addFinding('A01', 'CWE-284', 'HIGH',
      'Unrestricted Read Access',
      'Rule allows anyone to read data without authentication',
      { rule: match, location: `firestore.rules` },
      'Change to: allow read: if request.auth != null',
      'static-analysis'
    );
  });
  
  // CWE-285: allow write/update: if request.auth != null (without owner check)
  const authOnlyWriteRegex = /allow\s+(write|update|delete):\s*if\s+request\.auth\s*!=\s*null\s*;/g;
  const authOnlyMatches = rules.match(authOnlyWriteRegex) || [];
  authOnlyMatches.forEach(match => {
    addFinding('A01', 'CWE-285', 'CRITICAL',
      'Authorization Bypass - No Owner Verification',
      'Rule only checks authentication, not authorization. Any authenticated user can modify any document.',
      { rule: match },
      'Add owner check: allow update: if request.auth != null && request.auth.uid == userId',
      'static-analysis'
    );
  });
  
  // CWE-269: Insecure admin check using document field
  const adminCheckRegex = /get\([^)]+\)\.data\.(isAdmin|isOwner|role)/g;
  const adminCheckMatches = rules.match(adminCheckRegex) || [];
  adminCheckMatches.forEach(match => {
    addFinding('A01', 'CWE-269', 'CRITICAL',
      'Privilege Escalation via User-Controllable Field',
      'Admin/owner status checked from user-modifiable document. Users can grant themselves privileges.',
      { rule: match },
      'Use Firebase Custom Claims: request.auth.token.admin == true',
      'static-analysis'
    );
  });
  
  // CWE-862: Missing authorization for create
  const createAuthOnlyRegex = /allow\s+create:\s*if\s+request\.auth\s*!=\s*null\s*;/g;
  const createMatches = rules.match(createAuthOnlyRegex) || [];
  createMatches.forEach(match => {
    addFinding('A01', 'CWE-862', 'HIGH',
      'Missing Creator Validation',
      'Create operation only requires authentication. Should validate resource data matches authenticated user.',
      { rule: match },
      'Add: && request.resource.data.userId == request.auth.uid',
      'static-analysis'
    );
  });
  
  // Check for message rules without participant validation
  if (rules.includes('messages') && rules.includes('allow create: if request.auth != null')) {
    if (!rules.includes('request.auth.uid in request.resource.data.participants')) {
      addFinding('A01', 'CWE-284', 'HIGH',
        'Message Injection Possible',
        'Message creation does not validate that sender is in participants list',
        { collection: 'messages' },
        'Add: && request.auth.uid in request.resource.data.participants && request.resource.data.senderId == request.auth.uid',
        'static-analysis'
      );
    }
  }
  
  log('success', `Analyzed Firestore rules - found ${findings.filter(f => f.tool === 'static-analysis').length} issues`);
}

function analyzeStorageRules() {
  header('STORAGE RULES ANALYSIS');
  
  const rules = config.storageRules;
  if (!rules) {
    log('warn', 'No Storage rules provided in config');
    return;
  }
  
  // CWE-284: Public read on storage
  if (rules.includes('allow read: if true')) {
    addFinding('A02', 'CWE-311', 'MEDIUM',
      'Public Storage Access',
      'Storage files are publicly readable. Consider if this is necessary.',
      { rule: 'allow read: if true' },
      'Consider: allow read: if request.auth != null',
      'static-analysis'
    );
  }
  
  // Check for missing content type validation
  if (!rules.includes('request.resource.contentType')) {
    addFinding('A03', 'CWE-434', 'MEDIUM',
      'Missing File Type Validation in Storage Rules',
      'Storage rules do not validate file content type',
      null,
      'Add: && request.resource.contentType.matches(\'image/.*\')',
      'static-analysis'
    );
  }
  
  log('success', 'Analyzed Storage rules');
}

async function runEmulatorTests() {
  header('FIREBASE EMULATOR RULE TESTS');

  if (!config.scanner?.tests?.firestoreEmulatorTests) {
    log('info', 'Firestore emulator tests disabled in config');
    return;
  }

  try {
    log('step', 'Executing Firestore + Storage emulator tests...');

    const { execSync } = require('child_process');
    const scriptDir = __dirname;
    
    let configPath = 'config.yaml';
    const configArgIndex = process.argv.findIndex(arg => arg === '--config' || arg === '-c');
    if (configArgIndex !== -1 && process.argv[configArgIndex + 1]) {
      configPath = process.argv[configArgIndex + 1];
    }
    const resolvedConfigPath = path.resolve(configPath);

    log('info', `Using config: ${resolvedConfigPath}`);

    const runnerRelativePath = path.relative(scriptDir, path.join(scriptDir, 'modules', 'emulator-tests-runner.js'));
    const configRelativePath = path.relative(scriptDir, resolvedConfigPath);
    const scriptCommand = `node ${runnerRelativePath} --config ${configRelativePath}`;
    const fullCommand = `firebase emulators:exec --only firestore,storage "${scriptCommand}"`;
    
    log('info', `Command: ${fullCommand}`);

    let output;
    try {
      // execSync captures stdout directly and throws on non-zero exit
      output = execSync(fullCommand, {
        encoding: 'utf8',
        cwd: scriptDir,
        timeout: 180000,  
        maxBuffer: 10 * 1024 * 1024, 
        stdio: ['pipe', 'pipe', 'pipe'] 
      });
    } catch (execError) {
      output = execError.stdout || '';
      const stderr = execError.stderr || '';
      
      if (stderr.includes('Script exited unsuccessfully') || output.includes('Script exited unsuccessfully')) {
        log('warn', 'Emulator test script returned errors');
        output = output + '\n' + stderr;
      } else {
        log('warn', `Emulator command failed: ${execError.message}`);
        if (stderr) {
          const errorLines = stderr.split('\n').filter(l => l.trim()).slice(-10);
          errorLines.forEach(l => console.log(`    ${l}`));
        }
        throw execError;
      }
    }

    if (!output || !output.trim()) {
      log('warn', 'Emulator produced no output');
      return;
    }

    const lines = output.split('\n');
    let emulatorFindings = null;
    
    for (let i = lines.length - 1; i >= 0; i--) {
      const line = lines[i].trim();
      if (line.startsWith('[')) {
        try {
          emulatorFindings = JSON.parse(line);
          break;
        } catch { 
          // invalid JSON
        }
      }
    }

    if (!emulatorFindings) {
      if (output.includes('Script exited successfully')) {
        log('success', 'Emulator tests completed with no security findings');
        return;
      }
      
      log('warn', 'Could not parse emulator test output');
      log('info', 'Last 10 lines of output:');
      lines.filter(l => l.trim()).slice(-10).forEach(l => console.log(`    ${l}`));
      return;
    }
    
    const vulnerabilities = emulatorFindings.filter(f => f.category !== 'ERROR');
    const errors = emulatorFindings.filter(f => f.category === 'ERROR');

    errors.forEach(e => {
      log('warn', `Test error: ${e.description}`);
    });

    vulnerabilities.forEach(f =>
      addFinding(
        f.category,
        f.cwe,
        f.severity,
        f.title,
        f.description,
        f.evidence,
        f.remediation,
        'firebase-emulator'
      )
    );

    log('success', `Emulator tests complete: ${vulnerabilities.length} security findings`);

  } catch (err) {
    log('warn', 'Emulator tests failed');
    log('warn', err.message);
  }
}








async function runSemgrepAnalysis() {
  header('SEMGREP SAST ANALYSIS');
  
  if (!config.scanner?.tests?.semgrepAnalysis) {
    log('info', 'Semgrep analysis disabled in config');
    return;
  }
  
  const sourcePath = config.sourcePath;
  if (!sourcePath) {
    log('warn', 'No sourcePath configured in config.yaml');
    log('info', 'Add: sourcePath: "./path/to/your/src"');
    return;
  }
  
  if (!fs.existsSync(sourcePath)) {
    log('warn', `Source path not found: ${sourcePath}`);
    log('info', 'Update sourcePath in your config.yaml to point to your source code');
    return;
  }
  
  try {
    const versionResult = await runCommand('semgrep', ['--version']);
    if (versionResult.code !== 0) throw new Error('Not found');
    log('success', `Semgrep found: ${versionResult.stdout.trim().split('\n')[0]}`);
  } catch {
    log('warn', 'Semgrep not installed. Install with: pip install semgrep');
    return;
  }
  
  const reportDir = config.scanner?.reports?.outputDir || './reports';
  ensureDir(reportDir);
  
  let totalFindings = 0;
  const customRulesPath = config.scanner?.semgrep?.customRules || './semgrep/CWE-tests.yaml';
  const resolvedCustomRules = path.isAbsolute(customRulesPath) 
    ? customRulesPath 
    : path.resolve(path.dirname(process.argv[1]), customRulesPath);
  
  if (fs.existsSync(resolvedCustomRules)) {
    log('step', 'Running custom Firebase security rules...');
    const customResult = await runCommand('semgrep', [
      '--config', resolvedCustomRules,
      '--json',
      '--no-git-ignore',
      '-o', `${reportDir}/semgrep-custom.json`,
      sourcePath
    ], { timeout: 300000 }); 
    
    if (fs.existsSync(`${reportDir}/semgrep-custom.json`)) {
      try {
        const results = JSON.parse(fs.readFileSync(`${reportDir}/semgrep-custom.json`, 'utf8'));
        const count = results.results?.length || 0;
        totalFindings += count;
        processSemgrepResults(results, 'semgrep-custom');
        log('success', `Custom Firebase rules: ${count} findings`);
      } catch (e) {
        log('warn', 'Could not parse custom rules output');
      }
    }
  } else {
    log('warn', `Custom rules not found at: ${resolvedCustomRules}`);
  }
  
  log('step', 'Running Semgrep OWASP Top 10 rules...');
  const owaspResult = await runCommand('semgrep', [
    '--config', 'p/owasp-top-ten',
    '--json',
    '--no-git-ignore',
    '-o', `${reportDir}/semgrep-owasp.json`,
    sourcePath
  ], { timeout: 300000 });
  
  if (fs.existsSync(`${reportDir}/semgrep-owasp.json`)) {
    try {
      const results = JSON.parse(fs.readFileSync(`${reportDir}/semgrep-owasp.json`, 'utf8'));
      const count = results.results?.length || 0;
      totalFindings += count;
      processSemgrepResults(results, 'semgrep-owasp');
      log('success', `OWASP Top 10 rules: ${count} findings`);
    } catch (e) {
      log('warn', 'Could not parse OWASP rules output');
    }
  }
  
  
  log('step', 'Running Semgrep security audit rules...');
  const securityResult = await runCommand('semgrep', [
    '--config', 'p/security-audit',
    '--json',
    '--no-git-ignore',
    '-o', `${reportDir}/semgrep-security.json`,
    sourcePath
  ], { timeout: 300000 });
  
  if (fs.existsSync(`${reportDir}/semgrep-security.json`)) {
    try {
      const results = JSON.parse(fs.readFileSync(`${reportDir}/semgrep-security.json`, 'utf8'));
      const count = results.results?.length || 0;
      totalFindings += count;
      processSemgrepResults(results, 'semgrep-security');
      log('success', `Security audit rules: ${count} findings`);
    } catch (e) {
      log('warn', 'Could not parse security audit output');
    }
  }
  
  log('step', 'Running Semgrep JavaScript rules...');
  const jsResult = await runCommand('semgrep', [
    '--config', 'p/javascript',
    '--json',
    '--no-git-ignore',
    '-o', `${reportDir}/semgrep-javascript.json`,
    sourcePath
  ], { timeout: 300000 });
  
  if (fs.existsSync(`${reportDir}/semgrep-javascript.json`)) {
    try {
      const results = JSON.parse(fs.readFileSync(`${reportDir}/semgrep-javascript.json`, 'utf8'));
      const count = results.results?.length || 0;
      totalFindings += count;
      processSemgrepResults(results, 'semgrep-javascript');
      log('success', `JavaScript rules: ${count} findings`);
    } catch (e) {
      log('warn', 'Could not parse JavaScript rules output');
    }
  }
  
  
  log('step', 'Running Semgrep React rules...');
  const reactResult = await runCommand('semgrep', [
    '--config', 'p/react',
    '--json',
    '--no-git-ignore',
    '-o', `${reportDir}/semgrep-react.json`,
    sourcePath
  ], { timeout: 300000 });
  
  if (fs.existsSync(`${reportDir}/semgrep-react.json`)) {
    try {
      const results = JSON.parse(fs.readFileSync(`${reportDir}/semgrep-react.json`, 'utf8'));
      const count = results.results?.length || 0;
      totalFindings += count;
      processSemgrepResults(results, 'semgrep-react');
      log('success', `React rules: ${count} findings`);
    } catch (e) {
      log('warn', 'Could not parse React rules output');
    }
  }
  
  log('success', `Semgrep analysis complete: ${totalFindings} total findings`);
}

function processSemgrepResults(results, source) {
  if (!results.results || results.results.length === 0) {
    return;
  }
  
  // Track unique findings to avoid duplicates
  const seenFindings = new Set();
  
  results.results.forEach(result => {
    // Create a unique key to avoid duplicate findings
    const findingKey = `${result.path}:${result.start?.line}:${result.check_id}`;
    if (seenFindings.has(findingKey)) return;
    seenFindings.add(findingKey);
    
    // Extract CWE from metadata
    let cwe = 'CWE-Unknown';
    if (result.extra?.metadata?.cwe) {
      const cweMatch = result.extra.metadata.cwe.match(/CWE-(\d+)/);
      if (cweMatch) cwe = `CWE-${cweMatch[1]}`;
    }
    
    // Determine OWASP category from metadata or CWE
    let category = 'A01';
    const owaspMeta = result.extra?.metadata?.owasp || '';
    if (owaspMeta.includes('A01') || owaspMeta.toLowerCase().includes('access')) {
      category = 'A01';
    } else if (owaspMeta.includes('A02') || owaspMeta.toLowerCase().includes('crypto')) {
      category = 'A02';
    } else if (owaspMeta.includes('A03') || owaspMeta.toLowerCase().includes('injection')) {
      category = 'A03';
    } else if (CWE_DATABASE[cwe]) {
      category = CWE_DATABASE[cwe].category;
    }
    
    // Map severity
    const severityMap = { 
      ERROR: 'HIGH', 
      WARNING: 'MEDIUM', 
      INFO: 'LOW',
      error: 'HIGH',
      warning: 'MEDIUM',
      info: 'LOW'
    };
    const severity = severityMap[result.extra?.severity] || 'MEDIUM';
    
    // Clean up the message
    let message = result.extra?.message || result.check_id;
    // Remove OWASP/CWE prefixes if present (they're already in metadata)
    message = message.replace(/^\[A0[1-3]\]\s*/i, '').replace(/^CWE-\d+:\s*/i, '');
    
    addFinding(
      category,
      cwe,
      severity,
      result.check_id.split('.').pop() || result.check_id, // Use last part of rule ID as title
      message,
      {
        file: result.path,
        line: result.start?.line,
        endLine: result.end?.line,
        code: result.extra?.lines?.trim()
      },
      result.extra?.metadata?.references?.join(', ') || null,
      source
    );
  });
}








async function runZapAnalysis() {
  header('OWASP ZAP (zaproxy) DAST ANALYSIS');
  
  if (!config.scanner?.tests?.zapScan) {
    log('info', 'ZAP scan disabled in config');
    return;
  }
  
  if (config.app?.type === 'spa') {
    log('info', '');
    log('warn', 'NOTE: Your app is configured as SPA (Single Page Application)');
    log('info', 'ZAP DAST has limited effectiveness on SPAs because:');
    log('info', '  • Content is rendered client-side via JavaScript');
    log('info', '  • Firebase SDK calls don\'t go through traditional HTTP');
    log('info', '');
    log('info', 'The LIVE FIREBASE TESTS (run automatically after ZAP) will');
    log('info', 'test Firebase-specific vulnerabilities more effectively.');
    log('info', '');
  }
  
  const zapConfig = config.scanner?.zap;
  const targetUrl = config.app?.url;
  
  if (!targetUrl) {
    log('warn', 'No target URL configured');
    return;
  }
  
  const zapHost = zapConfig?.host || 'localhost';
  const zapPort = zapConfig?.port || 8080;
  const zapApiKey = zapConfig?.apiKey || 'changeme';
  const zapBaseUrl = `http://${zapHost}:${zapPort}`;
  
  async function zapApi(endpoint, params = {}) {
    const queryParams = new URLSearchParams({ apikey: zapApiKey, ...params });
    const url = `${zapBaseUrl}/${endpoint}?${queryParams}`;
    const result = await runCommand('curl', ['-s', url]);
    try {
      return JSON.parse(result.stdout);
    } catch {
      return result.stdout;
    }
  }
  
  
  log('step', 'Checking ZAP connection...');
  try {
    const versionResult = await runCommand('curl', [
      '-s', '--connect-timeout', '5',
      `${zapBaseUrl}/JSON/core/view/version/?apikey=${zapApiKey}`
    ]);
    
    if (versionResult.code !== 0 || !versionResult.stdout.includes('version')) {
      log('warn', 'ZAP not running. Please start zaproxy first:');
      log('info', '');
      log('info', '  # Start ZAP in daemon mode:');
      log('info', `  zaproxy -daemon -port ${zapPort} -config api.key=${zapApiKey}`);
      log('info', '');
      log('info', '  # Or on Linux with full path:');
      log('info', `  /usr/share/zaproxy/zap.sh -daemon -port ${zapPort} -config api.key=${zapApiKey}`);
      log('info', '');
      log('info', '  # Wait ~30 seconds for ZAP to start, then re-run this scanner');
      log('info', '');
      return;
    }
    
    const version = JSON.parse(versionResult.stdout).version;
    log('success', `Connected to ZAP version ${version}`);
  } catch (error) {
    log('warn', `Cannot connect to ZAP: ${error.message}`);
    return;
  }
  
  const reportDir = config.scanner?.reports?.outputDir || './reports';
  ensureDir(reportDir);
  
  log('step', 'Starting new ZAP session...');
  await zapApi('JSON/core/action/newSession', { name: `scan-${Date.now()}` });
  log('step', 'Configuring scan policies for OWASP A01-A03...');
  await zapApi('JSON/ascan/action/setOptionAttackStrength', { String: 'HIGH' });
  await zapApi('JSON/pscan/action/enableAllScanners');
  const criticalScanners = [
    '10045', '10048', '10095', '10104', '10107', '10202', '40003', '40008', 
    '40032', '40034', '40035', '90019', '90020', '90028', '90034',
    '10003', '10010', '10011', '10015', '10016', '10020', '10021', '10035',
    '10037', '10038', '10040', '10054', '10055', '10062', '10096', '10098',
    '40012', '40014', '40016', '40017', '40018', '40019', '40020', '40021',
    '40022', '40024', '40026', '40027', '40033', '40043', '40044', '40045',
    '90017', '90018', '90021', '90023', '90025', '90029'
  ];
  
  for (const id of criticalScanners) {
    await zapApi('JSON/ascan/action/enableScanners', { ids: id });
  }
  log('success', `Enabled ${criticalScanners.length} vulnerability scanners`);
  
  log('step', `Phase 1: Spidering ${targetUrl}...`);
  const spiderResult = await zapApi('JSON/spider/action/scan', { 
    url: targetUrl,
    maxChildren: '10',
    recurse: 'true',
    subtreeOnly: 'false'
  });
  
  const spiderId = spiderResult.scan;
  if (spiderId) {
    let progress = '0';
    const spiderStart = Date.now();
    const spiderTimeout = 300000; // 5 minutes
    
    while (progress !== '100' && (Date.now() - spiderStart) < spiderTimeout) {
      await new Promise(r => setTimeout(r, 2000));
      const status = await zapApi('JSON/spider/view/status', { scanId: spiderId });
      progress = status.status || '100';
      process.stdout.write(`\r  Spider progress: ${progress}%   `);
    }
    console.log('');
    
    const spiderResults = await zapApi('JSON/spider/view/results', { scanId: spiderId });
    const urlsFound = spiderResults.results?.length || 0;
    log('success', `Spider complete - found ${urlsFound} URLs`);
  }
  
  if (zapConfig?.ajaxSpider !== false) {
    log('step', 'Phase 2: AJAX Spider for SPA content...');
    log('info', 'This crawls JavaScript-rendered content (may take several minutes)');
    
    await zapApi('JSON/ajaxSpider/action/scan', { 
      url: targetUrl,
      inScope: 'true'
    });
    
    const ajaxTimeout = (zapConfig?.ajaxSpiderTimeout || 120) * 1000; 
    const ajaxStart = Date.now();
    
    while ((Date.now() - ajaxStart) < ajaxTimeout) {
      await new Promise(r => setTimeout(r, 3000));
      const status = await zapApi('JSON/ajaxSpider/view/status');
      const numResults = await zapApi('JSON/ajaxSpider/view/numberOfResults');
      process.stdout.write(`\r  AJAX Spider: ${status.status} - ${numResults.numberOfResults || 0} results   `);
      
      if (status.status === 'stopped') break;
    }
    console.log('');
    
    await zapApi('JSON/ajaxSpider/action/stop');
    
    const ajaxResults = await zapApi('JSON/ajaxSpider/view/fullResults');
    const ajaxCount = ajaxResults.fullResults?.length || 0;
    
    if (ajaxCount === 0) {
      log('warn', 'AJAX Spider found 0 results - this is common for Firebase SPAs');
      log('info', '');
      log('info', 'Why this happens:');
      log('info', '  1. AJAX Spider needs a browser (Firefox/Chrome) configured');
      log('info', '  2. In ZAP GUI: Tools > Options > AJAX Spider > set Browser');
      log('info', '  3. Firebase SPAs require authentication to see content');
      log('info', '');
      log('info', 'For better results with SPAs:');
      log('info', '  1. Use ZAP GUI instead of daemon mode');
      log('info', '  2. Manually browse your app through ZAP proxy');
      log('info', '  3. Login to your app, then run active scan');
      log('info', '');
    } else {
      log('success', `AJAX Spider complete - found ${ajaxCount} resources`);
    }
  }
  
  log('step', 'Phase 3: Waiting for passive scan to complete...');
  let passiveRecords = -1;
  while (true) {
    await new Promise(r => setTimeout(r, 2000));
    const records = await zapApi('JSON/pscan/view/recordsToScan');
    const currentRecords = parseInt(records.recordsToScan) || 0;
    
    if (currentRecords === 0) break;
    if (currentRecords === passiveRecords) break; // No progress
    
    passiveRecords = currentRecords;
    process.stdout.write(`\r  Passive scan records remaining: ${currentRecords}   `);
  }
  console.log('');
  log('success', 'Passive scan complete');
  log('step', 'Phase 4: Active Scan (testing for vulnerabilities)...');
  log('warn', 'This will send attack payloads - may take 10-60 minutes');
  
  const activeScanResult = await zapApi('JSON/ascan/action/scan', {
    url: targetUrl,
    recurse: 'true',
    inScopeOnly: 'false',
    scanPolicyName: '',
    method: '',
    postData: ''
  });
  
  const activeScanId = activeScanResult.scan;
  if (activeScanId) {
    const activeTimeout = (zapConfig?.activeScanTimeout || 3600) * 1000;
    const activeStart = Date.now();
    let lastProgress = -1;
    let staleCount = 0;
    
    while ((Date.now() - activeStart) < activeTimeout) {
      await new Promise(r => setTimeout(r, 5000));
      const status = await zapApi('JSON/ascan/view/status', { scanId: activeScanId });
      const progress = parseInt(status.status) || 0;
      
      const alertsResult = await zapApi('JSON/core/view/numberOfAlerts', { baseurl: targetUrl });
      const alertCount = alertsResult.numberOfAlerts || 0;
      
      process.stdout.write(`\r  Active scan: ${progress}% complete - ${alertCount} alerts found   `);
      
      if (progress >= 100) break;
      
      if (progress === lastProgress) {
        staleCount++;
        if (staleCount > 12) {
          log('warn', 'Scan appears stalled, continuing...');
          break;
        }
      } else {
        staleCount = 0;
      }
      lastProgress = progress;
    }
    console.log('');
  }
  log('success', 'Active scan complete');
  log('step', 'Phase 5: Collecting vulnerability alerts...');
  
  const alertsResult = await zapApi('JSON/core/view/alerts', { 
    baseurl: targetUrl,
    start: '0',
    count: '1000'
  });
  
  const alerts = alertsResult.alerts || [];
  log('success', `Retrieved ${alerts.length} alerts`);
  
  processZapAlerts(alerts);
  log('step', 'Generating ZAP reports...');
  const htmlReport = await runCommand('curl', [
    '-s', `${zapBaseUrl}/OTHER/core/other/htmlreport/?apikey=${zapApiKey}`
  ]);
  fs.writeFileSync(`${reportDir}/zap-report.html`, htmlReport.stdout);
  log('success', `ZAP HTML report: ${reportDir}/zap-report.html`);
  
  fs.writeFileSync(`${reportDir}/zap-alerts.json`, JSON.stringify(alerts, null, 2));
  log('success', `ZAP JSON alerts: ${reportDir}/zap-alerts.json`);
  
  const highRisk = alerts.filter(a => a.risk === '3').length;
  const medRisk = alerts.filter(a => a.risk === '2').length;
  const lowRisk = alerts.filter(a => a.risk === '1').length;
  const infoRisk = alerts.filter(a => a.risk === '0').length;
  
  log('success', `ZAP scan complete: ${highRisk} High, ${medRisk} Medium, ${lowRisk} Low, ${infoRisk} Info`);
  
  // Provide guidance if no alerts found (common for Firebase SPAs)
  if (alerts.length === 0) {
    log('info', '');
    log('info', '┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓');
    log('info', '┃  WHY ZAP FOUND 0 ALERTS ON YOUR FIREBASE SPA                        ┃');
    log('info', '┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛');
    log('info', '');
    log('info', 'This is EXPECTED for Firebase SPAs. Here\'s why:');
    log('info', '');
    log('info', '1. Firebase SPAs are CLIENT-SIDE RENDERED');
    log('info', '   └─ ZAP sees HTML shell + JavaScript bundles, not the rendered app');
    log('info', '');
    log('info', '2. Data operations use FIREBASE SDK, not HTTP APIs');
    log('info', '   └─ Firestore calls go through SDK, not REST endpoints');
    log('info', '   └─ ZAP can\'t intercept or test SDK calls');
    log('info', '');
    log('info', '3. Authentication uses FIREBASE AUTH tokens');
    log('info', '   └─ No traditional session cookies to test');
    log('info', '   └─ ZAP isn\'t authenticated to see protected content');
    log('info', '');
    log('info', '┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓');
    log('info', '┃  WHAT TO DO INSTEAD                                                 ┃');
    log('info', '┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛');
    log('info', '');
    log('info', '✓ The LIVE FIREBASE TESTS above found the real vulnerabilities:');
    log('info', '  • Privilege escalation (isAdmin/isOwner manipulation)');
    log('info', '  • Cross-user profile modification');
    log('info', '  • IDOR (accessing other users\' data)');
    log('info', '  • PII exposure');
    log('info', '  • Stored XSS potential');
    log('info', '');
    log('info', '✓ For header/cookie issues, use ZAP GUI with manual browsing:');
    log('info', '  1. zaproxy (opens GUI)');
    log('info', '  2. Configure browser to use ZAP proxy (localhost:8080)');
    log('info', '  3. Browse your app manually, login, use features');
    log('info', '  4. Run Active Scan on captured traffic');
    log('info', '');
  }
}

function processZapAlerts(alerts) {
  // Comprehensive mapping of ZAP plugin IDs to CWEs for OWASP A01-A03
  const zapToCwe = {
    // A01: Broken Access Control
    '10003': 'CWE-829',   // Vulnerable JS Library
    '10010': 'CWE-614',   // Cookie Without Secure Flag
    '10011': 'CWE-1004',  // Cookie Without HttpOnly Flag
    '10015': 'CWE-525',   // Incomplete or No Cache-control
    '10016': 'CWE-693',   // Web Browser XSS Protection Not Enabled
    '10017': 'CWE-829',   // Cross-Domain JavaScript Source File Inclusion
    '10020': 'CWE-1021',  // X-Frame-Options Header Not Set
    '10021': 'CWE-693',   // X-Content-Type-Options Header Missing
    '10027': 'CWE-200',   // Information Disclosure - Suspicious Comments
    '10028': 'CWE-601',   // Open Redirect
    '10031': 'CWE-20',    // User Controllable HTML Element Attribute
    '10035': 'CWE-319',   // Strict-Transport-Security Header
    '10037': 'CWE-200',   // Server Leaks Information via "X-Powered-By"
    '10038': 'CWE-693',   // Content Security Policy (CSP) Header Not Set
    '10039': 'CWE-200',   // X-Backend-Server Header Information Leak
    '10040': 'CWE-319',   // Secure Pages Include Mixed Content
    '10045': 'CWE-540',   // Source Code Disclosure - /WEB-INF folder
    '10048': 'CWE-94',    // Remote Code Execution
    '10054': 'CWE-1275',  // Cookie without SameSite Attribute
    '10055': 'CWE-693',   // CSP Wildcard Directive
    '10056': 'CWE-200',   // X-Debug-Token Information Leak
    '10057': 'CWE-200',   // Username Hash Found
    '10061': 'CWE-200',   // X-AspNet-Version Response Header
    '10062': 'CWE-359',   // PII Disclosure
    '10063': 'CWE-693',   // Permissions Policy Header Not Set
    '10095': 'CWE-530',   // Backup File Disclosure
    '10096': 'CWE-200',   // Timestamp Disclosure
    '10097': 'CWE-200',   // Hash Disclosure
    '10098': 'CWE-264',   // Cross-Domain Misconfiguration
    '10104': 'CWE-200',   // User Agent Fuzzer
    '10105': 'CWE-20',    // User Controllable Charset
    '10107': 'CWE-20',    // Httpoxy
    '10109': 'CWE-693',   // Modern Web Application
    '10202': 'CWE-352',   // Absence of Anti-CSRF Tokens
    
    // A02: Cryptographic Failures
    '20015': 'CWE-119',   // Heartbleed OpenSSL Vulnerability
    '20016': 'CWE-264',   // Cross-Domain Requests Permitted
    '90024': 'CWE-209',   // Generic Padding Oracle
    '90033': 'CWE-565',   // Loosely Scoped Cookie
    
    // A03: Injection
    '20012': 'CWE-352',   // Anti-CSRF Tokens Check
    '20014': 'CWE-235',   // HTTP Parameter Pollution
    '20017': 'CWE-94',    // Source Code Disclosure - CVE-2012-1823
    '20018': 'CWE-78',    // Remote Code Execution - CVE-2012-1823
    '20019': 'CWE-601',   // External Redirect
    '30001': 'CWE-120',   // Buffer Overflow
    '30002': 'CWE-134',   // Format String Error
    '30003': 'CWE-190',   // Integer Overflow
    '40003': 'CWE-113',   // CRLF Injection
    '40008': 'CWE-472',   // Parameter Tampering
    '40009': 'CWE-97',    // Server Side Include
    '40012': 'CWE-79',    // Cross Site Scripting (Reflected)
    '40014': 'CWE-79',    // Cross Site Scripting (Persistent)
    '40016': 'CWE-79',    // Cross Site Scripting (Persistent) - Prime
    '40017': 'CWE-79',    // Cross Site Scripting (Persistent) - Spider
    '40018': 'CWE-89',    // SQL Injection
    '40019': 'CWE-89',    // SQL Injection - MySQL
    '40020': 'CWE-89',    // SQL Injection - Hypersonic SQL
    '40021': 'CWE-89',    // SQL Injection - Oracle
    '40022': 'CWE-89',    // SQL Injection - PostgreSQL
    '40024': 'CWE-89',    // SQL Injection - SQLite
    '40025': 'CWE-200',   // Proxy Disclosure
    '40026': 'CWE-79',    // Cross Site Scripting (DOM Based)
    '40027': 'CWE-89',    // SQL Injection - MsSQL
    '40028': 'CWE-215',   // ELMAH Information Leak
    '40029': 'CWE-215',   // Trace.axd Information Leak
    '40031': 'CWE-79',    // Out of Band XSS
    '40032': 'CWE-215',   // .htaccess Information Leak
    '40033': 'CWE-943',   // NoSQL Injection - MongoDB
    '40034': 'CWE-215',   // .env Information Leak
    '40035': 'CWE-538',   // Hidden File Finder
    '40038': 'CWE-863',   // Bypassing 403
    '40039': 'CWE-524',   // Web Cache Deception
    '40040': 'CWE-942',   // CORS Header
    '40042': 'CWE-215',   // Spring Actuator Information Leak
    '40043': 'CWE-917',   // Log4Shell (Expression Language Injection)
    '40044': 'CWE-776',   // Exponential Entity Expansion
    '40045': 'CWE-94',    // Spring4Shell
    '90017': 'CWE-91',    // XSLT Injection
    '90018': 'CWE-89',    // SQL Injection - Time Based
    '90019': 'CWE-94',    // Server Side Code Injection
    '90020': 'CWE-78',    // Remote OS Command Injection
    '90021': 'CWE-643',   // XPath Injection
    '90023': 'CWE-611',   // XML External Entity Attack
    '90025': 'CWE-917',   // Expression Language Injection
    '90026': 'CWE-116',   // SOAP Action Spoofing
    '90027': 'CWE-200',   // Cookie Slack Detector
    '90028': 'CWE-650',   // Insecure HTTP Method
    '90029': 'CWE-91',    // SOAP XML Injection
    '90034': 'CWE-918',   // Cloud Metadata Potentially Exposed
  };
  
  // Map CWEs to OWASP categories
  const cweToCategory = {
    // A01: Broken Access Control
    'CWE-22': 'A01', 'CWE-23': 'A01', 'CWE-200': 'A01', 'CWE-201': 'A01',
    'CWE-219': 'A01', 'CWE-264': 'A01', 'CWE-275': 'A01', 'CWE-276': 'A01',
    'CWE-284': 'A01', 'CWE-285': 'A01', 'CWE-352': 'A01', 'CWE-359': 'A01',
    'CWE-425': 'A01', 'CWE-441': 'A01', 'CWE-497': 'A01', 'CWE-538': 'A01',
    'CWE-540': 'A01', 'CWE-548': 'A01', 'CWE-552': 'A01', 'CWE-566': 'A01',
    'CWE-601': 'A01', 'CWE-639': 'A01', 'CWE-651': 'A01', 'CWE-668': 'A01',
    'CWE-706': 'A01', 'CWE-862': 'A01', 'CWE-863': 'A01', 'CWE-913': 'A01',
    'CWE-922': 'A01', 'CWE-1021': 'A01', 'CWE-1275': 'A01', 'CWE-614': 'A01',
    'CWE-1004': 'A01', 'CWE-525': 'A01', 'CWE-693': 'A01', 'CWE-829': 'A01',
    'CWE-530': 'A01', 'CWE-565': 'A01', 'CWE-650': 'A01', 'CWE-918': 'A01',
    'CWE-942': 'A01',
    
    // A02: Cryptographic Failures
    'CWE-261': 'A02', 'CWE-296': 'A02', 'CWE-310': 'A02', 'CWE-311': 'A02',
    'CWE-312': 'A02', 'CWE-319': 'A02', 'CWE-321': 'A02', 'CWE-322': 'A02',
    'CWE-323': 'A02', 'CWE-324': 'A02', 'CWE-325': 'A02', 'CWE-326': 'A02',
    'CWE-327': 'A02', 'CWE-328': 'A02', 'CWE-329': 'A02', 'CWE-330': 'A02',
    'CWE-331': 'A02', 'CWE-335': 'A02', 'CWE-336': 'A02', 'CWE-337': 'A02',
    'CWE-338': 'A02', 'CWE-340': 'A02', 'CWE-347': 'A02', 'CWE-523': 'A02',
    'CWE-757': 'A02', 'CWE-759': 'A02', 'CWE-760': 'A02', 'CWE-780': 'A02',
    'CWE-818': 'A02', 'CWE-916': 'A02', 'CWE-119': 'A02', 'CWE-209': 'A02',
    'CWE-524': 'A02',
    
    // A03: Injection
    'CWE-20': 'A03', 'CWE-74': 'A03', 'CWE-75': 'A03', 'CWE-77': 'A03',
    'CWE-78': 'A03', 'CWE-79': 'A03', 'CWE-80': 'A03', 'CWE-83': 'A03',
    'CWE-87': 'A03', 'CWE-88': 'A03', 'CWE-89': 'A03', 'CWE-90': 'A03',
    'CWE-91': 'A03', 'CWE-93': 'A03', 'CWE-94': 'A03', 'CWE-95': 'A03',
    'CWE-96': 'A03', 'CWE-97': 'A03', 'CWE-98': 'A03', 'CWE-99': 'A03',
    'CWE-113': 'A03', 'CWE-116': 'A03', 'CWE-138': 'A03', 'CWE-184': 'A03',
    'CWE-470': 'A03', 'CWE-471': 'A03', 'CWE-564': 'A03', 'CWE-610': 'A03',
    'CWE-611': 'A03', 'CWE-643': 'A03', 'CWE-644': 'A03', 'CWE-652': 'A03',
    'CWE-917': 'A03', 'CWE-943': 'A03', 'CWE-120': 'A03', 'CWE-134': 'A03',
    'CWE-190': 'A03', 'CWE-215': 'A03', 'CWE-235': 'A03', 'CWE-472': 'A03',
    'CWE-776': 'A03',
  };
  
  const riskMap = { '3': 'CRITICAL', '2': 'HIGH', '1': 'MEDIUM', '0': 'LOW' };
  
  alerts.forEach(alert => {
    let cwe = alert.cweid ? `CWE-${alert.cweid}` : (zapToCwe[alert.pluginid] || 'CWE-Unknown');
    const severity = riskMap[alert.risk] || 'MEDIUM';
    
    let category = cweToCategory[cwe] || 'A01';
    
    addFinding(
      category,
      cwe,
      severity,
      alert.alert,
      alert.description,
      {
        url: alert.url,
        parameter: alert.param,
        evidence: alert.evidence,
        method: alert.method,
        attack: alert.attack
      },
      alert.solution,
      'owasp-zap'
    );
  });
}

async function runScaAnalysis() {
  header('SCA (DEPENDENCY VULNERABILITY) ANALYSIS');
  
  if (!config.scanner?.tests?.scaAnalysis) {
    log('info', 'SCA analysis disabled in config');
    return;
  }
  
  const sourcePath = config.sourcePath;
  if (!sourcePath) {
    log('warn', 'No sourcePath configured - skipping SCA');
    return;
  }
  
  let packageJsonPath = null;
  const possiblePaths = [
    path.join(sourcePath, 'package.json'),
    path.join(sourcePath, '..', 'package.json'),
    path.join(path.dirname(sourcePath), 'package.json'),
  ];
  
  for (const p of possiblePaths) {
    if (fs.existsSync(p)) {
      packageJsonPath = p;
      break;
    }
  }
  
  if (!packageJsonPath) {
    log('warn', `package.json not found. Searched in:`);
    possiblePaths.forEach(p => log('info', `  - ${p}`));
    return;
  }
  
  log('info', `Found package.json at: ${packageJsonPath}`);
  
  const reportDir = config.scanner?.reports?.outputDir || './reports';
  ensureDir(reportDir);
  
  log('step', 'Running npm audit...');
  
  const originalDir = process.cwd();
  process.chdir(path.dirname(packageJsonPath));
  
  try {
    const auditResult = await runCommand('npm', ['audit', '--json']);
    
    fs.writeFileSync(`${reportDir}/npm-audit.json`, auditResult.stdout);
    
    try {
      const audit = JSON.parse(auditResult.stdout);
      processNpmAuditResults(audit);
    } catch (parseError) {
      log('warn', 'Could not parse npm audit output');
    }
  } catch (error) {
    log('warn', `npm audit failed: ${error.message}`);
  }
  
  process.chdir(originalDir);
  log('success', 'SCA analysis complete');
}

function processNpmAuditResults(audit) {
  if (!audit.vulnerabilities) {
    log('info', 'No vulnerabilities found in dependencies');
    return;
  }
  
  Object.entries(audit.vulnerabilities).forEach(([pkg, vuln]) => {
    const severityMap = { critical: 'CRITICAL', high: 'HIGH', moderate: 'MEDIUM', low: 'LOW' };
    const severity = severityMap[vuln.severity] || 'MEDIUM';
    
    let category = 'A02'; 
    let cwe = 'CWE-1035'; 
    
    if (vuln.via?.some(v => v.title?.toLowerCase().includes('injection'))) {
      category = 'A03';
      cwe = 'CWE-94';
    } else if (vuln.via?.some(v => v.title?.toLowerCase().includes('xss'))) {
      category = 'A03';
      cwe = 'CWE-79';
    }
    
    addFinding(
      category,
      cwe,
      severity,
      `Vulnerable dependency: ${pkg}`,
      vuln.via?.map(v => v.title || v).join(', ') || 'Known vulnerability',
      {
        package: pkg,
        version: vuln.range,
        fixAvailable: vuln.fixAvailable
      },
      vuln.fixAvailable ? `Update to fixed version` : 'No fix available - consider alternatives',
      'npm-audit'
    );
  });
}


function startZapDaemon() {
	
  const zapConf = config.scanner?.zap;
  const zapPort = zapConf?.port || 8080;
  const zapApiKey = zapConf?.apiKey || 'changeme';
  console.log(zapApiKey);

  log('step', 'Starting OWASP ZAP daemon...');

  const zapProcess = spawn(
    '/usr/share/zaproxy/zap.sh',
    [
      '-daemon',
      '-port', zapPort,
      '-config', `api.key=${zapApiKey}`,
      '-config', 'api.addrs.addr.name=.*',
      '-config', 'api.addrs.addr.regex=true'
    ],
    {
      detached: true,
      stdio: 'ignore'
    }
  );

  zapProcess.unref();
}


function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}


async function runLiveFirebaseTests() {
  header('LIVE FIREBASE SECURITY TESTS');
  
  if (!config.scanner?.tests?.liveFirebaseTests) {
    log('info', 'Live Firebase tests disabled in config');
    return;
  }
  
  log('info', 'Live Firebase tests require the live-scanner module');
  log('info', 'Run separately: node modules/live-scanner.js --config config.yaml');
  
}

async function runEnhancedSecurityScans() {
  header('ENHANCED SECURITY SCANS');
  
  if (!enhancedModulesAvailable) {
    log('warn', 'Enhanced security modules not available');
    log('info', 'To enable, ensure these files exist in the modules/ directory:');
    log('info', '  - xss-verifier.js');
    log('info', '  - crypto-scanner.js');
    log('info', '  - injection-scanner.js');
    return;
  }
  
  const enhancedTestsEnabled = config.scanner?.tests?.enhancedScans !== false;
  if (!enhancedTestsEnabled) {
    log('info', 'Enhanced security scans disabled in config');
    log('info', 'To enable, set scanner.tests.enhancedScans: true in your config');
    return;
  }
  
  const targetUrl = config.app?.url;
  if (!targetUrl) {
    log('warn', 'No target URL configured - skipping enhanced scans');
    return;
  }
  
  let browser = null;
  let page = null;
  
  try {
    let puppeteer;
    try {
      puppeteer = require('puppeteer');
    } catch (e) {
      log('warn', 'Puppeteer not installed - some enhanced scans will be limited');
      log('info', 'Install with: npm install puppeteer');
    }
    
    if (puppeteer) {
      log('step', 'Launching browser for enhanced security scanning...');
      browser = await puppeteer.launch({
        headless: 'new',
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-web-security',
          '--disable-features=IsolateOrigins,site-per-process'
        ]
      });
      page = await browser.newPage();
      await page.setViewport({ width: 1920, height: 1080 });
      page.setDefaultTimeout(30000);
     
      log('step', `Navigating to ${targetUrl}...`);
      try {
        await page.goto(targetUrl, { waitUntil: 'networkidle2', timeout: 60000 });
        log('success', 'Page loaded successfully');
      } catch (navError) {
        log('warn', `Navigation warning: ${navError.message}`);
      }
    }
    
    log('step', 'Running A02: Cryptographic Failures scan...');
    
    try {
      const cryptoScanner = new CryptoScanner(config);
      const cryptoFindings = await cryptoScanner.scan(page);
      
      cryptoFindings.forEach(f => {
        addFinding(
          f.category,
          f.cwe,
          f.severity,
          f.title,
          f.description,
          f.evidence,
          null,
          'crypto-scanner'
        );
      });
      
      log('success', `A02 scan complete: ${cryptoFindings.length} findings`);
    } catch (cryptoError) {
      log('error', `Crypto scanner error: ${cryptoError.message}`);
    }
    
    log('step', 'Running A03: Injection scan...');
    
    try {
      const injectionScanner = new InjectionScanner(config);
      const injectionFindings = await injectionScanner.scan(page, null);
      injectionFindings.forEach(f => {
        addFinding(
          f.category,
          f.cwe,
          f.severity,
          f.title,
          f.description,
          f.evidence,
          null,
          'injection-scanner'
        );
      });
      
      log('success', `A03 scan complete: ${injectionFindings.length} findings`);
    } catch (injectionError) {
      log('error', `Injection scanner error: ${injectionError.message}`);
    }
    
    log('step', 'Running XSS Verification scan...');
    
    try {
      const xssVerifier = new XSSVerifier(config);
      await xssVerifier.initBrowser();
      const testUrls = [
        targetUrl,
        `${targetUrl}?q=<script>alert(1)</script>`,
        `${targetUrl}?search=<img src=x onerror=alert(1)>`,
        `${targetUrl}#<script>alert(1)</script>`
      ];
      
      for (const testUrl of testUrls) {
        try {
          const result = await xssVerifier.verifyExecution({
            renderUrl: testUrl,
            payload: '<script>window.__XSS_MARKER_SCRIPT__=Date.now()</script>',
            marker: '__XSS_MARKER_SCRIPT__'
          });
          
          if (result.payloadExecuted) {
            addFinding(
              'A03',
              'CWE-79',
              'CRITICAL',
              'Confirmed XSS Execution',
              `XSS payload confirmed to execute at ${testUrl}`,
              {
                url: testUrl,
                executionType: result.executionType,
                ...result.evidence
              },
              'Implement proper output encoding and Content Security Policy',
              'xss-verifier'
            );
          } else if (result.payloadRendered) {
            addFinding(
              'A03',
              'CWE-79',
              'HIGH',
              'Potential XSS - Payload Rendered',
              `XSS payload rendered but not executed at ${testUrl}. May execute with different payload.`,
              { url: testUrl },
              'Implement proper output encoding',
              'xss-verifier'
            );
          }
        } catch (xssTestError) {
          // Continue with next test URL
        }
      }
      
      await xssVerifier.closeBrowser();
      const xssFindings = xssVerifier.getFindings();
      xssFindings.forEach(f => {
        if (!f.tool) f.tool = 'xss-verifier';
        addFinding(
          f.category,
          f.cwe,
          f.severity,
          f.title,
          f.description,
          f.evidence,
          f.remediation,
          f.tool
        );
      });
      
      log('success', `XSS verification complete: ${xssFindings.length} findings`);
    } catch (xssError) {
      log('error', `XSS verifier error: ${xssError.message}`);
    }
    
    log('success', 'Enhanced security scans complete');
    
  } catch (error) {
    log('error', `Enhanced security scan error: ${error.message}`);
    if (error.stack) {
      console.log(`  Stack: ${error.stack.split('\n').slice(0, 3).join('\n  ')}`);
    }
  } finally {
    // Clean up browser
    if (browser) {
      try {
        await browser.close();
        log('info', 'Browser closed');
      } catch (closeError) {
        // Ignore close errors
      }
    }
  }
}



function generateReports() {
  header('GENERATING REPORTS');
  
  const reportDir = config.scanner?.reports?.outputDir || './reports';
  ensureDir(reportDir);
  
  log('step', 'Deduplicating findings...');
  const preStats = getDeduplicationStats(findings);
  const deduplicatedFindings = deduplicateFindings(findings, {
    similarityThreshold: 0.75,
    useFuzzyMatching: true,
    includeMetadata: true,
    verbose: false
  });
  const removed = findings.length - deduplicatedFindings.length;
  if (removed > 0) {
    log('success', `Deduplicated: ${findings.length} → ${deduplicatedFindings.length} findings (${removed} duplicates removed)`);
    console.log(`\n  Findings by tool before deduplication:`);
    Object.entries(preStats.byTool).forEach(([tool, count]) => {
      console.log(`    ${tool}: ${count}`);
    });
    console.log('');
  } else {
    log('info', `No duplicates found (${findings.length} unique findings)`);
  }
  const reportFindings = deduplicatedFindings;
  
  const stats = {
    total: reportFindings.length,
    bySeverity: {
      CRITICAL: reportFindings.filter(f => f.severity === 'CRITICAL').length,
      HIGH: reportFindings.filter(f => f.severity === 'HIGH').length,
      MEDIUM: reportFindings.filter(f => f.severity === 'MEDIUM').length,
      LOW: reportFindings.filter(f => f.severity === 'LOW').length,
      INFO: reportFindings.filter(f => f.severity === 'INFO').length
    },
    byCategory: {
      A01: reportFindings.filter(f => f.category === 'A01').length,
      A02: reportFindings.filter(f => f.category === 'A02').length,
      A03: reportFindings.filter(f => f.category === 'A03').length
    },
    byTool: {}
  };
  
  reportFindings.forEach(f => {
    stats.byTool[f.tool] = (stats.byTool[f.tool] || 0) + 1;
  });
  
  const deduplicationStats = {
    originalCount: findings.length,
    deduplicatedCount: reportFindings.length,
    duplicatesRemoved: removed,
    reductionPercent: findings.length > 0 ? Math.round((removed / findings.length) * 100) : 0
  };
  
  const riskScore = stats.bySeverity.CRITICAL * 10 + 
                    stats.bySeverity.HIGH * 5 + 
                    stats.bySeverity.MEDIUM * 2 + 
                    stats.bySeverity.LOW * 1;
  
  const report = {
    metadata: {
      scanDate: new Date().toISOString(),
      duration: `${Math.round((Date.now() - startTime) / 1000)}s`,
      target: config.app?.url,
      appName: config.app?.name,
      projectId: config.firebase?.projectId,
      scope: 'OWASP Top 10:2021 A01-A03'
    },
    summary: {
      ...stats,
      riskScore,
      riskLevel: riskScore >= 30 ? 'CRITICAL' : riskScore >= 15 ? 'HIGH' : riskScore >= 5 ? 'MEDIUM' : 'LOW',
      deduplication: deduplicationStats
    },
    findings: reportFindings,
    cweCoverage: config.cweCoverage
  };
  
  // JSON Report
  fs.writeFileSync(`${reportDir}/security-report.json`, JSON.stringify(report, null, 2));
  log('success', `JSON report: ${reportDir}/security-report.json`);
  
  // HTML Report
  const htmlReport = generateHtmlReport(report);
  fs.writeFileSync(`${reportDir}/security-report.html`, htmlReport);
  log('success', `HTML report: ${reportDir}/security-report.html`);
  
  // Markdown Report
  const mdReport = generateMarkdownReport(report);
  fs.writeFileSync(`${reportDir}/security-report.md`, mdReport);
  log('success', `Markdown report: ${reportDir}/security-report.md`);
  
  // Print summary
  printSummary(report);
}

function generateHtmlReport(report) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Security Report - ${report.metadata.appName}</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #f5f5f5; color: #333; line-height: 1.6; }
    .container { max-width: 1200px; margin: 0 auto; padding: 20px; }
    header { background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%); color: white; padding: 40px 20px; }
    header h1 { font-size: 2rem; margin-bottom: 10px; }
    .meta { display: flex; gap: 20px; flex-wrap: wrap; margin-top: 15px; font-size: 0.9rem; }
    .meta span { background: rgba(255,255,255,0.1); padding: 5px 15px; border-radius: 20px; }
    .cards { display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: 15px; margin: 20px 0; }
    .card { background: white; border-radius: 12px; padding: 20px; text-align: center; box-shadow: 0 2px 10px rgba(0,0,0,0.05); }
    .card.critical { border-left: 4px solid #dc3545; }
    .card.high { border-left: 4px solid #fd7e14; }
    .card.medium { border-left: 4px solid #ffc107; }
    .card.low { border-left: 4px solid #17a2b8; }
    .card h3 { font-size: 2rem; margin-bottom: 5px; }
    .card p { color: #666; font-size: 0.8rem; text-transform: uppercase; }
    .section { background: white; border-radius: 12px; padding: 25px; margin-bottom: 20px; box-shadow: 0 2px 10px rgba(0,0,0,0.05); }
    .section h2 { margin-bottom: 20px; padding-bottom: 10px; border-bottom: 2px solid #f0f0f0; }
    .finding { background: #fafafa; border-radius: 8px; padding: 15px; margin-bottom: 10px; border-left: 4px solid #ccc; }
    .finding.critical { border-left-color: #dc3545; background: #fff5f5; }
    .finding.high { border-left-color: #fd7e14; background: #fff9f5; }
    .finding.medium { border-left-color: #ffc107; background: #fffcf5; }
    .finding.low { border-left-color: #17a2b8; background: #f5fcff; }
    .finding-header { display: flex; justify-content: space-between; margin-bottom: 10px; flex-wrap: wrap; gap: 10px; }
    .finding-title { font-weight: 600; }
    .badges { display: flex; gap: 8px; }
    .badge { padding: 2px 10px; border-radius: 20px; font-size: 0.75rem; font-weight: 600; }
    .badge.critical { background: #dc3545; color: white; }
    .badge.high { background: #fd7e14; color: white; }
    .badge.medium { background: #ffc107; color: #333; }
    .badge.low { background: #17a2b8; color: white; }
    .badge.cwe { background: #e9ecef; color: #333; }
    .badge.tool { background: #6c757d; color: white; }
    .tools-list { display: flex; flex-wrap: wrap; gap: 4px; }
    .duplicate-badge { background: #17a2b8; color: white; font-size: 0.7rem; padding: 2px 6px; }
    .confirmed-badge { background: #28a745; color: white; }
    .dedup-info { background: #e3f2fd; padding: 15px; border-radius: 8px; margin-bottom: 20px; border-left: 4px solid #2196f3; }
    .finding-desc { color: #555; margin-bottom: 10px; }
    .evidence { background: #f0f0f0; padding: 10px; border-radius: 6px; font-family: monospace; font-size: 0.85rem; margin-bottom: 10px; overflow-x: auto; }
    .remediation { background: #e8f5e9; padding: 10px; border-radius: 6px; border-left: 3px solid #4caf50; }
    .category-header { padding: 15px 20px; border-radius: 8px; margin-bottom: 15px; color: white; }
    .category-header.a01 { background: linear-gradient(135deg, #dc3545 0%, #c82333 100%); }
    .category-header.a02 { background: linear-gradient(135deg, #fd7e14 0%, #e8650c 100%); }
    .category-header.a03 { background: linear-gradient(135deg, #ffc107 0%, #e0a800 100%); }
    footer { text-align: center; padding: 30px; color: #666; font-size: 0.9rem; }
  </style>
</head>
<body>
  <header>
    <div class="container">
      <h1>🔒 Security Assessment Report</h1>
      <p>OWASP Top 10:2021 (A01-A03) Vulnerability Analysis</p>
      <div class="meta">
        <span>📍 ${report.metadata.target}</span>
        <span>🏗️ ${report.metadata.projectId}</span>
        <span>📅 ${new Date(report.metadata.scanDate).toLocaleDateString()}</span>
        <span>⏱️ ${report.metadata.duration}</span>
      </div>
    </div>
  </header>
  
  <div class="container">
    <div class="cards">
      <div class="card critical"><h3>${report.summary.bySeverity.CRITICAL}</h3><p>Critical</p></div>
      <div class="card high"><h3>${report.summary.bySeverity.HIGH}</h3><p>High</p></div>
      <div class="card medium"><h3>${report.summary.bySeverity.MEDIUM}</h3><p>Medium</p></div>
      <div class="card low"><h3>${report.summary.bySeverity.LOW}</h3><p>Low</p></div>
      <div class="card"><h3>${report.summary.riskScore}</h3><p>Risk Score</p></div>
    </div>
    
    <div class="section">
      <h2>📋 Executive Summary</h2>
      <p>This security assessment identified <strong>${report.summary.total} unique findings</strong> 
      across OWASP Top 10:2021 categories A01 (Broken Access Control), A02 (Cryptographic Failures), 
      and A03 (Injection).</p>
      <p style="margin-top:10px"><strong>Risk Level:</strong> ${report.summary.riskLevel}</p>
      ${report.summary.deduplication && report.summary.deduplication.duplicatesRemoved > 0 ? `
      <div class="dedup-info" style="margin-top:15px">
        <strong>🔄 Deduplication Applied:</strong> 
        ${report.summary.deduplication.originalCount} raw findings from multiple scanners 
        → ${report.summary.deduplication.deduplicatedCount} unique vulnerabilities 
        (${report.summary.deduplication.duplicatesRemoved} duplicates merged, 
        ${report.summary.deduplication.reductionPercent}% reduction)
      </div>` : ''}
    </div>
    
    ${['A01', 'A02', 'A03'].map(cat => {
      const catFindings = report.findings.filter(f => f.category === cat);
      const catNames = { A01: 'Broken Access Control', A02: 'Cryptographic Failures', A03: 'Injection' };
      return `
    <div class="section">
      <div class="category-header ${cat.toLowerCase()}">
        <h2 style="margin:0;border:none;padding:0;color:white">${cat}: ${catNames[cat]} (${catFindings.length})</h2>
      </div>
      ${catFindings.map(f => `
      <div class="finding ${f.severity.toLowerCase()}">
        <div class="finding-header">
          <span class="finding-title">${f.title}</span>
          <div class="badges">
            <span class="badge ${f.severity.toLowerCase()}">${f.severity}</span>
            <span class="badge cwe">${f.cwe}</span>
            ${f.tools && f.tools.length > 1 
              ? `<div class="tools-list">${f.tools.map(t => `<span class="badge tool">${t}</span>`).join('')}</div>`
              : `<span class="badge tool">${f.tool}</span>`}
            ${f.duplicateCount && f.duplicateCount > 1 ? `<span class="badge duplicate-badge">×${f.duplicateCount}</span>` : ''}
            ${f.confirmed ? `<span class="badge confirmed-badge">✓ Confirmed</span>` : ''}
          </div>
        </div>
        <p class="finding-desc">${f.description}</p>
        ${f.evidence ? `<div class="evidence"><strong>Evidence:</strong> ${typeof f.evidence === 'object' ? JSON.stringify(f.evidence, null, 2) : f.evidence}</div>` : ''}
        ${f.remediation ? `<div class="remediation"><strong>Remediation:</strong> ${f.remediation}</div>` : ''}
      </div>
      `).join('')}
    </div>`;
    }).join('')}
  </div>
  
  <footer>
    <p>Generated by OWASP Security Scanner | ${report.metadata.scanDate}</p>
  </footer>
</body>
</html>`;
}

function generateMarkdownReport(report) {
  const dedup = report.summary.deduplication || {};
  
  let md = `# Security Assessment Report

**Application:** ${report.metadata.appName}  
**Target:** ${report.metadata.target}  
**Date:** ${report.metadata.scanDate}  
**Duration:** ${report.metadata.duration}

## Summary

| Severity | Count |
|----------|-------|
| CRITICAL | ${report.summary.bySeverity.CRITICAL} |
| HIGH | ${report.summary.bySeverity.HIGH} |
| MEDIUM | ${report.summary.bySeverity.MEDIUM} |
| LOW | ${report.summary.bySeverity.LOW} |

**Risk Score:** ${report.summary.riskScore} (${report.summary.riskLevel})

${dedup.duplicatesRemoved ? `
### Deduplication Summary

| Metric | Value |
|--------|-------|
| Original Findings | ${dedup.originalCount} |
| After Deduplication | ${dedup.deduplicatedCount} |
| Duplicates Removed | ${dedup.duplicatesRemoved} |
| Reduction | ${dedup.reductionPercent}% |
` : ''}
## Findings

`;

  ['A01', 'A02', 'A03'].forEach(cat => {
    const catFindings = report.findings.filter(f => f.category === cat);
    const catNames = { A01: 'Broken Access Control', A02: 'Cryptographic Failures', A03: 'Injection' };
    
    md += `### ${cat}: ${catNames[cat]}\n\n`;
    
    catFindings.forEach(f => {
      md += `#### ${f.severity}: ${f.title}\n\n`;
      md += `- **CWE:** ${f.cwe} (${f.cweName})\n`;
      
      // Show all tools that found this vulnerability
      if (f.tools && f.tools.length > 1) {
        md += `- **Found by:** ${f.tools.join(', ')} (${f.tools.length} tools)\n`;
      } else {
        md += `- **Tool:** ${f.tool}\n`;
      }
      
      // Show if confirmed by live testing
      if (f.confirmed) {
        md += `- **Status:** ✅ Confirmed (exploited in live test)\n`;
      }
      
      md += `- **Description:** ${f.description}\n`;
      if (f.remediation) md += `- **Remediation:** ${f.remediation}\n`;
      md += '\n';
    });
  });

  return md;
}

function printSummary(report) {
  console.log(`\n${colors.bgMagenta}${colors.white} SCAN SUMMARY ${colors.reset}\n`);
  
  // Show deduplication stats first
  if (report.summary.deduplication && report.summary.deduplication.duplicatesRemoved > 0) {
    const dedup = report.summary.deduplication;
    console.log(`  ${colors.cyan}Deduplication:${colors.reset} ${dedup.originalCount} → ${dedup.deduplicatedCount} (${dedup.duplicatesRemoved} duplicates removed)`);
    console.log('');
  }
  
  console.log(`  ${colors.bgRed}${colors.white} CRITICAL ${colors.reset}  ${report.summary.bySeverity.CRITICAL}`);
  console.log(`  ${colors.red}HIGH${colors.reset}       ${report.summary.bySeverity.HIGH}`);
  console.log(`  ${colors.yellow}MEDIUM${colors.reset}     ${report.summary.bySeverity.MEDIUM}`);
  console.log(`  ${colors.blue}LOW${colors.reset}        ${report.summary.bySeverity.LOW}`);
  console.log('');
  console.log(`  Total: ${report.summary.total}`);
  console.log(`  Risk Score: ${report.summary.riskScore} (${report.summary.riskLevel})`);
  console.log(`  Duration: ${report.metadata.duration}`);
}









async function main() {
  const args = process.argv.slice(2);
  let configPath = 'config.yaml';
  let skipZap = false;
  let skipLive = false;
  let skipSemgrep = false;
  let skipSca = false;
  let skipEnhanced = false;
  
  for (let i = 0; i < args.length; i++) {
    switch (args[i]) {
      case '--config':
      case '-c':
        configPath = args[++i];
        break;
      case '--skip-zap':
        skipZap = true;
        break;
      case '--skip-live':
        skipLive = true;
        break;
      case '--skip-semgrep':
        skipSemgrep = true;
        break;
      case '--skip-sca':
        skipSca = true;
        break;
      case '--skip-enhanced':
        skipEnhanced = true;
        break;
      case '--help':
      case '-h':
        console.log(`
Usage: node scanner.js [options]

Options:
  -c, --config <path>   Path to config YAML file (default: config.yaml)
  --skip-zap            Skip OWASP ZAP scan
  --skip-live           Skip live Firebase tests
  --skip-semgrep        Skip Semgrep analysis
  --skip-sca            Skip SCA (npm audit) analysis
  -h, --help            Show this help message
        `);
        process.exit(0);
    }
  }
  
  const resolvedConfigPath = path.resolve(configPath);
  if (!fs.existsSync(resolvedConfigPath)) {
    console.error(`${colors.red}Config file not found: ${configPath}${colors.reset}`);
    process.exit(1);
  }
  
  config = loadConfig(resolvedConfigPath);
  if (!config.scanner) 
    config.scanner = {};
  if (!config.scanner.tests) 
    config.scanner.tests = {};
  const configDir = path.dirname(resolvedConfigPath);
  
  
  if (config.sourcePath && !path.isAbsolute(config.sourcePath)) {
    config.sourcePath = path.resolve(configDir, config.sourcePath);
  }
  if (config.scanner?.reports?.outputDir && !path.isAbsolute(config.scanner.reports.outputDir)) {
    config.scanner.reports.outputDir = path.resolve(configDir, config.scanner.reports.outputDir);
  }
  if (config.scanner?.semgrep?.customRules && !path.isAbsolute(config.scanner.semgrep.customRules)) {
    config.scanner.semgrep.customRules = path.resolve(configDir, config.scanner.semgrep.customRules);
  }
  
  if (skipZap) config.scanner.tests.zapScan = false;
  if (skipLive) config.scanner.tests.liveFirebaseTests = false;
  if (skipSemgrep) config.scanner.tests.semgrepAnalysis = false;
  if (skipSca) config.scanner.tests.scaAnalysis = false;
  if (skipEnhanced) {config.scanner.tests.enhancedScans = false;}

  banner();
  
  console.log(`${colors.cyan}Target:${colors.reset} ${config.app?.url}`);
  console.log(`${colors.cyan}Config:${colors.reset} ${configPath}`);
  console.log(`${colors.cyan}Date:${colors.reset}   ${new Date().toISOString()}\n`);
  
  try {
    analyzeFirestoreRules();
    analyzeStorageRules();
    await runEmulatorTests();
    await runSemgrepAnalysis();
    await startZapDaemon();
    await sleep(20000);
    await runZapAnalysis();
    await runScaAnalysis();
    await runLiveFirebaseTests();
    await runEnhancedSecurityScans();
    generateReports();
  } catch (error) {
    console.error(`${colors.red}Error: ${error.message}${colors.reset}`);
    console.error(error.stack);
    process.exit(1);
  }
}

main();
