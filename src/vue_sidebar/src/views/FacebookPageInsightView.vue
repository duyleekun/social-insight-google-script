<template>
  <div class="facebook">
    <h1>This is an facebook page insight</h1>
    <div>{{selectedFacebookAccounts}}</div>
    <textarea v-model='metricsString'/>
  </div>
</template>

<script setup lang='ts'>
import { useFacebookStore } from '@/stores/fb';
import { computed, ref, watchEffect } from 'vue';
import type { FacebookAccount } from '@/lib/fb';
import { fbApiAll } from '@/lib/fb';
const props = defineProps<{
  selectedFacebookAccounts: FacebookAccount[];
}>();
const facebookStore = useFacebookStore();
const metricsString = ref('');
const metrics = computed(() => {
  return metricsString.value.split(',').map((metric) => metric.trim());
});
watchEffect(async () => {
  console.log('facebookStore.loggedIn', facebookStore.loggedIn);
  if (!facebookStore.loggedIn) {
    return;
  }
  console.log('selectedFacebookAccounts', props.selectedFacebookAccounts);
  console.log('metrics', metrics.value);
  // call google app script function

  google.script.run
    .withSuccessHandler((result: any) => {
      console.log('result', result);
    })
    .withFailureHandler((error: any) => {
      console.error('error', error);
    })
    .writeFacebookPagesInsights(props.selectedFacebookAccounts, metrics.value)
});

// constant of all facebook page insight metric and descriptions


</script>
<style>
</style>
