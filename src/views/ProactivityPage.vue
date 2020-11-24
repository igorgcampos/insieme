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

        <CircuitsPage
          v-if="$hasProfile('Administrador') || $hasProfile('Cliente') || $hasProfile('Operacional')"
          :contract="selectedContract"
        ></CircuitsPage>

      </v-col>

    </v-container>
  </v-content>
</template>

<script>

import CircuitsPage from './CircuitsPage';

export default {
  components: {
    CircuitsPage,
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
