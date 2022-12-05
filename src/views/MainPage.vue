<template>
  <div>
    <MainToolBar></MainToolBar>
    <v-content>
      <v-container v-scroll="setTop" fluid fill-height>
        <router-view></router-view>
      </v-container>
    </v-content>
  </div>
</template>

<script>
import MainToolBar from "../components/MainToolBar";

export default {
  components: {
    MainToolBar,
  },
  created: function () {
    this.$getUser().then((user) => {
      this.user = user;

      if (
        !window.sessionStorage.getItem("page") ||
        window.sessionStorage.getItem("actualPage") == "contracts" ||
        window.sessionStorage.getItem("actualPage") == "/"
      ) {
        if (!this.user.cliente) {
          this.user.cliente = { id: -1 };
        }
        this.$router.push({
          name: "Contracts",
          params: {
            client: { id: this.user.cliente.id },
            contract: this.user.contrato,
          },
        });
      } else if (
        window.sessionStorage.getItem("actualPage") == "administracao"
      ) {
        this.$router.push({ name: "Administration" });
      } else {
        this.$router.push({
          name: "Dashboard",
          params: { contract: undefined },
        });
      }

      this.$root.$on("contract-selected", (contract) => {
        window.sessionStorage.setItem("actualPage", "dashboard");
        this.$router.push({
          name: "Dashboard",
          params: { contract: contract },
        });
      });
    });
  },
  methods: {
    setTop() {
      this.$root.$emit("setTop");
    },
  },
};
</script>
