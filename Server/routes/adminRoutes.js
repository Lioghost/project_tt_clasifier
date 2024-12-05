import express from "express";
import authenticate from "../middlewares/authenticate.js";
import authorize from "../middlewares/authorize.js";
import upload from "../middlewares/uploadImage.js";
import { 
    generateJuntasId, 
    juntasG,
    juntasGCreate, 
    juntasGDelete, 
    juntasGUpdate,
    juntasMCreate,
    juntasM,
    juntasMGet,
    juntasMUpdate,
    juntasMDelete 
} from "../controllers/adminJuntasController.js";
import {
    dashboard,
    users,
    enableAdminUser,
    marcas,
    marcaCreate,
    marcaGet,
    marcaUpdate,
    marcaDelete,
    automoviles,
    autoCreate,
    autoDelete,
    autoGet,
    autoUpdate, 
    motores,
    motorCreate,
    motorGet,
    motorUpdate,
    motorDelete
} from "../controllers/adminController.js";


const router = express.Router();

// Ruta para el dashboard del cliente
router.get('/dashboard', authenticate, authorize(['Admin']), dashboard);

// route to get all users
router.get('/users', authenticate, authorize(['Admin']), users);

// route to enable admin user
router.patch('/users/:id', authenticate, authorize(['Admin']), enableAdminUser);

//Marca

//router.get('/marcas', authenticate, authorize(['Admin']), marcas);

router.get('/marcas/:id', authenticate, authorize(['Admin']), marcaGet);

router.post('/marcas', authenticate, authorize(['Admin']), marcaCreate);

router.patch('/marcas/:id', authenticate, authorize(['Admin']), marcaUpdate);

router.delete('/marcas/:id', authenticate, authorize(['Admin']), marcaDelete);

//Autos
//router.get('/autos', authenticate, authorize(['Admin']), automoviles);

router.get('/autos/:id', authenticate, authorize(['Admin']), autoGet);

router.post('/autos', authenticate, authorize(['Admin']), autoCreate);

router.patch('/autos/:id', authenticate, authorize(['Admin']), autoUpdate);

router.delete('/autos/:id', authenticate, authorize(['Admin']), autoDelete);

//Motor
router.get('/motor', authenticate, authorize(['Admin']), motores);

//router.get('/motor/:id', authenticate, authorize(['Admin']), motorGet);

router.post('/motor', authenticate, authorize(['Admin']), motorCreate);

router.patch('/motor/:id', authenticate, authorize(['Admin']), motorUpdate);

router.delete('/motor/:id', authenticate, authorize(['Admin']), motorDelete);

//JuntasG
router.get('/juntas-g-id', authenticate, authorize(['Admin']), generateJuntasId);

router.get('/juntas-g', authenticate, authorize(['Admin']), juntasG);

//router.get('/juntas-g/:id', authenticate, authorize(['Admin']), juntasGUpdateGet);

router.post('/juntas-g', authenticate, authorize(['Admin']), upload.single('imagen'), juntasGCreate);

router.delete('/juntas-g/:id', authenticate, authorize(['Admin']), juntasGDelete);

router.patch("/juntas-g/:id", authenticate, authorize(['Admin']), upload.single('imagen'), juntasGUpdate)

//JuntasM
//router.get('/juntas-ms/:id', authenticate, authorize(['Admin']), juntasM);

router.get('/juntas-m/:id', authenticate, authorize(['Admin']), juntasMGet);

router.post('/juntas-m/:id', authenticate, authorize(['Admin']), juntasMCreate);

router.delete('/juntas-m/:id', authenticate, authorize(['Admin']), juntasMDelete);

router.patch("/juntas-m/:id", authenticate, authorize(['Admin']), juntasMUpdate)

export default router