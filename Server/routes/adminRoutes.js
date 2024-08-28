import express from "express";
import {
    dashboard,
    users,
    enable_admin_user
} from "../controllers/adminController.js";
import authenticate from "../middlewares/authenticate.js";
import authorize from "../middlewares/authorize.js";
const router = express.Router();

// Ruta para el dashboard del cliente
router.get('/dashboard', authenticate, authorize('Admin'), dashboard);

// route to get all users
router.get('/users', authenticate, authorize(['Admin']), users);

// route to enable admin user
router.put('/users/:id', authenticate, authorize(['Admin']), enable_admin_user);

export default router