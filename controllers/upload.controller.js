const path  = require('path');
const fs = require('fs');

const cloudinary = require('cloudinary').v2;
cloudinary.config(process.env.CLOUDINARY_URL);

const {Usuario, Documento} = require('../models');
const { subirArchivo,
        fecha,
        crearHash,
        certificarPDF
} = require("../helpers/");


const cargarArchivo = async(req, res) => {

    try {
    //  const nombre = await subirArchivo(req.files, ['pdf'], 'documentos');
      const nombre = await subirArchivo(req.files, undefined, 'imgs');
      res.json({nombre})
    } catch (msg) {
      res.status(400).json({msg})
    }
}

const actualizarImagen = async(req, res) => {
  
  const {id, coleccion} = req.params;

  let modelo;

  switch (coleccion) {
    case 'usuarios':
      modelo = await Usuario.findById(id);
      if(!modelo){
        return res.status(400).json({
          msg: `No existe un usuario con el id: ${id}`
        });
      };
      break;
  
    default:
      return res.status(500).json({
        msg: 'Se me olvido validar esto'
    })
  }
    //Limpiar imagenes previas
    if(modelo.img){
      //Borrar imagen del servidor
      const pathImagen = path.join(modelo.img);
      if(fs.existsSync(pathImagen)){
        fs.unlinkSync(pathImagen)
      }
    }

    const nombre = await subirArchivo(req.files, undefined, coleccion);
    modelo.img =  nombre;

    await modelo.save();

    res.json(modelo);
}

const actualizarImagenCloudinary = async(req, res) => {
  
  const {id, coleccion} = req.params;

  let modelo;

  switch (coleccion) {
    case 'usuarios':
      modelo = await Usuario.findById(id);
      if(!modelo){
        return res.status(400).json({
          msg: `No existe un usuario con el id: ${id}`
        });
      };
      break;
  
    default:
      return res.status(500).json({
        msg: 'Se me olvido validar esto'
    })
  }

  //Limpiar imagenes previas
  if(modelo.img){
    const nombreArr = modelo.img.split('/');
    const nombre = nombreArr[nombreArr.length -1];
    const [public_id] = nombre.split('.');

    await cloudinary.uploader.destroy(public_id);
}

  const {tempFilePath} = req.files.archivo;
  const {secure_url} = await cloudinary.uploader.upload(tempFilePath);
  modelo.img = secure_url;

  await modelo.save();

  res.json(modelo);
}

const mostrarImagen = async(req, res) => {

  const {id, coleccion} = req.params;

  let modelo;

  switch (coleccion) {
    case 'usuarios':
      modelo = await Usuario.findById(id);
      if(!modelo){
        return res.status(400).json({
          msg: `No existe un usuario con el id: ${id}`
        });
      };
      break;
  
    default:
      return res.status(500).json({
        msg: 'Se me olvido validar esto'
    })
  }
    //Limpiar imagenes previas
    if(modelo.img){
      //Borrar imagen del servidor
      const pathImagen = path.join(modelo.img);
      if(fs.existsSync(pathImagen)){
        return res.sendFile(pathImagen);
      }
    }

    const pathImagen = path.join(__dirname, '../assets/avatar.png');
    res.sendFile(pathImagen); 
}

const proteguerDocumento = async(req, res) => {
 
  const data = {
    nombre: req.files.archivo.name,
    size: req.files.archivo.size,
    md5: req.files.archivo.md5,
    protectDate: fecha()
  }

  const hash = crearHash(data.nombre, data.size, data.md5);
  
  const documentoDB = await Documento.findOne({hash});
  if(documentoDB){
    return res.status(201).json({
      msg: `El documento ${documentoDB.hash} ya existe`
   })
  }
  
  //Guardar en servidor
  try {
    const nombre = await subirArchivo(req.files, ['pdf'], 'documentos', hash);

    //Data a guardar
    const documentInfo = {
      nombre: data.nombre.toUpperCase(),
      lastDate: 'Sin modificaciones anteriores',
      protectDate: data.protectDate,
      lastHash: 'Sin hash anterior',
      hash: hash,
      path: nombre,
      usuario: req.usuario._id
    }

    //Certificar PDF
    const certificar = await certificarPDF(req.files, data.nombre, 'Sin modificaciones anteriores',
    data.protectDate, 'Sin hash anterior', hash
    );

    if(!certificar){
      res.status(400).json({
        msg: 'Error al certificar documento, solo se permiten archivos PDF'
      })
    }

    //Guardar en DB
    const saveDocument = new Documento(documentInfo);
    await saveDocument.save()
    
    return res.status(201).json(saveDocument); 
  
  } catch (error) {
    return res.status(400).json({
      msg: 'Error al certificar documento, solo se permiten archivos PDF'
    })
  }

}

const verificarDocumento = async(req, res) => {
  
  const data = {
    nombre: req.files.archivo.name,
    size: req.files.archivo.size,
    md5: req.files.archivo.md5,
  }

  const hash = crearHash(data.nombre, data.size, data.md5);

  const documentoDB = await Documento.findOne({hash});
  if(!documentoDB){
    return res.status(201).json({
      msg: `El documento ${hash} no esta proteguido`
   })
  }  
  console.log(documentoDB.path);
  res.json({path: documentoDB.path});
}

const verificarDocumentoHash = async(req, res) => {

  const{hash} = req.body;
  const verify = await Documento.findOne({hash});

  if(verify === null){
    return res.status(201).json({
      msg: `El hash: ${hash} no existe`
    })
  }else{
    return res.sendFile(verify.path);
  }

}


module.exports = {
  actualizarImagen,
  actualizarImagenCloudinary,
  cargarArchivo,
  mostrarImagen,
  proteguerDocumento,
  verificarDocumento,
  verificarDocumentoHash
}


