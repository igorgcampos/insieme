<template>

  <v-app-bar
    app
    color="red darken-1"
    dark
  >
    <v-img
      v-show="!$vuetify.breakpoint.xs"
      src="../assets/telespazio-logo.png"
      max-height="80"
      max-width="190"
      min-width="130"
      aspect-ratio="5.88"
      class="mx-auto"
    ></v-img>

    <v-img
      v-show="$vuetify.breakpoint.xs"
      src="../assets/telespazio-simbolo.svg"
      min-height="25"
      max-width="20"
      class="mr-7"
    ></v-img>

    <v-spacer></v-spacer>

    <FaqDialog
      :show="showFaq"
      :close="closeFaq"
    ></FaqDialog>

    <v-tooltip
      bottom
      v-if="!$vuetify.breakpoint.xs && !$vuetify.breakpoint.sm"
    >
      <template v-slot:activator="{ on }">
        <v-chip
          pill
          v-on="on"
          color="red darken-3"
          v-show="canShowShortcut() && ($hasProfile('Administrador') || $hasProfile('Cliente') || $hasProfile('Operacional'))"
          class="mr-2"
          @click="goTo('circuits')"
          ref="circuitChip"
        >
          {{$vuetify.lang.t('$vuetify.CIRCUITOS')}}
        </v-chip>
      </template>
      <span>{{$vuetify.lang.t('$vuetify.CIRCUITOS')}}</span>
    </v-tooltip>

    <v-tooltip
      bottom
      v-if="!$vuetify.breakpoint.xs && !$vuetify.breakpoint.sm"
    >
      <template v-slot:activator="{ on }">
        <v-chip
          pill
          v-on="on"
          color="red darken-3"
          v-show="canShowShortcut() && ($hasProfile('Administrador') || $hasProfile('Cliente') || $hasProfile('Financeiro'))"
          class="mr-2"
          @click="goTo('invoices')"
          ref="invoiceChip"
        >
          {{$vuetify.lang.t('$vuetify.FATURAMENTO')}}
        </v-chip>
      </template>
      <span>{{$vuetify.lang.t('$vuetify.FATURAMENTO')}}</span>
    </v-tooltip>

    <v-tooltip
      bottom
      v-if="!$vuetify.breakpoint.xs && !$vuetify.breakpoint.sm"
    >
      <template v-slot:activator="{ on }">
        <v-chip
          pill
          v-on="on"
          color="red darken-3"
          v-show="canShowShortcut() && ($hasProfile('Administrador') || $hasProfile('Cliente') || $hasProfile('Comercial'))"
          class="mr-2"
          @click="goTo('commercial')"
        >
          {{$vuetify.lang.t('$vuetify.COMERCIAL')}}
        </v-chip>
      </template>
      <span>{{$vuetify.lang.t('$vuetify.COMERCIAL')}}</span>
    </v-tooltip>

    <v-tooltip
      bottom
      v-if="!$vuetify.breakpoint.xs && !$vuetify.breakpoint.sm"
    >
      <template v-slot:activator="{ on }">
        <v-chip
          pill
          v-on="on"
          color="red darken-3"
          v-show="canShowShortcut()"
          class="mr-2"
          @click="goTo('issues')"
          ref="issueChip"
        >
          {{$vuetify.lang.t('$vuetify.CHAMADOS')}}
        </v-chip>
      </template>
      <span>{{$vuetify.lang.t('$vuetify.CHAMADOS')}}</span>
    </v-tooltip>

    <v-spacer></v-spacer>

    <v-tooltip
      bottom
      v-if="!$vuetify.breakpoint.xs && !$vuetify.breakpoint.sm"
    >
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

    <v-tooltip
      bottom
      v-if="!$vuetify.breakpoint.xs && !$vuetify.breakpoint.sm"
    >
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

    <v-tooltip
      bottom
      v-if="!$vuetify.breakpoint.xs && !$vuetify.breakpoint.sm"
    >
      <template v-slot:activator="{ on }">
        <v-chip
          pill
          v-on="on"
          color="red darken-3"
          v-show="canShowAdminLink()"
          class="mr-2"
          @click="toProactivePage()"
        >
          {{$vuetify.lang.t('$vuetify.ADMINISTRACAO')}}
        </v-chip>
      </template>
      <span>{{$vuetify.lang.t('$vuetify.PAGINA_ADMINISTRACAO')}}</span>
    </v-tooltip>

    <v-menu
      bottom
      right
      transition="slide-x-transition"
      origin="top left"
      :close-on-click="true"
      :close-on-content-click="false"
    >
      <template v-slot:activator="{ on: menu, attrs }">
        <v-tooltip bottom>
          <template v-slot:activator="{ on: tooltip }">
            <v-chip
              pill
              color="red darken-3"
              :class="{'caption pl-0':$vuetify.breakpoint.xs}"
              class="pa-5"
              v-bind="attrs"
              v-on="{ ...tooltip, ...menu }"
            >
              {{!$vuetify.breakpoint.xs?$vuetify.lang.t('$vuetify.OLA') + ', '+user.nome:''}}

              <v-badge
                :content="newNotificationsCount == 0? '0':newNotificationsCount"
                :value="true"
                color="red"
                overlap
                offset-x="9"
                offset-y="12"
                class="ml-4 mt-0"
              >
                <v-icon medium>
                  mdi-bell-ring
                </v-icon>
              </v-badge>
            </v-chip>

          </template>
          <span class="mt-6">{{newNotificationsCount == 0?$vuetify.lang.t('$vuetify.SEM_NOTIFICACOES', newNotificationsCount):
              newNotificationsCount == 1?$vuetify.lang.t('$vuetify.NOVA_NOTIFICACAO', newNotificationsCount):
              $vuetify.lang.t('$vuetify.NOVAS_NOTIFICACOES', newNotificationsCount)}}</span>
        </v-tooltip>
      </template>

      <v-card
        width="300"
        height="450"
        style="overflow-y:hidden;"
      >
        <v-list
          color="red darken-3"
          dark
        >
          <v-list-item>
            <v-list-item-content>
              <v-list-item-title>{{user.nome}}</v-list-item-title>
              <v-list-item-subtitle>{{user.email}}</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </v-list>

        <v-tabs
          v-model="tab"
          centered
          color="red accent-4"
          icons-and-text
        >
          <v-tabs-slider></v-tabs-slider>

          <v-tab
            href="#tab-1"
            class="caption"
          >
            {{$vuetify.lang.t('$vuetify.NOTIFICACOES')}}
            <v-icon>mdi-bell-ring</v-icon>
          </v-tab>

          <v-tab
            href="#tab-2"
            class="caption"
          >
            {{$vuetify.lang.t('$vuetify.PERFIS')}}
            <v-icon>mdi-account-multiple</v-icon>
          </v-tab>

        </v-tabs>

        <v-tabs-items v-model="tab">
          <v-tab-item value="tab-1">
            <NotificationList
              :notifications="notifications"
              :removeFunction="removeNotification"
              :viewFunction="viewNotification"
            ></NotificationList>
          </v-tab-item>

          <v-tab-item value="tab-2">
            <v-list style="overflow-y:auto;">
              <v-list-item
                v-for="perfil in user.perfis"
                :key="perfil"
              >
                <v-subheader>{{perfil}}</v-subheader>
              </v-list-item>
            </v-list>
          </v-tab-item>
        </v-tabs-items>
      </v-card>
    </v-menu>

    <v-menu
      transition="slide-x-transition"
      bottom
      right
      v-show="$vuetify.breakpoint.xs || $vuetify.breakpoint.sm"
    >
      <template v-slot:activator="{ on, attrs }">
        <v-btn
          color="white"
          v-bind="attrs"
          v-on="on"
          icon
          v-show="$vuetify.breakpoint.xs  || $vuetify.breakpoint.sm"
        >
          <v-icon v-on="on">mdi-menu</v-icon>
        </v-btn>
      </template>

      <v-list>
        <v-list-item
          v-show="canShowShortcut()"
          @click="goTo('circuits')"
          ref="circuitItem"
        >
          <v-list-item-title>{{$vuetify.lang.t('$vuetify.CIRCUITOS')}}</v-list-item-title>
        </v-list-item>

        <v-list-item
          v-show="canShowShortcut()"
          @click="goTo('invoices')"
          ref="invoiceItem"
        >
          <v-list-item-title>{{$vuetify.lang.t('$vuetify.FATURAMENTO')}}</v-list-item-title>
        </v-list-item>

        <v-list-item
          v-show="canShowShortcut()"
          @click="goTo('commercial')"
        >
          <v-list-item-title>{{$vuetify.lang.t('$vuetify.COMERCIAL')}}</v-list-item-title>
        </v-list-item>

        <v-list-item
          v-show="canShowShortcut()"
          @click="goTo('issues')"
          ref="issueItem"
        >
          <v-list-item-title>{{$vuetify.lang.t('$vuetify.CHAMADOS')}}</v-list-item-title>
        </v-list-item>

        <v-divider v-show="canShowShortcut()"></v-divider>

        <v-list-item
          v-show="canShowContractLink()"
          @click="toContractList()"
        >
          <v-list-item-title>{{$vuetify.lang.t('$vuetify.CONTRATOS')}}</v-list-item-title>
        </v-list-item>

        <v-list-item
          v-show="canShowClientLink()"
          @click="toClientsList()"
        >
          <v-list-item-title>{{$vuetify.lang.t('$vuetify.CLIENTES')}}</v-list-item-title>
        </v-list-item>

        <v-list-item
          v-show="canShowAdminLink()"
          @click="toProactivePage()"
        >
          <v-list-item-title>{{$vuetify.lang.t('$vuetify.ADMINISTRACAO')}}</v-list-item-title>
        </v-list-item>
      </v-list>
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
          @click="showReport()"
          v-show="canShowReport()"
        >
          <v-icon v-on="on">mdi-chart-bar</v-icon>
        </v-btn>
      </template>
      <span>{{$vuetify.lang.t('$vuetify.RELATORIO')}}</span>
    </v-tooltip>

    <ApplicationsMenu v-if="$hasProfile('Administrador')"></ApplicationsMenu>

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
import NotificationList from '../components/NotificationList';
import ApplicationsMenu from '../components/ApplicationsMenu';

export default {
  components: {
    FaqDialog,
    NotificationList,
    ApplicationsMenu,
  },
  created: function () {

    this.user = this.$getUser();

    (function (i, s, o, g, r, a, m) { i[r] = { context: { id: '8551dbde3f168db249381597eea81c71' } }; a = o; o = s.createElement(o); o.async = 1; o.src = g; m = s.getElementsByTagName(a)[0]; m.parentNode.insertBefore(o, m); })(window, document, 'script', 'https://js.huggy.chat/widget.min.js?v=8.0.0', 'pwz')

    var vm = this;
    setTimeout(function () { vm.$showChatButton() }, 2000)

    if (!this.user.cliente) {
      return
    }

    this.$get('/notificacao/busca', { clientId: this.$getUser().cliente.id }).
      then(response => {

        this.notifications = response.data;
        this.newNotificationsCount = this.notifications.filter(note => note.visualizado == false).length
        this.notifications.sort(function (a, b) {


          if (a.visualizado) {
            return 1
          }

          if (a.visualizado === b.visualizado) {
            return 0
          }

          return -1
        })
      });

    this.$root.$on('remove-notification', (notification) => vm.removeNotification(notification))
  },
  data: () => ({
    user: {},
    showFaq: false,
    notifications: [],
    newNotificationsCount: 0,
    tab: 'null',
  }),
  methods: {
    removeNotification (notification, event) {

      if (event)
        event.stopPropagation();

      this.$delete('/notificacao/delete', { notificationId: notification.id }).
        then(response => {

          if (response.data) {
            this.notifications = this.notifications.filter(note => {
              return note.id != notification.id
            });
            this.newNotificationsCount = this.notifications.filter(note => note.visualizado == false).length
          }

          this.$forceUpdate()
        })

    },
    viewNotification (notification) {

      this.$router.push({ name: 'Dashboard', params: { contract: notification.contrato } })

      setTimeout(() => {

        if (notification.tipo == 'NOVA_NOTA_FISCAL' || notification.tipo == 'NOTA_FISCAL_CANCELADA') {
          if (!this.$vuetify.breakpoint.xs)
            this.$refs.invoiceChip.click();
          if (this.$vuetify.breakpoint.xs)
            this.$refs.invoiceItem.click();

          this.$root.$emit(notification.tipo == 'NOVA_NOTA_FISCAL' ? 'search-invoice' :
            'search-canceled-invoice', notification.mensagem)
        } else if (notification.tipo == 'CIRCUITO_OFFLINE') {

          if (!this.$vuetify.breakpoint.xs)
            this.$refs.circuitChip.click();
          if (this.$vuetify.breakpoint.xs)
            this.$refs.circuitItem.click();

          this.$root.$emit('search-circuit', notification.mensagem)

        } else {

          if (!this.$vuetify.breakpoint.xs)
            this.$refs.issueChip.click();
          if (this.$vuetify.breakpoint.xs)
            this.$refs.issueItem.click();
          this.$root.$emit('open-feedback', notification)
        }
      }, 400)


      if (notification.visualizado) {
        return;
      }

      this.$get('/notificacao/visualizar', { notificationId: notification.id }).
        then(() => {

          notification.visualizado = true;
          this.newNotificationsCount = this.notifications.filter(note => note.visualizado == false).length
        })
    },
    showReport () {
      this.$root.$emit('report')
      this.$hideChatButton();
    },
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
      window.sessionStorage.setItem('actualPage', 'contracts');
      this.$router.push('/contratos')
    },
    toClientsList () {
      window.sessionStorage.setItem('actualPage', 'clients');
      window.sessionStorage.setItem('selectedClientId', -1);
      this.$router.push('/clientes')
    },
    toProactivePage () {
      window.sessionStorage.setItem('actualPage', 'administracao');
      this.$router.push('/administracao')
    },
    canShowContractLink () {
      return this.$route.path === '/clientes' ||
        this.$route.path === '/dashboard' ||
        this.$route.path === '/administracao'
    },
    canShowAdminLink () {
      return this.$hasProfile('Administrador')
        && this.$route.path !== '/dashboard'
        && this.$route.path !== '/administracao'
    },
    canShowReport () {
      return this.$route.path === '/dashboard'
    },
    canShowClientLink () {
      return this.$hasProfile('Administrador') &&
        (this.$route.path === '/contratos' ||
          this.$route.path === '/dashboard' ||
          this.$route.path === '/administracao')
    },
    logout () {

      window.sessionStorage.setItem('contractSelected', 'false');
      this.$saveOperation({ tipo: 'LOGOUT', usuario: this.$getUser() })

      this.$logout().then(() => {
        this.$root.$emit('logout-success')
        this.$hideChatButton()
      })
    }
  },
};
</script>
