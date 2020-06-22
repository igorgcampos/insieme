<template>
  <v-content>
    <v-container
      column
      align-center
      style="max-width:800px;"
    >
      <v-col
        md="12"
        lg="12"
        xl="12"
        sm="12"
        xs="12"
        xm="12"
        class="mt-n11"
      >

        <CircuitsPage :contract="selectedContract"></CircuitsPage>
        <InvoicesPage :contract="selectedContract"></InvoicesPage>
        <IssuesPage :contract="selectedContract"></IssuesPage>

      </v-col>
    </v-container>
  </v-content>
</template>

<script>

import CircuitsPage from './CircuitsPage';
import InvoicesPage from './InvoicesPage';
import IssuesPage from './IssuesPage';

export default {
  components: {
    CircuitsPage,
    InvoicesPage,
    IssuesPage
  },
  data: () => ({
    selectedContract: undefined
  }),
  props: {
    contract: Object
  },
  created: function () {

    this.selectedContract = this.$props.contract;

    window.scrollTo(0, 0);
    if (!this.selectedContract) {
      if (!window.sessionStorage.getItem('selectedContractId'))
        return;
      else
        this.selectedContract = { id: window.sessionStorage.getItem('selectedContractId') }
    } else {
      window.sessionStorage.setItem('selectedContractId', this.selectedContract.id);
    }
  }
};
</script>
