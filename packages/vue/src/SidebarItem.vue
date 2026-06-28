<template>
  <a class="ctp-sidebar__item" :class="{ 'ctp-sidebar__item--active': active }">
    <span v-if="icon" class="ctp-sidebar__item-icon">{{ icon }}</span>
    <span class="ctp-sidebar__item-label"><slot /></span>
  </a>
</template>

<script setup lang="ts">
interface Props {
  active?: boolean;
  icon?: string;
}

withDefaults(defineProps<Props>(), {
  active: false,
  icon: '',
});
</script>
