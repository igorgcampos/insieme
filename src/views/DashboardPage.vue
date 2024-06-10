<template>
  <v-content>
    <v-container column align-center>
      <v-row justify="center">

        <FeedbackButton :event="openFeedBack"></FeedbackButton>

        <v-col md="8" lg="12" xl="12" sm="12" xs="12" xm="12" class="mt-n11">
          <v-row class="mb-n2 mt-n3 mb-6">
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
            v-if="
              ($hasProfile('Administrador') ||
              $hasProfile('Cliente') ||
              $hasProfile('Comercial') ||
              $hasProfile('Financeiro')||
              $hasProfile('Operacional') ) &&
              !$hasProfile('/grp_insieme-apenas-circuitos')
            "
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
import FeedbackButton from "../components/FeedbackButton";

export default {
  components: {
    CircuitsPage,
    InvoicesPage,
    IssuesPage,
    CommercialPage,
    FeedbackDialog,
    FeedbackButton,
  },
  data: () => ({
    showFeedBack: false,
    selectedContract: undefined,
    entity: undefined,
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
