<template>

  <v-layout
    column
    align-center
  >

    <v-col
      md="9"
      class="mt-5"
    >
      <div>

        <v-row class="ml-n1">
          <span class="mb-7 text-right display-1 font-weight-bold grey--text text--darken-1">Clientes</span>
        </v-row>

        <v-row
          id="filtro"
          class="pl-0 ml-0 grey lighten-5"
        >
          <v-col cols="4">
            <v-row>
              <span class=" text-right subtitle-2 font-weight-bold grey--text text--lighten-1">Buscar por:</span>
            </v-row>
            <v-row md="2">
              <v-text-field
                v-model.trim="searchText"
                dense
                label="Regular"
                placeholder="Nome ou CNPJ"
                single-line
                solo
                autofocus
                max-width="200"
                append-icon="mdi-magnify"
                @keypress.enter="search()"
              ></v-text-field>
            </v-row>
          </v-col>

          <v-col
            class="ml-5"
            cols="4"
          >
            <v-row>
              <span class=" text-right subtitle-2 font-weight-bold grey--text text--lighten-1">Tipo:</span>
            </v-row>
            <v-row>
              <v-select
                :items="types"
                v-model="type"
                label="Principal ou associado"
                solo
                dense
                @change="search()"
              ></v-select>
            </v-row>
          </v-col>
        </v-row>

        <v-row
          v-scroll="searchMore"
          class="pl-1"
        >
          <v-col
            class="flex-grow-0"
            v-for="(client, i) in clients"
            :key="i"
          >
            <ClientCard :client="client"></ClientCard>
          </v-col>
          <v-col v-if="clients.length == 0">
            <!--<EmptyPanel message="Nenhum cliente encontrado"> </EmptyPanel> -->
          </v-col>
        </v-row>
      </div>

    </v-col>
  </v-layout>

</template>

<script>

import ClientCard from '../components/ClientCard';

export default {
  components: {
    ClientCard
  },
  methods: {
    searchMore () {

      if (document.documentElement.scrollTop > 95) {
        document.getElementById('filtro').style = "position:sticky; z-index:100; top:55px; padding-top:10px;"
      } else if (document.documentElement.scrollTop < 60) {
        document.getElementById('filtro').style = ""
      }

      if (this.isLoding || this.noResult) {
        return;
      }

      this.isLoading = true;
      if (document.documentElement.scrollTop + window.innerHeight >= document.documentElement.scrollHeight) {

        this.page++;
        this.search(this.page);
      }
    },
    search (page) {

      if (!page) {
        this.page = 0
        this.clients = []
        this.noResult = false;
      }

      var selectedType = 0
      if (this.type == this.types[0]) {
        selectedType = 0;
      } else if (this.type == this.types[1]) {
        selectedType = 1;
      } else if (this.type == this.types[2]) {
        selectedType = 2;
      }

      this.$get('/cliente/busca', {
        searchText: this.searchText, clientType: selectedType, page: this.page
      }).then((response) => {

        if (response && response.data.length == 0) {
          this.noResult = true;
        }

        this.clients = this.clients.concat(response.data);
        this.isLoading = false;
      });

    }
  },
  data: () => ({
    types: ['Todos', 'Principal', 'Associados'],
    type: 0,
    page: 0,
    isLoading: true,
    noResult: false,
    searchText: '',
    clients: []
  }),
  created: function () {
    this.$get('/cliente/busca',
      { searchText: '', clientType: 0, page: 0 }).then((response) => {
        this.clients = response.data;
      });

  }
};
</script>
