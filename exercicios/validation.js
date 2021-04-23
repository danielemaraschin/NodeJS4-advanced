const Sequelize = require('sequelize')
const colunas = {
  titulo: { type: Sequelize.STRING, allowNull: false },
  endereco: { type: Sequelize.STRING, allowNull: false },
  quantidadeDeFuncionarios: { type: Sequelize.INTEGER, allowNull: false },
}


validar() {
    if (typeof this.titulo !== 'string' || this.titulo.length === 0) {
        throw new Error('O campo Título está inválido')
    }           //no js seja com ponto flutuante ou nao, o typeof é 'number'
    if (typeof this.quantidadeDeFuncionarios !== 'number' || this.quantidadeDeFuncionarios === 0) {
        throw new Error("Campo quantidade de funcionários está inválido.")
    }
    if(typeof this.endereco !== 'string' || this.titulo.length === 0)
}

/*async criar() { //chama o dao (se comunicando com a tabelaProduto,por isso chama no inicio do arquivo) criando o metodo criar
    this.validar()
    const resultado = await Tabela.inserir({
        titulo: this.titulo,
        quantidadeDeFuncionarios: this.quantidadeDeFuncionarios,
        endereco: this.endereco
    })

//Crie uma função que receba um objeto representando uma empresa a ser cadastrada
//e  valide se os dados da empresa estão válidos para inserir na tabela.