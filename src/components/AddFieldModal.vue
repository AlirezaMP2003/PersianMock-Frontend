<script setup>
import { ref, computed } from 'vue'

const emit = defineEmits(['close', 'addField'])

const search = ref('')

const availableFields = [
  { name: 'id', label: 'ID' },
  { name: 'firstname', label: 'First Name' },
  { name: 'lastname', label: 'Last Name' },
  { name: 'email', label: 'Email Address' },
  { name: 'username', label: 'Username' },
  { name: 'password', label: 'Password' },
  { name: 'gender', label: 'Gender' },
  { name: 'province', label: 'Province' },
  { name: 'city', label: 'City' },
  { name: 'car_company', label: 'Car Company' },
  { name: 'car_name', label: 'Car Model' },
  { name: 'car_color', label: 'Car Color' },
  { name: 'car_year', label: 'Car Year' },
  { name: 'mobile_number', label: 'Mobile Number' },
  { name: 'postal_code', label: 'Postal Code' },
]

const filteredFields = computed(() => {
  const query = search.value.trim().toLowerCase()

  return availableFields.filter((field) =>
    field.name.includes(query) ||
    field.label.toLowerCase().includes(query)
  )
})

function selectField(field) {
  emit('addField', {
    id: crypto.randomUUID(),
    name: field.name,
    type: field.label,
    table_name: field.name,
  })

  emit('close')
}
</script>

<template>
  <div
    class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
    @click.self="emit('close')"
  >
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="add-field-title"
      class="w-full max-w-md rounded-xl bg-white p-6 shadow-xl dark:bg-gray-800"
    >
      <div class="mb-5 flex items-center justify-between">
        <h2
          id="add-field-title"
          class="text-lg font-semibold text-gray-900 dark:text-white"
        >
          Add a field
        </h2>

        <button
          type="button"
          aria-label="Close"
          class="text-gray-500 hover:text-gray-900 dark:hover:text-white"
          @click="emit('close')"
        >
          ✕
        </button>
      </div>

      <input
        v-model="search"
        type="search"
        placeholder="Search field types..."
        aria-label="Search field types"
        class="mb-4 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 outline-none focus:border-green-500 dark:border-gray-600 dark:bg-gray-900 dark:text-white"
      />

      <div class="max-h-72 space-y-1 overflow-y-auto">
        <button
          v-for="field in filteredFields"
          :key="field.name"
          type="button"
          class="flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left text-gray-800 transition hover:bg-gray-100 dark:text-gray-100 dark:hover:bg-gray-700"
          @click="selectField(field)"
        >
          <span>{{ field.label }}</span>
          <span class="text-xs text-gray-400">
            {{ field.name }}
          </span>
        </button>

        <p
          v-if="filteredFields.length === 0"
          class="py-5 text-center text-sm text-gray-500"
        >
          No matching field types found.
        </p>
      </div>
    </div>
  </div>
</template>
