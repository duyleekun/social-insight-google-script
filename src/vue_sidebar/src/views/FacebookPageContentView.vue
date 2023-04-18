<template>
  <div class="facebook">
    <h1>This is an facebook post insight</h1>
    <button @click="writeAllToSheet">Write to sheet</button>
  </div>
</template>

<script setup lang='ts'>
import type {FacebookAccount} from "../../../common/env";
const props = defineProps<{
  selectedFacebookAccounts: FacebookAccount[];
}>();

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
      .writeFacebookPostsWithLifetimeInsights(props.selectedFacebookAccounts)
  })
}

</script>
<style>
</style>
