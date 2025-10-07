<template>
  <div
    class="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
    @click.self="$emit('close')"
  >
    <div
      class="bg-white text-gray-700 dark:bg-gray-800 rounded-lg p-6 w-96 shadow-lg"
    >
      <h3 class="text-lg font-bold mb-4 text-center">افزودن فیلد جدید</h3>

      <input
        v-model="search"
        placeholder="جستجو..."
        class="w-full mb-4 p-2 rounded border border-gray-300 dark:border-gray-600 bg-transparent focus:outline-none"
      />

      <div class="max-h-60 overflow-y-auto space-y-2">
        <div
          v-for="field in filteredFields"
          :key="field.name"
          @click="selectField(field)"
          class="p-2 rounded cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition"
        >
          {{ field.type }}
        </div>
      </div>

      <button
        @click="$emit('close')"
        class="mt-4 w-full py-2 border rounded hover:bg-gray-100 dark:hover:bg-gray-700"
      >
        بستن
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const emit = defineEmits(['close', 'addField'])
const search = ref('')

const availableFields = [
  { name: 'first_name', type: 'نام', table_name: 'first_name' },
  { name: 'last_name', type: 'نام خانوادگی', table_name: 'last_name' },
  { name: 'email', type: 'ایمیل', table_name: 'email' },
  { name: 'username', type: 'نام کاربری', table_name: 'username' },
  { name: 'password', type: 'رمز عبور', table_name: 'password' },
  { name: 'gender', type: 'جنسیت', table_name: 'gender' },
  { name: 'city', type: 'شهر', table_name: 'city' },
  { name: 'country', type: 'کشور', table_name: 'country' },
  { name: 'car', type: 'خودرو', table_name: 'car' },
  { name: 'animal', type: 'حیوان', table_name: 'animal' },
]

const filteredFields = computed(() =>
  availableFields.filter((f) => f.name.includes(search.value))
)

const selectField = (field) => {
  emit('addField', {
    id: Date.now(),
    name: field.name,
    type: field.type,
    table_name: field.table_name,
  })
  emit('close')
}
</script>
