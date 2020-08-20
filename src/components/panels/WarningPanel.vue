<template>

  <v-col>
    <v-row
      justify="center"
      class="mb-3"
    >
      <v-icon :x-large="!mobile">{{icon?icon:'mdi-help-circle'}}</v-icon>
    </v-row>
    <v-row justify="center">
      <span
        class="text-center headline font-weight-bold grey--text text--darken-1"
        :class="{'subtitle-2':mobile}"
      >
        {{message}} </span>
    </v-row>
  </v-col>
</template>

<script>
export default {
  props: {
    icon: String,
    message: String,
    mobile: Boolean
  }
};
</script>
