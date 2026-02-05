<script setup>
import { ref } from 'vue'

const count = ref(0)
</script>

<template>
  <div class="app">
    <h1>Apex Tracker</h1>
    <div class="card">
      <button type="button" @click="count++">count is {{ count }}</button>
      <p>
        Vue 3 + Vite is ready. Start building your Apex Legends stat tracker.
      </p>
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

.card {
  padding: 2rem;
  background: #424761;
  border-radius: 8px;
  text-align: center;
}

button {
  padding: 0.5rem 1rem;
  background: #3c8772;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  margin-bottom: 1rem;
}

button:hover {
  background: #4da38a;
}
</style>
