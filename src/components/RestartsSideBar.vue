<template>
  <v-container>
    <v-navigation-drawer
      style="width: 9rem; top: 10%"
      color="rgba(255, 0, 0, 0.0)"
      class="mt-3"
      right
      :absolute="circuits.length == 0"
      :fixed="circuits.length > 0"
      v-show="count > 0"
      permanent
      :floating="true"
    >
      <v-badge
        :value="true"
        color="primary"
        overlap
        :content="circuits.length"
        offset-x="12"
        offset-y="12"
        class="ml-12 mt-2 mb-3 pl-7"
      >
        <v-btn
          class="mr-0"
          fab
          dark
          x-small
          @click="buttonEvent"
          color="red darken-1"
          v-on="on"
        >
          <v-icon dark>
            {{ showRestarts ? "mdi-menu-up" : "mdi-menu-down" }}
          </v-icon>
        </v-btn>
      </v-badge>
    </v-navigation-drawer>

    <v-navigation-drawer
      style="width: 21rem; top: 14%; max-height: 650px"
      color="rgba(255, 0, 0, 0.0)"
      class="mt-4 ml-12 pl-3"
      right
      :absolute="count == 0"
      :fixed="count > 0"
      v-show="count> 0 && showRestarts"
      permanent
      :floating="true"
    >
      <v-row v-for="(circuit, i) in circuits" :key="i" class="mt-2 ml-2 mb-5">
        <RestartCard :circuit="circuit" :contract="contract"></RestartCard>
      </v-row>
    </v-navigation-drawer>
  </v-container>
</template>

<script>
import RestartCard from "../components/cards/RestartCard";

export default {
  props: {
    circuits: Array,
    showRestarts: Boolean,
    buttonEvent: Function,
    contract: Object,
  },
  components: { RestartCard },
  data() {
    return {count: 0};
  },
  created: function () {
    this.$root.$on('decrease-count', () => {this.count -= 1});
    this.$root.$on('increase-count', () => {this.count += 1});
  },
};
</script>