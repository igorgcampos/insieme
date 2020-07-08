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
              >mdi-robot</v-icon>

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

              <v-row class="justify-center">
                <span class="text-center ml-3 mr-3 mb-10 SUBTITLE-2 font-weight-bold grey--text text--darken-3">
                  {{showVerifyingSignalPanel? verifyingSignalMessage:restartingCircuitMessage}} </span>
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

              <v-row class="justify-center">
                <span class="ml-3 mr-3 mb-10 text-center SUBTITLE-2 font-weight-bold grey--text text--darken-3">
                  {{(showRestartResultPanel && restartOk) || (showStatusResultPanel && statusOk)?
                  $vuetify.lang.t('$vuetify.SINAL_CIRCUITO_ONLINE'):
                  (showRestartResultPanel && !restartOk)?$vuetify.lang.t('$vuetify.RESTART_FALHOU'):
                  $vuetify.lang.t('$vuetify.SINAL_CIRCUITO_OFFLINE')}} </span>
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
              <v-icon
                size="62"
                class="mb-4 mt-8"
                color="primary"
              >{{!showOpenIssuePanel?'mdi-robot':'mdi-emoticon-sad'}}</v-icon>

              <v-row class="justify-center">
                <span class="ml-3 mr-3 mb-10 text-center SUBTITLE-2 font-weight-bold grey--text text--darken-3">
                  {{!showOpenIssuePanel?questions[questionIndex]:
                  $vuetify.lang.t('$vuetify.ABRA_CHAMADO')}} </span>
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
            v-show="showOpenIssuePanel || showRestartResultPanel || (showStatusResultPanel && statusOk)"
          >{{$vuetify.lang.t('$vuetify.ABRIR_CHAMADO')}}</v-btn>

          <v-btn
            color="primary"
            text
            @click="showFirstQuestionPanel?verifySignalPanel():nextQuestion()"
            v-show="showFirstQuestionPanel || (showChatQuestions && !showOpenIssuePanel)"
          >{{$vuetify.lang.t('$vuetify.SIM')}}</v-btn>

          <v-btn
            color="primary"
            text
            @click="openOrCloseChatBot"
            v-show="showFirstQuestionPanel || (showChatQuestions && !showOpenIssuePanel)"
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
    isInitiated: false,
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

    this.questions.push(this.$vuetify.lang.t('$vuetify.PERGUNTA_1'))
    this.questions.push(this.$vuetify.lang.t('$vuetify.PERGUNTA_2'))
    this.questions.push(this.$vuetify.lang.t('$vuetify.PERGUNTA_3'))
    this.questions.push(this.$vuetify.lang.t('$vuetify.PERGUNTA_4'))
    this.questions.push(this.$vuetify.lang.t('$vuetify.PERGUNTA_5'))
    this.questions.push(this.$vuetify.lang.t('$vuetify.PERGUNTA_6'));

    (function (i, s, o, g, r, a, m) { i[r] = { context: { id: '8551dbde3f168db249381597eea81c71' } }; a = o; o = s.createElement(o); o.async = 1; o.src = g; m = s.getElementsByTagName(a)[0]; m.parentNode.insertBefore(o, m); })(window, document, 'script', 'https://js.huggy.chat/widget.min.js?v=8.0.0', 'pwz')

  },
  methods: {
    nextQuestion () {
      this.questionIndex += 1;

      if (this.questionIndex == this.questions.length) {
        this.showOpenIssuePanel = true;
      }
    },
    verifySignalPanel () {

      this.showFirstQuestionPanel = false
      this.showVerifyingSignalPanel = true

      setTimeout(() => {

        if (this.showDialog) {

          this.showVerifyingSignalPanel = true

          this.$get('/circuito/status',
            { desigClient: this.getObject().designacaoCliente }).then((response) => {

              this.showStatusResultPanel = true;
              this.showVerifyingSignalPanel = false;

              if (response && response.data == 3) {
                this.statusOk = true;
                this.getObject().online = response.data //Atualiza o circuito com o status online
              } else {
                this.statusOk = false;
              }
            });
        }

      }, 20000);
    },
    openOrCloseChatBot () {

      if (!this.isInitiated) {
        window.Huggy.init({
          defaultCountry: '+55',
          widget_id: '24845',
          company: "317521",
          contextID: '4a40e11b97d6d86a057e48c12e629743',
          afterLoad: function () {
            window.Huggy.openBox();
          }
        });
        this.isInitiated = true;
      } else {
        window.Huggy.openBox();
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
        {          desigClient: this.getObject().designacaoCliente,
          hubFamily: this.getObject().plataformaSat || '',
          hub: this.getObject().hub || '',
          vsatIdModem: this.getObject().vsatId || ''
        }).then(() => {

          setInterval(() => {

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

          }, 50000);
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
            }, 15000);

          }, 15000);

        }, 15000);
      }
    }
  }
};
</script>