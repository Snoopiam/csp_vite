#!/usr/bin/env node
// ============================================================================
// VITE CSP CONFIGURATION AUTOMATION SCRIPT
// ============================================================================
//
// PRIORITY 1: Automated Task System (Immediate Use)
//
// This Node.js script automatically adds Content Security Policy configuration
// to Vite projects without requiring any npm packages or dependencies.
//
// Usage:
//   node add-csp.js                    # Add full CSP configuration
//   node add-csp.js --add-source       # Interactive: Add a new CSP source
//
// Features:
//   ✓ Zero dependencies (uses only Node.js built-ins)
//   ✓ Automatic backup creation before modifications
//   ✓ Supports vite.config.ts, .js, and .mjs
//   ✓ Interactive prompts for adding sources
//   ✓ Intelligent code insertion (preserves imports)
//
// Requirements:
//   - Node.js v14 or higher
//   - Vite project with vite.config file
//
// ============================================================================

const fs = require('fs');
const path = require('path');
const readline = require('readline');

// ============================================================================
// CSP POLICY TEMPLATE
// ============================================================================

const CSP_POLICY_CODE = `
// ============================================================================
// CONTENT SECURITY POLICY (CSP) CONFIGURATION
// ============================================================================
//
// Debugging CSP errors:
// 1. Open Chrome DevTools → Console
// 2. Look for "Refused to load" or "violates Content Security Policy"
// 3. The error tells you which directive blocked the resource
// 4. Add the source to the appropriate array below
//
// ============================================================================

const CSP_POLICY = {
  // default-src: Fallback for any directive not explicitly set
  // 'self' = Same origin, localhost:* = Any local port, ws: = WebSocket for HMR
  'default-src': ["'self'", 'http://localhost:*', 'ws://localhost:*'],

  // script-src: Controls which scripts can execute
  // Add new CDNs here when you get script-related CSP errors
  'script-src': [
    "'self'",
    "'unsafe-inline'",    // Required for inline scripts, Tailwind JIT
    "'unsafe-eval'",      // Required for some bundlers and libraries
    'http://localhost:*', // Vite dev server
    'https://cdn.tailwindcss.com',  // Tailwind CSS CDN
    'https://cdn.jsdelivr.net',     // Popular CDN for npm packages
  ],

  // style-src: Controls which stylesheets can load
  'style-src': [
    "'self'",
    "'unsafe-inline'",               // Required for Tailwind, inline styles
    'https://fonts.googleapis.com',  // Google Fonts CSS
  ],

  // font-src: Controls which fonts can load
  'font-src': [
    "'self'",
    'https://fonts.gstatic.com',  // Google Fonts files
    'data:',                       // Inline base64 fonts
  ],

  // img-src: Controls which images can load
  'img-src': [
    "'self'",
    'data:',              // Base64 images (favicon, inline SVGs)
    'blob:',              // Generated images, canvas.toBlob()
    'https:',             // Any external HTTPS images
    'http://localhost:*', // Local dev server images
  ],

  // connect-src: Controls fetch(), XHR, WebSocket connections
  // THIS IS WHERE YOU ADD API ENDPOINTS!
  'connect-src': [
    "'self'",
    'http://localhost:*',                        // Local API servers
    'ws://localhost:*',                          // Vite HMR WebSocket
  ],

  // worker-src: Controls Web Workers and Service Workers
  'worker-src': [
    "'self'",
    'blob:',  // Required for libraries like gif.js
  ],
};

// Converts the CSP_POLICY object into a valid CSP header string
const buildCSPString = (policy: Record<string, string[]>): string =>
  Object.entries(policy)
    .map(([directive, sources]) => \`\${directive} \${sources.join(' ')}\`)
    .join('; ');
`;

const VITE_CONFIG_HEADER = `import { defineConfig } from 'vite';
`;

const VITE_CONFIG_SERVER = `
  server: {
    headers: {
      'Content-Security-Policy': buildCSPString(CSP_POLICY),
    },
  },`;

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

function findViteConfig() {
  const possibleFiles = [
    'vite.config.ts',
    'vite.config.js',
    'vite.config.mjs',
  ];

  for (const file of possibleFiles) {
    if (fs.existsSync(file)) {
      return file;
    }
  }

  return null;
}

function backupFile(filePath) {
  const backup = `${filePath}.backup.${Date.now()}`;
  fs.copyFileSync(filePath, backup);
  console.log(`✅ Backup created: ${backup}`);
  return backup;
}

function addCSPConfiguration() {
  console.log('🚀 Vite CSP Configuration Automation\n');

  const viteConfigPath = findViteConfig();

  if (!viteConfigPath) {
    console.error('❌ ERROR: No vite.config file found!');
    console.log('\nSearched for:');
    console.log('  - vite.config.ts');
    console.log('  - vite.config.js');
    console.log('  - vite.config.mjs');
    process.exit(1);
  }

  console.log(`📝 Found: ${viteConfigPath}\n`);

  // Read existing config
  let content = fs.readFileSync(viteConfigPath, 'utf8');

  // Check if CSP already exists
  if (content.includes('CSP_POLICY')) {
    console.log('⚠️  CSP configuration already exists in this file!');
    console.log('   Remove it first if you want to regenerate.\n');
    process.exit(0);
  }

  // Backup original file
  backupFile(viteConfigPath);

  // Insert CSP policy at the top (after imports)
  const importRegex = /^(import[\s\S]*?from\s+['"][^'"]+['"];?\s*)+/m;
  const match = content.match(importRegex);

  let newContent;
  if (match) {
    const insertPoint = match[0].length;
    newContent =
      content.slice(0, insertPoint) +
      '\n' +
      CSP_POLICY_CODE +
      '\n' +
      content.slice(insertPoint);
  } else {
    newContent = CSP_POLICY_CODE + '\n' + content;
  }

  // Add server.headers to the config
  const configRegex = /export\s+default\s+defineConfig\s*\(\s*\{/;
  if (configRegex.test(newContent)) {
    newContent = newContent.replace(
      configRegex,
      `export default defineConfig({${VITE_CONFIG_SERVER}`
    );
  } else {
    console.log('⚠️  Could not automatically add server headers.');
    console.log('   Please manually add the following to your config:\n');
    console.log(VITE_CONFIG_SERVER);
  }

  // Write updated config
  fs.writeFileSync(viteConfigPath, newContent, 'utf8');

  console.log('✅ CSP configuration added successfully!\n');
  console.log('Next steps:');
  console.log('  1. Review the CSP_POLICY object in your vite.config');
  console.log('  2. Add any project-specific sources');
  console.log('  3. Remove any <meta> CSP tags from index.html');
  console.log('  4. Restart your dev server\n');
  console.log('Run "Vite: Add CSP Source" task to add sources interactively.\n');
}

async function addCSPSource() {
  console.log('🔧 Add CSP Source Interactively\n');

  const viteConfigPath = findViteConfig();

  if (!viteConfigPath) {
    console.error('❌ ERROR: No vite.config file found!');
    process.exit(1);
  }

  let content = fs.readFileSync(viteConfigPath, 'utf8');

  if (!content.includes('CSP_POLICY')) {
    console.error('❌ ERROR: CSP_POLICY not found in config!');
    console.log('   Run "Vite: Add CSP Configuration" first.\n');
    process.exit(1);
  }

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  const question = (prompt) => new Promise((resolve) => rl.question(prompt, resolve));

  console.log('Which directive do you want to add to?\n');
  console.log('1. script-src (JavaScript/CDNs)');
  console.log('2. style-src (Stylesheets)');
  console.log('3. font-src (Fonts)');
  console.log('4. connect-src (APIs/WebSocket)');
  console.log('5. img-src (Images)');
  console.log('6. worker-src (Web Workers)\n');

  const choice = await question('Enter number (1-6): ');
  const directiveMap = {
    '1': 'script-src',
    '2': 'style-src',
    '3': 'font-src',
    '4': 'connect-src',
    '5': 'img-src',
    '6': 'worker-src',
  };

  const directive = directiveMap[choice.trim()];
  if (!directive) {
    console.error('❌ Invalid choice!');
    rl.close();
    process.exit(1);
  }

  const source = await question(`\nEnter source URL (e.g., 'https://api.example.com'): `);
  rl.close();

  if (!source.trim()) {
    console.error('❌ No source provided!');
    process.exit(1);
  }

  // Backup and modify
  backupFile(viteConfigPath);

  // Find the directive array and add the source
  const directiveRegex = new RegExp(`'${directive}':\\s*\\[([^\\]]*)\\]`, 's');
  const match = content.match(directiveRegex);

  if (match) {
    const originalArray = match[1];
    const newSource = `'${source.trim()}'`;

    // Add before the closing bracket, with proper formatting
    const updatedArray = originalArray.trimEnd() + `,\n    ${newSource},`;
    content = content.replace(directiveRegex, `'${directive}': [${updatedArray}]`);

    fs.writeFileSync(viteConfigPath, content, 'utf8');

    console.log(`\n✅ Added ${newSource} to ${directive}`);
    console.log('   Restart your dev server to apply changes.\n');
  } else {
    console.error(`❌ Could not find '${directive}' in CSP_POLICY`);
    process.exit(1);
  }
}

// ============================================================================
// MAIN
// ============================================================================

const args = process.argv.slice(2);

if (args.includes('--add-source')) {
  addCSPSource().catch(console.error);
} else {
  addCSPConfiguration();
}
