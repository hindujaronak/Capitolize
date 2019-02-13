const express = require('express'); //middleware
const router = express.Router(); //sendingAPI

//User Model

const Fundraiser = require('../../models/FundraiserSchema'); //schema add kiya

router.post('/addFundraiser',(req,res) => {


    const newFundraiser = new Fundraiser({
        title: req.body.title,
        description: req.body.description,
        category: req.body.category,
        city: req.body.city,
        state: req.body.state,
        country: req.body.country,
        pincode: req.body.pincode,
        createdAt: req.body.createdAt,
        updatedAt: req.body.updatedAt,
        accountType: req.body.accountType        
    });    

    newFundraiser.save().then(fundraiser => res.json(fundraiser));
}); // that slash represents the api/user
 
module.exports = router;