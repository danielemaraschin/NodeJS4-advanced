const Sequelize = require('sequelize')
const config = require('config')

const instancia = new Sequelize(
    'petshop', //nome db
    'root',     //usuario mysql
    'admin',    
    {   //objeto com algumas config da conexao
        host: '127.0.0.1', //ipe maquina em uso
        dialect: 'mysql'    //tipo de db usado
    }
)

module.exports = instancia