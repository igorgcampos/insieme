<template>
  <v-layout column align-center v-scroll="searchMore">
    <v-col cols="12" md="9" lg="8" xl="8" sm="12" xs="2" xm="2" class="mt-5">
      <div>
        <v-row :class="{ 'ml-n12': $vuetify.breakpoint.mdAndUp }">
          <span
            class="mb-7 text-right display-1 font-weight-bold grey--text text--darken-1"
          >
            {{ $vuetify.lang.t("$vuetify.CONTRATOS") }}</span
          >
        </v-row>

        <v-row id="filtro" class="pl-2 ml-n2 grey lighten-5">
          <v-col cols="4">
            <v-row>
              <span
                class="text-right subtitle-2 font-weight-bold grey--text text--lighten-1"
              >
                {{ $vuetify.lang.t("$vuetify.BUSCAR") }}:</span
              >
            </v-row>
            <v-row md="2">
              <v-text-field
                v-model.trim="searchText"
                dense
                label="Regular"
                :placeholder="$vuetify.lang.t('$vuetify.NOME_CODIGO')"
                single-line
                solo
                max-width="200"
                append-icon="mdi-magnify"
                @click:append="search()"
                @keypress.enter="search()"
              ></v-text-field>
            </v-row>
          </v-col>

          <v-col class="ml-5" cols="3">
            <v-row>
              <span
                class="text-right subtitle-2 font-weight-bold grey--text text--lighten-1"
              >
                {{ $vuetify.lang.t("$vuetify.TIPO") }}:</span
              >
            </v-row>
            <v-row>
              <v-select
                :items="types"
                v-model="type"
                :label="$vuetify.lang.t('$vuetify.TIPOS_CONTRATOS')"
                solo
                dense
                item-text="text"
                item-value="value"
                @change="search()"
              ></v-select>
            </v-row>
          </v-col>

          <v-col class="ml-5" cols="3">
            <v-row>
              <span
                class="text-right subtitle-2 font-weight-bold grey--text text--lighten-1"
              >
                {{ $vuetify.lang.t("$vuetify.STATUS") }}:</span
              >
            </v-row>
            <v-row>
              <v-select
                :items="statuses"
                v-model="status"
                :label="$vuetify.lang.t('$vuetify.ATIVO_EXPIRADO')"
                solo
                dense
                item-text="text"
                item-value="value"
                @change="search()"
              ></v-select>
            </v-row>
          </v-col>
        </v-row>

        <v-row class="pl-1">
          <v-col
            cols="12"
            class="flex-grow-0"
            v-for="(contract, i) in contracts"
            :key="i"
          >
            <v-lazy
              :options="{ threshold: 0.6 }"
              transition="slide-x-transition"
            >
              <ContractCard :contract="contract"></ContractCard>
            </v-lazy>
          </v-col>
          <v-col v-if="contracts.length == 0 && !isLoading">
            <v-lazy
              :options="{ threshold: 0.6 }"
              transition="slide-x-transition"
            >
              <WarningPanel
                :message="$vuetify.lang.t('$vuetify.NENHUM_CONTRATO')"
              >
              </WarningPanel>
            </v-lazy>
          </v-col>
        </v-row>

        <v-row justify="center" v-if="isLoading" class="mt-5">
          <v-progress-circular
            :size="40"
            :width="4"
            color="red"
            indeterminate
          ></v-progress-circular>
        </v-row>
      </div>
    </v-col>
  </v-layout>
</template>

<script>
import ContractCard from "../components/cards/ContractCard";
import WarningPanel from "../components/panels/WarningPanel";

export default {
  components: {
    ContractCard,
    WarningPanel,
  },
  methods: {
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
      if (this.$hasProfile("Administrador") && !page) {
        this.selectedClient.id = -1;
      }

      this.isLoading = true;
      if (!page) {
        this.page = 0;
        this.contracts = [];
        this.noResult = false;
        this.cameFromCard = false;
      }

      this.$get("/contrato/busca", {
        searchText: this.searchText,
        clientId: this.selectedClient.id,
        type: this.type,
        status: this.status,
        page: this.page,
      }).then((response) => {
        if (response && response.data.length == 0) {
          this.noResult = true;
        }

        this.contracts = this.contracts.concat(response.data);
        this.isLoading = false;
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
  props: {
    client: Object,
    contract: Object,
  },
  data: () => ({
    types: [],
    statuses: [],
    type: "TODOS",
    status: "TODOS",
    page: 0,
    isLoading: true,
    noResult: false,
    searchText: "",
    contracts: [],
    selectedClient: undefined,
  }),
  created: function () {
    this.$get("/contrato/tipos").then((response) => {
      this.types = response.data;

      var vm = this;
      this.types = this.types.map(function (t) {
        if (t == "LOCAÇÃO") t = "LOCACAO";
        return { text: vm.$vuetify.lang.t("$vuetify." + t), value: t };
      });
    });

    this.$get("/contrato/status").then((response) => {
      this.statuses = response.data;

      var vm = this;
      this.statuses = this.statuses.map(function (t) {
        return { text: vm.$vuetify.lang.t("$vuetify." + t), value: t };
      });
    });

    this.selectedClient = this.$props.client;

    if (!this.selectedClient) {
      if (!window.sessionStorage.getItem("selectedClientId"))
        this.selectedClient = { id: -1 };
      else
        this.selectedClient = {
          id: window.sessionStorage.getItem("selectedClientId"),
        };
    } else {
      window.sessionStorage.setItem("selectedClientId", this.selectedClient.id);
    }

    this.$getUser().then((user) => {
      if (user.contrato) {
        this.contracts = this.contracts.concat(user.contrato);

        if (this.contracts.length == 1 && this.$hasProfile("Operacional") && window.sessionStorage.getItem("contractSelected") == "false") {
          this.$root.$emit("contract-selected", this.contracts[0]);
          window.sessionStorage.setItem("contractSelected", "true");
        }

        this.isLoading = false;
        return;
      }

      if (!this.$props.contract) {
        this.$get("/contrato/busca", {
          searchText: "",
          clientId: this.selectedClient.id,
          type: this.type,
          status: this.status,
          page: 0,
        }).then((response) => {
          this.contracts = response.data;

          if (
            this.contracts.length == 1 && this.$hasProfile("Operacional")
          ) {
            this.$root.$emit("contract-selected", this.contracts[0]);
            window.sessionStorage.setItem("contractSelected", "true");
          }

          this.isLoading = false;
        });
      } else {
        this.contracts = [];
        this.contracts = this.contracts.concat(this.$props.contract);
        this.isLoading = false;
      }
    });
  },
};
</script>
