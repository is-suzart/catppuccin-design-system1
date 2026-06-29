<template>
  <nav class="ctp-breadcrumb" aria-label="Breadcrumb">
    <template v-for="(item, index) in items" :key="index">
      <span v-if="index > 0" class="ctp-breadcrumb__separator" aria-hidden="true">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="9 18 15 12 9 6" />
        </svg>
      </span>
      <a v-if="item.href && index < items.length - 1" :href="item.href" class="ctp-breadcrumb__item">
        {{ item.label }}
      </a>
      <span
        v-else
        :class="['ctp-breadcrumb__item', { 'ctp-breadcrumb__item--active': index === items.length - 1 }]"
        :aria-current="index === items.length - 1 ? 'page' : undefined"
      >
        {{ item.label }}
      </span>
    </template>
  </nav>
</template>

<script setup lang="ts">
interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface Props {
  items: BreadcrumbItem[];
}

defineProps<Props>();
</script>
