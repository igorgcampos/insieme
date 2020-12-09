import Vuetify from '../plugins/vuetify'
const utilService = {}
const insiemeVersion = process.env.VUE_APP_VERSION

utilService.install = function (Vue) {

    Vue.prototype.$saveOperation = (operation) => {
        Vue.prototype.$post('/operacao/save', operation)
    }

    Vue.prototype.$getVersion = () => {
        return insiemeVersion;
    }

    Vue.prototype.$formatDate = (date) => {

        if (!date) {
            return '--'
        }

        if (Vuetify.framework.lang.current == 'en') {
            return date.month + '/' + date.day + '/' + date.year
        }

        return date.day + '/' + date.month + '/' + date.year
    }

    Vue.prototype.$formatHour = (date) => {

        if (!date) {
            return '--'
        }

        return date.hour + ':' + date.minute + ':' + (date.second < 10 ? '0' + date.second : date.second)
    }

    Vue.prototype.$showChat = () => {

        if (window.Huggy.init) {
            window.Huggy.init({
                defaultCountry: '+55',
                widget_id: '24845',
                company: "317521",
                contextID: '4a40e11b97d6d86a057e48c12e629743',
                afterLoad: function () {
                    window.Huggy.openBox();
                }
            });
        } else {
            window.Huggy.openBox();
        }
    }

    Vue.prototype.$showChatButton = () => {

        if (window.Huggy.init) {
            window.Huggy.init({
                defaultCountry: '+55',
                widget_id: '24845',
                company: "317521",
                contextID: '4a40e11b97d6d86a057e48c12e629743',
                afterLoad: function () {
                    window.Huggy.showButton();
                }
            });
        } else {
            window.Huggy.showButton();
        }
    }

    Vue.prototype.$hideChatButton = () => {

        if (window.Huggy) {
            window.Huggy.hideButton();
        }
    }
}

export default utilService;