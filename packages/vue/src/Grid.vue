<template>
  <div :class="gridClass">
    <slot />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

type GridGap = 0 | 1 | 2 | 3 | 4 | 5;
type GridAlign = 'start' | 'center' | 'end' | 'space-between' | 'space-around';
type GridValign = 'start' | 'center' | 'end';

interface Props {
  mobile?: boolean;
  multiline?: boolean;
  gap?: GridGap;
  align?: GridAlign;
  valign?: GridValign;
}

const props = withDefaults(defineProps<Props>(), {
  mobile: false,
  multiline: true,
  gap: 3,
});

const gridClass = computed(() => {
  return [
    'ctp-grid',
    props.mobile ? 'ctp-grid-mobile' : '',
    props.multiline ? 'ctp-grid-multiline' : '',
    `ctp-grid-gap-${props.gap}`,
    props.align ? `ctp-grid-align-${props.align}` : '',
    props.valign ? `ctp-grid-valign-${props.valign}` : '',
  ];
});
</script>
