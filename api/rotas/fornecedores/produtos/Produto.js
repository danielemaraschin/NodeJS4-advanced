const Tabela = require('./TabelaProduto')
const DadosNaoFornecidos = require('../../../erros/DadosNaoFornecidos')

class Produto {
    //constructor pega dados que recebemos e passa para uma instancia 
    constructor({ id, titulo, preco, estoque, fornecedor, dataCriacao, dataAtualizacao, versao }) {
        this.id = id
        this.titulo = titulo
        this.preco = preco
        this.estoque = estoque
        this.fornecedor = fornecedor
        this.dataCriacao = dataCriacao
        this.dataAtualizacao = dataAtualizacao
        this.versao = versao
    }

    validar() {
        if (typeof this.titulo !== 'string' || this.titulo.length === 0) {
            throw new Error('O campo Título está inválido')
        }           //no js seja com ponto flutuante ou nao, o typeof é 'number'
        if (typeof this.preco !== 'number' || this.preco === 0) {
            throw new Error("Campo preço está inválido.")
        }
    }

    async criar() { //chama o dao (se comunicando com a tabelaProduto,por isso chama no inicio do arquivo) criando o metodo criar
        this.validar()
        const resultado = await Tabela.inserir({
            titulo: this.titulo,
            preco: this.preco,
            estoque: this.estoque,
            fornecedor: this.fornecedor
        })
        this.id = resultado.id
        this.dataAtualizacao = resultado.dataAtualizacao
        this.dataCriacao = resultado.dataCriacao
        this.versao = resultado.versao
    }

    apagar() { //se comunica com o DAO que é a tabelaProduto para poder remover o produto indicado
        return Tabela.remover(this.id, this.fornecedor)
    }

    async carregar() {
        const produto = await Tabela.pegarPorId(this.id, this.fornecedor)
        this.titulo = produto.titulo
        this.estoque = produto.estoque
        this.preco = produto.preco
        this.dataCriacao = produto.dataCriacao
        this.dataAtualizacao = produto.dataAtualizacao
        this.versao = produto.versao
    }

    atualizar () {
        const dadosParaAtualizar = {}

        if (typeof this.titulo === 'string' && this.titulo.length > 0){
            dadosParaAtualizar.titulo = this.titulo
        }           //no js seja com ponto flutuante ou nao, o typeof é 'number'
        if (typeof this.preco === 'number' && this.preco > 0) {
            dadosParaAtualizar.preco = this.preco
        }
        if (typeof this.estoque === 'number'){
            dadosParaAtualizar.estoque = this.estoque
        }
        if (Object.keys(dadosParaAtualizar).length === 0) {
            throw new DadosNaoFornecidos() //SEM nada nos parenteses do constructor desse error entao sem nada aqui nesses parenteses tb
        }
        return Tabela.atualizar(
            {
                id: this.id,
                fornecedor: this.fornecedor //obeto para encontrar o produto pra atualizar
            },
            dadosParaAtualizar
        )
    }

    diminuirEstoque () {
        return Tabela.subtrair(
            this.id,
            this.fornecedor,
            'estoque',
            this.estoque
        )
    }
}

module.exports = Produto