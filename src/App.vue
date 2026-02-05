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
import { useSearchStore } from '@/stores/search'
import { useUiStore } from '@/stores/ui'
import SearchInput from '@/components/search/SearchInput.vue'
import PlatformSelect from '@/components/search/PlatformSelect.vue'
import SearchButton from '@/components/search/SearchButton.vue'
import LoadingSpinner from '@/components/ui/LoadingSpinner.vue'
import ErrorMessage from '@/components/ui/ErrorMessage.vue'
import PlayerHeader from '@/components/stats/PlayerHeader.vue'
import StatsList from '@/components/stats/StatsList.vue'
import FavoriteLegends from '@/components/legends/FavoriteLegends.vue'

// Pinia stores
const playerStore = usePlayerStore()
const searchStore = useSearchStore()
const uiStore = useUiStore()

// Store refs for reactive access
const { searchLoading, error, data } = storeToRefs(playerStore)

// Local search form state
const username = ref('')
const platform = ref('origin')

/**
 * Handle search form submission
 * Validates username is not empty and calls playerStore.searchPlayer
 * Stores successful searches in history for quick re-access
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
  const result = await playerStore.searchPlayer(username.value.trim(), platform.value)

  // Store in history after successful search
  if (result.success) {
    searchStore.addToHistory(username.value.trim(), platform.value)
  }
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
        <ErrorMessage
          v-if="error"
          :message="error"
          type="error"
          class="search-error"
        />
      </div>

      <!-- Content Area - State-based rendering -->
      <!-- Loading State -->
      <div v-if="searchLoading" class="content-area">
        <LoadingSpinner size="large" text="Searching..." />
      </div>

      <!-- Error State (after search attempt) -->
      <div v-else-if="error" class="content-area">
        <div class="error-helper">
          <p class="error-helper__text">Please check the username and platform, then try again.</p>
        </div>
      </div>

      <!-- Success State - Player Results Display -->
      <template v-else-if="data">
        <!-- Player Header with Avatar, Name, and Rank -->
        <PlayerHeader
          :player="{
            name: data.name,
            avatar: data.avatar,
            rankIcon: data.rankIcon
          }"
          class="results-section"
        />

        <!-- Stats List (vertical layout, NOT grid) -->
        <StatsList
          :stats="data.stats"
          class="results-section"
        />

        <!-- Favorite Legends (top 2 by kills) -->
        <FavoriteLegends
          :legends="data.legends"
          class="results-section"
        />
      </template>

      <!-- Empty State (when no search has been done yet) -->
      <div v-else-if="!error" class="empty-state">
        <svg class="empty-state__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <circle cx="11" cy="11" r="8"/>
          <path d="m21 21-4.35-4.35"/>
        </svg>
        <h3 class="empty-state__title">Search for a Player</h3>
        <p class="empty-state__text">Enter an Apex Legends username and select a platform to view stats.</p>
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
  width: 100%;
}

/* Content Area */
.content-area {
  margin-top: var(--spacing-2xl);
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 200px;
}

.error-helper {
  text-align: center;
  padding: var(--spacing-xl);
}

.error-helper__text {
  color: var(--text-muted);
  font-size: 0.875rem;
  margin: 0;
}

/* Results Section */
.results-section {
  margin-top: var(--spacing-lg);
  width: 100%;
}

/* Empty State */
.empty-state {
  margin-top: var(--spacing-2xl);
  padding: var(--spacing-2xl) var(--spacing-lg);
  text-align: center;
  border: 2px dashed var(--border);
  border-radius: var(--radius-md);
}

.empty-state__icon {
  width: 48px;
  height: 48px;
  margin: 0 auto var(--spacing-md);
  color: var(--text-muted);
  stroke-width: 2;
}

.empty-state__title {
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--text-secondary);
  margin: 0 0 var(--spacing-sm) 0;
}

.empty-state__text {
  font-size: 0.875rem;
  color: var(--text-muted);
  margin: 0;
  max-width: 300px;
  margin-left: auto;
  margin-right: auto;
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
