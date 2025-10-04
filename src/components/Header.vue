<template>
  <header class="flex justify-between items-center p-4 bg-[#52a552] shadow-md">
    <div class="flex items-center gap-2">
      <img src="../assets/logo.png" alt="logo" class="w-8 h-8" />
      <h1 class="text-xl font-bold text-white">PersianMock</h1>
    </div>

    <ThemeToggle :isDark="isDark" @toggleTheme="$emit('toggleTheme')" />
  </header>
</template>

<script setup>
import ThemeToggle from './ThemeToggle.vue'
defineProps({ isDark: Boolean })
</script>
