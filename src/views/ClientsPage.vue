<template>

  <v-layout
    column
    align-center
    style="height:100vh;"
  >

    <v-col
      md="7"
      class="mt-5"
    >
      <div>

        <v-row>
          <span class="mb-7 text-right display-1 font-weight-bold grey--text text--darken-1">Clientes</span>
        </v-row>

        <v-row class="pl-1">
          <v-col>
            <v-row>
              <span class=" text-right subtitle-2 font-weight-bold grey--text text--lighten-1">Buscar por:</span>
            </v-row>
            <v-row full-width>
              <v-text-field
                v-model.trim="searchText"
                dense
                label="Regular"
                full-width
                placeholder="Nome ou CNPJ"
                single-line
                solo
                autofocus
                append-icon="mdi-magnify"
              ></v-text-field>
            </v-row>
          </v-col>

          <v-col class="ml-5">
            <v-row>
              <span class=" text-right subtitle-2 font-weight-bold grey--text text--lighten-1">Tipo:</span>
            </v-row>
            <v-row full-width>
              <v-select
                :items="types"
                label="Principal ou associado"
                solo
                dense
              ></v-select>
            </v-row>
          </v-col>
        </v-row>

        <v-row>
          <v-col
            v-for="client in clients"
            :key="client"
          >
            <ClientCard></ClientCard>
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

  },
  data: () => ({
    types: ['Todos', 'Principal', 'Associados'],
    searchText: '',
    clients: [1, 2, 3, 4, 5, 6]
  }),
  created: function () {

  }
};
</script>
