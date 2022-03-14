//Permite establecer variables de entorno
require('dotenv').config();


const Server = require('./models/server.model');

const server = new Server();

server.listen();
