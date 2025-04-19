const Expresserr = require("./util/Expresserr.js");
const { listingSchema } = require("./schemaval.js");
let listing=require("./models/listing.js");

module.exports.isLoggedIn=(req,res,next)=>{
    req.session.redirectUrl=req.originalUrl;
    if (!req.isAuthenticated()) {
        req.flash("error","you must be logged in to create new listing");
       return res.redirect("/login");
       
    }
    next();
}
module.exports.saveredirectUrl=(req,res,next)=>{
    if (req.session.redirectUrl) {
        res.locals.redirectUrl=req.session.redirectUrl;
        
    }
    next(); 
    
}
module.exports.isowner = async (req,res,next)=>{
    let  Listing =await listing.findById(req.params.id);
    // if(!curruser && Listing.owner._id.equals(res.locals.curruser._id)) {
    //     req.flash("error","you dont have permission to edit this");
    //    return  res.redirect(`/listings/${id}`);
    // }
  next();
}
module.exports.validatelistings = (req, res, next) => {
    let { error } = listingSchema.validate(req.body);
    if (error) {
        let errmsg = error.details.map((el) => el.message).join(",");
        throw new Expresserr(400, errmsg);
    } else {
        next();
    }
}