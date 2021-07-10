const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const messageSchema = new Schema({
    from: {
        type: String,
        required: true
    },
    time: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('message', messageSchema);