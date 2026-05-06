import { createRouter, createWebHistory } from 'vue-router'

import { getLatestUpdateDate } from '@/assets/tools.js'

const routes = [
  {
    path: '/',
    component: () => import('@/views/Home.vue')
  },
  {
    path: '/terms',
    component: () => import('../views/TermsView.vue')
  },
  {
    path: '/resources/faq',
    component: () => import('../views/resources/GlossaryView.vue')
  },
  {
    path: '/resources/glossary',
    name: 'Glossary',
    component: () => import('../views/resources/GlossaryView.vue')
  },
  {
    path: '/resources/ai-security-101',
    component: () => import('../views/resources/AiSecurity101View.vue')
  },
  // Redirects the old 101 URL to the new one
  {
    path: '/resources/adversarial-ml-101',
    redirect: '/resources/ai-security-101'
  },
  {
    path: '/resources/ai-security-autonomous-systems',
    component: () => import('../views/resources/AiSecurityAutonomousSystems.vue')
  },
  {
    path: '/resources/safe-ai',
    component: () => import('../views/resources/SafeAIView.vue')
  },
  {
    path: '/resources/info',
    component: () => import('../views/resources/GeneralInformationView.vue')
  },
  {
    path: '/resources/contact',
    component: () => import('../views/resources/ContactView.vue')
  },
  {
    path: '/contribute',
    component: () => import('../views/ContributeView.vue')
  },
  {
    path: '/contribute/submit',
    component: () => import('../views/ContributeFormView.vue')
  },
  {
    // When a user visits the updates index page, redirect to the most recent update
    path: '/resources/updates',
    redirect: `/resources/updates/${getLatestUpdateDate()}`
  },
  {
    path: '/resources/updates/:date',
    component: () => import('../views/resources/UpdatesListView.vue')
  },
  {
    path: '/:objectTypePlural',
    component: () => import('../views/ObjectListView.vue')
  },
  {
    path: '/:objectTypePlural/:id',
    component: () => import('../views/IDView.vue')
  },
  {
    path: '/studies/:id',
    component: () => import('../views/StudiesIDView.vue')
  },
  {
    path: '/studies/create',
    component: () => import('../views/BuildCaseStudyView.vue')
  },
  {
    path: '/navigator',
    component: () => import('../views/NavigatorView.vue')
  },
  {
    path: '/knowledge-graph',
    component: () => import('../views/KnowledgeGraphView.vue')
  },
  {
    path: '/attack-flow',
    component: () => import('../views/AttackFlow.vue')
  },
  {
    path: '/matrices/:id',
    component: () => import('@/views/MatrixView.vue')
  },
  {
    path: '/:catchAll(.*)*',
    name: 'ErrorNotFound',
    component: () => import('../views/ErrorNotFoundView.vue')
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) return savedPosition

    if (to.hash) {
      // manually scroll so we can delay until next animation to account for
      // both cold loads and page navigation
      requestAnimationFrame(() => {
        const el = document.getElementById(to.hash.slice(1))
        // mimic focusing linked elements on page nav
        el?.focus({ preventScroll: true })
        el?.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        })
      })

      return false
    }
    // always scroll to top
    return { top: 0 }
  }
})

export default router
