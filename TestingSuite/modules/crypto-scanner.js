
const https = require('https');
const http = require('http');
const tls = require('tls');
const { URL } = require('url');

const SECRET_PATTERNS = [
  // API Keys
  { name: 'AWS Access Key', pattern: /AKIA[0-9A-Z]{16}/g, severity: 'CRITICAL', cwe: 'CWE-798' },
  { name: 'AWS Secret Key', pattern: /aws.{0,20}['"][0-9a-zA-Z\/+]{40}['"]/gi, severity: 'CRITICAL', cwe: 'CWE-798' },
  { name: 'Google API Key', pattern: /AIza[0-9A-Za-z\-_]{35}/g, severity: 'HIGH', cwe: 'CWE-798' },
  { name: 'Google OAuth', pattern: /[0-9]+-[0-9A-Za-z_]{32}\.apps\.googleusercontent\.com/g, severity: 'HIGH', cwe: 'CWE-798' },
  { name: 'GitHub Token', pattern: /gh[pousr]_[A-Za-z0-9_]{36,}/g, severity: 'CRITICAL', cwe: 'CWE-798' },
  { name: 'GitHub OAuth', pattern: /github.{0,20}['"][0-9a-zA-Z]{35,40}['"]/gi, severity: 'CRITICAL', cwe: 'CWE-798' },
  { name: 'Slack Token', pattern: /xox[baprs]-[0-9]{10,13}-[0-9]{10,13}[a-zA-Z0-9-]*/g, severity: 'CRITICAL', cwe: 'CWE-798' },
  { name: 'Slack Webhook', pattern: /hooks\.slack\.com\/services\/T[a-zA-Z0-9_]{8}\/B[a-zA-Z0-9_]{8,12}\/[a-zA-Z0-9_]{24}/g, severity: 'HIGH', cwe: 'CWE-798' },
  { name: 'Stripe Key', pattern: /sk_live_[0-9a-zA-Z]{24,}/g, severity: 'CRITICAL', cwe: 'CWE-798' },
  { name: 'Stripe Publishable', pattern: /pk_live_[0-9a-zA-Z]{24,}/g, severity: 'MEDIUM', cwe: 'CWE-798' },
  { name: 'Square Access Token', pattern: /sq0atp-[0-9A-Za-z\-_]{22}/g, severity: 'CRITICAL', cwe: 'CWE-798' },
  { name: 'Square OAuth', pattern: /sq0csp-[0-9A-Za-z\-_]{43}/g, severity: 'CRITICAL', cwe: 'CWE-798' },
  { name: 'Twilio API Key', pattern: /SK[0-9a-fA-F]{32}/g, severity: 'HIGH', cwe: 'CWE-798' },
  { name: 'SendGrid API Key', pattern: /SG\.[a-zA-Z0-9_-]{22}\.[a-zA-Z0-9_-]{43}/g, severity: 'HIGH', cwe: 'CWE-798' },
  { name: 'Mailgun API Key', pattern: /key-[0-9a-zA-Z]{32}/g, severity: 'HIGH', cwe: 'CWE-798' },
  { name: 'Mailchimp API Key', pattern: /[0-9a-f]{32}-us[0-9]{1,2}/g, severity: 'HIGH', cwe: 'CWE-798' },
  { name: 'Heroku API Key', pattern: /heroku.{0,20}[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}/gi, severity: 'HIGH', cwe: 'CWE-798' },
  
  // Private Keys
  { name: 'RSA Private Key', pattern: /-----BEGIN RSA PRIVATE KEY-----/g, severity: 'CRITICAL', cwe: 'CWE-321' },
  { name: 'SSH Private Key', pattern: /-----BEGIN OPENSSH PRIVATE KEY-----/g, severity: 'CRITICAL', cwe: 'CWE-321' },
  { name: 'EC Private Key', pattern: /-----BEGIN EC PRIVATE KEY-----/g, severity: 'CRITICAL', cwe: 'CWE-321' },
  { name: 'PGP Private Key', pattern: /-----BEGIN PGP PRIVATE KEY BLOCK-----/g, severity: 'CRITICAL', cwe: 'CWE-321' },
  
  // Generic Secrets
  { name: 'Generic API Key', pattern: /api[_-]?key['"\s:=]+['"][a-zA-Z0-9_\-]{20,}['"]/gi, severity: 'HIGH', cwe: 'CWE-798' },
  { name: 'Generic Secret', pattern: /secret['"\s:=]+['"][a-zA-Z0-9_\-]{20,}['"]/gi, severity: 'HIGH', cwe: 'CWE-798' },
  { name: 'Generic Password', pattern: /password['"\s:=]+['"][^'"]{8,}['"]/gi, severity: 'HIGH', cwe: 'CWE-798' },
  { name: 'Generic Token', pattern: /token['"\s:=]+['"][a-zA-Z0-9_\-]{20,}['"]/gi, severity: 'MEDIUM', cwe: 'CWE-798' },
  { name: 'Bearer Token', pattern: /bearer\s+[a-zA-Z0-9_\-\.]+/gi, severity: 'HIGH', cwe: 'CWE-522' },
  
  // Database URLs
  { name: 'MongoDB URI', pattern: /mongodb(\+srv)?:\/\/[^\s'"]+/gi, severity: 'CRITICAL', cwe: 'CWE-798' },
  { name: 'PostgreSQL URI', pattern: /postgres(ql)?:\/\/[^\s'"]+/gi, severity: 'CRITICAL', cwe: 'CWE-798' },
  { name: 'MySQL URI', pattern: /mysql:\/\/[^\s'"]+/gi, severity: 'CRITICAL', cwe: 'CWE-798' },
  { name: 'Redis URI', pattern: /redis:\/\/[^\s'"]+/gi, severity: 'HIGH', cwe: 'CWE-798' },
  
  // JWT
  { name: 'JWT Token', pattern: /eyJ[A-Za-z0-9_-]*\.eyJ[A-Za-z0-9_-]*\.[A-Za-z0-9_-]*/g, severity: 'MEDIUM', cwe: 'CWE-522' },
  
  // Firebase (beyond normal config)
  { name: 'Firebase Service Account', pattern: /"type":\s*"service_account"/g, severity: 'CRITICAL', cwe: 'CWE-798' },
  { name: 'Firebase Private Key', pattern: /"private_key":\s*"-----BEGIN/g, severity: 'CRITICAL', cwe: 'CWE-321' }
];

// Patterns that are expected/safe in Firebase apps
const FIREBASE_SAFE_PATTERNS = [
  /apiKey.*AIza/,  // Firebase API key (designed to be public)
  /authDomain.*firebaseapp\.com/,
  /projectId/,
  /storageBucket.*appspot\.com/,
  /messagingSenderId/,
  /appId.*1:/
];

const WEAK_CRYPTO_PATTERNS = [
  { name: 'MD5 Usage', pattern: /\bmd5\s*\(/gi, severity: 'MEDIUM', cwe: 'CWE-328' },
  { name: 'SHA1 Usage', pattern: /\bsha1\s*\(/gi, severity: 'MEDIUM', cwe: 'CWE-328' },
  { name: 'DES Encryption', pattern: /\bdes\b.*encrypt/gi, severity: 'HIGH', cwe: 'CWE-327' },
  { name: 'RC4 Encryption', pattern: /\brc4\b/gi, severity: 'HIGH', cwe: 'CWE-327' },
  { name: 'ECB Mode', pattern: /['"]ecb['"]/gi, severity: 'HIGH', cwe: 'CWE-327' },
  { name: 'Weak Random', pattern: /Math\.random\s*\(\)/g, severity: 'MEDIUM', cwe: 'CWE-330' },
  { name: 'Predictable Seed', pattern: /seed\s*[:=]\s*\d+/gi, severity: 'MEDIUM', cwe: 'CWE-330' },
  { name: 'Static IV', pattern: /iv\s*[:=]\s*['"][^'"]+['"]/gi, severity: 'HIGH', cwe: 'CWE-329' },
  { name: 'Hardcoded Salt', pattern: /salt\s*[:=]\s*['"][^'"]+['"]/gi, severity: 'MEDIUM', cwe: 'CWE-760' }
];


const TLS_VERSIONS = {
  'TLSv1': { secure: false, severity: 'HIGH' },
  'TLSv1.1': { secure: false, severity: 'HIGH' },
  'TLSv1.2': { secure: true, severity: 'INFO' },
  'TLSv1.3': { secure: true, severity: 'INFO' }
};

const WEAK_CIPHERS = [
  'DES', 'RC4', 'RC2', 'IDEA', 'SEED', 'MD5', 'SHA1',
  'NULL', 'EXPORT', 'anon', 'ADH', 'AECDH'
];

class CryptoScanner {
  constructor(config = {}) {
    this.config = config;
    this.findings = [];
    this.targetUrl = config.app?.url;
  }

  log(level, message) {
    const colors = {
      info: '\x1b[36m',
      warn: '\x1b[33m',
      error: '\x1b[31m',
      success: '\x1b[32m',
      reset: '\x1b[0m'
    };
    console.log(`  ${colors[level] || ''}[A02]${colors.reset} ${message}`);
  }

  addFinding(cwe, severity, title, description, evidence = null) {
    this.findings.push({
      category: 'A02',
      cwe,
      severity,
      title,
      description,
      evidence,
      tool: 'crypto-scanner'
    });
  }


  async scan(page = null) {
    this.log('info', 'Starting A02: Cryptographic Failures scan...');
    
    await this.checkHTTPSEnforcement();
    await this.checkTLSConfiguration();
   
    if (page) {
      await this.scanJSBundles(page);
      await this.checkCookieSecurity(page);
      await this.checkLocalStorageSecrets(page);
      await this.checkFirebaseConfig(page);
      await this.checkPasswordPolicy(page);
    }
    
    this.log('success', `A02 scan complete. Found ${this.findings.length} issues.`);
    return this.findings;
  }
  async checkHTTPSEnforcement() {
    if (!this.targetUrl) return;
    
    try {
      const url = new URL(this.targetUrl);
      if (url.protocol !== 'https:') {
        this.addFinding(
          'CWE-319',
          'HIGH',
          'Application not using HTTPS',
          `Target URL uses HTTP: ${this.targetUrl}`,
          { url: this.targetUrl }
        );
        return;
      }
      
      const httpUrl = this.targetUrl.replace('https:', 'http:');
      
      const redirectsToHttps = await new Promise((resolve) => {
        const req = http.get(httpUrl, { timeout: 10000 }, (res) => {
          const location = res.headers.location || '';
          resolve(
            res.statusCode >= 300 && 
            res.statusCode < 400 && 
            location.startsWith('https')
          );
        });
        req.on('error', () => resolve(null)); // Can't test
        req.on('timeout', () => { req.destroy(); resolve(null); });
      });
      
      if (redirectsToHttps === false) {
        this.addFinding(
          'CWE-319',
          'HIGH',
          'HTTP does not redirect to HTTPS',
          `HTTP requests to ${httpUrl} are not redirected to HTTPS. This allows cleartext transmission.`,
          { httpUrl }
        );
      } else if (redirectsToHttps === true) {
        this.log('info', 'HTTPS enforcement: HTTP redirects to HTTPS ✓');
      }
      
    } catch (error) {
      this.log('warn', `Could not check HTTPS enforcement: ${error.message}`);
    }
  }

  async checkTLSConfiguration() {
    if (!this.targetUrl) return;
    
    try {
      const url = new URL(this.targetUrl);
      if (url.protocol !== 'https:') return;
      
      const tlsInfo = await new Promise((resolve, reject) => {
        const socket = tls.connect({
          host: url.hostname,
          port: url.port || 443,
          servername: url.hostname,
          rejectUnauthorized: false,
          timeout: 10000
        }, () => {
          const protocol = socket.getProtocol();
          const cipher = socket.getCipher();
          const cert = socket.getPeerCertificate();
          socket.end();
          resolve({ protocol, cipher, cert });
        });
        
        socket.on('error', reject);
        socket.on('timeout', () => {
          socket.destroy();
          reject(new Error('TLS connection timeout'));
        });
      });
      
      const tlsVersion = tlsInfo.protocol;
      const tlsConfig = TLS_VERSIONS[tlsVersion];
      
      if (tlsConfig && !tlsConfig.secure) {
        this.addFinding(
          'CWE-326',
          tlsConfig.severity,
          `Weak TLS version: ${tlsVersion}`,
          `Server supports outdated TLS version ${tlsVersion}. This is vulnerable to known attacks like POODLE and BEAST.`,
          { protocol: tlsVersion, host: url.hostname }
        );
      } else {
        this.log('info', `TLS version: ${tlsVersion} ✓`);
      }
      
      // Check cipher strength
      if (tlsInfo.cipher) {
        const cipherName = tlsInfo.cipher.name || '';
        const weakCipher = WEAK_CIPHERS.find(weak => 
          cipherName.toUpperCase().includes(weak.toUpperCase())
        );
        
        if (weakCipher) {
          this.addFinding(
            'CWE-327',
            'HIGH',
            `Weak cipher suite: ${cipherName}`,
            `Server is using weak cipher ${cipherName} which contains ${weakCipher}.`,
            { cipher: tlsInfo.cipher, host: url.hostname }
          );
        } else {
          this.log('info', `Cipher suite: ${cipherName} ✓`);
        }
      }
      
      if (tlsInfo.cert) {
        const now = new Date();
        const validTo = new Date(tlsInfo.cert.valid_to);
        const validFrom = new Date(tlsInfo.cert.valid_from);
        
        if (now > validTo) {
          this.addFinding(
            'CWE-295',
            'CRITICAL',
            'SSL certificate expired',
            `Certificate expired on ${validTo.toISOString()}`,
            { validTo: tlsInfo.cert.valid_to, subject: tlsInfo.cert.subject }
          );
        } else if (now < validFrom) {
          this.addFinding(
            'CWE-295',
            'HIGH',
            'SSL certificate not yet valid',
            `Certificate is not valid until ${validFrom.toISOString()}`,
            { validFrom: tlsInfo.cert.valid_from }
          );
        }
        
        if (tlsInfo.cert.issuer && tlsInfo.cert.subject) {
          const issuerCN = tlsInfo.cert.issuer.CN || '';
          const subjectCN = tlsInfo.cert.subject.CN || '';
          if (issuerCN === subjectCN && !issuerCN.includes('Root')) {
            this.addFinding(
              'CWE-295',
              'MEDIUM',
              'Self-signed SSL certificate',
              `Certificate appears to be self-signed (issuer matches subject: ${issuerCN})`,
              { issuer: tlsInfo.cert.issuer, subject: tlsInfo.cert.subject }
            );
          }
        }
      }
      
    } catch (error) {
      this.log('warn', `Could not check TLS configuration: ${error.message}`);
    }
  }

  async scanJSBundles(page) {
    this.log('info', 'Scanning JavaScript bundles for secrets...');
    
    try {
      const scripts = await page.evaluate(() => {
        const results = [];
        
        document.querySelectorAll('script:not([src])').forEach((script, i) => {
          if (script.textContent && script.textContent.length > 100) {
            results.push({
              type: 'inline',
              index: i,
              content: script.textContent.substring(0, 500000) // Limit size
            });
          }
        });
        
        document.querySelectorAll('script[src]').forEach(script => {
          const src = script.src;
          if (src && !src.includes('googleapis.com') && 
              !src.includes('gstatic.com') &&
              !src.includes('cloudflare.com')) {
            results.push({
              type: 'external',
              url: src
            });
          }
        });
        
        return results;
      });
      
      for (const script of scripts) {
        let content = '';
        let source = '';
        
        if (script.type === 'inline') {
          content = script.content;
          source = `inline script #${script.index}`;
        } else if (script.type === 'external') {
          try {
            const response = await page.evaluate(async (url) => {
              const res = await fetch(url);
              return await res.text();
            }, script.url);
            content = response.substring(0, 500000);
            source = script.url;
          } catch (e) {
            continue;
          }
        }
        
        this.scanContentForSecrets(content, source);
        this.scanContentForWeakCrypto(content, source);
      }
      
    } catch (error) {
      this.log('warn', `JS bundle scan error: ${error.message}`);
    }
  }
  
  scanContentForSecrets(content, source) {
    for (const secretPattern of SECRET_PATTERNS) {
      const matches = content.match(secretPattern.pattern);
      if (matches) {
        for (const match of matches) {
          // Check if this is a safe Firebase pattern
          const isSafeFirebase = FIREBASE_SAFE_PATTERNS.some(safe => safe.test(match));
          if (isSafeFirebase) continue;
          
          // Redact the actual secret value
          const redacted = match.length > 20 
            ? match.substring(0, 10) + '...' + match.substring(match.length - 5)
            : match.substring(0, 5) + '...';
          
          this.addFinding(
            secretPattern.cwe,
            secretPattern.severity,
            `Hardcoded ${secretPattern.name} found`,
            `Found potential ${secretPattern.name} in ${source}`,
            { 
              pattern: secretPattern.name, 
              source,
              redactedMatch: redacted
            }
          );
        }
      }
    }
  }

  scanContentForWeakCrypto(content, source) {
    for (const pattern of WEAK_CRYPTO_PATTERNS) {
      const matches = content.match(pattern.pattern);
      if (matches) {
        this.addFinding(
          pattern.cwe,
          pattern.severity,
          `${pattern.name} detected`,
          `Found ${pattern.name} in ${source}. This may indicate weak cryptographic practices.`,
          { pattern: pattern.name, source, matchCount: matches.length }
        );
      }
    }
  }

  async checkCookieSecurity(page) {
    this.log('info', 'Checking cookie security...');
    
    try {
      const cookies = await page.cookies();
      
      for (const cookie of cookies) {
        const issues = [];
        
        const isSessionCookie = /session|auth|token|jwt|sid/i.test(cookie.name);
        
        if (!cookie.secure && isSessionCookie) {
          issues.push('missing Secure flag');
        }
        
        if (!cookie.httpOnly && isSessionCookie) {
          issues.push('missing HttpOnly flag');
        }
        
        if (cookie.sameSite === 'None' && !cookie.secure) {
          issues.push('SameSite=None without Secure');
        }
        
        if (!cookie.sameSite || cookie.sameSite === 'None') {
          if (isSessionCookie) {
            issues.push('weak SameSite policy');
          }
        }
        
        if (issues.length > 0 && isSessionCookie) {
          this.addFinding(
            'CWE-614',
            'MEDIUM',
            `Insecure cookie: ${cookie.name}`,
            `Session cookie "${cookie.name}" has security issues: ${issues.join(', ')}`,
            { 
              cookieName: cookie.name, 
              issues,
              secure: cookie.secure,
              httpOnly: cookie.httpOnly,
              sameSite: cookie.sameSite
            }
          );
        }
      }
      
    } catch (error) {
      this.log('warn', `Cookie security check error: ${error.message}`);
    }
  }
  
  async checkLocalStorageSecrets(page) {
    this.log('info', 'Checking browser storage for sensitive data...');
    
    try {
      const storageData = await page.evaluate(() => {
        const data = { localStorage: {}, sessionStorage: {} };
        
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          data.localStorage[key] = localStorage.getItem(key);
        }
        
        for (let i = 0; i < sessionStorage.length; i++) {
          const key = sessionStorage.key(i);
          data.sessionStorage[key] = sessionStorage.getItem(key);
        }
        
        return data;
      });
      
      const sensitiveKeyPatterns = [
        /password/i, /secret/i, /private.*key/i, /credit.*card/i,
        /ssn/i, /social.*security/i, /api.*key/i
      ];
      
      const checkStorage = (storage, storageName) => {
        for (const [key, value] of Object.entries(storage)) {
          for (const pattern of sensitiveKeyPatterns) {
            if (pattern.test(key)) {
              this.addFinding(
                'CWE-922',
                'HIGH',
                `Sensitive data in ${storageName}`,
                `Key "${key}" in ${storageName} may contain sensitive data`,
                { storageName, key }
              );
              break;
            }
          }
          
          if (typeof value === 'string' && value.length > 20) {
            this.scanContentForSecrets(value, `${storageName}["${key}"]`);
          }
        }
      };
      
      checkStorage(storageData.localStorage, 'localStorage');
      checkStorage(storageData.sessionStorage, 'sessionStorage');
      
    } catch (error) {
      this.log('warn', `Storage check error: ${error.message}`);
    }
  }

  /**
   * Check Firebase configuration for security issues
   */
  async checkFirebaseConfig(page) {
    this.log('info', 'Checking Firebase configuration...');
    
    try {
      const firebaseInfo = await page.evaluate(() => {
        const info = { found: false, config: null, issues: [] };
        
        // Check for Firebase on window
        if (typeof firebase !== 'undefined' || window.firebase) {
          info.found = true;
        }
        
        // Look for Firebase config in various places
        const scripts = document.querySelectorAll('script');
        for (const script of scripts) {
          const content = script.textContent || '';
          
          // Look for firebaseConfig object
          const configMatch = content.match(/firebaseConfig\s*=\s*(\{[\s\S]*?\})/);
          if (configMatch) {
            try {
              // Try to extract the config
              const configStr = configMatch[1]
                .replace(/(['"])?([a-zA-Z0-9_]+)(['"])?\s*:/g, '"$2":')
                .replace(/'/g, '"');
              info.config = JSON.parse(configStr);
            } catch (e) {
              // Couldn't parse, but we found something
              info.config = { raw: configMatch[1] };
            }
          }
          
          // Check for service account JSON (should never be in frontend!)
          if (content.includes('"type": "service_account"') || 
              content.includes('"type":"service_account"')) {
            info.issues.push('SERVICE_ACCOUNT_EXPOSED');
          }
          
          // Check for private key
          if (content.includes('-----BEGIN PRIVATE KEY-----') ||
              content.includes('-----BEGIN RSA PRIVATE KEY-----')) {
            info.issues.push('PRIVATE_KEY_EXPOSED');
          }
        }
        
        return info;
      });
      
      if (firebaseInfo.issues.includes('SERVICE_ACCOUNT_EXPOSED')) {
        this.addFinding(
          'CWE-798',
          'CRITICAL',
          'Firebase service account exposed in frontend',
          'Service account credentials are exposed in client-side code. This gives full admin access to your Firebase project.',
          { type: 'service_account_exposure' }
        );
      }
      
      if (firebaseInfo.issues.includes('PRIVATE_KEY_EXPOSED')) {
        this.addFinding(
          'CWE-321',
          'CRITICAL',
          'Private key exposed in frontend code',
          'A private key is exposed in client-side JavaScript. This completely compromises the associated service.',
          { type: 'private_key_exposure' }
        );
      }
      
      if (firebaseInfo.config && firebaseInfo.config.apiKey) {
        this.log('info', 'Firebase config found (API key is public by design) ✓');
      }
      
    } catch (error) {
      this.log('warn', `Firebase config check error: ${error.message}`);
    }
  }

  async checkPasswordPolicy(page) {
    this.log('info', 'Checking password policy...');
    
    try {
      const passwordInputs = await page.$$('input[type="password"]');
      
      for (const input of passwordInputs) {
        const attributes = await page.evaluate(el => ({
          minLength: el.minLength,
          maxLength: el.maxLength,
          pattern: el.pattern,
          autocomplete: el.autocomplete,
          name: el.name,
          id: el.id
        }), input);
        
        const issues = [];
        
        if (!attributes.minLength || attributes.minLength < 8) {
          issues.push('no minimum length requirement (should be ≥8)');
        }
        if (attributes.autocomplete === 'on') {
          issues.push('generic autocomplete="on" (should be "new-password" or "current-password")');
        }
        if (!attributes.pattern) {
          issues.push('no pattern for password complexity');
        }
        if (issues.length > 0) {
          this.addFinding(
            'CWE-521',
            'MEDIUM',
            'Weak password policy',
            `Password field "${attributes.name || attributes.id || 'unknown'}" has weak policy: ${issues.join(', ')}`,
            { attributes, issues }
          );
        }
      }
      
    } catch (error) {
      this.log('warn', `Password policy check error: ${error.message}`);
    }
  }
}

module.exports = {
  CryptoScanner,
  SECRET_PATTERNS,
  WEAK_CRYPTO_PATTERNS,
  TLS_VERSIONS,
  WEAK_CIPHERS
};
