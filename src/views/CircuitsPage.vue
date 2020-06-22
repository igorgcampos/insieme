<template>
  <div class="mb-10">
    <v-row class="ml-n12">
      <span class="mb-7 text-right display-1 font-weight-bold grey--text text--darken-1">
        {{$vuetify.lang.t('$vuetify.CIRCUITOS')}}</span>
    </v-row>

    <v-row>
      <v-col class="flex-grow-0">
        <CountCard
          :count="counts[0]"
          message="Online"
          color="success--text"
          :func="getOnline"
        ></CountCard>
      </v-col>
      <v-col class="flex-grow-0">
        <CountCard
          :count="counts[1]"
          message="Offline"
          color="warning--text"
          :func="getOffline"
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
            :placeholder="$vuetify.lang.t('$vuetify.DESIGNACAO_CLIENTE')"
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
            label="Gilat"
            solo
            dense
            @change="search()"
          ></v-select>
        </v-row>
      </v-col>
    </v-row>

    <v-row class="pl-2 mt-2">
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
                  cols="5"
                  sm="3"
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

                <!--<v-col
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
                </v-col>--->
              </v-row>
            </v-expansion-panel-header>

            <!--<v-expansion-panel-content>

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
                  :label="$vuetify.lang.t('$vuetify.REINICIAR_CIRCUITO')"
                  :message="$vuetify.lang.t('$vuetify.REINICIAR_CIRCUITO')"
                  :event="abrirChamado"
                ></TooltipButton>
                <TooltipButton
                  :label="$vuetify.lang.t('$vuetify.ABRIR_CHAMADO')"
                  :message="$vuetify.lang.t('$vuetify.ABRIR_CHAMADO_CIRCUITO')"
                  :event="abrirChamado"
                ></TooltipButton>
              </v-card-actions>
            </v-expansion-panel-content> -->
          </v-expansion-panel>
        </v-expansion-panels>
      </div>
      <v-col v-if="circuits.length == 0 && !isLoading">
        <EmptyPanel :message="$vuetify.lang.t('$vuetify.NENHUM_CIRCUITO')"> </EmptyPanel>
      </v-col>
    </v-row>
  </div>
</template>

<script>

import CountCard from '../components/CountCard'
import EmptyPanel from '../components/EmptyPanel';


export default {
  components: {
    CountCard,
    EmptyPanel,

  },
  methods: {
    getOnline () {

      if (this.isLoading) {
        return
      }

      this.searchText = '';
      this.page = 0;
      this.isLoading = true;
      this.status = this.statuses[1]

      this.$get('/circuito/busca', {
        contractNumber: this.$props.contract.numeroContratoSap, searchText: this.searchText, onlineStatus: 1,
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

      this.$get('/circuito/busca', {
        contractNumber: this.$props.contract.numeroContratoSap, searchText: this.searchText, onlineStatus: 2,
        installStatus: 0, productType: 0, page: 0
      }).then((response) => {

        if (response && response.data.length == 0) {
          this.noResult = true;
        }

        this.circuits = response.data;
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
        contractNumber: this.$props.contract.numeroContratoSap,
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
  },
  props: {
    contract: Object
  },
  data: () => ({
    counts: [],
    circuits: [],
    statuses: [],
    products: [],
    product: 0,
    status: 0,
    page: 0,
    isLoading: true,
    noResult: false,
    searchText: '',
  }),
  created: function () {

    this.statuses = [this.$vuetify.lang.t('$vuetify.TODOS'),
      'Online',
      'Offline']

    this.products = [this.$vuetify.lang.t('$vuetify.TODOS'), 'Gilat']

    this.$get('/circuito/status/counts',
      { contractNumber: this.$props.contract.numeroContratoSap }).then((response) => {
        this.counts = response.data;
        this.isLoading = false;
      });

    this.$get('/circuito/busca',
      {        contractNumber: this.$props.contract.numeroContratoSap, searchText: '', onlineStatus: 0,
        installStatus: 0, productType: 0, page: 0      })
      .then((response) => {
        this.circuits = response.data;
        this.isLoading = false;
      });
  }
};
</script>
