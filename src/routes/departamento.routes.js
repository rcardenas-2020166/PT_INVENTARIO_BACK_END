const express = require('express');
const router = express.Router();
const departamentoController = require('../controllers/departamento.controller');

// Rutas Departamento //
router.post('/createDepartamento', departamentoController.createDepartamento);
router.get('/getAllDepartamento', departamentoController.getAllDepartamento);
router.get('/getActiveDepartamento', departamentoController.getActiveDepartamento);
router.put('/updateDepartamento', departamentoController.updateDepartamento);
router.put('/deleteDepartamento', departamentoController.deleteDepartamento);

module.exports = router;
