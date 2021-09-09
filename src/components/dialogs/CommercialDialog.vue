<template>

  <v-dialog
    v-model="showDialog"
    persistent
    :max-width="showSuccess?400: 700"
    class="overflow-y-hidden"
  >
    <v-card>
      <v-card-title
        v-if="!showSuccess"
        class="headline-6"
        :class="{'subtitle-2':$vuetify.breakpoint.xs}"
        style="word-break: normal; !important"
      >
        {{title}}
      </v-card-title>
      <v-card-text
        v-if="!showSuccess"
        class="headline-6 mt-n3"
      >{{subtitle}}</v-card-text>

      <v-card-text
        v-if="this.actionName != 'NOVO_CIRCUITO' && this.actionName != 'SITE_SURVEY' && editable && !showSuccess"
        class="caption mt-n3 font-weight-bold grey--text"
      >{{'Circuitos selecionados: '+entityList.length}}</v-card-text>

      <v-row
        v-if="this.actionName != 'NOVO_CIRCUITO' && this.actionName != 'SITE_SURVEY' && editable && !showSuccess && canShowExcelButtons()"
        class="mt-n9 mb-4 mr-4"
      >
        <v-spacer></v-spacer>
        <TooltipButton
          :label="$vuetify.lang.t('$vuetify.BAIXAR_EXCEL')"
          :message="$vuetify.lang.t('$vuetify.BAIXAR_EXCEL_DESCRICAO')"
          :event="downloadExcel"
          :object="{}"
          :mobile="true"
          :isText="true"
          :bottom="true"
        ></TooltipButton>

        <TooltipButton
          :label="$vuetify.lang.t('$vuetify.IMPORTAR_EXCEL')"
          :message="$vuetify.lang.t('$vuetify.IMPORTAR_EXCEL_DESCRICAO')"
          :object="{}"
          :event="clickInput"
          :mobile="true"
          :isText="true"
          :bottom="true"
        ></TooltipButton>
        <input
          v-show="false"
          ref="file"
          type="file"
          @change="importExcel"
          accept=".xls, .xlsx"
        >
      </v-row>

      <v-row
        class="ma-0 d-flex justify-center mb-12 ml-3 mr-3 overflow-y-auto overflow-x-hidden"
        style="max-height:20rem"
      >

        <v-lazy
          :options="{
            threshold: .6
            }"
          transition="slide-x-transition"
        >
          <SuccessPanel
            v-show="showSuccess"
            :title="$vuetify.lang.t('$vuetify.PEDIDO_ENVIADO')"
            :subtitle="$vuetify.lang.t('$vuetify.PROTOCOLO')+': '+entity.protocolo"
            class="mt-5 overflow-y-hidden"
          >
          </SuccessPanel>
        </v-lazy>

        <v-row
          v-if="(actionName=='NOVO_CIRCUITO' || this.actionName == 'SITE_SURVEY') && editable && !showSuccess"
          class="mr-1"
        >
          <v-btn
            color="primary"
            dark
            class="mb-2 ml-7"
            x-small
            @click="newLine()"
          >{{$vuetify.lang.t('$vuetify.NOVA_LINHA')}}</v-btn>

          <v-spacer></v-spacer>

          <TooltipButton
            class="d-flex justify-right"
            :label="$vuetify.lang.t('$vuetify.BAIXAR_EXCEL')"
            :message="$vuetify.lang.t('$vuetify.BAIXAR_EXCEL_DESCRICAO')"
            :event="downloadExcel"
            :object="{}"
            :mobile="true"
            :isText="true"
            :bottom="true"
            v-if="!showSuccess"
          ></TooltipButton>

          <TooltipButton
            class="d-flex justify-right"
            :label="$vuetify.lang.t('$vuetify.IMPORTAR_EXCEL')"
            :message="$vuetify.lang.t('$vuetify.IMPORTAR_EXCEL_DESCRICAO')"
            :object="{}"
            :event="clickInput"
            :mobile="true"
            :isText="true"
            :bottom="true"
            v-if="!showSuccess"
          ></TooltipButton>
          <input
            v-show="false"
            ref="file"
            type="file"
            @change="importExcel"
            accept=".xls, .xlsx"
          >
        </v-row>

        <CommercialTable
          v-if="!uploadSuccess && !showSuccess"
          :actionName="actionName"
          :entityList="entityList"
          :headers="headers"
          :deleteItem="deleteItem"
          :editable="editable"
        ></CommercialTable>

      </v-row>

      <SuccessPanel
        v-show="uploadSuccess && !showSuccess"
        :title="$vuetify.lang.t('$vuetify.ARQUIVO_IMPORTADO')"
        :subtitle="file?file.name:''"
        class="mt-n12 overflow-y-hidden mb-12"
        max-width="200"
      >
      </SuccessPanel>

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
          @click="send(issue, entity, entityList, fileByteArray);"
          :x-small="$vuetify.breakpoint.xs"
          :loading="showDialogLoading"
          v-show="editable && !showSuccess"
        >{{$vuetify.lang.t('$vuetify.ENVIAR')}}</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

</template>

<script>

import SuccessPanel from '../../components/panels/SuccessPanel';
import CommercialTable from '../../components/CommercialTable';
import TooltipButton from '../../components/TooltipButton';

export default {
  components: {
    SuccessPanel,
    CommercialTable,
    TooltipButton,
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
    canShowExcelButtons () {
      return this.actionName == 'NOVO_CIRCUITO' ||
        this.actionName == 'REMANEJAR' ||
        this.actionName == 'ALTERAR_VELOCIDADE' ||
        this.actionName == 'CANCELAR' ||
        this.actionName == 'SUSPENDER' ||
        this.actionName == 'SITE_SURVEY' ||
        this.actionName == 'OUTROS'
    },
    clickInput () {
      this.$refs.file.click()
    },
    importExcel (e) {

      var files = e.target.files || e.dataTransfer.files;
      if (!files.length)
        return;

      var reader = new FileReader();
      this.fileByteArray = [];
      var vm = this;

      reader.readAsArrayBuffer(files[0]);
      reader.onloadend = function (evt) {
        if (evt.target.readyState == FileReader.DONE) {
          var arrayBuffer = evt.target.result,
            array = new Uint8Array(arrayBuffer);
          for (var i = 0; i < array.length; i++) {
            vm.fileByteArray.push(array[i]);
          }
        }
      }

      this.uploadSuccess = true;
      this.file = files[0]
    },
    downloadExcel () {
      const link = document.createElement("a");

      if (this.actionName == 'NOVO_CIRCUITO') {
        link.href = 'nova_instalacao.xlsx';
        link.setAttribute("download", this.$vuetify.lang.t('$vuetify.NOVO_CIRCUITO_XLSX'));
      }

      if (this.actionName == 'REMANEJAR') {
        link.href = 'remanejamento.xlsx';
        link.setAttribute("download", this.$vuetify.lang.t('$vuetify.REMANEJAMENTO_XLSX'));
      }

      if (this.actionName == 'ALTERAR_VELOCIDADE') {
        link.href = 'alteracao_velocidade.xlsx';
        link.setAttribute("download", this.$vuetify.lang.t('$vuetify.ALTERACAO_VELOCIDADE_XLSX'));
      }

      if (this.actionName == 'CANCELAR') {
        link.href = 'cancelamento.xlsx';
        link.setAttribute("download", this.$vuetify.lang.t('$vuetify.CANCELAMENTO_XLSX'));
      }

      if (this.actionName == 'SUSPENDER') {
        link.href = 'suspensao.xlsx';
        link.setAttribute("download", this.$vuetify.lang.t('$vuetify.SUSPENSAO_XLSX'));
      }

      if (this.actionName == 'OUTROS') {
        link.href = 'outros.xlsx';
        link.setAttribute("download", this.$vuetify.lang.t('$vuetify.OUTROS_XLSX'));
      }

      if (this.actionName == 'SITE_SURVEY') {
        link.href = 'nova_instalacao.xlsx';
        link.setAttribute("download", this.$vuetify.lang.t('$vuetify.SITE_SURVEY_XLSX'));
      }

      link.click();
    },
    newLine () {
      this.entityList.push({});
    },
    deleteItem (item) {
      this.entityList.splice(this.entityList.indexOf(item), 1)
    },
    cleanFields () {
      this.issue.observation = '';
      this.issue.reason = undefined;
      this.uploadSuccess = false;
      this.file = undefined;
      this.fileByteArray = undefined;
      this.entityList = [];
    }
  },
  data: () => ({
    issue: { reason: '', observation: '' },
    entity: {},
    entityList: [],
    headers: [],
    file: undefined,
    fileByteArray: [],
    uploadSuccess: false,
  }),
  watch: {
    itemList: function () {

      if (this.itemList)
        this.entityList = this.itemList.map((x) => x)
    }
  },
  beforeUpdate: function () {

    this.headers = [
      { text: '', align: 'start', value: 'actions', sortable: false }
    ];

    if (this.actionName == 'OUTROS' || this.actionName == 'ALTERAR_VELOCIDADE' || this.actionName == 'SUSPENDER' ||
      this.actionName == 'CANCELAR' || this.actionName == 'REMANEJAR' ||
      this.actionName == 'ATIVAR' || this.actionName == 'REVOGAR_CANCELAMENTO' || this.actionName == 'REVOGAR_SUSPENSAO')
      this.headers.push({
        text: this.$vuetify.lang.t('$vuetify.DESIGNACAO_TPZ'), align: 'start', sortable: false, value: 'nome', width: 200
      })

    if (this.actionName == 'OUTROS' || this.actionName == 'SUSPENDER' || this.actionName == 'NOVO_CIRCUITO' || this.actionName == 'SITE_SURVEY' ||
      this.actionName == 'CANCELAR' || this.actionName == 'ATIVAR' ||
      this.actionName == 'REVOGAR_CANCELAMENTO' || this.actionName == 'REVOGAR_SUSPENSAO')
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

    if (this.actionName == 'OUTROS') {
      this.headers.push({ text: this.$vuetify.lang.t('$vuetify.SERVICO'), value: 'servico', sortable: false, width: 200 })
    }

    if (this.actionName == 'NOVO_CIRCUITO' || this.actionName == 'SITE_SURVEY') {

      this.headers.push({ text: this.$vuetify.lang.t('$vuetify.BANDA'), value: 'banda', sortable: false, width: 200 })
      this.headers.push({ text: this.$vuetify.lang.t('$vuetify.VELOCIDADE'), value: 'velocidade', sortable: false, width: 200 })
      this.headers.push({ text: this.$vuetify.lang.t('$vuetify.ANTENA'), value: 'antena', sortable: false, width: 200 })
      this.headers.push({ text: 'BUC', value: 'buc', sortable: false, width: 200 })
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
      this.headers.push({ text: this.$vuetify.lang.t('$vuetify.LATITUDE'), value: 'latitude', sortable: false, width: 200 })
      this.headers.push({ text: this.$vuetify.lang.t('$vuetify.LONGITUDE'), value: 'longitude', sortable: false, width: 200 })
      this.headers.push({ text: this.$vuetify.lang.t('$vuetify.ENDERECO_GERENCIA'), value: 'endereco_gerencia', sortable: false, width: 200 })
      this.headers.push({ text: 'VLAN', value: 'vlan', sortable: false, width: 200 })
      this.headers.push({ text: this.$vuetify.lang.t('$vuetify.INTERCONEXAO_TPZ'), value: 'interconexao_tpz', sortable: false, width: 200 })
      this.headers.push({ text: 'WAN CPE REDE', value: 'wan_rede', sortable: false, width: 200 })
      this.headers.push({ text: this.$vuetify.lang.t('$vuetify.ENDERECO_LAN'), value: 'endereco_lan', sortable: false, width: 200 })
      this.headers.push({ text: 'WAN CPE HOST', value: 'wan_host', sortable: false, width: 200 })
      this.headers.push({ text: 'Loopback CPE', value: 'loopback', sortable: false, width: 200 })
      this.headers.push({ text: this.$vuetify.lang.t('$vuetify.ROTAS_SUMARIZADAS'), value: 'rotas_sumarizadas', sortable: false, width: 200 })


      if (this.entityList.length == 0 && this.actionName == 'NOVO_CIRCUITO') {
        this.entityList.push({});
        this.entityList.push({});
        this.entityList.push({});
        this.entityList.push({});
      }
    }

    if (this.actionName == 'CANCELAR' || this.actionName == 'SUSPENDER') {
      this.headers.push({ text: this.$vuetify.lang.t('$vuetify.ENDERECO_INSTALACAO'), value: 'endereco_instalacao', sortable: false, width: 200 })
      this.headers.push({ text: this.$vuetify.lang.t('$vuetify.BAIRRO_INSTALACAO'), value: 'bairro_instalacao', sortable: false, width: 200 })
      this.headers.push({ text: this.$vuetify.lang.t('$vuetify.CIDADE_INSTALACAO'), value: 'cidade_instalacao', sortable: false, width: 200 })
      this.headers.push({ text: this.$vuetify.lang.t('$vuetify.UF_INSTALACAO'), value: 'uf_instalacao', sortable: false, width: 200 })
      this.headers.push({ text: this.$vuetify.lang.t('$vuetify.CEP_INSTALACAO'), value: 'cep_instalacao', sortable: false, width: 200 })
      this.headers.push({ text: this.$vuetify.lang.t('$vuetify.CONTATO_INSTALACAO'), value: 'contato_instalacao', sortable: false, width: 200 })
      this.headers.push({ text: this.$vuetify.lang.t('$vuetify.TELEFONE_INSTALACAO'), value: 'telefone_instalacao', sortable: false, width: 200 })
    }

    if (this.actionName == 'OUTROS') {
      this.headers.push({ text: this.$vuetify.lang.t('$vuetify.ENDERECO'), value: 'endereco', sortable: false, width: 200 })
      this.headers.push({ text: this.$vuetify.lang.t('$vuetify.BAIRRO'), value: 'bairro', sortable: false, width: 200 })
      this.headers.push({ text: this.$vuetify.lang.t('$vuetify.CIDADE'), value: 'cidade', sortable: false, width: 200 })
      this.headers.push({ text: this.$vuetify.lang.t('$vuetify.UF'), value: 'uf', sortable: false, width: 200 })
      this.headers.push({ text: this.$vuetify.lang.t('$vuetify.CEP'), value: 'cep', sortable: false, width: 200 })
      this.headers.push({ text: this.$vuetify.lang.t('$vuetify.CONTATO'), value: 'contato', sortable: false, width: 200 })
      this.headers.push({ text: this.$vuetify.lang.t('$vuetify.TELEFONE'), value: 'telefone', sortable: false, width: 200 })
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