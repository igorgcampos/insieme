<template>

  <v-col>
    <v-row
      justify="center"
      class="mb-3"
    >
      <v-icon v-if="!robot" :x-large="!mobile">{{icon?icon:'mdi-help-circle'}}</v-icon>
      <v-img
              src="../../assets/robo.png"
              max-height="100"
              max-width="100"
              class="mx-auto mt-6 mb-6"
              v-if="robot"
            ></v-img>
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
    mobile: Boolean,
    robot: Boolean,
  }
};
</script>
