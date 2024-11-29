const express = require('express');
const router = express.Router();
const tipoEquipoController = require('../controllers/tipoEquipo.controller');

// Rutas CAT_EMPLOYEE_TYPE //
router.post('/createTipoEquipo', tipoEquipoController.createTipoEquipo);
router.get('/getAllTipoEquipo', tipoEquipoController.getAllTipoEquipo);
router.get('/getActiveTipoEquipo', tipoEquipoController.getActiveTipoEquipo);
router.put('/updateTipoEquipo', tipoEquipoController.updateTipoEquipo);
router.put('/deleteTipoEquipo', tipoEquipoController.deleteTipoEquipo);

module.exports = router;
