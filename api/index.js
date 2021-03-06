const express = require('express');
const app = express()
const bodyParser = require('body-parser')
const config = require('config')
const NaoEncontrado = require('./erros/NaoEncontrado')
const CampoInvalido = require('./erros/CampoInvalido')
const DadosNaoFornecidos = require('./erros/DadosNaoFornecidos')
const ValorNaoSuportado = require('./erros/ValorNaoSuportado')
const formatosAceitos = require('./Serializador').formatosAceitos
const SerializadorErro = require('./Serializador').SerializadorErro

app.use(bodyParser.json())

app.use((requisicao, resposta, proximo) => {
    let formatoRequisitado = requisicao.header('Accept')

    if (formatoRequisitado === '*/*') {
        formatoRequisitado = 'application/json'
    }

    if (formatosAceitos.indexOf(formatoRequisitado) === -1) {
        resposta.status(406)
        resposta.end()
        return
    }

    resposta.setHeader('Content-Type', formatoRequisitado)
    proximo()
})

app.use((requisicao, resposta, proximo) => { //param 1 : nome header/[param2]:nome do site por qual está tentando aceitar, se for qualquer site colocar *
    resposta.set('Access-Control-Allow-Origin', '*') //nao colocar / no final do dominio
    proximo()
})

const roteador = require('./rotas/fornecedores') //declara roteador fornecedor v1
app.use('/api/fornecedores', roteador) //manda o roteador fornecedor de volta declarando para poder usar


const roteadorv2 = require('./rotas/fornecedores/rotas.v2') // roteador fornecedor v2
app.use('/api/v2/fornecedores', roteadorv2)


const roteadorv3 = require('./rotas/fornecedores/rotas.v3') // roteador fornecedor v3
app.use('/api/v3/fornecedores', roteadorv3)

const roteadorv4 = require('./rotas/fornecedores/rotas.v4') // roteador fornecedor v4
app.use('/api/v4/fornecedores', roteadorv4)

app.use((erro, requisicao, resposta, proximo) => {
    let status = 500

    if (erro instanceof NaoEncontrado) {
        status = 404
    }

    if (erro instanceof CampoInvalido || erro instanceof DadosNaoFornecidos) {
        status = 400
    }

    if (erro instanceof ValorNaoSuportado) {
        status = 406
    }

    const serializador = new SerializadorErro(
        resposta.getHeader('Content-Type')
    )
    resposta.status(status)
    resposta.send(
        serializador.serializar({
            mensagem: erro.message,
            id: erro.idErro
        })
    )
})

app.use(( requisicao, resposta, proximo) => {
    resposta.set('X-Powered-By', 'Maraschin,D')
    proximo()
})

app.listen(3000, () => console.log('A API está funcionando!'))