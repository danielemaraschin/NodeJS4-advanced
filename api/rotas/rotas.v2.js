//ATUALIZAR API COM NOVA VERSÃO (v2) DAS ROTAS

const roteador = require('express').Router()
const TabelaFornecedor = require('./TabelaFornecedor')
const SerializadorFornecedor = require('../../Serializador').SerializadorFornecedor //pra enviar as info das respostas


//declarar as rotas atualizadas (CTRC+ CTRV GET)
//queremos que a rota tenha a mesma funcionalidade que a rota antiga, so queremos que retorne campos diferentes

roteador.get('/', async (requisicao, resposta) => {
    console.log('Im in index fornecedores');
    const resultados = await TabelaFornecedor.listar()
    console.log('LISTANDO');
    resposta.status(200)
    const serializador = new SerializadorFornecedor(
        resposta.getHeader('Content-Type')
    )
    resposta.send(
        serializador.serializar(resultados)
    )
})

module.exports = roteador