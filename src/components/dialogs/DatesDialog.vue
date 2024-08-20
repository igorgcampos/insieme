 <template>
  <v-dialog
    v-model="dialog"
    persistent
    max-width="550"
    class="overflow-x-hidden"
  >
    <v-card class="overflow-x-hidden">
      <v-card-title
        class="headline-6"
        style="word-break: normal; !important"
        :class="{ 'subtitle-2': $vuetify.breakpoint.xs }"
      >
        {{ title }}
      </v-card-title>

      <v-row class="mt-3 justify-center">
        <v-col cols="5" class="mr-5">
          <v-row>
            <span
              class="text-right subtitle-2 font-weight-bold grey--text text--lighten-1"
            >
              {{ $vuetify.lang.t("$vuetify.INICIO") }}:</span
            >
          </v-row>
          <v-row md="3">
            <DateTimePickerField
              class="ml-n3 mt-n3"
              :event="getStartDate"
            ></DateTimePickerField>
          </v-row>
        </v-col>
        <v-col cols="5">
          <v-row>
            <span
              class="text-right subtitle-2 font-weight-bold grey--text text--lighten-1"
            >
              {{ $vuetify.lang.t("$vuetify.FIM") }}:</span
            >
          </v-row>
          <v-row md="3">
            <DateTimePickerField
              class="ml-n3 mt-n3"
              :event="getEndDate"
            ></DateTimePickerField>
          </v-row>
        </v-col>
      </v-row>

      <v-divider></v-divider>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="primary" text @click="close()">
          {{ $vuetify.lang.t("$vuetify.CANCELAR") }}
        </v-btn>
        <v-btn color="primary" text @click="event(object, start, end)" :loading="loading">
          {{ $vuetify.lang.t("$vuetify.ENVIAR") }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import DateTimePickerField from "../../components/fields/DateTimePickerField";
export default {
  components: {
    DateTimePickerField,
  },
  props: {
    close: Function,
    event: Function,
    object: Object,
    loading: Boolean,
    dialog: Boolean,
    title: String,
  },
  data: () => ({
    start: undefined,
    end: undefined,
  }),
  methods: {
    getStartDate(value) {
       if (!value) {
        return;
      }

      var year = value.getFullYear();
      var month = ("0" + (value.getMonth() + 1)).slice(-2);
      var day = ("0" + value.getDate()).slice(-2);

      this.start = year + "-" + month + "-" + day + ' ' + 
      (value.getHours() >= 10 ? value.getHours() : "0" + value.getHours()) +
          ":" +
          (value.getMinutes() >= 10
            ? value.getMinutes()
            : "0" + value.getMinutes())
    },
    getEndDate(value) {
      if (!value) {
        return;
      }

      var year = value.getFullYear();
      var month = ("0" + (value.getMonth() + 1)).slice(-2);
      var day = ("0" + value.getDate()).slice(-2);

      this.end = year + "-" + month + "-" + day + ' ' + 
      (value.getHours() >= 10 ? value.getHours() : "0" + value.getHours()) +
          ":" +
          (value.getMinutes() >= 10
            ? value.getMinutes()
            : "0" + value.getMinutes())
    },
  },
};
</script>