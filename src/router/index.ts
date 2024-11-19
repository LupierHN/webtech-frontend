import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import TestCompositionApiPage from '@/views/TestCompositionAPIPage.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue')
    },
    {
      path: '/test-options-api',
      name: 'test-options-api',
      component: () => import('../views/TestOptionsAPIPage.vue')
    },
    {
      path: '/test-compositions-api',
      name: 'test-compositions-api',
      component: () => import('../views/TestCompositionAPIPage.vue')
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: () => import('../views/Dashboard.vue')
    }
  ]
})

export default router
