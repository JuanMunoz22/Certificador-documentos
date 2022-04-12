const { crearHash } = require("../helpers/blockchain-validators")
const { fecha } = require("../helpers/date")
const { Documento } = require("../models")

var mongoose = require('mongoose');


//obtener todos los documentos - paginado - total
const obtenerDocumentos = async(req, res) => {

    const {limite = 10, desde = 0} = req.query;
    const query = {estado: true};

    const [total, documento] = await Promise.all([
        Documento.countDocuments(query),
        Documento.find(query)
        .populate('usuario', 'nombre')
        .skip(Number(desde))
        .limit(Number(limite))
    ])

    res.json({
        total,
        documento
    })
}

const obtenerDocumentoPorIDUsuario = async(req, res) => {

    const {limite = 5, desde = 0} = req.query;
    const {id} = req.params;
    const query = {usuario : mongoose.Types.ObjectId(id)};

    const [total, documentos] = await Promise.all([
        Documento.countDocuments(query),
        Documento.find(query)
        .skip(Number(desde))
        .limit(Number(limite))
    ])

    res.json({
        query,
        total,
        documentos
    })
}

const verificarHash = async(req, res) => {

    const {hash} = req.body;
    const verify = await Documento.findOne({hash});

    if(verify === null){
        return res.status(201).json({
            msg: `El hash: ${hash} no existe`
        })
    }else{
        return res.json({
            verify
        })
        
    }
}

const crearDocumento = async(req, res) => {

    const {estado, usuario, ...body} = req.body;
    const protectDate = fecha();
    const hash = crearHash(body.nombre, protectDate, body.size, body.lastModified);

    const documentoDB = await Documento.findOne({hash});
    
    if(documentoDB){
        return res.status(201).json({
            msg: `El documento ${documentoDB.hash} ya existe`
        })
    }

    //Data a guardar
    const data = {
        ...body,
        nombre: body.nombre.toUpperCase(),
        lastDate: 0,
        protectDate: protectDate,
        lastHash: 0,
        hash: hash,
        usuario: req.usuario._id
    }

    //guardar en DB
    const document = new Documento(data);
    await document.save();

    res.status(201).json(document);
}

const actualizarDocumento = async(req, res) => {
    const {id} = req.params;
    const {estado, usuario, ...data} = req.body;

    const documento = await Documento.findByIdAndUpdate(id, data, {new:true});

    res.json({documento})
}

const borrarDocumento = async(req, res) => {
    const {id} = req.params;
    const documento = await Documento.findByIdAndUpdate(id, {estado:false}, {new:true});

    res.json({documento})
}

module.exports = {
    actualizarDocumento,
    borrarDocumento,
    obtenerDocumentos,
    obtenerDocumentoPorIDUsuario,
    crearDocumento,
    verificarHash
}