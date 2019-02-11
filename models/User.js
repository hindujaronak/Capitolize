const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//Create schema
const UserSchema = new Schema({
    email_id: {
        type : String,
        required : true
    },
    firstname: {
        type : String,
        required : true
    },
    lastname: {
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
    pincode: {
        type : Number,
        required : true
    },
    description: {
        type : String,
        required : true
    },
    createdAt: Date,
    updatedAt: Date,
    accountType: Number
});

module.exports = User = mongoose.model('user', UserSchema); 