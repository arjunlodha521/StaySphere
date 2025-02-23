const Listing = require("../models/listing");
const Review = require("../models/review");
const mongoose = require("mongoose");

module.exports.createReview=  async(req,res)=>{
    let listing= await Listing.findById(req.params.id);
    let newReview= new Review(req.body.review);
    newReview.author = req.user._id;
    listing.reviews.push(newReview);
   await newReview.save();
   await listing.save();
   req.flash("success","New Review Created!");
  res.redirect(`/listings/${listing._id}`);
};

module.exports.destroyReview = async (req, res) => {
    let { id, reviewId } = req.params;
  
    if (!id || !reviewId) {
        req.flash("error", "Invalid request.");
        return res.redirect("/listings");
    }
  
    id = id.trim();
    reviewId = reviewId.trim();
  
    if (!mongoose.Types.ObjectId.isValid(id) || !mongoose.Types.ObjectId.isValid(reviewId)) {
        req.flash("error", "Invalid review ID.");
        return res.redirect(`/listings/${id}`);
    }
  
    // Remove review reference from listing
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
  
    // Delete review
    await Review.findByIdAndDelete(reviewId);
  
    req.flash("success", "Review Deleted!");
    res.redirect(`/listings/${id}`);
};