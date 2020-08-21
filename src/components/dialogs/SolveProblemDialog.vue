<template>
  <v-dialog
    v-model="showDialog"
    persistent
    width="420"
  >
    <v-card>
      <v-col
        class="text-center"
        v-show="showFirstQuestionPanel || showCircuitQuestionPanel"
      >
        <v-lazy
          :options="{
            threshold: .6
            }"
          transition="slide-x-transition"
        >
          <div class="ma-0 pa-0">
            <v-img
              src="../../assets/robo.png"
              max-height="100"
              max-width="100"
              class="mx-auto mt-6 mb-6"
            ></v-img>

            <v-row>
              <p class="ml-3 mr-3 mb-10 text-justify SUBTITLE-2 font-weight-bold grey--text text--darken-3">
                {{showFirstQuestionPanel?$vuetify.lang.t('$vuetify.PRIMEIRA_PERGUNTA')
                  :$vuetify.lang.t('$vuetify.CONFIRMAR_SELECAO_CIRCUITO', getObject().nome)}} </p>
            </v-row>
          </div>
        </v-lazy>
      </v-col>

      <v-col
        class="text-center"
        v-show="showVerifyingSignalPanel || showRestartingCircuitPanel"
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

            <v-row justify="center">
              <p class="text-justify ml-3 mr-3 mb-10 SUBTITLE-2 font-weight-bold grey--text text--darken-3">
                {{showVerifyingSignalPanel? verifyingSignalMessage:restartingCircuitMessage}} </p>
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
            <v-img
              src="../../assets/robo.png"
              max-height="100"
              max-width="100"
              class="mx-auto mt-6 mb-6"
            ></v-img>

            <v-row>
              <p class="ml-3 mr-3 mb-10 text-justify SUBTITLE-2 font-weight-bold grey--text text--darken-3">
                {{(showStatusResultPanel && statusOk)?
                  $vuetify.lang.t('$vuetify.SINAL_CIRCUITO_ONLINE'):
                  (showRestartResultPanel && restartOk)?
                  $vuetify.lang.t('$vuetify.SINAL_CIRCUITO_ONLINE_2'):
                  (showRestartResultPanel && !restartOk)?$vuetify.lang.t('$vuetify.RESTART_FALHOU'):
                  $vuetify.lang.t('$vuetify.SINAL_CIRCUITO_OFFLINE')}} </p>
            </v-row>
          </div>
        </v-lazy>
      </v-col>

      <v-col
        class="text-center"
        v-show="showChatQuestions"
      >
        <v-lazy
          :options="{
            threshold: .6
            }"
          transition="slide-x-transition"
        >
          <div class="ma-0 pa-0">
            <v-img
              src="../../assets/robo.png"
              max-height="100"
              max-width="100"
              class="mx-auto mt-6 mb-6"
            ></v-img>

            <v-row>
              <p class="ml-3 mr-3 mb-10 text-justify SUBTITLE-2 font-weight-bold grey--text text--darken-3">
                {{!showOpenIssuePanel?questions[questionIndex]:
                  $vuetify.lang.t('$vuetify.ABRA_CHAMADO')}} </p>
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
          @click="close(); clean();"
          :x-small="$vuetify.breakpoint.xs"
          v-show="!showRestartingCircuitPanel && !(showRestartResultPanel && restartOk)"
        >{{$vuetify.lang.t('$vuetify.FECHAR')}}</v-btn>

        <v-btn
          color="primary"
          text
          :x-small="$vuetify.breakpoint.xs"
          v-show="showRestartingCircuitPanel"
        ></v-btn>

        <v-btn
          color="primary"
          text
          @click="restart"
          :x-small="$vuetify.breakpoint.xs"
          v-show="showStatusResultPanel"
        >{{$vuetify.lang.t('$vuetify.REINICIAR')}}</v-btn>

        <v-btn
          color="primary"
          text
          @click="openIssueDialog"
          :x-small="$vuetify.breakpoint.xs"
          v-show="showOpenIssuePanel || showRestartResultPanel || (showStatusResultPanel && statusOk)"
        >{{$vuetify.lang.t('$vuetify.ABRIR_CHAMADO')}}</v-btn>

        <v-btn
          color="primary"
          text
          @click="close(); clean();"
          :x-small="$vuetify.breakpoint.xs"
          v-show="showRestartResultPanel && restartOk"
        >{{$vuetify.lang.t('$vuetify.ESTA_OK')}}</v-btn>

        <v-btn
          color="primary"
          text
          @click="showFirstQuestionPanel?openChatBot():showCircuitQuestionPanel?showOptionsPanel():nextQuestion()"
          :x-small="$vuetify.breakpoint.xs"
          v-show="showCircuitQuestionPanel || showFirstQuestionPanel || (showChatQuestions && !showOpenIssuePanel)"
        >{{$vuetify.lang.t('$vuetify.SIM')}}</v-btn>

        <v-btn
          color="primary"
          text
          @click="showFirstQuestionPanel?verifySignalPanel():openChatBot()"
          :x-small="$vuetify.breakpoint.xs"
          v-show="showCircuitQuestionPanel || showFirstQuestionPanel || (showChatQuestions && !showOpenIssuePanel)"
        >{{$vuetify.lang.t('$vuetify.NAO')}}</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

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
    showCircuitQuestionPanel: false,
    signalPanelId: 0,
    showOpenIssuePanel: false,
    questionIndex: 0,
    questions: [],
    showChatQuestions: false,
    showVerifyingSignalPanel: false,
    showStatusResultPanel: false,
    showRestartingCircuitPanel: false,
    showRestartResultPanel: false,
    showFirstQuestionPanel: true,
    statusOk: false,
    restartOk: false,
    verifyingSignalMessage: '',
    restartingCircuitMessage: ''
  }),
  created: function () {

    this.verifyingSignalMessage = this.$vuetify.lang.t('$vuetify.VERIFICANDO_SINAL')
    this.restartingCircuitMessage = this.$vuetify.lang.t('$vuetify.COLETANDO_INFORMACOES');

    /*this.questions.push(this.$vuetify.lang.t('$vuetify.PERGUNTA_1'))
    this.questions.push(this.$vuetify.lang.t('$vuetify.PERGUNTA_2'))
    this.questions.push(this.$vuetify.lang.t('$vuetify.PERGUNTA_3'))
    this.questions.push(this.$vuetify.lang.t('$vuetify.PERGUNTA_4'))
    this.questions.push(this.$vuetify.lang.t('$vuetify.PERGUNTA_5'))
    this.questions.push(this.$vuetify.lang.t('$vuetify.PERGUNTA_6'));*/
  },
  methods: {
    showOptionsPanel () {
      this.showCircuitQuestionPanel = false;
      this.showStatusResultPanel = true;
    },
    nextQuestion () {
      this.questionIndex += 1;

      if (this.questionIndex == this.questions.length) {
        this.showOpenIssuePanel = true;
      }
    },
    verifySignalPanel () {

      this.showFirstQuestionPanel = false
      this.showVerifyingSignalPanel = true

      this.signalPanelId = setTimeout(() => {

        if (this.showDialog) {

          this.showVerifyingSignalPanel = true

          this.$get('/circuito/status',
            { desigClient: this.getObject().designacaoCliente }).then((response) => {

              this.showStatusResultPanel = true;
              this.showVerifyingSignalPanel = false;

              if (response && response.data == 3) {
                this.statusOk = true;
                this.getObject().online = response.data //Atualiza o circuito com o status online
                this.showCircuitQuestionPanel = true;
                this.showStatusResultPanel = false;
              } else {
                this.statusOk = false;
              }
            });
        }

      }, 20000);
    },
    openChatBot () {

      if (!this.showCircuitQuestionPanel) {
        this.$showChat()
      }
      this.close();
      this.clean();

      //this.showFirstQuestionPanel = false
      //this.showChatQuestions = true;
    },
    openIssueDialog () {
      this.close();
      this.clean();
      this.openIssue(this.getObject());
    },
    restart () {
      this.showVerifyingSignalPanel = false
      this.showStatusResultPanel = false
      this.showRestartingCircuitPanel = true
      this.showRestartResultPanel = false

      this.$get('/circuito/restart',
        {
          idCircuitoMon: this.getObject().idCircuitoMon
        }).then(() => {

          this.signalPanelId = setInterval(() => {

            this.$get('/circuito/status',
              { desigClient: this.getObject().designacaoCliente }).then((response) => {

                this.showRestartResultPanel = true;
                this.showRestartingCircuitPanel = false;

                if (response && response.data == 3) {
                  this.restartOk = true;
                  this.getObject().online = response.data //Atualiza o circuito com o status online
                } else {
                  this.restartOk = false;
                }
              });

          }, 60000);
        });
    },
    clean () {
      this.showOpenIssuePanel = false
      this.questionIndex = 0;
      this.showChatQuestions = false
      this.showFirstQuestionPanel = true
      this.showVerifyingSignalPanel = false
      this.showStatusResultPanel = false
      this.showRestartingCircuitPanel = false
      this.showRestartResultPanel = false
      this.statusOk = false
      this.restartOk = false
      this.verifyingSignalMessage = this.$vuetify.lang.t('$vuetify.VERIFICANDO_SINAL')
      this.restartingCircuitMessage = this.$vuetify.lang.t('$vuetify.COLETANDO_INFORMACOES')

      clearInterval(this.signalPanelId);
    }
  },
  watch: {

    showVerifyingSignalPanel: function () {

      if (this.showVerifyingSignalPanel) {

        setTimeout(() => {
          this.verifyingSignalMessage = this.$vuetify.lang.t('$vuetify.MAIS_ALGUNS_INSTANTES')
        }, 10000);
      }
    },
    showRestartingCircuitPanel: function () {

      if (this.showRestartingCircuitPanel) {

        setTimeout(() => {
          this.restartingCircuitMessage = this.$vuetify.lang.t('$vuetify.REINICIANDO_CIRCUITO')

          setTimeout(() => {
            this.restartingCircuitMessage = this.$vuetify.lang.t('$vuetify.VERIFICANDO_NOVAMENTE')

            setTimeout(() => {
              this.restartingCircuitMessage = this.$vuetify.lang.t('$vuetify.MAIS_ALGUNS_INSTANTES')
            }, 20000);

          }, 20000);

        }, 20000);
      }
    }
  }
};
</script>