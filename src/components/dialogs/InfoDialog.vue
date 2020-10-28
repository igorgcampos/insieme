 <template>
  <v-dialog
    v-model="dialog"
    max-width="350"
  >
    <v-card class="mt-2">
      <v-card-title
        style="word-break: normal; !important"
        class="headline"
      >{{title}}</v-card-title>

      <v-card-text>
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