const roteador = require('express').Router({mergeParams: true}) //merge = junta os parametros que ta nivel acima com o roteador daqui 
const Tabela = require('./TabelaProduto')

roteador.get('/', async(requisicao, resposta) => {
    const produtos = await Tabela.listar(requisicao.params.idFornecedor)
    resposta.send(
        JSON.stringify(produtos)
    )
})

module.exports = roteador