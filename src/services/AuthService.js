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
            window.sessionStorage.setItem('actualPage', 'clients');
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
        window.sessionStorage.removeItem('actualPage');
        window.sessionStorage.removeItem('selectedClientId');
        window.sessionStorage.removeItem('selectedContractId');
        window.sessionStorage.removeItem('selectedContractTpz');
    }

    const getUser = async () => {

        var user = await Vue.prototype.$get("/usuario")
        window.sessionStorage.setItem('user', JSON.stringify(user.data));
    }

    Vue.prototype.$getUser = async () => {

        if (!window.sessionStorage.getItem('user')) {
            await getUser()
        }

        return JSON.parse(window.sessionStorage.getItem('user'));
    }

    Vue.prototype.$isAuthenticated = () => {
        return window.sessionStorage.getItem('keyCloakToken');
    }

    Vue.prototype.$hasProfile = (profile) => {
        for (var index in JSON.parse(window.sessionStorage.getItem('user')).perfis) {
            if (JSON.parse(window.sessionStorage.getItem('user')).perfis[index] == profile) {
                return true;
            }
        }

        return false;
    }

    Vue.prototype.$setKeycloakToken = async (token) => {
        window.sessionStorage.setItem('keyCloakToken', token);
        window.history.replaceState({}, document.title, "/")
        await getUser()
    }
}

export default authService;