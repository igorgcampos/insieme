<template>
  <v-data-table
    :headers="headers"
    :items="entityList"
    dense
    fixed-header
    :height="(actionName !='NOVO_CIRCUITO' && this.actionName != 'SITE_SURVEY')?260:220"
    class="ml-4 mr-4"
    max-width="600"
    no-data-text=""
  >
    <template
      v-slot:item.actions="{ item }"
      v-if="editable"
    >
      <v-icon
        small
        @click="deleteItem(item)"
      >
        mdi-delete
      </v-icon>
    </template>

    <template
      v-slot:item.designacaoCliente="props"
      v-if="(actionName == 'NOVO_CIRCUITO' || actionName == 'SITE_SURVEY') && editable"
    >
      <v-edit-dialog
        :return-value.sync="props.item.designacaoCliente"
        large
        :cancel-text="$vuetify.lang.t('$vuetify.CANCELAR')"
        :save-text="$vuetify.lang.t('$vuetify.SALVAR')"
      > {{ props.item.designacaoCliente }}
        <template v-slot:input>
          <v-text-field
            v-model="props.item.designacaoCliente"
            :label="$vuetify.lang.t('$vuetify.EDITAR')"
            single-line
          ></v-text-field>
        </template>
      </v-edit-dialog>
    </template>

    <template
      v-slot:item.tipo_remanejamento="props"
      v-if="editable"
    >
      <v-edit-dialog
        :return-value.sync="props.item.tipo_remanejamento"
        large
        :cancel-text="$vuetify.lang.t('$vuetify.CANCELAR')"
        :save-text="$vuetify.lang.t('$vuetify.SALVAR')"
      > {{ props.item.tipo_remanejamento }}
        <template v-slot:input>
          <v-text-field
            v-model="props.item.tipo_remanejamento"
            :label="$vuetify.lang.t('$vuetify.EDITAR')"
            single-line
          ></v-text-field>
        </template>
      </v-edit-dialog>
    </template>

    <template
      v-slot:item.endereco_origem="props"
      v-if="editable"
    >
      <v-edit-dialog
        :return-value.sync="props.item.endereco_origem"
        large
        :cancel-text="$vuetify.lang.t('$vuetify.CANCELAR')"
        :save-text="$vuetify.lang.t('$vuetify.SALVAR')"
      > {{ props.item.endereco_origem }}
        <template v-slot:input>
          <v-text-field
            v-model="props.item.endereco_origem"
            :label="$vuetify.lang.t('$vuetify.EDITAR')"
            single-line
          ></v-text-field>
        </template>
      </v-edit-dialog>
    </template>

    <template
      v-slot:item.bairro_origem="props"
      v-if="editable"
    >
      <v-edit-dialog
        :return-value.sync="props.item.bairro_origem"
        large
        :cancel-text="$vuetify.lang.t('$vuetify.CANCELAR')"
        :save-text="$vuetify.lang.t('$vuetify.SALVAR')"
      > {{ props.item.bairro_origem }}
        <template v-slot:input>
          <v-text-field
            v-model="props.item.bairro_origem"
            :label="$vuetify.lang.t('$vuetify.EDITAR')"
            single-line
          ></v-text-field>
        </template>
      </v-edit-dialog>
    </template>

    <template
      v-slot:item.cidade_origem="props"
      v-if="editable"
    >
      <v-edit-dialog
        :return-value.sync="props.item.cidade_origem"
        large
        :cancel-text="$vuetify.lang.t('$vuetify.CANCELAR')"
        :save-text="$vuetify.lang.t('$vuetify.SALVAR')"
      > {{ props.item.cidade_origem }}
        <template v-slot:input>
          <v-text-field
            v-model="props.item.cidade_origem"
            :label="$vuetify.lang.t('$vuetify.EDITAR')"
            single-line
          ></v-text-field>
        </template>
      </v-edit-dialog>
    </template>

    <template
      v-slot:item.uf_origem="props"
      v-if="editable"
    >
      <v-edit-dialog
        :return-value.sync="props.item.uf_origem"
        large
        :cancel-text="$vuetify.lang.t('$vuetify.CANCELAR')"
        :save-text="$vuetify.lang.t('$vuetify.SALVAR')"
      > {{ props.item.uf_origem }}
        <template v-slot:input>
          <v-text-field
            v-model="props.item.uf_origem"
            :label="$vuetify.lang.t('$vuetify.EDITAR')"
            single-line
          ></v-text-field>
        </template>
      </v-edit-dialog>
    </template>

    <template
      v-slot:item.cep_origem="props"
      v-if="editable"
    >
      <v-edit-dialog
        :return-value.sync="props.item.cep_origem"
        large
        :cancel-text="$vuetify.lang.t('$vuetify.CANCELAR')"
        :save-text="$vuetify.lang.t('$vuetify.SALVAR')"
      > {{ props.item.cep_origem }}
        <template v-slot:input>
          <v-text-field
            v-model="props.item.cep_origem"
            :label="$vuetify.lang.t('$vuetify.EDITAR')"
            single-line
          ></v-text-field>
        </template>
      </v-edit-dialog>
    </template>

    <template
      v-slot:item.contato_origem="props"
      v-if="editable"
    >
      <v-edit-dialog
        :return-value.sync="props.item.contato_origem"
        large
        :cancel-text="$vuetify.lang.t('$vuetify.CANCELAR')"
        :save-text="$vuetify.lang.t('$vuetify.SALVAR')"
      > {{ props.item.contato_origem }}
        <template v-slot:input>
          <v-text-field
            v-model="props.item.contato_origem"
            :label="$vuetify.lang.t('$vuetify.EDITAR')"
            single-line
          ></v-text-field>
        </template>
      </v-edit-dialog>
    </template>

    <template
      v-slot:item.telefone_origem="props"
      v-if="editable"
    >
      <v-edit-dialog
        :return-value.sync="props.item.telefone_origem"
        large
        :cancel-text="$vuetify.lang.t('$vuetify.CANCELAR')"
        :save-text="$vuetify.lang.t('$vuetify.SALVAR')"
      > {{ props.item.telefone_origem }}
        <template v-slot:input>
          <v-text-field
            v-model="props.item.telefone_origem"
            :label="$vuetify.lang.t('$vuetify.EDITAR')"
            single-line
          ></v-text-field>
        </template>
      </v-edit-dialog>
    </template>

    <template
      v-slot:item.endereco_destino="props"
      v-if="editable"
    >
      <v-edit-dialog
        :return-value.sync="props.item.endereco_destino"
        large
        :cancel-text="$vuetify.lang.t('$vuetify.CANCELAR')"
        :save-text="$vuetify.lang.t('$vuetify.SALVAR')"
      > {{ props.item.endereco_destino }}
        <template v-slot:input>
          <v-text-field
            v-model="props.item.endereco_destino"
            :label="$vuetify.lang.t('$vuetify.EDITAR')"
            single-line
          ></v-text-field>
        </template>
      </v-edit-dialog>
    </template>

    <template
      v-slot:item.bairro_destino="props"
      v-if="editable"
    >
      <v-edit-dialog
        :return-value.sync="props.item.bairro_destino"
        large
        :cancel-text="$vuetify.lang.t('$vuetify.CANCELAR')"
        :save-text="$vuetify.lang.t('$vuetify.SALVAR')"
      > {{ props.item.bairro_destino }}
        <template v-slot:input>
          <v-text-field
            v-model="props.item.bairro_destino"
            :label="$vuetify.lang.t('$vuetify.EDITAR')"
            single-line
          ></v-text-field>
        </template>
      </v-edit-dialog>
    </template>

    <template
      v-slot:item.cidade_destino="props"
      v-if="editable"
    >
      <v-edit-dialog
        :return-value.sync="props.item.cidade_destino"
        large
        :cancel-text="$vuetify.lang.t('$vuetify.CANCELAR')"
        :save-text="$vuetify.lang.t('$vuetify.SALVAR')"
      > {{ props.item.cidade_destino }}
        <template v-slot:input>
          <v-text-field
            v-model="props.item.cidade_destino"
            :label="$vuetify.lang.t('$vuetify.EDITAR')"
            single-line
          ></v-text-field>
        </template>
      </v-edit-dialog>
    </template>

    <template
      v-slot:item.uf_destino="props"
      v-if="editable"
    >
      <v-edit-dialog
        :return-value.sync="props.item.uf_destino"
        large
        :cancel-text="$vuetify.lang.t('$vuetify.CANCELAR')"
        :save-text="$vuetify.lang.t('$vuetify.SALVAR')"
      > {{ props.item.uf_destino }}
        <template v-slot:input>
          <v-text-field
            v-model="props.item.uf_destino"
            :label="$vuetify.lang.t('$vuetify.EDITAR')"
            single-line
          ></v-text-field>
        </template>
      </v-edit-dialog>
    </template>

    <template
      v-slot:item.cep_destino="props"
      v-if="editable"
    >
      <v-edit-dialog
        :return-value.sync="props.item.cep_destino"
        large
        :cancel-text="$vuetify.lang.t('$vuetify.CANCELAR')"
        :save-text="$vuetify.lang.t('$vuetify.SALVAR')"
      > {{ props.item.cep_destino }}
        <template v-slot:input>
          <v-text-field
            v-model="props.item.cep_destino"
            :label="$vuetify.lang.t('$vuetify.EDITAR')"
            single-line
          ></v-text-field>
        </template>
      </v-edit-dialog>
    </template>

    <template
      v-slot:item.contato_destino="props"
      v-if="editable"
    >
      <v-edit-dialog
        :return-value.sync="props.item.contato_destino"
        large
        :cancel-text="$vuetify.lang.t('$vuetify.CANCELAR')"
        :save-text="$vuetify.lang.t('$vuetify.SALVAR')"
      > {{ props.item.contato_destino }}
        <template v-slot:input>
          <v-text-field
            v-model="props.item.contato_destino"
            :label="$vuetify.lang.t('$vuetify.EDITAR')"
            single-line
          ></v-text-field>
        </template>
      </v-edit-dialog>
    </template>

    <template
      v-slot:item.telefone_destino="props"
      v-if="editable"
    >
      <v-edit-dialog
        :return-value.sync="props.item.telefone_destino"
        large
        :cancel-text="$vuetify.lang.t('$vuetify.CANCELAR')"
        :save-text="$vuetify.lang.t('$vuetify.SALVAR')"
      > {{ props.item.telefone_destino }}
        <template v-slot:input>
          <v-text-field
            v-model="props.item.telefone_destino"
            :label="$vuetify.lang.t('$vuetify.EDITAR')"
            single-line
          ></v-text-field>
        </template>
      </v-edit-dialog>
    </template>

    <template
      v-slot:item.endereco_instalacao="props"
      v-if="editable"
    >
      <v-edit-dialog
        :return-value.sync="props.item.endereco_instalacao"
        large
        :cancel-text="$vuetify.lang.t('$vuetify.CANCELAR')"
        :save-text="$vuetify.lang.t('$vuetify.SALVAR')"
      > {{ props.item.endereco_instalacao }}
        <template v-slot:input>
          <v-text-field
            v-model="props.item.endereco_instalacao"
            :label="$vuetify.lang.t('$vuetify.EDITAR')"
            single-line
          ></v-text-field>
        </template>
      </v-edit-dialog>
    </template>

    <template
      v-slot:item.bairro_instalacao="props"
      v-if="editable"
    >
      <v-edit-dialog
        :return-value.sync="props.item.bairro_instalacao"
        large
        :cancel-text="$vuetify.lang.t('$vuetify.CANCELAR')"
        :save-text="$vuetify.lang.t('$vuetify.SALVAR')"
      > {{ props.item.bairro_instalacao }}
        <template v-slot:input>
          <v-text-field
            v-model="props.item.bairro_instalacao"
            :label="$vuetify.lang.t('$vuetify.EDITAR')"
            single-line
          ></v-text-field>
        </template>
      </v-edit-dialog>
    </template>

    <template
      v-slot:item.cidade_instalacao="props"
      v-if="editable"
    >
      <v-edit-dialog
        :return-value.sync="props.item.cidade_instalacao"
        large
        :cancel-text="$vuetify.lang.t('$vuetify.CANCELAR')"
        :save-text="$vuetify.lang.t('$vuetify.SALVAR')"
      > {{ props.item.cidade_instalacao }}
        <template v-slot:input>
          <v-text-field
            v-model="props.item.cidade_instalacao"
            :label="$vuetify.lang.t('$vuetify.EDITAR')"
            single-line
          ></v-text-field>
        </template>
      </v-edit-dialog>
    </template>

    <template
      v-slot:item.uf_instalacao="props"
      v-if="editable"
    >
      <v-edit-dialog
        :return-value.sync="props.item.uf_instalacao"
        large
        :cancel-text="$vuetify.lang.t('$vuetify.CANCELAR')"
        :save-text="$vuetify.lang.t('$vuetify.SALVAR')"
      > {{ props.item.uf_instalacao }}
        <template v-slot:input>
          <v-text-field
            v-model="props.item.uf_instalacao"
            :label="$vuetify.lang.t('$vuetify.EDITAR')"
            single-line
          ></v-text-field>
        </template>
      </v-edit-dialog>
    </template>

    <template
      v-slot:item.cep_instalacao="props"
      v-if="editable"
    >
      <v-edit-dialog
        :return-value.sync="props.item.cep_instalacao"
        large
        :cancel-text="$vuetify.lang.t('$vuetify.CANCELAR')"
        :save-text="$vuetify.lang.t('$vuetify.SALVAR')"
      > {{ props.item.cep_instalacao }}
        <template v-slot:input>
          <v-text-field
            v-model="props.item.cep_instalacao"
            :label="$vuetify.lang.t('$vuetify.EDITAR')"
            single-line
          ></v-text-field>
        </template>
      </v-edit-dialog>
    </template>

    <template
      v-slot:item.contato_instalacao="props"
      v-if="editable"
    >
      <v-edit-dialog
        :return-value.sync="props.item.contato_instalacao"
        large
        :cancel-text="$vuetify.lang.t('$vuetify.CANCELAR')"
        :save-text="$vuetify.lang.t('$vuetify.SALVAR')"
      > {{ props.item.contato_instalacao }}
        <template v-slot:input>
          <v-text-field
            v-model="props.item.contato_instalacao"
            :label="$vuetify.lang.t('$vuetify.EDITAR')"
            single-line
          ></v-text-field>
        </template>
      </v-edit-dialog>
    </template>

    <template
      v-slot:item.telefone_instalacao="props"
      v-if="editable"
    >
      <v-edit-dialog
        :return-value.sync="props.item.telefone_instalacao"
        large
        :cancel-text="$vuetify.lang.t('$vuetify.CANCELAR')"
        :save-text="$vuetify.lang.t('$vuetify.SALVAR')"
      > {{ props.item.telefone_instalacao }}
        <template v-slot:input>
          <v-text-field
            v-model="props.item.telefone_instalacao"
            :label="$vuetify.lang.t('$vuetify.EDITAR')"
            single-line
          ></v-text-field>
        </template>
      </v-edit-dialog>
    </template>

    <template
      v-slot:item.endereco_remessa="props"
      v-if="editable"
    >
      <v-edit-dialog
        :return-value.sync="props.item.endereco_remessa"
        large
        :cancel-text="$vuetify.lang.t('$vuetify.CANCELAR')"
        :save-text="$vuetify.lang.t('$vuetify.SALVAR')"
      > {{ props.item.endereco_remessa }}
        <template v-slot:input>
          <v-text-field
            v-model="props.item.endereco_remessa"
            :label="$vuetify.lang.t('$vuetify.EDITAR')"
            single-line
          ></v-text-field>
        </template>
      </v-edit-dialog>
    </template>

    <template
      v-slot:item.bairro_remessa="props"
      v-if="editable"
    >
      <v-edit-dialog
        :return-value.sync="props.item.bairro_remessa"
        large
        :cancel-text="$vuetify.lang.t('$vuetify.CANCELAR')"
        :save-text="$vuetify.lang.t('$vuetify.SALVAR')"
      > {{ props.item.bairro_remessa }}
        <template v-slot:input>
          <v-text-field
            v-model="props.item.bairro_remessa"
            :label="$vuetify.lang.t('$vuetify.EDITAR')"
            single-line
          ></v-text-field>
        </template>
      </v-edit-dialog>
    </template>

    <template
      v-slot:item.cidade_remessa="props"
      v-if="editable"
    >
      <v-edit-dialog
        :return-value.sync="props.item.cidade_remessa"
        large
        :cancel-text="$vuetify.lang.t('$vuetify.CANCELAR')"
        :save-text="$vuetify.lang.t('$vuetify.SALVAR')"
      > {{ props.item.cidade_remessa }}
        <template v-slot:input>
          <v-text-field
            v-model="props.item.cidade_remessa"
            :label="$vuetify.lang.t('$vuetify.EDITAR')"
            single-line
          ></v-text-field>
        </template>
      </v-edit-dialog>
    </template>

    <template
      v-slot:item.uf_remessa="props"
      v-if="editable"
    >
      <v-edit-dialog
        :return-value.sync="props.item.uf_remessa"
        large
        :cancel-text="$vuetify.lang.t('$vuetify.CANCELAR')"
        :save-text="$vuetify.lang.t('$vuetify.SALVAR')"
      > {{ props.item.uf_remessa }}
        <template v-slot:input>
          <v-text-field
            v-model="props.item.uf_remessa"
            :label="$vuetify.lang.t('$vuetify.EDITAR')"
            single-line
          ></v-text-field>
        </template>
      </v-edit-dialog>
    </template>

    <template
      v-slot:item.cep_remessa="props"
      v-if="editable"
    >
      <v-edit-dialog
        :return-value.sync="props.item.cep_remessa"
        large
        :cancel-text="$vuetify.lang.t('$vuetify.CANCELAR')"
        :save-text="$vuetify.lang.t('$vuetify.SALVAR')"
      > {{ props.item.cep_remessa }}
        <template v-slot:input>
          <v-text-field
            v-model="props.item.cep_remessa"
            :label="$vuetify.lang.t('$vuetify.EDITAR')"
            single-line
          ></v-text-field>
        </template>
      </v-edit-dialog>
    </template>

    <template
      v-slot:item.contato_remessa="props"
      v-if="editable"
    >
      <v-edit-dialog
        :return-value.sync="props.item.contato_remessa"
        large
        :cancel-text="$vuetify.lang.t('$vuetify.CANCELAR')"
        :save-text="$vuetify.lang.t('$vuetify.SALVAR')"
      > {{ props.item.contato_remessa }}
        <template v-slot:input>
          <v-text-field
            v-model="props.item.contato_remessa"
            :label="$vuetify.lang.t('$vuetify.EDITAR')"
            single-line
          ></v-text-field>
        </template>
      </v-edit-dialog>
    </template>

    <template
      v-slot:item.telefone_remessa="props"
      v-if="editable"
    >
      <v-edit-dialog
        :return-value.sync="props.item.telefone_remessa"
        large
        :cancel-text="$vuetify.lang.t('$vuetify.CANCELAR')"
        :save-text="$vuetify.lang.t('$vuetify.SALVAR')"
      > {{ props.item.telefone_remessa }}
        <template v-slot:input>
          <v-text-field
            v-model="props.item.telefone_remessa"
            :label="$vuetify.lang.t('$vuetify.EDITAR')"
            single-line
          ></v-text-field>
        </template>
      </v-edit-dialog>
    </template>

    <template
      v-slot:item.cnpj="props"
      v-if="editable"
    >
      <v-edit-dialog
        :return-value.sync="props.item.cnpj"
        large
        :cancel-text="$vuetify.lang.t('$vuetify.CANCELAR')"
        :save-text="$vuetify.lang.t('$vuetify.SALVAR')"
      > {{ props.item.cnpj }}
        <template v-slot:input>
          <v-text-field
            v-model="props.item.cnpj"
            :label="$vuetify.lang.t('$vuetify.EDITAR')"
            single-line
          ></v-text-field>
        </template>
      </v-edit-dialog>
    </template>

    <template
      v-slot:item.razaoSocial="props"
      v-if="editable"
    >
      <v-edit-dialog
        :return-value.sync="props.item.razaoSocial"
        large
        :cancel-text="$vuetify.lang.t('$vuetify.CANCELAR')"
        :save-text="$vuetify.lang.t('$vuetify.SALVAR')"
      > {{ props.item.razaoSocial }}
        <template v-slot:input>
          <v-text-field
            v-model="props.item.razaoSocial"
            :label="$vuetify.lang.t('$vuetify.EDITAR')"
            single-line
          ></v-text-field>
        </template>
      </v-edit-dialog>
    </template>

    <template
      v-slot:item.nomeFantasia="props"
      v-if="editable"
    >
      <v-edit-dialog
        :return-value.sync="props.item.nomeFantasia"
        large
        :cancel-text="$vuetify.lang.t('$vuetify.CANCELAR')"
        :save-text="$vuetify.lang.t('$vuetify.SALVAR')"
      > {{ props.item.nomeFantasia }}
        <template v-slot:input>
          <v-text-field
            v-model="props.item.nomeFantasia"
            :label="$vuetify.lang.t('$vuetify.EDITAR')"
            single-line
          ></v-text-field>
        </template>
      </v-edit-dialog>
    </template>

    <template
      v-slot:item.inscricaoEstadual="props"
      v-if="editable"
    >
      <v-edit-dialog
        :return-value.sync="props.item.inscricaoEstadual"
        large
        :cancel-text="$vuetify.lang.t('$vuetify.CANCELAR')"
        :save-text="$vuetify.lang.t('$vuetify.SALVAR')"
      > {{ props.item.inscricaoEstadual }}
        <template v-slot:input>
          <v-text-field
            v-model="props.item.inscricaoEstadual"
            :label="$vuetify.lang.t('$vuetify.EDITAR')"
            single-line
          ></v-text-field>
        </template>
      </v-edit-dialog>
    </template>

    <template
      v-slot:item.endereco_fiscal="props"
      v-if="editable"
    >
      <v-edit-dialog
        :return-value.sync="props.item.endereco_fiscal"
        large
        :cancel-text="$vuetify.lang.t('$vuetify.CANCELAR')"
        :save-text="$vuetify.lang.t('$vuetify.SALVAR')"
      > {{ props.item.endereco_fiscal }}
        <template v-slot:input>
          <v-text-field
            v-model="props.item.endereco_fiscal"
            :label="$vuetify.lang.t('$vuetify.EDITAR')"
            single-line
          ></v-text-field>
        </template>
      </v-edit-dialog>
    </template>

    <template
      v-slot:item.bairro_fiscal="props"
      v-if="editable"
    >
      <v-edit-dialog
        :return-value.sync="props.item.bairro_fiscal"
        large
        :cancel-text="$vuetify.lang.t('$vuetify.CANCELAR')"
        :save-text="$vuetify.lang.t('$vuetify.SALVAR')"
      > {{ props.item.bairro_fiscal }}
        <template v-slot:input>
          <v-text-field
            v-model="props.item.bairro_fiscal"
            :label="$vuetify.lang.t('$vuetify.EDITAR')"
            single-line
          ></v-text-field>
        </template>
      </v-edit-dialog>
    </template>

    <template
      v-slot:item.cidade_fiscal="props"
      v-if="editable"
    >
      <v-edit-dialog
        :return-value.sync="props.item.cidade_fiscal"
        large
        :cancel-text="$vuetify.lang.t('$vuetify.CANCELAR')"
        :save-text="$vuetify.lang.t('$vuetify.SALVAR')"
      > {{ props.item.cidade_fiscal }}
        <template v-slot:input>
          <v-text-field
            v-model="props.item.cidade_fiscal"
            :label="$vuetify.lang.t('$vuetify.EDITAR')"
            single-line
          ></v-text-field>
        </template>
      </v-edit-dialog>
    </template>

    <template
      v-slot:item.uf_fiscal="props"
      v-if="editable"
    >
      <v-edit-dialog
        :return-value.sync="props.item.uf_fiscal"
        large
        :cancel-text="$vuetify.lang.t('$vuetify.CANCELAR')"
        :save-text="$vuetify.lang.t('$vuetify.SALVAR')"
      > {{ props.item.uf_fiscal }}
        <template v-slot:input>
          <v-text-field
            v-model="props.item.uf_fiscal"
            :label="$vuetify.lang.t('$vuetify.EDITAR')"
            single-line
          ></v-text-field>
        </template>
      </v-edit-dialog>
    </template>

    <template
      v-slot:item.cep_fiscal="props"
      v-if="editable"
    >
      <v-edit-dialog
        :return-value.sync="props.item.cep_fiscal"
        large
        :cancel-text="$vuetify.lang.t('$vuetify.CANCELAR')"
        :save-text="$vuetify.lang.t('$vuetify.SALVAR')"
      > {{ props.item.cep_fiscal }}
        <template v-slot:input>
          <v-text-field
            v-model="props.item.cep_fiscal"
            :label="$vuetify.lang.t('$vuetify.EDITAR')"
            single-line
          ></v-text-field>
        </template>
      </v-edit-dialog>
    </template>

    <template
      v-slot:item.velocidade_atual="props"
      v-if="editable"
    >
      <v-edit-dialog
        :return-value.sync="props.item.velocidade_atual"
        large
        :cancel-text="$vuetify.lang.t('$vuetify.CANCELAR')"
        :save-text="$vuetify.lang.t('$vuetify.SALVAR')"
      > {{ props.item.velocidade_atual }}
        <template v-slot:input>
          <v-text-field
            v-model="props.item.velocidade_atual"
            :label="$vuetify.lang.t('$vuetify.EDITAR')"
            single-line
          ></v-text-field>
        </template>
      </v-edit-dialog>
    </template>

    <template
      v-slot:item.velocidade_solicitada="props"
      v-if="editable"
    >
      <v-edit-dialog
        :return-value.sync="props.item.velocidade_solicitada"
        large
        :cancel-text="$vuetify.lang.t('$vuetify.CANCELAR')"
        :save-text="$vuetify.lang.t('$vuetify.SALVAR')"
      > {{ props.item.velocidade_solicitada }}
        <template v-slot:input>
          <v-text-field
            v-model="props.item.velocidade_solicitada"
            :label="$vuetify.lang.t('$vuetify.EDITAR')"
            single-line
          ></v-text-field>
        </template>
      </v-edit-dialog>
    </template>

    <template
      v-slot:item.endereco_gerencia="props"
      v-if="editable"
    >
      <v-edit-dialog
        :return-value.sync="props.item.endereco_gerencia"
        large
        :cancel-text="$vuetify.lang.t('$vuetify.CANCELAR')"
        :save-text="$vuetify.lang.t('$vuetify.SALVAR')"
      > {{ props.item.endereco_gerencia }}
        <template v-slot:input>
          <v-text-field
            v-model="props.item.endereco_gerencia"
            :label="$vuetify.lang.t('$vuetify.EDITAR')"
            single-line
          ></v-text-field>
        </template>
      </v-edit-dialog>
    </template>

    <template
      v-slot:item.vlan="props"
      v-if="editable"
    >
      <v-edit-dialog
        :return-value.sync="props.item.vlan"
        large
        :cancel-text="$vuetify.lang.t('$vuetify.CANCELAR')"
        :save-text="$vuetify.lang.t('$vuetify.SALVAR')"
      > {{ props.item.vlan }}
        <template v-slot:input>
          <v-text-field
            v-model="props.item.vlan"
            :label="$vuetify.lang.t('$vuetify.EDITAR')"
            single-line
          ></v-text-field>
        </template>
      </v-edit-dialog>
    </template>

    <template
      v-slot:item.interconexao_tpz="props"
      v-if="editable"
    >
      <v-edit-dialog
        :return-value.sync="props.item.interconexao_tpz"
        large
        :cancel-text="$vuetify.lang.t('$vuetify.CANCELAR')"
        :save-text="$vuetify.lang.t('$vuetify.SALVAR')"
      > {{ props.item.interconexao_tpz }}
        <template v-slot:input>
          <v-text-field
            v-model="props.item.interconexao_tpz"
            :label="$vuetify.lang.t('$vuetify.EDITAR')"
            single-line
          ></v-text-field>
        </template>
      </v-edit-dialog>
    </template>

    <template
      v-slot:item.wan_rede="props"
      v-if="editable"
    >
      <v-edit-dialog
        :return-value.sync="props.item.wan_rede"
        large
        :cancel-text="$vuetify.lang.t('$vuetify.CANCELAR')"
        :save-text="$vuetify.lang.t('$vuetify.SALVAR')"
      > {{ props.item.wan_rede }}
        <template v-slot:input>
          <v-text-field
            v-model="props.item.wan_rede"
            :label="$vuetify.lang.t('$vuetify.EDITAR')"
            single-line
          ></v-text-field>
        </template>
      </v-edit-dialog>
    </template>

    <template
      v-slot:item.endereco_lan="props"
      v-if="editable"
    >
      <v-edit-dialog
        :return-value.sync="props.item.endereco_lan"
        large
        :cancel-text="$vuetify.lang.t('$vuetify.CANCELAR')"
        :save-text="$vuetify.lang.t('$vuetify.SALVAR')"
      > {{ props.item.endereco_lan }}
        <template v-slot:input>
          <v-text-field
            v-model="props.item.endereco_lan"
            :label="$vuetify.lang.t('$vuetify.EDITAR')"
            single-line
          ></v-text-field>
        </template>
      </v-edit-dialog>
    </template>

    <template
      v-slot:item.wan_host="props"
      v-if="editable"
    >
      <v-edit-dialog
        :return-value.sync="props.item.wan_host"
        large
        :cancel-text="$vuetify.lang.t('$vuetify.CANCELAR')"
        :save-text="$vuetify.lang.t('$vuetify.SALVAR')"
      > {{ props.item.wan_host }}
        <template v-slot:input>
          <v-text-field
            v-model="props.item.wan_host"
            :label="$vuetify.lang.t('$vuetify.EDITAR')"
            single-line
          ></v-text-field>
        </template>
      </v-edit-dialog>
    </template>

    <template
      v-slot:item.loopback="props"
      v-if="editable"
    >
      <v-edit-dialog
        :return-value.sync="props.item.loopback"
        large
        :cancel-text="$vuetify.lang.t('$vuetify.CANCELAR')"
        :save-text="$vuetify.lang.t('$vuetify.SALVAR')"
      > {{ props.item.loopback }}
        <template v-slot:input>
          <v-text-field
            v-model="props.item.loopback"
            :label="$vuetify.lang.t('$vuetify.EDITAR')"
            single-line
          ></v-text-field>
        </template>
      </v-edit-dialog>
    </template>

    <template
      v-slot:item.rotas_sumarizadas="props"
      v-if="editable"
    >
      <v-edit-dialog
        :return-value.sync="props.item.rotas_sumarizadas"
        large
        :cancel-text="$vuetify.lang.t('$vuetify.CANCELAR')"
        :save-text="$vuetify.lang.t('$vuetify.SALVAR')"
      > {{ props.item.rotas_sumarizadas }}
        <template v-slot:input>
          <v-text-field
            v-model="props.item.rotas_sumarizadas"
            :label="$vuetify.lang.t('$vuetify.EDITAR')"
            single-line
          ></v-text-field>
        </template>
      </v-edit-dialog>
    </template>

    <template
      v-slot:item.banda="props"
      v-if="editable"
    >
      <v-edit-dialog
        :return-value.sync="props.item.banda"
        large
        :cancel-text="$vuetify.lang.t('$vuetify.CANCELAR')"
        :save-text="$vuetify.lang.t('$vuetify.SALVAR')"
      > {{ props.item.banda }}
        <template v-slot:input>
          <v-text-field
            v-model="props.item.banda"
            :label="$vuetify.lang.t('$vuetify.EDITAR')"
            single-line
          ></v-text-field>
        </template>
      </v-edit-dialog>
    </template>

    <template
      v-slot:item.velocidade="props"
      v-if="editable"
    >
      <v-edit-dialog
        :return-value.sync="props.item.velocidade"
        large
        :cancel-text="$vuetify.lang.t('$vuetify.CANCELAR')"
        :save-text="$vuetify.lang.t('$vuetify.SALVAR')"
      > {{ props.item.velocidade }}
        <template v-slot:input>
          <v-text-field
            v-model="props.item.velocidade"
            :label="$vuetify.lang.t('$vuetify.EDITAR')"
            single-line
          ></v-text-field>
        </template>
      </v-edit-dialog>
    </template>

    <template
      v-slot:item.antena="props"
      v-if="editable"
    >
      <v-edit-dialog
        :return-value.sync="props.item.antena"
        large
        :cancel-text="$vuetify.lang.t('$vuetify.CANCELAR')"
        :save-text="$vuetify.lang.t('$vuetify.SALVAR')"
      > {{ props.item.antena }}
        <template v-slot:input>
          <v-text-field
            v-model="props.item.antena"
            :label="$vuetify.lang.t('$vuetify.EDITAR')"
            single-line
          ></v-text-field>
        </template>
      </v-edit-dialog>
    </template>

    <template
      v-slot:item.buc="props"
      v-if="editable"
    >
      <v-edit-dialog
        :return-value.sync="props.item.buc"
        large
        :cancel-text="$vuetify.lang.t('$vuetify.CANCELAR')"
        :save-text="$vuetify.lang.t('$vuetify.SALVAR')"
      > {{ props.item.buc }}
        <template v-slot:input>
          <v-text-field
            v-model="props.item.buc"
            :label="$vuetify.lang.t('$vuetify.EDITAR')"
            single-line
          ></v-text-field>
        </template>
      </v-edit-dialog>
    </template>

    <template
      v-slot:item.latitude="props"
      v-if="editable"
    >
      <v-edit-dialog
        :return-value.sync="props.item.latitude"
        large
        :cancel-text="$vuetify.lang.t('$vuetify.CANCELAR')"
        :save-text="$vuetify.lang.t('$vuetify.SALVAR')"
      > {{ props.item.latitude }}
        <template v-slot:input>
          <v-text-field
            v-model="props.item.latitude"
            :label="$vuetify.lang.t('$vuetify.EDITAR')"
            single-line
          ></v-text-field>
        </template>
      </v-edit-dialog>
    </template>

    <template
      v-slot:item.longitude="props"
      v-if="editable"
    >
      <v-edit-dialog
        :return-value.sync="props.item.longitude"
        large
        :cancel-text="$vuetify.lang.t('$vuetify.CANCELAR')"
        :save-text="$vuetify.lang.t('$vuetify.SALVAR')"
      > {{ props.item.longitude }}
        <template v-slot:input>
          <v-text-field
            v-model="props.item.longitude"
            :label="$vuetify.lang.t('$vuetify.EDITAR')"
            single-line
          ></v-text-field>
        </template>
      </v-edit-dialog>
    </template>

    <template
      v-slot:item.servico="props"
      v-if="editable"
    >
      <v-edit-dialog
        :return-value.sync="props.item.servico"
        large
        :cancel-text="$vuetify.lang.t('$vuetify.CANCELAR')"
        :save-text="$vuetify.lang.t('$vuetify.SALVAR')"
      > {{ props.item.servico }}
        <template v-slot:input>
          <v-text-field
            v-model="props.item.servico"
            :label="$vuetify.lang.t('$vuetify.EDITAR')"
            single-line
          ></v-text-field>
        </template>
      </v-edit-dialog>
    </template>

    <template
      v-slot:item.endereco="props"
      v-if="editable"
    >
      <v-edit-dialog
        :return-value.sync="props.item.endereco"
        large
        :cancel-text="$vuetify.lang.t('$vuetify.CANCELAR')"
        :save-text="$vuetify.lang.t('$vuetify.SALVAR')"
      > {{ props.item.endereco }}
        <template v-slot:input>
          <v-text-field
            v-model="props.item.endereco"
            :label="$vuetify.lang.t('$vuetify.EDITAR')"
            single-line
          ></v-text-field>
        </template>
      </v-edit-dialog>
    </template>

    <template
      v-slot:item.bairro="props"
      v-if="editable"
    >
      <v-edit-dialog
        :return-value.sync="props.item.bairro"
        large
        :cancel-text="$vuetify.lang.t('$vuetify.CANCELAR')"
        :save-text="$vuetify.lang.t('$vuetify.SALVAR')"
      > {{ props.item.bairro }}
        <template v-slot:input>
          <v-text-field
            v-model="props.item.bairro"
            :label="$vuetify.lang.t('$vuetify.EDITAR')"
            single-line
          ></v-text-field>
        </template>
      </v-edit-dialog>
    </template>

    <template
      v-slot:item.cidade="props"
      v-if="editable"
    >
      <v-edit-dialog
        :return-value.sync="props.item.cidade"
        large
        :cancel-text="$vuetify.lang.t('$vuetify.CANCELAR')"
        :save-text="$vuetify.lang.t('$vuetify.SALVAR')"
      > {{ props.item.cidade }}
        <template v-slot:input>
          <v-text-field
            v-model="props.item.cidade"
            :label="$vuetify.lang.t('$vuetify.EDITAR')"
            single-line
          ></v-text-field>
        </template>
      </v-edit-dialog>
    </template>

    <template
      v-slot:item.uf="props"
      v-if="editable"
    >
      <v-edit-dialog
        :return-value.sync="props.item.uf"
        large
        :cancel-text="$vuetify.lang.t('$vuetify.CANCELAR')"
        :save-text="$vuetify.lang.t('$vuetify.SALVAR')"
      > {{ props.item.uf }}
        <template v-slot:input>
          <v-text-field
            v-model="props.item.uf"
            :label="$vuetify.lang.t('$vuetify.EDITAR')"
            single-line
          ></v-text-field>
        </template>
      </v-edit-dialog>
    </template>

    <template
      v-slot:item.cep="props"
      v-if="editable"
    >
      <v-edit-dialog
        :return-value.sync="props.item.cep"
        large
        :cancel-text="$vuetify.lang.t('$vuetify.CANCELAR')"
        :save-text="$vuetify.lang.t('$vuetify.SALVAR')"
      > {{ props.item.cep }}
        <template v-slot:input>
          <v-text-field
            v-model="props.item.cep"
            :label="$vuetify.lang.t('$vuetify.EDITAR')"
            single-line
          ></v-text-field>
        </template>
      </v-edit-dialog>
    </template>

    <template
      v-slot:item.contato="props"
      v-if="editable"
    >
      <v-edit-dialog
        :return-value.sync="props.item.contato"
        large
        :cancel-text="$vuetify.lang.t('$vuetify.CANCELAR')"
        :save-text="$vuetify.lang.t('$vuetify.SALVAR')"
      > {{ props.item.contato }}
        <template v-slot:input>
          <v-text-field
            v-model="props.item.contato"
            :label="$vuetify.lang.t('$vuetify.EDITAR')"
            single-line
          ></v-text-field>
        </template>
      </v-edit-dialog>
    </template>

    <template
      v-slot:item.telefone="props"
      v-if="editable"
    >
      <v-edit-dialog
        :return-value.sync="props.item.telefone"
        large
        :cancel-text="$vuetify.lang.t('$vuetify.CANCELAR')"
        :save-text="$vuetify.lang.t('$vuetify.SALVAR')"
      > {{ props.item.telefone }}
        <template v-slot:input>
          <v-text-field
            v-model="props.item.telefone"
            :label="$vuetify.lang.t('$vuetify.EDITAR')"
            single-line
          ></v-text-field>
        </template>
      </v-edit-dialog>
    </template>

    <template
      v-slot:item.observacao="props"
      v-if="editable"
    >
      <v-edit-dialog
        :return-value.sync="props.item.observacao"
        large
        :cancel-text="$vuetify.lang.t('$vuetify.CANCELAR')"
        :save-text="$vuetify.lang.t('$vuetify.SALVAR')"
      > {{ props.item.observacao }}
        <template v-slot:input>
          <v-text-field
            v-model="props.item.observacao"
            :label="$vuetify.lang.t('$vuetify.EDITAR')"
            single-line
          ></v-text-field>
        </template>
      </v-edit-dialog>
    </template>
  </v-data-table>
</template>

<script>

export default {
  props: {
    headers: Array,
    entityList: Array,
    actionName: String,
    deleteItem: Function,
    editable: Boolean,
  },
  methods: {
    save () {

    },
    cancel () {

    }
  },
  data: () => ({
  }),
};
</script>

<style>
td {
  border-bottom: thin solid rgba(0, 0, 0, 0.12) !important;
  border-right: thin solid rgba(0, 0, 0, 0.12) !important;
}

td:hover {
  background: rgb(195, 219, 226) !important;
}
</style>