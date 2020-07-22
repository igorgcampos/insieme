<template>

  <v-layout
    column
    align-center
    v-scroll="searchMore"
  >
    <v-col
      cols="12"
      md="9"
      lg="7"
      xl="8"
      sm="12"
      xs="2"
      xm="2"
      class="mt-5"
    >
      <div>

        <v-row :class="{'ml-n12':$vuetify.breakpoint.mdAndUp}">
          <span class="mb-7 text-right display-1 font-weight-bold grey--text text--darken-1">
            {{$vuetify.lang.t('$vuetify.CONTRATOS')}}</span>
        </v-row>

        <v-row
          id="filtro"
          class="pl-0 ml-0 grey lighten-5"
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
                :placeholder="$vuetify.lang.t('$vuetify.NOME_CODIGO')"
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
                :label="$vuetify.lang.t('$vuetify.TIPOS_CONTRATOS')"
                solo
                dense
                @change="search()"
              ></v-select>
            </v-row>
          </v-col>

          <v-col
            class="ml-5"
            cols="3"
          >
            <v-row>
              <span class=" text-right subtitle-2 font-weight-bold grey--text text--lighten-1">
                {{$vuetify.lang.t('$vuetify.STATUS')}}:</span>
            </v-row>
            <v-row>
              <v-select
                :items="statuses"
                v-model="status"
                :label="$vuetify.lang.t('$vuetify.ATIVO_EXPIRADO')"
                solo
                dense
                @change="search()"
              ></v-select>
            </v-row>
          </v-col>
        </v-row>

        <v-row class="pl-1">
          <v-col
            class="flex-grow-0"
            v-for="(contract, i) in contracts"
            :key="i"
          >
            <ContractCard :contract="contract"></ContractCard>
          </v-col>
          <v-col v-if="contracts.length == 0 && !isLoading">
            <EmptyPanel :message="$vuetify.lang.t('$vuetify.NENHUM_CONTRATO')"> </EmptyPanel>
          </v-col>
        </v-row>
      </div>

    </v-col>
  </v-layout>

</template>

<script>

import ContractCard from '../components/ContractCard';
import EmptyPanel from '../components/EmptyPanel';

export default {
  components: {
    ContractCard,
    EmptyPanel
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

      if (this.$hasProfile('Administrador') && !page) {
        this.selectedClient.id = -1;
      }

      this.isLoading = true;
      if (!page) {
        this.page = 0
        this.contracts = []
        this.noResult = false;
        this.cameFromCard = false;
      }

      var selectedType = 0
      if (this.type == this.types[0]) {
        selectedType = 0;
      } else if (this.type == this.types[1]) {
        selectedType = 1;
      } else if (this.type == this.types[2]) {
        selectedType = 2;
      }

      var selectedStatus = 0
      if (this.status == this.statuses[0]) {
        selectedStatus = 0;
      } else if (this.status == this.statuses[1]) {
        selectedStatus = 1;
      } else if (this.status == this.statuses[2]) {
        selectedStatus = 2;
      }

      this.$get('/contrato/busca', {
        searchText: this.searchText, clientId: this.selectedClient.id, type: selectedType,
        status: selectedStatus, page: this.page
      }).then((response) => {

        if (response && response.data.length == 0) {
          this.noResult = true;
        }

        this.contracts = this.contracts.concat(response.data);
        this.isLoading = false;
      });

    },
    stickFilters () {
      if (document.documentElement.scrollTop > 95) {
        document.getElementById('filtro').style = "position:sticky; z-index:100; top:55px; padding-top:10px;"
      } else if (document.documentElement.scrollTop < 60) {
        document.getElementById('filtro').style = ""
      }
    }
  },
  props: {
    client: Object
  },
  data: () => ({
    types: [],
    statuses: [],
    type: 0,
    status: 0,
    page: 0,
    isLoading: true,
    noResult: false,
    searchText: '',
    contracts: [],
    selectedClient: undefined
  }),
  created: function () {

    this.types = [this.$vuetify.lang.t('$vuetify.TODOS'),
    this.$vuetify.lang.t('$vuetify.LOCACAO'),
    this.$vuetify.lang.t('$vuetify.VENDA')]

    this.statuses = [this.$vuetify.lang.t('$vuetify.TODOS'),
    this.$vuetify.lang.t('$vuetify.ATIVO'),
    this.$vuetify.lang.t('$vuetify.EXPIRADO')]

    this.selectedClient = this.$props.client;

    if (!this.selectedClient) {
      if (!window.sessionStorage.getItem('selectedClientId'))
        this.selectedClient = { id: -1 }
      else
        this.selectedClient = { id: window.sessionStorage.getItem('selectedClientId') }
    } else {
      window.sessionStorage.setItem('selectedClientId', this.selectedClient.id);
    }

    this.$get('/contrato/busca',
      { searchText: '', clientId: this.selectedClient.id, type: 0, status: 0, page: 0 }).
      then((response) => {
        this.contracts = response.data;
      });
  }
};
</script>
