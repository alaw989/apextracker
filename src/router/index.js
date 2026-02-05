/**
 * Vue Router Configuration
 *
 * Defines routes for the Apex Tracker application:
 * - Home: Search form for player lookup
 * - Player: Dynamic route for player profiles (/player/:username/:platform)
 * - NotFound: Catch-all for invalid URLs
 */

import { createRouter, createWebHistory } from 'vue-router'
import { getPlatformIds } from '@/utils/constants'

// Lazy load view components for better performance
const HomeView = () => import('@/views/HomeView.vue')
const PlayerView = () => import('@/views/PlayerView.vue')
const NotFoundView = () => import('@/views/NotFoundView.vue')

/**
 * Route definitions
 * Note: NotFound (catch-all) must be LAST
 */
const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
    meta: {
      title: 'Apex Legends Stats Tracker - Lookup Player Ranks & Stats'
    }
  },
  {
    path: '/player/:username/:platform',
    name: 'player',
    component: PlayerView,
    props: true, // Pass route params as props to component
    meta: {
      title: undefined // Will be set dynamically based on username
    }
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'notFound',
    component: NotFoundView,
    meta: {
      title: '404 - Player Not Found'
    }
  }
]

/**
 * Create router instance with history mode
 */
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  /**
   * Scroll behavior - reset to top on navigation
   */
  scrollBehavior() {
    return { top: 0 }
  }
})

/**
 * Navigation guard - validate platform parameter
 * Redirects to 404 if platform is invalid
 */
router.beforeEach((to, from, next) => {
  // Check if platform param exists and validate it
  if (to.params.platform) {
    const validPlatforms = getPlatformIds() // ['origin', 'xbl', 'psn']
    if (!validPlatforms.includes(to.params.platform)) {
      // Invalid platform - redirect to 404
      next({ name: 'notFound' })
      return
    }
  }

  next()
})

export default router
