const Listing = require("./models/listing");
const Review = require("./models/review");
const ExpressError= require("./utils/ExpressError.js");
const {listingSchema, reviewSchema} = require("./schema.js");
const mongoose = require("mongoose");

module.exports.isLoggedIn = (req,res, next)=>{
    if(!req.isAuthenticated()){
        req.session.redirectUrl= req.originalUrl;
        req.flash("error","you must be logged in to create listing!");
         return res.redirect("/login");
     }
     next();
};
module.exports.saveRedirectUrl =(req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
};
// module.exports.isOwner = async(req,res,next)=>{
//     let {id}= req.params;
// let listing = await Listing.findById(id);
// if(!listing.owner._id.equals(res.locals.currUser._id)){
//     req.flash("success","You are not the owner of this listing!");
//     return res.redirect(`/listings/${id}`);
// }
// next();
// };

module.exports.isOwner = async (req, res, next) => {
    let { id } = req.params;
    if (!id) {
        req.flash("error", "Invalid listing ID.");
        return res.redirect("/listings");
    }

    id = id.trim(); // Trim any unwanted spaces

    if (!mongoose.Types.ObjectId.isValid(id)) {
        req.flash("error", "Invalid listing ID format.");
        return res.redirect("/listings");
    }

    let listing = await Listing.findById(id);
    if (!listing) {
        req.flash("error", "Listing not found!");
        return res.redirect("/listings");
    }

    if (!res.locals.currUser || !listing.owner.equals(res.locals.currUser._id)) {
        req.flash("error", "You are not the owner of this listing!");
        return res.redirect(`/listings/${id}`);
    }

    next();
};

module.exports.isReviewAuthor = async (req, res, next) => {
    let { id, reviewId } = req.params;
    
    if (!id || !reviewId) {
        req.flash("error", "Invalid review ID.");
        return res.redirect("/listings");
    }

    id = id.trim();
    reviewId = reviewId.trim();

    if (!mongoose.Types.ObjectId.isValid(id) || !mongoose.Types.ObjectId.isValid(reviewId)) {
        req.flash("error", "Invalid review ID format.");
        return res.redirect(`/listings/${id}`);
    }

    let review = await Review.findById(reviewId);
    if (!review) {
        req.flash("error", "Review not found!");
        return res.redirect(`/listings/${id}`);
    }

    if (!res.locals.currUser || !review.author.equals(res.locals.currUser._id)) {
        req.flash("error", "You are not the owner of this review!");
        return res.redirect(`/listings/${id}`);
    }

    next();
};


module.exports.validateListing= (req,res,next)=>{
    let {error}= listingSchema.validate(req.body);
    if(error){
        let errMsg= error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400, errMsg);
    }else{
        next();
    }
};

module.exports.validateReview =(req,res,next)=>{
    let {error}= reviewSchema.validate(req.body);
    if(error){
        let errMsg= error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400, errMsg);
    }else{
        next();
    }
};

// module.exports.isReviewAuthor = async(req,res,next)=>{
// let {id,reviewId}= req.params;
// let review = await Review.findById(reviewId);
// if(!review.author.equals(res.locals.currUser._id)){
//     req.flash("success","You are not the owner of this review!");
//     return res.redirect(`/listings/${id}`);
// }
// next();

// };
