'use strict';
const sql = require('mssql');
const config = require('../../configs/sqlServerConfig');

const generateCodigoInventario = async (pool) => {
    const result = await pool.request().query(`
        SELECT ISNULL(MAX(ID_CONTROL_INVENTARIO), 0) + 1 AS nextId 
        FROM CFG_CONTROL_INVENTARIO
    `);
    const nextId = result.recordset[0].nextId;
    const prefix = 'INV';
    const codigo = `${prefix}-${String(nextId).padStart(5, '0')}`;
    return codigo;
};

// GET ALL CONTROL INVENTARIO
exports.getAllControlInventario = async (req, res) => {
    try {
        const pool = await sql.connect(config);
        const query = `
            SELECT 
                ci.*,
                te.NOMBRE_TIPO_EQUIPO,
                d.NOMBRE_DEPARTAMENTO
            FROM CFG_CONTROL_INVENTARIO ci
            INNER JOIN CAT_TIPO_EQUIPO te ON ci.ID_TIPO_EQUIPO = te.ID_TIPO_EQUIPO
            INNER JOIN CAT_DEPARTAMENTO d ON ci.ID_DEPARTAMENTO = d.ID_DEPARTAMENTO
        `;
        const result = await pool.request().query(query);
        res.status(200).json({ response: result.recordset });
    } catch (err) {
        console.log(err)
        res.status(500).json({
            status: 'ERROR',
            message: `Error al obtener los registros de inventario. ${err}`
        });
    }
};


// CREATE CONTROL INVENTARIO
exports.createControlInventario = async (req, res) => {
    const { MARCA, ID_TIPO_EQUIPO, ID_DEPARTAMENTO, NOMBRE_RESPONSABLE } = req.body;
    try {
        const pool = await sql.connect(config);

        const codigoInventario = await generateCodigoInventario(pool);

        const jsonInput = {
            CODIGO_INVENTARIO: codigoInventario,
            MARCA,
            ID_TIPO_EQUIPO,
            ID_DEPARTAMENTO,
            NOMBRE_RESPONSABLE
        };

        const result = await pool.request()
            .input('jsonInput', sql.NVarChar(sql.MAX), JSON.stringify(jsonInput))
            .execute('sp_insert_control_inventario');
        const response = result.recordset[0];
        const { JsonResponse } = response;
        res.status(200).json({ response: JSON.parse(JsonResponse), status: 'SUCCESS' });
    } catch (err) {
        res.status(500).json({
            status: 'ERROR',
            message: `Error al crear el registro de inventario. ${err}`
        });
    }
};

// UPDATE CONTROL INVENTARIO
exports.updateControlInventario = async (req, res) => {
    try 
    {
        const pool = await sql.connect(config);
        const jsonInput = req.body;
        const result = await pool.request()
            .input('jsonInput', sql.NVarChar(sql.MAX), JSON.stringify(jsonInput))
            .execute('sp_update_control_inventario');
            const response = result.recordset[0];
            const { JsonResponse } = response;
            res.status(200).json({response : JSON.parse(JsonResponse)});
    }
    catch (err) 
    {
        res.status(500).json({
            status: 'ERROR',
            message: `Error al actualizar el Registro de inventario. ${err}`
        });
    }
};

// DELETE CONTROL INVENTARIO
exports.deleteControlInventario = async (req, res) => {
    try 
    {
        const pool = await sql.connect(config);

        const jsonInput = req.body;
        
        const result = await pool.request()
            .input('jsonInput', sql.NVarChar(sql.MAX), JSON.stringify(jsonInput))
            .execute('sp_delete_control_inventario');
            const response = result.recordset[0];
            const { JsonResponse } = response;
            res.status(200).json({response : JSON.parse(JsonResponse)});
    }
    catch (err) 
    {
        res.status(500).json({
            status: 'ERROR',
            message: `Error al eliminar el registro inventario. ${err}`
        });
    }
};
