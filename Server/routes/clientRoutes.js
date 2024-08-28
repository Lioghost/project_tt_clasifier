import express from "express";
import { dashboard } from "../controllers/clientController.js";
import authenticate from "../middlewares/authenticate.js";
import authorize from "../middlewares/authorize.js";
const router = express.Router();


// Ruta para el dashboard del cliente
router.get('/dashboard', authenticate, authorize('Cliente'), dashboard);

export default router