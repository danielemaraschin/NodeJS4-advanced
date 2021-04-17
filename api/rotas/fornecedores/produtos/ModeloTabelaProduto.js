const Sequelize = require('sequelize')
const instancia = require('../../../banco-de-dados') // instancia do db
const colunas = {
    titulo: {
        type: Sequelize.STRING,
        allowNull: false
    },
    preco: {
        type: Sequelize.DOUBLE, //2 casas dps da virgula
        allowNull: false
    },
    estoque: {
        type: Sequelize.INTEGER, //numerointeiro
        allowNull: false,
        defaultValue: 0
    },
    fornecedor: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
            model: require('../ModeloTabelaFornecedor'),
            key: 'id'
        }
    }
}

const opcoes = {
    freezeTableName: true,
    tableName: 'produtos',
    timestamps: true, //ativando marcas de tempo
    createdAt: 'dataCriacao',
    updatedAt: 'dataAtualizacao',
    version: 'versao'
}
//so exportar 'colunas' nao vai criar a tb pq precisa conectar com a instancia do db 
//entao exportar ligando com o banco de dados
//define a instancia do sequelize é definir o modelo da tabela
module.exports = instancia.define('produto', colunas, opcoes)
//1param: nome do modelo /2param: colunas/3param: outras config