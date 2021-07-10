const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: {
        type: String,
        required: true
    }
});

userSchema.methods.addMessage = function(comment) {

};

module.exports = mongoose.model('user', userSchema);