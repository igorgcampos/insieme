<template>
  <div class="pa-0 ma-0">
    <v-hover v-model="buttonHovering">
      <v-card
        class="mx-auto"
        :width="horizontal && minWidth ? minWidth : horizontal? 210 : 109"
        :height="horizontal? 40 : 80"
        style="
           {
            cursor: pointer;
          }
        "
        @click="func(funcParam)"
      >
        <v-row justify="center" class="mb-1 mt-n3" v-show="horizontal">
          <v-col :cols="colsNumber || 2" class="ml-4 mt-n1">
            <span
              v-if="!isLoading"
              :class="[color]"
              style="font-size: large"
              justify="center"
              >{{ count }}</span
            >

            <v-progress-circular
              v-if="isLoading"
              :size="30"
              :width="3"
              color="blue darken-2"
              indeterminate
              class="mt-3 mb-n1"
            ></v-progress-circular
          ></v-col>

          <v-col :cols="colsNumber? (colsNumber + 10) : 9" class="ma-0 mt-n1 pt-3">
            <span justify="center"
              class="text-center subtitle-2 font-weight-bold grey--text text--darken-3 ma-1 ml-n3"
              :class="{
                button: $vuetify.breakpoint.xs,
              }"
            >
              {{ message }}
            </span></v-col
          >
        </v-row>

        <v-col v-show="!horizontal">
          <v-row justify="center" class="mb-1 mt-n1">
            <span
              v-if="!isLoading"
              :class="[
                color,
                { 'text-subtitle-1 pt-2': smallCount && !smallText },
                { 'text-subtitle-1 pt-0 pb-1': smallCount && smallText },
              ]"
              style="font-size: x-large"
              >{{ count }}</span
            >

            <v-progress-circular
              v-if="isLoading"
              :size="30"
              :width="3"
              color="blue darken-2"
              indeterminate
              class="mt-3 mb-n1"
            ></v-progress-circular>
          </v-row>
          <v-row justify="center">
            <span
              class="text-center subtitle-2 font-weight-bold grey--text text--darken-3 ma-1"
              :class="{
                button: $vuetify.breakpoint.xs,
                'caption mt-n2': smallText,
              }"
            >
              {{ message }}
            </span>
          </v-row>
        </v-col>
      </v-card>
    </v-hover>
    <v-tooltip
      v-if="toolTipMessage"
      right
      v-model="showToolTip"
      :disabled="!buttonHovering"
      max-width="220"
    >
      <v-icon slot="activator" class="mt-8 ml-n2" large></v-icon>
      <span>{{ toolTipMessage }}</span>
    </v-tooltip>
  </div>
</template>

<script>
export default {
  props: {
    toolTipMessage: String,
    message: String,
    count: String,
    color: String,
    func: Function,
    funcParam: String,
    smallText: Boolean,
    smallCount: Boolean,
    isLoading: Boolean,
    horizontal: Boolean,
    minWidth: Number,
    colsNumber: Number,
  },
  watch: {
    buttonHovering(newVal) {
      this.showToolTip = newVal;
    },
  },
  data: () => ({
    buttonHovering: false,
    showToolTip: false,
  }),
};
</script>