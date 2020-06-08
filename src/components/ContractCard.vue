<template>
  <v-lazy
    :options="{
          threshold: .6
        }"
    transition="slide-x-transition"
  >
    <v-card
      class="mx-auto"
      max-width="950"
      min-width="330"
      width="950"
    >

      <v-card-title
        class="subtitle-2 grey--text text--darken-3"
        style=" word-break: normal; !important"
      >CONTRATO DA BRASIL TELECOM</v-card-title>

      <v-card-subtitle class="caption">Cód. SAP: C00012-345-4 | Cód. Tpz: ABCDEF</v-card-subtitle>

      <v-divider class="mt-2"></v-divider>

      <v-card-actions>
        <v-tooltip top>
          <template v-slot:activator="{ on }">
            <v-btn
              text
              color="primary"
              @click="gerenciarContratos()"
              v-on="on"
            >{{$vuetify.lang.t('$vuetify.GERENCIAR')}}</v-btn>
          </template>
          <span>{{$vuetify.lang.t('$vuetify.GERENCIAR_CONTRATOS')}}</span>
        </v-tooltip>

        <v-tooltip top>
          <template v-slot:activator="{ on }">
            <v-btn
              text
              color="primary"
              @click="baixarContrato()"
              v-on="on"
            >{{$vuetify.lang.t('$vuetify.BAIXAR')}}</v-btn>
          </template>
          <span>{{$vuetify.lang.t('$vuetify.BAIXAR_CONTRATO')}}</span>
        </v-tooltip>
      </v-card-actions>
    </v-card>
  </v-lazy>
</template>

<script>

//import LabelValue from '../components/LabelValue';
export default {

  data: () => ({

  }),
  components: {
    //LabelValue
  },
  methods: {
    gerenciarContratos () {

    }
  },
  props: {
    contract: Object
  }
};
</script>
