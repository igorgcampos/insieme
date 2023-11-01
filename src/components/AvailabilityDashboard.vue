<template>
  <v-div class="ma-0">
    <v-row v-if="historic.disponibilidades.length > 0">
      <v-col cols="12">
        <v-row>
          <span class="ml-3 text-subtitle-1 primary--text font-weight-bold">{{
            $vuetify.lang.t("$vuetify.RELATORIO_CHAMADOS")
          }}</span>
          <v-spacer></v-spacer>
          <TooltipButton 
                        :label="$vuetify.lang.t('$vuetify.EXPORTAR_CSV')"
                        :message="$vuetify.lang.t('$vuetify.EXPORTAR_CSV')"
                        :event="exportToCSV"
                        mobile="true"
                        :isText="false"
                        :marginRight="true"
          ></TooltipButton>
        </v-row>
        <v-data-table
          id="table"
          :headers="headers"
          :items="formatData()"
          item-class="color"
          class="elevation-2 mt-2 mb-2 overflow-x-auto"
          fixed-header
          :no-data-text="''"
          height="350"
          dense
          :items-per-page="15"
          :search="search"
          :custom-filter="filterDesigTpz"
        >
          <template v-slot:top>
            <v-col cols="4">
              <v-text-field
                v-model="search"
                :label="$vuetify.lang.t('$vuetify.BUSCAR_QUALQUER_CAMPO')"
                class="mt-3 mb-n3"
                :outlined="true"
                dense
              ></v-text-field>
            </v-col>
          </template>
        </v-data-table>
      </v-col>
    </v-row>
    <v-row v-if="historic.disponibilidades.length == 0">
       <SuccessPanel :title="$vuetify.lang.t('$vuetify.DISPONIBILIDADE_100')" 
                    :subtitle="$vuetify.lang.t('$vuetify.NENHUM_INCIDENTE')">
      </SuccessPanel>
    </v-row>
  </v-div>
</template>

<script>
import SuccessPanel from "../components/panels/SuccessPanel";
import TooltipButton from "../components/TooltipButton";
export default {
  components: {
    SuccessPanel,
    TooltipButton,
  },
  props: {
    historic: Object,
  },
  created: function () {
    this.createHeaders();
  },
  methods: {
    exportToCSV(){
      var all = this.historic.disponibilidades.map((d) => {
            d.dataEntrada = d.dataEntrada
              ? this.$formatDate(d.dataEntrada)
              : "--";

            delete d.id;
            delete d.createdOn;
            delete d.updatedOn;

            return {
              [this.$vuetify.lang.t("$vuetify.NUMERO_INCIDENTE")]: d.numeroIncidente,
              [this.$vuetify.lang.t("$vuetify.ASSUNTO")]: d.descricao,
              [this.$vuetify.lang.t("$vuetify.TEMPO_CONSIDERADO")]: Intl.NumberFormat("pt-BR").format(d.tempoConsideradoEmHoras),
              [this.$vuetify.lang.t("$vuetify.TEMPO_REPARO")]: Intl.NumberFormat("pt-BR").format(d.tempoReparoEmHoras),
              [this.$vuetify.lang.t("$vuetify.CATEGORIA")]: d.categoria,
              [this.$vuetify.lang.t("$vuetify.DESIGNACAO_TPZ")]: d.circuito.nome,
              [this.$vuetify.lang.t("$vuetify.TIPOS_CAUSA")]: d.causa,
              [this.$vuetify.lang.t("$vuetify.TIPO_PERDA")]: d.tipoPerda,
              [this.$vuetify.lang.t("$vuetify.OBSERVACOES")]: d.observacoes,
              [this.$vuetify.lang.t("$vuetify.DATA_CRIACAO")]: this.$formatDate(d.dataCriacao.date) + " " + 
              this.$formatHour(d.dataCriacao.time, true),
              [this.$vuetify.lang.t("$vuetify.DATA_CONCLUSAO")]: this.$formatDate(d.dataFechamento.date) + " " + 
              this.$formatHour(d.dataFechamento.time, true),
            };
          });

          this.$downloadCSV(all, this.historic.contrato.nome + '-' + 
          this.$vuetify.lang.t("$vuetify.DISPONIBILIDADES") + '-' + 
          this.$formatDate(this.historic.dataHistorico, true));
    },
    filterDesigTpz(value, search) {
      return (
        value != null &&
        search != null &&
        typeof value === "string" &&
        value.toString().toUpperCase().indexOf(search.toUpperCase()) !== -1
      );
    },
    formatData() {
      if (
        !this.historic.disponibilidades ||
        this.historic.disponibilidades.length == 0
      ) {
        return;
      }

      var availabilities = [];
      for (var index in this.historic.disponibilidades) {
        var object = Object.assign({}, this.historic.disponibilidades[index]);

        object.designacaoTpz =
          this.historic.disponibilidades[index].circuito.nome;

        object.dataCriacao =
          this.$formatDate(object.dataCriacao.date) +
          " " + this.$formatHour(object.dataCriacao.time, true);

        object.dataFechamento =
          this.$formatDate(object.dataFechamento.date) +
          " " + this.$formatHour(object.dataFechamento.time, true);

        object.tempoReparoEmHoras =  Intl.NumberFormat("pt-BR").format(object.tempoReparoEmHoras);
        object.tempoConsideradoEmHoras =  Intl.NumberFormat("pt-BR").format(object.tempoConsideradoEmHoras);

        availabilities.push(object);
      }

      return availabilities;
    },
    createHeaders() {
      this.headers = [
        {
          text: this.$vuetify.lang.t("$vuetify.NUMERO"),
          align: "center",
          sortable: false,
          value: "numeroIncidente",
          width: "11rem",
        },
        {
          text: this.$vuetify.lang.t("$vuetify.ASSUNTO"),
          align: "center",
          sortable: false,
          value: "descricao",
          width: "13rem",
        },
        {
          text: this.$vuetify.lang.t("$vuetify.TEMPO_CONSIDERADO"),
          align: "center",
          sortable: false,
          value: "tempoConsideradoEmHoras",
          width: "6rem",
        },
        {
          text: this.$vuetify.lang.t("$vuetify.TEMPO_REPARO"),
          align: "center",
          sortable: false,
          value: "tempoReparoEmHoras",
          width: "6rem",
        },
        {
          text: this.$vuetify.lang.t("$vuetify.CATEGORIA"),
          align: "center",
          sortable: false,
          value: "categoria",
          width: "6rem",
        },
        {
          text: this.$vuetify.lang.t("$vuetify.DESIGNACAO_TPZ"),
          align: "center",
          sortable: false,
          value: "designacaoTpz",
          width: "11rem",
        },
        {
          text: this.$vuetify.lang.t("$vuetify.TIPOS_CAUSA"),
          align: "center",
          sortable: false,
          value: "causa",
          width: "11rem",
        },
        {
          text: this.$vuetify.lang.t("$vuetify.TIPO_PERDA"),
          align: "center",
          sortable: false,
          value: "tipoPerda",
          width: "11rem",
        },
        {
          text: this.$vuetify.lang.t("$vuetify.OBSERVACOES"),
          align: "center",
          sortable: false,
          value: "observacoes",
          width: "13rem",
        },
        {
          text: this.$vuetify.lang.t("$vuetify.DATA_CRIACAO"),
          align: "center",
          sortable: false,
          value: "dataCriacao",
          width: "11rem",
        },
        {
          text: this.$vuetify.lang.t("$vuetify.DATA_CONCLUSAO"),
          align: "center",
          sortable: false,
          value: "dataFechamento",
          width: "11rem",
        },
      ];

      this.headers.forEach((h) => (h.class = "black--text caption1"));
    },
  },
  data: () => ({
    search: "",
    headers: [],
  }),
};
</script>