const Tabela = require('./TabelaProduto')

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

    validar () {
        if (typeof this.titulo !== 'string' || this.titulo.length === 0){
            throw new Error ('O campo Título está inválido')
        }
        if ()
    }

    async criar() { //chama o dao (se comunicando com a tabelaProduto,por isso chama no inicio do arquivo) criando o metodo criar
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

    apagar () { //se comunica com o DAO que é a tabelaProduto para poder remover o produto indicado
        return Tabela.remover(this.id, this.fornecedor)
    }
}

module.exports = Produto