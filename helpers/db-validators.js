const Role = require('../models/role.model');
const Usuario = require('../models/usuario.model');

const {validateRUT, clearRUT} = require('validar-rut');


const esRolValido = async(rol = '') => {
    const existeRol = await Role.findOne({rol});
    if(!existeRol){
        throw new Error(`El rol ${rol} no esta registrado en la base de datos`);
    }
}

const emailExiste = async(correo = '') => {
    //Verificar si existe el correo
    const existeEmail = await Usuario.findOne({correo});
    if(existeEmail){
        throw new Error(`El correo ${correo} ya se encuentra registrado`)
    }
}

const rutExiste = async(rut = '') => {
    //Limpiar Rut
    const rutLimpio = clearRUT(rut);

    //Verificar si existe el RUT 
    const existeRut = await Usuario.findOne({"rut":rutLimpio});
    if(existeRut){
        throw new Error(`El RUT ${rut} ya se encuentra registrado`)
    }
}

const rutValido = async(rut = '') => {
    //Validar Rut
    const validarRut = validateRUT(rut);
    if(!validarRut){
        throw new Error(`El rut ${rut} no es valido`)
    }
}

const existeUsuarioPorId = async(id) => {

    //Verificar si existe el usuario por ID
    const existeUsuario = await Usuario.findById(id);
    if(!existeUsuario){
        throw new Error(`El id ${id} no existe`)
    }
}



module.exports = {
    esRolValido,
    emailExiste,
    existeUsuarioPorId,
    rutExiste,
    rutValido
}


