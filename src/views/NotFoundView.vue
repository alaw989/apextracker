<script setup>
/**
 * NotFoundView - 404 Not Found page
 *
 * Displayed when users visit invalid URL patterns or when
 * platform validation fails in the router guard.
 */

import { useRouter } from 'vue-router'
import BaseButton from '@/components/ui/BaseButton.vue'

const router = useRouter()

/**
 * Navigate back to home
 */
function goToHome() {
  router.push({ name: 'home' })
}
</script>

<template>
  <div class="not-found-view">
    <div class="not-found-content">
      <h1 class="not-found-title">404</h1>
      <h2 class="not-found-heading">Player Not Found</h2>
      <p class="not-found-message">
        The player you're looking for doesn't exist on this platform.
      </p>
      <BaseButton
        variant="primary"
        @click="goToHome"
        class="not-found-button"
      >
        Search for Another Player
      </BaseButton>
    </div>
  </div>
</template>

<style scoped>
.not-found-view {
  width: 100%;
  min-height: 50vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

.not-found-content {
  text-align: center;
  padding: var(--spacing-2xl);
  max-width: 400px;
}

.not-found-title {
  font-size: 6rem;
  font-weight: 700;
  color: var(--accent-primary);
  margin: 0 0 var(--spacing-md) 0;
  line-height: 1;
  text-shadow: 0 4px 8px rgba(0, 0, 0, 0.5);
}

.not-found-heading {
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0 0 var(--spacing-md) 0;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.not-found-message {
  font-size: 1rem;
  color: var(--text-muted);
  margin: 0 0 var(--spacing-xl) 0;
  line-height: 1.6;
}

.not-found-button {
  min-width: 200px;
}

/* Responsive Design */
@media (max-width: 768px) {
  .not-found-title {
    font-size: 4rem;
  }

  .not-found-heading {
    font-size: 1.25rem;
  }

  .not-found-message {
    font-size: 0.875rem;
  }
}
</style>
