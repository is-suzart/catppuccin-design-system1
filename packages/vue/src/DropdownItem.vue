<template>
  <button
    type="button"
    :class="itemClass"
    :disabled="disabled"
    role="menuitem"
    @click="handleClick"
  >
    <slot />
  </button>
</template>

<script setup lang="ts">
import { computed, inject } from 'vue';

interface Props {
  disabled?: boolean;
  danger?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  disabled: false,
  danger: false,
});

const color = inject<string>('dropdownColor', 'mauve');
const dropdownClose = inject<() => void>('dropdownClose', () => {});

const itemClass = computed(() => {
  return [
    'ctp-dropdown-item',
    props.danger ? 'ctp-dropdown-item--danger' : `ctp-dropdown-item--${color}`,
    props.disabled ? 'ctp-dropdown-item--disabled' : '',
  ];
});

function handleClick() {
  if (props.disabled) return;
  dropdownClose();
}
</script>
