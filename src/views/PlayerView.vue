<script setup>
/**
 * PlayerView - Player profile page
 *
 * Displays player stats from URL params.
 * Auto-fetches on mount when visiting /player/:username/:platform directly.
 * Watches route changes to refetch when navigating between players.
 */

import { ref, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { usePlayerStore } from '@/stores/player'
import SearchInput from '@/components/search/SearchInput.vue'
import PlatformSelect from '@/components/search/PlatformSelect.vue'
import SearchButton from '@/components/search/SearchButton.vue'
import LoadingSpinner from '@/components/ui/LoadingSpinner.vue'
import ErrorMessage from '@/components/ui/ErrorMessage.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import PlayerHeader from '@/components/stats/PlayerHeader.vue'
import StatsList from '@/components/stats/StatsList.vue'
import FavoriteLegends from '@/components/legends/FavoriteLegends.vue'

// Props from route params (via props: true in router)
const props = defineProps({
  username: {
    type: String,
    required: true
  },
  platform: {
    type: String,
    required: true
  }
})

// Router and store
const route = useRoute()
const router = useRouter()
const playerStore = usePlayerStore()

// Store refs for reactive access
const { data, loading, error } = storeToRefs(playerStore)

// Local search form state for quick new search
const searchUsername = ref('')
const searchPlatform = ref('origin')

/**
 * Computed favorite legend from player data
 * Returns the first legend (index 0) which is sorted by kills
 */
const favoriteLegend = computed(() => {
  if (!data.value?.legends?.length) {
    return null
  }
  return data.value.legends[0]
})

/**
 * Fetch player data from URL params
 */
async function fetchPlayerData() {
  await playerStore.fetchPlayer(props.username, props.platform)
}

/**
 * Handle search from player view
 * Navigates to new player route
 */
async function handleNewSearch() {
  if (!searchUsername.value || searchUsername.value.trim() === '') {
    return
  }

  const result = await playerStore.searchPlayer(
    searchUsername.value.trim(),
    searchPlatform.value
  )

  if (result.success) {
    await router.push({
      name: 'player',
      params: {
        username: searchUsername.value.trim(),
        platform: searchPlatform.value
      }
    })
  }
}

/**
 * Navigate back to home
 */
function goToHome() {
  router.push({ name: 'home' })
}

/**
 * Watch route params for changes
 * Refetch data when username or platform changes
 * Immediate: true triggers on mount
 */
watch(
  () => route.params,
  (newParams) => {
    if (newParams.username && newParams.platform) {
      fetchPlayerData()
    }
  },
  { immediate: true }
)

// Clear previous data when component mounts to ensure fresh fetch
playerStore.clearPlayer()
</script>

<template>
  <article class="player-view">
    <!-- Quick Search Form -->
    <form class="quick-search" @submit.prevent="handleNewSearch" aria-label="Search for another player">
      <SearchInput
        v-model="searchUsername"
        placeholder="Search another player..."
        aria-label="Enter another player's username"
        @submit="handleNewSearch"
        class="quick-search__input"
      />
      <PlatformSelect
        v-model="searchPlatform"
        aria-label="Select gaming platform"
        class="quick-search__platform"
      />
      <SearchButton
        :loading="loading"
        :disabled="!searchUsername.trim()"
        @click="handleNewSearch"
        class="quick-search__button"
        aria-label="Search for player"
      >
        Search
      </SearchButton>
    </form>

    <!-- Loading State -->
    <div v-if="loading" class="content-area">
      <LoadingSpinner size="large" text="Loading player stats..." />
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="content-area">
      <div class="error-container">
        <ErrorMessage
          :message="error"
          type="error"
          class="error-message"
        />
        <BaseButton
          variant="secondary"
          @click="goToHome"
          class="back-button"
        >
          Search for Another Player
        </BaseButton>
      </div>
    </div>

    <!-- Player Data Display -->
    <template v-else-if="data">
      <!-- Player Info Header -->
      <header class="player-section">
        <h1 class="visually-hidden">{{ data.name }}</h1>
        <PlayerHeader
          :player="{
            name: data.name,
            avatar: data.avatar,
            rankIcon: data.rankIcon
          }"
        />
      </header>

      <!-- Player Statistics Section -->
      <section aria-labelledby="stats-heading" class="player-section">
        <h2 id="stats-heading" class="visually-hidden">Player Statistics</h2>
        <StatsList :stats="data.stats" />
      </section>

      <!-- Favorite Legends Section -->
      <section aria-labelledby="legends-heading" class="player-section">
        <h2 id="legends-heading" class="visually-hidden">Favorite Legends</h2>
        <FavoriteLegends :legends="data.legends" />
      </section>
    </template>
  </article>
</template>

<style scoped>
/* Visually Hidden - for screen reader only content */
.visually-hidden {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  border: 0;
}

.player-view {
  width: 100%;
}

/* Quick Search */
.quick-search {
  display: flex;
  gap: var(--spacing-sm);
  align-items: stretch;
  margin-bottom: var(--spacing-xl);
}

.quick-search__input {
  flex: 1;
  min-width: 150px;
}

.quick-search__platform {
  flex-shrink: 0;
}

.quick-search__button {
  flex-shrink: 0;
}

/* Content Area */
.content-area {
  margin-top: var(--spacing-lg);
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 300px;
}

.error-container {
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-lg);
  padding: var(--spacing-xl);
}

.error-message {
  width: 100%;
  max-width: 400px;
}

.back-button {
  min-width: 200px;
}

/* Player Sections */
.player-section {
  margin-top: var(--spacing-lg);
  width: 100%;
}

/* Responsive Design */
@media (max-width: 768px) {
  .player-view {
    padding: var(--spacing-md);
  }

  .quick-search {
    flex-wrap: wrap;
    margin-bottom: var(--spacing-md);
  }

  .quick-search__input,
  .quick-search__platform,
  .quick-search__button {
    flex: 1 1 100%;
  }

  .quick-search__platform {
    order: -1;
  }

  .content-area {
    margin-top: var(--spacing-md);
  }

  .error-container {
    padding: var(--spacing-md);
  }

  .back-button {
    width: 100%;
    min-width: unset;
  }

  .player-section {
    margin-top: var(--spacing-md);
  }
}
</style>
