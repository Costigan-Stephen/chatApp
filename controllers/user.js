const { validationResult } = require('express-validator');
const mongodb = require('mongodb');
const User = require('../models/user');
const Message = require('../models/message');
const fetch = require('node-fetch');
const fileHelper = require('../util/file');
const user = require('../models/user');
const bcrypt = require('bcryptjs');


exports.postNewComment = (req, res, next) => {
    const time = new Date();
    const userId = req.user._id
    const message = req.user.message;

    const Comment = new Comment({
        userId: userId,
        time: time,
        message: message
    });
    Comment.save()
        .then(result => {
            res.redirect('/feed');
        })
};