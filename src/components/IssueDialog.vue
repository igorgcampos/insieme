<template>
  <v-row justify="center">
    <v-dialog
      v-model="showDialog"
      persistent
      max-width="360"
      v-if="getObject()"
    >
      <v-card v-show="!showSuccess">
        <v-card-title
          class="headline-6"
          style="word-break: normal; !important"
        >
          {{getObject().type=='circuit'?
          $vuetify.lang.t('$vuetify.ABRINDO_CHAMADO_CIRCUITO')+getObject().designacaoCliente:
          getObject().type=='invoice'?
          $vuetify.lang.t('$vuetify.ABRINDO_CHAMADO_NOTA')+
          getObject().numero: $vuetify.lang.t('$vuetify.ENCERRANDO_CHAMADO')+getObject().protocolo}}
        </v-card-title>
        <v-card-text class="headline-6">{{$vuetify.lang.t('$vuetify.SELECIONE_MOTIVO_OBSERVACAO')}}</v-card-text>

        <v-col class="mt-n3">

          <v-col
            class="ml-6"
            cols="10"
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
            class="ml-6 mt-n6"
            cols="10"
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
        </v-col>

        <v-divider class="mt-n6"></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="primary"
            text
            @click="close(); cleanFields()"
          >{{$vuetify.lang.t('$vuetify.CANCELAR')}}</v-btn>
          <v-btn
            color="primary"
            text
            @click="send(issue, getObject()); cleanFields()"
            :loading="showDialogLoading"
          >{{$vuetify.lang.t('$vuetify.ENVIAR')}}</v-btn>
        </v-card-actions>
      </v-card>

      <v-card v-show="showSuccess">
        <v-col class="pt-8 mb-8">
          <v-row
            justify="center"
            class="mb-3"
          >
            <v-icon
              size="62"
              color="success"
            >mdi-checkbox-marked-circle</v-icon>
          </v-row>
          <v-row justify="center">
            <span class="text-center headline font-weight-bold grey--text text--darken-3">
              {{getObject().type!='closing'?$vuetify.lang.t('$vuetify.CHAMADO_CRIADO'):
              $vuetify.lang.t('$vuetify.CHAMADO_ENCERRADO')}} </span>

            <span
              v-show="getObject().type!='closing'"
              class="text-center SUBTITLE-2 font-weight-bold grey--text text--darken-3"
            >
              {{$vuetify.lang.t('$vuetify.PROTOCOLO')+': '+getObject().protocolo}} </span>
          </v-row>
        </v-col>
        <v-divider class="mt-n6"></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="primary"
            text
            @click="close(); cleanFields()"
          >{{$vuetify.lang.t('$vuetify.FECHAR')}}</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
export default {
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