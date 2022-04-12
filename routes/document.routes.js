const {Router} = require('express');
const {check} = require('express-validator');

const {validarJWT,
    validarCampos
} = require('../middlewares');

const { obtenerDocumentos, crearDocumento, obtenerDocumentoPorIDUsuario, verificarHash, actualizarDocumento, borrarDocumento } = require('../controllers/document.controller');
const { existeDocumentoPorId, existeDocumentoPorHash, existeUsuarioPorId } = require('../helpers/db-validators');

const router = Router();

//Obtener todos los documentos
router.get('/', obtenerDocumentos);

//Obtener documento por ID de usuario
router.get('/:id', [
    validarJWT,
    validarCampos
] ,obtenerDocumentoPorIDUsuario);

//Obtener Documento Por Hash
router.post('/verificar', [
    check('hash', 'El hash es obligatorio').not().isEmpty(),
    check('hash').custom(existeDocumentoPorHash),
    validarCampos
],verificarHash);

//Crear documentos - privado - cualquier rol
router.post('/',[
    validarJWT,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('size', 'El tamaño es obligatorio').not().isEmpty(),
    check('lastModified', 'la ultima fecha de modificación es obligatoria').not().isEmpty(),
    validarCampos
] ,crearDocumento);

//Actualizar Documento
router.put('/:id', [
    validarJWT,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('hash', 'El hash es obligatorio').not().isEmpty(),
    check('id', 'No es un id de Mongo valido').isMongoId(),
    check('id').custom(existeUsuarioPorId),
    check('hash').custom(existeDocumentoPorHash),
    validarCampos
],actualizarDocumento);

//Eliminar documento
router.delete('/:id', [
    validarJWT,
    check('id', 'No es un ID de Mongo valido').isMongoId(),
    check('id').custom(existeDocumentoPorId),
    validarCampos
],borrarDocumento);

module.exports = router;