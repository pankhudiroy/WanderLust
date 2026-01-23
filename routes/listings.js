const express= require('express');
const router=express.Router({mergeParams: true});
const Listing= require("../models/listings.js");
const Review= require("../models/reviews.js");
const methodOverride= require("method-override");
const wrapAsync= require("../utils/wrapAsync.js");
const {isLoggedIn} = require("../middleware.js");
const {isOwner} = require("../middleware.js");
const {validateListing} = require("../middleware.js");
const user = require('../models/user.js');
const listingControllers= require("../controllers/listings.js");
const multer  = require('multer')

const {storage}= require("../cloudConfig.js");
const upload = multer({ storage});
// const upload = multer({ dest: 'uploads/' })


router.use(express.urlencoded({extended: true}));
router.use(methodOverride("_method"));

//index and create new listing route 
router.route("/")
.get( wrapAsync(listingControllers.listings))
.post(validateListing, upload.single('image'), wrapAsync(listingControllers.createNewListing));


//new route
router.get("/new", isLoggedIn, listingControllers.newListingForm);

//show , update and delete route
router.route("/:id")
.get( wrapAsync(listingControllers.showListing))
.put(isLoggedIn, isOwner, upload.single('image'), validateListing, wrapAsync(listingControllers.updateListing))
.delete( isLoggedIn,isOwner, wrapAsync(listingControllers.destroy));

//edit route
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listingControllers.editForm));



//index route
// router.get("/", wrapAsync(listingControllers.listings));

//show route
// router.get("/:id", wrapAsync(listingControllers.showListing));

//create route
// router.post("/", validateListing, wrapAsync(listingControllers.createNewListing));

//update route
// router.put("/:id", isLoggedIn, isOwner, validateListing, wrapAsync(listingControllers.updateListing));

//delete route
// router.delete("/:id", isLoggedIn,isOwner, wrapAsync(listingControllers.destroy));

module.exports= router;