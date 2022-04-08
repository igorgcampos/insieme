<template>
  <div>
    <v-row
      id="operations"
      class="mt-7"
      :class="{'ml-n12':$vuetify.breakpoint.mdAndUp}"
    >
      <span class="mb-7 text-right display-1 font-weight-bold grey--text text--darken-1">
        {{$vuetify.lang.t('$vuetify.AUDITORIA')}}</span>

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
              :message="$vuetify.lang.t('$vuetify.LOGINS')"
              color="primary--text"
              :func="getLogins"
            ></CountCard>
          </v-col>
          <v-col :class="[{'flex-grow-0':!$vuetify.breakpoint.xs},{'pl-1 pr-0':$vuetify.breakpoint.xs}]">
            <CountCard
              :count="counts[1]"
              :message="$vuetify.lang.t('$vuetify.LOGOUTS')"
              color="primary--text"
              :func="getLogouts"
            ></CountCard>
          </v-col>
          <v-col
            :class="[{'flex-grow-0':!$vuetify.breakpoint.xs}, {'pl-1 pr-0':$vuetify.breakpoint.xs}]"
            class="mr-n2"
          >
            <CountCard
              :count="counts[2]"
              :message="$vuetify.lang.t('$vuetify.DOWNLOADS_CONTRATO')"
              color="primary--text"
              :smallText="true"
              :func="getDownloadContract"
            ></CountCard>
          </v-col>
          <v-col
            :class="[{'flex-grow-0':!$vuetify.breakpoint.xs}, {'pl-1 pr-0':$vuetify.breakpoint.xs}]"
            class="mr-n2"
          >
            <CountCard
              :count="counts[3]"
              :message="$vuetify.lang.t('$vuetify.DOWNLOADS_NF')"
              color="primary--text"
              :smallText="true"
              :func="getDownloadNF"
            ></CountCard>
          </v-col>
          <v-col
            :class="[{'flex-grow-0':!$vuetify.breakpoint.xs}, {'pl-1 pr-0':$vuetify.breakpoint.xs}]"
            class="mr-n2"
          >
            <CountCard
              :count="counts[4]"
              :message="$vuetify.lang.t('$vuetify.ACESSOS_PRTG')"
              color="primary--text"
              :func="getLinkPRTG"
              :smallText="$vuetify.breakpoint.xs?true:false"
            ></CountCard>
          </v-col>
        </v-row>

        <v-row
          id="filtro"
          class="pl-0 ml-0 grey lighten-5 mb-n5 mt-8"
        >
          <v-col :cols="!$vuetify.breakpoint.xs?3:4">
            <v-row>
              <span class=" text-right subtitle-2 font-weight-bold grey--text text--lighten-1">
                {{$vuetify.lang.t('$vuetify.BUSCAR')}}:</span>
            </v-row>
            <v-row md="3">
              <v-text-field
                v-model.trim="searchText"
                dense
                label="Regular"
                :placeholder="$vuetify.lang.t('$vuetify.USUARIO')"
                single-line
                solo
                max-width="200"
                append-icon="mdi-magnify"
                @click:append="search()"
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
                {{$vuetify.lang.t('$vuetify.TIPO')}}:</span>
            </v-row>
            <v-row>
              <v-select
                :items="types"
                v-model="type"
                :label="$vuetify.lang.t('$vuetify.TODOS')"
                solo
                dense
                item-text="text"
                item-value="value"
                @change="search()"
              ></v-select>
            </v-row>
          </v-col>
          <v-col class="ml-2">
            <v-row>
              <span class="ml-3 mb-n3 text-right subtitle-2 font-weight-bold grey--text text--lighten-1">
                {{$vuetify.lang.t('$vuetify.DATA')}}:</span>
            </v-row>
            <v-row md="3">
              <DatePickerField
                :date="date"
                :event="searchWithDate"
              ></DatePickerField>
            </v-row>
          </v-col>
        </v-row>

        <v-row
          class="pl-2 mt-2"
          style="min-height:120px;"
        >
          <div
            id="auditId"
            class="pr-2 overflow-y-auto overflow-x-hidden"
            v-scroll:#auditId="searchMore"
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
                      :cols="!$vuetify.breakpoint.xs?6:5"
                      sm="3"
                    >
                      <v-chip
                        color="primary"
                        class="ml-0 mr-4"
                        label
                        small
                        outlined
                      >
                        {{ $vuetify.breakpoint.xs && operation.tipo == 'DOWNLOAD_CONTRATO'?$vuetify.lang.t('$vuetify.DOWNLOAD_CONTRATO_MOBILE')
                         :$vuetify.lang.t('$vuetify.'+operation.tipo)}}
                      </v-chip>
                    </v-col>

                    <v-col
                      sm="4"
                      md="4"
                      xm="2"
                      v-if="!open"
                    >
                      <strong
                        class="font-weight-bold grey--text text--lighten-1 mr-2"
                        :class="{'caption':$vuetify.breakpoint.xs,'subtitle-2':!$vuetify.breakpoint.xs}"
                      >
                        {{$vuetify.lang.t('$vuetify.USUARIO')}}:</strong>
                      <strong
                        :class="{'caption':$vuetify.breakpoint.xs,'subtitle-2':!$vuetify.breakpoint.xs}"
                        v-html="operation.usuario.apelido"
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

                  <v-row
                    class="mt-2 ml-1"
                    :class="{'pl-10 pt-3 ml-n5':$vuetify.breakpoint.xs}"
                  >
                    <v-col
                      class="pt-0 pl-0 pr-0 mt-n6"
                      :class="{'col-6 ml-0':$vuetify.breakpoint.xs}"
                    >
                      <LabelValue
                        :label="$vuetify.lang.t('$vuetify.USUARIO')"
                        :value="operation.usuario.apelido"
                        justify="start"
                        :class="{'pr-0 pl-0':$vuetify.breakpoint.xs}"
                      ></LabelValue>
                    </v-col>

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
                      class="pt-0 pl-0 mt-n6"
                      :class="{'col-6':$vuetify.breakpoint.xs}"
                    >
                      <LabelValue
                        :label="$vuetify.lang.t('$vuetify.HORA')"
                        :value="formatHour(operation.createdOn.time)"
                        justify="start"
                        :class="{'pl-0 col-12':$vuetify.breakpoint.xs}"
                      ></LabelValue>
                    </v-col>
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
              <WarningPanel :message="$vuetify.lang.t('$vuetify.NENHUMA_OPERACAO')"> </WarningPanel>
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
import DatePickerField from '../components/fields/DatePickerField';

export default {
  components: {
    CountCard,
    WarningPanel,
    LabelValue,
    DatePickerField,
  },
  methods: {
    searchWithDate (date) {
      this.date = date

      if (this.isLoading) {
        return
      }

      this.page = 0;
      this.operations = [];
      this.search()
    },
    getLogins () {
      this.getFromType('LOGIN')
    },
    getLogouts () {
      this.getFromType('LOGOUT')
    },
    getDownloadContract () {
      this.getFromType('DOWNLOAD_CONTRATO')
    },
    getDownloadNF () {
      this.getFromType('DOWNLOAD_NOTA')
    },
    getLinkPRTG () {
      this.getFromType('LINK_PRTG')
    },
    clearFields () {
      this.searchText = '';
      this.page = 0;
      this.operations = [];
      this.date = null;
    },
    getFromType (type) {

      if (this.isLoading) {
        return
      }

      this.type = type;
      this.clearFields()
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

      if (document.getElementById('auditId').scrollTop + 341 >=
        document.getElementById('auditId').scrollHeight) {
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

      this.$get('/operacao/auditoria/busca', {
        searchText: this.searchText,
        type: this.type,
        date: this.date,
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

      this.$get('/operacao/auditoria/counts').then((response) => {

        this.counts = response.data;
        if (this.counts.length == 0)
          this.counts = [0, 0, 0, 0, 0]

        this.isLoading = false;
      });

      this.$get('/operacao/auditoria/busca', {
        searchText: this.searchText,
        page: 0
      })
        .then((response) => {
          this.operations = response.data;
          this.isLoading = false;
        });

      this.$get('/operacao/tipos')
        .then((response) => {

          this.types = response.data;
          this.types = this.types.filter((t) => t != 'RESTART_CIRCUITO')

          var vm = this;
          this.types = this.types.map(function (t) {
            return { text: vm.$vuetify.lang.t('$vuetify.' + t), value: t }
          })
          this.types.sort()
          this.types.unshift({ text: this.$vuetify.lang.t('$vuetify.TODOS'), value: null })

        });
    }
  },
  data: () => ({
    types: [],
    type: undefined,
    isLoading: false,
    operations: [],
    showPanel: true,
    counts: [0, 0, 0, 0, 0],
    status: undefined,
    page: 0,
    noResult: false,
    searchText: '',
    date: null,
  }),
  created: function () {

    this.initialSearch();
  }
};
</script>
