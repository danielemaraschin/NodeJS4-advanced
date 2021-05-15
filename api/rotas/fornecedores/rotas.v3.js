//ATUALIZAR API COM NOVA VERSÃO (v3) DAS ROTAS onde na listagem irá retornar apenas o id do fornecedor


const roteador = require('express').Router()
const TabelaFornecedor = require('./TabelaFornecedor')
const SerializadorFornecedor = require('../../Serializador').SerializadorFornecedor //pra enviar as info das respostas

roteador.options('/', (requisicao, resposta) => { //rota options pra dizer por quaIS rota podemos acessar com essa url
    resposta.set('Access-Control-Allow-Methods', 'GET') 
    resposta.set('Access-Control-Allow-Headers', 'Content-Type')
    resposta.status(204)                                                                    
    resposta.end()                          
})

roteador.get('/', async (requisicao, resposta) => {
    console.log('Im in index fornecedores v3');
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