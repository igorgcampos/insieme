const axios = require('axios').default;
const httpService = {}
const serverUrl = process.env.VUE_APP_SERVER_URL

httpService.install = function (Vue) {

    Vue.prototype.$get = async (url) => {
        return axios.get(serverUrl.concat(url),
            { headers: { Authorization: 'Bearer '.concat(window.sessionStorage.getItem('keyCloakToken')) } })
    }

    Vue.prototype.$post = async (url, body, noBearer) => {

        if (noBearer) {
            return axios.post(serverUrl.concat(url), body)
        }

        return axios.post(serverUrl.concat(url), body,
            { headers: { Authorization: 'Bearer '.concat(window.sessionStorage.getItem('keyCloakToken')) } })
    }

    Vue.prototype.$put = async (url, body) => {
        return axios.put(serverUrl.concat(url), body,
            { headers: { Authorization: 'Bearer '.concat(window.sessionStorage.getItem('keyCloakToken')) } })
    }
}

export default httpService;