<template>
  <div>
    <div v-if='facebookStore.loggedIn'>

      <select v-model='selectedFacebookAccounts' multiple>
        <option v-for='facebookAccount in facebookAccounts' :key='facebookAccount.id' :value='facebookAccount'>
          {{ facebookAccount.name }}
        </option>
      </select>
    </div>
    <template v-if='selectedFacebookAccounts.length > 0'>

      <NavList :items="[{
          routeName: 'facebook-page-insight',
          displayName: 'Page Insight'
        },{
          routeName: 'facebook-page-video-insight',
          displayName: 'Video Insight'
        }]" />
      <RouterView :selectedFacebookAccounts='selectedFacebookAccounts' />
    </template>

  </div>
</template>

<style>

</style>
<script setup lang='ts'>
import NavList from '@/components/NavList.vue';
import { ref, watchEffect } from 'vue';
import { fbApiAll } from '@/lib/fb';

import { useFacebookStore } from '@/stores/fb';
import type {FacebookAccount} from "../../../common/env";

const facebookStore = useFacebookStore();
const facebookAccounts = ref([] as FacebookAccount[]);
const selectedFacebookAccounts = ref([] as FacebookAccount[]);
watchEffect(async () => {
  console.log('facebookStore.loggedIn', facebookStore.loggedIn);
  if (!facebookStore.loggedIn) {
    return;
  }
  facebookAccounts.value = (await fbApiAll('/me/accounts')).data;
});

</script>
