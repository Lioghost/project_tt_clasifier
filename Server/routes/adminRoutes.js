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
    autoDelete
} from "../controllers/adminController.js";
import authenticate from "../middlewares/authenticate.js";
import authorize from "../middlewares/authorize.js";
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

//router.patch('/auto/:id', authenticate, authorize(['Admin']), updateAuto);

router.delete('/autos/:id', authenticate, authorize(['Admin']), autoDelete);

export default router