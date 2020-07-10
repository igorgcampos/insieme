<template>
  <v-row justify="center">
    <v-dialog
      persistent
      max-width="480"
      v-model="show"
      class="mt-n3 overflow-y-hidden overflow-x-hidden"
    >
      <v-card>
        <v-card-title
          class="headline-6"
          style="word-break: normal; !important"
        >
          {{$vuetify.lang.t('$vuetify.CENTRAL_AJUDA')}}
        </v-card-title>
        <v-card-text class="mt-n2 headline-6">{{$vuetify.lang.t('$vuetify.RESPOSTAS_DUVIDAS')}}</v-card-text>

        <v-col
          class="ma-n2 pa-0 overflow-y-hidden overflow-x-hidden"
          style="min-height:28rem; max-height:28rem;"
        >
          <v-row class="mt-n3 ml-2">
            <v-col>
              <v-col
                cols="8"
                class="ml-4"
              >
                <v-row>
                  <v-text-field
                    v-model.trim="searchText"
                    dense
                    :placeholder="$vuetify.lang.t('$vuetify.BUSCAR_PERGUNTA')"
                    single-line
                    solo
                    max-width="200"
                    append-icon="mdi-magnify"
                    @keypress="search()"
                    @keyup.delete="search()"
                  ></v-text-field>
                </v-row>
              </v-col>
              <v-row>
                <div
                  class="ma-0 pt-2 mt-n4 overflow-y-auto overflow-x-hidden"
                  style="width:97%; max-height:335px;"
                >
                  <v-expansion-panels class="ma-1 ml-7 mt-0 pr-12">
                    <v-expansion-panel
                      v-for="(item, i) in selectedItems"
                      :key="i"
                      hide-actions
                    >
                      <v-expansion-panel-header class="pt-0 pb-0 ma-0 mb-n1">
                        <span>{{item.question}} </span>
                      </v-expansion-panel-header>

                      <v-expansion-panel-content>
                        <span class="subtitle-3 font-weight-bold">{{item.awnser}}</span>
                      </v-expansion-panel-content>
                    </v-expansion-panel>
                  </v-expansion-panels>
                </div>
              </v-row>

            </v-col>
          </v-row>

        </v-col>
        <v-divider class="mt-n6"></v-divider>
        <v-card-actions>
          <v-btn
            color="primary"
            text
            @click="openChat()"
          >{{$vuetify.lang.t('$vuetify.AINDA_COM_DUVIDAS')}}</v-btn>
          <v-spacer></v-spacer>
          <v-btn
            color="primary"
            text
            @click="close()"
          >{{$vuetify.lang.t('$vuetify.FECHAR')}}</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>

export default {
  props: {
    close: Function,
    show: Boolean
  },
  methods: {
    search () {

      if (this.searchText.length == 0) {
        this.selectedItems = this.items;
        return
      }

      this.selectedItems = []
      for (var index in this.items) {
        if (this.items[index].question.includes(this.searchText) ||
          this.items[index].awnser.includes(this.searchText)) {
          this.selectedItems.push(this.items[index])
        }
      }
    },
    openChat () {

      this.$showChat()
      this.close();
    }
  },
  data: () => ({
    items: [],
    selectedItems: [],
    searchText: ''
  }),
  created: function () {
    this.items.push({      question: this.$vuetify.lang.t('$vuetify.DUVIDA_1'),
      awnser: this.$vuetify.lang.t('$vuetify.RESPOSTA_1')    })

    this.items.push({      question: this.$vuetify.lang.t('$vuetify.DUVIDA_2'),
      awnser: this.$vuetify.lang.t('$vuetify.RESPOSTA_2')    })

    this.items.push({      question: this.$vuetify.lang.t('$vuetify.DUVIDA_3'),
      awnser: this.$vuetify.lang.t('$vuetify.RESPOSTA_3')    })

    this.items.push({      question: this.$vuetify.lang.t('$vuetify.DUVIDA_4'),
      awnser: this.$vuetify.lang.t('$vuetify.RESPOSTA_4')    })

    this.items.push({      question: this.$vuetify.lang.t('$vuetify.DUVIDA_5'),
      awnser: this.$vuetify.lang.t('$vuetify.RESPOSTA_5')    })

    this.items.push({      question: this.$vuetify.lang.t('$vuetify.DUVIDA_6'),
      awnser: this.$vuetify.lang.t('$vuetify.RESPOSTA_6')    })

    this.items.push({      question: this.$vuetify.lang.t('$vuetify.DUVIDA_7'),
      awnser: this.$vuetify.lang.t('$vuetify.RESPOSTA_7')    })

    this.items.push({      question: this.$vuetify.lang.t('$vuetify.DUVIDA_8'),
      awnser: this.$vuetify.lang.t('$vuetify.RESPOSTA_8')    })

    this.items.push({      question: this.$vuetify.lang.t('$vuetify.DUVIDA_9'),
      awnser: this.$vuetify.lang.t('$vuetify.RESPOSTA_9')    })

    this.selectedItems = this.items
  }
};
</script>