<template>
  <div class="facebook">
    <h1>This is an facebook page insight</h1>
<!--    <div>{{selectedFacebookAccounts}}</div>-->
    <textarea v-model='metricsString'/>
    <button @click="writeAllToSheet">Write to sheet</button>
  </div>
</template>

<script setup lang='ts'>
import { useFacebookStore } from '@/stores/fb';
import { computed, ref, watchEffect } from 'vue';
import type {FacebookAccount} from "../../../common/env";
const props = defineProps<{
  selectedFacebookAccounts: FacebookAccount[];
}>();
const facebookStore = useFacebookStore();
const metricsString = ref('page_engaged_users,page_post_engagements,page_consumptions,page_negative_feedback,page_impressions,page_fan_adds,page_video_views,page_video_complete_views_30s,page_video_views_10s,page_video_view_time');

const metrics = computed(() => {
  return metricsString.value.split(',').map((metric) => metric.trim());
});
async function writeAllToSheet() {
  return new Promise((resolve, reject)=> {
    google.script.run
        .withSuccessHandler((result: any) => {
          console.log('result', result);
          resolve(result)
        })
        .withFailureHandler((error: any) => {
          console.error('error', error);
          reject(error)
        })
        .writeFacebookPagesInsights(props.selectedFacebookAccounts, metrics.value)
  })
}

watchEffect(async () => {
  console.log('facebookStore.loggedIn', facebookStore.loggedIn);
  if (!facebookStore.loggedIn) {
    return;
  }
  console.log('selectedFacebookAccounts', props.selectedFacebookAccounts);
  console.log('metrics', metrics.value);
  // call google app script function
});

// constant of all facebook page insight metric and descriptions


</script>
<style>
</style>
