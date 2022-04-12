const blockchainValidators = require('./blockchain-validators');
const certificarPDF        = require('./pdf');
const date                 = require('./date');
const dbValidators         = require('./db-validators');
const generarJWT           = require('./generar-jwt');
const subirArchivo         = require('./subir-archivo');

module.exports = {
    ...date,
    ...dbValidators,
    ...certificarPDF,
    ...blockchainValidators,
    ...generarJWT,
    ...subirArchivo
}