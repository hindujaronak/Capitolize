const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//Create schema
const UserSessionSchema = new Schema({
    user_id: {
        type : String,
        default: -1

    },
    timestamp: {
        type : Date,
        default: Date.now()

    },
    isDeleted: {
        type : Boolean,
        default: false

    }
    
});

module.exports = UserSession = mongoose.model('userSession', UserSessionSchema); 