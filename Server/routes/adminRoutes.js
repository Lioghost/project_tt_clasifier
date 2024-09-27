import express from "express";
import {
    dashboard,
    users,
    enableAdminUser,
    marcas,
    marcaCreate,
    marcaUpdate,
    marcaDelete,
    automoviles,
    autoCreate,
    autoDelete,
    autoUpdate, 
    motores,
    motorCreate,
    motorUpdate,
    motorDelete,
    generateJuntasId,
    juntaCreate,
    juntaDelete
} from "../controllers/adminController.js";
import authenticate from "../middlewares/authenticate.js";
import authorize from "../middlewares/authorize.js";
import upload from "../middlewares/uploadImage.js";
const router = express.Router();

// Ruta para el dashboard del cliente
router.get('/dashboard', authenticate, authorize('Admin'), dashboard);

// route to get all users
router.get('/users', authenticate, authorize(['Admin']), users);

// route to enable admin user
router.patch('/users/:id', authenticate, authorize(['Admin']), enableAdminUser);

//Marca

router.get('/marcas', authenticate, authorize(['Admin']), marcas);

router.post('/marcas', authenticate, authorize(['Admin']), marcaCreate);

router.patch('/marcas/:id', authenticate, authorize(['Admin']), marcaUpdate);

router.delete('/marcas/:id', authenticate, authorize(['Admin']), marcaDelete);

//Autos
router.get('/autos', authenticate, authorize(['Admin']), automoviles);

router.post('/autos', authenticate, authorize(['Admin']), autoCreate);

router.patch('/autos/:id', authenticate, authorize(['Admin']), autoUpdate);

router.delete('/autos/:id', authenticate, authorize(['Admin']), autoDelete);

//Motor
router.get('/motor', authenticate, authorize(['Admin']), motores);

router.post('/motor', authenticate, authorize(['Admin']), motorCreate);

router.patch('/motor/:id', authenticate, authorize(['Admin']), motorUpdate);

router.delete('/motor/:id', authenticate, authorize(['Admin']), motorDelete);

//Juntas
router.get('/juntas-id', authenticate, authorize(['Admin']), generateJuntasId);

router.post('/juntas', authenticate, authorize(['Admin']), upload.single('imagen'), juntaCreate);

router.delete('/juntas/:id', authenticate, authorize(['Admin']), juntaDelete);

export default router