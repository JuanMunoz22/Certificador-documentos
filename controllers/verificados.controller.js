var mongoose = require('mongoose');
const { Verificados } = require('../models');

const obtenerVerificados = async(req, res) => {

    const {limite = 10, desde = 0} = req.query;

    const [total, documento] = await Promise.all([
        Verificados.countDocuments(query),
        Verificados.find(query)
        .populate('usuario', 'nombre')
        .skip(Number(desde))
        .limit(Number(limite))
    ])

    res.json({
        total,
        documento
    })
}

module.exports = {
    obtenerVerificados
}