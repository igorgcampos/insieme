<template>

  <div>
    <MainToolBar style="z-index:1001;"></MainToolBar>
    <v-content>
      <v-container
        fluid
        fill-height
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
  updated: function () {
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
