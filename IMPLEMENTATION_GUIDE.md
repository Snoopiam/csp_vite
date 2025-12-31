# Implementation Guide - Vite CSP Fix

> **Complete guide for implementing CSP in Vite projects**

## 🎯 Implementation Methods (Priority Order)

This toolkit provides 4 ways to implement CSP, ranked by priority:

---

## 1️⃣ **PRIORITY 1: Automated Task System** (IMMEDIATE USE)

**Location:** `.vscode/tasks.json` + `.vscode/add-csp.js`

**Best for:** Quick setup, no installation needed

### Setup
```bash
# Option A: Copy files to your project
cp .vscode/tasks.json [your-project]/.vscode/
cp .vscode/add-csp.js [your-project]/.vscode/

# Option B: Run directly from this folder
cd [your-project]
node [path-to-skill]/.vscode/add-csp.js
```

### Usage
1. **VS Code Task:**
   - Press `Ctrl+Shift+P` → "Run Task"
   - Select "Vite: Add CSP Configuration"

2. **Command Line:**
   ```bash
   node .vscode/add-csp.js                # Add full config
   node .vscode/add-csp.js --add-source   # Add single source
   ```

### Features
- ✅ Zero dependencies (Node.js built-ins only)
- ✅ Automatic backup creation
- ✅ Interactive source adding
- ✅ Supports .ts, .js, .mjs configs

---

## 2️⃣ **PRIORITY 2: VS Code Extension** (MOST POWERFUL)

**Location:** `extension/`

**Best for:** Power users, repeated use, team distribution

### Setup
```bash
cd extension/
npm install
npm run compile
```

### Development
```bash
npm run watch  # Auto-compile on save
# Press F5 to launch Extension Development Host
```

### Publishing
```bash
npm install -g @vscode/vsce
vsce package   # Creates .vsix file
vsce publish   # Publishes to VS Code Marketplace
```

### Commands
| Command | Shortcut | Description |
|---------|----------|-------------|
| `Vite: Add CSP Configuration` | - | Full CSP setup |
| `Vite: Add CSP Source` | - | Add single source |
| `Vite: Fix CSP Error from DevTools` | - | Parse & fix errors |

### Configuration
```json
// settings.json
{
  "viteCsp.autoBackup": true,
  "viteCsp.defaultSources": {
    "connect-src": ["'self'", "https://api.example.com"]
  }
}
```

---

## 3️⃣ **PRIORITY 3: Code Snippets** (MANUAL CONTROL)

**Location:** `.vscode/vite-csp.code-snippets`

**Best for:** Developers who prefer manual control

### Setup
```bash
# Project-specific
cp .vscode/vite-csp.code-snippets [your-project]/.vscode/

# Global (all projects)
# Copy to: %APPDATA%/Code/User/snippets/vite-csp.code-snippets
```

### Usage
| Trigger | Description |
|---------|-------------|
| `vite-csp` + Tab | Full CSP configuration |
| `vite-server-headers` + Tab | Server headers only |
| `csp-add` + Tab | Add single source |

### Example
```typescript
// In vite.config.ts
vite-csp<Tab>
// Expands to full CSP configuration
// Tab through placeholders to customize
```

---

## 4️⃣ **PRIORITY 4: GitHub Template** (PROJECT BOILERPLATE)

**Location:** Entire repository

**Best for:** Starting new projects, team standardization

### Use as Template
```bash
# On GitHub
1. Click "Use this template"
2. Create new repository
3. Clone and start coding

# With GitHub CLI
gh repo create my-vite-app --template Snoopiam/csp_vite
cd my-vite-app
npm install
```

### What's Included
```
new-project/
├── .vscode/           ← Tasks & snippets pre-configured
├── extension/         ← VS Code extension ready to use
├── .claude/           ← Claude AI skill
├── .cursor/           ← Cursor AI rules
└── All docs & configs
```

---

## 📚 Comparison Matrix

| Feature | Task | Extension | Snippet | Template |
|---------|------|-----------|---------|----------|
| **Setup Time** | 1 min | 5 min | 30 sec | Instant |
| **Dependencies** | None | npm | None | None |
| **Installation** | Copy 2 files | npm install | Copy 1 file | Use template |
| **Automation** | ✅ High | ✅ Highest | ❌ Manual | ✅ Pre-configured |
| **Customization** | ✅ Good | ✅ Best | ✅ Full control | ✅ Pre-customized |
| **Team Use** | ✅ Copy files | ✅ Publish | ✅ Share snippet | ✅ Template repo |
| **Updates** | Manual | Auto | Manual | Fork updates |

---

## 🎯 Which Should You Use?

### Use **Task System** (Priority 1) if:
- You need immediate solution
- Don't want to install anything
- Working on single project
- Want automation without overhead

### Use **Extension** (Priority 2) if:
- You work on multiple Vite projects
- Want GUI commands and error parsing
- Team needs standardized tooling
- Can publish to organization's extension marketplace

### Use **Snippets** (Priority 3) if:
- You prefer manual control
- Don't want automation
- Like to customize every detail
- Want quick code insertion

### Use **Template** (Priority 4) if:
- Starting new Vite project
- Want all tools pre-configured
- Creating team boilerplate
- Need quick project setup

---

## 🚀 Quick Start Recommendations

### For Individual Developers
1. Start with **Task System** (Priority 1)
2. If you like it, upgrade to **Extension** (Priority 2)
3. Keep **Snippets** as backup

### For Teams
1. Use **Template** (Priority 4) for new projects
2. Publish **Extension** (Priority 2) internally
3. Share **Task System** for existing projects

### For Learning
1. Try **Snippets** (Priority 3) to understand code
2. Move to **Task System** (Priority 1) for automation
3. Explore **Extension** (Priority 2) for advanced features

---

## 📖 Additional Resources

- [SKILL.md](.claude/skills/SKILL.md) - Claude AI guide
- [vite-csp.code.mdc](.cursor/rules/vite-csp.code.mdc) - Cursor AI rules
- [CLAUDE.md](CLAUDE.md) - AI agent implementation guide
- [README.md](README.md) - User documentation
- [CONTRIBUTING.md](CONTRIBUTING.md) - Contribution guide

---

## 🆘 Support

**Issues:** Open on GitHub  
**Questions:** See CLAUDE.md for AI agent guidance  
**Updates:** Watch repository for new features
