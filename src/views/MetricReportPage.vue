<template>
  <v-layout column align-center>
    <v-col cols="10" md="9" lg="10" xl="8" sm="10" xs="2" xm="2" class="mt-8">
      <div>
        <v-row :class="{ 'ml-n12': $vuetify.breakpoint.mdAndUp }">
          <span
            class="mb-7 text-right display-1 font-weight-bold grey--text text--darken-1"
          >
            {{ $vuetify.lang.t("$vuetify.BOLETINS_MEDICOES") }}</span
          >
        </v-row>

        <v-row id="filtro" class="pl-3 ml-0 grey lighten-5">
          <v-col cols="2" class="ml-0 pl-3 mr-1">
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
                :event="searchDate"
                type="month"
              ></DatePickerField>
            </v-row>
          </v-col>
        </v-row>
      </div>

      <v-row class="pl-3 mt-n3">
        <v-col cols="12" class="flex-grow-0" v-if="invoicingHistory && !isLoading">
          <v-lazy :options="{ threshold: 0.6 }" transition="slide-x-transition">
            <MetricReportDashboard :invoicingHistory="invoicingHistory" :interestDate="interestDate">
            </MetricReportDashboard>
          </v-lazy>
        </v-col>

        <v-col v-if="!invoicingHistory && !isLoading">
          <v-lazy :options="{ threshold: 0.6 }" transition="slide-x-transition">
            <WarningPanel :message="$vuetify.lang.t('$vuetify.NENHUM_BOLETIM')">
            </WarningPanel>
          </v-lazy>
        </v-col>
      </v-row>

      <v-row justify="center" v-if="isLoading" class="mt-5">
        <v-progress-circular
          :size="30"
          :width="4"
          color="red"
          indeterminate
        ></v-progress-circular>
      </v-row>
    </v-col>
  </v-layout>
</template>

<script>
import DatePickerField from "../components/fields/DatePickerField";
import WarningPanel from "../components/panels/WarningPanel";
import MetricReportDashboard from "../components/MetricReportDashboard";

export default {
  components: {
    WarningPanel,
    DatePickerField,
    MetricReportDashboard,
  },
  props: {
    contract: Object,
  },
  methods: {
    searchDate(interestDate) {
      this.interestDate = interestDate;
      this.search();
    },
    search() {
      this.isLoading = true;
      this.invoicingHistory = undefined;

      this.$get("/historico_faturamento/busca", {
        contractId: window.sessionStorage.getItem("selectedContractId"),
        date: this.interestDate.split("-").length == 3
            ? this.interestDate
            : this.interestDate + "-01",
      }).then((response) => {
        if (!response || (response && response.data.length == 0)) {
          this.isLoading = false;
          return;
        }

        this.invoicingHistory = response.data;
        this.isLoading = false;
      });
    },
  },
  data: () => ({
    invoicingHistory: undefined,
    isLoading: false,
    interestDate: new Date().toISOString().split("T")[0],
  }),
  created: function () {
    this.search(this.interestDate);
  },
};
</script>