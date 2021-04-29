const Modelo = require('./ModeloTabelaProduto') //esse Modelo do sequelize para se comunicar com o db


module.exports = {
    listar(idFornecedor) { //retorna nossa lista de produtos - mas nao queremos a lista inteira
        return Modelo.findAll({ // queremos somente os produtos de um determinado fornecedor
            where: {        //passa um objeto 'where'e dentro as intruções para encontrar o produto
                fornecedor: idFornecedor//campo fornecedor do produto deve ser igual ao idFornecedor do fornecedor
            }
        })
    }, 
    inserir (dados) {
        return Modelo.create(dados) //metodo sequelize para criar com os dados q temos
    }, 

    remover (idProduto, idFornecedor){
        return Modelo.destroy({ //destroy é a funçao está se comunicando com db entao usar no arquivo de rotas
            where: {
                id: idProduto,
                fornecedor: idFornecedor
            }
        })
    },
    async pegarPorId (idProduto, idFornecedor){
        const encontrado = await Modelo.findOne({
            where: {
                id: idProduto,
                fornecedor: idFornecedor
            }
        })
        if(!encontrado){
            throw new Error('Produto não foi encontrado!')
        }
    }

//DAO