 <template>
  <v-dialog v-model="show" max-width="400" overflow-y-hidden overflow-x-hidden>
    <v-card v-show="showSuccess">
      <SuccessPanel
       :title="$vuetify.lang.t('$vuetify.CONTESTACAO_ENVIADA')"
       :subtitle="''"
      >
      </SuccessPanel>

      <v-divider class="mt-n6"></v-divider>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          color="primary"
          text
          @click="
            close();
            message = undefined;
          "
          :x-small="$vuetify.breakpoint.xs"
          >{{ $vuetify.lang.t("$vuetify.FECHAR") }}</v-btn
        >
      </v-card-actions>
    </v-card>
    <v-card v-show="!showSuccess">
      <v-card-title style="word-break: normal; !important" class="headline">{{
        title
      }}</v-card-title>

      <v-card-text class="mt-n2">
        {{ subtitle }}
      </v-card-text>

      <v-row class="ma-5 mb-0">
        <v-col class="ml-3 mr-3">
          <v-row>
            <span
              class="
                text-right
                subtitle-2
                font-weight-bold
                grey--text
                text--lighten-1
              "
            >
              {{ $vuetify.lang.t("$vuetify.MENSAGEM") }}:</span
            >
          </v-row>
          <v-row>
            <v-textarea
              solo
              height="200"
              :no-resize="true"
              rows="5"
              v-model="message"
            ></v-textarea>
          </v-row>
        </v-col>
      </v-row>

      <v-divider></v-divider>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          color="primary"
          text
          @click="
            close();
            message = undefined;
          "
        >
          {{ $vuetify.lang.t("$vuetify.CANCELAR") }}
        </v-btn>
        <v-btn
          color="primary"
          text
          @click="
            send(message, entity);
            message = undefined;
          "
          :loading="loading"
        >
          {{ $vuetify.lang.t("$vuetify.ENVIAR") }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import SuccessPanel from "../../components/panels/SuccessPanel";
export default {
   components: {
   SuccessPanel,
  },
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
    showSuccess: Boolean,
  },
};
</script>