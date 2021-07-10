const Message = require('../model/message');
const express = require('express')
const router = express.Router()

const users = require('../model/user');
const messages = require('../model/message');
// const users = ['admin'] // Dummy array for users

router.get('/', (req, res, next) => {
    res.render('pages/pr12-login', {
        title: 'Prove Activity 12',
        path: '/',
        login: true
    });
});

router.get('/fetch', (req, res, next) => {
    messages.find()
        .then(msg => {
            // console.log(msg);
            res.status(200);
            res.json(msg);
        })
        .catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });
});

router.post('/login', (req, res, next) => {
    const { username } = req.body;

    if (!username || username.trim() === '')
        return res.status(400).send({ error: '<span class="error notice">Username cannot be empty!</span>' });

    users.findOne({
            username: username
        })
        .then(user => {
            if (user) {
                return res.status(409).send({ error: '<span class="error notice">Username is taken!</span>' });;
            }
            const newUser = new users({
                username: username.trim(),
            });
            newUser.save();
            res.status(200).send({ username: username.trim() });
            res.redirect('/chat/' + username);
        })
        .catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });

});

router.get('/chat/:username', (req, res, next) => {
    const username = req.params.username;
    console.log(username);
    res.render('pages/pr12-chat', {
        title: 'Prove Assignment 12',
        path: '/chat',
        user: username,
        login: false
    });
});

router.get('/chat', (req, res, next) => {
    res.render('pages/pr12-chat', {
        title: 'Prove Assignment 12',
        path: '/chat',
        user: '',
        login: false
    });
});

router.post('/chat', (req, res, next) => {
    const from = req.body.from;
    const message = req.body.message;
    const time = req.body.time;

    const newComment = new messages({
        from: from,
        message: message.trim(),
        time: time,
    });
    newComment.save();
});

module.exports = router