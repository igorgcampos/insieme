 <template>
  <v-dialog
    v-model="dialog"
    max-width="350"
  >
    <v-card class="pt-6">

      <v-lazy
        :options="{
            threshold: .6
            }"
        transition="slide-x-transition"
      >
        <div class="ma-0 pa-0">
          <v-img
            src="../../assets/robo.png"
            max-height="100"
            max-width="100"
            class="mx-auto mb-6"
          ></v-img>

        </div>
      </v-lazy>

      <v-card-title
        style="word-break: normal; !important"
        class="headline justify-center"
      >{{title}}</v-card-title>

      <v-card-text class="text-center">
        {{info}}
      </v-card-text>

      <v-divider></v-divider>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          color="primary"
          text
          @click="close()"
        >
          {{$vuetify.lang.t('$vuetify.FECHAR')}}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>

export default {

  props: {
    close: Function,
    show: Boolean,
    title: String,
    info: String,
    dialog: Boolean,
  },
};
</script>