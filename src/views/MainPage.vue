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
  components: {
    MainToolBar
  },
  created: function () {
    this.user = this.$getUser()

    if (this.hasProfile('Administrador') && window.sessionStorage.getItem('actualPage') == 'clients') {
      this.$router.push('/clientes')
    } else {
      this.$router.push('/contratos')
    }

    this.$root.$on('client-selected',
      (client) => {
        window.sessionStorage.setItem('actualPage', 'contracts');
        this.$router.push({ name: 'Contracts', params: { client: client } })
      })
  },
  updated: function () {
    if (this.hasProfile('Administrador') && window.sessionStorage.getItem('actualPage') == 'clients') {
      this.$router.push('/clientes')
    } else {
      this.$router.push('/contratos')
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
  }
};
</script>
