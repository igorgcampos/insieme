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
          <v-row class="mt-2 ml-2">
            <v-col>
              <v-row class="ml-4">
                <span class="text-right subtitle-1 font-weight-bold grey--text text--darken-1">
                  {{$vuetify.lang.t('$vuetify.DUVIDAS_FINANCEIRAS')}}</span>
                <v-col>
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on }">
                      <v-btn
                        icon
                        color="grey--text text--darken-1"
                        class="ml-1 mt-n6"
                        @click="expandFinancialPanel()"
                      >
                        <v-icon v-on="on">{{showFinancialPanel?'mdi-arrow-up-drop-circle-outline':
            'mdi-arrow-down-drop-circle-outline'}}</v-icon>
                      </v-btn>
                    </template>
                    <span>{{showFinancialPanel?$vuetify.lang.t('$vuetify.ESCONDER'):$vuetify.lang.t('$vuetify.MOSTRAR')}}</span>
                  </v-tooltip>
                </v-col>
              </v-row>

              <v-row>
                <div
                  class="ma-0 pt-2 overflow-y-auto overflow-x-hidden"
                  v-show="showFinancialPanel"
                  style="width:97%; max-height:250px;"
                >
                  <v-expansion-panels class="ma-1 mt-n1 ml-8 pr-12">
                    <v-expansion-panel
                      v-for="(item, i) in financialItems"
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

          <v-row class="mt-n4 ml-2">
            <v-col>
              <v-row class="ml-4">
                <span class="text-right subtitle-1 font-weight-bold grey--text text--darken-1">
                  {{$vuetify.lang.t('$vuetify.DUVIDAS_COMERCIAIS')}}</span>
                <v-col>
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on }">
                      <v-btn
                        icon
                        color="grey--text text--darken-1"
                        class="ml-1 mt-n6"
                        @click="expandCommercialPanel()"
                      >
                        <v-icon v-on="on">{{showCommercialPanel?'mdi-arrow-up-drop-circle-outline':
            'mdi-arrow-down-drop-circle-outline'}}</v-icon>
                      </v-btn>
                    </template>
                    <span>{{showCommercialPanel?$vuetify.lang.t('$vuetify.ESCONDER'):$vuetify.lang.t('$vuetify.MOSTRAR')}}</span>
                  </v-tooltip>
                </v-col>
              </v-row>

              <v-row>
                <div
                  class="ma-0 pt-2 overflow-y-auto overflow-x-hidden"
                  v-show="showCommercialPanel"
                  style="width:97%; max-height:250px;"
                >
                  <v-expansion-panels class="ma-1 mt-n1 ml-8 pr-12">
                    <v-expansion-panel
                      v-for="(item, i) in commercialItems"
                      :key="i"
                      hide-actions
                    >
                      <v-expansion-panel-header class="pt-0 pb-0 ma-0 mt-n1 mb-n1">
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

          <v-row class="mt-n4 ml-2">
            <v-col>
              <v-row class="ml-4">
                <span class="text-right subtitle-1 font-weight-bold grey--text text--darken-1">
                  {{$vuetify.lang.t('$vuetify.DUVIDAS_OPERACIONAIS')}}</span>
                <v-col>
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on }">
                      <v-btn
                        icon
                        color="grey--text text--darken-1"
                        class="ml-1 mt-n6"
                        @click="expandOperationalPanel()"
                      >
                        <v-icon v-on="on">{{showOperationalPanel?'mdi-arrow-up-drop-circle-outline':
            'mdi-arrow-down-drop-circle-outline'}}</v-icon>
                      </v-btn>
                    </template>
                    <span>{{showOperationalPanel?$vuetify.lang.t('$vuetify.ESCONDER'):$vuetify.lang.t('$vuetify.MOSTRAR')}}</span>
                  </v-tooltip>
                </v-col>
              </v-row>

              <v-row>
                <div
                  class="ma-0 pt-2 overflow-y-auto overflow-x-hidden"
                  v-show="showOperationalPanel"
                  style="width:97%; max-height:250px;"
                >
                  <v-expansion-panels class="ma-1 mt-n1 ml-8 pr-12">
                    <v-expansion-panel
                      v-for="(item, i) in operationalItems"
                      :key="i"
                      hide-actions
                    >
                      <v-expansion-panel-header class="pt-0 pb-0 ma-0 mt-n1 mb-n1">
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
    expandFinancialPanel () {
      this.showFinancialPanel = !this.showFinancialPanel;

      if (this.showFinancialPanel) {
        this.showCommercialPanel = false;
        this.showOperationalPanel = false;
      }
    },
    expandCommercialPanel () {
      this.showCommercialPanel = !this.showCommercialPanel;

      if (this.showCommercialPanel) {
        this.showFinancialPanel = false;
        this.showOperationalPanel = false;
      }
    },
    expandOperationalPanel () {
      this.showOperationalPanel = !this.showOperationalPanel;

      if (this.showOperationalPanel) {
        this.showCommercialPanel = false;
        this.showFinancialPanel = false;
      }
    },
  },
  data: () => ({
    commercialItems: [],
    financialItems: [],
    operationalItems: [],
    showFinancialPanel: false,
    showCommercialPanel: false,
    showOperationalPanel: false
  }),
  created: function () {

    this.financialItems.push({      question: this.$vuetify.lang.t('$vuetify.DUVIDA_FINANCEIRO_1'),
      awnser: this.$vuetify.lang.t('$vuetify.RESPOSTA_FINANCEIRO_1')    })
    this.financialItems.push({      question: this.$vuetify.lang.t('$vuetify.DUVIDA_FINANCEIRO_2'),
      awnser: this.$vuetify.lang.t('$vuetify.RESPOSTA_FINANCEIRO_2')    })

    this.commercialItems.push({      question: this.$vuetify.lang.t('$vuetify.DUVIDA_COMERCIAL_1'),
      awnser: this.$vuetify.lang.t('$vuetify.RESPOSTA_COMERCIAL_1')    })
    this.commercialItems.push({      question: this.$vuetify.lang.t('$vuetify.DUVIDA_COMERCIAL_2'),
      awnser: this.$vuetify.lang.t('$vuetify.RESPOSTA_COMERCIAL_2')    })
    this.commercialItems.push({      question: this.$vuetify.lang.t('$vuetify.DUVIDA_COMERCIAL_3'),
      awnser: this.$vuetify.lang.t('$vuetify.RESPOSTA_COMERCIAL_3')    })
    this.commercialItems.push({      question: this.$vuetify.lang.t('$vuetify.DUVIDA_COMERCIAL_4'),
      awnser: this.$vuetify.lang.t('$vuetify.RESPOSTA_COMERCIAL_4')    })

    this.operationalItems.push({})
  }
};
</script>