<script setup lang='ts'>
import { defineProps } from 'vue';
import type { PropType } from 'vue';

interface NavItem {
  routeName: string;
  displayName: string;
}

const props = defineProps({ items: { type: Array as PropType<NavItem[]>, required: true } });


</script>
<template>
  <div class='flex justify-items-center'>
    <template v-for='item in props.items' :key='item.displayName'>
      <RouterLink class='flex-1 p-2' :to='{name: item.routeName}'>
        <div class='text-center'>{{ item.displayName }}</div>
      </RouterLink>
    </template>
  </div>

</template>
<style scoped>
.router-link-active {
  @apply bg-gray-200 text-cyan-400;

}
</style>