<script setup>
import { ref, watchEffect } from 'vue'
import Header from './components/Header.vue'
import MainContent from './components/MainContent.vue'

const isDark = ref(
  localStorage.getItem('theme') === 'dark'
)

function toggleTheme() {
  isDark.value = !isDark.value
  localStorage.setItem(
    'theme',
    isDark.value ? 'dark' : 'light'
  )
}

watchEffect(() => {
  document.documentElement.classList.toggle(
    'dark',
    isDark.value
  )
})
</script>

<template>
  <div class="app-shell min-h-screen">
    <Header
      :is-dark="isDark"
      @toggle-theme="toggleTheme"
    />

    <main class="relative mx-auto w-full max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
      <MainContent />
    </main>

    <footer class="app-footer px-4 py-6 sm:px-6">
      <div class="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 text-center text-xs sm:flex-row">
        <span>PersianMock — Synthetic Data Workspace</span>
        <span>Built for Persian & Iranian sample data</span>
      </div>
    </footer>
  </div>
</template>