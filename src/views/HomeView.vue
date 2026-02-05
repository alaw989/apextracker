<script setup>
/**
 * HomeView - Homepage with search form
 *
 * Main landing page where users search for Apex Legends players.
 * On successful search, navigates to the player profile route.
 */

import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { usePlayerStore } from '@/stores/player'
import { useSearchStore } from '@/stores/search'
import { useUiStore } from '@/stores/ui'
import SearchInput from '@/components/search/SearchInput.vue'
import PlatformSelect from '@/components/search/PlatformSelect.vue'
import SearchButton from '@/components/search/SearchButton.vue'
import ErrorMessage from '@/components/ui/ErrorMessage.vue'
import LoadingSpinner from '@/components/ui/LoadingSpinner.vue'

// Router for navigation
const router = useRouter()

// Pinia stores
const playerStore = usePlayerStore()
const searchStore = useSearchStore()
const uiStore = useUiStore()

// Store refs for reactive access
const { searchLoading, error } = storeToRefs(playerStore)

// Local search form state
const username = ref('')
const platform = ref('origin')

/**
 * Handle search form submission
 * Validates username and calls playerStore.searchPlayer
 * On success, navigates to player route and stores in history
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

  // On success, navigate to player route and store in history
  if (result.success) {
    searchStore.addToHistory(username.value.trim(), platform.value)
    await router.push({
      name: 'player',
      params: {
        username: username.value.trim(),
        platform: platform.value
      }
    })
  }
}
</script>

<template>
  <main class="home-view">
    <!-- Page Header -->
    <header class="home-view__header">
      <h1 class="home-view__title">Apex Legends Stats Tracker</h1>
      <p class="home-view__subtitle">Search for player ranks and statistics</p>
    </header>

    <!-- Player Search Form Section -->
    <section aria-label="Player search form" class="search-section">
      <div class="search-form">
        <SearchInput
          v-model="username"
          placeholder="Apex Username"
          aria-label="Enter Apex Legends username"
          @submit="handleSearch"
          class="search-form__input"
        />
        <PlatformSelect
          v-model="platform"
          aria-label="Select gaming platform"
          class="search-form__platform"
        />
        <SearchButton
          :loading="searchLoading"
          :disabled="!username.trim()"
          @click="handleSearch"
          class="search-form__button"
          aria-label="Search for player"
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
    </section>

    <!-- Loading State -->
    <div v-if="searchLoading" class="content-area">
      <LoadingSpinner size="large" text="Searching..." />
    </div>

    <!-- Error Helper (after search attempt) -->
    <div v-else-if="error" class="content-area">
      <div class="error-helper">
        <p class="error-helper__text">Please check the username and platform, then try again.</p>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="empty-state">
      <svg class="empty-state__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
        <circle cx="11" cy="11" r="8"/>
        <path d="m21 21-4.35-4.35"/>
      </svg>
      <h2 class="empty-state__title">Search for a Player</h2>
      <p class="empty-state__text">Enter an Apex Legends username and select a platform to view stats.</p>
    </div>
  </main>
</template>

<style scoped>
.home-view {
  width: 100%;
}

.home-view__header {
  text-align: center;
  margin-bottom: var(--spacing-xl);
}

.home-view__title {
  font-size: 1.75rem;
  font-weight: 600;
  color: var(--text-primary);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin: 0 0 var(--spacing-sm) 0;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
}

.home-view__subtitle {
  font-size: 1rem;
  font-weight: 400;
  color: var(--text-muted);
  margin: 0;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
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
  text-transform: none;
  letter-spacing: normal;
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
  .home-view__title {
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
