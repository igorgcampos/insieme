<template>
  <v-card
    class="mx-auto"
    width="120"
    height="90"
  >
    <v-col>
      <v-row
        justify="center"
        class="mb-1 mt-0"
      >
        <span :class="['display-1', color]">{{count}}</span>
      </v-row>
      <v-row justify="center">
        <span class="text-center h6 font-weight-bold grey--text text--darken-3">
          {{message}} </span>
      </v-row>
    </v-col>
  </v-card>
</template>

<script>
export default {
  props: {
    message: String,
    count: Number,
    color: String
  }
};
</script>