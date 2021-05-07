const Sequelize = require('sequelize')
const instancia = require('../../banco-de-dados')
const colunas = {
  nome: { type: Sequelize.STRING },
  titulo: { type: Sequelize.STRING },
  descricao: { type: Sequelize.STRING }
}

module.exports = instancia.define('pergunta', colunas)
/*
Para representar a coleção de perguntas, deve definir uma rota /api/perguntas,
 e para acessar cada documento da coleção, /api/perguntas/:idPergunta. 
 A coleção de respostas, fica em /api/perguntas/:idPergunta/respostas, 
e para cada documento, /api/perguntas/:idPergunta/respostas/:idResposta.



Alternativa correta! Com isso, conseguimos usar corretamente as coleções de documentos, 
seguidas do identificador de cada documento,
 finalizando com os stores (sub coleções) e seus documentos.

*/