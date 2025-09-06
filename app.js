if(process.env.NODE_ENV != "production"){
    require('dotenv').config();
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js")
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStratergy = require("passport-local");
const User = require("./models/users.js");

const sessionOptions = {
    secret: "mysupersecretecode",
    resave: false,
    saveUninitialized: true,
    cookie:{
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge:  7 * 24 * 60 * 60 * 1000,
        httpOnly: true
    }
};
const listingRoute = require("./routes/listing.js");
const reviewRoute = require("./routes/review.js");
const userRoute = require("./routes/user.js");


const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust"
main().then(() => {console.log("Database connected successfully...")}).catch((err) => {console.log(err)});
async function main() {
    await mongoose.connect(MONGO_URL);
}


app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "/public")));
app.engine("ejs", ejsMate);

app.use(session(sessionOptions));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStratergy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use((req, res, next) => {
    res.locals.sucess = req.flash("sucess");
    res.locals.error = req.flash("error");
    res.locals.currentUser = req.user;
    next();
});


// Listing
app.use("/listings", listingRoute);
// Review
app.use("/listings/:id/reviews", reviewRoute);
// User
app.use("/", userRoute);


// app.get("/testing", async (req, res) => {
//     let newlist = new Listing({
//         title: "my home",
//       description:
//         "sweet homne",
//       price: 2800,
//       location: "delhi",
//       country: "india",
//     })
//     await newlist.save();
// });


// app.use("*", (req, res, next) => {
//     next(new ExpressError(404, "Page Not Found!"));
// });

app.use((err, req, res, next) => {
    let{statusCode = 500, message = "Something went wrong!!!"} = err;
    res.status(statusCode).render("listings/error.ejs", {message});
});

app.listen(8080, () => {console.log("Server is listening!!!")});