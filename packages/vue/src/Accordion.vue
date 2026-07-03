<template>
  <div :class="accordionClass" v-bind="$attrs">
    <slot />
  </div>
</template>

<script setup lang="ts">
import { computed, provide, ref, watch } from 'vue';

type AccordionVariant = 'default' | 'split';
type AccordionColorMode = 'none' | 'colored' | 'tonal';
type AccordionAccentColor =
  | 'rosewater'
  | 'flamingo'
  | 'pink'
  | 'mauve'
  | 'red'
  | 'maroon'
  | 'peach'
  | 'yellow'
  | 'green'
  | 'teal'
  | 'sky'
  | 'sapphire'
  | 'blue'
  | 'lavender';

interface Props {
  variant?: AccordionVariant;
  colorMode?: AccordionColorMode;
  accentColor?: AccordionAccentColor;
  allowMultiple?: boolean;
  modelValue?: string | string[];
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'default',
  colorMode: 'none',
  allowMultiple: false,
});

const emit = defineEmits<{
  (e: 'update:modelValue', value: any): void;
}>();

const openValues = ref<string[]>([]);

watch(
  () => props.modelValue,
  (newVal) => {
    if (newVal !== undefined) {
      openValues.value = Array.isArray(newVal) ? newVal : [newVal];
    }
  },
  { immediate: true, deep: true }
);

const toggleValue = (value: string) => {
  let nextValues: string[];
  if (props.allowMultiple) {
    nextValues = openValues.value.includes(value)
      ? openValues.value.filter((v) => v !== value)
      : [...openValues.value, value];
  } else {
    nextValues = openValues.value.includes(value) ? [] : [value];
  }
  openValues.value = nextValues;
  emit('update:modelValue', props.allowMultiple ? nextValues : (nextValues[0] || ''));
};

provide('accordion', {
  openValues,
  toggleValue,
  colorMode: computed(() => props.colorMode),
  accentColor: computed(() => props.accentColor),
});

const accordionClass = computed(() => {
  const modifiers = [
    `ctp-accordion--${props.variant}`,
    props.colorMode !== 'none' ? `ctp-accordion--${props.colorMode}` : '',
    props.accentColor ? `ctp-accordion--${props.accentColor}` : '',
  ];
  return ['ctp-accordion', ...modifiers.filter(Boolean)];
});
</script>
