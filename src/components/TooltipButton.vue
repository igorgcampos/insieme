<template>
  <v-tooltip
    :top="!bottom"
    :bottom="bottom"
  >
    <template v-slot:activator="{ on }">
      <v-btn
        v-if="label && !icon"
        :text="isText"
        color="primary"
        @click="event(object, $event)"
        v-on="on"
        :loading="loading"
        :x-small="mobile"
        :small="!mobile"
        :class="{'ma-2': margin, 'mr-3': marginRight}"
        :disabled="disabled"
      >{{label}}</v-btn>

      <v-btn
        v-if="icon"
        :text="isText"
        :color="color || 'primary'"
        @click="event(object, $event)"
        v-on="on"
        :loading="loading"
        :x-small="mobile"
        :small="!mobile"
        :disabled="disabled"
        :class="{'mr-3': marginRight}"
      >
        <v-icon class="mr-2">{{icon}}</v-icon>
        {{label?label:''}}
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
    marginRight: Boolean,
  }
};
</script>