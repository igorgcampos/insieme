<template>
  <div class="mb-10">
    <v-row
      id="invoices"
      :class="{'ml-n12':$vuetify.breakpoint.mdAndUp}"
    >
      <span class="mb-7 text-right display-1 font-weight-bold grey--text text--darken-1">
        {{$vuetify.lang.t('$vuetify.FATURAMENTO')}}</span>

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
              :message="$vuetify.lang.t('$vuetify.PAGOS')"
              color="success--text"
              :func="getPaid"
            ></CountCard>
          </v-col>
          <v-col :class="[{'flex-grow-0':!$vuetify.breakpoint.xs},{'pl-1 pr-0':$vuetify.breakpoint.xs}]">
            <CountCard
              :count="counts[1]"
              :message="$vuetify.lang.t('$vuetify.EM_ABERTO')"
              color="warning--text"
              :func="getOpened"
            ></CountCard>
          </v-col>
          <v-col
            :class="[{'flex-grow-0':!$vuetify.breakpoint.xs}, {'pl-1 pr-0':$vuetify.breakpoint.xs}]"
            class="mr-n2"
          >
            <CountCard
              :count="counts[2]"
              :message="$vuetify.lang.t('$vuetify.VENCIDAS')"
              color="error--text"
              :func="getOverdue"
            ></CountCard>
          </v-col>
        </v-row>

        <v-row
          id="filtro"
          class="pl-0 ml-0 grey lighten-5 mb-n5 mt-2"
        >
          <v-col cols="4">
            <v-row>
              <span class=" text-right subtitle-2 font-weight-bold grey--text text--lighten-1">
                {{$vuetify.lang.t('$vuetify.BUSCAR')}}:</span>
            </v-row>
            <v-row md="2">
              <v-text-field
                v-model.trim="searchText"
                dense
                label="Regular"
                :placeholder="$vuetify.lang.t('$vuetify.NUMERO_NOTA')"
                single-line
                solo
                max-width="200"
                append-icon="mdi-magnify"
                @click:append="search()"
                @keypress.enter="search()"
                ref="searchField"
              ></v-text-field>
            </v-row>
          </v-col>

          <v-col
            class="ml-5"
            cols="4"
          >
            <v-row>
              <span class=" text-right subtitle-2 font-weight-bold grey--text text--lighten-1">
                {{$vuetify.lang.t('$vuetify.PAGAMENTO')}}:</span>
            </v-row>
            <v-row>
              <v-select
                :items="statuses"
                v-model="status"
                :label="$vuetify.lang.t('$vuetify.STATUS_PAGAMENTO')"
                solo
                dense
                item-text="text"
                item-value="value"
                @change="search()"
              ></v-select>
            </v-row>
          </v-col>

          <v-col
            class="mt-5"
            cols="1"
            v-if="!$vuetify.breakpoint.xs"
          >
            <v-tooltip top>
              <template v-slot:activator="{ on }">
                <v-btn
                  class="ml-2 mt-1"
                  dark
                  color="primary"
                  v-on="on"
                  @click="exportCSV()"
                  :loading="loadingExport"
                >
                  <v-icon dark>mdi-file-export</v-icon>
                </v-btn>
              </template>
              <span>{{$vuetify.lang.t('$vuetify.EXPORTAR_CSV')}}</span>
            </v-tooltip>
          </v-col>
        </v-row>

        <v-row
          class="pl-2 mt-2"
          style="min-height:120px;"
        >
          <div
            id="invoiceId"
            class="pr-2 overflow-y-auto overflow-x-hidden"
            v-scroll:#invoiceId="searchMore"
            style="max-height:440px; width:100%;"
          >
            <v-expansion-panels
              class="ma-1"
              v-model="openedPanel"
            >
              <v-expansion-panel
                v-for="(invoice, i) in invoices"
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
                        :color="invoice.statusValido=='CANCELADA'?'blue-grey':
                        invoice.statusPagamento=='EM_ABERTO'?'warning':
                        invoice.statusPagamento=='VENCIDA'?'error':'success'"
                        class="ml-0 mr-2"
                        label
                        small
                        outlined
                      >
                        {{ invoice.statusValido=='CANCELADA'?$vuetify.lang.t('$vuetify.CANCELADA')
                        :invoice.statusPagamento=='EM_ABERTO'?$vuetify.lang.t('$vuetify.EM_ABERTO'):
                        invoice.statusPagamento=='VENCIDA'?$vuetify.lang.t('$vuetify.VENCIDA'):
                  $vuetify.lang.t('$vuetify.PAGO') }}
                      </v-chip>
                    </v-col>

                    <v-col
                      sm="5"
                      md="3"
                      v-show="!$vuetify.breakpoint.xs"
                    >
                      <strong class="font-weight-bold grey--text text--lighten-1 mr-2">No.:</strong>
                      <strong v-html="invoice.numero"></strong>
                    </v-col>

                    <v-col
                      v-if="!open"
                      v-show="!$vuetify.breakpoint.xs"
                    >
                      <strong class="font-weight-bold grey--text text--lighten-1 mr-2">
                        {{(invoice.statusPagamento=='EM_ABERTO' || invoice.statusPagamento=='VENCIDA')?$vuetify.lang.t('$vuetify.VENCE_EM')+":":
                    $vuetify.lang.t('$vuetify.PAGO_EM')+":"}}</strong>

                      <strong>{{(invoice.statusPagamento=='EM_ABERTO' || invoice.statusPagamento=='VENCIDA')?
                        formatDate(invoice.dataVencimento):
                        formatDate(invoice.dataPagamento)}}</strong>
                    </v-col>

                    <v-col
                      class="mt-2 mb-2"
                      v-show="$vuetify.breakpoint.xs"
                    >
                      <v-row
                        sm="5"
                        md="3"
                        :class="{'ml-0':open}"
                      >
                        <strong class="caption font-weight-bold grey--text text--lighten-1 mr-2">No.:</strong>
                        <strong
                          class="caption font-weight-bold"
                          v-html="invoice.numero"
                        ></strong>
                      </v-row>

                      <v-row v-if="!open">
                        <strong class="caption font-weight-bold grey--text text--lighten-1 mr-2">
                          {{invoice.statusPagamento=='EM_ABERTO'?$vuetify.lang.t('$vuetify.VENCE_EM')+":":
                    $vuetify.lang.t('$vuetify.PAGO_EM')+":"}}</strong>

                        <strong class="caption font-weight-bold">{{invoice.statusPagamento=='EM_ABERTO'?
                          formatDate(invoice.dataVencimento):
                          formatDate(invoice.dataPagamento)}}</strong>
                      </v-row>
                    </v-col>
                  </v-row>
                </v-expansion-panel-header>

                <v-expansion-panel-content>

                  <v-row>
                    <v-col
                      class="mt-n4"
                      :cols="$vuetify.breakpoint.xs?5:2"
                    >
                      <v-col class="pa-0">
                        <v-chip
                          :color="invoice.statusValido=='CANCELADA'?'blue-grey':
                          invoice.statusPagamento=='EM_ABERTO'?'warning':
                          invoice.statusPagamento=='VENCIDA'?'error':'success'"
                          class="ml-0 mr-2"
                          label
                          small
                          outlined
                        >
                          {{ invoice.statusValido=='CANCELADA'?$vuetify.lang.t('$vuetify.CANCELADA')
                            :invoice.statusPagamento=='EM_ABERTO'?$vuetify.lang.t('$vuetify.EM_ABERTO'):
                            invoice.statusPagamento=='VENCIDA'?$vuetify.lang.t('$vuetify.VENCIDA'):
                            $vuetify.lang.t('$vuetify.PAGO') }}
                        </v-chip>
                      </v-col>

                      <v-col class="pa-0 mt-3">
                        <v-chip
                          color="primary"
                          class="ml-0 mr-2"
                          label
                          small
                          outlined
                        >
                          {{ invoice.tipo=='LOCAÇÃO'?$vuetify.lang.t('$vuetify.LOCACAO'):
                          invoice.tipo=='VENDA'?$vuetify.lang.t('$vuetify.VENDA'):invoice.tipo }}
                        </v-chip>
                      </v-col>
                    </v-col>

                    <v-col
                      class="mt-n12"
                      :cols="$vuetify.breakpoint.xs?7:4"
                      :class="{'pl-0':$vuetify.breakpoint.xs}"
                    >
                      <v-col>
                        <LabelValue
                          :label="$vuetify.lang.t('$vuetify.DESCRICAO_SERVICO')"
                          :value="invoice.descricaoServico || '--'"
                          justify="start"
                          truncate
                          :class="{'pl-0':$vuetify.breakpoint.xs}"
                        ></LabelValue>
                      </v-col>
                      <v-col class="pt-0 mt-n6">
                        <LabelValue
                          :label="$vuetify.lang.t('$vuetify.CONDICAO_PAGAMENTO')"
                          :value="invoice.condicaoPagamento"
                          justify="start"
                          :class="{'pl-0':$vuetify.breakpoint.xs}"
                        ></LabelValue>
                      </v-col>
                      <v-col class="pt-0 mt-n6">
                        <LabelValue
                          :label="$vuetify.lang.t('$vuetify.DATA_COMPETENCIA')"
                          :value="formatDate(invoice.dataCompetencia)"
                          justify="start"
                          :class="{'pl-0':$vuetify.breakpoint.xs}"
                        ></LabelValue>
                      </v-col>
                    </v-col>

                    <v-col
                      class="mt-n12"
                      :cols="$vuetify.breakpoint.xs?7:4"
                    >
                      <v-col>
                        <LabelValue
                          :label="$vuetify.lang.t('$vuetify.DATA_EMISSAO')"
                          :value="formatDate(invoice.dataEmissao)"
                          justify="start"
                          :class="{'pl-0':$vuetify.breakpoint.xs}"
                        ></LabelValue>
                      </v-col>
                      <v-col class="pt-0 mt-n6">
                        <LabelValue
                          :label="$vuetify.lang.t('$vuetify.DATA_VENCIMENTO')"
                          :value="formatDate(invoice.dataVencimento)"
                          justify="start"
                          :class="{'pl-0':$vuetify.breakpoint.xs}"
                        ></LabelValue>
                      </v-col>
                      <v-col class="pt-0 mt-n6">
                        <LabelValue
                          :label="$vuetify.lang.t('$vuetify.DATA_PAGAMENTO')"
                          :value="invoice.dataPagamento?formatDate(invoice.dataPagamento):'--'"
                          justify="start"
                          :class="{'pl-0':$vuetify.breakpoint.xs}"
                        ></LabelValue>
                      </v-col>
                    </v-col>

                    <v-col
                      class="mt-n9"
                      :class="{'pl-0':$vuetify.breakpoint.xs, 'ml-n5':!$vuetify.breakpoint.xs}"
                    >
                      <v-col>
                        <v-row justify="start">
                          <span class="text-right caption font-weight-bold grey--text text--lighten-1">
                            {{$vuetify.lang.t('$vuetify.A_RECEBER')}}
                          </span>
                        </v-row>
                        <v-row justify="start">
                          <span class="text-center subtitle-2 font-weight-bold error--text">
                            {{'R$ '+invoice.aReceber.toLocaleString()}} </span>
                        </v-row>
                      </v-col>

                      <v-col class="mt-n3">
                        <v-row justify="start">
                          <span class="text-right caption font-weight-bold grey--text text--lighten-1">
                            {{$vuetify.lang.t('$vuetify.RECEBIDO')}}
                          </span>
                        </v-row>
                        <v-row justify="start">
                          <span class="text-center subtitle-2 font-weight-bold primary--text">
                            {{'R$ '+invoice.recebido.toLocaleString()}} </span>
                        </v-row>
                      </v-col>

                      <v-col class="mt-n3">
                        <v-row justify="start">
                          <span class="text-right caption font-weight-bold grey--text text--lighten-1">
                            {{$vuetify.lang.t('$vuetify.TOTAL_NOTA')}}
                          </span>
                        </v-row>
                        <v-row justify="start">
                          <span class="text-center subtitle-2 font-weight-bold success--text">
                            {{'R$ '+invoice.totalNF.toLocaleString()}} </span>
                        </v-row>
                      </v-col>
                    </v-col>
                  </v-row>

                  <v-divider class="mt-n3"></v-divider>

                  <v-card-actions class="mb-n2 pb-0">
                    <TooltipButton
                      :label="$vuetify.lang.t('$vuetify.ABRIR_CHAMADO')"
                      :message="$vuetify.lang.t('$vuetify.ABRIR_CHAMADO_NOTA')"
                      :event="openIssue"
                      :object="invoice"
                      :mobile="$vuetify.breakpoint.xs"
                      :isText=true
                    ></TooltipButton>

                    <TooltipButton
                      :label="$vuetify.lang.t('$vuetify.BAIXAR')"
                      :message="$vuetify.lang.t('$vuetify.DOWNLOAD_DESTA_NOTA')"
                      :event="downloadInvoice"
                      :object="invoice"
                      :mobile="$vuetify.breakpoint.xs"
                      :isText=true
                      :loading="isDownloading"
                    ></TooltipButton>
                  </v-card-actions>
                </v-expansion-panel-content>
              </v-expansion-panel>
            </v-expansion-panels>
          </div>
          <v-col v-if="invoices.length == 0 && !isLoading">
            <v-lazy
              :options="{threshold: .6}"
              transition="slide-x-transition"
            >
              <WarningPanel :message="$vuetify.lang.t('$vuetify.NENHUMA_NOTA')"> </WarningPanel>
            </v-lazy>
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

        <InfoDialog
          :title="$vuetify.lang.t('$vuetify.NOTA_FISCAL_NAO_ENCONTRADA')"
          :info="$vuetify.lang.t('$vuetify.NOTA_NAO_DIGITALIZADO')"
          :close="closeInfoDialog"
          :dialog="infoDialog"
        >
        </InfoDialog>
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
import InfoDialog from '../components/dialogs/InfoDialog';

export default {
  components: {
    CountCard,
    WarningPanel,
    TooltipButton,
    LabelValue,
    IssueDialog,
    InfoDialog,
  },
  methods: {
    closeInfoDialog () {
      this.infoDialog = false;
    },
    downloadInvoice (invoice) {

      this.isDownloading = true;

      this.$saveOperation({ tipo: 'DOWNLOAD_NOTA', usuario: this.$getUser() })

      this.$get('/nota/download', {
        invoiceType: invoice.tipo,
        invoiceNumber: invoice.numero,
        uf: invoice.uf,
      }, 'arraybuffer').then(response => {

        if (!response) {
          this.infoDialog = true;
          this.isDownloading = false;
          return;
        }

        const file = new Blob(
          [response.data],
          { type: 'application/zip' });

        const fileURL = URL.createObjectURL(file);
        var a = document.createElement('a')
        a.href = fileURL
        a.download = this.$vuetify.lang.t('$vuetify.NOTAS_FISCAIS')
        a.click()

        this.isDownloading = false;
      });

    },
    formatInvoice (invoice) {

      return {
        [this.$vuetify.lang.t('$vuetify.NUMERO_NOTA')]: invoice.numero,
        [this.$vuetify.lang.t('$vuetify.DATA_COMPETENCIA')]: this.formatDate(invoice.dataCompetencia),
        [this.$vuetify.lang.t('$vuetify.DATA_EMISSAO')]: this.formatDate(invoice.dataEmissao),
        [this.$vuetify.lang.t('$vuetify.DATA_VENCIMENTO')]: this.formatDate(invoice.dataVencimento),
        [this.$vuetify.lang.t('$vuetify.TIPO')]: invoice.tipo == 'LOCAÇÃO' ? this.$vuetify.lang.t('$vuetify.LOCACAO') :
          invoice.tipo == 'VENDA' ? this.$vuetify.lang.t('$vuetify.VENDA') : invoice.tipo,
        [this.$vuetify.lang.t('$vuetify.STATUS_PAGAMENTO')]: invoice.statusPagamento == 'EM_ABERTO' ? this.$vuetify.lang.t('$vuetify.EM_ABERTO') :
          this.$vuetify.lang.t('$vuetify.PAGO'),
        [this.$vuetify.lang.t('$vuetify.DESCRICAO_SERVICO')]: invoice.descricaoServico.substring(0, 18),
        [this.$vuetify.lang.t('$vuetify.CONDICAO_PAGAMENTO')]: invoice.condicaoPagamento,
        [this.$vuetify.lang.t('$vuetify.TOTAL_NOTA')]: invoice.totalNF.toLocaleString(),
        [this.$vuetify.lang.t('$vuetify.A_RECEBER')]: invoice.aReceber.toLocaleString(),
        [this.$vuetify.lang.t('$vuetify.RECEBIDO')]: invoice.recebido.toLocaleString()
      }
    },
    exportCSV () {

      this.loadingExport = true
      if (!this.allInvoices) {
        this.$get('/nota/all', {
          contractNumber: this.$props.contract.numeroContratoTpz
        }).then(response => {

          this.allInvoices = response.data.map((invoice) => {
            return this.formatInvoice(invoice);
          })

          this.$downloadCSV(this.allInvoices, this.$vuetify.lang.t('$vuetify.NOTAS_FISCAIS'))
          this.loadingExport = false
        });
      } else {
        this.$downloadCSV(this.allInvoices, this.$vuetify.lang.t('$vuetify.NOTAS_FISCAIS'))
        this.loadingExport = false
      }
    },
    expandPanel () {
      this.showPanel = !this.showPanel;
    },
    closeDialog () {
      this.showDialog = false;
      this.showDialogLoading = false;

      setTimeout(() => {
        this.showSuccess = false;
      }, 1000);
    },
    sendIssue (issue, invoice) {

      if (!issue.reason || !issue.observation) {
        return;
      }

      this.showDialogLoading = true;

      issue = {
        origem: 'NOTA_FISCAL',
        identificadorOrigem: invoice.numero,
        motivoAbertura: this.getMotive(issue.reason),
        observacaoAbertura: issue.observation,
        contrato: { id: this.$props.contract.id }
      }

      this.$post('/chamado/create', issue).then((response) => {

        if (response.data) {

          this.showSuccess = true;
          this.showDialogLoading = false;
          invoice.protocolo = response.data.protocolo
          this.$root.$emit('new-issue', response.data)
        }
      });
    },
    getMotive (reason) {

      var currentLanguage = this.$vuetify.lang.current;
      this.$vuetify.lang.current = 'pt';

      var selectedReason;
      if (this.reasonList[0] == reason) {
        selectedReason = this.$vuetify.lang.t('$vuetify.SEGUNDA_VIA')
      }

      if (this.reasonList[1] == reason) {
        selectedReason = this.$vuetify.lang.t('$vuetify.BAIXA_BOLETO')
      }

      if (this.reasonList[2] == reason) {
        selectedReason = this.$vuetify.lang.t('$vuetify.ALTERAR_VENCIMENTO')
      }

      this.$vuetify.lang.current = currentLanguage;
      return selectedReason;
    },
    clearFields () {
      this.searchText = '';
      this.page = 0;
      this.invoices = []
      this.status = null
    },
    getByStatus (status) {

      if (this.isLoading) {
        return
      }

      this.clearFields()
      this.status = status
      this.search()

    },
    getPaid () {
      this.getByStatus('PAGO');
    },
    getOpened () {
      this.getByStatus('EM_ABERTO');
    },
    getOverdue () {
      this.getByStatus('VENCIDA');
    },
    openIssue (invoice) {
      this.selectedInvoice = invoice;
      this.selectedInvoice.type = 'invoice';
      this.showDialog = true;
    },
    getObject () {
      return this.selectedInvoice;
    },
    formatDate (date) {
      return this.$formatDate(date)
    },
    searchMore () {

      if (this.isLoding || this.noResult) {
        return;
      }

      if (document.getElementById('invoiceId').scrollTop + 341 >=
        document.getElementById('invoiceId').scrollHeight) {
        this.page++;
        this.search(this.page);
      }
    },
    search (page, selectInvoiceIndex) {

      this.isLoading = true;

      if (!page || page == 0) {
        this.page = 0;
        this.noResult = false;
      }

      this.$get('/nota/busca', {
        contractId: this.$props.contract.id,
        searchText: this.searchText,
        paymentStatus: this.status,
        page: this.page
      }).then((response) => {

        if (response && response.data.length == 0) {
          this.noResult = true;
        } else {
          this.noResult = false;
        }

        if (!page) {
          this.invoices = []
        }

        this.invoices = this.invoices.concat(response.data);
        this.isLoading = false;
        this.openedPanel = selectInvoiceIndex
      });

    },
    searchCanceledInvoice (invoiceNumber) {

      this.isLoading = true;
      this.$get('/nota/canceled',
        { numero: invoiceNumber, contractId: this.$props.contract.id }).then((response) => {

          if (response) {
            this.invoices = []
            this.invoices.push(response.data);
            this.openedPanel = 0;
          }

          this.isLoading = false;
        });

    }
  },
  props: {
    contract: Object
  },
  data: () => ({
    isDownloading: false,
    infoDialog: false,
    openedPanel: undefined,
    allInvoices: undefined,
    loadingExport: false,
    showPanel: true,
    selectedInvoice: undefined,
    showDialogLoading: false,
    reasonList: [],
    showDialog: false,
    showSuccess: false,
    counts: [0, 0, 0],
    invoices: [],
    statuses: [],
    status: undefined,
    page: 0,
    isLoading: true,
    noResult: false,
    searchText: '',
  }),
  created: function () {

    this.reasonList = [this.$vuetify.lang.t('$vuetify.SEGUNDA_VIA'),
    this.$vuetify.lang.t('$vuetify.BAIXA_BOLETO'),
    this.$vuetify.lang.t('$vuetify.ALTERAR_VENCIMENTO')]

    this.$get('/nota/status')
      .then((response) => {

        this.statuses = response.data;

        var vm = this;
        this.statuses = this.statuses.map(function (t) {
          return { text: vm.$vuetify.lang.t('$vuetify.' + t), value: t }
        })

        this.statuses.sort()
        this.statuses.unshift({ text: this.$vuetify.lang.t('$vuetify.TODOS'), value: null })

      });

    this.$get('/nota/counts',
      { contractId: this.$props.contract.id }).then((response) => {

        if (response) {
          this.counts = response.data;
        }
        this.isLoading = false;
        this.$root.$emit('invoice-data', this.counts)
      });

    this.$get('/nota/busca',
      { contractId: this.$props.contract.id, searchText: '', paymentStatus: undefined, page: 0 })
      .then((response) => {
        this.invoices = response.data;
        this.isLoading = false;
      });

    this.$root.$on('search-invoice', (invoiceNumber) => {

      this.searchText = invoiceNumber;
      this.search(0, 0);
    })

    this.$root.$on('search-canceled-invoice', (invoiceNumber) => {
      this.searchCanceledInvoice(invoiceNumber);
    })
  }
};
</script>
