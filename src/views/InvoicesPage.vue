<template>
  <div class="mb-10">
    <v-row :class="{'ml-n12':$vuetify.breakpoint.mdAndUp}">
      <span class="mb-7 text-right display-1 font-weight-bold grey--text text--darken-1">
        {{$vuetify.lang.t('$vuetify.NOTAS_FISCAIS')}}</span>
    </v-row>

    <v-row>
      <v-col class="flex-grow-0">
        <CountCard
          :count="counts[0]"
          :message="$vuetify.lang.t('$vuetify.PAGOS')"
          color="success--text"
          :func="getPaid"
        ></CountCard>
      </v-col>
      <v-col class="flex-grow-0">
        <CountCard
          :count="counts[1]"
          :message="$vuetify.lang.t('$vuetify.EM_ABERTO')"
          color="warning--text"
          :func="getOpened"
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
            :placeholder="$vuetify.lang.t('$vuetify.NUMERO_NOTA')"
            single-line
            solo
            autofocus
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
            {{$vuetify.lang.t('$vuetify.PAGAMENTO')}}:</span>
        </v-row>
        <v-row>
          <v-select
            :items="statuses"
            v-model="status"
            :label="$vuetify.lang.t('$vuetify.STATUS_PAGAMENTO')"
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
        id="invoiceId"
        class="pr-2 overflow-y-auto overflow-x-hidden"
        v-scroll:#invoiceId="searchMore"
        style="max-height:340px; width:100%;"
      >
        <v-expansion-panels class="ma-1">
          <v-expansion-panel
            v-for="(invoice, i) in invoices"
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
                  cols="5"
                  sm="3"
                >
                  <v-chip
                    :color="invoice.statusPagamento=='PENDENTE'?'warning':'success'"
                    class="ml-0 mr-2"
                    label
                    small
                    outlined
                  >
                    {{ invoice.statusPagamento=='PENDENTE'?$vuetify.lang.t('$vuetify.EM_ABERTO'):
                  $vuetify.lang.t('$vuetify.PAGO') }}
                  </v-chip>
                </v-col>

                <v-col
                  sm="5"
                  md="3"
                >
                  <strong class="font-weight-bold grey--text text--lighten-1 mr-2">No.:</strong>
                  <strong v-html="invoice.numero"></strong>
                </v-col>

                <v-col v-if="!open">
                  <strong class="font-weight-bold grey--text text--lighten-1 mr-2">
                    {{invoice.statusPagamento=='PENDENTE'?$vuetify.lang.t('$vuetify.VENCE_EM')+":":
                    $vuetify.lang.t('$vuetify.PAGO_EM')+":"}}</strong>

                  <strong>{{invoice.statusPagamento=='PENDENTE'?formatDate(invoice.dataVencimento):
                    formatDate(invoice.dataPagamento)}}</strong>
                </v-col>
              </v-row>
            </v-expansion-panel-header>

            <v-expansion-panel-content>

              <v-row>
                <v-col
                  class="mt-n6 mr-5"
                  style="max-width:150px;"
                >
                  <v-col class="pa-0">
                    <v-chip
                      :color="invoice.statusPagamento=='PENDENTE'?'warning':'success'"
                      class="ml-0 mr-2"
                      label
                      small
                      outlined
                    >
                      {{ invoice.statusPagamento=='PENDENTE'?$vuetify.lang.t('$vuetify.EM_ABERTO'):
                  $vuetify.lang.t('$vuetify.PAGO') }}
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
                      {{ invoice.tipo=='LOCAÇÃO'?$vuetify.lang.t('$vuetify.LOCACAO'):invoice.tipo }}
                    </v-chip>
                  </v-col>
                </v-col>

                <v-col class="mt-n12">
                  <v-col>
                    <LabelValue
                      :label="$vuetify.lang.t('$vuetify.DESCRICAO_SERVICO')"
                      :value="invoice.descricao || '--'"
                      justify="start"
                      truncate
                      style="width:150px;"
                    ></LabelValue>
                  </v-col>
                  <v-col class="pt-0 mt-n6">
                    <LabelValue
                      :label="$vuetify.lang.t('$vuetify.CONDICAO_PAGAMENTO')"
                      :value="invoice.condicaoPagamento"
                      justify="start"
                      style="width:150px;"
                    ></LabelValue>
                  </v-col>
                  <v-col class="pt-0 mt-n6">
                    <LabelValue
                      :label="$vuetify.lang.t('$vuetify.DATA_COMPETENCIA')"
                      :value="formatDate(invoice.dataCompetencia)"
                      justify="start"
                      truncate
                      style="width:150px;"
                    ></LabelValue>
                  </v-col>
                </v-col>

                <v-col class="mt-n12">
                  <v-col>
                    <LabelValue
                      :label="$vuetify.lang.t('$vuetify.DATA_EMISSAO')"
                      :value="formatDate(invoice.dataEmissao)"
                      justify="start"
                      style="width:150px;"
                    ></LabelValue>
                  </v-col>
                  <v-col class="pt-0 mt-n6">
                    <LabelValue
                      :label="$vuetify.lang.t('$vuetify.DATA_VENCIMENTO')"
                      :value="formatDate(invoice.dataVencimento)"
                      justify="start"
                      style="width:150px;"
                    ></LabelValue>
                  </v-col>
                  <v-col class="pt-0 mt-n6">
                    <LabelValue
                      :label="$vuetify.lang.t('$vuetify.DATA_PAGAMENTO')"
                      :value="invoice.dataPagamento?formatDate(invoice.dataPagamento):'--'"
                      justify="start"
                      truncate
                      style="width:150px;"
                    ></LabelValue>
                  </v-col>
                </v-col>

                <v-col class="mt-n9">
                  <v-col>
                    <v-row justify="start">
                      <span class="text-right caption font-weight-bold grey--text text--lighten-1">
                        {{$vuetify.lang.t('$vuetify.A_RECEBER')}}
                      </span>
                    </v-row>
                    <v-row justify="start">
                      <span class="text-center subtitle-2 font-weight-bold error--text">
                        {{'R$ '+invoice.aReceber.toLocaleString()}} </span>
                    </v-row>
                  </v-col>

                  <v-col class="mt-n3">
                    <v-row justify="start">
                      <span class="text-right caption font-weight-bold grey--text text--lighten-1">
                        {{$vuetify.lang.t('$vuetify.RECEBIDO')}}
                      </span>
                    </v-row>
                    <v-row justify="start">
                      <span class="text-center subtitle-2 font-weight-bold primary--text">
                        {{'R$ '+invoice.recebido.toLocaleString()}} </span>
                    </v-row>
                  </v-col>

                  <v-col class="mt-n3">
                    <v-row justify="start">
                      <span class="text-right caption font-weight-bold grey--text text--lighten-1">
                        {{$vuetify.lang.t('$vuetify.TOTAL_NOTA')}}
                      </span>
                    </v-row>
                    <v-row justify="start">
                      <span class="text-center subtitle-2 font-weight-bold success--text">
                        {{'R$ '+invoice.totalNF.toLocaleString()}} </span>
                    </v-row>
                  </v-col>
                </v-col>
              </v-row>

              <v-divider class="mt-n3"></v-divider>

              <v-card-actions class="mb-n2 pb-0">
                <TooltipButton
                  :label="$vuetify.lang.t('$vuetify.ABRIR_CHAMADO')"
                  :message="$vuetify.lang.t('$vuetify.ABRIR_CHAMADO_NOTA')"
                  :event="abrirChamado"
                ></TooltipButton>
              </v-card-actions>
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-expansion-panels>
      </div>
      <v-col v-if="invoices.length == 0 && !isLoading">
        <EmptyPanel :message="$vuetify.lang.t('$vuetify.NENHUMA_NOTA')"> </EmptyPanel>
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
    getPaid () {

      if (this.isLoading) {
        return
      }

      this.searchText = '';
      this.page = 0;
      this.isLoading = true;
      this.status = this.statuses[1]

      this.$get('/nota/busca', {
        contractId: this.$props.contract.id, searchText: this.searchText,
        paymentStatus: 1, page: this.page
      }).then((response) => {

        if (response && response.data.length == 0) {
          this.noResult = true;
        }

        this.invoices = response.data;
        this.isLoading = false;
      });
    },
    getOpened () {

      if (this.isLoading) {
        return
      }

      this.searchText = '';
      this.page = 0;
      this.isLoading = true;
      this.status = this.statuses[2]

      this.$get('/nota/busca', {
        contractId: this.$props.contract.id, searchText: this.searchText,
        paymentStatus: 2, page: this.page
      }).then((response) => {

        if (response && response.data.length == 0) {
          this.noResult = true;
        }

        this.invoices = response.data;
        this.isLoading = false;
      });
    },
    abrirChamado () {

    },
    formatDate (date) {
      return this.$formatDate(date)
    },
    searchMore () {

      if (this.isLoding || this.noResult) {
        return;
      }

      if (document.getElementById('invoiceId').scrollTop + 341 >=
        document.getElementById('invoiceId').scrollHeight) {
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

      this.$get('/nota/busca', {
        contractId: this.$props.contract.id, searchText: this.searchText,
        paymentStatus: selectedStatus, page: this.page
      }).then((response) => {

        if (response && response.data.length == 0) {
          this.noResult = true;
        }

        if (!page) {
          this.invoices = []
        }

        this.invoices = this.invoices.concat(response.data);
        this.isLoading = false;
      });

    },
  },
  props: {
    contract: Object
  },
  data: () => ({
    counts: [],
    invoices: [],
    statuses: [],
    status: 0,
    page: 0,
    isLoading: true,
    noResult: false,
    searchText: '',
  }),
  created: function () {

    this.statuses = [this.$vuetify.lang.t('$vuetify.TODOS'),
    this.$vuetify.lang.t('$vuetify.PAGO'),
    this.$vuetify.lang.t('$vuetify.EM_ABERTO')]

    this.$get('/nota/counts',
      { contractId: this.$props.contract.id }).then((response) => {
        this.counts = response.data;
        this.isLoading = false;
      });

    this.$get('/nota/busca',
      { contractId: this.$props.contract.id, searchText: '', paymentStatus: 0, page: 0 })
      .then((response) => {
        this.invoices = response.data;
        this.isLoading = false;
      });
  }
};
</script>
