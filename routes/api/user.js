const express = require('express');
const router = express.Router();

//User Model

const User = require('../../models/User');


// router.get('/home', (req, res) => {
//     res.render('index');
// }); // that slash represents the api/items



router.post('/register', (req, res) => {
    const newUser = new User({
        email_id: req.body.username,
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        mobile_number: req.body.mobile_number,
        password: req.body.password,
        city: req.body.city,
        state: req.body.state,
        country: req.body.country,
        pincode: req.body.pincode,
        description: req.body.description        
    });    

    newUser.save().then(user => res.json(user));
}); // that slash represents the api/user


// @route api/user:id
// @access public/

router.post('/login', (req, res) => {
    var mobile_number = req.body.mobile_number;
    var password = req.body.password;

    User.findOne({mobile_number : mobile_number, password: password}, function(err, user){
        if(err){
            console.log(err);
            return res.status(500).send();
        }
        if(!err){
            return res.status(200).send();
        }
        return res.status(404).send();

    })
        
});

module.exports = router;