import { createRouter, createWebHistory } from 'vue-router'

import TermsView from '../views/TermsView.vue'
import ErrorNotFoundView from '../views/ErrorNotFoundView.vue'
import IDView from '../views/IDView.vue'
import StudiesIDView from '../views/StudiesIDView.vue'
import BuildCaseStudyView from '../views/BuildCaseStudyView.vue'
import ObjectListView from '../views/ObjectListView.vue'
import GeneralInformationView from '../views/resources/GeneralInformationView.vue'
import ContributorsListView from '../views/resources/ContributorsListView.vue'
import FAQView from '../views/resources/FAQView.vue'
import AiSecurity101View from '../views/resources/AiSecurity101View.vue'
import NavigatorView from '../views/NavigatorView.vue'
import MatrixView from '@/views/MatrixView.vue';
import ContactView from '../views/resources/ContactView.vue'
import EventsView from '../views/resources/EventsView.vue'
import UpdatesListView from '../views/resources/UpdatesListView.vue'

import { getLatestUpdateDate } from '@/assets/tools.js'

const routes = [
  {
    path: '/',
    component: () => import('@/views/Home.vue'),
  },
  {
    path: '/terms',
    component: TermsView,
  },
  {
    path: '/resources/faq',
    component: FAQView,
  },
  {
    path: '/resources/ai-security-101',
    component: AiSecurity101View,
  },
  // Redirects the old 101 URL to the new one
  {
    path: '/resources/adversarial-ml-101',
    redirect: '/resources/ai-security-101',
  },
  {
    path: '/resources/info',
    component: GeneralInformationView,
  },
  {
    path: '/resources/contact',
    component: ContactView,
  },
  {
    path: '/resources/events',
    component: EventsView,
  },
  {
    path: '/resources/contribute',
    component: ContributorsListView,
  },
  {
    // When a user visits the updates index page, redirect to the most recent update
    path: '/resources/updates',
    redirect: `/resources/updates/${getLatestUpdateDate()}`
  },
  {
    path: '/resources/updates/:date',
    component: UpdatesListView
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
    path: '/studies/create',
    component: BuildCaseStudyView,
  },
  {
    path: '/navigator',
    component: NavigatorView,
  },
  {
    path: '/matrices/:id',
    component: MatrixView,
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
  scrollBehavior(to, from, savedPosition) {
    if (to.hash) {
      return {
        el: to.hash,
        // Accomodate for the header height in px
        top: 64
      }
    }
    // always scroll to top
    return { top: 0 }
  },
})

export default router
