const axios = require('axios').default;
const httpService = {}
const keyCloakToken = {}

httpService.install = function (Vue, options) {

    Vue.prototype.$connectToKeycloak = (username, password) => {
        const response =
            await axios.post('https://auth.telespazio.com.br/auth/realms/telespazio-br/protocol/openid-connect/token', {
                grant_type: 'password',
                client_id: 'insieme-app',
                username: username,
                password: password
            })

        if (response.access_token) {
            keyCloakToken = access_token;
            return true;
        }
        return false;
    }

    Vue.prototype.$get = (url, params) => {
        return axios.get(url, params, { headers: { Authorization: 'Bearer '.concat(keyCloakToken) } })
    }

    Vue.prototype.$post = (url, body) => {
        return axios.post(url, body, { headers: { Authorization: 'Bearer '.concat(keyCloakToken) } })
    }

    Vue.prototype.$put = (url, body) => {
        return axios.put(url, body, { headers: { Authorization: 'Bearer '.concat(keyCloakToken) } })
    }
}