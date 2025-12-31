# Extension Development Status

⚠️ **Work in Progress** - This extension is a bonus feature and not production-ready yet.

## Why Extension is WIP

The **Priority 1** solution (automated task system in `.vscode/`) works perfectly and is the recommended approach. The extension is an advanced feature being developed for power users.

## Current Status

- [ ] Package dependencies need resolution
- [ ] TypeScript compilation needs fixing
- [ ] Testing in Extension Development Host
- [ ] CI/CD build pipeline

## Using the Working Solution Instead

**Recommended:** Use the automated task system:

```bash
# Copy to your Vite project
cp ../.vscode/tasks.json .vscode/
cp ../.vscode/add-csp.js .vscode/

# Run in VS Code
# Ctrl+Shift+P → Run Task → "Vite: Add CSP Configuration"
```

This works perfectly and requires zero npm dependencies!

## Want to Help?

If you're interested in fixing the extension:

1. Fork the repo
2. Fix `extension/package.json` dependencies
3. Get `npm install` and `npm run compile` working
4. Test with F5 in VS Code
5. Submit a PR

The task system is production-ready and solves the CSP problem - the extension is just extra convenience.
