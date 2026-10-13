<script setup>
import { computed, onMounted, onUnmounted, ref } from 'vue'

const props = defineProps({
  fieldTypes: {
    type: Array,
    required: true,
  },
})

const emit = defineEmits(['close', 'addField'])
const search = ref('')
const searchInput = ref(null)

const labels = {
  firstname: 'First Name',
  lastname: 'Last Name',
  email: 'Email Address',
  username: 'Username',
  password: 'Password',
  gender: 'Gender',
  province: 'Province',
  city: 'City',
  car_company: 'Car Company',
  car_name: 'Car Model',
  car_color: 'Car Color',
  car_year: 'Car Year',
  mobile_number: 'Mobile Number',
  postal_code: 'Postal Code',
}

const categories = [
  {
    key: 'personal',
    label: 'Personal',
    icon: '◉',
    fields: [
      'firstname', 'lastname', 'email',
      'username', 'password', 'gender',
    ],
  },
  {
    key: 'location',
    label: 'Location',
    icon: '⌖',
    fields: ['province', 'city'],
  },
  {
    key: 'vehicle',
    label: 'Vehicle',
    icon: '▣',
    fields: [
      'car_company', 'car_name',
      'car_color', 'car_year',
    ],
  },
  {
    key: 'identifiers',
    label: 'Identifiers',
    icon: '#',
    fields: ['mobile_number', 'postal_code'],
  },
]

const availableNames = computed(() => new Set(
  props.fieldTypes.map((field) =>
    typeof field === 'string' ? field : field.name
  )
))

const groupedFields = computed(() => {
  const query = search.value.trim().toLowerCase()

  return categories
    .map((category) => ({
      ...category,
      items: category.fields
        .filter((name) => availableNames.value.has(name))
        .filter((name) =>
          name.includes(query) ||
          labels[name].toLowerCase().includes(query) ||
          category.label.toLowerCase().includes(query)
        )
        .map((name) => ({
          name,
          label: labels[name],
        })),
    }))
    .filter((category) => category.items.length > 0)
})

const resultCount = computed(() =>
  groupedFields.value.reduce(
    (total, category) => total + category.items.length,
    0
  )
)

function selectField(field) {
  emit('addField', {
    id: crypto.randomUUID(),
    name: field.name,
    type: field.label,
    table_name: field.name,
  })

  emit('close')
}

function handleKeydown(event) {
  if (event.key === 'Escape') {
    emit('close')
  }
}

let previousOverflow = ''

onMounted(() => {
  previousOverflow = document.body.style.overflow
  document.body.style.overflow = 'hidden'
  window.addEventListener('keydown', handleKeydown)
  searchInput.value?.focus()
})

onUnmounted(() => {
  document.body.style.overflow = previousOverflow
  window.removeEventListener('keydown', handleKeydown)
})
</script>

<template>
  <div
    class="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/65 p-3 backdrop-blur-sm sm:p-6"
    @click.self="emit('close')"
  >
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="field-picker-title"
      class="flex max-h-[90vh] w-full max-w-lg flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-slate-700 dark:bg-slate-800"
    >
      <div
        class="flex shrink-0 items-start justify-between gap-4 border-b border-slate-100 px-5 py-5 dark:border-slate-700"
      >
        <div>
          <h2
            id="field-picker-title"
            class="text-xl font-bold text-slate-900 dark:text-white"
          >
            Add a field
          </h2>
          <p class="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Select a data type for your schema.
          </p>
        </div>

        <button
          type="button"
          aria-label="Close field picker"
          class="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-700 dark:hover:text-white"
          @click="emit('close')"
        >
          ✕
        </button>
      </div>

      <div class="shrink-0 px-5 pt-4 pb-3">
        <div class="relative">
          <span
            aria-hidden="true"
            class="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          >
            ⌕
          </span>

          <input
            ref="searchInput"
            v-model="search"
            type="search"
            aria-label="Search data types"
            placeholder="Search data types..."
            class="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm text-slate-900 outline-none focus:border-teal-600 dark:border-slate-600 dark:bg-slate-900 dark:text-white dark:placeholder-slate-400"
          />
        </div>

        <p class="mt-3 text-xs text-slate-500 dark:text-slate-400">
          {{ resultCount }} available data types
        </p>
      </div>

      <div class="min-h-0 flex-1 overflow-y-auto px-5 pb-5">
        <div
          v-for="category in groupedFields"
          :key="category.key"
          class="mb-5 last:mb-0"
        >
          <div class="mb-2 flex items-center gap-2">
            <span
              aria-hidden="true"
              class="flex h-7 w-7 items-center justify-center rounded-lg bg-teal-50 text-sm font-bold text-teal-700 dark:bg-teal-950 dark:text-teal-300"
            >
              {{ category.icon }}
            </span>

            <h3
              class="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-300"
            >
              {{ category.label }}
            </h3>

            <span
              class="ml-auto text-xs text-slate-400 dark:text-slate-500"
            >
              {{ category.items.length }}
            </span>
          </div>

          <div class="space-y-1">
            <button
              v-for="field in category.items"
              :key="field.name"
              type="button"
              class="group flex w-full items-center justify-between gap-3 rounded-xl border border-transparent px-3 py-3 text-left transition hover:border-teal-100 hover:bg-teal-50 dark:hover:border-teal-900 dark:hover:bg-slate-700"
              @click="selectField(field)"
            >
              <div class="min-w-0">
                <p
                  class="font-medium text-slate-800 dark:text-slate-100"
                >
                  {{ field.label }}
                </p>
                <p
                  class="mt-0.5 break-all text-xs text-slate-400 dark:text-slate-400"
                >
                  {{ field.name }}
                </p>
              </div>

              <span
                aria-hidden="true"
                class="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-lg text-slate-500 transition group-hover:bg-teal-100 group-hover:text-teal-700 dark:bg-slate-700 dark:text-slate-300"
              >
                +
              </span>
            </button>
          </div>
        </div>

        <div
          v-if="resultCount === 0"
          class="py-12 text-center"
        >
          <p class="font-medium text-slate-700 dark:text-slate-200">
            No matching data types
          </p>
          <p class="mt-2 text-sm text-slate-500 dark:text-slate-400">
            Try another search term.
          </p>
        </div>
      </div>

      <div
        class="shrink-0 border-t border-slate-100 px-5 py-3 dark:border-slate-700"
      >
        <p class="text-center text-xs text-slate-400 dark:text-slate-400">
          PersianMock · Synthetic Data Generator
        </p>
      </div>
    </div>
  </div>
</template>