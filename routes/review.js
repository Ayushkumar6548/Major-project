const express = require("express");
const router=express.Router({mergeParams:true});
const wrapsync = require("../util/wrapsync.js");
const Expresserr = require("../util/Expresserr.js");
let reviewcontroller=require("../controlers/review.js");
const {reviewservervalidation} = require("../schemaval.js");

const validatereview = (req, res, next) => {
    let { error } = reviewservervalidation.validate(req.body);
    if (error) {
        let errmsg = error.details.map((el) => el.message).join(",");
        throw new Expresserr(400, errmsg);
    } else {
        next();
    }
}

// show review post
router.post("/",validatereview, wrapsync(reviewcontroller.createreview));

//Delete review route
router.post("/:reviewid",wrapsync(reviewcontroller.deletereview));

module.exports=router;