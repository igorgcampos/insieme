const axios = require('axios').default;
const httpService = {}
const serverUrl = process.env.VUE_APP_SERVER_URL

httpService.install = function (Vue, router) {

    Vue.prototype.$get = async (url, params, responseType) => {
        try {
            return await axios.get(serverUrl.concat(url),
                {
                    headers: {
                        Authorization: 'Bearer '.concat(window.sessionStorage.getItem('keyCloakToken'))
                    },
                    params: params,
                    responseType: responseType || ''
                }
            )
        } catch (error) {
            console.log(error)

            if (error.message == 'Network Error' || error.message.includes(401)) {
                Vue.prototype.$clearSessionStorage();
                router.push('/login')
            }
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

            if (error.message == 'Network Error' || error.message.includes(401)) {
                Vue.prototype.$clearSessionStorage();
                router.push('/login')
            }
        }
    }

    Vue.prototype.$put = async (url, body) => {
        try {
            return await axios.put(serverUrl.concat(url), body,
                { headers: { Authorization: 'Bearer '.concat(window.sessionStorage.getItem('keyCloakToken')) } })

        } catch (error) {
            console.log(error)

            if (error.message == 'Network Error' || error.message.includes(401)) {
                Vue.prototype.$clearSessionStorage();
                router.push('/login')
            }
        }
    }

    Vue.prototype.$delete = async (url, body) => {
        try {
            return await axios.delete(serverUrl.concat(url),
                { data: body, headers: { Authorization: 'Bearer '.concat(window.sessionStorage.getItem('keyCloakToken')) } })

        } catch (error) {
            console.log(error)

            if (error.message == 'Network Error' || error.message.includes(401)) {
                Vue.prototype.$clearSessionStorage();
                router.push('/login')
            }
        }
    }
}

export default httpService;