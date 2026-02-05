<script setup>
import { ref } from 'vue'
import BaseCard from '@/components/ui/BaseCard.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import BaseInput from '@/components/ui/BaseInput.vue'
import PlatformSelect from '@/components/search/PlatformSelect.vue'
import SearchInput from '@/components/search/SearchInput.vue'
import SearchButton from '@/components/search/SearchButton.vue'

// Simple state for testing components
const username = ref('')
const platform = ref('origin')
const searchLoading = ref(false)

function handleClick() {
  console.log('Button clicked! Username:', username.value)
}

function handlePlatformChange(value) {
  console.log('Platform changed to:', value)
}

function handleSubmit() {
  console.log('Search submitted for:', username.value, 'on', platform.value)
  searchLoading.value = true
  setTimeout(() => {
    searchLoading.value = false
  }, 2000)
}
</script>

<template>
  <div class="app">
    <div class="app__container">
      <h1 class="app__title">Apex Tracker</h1>
      <p class="app__subtitle">Vue 3 + Vite + Pinia Design System</p>

      <BaseCard class="app__card">
        <template #header>
          <h2>Base UI Components Demo</h2>
        </template>

        <div class="demo-section">
          <h3>BaseButton</h3>
          <div class="button-group">
            <BaseButton variant="primary" @click="handleClick">Primary</BaseButton>
            <BaseButton variant="secondary" @click="handleClick">Secondary</BaseButton>
            <BaseButton variant="danger" @click="handleClick">Danger</BaseButton>
            <BaseButton variant="primary" :loading="true">Loading</BaseButton>
            <BaseButton variant="secondary" :disabled="true">Disabled</BaseButton>
          </div>
        </div>

        <div class="demo-section">
          <h3>SearchInput</h3>
          <SearchInput
            v-model="username"
            placeholder="Enter Apex username..."
            @submit="handleSubmit"
            class="input-demo"
          />
          <p class="input-value">Value: {{ username || '(empty)' }}</p>
        </div>

        <div class="demo-section">
          <h3>PlatformSelect</h3>
          <PlatformSelect v-model="platform" @update:model-value="handlePlatformChange" />
          <p class="input-value">Selected: {{ platform }}</p>
        </div>

        <div class="demo-section">
          <h3>SearchInput + PlatformSelect + SearchButton</h3>
          <div class="search-form">
            <SearchInput
              v-model="username"
              placeholder="Enter Apex username..."
              @submit="handleSubmit"
            />
            <PlatformSelect v-model="platform" />
            <SearchButton :loading="searchLoading" @click="handleSubmit">
              Search
            </SearchButton>
          </div>
        </div>

        <template #footer>
          <p class="card-footer">Design system foundation is ready for Phase 1 development</p>
        </template>
      </BaseCard>

      <BaseCard variant="elevated" class="app__card">
        <h3>Card Variants</h3>
        <p>BaseCard supports default, elevated, and outlined variants with header/footer slots.</p>
      </BaseCard>
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
  max-width: 600px;
}

.app__title {
  text-align: center;
  color: var(--text-primary);
  margin-bottom: var(--spacing-sm);
}

.app__subtitle {
  text-align: center;
  color: var(--text-muted);
  margin-bottom: var(--spacing-xl);
}

.app__card {
  margin-bottom: var(--spacing-lg);
}

.demo-section {
  margin-bottom: var(--spacing-lg);
}

.demo-section:last-child {
  margin-bottom: 0;
}

.demo-section h3 {
  font-size: 1rem;
  color: var(--text-secondary);
  margin-bottom: var(--spacing-md);
}

.button-group {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-sm);
}

.input-demo {
  margin-bottom: var(--spacing-sm);
}

.input-value {
  font-size: 0.875rem;
  color: var(--text-muted);
  font-family: monospace;
}

.card-footer {
  text-align: center;
  color: var(--text-muted);
  font-size: 0.875rem;
}

.search-form {
  display: flex;
  gap: var(--spacing-sm);
  flex-wrap: wrap;
}

.search-form .search-input {
  flex: 1;
  min-width: 200px;
}
</style>
