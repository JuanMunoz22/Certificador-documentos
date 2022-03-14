const {response} = require('express');
const bcryptjs = require('bcryptjs');
const {clearRUT} = require('validar-rut');

const Usuario = require('../models/usuario.model');

const crearUsuario = async(req, res) => {

    const {rut, nombre, correo, password, rol} = req.body;
    const usuario = new Usuario({rut, nombre, correo, password, rol});
    
    //Limpiar RUT
    const rutLimpio = clearRUT(rut);
    usuario.rut = rutLimpio;

    //Encriptar la contraseña
    const salt = bcryptjs.genSaltSync();
    usuario.password = bcryptjs.hashSync(password, salt);


    //Guardar en base de datos
    await usuario.save();

    res.json({
        msg: 'Usuario creado correctamente',
        usuario
    })
}

const actualizarUsuario = async(req, res) => {

    const {id} = req.params;
    const {_id, rut, password, correo, ...resto} = req.body

    //TODO Validar contra base de datos
    if(password){
       //Encriptar la contraseña
        const salt = bcryptjs.genSaltSync();
        resto.password = bcryptjs.hashSync(password, salt); 
    }

    const usuario = await Usuario.findByIdAndUpdate(id, resto, {new: true});

    res.json(usuario)
}

const getUsuarios = async(req, res) => {

    const {limite = 5, desde = 0} = req.query;
    const query = {estado: true};

    const [total, usuarios] = await Promise.all([
        Usuario.countDocuments(query),
        Usuario.find(query)
        .skip(Number(desde))
        .limit(Number(limite))
    ]);

    res.json({
        total,
        usuarios
    })
}

const eliminarUsuario = async(req, res) => {
    const {id} = req.params;

    const usuario = await Usuario.findByIdAndUpdate(id, {estado: false}, {new: true});

    res.json({
        usuario
    })    
}

module.exports = {
    actualizarUsuario,
    crearUsuario,
    eliminarUsuario,
    getUsuarios
}