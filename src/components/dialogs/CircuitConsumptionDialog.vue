<template>
  <v-dialog
    max-width="950"
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
        {{ $vuetify.lang.t("$vuetify.HISTORICO_CONSUMO", circuit.nome) }}
      </v-card-title>

      <v-row class="mt-3">
        <v-col cols="2" class="ml-12">
          <v-row>
            <span
              class="text-right subtitle-2 font-weight-bold grey--text text--lighten-1"
            >
              {{ $vuetify.lang.t("$vuetify.MES_ANO") }}:</span
            >
          </v-row>
          <v-row md="3">
            <DatePickerField
              class="ml-n3 mt-n3"
              :date="interestDate"
              :event="searchConsumptions"
              type="month"
            ></DatePickerField>
          </v-row>
        </v-col>
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
        class="mt-3 mb-3 ml-10"
        style="overflow-y: auto; max-height: 40vh"
      >
        <BarChart
          :styles="{
            height: '18rem',
            width: '80vh',
          }"
          :options="mainOptions"
          :chart-data="{
            labels: labels,
            datasets: [
              {
                data: mainOptions.data,
                fill: true,
                borderColor: 'rgb(75, 192, 192)',
                backgroundColor: backgroundColors,
                tension: 0.1,
              },
            ],
          }"
        ></BarChart>

        <v-col class="ml-10">
          <v-row class="ml-n2 mb-6">
             <span class="text-h5 font-weight-bold grey--text text--darken-3">
            {{Math.round(((totalPriority + totalStandard) + Number.EPSILON) * 100) / 100 + ' GB'}}
          </span>
          </v-row>
         
          <v-row>
            <v-icon x-medium class="mt-0 mr-n12" color="rgb(75, 192, 192, 100%)"
              >mdi-brightness-1</v-icon
            >
            <span
              class="ml-12 pl-4 pt-0 text-center caption font-weight-bold grey--text text--darken-3"
            >
              {{ $vuetify.lang.t("$vuetify.DADOS_PRIORITARIOS") }}
            </span>
            <v-col cols="12">
                <span class="ml-8 pl-4 pt-0 text-center SUBTITLE-1 grey--text text--darken-3"
            >
              {{ totalPriority +' GB / ' + circuit.consumo.split('/')[1] + ' ' + $vuetify.lang.t("$vuetify.INCLUIDO")}}
            </span>
            </v-col>
          </v-row>
          <v-row class="mt-6">
            <v-icon x-medium class="mt-0 mr-n12" color="rgb(75, 192, 192, 30%)"
              >mdi-brightness-1</v-icon
            >
            <span
              class="ml-12 pl-4 pt-0 text-center caption font-weight-bold grey--text text--darken-3"
            >
              {{ $vuetify.lang.t("$vuetify.DADOS_PADRAO") }}
            </span>
             <v-col cols="12">
                <span class="ml-8 pl-4 pt-0 text-center SUBTITLE-1 grey--text text--darken-3"
            >
              {{ totalStandard + ' GB ' + $vuetify.lang.t("$vuetify.ILIMITADO")}}
            </span>
            </v-col>
          </v-row>
        </v-col>
      </v-row>

      <v-divider class="mt-0 mb-1"></v-divider>

      <v-card-actions class="justify-center">
        <v-btn
          color="primary"
          text
          @click="close(); clearFields()"
          :x-small="$vuetify.breakpoint.xs"
          >{{ $vuetify.lang.t("$vuetify.FECHAR") }}</v-btn
        >
        <v-spacer v-if="$vuetify.breakpoint.xs"></v-spacer>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import BarChart from "../charts/BarChart.js";
import DatePickerField from "../../components/fields/DatePickerField";

export default {
  components: {
    BarChart,
    DatePickerField,
  },
  props: {
    close: Function,
    show: Boolean,
    circuit: Object,
  },
  watch: {
    circuit() {
      this.searchConsumptions(this.interestDate);
    },
  },
  methods: {
    loadDataToCharts(chartInfo) {

      this.totalStandard = 0;
      this.totalPriority = 0;  
      this.mainOptions.data = [];

      for (var index in chartInfo) {
        var element = chartInfo[index];
        this.mainOptions.data.push(element["priorityGb"] > 0 ? element["priorityGb"]: element["standardGb"]);
        this.backgroundColors.push(
          element["priorityGb"] > 0 
            ? "rgb(75, 192, 192, 100%)"
            : "rgb(75, 192, 192, 30%)"
        );

        this.totalPriority += element["priorityGb"];
        this.totalStandard += element["standardGb"];
      }

      this.formatAxeLabels(chartInfo);
      this.totalPriority = Math.round((this.totalPriority + Number.EPSILON) * 100) / 100;
      this.totalStandard = Math.round((this.totalStandard + Number.EPSILON) * 100) / 100;
    },
    searchConsumptions(interestDate) {
      this.interestDate = interestDate;
      this.isLoading = true;
      this.$get("/consumo/busca", {
        designationTpz: this.circuit.nome,
        dateString:
          this.interestDate.split("-").length == 3
            ? this.interestDate
            : this.interestDate + "-01",
      }).then((response) => {
        this.loadDataToCharts(response.data);
        this.isLoading = false;
      });
    },
    formatAxeLabels(chartInfo) {
      this.labels = [];
      for (var index in chartInfo) {
        this.labels.push(this.$formatDate(chartInfo[index].date));
      }
    },
    clearFields(){
        this.totalStandard = 0;
        this.totalPriority = 0;
    },
  },
  data: () => ({
    totalStandard: 0,
    totalPriority: 0,
    backgroundColors: [],
    mainOptions: undefined,
    labels: [],
    isLoading: false,
    interestDate: new Date().toISOString().split("T")[0],
  }),
  created: function () {
    this.mainOptions = {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        yAxes: [
          {
            gridLines: { drawOnChartArea: false },
            ticks: {
              beginAtZero: true,
            }
          },
        ],
        xAxes: [
          {
            gridLines: { drawOnChartArea: false },
          },
        ],
      },
      tooltips:{
        callbacks:{
          label: function (tooltipItem){
            return tooltipItem.value + ' GB'
          }
        }
      },
      title: {
        display: true,
        fontSize: 18,
        text: this.$vuetify.lang.t("$vuetify.VALORES_GB"),
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
  },
};
</script>