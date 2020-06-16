import Vuetify from '../plugins/vuetify'
const dateService = {}

dateService.install = function (Vue) {

    Vue.prototype.$formatDate = (date) => {
        if (Vuetify.framework.lang.current == 'en') {
            return date.month + '/' + date.day + '/' + date.year
        }

        return date.day + '/' + date.month + '/' + date.year
    }
}

export default dateService;