const fs = require('fs');
const path = require('path');
const yaml = require('yaml');


function outputResult(findings, error = null) {
  if (error) {
    console.log(JSON.stringify([{
      category: 'ERROR',
      cwe: 'N/A',
      severity: 'ERROR',
      title: 'Emulator Test Error',
      description: error.message || String(error),
      evidence: error.stack || null,
      remediation: 'Check emulator setup and config file'
    }]));
    process.exit(1);
  }
  console.log(JSON.stringify(findings));
  process.exit(0);
}

(async () => {
  try {
    const args = process.argv.slice(2);
    const configIndex = args.indexOf('--config');
    const debug = args.includes('--debug');
    
    let configPath = configIndex !== -1 ? args[configIndex + 1] : null;
    
    if (!configPath) {
      throw new Error('No --config argument provided');
    }
    
    configPath = path.resolve(configPath);
    
    if (debug) {
      console.error(`Config path: ${configPath}`);
      console.error(`CWD: ${process.cwd()}`);
      console.error(`Dir: ${__dirname}`);
    }
    
    if (!fs.existsSync(configPath)) {
      throw new Error(`Config file not found: ${configPath}`);
    }

   
    const configContent = fs.readFileSync(configPath, 'utf8');
    const config = yaml.parse(configContent);
    
    if (debug) {
      console.error(`Config loaded, has firestoreRules: ${!!config.firestoreRules}`);
      console.error(`Config loaded, has storageRules: ${!!config.storageRules}`);
    }
    let runFirestoreEmulatorTests, runStorageEmulatorTests;
    
    try {
      ({ runFirestoreEmulatorTests } = require('./firestore-emulator-tests'));
    } catch (e) {
      throw new Error(`Cannot load firestore-emulator-tests.js: ${e.message}`);
    }
    
    try {
      ({ runStorageEmulatorTests } = require('./storage-emulator-tests'));
    } catch (e) {
      throw new Error(`Cannot load storage-emulator-tests.js: ${e.message}`);
    }

    // Run tests
    const findings = [];
    
    if (debug) console.error("Running Firestore emulator tests...");
    const firestoreFindings = await runFirestoreEmulatorTests(config);
    findings.push(...firestoreFindings);
    if (debug) console.error("Firestore tests found ${firestoreFindings.length} issues");
    
    if (debug) console.error("Running Storage emulator tests...");
    const storageFindings = await runStorageEmulatorTests(config);
    findings.push(...storageFindings);
    if (debug) console.error(" Storage tests found ${storageFindings.length} issues");

    outputResult(findings);

  } catch (err) {
    outputResult(null, err);
  }
})();
