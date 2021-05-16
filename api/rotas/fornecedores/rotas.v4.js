//ATUALIZAR API COM NOVA VERSÃO (v4) DAS ROTAS
const Fornecedor = require('./Fornecedor')
const roteador = require('express').Router()
const TabelaFornecedor = require('./TabelaFornecedor')
const SerializadorFornecedor = require('../../Serializador').SerializadorFornecedor //pra enviar as info das respostas


//declarar as rotas atualizadas (CTRC+ CTRV post)
//queremos que a rota tenha a mesma funcionalidade que a rota antiga, so queremos que retorne campos diferentes na resposta

roteador.options('/', (requisicao, resposta) => { //param 1 : nome header/param2:allowed routes
    resposta.set('Access-Control-Allow-Methods', 'POST') //Somente as rotas que trabalham na raiz da requisicao (dominimo '/')
    resposta.set('Access-Control-Allow-Headers', 'Content-Type')
    resposta.status(204)                                                                    
    resposta.end()                          
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

module.exports = roteador