import express from "express";
import { dashboard,
         sendJuntasDesconocidas
        } from "../controllers/clientController.js";
import authenticate from "../middlewares/authenticate.js";
import authorize from "../middlewares/authorize.js";
import upload from "../middlewares/uploadImage.js";
const router = express.Router();


// Ruta para el dashboard del cliente
router.get('/dashboard', authenticate, authorize('Cliente'), dashboard);

router.post('/unknowk-juntas', authenticate, authorize('Cliente'), upload.single('image'), sendJuntasDesconocidas);

export default router