<template>
  <div>
    <v-row
      id="issues"
      :class="{'ml-n12':$vuetify.breakpoint.mdAndUp}"
    >
      <span class="mb-7 text-right display-1 font-weight-bold grey--text text--darken-1">
        {{$vuetify.lang.t('$vuetify.RESTART_CIRCUITOS')}}</span>

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
        <v-row :class="{'ml-n6':$vuetify.breakpoint.xs}">
          <v-col :class="[{'flex-grow-0':!$vuetify.breakpoint.xs},{'ml-0 pl-1 pr-0':$vuetify.breakpoint.xs}]">
            <CountCard
              :count="counts[0]"
              :message="$vuetify.lang.t('$vuetify.COM_SUCESSO')"
              color="success--text"
              :func="getWithSuccess"
            ></CountCard>
          </v-col>
          <v-col :class="[{'flex-grow-0':!$vuetify.breakpoint.xs},{'pl-1 pr-0':$vuetify.breakpoint.xs}]">
            <CountCard
              :count="counts[1]"
              :message="$vuetify.lang.t('$vuetify.SEM_SUCESSO')"
              color="error--text"
              :func="getWithoutSuccess"
            ></CountCard>
          </v-col>
          <v-col
            :class="[{'flex-grow-0':!$vuetify.breakpoint.xs}, {'pl-1 pr-0':$vuetify.breakpoint.xs}]"
            class="mr-n2"
          >
            <CountCard
              :count="counts[2]"
              :message="$vuetify.lang.t('$vuetify.EM_ANDAMENTO')"
              color="warning--text"
              :func="getInProgress"
            ></CountCard>
          </v-col>
        </v-row>

        <v-row
          id="filtro"
          class="pl-0 ml-0 grey lighten-5 mb-n5 mt-2"
        >
          <v-col :cols="!$vuetify.breakpoint.xs?4:6">
            <v-row>
              <span class=" text-right subtitle-2 font-weight-bold grey--text text--lighten-1">
                {{$vuetify.lang.t('$vuetify.BUSCAR')}}:</span>
            </v-row>
            <v-row md="2">
              <v-text-field
                v-model.trim="searchText"
                dense
                label="Regular"
                :placeholder="$vuetify.lang.t('$vuetify.DESIGNACAO_TPZ_CIRCUITO')"
                single-line
                solo
                max-width="200"
                append-icon="mdi-magnify"
                @click:append="search()"
                @keypress.enter="search()"
              ></v-text-field>
            </v-row>
          </v-col>
        </v-row>

        <v-row
          class="pl-2 mt-2"
          style="min-height:120px;"
        >
          <div
            id="operationId"
            class="pr-2 overflow-y-auto overflow-x-hidden"
            v-scroll:#operationId="searchMore"
            style="max-height:340px; width:100%;"
          >
            <v-expansion-panels class="ma-1">
              <v-expansion-panel
                v-for="(operation, i) in operations"
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
                      cols="6"
                      sm="2"
                    >
                      <v-chip
                        :color="operation.status=='EM_ANDAMENTO'?'warning':
                        operation.resultado=='SUCESSO'?'primary':'error'"
                        class="ml-0 mr-4"
                        label
                        small
                        outlined
                      >
                        {{ operation.status=='EM_ANDAMENTO'?$vuetify.lang.t('$vuetify.EM_ANDAMENTO'):
                            operation.resultado=='SUCESSO'?$vuetify.lang.t('$vuetify.COM_SUCESSO'):
                            $vuetify.lang.t('$vuetify.SEM_SUCESSO') }}
                      </v-chip>
                    </v-col>

                    <v-col
                      sm="5"
                      md="4"
                      v-show="!$vuetify.breakpoint.xs"
                    >
                      <strong class="font-weight-bold grey--text text--lighten-1 mr-2">
                        {{$vuetify.lang.t('$vuetify.DESIGNACAO_TPZ_CIRCUITO')}}:</strong>
                      <strong
                        class="subtitle-2"
                        v-html="operation.referenciaEntidade"
                      ></strong>
                    </v-col>

                    <v-col
                      sm="5"
                      md="5"
                      v-if="!open"
                      v-show="!$vuetify.breakpoint.xs"
                    >
                      <strong class="font-weight-bold grey--text text--lighten-1 mr-2">
                        {{$vuetify.lang.t('$vuetify.DATA_OPERACAO')+':'}}</strong>

                      <strong>{{formatDate(operation.createdOn)}}</strong>
                    </v-col>
                  </v-row>
                </v-expansion-panel-header>

                <v-expansion-panel-content>

                  <v-card-subtitle class="caption mt-n10 ml-n4 mb-2 grey--text text--lighten-1">
                    {{$vuetify.lang.t('$vuetify.DESIGNACAO_TPZ_CIRCUITO')}}:
                    {{operation.referenciaEntidade}}
                  </v-card-subtitle>

                  <v-row>
                    <v-col
                      class="mt-n6 mr-5"
                      :class="{'col-5':$vuetify.breakpoint.xs, 'col-2':!$vuetify.breakpoint.xs}"
                    >
                      <v-col class="pa-0">
                        <v-chip
                          :color="opertion.status=='CONCLUIDO'?'blue-grey':'warning'"
                          class="ml-0 mr-2 mb-2"
                          label
                          small
                          outlined
                        >
                          {{ opertion.status=='CONCLUIDO'?$vuetify.lang.t('$vuetify.CONCLUIDO'):
                                $vuetify.lang.t('$vuetify.EM_ANDAMENTO') }}
                        </v-chip>

                        <v-chip
                          class="ml-0 mr-2"
                          label
                          small
                          outlined
                          :color="operation.resultado=='SUCESSO'?'success':'error'"
                        >
                          {{ operation.resultado=='SUCESSO'?$vuetify.lang.t('$vuetify.COM_SUCESSO'):
                          $vuetify.lang.t('$vuetify.SEM_SUCESSO') }}
                        </v-chip>
                      </v-col>
                    </v-col>

                    <v-col
                      class="mt-n3"
                      :class="{'col-6 pl-3':$vuetify.breakpoint.xs}"
                    >
                      <v-col class="pt-0 pl-0 mt-n6">
                        <LabelValue
                          :label="$vuetify.lang.t('$vuetify.DATA_OPERACAO')"
                          :value="formatDate(operation.createdOn)"
                          justify="start"
                          :class="{'pl-0':$vuetify.breakpoint.xs}"
                        ></LabelValue>
                      </v-col>
                      <v-col class="pt-0 pl-0 pr-0 mt-n6">
                        <LabelValue
                          :label="$vuetify.lang.t('$vuetify.HORA_INICIO')"
                          :value="formatHour(operation.createdOn)"
                          justify="start"
                          :class="{'pr-0 pl-0':$vuetify.breakpoint.xs}"
                        ></LabelValue>
                      </v-col>
                      <v-col class="pt-0 pl-0 pr-0 mt-n6">
                        <LabelValue
                          :label="$vuetify.lang.t('$vuetify.HORA_FIM')"
                          :value="formatHour(operation.updatedOn)"
                          justify="start"
                          :class="{'pr-0 pl-0':$vuetify.breakpoint.xs}"
                        ></LabelValue>
                      </v-col>
                    </v-col>

                  </v-row>

                  <v-divider
                    class="mt-n3"
                    v-show="operation.chamado"
                  ></v-divider>

                  <v-card-actions
                    class="mb-n2 pb-0"
                    v-show="operation.chamado"
                  >
                    <TooltipButton
                      :label="$vuetify.lang.t('$vuetify.VER_CHAMADO')"
                      :message="$vuetify.lang.t('$vuetify.VER_CHAMADO_TOPDESK')"
                      :event="toTopDesk"
                      :object="operation.chamado"
                      :mobile="$vuetify.breakpoint.xs"
                      :isText=true
                    ></TooltipButton>
                  </v-card-actions>
                </v-expansion-panel-content>
              </v-expansion-panel>
            </v-expansion-panels>
          </div>
          <v-col
            v-if="operations.length == 0 && !isLoading"
            class="mt-n2"
          >
            <WarningPanel :message="$vuetify.lang.t('$vuetify.NENHUM_RESTART')"> </WarningPanel>
          </v-col>
        </v-row>

      </div>
    </v-lazy>
  </div>
</template>

<script>

import CountCard from '../components/cards/CountCard'
import WarningPanel from '../components/panels/WarningPanel';
import TooltipButton from '../components/TooltipButton';
import LabelValue from '../components/LabelValue';

export default {
  components: {
    CountCard,
    WarningPanel,
    TooltipButton,
    LabelValue,
  },
  methods: {

    getWithSuccess () {
      this.getFromStatus('SUCESSO')
    },
    getWithoutSuccess () {
      this.getFromStatus('INSUCESSO')
    },
    getInProgress () {
      this.getFromStatus('EM_ANDAMENTO')
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
        contractId: this.$props.contract ? this.$props.contract.id : undefined,
        searchText: this.searchText,
        status: status,
        proactivity: this.$props.proactivity,
        page: 0
      }).then((response) => {

        if (response && response.data.length == 0) {
          this.noResult = true;
        } else {
          this.noResult = false;
        }

        this.issues = response.data;
        this.filterIssues()
        this.isLoading = false;
      });
    },
    formatDate (date) {
      return this.$formatDate(date)
    },
    formatHour (date) {
      return this.$formatHour(date)
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

      var selectedStatus = ''
      if (this.status == this.statuses[0]) {
        selectedStatus = '';
      } else if (this.status == this.statuses[1]) {
        selectedStatus = 'ABERTO';
      } else if (this.status == this.statuses[2]) {
        selectedStatus = 'ENCERRADO';
      }

      this.$get('/chamado/busca', {
        contractId: this.$props.contract ? this.$props.contract.id : undefined,
        searchText: this.searchText,
        status: selectedStatus,
        proactivity: this.$props.proactivity,
        page: this.page
      }).then((response) => {

        if (response && response.data.length == 0) {
          this.noResult = true;
        } else {
          this.noResult = false;
        }

        if (!page) {
          this.issues = []
        }

        this.issues = this.issues.concat(response.data);
        this.filterIssues()
        this.isLoading = false;
      });

    },
    expandPanel () {
      this.showPanel = !this.showPanel;
    }
  },
  props: {
    contract: Object,
    proactivity: Boolean,
  },
  data: () => ({
    isLoading: false,
    operations: [],
    showPanel: true,
    counts: [0, 0, 0],
    status: 0,
    page: 0,
    noResult: false,
    searchText: '',
  }),
  created: function () {

    this.$get('/chamado/counts',
      {
        contractId: this.$props.contract ? this.$props.contract.id : undefined,
        proactivity: this.$props.proactivity
      }).then((response) => {

        this.counts = response.data;
        if (this.counts.length == 0)
          this.counts = [0, 0, 0]

        this.isLoading = false;
        this.counts.push(0)
        this.$root.$emit('issue-data', this.counts)
      });

    this.$get('/chamado/busca', {
      contractId: this.$props.contract ? this.$props.contract.id : undefined,
      searchText: '',
      status: '',
      proactivity: this.$props.proactivity,
      page: 0
    })
      .then((response) => {
        this.issues = response.data;
        this.filterIssues()
        this.isLoading = false;
      });
  }
};
</script>
