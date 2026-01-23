const User=require("../models/user.js");

module.exports.signupForm= (req,res)=>{
  res.render("./users/signup.ejs");
}

module.exports.signUp=  async (req,res)=>{
    try{
        let {username, email, password}= req.body;
        let newUser= new User({
            email: email,
            username: username,
        });
        let registeredUser= await User.register(newUser, password);
        // console.log(registeredUser);
        req.login(registeredUser, (err,next)=>{
        if(err){
          return next(err);
        }
        req.flash("success", "Welcome to WanderLust!");
        res.redirect("/listings");
    })
    }catch(e){
        req.flash("error", e.message);
        res.redirect("/signup");
    }
    
}

module.exports.loginForm=  (req,res)=>{
    res.render("./users/login.ejs");
}

module.exports.login= async (req,res)=>{
       req.flash("success", "Welcome back to WanderLust!");
       if(res.locals.redirectUrl){
         res.redirect(res.locals.redirectUrl);
       }else{
         res.redirect("/listings");
       }
    // res.redirect("/listings");
    
}

module.exports.logOut= (req,res,next)=>{
    req.logout((err)=>{
      if(err){
       return next(err);
      }
      req.flash("error", "You are logged out!");
      res.redirect("/listings"); 
    })
}