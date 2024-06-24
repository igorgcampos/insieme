<template>
  <v-row style="position: fixed; z-index: 3; top: 0px" class="mt-12 ml-0 pt-2">
    <v-row
      class="mt-6 ml-n1"
      :class="{
        '': $vuetify.breakpoint.lg,
        '': $vuetify.breakpoint.xl,
      }"
      v-show="mini"
    >
      <v-tooltip right>
        <template v-slot:activator="{ on }">
          <v-btn fixed dark color="white" @click="mini = false">
            <v-icon v-on="on" color="black">mdi-router-wireless</v-icon>
            <v-icon v-on="on" color="black" class="ml-1 mr-n1"
              >mdi-chevron-right</v-icon
            >
          </v-btn>
        </template>
        <span>{{ "Exibir Circuitos" }}</span>
      </v-tooltip>
    </v-row>

    <v-lazy :options="{ threshold: 0.6 }" transition="slide-x-transition">
      <v-card height="100vh" v-show="!mini">
        <v-navigation-drawer
          :mini-variant.sync="mini"
          permanent
          floating
          rounded
          :rail="mini"
        >
          <template v-slot:prepend>
            <v-list-item nav class="mt-2 mb-n1">
              <v-list-item-content v-if="!mini">
                <v-list-item-title>{{
                  $vuetify.lang.t("$vuetify.CIRCUITOS")
                }}</v-list-item-title>
              </v-list-item-content>
              <v-list-item-icon class="ml-n2">
                <v-btn icon @click.stop="mini = true">
                  <v-icon>{{ "mdi-close" }}</v-icon>
                </v-btn>
              </v-list-item-icon>
            </v-list-item>
          </template>

          <v-divider></v-divider>

          <v-list class="ml-n1" v-show="!isLoading && circuits.length > 0">
            <transition-group name="list" tag="div">
              <v-list-item
                v-for="(circuit, i) in circuits"
                :key="i"
                @click="showInMap(circuit)"
              >
                <v-tooltip bottom>
                  <template v-slot:activator="{ on }">
                    <v-btn
                      :style="{
                        'background-color':
                          circuit.online == 3 ? 'green' : 'red',
                      }"
                      outlined
                      fab
                      dark
                      x-small
                      color="blue-grey lighten-1"
                      elevation="2"
                      class="mr-2"
                    >
                      <v-icon v-on="on" color="white"
                        >mdi-router-wireless</v-icon
                      >
                    </v-btn>
                  </template>
                  <span>{{ circuit.nome }}</span>
                </v-tooltip>
                <v-list-item-content>
                  <v-list-item-title class="text-subtitle-2">
                    {{ circuit.nome }}
                  </v-list-item-title>
                  <v-list-item-subtitle class="text-caption">
                    {{
                      $vuetify.lang.t("$vuetify.DESIGNACAO_CLIENTE") +
                      ": " +
                      circuit.designacaoCliente
                    }}
                  </v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
            </transition-group>
          </v-list>

          <v-row class="justify-center mt-12">
            <v-progress-circular
              v-if="isLoading"
              indeterminate
              color="red"
            ></v-progress-circular>
          </v-row>

          <v-lazy :options="{ threshold: 0.6 }" transition="slide-x-transition">
            <WarningPanel
              class="mt-11 pt-12"
              :mobile="true"
              :message="$vuetify.lang.t('$vuetify.NENHUM_CIRCUITO')"
              v-show="circuits.length == 0 && !isLoading"
              :small="true"
            ></WarningPanel>
          </v-lazy>
        </v-navigation-drawer>
      </v-card>
    </v-lazy>

    <InfoDialog
      :title="$vuetify.lang.t('$vuetify.CIRCUITO_SEM_LOCALIZACAO')"
      :info="$vuetify.lang.t('$vuetify.SEM_LOCALIZACAO')"
      :close="closeNoLocalizationDialog"
      :dialog="showNoLocalizationDialog"
    >
    </InfoDialog>
  </v-row>
</template>
<script>
import WarningPanel from "../components/panels/WarningPanel";
import InfoDialog from "../components/dialogs/InfoDialog";
export default {
  components: {
    WarningPanel,
    InfoDialog,
  },
  props: {
    isLoading: Boolean,
    circuits: Array,
  },
  data() {
    return {
      showNoLocalizationDialog: false,
      tags: ["Texto 1", "Texto 1", "Texto 1"],
      mini:
        this.$vuetify.breakpoint.xs || this.$vuetify.breakpoint.sm
          ? true
          : false,
    };
  },
  methods: {
    closeNoLocalizationDialog() {
      this.showNoLocalizationDialog = false;
    },
    showInMap(circuit) {
      if (
        !circuit.latitude ||
        !circuit.longitude ||
        (circuit.latitude == 0 && circuit.longitude == 0)
      ) {
        this.showNoLocalizationDialog = true;
        return;
      }

      this.flyTo(circuit);
      this.showPopup(circuit);
    },
    showPopup(circuit) {
      this.$root.$emit("show-popup", circuit);
    },
    flyTo(circuit) {
      this.$root.$emit("fly-to", circuit);
    },
  },
  created() {
    this.$root.$on("online", (receivedMessage) => {
      for (var index in this.circuits) {
        if (this.circuits[index].nome == receivedMessage.nome) {
          this.circuits[index].online = 3;
          this.$forceUpdate();
        }
      }
    });

    this.$root.$on("offline", (receivedMessage) => {
      for (var index in this.circuits) {
        if (this.circuits[index].nome == receivedMessage.nome) {
          this.circuits[index].online = 5;
        }
      }
    });
  },
};
</script>