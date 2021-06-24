 <template>
  <v-dialog
    v-model="show"
    max-width="300"
    overflow-y-hidden
    overflow-x-hidden
  >
    <v-card class="mt-2">
      <v-card-title
        style="word-break: normal; !important"
        class="headline"
      >{{title}}</v-card-title>

      <v-card-text class="mt-n2">
        {{subtitle}}
      </v-card-text>

      <v-row class="ma-5">
        <span class=" text-right subtitle-2 font-weight-bold grey--text text--lighten-1">
          {{$vuetify.lang.t('$vuetify.MENSAGEM')}}:</span>
        <v-textarea
          solo
          height="100"
          :no-resize="true"
          rows="5"
          v-model="message"
        ></v-textarea>
      </v-row>

      <v-divider></v-divider>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          color="primary"
          text
          @click="close(); message = undefined;"
        >
          {{$vuetify.lang.t('$vuetify.CANCELAR')}}
        </v-btn>
        <v-btn
          color="primary"
          text
          @click="send(message, entity);  message = undefined;"
          :loading="loading"
        >
          {{$vuetify.lang.t('$vuetify.ENVIAR')}}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>

export default {
  data: () => ({
    message: undefined,
  }),
  props: {
    close: Function,
    show: Boolean,
    title: String,
    subtitle: String,
    send: Function,
    entity: Object,
    loading: Boolean,
  },
};
</script>