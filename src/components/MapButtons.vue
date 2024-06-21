<template>
  <v-col
    style="position: fixed; z-index: 2;" 
    class="mt-0"
    :class="{
      'offset-10 pl-8': $vuetify.breakpoint.xs,
      'offset-11 pl-7': $vuetify.breakpoint.sm,
      'offset-11 pl-10': $vuetify.breakpoint.md,
      'offset-11 pl-11': $vuetify.breakpoint.lg,
      'offset-11 pr-12': $vuetify.breakpoint.xl,
    }"
  >
    <v-col class="pa-0 ma-0" :class="{'pl-0': $vuetify.breakpoint.xl, 'pl-3': $vuetify.breakpoint.md}">
      <v-row
        class="mt-2"
        :class="{
          'ml-8': $vuetify.breakpoint.lg,
          'ml-12 pl-12': $vuetify.breakpoint.xl,
        }"
      >
        <v-speed-dial
          v-model="fab"
          direction="left"
          transition="slide-x-transition"
          :open-on-hover="true"
        >
          <template v-slot:activator>
            <v-btn
              style="
                width: 38px;
                min-width: 38px;
                height: 38px;
                min-height: 38px;
              "
              color="white"
              class="white--text pt-4 pb-4"
              x-small
            >
              <v-icon v-if="!fab" center color="black" medium class="ml-0"
                >mdi-map</v-icon
              >
              <v-icon center color="black" medium class="ml-0" v-if="fab">
                mdi-close
              </v-icon>
            </v-btn>
          </template>

          <v-tooltip bottom>
            <template v-slot:activator="{ on }">
              <v-btn
                fab
                dark
                small
                color="white"
                @click="$root.$emit('change-mode', 'mapbox://styles/telespazio/clf1c9ff4008u01p88z215yxn')"
              >
                <v-icon v-on="on" color="black">mdi-weather-night</v-icon>
              </v-btn>
            </template>
            <span>{{ $vuetify.lang.t("$vuetify.NOITE") }}</span>
          </v-tooltip>

          <v-tooltip bottom>
            <template v-slot:activator="{ on }">
              <v-btn
                fab
                dark
                small
                color="white"
                @click="$root.$emit('change-mode', 'light-v10')"
              >
                <v-icon v-on="on" color="black">mdi-weather-sunny</v-icon>
              </v-btn>
            </template>
            <span>{{ $vuetify.lang.t("$vuetify.DIA") }}</span>
          </v-tooltip>

          <v-tooltip bottom>
            <template v-slot:activator="{ on }">
              <v-btn
                fab
                dark
                small
                color="white"
                @click="$root.$emit('change-mode', 'satellite-streets-v11')"
              >
                <v-icon v-on="on" color="black">mdi-satellite</v-icon>
              </v-btn>
            </template>
            <span>{{ $vuetify.lang.t("$vuetify.SATELITE") }}</span>
          </v-tooltip>

          <v-tooltip bottom>
            <template v-slot:activator="{ on }">
              <v-btn
                fab
                dark
                small
                color="white"
                @click="$root.$emit('change-mode', 'streets-v11')"
              >
                <v-icon v-on="on" color="black">mdi-google-maps</v-icon>
              </v-btn>
            </template>
            <span>{{ "Street" }}</span>
          </v-tooltip>
        </v-speed-dial>
      </v-row>

      <v-row
        class="mt-6"
        :class="{
          'ml-8': $vuetify.breakpoint.lg,
          'ml-12 pl-12': $vuetify.breakpoint.xl,
        }"
      >
        <v-tooltip left>
          <template v-slot:activator="{ on }">
            <v-btn
              fixed
              dark
              small
              color="white"
              style="
                width: 38px;
                min-width: 38px;
                height: 38px;
                min-height: 38px;
              "
              @click="$root.$emit('change-angle')"
            >
              <v-icon v-on="on" color="black">mdi-angle-acute</v-icon>
            </v-btn>
          </template>
          <span>{{ "Mudar ângulo" }}</span>
        </v-tooltip>
      </v-row>

      <v-row
        class="mt-12 pt-3"
        :class="{
          'ml-8': $vuetify.breakpoint.lg,
          'ml-12 pl-12': $vuetify.breakpoint.xl,
        }"
      >
        <v-tooltip left>
          <template v-slot:activator="{ on }">
            <v-btn
              fixed
              dark
              small
              color="white"
              style="
                width: 38px;
                min-width: 38px;
                height: 38px;
                min-height: 38px;
              "
              @click="$root.$emit('clear-map')"
            >
              <v-icon v-on="on" color="black">mdi-map-marker-remove</v-icon>
            </v-btn>
          </template>
          <span>{{ "Limpar mapa" }}</span>
        </v-tooltip>
      </v-row>
    </v-col>
  </v-col>
</template>

<script>
export default {
  props: { event: Function },
  components: {},
  data() {
    return {
      fab: false,
    };
  },
  created: function () {},
};
</script>