<template>
  <v-col class="ma-0 pa-0 mt-0">
    <v-card-title
      class="subtitle-1 font-weight-bold pl-n12 mt-n4"
      :class="{'subtitle-2 ml-n7':$vuetify.breakpoint.xs, 'ml-n11':!$vuetify.breakpoint.xs}"
    >
      {{title}}
    </v-card-title>
    <v-row>
      <LabelTextField
        cols="7"
        :label="$vuetify.lang.t('$vuetify.LOGRADOURO')"
        :value="entity.logradouro"
      ></LabelTextField>
      <LabelTextField
        cols="4"
        :label="$vuetify.lang.t('$vuetify.BAIRRO')"
        :value="entity.bairro"
      ></LabelTextField>
      <LabelTextField
        cols="5"
        :label="$vuetify.lang.t('$vuetify.CIDADE')"
        :value="entity.cidade"
      ></LabelTextField>
      <LabelTextField
        cols="2"
        :label="$vuetify.lang.t('$vuetify.UF')"
        :value="entity.uf"
      ></LabelTextField>
      <LabelTextField
        cols="3"
        :label="$vuetify.lang.t('$vuetify.CEP')"
        :value="entity.cep"
      ></LabelTextField>
      <LabelTextField
        cols="4"
        :label="$vuetify.lang.t('$vuetify.CONTATO')"
        :value="entity.contato"
      ></LabelTextField>
      <LabelTextField
        cols="4"
        :label="$vuetify.lang.t('$vuetify.TELEFONE')"
        :value="entity.telefone"
      ></LabelTextField>
    </v-row>
  </v-col>
</template>

<script>

import LabelTextField from '../../components/LabelTextField';

export default {
  components: {
    LabelTextField
  },
  props: {
    entity: Object,
    title: String
  }
};
</script>