<template>
  <aside :class="sidebarClass"><slot /></aside>
</template>

<script setup lang="ts">
import { computed } from 'vue';

interface Props {
  collapsed?: boolean;
  collapsible?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  collapsed: false,
  collapsible: false,
});

const sidebarClass = computed(() => {
  return [
    'ctp-sidebar',
    props.collapsed ? 'ctp-sidebar--collapsed' : '',
    props.collapsible ? 'ctp-sidebar--collapsible' : '',
  ];
});
</script>
