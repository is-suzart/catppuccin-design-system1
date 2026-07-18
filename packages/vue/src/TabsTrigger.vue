<template>
  <button
    type="button"
    role="tab"
    :aria-selected="isSelected"
    :aria-controls="`ds-tabpanel-${value}`"
    :id="`ds-tabtrigger-${value}`"
    :data-value="value"
    :tabindex="isSelected ? 0 : -1"
    :disabled="disabled"
    :class="triggerClass"
    @click="handleClick"
  >
    <slot />
  </button>
</template>

<script setup lang="ts">
import { computed, inject } from 'vue';
import { useRoute } from 'vue-router';

const props = withDefaults(defineProps<{
  value: string;
  disabled?: boolean;
  to?: string;
}>(), {
  disabled: false,
  to: '',
});

const tabs = inject<any>('tabs');
const route = useRoute();

const isSelected = computed(() => {
  if (tabs.mode.value === 'router' && props.to) {
    return route.path === props.to || route.path.startsWith(props.to);
  }
  return tabs.activeValue.value === props.value;
});

const triggerClass = computed(() => {
  return [
    'ctp-tabs-trigger',
    `ctp-tabs-trigger--${tabs.variant.value}`,
    `ctp-tabs-trigger--${tabs.size.value}`,
    isSelected.value ? 'ctp-tabs-trigger--active' : '',
  ];
});

function handleClick() {
  if (props.disabled) return;

  if (tabs.mode.value === 'router' && props.to) {
    tabs.navigateTo(props.to);
  } else {
    tabs.selectTab(props.value);
  }
}
</script>
