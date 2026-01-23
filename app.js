if(process.env.NODE_ENV != "production"){
  require('dotenv').config();
}

const express= require('express');
const app=express();
const mongoose= require("mongoose");
const path= require("path");
const methodOverride= require("method-override");
const ejsMate= require("ejs-mate");
const listingRouter= require("./routes/listings.js");
const reviewRouter= require("./routes/reviews.js");
const userRouter= require("./routes/users.js");
const session= require("express-session");
const MongoStore = require('connect-mongo');
const flash= require("connect-flash");
const passport=require("passport");
const localStrategy= require("passport-local");
const User=require("./models/user.js");


app.set("views", path.join (__dirname, "views"));
app.set("view engine", "ejs" );
app.use(express.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, "/public")));

main().then(()=> console.log("connected to db")).catch((err)=> console.log(err));

async function main(){
    await mongoose.connect(process.env.ATLASDB_URL);
}

app.use((err, req, res, next)=>{
    let {statusCode=500, message="some error occurred"}= err;
    res.status(statusCode).render("./listings/error.ejs", {message});
});


const store= MongoStore.create({
    mongoUrl: process.env.ATLASDB_URL,
    crypto: {
        secret: process.env.SECRET,
    },
    touchAfter: 24* 3600,
})

// store.on(err, ()=>{
//     console.log("Error in MONGO SESSION STORE", err);
// })
//express session
app.use(session({
    store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now()+ 3*24*60*60*1000,
        maxAge: 3*24*60*60*1000,
        httpOnly: true,
    }
}));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
    res.locals.msg= req.flash("success");
    res.locals.error= req.flash("error");
    res.locals.userInfo= req.user;
    next();
});



app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/", userRouter);

app.get("/", (req, res)=>{
    res.render("listings/root.ejs");
})

app.listen(8080, ()=>{
    console.log("server is listening to port 8080");
})