<template>
  <v-content>
    <v-container
      column
      align-center
    >

      <v-col
        cols="12"
        md="9"
        lg="7"
        xl="8"
        sm="12"
        xs="2"
        xm="2"
        class="mt-n11"
      >

        <CircuitsPage :contract="contract"></CircuitsPage>
        <InvoicesPage :contract="contract"></InvoicesPage>
        <IssuesPage :contract="contract"></IssuesPage>

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
  props: {
    contract: Object
  }
};
</script>
