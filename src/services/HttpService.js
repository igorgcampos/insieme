const axios = require('axios').default;
const httpService = {}
var keyCloakToken = {}
var user;
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
            getUser()
            return true;
        }
        return false;
    }

    const getUser = async () => {

        if (user) {
            return user;
        }
        user = await axios.get(serverUrl.concat("/usuario"),
            { headers: { Authorization: 'Bearer '.concat(keyCloakToken) } })

        console.log("user: " + user)
    }

    Vue.prototype.$getUser = () => {
        return user;
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