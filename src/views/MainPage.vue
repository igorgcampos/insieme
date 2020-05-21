<template>
  <div>
    <MainToolBar></MainToolBar>
    <transition name="slide-x-transition">
      <router-view></router-view>
    </transition>
  </div>
</template>

<script>

import MainToolBar from '../components/MainToolBar';

export default {

  created: function () {
    this.user = this.$getUser()

  },
  components: {
    MainToolBar
  }
};
</script>
