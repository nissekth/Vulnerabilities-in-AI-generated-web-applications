
const crypto = require('crypto');

// ============================================================================
// CONFIGURATION
// ============================================================================

/**
 * Severity ranking for comparison (higher = more severe)
 */
const SEVERITY_RANK = {
  'CRITICAL': 5,
  'HIGH': 4,
  'MEDIUM': 3,
  'LOW': 2,
  'INFO': 1
};

/**
 * Tool reliability/detail ranking (higher = more detailed/reliable)
 * Used to prefer one tool's description over another when merging
 */
const TOOL_RELIABILITY = {
  'live-scanner': 10,       // Actually exploited - most reliable
  'firebase-emulator': 9,   // Tested against real rules
  'xss-verifier': 8,        // Browser-verified XSS
  'browser-scanner': 7,     // Authenticated browser scan
  'zap': 6,                 // OWASP ZAP findings
  'semgrep': 5,             // Static code analysis
  'static-analysis': 4,     // Rule static analysis
  'crypto-scanner': 4,      // Cryptographic analysis
  'injection-scanner': 4,   // Injection testing
  'sca': 3,                 // Dependency vulnerabilities
  'scanner': 2,             // Generic scanner
  'unknown': 1
};

// Tool name aliases -> canonical tool name
const TOOL_ALIASES = {
  // ZAP
  'owasp-zap': 'zap',
  'zaproxy': 'zap',
  'zap': 'zap',

  // SCA
  'npm-audit': 'sca',
  'sca': 'sca',

  // Semgrep variants
  'semgrep-security': 'semgrep',
  'semgrep-javascript': 'semgrep',
  'semgrep-react': 'semgrep',
  'semgrep-custom': 'semgrep',
  'semgrep': 'semgrep',

  // Keep these as-is
  'browser-scanner': 'browser-scanner',
  'live-scanner': 'live-scanner',
  'firebase-emulator': 'firebase-emulator',
  'xss-verifier': 'xss-verifier',
  'static-analysis': 'static-analysis',
  'crypto-scanner': 'crypto-scanner',
  'injection-scanner': 'injection-scanner',
  'scanner': 'scanner'
};

function canonicalTool(tool) {
  const t = (tool || 'unknown').toString().trim().toLowerCase();
  return TOOL_ALIASES[t] || t;
}


// ============================================================================
// FINGERPRINT GENERATION
// ============================================================================

/**
 * Normalize a string for comparison (lowercase, remove extra whitespace, etc.)
 */
function normalizeString(str) {
  if (!str) return '';
  return str
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .replace(/['"]/g, '')
    .trim();
}

/**
 * Extract location information from evidence object
 * Returns a normalized location string representing WHERE the vulnerability exists
 */
function extractLocation(evidence) {
  if (!evidence) return '';
  
  const locationParts = [];
  
  // Include ALL location-relevant fields to be as specific as possible
  
  // Firebase collection
  if (evidence.collection) {
    locationParts.push(`collection:${evidence.collection}`);
  }
  
  // File path
  if (evidence.file || evidence.filePath) {
    locationParts.push(`file:${evidence.file || evidence.filePath}`);
  }
  
  // Line number - important for code-level specificity
  if (evidence.line || evidence.lineNumber || evidence.start?.line) {
    locationParts.push(`line:${evidence.line || evidence.lineNumber || evidence.start?.line}`);
  }
  
  // URL path
  if (evidence.url) {
    locationParts.push(`url:${evidence.url}`);
  }
  
  // Specific field
  if (evidence.field) {
    locationParts.push(`field:${evidence.field}`);
  }
  
  // Rule text (normalized) - critical for rule-based findings
  if (evidence.rule) {
    locationParts.push(`rule:${normalizeString(evidence.rule).substring(0, 100)}`);
  }
  
  // Storage path
  if (evidence.storagePath || evidence.path) {
    locationParts.push(`path:${evidence.storagePath || evidence.path}`);
  }
  
  // Parameter name (for injection vulns)
  if (evidence.parameter || evidence.param) {
    locationParts.push(`param:${evidence.parameter || evidence.param}`);
  }
  
  // Endpoint
  if (evidence.endpoint) {
    locationParts.push(`endpoint:${evidence.endpoint}`);
  }
  
  return locationParts.sort().join('|');
}

/**
 * Extract the core vulnerability identifier from a finding
 * This captures WHAT the vulnerability is (not just CWE, but the specific issue)
 * 
 * IMPORTANT: We normalize away payload variations because multiple payloads
 * testing the same vulnerability should be merged. For example:
 * - Template injection with {{7*7}} vs ${7*7} = same vuln
 * - Sandbox escape with Python vs Node.js = same vuln
 * - XSS with <script> vs <img onerror> = same vuln
 */
function extractVulnerabilityIdentifier(finding) {
  const parts = [];
  
  // The specific rule that's vulnerable (for Firestore rules)
  if (finding.evidence?.rule) {
    parts.push(`rule:${normalizeString(finding.evidence.rule).substring(0, 100)}`);
  }
  
  // For template injection / code execution - normalize the "expected" result
  // because different payloads that produce same result = same vuln
  if (finding.evidence?.expected) {
    parts.push(`expected:${finding.evidence.expected}`);
  }
  
  // For framework-based findings, the framework type matters but not the specific payload
  // e.g., "Angular sandbox escape" is the vuln, not the specific bypass technique
  if (finding.evidence?.framework) {
    // Normalize framework names that are really the same vulnerability class
    let framework = finding.evidence.framework.toLowerCase();
    
    // Angular sandbox escape is its own category (more severe)
    if (framework.includes('sandbox') && (framework.includes('escape') || framework.includes('bypass'))) {
      framework = 'sandbox-escape';
    }
    // ALL template injection syntaxes are the same fundamental vulnerability
    else if (framework.includes('angular') || framework.includes('vue') ||
             framework.includes('template') || framework.includes('ejs') ||
             framework.includes('pug') || framework.includes('jade') ||
             framework.includes('jinja') || framework.includes('twig') ||
             framework.includes('literal')) {
      framework = 'template-injection';
    }
    parts.push(`framework:${framework}`);
  }
  
  // For code execution / sandbox escapes - the vuln type matters, not the language
  if (finding.evidence?.language || finding.evidence?.technique) {
    // Don't include - this would differentiate python vs node exploits
    // which are the same vulnerability
  }
  
  // DON'T include payload - multiple payloads testing same vuln = one vuln
  // if (finding.evidence?.payload) { ... }
  
  // Affected field(s) - this DOES differentiate vulns
  if (finding.evidence?.field) {
    parts.push(`field:${finding.evidence.field}`);
  }
  if (finding.evidence?.fields && Array.isArray(finding.evidence.fields)) {
    parts.push(`fields:${finding.evidence.fields.sort().join(',')}`);
  }
  
  // Specific vulnerable pattern/code from SAST
  if (finding.evidence?.code) {
    // Normalize the code to group similar patterns
    const normalizedCode = normalizeString(finding.evidence.code).substring(0, 80);
    parts.push(`code:${normalizedCode}`);
  }
  
  return parts.join('|');
}

/**
 * Normalize the vulnerability title to group related findings
 * This helps merge findings that describe the same vuln differently
 */
function normalizeVulnTitle(title) {
  if (!title) return '';
  
  let normalized = title.toLowerCase().trim();
  
  // Normalize template injection variants - ALL of these are the same vuln
  if (normalized.includes('template injection') || 
      normalized.includes('template expression') ||
      normalized.includes('ssti')) {
    // Angular sandbox escape is a specific type of template injection
    if (normalized.includes('sandbox escape') || normalized.includes('sandbox bypass')) {
      return 'template injection sandbox escape';
    }
    // All other template injections are the same vulnerability
    return 'template injection';
  }
  
  // Normalize sandbox/code execution variants
  if (normalized.includes('sandbox escape') || 
      normalized.includes('code execution') ||
      normalized.includes('rce') ||
      normalized.includes('command execution')) {
    return 'code execution';
  }
  
  // Normalize XSS variants
  if (normalized.includes('xss') || normalized.includes('cross-site scripting')) {
    if (normalized.includes('stored')) return 'stored xss';
    if (normalized.includes('reflected')) return 'reflected xss';
    if (normalized.includes('dom')) return 'dom xss';
    return 'xss';
  }
  
  // Normalize SQL injection variants
  if (normalized.includes('sql injection') || normalized.includes('sqli')) {
    return 'sql injection';
  }
  
  // For other titles, just normalize whitespace and case
  return normalizeString(normalized).substring(0, 80);
}

/**
 * Extract key vulnerability indicators from title and description
 */
function extractVulnIndicators(finding) {
  const indicators = [];
  const text = `${finding.title || ''} ${finding.description || ''}`.toLowerCase();
  
  // Common vulnerability patterns
  const patterns = [
    /privilege\s*escalation/i,
    /cross[\s-]*user/i,
    /unauthorized\s*access/i,
    /public\s*read/i,
    /public\s*write/i,
    /missing\s*auth/i,
    /no\s*owner\s*check/i,
    /admin\s*bypass/i,
    /idor/i,
    /xss/i,
    /injection/i,
    /sensitive\s*data/i,
    /pii\s*exposure/i,
    /cleartext/i,
    /weak\s*(hash|crypto|encryption)/i,
    /hardcoded\s*(key|secret|password)/i,
    /insecure\s*storage/i,
    /csrf/i,
    /open\s*redirect/i
  ];
  
  patterns.forEach(pattern => {
    if (pattern.test(text)) {
      indicators.push(pattern.source.replace(/\\s\*/g, '-').replace(/[\[\]\\^$]/g, ''));
    }
  });
  
  return indicators.sort().join(',');
}

/**
 * Generate a unique fingerprint for a finding
 * 
 * DEDUPLICATION PHILOSOPHY:
 * Only merge findings that represent the EXACT SAME vulnerability.
 * 
 * Key insight: The same vulnerability tested with different payloads/techniques
 * is still ONE vulnerability. For example:
 * - Template injection tested with {{7*7}} and ${7*7} = 1 vulnerability
 * - Sandbox escape via Python and Node.js = 1 vulnerability  
 * - XSS via <script> and <img onerror> = 1 vulnerability
 * 
 * But different vulnerabilities are kept separate:
 * - XSS in username field vs XSS in bio field = 2 vulnerabilities
 * - Template injection vs SQL injection = 2 vulnerabilities
 */
function generateFingerprint(finding) {
  const components = [];
  
  // 1. CWE is required
  const cwe = (finding.cwe || 'UNKNOWN').toUpperCase();
  components.push(`cwe:${cwe}`);
  
  // 2. Category
  const category = (finding.category || 'UNKNOWN').toUpperCase();
  components.push(`cat:${category}`);
  
  // 3. Location - WHERE the vulnerability is
  const location = extractLocation(finding.evidence);
  if (location) {
    components.push(`loc:${location}`);
  }
  
  // 4. Vulnerability identifier - WHAT specific thing is vulnerable
  // This normalizes away payload variations
  const vulnId = extractVulnerabilityIdentifier(finding);
  if (vulnId) {
    components.push(`vuln:${vulnId}`);
  }
  
  // 5. Normalized title - helps group related findings
  // Uses normalizeVulnTitle to group "Template injection (Angular)" 
  // with "Template injection (Vue)" etc.
  const normalizedTitle = normalizeVulnTitle(finding.title);
  if (normalizedTitle) {
    components.push(`title:${normalizedTitle}`);
  }
  
  // Join and hash
  const fingerprintSource = components.join('||');
  const hash = crypto.createHash('md5').update(fingerprintSource).digest('hex').substring(0, 16);
  
  return {
    hash,
    source: fingerprintSource,
    components: {
      cwe,
      category,
      location,
      vulnId,
      title: normalizedTitle
    }
  };
}

// ============================================================================
// SIMILARITY DETECTION
// ============================================================================

/**
 * Calculate similarity between two fingerprints (0-1)
 * 
 * This is used for fuzzy matching when exact fingerprints don't match.
 * We use a HIGH threshold (default 0.90) because we only want to merge
 * findings that are clearly the same vulnerability described differently.
 */
function calculateSimilarity(fp1, fp2) {
  const c1 = fp1.components;
  const c2 = fp2.components;
  
  // MUST have same CWE - non-negotiable
  if (c1.cwe !== c2.cwe) {
    return 0;
  }
  
  // MUST have same category
  if (c1.category !== c2.category) {
    return 0;
  }
  
  let score = 0;
  let maxScore = 0;
  
  // CWE match (already verified above)
  maxScore += 20;
  score += 20;
  
  // Category match (already verified above)
  maxScore += 10;
  score += 10;
  
  // Location match - very important
  maxScore += 35;
  if (c1.location && c2.location) {
    if (c1.location === c2.location) {
      score += 35; // Exact match
    } else {
      // Partial match - check overlap
      const loc1Parts = new Set(c1.location.split('|'));
      const loc2Parts = new Set(c2.location.split('|'));
      const intersection = [...loc1Parts].filter(x => loc2Parts.has(x));
      const union = new Set([...loc1Parts, ...loc2Parts]);
      if (union.size > 0) {
        score += 35 * (intersection.length / union.size);
      }
    }
  } else if (!c1.location && !c2.location) {
    score += 17.5; // Both have no location - partial credit
  }
  
  // Vulnerability identifier match - important
  maxScore += 25;
  if (c1.vulnId && c2.vulnId) {
    if (c1.vulnId === c2.vulnId) {
      score += 25;
    } else {
      const id1Parts = new Set(c1.vulnId.split('|'));
      const id2Parts = new Set(c2.vulnId.split('|'));
      const intersection = [...id1Parts].filter(x => id2Parts.has(x));
      const union = new Set([...id1Parts, ...id2Parts]);
      if (union.size > 0) {
        score += 25 * (intersection.length / union.size);
      }
    }
  } else if (!c1.vulnId && !c2.vulnId) {
    score += 12.5;
  }
  
  // Title similarity - helps catch same issue with different wording
  maxScore += 10;
  if (c1.title && c2.title) {
    if (c1.title === c2.title) {
      score += 10;
    } else {
      // Word overlap
      const words1 = new Set(c1.title.split(' ').filter(w => w.length > 2));
      const words2 = new Set(c2.title.split(' ').filter(w => w.length > 2));
      const intersection = [...words1].filter(x => words2.has(x));
      const union = new Set([...words1, ...words2]);
      if (union.size > 0) {
        score += 10 * (intersection.length / union.size);
      }
    }
  }
  
  return score / maxScore;
}

// ============================================================================
// FINDING MERGER
// ============================================================================

/**
 * Merge multiple duplicate findings into a single comprehensive finding
 */
function mergeFindings(duplicates) {
  if (!duplicates || duplicates.length === 0) return null;
  if (duplicates.length === 1) {
    // Single finding - just add tools array
    const f = { ...duplicates[0] };
    f.tools = [f.tool];
    f.duplicateCount = 1;
    return f;
  }
  
  // Sort by tool reliability (most reliable first)
  const sorted = [...duplicates].sort((a, b) => {
    const relA = TOOL_RELIABILITY[canonicalTool(a.tool)] || TOOL_RELIABILITY.unknown;
    const relB = TOOL_RELIABILITY[canonicalTool(b.tool)] || TOOL_RELIABILITY.unknown;
    return relB - relA;
  });
  
  // Start with the most reliable finding
  const primary = sorted[0];
  
  // Merged finding
  const merged = {
    id: primary.id,
    category: primary.category,
    cwe: primary.cwe,
    cweName: primary.cweName,
    
    // Highest severity from all duplicates
    severity: getHighestSeverity(duplicates),
    
    // Use the most reliable tool's title/description
    title: primary.title,
    description: getBestDescription(sorted),
    
    // Combine all evidence
    evidence: mergeEvidence(duplicates),
    
    // Use the most comprehensive remediation
    remediation: getBestRemediation(sorted),
    
    // Track all tools that found this
    tool: primary.tool,
    tools: [...new Set(duplicates.map(d => d.tool))],
    
    // Metadata
    duplicateCount: duplicates.length,
    mergedFrom: duplicates.map(d => ({
      id: d.id,
      tool: d.tool,
      severity: d.severity
    })),
    timestamp: primary.timestamp || new Date().toISOString(),
    
    // Preserve confirmed flag if any tool confirmed it
    confirmed: duplicates.some(d => d.confirmed)
  };
  
  return merged;
}

/**
 * Get the highest severity from a list of findings
 */
function getHighestSeverity(findings) {
  let highest = 'INFO';
  let highestRank = 0;
  
  findings.forEach(f => {
    const rank = SEVERITY_RANK[f.severity] || 0;
    if (rank > highestRank) {
      highestRank = rank;
      highest = f.severity;
    }
  });
  
  return highest;
}

/**
 * Get the best (most detailed) description
 */
function getBestDescription(sortedFindings) {
  // Already sorted by reliability - find the longest description
  let best = sortedFindings[0].description || '';
  
  sortedFindings.forEach(f => {
    if (f.description && f.description.length > best.length) {
      best = f.description;
    }
  });
  
  return best;
}

/**
 * Get the best (most actionable) remediation
 */
function getBestRemediation(sortedFindings) {
  let best = null;
  let bestScore = 0;
  
  sortedFindings.forEach(f => {
    if (!f.remediation) return;
    
    // Score based on length and actionability keywords
    let score = f.remediation.length;
    
    const actionableKeywords = [
      'change to:', 'replace with:', 'add:', 'use:', 
      'implement', 'configure', 'update', 'modify',
      'example:', 'instead of', 'should be'
    ];
    
    actionableKeywords.forEach(kw => {
      if (f.remediation.toLowerCase().includes(kw)) {
        score += 50;
      }
    });
    
    // Tool reliability bonus
    const reliability = TOOL_RELIABILITY[f.tool] || TOOL_RELIABILITY.unknown;
    score += reliability * 10;
    
    if (score > bestScore) {
      bestScore = score;
      best = f.remediation;
    }
  });
  
  return best;
}

/**
 * Merge evidence from multiple findings
 * 
 * When merging findings that tested the same vuln with different payloads,
 * we collect all payloads as proof that multiple techniques work.
 */
function mergeEvidence(findings) {
  const merged = {};
  
  // Collect all unique payloads, frameworks, techniques
  const payloads = new Set();
  const frameworks = new Set();
  const techniques = new Set();
  const languages = new Set();
  
  findings.forEach(f => {
    if (!f.evidence) return;
    
    const evidence = f.evidence;
    
    // Collect payloads/techniques (these show multiple ways to exploit)
    if (evidence.payload) payloads.add(evidence.payload);
    if (evidence.framework) frameworks.add(evidence.framework);
    if (evidence.technique) techniques.add(evidence.technique);
    if (evidence.language) languages.add(evidence.language);
    
    // Merge single-value fields (take first non-null)
    if (evidence.file && !merged.file) merged.file = evidence.file;
    if (evidence.line && !merged.line) merged.line = evidence.line;
    if (evidence.rule && !merged.rule) merged.rule = evidence.rule;
    if (evidence.collection && !merged.collection) merged.collection = evidence.collection;
    if (evidence.expected && !merged.expected) merged.expected = evidence.expected;
    if (evidence.url && !merged.url) merged.url = evidence.url;
    if (evidence.endpoint && !merged.endpoint) merged.endpoint = evidence.endpoint;
    
    // Merge arrays
    if (evidence.files) {
      merged.files = merged.files || [];
      merged.files.push(...evidence.files);
    }
    if (evidence.field) {
      merged.fields = merged.fields || [];
      if (!merged.fields.includes(evidence.field)) {
        merged.fields.push(evidence.field);
      }
    }
    if (evidence.urls) {
      merged.urls = merged.urls || [];
      evidence.urls.forEach(u => {
        if (!merged.urls.includes(u)) merged.urls.push(u);
      });
    }
    
    // Before/after data
    if (evidence.before !== undefined) merged.before = evidence.before;
    if (evidence.after !== undefined) merged.after = evidence.after;
  });
  
  // Add collected sets as arrays (showing multiple exploitation techniques)
  if (payloads.size > 0) {
    merged.payloads = [...payloads];
    merged.payloadCount = payloads.size;
  }
  if (frameworks.size > 0) {
    merged.frameworks = [...frameworks];
  }
  if (techniques.size > 0) {
    merged.techniques = [...techniques];
  }
  if (languages.size > 0) {
    merged.languages = [...languages];
  }
  
  // Dedupe arrays
  if (merged.files) {
    merged.files = [...new Set(merged.files)];
  }
  
  return Object.keys(merged).length > 0 ? merged : null;
}

// ============================================================================
// MAIN DEDUPLICATION FUNCTION
// ============================================================================

/**
 * Configuration options for deduplication
 */
const DEFAULT_OPTIONS = {
  // Similarity threshold for fuzzy matching (0-1)
  // Default is HIGH (0.90) because we only want to merge truly identical issues
  // Lower this if you want more aggressive deduplication
  similarityThreshold: 0.90,
  
  // Whether to use fuzzy matching in addition to exact fingerprints
  useFuzzyMatching: true,
  
  // Whether to include deduplication metadata in output
  includeMetadata: true,
  
  // Whether to log deduplication stats
  verbose: false
};

/**
 * Main deduplication function
 * 
 * @param {Array} findings - Array of finding objects from various scanners
 * @param {Object} options - Configuration options
 * @returns {Array} Deduplicated array of findings
 */
function deduplicateFindings(findings, options = {}) {
  const opts = { ...DEFAULT_OPTIONS, ...options };
  
  if (!findings || findings.length === 0) {
    return [];
  }
  
  // Normalize tool names to canonical values so merging & reliability works consistently
  findings = findings.map(f => {
    const tool = canonicalTool(f.tool);
    const tools = Array.isArray(f.tools) ? [...new Set(f.tools.map(canonicalTool))] : f.tools;
    return { ...f, tool, tools };
  });

  
  // Step 1: Generate fingerprints for all findings
  const fingerprintedFindings = findings.map(f => ({
    finding: f,
    fingerprint: generateFingerprint(f)
  }));
  
  // Step 2: Group by exact fingerprint hash
  const groups = new Map();
  
  fingerprintedFindings.forEach(({ finding, fingerprint }) => {
    const hash = fingerprint.hash;
    
    if (!groups.has(hash)) {
      groups.set(hash, {
        fingerprint,
        findings: []
      });
    }
    
    groups.get(hash).findings.push(finding);
  });
  
  // Step 3: Fuzzy matching to merge similar groups
  if (opts.useFuzzyMatching) {
    const groupArray = [...groups.entries()];
    const merged = new Set();
    
    for (let i = 0; i < groupArray.length; i++) {
      if (merged.has(groupArray[i][0])) continue;
      
      for (let j = i + 1; j < groupArray.length; j++) {
        if (merged.has(groupArray[j][0])) continue;
        
        const similarity = calculateSimilarity(
          groupArray[i][1].fingerprint,
          groupArray[j][1].fingerprint
        );
        
        if (similarity >= opts.similarityThreshold) {
          // Merge group j into group i
          groupArray[i][1].findings.push(...groupArray[j][1].findings);
          merged.add(groupArray[j][0]);
          groups.delete(groupArray[j][0]);
        }
      }
    }
  }
  
  // Step 4: Merge each group into a single finding
  const deduplicated = [];
  
  groups.forEach((group) => {
    const merged = mergeFindings(group.findings);
    if (merged) {
      // Add fingerprint info if requested
      if (opts.includeMetadata) {
        merged._fingerprint = group.fingerprint.hash;
        merged._fingerprintSource = group.fingerprint.source;
      }
      deduplicated.push(merged);
    }
  });
  
  // Step 5: Sort by severity and category
  deduplicated.sort((a, b) => {
    // First by severity (CRITICAL first)
    const sevDiff = (SEVERITY_RANK[b.severity] || 0) - (SEVERITY_RANK[a.severity] || 0);
    if (sevDiff !== 0) return sevDiff;
    
    // Then by category (A01, A02, A03)
    const catDiff = (a.category || '').localeCompare(b.category || '');
    if (catDiff !== 0) return catDiff;
    
    // Then by CWE
    return (a.cwe || '').localeCompare(b.cwe || '');
  });
  
  // Re-assign IDs
  deduplicated.forEach((f, i) => {
    f.id = `VULN-${String(i + 1).padStart(3, '0')}`;
  });
  
  // Log stats if verbose
  if (opts.verbose) {
    console.log(`\n[Deduplication Stats]`);
    console.log(`  Input findings: ${findings.length}`);
    console.log(`  Output findings: ${deduplicated.length}`);
    console.log(`  Duplicates removed: ${findings.length - deduplicated.length}`);
    console.log(`  Reduction: ${Math.round((1 - deduplicated.length / findings.length) * 100)}%`);
  }
  
  return deduplicated;
}

/**
 * Get deduplication statistics without modifying findings
 */
function getDeduplicationStats(findings, options = {}) {
  const opts = { ...DEFAULT_OPTIONS, ...options };
  
  // Generate fingerprints
  const fingerprints = findings.map(f => generateFingerprint(f));
  
  // Count unique fingerprints
  const uniqueHashes = new Set(fingerprints.map(fp => fp.hash));
  
  // Group by CWE
  const byCwe = {};
  findings.forEach(f => {
    const cwe = f.cwe || 'UNKNOWN';
    byCwe[cwe] = (byCwe[cwe] || 0) + 1;
  });
  
  // Group by tool
  const byTool = {};
  findings.forEach(f => {
    const tool = f.tool || 'unknown';
    byTool[tool] = (byTool[tool] || 0) + 1;
  });
  
  // Find most duplicated
  const hashCounts = {};
  fingerprints.forEach(fp => {
    hashCounts[fp.hash] = (hashCounts[fp.hash] || 0) + 1;
  });
  const maxDuplicates = Math.max(...Object.values(hashCounts));
  
  return {
    totalFindings: findings.length,
    uniqueFindings: uniqueHashes.size,
    duplicates: findings.length - uniqueHashes.size,
    reductionPercent: Math.round((1 - uniqueHashes.size / findings.length) * 100),
    byCwe,
    byTool,
    maxDuplicatesForSingleVuln: maxDuplicates
  };
}

// ============================================================================
// EXPORTS
// ============================================================================

module.exports = {
  deduplicateFindings,
  getDeduplicationStats,
  generateFingerprint,
  calculateSimilarity,
  mergeFindings,
  SEVERITY_RANK,
  TOOL_RELIABILITY
};
