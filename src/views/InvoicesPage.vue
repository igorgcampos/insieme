<template>
  <div>
    <v-row class="ml-n1">
      <span class="mb-7 text-right display-1 font-weight-bold grey--text text--darken-1">
        {{$vuetify.lang.t('$vuetify.NOTAS_FISCAIS')}}</span>
    </v-row>

    <v-row>
      <v-col class="flex-grow-0">
        <CountCard
          :count="counts[0]"
          message="Pagos"
          color="green--text"
          size="display-1"
        ></CountCard>
      </v-col>
      <v-col class="flex-grow-0">
        <CountCard
          :count="counts[1]"
          message="Pendentes"
          color="red--text"
          size="display-1"
        ></CountCard>
      </v-col>
    </v-row>
  </div>
</template>

<script>

import CountCard from '../components/CountCard'

export default {
  components: {
    CountCard
  },
  methods: {

  },
  props: {
    contract: Object
  },
  data: () => ({
    counts: [],
  }),
  created: function () {
    this.$get('/nota/counts',
      { contractId: this.$props.contract.id }).then((response) => {
        this.counts = response.data;
      });
  }
};
</script>
