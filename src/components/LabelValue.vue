<template>
  <v-col>
    <v-row :justify="justify">
      <span class="text-right caption font-weight-bold grey--text text--lighten-1">{{label}}</span>
    </v-row>
    <v-row
      :justify="justify"
      v-if="!truncate"
    >
      <span class="text-center subtitle-2 font-weight-bold grey--text text--darken-3">
        {{value}} </span>
    </v-row>

    <v-row
      :justify="justify"
      v-if="truncate"
    >
      <v-tooltip top>
        <template v-slot:activator="{ on }">
          <span
            v-on="on"
            class="text-truncate text-center subtitle-2 font-weight-bold grey--text text--darken-3"
          >
            {{value}} </span>
        </template>
        <span>{{value}}</span>
      </v-tooltip>
    </v-row>
  </v-col>
</template>

<script>
export default {
  props: {
    label: String,
    value: String,
    justify: String,
    truncate: Boolean,
  }
};
</script>