<template>
  <div>
    <v-row
      id="operations"
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
              :count="counts"
              message="Restarts"
              color="success--text"
              :func="getFromStatus"
              toolTipMessage="Restarts"
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
            <v-row md="3">
              <v-text-field
                v-model.trim="searchText"
                dense
                label="Regular"
                :placeholder="$vuetify.lang.t('$vuetify.DESIGNACAO_TPZ_CIRCUITO')"
                single-line
                solo
                max-width="200"
                append-icon="mdi-magnify"
                @click:append="resultado = undefined; status = undefined; search()"
                @keypress.enter="resultado = undefined; status = undefined; search()"
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
                      :cols="!$vuetify.breakpoint.xs?6:5"
                      sm="2"
                      class="mt-2"
                    >
                      <v-chip
                          :color="operation.status=='CONCLUIDA'?'blue-grey':'warning'"
                          class="ml-0 mr-2 mb-2"
                          label
                          small
                          outlined
                        >
                          {{ operation.status=='CONCLUIDA'?$vuetify.lang.t('$vuetify.CONCLUIDO'):
                                $vuetify.lang.t('$vuetify.EM_ANDAMENTO') }}
                        </v-chip>
                    </v-col>

                    <v-col
                      sm="5"
                      md="5"
                      xm="2"
                    >
                      <strong
                        class="font-weight-bold grey--text text--lighten-1 mr-2"
                        :class="{'caption':$vuetify.breakpoint.xs,'subtitle-2':!$vuetify.breakpoint.xs}"
                      >
                        {{$vuetify.lang.t('$vuetify.DESIGNACAO_TPZ_CIRCUITO')}}:</strong>
                      <strong
                        :class="{'caption':$vuetify.breakpoint.xs,'subtitle-2':!$vuetify.breakpoint.xs}"
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

                      <strong>{{formatDate(operation.createdOn.date)}}</strong>
                    </v-col>
                  </v-row>
                </v-expansion-panel-header>

                <v-expansion-panel-content>

                  <v-row class="
                        mt-4">
                    <v-col
                      class="mt-n6 mr-5"
                      :class="{'col-5':$vuetify.breakpoint.xs, 'col-2':!$vuetify.breakpoint.xs}"
                    >
                      <v-col
                        class="pa-0 mt-n2"
                        :class="{'mt-n3':$vuetify.breakpoint.xs}"
                      >
                        <v-chip
                          :color="operation.status=='CONCLUIDA'?'blue-grey':'warning'"
                          class="ml-0 mr-2 mb-2"
                          label
                          small
                          outlined
                        >
                          {{ operation.status=='CONCLUIDA'?$vuetify.lang.t('$vuetify.CONCLUIDO'):
                                $vuetify.lang.t('$vuetify.EM_ANDAMENTO') }}
                        </v-chip>

                        <v-chip
                          class="ml-0 mr-2"
                          label
                          small
                          outlined
                          v-if="operation.resultado"
                          :color="operation.resultado=='SUCESSO'?'success':'error'"
                          :class="{'mb-3':$vuetify.breakpoint.xs}"
                        >
                          {{ operation.resultado=='SUCESSO'?$vuetify.lang.t('$vuetify.COM_SUCESSO'):
                          $vuetify.lang.t('$vuetify.SEM_SUCESSO') }}
                        </v-chip>
                      </v-col>
                    </v-col>

                    <v-row
                      class="mt-n3"
                      :class="{'pl-10 pt-3':$vuetify.breakpoint.xs}"
                    >
                      <v-col
                        class="pt-0 pl-0 mt-n6"
                        :class="{'col-6':$vuetify.breakpoint.xs}"
                      >
                        <LabelValue
                          :label="$vuetify.lang.t('$vuetify.DATA_OPERACAO')"
                          :value="formatDate(operation.createdOn.date)"
                          justify="start"
                          :class="{'pl-0 col-12':$vuetify.breakpoint.xs}"
                        ></LabelValue>
                      </v-col>
                      <v-col
                        class="pt-0 pl-0 pr-0 mt-n6"
                        :class="{'col-6 ml-0':$vuetify.breakpoint.xs}"
                      >
                        <LabelValue
                          :label="$vuetify.lang.t('$vuetify.HORA_INICIO')"
                          :value="formatHour(operation.createdOn.time)"
                          justify="start"
                          :class="{'pr-0 pl-0':$vuetify.breakpoint.xs}"
                        ></LabelValue>
                      </v-col>
                      <v-col
                        class="pt-0 pl-0 pr-0 mt-n6"
                        :class="{'col-4 ml-0':$vuetify.breakpoint.xs}"
                      >
                        <LabelValue
                          :label="$vuetify.lang.t('$vuetify.HORA_FIM')"
                          :value="formatHour(operation.updatedOn?operation.updatedOn.time:undefined)"
                          justify="start"
                          :class="{'pr-0 pl-0':$vuetify.breakpoint.xs}"
                        ></LabelValue>
                      </v-col>
                    </v-row>

                  </v-row>
                </v-expansion-panel-content>
              </v-expansion-panel>
            </v-expansion-panels>
          </div>
          <v-col
            v-if="operations.length == 0 && !isLoading"
            class="mt-n2"
          >
            <v-lazy
              :options="{threshold: .6}"
              transition="slide-x-transition"
            >
              <WarningPanel :message="$vuetify.lang.t('$vuetify.NENHUM_RESTART')"> </WarningPanel>
            </v-lazy>
          </v-col>
        </v-row>

      </div>
    </v-lazy>
  </div>
</template>

<script>

import CountCard from '../components/cards/CountCard'
import WarningPanel from '../components/panels/WarningPanel';
import LabelValue from '../components/LabelValue';

export default {
  components: {
    CountCard,
    WarningPanel,
    LabelValue,
  },
  methods: {
    toTopDesk () {

    },
    clearFields () {
      this.searchText = '';
      this.page = 0;
      this.operations = [];

    },
    getFromStatus () {

      if (this.isLoading) {
        return
      }

      this.clearFields();
      this.search()
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

      if (document.getElementById('operationId').scrollTop + 341 >=
        document.getElementById('operationId').scrollHeight) {
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

      this.$get('/operacao/proatividade/busca', {
        searchText: this.searchText,
        type: 'RESTART_CIRCUITO',
        page: this.page
      }).then((response) => {

        if (response && response.data.length == 0) {
          this.noResult = true;
        } else {
          this.noResult = false;
        }

        if (!page) {
          this.operations = []
        }

        this.operations = this.operations.concat(response.data);
        this.isLoading = false;
      });

    },
    expandPanel () {
      this.showPanel = !this.showPanel;
    },
    initialSearch () {

      this.$get('/operacao/proatividade/counts').then((response) => {

        this.counts = response.data;
        this.isLoading = false;
      });

      this.$get('/operacao/proatividade/busca', {
        searchText: this.searchText,
        type: 'RESTART_CIRCUITO',
        status: this.status,
        result: this.resultado,
        page: 0
      })
        .then((response) => {
          this.operations = response.data;
          this.isLoading = false;
        });
    }
  },
  data: () => ({
    isLoading: false,
    operations: [],
    showPanel: true,
    counts: 0,
    status: undefined,
    page: 0,
    noResult: false,
    searchText: '',
    resultado: undefined,
  }),
  created: function () {

    this.initialSearch();

    setInterval(() => {
      this.initialSearch();
    }, 60000)
  }
};
</script>
