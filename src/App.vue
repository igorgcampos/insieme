<template>
  <v-app style="background:#FAFAFA">
    <router-view></router-view>
    <ReportSideBar>
    </ReportSideBar>
  </v-app>
</template>

<style>
::-webkit-scrollbar-track {
  background-color: #fafafa;
}

::-webkit-scrollbar {
  width: 5px;
  height: 10px;
}

::-webkit-scrollbar-thumb {
  background-color: rgba(128, 128, 128, 0.5);
}
</style>
<script>

import ReportSideBar from './components/ReportSideBar'
import SockJS from "sockjs-client";
import Stomp from "webstomp-client";

export default {
  name: 'App',
  components: {
    ReportSideBar
  },
  created: function () {

    this.$router.beforeEach((to, from, next) => {
      if (to.name !== 'Login' && !this.$isAuthenticated()) next({ name: 'Login' })
      else if (to.name == 'Login' && this.$isAuthenticated()) next({ name: 'Main' })
      else next()
    })

    this.setUrlToken().then(() => {

      this.$vuetify.lang.current = window.sessionStorage.getItem("idioma");

      if(!window.sessionStorage.getItem('keyCloakToken')){
        this.$router.push('/login')
      }else{
        this.$router.push('/contratos');
        window.sessionStorage.setItem('actualPage', 'contratos')
      }

      this.$root.$on('login-success', () => {
        this.$router.push('/');
        window.sessionStorage.setItem('actualPage', '/')
      })
      this.$root.$on('logout-success', () => this.$router.push('/login'));
    });

  },
  methods: {
    async setUrlToken () {
      let uri = window.location.search.substring(1);
      let params = new URLSearchParams(uri);

      if (params.get("token")) {
        await this.$setKeycloakToken(params.get("token"))
      }
    },
     closeWebSocket() {
      if (this.stompClient && this.subscription) {
        this.subscription.unsubscribe();
        this.stompClient.disconnect();
      }
    },
    initiateWebSocket() {
      this.socket = new SockJS(
        process.env.VUE_APP_WEBSOCKET_URL + "/websocket-server"
      );
      this.stompClient = Stomp.over(this.socket);
      this.stompClient.debug = () => {};

      this.$getUser().then(user => {

        var channelName = (this.$hasProfile('Administrador')? 
            'admin':user.cliente.nome.toLowerCase().replace(/\s/g, ''))

        this.connect(channelName);
      })
    },
    connect(channelName) {
      this.stompClient.connect(
        {},
        () => {
          this.subscription = this.stompClient.subscribe("/topic/messages/" + channelName, (tick) => {
            var receivedMessage = JSON.parse(tick.body);
            this.$root.$emit(receivedMessage.message, receivedMessage);
          });
        },
        (error) => {
          console.log(error);
          if (!this.loggedOut) {
            this.stompClient.disconnect();
            this.socket = new SockJS(
              process.env.VUE_APP_WEBSOCKET_URL + "/websocket-server"
            );
            this.stompClient = Stomp.over(this.socket);
            this.stompClient.debug = () => {};
            this.connect(channelName);
          }
        }
      );
    },
  }
};
</script>
