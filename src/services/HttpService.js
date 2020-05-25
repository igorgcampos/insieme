const axios = require('axios').default;
const httpService = {}
const serverUrl = process.env.VUE_APP_SERVER_URL

httpService.install = function (Vue) {

    Vue.prototype.$get = async (url) => {
        try {
            return await axios.get(serverUrl.concat(url),
                { headers: { Authorization: 'Bearer '.concat(window.sessionStorage.getItem('keyCloakToken')) } })
        } catch (error) {
            console.log(error)
        }

    }

    Vue.prototype.$post = async (url, body, noBearer) => {
        try {

            if (noBearer) {
                return await axios.post(serverUrl.concat(url), body)
            }

            return await axios.post(serverUrl.concat(url), body,
                { headers: { Authorization: 'Bearer '.concat(window.sessionStorage.getItem('keyCloakToken')) } })

        } catch (error) {
            console.log(error)
        }
    }

    Vue.prototype.$put = async (url, body) => {
        try {
            return await axios.put(serverUrl.concat(url), body,
                { headers: { Authorization: 'Bearer '.concat(window.sessionStorage.getItem('keyCloakToken')) } })

        } catch (error) {
            console.log(error)
        }
    }
}

export default httpService;