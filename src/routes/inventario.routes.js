const express = require('express');
const router = express.Router();
const controlInventarioController = require('../controllers/inventario.controller');

// Rutas ControlInventario //
router.post('/createControlInventario', controlInventarioController.createControlInventario);
router.get('/getAllControlInventario', controlInventarioController.getAllControlInventario);
router.put('/updateControlInventario', controlInventarioController.updateControlInventario);
router.put('/deleteControlInventario', controlInventarioController.deleteControlInventario);

module.exports = router;
