<template>
  <v-card class="mx-auto mr-12" min-width="290" color="red darken-1" v-show="showCard">
    <v-row justify="center">
      <v-col cols="2" v-show="restartOk != false && restartOk != true">
        <v-progress-circular
          :size="20"
          :width="2"
          color="white"
          indeterminate
          class="mt-11 mb-4 ml-3"
        ></v-progress-circular>
      </v-col>

      <v-col cols="10" class="px-9">
        <v-row justify="center">
          <span class="caption font-weight-black white--text">{{
            circuit.nome
          }}</span>
        </v-row>

        <v-row justify="center" v-show="restartOk != false && restartOk != true">
          <span class="caption font-weight-black white--text">{{
            $vuetify.lang.t("$vuetify.PROTOCOLO") + ': ' + (issue.protocolo || '--')
          }}</span>
        </v-row>

        <v-row justify="center" class="mt-3 mb-3" v-if="restartOk == true">
          <v-icon size="22" color="white">mdi-checkbox-marked-circle</v-icon>
        </v-row>

        <v-row justify="center" class="mt-3 mb-3" v-if="restartOk == false">
          <v-icon size="22" color="white">mdi-close-circle</v-icon>
        </v-row>

        <v-row justify="center" class="mt-1 mb-3">
          <span class="caption white--text">{{
            restartingCircuitMessage
          }}</span>
        </v-row>

        <v-row justify="center" class="mt-1 mb-3" v-if="restartOk == false">
          <span class="caption font-weight-black white--text">{{
            issue.protocolo
          }}</span>
        </v-row>

        <v-row v-if="restartOk != false && restartOk != true">
          <v-progress-linear color="white" v-model="progress" height="10">
            <strong class="caption font-weight-black"
              >{{ Math.ceil(progress) }}%</strong
            >
          </v-progress-linear>
        </v-row>
      </v-col>
    </v-row>

    <v-divider></v-divider>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn
        v-show="restartOk == false || restartOk == true"
        color="white"
        text
        @click="removeCircuit"
        x-small
      >
        {{ $vuetify.lang.t("$vuetify.FECHAR") }}
      </v-btn>
      <v-btn
        v-show="restartOk == true"
        color="white"
        text
        @click="openIssueDialog"
        x-small
      >
        {{ $vuetify.lang.t("$vuetify.ABRIR_CHAMADO") }}
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
export default {
  data: () => ({
    progress: 0,
    restartingCircuitMessage: "",
    signalPanelId: undefined,
    progressBarId: undefined,
    restartOk: undefined,
    issue: undefined,
    showCard: true,
  }),
  methods: {
    openIssueDialog() {
      this.removeCircuit();
      this.$root.$emit('open-issue',this.circuit);
    },
    createRestartOperation() {
      this.$getUser().then(user =>{
        this.$post("/operacao/save", {
        tipo: "RESTART_CIRCUITO",
        referenciaEntidade: this.circuit.nome,
        usuario: user,
      }).then(() => {});
      })
      
    },
    closeRestartIssue (issue) {

      issue.motivoEncerramento = 'Meu problema foi resolvido';
      issue.observacaoEncerramento = 'O robô conseguiu reiniciar o circuito do cliente com sucesso!'
      issue.statusProcessamento = 'Concluído';

      this.$put('/chamado/close', issue).then((response) => {
        this.$root.$emit('close-issue-success', response.data)
      });
    },
    createRestartIssue(){

      this.issue = {
        origem: 'CIRCUITO',
        identificadorOrigem: this.circuit.nome,
        identificadorOrigemSecundario: this.circuit.designacaoCliente,
        motivoAbertura: this.circuit.reason || 'Inoperância',
        observacaoAbertura: this.circuit.observation || 'Criação de incidente via restart de circuito realizado pelo cliente',
        contrato: { id: this.contract.id },
        status: undefined,
      } 

      this.$post('/chamado/create', this.issue).then((response) => {

        if (response.data) {
          this.$root.$emit('new-issue', response.data, this.circuit)
          this.issue = response.data;
        }
      });
    },
    restart() {

      if(this.issue){
        return;
      }

      this.$root.$emit('increase-count');
      this.createRestartIssue();

      this.$get("/circuito/restart", {
        designacao: this.circuit.nome,
      }).then(() => {

        this.createRestartOperation();

        this.signalPanelId = setInterval(() => {
          this.$get("/circuito/status", {
            desigTpz: this.circuit.nome,
          }).then((response) => {

            if (response && response.data == "3") {

              this.restartOk = true;
              this.circuit.online = response.data; //Atualiza o circuito com o status online
              this.closeRestartIssue(this.issue);
              this.restartingCircuitMessage = this.$vuetify.lang.t(
                "$vuetify.SINAL_CIRCUITO_ONLINE_2"
              );

            } else {
              this.restartOk = false;
              this.restartingCircuitMessage = this.$vuetify.lang.t(
                "$vuetify.RESTART_FALHOU",
                this.issue.protocolo
              );
            }

          });
        }, 600000);
      });
    },
    removeCircuit() {
      this.$root.$emit('decrease-count');
      this.showCard = false;
      this.clean();
    },
    clean() {
      this.restartOk = undefined;

      this.restartingCircuitMessage = this.$vuetify.lang.t(
        "$vuetify.COLETANDO_INFORMACOES"
      );

      clearInterval(this.signalPanelId);
      clearInterval(this.progressBarId);
      this.progress = 0;
    },
  },
  props: {
    circuit: Object,
    contract: Object,
  },
  watch: {},
  created: function () {
    this.restartingCircuitMessage = this.$vuetify.lang.t(
      "$vuetify.COLETANDO_INFORMACOES"
    );

    setTimeout(() => {
      this.restartingCircuitMessage = this.$vuetify.lang.t(
        "$vuetify.REINICIANDO_CIRCUITO"
      );

      setTimeout(() => {
        this.restartingCircuitMessage = this.$vuetify.lang.t(
          "$vuetify.VERIFICANDO_NOVAMENTE"
        );

        setTimeout(() => {
          this.restartingCircuitMessage = this.$vuetify.lang.t(
            "$vuetify.MAIS_ALGUNS_INSTANTES"
          );
        }, 150000);
      }, 180000);
    }, 240000);

    this.progressBarId = setInterval(() => {
      if (this.progress >= 100) return;
      this.progress += 1;
    }, 6200);

    this.$root.$on("new-issue", (issue, circuit) => {

      if(!circuit || circuit.nome != this.circuit.nome){
        return;
      }

      this.issue = issue;
    });
  },
  mounted: function(){
    this.restart();
  }
};
</script>
