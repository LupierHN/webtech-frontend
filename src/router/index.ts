import { createRouter, createWebHistory } from 'vue-router'
import DashboardView from '@/views/DashboardView.vue'
import LoginView from '@/views/LoginView.vue'
import RegisterView from '@/views/RegisterView.vue'
import DocumentView from '@/views/DocumentView.vue'
import TermsAndCondition from '@/views/TermsAndCondition.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'dashboard',
      component: DashboardView
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView
    },
    {
      path: '/register',
      name: 'register',
      component: RegisterView
    },
    {
      path: '/edit',
      name: 'edit',
      component: DocumentView
    },
    {
      path: '/view',
      name: 'view',
      component: DocumentView
    },
    {
      path: '/terms',
      name: 'terms',
      component: TermsAndCondition
    }
  ]
})

export default router
