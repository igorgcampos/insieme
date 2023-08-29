<template>
  <v-card>
    <v-row>
      <v-spacer></v-spacer>
      <v-col cols="12">
        <v-spacer></v-spacer>
        <v-chip
          label
          class="caption mb-0 mt-2"
          :color="
            invoicingHistory && invoicingHistory.aprovado
              ? 'success font-weight-bold'
              : 'grey font-weight-bold'
          "
          :text-color="
            invoicingHistory && invoicingHistory.aprovado
              ? 'success font-weight-bold'
              : 'grey font-weight-bold'
          "
          small
          outlined
        >
          {{
            invoicingHistory && invoicingHistory.aprovado
              ? $formatDate(interestDate, true) +
                " - " +
                $vuetify.lang.t("$vuetify.FATURAMENTO_APROVADO")
              : $formatDate(interestDate, true) +
                " - " +
                $vuetify.lang.t("$vuetify.FATURAMENTO_NAO_APROVADO")
          }}
        </v-chip>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="9">
        <v-list class="ma-0 pa-0 overflow-y-hidden mt-2" max-height="530">
          <span
            class="ml-2 mt-n2 caption blue--text"
            v-show="activatedCircuits > 0"
            >{{
              $vuetify.lang.t("$vuetify.CIRCUITOS_ATIVADOS", activatedCircuits)
            }}</span
          >

          <span
            v-if="invoicingHistory.descontos > 0"
            class="ml-5 mt-n2 caption blue--text"
            v-show="activatedCircuits > 0"
            >{{
              $vuetify.lang.t(
                "$vuetify.DESCONTOS_APLICADOS",
                Intl.NumberFormat("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                }).format(invoicingHistory.descontos)
              )
            }}</span
          >

          <v-data-table
            id="table"
            :headers="headers"
            :items="formatData()"
            item-class="color"
            class="elevation-2 mt-2 mb-2 ml-2 overflow-x-auto"
            fixed-header
            :no-data-text="''"
            height="330"
            dense
            :items-per-page="15"
            :search="search"
            :custom-filter="filterDesigTpz"
          >
            <template v-slot:top>
              <v-col cols="4">
                <v-text-field
                  v-model="search"
                  label="Buscar por qualquer campo"
                  class="mt-3 mb-n3"
                  :outlined="true"
                  dense
                ></v-text-field>
              </v-col>
            </template>
          </v-data-table>
        </v-list>
      </v-col>
      <v-col cols="3">
        <v-row class="mt-0 justify-center">
          <v-col class="flex-grow-0">
            <CountCard
              :count="calculateTotal('valorLocacao').strValue"
              :message="'Total de locação'"
              color="primary--text font-weight-bold"
              :smallText="true"
              :smallCount="true"
              :func="goToColumn"
              :funcParam="'location'"
            ></CountCard
          ></v-col>
          <v-col class="flex-grow-0">
            <CountCard
              :count="calculateTotal('valorAssistenciaTecnica').strValue"
              :message="'Total assist. técnica'"
              color="primary--text font-weight-bold"
              :smallText="true"
              :smallCount="true"
              :func="goToColumn"
              :funcParam="'assistTech'"
            ></CountCard
          ></v-col>
          <v-col class="flex-grow-0">
            <CountCard
              :count="calculateTotal('valorTelecom').strValue"
              :message="'Total de Telecom'"
              color="primary--text font-weight-bold"
              :smallText="true"
              :smallCount="true"
              :func="goToColumn"
              :funcParam="'telecom'"
            ></CountCard
          ></v-col>
          <v-col class="flex-grow-0">
            <CountCard
              :count="calculateTotal('valorInstalacao').strValue"
              :message="'Total de instalações'"
              color="primary--text font-weight-bold"
              :smallText="true"
              :smallCount="true"
              :func="goToColumn"
              :funcParam="'installations'"
            ></CountCard
          ></v-col>
          <v-col class="flex-grow-0">
            <CountCard
              :count="calculateTotal('valorCustosExtrasServicos').strValue"
              :message="'Total de custos extras'"
              color="primary--text font-weight-bold"
              :smallText="true"
              :smallCount="true"
              :func="goToColumn"
              :funcParam="'extraCosts'"
            ></CountCard
          ></v-col>
          <v-col class="flex-grow-0">
            <CountCard
              :count="calculateTotal('valorServicos').strValue"
              :message="'Total de outros serviços'"
              color="primary--text font-weight-bold"
              :smallText="true"
              :smallCount="true"
              :func="goToColumn"
              :funcParam="'services'"
            ></CountCard
          ></v-col>
          <v-col class="flex-grow-0">
            <CountCard
              :count="calculateTotal('valorCustosExtrasManutencoes').strValue"
              :message="'Total de outros custos'"
              color="primary--text font-weight-bold"
              :smallText="true"
              :smallCount="true"
              :func="goToColumn"
              :funcParam="'otherCosts'"
            ></CountCard
          ></v-col>
          <v-col class="flex-grow-0">
            <CountCard
              :count="calculateTotal('total').strValue"
              :message="'Total'"
              color="success--text font-weight-bold"
              :smallCount="
                calculateTotal('total').numberValue > 999 ? true : false
              "
              :func="goToColumn"
              :funcParam="'total'"
            ></CountCard
          ></v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-card>
</template>

<script>
import CountCard from "../components/cards/CountCard";

export default {
  components: {
    CountCard,
  },
  props: {
    invoicingHistory: Object,
    interestDate: Date,
  },
  created: function () {
    this.headers.forEach((h) => (h.class = "black--text caption1"));
  },
  methods: {
    exportCSV() {
      if (!this.invoicingHistory) return;

      var invoicings = JSON.parse(
        JSON.stringify(this.invoicingHistory.faturamentos)
      ).map((s) => {
        s.statusCircuito = s.circuito.statusCircuito + "";
        s.dataInstalacao = s.circuito.dataInstalacao
          ? s.circuito.dataInstalacao + ""
          : "--";
        s.designacaoTpz = s.circuito.nome + "";

        s.valorLocacao = Intl.NumberFormat("pt-BR", {
          style: "currency",
          currency: "BRL",
        }).format(s.valorLocacao);

        s.valorAssistenciaTecnica = Intl.NumberFormat("pt-BR", {
          style: "currency",
          currency: "BRL",
        }).format(s.valorAssistenciaTecnica);

        s.valorTelecom = Intl.NumberFormat("pt-BR", {
          style: "currency",
          currency: "BRL",
        }).format(s.valorTelecom);

        s.total = Intl.NumberFormat("pt-BR", {
          style: "currency",
          currency: "BRL",
        }).format(s.total);

        s.valorInstalacao = Intl.NumberFormat("pt-BR", {
          style: "currency",
          currency: "BRL",
        }).format(s.valorInstalacao);

        s.valorServicos = Intl.NumberFormat("pt-BR", {
          style: "currency",
          currency: "BRL",
        }).format(s.valorServicos);

        s.valorCustosExtrasServicos = Intl.NumberFormat("pt-BR", {
          style: "currency",
          currency: "BRL",
        }).format(s.valorCustosExtrasServicos);

        s.valorCustosExtrasManutencoes = Intl.NumberFormat("pt-BR", {
          style: "currency",
          currency: "BRL",
        }).format(s.valorCustosExtrasManutencoes);

        s.tipo = s.circuito.hub
          ? s.circuito.hub.tecnologia + " " + s.circuito.hub.banda
          : "--";

        s.perfil = s.circuito.modalidadeAtual
          ? s.circuito.modalidadeAtual.descricao
              .replaceAll(";", ".")
              .replaceAll("\n", " ")
              .replaceAll("\r", " ")
          : "--";

        return {
          [this.$vuetify.lang.t("$vuetify.DESIGNACAO_TPZ")]: s.designacaoTpz,
          [this.$vuetify.lang.t("$vuetify.STATUS_CIRCUITO")]: s.statusCircuito,
          [this.$vuetify.lang.t("$vuetify.TIPO")]: s.tipo,
          [this.$vuetify.lang.t("$vuetify.PERFIL")]: s.perfil,
          [this.$vuetify.lang.t("$vuetify.CIDADE")]: s.circuito.cidadeInstalacao
            ? s.circuito.cidadeInstalacao
                .replaceAll("\n", "")
                .replaceAll("\r", "")
                .replaceAll(/&amp;/g, "")
                .replaceAll(/#39;/g, "")
            : "--",
          ["UF"]: s.circuito.ufInstalacao
            ? s.circuito.ufInstalacao.replaceAll("\n", "").replaceAll("\r", "")
            : "--",
          [this.$vuetify.lang.t("$vuetify.DATA_ATIVACAO_CIRCUITO")]: s.circuito
            .dataInstalacao
            ? s.circuito.dataInstalacao
            : "--",
          [this.$vuetify.lang.t("$vuetify.INICIO_MEDICAO")]: s.inicioMedicao,
          [this.$vuetify.lang.t("$vuetify.FINAL_MEDICAO")]: s.fimMedicao,
          [this.$vuetify.lang.t("$vuetify.NUMERO_DIAS")]: s.numeroDias,
          [this.$vuetify.lang.t("$vuetify.LOCACAO")]: s.valorLocacao,
          [this.$vuetify.lang.t("$vuetify.ASSISTENCIA_TECNICA")]:
            s.valorAssistenciaTecnica,
          ["TELECOM"]: s.valorTelecom,
          [this.$vuetify.lang.t("$vuetify.INSTALACAO")]: s.valorInstalacao,
          [this.$vuetify.lang.t("$vuetify.SERVICOS")]: s.valorServicos,
          [this.$vuetify.lang.t("$vuetify.CUSTOS_EXTRAS")]:
            s.valorCustosExtrasServicos,
          [this.$vuetify.lang.t("$vuetify.CUSTOS_EXTRAS_MANUTENCOES")]:
            s.valorCustosExtrasManutencoes,
          [this.$vuetify.lang.t("$vuetify.DESCONTOS")]: s.descontos
            ? Intl.NumberFormat("pt-BR", {
                style: "currency",
                currency: "BRL",
              }).format(s.descontos)
            : "--",
          [this.$vuetify.lang.t("$vuetify.TOTAL")]: s.total,
        };
      });

      this.addTotalsToCsv(invoicings);

      this.$downloadCSV(
        invoicings,
        this.contract.nome +
          "-" +
          this.$vuetify.lang.t("$vuetify.FATURAMENTO") +
          "-" +
          this.interestDate
      );
    },
    addTotalsToCsv(invoicings) {
      invoicings.push({ [""]: "" });

      let total = 0;
      this.invoicingHistory.faturamentos.forEach((item) => {
        total += item.total;
      });

      total = total - (this.invoicingHistory.descontos || 0);

      let totalLocacao = 0;
      this.invoicingHistory.faturamentos.forEach((item) => {
        totalLocacao += item.valorLocacao;
      });

      let totalAssistencia = 0;
      this.invoicingHistory.faturamentos.forEach((item) => {
        totalAssistencia += item.valorAssistenciaTecnica;
      });

      let totalTelecom = 0;
      this.invoicingHistory.faturamentos.forEach((item) => {
        totalTelecom += item.valorTelecom;
      });

      let totalInstalacoes = 0;
      this.invoicingHistory.faturamentos.forEach((item) => {
        totalInstalacoes += item.valorInstalacao;
      });

      let totalCustos = 0;
      this.invoicingHistory.faturamentos.forEach((item) => {
        totalCustos += item.valorCustosExtrasServicos;
      });

      let totalOutrosServicos = 0;
      this.invoicingHistory.faturamentos.forEach((item) => {
        totalOutrosServicos += item.valorServicos;
      });

      let totalOutrosCustos = 0;
      this.invoicingHistory.faturamentos.forEach((item) => {
        totalOutrosCustos += item.valorCustosExtrasManutencoes;
      });

      invoicings.push({
        [""]:
          this.$vuetify.lang.t("$vuetify.TOTAL_LOCACAO") +
          ": " +
          Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency: "BRL",
          }).format(totalLocacao),
      });

      invoicings.push({
        [""]:
          this.$vuetify.lang.t("$vuetify.TOTAL_ASSISTENCIA") +
          ": " +
          Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency: "BRL",
          }).format(totalAssistencia),
      });

      invoicings.push({
        [""]:
          this.$vuetify.lang.t("$vuetify.TOTAL_TELECOM") +
          ": " +
          Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency: "BRL",
          }).format(totalTelecom),
      });

      invoicings.push({
        [""]:
          this.$vuetify.lang.t("$vuetify.FATURAMENTO") +
          ": " +
          Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency: "BRL",
          }).format(totalInstalacoes),
      });

      invoicings.push({
        [""]:
          this.$vuetify.lang.t("$vuetify.TOTAL_CUSTOS_EXTRAS") +
          ": " +
          Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency: "BRL",
          }).format(totalCustos),
      });

      invoicings.push({
        [""]:
          this.$vuetify.lang.t("$vuetify.TOTAL_OUTROS_SERVICOS") +
          ": " +
          Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency: "BRL",
          }).format(totalOutrosServicos),
      });

      invoicings.push({
        [""]:
          this.$vuetify.lang.t("$vuetify.TOTAL_CUSTOS_MANUTENCOES") +
          ": " +
          Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency: "BRL",
          }).format(totalOutrosCustos),
      });

      invoicings.push({
        [""]:
          this.$vuetify.lang.t("$vuetify.DESCONTOS_SLA") +
          ": " +
          Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency: "BRL",
          }).format(this.invoicingHistory.descontos),
      });

      invoicings.push({
        [""]:
          this.$vuetify.lang.t("$vuetify.TOTAL") +
          ": " +
          Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency: "BRL",
          }).format(total),
      });
    },
    filterDesigTpz(value, search) {
      return (
        value != null &&
        search != null &&
        typeof value === "string" &&
        value.toString().toUpperCase().indexOf(search.toUpperCase()) !== -1
      );
    },
    closeMaintenanceCostsDialog() {
      this.showMaintenanceCosts = false;
    },
    closeCostsDialog() {
      this.showCosts = false;
    },
    closeServicesDialog() {
      this.showServices = false;
    },
    closeImproductiveDialog() {
      this.showImproductives = false;
    },
    openDialog(name) {
      if (name == "improdutivas") {
        this.showImproductives = true;
      } else if (name == "servicos") {
        this.showServices = true;
      } else if (name == "custos") {
        this.showCosts = true;
      } else if (name == "custos_extras_manutencao") {
        this.showMaintenanceCosts = true;
      }
    },
    goToColumn(column) {
      this.headers.forEach((h) => (h.class = "black--text caption1"));

      if (column == "location") {
        this.styleHeader("Locação", 600);
      } else if (column == "total") {
        this.styleHeader("Total", 650);
      } else if (column == "telecom") {
        this.styleHeader("Telecom", 650);
      } else if (column == "assistTech") {
        this.styleHeader("Assistência técnica", 650);
      } else if (column == "installations") {
        this.styleHeader("Instalação", 650);
      }

      this.$forceUpdate();
    },
    styleHeader(name, offset) {
      this.headers.filter((h) => h.text == name)[0].class =
        "white--text caption1 blue";
      document.getElementsByClassName("v-data-table__wrapper")[0].scrollLeft =
        offset;
    },
    calculateTotal(name) {
      var total = 0;
      this.invoicingHistory.faturamentos.forEach(
        (i) => (total += i[name] || 0)
      );

      if (name == "total") {
        total -= this.invoicingHistory.descontos;
      }

      return {
        strValue: Intl.NumberFormat("pt-BR", {
          style: "currency",
          currency: "BRL",
        }).format(total),
        numberValue: total,
      };
    },
    formatData() {
      if (
        !this.invoicingHistory.faturamentos ||
        this.invoicingHistory.faturamentos.length == 0
      ) {
        return;
      }

      var invoicings = [];
      for (var index in this.invoicingHistory.faturamentos) {
        var object = Object.assign(
          {},
          this.invoicingHistory.faturamentos[index]
        );

        object.designacaoTpz =
          this.invoicingHistory.faturamentos[index].circuito.nome;

        object.designacao3 =
          this.invoicingHistory.faturamentos[index].circuito.designacao3;

        object.designacaoCliente =
          this.invoicingHistory.faturamentos[index].circuito.designacaoCliente;

        object.valorInstalacao = Intl.NumberFormat("pt-BR", {
          style: "currency",
          currency: "BRL",
        }).format(this.invoicingHistory.faturamentos[index].valorInstalacao);

        object.valorTelecom = Intl.NumberFormat("pt-BR", {
          style: "currency",
          currency: "BRL",
        }).format(this.invoicingHistory.faturamentos[index].valorTelecom);

        object.valorAssistenciaTecnica = Intl.NumberFormat("pt-BR", {
          style: "currency",
          currency: "BRL",
        }).format(
          this.invoicingHistory.faturamentos[index].valorAssistenciaTecnica
        );

        object.total = Intl.NumberFormat("pt-BR", {
          style: "currency",
          currency: "BRL",
        }).format(this.invoicingHistory.faturamentos[index].total);

        if (this.invoicingHistory.faturamentos[index].circuito.statusInstalacao) {
          object.statusInstalacao = this.$vuetify.lang.t(
            "$vuetify." +
              this.invoicingHistory.faturamentos[index].circuito.statusInstalacao
          );
        }

        object.dataInstalacao = this.$formatDate(
          this.invoicingHistory.faturamentos[index].circuito.dataInstalacao
        );

        invoicings.push(object);
      }

      this.activatedCircuits = this.invoicingHistory.faturamentos
        ? this.invoicingHistory.faturamentos.filter(
            (i) => i.circuito.statusCircuito == "ATIVADO"
          ).length
        : 0;

      return invoicings;
    },
  },
  data: () => ({
    search: "",
    showMaintenanceCosts: false,
    showCosts: false,
    showServices: false,
    showImproductives: false,
    column: undefined,
    activatedCircuits: 0,
    headers: [
      {
        text: "Designação Tpz",
        align: "center",
        sortable: false,
        value: "designacaoTpz",
        width: "11rem",
      },
      {
        text: "Designação Cliente",
        align: "center",
        sortable: false,
        value: "designacao3",
        width: "20rem",
      },
      {
        text: "Status",
        align: "center",
        sortable: false,
        value: "statusInstalacao",
        width: "9rem",
      },
      {
        text: "PC",
        align: "center",
        sortable: false,
        value: "designacaoCliente",
        width: "11rem",
      },
      {
        text: "Data ativação",
        align: "center",
        sortable: false,
        value: "dataInstalacao",
        width: "9rem",
      },
      {
        text: "Nº de dias",
        align: "center",
        sortable: false,
        value: "numeroDias",
        width: "6rem",
      },
      {
        text: "Locação",
        align: "center",
        sortable: false,
        value: "valorLocacao",
        width: "10%",
      },
      {
        text: "Assistência técnica",
        align: "center",
        sortable: false,
        value: "valorAssistenciaTecnica",
        width: "10%",
      },
      {
        text: "Telecom",
        align: "center",
        sortable: false,
        value: "valorTelecom",
        width: "10%",
      },
      {
        text: "Instalação",
        align: "center",
        sortable: false,
        value: "valorInstalacao",
        width: "10%",
      },
      {
        text: "Total",
        align: "center",
        sortable: false,
        value: "total",
        width: "10%",
      },
    ],
  }),
};
</script>
