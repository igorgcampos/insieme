<template>
  <div>
    <v-app-bar
      color="red darken-1"
      dark
    >
      <v-img
        src="../assets/telespazio-logo.png"
        max-height="80"
        max-width="180"
        aspect-ratio="5.9"
        class="mx-auto"
      ></v-img>

      <v-spacer></v-spacer>

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
            Olá {{user.nome}}
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
              <v-list-item-title>Perfis</v-list-item-title>
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
        <span>Sair</span>
      </v-tooltip>
    </v-app-bar>
  </div>

</template>

<script>
export default {
  created: function () {
    this.user = this.$getUser()
  },
  data: () => ({
    user: {}
  }),
  methods: {
    logout () {

      this.$logout().then(() => {
        this.$root.$emit('logout-success')
      }).catch(function (error) {
        console.log(error)
      })
    }
  }
};
</script>
