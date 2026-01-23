const express= require('express');
const router=express.Router();
const wrapAsync= require("../utils/wrapAsync.js");
const passport= require("passport");
const {saveRedirectUrl, isLoggedIn}= require("../middleware.js");

router.use(express.urlencoded({extended: true}));

let userControllers= require("../controllers/users.js");

//signup form render and signup
router.route("/signup")
.get( userControllers.signupForm)
.post( wrapAsync(userControllers.signUp));

//login form render and login
router.route("/login")
.get( userControllers.loginForm)
.post( saveRedirectUrl, passport.authenticate('local', { failureRedirect: '/login' , failureFlash: true}), wrapAsync(userControllers.login));

//logout
router.get("/logout", userControllers.logOut);


//signup form
// router.get("/signup", userControllers.signupForm);
//signup
// router.post("/signup", wrapAsync(userControllers.signUp));

//login form
// router.get("/login", userControllers.loginForm);
//login
// router.post("/login", saveRedirectUrl, passport.authenticate('local', { failureRedirect: '/login' , failureFlash: true}), wrapAsync(userControllers.login));


module.exports= router;