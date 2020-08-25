<template>

  <v-dialog
    v-model="showDialog"
    persistent
    max-width="500"
    class="overflow-y-hidden"
  >
    <v-card>
      <v-card-title
        v-if="canShowForm()"
        class="headline-6"
        :class="{'subtitle-2':$vuetify.breakpoint.xs}"
        style="word-break: normal; !important"
      >
        {{title}}
      </v-card-title>
      <v-card-text
        v-if="canShowForm()"
        class="headline-6 mt-n3"
      >{{subtitle}}</v-card-text>

      <v-card-text
        v-if="canShowForm() && this.actionName != 'NOVO_CIRCUITO'"
        class="caption mt-n3 font-weight-bold grey--text"
      >{{'Circuitos selecionados: '+itemList.length}}</v-card-text>

      <v-row
        class="ma-0 d-flex justify-center mb-12 ml-3 mr-3 overflow-y-auto"
        style="max-height:20rem"
      >

        <WarningPanel
          class="mt-8 pt-10"
          :message="$vuetify.lang.t('$vuetify.NENHUM_CIRCUITO_SELECIONADO')"
          v-show="!showSuccess && itemList.length == 0 && actionName != 'NOVO_CIRCUITO'"
        >
        </WarningPanel>

        <SuccessPanel
          v-show="showSuccess"
          :title="$vuetify.lang.t('$vuetify.PEDIDO_ENVIADO')"
          :subtitle="$vuetify.lang.t('$vuetify.PROTOCOLO')+': '+entity.protocolo"
          class="mb-n3"
        >
        </SuccessPanel>

        <v-col
          class="ma-0 pa-0 mt-7"
          cols="10"
          v-show="canShowForm()"
        >
          <v-row>
            <span class=" text-right subtitle-2 font-weight-bold grey--text text--lighten-1">
              {{$vuetify.lang.t('$vuetify.OBSERVACAO')}}:</span>
          </v-row>
          <v-row>
            <v-textarea
              solo
              height="100"
              :no-resize="true"
              rows="5"
              v-model="issue.observation"
            ></v-textarea>
          </v-row>
        </v-col>
      </v-row>
      <v-divider class="mt-n6"></v-divider>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          color="primary"
          text
          @click="close(); cleanFields()"
          :x-small="$vuetify.breakpoint.xs"
        >{{$vuetify.lang.t('$vuetify.FECHAR')}}</v-btn>

        <v-btn
          color="primary"
          text
          @click="send(issue, entity, itemList);"
          :x-small="$vuetify.breakpoint.xs"
          :loading="showDialogLoading"
          v-show="canShowForm()"
        >{{$vuetify.lang.t('$vuetify.ENVIAR')}}</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

</template>

<script>

import WarningPanel from '../../components/panels/WarningPanel';
import SuccessPanel from '../../components/panels/SuccessPanel';

export default {
  components: {
    WarningPanel,
    SuccessPanel,
  },
  props: {
    title: String,
    subtitle: String,
    actionName: String,
    showDialog: Boolean,
    showSuccess: Boolean,
    showDialogLoading: Boolean,
    close: Function,
    send: Function,
    itemList: Array
  },
  methods: {
    canShowForm () {
      return ((this.itemList.length > 0 && this.actionName != 'REMANEJAR') ||
        this.actionName == 'NOVO_CIRCUITO' ||
        (this.itemList.length == 1 && this.actionName == 'REMANEJAR')) && !this.showSuccess
    },
    cleanFields () {
      this.issue.observation = '';
      this.issue.reason = undefined;
      this.shippingAddress = {}
      this.installationAddress = {}
      this.configuration = {}
      this.stationId = {}
    }
  },
  data: () => ({
    taxData: {},
    stationId: {},
    configuration: {},
    shippingAddress: {},
    installationAddress: {},
    issue: { reason: undefined, observation: '' },
    entity: {}
  })
};
</script>