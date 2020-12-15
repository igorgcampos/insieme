<template>
  <v-col :cols="!$vuetify.breakpoint.xs?6:12">
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
          v-model="computedDateFormatted"
          persistent-hint
          prepend-inner-icon="mdi-calendar"
          readonly
          v-bind="attrs"
          v-on="on"
          solo
          dense
        ></v-text-field>
      </template>
      <v-date-picker
        v-model="date"
        no-title
        @input="menu = false"
        @click:date="event(date)"
        color="error"
      ></v-date-picker>
    </v-menu>

  </v-col>
</template>

<script>
export default {
  data: () => ({
    dateFormatted: null,
    menu: false,
  }),
  props: {
    event: Function,
    date: Object,
  },
  computed: {
    computedDateFormatted () {
      return this.formatDate(this.date)
    },
  },
  methods: {
    formatDate (date) {
      if (!date) return null

      const [year, month, day] = date.split('-')

      if (this.$vuetify.lang.current == 'en') {
        return `${month}/${day}/${year}`
      } else {
        return `${day}/${month}/${year}`
      }

    },
  },
}
</script>