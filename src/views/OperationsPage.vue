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
      </v-col>

    </v-container>
  </v-content>
</template>

<script>

import ProactivityPage from './ProactivityPage';

export default {
  components: {
    ProactivityPage,
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
