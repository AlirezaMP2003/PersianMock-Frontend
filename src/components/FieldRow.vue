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
  get() {
    return props.field.table_name
  },

  set(value) {
    emit('updateName', props.index, value)
  },
})
</script>

<template>
  <div
    class="grid grid-cols-4 items-center gap-2 border-t border-gray-200 px-3 py-3 text-sm text-gray-700 transition hover:bg-gray-50 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-700"
  >
    <span
      class="drag-handle cursor-grab select-none text-center text-gray-400"
      title="Drag to reorder"
      aria-hidden="true"
    >
      ☰
    </span>

    <input
      v-model="columnName"
      type="text"
      :aria-label="`Column name ${index + 1}`"
      class="min-w-0 rounded-md border border-gray-300 bg-transparent px-2 py-1.5 text-gray-900 outline-none focus:border-green-500 dark:border-gray-600 dark:text-white"
    />

    <span class="truncate text-center" :title="field.type">
      {{ field.type }}
    </span>

    <button
      type="button"
      :aria-label="`Remove ${field.table_name}`"
      class="text-center text-lg text-red-500 hover:text-red-700"
      @click="emit('remove', index)"
    >
      ✕
    </button>
  </div>
</template>
