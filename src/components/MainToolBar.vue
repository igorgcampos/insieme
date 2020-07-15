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

    <FaqDialog
      :show="showFaq"
      :close="closeFaq"
    ></FaqDialog>

    <v-tooltip bottom>
      <template v-slot:activator="{ on }">
        <v-chip
          pill
          v-on="on"
          color="red darken-3"
          v-show="canShowShortcut()"
          class="mr-2"
          @click="goTo('circuits')"
        >
          {{$vuetify.lang.t('$vuetify.CIRCUITOS')}}
        </v-chip>
      </template>
      <span>{{$vuetify.lang.t('$vuetify.CIRCUITOS')}}</span>
    </v-tooltip>
    <v-tooltip bottom>
      <template v-slot:activator="{ on }">
        <v-chip
          pill
          v-on="on"
          color="red darken-3"
          v-show="canShowShortcut()"
          class="mr-2"
          @click="goTo('invoices')"
        >
          {{$vuetify.lang.t('$vuetify.NOTAS_FISCAIS')}}
        </v-chip>
      </template>
      <span>{{$vuetify.lang.t('$vuetify.NOTAS_FISCAIS')}}</span>
    </v-tooltip>
    <v-tooltip bottom>
      <template v-slot:activator="{ on }">
        <v-chip
          pill
          v-on="on"
          color="red darken-3"
          v-show="canShowShortcut()"
          class="mr-2"
          @click="goTo('issues')"
        >
          {{$vuetify.lang.t('$vuetify.CHAMADOS')}}
        </v-chip>
      </template>
      <span>{{$vuetify.lang.t('$vuetify.CHAMADOS')}}</span>
    </v-tooltip>

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
          @click="faq()"
        >
          <v-icon v-on="on">mdi-help-box</v-icon>
        </v-btn>
      </template>
      <span>{{$vuetify.lang.t('$vuetify.CENTRAL_AJUDA')}}</span>
    </v-tooltip>

    <v-tooltip bottom>
      <template v-slot:activator="{ on }">
        <v-btn
          icon
          color="white"
          class="ml-2 mr-0"
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

import FaqDialog from '../components/dialogs/FaqDialog';

export default {
  components: {
    FaqDialog
  },
  created: function () {
    this.user = this.$getUser();

    (function (i, s, o, g, r, a, m) { i[r] = { context: { id: '8551dbde3f168db249381597eea81c71' } }; a = o; o = s.createElement(o); o.async = 1; o.src = g; m = s.getElementsByTagName(a)[0]; m.parentNode.insertBefore(o, m); })(window, document, 'script', 'https://js.huggy.chat/widget.min.js?v=8.0.0', 'pwz')

    var vm = this;
    setTimeout(function () { vm.$showChatButton() }, 1000)
  },
  data: () => ({
    user: {},
    showFaq: false
  }),
  methods: {
    goTo (target) {
      this.$root.$emit('go-to', target)
    },
    canShowShortcut () {
      return this.$route.path === '/dashboard'
    },
    closeFaq () {
      this.showFaq = false
    },
    faq () {
      this.showFaq = true
    },
    toContractList () {
      this.$router.push('/contratos')
    },
    toClientsList () {
      window.sessionStorage.setItem('selectedClientId', -1);
      this.$router.push('/clientes')
    },
    canShowContractLink () {
      return this.$route.path === '/clientes' || this.$route.path === '/dashboard'
    },
    canShowClientLink () {
      return this.$hasProfile('Administrador') &&
        (this.$route.path === '/contratos' || this.$route.path === '/dashboard')
    },
    logout () {

      this.$hideChatButton()
      this.$logout().then(() => {
        this.$root.$emit('logout-success')
      })
    }
  },
};
</script>
