<template>
  <div :class="groupClass" role="radiogroup">
    <label
      v-for="opt in options"
      :key="opt.value"
      :class="itemClass"
    >
      <input
        type="radio"
        :name="name"
        :value="opt.value"
        :checked="modelValue === opt.value"
        :disabled="disabled"
        @change="onSelect(opt.value)"
      />
      <span class="ctp-radio-circle">
        <span class="ctp-radio-dot"></span>
      </span>
      <span>{{ opt.label }}</span>
    </label>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

type FormControlColor =
  | 'rosewater' | 'flamingo' | 'pink' | 'mauve' | 'red' | 'maroon'
  | 'peach' | 'yellow' | 'green' | 'teal' | 'sky' | 'sapphire'
  | 'blue' | 'lavender';

interface RadioOption {
  label: string;
  value: any;
}

interface Props {
  name: string;
  options: RadioOption[];
  modelValue?: any;
  color?: FormControlColor;
  disabled?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  color: 'mauve',
  disabled: false,
});

const emit = defineEmits<{
  (e: 'update:modelValue', value: any): void;
}>();

const getFormThemeClass = (color: FormControlColor) => `ctp-form--${color}`;

const groupClass = computed(() => ['ctp-radio-group']);

const itemClass = computed(() => {
  return [
    'ctp-radio-item',
    props.disabled ? 'ctp-radio-item--disabled' : '',
    getFormThemeClass(props.color),
  ];
});

function onSelect(val: any) {
  emit('update:modelValue', val);
}
</script>
