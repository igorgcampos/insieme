<template>
  <v-content>
    <v-container
      column
      align-center
      style="max-width:800px;"
    >

      <v-row
        class="offset-7 mt-n12"
        :class="{'offset-9':$vuetify.breakpoint.xs || $vuetify.breakpoint.sm}"
        style="position:fixed; z-index:100;"
      >

        <v-lazy
          :options="{
          threshold: .6
        }"
          transition="slide-y-transition"
          class="mt-n3"
        >
          <v-btn
            color="red darken-1"
            class="white--text pt-7 pb-5 mt-n12 mr-12"
            :class="{'pt-8':$vuetify.breakpoint.xs || $vuetify.breakpoint.md || $vuetify.breakpoint.sm}"
            @click="openFeedBack()"
            x-small
            depressed
          >
            <v-icon
              left
              dark
              small
              class="ml-0"
              :class="{'ml-2':$vuetify.breakpoint.xs}"
            >mdi-comment-processing</v-icon>
            {{!$vuetify.breakpoint.xs?$vuetify.lang.t('$vuetify.FEEDBACK'):''}}
          </v-btn>
        </v-lazy>
      </v-row>

      <v-row
        class="mt-n12 ml-0 mb-6"
        :class="{'ml-n9':$vuetify.breakpoint.mdAndUp}"
      >
        <span class="mb-7 text-right subtitle-1 font-weight-bold grey--text text--darken-1">
          {{$vuetify.lang.t('$vuetify.CONTRATO_SELECIONADO') + ': '+selectedContract.numeroContratoTpz}} </span>
      </v-row>
      <v-col
        md="12"
        lg="12"
        xl="12"
        sm="12"
        xs="12"
        xm="12"
        class="mt-n11"
      >

        <CircuitsPage
          v-if="$hasProfile('Administrador') || $hasProfile('Cliente') || $hasProfile('Operacional')"
          :contract="selectedContract"
        ></CircuitsPage>
        <InvoicesPage
          v-if="$hasProfile('Administrador') || $hasProfile('Cliente') || $hasProfile('Financeiro')"
          :contract="selectedContract"
        ></InvoicesPage>
        <CommercialPage
          v-if="$hasProfile('Administrador') || $hasProfile('Cliente') || $hasProfile('Comercial')"
          :contract="selectedContract"
        ></CommercialPage>
        <IssuesPage
          v-show="false"
          :contract="selectedContract"
          :proactivity="undefined"
        ></IssuesPage>
      </v-col>

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

import CircuitsPage from './CircuitsPage';
import InvoicesPage from './InvoicesPage';
import IssuesPage from './IssuesPage';
import CommercialPage from './CommercialPage';
import FeedbackDialog from '../components/dialogs/FeedbackDialog';

export default {
  components: {
    CircuitsPage,
    InvoicesPage,
    IssuesPage,
    CommercialPage,
    FeedbackDialog
  },
  data: () => ({
    showFeedBack: false,
    show: false,
    selectedContract: undefined,
    entity: undefined,
  }),
  props: {
    contract: Object
  },
  methods: {
    openFeedBack (notification) {

      if (notification) {
        this.entity = { issue: { id: notification.mensagem.split(':')[0] }, notification: notification }
        this.$root.$emit('search-issue', notification.mensagem.split(':')[1])
        return
      }

      this.showFeedBack = true;
    },
    closeFeedback () {
      this.showFeedBack = false;
    },
  },
  created: function () {

    this.selectedContract = this.$props.contract;
    if (!this.selectedContract) {
      if (!window.sessionStorage.getItem('selectedContractId'))
        return;
      else
        this.selectedContract = {
          id: window.sessionStorage.getItem('selectedContractId'),
          numeroContratoTpz: window.sessionStorage.getItem('selectedContractTpz')
        }
    } else {
      window.sessionStorage.setItem('selectedContractId', this.selectedContract.id);
      window.sessionStorage.setItem('selectedContractTpz', this.selectedContract.numeroContratoTpz);
    }

    this.$root.$on('open-feedback', (notification) => {
      this.openFeedBack(notification)
    })

    this.$root.$on('go-to', (target) => {

      var element = document.getElementById(target);

      this.$vuetify.goTo(element, {
        duration: 200,
        offset: 25,
        easing: 'linear',
      })
    })
  }

};
</script>
