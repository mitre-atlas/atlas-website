import { createRouter, createWebHistory } from 'vue-router'

import { getLatestUpdateDate } from '@/assets/tools.js'

const routes = [
  {
    path: '/',
    name: 'Home',
    meta: {
      section: 'home',
      fullWidth: true,
      showSideNav: false,
      showBreadcrumbs: false,
    },
    component: () => import('@/views/Home.vue'),
  },
  {
    path: '/v/:version',
    name: 'VersionedHome',
    meta: {
      section: 'home',
      fullWidth: true,
      showSideNav: false,
      showBreadcrumbs: false,
    },
    component: () => import('@/views/Home.vue'),
  },
  {
    path: '/terms',
    name: 'Terms',
    meta: {
      section: 'resources',
      fullWidth: false,
      showSideNav: false,
      showBreadcrumbs: true,
    },
    component: () => import('../views/TermsView.vue'),
  },
  {
    path: '/resources/faq',
    meta: {
      section: 'resources',
      fullWidth: false,
      showSideNav: false,
      showBreadcrumbs: true,
    },
    redirect: '/resources/glossary',
  },
  {
    path: '/resources/glossary',
    name: 'Glossary',
    meta: {
      section: 'resources',
      fullWidth: false,
      showSideNav: false,
      showBreadcrumbs: true,
    },
    component: () => import('../views/resources/GlossaryView.vue'),
  },
  {
    path: '/resources/ai-security-101',
    name: 'AiSecurity101',
    meta: {
      section: 'resources',
      fullWidth: false,
      showSideNav: false,
      showBreadcrumbs: true,
    },
    component: () => import('../views/resources/AiSecurity101View.vue'),
  },
  // Redirects the old 101 URL to the new one
  {
    path: '/resources/adversarial-ml-101',
    redirect: '/resources/ai-security-101',
  },
  {
    path: '/resources/ai-security-autonomous-systems',
    name: 'AiSecurityAutonomousSystems',
    meta: {
      section: 'resources',
      fullWidth: false,
      showSideNav: false,
      showBreadcrumbs: true,
    },
    component: () => import('../views/resources/AiSecurityAutonomousSystems.vue'),
  },
  {
    path: '/resources/safe-ai',
    name: 'SafeAI',
    meta: {
      section: 'resources',
      fullWidth: false,
      showSideNav: false,
      showBreadcrumbs: true,
    },
    component: () => import('../views/resources/SafeAIView.vue'),
  },
  {
    path: '/resources/info',
    name: 'GeneralInformation',
    meta: {
      section: 'resources',
      fullWidth: false,
      showSideNav: false,
      showBreadcrumbs: true,
    },
    component: () => import('../views/resources/GeneralInformationView.vue'),
  },
  {
    path: '/resources/versions',
    name: 'AtlasVersions',
    meta: {
      section: 'resources',
      fullWidth: false,
      showSideNav: false,
      showBreadcrumbs: true,
    },
    component: () => import('../views/resources/AtlasVersionsView.vue'),
  },
  {
    path: '/resources/contact',
    name: 'Contact',
    meta: {
      fullWidth: false,
      showSideNav: false,
      showBreadcrumbs: true,
    },
    component: () => import('../views/resources/ContactView.vue'),
  },
  {
    path: '/contribute',
    name: 'Contribute',
    meta: {
      section: 'contribute',
      fullWidth: true,
      showSideNav: false,
      showBreadcrumbs: false,
    },
    component: () => import('../views/ContributeView.vue'),
  },
  {
    path: '/contribute/submit',
    name: 'ContributeForm',
    meta: {
      section: 'contribute',
      fullWidth: true,
      showSideNav: false,
      showBreadcrumbs: false,
    },
    component: () => import('../views/ContributeFormView.vue'),
  },
  {
    // When a user visits the updates index page, redirect to the most recent update
    path: '/resources/updates',
    redirect: `/resources/updates/${getLatestUpdateDate()}`,
  },
  {
    path: '/resources/updates/:date',
    name: 'UpdatesByDate',
    meta: {
      section: 'resources',
      fullWidth: false,
      showSideNav: false,
      showBreadcrumbs: true,
    },
    component: () => import('../views/resources/UpdatesListView.vue'),
  },
  {
    path: '/:objectTypePlural(tactics|techniques|mitigations|studies)',
    name: 'DataObjectList',
    meta: {
      section: 'data',
      fullWidth: false,
      showSideNav: true,
      showBreadcrumbs: true,
    },
    component: () => import('../views/ObjectListView.vue'),
  },
  {
    path: '/v/:version/:objectTypePlural(tactics|techniques|mitigations|studies)',
    name: 'VersionedDataObjectList',
    meta: {
      section: 'data',
      fullWidth: false,
      showSideNav: true,
      showBreadcrumbs: true,
    },
    component: () => import('../views/ObjectListView.vue'),
  },
  {
    path: '/:objectTypePlural(tactics|techniques|mitigations|studies)/:id',
    name: 'DataObjectDetail',
    meta: {
      section: 'data',
      fullWidth: false,
      showSideNav: true,
      showBreadcrumbs: true,
    },
    component: () => import('../views/IDView.vue'),
  },
  {
    path: '/v/:version/:objectTypePlural(tactics|techniques|mitigations|studies)/:id',
    name: 'VersionedDataObjectDetail',
    meta: {
      section: 'data',
      fullWidth: false,
      showSideNav: true,
      showBreadcrumbs: true,
    },
    component: () => import('../views/IDView.vue'),
  },
  {
    path: '/studies/:id',
    name: 'StudyDetail',
    meta: {
      section: 'studies',
      fullWidth: false,
      showSideNav: true,
      showBreadcrumbs: true,
    },
    component: () => import('../views/StudiesIDView.vue'),
  },
  {
    path: '/v/:version/studies/:id',
    name: 'VersionedStudyDetail',
    meta: {
      section: 'studies',
      fullWidth: false,
      showSideNav: true,
      showBreadcrumbs: true,
    },
    component: () => import('../views/StudiesIDView.vue'),
  },
  {
    path: '/navigator',
    name: 'Navigator',
    meta: {
      section: 'tools',
      fullWidth: false,
      showSideNav: false,
      showBreadcrumbs: true,
    },
    component: () => import('../views/NavigatorView.vue'),
  },
  {
    path: '/knowledge-graph',
    name: 'KnowledgeGraph',
    meta: {
      section: 'tools',
      fullWidth: false,
      showSideNav: false,
      showBreadcrumbs: true,
    },
    component: () => import('../views/KnowledgeGraphView.vue'),
  },
  {
    path: '/agent',
    name: 'Agent',
    meta: {
      section: 'tools',
      fullWidth: false,
      showSideNav: false,
      showBreadcrumbs: true,
    },
    component: () => import('../views/AgentView.vue'),
  },
  {
    path: '/attack-flow',
    name: 'AttackFlow',
    meta: {
      section: 'tools',
      fullWidth: false,
      showSideNav: false,
      showBreadcrumbs: true,
    },
    component: () => import('../views/AttackFlow.vue'),
  },
  {
    path: '/matrices/:id',
    name: 'Matrix',
    meta: {
      section: 'matrices',
      fullWidth: false,
      showSideNav: false,
      showBreadcrumbs: true,
    },
    component: () => import('@/views/MatrixView.vue'),
  },
  {
    path: '/v/:version/matrices/:id',
    name: 'VersionedMatrix',
    meta: {
      section: 'matrices',
      fullWidth: false,
      showSideNav: false,
      showBreadcrumbs: true,
    },
    component: () => import('@/views/MatrixView.vue'),
  },
  {
    path: '/v/:version/:catchAll(.*)*',
    name: 'VersionedErrorNotFound',
    meta: {
      section: 'error',
      fullWidth: false,
      showSideNav: false,
      showBreadcrumbs: true,
    },
    component: () => import('../views/ErrorNotFoundView.vue'),
  },
  {
    path: '/:catchAll(.*)*',
    name: 'ErrorNotFound',
    meta: {
      section: 'error',
      fullWidth: false,
      showSideNav: false,
      showBreadcrumbs: true,
    },
    component: () => import('../views/ErrorNotFoundView.vue'),
  },
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
  },
})

export default router
