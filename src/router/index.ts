import { createRouter, createWebHistory } from 'vue-router'

import HomeView from '../views/HomeView.vue'
import TermsView from '../views/TermsView.vue'
import ErrorNotFoundView from '../views/ErrorNotFoundView.vue'
import IDView from '../views/IDView.vue'
import FAQ from '../views/resources/faq.vue'
import adversarial from '../views/resources/adversarial-ml-101.vue'

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
    path: '/resources/faq',
    component: FAQ,
  },
  {
    path: '/resources/adversarial-ml-101',
    component: adversarial,
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
