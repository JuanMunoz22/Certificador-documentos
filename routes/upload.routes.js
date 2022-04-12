const {Router} = require('express');
const { check } = require('express-validator');

const { cargarArchivo, 
        actualizarImagen, 
        actualizarImagenCloudinary, 
        mostrarImagen, 
        proteguerDocumento, 
        verificarDocumento,
        verificarDocumentoHash} = require('../controllers/upload.controller');
const { coleccionesPermitidas, existeDocumentoPorHash } = require('../helpers');
const { validarArchivoSubir, 
        validarCampos, 
        validarJWT } = require('../middlewares');

const router = Router();

router.post('/', validarArchivoSubir ,cargarArchivo);

router.put('/:coleccion/:id', [
    validarArchivoSubir,
    check('id', 'No es un ID de Mongo valido').isMongoId(),
    check('coleccion').custom(c => coleccionesPermitidas(c, ['usuarios'])),
    validarCampos
], actualizarImagenCloudinary);

router.get('/:coleccion/:id', [
    check('id', 'No es un ID de Mongo valido').isMongoId(),
    check('coleccion').custom(c => coleccionesPermitidas(c, ['usuarios'])),
    validarCampos  
], mostrarImagen)

router.post('/proteguer', [
    validarJWT,
    validarArchivoSubir,
    validarCampos
],proteguerDocumento);

router.post('/verificar', [
    validarArchivoSubir,
    validarCampos
],verificarDocumento)

router.post('/verificarhash', [
    check('hash', 'El hash es obligatorio').not().isEmpty(),
    check('hash').custom(existeDocumentoPorHash),
    validarCampos
],verificarDocumentoHash)

module.exports = router;
