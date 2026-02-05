<script setup>
/**
 * LazyImage - Image component with lazy loading and fade-in animation
 *
 * Features:
 * - IntersectionObserver-based lazy loading (via useLazyImage composable)
 * - Smooth fade-in animation matching app transitions (0.4s cubic-bezier)
 * - Gray placeholder with pulse animation during load
 * - Error fallback with placeholder
 * - Viewport images load immediately without observer delay
 *
 * @props {string} src - Image URL (required)
 * @props {string} alt - Alt text for accessibility
 * @props {string} placeholderColor - Background color while loading (default: #374151)
 * @props {string} class - Custom CSS class for root element
 * @emits {string} load - Emitted when image loads successfully
 * @emits {string} error - Emitted when image fails to load
 */
import { ref, computed } from 'vue'
import { useLazyImage } from '@/composables/useLazyImage.js'

const props = defineProps({
  src: {
    type: String,
    required: true
  },
  alt: {
    type: String,
    default: ''
  },
  placeholderColor: {
    type: String,
    default: '#374151'
  },
  class: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['load', 'error'])

// Use lazy image composable
const { loaded, error, shouldLoad, targetRef } = useLazyImage(props.src)

/**
 * Handle successful image load
 */
function onLoad() {
  loaded.value = true
  emit('load')
}

/**
 * Handle image load error
 */
function onError() {
  error.value = true
  emit('error')
}

/**
 * Computed class for root element
 * Combines lazy-image base class with custom class prop
 */
const rootClass = computed(() => {
  return ['lazy-image', props.class].filter(Boolean).join(' ')
})

/**
 * Computed style for placeholder background
 */
const placeholderStyle = computed(() => ({
  backgroundColor: props.placeholderColor
}))
</script>

<template>
  <div ref="targetRef" :class="rootClass">
    <img
      v-if="shouldLoad && !error"
      :src="src"
      :alt="alt"
      :class="['lazy-image__img', { 'lazy-image__loaded': loaded }]"
      @load="onLoad"
      @error="onError"
    />

    <div
      v-if="!loaded && !error"
      class="lazy-image__placeholder"
      :style="placeholderStyle"
      :role="error ? 'img' : undefined"
      :aria-label="error ? alt : undefined"
    >
      <span class="lazy-image__placeholder-pulse" />
    </div>

    <!-- Error fallback placeholder -->
    <div
      v-if="error"
      class="lazy-image__error"
      :style="placeholderStyle"
      role="img"
      :aria-label="alt || 'Image failed to load'"
    />
  </div>
</template>

<style scoped>
.lazy-image {
  position: relative;
  overflow: hidden;
  display: inline-block;
}

.lazy-image__img {
  opacity: 0;
  transition: opacity 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  display: block;
  width: 100%;
  height: 100%;
  object-fit: inherit;
}

.lazy-image__loaded {
  opacity: 1;
}

.lazy-image__placeholder,
.lazy-image__error {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.lazy-image__placeholder-pulse {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    90deg,
    rgba(255, 255, 255, 0) 0%,
    rgba(255, 255, 255, 0.05) 50%,
    rgba(255, 255, 255, 0) 100%
  );
  animation: pulse 1.5s ease-in-out infinite;
}

@keyframes pulse {
  0% {
    opacity: 1;
    transform: translateX(-100%);
  }
  50% {
    opacity: 0.5;
  }
  100% {
    opacity: 1;
    transform: translateX(100%);
  }
}

/* Allow width/height to be set via parent styles */
.lazy-image__img,
.lazy-image__placeholder,
.lazy-image__error {
  max-width: 100%;
  max-height: 100%;
}
</style>
