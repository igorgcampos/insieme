const axios = require('axios').default;
const httpService = {}
var keyCloakToken = {}
const serverUrl = 'http://localhost:8083'

httpService.install = function (Vue) {

    Vue.prototype.$connectToKeycloak = async (username, password) => {
        const response =
            await axios.post(
                serverUrl.concat('/login'),
                {
                    username: username,
                    password: password
                })

        if (response.data.length > 0) {
            keyCloakToken = response.data;
            return true;
        }
        return false;
    }

    Vue.prototype.$get = (url, params) => {
        return axios.get(serverUrl.concat(url), params,
            { headers: { Authorization: 'Bearer '.concat(keyCloakToken) } })
    }

    Vue.prototype.$post = (url, body) => {
        return axios.post(serverUrl.concat(url), body,
            { headers: { Authorization: 'Bearer '.concat(keyCloakToken) } })
    }

    Vue.prototype.$put = (url, body) => {
        return axios.put(serverUrl.concat(url), body,
            { headers: { Authorization: 'Bearer '.concat(keyCloakToken) } })
    }
}

export default httpService;