// Imports
const express = require('express');
const bcrypt = require('bcryptjs');
const knex = require('knex');
const Users = require('../helper-models/users-model.js');

const router = express.Router();

router.post('/register', (req, res) => {
    let { username, password } = req.body;

    const hash = bcrypt.hashSync(password, 8) // << 8 rounds slows down the brute force attacks

    Users.add({ username, password: hash })
        .then(saved => {
            res.status(200).json(saved)
        })
        .catch(err => {
            res.status(500).json({ message: "There was an error registering." })
        })
}); 

router.post('/login', protected, (req, res) => {

    let { username, password } = req.body;

    Users.findBy({ username })
        .first()
        .then(user => {
            if(user && bcrypt.compareSync(password, user.password)) {
                res.status(200).json({ message: `Welcome ${user.username}!` })
            } else {
                res.status(401).json({ message: 'Invalid Credentials!' })
            }
        })
        .catch(err => {
            res.status(500).json({ message: "There was an error logging in!" })
        })
});


router.get('/users', protected, (req, res) => {
    Users.find()
      .then(users => {
        res.status(200).json(users);
      })
      .catch(err => res.send(err));
  });
  

// Middleware protection
function protected(req, res, next) {

    let { username, password } = req.headers;

    if(username && password) {
        Users.findBy({ username })
        .first()
        .then(user => {
            if(user && bcrypt.compareSync(password, user.password)) {
                next();
            } else {
                res.status(401).json({ message: "Invalid Credentials" });
            }
        })
        .catch(err => {
            res.status(500).json(err)
        })
    } else {
        res.status(400).json({ message: 'Please provide valid credentials' })
    }
};

module.exports = router;
