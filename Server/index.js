import cors from 'cors';

import express from 'express'
import authRoutes from './routes/authRoutes.js'
import adminRoutes from './routes/adminRoutes.js'
import sharedRoutes from './routes/sharedRoutes.js' 
import clientRoutes from './routes/clientRoutes.js'
import db from './config/db.js'
//import csurf from 'csurf'
import cookieParser from 'cookie-parser'
import dotenv from 'dotenv'
dotenv.config({path: '.env'})
//Para habilitar los modulos, se coloca en el package.json un apartado '"type": "modul"'


//Crear app
const app = express()

app.use(express.json())
app.use(express.urlencoded({extended: true}))

// Configuración CORS
app.use(cors({
    origin: 'http://localhost:4000', // Reemplaza con la URL de tu frontend
    credentials: true, // Si necesitas enviar cookies o autenticación
}));

// Forzar la inclusión de Headers CORS en todas las respuestas
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4000');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Credentials', 'true'); // Permitir el envío de cookies
    next();
});

app.use(cookieParser());

// Middleware para deshabilitar el caché
app.use((req, res, next) => {
    res.setHeader('Cache-Control', 'no-store');
    next();
});

//Habilitar CSRF
//Permite almacenar cookies en la memoria en lugar de la consola o tambien es común en localstorage
//Registra en automatico una funcion de csrfToken en cada "req" de las rutas porque se registra de forma global
//app.use(csurf({cookie: true}));

//Conexion a la BD
try {
    await db.authenticate();    //Metodo de sequalize
    console.log('Conexion Correcta a la Base de Datos')
    //await db.sync();  //Crea la tabla en caso de que no exita
    await db.sync({force: true});  //Crea la tabla en caso de que no exita
    console.log('Modelos sincronizados')
} catch(error) {
    console.error(error)
}

//Carpeta Publica
//Se le dice a node en que parte va a encontrar los archivos estaticos, donde va a encontrar las imagenes, el css, las carpeta pueden abrir las persona
//Puede ser alguna libreria de javascript
app.use( express.static('public') )


app.use('/auth', authRoutes)
app.use('/admin', adminRoutes)
app.use('/client', clientRoutes)
app.use('/shared', sharedRoutes)


//Definir un puerto
const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`El servidor esta funcionando en el puerto ${port}`);
});