<script setup>
/**
 * ShareButton - Share player profile URL
 *
 * Copies the current player's profile URL to clipboard with visual feedback.
 *
 * @props {string} username - Player username
 * @props {string} platform - Gaming platform (origin, xbl, psn)
 * @emits copied - Emitted when URL is successfully copied
 */

import { ref } from 'vue'
import BaseButton from '@/components/ui/BaseButton.vue'

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

const emit = defineEmits(['copied'])

// Feedback state - shows "Copied!" temporarily
const isCopied = ref(false)

/**
 * Copy player profile URL to clipboard
 */
async function copyToClipboard() {
  // Construct the shareable URL
  const url = `${window.location.origin}/player/${props.username}/${props.platform}`

  try {
    // Try modern clipboard API first
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(url)
      showCopiedFeedback()
      emit('copied', url)
      return
    }

    // Fallback for older browsers or non-secure contexts
    fallbackCopyTextToClipboard(url)
  } catch (err) {
    // If clipboard API fails, try fallback
    fallbackCopyTextToClipboard(url)
  }
}

/**
 * Fallback copy method using textarea
 */
function fallbackCopyTextToClipboard(text) {
  const textArea = document.createElement('textarea')
  textArea.value = text
  textArea.style.position = 'fixed'
  textArea.style.left = '-9999px'
  textArea.style.top = '0'
  document.body.appendChild(textArea)
  textArea.focus()
  textArea.select()

  try {
    const successful = document.execCommand('copy')
    if (successful) {
      showCopiedFeedback()
      emit('copied', text)
    }
  } catch (err) {
    console.error('Unable to copy to clipboard', err)
  }

  document.body.removeChild(textArea)
}

/**
 * Show "Copied!" feedback for 2 seconds
 */
function showCopiedFeedback() {
  isCopied.value = true
  setTimeout(() => {
    isCopied.value = false
  }, 2000)
}
</script>

<template>
  <BaseButton
    variant="secondary"
    class="share-button"
    :class="{ 'share-button--copied': isCopied }"
    @click="copyToClipboard"
    aria-label="Share player profile"
  >
    <svg v-if="!isCopied" class="share-button__icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
    <svg v-else class="share-button__icon share-button__icon--check" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M5 13l4 4L19 7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
    <span class="share-button__text">
      {{ isCopied ? 'Copied!' : 'Share Profile' }}
    </span>
  </BaseButton>
</template>

<style scoped>
.share-button {
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-xs);
}

.share-button--copied {
  border-color: var(--accent-primary);
  color: var(--accent-primary);
}

.share-button__icon {
  width: 18px;
  height: 18px;
}

.share-button__icon--check {
  stroke-width: 3;
}

.share-button__text {
  display: inline-flex;
  align-items: center;
}
</style>
