 <template>
  <v-menu
    bottom
    right
    transition="slide-x-transition"
    origin="top left"
    :close-on-click="true"
    :close-on-content-click="false"
  >
    <template v-slot:activator="{ on: menu, attrs }">
      <v-tooltip bottom>
        <template v-slot:activator="{ on }">
          <v-btn
            icon
            color="white"
            class="ml-2 mr-0"
            v-bind="attrs"
            v-on="{ ...menu }"
          >
            <v-icon v-on="on">mdi-apps</v-icon>
          </v-btn>
        </template>
        <span>{{$vuetify.lang.t('$vuetify.APLICACOES')}}</span>
      </v-tooltip>
    </template>

    <v-card
      width="290"
      height="330"
      style="overflow-y:auto;"
    >

      <v-row class="pa-4 pt-0 ma-0">
        <ApplicationItem
          name="Insieme"
          icon="mdi-satellite-variant"
          :url="'http://localhost:8082/?token='+ getToken()"
          color="red darken-2"
          :hide="true"
        ></ApplicationItem>
        <ApplicationItem
          name="Chilometer"
          icon="mdi-road-variant"
          :url="'http://localhost:8081/?token='+ getToken()"
          color="green darken-2"
        ></ApplicationItem>
        <ApplicationItem
          name="Operações"
          icon="mdi-cogs"
          url=""
          color="blue darken-2"
        ></ApplicationItem>
        <ApplicationItem
          name="Protocolos"
          icon="mdi-format-list-numbered"
          url=""
          color="yellow darken-2"
        ></ApplicationItem>

      </v-row>

    </v-card>
  </v-menu>
</template>

<script>

import ApplicationItem from '../components/ApplicationItem';
export default {

  components: {
    ApplicationItem,
  },
  props: {
    hide: String,
  },
  methods: {
    getToken () {
      return window.sessionStorage.getItem('keyCloakToken');
    }
  }
};
</script>
<style scoped>
.row-pointer {
  cursor: pointer;
}
</style>