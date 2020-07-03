import Vue from 'vue'
import App from './App.vue'
import router from './router'
import vuetify from './plugins/vuetify';
import httpService from './services/HttpService.js'
import authService from './services/AuthService.js'
import dateService from './services/DateService.js'
import exportService from './services/ExportService.js'

Vue.config.productionTip = false
document.title = "Insieme"

Vue.use(httpService, router)
Vue.use(authService)
Vue.use(dateService)
Vue.use(exportService)

Vue.directive('scroll', {
  inserted: function (el, binding) {
    let f = function (evt) {
      if (binding.value(evt, el)) {
        window.removeEventListener('scroll', f)
      }
    }
    window.addEventListener('scroll', f)
  }
})

new Vue({
  router,
  vuetify,
  render: h => h(App)
}).$mount('#app')
