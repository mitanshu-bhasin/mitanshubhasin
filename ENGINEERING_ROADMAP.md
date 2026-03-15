# Engineering Roadmap — Portfolio Refactor v2.0

> **Author:** Senior Full Stack Architect Review  
> **Date:** 2026-03-15  
> **Stack:** React 19, Tailwind CSS v4, Firebase, Vite 8

---

## Step 1: Component Modularization ✅

### Problem
The original `index.jsx` was a **1,170-line monolith** containing every component, hook, service, and the entire UI in a single file. This made the codebase unmaintainable, untestable, and un-reviewable.

### Solution — Professional Folder Structure

```
src/
├── main.jsx                    # Entry point — renders App inside ThemeProvider
├── styles/
│   └── index.css               # Global styles + Tailwind import
├── services/
│   └── firebase.js             # Firebase config, initialization, and exports (db, auth)
├── context/
│   └── ThemeContext.jsx         # Global theme state via React Context API
├── hooks/
│   ├── useFrameLoop.js         # Frame-rate capped animation loop (Step 2)
│   └── useChatPersistence.js   # localStorage persistence for chat (Step 3)
├── components/
│   ├── App.jsx                 # Main application shell and routing
│   ├── Icons.jsx               # All SVG icon components as named exports
│   ├── NeuralNetwork.jsx       # Canvas particle animation (optimized)
│   ├── MatrixRain.jsx          # Canvas matrix rain animation (optimized)
│   ├── ScrollProgress.jsx      # Scroll progress bar
│   ├── BackToTop.jsx           # Back-to-top floating button
│   ├── AnnouncementBar.jsx     # Dynamic announcement banner
│   ├── TextScramble.jsx        # Text scramble/decode effect
│   ├── TiltCard.jsx            # 3D mouse-tracking card
│   ├── ProjectModal.jsx        # Project detail modal
│   ├── ImageModal.jsx          # Full-screen image viewer
│   ├── CertificateCard.jsx     # Certificate display card
│   ├── GroqChatbot.jsx         # AI chatbot with persistence
│   ├── BiographySection.jsx    # Biography/story section
│   └── AdminPanel.jsx          # Full admin CRUD panel
```

### Key Decisions
- **Single Responsibility:** Each file has one purpose and one default/named export
- **Colocation:** Hooks that serve a single component live alongside it; shared hooks in `/hooks`
- **Service Layer:** Firebase is initialized once in `services/firebase.js` and imported everywhere

---

## Step 2: Performance Audit ✅

### Problem
`NeuralNetwork` and `MatrixRain` canvas animations ran uncapped:
- `NeuralNetwork` used bare `requestAnimationFrame` at 60fps — unnecessary for ambient decoration
- `MatrixRain` used `setInterval(50ms)` ≈ 20fps but without cleanup or visibility awareness
- Neither paused when the browser tab was hidden, wasting CPU on mobile/background tabs

### Solution — `useFrameLoop` Hook

```js
// src/hooks/useFrameLoop.js
useFrameLoop(callback, targetFps, deps)
```

**Features:**
1. **Frame-rate capping:** Enforces a maximum FPS via `requestAnimationFrame` + elapsed time gate
2. **Page Visibility API:** Automatically pauses rendering when the tab is hidden
3. **Stable callback ref:** Uses `useRef` to avoid re-creating the animation loop on every render

**Applied optimizations:**
| Component | Before | After | Improvement |
|---|---|---|---|
| NeuralNetwork | 60fps uncapped | 30fps capped | ~50% fewer frames |
| MatrixRain | ~20fps setInterval | 20fps rAF + capped | Cleaner teardown, visibility-aware |
| Particle connections | `Math.hypot()` | Squared distance comparison | Avoids sqrt for most checks |
| Particle count | Fixed 50 | Adaptive (25 mobile / 50 desktop) | 50% reduction on mobile |

---

## Step 3: State Management & Persistence ✅

### Problem
- **Theme:** Managed via manual `document.body.className` manipulation scattered across the App component
- **Chat history:** Lost entirely on page refresh — poor UX for the AI chatbot

### Solution A — ThemeContext

```jsx
// src/context/ThemeContext.jsx
<ThemeProvider>   // Wraps <App /> in main.jsx
  <App />         // Uses useTheme() hook anywhere
</ThemeProvider>
```

- Persists theme choice in `localStorage('portfolio-theme')`
- Provides `{ theme, toggleTheme }` via `useTheme()` hook
- Single source of truth — no more `document.body.className = ...` in components

### Solution B — useChatPersistence Hook

```js
// src/hooks/useChatPersistence.js
const [messages, setMessages, clearHistory] = useChatPersistence();
```

- Initializes from `localStorage('portfolio-chat-history')` on mount
- Auto-syncs to localStorage on every message change
- Provides `clearHistory()` for the trash button in the chatbot UI
- Handles corrupted/missing data gracefully with fallback to defaults

---

## Step 4: Security Hardening ✅

### Problem
No Firestore security rules were deployed. With the default `allow read, write: if true` rule, **anyone** could:
- Write arbitrary data to any collection
- Read admin messages
- Delete projects and certifications

### Solution — `firestore.rules`

```
firestore.rules       # Deploy with: firebase deploy --only firestore:rules
```

**Rule summary:**

| Collection | Read | Create | Update/Delete |
|---|---|---|---|
| `site_config/*` | ✅ Public | 🔒 Auth only | 🔒 Auth only |
| `projects/*` | ✅ Public | 🔒 Auth only | 🔒 Auth only |
| `certifications/*` | ✅ Public | 🔒 Auth only | 🔒 Auth only |
| `messages/*` | 🔒 Auth only | ✅ Public (validated) | 🔒 Auth only |
| Everything else | ❌ Denied | ❌ Denied | ❌ Denied |

**Message validation:**
- Required fields: `name`, `phone`, `inquiryType`, `message` (all strings)
- Size limits: name ≤ 100 chars, phone ≤ 50 chars, message ≤ 5,000 chars
- Prevents empty submissions

### Deployment
```bash
firebase deploy --only firestore:rules
```

---

## Step 5: Modern Build Pipeline ✅

### Problem
The original build used:
- **Babel Standalone** (loaded from CDN in browser) for JSX compilation
- A custom `build.js` script with Babel + Terser for production
- All dependencies loaded from CDN (React, Firebase, Tailwind) — no tree-shaking, no HMR

### Solution — Vite 8 Migration

**Before (CDN-based):**
```html
<script src="https://unpkg.com/react@18/umd/react.development.js"></script>
<script src="https://cdn.tailwindcss.com"></script>
<script src="index.min.js" defer></script>
```

**After (Vite-bundled):**
```html
<script type="module" src="/src/main.jsx"></script>
```

**Configuration files:**
- `vite.config.js` — Vite with `@vitejs/plugin-react`
- `package.json` — `"type": "module"`, scripts: `dev`, `build`, `preview`

**Benefits:**
| Feature | Before | After |
|---|---|---|
| HMR | None (full reload) | < 100ms with Vite |
| Bundle size | All CDN libs (~2MB+) | 228 KB gzipped (tree-shaken) |
| Build time | ~5s (Babel + Terser) | ~300ms (Vite + Rolldown) |
| Dev server | File:// or static server | Vite dev server with HMR |
| CSS | CDN Tailwind (all classes) | Tailwind v4 (JIT, used classes only) |

### Next Steps — SSR / SSG (Future)
For SEO improvements via Server-Side Rendering:
1. **Vite SSR Plugin** — `vite-plugin-ssr` or `vike` for SSR with current setup
2. **Next.js Migration** — For full SSR/SSG/ISR, migrate to Next.js App Router
3. **Static Pre-rendering** — Use `vite-plugin-prerender` to generate static HTML at build time

---

## Quick Start

```bash
# Development (with HMR)
npm run dev

# Production build
npm run build

# Preview production build locally
npm run preview

# Deploy Firestore rules
firebase deploy --only firestore:rules
```
