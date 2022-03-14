const express = require('express')
const cors = require('cors');

const dbConnection = require('../database/config');

class Server{

    constructor(){
        //Crear en servidor propiedad de express
        this.app = express();
        this.port = process.env.PORT;
        this.usuariosPath = '/api/usuarios';

        //Coneccion a base de datos
        this.conectarDB();

        //Middlewares
        this.middlewares();

        //Rutas de la aplicacion
        this.routes();
    }

    async conectarDB(){
        await dbConnection();
    }

    //Middlewares
    middlewares(){
        //CORS
        this.app.use(cors());

        //Parseo y lectura del body
        this.app.use(express.json());

        //Directorio publico
        this.app.use(express.static('public'));
    }

    //Rutas
    routes(){
        this.app.use(this.usuariosPath, require('../routes/user.routes'));
    }

    //Escuchar
    listen(){
        
        this.app.listen(this.port, () => {
            console.log('Servidor corriendo en puerto:', this.port);
        });
    }
}


module.exports = Server;