<template>
  <v-card
    dark
    class="ma-0 mb-n3"
    :class="{
      'ml-n6': $vuetify.breakpoint.xs,
      'ml-n12': !$vuetify.breakpoint.xs,
    }"
    :min-width="!$vuetify.breakpoint.xs ? 380 : 290"
    :width="!$vuetify.breakpoint.xs ? 380 : 290"
    style="background-color: white"
    elevation="6"
  >
    <div style="background-color: #e53935" mt-n12>
      <v-card-title class="text-subtitle-2">{{
        circuit.designacaoCliente
      }}</v-card-title>
      <v-card-subtitle v-if="circuit.updatedOn" class="text-caption"
        >{{
          $vuetify.lang.t("$vuetify.ULTIMA_COMUNICACAO") +
          ": " +
          $formatDate(circuit.updatedOn.date) +
          " " +
          $formatHour(circuit.updatedOn.time)
        }}
      </v-card-subtitle>
    </div>

    <v-row class="mt-n2 pa-2 mb-n3 pl-5" v-show="showAttributes">
      <v-col cols="12" class="mt-2 mb-n3">
        <span class="black--text text-h4">{{ circuit.velocidade || 0 }}</span>
        <span class="black--text text-h5">{{ " Km/h" }}</span>
      </v-col>

      <v-col cols="3">
        <LabelValue
          label="Latitude"
          :value="circuit.latitude ? circuit.latitude.toFixed(3) : '--'"
          justify="start"
          truncate
        ></LabelValue>
      </v-col>

      <v-col cols="3">
        <LabelValue
          label="Longitude"
          :value="circuit.longitude ? circuit.longitude.toFixed(3) : '--'"
          justify="start"
          truncate
        ></LabelValue>
      </v-col>

      <v-col cols="5">
        <LabelValue
          :label="$vuetify.lang.t('$vuetify.DESIGNACAO_TPZ')"
          :value="circuit.nome"
          justify="start"
          truncate
        ></LabelValue>
      </v-col>
    </v-row>

    <v-divider light class="mt-0"></v-divider>

    <v-card-actions v-show="showAttributes">
      <v-row class="ma-0 pa-0">
        <TooltipButton
          v-if="showRouteButton"
          :label="$vuetify.lang.t('$vuetify.ROTA')"
          :message="$vuetify.lang.t('$vuetify.MOSTRAR_ROTA')"
          :mobile="true"
          :isText="true"
          :object="circuit"
          :loading="loading"
          :event="showRoute"
        ></TooltipButton>

        <TooltipButton
          v-if="!showRouteButton"
          :label="$vuetify.lang.t('$vuetify.ESCONDER_ROTA')"
          :message="$vuetify.lang.t('$vuetify.ESCONDER_ROTA')"
          :mobile="true"
          :isText="true"
          :object="circuit"
          :event="hideRoute"
        ></TooltipButton>
      </v-row>
    </v-card-actions>
  </v-card>
</template>
<script>
import LabelValue from "../../components/LabelValue";
import TooltipButton from "../../components/TooltipButton";

export default {
  components: {
    LabelValue,
    TooltipButton,
  },
  props: {
    circuit: Object,
  },
  methods: {
    hideRoute(circuit) {
      var route = {};
      route.circuit = circuit;
      this.$root.$emit("remove-route", route);
      this.showRouteButton = true;
    },
    showRoute(circuit) {
      this.showRouteButton = false;
      this.loading = true;
      this.$get("/circuito/rota", {
        desigTpz: circuit.nome,
      }).then((response) => {
        if (!response) {
          return;
        }

        this.loading = false;

        var route = {};
        route.circuit = circuit;
        route.coordinates = response.data;

        this.$root.$emit("show-route", route);
      });
    },
  },
  data: () => ({
    showAttributes: true,
    isLoading: false,
    showErrorMessage: false,
    timeoutId: undefined,
    loading: false,
    showRouteButton: true,
  }),
  created: function () {
    this.$root.$on("ack", (receivedMessage) => {
      if (this.circuit.nome == receivedMessage.nome) {
        if (this.isLoading) {
          clearTimeout(this.timeoutId);

          this.isLoading = false;
          this.showCommandSuccess = true;
        }
      }
    });
  },
};
</script>