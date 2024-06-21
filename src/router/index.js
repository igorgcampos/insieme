import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Main',
    component: () => import('../views/MainPage.vue'),
    children: [
      {
        path: 'contratos',
        name: 'Contracts',
        props: true,
        component: () => import('../views/ContractsPage.vue')
      },
      {
        path: 'dashboard',
        name: 'Dashboard',
        props: true,
        component: () => import('../views/DashboardPage.vue')
      },
      {
        path: 'administracao',
        name: 'Administration',
        props: true,
        component: () => import('../views/OperationsPage.vue')
      },
      {
        path: 'boletim',
        name: 'MetricReport',
        props: true,
        component: () => import('../views/MetricReportPage.vue')
      },
      {
        path: 'disponibilidade',
        name: 'AvailabilityReport',
        props: true,
        component: () => import('../views/AvailabilityPage.vue')
      },
      {
        path: 'mapa',
        name: 'Map',
        component: () => import('../views/MapPage.vue')
      },
    ]
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/LoginPage.vue')
  }
]

const router = new VueRouter({
  routes
})

export default router
