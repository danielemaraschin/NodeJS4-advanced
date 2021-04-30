const roteador = require('express').Router({ mergeParams: true }) //merge = junta os parametros que ta nivel acima com o roteador daqui 
const Tabela = require('./TabelaProduto')
const Produto = require('./Produto') //chamar a classe
const SerializadorProduto = require('../../../Serializador').SerializadorProduto //apenas a classe serializadorProdutos


roteador.get('/', async(requisicao, resposta) => { //listagem de produtos
    const produtos = await Tabela.listar(requisicao.fornecedor.id) //fornecedor.id é a instancia já injetada na rota fornecedores
    const serializador = new Serializador( //instancía o serializador
        resposta.getHeader('Content-Type')
    )
    resposta.send(
        serializador.serializar(produtos) //serializador já está instanciado por isso pode chamar aqui
    )
})

// Vamos trabalhar na raiz da requisicao por isso '/' //PROXIMO é o midleware
roteador.post('/', async (requisicao, resposta, proximo) => {
    try{
        const idFornecedor = requisicao.fornecedor.id
        const corpo = requisicao.body
        const dados = Object.assign({}, corpo, {fornecedor: idFornecedor}) //temos a coluna fornecedor na tb produtos
        const produto = new Produto(dados)    //instanciar a classe produto
        await produto.criar()
        resposta.status(201)
        resposta.send(produto)

    } catch(erro) {
        proximo(erro)
    } 
 })

roteador.delete('/:id', async (requisicao, resposta) => {
    const dados = {             //dados que temos nesse momento
        id: requisicao.params.id,
        fornecedor:requisicao.fornecedor.id //fornecedor.id é a instancia já injetada na rota fornecedores
    }
    const produto = new Produto(dados) //instanciar a classe
    await produto.apagar() //espera terminar de executar a funcao para apagar
    resposta.status(204) //204: foi um sucesso mas nao tem corpo de resposta
    resposta.end()
})

roteador.get('/:id', async (requisicao, resposta, proximo) => { //apenas 1 produto entao url com id do produto
    try{
        const dados = {
            id: requisicao.params.id,
            fornecedor: requisicao.fornecedor.id
        }
        const produto = new Produto(dados) //instancia o produto
        await produto.carregar()
        resposta.send(
            JSON.stringify(produto)
        )
    } catch (erro) {
        proximo(erro)
    }
})

const roteadorReclamacoes = require('./reclamacoes')
const Serializador = require('../../../Serializador')
roteador.use('/:idProduto/reclamacoes', roteadorReclamacoes)

module.exports = roteador

/*arquivo de rota de produtos*/