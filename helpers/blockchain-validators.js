const sha256 = require("crypto-js/sha256")

const crearHash = (nombre,size, md5) => {
    const hash = sha256(`${nombre}${size}${md5}`.toString());
    return hash.toString();
}




module.exports = {
    crearHash
}