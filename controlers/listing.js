const listing = require("../models/listing");


module.exports.index = async (req, res) => {
    const allListings = await listing.find({});
    res.render("listings/index.ejs", { allListings });
}
module.exports.rendernewform = (req, res) => {
    res.render("listings/new.ejs");
}
module.exports.showlisting = async (req, res) => {
    let { id } = req.params;
    const Listing = await listing.findById(id).populate("reviews").populate("owner");
    if (!Listing) {
        req.flash("error", "Listing you are requested for does not exist");
        res.redirect("/listings");
    }
    res.render("listings/show.ejs", { Listing });
}

module.exports.createnew = async (req, res, next) => {
    let url=req.file.path;
    let filename=req.file.filename;
    const newListing = new listing(req.body.listing);
    newListing.owner=req.user._id;
    newListing.image={url,filename};
    await newListing.save();
    req.flash("success", "New listing is created !");
    res.redirect("/listings");
    next();

}
module.exports.editlisting = async (req, res) => {
    let { id } = req.params;
    const Listing = await listing.findById(id);
    if (!Listing) {
        req.flash("error", "Listing you are requested for does not exist");
        res.redirect("/listings");
    }
    let originalurl=listing.image.url;
    originalurl=originalurl.replace("upload","/upload/h_250,w_250");
    res.render("listings/edit.ejs", { Listing ,originalurl});
}
module.exports.updatelisting = async (req, res) => {
   let List= await listing.findByIdAndUpdate(id, { ...req.body.listing });
   if (typeof req.file !== "undefined") {
    let url=req.file.path;
    let filename=req.file.filename;
    List.image={url,filename};
    await List.save();
   }
   
    req.flash("success", "Updated sucessfully");
    res.redirect(`/listings/${id}`);
}
module.exports.deletinglisting = async (req, res) => {
    let { id } = req.params;
    let deletedListing = await listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success", "Deleted successfully");
    res.redirect("/listings");
}