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

    this.$router.push('/login')
    this.$root.$on('login-success', () => this.$router.push('/'))
    this.$root.$on('logout-success', () => this.$router.push('/login'));
  }
};
</script>
