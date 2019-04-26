const express = require('express'); //middleware
const router = express.Router(); //sendingAPI
const multer = require('multer');

const Transaction = require('../../models/TransactionSchema');
const Fundraiser = require('../../models/FundraiserSchema');


router.post('/addTransaction', addTransaction);


function addTransaction (req,res, next) {
    const newTransaction = new Transaction({
        user_id: req.body.user_id,
        fundraiser_id: req.body.fundraiser_id,
        amount: req.body.amount
    });
    // const updateFundraiser = new Fundraiser()
    // updateFundraiser.findOneAndUpdate({_id:req.params.id}, req.body.amount, function (err, amount) {
    //     res.send(amount);
    // })
        
    newTransaction.save((err, transaction) => {
        if(err){
            return res.send({
                error: console.log(err),
                success: false,
                message: 'Server Error.' 
            });
         } else {
                
                return res.send({
                    success: true,
                    message: 'Added Transaction.'
                });
            }

        })

    // .then(fundraiser => console.log(res.json(fundraiser)));
};

module.exports = router;