import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { getFacebookSDK } from '@/lib/fb';

export const useFacebookStore = defineStore('facebookAuth', () => {
  const loggedIn = ref(false)

  async function init() {
    const fb = await getFacebookSDK();
    fb.Event.subscribe('auth.statusChange', response => {
      console.log('auth.statusChange', response);
      loggedIn.value = response.status === 'connected'
    })
    fb.init({
      appId: '303415919770326',
      cookie: true,
      xfbml: true,
      version: 'v16.0',
      status: true,
    });

    fb.getLoginStatus((response) => {
      console.log('fb.getLoginStatus', response);
      loggedIn.value = response.status === 'connected'
    })
  }

  return { loggedIn, init }
  // const doubleCount = computed(() => count.value * 2)
  // function increment() {
  //   count.value++
  // }
  //
  // return { count, doubleCount, increment }
})
