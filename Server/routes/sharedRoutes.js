import express from "express";
import {
    edit, 
    saveChange,
    identificador} from "../controllers/sharedController.js";
import authenticate from "../middlewares/authenticate.js";
import authorize from "../middlewares/authorize.js";
import upload from "../middlewares/uploadImage.js";

const router = express.Router();


//router.get('/catalogo', sharedController.catalogo);

router.get('/cuenta/:id', authenticate, authorize(['Admin', 'Client']), edit);

router.post('/cuenta/:id', authenticate, authorize(['Admin', 'Client']), saveChange);

//router.post('/identificador', authenticate, authorize(['Admin', 'Client']), upload.single('imagen'), identificador);
router.post('/identificador', upload.single('imagen'), identificador);




export default router