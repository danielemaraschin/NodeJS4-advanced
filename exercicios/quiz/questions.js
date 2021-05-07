const Sequelize = require('sequelize')
const instancia = require('../../banco-de-dados')
const colunas = {
  nome: { type: Sequelize.STRING },
  titulo: { type: Sequelize.STRING },
  descricao: { type: Sequelize.STRING }
}

module.exports = instancia.define('pergunta', colunas)