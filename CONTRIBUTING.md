# Contributing to Vite CSP Fix

Thank you for your interest in contributing! 🎉

## How to Contribute

### Reporting Bugs
1. Check if the bug already exists in [Issues](https://github.com/Snoopiam/csp_vite/issues)
2. Create a new issue with:
   - Clear title
   - Steps to reproduce
   - Expected vs actual behavior
   - Vite version, VS Code version

### Suggesting Features
1. Open an issue with the `enhancement` label
2. Describe the feature and use case
3. If possible, provide examples

### Code Contributions

#### Setup
```bash
git clone https://github.com/yourusername/vite-csp-fix.git
cd vite-csp-fix
```

#### For Extension Development
```bash
cd extension
npm install
npm run watch  # Compile TypeScript on save
# Press F5 in VS Code to debug
```

#### For Automation Script
```bash
# Test the script
node .vscode/add-csp.js

# Test in a sample Vite project
cd /path/to/test-vite-project
node /path/to/vite-csp-fix/.vscode/add-csp.js
```

#### Making Changes
1. Create a branch: `git checkout -b feature/my-feature`
2. Make your changes
3. Test thoroughly:
   - Extension: Run in Extension Development Host
   - Script: Test with real Vite projects
   - Snippets: Test in VS Code
4. Commit: `git commit -m "Add: my feature"`
5. Push: `git push origin feature/my-feature`
6. Open a Pull Request

### Pull Request Guidelines
- **Title**: Clear and descriptive
- **Description**: What changed and why
- **Testing**: Describe how you tested the changes
- **Breaking Changes**: Clearly mark if any

### Code Style
- TypeScript: Follow existing conventions
- Comments: Use JSDoc for functions
- Format: Run Prettier before committing

### Testing Checklist
- [ ] Extension compiles without errors
- [ ] Tasks run successfully
- [ ] Snippets insert correctly
- [ ] Tested with TypeScript Vite project
- [ ] Tested with JavaScript Vite project
- [ ] No console errors in Extension Host

## Project Structure

```
vite-csp-fix/
├── .vscode/              # Task system & snippets
│   ├── tasks.json
│   ├── add-csp.js        # Core automation logic
│   └── vite-csp.code-snippets
├── extension/            # VS Code extension
│   ├── src/
│   │   └── extension.ts  # Extension entry point
│   └── package.json      # Extension manifest
├── SKILL.md              # Original documentation
└── README.md             # Main documentation
```

## Adding New CSP Directives

To add support for a new CSP directive:

1. **Update add-csp.js**:
   - Add to `CSP_POLICY` template
   - Add to directive map in `addCSPSource()`

2. **Update extension.ts**:
   - Add to `CSP_POLICY_TEMPLATE`
   - Add to directive quick pick list

3. **Update snippets**:
   - Add to dropdown in "Add CSP Source" snippet

4. **Update documentation**:
   - Add to tables in README.md
   - Add examples if needed

## Questions?

Open a [Discussion](https://github.com/Snoopiam/csp_vite/discussions) or reach out to Snoop.

## Code of Conduct

Be respectful and constructive. We're all here to make Vite development better! 💪
