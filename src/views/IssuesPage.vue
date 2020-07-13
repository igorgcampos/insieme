<template>
  <div>
    <v-row
      id="issues"
      :class="{'ml-n12':$vuetify.breakpoint.mdAndUp}"
    >
      <span class="mb-7 text-right display-1 font-weight-bold grey--text text--darken-1">
        {{$vuetify.lang.t('$vuetify.CHAMADOS')}}</span>

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
              :message="$vuetify.lang.t('$vuetify.EM_ABERTO')"
              color="success--text"
              :func="getOpened"
            ></CountCard>
          </v-col>
          <v-col class="flex-grow-0">
            <CountCard
              :count="0"
              :message="$vuetify.lang.t('$vuetify.EM_ANDAMENTO')"
              color="warning--text"
              :func="getClosed"
            ></CountCard>
          </v-col>
          <v-col class="flex-grow-0">
            <CountCard
              :count="counts[1]"
              :message="$vuetify.lang.t('$vuetify.ENCERRADOS')"
              color="primary--text"
              :func="getClosed"
            ></CountCard>
          </v-col>
        </v-row>

        <v-row
          id="filtro"
          class="pl-0 ml-0 grey lighten-5 mb-n5 mt-2"
        >
          <v-col cols="4">
            <v-row>
              <span class=" text-right subtitle-2 font-weight-bold grey--text text--lighten-1">
                {{$vuetify.lang.t('$vuetify.BUSCAR')}}:</span>
            </v-row>
            <v-row md="2">
              <v-text-field
                v-model.trim="searchText"
                dense
                label="Regular"
                :placeholder="$vuetify.lang.t('$vuetify.PROTOCOLO')"
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
            cols="4"
          >
            <v-row>
              <span class=" text-right subtitle-2 font-weight-bold grey--text text--lighten-1">
                {{$vuetify.lang.t('$vuetify.STATUS')}}:</span>
            </v-row>
            <v-row>
              <v-select
                :items="statuses"
                v-model="status"
                :label="$vuetify.lang.t('$vuetify.EM_ABERTO_ENCERRADO')"
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
            <v-btn
              class="ml-2 mt-1"
              dark
              color="primary"
              @click="test()"
            >
              {{$vuetify.lang.t('$vuetify.ABRIR_CHAMADO')}}
            </v-btn>
          </v-col>
        </v-row>

        <v-row
          class="pl-2 mt-2"
          style="min-height:150px;"
        >
          <div
            id="issueId"
            class="pr-2 overflow-y-auto overflow-x-hidden"
            v-scroll:#issueId="searchMore"
            style="max-height:340px; width:100%;"
          >
            <v-expansion-panels class="ma-1">
              <v-expansion-panel
                v-for="(issue, i) in issues"
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
                        :color="issue.status==1?'success':'primary'"
                        class="ml-0 mr-2"
                        label
                        small
                        outlined
                      >
                        {{ issue.status==1?$vuetify.lang.t('$vuetify.EM_ABERTO'):
                  $vuetify.lang.t('$vuetify.ENCERRADO') }}
                      </v-chip>
                    </v-col>

                    <v-col
                      sm="5"
                      md="4"
                    >
                      <strong class="font-weight-bold grey--text text--lighten-1 mr-2">
                        {{$vuetify.lang.t('$vuetify.PROTOCOLO')}}:</strong>
                      <strong
                        class="subtitle-2"
                        v-html="issue.protocolo"
                      ></strong>
                    </v-col>

                    <v-col
                      sm="5"
                      md="5"
                      v-if="!open"
                    >
                      <strong class="font-weight-bold grey--text text--lighten-1 mr-2">
                        {{issue.status==1?$vuetify.lang.t('$vuetify.DATA_ABERTURA')+':':
                    $vuetify.lang.t('$vuetify.DATA_ENCERRAMENTO')+':'}}</strong>

                      <strong>{{issue.status==1?formatDate(issue.dataAbertura):
                  formatDate(issue.dataEncerramento)}}</strong>
                    </v-col>
                  </v-row>
                </v-expansion-panel-header>

                <v-expansion-panel-content>

                  <v-card-subtitle class="caption mt-n10 ml-n4 mb-2 grey--text text--lighten-1">
                    {{$vuetify.lang.t('$vuetify.ORIGEM')}}:
                    {{$vuetify.lang.t('$vuetify.'+issue.origem) + ' ('+issue.identificadorOrigem+')'}}
                  </v-card-subtitle>

                  <v-row>
                    <v-col
                      class="mt-n6 mr-5"
                      style="max-width:150px;"
                    >
                      <v-col class="pa-0">
                        <v-chip
                          :color="issue.status==1?'success':'primary'"
                          class="ml-0 mr-2"
                          label
                          small
                          outlined
                        >
                          {{ issue.status==1?$vuetify.lang.t('$vuetify.EM_ABERTO'):
                  $vuetify.lang.t('$vuetify.ENCERRADO') }}
                        </v-chip>
                      </v-col>
                    </v-col>

                    <v-col
                      class="mt-n3"
                      style="max-width:180px;"
                    >
                      <v-col class="pt-0 mt-n6">
                        <LabelValue
                          :label="$vuetify.lang.t('$vuetify.DATA_ABERTURA')"
                          :value="formatDate(issue.dataAbertura)"
                          justify="start"
                          style="width:150px;"
                        ></LabelValue>
                      </v-col>
                      <v-col class="pt-0 mt-n6">
                        <LabelValue
                          :label="$vuetify.lang.t('$vuetify.DATA_ENCERRAMENTO')"
                          :value="formatDate(issue.dataEncerramento)"
                          justify="start"
                          style="width:150px;"
                        ></LabelValue>
                      </v-col>
                    </v-col>

                    <v-col class="mt-n12">
                      <v-col>
                        <LabelValue
                          :label="$vuetify.lang.t('$vuetify.MOTIVO_ABERTURA')"
                          :value="issue.motivoAbertura"
                          justify="start"
                          style="width:150px;"
                        ></LabelValue>
                      </v-col>
                      <v-col class="pt-0 mt-n6">
                        <LabelValue
                          :label="$vuetify.lang.t('$vuetify.MOTIVO_ENCERRAMENTO')"
                          :value="issue.motivoEncerramento || '--'"
                          justify="start"
                          style="width:150px;"
                        ></LabelValue>
                      </v-col>
                    </v-col>

                    <v-col class="mt-n12">
                      <v-col>
                        <LabelValue
                          :label="$vuetify.lang.t('$vuetify.OBSERVACAO_ABERTURA')"
                          :value="issue.observacaoAbertura || '--'"
                          justify="start"
                          truncate
                          style="width:150px;"
                        ></LabelValue>
                      </v-col>
                      <v-col class="pt-0 mt-n6">
                        <LabelValue
                          :label="$vuetify.lang.t('$vuetify.OBSERVACAO_ENCERRAMENTO')"
                          :value="issue.observacaoEncerramento || '--'"
                          justify="start"
                          truncate
                          style="width:150px;"
                        ></LabelValue>
                      </v-col>
                    </v-col>
                  </v-row>

                  <v-divider
                    class="mt-n3"
                    v-show="issue.status==1"
                  ></v-divider>

                  <v-card-actions
                    class="mb-n2 pb-0"
                    v-show="issue.status==1"
                  >
                    <TooltipButton
                      :label="$vuetify.lang.t('$vuetify.ENCERRAR_CHAMADO')"
                      :message="$vuetify.lang.t('$vuetify.ENCERRAR_CHAMADO')"
                      :event="encerrarChamado"
                      :object="issue"
                    ></TooltipButton>
                  </v-card-actions>
                </v-expansion-panel-content>
              </v-expansion-panel>
            </v-expansion-panels>
          </div>
          <v-col
            v-if="issues.length == 0 && !isLoading"
            class="mt-n2"
          >
            <EmptyPanel :message="$vuetify.lang.t('$vuetify.NENHUM_CHAMADO')"> </EmptyPanel>
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

export default {
  components: {
    CountCard,
    EmptyPanel,
    TooltipButton,
    LabelValue,
    IssueDialog
  },
  methods: {
    closeDialog () {
      this.showDialog = false;
      this.showDialogLoading = false;

      setTimeout(() => {
        this.showSuccess = false;
      }, 1000);
    },
    sendIssue (issue) {

      if (!issue.reason) {
        return;
      }

      this.selectedIssue.motivoEncerramento = issue.reason;
      this.selectedIssue.observacaoEncerramento = issue.observation;
      this.showDialogLoading = true;

      this.$put('/chamado/close', this.selectedIssue).then((response) => {

        if (response.data) {

          this.showSuccess = true;
          this.showDialogLoading = false;
          this.selectedIssue.status = 2;
          this.selectedIssue.dataEncerramento = response.data.dataEncerramento;
          this.counts[0] -= 1;
          this.counts[1] += 1;
        }
      });
    },
    encerrarChamado (issue) {
      this.selectedIssue = issue;
      this.selectedIssue.type = 'closing';
      this.showDialog = true;
    },
    getObject () {
      return this.selectedIssue;
    },
    getOpened () {
      this.getFromStatus(1)
    },
    getClosed () {
      this.getFromStatus(2)
    },
    getFromStatus (status) {

      if (this.isLoading) {
        return
      }

      this.searchText = '';
      this.page = 0;
      this.isLoading = true;
      this.status = this.statuses[0]
      this.issues = [];

      this.$get('/chamado/busca', {
        contractId: this.$props.contract.id,
        searchText: this.searchText,
        status: status,
        page: 0
      }).then((response) => {

        if (response && response.data.length == 0) {
          this.noResult = true;
        }

        this.issues = response.data;
        this.isLoading = false;
      });
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

      if (document.getElementById('issueId').scrollTop + 341 >=
        document.getElementById('issueId').scrollHeight) {
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

      this.$get('/chamado/busca', {
        contractId: this.$props.contract.id,
        searchText: this.searchText, status: selectedStatus,
        page: this.page
      }).then((response) => {

        if (response && response.data.length == 0) {
          this.noResult = true;
        }

        if (!page) {
          this.issues = []
        }

        this.issues = this.issues.concat(response.data);
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
    showPanel: true,
    selectedIssue: undefined,
    showDialogLoading: false,
    reasonList: [],
    showDialog: false,
    showSuccess: false,
    counts: [0, 0],
    issues: [],
    statuses: [],
    status: 0,
    page: 0,
    isLoading: true,
    noResult: false,
    searchText: '',
  }),
  created: function () {

    this.reasonList = [this.$vuetify.lang.t('$vuetify.DESISTI_CHAMADO'),
    this.$vuetify.lang.t('$vuetify.PROBLEMA_RESOLVIDO')]

    this.$root.$on('new-issue', (issue) => {
      if (!this.issues) {
        return;
      }
      this.issues.unshift(issue)
      this.counts[0] += 1;
    })

    this.statuses = [this.$vuetify.lang.t('$vuetify.TODOS'),
    this.$vuetify.lang.t('$vuetify.EM_ABERTO'),
    this.$vuetify.lang.t('$vuetify.ENCERRADOS')]

    this.$get('/chamado/counts',
      { contractId: this.$props.contract.id }).then((response) => {

        this.counts = response.data;
        if (this.counts.length == 0)
          this.counts = [0, 0]

        this.isLoading = false;
      });

    this.$get('/chamado/busca', {
      contractId: this.$props.contract.id,
      searchText: '',
      status: 0,
      page: 0
    })
      .then((response) => {
        this.issues = response.data;
        this.isLoading = false;
      });
  }
};
</script>
