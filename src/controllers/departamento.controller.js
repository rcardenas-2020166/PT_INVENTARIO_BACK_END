const sql = require('mssql');
const config = require('../../configs/sqlServerConfig');

// GET ALL DEPARTAMENTO //
exports.getAllDepartamento = async (req, res) => {
    try 
    {
        const pool = await sql.connect(config);
        const result = await pool.request().query(`SELECT * FROM CAT_DEPARTAMENTO`);
        res.status(200).json({response : result.recordset});
    }
    catch (err) 
    {
        res.status(500).json({
            status: 'ERROR',
            message: `Error al obtener los Departamentos. ${err}`
        });
    }
};

// GET ACTIVE DEPARTAMENTO //
exports.getActiveDepartamento = async (req, res) => {
    try 
    {
        const pool = await sql.connect(config);
        const result = await pool.request().query(`SELECT * FROM CAT_DEPARTAMENTO WHERE ESTADO = 'A'`);
        res.status(200).json({response : result.recordset});
    }
    catch (err) 
    {
        res.status(500).json({
            status: 'ERROR',
            message: `Error al obtener los Departamentos. ${err}`
        });
    }
};

// CREATE DEPARTAMENTO //
exports.createDepartamento = async (req, res) => {
    const { NOMBRE_DEPARTAMENTO } = req.body;
    const jsonInput = req.body;
    try 
    {
        const pool = await sql.connect(config);
        const existService = await pool.request()
        .input('nombre_departamento', sql.VarChar(255), NOMBRE_DEPARTAMENTO)
        .query(`
            SELECT COUNT(*) AS count 
            FROM CAT_DEPARTAMENTO
            WHERE LOWER(nombre_departamento) = LOWER(@nombre_departamento)
            AND ESTADO = 'A'
        `);

        if (existService.recordset[0].count > 0) 
            return res.status(400).json({ status: 'ALERT', message: 'El Departamento ya existe.'});
        const result = await pool.request()
            .input('jsonInput', sql.NVarChar(sql.MAX), JSON.stringify(jsonInput))
            .execute('sp_insert_departamento');
            const response = result.recordset[0];
            const { JsonResponse } = response;
            res.status(200).json({response : JSON.parse(JsonResponse)});
    } 
    catch (err) 
    {
        res.status(500).json({
            status: 'ERROR',
            message: `Error al crear el Departamento. ${err}`
        });
    }
};

// UPDATE DEPARTAMENTO //
exports.updateDepartamento = async (req, res) => {
    const { NOMBRE_DEPARTAMENTO, ID_DEPARTAMENTO } = req.body;
    try 
    {
        const pool = await sql.connect(config);
        const existService = await pool.request()
        .input('nombre_departamento', sql.VarChar(50), NOMBRE_DEPARTAMENTO)
        .input('id_departamento', sql.Int(11), ID_DEPARTAMENTO)

        .query(`
            SELECT COUNT(*) AS count 
            FROM CAT_DEPARTAMENTO 
            WHERE LOWER(nombre_departamento) = LOWER(@nombre_departamento) AND id_departamento <> @id_departamento AND ESTADO = 'A'
        `);

        if (existService.recordset[0].count > 0) 
            return res.status(400).json({ status: 'ALERT', message: 'El Departamento ya existe.'});

        const jsonInput = req.body;
        
        const result = await pool.request()
            .input('jsonInput', sql.NVarChar(sql.MAX), JSON.stringify(jsonInput))
            .execute('sp_update_departamento');
            const response = result.recordset[0];
            const { JsonResponse } = response;
            res.status(200).json({response : JSON.parse(JsonResponse)});
    }
    catch (err) 
    {
        res.status(500).json({
            status: 'ERROR',
            message: `Error al actualizar el Departamento. ${err}`
        });
    }
};

// DELETE DEPARTAMENTO //
exports.deleteDepartamento = async (req, res) => {
    try 
    {
        const pool = await sql.connect(config);

        const jsonInput = req.body;
        
        const result = await pool.request()
            .input('jsonInput', sql.NVarChar(sql.MAX), JSON.stringify(jsonInput))
            .execute('sp_delete_departamento');
            const response = result.recordset[0];
            const { JsonResponse } = response;
            res.status(200).json({response : JSON.parse(JsonResponse)});
    }
    catch (err) 
    {
        res.status(500).json({
            status: 'ERROR',
            message: `Error al eliminar el Departamento. ${err}`
        });
    }
};