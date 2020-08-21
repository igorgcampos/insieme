<template>
  <v-col class="ma-0 pa-0 mt-0">
    <v-card-title
      class="subtitle-1 font-weight-bold pl-n12 mt-n4"
      :class="{'subtitle-2 ml-n7':$vuetify.breakpoint.xs, 'ml-n11':!$vuetify.breakpoint.xs}"
    >
      {{$vuetify.lang.t('$vuetify.IDENTIFICACAO_ESTACAO')}}
    </v-card-title>
    <v-row>
      <LabelTextField
        cols="5"
        :label="$vuetify.lang.t('$vuetify.DESIGNACAO_CLIENTE')"
        :value="entity.designacao_cliente"
      ></LabelTextField>
      <LabelTextField
        v-if="actionName == 'REMANEJAR'"
        cols="5"
        :label="$vuetify.lang.t('$vuetify.DESIGNACAO_TPZ')"
        :value="entity.designacao_telespazio"
      ></LabelTextField>
      <LabelTextField
        v-if="actionName == 'REMANEJAR'"
        cols="5"
        :label="$vuetify.lang.t('$vuetify.TIPO_REMANEJAMENTO')"
        :value="entity.tipo_remanejamento"
      ></LabelTextField>
      <LabelTextField
        v-if="actionName == 'NOVO_CIRCUITO'"
        cols="5"
        :label="$vuetify.lang.t('$vuetify.VELOCIDADE')"
        :value="entity.velocidade"
      ></LabelTextField>
      <LabelTextField
        v-if="actionName == 'NOVO_CIRCUITO'"
        cols="5"
        :label="$vuetify.lang.t('$vuetify.ANTENA')"
        :value="entity.antena"
      ></LabelTextField>
      <LabelTextField
        v-if="actionName == 'NOVO_CIRCUITO'"
        cols="5"
        label="BUC"
        :value="entity.buc"
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
    actionName: String,
  }
};
</script>