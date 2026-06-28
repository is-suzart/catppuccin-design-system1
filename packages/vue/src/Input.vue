<template>
  <input
    :class="inputClass"
    :disabled="disabled"
    :placeholder="placeholder"
    :value="modelValue"
    :type="type"
    @input="onInput"
    v-bind="$attrs"
  />
</template>

<script setup lang="ts">
import { computed } from 'vue';

type FormControlSize = 'sm' | 'md' | 'lg';
type FormControlShape = 'square' | 'rounded' | 'pill';
type FormControlColor =
  | 'rosewater' | 'flamingo' | 'pink' | 'mauve' | 'red' | 'maroon'
  | 'peach' | 'yellow' | 'green' | 'teal' | 'sky' | 'sapphire'
  | 'blue' | 'lavender';

interface Props {
  modelValue?: string | number;
  size?: FormControlSize;
  shape?: FormControlShape;
  color?: FormControlColor;
  error?: boolean;
  disabled?: boolean;
  placeholder?: string;
  type?: string;
}

const props = withDefaults(defineProps<Props>(), {
  size: 'md',
  shape: 'rounded',
  color: 'mauve',
  error: false,
  disabled: false,
  type: 'text',
});

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void;
}>();

const getFormThemeClass = (color: FormControlColor) => `ctp-form--${color}`;

const inputClass = computed(() => {
  return [
    'ctp-form-control',
    `ctp-form-control--${props.size}`,
    `ctp-form-control--${props.shape}`,
    props.error ? 'ctp-form-control--error' : '',
    getFormThemeClass(props.color),
  ];
});

function onInput(event: Event) {
  const target = event.target as HTMLInputElement;
  emit('update:modelValue', target.value);
}
</script>
