<script setup>
import { ref } from 'vue'
import PlatformIcons from './components/ui/PlatformIcons.vue'

const selectedPlatform = ref('origin')

function setPlatform(platform) {
  selectedPlatform.value = platform
}
</script>

<template>
  <div class="app">
    <h1>Apex Tracker</h1>
    <div class="card">
      <h2>Platform Icons Test</h2>
      <p>Selected: {{ selectedPlatform }}</p>
      <div class="icons-container">
        <div
          class="platform-option"
          :class="{ active: selectedPlatform === 'origin' }"
          @click="setPlatform('origin')"
        >
          <PlatformIcons platform="origin" :width="32" :height="32" />
          <span>PC</span>
        </div>
        <div
          class="platform-option"
          :class="{ active: selectedPlatform === 'xbl' }"
          @click="setPlatform('xbl')"
        >
          <PlatformIcons platform="xbl" :width="32" :height="32" />
          <span>Xbox</span>
        </div>
        <div
          class="platform-option"
          :class="{ active: selectedPlatform === 'psn' }"
          @click="setPlatform('psn')"
        >
          <PlatformIcons platform="psn" :width="32" :height="32" />
          <span>PlayStation</span>
        </div>
      </div>
      <p class="info">Platform icons are rendering correctly!</p>
    </div>
  </div>
</template>

<style scoped>
.app {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: #24283c;
  color: #fff;
}

h1 {
  font-size: 2.5rem;
  margin-bottom: 2rem;
}

h2 {
  font-size: 1.5rem;
  margin-bottom: 1rem;
  color: #CAD0E3;
}

.card {
  padding: 2rem;
  background: #424761;
  border-radius: 8px;
  text-align: center;
  min-width: 300px;
}

.icons-container {
  display: flex;
  gap: 1.5rem;
  justify-content: center;
  margin: 1.5rem 0;
}

.platform-option {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem;
  background: #24283c;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.platform-option:hover,
.platform-option.active {
  background: #3c8772;
  transform: scale(1.05);
}

.platform-option span {
  font-size: 0.875rem;
  color: #CAD0E3;
}

.info {
  margin-top: 1rem;
  color: #9aa5b1;
  font-size: 0.875rem;
}
</style>
