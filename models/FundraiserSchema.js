const mongoose = require('mongoose');
const Schema = mongoose.Schema; //new schema

//Create schema
const FundraiserSchema = new Schema({
    title: {
        type : String,
        required : true,
        unique: true
    },
    description: {
        type : String,
        required : true
    },
    category: {
        type: String,
        required: true
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
    createdAt: Date,
    updatedAt: Date,
    accountType: Number
});

module.exports = mongoose.model('Fundraiser',FundraiserSchema); 