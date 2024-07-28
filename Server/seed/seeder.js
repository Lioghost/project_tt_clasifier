import { exit } from 'node:process'
import usuarios  from './usuariosSeed.js'
import db from '../config/db.js'
import Usuario from '../models/Usuario.js'

const importarDatos = async () => {
    try {
        await db.authenticate()
        await db.sync()
        await Promise.all([ 
            Usuario.bulkCreate(usuarios)
        ])

        console.log('Datos Importados Correctamente');
        exit() //Al pasar un 0 o nada dentro de un exit() significa que fue correcto    

    } catch(error) {
        console.log(error)
        exit(1);    //Con un 1 dentro del exit(1) significa que tambien filazo pero hubo un error
    }
}

const eliminarDatos = async () => {
    try {
        await db.sync({force: true})  //Otra forma de borrar tabla
        console.log('Datos Eliminados Correctamente');
        exit();
    } catch (error) {
        console.log(error)
        exit(1);
    }
}

if(process.argv[2] === "-i") {   
    importarDatos();            
}

if(process.argv[2] === "-e") {   
    eliminarDatos();            
}