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
        <OperationsPage></OperationsPage>
      </v-col>

    </v-container>
  </v-content>
</template>

<script>

import OperationsPage from './OperationsPage';

export default {
  components: {
    OperationsPage,
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
