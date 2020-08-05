<template>
  <v-col class="pt-8 mb-8">
    <v-row
      justify="center"
      class="mb-3"
    >
      <v-icon
        size="62"
        color="success"
      >mdi-checkbox-marked-circle</v-icon>
    </v-row>
    <v-row justify="center">
      <span class="text-center headline font-weight-bold grey--text text--darken-3">
        {{title}} </span>

      <span
        v-show="subtitle"
        class="text-center SUBTITLE-2 font-weight-bold grey--text text--darken-3"
      >
        {{subtitle}} </span>
    </v-row>
  </v-col>
</template>

<script>

export default {
  props: {
    title: String,
    subtitle: String,
  },
  methods: {
  },
  data: () => ({
  })
};
</script>