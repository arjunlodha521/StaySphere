const express = require("express");
const router = express.Router({mergeParams: true});
const wrapAsync= require("../utils/wrapAsync.js");
const ExpressError= require("../utils/ExpressError.js");
const Review = require("../models/review.js");
const Listing = require("../models/listing.js");
const mongoose = require("mongoose");
const {validateReview, isLoggedIn, isReviewAuthor} = require("../middleware.js");

const reviewController = require("../controllers/reviews.js");
const review = require("../models/review.js");

//post review routes
router.post("/",isLoggedIn ,validateReview, wrapAsync(reviewController.createReview));

//delete review router
// router.delete(
//     "/:reviewId", isLoggedIn,isReviewAuthor,
//     wrapAsync(async (req, res) => {
//       let { id, reviewId } = req.params;
  
//       console.log("Received ID:", `"${id}"`, `"${reviewId}"`); // Log received IDs
  
//       // Trim extra spaces (sometimes IDs might have leading/trailing spaces)
//       id = id.trim();
//       reviewId = reviewId.trim();
  
//       // Validate ObjectId format
//       if (!mongoose.Types.ObjectId.isValid(id) || !mongoose.Types.ObjectId.isValid(reviewId)) {
//         console.error("Invalid ID format:", id, reviewId);
//         return res.status(400).send("Invalid ID format");
//       }
  
//       const objectId = new mongoose.Types.ObjectId(id);
//       const reviewObjectId = new mongoose.Types.ObjectId(reviewId);
  
//       // Remove review reference from listing
//       await Listing.findByIdAndUpdate(objectId, { $pull: { reviews: reviewObjectId } });
  
//       // Delete review
//       await Review.findByIdAndDelete(reviewObjectId);
  
//       req.flash("success","Review Deleted!");
//       res.redirect(`/listings/${id}`);
//     })
//   );
router.delete("/:reviewId", isLoggedIn, isReviewAuthor, wrapAsync(reviewController.destroyReview));

module.exports= router;