import { Sequelize } from "sequelize";
import dotenv from 'dotenv'
dotenv.config({path: '../.env'})

const db = new Sequelize(process.env.BD_NAME, process.env.BD_USER, process.env.BD_PASS, {
    //Se recomienda colocar un host cuando el proyecto crece, se recomienda tener en un hosting separado la base de datos
    host: process.env.HOST || 'localhost',
    port: 3306,
    dialect: 'mysql',   //Tipo de base de datos
    define: {
        timestamps: true    //Agrega dos columnas extras a la tabla de usuarios (cuando fue creado el usuario, ultima actualización) automaticamnte
    },
    
    //logging: (...msg) => console.log(msg)
});

export default db;