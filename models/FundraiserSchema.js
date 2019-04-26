var mongoose = require('mongoose');
const Schema = mongoose.Schema;
const FundraiserSchema= new Schema({

    title: String,
    description: String,
    sector: Number,
    createdAt: Date,
    updatedAt: Date,
    amount: Number
});
 
//Create schema

module.exports = mongoose.model('fundraiser', FundraiserSchema); 
