 <template>
  <v-dialog
    v-model="dialog"
    max-width="850"
    persistent
    class="overflow-y-hidden"
  >
    <v-card class="pt-2 pl-0 pr-0">
      <v-card-title
        class="headline-6 overflow-y-hidden"
        :class="{ 'subtitle-2': $vuetify.breakpoint.xs }"
        style="word-break: normal; !important"
      >
        {{ $vuetify.lang.t("$vuetify.RELATORIO_ANUAL") }}
      </v-card-title>

      <v-row align="center" no-gutters class="ml-8 mt-5">
        <v-col cols="2" class="pl-3 mr-1">
          <v-row>
            <span
              class="text-right subtitle-2 font-weight-bold grey--text text--lighten-1"
            >
              {{ $vuetify.lang.t("$vuetify.ANO") }}:</span
            >
          </v-row>
          <v-row md="3">
            <v-autocomplete
              :items="years"
              v-model="year"
              solo
              dense
              @change="searchAnnualHistory"
            >
            </v-autocomplete>
          </v-row>
        </v-col>
      </v-row>

      <v-row
        v-show="isLoading"
        class="mt-3 mb-5 ml-4 mr-4 justify-center"
        style="overflow-y: auto; height: 20vh"
      >
        <v-progress-circular
          :size="60"
          :width="3"
          color="red"
          indeterminate
          class="mt-12"
        ></v-progress-circular>
      </v-row>

      <WarningPanel
        class="mt-12 mb-12"
        :message="$vuetify.lang.t('$vuetify.NENHUM_RELATORIO')"
        v-show="!isLoading && annualReport.length == 0"
      ></WarningPanel>

      <v-row
        class="justify-center ml-6 mr-6"
        v-show="!isLoading && annualReport && annualReport.length > 0"
      >
        <BarChart
          :chart-data="chartData"
          :options="chartOptions"
          :styles="{
            height: '19rem',
            width: '80vw',
          }"
        ></BarChart>
      </v-row>

      <v-divider class="mt-5"></v-divider>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue darken-2" text @click="close()">
          {{ $vuetify.lang.t("$vuetify.FECHAR") }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import WarningPanel from "../../components/panels/WarningPanel";
import BarChart from "../charts/BarChart.js";

export default {
  components: { WarningPanel, BarChart },
  props: {
    close: Function,
    dialog: Boolean,
  },
  methods: {
    searchAnnualHistory() {
      this.isLoading = true;
      this.$get("/historico_disponibilidade/busca_anual", {
        contractId: window.sessionStorage.getItem("selectedContractId"),
        year: parseInt(this.year),
      }).then((response) => {
        this.isLoading = false;
        if (!response || !response.data) {
          return;
        }

        this.annualReport = response.data;
        this.chartData.datasets[0].data = this.annualReport;
      });
    },
    formatData() {
      if (
        !this.historic ||
        this.historic.disponibilidadeCircuitos.length == 0
      ) {
        return;
      }

      var disponibilidadeCircuitos = [];
      for (var index in this.historic.disponibilidadeCircuitos) {
        var object = Object.assign(
          {},
          this.historic.disponibilidadeCircuitos[index]
        );

        object.designacaoTpz = object.circuito.nome;
        object.tempoReparoTotal = Intl.NumberFormat("pt-BR").format(
          this.historic.disponibilidadeCircuitos[index].tempoReparoTotal
        );

        object.percentualDisponibilidade =
          object.percentualDisponibilidade.toFixed(2) + "%";

        disponibilidadeCircuitos.push(object);
      }

      return disponibilidadeCircuitos;
    },
  },
  data() {
    return {
      years: [],
      annualReport: undefined,
      isLoading: false,
      year: undefined,
      chartData: {
        labels: [
          this.$vuetify.lang.t("$vuetify.JANEIRO"),
          this.$vuetify.lang.t("$vuetify.FEVEREIRO"),
          this.$vuetify.lang.t("$vuetify.MARCO"),
          this.$vuetify.lang.t("$vuetify.ABRIL"),
          this.$vuetify.lang.t("$vuetify.MAIO"),
          this.$vuetify.lang.t("$vuetify.JUNHO"),
          this.$vuetify.lang.t("$vuetify.JULHO"),
          this.$vuetify.lang.t("$vuetify.AGOSTO"),
          this.$vuetify.lang.t("$vuetify.SETEMBRO"),
          this.$vuetify.lang.t("$vuetify.OUTUBRO"),
          this.$vuetify.lang.t("$vuetify.NOVEMBRO"),
          this.$vuetify.lang.t("$vuetify.DEZEMBRO"),
        ],
        datasets: [
          {
            borderColor: "rgba(54, 162, 235, 1)",
            backgroundColor: "rgba(54, 162, 235, 0.5)",
            borderWidth: 2,
            data: [],
          },
        ],
      },
      chartOptions: {
        responsive: true,
        legend: { display: false },
        maintainAspectRatio: false,
        title: {
          display: true,
          text: this.$vuetify.lang.t("$vuetify.RELATORIO_MEDIO_MES"),
          fontSize: 16,
        },
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
      },
    };
  },
  created: function () {
    for (var index = 2024; index < 2125; index++) {
      this.years.push(index);
    }

    this.year = new Date().getFullYear();
    this.searchAnnualHistory();
  },
};
</script>