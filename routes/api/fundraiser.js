const express = require('express'); //middleware
const router = express.Router(); //sendingAPI
const multer = require('multer');
const storage = multer.diskStorage({
    destination: function(req , file, cb){
        cb(null, './uploads/');
    },
    filename: function(req, file, cb){
        cb(null, file.originalname);
    }
});
const upload = multer({
    storage : storage,
    dest: 'uploads/' ,
    limits : {
       fileSize : 1024 * 1024 * 10 
    }
});
//User Model

const Fundraiser = require('../../models/FundraiserSchema'); //schema add kiya

router.post('/addFundraiser', upload.single('image'), (req,res) => {
    // console.log(req.file);
    const newFundraiser = new Fundraiser({
        title: req.body.title,
        description: req.body.description,
        sector: req.body.sector,
        uploaded_image: req.file.path,
        createdAt: req.body.createdAt,
        updatedAt: req.body.updatedAt,
        accountType: req.body.accountType        
    });    

    newFundraiser.save().then(fundraiser => res.json(fundraiser));
}); // that slash represents the api/user
 
module.exports = router;