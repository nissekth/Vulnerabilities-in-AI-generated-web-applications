#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');
const yaml = require('yaml');

const {
  deduplicateFindings,
  getDeduplicationStats,
  generateFingerprint
} = require('./deduplicator');

function getArg(name, aliases = []) {
  const args = process.argv.slice(2);
  const keys = [name, ...aliases];
  for (let i = 0; i < args.length; i++) {
    if (keys.includes(args[i])) return args[i + 1];
  }
  return null;
}

function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
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

function readJsonIfExists(p) {
  try {
    if (!p || !fs.existsSync(p)) return null;
    return JSON.parse(fs.readFileSync(p, 'utf8'));
  } catch (e) {
    console.warn(`Warning: failed to parse JSON: ${p} (${e.message})`);
    return null;
  }
}

function firstExistingPath(candidates) {
  for (const p of candidates) {
    if (p && fs.existsSync(p)) return p;
  }
  return null;
}

function normalizeSeverity(sev) {
  if (!sev) return 'MEDIUM';
  const s = String(sev).toUpperCase();
  const map = {
    'CRIT': 'CRITICAL',
    'CRITICAL': 'CRITICAL',
    'HIGH': 'HIGH',
    'MODERATE': 'MEDIUM',
    'MEDIUM': 'MEDIUM',
    'LOW': 'LOW',
    'INFO': 'INFO',
    'INFORMATIONAL': 'INFO'
  };
  return map[s] || 'MEDIUM';
}

function inferCategoryFromType(type) {
  const t = String(type || '');
  const m = t.match(/A0[1-3]/i);
  return m ? m[0].toUpperCase() : 'A01';
}

function normalizeEvidence(evidence) {
  if (!evidence) return null;
  if (typeof evidence === 'object' && !Array.isArray(evidence)) return { ...evidence };
  return { detail: evidence };
}

const SEVERITY_RANK = {
  CRITICAL: 0,
  HIGH: 1,
  MEDIUM: 2,
  LOW: 3,
  INFO: 4
};

function severityRank(sev) {
  const s = normalizeSeverity(sev);
  return (s in SEVERITY_RANK) ? SEVERITY_RANK[s] : SEVERITY_RANK.MEDIUM;
}

function sortBySeverityThenTitle(a, b) {
  return (
    severityRank(a.severity) - severityRank(b.severity) ||
    String(a.title || '').localeCompare(String(b.title || ''), undefined, { numeric: true, sensitivity: 'base' }) ||
    String(a.id || '').localeCompare(String(b.id || ''), undefined, { numeric: true, sensitivity: 'base' })
  );
}


function normalizeFinding(src, defaults) {
  const f = (src && typeof src === 'object') ? src : {};

  let ev = normalizeEvidence(f.evidence);
  if (!ev && (f.url || f.type)) ev = {};
  if (f.url && ev && !ev.url) ev.url = f.url;
  if (f.type && ev && !ev.type) ev.type = f.type;

  const category = (f.category || inferCategoryFromType(f.type) || defaults.category || 'A01').toUpperCase();
  const tool = f.tool || defaults.tool || 'unknown';


  const toolsList = Array.isArray(f.tools) && f.tools.length > 0 ? [...new Set(f.tools)] : null;
  const duplicateCount = (typeof f.duplicateCount === 'number' && f.duplicateCount > 0) ? f.duplicateCount : null;

  return {
    ...f, 
    id: f.id || `${String(tool).toUpperCase().replace(/[^A-Z0-9]+/g, '-')}-${String(defaults.seq || 0).padStart(4, '0')}`,
    category,
    cwe: (f.cwe || defaults.cwe || 'CWE-Unknown').toUpperCase(),
    cweName: f.cweName || defaults.cweName || 'Unknown',
    severity: normalizeSeverity(f.severity || defaults.severity),
    title: f.title || f.type || defaults.title || 'Security Finding',
    description: f.description || defaults.description || '',
    evidence: ev,
    tool,
    tools: toolsList || f.tools, // preserve if present
    duplicateCount: duplicateCount || f.duplicateCount,
    confirmed: Boolean(f.confirmed),
    timestamp: f.timestamp || new Date().toISOString()
  };
}

function computeStats(reportFindings) {
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

  return stats;
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
    .card.info { border-left: 4px solid #3d3d3d; }
    .card h3 { font-size: 2rem; margin-bottom: 5px; }
    .card p { color: #666; font-size: 0.8rem; text-transform: uppercase; }
    .section { background: white; border-radius: 12px; padding: 25px; margin-bottom: 20px; box-shadow: 0 2px 10px rgba(0,0,0,0.05); }
    .section h2 { margin-bottom: 20px; padding-bottom: 10px; border-bottom: 2px solid #f0f0f0; }
    .finding { background: #fafafa; border-radius: 10px; padding: 20px; margin-bottom: 15px; border: 1px solid #e5e5e5; }
    .finding-header { display: flex; justify-content: space-between; align-items: start; flex-wrap: wrap; gap: 10px; }
    .finding-title { font-weight: 600; font-size: 1.1rem; margin-bottom: 5px; }
    .badges { display: flex; gap: 8px; flex-wrap: wrap; }
    .badge { padding: 4px 10px; border-radius: 20px; font-size: 0.75rem; font-weight: 600; }
    .badge.critical { background: #dc3545; color: white; }
    .badge.high { background: #fd7e14; color: white; }
    .badge.medium { background: #ffc107; color: #333; }
    .badge.low { background: #17a2b8; color: white; }
    .badge.info { background: #6c757d; color: white; }
    .badge.cwe { background: #e9ecef; color: #495057; }
    .badge.tool { background: #d1ecf1; color: #0c5460; }
    .badge.duplicate-badge { background: #6f42c1; color: white; }
    .badge.confirmed-badge { background: #28a745; color: white; }
    .tools-list { display: flex; gap: 5px; flex-wrap: wrap; }
    .finding-desc { margin: 10px 0; color: #555; }
    .evidence, .remediation { margin-top: 12px; padding: 12px; background: white; border-radius: 8px; font-size: 0.9rem; }
    .evidence { border-left: 3px solid #17a2b8; }
    .remediation { border-left: 3px solid #28a745; }
    footer { text-align: center; padding: 20px; color: #666; font-size: 0.9rem; }
    .category-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; }
    .category-header h3 { font-size: 1.3rem; }
    .category-count { background: #f0f0f0; padding: 5px 15px; border-radius: 20px; font-weight: 600; }
    .dedup-summary { background: #f8f9fa; border-radius: 10px; padding: 15px; margin: 15px 0; border: 1px solid #e9ecef; }
    .dedup-summary h3 { margin-bottom: 10px; font-size: 1.1rem; }
    .dedup-stats { display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 10px; }
    .dedup-stat { text-align: center; padding: 10px; background: white; border-radius: 8px; }
    .dedup-stat .value { font-size: 1.4rem; font-weight: 700; color: #6f42c1; }
    .dedup-stat .label { font-size: 0.8rem; color: #666; margin-top: 3px; }
  </style>
</head>
<body>
  <header>
    <div class="container">
      <h1>Security Assessment Report</h1>
      <div class="meta">
        <span> Website name: ${report.metadata.appName}</span>
        <span> Website address: ${report.metadata.target}</span>
      </div>
    </div>
  </header>
  
  <div class="container">
    <div class="cards">
      <div class="card critical">
        <h3>${report.summary.bySeverity.CRITICAL}</h3>
        <p>Critical</p>
      </div>
      <div class="card high">
        <h3>${report.summary.bySeverity.HIGH}</h3>
        <p>High</p>
      </div>
      <div class="card medium">
        <h3>${report.summary.bySeverity.MEDIUM}</h3>
        <p>Medium</p>
      </div>
      <div class="card low">
        <h3>${report.summary.bySeverity.LOW}</h3>
        <p>Low</p>
      </div>
      <div class="card info">
        <h3>${report.summary.bySeverity.INFO}</h3>
        <p>Informational</p>
      </div>
    </div>
    
    
    ${['A01', 'A02', 'A03'].map(cat => {
      const catFindings = report.findings
        .filter(f => f.category === cat)
        .slice()
        .sort(sortBySeverityThenTitle);
      const catNames = { A01: 'Broken Access Control', A02: 'Cryptographic Failures', A03: 'Injection' };
      return `
    <div class="section">
      <div class="category-header ${cat.toLowerCase()}">
        <h3>${cat}: ${catNames[cat]}</h3>
        <span class="category-count">${catFindings.length} findings</span>
      </div>
      ${catFindings.map(f => `
      <div class="finding">
        <div class="finding-header">
          <div>
            <div class="finding-title">${f.title}</div>
            <div class="badges">
              <span class="badge ${f.severity.toLowerCase()}">${f.severity}</span>
              <span class="badge cwe">${f.cwe}</span>
              ${f.tools && f.tools.length > 1 
                ? `<div class="tools-list">${f.tools.map(t => `<span class="badge tool">${t}</span>`).join('')}</div>`
                : `<span class="badge tool">${f.tool}</span>`}
              ${f.duplicateCount && f.duplicateCount > 1 ? `<span class="badge duplicate-badge">×${f.duplicateCount}</span>` : ''}
              
            </div>
          </div>
        </div>
        <p class="finding-desc">${f.description}</p>
        ${f.evidence ? `<div class="evidence"><strong>Evidence:</strong> ${typeof f.evidence === 'object' ? JSON.stringify(f.evidence, null, 2) : f.evidence}</div>` : ''}
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
    const catFindings = report.findings
      .filter(f => f.category === cat)
      .slice()
      .sort(sortBySeverityThenTitle);
    const catNames = { A01: 'Broken Access Control', A02: 'Cryptographic Failures', A03: 'Injection' };
    
    md += `### ${cat}: ${catNames[cat]}\n\n`;
    
    catFindings.forEach(f => {
      md += `#### ${f.severity}: ${f.title}\n\n`;
      md += `- **CWE:** ${f.cwe} (${f.cweName})\n`;
      
      if (f.tools && f.tools.length > 1) {
        md += `- **Found by:** ${f.tools.join(', ')} (${f.tools.length} tools)\n`;
      } else {
        md += `- **Tool:** ${f.tool}\n`;
      }
      
      if (f.confirmed) {
        md += `- **Status:** ✅ Confirmed by live testing\n`;
      }
      if (f.duplicateCount && f.duplicateCount > 1) {
        md += `- **Duplicate Count:** ${f.duplicateCount}\n`;
      }
      
      md += `\n**Description:**\n${f.description}\n\n`;
      
      if (f.evidence) {
        md += `**Evidence:**\n\`\`\`\n${typeof f.evidence === 'object' ? JSON.stringify(f.evidence, null, 2) : f.evidence}\n\`\`\`\n\n`;
      }
      
      md += '\n';
    });
  });

  return md;
}

async function main() {
  const configPathArg = getArg('--config', ['-c']) || 'config.yaml';


  let resolvedConfigPath = configPathArg;
  if (!fs.existsSync(resolvedConfigPath)) {
    resolvedConfigPath = path.resolve(__dirname, '..', configPathArg);
  }
  if (!fs.existsSync(resolvedConfigPath)) {
    console.error(`Config file not found: ${configPathArg}`);
    process.exit(1);
  }

  const config = loadConfig(resolvedConfigPath);
  const reportDir = config.scanner?.reports?.outputDir || './reports';
  ensureDir(reportDir);

  const mainReportPath = path.join(reportDir, 'security-report.json');
  const liveReportPath = path.join(reportDir, 'live-scan-results.json');
  const browserReportPath = firstExistingPath([
    path.join(reportDir, 'browser-scan-results.json'),
    path.join('./reports', 'browser-scan-results.json')
  ]);

  const mainReport = readJsonIfExists(mainReportPath);
  const liveReport = readJsonIfExists(liveReportPath);
  const browserReport = browserReportPath ? readJsonIfExists(browserReportPath) : null;

  if (!mainReport && !liveReport && !browserReport) {
    console.error('No input reports found. Expected at least one of:');
    console.error(`  - ${mainReportPath}`);
    console.error(`  - ${liveReportPath}`);
    console.error(`  - ${path.join(reportDir, 'browser-scan-results.json')} (or ./reports/browser-scan-results.json)`);
    process.exit(1);
  }

  const allFindings = [];
  const fpToolsUnion = new Map();      
  const fpDuplicateSum = new Map();    
  let seq = 1;

  function addSourceFindings(findingsArr, defaultTool) {
    if (!Array.isArray(findingsArr)) return;

    for (const raw of findingsArr) {
      const normalized = normalizeFinding(raw, { tool: raw?.tool || defaultTool, seq: seq++ });
      allFindings.push(normalized);

      const fp = generateFingerprint(normalized);
      const hash = fp?.hash || null;
      if (!hash) continue;

      const existing = fpToolsUnion.get(hash) || new Set();

      const tools = Array.isArray(raw?.tools) && raw.tools.length > 0
        ? raw.tools
        : [raw?.tool || defaultTool];

      tools.forEach(t => existing.add(String(t)));

      fpToolsUnion.set(hash, existing);

      const inc = (typeof raw?.duplicateCount === 'number' && raw.duplicateCount > 0) ? raw.duplicateCount : 1;
      fpDuplicateSum.set(hash, (fpDuplicateSum.get(hash) || 0) + inc);
    }
  }

  addSourceFindings(mainReport?.findings, 'scanner');
  addSourceFindings(liveReport?.findings, 'live-scanner');
  addSourceFindings(browserReport?.findings, 'browser-scanner');

  if (allFindings.length === 0) {
    console.error('No findings found in input reports.');
    process.exit(1);
  }


  const preStats = getDeduplicationStats(allFindings);

  const deduplicatedFindings = deduplicateFindings(allFindings, {
    similarityThreshold: 0.75,
    useFuzzyMatching: true,
    includeMetadata: true,
    verbose: false
  });

  for (const f of deduplicatedFindings) {
    const fpHash = f._fingerprint;
    if (!fpHash) continue;

    const toolSet = fpToolsUnion.get(fpHash);
    if (toolSet && toolSet.size > 0) {
      const merged = new Set([...(Array.isArray(f.tools) ? f.tools : []), ...toolSet]);
      f.tools = [...merged];
    }

    const sum = fpDuplicateSum.get(fpHash);
    if (typeof sum === 'number' && sum > 0) {
      f.duplicateCount = sum;
    }
  }

  const removed = allFindings.length - deduplicatedFindings.length;
  const reportFindings = deduplicatedFindings;

  const stats = computeStats(reportFindings);

  const deduplicationStats = {
    originalCount: allFindings.length,
    deduplicatedCount: reportFindings.length,
    duplicatesRemoved: removed,
    reductionPercent: allFindings.length > 0 ? Math.round((removed / allFindings.length) * 100) : 0,
    preDedup: preStats
  };

  const riskScore =
    stats.bySeverity.CRITICAL * 10 +
    stats.bySeverity.HIGH * 5 +
    stats.bySeverity.MEDIUM * 2 +
    stats.bySeverity.LOW * 1;

  const metadata = {
    scanDate: new Date().toISOString(),
    duration: mainReport?.metadata?.duration || 'combined',
    target: config.app?.url || mainReport?.metadata?.target || liveReport?.metadata?.target || browserReport?.target || 'unknown',
    appName: config.app?.name || mainReport?.metadata?.appName || 'Unknown App',
    projectId: config.firebase?.projectId || mainReport?.metadata?.projectId || liveReport?.metadata?.projectId || 'unknown',
    scope: mainReport?.metadata?.scope || 'OWASP Top 10:2021 A01-A03',
    sources: {
      scanner: Boolean(mainReport?.findings?.length),
      liveScanner: Boolean(liveReport?.findings?.length),
      browserScanner: Boolean(browserReport?.findings?.length)
    }
  };

  const report = {
    metadata,
    summary: {
      ...stats,
      riskScore,
      riskLevel: riskScore >= 30 ? 'CRITICAL' : riskScore >= 15 ? 'HIGH' : riskScore >= 5 ? 'MEDIUM' : 'LOW',
      deduplication: deduplicationStats
    },
    findings: reportFindings,
    cweCoverage: config.cweCoverage || mainReport?.cweCoverage || browserReport?.cweCoverage || null
  };

  const jsonOut = path.join(reportDir, 'security-report-combined.json');
  const htmlOut = path.join(reportDir, 'security-report-combined.html');
  const mdOut = path.join(reportDir, 'security-report-combined.md');

  fs.writeFileSync(jsonOut, JSON.stringify(report, null, 2));
  fs.writeFileSync(htmlOut, generateHtmlReport(report));
  fs.writeFileSync(mdOut, generateMarkdownReport(report));

  console.log(`\nCombined report written:`);
  console.log(`  - ${jsonOut}`);
  console.log(`  - ${htmlOut}`);
  console.log(`  - ${mdOut}`);
  console.log(`\nDeduplication (combined): ${allFindings.length} → ${reportFindings.length} (removed ${removed})`);
}

main().catch(err => {
  console.error(`Fatal: ${err.message}`);
  process.exit(1);
});
