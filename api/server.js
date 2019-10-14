// Imports
const express = require('express');
const helmet = require('helmet');

// routes live here
const userRouter = require('../routers/user-router.js');

const server = express();

server.use(helmet());
server.use(express.json());

// use routers if necessary
server.use('/api/register', userRouter);

module.exports = server;
