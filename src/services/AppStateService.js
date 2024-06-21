const appState = {};

const stateService = {}

//Guarda no usuário logado as preferencias de mapa
stateService.install = function (Vue) {

    Vue.prototype.$appState = () => {
       return appState;
    }

    Vue.prototype.$saveAppState = async () => {
        var user = await Vue.prototype.$getUser();

         if(!appState.mapPosition){
            return;
         }

        user.preferencias = {
          anguloMapa: appState.mapPitch,
          zoomMapa: appState.mapZoom,
          rotacaoMapa: appState.mapRotation,
          estiloMapa: appState.mapStyle,
          ultimaBusca: appState.lastSearch,
          latitudeMapa: appState.mapPosition.lat,
          longitudeMapa: appState.mapPosition.lng,
        };

        await Vue.prototype.$post('/usuario/save', user);
     }
}

export default stateService;