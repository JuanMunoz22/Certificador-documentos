const {Router} = require('express');
const {check} = require('express-validator');
const { obtenerVerificados } = require('../controllers/verificados.controller');

const {validarJWT,
    validarCampos
} = require('../middlewares');

const router = Router();

router.get('/', obtenerVerificados);




module.exports = router;