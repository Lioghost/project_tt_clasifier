import express from "express";
import {dashboard} from "../controllers/adminController.js";
import authenticate from "../middlewares/authenticate.js";
import authorize from "../middlewares/authorize.js";
const router = express.Router();

// Ruta para el dashboard del cliente
router.get('/dashboard', authenticate, authorize('Admin'), dashboard);

export default router