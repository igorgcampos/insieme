<template>
  <div class="ma-0 pa-0">
    <v-lazy :options="{ threshold: 0.6 }" transition="slide-x-transition">
      <v-card class="mx-auto" min-width="260" color="red darken-1">
        <v-col cols="1">
          <v-progress-circular
            :size="20"
            :width="2"
            color="white"
            indeterminate
            class="mt-8 mb-4"
          ></v-progress-circular>
        </v-col>

        <v-col cols="5"> 

          
        </v-col>

        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="white"
            text
            v-bind="attrs"
            @click="show = false"
            x-small
          >
            {{ $vuetify.lang.t("$vuetify.FECHAR") }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-lazy>
  </div>
</template>

<script>
export default {
  data: () => ({}),
  components: {},
  methods: {},
  props: {
    circuit: Object,
  },
};
</script>
