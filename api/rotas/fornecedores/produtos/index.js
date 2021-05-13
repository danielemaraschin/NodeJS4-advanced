const roteador = require('express').Router({ mergeParams: true }) //merge = junta os parametros que ta nivel acima com o roteador daqui 
const Tabela = require('./TabelaProduto')
const Produto = require('./Produto') //chamar a classe
const SerializadorProduto = require('../../../Serializador').SerializadorProduto //apenas a classe serializadorProdutos


roteador.get('/', async (requisicao, resposta) => { //listagem de produtos
    console.log('Im in index produtos');
    const produtos = await Tabela.listar(requisicao.fornecedor.id) //fornecedor.id é a instancia já injetada na rota fornecedores
    const serializador = new SerializadorProduto( //instancía o serializador
        resposta.getHeader('Content-Type')
    )
    resposta.send(
        serializador.serializar(produtos) //serializador já está instanciado por isso pode chamar aqui
    )
})

// Vamos trabalhar na raiz da requisicao por isso '/' //PROXIMO é o midleware
roteador.post('/', async (requisicao, resposta, proximo) => {
    try {
        const idFornecedor = requisicao.fornecedor.id
        const corpo = requisicao.body
        const dados = Object.assign({}, corpo, { fornecedor: idFornecedor }) //temos a coluna fornecedor na tb produtos
        const produto = new Produto(dados)    //instanciar a classe produto
        await produto.criar()
        const serializador = new SerializadorProduto( //instancía o serializador
            resposta.getHeader('Content-Type')
        )
        resposta.set('Etag', produto.versao) //enviar o nome da tag e a versao pro cliente ja que ele esta cadastrando 
        const timestamp = (new Date(produto.dataAtualizacao)).getTime() //data da ultima alteração/cadastro desse produto mas tem q converter em new date do JS
        resposta.set('Last-Modified', timestamp) //GET TIME é a funcao do js que converte a string 'produto.dataAtualizacao'
        resposta.set('Location', `/api/fornecedores/${produto.fornecedor}/produtos/${produto.id}`)
        resposta.status(201)
        resposta.send(
            serializador.serializar(produto)
        )
    } catch (erro) {
        proximo(erro)
    }
})

roteador.delete('/:id', async (requisicao, resposta) => {
    const dados = {             //dados que temos nesse momento
        id: requisicao.params.id,
        fornecedor: requisicao.fornecedor.id //fornecedor.id é a instancia já injetada na rota fornecedores
    }
    const produto = new Produto(dados) //instanciar a classe
    await produto.apagar() //espera terminar de executar a funcao para apagar
    resposta.status(204) //204: foi um sucesso mas nao tem corpo de resposta
    resposta.end()
})

roteador.get('/:id', async (requisicao, resposta, proximo) => { //apenas 1 produto entao url com id do produto
    try {
        const dados = {
            id: requisicao.params.id,
            fornecedor: requisicao.fornecedor.id
        }
        const produto = new Produto(dados) //instancia o produto
        await produto.carregar()
        const serializador = new SerializadorProduto(
            resposta.getHeader('Content-Type'),
            ['preco', 'estoque', 'fornecedor', 'dataCriacao', 'dataAtualizacao', 'versao']
        )
        resposta.set('Etag', produto.versao) //enviar o nome da tag e a versao pro cliente
        const timestamp = (new Date(produto.dataAtualizacao)).getTime()
        resposta.set('Last-Modified',timestamp)
        resposta.status(201)
        resposta.send(
            serializador.serializar(produto)

        )
    } catch (erro) {
        proximo(erro)
    }
})

roteador.head('/:id', async (requisicao, resposta, proximo) => { //apenas 1 produto entao url com id do produto
    try {
        const dados = {
            id: requisicao.params.id,
            fornecedor: requisicao.fornecedor.id
        }
        const produto = new Produto(dados) //instancia o produto
        await produto.carregar()
        resposta.set('Etag', produto.versao) //enviar o nome da tag e a versao pro cliente
        const timestamp = (new Date(produto.dataAtualizacao)).getTime()
        resposta.set('Last-Modified',timestamp)
        resposta.status(200)
        resposta.end() //encerra a requisicao sem mandar nada na resposta pq so queremos os cabeçalho mesmo
    } catch (erro) {
        proximo(erro)
    }
})

roteador.put('/:id', async (requisicao, resposta, proximo) => {
    try {
        const dados = Object.assign(//object.assign juntar 2 objetos, o q já temos e as novas informações vinda da requisicao para atualizar esse objeto
            {},
            requisicao.body, //corpo da requisicao
            {
                id: requisicao.params.id, //declarado na rota
                fornecedor: requisicao.fornecedor.id //id fornecedor  
            }
        )

        const produto = new Produto(dados)
        await produto.atualizar()
        await produto.carregar()//como esta alterando o produto tem q carregar de novo para mostrar a nova data com a data do momento em q está fazendo essa modificacao
        resposta.set('Etag', produto.versao) //enviar o nome da tag e a versao pro cliente
        const timestamp = (new Date(produto.dataAtualizacao)).getTime()
        resposta.set('Last-Modified',timestamp)
        resposta.status(204)
        resposta.end()
    } catch (erro) {
        proximo(erro)
    }
})

roteador.post('/:id/diminuir-estoque', async (requisicao, resposta, proximo) => {
    try {
        const produto = new Produto({
            id: requisicao.params.id,
            fornecedor: requisicao.fornecedor.id
        })
        await produto.carregar()
        produto.estoque = produto.estoque - requisicao.body.quantidade
        await produto.diminuirEstoque()
        await produto.carregar() //como esta alterando o produto tem q carregar de novo para mostrar a nova data com a data do momento em q está fazendo essa modificacao
        resposta.set('Etag', produto.versao) //enviar o nome da tag e a versao pro cliente
        const timestamp = (new Date(produto.dataAtualizacao)).getTime()
        resposta.set('Last-Modified',timestamp)
        resposta.status(204) // nao precisa mandar nenhuma respota
        resposta.end() // entao ja manda finalizar a requisicao 
    }catch(erro){
        proximo(erro)
    }
})

const roteadorReclamacoes = require('./reclamacoes')
const Serializador = require('../../../Serializador')
roteador.use('/:idProduto/reclamacoes', roteadorReclamacoes)

module.exports = roteador

/*arquivo de rota de produtos*/