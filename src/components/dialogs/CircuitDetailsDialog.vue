<template>
  <v-dialog
    persistent
    min-width="700"
    v-model="show"
    class="mt-n3 overflow-y-hidden overflow-x-hidden"
  >
    <v-card class="overflow-y-hidden overflow-x-hidden" height="620">
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
            :message="$vuetify.lang.t('$vuetify.TAXA_DOWNLOAD')"
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
                  }).format(circuit.taxaUpload) + ' kbps'
                : '--'
            "
            :message="$vuetify.lang.t('$vuetify.TAXA_UPLOAD')"
            color="primary--text font-weight-bold"
            :smallText="true"
            :smallCount="true"
          ></CountCard
        ></v-col>
        <v-col class="flex-grow-0">
          <CountCard
            :count="circuit.latencia ? circuit.latencia + ' ms' : '--'"
            :message="$vuetify.lang.t('$vuetify.LATENCIA')"
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
            :message="$vuetify.lang.t('$vuetify.TAXA_PERDA_PACOTES')"
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
            :message="$vuetify.lang.t('$vuetify.TEMPO_OBSTRUCAO')"
            color="primary--text font-weight-bold"
            :smallText="true"
            :smallCount="true"
          ></CountCard
        ></v-col>
      </v-row>

      <v-row class="mt-3 mb-3 justify-center" style="overflow-y:auto; height:46vh; " >
        
        <LineChart
        :options="circuitOptionsOp"
          :styles="{
            height: '15rem',
            width: '62vh',
          }"
          :chart-data="{
            labels: ['1', '2', '3', '4', '5', '6', '7'],
            datasets: [
              {
                label: 'My First Dataset',
                data: [65, 59, 80, 81, 56, 55, 40],
                fill: false,
                borderColor: 'rgb(75, 192, 192)',
                tension: 0.1,
              },
            ],
          }"
        ></LineChart>
       
        <LineChart
           :options="circuitOptionsOp"
          :styles="{
            height: '15rem',
            width: '62vh',
          }"
          :chart-data="{
            labels: ['1', '2', '3', '4', '5', '6', '7'],
            datasets: [
              {
                label: 'My First Dataset',
                data: [65, 59, 80, 81, 56, 55, 40],
                fill: false,
                borderColor: 'rgb(75, 192, 192)',
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
                label: 'My First Dataset',
                data: [65, 59, 80, 81, 56, 55, 40],
                fill: false,
                borderColor: 'rgb(75, 192, 192)',
                tension: 0.1,
              },
            ],
          }"
        ></LineChart>
       
        <LineChart
           :options="circuitOptionsOp"
          :styles="{
            height: '15rem',
            width: '62vh',
          }"
          :chart-data="{
            labels: ['1', '2', '3', '4', '5', '6', '7'],
            datasets: [
              {
                label: 'My First Dataset',
                data: [65, 59, 80, 81, 56, 55, 40],
                fill: false,
                borderColor: 'rgb(75, 192, 192)',
                tension: 0.1,
              },
            ],
          }"
        ></LineChart>
       
        <LineChart
           :options="circuitOptionsOp"
          :styles="{
            height: '15rem',
            width: '62vh',
          }"
          :chart-data="{
            labels: ['1', '2', '3', '4', '5', '6', '7'],
            datasets: [
              {
                label: 'My First Dataset',
                data: [65, 59, 80, 81, 56, 55, 40],
                fill: false,
                borderColor: 'rgb(75, 192, 192)',
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
                label: 'My First Dataset',
                data: [65, 59, 80, 81, 56, 55, 40],
                fill: false,
                borderColor: 'rgb(75, 192, 192)',
                tension: 0.1,
              },
            ],
          }"
        ></LineChart>
       
      </v-row>

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
import LineChart from "../charts/LineChart.js";

export default {
  components: {
    CountCard,
    LineChart,
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
    circuitOptionsOp: {maintainAspectRatio: false,}
  }),
  created: function () {},
};
</script>