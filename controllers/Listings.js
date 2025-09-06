const Listing = require("../models/listings");


module.exports.index = async (req, res) => {
    let allList = await Listing.find({});
    res.render("listings/index.ejs", {allList});
}

module.exports.renderAddForm = (req, res) => {
    res.render("listings/add.ejs");
}

module.exports.showListing = async (req, res) => {
    let{id} = req.params;
    const list = await Listing.findById(id).populate({path: "reviews", populate: {path: "author"}}).populate("owner");
    if(!list){
        req.flash("error", "Listing you requested is not valid !!");
        return res.redirect("/listings");
    }
    res.render("listings/show.ejs", {list});
}

module.exports.addListing = async (req, res, next) => {


    let url = req.file.path;
    let filename = req.file.filename;
    let{title, description, image, price, location, country} = req.body;


    const API_KEY = process.env.MAP_TOKEN;

    const response = await fetch(`https://api.maptiler.com/geocoding/${encodeURIComponent(country)}.json?key=${API_KEY}&limit=1`);
    const data = await response.json();
    
    const newListing = new Listing({title, description, image, price, location, country});
    newListing.owner = req.user._id;
    newListing.image = { url, filename};
    newListing.geometry = data.features[0].geometry;
    await newListing.save();
    req.flash("sucess", "New Listing Created !!");
    console.log("Added successfully!!!");
    res.redirect("/listings");
}

module.exports.renderEditForm = async (req, res) => {
    let{id} = req.params;
    const list = await Listing.findById(id);
    if(!list){
        req.flash("error", "Listing you requested is not valid !!");
        return res.redirect("/listings");
    };
    let ogUrl = list.image.url;
    ogUrl = ogUrl.replace("/upload", "/upload/w_250");
    res.render("listings/edit.ejs", {list, ogUrl});
}

module.exports.editListing = async (req, res) => {
    let{id} = req.params;
    let{title, description, price, location, country} = req.body;
    const updatedList = {
        title, 
        description, 
        price,
        location,
        country,
    }
    let listing = await Listing.findByIdAndUpdate(id, updatedList);
    if(typeof req.file  != "undefined"){
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image = {url, filename};
        await listing.save();

    }
    console.log("Updated successfully!!!");
    req.flash("sucess", "Listing Updated !!");
    res.redirect(`/listings/${id}`);
}

module.exports.destroyListing = async (req, res) => {
    let {id} = req.params;
    await Listing.findByIdAndDelete(id);
    console.log("Deleted successfully!!!");
    req.flash("sucess", "Listing Deleted !!");
    res.redirect("/listings");
}