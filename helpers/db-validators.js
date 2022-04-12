const Role = require('../models/role.model');
const Usuario = require('../models/usuario.model');

const {validateRUT, clearRUT} = require('validar-rut');
const { Documento } = require('../models');


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

const existeDocumentoPorHash = async(hash = '') => {
    //Verificar si existen documentos por el hash indicado
    const existeDocumento = await Documento.findOne({hash});
    if(!existeDocumento){
        throw new Error(`El Hash: ${hash} no existe`)
    }
}

const existeDocumentoPorId = async(id) => {
    //Verificar si existe el documento
    const existeID = await Documento.findById(id);
    if(!existeID){
        throw new Error(`El documento con id: ${id} no existe`);
    }
}

//Validar colecciones permitidas
const coleccionesPermitidas = (coleccion = '', colecciones = []) => {
    const incluida = colecciones.includes(coleccion);
    if(!incluida){
        throw new Error(`La coleccion ${coleccion} no es permitida`);
    }

    return true;
}



module.exports = {
    coleccionesPermitidas,
    esRolValido,
    emailExiste,
    existeUsuarioPorId,
    existeDocumentoPorHash,
    existeDocumentoPorId,
    rutExiste,
    rutValido
}


