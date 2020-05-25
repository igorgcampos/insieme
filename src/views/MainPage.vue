<template>

  <div>
    <MainToolBar></MainToolBar>
    <v-content>
      <v-container
        fluid
        fill-height
        class="grey lighten-5"
      >

        <router-view></router-view>

      </v-container>
    </v-content>
  </div>
</template>

<script>

import MainToolBar from '../components/MainToolBar';

export default {

  created: function () {
    this.user = this.$getUser()

    if (this.hasProfile('Administrador')) {
      this.$router.push('/clientes')
    }
  },

  methods: {
    hasProfile (profile) {
      for (var index in this.user.perfis) {
        if (this.user.perfis[index] == profile) {
          return true;
        }
      }

      return false;
    }
  },
  components: {
    MainToolBar
  }
};
</script>
