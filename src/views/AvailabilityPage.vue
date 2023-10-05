<template>
  <v-layout column align-center v-scroll="searchMore">
    <v-col cols="10" md="9" lg="10" xl="8" sm="10" xs="2" xm="2" class="mt-8">
      <div>
        <v-row :class="{ 'ml-n12': $vuetify.breakpoint.mdAndUp }">
          <span
            class="mb-7 text-right display-1 font-weight-bold grey--text text--darken-1"
          >
            {{ $vuetify.lang.t("$vuetify.DISPONIBILIDADES") }}
          </span>
        </v-row>

        <v-row id="filtro" class="pl-3 ml-n2 grey lighten-5">
          <v-col cols="2" class="ml-5 pl-3 mr-1">
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

        <v-row class="pl-3 mt-n3">
          <v-expansion-panels class="ma-1">
            <v-expansion-panel
              v-for="(historic, i) in historics"
              :key="i"
              hide-actions
            >
              <v-expansion-panel-header style="z-index: 1000">
                <v-row align="center" no-gutters>
                  <v-col v-show="!$vuetify.breakpoint.xs" sm="5" md="4">
                    <strong
                      class="subtitle-2 font-weight-bold"
                      v-html="historic.contrato.nome"
                    ></strong>
                  </v-col>
                  <v-spacer></v-spacer>

                  <v-chip
                    color="blue darken-2"
                    class="ml-0 mr-3"
                    label
                    small
                    outlined
                  >
                    {{ $formatDate(interestDate, true) }}
                  </v-chip>
                </v-row>
              </v-expansion-panel-header>

              <v-expansion-panel-content>
                <AvailabilityDashboard :historic="historic">
                </AvailabilityDashboard>
              </v-expansion-panel-content>
            </v-expansion-panel>
          </v-expansion-panels>
          <v-col v-if="historics.length == 0 && !isLoading">
            <v-lazy
              :options="{ threshold: 0.6 }"
              transition="slide-x-transition"
            >
              <WarningPanel
                :message="$vuetify.lang.t('$vuetify.NENHUMA_DISPONIBILIDADE')"
              >
              </WarningPanel>
            </v-lazy>
          </v-col>
        </v-row>

        <v-row justify="center" v-if="isLoading" class="mt-5">
          <v-progress-circular
            :size="30"
            :width="4"
            color="red darken-2"
            indeterminate
          ></v-progress-circular>
        </v-row>
      </div>
    </v-col>
  </v-layout>
</template>

<script>
import WarningPanel from "../components/panels/WarningPanel";
import DatePickerField from "../components/fields/DatePickerField";
import AvailabilityDashboard from "../components/AvailabilityDashboard";

export default {
  components: {
    WarningPanel,
    DatePickerField,
    AvailabilityDashboard,
  },
  methods: {
    closeErrorDialog() {
      this.showErrorDialog = false;
    },
    closeSuccessDialog() {
      this.showSuccessDialog = false;
    },
    openFileDialog() {
      document.getElementById("file-upload").click();
    },
    searchDate(interestDate) {
      this.interestDate = interestDate;
      this.search();
    },
    configAndShowError(response) {
      if (response.data.message) {
        this.errorMessage = response.data.message;
        return true;
      } else {
        this.errorMessage = undefined;
        return false;
      }
    },
    searchMore() {
      if (this.cameFromCard) {
        return;
      }

      this.stickFilters();

      if (this.isLoding || this.noResult) {
        return;
      }

      if (
        document.documentElement.scrollTop + window.innerHeight + 1 >=
        document.documentElement.scrollHeight
      ) {
        this.page++;
        this.search(this.page);
      }
    },
    search(page) {
      if (!page) {
        this.page = 0;
        this.historics = [];
        this.noResult = false;
      }

      this.isLoading = true;

      this.$get("/historico_disponibilidade/busca", {
        contractId: window.sessionStorage.getItem("selectedContractId"),
        date:
          this.interestDate.split("-").length == 3
            ? this.interestDate
            : this.interestDate + "-01",
        page: this.page,
      }).then((response) => {
        this.isLoading = false;
        if (!response || (response && response.data.length == 0)) {
          this.noResult = true;
          return;
        }

        this.historics = this.historics.concat(response.data);
      });
    },
    stickFilters() {
      if (document.documentElement.scrollTop > 95) {
        document.getElementById("filtro").style =
          "position:sticky; z-index:2; top:66px; box-shadow: 0 0 10px #333; border-radius: 15px;";
      } else if (document.documentElement.scrollTop < 60) {
        document.getElementById("filtro").style = "";
      }
    },
  },
  data: () => ({
    page: 0,
    isLoading: true,
    noResult: false,
    searchText: "",
    historics: [],
    errorMessage: undefined,
    interestDate: new Date().toISOString().split("T")[0],
    isImporting: false,
    showErrorDialog: false,
    showSuccessDialog: false,
    excelFile: undefined,
  }),
  created: function () {
   this.search();
  },
};
</script>
