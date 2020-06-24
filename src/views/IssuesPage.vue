<template>
  <div>
    <v-row :class="{'ml-n12':$vuetify.breakpoint.mdAndUp}">
      <span class="mb-7 text-right display-1 font-weight-bold grey--text text--darken-1">
        {{$vuetify.lang.t('$vuetify.CHAMADOS')}}</span>
    </v-row>

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
          :count="counts[1]"
          :message="$vuetify.lang.t('$vuetify.ENCERRADOS')"
          color="primary--text"
          :func="getClosed"
        ></CountCard>
      </v-col>
    </v-row>

    <v-row
      id="filtro"
      class="pl-0 ml-0 grey lighten-5 mb-n5"
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
    </v-row>

    <v-row
      class="pl-2 mt-2"
      style="min-height:250px;"
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
                  md="6"
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
                  md="3"
                  v-if="!open"
                >
                  <strong class="font-weight-bold grey--text text--lighten-1 mr-2">
                    {{issue.status==1?$vuetify.lang.t('$vuetify.DATA_ABERTURA'):
                    $vuetify.lang.t('$vuetify.DATA_ENCERRAMENTO')}}</strong>

                  <strong :v-html="issue.status==1?formatDate(issue.dataAbertura):
                  formatDate(issue.dataEncerramento)"></strong>
                </v-col>
              </v-row>
            </v-expansion-panel-header>

            <v-expansion-panel-content>

              <v-card-subtitle class="caption mt-n10 ml-n4 mb-2 grey--text text--lighten-1">
                {{$vuetify.lang.t('$vuetify.ORIGEM')}}:
                {{$vuetify.lang.t('$vuetify.'+issue.origem)}}
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
                  class="mt-n12"
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
                      truncate
                      style="width:150px;"
                    ></LabelValue>
                  </v-col>
                  <v-col class="pt-0 mt-n6">
                    <LabelValue
                      :label="$vuetify.lang.t('$vuetify.MOTIVO_ENCERRAMENTO')"
                      :value="issue.motivoEncerramento || '--'"
                      justify="start"
                      truncate
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
                  :event="encerrarChamado(issue)"
                ></TooltipButton>
              </v-card-actions>
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-expansion-panels>
      </div>
      <v-col v-if="issues.length == 0 && !isLoading">
        <EmptyPanel :message="$vuetify.lang.t('$vuetify.NENHUM_CHAMADO')"> </EmptyPanel>
      </v-col>
    </v-row>
  </div>
</template>

<script>

import CountCard from '../components/CountCard'
import EmptyPanel from '../components/EmptyPanel';
import TooltipButton from '../components/TooltipButton';
import LabelValue from '../components/LabelValue';

export default {
  components: {
    CountCard,
    EmptyPanel,
    TooltipButton,
    LabelValue
  },
  methods: {
    getOpened () {
      this.getFromStatus(1)
    },
    getClosed () {
      this.getFromStatus(2)
    },
    encerrarChamado (issue) {
      return issue
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

        this.issues = this.circuits.concat(response.data);
        this.isLoading = false;
      });

    },
  },
  props: {
    contract: Object
  },
  data: () => ({
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
