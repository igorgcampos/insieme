const authService = {}

authService.install = function (Vue) {

    Vue.prototype.$login = async (username, password) => {

        const response = await Vue.prototype.$post('/login', {
            username: username,
            password: password
        }, true)

        if (!response || !response.data.access_token) {
            return false;
        }

        if (response.data.access_token) {
            window.sessionStorage.setItem('keyCloakToken', response.data.access_token);
            window.sessionStorage.setItem('keyCloakRefreshToken', response.data.refresh_token);
            await getUser()
            return true;
        }
        return false;
    }

    Vue.prototype.$logout = async () => {

        var response = await Vue.prototype.$get('/logout/'.
            concat(window.sessionStorage.getItem('keyCloakRefreshToken')))

        Vue.prototype.$clearSessionStorage();

        return response;
    }

    Vue.prototype.$clearSessionStorage = async () => {
        window.sessionStorage.removeItem('keyCloakToken');
        window.sessionStorage.removeItem('keyCloakRefreshToken');
        window.sessionStorage.removeItem('user');
    }

    const getUser = async () => {

        var user = await Vue.prototype.$get("/usuario")
        window.sessionStorage.setItem('user', JSON.stringify(user.data));
    }

    Vue.prototype.$getUser = () => {
        return JSON.parse(window.sessionStorage.getItem('user'));
    }

    Vue.prototype.$isAuthenticated = () => {
        return window.sessionStorage.getItem('keyCloakToken');
    }
}

export default authService;