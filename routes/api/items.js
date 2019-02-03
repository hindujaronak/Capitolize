const express = require('express');
const router = express.Router();

//Item Model

const Item = require('../../models/Item');

// @route GET api/items
// @ desc GET all items
// @access public

router.get('/', (req, res) => {
    Item.find()
        .sort({ date: -1 }) //-1 for descending order 
        .then(items => res.json(items))
}); // that slash represents the api/items


// @route POST api/items
// @ desc POST all items
// @access public

router.post('/', (req, res) => {
    const newItem = new Item({
        name: req.body.name
    });    

    newItem.save().then(item => res.json(item));
}); // that slash represents the api/items


// @route DELETE api/items:id
// @ desc DELETE an item
// @access public

router.delete('/:id', (req, res) => {
    Item.findById(req.params.id)
        .then(item => item.remove().then(() => res.json({success: true})))
        .catch(err => res.status(404).json({success: false}));
});

module.exports = router;