<template>
  <div class="facebook">
    <h1>This is an facebook reel insight</h1>
    <input type="number" v-model="limit"/>
    <button @click="writeAllToSheet">Write to sheet</button>
  </div>
</template>

<script setup lang='ts'>
import type {FacebookAccount} from "../../../common/env";
import {ref} from "vue";
const props = defineProps<{
  selectedFacebookAccounts: FacebookAccount[];
}>();

const limit = ref(100)

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
      .writeFacebookReelsWithLifetimeInsights(props.selectedFacebookAccounts, limit.value)
  })
}

</script>
<style>
</style>
