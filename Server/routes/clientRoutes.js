import express from "express";
import { dashboard,
         sendJuntasDesconocidas
        } from "../controllers/clientController.js";
import authenticate from "../middlewares/authenticate.js";
import authorize from "../middlewares/authorize.js";
import upload from "../middlewares/uploadImage.js";
const router = express.Router();


// Ruta para el dashboard del cliente
router.get('/dashboard', authenticate, authorize('Client'), dashboard);

router.post('/unknown-juntas', authenticate, authorize('Client'), upload.single('imagen'), sendJuntasDesconocidas);
//router.post('/unknown-juntas', juntaName, upload.single('imagen'), sendJuntasDesconocidas);

export default router