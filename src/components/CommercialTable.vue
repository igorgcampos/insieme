<template>
  <v-data-table
    :headers="headers"
    :items="entityList"
    dense
    fixed-header
    :height="actionName!='NOVO_CIRCUITO'?260:220"
    class="ml-4 mr-4"
    max-width="600"
    no-data-text=""
  >
    <template v-slot:item.actions="{ item }">
      <v-icon
        small
        @click="deleteItem(item)"
      >
        mdi-delete
      </v-icon>
    </template>

    <template
      v-slot:item.designacaoCliente="props"
      v-if="actionName == 'NOVO_CIRCUITO'"
    >
      <v-edit-dialog :return-value.sync="props.item.designacaoCliente"> {{ props.item.designacaoCliente }}
        <template v-slot:input>
          <v-text-field
            v-model="props.item.designacaoCliente"
            :label="$vuetify.lang.t('$vuetify.EDITAR')"
            single-line
          ></v-text-field>
        </template>
      </v-edit-dialog>
    </template>

    <template v-slot:item.tipo_remanejamento="props">
      <v-edit-dialog :return-value.sync="props.item.tipo_remanejamento"> {{ props.item.tipo_remanejamento }}
        <template v-slot:input>
          <v-text-field
            v-model="props.item.tipo_remanejamento"
            :label="$vuetify.lang.t('$vuetify.EDITAR')"
            single-line
          ></v-text-field>
        </template>
      </v-edit-dialog>
    </template>

    <template v-slot:item.endereco_origem="props">
      <v-edit-dialog :return-value.sync="props.item.endereco_origem"> {{ props.item.endereco_origem }}
        <template v-slot:input>
          <v-text-field
            v-model="props.item.endereco_origem"
            :label="$vuetify.lang.t('$vuetify.EDITAR')"
            single-line
          ></v-text-field>
        </template>
      </v-edit-dialog>
    </template>

    <template v-slot:item.bairro_origem="props">
      <v-edit-dialog :return-value.sync="props.item.bairro_origem"> {{ props.item.bairro_origem }}
        <template v-slot:input>
          <v-text-field
            v-model="props.item.bairro_origem"
            :label="$vuetify.lang.t('$vuetify.EDITAR')"
            single-line
          ></v-text-field>
        </template>
      </v-edit-dialog>
    </template>

    <template v-slot:item.cidade_origem="props">
      <v-edit-dialog :return-value.sync="props.item.cidade_origem"> {{ props.item.cidade_origem }}
        <template v-slot:input>
          <v-text-field
            v-model="props.item.cidade_origem"
            :label="$vuetify.lang.t('$vuetify.EDITAR')"
            single-line
          ></v-text-field>
        </template>
      </v-edit-dialog>
    </template>

    <template v-slot:item.uf_origem="props">
      <v-edit-dialog :return-value.sync="props.item.uf_origem"> {{ props.item.uf_origem }}
        <template v-slot:input>
          <v-text-field
            v-model="props.item.uf_origem"
            :label="$vuetify.lang.t('$vuetify.EDITAR')"
            single-line
          ></v-text-field>
        </template>
      </v-edit-dialog>
    </template>

    <template v-slot:item.cep_origem="props">
      <v-edit-dialog :return-value.sync="props.item.cep_origem"> {{ props.item.cep_origem }}
        <template v-slot:input>
          <v-text-field
            v-model="props.item.cep_origem"
            :label="$vuetify.lang.t('$vuetify.EDITAR')"
            single-line
          ></v-text-field>
        </template>
      </v-edit-dialog>
    </template>

    <template v-slot:item.contato_origem="props">
      <v-edit-dialog :return-value.sync="props.item.contato_origem"> {{ props.item.contato_origem }}
        <template v-slot:input>
          <v-text-field
            v-model="props.item.contato_origem"
            :label="$vuetify.lang.t('$vuetify.EDITAR')"
            single-line
          ></v-text-field>
        </template>
      </v-edit-dialog>
    </template>

    <template v-slot:item.telefone_origem="props">
      <v-edit-dialog :return-value.sync="props.item.telefone_origem"> {{ props.item.telefone_origem }}
        <template v-slot:input>
          <v-text-field
            v-model="props.item.telefone_origem"
            :label="$vuetify.lang.t('$vuetify.EDITAR')"
            single-line
          ></v-text-field>
        </template>
      </v-edit-dialog>
    </template>

    <template v-slot:item.endereco_destino="props">
      <v-edit-dialog :return-value.sync="props.item.endereco_destino"> {{ props.item.endereco_destino }}
        <template v-slot:input>
          <v-text-field
            v-model="props.item.endereco_destino"
            :label="$vuetify.lang.t('$vuetify.EDITAR')"
            single-line
          ></v-text-field>
        </template>
      </v-edit-dialog>
    </template>

    <template v-slot:item.bairro_destino="props">
      <v-edit-dialog :return-value.sync="props.item.bairro_destino"> {{ props.item.bairro_destino }}
        <template v-slot:input>
          <v-text-field
            v-model="props.item.bairro_destino"
            :label="$vuetify.lang.t('$vuetify.EDITAR')"
            single-line
          ></v-text-field>
        </template>
      </v-edit-dialog>
    </template>

    <template v-slot:item.cidade_destino="props">
      <v-edit-dialog :return-value.sync="props.item.cidade_destino"> {{ props.item.cidade_destino }}
        <template v-slot:input>
          <v-text-field
            v-model="props.item.cidade_destino"
            :label="$vuetify.lang.t('$vuetify.EDITAR')"
            single-line
          ></v-text-field>
        </template>
      </v-edit-dialog>
    </template>

    <template v-slot:item.uf_destino="props">
      <v-edit-dialog :return-value.sync="props.item.uf_destino"> {{ props.item.uf_destino }}
        <template v-slot:input>
          <v-text-field
            v-model="props.item.uf_destino"
            :label="$vuetify.lang.t('$vuetify.EDITAR')"
            single-line
          ></v-text-field>
        </template>
      </v-edit-dialog>
    </template>

    <template v-slot:item.cep_destino="props">
      <v-edit-dialog :return-value.sync="props.item.cep_destino"> {{ props.item.cep_destino }}
        <template v-slot:input>
          <v-text-field
            v-model="props.item.cep_destino"
            :label="$vuetify.lang.t('$vuetify.EDITAR')"
            single-line
          ></v-text-field>
        </template>
      </v-edit-dialog>
    </template>

    <template v-slot:item.contato_destino="props">
      <v-edit-dialog :return-value.sync="props.item.contato_destino"> {{ props.item.contato_destino }}
        <template v-slot:input>
          <v-text-field
            v-model="props.item.contato_destino"
            :label="$vuetify.lang.t('$vuetify.EDITAR')"
            single-line
          ></v-text-field>
        </template>
      </v-edit-dialog>
    </template>

    <template v-slot:item.telefone_destino="props">
      <v-edit-dialog :return-value.sync="props.item.telefone_destino"> {{ props.item.telefone_destino }}
        <template v-slot:input>
          <v-text-field
            v-model="props.item.telefone_destino"
            :label="$vuetify.lang.t('$vuetify.EDITAR')"
            single-line
          ></v-text-field>
        </template>
      </v-edit-dialog>
    </template>

    <template v-slot:item.endereco_instalacao="props">
      <v-edit-dialog :return-value.sync="props.item.endereco_instalacao"> {{ props.item.endereco_instalacao }}
        <template v-slot:input>
          <v-text-field
            v-model="props.item.endereco_instalacao"
            :label="$vuetify.lang.t('$vuetify.EDITAR')"
            single-line
          ></v-text-field>
        </template>
      </v-edit-dialog>
    </template>

    <template v-slot:item.bairro_instalacao="props">
      <v-edit-dialog :return-value.sync="props.item.bairro_instalacao"> {{ props.item.bairro_instalacao }}
        <template v-slot:input>
          <v-text-field
            v-model="props.item.bairro_instalacao"
            :label="$vuetify.lang.t('$vuetify.EDITAR')"
            single-line
          ></v-text-field>
        </template>
      </v-edit-dialog>
    </template>

    <template v-slot:item.cidade_instalacao="props">
      <v-edit-dialog :return-value.sync="props.item.cidade_instalacao"> {{ props.item.cidade_instalacao }}
        <template v-slot:input>
          <v-text-field
            v-model="props.item.cidade_instalacao"
            :label="$vuetify.lang.t('$vuetify.EDITAR')"
            single-line
          ></v-text-field>
        </template>
      </v-edit-dialog>
    </template>

    <template v-slot:item.uf_instalacao="props">
      <v-edit-dialog :return-value.sync="props.item.uf_instalacao"> {{ props.item.uf_instalacao }}
        <template v-slot:input>
          <v-text-field
            v-model="props.item.uf_instalacao"
            :label="$vuetify.lang.t('$vuetify.EDITAR')"
            single-line
          ></v-text-field>
        </template>
      </v-edit-dialog>
    </template>

    <template v-slot:item.cep_instalacao="props">
      <v-edit-dialog :return-value.sync="props.item.cep_instalacao"> {{ props.item.cep_instalacao }}
        <template v-slot:input>
          <v-text-field
            v-model="props.item.cep_instalacao"
            :label="$vuetify.lang.t('$vuetify.EDITAR')"
            single-line
          ></v-text-field>
        </template>
      </v-edit-dialog>
    </template>

    <template v-slot:item.contato_instalacao="props">
      <v-edit-dialog :return-value.sync="props.item.contato_instalacao"> {{ props.item.contato_instalacao }}
        <template v-slot:input>
          <v-text-field
            v-model="props.item.contato_instalacao"
            :label="$vuetify.lang.t('$vuetify.EDITAR')"
            single-line
          ></v-text-field>
        </template>
      </v-edit-dialog>
    </template>

    <template v-slot:item.telefone_instalacao="props">
      <v-edit-dialog :return-value.sync="props.item.telefone_instalacao"> {{ props.item.telefone_instalacao }}
        <template v-slot:input>
          <v-text-field
            v-model="props.item.telefone_instalacao"
            :label="$vuetify.lang.t('$vuetify.EDITAR')"
            single-line
          ></v-text-field>
        </template>
      </v-edit-dialog>
    </template>

    <template v-slot:item.endereco_remessa="props">
      <v-edit-dialog :return-value.sync="props.item.endereco_remessa"> {{ props.item.endereco_remessa }}
        <template v-slot:input>
          <v-text-field
            v-model="props.item.endereco_remessa"
            :label="$vuetify.lang.t('$vuetify.EDITAR')"
            single-line
          ></v-text-field>
        </template>
      </v-edit-dialog>
    </template>

    <template v-slot:item.bairro_remessa="props">
      <v-edit-dialog :return-value.sync="props.item.bairro_remessa"> {{ props.item.bairro_remessa }}
        <template v-slot:input>
          <v-text-field
            v-model="props.item.bairro_remessa"
            :label="$vuetify.lang.t('$vuetify.EDITAR')"
            single-line
          ></v-text-field>
        </template>
      </v-edit-dialog>
    </template>

    <template v-slot:item.cidade_remessa="props">
      <v-edit-dialog :return-value.sync="props.item.cidade_remessa"> {{ props.item.cidade_remessa }}
        <template v-slot:input>
          <v-text-field
            v-model="props.item.cidade_remessa"
            :label="$vuetify.lang.t('$vuetify.EDITAR')"
            single-line
          ></v-text-field>
        </template>
      </v-edit-dialog>
    </template>

    <template v-slot:item.uf_remessa="props">
      <v-edit-dialog :return-value.sync="props.item.uf_remessa"> {{ props.item.uf_remessa }}
        <template v-slot:input>
          <v-text-field
            v-model="props.item.uf_remessa"
            :label="$vuetify.lang.t('$vuetify.EDITAR')"
            single-line
          ></v-text-field>
        </template>
      </v-edit-dialog>
    </template>

    <template v-slot:item.cep_remessa="props">
      <v-edit-dialog :return-value.sync="props.item.cep_remessa"> {{ props.item.cep_remessa }}
        <template v-slot:input>
          <v-text-field
            v-model="props.item.cep_remessa"
            :label="$vuetify.lang.t('$vuetify.EDITAR')"
            single-line
          ></v-text-field>
        </template>
      </v-edit-dialog>
    </template>

    <template v-slot:item.contato_remessa="props">
      <v-edit-dialog :return-value.sync="props.item.contato_remessa"> {{ props.item.contato_remessa }}
        <template v-slot:input>
          <v-text-field
            v-model="props.item.contato_remessa"
            :label="$vuetify.lang.t('$vuetify.EDITAR')"
            single-line
          ></v-text-field>
        </template>
      </v-edit-dialog>
    </template>

    <template v-slot:item.telefone_remessa="props">
      <v-edit-dialog :return-value.sync="props.item.telefone_remessa"> {{ props.item.telefone_remessa }}
        <template v-slot:input>
          <v-text-field
            v-model="props.item.telefone_remessa"
            :label="$vuetify.lang.t('$vuetify.EDITAR')"
            single-line
          ></v-text-field>
        </template>
      </v-edit-dialog>
    </template>

    <template v-slot:item.cnpj="props">
      <v-edit-dialog :return-value.sync="props.item.cnpj"> {{ props.item.cnpj }}
        <template v-slot:input>
          <v-text-field
            v-model="props.item.cnpj"
            :label="$vuetify.lang.t('$vuetify.EDITAR')"
            single-line
          ></v-text-field>
        </template>
      </v-edit-dialog>
    </template>

    <template v-slot:item.razaoSocial="props">
      <v-edit-dialog :return-value.sync="props.item.razaoSocial"> {{ props.item.razaoSocial }}
        <template v-slot:input>
          <v-text-field
            v-model="props.item.razaoSocial"
            :label="$vuetify.lang.t('$vuetify.EDITAR')"
            single-line
          ></v-text-field>
        </template>
      </v-edit-dialog>
    </template>

    <template v-slot:item.nomeFantasia="props">
      <v-edit-dialog :return-value.sync="props.item.nomeFantasia"> {{ props.item.nomeFantasia }}
        <template v-slot:input>
          <v-text-field
            v-model="props.item.nomeFantasia"
            :label="$vuetify.lang.t('$vuetify.EDITAR')"
            single-line
          ></v-text-field>
        </template>
      </v-edit-dialog>
    </template>

    <template v-slot:item.inscricaoEstadual="props">
      <v-edit-dialog :return-value.sync="props.item.inscricaoEstadual"> {{ props.item.inscricaoEstadual }}
        <template v-slot:input>
          <v-text-field
            v-model="props.item.inscricaoEstadual"
            :label="$vuetify.lang.t('$vuetify.EDITAR')"
            single-line
          ></v-text-field>
        </template>
      </v-edit-dialog>
    </template>

    <template v-slot:item.endereco_fiscal="props">
      <v-edit-dialog :return-value.sync="props.item.endereco_fiscal"> {{ props.item.endereco_fiscal }}
        <template v-slot:input>
          <v-text-field
            v-model="props.item.endereco_fiscal"
            :label="$vuetify.lang.t('$vuetify.EDITAR')"
            single-line
          ></v-text-field>
        </template>
      </v-edit-dialog>
    </template>

    <template v-slot:item.bairro_fiscal="props">
      <v-edit-dialog :return-value.sync="props.item.bairro_fiscal"> {{ props.item.bairro_fiscal }}
        <template v-slot:input>
          <v-text-field
            v-model="props.item.bairro_fiscal"
            :label="$vuetify.lang.t('$vuetify.EDITAR')"
            single-line
          ></v-text-field>
        </template>
      </v-edit-dialog>
    </template>

    <template v-slot:item.cidade_fiscal="props">
      <v-edit-dialog :return-value.sync="props.item.cidade_fiscal"> {{ props.item.cidade_fiscal }}
        <template v-slot:input>
          <v-text-field
            v-model="props.item.cidade_fiscal"
            :label="$vuetify.lang.t('$vuetify.EDITAR')"
            single-line
          ></v-text-field>
        </template>
      </v-edit-dialog>
    </template>

    <template v-slot:item.uf_fiscal="props">
      <v-edit-dialog :return-value.sync="props.item.uf_fiscal"> {{ props.item.uf_fiscal }}
        <template v-slot:input>
          <v-text-field
            v-model="props.item.uf_fiscal"
            :label="$vuetify.lang.t('$vuetify.EDITAR')"
            single-line
          ></v-text-field>
        </template>
      </v-edit-dialog>
    </template>

    <template v-slot:item.cep_fiscal="props">
      <v-edit-dialog :return-value.sync="props.item.cep_fiscal"> {{ props.item.cep_fiscal }}
        <template v-slot:input>
          <v-text-field
            v-model="props.item.cep_fiscal"
            :label="$vuetify.lang.t('$vuetify.EDITAR')"
            single-line
          ></v-text-field>
        </template>
      </v-edit-dialog>
    </template>

    <template v-slot:item.endereco_gerencia="props">
      <v-edit-dialog :return-value.sync="props.item.endereco_gerencia"> {{ props.item.endereco_gerencia }}
        <template v-slot:input>
          <v-text-field
            v-model="props.item.endereco_gerencia"
            :label="$vuetify.lang.t('$vuetify.EDITAR')"
            single-line
          ></v-text-field>
        </template>
      </v-edit-dialog>
    </template>

    <template v-slot:item.vlan="props">
      <v-edit-dialog :return-value.sync="props.item.vlan"> {{ props.item.vlan }}
        <template v-slot:input>
          <v-text-field
            v-model="props.item.vlan"
            :label="$vuetify.lang.t('$vuetify.EDITAR')"
            single-line
          ></v-text-field>
        </template>
      </v-edit-dialog>
    </template>

    <template v-slot:item.interconexao_tpz="props">
      <v-edit-dialog :return-value.sync="props.item.interconexao_tpz"> {{ props.item.interconexao_tpz }}
        <template v-slot:input>
          <v-text-field
            v-model="props.item.interconexao_tpz"
            :label="$vuetify.lang.t('$vuetify.EDITAR')"
            single-line
          ></v-text-field>
        </template>
      </v-edit-dialog>
    </template>

    <template v-slot:item.wan_rede="props">
      <v-edit-dialog :return-value.sync="props.item.wan_rede"> {{ props.item.wan_rede }}
        <template v-slot:input>
          <v-text-field
            v-model="props.item.wan_rede"
            :label="$vuetify.lang.t('$vuetify.EDITAR')"
            single-line
          ></v-text-field>
        </template>
      </v-edit-dialog>
    </template>

    <template v-slot:item.endereco_lan="props">
      <v-edit-dialog :return-value.sync="props.item.endereco_lan"> {{ props.item.endereco_lan }}
        <template v-slot:input>
          <v-text-field
            v-model="props.item.endereco_lan"
            :label="$vuetify.lang.t('$vuetify.EDITAR')"
            single-line
          ></v-text-field>
        </template>
      </v-edit-dialog>
    </template>

    <template v-slot:item.wan_host="props">
      <v-edit-dialog :return-value.sync="props.item.wan_host"> {{ props.item.wan_host }}
        <template v-slot:input>
          <v-text-field
            v-model="props.item.wan_host"
            :label="$vuetify.lang.t('$vuetify.EDITAR')"
            single-line
          ></v-text-field>
        </template>
      </v-edit-dialog>
    </template>

    <template v-slot:item.loopback="props">
      <v-edit-dialog :return-value.sync="props.item.loopback"> {{ props.item.loopback }}
        <template v-slot:input>
          <v-text-field
            v-model="props.item.loopback"
            :label="$vuetify.lang.t('$vuetify.EDITAR')"
            single-line
          ></v-text-field>
        </template>
      </v-edit-dialog>
    </template>

    <template v-slot:item.rotas_sumarizadas="props">
      <v-edit-dialog :return-value.sync="props.item.rotas_sumarizadas"> {{ props.item.rotas_sumarizadas }}
        <template v-slot:input>
          <v-text-field
            v-model="props.item.rotas_sumarizadas"
            :label="$vuetify.lang.t('$vuetify.EDITAR')"
            single-line
          ></v-text-field>
        </template>
      </v-edit-dialog>
    </template>

    <template v-slot:item.observacao="props">
      <v-edit-dialog :return-value.sync="props.item.observacao"> {{ props.item.observacao }}
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
  },
  methods: {
  },
  data: () => ({
  }),
};
</script>