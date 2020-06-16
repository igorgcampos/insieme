<template>
  <v-lazy
    :options="{
          threshold: .6
        }"
    transition="slide-x-transition"
  >
    <v-card
      class="mx-auto"
      width="720"
    >

      <v-row>
        <v-col>
          <v-card-title
            class="mt-0 pt-0 subtitle-2 grey--text text--darken-3"
            style=" word-break: normal; !important"
          >{{contract.nome}} <v-spacer> </v-spacer>
            <v-chip
              label
              class="caption mb-0 mt-2"
              :color="isExpired(contract.dataTermino)?'error':'success'"
              :text-color="isExpired(contract.dataTermino)?'error':'success'"
              small
              outlined
            >
              {{isExpired(contract.dataTermino)?$vuetify.lang.t('$vuetify.EXPIRADO'):$vuetify.lang.t('$vuetify.ATIVO')}}
            </v-chip>
          </v-card-title>

          <v-card-subtitle class="caption">{{$vuetify.lang.t('$vuetify.COD_SAP')}}: {{contract.numeroContratoSap}} |
            {{$vuetify.lang.t('$vuetify.COD_TPZ')}}: {{contract.numeroContratoTpz}}</v-card-subtitle>
        </v-col>
      </v-row>

      <v-row>
        <v-col class="mt-n6 mr-5">
          <v-col class="pa-0 pl-1">
            <v-chip
              label
              class="caption ml-3 mb-1"
              :color="contract.tipo=='LOCAÇÃO'?'warning':'primary'"
              :text-color="contract.tipo=='LOCAÇÃO'?'warning':'primary'"
              small
              outlined
            >
              {{contract.tipo == 'LOCAÇÃO'?$vuetify.lang.t('$vuetify.LOCACAO'):$vuetify.lang.t('$vuetify.VENDA')}}
            </v-chip>
          </v-col>
        </v-col>

        <v-col class="mt-n12">
          <v-col>
            <LabelValue
              :label="$vuetify.lang.t('$vuetify.GERENTE_PRODUTO')"
              :value="contract.gerenteProduto"
              justify="start"
              style="width:150px;"
            ></LabelValue>
          </v-col>
          <v-col class="pt-0 mt-n6">
            <LabelValue
              :label="$vuetify.lang.t('$vuetify.GERENTE_COMERCIAL')"
              :value="contract.gerenteComercial"
              justify="start"
              style="width:150px;"
            ></LabelValue>
          </v-col>
          <v-col class="pt-0 mt-n6">
            <LabelValue
              :label="$vuetify.lang.t('$vuetify.CLIENTE')"
              :value="getClientName()"
              justify="start"
              truncate
              style="width:150px;"
            ></LabelValue>
          </v-col>
        </v-col>

        <v-col class="mt-n12">
          <v-col>
            <LabelValue
              :label="$vuetify.lang.t('$vuetify.UNIDADE_NEGOCIO')"
              :value="contract.unidadeNegocio"
              justify="start"
              style="max-width:150px;"
            ></LabelValue>
          </v-col>
          <v-col class="pt-0 mt-n6">
            <LabelValue
              :label="$vuetify.lang.t('$vuetify.FAMILIA')"
              :value="contract.familia"
              justify="start"
              truncate
              style="width:150px;"
            ></LabelValue>
          </v-col>
          <v-col class="pt-0 mt-n6">
            <LabelValue
              :label="$vuetify.lang.t('$vuetify.PRODUTO')"
              :value="contract.produto"
              justify="start"
              truncate
              style="width:150px;"
            ></LabelValue>
          </v-col>
        </v-col>

        <v-col class="mt-n12">
          <v-col>
            <LabelValue
              :label="$vuetify.lang.t('$vuetify.DATA_ASSINATURA')"
              :value="formatDate(contract.dataAssinatura)"
              justify="start"
            ></LabelValue>
          </v-col>
          <v-col class="pt-0 mt-n6">
            <LabelValue
              :label="$vuetify.lang.t('$vuetify.DATA_REAJUSTE')"
              :value="formatDate(contract.dataReajuste)"
              justify="start"
            ></LabelValue>
          </v-col>
          <v-col class="pt-0 mt-n6">
            <LabelValue
              :label="$vuetify.lang.t('$vuetify.DATA_TERMINO')"
              :value="formatDate(contract.dataTermino)"
              justify="start"
            ></LabelValue>
          </v-col>
        </v-col>
      </v-row>
      <v-divider class="mt-n4"></v-divider>

      <v-card-actions>
        <TooltipButton
          :label="$vuetify.lang.t('$vuetify.GERENCIAR')"
          :message="$vuetify.lang.t('$vuetify.GERENCIAR_CONTRATOS')"
          :event="gerenciarContratos"
        ></TooltipButton>

        <TooltipButton
          :label="$vuetify.lang.t('$vuetify.BAIXAR')"
          :message="$vuetify.lang.t('$vuetify.BAIXAR_CONTRATO')"
          :event="baixarContrato"
          :loading="isDownloading"
        ></TooltipButton>
      </v-card-actions>
    </v-card>
  </v-lazy>
</template>

<script>

import LabelValue from '../components/LabelValue';
import TooltipButton from '../components/TooltipButton';
export default {

  data: () => ({
    isDownloading: false
  }),
  components: {
    LabelValue,
    TooltipButton
  },
  methods: {
    formatDate (date) {
      return this.$formatDate(date)
    },
    getClientName () {

      if (this.contract.clienteFinal) {
        return this.contract.clienteFinal.nome;
      }

      if (this.contract.clienteAssociado) {
        return this.contract.clienteAssociado.nome;
      }

      if (this.contract.clientePrincipal) {
        return this.contract.clientePrincipal.nome;
      }
    },
    isExpired (date) {

      if (!date) return;

      var actualDate = new Date(date.year, date.month, date.day, 0, 0, 0, 0)
      var currentDate = new Date();
      return actualDate < currentDate;
    },
    gerenciarContratos () {
      this.$root.$emit('contract-selected', this.$props.contract)
    },
    baixarContrato () {
      this.isDownloading = true;
    }
  },
  props: {
    contract: Object
  }
};
</script>
