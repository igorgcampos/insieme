<template>
  <div class="ma-0 pa-0">

    <v-card
      class="mx-auto"
      min-width="260"
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
              :color="isExpired(contract)?'error':'success'"
              :text-color="isExpired(contract)?'error':'success'"
              small
              outlined
            >
              {{isExpired(contract)?$vuetify.lang.t('$vuetify.EXPIRADO'):$vuetify.lang.t('$vuetify.ATIVO')}}
            </v-chip>
          </v-card-title>

          <v-card-subtitle class="caption">{{$vuetify.lang.t('$vuetify.COD_SAP')}}: {{contract.numeroContratoSap}} |
            {{$vuetify.lang.t('$vuetify.COD_TPZ')}}: {{contract.numeroContratoTpz}}</v-card-subtitle>
        </v-col>
      </v-row>

      <v-row>
        <v-col class="mt-n6 mr-1">
          <v-col class="pa-0 pl-1 ml-3">
            <v-row>
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
            </v-row>

            <v-row>
              <v-chip
                label
                class="caption ml-3 mb-1 mt-2"
                color="blue-grey"
                text-color="blue-grey"
                small
                outlined
                v-if="contract.suporte=='Proativo'"
              >
                {{$vuetify.lang.t('$vuetify.PROATIVO')}}
              </v-chip>
            </v-row>

          </v-col>
        </v-col>

        <v-col class="mt-n12">
          <v-col>
            <LabelValue
              :label="$vuetify.lang.t('$vuetify.GERENTE_PROJETO')"
              :value="contract.gerenteProduto?contract.gerenteProduto:'--'"
              justify="start"
              style="width:150px;"
            ></LabelValue>
          </v-col>
          <v-col class="pt-0 mt-n6">
            <LabelValue
              :label="$vuetify.lang.t('$vuetify.GERENTE_COMERCIAL')"
              :value="contract.gerenteComercial?contract.gerenteComercial:'--'"
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

        <v-col
          class="mt-n12"
          :class="{'col-6 pl-5':$vuetify.breakpoint.xs}"
        >
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
              :label="$vuetify.lang.t('$vuetify.EQUIPAMENTO')"
              :value="contract.produto"
              justify="start"
              truncate
              style="width:150px;"
            ></LabelValue>
          </v-col>
        </v-col>

        <v-col
          class="mt-n12"
          :class="{'pl-0':$vuetify.breakpoint.xs}"
        >
          <v-col>
            <LabelValue
              :label="$vuetify.lang.t('$vuetify.DATA_ASSINATURA')"
              :value="formatDate(contract.dataAssinatura)"
              justify="start"
              style="width:120px;"
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
          :mobile="$vuetify.breakpoint.xs"
          :isText=true
        ></TooltipButton>

        <TooltipButton
          :label="$vuetify.lang.t('$vuetify.BAIXAR')"
          :message="$vuetify.lang.t('$vuetify.BAIXAR_CONTRATO')"
          :event="baixarContrato"
          :loading="isDownloading"
          :mobile="$vuetify.breakpoint.xs"
          :isText=true
          v-if="$hasProfile('Cliente')"
        ></TooltipButton>
      </v-card-actions>
    </v-card>

    <InfoDialog
      :title="$vuetify.lang.t('$vuetify.CONTRATO_NAO_ENCONTRADO')"
      :info="$vuetify.lang.t('$vuetify.CONTRATO_NAO_DIGITALIZADO')"
      :close="closeInfoDialog"
      :dialog="dialog"
    >
    </InfoDialog>

  </div>
</template>

<script>

import LabelValue from '../../components/LabelValue';
import TooltipButton from '../../components/TooltipButton';
import InfoDialog from '../../components/dialogs/InfoDialog';

export default {

  data: () => ({
    isDownloading: false,
    dialog: false
  }),
  components: {
    LabelValue,
    TooltipButton,
    InfoDialog,
  },
  methods: {
    closeInfoDialog () {
      this.dialog = false;
    },
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
    isExpired (contract) {

      if (!contract.dataTermino) return;

      var currentDate
      var renewDateExpired;
      var endDateExpired;

      if (contract.dataReajuste) {
        var renewDate = new Date(contract.dataReajuste.year, contract.dataReajuste.month,
          contract.dataReajuste.day, 0, 0, 0, 0)

        currentDate = new Date();
        renewDateExpired = renewDate < currentDate;
      }

      var endDate = new Date(contract.dataTermino.year, contract.dataTermino.month,
        contract.dataTermino.day, 0, 0, 0, 0)

      currentDate = new Date();
      endDateExpired = endDate < currentDate;

      return endDateExpired && renewDateExpired;
    },
    gerenciarContratos () {
      this.$root.$emit('contract-selected', this.contract)
    },
    baixarContrato () {
      this.isDownloading = true;

      this.$saveOperation({ tipo: 'DOWNLOAD_CONTRATO', usuario: this.$getUser() })

      this.$get('/contrato/download',
        { contractNumber: this.contract.numeroContratoSap }, 'arraybuffer').
        then((response) => {


          if (!response) {
            this.dialog = true;
            this.isDownloading = false;
            return;
          }

          const file = new Blob(
            [response.data],
            { type: 'application/zip' });

          const fileURL = URL.createObjectURL(file);
          var a = document.createElement('a')
          a.href = fileURL
          a.download = this.$vuetify.lang.t('$vuetify.CONTRATOS')
          a.click()

          this.isDownloading = false;
        });
    }
  },
  props: {
    contract: Object
  }
};
</script>
