const express = require("express");
const router=express.Router();
const wrapsync = require("../util/wrapsync.js");
const {isLoggedIn,isowner,validatelistings}=require("../middleware.js");
const listnigcontroller=require("../controlers/listing.js");
const multer  = require('multer');
const {storage}=require("../cloudConfig.js");
const upload = multer({ storage});

router
.route("/")
.get(wrapsync(listnigcontroller.index))
.post(isLoggedIn,upload.single("listing[image]"),validatelistings,wrapsync(listnigcontroller.createnew));

//NEW ROUTE
router.get("/new", isLoggedIn,listnigcontroller.rendernewform);

router
.route("/:id")
.get(wrapsync(listnigcontroller.showlisting))
.put(isLoggedIn,isowner,upload.single("listing[image]"), validatelistings, wrapsync(listnigcontroller.updatelisting))
.delete(isLoggedIn,isowner,wrapsync(listnigcontroller.deletinglisting));

 router.get("/:id/edit",isLoggedIn,isowner,wrapsync(listnigcontroller.editlisting));



module.exports=router

