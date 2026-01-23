const Listing= require("../models/listings.js");

module.exports.listings= async (req,res)=>{
    const allListings= await Listing.find();
    res.render("./listings/index.ejs", {allListings});
}

module.exports.newListingForm= (req,res)=>{
    // console.log(user);
    res.render("./listings/new.ejs");
    
}

module.exports.showListing= async (req,res)=>{
   let {id}= req.params;
   const listing= await Listing.findById(id).populate({path: "reviews", populate: { path: "author" }}).populate("owner");
   if(!listing){
    req.flash("error", "Listing you requested for does not exist!");
    res.redirect("/listings");
   }
   res.render("./listings/show.ejs", {listing});
}

module.exports.createNewListing= async (req,res)=>{
    let url= req.file.path;
    let fileName= req.file.filename;

    let {title, description, price, location, country}= req.body;
    const newListing= new Listing({title, description, price, location, country});
    newListing.owner= req.user._id;
    newListing.image= {url, fileName};
    req.flash("success", "New Listing added!");
    await newListing.save();
    res.redirect("/listings");
}

module.exports.editForm= async (req,res)=>{
    let {id}= req.params;
    const listing= await Listing.findById(id);
    if(!listing){
        req.flash("error", "Listing you requested for does not exist!");
        res.redirect("/listings");
    }

    let originalImage= listing.image.url;
    originalImage= originalImage.replace("/upload", "/upload/ar_1.0,c_fill,h_150,w_250");
    res.render("./listings/edit.ejs", {listing, originalImage});
}

module.exports.updateListing= async (req,res)=>{
    let {id}= req.params;
    let {title, description, price, location, country}= req.body;
    let listing=await Listing.findByIdAndUpdate(id, {title, description, price, location, country}, {new:true});

    if(typeof req.file !== "undefined"){
        let url= req.file.path;
        let fileName= req.file.filename;
        listing.image= {url, fileName};
        await listing.save();
    }

    req.flash("success", "Listing updated!");
    res.redirect(`/listings/${id}`);
}

module.exports.destroy= async (req,res)=>{
    let {id}= req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing Deleted!");
    res.redirect("/listings");
}