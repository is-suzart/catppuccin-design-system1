<template>
  <label :class="rowClass">
    <input
      type="checkbox"
      :disabled="disabled"
      :checked="modelValue"
      @change="onToggle"
    />
    <span class="ctp-switch-track">
      <span class="ctp-switch-thumb"></span>
    </span>
    <span>{{ label }}</span>
  </label>
</template>

<script setup lang="ts">
import { computed } from 'vue';

type FormControlColor =
  | 'rosewater' | 'flamingo' | 'pink' | 'mauve' | 'red' | 'maroon'
  | 'peach' | 'yellow' | 'green' | 'teal' | 'sky' | 'sapphire'
  | 'blue' | 'lavender';

interface Props {
  label: string;
  modelValue?: boolean;
  disabled?: boolean;
  color?: FormControlColor;
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: false,
  disabled: false,
  color: 'mauve',
});

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void;
}>();

const getFormThemeClass = (color: FormControlColor) => `ctp-form--${color}`;

const rowClass = computed(() => {
  return [
    'ctp-switch-row',
    props.disabled ? 'ctp-switch-row--disabled' : '',
    getFormThemeClass(props.color),
  ];
});

function onToggle() {
  emit('update:modelValue', !props.modelValue);
}
</script>
