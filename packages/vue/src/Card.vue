<template>
  <div :class="cardClass" v-bind="$attrs">
    <!-- Header Slot / Element -->
    <div v-if="$slots.header || title || subtitle || $slots.avatar || $slots.actions" class="ctp-card__header">
      <div v-if="$slots.avatar" class="ctp-card__avatar">
        <slot name="avatar" />
      </div>
      <div v-if="title || subtitle || $slots.header" class="ctp-card__header-content">
        <slot name="header">
          <h3 v-if="title" class="ctp-card__title">{{ title }}</h3>
          <p v-if="subtitle" class="ctp-card__subtitle">{{ subtitle }}</p>
        </slot>
      </div>
      <div v-if="$slots.actions" class="ctp-card__actions">
        <slot name="actions" />
      </div>
    </div>

    <!-- Media Slot / Element -->
    <div v-if="$slots.media || mediaSrc" class="ctp-card__media">
      <slot name="media">
        <img :src="mediaSrc" :alt="mediaAlt" />
      </slot>
    </div>

    <!-- Body Slot / Element -->
    <div class="ctp-card__body">
      <slot />
    </div>

    <!-- Footer Slot / Element -->
    <div v-if="$slots.footer" class="ctp-card__footer">
      <slot name="footer" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

type CardVariant = 'filled' | 'elevated' | 'outline' | 'flat' | 'colored';
type CardShape = 'square' | 'rounded' | 'pill';
type CardPadding = 'none' | 'sm' | 'md' | 'lg';
type CardAccentColor =
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
type CardAccentPosition = 'top' | 'left' | 'none';

interface Props {
  variant?: CardVariant;
  shape?: CardShape;
  padding?: CardPadding;
  accentColor?: CardAccentColor;
  accentPosition?: CardAccentPosition;
  isInteractive?: boolean;
  title?: string;
  subtitle?: string;
  mediaSrc?: string;
  mediaAlt?: string;
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'filled',
  shape: 'rounded',
  padding: 'md',
  accentPosition: 'none',
  isInteractive: false,
  mediaAlt: '',
});

const cardClass = computed(() => {
  return [
    'ctp-card',
    `ctp-card--${props.variant}`,
    `ctp-card--${props.shape}`,
    `ctp-card--padding-${props.padding}`,
    props.accentColor ? `ctp-card--${props.accentColor}` : '',
    props.accentColor && props.accentPosition !== 'none' ? `ctp-card--accent-${props.accentPosition}` : '',
    props.isInteractive ? 'ctp-card--interactive' : '',
  ];
});
</script>
