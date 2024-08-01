<template>
  <v-col>
    <v-row class="justify-center" style="{cursor: pointer;}">
      <v-tooltip top max-width="220">
        <template v-slot:activator="{ on }">
          <v-icon :x-large="!small" v-on="on" x-medium :color="iconColor">{{
            icon
          }}</v-icon>
        </template>
        <span v-html="toolTip"></span>
      </v-tooltip>
    </v-row>

    <v-row class="justify-center">
      <span
        class="text-right caption font-weight-bold grey--text text--lighten-1"
        >{{ label }}</span
      >
    </v-row>
  </v-col>
</template>

<script>
export default {
  props: {
    label: String,
    toolTip: String,
    icon: String,
    iconColor: String,
    small: Boolean,
  },
};
</script>