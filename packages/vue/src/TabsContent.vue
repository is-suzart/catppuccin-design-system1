<template>
  <div
    role="tabpanel"
    :id="`ctp-tabpanel-${value}`"
    :aria-labelledby="`ctp-tabtrigger-${value}`"
    tabindex="0"
    :class="contentClass"
    :style="{ display: isActive ? '' : 'none' }"
  >
    <template v-if="isActive">
      <slot />
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed, inject } from 'vue';
import { useRoute } from 'vue-router';

const props = defineProps<{
  value: string;
}>();

const tabs = inject<any>('tabs');
const route = useRoute();

const isActive = computed(() => {
  if (tabs.mode.value === 'router') {
    return route.path === props.value || route.path.startsWith(props.value);
  }
  return tabs.activeValue.value === props.value;
});

const contentClass = computed(() => {
  return [
    'ctp-tabs-content',
    isActive.value ? 'ctp-tabs-content--active' : '',
  ];
});
</script>
