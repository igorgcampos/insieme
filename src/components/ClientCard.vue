<template>
  <v-lazy
    :options="{
          threshold: .6
        }"
    transition="slide-x-transition"
  >
    <v-card
      class="mx-auto"
      max-width="466"
      min-width="300"
    >

      <v-card-title
        class="subtitle-2 grey--text text--darken-3"
        style=" word-break: normal; !important"
      >{{client.nome}}</v-card-title>

      <v-card-subtitle class="caption">CNPJ: {{client.cnpj}}</v-card-subtitle>

      <v-layout
        column
        align-center
      >
        <row class="mb-3">
          <v-chip
            label
            class="caption"
            :color="client.clientePai? 'primary': 'success'"
            :text-color="client.clientePai? 'primary': 'success'"
            small
            outlined
          >
            {{client.clientePai?'Associado':'Principal'}}
          </v-chip>

          <v-tooltip top>
            <template v-slot:activator="{ on }">
              <v-btn
                x-small
                :color="client.clientePai? 'success': 'primary'"
                class="ml-4 text-white"
                v-on="on"
              >{{client.clientePai?'Cliente Principal':'Cliente Associado'}}</v-btn>
            </template>
            <span>{{client.clientePai?'Ir para cliente principal':'Ir para cliente associado'}}</span>
          </v-tooltip>
        </row>

        <div class="mr-2">
          <v-row>
            <LabelValue
              label="Código SAP"
              :value="client.codClienteSap"
              justify="center"
            ></LabelValue>

            <LabelValue
              label="Localização"
              :value="client.municipio+', '+client.estado"
              justify="center"
            ></LabelValue>
          </v-row>

          <v-row class="mt-n1">
            <LabelValue
              label="Endereço"
              :value="client.endereco"
              justify="center"
            ></LabelValue>

            <LabelValue
              label="País"
              :value="client.pais"
              justify="center"
            ></LabelValue>
          </v-row>
        </div>
      </v-layout>

      <v-divider class="mt-2"></v-divider>

      <v-card-actions>
        <v-tooltip top>
          <template v-slot:activator="{ on }">
            <v-btn
              text
              color="primary"
              @click="listarContratos()"
              v-on="on"
            >Contratos</v-btn>
          </template>
          <span>Ver os contratos deste cliente</span>
        </v-tooltip>
      </v-card-actions>
    </v-card>
  </v-lazy>
</template>

<script>

import LabelValue from '../components/LabelValue';
export default {

  data: () => ({
    user: {}
  }),
  components: {
    LabelValue
  },
  methods: {

  },
  props: {
    client: Object
  }
};
</script>
