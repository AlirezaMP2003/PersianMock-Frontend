<script setup>
import ThemeToggle from './ThemeToggle.vue'

defineProps({
  isDark: {
    type: Boolean,
    required: true,
  },
})

defineEmits(['toggleTheme'])
</script>

<template>
  <header class="app-header">
    <div
      class="mx-auto flex h-[76px] w-full max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8"
    >
      <div class="flex min-w-0 items-center gap-3">
        <div
          class="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#102438] shadow-sm"
          aria-hidden="true"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="29"
            height="29"
            viewBox="0 0 32 32"
            fill="none"
          >
            <path
              d="M11 7H8C6.9 7 6 7.9 6 9V12C6 14.2 4.5 15 3 16C4.5 17 6 17.8 6 20V23C6 24.1 6.9 25 8 25H11"
              stroke="#72E0C4"
              stroke-width="2.3"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M21 7H24C25.1 7 26 7.9 26 9V12C26 14.2 27.5 15 29 16C27.5 17 26 17.8 26 20V23C26 24.1 25.1 25 24 25H21"
              stroke="#72E0C4"
              stroke-width="2.3"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <circle cx="16" cy="11" r="2" fill="white" />
            <circle cx="16" cy="21" r="2" fill="white" />
            <path
              d="M16 13V19"
              stroke="white"
              stroke-width="2"
              stroke-linecap="round"
            />
          </svg>
        </div>

        <div class="min-w-0">
          <h1
            class="truncate text-lg font-extrabold tracking-tight text-[#102438] dark:text-white sm:text-xl"
          >
            Persian<span class="text-[#147D74] dark:text-[#72E0C4]">Mock</span>
          </h1>

          <p
            class="hidden text-[10px] font-semibold uppercase tracking-[0.19em] text-slate-500 dark:text-slate-400 sm:block"
          >
            Synthetic Data Workspace
          </p>
        </div>
      </div>

      <div class="flex shrink-0 items-center gap-3">
        <span
          class="hidden rounded-full border border-teal-200 bg-teal-50 px-3 py-1 text-xs font-semibold text-teal-800 dark:border-teal-900 dark:bg-teal-950 dark:text-teal-300 sm:inline-flex"
        >
          Persian Data Generator
        </span>

        <ThemeToggle
          :is-dark="isDark"
          @toggle-theme="$emit('toggleTheme')"
        />
      </div>
    </div>
  </header>
</template>