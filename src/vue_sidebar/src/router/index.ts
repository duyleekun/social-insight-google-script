import { createRouter, createMemoryHistory } from 'vue-router';
import HomeView from '@/views/HomeView.vue';

const router = createRouter({
  history: createMemoryHistory('/'),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,

    },
    {
      path: '/about',
      name: 'about',
      component: () => import('@/views/AboutView.vue'),
    },
    {
      path: '/facebook',
      name: 'facebook',
      component: () => import('@/views/FacebookView.vue'),
      children: [
        {
          path: 'page',
          name: 'facebook-page',
          component: () => import('@/views/FacebookPageView.vue'),
          children: [
            {
              path: 'page',
              name: 'facebook-page-insight',
              component: () => import('@/views/FacebookPageInsightView.vue'),
            },
            {
              path: 'video',
              name: 'facebook-page-video-insight',
              component: () => import('@/views/FacebookPageVideosInsightView.vue'),
            },
            {
              path: 'reel',
              name: 'facebook-page-reel-insight',
              component: () => import('@/views/FacebookPageReelsInsightView.vue'),
            },
          ],
        },
      ],
    }],
});

export default router;
