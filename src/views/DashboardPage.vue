<template>
  <v-content>
    <v-container column align-center style="max-width: 1200px">
      <v-row justify="center">
        
        <v-col
          class="mt-n12 mr-3"
          style="position: fixed; z-index: 111;"
          v-show="circuits.length > 0"
        >
          <v-row class="mb-3 mr-3">
            <v-spacer></v-spacer>
            <v-tooltip :top="!bottom" :bottom="bottom">
              <template v-slot:activator="{ on }">
                <v-badge :value="true"
                color="primary"
                overlap
                :content="circuits.length"
                offset-x="12"
                offset-y="12"
                class="ml-n12 mt-0">
                  <v-btn
                    v-on="on || on1"
                    class="mr-0"
                    fab
                    dark
                    x-small
                    @click="showRestarts = !showRestarts"
                    color="red darken-1"
                  >
                    <v-icon dark>
                      {{ showRestarts ? "mdi-menu-up" : "mdi-menu-down" }}
                    </v-icon>
                  </v-btn>
                </v-badge>
              </template>
              <span
                style="max-width: 200px; word-wrap: break-word; display: block"
                >{{
                  showRestarts
                    ? $vuetify.lang.t("$vuetify.ESCONDER_RESTARTS")
                    : $vuetify.lang.t("$vuetify.MOSTRAR_RESTARTS")
                }}</span
              >
            </v-tooltip>
          </v-row>
        </v-col>

        <v-col cols="3"
          class="mt-n2 ma-5 mr-3 ml-6 overflow-y-auto overflow-x-hidden"
          style="max-height: 650px; position: fixed; z-index: 110;"
        >
          <v-row
            v-for="(circuit, i) in circuits"
            :key="i"
            class="mt-2 ml-2 mr-3 mb-5"
            v-show="showRestarts"
          >
            <v-spacer></v-spacer>
            <RestartCard :circuit="circuit"></RestartCard>
          </v-row>
        </v-col>

        <v-row
          class="offset-7 mt-n12"
          :class="{
            'offset-9': $vuetify.breakpoint.xs || $vuetify.breakpoint.sm,
          }"
          style="position: fixed; z-index: 100"
        >
          <v-lazy
            :options="{
              threshold: 0.6,
            }"
            transition="slide-y-transition"
            class="mt-n3"
          >
            <v-btn
              color="red darken-1"
              class="white--text pt-7 pb-5 mt-n12 mr-12"
              :class="{
                'pt-8':
                  $vuetify.breakpoint.xs ||
                  $vuetify.breakpoint.md ||
                  $vuetify.breakpoint.sm,
              }"
              @click="openFeedBack()"
              x-small
              depressed
            >
              <v-icon
                left
                dark
                small
                class="ml-0"
                :class="{ 'ml-2': $vuetify.breakpoint.xs }"
                >mdi-comment-processing</v-icon
              >
              {{
                !$vuetify.breakpoint.xs
                  ? $vuetify.lang.t("$vuetify.FEEDBACK")
                  : ""
              }}
            </v-btn>
          </v-lazy>
        </v-row>

        <v-col md="6" lg="10" xl="12" sm="12" xs="12" xm="12" class="mt-n11">
          <v-row class="mb-n2 mt-n3 ml-n12 mb-6">
            <span
              class="
                mb-7
                text-right
                subtitle-1
                font-weight-bold
                grey--text
                text--darken-1
              "
            >
              {{
                $vuetify.lang.t("$vuetify.CONTRATO_SELECIONADO") +
                ": " +
                selectedContract.numeroContratoTpz
              }}
            </span>
          </v-row>

          <CircuitsPage
            v-if="
              $hasProfile('Administrador') ||
              $hasProfile('Cliente') ||
              $hasProfile('Operacional')
            "
            :contract="selectedContract"
          ></CircuitsPage>
          <InvoicesPage
            v-if="
              $hasProfile('Administrador') ||
              $hasProfile('Cliente') ||
              $hasProfile('Financeiro')
            "
            :contract="selectedContract"
          ></InvoicesPage>
          <CommercialPage
            v-if="
              $hasProfile('Administrador') ||
              $hasProfile('Cliente') ||
              $hasProfile('Comercial')
            "
            :contract="selectedContract"
          ></CommercialPage>
          <IssuesPage
            :contract="selectedContract"
            :proactivity="undefined"
          ></IssuesPage>
        </v-col>
      </v-row>

      <FeedbackDialog
        :show="showFeedBack"
        :close="closeFeedback"
        :entity="entity"
      >
      </FeedbackDialog>
    </v-container>
  </v-content>
</template>

<script>
import CircuitsPage from "./CircuitsPage";
import InvoicesPage from "./InvoicesPage";
import IssuesPage from "./IssuesPage";
import CommercialPage from "./CommercialPage";
import FeedbackDialog from "../components/dialogs/FeedbackDialog";
import RestartCard from "../components/cards/RestartCard";

export default {
  components: {
    CircuitsPage,
    InvoicesPage,
    IssuesPage,
    CommercialPage,
    FeedbackDialog,
    RestartCard,
  },
  data: () => ({
    showFeedBack: false,
    show: false,
    selectedContract: undefined,
    entity: undefined,
    showRestarts: true,
    circuits: [{designacaoTpz: 'TEC-0001-RJ-H14'}, {}, {}, {}, {}, {}],
  }),
  props: {
    contract: Object,
  },
  methods: {
    openFeedBack(notification) {
      if (notification) {
        this.entity = {
          issue: { id: notification.mensagem.split(":")[0] },
          notification: notification,
        };
        this.$root.$emit("search-issue", notification.mensagem.split(":")[1]);
        return;
      }

      this.showFeedBack = true;
    },
    closeFeedback() {
      this.showFeedBack = false;
    },
  },
  created: function () {
    this.selectedContract = this.$props.contract;
    if (!this.selectedContract) {
      if (!window.sessionStorage.getItem("selectedContractId")) {
        this.$router.push({ name: "Contracts", params: { client: undefined } });
        return;
      } else
        this.selectedContract = {
          id: window.sessionStorage.getItem("selectedContractId"),
          numeroContratoTpz: window.sessionStorage.getItem(
            "selectedContractTpz"
          ),
        };
    } else {
      window.sessionStorage.setItem(
        "selectedContractId",
        this.selectedContract.id
      );
      window.sessionStorage.setItem(
        "selectedContractTpz",
        this.selectedContract.numeroContratoTpz
      );
    }

    this.$root.$on("open-feedback", (notification) => {
      this.openFeedBack(notification);
    });

    this.$root.$on("go-to", (target) => {
      var element = document.getElementById(target);

      this.$vuetify.goTo(element, {
        duration: 200,
        offset: 25,
        easing: "linear",
      });
    });
  },
};
</script>
