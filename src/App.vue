<template>
  <v-app style="background:#FAFAFA">
    <router-view></router-view>
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
    this.$root.$on('logout-success', () => this.$router.push('/login'));

    (function (i, s, o, g, r, a, m) { i[r] = { context: { id: '8551dbde3f168db249381597eea81c71' } }; a = o; o = s.createElement(o); o.async = 1; o.src = g; m = s.getElementsByTagName(a)[0]; m.parentNode.insertBefore(o, m); })(window, document, 'script', 'https://js.huggy.chat/widget.min.js?v=8.0.0', 'pwz')
  }
};
</script>
