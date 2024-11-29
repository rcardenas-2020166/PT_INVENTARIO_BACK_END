'use strict';

const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
const swaggerDocs = require('./swagger');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const cors = require('cors');

const tipoEquipoRoutes = require('../src/routes/tipoEquipo.routes');
const departamentoRoutes = require('../src/routes/departamento.routes');
const inventarioRoutes = require('../src/routes/inventario.routes');

const ENVIRONMENT = process.env.ENVIRONMENT || 'dev';
const envPath = path.resolve(__dirname, `../.env.${ENVIRONMENT}`);
const app = express();

dotenv.config({ path: envPath });
const port = process.env.PORT || 3000; 
swaggerDocs(app);

app.use(express.json());
app.use(helmet());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Routes //
app.use('/api/departamento', departamentoRoutes);
app.use('/api/tipoEquipo', tipoEquipoRoutes);
app.use('/api/inventario', inventarioRoutes);

exports.initServer = () => app.listen(port, async () => {
    console.log(`Listening on port ${port}`);
});
