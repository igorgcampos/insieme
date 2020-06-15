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
        path: 'clientes',
        name: 'Clients',
        component: () => import('../views/ClientsPage.vue')
      },
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
      }
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
