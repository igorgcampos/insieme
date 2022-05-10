<template>
    <v-row
          class="offset-7 mt-n12"
          :class="{
            'offset-9': $vuetify.breakpoint.xs || $vuetify.breakpoint.sm,
          }"
          style="position: fixed; z-index: 100"
        >
          <v-lazy
            :options="{
              threshold: 0.6,
            }"
            transition="slide-y-transition"
            class="mt-n3"
          >
            <v-btn
              color="red darken-1"
              class="white--text pt-7 pb-5 mt-n12 mr-12"
              :class="{
                'pt-8':
                  $vuetify.breakpoint.xs ||
                  $vuetify.breakpoint.md ||
                  $vuetify.breakpoint.sm,
              }"
              @click="event()"
              x-small
              depressed
            >
              <v-icon
                left
                dark
                small
                class="ml-0"
                :class="{ 'ml-2': $vuetify.breakpoint.xs }"
                >mdi-comment-processing</v-icon
              >
              {{
                !$vuetify.breakpoint.xs
                  ? $vuetify.lang.t("$vuetify.FEEDBACK")
                  : ""
              }}
            </v-btn>
          </v-lazy>
        </v-row>
</template>

<script>

export default {
  props: { event: Function,},
  components: { },
  data() {
    return {};
  },
  created: function () {},
};
</script>