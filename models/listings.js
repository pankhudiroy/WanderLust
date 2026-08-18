const mongoose= require('mongoose');
const Review= require("./reviews.js");

// main().then(()=> console.log("connected to db")).catch((err)=> console.log(err));
// async function main(){
//     await mongoose.connect("mongodb://127.0.0.1:27017/Stayzy");
// }


const listSchema = new mongoose.Schema({
    title:{
        type: String,
        required: true
    }, 
    description: String,
    image:{
        // type: String,
        // default: "https://plus.unsplash.com/premium_photo-1678286771657-cf22aa97faf0?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        // set: (v) => 
        //     v===""? "https://plus.unsplash.com/premium_photo-1678286771657-cf22aa97faf0?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D": v,
        url: String,
        fileName: String,
    },
    price:{
        type: Number,
        default: 2300,
    },
    location:{
        type: String,
    },
    country:{
        type: String,
    },
    category: {
        type: String,
        enum: [
        'Trending',
        'Rooms',
        'Mountains',
        'Iconic Cities',
        'Castles',
        'Amazing Pools',
        'Camping',
        'Farms',
        'Arctic',
        'Domes',
        'Boats'
        ],
        default: 'Trending'
    },
    reviews:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Review",
    }],
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
});


//post mongoose middleware for cascading deletion
listSchema.post("findOneAndDelete", async(listing)=>{
    if(listing){
        await Review.deleteMany({_id: {$in: listing.reviews}});
    }
});


const Listing = new mongoose.model("Listing", listSchema);
module.exports= Listing;

