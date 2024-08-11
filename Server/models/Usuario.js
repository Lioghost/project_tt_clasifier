//Modelo ORM, se va a tratar como si fuera clase, se va a instanciar
import { DataTypes } from 'sequelize'
import bcrypt from 'bcrypt'
import db from '../config/db.js'

//Con "define" es la forma en que se define un nuevo modelo, segundo parametro es nombre de la tabla
const Usuario = db.define('usuarios', {
    name: {
        type: DataTypes.STRING,
        allowNull: false    //Indican que estos campos no pueden estar vacios
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false,    //Indican que estos campos no pueden estar vacios
        unique: true
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    role: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    token: DataTypes.STRING,
    confirmado: DataTypes.BOOLEAN
}, {
    //Este hook se ejecuta justo cuando la instruccion de crear Usuaria se ejecuta en registro, usuarioController
    hooks: { //Son funciones que se pueden agregar a cierto modelo //Se ejecuta en determinados momentos, antes de actualizar, despues de actualizar
        beforeCreate: async function(usuario) {     //Se le pasa el req.body, pero es nombrado como "usuario"
            const salt = await bcrypt.genSalt(10)
            usuario.password = await bcrypt.hash(usuario.password, salt);
        }
    },
    scopes: {   //Sirven para eliminar ciertos elementos durante que se hace una consulta a un modelo en especifico, como por ejemplo consultar existencia de un usuario
        eliminarPassword: {
            attributes: {
                exclude: ['password', 'token', 'confirmado', 'createdAt', 'updatedAt', 'role']
            }
        }
    }
});

//Sequaliza soporta metodos personalizados
//Prototype() contiene todas las funciones que se pueden utilizar en ese tipo de objeto, asi que estamos agregando una nueva función a su prototype 
//Metodos personalizados
Usuario.prototype.verificarPassword = function(password) {
    //No se pueden utilizar this dentro de una arrowFuntion porque no apunta en el scope en el objeto actual sino en la ventana global
    return bcrypt.compareSync(password, this.password);    //Compara el password con el password haseado en la base datos
    //this.password hace referencia a la instancia de la base de datos actual de password
}

//Un hook se ejecuta en un determinado momento, por ejemplo en el momento en que se crea un registro, antes de eliminarlo, en el momento que se actualiza

export default Usuario