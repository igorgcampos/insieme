import Vuetify from '../plugins/vuetify'
const utilService = {}
const insiemeVersion = process.env.VUE_APP_VERSION
const insiemeUrl = process.env.VUE_APP_INSIEME_URL;
const chilometerUrl = process.env.VUE_APP_CHILOMETER_URL;
const operacoesUrl = process.env.VUE_APP_OPERACOES_URL;
const protocolosUrl = process.env.VUE_APP_PROTOCOLOS_URL;

utilService.install = function (Vue) {

    Vue.prototype.$saveOperation = (operation) => {
        Vue.prototype.$post('/operacao/save', operation)
    }

    Vue.prototype.$getCurrencySymbol = (currencyName, prefix) => {
        if(!currencyName || currencyName == 'REAL'){
            return prefix? "R$" : "BRL";
        }

        if(currencyName == 'DOLAR'){
            return prefix ? "US$" : "USD";
        }

        if(currencyName == 'EURO'){
            return prefix ? "\u20AC" : "EUR";
        }
    }

    Vue.prototype.$getVersion = () => {
        return insiemeVersion;
    }

    Vue.prototype.$getAppUrl = (appName) => {

        if (appName == 'insieme') {
            return insiemeUrl;
        }

        if (appName == 'chilometer') {
            return chilometerUrl;
        }

        if (appName == 'operacoes') {
            return operacoesUrl;
        }

        if (appName == 'protocolos') {
            return protocolosUrl;
        }

    }

    Vue.prototype.$formatDate = (date, onlyMonthAndYear) => {

        if (!date) {
            return '--'
        }

        if (date.year) {
            if (Vuetify.framework.lang.current == 'en') {
                return date.month + '/' + date.day + '/' + date.year
            }

            return date.day + '/' + date.month + '/' + date.year
        }

        var splits = date.split('-')

        if(onlyMonthAndYear){
            return splits[1] + '/' + splits[0];
        }

        return splits[2] + '/' + splits[1] + '/' + splits[0];
    }

    Vue.prototype.$formatHour = (date) => {

        if (!date) {
            return '--'
        }

        return date.hour + ':' + (date.minute < 10 ? '0' + date.minute : date.minute) + ':' + (date.second < 10 ? '0' + date.second : date.second)
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