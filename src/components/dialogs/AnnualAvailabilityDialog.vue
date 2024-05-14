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

      <v-row>
        <v-col cols="2" class="pl-3 mr-1">
          <v-row>
            <span
              class="text-right subtitle-2 font-weight-bold grey--text text--lighten-1"
            >
              {{ $vuetify.lang.t("$vuetify.ANO") }}:</span
            >
          </v-row>
          <v-row md="3">
            <v-autocomplete :items="years" v-model="year" solo dense @change="searchAnnualHistory">
            </v-autocomplete>
          </v-row>
        </v-col>
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
export default {
  components: {},
  props: {
    close: Function,
    dialog: Boolean,
  },
  methods: {
    searchAnnualHistory() {

      this.isLoading = true;
      this.$get("/historico_disponibilidade/busca_anual", {
        contractId: window.sessionStorage.getItem("selectedContractId"),
        date: this.year.split("-").length == 3 ? this.year : this.year + "-01",
      }).then((response) => {
        this.isLoading = false;
        if (!response || !response.data) {
          return;
        }

        this.annualReport = response.data;
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
      loadingApproval: false,
      headers: [
        {
          text: this.$vuetify.lang.t("$vuetify.DESIGNACAO_TPZ"),
          align: "center",
          sortable: false,
          value: "designacaoTpz",
          width: "9rem",
        },
        {
          text: this.$vuetify.lang.t("$vuetify.TEMPO_TOTAL_REPARO"),
          align: "center",
          sortable: false,
          value: "tempoReparoTotal",
          width: "8rem",
        },
        {
          text: "%",
          align: "center",
          sortable: false,
          value: "percentualDisponibilidade",
          width: "8rem",
        },
      ],
    };
  },
  created: function () {
    this.headers.forEach((h) => (h.class = "black--text caption1"));

    for (var index = 2024; index < 2125; index++) {
      this.years.push(index);
    }
  },
};
</script>