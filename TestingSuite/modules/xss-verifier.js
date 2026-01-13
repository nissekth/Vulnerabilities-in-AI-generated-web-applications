const puppeteer = require('puppeteer');

let constants;
try {
  constants = require('./constants');
} catch (e) {
  constants = {
    TIMING: { BROWSER_PAGE_TIMEOUT: 30000, OPERATION_DELAY: 1000 },
    XSS_TEST_PAYLOADS: {
      primary: [
        '<script>window.__XSS_EXECUTED__=true</script>',
        '<img src=x onerror="window.__XSS_EXECUTED__=true">',
        '<svg onload="window.__XSS_EXECUTED__=true">'
      ]
    }
  };
}

const XSS_VERIFICATION_PAYLOADS = [
  {
    id: 'script_tag',
    payload: '<script>window.__XSS_MARKER_SCRIPT__=Date.now()</script>',
    marker: '__XSS_MARKER_SCRIPT__',
    type: 'script',
    severity: 'CRITICAL'
  },
  {
    id: 'img_onerror',
    payload: '<img src=x onerror="window.__XSS_MARKER_IMG__=Date.now()">',
    marker: '__XSS_MARKER_IMG__',
    type: 'event_handler',
    severity: 'CRITICAL'
  },
  {
    id: 'svg_onload',
    payload: '<svg onload="window.__XSS_MARKER_SVG__=Date.now()">',
    marker: '__XSS_MARKER_SVG__',
    type: 'event_handler',
    severity: 'CRITICAL'
  },
  {
    id: 'body_onload',
    payload: '<body onload="window.__XSS_MARKER_BODY__=Date.now()">',
    marker: '__XSS_MARKER_BODY__',
    type: 'event_handler',
    severity: 'HIGH'
  },
  {
    id: 'iframe_src',
    payload: '<iframe src="javascript:parent.__XSS_MARKER_IFRAME__=Date.now()">',
    marker: '__XSS_MARKER_IFRAME__',
    type: 'javascript_uri',
    severity: 'CRITICAL'
  },
  {
    id: 'a_href_click',
    payload: '<a id="xss_link" href="javascript:window.__XSS_MARKER_LINK__=Date.now()">click</a>',
    marker: '__XSS_MARKER_LINK__',
    type: 'javascript_uri',
    severity: 'MEDIUM',
    requiresInteraction: true
  }
];

const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  bgRed: '\x1b[41m',
  bgGreen: '\x1b[42m',
  white: '\x1b[37m'
};

function log(type, msg) {
  const icons = {
    info: `${colors.blue}ℹ${colors.reset}`,
    success: `${colors.green}✓${colors.reset}`,
    warn: `${colors.yellow}⚠${colors.reset}`,
    error: `${colors.red}✗${colors.reset}`,
    vuln: `${colors.bgRed}${colors.white} VULN ${colors.reset}`,
    safe: `${colors.bgGreen}${colors.white} SAFE ${colors.reset}`
  };
  console.log(`  ${icons[type] || '•'} [XSS-Verify] ${msg}`);
}


class XSSVerifier {
  constructor(config) {
    this.config = config;
    this.findings = [];
    this.targetUrl = config.app?.url;
    this.browser = null;
    this.page = null;
  }

  async initBrowser() {
    if (this.browser) return;
    
    log('info', 'Launching browser for XSS verification...');
    
    this.browser = await puppeteer.launch({
      headless: 'new',
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-web-security',
        '--disable-features=IsolateOrigins,site-per-process'
      ]
    });
    
    this.page = await this.browser.newPage();
    await this.page.setViewport({ width: 1920, height: 1080 });
    
    // Set up console message logging
    this.page.on('console', msg => {
      if (msg.text().includes('XSS_MARKER')) {
        log('vuln', `Console: ${msg.text()}`);
      }
    });
    
    log('success', 'Browser ready');
  }


  async closeBrowser() {
    if (this.browser) {
      await this.browser.close();
      this.browser = null;
      this.page = null;
    }
  }

  async verifyExecution(options) {
    const { renderUrl, payload, marker, collectionName, documentId } = options;
    
    await this.initBrowser();
    
    const result = {
      payloadStored: true,
      payloadRendered: false,
      payloadExecuted: false,
      executionType: null,
      evidence: {}
    };
    
    try {
      await this.page.evaluate(() => {
        Object.keys(window).filter(k => k.startsWith('__XSS_MARKER')).forEach(k => {
          delete window[k];
        });
      });
      
      // Navigate to render URL
      log('info', `Navigating to: ${renderUrl}`);
      await this.page.goto(renderUrl, { 
        waitUntil: 'networkidle2', 
        timeout: constants.TIMING?.BROWSER_PAGE_TIMEOUT || 30000 
      });
      
      // Wait for dynamic content to load
      await this.page.waitForTimeout(2000);
      
      // Check if payload is in the page HTML
      const pageContent = await this.page.content();
      if (pageContent.includes(payload) || pageContent.includes(payload.replace(/"/g, "'"))) {
        result.payloadRendered = true;
        log('warn', 'Payload found in rendered HTML');
      }
      
      // Check if marker was set (payload executed)
      const markerValue = await this.page.evaluate((m) => window[m], marker);
      
      if (markerValue !== undefined) {
        result.payloadExecuted = true;
        result.executionType = 'automatic';
        result.evidence = {
          marker,
          value: markerValue,
          url: renderUrl,
          timestamp: new Date().toISOString()
        };
        log('vuln', `XSS EXECUTED! Marker ${marker} = ${markerValue}`);
      } else {
        log('info', 'Payload did not auto-execute');
        
        // For payloads requiring interaction, try clicking
        if (options.requiresInteraction) {
          try {
            await this.page.click('#xss_link');
            await this.page.waitForTimeout(500);
            
            const clickMarker = await this.page.evaluate((m) => window[m], marker);
            if (clickMarker !== undefined) {
              result.payloadExecuted = true;
              result.executionType = 'user_interaction';
              result.evidence = {
                marker,
                value: clickMarker,
                requiresClick: true
              };
              log('vuln', 'XSS executed after click interaction');
            }
          } catch (e) {
            // Link not found or not clickable
          }
        }
      }
      
      if (result.payloadRendered || result.payloadExecuted) {
        const screenshotPath = `./reports/xss-verify-${Date.now()}.png`;
        await this.page.screenshot({ path: screenshotPath, fullPage: true });
        result.evidence.screenshot = screenshotPath;
      }
      
    } catch (error) {
      log('error', `Verification error: ${error.message}`);
      result.error = error.message;
    }
    
    return result;
  }

  async verifyStoredPayloads(db, storedPayloads, getRenderUrl) {
    log('info', 'Starting XSS exploitation verification...');
    
    const verificationResults = [];
    
    for (const [collectionName, payloads] of Object.entries(storedPayloads)) {
      log('info', `Verifying ${payloads.length} payloads in ${collectionName}`);
      
      for (const stored of payloads) {
        const verificationPayload = XSS_VERIFICATION_PAYLOADS.find(vp => 
          stored.payload.includes(vp.marker.replace('__XSS_MARKER_', '__XSS_'))
        );
        
        if (!verificationPayload) {
          const renderUrl = getRenderUrl(collectionName, stored.docId);
          if (renderUrl) {
            const result = await this.verifyGenericExecution(renderUrl, stored.payload);
            verificationResults.push({
              collection: collectionName,
              documentId: stored.docId,
              field: stored.field,
              payload: stored.payload.substring(0, 50),
              ...result
            });
          }
          continue;
        }
        
        const renderUrl = getRenderUrl(collectionName, stored.docId);
        if (!renderUrl) {
          log('warn', `No render URL for ${collectionName}/${stored.docId}`);
          continue;
        }
        
        const result = await this.verifyExecution({
          renderUrl,
          payload: stored.payload,
          marker: verificationPayload.marker,
          collectionName,
          documentId: stored.docId,
          requiresInteraction: verificationPayload.requiresInteraction
        });
        
        verificationResults.push({
          collection: collectionName,
          documentId: stored.docId,
          field: stored.field,
          payload: stored.payload.substring(0, 50),
          type: verificationPayload.type,
          severity: verificationPayload.severity,
          ...result
        });
        
        // Add finding if executed
        if (result.payloadExecuted) {
          this.findings.push({
            category: 'A03',
            cwe: 'CWE-79',
            severity: verificationPayload.severity,
            title: `Confirmed Stored XSS in ${collectionName}`,
            description: `XSS payload in ${collectionName}.${stored.field} was confirmed to execute when rendered. Execution type: ${result.executionType}`,
            evidence: {
              collection: collectionName,
              documentId: stored.docId,
              field: stored.field,
              renderUrl,
              executionType: result.executionType,
              ...result.evidence
            },
            tool: 'xss-verifier',
            confirmed: true
          });
        } else if (result.payloadRendered) {
          this.findings.push({
            category: 'A03',
            cwe: 'CWE-79',
            severity: 'MEDIUM',
            title: `Potential Stored XSS in ${collectionName}`,
            description: `XSS payload stored in ${collectionName}.${stored.field} and rendered unescaped, but did not auto-execute. May execute with user interaction or in different context.`,
            evidence: {
              collection: collectionName,
              documentId: stored.docId,
              field: stored.field,
              renderUrl
            },
            tool: 'xss-verifier',
            confirmed: false
          });
        }
        
        await new Promise(r => setTimeout(r, 500));
      }
    }
    
    return verificationResults;
  }


  async verifyGenericExecution(renderUrl, payload) {
    await this.initBrowser();
    
    const result = {
      payloadRendered: false,
      payloadExecuted: false
    };
    
    try {
      let alertTriggered = false;
      this.page.on('dialog', async dialog => {
        alertTriggered = true;
        await dialog.dismiss();
      });
      
      await this.page.goto(renderUrl, { 
        waitUntil: 'networkidle2', 
        timeout: 30000 
      });
      
      await this.page.waitForTimeout(2000);
      
      // Check for payload in HTML
      const pageContent = await this.page.content();
      if (pageContent.includes(payload)) {
        result.payloadRendered = true;
      }
      
      // Check for alert
      if (alertTriggered) {
        result.payloadExecuted = true;
        result.executionType = 'alert_triggered';
      }
      
      // Check for any XSS markers in window
      const hasMarker = await this.page.evaluate(() => {
        return Object.keys(window).some(k => 
          k.includes('XSS') || k.includes('xss')
        );
      });
      
      if (hasMarker) {
        result.payloadExecuted = true;
        result.executionType = 'window_property';
      }
      
    } catch (error) {
      result.error = error.message;
    }
    
    return result;
  }

  getFindings() {
    return this.findings;
  }
}

async function verifyXSSAtUrl(url, payload, options = {}) {
  let browser;
  
  try {
    browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    const page = await browser.newPage();
    
    let alertText = null;
    page.on('dialog', async dialog => {
      alertText = dialog.message();
      await dialog.dismiss();
    });
    
    await page.evaluateOnNewDocument(() => {
      window.__XSS_EXECUTED__ = false;
      const originalAlert = window.alert;
      window.alert = function(msg) {
        window.__XSS_EXECUTED__ = true;
        return originalAlert.apply(this, arguments);
      };
    });
    
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });
    await page.waitForTimeout(2000);
    
    const content = await page.content();
    const rendered = content.includes(payload);
    const executed = await page.evaluate(() => window.__XSS_EXECUTED__);
    
    return {
      url,
      payload: payload.substring(0, 100),
      rendered,
      executed: executed || alertText !== null,
      alertText,
      severity: executed ? 'CRITICAL' : (rendered ? 'HIGH' : 'LOW')
    };
    
  } finally {
    if (browser) await browser.close();
  }
}

module.exports = {
  XSSVerifier,
  XSS_VERIFICATION_PAYLOADS,
  verifyXSSAtUrl
};
