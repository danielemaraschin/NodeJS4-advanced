const roteador = require('express').Router({ mergeParams: true }) //merge = junta os parametros que ta nivel acima com o roteador daqui 
const Tabela = require('./TabelaProduto')
const Produto = require('./Produto') //chamar a classe

roteador.get('/', async(requisicao, resposta) => {
    const produtos = await Tabela.listar(requisicao.params.idFornecedor)
    resposta.send(
        JSON.stringify(produtos)
    )
})
// Vamos trabalhar na raiz da requisicao por isso '/'
roteador.post('/', async (requisicao, resposta) => {
    const idFornecedor = requisicao.params.idFornecedor
    const corpo = requisicao.body
    const dados = Object.assign({}, corpo, {fornecedor: idFornecedor}) //temos a coluna fornecedor na tb produtos
    const produto = new Produto(dados)    //instanciar a classe produto
    await produto.criar()
    resposta.status(201)
    resposta.send(produto)
 })

roteador.delete('/:id', async (requisicao, resposta) => {
    const dados = {             //dados que temos nesse momento
        id: requisicao.params.id,
        fornecedor:requisicao.params.idFornecedor
    }
    const produto = new Produto(dados) //instanciar a classe
    await produto.apagar() //espera terminar de executar a funcao para apagar
    resposta.status(204) //204: foi um sucesso mas nao tem corpo de resposta
    resposta.end()
})


const roteadorReclamacoes = require('./reclamacoes')
roteador.use('/:idProduto/reclamacoes', roteadorReclamacoes)

module.exports = roteador

/*arquivo de rota de produtos*/