<script setup>
import { computed, ref, watch } from 'vue'

const props = defineProps({
  rows: {
    type: Array,
    required: true,
  },
  columns: {
    type: Array,
    required: true,
  },
})

const copied = ref(false)

const rowCountLabel = computed(() =>
  `${props.rows.length} sample ${props.rows.length === 1 ? 'row' : 'rows'}`
)

function displayValue(value) {
  if (value === null || value === undefined) return '—'
  if (typeof value === 'object') return JSON.stringify(value)
  return String(value)
}

const jsonContent = computed(() =>
  JSON.stringify(props.rows, null, 2)
)

async function copyPreview() {
  try {
    await navigator.clipboard.writeText(jsonContent.value)
    copied.value = true
  } catch {
    copied.value = false
  }
}

watch(() => [props.rows, props.columns], () => {
  copied.value = false
})
</script>

<template>
  <section
    aria-labelledby="preview-heading"
    class="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800"
  >
    <div
      class="flex flex-col gap-3 border-b border-slate-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between dark:border-slate-700"
    >
      <div>
        <div class="flex items-center gap-2">
          <span
            class="h-2 w-2 rounded-full bg-teal-500"
            aria-hidden="true"
          ></span>

          <h3
            id="preview-heading"
            class="font-bold text-slate-900 dark:text-white"
          >
            Data preview
          </h3>
        </div>

        <p class="mt-1 text-xs text-slate-500 dark:text-slate-400">
          {{ rowCountLabel }} · New random data is generated on download.
        </p>
      </div>

      <button
        type="button"
        :disabled="rows.length === 0"
        class="inline-flex items-center justify-center gap-2 self-start rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-700 sm:self-auto"
        @click="copyPreview"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="15"
          height="15"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="1.8"
          stroke-linecap="round"
          stroke-linejoin="round"
          aria-hidden="true"
        >
          <rect x="8" y="8" width="12" height="12" rx="2"/>
          <path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2"/>
        </svg>

        {{ copied ? 'Copied!' : 'Copy JSON' }}
      </button>
    </div>

    <div
      v-if="rows.length > 0"
      class="w-full overflow-x-auto"
      tabindex="0"
      aria-label="Scrollable data preview table"
    >
      <table class="w-full min-w-max border-collapse text-left text-sm">
        <thead>
          <tr class="bg-slate-50 dark:bg-slate-900/60">
            <th
              v-for="column in columns"
              :key="column"
              scope="col"
              class="whitespace-nowrap border-b border-slate-200 px-5 py-3 text-xs font-bold uppercase tracking-wide text-slate-500 dark:border-slate-700 dark:text-slate-300"
            >
              {{ column }}
            </th>
          </tr>
        </thead>

        <tbody>
          <tr
            v-for="(row, rowIndex) in rows"
            :key="rowIndex"
            class="border-b border-slate-100 transition hover:bg-slate-50 last:border-b-0 dark:border-slate-700 dark:hover:bg-slate-700/40"
          >
            <td
              v-for="column in columns"
              :key="column"
              class="max-w-64 min-w-24 px-5 py-3.5 text-slate-700 dark:text-slate-200"
            >
              <div
                dir="auto"
                class="max-w-64 truncate"
                :title="displayValue(row[column])"
              >
                {{ displayValue(row[column]) }}
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div
      v-else
      class="px-5 py-12 text-center text-sm text-slate-500 dark:text-slate-400"
    >
      No sample rows to display.
    </div>

    <div
      class="border-t border-slate-100 bg-slate-50/70 px-5 py-3 dark:border-slate-700 dark:bg-slate-900/30"
    >
      <p class="text-xs text-slate-500 dark:text-slate-400">
        Preview displays up to 5 rows. Export uses your selected row count.
      </p>
    </div>
  </section>
</template>