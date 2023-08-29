<template>
  <v-menu
    v-model="menu"
    :close-on-content-click="false"
    transition="slide-x-transition"
    offset-y
    max-width="290px"
    min-width="290px"
  >
    <template v-slot:activator="{ on, attrs }">
      <v-text-field
        :value="formatDate(date)"
        persistent-hint
        prepend-inner-icon="mdi-calendar"
        v-bind="attrs"
        v-on="on"
        readonly
        clearable
        @click:clear="event(null)"
        :outlined="outlined"
        :solo="!outlined"
        dense
        :rules="rules"
        :disabled="disabled"
      ></v-text-field>
    </template>
    <v-date-picker
      v-model="date"
      no-title
      @input="menu = false; if(type == 'month') event(date)"
      @click:date="event(date)"
      color="blue darken 2"
      :type="type"
    ></v-date-picker>
  </v-menu>
</template>

<script>
export default {
  data: () => ({
    menu: false,
  }),
  props: {
    event: Function,
    date: String,
    rules: Array,
    disabled: Boolean,
    outlined: Boolean,
    type: String,
  },
  methods: {
    formatDate (date) {
      if (!date) return null

      const [year, month, day] = date.split('-')

      if(this.type == 'month'){
        return `${month}/${year}`
      }

      if (this.$vuetify.lang.current == 'en') {
        return `${month}/${day}/${year}`
      } else {
        return `${day}/${month}/${year}`
      }

    },
  },
}
</script>