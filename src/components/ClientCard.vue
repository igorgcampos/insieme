<template>
  <v-lazy
    :options="{
          threshold: .6
        }"
    transition="slide-x-transition"
  >
    <v-card
      class="mx-auto"
      max-width="466"
      min-width="300"
    >

      <v-card-title
        class="subtitle-2 grey--text text--darken-3"
        style=" word-break: normal; !important"
      >{{client.nome}}</v-card-title>

      <v-card-subtitle class="caption">CNPJ: {{client.cnpj}}</v-card-subtitle>

      <v-layout
        column
        align-center
      >
        <v-row :class="{'mb-3':true, 'mt-3':client.clientePai && !client.clientePai.clientePai}">
          <v-chip
            label
            class="caption"
            :color="(client.clientePai && client.clientePai.clientePai)?'warning':client.clientePai? 'primary': 'success'"
            :text-color="(client.clientePai && client.clientePai.clientePai)?'warning':client.clientePai? 'primary': 'success'"
            small
            outlined
          >
            {{(client.clientePai && client.clientePai.clientePai)?$vuetify.lang.t('$vuetify.FINAL'):
            client.clientePai?$vuetify.lang.t('$vuetify.ASSOCIADO'):$vuetify.lang.t('$vuetify.PRINCIPAL')}}
          </v-chip>

          <v-layout
            column
            align-center
          >
            <v-tooltip
              top
              v-model="noFather"
              color="error"
              v-if="client.clientePai"
            >
              <template v-slot:activator="{ on1 }">
                <v-tooltip top>
                  <template v-slot:activator="{ on }">
                    <v-btn
                      x-small
                      :color="(client.clientePai && client.clientePai.clientePai)?'primary':'success'"
                      :class="{'ml-4':true, 'text-white':true, 'mt-n3':client.clientePai && !client.clientePai.clientePai}"
                      v-on="on || on1"
                      @click="findFatherClient()"
                    >{{(client.clientePai && client.clientePai.clientePai)?
                    $vuetify.lang.t('$vuetify.CLIENTE_ASSOCIADO'):$vuetify.lang.t('$vuetify.CLIENTE_PRINCIPAL')}}</v-btn>
                  </template>
                  <span>{{(client.clientePai && client.clientePai.clientePai)?
                    $vuetify.lang.t('$vuetify.BUSCAR_CLIENTE_ASSOCIADO'):$vuetify.lang.t('$vuetify.BUSCAR_CLIENTE_PRINCIPAL')}}
                  </span>
                </v-tooltip>
              </template>
              <span>{{$vuetify.lang.t('$vuetify.NENHUM_CLIENTE')}}</span>
            </v-tooltip>

            <v-tooltip
              top
              v-model="noAssociates"
              color="error"
              v-if="!client.clientePai || (client.clientePai && !client.clientePai.clientePai)"
            >
              <template v-slot:activator="{ on1 }">
                <v-tooltip top>
                  <template v-slot:activator="{ on }">
                    <v-btn
                      x-small
                      :color="client.clientePai? 'warning': 'primary'"
                      :class="{'ml-4':true, 'text-white':true, 'mt-2':client.clientePai && !client.clientePai.clientePai}"
                      v-on="on || on1"
                      @click="findClientSons()"
                    >{{client.clientePai?$vuetify.lang.t('$vuetify.CLIENTES_FINAIS'):
                    $vuetify.lang.t('$vuetify.CLIENTES_ASSOCIADOS')}}</v-btn>
                  </template>

                  <span>{{client.clientePai?$vuetify.lang.t('$vuetify.BUSCAR_CLIENTES_FINAIS'):
                    $vuetify.lang.t('$vuetify.BUSCAR_CLIENTES_ASSOCIADOS')}}</span>
                </v-tooltip>
              </template>
              <span>{{$vuetify.lang.t('$vuetify.NENHUM_CLIENTE')}}</span>
            </v-tooltip>

          </v-layout>
        </v-row>

        <div class="mr-2">
          <v-row>
            <LabelValue
              :label="$vuetify.lang.t('$vuetify.CODIGO_SAP')"
              :value="client.codClienteSap"
              justify="center"
            ></LabelValue>

            <LabelValue
              :label="$vuetify.lang.t('$vuetify.LOCALIZACAO')"
              :value="client.municipio+', '+client.estado"
              justify="center"
            ></LabelValue>
          </v-row>

          <v-row class="mt-n1">
            <LabelValue
              :label="$vuetify.lang.t('$vuetify.ENDERECO')"
              :value="client.endereco"
              justify="center"
              truncate
            ></LabelValue>

            <LabelValue
              :label="$vuetify.lang.t('$vuetify.PAIS')"
              :value="client.pais"
              justify="center"
            ></LabelValue>
          </v-row>
        </div>
      </v-layout>

      <v-divider class="mt-2"></v-divider>

      <v-card-actions>
        <v-tooltip top>
          <template v-slot:activator="{ on }">
            <v-btn
              text
              color="primary"
              @click="listarContratos()"
              v-on="on"
            >{{$vuetify.lang.t('$vuetify.CONTRATOS')}}</v-btn>
          </template>
          <span>{{$vuetify.lang.t('$vuetify.VER_CONTRATOS')}}</span>
        </v-tooltip>
      </v-card-actions>
    </v-card>
  </v-lazy>
</template>

<script>

import LabelValue from '../components/LabelValue';
export default {

  data: () => ({
    noAssociates: undefined,
    noFather: undefined
  }),
  components: {
    LabelValue
  },
  methods: {
    listarContratos () {
      this.$root.$emit('client-selected', this.client)
    },
    findClientSons () {

      this.$get('/cliente/filhos', { id: this.client.id }).then(response => {
        if (response.data.length == 0) {
          this.noAssociates = true;
          setTimeout(() => { this.noAssociates = undefined }, 2000)
        }
        else {
          this.$root.$emit('search-clients', response.data)
          this.noAssociates = undefined;
        }
      })
    },
    findFatherClient () {
      this.$get('/cliente', { id: this.client.clientePai.id }).then(response => {
        if (response.data.length == 0) {
          this.noFather = true;
          setTimeout(() => { this.noFather = undefined }, 2000)
        }
        else {
          this.$root.$emit('search-clients', response.data)
          this.noFather = undefined;
        }
      })
    }
  },
  props: {
    client: Object
  }
};
</script>
