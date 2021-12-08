<template>

  <v-dialog
    persistent
    max-width="480"
    v-model="show"
    class="mt-n3 overflow-y-hidden overflow-x-hidden"
  >
    <v-card>

      <div
        class="ma-0 pa-0"
        v-if="!showSuccess"
      >
        <v-card-title
          class="headline-6 ml-1 pt-5"
          style="word-break: normal; !important"
          :class="{'subtitle-2':$vuetify.breakpoint.xs}"
        >
          {{!entity?$vuetify.lang.t('$vuetify.FEEDBACK'):
          $vuetify.lang.t('$vuetify.FEEDBACK_CHAMADO') +
          (entity.notification?entity.notification.mensagem.split(':')[1]:entity.issue.protocolo)}}
        </v-card-title>
        <v-card-text
          class="mt-n2 headline-6 pl-5"
          :class="{'caption':$vuetify.breakpoint.xs}"
        >{{!entity?$vuetify.lang.t('$vuetify.FEEDBACK_DESCRICAO'):''}}</v-card-text>

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

        <span class=" ml-7 text-right subtitle-2 font-weight-bold grey--text text--lighten-1">
          {{$vuetify.lang.t('$vuetify.COMENTARIOS')}}:</span>
        <div class="text-center mt-2 mb-10">

          <v-textarea
            solo
            height="100"
            :no-resize="true"
            rows="5"
            v-model="comments"
            class="ml-7 mr-7"
          ></v-textarea>
        </div>
      </div>

      <v-lazy
        :options="{
            threshold: .6
            }"
        transition="slide-x-transition"
      >
        <SuccessPanel
          v-if="showSuccess"
          :title="$vuetify.lang.t('$vuetify.MUITO_OBRIGADO')"
          :subtitle="$vuetify.lang.t('$vuetify.FEEDBACK_ENVIADO')"
        >
        </SuccessPanel>
      </v-lazy>

      <v-divider class="mt-n6"></v-divider>
      <v-card-actions>
        <v-spacer v-if="!$vuetify.breakpoint.xs"></v-spacer>
        <v-btn
          color="primary"
          text
          @click="close(); closeDialog();"
          :x-small="$vuetify.breakpoint.xs"
        >{{!showSuccess?$vuetify.lang.t('$vuetify.CANCELAR'):$vuetify.lang.t('$vuetify.FECHAR')}}</v-btn>

        <v-btn
          color="primary"
          text
          @click="sendEvaluation()"
          :x-small="$vuetify.breakpoint.xs"
          v-if="!showSuccess"
        >{{$vuetify.lang.t('$vuetify.ENVIAR')}}</v-btn>
        <v-spacer v-if="$vuetify.breakpoint.xs"></v-spacer>
      </v-card-actions>
    </v-card>
  </v-dialog>

</template>

<script>

import SuccessPanel from '../../components/panels/SuccessPanel';

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
    closeDialog () {
      this.showSuccess = false;
      this.rating = 4;
      this.comments = ''
    },
    sendEvaluation () {

      this.showDialogLoading = true
      var evaluation = {
        comentario: this.comments,
        nota: this.rating,
        usuario: this.$getUser(),
        chamado: this.entity ? this.entity.issue : null
      }

      this.$post('/avaliacao', evaluation).then((response) => {

        if (response.data) {

          this.showSuccess = true;
          this.showDialogLoading = false;
          this.entity.issue.evaluation = response.data;

          if (this.feedBackFunction) {
            this.feedBackFunction()
          }
        }

        //Remove a notificação para evitar do usuário dar dois feedbacks na mesma entidade.
        if (this.entity && this.entity.notification) {
          this.$root.$emit('remove-notification', this.entity.notification)
        }
      });
    },
  },
  data: () => ({
    comments: '',
    rating: 4,
    showSuccess: false,
  }),
  created: function () {

  }
};
</script>