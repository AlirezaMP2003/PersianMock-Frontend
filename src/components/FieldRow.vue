<template>
  <div
    class="grid grid-cols-4 items-center text-gray-700 text-sm border-t border-gray-200 dark:border-gray-700 px-3 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 transition"
  >
    <span class="drag-handle cursor-move text-gray-400">☰</span>

    <input
      type="text"
      v-model="localName"
      @input="emitUpdate"
      class="border border-gray-300 dark:border-gray-600 rounded px-2 py-1 bg-transparent focus:outline-none"
    />

    <span class="text-gray-700 dark:text-gray-200 text-center">{{ field.type }}</span>

    <button
      @click="$emit('remove', index)"
      class="text-red-500 hover:text-red-700 text-lg text-center"
    >
      ✕
    </button>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  field: Object,
  index: Number,
})
const emit = defineEmits(['remove', 'updateName'])

const localName = ref(props.field.table_name)
const emitUpdate = () => emit('updateName', props.index, localName.value)

watch(
  () => props.field.name,
  (val) => (localName.value = val)
)
</script>
