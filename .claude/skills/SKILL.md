# Vite CSP Fix

> **Claude Skill** | Security | Vite Configuration | v1.0.0

Apply Content Security Policy configuration to any Vite project to prevent CSP errors during development.

**🤖 AI Agent Note:** See [CLAUDE.md](CLAUDE.md) for implementation guidance.

## When to Use This Skill

- You encounter CSP (Content Security Policy) errors in Chrome DevTools
- You see "Refused to load" or "violates Content Security Policy" errors
- Setting up a new Vite project that uses external CDNs (Tailwind, Google Fonts, etc.)
- Adding new APIs and getting blocked by CSP

## What is CSP?

Content Security Policy is a security layer that helps prevent:
- **XSS attacks** (Cross-Site Scripting)
- **Clickjacking**
- **Code injection attacks**

It tells the browser which sources of content (scripts, styles, images, etc.) are allowed to load.

## Why Server Headers Instead of Meta Tags?

1. **More secure** - Headers are applied BEFORE the page loads
2. **Can't be bypassed** - Meta tags can be circumvented if injected before they're parsed
3. **Works for all resources** - Not just the HTML document
4. **Easier to maintain** - Single source of truth in vite.config.ts

## How to Apply This Fix

Add this to the TOP of your `vite.config.ts`:

```typescript
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
    'https://aistudiocdn.com',      // Google AI Studio SDK
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
    'https://generativelanguage.googleapis.com', // Gemini API
    'https://*.googleapis.com',                  // Other Google APIs
    'https://aistudiocdn.com',                   // AI Studio CDN
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
    .map(([directive, sources]) => `${directive} ${sources.join(' ')}`)
    .join('; ');
```

Then add headers to your server config:

```typescript
export default defineConfig({
  server: {
    headers: {
      'Content-Security-Policy': buildCSPString(CSP_POLICY),
    },
  },
  // ... rest of config
});
```

## Common Customizations

| Scenario | Add To | Example |
|----------|--------|---------|
| New API endpoint | `connect-src` | `'https://api.openai.com'` |
| New script CDN | `script-src` | `'https://unpkg.com'` |
| New font provider | `font-src` + `style-src` | `'https://fonts.adobe.com'` |
| WebSocket server | `connect-src` | `'wss://your-ws-server.com'` |

## Important Notes

1. **Remove meta tags** - Delete any `<meta http-equiv="Content-Security-Policy">` from index.html when using server headers
2. **Extension errors** - "listener indicated an asynchronous response" errors are from browser extensions, not CSP
3. **Production** - You may want stricter policies in production (remove 'unsafe-inline', 'unsafe-eval')
