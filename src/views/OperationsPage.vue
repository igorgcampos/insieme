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
        <ProactivityPage></ProactivityPage>
        <AuditPage></AuditPage>
      </v-col>

    </v-container>
  </v-content>
</template>

<script>

import ProactivityPage from './ProactivityPage';
import AuditPage from './AuditPage';

export default {
  components: {
    ProactivityPage,
    AuditPage,
  },
  data: () => ({

  }),
  props: {

  },
  methods: {

  },
  created: function () {

  }

};
</script>
