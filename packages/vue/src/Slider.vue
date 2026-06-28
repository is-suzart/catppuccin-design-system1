<template>
  <div :class="containerClass">
    <input
      type="range"
      :min="min"
      :max="max"
      :value="modelValue"
      :disabled="disabled"
      class="ctp-slider"
      @input="onInput"
    />
    <span v-if="showValue" class="ctp-slider-value">{{ modelValue }}</span>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

type FormControlColor =
  | 'rosewater' | 'flamingo' | 'pink' | 'mauve' | 'red' | 'maroon'
  | 'peach' | 'yellow' | 'green' | 'teal' | 'sky' | 'sapphire'
  | 'blue' | 'lavender';

interface Props {
  modelValue?: number;
  min?: number;
  max?: number;
  color?: FormControlColor;
  showValue?: boolean;
  disabled?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: 50,
  min: 0,
  max: 100,
  color: 'mauve',
  showValue: true,
  disabled: false,
});

const emit = defineEmits<{
  (e: 'update:modelValue', value: number): void;
}>();

const getFormThemeClass = (color: FormControlColor) => `ctp-form--${color}`;

const containerClass = computed(() => {
  return [
    'ctp-slider-container',
    getFormThemeClass(props.color),
  ];
});

function onInput(event: Event) {
  const target = event.target as HTMLInputElement;
  emit('update:modelValue', Number(target.value));
}
</script>
