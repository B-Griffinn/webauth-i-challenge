// Imports
const express = require('express');
const helmet = require('helmet');

// routes live here

const server = express();

server.use(helmet());
server.use(express.json());

// use routers if necessary

module.exports = server;
