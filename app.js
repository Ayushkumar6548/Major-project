if (process.env.NODE_ENV != "production") {
    require('dotenv').config(); 
}
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const method_override = require("method-override");
const ejsmate = require("ejs-mate");
const Expresserr = require("./util/Expresserr.js");
const listinggrouter = require("./routes/listings.js");
const reviewrouter = require("./routes/review.js");
const session = require("express-session");
const flash=require("connect-flash");
const passport=require("passport");
const Localstrategy=require("passport-local");
const User=require("./models/user.js");
const userrouter=require("./routes/user.js");

app.engine("ejs", ejsmate);
app.use(method_override("_method"));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "/public")));



let mongo_url = "mongodb://127.0.0.1:27017/wanderlust";
main().then(() => { console.log("sucessfully connect to the Database"); })
    .catch(err => console.log(err));

async function main() {
    await mongoose.connect(mongo_url);
}
const port = 3000;
const sessionOptions = {
    secret: "mysupersecret",
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true
    },
};
app.get("/", (req, res) => {
    res.send("this is working properly")
})
app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new Localstrategy(User.authenticate()) );
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());




app.use((req,res,next)=>{
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.curruser = req.user;
    next();
})

// app.get("/demouser",async(req,res)=>{
//     let fakeuser= new User ({
//     email:"syska999@gmail.com",
//     username:"shilpa"
//     });
    
//     let registeruser=await User.register(fakeuser,"helloworld");
//     res.send(registeruser);
// })
app.use("/listings", listinggrouter);
app.use("/listings/:id/reviews", reviewrouter);
app.use("/",userrouter);

app.all("*", (req, res, next) => {
    next(new Expresserr(404, "page not found!"));
});
app.use((err, req, res, next) => {
    let { statusCode = 500, message = "somthing went wrong!" } = err;
    res.render("listings/err.ejs", { err });
});
app.listen(port, () => {
    console.log(`app is listining at port = '${port}'`);
});