<template>
  <div :class="containerClass">
    <table class="ctp-table">
      <thead>
        <tr class="ctp-table__header-row">
          <th
            v-for="col in columns"
            :key="col.key"
            class="ctp-table__header-cell"
            :class="{ 'ctp-table__header-cell--sortable': col.sortable }"
            :style="{ textAlign: col.align || 'left' }"
            @click="col.sortable && toggleSort(col.key)"
          >
            {{ col.header }}
            <span v-if="col.sortable" class="ctp-table__sort-icon">
              <template v-if="sortField === col.key">
                {{ sortOrder === 'asc' ? '\u25B2' : '\u25BC' }}
              </template>
              <template v-else>
                \u25B4\u25BE
              </template>
            </span>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(row, idx) in sortedData" :key="rowKey(row)" class="ctp-table__row">
          <td
            v-for="col in columns"
            :key="col.key"
            class="ctp-table__cell"
            :style="{ textAlign: col.align || 'left' }"
          >
            {{ row[col.key] }}
          </td>
        </tr>
      </tbody>
    </table>
    <div v-if="data.length === 0" class="ctp-table__empty">{{ emptyState }}</div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

type TableSize = 'sm' | 'md' | 'lg';
type TableColor =
  | 'rosewater' | 'flamingo' | 'pink' | 'mauve' | 'red' | 'maroon'
  | 'peach' | 'yellow' | 'green' | 'teal' | 'sky' | 'sapphire'
  | 'blue' | 'lavender';

interface Column {
  key: string;
  header: string;
  sortable?: boolean;
  align?: 'left' | 'center' | 'right';
}

interface Props {
  data: any[];
  columns: Column[];
  rowKey: (row: any) => string | number;
  size?: TableSize;
  color?: TableColor;
  emptyState?: string;
}

const props = withDefaults(defineProps<Props>(), {
  data: () => [],
  columns: () => [],
  rowKey: (row: any) => row.id,
  size: 'md',
  color: 'mauve',
  emptyState: 'No records found.',
});

const emit = defineEmits<{
  (e: 'update:sortField', value: string): void;
  (e: 'update:sortOrder', value: 'asc' | 'desc' | ''): void;
}>();

const sortField = defineModel<string>('sortField', { default: '' });
const sortOrder = defineModel<'asc' | 'desc' | ''>('sortOrder', { default: '' });

const containerClass = computed(() => {
  return [
    'ctp-table-container',
    `ctp-table--${props.size}`,
    `ctp-table--${props.color}`,
  ];
});

const sortedData = computed(() => {
  const rows = [...props.data];
  if (sortField.value && sortOrder.value) {
    rows.sort((a, b) => {
      const aVal = a[sortField.value];
      const bVal = b[sortField.value];
      if (aVal < bVal) return sortOrder.value === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortOrder.value === 'asc' ? 1 : -1;
      return 0;
    });
  }
  return rows;
});

function toggleSort(field: string) {
  if (sortField.value === field) {
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : sortOrder.value === 'desc' ? '' : 'asc';
  } else {
    sortField.value = field;
    sortOrder.value = 'asc';
  }
}
</script>
