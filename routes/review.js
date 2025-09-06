const express = require("express");
const router = express.Router({mergeParams: true});



const wrapAsync = require("../utils/wrapAsync.js")
const {isLoggedIn, validateReview, isAuthor} = require("../middleware.js");

const reviewController = require("../controllers/Reviews.js");

// post review route
router.post("/",isLoggedIn, validateReview, wrapAsync(reviewController.postReview));
// delete review route
router.delete("/:reviewId",isLoggedIn,isAuthor, wrapAsync(reviewController.destroyReview));

module.exports = router;