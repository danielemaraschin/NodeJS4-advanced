const roteador = require('express').Router({mergeParams: true}) //merge = junta os parametros que ta nivel acima com o roteador daqui 
const Tabela = require('./TabelaProduto')

roteador.get('/', async(requisicao, resposta) => {
    const produtos = await Tabela.listar(requisicao.params.idFornecedor)
    resposta.send(
        JSON.stringify(produtos)
    )
})
// Vamos trabalhar na raiz da requisicao por isso '/'
roteador.post('/', (requisicao, resposta) => {
    const idFornecedor = require.params.idFornecedor
    const corpo = require.body
    const dados = Object.assign({}, corpo, {fornecedor: idFornecedor}) //temos a coluna fornecedor na tb produtos
 })


const roteadorReclamacoes = require('./reclamacoes')

roteador.use('/:idProduto/reclamacoes', roteadorReclamacoes)

module.exports = roteador

/*arquivo de rota de produtos*/