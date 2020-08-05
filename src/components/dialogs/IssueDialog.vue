<template>
  <v-row justify="center">
    <v-dialog
      v-model="showDialog"
      persistent
      max-width="350"
      v-if="getObject()"
    >
      <v-card v-show="!showSuccess">
        <v-card-title
          class="headline-6"
          :class="{'subtitle-2':$vuetify.breakpoint.xs}"
          style="word-break: normal; !important"
        >
          {{getObject().type=='circuit'?
          $vuetify.lang.t('$vuetify.ABRINDO_CHAMADO_CIRCUITO',getObject().nome):
          getObject().type=='invoice'?
          $vuetify.lang.t('$vuetify.ABRINDO_CHAMADO_NOTA')+
          getObject().numero: $vuetify.lang.t('$vuetify.ENCERRANDO_CHAMADO')+getObject().protocolo}}
        </v-card-title>
        <v-card-text class="headline-6">{{$vuetify.lang.t('$vuetify.SELECIONE_MOTIVO_OBSERVACAO')}}</v-card-text>

        <v-row class="ma-0 d-flex justify-center mb-3">

          <v-col
            class="ma-0 pa-0"
            cols="9"
          >
            <v-row>
              <span class=" text-right subtitle-2 font-weight-bold grey--text text--lighten-1">
                {{getObject().type=='closing'?$vuetify.lang.t('$vuetify.MOTIVO_ENCERRAMENTO'):
                $vuetify.lang.t('$vuetify.MOTIVO_ABERTURA')}}:</span>
            </v-row>
            <v-row>
              <v-select
                :items="itemList"
                v-model="issue.reason"
                :label="$vuetify.lang.t('$vuetify.SELECIONE_MOTIVO')"
                solo
                dense
              ></v-select>
            </v-row>
          </v-col>

          <v-col
            class="ma-0 pa-0 mt-0"
            cols="9"
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
          >{{$vuetify.lang.t('$vuetify.CANCELAR')}}</v-btn>
          <v-btn
            color="primary"
            text
            @click="send(issue, getObject()); cleanFields()"
            :x-small="$vuetify.breakpoint.xs"
            :loading="showDialogLoading"
          >{{$vuetify.lang.t('$vuetify.ENVIAR')}}</v-btn>
        </v-card-actions>
      </v-card>

      <v-card v-show="showSuccess">
        <SuccessPanel
          :title="getObject().type!='closing'?$vuetify.lang.t('$vuetify.CHAMADO_CRIADO'):
              $vuetify.lang.t('$vuetify.CHAMADO_ENCERRADO')"
          :subtitle="getObject().type!='closing'?$vuetify.lang.t('$vuetify.PROTOCOLO')+': '+getObject().protocolo:undefined"
        >
        </SuccessPanel>

        <v-divider class="mt-n6"></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="primary"
            text
            @click="close(); cleanFields()"
            :x-small="$vuetify.breakpoint.xs"
          >{{$vuetify.lang.t('$vuetify.FECHAR')}}</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>

import SuccessPanel from '../../components/SuccessPanel';

export default {
  components: {
    SuccessPanel,
  },
  props: {
    getObject: Function,
    showDialog: Boolean,
    showSuccess: Boolean,
    showDialogLoading: Boolean,
    close: Function,
    send: Function,
    itemList: Array
  },
  methods: {
    cleanFields () {
      this.issue.observation = '';
      this.issue.reason = undefined;
    }
  },
  data: () => ({
    issue: { reason: undefined, observation: '' }
  })
};
</script>