<template>
  <div class="mb-10">
    <v-row class="ml-n12 mt-n5 mb-n3">
      <span class="mb-7 text-right subtitle-1 font-weight-bold grey--text text--darken-1">
        {{$vuetify.lang.t('$vuetify.CONTRATO_SELECIONADO') + ': '+contract.numeroContratoTpz}} </span>
    </v-row>

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
          color="error--text"
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
            :label="$vuetify.lang.t('$vuetify.TODOS')"
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
                    Ip:</strong>
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
                      truncate
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
                  :label="$vuetify.lang.t('$vuetify.REINICIAR_CIRCUITO')"
                  :message="$vuetify.lang.t('$vuetify.REINICIAR_CIRCUITO')"
                  :event="abrirChamado"
                ></TooltipButton>
                <TooltipButton
                  :label="$vuetify.lang.t('$vuetify.ABRIR_CHAMADO')"
                  :message="$vuetify.lang.t('$vuetify.ABRIR_CHAMADO')"
                  :event="abrirChamado"
                ></TooltipButton>
              </v-card-actions>
            </v-expansion-panel-content>
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
    abrirChamado () {

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
      { contractNumber: this.$props.contract.numeroContratoTpz }).then((response) => {
        this.counts = response.data;
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
