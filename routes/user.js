const express = require("express");
const wrapsync = require("../util/wrapsync");
const passport = require("passport");
const { saveredirectUrl } = require("../middleware.js");
const router = express.Router();
const Usercontroller = require("../controlers/user.js");

router
.route("/signup")
.get(Usercontroller.rendersignup)
.post( wrapsync(Usercontroller.signup));

router
.route("/login")
.get( Usercontroller.loginpage)
.post( saveredirectUrl, passport.authenticate("local", {failureRedirect: "/login", failureFlash: true,}),Usercontroller.loginafter);
      
router.get("/logout", Usercontroller.logout);
module.exports = router;