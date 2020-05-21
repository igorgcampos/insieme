<template>
  <v-app>
    <router-view></router-view>
  </v-app>
</template>

<script>

export default {
  name: 'App',

  created: function () {

    this.$router.beforeEach((to, from, next) => {
      if (to.name !== 'Login' && !this.$isAuthenticated()) next({ name: 'Login' })
      else if (to.name == 'Login' && this.$isAuthenticated()) next({ name: 'Main' })
      else next()
    })

    this.$router.push('/login')
    this.$root.$on('login-success', () => this.$router.push('/'))
    this.$root.$on('logout-success', () => this.$router.push('/login'))
  }
};
</script>
