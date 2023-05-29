<template>
  <div class="mb-10">
    <v-row id="circuits" :class="{ 'ml-n12': $vuetify.breakpoint.mdAndUp }">
      <span
        class="mb-7 text-right display-1 font-weight-bold grey--text text--darken-1"
      >
        {{ $vuetify.lang.t("$vuetify.CIRCUITOS") }}</span
      >
      <v-col>
        <v-tooltip bottom>
          <template v-slot:activator="{ on }">
            <v-btn
              icon
              color="grey--text text--darken-1"
              class="ml-1 mt-n2"
              @click="expandPanel()"
            >
              <v-icon v-on="on">{{
                showPanel
                  ? "mdi-arrow-up-drop-circle-outline"
                  : "mdi-arrow-down-drop-circle-outline"
              }}</v-icon>
            </v-btn>
          </template>
          <span>{{
            showPanel
              ? $vuetify.lang.t("$vuetify.ESCONDER")
              : $vuetify.lang.t("$vuetify.MOSTRAR")
          }}</span>
        </v-tooltip>
      </v-col>
    </v-row>

    <v-lazy
      :options="{
        threshold: 0.6,
      }"
      transition="slide-x-transition"
    >
      <div class="ma-0 pa-0" v-show="showPanel">
        <v-row class="mt-3">
          <v-col v-show="$vuetify.breakpoint.xs" class="mb-n3">
            <v-row v-show="!$hasProfile('Sem monitoramento')">
              <v-col cols="12">
                <v-row justify="center">
                  <span
                    class="mt-n3 text-center subtitle-1 font-weight-bold grey--text text--darken-1"
                  >
                    {{
                      $vuetify.lang.t("$vuetify.STATUS_OPERACIONAL_CAIXA_BAIXA")
                    }}</span
                  >
                </v-row>

                <v-row>
                  <v-col class="d-flex justify-center ml-0 mr-n7 pr-0">
                    <CountCard
                      :count="counts[0]"
                      message="Online"
                      color="success--text"
                      :func="getOnline"
                      :toolTipMessage="
                        $vuetify.lang.t('$vuetify.ONLINE_DESCRICAO')
                      "
                      :isLoading="isLoadingOnline"
                    ></CountCard>
                  </v-col>

                  <v-col class="d-flex justify-center ml-n7 pl-0">
                    <CountCard
                      :count="counts[1]"
                      message="Offline"
                      color="error--text"
                      :func="getOffline"
                      :toolTipMessage="
                        $vuetify.lang.t('$vuetify.OFFLINE_DESCRICAO')
                      "
                      :isLoading="isLoadingOffline"
                    ></CountCard>
                  </v-col>
                </v-row>
              </v-col>
            </v-row>

            <v-row>
              <v-col class="mr-0 ml-n0 pr-0 pl-0" cols="12">
                <v-row justify="center">
                  <span
                    class="mt-n3 text-center subtitle-1 font-weight-bold grey--text text--darken-1"
                  >
                    {{ $vuetify.lang.t("$vuetify.STATUS_LOGISTICA") }}</span
                  >
                </v-row>

                <v-sheet
                  class="ma-0 pa-0 ml-n3 mr-n3"
                  style="background: #fafafa"
                >
                  <v-slide-group
                    :v-model="null"
                    show-arrows
                    center-active
                    next-icon="mdi-arrow-right-thick primary--text"
                    prev-icon="mdi-arrow-left-thick primary--text"
                  >
                    <v-slide-item>
                      <v-col class="flex-grow-0">
                        <CountCard
                          :count="installCounts[7]"
                          :message="
                            $vuetify.lang.t('$vuetify.PROC_LOGISTICO_MOBILE')
                          "
                          color="primary--text"
                          :func="getLogistic"
                          :toolTipMessage="
                            $vuetify.lang.t('$vuetify.PROC_LOGISTICO_DESCRICAO')
                          "
                        ></CountCard>
                      </v-col>
                    </v-slide-item>

                    <v-slide-item>
                      <v-col class="flex-grow-0">
                        <CountCard
                          :count="installCounts[4]"
                          :message="
                            $vuetify.lang.t('$vuetify.AGUARDANDO_ACEITE_MOBILE')
                          "
                          color="primary--text"
                          :func="getInstalled"
                          :toolTipMessage="
                            $vuetify.lang.t('$vuetify.AGUARDANDO_DESCRICAO')
                          "
                        ></CountCard>
                      </v-col>
                    </v-slide-item>

                    <v-slide-item>
                      <v-col class="flex-grow-0">
                        <CountCard
                          :count="installCounts[5]"
                          :message="
                            $vuetify.lang.t('$vuetify.EM_TRANSPORTE_MOBILE')
                          "
                          color="primary--text"
                          :func="getInTransport"
                          :toolTipMessage="
                            $vuetify.lang.t('$vuetify.EM_TRANSPORTE_DESCRICAO')
                          "
                        ></CountCard>
                      </v-col>
                    </v-slide-item>

                    <v-slide-item>
                      <v-col class="flex-grow-0">
                        <CountCard
                          :count="installCounts[6]"
                          :message="$vuetify.lang.t('$vuetify.INSTALANDO')"
                          color="primary--text"
                          :func="getDeploying"
                          :toolTipMessage="
                            $vuetify.lang.t('$vuetify.INSTALANDO_DESCRICAO')
                          "
                        ></CountCard>
                      </v-col>
                    </v-slide-item>
                  </v-slide-group>
                </v-sheet>
              </v-col>
            </v-row>

            <v-row>
              <v-col class="mr-0 ml-n0 pr-0 pl-0" cols="12">
                <v-row justify="center">
                  <span
                    class="mt-n3 text-center subtitle-1 font-weight-bold grey--text text--darken-1"
                  >
                    {{
                      $vuetify.lang.t("$vuetify.STATUS_CONTRATACAO_CAIXA_BAIXA")
                    }}</span
                  >
                </v-row>

                <v-sheet
                  class="ma-0 pa-0 ml-n3 mr-n3"
                  style="background: #fafafa"
                >
                  <v-slide-group
                    :v-model="null"
                    show-arrows
                    center-active
                    next-icon="mdi-arrow-right-thick primary--text"
                    prev-icon="mdi-arrow-left-thick primary--text"
                  >
                    <v-slide-item>
                      <v-col class="flex-grow-0">
                        <CountCard
                          :count="installCounts[0]"
                          :message="$vuetify.lang.t('$vuetify.ATIVADO')"
                          color="primary--text"
                          :func="getActive"
                          :toolTipMessage="
                            $vuetify.lang.t('$vuetify.ATIVADO_DESCRICAO')
                          "
                        ></CountCard>
                      </v-col>
                    </v-slide-item>

                    <v-slide-item>
                      <v-col class="flex-grow-0">
                        <CountCard
                          :count="installCounts[1]"
                          :message="$vuetify.lang.t('$vuetify.DESATIVADO')"
                          color="primary--text"
                          :func="getDeactive"
                          :toolTipMessage="
                            $vuetify.lang.t('$vuetify.DESATIVADO_DESCRICAO')
                          "
                        ></CountCard>
                      </v-col>
                    </v-slide-item>

                    <v-slide-item>
                      <v-col class="flex-grow-0">
                        <CountCard
                          :count="installCounts[3]"
                          :message="$vuetify.lang.t('$vuetify.DESINSTALADO')"
                          color="primary--text"
                          :func="getUninstall"
                          :toolTipMessage="
                            $vuetify.lang.t('$vuetify.DESINSTALADO_DESCRICAO')
                          "
                        ></CountCard>
                      </v-col>
                    </v-slide-item>

                    <v-slide-item>
                      <v-col class="flex-grow-0">
                        <CountCard
                          :count="installCounts[2]"
                          :message="$vuetify.lang.t('$vuetify.CANCELADO')"
                          color="primary--text"
                          :func="getCanceled"
                          :toolTipMessage="
                            $vuetify.lang.t('$vuetify.CANCELADO_DESCRICAO')
                          "
                        ></CountCard>
                      </v-col>
                    </v-slide-item>
                    <v-slide-item>
                      <v-col class="flex-grow-0">
                        <CountCard
                          :count="installCounts[8]"
                          :message="$vuetify.lang.t('$vuetify.SUSPENSO')"
                          color="primary--text"
                          :func="getSuspended"
                          :toolTipMessage="
                            $vuetify.lang.t('$vuetify.SUSPENSO_DESCRICAO')
                          "
                        ></CountCard>
                      </v-col>
                    </v-slide-item>
                  </v-slide-group>
                </v-sheet>
              </v-col>
            </v-row>
          </v-col>

          <v-row v-show="!$vuetify.breakpoint.xs">
            <v-col
              class="ml-0"
              cols="4"
              v-if="!$hasProfile('Sem monitoramento')"
            >
              <v-row justify="center">
                <span
                  class="mt-n3 text-center caption font-weight-bold grey--text text--darken-2"
                >
                  {{ $vuetify.lang.t("$vuetify.STATUS_OPERACIONAL") }}</span
                >
              </v-row>

              <v-row class="mt-2" justify="center">
                <v-col class="flex-grow-0">
                  <CountCard
                    :count="counts[0]"
                    message="Online"
                    color="success--text"
                    :func="getOnline"
                    :toolTipMessage="
                      $vuetify.lang.t('$vuetify.ONLINE_DESCRICAO')
                    "
                    :isLoading="isLoadingOnline"
                  ></CountCard>
                </v-col>

                <v-col
                  class="flex-grow-0"
                  :class="{ 'ml-n4': $vuetify.breakpoint.sm }"
                >
                  <CountCard
                    :count="counts[1]"
                    message="Offline"
                    color="error--text"
                    :func="getOffline"
                    :toolTipMessage="
                      $vuetify.lang.t('$vuetify.OFFLINE_DESCRICAO')
                    "
                    :isLoading="isLoadingOffline"
                  ></CountCard>
                </v-col>
              </v-row>
            </v-col>

            <v-divider
              class="mb-5 mt-n2 ml-n4"
              :vertical="true"
              v-show="!$hasProfile('Sem monitoramento')"
            ></v-divider>

            <v-row>
              <v-col cols="12" class="mt-n1">
                <v-row justify="center">
                  <v-btn-toggle
                    v-model="button"
                    color="grey--text text--darken-3"
                    class="mb-1"
                  >
                    <v-btn
                      value="contract"
                      class="mt-n3 text-center caption font-weight-bold"
                      small
                      :style="{ 'text-decoration': contractDecoration }"
                    >
                      {{
                        $vuetify.lang.t("$vuetify.STATUS_CONTRATACAO")
                      }}</v-btn
                    >
                    <v-btn
                      value="log"
                      class="mt-n3 text-center caption font-weight-bold"
                      small
                      :style="{ 'text-decoration': logDecoration }"
                    >
                      {{ $vuetify.lang.t("$vuetify.STATUS_LOGISTICA") }}
                    </v-btn>
                  </v-btn-toggle>
                </v-row>

                <v-row justify="center">
                  <v-sheet
                    class="ma-0 pa-0"
                    style="background: #fafafa"
                    v-if="button == 'contract'"
                  >
                    <v-slide-group
                      :v-model="null"
                      :show-arrows="
                        !$vuetify.breakpoint.lg || !$vuetify.breakpoint.xl
                      "
                      center-active
                      next-icon="mdi-arrow-right-thick primary--text"
                      prev-icon="mdi-arrow-left-thick primary--text"
                    >
                      <v-slide-item>
                        <v-col class="flex-grow-0">
                          <CountCard
                            :count="installCounts[0]"
                            :message="$vuetify.lang.t('$vuetify.ATIVADO')"
                            color="primary--text"
                            :func="getActive"
                            :toolTipMessage="
                              $vuetify.lang.t('$vuetify.ATIVADO_DESCRICAO')
                            "
                            :isLoading="installCounts[0] == -1"
                          ></CountCard>
                        </v-col>
                      </v-slide-item>
                      <v-slide-item>
                        <v-col class="flex-grow-0">
                          <CountCard
                            :count="installCounts[1]"
                            :message="$vuetify.lang.t('$vuetify.DESATIVADO')"
                            color="primary--text"
                            :func="getDeactive"
                            :toolTipMessage="
                              $vuetify.lang.t('$vuetify.DESATIVADO_DESCRICAO')
                            "
                            :isLoading="installCounts[1] == -1"
                          >
                          </CountCard>
                        </v-col>
                      </v-slide-item>
                      <v-slide-item>
                        <v-col class="flex-grow-0">
                          <CountCard
                            :count="installCounts[3]"
                            :message="$vuetify.lang.t('$vuetify.DESINSTALADO')"
                            color="primary--text"
                            :func="getUninstall"
                            :toolTipMessage="
                              $vuetify.lang.t('$vuetify.DESINSTALADO_DESCRICAO')
                            "
                            :isLoading="installCounts[3] == -1"
                          ></CountCard>
                        </v-col>
                      </v-slide-item>
                      <v-slide-item>
                        <v-col class="flex-grow-0">
                          <CountCard
                            :count="installCounts[2]"
                            :message="$vuetify.lang.t('$vuetify.CANCELADO')"
                            color="primary--text"
                            :func="getCanceled"
                            :toolTipMessage="
                              $vuetify.lang.t('$vuetify.CANCELADO_DESCRICAO')
                            "
                            :isLoading="installCounts[2] == -1"
                          ></CountCard>
                        </v-col>
                      </v-slide-item>
                      <v-slide-item>
                        <v-col class="flex-grow-0">
                          <CountCard
                            :count="installCounts[8]"
                            :message="$vuetify.lang.t('$vuetify.SUSPENSO')"
                            color="primary--text"
                            :func="getSuspended"
                            :toolTipMessage="
                              $vuetify.lang.t('$vuetify.SUSPENSO_DESCRICAO')
                            "
                            :isLoading="installCounts[8] == -1"
                          ></CountCard>
                        </v-col>
                      </v-slide-item>
                    </v-slide-group>
                  </v-sheet>
                </v-row>

                <v-row class="ml-2" justify="center" v-show="button == 'log'">
                  <v-col class="flex-grow-0">
                    <CountCard
                      :count="installCounts[7]"
                      :message="$vuetify.lang.t('$vuetify.PROC_LOGISTICO')"
                      color="primary--text"
                      :func="getLogistic"
                      :toolTipMessage="
                        $vuetify.lang.t('$vuetify.PROC_LOGISTICO_DESCRICAO')
                      "
                      :isLoading="installCounts[7] == -1"
                    ></CountCard>
                  </v-col>

                  <v-col class="flex-grow-0">
                    <CountCard
                      :count="installCounts[5]"
                      :message="$vuetify.lang.t('$vuetify.EM_TRANSPORTE')"
                      color="primary--text"
                      :func="getInTransport"
                      :toolTipMessage="
                        $vuetify.lang.t('$vuetify.EM_TRANSPORTE_DESCRICAO')
                      "
                      :class="{ 'ml-n4': $vuetify.breakpoint.sm }"
                      :isLoading="installCounts[5] == -1"
                    ></CountCard>
                  </v-col>

                  <v-col class="flex-grow-0">
                    <CountCard
                      :count="installCounts[6]"
                      :message="$vuetify.lang.t('$vuetify.INSTALANDO')"
                      color="primary--text"
                      :func="getDeploying"
                      :toolTipMessage="
                        $vuetify.lang.t('$vuetify.INSTALANDO_DESCRICAO')
                      "
                      :class="{ 'ml-n4': $vuetify.breakpoint.sm }"
                      :isLoading="installCounts[6] == -1"
                    ></CountCard>
                  </v-col>

                  <v-col class="flex-grow-0">
                    <CountCard
                      :count="installCounts[4]"
                      :message="$vuetify.lang.t('$vuetify.AGUARDANDO_ACEITE')"
                      color="primary--text"
                      :func="getInstalled"
                      :smallText="true"
                      :toolTipMessage="
                        $vuetify.lang.t('$vuetify.AGUARDANDO_DESCRICAO')
                      "
                      :class="{ 'ml-n4': $vuetify.breakpoint.sm }"
                      :isLoading="installCounts[4] == -1"
                    ></CountCard>
                  </v-col>
                </v-row>
              </v-col>
            </v-row>
          </v-row>
        </v-row>

        <v-row id="filtro" class="pl-0 ml-2 grey lighten-5 mb-n5 mt-0">
          <v-col cols="3">
            <v-row>
              <span
                class="text-right subtitle-2 font-weight-bold grey--text text--lighten-1"
              >
                {{ $vuetify.lang.t("$vuetify.BUSCAR") }}:</span
              >
            </v-row>
            <v-row md="2">
              <v-text-field
                v-model.trim="searchText"
                dense
                label="Regular"
                :placeholder="
                  $vuetify.lang.t('$vuetify.DESIGNACAO_CLIENTE_TPZ')
                "
                single-line
                solo
                max-width="200"
                append-icon="mdi-magnify"
                @click:append="
                  status = 0;
                  installStatus = 0;
                  search();
                "
                @keypress.enter="
                  status = 0;
                  installStatus = 0;
                  search();
                "
              ></v-text-field>
            </v-row>
          </v-col>

          <v-col class="ml-5" cols="3" v-if="$hasProfile('Administrador')">
            <v-row>
              <span
                class="text-right subtitle-2 font-weight-bold grey--text text--lighten-1"
              >
                {{ $vuetify.lang.t("$vuetify.PRODUTO") }}:</span
              >
            </v-row>
            <v-row>
              <v-select
                :items="products"
                v-model="product"
                :label="$vuetify.lang.t('$vuetify.TODOS')"
                solo
                dense
                @change="
                  status = 0;
                  installStatus = 0;
                  search();
                "
              ></v-select>
            </v-row>
          </v-col>

          <v-col class="ml-5" cols="3">
            <v-row>
              <span
                class="text-right subtitle-2 font-weight-bold grey--text text--lighten-1"
              >
                {{ $vuetify.lang.t("$vuetify.TECNOLOGIA") }}:</span
              >
            </v-row>
            <v-row>
              <v-select
                :items="technologies"
                v-model="technology"
                :label="$vuetify.lang.t('$vuetify.TODOS')"
                solo
                dense
                @change="
                  status = 0;
                  installStatus = 0;
                  search();
                "
              ></v-select>
            </v-row>
          </v-col>

          <v-col class="mt-5" cols="1" v-if="!$vuetify.breakpoint.xs">
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
              <span>{{
                $vuetify.lang.t("$vuetify.EXPORTAR_CSV_CIRCUITO")
              }}</span>
            </v-tooltip>
          </v-col>
        </v-row>

        <v-row class="pl-2 mt-2" style="min-height: 120px">
          <v-col
            id="circuitId"
            class="pr-2 overflow-y-auto overflow-x-hidden"
            v-scroll:#circuitId="searchMore"
            style="max-height: 360px; width: 100%"
          >
            <v-expansion-panels class="ma-1" v-model="openedPanel">
              <v-expansion-panel
                v-for="(circuit, i) in circuits"
                :key="i"
                hide-actions
              >
                <v-expansion-panel-header v-slot="{ open }" class="pt-0 pb-0">
                  <v-row align="center" no-gutters>
                    <v-col v-if="!open" cols="4" sm="2">
                      <v-chip
                        :color="
                          circuit.tecnologia != 'VSAT' &&
                          circuit.tecnologia &&
                          !circuit.tecnologia.includes('BGAN')
                            ? 'grey'
                            : circuit.online == 3
                            ? 'success'
                            : 'error'
                        "
                        class="ml-0 mr-2"
                        label
                        small
                        outlined
                      >
                        {{
                          circuit.tecnologia != "VSAT" &&
                          circuit.tecnologia &&
                          !circuit.tecnologia.includes("BGAN")
                            ? "N/A"
                            : circuit.online == 3
                            ? "Online"
                            : "Offline"
                        }}
                      </v-chip>
                    </v-col>

                    <v-col
                      v-show="!$vuetify.breakpoint.xs"
                      cols="4"
                      :class="{ 'col-sm-10': open, 'col-md-10': open }"
                      class="ml-n2"
                    >
                      <strong
                        class="font-weight-bold grey--text text--lighten-1 mr-2"
                      >
                        {{
                          $vuetify.lang.t("$vuetify.DESIGNACAO_CLIENTE")
                        }}:</strong
                      >
                      <strong
                        class="subtitle-2 font-weight-bold"
                        v-html="circuit.designacaoCliente || '--'"
                      ></strong>
                    </v-col>

                    <v-col
                      v-show="!$vuetify.breakpoint.xs"
                      v-if="!open"
                      cols="4"
                      :class="{ 'col-sm-10': open, 'col-md-10': open }"
                    >
                      <strong
                        class="font-weight-bold grey--text text--lighten-1 mr-2"
                      >
                        {{
                          $vuetify.lang.t("$vuetify.DESIGNACAO_TPZ")
                        }}:</strong
                      >
                      <strong
                        class="subtitle-2 font-weight-bold"
                        v-html="circuit.nome || '--'"
                      ></strong>
                    </v-col>

                    <v-col
                      v-show="!$vuetify.breakpoint.xs"
                      cols="2"
                      v-if="!open"
                    >
                      <strong
                        class="font-weight-bold grey--text text--lighten-1 mr-2"
                      >
                        IP:</strong
                      >
                      <strong
                        class="font-weight-bold"
                        v-html="circuit.ip || '--'"
                      ></strong>
                    </v-col>

                    <v-col
                      v-show="$vuetify.breakpoint.xs"
                      class="ml-3 mt-2 mb-2"
                    >
                      <v-row sm="5" md="6" :class="{ 'ml-n3': open }">
                        <strong
                          class="caption font-weight-bold grey--text text--lighten-1 mr-2"
                        >
                          {{
                            $vuetify.lang.t("$vuetify.DESIGNACAO_CLIENTE")
                          }}:</strong
                        >
                        <strong
                          class="caption font-weight-bold"
                          v-html="
                            circuit.designacaoClient
                              ? circuit.designacaoCliente.toLowerCase()
                              : '--'
                          "
                        ></strong>
                      </v-row>

                      <v-row sm="5" md="3" v-if="!open">
                        <strong
                          class="caption font-weight-bold grey--text text--lighten-1 mr-2"
                        >
                          {{
                            $vuetify.lang.t("$vuetify.DESIGNACAO_TPZ")
                          }}</strong
                        >
                        <strong
                          class="caption font-weight-bold"
                          v-html="circuit.nome || '--'"
                        ></strong>
                      </v-row>
                    </v-col>
                  </v-row>
                </v-expansion-panel-header>

                <v-expansion-panel-content>
                  <v-card-subtitle
                    class="caption mt-n10 ml-n6 mb-2 grey--text text--lighten-1"
                  >
                    {{ $vuetify.lang.t("$vuetify.DESIGNACAO_TPZ") }}:
                    {{ circuit.nome }}
                  </v-card-subtitle>
                  <v-row>
                    <v-col
                      class="mt-n6 mr-5"
                      :cols="$vuetify.breakpoint.xs ? 5 : 2"
                    >
                      <v-col class="pa-0">
                        <v-chip
                          :color="
                            circuit.tecnologia != 'VSAT' &&
                            circuit.tecnologia &&
                            !circuit.tecnologia.includes('BGAN')
                              ? 'grey'
                              : circuit.online == 3
                              ? 'success'
                              : 'error'
                          "
                          class="ml-0 mr-2"
                          label
                          small
                          outlined
                        >
                          {{
                            circuit.tecnologia != "VSAT" &&
                            circuit.tecnologia &&
                            !circuit.tecnologia.includes("BGAN")
                              ? "N/A"
                              : circuit.online == 3
                              ? "Online"
                              : "Offline"
                          }}
                        </v-chip>
                      </v-col>

                      <v-col class="pa-0 mt-3">
                        <v-chip
                          color="primary"
                          class="ml-0 mr-2"
                          label
                          small
                          outlined
                          v-if="circuit.statusInstalacao"
                        >
                          {{
                            $vuetify.lang.t(
                              "$vuetify." + circuit.statusInstalacao
                            )
                          }}
                        </v-chip>
                      </v-col>

                      <v-col class="pa-0 mt-3">
                        <v-chip
                          color="blue-grey"
                          class="ml-0 mr-2"
                          label
                          small
                          outlined
                          v-if="
                            circuit.proatividade ||
                            $props.contract.suporte == 'Proativo'
                          "
                        >
                          {{ $vuetify.lang.t("$vuetify.PROATIVO") }}
                        </v-chip>
                      </v-col>
                    </v-col>

                    <v-col
                      class="mt-n12"
                      :class="{ 'col-6': $vuetify.breakpoint.xs }"
                    >
                      <v-col class="pl-0">
                        <LabelValue
                          label="IP"
                          :value="circuit.ip || '--'"
                          justify="start"
                        ></LabelValue>
                      </v-col>
                      <v-col class="pt-0 mt-n6 pl-0 pr-0">
                        <LabelValue
                          :label="$vuetify.lang.t('$vuetify.DATA_INSTALACAO')"
                          :value="formatDate(circuit.dataInstalacao)"
                          justify="start"
                        ></LabelValue>
                      </v-col>
                      <v-col class="pt-0 mt-n6 pl-0 pr-0">
                        <LabelValue
                          :label="$vuetify.lang.t('$vuetify.DATA_ATIVACAO')"
                          :value="formatDate(circuit.dataInstalacao)"
                          justify="start"
                          truncate
                        ></LabelValue>
                      </v-col>
                    </v-col>

                    <v-col
                      class="mt-n12"
                      :class="{
                        'col-6': $vuetify.breakpoint.xs,
                        'ml-n12': !$vuetify.breakpoint.xs,
                      }"
                    >
                      <v-col>
                        <LabelValue
                          :label="$vuetify.lang.t('$vuetify.ENDERECO')"
                          :value="getAddress(circuit)"
                          justify="start"
                          truncate
                          :class="{ 'col-2': $vuetify.breakpoint.xs }"
                          style="max-width: 150px"
                        ></LabelValue>
                      </v-col>
                      <v-col class="pt-0 mt-n6">
                        <LabelValue
                          :label="$vuetify.lang.t('$vuetify.LATITUDE')"
                          :value="
                            circuit.latitude
                              ? circuit.latitude.toFixed(4)
                              : '--'
                          "
                          justify="start"
                        ></LabelValue>
                      </v-col>
                      <v-col class="pt-0 mt-n6">
                        <LabelValue
                          :label="$vuetify.lang.t('$vuetify.LONGITUDE')"
                          :value="
                            circuit.longitude
                              ? circuit.longitude.toFixed(4)
                              : '--'
                          "
                          justify="start"
                        ></LabelValue>
                      </v-col>
                    </v-col>

                    <v-col
                      class="mt-n12"
                      :class="{ 'col-6': $vuetify.breakpoint.xs }"
                    >
                      <v-col>
                        <LabelValue
                          :label="$vuetify.lang.t('$vuetify.PRODUTO')"
                          :value="circuit.plataformaSat || '--'"
                          justify="start"
                          truncate
                          style="width: 150px"
                        ></LabelValue>
                      </v-col>
                      <v-col class="pt-0 mt-n6">
                        <LabelValue
                          label="Tecnologia"
                          :value="
                            circuit.tecnologia
                              ? circuit.tecnologia + '/' + circuit.banda
                              : '--'
                          "
                          justify="start"
                          style="width: 150px"
                        ></LabelValue>
                      </v-col>
                      <v-col class="pt-0 mt-n6">
                        <LabelValue
                          label="Esno"
                          :value="circuit.esno || '--'"
                          justify="start"
                          style="width: 150px"
                        ></LabelValue>
                      </v-col>
                    </v-col>

                    <v-col
                      v-if="circuit.nome.includes('-BG')"
                      class="mt-n12"
                      :class="{ 'col-6': $vuetify.breakpoint.xs }"
                    >
                      <v-col>
                        <LabelValue
                          :label="$vuetify.lang.t('$vuetify.LATENCIA_MINIMA')"
                          :value="
                            circuit.latenciaMinima
                              ? circuit.latenciaMinima + ' ms'
                              : '--'
                          "
                          justify="start"
                          truncate
                          style="width: 150px"
                        ></LabelValue>
                      </v-col>

                      <v-col class="pt-0 mt-n6">
                        <LabelValue
                          :label="$vuetify.lang.t('$vuetify.LATENCIA_MEDIA')"
                          :value="
                            circuit.latenciaMedia
                              ? circuit.latenciaMedia + ' ms'
                              : '--'
                          "
                          justify="start"
                          truncate
                          style="width: 150px"
                        ></LabelValue>
                      </v-col>

                      <v-col class="pt-0 mt-n6">
                        <LabelValue
                          :label="$vuetify.lang.t('$vuetify.LATENCIA_MAXIMA')"
                          :value="
                            circuit.latenciaMaxima
                              ? circuit.latenciaMaxima + ' ms'
                              : '--'
                          "
                          justify="start"
                          truncate
                          style="width: 150px"
                        ></LabelValue>
                      </v-col>
                    </v-col>
                  </v-row>

                  <v-divider
                    v-if="circuit.statusInstalacao == 'ATIVADO'"
                    class="mt-n3"
                  ></v-divider>

                  <v-card-actions class="mb-n2 pb-0">
                    <TooltipButton
                      :label="$vuetify.lang.t('$vuetify.RESOLVER_PROBLEMA')"
                      :message="$vuetify.lang.t('$vuetify.SUPORTE_PROBLEMA')"
                      :event="
                        circuit.tecnologia == 'VSAT' ? solveProblem : openIssue
                      "
                      :object="circuit"
                      :mobile="$vuetify.breakpoint.xs"
                      :isText="true"
                      v-if="
                        !isRestartingCircuit(circuit) &&
                        circuit.statusInstalacao == 'ATIVADO' &&
                        !$hasProfile('Sem monitoramento')
                      "
                    ></TooltipButton>

                    <TooltipButton
                      :label="$vuetify.lang.t('$vuetify.REINICIANDO')"
                      :mobile="$vuetify.breakpoint.xs"
                      :isText="true"
                      v-if="isRestartingCircuit(circuit)"
                      :disabled="true"
                    ></TooltipButton>

                    <TooltipButton
                      :label="$vuetify.lang.t('$vuetify.MAIS_DETALHES')"
                      :message="$vuetify.lang.t('$vuetify.VER_DETALHES_PRTG')"
                      :event="openPRTG"
                      :object="circuit"
                      :mobile="$vuetify.breakpoint.xs"
                      v-if="circuit.idPrtg && prtgToken"
                      :isText="true"
                    ></TooltipButton>
                  </v-card-actions>
                </v-expansion-panel-content>
              </v-expansion-panel>
            </v-expansion-panels>
          </v-col>
        </v-row>

        <v-row
          justify="center"
          v-if="circuits.length == 0 && !isLoading && !isLoadingStatus"
          class="mt-n12"
        >
          <v-lazy :options="{ threshold: 0.6 }" transition="slide-x-transition">
            <WarningPanel
              class="mt-n12"
              :message="$vuetify.lang.t('$vuetify.NENHUM_CIRCUITO')"
            >
            </WarningPanel>
          </v-lazy>
        </v-row>

        <v-row
          justify="center"
          class="mt-n12"
          v-if="circuits.length == 0 && (isLoading || isLoadingStatus)"
        >
          <v-progress-circular
            :size="30"
            :width="3"
            color="red"
            indeterminate
            class="mb-n1"
          ></v-progress-circular>
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

        <SolveProblemDialog
          :showDialog="showProblemSolveDialog"
          :close="closeProblemSolveDialog"
          :getObject="getObject"
          :openIssue="openIssue"
        ></SolveProblemDialog>

        <RestartsSideBar
          :circuits="restartingCircuits"
          :showRestarts="showRestarts"
          :buttonEvent="showHideRestarts"
          :contract="contract"
        ></RestartsSideBar>
      </div>
    </v-lazy>
  </div>
</template>

<script>
import CountCard from "../components/cards/CountCard";
import WarningPanel from "../components/panels/WarningPanel";
import TooltipButton from "../components/TooltipButton";
import LabelValue from "../components/LabelValue";
import IssueDialog from "../components/dialogs/IssueDialog";
import SolveProblemDialog from "../components/dialogs/SolveProblemDialog";
import RestartsSideBar from "../components/RestartsSideBar";

export default {
  components: {
    CountCard,
    WarningPanel,
    TooltipButton,
    LabelValue,
    IssueDialog,
    SolveProblemDialog,
    RestartsSideBar,
  },
  methods: {
    showHideRestarts() {
      this.showRestarts = !this.showRestarts;
    },
    isRestartingCircuit(circuit) {
      for (var index in this.restartingCircuits) {
        if (this.restartingCircuits[index].nome == circuit.nome) {
          return true;
        }
      }

      return false;
    },
    closeRestartIssue(close) {
      if (!this.selectedIssue || !close) {
        return;
      }

      this.selectedIssue.motivoEncerramento = "Meu problema foi resolvido";
      this.selectedIssue.observacaoEncerramento =
        "O robô conseguiu reiniciar o circuito do cliente com sucesso!";
      this.selectedIssue.statusProcessamento = "Concluído";

      this.$put("/chamado/close", this.selectedIssue).then((response) => {
        this.$root.$emit("close-issue-success", response.data);
        this.selectedIssue = undefined;
        this.showSuccess = false;
      });
    },
    openPRTG(circuit) {
      this.$getUser().then((user) => {
        window.open(
          "https://monitor.telespazio.com.br/device.htm?id=" +
            circuit.idPrtg +
            "&tabid=1&username=" +
            user.apelido +
            "&passhash=" +
            user.prtgToken
        );

        this.$saveOperation({ tipo: "LINK_PRTG", usuario: user });
      });
    },
    formatCircuit(circuit) {
      return {
        [this.$vuetify.lang.t("$vuetify.DESIGNACAO_TPZ")]: circuit.nome,
        [this.$vuetify.lang.t("$vuetify.COD_TPZ")]: circuit.numeroContratoTpz,
        [this.$vuetify.lang.t("$vuetify.COD_SAP")]: circuit.numeroContratoSap,
        [this.$vuetify.lang.t("$vuetify.DESIGNACAO_CLIENTE")]:
          circuit.designacaoCliente
            ? circuit.designacaoCliente
                .replaceAll("\n", " ")
                .replaceAll("\r", " ")
            : "--",
        [this.$vuetify.lang.t("$vuetify.DATA_ATIVACAO")]: this.formatDate(
          circuit.dataInstalacao
        ),
        [this.$vuetify.lang.t("$vuetify.STATUS_INSTALACAO")]:
          circuit.statusInstalacao
            ? this.$vuetify.lang.t("$vuetify." + circuit.statusInstalacao)
            : "--",
        [this.$vuetify.lang.t("$vuetify.DATA_INSTALACAO")]: this.formatDate(
          circuit.dataInstalacao
        ),
        [this.$vuetify.lang.t("$vuetify.ENDERECO")]: this.getAddress(circuit),
        ip: circuit.ip || "--",
        Online: circuit.online == 3 ? "ONLINE" : "OFFLINE",
        [this.$vuetify.lang.t("$vuetify.LATITUDE")]: circuit.latitude || "--",
        [this.$vuetify.lang.t("$vuetify.LONGITUDE")]: circuit.longitude || "--",
        esno: circuit.esno || "--",
        [this.$vuetify.lang.t("$vuetify.PLATAFORMA_SAT")]:
          circuit.plataformaSat || "--",
        "Id VSAT": circuit.vsatId || "--",
        hub: circuit.hub || "--",
      };
    },
    exportCSV() {
      this.loadingExport = true;
      if (!this.allCircuits) {
        this.$get("/circuito/all", {
          contractNumber: this.$props.contract.numeroContratoTpz,
        }).then((response) => {
          this.allCircuits = response.data.map((circuit) => {
            return this.formatCircuit(circuit);
          });

          this.$downloadCSV(
            this.allCircuits,
            this.$vuetify.lang.t("$vuetify.CIRCUITOS")
          );
          this.loadingExport = false;
        });
      } else {
        this.$downloadCSV(
          this.allCircuits,
          this.$vuetify.lang.t("$vuetify.CIRCUITOS")
        );
        this.loadingExport = false;
      }
    },
    closeProblemSolveDialog() {
      this.showProblemSolveDialog = false;
      this.selectedIssue = undefined;
    },
    closeDialog() {
      this.showDialog = false;
      this.showDialogLoading = false;
      this.selectedIssue = undefined;

      setTimeout(() => {
        this.showSuccess = false;
      }, 1000);
    },
    sendIssue(issue, circuit, close) {
      if (!issue.reason || !issue.observation) {
        return;
      }

      this.showDialogLoading = true;

      issue = {
        origem: "CIRCUITO",
        identificadorOrigem: circuit.nome,
        identificadorOrigemSecundario: circuit.designacaoCliente,
        motivoAbertura: issue.reason,
        observacaoAbertura: issue.observation,
        contrato: { id: this.$props.contract.id },
        status: issue.status ? issue.status : undefined,
      };

      this.$post("/chamado/create", issue).then((response) => {
        if (response.data) {
          this.showSuccess = true;
          this.showDialogLoading = false;
          this.$root.$emit("new-issue", response.data, circuit);
          circuit.protocolo = response.data.protocolo;
          this.selectedIssue = response.data;

          if (close) {
            this.$root.$emit("close-issue", response.data);
          }
        }
      });
    },
    getActive() {
      this.getFromStatusInstall(1);
    },
    getDeactive() {
      this.getFromStatusInstall(2);
    },
    getUninstall() {
      this.getFromStatusInstall(3);
    },
    getCanceled() {
      this.getFromStatusInstall(4);
    },
    getInstalled() {
      this.getFromStatusInstall(5);
    },
    getInTransport() {
      this.getFromStatusInstall(6);
    },
    getDeploying() {
      this.getFromStatusInstall(7);
    },
    getLogistic() {
      this.getFromStatusInstall(8);
    },
    getSuspended() {
      this.getFromStatusInstall(9);
    },
    getFromStatusInstall(status) {
      if (this.isLoading) {
        return;
      }

      this.searchText = "";
      this.page = 0;
      this.isLoading = true;
      this.status = this.statuses[0];
      this.circuits = [];
      this.product = this.products[0];
      this.technology = this.technologies[0];
      this.installStatus = status;

      this.$get("/circuito/busca", {
        contractNumber: this.$props.contract.numeroContratoTpz,
        searchText: this.searchText,
        onlineStatus: 0,
        installStatus: this.installStatus,
        productType: null,
        techType: null,
        page: 0,
      }).then((response) => {
        if (response && response.data.length == 0) {
          this.noResult = true;
        } else {
          this.noResult = false;
        }

        this.circuits = response.data;
        this.isLoading = false;
      });
    },
    getAddress(circuit) {
      return (
        (circuit.endereco ? circuit.endereco.replaceAll(";", " ") : "") +
        " " +
        (circuit.bairro ? circuit.bairro : "") +
        " " +
        (circuit.cidade ? circuit.cidade : "") +
        ", " +
        (circuit.uf ? circuit.uf : "")
          .replaceAll("\n", " ")
          .replaceAll("\r", " ")
          .trim()
      );
    },
    getOnline() {
      this.getFromStatus(1);
    },
    getOffline() {
      this.getFromStatus(2);
    },
    getFromStatus(onlineStatus) {
      if (this.isLoading) {
        return;
      }

      this.searchText = "";
      this.page = 0;
      this.isLoading = true;
      this.status = this.statuses[onlineStatus];
      this.circuits = [];
      this.product = this.products[0];
      this.technology = this.technologies[0];

      this.$get("/circuito/busca", {
        contractNumber: this.$props.contract.numeroContratoTpz,
        searchText: this.searchText,
        onlineStatus: onlineStatus,
        installStatus: 0,
        productType: null,
        techType: null,
        page: 0,
      }).then((response) => {
        if (response && response.data.length == 0) {
          this.noResult = true;
        } else {
          this.noResult = false;
        }

        this.circuits = response.data;
        this.isLoading = false;
      });
    },
    openIssue(circuit) {
      this.selectedCircuit = circuit;
      this.selectedCircuit.type = "circuit";
      this.showDialog = true;

      if (this.selectedIssue) {
        this.showSuccess = true;
      }
    },
    getObject() {
      return this.selectedCircuit;
    },
    solveProblem(circuit) {
      this.selectedCircuit = circuit;
      this.showProblemSolveDialog = true;
    },
    formatDate(date) {
      if (!date) {
        return "--";
      }
      return this.$formatDate(date);
    },
    searchMore() {
      if (this.isLoding || this.noResult) {
        return;
      }

      if (
        document.getElementById("circuitId").scrollTop + 361 >=
        document.getElementById("circuitId").scrollHeight
      ) {
        this.page++;
        this.search(this.page);
      }
    },
    search(page, selectCircuitIndex) {
      this.isLoading = true;

      if (!page) {
        this.page = 0;
        this.noResult = false;
      }

      var selectedStatus = 0;
      if (this.status == this.statuses[0]) {
        selectedStatus = 0;
      } else if (this.status == this.statuses[1]) {
        selectedStatus = 1;
      } else if (this.status == this.statuses[2]) {
        selectedStatus = 2;
      }

      this.$get("/circuito/busca", {
        contractNumber: this.$props.contract.numeroContratoTpz,
        searchText: this.searchText,
        onlineStatus: selectedStatus,
        installStatus: this.installStatus,
        productType:
          this.product == this.$vuetify.lang.t("$vuetify.TODOS")
            ? null
            : this.product,
        techType:
          this.technology == this.$vuetify.lang.t("$vuetify.TODOS")
            ? null
            : this.technology,
        page: this.page,
      }).then((response) => {
        if (response && response.data.length == 0) {
          this.noResult = true;
        } else {
          this.noResult = false;
        }

        if (!page) {
          this.circuits = [];
        }

        this.circuits = this.circuits.concat(response.data);
        this.isLoading = false;
        this.openedPanel = selectCircuitIndex;
      });
    },
    expandPanel() {
      this.showPanel = !this.showPanel;
    },
    getInstallStatus(status, index) {
      this.$get("/circuito/install/counts", {
        contractNumber: this.$props.contract.numeroContratoTpz,
        statusInstall: status,
      }).then((response) => {
        this.installCounts[index] = response.data;

        this.$forceUpdate();
        if (index == this.installCounts.length - 1) {
          var countsArray = this.installCounts.slice();
          countsArray.unshift(this.counts[1]);
          countsArray.unshift(this.counts[0]);
          this.$root.$emit("circuit-data", countsArray);
        }
      });
    },
  },
  props: {
    contract: Object,
  },
  updated: function () {
    this.logDecoration = this.button == "log" ? "underline" : "none";
    this.contractDecoration = this.button == "contract" ? "underline" : "none";
  },
  data: () => ({
    prtgToken: undefined,
    isLoadingOffline: false,
    isLoadingOnline: false,
    isLoadingStatus: false,
    openedPanel: undefined,
    logDecoration: "none",
    contractDecoration: "none",
    button: "contract",
    loadingExport: false,
    allCircuits: undefined,
    showProblemSolveDialog: false,
    showPanel: true,
    showDialogLoading: false,
    reasonList: [],
    showDialog: false,
    showSuccess: false,
    counts: [0, 0],
    installCounts: [-1, -1, -1, -1, -1, -1, -1, -1, -1],
    circuits: [],
    statuses: [],
    products: [],
    technologies: [],
    product: undefined,
    status: undefined,
    installStatus: 0,
    technology: undefined,
    page: 0,
    isLoading: true,
    noResult: false,
    searchText: "",
    selectedCircuit: undefined,
    showRestarts: true,
    restartingCircuits: [],
  }),
  created: function () {
    this.reasonList = [
      "Atividade Programada",
      "Configuração",
      "Desempenho",
      "Emissão de Relatório",
      "Inoperância",
    ];

    this.statuses = [
      this.$vuetify.lang.t("$vuetify.TODOS"),
      "Online",
      "Offline",
    ];

    this.$getUser().then((user) => (this.prtgToken = user.prtgToken));

    this.products = [this.$vuetify.lang.t("$vuetify.TODOS")];
    this.technologies = [this.$vuetify.lang.t("$vuetify.TODOS")];

    this.$get("/circuito/produtos", {
      tpzContractNumber: this.$props.contract.numeroContratoTpz,
    }).then((response) => {
      response.data.sort();
      this.products = this.products.concat(response.data);
    });

    this.$get("/circuito/tecnologias", {
      tpzContractNumber: this.$props.contract.numeroContratoTpz,
    }).then((response) => {
      response.data.sort();
      this.technologies = this.technologies.concat(response.data);
    });

    this.$get("/circuito/busca", {
      contractNumber: this.$props.contract.numeroContratoTpz,
      searchText: "",
      onlineStatus: 0,
      installStatus: 0,
      productType: null,
      techType: null,
      page: 0,
    }).then((response) => {
      this.circuits = response.data;
      this.isLoading = false;
    });

    this.isLoadingOnline = true;
    this.isLoadingOffline = true;

    setTimeout(() => {
      this.$get("/circuito/status/counts", {
        contractNumber: this.$props.contract.numeroContratoTpz,
        online: true,
      }).then((response) => {
        if (response) {
          this.counts[0] = response.data;
        }

        this.isLoadingOnline = false;
        this.$forceUpdate();
      });

      this.$get("/circuito/status/counts", {
        contractNumber: this.$props.contract.numeroContratoTpz,
        online: false,
      }).then((response) => {
        if (response) {
          this.counts[1] = response.data;
        }

        this.isLoadingOffline = false;
        this.$forceUpdate();
      });

      this.getInstallStatus("ATIVADO", 0);
      this.getInstallStatus("DESATIVADO", 1);
      this.getInstallStatus("CANCELADO", 2);
      this.getInstallStatus("DESINSTALADO", 3);
      this.getInstallStatus("INSTALADO", 4);
      this.getInstallStatus("EM_TRANSPORTE", 5);
      this.getInstallStatus("EM_IMPLANTAÇÃO", 6);
      this.getInstallStatus("PROCESSO_FISCAL", 7);
      this.getInstallStatus("SUSPENSO", 8);
    }, 1000);

    this.$root.$on("search-circuit", (desigTpz) => {
      this.searchText = desigTpz;
      this.search(0, 0);
    });

    this.$root.$on("solve-problem", (circuit) => {
      this.solveProblem(circuit);
    });

    this.$root.$on("restart", (circuit) => {
      this.restartingCircuits = this.restartingCircuits.concat(circuit);
      this.showRestarts = true;
    });

    this.$root.$on("open-issue", (circuit) => {
      this.openIssue(circuit);
    });

    this.$root.$on("create-restart-issue", (issue, circuit) => {
      this.sendIssue(issue, circuit, false);
    });

    var vm = this;
    setInterval(function () {
      if (window.sessionStorage.getItem("actualPage") == "dashboard") {
        vm.search(this.page, this.openedPanel);
      }
    }, 300000);
  },
};
</script>
