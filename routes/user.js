const express = require("express");
const router = express.Router({mergeParams: true});

const wrapAsync = require("../utils/wrapAsync.js")
const passport = require("passport");
const {saveRedirectUrl} = require("../middleware.js");

const userController = require("../controllers/Users.js");

// fakeuser
// router.get("/fakeuser", async(req, res) => {
//     const fakeuser = {
//         email: "abcc@gmail.com",
//         username: "acbc"
//     }
//     let reguser = await User.register(fakeuser, "helloword");
//     res.send(reguser);
// });

// signin form and create user
router.route("/signup")
    .get(userController.renderSignupForm)
    .post(wrapAsync(userController.signupUser));

// login form and create user
router.route("/login")
    .get(userController.renderLoginForm)
    .post(saveRedirectUrl, passport.authenticate("local", {failureFlash: true, failureRedirect: "/login"}), userController.loginUser);

// logout
router.get("/logout", userController.logoutUser);

module.exports = router;