<script setup>
import { computed } from 'vue'

const props = defineProps({
  field: {
    type: Object,
    required: true,
  },
  index: {
    type: Number,
    required: true,
  },
})

const emit = defineEmits(['remove', 'updateName'])

const columnName = computed({
  get: () => props.field.table_name,
  set: (value) => {
    emit('updateName', props.index, value)
  },
})
</script>

<template>
  <div
    class="grid grid-cols-[28px_minmax(0,1fr)_minmax(0,1fr)_32px] items-center gap-2 border-t border-slate-100 px-3 py-3 transition hover:bg-slate-50 sm:grid-cols-[36px_minmax(0,1fr)_minmax(0,1fr)_36px] dark:border-slate-700 dark:hover:bg-slate-700/50"
  >
    <span
      class="drag-handle cursor-grab select-none text-center text-slate-400 active:cursor-grabbing"
      title="Drag to reorder"
      aria-hidden="true"
    >
      ⠿
    </span>

    <input
      v-model="columnName"
      type="text"
      :aria-label="`Column name ${index + 1}`"
      class="min-w-0 w-full rounded-lg border border-slate-200 bg-slate-50 px-2 py-2 text-sm text-[#102438] outline-none focus:border-teal-600 dark:border-slate-600 dark:bg-slate-900 dark:text-white"
    />

    <div class="min-w-0">
      <span
        class="block truncate rounded-lg bg-teal-50 px-2 py-2 text-center text-xs font-medium text-teal-800 sm:text-sm dark:bg-teal-950/60 dark:text-teal-300"
        :title="field.type"
      >
        {{ field.type }}
      </span>
    </div>

    <button
      type="button"
      :aria-label="`Remove ${field.table_name}`"
      class="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/40 dark:hover:text-red-400"
      @click="emit('remove', index)"
    >
      ✕
    </button>
  </div>
</template>