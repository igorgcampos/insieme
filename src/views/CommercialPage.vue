<template>
  <div class="mb-10">
    <v-row
      id="commercial"
      :class="{'ml-n12':$vuetify.breakpoint.mdAndUp}"
    >
      <span class="mb-7 text-right display-1 font-weight-bold grey--text text--darken-1">
        {{$vuetify.lang.t('$vuetify.COMERCIAL')}}</span>
      <v-col>
        <v-tooltip bottom>
          <template v-slot:activator="{ on }">
            <v-btn
              icon
              color="grey--text text--darken-1"
              class="ml-1 mt-n2"
              @click="expandPanel()"
            >
              <v-icon v-on="on">{{showPanel?'mdi-arrow-up-drop-circle-outline':
            'mdi-arrow-down-drop-circle-outline'}}</v-icon>
            </v-btn>
          </template>
          <span>{{showPanel?$vuetify.lang.t('$vuetify.ESCONDER'):$vuetify.lang.t('$vuetify.MOSTRAR')}}</span>
        </v-tooltip>
      </v-col>
    </v-row>

    <v-lazy
      :options="{
          threshold: .6
        }"
      transition="slide-x-transition"
    >
      <div
        class="ma-0 pa-0"
        v-show="showPanel"
      >
        <v-row
          id="filtro"
          class="pl-0 ml-0 grey lighten-5 mb-n5 mt-0"
        >
          <v-col :cols="$vuetify.breakpoint.xs?7:3">
            <v-row>
              <span class=" text-right subtitle-2 font-weight-bold grey--text text--lighten-1">
                {{$vuetify.lang.t('$vuetify.BUSCAR')}}:</span>
            </v-row>
            <v-row md="2">
              <v-text-field
                v-model.trim="searchText"
                dense
                label="Regular"
                :placeholder="$vuetify.lang.t('$vuetify.DESIGNACAO_CLIENTE_TPZ')"
                single-line
                solo
                max-width="200"
                append-icon="mdi-magnify"
                @click:append="search()"
                @keypress.enter="search()"
              ></v-text-field>
            </v-row>
          </v-col>

          <v-col
            v-if="$vuetify.breakpoint.xs"
            class="mt-5"
          >
            <v-menu
              transition="slide-x-transition"
              bottom
              right
            >
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  class="ml-2 mt-1"
                  dark
                  color="primary"
                  v-on="on"
                  v-bind="attrs"
                >
                  <v-icon dark>mdi-menu</v-icon>
                </v-btn>
              </template>

              <v-list>
                <v-list-item @click="showCommercialDialog('NOVO_CIRCUITO')">
                  <v-list-item-title>{{ $vuetify.lang.t('$vuetify.NOVO_CIRCUITO') }}</v-list-item-title>
                </v-list-item>
                <!-- <v-list-item @click="showCommercialDialog('UPGRADE')">
                  <v-list-item-title>{{ $vuetify.lang.t('$vuetify.UPGRADE') }}</v-list-item-title>
                </v-list-item> -->
                <v-list-item @click="showCommercialDialog('REMANEJAR')">
                  <v-list-item-title>{{ $vuetify.lang.t('$vuetify.REMANEJAR') }}</v-list-item-title>
                </v-list-item>
                <v-list-item @click="showCommercialDialog('ATIVAR')">
                  <v-list-item-title>{{ $vuetify.lang.t('$vuetify.ATIVAR') }}</v-list-item-title>
                </v-list-item>
                <v-list-item @click="showCommercialDialog('CANCELAR_DESATIVACAO')">
                  <v-list-item-title>{{ $vuetify.lang.t('$vuetify.CANCELAR_DESATIVACAO') }}</v-list-item-title>
                </v-list-item>
                <v-list-item @click="showCommercialDialog('DESATIVAR')">
                  <v-list-item-title>{{ $vuetify.lang.t('$vuetify.DESATIVAR') }}</v-list-item-title>
                </v-list-item>

                <!--
                <v-list-item @click="showCommercialDialog('DOWNGRADE')">
                  <v-list-item-title>{{ $vuetify.lang.t('$vuetify.DOWNGRADE') }}</v-list-item-title>
                </v-list-item> -->
              </v-list>
            </v-menu>

          </v-col>
        </v-row>

        <v-row v-if="!$vuetify.breakpoint.xs">

          <v-col cols="2 mr-4">

            <TooltipButton
              :label="$vuetify.lang.t('$vuetify.NOVO_CIRCUITO')"
              :message="$vuetify.lang.t('$vuetify.NOVO_CIRCUITO_DESCRICAO')"
              :event="showCommDialog"
              :object="{actionName:'NOVO_CIRCUITO'}"
              :mobile="$vuetify.breakpoint.xs"
            ></TooltipButton>
          </v-col>

          <!-- <v-col cols="2 mr-n7">

            <TooltipButton
              :label="$vuetify.lang.t('$vuetify.UPGRADE')"
              :message="$vuetify.lang.t('$vuetify.UPGRADE_DESCRICAO')"
              :event="showCommDialog"
              :object="{actionName:'UPGRADE'}"
              :mobile="$vuetify.breakpoint.xs"
            ></TooltipButton>
          </v-col> -->

          <v-col cols="2 mr-n2">

            <TooltipButton
              :label="$vuetify.lang.t('$vuetify.REMANEJAR')"
              :message="$vuetify.lang.t('$vuetify.REMANEJAR_DESCRICAO')"
              :event="showCommDialog"
              :object="{actionName:'REMANEJAR'}"
              :mobile="$vuetify.breakpoint.xs"
            ></TooltipButton>
          </v-col>

          <v-col cols="2 mr-n10">

            <TooltipButton
              :label="$vuetify.lang.t('$vuetify.ATIVAR')"
              :message="$vuetify.lang.t('$vuetify.ATIVAR_DESCRICAO')"
              :event="showCommDialog"
              :object="{actionName:'ATIVAR'}"
              :mobile="$vuetify.breakpoint.xs"
            ></TooltipButton>
          </v-col>

          <v-col cols="2">

            <TooltipButton
              :label="$vuetify.lang.t('$vuetify.CANCELAR_DESATIVACAO')"
              :message="$vuetify.lang.t('$vuetify.CANCELAR_DESATIVACAO_DESCRICAO')"
              :event="showCommDialog"
              :object="{actionName:'CANCELAR_DESATIVACAO'}"
              :mobile="$vuetify.breakpoint.xs"
            ></TooltipButton>
          </v-col>

          <v-col cols="2 ml-12 pl-11">

            <TooltipButton
              :label="$vuetify.lang.t('$vuetify.DESATIVAR')"
              :message="$vuetify.lang.t('$vuetify.DESATIVAR_DESCRICAO')"
              :event="showCommDialog"
              :object="{actionName:'DESATIVAR'}"
              :mobile=true
            ></TooltipButton>
          </v-col>

          <!-- <v-col cols="2 ml-n4">

            <TooltipButton
              :label="$vuetify.lang.t('$vuetify.DOWNGRADE')"
              :message="$vuetify.lang.t('$vuetify.DOWNGRADE_DESCRICAO')"
              :event="showCommDialog"
              :object="{actionName:'DOWNGRADE'}"
              :mobile="$vuetify.breakpoint.xs"
            ></TooltipButton>
          </v-col>-->
        </v-row>

        <v-row
          class="pl-2 mt-2"
          style="min-height:120px;"
        >
          <div
            id="commercialId"
            class="pr-2 overflow-y-auto overflow-x-hidden"
            v-scroll:#commercialId="searchMore"
            style="max-height:340px; width:100%;"
          >
            <v-expansion-panels class="ma-1">
              <v-expansion-panel
                v-for="(circuit, i) in circuits"
                :key="i"
                hide-actions
                readonly
              >
                <v-expansion-panel-header
                  v-slot="{ open }"
                  class="pt-0 pb-0"
                  expand-icon=""
                >
                  <v-row
                    align="center"
                    no-gutters
                  >

                    <v-col
                      :cols="!$vuetify.breakpoint.xs?1:2"
                      class="ma-0 pa-0"
                    >
                      <v-checkbox
                        class="ma-0 pa-0 mt-4 mb-n1"
                        v-model="selectedCheckList"
                        color="primary"
                        dense
                        :value="circuit"
                      ></v-checkbox>
                    </v-col>

                    <v-col
                      :cols="!$vuetify.breakpoint.xs?5:4"
                      sm="2"
                    >
                      <v-chip
                        :color="circuit.online==3?'success':'error'"
                        class="ml-0 mr-2"
                        label
                        small
                        outlined
                      >
                        {{ circuit.online==3?'Online':'Offline' }}
                      </v-chip>
                    </v-col>

                    <v-col
                      v-show="!$vuetify.breakpoint.xs"
                      sm="5"
                      md="6"
                      :class="{'col-sm-10':open, 'col-md-10':open}"
                    >
                      <strong class="font-weight-bold grey--text text--lighten-1 mr-2">
                        {{$vuetify.lang.t('$vuetify.DESIGNACAO_CLIENTE')}}:</strong>
                      <strong
                        class="subtitle-2 font-weight-bold"
                        v-html="circuit.designacaoCliente"
                      ></strong>
                    </v-col>

                    <v-col
                      v-show="!$vuetify.breakpoint.xs"
                      sm="4"
                      md="3"
                    >
                      <strong class="font-weight-bold grey--text text--lighten-1 mr-2">
                        IP:</strong>
                      <strong
                        class="font-weight-bold"
                        v-html="circuit.ip || '--'"
                      ></strong>
                    </v-col>

                    <v-col
                      v-show="$vuetify.breakpoint.xs"
                      class="ml-3 mt-2 mb-2"
                    >
                      <v-row
                        sm="5"
                        md="6"
                        :class="{'ml-n3':open}"
                      >
                        <strong class="caption font-weight-bold grey--text text--lighten-1 mr-2">
                          {{$vuetify.lang.t('$vuetify.DESIGNACAO_CLIENTE')}}:</strong>
                        <strong
                          class="caption font-weight-bold"
                          v-html="circuit.designacaoCliente.toLowerCase()"
                        ></strong>
                      </v-row>

                      <v-row
                        sm="5"
                        md="3"
                        v-if="!open"
                      >
                        <strong class="caption font-weight-bold grey--text text--lighten-1 mr-2">
                          IP:</strong>
                        <strong
                          class="caption font-weight-bold"
                          v-html="circuit.ip || '--'"
                        ></strong>
                      </v-row>
                    </v-col>

                  </v-row>
                </v-expansion-panel-header>
              </v-expansion-panel>
            </v-expansion-panels>
          </div>
          <v-col v-if="circuits.length == 0 && !isLoading">
            <EmptyPanel :message="$vuetify.lang.t('$vuetify.NENHUM_CIRCUITO')"> </EmptyPanel>
          </v-col>
        </v-row>

      </div>
    </v-lazy>

    <CommercialDialog
      :showDialog="showDialog"
      :showSuccess="showSuccess"
      :showDialogLoading="showDialogLoading"
      :close="closeDialog"
      :send="sendIssue"
      :itemList="selectedCheckList"
      :title="title"
      :subtitle="subtitle"
      :actionName="actionName"
    >
    </CommercialDialog>
  </div>
</template>

<script>

import EmptyPanel from '../components/EmptyPanel';
import TooltipButton from '../components/TooltipButton';
import CommercialDialog from '../components/dialogs/CommercialDialog';

export default {
  components: {
    EmptyPanel,
    TooltipButton,
    CommercialDialog
  },
  methods: {
    showCommercialDialog (actionName) {

      this.showDialog = true;
      this.actionName = actionName;

      if (actionName == 'NOVO_CIRCUITO') {
        this.title = this.$vuetify.lang.t('$vuetify.NOVO_CIRCUITO')
        this.subtitle = this.$vuetify.lang.t('$vuetify.NOVO_CIRCUITO_DESCRICAO')

      } else if (actionName == 'ATIVAR') {
        this.title = this.$vuetify.lang.t('$vuetify.ATIVAR')
        this.subtitle = this.$vuetify.lang.t('$vuetify.ATIVAR_DESCRICAO')

      } else if (actionName == 'DESATIVAR') {
        this.title = this.$vuetify.lang.t('$vuetify.DESATIVAR')
        this.subtitle = this.$vuetify.lang.t('$vuetify.DESATIVAR_DESCRICAO')

      } else if (actionName == 'REMANEJAR') {
        this.title = this.$vuetify.lang.t('$vuetify.REMANEJAR')
        this.subtitle = this.$vuetify.lang.t('$vuetify.REMANEJAR_DESCRICAO')

      } else if (actionName == 'CANCELAR_DESATIVACAO') {
        this.title = this.$vuetify.lang.t('$vuetify.CANCELAR_DESATIVACAO')
        this.subtitle = this.$vuetify.lang.t('$vuetify.CANCELAR_DESATIVACAO_DESCRICAO')

      } else if (actionName == 'UPGRADE') {
        this.title = this.$vuetify.lang.t('$vuetify.UPGRADE')
        this.subtitle = this.$vuetify.lang.t('$vuetify.UPGRADE_DESCRICAO')

      } else if (actionName == 'DOWNGRADE') {
        this.title = this.$vuetify.lang.t('$vuetify.DOWNGRADE')
        this.subtitle = this.$vuetify.lang.t('$vuetify.DOWNGRADE_DESCRICAO')
      }
    },
    showCommDialog (entity) {
      this.showCommercialDialog(entity.actionName)
    },
    closeDialog () {
      this.showDialog = false;
      this.showDialogLoading = false;

      setTimeout(() => {
        this.showSuccess = false;
      }, 1000);
    },
    sendIssue (issue, entity, itemList) {

      this.showDialogLoading = true;

      issue = {
        origem: 'CIRCUITO_LOTE_COMERCIAL',
        identificadorOrigem: null,
        motivoAbertura: this.$vuetify.lang.t('$vuetify.' + this.actionName),
        observacaoAbertura: issue.observation,
        contrato: { id: this.$props.contract.id },
        lote: itemList.map(function (item) {
          return item.nome
        }),
      }
      this.$post('/chamado/create', issue).then((response) => {

        if (response.data) {

          this.showSuccess = true;
          this.showDialogLoading = false;
          this.$root.$emit('new-issue', response.data)
          entity.protocolo = response.data.protocolo
        }
      });
    },
    searchMore () {

      if (this.isLoding || this.noResult) {
        return;
      }

      if (document.getElementById('commercialId').scrollTop + 341 >=
        document.getElementById('commercialId').scrollHeight) {
        this.page++;
        this.search(this.page);
      }
    },
    search (page) {

      this.isLoading = true;

      if (!page) {
        this.page = 0;
        this.noResult = false;
        this.selectedCheckList = []
      }

      this.$get('/circuito/busca', {
        contractNumber: this.$props.contract.numeroContratoTpz,
        searchText: this.searchText, onlineStatus: 0,
        installStatus: 0, productType: 0, page: this.page
      }).then((response) => {

        if (response && response.data.length == 0) {
          this.noResult = true;
        }

        if (!page) {
          this.circuits = []
        }

        this.circuits = this.circuits.concat(response.data);
        this.isLoading = false;
      });

    },
    expandPanel () {
      this.showPanel = !this.showPanel;
    }
  },
  props: {
    contract: Object
  },
  data: () => ({
    actionName: '',
    title: '',
    subtitle: '',
    circuits: [],
    entity: undefined,
    selectedCheckList: [],
    showPanel: true,
    showDialogLoading: false,
    showDialog: false,
    showSuccess: false,
    page: 0,
    isLoading: true,
    noResult: false,
    searchText: '',
  }),
  created: function () {

    this.$get('/circuito/busca', {
      contractNumber: this.$props.contract.numeroContratoTpz,
      searchText: '',
      onlineStatus: 0,
      installStatus: 0,
      productType: 0,
      page: 0
    })
      .then((response) => {
        this.circuits = response.data;
        this.isLoading = false;
        window.scrollTo(0, 0);
      });
  }
};
</script>
