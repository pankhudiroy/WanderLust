const Listing= require("../models/listings.js");
const Review= require("../models/reviews.js");

module.exports.createReview= async(req,res)=>{
    let {id}= req.params;
    let listing= await Listing.findById(id);
    let {rating, comment}= req.body;
    if(rating == 0){
        rating = 1;
    }
    const newReview= new Review({
        rating: rating,
        comment: comment,
        author: req.user._id,
    });
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();

    req.flash("success", "New Review added!");
    res.redirect(`/listings/${id}`);
    // console.log("current user id",res.locals.userInfo._id);
    // console.log(listing);
    // for(let review of listing.reviews){
    //  console.log(review);
    //  console.log(review.author.username);
    // }
    // console.log(newReview.author);
    // console.log(listing);
}

module.exports.deleteReview= async(req,res)=>{
   let {id, reviewId}= req.params;
   await Listing.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
   let result= await Review.findByIdAndDelete(reviewId);
   req.flash("success", "Review Deleted!");
   res.redirect(`/listings/${id}`);
}