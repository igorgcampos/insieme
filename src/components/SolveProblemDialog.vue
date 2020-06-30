<template>
  <v-row justify="center">
    <v-dialog
      v-model="showDialog"
      persistent
      width="420"
    >
      <v-card>
        <v-col
          class="text-center"
          v-show="showFirstQuestionPanel"
        >
          <v-lazy
            :options="{
            threshold: .6
            }"
            transition="slide-x-transition"
          >
            <div class="ma-0 pa-0">
              <v-icon
                size="62"
                class="mb-4 mt-8"
                color="primary"
              >mdi-power-plug-off</v-icon>

              <v-row>
                <span
                  justify="center"
                  class="ml-3 mr-3 mb-10 text-center SUBTITLE-2 font-weight-bold grey--text text--darken-3"
                >
                  {{$vuetify.lang.t('$vuetify.PRIMEIRA_PERGUNTA')}} </span>
              </v-row>
            </div>
          </v-lazy>
        </v-col>

        <v-col
          class="text-center"
          v-show="showVerifySignalPanel || showRestartingCircuitPanel"
        >
          <v-lazy
            :options="{
            threshold: .6
            }"
            transition="slide-x-transition"
          >
            <div class="ma-0 pa-0">
              <v-progress-circular
                :size="70"
                :width="7"
                color="red"
                indeterminate
                class="mt-8 mb-4"
              ></v-progress-circular>

              <v-row>
                <span
                  justify="center"
                  class="ml-3 mr-3 mb-10 text-center SUBTITLE-2 font-weight-bold grey--text text--darken-3"
                >
                  {{showVerifySignalPanel?$vuetify.lang.t('$vuetify.VERIFICANDO_SINAL'):
              $vuetify.lang.t('$vuetify.REINICIANDO_CIRCUITO')}} </span>
              </v-row>
            </div>
          </v-lazy>
        </v-col>

        <v-col
          class="text-center"
          v-show="showStatusResultPanel || showRestartResultPanel"
        >
          <v-lazy
            :options="{
            threshold: .6
            }"
            transition="slide-x-transition"
          >
            <div class="ma-0 pa-0">
              <v-icon
                size="62"
                class="mb-4 mt-8"
                :color="(showRestartResultPanel && restartOk) || (showStatusResultPanel && statusOk)?'success':'error'"
              >{{((showRestartResultPanel && restartOk) || (showStatusResultPanel && statusOk))?
              'mdi-checkbox-marked-circle':'mdi-alert-box'}}</v-icon>
              <v-row>
                <span class="ml-3 mr-3 mb-10 text-center SUBTITLE-2 font-weight-bold grey--text text--darken-3">
                  {{(showRestartResultPanel && restartOk) || (showStatusResultPanel && statusOk)?
                  $vuetify.lang.t('$vuetify.SINAL_CIRCUITO_ONLINE'):
                  (showRestartResultPanel && !restartOk)?$vuetify.lang.t('$vuetify.RESTART_FALHOU'):
                  $vuetify.lang.t('$vuetify.SINAL_CIRCUITO_OFFLINE')}} </span>
              </v-row>
            </div>
          </v-lazy>
        </v-col>

        <v-divider class="mt-n6"></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="primary"
            text
            @click="clean(); close();"
          >{{$vuetify.lang.t('$vuetify.FECHAR')}}</v-btn>

          <v-btn
            color="primary"
            text
            @click="restart"
            v-show="showStatusResultPanel && !statusOk"
          >{{$vuetify.lang.t('$vuetify.REINICIAR')}}</v-btn>

          <v-btn
            color="primary"
            text
            @click="openIssueDialog"
            v-show="showRestartResultPanel || (showStatusResultPanel && statusOk)"
          >{{$vuetify.lang.t('$vuetify.ABRIR_CHAMADO')}}</v-btn>

          <v-btn
            color="primary"
            text
            @click="verifySignalPanel"
            v-show="showFirstQuestionPanel"
          >{{$vuetify.lang.t('$vuetify.SIM')}}</v-btn>

          <v-btn
            color="primary"
            text
            @click="openChatBot"
            v-show="showFirstQuestionPanel"
          >{{$vuetify.lang.t('$vuetify.NAO')}}</v-btn>
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
    close: Function,
    openIssue: Function
  },
  data: () => ({
    showVerifySignalPanel: false,
    showStatusResultPanel: false,
    showRestartingCircuitPanel: false,
    showRestartResultPanel: false,
    showFirstQuestionPanel: true,
    statusOk: false,
    restartOk: false
  }),
  methods: {
    verifySignalPanel () {
      this.showFirstQuestionPanel = false
      this.showVerifySignalPanel = true

      setTimeout(() => {

        if (this.showDialog) {

          this.showVerifySignalPanel = true

          this.$get('/circuito/find',
            { circuitId: this.getObject().id }).then((response) => {

              this.showStatusResultPanel = true;
              this.showVerifySignalPanel = false;
              if (response.data == 3) {
                this.statusOk = true;
                this.getObject().online = response.data //Atualiza o circuito com o status online
              } else {
                this.statusOk = false;
              }
            });
        }

      }, 20000);
    },
    openChatBot () {
      this.clean();
      this.close();
    },
    openIssueDialog () {
      this.clean();
      this.close();
      this.openIssue(this.getObject());
    },
    restart () {
      this.showVerifySignalPanel = false
      this.showStatusResultPanel = false
      this.showRestartingCircuitPanel = true
      this.showRestartResultPanel = false

      setTimeout(() => {
        this.$get('/circuito/restart',
          { circuitId: this.getObject().id }).then((response) => {

            this.showRestartResultPanel = true;
            this.showRestartingCircuitPanel = false;
            if (response && response.data == 'OK') {
              this.restartOk = true;
              this.getObject().online = 3 //Atualiza o circuito com o status online
            } else {
              this.restartOk = false;
            }
          });
      }, 2000)
    },
    clean () {
      this.showFirstQuestionPanel = true
      this.showVerifySignalPanel = false
      this.showStatusResultPanel = false
      this.showRestartingCircuitPanel = false
      this.showRestartResultPanel = false
      this.statusOk = false
      this.restartOk = false
    }
  }
};
</script>