 <template>
  <v-dialog
    v-model="show"
    max-width="400"
    overflow-y-hidden
    overflow-x-hidden
  >
    <v-card class="mt-0">

      <v-row class="mr-0 ml-0 mb-n7 pt-4">
        <v-img
          src="../../assets/robo.png"
          max-height="100"
          max-width="100"
          class="mx-auto mt-6 mb-6"
        ></v-img>
      </v-row>

      <v-row
        justify="center"
        class="ma-0 pa-12"
      >
        <span class="text-center headline font-weight-bold grey--text text--darken-3">
          {{questions[index]}} </span>
      </v-row>

      <v-divider></v-divider>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          color="primary"
          text
          @click="index=4"
          v-if="index < questions.length - 2 "
        >
          {{$vuetify.lang.t('$vuetify.NAO')}}
        </v-btn>
        <v-btn
          color="primary"
          text
          @click="index++"
          v-if="index < questions.length - 2"
        >
          {{$vuetify.lang.t('$vuetify.SIM')}}
        </v-btn>
        <v-btn
          color="primary"
          text
          @click="close(); index = 0;"
          v-if="index == questions.length - 1 || index == 3"
        >
          {{$vuetify.lang.t('$vuetify.FECHAR')}}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>

export default {
  data: () => ({
    index: 0,
  }),
  props: {
    close: Function,
    show: Boolean,
    questions: Array,
  },
  methods: {
  },
};
</script>