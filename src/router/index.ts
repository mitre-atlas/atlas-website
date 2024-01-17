import { createRouter, createWebHistory } from 'vue-router'
import type { RouteLocationNormalized, NavigationGuardNext } from 'vue-router';
import { useMain } from "@/stores/main"

import HomeView from '../views/HomeView.vue'
import TermsView from '../views/TermsView.vue'
import ErrorNotFoundView from '../views/ErrorNotFoundView.vue'
import IDView from '../views/IDView.vue'
import StudiesIDView from '../views/StudiesIDView.vue'
import ObjectListView from '../views/ObjectListView.vue'
import GeneralInformation from '../views/resources/GeneralInformation.vue'
import FAQ from '../views/resources/faq.vue'
import adversarial from '../views/resources/adversarial-ml-101.vue'
import NavigatorView from '../views/NavigatorView.vue'
import ContactView from '../views/resources/contact.vue'

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
    path: '/resources/info',
    component: GeneralInformation,
  },
  {
    path: '/resources/contact',
    component: ContactView,
  },
  {
    path: '/:objectTypePlural',
    component: ObjectListView,
  },
  {
    path: '/:objectTypePlural/:id',
    component: IDView,
  },
  {
    path: '/studies/:id',
    component: StudiesIDView,
  },
  {
    path: '/navigator',
    component: NavigatorView,
  },
  {
    path: '/:catchAll(.*)*', 
    name: 'ErrorNotFound',
    component: ErrorNotFoundView,
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior() {
    // always scroll to top
    return { top: 0 }
  },
})

export default router
