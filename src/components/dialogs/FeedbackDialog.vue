<template>
  <v-dialog
    persistent
    max-width="480"
    v-model="show"
    class="mt-n3 overflow-y-hidden overflow-x-hidden"
  >
    <v-card>
      <v-card-title
        v-if="!showSuccess"
        class="headline-6 ml-1 pt-5"
        style="word-break: normal; !important"
        :class="{ 'subtitle-2': $vuetify.breakpoint.xs }"
      >
        {{
          !entity
            ? $vuetify.lang.t("$vuetify.FEEDBACK")
            : $vuetify.lang.t("$vuetify.FEEDBACK_CHAMADO") +
              (entity.notification
                ? entity.notification.mensagem.split(":")[1]
                : entity.issue.protocolo)
        }}
      </v-card-title>
      <v-card-text
        v-if="!showSuccess"
        class="mt-n2 headline-6 pl-7"
        :class="{ caption: $vuetify.breakpoint.xs }"
        >{{
          !entity ? $vuetify.lang.t("$vuetify.FEEDBACK_DESCRICAO") : ""
        }}</v-card-text
      >

      <v-list
        class="ma-0 pa-0 overflow-y-auto"
        :max-height="$vuetify.breakpoint.xl ? 650 : 400"
        v-if="!showSuccess"
      >
        <div class="text-center mt-2 mb-8">
          <v-rating
            v-model="rating"
            color="orange"
            background-color="orange lighten-3"
            half-increments
            hover
            large
          ></v-rating>
        </div>

        <v-row class="ma-0 pa-0">
          <v-col cols="12" class="pl-3 mt-n3">
            <span
              class="
                ml-7
                text-right
                subtitle-2
                font-weight-bold
                grey--text
                text--lighten-1
              "
            >
              {{ $vuetify.lang.t("$vuetify.COMENTARIOS") }}:</span
            >
            <v-textarea
              solo
              height="100"
              :no-resize="true"
              rows="5"
              v-model="comments"
              class="ml-7 mr-7"
            ></v-textarea>
          </v-col>

          <v-col cols="10" class="ml-10 pl-3 mt-n3">
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
                {{ "Nome para contato" }}:</span
              >
            </v-row>
            <v-row md="2">
              <v-text-field
                v-model.trim="name"
                dense
                single-line
                solo
                max-width="200"
              ></v-text-field>
            </v-row>
          </v-col>

          <v-col cols="5" class="ml-10 pl-3 mt-n3 mb-3">
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
                {{ $vuetify.lang.t("$vuetify.TELEFONE") }}:</span
              >
            </v-row>
            <v-row md="2">
              <v-text-field
                v-model.trim="telephone"
                dense
                single-line
                solo
                max-width="200"
                v-mask="'(##) ####-####'"
              ></v-text-field>
            </v-row>
          </v-col>

          <v-col cols="5" class="ml-6 mt-n3 pr-9">
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
                {{ $vuetify.lang.t("$vuetify.ANEXAR_IMAGEM") }}:</span
              >
            </v-row>
            <v-row md="2">
              <v-file-input
                label="Imagem"
                accept=".png"
                outlined
                dense
                v-model="image"
                @change="importImage"
              ></v-file-input>
            </v-row>
          </v-col>
        </v-row>
      </v-list>

      <v-lazy
        :options="{
          threshold: 0.6,
        }"
        transition="slide-x-transition"
      >
        <SuccessPanel
          v-if="showSuccess"
          :title="$vuetify.lang.t('$vuetify.MUITO_OBRIGADO')"
          :subtitle="$vuetify.lang.t('$vuetify.FEEDBACK_ENVIADO')"
          class="pt-10 mb-n1"
        >
        </SuccessPanel>
      </v-lazy>

      <v-divider></v-divider>
      <v-card-actions>
        <v-spacer v-if="!$vuetify.breakpoint.xs"></v-spacer>
        <v-btn
          color="primary"
          text
          @click="
            close();
            closeDialog();
          "
          :x-small="$vuetify.breakpoint.xs"
          >{{
            !showSuccess
              ? $vuetify.lang.t("$vuetify.CANCELAR")
              : $vuetify.lang.t("$vuetify.FECHAR")
          }}</v-btn
        >

        <v-btn
          color="primary"
          text
          @click="sendEvaluation()"
          :x-small="$vuetify.breakpoint.xs"
          v-if="!showSuccess"
          >{{ $vuetify.lang.t("$vuetify.ENVIAR") }}</v-btn
        >
        <v-spacer v-if="$vuetify.breakpoint.xs"></v-spacer>
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
  props: {
    close: Function,
    show: Boolean,
    entity: Object,
    feedBackFunction: Function,
  },
  methods: {
    importImage() {
      if (this.image) return (this.image = this.getFileFormData(this.image));
    },
    getFileFormData(file) {
      var reader = new FileReader();
      const fileByteArray = [];

      reader.readAsArrayBuffer(file);
      reader.onloadend = function (evt) {
        if (evt.target.readyState == FileReader.DONE) {
          var arrayBuffer = evt.target.result,
            array = new Uint8Array(arrayBuffer);
          for (var i = 0; i < array.length; i++) {
            fileByteArray.push(array[i]);
          }
        }
      };

      return fileByteArray;
    },
    closeDialog() {
      this.showSuccess = false;
      this.rating = 4;
      this.comments = "";
      this.telephone = "";
      this.name = "";
    },
    sendEvaluation() {

      this.showDialogLoading = true;
      this.$getUser().then((user) => {
        var evaluation = {
          comentario: this.comments,
          nota: this.rating,
          nome: this.name,
          imagem: this.image,
          telefone: this.telephone,
          usuario: user,
          chamado: this.entity ? this.entity.issue : null,
        };

        this.$post("/avaliacao", evaluation).then((response) => {
          if (response.data) {
            this.showSuccess = true;
            this.showDialogLoading = false;
            this.entity.issue.evaluation = response.data;

            if (this.feedBackFunction) {
              this.feedBackFunction();
            }
          }

          //Remove a notificação para evitar do usuário dar dois feedbacks na mesma entidade.
          if (this.entity && this.entity.notification) {
            this.$root.$emit("remove-notification", this.entity.notification);
          }
        });
      });
    },
  },
  data: () => ({
    comments: "",
    rating: 4,
    name: undefined,
    telephone: undefined,
    showSuccess: false,
    image: undefined,
  }),
  created: function () {},
};
</script>