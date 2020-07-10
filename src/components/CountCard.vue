<template>
  <div class="pa-0 ma-0">
    <v-hover v-model="buttonHovering">
      <v-card
        class="mx-auto"
        width="105"
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
            <span class="text-center subtitle-2 font-weight-bold grey--text text--darken-3 ma-1">
              {{message}} </span>
          </v-row>
        </v-col>
      </v-card>
    </v-hover>
    <v-tooltip
      v-if="toolTipMessage"
      bottom
      v-model="showToolTip"
      :disabled="!buttonHovering"
      max-width="220"
    >
      <v-icon
        slot="activator"
        class="mt-n5 ml-12"
        large
      ></v-icon>
      <span>{{toolTipMessage}}</span>
    </v-tooltip>
  </div>
</template>

<script>
export default {
  props: {
    toolTipMessage: String,
    message: String,
    count: Number,
    color: String,
    func: Function,

  },
  watch: {
    buttonHovering (newVal) {
      this.showToolTip = newVal
    }
  },
  data: () => ({
    buttonHovering: false,
    showToolTip: false,
  })
};
</script>