<template>
  <v-row justify="center">
    <v-dialog
      v-model="showDialog"
      persistent
      :max-width="selectReason?360:470"
      v-if="showDialog"
    >
      <v-card v-show="!showSuccess">
        <v-card-title
          class="headline-6"
          :class="{'subtitle-2':$vuetify.breakpoint.xs}"
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
              class="overflow-y-hidden overflow-x-hidden"
              :min-height="$vuetify.breakpoint.xs?250:320"
            >
              <v-col
                cols="11"
                class="ml-4 mt-n4 pr-0 mr-0"
              >
                <v-row>
                  <span class=" text-right subtitle-2 font-weight-bold grey--text text--lighten-1">
                    {{$vuetify.lang.t('$vuetify.BUSCAR')}}:</span>
                </v-row>
                <v-row class="mr-1">
                  <v-text-field
                    v-model.trim="searchText"
                    dense
                    label="Regular"
                    :placeholder="$vuetify.lang.t('$vuetify.DESIGNACAO_CLIENTE_TPZ')"
                    single-line
                    solo
                    max-width="200"
                    append-icon="mdi-magnify"
                    @click:append="search(searchText, 0); selectedCheckList = []; page = 0;"
                    @keypress.enter="search(searchText, 0); selectedCheckList = []; page = 0;"
                  ></v-text-field>
                </v-row>

                <EmptyPanel
                  :mobile=true
                  :message="$vuetify.lang.t('$vuetify.NENHUM_CIRCUITO')"
                  v-show="itemList.length == 0 && !showDialogLoading"
                ></EmptyPanel>

                <v-lazy
                  :options="{threshold: .6}"
                  transition="slide-x-transition"
                >

                  <v-list
                    v-show="itemList.length > 0"
                    two-line
                    flat
                    class="ml-n6 mt-n4 pt-3 overflow-y-auto"
                    :height="$vuetify.breakpoint.xs?170:240"
                    id="listId"
                    v-scroll:#listId="searchMore"
                  >
                    <v-list-item-group multiple>
                      <v-list-item
                        class="mt-n3"
                        :class="{'ml-n3':$vuetify.breakpoint.xs}"
                        v-for="(item, i) in itemList"
                        :key="i"
                      >
                        <template v-slot:default="{ active }">

                          <v-list-item-action>
                            <v-checkbox
                              :input-value="active"
                              v-model="selectedCheckList"
                              color="primary"
                              dense
                              :value="item"
                              @click.native="selectItem(item, true, active)"
                            ></v-checkbox>
                          </v-list-item-action>

                          <v-list-item-content
                            class="ml-n3"
                            :class="{'ml-n7':$vuetify.breakpoint.xs}"
                          >
                            <v-list-item-title
                              class="subtitle-2"
                              :class="{'caption':$vuetify.breakpoint.xs}"
                            >
                              {{item.nome}}</v-list-item-title>
                            <v-list-item-subtitle class="caption">{{item.designacaoCliente.toLowerCase()}}</v-list-item-subtitle>
                          </v-list-item-content>
                        </template>
                      </v-list-item>
                    </v-list-item-group>
                  </v-list>
                </v-lazy>
              </v-col>
            </v-col>

            <v-divider
              vertical
              class="mt-3 mb-5"
              :style="{height: size + 'em'}"
            > </v-divider>

            <v-col
              class="overflow-y-auto overflow-x-hidden mt-4"
              :style="{height: size + 'em'}"
            >

              <v-col
                cols="11"
                class="ml-4 mt-n1"
                :class="{'mt-n8':$vuetify.breakpoint.xs}"
              >
                <EmptyPanel
                  class="mt-8 pt-10"
                  :mobile=true
                  :message="$vuetify.lang.t('$vuetify.NENHUM_CIRCUITO_SELECIONADO')"
                  v-show="selectedItemList.length == 0"
                >
                </EmptyPanel>

                <v-row
                  class="ml-0 mt-2 d-flex justify-left"
                  :class="{'ml-n7':$vuetify.breakpoint.xs}"
                >
                  <transition-group name="slide-x-transition">
                    <v-chip
                      v-for="(item) in selectedItemList"
                      :key="item.id"
                      color="success"
                      class="ml-0 mr-2 mt-2"
                      label
                      :small="$vuetify.breakpoint.xs"
                      @click:close="selectItem(item, false)"
                      close
                    >
                      {{ item.nome}}
                    </v-chip>
                  </transition-group>
                </v-row>

              </v-col>
            </v-col>
          </v-row>
        </v-col>

        <v-divider class="mt-n6"></v-divider>
        <v-card-actions>
          <v-spacer v-if="!$vuetify.breakpoint.xs"></v-spacer>
          <v-btn
            color="primary"
            text
            @click="close(); cleanFields(true)"
            :x-small="$vuetify.breakpoint.xs"
          >{{$vuetify.lang.t('$vuetify.CANCELAR')}}</v-btn>
          <v-btn
            color="primary"
            text
            @click="next()"
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
        <v-spacer v-if="$vuetify.breakpoint.xs"></v-spacer>
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
    noResult: Boolean,
    close: Function,
    send: Function,
    search: Function,
    itemList: Array,
    reasonList: Array
  },
  methods: {
    next () {
      if (this.selectedItemList.length > 0) {
        this.selectReason = true
      }
    },
    searchMore () {

      if (this.showDialogLoading || this.noResult) {
        return;
      }

      if (document.getElementById('listId').scrollTop + (this.$vuetify.breakpoint.xs ? 171 : 241) >=
        document.getElementById('listId').scrollHeight) {
        this.page++;
        this.search(this.searchText, this.page)
      }

    },
    selectItem (item, checkList) {

      if (!this.issue.items) {
        this.issue.items = this.selectedItemList
      }

      if (!this.containsItem(item, this.selectedItemList) && this.containsItem(item, this.selectedCheckList)) {
        this.selectedItemList.push(item)
      } else {

        if (!checkList || !this.containsItem(item, this.selectedCheckList))
          this.selectedItemList = this.selectedItemList.filter(function (value) {
            return value.id != item.id
          });

        if (!checkList)
          this.selectedCheckList = this.selectedCheckList.filter(function (value) {
            return value.id != item.id
          });
      }
    },
    containsItem (item, list) {

      for (var index in list) {
        if (list[index].id == item.id)
          return true;
      }

      return false
    },
    cleanFields (cancel) {
      this.issue.observation = '';
      this.issue.reason = undefined;

      if (cancel) {
        this.selectReason = false
      } else {
        this.selectReason = !this.showSuccess
      }
      this.selectedItemList = [];
      this.searchText = '';
    }
  },
  data: () => ({
    size: 0,
    page: 0,
    check: false,
    searchText: '',
    selectedItemList: [],
    selectedCheckList: [],
    selectReason: false,
    issue: { reason: undefined, observation: '', origin: 'CIRCUITO_LOTE', items: undefined }
  }),
  created: function () {
    this.size = this.$vuetify.breakpoint.xs ? 14 : 20;
    this.search('', 0)
  }
};
</script>