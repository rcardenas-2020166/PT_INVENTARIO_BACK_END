'use strict'
const sql = require('mssql');
const config = require('../../configs/sqlServerConfig');

// GET ALL TIPO EQUIPO //
exports.getAllTipoEquipo = async (req, res) => {
    try 
    {
        const pool = await sql.connect(config);
        const result = await pool.request().query(`SELECT * FROM CAT_TIPO_EQUIPO`);
        res.status(200).json({response : result.recordset});
    }
    catch (err) 
    {
        res.status(500).json({
            status: 'ERROR',
            message: `Error al obtener los Tipos de Equipo. ${err}`
        });
    }
};

// GET ACTIVE TIPO EQUIPO //
exports.getActiveTipoEquipo = async (req, res) => {
    try 
    {
        const pool = await sql.connect(config);
        const result = await pool.request().query(`SELECT * FROM CAT_TIPO_EQUIPO WHERE ESTADO = 'A'`);
        res.status(200).json({response : result.recordset});
    }
    catch (err) 
    {
        res.status(500).json({
            status: 'ERROR',
            message: `Error al obtener los Tipos de Equipo. ${err}`
        });
    }
};

// CREATE TIPO EQUIPO //
exports.createTipoEquipo = async (req, res) => {
    const { NOMBRE_TIPO_EQUIPO } = req.body;
    try 
    {
        const pool = await sql.connect(config);
        const existImageType = await pool.request()
            .input('nombre_tipo_equipo', sql.VarChar(150), NOMBRE_TIPO_EQUIPO)
            .query(`
                SELECT COUNT(*) AS count 
                FROM CAT_TIPO_EQUIPO 
                WHERE LOWER(nombre_tipo_equipo) = LOWER(@nombre_tipo_equipo)
                AND ESTADO = 'A'
            `);


        if (existImageType.recordset[0].count > 0) 
            return res.status(400).json({ status: 'ALERT', message: 'El Tipo de Equipo ya existe.'});

        const jsonInput = req.body;

        const result = await pool.request()
            .input('jsonInput', sql.NVarChar(sql.MAX), JSON.stringify(jsonInput))
            .execute('sp_insert_tipo_equipo');
            const response = result.recordset[0];
            const { JsonResponse } = response;
            res.status(200).json({response : JSON.parse(JsonResponse), status: 'SUCCESS'});
    }
    catch (err) 
    {
        res.status(500).json({
            status: 'ERROR',
            message: `Error al crear el Tipo de Equipo. ${err}`
        });
    }
};

// UPDATE TIPO EQUIPO //
exports.updateTipoEquipo = async (req, res) => {
    const { NOMBRE_TIPO_EQUIPO, ID_TIPO_EQUIPO } = req.body;
    try 
    {
        const pool = await sql.connect(config);
        const existImageType = await pool.request()
        .input('nombre_tipo_equipo', sql.VarChar(50), NOMBRE_TIPO_EQUIPO)
        .input('id_tipo_equipo', sql.Int(11), ID_TIPO_EQUIPO)
        .query(`
            SELECT COUNT(*) AS count 
            FROM CAT_TIPO_EQUIPO 
            WHERE LOWER(nombre_tipo_equipo) = LOWER(@nombre_tipo_equipo) AND id_tipo_equipo <> @id_tipo_equipo AND ESTADO = 'A'
        `);

    if (existImageType.recordset[0].count > 0) 
        return res.status(400).json({ status: 'ALERT', message: 'El Tipo de Equipo ya existe.'});

    const jsonInput = req.body;
        
        const result = await pool.request()
            .input('jsonInput', sql.NVarChar(sql.MAX), JSON.stringify(jsonInput))
            .execute('sp_update_tipo_equipo');
            const response = result.recordset[0];
            const { JsonResponse } = response;
            res.status(200).json({response : JSON.parse(JsonResponse)});
    }
    catch (err) 
    {
        console.log(err)
        res.status(500).json({
            status: 'ERROR',
            message: `Error al actualizar el Tipo de Equipo. ${err}`
        });
    }
};

// DELETE IMAGE TYPE //
exports.deleteTipoEquipo = async (req, res) => {
    try 
    {
        const pool = await sql.connect(config);

        const jsonInput = req.body;
        
        const result = await pool.request()
            .input('jsonInput', sql.NVarChar(sql.MAX), JSON.stringify(jsonInput))
            .execute('sp_delete_tipo_equipo');
            const response = result.recordset[0];
            const { JsonResponse } = response;
            res.status(200).json({response : JSON.parse(JsonResponse)});
    }
    catch (err) 
    {
        res.status(500).json({
            status: 'ERROR',
            message: `Error al eliminar el Tipo de Equipo. ${err}`
        });
    }
};