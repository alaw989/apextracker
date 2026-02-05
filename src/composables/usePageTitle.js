/**
 * Page Title Management Composable
 *
 * Dynamically updates document.title based on current route.
 * Uses VueUse's useTitle() for reactive title management.
 *
 * Title formats:
 * - Homepage: "Apex Legends Stats Tracker - Lookup Player Ranks & Stats"
 * - Player profile: "{PlayerName} - Apex Legends Stats"
 * - 404: "404 - Player Not Found"
 */
import { watch } from 'vue'
import { useRoute } from 'vue-router'
import { useTitle } from '@vueuse/core'
import { usePlayerStore } from '@/stores/player'

/**
 * Composable for managing page titles reactively
 *
 * Initializes title management and watches for route/player changes.
 * Player page title uses actual API data when available, falls back to URL param.
 *
 * @returns {Object} Title control functions (if needed for manual control)
 */
export function usePageTitle() {
  const route = useRoute()
  const playerStore = usePlayerStore()

  // Initialize with homepage title
  const title = useTitle('Apex Legends Stats Tracker - Lookup Player Ranks & Stats', {
    titleTemplate: null, // No suffix template - titles are complete
    observe: true // Watch for document.title changes
  })

  /**
   * Get player name for title
   * Prioritizes actual API data over URL param
   *
   * @param {Object} route - Vue route object
   * @returns {string|null} Player name or null
   */
  function getPlayerName(route) {
    // Guard: route may be undefined during initial app setup
    if (!route) return null

    // First try actual API data from store
    if (route.name === 'player' && playerStore.data?.name) {
      return playerStore.data.name
    }
    // Fall back to URL param
    if (route.params?.username) {
      return route.params.username
    }
    return null
  }

  /**
   * Update title based on current route
   *
   * @param {Object} route - Vue route object
   */
  function updateTitle(route) {
    // Guard: route may be undefined during initial app setup
    if (!route || !route.name) return

    switch (route.name) {
      case 'home':
        title.value = 'Apex Legends Stats Tracker - Lookup Player Ranks & Stats'
        break

      case 'player':
        const playerName = getPlayerName(route)
        if (playerName) {
          title.value = `${playerName} - Apex Legends Stats`
        } else {
          title.value = 'Apex Legends Stats'
        }
        break

      case 'notFound':
        title.value = '404 - Player Not Found'
        break

      default:
        title.value = 'Apex Legends Stats Tracker'
    }
  }

  // Watch route name changes to update title
  watch(
    () => route?.name,
    (newName, oldName) => {
      if (newName !== oldName) {
        updateTitle(route)
      }
    },
    { immediate: true }
  )

  // Watch player store data changes for name updates on player page
  // This handles the case where API fetch completes after navigation
  watch(
    () => playerStore.data?.name,
    (newName, oldName) => {
      // Guard: route may be undefined during initial app setup
      // Only update if we're on player route and name actually changed
      if (route && route.name === 'player' && newName && newName !== oldName) {
        updateTitle(route)
      }
    }
  )

  // Initial title set
  updateTitle(route)

  return {
    title,
    updateTitle
  }
}
