<template>
  <v-content>
    <v-container fluid fill-height class="grey lighten-5 pa-0">
      <v-layout row>
        <v-flex xs12 sm4 class="d-none d-sm-flex">
          <v-layout column>
            <v-img
              src="../assets/satelites.jpg"
              gradient="324deg, rgba(2,0,36,1) 0%, rgba(245,3,3,1) 0%, rgba(233,13,16,0.8547794117647058) 85%"
            >
              <div class="horizontal-center">
                <div class="text-center vertical-center ml-3 mr-3 mt-8">
                  <div class="pa-12">
                    <v-img
                      src="../assets/telespazio-logo.png"
                      max-height="200"
                      max-width="300"
                      aspect-ratio="5.9"
                      class="mx-auto"
                    ></v-img>
                  </div>
                  <div
                    class="
                      display-1
                      text-xs-center
                      font-weight-black
                      mb-3
                      white--text
                    "
                  >
                    {{ $vuetify.lang.t("$vuetify.BEM_VINDO") }}
                  </div>
                  <span class="subheading white--text">{{
                    $vuetify.lang.t("$vuetify.MENSAGEM_INICIAL")
                  }}</span>
                  <div style="margin-top: 45%">
                    <v-btn
                      outlined
                      color="white"
                      small
                      @click="openVersionDialog = true"
                    >
                      {{ $vuetify.lang.t("$vuetify.VERSAO") + $getVersion() }}
                    </v-btn>
                  </div>
                </div>
              </div>
            </v-img>
          </v-layout>
        </v-flex>

        <v-flex class="active horizontal-center" fill-height>
          <v-layout column align-center full-width class="vertical-center">
            <v-flex xs12 mb-3>
              <div class="login-wrapper text-xs-center">
                <div
                  class="display-2 font-weight-black red--text text--darken-1"
                >
                  Insieme
                </div>
              </div>
            </v-flex>

            <v-flex xs24 mb-4>
              <span class="grey--text text--lighten-1">{{
                $vuetify.lang.t("$vuetify.MENSAGEM_LOGIN")
              }}</span>
            </v-flex>
            <v-flex>
              <v-text-field
                v-model.trim="username"
                label="Regular"
                full-width
                :placeholder="$vuetify.lang.t('$vuetify.USUARIO')"
                single-line
                solo
                autofocus
                prepend-inner-icon="mdi-account-outline"
              ></v-text-field>

              <v-text-field
                v-model.trim="password"
                label="Regular"
                full-width
                :placeholder="$vuetify.lang.t('$vuetify.SENHA')"
                single-line
                solo
                ref="password"
                :rules="
                  success
                    ? [rules.emailMatch, rules.noProfile]
                    : [rules.emailMatch]
                "
                :append-icon="show ? 'mdi-eye' : 'mdi-eye-off'"
                prepend-inner-icon="mdi-lock"
                :type="show ? 'text' : 'password'"
                @click:append="show = !show"
                @keydown.enter="login()"
              ></v-text-field>
            </v-flex>
            <v-btn
              large
              dark
              ripple
              full-width
              color="red darken-4"
              id="sign-up"
              :loading="loading"
              @click="login()"
              >{{ $vuetify.lang.t("$vuetify.ENTRAR") }}</v-btn
            >

            <v-row class="ma-3">
              <v-chip
                @click="selectIdiom('brasil')"
                class="ma-2"
                label
                :outlined="brazilUnselected"
              >
                <v-avatar left>
                  <v-img src="../assets/brasil-flag.svg"></v-img>
                </v-avatar>
                Português
              </v-chip>

              <v-chip
                @click="selectIdiom('usa')"
                class="ma-2"
                label
                :outlined="usaUnselected"
              >
                <v-avatar left>
                  <v-img src="../assets/usa-flag.svg"></v-img>
                </v-avatar>
                English
              </v-chip>
            </v-row>
          </v-layout>
        </v-flex>
      </v-layout>
    </v-container>

    <VersionsDialog
      :close="closeVersionsDialog"
      :show="openVersionDialog"
    ></VersionsDialog>
  </v-content>
</template>

<script>
import VersionsDialog from "../components/dialogs/VersionsDialog";

export default {
  components: {
    VersionsDialog,
  },
  created: function () {
    if (this.$vuetify.lang.current == "pt") {
      this.brazilUnselected = false;
      this.usaUnselected = true;
    } else {
      this.brazilUnselected = true;
      this.usaUnselected = false;
    }
  },
  data() {
    return {
      openVersionDialog: false,
      brazilUnselected: false,
      usaUnselected: true,
      username: "",
      image: "../assets/satelites.jpg",
      loading: false,
      show: false,
      password: "",
      success: undefined,
      rules: {
        emailMatch: () =>
          this.success ||
          this.success == undefined ||
          this.$vuetify.lang.t("$vuetify.SENHA_INCORRETA"),
        noProfile: () =>
          this.$getUser().then((user) => {
            return user.perfis.length > 0;
          }) || this.$vuetify.lang.t("$vuetify.SEM_PERMISSAO"),
      },
    };
  },
  methods: {
    closeVersionsDialog() {
      this.openVersionDialog = false;
    },
    selectIdiom(country) {
      if (country == "brasil") {
        this.brazilUnselected = false;
        this.usaUnselected = true;
        this.$vuetify.lang.current = "pt";
      } else if (country == "usa") {
        this.brazilUnselected = true;
        this.usaUnselected = false;
        this.$vuetify.lang.current = "en";
      }

      this.$refs["password"].validate(false);
    },
    login() {
      this.loading = true;
      this.$login(this.username, this.password).then((response) => {
        this.$getUser().then((user) => {
          this.success = response;
          if (this.success && user.perfis.length > 0) {
            this.$root.$emit("login-success");
          } else {
            this.$refs["password"].validate(true);
          }

          this.loading = false;

          this.$saveOperation({ tipo: "LOGIN", usuario: user });
        });
      });
    },
  },
};
</script>
<style scoped>
.vertical-center {
  margin: 0;
  position: absolute;
  top: 50%;
  -ms-transform: translateY(-50%);
  transform: translateY(-50%);
}

.horizontal-center {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>