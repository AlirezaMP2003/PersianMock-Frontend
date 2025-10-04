<template>
  <button
    @click="toggleTheme"
    class="px-2 py-2 rounded-full text-sm hover:bg-gray-200 dark:hover:bg-gray-700 transition"
  >
    {{ isDark ? '☀️' : '🌙' }}
  </button>
</template>

<script setup>
defineProps({ isDark: Boolean })
const emit = defineEmits(['toggleTheme'])

function toggleTheme() {
  emit('toggleTheme')
}
</script>
