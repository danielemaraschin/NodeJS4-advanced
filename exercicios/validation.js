const Sequelize = require('sequelize')
const colunas = {
    titulo: { type: Sequelize.STRING, allowNull: false },
    endereco: { type: Sequelize.STRING, allowNull: false },
    quantidadeDeFuncionarios: { type: Sequelize.INTEGER, allowNull: false },
}


validar(empresa){
    if (typeof this.titulo !== 'string' && this.titulo.length === 0) {
        throw new Error('O campo Título está inválido')
    }          //no js seja com ponto flutuante ou nao, o typeof é 'number'
    if (typeof this.quantidadeDeFuncionarios !== 'number' && this.quantidadeDeFuncionarios === 0) {
        throw new Error("Campo quantidade de funcionários está inválido.")
    }
    if (typeof this.endereco !== 'string' && this.titulo.length === 0) {
        throw new Error("Campo endereço inválido")
    }
}
