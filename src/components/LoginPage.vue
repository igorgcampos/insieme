<template>
  <v-content>
    <v-container
      fluid
      fill-height
      class="grey lighten-5 pa-0"
    >
      <v-layout row>
        <v-flex
          xs12
          sm4
          class="d-none d-sm-flex"
        >
          <v-layout column>
            <v-img
              src="../assets/satelites.jpg"
              gradient="324deg, rgba(2,0,36,1) 0%, rgba(245,3,3,1) 0%, rgba(233,13,16,0.8547794117647058) 100%"
            >
              <div class="text-center ma-3 mt-12 pt-12">
                <div class="pa-12">
                  <v-img
                    src="../assets/telespazio-logo.png"
                    max-height="200"
                    max-width="300"
                    aspect-ratio="5.9"
                    class="mx-auto"
                  ></v-img>
                </div>
                <div class="display-1 text-xs-center font-weight-black mb-3 white--text">Bem Vindo ao Insieme!</div>
                <span class="subheading white--text">Gerencie seus contratos, circuitos, notas fiscais e muito mais!</span>
              </div>
            </v-img>

          </v-layout>
        </v-flex>

        <v-flex
          class="active"
          fill-height
        >
          <v-layout
            column
            align-center
            mt-12
            full-width
            pa-8
          >
            <v-flex
              xs12
              mb-3
              mt-10
            >
              <div class="login-wrapper text-xs-center">
                <div class="display-2 font-weight-black red--text text--darken-1">Insieme</div>
              </div>
            </v-flex>

            <v-flex
              xs24
              mb-4
            > <span class="grey--text text--lighten-1">Entre com seu usuário e senha</span>
            </v-flex>
            <v-flex>
              <v-text-field
                v-model.trim="username"
                label="Regular"
                full-width
                placeholder="Usuário"
                single-line
                solo
                autofocus
                prepend-inner-icon="mdi-account-outline"
              ></v-text-field>

              <v-text-field
                v-model.trim="password"
                label="Regular"
                full-width
                placeholder="Senha"
                single-line
                solo
                ref="password"
                :rules="[rules.min, rules.emailMatch]"
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
            >Entrar</v-btn>
          </v-layout>
        </v-flex>
      </v-layout>
    </v-container>
  </v-content>
</template>

<script>
export default {
  data () {
    return {
      username: '',
      image: '../assets/satelites.jpg',
      loading: false,
      show: false,
      password: '',
      success: true,
      rules: {
        min: v => v.length >= 6 || 'Mínimo de 6 caracteres',
        emailMatch: () => !!this.success || 'Usuário e/ou senha incorretos.',
      },
    }
  },
  methods: {
    login () {

      this.loading = true;
      this.$connectToKeycloak(this.username, this.password).then(response => {

        this.success = response
        if (this.success) {
          this.$parent.$emit('login-success')
        } else {
          this.$refs["password"].validate(true)
        }

        this.loading = false;
      }).catch(() => {
        this.loading = false;
      })
    }
  }
}
</script>