<template>
  <v-tooltip
    :top="!bottom"
    :bottom="bottom"
  >
    <template v-slot:activator="{ on }">
      <v-btn
        v-if="label"
        :text="isText"
        color="primary"
        @click="event(object, $event)"
        v-on="on || on1"
        :loading="loading"
        :x-small="mobile"
        :small="!mobile"
        :class="{'ma-2': margin}"
        :disabled="disabled"
      >{{label}}</v-btn>

      <v-btn
        v-if="icon"
        :text="isText"
        :color="color || 'red darken-5'"
        @click="event(object, $event)"
        v-on="on || on1"
        :loading="loading"
        :x-small="mobile"
        :small="!mobile"
        :disabled="disabled"
      >
        <v-icon>{{icon}}</v-icon>
      </v-btn>
    </template>
    <span style="max-width: 200px;
    word-wrap: break-word; display:block">{{message}}</span>
  </v-tooltip>
</template>

<script>
export default {
  props: {
    label: String,
    icon: String,
    color: String,
    message: String,
    event: Function,
    loading: Boolean,
    on1: String,
    object: Object,
    mobile: Boolean,
    isText: Boolean,
    bottom: Boolean,
    margin: Boolean,
    disabled: Boolean,
  }
};
</script>