<template>
  <a class="ctp-sidebar-item" :class="{ 'ctp-sidebar-item--active': active }">
    <span v-if="icon" class="ctp-sidebar-item-icon">{{ icon }}</span>
    <span class="ctp-sidebar-item-label"><slot /></span>
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
