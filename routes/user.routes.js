const {Router} = require('express');
const { check } = require('express-validator');

//Middlewares
const {
    validarCampos, 
    validarJWT, 
    esAdminRole, 
    tieneRole
} = require('../middlewares');

const { crearUsuario, 
        actualizarUsuario, 
        getUsuarios, 
        eliminarUsuario } = require('../controllers/user.controller');
        
const { esRolValido, 
        emailExiste, 
        rutExiste, 
        rutValido, 
        existeUsuarioPorId} = require('../helpers/db-validators');

const router = Router();

//Obtener Usuarios
router.get('/', getUsuarios)

//Ruta Crear Usuario
router.post('/', [
    check('rut', 'El RUT es obligatorio').not().isEmpty(),
    check('rut').custom(rutValido), 
    check('rut').custom(rutExiste), 
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('correo', 'El correo es obligatorio').not().isEmpty(),
    check('correo', 'El correo no es valido').isEmail(),
    check('correo').custom(emailExiste), 
    check('password', 'La contraseña es obligatoria, debe ser de 6 caracteres minimo').isLength({min: 6}),
    check('rol').custom(esRolValido), 
    validarCampos,
],crearUsuario)

//Ruta Actualizar Usuario
router.put('/:id', [
    check('id', 'No es un ID de Mongo valido').isMongoId(),
    check('id').custom(existeUsuarioPorId),
    validarCampos
],actualizarUsuario)

//Eliminar usuarios
router.delete('/:id', [
    validarJWT,
    //tieneRole('ADMIN_ROLE'),
    esAdminRole,
    check('id', 'No es un ID de Mongo valido').isMongoId(),
    check('id').custom(existeUsuarioPorId),
    validarCampos
],eliminarUsuario);

module.exports = router;