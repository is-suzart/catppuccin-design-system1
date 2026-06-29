<template>
  <div v-if="count > 1" class="ctp-skeleton-group" :style="{ gap }">
    <div
      v-for="i in count"
      :key="i"
      :class="classes"
      :style="customStyle"
      aria-hidden="true"
    />
  </div>
  <div v-else :class="classes" :style="customStyle" aria-hidden="true">
    <slot />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

type SkeletonVariant = 'text' | 'circle' | 'rect';
type SkeletonSize = 'sm' | 'md' | 'lg' | 'xl';

interface Props {
  variant?: SkeletonVariant;
  size?: SkeletonSize;
  width?: string;
  height?: string;
  animated?: boolean;
  count?: number;
  gap?: string;
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'text',
  size: 'md',
  animated: true,
  count: 1,
  gap: '8px',
});

const classes = computed(() => {
  const c = [
    'ctp-skeleton',
    `ctp-skeleton--${props.variant}`,
    `ctp-skeleton--${props.size}`,
    !props.animated ? 'ctp-skeleton--no-animation' : '',
    props.width ? '' : 'ctp-skeleton--full',
  ];
  return c.filter(Boolean).join(' ');
});

const customStyle = computed(() => {
  const style: Record<string, string> = {};
  if (props.width) style.width = props.width;
  if (props.height) style.height = props.height;
  return style;
});
</script>

<style scoped>
.ctp-skeleton-group {
  display: flex;
  flex-direction: column;
}
</style>
