import express from "express";
import { iniciarSesion,
         autenticar,
         cerrarSesion,
         //formularioOlvidePassword, 
         registrar, 
         confirmar, 
         resetPassword, 
         //formularioRegistro,
         comprobarToken,
         nuevoPassword } from "../controllers/authController.js";
import authenticate from "../middlewares/authenticate.js";

const router = express.Router();

router.get('/login', iniciarSesion);
router.post('/login', autenticar);

//Cerrar sesion
router.post('/cerrar-sesion', cerrarSesion)

//router.get('/registro', formularioRegistro);
router.post('/registro', registrar);

//    /:token corresponde a un routing dinamico
router.get('/confirmar/:token', confirmar);

//router.get('/olvide-password', formularioOlvidePassword);
router.post('/olvide-password', resetPassword);

//Almacena el nuevo password
router.get('/olvide-password/:token', comprobarToken);
router.post('/olvide-password/:token', nuevoPassword);

export default router