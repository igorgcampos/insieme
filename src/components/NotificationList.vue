<template>
  <v-list
    three-line
    style="overflow-y:auto;"
    height="320"
  >
    <v-list-item
      v-for="(item, i) in notifications"
      :key="i"
      ripple
      @click="viewFunction(item)"
      @mouseover="item.showRemove=true"
      @mouseleave="item.showRemove=false"
      class="mr-0 pr-0"
    >

      <v-list-item-content>
        <span
          class="text-uppercase caption mt-n3"
          :class="{'font-weight-bold': !item.visualizado, 'font-weight-regular mb-5': item.visualizado}"
        >{{item.tipo=='NOVA_NOTA_FISCAL'?'Uma nova nota fiscal foi emitida!':
          'Um chamado foi aberto automaticamente!'}}</span>

        <span class="caption font-weight-bold grey--text text--lighten-1 mt-n8">
          {{'Número da nota: ' + item.mensagem}}</span>

        <span
          v-if="item.visualizado"
          class="caption font-weight-bold green--text text--lighten-1 mt-n6"
        >
          {{'Visualizado'}}</span>
      </v-list-item-content>

      <div :v-show="item.showRemove">
        <TooltipButton
          icon="mdi-delete"
          :message="$vuetify.lang.t('$vuetify.APAGAR_NOTIFICACAO')"
          :event="removeFunction(item)"
          :mobile="$vuetify.breakpoint.xs"
          :isText=true
        ></TooltipButton>
      </div>
    </v-list-item>
  </v-list>
</template>

<script>
import TooltipButton from '../components/TooltipButton';

export default {
  components: {
    TooltipButton,
  },
  props: {
    notifications: Array,
    removeFunction: Function,
    viewFunction: Function,
  },
};
</script>