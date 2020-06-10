<template>

  <v-app-bar
    app
    color="red darken-1"
    dark
  >
    <v-img
      src="../assets/telespazio-logo.png"
      max-height="80"
      max-width="180"
      min-width="50"
      aspect-ratio="5.9"
      class="mx-auto"
    ></v-img>

    <v-spacer></v-spacer>

    <v-tooltip bottom>
      <template v-slot:activator="{ on }">
        <v-chip
          pill
          v-on="on"
          color="red darken-3"
          v-show="canShowContractLink()"
          class="mr-2"
          @click="toContractList()"
        >
          {{$vuetify.lang.t('$vuetify.CONTRATOS')}}
        </v-chip>
      </template>
      <span>{{$vuetify.lang.t('$vuetify.PAGINA_CONTRATOS')}}</span>
    </v-tooltip>

    <v-tooltip bottom>
      <template v-slot:activator="{ on }">
        <v-chip
          pill
          v-on="on"
          color="red darken-3"
          v-show="canShowClientLink()"
          class="mr-2"
          @click="toClientsList()"
        >
          {{$vuetify.lang.t('$vuetify.CLIENTES')}}
        </v-chip>
      </template>
      <span>{{$vuetify.lang.t('$vuetify.PAGINA_CLIENTES')}}</span>
    </v-tooltip>
    <v-menu
      bottom
      right
      transition="slide-x-transition"
      origin="top left"
    >
      <template v-slot:activator="{ on }">
        <v-chip
          pill
          v-on="on"
          color="red darken-3"
        >
          {{$vuetify.lang.t('$vuetify.OLA')}}, {{user.nome}}
        </v-chip>
      </template>
      <v-card width="300">
        <v-list
          color="red darken-3"
          dark
        >
          <v-list-item>
            <v-list-item-content>
              <v-list-item-title>{{user.nome}}</v-list-item-title>
              <v-list-item-subtitle>{{user.email}}</v-list-item-subtitle>
            </v-list-item-content>
            <v-list-item-action>
              <v-btn
                icon
                color="white"
                @click="menu = false"
              >
                <v-icon>mdi-close-circle</v-icon>
              </v-btn>
            </v-list-item-action>
          </v-list-item>
        </v-list>
        <v-list>
          <v-list-item>
            <v-list-item-action>
              <v-icon>mdi-account-multiple</v-icon>
            </v-list-item-action>
            <v-list-item-title>{{$vuetify.lang.t('$vuetify.PERFIS')}}</v-list-item-title>
          </v-list-item>
          <v-list-item
            v-for="perfil in user.perfis"
            :key="perfil"
          >
            <v-subheader>{{perfil}}</v-subheader>
          </v-list-item>
        </v-list>
      </v-card>
    </v-menu>

    <v-tooltip bottom>
      <template v-slot:activator="{ on }">
        <v-btn
          icon
          color="white"
          class="ml-3"
          @click="logout()"
        >
          <v-icon v-on="on">mdi-logout</v-icon>
        </v-btn>
      </template>
      <span>{{$vuetify.lang.t('$vuetify.SAIR')}}</span>
    </v-tooltip>
  </v-app-bar>

</template>

<script>
export default {
  created: function () {
    this.user = this.$getUser()
  },
  data: () => ({
    user: {},
  }),
  methods: {
    toContractList () {
      this.$router.push('/contratos')
    },
    toClientsList () {
      window.sessionStorage.setItem('selectedClientId', -1);
      this.$router.push('/clientes')
    },
    canShowContractLink () {
      return this.$hasProfile('Administrador') && this.$route.path === '/clientes'
    },
    canShowClientLink () {
      return this.$hasProfile('Administrador') && this.$route.path === '/contratos'
    },
    logout () {

      this.$logout().then(() => {
        this.$root.$emit('logout-success')
      })
    }
  },
};
</script>
