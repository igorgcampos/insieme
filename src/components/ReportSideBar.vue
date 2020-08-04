<template>

  <v-navigation-drawer
    :absolute="show"
    :fixed="!show"
    temporary
    right
    dark
    v-model="show"
    style="width:33rem; z-index:10000;"
  >

    <div
      style="background-color: #E53935; position:sticky; top: 0; z-index:1000;"
      dark
    >
      <v-list-item
        two-line
        dark
      >
        <v-list-item-content>
          <v-list-item-title>{{$vuetify.lang.t('$vuetify.RELATORIO')}}</v-list-item-title>
          <v-list-item-subtitle>{{$vuetify.lang.t('$vuetify.RELATORIO_DESCRICAO')}}</v-list-item-subtitle>
        </v-list-item-content>
        <v-btn
          icon
          color="white"
          @click="show = false; $showChatButton();"
        >
          <v-icon>mdi-close-circle</v-icon>
        </v-btn>
      </v-list-item>
    </div>

    <v-col
      style="background-color: #FFFFFF;"
      :style="{height: size + '%'}"
      class="pt-5"
    >
      <v-row class="mb-5 ml-3">
        <BarChart
          :chart-data="circuitDataOp"
          :options="circuitOptionsOp"
          :styles="circuitStyle"
        ></BarChart>

        <BarChart
          :chart-data="circuitDataLog"
          :options="circuitOptionsLog"
          :styles="circuitStyle"
        ></BarChart>
      </v-row>
      <v-row
        class="mt-12 pl-8"
        justify-center
        :class="{'ml-5':$vuetify.breakpoint.xs}"
      >
        <DoughnutChart
          :chart-data="invoiceData"
          :options="invoiceOptions"
          :styles="invoiceStyle"
        ></DoughnutChart>
      </v-row>
      <v-row class="mt-12 ml-3">
        <BarChart
          :chart-data="issueData"
          :options="issueOptions"
          :styles="issueStyle"
        ></BarChart>
      </v-row>
    </v-col>

  </v-navigation-drawer>
</template>

<script>

import BarChart from './charts/BarChart.js'
import DoughnutChart from './charts/DoughnutChart.js'

export default {
  components: {
    BarChart,
    DoughnutChart
  },
  data () {
    return {
      size: 120,
      show: null,
      circuitDataOp: undefined,
      circuitDataLog: undefined,
      invoiceData: undefined,
      issueData: undefined,
      circuitStyle: {
        height: '16rem',
      },
      invoiceStyle: {
        height: '20rem',
      },
      issueStyle: {
        height: '16rem',
      },
      circuitOptionsOp: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          yAxes: [{
            gridLines: { drawOnChartArea: false },
            ticks: {
              beginAtZero: true
            }
          }],
          xAxes: [{
            gridLines: { drawOnChartArea: false },
          }]
        },
        title: {
          display: true,
          text: '',
          fontSize: 16
        }
      },
      circuitOptionsLog: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          yAxes: [{
            gridLines: { drawOnChartArea: false },
            ticks: {
              beginAtZero: true
            }
          }],
          xAxes: [{
            gridLines: { drawOnChartArea: false },
          }]
        },
        title: {
          display: true,
          text: '',
          fontSize: 16
        }
      },
      invoiceOptions: {
        responsive: true,
        maintainAspectRatio: false,
        title: {
          display: true,
          text: '',
          fontSize: 16
        }
      },
      issueOptions: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          yAxes: [{
            gridLines: { drawOnChartArea: false },
            ticks: {
              beginAtZero: true
            }
          }],
          xAxes: [{
            gridLines: { drawOnChartArea: false },
          }]
        },
        title: {
          display: true,
          text: '',
          fontSize: 16
        }
      },
    }
  },
  watch: {
    show: function () {
      if (!this.show) {
        this.$showChatButton();
      }
    }
  },
  created: function () {

    this.size = this.$vuetify.breakpoint.xs ? 150 : 120

    this.circuitStyle.width = this.$vuetify.breakpoint.xs ? '20rem' : '15rem';
    this.circuitStyle.height = this.$vuetify.breakpoint.xs ? '16rem' : '12rem';
    this.invoiceStyle.width = this.$vuetify.breakpoint.xs ? '15rem' : '29rem';
    this.issueStyle.width = this.$vuetify.breakpoint.xs ? '20rem' : '29rem';

    this.$root.$on('report', () => this.show = !this.show)

    this.$root.$on('circuit-data', (circuitData) => {

      this.circuitOptionsOp.title.text = this.$vuetify.lang.t('$vuetify.STATUS_OPERACIONAL')
      this.circuitOptionsOp.legend = { display: false }
      this.circuitOptionsOp.title.fontSize = this.$vuetify.breakpoint.xs ? 16 : 12

      this.circuitDataOp = {
        labels: ['Online', 'Offline'],
        datasets: [
          {

            backgroundColor: [
              'rgba(75, 192, 192, 0.5)',
              'rgba(255, 99, 132,  0.5)',
            ],
            borderWidth: 2,
            data: circuitData
          }
        ]
      }

      this.circuitOptionsLog.title.text = this.$vuetify.lang.t('$vuetify.STATUS_LOGISTICA')
      this.circuitOptionsLog.legend = { display: false }
      this.circuitOptionsLog.title.fontSize = this.$vuetify.breakpoint.xs ? 16 : 12

      this.circuitDataLog = {
        labels: [this.$vuetify.lang.t('$vuetify.ATIVADO'),
        this.$vuetify.lang.t('$vuetify.DESATIVADO'), this.$vuetify.lang.t('$vuetify.DESINSTALADO'),
        this.$vuetify.lang.t('$vuetify.CANCELADO')],
        datasets: [
          {

            backgroundColor: [
              'rgba(255, 206, 86, 0.5)',
              'rgba(54, 162, 235, 0.5)',
              'rgba(153, 102, 255, 0.5)',
              'rgba(255, 159, 64, 0.5)'
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
        labels: [this.$vuetify.lang.t('$vuetify.PAGO'), this.$vuetify.lang.t('$vuetify.EM_ABERTO'),
        this.$vuetify.lang.t('$vuetify.VENCIDAS')],
        datasets: [
          {

            backgroundColor: [
              'rgba(59, 190, 40, 0.5)',
              'rgba(255, 159, 64, 0.5)',
              'rgba(255, 99, 132, 0.5)',
            ],
            borderColor: [
              'rgba(59, 190, 40, 0.9)',
              'rgba(255, 159, 64, 0.9)',
              'rgba(255, 99, 132, 0.9)',
            ],
            borderWidth: 1,
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
              'rgba(59, 190, 40, 0.5)',
              'rgba(54, 162, 235, 0.5)',
              'rgba(255, 159, 64, 0.5)'
            ],
            borderWidth: 2,
            data: issueData
          }
        ]
      }
    })
  },
};
</script>