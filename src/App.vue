<template>
  <v-app
    @login-success="hideLoginPage(true)"
    @logout-success="hideLoginPage(false)"
  >
    <LoginPage v-if="!showMainPage" />
    <MainPage v-if="showMainPage" />
  </v-app>
</template>

<script>
import LoginPage from './components/LoginPage';
import MainPage from './components/MainPage';

export default {
  name: 'App',

  components: {
    LoginPage,
    MainPage
  },

  data: () => ({
    showMainPage: false
  }),
  methods: {
    hideLoginPage (hide) {
      this.showMainPage = hide;
    }
  }
};
</script>
