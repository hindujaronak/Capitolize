const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//Create schema
const UserSchema = new Schema({
    email_id: {
        type : String,
        required : true,
        unique: true
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

// UserSchema.methods.generateHash = function(password) {
//     return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
// };

// UserSchema.methods.validPassword = function(password){
//     return bcrypt.compareSync(password, this.password);
// };

module.exports = mongoose.model('user', UserSchema); 