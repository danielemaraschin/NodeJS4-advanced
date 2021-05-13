const instancia = require('../../../banco-de-dados')
const NaoEncontrado = require('../../../erros/NaoEncontrado')
const Modelo = require('./ModeloTabelaProduto') //esse Modelo do sequelize para se comunicar com o db

module.exports = {
    listar(idFornecedor) { //retorna nossa lista de produtos - mas nao queremos a lista inteira

        return Modelo.findAll({ // queremos somente os produtos de um determinado fornecedor
            where: {
                fornecedor:idFornecedor
            },       //passa um objeto 'where'e dentro as intruções para encontrar o produto
            raw: true //queremos os valor em js puro, nao como metodo do sequelize
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
        const encontrado = await Modelo.findOne({ //modelo sequelize vai voltar com vários métodos e funcoes que os objetos sequelize tem
            where: {
                id: idProduto,
                fornecedor: idFornecedor
            },
            raw: true //para não retornar com todos os métodos do sequelize(pq estamos usando uma instancia do sequelize)
        })          //para voltar um objeto puro
        if(!encontrado){
            throw new NaoEncontrado('Produto')
        }

        return encontrado
    },

    atualizar (dadosDoProduto, dadosParaAtualizar) {
        return Modelo.update(//metodo sequelize para atualizar um documento do sequelize. e usamos o modelo sequelize
            dadosParaAtualizar,
            {
                where: dadosDoProduto //objeto 
            }

        ) //metodo sequelize para atualizar um documento

    },

    subtrair(idProduto, idFornecedor, campo, quantidade){
        return instancia.transaction( async transacao => {
            const produto = await Modelo.findOne({
                where: {
                    id: idProduto,
                    fornecedor: idFornecedor
                }
            })
            produto[campo] = quantidade

            await produto.save() // pede pro sequelize salvar esse 'produto'no banco de dados (o novo valor)
            return produto
        })
    }

} /*DAO */