const mongoose = require("mongoose");
const Listings = require("../models/listings");
const initData = require("./data");

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust"
main().then(() => {console.log("Database connected successfully...")}).catch((err) => {console.log(err)});
async function main() {
    await mongoose.connect(MONGO_URL);
}

let init = async () => {
    await Listings.deleteMany({});
    initData.data = initData.data.map((obj) => ({
        ...obj, 
        owner: "686e6f33ef4d872b44523365"
    }));
    await Listings.insertMany(initData.data);

    console.log("reinitialised");
}
init();