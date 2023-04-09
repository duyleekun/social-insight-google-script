<script setup lang='ts'>
import { RouterLink, RouterView } from 'vue-router'
import { useFacebookStore } from './stores/fb';
import {storeToRefs} from 'pinia';
import NavList from '@/components/NavList.vue';
const facebookStore = useFacebookStore();
facebookStore.init();

</script>

<template>
  <NavList :items="[{
        routeName: 'home',
        displayName: 'Home'
      }, {
        routeName: 'facebook-page',
        displayName: 'Facebook'
      }, {
        routeName: 'about',
        displayName: 'About'
      }]" />
  <RouterView/>
</template>

<style scoped>
</style>
<style>
@import url('./assets/main.css');
</style>