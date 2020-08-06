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

    if (this.$hasProfile('Administrador')
      && (window.sessionStorage.getItem('actualPage') == 'clients' || window.sessionStorage.getItem('actualPage') == '/')) {
      this.$router.push('/clientes')
    }
    else if (window.sessionStorage.getItem('actualPage') == 'clients') {
      this.$router.push({ name: 'Contracts', params: { client: { id: this.user.cliente.id } } })
    }
    else if (window.sessionStorage.getItem('actualPage') == 'contracts' || window.sessionStorage.getItem('actualPage') == '/') {

      if (!this.user.cliente) {
        this.user.cliente = { id: -1 }
      }
      this.$router.push({ name: 'Contracts', params: { client: { id: this.user.cliente.id } } })
    } else {
      this.$router.push({ name: 'Dashboard', params: { contract: undefined } })
    }

    this.$root.$on('client-selected',
      (client) => {
        window.sessionStorage.setItem('actualPage', 'contracts');
        this.$router.push({ name: 'Contracts', params: { client: client } })
      })

    this.$root.$on('contract-selected',
      (contract) => {
        window.sessionStorage.setItem('actualPage', 'dashboard');
        this.$router.push({ name: 'Dashboard', params: { contract: contract } })
      })
  },
  methods: {
  }
};
</script>
