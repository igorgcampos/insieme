<template>

  <v-dialog
    v-model="showDialog"
    persistent
    max-width="400"
    v-if="getObject()"
  >
    <v-card v-show="!showSuccess">
      <v-card-title
        class="headline-6"
        :class="{'subtitle-2':$vuetify.breakpoint.xs}"
        style="word-break: normal; !important"
      >
        {{getObject().type == 'service'?$vuetify.lang.t("$vuetify.ABRINDO_CHAMADO_SERVICOS"): getObject().type=='circuit'?
          $vuetify.lang.t('$vuetify.ABRINDO_CHAMADO_CIRCUITO',getObject().nome):
          getObject().type == 'invoice'?
          $vuetify.lang.t('$vuetify.ABRINDO_CHAMADO_NOTA')+
          getObject().numero: $vuetify.lang.t('$vuetify.ENCERRANDO_CHAMADO')+getObject().protocolo}}
      </v-card-title>
      <v-card-text class="headline-6">{{$vuetify.lang.t('$vuetify.SELECIONE_MOTIVO_OBSERVACAO')}}</v-card-text>

      <v-row class="ma-0 justify-center mb-4">

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
          class="ma-0 pa-0"
          cols="9"
          v-if="getObject().type=='service'"
        >
          <v-row>
            <span class=" text-right subtitle-2 font-weight-bold grey--text text--lighten-1">
              {{$vuetify.lang.t('$vuetify.TELEFONE_SOLICITANTE')}}:</span>
          </v-row>
          <v-row>
           <v-text-field
                v-model.trim="reclaimerPhone"
                dense
                single-line
                solo
                max-width="200"
                v-mask="'(##) ####-####'"
              ></v-text-field>
          </v-row>
        </v-col>

        <v-col
          class="ma-0 pa-0"
          cols="9"
          v-if="getObject().type=='service'"
        >
          <v-row>
            <span class=" text-right subtitle-2 font-weight-bold grey--text text--lighten-1">
              {{$vuetify.lang.t('$vuetify.TELEFONE_CONTATO')}}:</span>
          </v-row>
          <v-row>
            <v-text-field
                v-model.trim="contactPhone"
                dense
                single-line
                solo
                max-width="200"
                v-mask="'(##) ####-####'"
              ></v-text-field>
          </v-row>
        </v-col>

        <v-col
          class="ma-0 pa-0"
          cols="9"
          v-if="getObject().type=='service'"
        >
          <v-row>
            <span class=" text-right subtitle-2 font-weight-bold grey--text text--lighten-1">
              {{'Email'}}:</span>
          </v-row>
          <v-row>
             <v-text-field
                v-model.trim="email"
                dense
                single-line
                solo
                max-width="200"
              ></v-text-field>
          </v-row>
        </v-col>

        <v-col
          class="ma-0 pa-0 mt-0"
          cols="9"
        >
          <v-row>
            <span class=" text-right subtitle-2 font-weight-bold grey--text text--lighten-1">
              {{$vuetify.lang.t('$vuetify.BREVE_DESCRICAO')}}:</span>
          </v-row>
          <v-row>
            <v-textarea
              solo
              height="100"
              :no-resize="true"
              rows="5"
              v-model="issue.observation"
              counter
              maxlength="250"
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
          @click="concatInfosToObservation(); send(issue, getObject()); cleanFields()"
          :x-small="$vuetify.breakpoint.xs"
          :loading="showDialogLoading"
        >{{$vuetify.lang.t('$vuetify.ENVIAR')}}</v-btn>
      </v-card-actions>
    </v-card>

    <v-card v-show="showSuccess">

      <SuccessPanel
        :title="getObject().type!='closing'?$vuetify.lang.t('$vuetify.CHAMADO_CRIADO'):
              $vuetify.lang.t('$vuetify.CHAMADO_ENCERRADO')"
        :subtitle="getObject().type!='closing'?$vuetify.lang.t('$vuetify.PROTOCOLO')+': '+getObject().protocolo:''"
      >
      </SuccessPanel>

      <v-divider class="mt-n6"></v-divider>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          color="primary"
          text
          @click="close(getObject()); cleanFields()"
          :x-small="$vuetify.breakpoint.xs"
        >{{$vuetify.lang.t('$vuetify.FECHAR')}}</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

</template>

<script>

import SuccessPanel from '../../components/panels/SuccessPanel';

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
    concatInfosToObservation(){
      if(this.getObject().type == 'service'){
        this.issue.observation += '\n\n' + 'Telefone Contato: ' + this.contactPhone + 
        '\n\n' + 'Telefone solicitante: ' + this.reclaimerPhone + '\n\n' + 'Email: ' + this.email;
      }
    },
    cleanFields () {
      this.issue.observation = '';
      this.issue.reason = undefined;
    }
  },
  data: () => ({
    issue: { reason: '', observation: '' },
    reclaimerPhone: '',
    contactPhone: '',
    email: '',
  })
};
</script>