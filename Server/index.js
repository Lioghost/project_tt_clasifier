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


//Para trabajar con modulos se debe agregar en package.json después de main \ "typen": "module"
//npm i pug       Temple-engine, para vistas
//npm i -D tailwindcss autoprefixer postcss postcss-cli
//npx tailwindcss init  / en content se agragan los archivos que contienen el css para ser leidos para generar un archivo con esas clases
    //En archivo tailwind.config.js definir que archivos tienen el css para que tailwind lo lea
    //Generar comando para ejecutar tailwind en package.json ' "css": "postcss public/css/tailwind.css -o public/css/app.css"
        //Cambiar extension tailwind.config y postcss.config a .cjs '
//npm i sequalize mysql2 ORM para base de datos
//npm i dotenv
//npm i express-validator
//npm i bcrypt
//mailtrap para proba emails
//npm i nodemailer      para envio de emails
//npm i csurf cookie-parser
//npm i jsonwebtoken
//npm i -D webpack webpack-cli
//USO DE leaflet    Es una opcion de software libre a googleMaps 
    //script(src="https://unpkg.com/leaflet@1.8.0/dist/leaflet.js")
    //script(src="https://unpkg.com/esri-leaflet@3.0.8/dist/esri-leaflet.js")
        //esri-leaflet es una libreria que nos permite acceder a la información de las calles cuando le pasas ciertas coordenadas
    //script(src="https://unpkg.com/esri-leaflet-geocoder@2.2.13/dist/esri-leaflet-geocoder.js")
        //
    //script(src="https://cdnjs.cloudflare.com/ajax/libs/leaflet-geosearch/2.7.0/bundle.min.js")

//Webpack nos va a compilar los archivos de javascript en archivos estaticos
 

//Al igual que postcss y tailwind, webpack requiere un archivo de configuración

//npm i -D concurrently  Permite tener multiples scripts ejecutandos a la vez

//Un seeder es una forma de insertar masivamente datos en la base de datos

//npm i dropzone@5.9.3  Modulo para cargar archivos 
//npm i multer Modulo para permitir cargar archivos de tipo deintinto de String, text, 
        //ya que app.use(express.urlencoded({extended: true})) solo permite la lectura de formularios

