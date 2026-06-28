<template>
  <select
    :class="selectClass"
    :disabled="disabled"
    :value="modelValue"
    @change="onChange"
    v-bind="$attrs"
  >
    <slot />
    <option
      v-for="(opt, idx) in options"
      :key="idx"
      :value="opt.value"
    >
      {{ opt.label }}
    </option>
  </select>
</template>

<script setup lang="ts">
import { computed } from 'vue';

type FormControlSize = 'sm' | 'md' | 'lg';
type FormControlShape = 'square' | 'rounded' | 'pill';
type FormControlColor =
  | 'rosewater' | 'flamingo' | 'pink' | 'mauve' | 'red' | 'maroon'
  | 'peach' | 'yellow' | 'green' | 'teal' | 'sky' | 'sapphire'
  | 'blue' | 'lavender';

interface SelectOption {
  label: string;
  value: any;
}

interface Props {
  modelValue?: any;
  size?: FormControlSize;
  shape?: FormControlShape;
  color?: FormControlColor;
  error?: boolean;
  disabled?: boolean;
  options?: SelectOption[];
}

const props = withDefaults(defineProps<Props>(), {
  size: 'md',
  shape: 'rounded',
  color: 'mauve',
  error: false,
  disabled: false,
  options: () => [],
});

const emit = defineEmits<{
  (e: 'update:modelValue', value: any): void;
}>();

const getFormThemeClass = (color: FormControlColor) => `ctp-form--${color}`;

const selectClass = computed(() => {
  return [
    'ctp-form-control',
    `ctp-form-control--${props.size}`,
    `ctp-form-control--${props.shape}`,
    props.error ? 'ctp-form-control--error' : '',
    getFormThemeClass(props.color),
  ];
});

function onChange(event: Event) {
  const target = event.target as HTMLSelectElement;
  emit('update:modelValue', target.value);
}
</script>
