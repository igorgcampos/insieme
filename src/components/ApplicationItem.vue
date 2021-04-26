<template>
  <v-col
    class="col-6"
    v-show="!hide"
  >
    <v-hover>
      <template v-slot:default="{ hover }">
        <v-card
          :elevation="hover ? 2 : 0"
          class="ma-0 row-pointer"
          :href="url"
        >
          <v-row justify="center">
            <v-icon
              x-large
              class="mt-5"
              :color="color"
            >{{icon}}</v-icon>
          </v-row>
          <v-row justify="center">
            <span class="mt-3 text-center button font-weight-bold grey--text">
              {{name}}</span>
          </v-row>
        </v-card>
      </template>
    </v-hover>
  </v-col>
</template>

<script>
export default {
  data: () => ({

  }),
  props: {
    icon: String,
    name: String,
    hide: Boolean,
    url: String,
    color: String,
  },
  methods: {
  },
}
</script>