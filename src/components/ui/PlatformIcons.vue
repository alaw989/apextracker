<template>
  <component :is="iconComponent" :width="width" :height="height" :fill="fill" />
</template>

<script setup>
import { computed } from 'vue'
import WindowsSVG from './WindowsSVG.vue'
import XboxSVG from './XboxSVG.vue'
import PlaystationSVG from './PlaystationSVG.vue'

/**
 * Platform Icons Component
 * Renders the appropriate platform icon based on the platform prop
 *
 * @prop {string} platform - The platform ID ('origin', 'xbl', 'psn')
 * @prop {number|string} width - Icon width (default: 20)
 * @prop {number|string} height - Icon height (default: 20)
 * @prop {string} fill - Icon fill color (default: #CAD0E3)
 */
const props = defineProps({
  platform: {
    type: String,
    required: true,
    validator: (value) => ['origin', 'xbl', 'psn'].includes(value)
  },
  width: {
    type: [String, Number],
    default: 20
  },
  height: {
    type: [String, Number],
    default: 20
  },
  fill: {
    type: String,
    default: '#CAD0E3'
  }
})

/**
 * Map platform IDs to their corresponding icon components
 */
const iconMap = {
  origin: WindowsSVG,
  xbl: XboxSVG,
  psn: PlaystationSVG
}

/**
 * Computed property that returns the correct icon component
 */
const iconComponent = computed(() => {
  return iconMap[props.platform] || WindowsSVG
})
</script>
