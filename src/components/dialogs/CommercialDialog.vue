<template>

  <v-dialog
    v-model="showDialog"
    persistent
    :max-width="entityList == 0 && actionName != 'NOVO_CIRCUITO'?400: 700"
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
      >{{'Circuitos selecionados: '+entityList.length}}</v-card-text>

      <v-row
        class="ma-0 d-flex justify-center mb-12 ml-3 mr-3 overflow-y-auto"
        style="max-height:20rem"
      >

        <WarningPanel
          class="mt-8 pt-10"
          :message="$vuetify.lang.t('$vuetify.NENHUM_CIRCUITO_SELECIONADO')"
          v-show="!showSuccess && entityList.length == 0 && actionName != 'NOVO_CIRCUITO'"
        >
        </WarningPanel>

        <SuccessPanel
          v-show="showSuccess"
          :title="$vuetify.lang.t('$vuetify.PEDIDO_ENVIADO')"
          :subtitle="$vuetify.lang.t('$vuetify.PROTOCOLO')+': '+entity.protocolo"
          class="mb-n3"
        >
        </SuccessPanel>

        <v-row v-if="actionName=='NOVO_CIRCUITO'">
          <v-btn
            color="primary"
            dark
            class="mb-2 ml-7"
            x-small
            @click="newLine()"
          >Nova linha</v-btn>
        </v-row>

        <v-data-table
          v-if="canShowForm()"
          :headers="headers"
          :items="entityList"
          dense
          fixed-header
          :height="actionName!='NOVO_CIRCUITO'?260:220"
          class="ml-4 mr-4"
        >
          <template v-slot:item.actions="{ item }">
            <v-icon
              small
              @click="deleteItem(item)"
            >
              mdi-delete
            </v-icon>
          </template>
        </v-data-table>
      </v-row>

      <v-divider class="mt-n12"></v-divider>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          color="primary"
          text
          @click="close(); cleanFields()"
          :x-small="$vuetify.breakpoint.xs"
        >{{$vuetify.lang.t('$vuetify.CANCELAR')}}</v-btn>

        <v-btn
          color="primary"
          text
          @click="send(issue, entity, entityList);"
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
    newLine () {
      this.entityList.push({});
    },
    deleteItem (item) {
      this.entityList.splice(this.entityList.indexOf(item), 1)
    },
    canShowForm () {
      return (this.entityList.length > 0 ||
        this.actionName == 'NOVO_CIRCUITO') && !this.showSuccess
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
    headers: [],
    taxData: {},
    stationId: {},
    configuration: {},
    shippingAddress: {},
    installationAddress: {},
    issue: { reason: undefined, observation: '' },
    entity: {},
    entityList: []
  }),
  watch: {
    itemList: function () {
      this.entityList = this.itemList.map((x) => x)
    }
  },
  created: function () {

    this.headers = [
      { text: '', value: 'actions', sortable: false },
      {
        text: 'Designação Tpz',
        align: 'start',
        sortable: false,
        value: 'nome',
        width: 150
      },
      { text: 'Designação Cliente', value: 'designacaoCliente', sortable: false, width: 200 },
      { text: 'Fat (g)', value: 'fat', sortable: false },
      { text: 'Carbs (g)', value: 'carbs', sortable: false },
      { text: 'Protein (g)', value: 'protein', sortable: false },
      { text: 'Iron (%)', value: 'iron', sortable: false },
    ];
  }
};
</script>