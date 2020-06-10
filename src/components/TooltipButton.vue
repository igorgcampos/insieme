<template>
  <v-tooltip top>
    <template v-slot:activator="{ on }">
      <v-btn
        text
        color="primary"
        @click="event()"
        v-on="on"
      >{{label}}</v-btn>
    </template>
    <span>{{message}}</span>
  </v-tooltip>
</template>

<script>
export default {
  props: {
    label: String,
    message: String,
    event: Function
  }
};
</script>