<template>
  <v-content>
    <v-container
      column
      align-center
      style="max-width:800px;"
    >

      <v-row
        class="mt-n12 ml-0 mb-6"
        :class="{'ml-n9':$vuetify.breakpoint.mdAndUp}"
      >
        <span class="mb-7 text-right subtitle-1 font-weight-bold grey--text text--darken-1">
          {{$vuetify.lang.t('$vuetify.CONTRATO_SELECIONADO') + ': '+selectedContract.numeroContratoTpz}} </span>
      </v-row>
      <v-col
        md="12"
        lg="12"
        xl="12"
        sm="12"
        xs="12"
        xm="12"
        class="mt-n11"
      >

        <v-lazy
          :options="{
          threshold: .6
        }"
          transition="slide-x-transition"
        >
          <v-row
            class="mb-6 ml-n1"
            :class="{'ml-n12':$vuetify.breakpoint.mdAndUp}"
            v-if="circuitData"
          >
            <v-col class="ma-0 pa-0 mr-3 flex-grow-0">
              <BarChart
                :chart-data="circuitData"
                :options="circuitOptions"
                :styles="circuitStyle"
              ></BarChart>
            </v-col>
            <v-col class="ma-0 pa-0 mr-3 flex-grow-0">
              <PieChart
                :chart-data="invoiceData"
                :options="invoiceOptions"
                :styles="invoiceStyle"
              ></PieChart>
            </v-col>
            <v-col class="ma-0 pa-0 flex-grow-0">
              <BarChart
                :chart-data="issueData"
                :options="issueOptions"
                :styles="issueStyle"
              ></BarChart>
            </v-col>
          </v-row>
        </v-lazy>

        <CircuitsPage :contract="selectedContract"></CircuitsPage>
        <InvoicesPage :contract="selectedContract"></InvoicesPage>
        <IssuesPage :contract="selectedContract"></IssuesPage>

      </v-col>
    </v-container>
  </v-content>
</template>

<script>

import CircuitsPage from './CircuitsPage';
import InvoicesPage from './InvoicesPage';
import IssuesPage from './IssuesPage';
import BarChart from '../components/charts/BarChart.js'
import PieChart from '../components/charts/PieChart.js'


export default {
  components: {
    CircuitsPage,
    InvoicesPage,
    IssuesPage,
    BarChart,
    PieChart
  },
  data: () => ({
    selectedContract: undefined,
    circuitData: undefined,
    invoiceData: undefined,
    issueData: undefined,
    circuitStyle: {      height: '210px', width: '260px',
      position: 'relative'    },
    invoiceStyle: {      height: '185px', width: '250px',
      position: 'relative'    },
    issueStyle: {      height: '195px', width: '260px',
      position: 'relative'    },
    circuitOptions: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        yAxes: [{
          ticks: {
            beginAtZero: true
          }
        }]
      },
      title: {
        display: true,
        text: ''
      }
    },
    invoiceOptions: {
      responsive: true,
      maintainAspectRatio: false,
      title: {
        display: true,
        text: ''
      }
    },
    issueOptions: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        yAxes: [{
          ticks: {
            beginAtZero: true
          }
        }]
      },
      title: {
        display: true,
        text: ''
      }
    },
  }),
  props: {
    contract: Object
  },
  created: function () {

    this.selectedContract = this.$props.contract;
    if (!this.selectedContract) {
      if (!window.sessionStorage.getItem('selectedContractId'))
        return;
      else
        this.selectedContract = {          id: window.sessionStorage.getItem('selectedContractId'),
          numeroContratoTpz: window.sessionStorage.getItem('selectedContractTpz')        }
    } else {
      window.sessionStorage.setItem('selectedContractId', this.selectedContract.id);
      window.sessionStorage.setItem('selectedContractTpz', this.selectedContract.numeroContratoTpz);
    }

    this.$root.$on('go-to', (target) => {

      var element = document.getElementById(target);

      this.$vuetify.goTo(element, {
        duration: 200,
        offset: 30,
        easing: 'linear',
      })
    })

    this.$root.$on('circuit-data', (circuitData) => {

      this.circuitOptions.title.text = this.$vuetify.lang.t('$vuetify.CIRCUITOS')
      this.circuitOptions.legend = { display: false }

      this.circuitData = {
        labels: ['Online', 'Offline', this.$vuetify.lang.t('$vuetify.ATIVADO'),
          this.$vuetify.lang.t('$vuetify.DESATIVADO'), this.$vuetify.lang.t('$vuetify.DESINSTALADO'),
          this.$vuetify.lang.t('$vuetify.CANCELADO')],
        datasets: [
          {

            backgroundColor: [
              'rgba(59, 190, 40, 0.4)',
              'rgba(245, 3, 3, 0.4)',
              'rgba(54, 162, 235, 0.4)',
              'rgba(255, 206, 86, 0.4)',
              'rgba(153, 102, 255, 0.4)',
              'rgba(255, 159, 64, 0.4)'
            ],
            borderColor: [
              'rgba(59, 190, 40, 1)',
              'rgba(245, 3, 3, 1)',
              'rgba(54, 162, 235, 1)',
              'rgba(255, 206, 86, 1)',
              'rgba(153, 102, 255, 1)',
              'rgba(255, 159, 64, 1)'
            ],
            borderWidth: 2,
            data: circuitData
          }
        ]
      }
    })

    this.$root.$on('invoice-data', (invoiceData) => {

      this.invoiceOptions.title.text = this.$vuetify.lang.t('$vuetify.NOTAS_FISCAIS')

      this.invoiceData = {
        labels: [this.$vuetify.lang.t('$vuetify.PAGO'), this.$vuetify.lang.t('$vuetify.EM_ABERTO')],
        datasets: [
          {

            backgroundColor: [
              'rgba(59, 190, 40, 0.4)',
              'rgba(255, 159, 64, 0.4)'

            ],
            borderColor: [
              'rgba(59, 190, 40, 1)',
              'rgba(255, 159, 64, 1)'
            ],
            borderWidth: 2,
            data: invoiceData
          }
        ]
      }
    })

    this.$root.$on('issue-data', (issueData) => {

      this.issueOptions.title.text = this.$vuetify.lang.t('$vuetify.CHAMADOS')
      this.issueOptions.legend = { display: false }

      this.issueData = {
        labels: [this.$vuetify.lang.t('$vuetify.EM_ABERTO'), this.$vuetify.lang.t('$vuetify.ENCERRADOS'),
        this.$vuetify.lang.t('$vuetify.EM_ANDAMENTO')],
        datasets: [
          {

            backgroundColor: [
              'rgba(59, 190, 40, 0.4)',
              'rgba(54, 162, 235, 0.4)',
              'rgba(255, 159, 64, 0.4)'
            ],
            borderColor: [
              'rgba(59, 190, 40, 1)',
              'rgba(54, 162, 235, 1)',
              'rgba(255, 159, 64, 1)'
            ],
            borderWidth: 2,
            data: issueData
          }
        ]
      }
    })
  }

};
</script>
