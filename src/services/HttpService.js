const axios = require('axios').default;
const httpService = {}
const serverUrl = process.env.VUE_APP_SERVER_URL

httpService.install = function (Vue) {

    Vue.prototype.$login = async (username, password) => {

        const response =
            await axios.post(
                serverUrl.concat('/login'),
                {
                    username: username,
                    password: password
                })

        if (response.data.access_token) {
            window.sessionStorage.setItem('keyCloakToken', response.data.access_token);
            window.sessionStorage.setItem('keyCloakRefreshToken', response.data.refresh_token);
            await getUser()
            return true;
        }
        return false;
    }

    Vue.prototype.$logout = async () => {

        var response = await axios.get(serverUrl.concat('/logout/').
            concat(window.sessionStorage.getItem('keyCloakRefreshToken')),
            { headers: { Authorization: 'Bearer '.concat(window.sessionStorage.getItem('keyCloakToken')) } })

        window.sessionStorage.removeItem('keyCloakToken');
        window.sessionStorage.removeItem('user');
        return response;
    }

    const getUser = async () => {

        var user = await axios.get(serverUrl.concat("/usuario"),
            { headers: { Authorization: 'Bearer '.concat(window.sessionStorage.getItem('keyCloakToken')) } })

        window.sessionStorage.setItem('user', JSON.stringify(user.data));
    }

    Vue.prototype.$getUser = () => {
        return JSON.parse(window.sessionStorage.getItem('user'));
    }

    Vue.prototype.$get = (url) => {
        return axios.get(serverUrl.concat(url),
            { headers: { Authorization: 'Bearer '.concat(window.sessionStorage.getItem('keyCloakToken')) } })
    }

    Vue.prototype.$post = (url, body) => {
        return axios.post(serverUrl.concat(url), body,
            { headers: { Authorization: 'Bearer '.concat(window.sessionStorage.getItem('keyCloakToken')) } })
    }

    Vue.prototype.$put = (url, body) => {
        return axios.put(serverUrl.concat(url), body,
            { headers: { Authorization: 'Bearer '.concat(window.sessionStorage.getItem('keyCloakToken')) } })
    }

    Vue.prototype.$isAuthenticated = () => {
        return window.sessionStorage.getItem('keyCloakToken');
    }
}

export default httpService;