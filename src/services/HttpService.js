const axios = require('axios').default;
const httpService = {}
var keyCloakToken;
var keyCloakRefreshToken = {}
var user;
const serverUrl = process.env.VUE_APP_SERVER_URL

httpService.install = function (Vue) {

    Vue.prototype.$login = async (username, password) => {
        console.log(process.env)
        const response =
            await axios.post(
                serverUrl.concat('/login'),
                {
                    username: username,
                    password: password
                })

        if (response.data.access_token) {
            keyCloakToken = response.data.access_token;
            keyCloakRefreshToken = response.data.refresh_token;
            await getUser()
            return true;
        }
        return false;
    }

    Vue.prototype.$logout = async () => {
        var response = await axios.get(serverUrl.concat('/logout/').concat(keyCloakRefreshToken),
            { headers: { Authorization: 'Bearer '.concat(keyCloakToken) } })

        keyCloakToken = undefined
        return response;
    }

    const getUser = async () => {

        if (user) {
            return user;
        }
        user = await axios.get(serverUrl.concat("/usuario"),
            { headers: { Authorization: 'Bearer '.concat(keyCloakToken) } })

        user = user.data;
    }

    Vue.prototype.$getUser = () => {
        return user;
    }

    Vue.prototype.$get = (url) => {
        return axios.get(serverUrl.concat(url),
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

    Vue.prototype.$isAuthenticated = () => {
        return keyCloakToken;
    }
}

export default httpService;