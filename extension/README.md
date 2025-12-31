# Vite CSP Helper

Easily add and manage Content Security Policy (CSP) configuration for your **Vite projects** during **localhost development**.

⚠️ **IMPORTANT:** This extension generates CSP configs for development only. You must modify the generated config before deploying to production (remove `'unsafe-inline'`, `'unsafe-eval'`, and localhost references).

## Features

- **🚀 One-Click Setup**: Add complete CSP configuration to your `vite.config.ts` with a single command
- **➕ Add Sources Interactively**: Quick picker to add new CSP sources to any directive
- **🔧 Fix DevTools Errors**: Paste CSP errors from Chrome DevTools and automatically add the blocked source
- **💾 Auto Backup**: Automatically creates backups before modifying your config

## Commands

| Command | Description |
|---------|-------------|
| `Vite: Add CSP Configuration` | Add complete CSP setup to vite.config |
| `Vite: Add CSP Source` | Add a new source to an existing CSP directive |
| `Vite: Fix CSP Error from DevTools` | Parse and fix CSP errors from browser console |

## Usage

### 1. Initial Setup

1. Open your Vite project
2. Press `Ctrl+Shift+P` (Windows/Linux) or `Cmd+Shift+P` (Mac)
3. Type "Vite: Add CSP Configuration"
4. The extension will modify your `vite.config.ts` with CSP headers

### 2. Add New Sources

When you encounter a CSP error:

1. Run `Vite: Add CSP Source`
2. Select the directive (script-src, connect-src, etc.)
3. Enter the URL

### 3. Fix from DevTools

1. Copy the CSP error from Chrome DevTools Console
2. Run `Vite: Fix CSP Error from DevTools`
3. Paste the error
4. Extension parses and adds the blocked source automatically

## Extension Settings

* `viteCsp.autoBackup`: Enable/disable automatic backups (default: `true`)
* `viteCsp.defaultSources`: Customize default CSP sources

## What is CSP?

Content Security Policy helps prevent:
- Cross-Site Scripting (XSS) attacks
- Clickjacking
- Code injection

## Requirements

- Vite project with `vite.config.ts`, `vite.config.js`, or `vite.config.mjs`
- VS Code 1.85.0 or higher

## Release Notes

### 0.1.0

Initial release with:
- CSP configuration generator
- Interactive source adding
- DevTools error parsing

## Contributing

Found a bug or have a feature request? Open an issue on [GitHub](https://github.com/Snoopiam/csp_vite).

## License

MIT
