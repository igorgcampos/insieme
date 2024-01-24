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
        {{ $vuetify.lang.t("$vuetify.DETALHES_DISPONIBILIDADE") }}
      </v-card-title>

      <v-list class="ma-0 pa-0 overflow-y-hidden mt-3" max-height="500">
        <v-row class="ma-0">
          <v-col class="col-2 ml-6 mt-n2">
            <LabelValue
              :label="$vuetify.lang.t('$vuetify.CIRCUITOS_ATIVOS')"
              :value="historic.circuitosAtivos"
              justify="start"
              style="width: 150px"
              customStyle="100px"
              truncate
            ></LabelValue>
          </v-col>

          <v-col class="col-3 ml-6 mt-n2">
            <LabelValue
              :label="$vuetify.lang.t('$vuetify.TOTAL_HORAS_PREVISTAS')"
              :value="Intl.NumberFormat('pt-BR').format(historic.totalHorasPrevistas)"
              justify="start"
              style="width: 150px"
              customStyle="100px"
              truncate
            ></LabelValue>
          </v-col>

          <v-col class="col-3 ml-6 mt-n2">
            <LabelValue
              :label="$vuetify.lang.t('$vuetify.TOTAL_HORAS_PERDIDAS')"
              :value="Intl.NumberFormat('pt-BR').format(historic.totalHorasPerdidas)"
              justify="start"
              style="width: 150px"
              customStyle="100px"
              truncate
            ></LabelValue>
          </v-col>

          <v-col class="col-2 ml-6 mt-n2">
            <LabelValue
              :label="$vuetify.lang.t('$vuetify.DPN_REDE')"
              :value="historic.percentualDisponibilidade
                  ? historic.percentualDisponibilidade.toFixed(2) + '%'
                  : '0%'"
              justify="start"
              style="width: 150px"
              customStyle="100px"
              truncate
            ></LabelValue>
          </v-col>
        </v-row>

        <span class="ml-7 text-caption primary--text font-weight-bold"
          >{{ $vuetify.lang.t("$vuetify.DISPONIBILIDADE_CIRCUITO") }}
        </span>

        <v-data-table
          :headers="headers"
          :items="formatData()"
          class="elevation-2 mt-2 mb-2 ml-7 mr-7 overflow-x-auto"
          fixed-header
          no-data-text="Sem informações"
          height="40vh"
          dense
        >
        </v-data-table>
      </v-list>

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
import LabelValue from "../../components/LabelValue";

export default {
  components: {
    LabelValue,
  },
  props: {
    close: Function,
    dialog: Boolean,
    historic: Object,
  },
  methods: {
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
      loadingApproval: false,
      headers: [
        {
          text: "Designacao Tpz",
          align: "center",
          sortable: false,
          value: "designacaoTpz",
          width: "9rem",
        },
        {
          text: "Tempo total de reparo (horas)",
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
  },
};
</script>