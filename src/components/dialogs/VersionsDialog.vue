<template>

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
        :class="{'subtitle-2':$vuetify.breakpoint.xs}"
      >
        {{$vuetify.lang.t('$vuetify.VERSOES')}}
      </v-card-title>
      <v-card-text
        class="mt-n2 headline-6"
        :class="{'caption':$vuetify.breakpoint.xs}"
      >{{$vuetify.lang.t('$vuetify.VERSOES_DESCRICAO')}}</v-card-text>

      <v-col
        class="ma-n2 pa-0 overflow-y-hidden overflow-x-hidden"
        style="min-height:22rem; max-height:28rem;"
      >
        <v-row class="mt-n3 ml-2">
          <v-col>
            <v-row>
              <div
                class="ma-0 pt-2 mt-0 mb-3 overflow-y-auto overflow-x-hidden"
                style="width:97%; min-height:10rem; max-height:19rem"
              >
                <v-expansion-panels class="ma-1 ml-7 mt-0 pr-12">
                  <v-expansion-panel
                    v-for="(item, i) in items"
                    :key="i"
                    hide-actions
                  >
                    <v-expansion-panel-header class="pt-0 pb-0 ma-0 mb-n1">
                      <span :class="{'caption':$vuetify.breakpoint.xs}">{{item.title}} </span>
                    </v-expansion-panel-header>

                    <v-expansion-panel-content>
                      <span
                        class="subtitle-3 font-weight-bold"
                        :class="{'caption':$vuetify.breakpoint.xs}"
                        v-html="item.description"
                      ></span>
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
        <v-spacer v-if="!$vuetify.breakpoint.xs"></v-spacer>
        <v-btn
          color="primary"
          text
          @click="close()"
          :x-small="$vuetify.breakpoint.xs"
        >{{$vuetify.lang.t('$vuetify.FECHAR')}}</v-btn>
        <v-spacer v-if="$vuetify.breakpoint.xs"></v-spacer>
      </v-card-actions>
    </v-card>
  </v-dialog>

</template>

<script>

export default {
  props: {
    close: Function,
    show: Boolean
  },
  methods: {

  },
  data: () => ({
    items: [],
    searchText: ''
  }),
  beforeUpdate: function () {

    this.items = []

    this.items.push({
      title: 'V2.0.0',
      description: this.$vuetify.lang.t('$vuetify.V_2_0_0')
    })

    this.items.push({
      title: 'V2.1.0',
      description: this.$vuetify.lang.t('$vuetify.V_2_1_0')
    })

    this.items.push({
      title: 'V2.2.0',
      description: this.$vuetify.lang.t('$vuetify.V_2_2_0')
    })

    this.items.push({
      title: 'V2.3.0',
      description: this.$vuetify.lang.t('$vuetify.V_2_3_0')
    })

    this.items.push({
      title: 'V2.4.0',
      description: this.$vuetify.lang.t('$vuetify.V_2_4_0')
    })

    this.items.push({
      title: 'V2.5.0',
      description: this.$vuetify.lang.t('$vuetify.V_2_5_0')
    })

    this.selectedItems = this.items
  }
};
</script>