# Vite CSP Fix - Complete Toolkit

> **📁 Claude Skill** | Located in: `~/.claude/skills/vite-csp-fix/`

A comprehensive solution for managing Content Security Policy in Vite projects. This toolkit includes automated tasks, VS Code snippets, and a full extension.

**🤖 For AI Agents:** See [CLAUDE.md](CLAUDE.md) for implementation guidance.

---

## 👋 From the Author

Hey! I'm Snoop... not a professional coder, but learning to be a **vibecoder**. 

When I encountered the infamous Content Security Policy (CSP) warning, it was annoying as hell. So I vibe-coded and found a solution for personal use. It worked for me, so I'm sharing it with anyone who gets stuck like I did.

**⚠️ Disclaimer:** I do not take responsibility for anything. Use at your own risk.

---

## 🎯 What's Included

This repository contains **4 ways** to implement CSP in your Vite projects:

### 1. ⚡ **Automated Task** (Recommended - Start Here!)
Quick setup using VS Code tasks - no installation required.

**How to use:**
1. Copy `.vscode/` folder to your project
2. Press `Ctrl+Shift+P` → Run Task → "Vite: Add CSP Configuration"
3. Done! CSP is added to your `vite.config.ts`

**Files:**
- `.vscode/tasks.json` - Task definitions
- `.vscode/add-csp.js` - Automation script

### 2. 📝 **Snippets**
Type-to-insert code snippets for manual control.

**How to use:**
1. Copy `.vscode/vite-csp.code-snippets` to your project's `.vscode/` folder
2. In `vite.config.ts`, type `vite-csp` and press `Tab`

**Snippets:**
- `vite-csp` - Full CSP configuration
- `vite-server-headers` - Server headers only
- `csp-add` - Add single source

### 3. 🔧 **VS Code Extension**
Full-featured extension with commands and error parsing.

**Features:**
- Command Palette commands
- Parse DevTools errors automatically
- Interactive source adding
- Auto-backup before changes

**How to use:**
1. Open `extension/` folder in VS Code
2. Press `F5` to run in Extension Development Host
3. Use commands: `Vite: Add CSP Configuration`, etc.

**To publish:**
```bash
cd extension
npm install
vsce package
vsce publish
```

### 4. 📦 **Project Template**
Use this entire repository as a template for new Vite projects.

**How to use:**
1. Click "Use this template" on GitHub
2. Clone your new repository
3. Run `npm install`
4. All CSP tools are pre-configured!

## 🚀 Quick Start

### For New Projects
```bash
# Use this template
gh repo create my-vite-app --template Snoopiam/csp_vite
cd my-vite-app
npm install
```

### For Existing Projects
```bash
# Copy task system only
curl -O https://raw.githubusercontent.com/Snoopiam/csp_vite/main/.vscode/tasks.json
curl -O https://raw.githubusercontent.com/Snoopiam/csp_vite/main/.vscode/add-csp.js

# Run task
# Ctrl+Shift+P → Tasks: Run Task → Vite: Add CSP Configuration
```

## 📚 Documentation

### What is CSP?

Content Security Policy prevents:
- **XSS attacks** (Cross-Site Scripting)
- **Clickjacking**
- **Code injection attacks**

It tells browsers which sources are allowed to load content.

### Why Server Headers?

✅ More secure - applied BEFORE page loads  
✅ Can't be bypassed - unlike meta tags  
✅ Works for all resources  
✅ Easier to maintain - single source in `vite.config.ts`

### Common CSP Directives

| Directive | What It Controls | Common Sources |
|-----------|------------------|----------------|
| `script-src` | JavaScript files | CDNs, inline scripts |
| `style-src` | Stylesheets | Google Fonts, inline styles |
| `font-src` | Font files | Google Fonts, local fonts |
| `img-src` | Images | Any HTTPS, data URLs |
| `connect-src` | API calls, WebSockets | Your API endpoints |
| `worker-src` | Web Workers | blob: URLs |

## 🛠️ Development

### Extension Development
```bash
cd extension
npm install
npm run watch  # Compile on save
# Press F5 in VS Code to debug
```

### Testing
```bash
# Test automation script
node .vscode/add-csp.js

# Test with specific Vite project
cd path/to/vite-project
node path/to/vite-csp-fix/.vscode/add-csp.js
```

## 📦 File Structure

```
vite-csp-fix/
├── .vscode/
│   ├── tasks.json                  # VS Code tasks
│   ├── add-csp.js                  # Automation script
│   └── vite-csp.code-snippets      # Code snippets
├── extension/
│   ├── src/
│   │   └── extension.ts            # Extension source
│   ├── package.json
│   ├── tsconfig.json
│   └── README.md
├── SKILL.md                        # Original skill documentation
└── README.md                       # This file
```

## 🎓 Usage Examples

### Example 1: Add CSP to New Vite Project
```bash
npm create vite@latest my-app -- --template react-ts
cd my-app
# Copy .vscode folder from this repo
code .
# Ctrl+Shift+P → Run Task → Vite: Add CSP Configuration
npm run dev
```

### Example 2: Add API Endpoint
```bash
# Interactive
node .vscode/add-csp.js --add-source
# Select: connect-src
# Enter: https://api.openai.com
```

### Example 3: Use Snippet
```typescript
// In vite.config.ts, type:
vite-csp<Tab>
// Full CSP configuration inserted!
```

## 🤝 Contributing

Contributions welcome! Please:
1. Fork the repository
2. Create a feature branch
3. Submit a pull request

## 📄 License

MIT License - see LICENSE file

## 🔗 Links

- [VS Code Extension API](https://code.visualstudio.com/api)
- [Vite Documentation](https://vitejs.dev)
- [CSP Reference](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP)

## 💡 Tips

- **Development**: Use `'unsafe-inline'` and `'unsafe-eval'` for dev, remove in production
- **APIs**: Always add API endpoints to `connect-src`
- **Errors**: Chrome DevTools shows which directive blocked a resource
- **Backup**: The automation script creates `.backup` files before modifying

## 🐛 Troubleshooting

### "CSP_POLICY not found"
Run "Add CSP Configuration" first before adding sources.

### "No vite.config file found"
Make sure you're in a Vite project directory.

### Extension not working
1. Check VS Code version (1.85.0+)
2. Reload VS Code window
3. Check Output → Vite CSP Helper

---

**Made with ❤️ for the Vite community**
