<script setup>
import { computed, onMounted, ref } from 'vue'
import draggable from 'vuedraggable'

import FieldRow from './FieldRow.vue'
import AddFieldModal from './AddFieldModal.vue'

import {
  fetchFieldTypes,
  previewData,
  downloadData,
  getApiError,
} from '../services/api'

const showAddModal = ref(false)

const fieldTypes = ref([])
const fieldsLoading = ref(false)
const fieldsError = ref('')

const rowCount = ref(10)
const format = ref('json')
const fileName = ref('my_data')
const createTable = ref(true)

const loading = ref(false)
const previewLoading = ref(false)
const errorMessage = ref('')

const previewRows = ref([])
const hasPreview = ref(false)
const previewColumns = ref([])

const fields = ref([
  {
    id: 'initial-firstname',
    name: 'firstname',
    type: 'First Name',
    table_name: 'firstname',
  },
  {
    id: 'initial-email',
    name: 'email',
    type: 'Email Address',
    table_name: 'email',
  },
])

const identifierPattern = /^[A-Za-z_][A-Za-z0-9_]{0,62}$/

const isBusy = computed(() =>
  loading.value || previewLoading.value
)

const validationError = computed(() => {
  if (!fields.value.length) {
    return 'Add at least one field.'
  }

  if (
    !Number.isInteger(rowCount.value) ||
    rowCount.value < 1 ||
    rowCount.value > 1000
  ) {
    return 'Row count must be between 1 and 1,000.'
  }

  if (!identifierPattern.test(fileName.value)) {
    return 'Table/file name must be a valid SQL identifier (1-63 characters).'
  }

  const names = fields.value.map((field) =>
    field.table_name.trim()
  )

  for (const name of names) {
    if (!identifierPattern.test(name)) {
      return `Invalid column name: "${name}".`
    }

    if (name.toLowerCase() === 'id') {
      return 'The "id" column is generated automatically.'
    }
  }

  const normalized = names.map((name) => name.toLowerCase())

  if (new Set(normalized).size !== normalized.length) {
    return 'Column names must be unique.'
  }

  return ''
})

function normalizeFieldTypes(data) {
  let items = data

  if (!Array.isArray(items)) {
    items = data?.fields ?? data?.field_types ?? data?.types
  }

  if (
    !Array.isArray(items) &&
    items &&
    typeof items === 'object'
  ) {
    items = Object.keys(items)
  }

  if (!Array.isArray(items)) {
    throw new Error('Unsupported field catalog response.')
  }

  const names = items
    .map((item) => {
      if (typeof item === 'string') return item

      if (item && typeof item === 'object') {
        return item.name ?? item.type ?? item.value
      }

      return null
    })
    .filter((name) => typeof name === 'string' && name.length)

  return [...new Set(names)].map((name) => ({ name }))
}

async function loadFields() {
  fieldsLoading.value = true
  fieldsError.value = ''

  try {
    const data = await fetchFieldTypes()
    fieldTypes.value = normalizeFieldTypes(data)
  } catch (error) {
    fieldsError.value =
      error instanceof Error &&
      error.message === 'Unsupported field catalog response.'
        ? error.message
        : await getApiError(error)
  } finally {
    fieldsLoading.value = false
  }
}

function clearPreview() {
  previewRows.value = []
  previewColumns.value = []
  hasPreview.value = false
  errorMessage.value = ''
}

function addField(field) {
  const existingNames = new Set(
    fields.value.map((item) => item.table_name.toLowerCase())
  )

  const baseName = field.table_name
  let nextName = baseName
  let suffix = 2

  while (existingNames.has(nextName.toLowerCase())) {
    nextName = `${baseName}_${suffix}`
    suffix++
  }

  fields.value.push({
    ...field,
    table_name: nextName,
  })

  clearPreview()
}

function removeField(index) {
  fields.value.splice(index, 1)
  clearPreview()
}

function updateFieldName(index, name) {
  fields.value[index].table_name = name
  clearPreview()
}

function buildPayload() {
  return {
    table_name: fileName.value.trim(),
    fields: fields.value.map((field) => ({
      type: field.name,
      name: field.table_name.trim(),
    })),
    count: rowCount.value,
    include_create_table: format.value === 'sql'
      ? createTable.value
      : false,
    format: format.value,
  }
}

function extractRows(data) {
  if (Array.isArray(data)) return data

  if (Array.isArray(data?.data)) return data.data
  if (Array.isArray(data?.rows)) return data.rows
  if (Array.isArray(data?.results)) return data.results

  throw new Error(
    'Unexpected JSON response. Expected an array of generated rows.'
  )
}

async function showPreview() {
  errorMessage.value = ''

  if (validationError.value) {
    errorMessage.value = validationError.value
    return
  }

  previewLoading.value = true
  clearPreview()

  try {
    const data = await previewData(buildPayload())
    const rows = extractRows(data)

    previewRows.value = rows
    previewColumns.value = rows.length
      ? Object.keys(rows[0])
      : ['id', ...fields.value.map((f) => f.table_name)]

    hasPreview.value = true
  } catch (error) {
    errorMessage.value =
      error instanceof Error &&
      error.message.startsWith('Unexpected JSON')
        ? error.message
        : await getApiError(error)
  } finally {
    previewLoading.value = false
  }
}

async function generateData() {
  errorMessage.value = ''

  if (validationError.value) {
    errorMessage.value = validationError.value
    return
  }

  loading.value = true

  try {
    const blob = await downloadData(buildPayload())

    const extensions = {
      json: 'json',
      csv: 'csv',
      sql: 'sql',
      excel: 'xlsx',
    }

    const extension = extensions[format.value]
    const objectUrl = URL.createObjectURL(blob)

    const link = document.createElement('a')
    link.href = objectUrl
    link.download = `${fileName.value.trim()}.${extension}`

    document.body.appendChild(link)
    link.click()
    link.remove()

    setTimeout(() => URL.revokeObjectURL(objectUrl), 1000)
  } catch (error) {
    errorMessage.value = await getApiError(error)
  } finally {
    loading.value = false
  }
}

onMounted(loadFields)
</script>

<template>
  <section class="mx-auto mt-8 w-full max-w-5xl px-4 pb-12">

    <div class="mb-6">
      <h2 class="text-2xl font-bold text-gray-900 dark:text-white">
        Data Generator
      </h2>

      <p class="mt-2 text-sm text-gray-500 dark:text-gray-400">
        Build a schema and generate realistic Persian synthetic data.
      </p>
    </div>

    <!-- Field builder -->
    <div
      class="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800"
    >
      <div
        class="grid grid-cols-[36px_minmax(0,1fr)_minmax(0,1fr)_36px] gap-2 bg-gray-100 px-3 py-3 text-sm font-semibold text-gray-700 dark:bg-gray-700 dark:text-gray-200"
      >
        <span></span>
        <span>Column name</span>
        <span>Data type</span>
        <span></span>
      </div>

      <draggable
        v-model="fields"
        item-key="id"
        handle=".drag-handle"
        :animation="200"
        @end="clearPreview"
      >
        <template #item="{ element, index }">
          <FieldRow
            :field="element"
            :index="index"
            @remove="removeField"
            @updateName="updateFieldName"
          />
        </template>
      </draggable>

      <div
        class="border-t border-gray-200 p-3 dark:border-gray-700"
      >
        <button
          type="button"
          :disabled="fieldsLoading || !fieldTypes.length"
          class="w-full rounded-lg border border-dashed border-gray-400 px-4 py-2.5 text-gray-800 transition hover:bg-gray-100 disabled:opacity-50 dark:text-gray-100 dark:hover:bg-gray-700"
          @click="showAddModal = true"
        >
          + Add field
        </button>

        <p
          v-if="fieldsLoading"
          class="mt-2 text-sm text-gray-500 dark:text-gray-400"
        >
          Loading available field types...
        </p>

        <div
          v-if="fieldsError"
          class="mt-3 text-sm text-red-600 dark:text-red-400"
        >
          <p>{{ fieldsError }}</p>

          <button
            type="button"
            class="mt-2 underline"
            @click="loadFields"
          >
            Retry
          </button>
        </div>
      </div>
    </div>

    <!-- Output settings -->
    <div
      class="mt-6 rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800"
    >
      <h3 class="mb-5 font-semibold text-gray-900 dark:text-white">
        Output settings
      </h3>

      <div class="grid gap-5 md:grid-cols-3">
        <div>
          <label
            for="row-count"
            class="mb-2 block text-sm text-gray-700 dark:text-gray-200"
          >
            Number of rows
          </label>

          <input
            id="row-count"
            v-model.number="rowCount"
            type="number"
            min="1"
            max="1000"
            step="1"
            class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 dark:border-gray-600 dark:bg-gray-900 dark:text-white"
            @input="clearPreview"
          />
        </div>

        <div>
          <label
            for="output-format"
            class="mb-2 block text-sm text-gray-700 dark:text-gray-200"
          >
            Output format
          </label>

          <select
            id="output-format"
            v-model="format"
            class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 dark:border-gray-600 dark:bg-gray-900 dark:text-white"
          >
            <option value="json">JSON</option>
            <option value="csv">CSV</option>
            <option value="sql">SQL</option>
            <option value="excel">Excel</option>
          </select>
        </div>

        <div>
          <label
            for="table-name"
            class="mb-2 block text-sm text-gray-700 dark:text-gray-200"
          >
            {{ format === 'sql' ? 'Table name' : 'File name' }}
          </label>

          <input
            id="table-name"
            v-model="fileName"
            type="text"
            maxlength="63"
            class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 dark:border-gray-600 dark:bg-gray-900 dark:text-white"
          />
        </div>
      </div>

      <label
        v-if="format === 'sql'"
        class="mt-5 flex items-center gap-2 text-sm text-gray-700 dark:text-gray-200"
      >
        <input
          v-model="createTable"
          type="checkbox"
          class="h-4 w-4 accent-green-600"
        />

        Include CREATE TABLE statement
      </label>

      <p
        v-if="validationError"
        class="mt-4 text-sm text-amber-700 dark:text-amber-400"
      >
        {{ validationError }}
      </p>

      <p
        v-if="errorMessage"
        role="alert"
        class="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700 dark:bg-red-950/40 dark:text-red-300"
      >
        {{ errorMessage }}
      </p>

      <div class="mt-6 flex flex-wrap gap-3">
        <button
          type="button"
          :disabled="isBusy || !!validationError"
          class="rounded-lg border border-gray-300 px-5 py-2.5 font-medium text-gray-800 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-600 dark:text-white dark:hover:bg-gray-700"
          @click="showPreview"
        >
          {{ previewLoading ? 'Loading preview...' : 'Preview data' }}
        </button>

        <button
          type="button"
          :disabled="isBusy || !!validationError"
          class="rounded-lg bg-green-600 px-5 py-2.5 font-medium text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
          @click="generateData"
        >
          {{ loading ? 'Generating...' : 'Generate & Download' }}
        </button>
      </div>
    </div>

    <!-- Data preview -->
    <div
      v-if="hasPreview"
      class="mt-6 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800"
    >
      <div class="border-b border-gray-200 p-4 dark:border-gray-700">
        <h3 class="font-semibold text-gray-900 dark:text-white">
          Data preview
        </h3>

        <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">
          Up to 5 sample rows. Download generates fresh random data.
        </p>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full min-w-max text-left text-sm">
          <thead class="bg-gray-100 dark:bg-gray-700">
            <tr>
              <th
                v-for="column in previewColumns"
                :key="column"
                class="border-b border-gray-200 px-4 py-3 font-semibold text-gray-700 dark:border-gray-600 dark:text-gray-200"
              >
                {{ column }}
              </th>
            </tr>
          </thead>

          <tbody>
            <tr
              v-for="(row, index) in previewRows"
              :key="index"
              class="border-b border-gray-100 dark:border-gray-700"
            >
              <td
                v-for="column in previewColumns"
                :key="column"
                class="max-w-xs truncate px-4 py-3 text-gray-800 dark:text-gray-200"
                :title="String(row[column] ?? '')"
              >
                {{ row[column] ?? '' }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <AddFieldModal
      v-if="showAddModal"
      :field-types="fieldTypes"
      @close="showAddModal = false"
      @addField="addField"
    />
  </section>
</template>