---
phase: 04-performance
plan: 03
title: "Vite Build Optimization"
date: 2026-02-05
duration: "6 minutes"
status: complete

one_liner: "Vite build optimized with esbuild minifier, manual chunk splitting (vue-vendor), and bundle analysis via rollup-plugin-visualizer"

subsystem: "Build System"

tags:
  - vite
  - build-optimization
  - code-splitting
  - esbuild
  - bundle-analysis
  - performance

dependency_graph:
  requires:
    - 04-01: "API Caching (build config foundation)"
    - 04-02: "Lazy Loading (chunking foundation)"
  provides:
    - "Optimized production builds with code splitting"
    - "Bundle size budgets and warnings"
    - "Bundle analysis tools (stats.html)"
  affects:
    - "Time to interactive (reduced initial bundle)"
    - "Browser caching strategy (vendor chunks)"

tech_stack:
  added:
    - rollup-plugin-visualizer: ^6.0.5
  patterns:
    - "Manual code splitting via rollupOptions.manualChunks"
    - "Vendor chunks separate from app code for long-term caching"
    - "Conditional plugins for analysis mode"

key_files:
  created:
    - dist/stats.html: "Bundle analysis visualization (generated)"
  modified:
    - vite.config.js: "build.rollupOptions with manualChunks"
    - package.json: "build:analyze script"

decisions_made:
  - "Set chunkSizeWarningLimit to 150KB per web.dev recommendations"
  - "Use esbuild minifier (20-40x faster than terser, 1-2% worse compression)"
  - "Separate vue-vendor chunk for stable long-term browser caching"
  - "Bundle analysis tool is opt-in (npm run build:analyze) to avoid overhead"
  - "vite-plugin-compression not added (would require pre-compressed assets)"

bundle_sizes:
  uncompressed:
    vue-vendor: "106KB"
    player-view: "14KB"
    index-app: "12KB"
    loading-spinner: "6.5KB"
    home-view: "3.4KB"
  gzipped:
    vue-vendor: "41.86KB"
    total_transfer: "~55KB"

performance_metrics:
  build_time: "1.5s (esbuild)"
  chunk_size_warning_limit: "150KB"
  largest_chunk_under_limit: "true"
  minification: "esbuild"
  code_splitting: "enabled (manualChunks)"

deviations_from_plan: []

authentication_gates: []
---

# Phase 04 Plan 03: Vite Build Optimization Summary

## Overview

Configured Vite build optimizations to minimize bundle size, enable code splitting, and set up bundle analysis tools. The build now separates Vue vendor code from application code for better browser caching, enforces bundle size budgets to prevent bloat, and generates bundle analysis reports on demand.

## Changes Made

### 1. Build Configuration (vite.config.js)

Added comprehensive build optimization configuration:

```javascript
build: {
  chunkSizeWarningLimit: 150,  // 150KB per web.dev recommendation
  minify: 'esbuild',           // 20-40x faster than terser
  target: 'es2015',            // Modern browsers
  rollupOptions: {
    output: {
      manualChunks(id) {
        // Split vendor from app code for caching
        if (id.includes('node_modules')) {
          if (id.includes('vue') || id.includes('pinia') || id.includes('@vue')) {
            return 'vue-vendor'  // Vue core - stable long-term cache
          }
          if (id.includes('@vueuse')) {
            return 'vueuse'      // VueUse - separate for cache stability
          }
          return 'vendor'        // Other dependencies
        }
      }
    }
  }
}
```

### 2. Bundle Analysis Tools

- Added `rollup-plugin-visualizer` to devDependencies
- Created `build:analyze` npm script
- Configured conditional visualizer plugin (only runs in analyze mode)
- Generates `dist/stats.html` with interactive treemap visualization

### 3. Optional Compression

Added documentation comments for enabling `vite-plugin-compression` for gzip/brotli pre-compression (not enabled by default).

## Results

### Bundle Sizes

| Chunk | Uncompressed | Gzipped | Description |
|-------|--------------|---------|-------------|
| vue-vendor | 106 KB | 41.86 KB | Vue core (vue, pinia, vue-router) |
| index-app | 12 KB | 4.95 KB | Main application code |
| PlayerView | 14 KB | 5.04 KB | Player stats component |
| LoadingSpinner | 6.5 KB | 2.86 KB | Loading component |
| HomeView | 3.4 KB | 1.65 KB | Home page component |
| **Total Transfer** | ~141 KB | ~55 KB | All JS chunks |

### Performance Metrics

- **Build time:** ~1.5s with esbuild minifier
- **Largest chunk:** 106 KB (well under 150KB limit)
- **Total transfer size:** ~55 KB gzipped
- **No chunk size warnings**

### Code Splitting Benefits

1. **Browser caching:** Vue vendor chunk changes infrequently, browsers cache it longer
2. **Parallel loading:** Multiple chunks load in parallel
3. **Faster initial load:** App code loads separately from heavy vendor libraries

## Deviations from Plan

None - plan executed exactly as written.

## Next Phase Readiness

Phase 4 is complete with this plan. All performance optimizations have been implemented:

- 04-01: API Caching (stale-while-revalidate, LRU eviction)
- 04-02: Lazy Loading Images (IntersectionObserver)
- 04-03: Build Optimization (code splitting, minification, bundle analysis)

The app is now optimized for fast time-to-interactive and efficient resource loading.
