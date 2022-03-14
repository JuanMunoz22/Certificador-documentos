

const esAdminRole = (req, res, next) => {

    if(!req.usuario){
        return res.status(500).json({
            msg: 'Se quiere verificar el rol, sin haber validado el token primero'
        });
    }
    
    const {rol, nombre} = req.usuario;

    if(rol !== 'ADMIN_ROLE'){
        return res.status(401).json({
            msg: `${nombre} no es administrador - No tiene permisos para realizar esta petición`
        });
    }
    next();
}

const tieneRole = ( ...roles) => {

    return (req, res, next) => {

        if(!req.usuario){
            return res.status(500).json({
                msg: 'Se quiere verificar el rol, sin haber validado el token primero'
            });
        }

        if(!roles.includes(req.usuario.rol)){
            return res.status(401).json({
                msg: `El servicio requiere uno de estos roles: ${roles}`
            })
        }

        next();
    }
}


module.exports = {
    esAdminRole,
    tieneRole
}