<template>
  <div :class="tileClass" v-bind="$attrs">
    <slot>
      <div v-if="$slots.icon || icon" class="ctp-tile-icon">
        <slot name="icon">{{ icon }}</slot>
      </div>

      <div v-if="$slots.content || title || subtitle" class="ctp-tile-content">
        <slot name="content">
          <span v-if="title" class="ctp-tile-title">{{ title }}</span>
          <span v-if="subtitle" class="ctp-tile-subtitle">{{ subtitle }}</span>
        </slot>
      </div>

      <div v-if="$slots.meta || meta" class="ctp-tile-meta">
        <slot name="meta">{{ meta }}</slot>
      </div>
    </slot>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

type TileVariant = 'flat' | 'elevated' | 'outline' | 'tonal' | 'colored';
type TileSize = 'sm' | 'md' | 'lg';
type TileShape = 'square' | 'rounded' | 'pill';
type TileOrientation = 'horizontal' | 'vertical' | 'vertical-center';
type TileIndicator = 'none' | 'top' | 'bottom' | 'left' | 'right';
type TileColor =
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
  variant?: TileVariant;
  size?: TileSize;
  shape?: TileShape;
  orientation?: TileOrientation;
  color?: TileColor;
  indicator?: TileIndicator;
  isInteractive?: boolean;
  isSelected?: boolean;
  isDisabled?: boolean;
  icon?: any;
  title?: string;
  subtitle?: string;
  meta?: string;
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'flat',
  size: 'md',
  shape: 'rounded',
  orientation: 'horizontal',
  color: 'mauve',
  indicator: 'none',
  isInteractive: false,
  isSelected: false,
  isDisabled: false,
});

const tileClass = computed(() => {
  return [
    'ctp-tile',
    `ctp-tile--${props.variant}`,
    `ctp-tile--${props.size}`,
    `ctp-tile--${props.shape}`,
    `ctp-tile--${props.orientation}`,
    props.color ? `ctp-tile--${props.color}` : '',
    props.indicator !== 'none' ? `ctp-tile--indicator-${props.indicator}` : '',
    props.isInteractive ? 'ctp-tile--interactive' : '',
    props.isSelected ? 'ctp-tile--selected' : '',
    props.isDisabled ? 'ctp-tile--disabled' : '',
  ];
});
</script>
