<template>
  <div>
    <v-row
      id="issues"
      :class="{'ml-n12':$vuetify.breakpoint.mdAndUp}"
    >
      <span class="mb-7 text-right display-1 font-weight-bold grey--text text--darken-1">
        {{$vuetify.lang.t('$vuetify.CHAMADOS')}}</span>

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
        <v-row :class="{'ml-n6':$vuetify.breakpoint.xs}">
          <v-col :class="[{'flex-grow-0':!$vuetify.breakpoint.xs},{'ml-0 pl-1 pr-0':$vuetify.breakpoint.xs}]">
            <CountCard
              :count="counts[0]"
              :message="$vuetify.lang.t('$vuetify.EM_ABERTO')"
              color="success--text"
              :func="getOpened"
            ></CountCard>
          </v-col>
          <v-col :class="[{'flex-grow-0':!$vuetify.breakpoint.xs},{'pl-1 pr-0':$vuetify.breakpoint.xs}]">
            <CountCard
              :count="0"
              :message="$vuetify.lang.t('$vuetify.EM_ANDAMENTO')"
              color="warning--text"
              :func="getClosed"
            ></CountCard>
          </v-col>
          <v-col
            :class="[{'flex-grow-0':!$vuetify.breakpoint.xs}, {'pl-1 pr-0':$vuetify.breakpoint.xs}]"
            class="mr-n2"
          >
            <CountCard
              :count="counts[1]"
              :message="$vuetify.lang.t('$vuetify.ENCERRADOS')"
              color="primary--text"
              :func="getClosed"
            ></CountCard>
          </v-col>
        </v-row>

        <v-row
          id="filtro"
          class="pl-0 ml-0 grey lighten-5 mb-n5 mt-2"
        >
          <v-col :cols="!$vuetify.breakpoint.xs?4:6">
            <v-row>
              <span class=" text-right subtitle-2 font-weight-bold grey--text text--lighten-1">
                {{$vuetify.lang.t('$vuetify.BUSCAR')}}:</span>
            </v-row>
            <v-row md="2">
              <v-text-field
                v-model.trim="searchText"
                dense
                label="Regular"
                :placeholder="$vuetify.lang.t('$vuetify.PROTOCOLO')"
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
            class="ml-5"
            cols="4"
            v-if="!$vuetify.breakpoint.xs"
          >
            <v-row>
              <span class=" text-right subtitle-2 font-weight-bold grey--text text--lighten-1">
                {{$vuetify.lang.t('$vuetify.STATUS')}}:</span>
            </v-row>
            <v-row>
              <v-select
                :items="statuses"
                v-model="status"
                :label="$vuetify.lang.t('$vuetify.EM_ABERTO_ENCERRADO')"
                solo
                dense
                @change="search()"
              ></v-select>
            </v-row>
          </v-col>

          <v-col
            class="mt-7 ml-3"
            cols="1"
            :class="{'mt-7':$vuetify.breakpoint.xs}"
          >

            <v-menu
              transition="slide-x-transition"
              bottom
              right
            >
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  class="ml-2 mt-0"
                  dark
                  color="primary"
                  v-on="on"
                  v-bind="attrs"
                  :x-small="$vuetify.breakpoint.xs"
                  :small="!$vuetify.breakpoint.xs"
                >
                  {{$vuetify.lang.t('$vuetify.ABRIR_CHAMADO')}}
                </v-btn>
              </template>

              <v-list>
                <v-list-item @click="showBatchIssueDialog('circuit')">
                  <v-list-item-title>{{$vuetify.lang.t('$vuetify.CIRCUITOS')}}</v-list-item-title>
                </v-list-item>

                <v-list-item @click="showBatchIssueDialog('invoice')">
                  <v-list-item-title>{{$vuetify.lang.t('$vuetify.FATURAMENTO')}}</v-list-item-title>
                </v-list-item>
              </v-list>

            </v-menu>
          </v-col>
        </v-row>

        <v-row
          class="pl-2 mt-2"
          style="min-height:120px;"
        >
          <div
            id="issueId"
            class="pr-2 overflow-y-auto overflow-x-hidden"
            v-scroll:#issueId="searchMore"
            style="max-height:340px; width:100%;"
          >
            <v-expansion-panels class="ma-1">
              <v-expansion-panel
                v-for="(issue, i) in issues"
                :key="i"
                hide-actions
              >
                <v-expansion-panel-header
                  v-slot="{ open }"
                  class="pt-0 pb-0"
                >
                  <v-row
                    align="center"
                    no-gutters
                  >
                    <v-col
                      v-if="!open"
                      cols="6"
                      sm="2"
                    >
                      <v-chip
                        :color="issue.status==1?'success':'primary'"
                        class="ml-0 mr-4"
                        label
                        small
                        outlined
                      >
                        {{ issue.status==1?$vuetify.lang.t('$vuetify.EM_ABERTO'):
                  $vuetify.lang.t('$vuetify.ENCERRADO') }}
                      </v-chip>
                    </v-col>

                    <v-col
                      sm="5"
                      md="4"
                      v-show="!$vuetify.breakpoint.xs"
                    >
                      <strong class="font-weight-bold grey--text text--lighten-1 mr-2">
                        {{$vuetify.lang.t('$vuetify.PROTOCOLO')}}:</strong>
                      <strong
                        class="subtitle-2"
                        v-html="issue.protocolo"
                      ></strong>
                    </v-col>

                    <v-col
                      sm="5"
                      md="5"
                      v-if="!open"
                      v-show="!$vuetify.breakpoint.xs"
                    >
                      <strong class="font-weight-bold grey--text text--lighten-1 mr-2">
                        {{issue.status==1?$vuetify.lang.t('$vuetify.DATA_ABERTURA')+':':
                    $vuetify.lang.t('$vuetify.DATA_ENCERRAMENTO')+':'}}</strong>

                      <strong>{{issue.status==1?formatDate(issue.dataAbertura):
                  formatDate(issue.dataEncerramento)}}</strong>
                    </v-col>

                    <v-col
                      v-show="$vuetify.breakpoint.xs"
                      class="mt-2 mb-2 ml-0"
                    >
                      <v-row
                        sm="5"
                        md="4"
                      >
                        <strong
                          class="caption font-weight-bold grey--text text--lighten-1 mr-2"
                          :class="{'ml-3':open}"
                        >
                          {{$vuetify.lang.t('$vuetify.PROTOCOLO')}}:</strong>
                        <strong
                          class="caption font-weight-bold"
                          v-html="issue.protocolo"
                        ></strong>
                      </v-row>

                      <v-row
                        sm="5"
                        md="5"
                        v-if="!open"
                      >
                        <strong class="caption font-weight-bold grey--text text--lighten-1 mr-2">
                          {{issue.status==1?$vuetify.lang.t('$vuetify.DATA_ABERTURA')+':':
                    $vuetify.lang.t('$vuetify.DATA_ENCERRAMENTO')+':'}}</strong>

                        <strong class="caption font-weight-bold">{{issue.status==1?formatDate(issue.dataAbertura):
                  formatDate(issue.dataEncerramento)}}</strong>
                      </v-row>
                    </v-col>
                  </v-row>
                </v-expansion-panel-header>

                <v-expansion-panel-content>

                  <v-card-subtitle class="caption mt-n10 ml-n4 mb-2 grey--text text--lighten-1">
                    {{$vuetify.lang.t('$vuetify.ORIGEM')}}:
                    {{$vuetify.lang.t('$vuetify.'+issue.origem) + (issue.identificadorOrigem?' ('+issue.identificadorOrigem+')':'')}}
                  </v-card-subtitle>

                  <v-row>
                    <v-col
                      class="mt-n6 mr-5"
                      :class="{'col-5':$vuetify.breakpoint.xs, 'col-2':!$vuetify.breakpoint.xs}"
                    >
                      <v-col class="pa-0">
                        <v-chip
                          :color="issue.status==1?'success':'primary'"
                          class="ml-0 mr-2 mb-2"
                          label
                          small
                          outlined
                        >
                          {{ issue.status==1?$vuetify.lang.t('$vuetify.EM_ABERTO'):
                  $vuetify.lang.t('$vuetify.ENCERRADO') }}
                        </v-chip>

                      </v-col>
                    </v-col>

                    <v-col
                      class="mt-n3"
                      :class="{'col-6 pl-3':$vuetify.breakpoint.xs}"
                    >
                      <v-col class="pt-0 pl-0 mt-n6">
                        <LabelValue
                          :label="$vuetify.lang.t('$vuetify.DATA_ABERTURA')"
                          :value="formatDate(issue.dataAbertura)"
                          justify="start"
                          :class="{'pl-0':$vuetify.breakpoint.xs}"
                        ></LabelValue>
                      </v-col>
                      <v-col class="pt-0 pl-0 pr-0 mt-n6">
                        <LabelValue
                          :label="$vuetify.lang.t('$vuetify.DATA_ENCERRAMENTO')"
                          :value="formatDate(issue.dataEncerramento)"
                          justify="start"
                          :class="{'pr-0 pl-0':$vuetify.breakpoint.xs}"
                        ></LabelValue>
                      </v-col>
                    </v-col>

                    <v-col
                      class="mt-n12"
                      :class="{'col-6':$vuetify.breakpoint.xs}"
                    >
                      <v-col class="pl-0">
                        <LabelValue
                          :label="$vuetify.lang.t('$vuetify.MOTIVO_ABERTURA')"
                          :value="issue.motivoAbertura"
                          justify="start"
                          :class="{'pl-0':$vuetify.breakpoint.xs}"
                        ></LabelValue>
                      </v-col>
                      <v-col class="pt-0 pl-0 pr-0 mt-n6">
                        <LabelValue
                          :label="$vuetify.breakpoint.xs?
                          $vuetify.lang.t('$vuetify.MOTIVO_ENCERRAMENTO_ABREVIADO'):$vuetify.lang.t('$vuetify.MOTIVO_ENCERRAMENTO')"
                          :value="issue.motivoEncerramento || '--'"
                          justify="start"
                          :class="{'pl-0 pr-0':$vuetify.breakpoint.xs}"
                        ></LabelValue>
                      </v-col>
                    </v-col>

                    <v-col
                      class="mt-n12"
                      :class="{'col-6 pr-0 pl-2':$vuetify.breakpoint.xs}"
                    >
                      <v-col class="pl-0">
                        <LabelValue
                          :label="$vuetify.lang.t('$vuetify.OBSERVACAO_ABERTURA')"
                          :value="issue.observacaoAbertura || '--'"
                          justify="start"
                          truncate
                          :class="{'pl-0':$vuetify.breakpoint.xs}"
                        ></LabelValue>
                      </v-col>
                      <v-col class="pt-0 pl-0 pr-0 mt-n6">
                        <LabelValue
                          :label="$vuetify.breakpoint.xs?
                          $vuetify.lang.t('$vuetify.OBSERVACAO_ENCERRAMENTO_ABREVIADO'):$vuetify.lang.t('$vuetify.OBSERVACAO_ENCERRAMENTO')"
                          :value="issue.observacaoEncerramento || '--'"
                          justify="start"
                          truncate
                          :class="{'pl-0 pr-0':$vuetify.breakpoint.xs}"
                        ></LabelValue>
                      </v-col>
                    </v-col>
                  </v-row>

                  <v-divider
                    class="mt-n3"
                    v-show="issue.status==1"
                  ></v-divider>

                  <v-card-actions
                    class="mb-n2 pb-0"
                    v-show="issue.status==1"
                  >
                    <TooltipButton
                      :label="$vuetify.lang.t('$vuetify.ENCERRAR_CHAMADO')"
                      :message="$vuetify.lang.t('$vuetify.ENCERRAR_CHAMADO')"
                      :event="encerrarChamado"
                      :object="issue"
                      :mobile="$vuetify.breakpoint.xs"
                      :isText=true
                    ></TooltipButton>

                    <TooltipButton
                      :label="$vuetify.lang.t('$vuetify.LISTAR_LOTE')"
                      :message="$vuetify.lang.t('$vuetify.LISTAR_LOTE_CIRCUITO', '')"
                      :mobile="$vuetify.breakpoint.xs"
                      v-if="issue.origem == 'CIRCUITO_LOTE_COMERCIAL'"
                      :event="showCommercialCircuits"
                      :object="issue"
                      :isText=true
                    ></TooltipButton>
                  </v-card-actions>
                </v-expansion-panel-content>
              </v-expansion-panel>
            </v-expansion-panels>
          </div>
          <v-col
            v-if="issues.length == 0 && !isLoading"
            class="mt-n2"
          >
            <WarningPanel :message="$vuetify.lang.t('$vuetify.NENHUM_CHAMADO')"> </WarningPanel>
          </v-col>
        </v-row>

        <IssueDialog
          :showDialog="showDialog"
          :showSuccess="showSuccess"
          :showDialogLoading="showDialogLoading"
          :close="closeDialog"
          :send="sendIssue"
          :getObject="getObject"
          :itemList="reasonList"
        ></IssueDialog>

        <BatchIssueDialog
          :showDialog="showBatchDialog"
          :showSuccess="showSuccess"
          :showDialogLoading="showDialogLoading"
          :close="closeBatchDialog"
          :send="sendBatchIssue"
          :search="searchEntities"
          :entity="entity"
          :itemList="itemList"
          :reasonList="reasonBatchList"
          :noResult="noBatchResult"
        ></BatchIssueDialog>

        <CommercialDialog
          :showDialog="showCommercialDialog"
          :close="closeCommercialDialog"
          :itemList="selectedCommercialList"
          :title="$vuetify.lang.t('$vuetify.LISTAR_LOTE')"
          :subtitle="$vuetify.lang.t('$vuetify.LISTAR_LOTE_CIRCUITO', entity.protocolo)"
          :actionName="actionName"
          :editable="false"
        >
        </CommercialDialog>
      </div>
    </v-lazy>
  </div>
</template>

<script>

import CountCard from '../components/cards/CountCard'
import WarningPanel from '../components/panels/WarningPanel';
import TooltipButton from '../components/TooltipButton';
import LabelValue from '../components/LabelValue';
import IssueDialog from '../components/dialogs/IssueDialog';
import BatchIssueDialog from '../components/dialogs/BatchIssueDialog';
import CommercialDialog from '../components/dialogs/CommercialDialog';

export default {
  components: {
    CountCard,
    WarningPanel,
    TooltipButton,
    LabelValue,
    IssueDialog,
    BatchIssueDialog,
    CommercialDialog
  },
  methods: {
    closeCommercialDialog () {

      this.showCommercialDialog = false;
    },
    convertNamesToFields (itemList) {
      return itemList.map((item) => {

        var obj = {};

        if (this.actionName == 'ALTERAR_VELOCIDADE' || this.actionName == 'DESATIVACAO_TEMPORARIA' || this.actionName == 'CANCELAR' || this.actionName == 'REMANEJAR' || this.actionName == 'ATIVAR' || this.actionName == 'REVOGAR_CANCELAMENTO')
          obj.nome = item['Designação Tpz']

        if (this.actionName == 'CANCELAR' || this.actionName == 'NOVO_CIRCUITO' || this.actionName == 'CANCELAR' || this.actionName == 'ATIVAR' || this.actionName == 'REVOGAR_CANCELAMENTO')
          obj.designacaoCliente = item['Designação Cliente']

        if (this.actionName == 'ALTERAR_VELOCIDADE') {
          obj.contato_instalacao = item['Contato do cliente']
          obj.telefone_instalacao = item['Telefone do cliente']
          obj.velocidade_atual = item['Velocidade atual']
          obj.velocidade_solicitada = item['Velocidade solicitada']
        }

        if (this.actionName == 'NOVO_CIRCUITO') {
          obj.razaoSocial = item['Razão social']
          obj.nomeFantasia = item['Nome fantasia']
          obj.cnpj = item['CNPJ']
          obj.inscricaoEstadual = item['Inscrição estadual']
          obj.endereco_fiscal = item['Endereço fiscal']
          obj.bairro_fiscal = item['Bairro fiscal']
          obj.cidade_fiscal = item['Cidade fiscal']
          obj.uf_fiscal = item['UF fiscal']
          obj.cep_fiscal = item['CEP fiscal']
          obj.endereco_remessa = item['Endereço da remessa']
          obj.bairro_remessa = item['Bairro da remessa']
          obj.cidade_remessa = item['Cidade da remessa']
          obj.uf_remessa = item['UF da remessa']
          obj.cep_remessa = item['CEP da remessa']
          obj.contato_remessa = item['Contato da remessa']
          obj.telefone_remessa = item['Telefone da remessa']
        }

        if (this.actionName == 'CANCELAR' || this.actionName == 'NOVO_CIRCUITO') {
          obj.endereco_instalacao = item['Endereço da instalação']
          obj.bairro_instalacao = item['Bairro da instalação']
          obj.cidade_instalacao = item['Cidade da instalação']
          obj.uf_instalacao = item['UF da instalação']
          obj.cep_instalacao = item['CEP da instalação']
          obj.contato_instalacao = item['Contato da instalação']
          obj.telefone_instalacao = item['Telefone da instalação']
        }

        if (this.actionName == 'NOVO_CIRCUITO' || this.actionName == 'ALTERAR_VELOCIDADE') {
          obj.endereco_gerencia = item['Endereço da gerência']
          obj.vlan = item['VLAN']
          obj.interconexao_tpz = item['Interconexão Tpz']
          obj.wan_rede = item['WAN CPE REDE']
          obj.endereco_lan = item['Endereço de LAN']
          obj.wan_host = item['WAN CPE HOST']
          obj.loopback = item['Loopback CPE']
          obj.rotas_sumarizadas = item['Rotas sumarizadas']
        }

        if (this.actionName == 'REMANEJAR') {
          obj.tipo_remanejamento = item['Tipo de remanejamento']
          obj.endereco_origem = item['Endereço de origem']
          obj.bairro_origem = item['Bairro de origem']
          obj.cidade_origem = item['Cidade de origem']
          obj.uf_origem = item['UF de origem']
          obj.cep_origem = item['CEP de origem']
          obj.contato_origem = item['Contato da origem']
          obj.telefone_origem = item['Telefone da origem']
          obj.endereco_destino = item['Endereço de destino']
          obj.bairro_destino = item['Bairro de destino']
          obj.cidade_destino = item['Cidade de destino']
          obj.uf_destino = item['UF de destino']
          obj.cep_destino = item['CEP de destino']
          obj.contato_destino = item['Contato do destino']
          obj.telefone_destino = item['Telefone do destino']
        }

        obj.observacao = item['Observação']
        return obj;
      })
    },
    showCommercialCircuits (issue) {

      this.actionName = issue.lote[0]
      this.selectedCommercialList = JSON.parse(issue.planilha);
      this.selectedCommercialList = this.convertNamesToFields(this.selectedCommercialList)
      this.showCommercialDialog = true;
      this.entity = issue
    },
    searchEntities (text, page) {

      if (this.entity.type == 'circuit') {
        this.searchCircuits(text, page)
      } else {
        this.searchInvoices(text, page)
      }
    },
    showBatch (issue) {
      issue.showBatch = true;
    },
    sendBatchIssue (issue, entity) {

      if (!issue.reason) {
        return;
      }

      this.showDialogLoading = true;

      issue = {
        origem: entity.type == 'circuit' ? 'CIRCUITO_LOTE' : 'NOTA_LOTE',
        identificadorOrigem: undefined,
        motivoAbertura: issue.reason,
        observacaoAbertura: issue.observation,
        lote: issue.items.map(function (item) {
          return item.nome || item.numero
        }),
        contrato: { id: this.$props.contract.id }
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
    searchInvoices (text, page) {

      if (page == 0) {
        this.itemList = []
      }

      this.showDialogLoading = true
      this.$get('/nota/busca', {
        contractId: this.$props.contract.id,
        searchText: text,
        paymentStatus: 0,
        page: page
      })
        .then((response) => {

          if (response && response.data.length == 0) {
            this.noBatchResult = true;
          } else {
            this.noBatchResult = false;
          }

          this.itemList = this.itemList.concat(response.data)
          this.showDialogLoading = false
        });
    },
    searchCircuits (text, page) {

      if (page == 0) {
        this.itemList = []
      }

      this.showDialogLoading = true
      this.$get('/circuito/busca', {
        contractNumber: this.$props.contract.numeroContratoTpz,
        searchText: text,
        onlineStatus: 0,
        installStatus: 0,
        productType: 0,
        page: page
      })
        .then((response) => {

          if (response && response.data.length == 0) {
            this.noBatchResult = true;
          } else {
            this.noBatchResult = false;
          }

          this.itemList = this.itemList.concat(response.data)
          this.showDialogLoading = false
        });
    },
    showBatchIssueDialog (type) {

      if (type == 'circuit') {

        this.reasonBatchList = [this.$vuetify.lang.t('$vuetify.ATIVACAO'),
        this.$vuetify.lang.t('$vuetify.CONFIGURACAO'),
        this.$vuetify.lang.t('$vuetify.DESATIVACAO'),
        this.$vuetify.lang.t('$vuetify.INOPERANCIA'),
        this.$vuetify.lang.t('$vuetify.INTERMITENCIA'),
        this.$vuetify.lang.t('$vuetify.LENTIDAO')]

        this.searchCircuits('', 0)

      } else {

        this.reasonBatchList = [this.$vuetify.lang.t('$vuetify.SEGUNDA_VIA'),
        this.$vuetify.lang.t('$vuetify.BAIXA_BOLETO'),
        this.$vuetify.lang.t('$vuetify.ALTERAR_VENCIMENTO')]
        this.searchInvoices('', 0)
      }

      this.entity = { type: type }

      this.showBatchDialog = true;
    },
    closeDialog () {
      this.showDialog = false;
      this.showDialogLoading = false;

      setTimeout(() => {
        this.showSuccess = false;
      }, 1000);
    },
    closeBatchDialog () {
      this.showBatchDialog = false;
      this.showDialogLoading = false;
      this.noBatchResult = false

      setTimeout(() => {
        this.showSuccess = false;
      }, 1000);
    },
    sendIssue (issue) {

      if (!issue.reason) {
        return;
      }

      this.selectedIssue.motivoEncerramento = issue.reason;
      this.selectedIssue.observacaoEncerramento = issue.observation;
      this.showDialogLoading = true;

      this.$put('/chamado/close', this.selectedIssue).then((response) => {

        if (response.data) {

          this.showSuccess = true;
          this.showDialogLoading = false;
          this.selectedIssue.status = 2;
          this.selectedIssue.dataEncerramento = response.data.dataEncerramento;
          this.counts[0] -= 1;
          this.counts[1] += 1;
        }
      });
    },
    encerrarChamado (issue) {
      this.selectedIssue = issue;
      this.selectedIssue.type = 'closing';
      this.showDialog = true;
    },
    getObject () {
      return this.selectedIssue;
    },
    getOpened () {
      this.getFromStatus(1)
    },
    getClosed () {
      this.getFromStatus(2)
    },
    getFromStatus (status) {

      if (this.isLoading) {
        return
      }

      this.searchText = '';
      this.page = 0;
      this.isLoading = true;
      this.status = this.statuses[0]
      this.issues = [];

      this.$get('/chamado/busca', {
        contractId: this.$props.contract.id,
        searchText: this.searchText,
        status: status,
        page: 0
      }).then((response) => {

        if (response && response.data.length == 0) {
          this.noResult = true;
        } else {
          this.noResult = false;
        }

        this.issues = response.data;
        this.isLoading = false;
      });
    },
    formatDate (date) {

      if (!date) {
        return '--'
      }
      return this.$formatDate(date)
    },
    searchMore () {

      if (this.isLoding || this.noResult) {
        return;
      }

      if (document.getElementById('issueId').scrollTop + 341 >=
        document.getElementById('issueId').scrollHeight) {
        this.page++;
        this.search(this.page);
      }
    },
    search (page) {

      this.isLoading = true;

      if (!page) {
        this.page = 0;
        this.noResult = false;
      }

      var selectedStatus = 0
      if (this.status == this.statuses[0]) {
        selectedStatus = 0;
      } else if (this.status == this.statuses[1]) {
        selectedStatus = 1;
      } else if (this.status == this.statuses[2]) {
        selectedStatus = 2;
      }

      this.$get('/chamado/busca', {
        contractId: this.$props.contract.id,
        searchText: this.searchText, status: selectedStatus,
        page: this.page
      }).then((response) => {

        if (response && response.data.length == 0) {
          this.noResult = true;
        } else {
          this.noResult = false;
        }

        if (!page) {
          this.issues = []
        }

        this.issues = this.issues.concat(response.data);
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
    showCommercialDialog: false,
    actionName: '',
    selectedCommercialList: undefined,
    entity: { type: 'circuit' },
    noBatchResult: false,
    reasonBatchList: [],
    itemList: [],
    showBatchDialog: false,
    showPanel: true,
    selectedIssue: undefined,
    showDialogLoading: false,
    reasonList: [],
    showDialog: false,
    showSuccess: false,
    counts: [0, 0],
    issues: [],
    statuses: [],
    status: 0,
    page: 0,
    isLoading: true,
    noResult: false,
    searchText: '',
  }),
  created: function () {

    this.reasonList = [this.$vuetify.lang.t('$vuetify.DESISTI_CHAMADO'),
    this.$vuetify.lang.t('$vuetify.PROBLEMA_RESOLVIDO')]

    this.$root.$on('new-issue', (issue) => {
      if (!this.issues) {
        return;
      }
      this.issues.unshift(issue)
      this.counts[0] += 1;
    })

    this.statuses = [this.$vuetify.lang.t('$vuetify.TODOS'),
    this.$vuetify.lang.t('$vuetify.EM_ABERTO'),
    this.$vuetify.lang.t('$vuetify.ENCERRADOS')]

    this.$get('/chamado/counts',
      { contractId: this.$props.contract.id }).then((response) => {

        this.counts = response.data;
        if (this.counts.length == 0)
          this.counts = [0, 0, 0]

        this.isLoading = false;
        this.counts.push(0)
        this.$root.$emit('issue-data', this.counts)
      });

    this.$get('/chamado/busca', {
      contractId: this.$props.contract.id,
      searchText: '',
      status: 0,
      page: 0
    })
      .then((response) => {
        this.issues = response.data;
        this.isLoading = false;
      });
  }
};
</script>
