import express from 'express'
import usuarioRoutes from './routes/usuarioRoutes.js'
import db from './config/db.js'
//import csurf from 'csurf'
//import cookieParser from 'cookie-parser'
import dotenv from 'dotenv'
dotenv.config({path: '.env'})
//Para habilitar los modulos, se coloca en el package.json un apartado '"type": "modul"'


//Crear app
const app = express()

app.use(express.json())
app.use(express.urlencoded({extended: true}))


//app.use(cookieParser());

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


app.use('/auth', usuarioRoutes)


//Definir un puerto
const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`El servidor esta funcionando en el puerto ${port}`);
});


