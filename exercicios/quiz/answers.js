const Sequelize = require('sequelize')
const instancia = require('../../banco-de-dados')
const colunas = {
  resposta: {
    type: Sequelize.STRING,
    allowNull: false
  },
  pergunta: {
    type: Sequelize.INTEGER,
    allowNull: false,
    references: {
      model: require('../ModeloTabelaPergunta'),
      key: 'id'
    }
  }
}

module.exports = instancia.define('resposta', colunas)