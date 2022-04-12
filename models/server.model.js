const express = require('express')
const cors = require('cors');
const fileUpload = require('express-fileupload');

const dbConnection = require('../database/config');

class Server{

    constructor(){
        //Crear en servidor propiedad de express
        this.app  = express();
        this.port = process.env.PORT;

        this.paths = {
            auth:     '/api/auth',
            document: '/api/document',
            usuarios: '/api/usuarios',
            uploads:      '/api/uploads'
        }

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

        //Carga de archivos
        this.app.use(fileUpload({
            useTempFiles: true,
            tempFileDir : '/tmp/',
            createParentPath: true
        }));
    }

    //Rutas
    routes(){
        this.app.use(this.paths.auth, require('../routes/auth.routes'));
        this.app.use(this.paths.usuarios, require('../routes/user.routes'));
        this.app.use(this.paths.document, require('../routes/document.routes'));
        this.app.use(this.paths.uploads, require('../routes/upload.routes'))
    }

    //Escuchar
    listen(){
        
        this.app.listen(this.port, () => {
            console.log('Servidor corriendo en puerto:', this.port);
        });
    }
}


module.exports = Server;