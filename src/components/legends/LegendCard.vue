<script setup>
/**
 * LegendCard - Displays individual legend with image, name, and kills
 *
 * @props {Object} legend - Legend data object
 * @props {string} legend.name - Legend name
 * @props {string} legend.imageUrl - Legend image URL
 * @props {string|number} legend.kills - Kill count
 * @props {boolean} isFavorite - Whether this is the top legend (most kills)
 */

import { ref, computed } from 'vue'
import BaseCard from '@/components/ui/BaseCard.vue'

const props = defineProps({
  legend: {
    type: Object,
    required: true,
    validator: (value) => {
      return value && typeof value === 'object' && value.name !== undefined
    }
  },
  isFavorite: {
    type: Boolean,
    default: false
  }
})

const imageError = ref(false)

function handleImageError() {
  imageError.value = true
}

const legendName = computed(() => props.legend?.name || 'Unknown')
const imageUrl = computed(() => props.legend?.imageUrl)
const killsCount = computed(() => props.legend?.kills || 0)
const showFavoriteBadge = computed(() => props.isFavorite === true)
</script>

<template>
  <BaseCard
    class="legend-card"
    :class="{ 'legend-card--favorite': showFavoriteBadge }"
  >
    <div class="legend-card__content">
      <div class="legend-card__image-container">
        <img
          v-if="imageUrl && !imageError"
          :src="imageUrl"
          :alt="`${legendName} legend art`"
          class="legend-card__image"
          @error="handleImageError"
        />
        <div v-else class="legend-card__image-placeholder">
          <span class="legend-card__placeholder-text">{{ legendName.charAt(0) }}</span>
        </div>

        <div v-if="showFavoriteBadge" class="legend-card__badge">
          <svg class="legend-card__badge-icon" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
          </svg>
          <span>Favorite</span>
        </div>
      </div>

      <div class="legend-card__info">
        <h4 class="legend-card__name">{{ legendName }}</h4>
        <div class="legend-card__kills">
          <span class="legend-card__kills-count">{{ killsCount }}</span>
          <span class="legend-card__kills-label">Kills</span>
        </div>
      </div>
    </div>
  </BaseCard>
</template>

<style scoped>
.legend-card {
  width: 100%;
  transition: transform var(--transition-fast), box-shadow var(--transition-fast);
}

.legend-card--favorite {
  border-color: var(--accent-primary);
  box-shadow: 0 0 0 2px var(--accent-primary-dim);
}

.legend-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
}

.legend-card__content {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.legend-card__image-container {
  position: relative;
  width: 100%;
  aspect-ratio: 16 / 9;
  overflow: hidden;
  border-radius: var(--radius-sm);
  background: linear-gradient(135deg, var(--bg-dark), var(--bg-card));
}

.legend-card__image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.legend-card__image-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, var(--accent-primary), var(--accent-primary-hover));
}

.legend-card__placeholder-text {
  font-size: 3rem;
  font-weight: 700;
  color: var(--text-primary);
  text-transform: uppercase;
}

.legend-card__badge {
  position: absolute;
  top: var(--spacing-sm);
  right: var(--spacing-sm);
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  padding: var(--spacing-xs) var(--spacing-sm);
  background: linear-gradient(135deg, var(--accent-primary), var(--accent-primary-hover));
  border-radius: var(--radius-full);
  color: var(--text-primary);
  font-size: 0.75rem;
  font-weight: 600;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.4);
}

.legend-card__badge-icon {
  width: 14px;
  height: 14px;
  fill: #FFD700;
}

.legend-card__info {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.legend-card__name {
  margin: 0;
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--text-primary);
  text-transform: capitalize;
}

.legend-card__kills {
  display: flex;
  align-items: baseline;
  gap: var(--spacing-xs);
}

.legend-card__kills-count {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--accent-primary);
  font-variant-numeric: tabular-nums;
}

.legend-card__kills-label {
  font-size: 0.875rem;
  color: var(--text-muted);
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

/* Mobile responsiveness - 768px breakpoint per 03-CONTEXT.md */
@media (max-width: 768px) {
  .legend-card__name {
    font-size: 1rem;
  }

  .legend-card__kills-count {
    font-size: 1.25rem;
  }

  .legend-card__kills-label {
    font-size: 0.875rem; /* Minimum 14px for readability */
  }

  .legend-card__badge {
    padding: 2px var(--spacing-xs);
    font-size: 0.6875rem;
  }

  .legend-card__badge-icon {
    width: 12px;
    height: 12px;
  }
}
</style>
