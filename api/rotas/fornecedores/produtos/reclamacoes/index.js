const roteador = require('express').Router()
const Tabela = require('../TabelaProduto')

roteador.get('/', (requisicao, resposta) => {
    resposta.send(
        JSON.stringify([])
    )
})
module.exports = roteador