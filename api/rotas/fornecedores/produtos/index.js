const roteador = require('express').Router({mergeParams: true}) //merge = junta os parametros que ta nivel acima com o roteador daqui 
const Tabela = require('./TabelaProduto')

roteador.get('/', async(requisicao, resposta) => {
    const produtos = await Tabela.listar(requisicao.params.idFornecedor)
    resposta.send(
        JSON.stringify(produtos)
    )
})

roteador.post('/', (requisicao, resposta) => {
    const idFornecedor = require.params.idFornecedor
    resposta.send(JSON.stringify())
})

roteador.post('/', async (requisicao, resposta, proximo) => {
    try {
        const dadosRecebidos = requisicao.body
        const fornecedor = new Fornecedor(dadosRecebidos)
        await fornecedor.criar()
        resposta.status(201)
        const serializador = new SerializadorFornecedor(
            resposta.getHeader('Content-Type')
        )
        resposta.send(
            serializador.serializar(fornecedor)
        )
    } catch (erro) {
        proximo(erro)
    }
})





const roteadorReclamacoes = require('./reclamacoes')

roteador.use('/:idProduto/reclamacoes', roteadorReclamacoes)

module.exports = roteador

/*arquivo de rota de produtos*/