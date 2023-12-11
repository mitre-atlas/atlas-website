import { createRouter, createWebHistory } from 'vue-router'

import HomeView from '../views/HomeView.vue'
import TermsView from '../views/TermsView.vue'
import ErrorNotFoundView from '../views/ErrorNotFoundView.vue'
import IDView from '../views/IDView.vue'

const routes = [
  {
    path: '/',
    component: HomeView,
  },
  {
    path: '/terms',
    component: TermsView,
  },
  {
    path: '/:objectTypePlural/:id',
    component: IDView,
  },
  {
      path: '/:catchAll(.*)*', 
      component: ErrorNotFoundView,
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router
