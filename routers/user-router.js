// Imports
const express = require('express');
const bcrypt = require('bcryptjs');
const knex = require('knex');
const Users = require('../helper-models/users-model.js');

const router = express.Router();

router.post('/', (req, res) => {
    let { username, password } = req.body;

    const hash = bcrypt.hashSync(password, 8) // << 8 rounds slows down the brute force attacks

    Users.add({ username, password: hash })
        .then(saved => {
            res.status(200).json(saved)
        })
        .catch(err => {
            res.status(500).json({ message: "There was an error registering." })
        })
})

module.exports = router;
