<template>
  <v-col class="ma-0 pa-0 mt-0">
    <v-card-title
      class="subtitle-1 font-weight-bold pl-n12 mt-n4"
      :class="{'subtitle-2 ml-n7':$vuetify.breakpoint.xs, 'ml-n11':!$vuetify.breakpoint.xs}"
    >
      {{$vuetify.lang.t('$vuetify.CONFIGURACAO')}}
    </v-card-title>
    <v-row>
      <LabelTextField
        cols="5"
        :label="$vuetify.lang.t('$vuetify.ENDERECO_GERENCIA')"
        :value="entity.endereco_gerencia"
      ></LabelTextField>
      <LabelTextField
        cols="5"
        label="VLAN"
        :value="entity.vlan"
      ></LabelTextField>
      <LabelTextField
        cols="5"
        :label="$vuetify.lang.t('$vuetify.INTERCONEXAO_TPZ')"
        :value="entity.interconexao_tpz"
      ></LabelTextField>
      <LabelTextField
        cols="5"
        :label="$vuetify.lang.t('$vuetify.WAN_CPE_REDE')"
        :value="entity.wan_cpe_rede"
      ></LabelTextField>
      <LabelTextField
        cols="5"
        :label="$vuetify.lang.t('$vuetify.ENDERECO_LAN')"
        :value="entity.endereco_lan"
      ></LabelTextField>
      <LabelTextField
        cols="5"
        label="Wan cpe host"
        :value="entity.wan_cpe_host"
      ></LabelTextField>
      <LabelTextField
        cols="5"
        label="Loopback cpe"
        :value="entity.loopback_cpe"
      ></LabelTextField>
      <LabelTextField
        cols="5"
        :label="$vuetify.lang.t('$vuetify.ROTAS_SUMARIZADAS')"
        :value="entity.rotas_sumarizadas"
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
  }
};
</script>