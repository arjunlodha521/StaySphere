// const mongoose = require("mongoose");
// const Schema = mongoose.Schema;
// const Review = require("./review.js");

// const listingSchema= new Schema({
//     title: {
//         type: String,
//         required: true,
//     },
//     description: String,
//     image: {
//         url: String,
//         filename: String,
//     },
//     price: Number,
//     location: String,
//     country: String,
// reviews: [
//     {
//     type: Schema.Types.ObjectId,
//     ref: "Review",
//     },
// ],
// owner: {
//             type: Schema.Types.ObjectId,
//             ref: "User",
//         },
// });

// const Listing = mongoose.model("Listing", listingSchema);
// module.exports= Listing;



// const mongoose = require('mongoose');
// const review = require('./review');
// const { types } = require('joi');

// const listingSchema = new mongoose.Schema({
//     title: String,
//     description: String,
//     image: { 
//         filename: String, 
//         url: String 
//     }, // Accept an object instead of a string
//     price: Number,
//     location: String,
//     country: String,
//     reviews: [
//         {
//         type: Schema.Types.ObjectId,
//         ref: "Review",
//         },
//     ],
// });

// const Listing = mongoose.model("Listing", listingSchema);
// module.exports = Listing;



const mongoose = require('mongoose');
const Schema = mongoose.Schema;  // ✅ Fix: Import Schema
const review = require('./review'); 

const Review = require("./review.js"); 

const listingSchema = new Schema({
    title: String,
    description: String,
    image: { 
        filename: String, 
        url: String 
    },
    price: Number,
    location: String,
    country: String,
    reviews: [
        {
            type: Schema.Types.ObjectId,  // ✅ Fix missing Schema reference
            ref: "Review",
        },
    ],
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
    // category: {
    //     typr: String,
    //     enum: ["mountains","arctic","farms","deserts"]
    // },
});

listingSchema.post("findOneAndDelete", async(listing) =>{
if (listing) {
    await Review.deleteMany({_id: {$in: listing.reviews}});
}
});
// ✅ Define model after schema
const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;
