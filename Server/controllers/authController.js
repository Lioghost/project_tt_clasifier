//import { check, validationResult } from 'express-validator'     //check: verifica campo especifico / validationR: Guarda resultado de validacion
import bcrypt from 'bcrypt'
import Usuario from '../models/Usuario.js'
import { generarJWT, generarID } from '../config/tokens.js'
import { emailRegistro, emailOlvidePassword } from '../config/emails.js'

const iniciarSesion = (req, res) => {
    return res.status(200).json({msg: "Iniciar Sesión"});
}

const autenticar = async (req, res) => {

    //Probalmente si se usa req.csrfToken() se debe generar el Token desde este punto, sin embargo, no estoy completamente seguro y pasarlo al FrontEnd
    const { email, password } = req.body;

    //Comprobar si el usuario existe
    const usuario = await Usuario.findOne({where: {email}});
    if(!usuario) {
        return res.status(400).json({msg: 'El usuario no existe'}); //Se envia un mensaje de error en formato json
    }

    //Comprobar si el usuario esta confirmado
    if(!usuario.confirmado)
        return res.status(400).json({msg: 'Tu cuenta no ha sido confirmada'}); //Se envia un mensaje de error en formato json

    //Se pasa el password de req.body obtenido anteriormente
    if(!usuario.verificarPassword(password)) {
        return res.status(400).json({msg: 'Email o password incorrecto'}); //Se envia un mensaje de error en formato json
    }

    //Autenticar al usuario
    const token = generarJWT({id: usuario.id, name: usuario.name, role: usuario.role});

    console.log(token);
    //Almacenar en un cookie
    //Al habilitar cookie parser brinda acceso para poder escribir en lo cookies
    //Primer paramtro: nombre, segundo parametro el valor
    res.cookie('_token', token, {
        httpOnly: true,  //Evita los ataques crostait, hace que un cookie no sea accesible desde la api de javascript
        //expires: 9000
        //secure: true
    });

    return res.status(200).json({id: usuario.id, msg: `Bienvenido ${usuario.name}`, role: usuario.role});

}

const cerrarSesion = (req, res) => {
    return res.clearCookie('_token').status(200).redirect('/auth/login')
}

/*
const formularioRegistro = (req, res) => {

    console.log(req.csrfToken());   //""""req.csrfToken se registra en automatico gracias a csrf({cookie: true}) del index, es un token publico que se genera con una llave""" 
                                    //privada que comprueba que el req provenga desde esta url /Se tiene que enviar en el formulario a través de la vista para validar que proviene del mismo url
                                    //El csrfToken() se tiene que enviar como parte del formulario, de lo contrario
                                    //lanzar+a un error, ya que ya fue habilitado por primera vez aqui, al enviarse como parte
                                    //del formulario, forma parte del request, asi que en cada renderizacion se debe pasar este 
                                    //parametro para evitar errores
    res.render('auth/registro', {
        pagina: 'Crear Cuenta',
        csrfToken: req.csrfToken()      //El token se genera justo antes de renderizar la vista
    });
}
*/

//La función es asincrona debido a que se va a trabajar con una base de datos
const registrar = async (req, res) => {
    
    //Extraer datos
    const { name, username, lastname, email, password, role } = req.body
    console.log(req.body)
    //Verificar existencia de usuario
    const existeUsuario = await Usuario.findOne({ where: { email } })
    if(existeUsuario)
        return res.status(400).json({msg: 'El usuario ya esta Registrado'});

    //const usuario = await Usuario.create(req.body)
    const usuario = await Usuario.create({
        name,
        lastname,
        username,
        email,
        password,
        role: role || 'client',
        token: generarID()
    });

    //Envia email de confirmación
    //Funcion en emails.js
    emailRegistro({
        username: usuario.username,
        email: usuario.email,
        token: usuario.token 
    });

    console.log(usuario.token);
    return res.status(200).json({msg: 'Usuario creado correctamente'});
}

//Funcion que comprueba la cuenta
//El paramtro token en esta fucnion se obtiene del enlace del email recibido por correo
const confirmar = async (req, res) => {

    //Cuando se requiere leer URLs dinamicos se usa req.paramsfffffgfg
    const { token } = req.params;

    //Verificar si el token es valido
    //Se consulta en la base datos si el token pertenece a un usuario
    const usuario = await Usuario.findOne({where: {token}})

    if(!usuario) {
        return res.status(400).json({msg: 'Hubo un error al confirmar tu cuenta, intenta de nuevo'});
    }

    //Confirmar la cuenta
    usuario.token = null;   //Si el usuario es encontrado en la BD, se elimina su token y confirmado 
    usuario.confirmado = true;
    //Almacenmiento en la base datos
    await usuario.save();       //Despues de moficar los datos, se guardan nuevamente en la BD

    return res.status(200).json({msg: 'La cuenta se confirmo correctamente'});

}

const resetPassword = async (req, res) => {

    //Buscar el usuario en caso de que si sea un email
    //El parametro se recibe del formulario para recuperar la contraseña
    const { email } = req.body;

    const usuario = await Usuario.findOne({where: { email }});

    if(!usuario) {
        return res.status(400).json({msg: 'Usuario no encontrado'});
    }

    //Generar token y enviar email
    //Como en operaciones anteriores ya se valido y encontro el usuario
    usuario.token = generarID();
    await usuario.save();

    //Enviar un email
    emailOlvidePassword({
        username: usuario.username,
        email: usuario.email,
        token: usuario.token
    });

    return res.status(200).json({msg: 'Hemos enviado un email con las instrucciones'});
}

//Desde react se debe mandar a llamar esta función para validar el token del usuario en la BD
const comprobarToken = async (req, res) => {
    
    const { token } = req.params;
    
    const usuario = await Usuario.findOne({where: {token}});
    if(!usuario) {
        return res.status(400).json({msg: 'Hubo un error al validar tu información, intenta de nuevo'});
    }

    //Si el usuario es valido, continuar al siguiente middleware
    //Mostrar formulario para modificar el password
    return res.status(200).json({msg: 'Usuario validado correctamente'});
}

const nuevoPassword = async (req, res) => {

    const { token } = req.params;   
    const { password } = req.body; 

    //Identificar quien hace el cambio
    const usuario = await Usuario.findOne({where: {token}});

    //Hashear el nuevo password
    const salt = await bcrypt.genSalt(10)
    usuario.password = await bcrypt.hash(password, salt);
    usuario.token = null;
    
    await usuario.save();

    return res.status(200).json({msg: 'El PASSWORD se he guardado correctamente'});
}


export {
    iniciarSesion,
    autenticar,
    cerrarSesion,
    //formularioRegistro,
    registrar,
    confirmar,
    //formularioOlvidePassword,
    resetPassword,
    comprobarToken,
    nuevoPassword
}