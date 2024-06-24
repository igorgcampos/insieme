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
    <div style="background-color: #E53935" mt-n12>
      <v-card-title class="text-subtitle-2">{{ circuit.nome }}</v-card-title>
      <v-card-subtitle v-if="circuit.ultimaAmostra" class="text-caption"
        >{{ $vuetify.lang.t('$vuetify.ULTIMA_COMUNICACAO') + ": " + 
        $formatDate(circuit.ultimaAmostra.date) + ' ' + $formatHour(circuit.ultimaAmostra.time) }}
      </v-card-subtitle>
    </div>

    <v-row class="mt-n2 pa-2 mb-n3 pl-5" v-show="showAttributes">
      <v-col cols="6">
        <LabelValue
          label="Nome"
          :value="circuit.nome"
          justify="start"
          style="width: 150px"
          truncate
        ></LabelValue>
      </v-col>

      <v-col cols="6">
        <LabelValue
          label="Latitude"
          :value="circuit.latitude? circuit.latitude.toFixed(3): '--'"
          justify="start"
          style="width: 150px"
          truncate
          :customStyle="'125px'"
        ></LabelValue>
      </v-col>

      <v-col cols="6">
        <LabelValue
          label="Longitude"
          :value="circuit.longitude? circuit.longitude.toFixed(3): '--'"
          justify="start"
          style="width: 150px"
          truncate
          :customStyle="'125px'"
        ></LabelValue>
      </v-col>
    </v-row>

    <v-divider light class="mt-0"></v-divider>

    <v-card-actions v-show="showAttributes">
      <v-row class="ma-0 pa-0">
       <!-- <TooltipButton
          :label="$vuetify.lang.t('$vuetify.EDITAR')"
          :message="$vuetify.lang.t('$vuetify.EDITAR_DISPOSITIVO')"
          :mobile="true"
          :isText="true"
          :object="circuit"
        ></TooltipButton> -->
      </v-row>
    </v-card-actions>
  </v-card>
</template>
<script>
import LabelValue from "../../components/LabelValue";
//import TooltipButton from "../../components/TooltipButton";

export default {
  components: {
    LabelValue,
  //  TooltipButton,
  },
  props: {
    circuit: Object,
  },
  methods: {

  },
  data: () => ({
    showAttributes: true,
    isLoading: false,
    showErrorMessage: false,
    timeoutId: undefined,
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