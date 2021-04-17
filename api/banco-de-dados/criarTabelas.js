const modelos = [
    require('../rotas/fornecedores/ModeloTabelaFornecedor'),
    require('../rotas/fornecedores/produtos/ModeloTabelaProduto')
]
    

async function criarTabelas() {
    for (let contador = 0; contador < modelos.length; contador++) {
        const modelo = modelos[contador]
        await modelo.sync() //sincronizando o modelo da tabela atual com o db
    }
}

criarTabelas() //ao executar no terminal, já vai executar a função