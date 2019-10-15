// Imports
const express = require('express');
const helmet = require('helmet');
const sessions = require('express-session'); // << pt 2
// const KnexSessionStore = require('connect-session-knex')(sessions); // <<<< for storing sessions in db

// routes live here
const userRouter = require('../routers/user-router.js');
const authRouter = require('../auth/auth-router.js');

// Config for sessions
const config = require('../database/dbConfig.js');

const server = express();

// Session Configuration
const sessionConfiguration = {
    name: 'bensCookie', // default would be 'sid' and we do not want this
    secret: 'this secret is safe with me.....',
    cookie: {
        httpOnly: true, // JS cannot access the cookies
        maxAge: 1000 * 60 * 60, // expiration time in miliseconds = 1hr
        secure: false, // use cookie over HTTP only. Should be true in production
    },
    resave: false,
    saveUninitialized: true, // read about GDPR compliance about cookies
}

// global middleware
server.use(sessions(sessionConfiguration));
server.use(helmet());
server.use(express.json());

// use routers if necessary
server.use('/api', userRouter);
server.use('/api/auth', authRouter);

module.exports = server;
