let listing=require("../models/listing");
const Review = require("../models/Review.js");
module.exports.createreview = async (req, res) => {
    let Listing = await listing.findById(req.params.id);
    let newreview = new Review(req.body.review);
    Listing.reviews.push(newreview);
    await newreview.save();
    await Listing.save();
    res.redirect(`/listings/${Listing._id}`);
}
module.exports.deletereview=async(req,res)=>{
    let {id,reviewid}=req.params;
    await listing.findByIdAndUpdate(id,{$pull:{reviews:reviewid}});
    await Review.findById(reviewid);
    res.redirect(`/listings/${id}`);
    }
