const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//Create schema
const UserSchema = new Schema({
    username: {
        type : String,
        required : true
    },
    fname: {
        type : String,
        required : true
    },
    lname: {
        type : String,
        required : true
    },
    city: {
        type : String,
        required : true
    },
    state: {
        type : String,
        required : true
    },
    country: {
        type : String,
        required : true
    },
    mobile_number: {
        type : Number,
        required : true
    },
    password: {
        type : String,
        required : true
    },
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports = User = mongoose.model('user', UserSchema); 