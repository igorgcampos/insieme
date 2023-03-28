<template>
  <div>
    <v-row id="issues" :class="{ 'ml-n12': $vuetify.breakpoint.mdAndUp }">
      <span
        class="mb-7 text-right display-1 font-weight-bold grey--text text--darken-1"
      >
        {{ $vuetify.lang.t("$vuetify.CHAMADOS") }}</span
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
        <v-row :class="{ 'ml-n6': $vuetify.breakpoint.xs }">
          <v-col
            :class="[
              { 'flex-grow-0': !$vuetify.breakpoint.xs },
              { 'ml-0 pl-1 pr-0': $vuetify.breakpoint.xs },
            ]"
          >
            <CountCard
              :count="counts[0]"
              :message="$vuetify.lang.t('$vuetify.ABERTOS')"
              color="success--text"
              :func="getOpened"
            ></CountCard>
          </v-col>
          <v-col
            :class="[
              { 'flex-grow-0': !$vuetify.breakpoint.xs },
              { 'pl-1 pr-0': $vuetify.breakpoint.xs },
            ]"
          >
            <CountCard
              :count="counts[2]"
              :message="$vuetify.lang.t('$vuetify.EM_ANDAMENTO')"
              color="warning--text"
              :func="getResolving"
            ></CountCard>
          </v-col>
          <v-col
            :class="[
              { 'flex-grow-0': !$vuetify.breakpoint.xs },
              { 'pl-1 pr-0': $vuetify.breakpoint.xs },
            ]"
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

        <v-row id="filtro" class="pl-0 ml-0 grey lighten-5 mb-n5 mt-2">
          <v-col :cols="!$vuetify.breakpoint.xs ? 4 : 6">
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

          <v-col class="ml-5" cols="4" v-if="!$vuetify.breakpoint.xs">
            <v-row>
              <span
                class="text-right subtitle-2 font-weight-bold grey--text text--lighten-1"
              >
                {{ $vuetify.lang.t("$vuetify.STATUS") }}:</span
              >
            </v-row>
            <v-row>
              <v-select
                :items="statuses"
                v-model="status"
                :label="$vuetify.lang.t('$vuetify.EM_ABERTO_ENCERRADO')"
                solo
                dense
                item-text="text"
                item-value="value"
                @change="search()"
              ></v-select>
            </v-row>
          </v-col>

          <v-col
            class="mt-7 ml-3"
            cols="1"
            :class="{ 'mt-7': $vuetify.breakpoint.xs }"
            v-if="!proactivity && !$hasProfile('Comercial')"
          >
            <v-menu transition="slide-x-transition" bottom right>
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
                  {{ $vuetify.lang.t("$vuetify.ABRIR_CHAMADO") }}
                </v-btn>
              </template>

              <v-list>
                <v-list-item
                  @click="showBatchIssueDialog('circuit')"
                  v-if="
                    $hasProfile('Operacional') ||
                    $hasProfile('Cliente') ||
                    $hasProfile('Administrador')
                  "
                >
                  <v-list-item-title>{{
                    $vuetify.lang.t("$vuetify.CIRCUITOS")
                  }}</v-list-item-title>
                </v-list-item>

                <v-list-item
                  @click="showBatchIssueDialog('invoice')"
                  v-if="
                    $hasProfile('Financeiro') ||
                    $hasProfile('Cliente') ||
                    $hasProfile('Administrador')
                  "
                >
                  <v-list-item-title>{{
                    $vuetify.lang.t("$vuetify.FATURAMENTO")
                  }}</v-list-item-title>
                </v-list-item>

                <v-list-item
                  @click="showQuestionsDialog()"
                  v-if="
                    $hasProfile('Operacional') ||
                    $hasProfile('Cliente') ||
                    $hasProfile('Administrador')
                  "
                >
                  <v-list-item-title>{{
                    $vuetify.lang.t("$vuetify.MASSIVA")
                  }}</v-list-item-title>
                </v-list-item>

                <v-list-item
                  @click="openServiceIssue()"
                  v-if="
                    $hasProfile('Operacional') ||
                    $hasProfile('Cliente') ||
                    $hasProfile('Administrador')
                  "
                >
                  <v-list-item-title>{{
                    $vuetify.lang.t("$vuetify.SERVICOS")
                  }}</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>
          </v-col>
        </v-row>

        <v-row class="pl-2 mt-2" style="min-height: 120px">
          <div
            id="issueId"
            class="pr-2 overflow-y-auto overflow-x-hidden"
            v-scroll:#issueId="searchMore"
            style="max-height: 360px; width: 100%"
          >
            <v-expansion-panels class="ma-1" v-model="openedPanel">
              <v-expansion-panel
                v-for="(issue, i) in issues"
                :key="i"
                hide-actions
              >
                <v-expansion-panel-header
                  v-slot="{ open }"
                  class="pt-0 pb-0"
                  @click="getEvaluation(issue, open)"
                >
                  <v-row align="center" no-gutters>
                    <v-col v-if="!open" :cols="$vuetify.breakpoint.xs ? 5 : 2">
                      <v-chip
                        :color="
                          issue.status == 'ABERTO'
                            ? 'success'
                            : issue.status == 'ENCERRADO'
                            ? 'primary'
                            : 'warning'
                        "
                        class="ml-0 mr-4"
                        label
                        small
                        outlined
                      >
                        {{
                          issue.status == "ABERTO"
                            ? $vuetify.lang.t("$vuetify.ABERTO")
                            : issue.status == "ENCERRADO"
                            ? $vuetify.lang.t("$vuetify.ENCERRADO")
                            : $vuetify.lang.t("$vuetify.EM_ANDAMENTO")
                        }}
                      </v-chip>
                    </v-col>

                    <v-col cols="3" v-show="!$vuetify.breakpoint.xs">
                      <strong
                        class="font-weight-bold grey--text text--lighten-1 mr-2"
                      >
                        {{ $vuetify.lang.t("$vuetify.PROTOCOLO") }}:</strong
                      >
                      <strong
                        class="subtitle-2"
                        v-html="issue.protocolo"
                      ></strong>
                    </v-col>

                    <v-col
                      v-show="!$vuetify.breakpoint.xs"
                      v-if="!open && issue.origem == 'CIRCUITO'"
                      cols="4"
                      :class="{ 'col-sm-10': open, 'col-md-10': open }"
                    >
                      <strong
                        class="font-weight-bold grey--text text--lighten-1 mr-2"
                      >
                        {{ $vuetify.lang.t("$vuetify.ORIGEM") }}:</strong
                      >
                      <strong
                        class="subtitle-2 font-weight-bold"
                        v-html="
                          issue.identificadorOrigem +
                          ' / ' +
                          (issue.identificadorOrigemSecundario
                            ? issue.identificadorOrigemSecundario
                            : '--')
                        "
                      ></strong>
                    </v-col>

                    <v-col
                      cols="3"
                      v-if="!open"
                      v-show="!$vuetify.breakpoint.xs"
                    >
                      <strong
                        class="font-weight-bold grey--text text--lighten-1 mr-2"
                      >
                        {{
                          issue.status == "ABERTO"
                            ? $vuetify.lang.t("$vuetify.DATA_ABERTURA") + ":"
                            : $vuetify.lang.t("$vuetify.DATA_ENCERRAMENTO") +
                              ":"
                        }}</strong
                      >

                      <strong>{{
                        issue.status == "ABERTO"
                          ? formatDate(issue.dataAbertura)
                          : formatDate(issue.dataEncerramento)
                      }}</strong>
                    </v-col>

                    <v-col
                      v-show="$vuetify.breakpoint.xs"
                      class="mt-2 mb-2 ml-0"
                    >
                      <v-row sm="5" md="4">
                        <strong
                          class="caption font-weight-bold grey--text text--lighten-1 mr-2"
                          :class="{ 'ml-3': open }"
                        >
                          {{ $vuetify.lang.t("$vuetify.PROTOCOLO") }}:</strong
                        >
                        <strong
                          class="caption font-weight-bold"
                          v-html="issue.protocolo"
                        ></strong>
                      </v-row>

                      <v-row sm="5" md="5" v-if="!open">
                        <strong
                          class="caption font-weight-bold grey--text text--lighten-1 mr-2"
                        >
                          {{
                            issue.status == "ABERTO"
                              ? $vuetify.lang.t("$vuetify.DATA_ABERTURA") + ":"
                              : $vuetify.lang.t("$vuetify.DATA_ENCERRAMENTO") +
                                ":"
                          }}</strong
                        >

                        <strong class="caption font-weight-bold">{{
                          issue.status == "ABERTO"
                            ? formatDate(issue.dataAbertura)
                            : formatDate(issue.dataEncerramento)
                        }}</strong>
                      </v-row>
                    </v-col>
                  </v-row>
                </v-expansion-panel-header>

                <v-expansion-panel-content>
                  <v-card-subtitle
                    class="caption mt-n10 ml-n4 mb-2 grey--text text--lighten-1"
                  >
                    {{ $vuetify.lang.t("$vuetify.ORIGEM") }}:
                    {{
                      $vuetify.lang.t("$vuetify." + issue.origem) +
                      (issue.identificadorOrigem
                        ? " (" +
                          issue.identificadorOrigem +
                          (issue.identificadorOrigemSecundario
                            ? " / " + issue.identificadorOrigemSecundario
                            : "") +
                          ")"
                        : "")
                    }}
                  </v-card-subtitle>

                  <v-row class="mt-3">
                    <v-col
                      class="mt-n6 mr-5"
                      :class="{
                        'col-5': $vuetify.breakpoint.xs,
                        'col-2': !$vuetify.breakpoint.xs,
                      }"
                    >
                      <v-col class="pa-0">
                        <v-chip
                          :color="
                            issue.status == 'ABERTO'
                              ? 'success'
                              : issue.status == 'ENCERRADO'
                              ? 'primary'
                              : 'warning'
                          "
                          class="ml-0 mr-2 mb-2"
                          label
                          small
                          outlined
                        >
                          {{
                            issue.status == "ABERTO"
                              ? $vuetify.lang.t("$vuetify.ABERTO")
                              : issue.status == "ENCERRADO"
                              ? $vuetify.lang.t("$vuetify.ENCERRADO")
                              : $vuetify.lang.t("$vuetify.EM_ANDAMENTO")
                          }}
                        </v-chip>

                        <v-chip
                          color="blue-grey"
                          class="ml-0 mr-2 mb-2"
                          label
                          small
                          outlined
                          v-if="issue.proatividade"
                        >
                          {{ $vuetify.lang.t("$vuetify.PROATIVO") }}
                        </v-chip>

                        <v-chip
                          color="yellow darken-2"
                          class="ml-0 mr-2 mb-2"
                          label
                          small
                          outlined
                          v-if="issue.massiva"
                        >
                          {{ $vuetify.lang.t("$vuetify.MASSIVA") }}
                        </v-chip>

                        <v-chip
                          color="blue-grey"
                          class="ml-0 mr-2 mb-2 text-break"
                          :class="{
                            'main-chip': hasBreakLine(
                              formatStatus(issue.statusProcessamento)
                            ),
                          }"
                          label
                          small
                          outlined
                          v-if="issue.status == 'EM_ANDAMENTO'"
                        >
                          <span
                            v-html="formatStatus(issue.statusProcessamento)"
                          ></span>
                        </v-chip>

                        <v-col cols="1" class="ml-n3 mt-n2">
                          <span
                            v-if="issue.evaluation"
                            class="text-right caption font-weight-bold grey--text text--lighten-1 pl-1"
                            >{{
                              $vuetify.lang.t("$vuetify.AVALIACAO") + ":"
                            }}</span
                          >

                          <v-rating
                            class="mb-4"
                            v-if="issue.evaluation"
                            v-model="issue.evaluation.nota"
                            color="orange"
                            background-color="orange lighten-3"
                            half-increments
                            hover
                            dense
                            small
                            readonly
                          ></v-rating>
                        </v-col>
                      </v-col>
                    </v-col>

                    <v-col
                      cols="3"
                      class="mt-n7 mr-0 ml-n2 mr-6 pl-0 pr-0"
                      v-if="issue.mensagens && issue.mensagens.length > 0"
                    >
                      <span
                        class="text-center caption font-weight-bold grey--text text--lighten-1"
                      >
                        {{ $vuetify.lang.t("$vuetify.MENSAGENS") }}
                      </span>
                      <v-col
                        :class="{ 'col-6 pl-3': $vuetify.breakpoint.xs }"
                        class="mt-0 overflow-y-auto mb-5"
                        style="max-height: 160px"
                      >
                        <v-list subheader three-line class="ml-n3">
                          <v-list-item
                            class="ml-n4 mt-n3"
                            v-for="(message, i) in issue.mensagens"
                            :key="i"
                          >
                            <v-list-item-content>
                              <v-list-item-subtitle
                                class="caption mb-2"
                                :class="{
                                  'red--text': !message.usuario,
                                  'green--text': message.usuario,
                                }"
                                >{{
                                  !message.usuario
                                    ? "Telespazio:"
                                    : message.usuario.nome + ":"
                                }}</v-list-item-subtitle
                              >

                              <v-tooltip top max-width="220">
                                <template v-slot:activator="{ on }">
                                  <v-list-item-subtitle
                                    v-on="on"
                                    class="caption font-weight-bold ml-1"
                                  ></v-list-item-subtitle>
                                </template>
                                <span>{{ message.conteudo }}</span>
                              </v-tooltip>
                            </v-list-item-content>
                          </v-list-item>
                        </v-list>
                      </v-col>
                    </v-col>

                    <v-col
                      cols="6"
                      :class="{
                        'col-9':
                          !$vuetify.breakpoint.xs &&
                          !(issue.mensagens && issue.mensagens.length > 0),
                      }"
                    >
                      <v-row
                        class="mt-n3"
                        :class="{ 'col-6 pl-3': $vuetify.breakpoint.xs }"
                      >
                        <v-col cols="4" class="pt-0 pl-0 mt-n6">
                          <LabelValue
                            :label="$vuetify.lang.t('$vuetify.DATA_ABERTURA')"
                            :value="formatDate(issue.dataAbertura)"
                            justify="start"
                            :class="{ 'pl-0': $vuetify.breakpoint.xs }"
                          ></LabelValue>
                        </v-col>

                        <v-col
                          cols="4"
                          class="pt-0 pl-0 pr-0 mt-n6"
                          v-if="issue.mensagens && issue.mensagens.length > 0"
                        >
                          <LabelValue
                            :label="
                              $vuetify.lang.t('$vuetify.OBSERVACAO_ABERTURA')
                            "
                            :value="issue.observacaoAbertura || '--'"
                            justify="start"
                            truncate
                            style="max-width: 150px"
                            :class="{ 'pl-0': $vuetify.breakpoint.xs }"
                          ></LabelValue>
                        </v-col>

                        <v-col cols="4" class="pt-0 pl-0 pr-0 mt-n6">
                          <LabelValue
                            :label="$vuetify.lang.t('$vuetify.MOTIVO_ABERTURA')"
                            :value="issue.motivoAbertura"
                            justify="start"
                            :class="{ 'pl-0': $vuetify.breakpoint.xs }"
                          ></LabelValue>
                        </v-col>

                        <v-col cols="4" class="pt-0 pl-0 pr-0 mt-n6">
                          <LabelValue
                            :label="
                              $vuetify.lang.t(
                                '$vuetify.TIPO_PROBLEMA_SOLICITACAO'
                              )
                            "
                            :value="
                              issue.subCategoria ? issue.subCategoria : '--'
                            "
                            justify="start"
                            :class="{ 'pr-0 pl-0': $vuetify.breakpoint.xs }"
                          ></LabelValue>
                        </v-col>

                        <v-col
                          cols="4"
                          class="pt-0 pl-0 pr-0 mt-n6"
                          v-if="issue.mensagens && issue.mensagens.length == 0"
                          :class="{ 'col-6 pr-0 pl-2': $vuetify.breakpoint.xs }"
                        >
                          <LabelValue
                            :label="
                              $vuetify.lang.t('$vuetify.OBSERVACAO_ABERTURA')
                            "
                            :value="issue.observacaoAbertura || '--'"
                            justify="start"
                            truncate
                            style="max-width: 150px"
                            :class="{ 'pl-0': $vuetify.breakpoint.xs }"
                          ></LabelValue>
                        </v-col>

                        <v-col cols="4" class="pt-0 pl-0 pr-0 mt-n6">
                          <LabelValue
                            :label="
                              $vuetify.lang.t('$vuetify.DATA_ENCERRAMENTO')
                            "
                            :value="formatDate(issue.dataEncerramento)"
                            justify="start"
                            :class="{ 'pr-0 pl-0': $vuetify.breakpoint.xs }"
                          ></LabelValue>
                        </v-col>

                        <v-col cols="4" class="pt-0 pl-0 pr-0 mt-n6">
                          <LabelValue
                            :label="
                              $vuetify.breakpoint.xs
                                ? $vuetify.lang.t(
                                    '$vuetify.MOTIVO_ENCERRAMENTO_ABREVIADO'
                                  )
                                : $vuetify.lang.t(
                                    '$vuetify.MOTIVO_ENCERRAMENTO'
                                  )
                            "
                            :value="issue.motivoEncerramento || '--'"
                            justify="start"
                            :class="{ 'pl-0 pr-0': $vuetify.breakpoint.xs }"
                          ></LabelValue>
                        </v-col>
                      </v-row>
                    </v-col>
                  </v-row>

                  <v-divider
                    class="mt-n3"
                    v-show="
                      (issue.status == 'ABERTO' ||
                        (issue.status != 'ABERTO' &&
                          (!issue.evaluation ||
                            issue.origem == 'CIRCUITO_LOTE')) ||
                        (issue.origem == 'CIRCUITO_LOTE_COMERCIAL' &&
                          issue.planilha.length > 0) ||
                        (canShowButton &&
                          issue.origem != 'CIRCUITO_LOTE_COMERCIAL')) &&
                      !issue.proatividade
                    "
                  ></v-divider>

                  <v-card-actions class="mb-n2 pb-0">
                    <TooltipButton
                      :label="$vuetify.lang.t('$vuetify.ENCERRAR')"
                      :message="$vuetify.lang.t('$vuetify.ENCERRAR_CHAMADO')"
                      :event="encerrarChamado"
                      :object="issue"
                      :mobile="$vuetify.breakpoint.xs"
                      :isText="true"
                      v-if="issue.status != 'ENCERRADO' && !issue.proatividade"
                    ></TooltipButton>

                    <TooltipButton
                      :label="$vuetify.lang.t('$vuetify.FEEDBACK')"
                      :message="$vuetify.lang.t('$vuetify.AVALIE_CHAMADO')"
                      :event="openFeedBack"
                      :object="issue"
                      :mobile="$vuetify.breakpoint.xs"
                      :isText="true"
                      v-if="
                        issue.status == 'ENCERRADO' &&
                        !issue.evaluation &&
                        canShowButton
                      "
                    ></TooltipButton>

                    <TooltipButton
                      :label="$vuetify.lang.t('$vuetify.LISTAR_LOTE')"
                      :message="
                        $vuetify.lang.t('$vuetify.LISTAR_LOTE_CIRCUITO', '')
                      "
                      :mobile="$vuetify.breakpoint.xs"
                      v-if="
                        issue.origem == 'CIRCUITO_LOTE_COMERCIAL' &&
                        issue.planilha.length > 0
                      "
                      :event="showCommercialCircuits"
                      :object="issue"
                      :isText="true"
                    ></TooltipButton>

                    <TooltipButton
                      :label="$vuetify.lang.t('$vuetify.LISTAR_NOTAS')"
                      :message="
                        $vuetify.lang.t('$vuetify.LISTAR_NOTAS_CHAMADO', '')
                      "
                      :mobile="$vuetify.breakpoint.xs"
                      v-if="
                        issue.lote &&
                        issue.lote.length > 0 &&
                        issue.origem != 'CIRCUITO_LOTE_COMERCIAL' &&
                        (!issue.planilha || issue.planilha.length == 0)
                      "
                      :event="showListInvoices"
                      :object="issue"
                      :isText="true"
                    ></TooltipButton>

                    <TooltipButton
                      :label="$vuetify.lang.t('$vuetify.ENVIAR_MENSAGEM')"
                      :message="$vuetify.lang.t('$vuetify.ENVIAR_MENSAGEM')"
                      :event="openMessageDialog"
                      :object="issue"
                      :mobile="$vuetify.breakpoint.xs"
                      :isText="true"
                      v-if="issue.status != 'ENCERRADO'"
                    ></TooltipButton>

                    <TooltipButton
                      :message="$vuetify.lang.t('$vuetify.ATUALIZAR')"
                      :event="refreshIssue"
                      :object="issue"
                      :mobile="$vuetify.breakpoint.xs"
                      :isText="true"
                      icon="mdi-reload"
                      color="primary"
                      v-if="issue.status != 'ENCERRADO'"
                    ></TooltipButton>
                  </v-card-actions>
                </v-expansion-panel-content>
              </v-expansion-panel>
            </v-expansion-panels>
          </div>
          <v-col v-if="issues.length == 0 && !isLoading" class="mt-n2">
            <v-lazy
              :options="{ threshold: 0.6 }"
              transition="slide-x-transition"
            >
              <WarningPanel
                :message="$vuetify.lang.t('$vuetify.NENHUM_CHAMADO')"
              >
              </WarningPanel>
            </v-lazy>
          </v-col>
        </v-row>

        <IssueDialog
          :showDialog="showServiceDialog"
          :showSuccess="showSuccess"
          :showDialogLoading="showDialogLoading"
          :close="closeServiceDialog"
          :send="sendService"
          :getObject="getObject"
          :itemList="reasonServiceList"
        ></IssueDialog>

        <IssueDialog
          :showDialog="showDialog"
          :showSuccess="showSuccess"
          :showDialogLoading="showDialogLoading"
          :close="closeDialog"
          :send="closeIssue"
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
          :error="error"
        ></BatchIssueDialog>

        <CommercialDialog
          :showDialog="showCommercialDialog"
          :close="closeCommercialDialog"
          :itemList="selectedCommercialList"
          :title="$vuetify.lang.t('$vuetify.LISTAR_LOTE')"
          :subtitle="
            $vuetify.lang.t('$vuetify.LISTAR_LOTE_CIRCUITO', entity.protocolo)
          "
          :actionName="actionName"
          :editable="false"
        >
        </CommercialDialog>

        <FeedbackDialog
          :show="showFeedBack"
          :close="closeFeedback"
          :entity="selectedIssue"
          :function="feedBackFunction"
        >
        </FeedbackDialog>

        <ListDialog
          :close="hideListInvoices"
          :show="showListDialog"
          :title="$vuetify.lang.t('$vuetify.LISTAR_NOTAS')"
          :info="$vuetify.lang.t('$vuetify.LISTAR_NOTAS_CHAMADO')"
          :list="selectedList"
        ></ListDialog>

        <QuestionsDialog
          :close="closeQuestionsDialog"
          :show="showMassive"
          :questions="questions"
        >
        </QuestionsDialog>

        <AddMessageDialog
          :close="closeMessageDialog"
          :show="showMessageDialog"
          :send="sendMessage"
          :title="$vuetify.lang.t('$vuetify.ENVIAR_MENSAGEM')"
          :subtitle="$vuetify.lang.t('$vuetify.ENVIAR_MENSAGEM_DESCRICAO')"
          :entity="selectedIssue"
          :loading="isLoading"
        >
        </AddMessageDialog>
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
import BatchIssueDialog from "../components/dialogs/BatchIssueDialog";
import CommercialDialog from "../components/dialogs/CommercialDialog";
import FeedbackDialog from "../components/dialogs/FeedbackDialog";
import ListDialog from "../components/dialogs/ListDialog";
import QuestionsDialog from "../components/dialogs/QuestionsDialog";
import AddMessageDialog from "../components/dialogs/AddMessageDialog";

export default {
  components: {
    CountCard,
    WarningPanel,
    TooltipButton,
    LabelValue,
    IssueDialog,
    BatchIssueDialog,
    CommercialDialog,
    FeedbackDialog,
    ListDialog,
    QuestionsDialog,
    AddMessageDialog,
  },
  methods: {
    refreshIssue(issue) {
      this.$get("/chamado/atualizar", { issueId: issue.id }).then(
        (response) => {
          this.issues.forEach((selectedIssue) => {
            if (
              selectedIssue.idIncidenteTopdesk ==
              response.data.idIncidenteTopdesk
            ) {
              selectedIssue.status = response.data.status;
              selectedIssue.statusProcessamento =
                response.data.statusProcessamento;
              selectedIssue.dataEncerramento = response.data.dataEncerramento;
              selectedIssue.motivoEncerramento =
                response.data.motivoEncerramento;

              this.$get("/mensagem/issue", { issueId: issue.id }).then(
                (response) => {
                  selectedIssue.mensagens = response.data;
                  this.$forceUpdate();
                }
              );
            }
          });
        }
      );
    },
    formatStatus(text) {
      if (!text) {
        return;
      }

      var array = text.split(" ");

      if (array.length == 1) {
        return text;
      }

      var formattedText = "";

      array.forEach((item) => {
        if (item == array[0]) {
          formattedText += array[0] + "<br/> ";
          return;
        }

        formattedText += item + " ";
      });

      return formattedText;
    },
    hasBreakLine(text) {
      if (!text) {
        return;
      }
      return text.includes("<br/>");
    },
    sendMessage(content, issue) {
      if (!issue.mensagens) {
        issue.mensagens = [];
      }

      this.isLoading = true;
      this.$post("/chamado/mensagem", {
        issueId: issue.id,
        message: content,
      }).then(() => {
        this.isLoading = false;
        this.showMessageDialog = false;

        this.$getUser().then((user) => {
          issue.mensagens = issue.mensagens.concat({
            conteudo: content,
            usuario: user,
          });

          var vm = this;
          setTimeout(function () {
            vm.refreshIssue(issue);
          }, 1000);
        });
      });
    },
    openMessageDialog(issue) {
      this.selectedIssue = issue;
      this.showMessageDialog = true;
    },
    closeMessageDialog() {
      this.showMessageDialog = false;
    },
    showQuestionsDialog() {
      this.showMassive = true;
    },
    closeQuestionsDialog() {
      this.showMassive = false;
    },
    filterIssues() {
      if (this.$hasProfile("Administrador")) {
        return this.issues;
      }

      this.issues = this.issues.filter(function (issue) {
        return !issue.proatividade;
      });

      return this.issues;
    },
    closeCommercialDialog() {
      this.showCommercialDialog = false;
    },
    convertNamesToFields(itemList) {
      return itemList.map((item) => {
        var obj = {};

        if (
          this.actionName == "ALTERAR_VELOCIDADE" ||
          this.actionName == "SUSPENDER" ||
          this.actionName == "CANCELAR" ||
          this.actionName == "REMANEJAR" ||
          this.actionName == "ATIVAR" ||
          this.actionName == "REVOGAR_CANCELAMENTO" ||
          this.actionName == "REVOGAR_SUSPENSAO"
        )
          obj.nome = item["Designação Tpz"];

        if (
          this.actionName == "SUSPENDER" ||
          this.actionName == "NOVO_CIRCUITO" ||
          this.actionName == "CANCELAR" ||
          this.actionName == "ATIVAR" ||
          this.actionName == "REVOGAR_CANCELAMENTO" ||
          this.actionName == "REVOGAR_SUSPENSAO"
        )
          console.log(item["designacaoTpz"]);
        obj.nome = item["designacaoTpz"];
        obj.designacaoCliente = item["designacaoCliente"];

        if (this.actionName == "ALTERAR_VELOCIDADE") {
          obj.contato_instalacao = item["Contato do cliente"];
          obj.telefone_instalacao = item["Telefone do cliente"];
          obj.velocidade_atual = item["Velocidade atual"];
          obj.velocidade_solicitada = item["Velocidade solicitada"];
        }

        if (this.actionName == "NOVO_CIRCUITO") {
          obj.banda = item["Banda"];
          obj.velocidade = item["Velocidade"];
          obj.antena = item["Antena"];
          obj.buc = item["BUC"];
          obj.razaoSocial = item["Razão social"];
          obj.nomeFantasia = item["Nome fantasia"];
          obj.cnpj = item["CNPJ"];
          obj.inscricaoEstadual = item["Inscrição estadual"];
          obj.endereco_fiscal = item["Endereço fiscal"];
          obj.bairro_fiscal = item["Bairro fiscal"];
          obj.cidade_fiscal = item["Cidade fiscal"];
          obj.uf_fiscal = item["UF fiscal"];
          obj.cep_fiscal = item["CEP fiscal"];
          obj.endereco_remessa = item["Endereço da remessa"];
          obj.bairro_remessa = item["Bairro da remessa"];
          obj.cidade_remessa = item["Cidade da remessa"];
          obj.uf_remessa = item["UF da remessa"];
          obj.cep_remessa = item["CEP da remessa"];
          obj.contato_remessa = item["Contato da remessa"];
          obj.telefone_remessa = item["Telefone da remessa"];
          obj.latitude = item["Latitude"];
          obj.longitude = item["Longitude"];
        }

        if (this.actionName == "CANCELAR" || this.actionName == "SUSPENDER") {
          obj.endereco_instalacao = item["Endereço da instalação"];
          obj.bairro_instalacao = item["Bairro da instalação"];
          obj.cidade_instalacao = item["Cidade da instalação"];
          obj.uf_instalacao = item["UF da instalação"];
          obj.cep_instalacao = item["CEP da instalação"];
          obj.contato_instalacao = item["Contato da instalação"];
          obj.telefone_instalacao = item["Telefone da instalação"];
        }

        if (this.actionName == "ALTERAR_VELOCIDADE") {
          obj.endereco_gerencia = item["Endereço da gerência"];
          obj.vlan = item["VLAN"];
          obj.interconexao_tpz = item["Interconexão Tpz"];
          obj.wan_rede = item["WAN CPE REDE"];
          obj.endereco_lan = item["Endereço de LAN"];
          obj.wan_host = item["WAN CPE HOST"];
          obj.loopback = item["Loopback CPE"];
          obj.rotas_sumarizadas = item["Rotas sumarizadas"];
        }

        if (this.actionName == "REMANEJAR") {
          obj.tipo_remanejamento = item["Tipo de remanejamento"];
          obj.endereco_origem = item["Endereço de origem"];
          obj.bairro_origem = item["Bairro de origem"];
          obj.cidade_origem = item["Cidade de origem"];
          obj.uf_origem = item["UF de origem"];
          obj.cep_origem = item["CEP de origem"];
          obj.contato_origem = item["Contato da origem"];
          obj.telefone_origem = item["Telefone da origem"];
          obj.endereco_destino = item["Endereço de destino"];
          obj.bairro_destino = item["Bairro de destino"];
          obj.cidade_destino = item["Cidade de destino"];
          obj.uf_destino = item["UF de destino"];
          obj.cep_destino = item["CEP de destino"];
          obj.contato_destino = item["Contato do destino"];
          obj.telefone_destino = item["Telefone do destino"];
        }

        obj.observacao = item["Observação"];
        return obj;
      });
    },
    showCommercialCircuits(issue) {
      this.actionName = issue.lote[0];
      this.selectedCommercialList = JSON.parse(issue.planilha);
      this.selectedCommercialList = this.convertNamesToFields(
        this.selectedCommercialList
      );
      this.showCommercialDialog = true;
      this.entity = issue;
    },
    showListInvoices(issue) {
      this.selectedList = issue.lote;
      this.showListDialog = true;
    },
    hideListInvoices() {
      this.showListDialog = false;
    },
    searchEntities(text, page) {
      if (!this.$props.contract) {
        return;
      }

      if (this.entity.type == "circuit") {
        this.searchCircuits(text, page);
      } else {
        this.searchInvoices(text, page);
      }
    },
    showBatch(issue) {
      issue.showBatch = true;
    },
    sendBatchIssue(issue, entity) {
      if (!issue.reason || !issue.items) {
        return;
      }

      issue.items = issue.items.filter((item) => !item.hasIssue);

      if (issue.items.length == 0) {
        this.showBatchDialog = false;
        return;
      }

      this.showDialogLoading = true;

      if (entity.type == "circuit") {
        this.createIssueForEachCircuit(issue);
      } else {
        this.createBatchIssueForInvoices(issue);
      }
    },
    createIssueForEachCircuit(issue) {
      var count = 0;
      var total = issue.items.length;
      for (var index in issue.items) {
        var object = {
          origem: "CIRCUITO",
          identificadorOrigem: issue.items[index].nome,
          identificadorOrigemSecundario: issue.items[index].designacaoCliente,
          motivoAbertura: issue.reason,
          observacaoAbertura: issue.observation,
          contrato: { id: this.$props.contract.id },
        };

        if(issue.reason == 'Inoperância' || issue.reason == 'Desempenho'){
          issue.items[index].observation = issue.observation;
          issue.items[index].reason = issue.reason;
          this.$root.$emit("restart", issue.items[index]);

          if(index == issue.items.length - 1){
            this.$root.$emit('clean-fields');
            this.closeBatchDialog();
          }
          continue;
        }

        delete object.circuito;
        this.$post("/chamado/create", object).then((response) => {
          if (!response) {
            this.error = true;
            return;
          }

          if (response.data) {
            count++;

            if (count == total) {
              this.showSuccess = true;
              this.showDialogLoading = false;
            }
          }
          this.$root.$emit("new-issue", response.data);
        });
      }
    },
    createBatchIssueForInvoices(issue) {
      var object = {
        origem: "NOTA_LOTE",
        identificadorOrigem: undefined,
        motivoAbertura: issue.reason,
        observacaoAbertura: issue.observation,
        lote: issue.items.map(function (item) {
          return item.numero;
        }),
        contrato: { id: this.$props.contract.id },
      };

      this.$post("/chamado/create", object).then((response) => {
        if (!response) {
          this.error = true;
          return;
        }

        if (response.data) {
          this.entity.protocolo = response.data.protocolo;
          this.showSuccess = true;
          this.showDialogLoading = false;
          this.$root.$emit("new-issue", response.data);
        }
      });
    },
    searchInvoices(text, page) {
      if (page == 0) {
        this.itemList = [];
      }

      this.showDialogLoading = true;
      this.$get("/nota/busca", {
        contractId: this.$props.contract.id,
        searchText: text,
        paymentStatus: undefined,
        page: page,
      }).then((response) => {
        if (response && response.data.length == 0) {
          this.noBatchResult = true;
        } else {
          this.noBatchResult = false;
        }

        this.itemList = this.itemList.concat(response.data);
        this.showDialogLoading = false;
      });
    },
    searchCircuits(text, page) {
      if (page == 0) {
        this.itemList = [];
      }

      this.showDialogLoading = true;
      this.$get("/circuito/busca", {
        contractNumber: this.$props.contract.numeroContratoTpz,
        searchText: text,
        onlineStatus: 0,
        installStatus: 1,
        productType: null,
        techType: null,
        page: page,
      }).then((response) => {
        if (response && response.data.length == 0) {
          this.noBatchResult = true;
        } else {
          this.noBatchResult = false;
        }

        this.itemList = this.itemList.concat(response.data);
        this.showDialogLoading = false;
      });
    },
    showBatchIssueDialog(type) {
      if (type == "circuit") {
        this.reasonBatchList = [
          "Atividade Programada",
          "Configuração",
          "Desempenho",
          "Emissão de Relatório",
          "Inoperância",
        ];

        this.searchCircuits("", 0);
      } else if (type == "invoice") {
        this.reasonBatchList = [
          this.$vuetify.lang.t("$vuetify.SEGUNDA_VIA"),
          this.$vuetify.lang.t("$vuetify.BAIXA_BOLETO"),
          this.$vuetify.lang.t("$vuetify.ALTERAR_VENCIMENTO"),
        ];
        this.searchInvoices("", 0);
      }

      this.entity = { type: type };

      this.showBatchDialog = true;
    },
    closeDialog(issue) {
      this.showDialog = false;
      this.showDialogLoading = false;
      this.openFeedBack(issue);

      setTimeout(() => {
        this.showSuccess = false;
      }, 1000);
    },
    closeBatchDialog() {
      this.showBatchDialog = false;
      this.showDialogLoading = false;
      this.noBatchResult = false;
      this.error = false;

      setTimeout(() => {
        this.showSuccess = false;
      }, 1000);
    },
    closeIssue(issue) {
      if (!issue.reason) {
        return;
      }

      this.selectedIssue.motivoEncerramento = issue.reason;
      this.selectedIssue.observacaoEncerramento = issue.observation;
      this.showDialogLoading = true;

      this.$put("/chamado/close", this.selectedIssue).then((response) => {
        if (response.data) {
          this.showSuccess = true;
          this.showDialogLoading = false;
          this.selectedIssue.statusProcessamento = undefined;
          this.selectedIssue.dataEncerramento = response.data.dataEncerramento;

          if (this.selectedIssue.status == "ABERTO") {
            this.counts[0] -= 1;
          } else {
            this.counts[2] -= 1;
          }

          this.counts[1] += 1;
          this.canShowButton = true;
          this.selectedIssue.status = response.data.status;
        }
      });
    },
    encerrarChamado(issue) {
      this.selectedIssue = issue;
      this.selectedIssue.type = "closing";
      this.showDialog = true;
    },
    getObject() {
      return this.selectedIssue;
    },
    getOpened() {
      this.getFromStatus("ABERTO");
    },
    getClosed() {
      this.getFromStatus("ENCERRADO");
    },
    getResolving() {
      this.getFromStatus("EM_ANDAMENTO");
    },
    clearFields() {
      this.searchText = "";
      this.page = 0;
      this.issues = [];
    },
    getFromStatus(status) {
      if (this.isLoading) {
        return;
      }

      this.status = status;
      this.clearFields();
      this.search();
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
        document.getElementById("issueId").scrollTop + 361 >=
        document.getElementById("issueId").scrollHeight
      ) {
        this.page++;
        this.search(this.page);
      }
    },
    search(page, selectInvoiceIndex) {
      this.isLoading = true;
      this.canShowButton = false;

      if (!page) {
        this.page = 0;
        this.noResult = false;
      }

      this.$get("/chamado/busca", {
        contractId: this.$props.contract ? this.$props.contract.id : undefined,
        searchText: this.searchText,
        status: this.status,
        proactivity: this.$props.proactivity,
        commercial: this.$hasProfile("Comercial") ? true : undefined,
        page: this.page,
      }).then((response) => {
        if (response && response.data.length == 0) {
          this.noResult = true;
        } else {
          this.noResult = false;
        }

        if (!page) {
          this.issues = [];
        }

        this.issues = this.issues.concat(response.data);
        this.filterIssues();
        this.isLoading = false;
        this.openedPanel = selectInvoiceIndex;

        //Se a busca foi feita pelo evento de clique da notificação,
        //busca a avaliação do chamado.
        if (selectInvoiceIndex == 0) {
          this.getEvaluation(this.issues[0], false, true);
        }

        response.data.forEach((element) => {
          this.$get("/mensagem/issue", {
            issueId: element.id,
          }).then((resp) => {
            element.mensagens = resp.data;
          });
        });
      });
    },
    expandPanel() {
      this.showPanel = !this.showPanel;
    },
    getEvaluation(issue, open, showFeedBack) {
      if (open || issue.evaluation || issue.status == "ABERTO") {
        if (issue.evaluation) {
          this.canShowButton = false;
        }
        return;
      }

      this.canShowButton = false;
      this.$get("/avaliacao", { issueId: issue.id }).then((response) => {
        issue.evaluation = response.data;
        this.$forceUpdate();

        if (!response.data) this.canShowButton = true;

        if (!issue.evaluation && showFeedBack) {
          this.openFeedBack(issue);
        }
      });
    },
    openFeedBack(issue) {
      this.showFeedBack = true;
      this.selectedIssue = { issue: issue };
    },
    closeFeedback() {
      this.showFeedBack = false;
    },
    feedBackFunction() {
      this.$forceUpdate();
    },
    openServiceIssue() {
      this.showServiceDialog = true;
      this.selectedIssue = { type: "service" };
    },
    sendService(issue) {
      if (!issue.reason || issue.observation.length == 0) {
        return;
      }

      var object = {
        origem: "SERVICO",
        identificadorOrigem: "Serviço",
        motivoAbertura: issue.reason,
        observacaoAbertura: issue.observation,
        contrato: { id: this.$props.contract.id },
      };

      this.showDialogLoading = true;

      this.$post("/chamado/create", object).then((response) => {
        if (!response) {
          this.error = true;
          return;
        }

        if (response.data) {
          this.showSuccess = true;
          this.showDialogLoading = false;
          this.selectedIssue = response.data;
          this.$root.$emit("new-issue", response.data);
        }
      });
    },
    closeServiceDialog() {
      this.showServiceDialog = false;
      this.showSuccess = false;
    },
  },
  props: {
    contract: Object,
    proactivity: Boolean,
  },
  data: () => ({
    showServiceDialog: false,
    error: false,
    showMessageDialog: false,
    selectedList: [],
    showListDialog: false,
    canShowButton: false,
    showFeedBack: false,
    openedPanel: undefined,
    showCommercialDialog: false,
    actionName: "",
    selectedCommercialList: undefined,
    entity: { type: "circuit" },
    noBatchResult: false,
    reasonBatchList: [],
    itemList: [],
    showBatchDialog: false,
    showPanel: true,
    selectedIssue: undefined,
    showDialogLoading: false,
    reasonList: [],
    reasonServiceList: [
      "Atividade Programada",
      "Incidente",
      "Serviços",
      "Emissão de Relatório",
    ],
    showDialog: false,
    showSuccess: false,
    counts: [0, 0],
    issues: [],
    statuses: [],
    status: null,
    page: 0,
    isLoading: true,
    noResult: false,
    searchText: "",
    showMassive: false,
    questions: [],
  }),
  created: function () {
    this.reasonList = [
      this.$vuetify.lang.t("$vuetify.DESISTI_CHAMADO"),
      this.$vuetify.lang.t("$vuetify.PROBLEMA_RESOLVIDO"),
    ];

    this.$root.$on("new-issue", (issue) => {
      if (!this.issues) {
        return;
      }
      this.issues.unshift(issue);
      this.counts[0] += 1;
    });

    var vm = this;
    this.$get("/chamado/tipos", {}).then((response) => {
      this.statuses = response.data;
      this.statuses = this.statuses.map(function (t) {
        return { text: vm.$vuetify.lang.t("$vuetify." + t), value: t };
      });
      this.statuses.sort();
      this.statuses.unshift({
        text: this.$vuetify.lang.t("$vuetify.TODOS"),
        value: null,
      });
    });

    this.$get("/chamado/counts", {
      contractId: this.$props.contract ? this.$props.contract.id : undefined,
      proactivity: this.$props.proactivity,
      commercial: this.$hasProfile("Comercial") ? true : undefined,
    }).then((response) => {
      this.counts = response.data;
      if (this.counts.length == 0) this.counts = [0, 0, 0];

      this.isLoading = false;
      this.counts.push(0);
      this.$root.$emit("issue-data", this.counts);
    });

    this.$get("/chamado/busca", {
      contractId: this.$props.contract ? this.$props.contract.id : undefined,
      searchText: "",
      status: null,
      proactivity: this.$props.proactivity,
      commercial: this.$hasProfile("Comercial") ? true : undefined,
      page: 0,
    }).then((response) => {
      response.data.forEach((element) => {
        this.$get("/mensagem/issue", {
          issueId: element.id,
        }).then((resp) => {
          element.mensagens = resp.data;
        });
      });

      this.issues = response.data;
      this.filterIssues();
      this.isLoading = false;
    });

    this.$root.$on("close-issue-success", (issue) => {
      if (!this.issues) {
        return;
      }

      this.issues.forEach((element) => {
        if (element.protocolo == issue.protocolo) {
          element.motivoEncerramento = issue.motivoEncerramento;
          element.observacaoEncerramento = issue.observacaoEncerramento;
          element.status = "ENCERRADO";
          element.dataEncerramento = issue.dataEncerramento;
          this.counts[0] -= 1;
          this.counts[1] += 1;
        }
      });
    });

    this.$root.$on("search-issue", (protocol) => {
      this.searchText = protocol;
      this.search(0, 0);
    });

    this.questions[0] = this.$vuetify.lang.t("$vuetify.MASSIVA_0");
  },
};
</script>
<style scoped>
.main-chip.v-chip.v-size--small {
  height: 44px !important;
  padding-top: 20px !important;
  padding-bottom: 20px !important;
}
</style>
