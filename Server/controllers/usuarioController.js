//import { check, validationResult } from 'express-validator'     //check: verifica campo especifico / validationR: Guarda resultado de validacion
import bcrypt from 'bcrypt'
import Usuario from '../models/Usuario.js'
import { generarJWT, generarID } from '../config/tokens.js'
import { emailRegistro, emailOlvidePassword } from '../config/emails.js'


/*
const formularioLogin = (req, res) => {
    //Es posible pasar informacion a la vista como un objeto, el primer parametro corresponde a que vista, y el segundo la infomación, la cual se pasa agregando un = al elemento del platilla
    //Se usa auth, ya que en index se esta definiendo que las vistas se encuantran en la carpta "views"
    res.render('auth/login', {
        pagina: 'Iniciar Sesion',
        csrfToken: req.csrfToken() //Se genera el Token de inicio de sesión
    })
}
*/

const autenticar = async (req, res) => {
    //Validacion
    //await check('email').isEmail().withMessage('Email Obligatorio').run(req)
    //await check('password').notEmpty().withMessage('Password Obligatorio').run(req) //Agregar

    //let resultado = validationResult(req);

    //Verificar que el resultado este vacio
    // if(!resultado.isEmpty()) {
    //     //Errores    Evita que ya no se ejecuten más lineas del codigo
    //     return res.render('auth/login', {
    //         pagina: 'Iniciar Sesión',
    //         csrfToken: req.csrfToken(),
    //         errores: resultado.array()
    //     })
    // }

    const { email, password } = req.body;

    //Comprobar si el usuario existe
    const usuario = await Usuario.findOne({where: {email}});
    if(!usuario) {
        // return res.render('auth/login', {
        //     pagina: 'Iniciar Sesión',
        //     csrfToken: req.csrfToken(),
        //     errores: [{msg: 'El usuario no existe'}]
        // })
        return res.status(400).json({msg: 'El usuario no existe'}); //Se envia un mensaje de error en formato json
    }

    //Comprobar si el usuario esta confirmado
    if(!usuario.confirmado) {
        // return res.render('auth/login', {
        //     pagina: 'Iniciar Sesión',
        //     csrfToken: req.csrfToken(),
        //     errores: [{msg: 'Tu cuenta no ha sido confirmada'}]
        // })
        return res.status(400).json({msg: 'Tu cuenta no ha sido confirmada'}); //Se envia un mensaje de error en formato json
    }

    //Revisar el password
    //Se pasa el password de req.body obtenido anteriormente
    if(!usuario.verificarPassword(password)) {
        // return res.render('auth/login', {
        //     pagina: 'Iniciar Sesión',
        //     csrfToken: req.csrfToken(),
        //     errores: [{msg: 'Password Incorrecto'}]
        // })
        return res.status(400).json({msg: 'email o password incorrecto'}); //Se envia un mensaje de error en formato json
    }

    //Autenticar al usuario
    const token = generarJWT({id: usuario.id, nombre: usuario.nombre});

    console.log(token);
    //Almacenar en un cookie
    //Al habilitar cookie parser brinda acceso para poder escribir en lo cookies
    //Primer paramtro: nombre, segundo parametro el valor
    return res.cookie('_token', token, {
        httpOnly: true,  //Evita los ataques crostait, hace que un cookie no sea accesible desde la api de javascript
        //expires: 9000
        //secure: true
    }).redirect('/')

}

/*
const cerrarSesion = (req, res) => {
    
    return res.clearCookie('_token').status(200).redirect('/auth/login')
}

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
    //Validacion
    //await check('nombre').notEmpty().withMessage('El nombre no puede ir vacío').run(req)
    //await check('email').isEmail().withMessage('Eso no parece un email').run(req)
    //await check('password').isLength({ min: 6 }).withMessage('El password debe ser de al menos 6 caracteres').run(req) //Agregar
    //await check('repetir_password').equals(req.body.password).withMessage('Los password no son iguales').run(req)

    //let resultado = validationResult(req);

    //res.json(resultado.array())

    //Verificar que el resultado este vacio
    // if(!resultado.isEmpty()) {
    //     //Errores    Evita que ya no se ejecuten más lineas del codigo
    //     return res.render('auth/registro', {
    //         pagina: 'Crear Cuenta',
    //         csrfToken: req.csrfToken(),
    //         errores: resultado.array(), //Se pasan los errores a la vista
    //         usuario: {
    //             nombre: req.body.nombre,
    //             email: req.body.email
    //         } 
    //     })
    // }
    
    //Extraer datos
    
    const { name, username, email, password } = req.body
    console.log(req.body)
    //Verificar existencia de usuario
    const existeUsuario = await Usuario.findOne({ where: { email } })
    if(existeUsuario) {
        // return res.render('auth/registro', {
        //     pagina: 'Crear Cuenta',
        //     csrfToken: req.csrfToken(),
        //     errores: [{msg: 'El usuario ya esta Registrado'}],
        //     usuario: {
        //         naombre: req.body.nombre,
        //         email: req.body.email
        //     } 
        // });
        return res.status(400).json({msg: 'El usuario ya esta Registrado'});
    }

    //Puede ser que tarde un poco en lo que se realiza la inserción, por lo que se debe esperar para que no se vaya inmediatamente a la seguiente linea
    //const usuario = await Usuario.create(req.body)
    //Antes de ejecutar esta instruccion se ejecuta el hash para la password
    //Devuelve el usuario creado con los parametros definidos en el modelo
    const usuario = await Usuario.create({
        name,
        username,
        email,
        password,
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
    //Mostrar mensaje de confirmación
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
    //console.log(usuario)

    if(!usuario) {
        // return res.render('auth/confirmar-cuenta', {
        //     pagina: 'Error al confirmar tu cuenta',
        //     mensaje: 'Hubo un error al confirmar tu cuenta, intenta de nuevo',
        //     error: true     //Error, se pasa el error a la vista
        // })
        return res.status(400).json({msg: 'Hubo un error al confirmar tu cuenta, intenta de nuevo'});
    }

    //Confirmar la cuenta
    usuario.token = null;   //Si el usuario es encontrado en la BD, se elimina su token y confirmado 
    usuario.confirmado = true;
    //Almacenmiento en la base datos
    await usuario.save();       //Despues de moficar los datos, se guardan nuevamente en la BD

    // res.render('auth/confirmar-cuenta', {
    //     pagina: 'Cuenta Confirmada',
    //     mensaje: 'La Cuenta se Confirmo Correctamente'
    // });
    return res.status(200).json({msg: 'La cuenta se confirmo correctamente'});

}

/*
const formularioOlvidePassword = (req, res) => {
    res.render('auth/olvide-password', {
        pagina: 'Recupera tu Acceso a Bienes Raices',
        csrfToken: req.csrfToken()
    });
}
*/

const resetPassword = async (req, res) => {
    
    //Validacion
    //await check('email').isEmail().withMessage('Esto no parece un email').run(req)

    //let resultado = validationResult(req);

    //Verificar que el resultado este vacio
    // if(!resultado.isEmpty()) {
    //     //Errores    Evita que ya no se ejecuten más lineas del codigo
    //     return res.render('auth/olvide-password', {
    //         pagina: 'Recupera tu Acceso a Bienes Raices',
    //         csrfToken: req.csrfToken(),
    //         errores: resultado.array()
    //     })
    // }

    //Buscar el usuario en caso de que si sea un email
    //El parametro se recibe del formulario para recuperar la contraseña
    const { email } = req.body;

    const usuario = await Usuario.findOne({where: { email }});

    if(!usuario) {
        // return res.render('auth/olvide-password', {
        //     pagina: 'Recupera tu Acceso a Bienes Raices',
        //     csrfToken: req.csrfToken(),
        //     errores: [{msg: 'No pertenece a nigún usuario'}]
        // })
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

    //Mostrar mensaje
    //Vista al ingresar correo para reestablecer contraseña
    // res.render('templates/mensaje', {
    //     pagina: 'Restablece tu Password',
    //     mensaje: 'Hemos enviado un email con las instrucciones'
    // });
    return res.status(200).json({msg: 'Hemos enviado un email con las instrucciones'});
}

//Desde react se debe mandar a llamar esta función para validar el token del usuario en la BD
const comprobarToken = async (req, res) => {
    
    const { token } = req.params;
    
    const usuario = await Usuario.findOne({where: {token}});
    if(!usuario) {
        // return res.render('auth/confirmar-cuenta', {
        //     pagina: 'Restablece tu password',
        //     mensaje: 'Hubo un error al validar tu información, intenta de nuevo',
        //     error: true
        // })
        return res.status(400).json({msg: 'Hubo un error al validar tu información, intenta de nuevo'});
    }

    //Si el usuario es valido, continuar al siguiente middleware
    //Mostrar formulario para modificar el password
    //Dejar vacio el action se manda a la misma url en html
    // res.render('auth/reset-password', {
    //     pagina: 'Restablece Tu Password',
    //     csrfToken: req.csrfToken()
    // })
    return res.status(200).json({msg: 'Usuario validado correctamente'});

}

const nuevoPassword = async (req, res) => {
    //Validar el password
    //await check('password').isLength({ min: 6 }).withMessage('El password debe ser de al menos 6 caracteres').run(req);

    //let resultado = validationResult(req);

    //Verificar que el resultado este vacio
    // if(!resultado.isEmpty()) {
    //     //Errores    Evita que ya no se ejecuten más lineas del codigo
    //     return res.render('auth/reset-password', {
    //         pagina: 'Restablece tu Password',
    //         csrfToken: req.csrfToken(),
    //         errores: resultado.array()
    //     })
    // }

    const { token } = req.params;   //token recuperado de enlace para recuperar password
    const { password } = req.body;  //Se recupera del formulario para ingresar nueva password

    //Identificar quien hace el cambio
    const usuario = await Usuario.findOne({where: {token}});

    //Hashear el nuevo password
    const salt = await bcrypt.genSalt(10)
    usuario.password = await bcrypt.hash(password, salt);
    usuario.token = null;
    
    await usuario.save();

    // res.render('auth/confirmar-cuenta', {
    //     pagina: 'Password Restablecido',
    //     mensaje: 'El Password se guardó correctamente'
    // })
    return res.status(200).json({msg: 'El PASSWORD se he guardado correctamente'});
    
}


export {
    //formularioLogin,
    autenticar,
    //cerrarSesion,
    //formularioRegistro,
    registrar,
    confirmar,
    //formularioOlvidePassword,
    resetPassword,
    comprobarToken,
    nuevoPassword
}