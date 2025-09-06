const express = require("express");
const router = express.Router({mergeParams: true});

const wrapAsync = require("../utils/wrapAsync.js")
const {isLoggedIn, isOwner, validateListing} = require("../middleware.js");

const listingController = require("../controllers/Listings.js");

const multer  = require("multer");
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });

// index, add
router.route("/")
    .get(wrapAsync(listingController.index))
    .post(isLoggedIn, upload.single("listing[image]"), wrapAsync(listingController.addListing));

// add route (CREATE)
router.get("/new",isLoggedIn, validateListing, listingController.renderAddForm);

// show, edit, delete
router.route("/:id")
    .get(wrapAsync(listingController.showListing))
    .put(isLoggedIn, isOwner, upload.single("listing[image]"), wrapAsync(listingController.editListing))
    .delete(isLoggedIn,isOwner, wrapAsync(listingController.destroyListing));

// edit route (UPDATE)
router.get("/:id/edit",isLoggedIn,isOwner, wrapAsync(listingController.renderEditForm));

module.exports = router;