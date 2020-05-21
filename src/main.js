import Vue from 'vue'
import App from './App.vue'
import router from './router'
import vuetify from './plugins/vuetify';
import httpService from './services/HttpService.js'

Vue.config.productionTip = false
document.title = "Insieme"

Vue.use(httpService)

new Vue({
  router,
  vuetify,
  render: h => h(App)
}).$mount('#app')
