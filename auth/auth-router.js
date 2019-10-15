const router = require('express').Router();
const bcrypt = require('bcryptjs');

const Users = require('../helper-models/users-model.js');

// for endpoints beginning with /api/auth

// POST to register
router.post('/register', (req, res) => {
    let user = req.body;

    const hash = bcrypt.hashSync(user.password, 8);

    user.password = hash;

    Users.add(user)
        .then(saved => {
            res.status(200).json(saved)
        })
        .catch(err => {
            res.status(500).json({ message: "There was an error registering." })
        });
});



// POST to login & create a new session
router.post('/login', (req, res) => {
    // deconstruct the username and PW
    let { username, password } = req.body;

    // Find that username in the system
    // check if the user is valid
    // if valid, return 'Logged in' + cookie that contains the user id
    // respond 'you shall not pass if the user does not exist

    Users.findBy({ username })
        .first()
        .then(user => {
            if(user && bcrypt.compareSync(password, user.password)) {

                req.session.username = user.username; // creates key/val pair for the session (lasts 1hr)
                console.log('Session from .then() ', req.session);
                res.status(200).json({ message: `Logged in as ${user.username}!` })
            } else {
                res.status(401).json({ messag: "You shall not pass." })
            }
        })
        .catch(err => {
            res.status(500).json({ message: 'There was an issue logging in. Please try again later.' })
        });
});



// GET to logout
router.get('/logout', (req, res) => {
    if(req.session) {
        req.session.destroy(err => {
            res.status(200).json({ message: "You have logged out!" })
        })
    } else {
        res.status(200).json({ message: "You were not logged out to begin with." })
    }
});


// ALWAYS EXPORT
module.exports = router;
