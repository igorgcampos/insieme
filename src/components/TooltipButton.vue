<template>
  <v-tooltip top>
    <template v-slot:activator="{ on }">
      <v-btn
        text
        color="primary"
        @click="event(object)"
        v-on="on || on1"
        :loading="loading"
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
    event: Function,
    loading: Boolean,
    on1: String,
    object: Object
  }
};
</script>