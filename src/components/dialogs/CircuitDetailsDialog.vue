<template>
  <v-dialog
    persistent
    v-model="show"
    class="mt-n3 overflow-y-hidden overflow-x-hidden"
  >
    <v-card class="overflow-y-hidden overflow-x-hidden">
      <v-card-title
        class="headline-6"
        style="word-break: normal; !important"
        :class="{ 'subtitle-2': $vuetify.breakpoint.xs }"
      >
        {{ $vuetify.lang.t("$vuetify.MAIS_DETALHES") + " - " + circuit.nome }}
      </v-card-title>

      <v-row class="mt-3 mb-10 justify-center">
        <v-col class="flex-grow-0">
          <CountCard
            :count="
              circuit.taxaDownload
                ? Intl.NumberFormat('pt-BR', {
                    maximumFractionDigits: 2,
                  }).format(circuit.taxaDownload) + ' Kbps'
                : '--'
            "
            :message="$vuetify.lang.t('$vuetify.TAXA_DOWNLOAD_ATUAL')"
            color="primary--text font-weight-bold"
            :smallText="true"
            :smallCount="true"
          ></CountCard
        ></v-col>
        <v-col class="flex-grow-0">
          <CountCard
            :count="
              circuit.taxaUpload
                ? Intl.NumberFormat('pt-BR', {
                    maximumFractionDigits: 2,
                  }).format(circuit.taxaUpload) + ' Kbps'
                : '--'
            "
            :message="$vuetify.lang.t('$vuetify.TAXA_UPLOAD_ATUAL')"
            color="primary--text font-weight-bold"
            :smallText="true"
            :smallCount="true"
          ></CountCard
        ></v-col>
        <v-col class="flex-grow-0">
          <CountCard
            :count="circuit.latencia ? circuit.latencia + ' ms' : '--'"
            :message="$vuetify.lang.t('$vuetify.LATENCIA_ATUAL')"
            color="primary--text font-weight-bold"
            :smallCount="true"
          ></CountCard
        ></v-col>
        <v-col class="flex-grow-0">
          <CountCard
            :count="
              circuit.taxaPerdaPing
                ? Intl.NumberFormat('pt-BR', {
                    maximumFractionDigits: 2,
                  }).format(circuit.taxaPerdaPing * 100) + '%'
                : '--'
            "
            :message="$vuetify.lang.t('$vuetify.TAXA_PERDA_PACOTES_ATUAL')"
            color="primary--text font-weight-bold"
            :smallText="true"
            :smallCount="true"
          ></CountCard
        ></v-col>
        <v-col class="flex-grow-0">
          <CountCard
            :count="
              circuit.qualidadeSinal
                ? Intl.NumberFormat('pt-BR', {
                    maximumFractionDigits: 2,
                  }).format(circuit.qualidadeSinal * 100) + '%'
                : '--'
            "
            :message="$vuetify.lang.t('$vuetify.QUALIDADE_SINAL')"
            color="primary--text font-weight-bold"
            :smallText="true"
            :smallCount="true"
          ></CountCard
        ></v-col>
        <v-col class="flex-grow-0">
          <CountCard
            :count="
              circuit.tempoObstrucao
                ? Intl.NumberFormat('pt-BR', {
                    maximumFractionDigits: 2,
                  }).format(circuit.tempoObstrucao) + '%'
                : '--'
            "
            :message="$vuetify.lang.t('$vuetify.TEMPO_OBSTRUCAO_ATUAL')"
            color="primary--text font-weight-bold"
            :smallText="true"
            :smallCount="true"
          ></CountCard
        ></v-col>
      </v-row>

    <!--  <v-row class="mt-3 mb-3 ml-4 mr-4 justify-center" style="overflow-y:auto; max-height:40vh;" >
        
        <LineChart class="mb-10 mr-6" ref="chart1"
          :options="circuitOptionsOp"
          :styles="{
            height: '15rem',
            width: '62vh',
          }"
          :chart-data="{
            labels: ['1', '2', '3', '4', '5', '6', '7', '12','11', '22', '45', '11'],
            datasets: [
              {
                data: [65, 59, 80, 81, 56, 55, 40, 100, 23, 45, 67, 54, 45, 78, 78, 88],
                fill: true,
                borderColor: 'rgb(50,82,123)',
                backgroundColor: 'rgb(50,82,123, 50%)',
                tension: 0.1,
              },
            ],
          }"
        ></LineChart>
       
        <LineChart class="mr-6"
          :options="circuitOptionsOp"
          :styles="{
            height: '15rem',
            width: '62vh',
          }"
          :chart-data="{
            labels: ['1', '2', '3', '4', '5', '6', '7'],
            datasets: [
              {
                data: [65, 59, 80, 81, 56, 55, 40],
                fill: true,
                borderColor: 'rgb(50,82,123)',
                backgroundColor: 'rgb(50,82,123, 50%)',
                tension: 0.1,
              },
            ],
          }"
        ></LineChart>
       
        <LineChart
           :options="circuitOptionsOp"
          :styles="{
            height: '15rem',
            width: '60vh',
          }"
          :chart-data="{
            labels: ['1', '2', '3', '4', '5', '6', '7'],
            datasets: [
              {
                data: [65, 59, 80, 81, 56, 55, 40],
                fill: true,
                borderColor: 'rgb(50,82,123)',
                backgroundColor: 'rgb(50,82,123, 50%)',
                tension: 0.1,
              },
            ],
          }"
        ></LineChart>
       
        <LineChart class="mr-6"
           :options="circuitOptionsOp"
          :styles="{
            height: '15rem',
            width: '62vh',
          }"
          :chart-data="{
            labels: ['1', '2', '3', '4', '5', '6', '7'],
            datasets: [
              {
                data: [65, 59, 80, 81, 56, 55, 40],
                fill: true,
                borderColor: 'rgb(75, 192, 192)',
                backgroundColor: 'rgb(75, 192, 192, 50%)',
                tension: 0.1,
              },
            ],
          }"
        ></LineChart>
       
        <LineChart class="mr-6"
           :options="circuitOptionsOp"
          :styles="{
            height: '15rem',
            width: '62vh',
          }"
          :chart-data="{
            labels: ['1', '2', '3', '4', '5', '6', '7'],
            datasets: [
              {
                data: [65, 59, 80, 81, 56, 55, 40],
                fill: true,
                borderColor: 'rgb(75, 192, 192)',
                backgroundColor: 'rgb(75, 192, 192, 50%)',
                tension: 0.1,
              },
            ],
          }"
        ></LineChart>
      
        <LineChart
           :options="circuitOptionsOp"
          :styles="{
            height: '15rem',
            width: '60vh',
          }"
          :chart-data="{
            labels: ['1', '2', '3', '4', '5', '6', '7'],
            datasets: [
              {
                data: [65, 59, 80, 81, 56, 55, 40],
                fill: true,
                borderColor: 'rgb(75, 192, 192)',
                backgroundColor: 'rgb(75, 192, 192, 50%)',
                tension: 0.1,
              },
            ],
          }"
        ></LineChart>
       
      </v-row> -->

      <v-divider class="mt-0"></v-divider>

      <v-card-actions>
        <v-spacer v-if="!$vuetify.breakpoint.xs"></v-spacer>
        <v-btn
          color="primary"
          text
          @click="close()"
          :x-small="$vuetify.breakpoint.xs"
          >{{ $vuetify.lang.t("$vuetify.FECHAR") }}</v-btn
        >
        <v-spacer v-if="$vuetify.breakpoint.xs"></v-spacer>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import CountCard from "../../components/cards/CountCard";
//import LineChart from "../charts/LineChart.js";

export default {
  components: {
    CountCard,
    //LineChart,
  },
  props: {
    close: Function,
    show: Boolean,
    circuit: Object,
  },
  methods: {},
  data: () => ({
    items: [],
    selectedItems: [],
    searchText: "",
    circuitOptionsOp: undefined,
  }),
  created: function () {
    this.circuitOptionsOp= {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          yAxes: [],
          xAxes: [{
            gridLines: { drawOnChartArea: false },
          }]
        },
        title: {
          display: true,
          text: this.$vuetify.lang.t('$vuetify.TAXA_DOWNLOAD'),
          fontSize: 18,
          subtitle: {

          display: true,
          text: this.$vuetify.lang.t('$vuetify.TAXA_DOWNLOAD'),
        },
        },
        
        legend: {display:false},
        elements: {
          point: {
            radius: 2,
          },
          line: {
            borderWidth: 2,
          }
        },
      }

      console.log(this.$refs.chart1);
  },
};
</script>