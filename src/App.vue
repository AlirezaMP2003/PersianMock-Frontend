<script setup>
import { ref, watchEffect  } from 'vue';
import Header from './components/Header.vue';
import MainContent from './components/MainContent.vue';

const isDark = ref(localStorage.getItem('theme') === 'dark')

const toggleTheme = () => {
  isDark.value = !isDark.value
  localStorage.setItem('theme', isDark.value ? 'dark' : 'light')
}

watchEffect(() => {
  document.documentElement.classList.toggle('dark', isDark.value)
})

</script>

<template>
  <div :class="isDark ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'"
       class="min-h-screen transition-colors duration-300">
    <Header :isDark="isDark" @toggleTheme="toggleTheme" />
    <main class="p-4 container mx-auto">
      <MainContent />
    </main>
  </div>
</template>