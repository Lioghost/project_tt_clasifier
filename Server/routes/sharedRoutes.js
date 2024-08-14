import express from "express";
import {edit, saveChange} from "../controllers/sharedController.js";
import authenticate from "../middlewares/authenticate.js";
import authorize from "../middlewares/authorize.js";

const router = express.Router();


//router.get('/catalogo', sharedController.catalogo);

router.get('/cuenta/:id', authenticate, authorize(['Admin', 'Client']), edit);

router.post('/cuenta/:id', authenticate, authorize(['Admin', 'Client']), saveChange);

//router.get('/juntas', sharedController.juntas);


export default router