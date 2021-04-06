 <template>
  <v-dialog
    v-model="show"
    max-width="300"
    overflow-y-hidden
    overflow-x-hidden
  >
    <v-card class="mt-2">
      <v-card-title
        style="word-break: normal; !important"
        class="headline"
      >{{title}}</v-card-title>

      <v-card-text class="mt-n2">
        {{info}}
      </v-card-text>

      <v-row
        class="ma-0"
        style="overflow-y:auto;"
      >
        <v-list
          disabled
          class="ml-3"
          max-height="300"
        >

          <v-list-item
            v-for="(object, i) in list"
            :key="i"
          >

            <v-list-item-content>
              <v-list-item-title
                class="font-weight-bold"
                v-text="object"
              ></v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-row>

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
    list: Array,
  },
};
</script>