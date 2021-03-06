const roteador = require('express').Router()
const TabelaFornecedor = require('./TabelaFornecedor')
const Fornecedor = require('./Fornecedor')
const SerializadorFornecedor = require('../../Serializador').SerializadorFornecedor
//const TabelaProduto = require('./produtos/TabelaProduto')

roteador.options('/', (requisicao, resposta) => { //param 1 : nome header/param2:allowed routes
    resposta.set('Access-Control-Allow-Methods', 'GET, POST') //Somente as rotas que trabalham na raiz da requisicao (dominimo '/')
    resposta.set('Access-Control-Allow-Headers', 'Content-Type')
    resposta.status(204)                                                                    
    resposta.end()                          
})

roteador.get('/', async (requisicao, resposta) => {
    console.log('Im in index fornecedores');
    const resultados = await TabelaFornecedor.listar()
    console.log('LISTANDO');
    resposta.status(200)
    const serializador = new SerializadorFornecedor(
        resposta.getHeader('Content-Type'),
        ['empresa', 'categoria']
    )
    resposta.send(
        serializador.serializar(resultados)
    )
})

roteador.post('/', async (requisicao, resposta, proximo) => {
    try {
        const dadosRecebidos = requisicao.body
        const fornecedor = new Fornecedor(dadosRecebidos)
        await fornecedor.criar()
        resposta.status(201)
        const serializador = new SerializadorFornecedor(
            resposta.getHeader('Content-Type'),
            ['empresa', 'categoria']
        )
        resposta.send(
            serializador.serializar(fornecedor)
        )
    } catch (erro) {
        proximo(erro)
    }
})
roteador.options('/:idFornecedor', (requisicao, resposta) => { //param 1 :HTTP headers/[param2]: ROUTES
    resposta.set('Access-Control-Allow-Methods', 'GET, PUT, DELETE') //Somente as rotas que trabalham com o idFornecedor no dominimo
    resposta.set('Access-Control-Allow-Headers', 'Content-Type')
    resposta.status(204)                                                                    
    resposta.end()                          
})
roteador.get('/:idFornecedor', async (requisicao, resposta, proximo) => {
    console.log('Im in idFornecedor');
    try {
        const id = requisicao.params.idFornecedor
        const fornecedor = new Fornecedor({ id: id })
        await fornecedor.carregar()
        resposta.status(200)
        const serializador = new SerializadorFornecedor(
            resposta.getHeader('Content-Type'),
            ['email', 'empresa', 'categoria' ,'dataCriacao', 'dataAtualizacao', 'versao']
        )
        resposta.send(
            serializador.serializar(fornecedor)
        )
    } catch (erro) {
        proximo(erro)
    }
})

roteador.put('/:idFornecedor', async (requisicao, resposta, proximo) => {
    try {
        const id = requisicao.params.idFornecedor
        const dadosRecebidos = requisicao.body
        const dados = Object.assign({}, dadosRecebidos, { id: id })
        const fornecedor = new Fornecedor(dados)
        await fornecedor.atualizar()
        resposta.status(204)
        resposta.end()
    } catch (erro) {
        proximo(erro)
    }
})

roteador.delete('/:idFornecedor', async (requisicao, resposta, proximo) => {
    try {
        const id = requisicao.params.idFornecedor
        const fornecedor = new Fornecedor({ id: id })
        await fornecedor.carregar()
        await fornecedor.remover()
        resposta.status(204)
        resposta.end()
    } catch (erro) {
        proximo(erro)
    }
})

//
/*roteador.post('/:idFornecedor/repor-estoque', async (requisicao, resposta, proximo) => {
    try {
        const fornecedor = new Fornecedor({ id: requisicao.params.idFornecedor })
        await fornecedor.carregar()
        const produtos = await TabelaProduto.listar(fornecedor.id, { estoque: 0 })
        // objeto criterio que tem estoque:0 => criterios.estoque: 0
        resposta.send({
            mensagem: `${produtos.length} produtos precisam de reposi????o de estoque`
        })
    } catch (erro) {
        proximo(erro)
    }
})
*/
//arquivo de rotas dos fornecedores
const roteadorProdutos = require('./produtos')
const verificarFornecedor = async (requisicao, resposta, proximo) => {
    try {
        const id = requisicao.params.idFornecedor //pega o id do fornecedor
        const fornecedor = new Fornecedor({ id: id }) //instancia a classe e passa pra ela qual o id do fornecedor que estamos recebendo
        await fornecedor.carregar() //chama o metodo p/procurar no db e preencher a instancia.Caso esse id nao exista ele vai mandar um erro
        requisicao.fornecedor = fornecedor // injetando valor dentro da requisicao ?? s?? alterar o objeto requisicao
        proximo()
    } catch (erro) { //j?? q vai emitir um erro, iremos captura-lo com o bloco 'catch'
        proximo(erro)
    }
}
roteador.use('/:idFornecedor/produtos', verificarFornecedor, roteadorProdutos)

module.exports = roteador