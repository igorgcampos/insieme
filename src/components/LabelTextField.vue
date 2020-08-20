<template>
  <v-col
    :cols="cols"
    class="mr-4 mb-n7"
  >
    <v-row>
      <span
        class=" text-right subtitle-2 font-weight-bold grey--text text--lighten-1"
        :class="{'caption':$vuetify.breakpoint.xs}"
      >
        {{label}}:</span>
    </v-row>
    <v-row>
      <v-text-field
        :v-model="value"
        dense
        single-line
        solo
        max-width="200"
      ></v-text-field>
    </v-row>
  </v-col>
</template>

<script>
export default {
  props: {
    label: String,
    value: String,
    cols: Number,
  }
};
</script>