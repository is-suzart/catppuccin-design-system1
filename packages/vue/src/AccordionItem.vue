<template>
  <div class="ctp-accordion__item" :data-state="isOpen ? 'open' : (disabled ? 'disabled' : undefined)" v-bind="$attrs">
    <button
      type="button"
      class="ctp-accordion__header"
      :disabled="disabled"
      :aria-expanded="isOpen"
      @click="handleHeaderClick"
    >
      <span class="ctp-accordion__title">
        <slot name="header">{{ title }}</slot>
      </span>
      <slot v-if="showChevron" name="chevron" :is-open="isOpen">
        <svg
          class="ctp-accordion__chevron"
          viewBox="0 0 24 24"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </slot>
    </button>

    <div
      class="ctp-accordion__collapse"
      :aria-hidden="!isOpen"
    >
      <div class="ctp-accordion__content">
        <div class="ctp-accordion__body">
          <slot />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, inject } from 'vue';

interface Props {
  value: string;
  title?: string;
  disabled?: boolean;
  showChevron?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  disabled: false,
  showChevron: true,
});

const accordion = inject<{
  openValues: { value: string[] };
  toggleValue: (value: string) => void;
  accentColor: { value: string | undefined };
} | null>('accordion', null);

if (!accordion) {
  throw new Error('AccordionItem must be used inside an Accordion component');
}

const isOpen = computed(() => {
  return accordion.openValues.value.includes(props.value);
});

const handleHeaderClick = () => {
  if (props.disabled) return;
  accordion.toggleValue(props.value);
};
</script>
