import { createRouter, createWebHistory } from 'vue-router';
import { useUserStore } from '../stores/user';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/LoginView.vue'),
    },
    {
      path: '/signup',
      name: 'signup',
      component: () => import('../views/SignupView.vue'),
    },
    {
      path: '/',
      component: () => import('../layouts/MainLayout.vue'),
      children: [
        {
          path: '',
          name: 'home',
          component: () => import('../views/HomeView.vue'),
        },
        {
          path: 'add-transaction',
          name: 'add-transaction',
          component: () => import('../views/AddTansaction.vue'),
        },
        {
          path: 'stats',
          name: 'stats',
          component: () => import('../views/StatsView.vue'),
        },
        {
          path: 'settings',
          name: 'settings',
          component: () => import('../views/SettingsView.vue'),
        },
        {
          path: 'testing',
          name: 'testing',
          component: () => import('../views/TestingView.vue'),
        },
      ],
    },
  ],
});

// 로그인 상태가 아니면 /login으로 리다이렉트
router.beforeEach((to) => {
  const userStore = useUserStore();
  if (to.name !== 'login' && to.name !== 'signup' && !userStore.currentUser) {
    return { name: 'login' };
  }
});

export default router;
