<template>

  <v-layout
    column
    align-center
    v-scroll="searchMore"
  >

    <v-col
      cols="12"
      md="9"
      lg="10"
      xl="9"
      sm="12"
      xs="1"
      class="mt-5"
    >
      <div>

        <v-row :class="{'ml-n12':$vuetify.breakpoint.mdAndUp}">
          <span class="mb-7 text-right display-1 font-weight-bold grey--text text--darken-1">
            {{$vuetify.lang.t('$vuetify.CLIENTES')}}</span>
        </v-row>

        <v-row
          id="filtro"
          class="pl-0 ml-1 grey lighten-5"
        >
          <v-col cols="4">
            <v-row>
              <span class=" text-right subtitle-2 font-weight-bold grey--text text--lighten-1">
                {{$vuetify.lang.t('$vuetify.BUSCAR')}}:</span>
            </v-row>
            <v-row md="2">
              <v-text-field
                v-model.trim="searchText"
                dense
                label="Regular"
                :placeholder="$vuetify.lang.t('$vuetify.NOME_CNPJ')"
                single-line
                solo
                max-width="200"
                append-icon="mdi-magnify"
                @click:append="search()"
                @keypress.enter="search()"
              ></v-text-field>
            </v-row>
          </v-col>

          <v-col
            class="ml-5"
            cols="3"
          >
            <v-row>
              <span class=" text-right subtitle-2 font-weight-bold grey--text text--lighten-1">
                {{$vuetify.lang.t('$vuetify.TIPO')}}:</span>
            </v-row>
            <v-row>
              <v-select
                :items="types"
                v-model="type"
                :label="$vuetify.lang.t('$vuetify.TIPOS_CLIENTE')"
                solo
                dense
                item-text="text"
                item-value="value"
                @change="search()"
              ></v-select>
            </v-row>
          </v-col>
        </v-row>

        <v-row class="pl-1">
          <v-col
            :cols="$vuetify.breakpoint.xs?11:$vuetify.breakpoint.xl?3:4"
            class="flex-grow-0"
            v-for="(client, i) in clients"
            :key="i"
          >
            <v-lazy
              :options="{threshold: .6}"
              transition="slide-x-transition"
            >
              <ClientCard :client="client"></ClientCard>
            </v-lazy>
          </v-col>
          <v-col v-if="clients.length == 0 && !isLoading">
            <WarningPanel :message="$vuetify.lang.t('$vuetify.NENHUM_CLIENTE')"> </WarningPanel>
          </v-col>
        </v-row>
      </div>

    </v-col>
  </v-layout>

</template>

<script>

import ClientCard from '../components/cards/ClientCard';
import WarningPanel from '../components/panels/WarningPanel';

export default {
  components: {
    ClientCard,
    WarningPanel
  },
  methods: {
    searchMore () {

      if (this.cameFromCard) {
        return;
      }

      this.stickFilters();

      if (this.isLoding || this.noResult) {
        return;
      }

      if (document.documentElement.scrollTop + window.innerHeight + 1 >= document.documentElement.scrollHeight) {
        this.page++;
        this.search(this.page);
      }
    },
    search (page) {

      this.isLoading = true;
      if (!page) {
        this.page = 0
        this.clients = []
        this.noResult = false;
        this.cameFromCard = false;
      }

      this.$get('/cliente/busca', {
        searchText: this.searchText,
        clientType: this.type,
        page: this.page
      }).then((response) => {

        if (response && response.data.length == 0) {
          this.noResult = true;
        }

        this.clients = this.clients.concat(response.data);
        this.isLoading = false;
      });

    },
    stickFilters () {
      if (document.documentElement.scrollTop > 95) {
        document.getElementById('filtro').style = "position:sticky; z-index:100; top:55px; padding-top:10px;"
      } else if (document.documentElement.scrollTop < 60) {
        document.getElementById('filtro').style = ""
      }
    },
    updateClients (clients) {
      this.clients = []
      this.clients = this.clients.concat(clients);
      this.searchText = '';
      this.cameFromCard = true;
    }
  },
  data: () => ({
    types: [],
    type: 'TODOS',
    page: 0,
    isLoading: true,
    noResult: false,
    cameFromCard: false,
    searchText: '',
    clients: []
  }),
  created: function () {

    this.$get('/cliente/tipos')
      .then((response) => {

        this.types = response.data;

        var vm = this;
        this.types = this.types.map(function (t) {
          return { text: vm.$vuetify.lang.t('$vuetify.' + t), value: t }
        })

      });

    this.$get('/cliente/busca',
      { searchText: '', clientType: 'TODOS', page: 0 }).then((response) => {
        this.clients = response.data;
      });

    var vm = this;
    this.$root.$on('search-clients', (clients) => vm.updateClients(clients))
  }
};
</script>
