var mongoose = require('mongoose');
const Schema = mongoose.Schema;
const FundraiserSchema= new Schema({

    title: {
        type : String,
        required : true,
        unique: true
    },
    description: {
        type : String,
        required : true
    },
    sector: {
        type: Number,
        required: true
    },
    uploaded_image: {
        type : String
    },   
    createdAt: Date,
    updatedAt: Date,
    accountType: Number
});
 
//Create schema

module.exports = mongoose.model('fundraiser', FundraiserSchema); 
