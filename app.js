const express = require("express");
const app = express();
const mongoose = require("mongoose");
const listing = require("./models/listing.js");
const path = require("path");
const method_override = require("method-override");
app.use(method_override("_method"));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));

let mongo_url = "mongodb://127.0.0.1:27017/wanderlust";
main().then(() => { console.log("sucessfully connect to the Database"); })
    .catch(err => console.log(err));

async function main() {
    await mongoose.connect(mongo_url);
}
const port = 3000;
app.get("/", (req, res) => {
    res.send("this is working properly");
});

//UPDATE ROUTE
//Update Route
app.put("/listings/:id", async (req, res) => {
    let { id } = req.params;
    await listing.findByIdAndUpdate(id, { ...req.body.listing });
    res.redirect(`/listings/${id}`);
});
//Create Route
app.post("/listings", async (req, res) => {
    const newListing = new listing(req.body.listing);
    await newListing.save();
    res.redirect("/listings");
});
//index route 
app.get("/listings", async (req, res) => {
    const allListings = await listing.find({});
    res.render("listings/index.ejs", { allListings });
});
//show route 
app.get("/listings/:id", async (req, res) => {
    let { id } = req.params;
    const Listing = await listing.findById(id);
    res.render("listings/show.ejs", { Listing });
});
//delete route
app.delete("/listings/:id", async (req, res) => {
    let { id } = req.params;
    let deletedListing = await listing.findByIdAndDelete(id);
    console.log(deletedListing);
    res.redirect("/listings");
});
//new route
app.get("/listings/new", (req, res) => {
    res.render("listings/new.ejs");
});

// app.get("/testListing", async (req, res) => {
//     let sampleListing = new listing({
//         title: "My New Villa",
//         description: "By the beach",
//         price: 1200,
//         location: "Calangute, Goa",
//         country: "India",
//     });

//     await sampleListing.save();
//     console.log("sample was saved");
//     res.send("successful testing");
// });
//edit route
app.get("/listings/:id/edit", async (req, res) => {
    let { id } = req.params;
    const Listing = await listing.findById(id);
    res.render("listings/edit.ejs", { Listing });
});
app.listen(port, () => {
    console.log(`app is listining at port = '${port}'`);
})