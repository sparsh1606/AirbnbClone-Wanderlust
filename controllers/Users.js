const User = require("../models/users.js");

module.exports.renderSignupForm = (req, res) => {
    res.render("users/userSignIn.ejs");
}

module.exports.signupUser = async(req, res) => {
    try{
        let {username, email, password} = req.body;
        const newUser = new User({
            email,
            username
        });
        const regUser = await User.register(newUser, password);
        req.login(regUser, (error) => {
            if(error) return next(error);
            req.flash("sucess", "Welcome to Wanderlust");
            res.redirect("/listings");
        });
        
    } catch(error){
        req.flash("error", error.message);
        res.redirect("/signup");
    }
}

module.exports.renderLoginForm = (req, res) => {
    res.render("users/userLogIn.ejs");
}

module.exports.loginUser = async(req, res) => {
    const savedUrl = res.locals.saveRedirectUrl || "/listings";
    req.flash("sucess", "Welcone back to Wanderlust");
    console.log(savedUrl);
    res.redirect(savedUrl);
}

module.exports.logoutUser = (req, res, next) => {
    req.logout((error) => {
        if(error) return next(error);
        req.flash("sucess", "You are logged out...");
        res.redirect("/listings");
    });
}