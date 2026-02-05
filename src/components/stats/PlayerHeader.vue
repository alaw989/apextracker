<script setup>
/**
 * PlayerHeader - Displays player info with avatar, name, and rank icon
 *
 * @props {Object} player - Player data object
 * @props {string} player.name - Player username
 * @props {string} player.avatar - Avatar image URL
 * @props {string} player.rankIcon - Rank icon image URL
 */

import { ref } from 'vue'
import BaseCard from '@/components/ui/BaseCard.vue'

const props = defineProps({
  player: {
    type: Object,
    required: true,
    validator: (value) => {
      // Allow empty object for empty state
      if (!value || Object.keys(value).length === 0) return true
      // If data exists, validate structure
      return value.name !== undefined
    }
  }
})

const avatarError = ref(false)
const rankError = ref(false)

function handleAvatarError() {
  avatarError.value = true
}

function handleRankError() {
  rankError.value = true
}

const avatarUrl = props.player?.avatar
const rankIconUrl = props.player?.rankIcon
const playerName = props.player?.name
</script>

<template>
  <BaseCard v-if="player && player.name" class="player-header">
    <div class="player-header__content">
      <div class="player-header__avatar">
        <img
          v-if="avatarUrl && !avatarError"
          :src="avatarUrl"
          :alt="`${playerName} avatar`"
          class="player-header__avatar-img"
          @error="handleAvatarError"
        />
        <div v-else class="player-header__avatar-placeholder">
          <span class="player-header__avatar-initials">
            {{ playerName?.charAt(0)?.toUpperCase() || '?' }}
          </span>
        </div>
      </div>

      <div class="player-header__info">
        <h2 class="player-header__name">{{ playerName }}</h2>
      </div>

      <div class="player-header__rank">
        <img
          v-if="rankIconUrl && !rankError"
          :src="rankIconUrl"
          alt="Rank"
          class="player-header__rank-icon"
          @error="handleRankError"
        />
        <div v-else class="player-header__rank-placeholder">
          <span class="player-header__rank-text">Unranked</span>
        </div>
      </div>
    </div>
  </BaseCard>
</template>

<style scoped>
.player-header {
  width: 100%;
}

.player-header__content {
  display: flex;
  align-items: center;
  gap: var(--spacing-lg);
  padding: var(--spacing-md);
}

.player-header__avatar {
  flex-shrink: 0;
}

.player-header__avatar-img {
  width: 64px;
  height: 64px;
  border-radius: var(--radius-md);
  object-fit: cover;
  border: 2px solid var(--border);
}

.player-header__avatar-placeholder {
  width: 64px;
  height: 64px;
  border-radius: var(--radius-md);
  background: linear-gradient(135deg, var(--accent-primary), var(--accent-primary-hover));
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid var(--border);
}

.player-header__avatar-initials {
  font-size: 1.75rem;
  font-weight: 700;
  color: var(--text-primary);
}

.player-header__info {
  flex: 1;
  min-width: 0;
  text-align: center;
}

.player-header__name {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0;
  word-break: break-word;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.player-header__rank {
  flex-shrink: 0;
}

.player-header__rank-icon {
  width: 48px;
  height: 48px;
  object-fit: contain;
}

.player-header__rank-placeholder {
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--bg-card);
  border-radius: var(--radius-sm);
  border: 1px solid var(--border);
}

.player-header__rank-text {
  font-size: 0.65rem;
  color: var(--text-muted);
  text-align: center;
  font-weight: 600;
}

/* Mobile responsiveness */
@media (max-width: 480px) {
  .player-header__content {
    gap: var(--spacing-md);
    padding: var(--spacing-sm);
  }

  .player-header__avatar-img,
  .player-header__avatar-placeholder {
    width: 48px;
    height: 48px;
  }

  .player-header__avatar-initials {
    font-size: 1.25rem;
  }

  .player-header__name {
    font-size: 1.125rem;
  }

  .player-header__rank-icon,
  .player-header__rank-placeholder {
    width: 40px;
    height: 40px;
  }

  .player-header__rank-text {
    font-size: 0.5rem;
  }
}
</style>
