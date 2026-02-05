/**
 * Lazy Image Loading Composable
 *
 * Provides IntersectionObserver-based lazy loading for images with viewport detection.
 * Images in the initial viewport load immediately without waiting for the observer.
 *
 * @param {string} src - Image URL to load
 * @param {Object} options - Configuration options
 * @param {string} options.rootMargin - Margin around viewport for triggering load (default: '50px')
 *
 * @returns {Object} Lazy loading state and control refs
 * @returns {Ref<boolean>} loaded - Image successfully loaded
 * @returns {Ref<boolean>} error - Image failed to load
 * @returns {Ref<boolean>} shouldLoad - Image should load now (visible in viewport)
 * @returns {Ref<Object>} targetRef - DOM element ref for IntersectionObserver
 */
import { ref, watch } from 'vue'
import { useIntersectionObserver } from '@vueuse/core'

export function useLazyImage(src, options = {}) {
  const { rootMargin = '50px' } = options

  // State refs
  const loaded = ref(false)
  const error = ref(false)
  const shouldLoad = ref(false)
  const targetRef = ref(null)

  /**
   * Check if element is in viewport on mount
   * Skips IntersectionObserver for viewport images (immediate load)
   */
  function checkViewport() {
    if (!targetRef.value) return false

    const rect = targetRef.value.getBoundingClientRect()
    const windowHeight = window.innerHeight

    // Check if element is in viewport (with some margin)
    const isInViewport = (
      rect.top < windowHeight + 50 &&
      rect.bottom > -50
    )

    return isInViewport
  }

  /**
   * IntersectionObserver callback
   * Sets shouldLoad to true when element enters viewport
   */
  function onIntersect([{ isIntersecting }]) {
    if (isIntersecting) {
      shouldLoad.value = true
      stop()
    }
  }

  /**
   * Setup IntersectionObserver with VueUse
   * Automatically stops when element enters viewport
   */
  const { stop } = useIntersectionObserver(
    targetRef,
    onIntersect,
    { rootMargin }
  )

  /**
   * Watch targetRef for mount
   * Check viewport immediately to skip observer for visible images
   */
  watch(targetRef, (element) => {
    if (element) {
      // Check if element is already in viewport
      if (checkViewport()) {
        shouldLoad.value = true
        stop() // Stop observer since we're loading immediately
      }
    }
  }, { immediate: true })

  return {
    loaded,
    error,
    shouldLoad,
    targetRef
  }
}
