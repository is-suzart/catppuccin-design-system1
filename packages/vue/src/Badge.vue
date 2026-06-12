<template>
  <span :class="badgeClass" v-bind="$attrs">
    <span v-if="$slots.icon || icon" class="ctp-badge__icon" style="display: inline-flex; align-items: center">
      <slot name="icon">{{ icon }}</slot>
    </span>
    <span class="ctp-badge__content">
      <slot />
    </span>
    <button
      v-if="isDismissible"
      class="ctp-badge__close-btn"
      @click="emit('dismiss', $event)"
      aria-label="Dismiss badge"
      style="display: inline-flex; align-items: center; margin-left: 4px;"
    >
      <svg
        width="12"
        height="12"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <line x1="18" y1="6" x2="6" y2="18" />
        <line x1="6" y1="6" x2="18" y2="18" />
      </svg>
    </button>
  </span>
</template>

<script setup lang="ts">
import { computed } from 'vue';

type BadgeVariant = 'filled' | 'tonal' | 'outline' | 'flat';
type BadgeSize = 'sm' | 'md' | 'lg';
type BadgeShape = 'square' | 'rounded' | 'pill';
type BadgeColor =
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
  variant?: BadgeVariant;
  size?: BadgeSize;
  shape?: BadgeShape;
  color?: BadgeColor;
  icon?: any;
  isDismissible?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'filled',
  size: 'md',
  shape: 'pill',
  color: 'mauve',
  isDismissible: false,
});

const emit = defineEmits<{
  (e: 'dismiss', event: MouseEvent): void;
}>();

const badgeClass = computed(() => {
  return [
    'ctp-badge',
    `ctp-badge--${props.variant}`,
    `ctp-badge--${props.size}`,
    `ctp-badge--${props.shape}`,
    `ctp-badge--${props.color}`,
  ];
});
</script>
