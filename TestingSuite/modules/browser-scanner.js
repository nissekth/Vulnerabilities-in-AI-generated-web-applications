#!/usr/bin/env node


const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');
const yaml = require('yaml');
const crypto = require('crypto');
const { execSync, spawn } = require('child_process');

let config = null;

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
  bgBlue: '\x1b[44m',
  bgMagenta: '\x1b[45m',
  bgYellow: '\x1b[43m'
};

function log(type, msg) {
  const prefix = {
    info: `${colors.blue}ℹ${colors.reset}`,
    success: `${colors.green}✓${colors.reset}`,
    warn: `${colors.yellow}⚠${colors.reset}`,
    error: `${colors.red}✗${colors.reset}`,
    step: `${colors.cyan}→${colors.reset}`,
    vuln: `${colors.bgRed}${colors.white} VULN ${colors.reset}`,
    safe: `${colors.bgGreen}${colors.white} SAFE ${colors.reset}`,
    test: `${colors.bgYellow}${colors.white} TEST ${colors.reset}`
  };
  console.log(`${prefix[type] || '•'} ${msg}`);
}

function header(title) {
  console.log(`\n${colors.bgMagenta}${colors.white} ${title} ${colors.reset}\n`);
}

function subHeader(title) {
  console.log(`\n${colors.cyan}── ${title} ──${colors.reset}\n`);
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

function escapeHtml(str) {
  return str.replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
}

function sha256(text) {
  return crypto.createHash('sha256').update(text || '', 'utf8').digest('hex');
}


async function stopZapDaemon() {
  const zapConf = config.scanner?.zap;
  const zapHost = zapConf?.host || 'localhost';
  const zapPort = zapConf?.port || 8080;
  const zapApiKey = zapConf?.apiKey || 'changeme';
  const zapBaseUrl = `http://${zapHost}:${zapPort}`;

  log('step', 'Stopping OWASP ZAP daemon...');

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

  try {
    await runCommand('curl', ['-s', `${zapBaseUrl}/JSON/core/action/shutdown/?apikey=${zapApiKey}`]);
    log('success', 'ZAP daemon stopped');
  } catch (err) {
    log('warn', `Failed to stop ZAP cleanly: ${err.message}`);
  }
}

async function zapApi(baseUrl, apiKey, endpoint, params = {}) {
  const queryParams = new URLSearchParams({ apikey: apiKey, ...params });
  const url = `${baseUrl}/${endpoint}?${queryParams}`;

  try {
    const response = await fetch(url);
    return await response.json();
  } catch (error) {
    log('warn', `ZAP API error: ${error.message}`);
    return {};
  }
}

async function checkZapConnection(baseUrl, apiKey) {
  try {
    const result = await zapApi(baseUrl, apiKey, 'JSON/core/view/version');
    return result.version ? true : false;
  } catch {
    return false;
  }
}

async function getZapAlerts(baseUrl, apiKey, targetUrl) {
  const result = await zapApi(baseUrl, apiKey, 'JSON/core/view/alerts', {
    baseurl: targetUrl, start: '0', count: '1000'
  });
  return result.alerts || [];
}

async function launchBrowser(zapProxy) {
  log('step', 'Launching headless Chrome...');

  const launchOptions = {
    headless: 'new',
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-web-security',
      '--disable-features=IsolateOrigins,site-per-process'
    ]
  };

  if (zapProxy) {
    launchOptions.args.push(`--proxy-server=${zapProxy}`);
    launchOptions.args.push('--ignore-certificate-errors');
    log('info', `Routing traffic through ZAP proxy: ${zapProxy}`);
  }

  const browser = await puppeteer.launch(launchOptions);
  log('success', 'Browser launched');
  return browser;
}

async function createIsolatedContext(browser) {
  if (typeof browser.createIncognitoBrowserContext === 'function') {
    return await browser.createIncognitoBrowserContext();
  }
  throw new Error('No supported browser context API found (need createIncognitoBrowserContext).');
}



async function safeGoto(page, url, timeout = 30000) {
  try {
    return await page.goto(url, { waitUntil: 'domcontentloaded', timeout });
  } catch (e) {
    try {
      return await page.goto(url, { waitUntil: 'load', timeout });
    } catch {
      return null;
    }
  }
}

async function gotoAndRead(page, url, timeout = 20000) {
  const response = await safeGoto(page, url, timeout);
  if (!response) return { response: null, status: 0, headers: {}, text: '' };

  let text = '';
  try { text = await response.text(); } catch { text = ''; }
  const headers = response.headers() || {};
  const status = response.status ? response.status() : 0;

  return { response, status, headers, text };
}

async function computeSpaFallbackFingerprint(page, targetUrl) {
  const base = targetUrl.replace(/\/$/, '');
  const randomPath = `${base}/__nonexistent__${Date.now()}_${Math.random().toString(16).slice(2)}`;

  const { status, headers, text } = await gotoAndRead(page, randomPath, 15000);
  return {
    url: randomPath,
    status,
    contentType: (headers['content-type'] || '').toLowerCase(),
    length: (text || '').length,
    hash: sha256(text || '')
  };
}

function looksLikeSpaFallback(text, ctx) {
  if (!ctx?.spaFallback?.hash) return false;
  return sha256(text || '') === ctx.spaFallback.hash;
}

function looksLikeHomeShell(text, ctx) {
  if (!ctx?.home?.hash) return false;
  return sha256(text || '') === ctx.home.hash;
}

function isLikelyHtml(headers, text) {
  const ct = (headers?.['content-type'] || '').toLowerCase();
  if (ct.includes('text/html')) return true;
  // fallback heuristic
  return (text || '').trim().startsWith('<!DOCTYPE') || (text || '').toLowerCase().includes('<html');
}

function isPrivilegedRole(role) {
  const r = String(role || '').toLowerCase();
  return r === 'admin' || r === 'owner';
}

function isDisallowedLoginUrl(url, credentials, loginConfig) {
  const allowAdminLogin = loginConfig?.allowAdminLogin === true; // opt-in
  if (allowAdminLogin) return false;

  if (isPrivilegedRole(credentials?.role)) return false;

  try {
    const u = new URL(url);
    const p = (u.pathname || '').toLowerCase();
    return p === '/admin/login' || p.startsWith('/admin/');
  } catch {
    return false;
  }
}


async function loginToFirebaseApp(page, targetUrl, credentials, loginConfig = {}) {
  let loginUrl = targetUrl;

  log('step', 'Checking for login page...');
  await safeGoto(page, targetUrl, 30000);

  const fastPathOk = await waitForPasswordField(page, 4000);
  if (fastPathOk) {
    loginUrl = page.url();
    log('success', 'Login form found on landing page (fast-path)');
  } else {
    log('info', 'No password field on landing page; attempting fallback login discovery...');
    const foundUrl = await discoverLoginForm(page, targetUrl, loginConfig, credentials);
  
    if (!foundUrl) {
      log('warn', 'Could not discover a login form via fallback strategies');
      await page.screenshot({ path: `./reports/browser-login-discovery-failed-${credentials.role || 'unknown'}.png`, fullPage: true });
      return false;
    }
  
    loginUrl = foundUrl;
    log('success', `Login form discovered at: ${loginUrl}`);
  }


/*
    if (!hasLoginForm) {
      const loginLinkSelectors = [
        'a[href*="login"]', 'a[href*="signin"]', 'a[href*="sign-in"]', 'a[href*="auth"]',
        '[data-testid="login-link"]', '.login-link', '#login-link'
      ];
    
      for (const selector of loginLinkSelectors) {
        try {
          const loginLink = await page.$(selector);
          if (loginLink) {
            await loginLink.click();
            await page.waitForTimeout(500);
            hasLoginForm = await page.$('input[type="password"]');
            if (hasLoginForm) break;
          }
        } catch {}
      }
    }
    
    if (!hasLoginForm) {
      const clicked = await clickFirstByText(page, [
        'login', 'log in', 'sign in', 'get started', 'continue', 'start'
      ]);
    
      if (clicked) {
        await waitForLoginForm(page, 15000).catch(() => {});
        hasLoginForm = await page.$('input[type="password"]');
      }
    }
*/

  if (page.url() !== loginUrl) {
    await safeGoto(page, loginUrl, 30000);
    await page.waitForTimeout(1500);
  }

  await page.screenshot({ path: `./reports/browser-login-page-${credentials.role || 'unknown'}.png` });

  const emailSelectors = loginConfig.selectors?.email
    ? [loginConfig.selectors.email]
    : [
      'input[type="email"]', 'input[name="email"]', 'input[id="email"]', 'input[placeholder*="email" i]',
      '#identifierId', 'input[autocomplete="email"]', 'input[autocomplete="username"]',
      'input[name="username"]', 'input[id="username"]'
    ];

  const passwordSelectors = loginConfig.selectors?.password
    ? [loginConfig.selectors.password]
    : ['input[type="password"]', 'input[name="password"]', 'input[id="password"]', 'input[placeholder*="password" i]', 'input[autocomplete="current-password"]'];
    
const submitSelectors = loginConfig.selectors?.submit
  ? [loginConfig.selectors.submit]
  : [
    'button[type="submit"]', 'input[type="submit"]',
    '[data-testid="login-button"]', '.login-button', '#login-button',
    'button.btn-primary', 'form button'
  ];

  let emailInput = null;
  for (const selector of emailSelectors) {
    try { emailInput = await page.$(selector); if (emailInput) break; } catch {}
  }
  
  if (!emailInput) {
    emailInput = await findInputByLabelText(page, ['email', 'e-mail'], { allowPassword: false });
  }


  if (!emailInput) {
    log('warn', 'Could not find email input field');
    await page.screenshot({ path: './reports/browser-login-failed.png', fullPage: true });
    return false;
  }

  let passwordInput = null;
  for (const selector of passwordSelectors) {
    try { passwordInput = await page.$(selector); if (passwordInput) break; } catch {}
  }
  
   
  if (!passwordInput) {
    passwordInput = await findInputByLabelText(page, ['password', 'pass', 'pwd', 'lösenord'], { allowPassword: true });
  }

  if (!passwordInput) {
    log('warn', 'Could not find password input field');
    return false;
  }

  // Record pre-login state for heuristic verification
  const preUrl = page.url();
  const preHadPassword = !!(await page.$('input[type="password"]'));

  log('step', `Entering credentials for ${credentials.email} (${credentials.role})...`);
await emailInput.evaluate(el => { el.focus(); el.value = ''; });
await page.keyboard.type(credentials.email, { delay: 30 });
await passwordInput.evaluate(el => { el.focus(); el.value = ''; });
await page.keyboard.type(credentials.password, { delay: 30 });


  let submitButton = null;
  for (const selector of submitSelectors) {
    try {
      submitButton = await page.$(selector);
      if (submitButton) {
        const isVisible = await submitButton.evaluate(el => {
          const style = window.getComputedStyle(el);
          return style.display !== 'none' && style.visibility !== 'hidden' && !el.disabled;
        });
        if (isVisible) break;
        submitButton = null;
      }
    } catch {}
  }

  if (submitButton) {
    await submitButton.click();
  } else {
    const clickedSubmit = await clickFirstByText(page, ['sign in', 'login', 'log in', 'continue', 'get started']);
    if (!clickedSubmit) {
      await page.keyboard.press('Enter');
    }
  }

  await page.waitForTimeout(3500);

  await page.screenshot({ path: `./reports/browser-after-login-${credentials.role || 'unknown'}.png` });

  const verifySelector = loginConfig.verify?.loggedInSelector;
  if (verifySelector) {
    const ok = await page.$(verifySelector);
    if (ok) {
      log('success', 'Login verified via configured logged-in selector');
      return true;
    }
    log('warn', 'Login verification failed: logged-in selector not found');
    await page.screenshot({ path: `./reports/browser-login-verify-failed-${credentials.role || 'unknown'}.png`, fullPage: true });
    return false;
  }

  const postUrl = page.url();
  const postHasPassword = !!(await page.$('input[type="password"]'));
  const urlLooksLikeLogin = /login|signin|sign-in|authenticate|auth/i.test(postUrl);

  if (preHadPassword && postHasPassword && urlLooksLikeLogin && postUrl === preUrl) {
    log('warn', 'Login likely failed (still on login page with password field)');
    return false;
  }

  log('success', `Login appears successful (URL: ${postUrl})`);
  return true;
}

async function clickFirstByText(page, keywords) {
  const kw = keywords.map(k => k.toLowerCase());

  const mkXpath = (tag) =>
    `//${tag}[normalize-space(.) != '' and (${kw
      .map(k =>
        `contains(translate(normalize-space(.),
          'ABCDEFGHIJKLMNOPQRSTUVWXYZ','abcdefghijklmnopqrstuvwxyz'),'${k}')`
      )
      .join(' or ')})]`;

  const candidates = [
    ...(await page.$x(mkXpath('button'))),
    ...(await page.$x(mkXpath('a'))),
    ...(await page.$x(`//*[@role="button" and normalize-space(.) != '' and (${kw
      .map(k =>
        `contains(translate(normalize-space(.),
          'ABCDEFGHIJKLMNOPQRSTUVWXYZ','abcdefghijklmnopqrstuvwxyz'),'${k}')`
      )
      .join(' or ')})]`)),
  ];

  for (const el of candidates) {
    try {
      await el.evaluate(e => e.scrollIntoView({ block: 'center', inline: 'center' }));
      await el.click({ delay: 25 });
      return true;
    } catch {}
  }
  return false;
}

async function waitForLoginForm(page, timeout = 15000) {
  await page.waitForFunction(() => {
    const pwd = document.querySelector('input[type="password"]');
    const user =
      document.querySelector('input[type="email"]') ||
      document.querySelector('input[name*="email" i]') ||
      document.querySelector('input[autocomplete="email"]') ||
      document.querySelector('input[autocomplete="username"]') ||
      document.querySelector('input[name*="user" i]');

    return !!(pwd && user);
  }, { timeout });
}

async function hasPasswordField(page) {
  try { return !!(await page.$('input[type="password"]')); } catch { return false; }
}

async function waitForPasswordField(page, timeout = 4000) {
  try {
    await page.waitForSelector('input[type="password"]', { visible: true, timeout });
    return true;
  } catch {
    return false;
  }
}

async function clickAndWaitForLogin(page, elHandle, timeout = 15000) {
  const preUrl = page.url();

  const waitPwd = page.waitForSelector('input[type="password"]', { visible: true, timeout }).catch(() => null);
  const waitUrlChange = page.waitForFunction(
    (u) => location.href !== u,
    { timeout },
    preUrl
  ).catch(() => null);
  const waitNav = page.waitForNavigation({ waitUntil: 'domcontentloaded', timeout }).catch(() => null);

  try {
    await elHandle.evaluate(e => e.scrollIntoView({ block: 'center', inline: 'center' }));
    await elHandle.click({ delay: 25 });
  } catch {
    try { await elHandle.evaluate(e => e.click()); } catch {}
  }

  await Promise.race([waitPwd, waitUrlChange, waitNav]);

  // Covers delayed rendering / modals
  await waitForLoginForm(page, timeout).catch(() => {});
  return !!(await page.$('input[type="password"]'));
}

async function findFirstInFrames(page, selectors) {
  const frames = page.frames();
  for (const frame of frames) {
    for (const sel of selectors) {
      try {
        const el = await frame.$(sel);
        if (el) return { frame, el, selector: sel };
      } catch {}
    }
  }
  return null;
}

async function findInputByLabelText(page, labelKeywords = [], opts = {}) {
  const { allowPassword = false } = opts;

  const kw = (labelKeywords || []).map(s => String(s).toLowerCase()).filter(Boolean);
  if (!kw.length) return null;

  const frames = page.frames();

  for (const frame of frames) {
    try {
      const handle1 = await frame.evaluateHandle((keywords, allowPwd) => {
        const norm = (s) => (s || '').replace(/\s+/g, ' ').trim().toLowerCase();
        const labels = Array.from(document.querySelectorAll('label'));

        for (const lab of labels) {
          const txt = norm(lab.innerText || lab.textContent || '');
          if (!txt) continue;
          if (!keywords.some(k => txt.includes(k))) continue;

          const inp = lab.querySelector('input, textarea, select');
          if (!inp) continue;

          if (inp.tagName.toLowerCase() === 'input') {
            const t = (inp.getAttribute('type') || '').toLowerCase();
            if (!allowPwd && t === 'password') continue;
          }
          return inp;
        }
        return null;
      }, kw, allowPassword);

      const el1 = handle1.asElement();
      if (el1) {
        const box = await el1.boundingBox().catch(() => null);
        if (box) return el1;
      }

      const handle2 = await frame.evaluateHandle((keywords, allowPwd) => {
        const norm = (s) => (s || '').replace(/\s+/g, ' ').trim().toLowerCase();
        const labels = Array.from(document.querySelectorAll('label[for]'));

        for (const lab of labels) {
          const txt = norm(lab.innerText || lab.textContent || '');
          if (!txt) continue;
          if (!keywords.some(k => txt.includes(k))) continue;

          const id = lab.getAttribute('for');
          if (!id) continue;

          const el = document.getElementById(id);
          if (!el) continue;

          const tag = el.tagName.toLowerCase();
          if (tag === 'input') {
            const t = (el.getAttribute('type') || '').toLowerCase();
            if (!allowPwd && t === 'password') continue;
            return el;
          }
          if (tag === 'textarea' || tag === 'select') return el;
        }
        return null;
      }, kw, allowPassword);

      const el2 = handle2.asElement();
      if (el2) {
        const box = await el2.boundingBox().catch(() => null);
        if (box) return el2;
      }
    } catch {}
  }

  return null;
}




async function discoverLoginForm(page, targetUrl, loginConfig = {}, credentials = {}) {
  if (loginConfig.loginPath) {
    const loginUrl = new URL(loginConfig.loginPath, targetUrl).href;
    if (!isDisallowedLoginUrl(loginUrl, credentials, loginConfig)) {
      await safeGoto(page, loginUrl, 30000);
      if (await waitForPasswordField(page, 6000)) 
        return page.url();
    }
  }

  await safeGoto(page, targetUrl, 30000);
  await page.waitForTimeout(500);

  const candidateSelectors = [
    'a[href*="login" i]', 'a[href*="signin" i]', 'a[href*="sign-in" i]', 'a[href*="auth" i]',
    '[data-testid*="login" i]', '[data-testid*="signin" i]',
    '.login, .login-link, #login-link'
  ];

  for (const sel of candidateSelectors) {
    const el = await page.$(sel).catch(() => null);
    if (!el) continue;
    
    try {
      const tag = await el.evaluate(n => (n.tagName || '').toLowerCase());
      if (tag === 'a') {
        const href = await el.evaluate(a => a.getAttribute('href') || '');
        if (href) {
          const abs = new URL(href, page.url()).href;
          if (isDisallowedLoginUrl(abs, credentials, loginConfig)) continue;
        }
      }
    } catch {}


    const ok = await clickAndWaitForLogin(page, el, 15000);
 
    if (isDisallowedLoginUrl(page.url(), credentials, loginConfig)) {
      await safeGoto(page, targetUrl, 15000);
      continue;
    }
    
    if (ok) return page.url();
  }

  const clicked = await clickFirstByText(page, [
    'sign in', 'signin', 'sign-in',
    'log in', 'login',
    'continue', 'account',
    'get started', 'go to login'
  ]);

  if (clicked) {
    await waitForLoginForm(page, 15000).catch(() => {});
    if (await hasPasswordField(page)) return page.url();
  }

  const commonLoginPaths = ['/login', '/signin', '/sign-in', '/auth', '/auth/login', '/account/login', '/user/login', '/authenticate'];

for (const p of commonLoginPaths) {
  const testUrl = new URL(p, targetUrl).href;

  if (isDisallowedLoginUrl(testUrl, credentials, loginConfig)) continue;

  await safeGoto(page, testUrl, 15000);
  await page.waitForTimeout(400);
  if (await hasPasswordField(page)) return page.url();
}

  
try {
  const hit = await findFirstInFrames(page, [
    'a[href="/login"]',
    'a[href^="/login?"]',
    'a[href*="/login"]'
  ]);

  if (hit?.el) {
    const ok = await clickAndWaitForLogin(page, hit.el, 15000);
    if (ok) return page.url();
  }
} catch {}


  return null;
}



async function logout(page, targetUrl) {
  log('step', 'Logging out...');

  const logoutSelectors = [
    'a[href*="logout"]', 'a[href*="signout"]',
    'button[aria-label="Logout"]', 'button[aria-label="Sign out"]',
    'button:has-text("Logout")', 'button:has-text("Sign out")',
    '[data-testid="logout-button"]'
  ];

  for (const selector of logoutSelectors) {
    try {
      const logoutBtn = await page.$(selector);
      if (logoutBtn) {
        await logoutBtn.click();
        await page.waitForTimeout(1500);
        log('success', 'Logged out via button');
        return true;
      }
    } catch {}
  }

  // clear browser storage/cookies
  try {
    const client = await page.target().createCDPSession();
    await client.send('Network.clearBrowserCookies');
    await client.send('Network.clearBrowserCache');
  } catch {}

  await page.evaluate(async () => {
    try { localStorage.clear(); sessionStorage.clear(); } catch {}
    try {
      const regs = await navigator.serviceWorker.getRegistrations();
      for (const r of regs) { try { await r.unregister(); } catch {} }
    } catch {}
    try {
      const keys = await caches.keys();
      for (const k of keys) { try { await caches.delete(k); } catch {} }
    } catch {}
  });
  await safeGoto(page, targetUrl, 30000);
  log('success', 'Logged out by clearing session');
  return true;
}

async function navigateApp(page, config) {
  log('step', 'Navigating through application...');

  const targetUrl = config.app.url;
  const routes = config.scanner?.browserScan?.routes || ['/', '/home', '/profile', '/settings', '/posts', '/messages', '/users', '/feed', '/dashboard'];

  let visitedUrls = new Set();
  visitedUrls.add(page.url());

  for (const route of routes) {
    const fullUrl = new URL(route, targetUrl).href;
    if (!visitedUrls.has(fullUrl)) {
      try {
        await safeGoto(page, fullUrl, 20000);
        visitedUrls.add(fullUrl);
        await page.waitForTimeout(700);
      } catch {}
    }
  }

  let links = [];
  try {
    links = await page.$$eval('a[href]', anchors => anchors.map(a => a.href).filter(href => href && !href.startsWith('javascript:')));
  } catch {}

  const baseUrlObj = new URL(targetUrl);
  const internalLinks = links.filter(link => { try { return new URL(link).hostname === baseUrlObj.hostname; } catch { return false; } });

  for (const link of internalLinks.slice(0, 20)) {
    if (!visitedUrls.has(link)) {
      try {
        await safeGoto(page, link, 15000);
        visitedUrls.add(link);
        await page.waitForTimeout(500);
      } catch {}
    }
  }

  log('success', `Visited ${visitedUrls.size} unique URLs`);
  return visitedUrls;
}

async function testA01_BrokenAccessControl(page, config, accountData, allAccountsData, ctx) {
  header('A01 - BROKEN ACCESS CONTROL TESTS');

  const findings = [];
  const targetUrl = config.app.url;

  subHeader('Test A01-1: Path Traversal (CWE-22, CWE-23, CWE-35)');

  const pathTraversalPayloads = [
    '../../../etc/passwd',
    '..\\..\\..\\windows\\win.ini',
    '....//....//....//etc/passwd',
    '..%2f..%2f..%2fetc/passwd',
    '%2e%2e%2f%2e%2e%2f%2e%2e%2fetc/passwd'
  ];

  const pathParams = ['file', 'path', 'filepath', 'document', 'doc', 'page', 'template', 'include', 'dir', 'folder', 'load', 'read'];

  for (const param of pathParams) {
    for (const payload of pathTraversalPayloads.slice(0, 4)) {
      const testUrl = `${targetUrl}?${param}=${encodeURIComponent(payload)}`;
      try {
        const { status, headers, text } = await gotoAndRead(page, testUrl, 12000);
        if (!text) continue;


        if (looksLikeSpaFallback(text, ctx) || looksLikeHomeShell(text, ctx)) continue;

        if (text.includes('root:') || text.includes('[extensions]') || text.includes('daemon:') || text.includes('[fonts]')) {
          findings.push({
            type: 'A01-PATH-TRAVERSAL',
            cwe: 'CWE-22',
            severity: 'CRITICAL',
            title: 'Path Traversal Vulnerability',
            description: `Path traversal indicators via "${param}" parameter`,
            url: testUrl,
            evidence: 'Sensitive file markers in response'
          });
          log('vuln', `Path traversal indicators via ${param}`);
        }
      } catch {}
    }
  }

  const inputs = await page.$$('input[type="text"], input:not([type]), textarea');
  for (const input of inputs.slice(0, 3)) {
    for (const payload of pathTraversalPayloads.slice(0, 2)) {
      try {
        await input.click({ clickCount: 3 });
        await input.type(payload);
        await page.keyboard.press('Enter');
        await page.waitForTimeout(600);

        const content = await page.content();
        if (content.includes('root:') || content.includes('[extensions]')) {
          findings.push({
            type: 'A01-PATH-TRAVERSAL-INPUT',
            cwe: 'CWE-22',
            severity: 'CRITICAL',
            title: 'Path Traversal via Input Field',
            description: 'Path traversal markers appeared after submitting payload',
            url: page.url(),
            evidence: payload.substring(0, 30)
          });
          log('vuln', 'Path traversal markers via input field');
        }

        await input.click({ clickCount: 3 });
        await page.keyboard.press('Backspace');
      } catch {}
    }
  }

  await safeGoto(page, targetUrl, 30000);

  subHeader('Test A01-2: Sensitive Information Exposure (CWE-200, CWE-201, CWE-359)');

  const pageContent = await page.content();

  const piiPatterns = [
    { pattern: /\b\d{3}-\d{2}-\d{4}\b/g, name: 'SSN', cwe: 'CWE-359' },
    { pattern: /\b\d{4}[\s-]?\d{4}[\s-]?\d{4}[\s-]?\d{4}\b/g, name: 'Credit Card', cwe: 'CWE-359' },
    { pattern: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g, name: 'Email (potential exposure)', cwe: 'CWE-200' },
    { pattern: /password\s*[:=]\s*['"]?[^'"\s]+['"]?/gi, name: 'Hardcoded Password', cwe: 'CWE-200' },
    { pattern: /api[_-]?key\s*[:=]\s*['"]?[A-Za-z0-9_-]{20,}['"]?/gi, name: 'API Key', cwe: 'CWE-200' },
    { pattern: /bearer\s+[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+/gi, name: 'JWT Token', cwe: 'CWE-200' },
    { pattern: /private[_-]?key/gi, name: 'Private Key Reference', cwe: 'CWE-200' }
  ];

  for (const pii of piiPatterns) {
    const matches = pageContent.match(pii.pattern);
    if (matches && matches.length > 0) {
      const validMatches = matches.filter(m => !m.includes('example') && !m.includes('test@'));
      if (validMatches.length > 0) {
        const severity =
          pii.name.includes('SSN') || pii.name.includes('Credit') ? 'CRITICAL'
          : pii.name.includes('JWT') || pii.name.includes('API Key') || pii.name.includes('Password') ? 'HIGH'
          : 'LOW';

        findings.push({
          type: 'A01-SENSITIVE-EXPOSURE',
          cwe: pii.cwe,
          severity,
          title: `${pii.name} Found in Page Content`,
          description: `Found ${validMatches.length} potential ${pii.name} matches in DOM content`,
          url: page.url(),
          evidence: `Pattern: ${pii.name}`
        });

        if (severity === 'HIGH' || severity === 'CRITICAL') log('vuln', `Sensitive data marker: ${pii.name}`);
        else log('warn', `Potential PII marker: ${pii.name}`);
      }
    }
  }

  subHeader('Test A01-3: System Information Exposure (CWE-497)');

  const systemInfoPatterns = [
    { pattern: /stack\s*trace|traceback|exception/gi, name: 'Stack Trace' },
    { pattern: /PHP\s+(Warning|Error|Notice)/gi, name: 'PHP Error' },
    { pattern: /at\s+[\w\.]+\([\w\.]+:\d+\)/g, name: 'Java Stack Trace' },
    { pattern: /File\s+"[^"]+",\s+line\s+\d+/g, name: 'Python Traceback' },
    { pattern: /Microsoft\s+OLE\s+DB|ODBC|SQL\s+Server/gi, name: 'Database Error' },
    { pattern: /Version:\s*[\d\.]+/gi, name: 'Version Disclosure' },
    { pattern: /Server:\s*(Apache|nginx|IIS)[\s\/][\d\.]+/gi, name: 'Server Version' }
  ];

  for (const sysInfo of systemInfoPatterns) {
    if (sysInfo.pattern.test(pageContent)) {
      findings.push({
        type: 'A01-SYSTEM-INFO-EXPOSURE',
        cwe: 'CWE-497',
        severity: 'MEDIUM',
        title: `${sysInfo.name} Exposed`,
        description: `System information marker detected: ${sysInfo.name}`,
        url: page.url(),
        evidence: sysInfo.name
      });
      log('warn', `System info marker: ${sysInfo.name}`);
    }
    sysInfo.pattern.lastIndex = 0;
  }

  subHeader('Test A01-4: Directory Listing (CWE-548)');

  const directoryPaths = ['/', '/images/', '/uploads/', '/files/', '/assets/', '/static/', '/media/', '/backup/', '/logs/', '/tmp/', '/data/'];

  for (const dirPath of directoryPaths) {
    const testUrl = new URL(dirPath, targetUrl).href;
    try {
      const { status, headers, text } = await gotoAndRead(page, testUrl, 15000);
      if (status !== 200 || !text) continue;
      if (looksLikeSpaFallback(text, ctx) || looksLikeHomeShell(text, ctx)) continue;

      const hasIndexTitle = /<title>\s*Index of\s*\/?/i.test(text);
      const hasParentDir = /Parent Directory|To Parent Directory|\[To Parent Directory\]/i.test(text);
      const looksApacheListing = /<pre>.*<a href="[^"]+">/is.test(text) && /<\/pre>/i.test(text);

      if (hasIndexTitle && (hasParentDir || looksApacheListing)) {
        findings.push({
          type: 'A01-DIRECTORY-LISTING',
          cwe: 'CWE-548',
          severity: 'MEDIUM',
          title: 'Directory Listing Enabled',
          description: `Directory listing indicators at ${dirPath}`,
          url: testUrl,
          evidence: 'Index-of listing patterns detected'
        });
        log('warn', `Directory listing indicators at: ${dirPath}`);
      }
    } catch {}
  }

  await safeGoto(page, targetUrl, 30000);

  subHeader('Test A01-5: IDOR (CWE-639)');

  const idorPatterns = [
    /\/users?\/([a-zA-Z0-9_-]+)/, /\/profiles?\/([a-zA-Z0-9_-]+)/,
    /\/posts?\/([a-zA-Z0-9_-]+)/, /\/messages?\/([a-zA-Z0-9_-]+)/,
    /\/documents?\/([a-zA-Z0-9_-]+)/, /[?&]id=([a-zA-Z0-9_-]+)/,
    /[?&]userId=([a-zA-Z0-9_-]+)/, /[?&]uid=([a-zA-Z0-9_-]+)/
  ];

  const currentUrl = page.url();
  const otherUserIds = allAccountsData.filter(a => a.id !== accountData.id).map(a => a.id);

  for (const pattern of idorPatterns) {
    const match = currentUrl.match(pattern);
    if (match) {
      for (const otherId of otherUserIds) {
        const testUrl = currentUrl.replace(match[1], otherId);
        try {
          const { status, headers, text } = await gotoAndRead(page, testUrl, 15000);
          if (status !== 200 || !text) continue;

          // Ignore SPA fallback / home shell
          if (looksLikeSpaFallback(text, ctx) || looksLikeHomeShell(text, ctx)) continue;

          const idReferenced = text.includes(otherId);
          const blocked = /unauthorized|forbidden|access denied/i.test(text);

          if (!blocked && (idReferenced || text.length > 3000)) {
            findings.push({
              type: 'A01-IDOR',
              cwe: 'CWE-639',
              severity: 'HIGH',
              title: 'Potential Insecure Direct Object Reference (IDOR)',
              description: `User ${accountData.role} may access resource for ID: ${otherId}`,
              url: testUrl,
              evidence: idReferenced ? `Body contains otherId: ${otherId}` : `Non-fallback 200 response (len=${text.length})`
            });
            log('vuln', `Potential IDOR: ${accountData.role} -> ${otherId}`);
          }
        } catch {}
      }
    }
  }

  await safeGoto(page, targetUrl, 30000);

  subHeader('Test A01-6: Privilege Escalation (CWE-862, CWE-863)');

  const adminPaths = [
    '/admin', '/admin/', '/admin/dashboard', '/admin/users', '/admin/settings',
    '/administrator', '/manage', '/management', '/console', '/panel',
    '/backoffice', '/backend', '/dashboard/admin', '/api/admin', '/api/users'
  ];

  const adminMarkers = config.scanner?.browserScan?.admin?.markers || ['admin', 'manage users', 'user management', 'administration'];

  for (const adminPath of adminPaths) {
    const testUrl = new URL(adminPath, targetUrl).href;
    try {
      const { status, headers, text } = await gotoAndRead(page, testUrl, 15000);
      if (status !== 200 || !text) continue;
      if (looksLikeSpaFallback(text, ctx) || looksLikeHomeShell(text, ctx)) continue;

      const bodyLower = text.toLowerCase();
      const markerHit = adminMarkers.some(m => bodyLower.includes(String(m).toLowerCase()));

      if (accountData.role !== 'admin' && accountData.role !== 'owner') {
        if (markerHit) {
          findings.push({
            type: 'A01-PRIVILEGE-ESCALATION',
            cwe: 'CWE-862',
            severity: 'HIGH',
            title: 'Potential Missing Authorization on Admin Route',
            description: `Non-admin (${accountData.role}) received non-fallback content at admin path`,
            url: testUrl,
            evidence: `Marker hit; status=200; content-type=${headers['content-type'] || 'unknown'}`
          });
          log('vuln', `Potential admin access: ${accountData.role} -> ${adminPath}`);
        }
      }
    } catch {}
  }

  await safeGoto(page, targetUrl, 30000);

  subHeader('Test A01-7: Forced Browsing (CWE-425, CWE-219, CWE-538, CWE-552)');

  const sensitiveFiles = [
    '/.git/config', '/.git/HEAD', '/.env', '/.env.local', '/.env.production',
    '/config.json', '/config.yaml', '/config.yml', '/firebase.json',
    '/package.json', '/package-lock.json', '/composer.json', '/composer.lock',
    '/webpack.config.js', '/tsconfig.json', '/.htaccess', '/.htpasswd',
    '/robots.txt', '/sitemap.xml', '/crossdomain.xml', '/clientaccesspolicy.xml',
    '/web.config', '/phpinfo.php', '/info.php', '/test.php',
    '/backup.zip', '/backup.tar.gz', '/backup.sql', '/dump.sql', '/db.sql',
    '/server-status', '/server-info', '/.DS_Store', '/Thumbs.db',
    '/WEB-INF/web.xml', '/META-INF/MANIFEST.MF',
    '/.svn/entries', '/.svn/wc.db', '/.hg/hgrc',
    '/admin.html', '/administrator.html', '/login.html',
    '/id_rsa', '/id_rsa.pub', '/.ssh/authorized_keys',
    '/credentials.json', '/secrets.json', '/keys.json'
  ];

  for (const file of sensitiveFiles) {
    const testUrl = new URL(file, targetUrl).href;
    try {
      const { status, headers, text } = await gotoAndRead(page, testUrl, 15000);
      if (status !== 200 || !text) continue;

      if (looksLikeSpaFallback(text, ctx) || looksLikeHomeShell(text, ctx)) continue;

      const ct = (headers['content-type'] || '').toLowerCase();
      const htmlLike = isLikelyHtml(headers, text);

      const envLike = /(^|\n)\s*[A-Z0-9_]+\s*=\s*.+/m.test(text);
      const gitLike = /(\[core\]|\brepositoryformatversion\b|\bref:\s*refs\/)/i.test(text);
      const jsonLike = (() => { try { JSON.parse(text); return true; } catch { return false; } })();

      const strongMarker =
        envLike ||
        gitLike ||
        text.includes('-----BEGIN') ||
        /private[_-]?key/i.test(text) ||
        /firebase/i.test(text) && jsonLike;

      if ((!htmlLike && (ct.includes('text/plain') || ct.includes('application/json') || ct.includes('application/octet-stream'))) || strongMarker) {
        findings.push({
          type: 'A01-FORCED-BROWSING',
          cwe: 'CWE-425',
          severity: file.includes('.env') || /id_rsa|key|secret|credential/i.test(file) ? 'CRITICAL' : 'HIGH',
          title: 'Sensitive File Potentially Exposed',
          description: `Non-fallback 200 response for ${file}`,
          url: testUrl,
          evidence: `content-type=${ct || 'unknown'}; markers=${strongMarker ? 'yes' : 'no'}; len=${text.length}`
        });
        log('vuln', `Sensitive file markers: ${file}`);
      }
    } catch {}
  }

  await safeGoto(page, targetUrl, 30000);

  subHeader('Test A01-8: API Documentation Exposure (CWE-651)');

  const apiDocPaths = [
    '/api-docs', '/swagger', '/swagger-ui', '/swagger-ui.html', '/swagger.json', '/swagger.yaml',
    '/openapi', '/openapi.json', '/openapi.yaml', '/api/docs', '/api/swagger',
    '/v1/api-docs', '/v2/api-docs', '/v3/api-docs', '/graphql', '/graphiql',
    '/?wsdl', '/service?wsdl', '/api?wsdl', '/ws?wsdl',
    '/redoc', '/api-explorer', '/developer', '/developers'
  ];

  for (const apiPath of apiDocPaths) {
    const testUrl = new URL(apiPath, targetUrl).href;
    try {
      const { status, headers, text } = await gotoAndRead(page, testUrl, 15000);
      if (status !== 200 || !text) continue;

      if (looksLikeSpaFallback(text, ctx) || looksLikeHomeShell(text, ctx)) continue;

      const ct = (headers['content-type'] || '').toLowerCase();
      const docMarkers =
        /swagger|openapi|redoc|graphql|graphiql|wsdl/i.test(text) ||
        /"openapi"\s*:\s*"\d+\.\d+"/i.test(text);

      // Demand some combination of doc markers + plausible content type or non-HTML
      const plausible =
        docMarkers && (ct.includes('application/json') || ct.includes('yaml') || ct.includes('application/yaml') || ct.includes('text/yaml') || !isLikelyHtml(headers, text));

      if (plausible) {
        findings.push({
          type: 'A01-API-DOC-EXPOSURE',
          cwe: 'CWE-651',
          severity: 'MEDIUM',
          title: 'API Documentation Potentially Exposed',
          description: `API documentation markers found at ${apiPath}`,
          url: testUrl,
          evidence: `content-type=${ct || 'unknown'}; markers=swagger/openapi/graphql/wsdl`
        });
        log('warn', `API docs markers: ${apiPath}`);
      }
    } catch {}
  }

  await safeGoto(page, targetUrl, 30000);
  subHeader('Test A01-9: CSRF (CWE-352)');

  const forms = await page.$$eval('form', forms => forms.map(f => ({
    action: f.action,
    method: f.method,
    hasCSRF: !!f.querySelector('input[name*="csrf" i], input[name*="token" i], input[name="_token"], input[name="authenticity_token"]')
  })));

  for (const form of forms) {
    if (String(form.method || '').toUpperCase() === 'POST' && !form.hasCSRF) {
      findings.push({
        type: 'A01-CSRF',
        cwe: 'CWE-352',
        severity: 'MEDIUM',
        title: 'Missing CSRF Token',
        description: 'POST form found without CSRF protection (DOM-based heuristic)',
        url: form.action || page.url(),
        evidence: `Form method: ${form.method}`
      });
      log('warn', `Form without CSRF token: ${form.action || '(same page)'}`);
    }
  }

  subHeader('Test A01-10: Cookie SameSite (CWE-1275)');

  const cookies = await page.cookies();
  for (const cookie of cookies) {
    if (!cookie.sameSite || cookie.sameSite === 'None') {
      findings.push({
        type: 'A01-COOKIE-SAMESITE',
        cwe: 'CWE-1275',
        severity: 'LOW',
        title: 'Cookie Missing SameSite Attribute',
        description: `Cookie "${cookie.name}" lacks proper SameSite attribute`,
        url: page.url(),
        evidence: `SameSite: ${cookie.sameSite || 'Not set'}`
      });
    }
  }

  subHeader('Test A01-11: SSRF (CWE-441)');

  const ssrfParams = ['url', 'uri', 'path', 'src', 'source', 'link', 'href', 'dest', 'redirect', 'site', 'html', 'feed', 'host', 'domain'];
  const ssrfPayloads = [
    'http://127.0.0.1:22',
    'http://169.254.169.254/latest/meta-data/',
    'http://metadata.google.internal/computeMetadata/v1/'
  ];

  for (const param of ssrfParams) {
    for (const payload of ssrfPayloads.slice(0, 2)) {
      const testUrl = `${targetUrl}?${param}=${encodeURIComponent(payload)}`;
      try {
        const { status, headers, text } = await gotoAndRead(page, testUrl, 15000);
        if (status !== 200 || !text) continue;

        if (looksLikeSpaFallback(text, ctx) || looksLikeHomeShell(text, ctx)) continue;

        // Only strong indicators (no timing-based inference)
        const strongIndicators =
          /ami-id|instance-id|metadata|computeMetadata/i.test(text) ||
          /SSH-|root:|daemon:/i.test(text);

        if (strongIndicators) {
          findings.push({
            type: 'A01-SSRF',
            cwe: 'CWE-441',
            severity: 'HIGH',
            title: 'Potential SSRF Vulnerability',
            description: `SSRF markers found via "${param}" parameter`,
            url: testUrl,
            evidence: `Markers suggest internal resource access`
          });
          log('vuln', `Potential SSRF markers via ${param}`);
        }
      } catch {}
    }
  }

  await safeGoto(page, targetUrl, 30000);

  subHeader('Test A01-12: Prototype Pollution (CWE-913)');

  const prototypePollutionPayloads = [
    '__proto__[polluted]=true',
    'constructor[prototype][polluted]=true',
    '__proto__.polluted=true'
  ];

  for (const payload of prototypePollutionPayloads) {
    const testUrl = `${targetUrl}?${payload}`;
    try {
      await safeGoto(page, testUrl, 15000);

      const polluted = await page.evaluate(() => {
        return {}.polluted === 'true' || {}.polluted === true;
      });

      if (polluted) {
        findings.push({
          type: 'A01-PROTOTYPE-POLLUTION',
          cwe: 'CWE-913',
          severity: 'HIGH',
          title: 'Prototype Pollution Vulnerability',
          description: 'Object prototype appears polluted via URL parameters',
          url: testUrl,
          evidence: 'Object.prototype.polluted = true'
        });
        log('vuln', 'Prototype pollution successful');
      }
    } catch {}
  }

  await safeGoto(page, targetUrl, 30000);
  subHeader('Test A01-13: Open Redirect (CWE-601)');

  const base = new URL(targetUrl);
  const baseOrigin = base.origin;

  const redirectParams = ['redirect', 'url', 'next', 'return', 'returnUrl', 'goto', 'target', 'dest', 'destination', 'rurl', 'return_to', 'continue', 'forward', 'out', 'view'];


  const canaryHost = 'example.com';
  const redirectPayloads = [
    `https://${canaryHost}/open-redirect-canary`,
    `//${canaryHost}/open-redirect-canary`,
    `////${canaryHost}/open-redirect-canary`
  ];

  function isExternal(finalUrl) {
    try {
      const u = new URL(finalUrl);
      return u.origin !== baseOrigin;
    } catch {
      return false;
    }
  }

  for (const param of redirectParams) {
    for (const payload of redirectPayloads.slice(0, 3)) {
      const testUrl = `${targetUrl}?${param}=${encodeURIComponent(payload)}`;
      try {
        await safeGoto(page, testUrl, 15000);
        await page.waitForNavigation({ waitUntil: 'domcontentloaded', timeout: 2000 }).catch(() => null);

        const finalUrl = page.url();

        // Only flag if browser actually left origin
        if (isExternal(finalUrl)) {
          findings.push({
            type: 'A01-OPEN-REDIRECT',
            cwe: 'CWE-601',
            severity: 'MEDIUM',
            title: 'Open Redirect Vulnerability',
            description: `Redirected off-site via "${param}" parameter`,
            url: testUrl,
            evidence: `Final URL: ${finalUrl}`
          });
          log('vuln', `Open redirect via: ${param}`);
        }
      } catch {}
      finally {
        await safeGoto(page, targetUrl, 30000);
      }
    }
  }

  if (findings.length === 0) {
    log('safe', 'No A01 vulnerabilities found');
  }

  return findings;
}


async function testA02_CryptographicFailures(page, config) {
  header('A02 - CRYPTOGRAPHIC FAILURES TESTS');

  const findings = [];
  const targetUrl = config.app.url;

  subHeader('Test A02-1: Cookie Security (CWE-614, CWE-1004)');

  const cookies = await page.cookies();
  const sessionCookieNames = ['session', 'sid', 'auth', 'token', 'jwt', 'access_token', 'refresh_token', 'id_token'];

  for (const cookie of cookies) {
    const isSessionCookie = sessionCookieNames.some(name => cookie.name.toLowerCase().includes(name));

    if (!cookie.secure && targetUrl.startsWith('https')) {
      findings.push({
        type: 'A02-INSECURE-COOKIE',
        cwe: 'CWE-614',
        severity: 'MEDIUM',
        title: 'Cookie Missing Secure Flag',
        description: `Cookie "${cookie.name}" transmitted over HTTPS but lacks Secure flag`,
        url: targetUrl,
        evidence: `Cookie: ${cookie.name}`
      });
      log('warn', `Cookie without Secure flag: ${cookie.name}`);
    }

    if (isSessionCookie && !cookie.httpOnly) {
      findings.push({
        type: 'A02-HTTPONLY-MISSING',
        cwe: 'CWE-1004',
        severity: 'MEDIUM',
        title: 'Session Cookie Missing HttpOnly',
        description: `Session cookie "${cookie.name}" accessible via JavaScript`,
        url: targetUrl,
        evidence: `Cookie: ${cookie.name}`
      });
      log('warn', `Session cookie without HttpOnly: ${cookie.name}`);
    }
  }
  subHeader('Test A02-2: Sensitive Data in Storage (CWE-922)');

  const storageData = await page.evaluate(() => {
    const data = { localStorage: {}, sessionStorage: {} };
    try {
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        data.localStorage[key] = localStorage.getItem(key);
      }
    } catch {}
    try {
      for (let i = 0; i < sessionStorage.length; i++) {
        const key = sessionStorage.key(i);
        data.sessionStorage[key] = sessionStorage.getItem(key);
      }
    } catch {}
    return data;
  });

  const sensitivePatterns = [
    { pattern: /password/i, name: 'password' },
    { pattern: /secret/i, name: 'secret' },
    { pattern: /api[_-]?key/i, name: 'API key' },
    { pattern: /private[_-]?key/i, name: 'private key' },
    { pattern: /access[_-]?token/i, name: 'access token' },
    { pattern: /auth[_-]?token/i, name: 'auth token' },
    { pattern: /credit[_-]?card/i, name: 'credit card' },
    { pattern: /ssn|social[_-]?security/i, name: 'SSN' },
    { pattern: /bearer/i, name: 'bearer token' }
  ];

  for (const storage of ['localStorage', 'sessionStorage']) {
    for (const [key, value] of Object.entries(storageData[storage] || {})) {
      for (const sensitive of sensitivePatterns) {
        if (sensitive.pattern.test(key) || (value && sensitive.pattern.test(value))) {
          findings.push({
            type: 'A02-SENSITIVE-STORAGE',
            cwe: 'CWE-922',
            severity: 'HIGH',
            title: `Sensitive Data in ${storage}`,
            description: `Potential ${sensitive.name} found in ${storage}`,
            url: targetUrl,
            evidence: `Key: ${key}`
          });
          log('vuln', `Sensitive data in ${storage}: ${key}`);
        }
      }
    }
  }

  subHeader('Test A02-3: Secrets in JavaScript (CWE-259, CWE-321, CWE-540)');

  const scripts = await page.$$eval('script', scripts => scripts.map(s => s.textContent || '').filter(s => s.length > 0));

  const secretPatterns = [
    { pattern: /api[_-]?key\s*[:=]\s*['"`]([^'"`]{10,})['"`]/gi, name: 'API Key', cwe: 'CWE-321' },
    { pattern: /secret[_-]?key\s*[:=]\s*['"`]([^'"`]{10,})['"`]/gi, name: 'Secret Key', cwe: 'CWE-321' },
    { pattern: /private[_-]?key\s*[:=]\s*['"`]([^'"`]{10,})['"`]/gi, name: 'Private Key', cwe: 'CWE-321' },
    { pattern: /password\s*[:=]\s*['"`]([^'"`]{4,})['"`]/gi, name: 'Hardcoded Password', cwe: 'CWE-259' },
    { pattern: /aws[_-]?(access|secret)[_-]?key[_-]?id?\s*[:=]\s*['"`]([^'"`]+)['"`]/gi, name: 'AWS Key', cwe: 'CWE-321' },
    { pattern: /-----BEGIN (RSA |DSA |EC |OPENSSH )?PRIVATE KEY-----/g, name: 'Private Key PEM', cwe: 'CWE-321' },
    { pattern: /ghp_[a-zA-Z0-9]{36}/g, name: 'GitHub Token', cwe: 'CWE-321' },
    { pattern: /sk-[a-zA-Z0-9]{48}/g, name: 'OpenAI Key', cwe: 'CWE-321' },
    { pattern: /xox[baprs]-[a-zA-Z0-9-]+/g, name: 'Slack Token', cwe: 'CWE-321' }
  ];

  for (const script of scripts) {
    for (const secret of secretPatterns) {
      if (secret.pattern.test(script)) {
        findings.push({
          type: 'A02-HARDCODED-SECRET',
          cwe: secret.cwe,
          severity: 'CRITICAL',
          title: `Hardcoded ${secret.name} in JavaScript`,
          description: `Found ${secret.name} in client-side JavaScript`,
          url: targetUrl,
          evidence: `Pattern: ${secret.name}`
        });
        log('vuln', `Hardcoded secret: ${secret.name}`);
      }
      secret.pattern.lastIndex = 0;
    }
  }
  subHeader('Test A02-4: Security Headers');

  const response = await safeGoto(page, targetUrl, 30000);
  const headers = response?.headers?.() || {};

  const requiredHeaders = [
    { name: 'strict-transport-security', cwe: 'CWE-319', severity: 'MEDIUM', desc: 'Missing HSTS header' },
    { name: 'x-content-type-options', cwe: 'CWE-16', severity: 'LOW', desc: 'Missing X-Content-Type-Options' },
    { name: 'x-frame-options', cwe: 'CWE-1021', severity: 'MEDIUM', desc: 'Missing X-Frame-Options (Clickjacking)' },
    { name: 'content-security-policy', cwe: 'CWE-79', severity: 'MEDIUM', desc: 'Missing Content-Security-Policy' },
    { name: 'x-xss-protection', cwe: 'CWE-79', severity: 'LOW', desc: 'Missing X-XSS-Protection' },
    { name: 'referrer-policy', cwe: 'CWE-200', severity: 'LOW', desc: 'Missing Referrer-Policy' },
    { name: 'permissions-policy', cwe: 'CWE-16', severity: 'LOW', desc: 'Missing Permissions-Policy' }
  ];

  for (const h of requiredHeaders) {
    if (!headers[h.name]) {
      findings.push({
        type: 'A02-MISSING-HEADER',
        cwe: h.cwe,
        severity: h.severity,
        title: h.desc,
        description: `Security header "${h.name}" is not set`,
        url: targetUrl,
        evidence: 'Header not present'
      });
      log('warn', `Missing header: ${h.name}`);
    }
  }

  subHeader('Test A02-5: Mixed Content (CWE-319)');

  if (targetUrl.startsWith('https')) {
    const mixedContent = await page.evaluate(() => {
      const mixed = [];
      document.querySelectorAll('img[src^="http:"], script[src^="http:"], link[href^="http:"], iframe[src^="http:"], video[src^="http:"], audio[src^="http:"], object[data^="http:"]').forEach(el => {
        mixed.push({ type: el.tagName.toLowerCase(), url: el.src || el.href || el.data });
      });
      return mixed;
    });

    for (const item of mixedContent) {
      findings.push({
        type: 'A02-MIXED-CONTENT',
        cwe: 'CWE-319',
        severity: item.type === 'script' ? 'HIGH' : 'MEDIUM',
        title: `Mixed Content: ${item.type}`,
        description: `HTTP ${item.type} loaded on HTTPS page`,
        url: targetUrl,
        evidence: `Resource: ${item.url}`
      });
      log('warn', `Mixed content (${item.type}): ${item.url}`);
    }
  }

  subHeader('Test A02-6: Credential Transport (CWE-523)');

  const loginForms = await page.$$eval('form', forms => forms.filter(f =>
    f.querySelector('input[type="password"]')
  ).map(f => ({
    action: f.action,
    method: f.method
  })));

  for (const form of loginForms) {
    if ((form.action || '').startsWith('http://')) {
      findings.push({
        type: 'A02-INSECURE-LOGIN',
        cwe: 'CWE-523',
        severity: 'CRITICAL',
        title: 'Credentials Sent Over HTTP',
        description: 'Login form submits to HTTP endpoint',
        url: form.action,
        evidence: `Form action: ${form.action}`
      });
      log('vuln', `Login form over HTTP: ${form.action}`);
    }
  }

  subHeader('Test A02-7: Weak Crypto Patterns (CWE-327, CWE-328, CWE-338)');

  const weakCryptoPatterns = [
    { pattern: /md5\s*\(/gi, name: 'MD5 hash', cwe: 'CWE-328' },
    { pattern: /sha1\s*\(/gi, name: 'SHA1 hash', cwe: 'CWE-328' },
    { pattern: /\bDES\b|\b3DES\b|\bRC4\b|\bRC2\b|\bBlowfish\b/gi, name: 'Weak cipher', cwe: 'CWE-327' },
    { pattern: /Math\.random\s*\(\)/g, name: 'Math.random() for security', cwe: 'CWE-338' },
    { pattern: /CryptoJS\.MD5|CryptoJS\.SHA1/gi, name: 'Weak CryptoJS hash', cwe: 'CWE-328' }
  ];

  for (const script of scripts) {
    for (const weak of weakCryptoPatterns) {
      if (weak.pattern.test(script)) {
        findings.push({
          type: 'A02-WEAK-CRYPTO',
          cwe: weak.cwe,
          severity: 'MEDIUM',
          title: `Weak Cryptography: ${weak.name}`,
          description: `Found usage of ${weak.name} in JavaScript`,
          url: targetUrl,
          evidence: `Pattern: ${weak.name}`
        });
        log('warn', `Weak crypto: ${weak.name}`);
      }
      weak.pattern.lastIndex = 0;
    }
  }

  subHeader('Test A02-8: Predictable IDs (CWE-340)');

  const pageHtml = await page.content();
  const idPatterns = [
    /id['"]\s*:\s*['"]?(\d+)['"]?/gi,
    /user[_-]?id['"]\s*:\s*['"]?(\d+)['"]?/gi
  ];

  for (const pattern of idPatterns) {
    const matches = [...pageHtml.matchAll(pattern)];
    if (matches.length >= 3) {
      const ids = matches.map(m => parseInt(m[1])).filter(id => !isNaN(id)).sort((a, b) => a - b);
      let sequential = true;
      for (let i = 1; i < Math.min(ids.length, 5); i++) {
        if (ids[i] - ids[i - 1] > 5) { sequential = false; break; }
      }
      if (sequential && ids.length >= 3) {
        findings.push({
          type: 'A02-PREDICTABLE-IDS',
          cwe: 'CWE-340',
          severity: 'LOW',
          title: 'Potentially Sequential/Predictable IDs',
          description: 'Numeric IDs appear to be sequential (enumerable)',
          url: targetUrl,
          evidence: `Sample IDs: ${ids.slice(0, 5).join(', ')}`
        });
        log('warn', 'Potentially predictable IDs detected');
      }
    }
    pattern.lastIndex = 0;
  }

  subHeader('Test A02-9: TLS Version (CWE-818)');

  try {
    const securityDetails = await response?.securityDetails?.();
    if (securityDetails) {
      const protocol = securityDetails.protocol();
      if (protocol && (protocol.includes('TLS 1.0') || protocol.includes('TLS 1.1') || protocol.includes('SSL'))) {
        findings.push({
          type: 'A02-WEAK-TLS',
          cwe: 'CWE-818',
          severity: 'MEDIUM',
          title: 'Weak TLS Version',
          description: `Server using outdated TLS version: ${protocol}`,
          url: targetUrl,
          evidence: `Protocol: ${protocol}`
        });
        log('warn', `Weak TLS: ${protocol}`);
      }
    }
  } catch {}

  if (findings.length === 0) {
    log('safe', 'No A02 vulnerabilities found');
  }

  return findings;
}


async function testA03_Injection(page, config, ctx) {
  header('A03 - INJECTION TESTS');

  const findings = [];
  const targetUrl = config.app.url;

  const inputs = await page.$$('input[type="text"], input[type="search"], input:not([type]), textarea, [contenteditable="true"]');
  log('info', `Found ${inputs.length} input fields for injection testing`);

  subHeader('Test A03-1: XSS (CWE-79, CWE-80, CWE-83, CWE-87)');

  const xssPayloads = [
    '<script>alert("XSS")</script>',
    '<img src=x onerror=alert("XSS")>',
    '<svg onload=alert("XSS")>',
    '"><script>alert("XSS")</script>',
    'javascript:alert("XSS")',
    'data:text/html,<script>alert("XSS")</script>',
    '{{constructor.constructor("alert(1)")()}}'
  ];

  for (const input of inputs.slice(0, 8)) {
    for (const payload of xssPayloads.slice(0, 4)) {
      try {
        let alertTriggered = false;
        page.once('dialog', async dialog => {
          alertTriggered = true;
          await dialog.dismiss();
        });

        await input.click({ clickCount: 3 });
        await page.keyboard.press('Backspace');
        await input.type(payload, { delay: 5 });
        await page.keyboard.press('Enter');
        await page.waitForTimeout(700);

        if (alertTriggered) {
          findings.push({
            type: 'A03-XSS',
            cwe: 'CWE-79',
            severity: 'HIGH',
            title: 'Potential XSS (Dialog Triggered)',
            description: 'XSS payload appears to have executed (dialog observed)',
            url: page.url(),
            evidence: `Payload: ${payload.substring(0, 50)}`
          });
          log('vuln', `XSS dialog triggered: ${payload.substring(0, 30)}`);
          break;
        }

        const reflectedInText = await page.evaluate((p) => {
          const t = document.body ? (document.body.innerText || '') : '';
          return t.includes(p);
        }, payload);

        if (reflectedInText) {
          findings.push({
            type: 'A03-XSS-REFLECTED-TEXT',
            cwe: 'CWE-79',
            severity: 'MEDIUM',
            title: 'Potential Reflected XSS (Text Reflection)',
            description: 'Payload appears in rendered text; review encoding/sanitization',
            url: page.url(),
            evidence: `Payload reflected in innerText: ${payload.substring(0, 50)}`
          });
          log('warn', `Potential XSS reflection in text: ${payload.substring(0, 25)}`);
          break;
        }

        await input.click({ clickCount: 3 });
        await page.keyboard.press('Backspace');
      } catch {}
    }
  }

  const xssParams = ['q', 'search', 'query', 'keyword', 'name', 'message', 'text', 'content', 'title', 'value', 'input', 'data'];
  for (const param of xssParams) {
    for (const payload of xssPayloads.slice(0, 3)) {
      const testUrl = `${targetUrl}?${param}=${encodeURIComponent(payload)}`;
      try {
        let alertTriggered = false;
        page.once('dialog', async dialog => {
          alertTriggered = true;
          await dialog.dismiss();
        });

        await safeGoto(page, testUrl, 15000);
        await page.waitForTimeout(800);

        if (alertTriggered) {
          findings.push({
            type: 'A03-XSS-URL-PARAM',
            cwe: 'CWE-79',
            severity: 'HIGH',
            title: 'XSS via URL Parameter (Dialog Triggered)',
            description: `XSS triggered via "${param}" parameter`,
            url: testUrl,
            evidence: 'Dialog observed'
          });
          log('vuln', `XSS via URL param: ${param}`);
        } else {
          const reflectedInText = await page.evaluate((p) => {
            const t = document.body ? (document.body.innerText || '') : '';
            return t.includes(p);
          }, payload);

          if (reflectedInText) {
            findings.push({
              type: 'A03-XSS-URL-PARAM-REFLECTED',
              cwe: 'CWE-79',
              severity: 'MEDIUM',
              title: 'Potential XSS via URL Parameter (Text Reflection)',
              description: `Payload appears in rendered text for "${param}" parameter`,
              url: testUrl,
              evidence: 'Payload in innerText'
            });
            log('warn', `Potential XSS reflection via URL param: ${param}`);
          }
        }
      } catch {}
    }
  }

  await safeGoto(page, targetUrl, 30000);
  subHeader('Test A03-2: SQL Injection (CWE-89)');
  const sqlPayloads = [
    "' OR '1'='1",
    "' OR '1'='1' --",
    "admin'--",
    "' UNION SELECT NULL, NULL, NULL --",
    "' AND 1=2 --"
  ];

  const sqlErrorPatterns = [
    /sql syntax/i, /mysql/i, /sqlite/i, /postgresql/i, /oracle/i,
    /ORA-\d{5}/i, /SQL Server/i, /ODBC/i, /SQLite3/i,
    /syntax error/i, /unclosed quotation mark/i, /invalid query/i
  ];

  for (const input of inputs.slice(0, 5)) {
    for (const payload of sqlPayloads.slice(0, 4)) {
      try {
        await input.click({ clickCount: 3 });
        await input.type(payload);
        await page.keyboard.press('Enter');
        await page.waitForTimeout(700);

        const content = await page.content();
        for (const pattern of sqlErrorPatterns) {
          if (pattern.test(content)) {
            findings.push({
              type: 'A03-SQL-INJECTION',
              cwe: 'CWE-89',
              severity: 'CRITICAL',
              title: 'SQL Injection Vulnerability',
              description: 'SQL error message triggered by injection payload',
              url: page.url(),
              evidence: `Payload: ${payload}`
            });
            log('vuln', `SQL injection marker: ${payload}`);
            break;
          }
        }

        await input.click({ clickCount: 3 });
        await page.keyboard.press('Backspace');
      } catch {}
    }
  }

  const sqlParams = ['id', 'user', 'uid', 'userid', 'item', 'product', 'category', 'page', 'order'];
  for (const param of sqlParams) {
    for (const payload of sqlPayloads.slice(0, 2)) {
      const testUrl = `${targetUrl}?${param}=${encodeURIComponent(payload)}`;
      try {
        const { status, text } = await gotoAndRead(page, testUrl, 15000);
        if (status !== 200 || !text) continue;
        if (looksLikeSpaFallback(text, ctx) || looksLikeHomeShell(text, ctx)) continue;

        for (const pattern of sqlErrorPatterns) {
          if (pattern.test(text)) {
            findings.push({
              type: 'A03-SQL-INJECTION-URL',
              cwe: 'CWE-89',
              severity: 'CRITICAL',
              title: 'SQL Injection via URL Parameter',
              description: `SQL error marker via "${param}" parameter`,
              url: testUrl,
              evidence: 'SQL error marker in response body'
            });
            log('vuln', `SQLi marker via URL: ${param}`);
            break;
          }
        }
      } catch {}
    }
  }

  await safeGoto(page, targetUrl, 30000);
  subHeader('Test A03-3: Command Injection (CWE-77, CWE-78)');

  const cmdPayloads = ['; whoami', '| whoami', '`whoami`', '$(whoami)', '; cat /etc/passwd'];
  const cmdSuccessPatterns = [/uid=\d+/i, /gid=\d+/i, /root:/i, /daemon:/i];

  for (const input of inputs.slice(0, 3)) {
    for (const payload of cmdPayloads.slice(0, 4)) {
      try {
        await input.click({ clickCount: 3 });
        await input.type(payload);
        await page.keyboard.press('Enter');
        await page.waitForTimeout(900);

        const content = await page.content();
        for (const pattern of cmdSuccessPatterns) {
          if (pattern.test(content)) {
            findings.push({
              type: 'A03-COMMAND-INJECTION',
              cwe: 'CWE-78',
              severity: 'CRITICAL',
              title: 'OS Command Injection',
              description: 'Command execution marker detected',
              url: page.url(),
              evidence: `Payload: ${payload}`
            });
            log('vuln', `Command injection marker: ${payload}`);
            break;
          }
        }

        await input.click({ clickCount: 3 });
        await page.keyboard.press('Backspace');
      } catch {}
    }
  }

  await safeGoto(page, targetUrl, 30000);
  subHeader('Test A03-4: NoSQL Injection (CWE-943)');

  const nosqlPayloads = ['{"$gt": ""}', '{"$ne": null}', '{"$where": "1==1"}', '|| 1==1'];

  for (const input of inputs.slice(0, 3)) {
    for (const payload of nosqlPayloads.slice(0, 3)) {
      try {
        await input.click({ clickCount: 3 });
        await input.type(payload);
        await page.keyboard.press('Enter');
        await page.waitForTimeout(800);

        const content = await page.content();
        if (/mongodb|firestore|nosql.*error|bson|document.*error/i.test(content)) {
          findings.push({
            type: 'A03-NOSQL-INJECTION',
            cwe: 'CWE-943',
            severity: 'HIGH',
            title: 'Potential NoSQL Injection',
            description: 'NoSQL error marker triggered by injection payload',
            url: page.url(),
            evidence: `Payload: ${payload}`
          });
          log('warn', `NoSQL injection marker: ${payload}`);
        }

        await input.click({ clickCount: 3 });
        await page.keyboard.press('Backspace');
      } catch {}
    }
  }

  await safeGoto(page, targetUrl, 30000);
  subHeader('Test A03-5: XML Injection (CWE-91)');

  const xmlPayloads = [
    '<?xml version="1.0"?><!DOCTYPE foo [<!ENTITY xxe SYSTEM "file:///etc/passwd">]><foo>&xxe;</foo>',
    '<?xml version="1.0"?><!DOCTYPE foo [<!ENTITY xxe SYSTEM "http://example.com">]><foo>&xxe;</foo>'
  ];

  for (const input of inputs.slice(0, 2)) {
    for (const payload of xmlPayloads.slice(0, 2)) {
      try {
        await input.click({ clickCount: 3 });
        await input.type(payload);
        await page.keyboard.press('Enter');
        await page.waitForTimeout(900);

        const content = await page.content();
        if (content.includes('root:') || /xml.*error|parser.*error|entity.*not.*defined/i.test(content)) {
          findings.push({
            type: 'A03-XML-INJECTION',
            cwe: 'CWE-91',
            severity: 'HIGH',
            title: 'XML Injection / XXE Markers',
            description: 'XML parsing error or XXE marker detected',
            url: page.url(),
            evidence: `Payload prefix: ${payload.substring(0, 40)}`
          });
          log('vuln', 'XML injection marker detected');
        }

        await input.click({ clickCount: 3 });
        await page.keyboard.press('Backspace');
      } catch {}
    }
  }

  await safeGoto(page, targetUrl, 30000);
  subHeader('Test A03-6: LDAP Injection (CWE-90)');

  const ldapPayloads = ['*)(uid=*))(|(uid=*', '*)(objectClass=*', 'admin)(|(password=*'];

  for (const input of inputs.slice(0, 2)) {
    for (const payload of ldapPayloads.slice(0, 3)) {
      try {
        await input.click({ clickCount: 3 });
        await input.type(payload);
        await page.keyboard.press('Enter');
        await page.waitForTimeout(900);

        const content = await page.content();
        if (/ldap.*error|invalid.*filter|search.*failed/i.test(content)) {
          findings.push({
            type: 'A03-LDAP-INJECTION',
            cwe: 'CWE-90',
            severity: 'HIGH',
            title: 'Potential LDAP Injection',
            description: 'LDAP error marker triggered by injection payload',
            url: page.url(),
            evidence: `Payload: ${payload}`
          });
          log('warn', `LDAP injection marker: ${payload}`);
        }

        await input.click({ clickCount: 3 });
        await page.keyboard.press('Backspace');
      } catch {}
    }
  }

  await safeGoto(page, targetUrl, 30000);
  subHeader('Test A03-7: CRLF Injection (CWE-93, CWE-113)');

  const crlfPayloads = [
    '%0d%0aSet-Cookie:%20injected=true',
    '%0d%0aX-Injected:%20true'
  ];

  for (const payload of crlfPayloads) {
    const testUrl = `${targetUrl}?param=${payload}`;
    try {
      const resp = await safeGoto(page, testUrl, 15000);
      const headers = resp?.headers?.() || {};
      if (headers['x-injected'] || (headers['set-cookie'] || '').includes('injected')) {
        findings.push({
          type: 'A03-CRLF-INJECTION',
          cwe: 'CWE-93',
          severity: 'HIGH',
          title: 'CRLF Injection / HTTP Response Splitting',
          description: 'Injected header markers in response',
          url: testUrl,
          evidence: 'Injected header present'
        });
        log('vuln', 'CRLF injection markers detected');
      }
    } catch {}
  }

  await safeGoto(page, targetUrl, 30000);
  subHeader('Test A03-8: Template Injection (CWE-94, CWE-917)');

  const templatePayloads = ['{{7*7}}', '${7*7}', '<%= 7*7 %>', '#{7*7}'];

  for (const input of inputs.slice(0, 3)) {
    for (const payload of templatePayloads) {
      try {
        await input.click({ clickCount: 3 });
        await input.type(payload);
        await page.keyboard.press('Enter');
        await page.waitForTimeout(800);

        const content = await page.content();
        if (content.includes('49') && !content.includes(payload)) {
          findings.push({
            type: 'A03-TEMPLATE-INJECTION',
            cwe: 'CWE-94',
            severity: 'CRITICAL',
            title: 'Server-Side Template Injection Markers',
            description: 'Template expression appears evaluated',
            url: page.url(),
            evidence: `Payload: ${payload} resulted in 49`
          });
          log('vuln', `Template injection markers: ${payload}`);
        }

        await input.click({ clickCount: 3 });
        await page.keyboard.press('Backspace');
      } catch {}
    }
  }

  await safeGoto(page, targetUrl, 30000);
  subHeader('Test A03-9: SSI Injection (CWE-97)');

  const ssiPayloads = ['<!--#printenv -->', '<!--#echo var="DATE_LOCAL" -->'];

  for (const input of inputs.slice(0, 2)) {
    for (const payload of ssiPayloads) {
      try {
        await input.click({ clickCount: 3 });
        await input.type(payload);
        await page.keyboard.press('Enter');
        await page.waitForTimeout(900);

        const content = await page.content();
        if (content.includes('DOCUMENT_ROOT') || /\d{4}-\d{2}-\d{2}/.test(content)) {
          findings.push({
            type: 'A03-SSI-INJECTION',
            cwe: 'CWE-97',
            severity: 'HIGH',
            title: 'SSI Injection Markers',
            description: 'SSI marker detected in response',
            url: page.url(),
            evidence: `Payload: ${payload}`
          });
          log('vuln', 'SSI injection markers detected');
        }

        await input.click({ clickCount: 3 });
        await page.keyboard.press('Backspace');
      } catch {}
    }
  }

  await safeGoto(page, targetUrl, 30000);
  subHeader('Test A03-10: File Inclusion (CWE-98)');

  const lfiPayloads = ['/etc/passwd', 'php://filter/convert.base64-encode/resource=/etc/passwd', 'http://example.com/shell.txt'];
  const fileParams = ['file', 'page', 'include', 'template', 'path', 'doc', 'document', 'folder', 'pg', 'style', 'lang'];

  for (const param of fileParams) {
    for (const payload of lfiPayloads.slice(0, 2)) {
      const testUrl = `${targetUrl}?${param}=${encodeURIComponent(payload)}`;
      try {
        const { status, text } = await gotoAndRead(page, testUrl, 15000);
        if (status !== 200 || !text) continue;
        if (looksLikeSpaFallback(text, ctx) || looksLikeHomeShell(text, ctx)) continue;

        if (text.includes('root:') || text.includes('daemon:') || text.includes('PD9waHA')) {
          findings.push({
            type: 'A03-FILE-INCLUSION',
            cwe: 'CWE-98',
            severity: 'CRITICAL',
            title: 'Local/Remote File Inclusion Markers',
            description: `File inclusion markers via "${param}" parameter`,
            url: testUrl,
            evidence: 'File content markers in response body'
          });
          log('vuln', `File inclusion markers via: ${param}`);
        }
      } catch {}
    }
  }

  await safeGoto(page, targetUrl, 30000);
  subHeader('Test A03-12: XPath Injection (CWE-643)');

  const xpathPayloads = ["' or '1'='1", "'] | //user/*[contains(*,'", "1 or 1=1"];

  for (const input of inputs.slice(0, 2)) {
    for (const payload of xpathPayloads.slice(0, 3)) {
      try {
        await input.click({ clickCount: 3 });
        await input.type(payload);
        await page.keyboard.press('Enter');
        await page.waitForTimeout(900);

        const content = await page.content();
        if (/xpath.*error|xml.*path.*error|invalid.*expression/i.test(content)) {
          findings.push({
            type: 'A03-XPATH-INJECTION',
            cwe: 'CWE-643',
            severity: 'HIGH',
            title: 'XPath Injection Markers',
            description: 'XPath error marker triggered by injection payload',
            url: page.url(),
            evidence: `Payload: ${payload}`
          });
          log('warn', `XPath injection marker: ${payload}`);
        }

        await input.click({ clickCount: 3 });
        await page.keyboard.press('Backspace');
      } catch {}
    }
  }

  await safeGoto(page, targetUrl, 30000);

  if (findings.length === 0) {
    log('safe', 'No A03 vulnerabilities found');
  }

  return findings;
}


async function testPrivilegeEscalation(browser, config, allAccountsData) {
  header('CROSS-ACCOUNT PRIVILEGE ESCALATION TESTS');

  const findings = [];
  const targetUrl = config.app.url;
  const privilegeOrder = { 'user': 1, 'admin': 2, 'owner': 3 };
  const sortedAccounts = [...allAccountsData].sort((a, b) =>
    (privilegeOrder[a.role] || 0) - (privilegeOrder[b.role] || 0)
  );

  const accountResources = {};

  for (const account of sortedAccounts) {
const context = await createIsolatedContext(browser);
const page = await context.newPage();

    await page.setViewport({ width: 1920, height: 1080 });
    page.setDefaultNavigationTimeout(30000);
    page.setDefaultTimeout(30000);

    log('step', `Collecting resources for ${account.role}`);

    const browserConfig = config.scanner?.browserScan || {};
    const loginSuccess = await loginToFirebaseApp(page, targetUrl, account, browserConfig);

    if (!loginSuccess) {
      await page.close();
      await context.close();
      continue;
    }

    const visitedUrls = await navigateApp(page, config);
    accountResources[account.role] = { urls: Array.from(visitedUrls), account };

    await logout(page, targetUrl);
    await page.close();
    await context.close();
  }

  for (const lowerAccount of sortedAccounts) {
    for (const higherAccount of sortedAccounts) {
      if (privilegeOrder[lowerAccount.role] >= privilegeOrder[higherAccount.role]) continue;

      const higherUrls = accountResources[higherAccount.role]?.urls || [];
      const lowerUrls = accountResources[lowerAccount.role]?.urls || [];

      const restrictedUrls = higherUrls.filter(url =>
        !lowerUrls.includes(url) &&
        (url.includes('admin') || url.includes('manage') || url.includes('owner') || url.includes('settings'))
      );

      if (restrictedUrls.length > 0) {
        log('info', `Testing ${lowerAccount.role} access to ${higherAccount.role}'s resources...`);

const context = await createIsolatedContext(browser);
const page = await context.newPage();

        page.setDefaultNavigationTimeout(30000);
        page.setDefaultTimeout(30000);

        const browserConfig = config.scanner?.browserScan || {};
        const ok = await loginToFirebaseApp(page, targetUrl, lowerAccount, browserConfig);
        if (!ok) { await page.close(); await context.close(); continue; }

        const ctx = {};
        await safeGoto(page, targetUrl, 30000);
        const homeRead = await gotoAndRead(page, targetUrl, 20000);
        ctx.home = { hash: sha256(homeRead.text || ''), status: homeRead.status };
        ctx.spaFallback = await computeSpaFallbackFingerprint(page, targetUrl);

        for (const restrictedUrl of restrictedUrls.slice(0, 5)) {
          try {
            const { status, text } = await gotoAndRead(page, restrictedUrl, 15000);
            if (status !== 200 || !text) continue;

            if (looksLikeSpaFallback(text, ctx) || looksLikeHomeShell(text, ctx)) continue;

            const blocked = /unauthorized|forbidden|access denied/i.test(text);

            if (!blocked && text.length > 2000) {
              findings.push({
                type: 'PRIVILEGE-ESCALATION',
                cwe: 'CWE-269',
                severity: 'HIGH',
                title: `Potential Privilege Escalation: ${lowerAccount.role} → ${higherAccount.role}`,
                description: `${lowerAccount.role} received non-fallback content at a ${higherAccount.role}-only URL`,
                url: restrictedUrl,
                evidence: `status=200; len=${text.length}`
              });
              log('vuln', `Potential priv esc: ${lowerAccount.role} accessed ${higherAccount.role} URL`);
            }
          } catch {}
        }

        await page.close();
        await context.close();
      }
    }
  }

  if (findings.length === 0) {
    log('safe', 'No privilege escalation vulnerabilities found');
  }

  return findings;
}

async function main() {
  console.log(`
${colors.bgBlue}${colors.white}╔══════════════════════════════════════════════════════════════════════════════╗${colors.reset}
${colors.bgBlue}${colors.white}║     COMPREHENSIVE AUTHENTICATED BROWSER SCANNER v2.1 (SPA-safe)              ║${colors.reset}
${colors.bgBlue}${colors.white}║     OWASP Top 10:2021 A01-A03 - Full CWE Coverage                            ║${colors.reset}
${colors.bgBlue}${colors.white}╚══════════════════════════════════════════════════════════════════════════════╝${colors.reset}
`);

  const args = process.argv.slice(2);
  let configPath = 'config.yaml';
  let useZapProxy = true;

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--config' || args[i] === '-c') configPath = args[++i];
    if (args[i] === '--no-zap') useZapProxy = false;
  }

  let resolvedConfigPath = configPath;
  if (!fs.existsSync(resolvedConfigPath)) {
    resolvedConfigPath = path.resolve(__dirname, '..', configPath);
  }
  if (!fs.existsSync(resolvedConfigPath)) {
    console.error(`Config file not found: ${configPath}`);
    process.exit(1);
  }

  config = loadConfig(resolvedConfigPath);

  const targetUrl = config.app?.url;
  const zapHost = config.scanner?.zap?.host || 'localhost';
  const zapPort = config.scanner?.zap?.port || 8080;
  const zapApiKey = config.scanner?.zap?.apiKey || 'changeme';
  const zapBaseUrl = `http://${zapHost}:${zapPort}`;
  const zapProxy = useZapProxy ? `${zapHost}:${zapPort}` : null;

  console.log(`Target: ${targetUrl}`);
  console.log(`ZAP Proxy: ${zapProxy || 'disabled'}`);
  console.log(`Date: ${new Date().toISOString()}\n`);

  if (!fs.existsSync('./reports')) {
    fs.mkdirSync('./reports', { recursive: true });
  }

  if (useZapProxy) {
    header('CHECKING ZAP CONNECTION');
    const zapConnected = await checkZapConnection(zapBaseUrl, zapApiKey);
    if (!zapConnected) {
      log('warn', 'ZAP not running. Continuing without ZAP proxy.');
      useZapProxy = false;
    } else {
      log('success', 'Connected to ZAP');
      await zapApi(zapBaseUrl, zapApiKey, 'JSON/core/action/newSession', { name: `scan-${Date.now()}` });
    }
  }

  const accounts = config.accounts || [];
  if (accounts.length === 0) {
    log('error', 'No test accounts configured');
    process.exit(1);
  }

  log('info', `Found ${accounts.length} test accounts:`);
  accounts.forEach(a => log('info', `  - ${a.role}: ${a.email}`));

  header('LAUNCHING BROWSER');
  const browser = await launchBrowser(useZapProxy ? zapProxy : null);

  const allFindings = [];
  const accountResults = {};

  try {
    for (const account of accounts) {
      header(`TESTING ACCOUNT: ${account.role.toUpperCase()}`);

      const context = await createIsolatedContext(browser); // isolated storage
      const page = await context.newPage();
      await page.setViewport({ width: 1920, height: 1080 });
      await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36');

      page.setDefaultNavigationTimeout(30000);
      page.setDefaultTimeout(30000);

      let requestCount = 0;
      await page.setRequestInterception(true);
      page.on('request', request => { requestCount++; try { request.continue(); } catch {} });

      const browserConfig = config.scanner?.browserScan || {};
      const loginSuccess = await loginToFirebaseApp(page, targetUrl, account, browserConfig);

      if (!loginSuccess) {
        log('warn', `Login failed for ${account.role}`);
        await page.close();
        await context.close();
        continue;
      }

      await navigateApp(page, config);

      const ctx = {};
      const homeRead = await gotoAndRead(page, targetUrl, 20000);
      ctx.home = { hash: sha256(homeRead.text || ''), status: homeRead.status };
      ctx.spaFallback = await computeSpaFallbackFingerprint(page, targetUrl);

      const a01Findings = await testA01_BrokenAccessControl(page, config, account, accounts, ctx);
      allFindings.push(...a01Findings.map(f => ({ ...f, testedAs: account.role })));

      const a02Findings = await testA02_CryptographicFailures(page, config);
      allFindings.push(...a02Findings.map(f => ({ ...f, testedAs: account.role })));

      const a03Findings = await testA03_Injection(page, config, ctx);
      allFindings.push(...a03Findings.map(f => ({ ...f, testedAs: account.role })));

      await page.screenshot({ path: `./reports/browser-final-${account.role}.png`, fullPage: true });

      accountResults[account.role] = {
        requestCount,
        findings: { a01: a01Findings.length, a02: a02Findings.length, a03: a03Findings.length }
      };

      log('success', `Completed ${account.role}. ${requestCount} requests.`);

      await logout(page, targetUrl);
      await page.close();
      await context.close(); // important: clears service workers/caches for next account
    }

    const privEscFindings = await testPrivilegeEscalation(browser, config, accounts);
    allFindings.push(...privEscFindings);
    if (useZapProxy) {
      header('ZAP SCANNING');

      log('step', 'Passive scan...');
      let recordsToScan = 1;
      while (recordsToScan > 0) {
        await new Promise(r => setTimeout(r, 2000));
        const result = await zapApi(zapBaseUrl, zapApiKey, 'JSON/pscan/view/recordsToScan');
        recordsToScan = parseInt(result.recordsToScan) || 0;
      }

      log('step', 'Active scan...');
      const scanResult = await zapApi(zapBaseUrl, zapApiKey, 'JSON/ascan/action/scan', {
        url: targetUrl, recurse: 'true', inScopeOnly: 'false'
      });

      if (scanResult.scan) {
        let progress = 0;
        const timeout = 600000;
        const start = Date.now();
        while (progress < 100 && Date.now() - start < timeout) {
          await new Promise(r => setTimeout(r, 5000));
          const status = await zapApi(zapBaseUrl, zapApiKey, 'JSON/ascan/view/status', { scanId: scanResult.scan });
          progress = parseInt(status.status) || 0;
          process.stdout.write(`\r  Progress: ${progress}%   `);
        }
        console.log('');
      }

      const zapAlerts = await getZapAlerts(zapBaseUrl, zapApiKey, targetUrl);
      for (const alert of zapAlerts) {
        allFindings.push({
          type: `ZAP-${alert.alertRef || 'UNKNOWN'}`,
          cwe: `CWE-${alert.cweid || 'Unknown'}`,
          severity: ['INFO', 'LOW', 'MEDIUM', 'HIGH', 'CRITICAL'][parseInt(alert.risk) || 0],
          title: alert.alert,
          description: alert.description || alert.alert,
          url: alert.url,
          evidence: alert.evidence || 'N/A',
          source: 'ZAP'
        });
      }

      const htmlReport = await fetch(`${zapBaseUrl}/OTHER/core/other/htmlreport/?apikey=${zapApiKey}`);
      fs.writeFileSync('./reports/browser-zap-report.html', await htmlReport.text());
    }

    // Deduplicate findings
    function normalizeUrl(u) {
      try {
        const url = new URL(u);
        return url.toString();
      } catch { return u || ''; }
    }

    const seen = new Set();
    const dedupedFindings = [];
    for (const f of allFindings) {
      const key = [
        f.testedAs || '',
        f.type || '',
        f.cwe || '',
        f.title || '',
        normalizeUrl(f.url)
      ].join('|');

      if (seen.has(key)) continue;
      seen.add(key);
      dedupedFindings.push(f);
    }

    header('FINAL RESULTS');

    const critical = dedupedFindings.filter(f => f.severity === 'CRITICAL');
    const high = dedupedFindings.filter(f => f.severity === 'HIGH');
    const medium = dedupedFindings.filter(f => f.severity === 'MEDIUM');
    const low = dedupedFindings.filter(f => f.severity === 'LOW');

    console.log(`
${colors.bgRed}${colors.white} CRITICAL: ${critical.length} ${colors.reset}
${colors.red}HIGH: ${high.length}${colors.reset}
${colors.yellow}MEDIUM: ${medium.length}${colors.reset}
${colors.blue}LOW: ${low.length}${colors.reset}
${colors.white}Total (deduped): ${dedupedFindings.length}${colors.reset}
`);

    if (critical.length > 0) {
      console.log(`\n${colors.bgRed} CRITICAL ${colors.reset}`);
      critical.forEach(f => console.log(`  ${colors.red}●${colors.reset} ${f.title} (${f.cwe})`));
    }

    if (high.length > 0) {
      console.log(`\n${colors.red}HIGH${colors.reset}`);
      high.slice(0, 10).forEach(f => console.log(`  ${colors.red}●${colors.reset} ${f.title}`));
    }

    const results = {
      scanDate: new Date().toISOString(),
      target: targetUrl,
      accountsTested: accounts.map(a => a.role),
      accountResults,
      findings: dedupedFindings,
      summary: {
        critical: critical.length,
        high: high.length,
        medium: medium.length,
        low: low.length,
        total: dedupedFindings.length
      },
      cweCoverage: {
        A01: 23, A02: 12, A03: 22, total: 57
      }
    };

    fs.writeFileSync('./reports/browser-scan-results.json', JSON.stringify(results, null, 2));
    log('success', 'Results: ./reports/browser-scan-results.json');

  } catch (error) {
    log('error', `Error: ${error.message}`);
    console.error(error);
  } finally {
    await browser.close();
  }

  header('SCAN COMPLETE');
  await stopZapDaemon();
}

main().catch(console.error);
