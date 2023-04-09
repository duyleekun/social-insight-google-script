<template>
  <div>
    <NavList :items="[{
          routeName: 'facebook-page',
          displayName: 'Facebook Page'
        }]" />
    <button @click='login'>Login with Facebook</button>
    <div>Logged in {{ facebookStore.loggedIn }}</div>
    <div>
      <RouterView v-if='facebookStore.loggedIn' />
    </div>
  </div>
</template>

<style>
</style>
<script setup lang='ts'>
import NavList from '../components/NavList.vue';
import { fbApiAll, getFacebookSDK } from '@/lib/fb';
import { useFacebookStore } from '@/stores/fb';

const facebookStore = useFacebookStore();

async function login() {
  const fb = await getFacebookSDK();
  fb.login(() => {
  }, { scope: 'read_insights,pages_show_list,pages_read_engagement,pages_read_user_content' });
}


</script>