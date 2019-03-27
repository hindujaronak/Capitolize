const express = require('express');
const router = express.Router();

const encryptPassword = require('encrypt-password');

//User Model

const User = require('../../models/UserSchema');


// router.get('/home', (req, res) => {
//     res.render('index');
// }); // that slash represents the api/items



router.post('/register', (req, res) => {
    var { body } = req;
    var {
        firstname,
        lastname,
        email_id,
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
        newUser.password = password;
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
}); // that slash represents the api/user



router.post('/login', (req, res) => {

    // User.findOne({email_id : email_id, password: password}, function(err, user){
    //     if(err){
    //         console.log(err);
    //         return res.status(500).send({
    //             error: "User not Found"
    //         });
    //     }
    //     if(!err){
    //         return res.status(200).send({
    //             error: "Logged in successfully!"
    //         });
    //     }
    //     return res.status(404).send();
    // })
    
    User.findOne({
        "email_id": req.body.email_id, "password": req.body.password
    }, (err, user) => {
            if (err){
                return res.status('401').json({
                    error: "User not found"
                })
            }
            if (!err) {
                return res.status('200').send({
                    error: "Logged in successfully!"
                })
            }
        }
    )
})

module.exports = router;