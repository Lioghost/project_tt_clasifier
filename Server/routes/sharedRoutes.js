import express from "express";
import authenticate from "../middlewares/authenticate.js";
import authorize from "../middlewares/authorize.js";
import upload from "../middlewares/uploadImage.js";
import {
    edit, 
    saveChange,
    identificador} from "../controllers/sharedController.js";
import { marcas, automoviles, motorGet } from "../controllers/adminController.js";
import { juntasM } from "../controllers/adminJuntasController.js";


const router = express.Router();


//router.get('/catalogo', sharedController.catalogo);

router.get('/cuenta/:id', authenticate, authorize(['Admin', 'Client']), edit);

router.post('/cuenta/:id', authenticate, authorize(['Admin', 'Client']), saveChange);

//router.post('/identificador', authenticate, authorize(['Admin', 'Client']), upload.single('imagen'), identificador);
router.post('/identificador', upload.single('imagen'), identificador);


//Marca
router.get('/marcas', authenticate, authorize(['Admin', 'Client']), marcas);

//router.get('/marcas/:id', authenticate, authorize(['Admin']), marcaGet);

//Autos
router.get('/autos', authenticate, authorize(['Admin', 'Client']), automoviles);

//router.get('/autos/:id', authenticate, authorize(['Admin']), autoGet);

//Motor
//router.get('/motor', authenticate, authorize(['Admin']), motores);

router.get('/motor/:id', authenticate, authorize(['Admin', 'Client']), motorGet);

//Juntas-M
router.get('/juntas-ms/:id', authenticate, authorize(['Admin', 'Client']), juntasM);


export default router