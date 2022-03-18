//Permite establecer variables de entorno
require('dotenv').config();

const express = require('express');

const Server = require('./models/server.model');
const server = new Server();


server.listen();

