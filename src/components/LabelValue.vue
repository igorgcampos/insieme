<template>
  <v-col style="min-width:100px; max-width:100px;">
    <v-row :justify="justify">
      <span class="text-right caption font-weight-bold grey--text text--lighten-1">{{label}}</span>
    </v-row>
    <v-row :justify="justify">
      <span class="text-center subtitle-2 font-weight-bold grey--text text--darken-3">
        {{value}} </span>
    </v-row>
  </v-col>
</template>

<script>
export default {
  props: {
    label: String,
    value: String,
    justify: String
  }
};
</script>