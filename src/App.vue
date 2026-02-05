<script setup>
/**
 * App - Main application component
 *
 * Root component that renders the search interface for player lookup.
 * Uses Pinia stores for state management and API calls.
 */

import { ref } from 'vue'
import { storeToRefs } from 'pinia'
import { usePlayerStore } from '@/stores/player'
import { useUiStore } from '@/stores/ui'
import SearchInput from '@/components/search/SearchInput.vue'
import PlatformSelect from '@/components/search/PlatformSelect.vue'
import SearchButton from '@/components/search/SearchButton.vue'

// Pinia stores
const playerStore = usePlayerStore()
const uiStore = useUiStore()

// Store refs for reactive access
const { searchLoading, error, data } = storeToRefs(playerStore)

// Local search form state
const username = ref('')
const platform = ref('origin')

/**
 * Handle search form submission
 * Validates username is not empty and calls playerStore.searchPlayer
 */
async function handleSearch() {
  // Validate username
  if (!username.value || username.value.trim() === '') {
    uiStore.setError('Please enter a username')
    return
  }

  // Clear any previous errors
  uiStore.clearError()

  // Call the store action
  await playerStore.searchPlayer(username.value.trim(), platform.value)
}
</script>

<template>
  <div class="app">
    <div class="app__container">
      <!-- Header -->
      <header class="app__header">
        <h1 class="app__title">CHECK PLAYER RANK AND STATS</h1>
      </header>

      <!-- Search Form -->
      <div class="search-section">
        <div class="search-form">
          <SearchInput
            v-model="username"
            placeholder="Apex Username"
            @submit="handleSearch"
            class="search-form__input"
          />
          <PlatformSelect
            v-model="platform"
            class="search-form__platform"
          />
          <SearchButton
            :loading="searchLoading"
            :disabled="!username.trim()"
            @click="handleSearch"
            class="search-form__button"
          >
            Search
          </SearchButton>
        </div>

        <!-- Error Display -->
        <div v-if="error" class="search-error">
          {{ error }}
        </div>
      </div>

      <!-- Player Results Display (placeholder for next phase) -->
      <div v-if="data" class="results">
        <div class="player-info">
          <h2>{{ data.name }}</h2>
          <p>Platform: {{ platform }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: var(--spacing-2xl) var(--spacing-md);
}

.app__container {
  width: 100%;
  max-width: 800px;
}

.app__header {
  text-align: center;
  margin-bottom: var(--spacing-xl);
}

.app__title {
  font-size: 1.75rem;
  font-weight: 600;
  color: var(--text-primary);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin: 0;
}

/* Search Section */
.search-section {
  width: 100%;
}

.search-form {
  display: flex;
  gap: var(--spacing-sm);
  align-items: stretch;
}

.search-form__input {
  flex: 1;
  min-width: 200px;
}

.search-form__platform {
  flex-shrink: 0;
}

.search-form__button {
  flex-shrink: 0;
}

/* Error Display */
.search-error {
  margin-top: var(--spacing-md);
  padding: var(--spacing-sm) var(--spacing-md);
  background-color: rgba(201, 76, 76, 0.1);
  border: 1px solid var(--accent-danger);
  border-radius: var(--radius-md);
  color: var(--accent-danger);
  font-size: 0.875rem;
}

/* Results Section (placeholder) */
.results {
  margin-top: var(--spacing-xl);
}

.player-info {
  padding: var(--spacing-md);
  background-color: var(--bg-card);
  border-radius: var(--radius-md);
  border: 1px solid var(--border);
}

/* Responsive Design */
@media (max-width: 768px) {
  .app {
    padding: var(--spacing-lg) var(--spacing-sm);
  }

  .app__title {
    font-size: 1.25rem;
  }

  .search-form {
    flex-direction: column;
    align-items: stretch;
  }

  .search-form__input,
  .search-form__platform,
  .search-form__button {
    width: 100%;
  }

  .search-form__platform {
    order: -1;
  }
}
</style>
