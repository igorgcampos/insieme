<template>
  <v-card
    class="mx-auto"
    width="140"
    height="110"
  >
    <v-col>
      <v-row
        justify="center"
        class="mb-3 mt-1"
      >
        <span :class="[size, color]">{{count}}</span>
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
    color: String,
    size: String
  }
};
</script>