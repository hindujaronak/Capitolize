const express = require('express');
const router = express.Router();

//User Model

const User = require('../../models/User');

// @route GET api/items
// @ desc GET all items
// @access public

// router.get('/', (req, res) => {
//     Item.find()
//         .sort({ date: -1 }) //-1 for descending order 
//         .then(items => res.json(items))
// }); // that slash represents the api/items


// @route POST api/items
// @ desc POST all items
// @access public

router.post('/', (req, res) => {
    const newUser = new User({
        username: req.body.username,
        fname: req.body.fname,
        lname: req.body.lname,
        city: req.body.city,
        state: req.body.state,
        country: req.body.country,
        mobile_number: req.body.mobile_number,
        password: req.body.password
    });    

    newUser.save().then(user => res.json(user));
}); // that slash represents the api/items


// @route DELETE api/items:id
// @ desc DELETE an item
// @access public/

// router.delete('/:id', (req, res) => {
//     Item.findById(req.params.id)
//         .then(item => item.remove().then(() => res.json({success: true})))
//         .catch(err => res.status(404).json({success: false}));
// });

module.exports = router;