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

const type = upload.single('image');

const Fundraiser = require('../../models/FundraiserSchema');

router.post('/addFundraiser', type, (req,res) => {
    const newFundraiser = new Fundraiser({
        title: req.body.title,
        description: req.body.description,
        sector: req.body.sector,
        uploaded_image: req.file.path,
        createdAt: req.body.createdAt,
        updatedAt: req.body.updatedAt,
        accountType: req.body.accountType        
    });    
    newFundraiser.save()
    .then(fundraiser => console.log(res.json(fundraiser)));
}); // that slash represents the api/fundraiser

router.get('/allFundraisers', getAllFundraisers);

function getAllFundraisers(req, res, next){
    Fundraiser.find({}, 
        err => {
            if(err) {
                return res.send(
                    {
                        success: false,
                        message: 'Couldnt get fundrasier data'
                    }
                )
            }
        });

        return res.send({
            success: true,
            message:'Finally working'
        });
}
 
module.exports = router;