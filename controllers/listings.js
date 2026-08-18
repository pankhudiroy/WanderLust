const Listing= require("../models/listings.js");

// module.exports.listings= async (req,res)=>{
//     const allListings= await Listing.find();
//     res.render("./listings/index.ejs", {allListings});
// }
module.exports.listings = async (req, res) => {
    const { category } = req.query;

    let allListings;

    if (category) {
        allListings = await Listing.find({ category });
    } else {
        allListings = await Listing.find();
    }

    res.render("./listings/index.ejs", { allListings, category });
};

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
    let url = req.file.secure_url;
    let fileName = req.file.public_id;

    let {title, description, image, price, location, country, category}= req.body;
    if (!/^\d+$/.test(price)) {
        req.flash("error", "Price must contain numbers only!");
        return res.redirect("/listings/new");
    }
    const newListing= new Listing({title, description, image, price, location, country, category});
    newListing.owner= req.user._id;
    newListing.image= {url, fileName};
    req.flash("success", "New Listing added!");
    await newListing.save();
    res.redirect("/listings");
}

module.exports.editForm = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", "Listing you requested for does not exist!");
    return res.redirect("/listings");
  }

  let originalImage;
  if (listing.image && listing.image.url) {
    originalImage = listing.image.url.replace(
      "/upload",
      "/upload/ar_1.0,c_fill,h_150,w_250"
    );
  } else {
    originalImage = null; 
  }

  res.render("./listings/edit.ejs", { listing, originalImage });
};


module.exports.updateListing= async (req,res)=>{
    let {id}= req.params;
    let {title, description, price, location, country, category}= req.body;
    let listing=await Listing.findByIdAndUpdate(id, {title, description, price, location, country, category}, {new:true});

    if(typeof req.file !== "undefined"){
        let url = req.file.secure_url;
        let fileName = req.file.public_id;
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