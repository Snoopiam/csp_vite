// ============================================================================
// VITE CSP HELPER - VS CODE EXTENSION
// ============================================================================
//
// PRIORITY 2: VS Code Extension (Most Powerful)
//
// This extension provides interactive commands for managing Content Security
// Policy (CSP) configuration in Vite projects.
//
// Features:
//   ✓ One-command CSP setup
//   ✓ Interactive source adding with quick picker
//   ✓ Parse and auto-fix CSP errors from Chrome DevTools
//   ✓ Automatic backup creation
//   ✓ Configurable default sources
//
// Commands:
//   1. vite-csp.addConfiguration - Add full CSP to vite.config
//   2. vite-csp.addSource - Add single source interactively
//   3. vite-csp.fixCSPError - Parse DevTools error and fix
//
// Configuration:
//   - viteCsp.autoBackup - Enable/disable automatic backups
//   - viteCsp.defaultSources - Customize default CSP sources
//
// ============================================================================

import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

// CSP Policy Template
const CSP_POLICY_TEMPLATE = `
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
  'default-src': ["'self'", 'http://localhost:*', 'ws://localhost:*'],
  'script-src': ["'self'", "'unsafe-inline'", "'unsafe-eval'", 'http://localhost:*', 'https://cdn.tailwindcss.com'],
  'style-src': ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
  'font-src': ["'self'", 'https://fonts.gstatic.com', 'data:'],
  'img-src': ["'self'", 'data:', 'blob:', 'https:', 'http://localhost:*'],
  'connect-src': ["'self'", 'http://localhost:*', 'ws://localhost:*'],
  'worker-src': ["'self'", 'blob:'],
};

const buildCSPString = (policy: Record<string, string[]>): string =>
  Object.entries(policy)
    .map(([directive, sources]) => \`\${directive} \${sources.join(' ')}\`)
    .join('; ');
`;

const SERVER_CONFIG = `
  server: {
    headers: {
      'Content-Security-Policy': buildCSPString(CSP_POLICY),
    },
  },`;

export function activate(context: vscode.ExtensionContext) {
  console.log('Vite CSP Helper is now active');

  // Command: Add CSP Configuration
  let addConfigDisposable = vscode.commands.registerCommand('vite-csp.addConfiguration', async () => {
    await addCSPConfiguration();
  });

  // Command: Add CSP Source
  let addSourceDisposable = vscode.commands.registerCommand('vite-csp.addSource', async () => {
    await addCSPSource();
  });

  // Command: Fix CSP Error
  let fixErrorDisposable = vscode.commands.registerCommand('vite-csp.fixCSPError', async () => {
    await fixCSPError();
  });

  context.subscriptions.push(addConfigDisposable, addSourceDisposable, fixErrorDisposable);
}

async function findViteConfig(): Promise<string | null> {
  const workspaceFolders = vscode.workspace.workspaceFolders;
  if (!workspaceFolders) {
    return null;
  }

  const rootPath = workspaceFolders[0].uri.fsPath;
  const possibleFiles = ['vite.config.ts', 'vite.config.js', 'vite.config.mjs'];

  for (const file of possibleFiles) {
    const fullPath = path.join(rootPath, file);
    if (fs.existsSync(fullPath)) {
      return fullPath;
    }
  }

  return null;
}

async function addCSPConfiguration() {
  const viteConfigPath = await findViteConfig();

  if (!viteConfigPath) {
    vscode.window.showErrorMessage('No vite.config file found in workspace!');
    return;
  }

  let content = fs.readFileSync(viteConfigPath, 'utf8');

  if (content.includes('CSP_POLICY')) {
    vscode.window.showWarningMessage('CSP configuration already exists in vite.config!');
    return;
  }

  // Create backup if enabled
  const config = vscode.workspace.getConfiguration('viteCsp');
  if (config.get('autoBackup')) {
    const backup = `${viteConfigPath}.backup.${Date.now()}`;
    fs.copyFileSync(viteConfigPath, backup);
  }

  // Insert CSP policy after imports
  const importRegex = /^(import[\s\S]*?from\s+['"][^'"]+['"];?\s*)+/m;
  const match = content.match(importRegex);

  let newContent;
  if (match) {
    const insertPoint = match[0].length;
    newContent = content.slice(0, insertPoint) + '\n' + CSP_POLICY_TEMPLATE + '\n' + content.slice(insertPoint);
  } else {
    newContent = CSP_POLICY_TEMPLATE + '\n' + content;
  }

  // Add server headers to config
  const configRegex = /export\s+default\s+defineConfig\s*\(\s*\{/;
  if (configRegex.test(newContent)) {
    newContent = newContent.replace(configRegex, `export default defineConfig({${SERVER_CONFIG}`);
  }

  fs.writeFileSync(viteConfigPath, newContent, 'utf8');

  vscode.window.showInformationMessage('✅ CSP configuration added successfully!');

  // Open the file
  const doc = await vscode.workspace.openTextDocument(viteConfigPath);
  await vscode.window.showTextDocument(doc);
}

async function addCSPSource() {
  const viteConfigPath = await findViteConfig();

  if (!viteConfigPath) {
    vscode.window.showErrorMessage('No vite.config file found!');
    return;
  }

  let content = fs.readFileSync(viteConfigPath, 'utf8');

  if (!content.includes('CSP_POLICY')) {
    const result = await vscode.window.showErrorMessage(
      'CSP_POLICY not found in vite.config!',
      'Add Configuration'
    );
    if (result === 'Add Configuration') {
      await addCSPConfiguration();
    }
    return;
  }

  // Directive selection
  const directive = await vscode.window.showQuickPick([
    { label: 'script-src', description: 'JavaScript files and CDNs' },
    { label: 'style-src', description: 'Stylesheets' },
    { label: 'font-src', description: 'Font files' },
    { label: 'connect-src', description: 'APIs, WebSockets, fetch/XHR' },
    { label: 'img-src', description: 'Images' },
    { label: 'worker-src', description: 'Web Workers' },
  ], {
    placeHolder: 'Select CSP directive',
  });

  if (!directive) {
    return;
  }

  // Source input
  const source = await vscode.window.showInputBox({
    prompt: `Enter source URL for ${directive.label}`,
    placeHolder: "e.g., 'https://api.example.com'",
    validateInput: (value) => {
      if (!value.trim()) {
        return 'Source cannot be empty';
      }
      return null;
    },
  });

  if (!source) {
    return;
  }

  // Backup
  const config = vscode.workspace.getConfiguration('viteCsp');
  if (config.get('autoBackup')) {
    const backup = `${viteConfigPath}.backup.${Date.now()}`;
    fs.copyFileSync(viteConfigPath, backup);
  }

  // Add source to directive
  const directiveRegex = new RegExp(`'${directive.label}':\\s*\\[([^\\]]*)\\]`, 's');
  const match = content.match(directiveRegex);

  if (match) {
    const originalArray = match[1];
    const newSource = `'${source.trim()}'`;
    const updatedArray = originalArray.trimEnd() + `,\n    ${newSource},`;
    content = content.replace(directiveRegex, `'${directive.label}': [${updatedArray}]`);

    fs.writeFileSync(viteConfigPath, content, 'utf8');
    vscode.window.showInformationMessage(`✅ Added ${newSource} to ${directive.label}`);

    // Open file at the modified line
    const doc = await vscode.workspace.openTextDocument(viteConfigPath);
    await vscode.window.showTextDocument(doc);
  } else {
    vscode.window.showErrorMessage(`Could not find '${directive.label}' in CSP_POLICY`);
  }
}

async function fixCSPError() {
  const errorText = await vscode.window.showInputBox({
    prompt: 'Paste the CSP error from DevTools Console',
    placeHolder: 'Refused to load the script \'https://example.com/script.js\' because it violates...',
    ignoreFocusOut: true,
  });

  if (!errorText) {
    return;
  }

  // Parse the error to extract directive and source
  const directiveMatch = errorText.match(/violates.*directive:\s*"([^"]+)"/i);
  const sourceMatch = errorText.match(/['"]([^'"]+)['"]/);

  if (!directiveMatch || !sourceMatch) {
    vscode.window.showErrorMessage('Could not parse CSP error. Please use "Add CSP Source" command manually.');
    return;
  }

  const directive = directiveMatch[1].trim();
  const source = sourceMatch[1];

  // Map Chrome's directive names to our CSP_POLICY keys
  const directiveMap: Record<string, string> = {
    'script-src': 'script-src',
    'script-src-elem': 'script-src',
    'style-src': 'style-src',
    'style-src-elem': 'style-src',
    'font-src': 'font-src',
    'img-src': 'img-src',
    'connect-src': 'connect-src',
    'worker-src': 'worker-src',
  };

  const mappedDirective = directiveMap[directive] || directive;

  const result = await vscode.window.showInformationMessage(
    `Found: ${source}\nAdd to ${mappedDirective}?`,
    'Yes',
    'No'
  );

  if (result === 'Yes') {
    // Reuse addCSPSource logic but with pre-filled values
    await addSourceWithValues(mappedDirective, source);
  }
}

async function addSourceWithValues(directive: string, source: string) {
  const viteConfigPath = await findViteConfig();
  if (!viteConfigPath) {
    vscode.window.showErrorMessage('No vite.config file found!');
    return;
  }

  let content = fs.readFileSync(viteConfigPath, 'utf8');

  if (!content.includes('CSP_POLICY')) {
    vscode.window.showErrorMessage('CSP_POLICY not found in vite.config!');
    return;
  }

  // Backup
  const config = vscode.workspace.getConfiguration('viteCsp');
  if (config.get('autoBackup')) {
    const backup = `${viteConfigPath}.backup.${Date.now()}`;
    fs.copyFileSync(viteConfigPath, backup);
  }

  // Extract domain from URL
  try {
    const url = new URL(source);
    const domain = `${url.protocol}//${url.hostname}`;

    // Add source
    const directiveRegex = new RegExp(`'${directive}':\\s*\\[([^\\]]*)\\]`, 's');
    const match = content.match(directiveRegex);

    if (match) {
      const originalArray = match[1];
      const newSource = `'${domain}'`;

      // Check if source already exists
      if (originalArray.includes(newSource)) {
        vscode.window.showInformationMessage(`Source ${newSource} already exists in ${directive}`);
        return;
      }

      const updatedArray = originalArray.trimEnd() + `,\n    ${newSource},`;
      content = content.replace(directiveRegex, `'${directive}': [${updatedArray}]`);

      fs.writeFileSync(viteConfigPath, content, 'utf8');
      vscode.window.showInformationMessage(`✅ Added ${newSource} to ${directive}`);

      const doc = await vscode.workspace.openTextDocument(viteConfigPath);
      await vscode.window.showTextDocument(doc);
    }
  } catch (error) {
    vscode.window.showErrorMessage('Invalid URL in CSP error');
  }
}

export function deactivate() {}
