const express= require('express');
const app=express();
const router=express.Router({mergeParams: true});
const wrapAsync= require("../utils/wrapAsync.js");
const {validateReview, isLoggedIn, isReviewAuthor}= require("../middleware.js");
router.use(express.urlencoded({extended: true}));


app.use((req,res,next)=>{
    res.locals.msg= req.flash("success");
    res.locals.error= req.flash("error");
    res.locals.userInfo= req.user;
    next();
});


let reviewControllers= require("../controllers/reviews.js");
//reviews (post route)
router.post("/", isLoggedIn, validateReview, wrapAsync(reviewControllers.createReview));

//delete review route
router.delete("/:reviewId",isLoggedIn, isReviewAuthor, wrapAsync(reviewControllers.deleteReview));

module.exports= router;