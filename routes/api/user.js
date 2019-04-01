const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');

//User Model

const User = require('../../models/UserSchema');
const UserSession = require('../../models/UserSessionSchema');


// router.get('/home', (req, res) => {
//     res.render('index');
// }); // that slash represents the api/items

router.post('/register', register);
router.post('/signin', signin);
router.get('/verify', verify);
router.get('/logout', logout);

function register( req, res, next) {
    var { body } = req;
    var {
        firstname,
        lastname,
        password,
        mobile_number,
        city,
        state,
        country,
        pincode,
        description,
        createdAt,
        updatedAt,
        accountType
    } = body;

    let {
        email_id
    } = body;

    if(!firstname){
        return res.send({
            success: false,
            message: 'Error: First Name cannot be blank.' 
        });
    }
     
    if(!lastname){
        return res.send({
            success: false,
            message: 'Error: Last Name cannot be blank.' 
        });
    }
    
    if(!email_id){
        return res.send({
            success: false,
            message: 'Error: Email cannot be blank.' 
        });
    }
    
    if(!password){
        return res.send({
            success: false,
            message: 'Error: Password cannot be blank.' 
        });
    }
    
    if(!mobile_number){
        return res.send({
            success: false,
            message: 'Error: Mobile Number cannot be blank.' 
        });
    }
    
    if(!city){
        return res.send({
            success: false,
            message: 'Error: City cannot be blank.' 
        });
    }
    
    if(!state){
        return res.send({
            success: false,
            message: 'Error: State cannot be blank.' 
        });
    }
    
    if(!country){
        return res.send({
            success: false,
            message: 'Error: Country cannot be blank.' 
        });
    }

    email_id = email_id.toLowerCase();

    User.find({
        email_id: email_id
    }, (err, previousUsers) => {
        if(err) {
            return res.send({
                success: false,
                message: 'Error.' 
            });
        } else if (previousUsers.length > 0){
            return res.send({
                success: false,
                message: 'Email already exists.' 
            });
        }
    });

    //Save newUser
    const newUser = new User();
        newUser.email_id = email_id;
        newUser.firstname = firstname;
        newUser.lastname = lastname;
        newUser.mobile_number = mobile_number;
        // newUser.password = encryptPassword('password', {
        //     min: 8,
        //     max: 24,
        //     pattern: /^\w{8,24}$/,
        //     signature: 'signature',
        //     });
        newUser.password = newUser.generateHash(password);
        newUser.city = city;
        newUser.state = state;
        newUser.country = country;
        newUser.pincode = pincode;
        newUser.description = description;
        newUser.createdAt = createdAt;
        newUser.updatedAt = updatedAt;
        newUser.accountType = accountType;        
    

     newUser.save((err, user) => {
         if(err){
            return res.send({
                error: console.log(err),
                success: false,
                message: 'Server Error.' 
            });
         } else {
            return res.send({
                success: true,
                message: 'Signed up.' 
            });
         }
     });
} // that slash represents the api/user

function signin (req, res, next){
    const { body } = req;
    const {
        password
    } = body;
    let {
        email_id
    } = body;

    if(!email_id){
        return res.send({
            success: false,
            message: 'Error: Email cannot be blank.' 
        });
    }
    
    if(!password){
        return res.send({
            success: false,
            message: 'Error: Password cannot be blank.' 
        });
    }

    email_id =  email_id.toLowerCase();

    User.find({
        // "email_id": req.body.email_id, "password": req.body.password
        email_id : email_id
    }, (err, user) => {
            // console.log(err);
            // console.log(user);
            if (err){
                return res.send({
                    success: false,
                    message: "Error: Server Error"
                });
            }
            if (user.length != 1) {
                return res.send({
                    success: false,
                    message: "Error: Invalid"
                });
            }
            const users = user[0];  

            if(!users.validPassword(password)){
                return res.send({
                    success: false,
                    message: "Error: Invalid Password"
                });
            }
            //otherwise
            const userSession = new UserSession();
            userSession.user_id = users._id;
            
            userSession.save((err, doc) => {
                if (err){
                    return res.send({
                        success: false,
                        message: "Error: Server Error"
                    });
                }
                else{
                    return res.send({
                        success: true,
                        message: 'Valid sign in',
                        token: doc._id
                    }); 
                }    
            })
        }
    )
}

function verify (req, res, next){
    const { query } = req;
    const { token } = query;

    UserSession.find({
        _id : token,
        isDeleted : false
    }, (err , sessions) => {
        if(err){
            return res.send({
                success: false,
                message: "Error: server error"
            });
        }
        if(sessions.length != 1){
            return res.send({
                success: false,
                message: "Error: Invalid"
            });
        }
        else{
            return res.send({
                success: true,
                message: "verified"
            });
        }
    });
}
function logout (req, res, next){
    const { query } = req;
    const { token } = query;

    UserSession.findOneAndUpdate({
        _id: token,
        isDeleted: false
    }, {
        $set:  {
            isDeleted : true}
    }, null, (err , sessions) => {
        if(err){
            return res.send({
                success: false,
                message: "Error: server error"
            });
        }
        else{
            return res.send({
                success: true,
                message: "logged out"
            });
        }
    });
}

module.exports = router;