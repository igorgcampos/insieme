<template>
  <v-card
    class="mx-auto"
    width="100"
    height="80"
    style="{cursor: pointer}"
    @click="func"
  >
    <v-col>
      <v-row
        justify="center"
        class="mb-1 mt-n1"
      >
        <span
          :class="[color]"
          style="font-size:x-large;"
        >{{count}}</span>
      </v-row>
      <v-row justify="center">
        <span class="text-center subtitle-2 font-weight-bold grey--text text--darken-3">
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
    func: Function
  }
};
</script>