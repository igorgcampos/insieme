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
        {{
          $vuetify.lang.t("$vuetify.MAIS_DETALHES") +
          " - " +
          circuit.nome +
          " (" +
          $vuetify.lang.t(
            "$vuetify.ULTIMA_ATUALIZACAO",
            this.$formatDate(circuit.updatedOn.date) +
              " " +
              this.$formatHour(circuit.updatedOn.time)
          ) +
          ")"
        }}
      </v-card-title>

      <v-row class="mt-3 mb-10 justify-center">
        <v-col class="flex-grow-0">
          <CountCard
            :count="
              circuit.taxaDownload
                ? Intl.NumberFormat('pt-BR', {
                    maximumFractionDigits: 2,
                  }).format(circuit.taxaDownload) + ' Mbps'
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
                  }).format(circuit.taxaUpload) + ' Mbps'
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

      <v-row class="mt-3 mb-10 justify-center">
        <v-btn-toggle mandatory dense color="blue">
          <v-btn @click="searchMeasurements(0.25)">
            <span class="hidden-sm-and-down caption">{{
              $vuetify.lang.t("$vuetify.MINUTOS_15")
            }}</span>
          </v-btn>
          <v-btn @click="searchMeasurements(3)">
            <span class="hidden-sm-and-down caption">{{
              $vuetify.lang.t("$vuetify.HORAS_3")
            }}</span>
          </v-btn>
          <v-btn @click="searchMeasurements(24)">
            <span class="hidden-sm-and-down caption">{{
              $vuetify.lang.t("$vuetify.HORAS_24")
            }}</span>
          </v-btn>
          <v-btn @click="searchMeasurements(24 * 7)">
            <span class="hidden-sm-and-down caption">{{
              $vuetify.lang.t("$vuetify.DIAS_7")
            }}</span>
          </v-btn>
          <v-btn @click="searchMeasurements(24 * 30)">
            <span class="hidden-sm-and-down caption">{{
              $vuetify.lang.t("$vuetify.DIAS_30")
            }}</span>
          </v-btn>
        </v-btn-toggle>
      </v-row>

      <v-row
        v-show="isLoading"
        class="mt-3 mb-3 ml-4 mr-4 justify-center"
        style="overflow-y: auto; height: 40vh"
      >
        <v-progress-circular
          :size="60"
          :width="3"
          color="red"
          indeterminate
          class="mt-12"
        ></v-progress-circular>
      </v-row>

      <v-row
        v-show="!isLoading"
        class="mt-3 mb-3 ml-4 mr-4 justify-center"
        style="overflow-y: auto; max-height: 40vh"
      >
        <LineChart
          v-if="!isLoading"
          class="mb-10 mr-6"
          ref="chart1"
          :options="downloadOptions"
          :styles="{
            height: '15rem',
            width: '62vh',
          }"
          :chart-data="{
            labels: labels,
            datasets: [
              {
                data: downloadOptions.data,
                fill: true,
                borderColor: 'rgb(50,82,123)',
                backgroundColor: 'rgb(50,82,123, 50%)',
                tension: 0.1,
              },
            ],
          }"
        ></LineChart>

        <LineChart
          v-if="!isLoading"
          class="mr-6"
          :options="uploadOptions"
          :styles="{
            height: '15rem',
            width: '62vh',
          }"
          :chart-data="{
            labels: labels,
            datasets: [
              {
                data: uploadOptions.data,
                fill: true,
                borderColor: 'rgb(50,82,123)',
                backgroundColor: 'rgb(50,82,123, 50%)',
                tension: 0.1,
              },
            ],
          }"
        ></LineChart>

        <LineChart
          v-if="!isLoading"
          :options="latencyOptions"
          :styles="{
            height: '15rem',
            width: '60vh',
          }"
          :chart-data="{
            labels: labels,
            datasets: [
              {
                data: latencyOptions.data,
                fill: true,
                borderColor: 'rgb(50,82,123)',
                backgroundColor: 'rgb(50,82,123, 50%)',
                tension: 0.1,
              },
            ],
          }"
        ></LineChart>

        <LineChart
          v-if="!isLoading"
          class="mr-6"
          :options="packageOptions"
          :styles="{
            height: '15rem',
            width: '62vh',
          }"
          :chart-data="{
            labels: labels,
            datasets: [
              {
                data: packageOptions.data,
                fill: true,
                borderColor: 'rgb(75, 192, 192)',
                backgroundColor: 'rgb(75, 192, 192, 50%)',
                tension: 0.1,
              },
            ],
          }"
        ></LineChart>

        <LineChart
          v-if="!isLoading"
          class="mr-6"
          :options="qualitySignalOptions"
          :styles="{
            height: '15rem',
            width: '62vh',
          }"
          :chart-data="{
            labels: labels,
            datasets: [
              {
                data: qualitySignalOptions.data,
                fill: true,
                borderColor: 'rgb(75, 192, 192)',
                backgroundColor: 'rgb(75, 192, 192, 50%)',
                tension: 0.1,
              },
            ],
          }"
        ></LineChart>

        <LineChart 
          v-if="!isLoading"
          :options="obstructionOptions"
          :styles="{
            height: '15rem',
            width: '60vh',
          }"
          :chart-data="{
            labels: labels,
            datasets: [
              {
                data: obstructionOptions.data,
                fill: true,
                borderColor: 'rgb(75, 192, 192)',
                backgroundColor: 'rgb(75, 192, 192, 50%)',
                tension: 0.1,
              },
            ],
          }"
        ></LineChart>
      </v-row>

      <v-divider class="mt-0"></v-divider>

      <v-card-actions class="justify-center">
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
  watch: {
    circuit() {
      this.searchMeasurements(0.25);
    },
  },
  methods: {
    loadDataToCharts(chartInfo) {
      for (var index in chartInfo) {
        var element = chartInfo[index];
        this.downloadOptions.data.push(element["taxaDownload"]);
        this.uploadOptions.data.push(element["taxaUpload"]);
        this.latencyOptions.data.push(element["latencia"]);
        this.packageOptions.data.push(element["taxaPerdaPing"] * 100);
        this.qualitySignalOptions.data.push(element["qualidadeSinal"] * 100);
        this.obstructionOptions.data.push(element["tempoObstrucao"]);
      }
    },
    searchMeasurements(hours) {
      this.isLoading = true;
      this.$get("/medicao/busca", {
        designationTpz: this.circuit.nome,
        hours: hours,
      }).then((response) => {
        this.loadDataToCharts(response.data);
        this.configureAxeLabels(hours, response.data);
        this.isLoading = false;
      });
    },
    formatHourAxeLabels(chartInfo){

      this.labels = [];
      for (var index in chartInfo) {
        this.labels.push(this.$formatHour(chartInfo[index].createdOn.time, true));
      }
    },
    formatDayAxeLabels(chartInfo){

      this.labels = [];
      for (var index in chartInfo) {
        this.labels.push(this.$formatDate(chartInfo[index].createdOn.date));
      }
    },
    configureAxeLabels(hours, chartInfo) {

      if (hours == 0.25) {
       this.formatHourAxeLabels(chartInfo);
      }

      if (hours == 3) {
       this.formatHourAxeLabels(chartInfo);
      }

      if (hours == 24) {
        this.formatHourAxeLabels(chartInfo);
      }

      if (hours == 7 * 24) {
        this.formatDayAxeLabels(chartInfo)
      }

      if (hours == 30 * 24) {
        this.formatDayAxeLabels(chartInfo)
      }
    },
  },
  data: () => ({
    mainOptions: undefined,
    downloadOptions: undefined,
    uploadOptions: undefined,
    latencyOptions: undefined,
    packageOptions: undefined,
    qualitySignalOptions: undefined,
    obstructionOptions: undefined,
    labels: [],
    isLoading: false,
  }),
  created: function () {
    this.mainOptions = {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        yAxes: [
          {
            gridLines: { drawOnChartArea: false },
          },
        ],
        xAxes: [
          {
            gridLines: { drawOnChartArea: false },
          },
        ],
      },
      title: {
        display: true,
        fontSize: 18,
      },
      legend: { display: false },
      elements: {
        point: {
          radius: 2,
        },
        line: {
          borderWidth: 2,
        },
      },
      data: [],
    };

    this.downloadOptions = JSON.parse(JSON.stringify(this.mainOptions));
    this.downloadOptions.title.text = this.$vuetify.lang.t(
      "$vuetify.TAXA_DOWNLOAD"
    );
    this.uploadOptions = JSON.parse(JSON.stringify(this.mainOptions));
    this.uploadOptions.title.text = this.$vuetify.lang.t(
      "$vuetify.TAXA_UPLOAD"
    );
    this.latencyOptions = JSON.parse(JSON.stringify(this.mainOptions));
    this.latencyOptions.title.text = this.$vuetify.lang.t("$vuetify.LATENCIA");
    this.packageOptions = JSON.parse(JSON.stringify(this.mainOptions));
    this.packageOptions.title.text = this.$vuetify.lang.t(
      "$vuetify.TAXA_PERDA_PACOTES"
    );
    this.qualitySignalOptions = JSON.parse(JSON.stringify(this.mainOptions));
    this.qualitySignalOptions.title.text =
      this.$vuetify.lang.t("$vuetify.QUALIDADE_SINAL") + " (%)";
    this.obstructionOptions = JSON.parse(JSON.stringify(this.mainOptions));
    this.obstructionOptions.title.text = this.$vuetify.lang.t(
      "$vuetify.TEMPO_OBSTRUCAO"
    );
  },
};
</script>