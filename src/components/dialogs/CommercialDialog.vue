<template>

  <v-dialog
    v-model="showDialog"
    persistent
    :max-width="(entityList.length == 0 && actionName != 'NOVO_CIRCUITO') || showSuccess?400: 700"
    class="overflow-y-hidden"
  >
    <v-card>
      <v-card-title
        v-if="canShowForm()"
        class="headline-6"
        :class="{'subtitle-2':$vuetify.breakpoint.xs}"
        style="word-break: normal; !important"
      >
        {{title}}
      </v-card-title>
      <v-card-text
        v-if="canShowForm()"
        class="headline-6 mt-n3"
      >{{subtitle}}</v-card-text>

      <v-card-text
        v-if="canShowForm() && this.actionName != 'NOVO_CIRCUITO' && editable"
        class="caption mt-n3 font-weight-bold grey--text"
      >{{'Circuitos selecionados: '+entityList.length}}</v-card-text>

      <v-row
        class="ma-0 d-flex justify-center mb-12 ml-3 mr-3 overflow-y-auto overflow-x-hidden"
        style="max-height:20rem"
      >

        <WarningPanel
          class="mt-8 pt-10"
          :message="$vuetify.lang.t('$vuetify.NENHUM_CIRCUITO_SELECIONADO')"
          v-show="!showSuccess && entityList.length == 0 && actionName != 'NOVO_CIRCUITO'"
        >
        </WarningPanel>

        <SuccessPanel
          v-show="showSuccess"
          :title="$vuetify.lang.t('$vuetify.PEDIDO_ENVIADO')"
          :subtitle="$vuetify.lang.t('$vuetify.PROTOCOLO')+': '+entity.protocolo"
          class="mt-5 overflow-y-hidden"
        >
        </SuccessPanel>

        <v-row v-if="actionName=='NOVO_CIRCUITO' && editable && !showSuccess">
          <v-btn
            color="primary"
            dark
            class="mb-2 ml-7"
            x-small
            @click="newLine()"
          >Nova linha</v-btn>
        </v-row>

        <CommercialTable
          v-if="canShowForm()"
          :actionName="actionName"
          :entityList="entityList"
          :headers="headers"
          :deleteItem="deleteItem"
          :editable="editable"
        ></CommercialTable>

      </v-row>

      <v-divider class="mt-n12"></v-divider>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          color="primary"
          text
          @click="close(); cleanFields()"
          :x-small="$vuetify.breakpoint.xs"
        >{{!showSuccess && editable?$vuetify.lang.t('$vuetify.CANCELAR'):$vuetify.lang.t('$vuetify.FECHAR')}}</v-btn>

        <v-btn
          color="primary"
          text
          @click="send(issue, entity, entityList);"
          :x-small="$vuetify.breakpoint.xs"
          :loading="showDialogLoading"
          v-show="canShowForm() && editable"
        >{{$vuetify.lang.t('$vuetify.ENVIAR')}}</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

</template>

<script>

import WarningPanel from '../../components/panels/WarningPanel';
import SuccessPanel from '../../components/panels/SuccessPanel';
import CommercialTable from '../../components/CommercialTable';

export default {
  components: {
    WarningPanel,
    SuccessPanel,
    CommercialTable,
  },
  props: {
    title: String,
    subtitle: String,
    actionName: String,
    showDialog: Boolean,
    showSuccess: Boolean,
    showDialogLoading: Boolean,
    editable: Boolean,
    close: Function,
    send: Function,
    itemList: Array
  },
  methods: {
    newLine () {
      this.entityList.push({});
    },
    deleteItem (item) {
      this.entityList.splice(this.entityList.indexOf(item), 1)
    },
    canShowForm () {
      return (this.entityList.length > 0 ||
        this.actionName == 'NOVO_CIRCUITO') && !this.showSuccess
    },
    cleanFields () {
      this.issue.observation = '';
      this.issue.reason = undefined;
    }
  },
  data: () => ({
    issue: { reason: undefined, observation: '' },
    entity: {},
    entityList: [],
    headers: []
  }),
  watch: {
    itemList: function () {
      this.entityList = this.itemList.map((x) => x)
    }
  },
  beforeUpdate: function () {

    this.headers = [
      { text: '', align: 'start', value: 'actions', sortable: false }
    ];

    if (this.actionName == 'ALTERAR_VELOCIDADE' || this.actionName == 'SUSPENDER' ||
      this.actionName == 'DESATIVAR' || this.actionName == 'REMANEJAR' ||
      this.actionName == 'ATIVAR' || this.actionName == 'CANCELAR_DESATIVACAO')
      this.headers.push({
        text: this.$vuetify.lang.t('$vuetify.DESIGNACAO_TPZ'), align: 'start', sortable: false, value: 'nome', width: 200
      })

    if (this.actionName == 'SUSPENDER' || this.actionName == 'NOVO_CIRCUITO' ||
      this.actionName == 'DESATIVAR' || this.actionName == 'ATIVAR' ||
      this.actionName == 'CANCELAR_DESATIVACAO')
      this.headers.push({ text: this.$vuetify.lang.t('$vuetify.DESIGNACAO_CLIENTE'), value: 'designacaoCliente', sortable: false, width: 200 })

    if (this.actionName == 'ALTERAR_VELOCIDADE') {
      this.headers.push({ text: this.$vuetify.lang.t('$vuetify.VELOCIDADE_ATUAL'), value: 'velocidade_atual', sortable: false, width: 200 })
      this.headers.push({ text: this.$vuetify.lang.t('$vuetify.VELOCIDADE_SOLICITADA'), value: 'velocidade_solicitada', sortable: false, width: 200 })
      this.headers.push({ text: this.$vuetify.lang.t('$vuetify.CONTATO_INSTALACAO'), value: 'contato_instalacao', sortable: false, width: 200 })
      this.headers.push({ text: this.$vuetify.lang.t('$vuetify.TELEFONE_INSTALACAO'), value: 'telefone_instalacao', sortable: false, width: 200 })
      this.headers.push({ text: this.$vuetify.lang.t('$vuetify.ENDERECO_GERENCIA'), value: 'endereco_gerencia', sortable: false, width: 200 })
      this.headers.push({ text: 'VLAN', value: 'vlan', sortable: false, width: 200 })
      this.headers.push({ text: this.$vuetify.lang.t('$vuetify.INTERCONEXAO_TPZ'), value: 'interconexao_tpz', sortable: false, width: 200 })
      this.headers.push({ text: 'WAN CPE REDE', value: 'wan_rede', sortable: false, width: 200 })
      this.headers.push({ text: this.$vuetify.lang.t('$vuetify.ENDERECO_LAN'), value: 'endereco_lan', sortable: false, width: 200 })
      this.headers.push({ text: 'WAN CPE HOST', value: 'wan_host', sortable: false, width: 200 })
      this.headers.push({ text: 'Loopback CPE', value: 'loopback', sortable: false, width: 200 })
      this.headers.push({ text: this.$vuetify.lang.t('$vuetify.ROTAS_SUMARIZADAS'), value: 'rotas_sumarizadas', sortable: false, width: 200 })
    }

    if (this.actionName == 'NOVO_CIRCUITO') {

      this.headers.push({ text: this.$vuetify.lang.t('$vuetify.RAZAO_SOCIAL'), value: 'razaoSocial', sortable: false, width: 200 })
      this.headers.push({ text: this.$vuetify.lang.t('$vuetify.NOME_FANTASIA'), value: 'nomeFantasia', sortable: false, width: 200 })
      this.headers.push({ text: 'CNPJ', value: 'cnpj', sortable: false, width: 200 })
      this.headers.push({ text: this.$vuetify.lang.t('$vuetify.INSCRICAO_ESTADUAL'), value: 'inscricaoEstadual', sortable: false, width: 200 })
      this.headers.push({ text: this.$vuetify.lang.t('$vuetify.ENDERECO_FISCAL'), value: 'endereco_fiscal', sortable: false, width: 200 })
      this.headers.push({ text: this.$vuetify.lang.t('$vuetify.BAIRRO_FISCAL'), value: 'bairro_fiscal', sortable: false, width: 200 })
      this.headers.push({ text: this.$vuetify.lang.t('$vuetify.CIDADE_FISCAL'), value: 'cidade_fiscal', sortable: false, width: 200 })
      this.headers.push({ text: this.$vuetify.lang.t('$vuetify.UF_FISCAL'), value: 'uf_fiscal', sortable: false, width: 200 })
      this.headers.push({ text: this.$vuetify.lang.t('$vuetify.CEP_FISCAL'), value: 'cep_fiscal', sortable: false, width: 200 })

      this.headers.push({ text: this.$vuetify.lang.t('$vuetify.ENDERECO_REMESSA'), value: 'endereco_remessa', sortable: false, width: 200 })
      this.headers.push({ text: this.$vuetify.lang.t('$vuetify.BAIRRO_REMESSA'), value: 'bairro_remessa', sortable: false, width: 200 })
      this.headers.push({ text: this.$vuetify.lang.t('$vuetify.CIDADE_REMESSA'), value: 'cidade_remessa', sortable: false, width: 200 })
      this.headers.push({ text: this.$vuetify.lang.t('$vuetify.UF_REMESSA'), value: 'uf_remessa', sortable: false, width: 200 })
      this.headers.push({ text: this.$vuetify.lang.t('$vuetify.CEP_REMESSA'), value: 'cep_remessa', sortable: false, width: 200 })
      this.headers.push({ text: this.$vuetify.lang.t('$vuetify.CONTATO_REMESSA'), value: 'contato_remessa', sortable: false, width: 200 })
      this.headers.push({ text: this.$vuetify.lang.t('$vuetify.TELEFONE_REMESSA'), value: 'telefone_remessa', sortable: false, width: 200 })

      this.headers.push({ text: this.$vuetify.lang.t('$vuetify.ENDERECO_INSTALACAO'), value: 'endereco_instalacao', sortable: false, width: 200 })
      this.headers.push({ text: this.$vuetify.lang.t('$vuetify.BAIRRO_INSTALACAO'), value: 'bairro_instalacao', sortable: false, width: 200 })
      this.headers.push({ text: this.$vuetify.lang.t('$vuetify.CIDADE_INSTALACAO'), value: 'cidade_instalacao', sortable: false, width: 200 })
      this.headers.push({ text: this.$vuetify.lang.t('$vuetify.UF_INSTALACAO'), value: 'uf_instalacao', sortable: false, width: 200 })
      this.headers.push({ text: this.$vuetify.lang.t('$vuetify.CEP_INSTALACAO'), value: 'cep_instalacao', sortable: false, width: 200 })
      this.headers.push({ text: this.$vuetify.lang.t('$vuetify.CONTATO_INSTALACAO'), value: 'contato_instalacao', sortable: false, width: 200 })
      this.headers.push({ text: this.$vuetify.lang.t('$vuetify.TELEFONE_INSTALACAO'), value: 'telefone_instalacao', sortable: false, width: 200 })

      this.headers.push({ text: this.$vuetify.lang.t('$vuetify.ENDERECO_GERENCIA'), value: 'endereco_gerencia', sortable: false, width: 200 })
      this.headers.push({ text: 'VLAN', value: 'vlan', sortable: false, width: 200 })
      this.headers.push({ text: this.$vuetify.lang.t('$vuetify.INTERCONEXAO_TPZ'), value: 'interconexao_tpz', sortable: false, width: 200 })
      this.headers.push({ text: 'WAN CPE REDE', value: 'wan_rede', sortable: false, width: 200 })
      this.headers.push({ text: this.$vuetify.lang.t('$vuetify.ENDERECO_LAN'), value: 'endereco_lan', sortable: false, width: 200 })
      this.headers.push({ text: 'WAN CPE HOST', value: 'wan_host', sortable: false, width: 200 })
      this.headers.push({ text: 'Loopback CPE', value: 'loopback', sortable: false, width: 200 })
      this.headers.push({ text: this.$vuetify.lang.t('$vuetify.ROTAS_SUMARIZADAS'), value: 'rotas_sumarizadas', sortable: false, width: 200 })
    }

    if (this.actionName == 'DESATIVAR') {
      this.headers.push({ text: this.$vuetify.lang.t('$vuetify.ENDERECO_INSTALACAO'), value: 'endereco_instalacao', sortable: false, width: 200 })
      this.headers.push({ text: this.$vuetify.lang.t('$vuetify.BAIRRO_INSTALACAO'), value: 'bairro_instalacao', sortable: false, width: 200 })
      this.headers.push({ text: this.$vuetify.lang.t('$vuetify.CIDADE_INSTALACAO'), value: 'cidade_instalacao', sortable: false, width: 200 })
      this.headers.push({ text: this.$vuetify.lang.t('$vuetify.UF_INSTALACAO'), value: 'uf_instalacao', sortable: false, width: 200 })
      this.headers.push({ text: this.$vuetify.lang.t('$vuetify.CEP_INSTALACAO'), value: 'cep_instalacao', sortable: false, width: 200 })
      this.headers.push({ text: this.$vuetify.lang.t('$vuetify.CONTATO_INSTALACAO'), value: 'contato_instalacao', sortable: false, width: 200 })
      this.headers.push({ text: this.$vuetify.lang.t('$vuetify.TELEFONE_INSTALACAO'), value: 'telefone_instalacao', sortable: false, width: 200 })
    }

    if (this.actionName == 'REMANEJAR') {
      this.headers.push({ text: this.$vuetify.lang.t('$vuetify.TIPO_REMANEJAMENTO'), value: 'tipo_remanejamento', sortable: false, width: 200 })

      this.headers.push({ text: this.$vuetify.lang.t('$vuetify.ENDERECO_ORIGEM'), value: 'endereco_origem', sortable: false, width: 200 })
      this.headers.push({ text: this.$vuetify.lang.t('$vuetify.BAIRRO_ORIGEM'), value: 'bairro_origem', sortable: false, width: 200 })
      this.headers.push({ text: this.$vuetify.lang.t('$vuetify.CIDADE_ORIGEM'), value: 'cidade_origem', sortable: false, width: 200 })
      this.headers.push({ text: this.$vuetify.lang.t('$vuetify.UF_ORIGEM'), value: 'uf_origem', sortable: false, width: 200 })
      this.headers.push({ text: this.$vuetify.lang.t('$vuetify.CEP_ORIGEM'), value: 'cep_origem', sortable: false, width: 200 })
      this.headers.push({ text: this.$vuetify.lang.t('$vuetify.CONTATO_ORIGEM'), value: 'contato_origem', sortable: false, width: 200 })
      this.headers.push({ text: this.$vuetify.lang.t('$vuetify.TELEFONE_ORIGEM'), value: 'telefone_origem', sortable: false, width: 200 })

      this.headers.push({ text: this.$vuetify.lang.t('$vuetify.ENDERECO_DESTINO'), value: 'endereco_destino', sortable: false, width: 200 })
      this.headers.push({ text: this.$vuetify.lang.t('$vuetify.BAIRRO_DESTINO'), value: 'bairro_destino', sortable: false, width: 200 })
      this.headers.push({ text: this.$vuetify.lang.t('$vuetify.CIDADE_DESTINO'), value: 'cidade_destino', sortable: false, width: 200 })
      this.headers.push({ text: this.$vuetify.lang.t('$vuetify.UF_DESTINO'), value: 'uf_destino', sortable: false, width: 200 })
      this.headers.push({ text: this.$vuetify.lang.t('$vuetify.CEP_DESTINO'), value: 'cep_destino', sortable: false, width: 200 })
      this.headers.push({ text: this.$vuetify.lang.t('$vuetify.CONTATO_DESTINO'), value: 'contato_destino', sortable: false, width: 200 })
      this.headers.push({ text: this.$vuetify.lang.t('$vuetify.TELEFONE_DESTINO'), value: 'telefone_destino', sortable: false, width: 200 })
    }

    this.headers.push({ text: this.$vuetify.lang.t('$vuetify.OBSERVACAO'), value: 'observacao', sortable: false, width: 200 })
  }
};
</script>