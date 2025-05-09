const { ref, string } = require("joi");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review=require("./Review.js");
const user = require("./user.js");
const listingSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    description: String,
    image: {
        url: String,
        filename:String,
    },
    price: Number,
    location: String,
    country: String,
    reviews: [{
        type: Schema.Types.ObjectId,
        ref: "Review",
    }],

    owner:{
    type: Schema.Types.ObjectId,
    ref:user,
    },

});

listingSchema.post("findOneAndDelete",async(listing)=>{
    if (listing) {
        await Review.deleteMany({_id:{$in:listing.reviews}});
    }
    
})
const listing = mongoose.model("listing", listingSchema);
module.exports = listing;