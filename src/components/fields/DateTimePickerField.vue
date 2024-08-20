<template>
  <v-datetime-picker
    :textFieldProps="{
      solo: true,
      prependInnerIcon: 'mdi-calendar',
      dense: true,
      clearable: true,
      color: 'red darken-2',
    }"
    :datePickerProps="{ color: 'red darken-2' }"
    :timePickerProps="{ color: 'red darken-2', format: '24hr' }"
    clearText="FECHAR"
    okText="CONFIRMAR"
    v-model="value"
    dateFormat="dd/MM/yyyy"
    :input="event(value)"
  >
    <template slot="dateIcon">
      <v-icon color="red darken-2">mdi-calendar</v-icon>
    </template>
    <template slot="timeIcon">
      <v-icon color="red darken-2">mdi-clock</v-icon>
    </template>
    <template slot="actions" slot-scope="{ parent }">
      <v-btn dark text color="blue darken-2" @click.native="parent.clearHandler"
        >FECHAR</v-btn
      >
      <v-btn dark text color="blue darken-2" @click="parent.okHandler"
        >CONFIRMAR</v-btn
      >
    </template>
  </v-datetime-picker>
</template>

<script>
export default {
  data: () => ({
    value: undefined,
  }),
  props: {
    event: Function,
  },
  methods: {
  },
};
</script>