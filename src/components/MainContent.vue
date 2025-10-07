<template>
  <section class="container flex flex-col items-center w-[50%] mt-8 px-4">

    <div
      class="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 overflow-hidden"
    >
      <div class="grid grid-cols-4 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-semibold py-2 px-3 text-sm">
        <span></span>
        <span class="text-center">نام</span>
        <span class="text-center">نوع</span>
        <span class="text-center"></span>
      </div>

      <draggable v-model="fields" handle=".drag-handle" animation="200">
        <template #item="{ element, index }">
          <FieldRow
            :field="element"
            :index="index"
            @remove="removeField"
            @updateName="updateFieldName"
          />
        </template>
      </draggable>

      <div class="p-3 border-t border-gray-200 dark:border-gray-700 text-center">
        <button
          @click="showAddModal = true"
          class="w-full py-2 border border-dashed border-gray-400 text-black rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition"
        >
          + افزودن فیلد جدید
        </button>
      </div>
    </div>

    <div
      class="bg-white dark:bg-gray-800 rounded-lg shadow-md mt-6 p-4 border border-gray-200 dark:border-gray-700"
    >
      <div class="grid md:grid-cols-3 gap-6 text-gray-700">
        <div>
          <label class="block text-sm font-semibold mb-1">تعداد سطرها</label>
          <input
            type="number"
            v-model.number="rowCount"
            min="5"
            class="w-full border border-gray-300 dark:border-gray-600 rounded px-2 py-1.5 bg-transparent"
          />
        </div>

        <div>
          <label class="block text-sm font-semibold mb-1">فرمت خروجی</label>
          <select
            v-model="format"
            class="w-full border border-gray-300 dark:border-gray-600 rounded px-2 py-2 bg-transparent"
          >
            <option value="sql">SQL</option>
            <option value="json">JSON</option>
            <option value="csv">CSV</option>
            <option value="excel">Excel</option>
          </select>
        </div>

        <div>
          <label class="block text-sm font-semibold mb-1">
            {{ format === 'sql' ? 'نام جدول' : 'نام فایل' }}
          </label>
          <input
            type="text"
            v-model="fileName"
            class="w-full border border-gray-300 dark:border-gray-600 rounded px-2 py-1.5 bg-transparent"
          />
        </div>
      </div>

      <div class="text-center mt-6">
        <button
          @click="generateData"
          class="bg-[#52a552] text-white px-6 py-2 rounded-lg shadow hover:opacity-90 transition disabled:opacity-50"
          :disabled="loading"
        >
          <span v-if="loading">⏳ در حال تولید...</span>
          <span v-else>تولید داده</span>
        </button>
      </div>
    </div>

    <AddFieldModal
      v-if="showAddModal"
      @close="showAddModal = false"
      @addField="addField"
    />
  </section>
</template>

<script setup>
import { ref } from 'vue'
import axios from 'axios'
import draggable from 'vuedraggable'
import FieldRow from './FieldRow.vue'
import AddFieldModal from './AddFieldModal.vue'

const showAddModal = ref(false)
const createTable = ref(true)
const rowCount = ref(10)
const format = ref('sql')
const fileName = ref('my_data')
const loading = ref(false)

const fields = ref([
  { id: 1, name: 'firstname', type: 'نام', table_name: 'first_name' },
  { id: 2, name: 'email', type: 'ایمیل', table_name: 'email' },
])

const removeField = (index) => {
  fields.value.splice(index, 1)
}

const addField = (field) => {
  fields.value.push(field)
}

const updateFieldName = (index, newName) => {
  fields.value[index].table_name = newName
}

const generateData = async () => {
  if (!fields.value.length) return alert('هیچ فیلدی انتخاب نشده ❗')
  if (!fileName.value) return alert('لطفاً نام فایل یا جدول را وارد کنید')

  loading.value = true
  try {
    const payload = {
      table_name: fileName.value,
      fields: fields.value.map((f) => ({
        type: f.name,
        name: f.table_name,
      })),
      count: rowCount.value,
      include_create_table: createTable.value,
      format: format.value,
    }

    const response = await axios.post('http://127.0.0.1:8001/generate/', payload, {
      responseType: 'blob',
    })

    const blob = new Blob([response.data])
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${fileName.value}.${format.value === 'excel' ? 'xlsx' : format.value}`
    a.click()
    window.URL.revokeObjectURL(url)
  } catch (err) {
    console.error(err)
    alert('خطا در تولید داده 😢')
  } finally {
    loading.value = false
  }
}

</script>

<style scoped>
.drag-handle {
  cursor: grab;
}
</style>
