<template>
  <div class="mb-10">
    <v-row
      class="mt-n5 mb-n3"
      :class="{'ml-n12':$vuetify.breakpoint.mdAndUp}"
    >
      <span class="mb-7 text-right subtitle-1 font-weight-bold grey--text text--darken-1">
        {{$vuetify.lang.t('$vuetify.CONTRATO_SELECIONADO') + ': '+contract.numeroContratoTpz}} </span>
    </v-row>

    <v-row :class="{'ml-n12':$vuetify.breakpoint.mdAndUp}">
      <span class="mb-7 text-right display-1 font-weight-bold grey--text text--darken-1">
        {{$vuetify.lang.t('$vuetify.CIRCUITOS')}}</span>
      <v-col>
        <v-tooltip bottom>
          <template v-slot:activator="{ on }">
            <v-btn
              icon
              color="grey--text text--darken-1"
              class="ml-1 mt-n2"
              @click="expandPanel()"
            >
              <v-icon v-on="on">{{showPanel?'mdi-arrow-up-drop-circle-outline':
            'mdi-arrow-down-drop-circle-outline'}}</v-icon>
            </v-btn>
          </template>
          <span>{{showPanel?$vuetify.lang.t('$vuetify.ESCONDER'):$vuetify.lang.t('$vuetify.MOSTRAR')}}</span>
        </v-tooltip>
      </v-col>
    </v-row>

    <v-lazy
      :options="{
          threshold: .6
        }"
      transition="slide-x-transition"
    >
      <div
        class="ma-0 pa-0"
        v-show="showPanel"
      >
        <v-row>
          <v-col class="flex-grow-0">
            <CountCard
              :count="counts[0]"
              message="Online"
              color="success--text"
              :func="getOnline"
              :toolTipMessage="$vuetify.lang.t('$vuetify.ONLINE_DESCRICAO')"
            ></CountCard>
          </v-col>

          <v-col class="flex-grow-0">
            <CountCard
              :count="counts[1]"
              message="Offline"
              color="error--text"
              :func="getOffline"
              :toolTipMessage="$vuetify.lang.t('$vuetify.OFFLINE_DESCRICAO')"
            ></CountCard>
          </v-col>

          <v-col class="flex-grow-0">
            <CountCard
              :count="installCounts[0]"
              :message="$vuetify.lang.t('$vuetify.ATIVADO')"
              color="primary--text"
              :func="getActive"
              :toolTipMessage="$vuetify.lang.t('$vuetify.ATIVADO_DESCRICAO')"
            ></CountCard>
          </v-col>

          <v-col class="flex-grow-0">
            <CountCard
              :count="installCounts[1]"
              :message="$vuetify.lang.t('$vuetify.DESATIVADO')"
              color="primary--text"
              :func="getDeactive"
              :toolTipMessage="$vuetify.lang.t('$vuetify.DESATIVADO_DESCRICAO')"
            ></CountCard>
          </v-col>

          <v-col class="flex-grow-0">
            <CountCard
              :count="installCounts[3]"
              :message="$vuetify.lang.t('$vuetify.DESINSTALADO')"
              color="primary--text"
              :func="getUninstall"
              :toolTipMessage="$vuetify.lang.t('$vuetify.DESINSTALADO_DESCRICAO')"
            ></CountCard>
          </v-col>

          <v-col class="flex-grow-0">
            <CountCard
              :count="installCounts[2]"
              :message="$vuetify.lang.t('$vuetify.CANCELADO')"
              color="primary--text"
              :func="getCanceled"
              :toolTipMessage="$vuetify.lang.t('$vuetify.CANCELADO_DESCRICAO')"
            ></CountCard>
          </v-col>
        </v-row>

        <v-row
          id="filtro"
          class="pl-0 ml-0 grey lighten-5 mb-n5 mt-n4"
        >
          <v-col cols="3">
            <v-row>
              <span class=" text-right subtitle-2 font-weight-bold grey--text text--lighten-1">
                {{$vuetify.lang.t('$vuetify.BUSCAR')}}:</span>
            </v-row>
            <v-row md="2">
              <v-text-field
                v-model.trim="searchText"
                dense
                label="Regular"
                :placeholder="$vuetify.lang.t('$vuetify.DESIGNACAO_CLIENTE')"
                single-line
                solo
                max-width="200"
                append-icon="mdi-magnify"
                @keypress.enter="search()"
              ></v-text-field>
            </v-row>
          </v-col>

          <v-col
            class="ml-5"
            cols="3"
          >
            <v-row>
              <span class=" text-right subtitle-2 font-weight-bold grey--text text--lighten-1">
                {{$vuetify.lang.t('$vuetify.STATUS')}}:</span>
            </v-row>
            <v-row>
              <v-select
                :items="statuses"
                v-model="status"
                label="Online/Offline"
                solo
                dense
                @change="search()"
              ></v-select>
            </v-row>
          </v-col>

          <v-col
            class="ml-5"
            cols="3"
          >
            <v-row>
              <span class=" text-right subtitle-2 font-weight-bold grey--text text--lighten-1">
                {{$vuetify.lang.t('$vuetify.PRODUTO')}}:</span>
            </v-row>
            <v-row>
              <v-select
                :items="products"
                v-model="product"
                :label="$vuetify.lang.t('$vuetify.TODOS')"
                solo
                dense
                @change="search()"
              ></v-select>
            </v-row>
          </v-col>

          <v-col
            class="mt-5"
            cols="1"
          >
            <v-tooltip top>
              <template v-slot:activator="{ on }">
                <v-btn
                  class="ml-2 mt-1"
                  dark
                  color="primary"
                  v-on="on"
                  @click="exportCSV()"
                >
                  <v-icon dark>mdi-file-export</v-icon>
                </v-btn>
              </template>
              <span>{{$vuetify.lang.t('$vuetify.EXPORTAR_CSV')}}</span>
            </v-tooltip>
          </v-col>
        </v-row>

        <v-row
          class="pl-2 mt-2"
          style="min-height:150px;"
        >
          <div
            id="circuitId"
            class="pr-2 overflow-y-auto overflow-x-hidden"
            v-scroll:#circuitId="searchMore"
            style="max-height:340px; width:100%;"
          >
            <v-expansion-panels class="ma-1">
              <v-expansion-panel
                v-for="(circuit, i) in circuits"
                :key="i"
                hide-actions
              >
                <v-expansion-panel-header
                  v-slot="{ open }"
                  class="pt-0 pb-0"
                >
                  <v-row
                    align="center"
                    no-gutters
                  >
                    <v-col
                      v-if="!open"
                      cols="2"
                      sm="2"
                    >
                      <v-chip
                        :color="circuit.online==3?'success':'error'"
                        class="ml-0 mr-2"
                        label
                        small
                        outlined
                      >
                        {{ circuit.online==3?'Online':
                  'Offline' }}
                      </v-chip>
                    </v-col>

                    <v-col
                      sm="5"
                      md="6"
                      :class="{'col-sm-8':open, 'col-md-8':open}"
                    >
                      <strong class="font-weight-bold grey--text text--lighten-1 mr-2">
                        {{$vuetify.lang.t('$vuetify.DESIGNACAO_CLIENTE')}}:</strong>
                      <strong
                        class="subtitle-2"
                        v-html="circuit.designacaoCliente"
                      ></strong>
                    </v-col>

                    <v-col
                      sm="5"
                      md="3"
                      v-if="!open"
                    >
                      <strong class="font-weight-bold grey--text text--lighten-1 mr-2">
                        IP:</strong>
                      <strong v-html="circuit.ip || '--'"></strong>
                    </v-col>
                  </v-row>
                </v-expansion-panel-header>

                <v-expansion-panel-content>

                  <v-card-subtitle class="caption mt-n10 ml-n4 mb-2 grey--text text--lighten-1">
                    {{$vuetify.lang.t('$vuetify.DESIGNACAO_TPZ')}}:
                    {{circuit.nome}}
                  </v-card-subtitle>
                  <v-row>
                    <v-col
                      class="mt-n6 mr-5"
                      style="max-width:150px;"
                    >
                      <v-col class="pa-0">
                        <v-chip
                          :color="circuit.online==3?'success':'error'"
                          class="ml-0 mr-2"
                          label
                          small
                          outlined
                        >
                          {{ circuit.online==3?'Online':'Offline' }}
                        </v-chip>
                      </v-col>

                      <v-col
                        class="pa-0 mt-3"
                        style="max-width:150px;"
                      >
                        <v-chip
                          color="primary"
                          class="ml-0 mr-2"
                          label
                          small
                          outlined
                        >
                          {{ $vuetify.lang.t('$vuetify.'+circuit.statusInstalacao) }}
                        </v-chip>
                      </v-col>
                    </v-col>

                    <v-col
                      class="mt-n12"
                      style="max-width:180px;"
                    >
                      <v-col>
                        <LabelValue
                          label="IP"
                          :value="circuit.ip || '--'"
                          justify="start"
                          style="width:150px;"
                        ></LabelValue>
                      </v-col>
                      <v-col class="pt-0 mt-n6">
                        <LabelValue
                          :label="$vuetify.lang.t('$vuetify.DATA_INSTALACAO')"
                          :value="formatDate(circuit.dataInstalacao)"
                          justify="start"
                          style="width:150px;"
                        ></LabelValue>
                      </v-col>
                      <v-col class="pt-0 mt-n6">
                        <LabelValue
                          :label="$vuetify.lang.t('$vuetify.DATA_ATIVACAO')"
                          :value="formatDate(circuit.dataAtivacao)"
                          justify="start"
                          truncate
                          style="width:150px;"
                        ></LabelValue>
                      </v-col>
                    </v-col>

                    <v-col class="mt-n12">
                      <v-col>
                        <LabelValue
                          :label="$vuetify.lang.t('$vuetify.ENDERECO')"
                          :value="getAddress(circuit)"
                          justify="start"
                          truncate
                          style="width:150px;"
                        ></LabelValue>
                      </v-col>
                      <v-col class="pt-0 mt-n6">
                        <LabelValue
                          :label="$vuetify.lang.t('$vuetify.LATITUDE')"
                          :value="circuit.latitude?circuit.latitude.toFixed(4):'--'"
                          justify="start"
                          style="width:150px;"
                        ></LabelValue>
                      </v-col>
                      <v-col class="pt-0 mt-n6">
                        <LabelValue
                          :label="$vuetify.lang.t('$vuetify.LONGITUDE')"
                          :value="circuit.longitude?circuit.longitude.toFixed(4): '--'"
                          justify="start"
                          style="width:150px;"
                        ></LabelValue>
                      </v-col>
                    </v-col>

                    <v-col class="mt-n12">
                      <v-col>
                        <LabelValue
                          :label="$vuetify.lang.t('$vuetify.PRODUTO')"
                          :value="circuit.plataformaSat || '--'"
                          justify="start"
                          truncate
                          style="width:150px;"
                        ></LabelValue>
                      </v-col>
                      <v-col class="pt-0 mt-n6">
                        <LabelValue
                          label="Esno"
                          :value="circuit.esno || '--'"
                          justify="start"
                          style="width:150px;"
                        ></LabelValue>
                      </v-col>
                    </v-col>
                  </v-row>

                  <v-divider class="mt-n3"></v-divider>

                  <v-card-actions class="mb-n2 pb-0">
                    <TooltipButton
                      :label="$vuetify.lang.t('$vuetify.RESOLVER_PROBLEMA')"
                      :message="$vuetify.lang.t('$vuetify.SUPORTE_PROBLEM')"
                      :event="solveProblem"
                      :object="circuit"
                    ></TooltipButton>
                    <!--<TooltipButton
                      :label="$vuetify.lang.t('$vuetify.ABRIR_CHAMADO')"
                      :message="$vuetify.lang.t('$vuetify.ABRIR_CHAMADO')"
                      :event="openIssue"
                      :object="circuit"
                    ></TooltipButton> -->
                  </v-card-actions>
                </v-expansion-panel-content>
              </v-expansion-panel>
            </v-expansion-panels>
          </div>
          <v-col v-if="circuits.length == 0 && !isLoading">
            <EmptyPanel :message="$vuetify.lang.t('$vuetify.NENHUM_CIRCUITO')"> </EmptyPanel>
          </v-col>
        </v-row>

        <IssueDialog
          :showDialog="showDialog"
          :showSuccess="showSuccess"
          :showDialogLoading="showDialogLoading"
          :close="closeDialog"
          :send="sendIssue"
          :getObject="getObject"
          :itemList="reasonList"
        ></IssueDialog>

        <SolveProblemDialog
          :showDialog="showProblemSolveDialog"
          :close="closeProblemSolveDialog"
          :getObject="getObject"
          :openIssue="openIssue"
        ></SolveProblemDialog>
      </div>
    </v-lazy>
  </div>
</template>

<script>

import CountCard from '../components/CountCard'
import EmptyPanel from '../components/EmptyPanel';
import TooltipButton from '../components/TooltipButton';
import LabelValue from '../components/LabelValue';
import IssueDialog from '../components/IssueDialog';
import SolveProblemDialog from '../components/SolveProblemDialog';

export default {
  components: {
    CountCard,
    EmptyPanel,
    TooltipButton,
    LabelValue,
    IssueDialog,
    SolveProblemDialog
  },
  methods: {
    closeProblemSolveDialog () {
      this.showProblemSolveDialog = false
    },
    closeDialog () {
      this.showDialog = false;
      this.showDialogLoading = false;

      setTimeout(() => {
        this.showSuccess = false;
      }, 1000);
    },
    sendIssue (issue, circuit) {

      if (!issue.reason) {
        return;
      }

      this.showDialogLoading = true;

      issue = {
        origem: 'CIRCUITO',
        identificadorOrigem: circuit.nome,
        motivoAbertura: issue.reason,
        observacaoAbertura: issue.observation,
        contrato: { id: this.$props.contract.id }
      }
      this.$post('/chamado/create', issue).then((response) => {

        if (response.data) {

          this.showSuccess = true;
          this.showDialogLoading = false;
          this.$root.$emit('new-issue', response.data)
          circuit.protocolo = response.data.protocolo
        }
      });
    },
    getActive () {
      this.getFromStatusInstall(1)
    },
    getDeactive () {
      this.getFromStatusInstall(2)
    },
    getUninstall () {
      this.getFromStatusInstall(3)
    },
    getCanceled () {
      this.getFromStatusInstall(4)
    },
    getFromStatusInstall (status) {

      if (this.isLoading) {
        return
      }

      this.searchText = '';
      this.page = 0;
      this.isLoading = true;
      this.status = this.statuses[0]
      this.circuits = [];
      this.product = this.products[0]

      this.$get('/circuito/busca', {
        contractNumber: this.$props.contract.numeroContratoTpz,
        searchText: this.searchText,
        onlineStatus: 0,
        installStatus: status,
        productType: 0,
        page: 0
      }).then((response) => {

        if (response && response.data.length == 0) {
          this.noResult = true;
        }

        this.circuits = response.data;
        this.isLoading = false;
      });
    },
    getAddress (circuit) {
      return circuit.endereco + ' ' + circuit.bairro + ' ' + circuit.cidade + ', ' + circuit.uf
    },
    getOnline () {

      if (this.isLoading) {
        return
      }

      this.searchText = '';
      this.page = 0;
      this.isLoading = true;
      this.status = this.statuses[1]
      this.circuits = [];
      this.product = this.products[0]

      this.$get('/circuito/busca', {
        contractNumber: this.$props.contract.numeroContratoTpz, searchText: this.searchText, onlineStatus: 1,
        installStatus: 0, productType: 0, page: 0
      }).then((response) => {

        if (response && response.data.length == 0) {
          this.noResult = true;
        }

        this.circuits = response.data;
        this.isLoading = false;
      });
    },
    getOffline () {

      if (this.isLoading) {
        return
      }

      this.searchText = '';
      this.page = 0;
      this.isLoading = true;
      this.status = this.statuses[2]
      this.circuits = [];
      this.product = this.products[0]

      this.$get('/circuito/busca', {
        contractNumber: this.$props.contract.numeroContratoTpz, searchText: this.searchText,
        onlineStatus: 2,
        installStatus: 0,
        productType: 0,
        page: 0
      }).then((response) => {

        if (response && response.data.length == 0) {
          this.noResult = true;
        }

        this.circuits = response.data;
        this.isLoading = false;
      });
    },
    openIssue (circuit) {
      this.selectedCircuit = circuit;
      this.selectedCircuit.type = 'circuit';
      this.showDialog = true;
    },
    getObject () {
      return this.selectedCircuit;
    },
    solveProblem (circuit) {
      this.selectedCircuit = circuit;
      this.showProblemSolveDialog = true;
    },
    formatDate (date) {

      if (!date) {
        return '--'
      }
      return this.$formatDate(date)
    },
    searchMore () {

      if (this.isLoding || this.noResult) {
        return;
      }

      if (document.getElementById('circuitId').scrollTop + 341 >=
        document.getElementById('circuitId').scrollHeight) {
        this.page++;
        this.search(this.page);
      }
    },
    search (page) {

      this.isLoading = true;

      if (!page) {
        this.page = 0;
        this.noResult = false;
      }

      var selectedStatus = 0
      if (this.status == this.statuses[0]) {
        selectedStatus = 0;
      } else if (this.status == this.statuses[1]) {
        selectedStatus = 1;
      } else if (this.status == this.statuses[2]) {
        selectedStatus = 2;
      }

      var selectedProduct = 0
      if (this.product == this.products[0]) {
        selectedProduct = 0;
      } else if (this.product == this.products[1]) {
        selectedProduct = 1;
      }

      this.$get('/circuito/busca', {
        contractNumber: this.$props.contract.numeroContratoTpz,
        searchText: this.searchText, onlineStatus: selectedStatus,
        installStatus: 0, productType: selectedProduct, page: this.page
      }).then((response) => {

        if (response && response.data.length == 0) {
          this.noResult = true;
        }

        if (!page) {
          this.circuits = []
        }

        this.circuits = this.circuits.concat(response.data);
        this.isLoading = false;
      });

    },
    expandPanel () {
      this.showPanel = !this.showPanel;
    }
  },
  props: {
    contract: Object
  },
  data: () => ({
    showProblemSolveDialog: false,
    showPanel: true,
    showDialogLoading: false,
    reasonList: [],
    showDialog: false,
    showSuccess: false,
    counts: [],
    installCounts: [],
    circuits: [],
    statuses: [],
    products: [],
    product: 0,
    status: 0,
    page: 0,
    isLoading: true,
    noResult: false,
    searchText: '',
    selectedCircuit: undefined
  }),
  created: function () {

    this.reasonList = [this.$vuetify.lang.t('$vuetify.INOPERANCIA'),
    this.$vuetify.lang.t('$vuetify.INTERMITENCIA'),
    this.$vuetify.lang.t('$vuetify.LENTIDAO'),
    this.$vuetify.lang.t('$vuetify.CONFIGURACAO')]

    this.statuses = [this.$vuetify.lang.t('$vuetify.TODOS'),
      'Online',
      'Offline']

    this.products = [this.$vuetify.lang.t('$vuetify.TODOS'), 'Gilat']

    this.$get('/circuito/status/counts',
      { contractNumber: this.$props.contract.numeroContratoTpz }).then((response) => {

        if (response) {
          this.counts = response.data;
        } else {
          this.counts = this.counts.map(() => 0)
        }

        this.isLoading = false;
      });

    this.$get('/circuito/install/counts',
      { contractNumber: this.$props.contract.numeroContratoTpz }).then((response) => {

        if (response) {
          this.installCounts = response.data;
        } else {
          this.installCounts = this.installCounts.map(() => 0)
        }

        this.isLoading = false;
      });

    this.$get('/circuito/busca', {
      contractNumber: this.$props.contract.numeroContratoTpz,
      searchText: '',
      onlineStatus: 0,
      installStatus: 0,
      productType: 0,
      page: 0    })
      .then((response) => {
        this.circuits = response.data;
        this.isLoading = false;
        window.scrollTo(0, 0);
      });
  }
};
</script>
