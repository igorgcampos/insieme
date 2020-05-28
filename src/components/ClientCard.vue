<template>
  <v-card
    class="mx-auto"
    max-width="466"
    min-width="300"
  >
    <v-list-item three-line>
      <v-list-item-content>
        <v-list-item-subtitle class="pr-4 subtitle-2 grey--text text--darken-3">
          {{client.nome}}</v-list-item-subtitle>
      </v-list-item-content>

      <v-chip
        label
        class="ma-0 mb-5 mt-1 caption"
        :color="client.clientePai? 'blue': 'green'"
        text-color="white"
        float-right
        small
      >
        {{client.clientePai?'Associado':'Principal'}}
      </v-chip>

    </v-list-item>

    <v-divider class="mx-4"></v-divider>

    <v-card-actions>
      <v-tooltip top>
        <template v-slot:activator="{ on }">
          <v-btn
            text
            color="blue darken-4"
            @click="listarContratos()"
            v-on="on"
          >Contratos</v-btn>
        </template>
        <span>Ver os contratos deste cliente</span>
      </v-tooltip>
    </v-card-actions>
  </v-card>

</template>

<script>
export default {
  data: () => ({
    user: {}
  }),
  methods: {

  },
  props: {
    client: Object
  }
};
</script>
