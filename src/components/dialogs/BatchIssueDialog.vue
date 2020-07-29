<template>
  <v-row justify="center">
    <v-dialog
      v-model="showDialog"
      persistent
      :max-width="selectReason?360:450"
      v-if="showDialog"
    >
      <v-card v-show="!showSuccess">
        <v-card-title
          class="headline-6"
          style="word-break: normal; !important"
        >
          {{entity.type=='circuit'?
          $vuetify.lang.t('$vuetify.ABRINDO_CHAMADO_CIRCUITOS'):
          $vuetify.lang.t('$vuetify.ABRINDO_CHAMADO_NOTAS')}}
        </v-card-title>
        <v-card-text class="headline-6 mt-n2">{{selectReason?$vuetify.lang.t('$vuetify.SELECIONE_MOTIVO_OBSERVACAO'):
            $vuetify.lang.t('$vuetify.SELECIONE_CIRCUITOS')}}</v-card-text>

        <v-col
          class="mt-n3"
          v-show="selectReason"
        >

          <v-col
            class="ml-7 pl-3"
            cols="10"
          >
            <v-row>
              <span class=" text-right subtitle-2 font-weight-bold grey--text text--lighten-1">
                {{entity.type=='closing'?$vuetify.lang.t('$vuetify.MOTIVO_ENCERRAMENTO'):
                $vuetify.lang.t('$vuetify.MOTIVO_ABERTURA')}}:</span>
            </v-row>
            <v-row>
              <v-select
                :items="reasonList"
                v-model="issue.reason"
                :label="$vuetify.lang.t('$vuetify.SELECIONE_MOTIVO')"
                solo
                dense
              ></v-select>
            </v-row>
          </v-col>

          <v-col
            class="ml-7 mt-n6"
            cols="10"
          >
            <v-row>
              <span class=" text-right subtitle-2 font-weight-bold grey--text text--lighten-1">
                {{$vuetify.lang.t('$vuetify.OBSERVACAO')}}:</span>
            </v-row>
            <v-row>
              <v-textarea
                solo
                height="100"
                :no-resize="true"
                rows="5"
                v-model="issue.observation"
              ></v-textarea>
            </v-row>
          </v-col>
        </v-col>

        <v-col
          class="mt-n3"
          v-show="!selectReason"
        >

          <v-row>
            <v-col
              class="overflow-y-auto"
              style="max-height:18rem;"
            >
              <v-col
                cols="11"
                class="ml-4 mt-n4"
              >
                <v-row>
                  <span class=" text-right subtitle-2 font-weight-bold grey--text text--lighten-1">
                    {{$vuetify.lang.t('$vuetify.BUSCAR')}}:</span>
                </v-row>
                <v-row md="2">
                  <v-text-field
                    v-model.trim="searchText"
                    dense
                    label="Regular"
                    :placeholder="$vuetify.lang.t('$vuetify.DESIGNACAO_CLIENTE_TPZ')"
                    single-line
                    solo
                    max-width="200"
                    append-icon="mdi-magnify"
                    @click:append="search(searchText)"
                    @keypress.enter="search(searchText)"
                  ></v-text-field>
                </v-row>

                <EmptyPanel
                  :mobile=true
                  :message="$vuetify.lang.t('$vuetify.NENHUM_CIRCUITO')"
                  v-show="itemList.length == 0"
                >
                </EmptyPanel>
              </v-col>
            </v-col>

            <v-divider
              vertical
              class="mt-3 mb-5"
              style="height:20rem;"
            > </v-divider>

            <v-col
              class="overflow-y-auto"
              style="max-height:18rem;"
            >

              <EmptyPanel
                class="mt-12 pt-12"
                :mobile=true
                :message="$vuetify.lang.t('$vuetify.NENHUM_CIRCUITO_SELECIONADO')"
                v-show="selectedItemList.length == 0"
              >
              </EmptyPanel>
            </v-col>
          </v-row>
        </v-col>

        <v-divider class="mt-n6"></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="primary"
            text
            @click="close(); cleanFields()"
            :x-small="$vuetify.breakpoint.xs"
          >{{$vuetify.lang.t('$vuetify.CANCELAR')}}</v-btn>
          <v-btn
            color="primary"
            text
            @click="selectReason = true"
            :x-small="$vuetify.breakpoint.xs"
            v-show="!selectReason"
          >{{$vuetify.lang.t('$vuetify.PROXIMO')}}</v-btn>
          <v-btn
            color="primary"
            text
            @click="selectReason = false"
            :x-small="$vuetify.breakpoint.xs"
            v-show="selectReason"
          >{{$vuetify.lang.t('$vuetify.ANTERIOR')}}</v-btn>
          <v-btn
            color="primary"
            text
            @click="send(issue, entity); cleanFields()"
            :x-small="$vuetify.breakpoint.xs"
            :loading="showDialogLoading"
            v-show="selectReason"
          >{{$vuetify.lang.t('$vuetify.ENVIAR')}}</v-btn>
        </v-card-actions>
      </v-card>

      <v-card v-show="showSuccess">
        <v-col class="pt-8 mb-8">
          <v-row
            justify="center"
            class="mb-3"
          >
            <v-icon
              size="62"
              color="success"
            >mdi-checkbox-marked-circle</v-icon>
          </v-row>
          <v-row justify="center">
            <span class="text-center headline font-weight-bold grey--text text--darken-3">
              {{$vuetify.lang.t('$vuetify.CHAMADO_CRIADO')}} </span>

            <span class="text-center SUBTITLE-2 font-weight-bold grey--text text--darken-3">
              {{$vuetify.lang.t('$vuetify.PROTOCOLO')+': '+entity.protocolo}} </span>
          </v-row>
        </v-col>
        <v-divider class="mt-n6"></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="primary"
            text
            @click="close(); cleanFields()"
            :x-small="$vuetify.breakpoint.xs"
          >{{$vuetify.lang.t('$vuetify.FECHAR')}}</v-btn>
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
    entity: Object,
    showDialog: Boolean,
    showSuccess: Boolean,
    showDialogLoading: Boolean,
    close: Function,
    send: Function,
    search: Function,
    itemList: Array,
    reasonList: Array
  },
  methods: {
    cleanFields () {
      this.issue.observation = '';
      this.issue.reason = undefined;
      this.selectReason = false
    }
  },
  data: () => ({
    searchText: '',
    selectedItemList: [],
    selectReason: false,
    issue: { reason: undefined, observation: '' }
  })
};
</script>