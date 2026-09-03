# Stack: Apex Tracker

**Analyzed:** 2026-09-03 (Vue 3 rewrite - supersedes the pre-v1.0 React analysis)

## Language & Runtime

| Component | Technology | Version |
|-----------|------------|---------|
| Language | JavaScript (ESM) | ES2015+ target |
| Runtime | Node.js | v22 (observed) |
| Build Tool | Vite | 6.x |

## Frontend Framework

| Component | Technology | Version | Purpose |
|-----------|------------|---------|---------|
| Framework | Vue | 3.5.x | UI framework, Composition API / `<script setup>` |
| State | Pinia | 3.0.x | Setup-store syntax |
| Routing | Vue Router | 4.6.x | History mode, dynamic `/player/:username/:platform` route |
| Utilities | @vueuse/core | 14.x | Composable utility functions |

## Build Tooling

| Tool | Purpose |
|------|---------|
| Vite 6 | Dev server + build |
| @vitejs/plugin-vue | SFC compilation |
| esbuild | Minification (default, faster than terser) |
| rollup-plugin-visualizer | Bundle analysis (`npm run build:analyze` only) |

## Testing

| Tool | Purpose |
|------|---------|
| Vitest 5 | Test runner (`npm test` / `npm run test:watch`) |
| @vue/test-utils | Component mounting |
| jsdom | DOM environment for Vitest |
| @pinia/testing | Pinned to `^1.0.2` - the latest 2.x line requires pinia 4, this project is on pinia 3 |

## Scripts

```json
"dev": "vite"                    // Dev server
"build": "vite build"            // Production build
"build:analyze": "vite build --mode analyze"  // Build + bundle visualizer
"preview": "vite preview"        // Preview production build locally
"test": "vitest run"             // Run test suite once
"test:watch": "vitest"           // Watch mode
```

## No TypeScript

Plain JavaScript throughout, JSDoc annotations on exported functions instead of type checking.

## No License

`package.json` has no `"license"` field and there is no `LICENSE` file at the repo root, despite the GitHub repo being public.
