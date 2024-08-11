import express from "express";

const router = express.Router();


// Ruta para el dashboard del cliente
router.get('/dashboard', authenticate, authorize('Cliente'));

export default router