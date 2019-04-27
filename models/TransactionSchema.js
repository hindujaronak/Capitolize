const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');
//Create schema
const TransactionSchema = new Schema({
    
    user_id: {
        type : String
    },
    fundraiser_id: {
        type : String,
        required : true
    },
    amount: {
        type : Number,
        required : true
    }
});


module.exports = mongoose.model('transaction', TransactionSchema); 