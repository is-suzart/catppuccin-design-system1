<template>
  <textarea
    :class="textareaClass"
    :disabled="disabled"
    :placeholder="placeholder"
    :value="modelValue"
    @input="onInput"
    v-bind="$attrs"
  ></textarea>
</template>

<script setup lang="ts">
import { computed } from 'vue';

type FormControlSize = 'sm' | 'md' | 'lg';
type FormControlColor =
  | 'rosewater' | 'flamingo' | 'pink' | 'mauve' | 'red' | 'maroon'
  | 'peach' | 'yellow' | 'green' | 'teal' | 'sky' | 'sapphire'
  | 'blue' | 'lavender';

interface Props {
  modelValue?: string;
  size?: FormControlSize;
  shape?: 'square' | 'rounded';
  color?: FormControlColor;
  error?: boolean;
  disabled?: boolean;
  placeholder?: string;
}

const props = withDefaults(defineProps<Props>(), {
  size: 'md',
  shape: 'rounded',
  color: 'mauve',
  error: false,
  disabled: false,
});

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void;
}>();

const getFormThemeClass = (color: FormControlColor) => `ctp-form--${color}`;

const textareaClass = computed(() => {
  return [
    'ctp-form-control',
    `ctp-form-control--${props.size}`,
    `ctp-form-control--${props.shape}`,
    props.error ? 'ctp-form-control--error' : '',
    getFormThemeClass(props.color),
  ];
});

function onInput(event: Event) {
  const target = event.target as HTMLTextAreaElement;
  emit('update:modelValue', target.value);
}
</script>
