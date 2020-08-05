<template>
  <v-row justify="center">
    <v-dialog
      v-model="showDialog"
      persistent
      max-width="350"
    >
      <v-card v-show="!showSuccess">
        <v-card-title
          v-if="itemList.length > 0"
          class="headline-6"
          :class="{'subtitle-2':$vuetify.breakpoint.xs}"
          style="word-break: normal; !important"
        >
          {{title}}
        </v-card-title>
        <v-card-text
          v-if="itemList.length > 0"
          class="headline-6"
        >{{subtitle}}</v-card-text>

        <v-row class="ma-0 d-flex justify-center mb-12 ml-3 mr-3">

          <EmptyPanel
            class="mt-8 pt-10"
            :message="$vuetify.lang.t('$vuetify.NENHUM_CIRCUITO_SELECIONADO')"
            v-show="itemList.length == 0"
          >
          </EmptyPanel>
        </v-row>
        <v-divider class="mt-n6"></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="primary"
            text
            @click="close(); cleanFields()"
            :x-small="$vuetify.breakpoint.xs"
          >{{$vuetify.lang.t('$vuetify.FECHAR')}}</v-btn>
          <v-btn
            color="primary"
            text
            @click="close(); cleanFields()"
            :x-small="$vuetify.breakpoint.xs"
            :loading="showDialogLoading"
          >{{$vuetify.lang.t('$vuetify.ENVIAR')}}</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>

import EmptyPanel from '../../components/EmptyPanel';

export default {
  components: {
    EmptyPanel,
  },
  props: {
    title: String,
    subtitle: String,
    showDialog: Boolean,
    showSuccess: Boolean,
    showDialogLoading: Boolean,
    close: Function,
    send: Function,
    itemList: Array
  },
  methods: {
    cleanFields () {
      this.issue.observation = '';
      this.issue.reason = undefined;
    }
  },
  data: () => ({
    issue: { reason: undefined, observation: '' }
  })
};
</script>