<template>
  <div class="ma-0 pa-0">
    <WarningPanel
      :mobile=true
      :message="$vuetify.lang.t('$vuetify.NENHUMA_NOTIFICACAO')"
      v-show="notifications.length == 0"
      class="mt-5"
    ></WarningPanel>
    <v-list
      three-line
      style="overflow-y:auto;"
      height="320"
      v-if="notifications.length > 0"
    >
      <transition-group name="slide-x-transition">
        <v-list-item
          v-for="(item, i) in notifications"
          :key="i"
          ripple
          @click="viewFunction(item)"
          class="mr-0 pr-0"
        >

          <v-list-item-content>
            <span
              class="text-uppercase caption mt-n3"
              :class="{'font-weight-bold': !item.visualizado, 'font-weight-regular mb-5': item.visualizado}"
            >{{item.tipo=='NOVA_NOTA_FISCAL'?$vuetify.lang.t('$vuetify.NOTA_FISCAL_EMITIDA'):
          $vuetify.lang.t('$vuetify.CHAMADO_ABERTO_CIRCUITO_OFLFINE')}}</span>

            <span
              v-if="item.tipo=='NOVA_NOTA_FISCAL'"
              class="caption font-weight-bold grey--text text--lighten-1 mt-n8"
            >
              {{$vuetify.lang.t('$vuetify.NUMERO_NOTA') +': ' + item.mensagem}}</span>

            <span
              v-if="item.tipo=='CIRCUITO_OFFLINE'"
              class="caption font-weight-bold grey--text text--lighten-1 mt-n5 mb-5"
            >
              {{$vuetify.lang.t('$vuetify.CIRCUITO')+': ' + item.mensagem}}</span>

            <span
              v-if="item.visualizado"
              class="caption font-weight-bold green--text text--lighten-1 mt-n6"
            >
              {{$vuetify.lang.t('$vuetify.VISUALIZADO')}}</span>

          </v-list-item-content>

          <TooltipButton
            icon="mdi-delete"
            :message="$vuetify.lang.t('$vuetify.APAGAR_NOTIFICACAO')"
            :event="removeFunction"
            :object="item"
            :mobile="$vuetify.breakpoint.xs"
            :isText="true"
          ></TooltipButton>

        </v-list-item>
      </transition-group>
    </v-list>
  </div>
</template>

<script>
import TooltipButton from '../components/TooltipButton';
import WarningPanel from '../components/panels/WarningPanel';

export default {
  components: {
    TooltipButton,
    WarningPanel,
  },
  props: {
    notifications: Array,
    removeFunction: Function,
    viewFunction: Function,
  },
};
</script>